'use client';

import { useState, useEffect } from 'react';
import { useProgress } from '@/frontend/hooks/useProgress';
import { Award, TrendingUp } from 'lucide-react';

export default function XPCard() {
  const { xp } = useProgress();
  const level = Math.floor(xp / 1000) + 1;
  const xpInLevel = xp % 1000;
  const progressPercent = (xpInLevel / 1000) * 100;

  const [displayedXP, setDisplayedXP] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Animate XP count up from 0 to actual value over ~1s
  useEffect(() => {
    const target = xp;
    if (target === 0) { setDisplayedXP(0); return; }
    const duration = 1000;
    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayedXP(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [xp]);

  // Animate progress bar after mount
  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(progressPercent), 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  return (
    <div className="glass-spatial rounded-3xl p-6 relative overflow-hidden group animate-slide-up hover-lift">
      {/* Animated gradient orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-transparent blur-2xl animate-float-slow animate-morph pointer-events-none" />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-bounce-in">
          <Award className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Current Level
          </span>
          <span className="text-base font-extrabold text-white">
            Level {level} Explorer
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-black text-white tracking-tight">
          {displayedXP} <span className="text-xs font-semibold text-slate-400">XP</span>
        </span>
        <span className="text-xs font-bold text-slate-500">
          {xpInLevel}/1000 XP to Level {level + 1}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-slate-200/30">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-semibold mt-3">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>Earn more XP by solving problems in the compiler!</span>
      </div>
    </div>
  );
}
