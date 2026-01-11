import { Navbar } from '@/components/navbar';
import { ProfileForm } from '@/components/profile-form';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="text-muted-foreground">
            Kelola informasi profil pribadi dan foto Anda
          </p>
        </div>
        <ProfileForm />
      </main>
    </div>
  );
}
