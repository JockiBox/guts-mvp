-- Multiplayer rooms table
CREATE TABLE IF NOT EXISTS multiplayer_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  host_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  max_players INTEGER DEFAULT 8,
  min_players INTEGER DEFAULT 2,
  current_round INTEGER DEFAULT 0,
  pot INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"ante": 1, "decisionTime": 3, "maxRounds": 10, "isPrivate": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room players table
CREATE TABLE IF NOT EXISTS room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES multiplayer_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  avatar_emoji VARCHAR(10) DEFAULT '😎',
  avatar_color VARCHAR(20) DEFAULT '#14b8a6',
  tokens INTEGER DEFAULT 100,
  is_ready BOOLEAN DEFAULT false,
  is_host BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  cards JSONB DEFAULT NULL,
  decision VARCHAR(10) DEFAULT NULL CHECK (decision IN ('hold', 'drop', NULL)),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Room chat table
CREATE TABLE IF NOT EXISTS room_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES multiplayer_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_code ON multiplayer_rooms(code);
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_status ON multiplayer_rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user_id ON room_players(user_id);
CREATE INDEX IF NOT EXISTS idx_room_chat_room_id ON room_chat(room_id);

-- Enable realtime for multiplayer tables
ALTER PUBLICATION supabase_realtime ADD TABLE multiplayer_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE room_players;
ALTER PUBLICATION supabase_realtime ADD TABLE room_chat;

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_multiplayer_room_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_multiplayer_rooms_updated_at ON multiplayer_rooms;
CREATE TRIGGER trigger_multiplayer_rooms_updated_at
  BEFORE UPDATE ON multiplayer_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_multiplayer_room_updated_at();

-- RLS policies
ALTER TABLE multiplayer_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_chat ENABLE ROW LEVEL SECURITY;

-- Rooms: anyone can read, authenticated users can create
CREATE POLICY "Rooms are viewable by everyone" ON multiplayer_rooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rooms" ON multiplayer_rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Room hosts can update their rooms" ON multiplayer_rooms
  FOR UPDATE USING (auth.uid() = host_id);

-- Room players: anyone can read, authenticated can insert/update their own
CREATE POLICY "Room players are viewable by everyone" ON room_players
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join rooms" ON room_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update themselves" ON room_players
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Players can leave rooms" ON room_players
  FOR DELETE USING (auth.uid() = user_id);

-- Chat: anyone in room can read, authenticated can send
CREATE POLICY "Chat is viewable by everyone" ON room_chat
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages" ON room_chat
  FOR INSERT WITH CHECK (auth.uid() = user_id);
