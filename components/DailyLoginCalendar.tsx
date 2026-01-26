'use client';

import { useState, useEffect } from 'react';

interface DailyReward {
  day: number;
  tokens: number;
  bonus?: string;
  claimed: boolean;
}

interface DailyLoginState {
  currentStreak: number;
  lastLoginDate: string;
  weekRewards: DailyReward[];
  totalClaimed: number;
}

const WEEKLY_REWARDS: Omit<DailyReward, 'claimed'>[] = [
  { day: 1, tokens: 50 },
  { day: 2, tokens: 75 },
  { day: 3, tokens: 100 },
  { day: 4, tokens: 125, bonus: '🎲 Free Spin' },
  { day: 5, tokens: 150 },
  { day: 6, tokens: 200 },
  { day: 7, tokens: 500, bonus: '🎁 Mystery Box' },
];

function loadDailyState(): DailyLoginState {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      lastLoginDate: '',
      weekRewards: WEEKLY_REWARDS.map((r) => ({ ...r, claimed: false })),
      totalClaimed: 0,
    };
  }

  const saved = localStorage.getItem('guts_daily_login');
  if (saved) {
    const state = JSON.parse(saved) as DailyLoginState;
    const today = new Date().toDateString();
    const lastLogin = new Date(state.lastLoginDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Reset streak if missed a day (but not if it's the same day)
    if (lastLogin !== today && lastLogin !== yesterday) {
      return {
        currentStreak: 0,
        lastLoginDate: '',
        weekRewards: WEEKLY_REWARDS.map((r) => ({ ...r, claimed: false })),
        totalClaimed: state.totalClaimed,
      };
    }

    return state;
  }

  return {
    currentStreak: 0,
    lastLoginDate: '',
    weekRewards: WEEKLY_REWARDS.map((r) => ({ ...r, claimed: false })),
    totalClaimed: 0,
  };
}

function saveDailyState(state: DailyLoginState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guts_daily_login', JSON.stringify(state));
  }
}

interface DailyLoginCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onTokensEarned?: (tokens: number, bonus?: string) => void;
}

export function DailyLoginCalendar({ isOpen, onClose, onTokensEarned }: DailyLoginCalendarProps) {
  const [state, setState] = useState<DailyLoginState | null>(null);
  const [claimAnimation, setClaimAnimation] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setState(loadDailyState());
    }
  }, [isOpen]);

  const canClaimToday = () => {
    if (!state) return false;
    const today = new Date().toDateString();
    const lastLogin = state.lastLoginDate ? new Date(state.lastLoginDate).toDateString() : '';
    return lastLogin !== today;
  };

  const handleClaim = () => {
    if (!state || !canClaimToday()) return;

    const nextDay = (state.currentStreak % 7) + 1;
    const reward = state.weekRewards.find((r) => r.day === nextDay);
    if (!reward) return;

    setClaimAnimation(nextDay);

    const newState: DailyLoginState = {
      currentStreak: state.currentStreak + 1,
      lastLoginDate: new Date().toISOString(),
      weekRewards: state.weekRewards.map((r) =>
        r.day === nextDay ? { ...r, claimed: true } : r
      ),
      totalClaimed: state.totalClaimed + reward.tokens,
    };

    // Reset week if completed
    if (nextDay === 7) {
      newState.weekRewards = WEEKLY_REWARDS.map((r) => ({ ...r, claimed: false }));
    }

    setState(newState);
    saveDailyState(newState);
    onTokensEarned?.(reward.tokens, reward.bonus);

    setTimeout(() => setClaimAnimation(null), 600);
  };

  if (!isOpen || !state) return null;

  const todayRewardDay = (state.currentStreak % 7) + 1;
  const todayReward = state.weekRewards.find((r) => r.day === todayRewardDay);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '20px',
          maxWidth: '400px',
          width: '100%',
          overflow: 'hidden',
          border: '1px solid #334155',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #fbbf2422, #f59e0b22)',
            borderBottom: '1px solid #334155',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
          <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>
            Daily Login
          </h2>
          <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>
            🔥 {state.currentStreak} Day Streak!
          </div>
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
          }}
        >
          {state.weekRewards.map((reward) => {
            const isToday = reward.day === todayRewardDay && canClaimToday();
            const isPast = reward.day < todayRewardDay || reward.claimed;
            const isFuture = reward.day > todayRewardDay && !reward.claimed;

            return (
              <div
                key={reward.day}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  background: isPast
                    ? 'linear-gradient(135deg, #22c55e22, #14b8a622)'
                    : isToday
                    ? 'linear-gradient(135deg, #fbbf2444, #f59e0b44)'
                    : '#0f172a',
                  border: isToday
                    ? '2px solid #fbbf24'
                    : isPast
                    ? '1px solid #22c55e44'
                    : '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  opacity: isFuture ? 0.5 : 1,
                  animation: claimAnimation === reward.day ? 'bounce 0.5s ease' : 'none',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '2px' }}>
                  Day {reward.day}
                </div>
                {isPast ? (
                  <div style={{ color: '#4ade80', fontSize: '20px' }}>✓</div>
                ) : (
                  <>
                    <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '700' }}>
                      🪙{reward.tokens}
                    </div>
                    {reward.bonus && (
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>{reward.bonus.split(' ')[0]}</div>
                    )}
                  </>
                )}
                {reward.day === 7 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#fbbf24',
                      borderRadius: '4px',
                      padding: '1px 4px',
                      fontSize: '8px',
                      fontWeight: '700',
                      color: '#0f172a',
                    }}
                  >
                    2X
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Today's Reward */}
        {todayReward && canClaimToday() && (
          <div
            style={{
              margin: '0 20px 20px',
              padding: '16px',
              background: 'linear-gradient(135deg, #fbbf2422, #f59e0b22)',
              borderRadius: '12px',
              border: '1px solid #fbbf2444',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
              TODAY&apos;S REWARD
            </div>
            <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: '900', marginBottom: '4px' }}>
              🪙 {todayReward.tokens} Tokens
            </div>
            {todayReward.bonus && (
              <div style={{ color: '#f59e0b', fontSize: '14px' }}>+ {todayReward.bonus}</div>
            )}
          </div>
        )}

        {/* Claim Button */}
        <div style={{ padding: '0 20px 20px' }}>
          {canClaimToday() ? (
            <button
              onClick={handleClaim}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#0f172a',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Claim Today&apos;s Reward!
            </button>
          ) : (
            <div
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#0f172a',
                color: '#4ade80',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              ✓ Already Claimed Today - Come Back Tomorrow!
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-around',
            background: '#0f172a',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '700' }}>
              {state.totalClaimed.toLocaleString()}
            </div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Total Earned</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f87171', fontSize: '16px', fontWeight: '700' }}>
              🔥 {state.currentStreak}
            </div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Day Streak</div>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    </div>
  );
}

// Badge for daily login
export function DailyLoginBadge({ onClick }: { onClick: () => void }) {
  const [canClaim, setCanClaim] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const state = loadDailyState();
    setStreak(state.currentStreak);
    const today = new Date().toDateString();
    const lastLogin = state.lastLoginDate ? new Date(state.lastLoginDate).toDateString() : '';
    setCanClaim(lastLogin !== today);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '8px',
        border: canClaim ? '1px solid #fbbf24' : '1px solid #334155',
        background: canClaim ? 'linear-gradient(135deg, #fbbf2422, #f59e0b22)' : '#1e293b',
        color: canClaim ? '#fbbf24' : '#94a3b8',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
      }}
    >
      📅 Day {streak + 1}
      {canClaim && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#fbbf24',
            border: '2px solid #1e293b',
            animation: 'pulse 1s ease infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </button>
  );
}
