export type ProjectType = 'website' | 'graphics';

export interface Project {
  id: string;
  title: string;
  projectType?: ProjectType;
  category: 'Branding' | 'Web Development' | 'UI/UX Design' | 'Graphics Design' | 'Website' | string;
  description: string;
  shortDescription?: string;
  detailedDescription?: string;
  image: string;
  imageUrl?: string;
  storagePath?: string;
  client?: string;
  year?: string;
  tags: string[];
  techStack?: string[];
  designTools?: string[];
  deliverables?: string[];
  designSubtype?: string;
  status?: 'Live' | 'Published' | 'Draft';
  liveUrl?: string; // Website: Live link; Graphics: Behance/Dribbble/Figma showcase
  githubUrl?: string; // Website only
  fullDetails?: {
    overview: string;
    tools: string[];
    deliverables: string[];
    results: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileData {
  fullName: string;
  title: string;
  bio: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  avatarStoragePath?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    behance?: string;
    dribbble?: string;
  };
  skills: string[];
  services?: Array<{
    id: string;
    title: string;
    description: string;
    iconName: 'design' | 'code' | 'sparkle';
  }>;
  resumeUrl?: string;
  cvFileName?: string;
  cvFileSize?: number;
  cvStoragePath?: string;
  cvUpdatedAt?: string;
  updatedAt?: string;
}

export interface Skill {
  name: string;
  category: string;
  iconType:
    | 'html'
    | 'css'
    | 'javascript'
    | 'react'
    | 'tailwind'
    | 'git'
    | 'github'
    | 'coreldraw'
    | 'illustrator'
    | 'photoshop'
    | 'figma'
    | 'antigravity'
    | 'chatgpt'
    | 'gemini'
    | 'midjourney'
    | 'codex'
    | 'cursor'
    | 'visualstudio'
    | 'claude';
  color: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'design' | 'code' | 'sparkle';
}
