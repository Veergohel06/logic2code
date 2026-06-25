'use client';

import Link from 'next/link';
import XPCard from '@/frontend/components/dashboard/XPCard';
import StreakCard from '@/frontend/components/dashboard/StreakCard';
import ProgressCard from '@/frontend/components/dashboard/ProgressCard';
import AchievementCard from '@/frontend/components/dashboard/AchievementCard';
import useLanguage from '@/frontend/hooks/useLanguage';
import { useProgress } from '@/frontend/hooks/useProgress';
import { LANGUAGES } from '@/config/languages';
import { generateCareerRoadmap, CAREER_TRACKS } from '@/config/careerRoadmaps';
import { Sparkles, BookOpen, Briefcase, ArrowRight, Award, Zap } from 'lucide-react';

export default function Dashboard() {
  const { language, careerGoal, experienceLevel } = useLanguage();
  const { completedProblems } = useProgress();
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const track = CAREER_TRACKS.find((t) => t.id === careerGoal) || CAREER_TRACKS[0];

  const roadmapNodes = generateCareerRoadmap(careerGoal, language, experienceLevel, completedProblems);

  // Next recommended lesson is the first module that is not completed
  const nextLesson = roadmapNodes.find((n) => n.type === 'module' && n.status !== 'completed');

  // Next recommended project is the first project that is not completed
  const nextProject = roadmapNodes.find((n) => n.type === 'project' && n.status !== 'completed');

  // Calculate completed nodes for active language and career goal
  const completedNodes = roadmapNodes.filter((n) => n.status === 'completed').length;
  const totalNodes = roadmapNodes.length || 1;
  const progressPercent = Math.round((completedNodes / totalNodes) * 100);

  // If onboarding is in progress or not loaded, return loading (layout will redirect anyway)
  if (!careerGoal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full py-4 animate-fade-in">
      {/* Welcome Message Banner — glassmorphism + slide-up + gradient text + animated orb */}
      <div className="glass-spatial flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl p-6 relative overflow-hidden animate-slide-up border border-white/10 shadow-spatial-glow-blue/5">
        {/* Animated gradient orb background */}
        <div
          className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(59,130,246,0.25) 50%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        {/* macOS Window Controls */}
        <div className="flex items-center gap-1.5 select-none shrink-0 md:order-first order-last md:mb-0 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20" />
        </div>

        <div className="flex flex-col gap-1.5 relative z-10 flex-grow">
          <h2 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Welcome back, Developer! 👋
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            You are pursuing the <strong className="text-blue-400 font-bold">{track.name}</strong> track using <strong className="text-indigo-400 font-bold">{activeLang.name}</strong> ({experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} level).
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-900/30 text-[10px] font-bold text-blue-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personalized Roadmap Generated</span>
        </div>
      </div>

      {/* Stat Cards Grid — with decorative gradient mesh + stagger wrapper */}
      <div className="relative">
        {/* Decorative gradient mesh background */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <div
            className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
              animation: 'float 7s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-0 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
              animation: 'float 9s ease-in-out infinite reverse',
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
              animation: 'float 5s ease-in-out infinite',
            }}
          />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{
            '--stagger-delay': '0.1s',
          } as React.CSSProperties}
        >
          <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <XPCard />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <StreakCard />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            <ProgressCard />
          </div>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Lesson Card */}
        <div 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          }}
          className="glass-spatial-card rounded-3xl p-6 flex flex-col justify-between group spatial-3d-card animate-slide-up border border-white/10 hover:border-blue-500/35"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          {/* Window Controls Dot */}
          <div className="flex items-center gap-1 mb-4 select-none opacity-45 group-hover:opacity-100 transition-opacity duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-950/40 text-blue-400 border border-blue-900/30">
                Recommended Lesson
              </span>
              {nextLesson && (
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {nextLesson.xpReward} XP
                </span>
              )}
            </div>

            {nextLesson ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/30 border border-blue-900/20 flex items-center justify-center text-blue-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
                      {nextLesson.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      {nextLesson.description}
                    </p>
                  </div>
                </div>

                {nextLesson.objectives && nextLesson.objectives.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Objectives
                    </span>
                    <ul className="flex flex-col gap-1.5">
                      {nextLesson.objectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="text-xs font-medium text-slate-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                          <span className="truncate">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">All modules completed!</p>
                <p className="text-xs text-slate-400 mt-1">Check out your projects and certifications.</p>
              </div>
            )}
          </div>

          {nextLesson && (
            <Link
              href="/roadmap"
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Next Project Card */}
        <div 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          }}
          className="glass-spatial-card rounded-3xl p-6 flex flex-col justify-between group spatial-3d-card animate-slide-up border border-white/10 hover:border-purple-500/35"
          style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
        >
          {/* Window Controls Dot */}
          <div className="flex items-center gap-1 mb-4 select-none opacity-45 group-hover:opacity-100 transition-opacity duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-950/40 text-purple-400 border border-purple-900/30">
                Recommended Project
              </span>
              {nextProject && (
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {nextProject.xpReward} XP
                </span>
              )}
            </div>

            {nextProject ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight mb-1 group-hover:text-purple-400 transition-colors">
                      {nextProject.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      {nextProject.description}
                    </p>
                  </div>
                </div>

                {nextProject.objectives && nextProject.objectives.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Project Goals
                    </span>
                    <ul className="flex flex-col gap-1.5">
                      {nextProject.objectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="text-xs font-medium text-slate-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                          <span className="truncate">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">All projects completed!</p>
                <p className="text-xs text-slate-400 mt-1">Great job applying your knowledge!</p>
              </div>
            )}
          </div>

          {nextProject && (
            <Link
              href="/roadmap"
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>Build Project</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Achievement Card */}
      <div
        className="grid grid-cols-1 gap-6 animate-slide-up"
        style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
      >
        <AchievementCard />
      </div>
    </div>
  );
}
