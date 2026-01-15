'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Certification } from '@/types/portfolio';
import { deleteCertification, updateCertification } from '@/lib/firestore';

interface CertificationListProps {
  onEdit?: (certification: Certification) => void;
}

export function CertificationList({ onEdit }: CertificationListProps = {}) {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'certifications'), where('isActive', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Certification))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        toast.error('Failed to load certifications');
      }
    );

    return () => unsub();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteCertification(id);
      toast.success('Certification archived');
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
      
      await updateCertification(itemToMove.id!, { order: orderAbove });
      await updateCertification(itemAbove.id!, { order: orderToMove });
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
      
      await updateCertification(itemToMove.id!, { order: orderBelow });
      await updateCertification(itemBelow.id!, { order: orderToMove });
    } catch (err) {
      toast.error('Failed to move item');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No certifications yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between border rounded-lg p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <Badge variant="outline">{cert.issuer}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Issued: {cert.issueDate}{cert.expiryDate ? ` · Expires: ${cert.expiryDate}` : ''}</p>
                  {cert.description && (
                    <p className="text-sm mt-2">{cert.description}</p>
                  )}
                  {cert.credentialURL && (
                    <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">View credential</a>
                  )}
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(cert)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveUp(items.indexOf(cert))}
                    disabled={items.indexOf(cert) === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveDown(items.indexOf(cert))}
                    disabled={items.indexOf(cert) === items.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deactivate(cert.id!)}>
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
