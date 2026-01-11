export type PortfolioMode = 'full' | 'teacher' | 'developer' | 'researcher';

export interface PersonalInfo {
  id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  photoURL?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    facebook?: string;
  };
}

export interface Education {
  id?: string;
  institution: string;
  degree?: string;
  level: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
  location?: string;
  description?: string;
  isActive: boolean;
}

export interface Experience {
  id?: string;
  title: string;
  organization: string;
  type: 'work' | 'internship' | 'organization' | 'teaching';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  skills?: string[];
  location?: string;
  isActive: boolean;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialID?: string;
  credentialURL?: string;
  description?: string;
  isActive: boolean;
}

export interface Skill {
  id?: string;
  name: string;
  icon: string; // icon name from lucide-react
  description?: string;
  isActive: boolean;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  imageURL?: string;
  projectURL?: string;
  githubURL?: string;
  tags?: string[];
  completedDate?: string;
  isActive: boolean;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  education: Education[];
  experiences: Experience[];
  certifications: Certification[];
  currentMode: PortfolioMode;
}
