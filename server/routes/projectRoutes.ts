import { Router, Request, Response } from 'express';
import multer from 'multer';
import { db, storage } from '../firebase';
import { authMiddleware } from '../auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max image size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are permitted'));
    }
  },
});

// Helper to normalize project representation for both Public Site and Admin Panel
function normalizeProject(p: any) {
  if (!p) return null;
  const tech = Array.isArray(p.techStack)
    ? p.techStack
    : Array.isArray(p.tags)
    ? p.tags
    : typeof p.techStack === 'string'
    ? p.techStack.split(',').map((t: string) => t.trim()).filter(Boolean)
    : ['Design', 'Development'];

  const img = p.imageUrl || p.image || '/file_00000000704c8230a66055ead8603089.png';
  const desc = p.shortDescription || p.description || '';
  const detailedDesc = p.detailedDescription || desc;

  // Detect project type if not explicitly set
  const detectedType = p.projectType || (
    p.category === 'Branding' ||
    p.category === 'Graphics Design' ||
    p.category === 'UI/UX Design' ||
    p.category === 'Logo Design' ||
    p.category === 'Graphic Design'
      ? 'graphics'
      : 'website'
  );

  const designTools = Array.isArray(p.designTools)
    ? p.designTools
    : typeof p.designTools === 'string'
    ? p.designTools.split(',').map((t: string) => t.trim()).filter(Boolean)
    : (detectedType === 'graphics' ? tech : []);

  const deliverables = Array.isArray(p.deliverables)
    ? p.deliverables
    : typeof p.deliverables === 'string'
    ? p.deliverables.split(',').map((t: string) => t.trim()).filter(Boolean)
    : p.fullDetails?.deliverables || (detectedType === 'graphics' ? ['Vector Source Files (AI/EPS)', 'High-Res PNG/JPEG', 'Print-Ready Assets'] : ['Production Web App', 'Responsive Design']);

  return {
    id: p.id,
    title: p.title || 'Untitled Project',
    projectType: detectedType,
    category: p.category || (detectedType === 'graphics' ? 'Graphics Design' : 'Web Development'),
    designSubtype: p.designSubtype || (detectedType === 'graphics' ? p.category : ''),
    description: desc,
    shortDescription: desc,
    detailedDescription: detailedDesc,
    image: img,
    imageUrl: img,
    storagePath: p.storagePath || '',
    client: p.client || 'Client & Studio',
    year: p.year || '2025',
    tags: tech,
    techStack: tech,
    designTools,
    deliverables,
    status: p.status || 'Live',
    liveUrl: p.liveUrl || '',
    githubUrl: p.githubUrl || '',
    fullDetails: p.fullDetails || {
      overview: detailedDesc,
      tools: detectedType === 'graphics' ? (designTools.length > 0 ? designTools : ['Photoshop', 'Illustrator', 'Figma']) : tech,
      deliverables,
      results: detectedType === 'graphics'
        ? 'Distinct visual aesthetic and brand asset creation delivered on target.'
        : 'High client satisfaction and modern web performance benchmarks.',
    },
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}

// GET /api/projects - Public / Admin list
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await db.getAllProjects();
    const normalized = (projects || []).map(normalizeProject);
    res.json(normalized);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Single project
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(normalizeProject(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create Project with Direct Gallery Upload
router.post('/', authMiddleware, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      shortDescription,
      detailedDescription,
      category,
      projectType,
      designSubtype,
      status,
      liveUrl,
      githubUrl,
      client,
      year,
    } = req.body;
    let techStack: string[] = [];
    let designTools: string[] = [];
    let deliverables: string[] = [];

    // Parse techStack
    if (req.body.techStack || req.body.tags) {
      const rawTech = req.body.techStack || req.body.tags;
      if (Array.isArray(rawTech)) {
        techStack = rawTech;
      } else if (typeof rawTech === 'string') {
        try {
          techStack = JSON.parse(rawTech);
        } catch {
          techStack = rawTech.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
    }

    // Parse designTools
    if (req.body.designTools) {
      const rawTools = req.body.designTools;
      if (Array.isArray(rawTools)) {
        designTools = rawTools;
      } else if (typeof rawTools === 'string') {
        try {
          designTools = JSON.parse(rawTools);
        } catch {
          designTools = rawTools.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
    }

    // Parse deliverables
    if (req.body.deliverables) {
      const rawDel = req.body.deliverables;
      if (Array.isArray(rawDel)) {
        deliverables = rawDel;
      } else if (typeof rawDel === 'string') {
        try {
          deliverables = JSON.parse(rawDel);
        } catch {
          deliverables = rawDel.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
    }

    if (!title || (!shortDescription && !req.body.description)) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const cleanDesc = (shortDescription || req.body.description || '').trim();
    const cleanDetailedDesc = (detailedDescription || cleanDesc).trim();

    const isGraphics = projectType === 'graphics' ||
      ['Branding', 'Graphics Design', 'UI/UX Design', 'Logo Design'].includes(category);
    const finalProjectType = isGraphics ? 'graphics' : 'website';

    let imageUrl = req.body.imageUrl || req.body.image || '/file_00000000704c8230a66055ead8603089.png';
    let storagePath = '';

    // Direct gallery file uploaded
    if (req.file) {
      const uploadResult = await storage.uploadFile(req.file, 'projects');
      imageUrl = uploadResult.publicUrl;
      storagePath = uploadResult.storagePath;
    }

    let fullDetails: any = null;
    if (req.body.fullDetails) {
      if (typeof req.body.fullDetails === 'string') {
        try {
          fullDetails = JSON.parse(req.body.fullDetails);
        } catch {
          fullDetails = null;
        }
      } else {
        fullDetails = req.body.fullDetails;
      }
    }

    if (!fullDetails) {
      fullDetails = {
        overview: cleanDetailedDesc,
        tools: isGraphics
          ? (designTools.length > 0 ? designTools : ['Adobe Photoshop', 'Adobe Illustrator'])
          : (techStack.length > 0 ? techStack : ['React', 'Tailwind CSS']),
        deliverables: deliverables.length > 0
          ? deliverables
          : (isGraphics ? ['Vector Source Files', 'High-Res Assets', 'Client Mockups'] : ['Live Production App', 'Responsive Design']),
        results: isGraphics
          ? 'Comprehensive creative direction and striking brand assets delivered to client.'
          : 'High engagement and modern web engineering performance.',
      };
    }

    const newProject = await db.createProject({
      title: title.trim(),
      projectType: finalProjectType,
      category: category || (isGraphics ? 'Graphics Design' : 'Web Development'),
      designSubtype: designSubtype || (isGraphics ? (category || 'Graphics Design') : ''),
      shortDescription: cleanDesc,
      description: cleanDesc,
      detailedDescription: cleanDetailedDesc,
      techStack: isGraphics ? (designTools.length > 0 ? designTools : techStack) : techStack,
      tags: isGraphics ? (designTools.length > 0 ? designTools : techStack) : techStack,
      designTools,
      deliverables,
      client: client || 'Client & Studio',
      year: year || new Date().getFullYear().toString(),
      status: status || 'Live',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      githubUrl: isGraphics ? '' : (githubUrl ? githubUrl.trim() : ''),
      imageUrl,
      image: imageUrl,
      storagePath,
      fullDetails,
    });

    res.status(201).json(normalizeProject(newProject));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update Project + Auto-delete replaced file
router.put('/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const existing: any = await db.getProject(id);
    if (!existing) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updatePayload: any = {};
    if (req.body.title !== undefined) updatePayload.title = req.body.title.trim();
    if (req.body.projectType !== undefined) updatePayload.projectType = req.body.projectType;
    if (req.body.category !== undefined) updatePayload.category = req.body.category;
    if (req.body.designSubtype !== undefined) updatePayload.designSubtype = req.body.designSubtype;
    if (req.body.shortDescription !== undefined || req.body.description !== undefined) {
      const val = (req.body.shortDescription || req.body.description || '').trim();
      updatePayload.shortDescription = val;
      updatePayload.description = val;
    }
    if (req.body.detailedDescription !== undefined) updatePayload.detailedDescription = req.body.detailedDescription.trim();
    if (req.body.status !== undefined) updatePayload.status = req.body.status;
    if (req.body.liveUrl !== undefined) updatePayload.liveUrl = req.body.liveUrl.trim();
    if (req.body.githubUrl !== undefined) updatePayload.githubUrl = req.body.githubUrl.trim();
    if (req.body.client !== undefined) updatePayload.client = req.body.client.trim();
    if (req.body.year !== undefined) updatePayload.year = req.body.year.trim();

    if (req.body.techStack !== undefined || req.body.tags !== undefined) {
      const raw = req.body.techStack !== undefined ? req.body.techStack : req.body.tags;
      let parsedTech: string[] = [];
      if (Array.isArray(raw)) {
        parsedTech = raw;
      } else if (typeof raw === 'string') {
        try {
          parsedTech = JSON.parse(raw);
        } catch {
          parsedTech = raw.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
      updatePayload.techStack = parsedTech;
      updatePayload.tags = parsedTech;
    }

    if (req.body.designTools !== undefined) {
      const raw = req.body.designTools;
      let parsedTools: string[] = [];
      if (Array.isArray(raw)) {
        parsedTools = raw;
      } else if (typeof raw === 'string') {
        try {
          parsedTools = JSON.parse(raw);
        } catch {
          parsedTools = raw.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
      updatePayload.designTools = parsedTools;
    }

    if (req.body.deliverables !== undefined) {
      const raw = req.body.deliverables;
      let parsedDel: string[] = [];
      if (Array.isArray(raw)) {
        parsedDel = raw;
      } else if (typeof raw === 'string') {
        try {
          parsedDel = JSON.parse(raw);
        } catch {
          parsedDel = raw.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }
      updatePayload.deliverables = parsedDel;
    }

    if (req.body.fullDetails !== undefined) {
      if (typeof req.body.fullDetails === 'string') {
        try {
          updatePayload.fullDetails = JSON.parse(req.body.fullDetails);
        } catch {
          // keep existing
        }
      } else {
        updatePayload.fullDetails = req.body.fullDetails;
      }
    }

    // Direct Gallery File Replacement
    if (req.file) {
      // 1. Upload new image
      const uploadResult = await storage.uploadFile(req.file, 'projects');
      updatePayload.imageUrl = uploadResult.publicUrl;
      updatePayload.image = uploadResult.publicUrl;
      updatePayload.storagePath = uploadResult.storagePath;

      // 2. AUTO-DELETE OLD FILE from Storage
      if (existing.storagePath) {
        await storage.deleteFile(existing.storagePath);
      }
    } else if (req.body.imageUrl && req.body.imageUrl !== existing.imageUrl) {
      updatePayload.imageUrl = req.body.imageUrl;
      updatePayload.image = req.body.imageUrl;
    }

    const updated = await db.updateProject(id, updatePayload);
    res.json(normalizeProject(updated));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project and clean up Firebase Storage
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const existing: any = await db.getProject(id);
    if (!existing) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // 1. Delete physical image file from Firebase Storage
    if (existing.storagePath) {
      await storage.deleteFile(existing.storagePath);
    }

    // 2. Delete document from Firestore collection
    await db.deleteProject(id);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
