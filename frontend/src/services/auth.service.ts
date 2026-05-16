import { apiClient } from './api';
import type { ApiResponse, AuthData, User } from '@app-types/index';

export const authApi = {
  register: async (payload: { name: string; email: string; password: string }) => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/register', payload);
    return data.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/login', payload);
    return data.data;
  },
  logout: async () => apiClient.post('/auth/logout'),
  refresh: async () => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/refresh');
    return data.data;
  },
  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data.user;
  },
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return data.message;
  },
  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, password });
    return data.message;
  },
};
