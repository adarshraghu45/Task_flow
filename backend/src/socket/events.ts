import { emitToUser } from './io.js';

export const SOCKET_EVENTS = {
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  STATS_UPDATED: 'stats:updated',
} as const;

export const emitTaskCreated = (userId: string, task: unknown) => {
  emitToUser(userId, SOCKET_EVENTS.TASK_CREATED, { task });
};

export const emitTaskUpdated = (userId: string, task: unknown) => {
  emitToUser(userId, SOCKET_EVENTS.TASK_UPDATED, { task });
};

export const emitTaskDeleted = (userId: string, taskId: string) => {
  emitToUser(userId, SOCKET_EVENTS.TASK_DELETED, { taskId });
};

export const emitStatsUpdated = (userId: string, stats: unknown) => {
  emitToUser(userId, SOCKET_EVENTS.STATS_UPDATED, { stats });
};
