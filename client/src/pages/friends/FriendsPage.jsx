import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Check, X, UserMinus } from 'lucide-react';
import { Button, Input, Avatar, Card, ConfirmDialog } from '../../components/ui';
import { useFriends } from '../../features/friends/useFriends';
import { usePendingRequests } from '../../features/friends/usePendingRequests';
import { useSendFriendRequest } from '../../features/friends/useSendFriendRequest';
import { useRespondToRequest } from '../../features/friends/useRespondToRequest';
import { useRemoveFriend } from '../../features/friends/useRemoveFriend';
import { formatDate } from '../../utils/formatDate';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

function AddFriendForm() {
  const { mutate: sendRequest, isPending } = useSendFriendRequest();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = ({ email }) => sendRequest(email, { onSuccess: () => reset() });

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Add a friend</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <div className="flex-1">
          <Input placeholder="friend@example.com" error={errors.email?.message} {...register('email')} />
        </div>
        <Button type="submit" isLoading={isPending}>
          <UserPlus size={16} /> Send
        </Button>
      </form>
    </Card>
  );
}

function PendingRequests() {
  const { data: requests, isLoading } = usePendingRequests();
  const { mutate: respond, isPending } = useRespondToRequest();

  if (isLoading) return null;
  if (!requests?.length) return null;

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">
        Pending requests ({requests.length})
      </h3>
      <div className="space-y-2">
        {requests.map((req) => (
          <div key={req._id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-2.5">
              <Avatar name={req.requester.name} src={req.requester.avatar?.url} size="sm" />
              <div>
                <p className="text-sm font-medium text-slate-900">{req.requester.name}</p>
                <p className="text-xs text-slate-400">{req.requester.email}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                disabled={isPending}
                onClick={() => respond({ friendshipId: req._id, action: 'accept' })}
                className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                title="Accept"
              >
                <Check size={16} />
              </button>
              <button
                disabled={isPending}
                onClick={() => respond({ friendshipId: req._id, action: 'reject' })}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                title="Reject"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FriendsList() {
  const { data: friends, isLoading } = useFriends();
  const { mutate: removeFriend, isPending } = useRemoveFriend();
  const [toRemove, setToRemove] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!friends?.length) {
    return (
      <Card className="text-center text-sm text-slate-400">
        No friends yet — send a request above to get started.
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {friends.map(({ friendshipId, friend, since }) => (
          <div key={friendshipId} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-3">
              <Avatar name={friend.name} src={friend.avatar?.url} />
              <div>
                <p className="text-sm font-medium text-slate-900">{friend.name}</p>
                <p className="text-xs text-slate-400">{friend.email} · friends since {formatDate(since)}</p>
              </div>
            </div>
            <button
              onClick={() => setToRemove({ friendshipId, name: friend.name })}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Remove friend"
            >
              <UserMinus size={16} />
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!toRemove}
        title="Remove friend?"
        message={`Remove ${toRemove?.name} from your friends list?`}
        confirmLabel="Remove"
        isLoading={isPending}
        onConfirm={() => removeFriend(toRemove.friendshipId, { onSuccess: () => setToRemove(null) })}
        onCancel={() => setToRemove(null)}
      />
    </>
  );
}

export default function FriendsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Friends</h1>
        <p className="mt-1 text-sm text-slate-500">Connect with people before adding them to a group</p>
      </div>

      <AddFriendForm />
      <PendingRequests />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Your friends</h3>
        <FriendsList />
      </div>
    </div>
  );
}