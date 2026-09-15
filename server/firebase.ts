import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { cert } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Storage directory for local fallback (persisted between dev restarts)
const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'firestore_store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to format/reconstruct PEM private keys across diverse environment variable formats
// (e.g. single-line flattened keys, escaped \n, wrapped quotes, or standard multiline PEM)
export function formatPrivateKey(key?: string): string {
  if (!key) return '';
  let cleanKey = key.trim();

  // Strip surrounding quotes if present (e.g. "..." or '...')
  if (
    (cleanKey.startsWith('"') && cleanKey.endsWith('"')) ||
    (cleanKey.startsWith("'") && cleanKey.endsWith("'"))
  ) {
    cleanKey = cleanKey.slice(1, -1).trim();
  }

  // Handle literal escaped newlines like \n or \r\n
  if (cleanKey.includes('\\n')) {
    cleanKey = cleanKey.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  }

  // If the PEM key was flattened with spaces instead of linebreaks (common in web config inputs):
  if (!cleanKey.includes('\n')) {
    const headerMatch = cleanKey.match(/^-----BEGIN [A-Z ]+-----/);
    const footerMatch = cleanKey.match(/-----END [A-Z ]+-----$/);

    if (headerMatch && footerMatch) {
      const header = headerMatch[0];
      const footer = footerMatch[0];
      const body = cleanKey
        .slice(header.length, cleanKey.length - footer.length)
        .trim()
        .replace(/\s+/g, '');

      // Re-chunk body into standard 64-character PEM lines
      const chunkedBody = body.match(/.{1,64}/g)?.join('\n') || body;
      cleanKey = `${header}\n${chunkedBody}\n${footer}\n`;
    }
  }

  // Ensure terminating newline
  if (!cleanKey.endsWith('\n')) {
    cleanKey += '\n';
  }

  return cleanKey;
}

// Check if Firebase Admin can be initialized with credentials
let isRealFirebase = false;
let firestoreAvailable = false;
let storageAvailable = false;
let bucketInstance: any = null;

try {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (serviceAccount.private_key) {
      serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
    }
    admin.initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
    });
    isRealFirebase = true;
    bucketInstance = getStorage().bucket();
    console.log('[Firebase] Initialized with serviceAccountKey.json successfully.');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const formattedPrivateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedPrivateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
    isRealFirebase = true;
    bucketInstance = getStorage().bucket();
    console.log('[Firebase] Initialized with environment credentials successfully.');
  } else {
    console.log('[Firebase] No serviceAccountKey.json or Firebase env detected. Using resilient Local Firestore & Storage Adapter.');
  }

  // Configure Firestore settings to tolerate undefined values safely
  if (isRealFirebase) {
    try {
      getFirestore().settings({ ignoreUndefinedProperties: true });
    } catch {
      // Settings can only be applied once on startup
    }

    // Gracefully verify service capabilities without crashing or dumping error traces
    getFirestore()
      .doc('admins/root_admin')
      .get()
      .then(async () => {
        firestoreAvailable = true;
        console.log('[Firebase] Cloud Firestore is active.');
        await initializeFirestoreSync();
      })
      .catch((err) => {
        firestoreAvailable = false;
        console.log('[Firebase] Cloud Firestore API is not active in this GCP project or network error. Using local persistent store.', err?.message || '');
      });

    if (bucketInstance) {
      bucketInstance
        .exists()
        .then(([exists]: [boolean]) => {
          storageAvailable = exists;
          if (exists) {
            console.log(`[Firebase Storage] Bucket '${bucketInstance.name}' is active.`);
          } else {
            console.log(`[Firebase Storage] Bucket not provisioned yet. Using local uploads directory.`);
          }
        })
        .catch(() => {
          storageAvailable = false;
        });
    }
  }
} catch {
  console.log('[Firebase] Firebase Admin SDK credentials unavailable, using resilient Local Storage Adapter.');
  isRealFirebase = false;
  firestoreAvailable = false;
  storageAvailable = false;
}

// Utility to recursively sanitize data structures so undefined values are omitted or converted
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return '' as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        clean[key] = sanitizeForFirestore(value);
      }
    }
    return clean as any;
  }
  return data;
}

// Initial seed data matching user's portfolio and requirements
const DEFAULT_STORE = {
  admins: {
    root_admin: {
      email: process.env.INITIAL_ADMIN_EMAIL || 'skmahammadnurhosen1@gmail.com',
      // High-security bcrypt hash for NOOR-NORA-SK-2007 (salt rounds: 12)
      passwordHash: bcrypt.hashSync(process.env.INITIAL_ADMIN_PASSWORD || 'NOOR-NORA-SK-2007', 12),
      activeSessionId: null,
      updatedAt: new Date().toISOString(),
    },
  },
  projects: {
    'brand-identity': {
      id: 'brand-identity',
      title: 'Brand Identity Design',
      category: 'Branding',
      shortDescription: 'Logo, business card & brand guidelines for a modern brand.',
      detailedDescription: 'A complete visual identity redesign featuring black and gold luxury stationery, custom business cards, brand guide, typography rules, and sleek corporate presentation decks.',
      techStack: ['Branding', 'Typography', 'Visual Identity', 'Print Design'],
      tags: ['Branding', 'Typography', 'Visual Identity', 'Print Design'],
      status: 'Live',
      liveUrl: 'https://dribbble.com',
      githubUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=900&auto=format&fit=crop',
      storagePath: 'projects/brand-identity.jpg',
      client: 'Vanguard Corp',
      year: '2024',
      fullDetails: {
        overview: 'A complete visual identity redesign featuring black and gold luxury stationery, custom business cards, brand guide, typography rules, and sleek corporate presentation decks.',
        tools: ['Adobe Illustrator', 'Photoshop', 'Figma'],
        deliverables: ['Primary & Secondary Logos', 'Business Card Suites', 'Letterheads & Stationery', 'Comprehensive Brand Manual'],
        results: 'Increased client brand perception score by 45% and unified company touchpoints across 3 international offices.',
      },
      createdAt: '2025-04-10T10:00:00.000Z',
      updatedAt: '2025-04-12T14:30:00.000Z',
    },
    'portfolio-website': {
      id: 'portfolio-website',
      title: 'Portfolio Website',
      category: 'Web Development',
      shortDescription: 'A clean and modern portfolio website to showcase my work and skills.',
      detailedDescription: 'Built a high-performance, responsive portfolio website featuring a sunny cream aesthetic, smooth transitions, interactive modals, and optimized mobile layouts.',
      techStack: ['React', 'Tailwind CSS', 'TypeScript', 'Responsive Design'],
      tags: ['React', 'Tailwind CSS', 'TypeScript', 'Responsive Design'],
      status: 'Live',
      liveUrl: 'https://noor-portfolio.dev',
      githubUrl: 'https://github.com/noor/portfolio-website',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=900&auto=format&fit=crop',
      storagePath: 'projects/portfolio-website.png',
      client: 'Personal & Creative Studio',
      year: '2025',
      fullDetails: {
        overview: 'Built a high-performance, responsive portfolio website featuring a sunny cream aesthetic, smooth transitions, interactive modals, and optimized mobile layouts.',
        tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        deliverables: ['Custom Web Application', 'Interactive Project Showcase', 'Contact Modal with Direct Actions', 'Full Dark/Light Theme Support'],
        results: 'Achieved 100/100 Lighthouse performance score with sub-second page loads and zero layout shift.',
      },
      createdAt: '2025-04-05T08:00:00.000Z',
      updatedAt: '2025-04-11T16:00:00.000Z',
    },
    'social-media-design': {
      id: 'social-media-design',
      title: 'Social Media Design',
      category: 'UI/UX Design',
      shortDescription: 'Creative posts for brands, events and social media platforms.',
      detailedDescription: 'Created a modular social media design kit for Instagram, LinkedIn, and Twitter with cohesive yellow-accented layouts, carousel templates, and high-conversion story graphics.',
      techStack: ['UI/UX', 'Social Media', 'Content Creation', 'Motion Graphics'],
      tags: ['UI/UX', 'Social Media', 'Content Creation', 'Motion Graphics'],
      status: 'Live',
      liveUrl: 'https://behance.net',
      githubUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=900&auto=format&fit=crop',
      storagePath: 'projects/social-design.jpg',
      client: 'Pulse Marketing Agency',
      year: '2024',
      fullDetails: {
        overview: 'Created a modular social media design kit for Instagram, LinkedIn, and Twitter with cohesive yellow-accented layouts, carousel templates, and high-conversion story graphics.',
        tools: ['Figma', 'Photoshop', 'After Effects'],
        deliverables: ['30+ Modular Post Templates', 'Story Highlight Covers', 'Animated Launch Teasers', 'Design System Guidelines'],
        results: 'Boosted client engagement by 68% and doubled weekly follower growth within the first month of rollout.',
      },
      createdAt: '2025-03-28T12:00:00.000Z',
      updatedAt: '2025-04-09T11:20:00.000Z',
    },
    'ecommerce-redesign': {
      id: 'ecommerce-redesign',
      title: 'Luxe Minimalist Store',
      category: 'Web Development',
      shortDescription: 'Clean e-commerce interface with rapid checkout and micro-interactions.',
      detailedDescription: 'Designed and developed a minimalist lifestyle storefront focused on conversion optimization and frictionless mobile shopping.',
      techStack: ['React', 'Tailwind CSS', 'Next.js', 'E-commerce'],
      tags: ['React', 'Tailwind CSS', 'Next.js', 'E-commerce'],
      status: 'Live',
      liveUrl: 'https://luxe-store.example.com',
      githubUrl: 'https://github.com/noor/luxe-store',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
      storagePath: 'projects/ecommerce.jpg',
      client: 'Aura Lifestyle',
      year: '2024',
      fullDetails: {
        overview: 'Designed and developed a minimalist lifestyle storefront focused on conversion optimization and frictionless mobile shopping.',
        tools: ['React', 'Tailwind CSS', 'Figma'],
        deliverables: ['Storefront UI', 'Product Detail Screens', 'Streamlined Cart Flow'],
        results: 'Reduced cart abandonment rate by 22%.',
      },
      createdAt: '2025-03-15T09:00:00.000Z',
      updatedAt: '2025-04-08T10:00:00.000Z',
    },
    'fintech-dashboard': {
      id: 'fintech-dashboard',
      title: 'Nova Financial Suite',
      category: 'UI/UX Design',
      shortDescription: 'Intuitive analytics and portfolio tracking dashboard for digital assets.',
      detailedDescription: 'Created a comprehensive financial dashboard with clear data visualizations, dark-mode-first aesthetic, and rapid transaction workflows.',
      techStack: ['Dashboard', 'Fintech', 'Design System', 'Data Viz'],
      tags: ['Dashboard', 'Fintech', 'Design System', 'Data Viz'],
      status: 'Live',
      liveUrl: 'https://nova-suite.example.com',
      githubUrl: 'https://github.com/noor/nova-dashboard',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop',
      storagePath: 'projects/fintech.jpg',
      client: 'Nova Protocol',
      year: '2024',
      fullDetails: {
        overview: 'Created a comprehensive financial dashboard with clear data visualizations, dark-mode-first aesthetic, and rapid transaction workflows.',
        tools: ['Figma', 'Tokens Studio'],
        deliverables: ['Full Design System', '40+ Screen Flows', 'Interactive Prototype'],
        results: 'Successfully raised $2.5M Seed round backed by prototype demonstrations.',
      },
      createdAt: '2025-03-01T15:00:00.000Z',
      updatedAt: '2025-04-07T12:00:00.000Z',
    },
    'artisan-coffee-brand': {
      id: 'artisan-coffee-brand',
      title: 'Roast & Revel Identity',
      category: 'Branding',
      shortDescription: 'Artisanal coffee packaging, typography, and branded merchandise.',
      detailedDescription: 'Full package identity for specialty single-origin coffee beans, including custom hand-drawn motifs, compostable bag designs, and cafe collateral.',
      techStack: ['Packaging', 'Illustration', 'Print', 'Brand Strategy'],
      tags: ['Packaging', 'Illustration', 'Print', 'Brand Strategy'],
      status: 'Live',
      liveUrl: 'https://roastrevel.example.com',
      githubUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=900&auto=format&fit=crop',
      storagePath: 'projects/coffee-brand.jpg',
      client: 'Roast & Revel Roasters',
      year: '2023',
      fullDetails: {
        overview: 'Full package identity for specialty single-origin coffee beans, including custom hand-drawn motifs, compostable bag designs, and cafe collateral.',
        tools: ['Illustrator', 'Procreate', 'InDesign'],
        deliverables: ['Coffee Bag Packaging', 'Cup Sleeves & Menus', 'Merchandise Line'],
        results: 'Sold out initial batch of 5,000 bags in the first 48 hours of launch.',
      },
      createdAt: '2025-02-20T11:00:00.000Z',
      updatedAt: '2025-04-06T18:00:00.000Z',
    },
  },
  profile: {
    main: {
      fullName: 'Noor',
      title: 'Graphic Designer & Website Builder',
      bio: 'I create clean, modern and impactful designs, and build responsive websites that help brands grow and make a lasting impression.',
      about: "I'm Noor, a passionate creative designer and website builder. I love turning ideas into beautiful designs and functional websites that solve real problems and create value.",
      email: 'skmahammadnurhosen1@gmail.com',
      phone: '+91 91448 19540',
      location: 'Gangulidanga, Katwa, Purba Bardhaman, WB, 713150',
      avatarUrl: '/file_00000000704c8230a66055ead8603089.png',
      avatarStoragePath: 'profile/avatar-main.png',
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        behance: 'https://behance.net',
        dribbble: 'https://dribbble.com',
      },
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Firebase', 'Figma', 'Photoshop', 'Illustrator', 'CorelDRAW'],
      services: [
        { id: 'graphic-design', title: 'Graphic Design', description: 'Logos, social media posts, branding, print & digital design.', iconName: 'design' },
        { id: 'web-development', title: 'Web Development', description: 'Modern, responsive and fast websites using modern technologies.', iconName: 'code' },
        { id: 'creative-solutions', title: 'Creative Solutions', description: 'Clean design, smooth user experience and results that matter.', iconName: 'sparkle' },
      ],
      resumeUrl: '/uploads/cv/Noor_Resume_CV.pdf',
      cvFileName: 'Noor_Resume_CV.pdf',
      cvStoragePath: 'cv/Noor_Resume_CV.pdf',
      cvFileSize: 1420,
      cvUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  messages: {} as Record<string, any>,
};

// Local JSON Store Manager
function readLocalStore(): typeof DEFAULT_STORE {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local db file, falling back to default:', err);
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8');
  return JSON.parse(JSON.stringify(DEFAULT_STORE));
}

function writeLocalStore(store: typeof DEFAULT_STORE) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local db file:', err);
  }
}

// Initial synchronization between Firestore and persistent storage
async function initializeFirestoreSync() {
  if (!isRealFirebase || !firestoreAvailable) return;
  try {
    const fsDb = getFirestore();

    // Ensure root admin document exists in Firestore
    const adminDoc = await fsDb.doc('admins/root_admin').get();
    if (!adminDoc.exists) {
      const store = readLocalStore();
      await fsDb.doc('admins/root_admin').set(sanitizeForFirestore(store.admins.root_admin));
    }

    // Ensure profile document exists in Firestore
    const profileDoc = await fsDb.doc('profile/main').get();
    if (!profileDoc.exists) {
      const store = readLocalStore();
      await fsDb.doc('profile/main').set(sanitizeForFirestore(store.profile.main));
    }

    // Check if projects collection has ever been initialized
    const metaDoc = await fsDb.doc('metadata/projects_state').get();
    if (!metaDoc.exists) {
      const store = readLocalStore();
      const existingSnap = await fsDb.collection('projects').get();
      if (existingSnap.docs.length === 0) {
        const batch = fsDb.batch();
        for (const [pId, pData] of Object.entries(store.projects)) {
          const ref = fsDb.collection('projects').doc(pId);
          batch.set(ref, sanitizeForFirestore(pData));
        }
        batch.set(fsDb.doc('metadata/projects_state'), { initialized: true, seededAt: new Date().toISOString() });
        await batch.commit();
        console.log('[Firebase] Seeded Firestore projects collection with portfolio items.');
      } else {
        await fsDb.doc('metadata/projects_state').set({ initialized: true, syncedAt: new Date().toISOString() });
      }
    }
  } catch (err: any) {
    console.error('[Firebase] Error during initializeFirestoreSync:', err?.message || err);
  }
}

// Unified Firestore DB Interface that uses real Firebase Admin if configured,
// or seamless local JSON adapter otherwise
export const db = {
  isLiveFirebase: () => isRealFirebase && firestoreAvailable,

  async getAdmin() {
    if (isRealFirebase && firestoreAvailable) {
      try {
        const docSnap = await getFirestore().doc('admins/root_admin').get();
        if (docSnap.exists) {
          return docSnap.data();
        }
      } catch (err: any) {
        console.warn('[Firebase] getAdmin error:', err?.message || err);
      }
    }
    const store = readLocalStore();
    return store.admins.root_admin || null;
  },

  async updateAdmin(data: Partial<typeof DEFAULT_STORE['admins']['root_admin']>) {
    const store = readLocalStore();
    store.admins.root_admin = {
      ...store.admins.root_admin,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeLocalStore(store);

    if (isRealFirebase && firestoreAvailable) {
      try {
        await getFirestore().doc('admins/root_admin').set(
          sanitizeForFirestore({ ...data, updatedAt: new Date().toISOString() }),
          { merge: true }
        );
      } catch (err: any) {
        console.warn('[Firebase] updateAdmin error:', err?.message || err);
      }
    }
  },

  async getAllProjects() {
    if (isRealFirebase && firestoreAvailable) {
      try {
        const snap = await getFirestore().collection('projects').get();
        const metaDoc = await getFirestore().doc('metadata/projects_state').get();

        // If collection has never been initialized and is completely empty, seed it once
        if (!metaDoc.exists && snap.docs.length === 0) {
          await initializeFirestoreSync();
          const refreshedSnap = await getFirestore().collection('projects').get();
          const list = refreshedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          return list.sort((a: any, b: any) => {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          });
        }

        // Return the exact items in Firestore (even if empty, representing deleted state)
        const firestoreList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Two-way sync: keep localStore mirrored to Firestore projects
        const store = readLocalStore();
        const mirroredProjects: Record<string, any> = {};
        for (const p of firestoreList) {
          mirroredProjects[(p as any).id] = p;
        }
        store.projects = mirroredProjects as any;
        writeLocalStore(store);

        return firestoreList.sort((a: any, b: any) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
      } catch (err: any) {
        console.warn('[Firebase] getAllProjects error, using local cache:', err?.message || err);
      }
    }

    const store = readLocalStore();
    return Object.values(store.projects).sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  },

  async getProject(id: string) {
    if (isRealFirebase && firestoreAvailable) {
      try {
        const doc = await getFirestore().collection('projects').doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
        // If it does not exist in Firestore, do NOT return stale local copy
        return null;
      } catch (err: any) {
        console.warn('[Firebase] getProject error:', err?.message || err);
      }
    }
    const store = readLocalStore();
    return store.projects[id as keyof typeof store.projects] || null;
  },

  async createProject(data: any) {
    const id = data.id || `proj-${Date.now()}`;
    const projectRecord = sanitizeForFirestore({
      ...data,
      id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const store = readLocalStore();
    (store.projects as any)[id] = projectRecord;
    writeLocalStore(store);

    if (isRealFirebase && firestoreAvailable) {
      try {
        const fsDb = getFirestore();
        await fsDb.collection('projects').doc(id).set(projectRecord);
        await fsDb.doc('metadata/projects_state').set({ initialized: true, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err: any) {
        console.error('[Firebase] createProject error:', err?.message || err);
      }
    }
    return projectRecord;
  },

  async updateProject(id: string, data: any) {
    const updatedData = sanitizeForFirestore({
      ...data,
      updatedAt: new Date().toISOString(),
    });

    const store = readLocalStore();
    if (store.projects[id as keyof typeof store.projects]) {
      (store.projects as any)[id] = {
        ...(store.projects as any)[id],
        ...updatedData,
      };
      writeLocalStore(store);
    }

    if (isRealFirebase && firestoreAvailable) {
      try {
        const fsDb = getFirestore();
        await fsDb.collection('projects').doc(id).set(updatedData, { merge: true });
        const updated = await fsDb.collection('projects').doc(id).get();
        if (updated.exists) {
          const result = { id: updated.id, ...updated.data() };
          (store.projects as any)[id] = result;
          writeLocalStore(store);
          return result;
        }
      } catch (err: any) {
        console.error('[Firebase] updateProject error:', err?.message || err);
      }
    }
    return (store.projects as any)[id] || null;
  },

  async deleteProject(id: string) {
    let deleted = false;
    const store = readLocalStore();
    if ((store.projects as any)[id]) {
      delete (store.projects as any)[id];
      writeLocalStore(store);
      deleted = true;
    }

    if (isRealFirebase && firestoreAvailable) {
      try {
        const fsDb = getFirestore();
        await fsDb.collection('projects').doc(id).delete();
        await fsDb.doc('metadata/projects_state').set({ initialized: true, updatedAt: new Date().toISOString() }, { merge: true });
        deleted = true;
      } catch (err: any) {
        console.error('[Firebase] deleteProject error:', err?.message || err);
      }
    }
    return deleted;
  },

  async getProfile() {
    if (isRealFirebase && firestoreAvailable) {
      try {
        const doc = await getFirestore().doc('profile/main').get();
        if (doc.exists) {
          return doc.data();
        }
      } catch {
        firestoreAvailable = false;
      }
    }
    const store = readLocalStore();
    return store.profile.main || null;
  },

  async updateProfile(data: any) {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const store = readLocalStore();
    store.profile.main = {
      ...store.profile.main,
      ...updatedData,
    };
    writeLocalStore(store);

    if (isRealFirebase && firestoreAvailable) {
      try {
        await getFirestore().doc('profile/main').set(updatedData, { merge: true });
        const updated = await getFirestore().doc('profile/main').get();
        return updated.data();
      } catch {
        firestoreAvailable = false;
      }
    }
    return store.profile.main;
  },

  async getAllMessages() {
    if (isRealFirebase && firestoreAvailable) {
      try {
        const snap = await getFirestore().collection('messages').orderBy('createdAt', 'desc').get();
        if (snap.docs.length > 0) {
          return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
      } catch {
        firestoreAvailable = false;
      }
    }
    const store = readLocalStore();
    if (!store.messages) store.messages = {};
    return Object.values(store.messages).sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  },

  async createMessage(data: any) {
    const id = `msg-${Date.now()}`;
    const messageRecord = {
      ...data,
      id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const store = readLocalStore();
    if (!store.messages) store.messages = {};
    (store.messages as any)[id] = messageRecord;
    writeLocalStore(store);

    if (isRealFirebase && firestoreAvailable) {
      try {
        await getFirestore().collection('messages').doc(id).set(messageRecord);
      } catch {
        firestoreAvailable = false;
      }
    }
    return messageRecord;
  },

  async deleteMessage(id: string) {
    const store = readLocalStore();
    if (store.messages && (store.messages as any)[id]) {
      delete (store.messages as any)[id];
      writeLocalStore(store);
    }
    if (isRealFirebase && firestoreAvailable) {
      try {
        await getFirestore().collection('messages').doc(id).delete();
      } catch {
        firestoreAvailable = false;
      }
    }
    return true;
  },
};

// Storage file upload & deletion service
export const storage = {
  async uploadFile(file: Express.Multer.File, folder: string): Promise<{ publicUrl: string; storagePath: string }> {
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const storagePath = `${folder}/${filename}`;

    if (isRealFirebase && storageAvailable && bucketInstance) {
      try {
        const fileRef = bucketInstance.file(storagePath);
        await fileRef.save(file.buffer, {
          contentType: file.mimetype,
          resumable: false,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        });

        // Try making public or get signed URL
        try {
          await fileRef.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucketInstance.name}/${storagePath}`;
          return { publicUrl, storagePath };
        } catch {
          const [signedUrl] = await fileRef.getSignedUrl({
            action: 'read',
            expires: '03-17-2035',
          });
          return { publicUrl: signedUrl, storagePath };
        }
      } catch {
        // Fall back to local file storage if cloud bucket rejects
      }
    }

    // Local storage fallback: write directly to public/uploads/
    const targetFolder = path.join(UPLOADS_DIR, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const localFilePath = path.join(targetFolder, filename);
    fs.writeFileSync(localFilePath, file.buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;
    return { publicUrl, storagePath };
  },

  async deleteFile(storagePath?: string) {
    if (!storagePath) return;

    if (isRealFirebase && storageAvailable && bucketInstance) {
      try {
        const fileRef = bucketInstance.file(storagePath);
        const [exists] = await fileRef.exists();
        if (exists) {
          await fileRef.delete();
          console.log(`[Firebase Storage] Deleted old file: ${storagePath}`);
        }
        return;
      } catch {
        // Fall back to local check
      }
    }

    // Local file deletion
    try {
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', storagePath);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`[Local Storage] Deleted file: ${localFilePath}`);
      }
    } catch {
      // Clean silent catch
    }
  },
};
