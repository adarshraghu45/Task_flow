import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => (
  <div
    className={cn(
      'rounded-xl border border-border bg-surface-elevated p-6 shadow-card transition-shadow hover:shadow-card-hover',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }: CardProps) => (
  <div className={cn('mb-4 space-y-1', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: CardProps) => (
  <h3 className={cn('text-lg font-semibold text-content', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: CardProps) => (
  <p className={cn('text-sm text-content-muted', className)} {...props}>
    {children}
  </p>
);
