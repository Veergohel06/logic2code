-- Table to track coding streaks and continuous daily logins
CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 1 NOT NULL,
    max_streak INTEGER DEFAULT 1 NOT NULL,
    last_active_date DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
