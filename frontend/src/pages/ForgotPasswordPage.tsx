import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from '@components/auth/AuthCard';
import { AuthField } from '@components/auth/AuthField';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth.schema';
import { useAuth } from '@hooks/useAuth';

export const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => void forgotPassword(data.email);

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="We'll send a reset link to your email (check backend console in dev)"
      footer={
        <p className="text-center text-sm text-violet-200/50">
          <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300">
            ← Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email}
          {...register('email')}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 disabled:opacity-60"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Send reset link'
          )}
        </button>
      </form>
    </AuthCard>
  );
};
