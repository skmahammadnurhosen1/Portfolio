import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/authRoutes';
import projectRoutes from './server/routes/projectRoutes';
import profileRoutes from './server/routes/profileRoutes';
import statsRoutes from './server/routes/statsRoutes';
import contactRoutes from './server/routes/contactRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Static uploads directory serving
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));
  // Ensure missing files in /uploads return 404 instead of falling back to SPA index.html
  app.use('/uploads', (req, res) => {
    res.status(404).json({ error: 'Uploaded file not found' });
  });

  // Disable aggressive browser caching for all /api endpoints to ensure real-time consistency
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'noor-portfolio-admin-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/contact', contactRoutes);

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Admin Backend & Portfolio running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
