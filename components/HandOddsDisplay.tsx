'use client';

import { calculateOdds, getOddsColor, getOddsEmoji, HandOdds } from '@/lib/handOdds';

interface HandOddsDisplayProps {
  card1: { rank: string; suit: string } | null;
  card2: { rank: string; suit: string } | null;
  numOpponents: number;
  compact?: boolean;
  show?: boolean;
}

export function HandOddsDisplay({ card1, card2, numOpponents, compact = false, show = true }: HandOddsDisplayProps) {
  if (!show || !card1 || !card2) return null;

  const odds = calculateOdds(card1, card2, numOpponents);
  const color = getOddsColor(odds.winProbability);
  const emoji = getOddsEmoji(odds.strength);

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '6px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <span style={{ fontSize: '14px' }}>{emoji}</span>
        <span style={{ color, fontSize: '14px', fontWeight: '700' }}>{odds.winProbability}%</span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        borderRadius: '12px',
        padding: '12px 16px',
        border: `1px solid ${color}44`,
        backdropFilter: 'blur(8px)',
        minWidth: '140px',
      }}
    >
      {/* Win Probability */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: '#64748b', fontSize: '11px' }}>Win Chance</span>
        <span style={{ fontSize: '16px' }}>{emoji}</span>
      </div>

      <div
        style={{
          fontSize: '28px',
          fontWeight: '900',
          color,
          marginBottom: '8px',
          textShadow: `0 0 20px ${color}66`,
        }}
      >
        {odds.winProbability}%
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '6px',
          background: '#334155',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            width: `${odds.winProbability}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: '3px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Description */}
      <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '6px' }}>
        {odds.description}
      </div>

      {/* Recommendation */}
      <div
        style={{
          padding: '6px 10px',
          borderRadius: '6px',
          background: odds.recommendation === 'hold' ? 'rgba(34, 197, 94, 0.2)' :
                      odds.recommendation === 'risky' ? 'rgba(251, 191, 36, 0.2)' :
                      'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${
            odds.recommendation === 'hold' ? '#22c55e44' :
            odds.recommendation === 'risky' ? '#fbbf2444' :
            '#ef444444'
          }`,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: odds.recommendation === 'hold' ? '#4ade80' :
                   odds.recommendation === 'risky' ? '#fbbf24' :
                   '#f87171',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
          }}
        >
          {odds.recommendation === 'hold' ? '👍 Hold' :
           odds.recommendation === 'risky' ? '🤔 Risky' :
           '👎 Drop'}
        </span>
      </div>
    </div>
  );
}

// Mini version for inline display
export function HandOddsMini({ card1, card2, numOpponents }: Omit<HandOddsDisplayProps, 'compact' | 'show'>) {
  if (!card1 || !card2) return null;

  const odds = calculateOdds(card1, card2, numOpponents);
  const color = getOddsColor(odds.winProbability);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        background: `${color}22`,
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
        color,
      }}
    >
      {odds.winProbability}%
    </span>
  );
}
