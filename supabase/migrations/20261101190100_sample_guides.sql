-- Placeholder editorial content approved in Q4. One identity shared by both domains.
insert into public.guides
  (id, slug, case_type_id, guide_type, title, level, read_minutes, key_points, content_path, status, sort_order)
values
  ('00000000-0000-4000-8000-000000000201', 'guesstimates-in-five-minutes', '00000000-0000-4000-8000-000000000101', 'hurry',
    'Guesstimates in 5 minutes', 'Easy', 5,
    array['Clarify scope', 'Choose a structure', 'Use round numbers', 'Sanity-check your answer'],
    'guesstimates-in-five-minutes.md', 'published', 1),
  ('00000000-0000-4000-8000-000000000202', 'the-five-step-approach', '00000000-0000-4000-8000-000000000101', 'concepts',
    'The 5-step approach to any guesstimate', 'Easy', 9,
    array['Clarify before calculating', 'Choose top-down or bottom-up', 'Split into non-overlapping segments', 'Explain your assumptions', 'Cross-check the result'],
    'the-five-step-approach.md', 'published', 2),
  ('00000000-0000-4000-8000-000000000203', 'cabs-in-mumbai', '00000000-0000-4000-8000-000000000101', 'solved',
    'Worked example: cabs in Mumbai', 'Easy', 12,
    array['Estimate daily riders', 'Multiply by trips per rider', 'Divide by trips per cab', 'Check the result against population'],
    'cabs-in-mumbai.md', 'published', 3),
  ('00000000-0000-4000-8000-000000000204', 'guesstimate-interview-patterns', '00000000-0000-4000-8000-000000000101', 'patterns',
    'Guesstimate patterns in interviews', 'Easy', 6,
    array['Recognize demand and supply problems', 'Separate active and registered units', 'Prepare for a follow-up'],
    'guesstimate-interview-patterns.md', 'published', 4);
