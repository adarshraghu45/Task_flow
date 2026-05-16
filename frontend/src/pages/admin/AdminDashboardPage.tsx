import { useQuery } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  FolderKanban,
  ListTodo,
  DollarSign,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { AdminStatCard } from '@components/admin/AdminStatCard';
import { adminApi } from '@services/admin.service';

const COLORS = ['#64748b', '#3b82f6', '#f97316', '#22c55e'];
const CHART_STYLE = { background: '#141022', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 };

export const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 60000,
  });

  if (isLoading || !data) {
    return <p className="text-violet-300/50">Loading dashboard...</p>;
  }

  const { overview, revenue, charts, aiUsage } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
        <p className="text-sm text-violet-300/50">Real-time metrics across TaskFlow</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Total Users" value={overview.totalUsers} change={`+${overview.newUsersWeek} this week`} icon={Users} />
        <AdminStatCard title="Active Users (24h)" value={overview.activeUsers} icon={UserCheck} tone="green" />
        <AdminStatCard title="Workspaces" value={overview.totalWorkspaces} icon={FolderKanban} tone="blue" />
        <AdminStatCard title="Total Tasks" value={overview.totalTasks} change={`${overview.completionRate}% done`} icon={ListTodo} />
        <AdminStatCard title="Monthly Revenue" value={`$${revenue.monthly.toLocaleString()}`} icon={DollarSign} tone="amber" />
        <AdminStatCard title="Active Subscriptions" value={revenue.activeSubscriptions} icon={DollarSign} tone="green" />
        <AdminStatCard title="Pending Reports" value={overview.pendingReports} icon={AlertTriangle} tone="red" />
        <AdminStatCard title="Active Sessions" value={overview.activeSessions} icon={Cpu} tone="violet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
          <h3 className="mb-4 font-semibold text-white">User Growth (30d)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
          <h3 className="mb-4 font-semibold text-white">Task Activity (30d)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.taskActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
          <h3 className="mb-4 font-semibold text-white">Task Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.statusBreakdown} dataKey="count" nameKey="_id" innerRadius={50} outerRadius={80}>
                  {charts.statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
          <h3 className="mb-4 font-semibold text-white">AI Usage Cost</h3>
          <div className="space-y-3">
            {[
              { name: 'OpenAI', ...aiUsage.openai, color: 'text-green-400' },
              { name: 'Gemini', ...aiUsage.gemini, color: 'text-blue-400' },
              { name: 'Claude', ...aiUsage.claude, color: 'text-orange-400' },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className={p.color}>{p.name}</span>
                <span className="text-sm text-violet-200/70">
                  {p.requests} req · ${p.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
