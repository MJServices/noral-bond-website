-- ============================================
-- Seed Courses and Lessons
-- ============================================

-- 1. Insert some 'Structured Courses' for the Courses Tab
INSERT INTO public.courses (title, description, category, level, icon_key, total_xp)
VALUES
    ('Relationship Mastery', 'A comprehensive guide to building strong, lasting connections.', 'Relationship', 'Beginner', 'heart', 500),
    ('Safety & Consent', 'Essential protocols for safe and respectful interactions.', 'Safety', 'Beginner', 'shield', 400),
    ('Emotional Intelligence Deep Dive', 'Master your emotions and understand others better.', 'Psychology', 'Intermediate', 'brain', 600)
ON CONFLICT DO NOTHING;

-- 2. Insert Individual Lessons (from the current UI)
-- Note: We use course_id NULL for now to show them as 'Individual', 
-- or we could link them. Let's keep them as individual for the 'Individual Lessons' tab.

INSERT INTO public.lessons (title, category, level, duration_min, xp_reward, icon_key, description, content)
VALUES
    ('Understanding Consent', 'Safety', 'Beginner', 15, 200, 'shield', 
     'Learn the fundamentals of clear, ongoing consent and how to create safe spaces for all interactions.',
     '# Understanding Consent\n\nConsent is the foundation of all healthy interactions. It must be:\n\n- **F**reely given\n- **R**eversible\n- **I**nformed\n- **E**nthusiastic\n- **S**pecific\n\nIn this lesson, we will explore...'),

    ('Effective Communication', 'Communication', 'Beginner', 15, 200, 'user', 
     'Master the art of expressing needs, desires, and boundaries clearly and respectfully.',
     '# Effective Communication\n\nCommunication is more than just speaking. It involves active listening, non-verbal cues, and emotional awareness...'),

    ('Emotional Intelligence', 'Psychology', 'Intermediate', 15, 200, 'book-open', 
     'Develop deeper self-awareness and empathy to enhance your emotional connections.',
     '# Emotional Intelligence\n\nEQ is the ability to understand, use, and manage your own emotions in positive ways to relieve stress and communicate effectively...'),

    ('Building Trust & Intimacy', 'Relationship', 'Intermediate', 15, 200, 'users', 
     'Explore techniques for developing deep trust and authentic intimacy in relationships.',
     '# Building Trust\n\nTrust is earned through consistent actions over time. Intimacy requires vulnerability...'),

    ('Setting Healthy Boundaries', 'Safety', 'Beginner', 15, 200, 'user', 
     'Learn to establish, communicate, and maintain personal boundaries effectively.',
     '# Setting Boundaries\n\nBoundaries are guidelines, rules, or limits that a person creates to identify reasonable, safe and permissible ways for other people to behave towards them...'),

    ('Understanding Power Dynamics', 'Relationship', 'Advanced', 15, 200, 'lock', 
     'Explore healthy power exchange and maintaining balance in dynamic relationships.',
     '# Power Dynamics\n\nPower exists in every relationship. Acknowledging it is the first step to managing it healthily...'),

    ('Aftercare Fundamentals', 'Safety', 'Intermediate', 15, 200, 'shield', 
     'Essential knowledge about providing and receiving care after intense experiences.',
     '# Aftercare\n\nAftercare is the period of time immediately following an intense experience where partners attend to each other''s physical and emotional needs...'),

    ('Mindful Intimacy', 'Psychology', 'Beginner', 15, 200, 'book-open', 
     'Practice being present and mindful during intimate moments and conversations.',
     '# Mindful Intimacy\n\nMindfulness allows us to be fully present in the moment, enhancing connection and sensation...')
ON CONFLICT DO NOTHING;

-- Verifying insertion
SELECT count(*) as courses_count FROM public.courses;
SELECT count(*) as lessons_count FROM public.lessons;
