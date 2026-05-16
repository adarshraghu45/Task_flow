import { io, Socket } from 'socket.io-client';
import { AUTH_TOKEN_KEY, SOCKET_URL } from '@lib/constants';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const connectSocket = (): void => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return;

  const instance = getSocket();
  instance.auth = { token };

  if (!instance.connected) {
    instance.connect();
  }
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const resetSocket = (): void => {
  disconnectSocket();
  socket?.removeAllListeners();
  socket = null;
};
