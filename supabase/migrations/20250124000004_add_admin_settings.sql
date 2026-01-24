-- Admin Settings Table for Feature Flags and Configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO admin_settings (id, settings) VALUES (
  'global',
  '{
    "multiplayerEnabled": true,
    "tournamentsEnabled": true,
    "referralsEnabled": true,
    "dailyRewardsEnabled": true,
    "friendsEnabled": true,
    "chatEnabled": true,
    "chatModerationEnabled": true,
    "shopEnabled": true,
    "tokenPurchasesEnabled": true,
    "pushNotificationsEnabled": true,
    "defaultAnte": 1,
    "maxPlayersPerRoom": 8,
    "decisionTimeSeconds": 3,
    "maintenanceMode": false,
    "maintenanceMessage": "We are currently performing maintenance. Please check back soon!",
    "signupsEnabled": true,
    "guestModeEnabled": true,
    "leaderboardEnabled": true,
    "achievementsEnabled": true,
    "tutorialEnabled": true,
    "soundEnabled": true,
    "spectatorModeEnabled": true,
    "socialSharingEnabled": true,
    "minTokensToPlay": 1,
    "maxAnteMultiplier": 10,
    "dailyRewardBaseAmount": 10,
    "referralBonus": 50,
    "welcomeBonus": 100
  }'
) ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS admin_settings_timestamp ON admin_settings;
CREATE TRIGGER admin_settings_timestamp
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_timestamp();

-- Grant permissions
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Only service role can access admin settings directly
CREATE POLICY "Service role access admin settings" ON admin_settings
  FOR ALL USING (true);
