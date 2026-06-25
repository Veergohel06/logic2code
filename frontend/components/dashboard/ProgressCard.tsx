'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/frontend/hooks/useLanguage';
import { useProgress } from '@/frontend/hooks/useProgress';
import { generateCareerRoadmap, CAREER_TRACKS } from '@/config/careerRoadmaps';
import { LANGUAGES } from '@/config/languages';
import { BarChart3, CheckCircle2 } from 'lucide-react';

export default function ProgressCard() {
  const { language, careerGoal, experienceLevel } = useLanguage();
  const { completedProblems } = useProgress();

  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const track = CAREER_TRACKS.find((t) => t.id === careerGoal) || CAREER_TRACKS[0];

  const roadmapNodes = generateCareerRoadmap(careerGoal, language, experienceLevel, completedProblems);

  const completedNodes = roadmapNodes.filter((n) => n.status === 'completed').length;
  const totalNodes = roadmapNodes.length || 1;
  const progressPercent = Math.round((completedNodes / totalNodes) * 100);

  // Animated counter
  const [displayedPercent, setDisplayedPercent] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const target = progressPercent;
    if (target === 0) { setDisplayedPercent(0); return; }
    const duration = 1000;
    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayedPercent(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [progressPercent]);

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(progressPercent), 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // SVG circular progress
  const circleRadius = 28;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (displayedPercent / 100) * circleCircumference;

  return (
    <div
      className="glass-spatial rounded-3xl p-6 relative overflow-hidden group animate-slide-up hover-lift"
      style={{ animationDelay: '0.2s' }}
    >
      {/* Ambient orb */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${activeLang.color} opacity-10 blur-2xl animate-float-slow animate-morph pointer-events-none`} />

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeLang.color} flex items-center justify-center text-white shadow-sm animate-bounce-in`}>
          <BarChart3 className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Roadmap Track
          </span>
          <span className="text-sm font-extrabold text-white">
            {track?.name || 'Career'} Path
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        {/* Circular progress + percentage */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r={circleRadius}
                fill="none"
                stroke="currentColor"
                className="text-slate-200/30"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r={circleRadius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
              {displayedPercent}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tight">
              {displayedPercent}%
              <span className="text-xs font-semibold text-slate-400 ml-1">Done</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              {completedNodes} of {totalNodes} steps
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-slate-200/30">
        <div
          className={`h-full bg-gradient-to-r ${activeLang.color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="truncate">Next Focus: <strong className="text-white">{roadmapNodes.find((n) => n.status === 'unlocked')?.title || 'Completed!'}</strong></span>
      </div>
    </div>
  );
}
