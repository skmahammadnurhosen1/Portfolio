import React, { useEffect } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/portfolioData';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  User,
  CheckCircle2,
  Sparkles,
  Share2,
  Layers,
  Award,
  Globe,
  Mail,
} from 'lucide-react';
import {
  HtmlIcon,
  CssIcon,
  JsIcon,
  ReactIcon,
  TailwindIcon,
  GitIcon,
  GithubIcon,
  IllustratorIcon,
  PhotoshopIcon,
  CorelDrawIcon,
  FigmaIcon,
} from './TechIcons';
import { ProjectCardImage } from './ProjectCardImage';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onOpenContact: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ProjectDetailPage({
  project,
  onBack,
  onSelectProject,
  onOpenContact,
  darkMode,
  onToggleDarkMode,
}: ProjectDetailPageProps) {
  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project.id]);

  // Find previous and next projects
  const currentIndex = projectsData.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0 ? projectsData[currentIndex - 1] : projectsData[projectsData.length - 1];
  const nextProject =
    currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : projectsData[0];

  // Helper to render matching authentic tech icon for tools
  const renderToolIcon = (toolName: string) => {
    const lower = toolName.toLowerCase();
    if (lower.includes('illustrator')) return <IllustratorIcon className="w-5 h-5" />;
    if (lower.includes('photoshop')) return <PhotoshopIcon className="w-5 h-5" />;
    if (lower.includes('corel')) return <CorelDrawIcon className="w-5 h-5" />;
    if (lower.includes('figma')) return <FigmaIcon className="w-4 h-5" />;
    if (lower.includes('react')) return <ReactIcon className="w-5 h-5" />;
    if (lower.includes('tailwind')) return <TailwindIcon className="w-5 h-5" />;
    if (lower.includes('javascript')) return <JsIcon className="w-5 h-5" />;
    if (lower.includes('html')) return <HtmlIcon className="w-5 h-5" />;
    if (lower.includes('css')) return <CssIcon className="w-5 h-5" />;
    if (lower.includes('git')) return <GitIcon className="w-5 h-5" />;
    return <Layers className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div
      id="project-detail-page"
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-[#121214] text-[#EDEDED]' : 'bg-[#FCFBF4] text-[#1E1E1E]'
      }`}
    >
      {/* Top Minimalist Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          darkMode
            ? 'bg-[#121214]/90 border-stone-800/80'
            : 'bg-[#FCFBF4]/90 border-amber-100/60'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
          {/* Back to Portfolio Button */}
          <button
            onClick={onBack}
            className={`group inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border ${
              darkMode
                ? 'bg-stone-900/80 text-stone-200 border-stone-800 hover:border-amber-400/60 hover:text-amber-300'
                : 'bg-white text-stone-800 border-stone-200/80 shadow-2xs hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-amber-500" />
            <span>Back to All Projects</span>
          </button>

          {/* Breadcrumb / Project Identifier */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 font-medium">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-amber-500 font-bold">{project.category}</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-500 text-stone-950 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Project Header & Metadata */}
        <section className="space-y-6">
          {/* Category Pill & Year */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-400/15 text-amber-500 dark:text-amber-300 border border-amber-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {project.category}
            </span>
            {project.year && (
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.year}
              </span>
            )}
          </div>

          {/* Project Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            {project.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Minimalist Key Specs Strip */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl border transition-colors ${
              darkMode
                ? 'bg-stone-900/60 border-stone-800 text-stone-200'
                : 'bg-white border-stone-200/80 text-stone-800 shadow-2xs'
            }`}
          >
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Client / Brand
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {project.client || 'Creative Studio'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Timeline
              </span>
              <span className="text-sm font-semibold">{project.year || '2024'}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Role / Discipline
              </span>
              <span className="text-sm font-semibold">{project.category}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Deliverables
              </span>
              <span className="text-sm font-semibold">
                {project.fullDetails?.deliverables.length || project.tags.length} Items
              </span>
            </div>
          </div>
        </section>

        {/* Large Visual Showcase Banner */}
        <section className="mt-10 md:mt-14">
          <div className="rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-xl relative aspect-16/9 sm:aspect-21/9 max-h-[520px] bg-stone-100 dark:bg-stone-800">
            <ProjectCardImage project={project} darkMode={darkMode} />
          </div>
        </section>

        {/* Detailed Case Study Layout */}
        <section className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Overview Section */}
            {project.fullDetails?.overview && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-amber-400 rounded-full" />
                  <h2 className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400">
                    PROJECT OVERVIEW
                  </h2>
                </div>
                <h3 className="text-2xl font-black tracking-tight">The Vision &amp; Strategy</h3>
                <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                  {project.fullDetails.overview}
                </p>
              </div>
            )}

            {/* Deliverables Section */}
            {project.fullDetails?.deliverables && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-amber-400 rounded-full" />
                  <h2 className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400">
                    DELIVERABLES &amp; ASSETS
                  </h2>
                </div>
                <h3 className="text-2xl font-black tracking-tight">Key Milestones Achieved</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {project.fullDetails.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl flex items-start gap-3 border transition-colors ${
                        darkMode
                          ? 'bg-stone-900/40 border-stone-800 text-stone-200'
                          : 'bg-white border-stone-200/70 text-stone-800 shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact & Measurable Results */}
            {project.fullDetails?.results && (
              <div
                className={`p-7 rounded-2xl border relative overflow-hidden transition-colors ${
                  darkMode
                    ? 'bg-amber-400/10 border-amber-400/25 text-stone-100'
                    : 'bg-amber-50/70 border-amber-200 text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400">
                    KEY OUTCOME &amp; CLIENT IMPACT
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold leading-snug tracking-tight">
                  "{project.fullDetails.results}"
                </p>
              </div>
            )}
          </div>

          {/* Right Spec & Tech Stack Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Tools & Tech Stack */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
                darkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200/80 shadow-2xs'
              }`}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-4">
                Tools &amp; Technologies
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {(project.fullDetails?.tools || project.tags).map((tool, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      darkMode
                        ? 'bg-stone-800 text-stone-200 border-stone-700'
                        : 'bg-stone-50 text-stone-800 border-stone-200'
                    }`}
                  >
                    {renderToolIcon(tool)}
                    <span>{tool}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2.5">
                  Disciplines &amp; Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                        darkMode
                          ? 'bg-stone-800/80 text-stone-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Project Inquiry Card */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border text-center space-y-4 transition-colors ${
                darkMode
                  ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-stone-800'
                  : 'bg-gradient-to-b from-white to-amber-50/40 border-stone-200/90 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tight">Need Something Similar?</h4>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  Let's bring your creative branding, modern web app, or visual identity to life.
                </p>
              </div>
              <button
                onClick={onOpenContact}
                className="w-full py-3 px-6 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Inquire About Your Project</span>
              </button>
            </div>
          </div>
        </section>

        {/* Previous / Next Project Navigation Bar */}
        <section className="mt-16 md:mt-24 pt-8 border-t border-stone-200 dark:border-stone-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous Project Card */}
            <button
              onClick={() => onSelectProject(prevProject)}
              className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 cursor-pointer group ${
                darkMode
                  ? 'bg-stone-900/50 border-stone-800 hover:border-amber-400/50'
                  : 'bg-white border-stone-200/80 hover:border-amber-400 shadow-2xs'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block">
                  Previous Project
                </span>
                <span className="text-sm font-bold truncate block group-hover:text-amber-500 transition-colors">
                  {prevProject.title}
                </span>
              </div>
            </button>

            {/* Next Project Card */}
            <button
              onClick={() => onSelectProject(nextProject)}
              className={`p-5 rounded-2xl border text-right flex items-center justify-end gap-4 transition-all duration-200 cursor-pointer group ${
                darkMode
                  ? 'bg-stone-900/50 border-stone-800 hover:border-amber-400/50'
                  : 'bg-white border-stone-200/80 hover:border-amber-400 shadow-2xs'
              }`}
            >
              <div className="overflow-hidden">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block">
                  Next Project
                </span>
                <span className="text-sm font-bold truncate block group-hover:text-amber-500 transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Central Return Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all featured case studies</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
