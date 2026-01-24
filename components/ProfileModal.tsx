'use client';

import { useState } from 'react';
import { type UserProfile, updateUserProfile, signOut } from '@/lib/supabase';
import { playClick } from '@/lib/sounds';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdate: () => void;
  onSignOut: () => void;
}

const AVATAR_COLORS = [
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#ef4444', // red
  '#f59e0b', // amber
  '#22c55e', // green
  '#64748b', // slate
];

export function ProfileModal({ isOpen, onClose, user, onUpdate, onSignOut }: ProfileModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar_emoji);
  const [selectedColor, setSelectedColor] = useState(user.avatar_color);
  const [username, setUsername] = useState(user.username);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(user.id, {
        avatar_emoji: selectedAvatar,
        avatar_color: selectedColor,
        username,
      });
      playClick();
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
    onClose();
  };

  const winRate = user.total_games > 0
    ? Math.round((user.total_wins / user.total_games) * 100)
    : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '450px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#14b8a6', margin: 0 }}>
            Profile
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

        {/* Avatar Preview */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: selectedColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 12px',
              border: '4px solid rgba(255,255,255,0.2)',
              boxShadow: `0 0 20px ${selectedColor}50`,
            }}
          >
            {selectedAvatar}
          </div>
          <div style={{ color: '#cbd5e1', fontWeight: '700', fontSize: '18px' }}>{username}</div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>{user.email}</div>
          {user.vip_level > 0 && (
            <div style={{ color: '#fbbf24', fontSize: '12px', marginTop: '4px' }}>
              {user.vip_level === 1 ? '🥉 Bronze' : user.vip_level === 2 ? '🥈 Silver' : '🥇 Gold'} VIP
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700' }}>
              🪙 {user.tokens.toLocaleString()}
            </div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Tokens</div>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ color: '#4ade80', fontSize: '20px', fontWeight: '700' }}>{winRate}%</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Win Rate</div>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ color: '#a855f7', fontSize: '20px', fontWeight: '700' }}>{user.daily_streak}</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Day Streak</div>
          </div>
        </div>

        {/* Username Edit */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Avatar Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
            Avatar ({user.unlocked_avatars.length} unlocked)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user.unlocked_avatars.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  playClick();
                  setSelectedAvatar(emoji);
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: selectedAvatar === emoji ? '3px solid #14b8a6' : '1px solid #334155',
                  background: selectedAvatar === emoji ? 'rgba(20, 184, 166, 0.2)' : '#0f172a',
                  fontSize: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
            Avatar Color
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  playClick();
                  setSelectedColor(color);
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: selectedColor === color ? '3px solid white' : '2px solid transparent',
                  background: color,
                  cursor: 'pointer',
                  boxShadow: selectedColor === color ? `0 0 12px ${color}` : 'none',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            background: saving
              ? '#475569'
              : 'linear-gradient(135deg, #14b8a6, #0f766e)',
            border: 'none',
            borderRadius: '10px',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
            marginBottom: '12px',
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            color: '#f87171',
            background: 'transparent',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
