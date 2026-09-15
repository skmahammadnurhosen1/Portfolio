import axios, { AxiosRequestConfig } from 'axios';
import { clientDatabase } from '../../lib/clientDatabase';
import bcrypt from 'bcryptjs';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to convert an uploaded File to a clean Base64 data URL
async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
            return;
          }
          resolve((e.target?.result as string) || '');
        };
        img.onerror = () => resolve((e.target?.result as string) || '');
        img.src = (e.target?.result as string) || '';
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    }
  });
}

// Helper to parse FormData or JSON into a plain object
async function parsePayload(data: any): Promise<Record<string, any>> {
  if (typeof window === 'undefined') return {};
  if (data instanceof FormData) {
    const result: Record<string, any> = {};
    for (const [key, val] of (data as any).entries()) {
      if (val instanceof File) {
        if (val.size > 0) {
          result[key] = await processImageFile(val);
          result[`${key}File`] = val;
        }
      } else {
        try {
          result[key] = JSON.parse(val);
        } catch (_) {
          result[key] = val;
        }
      }
    }
    return result;
  }

  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (_) {
      return {};
    }
  }

  return data || {};
}

/**
 * Handle API fallback when server is unavailable (e.g. deployed on Netlify static hosting)
 */
async function handleFallback(config: AxiosRequestConfig): Promise<any> {
  const method = (config.method || 'GET').toUpperCase();
  const rawUrl = config.url || '';
  // Normalize url by removing base or query params
  const cleanUrl = rawUrl.replace(/^\/api/, '').split('?')[0];

  // 1. AUTH ROUTES
  if (cleanUrl === '/auth/login' && method === 'POST') {
    const body = await parsePayload(config.data);
    const authRes = clientDatabase.verifyAdminLogin(body.email, body.password);
    if (!authRes.success) {
      const err: any = new Error(authRes.error || 'Invalid credentials');
      err.response = { status: 401, data: { error: authRes.error || 'Invalid credentials' } };
      throw err;
    }
    return {
      success: true,
      token: authRes.token,
      email: authRes.email,
      message: 'Authentication successful (Local)',
    };
  }

  if (cleanUrl === '/auth/me' && method === 'GET') {
    const auth = clientDatabase.checkAdminAuth();
    if (!auth.authenticated) {
      const err: any = new Error('Unauthorized');
      err.response = { status: 401, data: { error: 'Unauthorized' } };
      throw err;
    }
    return {
      authenticated: true,
      email: auth.email,
    };
  }

  if (cleanUrl === '/auth/logout' && method === 'POST') {
    clientDatabase.logout();
    return { success: true, message: 'Logged out successfully' };
  }

  if (cleanUrl === '/auth/credentials' && method === 'PUT') {
    const body = await parsePayload(config.data);
    const creds = clientDatabase.getCredentials();
    if (!clientDatabase.verifyPassword(body.currentPassword, creds)) {
      const err: any = new Error('Current password is incorrect');
      err.response = { status: 400, data: { error: 'Current password is incorrect' } };
      throw err;
    }

    const updates: any = {};
    if (body.newEmail) updates.email = body.newEmail;
    if (body.newPassword) {
      try {
        updates.passwordHash = bcrypt.hashSync(body.newPassword, 10);
      } catch (_) {}
      updates.plainFallback = body.newPassword;
    }

    clientDatabase.setCredentials(updates);
    return { success: true, message: 'Credentials updated successfully' };
  }

  // 2. PROJECTS ROUTES
  if (cleanUrl === '/projects') {
    if (method === 'GET') {
      return clientDatabase.getProjects();
    }
    if (method === 'POST') {
      const body = await parsePayload(config.data);
      const project = clientDatabase.createProject({
        ...body,
        image: body.image || body.imageUrl,
        imageUrl: body.imageUrl || body.image,
      });
      return { success: true, project };
    }
  }

  if (cleanUrl.startsWith('/projects/')) {
    const id = cleanUrl.replace('/projects/', '').trim();
    if (method === 'GET') {
      const proj = clientDatabase.getProject(id);
      if (!proj) {
        const err: any = new Error('Project not found');
        err.response = { status: 404, data: { error: 'Project not found' } };
        throw err;
      }
      return proj;
    }
    if (method === 'PUT') {
      const body = await parsePayload(config.data);
      const updated = clientDatabase.updateProject(id, {
        ...body,
        image: body.image || body.imageUrl,
        imageUrl: body.imageUrl || body.image,
      });
      return { success: true, project: updated };
    }
    if (method === 'DELETE') {
      clientDatabase.deleteProject(id);
      return { success: true, message: 'Project deleted' };
    }
  }

  // 3. PROFILE ROUTES
  if (cleanUrl === '/profile') {
    if (method === 'GET') {
      return clientDatabase.getProfile();
    }
    if (method === 'PUT') {
      const body = await parsePayload(config.data);
      const updated = clientDatabase.updateProfile(body);
      return { success: true, profile: updated };
    }
  }

  if (cleanUrl === '/profile/avatar' && method === 'POST') {
    const body = await parsePayload(config.data);
    const avatarUrl = body.avatar || body.avatarUrl;
    if (avatarUrl) {
      clientDatabase.updateProfile({ avatarUrl });
    }
    return { success: true, avatarUrl };
  }

  if (cleanUrl === '/profile/cv') {
    if (method === 'POST') {
      const body = await parsePayload(config.data);
      const resumeUrl = body.cv || body.resumeUrl;
      const cvFileName = body.cvFile?.name || 'Noor_Resume_CV.pdf';
      const cvFileSize = body.cvFile?.size || 0;
      clientDatabase.updateProfile({
        resumeUrl,
        cvFileName,
        cvFileSize,
        cvUpdatedAt: new Date().toISOString(),
      });
      return { success: true, resumeUrl, cvFileName };
    }
    if (method === 'DELETE') {
      clientDatabase.updateProfile({
        resumeUrl: '',
        cvFileName: '',
        cvFileSize: 0,
      });
      return { success: true, message: 'CV removed' };
    }
  }

  // 4. STATS ROUTE
  if (cleanUrl === '/stats' && method === 'GET') {
    return clientDatabase.getStats();
  }

  // 5. CONTACT / MESSAGES ROUTES
  if (cleanUrl === '/contact') {
    if (method === 'GET') {
      return clientDatabase.getMessages();
    }
    if (method === 'POST') {
      const body = await parsePayload(config.data);
      const msg = clientDatabase.addMessage({
        name: body.name || 'Visitor',
        email: body.email || '',
        subject: body.subject || 'General Inquiry',
        message: body.message || '',
      });
      return { success: true, message: msg };
    }
  }

  if (cleanUrl.startsWith('/contact/')) {
    const id = cleanUrl.replace('/contact/', '').trim();
    if (method === 'DELETE') {
      clientDatabase.deleteMessage(id);
      return { success: true };
    }
  }

  return undefined;
}

// Request interceptor: attach token from localStorage, handle FormData boundary, and prevent GET caching
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('noor_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // CRITICAL: When sending FormData, delete Content-Type so browser sets multipart/form-data with proper boundary
  if (config.data instanceof FormData && config.headers) {
    delete (config.headers as any)['Content-Type'];
    delete (config.headers as any)['content-type'];
    if (typeof (config.headers as any).delete === 'function') {
      (config.headers as any).delete('Content-Type');
      (config.headers as any).delete('content-type');
    }
  }

  // Prevent browser caching on GET requests
  if (config.method?.toLowerCase() === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }

  return config;
});

// Response interceptor: cache live server data into clientDatabase AND handle graceful fallback
api.interceptors.response.use(
  (response) => {
    // If real server responded successfully with live data, sync into clientDatabase
    if (typeof window !== 'undefined' && response.status === 200 && response.data) {
      const url = response.config.url || '';
      if (url.includes('/projects') && response.config.method?.toLowerCase() === 'get' && Array.isArray(response.data)) {
        clientDatabase.saveProjects(response.data);
      } else if (url.includes('/profile') && response.config.method?.toLowerCase() === 'get' && typeof response.data === 'object') {
        clientDatabase.saveProfile(response.data);
      }
    }
    return response;
  },
  async (error) => {
    // Check if error is due to missing backend server (404 on Netlify, Network Error, 502 Bad Gateway)
    const isNetworkOrNotFound =
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('Network Error');

    if (isNetworkOrNotFound && error.config) {
      try {
        const fallbackResult = await handleFallback(error.config);
        if (fallbackResult !== undefined) {
          return {
            data: fallbackResult,
            status: 200,
            statusText: 'OK (Autonomous Client Engine)',
            headers: {},
            config: error.config,
          };
        }
      } catch (fallbackError: any) {
        return Promise.reject(fallbackError);
      }
    }

    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('noor_admin_token');
      }
      // If concurrent session was terminated, dispatch custom event
      if (error.response.data && error.response.data.kickout) {
        window.dispatchEvent(
          new CustomEvent('noor_admin_kickout', {
            detail: { message: error.response.data.error },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);
