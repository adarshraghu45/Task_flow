import { Menu, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@store/hooks';
import { toggleSidebar } from '@features/ui/uiSlice';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from '../ThemeToggle';

interface AppNavbarProps {
  onMobileMenu: () => void;
}

export const AppNavbar = ({ onMobileMenu }: AppNavbarProps) => {
  const dispatch = useAppDispatch();

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur-md"
    >
      <button type="button" className="rounded-lg p-2 hover:bg-surface-muted md:hidden" onClick={onMobileMenu}>
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="hidden rounded-lg p-2 hover:bg-surface-muted md:block"
        onClick={() => dispatch(toggleSidebar())}
      >
        <Menu className="h-5 w-5" />
      </button>
      <WorkspaceSwitcher />
      <div className="hidden flex-1 md:block">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
          <input
            type="search"
            placeholder="Search tasks..."
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <NotificationDropdown />
        <UserMenu />
      </div>
    </motion.header>
  );
};
