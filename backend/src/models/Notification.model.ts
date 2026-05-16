import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export type NotificationType =
  | 'task_assigned'
  | 'task_comment'
  | 'task_due'
  | 'mention'
  | 'invite'
  | 'workspace';

export interface INotification extends Document {
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    type: {
      type: String,
      enum: ['task_assigned', 'task_comment', 'task_due', 'mention', 'invite', 'workspace'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    isRead: { type: Boolean, default: false, index: true },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification: Model<INotification> = mongoose.model<INotification>(
  'Notification',
  notificationSchema,
);
