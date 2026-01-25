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
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
    border: '2px solid #b45309',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  // Calculate pot area size based on ghost count
  const hasGhosts = ghostHands.length > 0;
  const potSize = hasGhosts ? 120 : 140;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        position: 'relative',
        zIndex: 5, // Keep pot behind player cards
      }}
    >
      {/* Pot Display */}
      <div
        style={{
          width: potSize,
          height: potSize,
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
          <div style={{ ...tokenStyle, marginLeft: -10 }} />
          <div style={{ ...tokenStyle, marginLeft: -10 }} />
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: hasGhosts ? 24 : 28,
            fontWeight: 900,
            color: '#fbbf24',
            textShadow: '0 0 10px rgba(251,191,36,0.5)',
          }}
        >
          {amount}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>POT</div>
      </div>

      {/* Ghost Hands - Compact row below pot */}
      {ghostHands.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 280,
            marginTop: -8,
          }}
        >
          {ghostHands.map((ghost, idx) => (
            <GhostHand
              key={ghost.id}
              ghost={ghost}
              index={idx}
              isWinner={winners.includes(ghost.id)}
              showCards={showGhostCards}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
