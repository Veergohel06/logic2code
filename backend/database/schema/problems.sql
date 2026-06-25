-- Table to store coding problems associated with specific languages
CREATE TABLE IF NOT EXISTS public.problems (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Easy' NOT NULL,
    description TEXT NOT NULL,
    input_spec TEXT NOT NULL,
    output_spec TEXT NOT NULL,
    constraints TEXT[] NOT NULL,
    language_id VARCHAR(50) REFERENCES public.languages(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
