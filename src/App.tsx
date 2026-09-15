/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { ContactModal } from './components/ContactModal';
import { PhotoUploaderModal } from './components/PhotoUploaderModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { Project } from './types';
import { projectsData } from './data/portfolioData';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('noor_theme');
    return saved === 'dark';
  });

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    // Check if URL hash specifies a project
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#project-')) {
      const pId = window.location.hash.replace('#project-', '');
      return projectsData.find((p) => p.id === pId) || null;
    }
    return null;
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(() => {
    return localStorage.getItem('noor_custom_photo');
  });

  useEffect(() => {
    localStorage.setItem('noor_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle browser back/forward buttons between project detail page and main portfolio
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const pId = hash.replace('#project-', '');
        const found = projectsData.find((p) => p.id === pId);
        if (found) setSelectedProject(found);
      } else {
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    if (window.location.hash.startsWith('#project-')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    setTimeout(() => {
      const el = document.getElementById('portfolio');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSavePhoto = (url: string | null) => {
    setCustomPhotoUrl(url);
    if (url) {
      localStorage.setItem('noor_custom_photo', url);
    } else {
      localStorage.removeItem('noor_custom_photo');
    }
  };

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
        {/* Navigation Bar */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenContact={() => setContactModalOpen(true)}
        />

        {/* Hero Section */}
        <main className="flex-1">
          <Hero
            darkMode={darkMode}
            onViewWork={() => handleNavigate('portfolio')}
            onContact={() => setContactModalOpen(true)}
            customPhotoUrl={customPhotoUrl}
            onOpenPhotoManager={() => setPhotoModalOpen(true)}
          />

          {/* About & Services Section */}
          <About
            darkMode={darkMode}
            onOpenContact={() => setContactModalOpen(true)}
          />

          {/* Skills Section */}
          <Skills darkMode={darkMode} />

          {/* Projects Section */}
          <Projects
            darkMode={darkMode}
            onSelectProject={handleOpenProject}
          />

          {/* Call to Action Banner */}
          <CtaBanner
            darkMode={darkMode}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </main>

        {/* Full Website Footer */}
        <Footer
          darkMode={darkMode}
          onNavigate={handleNavigate}
          onOpenContact={() => setContactModalOpen(true)}
          onOpenLegal={(type) => setLegalModalType(type)}
        />
      </div>

      {/* Interactive Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        darkMode={darkMode}
      />

      {/* Profile Photo Customizer Modal */}
      <PhotoUploaderModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        customPhotoUrl={customPhotoUrl}
        onSavePhoto={handleSavePhoto}
        darkMode={darkMode}
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
