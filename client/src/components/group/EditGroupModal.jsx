import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../ui';
import { useUpdateGroup } from '../../features/groups/useUpdateGroup';

const schema = z.object({
  name: z.string().min(2, 'Group name is required').max(100),
  type: z.enum(['trip', 'home', 'couple', 'other']),
});

export default function EditGroupModal({ isOpen, onClose, group }) {
  const { mutate: updateGroup, isPending } = useUpdateGroup(group?._id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: group ? { name: group.name, type: group.type } : undefined,
  });

  const onSubmit = (values) => {
    updateGroup(values, { onSuccess: () => onClose() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit group">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Group name"
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
          Save changes
        </Button>
      </form>
    </Modal>
  );
}