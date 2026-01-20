-- Update the question context to match the new course names from the frontend

-- 1. Rename "HR Interview Crack" to "Ace the HR Interview"
UPDATE questions 
SET specific_course_context = 'Ace the HR Interview' 
WHERE specific_course_context = 'HR Interview Crack';

-- 2. Rename "Knitting" to "Crochet"
UPDATE questions 
SET specific_course_context = 'Crochet' 
WHERE specific_course_context = 'Knitting';

-- Verify the changes
SELECT id, question_text, specific_course_context 
FROM questions 
WHERE program_type = 'workshop';
