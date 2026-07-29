import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from '../../hooks/useDebounce';
import { Button, Input } from '../ui';
import SplitTypeSelector from './SplitTypeSelector';
import { useAddExpense } from '../../features/expenses/useAddExpense';
import { useUpdateExpense } from '../../features/expenses/useUpdateExpense';
import { useCategorySuggestion } from '../../features/expenses/useCategorySuggestion';
import { showSuccess } from '../../lib/toast';
import { formatCurrency } from '../../utils/formatCurrency';

const schema = z.object({
  description: z.string().min(2, 'Description is required').max(200),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.string().optional(),
});

export default function ExpenseForm({ groupId, members, onSuccess, isEditMode = false, expenseId, initialValues }) {
  const { mutate: addExpense, isPending: isAdding } = useAddExpense(groupId);
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense(groupId);
  const [splitData, setSplitData] = useState({ splitType: 'equal', splitDetails: [] });
  const [category, setCategory] = useState('');

  const {
    register, handleSubmit, watch, reset, formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: initialValues });

  const description = watch('description');
  const amount = watch('amount') || 0;
  const debouncedDescription = useDebounce(description, 600);
  const { data: suggestedCategory } = useCategorySuggestion(debouncedDescription);

  // Single, unified submit handler — handles both add and edit modes,
  // and shows the per-person split breakdown toast on success.
  const onSubmit = (values) => {
    const payload = {
      description: values.description,
      amount: values.amount,
      category: category || suggestedCategory || 'other',
      splitType: splitData.splitType,
      splitDetails: splitData.splitDetails,
    };

    if (isEditMode) {
      updateExpense({ expenseId, payload }, { onSuccess: () => onSuccess?.() });
      return;
    }

    addExpense(payload, {
      onSuccess: (res) => {
        reset();
        const splits = res.data.splits || [];
        if (splits.length) {
          const breakdown = splits
            .map((s) => {
              const name = members.find((m) => m.user._id === s.user)?.user.name || 'Someone';
              return `${name}: ${formatCurrency(s.amountOwed)}`;
            })
            .join(' · ');
          showSuccess(`Split — ${breakdown}`);
        }
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Description"
        placeholder="Dinner at Cheezious"
        error={errors.description?.message}
        {...register('description')}
      />
      <Input
        label="Amount (PKR)"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount')}
      />

      {suggestedCategory && !category && (
        <button
          type="button"
          onClick={() => setCategory(suggestedCategory)}
          className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary hover:bg-primary/20 transition-colors"
        >
          ✨ AI suggests: <span className="font-medium capitalize">{suggestedCategory}</span> — tap to apply
        </button>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">Auto-detect</option>
          <option value="food">🍔 Food</option>
          <option value="rent">🏠 Rent</option>
          <option value="transport">🚗 Transport</option>
          <option value="entertainment">🎬 Entertainment</option>
          <option value="utilities">💡 Utilities</option>
          <option value="shopping">🛍️ Shopping</option>
          <option value="other">📦 Other</option>
        </select>
      </div>

      <SplitTypeSelector members={members} amount={amount} onChange={setSplitData} />

      <Button type="submit" className="w-full" isLoading={isAdding || isUpdating}>
        {isEditMode ? 'Save changes' : 'Add expense'}
      </Button>
    </form>
  );
}