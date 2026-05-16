import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { useKanban, useReorderTasks } from '@hooks/useTasks';
import type { KanbanBoard as Board, Task, TaskStatus } from '@app-types/index';
import { TaskModal } from './TaskModal';
import { useAppSelector } from '@store/hooks';

const COLUMNS: { id: TaskStatus; title: string; dot: string }[] = [
  { id: 'todo', title: 'TO DO', dot: 'bg-slate-400' },
  { id: 'in_progress', title: 'IN PROGRESS', dot: 'bg-blue-500' },
  { id: 'review', title: 'REVIEW', dot: 'bg-orange-500' },
  { id: 'done', title: 'DONE', dot: 'bg-green-500' },
];

type FilterKey = 'all' | 'mine' | 'urgent' | 'high';

interface KanbanBoardProps {
  filter?: FilterKey;
  createOpen?: boolean;
  onCreateClose?: () => void;
}

const applyFilter = (board: Board, filter: FilterKey, userId?: string): Board => {
  const match = (t: Task) => {
    if (filter === 'mine') return t.assigneeId === userId;
    if (filter === 'urgent') return t.priority === 'urgent';
    if (filter === 'high') return t.priority === 'high';
    return true;
  };
  return {
    todo: board.todo.filter(match),
    in_progress: board.in_progress.filter(match),
    review: board.review.filter(match),
    done: board.done.filter(match),
  };
};

export const KanbanBoard = ({ filter = 'all', createOpen, onCreateClose }: KanbanBoardProps) => {
  const { data: board, isLoading } = useKanban();
  const reorder = useReorderTasks();
  const userId = useAppSelector((s) => s.auth.user?.id);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setEditTask(null);
    onCreateClose?.();
  };

  const filtered = useMemo(
    () => (board ? applyFilter(board, filter, userId) : undefined),
    [board, filter, userId],
  );

  const totalCount = useMemo(() => {
    if (!filtered) return 0;
    return COLUMNS.reduce((n, c) => n + (filtered[c.id]?.length ?? 0), 0);
  }, [filtered]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || !board) return;

    const taskId = String(active.id);
    const newStatus = over.id as TaskStatus;
    let task: Task | undefined;
    (Object.keys(board) as TaskStatus[]).forEach((col) => {
      const found = board[col].find((t) => t.id === taskId);
      if (found) task = found;
    });
    if (!task || task.status === newStatus) return;

    const items: { id: string; status: TaskStatus; kanbanOrder: number }[] = [];
    const targetCol = [...(board[newStatus] || [])];
    targetCol.push({ ...task, status: newStatus });
    targetCol.forEach((t, i) => items.push({ id: t.id, status: newStatus, kanbanOrder: i }));
    reorder.mutate(items);
  };

  if (isLoading) return <p className="text-content-muted">Loading board...</p>;
  if (!filtered) return <p className="text-content-muted">Select a workspace</p>;

  return (
    <>
      {filter === 'all' && (
        <p className="mb-4 text-sm text-content-muted">{totalCount} tasks on board</p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e) => {
          const id = String(e.active.id);
          for (const col of COLUMNS) {
            const t = board?.[col.id]?.find((x) => x.id === id);
            if (t) setActiveTask(t);
          }
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <SortableContext
              key={col.id}
              items={filtered[col.id]?.map((t) => t.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={col.id}
                title={col.title}
                dotClass={col.dot}
                tasks={filtered[col.id] || []}
                onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
              />
            </SortableContext>
          ))}
        </div>
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
      </DndContext>
      <TaskModal open={!!(createOpen || modalOpen)} onClose={closeModal} task={editTask} />
    </>
  );
};
