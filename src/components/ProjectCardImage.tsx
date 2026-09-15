import React, { useState } from 'react';
import { Project } from '../types';
import { Eye, ArrowUpRight } from 'lucide-react';

interface ProjectCardImageProps {
  project: Project;
  darkMode: boolean;
}

export function ProjectCardImage({ project, darkMode }: ProjectCardImageProps) {
  const [imgError, setImgError] = useState(false);

  // Stylized high-fidelity SVG fallback mockups matching creative portfolio aesthetics
  const renderFallback = () => {
    if (project.category === 'Branding') {
      return (
        <div className="w-full h-full bg-[#121214] relative flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-amber-400/15 blur-2xl" />
          <div className="relative z-10 w-full max-w-[260px] flex items-center justify-center gap-3">
            {/* Gold business card */}
            <div className="w-32 h-20 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 rounded-xl shadow-xl transform -rotate-6 p-3 flex flex-col justify-between border border-amber-200/60">
              <div className="w-6 h-6 rounded-full bg-stone-950 flex items-center justify-center text-[10px] font-black text-amber-300">
                N
              </div>
              <div>
                <div className="w-16 h-1.5 bg-stone-950 rounded-sm" />
                <div className="w-10 h-1 bg-stone-900/60 rounded-xs mt-1" />
              </div>
            </div>
            {/* Matte black card */}
            <div className="w-32 h-20 bg-stone-900 rounded-xl shadow-2xl transform rotate-10 p-3 flex flex-col justify-between border border-amber-400/30 -ml-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold">✦</span>
                <span className="text-[8px] font-bold tracking-widest text-amber-400 uppercase">Brand Studio</span>
              </div>
              <div>
                <div className="w-14 h-1.5 bg-amber-400 rounded-sm" />
                <div className="w-8 h-1 bg-amber-400/50 rounded-xs mt-1" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (project.category === 'Web Development') {
      return (
        <div className="w-full h-full bg-[#0D0D11] relative flex items-center justify-center p-6 overflow-hidden">
          <div className="w-full max-w-[260px] bg-stone-800 rounded-t-xl p-2 pb-0 shadow-2xl border border-stone-700">
            <div className="bg-[#18181C] rounded-t-lg p-3 aspect-16/10 flex flex-col justify-between border border-stone-800">
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                </div>
                <div className="w-16 h-1.5 bg-stone-700 rounded-full" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1.5">
                  <div className="w-18 h-2.5 bg-amber-400 rounded-sm" />
                  <div className="w-24 h-1.5 bg-stone-600 rounded-xs" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 shadow-inner" />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="h-3 bg-stone-800 rounded-xs" />
                <div className="h-3 bg-stone-800 rounded-xs" />
                <div className="h-3 bg-amber-400/30 rounded-xs" />
              </div>
            </div>
            <div className="h-2 bg-stone-700 rounded-b-md mx-auto w-[108%] -translate-x-[4%]" />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-[#121216] relative flex items-center justify-center p-6 overflow-hidden">
        <div className="flex items-center justify-center gap-3">
          <div className="w-20 h-36 bg-stone-900 rounded-2xl p-1.5 shadow-xl border-2 border-stone-700 flex flex-col justify-between">
            <div className="w-6 h-1 bg-stone-700 rounded-full mx-auto" />
            <div className="bg-amber-400/20 rounded-xl p-2 flex-1 my-1 flex flex-col justify-between">
              <span className="text-xs">✨</span>
              <div className="space-y-1">
                <div className="w-10 h-1.5 bg-amber-400 rounded-xs" />
                <div className="w-6 h-1 bg-stone-500 rounded-xs" />
              </div>
            </div>
            <div className="w-4 h-1 bg-stone-700 rounded-full mx-auto" />
          </div>
          <div className="w-20 h-36 bg-stone-900 rounded-2xl p-1.5 shadow-2xl border-2 border-stone-700 flex flex-col justify-between scale-105">
            <div className="w-6 h-1 bg-stone-700 rounded-full mx-auto" />
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-2 flex-1 my-1 flex flex-col justify-between text-stone-950">
              <span className="text-[8px] font-black uppercase tracking-wider">UI / UX</span>
              <div className="space-y-1">
                <div className="w-10 h-1.5 bg-stone-950 rounded-xs" />
                <div className="w-8 h-1 bg-stone-800 rounded-xs" />
              </div>
            </div>
            <div className="w-4 h-1 bg-stone-700 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-52 sm:h-56 md:h-60 relative overflow-hidden bg-stone-100 dark:bg-stone-800">
      {/* Background Image / Render */}
      {!imgError ? (
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
      ) : (
        renderFallback()
      )}

      {/* Elegant Atmospheric Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

      {/* Floating Category Pill on Top Left */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md bg-stone-950/75 text-amber-300 border border-amber-400/30 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {project.category}
        </span>
      </div>

      {/* Floating Year Pill on Top Right */}
      {project.year && (
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-stone-950/60 text-stone-200 border border-white/10 shadow-xs">
            {project.year}
          </span>
        </div>
      )}

      {/* Interactive Floating Quick-Preview Hint on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-stone-950/20 backdrop-blur-[2px]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white text-xs font-bold shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border border-stone-200 dark:border-stone-700">
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
        </div>
      </div>
    </div>
  );
}
