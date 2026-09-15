export interface Project {
  id: string;
  title: string;
  category: 'Branding' | 'Web Development' | 'UI/UX Design';
  description: string;
  image: string;
  client?: string;
  year?: string;
  tags: string[];
  fullDetails?: {
    overview: string;
    tools: string[];
    deliverables: string[];
    results: string;
  };
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
