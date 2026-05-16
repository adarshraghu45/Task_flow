import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, Shield } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { useAuth } from '@hooks/useAuth';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const isAdmin = useAppSelector((s) => s.auth.user?.role === 'admin');
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
      >
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-surface-elevated py-1 shadow-card-hover">
          <div className="border-b border-border px-4 py-2">
            <p className="truncate text-sm font-medium text-content">{user?.name}</p>
            <p className="truncate text-xs text-content-muted">{user?.email}</p>
          </div>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-surface-muted" onClick={() => setOpen(false)}>
              <Shield className="h-4 w-4" /> Admin Panel
            </Link>
          )}
          <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-muted" onClick={() => setOpen(false)}>
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-surface-muted" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};
