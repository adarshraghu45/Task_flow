import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronUp,
  LogOut,
  Settings,
  Shield,
  CheckCheck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@lib/cn';
import { useAuth } from '@hooks/useAuth';
import { useAppSelector } from '@store/hooks';
import { notificationsApi } from '@services/notifications.service';

interface SidebarFooterProps {
  onNavigate?: () => void;
}

export const SidebarFooter = ({ onNavigate }: SidebarFooterProps) => {
  const { user, signOut } = useAuth();
  const isAdmin = useAppSelector((s) => s.auth.user?.role === 'admin');
  const rootRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const qc = useQueryClient();
  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 30000,
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = notifData?.unreadCount ?? 0;
  const initials = user?.name?.charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setNotifOpen(false);
  };

  const panelClass =
    'absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-white/10 bg-[#16122a] shadow-2xl shadow-black/50';

  return (
    <div
      ref={rootRef}
      className="relative border-t border-white/[0.06] bg-gradient-to-t from-black/20 to-transparent p-3"
    >
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className={panelClass}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <span className="text-sm font-semibold text-content">Notifications</span>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => markAll.mutate()}
                  className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-52 overflow-y-auto">
              {notifData?.notifications?.length ? (
                notifData.notifications.map((n) => (
                  <div
                    key={n._id}
                    className={cn(
                      'border-b border-white/[0.04] px-4 py-3 last:border-0',
                      !n.isRead && 'bg-violet-500/[0.07]',
                    )}
                  >
                    <p className="text-sm font-medium text-content">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-content-muted">{n.message}</p>
                    <p className="mt-1 text-[10px] text-content-muted/60">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="px-4 py-8 text-center text-sm text-content-muted">All caught up</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className={cn(panelClass, 'py-1')}
          >
            <div className="border-b border-white/[0.06] px-4 py-3">
              <p className="truncate text-sm font-semibold text-content">{user?.name}</p>
              <p className="truncate text-xs text-content-muted">{user?.email}</p>
            </div>
            <Link
              to="/settings"
              onClick={() => {
                closeAll();
                onNavigate?.();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-content-muted transition-colors hover:bg-white/[0.04] hover:text-content"
            >
              <Settings className="h-4 w-4 shrink-0 opacity-70" />
              Settings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => {
                  closeAll();
                  onNavigate?.();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400/90 transition-colors hover:bg-amber-500/10"
              >
                <Shield className="h-4 w-4 shrink-0" />
                Admin panel
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                closeAll();
                void signOut();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400/90 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          setNotifOpen((v) => !v);
          setMenuOpen(false);
        }}
        className={cn(
          'mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
          notifOpen
            ? 'bg-violet-600/15 text-violet-300'
            : 'text-content-muted hover:bg-white/[0.04] hover:text-content',
        )}
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </span>
        <span className="flex-1 text-left font-medium">Notifications</span>
        {unread > 0 && (
          <span className="rounded-md bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
            {unread}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setMenuOpen((v) => !v);
          setNotifOpen(false);
        }}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all',
          menuOpen ? 'bg-violet-600/12 ring-1 ring-violet-500/25' : 'hover:bg-white/[0.04]',
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white shadow-md shadow-violet-900/40 ring-2 ring-white/10">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-content">{user?.name || 'User'}</p>
          <p className="truncate text-[11px] text-content-muted">{user?.email}</p>
        </div>
        <ChevronUp
          className={cn(
            'h-4 w-4 shrink-0 text-content-muted/70 transition-transform duration-200',
            menuOpen && 'rotate-180 text-violet-400',
          )}
        />
      </button>
    </div>
  );
};
