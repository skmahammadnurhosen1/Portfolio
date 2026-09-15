import { Router, Request, Response } from 'express';
import { db } from '../firebase';
import { authMiddleware } from '../auth';

const router = Router();

// Anti-spam rate limiting for public contact endpoint: max 5 messages per 10 minutes per IP
const contactRateLimitStore = new Map<string, { count: number; expiresAt: number }>();
const CONTACT_WINDOW_MS = 10 * 60 * 1000;
const MAX_CONTACTS_PER_WINDOW = 5;

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateLimitStore.get(ip);
  if (!entry || entry.expiresAt <= now) {
    contactRateLimitStore.set(ip, { count: 1, expiresAt: now + CONTACT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_CONTACTS_PER_WINDOW) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Basic email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - Submit inquiry from public website with anti-spam & input validation
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

  if (!checkContactRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many messages sent. Please wait a few minutes before trying again.' });
    return;
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    const cleanName = String(name).trim().slice(0, 100);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 120);
    const cleanSubject = subject ? String(subject).trim().slice(0, 200) : 'Portfolio Inquiry';
    const cleanMessage = String(message).trim().slice(0, 4000);

    if (cleanName.length < 2) {
      res.status(400).json({ error: 'Please enter a valid name' });
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    if (cleanMessage.length < 5) {
      res.status(400).json({ error: 'Message is too short' });
      return;
    }

    const saved = await db.createMessage({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: saved });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/contact - Admin view inquiries
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await db.getAllMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// DELETE /api/contact/:id - Admin delete inquiry
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await db.deleteMessage(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
