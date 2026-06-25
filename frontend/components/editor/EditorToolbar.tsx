'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { Play, Sparkles, Files, Loader2, Code2, Palette, Download, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorToolbarProps {
  onRun: () => void;
  isRunning: boolean;
  onReview: () => void;
  isReviewing: boolean;
  onExport?: () => void;
}

const THEMES = [
  { id: 'premium-dark', name: 'Slate Dark', desc: 'VS Code Dark style' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon pink and cyan glow' },
  { id: 'github-light', name: 'GitHub Light', desc: 'Minimal clean light' }
];

export default function EditorToolbar({ onRun, isRunning, onReview, isReviewing, onExport }: EditorToolbarProps) {
  const { language, compareMode, setCompareMode, theme, setTheme } = useLanguage();
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, []);

  return (
    <div className="w-full flex flex-col z-30 bg-[#0B1120] select-none shrink-0 rounded-t-3xl border-b border-white/10 relative">
      {/* 1. macOS Window Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 relative">
        {/* Left: Traffic Lights */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20 hover:bg-rose-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20 hover:bg-amber-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20 hover:bg-emerald-500 transition-colors cursor-pointer" />
        </div>

        {/* Center: File Title tab */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono font-bold text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>main.{activeLang.fileExtension}</span>
        </div>

        {/* Right: Window Status */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 font-bold font-mono tracking-wider uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">
            Auto-saved
          </span>
        </div>
      </div>

      {/* 2. Actions Toolbar Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
        {/* Left: Quick active state info */}
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/35" />
          <span>Compiler Active</span>
        </div>

      {/* Compiler Action Items */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        {/* Custom Theme Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-white/5 border-white/10 hover:bg-white/10 text-slate-200 transition-all cursor-pointer select-none"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>{THEMES.find(t => t.id === theme)?.name || 'Slate Dark'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute z-50 mt-2 left-0 w-52 glass-dropdown p-1.5 flex flex-col gap-0.5 overflow-hidden"
              >
                {THEMES.map((t) => {
                  const isActive = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow shadow-blue-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] font-extrabold">{t.name}</span>
                        <span className={`text-[9px] font-medium leading-none mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{t.desc}</span>
                      </div>
                      {isActive && <Check className="w-3 h-3 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compare Languages Mode Toggle */}
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            compareMode
              ? 'bg-blue-950/40 border-blue-900/30 text-blue-400'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle side-by-side language comparison view"
        >
          <Files className="w-3.5 h-3.5" />
          <span>Compare Languages</span>
        </button>

        {/* AI Code Review */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReview}
          disabled={isReviewing || isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/30 disabled:bg-white/5 border border-indigo-900/30 disabled:border-white/5 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 transition-all cursor-pointer"
          title="AI Review (Ctrl+Shift+R)"
        >
          {isReviewing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>AI Review</span>
        </motion.button>

        {/* Run / Simulate Execution */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRun}
          disabled={isRunning || isReviewing}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 rounded-xl text-xs font-bold text-slate-50 hover:text-white transition-all shadow shadow-blue-500/10 cursor-pointer disabled:text-slate-500 btn-shine animate-glow-pulse"
          title="Run Code (Ctrl+Enter)"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Run Code</span>
        </motion.button>

        {/* Export Report */}
        {onExport && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/30 border border-emerald-900/30 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
            title="Export Study Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </motion.button>
        )}
      </div>
      </div>

      {/* Run Progress Line Loader */}
      {isRunning && (
        <motion.div
          initial={{ left: '0%', width: '0%', opacity: 0 }}
          animate={{ 
            left: ['0%', '0%', '100%'], 
            width: ['0%', '40%', '0%'],
            opacity: [1, 1, 0] 
          }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
        />
      )}
    </div>
  );
}
