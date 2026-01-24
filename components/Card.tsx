'use client';

import { Card as CardType, SUIT_SYMBOLS } from '@/lib/types';

interface CardProps {
  card: CardType | null;
  revealed: boolean;
  isFlipping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isWinner?: boolean;
  isSixNine?: boolean;
}

const sizes = {
  sm: { width: 52, height: 76, fontSize: 14, suitSize: 18, centerSuit: 22 },
  md: { width: 70, height: 100, fontSize: 18, suitSize: 22, centerSuit: 28 },
  lg: { width: 90, height: 126, fontSize: 22, suitSize: 26, centerSuit: 36 },
};

export function Card({ card, revealed, isFlipping = false, size = 'md', isWinner = false, isSixNine = false }: CardProps) {
  const s = sizes[size];
  const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';
  const textColor = isRed ? '#dc2626' : '#111827';

  // Check if this card is part of a six-nine
  const isSix = card?.rank === '6';
  const isNine = card?.rank === '9';
  const specialGlow = isSixNine && (isSix || isNine);

  return (
    <div
      style={{
        width: s.width,
        height: s.height,
        perspective: '1000px',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Card Back */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%)',
            border: '3px solid #60a5fa',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Card back pattern */}
          <div
            style={{
              width: '80%',
              height: '85%',
              borderRadius: 4,
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 10px)',
            }}
          />
        </div>

        {/* Card Front */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 8,
            background: specialGlow
              ? 'linear-gradient(135deg, #fdf4ff, #fae8ff, #fdf4ff)'
              : 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: specialGlow
              ? '3px solid #e879f9'
              : isWinner
                ? '3px solid #fbbf24'
                : '2px solid #d1d5db',
            boxShadow: specialGlow
              ? '0 0 20px rgba(232, 121, 249, 0.6), 0 4px 12px rgba(0, 0, 0, 0.2)'
              : isWinner
                ? '0 0 20px rgba(251, 191, 36, 0.6), 0 4px 12px rgba(0, 0, 0, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 6,
            overflow: 'hidden',
          }}
        >
          {/* Top left rank & suit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span
              style={{
                color: textColor,
                fontWeight: 900,
                fontSize: s.fontSize,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}
            >
              {card?.rank}
            </span>
            <span
              style={{
                color: textColor,
                fontSize: s.suitSize,
                lineHeight: 1,
              }}
            >
              {card ? SUIT_SYMBOLS[card.suit] : ''}
            </span>
          </div>

          {/* Center suit - large */}
          <div
            style={{
              fontSize: s.centerSuit,
              color: textColor,
              textAlign: 'center',
              filter: specialGlow ? 'drop-shadow(0 0 8px rgba(232, 121, 249, 0.8))' : 'none',
            }}
          >
            {card ? SUIT_SYMBOLS[card.suit] : ''}
          </div>

          {/* Bottom right rank & suit (upside down) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              transform: 'rotate(180deg)',
            }}
          >
            <span
              style={{
                color: textColor,
                fontWeight: 900,
                fontSize: s.fontSize,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}
            >
              {card?.rank}
            </span>
            <span
              style={{
                color: textColor,
                fontSize: s.suitSize,
                lineHeight: 1,
              }}
            >
              {card ? SUIT_SYMBOLS[card.suit] : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
