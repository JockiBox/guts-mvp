'use client';

import { Player as PlayerType } from '@/lib/types';
import { Card } from './Card';
import { getHandDescription } from '@/lib/useGutsGame';

interface PlayerProps {
  player: PlayerType;
  isWinner: boolean;
  isLoser: boolean;
  showCards: boolean;
  isHearted?: boolean;
  onHeart?: (profileId: string) => void;
}

export function Player({ player, isWinner, isLoser, showCards, isHearted, onHeart }: PlayerProps) {
  const borderColor = isWinner ? '#fbbf24' : isLoser ? '#ef4444' : '#334155';
  const shadowColor = isWinner
    ? '0 0 15px rgba(251,191,36,0.4)'
    : isLoser
      ? '0 0 15px rgba(239,68,68,0.4)'
      : 'none';

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (player.profileId && onHeart) {
      onHeart(player.profileId);
    }
  };

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '10px',
        border: `2px solid ${borderColor}`,
        boxShadow: shadowColor,
        opacity: player.isActive ? 1 : 0.4,
        filter: player.isActive ? 'none' : 'grayscale(0.8)',
        position: 'relative',
        minWidth: '100px',
      }}
    >
      {/* Speech Bubble - Trash Talk */}
      {player.currentThought && player.isActive && (
        <div
          style={{
            position: 'absolute',
            top: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(51, 65, 85, 0.98))',
            border: '2px solid #14b8a6',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#5eead4',
            whiteSpace: 'nowrap',
            maxWidth: '160px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 50,
            animation: 'thought-appear 0.4s ease-out, thought-pulse 2s ease-in-out infinite',
            boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)',
          }}
        >
          💬 {player.currentThought}
          {/* Bubble pointer */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #14b8a6',
            }}
          />
        </div>
      )}

      {/* Heart Button */}
      {player.profileId && onHeart && (
        <button
          onClick={handleHeartClick}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: 'none',
            background: isHearted ? '#ec4899' : '#374151',
            color: isHearted ? 'white' : '#6b7280',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 20,
            boxShadow: isHearted ? '0 0 10px rgba(236, 72, 153, 0.5)' : 'none',
          }}
        >
          {isHearted ? '❤️' : '🤍'}
        </button>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {player.avatar && (
            <span style={{ fontSize: '16px' }}>{player.avatar}</span>
          )}
          <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '13px' }}>
            {player.name}
          </span>
        </div>

        {/* Token Count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            animation: isWinner ? 'token-win-bounce 0.5s ease-out' : isLoser ? 'token-lose-shake 0.4s ease-out' : 'none',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              border: '1px solid #b45309',
              boxShadow: isWinner ? '0 0 12px rgba(251, 191, 36, 0.8)' : 'none',
              animation: isWinner ? 'token-glow-pulse 0.6s ease-in-out 3' : 'none',
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: isWinner ? '#4ade80' : isLoser ? '#f87171' : '#fbbf24',
              fontSize: '13px',
              textShadow: isWinner ? '0 0 8px rgba(74, 222, 128, 0.5)' : 'none',
              transition: 'color 0.3s ease',
            }}
          >
            {player.tokens}
          </span>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '3px' }}>
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
          <div style={{ fontSize: '10px', color: '#5eead4', fontWeight: 500 }}>
            {getHandDescription(player.cards)}
          </div>
        )}

        {/* Decision Indicator */}
        {player.decision && (
          <div
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '10px',
              background: player.decision === 'hold' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
              color: player.decision === 'hold' ? '#4ade80' : '#f87171',
              border: `1px solid ${player.decision === 'hold' ? '#22c55e' : '#ef4444'}`,
            }}
          >
            {player.decision.toUpperCase()}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes thought-appear {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes thought-pulse {
          0%, 100% { box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(20, 184, 166, 0.5); }
        }
        @keyframes token-win-bounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3) translateY(-4px); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.2) translateY(-2px); }
        }
        @keyframes token-lose-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        @keyframes token-glow-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(251, 191, 36, 0.6); }
          50% { box-shadow: 0 0 16px rgba(251, 191, 36, 1); }
        }
      `}</style>
    </div>
  );
}
