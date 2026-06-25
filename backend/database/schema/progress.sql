-- Table to track user progress on the programming language roadmaps
CREATE TABLE IF NOT EXISTS public.language_progress (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    language_id VARCHAR(50) REFERENCES public.languages(id) ON DELETE CASCADE NOT NULL,
    roadmap_node_id VARCHAR(100) NOT NULL, -- e.g., 'py-variables', 'js-dom'
    status VARCHAR(50) DEFAULT 'unlocked' NOT NULL, -- 'locked', 'unlocked', 'completed'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, language_id, roadmap_node_id)
);
