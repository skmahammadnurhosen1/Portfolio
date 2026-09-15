import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projectsData } from '../data/portfolioData';
import { Project } from '../types';
import { ArrowUpRight, Sparkles, Layers, Briefcase, Filter } from 'lucide-react';
import { ProjectCardImage } from './ProjectCardImage';

interface ProjectsProps {
  darkMode: boolean;
  onSelectProject: (project: Project) => void;
}

export function Projects({ darkMode, onSelectProject }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAll, setShowAll] = useState(false);

  const categories = [
    { id: 'All', label: 'All Projects', count: projectsData.length },
    { id: 'Branding', label: 'Branding', count: projectsData.filter((p) => p.category === 'Branding').length },
    { id: 'Web Development', label: 'Web Dev', count: projectsData.filter((p) => p.category === 'Web Development').length },
    { id: 'UI/UX Design', label: 'UI/UX Design', count: projectsData.filter((p) => p.category === 'UI/UX Design').length },
  ];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <section id="portfolio" className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle Background Radial Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full pointer-events-none opacity-20 dark:opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #F59E0B 0%, rgba(245, 158, 11, 0) 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 h-[3px] bg-amber-400 rounded-full inline-block" />
              <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400">
                MY PROJECTS &amp; CASE STUDIES
              </span>
            </div>
            <h2
              id="projects-headline"
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
                darkMode ? 'text-white' : 'text-[#18181B]'
              }`}
            >
              Featured Creations
            </h2>
            <p className="mt-2 text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
              Handcrafted identity systems, high-conversion web applications, and intuitive digital interfaces built with precision.
            </p>
          </div>

          {/* Project Counter Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                darkMode
                  ? 'bg-stone-900/90 text-stone-300 border-stone-800'
                  : 'bg-white text-stone-700 border-stone-200/80 shadow-xs'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>{filteredProjects.length} Projects Available</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-btn-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                    : darkMode
                    ? 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:text-white hover:border-stone-700'
                    : 'bg-white text-stone-600 border border-stone-200/80 shadow-2xs hover:text-stone-950 hover:border-stone-300'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-stone-950/15 text-stone-950'
                      : darkMode
                      ? 'bg-stone-800 text-stone-400'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                id={`project-card-${project.id}`}
                onClick={() => onSelectProject(project)}
                className={`group relative rounded-[26px] overflow-hidden flex flex-col transition-all duration-300 cursor-pointer border ${
                  darkMode
                    ? 'bg-[#18181B] border-stone-800/90 hover:border-amber-400/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.18)]'
                    : 'bg-white border-stone-200/90 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:border-amber-400 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)]'
                } hover:-translate-y-2`}
              >
                {/* Visual Image Header */}
                <div className="relative">
                  <ProjectCardImage project={project} darkMode={darkMode} />
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Client & Metadata Row */}
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {project.client}
                      </span>
                      {project.year && (
                        <span className="font-medium text-stone-400 dark:text-stone-500">
                          {project.year}
                        </span>
                      )}
                    </div>

                    {/* Project Title */}
                    <h3
                      className={`text-xl sm:text-[22px] font-black tracking-tight leading-snug transition-colors group-hover:text-amber-500 dark:group-hover:text-amber-400 ${
                        darkMode ? 'text-white' : 'text-[#18181B]'
                      }`}
                    >
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <p
                      className={`text-sm leading-relaxed line-clamp-2 ${
                        darkMode ? 'text-stone-400' : 'text-stone-600'
                      }`}
                    >
                      {project.description}
                    </p>

                    {/* Deliverable & Tech Stack Badges */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.slice(0, 3).map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                              darkMode
                                ? 'bg-stone-800/90 text-stone-300 border border-stone-700/50 group-hover:border-stone-600'
                                : 'bg-stone-100 text-stone-700 border border-stone-200/60 group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:border-amber-200/50'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span
                            className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                              darkMode
                                ? 'bg-stone-800/50 text-stone-500'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Case Study Link & Signature Amber Action Button */}
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1">
                      <span>View Case Study</span>
                    </span>

                    {/* Iconic Amber Action Button with Hover Rotation */}
                    <div
                      aria-label={`Open ${project.title}`}
                      className="w-10 h-10 rounded-full bg-amber-400 group-hover:bg-amber-500 text-stone-950 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-amber-400/25"
                    >
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Amber Highlight Edge on Hover */}
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State if filter yields no items */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
