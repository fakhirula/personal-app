'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Experience } from '@/types/portfolio';
import { getExperiences, deleteExperience } from '@/lib/firestore';

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

export function ExperienceList() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const refresh = async (type?: string) => {
    setLoading(true);
    try {
      const data = await getExperiences(type && type !== 'all' ? type : undefined);
      // Sort by startDate descending (newest first)
      const sorted = data.sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate));
      setItems(sorted);
    } catch (err) {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteExperience(id);
      toast.success('Experience archived');
      refresh(filter);
    } catch {
      toast.error('Failed to archive');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Experience List</CardTitle>
          <div className="w-48">
            <Select value={filter} onValueChange={(v) => { setFilter(v); refresh(v); }}>
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
                  <Button variant="ghost" onClick={() => deactivate(exp.id!)}>Archive</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
