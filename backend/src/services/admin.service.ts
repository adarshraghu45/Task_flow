import bcrypt from 'bcryptjs';
import type { Request } from 'express';
import { User } from '../models/User.model.js';
import { Workspace } from '../models/Workspace.model.js';
import { Task } from '../models/Task.model.js';
import { WorkspaceMember } from '../models/WorkspaceMember.model.js';
import { Report } from '../models/Report.model.js';
import { RefreshToken } from '../models/RefreshToken.model.js';
import {
  PlatformSettings,
  DEFAULT_PLATFORM_SETTINGS,
} from '../models/PlatformSettings.model.js';
import { ApiError } from '../utils/ApiError.js';
import { AdminAuditService } from './adminAudit.service.js';
import type { AdminRole } from '../types/admin.types.js';

const serializeUser = (u: Record<string, unknown>) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  role: u.role,
  adminRole: u.adminRole,
  isActive: u.isActive,
  isEmailVerified: u.isEmailVerified,
  suspendedAt: u.suspendedAt,
  lastSeenAt: u.lastSeenAt,
  createdAt: u.createdAt,
});

export class AdminService {
  static async listUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.role) filter.role = query.role;
    if (query.status === 'active') filter.isActive = true;
    if (query.status === 'suspended') filter.isActive = false;

    const sort: Record<string, 1 | -1> = {
      [query.sortBy || 'createdAt']: query.sortOrder === 'asc' ? 1 : -1,
    };

    const [items, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit).select('-password').lean(),
      User.countDocuments(filter),
    ]);

    return {
      items: items.map((u) => serializeUser(u as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUser(userId: string) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw new ApiError(404, 'User not found');
    const [workspaceCount, taskCount, sessions] = await Promise.all([
      WorkspaceMember.countDocuments({ userId }),
      Task.countDocuments({ $or: [{ assigneeId: userId }, { createdBy: userId }] }),
      RefreshToken.countDocuments({ userId, expiresAt: { $gt: new Date() } }),
    ]);
    return {
      user: serializeUser(user as Record<string, unknown>),
      stats: { workspaceCount, taskCount, activeSessions: sessions },
    };
  }

  static async updateUser(
    adminId: string,
    userId: string,
    data: {
      name?: string;
      role?: 'user' | 'admin';
      adminRole?: AdminRole | null;
      isActive?: boolean;
      isEmailVerified?: boolean;
    },
    req: Request,
  ) {
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    await AdminAuditService.log(adminId, 'update_user', 'user', userId, data, req);
    return serializeUser(user.toObject() as unknown as Record<string, unknown>);
  }

  static async suspendUser(adminId: string, userId: string, reason: string, req: Request) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false, suspendedAt: new Date(), suspendReason: reason },
      { new: true },
    ).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    await RefreshToken.deleteMany({ userId });
    await AdminAuditService.log(adminId, 'suspend_user', 'user', userId, { reason }, req);
    return serializeUser(user.toObject() as unknown as Record<string, unknown>);
  }

  static async deleteUser(adminId: string, userId: string, req: Request) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new ApiError(404, 'User not found');
    await RefreshToken.deleteMany({ userId });
    await AdminAuditService.log(adminId, 'delete_user', 'user', userId, {}, req);
    return { deleted: true };
  }

  static async resetUserPassword(adminId: string, userId: string, password: string, req: Request) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    await RefreshToken.deleteMany({ userId });
    await AdminAuditService.log(adminId, 'reset_password', 'user', userId, {}, req);
    return { success: true };
  }

  static async listWorkspaces(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (query.search) filter.name = { $regex: query.search, $options: 'i' };
    if (query.status === 'suspended') filter.isSuspended = true;

    const [items, total] = await Promise.all([
      Workspace.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Workspace.countDocuments(filter),
    ]);

    const enriched = await Promise.all(
      items.map(async (w) => {
        const [memberCount, taskCount] = await Promise.all([
          WorkspaceMember.countDocuments({ workspaceId: w._id }),
          Task.countDocuments({ workspaceId: w._id }),
        ]);
        return {
          id: String(w._id),
          name: w.name,
          slug: w.slug,
          description: w.description,
          ownerId: String(w.ownerId),
          isSuspended: (w as { isSuspended?: boolean }).isSuspended ?? false,
          createdAt: w.createdAt,
          memberCount,
          taskCount,
        };
      }),
    );

    return { items: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async suspendWorkspace(adminId: string, workspaceId: string, req: Request) {
    const ws = await Workspace.findByIdAndUpdate(
      workspaceId,
      { isSuspended: true },
      { new: true },
    );
    if (!ws) throw new ApiError(404, 'Workspace not found');
    await AdminAuditService.log(adminId, 'suspend_workspace', 'workspace', workspaceId, {}, req);
    return { id: String(ws._id), isSuspended: true };
  }

  static async deleteWorkspace(adminId: string, workspaceId: string, req: Request) {
    const ws = await Workspace.findByIdAndDelete(workspaceId);
    if (!ws) throw new ApiError(404, 'Workspace not found');
    await Task.deleteMany({ workspaceId });
    await WorkspaceMember.deleteMany({ workspaceId });
    await AdminAuditService.log(adminId, 'delete_workspace', 'workspace', workspaceId, {}, req);
    return { deleted: true };
  }

  static async listTasks(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (query.search) filter.title = { $regex: query.search, $options: 'i' };
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    const [items, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Task.countDocuments(filter),
    ]);

    return {
      items: items.map((t) => ({
        id: String(t._id),
        title: t.title,
        status: t.status,
        priority: t.priority,
        workspaceId: String(t.workspaceId),
        assigneeId: t.assigneeId ? String(t.assigneeId) : null,
        dueDate: t.dueDate,
        createdAt: t.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async deleteTask(adminId: string, taskId: string, req: Request) {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw new ApiError(404, 'Task not found');
    await AdminAuditService.log(adminId, 'delete_task', 'task', taskId, {}, req);
    return { deleted: true };
  }

  static async listReports(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;

    const [items, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reporterId', 'name email')
        .populate('reportedUserId', 'name email')
        .lean(),
      Report.countDocuments(filter),
    ]);

    return {
      items: items.map((r) => ({
        id: String(r._id),
        type: r.type,
        status: r.status,
        reason: r.reason,
        description: r.description,
        reporter: r.reporterId,
        reportedUser: r.reportedUserId,
        createdAt: r.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async resolveReport(
    adminId: string,
    reportId: string,
    data: { status: string; resolution?: string },
    req: Request,
  ) {
    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status: data.status,
        resolution: data.resolution,
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
      { new: true },
    );
    if (!report) throw new ApiError(404, 'Report not found');
    await AdminAuditService.log(adminId, 'resolve_report', 'report', reportId, data, req);
    return report;
  }

  static async getSettings() {
    let doc = await PlatformSettings.findOne({ key: 'platform' });
    if (!doc) {
      doc = await PlatformSettings.create({ key: 'platform', value: DEFAULT_PLATFORM_SETTINGS });
    }
    return doc.value;
  }

  static async updateSettings(adminId: string, value: Record<string, unknown>, req: Request) {
    const doc = await PlatformSettings.findOneAndUpdate(
      { key: 'platform' },
      { value },
      { upsert: true, new: true },
    );
    await AdminAuditService.log(adminId, 'update_settings', 'settings', 'platform', {}, req);
    return doc.value;
  }

  static async revokeUserSessions(adminId: string, userId: string, req: Request) {
    await RefreshToken.deleteMany({ userId });
    await AdminAuditService.log(adminId, 'revoke_sessions', 'user', userId, {}, req);
    return { success: true };
  }
}
