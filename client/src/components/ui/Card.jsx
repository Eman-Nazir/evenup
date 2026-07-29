import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx('rounded-2xl border border-slate-100 bg-white p-5 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}