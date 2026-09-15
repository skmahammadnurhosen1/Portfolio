import React from 'react';
import { MapPin, Mail, Calendar, PenTool, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { servicesData } from '../data/portfolioData';

interface AboutProps {
  darkMode: boolean;
  onOpenContact: () => void;
}

export function About({ darkMode, onOpenContact }: AboutProps) {
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard?.writeText('hello@noor.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'design':
        return <PenTool className="w-5 h-5 text-amber-500" />;
      case 'code':
        return <Code2 className="w-5 h-5 text-amber-500" />;
      case 'sparkle':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Bio & Info Badges */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Section Eyebrow with Yellow Dash */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[3px] bg-amber-400 rounded-full inline-block" />
              <span className="text-xs uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400">
                ABOUT ME
              </span>
            </div>

            {/* Heading */}
            <h2
              id="about-headline"
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                darkMode ? 'text-white' : 'text-[#18181B]'
              }`}
            >
              I'm a <span className="text-amber-500 font-black">Creative</span> Graphic Designer &amp; Website Builder.
            </h2>

            {/* Bio Body */}
            <p
              id="about-bio"
              className={`mt-5 text-base sm:text-lg leading-relaxed ${
                darkMode ? 'text-stone-300' : 'text-stone-600'
              }`}
            >
              I'm Noor, a passionate creative designer and website builder. I love turning
              ideas into beautiful designs and functional websites that solve real problems
              and create value.
            </p>

            {/* Quick Info Cards (Dhaka, Email, Available) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {/* Location Card */}
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'bg-stone-800/80 border border-stone-700/70'
                    : 'bg-white border border-stone-200/70 shadow-xs'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 dark:bg-amber-400/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold leading-snug truncate ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                    Dhaka, Bangladesh
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    (Remote)
                  </p>
                </div>
              </div>

              {/* Email Card (Clickable to Copy / Contact) */}
              <button
                onClick={handleCopyEmail}
                title="Click to copy email"
                className={`p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer group ${
                  darkMode
                    ? 'bg-stone-800/80 border border-stone-700/70 hover:border-amber-400/50'
                    : 'bg-white border border-stone-200/70 hover:border-amber-300 shadow-xs'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 dark:bg-amber-400/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {copiedEmail ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold leading-snug truncate ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                    hello@noor.dev
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium group-hover:underline">
                    {copiedEmail ? 'Copied!' : 'Email Me'}
                  </p>
                </div>
              </button>

              {/* Availability Card */}
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'bg-stone-800/80 border border-stone-700/70'
                    : 'bg-white border border-stone-200/70 shadow-xs'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 dark:bg-amber-400/15 flex items-center justify-center shrink-0 relative">
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold leading-snug truncate ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                    Available
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    for work
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Three Stacked Services Cards matching screenshot layout */}
          <div id="services" className="lg:col-span-6">
            <div
              className={`rounded-3xl p-6 sm:p-8 flex flex-col gap-6 transition-all ${
                darkMode
                  ? 'bg-stone-800/50 border border-stone-700/60 shadow-md'
                  : 'bg-white border border-stone-200/60 shadow-sm'
              }`}
            >
              {servicesData.map((service, index) => (
                <div
                  key={service.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all hover:translate-x-1 ${
                    darkMode
                      ? 'hover:bg-stone-800/80'
                      : 'hover:bg-amber-50/50'
                  }`}
                >
                  {/* Service Icon inside soft rounded yellow box */}
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/80 dark:bg-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
                    {getServiceIcon(service.iconName)}
                  </div>

                  {/* Service Content */}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold tracking-tight ${
                        darkMode ? 'text-white' : 'text-[#18181B]'
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        darkMode ? 'text-stone-400' : 'text-stone-600'
                      }`}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
