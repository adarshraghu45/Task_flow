import { apiClient } from './api';
import type { ApiResponse } from '@app-types/index';
import type {
  AdminDashboard,
  AdminReport,
  AdminTask,
  AdminUser,
  AdminWorkspace,
  PaginatedResult,
  SystemHealth,
} from '@/types/admin';

const base = '/admin';

export const adminApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get<ApiResponse<{ dashboard: AdminDashboard }>>(`${base}/dashboard`);
    return data.data.dashboard;
  },
  getHealth: async () => {
    const { data } = await apiClient.get<ApiResponse<{ health: SystemHealth }>>(`${base}/health`);
    return data.data.health;
  },
  listUsers: async (params?: Record<string, string | undefined>) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<AdminUser>>>(`${base}/users`, { params });
    return data.data;
  },
  getUser: async (userId: string) => {
    const { data } = await apiClient.get<ApiResponse<{ user: AdminUser; stats: Record<string, number> }>>(
      `${base}/users/${userId}`,
    );
    return data.data;
  },
  updateUser: async (userId: string, payload: Partial<AdminUser>) => {
    const { data } = await apiClient.patch<ApiResponse<{ user: AdminUser }>>(`${base}/users/${userId}`, payload);
    return data.data.user;
  },
  suspendUser: async (userId: string, reason: string) => {
    const { data } = await apiClient.post<ApiResponse<{ user: AdminUser }>>(`${base}/users/${userId}/suspend`, {
      reason,
    });
    return data.data.user;
  },
  deleteUser: async (userId: string) => {
    await apiClient.delete(`${base}/users/${userId}`);
  },
  resetPassword: async (userId: string, password: string) => {
    await apiClient.post(`${base}/users/${userId}/reset-password`, { password });
  },
  revokeSessions: async (userId: string) => {
    await apiClient.post(`${base}/users/${userId}/revoke-sessions`);
  },
  listWorkspaces: async (params?: Record<string, string | undefined>) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<AdminWorkspace>>>(`${base}/workspaces`, {
      params,
    });
    return data.data;
  },
  suspendWorkspace: async (workspaceId: string) => {
    const { data } = await apiClient.post(`${base}/workspaces/${workspaceId}/suspend`);
    return data;
  },
  deleteWorkspace: async (workspaceId: string) => {
    await apiClient.delete(`${base}/workspaces/${workspaceId}`);
  },
  listTasks: async (params?: Record<string, string | undefined>) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<AdminTask>>>(`${base}/tasks`, { params });
    return data.data;
  },
  deleteTask: async (taskId: string) => {
    await apiClient.delete(`${base}/tasks/${taskId}`);
  },
  listReports: async (params?: Record<string, string | undefined>) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<AdminReport>>>(`${base}/reports`, { params });
    return data.data;
  },
  resolveReport: async (reportId: string, payload: { status: string; resolution?: string }) => {
    const { data } = await apiClient.patch(`${base}/reports/${reportId}`, payload);
    return data;
  },
  listAuditLogs: async (params?: Record<string, string>) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResult<unknown>>>(`${base}/audit-logs`, { params });
    return data.data;
  },
  getSettings: async () => {
    const { data } = await apiClient.get<ApiResponse<{ settings: Record<string, unknown> }>>(`${base}/settings`);
    return data.data.settings;
  },
  updateSettings: async (settings: Record<string, unknown>) => {
    const { data } = await apiClient.patch<ApiResponse<{ settings: Record<string, unknown> }>>(
      `${base}/settings`,
      settings,
    );
    return data.data.settings;
  },
  broadcast: async (title: string, message: string) => {
    const { data } = await apiClient.post(`${base}/notifications/broadcast`, { title, message });
    return data;
  },
};
