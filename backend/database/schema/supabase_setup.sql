-- Create profile table in Supabase
CREATE TABLE IF NOT EXISTS public.logic2code_profile (
    id UUID PRIMARY KEY,
    preferred_language VARCHAR(50) DEFAULT 'python',
    career_goal VARCHAR(100) DEFAULT '',
    experience_level VARCHAR(50) DEFAULT '',
    display_name VARCHAR(100) DEFAULT '',
    avatar_id VARCHAR(50) DEFAULT '1',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create progress table in Supabase
CREATE TABLE IF NOT EXISTS public.logic2code_progress (
    id UUID PRIMARY KEY REFERENCES public.logic2code_profile(id) ON DELETE CASCADE,
    xp INTEGER DEFAULT 0 NOT NULL,
    streak INTEGER DEFAULT 0 NOT NULL,
    completed_problems TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    unlocked_achievements TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    last_active_date VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.logic2code_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logic2code_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for secure authenticated-only access
CREATE POLICY "Allow authenticated read profile" ON public.logic2code_profile FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Allow authenticated insert profile" ON public.logic2code_profile FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow authenticated update profile" ON public.logic2code_profile FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow authenticated read progress" ON public.logic2code_progress FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Allow authenticated insert progress" ON public.logic2code_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow authenticated update progress" ON public.logic2code_progress FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Upgrade migrations for existing tables
ALTER TABLE public.logic2code_profile ADD COLUMN IF NOT EXISTS display_name VARCHAR(100) DEFAULT '';
ALTER TABLE public.logic2code_profile ADD COLUMN IF NOT EXISTS avatar_id VARCHAR(50) DEFAULT '1';

-- Create performance indexes for sorting leaderboards
CREATE INDEX IF NOT EXISTS idx_progress_xp ON public.logic2code_progress (xp DESC);
CREATE INDEX IF NOT EXISTS idx_progress_streak ON public.logic2code_progress (streak DESC);
