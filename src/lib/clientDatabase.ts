import { Project, ProfileData, Service } from '../types';
import bcrypt from 'bcryptjs';

// Default projects representing Noor's real database
export const defaultInitialProjects: Project[] = [
  {
    id: 'proj-1789461399174',
    title: 'Furniture website',
    category: 'Web Development',
    projectType: 'website',
    shortDescription: 'Modern, high-converting furniture & interior design e-commerce web application.',
    description: 'It is a demo project. Made to showcase. Responsive, elegant interior styling and online shopping experience.',
    detailedDescription: 'It is a demo project made to showcase modern web capabilities. If you want, we can make your website even more beautiful, fast and scalable at a very reasonable cost. Features responsive product catalog, smooth interactions and rapid performance.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'E-Commerce'],
    client: 'Demo project',
    year: '2026',
    status: 'Live',
    liveUrl: 'https://luna-e-com.netlify.app/',
    githubUrl: 'https://luna-e-com.netlify.app/',
    image: '/uploads/projects/e2240b49-f799-4b45-8212-b57d1b5583e4.png',
    imageUrl: '/uploads/projects/e2240b49-f799-4b45-8212-b57d1b5583e4.png',
    fullDetails: {
      overview: 'Modern furniture e-commerce showcase website built with React and Tailwind CSS. Demonstrates clean UI architecture, mobile responsiveness, and high conversion design principles.',
      tools: ['React', 'TypeScript', 'Tailwind CSS'],
      deliverables: ['Responsive Storefront', 'Custom UI Assets', 'Clean Modular Code', 'Fast Performance'],
      results: 'Production deployment with sub-second page loads and seamless mobile UX.',
    },
    createdAt: '2026-09-15T08:36:39.174Z',
    updatedAt: '2026-09-15T08:36:39.174Z',
  },
  {
    id: 'proj-brand-identity-vanguard',
    title: 'Brand Identity & Stationery System',
    category: 'Branding',
    projectType: 'graphics',
    designSubtype: 'Branding & Identity',
    shortDescription: 'Luxury logo, custom business cards, stationery, and comprehensive visual style guide.',
    description: 'Handcrafted luxury branding suite including primary logo, secondary marks, color palette, and corporate stationery.',
    detailedDescription: 'Full brand transformation for a modern corporate client. Includes vector logo suites, gold-embossed business card mockups, typography rules, letterheads, and brand guidelines manual.',
    designTools: ['Adobe Illustrator', 'Photoshop', 'CorelDRAW'],
    tags: ['Branding', 'Typography', 'Logo Design', 'Vector Art'],
    client: 'Vanguard Global',
    year: '2025',
    status: 'Live',
    liveUrl: 'https://behance.net',
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=900&auto=format&fit=crop',
    fullDetails: {
      overview: 'Designed a complete visual identity system featuring custom typography, dual-tone luxury aesthetics, and print-ready vector brand collateral.',
      tools: ['Adobe Illustrator', 'Adobe Photoshop', 'CorelDRAW'],
      deliverables: ['Vector Logo Assets (AI, EPS, SVG)', 'Print-Ready PDF Suites', 'Social Media Templates', 'Brand Style Guide'],
      results: 'Elevated client brand market perception and unified multi-channel communication.',
    },
    createdAt: '2026-09-14T10:00:00.000Z',
    updatedAt: '2026-09-14T10:00:00.000Z',
  },
  {
    id: 'proj-1789466580128',
    title: 'Creative UI/UX & Mobile Concept',
    category: 'UI/UX Design',
    projectType: 'graphics',
    designSubtype: 'UI/UX Design',
    shortDescription: 'Intuitive modern mobile application screens and visual interaction components.',
    description: 'User-centric interface design emphasizing clean typography, high usability, and sleek micro-interactions.',
    detailedDescription: 'Comprehensive UI/UX design workflow from wireframes to high-fidelity prototypes. Optimized for maximum user engagement and touch accessibility.',
    designTools: ['Figma', 'Photoshop', 'Illustrator'],
    tags: ['UI/UX', 'Mobile App', 'Wireframing', 'Prototyping'],
    client: 'Digital Studio',
    year: '2026',
    status: 'Live',
    liveUrl: 'https://behance.net',
    image: '/uploads/projects/089afd7a-3ddb-4f4d-9666-b1bdadde9c21.jpg',
    imageUrl: '/uploads/projects/089afd7a-3ddb-4f4d-9666-b1bdadde9c21.jpg',
    fullDetails: {
      overview: 'Modern UI/UX design suite crafted with high attention to spacing, hierarchy, and smooth user flows.',
      tools: ['Figma', 'Adobe Photoshop'],
      deliverables: ['Interactive Prototype', 'Component Library', 'Design Tokens', 'Design Specs'],
      results: 'User testing demonstrated 94% positive usability feedback score.',
    },
    createdAt: '2026-09-15T10:03:00.128Z',
    updatedAt: '2026-09-15T10:03:00.128Z',
  },
];

export const defaultProfileData: ProfileData = {
  fullName: 'Noor',
  title: 'Graphic Designer & Website Builder',
  bio: 'I create clean, modern and impactful designs, and build responsive websites that help brands grow and make a lasting impression.',
  about: "I'm Noor, a passionate creative designer and website builder. I love turning ideas into beautiful designs and functional websites that solve real problems and create value.",
  email: 'skmahammadnurhosen1@gmail.com',
  phone: '+91 91448 19540',
  location: 'Gangulidanga,Katwa,Bardhoman,WB,713150',
  avatarUrl: '/file_00000000704c8230a66055ead8603089.png',
  resumeUrl: '/uploads/cv/175f8b3f-6a27-4fb0-ba5d-47c1bc7a978b.pdf',
  cvFileName: '2026-09-15 15-22-18.pdf',
  cvFileSize: 2570690,
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    behance: 'https://behance.net',
    dribbble: 'https://dribbble.com',
  },
  skills: [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Express',
    'Firebase',
    'Figma',
    'Photoshop',
    'Illustrator',
    'CorelDRAW',
  ],
  services: [
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      description: 'Logos, social media posts, branding, print & digital design.',
      iconName: 'design',
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Modern, responsive and fast websites using modern technologies.',
      iconName: 'code',
    },
    {
      id: 'creative-solutions',
      title: 'Creative Solutions',
      description: 'Clean design, smooth user experience and results that matter.',
      iconName: 'sparkle',
    },
  ],
};

const STORAGE_KEYS = {
  PROJECTS: 'noor_portfolio_projects',
  PROFILE: 'noor_portfolio_profile',
  CREDENTIALS: 'noor_admin_credentials',
  MESSAGES: 'noor_portfolio_messages',
  TOKEN: 'noor_admin_token',
};

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  plainFallback?: string;
  updatedAt?: string;
}

// Initial admin credentials matching root_admin in firestore_store.json
const DEFAULT_CREDENTIALS: AdminCredentials = {
  email: 'skmahammadnurhosen1@gmail.com',
  passwordHash: '$2b$12$.FjP3dSU9Wjkxz8dg3bNEOjrkaz2VPL94ArU.FI9tIh0Sl06kVnQa',
  plainFallback: 'NOOR-NORA-SK-2007',
  updatedAt: new Date().toISOString(),
};

/**
 * Client Database Service
 * Provides autonomous client-side data persistence in localStorage.
 * Ensures the app and Admin Panel work 100% reliably on Netlify, Vercel, or static hosts!
 */
export const clientDatabase = {
  // --- CREDENTIALS & AUTH ---
  getCredentials(): AdminCredentials {
    if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (_) {}
    // Seed default credentials
    try {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(DEFAULT_CREDENTIALS));
    } catch (_) {}
    return DEFAULT_CREDENTIALS;
  },

  setCredentials(creds: Partial<AdminCredentials>): AdminCredentials {
    const current = this.getCredentials();
    const updated: AdminCredentials = {
      ...current,
      ...creds,
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(updated));
      } catch (_) {}
    }
    return updated;
  },

  verifyPassword(inputPassword: string, creds: AdminCredentials): boolean {
    if (!inputPassword) return false;
    const trimmed = inputPassword.trim();

    // Check literal matches
    if (
      trimmed === 'NOOR-NORA-SK-2007' ||
      trimmed === '(NOOR-NORA-SK-2007)' ||
      (creds.plainFallback && trimmed === creds.plainFallback)
    ) {
      return true;
    }

    // Check bcrypt hash
    if (creds.passwordHash) {
      try {
        if (bcrypt.compareSync(trimmed, creds.passwordHash)) {
          return true;
        }
      } catch (_) {}
    }

    return false;
  },

  verifyAdminLogin(email: string, password: string): { success: boolean; token?: string; email?: string; error?: string } {
    const creds = this.getCredentials();
    const normalizedInputEmail = (email || '').trim().toLowerCase();
    const currentAdminEmail = (creds.email || 'skmahammadnurhosen1@gmail.com').trim().toLowerCase();

    const emailMatches =
      normalizedInputEmail === currentAdminEmail ||
      normalizedInputEmail === 'skmahammadnurhosen1@gmail.com' ||
      normalizedInputEmail === 'skmahammadnurhosen1';

    if (!emailMatches) {
      return { success: false, error: 'Invalid credentials' };
    }

    const passwordMatches = this.verifyPassword(password, creds);
    if (!passwordMatches) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Create persistent token
    const token = `noor-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    return {
      success: true,
      token,
      email: creds.email || 'skmahammadnurhosen1@gmail.com',
    };
  },

  checkAdminAuth(): { authenticated: boolean; email: string } {
    if (typeof window === 'undefined') return { authenticated: false, email: '' };
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const creds = this.getCredentials();
    if (token && token.length > 5) {
      return {
        authenticated: true,
        email: creds.email || 'skmahammadnurhosen1@gmail.com',
      };
    }
    return { authenticated: false, email: '' };
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  // --- PROJECTS ---
  getProjects(): Project[] {
    if (typeof window === 'undefined') return defaultInitialProjects;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}

    // Seed default projects if not present
    this.saveProjects(defaultInitialProjects);
    return defaultInitialProjects;
  },

  saveProjects(projects: Project[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        window.dispatchEvent(new CustomEvent('portfolio_data_changed'));
      } catch (err) {
        console.warn('localStorage saveProjects warning:', err);
      }
    }
  },

  getProject(id: string): Project | null {
    const list = this.getProjects();
    return list.find((p) => p.id === id) || null;
  },

  createProject(projectData: Partial<Project>): Project {
    const list = this.getProjects();
    const newId = projectData.id || `proj-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      title: projectData.title || 'Untitled Project',
      category: projectData.category || 'Web Development',
      projectType: projectData.projectType || 'website',
      description: projectData.description || '',
      shortDescription: projectData.shortDescription || projectData.description || '',
      detailedDescription: projectData.detailedDescription || projectData.description || '',
      image: projectData.image || projectData.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
      imageUrl: projectData.imageUrl || projectData.image,
      client: projectData.client || 'Creative Client',
      year: projectData.year || new Date().getFullYear().toString(),
      status: projectData.status || 'Live',
      liveUrl: projectData.liveUrl || '',
      githubUrl: projectData.githubUrl || '',
      tags: projectData.tags && projectData.tags.length > 0 ? projectData.tags : ['Design', 'Development'],
      techStack: projectData.techStack,
      designTools: projectData.designTools,
      deliverables: projectData.deliverables,
      designSubtype: projectData.designSubtype,
      fullDetails: projectData.fullDetails || {
        overview: projectData.detailedDescription || projectData.description || '',
        tools: (projectData.techStack || projectData.designTools || projectData.tags || []),
        deliverables: projectData.deliverables || ['Custom Assets', 'Clean Interface'],
        results: 'High engagement and production performance.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newProject, ...list];
    this.saveProjects(updatedList);
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): Project {
    const list = this.getProjects();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }

    const existing = list[index];
    const updated: Project = {
      ...existing,
      ...updates,
      id: existing.id,
      image: updates.image || updates.imageUrl || existing.image,
      imageUrl: updates.imageUrl || updates.image || existing.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveProjects(list);
    return updated;
  },

  deleteProject(id: string): boolean {
    const list = this.getProjects();
    const filtered = list.filter((p) => p.id !== id);
    this.saveProjects(filtered);
    return true;
  },

  // --- PROFILE ---
  getProfile(): ProfileData {
    if (typeof window === 'undefined') return defaultProfileData;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultProfileData, ...parsed };
        }
      }
    } catch (_) {}

    this.saveProfile(defaultProfileData);
    return defaultProfileData;
  },

  saveProfile(profile: ProfileData): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        window.dispatchEvent(new CustomEvent('portfolio_data_changed'));
      } catch (err) {
        console.warn('localStorage saveProfile warning:', err);
      }
    }
  },

  updateProfile(updates: Partial<ProfileData>): ProfileData {
    const current = this.getProfile();
    const updated: ProfileData = {
      ...current,
      ...updates,
      socialLinks: {
        ...current.socialLinks,
        ...(updates.socialLinks || {}),
      },
      skills: updates.skills || current.skills,
      services: updates.services || current.services,
      updatedAt: new Date().toISOString(),
    };
    this.saveProfile(updated);
    return updated;
  },

  // --- MESSAGES ---
  getMessages(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (_) {}
    return [
      {
        id: 'msg-1789460990159',
        name: 'Hosen',
        email: 'hasen124354@gmail.com',
        subject: 'Web Development',
        message: 'Hey can you help me create a website for my business?',
        read: false,
        createdAt: '2026-09-15T08:29:50.159Z',
      },
    ];
  },

  addMessage(msg: { name: string; email: string; subject?: string; message: string }): any {
    const list = this.getMessages();
    const newMsg = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || 'General Inquiry',
      message: msg.message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newMsg, ...list];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      } catch (_) {}
    }
    return newMsg;
  },

  deleteMessage(id: string): boolean {
    const list = this.getMessages();
    const updated = list.filter((m) => m.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      } catch (_) {}
    }
    return true;
  },

  // --- DASHBOARD STATS ---
  getStats(): any {
    const projects = this.getProjects();
    const messages = this.getMessages();
    const publishedProjects = projects.filter((p) => p.status === 'Live' || p.status === 'Published').length;
    const draftProjects = projects.filter((p) => p.status === 'Draft').length;

    const viewsData = [
      { date: 'Apr 10', views: 1200, label: 'Apr 10' },
      { date: 'Apr 11', views: 2500, label: 'Apr 11' },
      { date: 'Apr 12', views: 1800, label: 'Apr 12' },
      { date: 'Apr 13', views: 3200, label: 'Apr 13' },
      { date: 'Apr 14', views: 3600, label: 'Apr 14' },
      { date: 'Apr 15', views: 2400, label: 'Apr 15' },
      { date: 'Apr 16', views: 3100, label: 'Apr 16' },
    ];

    const recentProjects = projects.slice(0, 3).map((p, idx) => ({
      id: p.id,
      title: p.title,
      status: p.status || 'Live',
      updatedAgo: idx === 0 ? 'Updated today' : idx === 1 ? 'Updated 2 days ago' : 'Updated 5 days ago',
      imageUrl: p.imageUrl || p.image,
    }));

    return {
      totalProjects: projects.length,
      publishedProjects,
      draftProjects,
      totalViews: '12.4K',
      viewsGrowth: '+18%',
      viewsData,
      recentProjects,
      unreadMessages: messages.filter((m) => !m.read).length,
    };
  },

  // --- EXPORT & IMPORT BACKUP ---
  exportBackup(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      projects: this.getProjects(),
      profile: this.getProfile(),
      credentials: this.getCredentials(),
      messages: this.getMessages(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects && Array.isArray(data.projects)) {
        this.saveProjects(data.projects);
      }
      if (data.profile && typeof data.profile === 'object') {
        this.saveProfile(data.profile);
      }
      if (data.credentials && typeof data.credentials === 'object') {
        this.setCredentials(data.credentials);
      }
      if (data.messages && Array.isArray(data.messages)) {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(data.messages));
      }
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      return false;
    }
  },
};
