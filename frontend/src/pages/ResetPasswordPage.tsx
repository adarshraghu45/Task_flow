import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from '@components/auth/AuthCard';
import { AuthField } from '@components/auth/AuthField';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth.schema';
import { useAuth } from '@hooks/useAuth';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { resetPassword, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    void resetPassword(token, data.password);
  };

  if (!token) {
    return (
      <AuthCard title="Invalid link" subtitle="Reset token is missing or expired.">
        <Link
          to="/forgot-password"
          className="flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Request new link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset password" subtitle="Choose a strong new password">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          label="New password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          {...register('password')}
        />
        <AuthField
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Reset password'
          )}
        </button>
      </form>
    </AuthCard>
  );
};
