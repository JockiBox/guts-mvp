-- Friend requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Friendships table (bidirectional)
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_friend_requests_to_user ON friend_requests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_from_user ON friend_requests(from_user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);

-- RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Friend requests policies
CREATE POLICY "Users can view their own friend requests" ON friend_requests
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send friend requests" ON friend_requests
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update friend requests sent to them" ON friend_requests
  FOR UPDATE USING (auth.uid() = to_user_id);

-- Friendships policies
CREATE POLICY "Users can view their own friendships" ON friendships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- Add referral fields to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referral_code') THEN
    ALTER TABLE profiles ADD COLUMN referral_code VARCHAR(10) UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referred_by') THEN
    ALTER TABLE profiles ADD COLUMN referred_by UUID REFERENCES profiles(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referral_tokens_earned') THEN
    ALTER TABLE profiles ADD COLUMN referral_tokens_earned INTEGER DEFAULT 0;
  END IF;
END $$;

-- Referral code function and triggers are created in the next migration (20250124000003)
