import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit3,
  Eye,
  Trash2,
  Upload,
  X,
  Loader2,
  ExternalLink,
  Github,
  AlertTriangle,
  ImageIcon,
  Palette,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectItem } from './types';
import { api } from './api';

interface ProjectsTabProps {
  projects: ProjectItem[];
  onRefresh: () => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

const GRAPHICS_TOOL_SUGGESTIONS = [
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Figma',
  'Canva',
  'Adobe InDesign',
  'Adobe XD',
  'Blender',
];

const GRAPHICS_DELIVERABLE_SUGGESTIONS = [
  'Vector Source (AI, EPS, SVG)',
  'High-Res PNG & JPEG',
  'Print-Ready PDF',
  'Brand Style Guidelines',
  'Social Media Kit',
  '3D Mockups',
];

const WEB_TECH_SUGGESTIONS = [
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'Express',
  'Firebase',
  'PostgreSQL',
];

export function ProjectsTab({ projects, onRefresh, showToast }: ProjectsTabProps) {
  const [filter, setFilter] = useState<'all' | 'website' | 'graphics' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'select-type' | 'form'>('select-type');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [projectType, setProjectType] = useState<'website' | 'graphics'>('website');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Web Development');
  const [designSubtype, setDesignSubtype] = useState('Branding & Identity');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [designToolsInput, setDesignToolsInput] = useState('');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [status, setStatus] = useState<'Live' | 'Draft'>('Live');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  // Direct Gallery File Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine if project is Graphics Design
  const isProjectGraphics = (p: ProjectItem) => {
    return (
      p.projectType === 'graphics' ||
      p.category === 'Graphics Design' ||
      p.category === 'Branding' ||
      p.category === 'UI/UX Design' ||
      p.category === 'Logo Design' ||
      p.category === 'Graphic Design'
    );
  };

  // Filter calculations
  const websiteProjects = projects.filter((p) => !isProjectGraphics(p));
  const graphicsProjects = projects.filter((p) => isProjectGraphics(p));
  const publishedProjects = projects.filter((p) => p.status === 'Live' || p.status === 'Published');
  const draftProjects = projects.filter((p) => p.status === 'Draft');

  const filteredProjects =
    filter === 'all'
      ? projects
      : filter === 'website'
      ? websiteProjects
      : filter === 'graphics'
      ? graphicsProjects
      : filter === 'published'
      ? publishedProjects
      : draftProjects;

  // Step 1: Open Add Modal -> Prompts User for Project Type
  const openAddModal = () => {
    setEditingProject(null);
    setModalStep('select-type'); // First prompt: Graphics or Website!
    setTitle('');
    setClient('');
    setYear(new Date().getFullYear().toString());
    setShortDescription('');
    setDetailedDescription('');
    setStatus('Live');
    setLiveUrl('');
    setGithubUrl('');
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  // Step 1 choice action -> Transition to tailored form
  const handleSelectProjectType = (type: 'website' | 'graphics') => {
    setProjectType(type);
    if (type === 'graphics') {
      setCategory('Graphics Design');
      setDesignSubtype('Branding & Identity');
      setDesignToolsInput('Adobe Photoshop, Adobe Illustrator, Figma');
      setDeliverablesInput('Vector Source (AI, EPS, SVG), High-Res PNG & JPEG, Print-Ready PDF');
    } else {
      setCategory('Web Development');
      setTechStackInput('React, TypeScript, Tailwind CSS');
    }
    setModalStep('form');
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    const isGraphics = isProjectGraphics(project);
    const pType: 'website' | 'graphics' = isGraphics ? 'graphics' : 'website';

    setProjectType(pType);
    setModalStep('form'); // Directly go to form for editing
    setTitle(project.title);
    setCategory(project.category || (isGraphics ? 'Graphics Design' : 'Web Development'));
    setDesignSubtype(project.designSubtype || project.category || 'Branding & Identity');
    setClient(project.client || '');
    setYear(project.year || '');
    setShortDescription(project.shortDescription || project.description || '');
    setDetailedDescription(project.detailedDescription || project.shortDescription || project.description || '');
    setTechStackInput((project.techStack || project.tags)?.join(', ') || '');
    setDesignToolsInput(
      (project.designTools && project.designTools.length > 0
        ? project.designTools
        : project.techStack || project.tags
      )?.join(', ') || 'Adobe Photoshop, Adobe Illustrator'
    );
    setDeliverablesInput(
      (project.deliverables && project.deliverables.length > 0
        ? project.deliverables
        : ['Vector Source (AI, EPS, SVG)', 'High-Res PNG & JPEG']
      ).join(', ')
    );
    setStatus(project.status === 'Draft' ? 'Draft' : 'Live');
    setLiveUrl(project.liveUrl || '');
    setGithubUrl(project.githubUrl || '');
    setImageFile(null);
    setImagePreview(project.imageUrl || project.image || '');
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImagePreview(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Quick suggestion tag toggle for inputs
  const toggleSuggestion = (
    item: string,
    currentVal: string,
    setVal: (v: string) => void
  ) => {
    const items = currentVal
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    if (items.includes(item)) {
      setVal(items.filter((i) => i !== item).join(', '));
    } else {
      setVal(items.length > 0 ? `${currentVal.trim().replace(/,+$/, '')}, ${item}` : item);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim()) {
      showToast('error', 'Title and short description are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('projectType', projectType);
      formData.append('title', title.trim());
      formData.append('client', client.trim());
      formData.append('year', year.trim());
      formData.append('shortDescription', shortDescription.trim());
      formData.append('detailedDescription', detailedDescription.trim() || shortDescription.trim());
      formData.append('status', status);

      if (projectType === 'graphics') {
        // Graphics Design Specific Payload
        formData.append('category', 'Graphics Design');
        formData.append('designSubtype', designSubtype);
        formData.append('liveUrl', liveUrl.trim()); // Behance / Figma / Showcase
        formData.append('githubUrl', ''); // Graphics projects don't have GitHub repos

        const toolsArray = designToolsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        formData.append('designTools', JSON.stringify(toolsArray));
        formData.append('techStack', JSON.stringify(toolsArray)); // Backwards compatibility

        const deliverablesArray = deliverablesInput
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean);
        formData.append('deliverables', JSON.stringify(deliverablesArray));
      } else {
        // Website Specific Payload
        formData.append('category', category);
        formData.append('liveUrl', liveUrl.trim());
        formData.append('githubUrl', githubUrl.trim());

        const techArray = techStackInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        formData.append('techStack', JSON.stringify(techArray));
        formData.append(
          'deliverables',
          JSON.stringify(['Responsive Architecture', 'Clean Production Code', 'Modern User Experience'])
        );
      }

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (editingProject) {
        formData.append('imageUrl', editingProject.imageUrl);
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData);
        showToast('success', `${projectType === 'graphics' ? 'Graphics design' : 'Website'} project updated successfully`);
      } else {
        await api.post('/projects', formData);
        showToast('success', `${projectType === 'graphics' ? 'Graphics design' : 'Website'} project created successfully`);
      }

      setIsModalOpen(false);
      onRefresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio_data_changed'));
      }
    } catch (err: any) {
      console.error('Save project error:', err);
      showToast('error', err.response?.data?.error || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await api.delete(`/projects/${deleteTarget.id}`);
      showToast('success', 'Project and storage image removed permanently');
      setDeleteTarget(null);
      onRefresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio_data_changed'));
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('error', err.response?.data?.error || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Projects Manager
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage your Website &amp; Graphics Design projects with tailored information.
          </p>
        </div>

        <button
          onClick={openAddModal}
          id="btn-add-new-project"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/60 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setFilter('website')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'website'
              ? 'bg-amber-400 text-stone-950 shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Websites ({websiteProjects.length})</span>
        </button>
        <button
          onClick={() => setFilter('graphics')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'graphics'
              ? 'bg-amber-400 text-stone-950 shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Graphics Design ({graphicsProjects.length})</span>
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'published'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Published ({publishedProjects.length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'draft'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Draft ({draftProjects.length})
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProjects.map((project) => {
          const isGraphics = isProjectGraphics(project);
          return (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Project Image Box with Live/Draft Badge */}
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                  <img
                    src={project.imageUrl || '/file_00000000704c8230a66055ead8603089.png'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md ${
                        project.status === 'Draft'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-emerald-500/90 text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {project.status || 'Live'}
                    </span>
                  </div>

                  {/* Project Type Badge (Graphics vs Website) */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 backdrop-blur-md ${
                        isGraphics
                          ? 'bg-stone-950/80 text-amber-300 border border-amber-400/30'
                          : 'bg-stone-950/80 text-white border border-white/20'
                      }`}
                    >
                      {isGraphics ? <Palette className="w-3 h-3 text-amber-400" /> : <Globe className="w-3 h-3 text-emerald-400" />}
                      <span>{isGraphics ? 'Graphics Design' : 'Website'}</span>
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                      {project.designSubtype || project.category || (isGraphics ? 'Branding' : 'Web Development')}
                    </span>
                    {project.year && (
                      <span className="text-[10px] font-medium text-stone-500">
                        {project.year}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Tech Stack / Design Tools Tags */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack.slice(0, 3).map((tool, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] font-medium text-stone-400 self-center">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Buttons: Edit | View | Delete */}
              <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between text-xs">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-stone-950 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    if (project.liveUrl) {
                      window.open(project.liveUrl, '_blank');
                    } else {
                      openEditModal(project);
                    }
                  }}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-stone-950 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{project.liveUrl ? (isGraphics ? 'View Design' : 'Live Demo') : 'Preview'}</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(project)}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No projects found</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {filter !== 'all'
              ? `There are no ${filter} projects currently.`
              : 'Add your first project to showcase it in your portfolio.'}
          </p>
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
            >
              {/* STEP 1: PROMPT USER: IS THIS GRAPHICS DESIGN OR WEBSITE? */}
              {modalStep === 'select-type' && !editingProject && (
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        Step 1 of 2
                      </span>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center my-6">
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                      এটা কি গ্রাফিক্স ডিজাইন নাকি ওয়েবসাইট?
                    </h2>
                    <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                      Please choose your project category. The system will customize the required fields and specifications accordingly.
                    </p>
                  </div>

                  {/* Two Prominent Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-6">
                    {/* Option 1: Graphics Design */}
                    <button
                      type="button"
                      id="choose-graphics-design"
                      onClick={() => handleSelectProjectType('graphics')}
                      className="p-6 rounded-2xl border-2 border-stone-200 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/40 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md group cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-13 h-13 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                          <Palette className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 mb-1.5">
                          Visual &amp; Artwork
                        </span>
                        <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                          গ্রাফিক্স ডিজাইন (Graphics Design)
                        </h3>
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                          লোগো, ব্র্যান্ডিং, পোস্টার, ব্যানার, সোশাল মিডিয়া কিট, ভেক্টর আর্টওয়ার্ক ও UI/UX সম্পদ।
                        </p>
                      </div>

                      <div className="mt-6 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-bold text-amber-600">
                        <span>Select Graphics Design</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    {/* Option 2: Website */}
                    <button
                      type="button"
                      id="choose-website"
                      onClick={() => handleSelectProjectType('website')}
                      className="p-6 rounded-2xl border-2 border-stone-200 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/40 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md group cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-13 h-13 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                          <Globe className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-200 text-stone-800 mb-1.5">
                          Code &amp; Deployment
                        </span>
                        <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                          ওয়েবসাইট (Website / Web Dev)
                        </h3>
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                          ওয়েব অ্যাপ্লিকেশন, ফুল স্ট্যাক সিস্টেম, ক্লায়েন্ট ওয়েবসাইট, পোর্টফোলিও ও ল্যান্ডিং পেজ।
                        </p>
                      </div>

                      <div className="mt-6 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-bold text-amber-600">
                        <span>Select Website</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TAILORED FORM BASED ON USER SELECTION */}
              {(modalStep === 'form' || editingProject) && (
                <>
                  {/* Modal Header with Type Switcher */}
                  <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!editingProject && (
                        <button
                          type="button"
                          onClick={() => setModalStep('select-type')}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Back to project type selection"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-stone-900">
                            {editingProject
                              ? `Edit ${projectType === 'graphics' ? 'Graphics Design' : 'Website'} Project`
                              : `New ${projectType === 'graphics' ? 'Graphics Design' : 'Website'} Project`}
                          </h2>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              projectType === 'graphics'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-900 text-amber-400'
                            }`}
                          >
                            {projectType === 'graphics' ? <Palette className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                            <span>{projectType === 'graphics' ? 'Graphics Design' : 'Website'}</span>
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {projectType === 'graphics'
                            ? 'Specify design software, deliverables, and Behance/Figma link.'
                            : 'Specify web frameworks, Live Demo URL, and GitHub repository.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Type Toggle Pills for quick change */}
                      <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setProjectType('graphics')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            projectType === 'graphics'
                              ? 'bg-white text-stone-900 shadow-2xs'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          <Palette className="w-3 h-3" />
                          <span>Graphics</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectType('website')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            projectType === 'website'
                              ? 'bg-white text-stone-900 shadow-2xs'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          <span>Website</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
                    {/* DIRECT GALLERY IMAGE SELECTION ZONE */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        {projectType === 'graphics'
                          ? 'Design Artwork / Cover Showcase (Direct Gallery Selection)'
                          : 'Website Screenshot / Mockup (Direct Gallery Selection)'}
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-2xl p-4 cursor-pointer transition-colors bg-stone-50/50 hover:bg-amber-50/30 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden"
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-stone-100">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                              <Upload className="w-4 h-4" />
                              <span>Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                              <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-stone-800">
                              Click to select from device / gallery
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              PNG, JPG, WebP up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder={
                            projectType === 'graphics'
                              ? 'e.g. Minimalist Coffee Brand Identity'
                              : 'e.g. Modern SaaS Analytics Dashboard'
                          }
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'Live' | 'Draft')}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden cursor-pointer"
                        >
                          <option value="Live">Live / Published</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    {/* Category Selection Based on Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          {projectType === 'graphics' ? 'Design Subtype *' : 'Web Category *'}
                        </label>
                        {projectType === 'graphics' ? (
                          <select
                            value={designSubtype}
                            onChange={(e) => setDesignSubtype(e.target.value)}
                            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden cursor-pointer"
                          >
                            <option value="Branding & Identity">Branding &amp; Identity</option>
                            <option value="Logo Design">Logo Design</option>
                            <option value="Social Media & Banner">Social Media &amp; Banner</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Packaging & Print">Packaging &amp; Print</option>
                            <option value="Vector Illustration">Vector Illustration</option>
                          </select>
                        ) : (
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden cursor-pointer"
                          >
                            <option value="Web Development">Web Development</option>
                            <option value="Full Stack Application">Full Stack Application</option>
                            <option value="Frontend Development">Frontend Development</option>
                            <option value="E-Commerce Platform">E-Commerce Platform</option>
                            <option value="Portfolio & Landing Page">Portfolio &amp; Landing Page</option>
                          </select>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Client / Brand
                        </label>
                        <input
                          type="text"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          placeholder="e.g. Aura Studio / Global Corp"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Year
                        </label>
                        <input
                          type="text"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="e.g. 2025"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        Short Summary * (Displayed on public cards)
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder={
                          projectType === 'graphics'
                            ? 'Brief visual concept, brand identity essence, or creative deliverable summary...'
                            : 'Brief 1-2 sentence overview of the web application and its core purpose...'
                        }
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden resize-none"
                      />
                    </div>

                    {/* TYPE SPECIFIC INPUT 1: TOOLS VS TECH STACK */}
                    {projectType === 'graphics' ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                            Design Software &amp; Tools Used
                          </label>
                          <span className="text-[11px] text-stone-400">Click pills to add/toggle</span>
                        </div>
                        <input
                          type="text"
                          value={designToolsInput}
                          onChange={(e) => setDesignToolsInput(e.target.value)}
                          placeholder="Adobe Photoshop, Adobe Illustrator, Figma"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden"
                        />
                        {/* Suggestion Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {GRAPHICS_TOOL_SUGGESTIONS.map((tool) => {
                            const isSelected = designToolsInput.includes(tool);
                            return (
                              <button
                                key={tool}
                                type="button"
                                onClick={() =>
                                  toggleSuggestion(tool, designToolsInput, setDesignToolsInput)
                                }
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-amber-400 text-stone-950 border-amber-500'
                                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                <span>{tool}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                            Tech Stack &amp; Frameworks
                          </label>
                          <span className="text-[11px] text-stone-400">Click pills to add/toggle</span>
                        </div>
                        <input
                          type="text"
                          value={techStackInput}
                          onChange={(e) => setTechStackInput(e.target.value)}
                          placeholder="React, TypeScript, Tailwind CSS, Node.js"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden"
                        />
                        {/* Suggestion Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {WEB_TECH_SUGGESTIONS.map((tech) => {
                            const isSelected = techStackInput.includes(tech);
                            return (
                              <button
                                key={tech}
                                type="button"
                                onClick={() =>
                                  toggleSuggestion(tech, techStackInput, setTechStackInput)
                                }
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-amber-400 text-stone-950 border-amber-500'
                                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                <span>{tech}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE SPECIFIC INPUT 2: GRAPHICS DELIVERABLES */}
                    {projectType === 'graphics' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                            Design Deliverables &amp; Output Assets
                          </label>
                          <span className="text-[11px] text-stone-400">Click pills to add</span>
                        </div>
                        <input
                          type="text"
                          value={deliverablesInput}
                          onChange={(e) => setDeliverablesInput(e.target.value)}
                          placeholder="Vector Source (AI, EPS, SVG), High-Res PNG, Print-Ready PDF"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden"
                        />
                        {/* Suggestion Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {GRAPHICS_DELIVERABLE_SUGGESTIONS.map((del) => {
                            const isSelected = deliverablesInput.includes(del);
                            return (
                              <button
                                key={del}
                                type="button"
                                onClick={() =>
                                  toggleSuggestion(del, deliverablesInput, setDeliverablesInput)
                                }
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-amber-400 text-stone-950 border-amber-500'
                                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                <span>{del}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE SPECIFIC INPUT 3: LINKS (LIVE URL VS BEHANCE / GITHUB) */}
                    {projectType === 'graphics' ? (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Behance / Dribbble / Figma Showcase Link
                        </label>
                        <div className="relative">
                          <Palette className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                          <input
                            type="url"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            placeholder="https://behance.net/gallery/... or https://figma.com/file/..."
                            className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden"
                          />
                        </div>
                        <p className="text-[11px] text-stone-400">
                          (Graphics projects show this direct design showcase link instead of code repositories).
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                            Live Website Demo URL
                          </label>
                          <div className="relative">
                            <ExternalLink className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                            <input
                              type="url"
                              value={liveUrl}
                              onChange={(e) => setLiveUrl(e.target.value)}
                              placeholder="https://myproject.com"
                              className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                            GitHub Repository URL
                          </label>
                          <div className="relative">
                            <Github className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                            <input
                              type="url"
                              value={githubUrl}
                              onChange={(e) => setGithubUrl(e.target.value)}
                              placeholder="https://github.com/username/repo"
                              className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Case Study / Description */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        {projectType === 'graphics'
                          ? 'Creative Direction & Design Story (Full Case Study)'
                          : 'Architecture & Technical Case Study'}
                      </label>
                      <textarea
                        rows={3}
                        value={detailedDescription}
                        onChange={(e) => setDetailedDescription(e.target.value)}
                        placeholder={
                          projectType === 'graphics'
                            ? 'Explain the design concept, typography pairing, color choices, and aesthetic impact on the brand...'
                            : 'Detail system architecture, performance, APIs integrated, and technical milestones...'
                        }
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-amber-400 outline-hidden resize-none"
                      />
                    </div>

                    {/* Form Buttons */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                        className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>
                            {editingProject
                              ? 'Save Changes'
                              : projectType === 'graphics'
                              ? 'Publish Graphics Design'
                              : 'Publish Website'}
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION POPUP */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-stone-200 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Delete Project?</h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-stone-900">&quot;{deleteTarget.title}&quot;</span>?
                This action will permanently remove the Firestore document and the physical image stored in Firebase Storage.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete Permanently</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
