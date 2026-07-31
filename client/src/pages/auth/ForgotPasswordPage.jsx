import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import AuthLayout from '../../components/layout/AuthLayout';
import { useForgotPassword } from '../../features/auth/useForgotPassword';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = ({ email }) => forgotPassword(email);

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
      <p className="mt-1 text-sm text-slate-500">We'll email you a reset link</p>

      {isSuccess ? (
        <p className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          Check your inbox for a reset link. It expires in 15 minutes.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Button type="submit" className="w-full" isLoading={isPending}>Send reset link</Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-medium text-primary hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}