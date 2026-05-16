import type { Server } from 'socket.io';

let io: Server | null = null;

export const setIO = (server: Server): void => {
  io = server;
};

export const getIO = (): Server | null => io;

export const emitToUser = (userId: string, event: string, payload: unknown): void => {
  io?.to(`user:${userId}`).emit(event, payload);
};

export const emitToWorkspace = (workspaceId: string, event: string, payload: unknown): void => {
  io?.to(`workspace:${workspaceId}`).emit(event, payload);
};
