import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAdminGroups, useDeleteGroupAdmin } from '../../features/admin/useAdminGroups';
import { Button, ConfirmDialog } from '../ui';
import { formatDate } from '../../utils/formatDate';

export default function GroupTable() {
  const [page, setPage] = useState(1);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const { data, isLoading } = useAdminGroups(page);
  const { mutate: deleteGroup, isPending } = useDeleteGroupAdmin();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Group</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Members</th>
              <th className="px-4 py-3 font-medium">Created By</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : (
              data?.groups.map((g) => (
                <tr key={g._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{g.icon} {g.name}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{g.type}</td>
                  <td className="px-4 py-3 text-slate-600">{g.members.length}</td>
                  <td className="px-4 py-3 text-slate-600">{g.createdBy?.name}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(g.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setGroupToDelete(g)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 sm:hidden">
        {data?.groups.map((g) => (
          <div key={g._id} className="rounded-xl border border-slate-100 p-4">
            <p className="font-medium text-slate-900">{g.icon} {g.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              {g.members.length} members · by {g.createdBy?.name}
            </p>
            <Button size="sm" variant="danger" className="mt-3 w-full" onClick={() => setGroupToDelete(g)}>
              Delete group
            </Button>
          </div>
        ))}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm text-slate-500">
          <span>Page {page} of {data.pagination.totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button size="sm" variant="secondary" disabled={page === data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!groupToDelete}
        title="Delete group?"
        message={`This will permanently delete "${groupToDelete?.name}" and all its expenses. This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={() => deleteGroup(groupToDelete._id, { onSuccess: () => setGroupToDelete(null) })}
        onCancel={() => setGroupToDelete(null)}
      />
    </div>
  );
}