import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { AuthCard } from '@components/auth/AuthCard';
import { AuthField } from '@components/auth/AuthField';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { useAuth } from '@hooks/useAuth';

export const RegisterPage = () => {
  const { register: signUp, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) =>
    void signUp(data.name, data.email, data.password);

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start managing projects and tasks in minutes"
      footer={
        <p className="text-center text-sm text-violet-200/50">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
          {' · '}
          <Link to="/login" className="font-medium text-amber-400/90 hover:text-amber-300">
            Admin login
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          error={errors.name}
          {...register('name')}
        />
        <AuthField
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
          {...register('email')}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          error={errors.password}
          {...register('password')}
        />
        <AuthField
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <p className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs text-violet-200/50">
          Member accounts only. Administrator access is granted separately by a platform admin.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create account
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
};
