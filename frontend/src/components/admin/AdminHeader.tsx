import { useEffect } from 'react';
import { Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '@hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCommandPaletteOpen } from '@features/admin/adminSlice';
import { UserMenu } from '@components/layout/dashboard/UserMenu';

export const AdminHeader = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(true));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0f0c1a]/80 px-4 backdrop-blur-md md:px-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Admin Console</h1>
        <p className="text-xs text-violet-300/50">
          {user?.name} · {(user?.adminRole || 'admin').replace('_', ' ')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(setCommandPaletteOpen(true))}
          className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-violet-200/60 hover:text-white md:flex"
        >
          <Search className="h-4 w-4" />
          Search...
          <kbd className="rounded bg-black/30 px-1.5 text-[10px]">⌘K</kbd>
        </button>
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-violet-200/80 hover:bg-white/5"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <UserMenu />
      </div>
    </header>
  );
};
