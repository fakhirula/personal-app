'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { Skill } from '@/types/portfolio';
import { addSkill, updateSkill } from '@/lib/firestore';
import { X } from 'lucide-react';

interface SkillFormProps {
  onAdded: () => void;
  editingSkill?: Skill | null;
  onCancelEdit?: () => void;
}

export function SkillForm({ onAdded, editingSkill, onCancelEdit }: SkillFormProps) {
  const [form, setForm] = useState<Omit<Skill, 'id'>>({
    name: '',
    description: '',
    level: 'Beginner',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingSkill) {
      setForm({
        name: editingSkill.name,
        description: editingSkill.description || '',
        level: editingSkill.level,
        isActive: editingSkill.isActive,
      });
    }
  }, [editingSkill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSkill?.id) {
        await updateSkill(editingSkill.id, form);
        toast.success('Skill updated');
      } else {
        await addSkill(form);
        toast.success('Skill added');
      }
      setForm({ name: '', description: '', level: 'Beginner', isActive: true });
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      toast.error(editingSkill ? 'Failed to update skill' : 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', description: '', level: 'Beginner', isActive: true });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{editingSkill ? 'Edit Skill' : 'Add Skill'}</CardTitle>
          {editingSkill && onCancelEdit && (
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. React, Python, UI Design"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Brief description of this skill"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level *</Label>
            <Select value={form.level} onValueChange={(value) => setForm({ ...form, level: value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' })}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            {editingSkill && onCancelEdit && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Add Skill')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
