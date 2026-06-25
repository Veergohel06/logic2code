'use client';

import { Sparkles, HelpCircle, Loader2 } from 'lucide-react';

interface HintPanelProps {
  hints: string[];
  getHint: () => Promise<void>;
  loadingHint: boolean;
}

export default function HintPanel({ hints, getHint, loadingHint }: HintPanelProps) {
  return (
    <div className="glass-spatial rounded-3xl p-5 border border-white/10 shadow-spatial-glow-indigo/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-extrabold text-white">
            Progressive Hints
          </span>
        </div>
        
        {hints.length === 0 && (
          <button
            onClick={getHint}
            disabled={loadingHint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/30 disabled:bg-white/5 border border-indigo-900/30 rounded-xl text-xs font-bold text-indigo-400 disabled:text-slate-500 transition-all cursor-pointer"
          >
            {loadingHint ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Get Hint</span>
          </button>
        )}
      </div>

      {hints.length > 0 ? (
        <div className="flex flex-col gap-3">
          {hints.map((hint, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="flex items-center justify-center w-5.5 h-5.5 rounded-lg bg-indigo-950/30 border border-indigo-900/20 text-indigo-400 text-xs font-extrabold shrink-0">
                {i + 1}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold pt-0.5">
                {hint}
              </p>
            </div>
          ))}
          
          <button
            onClick={getHint}
            disabled={loadingHint}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-slate-400 transition-all cursor-pointer mt-1"
          >
            {loadingHint && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            <span>Get Another Hint</span>
          </button>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400 font-semibold bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
          Stuck on logic? Click "Get Hint" for progressive clues tailored to your current language setting!
        </div>
      )}
    </div>
  );
}
