'use client';

import { supabase, type UserProfile } from './supabase';
import { type RealtimeChannel } from '@supabase/supabase-js';

// Types
export interface MultiplayerRoom {
  id: string;
  code: string;
  host_id: string;
  status: 'waiting' | 'playing' | 'finished';
  max_players: number;
  min_players: number;
  created_at: string;
  current_round: number;
  pot: number;
  settings: RoomSettings;
}

export interface RoomSettings {
  ante: number;
  decisionTime: number;
  maxRounds: number;
  isPrivate: boolean;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  avatar_emoji: string;
  avatar_color: string;
  tokens: number;
  is_ready: boolean;
  is_host: boolean;
  position: number;
  cards?: { rank: string; suit: string }[];
  decision?: 'hold' | 'drop' | null;
  is_active: boolean;
}

export interface GameAction {
  type: 'deal' | 'decision' | 'reveal' | 'result' | 'chat' | 'player_join' | 'player_leave' | 'game_start' | 'round_end';
  payload: Record<string, unknown>;
  timestamp: number;
  player_id?: string;
}

// Generate room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new multiplayer room
export async function createRoom(hostId: string, settings?: Partial<RoomSettings>): Promise<MultiplayerRoom | null> {
  const defaultSettings: RoomSettings = {
    ante: 1,
    decisionTime: 3,
    maxRounds: 10,
    isPrivate: false,
    ...settings,
  };

  try {
    const { data, error } = await supabase
      .from('multiplayer_rooms')
      .insert({
        code: generateRoomCode(),
        host_id: hostId,
        status: 'waiting',
        max_players: 8,
        min_players: 2,
        current_round: 0,
        pot: 0,
        settings: defaultSettings,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating room:', error);
    return null;
  }
}

// Join a room by code
export async function joinRoom(roomCode: string, user: UserProfile): Promise<{ room: MultiplayerRoom | null; error: string | null }> {
  try {
    // Find room
    const { data: room, error: findError } = await supabase
      .from('multiplayer_rooms')
      .select('*')
      .eq('code', roomCode.toUpperCase())
      .eq('status', 'waiting')
      .single();

    if (findError || !room) {
      return { room: null, error: 'Room not found or game already started' };
    }

    // Check if room is full
    const { count } = await supabase
      .from('room_players')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', room.id);

    if ((count || 0) >= room.max_players) {
      return { room: null, error: 'Room is full' };
    }

    // Check if already in room
    const { data: existing } = await supabase
      .from('room_players')
      .select('id')
      .eq('room_id', room.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return { room, error: null }; // Already in room
    }

    // Add player to room
    const { error: joinError } = await supabase
      .from('room_players')
      .insert({
        room_id: room.id,
        user_id: user.id,
        username: user.username,
        avatar_emoji: user.avatar_emoji,
        avatar_color: user.avatar_color,
        tokens: user.tokens,
        is_ready: false,
        is_host: room.host_id === user.id,
        position: (count || 0) + 1,
        is_active: true,
      });

    if (joinError) throw joinError;

    return { room, error: null };
  } catch (error) {
    console.error('Error joining room:', error);
    return { room: null, error: 'Failed to join room' };
  }
}

// Leave a room
export async function leaveRoom(roomId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('room_players')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId);

    return !error;
  } catch {
    return false;
  }
}

// Get room players
export async function getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
  try {
    const { data } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
      .order('position');

    return data || [];
  } catch {
    return [];
  }
}

// Set player ready status
export async function setPlayerReady(roomId: string, userId: string, ready: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('room_players')
      .update({ is_ready: ready })
      .eq('room_id', roomId)
      .eq('user_id', userId);

    return !error;
  } catch {
    return false;
  }
}

// Start the game (host only)
export async function startGame(roomId: string, hostId: string): Promise<boolean> {
  try {
    // Verify host
    const { data: room } = await supabase
      .from('multiplayer_rooms')
      .select('*')
      .eq('id', roomId)
      .eq('host_id', hostId)
      .single();

    if (!room) return false;

    // Check all players ready
    const { data: players } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId);

    if (!players || players.length < room.min_players) return false;
    if (!players.every(p => p.is_ready)) return false;

    // Update room status
    const { error } = await supabase
      .from('multiplayer_rooms')
      .update({ status: 'playing', current_round: 1 })
      .eq('id', roomId);

    return !error;
  } catch {
    return false;
  }
}

// Subscribe to room updates
export function subscribeToRoom(
  roomId: string,
  callbacks: {
    onPlayerJoin?: (player: RoomPlayer) => void;
    onPlayerLeave?: (playerId: string) => void;
    onPlayerUpdate?: (player: RoomPlayer) => void;
    onRoomUpdate?: (room: MultiplayerRoom) => void;
    onGameAction?: (action: GameAction) => void;
  }
): RealtimeChannel {
  const channel = supabase.channel(`room:${roomId}`);

  // Subscribe to room_players changes
  channel
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
      (payload) => callbacks.onPlayerJoin?.(payload.new as RoomPlayer)
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
      (payload) => callbacks.onPlayerLeave?.(payload.old.user_id)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
      (payload) => callbacks.onPlayerUpdate?.(payload.new as RoomPlayer)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'multiplayer_rooms', filter: `id=eq.${roomId}` },
      (payload) => callbacks.onRoomUpdate?.(payload.new as MultiplayerRoom)
    )
    .on('broadcast', { event: 'game_action' }, (payload) => {
      callbacks.onGameAction?.(payload.payload as GameAction);
    })
    .subscribe();

  return channel;
}

// Broadcast game action
export async function broadcastGameAction(roomId: string, action: GameAction): Promise<void> {
  const channel = supabase.channel(`room:${roomId}`);
  await channel.send({
    type: 'broadcast',
    event: 'game_action',
    payload: action,
  });
}

// Send player decision
export async function sendDecision(roomId: string, userId: string, decision: 'hold' | 'drop'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('room_players')
      .update({ decision })
      .eq('room_id', roomId)
      .eq('user_id', userId);

    if (!error) {
      await broadcastGameAction(roomId, {
        type: 'decision',
        payload: { userId, decision },
        timestamp: Date.now(),
        player_id: userId,
      });
    }

    return !error;
  } catch {
    return false;
  }
}

// Find public rooms
export async function findPublicRooms(): Promise<MultiplayerRoom[]> {
  try {
    const { data } = await supabase
      .from('multiplayer_rooms')
      .select('*, room_players(count)')
      .eq('status', 'waiting')
      .eq('settings->>isPrivate', 'false')
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  } catch {
    return [];
  }
}

// Quick match - find or create a public room
export async function quickMatch(user: UserProfile): Promise<{ room: MultiplayerRoom | null; error: string | null }> {
  try {
    // Find available public room
    const { data: rooms } = await supabase
      .from('multiplayer_rooms')
      .select('*, room_players(count)')
      .eq('status', 'waiting')
      .eq('settings->>isPrivate', 'false')
      .order('created_at', { ascending: true })
      .limit(5);

    // Find room with space
    for (const room of rooms || []) {
      const playerCount = room.room_players?.[0]?.count || 0;
      if (playerCount < room.max_players) {
        return joinRoom(room.code, user);
      }
    }

    // No available rooms, create one
    const newRoom = await createRoom(user.id, { isPrivate: false });
    if (newRoom) {
      return joinRoom(newRoom.code, user);
    }

    return { room: null, error: 'Failed to find or create room' };
  } catch {
    return { room: null, error: 'Quick match failed' };
  }
}

// Chat message
export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export async function sendChatMessage(roomId: string, userId: string, username: string, message: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('room_chat')
      .insert({
        room_id: roomId,
        user_id: userId,
        username,
        message: message.slice(0, 200), // Limit message length
      });

    return !error;
  } catch {
    return false;
  }
}

export async function getChatMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
  try {
    const { data } = await supabase
      .from('room_chat')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data || []).reverse();
  } catch {
    return [];
  }
}
