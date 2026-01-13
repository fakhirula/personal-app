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
    <div className="grid grid-cols-2 gap-6">
      <CertificationForm 
        key={editingCertification?.id || 'new'}
        onAdded={handleAdded}
        editingCertification={editingCertification}
        onCancelEdit={handleCancelEdit}
      />
      <CertificationList 
        key={editingCertification?.id ? `list-${editingCertification.id}` : 'list'}
        onEdit={handleEdit}
      />
    </div>
  );
}
