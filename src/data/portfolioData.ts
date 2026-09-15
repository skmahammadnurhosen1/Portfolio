import { Project, Skill, Service } from '../types';

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

export const projectsData: Project[] = [
  {
    id: 'brand-identity',
    title: 'Brand Identity Design',
    category: 'Branding',
    description: 'Logo, business card & brand guidelines for a modern brand.',
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=900&auto=format&fit=crop',
    client: 'Vanguard Corp',
    year: '2024',
    tags: ['Branding', 'Typography', 'Visual Identity', 'Print Design'],
    fullDetails: {
      overview: 'A complete visual identity redesign featuring black and gold luxury stationery, custom business cards, brand guide, typography rules, and sleek corporate presentation decks.',
      tools: ['Adobe Illustrator', 'Photoshop', 'Figma'],
      deliverables: ['Primary & Secondary Logos', 'Business Card Suites', 'Letterheads & Stationery', 'Comprehensive Brand Manual'],
      results: 'Increased client brand perception score by 45% and unified company touchpoints across 3 international offices.',
    },
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    category: 'Web Development',
    description: 'A clean and modern portfolio website to showcase my work and skills.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=900&auto=format&fit=crop',
    client: 'Personal & Creative Studio',
    year: '2025',
    tags: ['React', 'Tailwind CSS', 'TypeScript', 'Responsive Design'],
    fullDetails: {
      overview: 'Built a high-performance, responsive portfolio website featuring a sunny cream aesthetic, smooth transitions, interactive modals, and optimized mobile layouts.',
      tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      deliverables: ['Custom Web Application', 'Interactive Project Showcase', 'Contact Modal with Direct Actions', 'Full Dark/Light Theme Support'],
      results: 'Achieved 100/100 Lighthouse performance score with sub-second page loads and zero layout shift.',
    },
  },
  {
    id: 'social-media-design',
    title: 'Social Media Design',
    category: 'UI/UX Design',
    description: 'Creative posts for brands, events and social media platforms.',
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=900&auto=format&fit=crop',
    client: 'Pulse Marketing Agency',
    year: '2024',
    tags: ['UI/UX', 'Social Media', 'Content Creation', 'Motion Graphics'],
    fullDetails: {
      overview: 'Created a modular social media design kit for Instagram, LinkedIn, and Twitter with cohesive yellow-accented layouts, carousel templates, and high-conversion story graphics.',
      tools: ['Figma', 'Photoshop', 'After Effects'],
      deliverables: ['30+ Modular Post Templates', 'Story Highlight Covers', 'Animated Launch Teasers', 'Design System Guidelines'],
      results: 'Boosted client engagement by 68% and doubled weekly follower growth within the first month of rollout.',
    },
  },
  {
    id: 'ecommerce-redesign',
    title: 'Luxe Minimalist Store',
    category: 'Web Development',
    description: 'Clean e-commerce interface with rapid checkout and micro-interactions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
    client: 'Aura Lifestyle',
    year: '2024',
    tags: ['React', 'Tailwind CSS', 'Next.js', 'E-commerce'],
    fullDetails: {
      overview: 'Designed and developed a minimalist lifestyle storefront focused on conversion optimization and frictionless mobile shopping.',
      tools: ['React', 'Tailwind CSS', 'Figma'],
      deliverables: ['Storefront UI', 'Product Detail Screens', 'Streamlined Cart Flow'],
      results: 'Reduced cart abandonment rate by 22%.',
    },
  },
  {
    id: 'fintech-dashboard',
    title: 'Nova Financial Suite',
    category: 'UI/UX Design',
    description: 'Intuitive analytics and portfolio tracking dashboard for digital assets.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop',
    client: 'Nova Protocol',
    year: '2024',
    tags: ['Dashboard', 'Fintech', 'Design System', 'Data Viz'],
    fullDetails: {
      overview: 'Created a comprehensive financial dashboard with clear data visualizations, dark-mode-first aesthetic, and rapid transaction workflows.',
      tools: ['Figma', 'Tokens Studio'],
      deliverables: ['Full Design System', '40+ Screen Flows', 'Interactive Prototype'],
      results: 'Successfully raised $2.5M Seed round backed by prototype demonstrations.',
    },
  },
  {
    id: 'artisan-coffee-brand',
    title: 'Roast & Revel Identity',
    category: 'Branding',
    description: 'Artisanal coffee packaging, typography, and branded merchandise.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=900&auto=format&fit=crop',
    client: 'Roast & Revel Roasters',
    year: '2023',
    tags: ['Packaging', 'Illustration', 'Print', 'Brand Strategy'],
    fullDetails: {
      overview: 'Full package identity for specialty single-origin coffee beans, including custom hand-drawn motifs, compostable bag designs, and cafe collateral.',
      tools: ['Illustrator', 'Procreate', 'InDesign'],
      deliverables: ['Coffee Bag Packaging', 'Cup Sleeves & Menus', 'Merchandise Line'],
      results: 'Sold out initial batch of 5,000 bags in the first 48 hours of launch.',
    },
  },
];
