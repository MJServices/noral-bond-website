-- Create subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('free', 'standard', 'premium');

-- Update profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier subscription_tier DEFAULT 'free';

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY, -- Stripe Subscription ID
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT, -- active, trialing, past_due, canceled, incomplete
  price_id TEXT,
  cancel_at_period_end BOOLEAN DEFAULT false,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own subscription" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Only service role can insert/update (via webhooks)
CREATE POLICY "Service role can manage subscriptions" 
ON subscriptions FOR ALL 
USING (true) 
WITH CHECK (true);
