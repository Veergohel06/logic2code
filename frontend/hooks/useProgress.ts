'use client';

import { useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '@/config/achievements';

interface UserProgress {
  xp: number;
  streak: number;
  completedProblems: string[]; // list of problemId-langId
  unlockedAchievements: string[]; // list of achievementIds
  lastActiveDate: string | null;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0, // default starting XP
    streak: 0, // default starting streak
    completedProblems: [],
    unlockedAchievements: [],
    lastActiveDate: new Date().toDateString()
  });

  useEffect(() => {
    const fetchProgress = async (authToken?: string) => {
      try {
        const { supabase } = await import('@/database/supabaseClient');
        let token = authToken;
        if (!token && supabase) {
          const session = (await supabase.auth.getSession()).data.session;
          token = session?.access_token;
        }

        if (token) {
          const res = await fetch('/api/progress', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.xp === 'number') {
              setProgress(data);
              localStorage.setItem('l2c_progress', JSON.stringify(data));
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Supabase client import failed or auth not loaded yet:', err);
      }

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('l2c_progress');
        if (saved) {
          try {
            setProgress(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    fetchProgress();

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const session = customEvent.detail;
      if (session?.access_token) {
        fetchProgress(session.access_token);
      } else if (session === null) {
        setProgress({
          xp: 0,
          streak: 0,
          completedProblems: [],
          unlockedAchievements: [],
          lastActiveDate: new Date().toDateString()
        });
      }
    };

    window.addEventListener('l2c_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('l2c_auth_change', handleAuthChange);
    };
  }, []);

  const saveProgress = async (newProg: UserProgress) => {
    setProgress(newProg);
    if (typeof window !== 'undefined') {
      localStorage.setItem('l2c_progress', JSON.stringify(newProg));
    }
    
    try {
      const { supabase } = await import('@/database/supabaseClient');
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      await fetch('/api/progress', {
        method: 'POST',
        headers,
        body: JSON.stringify(newProg)
      });
    } catch (err) {
      console.warn('Progress sync failed:', err);
    }
  };

  const addXP = (amount: number) => {
    const nextProgress = {
      ...progress,
      xp: progress.xp + amount
    };
    saveProgress(nextProgress);
  };

  const completeProblem = (problemId: string, languageId: string) => {
    const key = `${problemId}_${languageId}`;
    if (progress.completedProblems.includes(key)) return;

    const nextCompleted = [...progress.completedProblems, key];
    let xpGain = 100; // base problem solve reward
    let newlyUnlocked: string[] = [];

    // Check achievements
    // 1. Language specific achievements
    const languageAchievements = ACHIEVEMENTS.filter((a) => a.languageId === languageId);
    for (const ach of languageAchievements) {
      if (!progress.unlockedAchievements.includes(ach.id)) {
        // logic to unlock
        newlyUnlocked.push(ach.id);
        xpGain += ach.xpReward;
      }
    }

    // 2. Polyglot check (problems solved in 3 different languages)
    if (!progress.unlockedAchievements.includes('polyglot')) {
      const solvedLanguages = new Set(nextCompleted.map((k) => k.split('_')[1]));
      if (solvedLanguages.size >= 3) {
        newlyUnlocked.push('polyglot');
        const poly = ACHIEVEMENTS.find((a) => a.id === 'polyglot');
        if (poly) xpGain += poly.xpReward;
      }
    }

    const nextProgress = {
      ...progress,
      completedProblems: nextCompleted,
      unlockedAchievements: [...progress.unlockedAchievements, ...newlyUnlocked],
      xp: progress.xp + xpGain
    };

    saveProgress(nextProgress);
    return newlyUnlocked; // returns any achievements unlocked in this step to trigger confetti
  };

  const isProblemCompleted = (problemId: string, languageId: string) => {
    return progress.completedProblems.includes(`${problemId}_${languageId}`);
  };

  const resetProgress = async () => {
    const freshProgress: UserProgress = {
      xp: 0,
      streak: 0,
      completedProblems: [],
      unlockedAchievements: [],
      lastActiveDate: new Date().toDateString()
    };
    await saveProgress(freshProgress);
  };

  return {
    xp: progress.xp,
    streak: progress.streak,
    completedProblems: progress.completedProblems,
    unlockedAchievements: progress.unlockedAchievements,
    addXP,
    completeProblem,
    isProblemCompleted,
    resetProgress
  };
}

export default useProgress;
