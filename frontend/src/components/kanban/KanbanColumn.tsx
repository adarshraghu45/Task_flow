import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@app-types/index';
import { cn } from '@lib/cn';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  dotClass: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
}

export const KanbanColumn = ({ id, title, dotClass, tasks, onEdit }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-80 shrink-0 flex-col rounded-2xl bg-surface-muted/40 p-3',
        isOver && 'ring-2 ring-violet-500/50',
      )}
    >
      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-content-muted">
        <span className={cn('h-2 w-2 rounded-full', dotClass)} />
        {title}
        <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-[10px]">{tasks.length}</span>
      </h3>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};
