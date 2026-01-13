'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { uploadImage, UploadResponse } from '@/lib/cloudinary';

interface ImageUploadProps {
  onSuccess?: (response: UploadResponse) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ onSuccess, folder = 'portfolio', className = '' }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadImage(file, folder);
      toast.success('Foto berhasil diupload!');
      setPreview(null);
      fileInput.value = '';
      onSuccess?.(response);
    } catch (error) {
      console.error(error);
      toast.error('Gagal upload foto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pilih Foto</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !preview}
        className="w-full"
      >
        {loading ? 'Uploading...' : 'Upload Foto'}
      </Button>
    </form>
  );
}
