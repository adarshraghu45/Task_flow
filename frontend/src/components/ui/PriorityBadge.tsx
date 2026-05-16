import { cn } from '@lib/cn';
import type { TaskPriority } from '@app-types/index';

const styles: Record<TaskPriority, string> = {
  low: 'bg-slate-500/20 text-slate-300',
  medium: 'bg-blue-500/20 text-blue-300',
  high: 'bg-orange-500/20 text-orange-300',
  urgent: 'bg-red-500/20 text-red-300',
};

const labels: Record<TaskPriority, string> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  urgent: 'CRITICAL',
};

export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide', styles[priority])}>
    {labels[priority]}
  </span>
);
