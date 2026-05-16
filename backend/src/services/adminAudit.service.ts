import type { Request } from 'express';
import { AdminAuditLog } from '../models/AdminAuditLog.model.js';
import type { IAdminAuditLog } from '../models/AdminAuditLog.model.js';

export class AdminAuditService {
  static async log(
    adminId: string,
    action: string,
    targetType: IAdminAuditLog['targetType'],
    targetId?: string,
    metadata?: Record<string, unknown>,
    req?: Request,
  ) {
    await AdminAuditLog.create({
      adminId,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: req?.ip || req?.socket?.remoteAddress,
    });
  }

  static async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      AdminAuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('adminId', 'name email adminRole')
        .lean(),
      AdminAuditLog.countDocuments(),
    ]);
    return {
      items: items.map((l) => ({
        id: String(l._id),
        action: l.action,
        targetType: l.targetType,
        targetId: l.targetId,
        metadata: l.metadata,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt,
        admin: l.adminId as { name?: string; email?: string; adminRole?: string },
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
