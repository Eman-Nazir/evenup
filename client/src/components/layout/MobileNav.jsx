import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield ,  UserPlus } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../features/auth/useAuthStore';

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);
  const links = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/friends', label: 'Friends', icon: UserPlus },
  ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium',
              isActive ? 'text-primary' : 'text-slate-500'
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}