import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminId: Types.ObjectId;
  action: string;
  targetType: 'user' | 'workspace' | 'task' | 'report' | 'settings' | 'system';
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const schema = new Schema<IAdminAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    targetType: {
      type: String,
      enum: ['user', 'workspace', 'task', 'report', 'settings', 'system'],
      required: true,
    },
    targetId: String,
    metadata: Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

schema.index({ createdAt: -1 });

export const AdminAuditLog: Model<IAdminAuditLog> = mongoose.model<IAdminAuditLog>(
  'AdminAuditLog',
  schema,
);
