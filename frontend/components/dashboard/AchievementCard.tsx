'use client';

import { useLanguage } from '@/frontend/hooks/useLanguage';
import { useProgress } from '@/frontend/hooks/useProgress';
import { ACHIEVEMENTS } from '@/config/achievements';
import { Award, Lock, Check, Sparkles, Globe, Brain, Zap, Terminal, Heart, Eye } from 'lucide-react';

export default function AchievementCard() {
  const { language } = useLanguage();
  const { unlockedAchievements } = useProgress();

  // Filter achievements: global and active language specific
  const activeAchievements = ACHIEVEMENTS.filter(
    (a) => a.languageId === 'global' || a.languageId === language
  );

  const getIcon = (icon: string, isUnlocked: boolean) => {
    const colorClass = isUnlocked ? 'text-blue-400' : 'text-slate-600';
    switch (icon) {
      case 'globe':
        return <Globe className={`w-5 h-5 ${colorClass}`} />;
      case 'brain':
        return <Brain className={`w-5 h-5 ${colorClass}`} />;
      case 'zap':
        return <Zap className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Award className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="glass-spatial rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Milestones
          </span>
          <span className="text-xl font-extrabold text-white">
            Achievements
          </span>
        </div>
        <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-xl font-semibold">
          {unlockedAchievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-0.5">
        {activeAchievements.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`flex items-center gap-4 p-3.5 border rounded-2xl transition-all duration-200 relative group ${
                isUnlocked
                  ? 'bg-white/5 border-white/10 hover:border-white/20'
                  : 'bg-white/2 border-white/5 opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isUnlocked
                    ? 'bg-blue-950/40 border-blue-900/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {getIcon(ach.icon, isUnlocked)}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 pr-4">
                <span className={`text-sm font-bold truncate ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                  {ach.title}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {ach.description}
                </span>
                {isUnlocked && (
                  <span className="text-[9px] text-emerald-400 font-semibold mt-1">
                    +{ach.xpReward} XP claimed
                  </span>
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {isUnlocked ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
