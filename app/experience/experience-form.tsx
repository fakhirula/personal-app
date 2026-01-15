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
import type { Experience } from '@/types/portfolio';
import { addExperience, updateExperience } from '@/lib/firestore';
import { uploadImage, getCloudinaryUrl } from '@/lib/cloudinary';
import Image from 'next/image';

const types = [
  { value: 'work', label: 'Work' },
  { value: 'internship', label: 'Internship' },
  { value: 'organization', label: 'Organization' },
  { value: 'teaching', label: 'Teaching' },
];

interface ExperienceFormProps {
  onAdded: () => void;
  editingExperience?: Experience | null;
  onCancelEdit?: () => void;
}

export function ExperienceForm({ onAdded, editingExperience, onCancelEdit }: ExperienceFormProps) {
  const [form, setForm] = useState<Omit<Experience, 'id'>>({
    title: '',
    organization: '',
    type: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    skills: [],
    location: '',
    logoURL: '',
    isActive: true,
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingExperience) {
      setForm({
        title: editingExperience.title,
        organization: editingExperience.organization,
        type: editingExperience.type,
        startDate: editingExperience.startDate,
        endDate: editingExperience.endDate,
        isCurrent: editingExperience.isCurrent,
        description: editingExperience.description,
        skills: editingExperience.skills || [],
        location: editingExperience.location || '',
        logoURL: editingExperience.logoURL || '',
        isActive: editingExperience.isActive,
      });
      setSkillsInput(editingExperience.skills?.join(', ') || '');
    }
  }, [editingExperience]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await uploadImage(file, 'portfolio/experience');
      const logoURL = getCloudinaryUrl(response.public_id, {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
      });
      setForm({ ...form, logoURL });
      toast.success('Logo berhasil diupload!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Gagal upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, skills: skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(Boolean) : [] };
      if (editingExperience?.id) {
        await updateExperience(editingExperience.id, payload);
        toast.success('Experience updated');
      } else {
        await addExperience(payload);
        toast.success('Experience added');
      }
      setForm({ title: '', organization: '', type: 'work', startDate: '', endDate: '', isCurrent: false, description: '', skills: [], location: '', logoURL: '', isActive: true });
      setSkillsInput('');
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch {
      toast.error(editingExperience ? 'Failed to update experience' : 'Failed to add experience');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ title: '', organization: '', type: 'work', startDate: '', endDate: '', isCurrent: false, description: '', skills: [], location: '', logoURL: '', isActive: true });
    setSkillsInput('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{editingExperience ? 'Edit Experience' : 'Add Experience'}</CardTitle>
          {editingExperience && onCancelEdit && (
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
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization *</Label>
              <Input id="organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value as Experience['type'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(t => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  id="logo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
                <label htmlFor="logo">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('logo')?.click()}
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
                        Upload Logo
                      </>
                    )}
                  </Button>
                </label>
              </div>
              {form.logoURL && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image src={form.logoURL} alt="Logo" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input id="skills" placeholder="React, Node, Teaching" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            {editingExperience && onCancelEdit && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingExperience ? 'Update Experience' : 'Add Experience')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
