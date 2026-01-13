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
    <div className="grid grid-cols-2 gap-6">
      <ProjectForm 
        key={editingProject?.id || 'new'}
        onAdded={handleAdded}
        editingProject={editingProject}
        onCancelEdit={handleCancelEdit}
      />
      <ProjectList key={refreshKey} onEdit={handleEdit} />
    </div>
  );
}
