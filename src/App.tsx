/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { ContactModal } from './components/ContactModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { Project, ProfileData } from './types';
import { projectsData } from './data/portfolioData';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { LoginScreen } from './components/AdminPanel/LoginScreen';
import { api } from './components/AdminPanel/api';

type AdminRoute = 'none' | 'login' | 'dashboard';

function getAdminRouteFromUrl(): AdminRoute {
  if (typeof window === 'undefined') return 'none';
  const hash = window.location.hash.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();

  if (hash === '#dashboard' || pathname === '/dashboard') {
    return 'dashboard';
  }
  if (hash === '#admin' || hash === '#login' || pathname === '/admin' || pathname === '/login') {
    return 'login';
  }
  return 'none';
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('noor_theme');
    return saved === 'dark';
  });

  const [adminRoute, setAdminRoute] = useState<AdminRoute>(() => getAdminRouteFromUrl());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Dynamic Database State for Public Website
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState<boolean>(false);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Active projects list: once loaded from server, use the live server projects strictly
  const activeProjects = projectsLoaded ? projects : projectsData;

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);

  // Fetch dynamic portfolio data from backend database with cache-busting
  const fetchPublicData = useCallback(async () => {
    try {
      const [projRes, profRes] = await Promise.all([
        fetch(`/api/projects?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        }).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/profile?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        }).then((r) => (r.ok ? r.json() : null)),
      ]);
      if (Array.isArray(projRes)) {
        setProjects(projRes);
        setProjectsLoaded(true);
      }
      if (profRes) {
        setProfile(profRes);
      }
    } catch (err) {
      console.error('Failed to load portfolio database data:', err);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();

    // Listen to realtime changes dispatched by Admin Panel actions
    const handleDataChanged = () => {
      fetchPublicData();
    };

    // When returning to the browser tab, refresh immediately
    const handleFocus = () => {
      fetchPublicData();
    };

    window.addEventListener('portfolio_data_changed', handleDataChanged);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('portfolio_data_changed', handleDataChanged);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchPublicData]);

  // Check initial admin auth status on mount
  useEffect(() => {
    let isMounted = true;
    api
      .get('/auth/me')
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.authenticated) {
          setIsAuthenticated(true);
          setAdminEmail(res.data.email || 'noor@example.com');
          // If URL was admin/login, sync to dashboard since already authenticated
          const currentUrlRoute = getAdminRouteFromUrl();
          if (currentUrlRoute === 'login') {
            setAdminRoute('dashboard');
            window.history.replaceState(null, '', '#dashboard');
          }
        } else {
          setIsAuthenticated(false);
          // If URL was dashboard, security redirect to login screen
          const currentUrlRoute = getAdminRouteFromUrl();
          if (currentUrlRoute === 'dashboard') {
            setAdminRoute('login');
            window.history.replaceState(null, '', '#admin');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
          const currentUrlRoute = getAdminRouteFromUrl();
          if (currentUrlRoute === 'dashboard') {
            setAdminRoute('login');
            window.history.replaceState(null, '', '#admin');
          }
        }
      })
      .finally(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('noor_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync project selection when projects list loads or URL hash is present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#project-')) {
      const pId = window.location.hash.replace('#project-', '');
      const found = activeProjects.find((p) => p.id === pId);
      if (found) {
        setSelectedProject(found);
      }
    }
  }, [activeProjects]);

  // Handle URL changes (popstate & hashchange) with strict authentication enforcement
  useEffect(() => {
    const handleUrlRouting = () => {
      const route = getAdminRouteFromUrl();
      const hash = window.location.hash;

      if (route === 'dashboard') {
        setSelectedProject(null);
        if (!checkingAuth && !isAuthenticated) {
          // Security protection: unauthenticated visitor cannot access dashboard URL directly
          setAdminRoute('login');
          window.history.replaceState(null, '', '#admin');
        } else {
          setAdminRoute('dashboard');
        }
      } else if (route === 'login') {
        setSelectedProject(null);
        if (!checkingAuth && isAuthenticated) {
          // Already authenticated, forward to dashboard
          setAdminRoute('dashboard');
          window.history.replaceState(null, '', '#dashboard');
        } else {
          setAdminRoute('login');
        }
      } else {
        setAdminRoute('none');
        if (hash.startsWith('#project-')) {
          const pId = hash.replace('#project-', '');
          const found = activeProjects.find((p) => p.id === pId);
          if (found) setSelectedProject(found);
        } else {
          setSelectedProject(null);
        }
      }
    };

    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, [activeProjects, checkingAuth, isAuthenticated]);

  // Section observer to update active section in navbar on scroll
  useEffect(() => {
    if (selectedProject) return; // don't observe when in project details page
    const sections = ['home', 'about', 'services', 'skills', 'portfolio'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedProject]);

  const handleNavigate = (sectionId: string) => {
    if (selectedProject) {
      setSelectedProject(null);
      if (window.location.hash.startsWith('#project-')) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    window.history.pushState({ projectId: project.id }, '', `#project-${project.id}`);
  };

  const handleBackToPortfolio = () => {
    setSelectedProject(null);
    setAdminRoute('none');
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
    setTimeout(() => {
      const el = document.getElementById('portfolio');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // If in Admin Mode, render the Admin Panel or Blind Login Screen
  if (adminRoute !== 'none') {
    if (checkingAuth) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F2EA]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Verifying Security Session...
            </span>
          </div>
        </div>
      );
    }

    // Protected Route Security Enforcement:
    // If the user requested dashboard and is authenticated, show Admin Dashboard.
    // If authenticated user is at login route, forward to Dashboard.
    if (isAuthenticated) {
      return (
        <AdminPanel
          adminEmail={adminEmail}
          onLogout={async () => {
            try {
              await api.post('/auth/logout');
            } catch {
              // Ignore logout network error
            }
            setIsAuthenticated(false);
            setAdminEmail('');
            setAdminRoute('none');
            window.history.replaceState(null, '', '/');
            fetchPublicData();
          }}
          onBackToPortfolio={() => {
            setAdminRoute('none');
            window.history.replaceState(null, '', '/');
            fetchPublicData();
          }}
          onDataChanged={fetchPublicData}
        />
      );
    }

    // If not authenticated, unauthenticated user requesting dashboard or admin is securely confined to LoginScreen
    return (
      <LoginScreen
        onLoginSuccess={(email) => {
          setIsAuthenticated(true);
          setAdminEmail(email);
          setAdminRoute('dashboard');
          window.history.replaceState(null, '', '#dashboard');
          fetchPublicData();
        }}
        onBackToPortfolio={() => {
          setAdminRoute('none');
          window.history.replaceState(null, '', '/');
        }}
      />
    );
  }

  // If a project is selected, render the dedicated minimalist Project Details Page
  if (selectedProject) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 relative selection:bg-amber-300 selection:text-stone-950 font-sans ${
          darkMode ? 'bg-[#121214] text-[#EDEDED]' : 'bg-[#FCFBF4] text-[#1E1E1E]'
        }`}
      >
        <ProjectDetailPage
          project={selectedProject}
          projects={activeProjects}
          onBack={handleBackToPortfolio}
          onSelectProject={(project) => {
            setSelectedProject(project);
            window.history.pushState({ projectId: project.id }, '', `#project-${project.id}`);
          }}
          onOpenContact={() => setContactModalOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Interactive Contact Modal */}
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          darkMode={darkMode}
          email={profile?.email || 'skmahammadnurhosen1@gmail.com'}
        />

        {/* Legal / Privacy / Terms Modal */}
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative selection:bg-amber-300 selection:text-stone-950 font-sans ${
        darkMode ? 'bg-[#121214] text-[#EDEDED]' : 'bg-[#FCFBF4] text-[#1E1E1E]'
      }`}
    >
      {/* Ambient Decorative Shapes */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full opacity-35 blur-3xl z-0"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, #FDE68A 0%, rgba(254, 243, 199, 0) 70%)',
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl z-0"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, #FDE68A 0%, rgba(254, 243, 199, 0) 70%)',
        }}
      />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar - Clean public navigation with zero admin options */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenContact={() => setContactModalOpen(true)}
          profile={profile}
        />

        {/* Hero Section */}
        <main className="flex-1">
          <Hero
            darkMode={darkMode}
            onViewWork={() => handleNavigate('portfolio')}
            onContact={() => setContactModalOpen(true)}
            profile={profile}
          />

          {/* About & Services Section */}
          <About
            darkMode={darkMode}
            onOpenContact={() => setContactModalOpen(true)}
            profile={profile}
          />

          {/* Skills Section */}
          <Skills darkMode={darkMode} />

          {/* Projects Section with Live Database Binding */}
          <Projects
            darkMode={darkMode}
            projects={activeProjects}
            loading={projectsLoading}
            onSelectProject={handleOpenProject}
          />

          {/* Call to Action Banner */}
          <CtaBanner
            darkMode={darkMode}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </main>

        {/* Full Website Footer - Clean public footer with zero admin options */}
        <Footer
          darkMode={darkMode}
          onNavigate={handleNavigate}
          onOpenContact={() => setContactModalOpen(true)}
          onOpenLegal={(type) => setLegalModalType(type)}
          profile={profile}
        />
      </div>

      {/* Interactive Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        darkMode={darkMode}
        email={profile?.email || 'skmahammadnurhosen1@gmail.com'}
      />

      {/* Legal / Privacy / Terms Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        darkMode={darkMode}
      />
    </div>
  );
}
