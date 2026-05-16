import { Navigate } from 'react-router-dom';
import { useWorkspace } from '@hooks/useWorkspace';

export const KanbanPage = () => {
  const { currentWorkspaceId } = useWorkspace();
  if (currentWorkspaceId) return <Navigate to={`/projects/${currentWorkspaceId}`} replace />;
  return <Navigate to="/projects" replace />;
};
