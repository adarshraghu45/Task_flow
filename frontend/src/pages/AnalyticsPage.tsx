import { useQuery } from '@tanstack/react-query';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useWorkspace } from '@hooks/useWorkspace';
import { analyticsApi } from '@services/analytics.service';
import { Card, CardHeader, CardTitle } from '@components/ui';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

export const AnalyticsPage = () => {
  const { currentWorkspaceId } = useWorkspace();
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', currentWorkspaceId],
    queryFn: () => analyticsApi.getWorkspace(currentWorkspaceId!),
    enabled: !!currentWorkspaceId,
  });

  if (isLoading) return <p className="text-content-muted">Loading analytics...</p>;
  const analytics = data as {
    overview?: { totalTasks: number; completionRate: number; memberCount: number };
    statusBreakdown?: { _id: string; count: number }[];
    completionTrend?: { _id: string; completed: number }[];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-content">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-3xl">{analytics?.overview?.totalTasks ?? 0}</CardTitle><p className="text-sm text-content-muted">Total tasks</p></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-3xl">{analytics?.overview?.completionRate ?? 0}%</CardTitle><p className="text-sm text-content-muted">Completion rate</p></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-3xl">{analytics?.overview?.memberCount ?? 0}</CardTitle><p className="text-sm text-content-muted">Team members</p></CardHeader></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 font-semibold">Tasks by status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analytics?.statusBreakdown?.map((s) => ({ name: s._id, value: s.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="mb-4 font-semibold">Completion trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.completionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
