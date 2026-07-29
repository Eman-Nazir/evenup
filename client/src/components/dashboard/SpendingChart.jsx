import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const COLORS = {
  food: '#f59e0b', rent: '#3b82f6', transport: '#10b981',
  entertainment: '#ec4899', utilities: '#eab308', shopping: '#8b5cf6', other: '#64748b',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <span className="font-medium capitalize">{item.name}</span>: {formatCurrency(item.value)}
    </div>
  );
};

export default function SpendingChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-400">
        No spending data yet
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Spending by category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.category] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', textTransform: 'capitalize' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}