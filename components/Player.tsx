'use client';

import { Player as PlayerType } from '@/lib/types';
import { Card } from './Card';
import { getHandDescription } from '@/lib/useGutsGame';

interface PlayerProps {
  player: PlayerType;
  isWinner: boolean;
  isLoser: boolean;
  showCards: boolean;
}

export function Player({ player, isWinner, isLoser, showCards }: PlayerProps) {
  const borderColor = isWinner ? '#fbbf24' : isLoser ? '#ef4444' : '#334155';
  const shadowColor = isWinner
    ? '0 0 15px rgba(251,191,36,0.4)'
    : isLoser
      ? '0 0 15px rgba(239,68,68,0.4)'
      : 'none';

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '12px',
        border: `2px solid ${borderColor}`,
        boxShadow: shadowColor,
        opacity: player.isActive ? 1 : 0.4,
        filter: player.isActive ? 'none' : 'grayscale(0.8)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Player Name & Personality */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '14px' }}>
            {player.name}
          </span>
          {player.personality && (
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
              ({player.personality})
            </span>
          )}
        </div>

        {/* Token Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              border: '1px solid #b45309',
            }}
          />
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fbbf24', fontSize: '14px' }}>
            {player.tokens}
          </span>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {player.cards.map((card, idx) => (
            <Card
              key={idx}
              card={card}
              revealed={showCards && player.cardsRevealed > idx}
              isFlipping={player.cardsRevealed === idx + 1}
              size="sm"
            />
          ))}
        </div>

        {/* Hand Description */}
        {showCards && player.cardsRevealed === 2 && (
          <div style={{ fontSize: '11px', color: '#5eead4', fontWeight: 500 }}>
            {getHandDescription(player.cards)}
          </div>
        )}

        {/* Decision Indicator */}
        {player.decision && (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '12px',
              background: player.decision === 'hold' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
              color: player.decision === 'hold' ? '#4ade80' : '#f87171',
              border: `1px solid ${player.decision === 'hold' ? '#22c55e' : '#ef4444'}`,
            }}
          >
            {player.decision.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
