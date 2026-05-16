import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redis: Redis | null = null;

export const initRedis = async (): Promise<boolean> => {
  if (!env.REDIS_ENABLED) {
    logger.info('Redis disabled (REDIS_ENABLED=false) — real-time uses Socket.IO only');
    return false;
  }

  try {
    redis = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      connectTimeout: 5000,
    });

    await redis.connect();
    await redis.ping();
    logger.info('Redis connected successfully');
    return true;
  } catch (error) {
    logger.warn('Redis unavailable — background jobs disabled. Real-time still works via Socket.IO.');
    redis?.disconnect();
    redis = null;
    return false;
  }
};

export const getRedis = (): Redis | null => redis;

export const getRedisConnection = () => ({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
});
