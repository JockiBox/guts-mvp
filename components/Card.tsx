'use client';

import { Card as CardType, SUIT_SYMBOLS } from '@/lib/types';

interface CardProps {
  card: CardType | null;
  revealed: boolean;
  isFlipping?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ card, revealed, isFlipping = false, size = 'md' }: CardProps) {
  const sizeClasses = {
    sm: 'w-12 h-18 text-sm',
    md: 'w-16 h-24 text-base',
    lg: 'w-20 h-28 text-lg',
  };

  const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';

  if (!revealed || !card) {
    return (
      <div
        className={`playing-card card-back ${sizeClasses[size]} ${isFlipping ? 'animate-flip' : ''}`}
      />
    );
  }

  return (
    <div
      className={`playing-card ${sizeClasses[size]} ${isFlipping ? 'animate-flip' : ''} flex flex-col justify-between p-1.5`}
    >
      <div className={`font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        <div className="leading-none">{card.rank}</div>
        <div className="text-lg leading-none">{SUIT_SYMBOLS[card.suit]}</div>
      </div>
      <div className={`text-2xl self-center ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={`font-bold rotate-180 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        <div className="leading-none">{card.rank}</div>
        <div className="text-lg leading-none">{SUIT_SYMBOLS[card.suit]}</div>
      </div>
    </div>
  );
}
