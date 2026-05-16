import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useWorkspace } from './useWorkspace';
import { tasksApi } from '@services/tasks.service';
import { getErrorMessage } from '@services/api';
import type { KanbanBoard, Task } from '@app-types/index';

export const useKanban = () => {
  const { currentWorkspaceId } = useWorkspace();
  return useQuery({
    queryKey: ['kanban', currentWorkspaceId],
    queryFn: () => tasksApi.getKanban(currentWorkspaceId!),
    enabled: !!currentWorkspaceId,
  });
};

export const useTaskStats = () => {
  const { currentWorkspaceId } = useWorkspace();
  return useQuery({
    queryKey: ['task-stats', currentWorkspaceId],
    queryFn: () => tasksApi.getStats(currentWorkspaceId!),
    enabled: !!currentWorkspaceId,
  });
};

export const useCreateTask = () => {
  const qc = useQueryClient();
  const { currentWorkspaceId } = useWorkspace();
  return useMutation({
    mutationFn: (payload: Partial<Task>) => tasksApi.createTask(currentWorkspaceId!, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['kanban', currentWorkspaceId] });
      void qc.invalidateQueries({ queryKey: ['task-stats', currentWorkspaceId] });
      void qc.invalidateQueries({ queryKey: ['dashboard', currentWorkspaceId] });
    },
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  const { currentWorkspaceId } = useWorkspace();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Task> & { id: string }) =>
      tasksApi.updateTask(currentWorkspaceId!, id, payload),
    onMutate: async ({ id, ...updates }) => {
      await qc.cancelQueries({ queryKey: ['kanban', currentWorkspaceId] });
      const prev = qc.getQueryData<KanbanBoard>(['kanban', currentWorkspaceId]);
      if (prev) {
        const next = { ...prev };
        Object.keys(next).forEach((col) => {
          next[col as keyof KanbanBoard] = next[col as keyof KanbanBoard].map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          );
        });
        qc.setQueryData(['kanban', currentWorkspaceId], next);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['kanban', currentWorkspaceId], ctx.prev);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['kanban', currentWorkspaceId] });
      void qc.invalidateQueries({ queryKey: ['dashboard', currentWorkspaceId] });
    },
  });
};

export const useReorderTasks = () => {
  const qc = useQueryClient();
  const { currentWorkspaceId } = useWorkspace();
  return useMutation({
    mutationFn: (items: { id: string; status: Task['status']; kanbanOrder: number }[]) =>
      tasksApi.reorder(currentWorkspaceId!, items),
    onSuccess: (board) => qc.setQueryData(['kanban', currentWorkspaceId], board),
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  const { currentWorkspaceId } = useWorkspace();
  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(currentWorkspaceId!, id),
    onSuccess: () => {
      toast.success('Task deleted');
      void qc.invalidateQueries({ queryKey: ['kanban', currentWorkspaceId] });
      void qc.invalidateQueries({ queryKey: ['task-stats', currentWorkspaceId] });
      void qc.invalidateQueries({ queryKey: ['dashboard', currentWorkspaceId] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
