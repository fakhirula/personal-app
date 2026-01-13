'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import type { Project } from '@/types/portfolio';
import { addProject, updateProject } from '@/lib/firestore';
import { uploadImage, getCloudinaryUrl } from '@/lib/cloudinary';
import Image from 'next/image';

interface ProjectFormProps {
  onAdded: () => void;
  editingProject?: Project | null;
  onCancelEdit?: () => void;
}

export function ProjectForm({ onAdded, editingProject, onCancelEdit }: ProjectFormProps) {
  const [form, setForm] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    category: '',
    imageURL: '',
    projectURL: '',
    githubURL: '',
    tags: [],
    completedDate: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (editingProject) {
      setForm({
        title: editingProject.title,
        description: editingProject.description,
        category: editingProject.category,
        imageURL: editingProject.imageURL || '',
        projectURL: editingProject.projectURL || '',
        githubURL: editingProject.githubURL || '',
        tags: editingProject.tags || [],
        completedDate: editingProject.completedDate || '',
        isActive: editingProject.isActive,
      });
      setTagsInput(editingProject.tags?.join(', ') || '');
    }
  }, [editingProject]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadImage(file, 'portfolio/projects');
      const imageURL = getCloudinaryUrl(response.public_id, {
        width: 600,
        height: 400,
        crop: 'fill',
        quality: 'auto',
      });
      setForm({ ...form, imageURL });
      toast.success('Gambar berhasil diupload!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      
      if (editingProject?.id) {
        await updateProject(editingProject.id, { ...form, tags });
        toast.success('Project updated');
      } else {
        await addProject({ ...form, tags });
        toast.success('Project added');
      }
      
      setForm({
        title: '',
        description: '',
        category: '',
        imageURL: '',
        projectURL: '',
        githubURL: '',
        tags: [],
        completedDate: '',
        isActive: true,
      });
      setTagsInput('');
      onAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      toast.error(editingProject ? 'Failed to update project' : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      title: '',
      description: '',
      category: '',
      imageURL: '',
      projectURL: '',
      githubURL: '',
      tags: [],
      completedDate: '',
      isActive: true,
    });
    setTagsInput('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{editingProject ? 'Edit Project' : 'Add Project'}</CardTitle>
          {editingProject && onCancelEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. E-Commerce Website"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Web Development, Mobile App, Design"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Brief description of the project"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <label htmlFor="image">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('image')?.click()}
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
                        Upload Image
                      </>
                    )}
                  </Button>
                </label>
              </div>
              {form.imageURL && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image src={form.imageURL} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectURL">Project URL</Label>
              <Input
                id="projectURL"
                type="url"
                value={form.projectURL || ''}
                onChange={(e) => setForm({ ...form, projectURL: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubURL">GitHub URL</Label>
              <Input
                id="githubURL"
                type="url"
                value={form.githubURL || ''}
                onChange={(e) => setForm({ ...form, githubURL: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completedDate">Completed Date</Label>
            <Input
              id="completedDate"
              type="date"
              value={form.completedDate || ''}
              onChange={(e) => setForm({ ...form, completedDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingProject && onCancelEdit && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
