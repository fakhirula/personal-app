'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import type { Certification } from '@/types/portfolio';
import { addCertification, updateCertification } from '@/lib/firestore';
import { uploadImage, getCloudinaryUrl } from '@/lib/cloudinary';
import Image from 'next/image';

interface CertificationFormProps {
  onAdded: () => void;
  editingCertification?: Certification | null;
  onCancelEdit?: () => void;
}

export function CertificationForm({ onAdded, editingCertification, onCancelEdit }: CertificationFormProps) {
  const [form, setForm] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialID: '',
    credentialURL: '',
    description: '',
    certificateImageURL: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingCertification) {
      setForm({
        name: editingCertification.name,
        issuer: editingCertification.issuer,
        issueDate: editingCertification.issueDate,
        expiryDate: editingCertification.expiryDate || '',
        credentialID: editingCertification.credentialID || '',
        credentialURL: editingCertification.credentialURL || '',
        description: editingCertification.description || '',
        certificateImageURL: editingCertification.certificateImageURL || '',
        isActive: editingCertification.isActive,
      });
    }
  }, [editingCertification]);

  const handleCertificateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Pilih file gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadImage(file, 'portfolio/certifications');
      const certificateImageURL = getCloudinaryUrl(response.public_id, {
        width: 600,
        height: 400,
        crop: 'fill',
        quality: 'auto',
      });
      setForm({ ...form, certificateImageURL });
      toast.success('Sertifikat berhasil diupload!');
    } catch (error) {
      console.error('Error uploading certificate image:', error);
      toast.error('Gagal upload sertifikat');
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCertification?.id) {
        await updateCertification(editingCertification.id, form);
        toast.success('Certification updated');
      } else {
        await addCertification(form);
        toast.success('Certification added');
      }
      setForm({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialID: '', credentialURL: '', description: '', certificateImageURL: '', isActive: true });
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      toast.error(editingCertification ? 'Failed to update certification' : 'Failed to add certification');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialID: '', credentialURL: '', description: '', certificateImageURL: '', isActive: true });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{editingCertification ? 'Edit Certification' : 'Add Certification'}</CardTitle>
          {editingCertification && onCancelEdit && (
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
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

          <div className="space-y-2">
            <Label htmlFor="certificateImage">Certificate Image</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  id="certificateImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCertificateImageUpload}
                  disabled={uploading}
                />
                <label htmlFor="certificateImage">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('certificateImage')?.click()}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Certificate Image
                      </>
                    )}
                  </Button>
                </label>
              </div>
              {form.certificateImageURL && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image src={form.certificateImageURL} alt="Certificate" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {editingCertification && onCancelEdit && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingCertification ? 'Update Certification' : 'Add Certification')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
