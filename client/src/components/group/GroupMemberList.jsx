import { UserMinus, Crown, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { useRemoveMember } from '../../features/groups/useRemoveMember';
import { ConfirmDialog, Button } from '../ui';
import { useState } from 'react';
import AddMemberModal from './AddMemberModal';

export default function GroupMemberList({ group }) {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { mutate: removeMember, isPending } = useRemoveMember(group._id);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const currentUserRole = group.members.find((m) => m.user._id === currentUserId)?.role;
  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          Members ({group.members.length})
        </h3>
        {isAdmin && (
          <Button size="sm" variant="secondary" onClick={() => setIsAddOpen(true)}>
            <UserPlus size={14} /> Add
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {group.members.map((m) => (
          <div key={m.user._id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                {m.user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {m.user.name} {m.user._id === currentUserId && <span className="text-xs text-slate-400">(you)</span>}
                </p>
                <p className="text-xs text-slate-400">{m.user.email}</p>
              </div>
              {m.role === 'admin' && <Crown size={13} className="text-amber-500" />}
            </div>

            {isAdmin && m.user._id !== currentUserId && (
              <button
                onClick={() => setMemberToRemove(m.user)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <UserMinus size={15} />
              </button>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!memberToRemove}
        title="Remove member?"
        message={`Remove ${memberToRemove?.name} from this group? They will lose access to this group's expenses.`}
        confirmLabel="Remove"
        isLoading={isPending}
        onConfirm={() => removeMember(memberToRemove._id, { onSuccess: () => setMemberToRemove(null) })}
        onCancel={() => setMemberToRemove(null)}
      />

      <AddMemberModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} groupId={group._id} />
    </div>
  );
}