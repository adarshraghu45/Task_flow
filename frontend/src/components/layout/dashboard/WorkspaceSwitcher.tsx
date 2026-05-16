import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentWorkspace } from '@features/workspace/workspaceSlice';
import { workspaceApi } from '@services/workspace.service';
import { addWorkspace } from '@features/workspace/workspaceSlice';
import { Button } from '@components/ui';
import { toast } from 'sonner';
import { getErrorMessage } from '@services/api';
import { connectSocket, getSocket } from '@services/socket';

export const WorkspaceSwitcher = () => {
  const dispatch = useAppDispatch();
  const { workspaces, currentWorkspaceId } = useAppSelector((s) => s.workspace);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const current = workspaces.find((w) => w.id === currentWorkspaceId);

  const switchWorkspace = (id: string) => {
    dispatch(setCurrentWorkspace(id));
    const socket = getSocket();
    if (socket.connected && currentWorkspaceId) {
      socket.emit('workspace:leave', currentWorkspaceId);
    }
    socket.emit('workspace:join', id);
    setOpen(false);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const ws = await workspaceApi.create({ name: name.trim() });
      dispatch(addWorkspace(ws));
      connectSocket();
      getSocket().emit('workspace:join', ws.id);
      setName('');
      setOpen(false);
      toast.success(`Workspace "${ws.name}" created`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-muted"
      >
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: current?.color || '#3b82f6' }}
        />
        <span className="max-w-[120px] truncate">{current?.name || 'Select workspace'}</span>
        <ChevronDown className="h-4 w-4 text-content-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border bg-surface-elevated p-2 shadow-card-hover">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              type="button"
              onClick={() => switchWorkspace(ws.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-muted"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ws.color }} />
              {ws.name}
            </button>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New workspace name"
              className="mb-2 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
            />
            <Button size="sm" className="w-full" isLoading={creating} onClick={handleCreate}>
              <Plus className="h-4 w-4" /> Create workspace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
