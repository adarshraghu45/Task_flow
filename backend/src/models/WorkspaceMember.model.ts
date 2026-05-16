import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';
import type { WorkspaceRole } from '../types/workspace.types.js';

export interface IWorkspaceMember extends Document {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: WorkspaceRole;
  invitedBy?: Types.ObjectId;
  joinedAt: Date;
}

const memberSchema = new Schema<IWorkspaceMember>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'manager', 'member'],
      default: 'member',
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

memberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
memberSchema.index({ userId: 1 });

export const WorkspaceMember: Model<IWorkspaceMember> = mongoose.model<IWorkspaceMember>(
  'WorkspaceMember',
  memberSchema,
);
