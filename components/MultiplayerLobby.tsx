'use client';

import { useState } from 'react';
import { createRoom, joinRoom, findPublicRooms, quickMatch, type MultiplayerRoom } from '@/lib/multiplayer';
import { type UserProfile } from '@/lib/supabase';
import { playClick, playSuccess, playError } from '@/lib/sounds';

interface MultiplayerLobbyProps {
  user: UserProfile;
  onJoinRoom: (room: MultiplayerRoom) => void;
  onClose: () => void;
}

export function MultiplayerLobby({ user, onJoinRoom, onClose }: MultiplayerLobbyProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'create' | 'browse'>('join');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicRooms, setPublicRooms] = useState<MultiplayerRoom[]>([]);
  const [settings, setSettings] = useState({
    ante: 1,
    decisionTime: 3,
    maxRounds: 10,
    isPrivate: true,
  });

  const handleJoinByCode = async () => {
    if (!roomCode.trim()) {
      setError('Enter a room code');
      return;
    }

    setLoading(true);
    setError(null);
    playClick();

    const result = await joinRoom(roomCode.trim().toUpperCase(), user);

    if (result.error) {
      setError(result.error);
      playError();
    } else if (result.room) {
      playSuccess();
      onJoinRoom(result.room);
    }

    setLoading(false);
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    setError(null);
    playClick();

    const room = await createRoom(user.id, settings);

    if (!room) {
      setError('Failed to create room');
      playError();
    } else {
      // Join the room we just created
      const result = await joinRoom(room.code, user);
      if (result.room) {
        playSuccess();
        onJoinRoom(result.room);
      }
    }

    setLoading(false);
  };

  const handleQuickMatch = async () => {
    setLoading(true);
    setError(null);
    playClick();

    const result = await quickMatch(user);

    if (result.error) {
      setError(result.error);
      playError();
    } else if (result.room) {
      playSuccess();
      onJoinRoom(result.room);
    }

    setLoading(false);
  };

  const handleBrowseRooms = async () => {
    setLoading(true);
    const rooms = await findPublicRooms();
    setPublicRooms(rooms);
    setLoading(false);
  };

  const handleJoinPublicRoom = async (room: MultiplayerRoom) => {
    setLoading(true);
    playClick();

    const result = await joinRoom(room.code, user);

    if (result.error) {
      setError(result.error);
      playError();
    } else if (result.room) {
      playSuccess();
      onJoinRoom(result.room);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '480px',
          width: '100%',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#14b8a6', fontSize: '24px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🎮</span> Multiplayer
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Quick Match Button */}
        <button
          onClick={handleQuickMatch}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '...' : '⚡ Quick Match'}
        </button>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '16px',
            background: '#0f172a',
            borderRadius: '10px',
            padding: '4px',
          }}
        >
          {(['join', 'create', 'browse'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                playClick();
                setActiveTab(tab);
                if (tab === 'browse') handleBrowseRooms();
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#14b8a6' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#94a3b8',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'join' && '🔗 '}
              {tab === 'create' && '➕ '}
              {tab === 'browse' && '🔍 '}
              {tab}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              color: '#f87171',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Join Tab */}
        {activeTab === 'join' && (
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Enter Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ABCD12"
              maxLength={6}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '24px',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '8px',
                background: '#0f172a',
                border: '2px solid #334155',
                borderRadius: '10px',
                color: '#14b8a6',
                marginBottom: '16px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleJoinByCode}
              disabled={loading || !roomCode.trim()}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                background: !roomCode.trim() ? '#475569' : 'linear-gradient(135deg, #14b8a6, #0f766e)',
                border: 'none',
                borderRadius: '10px',
                cursor: !roomCode.trim() ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Ante Amount
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 5, 10, 25].map((ante) => (
                  <button
                    key={ante}
                    onClick={() => setSettings({ ...settings, ante })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: settings.ante === ante ? '#14b8a6' : '#0f172a',
                      color: settings.ante === ante ? '#0f172a' : '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {ante}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Decision Time (seconds)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[3, 5, 10, 15].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSettings({ ...settings, decisionTime: time })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: settings.decisionTime === time ? '#14b8a6' : '#0f172a',
                      color: settings.decisionTime === time ? '#0f172a' : '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#cbd5e1',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.isPrivate}
                  onChange={(e) => setSettings({ ...settings, isPrivate: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#14b8a6' }}
                />
                Private Room (invite only)
              </label>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
              }}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Loading rooms...
              </div>
            ) : publicRooms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏜️</div>
                <div style={{ color: '#64748b' }}>No public rooms available</div>
                <p style={{ color: '#475569', fontSize: '13px', marginTop: '8px' }}>
                  Create one or try Quick Match!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {publicRooms.map((room) => (
                  <div
                    key={room.id}
                    style={{
                      background: '#0f172a',
                      borderRadius: '10px',
                      padding: '12px',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ color: '#14b8a6', fontWeight: '600', fontSize: '16px' }}>
                        Room {room.code}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>
                        Ante: {room.settings.ante} | {room.settings.decisionTime}s timer
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinPublicRoom(room)}
                      disabled={loading}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleBrowseRooms}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#94a3b8',
                background: 'transparent',
                border: '1px solid #334155',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              🔄 Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
