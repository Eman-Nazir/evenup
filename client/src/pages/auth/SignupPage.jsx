import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import PasswordStrengthChecklist from '../../components/auth/PasswordStrengthChecklist';
import { passwordSchema } from '../../lib/validation';
import { useSignup } from '../../features/auth/useSignup';

const schema = z.object({
  name: z.string().min(2, 'Name is required').max(50),
  email: z.string().email('Enter a valid email'),
  password: passwordSchema,
});

export default function SignupPage() {
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const passwordValue = watch('password') || '';

  const onSubmit = (values) => {
    signup(values, { onSuccess: () => navigate('/dashboard') });
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-ink">
      {/* LEFT: animated brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-900 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 animate-blob rounded-full bg-white/20 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-80 w-80 animate-blob animation-delay-2000 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 animate-blob animation-delay-4000 rounded-full bg-primary-light/30 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">EvenUp</span>
        </div>

        <div className="relative z-10 max-w-md animate-fade-in-up text-white">
          <h2 className="text-3xl font-bold leading-tight">
            Join thousands<br />splitting smarter.
          </h2>
          <p className="mt-4 text-white/80">
            Create groups, log expenses in seconds, and settle up without the
            awkward math or the awkward conversation.
          </p>

          <ul className="mt-8 space-y-3">
            {['Free forever for personal use', 'Instant expense splitting', 'Settle up in one tap'].map((f, i) => (
              <li
                key={f}
                style={{ animationDelay: `${i * 100}ms` }}
                className="flex animate-fade-in-up items-center gap-2 text-sm text-white/90"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2" />
                  <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} EvenUp. All rights reserved.
        </p>
      </div>

      {/* RIGHT: form panel */}
      <div className="relative flex w-full items-center justify-center bg-bg px-6 py-12 lg:w-1/2">
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl lg:block" />

        <div className="relative w-full max-w-sm animate-fade-in-up rounded-2xl bg-surface p-8 shadow-xl shadow-slate-900/5 lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-ink">EvenUp</span>
          </div>

          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start splitting expenses the easy way
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
            autoComplete="off"
          >
            <div className="group relative">
              <Input
                label="Full name"
                placeholder="Eman Nazir"
                error={errors.name?.message}
                className="pl-10"
                autoComplete="off"
                {...register('name')}
              />
              <svg
                className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary"
                viewBox="0 0 24 24" fill="none"
              >
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>

            <div className="group relative">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                className="pl-10"
                autoComplete="off"
                {...register('email')}
              />
              <svg
                className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary"
                viewBox="0 0 24 24" fill="none"
              >
                <path d="M3 6l9 6 9-6M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <div className="group relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                  {...register('password')}
                />
                <svg
                  className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary"
                  viewBox="0 0 24 24" fill="none"
                >
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-[38px] text-slate-400 transition-colors hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.4 9.4 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1 2.2-1.9 3.2M6.6 6.6C4.5 8 3 10 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrengthChecklist password={passwordValue} />
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full bg-gradient-to-r from-primary to-primary-dark transition-transform duration-150 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary transition-colors hover:text-primary-dark hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}