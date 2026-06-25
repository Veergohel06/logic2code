-- Create interview session table
CREATE TABLE IF NOT EXISTS public.logic2code_interview_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    current_difficulty VARCHAR(20) DEFAULT 'mid' NOT NULL,
    active_topic VARCHAR(50) NOT NULL,
    topic_queue VARCHAR(50)[] NOT NULL,
    asked_question_ids UUID[] DEFAULT '{}'::UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create candidate skill matrix table
CREATE TABLE IF NOT EXISTS public.logic2code_candidate_skill_matrix (
    session_id UUID REFERENCES public.logic2code_interview_session(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    score INTEGER DEFAULT 0 NOT NULL,
    confidence_score FLOAT DEFAULT 0.0 NOT NULL,
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (session_id, skill_name)
);

-- Create interview dialogue history / transcripts table
CREATE TABLE IF NOT EXISTS public.logic2code_interview_dialogue_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.logic2code_interview_session(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('interviewer', 'candidate', 'system')) NOT NULL,
    message TEXT NOT NULL,
    associated_rubric TEXT,
    evaluation_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.logic2code_interview_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logic2code_candidate_skill_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logic2code_interview_dialogue_history ENABLE ROW LEVEL SECURITY;

-- Create policies for secure authenticated-only access (checking owner ID)
CREATE POLICY "Users can view their own interview sessions" 
    ON public.logic2code_interview_session FOR SELECT 
    TO authenticated 
    USING (auth.uid() = candidate_id);

CREATE POLICY "Users can create their own interview sessions" 
    ON public.logic2code_interview_session FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Users can update their own interview sessions" 
    ON public.logic2code_interview_session FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = candidate_id);

-- Create policies for nested skill matrix tables
CREATE POLICY "Users can view their own skill matrix"
    ON public.logic2code_candidate_skill_matrix FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.logic2code_interview_session
        WHERE id = session_id AND candidate_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own skill matrix"
    ON public.logic2code_candidate_skill_matrix FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.logic2code_interview_session
        WHERE id = session_id AND candidate_id = auth.uid()
    ));

CREATE POLICY "Users can update their own skill matrix"
    ON public.logic2code_candidate_skill_matrix FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.logic2code_interview_session
        WHERE id = session_id AND candidate_id = auth.uid()
    ));

-- Create policies for dialogue history
CREATE POLICY "Users can view their own dialogue history"
    ON public.logic2code_interview_dialogue_history FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.logic2code_interview_session
        WHERE id = session_id AND candidate_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own dialogue history"
    ON public.logic2code_interview_dialogue_history FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.logic2code_interview_session
        WHERE id = session_id AND candidate_id = auth.uid()
    ));
