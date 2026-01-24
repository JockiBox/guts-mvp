'use client';

import { GhostHand as GhostHandType } from '@/lib/types';
import { Card } from './Card';
import { getHandDescription } from '@/lib/useGutsGame';

interface GhostHandProps {
  ghost: GhostHandType;
  index: number;
  isWinner: boolean;
  showCards: boolean;
}

export function GhostHand({ ghost, index, isWinner, showCards }: GhostHandProps) {
  return (
    <div
      style={{
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: 12,
        padding: 12,
        border: isWinner ? '2px solid #fbbf24' : '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: isWinner ? '0 0 15px rgba(251, 191, 36, 0.4)' : '0 0 15px rgba(139, 92, 246, 0.2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ color: '#c084fc', fontWeight: 'bold', fontSize: 12 }}>
          Ghost #{index + 1}
        </span>

        <div style={{ display: 'flex', gap: 4 }}>
          {ghost.cards.map((card, idx) => (
            <Card
              key={idx}
              card={card}
              revealed={showCards && ghost.cardsRevealed > idx}
              isFlipping={ghost.cardsRevealed === idx + 1}
              size="sm"
            />
          ))}
        </div>

        {showCards && ghost.cardsRevealed === 2 && (
          <div style={{ fontSize: 11, color: '#d8b4fe' }}>{getHandDescription(ghost.cards)}</div>
        )}
      </div>
    </div>
  );
}
