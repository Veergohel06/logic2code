'use client';

import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { CAREER_TRACKS } from '@/config/careerRoadmaps';
import { PROBLEMS, ProblemConfig } from '@/config/problems';
import { ACHIEVEMENTS } from '@/config/achievements';
import {
  Sparkles,
  Lock,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  Briefcase,
  Award,
  HelpCircle,
  FileBadge,
  CheckCircle,
  Flame,
  Zap,
  Crown,
  Trophy,
  ArrowRight,
  TrendingUp,
  X,
  Target,
  ArrowDown,
  ChevronRight,
  Users,
  Terminal,
  Code
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useProgress } from '@/frontend/hooks/useProgress';
import QuizModal from '@/frontend/components/roadmap/QuizModal';
import FlashcardModal from '@/frontend/components/roadmap/FlashcardModal';
import CelebrationModal from '@/frontend/components/roadmap/CelebrationModal';
import { motion, AnimatePresence } from 'framer-motion';

// Robust keyword matching function to group problems by core roadmap skills
function getProblemSkill(problemId: string, language: string): string {
  const isJS = language === 'javascript' || language === 'typescript';
  const idLower = problemId.toLowerCase();
  
  if (
    idLower.includes('two-sum') || 
    idLower.includes('stock') || 
    idLower.includes('largest') || 
    idLower.includes('array') || 
    idLower.includes('mean-median') || 
    idLower.includes('str-rev') ||
    idLower.includes('numbers')
  ) {
    return 'Arrays';
  }
  
  if (
    idLower.includes('parentheses') || 
    idLower.includes('stairs') || 
    idLower.includes('vowels') ||
    idLower.includes('profile')
  ) {
    return 'Functions';
  }
  
  if (
    idLower.includes('linked-list') || 
    idLower.includes('sorted-lists') || 
    idLower.includes('library') || 
    idLower.includes('stl') || 
    idLower.includes('dataframe')
  ) {
    return 'Objects';
  }
  
  // Concurrency & Async
  if (
    idLower.includes('todo') ||
    idLower.includes('csv') ||
    idLower.includes('bank') ||
    idLower.includes('goroutine') ||
    idLower.includes('concurrent')
  ) {
    return isJS ? 'Async JavaScript' : 'Concurrency & I/O';
  }
  
  return 'Arrays'; // Fallback
}

// XP animated counter component
function AnimatedXP({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); // easeOutQuad
      const current = Math.floor(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(end);
        prevValueRef.current = end;
      }
    };

    requestAnimationFrame(update);

    return () => {
      prevValueRef.current = end;
    };
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function ProblemsList() {
  const { language, careerGoal, experienceLevel } = useLanguage();
  const { xp, streak, completedProblems, addXP } = useProgress();
  
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const track = CAREER_TRACKS.find((t) => t.id === careerGoal) || CAREER_TRACKS[0];

  // 1. DYNAMIC SKILL GROUP GENERATION
  const skillGroups = useMemo(() => {
    const rawProblems = PROBLEMS[language] || [];
    const isJS = language === 'javascript' || language === 'typescript';
    const skillsList = [
      { id: 'arrays', name: 'Arrays', icon: Code, color: 'from-blue-500/10 to-cyan-500/10 text-blue-400' },
      { id: 'functions', name: 'Functions', icon: Terminal, color: 'from-purple-500/10 to-indigo-500/10 text-purple-400' },
      { id: 'objects', name: 'Objects', icon: BookOpen, color: 'from-emerald-500/10 to-teal-500/10 text-emerald-400' },
      { id: 'async', name: isJS ? 'Async JavaScript' : 'Concurrency & I/O', icon: Sparkles, color: 'from-amber-500/10 to-orange-500/10 text-amber-400' }
    ];

    return skillsList.map(skill => {
      // Filter problems for this skill
      const filtered = rawProblems.filter(p => getProblemSkill(p.id, language) === skill.name);

      // Sort: Easy first, then Medium
      const sorted = [...filtered].sort((a, b) => {
        if (a.difficulty === 'Easy' && b.difficulty === 'Medium') return -1;
        if (a.difficulty === 'Medium' && b.difficulty === 'Easy') return 1;
        return 0;
      });

      // Apply sequential unlocking status within this skill category
      let foundFirstUncompleted = false;
      const problemsWithStatus = sorted.map(prob => {
        const isCompleted = completedProblems.includes(`${prob.id}_${language}`);
        let status: 'completed' | 'current' | 'locked' = 'locked';

        if (isCompleted) {
          status = 'completed';
        } else if (!foundFirstUncompleted) {
          status = 'current';
          foundFirstUncompleted = true;
        } else {
          status = 'locked';
        }

        return {
          ...prob,
          status,
          xpReward: prob.difficulty === 'Easy' ? 100 : 150,
          estimatedTime: prob.difficulty === 'Easy' ? '10 mins' : '20 mins'
        };
      });

      const total = problemsWithStatus.length;
      const completed = problemsWithStatus.filter(p => p.status === 'completed').length;
      const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...skill,
        problems: problemsWithStatus,
        total,
        completed,
        progressPercent
      };
    }).filter(group => group.total > 0); // Hide empty sections for the active language
  }, [completedProblems, language]);

  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ type: 'milestone' | 'certificate'; title: string; xp: number; objectives: string[] } | null>(null);

  // Daily Challenge Logic: Solve 3 problems cycle
  const dailyCount = completedProblems.length === 0 ? 0 : completedProblems.length % 3 === 0 ? 3 : completedProblems.length % 3;
  const [dailyClaimed, setDailyClaimed] = useState(false);

  useEffect(() => {
    const cycle = Math.floor(completedProblems.length / 3);
    const storedClaimed = localStorage.getItem(`daily_claimed_cycle_${language}_${cycle}`);
    setDailyClaimed(!!storedClaimed);
  }, [completedProblems.length, language]);

  const handleClaimDaily = () => {
    if (dailyCount === 3 && !dailyClaimed) {
      addXP(100);
      const cycle = Math.floor(completedProblems.length / 3);
      localStorage.setItem(`daily_claimed_cycle_${language}_${cycle}`, 'true');
      setDailyClaimed(true);
      
      setCelebrationData({
        type: 'milestone',
        title: 'Daily Quest Completed!',
        xp: 100,
        objectives: ['Solve 3 problems', 'Claim Daily XP Bonus']
      });
      setIsCelebrationOpen(true);
    }
  };

  // Default select first current/active problem on load or language change
  const prevLangRef = useRef(language);
  useEffect(() => {
    if (prevLangRef.current !== language || !selectedNode) {
      prevLangRef.current = language;
      let firstCurrent: any = null;
      for (const group of skillGroups) {
        const found = group.problems.find(p => p.status === 'current');
        if (found) {
          firstCurrent = found;
          break;
        }
      }
      if (!firstCurrent && skillGroups.length > 0 && skillGroups[0].problems.length > 0) {
        firstCurrent = skillGroups[0].problems[0];
      }
      setSelectedNode(firstCurrent);
    }
  }, [language, skillGroups, selectedNode]);

  // Sticky header scroll display state
  const [headerVisible, setHeaderVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (Math.abs(prevScrollY - currentScrollY) < 8) {
        return;
      }

      const isVisible = prevScrollY > currentScrollY || currentScrollY < 15;
      setHeaderVisible(isVisible);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Progression Metrics
  const totalProblemsCount = skillGroups.reduce((acc, g) => acc + g.total, 0);
  const completedProblemsCount = skillGroups.reduce((acc, g) => acc + g.completed, 0);
  const overallPercentComplete = totalProblemsCount > 0 ? Math.round((completedProblemsCount / totalProblemsCount) * 100) : 0;

  // Style resolved based on problem status with premium glassmorphism configurations
  const getCardStyles = (status: 'completed' | 'current' | 'locked') => {
    switch (status) {
      case 'completed':
        return {
          container: 'glass-spatial border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-spatial-glow-emerald/15 hover:scale-[1.01] hover:-translate-y-0.5 cursor-pointer',
          title: 'text-white font-bold',
          difficulty: 'text-slate-300'
        };
      case 'current':
        return {
          container: 'glass-spatial border-blue-500/40 hover:border-blue-400 hover:shadow-spatial-glow-blue/20 hover:scale-[1.02] hover:-translate-y-1 ring-2 ring-blue-500/20 shadow-spatial-glow-blue/15 cursor-pointer',
          title: 'text-white font-black',
          difficulty: 'text-slate-100'
        };
      case 'locked':
        return {
          container: 'glass-spatial border-white/5 opacity-55 shadow-none cursor-not-allowed select-none',
          title: 'text-slate-500 font-bold',
          difficulty: 'text-slate-600'
        };
    }
  };

  const getActionLink = (node: any) => {
    return (
      <Link
        href={`/problems/${node.id}`}
        className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <span>Solve Exercise</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    );
  };

  const renderDetailsCard = (isMobile: boolean) => {
    if (!selectedNode) return null;
    
    return (
      <div className={`flex flex-col gap-4.5 ${isMobile ? 'w-full' : ''}`}>
        {/* Header with Close */}
        <div className="flex justify-between items-start border-b border-white/10 pb-3">
          <div>
            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-950/45 text-blue-400 uppercase tracking-widest block w-max leading-none mb-1.5 font-mono">
              {getProblemSkill(selectedNode.id, language)} Section
            </span>
            <h3 className="text-sm font-black text-white tracking-tight mt-1 leading-snug">
              {selectedNode.title}
            </h3>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          {selectedNode.description}
        </p>

        {/* Objectives / Constraints */}
        {selectedNode.constraints && selectedNode.constraints.length > 0 && (
          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-xl">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2 leading-none">
              Constraints & Bounds:
            </span>
            <ul className="space-y-2 text-xs font-bold text-slate-300 leading-relaxed font-mono">
              {selectedNode.constraints.map((obj: string, i: number) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Input/Output Specifications */}
        {(selectedNode.inputSpec || selectedNode.outputSpec) && (
          <div className="flex flex-col gap-2.5 bg-slate-950/40 border border-white/5 p-3.5 rounded-xl text-[10px] font-mono text-slate-300">
            {selectedNode.inputSpec && (
              <div>
                <span className="text-slate-500 font-black uppercase text-[8px] block mb-0.5">Input Parameters</span>
                <span>{selectedNode.inputSpec}</span>
              </div>
            )}
            {selectedNode.outputSpec && (
              <div className="border-t border-white/5 pt-2 mt-1">
                <span className="text-slate-500 font-black uppercase text-[8px] block mb-0.5">Expected Output</span>
                <span>{selectedNode.outputSpec}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions & Rewards */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 leading-none font-mono">
            <span>Difficulty / XP:</span>
            <span className="text-white font-extrabold text-xs">
              {selectedNode.difficulty} • +{selectedNode.xpReward} XP
            </span>
          </div>
          <div className="h-px bg-white/10 my-1" />
          {selectedNode.status === 'locked' ? (
            <button
              disabled
              className="w-full h-11 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>Locked Exercise</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {getActionLink(selectedNode)}
              <button
                onClick={() => setIsFlashcardsOpen(true)}
                className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Practice Flashcards</span>
                <BookOpen className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!careerGoal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-transparent">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-6 w-full py-4 relative min-h-screen">
      {/* Background aesthetics - Colorful lights for glass reflection */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 -z-10 pointer-events-none" />
      <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse duration-[8s]" />

      {/* Sticky Top Context Header - Glassmorphic floating card */}
      <motion.div
        animate={{ 
          y: headerVisible ? 0 : -140,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-[48px] z-30 w-full glass-spatial border border-white/10 rounded-2xl p-4.5 shadow-xl shadow-black/30 flex flex-col sm:flex-row gap-4 items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
            <Terminal className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white tracking-tight leading-none uppercase flex items-center gap-1.5">
              <span>{track?.name}</span>
              <span className="text-[10px] text-blue-400 font-extrabold bg-blue-950/40 border border-blue-900/40 px-2 py-0.5 rounded-full normal-case font-mono">{activeLang.name} Track</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5">
              <span>Problems Dashboard</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-blue-400">{selectedNode ? getProblemSkill(selectedNode.id, language) : 'Standard'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Level Progress */}
          <div className="flex items-center gap-2 bg-slate-900/40 border border-white/5 px-3 py-1.5 rounded-xl h-9">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-black uppercase leading-none">Overall Progress</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-16 sm:w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallPercentComplete}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[9px] font-black text-white font-mono">{overallPercentComplete}%</span>
              </div>
            </div>
          </div>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 bg-indigo-950/20 border border-indigo-900/30 text-indigo-400 px-3 py-1.5 rounded-xl h-9">
            <Zap className="w-3.5 h-3.5 fill-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-indigo-400/70 font-black uppercase leading-none">Total XP</span>
              <span className="text-[11px] font-black text-white leading-tight mt-0.5 font-mono">
                <AnimatedXP value={xp} />
              </span>
            </div>
          </div>

          {/* Streak Pill */}
          <div className="flex items-center gap-1.5 bg-amber-950/20 border border-amber-900/30 text-amber-500 px-3 py-1.5 rounded-xl h-9">
            <Flame className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] text-amber-500/70 font-black uppercase leading-none">Streak</span>
              <span className="text-[11px] font-black text-white leading-tight mt-0.5 font-mono">{streak} Days</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        
        {/* Left Column: Challenges Board */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* DAILY CHALLENGE TOP CARD - Premium glass card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-spatial border border-purple-500/25 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-spatial-glow-purple/5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4.5 z-10">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/10 shrink-0">
                <Target className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest leading-none">Daily Challenge</span>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight mt-1.5">
                  Solve 3 Problems Today
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-1 leading-normal">
                  Keep your streak alive. Reward resets every 3 solved challenges.
                </p>
                <div className="flex items-center gap-2 mt-3.5">
                  <div className="w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-amber-500 to-purple-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${(dailyCount / 3) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-350 leading-none font-mono">{dailyCount}/3 Solved</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2.5 z-10 shrink-0">
              <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-950/20 border border-amber-900/30 px-3 py-1 rounded-xl">
                <Zap className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
                <span>+100 XP REWARD</span>
              </div>
              {dailyCount === 3 ? (
                <button
                  onClick={handleClaimDaily}
                  disabled={dailyClaimed}
                  className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md ${
                    dailyClaimed
                      ? 'bg-slate-900/60 border border-white/5 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {dailyClaimed ? 'Claimed' : 'Claim Reward'}
                </button>
              ) : (
                <button
                  disabled
                  className="px-4.5 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed"
                >
                  In Progress
                </button>
              )}
            </div>
          </motion.div>

          {/* SKILL SECTIONS LIST */}
          <div className="flex flex-col gap-10">
            {skillGroups.map((group) => {
              const SkillIcon = group.icon;
              const isCompletedAll = group.progressPercent === 100;

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Skill Section Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/20 border-b border-white/5 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-lg bg-slate-900/40 border border-white/5 flex items-center justify-center shadow-inner">
                        <SkillIcon className="w-4.5 h-4.5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white tracking-tight uppercase">
                          {group.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold leading-none mt-1">
                          {group.completed}/{group.total} Completed • {group.progressPercent}% Progress
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Section Progress Bar */}
                      <div className="flex-grow sm:flex-grow-0 sm:w-36 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${group.progressPercent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>

                      {/* Mastery Badge reward */}
                      {isCompletedAll && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.25)] font-mono"
                        >
                          <Trophy className="w-3 h-3 fill-amber-400" />
                          <span>{group.name} Master</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Problem Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.problems.map((prob) => {
                      const isSelected = selectedNode?.id === prob.id;
                      const cardStyle = getCardStyles(prob.status);

                      return (
                        <motion.div
                          key={prob.id}
                          whileHover={prob.status !== 'locked' ? { y: -4, scale: 1.02 } : {}}
                          whileTap={prob.status !== 'locked' ? { scale: 0.98 } : {}}
                          onClick={() => {
                            if (prob.status !== 'locked') {
                              setSelectedNode(prob);
                            }
                          }}
                          className={`flex flex-col p-4 rounded-xl border transition-all duration-300 ${cardStyle.container} ${
                            isSelected && prob.status !== 'locked' ? 'ring-2 ring-blue-500/50 border-blue-450/80 shadow-[0_0_20px_rgba(59,130,246,0.22)] bg-slate-900/80' : ''
                          }`}
                        >
                          {/* Card Header Info */}
                          <div className="flex justify-between items-center mb-2 leading-none">
                            <span className="text-[8px] font-extrabold px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-400 border border-white/5 uppercase tracking-wider font-mono">
                              {group.name}
                            </span>
                            
                            {/* Card Status Indicator */}
                            {prob.status === 'completed' ? (
                              <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase">
                                <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />
                                <span>Done</span>
                              </div>
                            ) : prob.status === 'current' ? (
                              <div className="flex items-center gap-1.5 text-blue-400 text-[9px] font-black uppercase">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                </span>
                                <span>Solve Next</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-slate-500 text-[9px] font-black uppercase">
                                <Lock className="w-3 h-3 text-slate-600" />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>

                          <h4 className={`text-xs md:text-sm tracking-tight mb-3 mt-1.5 leading-snug line-clamp-1 ${cardStyle.title}`}>
                            {prob.title}
                          </h4>

                          {/* Card Footer Specifications */}
                          <div className={`flex items-center justify-between mt-auto pt-2.5 border-t border-white/5 text-[9px] font-bold ${prob.status === 'locked' ? 'text-slate-500' : 'text-slate-400'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase font-mono ${
                                prob.status === 'locked'
                                  ? 'bg-slate-950/45 text-slate-500 border-slate-900/60'
                                  : prob.difficulty === 'Easy' 
                                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' 
                                  : 'bg-amber-950/30 text-amber-400 border-amber-900/30'
                              }`}>
                                {prob.difficulty}
                              </span>
                              <span className="flex items-center gap-1 font-mono font-semibold">
                                <Zap className={`w-3 h-3 ${prob.status === 'locked' ? 'text-slate-600 fill-transparent' : 'text-indigo-400 fill-indigo-400/20'}`} />
                                <span>+{prob.xpReward} XP</span>
                              </span>
                            </div>
                            <span className="font-mono">{prob.estimatedTime}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Information Side Panels */}
        <div className="lg:col-span-1 flex flex-col gap-6 w-full">
          
          {/* Selected Problem Description & Action Card - Styled with premium glassmorphism */}
          <div className="hidden lg:block sticky top-[140px]">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key="desktop-details"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-spatial border border-purple-500/20 rounded-2xl p-5 shadow-2xl flex flex-col gap-4.5 shadow-spatial-glow-purple/10"
                >
                  {/* macOS Window Controls */}
                  <div className="flex items-center gap-1.5 select-none mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20" />
                  </div>
                  {renderDetailsCard(false)}
                </motion.div>
              ) : (
                <motion.div
                  key="desktop-placeholder"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-spatial border border-white/5 rounded-2xl p-6 shadow-xl text-center flex flex-col items-center justify-center py-10"
                >
                  <HelpCircle className="w-10 h-10 text-slate-500 mb-3 animate-pulse" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">No Challenge Selected</h3>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-[200px] leading-relaxed">
                    Select any unlocked coding challenge from the left dashboard grid to begin!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Interactive Modals */}
      {selectedNode && (
        <>
          <FlashcardModal
            isOpen={isFlashcardsOpen}
            onClose={() => setIsFlashcardsOpen(false)}
            nodeId={selectedNode.id}
            nodeTitle={selectedNode.title}
          />
        </>
      )}

      {/* Daily Quest Celebration / unlock notifications */}
      {celebrationData && (
        <CelebrationModal
          isOpen={isCelebrationOpen}
          onClose={() => {
            setIsCelebrationOpen(false);
            setCelebrationData(null);
          }}
          type={celebrationData.type}
          title={celebrationData.title}
          rewardXp={celebrationData.xp}
          objectives={celebrationData.objectives}
        />
      )}

      {/* Mobile Selected Node details overlays */}
      <div className="lg:hidden">
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNode(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-sm relative bg-slate-950 border border-purple-500/35 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 z-10 backdrop-blur-xl"
              >
                {renderDetailsCard(true)}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Loader Component
function LoaderComponent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin" />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assembling coding challenges board...</p>
    </div>
  );
}
