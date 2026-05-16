import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  Flag,
  DollarSign,
  Activity,
  Settings,
  FileText,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@lib/cn';
import { Link } from 'react-router-dom';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/workspaces', label: 'Workspaces', icon: FolderKanban },
  { to: '/admin/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
  { to: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { to: '/admin/monitoring', label: 'Monitoring', icon: Activity },
  { to: '/admin/audit', label: 'Audit Logs', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = () => (
  <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0f0c1a] lg:flex">
    <div className="border-b border-white/10 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 shadow-lg shadow-amber-900/40">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white">TaskFlow</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">Admin Panel</p>
        </div>
      </div>
    </div>
    <nav className="flex-1 space-y-1 p-3">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-amber-600/20 text-amber-300 ring-1 ring-amber-500/30'
                : 'text-violet-200/60 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
    <div className="border-t border-white/10 p-3">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-violet-300/70 hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to App
      </Link>
    </div>
  </aside>
);
