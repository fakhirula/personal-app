'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Education } from '@/types/portfolio';
import { deleteEducation, updateEducation } from '@/lib/firestore';

interface EducationListProps {
  onEdit?: (education: Education) => void;
}

export function EducationList({ onEdit }: EducationListProps) {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'education'), where('isActive', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Education))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        toast.error('Failed to load education');
      }
    );

    return () => unsub();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteEducation(id);
      toast.success('Education archived');
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
      
      await updateEducation(itemToMove.id!, { order: orderAbove });
      await updateEducation(itemAbove.id!, { order: orderToMove });
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
      
      await updateEducation(itemToMove.id!, { order: orderBelow });
      await updateEducation(itemBelow.id!, { order: orderToMove });
    } catch (err) {
      toast.error('Failed to move item');
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
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => moveUp(items.indexOf(edu))}
                    disabled={items.indexOf(edu) === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => moveDown(items.indexOf(edu))}
                    disabled={items.indexOf(edu) === items.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
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
