import React from 'react';
import { X, ShieldCheck, FileText, Cookie } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'cookies';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
  darkMode: boolean;
}

export function LegalModal({ type, onClose, darkMode }: LegalModalProps) {
  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'When you use our website or contact form, we only collect information you voluntarily provide, such as your name, email address, and project requirements. We never sell, rent, or trade your personal information.',
            },
            {
              heading: '2. How Information is Used',
              text: 'Your details are strictly used to respond to your project inquiries, deliver design & development services, communicate milestone updates, and prepare project proposals.',
            },
            {
              heading: '3. Data Security & Confidentiality',
              text: 'We maintain strict confidentiality regarding all client assets, brand assets, and proprietary project data. Non-disclosure agreements (NDAs) can be executed upon request prior to project kick-off.',
            },
            {
              heading: '4. Contact & Inquiries',
              text: 'If you have any questions about this Privacy Policy or your data, please contact skmahammadnurhosen1@gmail.com.',
            },
          ],
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText className="w-6 h-6 text-amber-500" />,
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Project Scope & Deliverables',
              text: 'All graphic design, branding, and web development deliverables are defined in advance through written project proposals and milestone agreements.',
            },
            {
              heading: '2. Intellectual Property Rights',
              text: 'Upon final settlement and project completion, full intellectual property and ownership rights of customized deliverables are transferred to the client.',
            },
            {
              heading: '3. Revisions & Collaboration',
              text: 'Each project package includes dedicated revision cycles to ensure deliverables align precisely with your creative vision and brand goals.',
            },
            {
              heading: '4. Payments & Invoicing',
              text: 'Standard milestones typically follow an initial deposit with balance payments upon milestone approval and final delivery.',
            },
          ],
        };
      case 'cookies':
        return {
          title: 'Cookie & Tracking Policy',
          icon: <Cookie className="w-6 h-6 text-amber-500" />,
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Essential Cookies Only',
              text: 'This website only uses essential local storage to remember your theme preference (Light / Dark Mode) and custom display settings. No invasive third-party tracking scripts are deployed.',
            },
            {
              heading: '2. Analytics & Performance',
              text: 'We respect your privacy and do not sell browsing data to third-party ad networks or brokers.',
            },
            {
              heading: '3. Managing Preferences',
              text: 'You can clear your local preferences anytime via your browser settings or using the theme toggle in the navigation bar.',
            },
          ],
        };
    }
  };

  const content = getContent();

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="legal-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 transition-all ${
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

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-400/15">{content.icon}</div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {content.title}
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Last updated: {content.updated}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-stone-200 dark:border-stone-800 pt-4">
          {content.sections.map((sec, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold text-amber-500 mb-1">
                {sec.heading}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {sec.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
