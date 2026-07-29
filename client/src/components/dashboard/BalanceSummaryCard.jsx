import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BalanceSummaryCard({ userId, balances = {}, members = [] }) {
  const myBalance = balances[userId] || 0;
  const isOwed = myBalance > 0.01;
  const owes = myBalance < -0.01;
  const isEven = !isOwed && !owes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <p className="text-sm text-slate-500">Your overall balance</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          isOwed ? 'text-green-600' : owes ? 'text-red-500' : 'text-slate-900'
        }`}
      >
        {isEven ? 'All settled up' : formatCurrency(Math.abs(myBalance))}
      </p>
      {!isEven && (
        <p className="mt-1 text-sm text-slate-500">
          {isOwed ? "You're owed money overall" : 'You owe money overall'}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        {members
          .filter((m) => m.user._id !== userId)
          .map((m) => {
            const bal = balances[m.user._id] || 0;
            return (
              <div key={m.user._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-slate-600">{m.user.name}</span>
                <span
                  className={
                    bal > 0.01 ? 'text-green-600' : bal < -0.01 ? 'text-red-500' : 'text-slate-400'
                  }
                >
                  {bal === 0 ? '—' : formatCurrency(Math.abs(bal))}
                </span>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
}