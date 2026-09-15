import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';
import {
  generateAdminToken,
  authMiddleware,
  AUTH_COOKIE_NAME,
  checkLoginRateLimit,
  recordLoginFailure,
  resetLoginFailures,
} from '../auth';

const router = Router();

// POST /api/auth/login
// Strict Rate Limiting + Blind Generic Error Responses
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

  // 1. Check Rate Limit
  const rateLimitStatus = checkLoginRateLimit(clientIp);
  if (!rateLimitStatus.allowed) {
    res.status(429).json({
      error: `Too many failed attempts. Access blocked. Please try again in ${rateLimitStatus.remainingSeconds} seconds.`,
    });
    return;
  }

  const { email, password } = req.body;

  // Basic validation without disclosing detailed hints
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    recordLoginFailure(clientIp);
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  try {
    // 2. Fetch root admin singleton from Firestore or local store
    const rootAdmin = await db.getAdmin();

    const normalizedEmail = email.trim().toLowerCase();
    const primaryAdminEmail = 'skmahammadnurhosen1@gmail.com';
    const currentAdminEmail = (rootAdmin?.email || primaryAdminEmail).trim().toLowerCase();

    // Only allow the authorized admin account
    const emailMatches =
      normalizedEmail === currentAdminEmail ||
      normalizedEmail === primaryAdminEmail ||
      normalizedEmail === 'skmahammadnurhosen1';

    // Verify password against database bcrypt hash or valid literal
    let passwordMatches = false;
    if (emailMatches && rootAdmin?.passwordHash) {
      passwordMatches = await bcrypt.compare(password, rootAdmin.passwordHash);
      if (!passwordMatches) {
        // Also support literal with or without parentheses
        if (password === 'NOOR-NORA-SK-2007' || password === '(NOOR-NORA-SK-2007)') {
          passwordMatches = true;
        }
      }
    } else {
      // Decoy timing check to prevent user enumeration
      await bcrypt.compare(password, '$2b$12$abcdefghijklmnopqrstuvw123456789012345678901234567890');
    }

    if (!emailMatches || !passwordMatches) {
      recordLoginFailure(clientIp);
      // STRICT SECURITY: Zero credential leakage, strictly generic error
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // 4. Success! Reset failure counter
    resetLoginFailures(clientIp);

    // 5. Generate cryptographically unique activeSessionId (UUID)
    const newSessionId = uuidv4();
    const effectiveEmail = primaryAdminEmail;

    // 6. Enforce active session ID in database
    const adminUpdates: any = {
      email: effectiveEmail,
      activeSessionId: newSessionId,
    };
    // Ensure default salted bcrypt hash exists if no hash is currently present
    if (!rootAdmin?.passwordHash) {
      adminUpdates.passwordHash = await bcrypt.hash('NOOR-NORA-SK-2007', 12);
    }
    await db.updateAdmin(adminUpdates);

    // 7. Embed activeSessionId into signed JWT
    const token = generateAdminToken(effectiveEmail, newSessionId);

    // 8. Set HttpOnly cookie with cross-site iframe compatibility
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json({
      success: true,
      token,
      email: effectiveEmail,
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal authentication service error' });
  }
});

// GET /api/auth/me
// Returns current authenticated session status
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const admin = (req as any).admin;
  res.json({
    authenticated: true,
    email: admin.email,
    sessionId: admin.sessionId,
    isRealFirebase: db.isLiveFirebase(),
  });
});

// POST /api/auth/logout
// Explicitly invalidates the session in Firestore and clears cookie
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const rootAdmin = await db.getAdmin();
    if (rootAdmin) {
      // Invalidate activeSessionId so no lingering token can be used
      await db.updateAdmin({ activeSessionId: null });
    }
  } catch (err) {
    console.warn('Error during logout session cleanup:', err);
  }

  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// PUT /api/auth/credentials
// Update root admin email and password securely
router.put('/credentials', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newEmail, newPassword } = req.body;

  if (!currentPassword) {
    res.status(400).json({ error: 'Current password is required to make security updates' });
    return;
  }

  try {
    const rootAdmin = await db.getAdmin();
    if (!rootAdmin) {
      res.status(404).json({ error: 'Admin record not found' });
      return;
    }

    const matches = await bcrypt.compare(currentPassword, rootAdmin.passwordHash);
    if (!matches) {
      res.status(401).json({ error: 'Current password verification failed' });
      return;
    }

    const updates: any = {};
    if (newEmail && typeof newEmail === 'string' && newEmail.includes('@')) {
      updates.email = newEmail.trim().toLowerCase();
    }

    if (newPassword && typeof newPassword === 'string' && newPassword.length >= 8) {
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Refresh active session
    const newSessionId = uuidv4();
    updates.activeSessionId = newSessionId;

    await db.updateAdmin(updates);

    // Refresh token with new session ID
    const token = generateAdminToken(updates.email || rootAdmin.email, newSessionId);
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({ success: true, message: 'Admin security credentials updated successfully' });
  } catch (error) {
    console.error('Update credentials error:', error);
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

export default router;
