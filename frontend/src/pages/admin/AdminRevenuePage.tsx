import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AdminStatCard } from '@components/admin/AdminStatCard';
import { adminApi } from '@services/admin.service';

const revenueData = [
  { month: 'Jan', revenue: 8200 },
  { month: 'Feb', revenue: 9100 },
  { month: 'Mar', revenue: 10200 },
  { month: 'Apr', revenue: 11400 },
  { month: 'May', revenue: 12450 },
];

export const AdminRevenuePage = () => {
  const { data } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.getDashboard });
  const revenue = data?.revenue;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Revenue & Subscriptions</h2>
        <p className="text-sm text-violet-300/50">Stripe & Razorpay integration ready</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Monthly Revenue" value={`$${revenue?.monthly?.toLocaleString() ?? 0}`} icon={DollarSign} tone="green" />
        <AdminStatCard title="Yearly Revenue" value={`$${revenue?.yearly?.toLocaleString() ?? 0}`} icon={TrendingUp} tone="violet" />
        <AdminStatCard title="Active Subscriptions" value={revenue?.activeSubscriptions ?? 0} icon={CreditCard} tone="blue" />
        <AdminStatCard title="Failed Payments" value={revenue?.failedPayments ?? 0} icon={AlertCircle} tone="red" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
        <h3 className="mb-4 font-semibold text-white">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#141022', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
          <h3 className="font-semibold text-white">Stripe</h3>
          <p className="mt-2 text-sm text-violet-300/50">Connect Stripe in Settings to enable live payments.</p>
          <span className="mt-3 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">Not connected</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5">
          <h3 className="font-semibold text-white">Razorpay</h3>
          <p className="mt-2 text-sm text-violet-300/50">Connect Razorpay for India-based payments.</p>
          <span className="mt-3 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">Not connected</span>
        </div>
      </div>
    </div>
  );
};
