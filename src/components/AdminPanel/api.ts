import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Response interceptor to handle session kickouts
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

