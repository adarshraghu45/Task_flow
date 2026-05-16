import mongoose from 'mongoose';
import { Task } from '../models/Task.model.js';
import { WorkspaceMember } from '../models/WorkspaceMember.model.js';
import { ActivityLog } from '../models/ActivityLog.model.js';

export class AnalyticsService {
  static async getWorkspaceAnalytics(workspaceId: string) {
    const wsId = new mongoose.Types.ObjectId(workspaceId);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [statusBreakdown, completionTrend, memberCount, recentActivity] = await Promise.all([
      Task.aggregate([
        { $match: { workspaceId: wsId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        {
          $match: {
            workspaceId: wsId,
            status: 'done',
            updatedAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
            completed: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      WorkspaceMember.countDocuments({ workspaceId }),
      ActivityLog.find({ workspaceId }).sort({ createdAt: -1 }).limit(10).populate('userId', 'name').lean(),
    ]);

    const priorityBreakdown = await Task.aggregate([
      { $match: { workspaceId: wsId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const total = statusBreakdown.reduce((s: number, r: { count: number }) => s + r.count, 0);
    const done = statusBreakdown.find((r: { _id: string }) => r._id === 'done')?.count || 0;

    return {
      overview: {
        totalTasks: total,
        completionRate: total ? Math.round((done / total) * 100) : 0,
        memberCount,
      },
      statusBreakdown,
      priorityBreakdown,
      completionTrend,
      recentActivity,
    };
  }

  static async getAdminStats() {
    const [userCount, workspaceCount, taskCount] = await Promise.all([
      mongoose.model('User').countDocuments(),
      mongoose.model('Workspace').countDocuments(),
      Task.countDocuments(),
    ]);
    return { userCount, workspaceCount, taskCount };
  }
}
