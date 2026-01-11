# Setup Firebase Authentication

## 1. Enable Email/Password Authentication

1. Buka **Firebase Console**: https://console.firebase.google.com/
2. Pilih project Anda
3. Klik **Authentication** di menu kiri
4. Klik tab **Sign-in method**
5. Klik **Email/Password**
6. **Enable** Email/Password
7. Klik **Save**

## 2. Buat Akun Admin

1. Masih di halaman **Authentication**
2. Klik tab **Users**
3. Klik tombol **Add user**
4. Masukkan:
   - **Email**: admin@example.com (atau email yang Anda inginkan)
   - **Password**: password123 (minimal 6 karakter, gunakan password yang kuat)
5. Klik **Add user**

## 3. Login ke Admin CMS

1. Jalankan aplikasi: `npm run dev`
2. Buka browser: `http://localhost:3000/login`
3. Login dengan email dan password yang Anda buat di Firebase Console
4. Setelah login, Anda akan diarahkan ke `/admin`

## 4. Security Rules (Opsional - Untuk Production)

Untuk production, update Firestore rules agar hanya user yang login yang bisa menulis data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for everyone (public portfolio)
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write only for authenticated users (admin)
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Fitur yang Sudah Dibuat

✅ **Login page** di `/login`
✅ **Protected admin routes** - hanya bisa diakses setelah login
✅ **Logout button** di admin navbar
✅ **Auto redirect** - belum login → redirect ke `/login`
✅ **Session persistence** - login tetap aktif setelah refresh

## Troubleshooting

- Jika tidak bisa login, pastikan Email/Password sudah di-enable di Firebase Console
- Jika error "auth/invalid-credential", cek kembali email dan password
- Jika error "auth/too-many-requests", tunggu beberapa saat sebelum mencoba lagi
