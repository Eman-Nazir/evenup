import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../ui';
import { useAddMember } from '../../features/groups/useAddMember';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

export default function AddMemberModal({ isOpen, onClose, groupId }) {
  const { mutate: addMember, isPending } = useAddMember(groupId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = ({ email }) => {
    addMember(email, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a member">
      <p className="mb-4 text-sm text-slate-500">
        The person must already have an EvenUp account to be added.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="friend@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" className="w-full" isLoading={isPending}>
          Add to group
        </Button>
      </form>
    </Modal>
  );
}