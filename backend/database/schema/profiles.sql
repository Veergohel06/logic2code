-- Table to hold additional profile details, specifically preferred language
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(50) DEFAULT 'python' REFERENCES public.languages(id) ON DELETE SET DEFAULT,
    xp INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_timestamp 
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
