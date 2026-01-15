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
import type { WhatImDoing } from '@/types/portfolio';
import { addWhatImDoing, updateWhatImDoing } from '@/lib/firestore';
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

interface WhatImDoingFormProps {
  onAdded: () => void;
  editingItem?: WhatImDoing | null;
  onCancelEdit?: () => void;
}

export function WhatImDoingForm({ onAdded, editingItem, onCancelEdit }: WhatImDoingFormProps) {
  const [form, setForm] = useState<Omit<WhatImDoing, 'id'>>({
    name: '',
    icon: 'Code',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name,
        icon: editingItem.icon,
        description: editingItem.description || '',
        isActive: editingItem.isActive,
      });
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem?.id) {
        await updateWhatImDoing(editingItem.id, form);
        toast.success('What I\'m Doing updated');
      } else {
        await addWhatImDoing(form);
        toast.success('What I\'m Doing added');
      }
      setForm({ name: '', icon: 'Code', description: '', isActive: true });
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      toast.error(editingItem ? 'Failed to update' : 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', icon: 'Code', description: '', order: 0, isActive: true });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{editingItem ? 'Edit What I\'m Doing' : 'Add What I\'m Doing'}</CardTitle>
          {editingItem && onCancelEdit && (
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Web Development, App Development, UI/UX Design"
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
              placeholder="Brief description of what you do with this"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingItem && onCancelEdit && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
