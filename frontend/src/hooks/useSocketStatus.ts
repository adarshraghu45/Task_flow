import { useEffect, useState } from 'react';
import { useAppSelector } from '@store/hooks';
import { getSocket } from '@services/socket';

export const useSocketStatus = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsConnected(false);
      return;
    }

    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    setIsConnected(socket.connected);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [isAuthenticated]);

  return { isConnected };
};
