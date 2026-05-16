import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminDataTable } from '@components/admin/AdminDataTable';
import { AdminPagination } from '@components/admin/AdminPagination';
import { adminApi } from '@services/admin.service';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setReportFilters } from '@features/admin/adminSlice';
import type { AdminReport } from '@/types/admin';
import { format } from 'date-fns';

export const AdminReportsPage = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.admin.reportFilters);
  const params = { page: String(filters.page), limit: String(filters.limit), status: filters.status || undefined };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports', params],
    queryFn: () => adminApi.listReports(params),
  });

  const resolve = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.resolveReport(id, { status, resolution: 'Resolved by admin' }),
    onSuccess: () => {
      toast.success('Report updated');
      void qc.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Moderation</h2>
          <p className="text-sm text-violet-300/50">Review abuse and spam reports</p>
        </div>
        <select
          value={filters.status}
          onChange={(e) => dispatch(setReportFilters({ status: e.target.value, page: 1 }))}
          className="h-10 rounded-xl border border-white/10 bg-[#1e1830] px-3 text-sm text-white"
        >
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      <AdminDataTable<AdminReport>
        isLoading={isLoading}
        data={data?.items ?? []}
        columns={[
          { key: 'type', header: 'Type', render: (r) => r.type },
          { key: 'reason', header: 'Reason', render: (r) => r.reason },
          {
            key: 'reporter',
            header: 'Reporter',
            render: (r) => (r.reporter as { name?: string })?.name || '—',
          },
          { key: 'date', header: 'Date', render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">{r.status}</span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (r) =>
              r.status === 'pending' ? (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => resolve.mutate({ id: r.id, status: 'resolved' })}
                    className="text-xs text-green-400 hover:underline"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => resolve.mutate({ id: r.id, status: 'dismissed' })}
                    className="text-xs text-violet-400 hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              ) : null,
          },
        ]}
      />
      {data && (
        <AdminPagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => dispatch(setReportFilters({ page: p }))} />
      )}
    </div>
  );
};
