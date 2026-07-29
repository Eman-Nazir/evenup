import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Input } from '../ui';

const TABS = [
  { key: 'equal', label: 'Equal' },
  { key: 'exact', label: 'Exact' },
  { key: 'percentage', label: 'Percentage' },
  { key: 'shares', label: 'Shares' },
];

export default function SplitTypeSelector({ members, amount, value, onChange }) {
  const [splitType, setSplitType] = useState(value?.splitType || 'equal');
  const [details, setDetails] = useState(
    members.map((m) => ({ user: m.user._id, name: m.user.name, value: 0 }))
  );

  useEffect(() => {
    onChange({ splitType, splitDetails: splitType === 'equal' ? [] : details });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitType, details]);

  const updateDetail = (userId, newValue) => {
    setDetails((prev) =>
      prev.map((d) => (d.user === userId ? { ...d, value: Number(newValue) } : d))
    );
  };

  const totalPercent = details.reduce((sum, d) => sum + (d.value || 0), 0);
  const totalExact = details.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Split type</label>
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSplitType(tab.key)}
            className={clsx(
              'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
              splitType === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {splitType === 'equal' && (
        <p className="mt-3 text-xs text-slate-400">
          Split equally among all {members.length} members.
        </p>
      )}

      {splitType !== 'equal' && (
        <div className="mt-3 space-y-2">
          {details.map((d) => (
            <div key={d.user} className="flex items-center gap-2">
              <span className="w-24 shrink-0 truncate text-sm text-slate-600">{d.name}</span>
              <Input
                type="number"
                step="0.01"
                placeholder={splitType === 'percentage' ? '%' : splitType === 'shares' ? 'shares' : 'amount'}
                value={d.value || ''}
                onChange={(e) => updateDetail(d.user, e.target.value)}
              />
            </div>
          ))}
          {splitType === 'percentage' && (
            <p className={clsx('text-xs', totalPercent === 100 ? 'text-green-600' : 'text-amber-500')}>
              Total: {totalPercent}% {totalPercent !== 100 && '(must equal 100%)'}
            </p>
          )}
          {splitType === 'exact' && (
            <p className={clsx('text-xs', Math.abs(totalExact - amount) < 0.05 ? 'text-green-600' : 'text-amber-500')}>
              Total: {totalExact} / {amount}
            </p>
          )}
        </div>
      )}
    </div>
  );
}