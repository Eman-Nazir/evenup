import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, User, Shield, Sparkles,UserPlus } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { Avatar, Badge } from '../ui';

const baseLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/friends', label: 'Friends', icon: UserPlus },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const links = user?.role === 'admin'
    ? [...baseLinks, { to: '/admin', label: 'Admin', icon: Shield }]
    : baseLinks;

  return (
     
     
     <aside className="hidden md:flex md:w-64 md:flex-col md:justify-between md:sticky md:top-16 md:h-[calc(100vh-4rem)] border-r border-slate-100 bg-white px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 text-white">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-bold text-slate-900">EvenUp</span>
        </div>

        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Menu</p>
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="relative block">
              {({ isActive }) => (
                <div
                  className={clsx(
                    'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative" />
                  <span className="relative">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {user && (
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-3">
          <Avatar name={user.name} src={user.avatar?.url} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            <Badge variant={user.role === 'admin' ? 'primary' : 'default'} className="mt-0.5 capitalize">
              {user.role}
            </Badge>
          </div>
        </div>
      )}
    </aside>
  );
}