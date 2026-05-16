import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(env.API_PREFIX, apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
