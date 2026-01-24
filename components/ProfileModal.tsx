'use client';

import { useState, useEffect } from 'react';
import { type UserProfile, updateUserProfile, signOut, getReferralStats, getNotifications, markNotificationRead, supabase } from '@/lib/supabase';
import { playClick, playTokens, setMasterVolume, getMasterVolume } from '@/lib/sounds';
import Link from 'next/link';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdate: () => void;
  onSignOut: () => void;
}

interface GameHistoryEntry {
  id: string;
  rounds_played: number;
  tokens_won: number;
  tokens_lost: number;
  final_result: string;
  created_at: string;
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
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#d946ef', // fuchsia
  '#84cc16', // lime
];

// Additional purchasable avatar emojis
const PREMIUM_AVATARS = ['👑', '🦁', '🐉', '🦊', '🦄', '🐺', '🦅', '🦈', '🐙', '🦋', '🔥', '💎', '⚡', '🌟', '🎭', '🎪'];

type TabType = 'profile' | 'referrals' | 'notifications' | 'history' | 'settings';

export function ProfileModal({ isOpen, onClose, user, onUpdate, onSignOut }: ProfileModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar_emoji);
  const [selectedColor, setSelectedColor] = useState(user.avatar_color);
  const [username, setUsername] = useState(user.username);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [referralStats, setReferralStats] = useState<{ code: string | null; referrals: number; tokensEarned: number } | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; read: boolean; created_at: string }>>([]);
  const [copied, setCopied] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [soundVolume, setSoundVolume] = useState(getMasterVolume());

  useEffect(() => {
    if (isOpen) {
      getReferralStats(user.id).then(setReferralStats);
      getNotifications(user.id).then(setNotifications);
    }
  }, [isOpen, user.id]);

  // Load game history when tab is selected
  useEffect(() => {
    if (isOpen && activeTab === 'history' && gameHistory.length === 0) {
      loadGameHistory();
    }
  }, [isOpen, activeTab, user.id]);

  const loadGameHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setGameHistory(data || []);
    } catch (error) {
      console.error('Error loading game history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVolumeChange = (volume: number) => {
    setSoundVolume(volume);
    setMasterVolume(volume);
    playClick();
  };

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

  const copyReferralCode = () => {
    if (referralStats?.code) {
      navigator.clipboard.writeText(referralStats.code);
      setCopied(true);
      playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferral = async () => {
    if (!referralStats?.code) return;

    const shareUrl = `${window.location.origin}?ref=${referralStats.code}`;
    const shareText = `Play GUTS with me! Use my code ${referralStats.code} for 50 free tokens!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on GUTS!',
          text: shareText,
          url: shareUrl,
        });
        playTokens();
      } catch {
        copyReferralCode();
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
  };

  const winRate = user.total_games > 0
    ? Math.round((user.total_wins / user.total_games) * 100)
    : 0;

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '20px',
            background: '#0f172a',
            borderRadius: '10px',
            padding: '4px',
            flexWrap: 'wrap',
          }}
        >
          {(['profile', 'history', 'referrals', 'notifications', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                playClick();
                setActiveTab(tab);
              }}
              style={{
                flex: '1 1 auto',
                minWidth: '60px',
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#14b8a6' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              {tab === 'profile' && '👤'}
              {tab === 'history' && '📊'}
              {tab === 'referrals' && '🎁'}
              {tab === 'notifications' && '🔔'}
              {tab === 'settings' && '⚙️'}
              {tab === 'notifications' && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '4px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: '700',
                    borderRadius: '10px',
                    padding: '1px 4px',
                    minWidth: '14px',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
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

            {/* Links */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Link
                href="/leaderboard"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#fbbf24',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                🏆 Leaderboard
              </Link>
              <button
                onClick={() => setActiveTab('referrals')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#14b8a6',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🎁 Invite Friends
              </button>
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
          </>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎁</div>
              <h3 style={{ color: '#14b8a6', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                Invite Friends
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Share your code and both of you get <span style={{ color: '#fbbf24', fontWeight: '600' }}>50 tokens!</span>
              </p>
            </div>

            {/* Referral Code */}
            {referralStats?.code && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
                  Your Referral Code
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#0f172a',
                    borderRadius: '10px',
                    border: '2px solid #14b8a6',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      color: '#14b8a6',
                      fontSize: '20px',
                      fontWeight: '700',
                      letterSpacing: '4px',
                      fontFamily: 'monospace',
                      textAlign: 'center',
                    }}
                  >
                    {referralStats.code}
                  </div>
                  <button
                    onClick={copyReferralCode}
                    style={{
                      padding: '14px 16px',
                      background: copied ? '#22c55e' : '#14b8a6',
                      border: 'none',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={shareReferral}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              📤 Share Invite Link
            </button>

            {/* Stats */}
            {referralStats && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ color: '#14b8a6', fontSize: '24px', fontWeight: '700' }}>
                    {referralStats.referrals}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Friends Invited</div>
                </div>
                <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: '700' }}>
                    🪙 {referralStats.tokensEarned}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Tokens Earned</div>
                </div>
              </div>
            )}

            {/* How it works */}
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px' }}>
              <h4 style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                How it works
              </h4>
              <ol style={{ margin: 0, padding: '0 0 0 16px', color: '#94a3b8', fontSize: '13px' }}>
                <li style={{ marginBottom: '8px' }}>Share your code with friends</li>
                <li style={{ marginBottom: '8px' }}>They enter it when signing up</li>
                <li>Both of you get 50 bonus tokens!</li>
              </ol>
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            <h3 style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Recent Notifications
            </h3>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    style={{
                      background: notification.read ? '#0f172a' : 'rgba(20, 184, 166, 0.1)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      border: notification.read ? '1px solid #334155' : '1px solid rgba(20, 184, 166, 0.3)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ color: notification.read ? '#94a3b8' : '#14b8a6', fontWeight: '600', fontSize: '14px' }}>
                        {notification.title}
                      </div>
                      {!notification.read && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#14b8a6',
                          }}
                        />
                      )}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>
                      {notification.message}
                    </p>
                    <div style={{ color: '#475569', fontSize: '10px', marginTop: '4px' }}>
                      {new Date(notification.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Game History Tab */}
        {activeTab === 'history' && (
          <>
            <h3 style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Game History
            </h3>
            {historyLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px', animation: 'pulse 1s ease-in-out infinite' }}>📊</div>
                <p>Loading history...</p>
              </div>
            ) : gameHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
                <p>No games played yet</p>
                <p style={{ fontSize: '12px', color: '#475569' }}>Start playing to see your history!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {gameHistory.map((game) => {
                  const netTokens = game.tokens_won - game.tokens_lost;
                  const isWin = netTokens > 0;
                  return (
                    <div
                      key={game.id}
                      style={{
                        background: '#0f172a',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        border: `1px solid ${isWin ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '14px' }}>
                            {game.rounds_played} rounds played
                          </div>
                          <div style={{ color: '#64748b', fontSize: '11px' }}>
                            {new Date(game.created_at).toLocaleDateString()} at {new Date(game.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: isWin ? '#4ade80' : '#f87171',
                              fontWeight: '700',
                              fontSize: '16px',
                            }}
                          >
                            {isWin ? '+' : ''}{netTokens} 🪙
                          </div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>
                            Won: {game.tokens_won} | Lost: {game.tokens_lost}
                          </div>
                        </div>
                      </div>
                      {game.final_result && (
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '6px 10px',
                            background: isWin ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            color: isWin ? '#4ade80' : '#f87171',
                          }}
                        >
                          {game.final_result}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <>
            <h3 style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Game Settings
            </h3>

            {/* Sound Volume */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                Sound Volume
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{soundVolume === 0 ? '🔇' : soundVolume < 0.5 ? '🔉' : '🔊'}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soundVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right, #14b8a6 ${soundVolume * 100}%, #334155 ${soundVolume * 100}%)`,
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ color: '#64748b', fontSize: '12px', minWidth: '40px', textAlign: 'right' }}>
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Volume Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((vol) => (
                <button
                  key={vol}
                  onClick={() => handleVolumeChange(vol)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: soundVolume === vol ? '2px solid #14b8a6' : '1px solid #334155',
                    background: soundVolume === vol ? 'rgba(20, 184, 166, 0.2)' : '#0f172a',
                    color: soundVolume === vol ? '#14b8a6' : '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {vol === 0 ? 'Off' : `${vol * 100}%`}
                </button>
              ))}
            </div>

            {/* Premium Avatars (locked unless purchased) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                Premium Avatars
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PREMIUM_AVATARS.map((emoji) => {
                  const isUnlocked = user.unlocked_avatars.includes(emoji);
                  return (
                    <button
                      key={emoji}
                      onClick={() => {
                        if (isUnlocked) {
                          playClick();
                          setSelectedAvatar(emoji);
                          setActiveTab('profile');
                        }
                      }}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        border: isUnlocked ? '1px solid #fbbf24' : '1px solid #334155',
                        background: isUnlocked ? 'rgba(251, 191, 36, 0.1)' : '#0f172a',
                        fontSize: '22px',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.4,
                        position: 'relative',
                      }}
                      title={isUnlocked ? emoji : 'Locked - Purchase in shop'}
                    >
                      {emoji}
                      {!isUnlocked && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            fontSize: '10px',
                          }}
                        >
                          🔒
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p style={{ color: '#64748b', fontSize: '11px', marginTop: '8px' }}>
                Purchase premium avatars in the shop
              </p>
            </div>

            {/* Account Info */}
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Account
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Email</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Member since</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Total games</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{user.total_games}</span>
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '12px',
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
          </>
        )}
      </div>
    </div>
  );
}
