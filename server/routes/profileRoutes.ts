import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, storage } from '../firebase';
import { authMiddleware } from '../auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are permitted'));
    }
  },
});

// Dedicated Multer uploader for CV PDF documents (max 20MB)
const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files (.pdf) are allowed for CV upload'));
    }
  },
});

const safeCvUpload = (req: Request, res: Response, next: any) => {
  cvUpload.single('cv')(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Invalid PDF file upload' });
    }
    next();
  });
};

interface ResolvedCv {
  type: 'local' | 'remote';
  filePath?: string;
  url?: string;
  fileName: string;
  fileSize?: number;
}

function resolveCv(profile: any): ResolvedCv | null {
  const defaultPdfPath = path.join(process.cwd(), 'public', 'uploads', 'cv', 'Noor_Resume_CV.pdf');
  const cvUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cv');

  let cvUrl = profile?.resumeUrl;
  let customFileName = profile?.cvFileName;

  // 1. Check if profile specifies a local upload path that exists
  if (cvUrl && typeof cvUrl === 'string' && cvUrl.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', cvUrl);
    if (fs.existsSync(localPath)) {
      const stats = fs.statSync(localPath);
      return {
        type: 'local',
        filePath: localPath,
        fileName: customFileName || path.basename(localPath),
        fileSize: stats.size,
      };
    }
  }

  // 2. Check if profile specifies an external URL
  if (cvUrl && typeof cvUrl === 'string' && (cvUrl.startsWith('http://') || cvUrl.startsWith('https://'))) {
    return {
      type: 'remote',
      url: cvUrl,
      fileName: customFileName || 'Noor_CV.pdf',
    };
  }

  // 3. Fallback: check if default Noor_Resume_CV.pdf exists
  if (fs.existsSync(defaultPdfPath)) {
    const stats = fs.statSync(defaultPdfPath);
    return {
      type: 'local',
      filePath: defaultPdfPath,
      fileName: customFileName || 'Noor_Resume_CV.pdf',
      fileSize: stats.size,
    };
  }

  // 4. Fallback: scan cvUploadsDir for any .pdf file
  if (fs.existsSync(cvUploadsDir)) {
    try {
      const allFiles = fs.readdirSync(cvUploadsDir);
      const anyPdf = allFiles.find((f) => f.toLowerCase().endsWith('.pdf'));
      if (anyPdf) {
        const foundPath = path.join(cvUploadsDir, anyPdf);
        const stats = fs.statSync(foundPath);
        return {
          type: 'local',
          filePath: foundPath,
          fileName: customFileName || anyPdf,
          fileSize: stats.size,
        };
      }
    } catch (_) {}
  }

  return null;
}

// GET /api/profile - Retrieve profile details (Public / Admin)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const profile: any = await db.getProfile();
    const resolved = resolveCv(profile);

    if (resolved && (!profile?.resumeUrl || profile?.resumeUrl === '#' || profile?.resumeUrl === '' || (profile?.resumeUrl?.startsWith('/uploads/') && !fs.existsSync(path.join(process.cwd(), 'public', profile.resumeUrl))))) {
      if (resolved.type === 'local' && resolved.filePath) {
        const relativeUrl = resolved.filePath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');
        profile.resumeUrl = relativeUrl;
        profile.cvFileName = resolved.fileName;
        profile.cvFileSize = resolved.fileSize;
        profile.cvUpdatedAt = profile.cvUpdatedAt || new Date().toISOString();
      } else if (resolved.type === 'remote') {
        profile.resumeUrl = resolved.url;
        profile.cvFileName = resolved.fileName;
      }
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - Update personal details (Protected)
router.put('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      title,
      bio,
      about,
      email,
      phone,
      location,
      socialLinks,
      skills,
      services,
      resumeUrl,
    } = req.body;

    const payload: any = {};
    if (fullName !== undefined) payload.fullName = fullName;
    if (title !== undefined) payload.title = title;
    if (bio !== undefined) payload.bio = bio;
    if (about !== undefined) payload.about = about;
    if (email !== undefined) payload.email = email;
    if (phone !== undefined) payload.phone = phone;
    if (location !== undefined) payload.location = location;
    if (socialLinks !== undefined) payload.socialLinks = socialLinks;
    if (skills !== undefined) payload.skills = skills;
    if (services !== undefined) payload.services = services;
    if (resumeUrl !== undefined) payload.resumeUrl = resumeUrl;

    const updated = await db.updateProfile(payload);
    res.json(updated);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update personal details' });
  }
});

// POST /api/profile/avatar - Direct Gallery Upload for Avatar with Auto-Delete of Old File
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No avatar image file provided' });
      return;
    }

    const currentProfile = await db.getProfile();

    // 1. Upload new avatar image
    const { publicUrl, storagePath } = await storage.uploadFile(req.file, 'avatars');

    // 2. Auto-delete old avatar from Firebase Storage if it existed
    if (currentProfile && currentProfile.avatarStoragePath) {
      await storage.deleteFile(currentProfile.avatarStoragePath);
    }

    // 3. Update profile record
    const updated = await db.updateProfile({
      avatarUrl: publicUrl,
      avatarStoragePath: storagePath,
    });

    res.json({
      success: true,
      avatarUrl: publicUrl,
      profile: updated,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload profile avatar' });
  }
});

// POST /api/profile/cv - Upload PDF CV with Auto-Delete of Old File
router.post('/cv', authMiddleware, safeCvUpload, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No PDF file was provided' });
      return;
    }

    const currentProfile: any = await db.getProfile();

    // 1. Upload new CV PDF to Firebase Storage or local uploads directory
    const { publicUrl, storagePath } = await storage.uploadFile(req.file, 'cv');

    // 2. Auto-delete old CV file if one exists
    if (currentProfile && currentProfile.cvStoragePath) {
      await storage.deleteFile(currentProfile.cvStoragePath);
    }

    // 3. Update profile record
    const updated = await db.updateProfile({
      resumeUrl: publicUrl,
      cvFileName: req.file.originalname,
      cvStoragePath: storagePath,
      cvFileSize: req.file.size,
      cvUpdatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      resumeUrl: publicUrl,
      cvFileName: req.file.originalname,
      profile: updated,
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ error: 'Failed to upload CV document' });
  }
});

// DELETE /api/profile/cv - Remove Current CV
router.delete('/cv', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const currentProfile: any = await db.getProfile();
    if (currentProfile && currentProfile.cvStoragePath) {
      await storage.deleteFile(currentProfile.cvStoragePath);
    }

    const updated = await db.updateProfile({
      resumeUrl: '',
      cvFileName: '',
      cvStoragePath: '',
      cvFileSize: 0,
      cvUpdatedAt: '',
    });

    res.json({
      success: true,
      message: 'CV removed successfully',
      profile: updated,
    });
  } catch (error) {
    console.error('Error removing CV:', error);
    res.status(500).json({ error: 'Failed to remove CV' });
  }
});

// GET /api/profile/cv/download - Download CV with Proper Filename Headers
router.get('/cv/download', async (req: Request, res: Response): Promise<void> => {
  try {
    const profile: any = await db.getProfile();
    const resolved = resolveCv(profile);

    if (!resolved) {
      res.status(404).json({ error: 'CV has not been uploaded yet' });
      return;
    }

    if (resolved.type === 'local' && resolved.filePath) {
      res.download(resolved.filePath, resolved.fileName);
      return;
    }

    if (resolved.type === 'remote' && resolved.url) {
      res.setHeader('Content-Disposition', `attachment; filename="${resolved.fileName}"`);
      res.redirect(resolved.url);
      return;
    }

    res.status(404).json({ error: 'CV file not found' });
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ error: 'Failed to download CV' });
  }
});

// GET /api/profile/cv/view - Inline View for In-Browser PDF Preview
router.get('/cv/view', async (req: Request, res: Response): Promise<void> => {
  try {
    const profile: any = await db.getProfile();
    const resolved = resolveCv(profile);

    if (!resolved) {
      res.status(404).json({ error: 'CV has not been uploaded yet' });
      return;
    }

    if (resolved.type === 'local' && resolved.filePath) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${resolved.fileName}"`);
      res.sendFile(resolved.filePath);
      return;
    }

    if (resolved.type === 'remote' && resolved.url) {
      res.redirect(resolved.url);
      return;
    }

    res.status(404).json({ error: 'CV file not found' });
  } catch (error) {
    console.error('Error viewing CV:', error);
    res.status(500).json({ error: 'Failed to view CV' });
  }
});

// GET /api/profile/cv/data - JSON Base64 Endpoint to Bypass Cookie Checks & Navigation Blocks
router.get('/cv/data', async (req: Request, res: Response): Promise<void> => {
  try {
    const profile: any = await db.getProfile();
    const resolved = resolveCv(profile);

    if (!resolved) {
      res.status(404).json({ error: 'CV has not been uploaded yet' });
      return;
    }

    if (resolved.type === 'local' && resolved.filePath) {
      const buffer = fs.readFileSync(resolved.filePath);
      res.json({
        success: true,
        fileName: resolved.fileName,
        fileSize: resolved.fileSize || buffer.length,
        mimeType: 'application/pdf',
        base64: buffer.toString('base64'),
      });
      return;
    }

    if (resolved.type === 'remote' && resolved.url) {
      res.json({
        success: true,
        fileName: resolved.fileName,
        mimeType: 'application/pdf',
        remoteUrl: resolved.url,
      });
      return;
    }

    res.status(404).json({ error: 'CV file not found' });
  } catch (error) {
    console.error('Error fetching CV data:', error);
    res.status(500).json({ error: 'Failed to fetch CV data' });
  }
});

export default router;
