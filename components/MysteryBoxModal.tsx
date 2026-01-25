'use client';

import { useState, useEffect } from 'react';
import { openMysteryBox, MysteryBoxReward } from '@/lib/mysteryBox';

interface MysteryBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (reward: MysteryBoxReward) => void;
}

export function MysteryBoxModal({ isOpen, onClose, onReward }: MysteryBoxModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<MysteryBoxReward | null>(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReward(null);
      setShowReward(false);
      setIsOpening(false);
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpening) return;

    setIsOpening(true);

    // Opening animation
    setTimeout(() => {
      const result = openMysteryBox();
      setReward(result.reward);

      setTimeout(() => {
        setShowReward(true);
        setIsOpening(false);
        onReward(result.reward);
      }, 500);
    }, 1500);
  };

  if (!isOpen) return null;

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '0 0 40px rgba(251, 191, 36, 0.8)';
      case 'epic': return '0 0 40px rgba(139, 92, 246, 0.8)';
      case 'rare': return '0 0 40px rgba(59, 130, 246, 0.8)';
      default: return '0 0 20px rgba(107, 114, 128, 0.5)';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#8b5cf6';
      case 'rare': return '#3b82f6';
      default: return '#6b7280';
    }
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
        zIndex: 1100,
      }}
      onClick={showReward ? onClose : undefined}
    >
      <div
        style={{
          textAlign: 'center',
          animation: 'box-appear 0.5s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!showReward ? (
          <>
            <h2 style={{ color: '#fbbf24', fontSize: '28px', marginBottom: '24px' }}>
              ✨ Mystery Box! ✨
            </h2>

            {/* Box */}
            <div
              onClick={handleOpen}
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                borderRadius: '20px',
                border: '4px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                cursor: isOpening ? 'default' : 'pointer',
                boxShadow: '0 10px 40px rgba(124, 58, 237, 0.5)',
                animation: isOpening ? 'box-shake 0.5s ease-in-out infinite' : 'box-pulse 2s ease-in-out infinite',
                transition: 'transform 0.2s ease',
              }}
            >
              {isOpening ? '✨' : '🎁'}
            </div>

            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              {isOpening ? 'Opening...' : 'Tap the box to open!'}
            </p>
          </>
        ) : (
          reward && (
            <div
              style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '24px',
                padding: '40px',
                border: `3px solid ${getRarityColor(reward.rarity)}`,
                boxShadow: getRarityGlow(reward.rarity),
                animation: 'reward-reveal 0.5s ease-out',
              }}
            >
              <div
                style={{
                  fontSize: '80px',
                  marginBottom: '16px',
                  animation: 'reward-bounce 0.5s ease-out',
                }}
              >
                {reward.icon}
              </div>

              <div
                style={{
                  color: getRarityColor(reward.rarity),
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                {reward.rarity}
              </div>

              <div style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                {reward.displayName}
              </div>

              <button
                onClick={onClose}
                style={{
                  marginTop: '24px',
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Awesome!
              </button>
            </div>
          )
        )}
      </div>

      <style>{`
        @keyframes box-appear {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes box-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes box-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes reward-reveal {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes reward-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
