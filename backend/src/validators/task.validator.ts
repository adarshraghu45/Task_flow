import { z } from 'zod';

const emptyToUndefined = (val: unknown) =>
  val === '' || val === null || val === undefined ? undefined : val;

/** Accepts ISO datetime or HTML date input (YYYY-MM-DD) */
const optionalDateString = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .refine(
      (val) =>
        !Number.isNaN(Date.parse(val)) &&
        (/^\d{4}-\d{2}-\d{2}$/.test(val) || /^\d{4}-\d{2}-\d{2}T/.test(val)),
      { message: 'Invalid date format' },
    )
    .optional(),
);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  labels: z.array(z.string()).optional(),
  assigneeId: z.preprocess(emptyToUndefined, z.string().optional()),
  dueDate: optionalDateString,
  startDate: optionalDateString,  subtasks: z.array(z.object({ title: z.string(), completed: z.boolean().optional() })).optional(),
  dependencies: z.array(z.string()).optional(),
  recurring: z.object({ enabled: z.boolean(), rule: z.string().optional() }).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  search: z.string().optional(),
  assigneeId: z.string().optional(),
  label: z.string().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'kanbanOrder', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      status: z.enum(['todo', 'in_progress', 'review', 'done']),
      kanbanOrder: z.number(),
    }),
  ),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
