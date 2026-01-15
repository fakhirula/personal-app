'use client';

import { useState } from 'react';
import { EducationForm } from '../education/education-form';
import { EducationList } from '../education/education-list';
import type { Education } from '@/types/portfolio';

export default function AdminEducationPage() {
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
  };

  const handleAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingEducation(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Education Management</h1>
        <p className="text-muted-foreground">Kelola riwayat pendidikan Anda</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit">
          <EducationForm 
            key={editingEducation?.id || 'new'}
            onAdded={handleAdded}
            editingEducation={editingEducation}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <EducationList key={refreshKey} onEdit={handleEdit} />
      </div>
    </div>
  );
}
