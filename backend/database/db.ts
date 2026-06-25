import { supabase } from './supabaseClient';

const DEV_USER_ID = '00000000-0000-0000-0000-000000000000';

export interface DatabaseData {
  profile: {
    preferred_language: string;
    career_goal: string;
    experience_level: string;
    display_name: string;
    avatar_id: string;
  };
  progress: {
    xp: number;
    streak: number;
    completedProblems: string[];
    unlockedAchievements: string[];
    lastActiveDate: string | null;
  };
}

const DEFAULT_DB: DatabaseData = {
  profile: {
    preferred_language: 'python',
    career_goal: '',
    experience_level: '',
    display_name: '',
    avatar_id: '1'
  },
  progress: {
    xp: 0,
    streak: 0,
    completedProblems: [],
    unlockedAchievements: [],
    lastActiveDate: new Date().toDateString()
  }
};

// Synchronous fallback — returns in-memory defaults (no file I/O)
export function readDatabase(): DatabaseData {
  return { ...DEFAULT_DB };
}

// No-op write fallback — server-side JSON writes are removed to prevent multi-user state leaks
export function writeDatabase(data: DatabaseData) {
  console.warn('[db] writeDatabase called without Supabase — data is NOT persisted. Client localStorage handles offline sync.');
}

// Asynchronous read/write functions for Supabase syncing with safe in-memory fallback
export async function readDatabaseAsync(userId?: string): Promise<DatabaseData> {
  const targetId = userId || DEV_USER_ID;
  if (supabase) {
    try {
      // Fetch profile details
      const { data: profileData, error: profileErr } = await supabase
        .from('logic2code_profile')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

      // Fetch progress details
      const { data: progressData, error: progressErr } = await supabase
        .from('logic2code_progress')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

      // Fallback to in-memory defaults if Supabase has query errors
      if (profileErr || progressErr) {
        console.warn('Supabase read error, falling back to in-memory defaults:', profileErr, progressErr);
        return { ...DEFAULT_DB };
      }

      // If profile exists but progress doesn't, create progress with 0 defaults
      if (profileData && !progressData) {
        await supabase.from('logic2code_progress').insert({
          id: targetId,
          xp: 0,
          streak: 0,
          completed_problems: [],
          unlocked_achievements: [],
          last_active_date: new Date().toDateString()
        });
        
        return {
          profile: {
            preferred_language: profileData.preferred_language || DEFAULT_DB.profile.preferred_language,
            career_goal: profileData.career_goal || DEFAULT_DB.profile.career_goal,
            experience_level: profileData.experience_level || DEFAULT_DB.profile.experience_level,
            display_name: profileData.display_name || DEFAULT_DB.profile.display_name,
            avatar_id: profileData.avatar_id || DEFAULT_DB.profile.avatar_id
          },
          progress: {
            xp: 0,
            streak: 0,
            completedProblems: [],
            unlockedAchievements: [],
            lastActiveDate: new Date().toDateString()
          }
        };
      }

      // If records do not exist yet in Supabase, create and write defaults
      if (!profileData && !progressData) {
        const newProfilePayload: any = {
          id: targetId,
          preferred_language: DEFAULT_DB.profile.preferred_language,
          career_goal: DEFAULT_DB.profile.career_goal,
          experience_level: DEFAULT_DB.profile.experience_level,
          display_name: DEFAULT_DB.profile.display_name,
          avatar_id: DEFAULT_DB.profile.avatar_id
        };
        
        let { error: insertErr } = await supabase
          .from('logic2code_profile')
          .insert(newProfilePayload);

        // Self-healing fallback for missing columns in database schema
        if (insertErr && (insertErr.code === 'PGRST204' || insertErr.message?.includes('avatar_id') || insertErr.message?.includes('display_name'))) {
          console.warn('logic2code_profile table missing columns. Retrying insert without avatar_id and display_name...');
          delete newProfilePayload.avatar_id;
          delete newProfilePayload.display_name;
          await supabase
            .from('logic2code_profile')
            .insert(newProfilePayload);
        }

        await supabase.from('logic2code_progress').insert({
          id: targetId,
          xp: DEFAULT_DB.progress.xp,
          streak: DEFAULT_DB.progress.streak,
          completed_problems: DEFAULT_DB.progress.completedProblems,
          unlocked_achievements: DEFAULT_DB.progress.unlockedAchievements,
          last_active_date: DEFAULT_DB.progress.lastActiveDate
        });

        return { ...DEFAULT_DB };
      }

      // Resolve progress details directly from database rows
      let resolvedXp = progressData?.xp ?? 0;
      let resolvedStreak = progressData?.streak ?? 0;
      let resolvedAchievements = progressData?.unlocked_achievements || [];
      const resolvedCompleted = progressData?.completed_problems || [];

      // If user has not completed onboarding yet (career_goal is empty), force metrics to 0
      if (!profileData?.career_goal) {
        resolvedXp = 0;
        resolvedStreak = 0;
        resolvedAchievements = [];
      }

      return {
        profile: {
          preferred_language: profileData?.preferred_language || DEFAULT_DB.profile.preferred_language,
          career_goal: profileData?.career_goal || DEFAULT_DB.profile.career_goal,
          experience_level: profileData?.experience_level || DEFAULT_DB.profile.experience_level,
          display_name: profileData?.display_name || DEFAULT_DB.profile.display_name,
          avatar_id: profileData?.avatar_id || DEFAULT_DB.profile.avatar_id
        },
        progress: {
          xp: resolvedXp,
          streak: resolvedStreak,
          completedProblems: resolvedCompleted,
          unlockedAchievements: resolvedAchievements,
          lastActiveDate: progressData?.last_active_date || DEFAULT_DB.progress.lastActiveDate
        }
      };
    } catch (err) {
      console.warn('Supabase read failed, falling back to in-memory defaults:', err);
    }
  }

  // Fallback to in-memory defaults (no file I/O)
  return { ...DEFAULT_DB };
}

export async function writeDatabaseAsync(data: DatabaseData, userId?: string): Promise<void> {
  const targetId = userId || DEV_USER_ID;
  if (supabase) {
    try {
      // Upsert profile details with self-healing fallback for avatar_id schema issue
      const profilePayload: any = {
        id: targetId,
        preferred_language: data.profile.preferred_language,
        career_goal: data.profile.career_goal,
        experience_level: data.profile.experience_level,
        display_name: data.profile.display_name,
        avatar_id: data.profile.avatar_id
      };

      let { error: profileErr } = await supabase
        .from('logic2code_profile')
        .upsert(profilePayload);

      // If missing columns (schema mismatch), retry without them
      if (profileErr && (profileErr.code === 'PGRST204' || profileErr.message?.includes('avatar_id') || profileErr.message?.includes('display_name'))) {
        console.warn('logic2code_profile table missing columns. Retrying upsert without avatar_id and display_name...');
        delete profilePayload.avatar_id;
        delete profilePayload.display_name;
        const retryResult = await supabase
          .from('logic2code_profile')
          .upsert(profilePayload);
        profileErr = retryResult.error;
      }

      // Upsert progress details
      const { error: progressErr } = await supabase
        .from('logic2code_progress')
        .upsert({
          id: targetId,
          xp: data.progress.xp,
          streak: data.progress.streak,
          completed_problems: data.progress.completedProblems,
          unlocked_achievements: data.progress.unlockedAchievements,
          last_active_date: data.progress.lastActiveDate
        });

      if (!profileErr && !progressErr) {
        return;
      }
      console.warn('Supabase upsert failed:', profileErr, progressErr);
    } catch (err) {
      console.warn('Supabase write failed — data NOT persisted to server:', err);
    }
  }

  // No-op fallback — no server-side file writes
  console.warn('[db] Supabase unavailable. Progress will only persist in client localStorage.');
}
