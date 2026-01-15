'use client';

import { useState } from 'react';
import { WhatImDoingForm } from '@/app/what-im-doing/what-im-doing-form';
import { WhatImDoingList } from '@/app/what-im-doing/what-im-doing-list';
import type { WhatImDoing } from '@/types/portfolio';

export default function AdminWhatImDoingPage() {
  const [editingItem, setEditingItem] = useState<WhatImDoing | null>(null);

  const handleEdit = (item: WhatImDoing) => {
    setEditingItem(item);
  };

  const handleAdded = () => {
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">What I'm Doing Management</h1>
        <p className="text-muted-foreground">Kelola apa yang bisa Anda lakukan untuk perusahaan</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit">
          <WhatImDoingForm 
            key={editingItem?.id || 'new'}
            onAdded={handleAdded}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <WhatImDoingList 
          key={editingItem?.id ? `list-${editingItem.id}` : 'list'}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
