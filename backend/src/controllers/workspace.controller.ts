import type { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service.js';
import { ActivityService } from '../services/activity.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';

export class WorkspaceController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.create(req.user!.userId, req.body);
    res.status(201).json({ success: true, message: 'Workspace created', data: { workspace } });
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    const workspaces = await WorkspaceService.listForUser(req.user!.userId);
    res.json({ success: true, message: 'Workspaces retrieved', data: { workspaces } });
  });

  static getOne = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.getById(param(req.params.workspaceId), req.user!.userId);
    res.json({ success: true, message: 'Workspace retrieved', data: { workspace } });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.update(param(req.params.workspaceId), req.user!.userId, req.body);
    res.json({ success: true, message: 'Workspace updated', data: { workspace } });
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceService.delete(param(req.params.workspaceId));
    res.json({ success: true, message: 'Workspace deleted', data: null });
  });

  static getMembers = asyncHandler(async (req: Request, res: Response) => {
    const members = await WorkspaceService.getMembers(param(req.params.workspaceId));
    res.json({ success: true, message: 'Members retrieved', data: { members } });
  });

  static invite = asyncHandler(async (req: Request, res: Response) => {
    const member = await WorkspaceService.inviteMember(
      param(req.params.workspaceId),
      req.user!.userId,
      req.body.email,
      req.body.role,
    );
    res.status(201).json({ success: true, message: 'Member invited', data: { member } });
  });

  static updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
    const member = await WorkspaceService.updateMemberRole(
      param(req.params.workspaceId),
      req.user!.userId,
      param(req.params.memberId),
      req.body.role,
      req.workspaceRole!,
    );
    res.json({ success: true, message: 'Role updated', data: { member } });
  });

  static removeMember = asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceService.removeMember(
      param(req.params.workspaceId),
      req.user!.userId,
      param(req.params.memberId),
      req.workspaceRole!,
    );
    res.json({ success: true, message: 'Member removed', data: null });
  });

  static getActivity = asyncHandler(async (req: Request, res: Response) => {
    const activity = await ActivityService.getWorkspaceActivity(param(req.params.workspaceId));
    res.json({ success: true, message: 'Activity retrieved', data: { activity } });
  });
}
