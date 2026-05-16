import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new ApiError(400, message));
    }
    req.body = result.data;
    next();
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new ApiError(400, message));
    }
    req.query = result.data as typeof req.query;
    next();
  };
