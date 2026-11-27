import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Zap, Trophy, TrendingUp, ChevronRight } from 'lucide-react';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

export default function Features() {
  const prefersReducedMotion = useReducedMotion();

  const features = [
    {
      title: 'Practice & Improve',
      description: 'Solve coding problems across multiple difficulty levels.',
      icon: Code2,
      tag: 'Structured Paths'
    },
    {
      title: 'Real-Time Execution',
      description: 'Write, execute and debug your code.',
      icon: Zap,
      tag: 'Instant Feedback'
    },
    {
      title: 'Competitive Contests',
      description: 'Challenge yourself and compete with other developers.',
      icon: Trophy,
      tag: 'Live Arenas'
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your performance and improve your skills.',
      icon: TrendingUp,
      tag: 'Skill Analytics'
    }
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C4A5F5]">
            Engineered for Mastery
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Everything you need to{' '}
            <span className={SIGNATURE_GRADIENT_TEXT}>level up faster.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A1A1AA]">
            A distraction-free developer workflow crafted for algorithmic clarity, speed, and
            consistent growth.
          </p>
        </motion.div>

        {/* 4 Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={prefersReducedMotion ? {} : { y: -6 }}
                className="group relative rounded-2xl p-[1px] bg-white/10 hover:bg-gradient-to-br hover:from-[#F5D6AE]/60 hover:via-[#C4A5F5]/60 hover:to-[#7775EF]/60 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="relative h-full rounded-[15px] bg-[#14151C] p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
                  {/* Subtle Corner Radial Glow on Hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#7775EF]/0 group-hover:bg-[#7775EF]/15 blur-2xl transition-all duration-500"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#101116] text-[#C4A5F5] group-hover:scale-110 group-hover:border-[#C4A5F5]/40 group-hover:text-[#F5D6AE] transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#A1A1AA] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center text-xs font-medium text-[#A1A1AA] group-hover:text-white transition-colors">
                    <span>Explore workflow</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1 text-[#C4A5F5]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
