import type { Request, Response, NextFunction } from 'express';
import { Workspace } from '../models/Workspace.model.js';
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

    let role: WorkspaceRole = member.role;
    const workspace = await Workspace.findById(req.workspaceId).select('ownerId').lean();
    if (workspace?.ownerId.toString() === req.user.userId) {
      role = 'owner';
      if (member.role !== 'owner') {
        await WorkspaceMember.updateOne({ _id: member._id }, { role: 'owner' });
      }
    }

    req.workspaceRole = role;
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
