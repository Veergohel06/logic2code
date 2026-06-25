-- Table to hold achievement descriptions and configurations
CREATE TABLE IF NOT EXISTS public.achievements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    language_id VARCHAR(50) REFERENCES public.languages(id) ON DELETE SET NULL,
    xp_reward INTEGER DEFAULT 100 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Join table to track unlocked achievements for users
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id VARCHAR(100) REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, achievement_id)
);
