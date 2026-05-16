import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Mail, KeyRound } from 'lucide-react';
import { AuthCard } from '@components/auth/AuthCard';
import { AuthModeTabs, type AuthMode } from '@components/auth/AuthModeTabs';
import { AuthField } from '@components/auth/AuthField';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useAuth } from '@hooks/useAuth';
import { ADMIN_CREDENTIALS } from '@lib/constants';
import { cn } from '@lib/cn';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('user');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (mode === 'admin') {
      reset({
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
      });
    } else {
      reset({ email: '', password: '' });
    }
  }, [mode, reset]);

  const onSubmit = (data: LoginFormData) => void login(data.email, data.password, mode === 'admin');

  return (
    <AuthCard
      title={mode === 'admin' ? 'Admin sign in' : 'Welcome back'}
      subtitle={
        mode === 'admin'
          ? 'Use the platform administrator credentials below'
          : 'Sign in to your TaskFlow workspace'
      }
      footer={
        <p className="text-center text-sm text-violet-200/50">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-violet-400 hover:text-violet-300">
            Create account
          </Link>
        </p>
      }
    >
      <AuthModeTabs mode={mode} onChange={setMode} />

      {mode === 'admin' && (
        <div className="mb-5 space-y-3">
          <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-100/80">
              Default admin account — fields are pre-filled. Change credentials in{' '}
              <code className="rounded bg-black/30 px-1 text-amber-200">backend/.env</code> and{' '}
              <code className="rounded bg-black/30 px-1 text-amber-200">frontend/.env</code>.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1e1830]/80 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
              Administrator credentials
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-violet-100/90">
                <Mail className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-violet-300/60">Email:</span>
                <span className="font-mono">{ADMIN_CREDENTIALS.email}</span>
              </div>
              <div className="flex items-center gap-2 text-violet-100/90">
                <KeyRound className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-violet-300/60">Password:</span>
                <span className="font-mono">{ADMIN_CREDENTIALS.password}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          label={mode === 'admin' ? 'Admin email' : 'Email'}
          type="email"
          placeholder={mode === 'admin' ? ADMIN_CREDENTIALS.email : 'you@company.com'}
          autoComplete="email"
          error={errors.email}
          {...register('email')}
        />
        <AuthField
          label={mode === 'admin' ? 'Admin password' : 'Password'}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
          {...register('password')}
        />
        {mode === 'user' && (
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
              Forgot password?
            </Link>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all',
            'disabled:cursor-not-allowed disabled:opacity-60',
            mode === 'admin'
              ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/40'
              : 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/40',
          )}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              {mode === 'admin' ? <Shield className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              {mode === 'admin' ? 'Sign in as Admin' : 'Sign in'}
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
};
