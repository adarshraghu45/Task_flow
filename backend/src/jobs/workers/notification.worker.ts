import { Worker, type Job } from 'bullmq';
import { getRedisConnection } from '../../config/redis.js';
import { QUEUE_NAMES } from '../queues.js';
import { logger } from '../../utils/logger.js';

interface NotificationJobData {
  userId: string;
  type: string;
  message: string;
}

const processNotificationJob = async (job: Job<NotificationJobData>) => {
  logger.info(`Processing notification for user ${job.data.userId}: ${job.data.message}`);
};

export const notificationWorker = new Worker<NotificationJobData>(
  QUEUE_NAMES.NOTIFICATION,
  processNotificationJob,
  { connection: getRedisConnection() },
);

notificationWorker.on('completed', (job) => {
  logger.info(`Notification job ${job.id} completed`);
});
