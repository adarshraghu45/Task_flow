import type { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';

export class AnalyticsController {
  static workspace = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await AnalyticsService.getWorkspaceAnalytics(param(req.params.workspaceId));
    res.json({ success: true, message: 'Analytics retrieved', data: { analytics } });
  });

  static admin = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await AnalyticsService.getAdminStats();
    res.json({ success: true, message: 'Admin stats retrieved', data: { stats } });
  });
}
