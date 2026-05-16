import type { FieldError } from 'react-hook-form';
import { cn } from '@lib/cn';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const AuthField = ({ label, error, className, id, ...props }: AuthFieldProps) => {
  const fieldId = id || props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-violet-100/90">
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(
          'flex h-11 w-full rounded-xl border border-white/10 bg-[#1e1830] px-4 text-sm text-white',
          'placeholder:text-violet-300/30',
          'focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30',
          'autofill:text-white',
          error && 'border-red-500/80 focus:ring-red-500/30',
          className,
        )}
        {...props}
      />
      {error?.message && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
};
