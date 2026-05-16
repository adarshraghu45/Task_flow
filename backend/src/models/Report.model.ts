import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type ReportType = 'abuse' | 'spam' | 'content' | 'user' | 'ai_abuse';

export interface IReport extends Document {
  type: ReportType;
  status: ReportStatus;
  reporterId: Types.ObjectId;
  reportedUserId?: Types.ObjectId;
  workspaceId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  reason: string;
  description?: string;
  resolution?: string;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IReport>(
  {
    type: { type: String, enum: ['abuse', 'spam', 'content', 'user', 'ai_abuse'], required: true },
    status: { type: String, enum: ['pending', 'reviewing', 'resolved', 'dismissed'], default: 'pending' },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    reason: { type: String, required: true },
    description: String,
    resolution: String,
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
  },
  { timestamps: true },
);

schema.index({ status: 1, createdAt: -1 });

export const Report: Model<IReport> = mongoose.model<IReport>('Report', schema);
