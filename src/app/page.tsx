'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, Activity, Layers, Code2, CheckCircle, ChevronRight, Play, Award, Crown, Briefcase, BookOpen, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';

// All active (non-future) languages
const ACTIVE_LANGS = LANGUAGES.filter(l => !l.isFuture);

// Language-specific code snippets for the hero demo
const CODE_SNIPPETS: Record<string, string[]> = {
  python: [
    'def find_largest(nums):',
    '    if not nums:',
    '        return None',
    '    largest = nums[0]',
    '    for n in nums:',
    '        if n > largest:',
    '            largest = n',
    '    return largest'
  ],
  javascript: [
    'function findLargest(nums) {',
    '    if (!nums.length) return null;',
    '    let largest = nums[0];',
    '    for (let n of nums) {',
    '        if (n > largest) largest = n;',
    '    }',
    '    return largest;',
    '}'
  ],
  typescript: [
    'function findLargest(nums: number[]): number | null {',
    '    if (!nums.length) return null;',
    '    let largest: number = nums[0];',
    '    for (const n of nums) {',
    '        if (n > largest) largest = n;',
    '    }',
    '    return largest;',
    '}'
  ],
  java: [
    'public static Integer findLargest(int[] nums) {',
    '    if (nums.length == 0) return null;',
    '    int largest = nums[0];',
    '    for (int n : nums) {',
    '        if (n > largest) largest = n;',
    '    }',
    '    return largest;',
    '}'
  ],
  cpp: [
    'int findLargest(vector<int>& nums) {',
    '    if (nums.empty()) return -1;',
    '    int largest = nums[0];',
    '    for (int n : nums) {',
    '        if (n > largest) largest = n;',
    '    }',
    '    return largest;',
    '}'
  ],
  c: [
    'int findLargest(int nums[], int len) {',
    '    if (len == 0) return -1;',
    '    int largest = nums[0];',
    '    for (int i = 0; i < len; i++) {',
    '        if (nums[i] > largest)',
    '            largest = nums[i];',
    '    }',
    '    return largest;',
    '}'
  ],
  go: [
    'func findLargest(nums []int) *int {',
    '    if len(nums) == 0 { return nil }',
    '    largest := nums[0]',
    '    for _, n := range nums {',
    '        if n > largest {',
    '            largest = n',
    '        }',
    '    }',
    '    return &largest',
    '}'
  ],
  r: [
    'find_largest <- function(nums) {',
    '  if (length(nums) == 0) return(NULL)',
    '  largest <- nums[1]',
    '  for (n in nums) {',
    '    if (n > largest) {',
    '      largest <- n',
    '    }',
    '  }',
    '  return(largest)',
    '}'
  ],
};

// Which line indices to highlight per step
const HIGHLIGHT_STEPS: Record<string, number[][]> = {
  python:     [[3], [4, 5, 6], [7]],
  javascript: [[2], [3, 4], [6]],
  typescript: [[2], [3, 4], [6]],
  java:       [[2], [3, 4], [6]],
  cpp:        [[2], [3, 4], [6]],
  c:          [[2], [3, 4, 5], [6]],
  go:         [[2], [3, 4, 5, 6], [8]],
  r:          [[2], [3, 4, 5, 6], [8]],
};

const FILE_EXTENSIONS: Record<string, string> = {
  python: 'find_largest.py',
  javascript: 'findLargest.js',
  typescript: 'findLargest.ts',
  java: 'FindLargest.java',
  cpp: 'findLargest.cpp',
  c: 'findLargest.c',
  go: 'findLargest.go',
  r: 'findLargest.R',
};

const KEYWORDS_BY_LANG: Record<string, string[]> = {
  python:     ['def', 'return', 'for', 'in', 'if', 'not', 'None'],
  javascript: ['function', 'return', 'let', 'for', 'of', 'if', 'null'],
  typescript: ['function', 'return', 'let', 'const', 'for', 'of', 'if', 'null', 'number'],
  java:       ['public', 'static', 'return', 'for', 'int', 'if', 'null'],
  cpp:        ['int', 'return', 'for', 'if', 'void', 'auto'],
  c:          ['int', 'return', 'for', 'if', 'void'],
  go:         ['func', 'return', 'for', 'if', 'range', 'nil', 'int'],
  r:          ['function', 'return', 'for', 'if', 'in', 'NULL'],
};

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('python');

  // Sync active tab with global language store
  useEffect(() => {
    setLanguage(activeTab);
  }, [activeTab, setLanguage]);

  // Sync from store on mount
  useEffect(() => {
    if (language && language !== activeTab) {
      setActiveTab(language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeLang = ACTIVE_LANGS.find((l) => l.id === activeTab) || ACTIVE_LANGS[0];
  const codeLines = CODE_SNIPPETS[activeTab] || CODE_SNIPPETS['python'];
  const highlightSteps = HIGHLIGHT_STEPS[activeTab] || HIGHLIGHT_STEPS['python'];
  const keywords = KEYWORDS_BY_LANG[activeTab] || [];

  const isLineHighlighted = (idx: number) => highlightSteps[activeStep]?.includes(idx) ?? false;

  const getMockVariables = () => {
    if (activeStep === 0) return { nums: '[12, 45, 89]', largest: '12', state: 'Initialized' };
    if (activeStep === 1) return { nums: '[12, 45, 89]', largest: '89', state: 'Looping (Max Found)' };
    return { nums: '[12, 45, 89]', largest: '89', state: 'Returned' };
  };

  const mockVars = getMockVariables();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const headingWordVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 md:py-20 relative overflow-hidden">
      {/* Dynamic colorful gradient orbs in background */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/20 to-indigo-300/25 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-purple-200/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl flex flex-col items-center gap-6 relative z-10 px-4"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-900/30 text-[11px] font-extrabold text-blue-400 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Interactive Language-Aware Coding Platform</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white flex flex-wrap justify-center gap-x-[0.25em] gap-y-2"
        >
          {"Master Coding Logic,".split(' ').map((word, idx) => (
            <motion.span
              key={idx}
              variants={headingWordVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
          <div className="w-full h-0 sm:block hidden" />
          <motion.span variants={headingWordVariants} className="inline-block">Adapted</motion.span>
          <motion.span variants={headingWordVariants} className="inline-block">to</motion.span>
          <span className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeLang.name}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.2 }}
                className="inline-block text-gradient pb-4 pt-1 px-2 -mb-4 -mt-1"
              >
                {activeLang.name}
              </motion.span>
            </AnimatePresence>
            <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-950/60 -z-10 rounded-full" />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-xl font-semibold mt-2"
        >
          Develop solid algorithmic logic. Our platform dynamically adapts roadmaps, exercises, code completion, and memory visualizers to your preferred language.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-7 text-xs font-black text-white transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 active:scale-98 btn-shine w-full"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/playground"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-7 text-xs font-black text-slate-200 transition-all shadow-sm cursor-pointer hover:border-white/20 hover:scale-[1.02] active:scale-98 w-full"
            >
              <Code2 className="w-4 h-4 text-slate-400" />
              <span>Sandbox Playground</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Interactive Logic-to-Code visualizer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full max-w-4xl mt-16 relative z-10 px-4"
      >
        {/* Language selector bar — all active languages */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6 relative z-20">
          {ACTIVE_LANGS.map((lang) => (
            <button
              key={lang.id}
              onClick={() => { setActiveTab(lang.id); setActiveStep(0); }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10 hover:border-white/20"
            >
              {/* Language color dot */}
              <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${lang.color} shrink-0`} />
              {lang.name}
            </button>
          ))}
        </div>        {/* IDE Layout */}
        <div className="glass-spatial rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-stretch relative overflow-hidden border border-white/10 shadow-spatial-glow-indigo/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-2xl pointer-events-none" />

          {/* Left: Logic blocks stepper */}
          <div className="flex-1 w-full flex flex-col gap-3 justify-between relative z-10">
            <div>
              {/* Window Controls Dots */}
              <div className="flex items-center gap-1.5 mb-4 select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20" />
              </div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">
                Algorithmic Logic Steps
              </span>

              <div className="flex flex-col gap-3">
                {[
                  { step: 0, text: 'Initialize max variable with element at index 0' },
                  { step: 1, text: 'Loop and compare current element with max' },
                  { step: 2, text: 'Return largest value as final algorithm output' }
                ].map((item) => {
                  const isCurrent = activeStep === item.step;
                  return (
                    <button
                      key={item.step}
                      onClick={() => setActiveStep(item.step)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group cursor-pointer ${
                        isCurrent
                          ? 'border-blue-500/50 bg-blue-950/60 shadow-spatial-glow-blue/20 scale-[1.02]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15 hover:scale-[1.01]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-black text-xs transition-all ${
                          isCurrent ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {item.step + 1}
                      </div>
                      <p className="text-xs text-slate-200 font-bold leading-normal">
                        {item.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper controls */}
            <div className="flex gap-3 items-center mt-6 border-t border-white/10 pt-4">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 2))}
                className="p-1.5 px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 rounded-lg transition-all cursor-pointer hover:border-white/20"
              >
                Prev
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-400">Step {activeStep + 1} of 3</span>
              <button
                onClick={() => setActiveStep((prev) => (prev < 2 ? prev + 1 : 0))}
                className="p-1.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-[10px] text-white font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm shadow-blue-500/10 hover:shadow-md active:scale-98"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Arrow */}
          <div className="hidden md:flex items-center text-slate-700 px-1 relative z-10">
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>

          {/* Right: Code Simulator Pane */}
          <div className="flex-1 w-full bg-slate-950/80 rounded-2xl border border-white/15 flex flex-col justify-between self-stretch min-h-[340px] shadow-lg relative z-10 overflow-hidden shadow-spatial-glow-blue/5">
            {/* Header window actions bar */}
            <div className="bg-slate-900/60 px-4 py-2 border-b border-white/10 flex justify-between items-center select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] font-mono font-bold text-slate-400"
                >
                  {FILE_EXTENSIONS[activeTab] || 'solution.py'}
                </motion.span>
              </AnimatePresence>
              <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider font-mono bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Syntax Editor body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 flex-grow font-mono text-[11px] leading-relaxed"
              >
                {codeLines.map((line, idx) => {
                  const highlighted = isLineHighlighted(idx);
                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-200 -mx-4 px-4 py-0.5 border-l-2 ${
                        highlighted
                          ? 'bg-blue-950/40 border-blue-500 text-blue-400 font-bold'
                          : 'border-transparent text-slate-400'
                      }`}
                    >
                      <span className="inline-block w-4 text-[9px] text-slate-500 select-none mr-3 text-right">{idx + 1}</span>
                      <span>
                        {line.split(/(\s+|=|\(|\)|:|{|}|<|>|,|;|\[|\])/).map((part, pIdx) => {
                          const operators = ['=', '>', '<', ':'];
                          if (keywords.includes(part.trim()) && part.trim().length > 0) {
                            return <span key={pIdx} className="text-purple-400 font-bold">{part}</span>;
                          }
                          if (operators.includes(part.trim()) && part.trim().length > 0) {
                            return <span key={pIdx} className="text-amber-400 font-bold">{part}</span>;
                          }
                          if (part.match(/^\d+$/)) {
                            return <span key={pIdx} className="text-blue-500">{part}</span>;
                          }
                          if (part.match(/^(find_largest|findLargest|solveProblem)$/)) {
                            return <span key={pIdx} className="text-blue-400 font-bold">{part}</span>;
                          }
                          return <span key={pIdx}>{part}</span>;
                        })}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Scope bindings display */}
            <div className="bg-slate-900/60 border-t border-white/10 p-4 flex flex-col gap-2">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider font-mono block">
                Local Stack Variables
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(mockVars).map(([name, val]) => (
                  <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl text-[9px] font-mono font-bold shadow-sm transition-all hover:border-white/20">
                    <span className="text-slate-400">{name}:</span>
                    <span className="text-indigo-400">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards Grid - Extended to 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-20 relative z-10 px-4">
        {[
          {
            icon: Terminal,
            bg: 'bg-blue-950/40 border-blue-900/30 text-blue-400',
            title: 'Language-Specific Roadmaps',
            desc: 'Separate roadmap paths customized for Pythonic concepts, JS asynchronous DOM flow, C++ pointers, Java OOP structures, and Go concurrent channels.'
          },
          {
            icon: Layers,
            bg: 'bg-indigo-950/40 border-indigo-900/30 text-indigo-400',
            title: 'Interactive Memory Visualizer',
            desc: 'See your logic execute step-by-step. Inspect stack vs heap structures for C++, event-loops for JavaScript, and goroutine scheduling buffers in Go.'
          },
          {
            icon: Activity,
            bg: 'bg-purple-950/40 border-purple-900/30 text-purple-400',
            title: 'Adaptive AI Tutor',
            desc: 'Chat with a coding tutor that adapts its pedagogy dynamically—exposing memory models in low-level code, and concurrency states in Go.'
          },
          {
            icon: Award,
            bg: 'bg-emerald-950/40 border-emerald-900/30 text-emerald-400',
            title: 'AI Mock Interview Simulator',
            desc: 'Practice speaking out loud for developer roles. An AI recruiter analyzes your speech pacing (WPM), technical depth, and resume keyword match.'
          },
          {
            icon: Code2,
            bg: 'bg-amber-950/40 border-amber-900/30 text-amber-400',
            title: 'Zero-Config Code Sandbox',
            desc: 'A freeform compiler sandbox. Instantly run Python, Javascript, Go, or C++ and monitor output console logs and variable mutations side-by-side.'
          },
          {
            icon: Crown,
            bg: 'bg-rose-950/40 border-rose-900/30 text-rose-400',
            title: 'Gamified Developer Rankings',
            desc: 'Maintain daily streak counters, score XP points on completed problem sets, and rank up on global leaderboards to gamify your learning curve.'
          }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
              className="glass-spatial-card rounded-3xl p-6 group cursor-pointer hover:border-indigo-500/30 spatial-3d-card relative overflow-hidden"
            >
              {/* Window Controls Dot */}
              <div className="flex items-center gap-1 mb-4 select-none opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 ${card.bg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2 relative z-10">{card.title}</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed relative z-10">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* How it Works Header */}
      <div className="text-center max-w-2xl mt-36 mb-12 relative z-10 px-4">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-2 animate-pulse">
          Platform Architecture
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-normal">
          How Logic2Code AI Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 font-semibold">
          Learn, compile, and visualize developer concepts in 3 simple steps.
        </p>
      </div>

      {/* How it Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full relative z-10 px-4">
        {[
          {
            step: '01',
            title: 'Deploy Onboarding',
            desc: 'Define your experience level, select a language mode, and choose a career track to generate your personalized interactive roadmap.',
            glow: 'shadow-spatial-glow-blue/10 hover:border-blue-500/25'
          },
          {
            step: '02',
            title: 'Compile & Execute',
            desc: 'Code in our Monaco Editor. Watch execution visualizers draw variables, stack traces, and local scopes live on every run step.',
            glow: 'shadow-spatial-glow-purple/10 hover:border-indigo-500/25'
          },
          {
            step: '03',
            title: 'Optimize with AI',
            desc: 'Consult your personal AI Tutor for step-by-step logic hints, get code reviews, and compare multi-language alternative solutions.',
            glow: 'shadow-spatial-glow-emerald/10 hover:border-emerald-500/25'
          }
        ].map((item, idx) => (
          <div 
            key={idx}
            className={`glass-spatial rounded-3xl p-8 relative overflow-hidden transition-all duration-300 border border-white/5 hover:translate-y-[-4px] shadow-lg ${item.glow}`}
          >
            <div className="absolute -top-6 -right-6 text-7xl font-black font-mono text-white/5 select-none">
              {item.step}
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300 flex items-center justify-center mb-6">
              {item.step}
            </div>
            <h3 className="text-base font-extrabold text-white mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ Header */}
      <div className="text-center max-w-2xl mt-36 mb-12 relative z-10 px-4">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">
          FAQ
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-normal">
          Frequently Answered Console
        </h2>
      </div>

      {/* FAQ Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full relative z-10 px-4">
        {[
          {
            q: 'Is the compiler running real code?',
            a: 'Yes! When you click "Run Code" inside the Sandbox Playground or exercises, our server-side adapter compiles and runs the script, returning genuine console outputs, execution logs, and variable state snapshots.'
          },
          {
            q: 'How does the Memory Visualizer work?',
            a: 'The visualizer parses code dry-run traces. On each step, it records local variables, arrays, and scopes in memory, mapping them to a gorgeous UI that you can step through forward and backward.'
          },
          {
            q: 'Which programming languages are supported?',
            a: 'We fully support Python, JavaScript, TypeScript, Java, C++, C, Go, and R. The exercises, visualizers, syntaxes, and AI tutor customize themselves automatically based on your active mode.'
          },
          {
            q: 'Can I use this to prepare for interviews?',
            a: 'Absolutely! Our AI Interview Prep module simulates recruiter voice calls, lets you upload your resume for direct skill gap analyses, and reports speaking pacing (WPM) and technical feedback.'
          }
        ].map((faq, idx) => (
          <div key={idx} className="glass-spatial bg-slate-900/20 border border-white/5 rounded-3xl p-6 flex flex-col gap-2.5">
            <h3 className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed pl-3.5 border-l border-white/10">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
