import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ISubtask {
  _id?: Types.ObjectId;
  title: string;
  completed: boolean;
}

export interface IAttachment {
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface ITask extends Document {
  workspaceId: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  assigneeId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  dueDate?: Date;
  startDate?: Date;
  subtasks: ISubtask[];
  attachments: IAttachment[];
  dependencies: Types.ObjectId[];
  recurring?: { enabled: boolean; rule?: string };
  kanbanOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const subtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true },
);

const taskSchema = new Schema<ITask>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    labels: [{ type: String, trim: true }],
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, index: true },
    startDate: { type: Date },
    subtasks: [subtaskSchema],
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    recurring: {
      enabled: { type: Boolean, default: false },
      rule: String,
    },
    kanbanOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

taskSchema.index({ workspaceId: 1, status: 1, kanbanOrder: 1 });
taskSchema.index({ workspaceId: 1, title: 'text', description: 'text' });
taskSchema.index({ createdBy: 1 });

export const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
