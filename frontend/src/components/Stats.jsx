import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { SIGNATURE_GRADIENT_TEXT } from '../constants/styles';

function AnimatedCounter({ value, suffix = '', inView }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let start = null;
    const duration = 1500;
    let rafId;

    const tick = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, inView, prefersReducedMotion]);

  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

/**
 * 4. PLATFORM STATISTICS SECTION (Configurable Metrics)
 */
const PLATFORM_METRICS = [
  {
    id: 'problems',
    numericValue: 500,
    suffix: '+',
    label: 'Coding Problems',
    sublabel: 'Curated algorithmic sets'
  },
  {
    id: 'topics',
    numericValue: 20,
    suffix: '+',
    label: 'Topics',
    sublabel: 'Graphs, DP, Trees & more'
  },
  {
    id: 'difficulty',
    textValue: 'Multiple',
    label: 'Difficulty Levels',
    sublabel: 'Easy, Medium & Hard tracks'
  },
  {
    id: 'execution',
    textValue: 'Real-Time',
    label: 'Code Execution',
    sublabel: 'Isolated multi-language sandboxes'
  }
];

export default function Stats({ metrics = PLATFORM_METRICS }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      aria-label="Platform Capabilities"
      className="relative border-y border-white/10 bg-[#101116]/60 py-14 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.id}
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center lg:px-6"
            >
              <div className={`text-3xl sm:text-4xl font-bold tracking-tight ${SIGNATURE_GRADIENT_TEXT}`}>
                {typeof metric.numericValue === 'number' ? (
                  <AnimatedCounter
                    value={metric.numericValue}
                    suffix={metric.suffix}
                    inView={isInView}
                  />
                ) : (
                  metric.textValue
                )}
              </div>
              <div className="mt-2 text-sm sm:text-base font-semibold text-white">
                {metric.label}
              </div>
              <div className="mt-1 text-xs text-[#A1A1AA]">{metric.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
