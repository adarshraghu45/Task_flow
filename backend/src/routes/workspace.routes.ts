import { Router } from 'express';
import { WorkspaceController } from '../controllers/workspace.controller.js';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  resolveWorkspace,
  requireWorkspaceMember,
  requirePermission,
} from '../middleware/workspace.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
} from '../validators/workspace.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), WorkspaceController.create);
router.get('/', WorkspaceController.list);

const wsRouter = Router({ mergeParams: true });
wsRouter.use(resolveWorkspace('workspaceId'), requireWorkspaceMember);

wsRouter.get('/dashboard', DashboardController.getDashboard);
wsRouter.get('/', WorkspaceController.getOne);
wsRouter.patch('/', requirePermission('workspace:settings'), validate(updateWorkspaceSchema), WorkspaceController.update);
wsRouter.delete('/', requirePermission('workspace:delete'), WorkspaceController.remove);
wsRouter.get('/members', WorkspaceController.getMembers);
wsRouter.post('/members/invite', requirePermission('members:invite'), validate(inviteMemberSchema), WorkspaceController.invite);
wsRouter.patch('/members/:memberId', requirePermission('members:role'), validate(updateMemberRoleSchema), WorkspaceController.updateMemberRole);
wsRouter.delete('/members/:memberId', requirePermission('members:remove'), WorkspaceController.removeMember);
wsRouter.get('/activity', WorkspaceController.getActivity);

router.use('/:workspaceId', wsRouter);

export default router;
