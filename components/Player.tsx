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
      {/* Speech Bubble - Compact Trash Talk */}
      {player.currentThought && player.isActive && (
        <div
          style={{
            position: 'absolute',
            top: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: player.personality === 'aggressive'
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9))'
              : player.personality === 'conservative'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))'
                : player.personality === 'tricky'
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(126, 34, 206, 0.9))'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))',
            border: 'none',
            borderRadius: '10px',
            padding: '3px 8px',
            fontSize: '9px',
            fontWeight: '700',
            color: 'white',
            whiteSpace: 'nowrap',
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 50,
            animation: 'thought-pop 0.3s ease-out',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {player.currentThought}
          {/* Bubble pointer */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: player.personality === 'aggressive'
                ? '5px solid rgba(185, 28, 28, 0.9)'
                : player.personality === 'conservative'
                  ? '5px solid rgba(37, 99, 235, 0.9)'
                  : player.personality === 'tricky'
                    ? '5px solid rgba(126, 34, 206, 0.9)'
                    : '5px solid rgba(22, 163, 74, 0.9)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {player.avatar && (
            <span style={{ fontSize: '16px' }}>{player.avatar}</span>
          )}
          {/* Level Badge */}
          {player.levelBadge && (
            <span
              style={{
                fontSize: '12px',
                filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.5))',
              }}
              title={`Level ${player.experienceLevel} - ${(player.heartsReceived || 0)} hearts`}
            >
              {player.levelBadge}
            </span>
          )}
          <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '13px' }}>
            {player.name}
          </span>
          {/* Hearts count for popular bots */}
          {(player.heartsReceived || 0) > 0 && (
            <span
              style={{
                fontSize: '9px',
                color: '#f472b6',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
              title={`${player.heartsReceived} total hearts`}
            >
              <span style={{ fontSize: '8px' }}>❤️</span>
              {player.heartsReceived}
            </span>
          )}
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
        @keyframes thought-pop {
          0% { opacity: 0; transform: translateX(-50%) scale(0.5); }
          70% { transform: translateX(-50%) scale(1.1); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
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
