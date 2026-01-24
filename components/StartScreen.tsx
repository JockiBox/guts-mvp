'use client';

interface StartScreenProps {
  onStart: () => void;
  resultMessage?: string;
}

export function StartScreen({ onStart, resultMessage }: StartScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="neu-card p-8 max-w-lg w-full text-center">
        {/* Title */}
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-2">
          GUTS
        </h1>
        <p className="text-slate-400 mb-6">High-Stakes 2-Card Poker Showdown</p>

        {resultMessage && (
          <div className="neu-card-inset p-4 mb-6 text-amber-400 font-bold">{resultMessage}</div>
        )}

        {/* Rules */}
        <div className="neu-card-inset p-4 mb-6 text-left">
          <h2 className="font-bold text-teal-400 mb-3">How to Play</h2>
          <ol className="text-sm text-slate-300 space-y-2">
            <li>
              <span className="text-teal-400 font-bold">1.</span> Each player antes 1 token and
              receives 2 cards
            </li>
            <li>
              <span className="text-teal-400 font-bold">2.</span> During the 3-second countdown,
              choose to <span className="text-green-400">HOLD</span> or{' '}
              <span className="text-red-400">DROP</span>
            </li>
            <li>
              <span className="text-teal-400 font-bold">3.</span> If you{' '}
              <span className="text-green-400">HOLD</span>, you compete for the pot
            </li>
            <li>
              <span className="text-teal-400 font-bold">4.</span> Winner takes the pot, losers{' '}
              <span className="text-amber-400">match the pot</span>
            </li>
            <li>
              <span className="text-teal-400 font-bold">5.</span> If everyone drops, a{' '}
              <span className="text-purple-400">Ghost Hand</span> joins!
            </li>
          </ol>
        </div>

        {/* Hand Rankings */}
        <div className="neu-card-inset p-4 mb-6 text-left">
          <h2 className="font-bold text-teal-400 mb-3">Hand Rankings</h2>
          <div className="text-sm text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-amber-400">1. Pair</span>
              <span className="text-slate-500">Two of same rank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400">2. Flush</span>
              <span className="text-slate-500">Two of same suit</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400">3. High Card</span>
              <span className="text-slate-500">Highest card wins</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="neu-button px-8 py-4 text-xl font-bold text-white w-full"
        >
          {resultMessage ? 'PLAY AGAIN' : 'START GAME'}
        </button>
      </div>
    </div>
  );
}
