import React, { useState } from 'react';
import {
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Sparkles,
  Send,
} from 'lucide-react';
import { BehanceIcon, GithubIcon } from './TechIcons';
import { LegalDocType } from './LegalModal';
import { AnimatedName } from './AnimatedName';

interface FooterProps {
  darkMode: boolean;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
  onOpenLegal: (type: LegalDocType) => void;
}

export function Footer({
  darkMode,
  onNavigate,
  onOpenContact,
  onOpenLegal,
}: FooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('hello@noor.dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className={`border-t transition-colors duration-300 relative ${
        darkMode
          ? 'bg-[#151518] border-stone-800/90 text-stone-400'
          : 'bg-[#F9F8EE] border-amber-100/90 text-stone-600'
      }`}
    >
      {/* Top Banner: Quick Project Callout */}
      <div className="border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-base sm:text-lg font-bold tracking-tight ${
                  darkMode ? 'text-white' : 'text-stone-900'
                }`}
              >
                Ready to elevate your brand &amp; website?
              </p>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Let's collaborate on your next design or web development project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyEmail}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs'
              }`}
            >
              <span>hello@noor.dev</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={onOpenContact}
              className="px-5 py-2 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-500 text-stone-950 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start a Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Multi-Column Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            {/* Logo with NOOR -> NORA animation */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className={`font-black text-2xl tracking-tight flex items-baseline ${
                darkMode ? 'text-white' : 'text-[#18181B]'
              }`}
            >
              <AnimatedName
                dotClassName="w-2.5 h-2.5 rounded-full bg-amber-400 ml-1"
                showDot={true}
                intervalMs={3000}
              />
            </a>

            <p
              className={`mt-3 text-sm leading-relaxed max-w-sm ${
                darkMode ? 'text-stone-400' : 'text-stone-600'
              }`}
            >
              A multidisciplinary Graphic Designer &amp; Website Builder
              crafting distinctive visual identities, intuitive digital
              experiences, and responsive web platforms.
            </p>

            {/* Active Status Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for new projects</span>
            </div>

            {/* Social Icons row */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.behance.net"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800/80 hover:bg-amber-400 hover:text-stone-950 text-stone-300'
                    : 'bg-white hover:bg-amber-400 hover:text-stone-950 text-stone-700 border border-stone-200/80 shadow-xs'
                }`}
              >
                <BehanceIcon className="w-4 h-4" />
              </a>

              <a
                href="#home"
                aria-label="Website"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800/80 hover:bg-amber-400 hover:text-stone-950 text-stone-300'
                    : 'bg-white hover:bg-amber-400 hover:text-stone-950 text-stone-700 border border-stone-200/80 shadow-xs'
                }`}
              >
                <Globe className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800/80 hover:bg-amber-400 hover:text-stone-950 text-stone-300'
                    : 'bg-white hover:bg-amber-400 hover:text-stone-950 text-stone-700 border border-stone-200/80 shadow-xs'
                }`}
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800/80 hover:bg-amber-400 hover:text-stone-950 text-stone-300'
                    : 'bg-white hover:bg-amber-400 hover:text-stone-950 text-stone-700 border border-stone-200/80 shadow-xs'
                }`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-white' : 'text-stone-900'
              }`}
            >
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                >
                  About Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('skills')}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                >
                  Technologies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Hire
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Offered (3 cols) */}
          <div className="lg:col-span-3">
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-white' : 'text-stone-900'
              }`}
            >
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-amber-500 transition-colors block">
                  Brand Identity &amp; Guidelines
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors block">
                  Responsive Web Development
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors block">
                  UI/UX &amp; App Prototyping
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors block">
                  Social Media &amp; Campaign Posts
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors block">
                  Logo &amp; Stationery Design
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors block">
                  Website Maintenance &amp; Optimization
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Work Info (3 cols) */}
          <div className="lg:col-span-3">
            <h4
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-white' : 'text-stone-900'
              }`}
            >
              Contact &amp; Details
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800 dark:text-stone-200">
                    Dhaka, Bangladesh
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Available for Remote Worldwide
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800 dark:text-stone-200">
                    Working Hours
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Mon – Fri: 09:00 AM – 07:00 PM (GMT+6)
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <button
                    onClick={handleCopyEmail}
                    className="font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>hello@noor.dev</span>
                  </button>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block">
                    Replies within 12–24 hours
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Policies Row */}
        <div className="mt-12 pt-6 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-amber-500 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-amber-500 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <button
              onClick={() => onOpenLegal('cookies')}
              className="hover:text-amber-500 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>

          <div className="text-stone-400 dark:text-stone-500 text-xs">
            Security &amp; NDA Friendly
          </div>
        </div>
      </div>

      {/* Bottom Bar: Exact Copyright & Back to Top Button */}
      <div
        className={`py-5 border-t ${
          darkMode
            ? 'bg-[#101012] border-stone-800/80 text-stone-500'
            : 'bg-[#F2F1E4] border-stone-200/80 text-stone-600'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-medium">
          {/* Requested Exact Copyright Line */}
          <p id="copyright-notice">
            © 2026 Noor. All rights reserved.
          </p>

          <p className="text-xs text-stone-500 dark:text-stone-400 text-center">
            Designed &amp; Built with clean code and modern typography by Noor.
          </p>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              darkMode
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs'
            }`}
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
