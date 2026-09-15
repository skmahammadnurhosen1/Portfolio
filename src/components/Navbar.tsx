import React, { useState, useEffect } from 'react';
import { Sun, Moon, MoreVertical, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { AnimatedName } from './AnimatedName';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export function Navbar({
  darkMode,
  onToggleDarkMode,
  activeSection,
  onNavigate,
  onOpenContact,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-[#18181B]/85 backdrop-blur-md shadow-sm border-b border-stone-800'
            : 'bg-[#FCFBF4]/85 backdrop-blur-md shadow-xs border-b border-amber-100/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo with NOOR -> NORA animation */}
        <button
          id="brand-logo"
          onClick={() => onNavigate('home')}
          className={`group text-left flex items-baseline focus:outline-hidden font-black tracking-tight text-2xl md:text-3xl transition-colors ${
            darkMode ? 'text-white' : 'text-stone-900'
          }`}
        >
          <AnimatedName
            dotClassName="w-2.5 h-2.5 rounded-full bg-amber-400 ml-1 group-hover:scale-125 transition-transform duration-200"
            showDot={true}
            intervalMs={3000}
          />
        </button>

        {/* Desktop Navigation (completely untouched for desktop) */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
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

        {/* Right Actions: Theme Toggle & Mobile Menu 3-Dot Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
              darkMode
                ? 'text-amber-300 hover:bg-stone-800'
                : 'text-stone-700 hover:bg-amber-100/60 hover:text-stone-900'
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
            ) : (
              <Sun className="w-5 h-5 text-stone-700 hover:text-amber-600 transition-transform hover:rotate-45" />
            )}
          </button>

          {/* Mobile 3-dot menu toggle button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden p-2.5 rounded-xl border transition-all cursor-pointer ${
              darkMode
                ? 'bg-stone-900/80 text-stone-200 border-stone-800 hover:border-amber-400/50 hover:text-amber-400'
                : 'bg-white text-stone-800 border-stone-200 shadow-2xs hover:border-amber-400 hover:text-amber-600'
            }`}
            aria-label="Toggle menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Side Drawer & Backdrop Overlay (Opens smoothly from SIDE on mobile only) */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-visibility duration-300 ${
          mobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Side Drawer Panel (slides in from right) */}
        <div
          id="mobile-menu-side-drawer"
          className={`absolute top-0 right-0 bottom-0 w-[280px] sm:w-[320px] max-w-[85vw] p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out border-l ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } ${
            darkMode
              ? 'bg-[#18181B] border-stone-800 text-stone-100'
              : 'bg-[#FCFBF4] border-stone-200 text-stone-900'
          }`}
        >
          {/* Top Header inside Drawer */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-stone-200 dark:border-stone-800">
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
            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id && link.id !== 'contact';
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className={`text-left px-4 py-3 rounded-xl text-base font-bold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : darkMode
                        ? 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                        : 'text-stone-700 hover:bg-amber-100/50 hover:text-stone-950'
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

          {/* Drawer Bottom Section: Theme & CTA */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                {darkMode ? 'Dark Appearance' : 'Light Appearance'}
              </span>
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold"
              >
                Toggle
              </button>
            </div>

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
        </div>
      </div>
    </header>
  );
}
