import { Message } from '../models/Message.model.js';

export class ChatService {
  static async getWorkspaceMessages(workspaceId: string, limit = 100) {
    return Message.find({ workspaceId, channelType: 'workspace' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('senderId', 'name email avatar')
      .lean();
  }

  static async searchMessages(workspaceId: string, query: string) {
    return Message.find({
      workspaceId,
      content: { $regex: query, $options: 'i' },
    })
      .limit(50)
      .populate('senderId', 'name email avatar')
      .lean();
  }
}
