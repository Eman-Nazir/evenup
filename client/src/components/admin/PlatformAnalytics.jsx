import { motion } from 'framer-motion';
import { Users, UsersRound, Receipt, HandCoins } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { key: 'totalGroups', label: 'Total Groups', icon: UsersRound, color: 'text-purple-600 bg-purple-50' },
  { key: 'totalExpenses', label: 'Total Expenses', icon: Receipt, color: 'text-amber-600 bg-amber-50' },
  { key: 'totalSettlements', label: 'Settlements', icon: HandCoins, color: 'text-green-600 bg-green-50' },
];

export default function PlatformAnalytics({ stats }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-white p-5"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats[key] ?? 0}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-sm text-slate-500">Total expense volume</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(stats.totalExpenseVolume || 0)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {stats.newUsersThisWeek || 0} new users this week
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">User growth</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={stats.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}