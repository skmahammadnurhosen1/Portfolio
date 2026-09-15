import React, { useState } from 'react';
import { X, Send, Copy, Check, Mail, Phone, MessageSquare, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function ContactModal({ isOpen, onClose, darkMode }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Graphic Design',
    message: '',
  });

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('hello@noor.dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleReset = () => {
    setFormSubmitted(false);
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
                onClick={handleCopyEmail}
                className="font-semibold text-amber-600 dark:text-amber-400 underline decoration-amber-300 hover:text-amber-500 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>hello@noor.dev</span>
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

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="mailto:hello@noor.dev"
                  className="text-xs text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-300 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Mail App</span>
                </a>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-sm flex items-center gap-2 transition shadow-sm cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
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
