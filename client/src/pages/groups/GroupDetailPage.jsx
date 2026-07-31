import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Button, Modal, ConfirmDialog } from '../../components/ui';
import { useGroupDetail } from '../../features/groups/useGroupDetail';
import { useExpenses } from '../../features/expenses/useExpenses';
import { useSimplifiedDebts } from '../../features/expenses/useSimplifiedDebts';
import { useGroupActivity } from '../../features/groups/useGroupActivity';
import { useSpendingByCategory } from '../../features/groups/useSpendingByCategory';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { useDeleteGroup } from '../../features/groups/useDeleteGroup';
import { ExpenseListSkeleton } from '../../components/ui/Skeleton';
import ExpenseCard from '../../components/expense/ExpenseCard';
import ExpenseForm from '../../components/expense/ExpenseForm';
import ExpenseFilters from '../../components/expense/ExpenseFilters';
import ExpenseDetailModal from '../../components/expense/ExpenseDetailModal';
import SettleUpModal from '../../components/expense/SettleUpModal';
import BalanceSummaryCard from '../../components/dashboard/BalanceSummaryCard';
import SimplifiedDebtsList from '../../components/dashboard/SimplifiedDebtsList';
import RecentActivityFeed from '../../components/dashboard/RecentActivityFeed';
import SpendingChart from '../../components/dashboard/SpendingChart';
import GroupMemberList from '../../components/group/GroupMemberList';
import EditGroupModal from '../../components/group/EditGroupModal';
import api from '../../lib/axios';

const TABS = [
  { key: 'expenses', label: 'Expenses' },
  { key: 'activity', label: 'Activity' },
  { key: 'insights', label: 'Insights' },
];

export default function GroupDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('expenses');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [settleTransaction, setSettleTransaction] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);

  const userId = useAuthStore((s) => s.user?._id);

  const { data: group, isLoading: groupLoading } = useGroupDetail(id);
  const { data: expenseData, isLoading: expensesLoading, isError } = useExpenses(id);
  const { data: debtsData, isLoading: debtsLoading } = useSimplifiedDebts(id);
  const { data: activityFeed, isLoading: activityLoading } = useGroupActivity(id);
  const { data: spendingData, isLoading: spendingLoading } = useSpendingByCategory(id);
  const { mutate: deleteGroup, isPending: isDeletingGroup } = useDeleteGroup();

  const isGroupAdmin = group?.members.find((m) => m.user._id === userId)?.role === 'admin';

  const filteredExpenses =
    expenseData?.expenses.filter(
      (e) => !activeCategory || e.category === activeCategory
    ) || [];

  const handleExport = async () => {
    const response = await api.get(`/groups/${id}/export-pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${group?.name || 'group'}-ledger.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl">
            {group?.icon || '👥'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {groupLoading ? '...' : group?.name}
              </h1>
              {isGroupAdmin && (
                <button
                  onClick={() => setIsEditGroupOpen(true)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary"
                  title="Edit group"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">{group?.members?.length || 0} members</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus size={16} /> Add expense
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download size={16} /> Export
          </Button>
          {isGroupAdmin && (
            <Button variant="danger" onClick={() => setIsDeleteGroupOpen(true)}>
              <Trash2 size={16} /> Delete group
            </Button>
          )}
        </div>
      </div>

      {/* Balance + Suggested settlements */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {!debtsLoading && group && (
          <BalanceSummaryCard
            userId={userId}
            balances={debtsData?.netBalances || {}}
            members={group.members}
          />
        )}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Suggested settlements</h3>
          {!debtsLoading && group && (
            <SimplifiedDebtsList
              transactions={debtsData?.transactions || []}
              members={group.members}
              onSettle={setSettleTransaction}
            />
          )}
        </div>
      </div>

      {/* Members */}
      {group && (
        <div className="mb-6">
          <GroupMemberList group={group} />
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Expenses tab */}
      {activeTab === 'expenses' && (
        <>
          <ExpenseFilters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {expensesLoading && <ExpenseListSkeleton />}

          {isError && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
              Couldn't load expenses. Please try refreshing.
            </div>
          )}

          {!expensesLoading && !isError && expenseData?.expenses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500">No expenses yet in this group.</p>
              <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
                Add the first expense
              </Button>
            </div>
          )}

          {!expensesLoading &&
            !isError &&
            expenseData?.expenses.length > 0 &&
            filteredExpenses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <p className="text-slate-500">No expenses match this filter.</p>
                <Button variant="secondary" className="mt-4" onClick={() => setActiveCategory('')}>
                  Clear filter
                </Button>
              </div>
            )}

          {!expensesLoading && !isError && filteredExpenses.length > 0 && (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onClick={() => setSelectedExpense(expense)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Activity tab */}
      {activeTab === 'activity' && !activityLoading && (
        <RecentActivityFeed feed={activityFeed || []} />
      )}

      {/* Insights tab */}
      {activeTab === 'insights' && !spendingLoading && (
        <SpendingChart data={spendingData || []} />
      )}

      {/* Add expense modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add expense">
        {group && (
          <ExpenseForm groupId={id} members={group.members} onSuccess={() => setIsFormOpen(false)} />
        )}
      </Modal>

      {/* Expense detail / edit / delete modal */}
      <ExpenseDetailModal
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
        groupId={id}
        members={group?.members || []}
        currentUserId={userId}
        isGroupAdmin={isGroupAdmin}
      />

      {/* Settle up modal */}
      <SettleUpModal
        isOpen={!!settleTransaction}
        onClose={() => setSettleTransaction(null)}
        groupId={id}
        transaction={settleTransaction}
        members={group?.members || []}
      />

      {/* Edit group modal */}
      <EditGroupModal
        isOpen={isEditGroupOpen}
        onClose={() => setIsEditGroupOpen(false)}
        group={group}
      />

      {/* Delete group confirmation */}
      <ConfirmDialog
        isOpen={isDeleteGroupOpen}
        title="Delete this group?"
        message={`This will permanently delete "${group?.name}" and all its expenses for every member. This cannot be undone.`}
        confirmLabel="Delete group"
        isLoading={isDeletingGroup}
        onConfirm={() => deleteGroup(id)}
        onCancel={() => setIsDeleteGroupOpen(false)}
      />
    </div>
  );
}