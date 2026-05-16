export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support_staff';

export type AdminPermission =
  | 'manage_users'
  | 'manage_workspaces'
  | 'manage_tasks'
  | 'manage_subscriptions'
  | 'view_analytics'
  | 'view_logs'
  | 'manage_reports'
  | 'manage_ai'
  | 'manage_settings'
  | 'manage_notifications'
  | 'view_monitoring';

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'manage_users',
    'manage_workspaces',
    'manage_tasks',
    'manage_subscriptions',
    'view_analytics',
    'view_logs',
    'manage_reports',
    'manage_ai',
    'manage_settings',
    'manage_notifications',
    'view_monitoring',
  ],
  admin: [
    'manage_users',
    'manage_workspaces',
    'manage_tasks',
    'manage_subscriptions',
    'view_analytics',
    'view_logs',
    'manage_reports',
    'manage_ai',
    'manage_notifications',
    'view_monitoring',
  ],
  moderator: [
    'manage_users',
    'manage_workspaces',
    'manage_tasks',
    'view_analytics',
    'manage_reports',
    'view_monitoring',
  ],
  support_staff: ['manage_users', 'view_analytics', 'manage_reports', 'view_monitoring'],
};
