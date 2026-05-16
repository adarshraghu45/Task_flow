import { getRedis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export const startWorkers = async (): Promise<void> => {
  if (!getRedis()) {
    return;
  }

  const { emailWorker } = await import('./workers/email.worker.js');
  const { notificationWorker } = await import('./workers/notification.worker.js');
  logger.info('BullMQ workers started');
  void emailWorker;
  void notificationWorker;
};
