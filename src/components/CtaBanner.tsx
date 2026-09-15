import React from 'react';
import { Send, ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  darkMode: boolean;
  onOpenContact: () => void;
}

export function CtaBanner({ darkMode, onOpenContact }: CtaBannerProps) {
  return (
    <section id="cta" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div
          id="cta-container-card"
          className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-14 transition-colors ${
            darkMode
              ? 'bg-gradient-to-br from-amber-500/10 via-stone-800 to-stone-800/90 border border-amber-500/20 shadow-xl'
              : 'bg-gradient-to-br from-amber-100/70 via-amber-50/80 to-amber-100/50 border border-amber-200/80 shadow-sm'
          }`}
        >
          {/* Ambient decorative background circle */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-300/20 pointer-events-none blur-2xl" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="md:col-span-8 flex flex-col items-start">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-[3px] bg-amber-400 rounded-full inline-block" />
                <span className="text-xs uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400">
                  LET'S WORK TOGETHER
                </span>
              </div>

              {/* Title */}
              <h2
                id="cta-headline"
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  darkMode ? 'text-white' : 'text-[#18181B]'
                }`}
              >
                Got a project in mind?
              </h2>

              {/* Paragraph */}
              <p
                className={`mt-3 text-base sm:text-lg max-w-lg leading-relaxed ${
                  darkMode ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                I'm always open to new opportunities and exciting projects.
                Let's create something amazing together!
              </p>

              {/* CTA Button */}
              <button
                id="cta-get-in-touch-btn"
                onClick={onOpenContact}
                className="mt-6 px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-semibold text-sm flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer group active:scale-98"
              >
                <Send className="w-4 h-4 text-stone-900" />
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right Graphic: Handwritten Doodle with Curved Arrow matching UI screenshot */}
            <div className="md:col-span-4 flex items-center justify-center md:justify-end select-none">
              <div className="relative transform rotate-3 flex items-center">
                {/* Curved Arrow Doodle */}
                <div className="absolute -top-7 -left-12 pointer-events-none">
                  <svg
                    width="60"
                    height="40"
                    viewBox="0 0 70 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-amber-500"
                  >
                    <path
                      d="M8 38C22 14 45 10 60 22"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M52 14L62 23L48 27"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Handwritten Text */}
                <div className="font-handwriting text-2xl sm:text-3xl font-bold text-stone-800 dark:text-amber-200 leading-tight">
                  <p>Let's</p>
                  <p className="pl-2">Create</p>
                  <p className="pl-3">Something</p>
                  <div className="pl-4 relative inline-block">
                    <span>Great</span>
                    {/* Handwritten underline */}
                    <svg
                      className="absolute -bottom-2 -left-2 w-24 h-4 text-stone-800 dark:text-amber-300"
                      viewBox="0 0 100 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12C30 18 70 17 95 6"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
