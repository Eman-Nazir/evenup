import { motion } from 'framer-motion';
import { Users, UsersRound, Receipt, HandCoins, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { Card, Avatar } from '../ui';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-blue-600 bg-blue-50', tab: 'users' },
  { key: 'totalGroups', label: 'Total Groups', icon: UsersRound, color: 'text-purple-600 bg-purple-50', tab: 'groups' },
  { key: 'totalExpenses', label: 'Total Expenses', icon: Receipt, color: 'text-amber-600 bg-amber-50', tab: 'expenses' },
  { key: 'totalSettlements', label: 'Settlements', icon: HandCoins, color: 'text-green-600 bg-green-50', tab: 'settlements' },
];

export default function PlatformAnalytics({ stats, onNavigateTab }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-violet-700 p-7 text-white"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-20 top-16 h-24 w-24 rounded-full border border-white/10" />
        <div className="relative flex items-center gap-1.5 text-sm text-white/70">
          <Sparkles size={14} /> Platform overview
        </div>
        <p className="relative mt-2 text-3xl font-bold">
          {formatCurrency(stats.totalExpenseVolume || 0)} moved through EvenUp
        </p>
        <p className="relative mt-1 text-sm text-white/80">
          {stats.newUsersThisWeek || 0} new users joined this week
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color, tab }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            onClick={() => onNavigateTab(tab)}
            className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 text-left transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
              <ArrowRight size={14} className="text-slate-300" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats[key] ?? 0}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <p className="text-sm font-semibold text-slate-700">User growth</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Recent signups</p>
            <button
              onClick={() => onNavigateTab('users')}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>
          {stats.recentUsers?.length ? (
            <div className="space-y-2.5">
              {stats.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-2.5">
                  <Avatar name={u.name} src={u.avatar?.url} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{u.name}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No recent signups yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}