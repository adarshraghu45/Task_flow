import { apiClient } from './api';
import type { ApiResponse, KanbanBoard, PaginatedResponse, Task, TaskStats } from '@app-types/index';

const base = (workspaceId: string) => `/workspaces/${workspaceId}/tasks`;

export const tasksApi = {
  getTasks: async (workspaceId: string, params?: Record<string, string>) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Task>>>(base(workspaceId), { params });
    return data.data;
  },
  getKanban: async (workspaceId: string) => {
    const { data } = await apiClient.get<ApiResponse<{ board: KanbanBoard }>>(`${base(workspaceId)}/kanban`);
    return data.data.board;
  },
  getStats: async (workspaceId: string) => {
    const { data } = await apiClient.get<ApiResponse<{ stats: TaskStats }>>(`${base(workspaceId)}/stats`);
    return data.data.stats;
  },
  createTask: async (workspaceId: string, payload: Partial<Task>) => {
    const { data } = await apiClient.post<ApiResponse<{ task: Task }>>(base(workspaceId), payload);
    return data.data.task;
  },
  updateTask: async (workspaceId: string, id: string, payload: Partial<Task>) => {
    const { data } = await apiClient.patch<ApiResponse<{ task: Task }>>(`${base(workspaceId)}/${id}`, payload);
    return data.data.task;
  },
  deleteTask: async (workspaceId: string, id: string) => {
    await apiClient.delete(`${base(workspaceId)}/${id}`);
  },
  reorder: async (workspaceId: string, items: { id: string; status: Task['status']; kanbanOrder: number }[]) => {
    const { data } = await apiClient.patch<ApiResponse<{ board: KanbanBoard }>>(`${base(workspaceId)}/reorder`, { items });
    return data.data.board;
  },
};
