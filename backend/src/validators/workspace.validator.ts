import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial().extend({
  settings: z
    .object({
      defaultView: z.enum(['kanban', 'list', 'calendar']).optional(),
      allowGuestInvites: z.boolean().optional(),
    })
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'member']).default('member'),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'member']),
});
