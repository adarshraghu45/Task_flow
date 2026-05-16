import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@components/ui';
import { useCreateTask, useUpdateTask, useDeleteTask } from '@hooks/useTasks';
import { useWorkspace } from '@hooks/useWorkspace';
import { workspaceApi } from '@services/workspace.service';
import type { Task, TaskPriority, TaskStatus } from '@app-types/index';
import { toast } from 'sonner';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

interface FormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  tags: string;
}

export const TaskModal = ({ open, onClose, task }: TaskModalProps) => {
  const create = useCreateTask();
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const { currentWorkspaceId } = useWorkspace();

  const { data: members = [] } = useQuery({
    queryKey: ['members', currentWorkspaceId],
    queryFn: () => workspaceApi.getMembers(currentWorkspaceId!),
    enabled: !!currentWorkspaceId && open,
  });

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      assigneeId: '',
      dueDate: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        tags: (task.labels || []).join(', '),
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assigneeId: '',
        dueDate: '',
        tags: '',
      });
    }
  }, [task, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const labels = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      assigneeId: data.assigneeId || undefined,
      dueDate: data.dueDate || undefined,
      labels,
    };
    try {
      if (task) {
        await update.mutateAsync({ id: task.id, ...payload });
        toast.success('Task updated');
      } else {
        await create.mutateAsync(payload);
        toast.success('Task created');
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to save task';
      toast.error(msg);
    }
  });

  const selectClass =
    'h-10 w-full rounded-lg border border-border bg-surface-muted px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-violet-500';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface-elevated p-6 shadow-glow"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'Create Task'}</h2>
              <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              <Input label="Title *" placeholder="What needs to be done?" {...register('title', { required: true })} />
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  className="min-h-[88px] w-full resize-y rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm"
                  placeholder="Add details..."
                  {...register('description')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Priority</label>
                  <select className={selectClass} {...register('priority')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Status</label>
                  <select className={selectClass} {...register('status')}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Assign To</label>
                  <select className={selectClass} {...register('assigneeId')}>
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.name || m.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Due Date</label>
                  <div className="relative">
                    <input type="date" className={selectClass} {...register('dueDate')} />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
                  </div>
                </div>
              </div>
              <Input label="Tags (comma-separated)" placeholder="frontend, bug, urgent" {...register('tags')} />
              <div className="flex justify-between gap-2 pt-2">
                {task && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      if (confirm('Delete this task?')) {
                        remove.mutate(task.id, { onSuccess: onClose });
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-violet-600 hover:bg-violet-500" isLoading={create.isPending || update.isPending}>
                    {task ? 'Save' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
