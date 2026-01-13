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
    <div className="grid grid-cols-2 gap-6">
      <SkillForm 
        key={editingSkill?.id || 'new'}
        onAdded={handleAdded}
        editingSkill={editingSkill}
        onCancelEdit={handleCancelEdit}
      />
      <SkillList 
        key={editingSkill?.id ? `list-${editingSkill.id}` : 'list'}
        onEdit={handleEdit}
      />
    </div>
  );
}
