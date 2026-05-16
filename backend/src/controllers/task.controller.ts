import type { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';

export class TaskController {
  static getTasks = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = param(req.params.workspaceId);
    const result = await TaskService.getTasks(workspaceId, req.query as never);
    res.json({ success: true, message: 'Tasks retrieved', data: result });
  });

  static getKanban = asyncHandler(async (req: Request, res: Response) => {
    const board = await TaskService.getKanban(param(req.params.workspaceId));
    res.json({ success: true, message: 'Kanban board retrieved', data: { board } });
  });

  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await TaskService.getStats(param(req.params.workspaceId));
    res.json({ success: true, message: 'Stats retrieved', data: { stats } });
  });

  static createTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.createTask(param(req.params.workspaceId), req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Task created', data: { task } });
  });

  static updateTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.updateTask(
      param(req.params.workspaceId),
      param(req.params.taskId),
      req.user!.userId,
      req.body,
    );
    res.json({ success: true, message: 'Task updated', data: { task } });
  });

  static deleteTask = asyncHandler(async (req: Request, res: Response) => {
    await TaskService.deleteTask(param(req.params.workspaceId), param(req.params.taskId), req.user!.userId);
    res.json({ success: true, message: 'Task deleted', data: null });
  });

  static reorder = asyncHandler(async (req: Request, res: Response) => {
    const board = await TaskService.reorderTasks(param(req.params.workspaceId), req.user!.userId, req.body.items);
    res.json({ success: true, message: 'Tasks reordered', data: { board } });
  });

  static addComment = asyncHandler(async (req: Request, res: Response) => {
    const comment = await TaskService.addComment(
      param(req.params.workspaceId),
      param(req.params.taskId),
      req.user!.userId,
      req.body.content,
    );
    res.status(201).json({ success: true, message: 'Comment added', data: { comment } });
  });

  static getComments = asyncHandler(async (req: Request, res: Response) => {
    const comments = await TaskService.getComments(param(req.params.taskId));
    res.json({ success: true, message: 'Comments retrieved', data: { comments } });
  });
}
