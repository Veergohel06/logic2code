'use client';

import { useLanguage } from '@/frontend/hooks/useLanguage';
import { LANGUAGES } from '@/config/languages';
import { generateCareerRoadmap, CAREER_TRACKS, CareerRoadmapNode } from '@/config/careerRoadmaps';
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
  Users
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useProgress } from '@/frontend/hooks/useProgress';
import QuizModal from '@/frontend/components/roadmap/QuizModal';
import FlashcardModal from '@/frontend/components/roadmap/FlashcardModal';
import CelebrationModal from '@/frontend/components/roadmap/CelebrationModal';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function Roadmap() {
  const { language, careerGoal, experienceLevel } = useLanguage();
  const { xp, streak, completedProblems, unlockedAchievements, addXP, completeProblem } = useProgress();
  
  const activeLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const track = CAREER_TRACKS.find((t) => t.id === careerGoal) || CAREER_TRACKS[0];
  const nodes = useMemo(() => {
    return generateCareerRoadmap(careerGoal, language, experienceLevel, completedProblems);
  }, [careerGoal, language, experienceLevel, completedProblems]);
  
  const [selectedNode, setSelectedNode] = useState<CareerRoadmapNode | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ type: 'milestone' | 'certificate'; title: string; xp: number; objectives: string[] } | null>(null);
  const [claimedCert, setClaimedCert] = useState<string | null>(null);

  const [headerVisible, setHeaderVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hysteresis threshold to prevent jittering on minor scroll deviations
      if (Math.abs(prevScrollY - currentScrollY) < 8) {
        return;
      }

      // Hide on scroll down, show on scroll up or at the very top of the page
      const isVisible = prevScrollY > currentScrollY || currentScrollY < 15;
      
      setHeaderVisible(isVisible);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // SVG drawing state coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);

  // Default offsets for snaking path
  // Alternates left, center, right to simulate snake winding
  const snakeOffsets = [50, 70, 30, 70, 50, 70, 30, 70, 50, 70, 50, 70, 50];

  // Auto-scroll to active node on load
  useEffect(() => {
    if (nodes.length > 0) {
      // Find the first unlocked node (current active objective)
      const activeNode = nodes.find((n) => n.status === 'unlocked') || nodes[0];
      setSelectedNode(activeNode);

      // Trigger a smooth scroll after coordinates mount
      setTimeout(() => {
        const el = containerRef.current?.querySelector(`[data-node-id="${activeNode.id}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [nodes]);

  // Recalculate node coordinates relative to roadmap container
  useEffect(() => {
    const updateCoords = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const newCoords = nodes.map((node) => {
        const el = container.querySelector(`[data-node-id="${node.id}"]`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      }).filter((c): c is { x: number; y: number } => c !== null);

      // Guard state update to prevent infinite loops from ResizeObserver/render cycles
      setCoords((prev) => {
        const hasChanged = prev.length !== newCoords.length || 
                           prev.some((c, i) => c.x !== newCoords[i].x || c.y !== newCoords[i].y);
        return hasChanged ? newCoords : prev;
      });
    };

    updateCoords();

    // Resize observer catches element alignment changes dynamically
    const observer = new ResizeObserver(() => {
      updateCoords();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateCoords);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCoords);
    };
  }, [nodes]);

  // Gamification Metrics Calculations
  const totalNodes = nodes.length;
  const completedNodes = nodes.filter((n) => n.status === 'completed').length;
  const percentComplete = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpInCurrentLevel = xp % 1000;
  const xpForNextLevel = 1000;
  const xpPercent = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

  // Dynamic user level title names
  const getLevelName = (lvl: number) => {
    if (lvl === 1) return 'Beginner Coder';
    if (lvl === 2) return 'Syntax Apprentice';
    if (lvl === 3) return 'Logic Pioneer';
    if (lvl === 4) return 'Problem Solver';
    if (lvl === 5) return 'Algorithm Builder';
    if (lvl === 6) return 'Framework Specialist';
    if (lvl === 7) return 'System Architect';
    if (lvl === 8) return 'Full Stack Craftsman';
    if (lvl === 9) return 'Senior Engineer';
    return 'Master Developer';
  };

  interface LeaderboardUser {
    name: string;
    xp: number;
    avatar: string;
    isUser?: boolean;
  }

  // Mock Sorted Leaderboard data containing the user
  const MOCK_USERS: LeaderboardUser[] = [
    { name: 'alex_codes', xp: 3450, avatar: 'A', isUser: false },
    { name: 'pixel_ninja', xp: 2780, avatar: 'P', isUser: false },
    { name: 'sarah_js', xp: 2150, avatar: 'S', isUser: false },
    { name: 'elixir_wizard', xp: 1300, avatar: 'E', isUser: false },
    { name: 'byte_boss', xp: 850, avatar: 'B', isUser: false }
  ];

  const userLeaderboardEntry: LeaderboardUser = {
    name: 'You',
    xp: xp,
    avatar: 'U',
    isUser: true
  };

  const sortedLeaderboard = [...MOCK_USERS, userLeaderboardEntry].sort((a, b) => b.xp - a.xp);
  const userRankIndex = sortedLeaderboard.findIndex((u) => u.isUser) + 1;

  // Resolve Lucide icons based on Node type
  const getNodeIcon = (type: string, isLocked: boolean) => {
    let Icon = BookOpen;
    if (type === 'assessment') Icon = ClipboardCheck;
    else if (type === 'project') Icon = Briefcase;
    else if (type === 'milestone') Icon = Award;
    else if (type === 'interview') Icon = HelpCircle;
    else if (type === 'certificate') Icon = Crown;

    return <Icon className={`w-6 h-6 ${isLocked ? 'text-slate-600' : 'text-white'}`} />;
  };

  // Dynamic Cubic Bezier generator for smooth curves between snaking nodes
  const getBezierPath = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dy = p2.y - p1.y;
    const cp1y = p1.y + dy * 0.5;
    const cp2y = p2.y - dy * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${cp1y}, ${p2.x} ${cp2y}, ${p2.x} ${p2.y}`;
  };

  const handleClaimCertificate = (node: CareerRoadmapNode) => {
    setCelebrationData({
      type: 'certificate',
      title: node.title,
      xp: node.xpReward,
      objectives: node.objectives || []
    });
    setIsCelebrationOpen(true);
    setClaimedCert(node.title);
  };

  const handleCompleteMilestone = (node: CareerRoadmapNode) => {
    // Collect milestone rewards
    addXP(node.xpReward);
    completeProblem(node.id, language);

    setCelebrationData({
      type: 'milestone',
      title: node.title,
      xp: node.xpReward,
      objectives: node.objectives || []
    });
    setIsCelebrationOpen(true);
  };

  // Action CTA routes based on Node Type
  const getActionLink = (node: CareerRoadmapNode) => {
    if (node.type === 'project') {
      return (
        <Link
          href="/playground"
          className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md shadow-purple-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Start Project Sandbox</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      );
    }
    if (node.type === 'interview') {
      return (
        <Link
          href="/interview-prep"
          className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Start Mock Interview</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      );
    }
    if (node.type === 'assessment') {
      return (
        <button
          onClick={() => setIsQuizOpen(true)}
          className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Take Checkpoint Quiz</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      );
    }
    if (node.type === 'milestone') {
      return (
        <button
          onClick={() => handleCompleteMilestone(node)}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Claim Milestone Badge</span>
          <Sparkles className="w-4 h-4 text-purple-200" />
        </button>
      );
    }
    if (node.type === 'certificate') {
      return (
        <button
          onClick={() => handleClaimCertificate(node)}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-650 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer animate-pulse"
        >
          <span>Claim Verification Cert</span>
          <Crown className="w-4 h-4 animate-bounce" />
        </button>
      );
    }
    return (
      <Link
        href="/problems"
        className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <span>Start Practice Coding</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    );
  };

  // Node Description Helpers
  const getNodeTypeText = (type: string) => {
    switch (type) {
      case 'module': return '📘 Learning Lesson';
      case 'assessment': return '🧩 Coding Challenge';
      case 'project': return '🚀 Project Sandbox';
      case 'milestone': return '🏆 Career Milestone';
      case 'interview': return '🎯 Interview Prep';
      case 'certificate': return '👑 Certification';
      default: return 'Node Object';
    }
  };

  const getNodeMetadataLabel = (node: CareerRoadmapNode) => {
    switch (node.type) {
      case 'module':
        return `${node.xpReward} XP • ⏱ 15 min`;
      case 'assessment':
        return `3 Challenges • Medium`;
      case 'project':
        return `Capstone Sandbox • Skills: ${node.objectives.length}`;
      case 'milestone':
        return `Achievement Badge Reward`;
      case 'interview':
        return `Mock Board • System Designs`;
      case 'certificate':
        return `Master Credentials Badge`;
      default:
        return `${node.xpReward} XP`;
    }
  };

  const renderDetailsCard = (isMobile: boolean) => {
    if (!selectedNode) return null;
    return (
      <div className={`flex flex-col gap-4.5 ${isMobile ? 'w-full' : ''}`}>
        {/* Header with Close */}
        <div className="flex justify-between items-start border-b border-white/10 pb-3">
          <div>
            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-500/20 bg-purple-950/45 text-purple-400 uppercase tracking-widest block w-max leading-none mb-1.5">
              {getNodeTypeText(selectedNode.type)}
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

        {/* Objectives */}
        {selectedNode.objectives && selectedNode.objectives.length > 0 && (
          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-xl">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2 leading-none">Curriculum Objectives:</span>
            <ul className="space-y-2 text-xs font-bold text-slate-300 leading-relaxed">
              {selectedNode.objectives.map((obj, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions & Rewards */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 leading-none">
            <span>Completion Reward:</span>
            <span className="text-white font-extrabold text-sm">{selectedNode.xpReward} XP</span>
          </div>
          <div className="h-px bg-white/10 my-1" />
          {selectedNode.status === 'locked' ? (
            <button
              disabled
              className="w-full h-11 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>Locked Checkpoint</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {getActionLink(selectedNode)}
              {selectedNode.type === 'module' && (
                <button
                  onClick={() => setIsFlashcardsOpen(true)}
                  className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Practice Flashcards</span>
                  <BookOpen className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // If onboarding not completed, render Loader
  if (!careerGoal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-transparent">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-6 w-full py-4 relative min-h-screen">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[30%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse duration-[12s]" />

      {/* 1. PROGRESSION STICKY HEADER */}
      <motion.div
        animate={{ 
          y: headerVisible ? 0 : -140, // Slide up out of view
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-[48px] z-30 w-full glass-spatial border border-white/10 rounded-2xl p-4.5 shadow-lg shadow-black/20 flex flex-col sm:flex-row gap-4 items-center justify-between mb-4"
      >
        {/* Info label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
            <Trophy className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight leading-tight uppercase flex items-center gap-1.5">
              <span>{track?.name}</span>
              <span className="text-[10px] text-blue-400 font-extrabold bg-blue-950/40 border border-blue-900/40 px-2 py-0.5 rounded-full normal-case">{activeLang.name}</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Level {currentLevel}: {getLevelName(currentLevel)}
            </p>
          </div>
        </div>

        {/* Stats Grid Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Level XP Bar */}
          <div className="flex items-center gap-2 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-xl h-9">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-black uppercase leading-none">Level Progress</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-16 sm:w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[9px] font-black text-white">{Math.round(xpPercent)}%</span>
              </div>
            </div>
          </div>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 bg-indigo-950/20 border border-indigo-900/30 text-indigo-400 px-3 py-1.5 rounded-xl h-9">
            <Zap className="w-3.5 h-3.5 fill-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-indigo-400/70 font-black uppercase leading-none">Total XP</span>
              <span className="text-[11px] font-black text-white leading-tight mt-0.5">
                <AnimatedXP value={xp} />
              </span>
            </div>
          </div>

          {/* Streak Pill */}
          <div className="flex items-center gap-1.5 bg-amber-950/20 border border-amber-900/30 text-amber-500 px-3 py-1.5 rounded-xl h-9">
            <Flame className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] text-amber-500/70 font-black uppercase leading-none">Streak</span>
              <span className="text-[11px] font-black text-white leading-tight mt-0.5">{streak} Days</span>
            </div>
          </div>

          {/* Completion Ring */}
          <div className="flex items-center gap-2.5 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-xl h-9">
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="12" cy="12" r="9.5" stroke="#1e293b" strokeWidth="2.5" fill="transparent" />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="9.5"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 9.5}
                  initial={{ strokeDashoffset: 2 * Math.PI * 9.5 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 9.5 * (1 - percentComplete / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute text-[8px] font-black text-white">{percentComplete}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-emerald-400/70 font-black uppercase leading-none">Path Complete</span>
              <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                {completedNodes}/{totalNodes} Nodes
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. SPLIT LAYOUT: TIMELINE CANVAS LEFT, SIDEBAR RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        
        {/* LEFT COLUMN: TIMELINE CANVAS */}
        <div className="lg:col-span-2 flex flex-col items-center relative py-6 select-none">
          <div
            ref={containerRef}
            className="relative w-full max-w-[480px] min-h-[1450px]"
          >
            {/* SVG CONNECTION LINE LAYER */}
            {coords.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="completed-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="locked-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>
                {coords.map((curr, idx) => {
                  if (idx === 0) return null;
                  const prev = coords[idx - 1];
                  const node = nodes[idx];
                  const prevNode = nodes[idx - 1];
                  // Connects if prev is completed AND current is not locked
                  const isCompleted = prevNode.status === 'completed' && node.status !== 'locked';

                  return (
                    <g key={idx}>
                      {/* Thick background glow for active connections */}
                      {isCompleted && (
                        <motion.path
                          d={getBezierPath(prev, curr)}
                          fill="none"
                          stroke="rgba(168,85,247,0.18)"
                          strokeWidth={14}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: idx * 0.06 }}
                        />
                      )}
                      {/* Foreground standard connection path */}
                      <motion.path
                        d={getBezierPath(prev, curr)}
                        fill="none"
                        stroke={isCompleted ? "url(#completed-grad)" : "url(#locked-grad)"}
                        strokeWidth={4.5}
                        strokeDasharray={node.status === 'locked' ? '6,6' : '0'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, delay: idx * 0.04 }}
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* TIMELINE NODES LIST */}
            {nodes.map((node, idx) => {
              const isCompleted = node.status === 'completed';
              const isLocked = node.status === 'locked';
              const isSelected = selectedNode?.id === node.id;
              
              // Coordinates offsets
              const topPos = idx * 130 + 50;
              const leftPos = snakeOffsets[idx % snakeOffsets.length];

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    top: `${topPos}px`,
                    left: `${leftPos}%`,
                    transform: 'translateX(-50%)'
                  }}
                  className={`flex flex-col items-center ${isSelected ? 'z-30' : 'z-10'}`}
                >
                  {/* Floating active CTA Start bubble indicator */}
                  {!isCompleted && !isLocked && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-purple-600 text-[9px] font-black text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-purple-500/20 flex items-center gap-0.5 animate-bounce">
                      <span>Start</span>
                      <ArrowDown className="w-3 h-3 text-purple-200" />
                    </div>
                  )}

                  {/* Node Bubble */}
                  <motion.button
                    data-node-id={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    whileHover={{ scale: isLocked ? 1 : 1.15 }}
                    whileTap={{ scale: isLocked ? 1 : 0.92 }}
                    animate={
                      !isCompleted && !isLocked
                        ? { y: [0, -6, 0] } // Pulse float for current active node
                        : {}
                    }
                    transition={{
                      y: {
                        repeat: Infinity,
                        duration: 2,
                        ease: 'easeInOut'
                      }
                    }}
                    className={`relative w-15 h-15 md:w-17 md:h-17 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-md ${
                      isCompleted
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer hover:shadow-[0_0_22px_rgba(59,130,246,0.65)] text-white'
                        : isLocked
                        ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                        : 'bg-slate-950 border-purple-500/90 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-4 ring-purple-500/15 cursor-pointer hover:border-purple-400 text-white'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-5.5 h-5.5 text-slate-600" />
                    ) : (
                      getNodeIcon(node.type, isLocked)
                    )}

                    {/* Small success tick check badge for completed nodes */}
                    {isCompleted && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-4 h-4 text-white fill-emerald-500" />
                      </div>
                    )}

                    {/* Double pulsing active rings */}
                    {!isCompleted && !isLocked && (
                      <>
                        <div className="absolute inset-0 rounded-2xl bg-purple-500/10 animate-ping pointer-events-none" />
                        <div className="absolute -inset-1.5 rounded-2xl border border-purple-500/20 animate-pulse pointer-events-none" />
                      </>
                    )}
                  </motion.button>

                  {/* Compact Title label underneath node */}
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border mt-2 text-center shadow-sm max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap block transition-colors duration-200 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isLocked
                      ? 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                      : 'bg-slate-900/80 border-white/5 text-slate-300'
                  }`}>
                    {node.title}
                  </span>

                  {/* Details card has been moved to the right sidebar (desktop) and centered modal overlay (mobile) to keep timeline unobstructed */}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: PROGRESSION SIDEBAR */}
        <div className="lg:col-span-1 flex flex-col gap-6 w-full">
          
          {/* Desktop Selected Node Details Card */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div
                  key="desktop-details"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-spatial border border-purple-500/35 rounded-2xl p-5 shadow-lg flex flex-col gap-4.5 mb-2 shadow-spatial-glow-purple/15 relative overflow-hidden group"
                >
                  {/* macOS Window Controls */}
                  <div className="flex items-center gap-1.5 select-none mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/20" />
                  </div>
                  {renderDetailsCard(false)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* A. CURRENT MISSION */}
          <div className="glass-spatial bg-slate-950/20 border border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Current Mission</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/10 p-3.5 rounded-xl">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none block mb-1">Active Objective</span>
              <p className="text-xs text-white font-extrabold leading-snug">
                {nodes.find((n) => n.status === 'unlocked')?.title || 'Claim your Certification!'}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                Complete assessments, review flashcards, and submit sandbox projects to unlock secondary milestone nodes.
              </p>
            </div>
          </div>

          {/* B. SORTED LEADERBOARD */}
          <div className="glass-spatial bg-slate-950/20 border border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Weekly League</h3>
              </div>
              <span className="text-[9px] font-black text-blue-400 bg-blue-950/30 border border-blue-900/30 px-2.5 py-0.5 rounded-full uppercase">Rank #{userRankIndex}</span>
            </div>

            <div className="flex flex-col gap-2">
              {sortedLeaderboard.map((item, idx) => {
                const isUser = item.isUser;
                const position = idx + 1;

                return (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isUser
                        ? 'bg-blue-950/20 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                        : 'bg-slate-950/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Indicator */}
                      <span className={`w-4 text-center text-[10px] font-black ${
                        position === 1 ? 'text-yellow-400' : position === 2 ? 'text-slate-300' : position === 3 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {position}
                      </span>
                      {/* Avatar */}
                      <div className={`w-6.5 h-6.5 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm ${
                        isUser
                          ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-300 border border-white/5'
                      }`}>
                        {item.avatar}
                      </div>
                      {/* Name */}
                      <span className={`text-[11px] font-bold ${isUser ? 'text-white' : 'text-slate-300'}`}>
                        {item.name}
                      </span>
                    </div>
                    {/* XP Score */}
                    <div className="flex items-center gap-1 font-extrabold text-[10px] text-slate-300 select-none">
                      <Zap className={`w-3 h-3 fill-current ${isUser ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span>{item.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. BADGES & ACHIEVEMENTS */}
          <div className="glass-spatial bg-slate-950/20 border border-white/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Career Badges ({unlockedAchievements.length})</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENTS.slice(0, 6).map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                
                return (
                  <div
                    key={ach.id}
                    title={`${ach.title}: ${ach.description}`}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isUnlocked
                        ? 'bg-slate-900 border-purple-500/25 text-purple-400 shadow-inner'
                        : 'bg-slate-950/40 border-slate-950 text-slate-600 opacity-40'
                    }`}
                  >
                    <Trophy className={`w-6 h-6 mb-1 ${isUnlocked ? 'text-purple-400 fill-purple-950/20' : 'text-slate-600'}`} />
                    <span className="text-[9px] font-black leading-tight max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {ach.title.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. UPCOMING REWARD */}
          {(() => {
            const upcomingMilestone = nodes.find((n) => n.type === 'milestone' && n.status !== 'completed') || 
                                      nodes.find((n) => n.type === 'certificate');

            if (!upcomingMilestone) return null;

            return (
              <div className="glass-spatial bg-slate-950/20 border border-white/5 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Next Reward</h3>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                      <Trophy className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider leading-none block">Unlock Reward</span>
                      <h4 className="text-[11px] font-extrabold text-white mt-0.5 max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {upcomingMilestone.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>+{upcomingMilestone.xpReward} XP</span>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>

      {/* QUIZ AND FLASHCARD MODALS */}
      {selectedNode && (
        <>
          <QuizModal
            isOpen={isQuizOpen}
            onClose={() => setIsQuizOpen(false)}
            nodeId={selectedNode.id}
            nodeTitle={selectedNode.title}
            onComplete={(xpEarned) => {
              addXP(xpEarned);
              completeProblem(selectedNode.id, language);
              
              // Trigger a milestone unlock modal celebration!
              setCelebrationData({
                type: 'milestone',
                title: `${selectedNode.title} Assessment Passed!`,
                xp: xpEarned,
                objectives: selectedNode.objectives || []
              });
              setIsCelebrationOpen(true);
            }}
          />
          <FlashcardModal
            isOpen={isFlashcardsOpen}
            onClose={() => setIsFlashcardsOpen(false)}
            nodeId={selectedNode.id}
            nodeTitle={selectedNode.title}
          />
        </>
      )}

      {/* CELEBRATION UNLOCKS MODAL */}
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

      {/* MOBILE SELECTED NODE DETAILS MODAL */}
      <div className="lg:hidden">
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNode(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-sm relative bg-slate-950 border border-purple-500/35 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 z-10"
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

function LoaderComponent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin" />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assembling dynamic roadmap journey...</p>
    </div>
  );
}
