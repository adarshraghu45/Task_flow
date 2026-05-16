import type { HTMLAttributes } from 'react';
import { cn } from '@lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-muted text-content',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400',
};

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className,
    )}
    {...props}
  />
);
