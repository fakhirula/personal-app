'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Certification } from '@/types/portfolio';
import { addCertification } from '@/lib/firestore';

export function CertificationForm({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialID: '',
    credentialURL: '',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCertification(form);
      toast.success('Certification added');
      setForm({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialID: '', credentialURL: '', description: '', isActive: true });
      onAdded();
    } catch (err) {
      toast.error(`Failed to add certification`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Certification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer *</Label>
              <Input id="issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input id="issueDate" type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" type="date" value={form.expiryDate || ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="credentialID">Credential ID</Label>
              <Input id="credentialID" value={form.credentialID || ''} onChange={(e) => setForm({ ...form, credentialID: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentialURL">Credential URL</Label>
              <Input id="credentialURL" value={form.credentialURL || ''} onChange={(e) => setForm({ ...form, credentialURL: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Certification'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
