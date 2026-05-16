import { Queue } from 'bullmq';
import { getRedis } from '../config/redis.js';
import { getRedisConnection } from '../config/redis.js';

export const QUEUE_NAMES = {
  EMAIL: 'email-queue',
  NOTIFICATION: 'notification-queue',
  TASK_REMINDER: 'task-reminder-queue',
} as const;

const connection = getRedisConnection();

export const createQueues = () => {
  if (!getRedis()) return null;

  return {
    emailQueue: new Queue(QUEUE_NAMES.EMAIL, { connection }),
    notificationQueue: new Queue(QUEUE_NAMES.NOTIFICATION, { connection }),
    taskReminderQueue: new Queue(QUEUE_NAMES.TASK_REMINDER, { connection }),
  };
};
