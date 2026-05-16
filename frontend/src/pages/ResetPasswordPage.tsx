import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle, Button } from '@components/ui';
import { FormField } from '@components/forms/FormField';
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
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>Reset token is missing or expired.</CardDescription>
        </CardHeader>
        <Link to="/forgot-password">
          <Button>Request new link</Button>
        </Link>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="New password"
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
            Reset password
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
