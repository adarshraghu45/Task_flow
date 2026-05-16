import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Folder, Users, Calendar, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@components/layout/dashboard/PageHeader';
import { Button, Input } from '@components/ui';
import { useWorkspace } from '@hooks/useWorkspace';
import { useAppDispatch } from '@store/hooks';
import { addWorkspace, removeWorkspace, setCurrentWorkspace } from '@features/workspace/workspaceSlice';
import { workspaceApi } from '@services/workspace.service';
import { getErrorMessage } from '@services/api';
import type { WorkspaceRole } from '@app-types/index';
import { toast } from 'sonner';

const canDeleteProject = (role?: WorkspaceRole) => role === 'owner' || role === 'admin';
export const ProjectsPage = () => {
  const { workspaces } = useWorkspace();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const create = useMutation({
    mutationFn: () => workspaceApi.create({ name, description }),
    onSuccess: (ws) => {
      dispatch(addWorkspace(ws));
      void qc.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Project created');
      setModalOpen(false);
      setName('');
      setDescription('');
      navigate(`/projects/${ws.id}`);
    },
    onError: () => toast.error('Failed to create project'),
  });

  const remove = useMutation({
    mutationFn: workspaceApi.delete,
    onSuccess: (_, id) => {
      dispatch(removeWorkspace(id));
      void qc.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Project deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const openProject = (id: string) => {
    dispatch(setCurrentWorkspace(id));
    navigate(`/projects/${id}`);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Delete "${name}"? This removes all tasks in the project.`)) {
      remove.mutate(id);
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${workspaces.length} workspace${workspaces.length === 1 ? '' : 's'}`}
        actions={
          <Button onClick={() => setModalOpen(true)} className="bg-violet-600 hover:bg-violet-500">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workspaces.map((ws, i) => (
          <motion.div
            key={ws.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card group relative transition-all hover:border-violet-500/40 hover:shadow-glow"
          >
            {canDeleteProject(ws.role) && (
              <button
                type="button"
                aria-label={`Delete ${ws.name}`}
                disabled={remove.isPending}
                onClick={(e) => handleDeleteProject(e, ws.id, ws.name)}
                className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-content-muted opacity-0 transition-all hover:bg-red-500/15 hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button type="button" onClick={() => openProject(ws.id)} className="w-full p-5 text-left">
            <div className="mb-3 flex items-start justify-between pr-8">
              <div className="rounded-lg bg-violet-500/20 p-2 text-violet-400">
                <Folder className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-violet-600/30 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-300">
                {(ws.role ?? 'member').toUpperCase()}
              </span>
            </div>
            <h3 className="font-semibold text-content group-hover:text-violet-300">{ws.name}</h3>
            {ws.description && (
              <p className="mt-2 line-clamp-2 text-sm text-content-muted">{ws.description}</p>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-content-muted">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> members
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(), 'MMM d, yyyy')}
              </span>
              <span className="font-bold tracking-wider text-violet-400">ACTIVE</span>
            </div>
            </button>
          </motion.div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-6 shadow-glow">
            <h2 className="mb-4 text-lg font-semibold">New Project</h2>
            <div className="space-y-4">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Launch" />
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  className="min-h-[80px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button
                  className="bg-violet-600"
                  isLoading={create.isPending}
                  onClick={() => create.mutate()}
                  disabled={!name.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
