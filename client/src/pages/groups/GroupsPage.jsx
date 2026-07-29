import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGroups } from '../../features/groups/useGroups';
import { Button } from '../../components/ui';
import { GroupCardSkeleton } from '../../components/ui/Skeleton';
import GroupCard from '../../components/group/GroupCard';
import CreateGroupModal from '../../components/group/CreateGroupModal';

export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useGroups();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Groups</h1>
          <p className="text-sm text-slate-500">Manage shared expenses with friends</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          New group
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <GroupCardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          Couldn't load your groups. Please try refreshing.
        </div>
      )}

      {!isLoading && !isError && data?.groups.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">You haven't created any groups yet.</p>
          <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
            Create your first group
          </Button>
        </div>
      )}

      {!isLoading && !isError && data?.groups.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}

      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}