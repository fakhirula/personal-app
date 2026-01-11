'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Education } from '@/types/portfolio';
import { addEducation } from '@/lib/firestore';

const levels = [
  { value: 'SMK', label: 'SMK (Sekolah Menengah Kejuruan)' },
  { value: 'S1', label: 'S1 (Strata Satu)' },
  { value: 'S2', label: 'S2 (Strata Dua)' },
];

export function EducationForm({ onAdded }: { onAdded: () => void }) {
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
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidYear(form.startDate) || !isValidYear(form.endDate)) {
      toast.error('Tahun mulai dan selesai harus 4 angka (YYYY)');
      return;
    }
    setLoading(true);
    try {
      await addEducation(form);
      toast.success('Education added');
      setForm({ institution: '', degree: '', level: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '', location: '', description: '', isActive: true });
      onAdded();
    } catch (err) {
      toast.error(`Failed to add education`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Education</CardTitle>
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

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Education'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
