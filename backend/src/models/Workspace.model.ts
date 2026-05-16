import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  description?: string;
  ownerId: Types.ObjectId;
  color: string;
  settings: {
    defaultView: 'kanban' | 'list' | 'calendar';
    allowGuestInvites: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    color: { type: String, default: '#3b82f6' },
    settings: {
      defaultView: { type: String, enum: ['kanban', 'list', 'calendar'], default: 'kanban' },
      allowGuestInvites: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

workspaceSchema.index({ ownerId: 1 });
workspaceSchema.index({ slug: 1 });

export const Workspace: Model<IWorkspace> = mongoose.model<IWorkspace>('Workspace', workspaceSchema);
