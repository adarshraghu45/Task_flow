import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@store/hooks';
import { SOCKET_EVENTS } from '@lib/constants';
import { connectSocket, disconnectSocket, getSocket, resetSocket } from '@services/socket';
import type { KanbanBoard } from '@app-types/index';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);
  const workspaceId = useAppSelector((s) => s.workspace.currentWorkspaceId);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket();
      resetSocket();
      return;
    }
    connectSocket();
    const socket = getSocket();

    const invalidateKanban = () => {
      void queryClient.invalidateQueries({ queryKey: ['kanban', workspaceId] });
      void queryClient.invalidateQueries({ queryKey: ['task-stats', workspaceId] });
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, () => invalidateKanban());
    socket.on(SOCKET_EVENTS.TASK_UPDATED, () => invalidateKanban());
    socket.on(SOCKET_EVENTS.TASK_DELETED, () => invalidateKanban());
    socket.on(SOCKET_EVENTS.TASK_REORDERED, ({ board }: { board: KanbanBoard }) => {
      queryClient.setQueryData(['kanban', workspaceId], board);
    });
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED);
      socket.off(SOCKET_EVENTS.TASK_UPDATED);
      socket.off(SOCKET_EVENTS.TASK_DELETED);
      socket.off(SOCKET_EVENTS.TASK_REORDERED);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
    };
  }, [isAuthenticated, token, workspaceId, queryClient]);

  return <>{children}</>;
};
