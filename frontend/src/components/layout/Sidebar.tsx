import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@lib/cn';
import { useAppSelector } from '@store/hooks';
import type { UserRole } from '@app-types/index';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/team', label: 'Team', icon: '👥' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
  { to: '/admin', label: 'Admin', icon: '🛡️', adminOnly: true },
];

export const Sidebar = () => {
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const role = useAppSelector((state) => state.auth.user?.role) as UserRole | undefined;

  const visibleItems = navItems.filter((item) => !item.adminOnly || role === 'admin');

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 72 }}
      className="hidden shrink-0 border-r border-border bg-surface-elevated md:block"
    >
      <nav className="flex flex-col gap-1 p-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-content-muted hover:bg-surface-muted hover:text-content',
              )
            }
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};
