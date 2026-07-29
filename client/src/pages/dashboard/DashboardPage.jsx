import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Receipt, HandCoins, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { useDashboardSummary } from '../../features/dashboard/useDashboardSummary';
import { useCountUp } from '../../hooks/useCountUp';
import { Button, Card } from '../../components/ui';
import { DashboardChartSkeleton } from '../../components/ui/Skeleton';
import SpendingChart from '../../components/dashboard/SpendingChart';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function HeroBalanceCard({ user, balance, isLoading }) {
  const animated = useCountUp(Math.abs(balance || 0));
  const isOwed = balance > 0.01;
  const owes = balance < -0.01;

  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-violet-700 p-7 text-white shadow-lg shadow-primary/20"
    >
      {/* signature motif: concentric "split" rings, decorative only */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-16 top-16 h-24 w-24 rounded-full border border-white/10" />

      <div className="relative">
        <div className="flex items-center gap-1.5 text-sm text-white/70">
          <Sparkles size={14} />
          <span>Hi {user?.name?.split(' ')[0]}, here's where you stand</span>
        </div>

        {isLoading ? (
          <div className="mt-4 h-10 w-48 animate-pulse rounded-lg bg-white/20" />
        ) : (
          <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {balance === 0 ? "You're all settled up" : formatCurrency(animated)}
          </p>
        )}

        {!isLoading && balance !== 0 && (
          <p className="mt-1 text-sm text-white/80">
            {isOwed ? "You're owed money overall" : owes ? 'You owe money overall' : ''}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/groups">
            <Button variant="secondary" size="sm" className="!bg-white !text-primary hover:!bg-white/90">
              <Plus size={15} /> New group
            </Button>
          </Link>
          <Link to="/groups">
            <Button variant="ghost" size="sm" className="!text-white hover:!bg-white/10">
              View all groups <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function GroupsStrip({ groups }) {
  if (!groups?.length) {
    return (
      <Card className="text-center">
        <p className="text-slate-500">No groups yet — create your first one to get started.</p>
      </Card>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {groups.map((g) => (
        <Link
          key={g._id}
          to={`/groups/${g._id}`}
          className="flex min-w-[150px] shrink-0 flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg">
            {g.icon}
          </span>
          <div>
            <p className="truncate text-sm font-semibold text-slate-900">{g.name}</p>
            <p className="text-xs text-slate-400">{g.members.length} members</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ActivityList({ activity }) {
  if (!activity?.length) {
    return (
      <Card className="text-center text-sm text-slate-400">
        No activity yet — add an expense to see it here.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activity.map((a) => (
        <div key={`${a.type}-${a.id}`} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              a.type === 'expense' ? 'bg-indigo-50 text-primary' : 'bg-emerald-50 text-success'
            }`}>
              {a.type === 'expense' ? <Receipt size={16} /> : <HandCoins size={16} />}
            </div>
            <div className="min-w-0">
              {a.type === 'expense' ? (
                <>
                  <p className="truncate text-sm font-medium text-slate-900">{a.description}</p>
                  <p className="text-xs text-slate-500">{a.group?.icon} {a.group?.name} · {formatDate(a.createdAt)}</p>
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {a.from?.name} paid {a.to?.name}
                  </p>
                  <p className="text-xs text-slate-500">{a.group?.icon} {a.group?.name} · {formatDate(a.createdAt)}</p>
                </>
              )}
            </div>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-900">{formatCurrency(a.amount)}</p>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: summary, isLoading } = useDashboardSummary();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <HeroBalanceCard user={user} balance={summary?.netBalance || 0} isLoading={isLoading} />

      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-slate-400">Your groups</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{summary?.totalGroups ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Recent activity</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{summary?.activity?.length ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Spending categories</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{summary?.spendingByCategory?.length ?? '—'}</p>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Your groups</h3>
          <Link to="/groups" className="text-xs font-medium text-primary hover:underline">See all</Link>
        </div>
        <GroupsStrip groups={summary?.groups} />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Recent activity</h3>
          {isLoading ? <DashboardChartSkeleton /> : <ActivityList activity={summary?.activity} />}
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Where your money goes</h3>
          {isLoading ? <DashboardChartSkeleton /> : <SpendingChart data={summary?.spendingByCategory || []} />}
        </div>
      </motion.div>
    </motion.div>
  );
}