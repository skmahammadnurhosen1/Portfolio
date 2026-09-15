import React, { useState, useRef } from 'react';
import { X, Upload, RotateCcw, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customPhotoUrl: string | null;
  onSavePhoto: (url: string | null) => void;
  darkMode: boolean;
}

export function PhotoUploaderModal({
  isOpen,
  onClose,
  customPhotoUrl,
  onSavePhoto,
  darkMode,
}: PhotoUploaderModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(customPhotoUrl);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    onSavePhoto(preview);
    onClose();
  };

  const handleReset = () => {
    setPreview(null);
    onSavePhoto(null);
    onClose();
  };

  return (
    <div
      id="photo-uploader-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="photo-uploader-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 transition-all ${
          darkMode
            ? 'bg-[#18181B] text-white border border-stone-800 shadow-2xl'
            : 'bg-[#FCFBF4] text-stone-900 border border-stone-200 shadow-2xl'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight">
          Customize Profile Picture
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Upload your portrait photo (with or without background cutout).
        </p>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
            dragActive
              ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-400/10'
              : darkMode
              ? 'border-stone-700 bg-stone-800/40 hover:border-amber-400/50'
              : 'border-stone-300 bg-white/60 hover:border-amber-400 shadow-xs'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {preview ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                Click or drag to change image
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-400/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold">
                Drop your photo here, or <span className="text-amber-500 underline">browse</span>
              </p>
              <p className="text-[11px] text-stone-400">
                Supports PNG, JPG, WEBP (transparent cutout recommended)
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!preview}
              className={`px-5 py-2 text-xs font-bold rounded-full transition shadow-xs cursor-pointer ${
                preview
                  ? 'bg-amber-400 hover:bg-amber-500 text-stone-950'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
              }`}
            >
              Apply Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
