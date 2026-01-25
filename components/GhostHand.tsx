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
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.5), rgba(139, 92, 246, 0.3))',
        borderRadius: 6,
        padding: '4px 6px',
        border: isWinner
          ? '2px solid #fbbf24'
          : '1px solid rgba(168, 85, 247, 0.5)',
        boxShadow: isWinner
          ? '0 0 12px rgba(251, 191, 36, 0.4)'
          : '0 0 8px rgba(168, 85, 247, 0.3)',
        animation: isNew
          ? 'ghost-entrance 0.5s ease-out'
          : undefined,
        transform: 'scale(0.65)',
        transformOrigin: 'center center',
        margin: '-8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Ghost icon and label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span style={{ fontSize: 12 }}>👻</span>
          <span
            style={{
              color: '#e9d5ff',
              fontWeight: 'bold',
              fontSize: 9,
            }}
          >
            #{index + 1}
          </span>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 2 }}>
          {ghost.cards.map((card, idx) => (
            <Card
              key={idx}
              card={card}
              revealed={showCards && ghost.cardsRevealed > idx}
              isFlipping={ghost.cardsRevealed === idx + 1}
              size="xs"
            />
          ))}
        </div>

        {/* Hand description - only show when revealed */}
        {showCards && ghost.cardsRevealed === 2 && (
          <div
            style={{
              fontSize: 8,
              fontWeight: 'bold',
              color: isWinner ? '#fbbf24' : '#c4b5fd',
              whiteSpace: 'nowrap',
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
            transform: scale(0.3);
          }
          100% {
            opacity: 1;
            transform: scale(0.65);
          }
        }
      `}</style>
    </div>
  );
}
