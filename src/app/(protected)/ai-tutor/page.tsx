'use client';

import TutorChat from '@/frontend/components/tutor/TutorChat';
import useLanguage from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { MessageSquare } from 'lucide-react';

export default function AITutorPage() {
  const { language } = useLanguage();
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className="flex-grow flex flex-col gap-8 w-full py-4">
      {/* Welcome Message Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-spatial animate-slide-up rounded-3xl p-6 relative overflow-hidden border border-white/10 shadow-spatial-glow-blue/5">
        {/* macOS Window Controls */}
        <div className="flex items-center gap-1.5 select-none shrink-0 md:order-first order-last md:mb-0 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20" />
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-2xl" />
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            General Mentorship
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight capitalize text-gradient">
            {activeLang.name} AI Tutor Coach
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">
            Chat with a mentor configured to explain algorithms and coding paradigms using {activeLang.name} principles.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-900/30 text-[10px] font-bold text-blue-400 shrink-0">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Interactive Chat Session</span>
        </div>
      </div>

      {/* Tutor Panel */}
      <div className="flex-grow w-full animate-slide-up delay-1">
        <TutorChat />
      </div>
    </div>
  );
}
