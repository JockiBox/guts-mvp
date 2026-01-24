'use client';

import { Card as CardType, SUIT_SYMBOLS } from '@/lib/types';

interface CardProps {
  card: CardType | null;
  revealed: boolean;
  isFlipping?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { width: 48, height: 72, fontSize: 12, suitSize: 16, centerSuit: 20 },
  md: { width: 64, height: 96, fontSize: 14, suitSize: 18, centerSuit: 24 },
  lg: { width: 80, height: 112, fontSize: 16, suitSize: 20, centerSuit: 28 },
};

export function Card({ card, revealed, isFlipping = false, size = 'md' }: CardProps) {
  const s = sizes[size];
  const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';
  const textColor = isRed ? '#dc2626' : '#1f2937';

  const baseStyle: React.CSSProperties = {
    width: s.width,
    height: s.height,
    borderRadius: 8,
    transition: 'transform 0.3s',
    transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  if (!revealed || !card) {
    return (
      <div
        style={{
          ...baseStyle,
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          border: '2px solid #60a5fa',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 4,
      }}
    >
      <div style={{ color: textColor, fontWeight: 'bold', fontSize: s.fontSize }}>
        <div style={{ lineHeight: 1 }}>{card.rank}</div>
        <div style={{ fontSize: s.suitSize, lineHeight: 1 }}>{SUIT_SYMBOLS[card.suit]}</div>
      </div>
      <div
        style={{
          fontSize: s.centerSuit,
          alignSelf: 'center',
          color: textColor,
        }}
      >
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div
        style={{
          color: textColor,
          fontWeight: 'bold',
          fontSize: s.fontSize,
          transform: 'rotate(180deg)',
        }}
      >
        <div style={{ lineHeight: 1 }}>{card.rank}</div>
        <div style={{ fontSize: s.suitSize, lineHeight: 1 }}>{SUIT_SYMBOLS[card.suit]}</div>
      </div>
    </div>
  );
}
