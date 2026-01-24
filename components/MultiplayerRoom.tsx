'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToRoom,
  getRoomPlayers,
  setPlayerReady,
  startGame,
  leaveRoom,
  sendChatMessage,
  getChatMessages,
  type MultiplayerRoom,
  type RoomPlayer,
  type ChatMessage,
} from '@/lib/multiplayer';
import { type UserProfile } from '@/lib/supabase';
import { playClick, playSuccess, playError } from '@/lib/sounds';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface MultiplayerRoomProps {
  room: MultiplayerRoom;
  user: UserProfile;
  onLeave: () => void;
  onGameStart: (room: MultiplayerRoom, players: RoomPlayer[]) => void;
}

export function MultiplayerRoom({ room, user, onLeave, onGameStart }: MultiplayerRoomProps) {
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(room);

  const isHost = room.host_id === user.id;
  const allReady = players.length >= room.min_players && players.every((p) => p.is_ready);
  const currentPlayer = players.find((p) => p.user_id === user.id);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [roomPlayers, chatMessages] = await Promise.all([
        getRoomPlayers(room.id),
        getChatMessages(room.id),
      ]);
      setPlayers(roomPlayers);
      setMessages(chatMessages);

      const me = roomPlayers.find((p) => p.user_id === user.id);
      if (me) setIsReady(me.is_ready);

      setLoading(false);
    };
    loadData();
  }, [room.id, user.id]);

  // Subscribe to room updates
  useEffect(() => {
    const channel: RealtimeChannel = subscribeToRoom(room.id, {
      onPlayerJoin: (player) => {
        setPlayers((prev) => {
          if (prev.find((p) => p.user_id === player.user_id)) return prev;
          playSuccess();
          return [...prev, player];
        });
      },
      onPlayerLeave: (playerId) => {
        setPlayers((prev) => prev.filter((p) => p.user_id !== playerId));
      },
      onPlayerUpdate: (player) => {
        setPlayers((prev) => prev.map((p) => (p.user_id === player.user_id ? player : p)));
      },
      onRoomUpdate: (updatedRoom) => {
        setCurrentRoom(updatedRoom);
        if (updatedRoom.status === 'playing') {
          playSuccess();
          onGameStart(updatedRoom, players);
        }
      },
    });

    return () => {
      channel.unsubscribe();
    };
  }, [room.id, players, onGameStart]);

  const handleReady = async () => {
    playClick();
    const newReady = !isReady;
    const success = await setPlayerReady(room.id, user.id, newReady);
    if (success) {
      setIsReady(newReady);
    }
  };

  const handleStartGame = async () => {
    if (!isHost || !allReady) return;
    playClick();
    const success = await startGame(room.id, user.id);
    if (!success) {
      playError();
    }
  };

  const handleLeave = async () => {
    playClick();
    await leaveRoom(room.id, user.id);
    onLeave();
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendChatMessage(room.id, user.id, user.username, newMessage.trim());
    if (success) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          room_id: room.id,
          user_id: user.id,
          username: user.username,
          message: newMessage.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 1s ease-in-out infinite' }}>🎮</div>
          <div style={{ color: '#64748b' }}>Loading room...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleLeave}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#f87171',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Leave
          </button>
          <div>
            <div style={{ color: '#14b8a6', fontSize: '18px', fontWeight: '700' }}>
              Room {room.code}
              {isHost && <span style={{ color: '#fbbf24', marginLeft: '8px', fontSize: '12px' }}>HOST</span>}
            </div>
            <div style={{ color: '#64748b', fontSize: '12px' }}>
              Ante: {currentRoom.settings.ante} | {currentRoom.settings.decisionTime}s timer
            </div>
          </div>
        </div>
        <button
          onClick={handleCopyCode}
          style={{
            background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(20, 184, 166, 0.2)',
            border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(20, 184, 166, 0.3)'}`,
            borderRadius: '8px',
            padding: '8px 16px',
            color: copied ? '#4ade80' : '#14b8a6',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
        {/* Players Grid */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
            Players ({players.length}/{room.max_players})
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
            }}
          >
            {players.map((player) => (
              <div
                key={player.id}
                style={{
                  background: player.is_ready ? 'rgba(34, 197, 94, 0.1)' : '#1e293b',
                  border: `2px solid ${
                    player.user_id === user.id
                      ? '#14b8a6'
                      : player.is_ready
                      ? 'rgba(34, 197, 94, 0.5)'
                      : '#334155'
                  }`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: player.avatar_color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    margin: '0 auto 8px',
                  }}
                >
                  {player.avatar_emoji}
                </div>
                <div style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {player.username}
                  {player.is_host && <span style={{ color: '#fbbf24', marginLeft: '4px' }}>👑</span>}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: player.is_ready ? '#4ade80' : '#64748b',
                  }}
                >
                  {player.is_ready ? '✓ READY' : 'Not Ready'}
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: room.max_players - players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  background: '#0f172a',
                  border: '2px dashed #334155',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  opacity: 0.5,
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    margin: '0 auto 8px',
                  }}
                >
                  ?
                </div>
                <div style={{ color: '#475569', fontSize: '12px' }}>Waiting...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div
          style={{
            flex: 1,
            background: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '150px',
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>💬 Chat</span>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No messages yet. Say hi!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    background: msg.user_id === user.id ? 'rgba(20, 184, 166, 0.1)' : '#1e293b',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    alignSelf: msg.user_id === user.id ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <div style={{ color: '#14b8a6', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>
                    {msg.username}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>{msg.message}</div>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #334155',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              maxLength={200}
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                padding: '10px 16px',
                background: newMessage.trim() ? '#14b8a6' : '#334155',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid #334155',
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          onClick={handleReady}
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            color: isReady ? '#0f172a' : 'white',
            background: isReady
              ? 'linear-gradient(135deg, #4ade80, #22c55e)'
              : 'linear-gradient(135deg, #14b8a6, #0f766e)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: isReady
              ? '0 4px 14px rgba(74, 222, 128, 0.4)'
              : '0 4px 14px rgba(20, 184, 166, 0.4)',
          }}
        >
          {isReady ? '✓ Ready!' : 'Ready Up'}
        </button>

        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={!allReady}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: allReady
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : '#475569',
              border: 'none',
              borderRadius: '12px',
              cursor: allReady ? 'pointer' : 'not-allowed',
              boxShadow: allReady ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none',
            }}
          >
            {allReady ? '🚀 Start Game' : `Waiting (${players.filter((p) => p.is_ready).length}/${players.length})`}
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
