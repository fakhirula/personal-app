'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Experience } from '@/types/portfolio';
import { addExperience } from '@/lib/firestore';

const types = [
  { value: 'work', label: 'Work' },
  { value: 'internship', label: 'Internship' },
  { value: 'organization', label: 'Organization' },
  { value: 'teaching', label: 'Teaching' },
];

export function ExperienceForm({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState<Omit<Experience, 'id'>>({
    title: '',
    organization: '',
    type: 'work',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    skills: [],
    location: '',
    isActive: true,
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, skills: skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(Boolean) : [] };
      await addExperience(payload);
      toast.success('Experience added');
      setForm({ title: '', organization: '', type: 'work', startDate: '', endDate: '', isCurrent: false, description: '', skills: [], location: '', isActive: true });
      setSkillsInput('');
      onAdded();
    } catch {
      toast.error('Failed to add experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Experience</CardTitle>
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
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input id="skills" placeholder="React, Node, Teaching" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Experience'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
