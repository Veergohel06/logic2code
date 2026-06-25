-- Table to store user code submissions and runs
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    problem_id VARCHAR(100) REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    language_id VARCHAR(50) REFERENCES public.languages(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Compiled', 'Runtime Error', 'Passed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
