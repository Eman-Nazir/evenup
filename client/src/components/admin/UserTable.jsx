import { useState } from 'react';
import { Trash2, ShieldCheck } from 'lucide-react';
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from '../../features/admin/useAdminUsers';
import { Input, Button } from '../ui';
import { ConfirmDialog } from '../ui';
import { formatDate } from '../../utils/formatDate';

export default function UserTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data, isLoading } = useAdminUsers(page, search);
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      <div className="border-b border-slate-100 p-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : data?.users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No users found</td></tr>
            ) : (
              data?.users.map((u) => (
                <tr key={u._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => updateRole({ userId: u._id, role: u.role === 'admin' ? 'user' : 'admin' })}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-purple-600"
                        title="Toggle admin role"
                      >
                        <ShieldCheck size={16} />
                      </button>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 sm:hidden">
        {data?.users.map((u) => (
          <div key={u._id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {u.role}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1"
                onClick={() => updateRole({ userId: u._id, role: u.role === 'admin' ? 'user' : 'admin' })}>
                Toggle role
              </Button>
              <Button size="sm" variant="danger" onClick={() => setUserToDelete(u)}>
                Delete
              </Button>
            </div>
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
        isOpen={!!userToDelete}
        title="Delete user?"
        message={`This will permanently delete ${userToDelete?.name}'s account. This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => deleteUser(userToDelete._id, { onSuccess: () => setUserToDelete(null) })}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}