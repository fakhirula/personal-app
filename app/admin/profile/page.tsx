'use client';

import { ProfileForm } from '@/components/profile-form';

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Management</h1>
        <p className="text-muted-foreground">Kelola informasi profil pribadi dan foto Anda</p>
      </div>
      <ProfileForm />
    </div>
  );
}
