-- ==========================================================
-- ADD MISSING VIEWS (Workshop & On-Demand)
-- Run this in Supabase SQL Editor.
-- ==========================================================

-- 1. View: Workshop Responses
CREATE OR REPLACE VIEW view_workshop_responses AS
SELECT 
    s.full_name, 
    s.email, 
    s.specific_course, -- Shows "HR Interview Crack" or "Knitting"
    q.question_text, 
    a.answer_text,
    s.created_at as registration_date
FROM student_answers a
JOIN students s ON s.id = a.student_id
JOIN questions q ON q.id = a.question_id
WHERE s.program_type = 'workshop';

-- 2. View: On-Demand Responses
CREATE OR REPLACE VIEW view_ondemand_responses AS
SELECT 
    s.full_name, 
    s.email, 
    s.specific_course, 
    q.question_text, 
    a.answer_text,
    s.created_at as registration_date
FROM student_answers a
JOIN students s ON s.id = a.student_id
JOIN questions q ON q.id = a.question_id
WHERE s.program_type = 'ondemand';

-- 3. (Optional) Re-run Cohort View to ensure consistent columns
CREATE OR REPLACE VIEW view_cohort_responses AS
SELECT 
    s.full_name, 
    s.email, 
    s.specific_course, 
    q.question_text, 
    a.answer_text,
    s.created_at as registration_date
FROM student_answers a
JOIN students s ON s.id = a.student_id
JOIN questions q ON q.id = a.question_id
WHERE s.program_type = 'cohort';
