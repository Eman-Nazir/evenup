import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { useLogout } from '../../features/auth/useLogout';
import { Avatar } from '../ui';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-6">
      <Link to="/dashboard" className="text-lg font-bold text-primary">
        EvenUp
      </Link>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Avatar name={user?.name} src={user?.avatar?.url} size="sm" />
          <span className="hidden sm:inline">{user?.name}</span>
        </Link>
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}