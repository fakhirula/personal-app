'use client';

import { useState } from 'react';
import { ProjectForm } from '@/app/projects/project-form';
import { ProjectList } from '@/app/projects/project-list';
import type { Project } from '@/types/portfolio';

export default function AdminProjectsPage() {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <p className="text-muted-foreground">Kelola portofolio proyek Anda</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit">
          <ProjectForm 
            key={editingProject?.id || 'new'}
            onAdded={handleAdded}
            editingProject={editingProject}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <ProjectList key={refreshKey} onEdit={handleEdit} />
      </div>
    </div>
  );
}
