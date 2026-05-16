import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle, Button } from '@components/ui';
import { FormField } from '@components/forms/FormField';
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send a reset link (check backend console in dev)
          </CardDescription>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email}
            {...register('email')}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send reset link
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-content-muted">
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
