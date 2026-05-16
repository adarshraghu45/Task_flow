import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { StatusBadge } from '@components/ui/StatusBadge';
import type { DashboardData } from '@app-types/index';
import { format } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  todo: '#64748b',
  in_progress: '#3b82f6',
  review: '#f97316',
  done: '#22c55e',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#64748b',
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

interface DashboardWidgetsProps {
  data: DashboardData;
  workspaceName?: string;
}

export const DashboardWidgets = ({ data, workspaceName }: DashboardWidgetsProps) => {
  const statusData = data.statusBreakdown.map((s) => ({
    name: STATUS_LABELS[s._id] || s._id,
    value: s.count,
    key: s._id,
  }));

  const priorityData = ['urgent', 'high', 'medium', 'low'].map((p) => {
    const found = data.priorityBreakdown.find((x) => x._id === p);
    return { name: PRIORITY_LABELS[p], count: found?.count ?? 0, key: p };
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass-card p-5">
        <h3 className="mb-4 font-semibold text-content">Task Status</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {statusData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || '#8b5cf6'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a162e', border: '1px solid #2d2644', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-content-muted">
          {statusData.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[s.key] }} />
              {s.name} ({s.value})
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-4 font-semibold text-content">Tasks by Priority</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1a162e', border: '1px solid #2d2644', borderRadius: 8 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry) => (
                  <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-content">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            Overdue Tasks
          </h3>
          {data.summary.overdue > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {data.summary.overdue}
            </span>
          )}
        </div>
        <div className="space-y-3">
          {data.overdueTasks.length === 0 ? (
            <p className="text-sm text-content-muted">No overdue tasks</p>
          ) : (
            data.overdueTasks.map((t) => (
              <div key={t.id} className="rounded-lg border border-border/50 bg-surface-muted/30 p-3">
                <p className="text-sm font-medium text-content">{t.title}</p>
                <p className="mt-1 text-xs text-content-muted">
                  <span className="text-red-400">
                    Due {t.dueDate ? format(new Date(t.dueDate), 'MMM d') : '—'}
                  </span>
                  {workspaceName && ` • ${workspaceName}`}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-4 font-semibold text-content">Recent Tasks</h3>
        <div className="space-y-3">
          {data.recentTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-surface-muted/30 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-content">{t.title}</p>
                {workspaceName && <p className="text-xs text-content-muted">{workspaceName}</p>}
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
        <Link to="/projects" className="mt-4 inline-block text-sm font-medium text-violet-400 hover:text-violet-300">
          View all projects →
        </Link>
      </div>
    </div>
  );
};
