import React, { useEffect } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/portfolioData';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Globe,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  ArrowUpRight,
  Mail,
  Palette,
  Code2,
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
  projects?: Project[];
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onOpenContact: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ProjectDetailPage({
  project,
  projects,
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
  const list = projects && projects.length > 0 ? projects : projectsData;
  const currentIndex = list.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0 ? list[currentIndex - 1] : list[list.length - 1];
  const nextProject =
    currentIndex < list.length - 1 ? list[currentIndex + 1] : list[0];

  // Check if current project is Graphics Design or Website
  const isGraphics =
    project.projectType === 'graphics' ||
    ['Branding', 'Graphics Design', 'UI/UX Design', 'Logo Design', 'Graphic Design'].includes(
      project.category
    );

  // Helper to render matching authentic tech / design tool icon
  const renderToolIcon = (toolName: string) => {
    const lower = toolName.toLowerCase();
    if (lower.includes('illustrator')) return <IllustratorIcon className="w-5 h-5" />;
    if (lower.includes('photoshop')) return <PhotoshopIcon className="w-5 h-5" />;
    if (lower.includes('corel')) return <CorelDrawIcon className="w-5 h-5" />;
    if (lower.includes('figma')) return <FigmaIcon className="w-4 h-5" />;
    if (lower.includes('react')) return <ReactIcon className="w-5 h-5" />;
    if (lower.includes('tailwind')) return <TailwindIcon className="w-5 h-5" />;
    if (lower.includes('javascript') || lower.includes('js')) return <JsIcon className="w-5 h-5" />;
    if (lower.includes('html')) return <HtmlIcon className="w-5 h-5" />;
    if (lower.includes('css')) return <CssIcon className="w-5 h-5" />;
    if (lower.includes('git')) return <GitIcon className="w-5 h-5" />;
    if (isGraphics) return <Palette className="w-4 h-4 text-amber-500" />;
    return <Layers className="w-4 h-4 text-amber-500" />;
  };

  const activeTools = isGraphics
    ? project.designTools && project.designTools.length > 0
      ? project.designTools
      : project.fullDetails?.tools || project.tags
    : project.techStack && project.techStack.length > 0
    ? project.techStack
    : project.fullDetails?.tools || project.tags;

  const activeDeliverables = isGraphics
    ? project.deliverables && project.deliverables.length > 0
      ? project.deliverables
      : project.fullDetails?.deliverables || [
          'Vector Source Files (AI, EPS, SVG)',
          'High-Resolution PNG & JPG Assets',
          'Print-Ready Vector PDF',
          'Brand Identity Guidelines',
        ]
    : project.deliverables && project.deliverables.length > 0
    ? project.deliverables
    : project.fullDetails?.deliverables || [
          'Responsive Cross-Platform Architecture',
          'Clean Modular Codebase',
          'Production Deployment & CI/CD',
        ];

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
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-stone-400 dark:text-stone-500">
              {isGraphics ? 'Graphics Design' : 'Web Development'}
            </span>
            <span>/</span>
            <span className="text-amber-500 font-bold">
              {project.designSubtype || project.category}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Project Header & Metadata */}
        <section className="space-y-6">
          {/* Category Pill & Year */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                isGraphics
                  ? 'bg-amber-400/15 text-amber-500 dark:text-amber-300 border-amber-400/30'
                  : 'bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/30'
              }`}
            >
              {isGraphics ? (
                <Palette className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span>{project.designSubtype || project.category}</span>
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
                {project.client || 'Creative Client'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Timeline
              </span>
              <span className="text-sm font-semibold">{project.year || '2025'}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Discipline
              </span>
              <span className="text-sm font-semibold">
                {isGraphics ? 'Graphics & Visual Design' : 'Web Engineering'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block mb-1">
                Deliverables
              </span>
              <span className="text-sm font-semibold">
                {activeDeliverables.length} Items
              </span>
            </div>
          </div>
        </section>

        {/* Visual Showcase Banner & Action Controls Around Picture */}
        <section className="mt-10 md:mt-14 space-y-4">
          {/* Main Showcase Image Frame */}
          <div className="rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-xl relative aspect-16/9 sm:aspect-21/9 max-h-[520px] bg-stone-100 dark:bg-stone-800 group">
            <ProjectCardImage project={project} darkMode={darkMode} />

            {/* Top Overlay Badge on Picture */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-stone-950/80 text-white backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-sm">
                {isGraphics ? (
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{project.designSubtype || project.category}</span>
              </span>
              {project.status && (
                <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-900/70 text-stone-200 backdrop-blur-md border border-white/10">
                  {project.status}
                </span>
              )}
            </div>

            {/* Floating Quick Link on Picture (Bottom-Right) */}
            {project.liveUrl && (
              <div className="absolute bottom-4 right-4 z-20">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="image-overlay-action-btn"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 shadow-lg shadow-amber-400/30 transition-all hover:scale-105 active:scale-95"
                >
                  {isGraphics ? <Palette className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span>{isGraphics ? 'View Design Showcase' : 'Live Demo'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Action Bar Around the Picture: The Two Primary Options */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              darkMode
                ? 'bg-stone-900/80 border-stone-800 text-stone-200'
                : 'bg-white border-stone-200/90 text-stone-800 shadow-2xs'
            }`}
          >
            {/* Left: Project Live Context */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-500 flex items-center justify-center shrink-0">
                {isGraphics ? <Palette className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isGraphics ? 'Design Showcase & Assets' : 'Live Demo & Consultation'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
                  {isGraphics
                    ? project.liveUrl
                      ? 'Explore high-resolution artwork on Behance / Figma or commission custom designs.'
                      : 'High-res vector assets and brand guidelines available on request.'
                    : project.liveUrl
                    ? 'Explore the live project deployment or discuss a tailored implementation.'
                    : 'Interactive demo available on request. Get in touch to discuss this project.'}
                </p>
              </div>
            </div>

            {/* Right: The Primary Options (Showcase / Live Demo & Get in Touch) */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Option 1: Live Demo / Design Showcase */}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="picture-action-primary-btn"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 transition-all shadow-md shadow-amber-400/20 hover:shadow-lg hover:shadow-amber-400/30 cursor-pointer group"
                >
                  {isGraphics ? <Palette className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span>{isGraphics ? 'View Design Showcase' : 'Live Demo'}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onOpenContact}
                  id="picture-action-request-btn"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  {isGraphics ? <Palette className="w-4 h-4 text-amber-500" /> : <Globe className="w-4 h-4 text-amber-500" />}
                  <span>{isGraphics ? 'Request Assets' : 'Request Demo'}</span>
                </button>
              )}

              {/* Option 2: Get in Touch */}
              <button
                type="button"
                onClick={onOpenContact}
                id="picture-action-get-in-touch"
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  darkMode
                    ? 'bg-stone-800/90 hover:bg-stone-800 text-stone-200 border-stone-700 hover:border-amber-400/60 hover:text-amber-300'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs hover:border-amber-400 hover:text-amber-600'
                }`}
              >
                <Mail className="w-4 h-4 text-amber-500" />
                <span>Get in Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Only show GitHub Code Link if it's a Website and URL exists */}
              {!isGraphics && project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Source Code"
                  className={`hidden sm:inline-flex items-center justify-center p-2.5 rounded-xl border transition-colors ${
                    darkMode
                      ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-amber-400 hover:text-white'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:text-stone-950 shadow-2xs'
                  }`}
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Case Study Layout */}
        <section className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Overview Section */}
            {(project.detailedDescription || project.fullDetails?.overview) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-amber-400 rounded-full" />
                  <h2 className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400">
                    {isGraphics ? 'CREATIVE STRATEGY & CONCEPT' : 'PROJECT ARCHITECTURE & VISION'}
                  </h2>
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {isGraphics ? 'The Visual Identity Story' : 'The System Architecture'}
                </h3>
                <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                  {project.detailedDescription || project.fullDetails?.overview}
                </p>
              </div>
            )}

            {/* Deliverables Section */}
            {activeDeliverables.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-amber-400 rounded-full" />
                  <h2 className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400">
                    {isGraphics ? 'DESIGN DELIVERABLES & ASSETS' : 'TECHNICAL MILESTONES & FEATURES'}
                  </h2>
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {isGraphics ? 'Output Assets & Formats' : 'Engineered Features'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {activeDeliverables.map((item, idx) => (
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
                    {isGraphics ? 'CLIENT BRAND IMPACT' : 'KEY OUTCOME & SYSTEM IMPACT'}
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold leading-snug tracking-tight">
                  "{project.fullDetails.results}"
                </p>
              </div>
            )}
          </div>

          {/* Right Spec & Tech / Design Tool Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Tools & Tech Stack */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
                darkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200/80 shadow-2xs'
              }`}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-4">
                {isGraphics ? 'Design Software & Tools' : 'Frameworks & Technologies'}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {activeTools.map((tool, idx) => (
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

              {/* Tags / Skills */}
              {project.tags && project.tags.length > 0 && (
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
              )}
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
                <h4 className="text-lg font-black tracking-tight">
                  {isGraphics ? 'Commission a Custom Design' : 'Need Something Similar?'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  {isGraphics
                    ? 'Let us collaborate on your brand identity, logo, social media visuals, or vector graphics.'
                    : 'Let us engineer your web application, SaaS dashboard, or responsive landing page.'}
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
