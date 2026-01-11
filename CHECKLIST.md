# ✅ Setup Checklist

Gunakan checklist ini untuk memastikan semua setup sudah benar.

## Pre-Development

### 1. Firebase Setup
- [ ] Buat Firebase project di [Firebase Console](https://console.firebase.google.com/)
- [ ] Aktifkan Firestore Database (pilih lokasi: asia-southeast1)
- [ ] Aktifkan Firebase Storage
- [ ] Copy Firebase configuration credentials
- [ ] Update `.env.local` dengan credentials yang benar
- [ ] Set Firestore Rules ke test mode (untuk development)
- [ ] Set Storage Rules ke test mode (untuk development)

### 2. Development Environment
- [ ] Node.js 18+ terinstall
- [ ] npm atau yarn terinstall
- [ ] VS Code atau editor favorit siap
- [ ] Git terinstall (untuk version control)

### 3. Application Setup
- [ ] Dependencies sudah terinstall (`npm install`)
- [ ] Dev server bisa running (`npm run dev`)
- [ ] Aplikasi terbuka di http://localhost:3000
- [ ] Tidak ada error di terminal
- [ ] Tidak ada error di browser console

## Testing Features

### 4. Test Profile Management
- [ ] Buka http://localhost:3000/profile
- [ ] Form profile tampil dengan benar
- [ ] Bisa upload foto (max 5MB)
- [ ] Foto preview muncul setelah upload
- [ ] Bisa isi semua field (name, title, bio, etc)
- [ ] Klik "Save Profile" tidak ada error
- [ ] Data tersimpan di Firestore (cek di Firebase Console)
- [ ] Refresh page, data tetap ada (persistent)

### 5. Test Navigation
- [ ] Navbar muncul di semua halaman
- [ ] Semua link navigation berfungsi:
  - [ ] Home (/)
  - [ ] Profile (/profile)
  - [ ] Education (/education)
  - [ ] Experience (/experience)
  - [ ] Certifications (/certifications)
  - [ ] Settings (/settings)
- [ ] Active link ter-highlight dengan benar

### 6. Test Mode Switcher
- [ ] Mode switcher muncul di home page
- [ ] Bisa switch antara mode:
  - [ ] Full Portfolio
  - [ ] Teacher Mode
  - [ ] Developer Mode
  - [ ] Researcher Mode
- [ ] Badge mode muncul di navbar
- [ ] Selection tersimpan (tidak reset saat navigate)

## Code Quality

### 7. TypeScript
- [ ] Tidak ada TypeScript errors
- [ ] `npm run build` berhasil tanpa error
- [ ] All types properly defined

### 8. Styling
- [ ] Responsive di mobile (test dengan DevTools)
- [ ] Responsive di tablet
- [ ] Dark mode support (jika applicable)
- [ ] Consistent spacing & typography

## Firebase Integration

### 9. Firestore
- [ ] Connection ke Firestore berhasil
- [ ] Bisa read data
- [ ] Bisa write data
- [ ] Bisa update data
- [ ] Collections dibuat otomatis saat ada data:
  - [ ] personalInfo
  - [ ] education (akan dibuat nanti)
  - [ ] experiences (akan dibuat nanti)
  - [ ] certifications (akan dibuat nanti)

### 10. Firebase Storage
- [ ] Connection ke Storage berhasil
- [ ] Bisa upload foto
- [ ] Folder `profile-photos/` dibuat otomatis
- [ ] URL foto bisa diakses (public read)

## Documentation

### 11. Read Documentation
- [ ] Baca [README.md](README.md) - overview project
- [ ] Baca [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase setup details
- [ ] Baca [NEXT_STEPS.md](NEXT_STEPS.md) - roadmap development
- [ ] Baca [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - summary & quick start

## Git & Version Control

### 12. Git Setup (Recommended)
- [ ] Initialize git repo: `git init`
- [ ] Add remote: `git remote add origin [your-repo-url]`
- [ ] First commit:
  ```bash
  git add .
  git commit -m "Initial setup: Next.js + Shadcn + Firebase"
  git push -u origin main
  ```
- [ ] `.env.local` tidak ter-commit (check .gitignore)

## Optional but Recommended

### 13. VS Code Extensions
- [ ] ES7+ React/Redux/React-Native snippets
- [ ] Tailwind CSS IntelliSense
- [ ] Prettier - Code formatter
- [ ] ESLint
- [ ] Error Lens

### 14. Browser Extensions
- [ ] React Developer Tools
- [ ] Lighthouse (untuk performance audit)

## Ready to Develop!

Jika semua checklist di atas sudah ✅, maka Anda siap untuk:

1. **Mulai implementasi Education Management**
   - Buat list component
   - Buat form component
   - Implement CRUD operations

2. **Lanjut ke Experience Management**
   - Similar pattern dengan Education
   - Tambah filter by type

3. **Certifications Management**
   - Similar pattern
   - Tambah credential links

4. **Mode Filtering Logic**
   - Filter data berdasarkan selected mode
   - Update dashboard stats

5. **Public Portfolio View**
   - Create public routes
   - Beautiful read-only layouts

## Troubleshooting Checklist

Jika ada masalah, cek:

- [ ] `.env.local` sudah benar dan complete
- [ ] Dev server sudah restart setelah update env
- [ ] Firebase project aktif dan tidak suspended
- [ ] Firebase rules allow read/write (test mode)
- [ ] Browser console tidak ada error
- [ ] Terminal tidak ada error
- [ ] Internet connection stable
- [ ] Firebase billing account active (jika menggunakan Blaze plan)

## Need Help?

Jika stuck di salah satu checkpoint:

1. Check error messages di:
   - Browser Console (F12)
   - Terminal output
   - Firebase Console logs

2. Review relevant documentation:
   - Firebase error? → [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Code issue? → Check component files
   - TypeScript error? → Check [types/portfolio.ts](types/portfolio.ts)

3. Common issues:
   - **"Permission denied"** → Set Firebase rules to test mode
   - **"App not initialized"** → Check `.env.local` credentials
   - **"Failed to fetch"** → Check internet connection & Firebase status

---

**Status Check:**
- [ ] All pre-development tasks complete
- [ ] All features tested and working
- [ ] Documentation read and understood
- [ ] Ready to start building features! 🚀

**Last Updated:** Setup completion date
