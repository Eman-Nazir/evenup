import { useState } from 'react';
import { useAdminExpenses } from '../../features/admin/useAdminExpenses';
import { Button, Badge } from '../ui';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const categoryIcons = {
  food: '🍔', rent: '🏠', transport: '🚗', entertainment: '🎬',
  utilities: '💡', shopping: '🛍️', other: '📦',
};

export default function ExpenseTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminExpenses(page);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Group</th>
              <th className="px-4 py-3 font-medium">Paid by</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : data?.expenses.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No expenses found</td></tr>
            ) : (
              data?.expenses.map((e) => (
                <tr key={e._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{e.description}</td>
                  <td className="px-4 py-3 text-slate-600">{e.group?.icon} {e.group?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{e.paidBy?.[0]?.user?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge className="capitalize">{categoryIcons[e.category]} {e.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(e.createdAt)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {formatCurrency(e.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 sm:hidden">
        {data?.expenses.map((e) => (
          <div key={e._id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">{e.description}</p>
              <p className="font-semibold text-slate-900">{formatCurrency(e.amount)}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {e.group?.icon} {e.group?.name} · Paid by {e.paidBy?.[0]?.user?.name} · {formatDate(e.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm text-slate-500">
          <span>Page {page} of {data.pagination.totalPages} · {data.pagination.total} total expenses</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button size="sm" variant="secondary" disabled={page === data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}