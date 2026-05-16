import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminDataTable } from '@components/admin/AdminDataTable';
import { AdminPagination } from '@components/admin/AdminPagination';
import { adminApi } from '@services/admin.service';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setTaskFilters } from '@features/admin/adminSlice';
import type { AdminTask } from '@/types/admin';

export const AdminTasksPage = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.admin.taskFilters);
  const params = {
    page: String(filters.page),
    limit: String(filters.limit),
    search: filters.search || undefined,
    status: filters.status || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tasks', params],
    queryFn: () => adminApi.listTasks(params),
  });

  const remove = useMutation({
    mutationFn: adminApi.deleteTask,
    onSuccess: () => {
      toast.success('Task deleted');
      void qc.invalidateQueries({ queryKey: ['admin-tasks'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Management</h2>
          <p className="text-sm text-violet-300/50">{data?.total ?? 0} tasks platform-wide</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => dispatch(setTaskFilters({ search: e.target.value, page: 1 }))}
            className="h-10 rounded-xl border border-white/10 bg-[#1e1830] px-4 text-sm text-white"
          />
          <select
            value={filters.status}
            onChange={(e) => dispatch(setTaskFilters({ status: e.target.value, page: 1 }))}
            className="h-10 rounded-xl border border-white/10 bg-[#1e1830] px-3 text-sm text-white"
          >
            <option value="">All status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <AdminDataTable<AdminTask>
        isLoading={isLoading}
        data={data?.items ?? []}
        columns={[
          { key: 'title', header: 'Title', render: (t) => t.title },
          { key: 'status', header: 'Status', render: (t) => t.status.replace('_', ' ') },
          { key: 'priority', header: 'Priority', render: (t) => t.priority },
          {
            key: 'actions',
            header: '',
            render: (t) => (
              <button
                type="button"
                onClick={() => { if (confirm('Delete task?')) remove.mutate(t.id); }}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />
      {data && (
        <AdminPagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => dispatch(setTaskFilters({ page: p }))} />
      )}
    </div>
  );
};
