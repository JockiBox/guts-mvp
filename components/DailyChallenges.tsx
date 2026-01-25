'use client';

import { useState, useEffect } from 'react';
import { loadDailyChallenges, claimChallengeReward, DailyProgress, Challenge } from '@/lib/dailyChallenges';

interface DailyChallengesProps {
  onClaimReward: (reward: number) => void;
  onClose: () => void;
}

export function DailyChallengesModal({ onClaimReward, onClose }: DailyChallengesProps) {
  const [progress, setProgress] = useState<DailyProgress | null>(null);

  useEffect(() => {
    setProgress(loadDailyChallenges());
  }, []);

  const handleClaim = (challengeId: string) => {
    if (!progress) return;
    const { updated, reward } = claimChallengeReward(progress, challengeId);
    setProgress(updated);
    if (reward > 0) {
      onClaimReward(reward);
    }
  };

  if (!progress) return null;

  const completedCount = progress.challenges.filter(c => c.completed).length;
  const claimedCount = progress.challenges.filter(c => c.claimed).length;

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '24px',
          border: '2px solid #14b8a6',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 184, 166, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅</span> Daily Challenges
            </h2>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
              Resets daily at midnight
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>Progress</span>
            <span style={{ color: '#14b8a6', fontSize: '12px', fontWeight: 'bold' }}>
              {completedCount}/3 Complete
            </span>
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(51, 65, 85, 0.5)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(completedCount / 3) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #14b8a6, #22c55e)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Challenges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {progress.challenges.map((item) => {
            const progressPercent = Math.min(100, (item.progress / item.challenge.target) * 100);

            return (
              <div
                key={item.challenge.id}
                style={{
                  padding: '16px',
                  background: item.claimed
                    ? 'rgba(34, 197, 94, 0.1)'
                    : item.completed
                    ? 'rgba(20, 184, 166, 0.15)'
                    : 'rgba(51, 65, 85, 0.3)',
                  borderRadius: '12px',
                  border: item.claimed
                    ? '1px solid #22c55e'
                    : item.completed
                    ? '2px solid #14b8a6'
                    : '1px solid #475569',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: item.completed
                        ? 'linear-gradient(135deg, #14b8a6, #22c55e)'
                        : 'rgba(51, 65, 85, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {item.claimed ? '✓' : item.challenge.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px' }}>
                      {item.challenge.name}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                      {item.challenge.description}
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: '8px' }}>
                      <div
                        style={{
                          height: '6px',
                          background: 'rgba(51, 65, 85, 0.5)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            background: item.completed
                              ? 'linear-gradient(90deg, #22c55e, #14b8a6)'
                              : '#fbbf24',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '4px',
                          fontSize: '10px',
                        }}
                      >
                        <span style={{ color: '#64748b' }}>
                          {item.progress}/{item.challenge.target}
                        </span>
                        <span style={{ color: '#fbbf24' }}>
                          🪙 {item.challenge.reward}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Claim button */}
                  {item.completed && !item.claimed && (
                    <button
                      onClick={() => handleClaim(item.challenge.id)}
                      style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px',
                        animation: 'pulse 1s ease-in-out infinite',
                      }}
                    >
                      CLAIM
                    </button>
                  )}

                  {item.claimed && (
                    <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bonus for all complete */}
        {completedCount === 3 && claimedCount === 3 && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
              borderRadius: '12px',
              border: '2px solid #fbbf24',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎉</div>
            <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>All Challenges Complete!</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>Come back tomorrow for more!</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// Mini badge to show in header
interface ChallengesBadgeProps {
  onClick: () => void;
}

export function DailyChallengeBadge({ onClick }: ChallengesBadgeProps) {
  const [unclaimedCount, setUnclaimedCount] = useState(0);

  useEffect(() => {
    const progress = loadDailyChallenges();
    const unclaimed = progress.challenges.filter(c => c.completed && !c.claimed).length;
    setUnclaimedCount(unclaimed);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        background: unclaimedCount > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(30, 41, 59, 0.9)',
        borderRadius: '8px',
        padding: '6px 10px',
        border: unclaimedCount > 0 ? '2px solid #22c55e' : '2px solid #334155',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: '16px' }}>📅</span>
      {unclaimedCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#22c55e',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        >
          {unclaimedCount}
        </span>
      )}
    </button>
  );
}
