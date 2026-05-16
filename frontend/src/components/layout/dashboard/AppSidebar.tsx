import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Zap } from 'lucide-react';
import { cn } from '@lib/cn';
import { SidebarFooter } from './SidebarFooter';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/team', label: 'Team', icon: Users },
];

interface AppSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export const AppSidebar = ({ mobile, onNavigate }: AppSidebarProps) => {
  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/50">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-content">TaskFlow</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-widest text-content-muted">NAVIGATION</p>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'nav-active'
                    : 'text-content-muted hover:bg-surface-muted hover:text-content',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <SidebarFooter onNavigate={onNavigate} />
    </div>
  );

  if (mobile) return content;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface-elevated md:flex md:flex-col">
      {content}
    </aside>
  );
};
