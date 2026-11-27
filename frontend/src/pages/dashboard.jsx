import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  BarChart3,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Flame,
  Target,
  Award,
  TrendingUp,
  Bookmark,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Loader2,
  Command,
  ArrowUpRight,
  Zap,
  Terminal,
  Calendar,
} from 'lucide-react';
import { getProblem, getProblems, getSubmissions } from '../services/auth.js';

// ============================================================================
// DESIGN TOKENS & MOTION CONSTANTS
// ============================================================================
const EASE_PREMIUM = [0.22, 1, 0.36, 1]; // Linear / Vercel-inspired smooth cubic-bezier
const EASE_SNAPPY = [0.25, 0.1, 0.25, 1];

// ============================================================================
// MOCK DATA & DETERMINISTIC HEATMAP GENERATOR
// ============================================================================
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'problems', label: 'Problems', icon: Code2, badge: 'New' },
  { id: 'contests', label: 'Contests', icon: Trophy },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'submissions', label: 'Submissions', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STATS_DATA = [
  {
    id: 'solved',
    label: 'Problems Solved',
    value: 248,
    suffix: '',
    prefix: '',
    delta: '+14 this week',
    progress: 74,
    targetLabel: '248 / 335 Goal',
    icon: CheckCircle2,
    accent: 'from-purple-500/20 to-violet-500/5',
  },
  {
    id: 'rank',
    label: 'Global Rank',
    value: 1420,
    suffix: '',
    prefix: '#',
    delta: 'Top 0.8%',
    progress: 88,
    targetLabel: 'Percentile 99.2%',
    icon: Trophy,
    accent: 'from-indigo-500/20 to-purple-500/5',
  },
  {
    id: 'streak',
    label: 'Current Streak',
    value: 18,
    suffix: ' days',
    prefix: '',
    delta: 'Best: 32 days',
    progress: 62,
    targetLabel: '12 days to badge',
    icon: Flame,
    accent: 'from-fuchsia-500/20 to-purple-500/5',
  },
  {
    id: 'rating',
    label: 'Contest Rating',
    value: 1894,
    suffix: '',
    prefix: '',
    delta: '+46 last contest',
    progress: 81,
    targetLabel: 'Knight Tier (1900)',
    icon: TrendingUp,
    accent: 'from-violet-500/20 to-indigo-500/5',
  },
];

const ANALYTICS_DATA = {
  '7D': {
    ratingTrend: [
      { label: 'Mon', rating: 1848, solved: 3 },
      { label: 'Tue', rating: 1854, solved: 4 },
      { label: 'Wed', rating: 1851, solved: 2 },
      { label: 'Thu', rating: 1868, solved: 5 },
      { label: 'Fri', rating: 1875, solved: 4 },
      { label: 'Sat', rating: 1886, solved: 6 },
      { label: 'Sun', rating: 1894, solved: 5 },
    ],
    topics: [
      { topic: 'DP', count: 14, max: 20 },
      { topic: 'Graphs', count: 11, max: 20 },
      { topic: 'Trees', count: 16, max: 20 },
      { topic: 'Arrays', count: 19, max: 20 },
      { topic: 'Greedy', count: 9, max: 20 },
      { topic: 'Binary', count: 12, max: 20 },
    ],
    difficulty: [
      { label: 'Easy', count: 112, color: '#34d399', total: 248 },
      { label: 'Medium', count: 104, color: '#a855f7', total: 248 },
      { label: 'Hard', count: 32, color: '#f43f5e', total: 248 },
    ],
  },
  '30D': {
    ratingTrend: [
      { label: 'W1', rating: 1790, solved: 18 },
      { label: 'W2', rating: 1815, solved: 22 },
      { label: 'W3', rating: 1842, solved: 27 },
      { label: 'W4', rating: 1860, solved: 24 },
      { label: 'W5', rating: 1879, solved: 31 },
      { label: 'W6', rating: 1894, solved: 29 },
    ],
    topics: [
      { topic: 'DP', count: 42, max: 60 },
      { topic: 'Graphs', count: 36, max: 60 },
      { topic: 'Trees', count: 48, max: 60 },
      { topic: 'Arrays', count: 55, max: 60 },
      { topic: 'Greedy', count: 29, max: 60 },
      { topic: 'Binary', count: 38, max: 60 },
    ],
    difficulty: [
      { label: 'Easy', count: 112, color: '#34d399', total: 248 },
      { label: 'Medium', count: 104, color: '#a855f7', total: 248 },
      { label: 'Hard', count: 32, color: '#f43f5e', total: 248 },
    ],
  },
  '90D': {
    ratingTrend: [
      { label: 'Aug', rating: 1680, solved: 54 },
      { label: 'Sep', rating: 1735, solved: 68 },
      { label: 'Oct', rating: 1810, solved: 79 },
      { label: 'Nov', rating: 1894, solved: 86 },
    ],
    topics: [
      { topic: 'DP', count: 78, max: 100 },
      { topic: 'Graphs', count: 64, max: 100 },
      { topic: 'Trees', count: 82, max: 100 },
      { topic: 'Arrays', count: 94, max: 100 },
      { topic: 'Greedy', count: 57, max: 100 },
      { topic: 'Binary', count: 71, max: 100 },
    ],
    difficulty: [
      { label: 'Easy', count: 112, color: '#34d399', total: 248 },
      { label: 'Medium', count: 104, color: '#a855f7', total: 248 },
      { label: 'Hard', count: 32, color: '#f43f5e', total: 248 },
    ],
  },
};

const RECENT_ACTIVITY = [
  {
    id: 'sub-1',
    problem: 'Longest Increasing Subsequence',
    code: 'LC-300',
    status: 'Accepted',
    runtime: '4 ms',
    percentile: 'Beats 96.4%',
    language: 'Rust',
    time: '18 mins ago',
  },
  {
    id: 'sub-2',
    problem: 'Word Ladder II',
    code: 'LC-126',
    status: 'Time Limit Exceeded',
    runtime: '2000 ms',
    percentile: 'BFS Optimization',
    language: 'C++20',
    time: '2 hours ago',
  },
  {
    id: 'sub-3',
    problem: 'Merge K Sorted Lists',
    code: 'LC-023',
    status: 'Accepted',
    runtime: '11 ms',
    percentile: 'Beats 91.2%',
    language: 'TypeScript',
    time: '5 hours ago',
  },
  {
    id: 'sub-4',
    problem: 'Trapping Rain Water',
    code: 'LC-042',
    status: 'Accepted',
    runtime: '0 ms',
    percentile: 'Beats 100%',
    language: 'Go',
    time: 'Yesterday',
  },
];

// Deterministic pseudo-random generator for consistent 20-week heatmap
function generateHeatmapWeeks(numWeeks = 22) {
  const weeks = [];
  const baseDate = new Date(2026, 10, 25); // Nov 25, 2026
  const totalDays = numWeeks * 7;

  for (let w = 0; w < numWeeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dayIndex = w * 7 + d;
      const offsetDays = totalDays - 1 - dayIndex;
      const cellDate = new Date(baseDate);
      cellDate.setDate(baseDate.getDate() - offsetDays);

      // Deterministic activity pattern
      const seed = (w * 17 + d * 31 + 13) % 29;
      let count = 0;
      if (seed > 24) count = 6;
      else if (seed > 19) count = 4;
      else if (seed > 13) count = 2;
      else if (seed > 8) count = 1;

      // Boost recent streak days
      if (offsetDays < 18) {
        count = Math.max(count, (offsetDays % 4) + 1);
      }

      const level =
        count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;

      days.push({
        id: `${w}-${d}`,
        dateStr: cellDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        count,
        level,
      });
    }
    weeks.push(days);
  }
  return weeks;
}

// ============================================================================
// REUSABLE PRIMITIVES & MICRO-INTERACTION COMPONENTS
// ============================================================================

/**
 * Smooth Count-Up Number Animation using Framer Motion spring/RAF
 */
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.1 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out curve for crisp deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums tracking-tight">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * Tactile Button Wrapper (Requirement G)
 * Hover scale-up, tap scale-down, border/background transitions
 */
function TactileButton({
  children,
  onClick,
  className = '',
  variant = 'secondary',
  loading = false,
  disabled = false,
  title,
  type = 'button',
}) {
  const variants = {
    primary:
      'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30 shadow-[0_0_20px_-5px_rgba(168,85,247,0.45)]',
    secondary:
      'bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-200 border border-zinc-800 hover:border-zinc-700',
    ghost:
      'bg-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100 border border-transparent',
  };

  return (
    <motion.button
      type={type}
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ duration: 0.16, ease: EASE_SNAPPY }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        </motion.span>
      )}
      {children}
    </motion.button>
  );
}

// ============================================================================
// SKELETON LOADERS (Requirement J)
// ============================================================================
function ShimmerBox({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-zinc-900/90 border border-zinc-800/60 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-zinc-700/15 to-transparent" />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Welcome Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5">
          <ShimmerBox className="h-7 w-64" />
          <ShimmerBox className="h-4 w-96 max-w-full" />
        </div>
        <ShimmerBox className="h-9 w-36" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4"
          >
            <div className="flex items-center justify-between">
              <ShimmerBox className="h-4 w-28" />
              <ShimmerBox className="h-8 w-8 rounded-lg" />
            </div>
            <ShimmerBox className="h-8 w-24" />
            <div className="space-y-2">
              <ShimmerBox className="h-1.5 w-full rounded-full" />
              <ShimmerBox className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap Skeleton */}
      <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <ShimmerBox className="h-5 w-44" />
          <ShimmerBox className="h-4 w-32" />
        </div>
        <ShimmerBox className="h-28 w-full" />
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <ShimmerBox className="h-5 w-36" />
          <ShimmerBox className="h-48 w-full" />
        </div>
        <div className="lg:col-span-4 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <ShimmerBox className="h-5 w-36" />
          <ShimmerBox className="h-48 w-full" />
        </div>
        <div className="lg:col-span-3 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <ShimmerBox className="h-5 w-28" />
          <ShimmerBox className="h-48 w-full" />
        </div>
      </div>

      {/* Bottom Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
          <ShimmerBox className="h-5 w-48 mb-2" />
          {[0, 1, 2, 3].map((i) => (
            <ShimmerBox key={i} className="h-14 w-full" />
          ))}
        </div>
        <div className="lg:col-span-5 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
          <ShimmerBox className="h-5 w-40 mb-2" />
          {[0, 1, 2, 3].map((i) => (
            <ShimmerBox key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// COLLAPSIBLE SIDEBAR (Requirement C)
// ============================================================================
function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: collapsed ? 76 : 248,
      }}
      transition={{
        x: { duration: 0.5, ease: EASE_PREMIUM },
        opacity: { duration: 0.45, ease: EASE_PREMIUM },
        width: { duration: 0.35, ease: EASE_PREMIUM },
      }}
      className="relative z-30 hidden md:flex flex-col h-screen sticky top-0 bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-800/80 select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800/70">
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shrink-0 shadow-[0_0_20px_-3px_rgba(168,85,247,0.55)] border border-purple-300/20"
          >
            <Terminal className="w-4 h-4 text-white" />
          </motion.div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: EASE_PREMIUM }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-1.5">
                  CodeArena
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25">
                    PRO
                  </span>
                </span>
                <span className="text-[11px] text-zinc-500">v2.4 · Competitive</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={() => setCollapsed((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </motion.button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 group ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {/* Shared Layout Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent border border-purple-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  />
                )}

                {/* Subtle Left Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveBar"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                  />
                )}

                {/* Hover Background */}
                {!isActive && isHovered && (
                  <motion.div
                    layoutId="sidebarHoverPill"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 rounded-xl bg-zinc-900/80"
                  />
                )}

                {/* Icon with subtle hover micro-response */}
                <motion.span
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered && !isActive ? -4 : 0,
                  }}
                  transition={{ duration: 0.18 }}
                  className={`relative z-10 flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'text-purple-400'
                      : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </motion.span>

                {/* Label */}
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, ease: EASE_PREMIUM }}
                      className="relative z-10 flex-1 text-left truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Optional Badge */}
                {!collapsed && item.badge && (
                  <span className="relative z-10 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Floating Tooltip when Sidebar is Collapsed */}
              <AnimatePresence>
                {collapsed && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -6, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: EASE_PREMIUM }}
                    className="fixed left-[84px] -mt-9 z-50 px-2.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-100 text-xs font-medium border border-zinc-700/80 shadow-xl pointer-events-none whitespace-nowrap"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile Card with Elegant Hover Effect */}
      <div className="p-3 border-t border-zinc-800/70">
        <motion.div
          whileHover={{ backgroundColor: 'rgba(24, 24, 27, 0.95)' }}
          transition={{ duration: 0.2 }}
          className="group relative flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-zinc-800 cursor-pointer overflow-hidden"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-violet-500 to-fuchsia-400 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-purple-200">
                AR
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-zinc-100 truncate group-hover:text-purple-200 transition-colors">
                  Alex Rivera
                </p>
                <p className="text-[11px] text-zinc-500 truncate">
                  Knight · 1,894 pts
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
}

// ============================================================================
// ANIMATED STAT CARD (Requirement B)
// ============================================================================
function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.12 + index * 0.09,
        ease: EASE_PREMIUM,
      }}
      whileHover={{ y: -3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl bg-zinc-950/90 border border-zinc-800/80 hover:border-purple-500/45 p-5 transition-colors duration-300 overflow-hidden shadow-[0_4px_24px_-12px_rgba(0,0,0,0.8)]"
    >
      {/* Subtle Purple Radial Spotlight on Hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute -inset-px bg-[radial-gradient(280px_circle_at_85%_15%,rgba(168,85,247,0.14),transparent_70%)]"
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {stat.label}
        </span>

        {/* Interactive Icon Container */}
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 6 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.accent} border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]`}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Count-Up Primary Metric */}
      <div className="relative z-10 flex items-baseline justify-between gap-2 mb-4">
        <div className="text-2xl sm:text-3xl font-bold text-zinc-50">
          <AnimatedCounter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            duration={1.15}
          />
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {stat.delta}
        </span>
      </div>

      {/* Animated Progress Bar */}
      <div className="relative z-10 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden border border-zinc-800/80">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stat.progress}%` }}
            transition={{
              duration: 0.95,
              delay: 0.25 + index * 0.09,
              ease: EASE_PREMIUM,
            }}
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>{stat.targetLabel}</span>
          <span className="text-zinc-400 font-medium">{stat.progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// ACTIVITY HEATMAP (Requirement D)
// ============================================================================
function ActivityHeatmap() {
  const weeks = useMemo(() => generateHeatmapWeeks(24), []);
  const [hoveredCell, setHoveredCell] = useState(null);

  const getLevelClasses = (level) => {
    switch (level) {
      case 0:
        return 'bg-zinc-900/90 border-zinc-800/80';
      case 1:
        return 'bg-purple-950/80 border-purple-800/50';
      case 2:
        return 'bg-purple-800/75 border-purple-600/50';
      case 3:
        return 'bg-purple-600/90 border-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.35)]';
      case 4:
        return 'bg-purple-400 border-purple-200/80 shadow-[0_0_12px_rgba(192,132,252,0.65)]';
      default:
        return 'bg-zinc-900 border-zinc-800';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.35, ease: EASE_PREMIUM }}
      className="relative rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Submission Activity
            </h2>
            <p className="text-xs text-zinc-500">
              412 submissions across the last 24 weeks
            </p>
          </div>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              className={`w-3 h-3 rounded-[3px] border ${getLevelClasses(lvl)}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="relative overflow-x-auto pb-1">
        <div className="inline-flex gap-1.5 min-w-full justify-between">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.28,
                    delay: 0.36 + wIdx * 0.012 + dIdx * 0.008,
                    ease: EASE_PREMIUM,
                  }}
                  whileHover={{
                    scale: 1.35,
                    zIndex: 20,
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCell({
                      ...day,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border cursor-pointer transition-colors duration-200 ${getLevelClasses(
                    day.level
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              left: hoveredCell.x,
              top: hoveredCell.y - 44,
              transform: 'translateX(-50%)',
            }}
            className="z-50 pointer-events-none px-2.5 py-1.5 rounded-lg bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 shadow-xl text-xs whitespace-nowrap"
          >
            <span className="font-semibold text-purple-300">
              {hoveredCell.count}{' '}
              {hoveredCell.count === 1 ? 'problem' : 'problems'}
            </span>{' '}
            <span className="text-zinc-400">on {hoveredCell.dateStr}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// ============================================================================
// ANALYTICS CHARTS SECTION (Requirement E)
// ============================================================================
function AnalyticsSection() {
  const [timeframe, setTimeframe] = useState('7D');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const currentData = ANALYTICS_DATA[timeframe];

  // Build SVG path coordinates for Rating Trend Line Chart
  const chartWidth = 420;
  const chartHeight = 165;
  const padX = 24;
  const padY = 22;

  const { linePath, areaPath, points } = useMemo(() => {
    const items = currentData.ratingTrend;
    const minVal = Math.min(...items.map((d) => d.rating)) - 15;
    const maxVal = Math.max(...items.map((d) => d.rating)) + 15;
    const range = Math.max(maxVal - minVal, 1);

    const pts = items.map((d, idx) => {
      const x =
        padX +
        (idx / Math.max(items.length - 1, 1)) * (chartWidth - padX * 2);
      const y =
        chartHeight -
        padY -
        ((d.rating - minVal) / range) * (chartHeight - padY * 2);
      return { ...d, x, y };
    });

    const dLine = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');

    const dArea = `${dLine} L ${pts[pts.length - 1].x.toFixed(1)} ${
      chartHeight - padY
    } L ${pts[0].x.toFixed(1)} ${chartHeight - padY} Z`;

    return { linePath: dLine, areaPath: dArea, points: pts };
  }, [currentData]);

  // Donut Chart geometry
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.42, ease: EASE_PREMIUM }}
      className="space-y-4"
    >
      {/* Section Header + Timeframe Pill Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            Performance Analytics
          </h2>
          <p className="text-xs text-zinc-500">
            Rating progression, topic mastery, and difficulty split
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800/90">
          {['7D', '30D', '90D'].map((tf) => {
            const active = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => {
                  setHoveredPoint(null);
                  setTimeframe(tf);
                }}
                className={`relative px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  active
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="analyticsTimeframePill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-purple-600/30 border border-purple-500/40"
                  />
                )}
                <span className="relative z-10">{tf}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Progressive Line Chart (Rating Trajectory) */}
        <div className="lg:col-span-5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">
                Rating Trajectory
              </h3>
              <p className="text-xs text-zinc-500">
                Peak: 1,894 (+4.8% growth)
              </p>
            </div>
            {hoveredPoint ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-right"
              >
                <span className="text-xs font-semibold text-purple-300 block">
                  {hoveredPoint.rating} pts
                </span>
                <span className="text-[11px] text-zinc-500">
                  {hoveredPoint.label} · {hoveredPoint.solved} solved
                </span>
              </motion.div>
            ) : (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                +104 pts
              </span>
            )}
          </div>

          <div className="relative w-full h-44 mt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="ratingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid Lines */}
              {[0.25, 0.5, 0.75].map((ratio, idx) => (
                <line
                  key={idx}
                  x1={padX}
                  x2={chartWidth - padX}
                  y1={chartHeight * ratio}
                  y2={chartHeight * ratio}
                  stroke="#27272a"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill */}
              <motion.path
                key={`area-${timeframe}`}
                d={areaPath}
                fill="url(#ratingAreaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.65, ease: EASE_PREMIUM }}
              />

              {/* Progressive Line Path */}
              <motion.path
                key={`line-${timeframe}`}
                d={linePath}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.85, ease: EASE_PREMIUM }}
              />

              {/* Hover Vertical Crosshair */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  x2={hoveredPoint.x}
                  y1={padY - 6}
                  y2={chartHeight - padY}
                  stroke="#a855f7"
                  strokeOpacity="0.45"
                  strokeDasharray="2 2"
                />
              )}

              {/* Interactive Data Nodes */}
              {points.map((pt, idx) => {
                const isSelected = hoveredPoint?.label === pt.label;
                return (
                  <g
                    key={`${timeframe}-${pt.label}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                    <motion.circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 5.5 : 3.5}
                      fill={isSelected ? '#e9d5ff' : '#09090b'}
                      stroke="#a855f7"
                      strokeWidth={isSelected ? 3 : 2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.25 + idx * 0.06,
                        duration: 0.3,
                      }}
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      className="fill-zinc-500 text-[10px] font-medium"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 2. Animated Bar Chart (Problems by Topic) */}
        <div className="lg:col-span-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">
                Problems by Topic
              </h3>
              <p className="text-xs text-zinc-500">
                Algorithmic category distribution
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-44 flex items-end justify-between gap-2.5 pt-4 px-1">
            {currentData.topics.map((item, idx) => {
              const heightPct = Math.round((item.count / item.max) * 100);
              return (
                <div
                  key={`${timeframe}-${item.topic}`}
                  className="group flex-1 h-full flex flex-col items-center justify-end gap-2"
                >
                  <span className="text-[11px] font-medium text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[30px] h-28 rounded-t-md bg-zinc-900/90 border border-zinc-800/60 flex items-end overflow-hidden p-0.5">
                    <motion.div
                      key={`bar-${timeframe}-${item.topic}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{
                        duration: 0.65,
                        delay: 0.06 * idx,
                        ease: EASE_PREMIUM,
                      }}
                      className="w-full rounded-t-[4px] bg-gradient-to-t from-purple-700 via-purple-500 to-fuchsia-400 group-hover:brightness-110 transition-[filter]"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {item.topic}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Animated Donut Chart (Difficulty Breakdown) */}
        <div className="lg:col-span-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">
              Difficulty Split
            </h3>
            <p className="text-xs text-zinc-500">248 total solved</p>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#18181b"
                strokeWidth="12"
              />
              {currentData.difficulty.map((seg, idx) => {
                const pct = seg.count / seg.total;
                const dashArray = `${pct * circumference} ${circumference}`;
                const dashOffset = -accumulatedPercent * circumference;
                accumulatedPercent += pct;
                const isHovered = hoveredSegment === seg.label;

                return (
                  <motion.circle
                    key={`${timeframe}-${seg.label}`}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isHovered ? 14 : 11}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredSegment(seg.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.12 * idx,
                      ease: EASE_PREMIUM,
                    }}
                    className="cursor-pointer transition-all duration-200"
                  />
                );
              })}
            </svg>

            {/* Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-zinc-100 tabular-nums">
                {hoveredSegment
                  ? currentData.difficulty.find(
                      (d) => d.label === hoveredSegment
                    )?.count
                  : 248}
              </span>
              <span className="text-[11px] text-zinc-500">
                {hoveredSegment || 'Solved'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5">
            {currentData.difficulty.map((seg) => (
              <div
                key={seg.label}
                onMouseEnter={() => setHoveredSegment(seg.label)}
                onMouseLeave={() => setHoveredSegment(null)}
                className="flex items-center justify-between text-xs cursor-pointer rounded px-1.5 py-0.5 hover:bg-zinc-900/80 transition-colors"
              >
                <span className="flex items-center gap-2 text-zinc-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  {seg.label}
                </span>
                <span className="font-medium text-zinc-200 tabular-nums">
                  {seg.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================================
// RECOMMENDED PROBLEMS & RECENT ACTIVITY (Requirements F & I)
// ============================================================================
function BottomWorkspaceGrid({ onSolveToast }) {
  const [problems, setProblems] = useState([]);
  const [solvingId, setSolvingId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [problemError, setProblemError] = useState('');

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch((error) => setProblemError(error.message))
      .finally(() => setLoadingProblems(false));
  }, []);

  const toggleBookmark = (id) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
    );
  };

  const handleSolve = async (problem) => {
    setSolvingId(problem.id);
    try {
      const details = await getProblem(problem.id);
      setSelectedProblem(details);
      onSolveToast(details);
    } catch (error) {
      setProblemError(error.message);
    } finally {
      setSolvingId(null);
    }
  };

  const filteredProblems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return problems.filter((problem) => {
      const matchesDifficulty =
        difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      const matchesSearch =
        !query ||
        problem.title.toLowerCase().includes(query) ||
        String(problem.id).includes(query);
      return matchesDifficulty && matchesSearch;
    });
  }, [problems, searchQuery, difficultyFilter]);

  const getDifficultyStyle = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 group-hover:bg-emerald-500/15';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25 group-hover:bg-amber-500/15';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25 group-hover:bg-rose-500/15';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Recommended Problems (Viewport Triggered) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
        className="lg:col-span-7 rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Recommended for You
              </h2>
              <p className="text-xs text-zinc-500">
                Curated based on your Dynamic Programming & Graph patterns
              </p>
            </div>
          </div>
          <span className="text-xs text-purple-400 font-medium hidden sm:inline">
            AI Match · 96%
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-purple-500/50"
            />
          </label>
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-purple-500/50"
            aria-label="Filter by difficulty"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {problemError && (
          <p className="mb-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {problemError}
          </p>
        )}

        {loadingProblems && (
          <div className="py-8 text-center text-xs text-zinc-500">
            Loading problems...
          </div>
        )}

        {!loadingProblems && filteredProblems.length === 0 && (
          <div className="py-8 text-center text-xs text-zinc-500">
            No problems match the current filters.
          </div>
        )}

        <div className="space-y-2.5">
          {filteredProblems.slice(0, 10).map((prob, idx) => (
            <motion.div
              key={prob.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: EASE_PREMIUM,
              }}
              whileHover={{ y: -2 }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/95 border border-zinc-800/70 hover:border-purple-500/35 transition-colors duration-200"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-zinc-500">
                    {prob.id}
                  </span>
                  <h3 className="text-sm font-medium text-zinc-100 group-hover:text-purple-200 transition-colors truncate">
                    {prob.title}
                  </h3>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors duration-200 ${getDifficultyStyle(
                      prob.difficulty
                    )}`}
                  >
                    {prob.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-500">
                  {(prob.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {prob.acceptance && <span>· Acc: {prob.acceptance}</span>}
                  {prob.xp && (
                    <span className="text-purple-400/90 font-medium">
                      · {prob.xp}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Animated Bookmark Button */}
                <motion.button
                  onClick={() => toggleBookmark(prob.id)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label="Bookmark problem"
                  className={`p-2 rounded-lg border transition-colors ${
                    prob.bookmarked
                      ? 'bg-purple-500/15 border-purple-500/35 text-purple-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: prob.bookmarked ? [1, 1.28, 1] : 1,
                    }}
                    transition={{ duration: 0.28 }}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        prob.bookmarked ? 'fill-purple-400' : ''
                      }`}
                    />
                  </motion.div>
                </motion.button>

                {/* Tactile Solve CTA */}
                <TactileButton
                  variant="primary"
                  loading={solvingId === prob.id}
                  onClick={() => handleSolve(prob)}
                  className="px-3.5 py-1.5 text-xs"
                >
                  {solvingId !== prob.id && <Play className="w-3 h-3 fill-current" />}
                  <span>{solvingId === prob.id ? 'Launching' : 'Solve'}</span>
                </TactileButton>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedProblem && (
          <div className="mt-3 rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-purple-400">Problem #{selectedProblem.id}</p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                  {selectedProblem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProblem(null)}
                className="text-xs text-zinc-500 hover:text-zinc-200"
              >
                Close
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-zinc-400">
              {selectedProblem.description}
            </p>
            <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
              <p><span className="text-zinc-500">Constraints:</span> {selectedProblem.constraints}</p>
              <p><span className="text-zinc-500">Input:</span> {selectedProblem.input_format}</p>
              <p><span className="text-zinc-500">Output:</span> {selectedProblem.output_format}</p>
            </div>
          </div>
        )}
      </motion.section>

      {/* Recent Activity Feed (Viewport Triggered) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, delay: 0.1, ease: EASE_PREMIUM }}
        className="lg:col-span-5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <History className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Recent Submissions
              </h2>
              <p className="text-xs text-zinc-500">Live judge execution log</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">UTC+5:30</span>
        </div>

        <div className="space-y-2.5">
          {RECENT_ACTIVITY.map((item, idx) => {
            const isAccepted = item.status === 'Accepted';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.08,
                  ease: EASE_PREMIUM,
                }}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/70 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isAccepted
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                    }`}
                  >
                    {isAccepted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-100 truncate">
                      {item.problem}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                      <span
                        className={
                          isAccepted ? 'text-emerald-400' : 'text-amber-400'
                        }
                      >
                        {item.status}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-zinc-400">
                        {item.language}
                      </span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-zinc-200 block">
                    {item.runtime}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {item.percentile}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}

function ProblemsPage({ onSolveToast }) {
  return (
    <motion.div
      key="problems-view"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_PREMIUM }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
          Problems
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Browse, search, and solve coding challenges from the CodeArena database.
        </p>
      </div>
      <BottomWorkspaceGrid onSolveToast={onSolveToast} />
    </motion.div>
  );
}

function ComingSoonPage() {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/80 px-6 text-center">
      <Trophy className="mb-4 h-10 w-10 text-purple-400" />
      <h1 className="text-2xl font-semibold text-zinc-100">Contests are coming soon</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        We’re building competitive contests for CodeArena. Check back soon for
        schedules, rankings, and registration.
      </p>
    </section>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Review your daily activity, rating progression, and problem-solving trends.
        </p>
      </div>
      <section aria-label="Daily activity">
        <h2 className="mb-3 text-sm font-semibold text-zinc-200">Daily activity</h2>
        <ActivityHeatmap />
      </section>
      <AnalyticsSection />
    </div>
  );
}

function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('codearena.access_token');
    if (!token) {
      setError('Sign in to view your submissions.');
      setLoading(false);
      return;
    }

    getSubmissions(token)
      .then(setSubmissions)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
          Submissions
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Your recent code submissions and execution results.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/90">
        {error ? (
          <p role="alert" className="p-5 text-sm text-rose-300">{error}</p>
        ) : loading ? (
          <p className="p-5 text-sm text-zinc-400">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="p-5 text-sm text-zinc-400">You haven’t submitted any solutions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Submission</th>
                  <th className="px-4 py-3 font-medium">Problem</th>
                  <th className="px-4 py-3 font-medium">Language</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Runtime</th>
                  <th className="px-4 py-3 text-right font-medium">Memory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-mono text-zinc-400">#{submission.id}</td>
                    <td className="px-4 py-3">Problem #{submission.problem_id}</td>
                    <td className="px-4 py-3">{submission.language}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs">
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {submission.execution_time == null ? '—' : `${submission.execution_time} ms`}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {submission.memory_used == null ? '—' : `${submission.memory_used} MB`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function SettingsPage({ theme, setTheme, notificationsEnabled, setNotificationsEnabled }) {
  const toggleClasses = (enabled) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-purple-600' : 'bg-zinc-700'
    }`;

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Customize how CodeArena looks and how you receive updates.
        </p>
      </div>

      <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-zinc-950/90">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-zinc-100">Appearance</h2>
            <p className="mt-1 text-xs text-zinc-500">Choose day or night mode.</p>
          </div>
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            {['light', 'dark'].map((mode) => (
              <button
                type="button"
                key={mode}
                aria-pressed={theme === mode}
                onClick={() => setTheme(mode)}
                className={`rounded-md px-3 py-1.5 text-xs capitalize transition ${
                  theme === mode
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {mode === 'light' ? 'Day' : 'Night'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <h2 className="text-sm font-medium text-zinc-100">Email notifications</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Save your preference for CodeArena updates.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            aria-label="Email notifications"
            onClick={() => setNotificationsEnabled((enabled) => !enabled)}
            className={toggleClasses(notificationsEnabled)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN APPLICATION SHELL
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    return NAV_ITEMS.some((item) => item.id === tab) ? tab : 'dashboard';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [entranceKey, setEntranceKey] = useState(0);
  const [activeToast, setActiveToast] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [allProblems, setAllProblems] = useState([]);
  const [commandQuery, setCommandQuery] = useState('');
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem('codearena.dashboard.theme') === 'light' ? 'light' : 'dark'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => window.localStorage.getItem('codearena.email-notifications') !== 'false'
  );

  useEffect(() => {
    window.localStorage.setItem('codearena.dashboard.theme', theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(
      'codearena.email-notifications',
      String(notificationsEnabled)
    );
  }, [notificationsEnabled]);

  useEffect(() => {
    getProblems()
      .then(setAllProblems)
      .catch(() => setAllProblems([]));
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'dashboard') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  // Keyboard shortcut Cmd+K / Ctrl+K for Command Palette feel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerReplay = () => {
    setIsLoading(false);
    setEntranceKey((prev) => prev + 1);
  };

  const toggleSkeletonPreview = () => {
    setIsLoading((prev) => {
      const next = !prev;
      if (!next) {
        setEntranceKey((k) => k + 1);
      }
      return next;
    });
  };

  const handleSolveToast = (problem) => {
    setActiveToast(problem);
    setTimeout(() => {
      setActiveToast((current) =>
        current?.id === problem.id ? null : current
      );
    }, 3400);
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Keyframes for Shimmer Skeleton */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div
        data-dashboard-theme={theme}
        className="min-h-screen bg-[#050507] text-zinc-100 flex selection:bg-purple-500/30 selection:text-purple-100"
      >
        {/* Subtle Background Architectural Grid & Ambient Glow (Requirement H) */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {/* Subtle architectural dot/grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(161, 161, 170, 0.22) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Top Radial Purple Glow behind Welcome Section */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[780px] h-[360px] rounded-full bg-purple-600/12 blur-[120px]" />
          <div className="absolute top-40 right-10 w-[340px] h-[340px] rounded-full bg-violet-600/8 blur-[110px]" />
        </div>

        {/* Collapsible Left Sidebar */}
        <Sidebar
          key={`sidebar-${entranceKey}`}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Column */}
        <div className="relative z-10 flex-1 flex flex-col min-w-0">
          {/* Top Navbar (Requirement A & G) */}
          <motion.header
            key={`navbar-${entranceKey}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            className="sticky top-0 z-20 h-16 px-4 sm:px-8 flex items-center justify-between gap-4 bg-[#050507]/80 backdrop-blur-xl border-b border-zinc-800/70"
          >
            {/* Command / Search Trigger */}
            <motion.button
              onClick={() => setCommandOpen(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center justify-between gap-3 w-full max-w-xs px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 transition-colors"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">Search problems, tags, users...</span>
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 rounded">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </motion.button>

            {/* Interactive Controls: Skeleton Toggle, Replay Entrance, Notifications */}
            <div className="flex items-center gap-2 shrink-0">
              <TactileButton
                variant={isLoading ? 'primary' : 'secondary'}
                onClick={toggleSkeletonPreview}
                className="px-3 py-1.5 text-xs"
                title="Preview shimmer skeleton loading states"
              >
                <Loader2
                  className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">
                  {isLoading ? 'Exit Skeleton' : 'Skeleton Preview'}
                </span>
              </TactileButton>

              <TactileButton
                variant="secondary"
                onClick={triggerReplay}
                className="px-3 py-1.5 text-xs"
                title="Replay dashboard entrance animations"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Replay Entrance</span>
              </TactileButton>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="relative p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-purple-400" />
              </motion.button>
            </div>
          </motion.header>

          {/* Main Dashboard Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-7">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <DashboardSkeleton key="skeleton-view" />
              ) : activeTab === 'problems' ? (
                <ProblemsPage
                  key="problems-view"
                  onSolveToast={handleSolveToast}
                />
              ) : activeTab === 'contests' ? (
                <ComingSoonPage key="contests-view" />
              ) : activeTab === 'analytics' ? (
                <AnalyticsPage key="analytics-view" />
              ) : activeTab === 'submissions' ? (
                <SubmissionsPage key="submissions-view" />
              ) : activeTab === 'settings' ? (
                <SettingsPage
                  key="settings-view"
                  theme={theme}
                  setTheme={setTheme}
                  notificationsEnabled={notificationsEnabled}
                  setNotificationsEnabled={setNotificationsEnabled}
                />
              ) : (
                <div key={`dashboard-view-${entranceKey}`} className="space-y-6">
                  {/* Welcome Header (Requirement A & H) */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.05,
                      ease: EASE_PREMIUM,
                    }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-300 mb-2.5">
                        <Zap className="w-3 h-3 text-purple-400" />
                        <span>Weekly Contest #428 starts in 2d 14h</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
                        Welcome back, Alex
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1">
                        You are on an{' '}
                        <span className="text-zinc-200 font-medium">
                          18-day streak
                        </span>
                        . Solve 2 Medium problems today to stay ahead of 94% of
                        your peer cohort.
                      </p>
                    </div>

                    <TactileButton
                      variant="primary"
                      onClick={async () => {
                        if (!allProblems.length) return;
                        try {
                          const details = await getProblem(allProblems[0].id);
                          handleSolveToast(details);
                        } catch (error) {
                          handleSolveToast({
                            id: allProblems[0].id,
                            title: allProblems[0].title,
                            description: error.message,
                          });
                        }
                      }}
                      className="px-4 py-2 text-xs self-start sm:self-auto"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Daily Challenge</span>
                    </TactileButton>
                  </motion.div>

                  {/* 4 Animated KPI Stat Cards (Requirement B) */}
                  <section
                    aria-label="Key Performance Statistics"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
                  >
                    {STATS_DATA.map((stat, index) => (
                      <StatCard key={stat.id} stat={stat} index={index} />
                    ))}
                  </section>

                  {/* Activity Contribution Heatmap (Requirement D) */}
                  <ActivityHeatmap />

                  {/* Interactive Analytics Charts (Requirement E) */}
                  <AnalyticsSection />

                  {/* Recommended Problems & Recent Submissions (Requirements F & I) */}
                  <BottomWorkspaceGrid onSolveToast={handleSolveToast} />
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Interactive Command Palette Modal (⌘K) */}
        <AnimatePresence>
          {commandOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setCommandOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.2, ease: EASE_PREMIUM }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800">
                  <Search className="w-4 h-4 text-purple-400" />
                  <input
                    autoFocus
                    type="text"
                    value={commandQuery}
                    onChange={(event) => setCommandQuery(event.target.value)}
                    placeholder="Jump to problem, contest, or command..."
                    className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setCommandOpen(false)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800"
                  >
                    ESC
                  </button>
                </div>
                <div className="p-2 space-y-1">
                  {allProblems
                    .filter((problem) => {
                      const query = commandQuery.trim().toLowerCase();
                      return !query ||
                        problem.title.toLowerCase().includes(query) ||
                        String(problem.id).includes(query);
                    })
                    .slice(0, 8)
                    .map((p) => (
                    <button
                      key={p.id}
                      onClick={async () => {
                        setCommandOpen(false);
                        try {
                          const details = await getProblem(p.id);
                          handleSolveToast(details);
                        } catch (error) {
                          handleSolveToast({
                            id: p.id,
                            title: p.title,
                            description: error.message,
                          });
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs hover:bg-zinc-900 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Code2 className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-mono text-zinc-500">{p.id}</span>
                        <span className="text-zinc-200 font-medium group-hover:text-white">
                          {p.title}
                        </span>
                      </span>
                      <span className="text-zinc-500 group-hover:text-purple-400">
                        Open →
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Non-intrusive Workspace Launch Toast */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-purple-500/40 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.4)]"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-100">
                  Editor Environment Ready
                </p>
                <p className="text-[11px] text-zinc-400">
                  Loaded {activeToast.id}: {activeToast.title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}