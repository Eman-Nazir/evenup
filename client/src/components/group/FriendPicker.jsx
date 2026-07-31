import { useFriends } from '../../features/friends/useFriends';
import { Avatar } from '../ui';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function FriendPicker({ selectedEmails, onToggle }) {
  const { data: friends, isLoading } = useFriends();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!friends?.length) {
    return (
      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-400">
        You don't have any friends added yet. Add friends from the Friends page, or type an email below instead.
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {friends.map(({ friendshipId, friend }) => {
        const isSelected = selectedEmails.includes(friend.email);
        return (
          <button
            key={friendshipId}
            type="button"
            onClick={() => onToggle(friend.email)}
            className={clsx(
              'flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-colors',
              isSelected ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Avatar name={friend.name} src={friend.avatar?.url} size="sm" />
              <div>
                <p className="text-sm font-medium text-slate-900">{friend.name}</p>
                <p className="text-xs text-slate-400">{friend.email}</p>
              </div>
            </div>
            {isSelected && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <Check size={12} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}