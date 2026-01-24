'use client';

import { Player as PlayerType } from '@/lib/types';
import { Card } from './Card';
import { getHandDescription } from '@/lib/useGutsGame';

interface PlayerProps {
  player: PlayerType;
  isWinner: boolean;
  isLoser: boolean;
  showCards: boolean;
  position: 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
}

export function Player({ player, isWinner, isLoser, showCards, position }: PlayerProps) {
  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-32 left-8',
    'bottom-right': 'bottom-32 right-8',
  };

  const statusClass = isWinner ? 'winner' : isLoser ? 'loser' : '';
  const inactiveClass = !player.isActive ? 'inactive' : '';

  const cardSize = player.isHuman ? 'lg' : 'md';

  return (
    <div
      className={`player-seat neu-card p-4 absolute ${positionClasses[position]} ${statusClass} ${inactiveClass}`}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Player Name & Tokens */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-teal-400">{player.name}</span>
          {player.personality && (
            <span className="text-xs text-slate-500 capitalize">({player.personality})</span>
          )}
        </div>

        {/* Token Count */}
        <div className="flex items-center gap-1">
          <div className="token w-5 h-5" />
          <span className="font-mono font-bold text-amber-400">{player.tokens}</span>
        </div>

        {/* Cards */}
        <div className="flex gap-2 mt-1">
          {player.cards.map((card, idx) => (
            <Card
              key={idx}
              card={card}
              revealed={showCards && player.cardsRevealed > idx}
              isFlipping={player.cardsRevealed === idx + 1}
              size={cardSize}
            />
          ))}
        </div>

        {/* Hand Description */}
        {showCards && player.cardsRevealed === 2 && (
          <div className="text-sm text-teal-300 font-medium mt-1">
            {getHandDescription(player.cards)}
          </div>
        )}

        {/* Decision Indicator */}
        {player.decision && (
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              player.decision === 'hold'
                ? 'bg-green-600/30 text-green-400 border border-green-500'
                : 'bg-red-600/30 text-red-400 border border-red-500'
            }`}
          >
            {player.decision.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
