import { ActivityLog } from '../models/ActivityLog.model.js';
import type { Types } from 'mongoose';

export class ActivityService {
  static async log(
    workspaceId: string | Types.ObjectId,
    userId: string,
    action: string,
    entityType: 'task' | 'workspace' | 'member' | 'comment',
    entityId?: string,
    metadata?: Record<string, unknown>,
  ) {
    return ActivityLog.create({
      workspaceId,
      userId,
      action,
      entityType,
      entityId,
      metadata,
    });
  }

  static async getWorkspaceActivity(workspaceId: string, limit = 50) {
    return ActivityLog.find({ workspaceId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email avatar')
      .lean();
  }
}
