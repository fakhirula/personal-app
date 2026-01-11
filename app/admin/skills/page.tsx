'use client';

import { SkillForm } from '@/app/skills/skill-form';
import { SkillList } from '@/app/skills/skill-list';

export default function AdminSkillsPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <SkillForm onAdded={() => {}} />
      <SkillList />
    </div>
  );
}
