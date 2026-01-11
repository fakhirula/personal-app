'use client';

import { ExperienceForm } from '../experience/experience-form';
import { ExperienceList } from '../experience/experience-list';

export default function AdminExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Experience Management</h1>
        <p className="text-muted-foreground">Kelola pengalaman kerja, magang, organisasi, dan mengajar</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ExperienceForm onAdded={() => { /* refresh handled by list filter */ }} />
        <ExperienceList />
      </div>
    </div>
  );
}
