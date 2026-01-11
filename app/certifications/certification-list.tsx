'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Certification } from '@/types/portfolio';
import { getCertifications, deleteCertification } from '@/lib/firestore';

export function CertificationList() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getCertifications();
      setItems(data);
    } catch (err) {
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const deactivate = async (id: string) => {
    try {
      await deleteCertification(id);
      toast.success('Certification archived');
      refresh();
    } catch {
      toast.error('Failed to archive');
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
                  <Button variant="ghost" onClick={() => deactivate(cert.id!)}>Archive</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
