import { apiClient } from './api';
import type { ApiResponse, DashboardData, Workspace, WorkspaceMember } from '@app-types/index';

export const workspaceApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<{ workspaces: Workspace[] }>>('/workspaces');
    return data.data.workspaces;
  },
  create: async (payload: { name: string; description?: string; color?: string }) => {
    const { data } = await apiClient.post<ApiResponse<{ workspace: Workspace }>>('/workspaces', payload);
    return data.data.workspace;
  },
  getMembers: async (workspaceId: string) => {
    const { data } = await apiClient.get<ApiResponse<{ members: WorkspaceMember[] }>>(
      `/workspaces/${workspaceId}/members`,
    );
    return data.data.members;
  },
  invite: async (workspaceId: string, email: string, role: string) => {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/members/invite`, { email, role });
    return data;
  },
  getActivity: async (workspaceId: string) => {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/activity`);
    return data.data.activity;
  },
  getDashboard: async (workspaceId: string) => {
    const { data } = await apiClient.get<ApiResponse<{ dashboard: DashboardData }>>(
      `/workspaces/${workspaceId}/dashboard`,
    );
    return data.data.dashboard;
  },
  delete: async (workspaceId: string) => {
    await apiClient.delete(`/workspaces/${workspaceId}`);
  },
};
