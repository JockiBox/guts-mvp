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
    <div className={`ghost-hand p-3 animate-ghost ${isWinner ? 'ring-2 ring-amber-400' : ''}`}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-purple-400 font-bold text-sm">Ghost #{index + 1}</span>

        <div className="flex gap-1">
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
          <div className="text-xs text-purple-300">{getHandDescription(ghost.cards)}</div>
        )}
      </div>
    </div>
  );
}
