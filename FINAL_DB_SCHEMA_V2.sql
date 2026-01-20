-- ==========================================================
-- FINAL CONSOLIDATED SCHEMA V2 - OTTOBON ACADEMY
-- Run this script entirely in a NEW Supabase Project/Database
-- (Or drop existing tables to reset completely)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- TABLE 1: STUDENTS (Unified Registration Table)
-- ==========================================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Common Fields
  full_name TEXT NOT NULL,
  email TEXT NOT NULL, -- Removed UNIQUE constraint here (handled below)
  phone_number TEXT NOT NULL,
  college_name TEXT NOT NULL,
  year_of_passing TEXT NOT NULL,
  branch TEXT NOT NULL,
  
  -- Marketing/Tracking
  referred_by TEXT,
  
  -- Program Details
  program_type TEXT NOT NULL CHECK (program_type IN ('cohort', 'ondemand', 'workshop')),
  specific_course TEXT, -- E.g., "HR Interview Crack", "React Mastery"

  -- Cohort-Specific details (Nullable for others)
  selected_slot TEXT,
  session_time TEXT,
  mode TEXT,

  -- New Composite Constraint:
  -- Allows same email for different courses, but blocks duplicate registration for exact same course.
  CONSTRAINT unique_email_per_course UNIQUE (email, program_type, specific_course)
);

-- ==========================================================
-- TABLE 2: QUESTIONS (Dynamic Question Bank)
-- ==========================================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'text' CHECK (question_type IN ('text', 'mcq')),
  mcq_options JSONB,
  
  is_active BOOLEAN DEFAULT true,
  
  -- FILTERING COLUMNS
  program_type TEXT DEFAULT 'all',  -- 'cohort', 'workshop', 'all'
  specific_course_context TEXT      -- 'HR Interview Crack', 'Knitting' (Nullable for generic)
);

-- ==========================================================
-- TABLE 3: SUBMISSIONS
-- ==========================================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  
  total_questions INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending', 
  duration_seconds INTEGER DEFAULT 0
);

-- ==========================================================
-- TABLE 4: STUDENT ANSWERS
-- ==========================================================
CREATE TABLE student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,

  -- Helper columns
  student_name TEXT,
  student_email TEXT,
  question_number INTEGER,
  question_text TEXT,
  answer_text TEXT NOT NULL
);

-- ==========================================================
-- TABLE 5: ALLOTED TIMESLOTS
-- ==========================================================
CREATE TABLE alloted_timeslotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Time Slots
INSERT INTO alloted_timeslotes (slot_name) VALUES 
('2nd February'), 
('16th February');


-- ==========================================================
-- SEED DATA: QUESTIONS (COHORT)
-- ==========================================================
INSERT INTO questions (question_number, question_text, question_type, mcq_options, is_active, program_type, specific_course_context) VALUES
-- Text Questions
(1, 'Tell us about a time you had to learn something very difficult from scratch. How did you start, and what did you do when you felt stuck?', 'text', NULL, true, 'cohort', NULL),
(2, 'When you don''t understand a concept after trying once, what is your next step?', 'text', NULL, true, 'cohort', NULL),
(3, 'Describe how you usually break a big problem into smaller parts.', 'text', NULL, true, 'cohort', NULL),
(4, 'Tell us about a skill you failed to learn at first but later improved at.', 'text', NULL, true, 'cohort', NULL),
(5, 'How do you decide whether to keep pushing through confusion or take a break and return later?', 'text', NULL, true, 'cohort', NULL),
(6, 'Explain a situation where you had to solve a problem with limited information.', 'text', NULL, true, 'cohort', NULL),
(7, 'When faced with multiple possible solutions, how do you choose one?', 'text', NULL, true, 'cohort', NULL),
(8, 'Describe a time when your first solution did not work. What did you do next?', 'text', NULL, true, 'cohort', NULL),
(9, 'How do you check whether your solution is actually correct?', 'text', NULL, true, 'cohort', NULL),
(10, 'Tell us about a moment when you had to think clearly under pressure.', 'text', NULL, true, 'cohort', NULL),

-- MCQ Questions
(11, 'Describe a situation where being honest was harder than taking a shortcut.', 'mcq', '["I admitted a mistake even though it made me look bad", "I gave honest feedback when it was uncomfortable", "I refused to copy someone else''s work despite time pressure", "I told the truth about my skill level instead of exaggerating", "I chose transparency over convenience in a team setting"]'::jsonb, true, 'cohort', NULL),
(12, 'If you discover an error in your work that no one else noticed, what do you usually do?', 'mcq', '["I immediately fix it and inform relevant people", "I fix it quietly without mentioning it", "I assess the impact first, then decide whether to report it", "I document the error and the fix for future reference", "I discuss it with a peer before taking action"]'::jsonb, true, 'cohort', NULL),
(13, 'Tell us about a time you had to take responsibility for a mistake.', 'mcq', '["I owned up immediately and focused on fixing it", "I explained what went wrong and what I learned", "I apologized and made sure it wouldn''t happen again", "I took responsibility even when others were partly at fault", "I used it as a learning opportunity and shared lessons with others"]'::jsonb, true, 'cohort', NULL),
(14, 'In your view, what risks can come from using AI carelessly?', 'mcq', '["Spreading misinformation or biased content", "Over-reliance without understanding the underlying concepts", "Privacy violations and data misuse", "Ethical issues like plagiarism or unfair advantages", "All of the above - AI requires careful and responsible use"]'::jsonb, true, 'cohort', NULL),
(15, 'How do you balance speed and correctness when working on important tasks?', 'mcq', '["I prioritize correctness, even if it takes longer", "I work quickly first, then review and refine carefully", "I set checkpoints to verify accuracy while maintaining pace", "I focus on speed for drafts, then slow down for final versions", "I ask for feedback early to catch errors without losing momentum"]'::jsonb, true, 'cohort', NULL),
(16, 'Explain how you usually communicate complex ideas to someone non-technical.', 'mcq', '["I use simple analogies and real-world examples", "I break it down into smaller, digestible parts", "I avoid jargon and explain in plain language", "I use visuals or diagrams to illustrate concepts", "I check their understanding and adjust my explanation accordingly"]'::jsonb, true, 'cohort', NULL),
(17, 'Tell us about a time you disagreed with a teammate. How did you handle it?', 'mcq', '["I listened to their perspective first, then shared mine respectfully", "I focused on finding common ground and a compromise", "I presented facts and data to support my viewpoint", "I suggested we try both approaches and compare results", "I involved a third party to help mediate the discussion"]'::jsonb, true, 'cohort', NULL),
(18, 'How do you ask for help when you are stuck?', 'mcq', '["I clearly explain what I''ve tried and where I''m stuck", "I research first, then ask specific questions", "I ask for guidance on approach rather than direct answers", "I reach out to peers, mentors, or online communities", "I frame it as a learning opportunity, not just problem-solving"]'::jsonb, true, 'cohort', NULL),
(19, 'Describe your role in a group project where everyone had different skill levels.', 'mcq', '["I helped others learn while completing my own tasks", "I took on tasks that matched my strengths and supported others", "I coordinated efforts to ensure everyone contributed meaningfully", "I learned from more skilled members and taught less experienced ones", "I focused on clear communication to bridge skill gaps"]'::jsonb, true, 'cohort', NULL),
(20, 'How do you react when someone gives feedback on your work?', 'mcq', '["I listen carefully and ask clarifying questions", "I appreciate it and look for actionable improvements", "I reflect on it before deciding what to change", "I thank them and implement relevant suggestions", "I see it as an opportunity to grow and improve"]'::jsonb, true, 'cohort', NULL),
(21, 'Why do you want to learn AI at this stage of your life?', 'mcq', '["AI is transforming industries and I want to be part of it", "I''m curious about how AI works and want hands-on experience", "I see AI skills as essential for my career goals", "I want to solve real-world problems using AI technology", "I''m passionate about technology and innovation"]'::jsonb, true, 'cohort', NULL),
(22, 'What keeps you going when learning becomes boring or repetitive?', 'mcq', '["I remind myself of my long-term goals", "I find ways to make it more interesting or challenging", "I take breaks and come back with fresh perspective", "I connect it to real-world applications that excite me", "I focus on small wins and track my progress"]'::jsonb, true, 'cohort', NULL),
(23, 'Tell us about a personal project or idea you worked on without external pressure.', 'mcq', '["I built something to solve a problem I personally faced", "I explored a topic I was genuinely curious about", "I created something just for the joy of learning", "I challenged myself to learn a new skill independently", "I contributed to an open-source or community project"]'::jsonb, true, 'cohort', NULL),
(24, 'How do you measure your own progress when no one is grading you?', 'mcq', '["I set personal milestones and track completion", "I compare my current skills to where I started", "I test myself with projects or challenges", "I seek feedback from peers or mentors", "I reflect on what I can do now that I couldn''t before"]'::jsonb, true, 'cohort', NULL),
(25, 'Imagine you complete this AI program successfully. How do you see yourself using these skills responsibly?', 'mcq', '["I''ll build solutions that benefit society and respect privacy", "I''ll continue learning and stay updated on ethical AI practices", "I''ll use AI to augment human capabilities, not replace them", "I''ll be transparent about AI''s limitations and potential biases", "I''ll mentor others and promote responsible AI use in my community"]'::jsonb, true, 'cohort', NULL);


-- ==========================================================
-- SEED DATA: WORKSHOP QUESTIONS
-- ==========================================================

-- 1. "HR Interview Crack" Questions
INSERT INTO questions (question_number, question_text, question_type, mcq_options, is_active, program_type, specific_course_context) VALUES
(201, 'How many interviews have you attended so far?', 'mcq', '["0", "1–2", "3–5", "More than 5"]'::jsonb, true, 'workshop', 'HR Interview Crack'),
(202, 'What challenges do you usually face during HR interviews?', 'text', NULL, true, 'workshop', 'HR Interview Crack'),
(203, 'Which HR interview questions do you find most difficult?', 'text', NULL, true, 'workshop', 'HR Interview Crack'),
(204, 'What is your biggest fear or concern about HR interviews?', 'text', NULL, true, 'workshop', 'HR Interview Crack');

-- 2. "Knitting" Questions
INSERT INTO questions (question_number, question_text, question_type, mcq_options, is_active, program_type, specific_course_context) VALUES
(301, 'How did you get interested in knitting?', 'text', NULL, true, 'workshop', 'Knitting'),
(302, 'How long have you been practicing knitting?', 'text', NULL, true, 'workshop', 'Knitting'),
(303, 'What type of yarn do you usually work with?', 'text', NULL, true, 'workshop', 'Knitting'),
(304, 'Have you ever followed a written or video knitting tutorial?', 'text', NULL, true, 'workshop', 'Knitting');


-- ==========================================================
-- HELPER VIEWS
-- ==========================================================
CREATE OR REPLACE VIEW view_cohort_responses AS
SELECT s.full_name, s.email, s.specific_course, q.question_text, a.answer_text
FROM student_answers a
JOIN students s ON s.id = a.student_id
JOIN questions q ON q.id = a.question_id
WHERE s.program_type = 'cohort';
