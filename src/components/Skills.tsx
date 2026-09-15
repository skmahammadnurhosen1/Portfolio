import React, { useState } from 'react';
import { motion } from 'motion/react';
import { skillsData } from '../data/portfolioData';
import { Skill } from '../types';
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
  ChatGptIcon,
  GeminiIcon,
  MidjourneyIcon,
  AntigravityIcon,
  CodexIcon,
  CursorIcon,
  VisualStudioIcon,
  ClaudeIcon,
} from './TechIcons';

interface SkillsProps {
  darkMode: boolean;
}

export function Skills({ darkMode }: SkillsProps) {
  const [isRow1Paused, setIsRow1Paused] = useState(false);
  const [isRow2Paused, setIsRow2Paused] = useState(false);

  // Row 1: Graphic Design & Artificial Intelligence
  const row1Skills: Skill[] = skillsData.filter((s) =>
    [
      'Graphic Design',
      'UI/UX Design',
      'AI Intelligence',
      'AI Architecture',
      'Multimodal AI',
      'Reasoning AI',
      'Generative Art',
    ].includes(s.category)
  );

  // Row 2: AI Code Editors, Modern IDEs, Web Frameworks, Languages, and Dev Tools
  const row2Skills: Skill[] = skillsData.filter((s) =>
    [
      'AI Code Editor',
      'Code Engine',
      'Development IDE',
      'Framework',
      'Language',
      'Styling',
      'Frontend',
      'Version Control',
      'Platform',
    ].includes(s.category)
  );

  // Repeated 3 times for seamless 33.333% infinite marquee loop
  const row1Items = [...row1Skills, ...row1Skills, ...row1Skills];
  const row2Items = [...row2Skills, ...row2Skills, ...row2Skills];

  const renderSkillIcon = (iconType: string) => {
    switch (iconType) {
      case 'coreldraw':
        return <CorelDrawIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'illustrator':
        return <IllustratorIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'photoshop':
        return <PhotoshopIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'figma':
        return <FigmaIcon className="w-5 h-7 sm:w-8 sm:h-10" />;
      case 'antigravity':
        return <AntigravityIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'chatgpt':
        return <ChatGptIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'gemini':
        return <GeminiIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'claude':
        return <ClaudeIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'midjourney':
        return <MidjourneyIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'cursor':
        return <CursorIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'codex':
        return <CodexIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'visualstudio':
        return <VisualStudioIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'react':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            className="w-7 h-7 sm:w-11 sm:h-11 flex items-center justify-center"
          >
            <ReactIcon className="w-7 h-7 sm:w-11 sm:h-11" />
          </motion.div>
        );
      case 'javascript':
        return <JsIcon className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg" />;
      case 'tailwind':
        return <TailwindIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'html':
        return <HtmlIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'css':
        return <CssIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'git':
        return <GitIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      case 'github':
        return <GithubIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
      default:
        return <ReactIcon className="w-7 h-7 sm:w-11 sm:h-11" />;
    }
  };

  const renderCard = (skill: Skill, idx: number, prefix: string) => (
    <div
      key={`${prefix}-${skill.name}-${idx}`}
      className={`group relative shrink-0 w-[112px] sm:w-[165px] h-[108px] sm:h-[155px] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 transition-all duration-300 cursor-pointer overflow-hidden border ${
        darkMode
          ? 'bg-[#18181B] border-stone-800/90 hover:border-amber-400/60 shadow-sm'
          : 'bg-white border-stone-200/90 shadow-xs hover:border-amber-400 hover:shadow-xl'
      }`}
      style={{
        boxShadow: darkMode
          ? `0 4px 20px -6px ${skill.color}25`
          : `0 4px 16px -6px ${skill.color}20`,
      }}
    >
      {/* Subtle Ambient Brand Glow on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl sm:rounded-2xl pointer-events-none"
        style={{ background: skill.color }}
      />

      {/* Authentic Brand Icon with Lift & Scale Animation */}
      <div className="relative z-10 w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-1">
        {renderSkillIcon(skill.iconType)}
      </div>

      {/* Skill Name & Category Subtitle */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <span
          className={`text-xs sm:text-sm font-bold tracking-tight transition-colors truncate max-w-[95px] sm:max-w-none ${
            darkMode
              ? 'text-stone-100 group-hover:text-amber-300'
              : 'text-stone-900 group-hover:text-amber-600'
          }`}
        >
          {skill.name}
        </span>
        <span className="text-[9px] sm:text-[10px] font-medium text-stone-400 dark:text-stone-500 mt-0.5 whitespace-nowrap">
          {skill.category}
        </span>
      </div>

      {/* Brand Color Accent Bar at Bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: skill.color }}
      />
    </div>
  );

  return (
    <section id="skills" className="py-16 md:py-24 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
      {/* Clean Section Header (No boxes, no tabs) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-10 md:mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-[3px] bg-amber-400 rounded-full inline-block" />
          <span className="text-xs uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400">
            MY SKILLS &amp; TOOLS
          </span>
        </div>
        <h2
          id="skills-headline"
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-[#18181B]'
          }`}
        >
          Technologies I Work With
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
          Comprehensive suite spanning professional graphic design, modern AI assistants, cutting-edge code editors, and full-stack web engineering.
        </p>
      </div>

      {/* CONTINUOUS HORIZONTAL CRAWL OF ALL ORIGINAL CARDS WITHOUT ANY OUTER BOX */}
      <div className="relative w-full overflow-hidden space-y-4 sm:space-y-6">
        {/* ROW 1: Continuous Crawl (Moving Left) */}
        <div
          className="flex overflow-hidden py-2"
          onMouseEnter={() => setIsRow1Paused(true)}
          onMouseLeave={() => setIsRow1Paused(false)}
        >
          <motion.div
            className="flex items-center gap-4 sm:gap-5 w-max"
            animate={{
              x: isRow1Paused ? undefined : ['0%', '-33.333%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 32,
              ease: 'linear',
            }}
          >
            {row1Items.map((skill, index) => renderCard(skill, index, 'r1'))}
          </motion.div>
        </div>

        {/* ROW 2: Continuous Crawl (Moving Right) */}
        <div
          className="flex overflow-hidden py-2"
          onMouseEnter={() => setIsRow2Paused(true)}
          onMouseLeave={() => setIsRow2Paused(false)}
        >
          <motion.div
            className="flex items-center gap-4 sm:gap-5 w-max"
            animate={{
              x: isRow2Paused ? undefined : ['-33.333%', '0%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: 'linear',
            }}
          >
            {row2Items.map((skill, index) => renderCard(skill, index, 'r2'))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
