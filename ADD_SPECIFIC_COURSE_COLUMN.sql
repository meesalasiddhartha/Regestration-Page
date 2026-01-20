-- Add specific_course column to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS specific_course text;

-- Optional: Add check constraint if you want to restrict values, 
-- but might be better to keep it open text if courses change frequently.
-- ALTER TABLE students ADD CONSTRAINT check_specific_course ...
