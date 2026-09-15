import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Loader2,
  Save,
  Check,
  Edit2,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ProfileData } from './types';
import { api } from './api';
import { triggerCvDownload } from '../../utils/cvDownloader';
import { CvPreviewModal } from '../CvPreviewModal';

function formatBytes(bytes?: number): string {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PersonalDetailsTabProps {
  profile: ProfileData | null;
  onRefresh: () => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export function PersonalDetailsTab({
  profile,
  onRefresh,
  showToast,
}: PersonalDetailsTabProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [about, setAbout] = useState('');

  // Social Media Links
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [behance, setBehance] = useState('');
  const [dribbble, setDribbble] = useState('');

  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CV / Resume Management State
  const [cvUploading, setCvUploading] = useState(false);
  const [cvDeleting, setCvDeleting] = useState(false);
  const [downloadingCv, setDownloadingCv] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [isCvDragging, setIsCvDragging] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || 'Noor');
      setEmail(profile.email || 'noor@example.com');
      setPhone(profile.phone || '+880 1712 345678');
      setLocation(profile.location || 'Dhaka, Bangladesh');
      setTitle(profile.title || 'Graphic Designer & Full-Stack Developer');
      setBio(profile.bio || '');
      setAbout(profile.about || '');

      setFacebook(profile.socialLinks?.facebook || 'https://facebook.com/noor');
      setTwitter(profile.socialLinks?.twitter || 'https://x.com/noor');
      setLinkedin(profile.socialLinks?.linkedin || 'https://linkedin.com/in/noor');
      setGithub(profile.socialLinks?.github || 'https://github.com/noor');
      setBehance(profile.socialLinks?.behance || 'https://behance.net/noor');
      setDribbble(profile.socialLinks?.dribbble || 'https://dribbble.com/noor');
    }
  }, [profile]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select an image file (PNG, JPG, WebP)');
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('success', 'Profile photo updated & stored in Firebase Storage');
      onRefresh();
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      showToast('error', err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCvUpload = async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('error', 'Please select a valid PDF file (.pdf format)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('error', 'PDF file size exceeds 20MB limit');
      return;
    }

    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);

      await api.post('/profile/cv', formData);
      showToast('success', 'CV PDF uploaded and saved successfully!');
      onRefresh();
      window.dispatchEvent(new CustomEvent('portfolio_data_changed'));
    } catch (err: any) {
      console.error('CV upload error:', err);
      showToast('error', err.response?.data?.error || 'Failed to upload CV');
    } finally {
      setCvUploading(false);
      if (cvFileInputRef.current) {
        cvFileInputRef.current.value = '';
      }
    }
  };

  const handleCvFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCvUpload(file);
  };

  const handleCvDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsCvDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCvUpload(file);
  };

  const handleCvDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to remove your current CV? Public visitors will not be able to download it until you upload a new PDF.'
      )
    ) {
      return;
    }

    setCvDeleting(true);
    try {
      await api.delete('/profile/cv');
      showToast('success', 'CV document removed successfully');
      onRefresh();
      window.dispatchEvent(new CustomEvent('portfolio_data_changed'));
    } catch (err: any) {
      console.error('CV delete error:', err);
      showToast('error', err.response?.data?.error || 'Failed to remove CV');
    } finally {
      setCvDeleting(false);
    }
  };

  const handleDownloadCv = async () => {
    if (downloadingCv) return;
    setDownloadingCv(true);
    try {
      const res = await triggerCvDownload(profile?.cvFileName || 'Noor_Resume_CV.pdf');
      if (res.success) {
        showToast('success', `CV downloaded: ${res.fileName}`);
      } else {
        showToast('error', res.error || 'Failed to download CV');
      }
    } finally {
      setDownloadingCv(false);
    }
  };

  const hasCv = Boolean(
    profile?.resumeUrl &&
    profile.resumeUrl !== '#' &&
    profile.resumeUrl.trim() !== ''
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/profile', {
        fullName,
        email,
        phone,
        location,
        title,
        bio,
        about,
        socialLinks: {
          facebook,
          twitter,
          linkedin,
          github,
          behance,
          dribbble,
        },
      });

      showToast('success', 'Personal details saved successfully');
      onRefresh();
    } catch (err: any) {
      console.error('Save profile error:', err);
      showToast('error', err.response?.data?.error || 'Failed to save personal details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Personal Details
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Update your personal information and social links.
        </p>
      </div>

      {/* Main White Details Form Container */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200/80 shadow-xs space-y-8"
      >
        {/* Profile Photo Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-stone-100">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-stone-200 bg-stone-100 shadow-sm relative">
              <img
                src={profile?.avatarUrl || '/file_00000000704c8230a66055ead8603089.png'}
                alt="Profile Avatar"
                className="w-full h-full object-cover object-top"
              />
              {avatarUploading && (
                <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>

            {/* Circular yellow edit icon badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
              title="Upload New Photo"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-sm font-bold text-stone-900">Profile Photo</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Recommended size: 400x400px (Max 8MB)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            <div className="mt-3.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {avatarUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>Change Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Curriculum Vitae (CV) & Resume Management Section */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-stone-900">
                    Curriculum Vitae (CV)
                  </h3>
                  {hasCv ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live & Downloadable</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-200/80 text-amber-900">
                      <AlertCircle className="w-3 h-3" />
                      <span>Not Uploaded Yet</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Upload your CV in PDF format. Visitors can download it with one click from your portfolio website.
                </p>
              </div>
            </div>
          </div>

          {/* Hidden File Input for PDF */}
          <input
            ref={cvFileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleCvFileInputChange}
            className="hidden"
          />

          {/* CV State Display & Upload Zone */}
          {hasCv ? (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/70 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-stone-900 truncate">
                        {profile?.cvFileName || 'Noor_Resume_CV.pdf'}
                      </p>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-rose-100 text-rose-700 border border-rose-200/60">
                        PDF
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                      {profile?.cvFileSize && (
                        <span className="font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          {formatBytes(profile.cvFileSize)}
                        </span>
                      )}
                      {profile?.cvUpdatedAt && (
                        <span>
                          Updated: {new Date(profile.cvUpdatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {/* In-Browser View / Preview */}
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
                    title="Preview CV in Browser"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Preview CV</span>
                  </button>

                  {/* Download / Test Button */}
                  <button
                    type="button"
                    onClick={handleDownloadCv}
                    disabled={downloadingCv}
                    className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                    title="Download / Test CV"
                  >
                    {downloadingCv ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-600" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-stone-600" />
                    )}
                    <span>{downloadingCv ? 'Downloading...' : 'Download'}</span>
                  </button>

                  {/* Replace Button */}
                  <button
                    type="button"
                    onClick={() => cvFileInputRef.current?.click()}
                    disabled={cvUploading || cvDeleting}
                    className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {cvUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload New</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={handleCvDelete}
                    disabled={cvUploading || cvDeleting}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-transparent hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                    title="Remove CV"
                  >
                    {cvDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Drop Area to replace seamlessly */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsCvDragging(true);
                }}
                onDragLeave={() => setIsCvDragging(false)}
                onDrop={handleCvDrop}
                onClick={() => cvFileInputRef.current?.click()}
                className={`border border-dashed rounded-xl py-2.5 px-4 text-center transition-all cursor-pointer flex items-center justify-center gap-2 text-xs ${
                  isCvDragging
                    ? 'border-amber-500 bg-amber-100/60 text-amber-900 font-semibold'
                    : 'border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-white text-stone-600'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-stone-400" />
                <span>Drag & drop a newer PDF file here to replace, or click to browse</span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsCvDragging(true);
              }}
              onDragLeave={() => setIsCvDragging(false)}
              onDrop={handleCvDrop}
              onClick={() => cvFileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center transition-all cursor-pointer ${
                isCvDragging
                  ? 'border-amber-500 bg-amber-100/60 scale-[1.01]'
                  : 'border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-50/30 shadow-2xs'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100/90 text-amber-800 mx-auto flex items-center justify-center mb-3.5 shadow-xs">
                {cvUploading ? (
                  <Loader2 className="w-7 h-7 animate-spin text-amber-600" />
                ) : (
                  <FileText className="w-7 h-7 text-amber-700" />
                )}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-stone-900">
                {cvUploading ? 'Uploading and saving your PDF...' : 'Upload your Curriculum Vitae (PDF)'}
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Drag and drop your PDF file here, or click to browse from your device. Standard PDF format up to 20MB.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={cvUploading}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Choose PDF File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Basic Information Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="noor@example.com"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1712 345678"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Facebook */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] lowercase">
                  f
                </span>
                <span>Facebook</span>
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* Twitter / X */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[10px]">
                  ✕
                </span>
                <span>Twitter / X</span>
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-sm bg-[#0A66C2] text-white flex items-center justify-center font-bold text-[9px]">
                  in
                </span>
                <span>LinkedIn</span>
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[9px]">
                  🐙
                </span>
                <span>GitHub</span>
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* Behance */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-sm bg-[#1769FF] text-white flex items-center justify-center font-bold text-[8px]">
                  Bē
                </span>
                <span>Behance</span>
              </label>
              <input
                type="url"
                value={behance}
                onChange={(e) => setBehance(e.target.value)}
                placeholder="https://behance.net/noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>

            {/* Dribbble */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#EA4C89] text-white flex items-center justify-center font-bold text-[9px]">
                  🏀
                </span>
                <span>Dribbble</span>
              </label>
              <input
                type="url"
                value={dribbble}
                onChange={(e) => setDribbble(e.target.value)}
                placeholder="https://dribbble.com/noor"
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action Button */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* In-App CV Preview Modal */}
      <CvPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        fileName={profile?.cvFileName}
      />
    </div>
  );
}
