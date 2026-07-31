import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../ui';
import FriendPicker from './FriendPicker';
import { useCreateGroup } from '../../features/groups/useCreateGroup';

const schema = z.object({
  name: z.string().min(2, 'Group name is required').max(100),
  type: z.enum(['trip', 'home', 'couple', 'other']),
});

export default function CreateGroupModal({ isOpen, onClose }) {
  const { mutate: createGroup, isPending } = useCreateGroup();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [manualEmail, setManualEmail] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'other' },
  });

  const toggleFriend = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const addManualEmail = () => {
    const trimmed = manualEmail.trim();
    if (trimmed && !selectedEmails.includes(trimmed)) {
      setSelectedEmails((prev) => [...prev, trimmed]);
      setManualEmail('');
    }
  };

  const onSubmit = (values) => {
    createGroup(
      { ...values, memberEmails: selectedEmails },
      {
        onSuccess: () => {
          reset();
          setSelectedEmails([]);
          onClose();
        },
      }
    );
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Add from your friends
          </label>
          <FriendPicker selectedEmails={selectedEmails} onToggle={toggleFriend} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Or add by email
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="friend@example.com"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={addManualEmail}>
              Add
            </Button>
          </div>
        </div>

        {selectedEmails.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedEmails.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
              >
                {email}
                <button
                  type="button"
                  onClick={() => setSelectedEmails((prev) => prev.filter((e) => e !== email))}
                  className="ml-1 text-primary/60 hover:text-primary"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isPending}>
          Create group
        </Button>
      </form>
    </Modal>
  );
}