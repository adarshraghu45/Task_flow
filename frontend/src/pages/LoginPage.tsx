import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle, Button } from '@components/ui';
import { FormField } from '@components/forms/FormField';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useAuth } from '@hooks/useAuth';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => void login(data.email, data.password);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your TaskFlow account</CardDescription>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email}
            {...register('email')}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register('password')}
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-content-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
