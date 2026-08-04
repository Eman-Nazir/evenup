import { Receipt, HandCoins, Repeat } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function RecentActivityFeed({ feed = [] }) {
  if (feed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feed.map((item) => {
        const isRecurringRelated = item.type === 'expense' && (item.isRecurring || item.recurrence?.parentExpense);

        return (
          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  item.type === 'expense' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}
              >
                {item.type === 'expense' ? <Receipt size={16} /> : <HandCoins size={16} />}
              </div>
              <div className="min-w-0">
                {item.type === 'expense' ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium text-slate-900">{item.description}</p>
                      {isRecurringRelated && (
                        <span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          <Repeat size={10} /> Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.actor?.name} added this expense · {formatDate(item.createdAt)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.from?.name} paid {item.to?.name}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {item.method} · {formatDate(item.createdAt)}
                    </p>
                  </>
                )}
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold text-slate-900">
              {formatCurrency(item.amount)}
            </p>
          </div>
        );
      })}
    </div>
  );
}