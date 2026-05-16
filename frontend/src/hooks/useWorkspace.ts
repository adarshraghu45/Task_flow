import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setWorkspaces, setLoading } from '@features/workspace/workspaceSlice';
import { workspaceApi } from '@services/workspace.service';
import { connectSocket, getSocket } from '@services/socket';

export const useWorkspace = () => {
  const workspace = useAppSelector((s) => s.workspace);

  const current = workspace.workspaces.find((w) => w.id === workspace.currentWorkspaceId);

  return { ...workspace, current };
};

export const useWorkspaceInit = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const currentId = useAppSelector((s) => s.workspace.currentWorkspaceId);

  const { data } = useQuery({
    queryKey: ['workspaces'],
    queryFn: workspaceApi.list,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      dispatch(setWorkspaces(data));
      dispatch(setLoading(false));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (currentId && isAuthenticated) {
      connectSocket();
      getSocket().emit('workspace:join', currentId);
    }
  }, [currentId, isAuthenticated]);
};
