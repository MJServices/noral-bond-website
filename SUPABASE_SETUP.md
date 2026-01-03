# NeuralBond Supabase Setup Guide

## Prerequisites
- A Supabase account (free tier available at https://supabase.com)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Project name: `neuralbond` (or your choice)
   - Database password: (create a strong password)
   - Region: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

## Step 2: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Create the `subscribers` table by running this SQL:

```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  source TEXT DEFAULT 'Newsletter'
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow public inserts" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow reading subscriptions
CREATE POLICY "Allow public reads" ON subscribers
  FOR SELECT TO anon
  USING (true);
```

3. Create the `blog_posts` table by running this SQL:

```sql
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_bio TEXT,
  author_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'published',
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  views TEXT DEFAULT '0',
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  read_time TEXT,
  related_topics TEXT[] DEFAULT '{}',
  key_takeaways TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published posts
CREATE POLICY "Allow public reads for published posts" ON blog_posts
  FOR SELECT TO anon
  USING (status = 'published');
```

## Step 3: Get Your API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace** `your-project-url-here` and `your-anon-key-here` with the values from Step 3.

## Step 5: Add Sample Blog Posts (Optional)

To populate your blog with sample content, run this SQL in the SQL Editor:

```sql
INSERT INTO blog_posts (id, title, excerpt, content, author, author_bio, author_image, published_at, status, tags, category, views, likes, comments, read_time, related_topics, key_takeaways)
VALUES 
(
  '1',
  'The Future of AI Companionship: Building Meaningful Connections',
  'Explore how AI companions are revolutionizing personal relationships and emotional support in the digital age.',
  'The landscape of human-AI interaction is rapidly evolving, and we''re witnessing the emergence of truly meaningful AI companionship. Unlike traditional chatbots, modern AI companions are designed to understand, learn, and adapt to individual personalities and needs.

**The Evolution of AI Companionship**

The journey from simple chatbots to sophisticated AI companions represents a quantum leap in technology. Early chatbots could only respond to specific keywords and phrases, but today''s AI companions can:

- Understand context and nuance in conversations
- Remember past interactions and build upon them
- Recognize emotional states and respond appropriately
- Learn from each interaction to become more personalized
- Provide consistent support across different topics and situations

**Benefits Beyond Simple Conversation**

AI companions offer a wide range of benefits that extend far beyond basic conversation:

**Emotional Support**: Available 24/7 to provide comfort during difficult times, celebrate successes, and offer a non-judgmental listening ear.

**Learning and Development**: Help users develop new skills, practice languages, explore creative writing, or work through complex problems with patient guidance.

**Creative Collaboration**: Serve as brainstorming partners for creative projects, offering fresh perspectives and helping overcome creative blocks.

As we move forward, the key is maintaining the balance between technological advancement and authentic human connection. AI companions aren''t meant to replace human relationships but to enhance our capacity for connection and personal growth.',
  'Dr. Sarah Chen',
  'Dr. Sarah Chen is a leading researcher in AI and human-computer interaction at Stanford University.',
  'SC',
  NOW() - INTERVAL '7 days',
  'published',
  ARRAY['AI Technology', 'Relationships', 'Future Tech'],
  'Technology',
  '2.4k',
  156,
  23,
  '8 min read',
  ARRAY['Machine Learning', 'Psychology', 'Human-AI Interaction'],
  ARRAY['AI companions use advanced NLP and emotional intelligence', 'They provide 24/7 emotional support and learning assistance', 'The goal is to enhance, not replace, human connections', 'Technology should amplify our humanity']
);
```

You can add more blog posts by modifying the INSERT statement.

## Step 6: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Test the email subscription:
   - Enter an email in the "Stay in Loop" section
   - Check your Supabase dashboard → Table Editor → `subscribers` to see the entry

4. Test blog posts:
   - If you added sample data, you should see blog posts on the homepage
   - If not, add a blog post via Supabase dashboard

## Troubleshooting

### "Failed to subscribe" error
- Check that your `.env.local` file has the correct credentials
- Verify the `subscribers` table exists in Supabase
- Check browser console for detailed error messages

### Blog posts not showing
- Verify the `blog_posts` table exists
- Check that posts have `status = 'published'`
- Look for errors in browser console

### Environment variables not working
- Make sure `.env.local` is in the project root
- Restart your development server after adding/changing env variables
- Verify variable names start with `NEXT_PUBLIC_`

## Next Steps

- Add more blog posts through Supabase dashboard
- Customize the blog post schema if needed
- Set up email notifications for new subscribers (optional)
- Add admin panel to manage blog posts (future enhancement)
