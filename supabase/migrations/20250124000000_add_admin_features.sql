-- GUTS Game Database Schema v2 - Enhanced Features

-- Add new columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS block_reason text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_tokens_earned integer DEFAULT 0;

-- Generate referral codes for existing users
UPDATE public.profiles
SET referral_code = UPPER(SUBSTRING(MD5(id::text || created_at::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- Activity log table
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info', -- info, warning, success, event
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  tokens_rewarded integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referred_id)
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  entry_fee integer DEFAULT 0,
  prize_pool integer DEFAULT 0,
  max_players integer DEFAULT 8,
  status text DEFAULT 'upcoming', -- upcoming, active, completed
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Tournament participants
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id uuid REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  placement integer,
  tokens_won integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

-- Policies for activity_log (admin only via service role)
CREATE POLICY "Service role can manage activity_log" ON public.activity_log
  FOR ALL USING (true);

-- Policies for announcements
CREATE POLICY "Anyone can view active announcements" ON public.announcements
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Policies for tournaments
CREATE POLICY "Anyone can view tournaments" ON public.tournaments
  FOR SELECT USING (true);

CREATE POLICY "Users can view tournament participants" ON public.tournament_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join tournaments" ON public.tournament_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS activity_log_user_id_idx ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS activity_log_created_at_idx ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS profiles_referral_code_idx ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS profiles_is_blocked_idx ON public.profiles(is_blocked);
CREATE INDEX IF NOT EXISTS tournaments_status_idx ON public.tournaments(status);

-- Function to generate referral code for new users
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.id::text || NOW()::text) FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for referral code generation
DROP TRIGGER IF EXISTS set_referral_code ON public.profiles;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- Function to reward referrals
CREATE OR REPLACE FUNCTION process_referral(referral_code_input text, new_user_id uuid)
RETURNS boolean AS $$
DECLARE
  referrer_record RECORD;
  referral_bonus integer := 50;
BEGIN
  -- Find referrer
  SELECT id, tokens INTO referrer_record
  FROM public.profiles
  WHERE referral_code = referral_code_input AND id != new_user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Create referral record
  INSERT INTO public.referrals (referrer_id, referred_id, tokens_rewarded)
  VALUES (referrer_record.id, new_user_id, referral_bonus);

  -- Reward referrer
  UPDATE public.profiles
  SET tokens = tokens + referral_bonus,
      referral_tokens_earned = referral_tokens_earned + referral_bonus
  WHERE id = referrer_record.id;

  -- Reward new user
  UPDATE public.profiles
  SET tokens = tokens + referral_bonus,
      referred_by = referrer_record.id
  WHERE id = new_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
