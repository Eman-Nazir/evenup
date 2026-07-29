import clsx from 'clsx';

const variants = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-600',
  warning: 'bg-amber-100 text-amber-700',
  primary: 'bg-primary/10 text-primary',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}