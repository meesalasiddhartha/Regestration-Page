-- Add program_type column to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS program_type text DEFAULT 'cohort';

-- Add program_type column to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS program_type text DEFAULT 'all';

-- Update existing questions to be visible for all or specific types
-- (Optional: Set default to 'all' so they appear for everyone initially)
UPDATE questions SET program_type = 'all' WHERE program_type IS NULL;

-- Make columns nullable for non-cohort students
ALTER TABLE students ALTER COLUMN selected_slot DROP NOT NULL;
ALTER TABLE students ALTER COLUMN session_time DROP NOT NULL;
ALTER TABLE students ALTER COLUMN mode DROP NOT NULL;

-- Add comment constraints to ensure valid types (optional but good practice)
ALTER TABLE students ADD CONSTRAINT students_program_type_check 
CHECK (program_type IN ('cohort', 'ondemand', 'workshop'));

ALTER TABLE questions ADD CONSTRAINT questions_program_type_check 
CHECK (program_type IN ('cohort', 'ondemand', 'workshop', 'all'));
