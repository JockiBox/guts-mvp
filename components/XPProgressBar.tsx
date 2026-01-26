'use client';

import { useState, useEffect } from 'react';
import { loadXPState, getXPProgress, VIP_PERKS, XPState } from '@/lib/xpSystem';

interface XPProgressBarProps {
  compact?: boolean;
  showVIP?: boolean;
}

export function XPProgressBar({ compact = false, showVIP = true }: XPProgressBarProps) {
  const [xpState, setXPState] = useState<XPState | null>(null);
  const [progress, setProgress] = useState({ current: 0, needed: 100, percent: 0 });

  useEffect(() => {
    setXPState(loadXPState());
    setProgress(getXPProgress());
  }, []);

  if (!xpState) return null;

  const vipColors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
    diamond: '#b9f2ff',
  };

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: '#0f172a',
          borderRadius: '8px',
          border: '1px solid #334155',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: vipColors[xpState.vipTier],
          }}
        >
          Lv.{xpState.level}
        </div>
        <div
          style={{
            flex: 1,
            height: '6px',
            background: '#334155',
            borderRadius: '3px',
            overflow: 'hidden',
            minWidth: '60px',
          }}
        >
          <div
            style={{
              width: `${progress.percent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${vipColors[xpState.vipTier]}, #14b8a6)`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #334155',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${vipColors[xpState.vipTier]}, #0f172a)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '700',
              color: '#fff',
              border: `2px solid ${vipColors[xpState.vipTier]}`,
            }}
          >
            {xpState.level}
          </div>
          <div>
            <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>Level {xpState.level}</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>{xpState.totalXP.toLocaleString()} Total XP</div>
          </div>
        </div>

        {showVIP && (
          <div
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${vipColors[xpState.vipTier]}22, transparent)`,
              border: `1px solid ${vipColors[xpState.vipTier]}44`,
            }}
          >
            <div style={{ color: vipColors[xpState.vipTier], fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
              {xpState.vipTier}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '8px' }}>
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
              width: `${progress.percent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${vipColors[xpState.vipTier]}, #14b8a6)`,
              borderRadius: '6px',
              transition: 'width 0.5s ease',
              boxShadow: `0 0 10px ${vipColors[xpState.vipTier]}66`,
            }}
          />
        </div>
      </div>

      {/* XP Text */}
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '11px' }}>
        <span>{progress.current} / {progress.needed} XP</span>
        <span>Next: Level {xpState.level + 1}</span>
      </div>

      {/* VIP Perks */}
      {showVIP && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px',
            background: '#0f172a',
            borderRadius: '8px',
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '700' }}>
              {VIP_PERKS[xpState.vipTier].dailyBonus}x
            </div>
            <div style={{ color: '#64748b', fontSize: '9px' }}>Daily Bonus</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#14b8a6', fontSize: '14px', fontWeight: '700' }}>
              {VIP_PERKS[xpState.vipTier].xpMultiplier}x
            </div>
            <div style={{ color: '#64748b', fontSize: '9px' }}>XP Multiplier</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f472b6', fontSize: '14px', fontWeight: '700' }}>
              {VIP_PERKS[xpState.vipTier].shopDiscount}%
            </div>
            <div style={{ color: '#64748b', fontSize: '9px' }}>Shop Discount</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Level up notification
export function LevelUpNotification({
  level,
  reward,
  onClose,
}: {
  level: number;
  reward?: { tokens: number; title?: string; unlock?: string };
  onClose: () => void;
}) {
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
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
          border: '2px solid #fbbf24',
          boxShadow: '0 0 60px rgba(251, 191, 36, 0.3)',
          animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2
          style={{
            color: '#fbbf24',
            fontSize: '28px',
            fontWeight: '900',
            marginBottom: '8px',
          }}
        >
          LEVEL UP!
        </h2>
        <div
          style={{
            fontSize: '64px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          {level}
        </div>

        {reward && (
          <div
            style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>REWARDS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reward.tokens > 0 && (
                <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>
                  🪙 +{reward.tokens} Tokens
                </div>
              )}
              {reward.title && (
                <div style={{ color: '#a855f7', fontSize: '16px', fontWeight: '600' }}>
                  👑 Title: &quot;{reward.title}&quot;
                </div>
              )}
              {reward.unlock && (
                <div style={{ color: '#14b8a6', fontSize: '16px', fontWeight: '600' }}>
                  🔓 Unlocked: {reward.unlock}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            padding: '12px 32px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#0f172a',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Awesome!
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
