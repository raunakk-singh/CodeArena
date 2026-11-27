import React from 'react';
import { Mail, Globe } from 'lucide-react';
import CodeArenaLogo from './CodeArenaLogo';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="border-t border-white/10 bg-[#08090D] py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <a href="#home" className="inline-flex items-center gap-2.5">
              <CodeArenaLogo className="w-7 h-7" />
              <span className="text-lg font-semibold tracking-tight text-white">
                Code<span className={SIGNATURE_GRADIENT_TEXT}>Arena</span>
              </span>
            </a>
            <p className="max-w-sm text-sm text-[#A1A1AA] leading-relaxed">
              Competitive programming and collaborative coding practice engineered for modern
              developers.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <a href="#editor" className="hover:text-white transition-colors">
                  Problems
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Contests
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <a href="#editor" className="hover:text-white transition-colors">
                  C++20 Docs
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Complexity Guide
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Discuss
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Connect</h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#C4A5F5]">
                    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.67 2.18 3.1 1.67.1-.73.4-1.23.7-1.51-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.1-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.16 1.77 1.16 2.99 0 4.29-2.61 5.23-5.1 5.51.4.34.76 1.02.76 2.06V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9Z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onOpenModal({
                      title: 'Contact CodeArena',
                      subtitle: 'Have feedback or partnership inquiries? Drop us a note below.',
                      mode: 'contact'
                    })
                  }
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#F5D6AE]" />
                  <span>Contact</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} CodeArena. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-[#A1A1AA]">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              All execution nodes operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
