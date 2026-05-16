import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { initRedis } from './config/redis.js';
import { initSocket } from './socket/index.js';
import { startWorkers } from './jobs/index.js';
import { logger } from './utils/logger.js';

const bootstrap = async () => {
  await connectDatabase();

  const redisReady = await initRedis();
  if (redisReady) {
    startWorkers();
  }

  const app = createApp();
  const httpServer = http.createServer(app);

  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    logger.info(`TaskFlow Manager API running on port ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`API: http://localhost:${env.PORT}${env.API_PREFIX}`);
    logger.info(`WebSocket: ws://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
};

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
