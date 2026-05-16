import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export interface IActivityLog extends Document {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  entityType: 'task' | 'workspace' | 'member' | 'comment';
  entityId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const activitySchema = new Schema<IActivityLog>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, enum: ['task', 'workspace', 'member', 'comment'], required: true },
    entityId: Schema.Types.ObjectId,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

activitySchema.index({ workspaceId: 1, createdAt: -1 });

export const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>(
  'ActivityLog',
  activitySchema,
);
