'use client';

import { useState } from 'react';
import { ExperienceForm } from '../experience/experience-form';
import { ExperienceList } from '../experience/experience-list';
import type { Experience } from '@/types/portfolio';

export default function AdminExperiencePage() {
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
  };

  const handleAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingExperience(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Experience Management</h1>
        <p className="text-muted-foreground">Kelola pengalaman kerja, magang, organisasi, dan mengajar</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ExperienceForm 
          key={editingExperience?.id || 'new'}
          onAdded={handleAdded}
          editingExperience={editingExperience}
          onCancelEdit={handleCancelEdit}
        />
        <ExperienceList key={refreshKey} onEdit={handleEdit} />
      </div>
    </div>
  );
}
