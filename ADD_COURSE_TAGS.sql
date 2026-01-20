-- 1. Add Filtering Column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS specific_course_context TEXT;

-- 2. Add Sample Data for "Workshop" -> "System Design Masterclass"
INSERT INTO questions (question_number, question_text, question_type, mcq_options, is_active, program_type, specific_course_context) VALUES
(101, 'In System Design, what is the primary benefit of Load Balancing?', 'mcq', 
'["Distributing traffic to prevent server overload", "Encrypting database connections", "Compressing images for faster load", "Auto-generating code documentation"]'::jsonb, true, 'workshop', 'System Design Masterclass'),

(102, 'Describe a system you have designed or built previously. What were the bottlenecks?', 'text', NULL, true, 'workshop', 'System Design Masterclass');

-- 3. Add Sample Data for "Workshop" -> "Git & GitHub Workflow"
INSERT INTO questions (question_number, question_text, question_type, mcq_options, is_active, program_type, specific_course_context) VALUES
(103, 'Which Git command is used to undo the last commit but keep changes in staging?', 'mcq', 
'["git reset --soft HEAD~1", "git revert HEAD", "git checkout .", "git clean -fd"]'::jsonb, true, 'workshop', 'Git & GitHub Workflow');

-- Note: Existing questions with specific_course_context = NULL will still show for everyone in that program.
