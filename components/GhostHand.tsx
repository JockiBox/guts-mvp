'use client';

import { GhostHand as GhostHandType } from '@/lib/types';
import { Card } from './Card';
import { getHandDescription } from '@/lib/useGutsGame';

interface GhostHandProps {
  ghost: GhostHandType;
  index: number;
  isWinner: boolean;
  showCards: boolean;
  isNew?: boolean;
  compact?: boolean;
}

export function GhostHand({ ghost, index, isWinner, showCards, isNew, compact }: GhostHandProps) {
  // Always use compact sizing to fit more ghosts
  const useCompact = true;

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.4), rgba(139, 92, 246, 0.2), rgba(88, 28, 135, 0.4))',
        borderRadius: 10,
        padding: compact ? 6 : 8,
        border: isWinner
          ? '2px solid #fbbf24'
          : '1px solid rgba(168, 85, 247, 0.6)',
        boxShadow: isWinner
          ? '0 0 20px rgba(251, 191, 36, 0.5), inset 0 0 10px rgba(251, 191, 36, 0.1)'
          : '0 0 15px rgba(168, 85, 247, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.1)',
        animation: isNew
          ? 'ghost-entrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'ghost-hover 3s ease-in-out infinite',
        transform: compact ? 'scale(0.75)' : 'scale(0.85)',
        transformOrigin: 'center center',
      }}
    >
      {/* Eerie glow effect */}
      <div
        style={{
          position: 'absolute',
          inset: -4,
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3), transparent 70%)',
          borderRadius: 20,
          animation: 'ghost-pulse 2s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 16, pointerEvents: 'none' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              background: 'rgba(216, 180, 254, 0.8)',
              borderRadius: '50%',
              left: `${20 + i * 15}%`,
              bottom: 0,
              animation: `ghost-particle ${2 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
              boxShadow: '0 0 6px rgba(216, 180, 254, 0.8)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 1,
        }}
      >
        {/* Ghost icon and label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 14,
              animation: 'ghost-wobble 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))',
            }}
          >
            👻
          </span>
          <span
            style={{
              color: '#e9d5ff',
              fontWeight: 'bold',
              fontSize: 10,
              textShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
              letterSpacing: '0.5px',
            }}
          >
            #{index + 1}
          </span>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 3 }}>
          {ghost.cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                filter: showCards && ghost.cardsRevealed > idx
                  ? 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.6))'
                  : 'none',
              }}
            >
              <Card
                card={card}
                revealed={showCards && ghost.cardsRevealed > idx}
                isFlipping={ghost.cardsRevealed === idx + 1}
                size="sm"
              />
            </div>
          ))}
        </div>

        {/* Hand description */}
        {showCards && ghost.cardsRevealed === 2 && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: isWinner ? '#fbbf24' : '#e9d5ff',
              textShadow: isWinner
                ? '0 0 15px rgba(251, 191, 36, 0.8)'
                : '0 0 10px rgba(168, 85, 247, 0.6)',
              animation: isWinner ? 'ghost-win-text 0.5s ease-out' : 'none',
            }}
          >
            {getHandDescription(ghost.cards)}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ghost-entrance {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
            filter: blur(10px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(-10px);
            filter: blur(0);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
        @keyframes ghost-hover {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes ghost-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        @keyframes ghost-wobble {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        @keyframes ghost-particle {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes ghost-win-text {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
