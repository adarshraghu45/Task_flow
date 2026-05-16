import mongoose from 'mongoose';
import { Task, type TaskStatus } from '../models/Task.model.js';
import { TaskComment } from '../models/TaskComment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ActivityService } from './activity.service.js';
import { NotificationService } from './notification.service.js';
import { emitToWorkspace } from '../socket/io.js';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator.js';

const serializeAssignee = (assignee: unknown) => {
  if (!assignee || typeof assignee !== 'object') return undefined;
  const a = assignee as Record<string, unknown>;
  return {
    id: String(a._id),
    name: a.name as string,
    email: a.email as string,
    avatar: a.avatar as string | undefined,
  };
};

const serializeTask = (task: Record<string, unknown>) => ({
  id: String(task._id),
  workspaceId: String(task.workspaceId),
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  labels: task.labels || [],
  assigneeId: task.assigneeId
    ? typeof task.assigneeId === 'object'
      ? String((task.assigneeId as Record<string, unknown>)._id)
      : String(task.assigneeId)
    : undefined,
  assignee: serializeAssignee(task.assigneeId),
  createdBy: String(task.createdBy),
  dueDate: task.dueDate,
  startDate: task.startDate,
  subtasks: task.subtasks || [],
  attachments: task.attachments || [],
  dependencies: (task.dependencies as unknown[])?.map(String) || [],
  recurring: task.recurring,
  kanbanOrder: task.kanbanOrder ?? 0,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export class TaskService {
  static async getTasks(workspaceId: string, query: TaskQueryInput) {
    const {
      page = 1,
      limit = 50,
      status,
      priority,
      search,
      assigneeId,
      label,
      sortBy = 'kanbanOrder',
      sortOrder = 'asc',
    } = query;

    const filter: Record<string, unknown> = { workspaceId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assigneeId) filter.assigneeId = assigneeId;
    if (label) filter.labels = label;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [items, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Task.countDocuments(filter),
    ]);

    return {
      items: items.map((t) => serializeTask(t as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getKanban(workspaceId: string) {
    const tasks = await Task.find({ workspaceId })
      .sort({ kanbanOrder: 1 })
      .populate('assigneeId', 'name email avatar')
      .lean();
    const columns: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
    return columns.reduce(
      (acc, status) => {
        acc[status] = tasks
          .filter((t) => t.status === status)
          .map((t) => serializeTask(t as Record<string, unknown>));
        return acc;
      },
      {} as Record<TaskStatus, ReturnType<typeof serializeTask>[]>,
    );
  }

  static async getStats(workspaceId: string) {
    const result = await Task.aggregate([
      { $match: { workspaceId: new mongoose.Types.ObjectId(workspaceId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = { total: 0, todo: 0, inProgress: 0, review: 0, done: 0 };
    result.forEach((r: { _id: string; count: number }) => {
      stats.total += r.count;
      if (r._id === 'todo') stats.todo = r.count;
      if (r._id === 'in_progress') stats.inProgress = r.count;
      if (r._id === 'review') stats.review = r.count;
      if (r._id === 'done') stats.done = r.count;
    });
    return stats;
  }

  static async createTask(workspaceId: string, userId: string, input: CreateTaskInput) {
    const maxOrder = await Task.findOne({ workspaceId, status: input.status || 'todo' })
      .sort({ kanbanOrder: -1 })
      .select('kanbanOrder');
    const task = await Task.create({
      ...input,
      workspaceId,
      createdBy: userId,
      kanbanOrder: (maxOrder?.kanbanOrder ?? 0) + 1,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
    });
    const serialized = serializeTask(task.toObject() as unknown as Record<string, unknown>);
    await ActivityService.log(workspaceId, userId, 'created task', 'task', task._id.toString(), {
      title: task.title,
    });
    if (input.assigneeId && input.assigneeId !== userId) {
      await NotificationService.create({
        userId: input.assigneeId,
        workspaceId,
        type: 'task_assigned',
        title: 'Task assigned',
        message: `You were assigned: ${task.title}`,
        link: `/tasks`,
      });
    }
    emitToWorkspace(workspaceId, 'task:created', { task: serialized });
    return serialized;
  }

  static async updateTask(
    workspaceId: string,
    taskId: string,
    userId: string,
    input: UpdateTaskInput,
  ) {
    const update: Record<string, unknown> = { ...input };
    if (input.dueDate) update.dueDate = new Date(input.dueDate);
    if (input.startDate) update.startDate = new Date(input.startDate);

    const task = await Task.findOneAndUpdate({ _id: taskId, workspaceId }, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!task) throw new ApiError(404, 'Task not found');

    const serialized = serializeTask(task as Record<string, unknown>);
    await ActivityService.log(workspaceId, userId, 'updated task', 'task', taskId);
    emitToWorkspace(workspaceId, 'task:updated', { task: serialized });
    return serialized;
  }

  static async deleteTask(workspaceId: string, taskId: string, userId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, workspaceId });
    if (!task) throw new ApiError(404, 'Task not found');
    await TaskComment.deleteMany({ taskId });
    await ActivityService.log(workspaceId, userId, 'deleted task', 'task', taskId);
    emitToWorkspace(workspaceId, 'task:deleted', { taskId });
    return { taskId };
  }

  static async reorderTasks(
    workspaceId: string,
    userId: string,
    items: { id: string; status: TaskStatus; kanbanOrder: number }[],
  ) {
    await Promise.all(
      items.map((item) =>
        Task.updateOne(
          { _id: item.id, workspaceId },
          { status: item.status, kanbanOrder: item.kanbanOrder },
        ),
      ),
    );
    const board = await this.getKanban(workspaceId);
    emitToWorkspace(workspaceId, 'task:reordered', { board });
    await ActivityService.log(workspaceId, userId, 'reordered tasks', 'task');
    return board;
  }

  static async addComment(workspaceId: string, taskId: string, userId: string, content: string) {
    const comment = await TaskComment.create({ taskId, workspaceId, userId, content });
    const populated = await TaskComment.findById(comment._id)
      .populate('userId', 'name email avatar')
      .lean();
    emitToWorkspace(workspaceId, 'task:comment', { taskId, comment: populated });
    return populated;
  }

  static async getComments(taskId: string) {
    return TaskComment.find({ taskId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email avatar')
      .lean();
  }
}
