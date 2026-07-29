import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../ui';
import { useCreateGroup } from '../../features/groups/useCreateGroup';

const schema = z.object({
  name: z.string().min(2, 'Group name is required').max(100),
  type: z.enum(['trip', 'home', 'couple', 'other']),
});

export default function CreateGroupModal({ isOpen, onClose }) {
  const { mutate: createGroup, isPending } = useCreateGroup();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'other' },
  });

  const onSubmit = (values) => {
    createGroup(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a group">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Group name"
          placeholder="Roommates, Goa Trip..."
          error={errors.name?.message}
          {...register('name')}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Type</label>
          <select
            {...register('type')}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="home">🏠 Home</option>
            <option value="trip">✈️ Trip</option>
            <option value="couple">💑 Couple</option>
            <option value="other">👥 Other</option>
          </select>
        </div>
        <Button type="submit" className="w-full" isLoading={isPending}>
          Create group
        </Button>
      </form>
    </Modal>
  );
}