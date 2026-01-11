"use client";
import { Navbar } from '@/components/navbar';
import { ExperienceForm } from './experience-form';
import { ExperienceList } from './experience-list';

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <p className="text-muted-foreground">Kelola pengalaman kerja, magang, organisasi, dan mengajar</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ExperienceForm onAdded={() => { /* refresh handled by list filter */ }} />
          <ExperienceList />
        </div>
      </main>
    </div>
  );
}
