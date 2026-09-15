export interface ProjectItem {
  id: string;
  title: string;
  projectType?: 'website' | 'graphics';
  category?: 'Branding' | 'Web Development' | 'UI/UX Design' | 'Graphics Design' | 'Website' | string;
  shortDescription: string;
  description?: string;
  detailedDescription?: string;
  techStack: string[];
  tags?: string[];
  designTools?: string[];
  deliverables?: string[];
  designSubtype?: string;
  status: 'Live' | 'Published' | 'Draft';
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  image?: string;
  storagePath?: string;
  client?: string;
  year?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read?: boolean;
  createdAt: string;
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
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalViews: string;
  viewsGrowth: string;
  viewsData: Array<{ date: string; views: number; label: string }>;
  recentProjects: Array<{
    id: string;
    title: string;
    status: 'Live' | 'Draft' | 'Published';
    updatedAgo: string;
    imageUrl: string;
  }>;
}

export type AdminTab = 'dashboard' | 'projects' | 'personal-details' | 'messages' | 'settings';
