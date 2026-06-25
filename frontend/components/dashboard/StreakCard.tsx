'use client';

import { useState, useEffect } from 'react';
import { useProgress } from '@/frontend/hooks/useProgress';
import { Zap } from 'lucide-react';

export default function StreakCard() {
  const { streak } = useProgress();

  const today = new Date();
  const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 = Monday, ..., 6 = Sunday
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const weekDays = dayNames.map((name, idx) => {
    let isActive = false;
    if (streak > 0) {
      const diff = currentDayOfWeek - idx;
      if (diff >= 0 && diff < streak) {
        isActive = true;
      }
    }
    return { name, active: isActive };
  });

  // Animated streak counter
  const [displayedStreak, setDisplayedStreak] = useState(0);

  useEffect(() => {
    const target = streak;
    if (target === 0) { setDisplayedStreak(0); return; }
    const duration = 1000;
    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayedStreak(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [streak]);

  return (
    <div
      className="glass-spatial rounded-3xl p-6 relative overflow-hidden group animate-slide-up hover-lift"
      style={{ animationDelay: '0.1s' }}
    >
      {/* Ambient orb */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-gradient-to-br from-amber-400/25 via-orange-400/15 to-transparent blur-2xl animate-float-slow animate-morph pointer-events-none" />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-bounce-in">
          <Zap className="w-6 h-6 stroke-[2] fill-amber-500/10" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Daily Streak
          </span>
          <span className="text-base font-extrabold text-white">
            Keep the Fire Hot
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span
          className={`text-4xl font-black tracking-tight ${
            streak > 0
              ? 'text-amber-500 animate-glow-pulse'
              : 'text-white'
          }`}
        >
          {displayedStreak} <span className="text-xs font-semibold text-slate-400">Days</span>
        </span>
        <span className="text-xs font-bold text-amber-600">
          {streak > 0 ? '🔥 Streak Active' : 'Start Today!'}
        </span>
      </div>

      {/* Week Trackers with stagger animation */}
      <div className="flex justify-between items-center bg-white/5 dark:bg-white/5 p-2.5 rounded-2xl border border-white/10">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1.5 animate-slide-up"
            style={{ animationDelay: `${0.3 + idx * 0.07}s` }}
          >
            <span className="text-[10px] font-bold text-slate-400">{day.name}</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${
                day.active
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/20 animate-glow-pulse'
                  : 'bg-white/10 border border-white/20 text-slate-400'
              }`}
            >
              {day.active ? '🔥' : '•'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
