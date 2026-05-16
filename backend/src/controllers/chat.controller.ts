import type { Request, Response } from 'express';
import { ChatService } from '../services/chat.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { param } from '../utils/params.js';

export class ChatController {
  static getMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await ChatService.getWorkspaceMessages(param(req.params.workspaceId));
    res.json({ success: true, message: 'Messages retrieved', data: { messages: messages.reverse() } });
  });

  static search = asyncHandler(async (req: Request, res: Response) => {
    const q = String(req.query.q || '');
    const messages = await ChatService.searchMessages(param(req.params.workspaceId), q);
    res.json({ success: true, message: 'Search results', data: { messages } });
  });
}
