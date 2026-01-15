'use client';

import { useState } from 'react';
import { CertificationForm } from '@/app/certifications/certification-form';
import { CertificationList } from '@/app/certifications/certification-list';
import type { Certification } from '@/types/portfolio';

export default function AdminCertificationsPage() {
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
  };

  const handleAdded = () => {
    setEditingCertification(null);
  };

  const handleCancelEdit = () => {
    setEditingCertification(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certifications Management</h1>
        <p className="text-muted-foreground">Kelola sertifikasi dan penghargaan Anda</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit">
          <CertificationForm 
            key={editingCertification?.id || 'new'}
            onAdded={handleAdded}
            editingCertification={editingCertification}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <CertificationList 
          key={editingCertification?.id ? `list-${editingCertification.id}` : 'list'}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
