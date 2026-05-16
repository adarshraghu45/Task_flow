import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export interface ITaskComment extends Document {
  taskId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<ITaskComment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const TaskComment: Model<ITaskComment> = mongoose.model<ITaskComment>(
  'TaskComment',
  commentSchema,
);
