import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const categoryIcons = {
  food: '🍔', rent: '🏠', transport: '🚗', entertainment: '🎬',
  utilities: '💡', shopping: '🛍️', other: '📦',
};

export default function ExpenseCard({ expense, onClick  }) {
  return (
    <div
     onClick={onClick}
      className=" flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg">
          {categoryIcons[expense.category] || '📦'}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{expense.description}</p>
          <p className="text-xs text-slate-500">
            Paid by {expense.paidBy[0]?.user?.name} · {formatDate(expense.date)}
          </p>
        </div>
      </div>
      <p className="shrink-0 font-semibold text-slate-900">
        {formatCurrency(expense.amount, expense.currency)}
      </p>
    </div>
  );
}