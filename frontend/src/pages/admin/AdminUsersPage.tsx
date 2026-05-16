import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminDataTable } from '@components/admin/AdminDataTable';
import { AdminPagination } from '@components/admin/AdminPagination';
import { adminApi } from '@services/admin.service';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setUserFilters } from '@features/admin/adminSlice';
import type { AdminUser } from '@/types/admin';

export const AdminUsersPage = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.admin.userFilters);

  const params = {
    page: String(filters.page),
    limit: String(filters.limit),
    search: filters.search || undefined,
    role: filters.role || undefined,
    status: filters.status || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.listUsers(params),
  });

  const suspend = useMutation({
    mutationFn: (id: string) => adminApi.suspendUser(id, 'Suspended by admin'),
    onSuccess: () => {
      toast.success('User suspended');
      void qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const remove = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      toast.success('User deleted');
      void qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-sm text-violet-300/50">{data?.total ?? 0} users total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/50" />
            <input
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => dispatch(setUserFilters({ search: e.target.value, page: 1 }))}
              className="h-10 rounded-xl border border-white/10 bg-[#1e1830] pl-10 pr-4 text-sm text-white"
            />
          </div>
          <select
            value={filters.role}
            onChange={(e) => dispatch(setUserFilters({ role: e.target.value, page: 1 }))}
            className="h-10 rounded-xl border border-white/10 bg-[#1e1830] px-3 text-sm text-white"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => dispatch(setUserFilters({ status: e.target.value, page: 1 }))}
            className="h-10 rounded-xl border border-white/10 bg-[#1e1830] px-3 text-sm text-white"
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <AdminDataTable<AdminUser>
        isLoading={isLoading}
        data={data?.items ?? []}
        columns={[
          { key: 'name', header: 'Name', render: (u) => <span className="font-medium">{u.name}</span> },
          { key: 'email', header: 'Email', render: (u) => u.email },
          {
            key: 'role',
            header: 'Role',
            render: (u) => (
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
                {u.adminRole || u.role}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (u) => (
              <span className={u.isActive ? 'text-green-400' : 'text-red-400'}>
                {u.isActive ? 'Active' : 'Suspended'}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (u) => (
              <div className="flex gap-1">
                <button
                  type="button"
                  title="Suspend"
                  onClick={() => suspend.mutate(u.id)}
                  className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20"
                >
                  <Ban className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => {
                    if (confirm('Delete this user?')) remove.mutate(u.id);
                  }}
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
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={(p) => dispatch(setUserFilters({ page: p }))}
        />
      )}
    </div>
  );
};
