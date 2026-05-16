import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AdminDataTable } from '@components/admin/AdminDataTable';
import { AdminPagination } from '@components/admin/AdminPagination';
import { adminApi } from '@services/admin.service';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setWorkspaceFilters } from '@features/admin/adminSlice';
import type { AdminWorkspace } from '@/types/admin';

export const AdminWorkspacesPage = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.admin.workspaceFilters);
  const params = { page: String(filters.page), limit: String(filters.limit), search: filters.search || undefined };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-workspaces', params],
    queryFn: () => adminApi.listWorkspaces(params),
  });

  const suspend = useMutation({
    mutationFn: adminApi.suspendWorkspace,
    onSuccess: () => {
      toast.success('Workspace suspended');
      void qc.invalidateQueries({ queryKey: ['admin-workspaces'] });
    },
  });
  const remove = useMutation({
    mutationFn: adminApi.deleteWorkspace,
    onSuccess: () => {
      toast.success('Workspace deleted');
      void qc.invalidateQueries({ queryKey: ['admin-workspaces'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Workspace Management</h2>
          <p className="text-sm text-violet-300/50">{data?.total ?? 0} workspaces</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/50" />
          <input
            placeholder="Search workspaces..."
            value={filters.search}
            onChange={(e) => dispatch(setWorkspaceFilters({ search: e.target.value, page: 1 }))}
            className="h-10 rounded-xl border border-white/10 bg-[#1e1830] pl-10 pr-4 text-sm text-white"
          />
        </div>
      </div>
      <AdminDataTable<AdminWorkspace>
        isLoading={isLoading}
        data={data?.items ?? []}
        columns={[
          { key: 'name', header: 'Name', render: (w) => w.name },
          { key: 'members', header: 'Members', render: (w) => w.memberCount },
          { key: 'tasks', header: 'Tasks', render: (w) => w.taskCount },
          { key: 'date', header: 'Created', render: (w) => format(new Date(w.createdAt), 'MMM d, yyyy') },
          {
            key: 'status',
            header: 'Status',
            render: (w) => (
              <span className={w.isSuspended ? 'text-red-400' : 'text-green-400'}>
                {w.isSuspended ? 'Suspended' : 'Active'}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (w) => (
              <div className="flex gap-1">
                <button type="button" onClick={() => suspend.mutate(w.id)} className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20">
                  <Ban className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { if (confirm('Delete workspace?')) remove.mutate(w.id); }}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />
      {data && (
        <AdminPagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => dispatch(setWorkspaceFilters({ page: p }))} />
      )}
    </div>
  );
};
