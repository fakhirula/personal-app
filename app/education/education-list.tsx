'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import type { Education } from '@/types/portfolio';
import { getEducation, updateEducation, deleteEducation } from '@/lib/firestore';

interface EducationListProps {
  onEdit?: (education: Education) => void;
}

export function EducationList({ onEdit }: EducationListProps) {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getEducation();
      // Sort by startDate descending (newest first)
      const sorted = data.sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate));
      setItems(sorted);
    } catch (err) {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteEducation(id);
      toast.success('Education archived');
      refresh();
    } catch {
      toast.error('Failed to archive');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No education entries yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((edu) => (
              <div key={edu.id} className="border rounded-lg p-4 space-y-2">
                <div>
                  <h3 className="font-semibold">
                    {edu.level} – {edu.fieldOfStudy}
                    {edu.grade && `, IPK: ${edu.grade}`}
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {edu.startDate} – {edu.endDate}
                </div>
                <div className="text-sm">
                  {edu.institution}{edu.location && ` – ${edu.location}`}
                </div>
                {edu.description && (
                  <p className="text-sm mt-2">{edu.description}</p>
                )}
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(edu)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => deactivate(edu.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
