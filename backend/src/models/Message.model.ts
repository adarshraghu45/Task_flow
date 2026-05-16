import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';

export interface IMessage extends Document {
  workspaceId?: Types.ObjectId;
  channelType: 'workspace' | 'direct';
  senderId: Types.ObjectId;
  recipientId?: Types.ObjectId;
  content: string;
  reactions: { emoji: string; userId: Types.ObjectId }[];
  attachments?: { name: string; url: string }[];
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', index: true },
    channelType: { type: String, enum: ['workspace', 'direct'], required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true },
    reactions: [{ emoji: String, userId: { type: Schema.Types.ObjectId, ref: 'User' } }],
    attachments: [{ name: String, url: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

messageSchema.index({ workspaceId: 1, createdAt: -1 });

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
