-- Table to store metadata for programming languages supported by the platform
CREATE TABLE IF NOT EXISTS public.languages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    monaco_lang VARCHAR(50) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    visualizer_type VARCHAR(50) NOT NULL,
    color VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    is_future BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed initial languages
INSERT INTO public.languages (id, name, monaco_lang, file_extension, visualizer_type, color, description, is_future)
VALUES 
('python', 'Python', 'python', 'py', 'list-dict', 'from-blue-500 to-yellow-500', 'Focus on readability, clean syntax, and Pythonic patterns.', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.languages (id, name, monaco_lang, file_extension, visualizer_type, color, description, is_future)
VALUES 
('javascript', 'JavaScript', 'javascript', 'js', 'event-loop', 'from-yellow-400 to-amber-500', 'Learn asynchronous programming, closures, and DOM manipulation.', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.languages (id, name, monaco_lang, file_extension, visualizer_type, color, description, is_future)
VALUES 
('java', 'Java', 'java', 'java', 'oop-heap', 'from-orange-500 to-red-600', 'Master classes, objects, multithreading, and strong OOP principles.', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.languages (id, name, monaco_lang, file_extension, visualizer_type, color, description, is_future)
VALUES 
('cpp', 'C++', 'cpp', 'cpp', 'pointers-heap', 'from-blue-700 to-indigo-600', 'Understand low-level memory layout, stack vs heap, STL, and pointers.', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.languages (id, name, monaco_lang, file_extension, visualizer_type, color, description, is_future)
VALUES 
('go', 'Go', 'go', 'go', 'concurrency', 'from-cyan-500 to-teal-400', 'Learn concurrent programming with goroutines, channels, and simple structures.', false)
ON CONFLICT (id) DO NOTHING;
