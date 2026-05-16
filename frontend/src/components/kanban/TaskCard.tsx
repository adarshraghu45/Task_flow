import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MessageSquare } from 'lucide-react';
import { PriorityBadge } from '@components/ui/PriorityBadge';
import type { Task, TaskStatus } from '@app-types/index';
import { cn } from '@lib/cn';
import { format, isPast, isToday } from 'date-fns';

const statusBorder: Record<TaskStatus, string> = {
  todo: 'border-l-slate-500',
  in_progress: 'border-l-blue-500',
  review: 'border-l-orange-500',
  done: 'border-l-green-500',
};

const initials = (name?: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, onEdit, isDragging }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const overdue =
    task.dueDate && task.status !== 'done' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'cursor-pointer rounded-xl border border-border/60 border-l-4 bg-surface-elevated p-3 shadow-card transition-shadow hover:shadow-glow',
        statusBorder[task.status],
        isDragging && 'opacity-90 ring-2 ring-violet-500',
      )}
      onClick={() => onEdit?.(task)}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-content">{task.title}</p>
        {task.assignee && (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-[10px] font-bold text-violet-200"
            title={task.assignee.name}
          >
            {initials(task.assignee.name)}
          </span>
        )}
      </div>
      <div className="mb-2">
        <PriorityBadge priority={task.priority} />
      </div>
      {task.dueDate && (
        <p className={cn('mb-2 flex items-center gap-1 text-xs', overdue ? 'text-red-400' : 'text-content-muted')}>
          <Calendar className="h-3 w-3" />
          {format(new Date(task.dueDate), 'MMM d')}
          {overdue && ' (overdue)'}
        </p>
      )}
      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] text-content-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex justify-end">
        <MessageSquare className="h-3.5 w-3.5 text-content-muted/50" />
      </div>
    </div>
  );
};
