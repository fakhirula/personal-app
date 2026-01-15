'use client';

import { useState } from 'react';
import { SkillForm } from '@/app/skills/skill-form';
import { SkillList } from '@/app/skills/skill-list';
import type { Skill } from '@/types/portfolio';

export default function AdminSkillsPage() {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
  };

  const handleAdded = () => {
    setEditingSkill(null);
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <p className="text-muted-foreground">Kelola skill dan keahlian Anda</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit">
          <SkillForm 
            key={editingSkill?.id || 'new'}
            onAdded={handleAdded}
            editingSkill={editingSkill}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <SkillList 
          key={editingSkill?.id ? `list-${editingSkill.id}` : 'list'}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
