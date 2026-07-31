import { useState } from 'react';
import { Modal, Button } from '../ui';
import FriendPicker from './FriendPicker';
import Input from '../ui/Input';
import { useAddMember } from '../../features/groups/useAddMember';

export default function AddMemberModal({ isOpen, onClose, groupId }) {
  const { mutate: addMember, isPending } = useAddMember(groupId);
  const [manualEmail, setManualEmail] = useState('');

  const handleAddFriend = (email) => {
    addMember(email, { onSuccess: () => onClose() });
  };

  const handleAddManual = () => {
    const trimmed = manualEmail.trim();
    if (!trimmed) return;
    addMember(trimmed, {
      onSuccess: () => {
        setManualEmail('');
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a member">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Add from your friends
          </label>
          <FriendPicker selectedEmails={[]} onToggle={handleAddFriend} />
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
            <Button type="button" isLoading={isPending} onClick={handleAddManual}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}