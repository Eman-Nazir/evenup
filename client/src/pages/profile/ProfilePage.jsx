import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera } from 'lucide-react';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { useUpdateProfile } from '../../features/auth/useUpdateProfile';
import { useUploadAvatar } from '../../features/auth/useUploadAvatar';
import { Button, Input, Avatar, Card, Badge } from '../../components/ui';

const schema = z.object({
  name: z.string().min(2, 'Name is required').max(50),
});

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || '' },
  });

 const onSubmit = (values) => {
  updateProfile(values, {
    onSuccess: () => {
      reset(values); 
    },
  });
};

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return; // toast already shows via backend validation, but guard client-side too
    }

    setPreview(URL.createObjectURL(file));
    uploadAvatar(file);
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Your profile</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your personal information</p>

      <Card className="mt-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar
              name={user?.name}
              src={preview || user?.avatar?.url}
              size="lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
              title="Change avatar"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <Badge variant={user?.role === 'admin' ? 'primary' : 'default'} className="mt-1.5 capitalize">
              {user?.role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input label="Email" value={user?.email || ''} disabled />
          <p className="text-xs text-slate-400">Email cannot be changed.</p>

          <Button type="submit" isLoading={isUpdating} disabled={!isDirty}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}