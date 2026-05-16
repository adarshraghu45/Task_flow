import { User, Shield } from 'lucide-react';
import { cn } from '@lib/cn';

export type AuthMode = 'user' | 'admin';

interface AuthModeTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export const AuthModeTabs = ({ mode, onChange }: AuthModeTabsProps) => (
  <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
    <button
      type="button"
      onClick={() => onChange('user')}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
        mode === 'user'
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
          : 'text-violet-200/60 hover:text-violet-100',
      )}
    >
      <User className="h-4 w-4" />
      Member
    </button>
    <button
      type="button"
      onClick={() => onChange('admin')}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
        mode === 'admin'
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
          : 'text-violet-200/60 hover:text-violet-100',
      )}
    >
      <Shield className="h-4 w-4" />
      Administrator
    </button>
  </div>
);
