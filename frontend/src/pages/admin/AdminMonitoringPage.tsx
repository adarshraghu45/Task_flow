import { useQuery } from '@tanstack/react-query';
import { Activity, Database, Server, Cpu } from 'lucide-react';
import { adminApi } from '@services/admin.service';
import { AdminStatCard } from '@components/admin/AdminStatCard';

export const AdminMonitoringPage = () => {
  const { data: health, isLoading } = useQuery({
    queryKey: ['admin-health'],
    queryFn: adminApi.getHealth,
    refetchInterval: 15000,
  });

  if (isLoading || !health) return <p className="text-violet-300/50">Loading system health...</p>;

  const services = health.services as Record<string, string>;
  const metrics = health.metrics as Record<string, number>;
  const system = health.system as Record<string, number | string>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Monitoring</h2>
        <p className="text-sm text-violet-300/50">
          Status: <span className="text-green-400">{health.status}</span> · Uptime: {Math.floor(health.uptime / 60)}m
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="API Response" value={`${metrics.avgResponseMs}ms`} icon={Activity} tone="green" />
        <AdminStatCard title="Req/min" value={metrics.requestsPerMinute} icon={Server} tone="blue" />
        <AdminStatCard title="Memory Used" value={`${system.memoryUsedMb}MB`} icon={Cpu} tone="amber" />
        <AdminStatCard title="Error Rate" value={`${metrics.errorRate}%`} icon={Database} tone="red" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
        <h3 className="mb-4 font-semibold text-white">Services</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(services).map(([name, status]) => (
            <div key={name} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="capitalize text-violet-200/80">{name}</span>
              <span className={status === 'healthy' || status === 'operational' ? 'text-green-400' : 'text-red-400'}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
