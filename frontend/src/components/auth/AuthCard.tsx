import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => (
  <div className="rounded-2xl border border-white/10 bg-[#141022]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-violet-200/60">{subtitle}</p>
    </div>
    {children}
    {footer && <div className="mt-6 border-t border-white/10 pt-6">{footer}</div>}
  </div>
);
