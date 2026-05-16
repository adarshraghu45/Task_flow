import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
const extractAccessToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken as string;
  }
  return null;
};

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractAccessToken(req);
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const authorize =
  (...roles: Array<'user' | 'admin'>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    next();
  };
