import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use static accesses so Next.js can inline env values in the client bundle
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const missing = [
  ['NEXT_PUBLIC_FIREBASE_API_KEY', apiKey],
  ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', authDomain],
  ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', projectId],
  ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', storageBucket],
  ['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', messagingSenderId],
  ['NEXT_PUBLIC_FIREBASE_APP_ID', appId],
].filter(([, value]) => !value);

if (missing.length > 0) {
  throw new Error(
    `Firebase env vars missing: ${missing.map(([k]) => k).join(', ')}. Perbarui .env.local sesuai FIREBASE_SETUP.md`
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
