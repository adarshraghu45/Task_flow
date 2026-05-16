import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { setIO } from './io.js';
import { Message } from '../models/Message.model.js';
import { User } from '../models/User.model.js';

export const initSocket = (httpServer: HttpServer) => {
  const corsOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
      credentials: true,
    },
  });

  setIO(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.data.user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.user?.userId as string;
    logger.info(`Socket connected: ${socket.id} (user: ${userId})`);

    socket.join(`user:${userId}`);
    await User.findByIdAndUpdate(userId, { lastSeenAt: new Date() });
    io.emit('presence:online', { userId });

    socket.on('workspace:join', (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
      socket.data.workspaceId = workspaceId;
      socket.to(`workspace:${workspaceId}`).emit('presence:joined', { userId, workspaceId });
    });

    socket.on('workspace:leave', (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`);
      socket.to(`workspace:${workspaceId}`).emit('presence:left', { userId, workspaceId });
    });

    socket.on('chat:typing', ({ workspaceId, isTyping }: { workspaceId: string; isTyping: boolean }) => {
      socket.to(`workspace:${workspaceId}`).emit('chat:typing', { userId, isTyping });
    });

    socket.on(
      'chat:message',
      async (data: { workspaceId: string; content: string; channelType?: 'workspace' | 'direct'; recipientId?: string }) => {
        const message = await Message.create({
          workspaceId: data.workspaceId,
          channelType: data.channelType || 'workspace',
          senderId: userId,
          recipientId: data.recipientId,
          content: data.content,
        });
        const populated = await Message.findById(message._id)
          .populate('senderId', 'name email avatar')
          .lean();
        const room = data.channelType === 'direct' && data.recipientId
          ? `user:${data.recipientId}`
          : `workspace:${data.workspaceId}`;
        io.to(room).to(`workspace:${data.workspaceId}`).emit('chat:message', { message: populated });
      },
    );

    socket.on('chat:reaction', async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $push: { reactions: { emoji, userId } } },
        { new: true },
      );
      if (message?.workspaceId) {
        io.to(`workspace:${message.workspaceId}`).emit('chat:reaction', { messageId, emoji, userId });
      }
    });

    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      io.emit('presence:offline', { userId });
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};
