import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

export default function FinalCTA({ onOpenModal }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Animated Ambient Radial Glow */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.48, 0.3]
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[720px] rounded-full bg-gradient-to-r from-[#F5D6AE]/20 via-[#C4A5F5]/25 to-[#7775EF]/30 blur-[120px]"
      />

      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#14151C]/80 backdrop-blur-xl px-6 py-14 sm:px-14 sm:py-20 text-center shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
      >
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
          Your next breakthrough starts with{' '}
          <span className={SIGNATURE_GRADIENT_TEXT}>one problem.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-[#A1A1AA]">
          Stop waiting. Start solving. Become a better developer.
        </p>

        <div className="mt-9 flex justify-center">
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={() =>
              onOpenModal({
                title: 'Enter CodeArena',
                subtitle: 'Your interactive workspace is ready. Pick a language to begin.',
                mode: 'sandbox'
              })
            }
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#08090D] shadow-[0_0_40px_rgba(196,165,245,0.38)] hover:shadow-[0_0_52px_rgba(245,214,174,0.55)] transition-all"
          >
            <span>Enter CodeArena</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
