import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Modal, Button, ConfirmDialog, Badge } from '../ui';
import { useDeleteExpense } from '../../features/expenses/useDeleteExpense';
import ExpenseForm from './ExpenseForm';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function ExpenseDetailModal({ isOpen, onClose, expense, groupId, members, currentUserId, isGroupAdmin }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteExpense, isPending } = useDeleteExpense(groupId);

  if (!expense) return null;
  const canModify = isGroupAdmin || expense.createdBy?._id === currentUserId;

  if (isEditing) {
    return (
      <Modal isOpen={isOpen} onClose={() => { setIsEditing(false); onClose(); }} title="Edit expense">
        <ExpenseForm
          groupId={groupId}
          members={members}
          isEditMode
          expenseId={expense._id}
          initialValues={{
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
          }}
          onSuccess={() => { setIsEditing(false); onClose(); }}
        />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense details">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900">{expense.description}</p>
          <Badge variant="primary" className="capitalize">{expense.category}</Badge>
        </div>
        <p className="text-3xl font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
        <p className="text-sm text-slate-500">
          Paid by {expense.paidBy?.[0]?.user?.name} · {formatDate(expense.date)}
        </p>
        <div className="border-t border-slate-100 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Split type</p>
          <p className="text-sm capitalize text-slate-700">{expense.splitType}</p>
        </div>

        {canModify && (
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil size={14} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete this expense?"
        message="This will remove the expense and recalculate everyone's balances. This cannot be undone."
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={() => deleteExpense(expense._id, { onSuccess: () => { setConfirmOpen(false); onClose(); } })}
        onCancel={() => setConfirmOpen(false)}
      />
    </Modal>
  );
}