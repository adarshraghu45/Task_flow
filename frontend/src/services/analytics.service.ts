import { apiClient } from './api';
import type { ApiResponse } from '@app-types/index';

export const analyticsApi = {
  getWorkspace: async (workspaceId: string) => {
    const { data } = await apiClient.get<ApiResponse<{ analytics: unknown }>>(
      `/workspaces/${workspaceId}/analytics`,
    );
    return data.data.analytics;
  },
  getAdminStats: async () => {
    const { data } = await apiClient.get<ApiResponse<{ stats: unknown }>>('/admin/stats');
    return data.data.stats;
  },
};
