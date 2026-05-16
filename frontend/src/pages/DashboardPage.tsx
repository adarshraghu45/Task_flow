import { FolderKanban, ListTodo, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { StatCard } from '@components/ui/StatCard';
import { DashboardWidgets } from '@components/dashboard/DashboardWidgets';
import { PageHeader } from '@components/layout/dashboard/PageHeader';
import { useDashboard } from '@hooks/useDashboard';
import { useWorkspace } from '@hooks/useWorkspace';
import { useAppSelector } from '@store/hooks';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const DashboardPage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { current, currentWorkspaceId } = useWorkspace();
  const { data, isLoading } = useDashboard();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  if (!currentWorkspaceId) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Create or select a project to get started." />
        <p className="text-content-muted">Go to Projects to create your first workspace.</p>
      </div>
    );
  }

  const s = data?.summary;

  return (
    <div className="space-y-8">
      <PageHeader
        title={
          <>
            {greeting()},{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              {firstName}
            </span>
          </>
        }
        subtitle="Here's what's happening with your tasks today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Projects"
          value={isLoading ? '—' : (s?.projects ?? 0)}
          subtitle="Active workspaces"
          icon={FolderKanban}
          iconClassName="bg-violet-500/20 text-violet-400"
        />
        <StatCard
          title="My Tasks"
          value={isLoading ? '—' : (s?.myTasks ?? 0)}
          subtitle="Assigned to you"
          icon={ListTodo}
          iconClassName="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          title="Completed"
          value={isLoading ? '—' : (s?.completed ?? 0)}
          subtitle="All time"
          icon={CheckCircle2}
          iconClassName="bg-green-500/20 text-green-400"
        />
        <StatCard
          title="Overdue"
          value={isLoading ? '—' : (s?.overdue ?? 0)}
          subtitle="Need attention"
          icon={AlertTriangle}
          iconClassName="bg-red-500/20 text-red-400"
        />
        <StatCard
          title="Due Today"
          value={isLoading ? '—' : (s?.dueToday ?? 0)}
          subtitle="Today's deadlines"
          icon={Clock}
          iconClassName="bg-amber-500/20 text-amber-400"
        />
      </div>

      {data && <DashboardWidgets data={data} workspaceName={current?.name} />}
    </div>
  );
};
