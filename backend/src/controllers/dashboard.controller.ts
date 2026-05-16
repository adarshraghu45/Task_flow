import type { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';

export class DashboardController {
  static getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await DashboardService.getDashboard(
      param(req.params.workspaceId),
      req.user!.userId,
    );
    res.json({ success: true, message: 'Dashboard data retrieved', data: { dashboard: data } });
  });
}
