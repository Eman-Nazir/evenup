import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import AuthLayout from '../../components/layout/AuthLayout';
import PasswordStrengthChecklist from '../../components/auth/PasswordStrengthChecklist';
import { passwordSchema } from '../../lib/validation';
import { useResetPassword } from '../../features/auth/useResetPassword';

const schema = z.object({ password: passwordSchema });

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const passwordValue = watch('password') || '';

  const onSubmit = ({ password }) => {
    resetPassword({ token, password }, { onSuccess: () => navigate('/login') });
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
      <p className="mt-1 text-sm text-slate-500">Choose a new password for your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrengthChecklist password={passwordValue} />
        </div>
        <Button type="submit" className="w-full" isLoading={isPending}>
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}