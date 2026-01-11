# Panduan Setup Firebase

Panduan langkah demi langkah untuk setup Firebase untuk aplikasi Personal Portfolio CMS.

## 1. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau "Tambahkan project"
3. Beri nama project (contoh: "personal-portfolio")
4. (Opsional) Aktifkan Google Analytics
5. Klik "Create project"

## 2. Setup Firestore Database

1. Di sidebar, klik "Build" > "Firestore Database"
2. Klik "Create database"
3. Pilih lokasi server terdekat (contoh: asia-southeast1)
4. Pilih mode:
   - **Production mode**: Untuk production (lebih secure)
   - **Test mode**: Untuk development (lebih mudah untuk testing)
5. Klik "Create"

### Firestore Security Rules (Untuk Development)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all (HANYA UNTUK DEVELOPMENT!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Firestore Security Rules (Untuk Production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Personal Info - Public read, auth write
    match /personalInfo/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Education, Experience, Certifications - Public read, auth write
    match /{collection}/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 3. Setup Firebase Storage

1. Di sidebar, klik "Build" > "Storage"
2. Klik "Get started"
3. Review security rules
4. Pilih lokasi yang sama dengan Firestore
5. Klik "Done"

### Storage Security Rules (Untuk Development)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Storage Security Rules (Untuk Production)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{fileName} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024  // 5MB max
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 4. Dapatkan Firebase Config

1. Di Firebase Console, klik icon gear ⚙️ > "Project settings"
2. Scroll ke bawah ke bagian "Your apps"
3. Klik icon web `</>`
4. Beri nama app (contoh: "Personal Portfolio Web")
5. (Opsional) Setup Firebase Hosting
6. Klik "Register app"

7. Copy konfigurasi yang muncul, akan terlihat seperti:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

## 5. Update .env.local

Copy nilai dari Firebase config ke file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

## 6. Test Koneksi

1. Restart development server:
```bash
npm run dev
```

2. Buka browser console (F12)
3. Tidak ada error Firebase = berhasil!

## 7. (Opsional) Setup Authentication

Jika ingin menambahkan authentication nanti:

1. Di sidebar, klik "Build" > "Authentication"
2. Klik "Get started"
3. Pilih sign-in method (Email/Password, Google, dll)
4. Enable dan configure

## 8. Struktur Collections di Firestore

Aplikasi ini akan membuat collections berikut:

```
firestore/
├── personalInfo/
│   └── main (document)
├── education/
│   ├── doc1
│   ├── doc2
│   └── ...
├── experiences/
│   ├── doc1
│   ├── doc2
│   └── ...
└── certifications/
    ├── doc1
    ├── doc2
    └── ...
```

Collections akan dibuat otomatis saat Anda menambahkan data pertama kali.

## Tips & Best Practices

1. **Jangan commit .env.local**: Sudah ada di .gitignore
2. **Gunakan Production Rules**: Ganti security rules sebelum deploy
3. **Backup Data**: Export Firestore data secara berkala
4. **Monitor Usage**: Cek Firebase console untuk usage & billing
5. **Optimize Queries**: Gunakan indexing untuk query yang kompleks

## Troubleshooting

### Error: Permission Denied
- Cek Firestore Security Rules
- Pastikan rules allow read/write sesuai kebutuhan

### Error: Storage Upload Failed  
- Cek Storage Security Rules
- Pastikan file size dan type sesuai rules

### Error: Firebase Config Not Found
- Cek file .env.local sudah benar
- Restart development server setelah update .env.local

## Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Security Rules Documentation](https://firebase.google.com/docs/rules)
