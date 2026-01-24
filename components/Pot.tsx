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
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
      {/* Pot Display */}
      <div className="pot-area w-40 h-40 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="token" />
          <div className="token -ml-3" />
          <div className="token -ml-3" />
        </div>
        <div className="mt-2 text-3xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
          {amount}
        </div>
        <div className="text-sm text-slate-400">POT</div>
      </div>

      {/* Ghost Hands */}
      {ghostHands.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center max-w-md">
          {ghostHands.map((ghost, idx) => (
            <GhostHand
              key={ghost.id}
              ghost={ghost}
              index={idx}
              isWinner={winners.includes(ghost.id)}
              showCards={showGhostCards}
            />
          ))}
        </div>
      )}
    </div>
  );
}
