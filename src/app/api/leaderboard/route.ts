import { NextResponse } from 'next/server';
import { readDatabaseAsync } from '@/database/db';
import { supabase } from '@/database/supabaseClient';
import { getUserIdFromRequest } from '@/lib/auth';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  avatarId: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

const MOCK_CONTESTANTS: LeaderboardEntry[] = [
  { id: 'mock-1', displayName: 'ByteCommander', avatarId: '1', xp: 2150, streak: 15 },
  { id: 'mock-2', displayName: 'CyberNova', avatarId: '4', xp: 1650, streak: 9 },
  { id: 'mock-3', displayName: 'GopherPro', avatarId: '5', xp: 1250, streak: 7 },
  { id: 'mock-4', displayName: 'AdaLovelace', avatarId: '2', xp: 950, streak: 5 },
  { id: 'mock-5', displayName: 'CoffeeCoder', avatarId: '6', xp: 450, streak: 2 },
];


export async function GET(request: Request) {
  try {
    const currentUserId = await getUserIdFromRequest(request);
    
    // Read the current user's profile and progress
    const currentUserDb = await readDatabaseAsync(currentUserId);
    
    let entries: LeaderboardEntry[] = [];
    
    if (supabase) {
      try {
        // Fetch only the top 50 progress profiles from Supabase sorted by XP using a join query
        const { data: progressList, error: progressErr } = await supabase
          .from('logic2code_progress')
          .select(`
            id,
            xp,
            streak,
            profile:logic2code_profile (
              display_name,
              avatar_id
            )
          `)
          .order('xp', { ascending: false })
          .limit(50);

        if (!progressErr && progressList) {
          entries = progressList.map((prog: any) => {
            const prof = Array.isArray(prog.profile) ? prog.profile[0] : prog.profile;
            return {
              id: prog.id,
              displayName: prof?.display_name || 'Anonymous Coder',
              avatarId: prof?.avatar_id || '1',
              xp: prog.xp,
              streak: prog.streak,
              isCurrentUser: prog.id === currentUserId
            };
          });
        }
      } catch (err) {
        console.warn('Leaderboard Supabase fetch failed, falling back to mock lists:', err);
      }
    }
    
    // If Supabase fetch was skipped or empty, load current user from JSON db and merge mock contestants
    if (entries.length === 0) {
      const activeUserEntry: LeaderboardEntry = {
        id: currentUserId || 'dev-user',
        displayName: currentUserDb.profile.display_name || 'You (Developer)',
        avatarId: currentUserDb.profile.avatar_id || '1',
        xp: currentUserDb.progress.xp,
        streak: currentUserDb.progress.streak,
        isCurrentUser: true
      };
      
      entries = [activeUserEntry, ...MOCK_CONTESTANTS];
    } else {
      // If Supabase has entries but lacks current user (e.g. locally mock-authenticated), verify user is included
      const hasCurrentUser = entries.some(e => e.isCurrentUser);
      if (!hasCurrentUser) {
        entries.push({
          id: currentUserId || 'dev-user',
          displayName: currentUserDb.profile.display_name || 'You (Developer)',
          avatarId: currentUserDb.profile.avatar_id || '1',
          xp: currentUserDb.progress.xp,
          streak: currentUserDb.progress.streak,
          isCurrentUser: true
        });
      }
    }
    
    // Sort entries by XP in descending order
    entries.sort((a, b) => b.xp - a.xp);
    
    return NextResponse.json({ leaderboard: entries });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard rankings' }, { status: 500 });
  }
}
