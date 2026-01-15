'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Experience } from '@/types/portfolio';
import { deleteExperience, updateExperience } from '@/lib/firestore';

const types = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'internship', label: 'Internship' },
  { value: 'organization', label: 'Organization' },
  { value: 'teaching', label: 'Teaching' },
];

const formatMonthYear = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

interface ExperienceListProps {
  onEdit?: (experience: Experience) => void;
}

export function ExperienceList({ onEdit }: ExperienceListProps) {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const constraints = [where('isActive', '==', true)];
    if (filter && filter !== 'all') {
      constraints.push(where('type', '==', filter));
    }
    
    const q = query(collection(db, 'experiences'), ...constraints);
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Experience))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        toast.error('Failed to load experience');
      }
    );

    return () => unsub();
  }, [filter]);

  const deactivate = async (id: string) => {
    try {
      await deleteExperience(id);
      toast.success('Experience archived');
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
      
      await updateExperience(itemToMove.id!, { order: orderAbove });
      await updateExperience(itemAbove.id!, { order: orderToMove });
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
      
      await updateExperience(itemToMove.id!, { order: orderBelow });
      await updateExperience(itemBelow.id!, { order: orderToMove });
    } catch (err) {
      toast.error('Failed to move item');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Experience List</CardTitle>
          <div className="w-48">
            <Select value={filter} onValueChange={(v) => { setFilter(v); }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {types.map(t => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No experience entries yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((exp) => (
              <div key={exp.id} className="flex items-start justify-between border rounded-lg p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <Badge variant="outline">{exp.organization}</Badge>
                    <Badge>{exp.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}</p>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {exp.skills.map((s, i) => (<Badge key={i} variant="secondary">{s}</Badge>))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(exp)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => moveUp(items.indexOf(exp))}
                    disabled={items.indexOf(exp) === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => moveDown(items.indexOf(exp))}
                    disabled={items.indexOf(exp) === items.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deactivate(exp.id!)}>
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
