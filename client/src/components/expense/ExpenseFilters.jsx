import clsx from 'clsx';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'food', label: '🍔 Food' },
  { value: 'rent', label: '🏠 Rent' },
  { value: 'transport', label: '🚗 Transport' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'utilities', label: '💡 Utilities' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'other', label: '📦 Other' },
];

export default function ExpenseFilters({ activeCategory, onCategoryChange }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={clsx(
            'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
            activeCategory === cat.value
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}