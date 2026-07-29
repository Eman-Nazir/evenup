import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../ui';
import { useCreateSettlement } from '../../features/settlements/useCreateSettlement';

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  method: z.enum(['cash', 'online']),
});

export default function SettleUpModal({ isOpen, onClose, groupId, transaction, members = [] }) {
  const { mutate: settle, isPending } = useCreateSettlement(groupId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: transaction ? { amount: transaction.amount, method: 'cash' } : undefined,
  });

  if (!transaction) return null;

  const from = members.find((m) => m.user._id === transaction.from)?.user;
  const to = members.find((m) => m.user._id === transaction.to)?.user;

  const onSubmit = (values) => {
    settle(
      { from: transaction.from, to: transaction.to, ...values },
      { onSuccess: () => { reset(); onClose(); } }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settle up">
      <p className="mb-4 text-sm text-slate-600">
        <span className="font-medium">{from?.name}</span> pays{' '}
        <span className="font-medium">{to?.name}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Amount (PKR)"
          type="number"
          step="0.01"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Method</label>
          <select
            {...register('method')}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="cash">💵 Cash</option>
            <option value="online">💳 Online</option>
          </select>
        </div>
        <Button type="submit" className="w-full" isLoading={isPending}>
          Confirm settlement
        </Button>
      </form>
    </Modal>
  );
}