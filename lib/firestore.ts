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
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  PersonalInfo,
  Education,
  Experience,
  Certification,
  WhatImDoing,
  Skill,
  Project,
  ContactMessage,
} from '@/types/portfolio';

const COLLECTIONS = {
  personalInfo: 'personalInfo',
  education: 'education',
  experiences: 'experiences',
  certifications: 'certifications',
  whatImDoing: 'whatImDoing',
  skills: 'skills',
  projects: 'projects',
  contactMessages: 'contactMessages',
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
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Education))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
  const constraints = [
    where('isActive', '==', true),
    ...(type ? [where('type', '==', type)] : []),
  ];
  const q = query(collection(db, COLLECTIONS.experiences), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Experience))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
  const q = query(
    collection(db, COLLECTIONS.certifications),
    where('isActive', '==', true)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Certification))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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

// What I'm Doing
export const getWhatImDoing = async (): Promise<WhatImDoing[]> => {
  const q = query(
    collection(db, COLLECTIONS.whatImDoing),
    where('isActive', '==', true)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as WhatImDoing))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const addWhatImDoing = async (data: Omit<WhatImDoing, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.whatImDoing));
  await setDoc(docRef, data);
  return docRef.id;
};

export const updateWhatImDoing = async (id: string, data: Partial<WhatImDoing>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.whatImDoing, id);
  await updateDoc(docRef, data);
};

export const deleteWhatImDoing = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.whatImDoing, id);
  await updateDoc(docRef, { isActive: false });
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  const q = query(collection(db, COLLECTIONS.skills));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .filter(doc => {
      const data = doc.data();
      return data.isActive !== false;
    })
    .map((doc) => ({ id: doc.id, ...doc.data() } as Skill))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const addSkill = async (data: Omit<Skill, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.skills));
  await setDoc(docRef, data);
  return docRef.id;
};

export const updateSkill = async (id: string, data: Partial<Skill>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.skills, id);
  await updateDoc(docRef, data);
};

export const deleteSkill = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.skills, id);
  await updateDoc(docRef, { isActive: false });
};

// Projects
export const getProjects = async (category?: string): Promise<Project[]> => {
  const constraints = [
    where('isActive', '==', true),
    ...(category ? [where('category', '==', category)] : []),
  ];
  const q = query(collection(db, COLLECTIONS.projects), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Project))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const addProject = async (data: Omit<Project, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.projects));
  await setDoc(docRef, data);
  return docRef.id;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.projects, id);
  await updateDoc(docRef, data);
};

export const deleteProject = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.projects, id);
  await updateDoc(docRef, { isActive: false });
};

// File Upload
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `profile-photos/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const uploadProjectImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `project-images/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Contact Messages
export const addContactMessage = async (data: Omit<ContactMessage, 'id'>): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.contactMessages));
  await setDoc(docRef, data);
  return docRef.id;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const q = query(collection(db, COLLECTIONS.contactMessages));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContactMessage));
};
