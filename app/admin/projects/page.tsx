'use client';

import { ProjectForm } from '@/app/projects/project-form';
import { ProjectList } from '@/app/projects/project-list';

export default function AdminProjectsPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <ProjectForm onAdded={() => {}} />
      <ProjectList />
    </div>
  );
}
