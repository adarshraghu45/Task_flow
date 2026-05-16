import { Notification } from '../models/Notification.model.js';
import { emitToUser } from '../socket/io.js';
import type { NotificationType } from '../models/Notification.model.js';

export class NotificationService {
  static async create(data: {
    userId: string;
    workspaceId?: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, unknown>;
  }) {
    const notification = await Notification.create(data);
    const payload = {
      id: notification._id.toString(),
      ...data,
      isRead: false,
      createdAt: notification.createdAt,
    };
    emitToUser(data.userId, 'notification:new', { notification: payload });
    return payload;
  }

  static async list(userId: string, filters: { unreadOnly?: boolean; limit?: number } = {}) {
    const query: Record<string, unknown> = { userId };
    if (filters.unreadOnly) query.isRead = false;
    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .lean();
  }

  static async markRead(userId: string, notificationId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true },
    );
  }

  static async markAllRead(userId: string) {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  }

  static async getUnreadCount(userId: string) {
    return Notification.countDocuments({ userId, isRead: false });
  }
}
