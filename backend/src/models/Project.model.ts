import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: Types.ObjectId[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectSchema.index({ ownerId: 1 });

export const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
