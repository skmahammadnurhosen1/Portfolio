import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './firebase';

const JWT_SECRET = process.env.JWT_SECRET || 'noor_portfolio_jwt_secret_production_key_32bytes';
export const AUTH_COOKIE_NAME = 'noor_admin_token';

export interface AdminJwtPayload {
  email: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

// Generate JWT with embedded activeSessionId
export function generateAdminToken(email: string, sessionId: string): string {
  return jwt.sign({ email, sessionId }, JWT_SECRET, { expiresIn: '7d' });
}

// Single Active Session Verification Middleware (Concurrent Kickout)
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Check cookie first, fallback to Authorization header
    let token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: Authentication required' });
      return;
    }

    let decoded: AdminJwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    } catch {
      res.clearCookie(AUTH_COOKIE_NAME);
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      return;
    }

    // Query Firestore singleton admin to verify active session
    const rootAdmin = await db.getAdmin();
    if (!rootAdmin) {
      res.clearCookie(AUTH_COOKIE_NAME);
      res.status(401).json({ error: 'Unauthorized: Admin record not configured' });
      return;
    }

    // CONCURRENT KICKOUT ENFORCEMENT:
    // If the sessionId in the token does not match the activeSessionId stored in Firestore,
    // immediately invalidate the cookie and deny access!
    if (!rootAdmin.activeSessionId || decoded.sessionId !== rootAdmin.activeSessionId) {
      res.clearCookie(AUTH_COOKIE_NAME);
      res.status(401).json({
        error: 'Session terminated because account was accessed from another device',
        kickout: true,
      });
      return;
    }

    // Attach admin details to request
    (req as any).admin = {
      email: rootAdmin.email || decoded.email || 'admin@noor.dev',
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

// Rate Limiter: Maximum 5 failed attempts per 15 minutes per IP (Brute-force protection)
interface RateLimitRecord {
  failures: number;
  blockedUntil: number;
}

const loginRateLimiterStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILURES = 5;

export function clearAllRateLimits(): void {
  loginRateLimiterStore.clear();
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = loginRateLimiterStore.get(ip);

  if (!record) {
    return { allowed: true };
  }

  if (record.blockedUntil > now) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // If window expired, reset
  if (now - (record.blockedUntil - RATE_LIMIT_WINDOW_MS) > RATE_LIMIT_WINDOW_MS && record.blockedUntil <= now) {
    loginRateLimiterStore.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const record = loginRateLimiterStore.get(ip) || { failures: 0, blockedUntil: 0 };
  record.failures += 1;

  if (record.failures >= MAX_FAILURES) {
    record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    console.warn(`[Security] IP ${ip} exceeded maximum login attempts. Blocked for 15 minutes.`);
  }

  loginRateLimiterStore.set(ip, record);
}

export function resetLoginFailures(ip: string): void {
  loginRateLimiterStore.delete(ip);
}
