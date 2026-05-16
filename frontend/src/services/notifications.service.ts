import { apiClient } from './api';
import type { ApiResponse, Notification } from '@app-types/index';

export const notificationsApi = {
  list: async (unreadOnly = false) => {
    const { data } = await apiClient.get<ApiResponse<{ notifications: Notification[]; unreadCount: number }>>(
      '/notifications',
      { params: { unreadOnly } },
    );
    return data.data;
  },
  markRead: async (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: async () => apiClient.patch('/notifications/read-all'),
};
