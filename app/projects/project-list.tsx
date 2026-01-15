'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ExternalLink, Github, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types/portfolio';
import { deleteProject, updateProject } from '@/lib/firestore';
import Image from 'next/image';

interface ProjectListProps {
  onEdit?: (project: Project) => void;
}

export function ProjectList({ onEdit }: ProjectListProps) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'projects'), where('isActive', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Project))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        toast.error('Failed to load projects');
      }
    );

    return () => unsub();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success('Project archived');
    } catch {
      toast.error('Failed to archive');
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    try {
      const itemToMove = items[index];
      const itemAbove = items[index - 1];
      
      const orderAbove = itemAbove.order ?? (index - 1);
      const orderToMove = itemToMove.order ?? index;
      
      await updateProject(itemToMove.id!, { order: orderAbove });
      await updateProject(itemAbove.id!, { order: orderToMove });
    } catch (err) {
      toast.error('Failed to move item');
    }
  };

  const moveDown = async (index: number) => {
    if (index === items.length - 1) return;
    try {
      const itemToMove = items[index];
      const itemBelow = items[index + 1];
      
      const orderBelow = itemBelow.order ?? (index + 1);
      const orderToMove = itemToMove.order ?? index;
      
      await updateProject(itemToMove.id!, { order: orderBelow });
      await updateProject(itemBelow.id!, { order: orderToMove });
    } catch (err) {
      toast.error('Failed to move item');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((project) => (
              <div key={project.id} className="flex gap-4 border rounded-lg p-4">
                {project.imageURL && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={project.imageURL} alt={project.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.title}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">{project.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveUp(items.indexOf(project))}
                        disabled={items.indexOf(project) === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveDown(items.indexOf(project))}
                        disabled={items.indexOf(project) === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deactivate(project.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-2">
                    {project.projectURL && (
                      <a
                        href={project.projectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project.githubURL && (
                      <a
                        href={project.githubURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Github className="h-3 w-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
