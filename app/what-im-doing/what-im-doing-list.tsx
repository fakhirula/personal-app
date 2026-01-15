'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WhatImDoing } from '@/types/portfolio';
import { deleteWhatImDoing, updateWhatImDoing } from '@/lib/firestore';
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

interface WhatImDoingListProps {
  onEdit?: (item: WhatImDoing) => void;
}

export function WhatImDoingList({ onEdit }: WhatImDoingListProps = {}) {
  const [items, setItems] = useState<WhatImDoing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'whatImDoing'), where('isActive', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as WhatImDoing))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        toast.error('Failed to load');
      }
    );

    return () => unsub();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteWhatImDoing(id);
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    try {
      const itemToMove = items[index];
      const itemAbove = items[index - 1];
      
      const orderAbove = itemAbove.order ?? (index - 1);
      const orderToMove = itemToMove.order ?? index;
      
      await updateWhatImDoing(itemToMove.id!, { order: orderAbove });
      await updateWhatImDoing(itemAbove.id!, { order: orderToMove });
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
      
      await updateWhatImDoing(itemToMove.id!, { order: orderBelow });
      await updateWhatImDoing(itemBelow.id!, { order: orderToMove });
    } catch (err) {
      toast.error('Failed to move item');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>What I'm Doing List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No items yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || Code;
              return (
                <div key={item.id} className="flex items-start justify-between border rounded-lg p-3">
                  <div className="flex items-start gap-3 flex-1">
                    <IconComponent className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => moveUp(items.indexOf(item))}
                      disabled={items.indexOf(item) === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => moveDown(items.indexOf(item))}
                      disabled={items.indexOf(item) === items.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deactivate(item.id!)}>
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
