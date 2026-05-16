import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminDataTable } from '@components/admin/AdminDataTable';
import { adminApi } from '@services/admin.service';

interface AuditRow {
  id: string;
  action: string;
  targetType: string;
  targetId?: string;
  ipAddress?: string;
  createdAt: string;
  admin?: { name?: string; email?: string };
}

export const AdminAuditPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () => adminApi.listAuditLogs({ page: '1', limit: '50' }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
        <p className="text-sm text-violet-300/50">Admin activity trail for compliance</p>
      </div>
      <AdminDataTable<AuditRow>
        isLoading={isLoading}
        data={(data?.items as AuditRow[]) ?? []}
        columns={[
          { key: 'action', header: 'Action', render: (r) => r.action },
          { key: 'admin', header: 'Admin', render: (r) => r.admin?.name || r.admin?.email || '—' },
          { key: 'target', header: 'Target', render: (r) => `${r.targetType}${r.targetId ? ` #${r.targetId.slice(-6)}` : ''}` },
          { key: 'ip', header: 'IP', render: (r) => r.ipAddress || '—' },
          { key: 'date', header: 'When', render: (r) => format(new Date(r.createdAt), 'MMM d, HH:mm') },
        ]}
      />
    </div>
  );
};
