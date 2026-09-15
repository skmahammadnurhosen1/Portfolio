import React from 'react';
import { Project } from '../types';
import { X, ExternalLink, Calendar, User, CheckCircle2, Tag } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  darkMode: boolean;
  onOpenContact: () => void;
}

export function ProjectModal({
  project,
  onClose,
  darkMode,
  onOpenContact,
}: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="project-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 transition-all ${
          darkMode
            ? 'bg-[#18181B] text-white border border-stone-800 shadow-2xl'
            : 'bg-[#FCFBF4] text-stone-900 border border-stone-200 shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300">
            {project.category}
          </span>
          {project.year && (
            <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
          {project.title}
        </h3>
        <p className="mt-2 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
          {project.description}
        </p>

        {/* Project Image Banner */}
        <div className="mt-6 rounded-2xl overflow-hidden border border-stone-200/60 dark:border-stone-800 shadow-sm max-h-72">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detailed Breakdown */}
        {project.fullDetails && (
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-1.5">
                Overview
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {project.fullDetails.overview}
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-2">
                Key Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.fullDetails.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools Used & Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Tools &amp; Tech
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.fullDetails.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 font-medium text-stone-700 dark:text-stone-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Impact &amp; Results
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">
                  {project.fullDetails.results}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="px-6 py-2.5 text-sm font-semibold rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 transition cursor-pointer"
          >
            Inquire About Similar Project
          </button>
        </div>
      </div>
    </div>
  );
}
