import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '@lib/constants';
import { store } from '@store/index';
import { logout, updateToken } from '@features/auth/authSlice';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password');

    if (isAuthRoute || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post<{
        success: boolean;
        data: { tokens: { accessToken: string } };
      }>('/auth/refresh');

      const newToken = data.data.tokens.accessToken;
      store.dispatch(updateToken(newToken));
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};
