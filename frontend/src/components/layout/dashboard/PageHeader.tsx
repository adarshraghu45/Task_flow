import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@hooks/useTheme';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-content md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-content-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-elevated text-content-muted transition-colors hover:text-content"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};
