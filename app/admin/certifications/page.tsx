'use client';

import { CertificationForm } from '@/app/certifications/certification-form';
import { CertificationList } from '@/app/certifications/certification-list';

export default function AdminCertificationsPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <CertificationForm onAdded={() => {}} />
      <CertificationList />
    </div>
  );
}
