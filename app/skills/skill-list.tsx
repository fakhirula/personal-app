'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Skill } from '@/types/portfolio';
import { getSkills, deleteSkill } from '@/lib/firestore';
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
  Edit,
  Trash2,
} from 'lucide-react';

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

interface SkillListProps {
  onEdit?: (skill: Skill) => void;
}

export function SkillList({ onEdit }: SkillListProps = {}) {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setItems(data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteSkill(id);
      toast.success('Skill archived');
      refresh();
    } catch {
      toast.error('Failed to archive');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No skills yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((skill) => {
              const IconComponent = ICON_MAP[skill.icon] || Code;
              return (
                <div key={skill.id} className="flex items-start justify-between border rounded-lg p-3">
                  <div className="flex items-start gap-3 flex-1">
                    <IconComponent className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      {skill.description && (
                        <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(skill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deactivate(skill.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
