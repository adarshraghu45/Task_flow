export type WorkspaceRole = 'owner' | 'admin' | 'manager' | 'member';

export const WORKSPACE_ROLES: WorkspaceRole[] = ['owner', 'admin', 'manager', 'member'];

export const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  manager: 2,
  member: 1,
};
