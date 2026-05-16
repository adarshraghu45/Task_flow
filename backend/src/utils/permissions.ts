import type { WorkspaceRole } from '../types/workspace.types.js';
import { ROLE_HIERARCHY } from '../types/workspace.types.js';

export type Permission =
  | 'workspace:delete'
  | 'workspace:settings'
  | 'members:invite'
  | 'members:remove'
  | 'members:role'
  | 'tasks:create'
  | 'tasks:edit'
  | 'tasks:delete'
  | 'tasks:assign'
  | 'analytics:view'
  | 'chat:send';

const PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  owner: [
    'workspace:delete',
    'workspace:settings',
    'members:invite',
    'members:remove',
    'members:role',
    'tasks:create',
    'tasks:edit',
    'tasks:delete',
    'tasks:assign',
    'analytics:view',
    'chat:send',
  ],
  admin: [
    'workspace:settings',
    'members:invite',
    'members:remove',
    'members:role',
    'tasks:create',
    'tasks:edit',
    'tasks:delete',
    'tasks:assign',
    'analytics:view',
    'chat:send',
  ],
  manager: [
    'members:invite',
    'tasks:create',
    'tasks:edit',
    'tasks:delete',
    'tasks:assign',
    'analytics:view',
    'chat:send',
  ],
  member: ['tasks:create', 'tasks:edit', 'tasks:delete', 'chat:send'],
};

export const hasPermission = (role: WorkspaceRole, permission: Permission): boolean => {
  return PERMISSIONS[role]?.includes(permission) ?? false;
};

export const canManageRole = (actorRole: WorkspaceRole, targetRole: WorkspaceRole): boolean => {
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
};
