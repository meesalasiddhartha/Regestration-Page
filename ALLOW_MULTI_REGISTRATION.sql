-- ==========================================================
-- ALLOW MULTIPLE REGISTRATIONS (One per Course)
-- Run this in Supabase SQL Editor.
-- ==========================================================

-- 1. DROP the old strict "Email must be unique" constraint
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_email_key;

-- 2. ADD the new smart constraint
-- Allows same email multiple times, BUT only once for the exact same specific course & program.
ALTER TABLE students 
ADD CONSTRAINT unique_email_per_course 
UNIQUE (email, program_type, specific_course);

-- 3. Verify
-- You should now be able to register siddhu@test.com for "Workshop" 
-- even if they are already in "Cohort".
