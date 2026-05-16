import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { AdminAnalyticsService } from '../services/adminAnalytics.service.js';
import { AdminAuditService } from '../services/adminAudit.service.js';
import { NotificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';
import { User } from '../models/User.model.js';

export class AdminController {
  static getDashboard = asyncHandler(async (_req: Request, res: Response) => {
    const dashboard = await AdminAnalyticsService.getDashboard();
    res.json({ success: true, message: 'Dashboard retrieved', data: { dashboard } });
  });

  static getSystemHealth = asyncHandler(async (_req: Request, res: Response) => {
    const health = await AdminAnalyticsService.getSystemHealth();
    res.json({ success: true, message: 'System health retrieved', data: { health } });
  });

  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!.userId).select('-password').lean();
    res.json({ success: true, data: { admin: user } });
  });

  static listUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.listUsers(req.query as never);
    res.json({ success: true, message: 'Users retrieved', data: result });
  });

  static getUser = asyncHandler(async (req: Request, res: Response) => {
    const data = await AdminService.getUser(param(req.params.userId));
    res.json({ success: true, data });
  });

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await AdminService.updateUser(
      req.user!.userId,
      param(req.params.userId),
      req.body,
      req,
    );
    res.json({ success: true, message: 'User updated', data: { user } });
  });

  static suspendUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await AdminService.suspendUser(
      req.user!.userId,
      param(req.params.userId),
      req.body.reason,
      req,
    );
    res.json({ success: true, message: 'User suspended', data: { user } });
  });

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteUser(req.user!.userId, param(req.params.userId), req);
    res.json({ success: true, message: 'User deleted', data: null });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.resetUserPassword(
      req.user!.userId,
      param(req.params.userId),
      req.body.password,
      req,
    );
    res.json({ success: true, message: 'Password reset', data: null });
  });

  static revokeSessions = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.revokeUserSessions(req.user!.userId, param(req.params.userId), req);
    res.json({ success: true, message: 'Sessions revoked', data: null });
  });

  static listWorkspaces = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.listWorkspaces(req.query as never);
    res.json({ success: true, message: 'Workspaces retrieved', data: result });
  });

  static suspendWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const ws = await AdminService.suspendWorkspace(req.user!.userId, param(req.params.workspaceId), req);
    res.json({ success: true, message: 'Workspace suspended', data: { workspace: ws } });
  });

  static deleteWorkspace = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteWorkspace(req.user!.userId, param(req.params.workspaceId), req);
    res.json({ success: true, message: 'Workspace deleted', data: null });
  });

  static listTasks = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.listTasks(req.query as never);
    res.json({ success: true, message: 'Tasks retrieved', data: result });
  });

  static deleteTask = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteTask(req.user!.userId, param(req.params.taskId), req);
    res.json({ success: true, message: 'Task deleted', data: null });
  });

  static listReports = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.listReports(req.query as never);
    res.json({ success: true, message: 'Reports retrieved', data: result });
  });

  static resolveReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await AdminService.resolveReport(
      req.user!.userId,
      param(req.params.reportId),
      req.body,
      req,
    );
    res.json({ success: true, message: 'Report updated', data: { report } });
  });

  static listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await AdminAuditService.list(page, limit);
    res.json({ success: true, message: 'Audit logs retrieved', data: result });
  });

  static getSettings = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await AdminService.getSettings();
    res.json({ success: true, data: { settings } });
  });

  static updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await AdminService.updateSettings(req.user!.userId, req.body, req);
    res.json({ success: true, message: 'Settings updated', data: { settings } });
  });

  static broadcast = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({ isActive: true }).select('_id');
    await Promise.all(
      users.map((u) =>
        NotificationService.create({
          userId: u._id.toString(),
          type: 'announcement',
          title: req.body.title,
          message: req.body.message,
          link: '/dashboard',
        }),
      ),
    );
    res.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      data: { count: users.length },
    });
  });
}
