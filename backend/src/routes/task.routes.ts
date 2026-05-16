import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  resolveWorkspace,
  requireWorkspaceMember,
  requirePermission,
} from '../middleware/workspace.middleware.js';
import { validate, validateQuery } from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  reorderSchema,
  commentSchema,
} from '../validators/task.validator.js';

const router = Router({ mergeParams: true });

router.use(authenticate, resolveWorkspace('workspaceId'), requireWorkspaceMember);

router.get('/', validateQuery(taskQuerySchema), TaskController.getTasks);
router.get('/kanban', TaskController.getKanban);
router.get('/stats', TaskController.getStats);
router.post('/', requirePermission('tasks:create'), validate(createTaskSchema), TaskController.createTask);
router.patch('/reorder', validate(reorderSchema), TaskController.reorder);
router.patch('/:taskId', requirePermission('tasks:edit'), validate(updateTaskSchema), TaskController.updateTask);
router.delete('/:taskId', requirePermission('tasks:delete'), TaskController.deleteTask);
router.get('/:taskId/comments', TaskController.getComments);
router.post('/:taskId/comments', validate(commentSchema), TaskController.addComment);

export default router;
