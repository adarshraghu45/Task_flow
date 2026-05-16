import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlatformAdmin, requireAdminPermission } from '../middleware/admin.middleware.js';
import { validate, validateQuery } from '../middleware/validate.middleware.js';
import { AdminController } from '../controllers/admin.controller.js';
import {
  userListSchema,
  updateUserSchema,
  suspendUserSchema,
  resetPasswordSchema,
  workspaceListSchema,
  taskListSchema,
  reportListSchema,
  resolveReportSchema,
  broadcastSchema,
} from '../validators/admin.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAdmin);

router.get('/me', AdminController.getMe);
router.get('/dashboard', requireAdminPermission('view_analytics'), AdminController.getDashboard);
router.get('/health', requireAdminPermission('view_monitoring'), AdminController.getSystemHealth);

router.get('/users', requireAdminPermission('manage_users'), validateQuery(userListSchema), AdminController.listUsers);
router.get('/users/:userId', requireAdminPermission('manage_users'), AdminController.getUser);
router.patch('/users/:userId', requireAdminPermission('manage_users'), validate(updateUserSchema), AdminController.updateUser);
router.post('/users/:userId/suspend', requireAdminPermission('manage_users'), validate(suspendUserSchema), AdminController.suspendUser);
router.delete('/users/:userId', requireAdminPermission('manage_users'), AdminController.deleteUser);
router.post('/users/:userId/reset-password', requireAdminPermission('manage_users'), validate(resetPasswordSchema), AdminController.resetPassword);
router.post('/users/:userId/revoke-sessions', requireAdminPermission('manage_users'), AdminController.revokeSessions);

router.get('/workspaces', requireAdminPermission('manage_workspaces'), validateQuery(workspaceListSchema), AdminController.listWorkspaces);
router.post('/workspaces/:workspaceId/suspend', requireAdminPermission('manage_workspaces'), AdminController.suspendWorkspace);
router.delete('/workspaces/:workspaceId', requireAdminPermission('manage_workspaces'), AdminController.deleteWorkspace);

router.get('/tasks', requireAdminPermission('manage_tasks'), validateQuery(taskListSchema), AdminController.listTasks);
router.delete('/tasks/:taskId', requireAdminPermission('manage_tasks'), AdminController.deleteTask);

router.get('/reports', requireAdminPermission('manage_reports'), validateQuery(reportListSchema), AdminController.listReports);
router.patch('/reports/:reportId', requireAdminPermission('manage_reports'), validate(resolveReportSchema), AdminController.resolveReport);

router.get('/audit-logs', requireAdminPermission('view_logs'), AdminController.listAuditLogs);

router.get('/settings', requireAdminPermission('manage_settings'), AdminController.getSettings);
router.patch('/settings', requireAdminPermission('manage_settings'), AdminController.updateSettings);

router.post('/notifications/broadcast', requireAdminPermission('manage_notifications'), validate(broadcastSchema), AdminController.broadcast);

export default router;
