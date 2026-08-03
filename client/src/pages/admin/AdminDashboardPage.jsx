import { useState } from 'react';
import clsx from 'clsx';
import { useAdminStats } from '../../features/admin/useAdminStats';
import { DashboardChartSkeleton } from '../../components/ui/Skeleton';
import PlatformAnalytics from '../../components/admin/PlatformAnalytics';
import UserTable from '../../components/admin/UserTable';
import GroupTable from '../../components/admin/GroupTable';
import ExpenseTable from '../../components/admin/ExpenseTable';
import SettlementTable from '../../components/admin/SettlementTable';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'groups', label: 'Groups' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'settlements', label: 'Settlements' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Platform-wide overview and management</p>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'shrink-0 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        isLoading ? <DashboardChartSkeleton /> : <PlatformAnalytics stats={stats} onNavigateTab={setActiveTab} />
      )}
      {activeTab === 'users' && <UserTable />}
      {activeTab === 'groups' && <GroupTable />}
      {activeTab === 'expenses' && <ExpenseTable />}
      {activeTab === 'settlements' && <SettlementTable />}
    </div>
  );
}


