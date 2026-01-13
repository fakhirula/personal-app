# EDIT FEATURE - Implementation Guide

## ✅ Sudah Selesai
- **Projects**: Sudah support edit functionality

## 📝 Pattern untuk Implementasi Edit

### 1. Update Form Component

```typescript
// Add interface for props
interface FormProps {
  onAdded: () => void;
  editingItem?: ItemType | null;
  onCancelEdit?: () => void;
}

// Add useEffect to load editing data
useEffect(() => {
  if (editingItem) {
    setForm({...editingItem});
    // Set any additional input states
  }
}, [editingItem]);

// Update handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (editingItem?.id) {
      await updateItem(editingItem.id, form);
      toast.success('Updated successfully');
    } else {
      await addItem(form);
      toast.success('Added successfully');
    }
    
    // Reset form
    setForm({...initialState});
    onAdded();
    if (onCancelEdit) onCancelEdit();
  } catch (err) {
    toast.error(editingItem ? 'Failed to update' : 'Failed to add');
  } finally {
    setLoading(false);
  }
};

// Add cancel handler
const handleCancel = () => {
  setForm({...initialState});
  if (onCancelEdit) onCancelEdit();
};

// Update CardHeader
<CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>{editingItem ? 'Edit Item' : 'Add Item'}</CardTitle>
    {editingItem && onCancelEdit && (
      <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
</CardHeader>

// Update submit button
<div className="flex justify-end gap-2">
  {editingItem && onCancelEdit && (
    <Button type="button" variant="outline" onClick={handleCancel}>
      Cancel
    </Button>
  )}
  <Button type="submit" disabled={loading}>
    {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
  </Button>
</div>
```

### 2. Update List Component

```typescript
// Add onEdit prop
interface ListProps {
  onEdit?: (item: ItemType) => void;
}

export function ItemList({ onEdit }: ListProps) {
  // ... existing code

  // Update buttons in item display
  <div className="flex gap-2">
    {onEdit && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(item)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    )}
    <Button
      size="sm"
      variant="ghost"
      onClick={() => deactivate(item.id!)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
}
```

### 3. Update Admin Page

```typescript
export default function AdminItemPage() {
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (item: ItemType) => {
    setEditingItem(item);
  };

  const handleAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <ItemForm 
        key={editingItem?.id || 'new'}
        onAdded={handleAdded}
        editingItem={editingItem}
        onCancelEdit={handleCancelEdit}
      />
      <ItemList key={refreshKey} onEdit={handleEdit} />
    </div>
  );
}
```

## 🎯 Files to Update

### Education
- ✅ [app/education/education-form.tsx](app/education/education-form.tsx)
- ✅ [app/education/education-list.tsx](app/education/education-list.tsx)  
- ✅ [app/admin/education/page.tsx](app/admin/education/page.tsx)

### Experience
- ✅ [app/experience/experience-form.tsx](app/experience/experience-form.tsx)
- ✅ [app/experience/experience-list.tsx](app/experience/experience-list.tsx)
- ✅ [app/admin/experience/page.tsx](app/admin/experience/page.tsx)

### Certifications
- ✅ [app/certifications/certification-form.tsx](app/certifications/certification-form.tsx)
- ✅ [app/certifications/certification-list.tsx](app/certifications/certification-list.tsx)
- ✅ [app/admin/certifications/page.tsx](app/admin/certifications/page.tsx)

### Skills
- ✅ [app/skills/skill-form.tsx](app/skills/skill-form.tsx)
- ✅ [app/skills/skill-list.tsx](app/skills/skill-list.tsx)
- ✅ [app/admin/skills/page.tsx](app/admin/skills/page.tsx)

## 🔧 Required Imports

Add to list components:
```typescript
import { Edit, Trash2 } from 'lucide-react';
```

Add to form components:
```typescript
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { updateItem } from '@/lib/firestore'; // Replace with specific update function
```

## 🎨 UI Changes

### List Component
- Add Edit button (outline variant) with Edit icon
- Change "Archive" to Trash2 icon (ghost variant)

### Form Component  
- Dynamic title: "Add" vs "Edit"
- Cancel button (X icon) in header when editing
- Cancel button in footer when editing
- Dynamic submit button text
