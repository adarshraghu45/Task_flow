import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const mongooseOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, mongooseOptions);
    logger.info(`MongoDB Atlas connected — database: ${mongoose.connection.db?.databaseName}`);
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
