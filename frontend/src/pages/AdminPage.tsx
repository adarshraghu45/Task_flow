import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@services/analytics.service';
import { Card, CardHeader, CardTitle } from '@components/ui';

export const AdminPage = () => {
  const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: analyticsApi.getAdminStats });
  const stats = data as { userCount?: number; workspaceCount?: number; taskCount?: number };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-content">Admin Panel</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-3xl">{stats?.userCount ?? 0}</CardTitle><p className="text-sm text-content-muted">Users</p></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-3xl">{stats?.workspaceCount ?? 0}</CardTitle><p className="text-sm text-content-muted">Workspaces</p></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-3xl">{stats?.taskCount ?? 0}</CardTitle><p className="text-sm text-content-muted">Tasks</p></CardHeader></Card>
      </div>
    </div>
  );
};
