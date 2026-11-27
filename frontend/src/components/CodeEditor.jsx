import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Play, RotateCcw, CheckCircle2, Terminal, Cpu, FileCode2, FileText,
  Clock, ChevronRight, Loader2
} from 'lucide-react';
import { SIGNATURE_GRADIENT_BG } from '../constants/styles';

function renderHighlightedCpp(line) {
  if (!line) return <span>&nbsp;</span>;

  const tokenRegex =
    /(\b(?:class|public|private|for|if|return|int|void|const|auto|while|sort)\b|\b(?:vector|unordered_map|pair|string|size_t)\b|\b(?:twoSum|twoSumSorted|count|size|push_back|begin|end)\b|[{}()[\];,<>:=+-]+|\b\d+\b|"[^"]*"|\/\/.*$)/g;

  const nodes = [];
  let lastIdx = 0;
  let match;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(
        <span key={`plain-${lastIdx}`} className="text-[#E4E4E7]">
          {line.slice(lastIdx, match.index)}
        </span>
      );
    }

    const token = match[0];
    let cls = 'text-[#E4E4E7]';

    if (/^(class|public|private|for|if|return|int|void|const|auto|while|sort)$/.test(token)) {
      cls = 'text-[#C4A5F5] font-medium';
    } else if (/^(vector|unordered_map|pair|string|size_t)$/.test(token)) {
      cls = 'text-[#F5D6AE]';
    } else if (/^(twoSum|twoSumSorted|count|size|push_back|begin|end)$/.test(token)) {
      cls = 'text-[#8B89F8]';
    } else if (/^\d+$/.test(token)) {
      cls = 'text-amber-300';
    } else if (/^".*"$/.test(token)) {
      cls = 'text-emerald-300';
    } else if (/^\/\//.test(token)) {
      cls = 'text-[#71717A] italic';
    } else {
      cls = 'text-[#A1A1AA]';
    }

    nodes.push(
      <span key={`tok-${match.index}`} className={cls}>
        {token}
      </span>
    );

    lastIdx = match.index + token.length;
  }

  if (lastIdx < line.length) {
    nodes.push(
      <span key={`tail-${lastIdx}`} className="text-[#E4E4E7]">
        {line.slice(lastIdx)}
      </span>
    );
  }

  return nodes;
}

/**
 * 3. INTERACTIVE VS CODE-STYLE CODE EDITOR SHOWCASE
 */
export default function CodeEditor() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('TwoSum.cpp');
  const [charIndex, setCharIndex] = useState(0);

  // Run Code interactive simulation state: 'idle' | 'running' | 'tc1' | 'tc2' | 'done'
  const [runStage, setRunStage] = useState('done');

  const twoSumCode = useMemo(
    () => `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;

        for (int i = 0; i < nums.size(); i++) {
            int remaining = target - nums[i];

            if (mp.count(remaining)) {
                return {mp[remaining], i};
            }

            mp[nums[i]] = i;
        }

        return {};
    }
};`,
    []
  );

  const readmeLines = useMemo(
    () => [
      '# 1. Two Sum  [Easy]',
      '',
      'Given an array of integers `nums` and an integer `target`, return indices',
      'of the two numbers such that they add up to `target`.',
      '',
      'Example 1:',
      '  Input:  nums = [2,7,11,15], target = 9',
      '  Output: [0,1]',
      '',
      'Example 2:',
      '  Input:  nums = [3,2,4], target = 6',
      '  Output: [1,2]',
      '',
      'Constraints:',
      '  • 2 <= nums.length <= 10^4',
      '  • -10^9 <= nums[i], target <= 10^9',
      '  • Follow-up: Can you solve it in less than O(n^2) time complexity?'
    ],
    []
  );

  const altSolutionCode = useMemo(
    () => `// Optimal Hash Map Approach — Time: O(n) | Space: O(n)
// Peer-reviewed by Alex & Sam in Collaborative Room #402
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        seen.reserve(nums.size());

        for (int i = 0; i < (int)nums.size(); ++i) {
            int complement = target - nums[i];
            auto it = seen.find(complement);
            if (it != seen.end()) {
                return {it->second, i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
    []
  );

  // Character-by-character typing effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setCharIndex(twoSumCode.length);
      return;
    }
    if (charIndex >= twoSumCode.length) return;

    const timeout = setTimeout(() => {
      setCharIndex((prev) => Math.min(prev + 2, twoSumCode.length));
    }, 16);

    return () => clearTimeout(timeout);
  }, [charIndex, twoSumCode, prefersReducedMotion]);

  // Interactive Run Code simulation sequence
  const handleRunCode = () => {
    if (runStage === 'running' || runStage === 'tc1' || runStage === 'tc2') return;
    setRunStage('running');

    setTimeout(() => setRunStage('tc1'), 550);
    setTimeout(() => setRunStage('tc2'), 1050);
    setTimeout(() => setRunStage('done'), 1550);
  };

  const handleReplayTyping = () => {
    setActiveTab('TwoSum.cpp');
    setCharIndex(0);
  };

  const visibleCode = twoSumCode.slice(0, charIndex);
  const displayedLines = visibleCode.split('\n');

  const tabs = [
    { name: 'TwoSum.cpp', icon: FileCode2, accent: 'text-[#C4A5F5]' },
    { name: 'README.md', icon: FileText, accent: 'text-[#F5D6AE]' },
    { name: 'Solution.cpp', icon: FileCode2, accent: 'text-[#7775EF]' }
  ];

  return (
    <motion.div
      id="editor"
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-14 sm:mt-16 max-w-5xl scroll-mt-28"
    >
      {/* Ambient Gradient Glow Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 sm:-inset-6 rounded-[28px] bg-gradient-to-r from-[#F5D6AE]/15 via-[#C4A5F5]/20 to-[#7775EF]/25 blur-2xl opacity-85"
      />

      {/* Gentle Floating Wrapper */}
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl border border-white/10 bg-[#101116]/95 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.9),0_0_55px_-12px_rgba(119,117,239,0.28)] backdrop-blur-xl overflow-hidden"
      >
        {/* Top Luminous Gradient Hairline */}
        <div className={`h-[1.5px] w-full opacity-75 ${SIGNATURE_GRADIENT_BG}`} />

        {/* Window Header & File Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#08090D]/90 px-4 py-3">
          <div className="flex items-center gap-4 overflow-x-auto">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#FF5F56]/85 border border-white/10" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]/85 border border-white/10" />
              <span className="h-3 w-3 rounded-full bg-[#27C93F]/85 border border-white/10" />
            </div>

            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

            {/* File Tabs */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Code files">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition-all duration-200 ${
                      isActive
                        ? 'bg-[#14151C] text-white border border-white/10 shadow-sm'
                        : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${tab.accent}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Editor Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-[#14151C] px-3 py-1 text-[11px] font-medium text-[#A1A1AA]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>2 Collaborators Active</span>
            </div>

            <button
              type="button"
              onClick={handleReplayTyping}
              title="Replay typing animation"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#14151C] px-2.5 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            <motion.button
              type="button"
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
              onClick={handleRunCode}
              disabled={runStage === 'running' || runStage === 'tc1' || runStage === 'tc2'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7775EF] to-[#9D8DF7] hover:brightness-110 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(119,117,239,0.4)] transition-all disabled:opacity-70"
            >
              {runStage === 'running' || runStage === 'tc1' || runStage === 'tc2' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Sub-bar Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#101116] px-4 py-2 text-[11px] font-mono text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <span>codearena</span>
            <ChevronRight className="w-3 h-3" />
            <span>algorithms</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#A1A1AA]">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">C++20 (GCC 13.2)</span>
            <span className="text-[#C4A5F5]">O(n) Optimal</span>
          </div>
        </div>

        {/* Main Code Area */}
        <div className="relative min-h-[350px] sm:min-h-[385px] bg-[#101116] px-3 sm:px-6 py-5 font-mono text-[13px] sm:text-sm leading-relaxed overflow-x-auto">
          {/* Subtle Ambient Glow Inside Editor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(196,165,245,0.06),transparent_60%)]"
          />

          {/* Floating Collaborator Cursor 1: Alex */}
          {activeTab === 'TwoSum.cpp' && (
            <motion.div
              aria-hidden="true"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      x: [0, 34, -12, 0],
                      y: [0, -18, 12, 0]
                    }
              }
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute top-[38%] left-[56%] z-20 hidden sm:flex flex-col items-start"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#F5D6AE] drop-shadow-[0_2px_8px_rgba(245,214,174,0.6)] -ml-1 -mt-1"
              >
                <path
                  d="M1.5 1.5L6.5 14.5L8.8 8.8L14.5 6.5L1.5 1.5Z"
                  fill="currentColor"
                  stroke="#08090D"
                  strokeWidth="1"
                />
              </svg>
              <span className="mt-0.5 ml-2.5 rounded-full bg-[#F5D6AE] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#08090D] shadow-lg whitespace-nowrap">
                Alex is editing...
              </span>
            </motion.div>
          )}

          {/* Floating Collaborator Cursor 2: Sam */}
          {activeTab === 'TwoSum.cpp' && (
            <motion.div
              aria-hidden="true"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      x: [0, -28, 18, 0],
                      y: [0, 20, -10, 0]
                    }
              }
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute top-[63%] left-[44%] z-20 hidden sm:flex flex-col items-start"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#C4A5F5] drop-shadow-[0_2px_8px_rgba(196,165,245,0.6)] -ml-1 -mt-1"
              >
                <path
                  d="M1.5 1.5L6.5 14.5L8.8 8.8L14.5 6.5L1.5 1.5Z"
                  fill="currentColor"
                  stroke="#08090D"
                  strokeWidth="1"
                />
              </svg>
              <span className="mt-0.5 ml-2.5 rounded-full bg-[#C4A5F5] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#08090D] shadow-lg whitespace-nowrap">
                Sam joined
              </span>
            </motion.div>
          )}

          {/* Active Tab: TwoSum.cpp (Animated Typing) */}
          {activeTab === 'TwoSum.cpp' && (
            <div className="relative z-10 select-text">
              {displayedLines.map((line, index) => {
                const isLastLine = index === displayedLines.length - 1;
                return (
                  <div
                    key={index}
                    className="flex items-start rounded px-2 -mx-2 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="w-8 sm:w-10 shrink-0 select-none text-right pr-4 text-[#52525B] text-xs leading-6">
                      {index + 1}
                    </span>
                    <pre className="whitespace-pre font-mono text-[13px] sm:text-sm leading-6">
                      {renderHighlightedCpp(line)}
                      {isLastLine && (
                        <span
                          aria-hidden="true"
                          className="inline-block w-[2px] h-4 ml-0.5 align-middle bg-[#C4A5F5] animate-pulse"
                        />
                      )}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Tab: README.md */}
          {activeTab === 'README.md' && (
            <div className="relative z-10 space-y-0.5">
              {readmeLines.map((line, index) => (
                <div key={index} className="flex items-start px-2 -mx-2">
                  <span className="w-8 sm:w-10 shrink-0 select-none text-right pr-4 text-[#52525B] text-xs leading-6">
                    {index + 1}
                  </span>
                  <pre
                    className={`whitespace-pre-wrap font-mono text-[13px] sm:text-sm leading-6 ${
                      line.startsWith('# ')
                        ? 'text-white font-semibold'
                        : line.startsWith('Example') || line.startsWith('Constraints')
                        ? 'text-[#F5D6AE] font-medium'
                        : line.trim().startsWith('•')
                        ? 'text-[#C4A5F5]'
                        : 'text-[#A1A1AA]'
                    }`}
                  >
                    {line || ' '}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Active Tab: Solution.cpp */}
          {activeTab === 'Solution.cpp' && (
            <div className="relative z-10">
              {altSolutionCode.split('\n').map((line, index) => (
                <div key={index} className="flex items-start px-2 -mx-2">
                  <span className="w-8 sm:w-10 shrink-0 select-none text-right pr-4 text-[#52525B] text-xs leading-6">
                    {index + 1}
                  </span>
                  <pre className="whitespace-pre font-mono text-[13px] sm:text-sm leading-6">
                    {renderHighlightedCpp(line)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output Terminal & Test Cases Panel */}
        <div className="border-t border-white/10 bg-[#08090D] px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                <Terminal className="w-3.5 h-3.5 text-[#C4A5F5]" />
                <span>Output Terminal</span>
              </div>
              <span className="text-white/20">•</span>
              {runStage === 'running' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5D6AE]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running test cases...
                </span>
              )}
              {(runStage === 'tc1' || runStage === 'tc2') && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C4A5F5]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Executing test suite...
                </span>
              )}
              {runStage === 'done' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Test Cases Passed ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F5D6AE]" />
                Runtime: <strong className="text-white">3 ms</strong>
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#7775EF]" />
                Memory: <strong className="text-white">10.4 MB</strong>
              </span>
            </div>
          </div>

          {/* Test Case Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {/* Test Case 1 */}
            <div
              className={`rounded-xl border p-3.5 transition-all duration-300 ${
                runStage === 'running'
                  ? 'border-white/10 bg-[#14151C]/50 opacity-60'
                  : 'border-emerald-500/25 bg-[#14151C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white font-semibold">
                  {runStage === 'running' ? 'Test Case 1 — Pending...' : 'Test Case 1 Passed ✓'}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                    runStage === 'running'
                      ? 'bg-white/10 text-[#A1A1AA]'
                      : 'bg-emerald-500/15 text-emerald-300'
                  }`}
                >
                  {runStage === 'running' ? 'QUEUED' : '0 ms'}
                </span>
              </div>
              <div className="text-[#A1A1AA]">Input: nums = [2,7,11,15], target = 9</div>
              <div className="text-[#A1A1AA] mt-0.5">
                Output: <span className="text-emerald-300">[0,1]</span> · Expected:{' '}
                <span className="text-white">[0,1]</span>
              </div>
            </div>

            {/* Test Case 2 */}
            <div
              className={`rounded-xl border p-3.5 transition-all duration-300 ${
                runStage === 'running' || runStage === 'tc1'
                  ? 'border-white/10 bg-[#14151C]/50 opacity-60'
                  : 'border-emerald-500/25 bg-[#14151C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white font-semibold">
                  {runStage === 'running' || runStage === 'tc1'
                    ? 'Test Case 2 — Pending...'
                    : 'Test Case 2 Passed ✓'}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                    runStage === 'running' || runStage === 'tc1'
                      ? 'bg-white/10 text-[#A1A1AA]'
                      : 'bg-emerald-500/15 text-emerald-300'
                  }`}
                >
                  {runStage === 'running' || runStage === 'tc1' ? 'QUEUED' : '1 ms'}
                </span>
              </div>
              <div className="text-[#A1A1AA]">Input: nums = [3,2,4], target = 6</div>
              <div className="text-[#A1A1AA] mt-0.5">
                Output: <span className="text-emerald-300">[1,2]</span> · Expected:{' '}
                <span className="text-white">[1,2]</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
