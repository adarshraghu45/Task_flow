import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@services/admin.service';

export const AdminSettingsPage = () => {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  });

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const save = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => {
      toast.success('Settings saved');
      void qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });

  const broadcast = useMutation({
    mutationFn: () => adminApi.broadcast(broadcastTitle, broadcastMsg),
    onSuccess: () => {
      toast.success('Broadcast sent');
      setBroadcastTitle('');
      setBroadcastMsg('');
    },
  });

  if (isLoading) return <p className="text-violet-300/50">Loading settings...</p>;

  const branding = (settings?.branding as Record<string, string>) || {};
  const features = (settings?.features as Record<string, boolean>) || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
        <p className="text-sm text-violet-300/50">Branding, security, and feature toggles</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5 space-y-4">
          <h3 className="font-semibold text-white">Branding</h3>
          <p className="text-sm text-violet-300/60">App: {branding.appName || 'TaskFlow Manager'}</p>
          <label className="flex items-center gap-2 text-sm text-violet-200/80">
            <input
              type="checkbox"
              checked={features.aiEnabled ?? true}
              onChange={(e) =>
                save.mutate({ ...settings, features: { ...features, aiEnabled: e.target.checked } })
              }
            />
            AI features enabled
          </label>
          <label className="flex items-center gap-2 text-sm text-violet-200/80">
            <input
              type="checkbox"
              checked={features.registrationsEnabled ?? true}
              onChange={(e) =>
                save.mutate({ ...settings, features: { ...features, registrationsEnabled: e.target.checked } })
              }
            />
            Allow new registrations
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5 space-y-4">
          <h3 className="font-semibold text-white">Broadcast Notification</h3>
          <input
            placeholder="Title"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/10 bg-[#1e1830] px-3 text-sm text-white"
          />
          <textarea
            placeholder="Message to all users..."
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="min-h-[80px] w-full rounded-xl border border-white/10 bg-[#1e1830] px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            disabled={!broadcastTitle || !broadcastMsg}
            onClick={() => broadcast.mutate()}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
          >
            Send broadcast
          </button>
        </div>
      </div>
    </div>
  );
};
