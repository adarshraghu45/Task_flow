import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@lib/cn';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  tone?: 'violet' | 'amber' | 'green' | 'red' | 'blue';
}

const tones = {
  violet: 'bg-violet-500/20 text-violet-400',
  amber: 'bg-amber-500/20 text-amber-400',
  green: 'bg-green-500/20 text-green-400',
  red: 'bg-red-500/20 text-red-400',
  blue: 'bg-blue-500/20 text-blue-400',
};

export const AdminStatCard = ({ title, value, change, icon: Icon, tone = 'violet' }: AdminStatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-2xl border border-white/10 bg-[#141022]/80 p-5 shadow-lg shadow-black/20"
  >
    <div className="mb-3 flex items-start justify-between">
      <span className="text-sm text-violet-200/60">{title}</span>
      <div className={cn('rounded-lg p-2', tones[tone])}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {change && <p className="mt-1 text-xs text-violet-300/50">{change}</p>}
  </motion.div>
);
