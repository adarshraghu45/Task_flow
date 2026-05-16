import { cn } from '@lib/cn';
import type { TaskStatus } from '@app-types/index';

const styles: Record<TaskStatus, string> = {
  todo: 'bg-slate-500/20 text-slate-300',
  in_progress: 'bg-blue-500/20 text-blue-300',
  review: 'bg-orange-500/20 text-orange-300',
  done: 'bg-green-500/20 text-green-300',
};

const labels: Record<TaskStatus, string> = {
  todo: 'TODO',
  in_progress: 'IN PROGRESS',
  review: 'REVIEW',
  done: 'DONE',
};

export const StatusBadge = ({ status }: { status: TaskStatus }) => (
  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide', styles[status])}>
    {labels[status]}
  </span>
);
