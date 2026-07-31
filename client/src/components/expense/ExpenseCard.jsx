import { Repeat, Utensils, Home, Car, Film, Lightbulb, ShoppingBag, Package } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatDate.js'; 

const categoryIcons = {
  food: Utensils,
  rent: Home,
  transport: Car,
  entertainment: Film,
  utilities: Lightbulb,
  shopping: ShoppingBag,
  other: Package,
};

export default function ExpenseCard({ expense, onClick }) {
  const isRecurringRelated = expense.isRecurring || expense.recurrence?.parentExpense;
  const CategoryIcon = categoryIcons[expense.category] || Package;

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <CategoryIcon size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-medium text-slate-900">{expense.description}</p>
            {isRecurringRelated && (
              <span
                className="flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                title="Recurring expense"
              >
                <Repeat size={10} /> Recurring
              </span>
            )}
          </div>
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