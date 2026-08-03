import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAdminSettlements } from '../../features/admin/useAdminSettlements';
import { Button, Badge } from '../ui';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function SettlementTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSettlements(page);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Transaction</th>
              <th className="px-4 py-3 font-medium">Group</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : data?.settlements.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No settlements found</td></tr>
            ) : (
              data?.settlements.map((s) => (
                <tr key={s._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                      {s.from?.name} <ArrowRight size={13} className="text-slate-400" /> {s.to?.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.group?.icon} {s.group?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.method === 'online' ? 'primary' : 'default'} className="capitalize">
                      {s.method}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatCurrency(s.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 sm:hidden">
        {data?.settlements.map((s) => (
          <div key={s._id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                {s.from?.name} <ArrowRight size={12} className="text-slate-400" /> {s.to?.name}
              </div>
              <p className="font-semibold text-green-600">{formatCurrency(s.amount)}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {s.group?.icon} {s.group?.name} · {s.method} · {formatDate(s.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm text-slate-500">
          <span>Page {page} of {data.pagination.totalPages} · {data.pagination.total} total settlements</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button size="sm" variant="secondary" disabled={page === data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}