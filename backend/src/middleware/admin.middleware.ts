import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ADMIN_ROLE_PERMISSIONS, type AdminPermission } from '../types/admin.types.js';
import type { AdminRole } from '../types/admin.types.js';

export const requirePlatformAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Platform administrator access required'));
  }
  next();
};

export const requireAdminPermission =
  (...permissions: AdminPermission[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      return next(new ApiError(403, 'Platform administrator access required'));
    }
    const adminRole: AdminRole = (req.user.adminRole as AdminRole) || 'admin';
    const allowed = ADMIN_ROLE_PERMISSIONS[adminRole] || [];
    const hasAll = permissions.every((p) => allowed.includes(p));
    if (!hasAll) {
      return next(new ApiError(403, 'Insufficient admin permissions'));
    }
    next();
  };
