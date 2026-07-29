import clsx from 'clsx';

const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' };

export default function Avatar({ name, src, size = 'md', className }) {
  const initial = name?.charAt(0).toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary',
        sizes[size],
        className
      )}
    >
      {initial}
    </div>
  );
}