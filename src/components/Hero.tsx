import React from 'react';
import { ArrowRight, Mail, Globe, Linkedin } from 'lucide-react';
import { BehanceIcon, GithubIcon } from './TechIcons';
import { NoorPortrait } from './NoorPortrait';
import { AnimatedName } from './AnimatedName';
import { ProfileData } from '../types';

interface HeroProps {
  darkMode: boolean;
  onViewWork: () => void;
  onContact: () => void;
  profile?: ProfileData | null;
}

export function Hero({
  darkMode,
  onViewWork,
  onContact,
  profile,
}: HeroProps) {
  const behanceLink = profile?.socialLinks?.behance || 'https://www.behance.net';
  const githubLink = profile?.socialLinks?.github || 'https://github.com';
  const linkedinLink = profile?.socialLinks?.linkedin || 'https://linkedin.com';
  return (
    <section
      id="home"
      className="relative scroll-mt-20 md:scroll-mt-24 pt-24 sm:pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Subtle Top-Left Ambient Glow matching UI screenshot */}
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-40 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, #FDE68A 0%, rgba(253, 230, 138, 0) 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bio & Introduction */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Friendly Greeting - Normal clean text, no box background */}
            <div
              id="hero-greeting"
              className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 ${
                darkMode ? 'text-stone-300' : 'text-stone-700'
              }`}
            >
              Hey I'm
            </div>

            {/* Massive Hero Name with Yellow Dot & Smooth NOOR -> NORA Animation */}
            <h1
              id="hero-name-title"
              className={`font-black tracking-tight leading-none text-6xl sm:text-7xl lg:text-8xl flex items-baseline ${
                darkMode ? 'text-white' : 'text-[#18181B]'
              }`}
            >
              <AnimatedName
                dotClassName="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-amber-400 ml-1 translate-y-[-2px]"
                showDot={true}
                intervalMs={3000}
              />
            </h1>

            {/* Profession Title */}
            <h2
              id="hero-subtitle"
              className={`mt-4 text-xl sm:text-2xl font-bold tracking-tight ${
                darkMode ? 'text-stone-200' : 'text-stone-900'
              }`}
            >
              {profile?.title || 'Graphic Designer & Website Builder'}
            </h2>

            {/* Introductory Description */}
            <p
              id="hero-description"
              className={`mt-4 text-base sm:text-lg max-w-xl leading-relaxed ${
                darkMode ? 'text-stone-400' : 'text-stone-600'
              }`}
            >
              {profile?.bio || 'I create clean, modern and impactful designs, and build responsive websites that help brands grow and make a lasting impression.'}
            </p>

            {/* Call to Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Primary CTA */}
              <button
                id="hero-cta-view-work"
                onClick={onViewWork}
                className="group px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-semibold text-sm flex items-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-98"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA */}
              <button
                id="hero-cta-contact"
                onClick={onContact}
                className={`px-6 py-3.5 rounded-full text-sm font-medium flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                  darkMode
                    ? 'bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700'
                    : 'bg-white/90 hover:bg-white text-stone-800 border border-stone-200/80 shadow-xs'
                }`}
              >
                <Mail className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                <span>Contact Me</span>
              </button>
            </div>

            {/* Social Media Link Buttons */}
            <div className="mt-10 flex items-center gap-3">
              {/* Behance */}
              <a
                href={behanceLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-900'
                    : 'bg-white text-stone-700 border border-stone-200/70 hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400'
                } shadow-xs hover:-translate-y-0.5`}
              >
                <BehanceIcon className="w-4 h-4" />
              </a>

              {/* Web / Dribbble */}
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  onViewWork();
                }}
                aria-label="Portfolio link"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-900'
                    : 'bg-white text-stone-700 border border-stone-200/70 hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400'
                } shadow-xs hover:-translate-y-0.5`}
              >
                <Globe className="w-4 h-4" />
              </a>

              {/* GitHub */}
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-900'
                    : 'bg-white text-stone-700 border border-stone-200/70 hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400'
                } shadow-xs hover:-translate-y-0.5`}
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  darkMode
                    ? 'bg-stone-800 text-stone-300 hover:bg-amber-400 hover:text-stone-900'
                    : 'bg-white text-stone-700 border border-stone-200/70 hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400'
                } shadow-xs hover:-translate-y-0.5`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual with Noor's Cutout & Playful Doodle */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <NoorPortrait darkMode={darkMode} avatarUrl={profile?.avatarUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
