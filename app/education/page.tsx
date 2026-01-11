"use client";
import { Navbar } from '@/components/navbar';
import { EducationForm } from './education-form';
import { EducationList } from './education-list';

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Education Management</h1>
          <p className="text-muted-foreground">Kelola riwayat pendidikan Anda</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <EducationForm onAdded={() => { /* list auto-refresh on mount; user can refresh by navigating */ }} />
          <EducationList />
        </div>
      </main>
    </div>
  );
}
