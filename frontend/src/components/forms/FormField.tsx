import type { FieldError } from 'react-hook-form';
import { Input } from '@components/ui';
import { cn } from '@lib/cn';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const FormField = ({ label, error, className, id, ...props }: FormFieldProps) => (
  <Input
    id={id || props.name}
    label={label}
    error={error?.message}
    className={cn(className)}
    {...props}
  />
);
