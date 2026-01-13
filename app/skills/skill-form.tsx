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
import {
  Code,
  Database,
  Palette,
  Globe,
  Server,
  Smartphone,
  Layout,
  GitBranch,
  Zap,
  Settings,
  BookOpen,
  Brain,
  X,
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Code', label: 'Code' },
  { value: 'Database', label: 'Database' },
  { value: 'Palette', label: 'Palette' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Server', label: 'Server' },
  { value: 'Smartphone', label: 'Smartphone' },
  { value: 'Layout', label: 'Layout' },
  { value: 'GitBranch', label: 'Git' },
  { value: 'Zap', label: 'Performance' },
  { value: 'Settings', label: 'Settings' },
  { value: 'BookOpen', label: 'Learning' },
  { value: 'Brain', label: 'AI/ML' },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Database,
  Palette,
  Globe,
  Server,
  Smartphone,
  Layout,
  GitBranch,
  Zap,
  Settings,
  BookOpen,
  Brain,
};

interface SkillFormProps {
  onAdded: () => void;
  editingSkill?: Skill | null;
  onCancelEdit?: () => void;
}

export function SkillForm({ onAdded, editingSkill, onCancelEdit }: SkillFormProps) {
  const [form, setForm] = useState<Omit<Skill, 'id'>>({
    name: '',
    icon: 'Code',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingSkill) {
      setForm({
        name: editingSkill.name,
        icon: editingSkill.icon,
        description: editingSkill.description || '',
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
      setForm({ name: '', icon: 'Code', description: '', isActive: true });
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      toast.error(editingSkill ? 'Failed to update skill' : 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', icon: 'Code', description: '', isActive: true });
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
            <Label htmlFor="icon">Icon *</Label>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Select value={form.icon} onValueChange={(value) => setForm({ ...form, icon: value })}>
                  <SelectTrigger id="icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                {React.createElement(ICON_MAP[form.icon] || Code, { className: 'h-5 w-5 text-primary' })}
              </div>
            </div>
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
