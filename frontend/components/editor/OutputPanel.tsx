'use client';

import { Terminal, Sparkles, Award, WifiOff } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  reviewResult: string | null;
  onCloseReview: () => void;
  isSimulated?: boolean;
}

export default function OutputPanel({ output, reviewResult, onCloseReview, isSimulated = false }: OutputPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Console Output Terminal */}
      <div className="md:col-span-2 flex flex-col bg-slate-950/85 border border-white/10 rounded-3xl overflow-hidden h-60 shadow-inner">
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/10 bg-slate-900/60">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-300">Terminal Console</span>
          {isSimulated && (
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-800/30 text-[9px] font-bold text-amber-400 animate-pulse">
              <WifiOff className="w-3 h-3" />
              <span>Simulated Output (Offline Mode)</span>
            </span>
          )}
        </div>
        <div className="flex-grow p-5 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap select-text selection:bg-blue-500/20 custom-scrollbar">
          {output ? (
            <>
              {output}
              <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-1 animate-pulse align-middle select-none">▮</span>
            </>
          ) : (
            <>
              $ 
              <span className="inline-block w-1.5 h-3.5 bg-slate-650/40 ml-1 animate-pulse align-middle select-none">▮</span>
            </>
          )}
        </div>
      </div>
 
      {/* AI Code Review Panel */}
      <div className="flex flex-col glass-spatial rounded-3xl overflow-hidden h-60">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-300">AI Code Review</span>
          </div>
          {reviewResult && (
            <button
              onClick={onCloseReview}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-bold transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto text-xs leading-relaxed custom-scrollbar bg-transparent">
          {reviewResult ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 animate-pulse" />
                <span>Mentorship Analysis Complete</span>
              </div>
              <p className="text-slate-300 font-semibold leading-relaxed">
                {reviewResult}
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 bg-transparent">
              <Sparkles className="w-8 h-8 text-indigo-500/20 mb-2 stroke-[1.5]" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                AI Peer Reviewer
              </span>
              <p className="text-[11px] text-slate-500 font-semibold max-w-xs leading-relaxed">
                Run an AI Review to scan for edge cases, performance notes, and language-specific optimizations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
