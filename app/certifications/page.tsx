"use client";
import { Navbar } from '@/components/navbar';
import { CertificationForm } from './certification-form';
import { CertificationList } from './certification-list';

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Certifications Management</h1>
          <p className="text-muted-foreground">Kelola sertifikasi dan penghargaan</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <CertificationForm onAdded={() => { /* list refresh handled on mount */ }} />
          <CertificationList />
        </div>
      </main>
    </div>
  );
}
