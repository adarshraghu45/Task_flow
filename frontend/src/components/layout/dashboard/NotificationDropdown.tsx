import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { notificationsApi } from '@services/notifications.service';
import { cn } from '@lib/cn';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 30000,
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = data?.unreadCount || 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 hover:bg-surface-muted"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-content" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-surface-elevated shadow-card-hover">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-semibold text-content">Notifications</span>
            {unread > 0 && (
              <button type="button" className="text-xs text-brand-600" onClick={() => markAll.mutate()}>
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {data?.notifications?.length ? (
              data.notifications.map((n) => (
                <div
                  key={n._id}
                  className={cn('border-b border-border px-4 py-3 text-sm', !n.isRead && 'bg-brand-50/50 dark:bg-brand-950/20')}
                >
                  <p className="font-medium text-content">{n.title}</p>
                  <p className="text-content-muted">{n.message}</p>
                  <p className="mt-1 text-xs text-content-muted">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-content-muted">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
