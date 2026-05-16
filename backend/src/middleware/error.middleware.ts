import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(message, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
