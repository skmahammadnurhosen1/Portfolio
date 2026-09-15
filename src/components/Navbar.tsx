import React, { useState, useEffect } from 'react';
import { Sun, MoreVertical, X, ArrowUpRight, FileDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedName } from './AnimatedName';
import { triggerCvDownload } from '../utils/cvDownloader';
import { ProfileData } from '../types';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
  profile?: ProfileData | null;
}

export function Navbar({
  darkMode,
  onToggleDarkMode,
  activeSection,
  onNavigate,
  onOpenContact,
  profile,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [downloadingCv, setDownloadingCv] = useState(false);

  const handleDownloadCv = async () => {
    if (downloadingCv) return;
    setDownloadingCv(true);
    try {
      const res = await triggerCvDownload(profile?.cvFileName || 'Noor_Resume_CV.pdf');
      if (!res.success && res.error) {
        alert(res.error);
      }
    } finally {
      setDownloadingCv(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact', action: onOpenContact },
  ];

  const handleLinkClick = (link: (typeof navLinks)[0]) => {
    setMobileMenuOpen(false);
    if (link.action) {
      link.action();
    } else {
      onNavigate(link.id);
    }
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          scrolled
            ? darkMode
              ? 'bg-[#18181B]/95 backdrop-blur-md shadow-sm border-b border-stone-800'
              : 'bg-[#FCFBF4]/95 backdrop-blur-md shadow-xs border-b border-amber-100/70'
            : darkMode
            ? 'bg-[#18181B]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-stone-800/60 md:border-b-0'
            : 'bg-[#FCFBF4]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-amber-100/50 md:border-b-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          {/* Brand Logo with NOOR -> NORA animation */}
          <button
            id="brand-logo"
            onClick={() => onNavigate('home')}
            className={`group text-left flex items-baseline focus:outline-hidden font-black tracking-tight text-2xl sm:text-3xl transition-colors cursor-pointer shrink-0 ${
              darkMode ? 'text-white' : 'text-stone-900'
            }`}
          >
            <AnimatedName
              dotClassName="w-2.5 h-2.5 rounded-full bg-amber-400 ml-1 group-hover:scale-125 transition-transform duration-200"
              showDot={true}
              intervalMs={3000}
            />
          </button>

          {/* Desktop Navigation (hidden on mobile, visible on md+) */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id && link.id !== 'contact';
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => handleLinkClick(link)}
                  className={`relative py-1 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? darkMode
                        ? 'text-white font-semibold'
                        : 'text-stone-900 font-semibold'
                      : darkMode
                      ? 'text-stone-400 hover:text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-amber-400 rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Download CV Quick Link */}
            <button
              type="button"
              onClick={handleDownloadCv}
              disabled={downloadingCv}
              aria-label="Download CV"
              title="Download Noor's CV (PDF)"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer disabled:opacity-60 ${
                darkMode
                  ? 'text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30'
                  : 'text-amber-950 hover:text-black bg-amber-100/80 hover:bg-amber-200/80 border border-amber-200/90 shadow-2xs'
              }`}
            >
              {downloadingCv ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{downloadingCv ? '...' : 'CV'}</span>
            </button>

            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                darkMode
                  ? 'text-amber-300 hover:bg-stone-800'
                  : 'text-stone-700 hover:bg-amber-100/60 hover:text-stone-900'
              }`}
            >
              <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
            </button>

            {/* Mobile 3-dot menu toggle button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-amber-400/50 hover:text-amber-400 active:bg-stone-800'
                  : 'bg-white text-stone-800 border-stone-200 shadow-2xs hover:border-amber-400 hover:text-amber-600 active:bg-amber-50'
              }`}
              aria-label="Toggle menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Rendered outside <header> so backdrop-filter does NOT trap the fixed drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 overflow-hidden" id="mobile-menu-overlay">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Side Drawer Panel (Smooth slide-in with spring physics, fully responsive & scrollable) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              id="mobile-menu-side-drawer"
              className={`fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] max-w-[85vw] h-full p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto border-l ${
                darkMode
                  ? 'bg-[#18181B] border-stone-800 text-stone-100'
                  : 'bg-[#FCFBF4] border-stone-200 text-stone-900'
              }`}
            >
              {/* Drawer Top Header & Navigation Links */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-black text-lg tracking-tight">MENU</span>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      darkMode
                        ? 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links List */}
                <nav className="flex flex-col gap-2 mt-5">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id && link.id !== 'contact';
                    return (
                      <button
                        key={link.id}
                        id={`mobile-nav-${link.id}`}
                        onClick={() => handleLinkClick(link)}
                        className={`text-left px-4 py-3 rounded-xl text-base font-bold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-amber-400 text-stone-950 shadow-sm'
                            : darkMode
                            ? 'text-stone-300 hover:bg-stone-800/80 hover:text-white active:bg-stone-800'
                            : 'text-stone-700 hover:bg-amber-100/50 hover:text-stone-950 active:bg-amber-100'
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-stone-950" />
                        ) : (
                          <span className="text-stone-400 dark:text-stone-600 text-xs">→</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Section: Theme & Contact CTA */}
              <div className="pt-5 border-t border-stone-200 dark:border-stone-800 space-y-3 mt-6 shrink-0">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    {darkMode ? 'Dark Appearance' : 'Light Appearance'}
                  </span>
                  <button
                    onClick={onToggleDarkMode}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Toggle
                  </button>
                </div>

                {/* Direct Download CV in Mobile Menu */}
                <button
                  type="button"
                  disabled={downloadingCv}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDownloadCv();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-950 dark:text-amber-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {downloadingCv ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  ) : (
                    <FileDown className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{downloadingCv ? 'Downloading CV...' : 'Download CV (PDF)'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
