import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@hooks/useWorkspace';
import { workspaceApi } from '@services/workspace.service';
import { Card, Button, Input } from '@components/ui';
import { toast } from 'sonner';
import { getErrorMessage } from '@services/api';

export const TeamPage = () => {
  const { currentWorkspaceId } = useWorkspace();
  const [email, setEmail] = useState('');
  const qc = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', currentWorkspaceId],
    queryFn: () => workspaceApi.getMembers(currentWorkspaceId!),
    enabled: !!currentWorkspaceId,
  });

  const invite = useMutation({
    mutationFn: () => workspaceApi.invite(currentWorkspaceId!, email, 'member'),
    onSuccess: () => {
      toast.success('Member invited');
      setEmail('');
      void qc.invalidateQueries({ queryKey: ['members', currentWorkspaceId] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-content">Team</h1>
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Invite member</h3>
        <div className="flex gap-2">
          <Input placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={() => invite.mutate()} isLoading={invite.isPending}>Invite</Button>
        </div>
        <p className="mt-2 text-xs text-content-muted">User must already have a TaskFlow account.</p>
      </Card>
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Members</h3>
        {isLoading ? <p className="text-content-muted">Loading...</p> : (
          <ul className="divide-y divide-border">
            {members?.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-content">{m.name || m.email}</p>
                  <p className="text-sm text-content-muted">{m.email}</p>
                </div>
                <span className="rounded-full bg-surface-muted px-2 py-1 text-xs capitalize">{m.role}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
