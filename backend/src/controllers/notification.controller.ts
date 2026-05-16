import type { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';

export class NotificationController {
  static list = asyncHandler(async (req: Request, res: Response) => {
    const unreadOnly = req.query.unreadOnly === 'true';
    const notifications = await NotificationService.list(req.user!.userId, { unreadOnly });
    const unreadCount = await NotificationService.getUnreadCount(req.user!.userId);
    res.json({ success: true, message: 'Notifications retrieved', data: { notifications, unreadCount } });
  });

  static markRead = asyncHandler(async (req: Request, res: Response) => {
    const notification = await NotificationService.markRead(req.user!.userId, param(req.params.id));
    res.json({ success: true, message: 'Notification marked as read', data: { notification } });
  });

  static markAllRead = asyncHandler(async (req: Request, res: Response) => {
    await NotificationService.markAllRead(req.user!.userId);
    res.json({ success: true, message: 'All notifications marked as read', data: null });
  });
}
