# Personal Portfolio CMS

Aplikasi portfolio pribadi dengan fitur CMS yang dibangun menggunakan Next.js, Shadcn UI, dan Firebase Firestore.

## 🚀 Fitur

- **Profile Management**: Kelola informasi profil pribadi dan upload foto
- **Education**: Dokumentasi riwayat pendidikan
- **Experience**: Catat pengalaman kerja, magang, organisasi, dan mengajar
- **Certifications**: Simpan sertifikasi dan penghargaan
- **Mode Switching**: Berbagai mode tampilan (Full, Teacher, Developer, Researcher)
- **CMS-like Interface**: Kelola semua data dengan mudah

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Firebase account

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Firestore Database
3. Aktifkan Storage untuk upload foto
4. Copy Firebase config credentials

### 3. Environment Variables

Edit file `.env.local` dan isi dengan credentials Firebase Anda:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
personal-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── profile/           # Profile management
│   ├── education/         # Education management
│   ├── experience/        # Experience management
│   ├── certifications/    # Certifications management
│   └── settings/          # Settings
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── navbar.tsx        # Navigation bar
│   └── mode-switcher.tsx # Portfolio mode switcher
├── lib/                   # Utilities & helpers
│   ├── firebase.ts       # Firebase config
│   ├── firestore.ts      # Firestore operations
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript types
    └── portfolio.ts       # Data models
```

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Language**: TypeScript

## 📝 Data Models

### PersonalInfo
- name, title, bio
- contact info (email, phone, location)
- photo URL
- social links

### Education
- institution, degree, field of study
- date range
- grade, description

### Experience
- title, organization
- type (work, internship, organization, teaching)
- date range
- description, skills, location

### Certification
- name, issuer
- issue date, expiry date
- credential ID & URL

## 🔄 Mode Switching

Aplikasi mendukung berbagai mode tampilan:

- **Full**: Tampilkan semua data
- **Teacher**: Hanya pengalaman mengajar
- **Developer**: Fokus pada pengalaman development
- **Researcher**: Riset dan publikasi

## 🚧 Next Steps

Untuk mengembangkan aplikasi lebih lanjut:

1. **Implementasi CRUD Forms**: Buat form lengkap untuk setiap section
2. **Upload Foto**: Implementasi upload dan preview foto profil
3. **Data Filtering**: Filter experience berdasarkan mode yang dipilih
4. **Authentication**: Tambah authentication untuk protect admin pages
5. **Public View**: Buat halaman public untuk menampilkan portfolio
6. **Export Feature**: Export portfolio ke PDF atau format lain

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT

