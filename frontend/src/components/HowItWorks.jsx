import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, Terminal, CheckCircle2 } from 'lucide-react';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

export default function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      number: '01',
      title: 'Choose a Problem',
      description: 'Explore problems based on your interests and skill level.',
      icon: Layers
    },
    {
      number: '02',
      title: 'Write Your Solution',
      description: 'Code in the integrated coding environment.',
      icon: Terminal
    },
    {
      number: '03',
      title: 'Submit & Improve',
      description: 'Run test cases, analyze results and improve your performance.',
      icon: CheckCircle2
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative border-t border-white/10 bg-[#101116]/50 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F5D6AE]">
            Seamless Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            From problem statement to{' '}
            <span className={SIGNATURE_GRADIENT_TEXT}>accepted solution.</span>
          </h2>
        </motion.div>

        {/* Timeline Grid */}
        <div className="relative mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Desktop Horizontal Connecting Line */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-9 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-[#F5D6AE]/40 via-[#C4A5F5]/40 to-[#7775EF]/40"
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: idx * 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Number Pill */}
                <div className="relative z-10 flex h-18 w-18 items-center justify-center rounded-2xl border border-white/15 bg-[#14151C] px-5 py-3.5 shadow-[0_0_30px_rgba(119,117,239,0.2)]">
                  <span className={`font-mono text-lg font-bold ${SIGNATURE_GRADIENT_TEXT}`}>
                    {step.number}
                  </span>
                </div>

                {/* Step Card */}
                <div className="mt-6 w-full rounded-2xl border border-white/10 bg-[#14151C]/90 p-6 sm:p-7 hover:border-white/20 transition-colors">
                  <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-[#C4A5F5]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
