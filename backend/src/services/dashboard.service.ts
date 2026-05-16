import mongoose from 'mongoose';
import { Task } from '../models/Task.model.js';
import { WorkspaceMember } from '../models/WorkspaceMember.model.js';

export class DashboardService {
  static async getDashboard(workspaceId: string, userId: string) {
    const wsId = new mongoose.Types.ObjectId(workspaceId);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const [
      statusBreakdown,
      priorityBreakdown,
      overdueTasks,
      recentTasks,
      myTasksCount,
      completedCount,
      overdueCount,
      dueTodayCount,
      memberCount,
    ] = await Promise.all([
      Task.aggregate([
        { $match: { workspaceId: wsId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { workspaceId: wsId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.find({
        workspaceId: wsId,
        dueDate: { $lt: now },
        status: { $ne: 'done' },
      })
        .sort({ dueDate: 1 })
        .limit(5)
        .lean(),
      Task.find({ workspaceId: wsId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      Task.countDocuments({ workspaceId: wsId, assigneeId: userId }),
      Task.countDocuments({ workspaceId: wsId, status: 'done' }),
      Task.countDocuments({
        workspaceId: wsId,
        dueDate: { $lt: now },
        status: { $ne: 'done' },
      }),
      Task.countDocuments({
        workspaceId: wsId,
        dueDate: { $gte: startOfDay, $lt: endOfDay },
        status: { $ne: 'done' },
      }),
      WorkspaceMember.countDocuments({ workspaceId: wsId }),
    ]);

    const status = { todo: 0, in_progress: 0, review: 0, done: 0, total: 0 };
    statusBreakdown.forEach((r: { _id: string; count: number }) => {
      status.total += r.count;
      if (r._id in status) (status as Record<string, number>)[r._id] = r.count;
    });

    const mapTask = (t: Record<string, unknown>) => ({
      id: String(t._id),
      title: t.title,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      labels: t.labels || [],
    });

    return {
      summary: {
        projects: 1,
        myTasks: myTasksCount,
        completed: completedCount,
        overdue: overdueCount,
        dueToday: dueTodayCount,
        members: memberCount,
        ...status,
      },
      statusBreakdown,
      priorityBreakdown,
      overdueTasks: overdueTasks.map((t) => mapTask(t as Record<string, unknown>)),
      recentTasks: recentTasks.map((t) => mapTask(t as Record<string, unknown>)),
    };
  }
}
