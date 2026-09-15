import React, { useState } from 'react';
import { X, Send, Copy, Check, Mail, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  email?: string;
}

export function ContactModal({ isOpen, onClose, darkMode, email = 'skmahammadnurhosen1@gmail.com' }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Graphic Design',
    message: '',
  });

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.service,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit inquiry');
      }

      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormSubmitted(false);
    setErrorMsg(null);
    setFormData({
      name: '',
      email: '',
      service: 'Graphic Design',
      message: '',
    });
    onClose();
  };

  return (
    <div
      id="contact-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="contact-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 transition-all ${
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

        {!formSubmitted ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-[2.5px] bg-amber-400 rounded-full inline-block" />
              <span className="text-xs uppercase tracking-widest font-bold text-amber-500">
                GET IN TOUCH
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Let's build something together
            </h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
              Fill out the form below or reach out directly at{' '}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="font-semibold text-amber-600 dark:text-amber-400 underline decoration-amber-300 hover:text-amber-500 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{email}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </p>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors border focus:outline-hidden ${
                    darkMode
                      ? 'bg-stone-800/90 border-stone-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-200 text-stone-900 focus:border-amber-400 shadow-xs'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors border focus:outline-hidden ${
                    darkMode
                      ? 'bg-stone-800/90 border-stone-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-200 text-stone-900 focus:border-amber-400 shadow-xs'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  Service Interested In
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors border focus:outline-hidden ${
                    darkMode
                      ? 'bg-stone-800/90 border-stone-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-200 text-stone-900 focus:border-amber-400 shadow-xs'
                  }`}
                >
                  <option value="Graphic Design">Graphic Design &amp; Branding</option>
                  <option value="Web Development">Web Development &amp; Portfolio</option>
                  <option value="UI/UX Design">UI/UX &amp; Social Media Design</option>
                  <option value="Full Project">Full Brand &amp; Website Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  Project Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell me a bit about your project, goals, and timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors border focus:outline-hidden resize-none ${
                    darkMode
                      ? 'bg-stone-800/90 border-stone-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-200 text-stone-900 focus:border-amber-400 shadow-xs'
                  }`}
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`mailto:${email}`}
                  className="text-xs text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-300 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Mail App</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-stone-950 font-bold text-sm flex items-center gap-2 transition shadow-sm cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Success State */
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Message Received!</h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 max-w-sm">
              Thank you, <span className="font-semibold text-amber-500">{formData.name}</span>!
              I'll review your project requirements and reply within 24 hours.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-sm transition cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
