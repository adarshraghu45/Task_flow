import type { Request, Response, NextFunction } from 'express';
import { WorkspaceMember } from '../models/WorkspaceMember.model.js';
import { ApiError } from '../utils/ApiError.js';
import type { WorkspaceRole } from '../types/workspace.types.js';
import { hasPermission, type Permission } from '../utils/permissions.js';

declare global {
  namespace Express {
    interface Request {
      workspaceId?: string;
      workspaceRole?: WorkspaceRole;
    }
  }
}

export const resolveWorkspace =
  (paramKey = 'workspaceId') =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const workspaceId =
      req.params[paramKey] || req.headers['x-workspace-id'] || req.body.workspaceId;
    if (!workspaceId || typeof workspaceId !== 'string') {
      return next(new ApiError(400, 'Workspace ID required'));
    }
    req.workspaceId = workspaceId;
    next();
  };

export const requireWorkspaceMember = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId || !req.workspaceId) {
      throw new ApiError(401, 'Authentication required');
    }
    const member = await WorkspaceMember.findOne({
      workspaceId: req.workspaceId,
      userId: req.user.userId,
    });
    if (!member) throw new ApiError(403, 'Not a workspace member');
    req.workspaceRole = member.role;
    next();
  } catch (error) {
    next(error);
  }
};

export const requirePermission =
  (permission: Permission) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.workspaceRole || !hasPermission(req.workspaceRole, permission)) {
      return next(new ApiError(403, 'Insufficient workspace permissions'));
    }
    next();
  };
