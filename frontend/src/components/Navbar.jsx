import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import CodeArenaLogo from './CodeArenaLogo';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

export default function Navbar({ onOpenModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 24);
  });

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Problems', href: '/#problems' },
    { label: 'Features', href: '#features' }
  ];

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);

    if (!href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <motion.header
      initial={prefersReducedMotion ? { opacity: 1 } : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090D]/80 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <CodeArenaLogo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
          <span className="text-lg font-semibold tracking-tight text-white">
            Code<span className={SIGNATURE_GRADIENT_TEXT}>Arena</span>
          </span>
        </a>

        {/* Center: Desktop Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors duration-200 py-1 group"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left bg-gradient-to-r from-[#F5D6AE] via-[#C4A5F5] to-[#7775EF]" />
            </a>
          ))}
        </nav>

        {/* Right: Auth / CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() =>
              onOpenModal({
                title: 'Welcome back to CodeArena',
                subtitle: 'Sign in to sync your problem streaks, contest ratings, and rooms.',
                mode: 'login'
              })
            }
            className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors px-3 py-2"
          >
            Log in
          </button>
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={() =>
              onOpenModal({
                title: 'Create your CodeArena account',
                subtitle: 'Start solving algorithmic challenges in an instant cloud sandbox.',
                mode: 'signup'
              })
            }
            className="relative inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#08090D] shadow-[0_0_25px_rgba(196,165,245,0.28)] hover:shadow-[0_0_32px_rgba(196,165,245,0.45)] transition-shadow"
          >
            <span>Get Started</span>
          </motion.button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle Menu"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#14151C] p-2 text-white hover:bg-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b border-white/10 bg-[#101116]/95 backdrop-blur-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-[#A1A1AA] hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenModal({
                      title: 'Welcome back to CodeArena',
                      subtitle: 'Sign in to access your saved workspaces and contest history.',
                      mode: 'login'
                    });
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#14151C] py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenModal({
                      title: 'Create your CodeArena account',
                      subtitle: 'Join developers sharpening algorithms together in real time.',
                      mode: 'signup'
                    });
                  }}
                  className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-[#08090D] shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
