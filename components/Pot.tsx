'use client';

import { GhostHand as GhostHandType } from '@/lib/types';
import { GhostHand } from './GhostHand';

interface PotProps {
  amount: number;
  ghostHands: GhostHandType[];
  winners: string[];
  showGhostCards: boolean;
}

export function Pot({ amount, ghostHands, winners, showGhostCards }: PotProps) {
  const tokenStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
    border: '2px solid #b45309',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Pot Display */}
      <div
        style={{
          width: 160,
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={tokenStyle} />
          <div style={{ ...tokenStyle, marginLeft: -12 }} />
          <div style={{ ...tokenStyle, marginLeft: -12 }} />
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 32,
            fontWeight: 900,
            color: '#fbbf24',
            textShadow: '0 0 10px rgba(251,191,36,0.5)',
          }}
        >
          {amount}
        </div>
        <div style={{ fontSize: 14, color: '#94a3b8' }}>POT</div>
      </div>

      {/* Ghost Hands */}
      {ghostHands.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: ghostHands.length > 3 ? 4 : 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: ghostHands.length > 4 ? 500 : 400,
          }}
        >
          {ghostHands.map((ghost, idx) => (
            <GhostHand
              key={ghost.id}
              ghost={ghost}
              index={idx}
              isWinner={winners.includes(ghost.id)}
              showCards={showGhostCards}
              compact={ghostHands.length > 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
