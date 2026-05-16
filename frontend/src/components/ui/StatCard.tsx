import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@lib/cn';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, iconClassName }: StatCardProps) => (
  <motion.div className="glass-card p-5 transition-transform hover:scale-[1.01]">
    <div className="mb-4 flex items-start justify-between">
      <span className="text-sm font-medium text-content-muted">{title}</span>
      <div className={cn('rounded-lg p-2', iconClassName || 'bg-violet-500/20 text-violet-400')}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="text-3xl font-bold tracking-tight text-content">{value}</p>
    <p className="mt-1 text-sm text-content-muted">{subtitle}</p>
  </motion.div>
);
