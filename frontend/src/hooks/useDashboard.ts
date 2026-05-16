import { useQuery } from '@tanstack/react-query';
import { workspaceApi } from '@services/workspace.service';
import { useWorkspace } from './useWorkspace';

export const useDashboard = () => {
  const { currentWorkspaceId, workspaces } = useWorkspace();
  return useQuery({
    queryKey: ['dashboard', currentWorkspaceId],
    queryFn: async () => {
      const dashboard = await workspaceApi.getDashboard(currentWorkspaceId!);
      return { ...dashboard, summary: { ...dashboard.summary, projects: workspaces.length } };
    },
    enabled: !!currentWorkspaceId,
  });
};
