'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { Trophy, Medal, Zap, Crown, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  avatarId: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

const AVATAR_MAP: Record<string, { emoji: string; color: string }> = {
  '1': { emoji: '💻', color: 'from-blue-500 to-indigo-500' },
  '2': { emoji: '🚀', color: 'from-emerald-500 to-teal-500' },
  '3': { emoji: '🤖', color: 'from-purple-500 to-indigo-500' },
  '4': { emoji: '👾', color: 'from-rose-500 to-orange-500' },
  '5': { emoji: '🐹', color: 'from-sky-400 to-blue-500' },
  '6': { emoji: '☕', color: 'from-amber-500 to-orange-600' },
};

export default function LeaderboardPage() {
  const { session } = useAuth();
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        const res = await fetch('/api/leaderboard', { headers });
        if (res.ok) {
          const data = await res.json();
          setRankings(data.leaderboard || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [session]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Split Top 3 from remaining ranks
  const top3 = rankings.slice(0, 3);
  const remaining = rankings.slice(3);

  // Re-order top3 to display: [2nd, 1st, 3rd] for classic podium render
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push(top3[1]); // 2nd
  if (top3[0]) podiumOrder.push(top3[0]); // 1st
  if (top3[2]) podiumOrder.push(top3[2]); // 3rd

  const getPodiumColor = (indexInTop3: number) => {
    if (indexInTop3 === 0) return 'from-amber-400 to-orange-500 shadow-amber-500/20 border-amber-400/40'; // 1st
    if (indexInTop3 === 1) return 'from-slate-300 to-slate-400 shadow-slate-400/10 border-slate-300/30'; // 2nd
    return 'from-amber-600 to-amber-700 shadow-amber-700/10 border-amber-600/30'; // 3rd
  };

  const getPodiumRankLabel = (indexInTop3: number) => {
    if (indexInTop3 === 0) return '1st';
    if (indexInTop3 === 1) return '2nd';
    return '3rd';
  };

  return (
    <div className="flex-grow flex flex-col gap-8 py-2 max-w-4xl mx-auto w-full page-transition">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/10 pb-5 animate-slide-up">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-[0.18em] bg-indigo-950/40 border border-indigo-800/30 px-2.5 py-1 rounded-full">
            <Trophy className="w-2.5 h-2.5" />
            Competitive arena
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Global Leaderboard
        </h1>
        <p className="text-xs text-slate-400 font-semibold max-w-md mt-1">
          Compete against developer peers globally. Accumulate XP through solving challenges and completing roadmaps.
        </p>
      </div>

      {/* ── TOP PODIUM AREA ── */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end justify-center pt-8 px-2 select-none">
          {podiumOrder.map((entry) => {
            const actualRankIndex = rankings.indexOf(entry); // 0, 1, or 2
            const isFirst = actualRankIndex === 0;
            const isSecond = actualRankIndex === 1;
            const podiumBg = getPodiumColor(actualRankIndex);
            const avatar = AVATAR_MAP[entry.avatarId] || AVATAR_MAP['1'];

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: actualRankIndex * 0.1 }}
                className={`flex flex-col items-center relative ${isFirst ? 'z-10' : 'z-0'}`}
              >
                {/* 1st Place Crown */}
                {isFirst && (
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute -top-7 text-amber-400"
                  >
                    <Crown className="w-6 h-6 fill-amber-400/20 stroke-[2.5]" />
                  </motion.div>
                )}

                {/* Avatar circle with rank badge */}
                <div className="relative mb-3">
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-tr ${avatar.color} border-2 border-white/20 flex items-center justify-center text-3xl md:text-4xl shadow-lg shadow-black/40`}>
                    {avatar.emoji}
                  </div>
                  <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr ${podiumBg} border border-white/25 flex items-center justify-center text-[9px] md:text-[11px] font-black text-white shadow`}>
                    {getPodiumRankLabel(actualRankIndex)}
                  </div>
                </div>

                {/* Podium pedestal */}
                <div className={`w-full ${isFirst ? 'h-32 md:h-40 bg-slate-900/80 border-blue-500/25' : isSecond ? 'h-24 md:h-32 bg-slate-900/60 border-slate-700/20' : 'h-20 md:h-28 bg-slate-900/50 border-slate-800/15'} border rounded-t-2xl px-2 py-4 flex flex-col justify-between text-center shadow shadow-black/20`}>
                  <div className="min-w-0">
                    <span className={`text-[10px] md:text-xs font-black truncate block ${entry.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                      {entry.displayName}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide truncate">
                      {entry.xp} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-amber-500 font-extrabold bg-amber-950/20 border border-amber-900/30 px-1.5 py-0.5 rounded-lg w-max mx-auto shadow-sm">
                    <Zap className="w-3 h-3 fill-amber-500/10" />
                    <span>{entry.streak}d</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── LIST REMAINDER Ranks ── */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1">
          Rankings Arena
        </span>

        <div className="flex flex-col gap-2.5">
          {remaining.map((entry, index) => {
            const rank = index + 4;
            const avatar = AVATAR_MAP[entry.avatarId] || AVATAR_MAP['1'];

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between px-4 py-3 border rounded-2xl transition-all duration-200 hover:translate-x-0.5 hover:bg-white/5 ${
                  entry.isCurrentUser
                    ? 'bg-blue-950/30 border-blue-900/40 shadow shadow-blue-500/5'
                    : 'bg-white/3 border-white/5'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Rank number badge */}
                  <span className="w-6 text-xs font-black text-slate-400 text-center font-mono">
                    {rank}
                  </span>

                  {/* Coder Avatar */}
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${avatar.color} border border-white/10 flex items-center justify-center text-lg shadow-sm shrink-0`}>
                    {avatar.emoji}
                  </div>

                  {/* Nickname */}
                  <div className="flex flex-col min-w-0 gap-0.5">
                    <span className={`text-xs md:text-sm font-extrabold truncate ${entry.isCurrentUser ? 'text-blue-400' : 'text-slate-200'}`}>
                      {entry.displayName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Ranked contestant
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Streak */}
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-extrabold bg-amber-950/20 border border-amber-900/30 px-2 py-0.5 rounded-lg">
                    <Zap className="w-3 h-3 fill-amber-500/10" />
                    <span>{entry.streak}d</span>
                  </div>

                  {/* XP Total */}
                  <span className="text-xs font-black text-white tracking-wide font-mono w-16 text-right">
                    {entry.xp} XP
                  </span>
                </div>
              </motion.div>
            );
          })}

          {remaining.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500 font-semibold bg-white/2 border border-dashed border-white/10 rounded-2xl select-none">
              Solve problems or complete roadmap quizzes to see competitive rankings here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
