'use client';

import { useState } from 'react';
import { Sparkles, Cpu, Layers, AlertTriangle, Info, CheckCircle, Copy, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeCriticPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  reviewResult: {
    review: string;
    complexity: {
      time: string;
      timeReason: string;
      space: string;
      spaceReason: string;
    };
    annotations: Array<{
      line: number;
      type: 'warning' | 'info' | 'success';
      message: string;
    }>;
    alternativeCode: string;
  } | null;
  isReviewing: boolean;
  inline?: boolean;
  onApplyCode?: (code: string) => void;
}

export default function CodeCriticPanel({ isOpen = true, onClose, reviewResult, isReviewing, inline = false, onApplyCode }: CodeCriticPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!inline && isOpen === false) return null;

  const handleCopy = () => {
    if (reviewResult?.alternativeCode) {
      navigator.clipboard.writeText(reviewResult.alternativeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => (
    <>
      {isReviewing ? (
        <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-3 border-indigo-900/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-indigo-400 animate-bounce" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Analyzing Code
          </span>
          <p className="text-xs text-slate-500 font-semibold max-w-[200px] leading-relaxed">
            Evaluating space/time complexity and checking edge cases...
          </p>
        </div>
      ) : reviewResult ? (
        <div className="flex flex-col gap-6">
          {/* Summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Critic Overview
            </span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              {reviewResult.review}
            </p>
          </div>

          {/* Complexity Badges */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Complexity Profile
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-white/10 rounded-2xl p-3 bg-white/5 shadow-sm flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-black">Time</span>
                </div>
                <span className="text-lg font-black text-white font-mono">
                  {reviewResult.complexity.time}
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">
                  {reviewResult.complexity.timeReason}
                </span>
              </div>

              <div className="border border-white/10 rounded-2xl p-3 bg-white/5 shadow-sm flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-black">Space</span>
                </div>
                <span className="text-lg font-black text-white font-mono">
                  {reviewResult.complexity.space}
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">
                  {reviewResult.complexity.spaceReason}
                </span>
              </div>
            </div>
          </div>

          {/* Annotations */}
          {reviewResult.annotations && reviewResult.annotations.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Line-by-Line Annotations
              </span>
              <div className="flex flex-col gap-2.5">
                {reviewResult.annotations.map((ann, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 border rounded-2xl p-3.5 ${
                      ann.type === 'warning'
                        ? 'border-amber-900/30 bg-amber-950/20 text-amber-300'
                        : ann.type === 'success'
                        ? 'border-emerald-900/30 bg-emerald-950/20 text-emerald-300'
                        : 'border-blue-900/30 bg-blue-950/20 text-blue-300'
                    }`}
                  >
                    {ann.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : ann.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide opacity-80">
                        Line {ann.line}
                      </span>
                      <p className="text-xs font-semibold leading-relaxed">
                        {ann.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Code block */}
          {reviewResult.alternativeCode && (
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Recommended Optimization
                </span>
                <div className="flex items-center gap-2">
                  {onApplyCode && reviewResult?.alternativeCode && (
                    <button
                      onClick={() => onApplyCode(reviewResult.alternativeCode)}
                      className="flex items-center gap-1 text-[10px] text-white hover:text-white font-bold bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 hover:border-indigo-400/50 rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-[0_0_12px_rgba(79,70,229,0.3)] hover:shadow-[0_0_16px_rgba(79,70,229,0.5)] active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-200 animate-pulse" />
                      <span>Apply to Editor</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white font-bold bg-white/5 border border-white/10 rounded-lg px-2 py-1 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-inner">
                <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto custom-scrollbar whitespace-pre leading-relaxed select-all">
                  <code>{reviewResult.alternativeCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
          <Sparkles className="w-10 h-10 text-indigo-500/15 mb-2 stroke-[1.5]" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            AI Code Critic Offline
          </span>
          <p className="text-[11px] text-slate-500 font-semibold max-w-[220px] leading-relaxed">
            Click the **AI Review** button in the editor toolbar to run annotations and complexity scans.
          </p>
        </div>
      )}
    </>
  );

  if (inline) {
    return (
      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col h-full bg-slate-950/25 p-5 rounded-3xl border border-white/5">
        {renderContent()}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      className="w-full lg:w-96 h-[780px] flex flex-col border border-white/10 bg-slate-900/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl shrink-0 glass-spatial"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          <span className="text-sm font-black text-white tracking-tight">AI Code Critic</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-grow p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        {renderContent()}
      </div>
    </motion.div>
  );
}
