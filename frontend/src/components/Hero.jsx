import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

export default function Hero({ onOpenModal, children }) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scrollToEditor = () => {
    const el = document.querySelector('#editor');
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle Architectural Grid Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000_65%,transparent_100%)]"
      />

      {/* Animated Ambient Radial Gradient Orbs */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.5, 0.35]
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[420px] w-[780px] rounded-full bg-gradient-to-tr from-[#7775EF]/30 via-[#C4A5F5]/20 to-[#F5D6AE]/15 blur-[120px]"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-4xl text-center"
      >
        {/* Top Badge */}
        <motion.div variants={itemVariants} className="inline-flex justify-center mb-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#14151C]/90 px-4 py-1.5 backdrop-blur-md shadow-[0_0_24px_rgba(119,117,239,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5D6AE]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#C4A5F5]">
              THE NEXT GENERATION OF CODING
            </span>
          </div>
        </motion.div>

        {/* Staggered Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-[68px] font-bold tracking-[-0.03em] text-white leading-[1.08]"
        >
          Where developers
          <span className={`block mt-1.5 pb-1 ${SIGNATURE_GRADIENT_TEXT}`}>
            compete, collaborate &amp; conquer.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#A1A1AA] leading-relaxed font-normal"
        >
          Sharpen your problem-solving skills, challenge your limits, and grow alongside a
          community of passionate developers.
        </motion.p>

        {/* Dual CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            onClick={() => window.location.assign('/dashboard')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm sm:text-base font-semibold text-[#08090D] shadow-[0_0_35px_rgba(196,165,245,0.35)] hover:shadow-[0_0_45px_rgba(245,214,174,0.5)] transition-all"
          >
            <span>Start Coding</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            onClick={scrollToEditor}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#14151C]/80 hover:bg-[#14151C] hover:border-white/20 px-7 py-3.5 text-sm sm:text-base font-medium text-white backdrop-blur-md transition-all"
          >
            <span>Explore Problems</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Centerpiece Code Editor Showcase Slot */}
      {children}
    </section>
  );
}
