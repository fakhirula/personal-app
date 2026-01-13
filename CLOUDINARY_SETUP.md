# Cloudinary Integration Setup

Dokumentasi lengkap untuk upload gambar menggunakan Cloudinary.

## ✅ Sudah Disetup

### 1. Dependencies
```bash
npm install next-cloudinary cloudinary
```

### 2. Environment Variables
File `.env.local` sudah dikonfigurasi dengan:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloud name Cloudinary
- `CLOUDINARY_API_KEY` - API key (untuk server)
- `CLOUDINARY_API_SECRET` - API secret (untuk server)

### 3. Utility Functions
File `lib/cloudinary.ts` berisi:
- `uploadImage()` - Upload gambar ke Cloudinary
- `getCloudinaryUrl()` - Generate URL dengan transformasi
- `deleteImage()` - Hapus gambar dari Cloudinary

### 4. Upload Component
`components/image-upload.tsx` - Komponen reusable untuk upload

### 5. API Route
`app/api/cloudinary/delete.ts` - Server endpoint untuk delete gambar

## 🔧 Konfigurasi Cloudinary Upload Preset

1. Buka dashboard Cloudinary: https://console.cloudinary.com/
2. Masuk ke **Settings → Upload**
3. Tambah **Upload Preset** dengan konfigurasi:

**Konfigurasi yang dibutuhkan:**
```
Name: portfolio_unsigned
Signing Mode: Unsigned (penting!)
Folder: portfolio
```

## 📋 Implementasi di Form Components

### Profile Form
- Upload foto profil
- Folder: `portfolio/profile`
- Dimensi: 400x400 (square)

```tsx
const response = await uploadImage(file, 'portfolio/profile');
const photoURL = getCloudinaryUrl(response.public_id, {
  width: 400,
  height: 400,
  crop: 'fill',
  quality: 'auto',
});
```

### Project Form
- Upload gambar project
- Folder: `portfolio/projects`
- Dimensi: 600x400

```tsx
const response = await uploadImage(file, 'portfolio/projects');
const imageURL = getCloudinaryUrl(response.public_id, {
  width: 600,
  height: 400,
  crop: 'fill',
  quality: 'auto',
});
```

### Education Form
- Upload sertifikat/bukti kelulusan
- Folder: `portfolio/education`
- Dimensi: 600x800

```tsx
const response = await uploadImage(file, 'portfolio/education');
const certificateURL = getCloudinaryUrl(response.public_id, {
  width: 600,
  height: 800,
  crop: 'fill',
  quality: 'auto',
});
```

### Experience Form
- Upload company logo
- Folder: `portfolio/experience`
- Dimensi: 200x200 (square)

```tsx
const response = await uploadImage(file, 'portfolio/experience');
const logoURL = getCloudinaryUrl(response.public_id, {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
});
```

### Certification Form
- Upload gambar sertifikat
- Folder: `portfolio/certifications`
- Dimensi: 600x400

```tsx
const response = await uploadImage(file, 'portfolio/certifications');
const certificateImageURL = getCloudinaryUrl(response.public_id, {
  width: 600,
  height: 400,
  crop: 'fill',
  quality: 'auto',
});
```

## 💾 Menyimpan URL di Database

Setelah upload berhasil, simpan URL ke Firestore:

```tsx
// Profile
await updatePersonalInfo({ ...formData, photoURL });

// Project
await addProject({ ...form, imageURL });

// Education
await addEducation({ ...form, certificateURL });

// Experience
await addExperience({ ...form, logoURL });

// Certification
await addCertification({ ...form, certificateImageURL });
```

## 🎨 Penggunaan Transformasi URL

Dapatkan gambar dengan transformasi otomatis:

```tsx
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Resize dengan quality auto
const url = getCloudinaryUrl('portfolio/my-image', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto'
});

// Output: 
// https://res.cloudinary.com/dmr6gfbk1/image/upload/w_400,h_300,c_fill,q_auto/portfolio/my-image
```

### Opsi Transformasi
- `width` - Lebar gambar (pixel)
- `height` - Tinggi gambar (pixel)
- `crop` - Mode crop: `'fill'`, `'thumb'`, `'scale'`, `'fit'`
- `quality` - Kualitas: `'auto'` atau angka 1-100

## 🗑️ Menghapus Gambar

```tsx
import { deleteImage } from '@/lib/cloudinary';

await deleteImage('portfolio/old-image-public-id');
```

## 📊 Free Tier Limits

Cloudinary free tier memberikan:
- **25 GB storage/bulan**
- **25 GB bandwidth/bulan**
- **Unlimited uploads**
- **Basic transformations**

Cocok untuk portfolio personal!

## 🔗 Docs Berguna

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [Image Transformation](https://cloudinary.com/documentation/image_transformation_reference)
- [Cloudinary URL Format](https://cloudinary.com/documentation/cloudinary_url)

## ✨ Fitur Bonus

### Auto Format & Quality
```tsx
getCloudinaryUrl('image-id', {
  quality: 'auto'  // Pilih format optimal (webp, jpg, etc)
})
```

### Responsive Images
```tsx
// Mobile
getCloudinaryUrl('image-id', { width: 320, quality: 'auto' })

// Tablet
getCloudinaryUrl('image-id', { width: 768, quality: 'auto' })

// Desktop
getCloudinaryUrl('image-id', { width: 1200, quality: 'auto' })
```

### Blur Upload Placeholder
Tampilkan blur saat loading:
```tsx
getCloudinaryUrl('image-id', {
  width: 20,
  height: 20,
  quality: 10,
  crop: 'fill'
})
```
