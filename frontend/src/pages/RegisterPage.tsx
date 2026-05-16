import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle, Button } from '@components/ui';
import { FormField } from '@components/forms/FormField';
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Get started with TaskFlow Manager</CardDescription>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            error={errors.name}
            {...register('name')}
          />
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
          <FormField
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-content-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
