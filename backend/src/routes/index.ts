import { Router } from 'express';
import authRoutes from './auth.routes.js';
import workspaceRoutes from './workspace.routes.js';
import taskRoutes from './task.routes.js';
import { HealthController } from '../controllers/health.controller.js';
import { NotificationController } from '../controllers/notification.controller.js';
import { ChatController } from '../controllers/chat.controller.js';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  resolveWorkspace,
  requireWorkspaceMember,
  requirePermission,
} from '../middleware/workspace.middleware.js';

const router = Router();

router.get('/health', HealthController.check);
router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/workspaces/:workspaceId/tasks', taskRoutes);

router.get('/notifications', authenticate, NotificationController.list);
router.patch('/notifications/:id/read', authenticate, NotificationController.markRead);
router.patch('/notifications/read-all', authenticate, NotificationController.markAllRead);

router.get(
  '/workspaces/:workspaceId/chat',
  authenticate,
  resolveWorkspace('workspaceId'),
  requireWorkspaceMember,
  ChatController.getMessages,
);
router.get(
  '/workspaces/:workspaceId/chat/search',
  authenticate,
  resolveWorkspace('workspaceId'),
  requireWorkspaceMember,
  ChatController.search,
);

router.get(
  '/workspaces/:workspaceId/analytics',
  authenticate,
  resolveWorkspace('workspaceId'),
  requireWorkspaceMember,
  requirePermission('analytics:view'),
  AnalyticsController.workspace,
);

router.get('/admin/stats', authenticate, authorize('admin'), AnalyticsController.admin);

export default router;
