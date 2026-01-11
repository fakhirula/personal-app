import { db, storage } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type {
  PersonalInfo,
  Education,
  Experience,
  Certification,
} from '@/types/portfolio';

const COLLECTIONS = {
  personalInfo: 'personalInfo',
  education: 'education',
  experiences: 'experiences',
  certifications: 'certifications',
};

// Personal Info
export const getPersonalInfo = async (): Promise<PersonalInfo | null> => {
  const docRef = doc(db, COLLECTIONS.personalInfo, 'main');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as PersonalInfo) : null;
};

export const updatePersonalInfo = async (data: PersonalInfo): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.personalInfo, 'main');
  await setDoc(docRef, data, { merge: true });
};

// Education
export const getEducation = async (): Promise<Education[]> => {
  const q = query(collection(db, COLLECTIONS.education), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Education));
};

export const addEducation = async (data: Omit<Education, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.education));
  await setDoc(docRef, data);
  return docRef.id;
};

export const updateEducation = async (id: string, data: Partial<Education>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.education, id);
  await updateDoc(docRef, data);
};

export const deleteEducation = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.education, id);
  await updateDoc(docRef, { isActive: false });
};

// Experiences
export const getExperiences = async (type?: string): Promise<Experience[]> => {
  let q = query(collection(db, COLLECTIONS.experiences), where('isActive', '==', true));
  
  if (type) {
    q = query(q, where('type', '==', type));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Experience));
};

export const addExperience = async (data: Omit<Experience, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.experiences));
  await setDoc(docRef, data);
  return docRef.id;
};

export const updateExperience = async (id: string, data: Partial<Experience>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.experiences, id);
  await updateDoc(docRef, data);
};

export const deleteExperience = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.experiences, id);
  await updateDoc(docRef, { isActive: false });
};

// Certifications
export const getCertifications = async (): Promise<Certification[]> => {
  const q = query(collection(db, COLLECTIONS.certifications), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Certification));
};

export const addCertification = async (data: Omit<Certification, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.certifications));
  await setDoc(docRef, data);
  return docRef.id;
};

export const updateCertification = async (
  id: string,
  data: Partial<Certification>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.certifications, id);
  await updateDoc(docRef, data);
};

export const deleteCertification = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.certifications, id);
  await updateDoc(docRef, { isActive: false });
};

// File Upload
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `profile-photos/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
