import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/dashboard/PageHeader';
import { KanbanBoard } from '@components/kanban/KanbanBoard';
import { Button } from '@components/ui';
import { useAppDispatch } from '@store/hooks';
import { setCurrentWorkspace } from '@features/workspace/workspaceSlice';
import { useWorkspace } from '@hooks/useWorkspace';
import { workspaceApi } from '@services/workspace.service';
import { cn } from '@lib/cn';

type FilterKey = 'all' | 'mine' | 'urgent' | 'high';

export const ProjectBoardPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useAppDispatch();
  const { workspaces } = useWorkspace();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [createOpen, setCreateOpen] = useState(false);

  const project = workspaces.find((w) => w.id === workspaceId);

  useEffect(() => {
    if (workspaceId) dispatch(setCurrentWorkspace(workspaceId));
  }, [workspaceId, dispatch]);

  const { data: members = [] } = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: () => workspaceApi.getMembers(workspaceId!),
    enabled: !!workspaceId,
  });

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'mine', label: 'Assigned to me' },
    { key: 'urgent', label: 'Critical' },
    { key: 'high', label: 'High' },
  ];

  if (!workspaceId || !project) {
    return (
      <div>
        <Link to="/projects" className="mb-4 inline-flex items-center gap-2 text-sm text-violet-400">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <p className="text-content-muted">Project not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/projects"
        className="mb-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <PageHeader
        title={project.name}
        subtitle={project.description || 'Manage tasks on the board'}
        actions={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-content-muted">
              <Users className="h-4 w-4" />
              {members.length || '—'} Members
            </span>
            <Button className="bg-violet-600 hover:bg-violet-500" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'border-violet-500 bg-violet-600/20 text-violet-300'
                : 'border-border text-content-muted hover:border-violet-500/50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <KanbanBoard filter={filter} createOpen={createOpen} onCreateClose={() => setCreateOpen(false)} />
    </div>
  );
};
