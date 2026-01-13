'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import type { Education } from '@/types/portfolio';
import { addEducation, updateEducation } from '@/lib/firestore';
import { uploadImage, getCloudinaryUrl } from '@/lib/cloudinary';
import Image from 'next/image';

const levels = [
  { value: 'SMK', label: 'SMK (Sekolah Menengah Kejuruan)' },
  { value: 'S1', label: 'S1 (Strata Satu)' },
  { value: 'S2', label: 'S2 (Strata Dua)' },
];

interface EducationFormProps {
  onAdded: () => void;
  editingEducation?: Education | null;
  onCancelEdit?: () => void;
}

export function EducationForm({ onAdded, editingEducation, onCancelEdit }: EducationFormProps) {
  const isValidYear = (y: string) => /^\d{4}$/.test(y);
  const [form, setForm] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    level: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    location: '',
    description: '',
    certificateURL: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingEducation) {
      setForm({
        institution: editingEducation.institution,
        degree: editingEducation.degree || '',
        level: editingEducation.level,
        fieldOfStudy: editingEducation.fieldOfStudy,
        startDate: editingEducation.startDate,
        endDate: editingEducation.endDate,
        grade: editingEducation.grade || '',
        location: editingEducation.location || '',
        description: editingEducation.description || '',
        certificateURL: editingEducation.certificateURL || '',
        isActive: editingEducation.isActive,
      });
    }
  }, [editingEducation]);

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await uploadImage(file, 'portfolio/education');
      const certificateURL = getCloudinaryUrl(response.public_id, {
        width: 600,
        height: 800,
        crop: 'fill',
        quality: 'auto',
      });
      setForm({ ...form, certificateURL });
      toast.success('Sertifikat berhasil diupload!');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('Gagal upload sertifikat');
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidYear(form.startDate) || !isValidYear(form.endDate)) {
      toast.error('Tahun mulai dan selesai harus 4 angka (YYYY)');
      return;
    }
    setLoading(true);
    try {
      if (editingEducation?.id) {
        await updateEducation(editingEducation.id, form);
        toast.success('Education updated');
      } else {
        await addEducation(form);
        toast.success('Education added');
      }
      setForm({ institution: '', degree: '', level: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '', location: '', description: '', certificateURL: '', isActive: true });
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      toast.error(editingEducation ? 'Failed to update education' : 'Failed to add education');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ institution: '', degree: '', level: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '', location: '', description: '', certificateURL: '', isActive: true });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{editingEducation ? 'Edit Education' : 'Add Education'}</CardTitle>
          {editingEducation && onCancelEdit && (
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
              <Label htmlFor="institution">Institusi *</Label>
              <Input id="institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Jenjang *</Label>
              <Select value={form.level} onValueChange={(value) => setForm({ ...form, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenjang" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(l => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Jurusan *</Label>
              <Input id="fieldOfStudy" value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" placeholder="Jakarta, Indonesia" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="grade">IPK / Nilai Akhir</Label>
              <Input id="grade" placeholder="3.92/4.00" value={form.grade || ''} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Gelar (opsional)</Label>
              <Input id="degree" value={form.degree || ''} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tahun Mulai *</Label>
              <Input
                id="startDate"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="YYYY"
                value={form.startDate}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setForm({ ...form, startDate: v });
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tahun Selesai *</Label>
              <Input
                id="endDate"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="YYYY"
                value={form.endDate}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setForm({ ...form, endDate: v });
                }}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate">Sertifikat/Bukti Kelulusan</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  id="certificate"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCertificateUpload}
                  disabled={uploading}
                />
                <label htmlFor="certificate">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('certificate')?.click()}
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
                        Upload Certificate
                      </>
                    )}
                  </Button>
                </label>
              </div>
              {form.certificateURL && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image src={form.certificateURL} alt="Certificate" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {editingEducation && onCancelEdit && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingEducation ? 'Update Education' : 'Add Education')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
