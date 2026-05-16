import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const userListSchema = paginationSchema.extend({
  role: z.enum(['user', 'admin']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['user', 'admin']).optional(),
  adminRole: z.enum(['super_admin', 'admin', 'moderator', 'support_staff']).nullable().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
});

export const suspendUserSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const workspaceListSchema = paginationSchema.extend({
  status: z.enum(['active', 'suspended']).optional(),
});

export const taskListSchema = paginationSchema.extend({
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const reportListSchema = paginationSchema.extend({
  status: z.enum(['pending', 'reviewing', 'resolved', 'dismissed']).optional(),
});

export const resolveReportSchema = z.object({
  status: z.enum(['resolved', 'dismissed', 'reviewing']),
  resolution: z.string().optional(),
});

export const broadcastSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
});
