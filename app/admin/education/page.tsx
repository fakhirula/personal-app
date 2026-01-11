'use client';

import { EducationForm } from '../education/education-form';
import { EducationList } from '../education/education-list';

export default function AdminEducationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Education Management</h1>
        <p className="text-muted-foreground">Kelola riwayat pendidikan Anda</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <EducationForm onAdded={() => { /* list auto-refresh on mount; user can refresh by navigating */ }} />
        <EducationList />
      </div>
    </div>
  );
}
