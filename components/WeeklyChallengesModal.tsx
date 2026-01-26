'use client';

import { useState, useEffect } from 'react';
import {
  WeeklyChallenge,
  loadWeeklyChallenges,
  claimWeeklyReward,
  claimWeeklyBonus,
  getWeeklyStats,
} from '@/lib/weeklyChallenges';

interface WeeklyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokensEarned?: (tokens: number) => void;
}

export function WeeklyChallengesModal({ isOpen, onClose, onTokensEarned }: WeeklyChallengesModalProps) {
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getWeeklyStats> | null>(null);
  const [claimAnimation, setClaimAnimation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const progress = loadWeeklyChallenges();
      setChallenges(progress.challenges);
      setStats(getWeeklyStats());
    }
  }, [isOpen]);

  const handleClaim = (challengeId: string) => {
    const tokens = claimWeeklyReward(challengeId);
    if (tokens > 0) {
      setClaimAnimation(challengeId);
      onTokensEarned?.(tokens);

      // Refresh
      const progress = loadWeeklyChallenges();
      setChallenges(progress.challenges);
      setStats(getWeeklyStats());

      setTimeout(() => setClaimAnimation(null), 500);
    }
  };

  const handleClaimBonus = () => {
    const tokens = claimWeeklyBonus();
    if (tokens > 0) {
      setClaimAnimation('bonus');
      onTokensEarned?.(tokens);
      setStats(getWeeklyStats());
      setTimeout(() => setClaimAnimation(null), 500);
    }
  };

  if (!isOpen) return null;

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
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #334155',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #334155',
            background: 'linear-gradient(135deg, #4f46e544, #7c3aed44)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', margin: 0 }}>
              📅 Weekly Challenges
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
          {stats && (
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
              {stats.completed}/{stats.total} completed • {stats.daysLeft} days left
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {stats && (
          <div style={{ padding: '16px 20px', background: '#0f172a' }}>
            <div
              style={{
                height: '8px',
                background: '#334155',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(stats.completed / stats.total) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Challenges List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  background: '#0f172a',
                  borderRadius: '12px',
                  padding: '16px',
                  border: challenge.completed ? '1px solid #a855f744' : '1px solid #334155',
                  animation: claimAnimation === challenge.id ? 'pulse 0.3s ease' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: challenge.completed ? '#a855f722' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                      }}
                    >
                      {challenge.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {challenge.name}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>
                        {challenge.description}
                      </div>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: '6px',
                          background: '#334155',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%`,
                            height: '100%',
                            background: challenge.completed
                              ? 'linear-gradient(90deg, #a855f7, #7c3aed)'
                              : 'linear-gradient(90deg, #14b8a6, #0d9488)',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                        {challenge.progress} / {challenge.target}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginLeft: '12px', textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                      🪙 {challenge.reward}
                    </div>
                    {challenge.completed && !challenge.claimed ? (
                      <button
                        onClick={() => handleClaim(challenge.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Claim
                      </button>
                    ) : challenge.claimed ? (
                      <span style={{ color: '#4ade80', fontSize: '12px' }}>✓ Claimed</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus for all complete */}
        {stats && stats.allDone && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #334155',
              background: 'linear-gradient(135deg, #fbbf2422, #f59e0b22)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '700' }}>
                  🎉 All Challenges Complete!
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Bonus: 500 tokens</div>
              </div>
              <button
                onClick={handleClaimBonus}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#0f172a',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  animation: claimAnimation === 'bonus' ? 'pulse 0.3s ease' : 'none',
                }}
              >
                Claim Bonus
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}</style>
      </div>
    </div>
  );
}

// Badge showing weekly progress
export function WeeklyChallengeBadge({ onClick }: { onClick: () => void }) {
  const [stats, setStats] = useState<ReturnType<typeof getWeeklyStats> | null>(null);

  useEffect(() => {
    setStats(getWeeklyStats());
  }, []);

  if (!stats) return null;

  const hasUnclaimed = stats.completed > 0; // Simplified check

  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid #7c3aed44',
        background: hasUnclaimed ? 'linear-gradient(135deg, #7c3aed22, #a855f722)' : '#1e293b',
        color: '#a855f7',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
      }}
    >
      📅 {stats.completed}/{stats.total}
      {hasUnclaimed && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#f59e0b',
            border: '2px solid #1e293b',
          }}
        />
      )}
    </button>
  );
}
