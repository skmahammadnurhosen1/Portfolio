import { Project, Skill, Service } from '../types';
import { defaultInitialProjects, defaultProfileData } from '../lib/clientDatabase';

export { defaultProfileData };

export const servicesData: Service[] = [
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
];

export const skillsData: Skill[] = [
  // Graphic Design
  { name: 'CorelDRAW', category: 'Graphic Design', iconType: 'coreldraw', color: '#70C824' },
  { name: 'Illustrator', category: 'Graphic Design', iconType: 'illustrator', color: '#FF9A00' },
  { name: 'Photoshop', category: 'Graphic Design', iconType: 'photoshop', color: '#31A8FF' },
  { name: 'Figma', category: 'UI/UX Design', iconType: 'figma', color: '#A259FF' },

  // AI & Next-Gen Intelligence
  { name: 'Antigravity', category: 'AI Intelligence', iconType: 'antigravity', color: '#4285F4' },
  { name: 'ChatGPT', category: 'AI Architecture', iconType: 'chatgpt', color: '#10A37F' },
  { name: 'Gemini', category: 'Multimodal AI', iconType: 'gemini', color: '#3B82F6' },
  { name: 'Claude', category: 'Reasoning AI', iconType: 'claude', color: '#D97706' },
  { name: 'Midjourney', category: 'Generative Art', iconType: 'midjourney', color: '#818CF8' },

  // AI Coding & Modern IDEs
  { name: 'Cursor', category: 'AI Code Editor', iconType: 'cursor', color: '#52525B' },
  { name: 'Codex', category: 'Code Engine', iconType: 'codex', color: '#10A37F' },
  { name: 'Visual Studio', category: 'Development IDE', iconType: 'visualstudio', color: '#007ACC' },

  // Web Engineering & Platforms
  { name: 'React', category: 'Framework', iconType: 'react', color: '#61DAFB' },
  { name: 'JavaScript', category: 'Language', iconType: 'javascript', color: '#F7DF1E' },
  { name: 'Tailwind CSS', category: 'Styling', iconType: 'tailwind', color: '#06B6D4' },
  { name: 'HTML5', category: 'Frontend', iconType: 'html', color: '#E34F26' },
  { name: 'CSS3', category: 'Styling', iconType: 'css', color: '#1572B6' },
  { name: 'Git', category: 'Version Control', iconType: 'git', color: '#F05032' },
  { name: 'GitHub', category: 'Platform', iconType: 'github', color: '#6B7280' },
];

export const projectsData: Project[] = defaultInitialProjects;

