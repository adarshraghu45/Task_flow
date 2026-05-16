import { Worker, type Job } from 'bullmq';
import { getRedisConnection } from '../../config/redis.js';
import { QUEUE_NAMES } from '../queues.js';
import { logger } from '../../utils/logger.js';

interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

const processEmailJob = async (job: Job<EmailJobData>) => {
  logger.info(`Processing email job ${job.id} for ${job.data.to}`);
  // Integrate with email provider (SendGrid, SES, etc.)
};

export const emailWorker = new Worker<EmailJobData>(QUEUE_NAMES.EMAIL, processEmailJob, {
  connection: getRedisConnection(),
});

emailWorker.on('completed', (job) => {
  logger.info(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job ${job?.id} failed:`, err);
});
