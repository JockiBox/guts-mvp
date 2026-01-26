'use client';

import { useState, useEffect } from 'react';
import {
  BattlePassState,
  BattlePassReward,
  BATTLE_PASS_REWARDS,
  loadBattlePass,
  claimReward,
  getCurrentSeason,
} from '@/lib/battlePass';

interface BattlePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (reward: BattlePassReward['free'] | BattlePassReward['premium']) => void;
  isPremium?: boolean;
}

export function BattlePassModal({ isOpen, onClose, onRewardClaimed, isPremium = false }: BattlePassModalProps) {
  const [state, setState] = useState<BattlePassState | null>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [claimAnimation, setClaimAnimation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setState(loadBattlePass());
    }
  }, [isOpen]);

  const handleClaim = (tier: number, type: 'free' | 'premium') => {
    if (!state) return;

    const reward = claimReward(tier, type === 'premium');
    if (reward) {
      setClaimAnimation(`${tier}-${type}`);
      onRewardClaimed?.(reward);
      setState(loadBattlePass());
      setTimeout(() => setClaimAnimation(null), 500);
    }
  };

  if (!isOpen || !state) return null;

  const season = getCurrentSeason();
  const xpToNextTier = 100; // XP required per tier
  const progress = (state.xp / xpToNextTier) * 100;

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
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '20px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #a855f7',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #a855f744, #7c3aed44)',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#a855f7', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                {season.name}
              </div>
              <h2 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '900', margin: 0 }}>
                🎖️ Battle Pass
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
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
          </div>

          {/* Progress */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700' }}>
                Tier {state.tier}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                {state.xp} / {xpToNextTier} XP
              </span>
            </div>
            <div
              style={{
                height: '12px',
                background: '#0f172a',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                  borderRadius: '6px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Premium status */}
          {!isPremium && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #fbbf2422, #f59e0b22)',
                borderRadius: '8px',
                border: '1px solid #fbbf2444',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '700' }}>
                  🌟 Upgrade to Premium
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  Unlock exclusive rewards!
                </div>
              </div>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                1,000 🪙
              </button>
            </div>
          )}
        </div>

        {/* Rewards Grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '12px',
            }}
          >
            {BATTLE_PASS_REWARDS.slice(0, 20).map((reward) => {
              const isUnlocked = state.tier >= reward.tier;
              const freeClaimed = state.claimedFree.includes(reward.tier);
              const premiumClaimed = state.claimedPremium.includes(reward.tier);
              const canClaimFree = isUnlocked && !freeClaimed;
              const canClaimPremium = isUnlocked && isPremium && !premiumClaimed;

              return (
                <div
                  key={reward.tier}
                  style={{
                    background: '#0f172a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: state.tier === reward.tier ? '2px solid #a855f7' : '1px solid #334155',
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                  onClick={() => setSelectedTier(selectedTier === reward.tier ? null : reward.tier)}
                >
                  {/* Tier Number */}
                  <div
                    style={{
                      padding: '6px',
                      background: isUnlocked ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : '#334155',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>
                      Tier {reward.tier}
                    </span>
                  </div>

                  {/* Free Reward */}
                  <div
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #334155',
                      textAlign: 'center',
                      animation: claimAnimation === `${reward.tier}-free` ? 'pulse 0.3s ease' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{reward.free.icon}</div>
                    <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                      {reward.free.type === 'tokens' ? `${reward.free.value} Tokens` : reward.free.value}
                    </div>
                    {freeClaimed ? (
                      <div style={{ color: '#4ade80', fontSize: '10px', marginTop: '4px' }}>✓</div>
                    ) : canClaimFree ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaim(reward.tier, 'free');
                        }}
                        style={{
                          marginTop: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#14b8a6',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Claim
                      </button>
                    ) : null}
                  </div>

                  {/* Premium Reward */}
                  <div
                    style={{
                      padding: '12px',
                      background: isPremium ? 'linear-gradient(135deg, #fbbf2411, transparent)' : '#0f172a',
                      textAlign: 'center',
                      position: 'relative',
                      animation: claimAnimation === `${reward.tier}-premium` ? 'pulse 0.3s ease' : 'none',
                    }}
                  >
                    {!isPremium && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>🔒</span>
                      </div>
                    )}
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{reward.premium.icon}</div>
                    <div style={{ color: '#fbbf24', fontSize: '10px' }}>
                      {reward.premium.type === 'tokens' ? `${reward.premium.value} Tokens` : reward.premium.value}
                    </div>
                    {premiumClaimed ? (
                      <div style={{ color: '#4ade80', fontSize: '10px', marginTop: '4px' }}>✓</div>
                    ) : canClaimPremium ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaim(reward.tier, 'premium');
                        }}
                        style={{
                          marginTop: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#fbbf24',
                          color: '#0f172a',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Claim
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-around',
            background: '#0f172a',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#a855f7', fontSize: '18px', fontWeight: '700' }}>
              {state.claimedFree.length}/{BATTLE_PASS_REWARDS.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Free Claimed</div>
          </div>
          {isPremium && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>
                {state.claimedPremium.length}/{BATTLE_PASS_REWARDS.length}
              </div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Premium Claimed</div>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f87171', fontSize: '18px', fontWeight: '700' }}>{season.daysLeft}d</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Days Left</div>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    </div>
  );
}

// Battle pass badge
export function BattlePassBadge({ onClick, tier }: { onClick: () => void; tier: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid #a855f744',
        background: 'linear-gradient(135deg, #a855f722, #7c3aed22)',
        color: '#a855f7',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      🎖️ Tier {tier}
    </button>
  );
}
