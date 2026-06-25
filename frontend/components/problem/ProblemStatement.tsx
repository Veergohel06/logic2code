'use client';

import { ProblemConfig } from '@/config/problems';
import { BookOpen, Key, Info } from 'lucide-react';

interface ProblemStatementProps {
  problem: ProblemConfig;
  isCompleted?: boolean;
}

export default function ProblemStatement({ problem, isCompleted }: ProblemStatementProps) {
  const getDifficultyColor = (diff: string) => {
    return diff === 'Easy'
      ? 'bg-emerald-950/40 border-emerald-900/30 text-emerald-400'
      : 'bg-amber-950/40 border-amber-900/30 text-amber-400';
  };

  return (
    <div className="glass-spatial rounded-3xl p-6 flex flex-col gap-6">
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Coding Challenge
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">
                {problem.title}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.15)] font-mono animate-fade-in shrink-0">
                  Solved ✓
                </span>
              )}
            </div>
          </div>
        </div>
        
        <span className={`text-xs font-bold px-3 py-1 border rounded-full ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>

      {/* Description */}
      <div>
        <p className="text-sm font-semibold text-slate-300 leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* IO Spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 border border-white/10 rounded-2xl">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Input Format
          </span>
          <code className="text-xs font-mono text-blue-400 font-bold block bg-white/5 p-2 rounded-lg border border-white/10">
            {problem.inputSpec}
          </code>
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Expected Output
          </span>
          <code className="text-xs font-mono text-emerald-400 font-bold block bg-white/5 p-2 rounded-lg border border-white/10">
            {problem.outputSpec}
          </code>
        </div>
      </div>

      {/* Constraints */}
      <div>
        <div className="flex items-center gap-1.5 text-slate-400 mb-2.5">
          <Key className="w-4.5 h-4.5 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300">Constraints & Requirements</span>
        </div>
        <ul className="space-y-2">
          {problem.constraints.map((c, i) => (
            <li key={i} className="flex gap-2 items-center text-xs text-slate-400 font-semibold">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logic Breakdown banner */}
      <div className="flex gap-3 bg-indigo-950/40 border border-indigo-900/30 p-3.5 rounded-2xl">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-white">Solve With Me Mode</span>
          <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Stuck on syntax? Complete your logic thoughts using Pseudocode or the Event visualizer on the right before compiling!
          </span>
        </div>
      </div>
    </div>
  );
}
