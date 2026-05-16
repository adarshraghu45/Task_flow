import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getRedis } from '../config/redis.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

export class HealthController {
  static check = asyncHandler(async (_req: Request, res: Response) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    let redisStatus: string = 'disabled';
    if (env.REDIS_ENABLED) {
      try {
        const client = getRedis();
        if (client) {
          await client.ping();
          redisStatus = 'connected';
        } else {
          redisStatus = 'disconnected';
        }
      } catch {
        redisStatus = 'disconnected';
      }
    }

    res.status(200).json({
      success: true,
      message: 'TaskFlow Manager API is running',
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        realtime: 'socket.io',
        services: {
          mongodb: mongoStatus,
          redis: redisStatus,
        },
      },
    });
  });
}
