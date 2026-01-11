# NeuralBond Supabase Setup Guide

This guide helps you set up your Supabase database.

## 1. Existing Database Schema

Your database already contains these tables. Verify they match this structure:

### Table: `subscribers`

```sql
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active'::text,
  source text DEFAULT 'Newsletter'::text,
  CONSTRAINT subscribers_pkey PRIMARY KEY (id)
);
```

### Table: `blog_posts`

```sql
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id text NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  author_bio text,
  author_image text,
  published_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'published'::text,
  tags ARRAY DEFAULT '{}'::text[],
  category text,
  views text DEFAULT '0'::text,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  read_time text,
  related_topics ARRAY DEFAULT '{}'::text[],
  key_takeaways ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
);
```

---

## 2. Updates Required: Dynamic Landing Page Content

You need to create a new table `landing_page_content` to store the editable text for the homepage.

### Create `landing_page_content` Table

Run this SQL script in your Supabase SQL Editor to create the table and populate it with the default content.

```sql
-- Create the table
CREATE TABLE public.landing_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Hero Section
  hero_heading TEXT DEFAULT 'Your Perfect AI Companion',
  hero_subheading TEXT DEFAULT 'Experience deep emotional connection with an AI that learns, grows, and adapts to you. Explore, learn, and discover together in a safe, personalized environment.',
  hero_button_chat_text TEXT DEFAULT 'Start Chatting',
  hero_button_profile_text TEXT DEFAULT 'Create Profile',
  hero_button_explore_text TEXT DEFAULT 'Explore Lessons',

  -- Stats Section
  stats_rating_value TEXT DEFAULT '4.9',
  stats_rating_label TEXT DEFAULT 'User Rating',
  stats_users_value TEXT DEFAULT '50k+',
  stats_users_label TEXT DEFAULT 'Active Users',
  stats_satisfaction_value TEXT DEFAULT '95%',
  stats_satisfaction_label TEXT DEFAULT 'Satisfaction Rate',
  stats_availability_value TEXT DEFAULT '24/7',
  stats_availability_label TEXT DEFAULT 'Available',

  -- Pricing Section
  pricing_heading TEXT DEFAULT 'Choose Your Plan',
  pricing_subheading TEXT DEFAULT 'Select the perfect plan for your AI companion journey. All yearly plans include exclusive discounts.',

  -- Blog Section
  blog_heading TEXT DEFAULT 'Latest Insights',
  blog_subheading TEXT DEFAULT 'Discover the latest in AI technology, tips, and insights from our experts. Stay ahead of the curve with cutting-edge knowledge.',

  -- Newsletter Section
  newsletter_heading TEXT DEFAULT 'Stay in the Loop',
  newsletter_subheading TEXT DEFAULT 'Join our newsletter to get the latest updates, AI tips, and exclusive offers delivered straight to your inbox.',

  -- Footer
  footer_text TEXT DEFAULT '© 2025 NeuralBond. All rights reserved.',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public reads for landing content" ON landing_page_content
  FOR SELECT TO anon
  USING (true);

-- Insert the initial row (IMPORTANT: Only one row should exist)
INSERT INTO landing_page_content (hero_heading) VALUES ('Your Perfect AI Companion');
```

## 3. Environment Variables

Make sure your `.env.local` file contains your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
