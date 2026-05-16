export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TaskFlow Manager';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
export const THEME_STORAGE_KEY = 'taskflow-theme';
export const AUTH_TOKEN_KEY = 'taskflow-auth-token';
export const AUTH_USER_KEY = 'taskflow-auth-user';
export const WORKSPACE_STORAGE_KEY = 'taskflow-current-workspace';

/** Default admin login — keep in sync with backend ADMIN_EMAIL / ADMIN_PASSWORD */
export const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@taskflow.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@12345',
};

export const QUERY_KEYS = {
  tasks: ['tasks'] as const,
  stats: ['task-stats'] as const,
  me: ['me'] as const,
};

export const SOCKET_EVENTS = {
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_REORDERED: 'task:reordered',
  NOTIFICATION_NEW: 'notification:new',
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',
} as const;
