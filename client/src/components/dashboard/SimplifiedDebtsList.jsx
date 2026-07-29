import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SimplifiedDebtsList({ transactions = [], members = [], onSettle }) {
  const getMember = (id) => members.find((m) => m.user._id === id)?.user;

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">Everyone's settled up. 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t, i) => {
        const from = getMember(t.from);
        const to = getMember(t.to);
        return (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-900">{from?.name}</span>
              <ArrowRight size={14} className="text-slate-400" />
              <span className="font-medium text-slate-900">{to?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900">{formatCurrency(t.amount)}</span>
              <button
                onClick={() => onSettle(t)}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                Settle up
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}