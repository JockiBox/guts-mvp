'use client';

import { useGutsGame } from '@/lib/useGutsGame';
import { Player } from './Player';
import { Pot } from './Pot';
import { Countdown } from './Countdown';
import { Card } from './Card';
import { StartScreen } from './StartScreen';
import { getHandDescription } from '@/lib/useGutsGame';

export function GameBoard() {
  const { state, humanPlayer, startGame, makeHumanDecision, nextRound } = useGutsGame();
  const {
    players,
    pot,
    gamePhase,
    countdown,
    ghostHands,
    roundResult,
    winners,
    losers,
    roundNumber,
  } = state;

  // Show start screen
  if (gamePhase === 'start') {
    return <StartScreen onStart={startGame} resultMessage={roundResult} />;
  }

  const aiPlayers = players.filter(p => !p.isHuman && p.isActive);
  const positions: Array<'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right'> = [
    'top',
    'left',
    'right',
    'bottom-left',
  ];

  const showCards = gamePhase === 'reveal' || gamePhase === 'summary';
  const isDecisionPhase = gamePhase === 'decision';
  const humanDecided = humanPlayer?.decision !== null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />

      {/* Game table area */}
      <div className="relative w-full h-[calc(100vh-2rem)] max-w-6xl mx-auto">
        {/* Round indicator */}
        <div className="absolute top-4 right-4 neu-card px-4 py-2">
          <span className="text-slate-400">Round</span>
          <span className="ml-2 font-bold text-teal-400">{roundNumber}</span>
        </div>

        {/* AI Players */}
        {aiPlayers.slice(0, 4).map((player, idx) => (
          <Player
            key={player.id}
            player={player}
            position={positions[idx]}
            isWinner={winners.includes(player.id)}
            isLoser={losers.includes(player.id)}
            showCards={showCards && player.decision === 'hold'}
          />
        ))}

        {/* Center Pot Area */}
        <Pot amount={pot} ghostHands={ghostHands} winners={winners} showGhostCards={showCards} />

        {/* Human Player Area - Bottom Center */}
        {humanPlayer && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            {/* Human's cards */}
            <div
              className={`neu-card p-4 ${
                winners.includes(humanPlayer.id)
                  ? 'winner'
                  : losers.includes(humanPlayer.id)
                    ? 'loser animate-loser'
                    : ''
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-teal-400 text-lg">{humanPlayer.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="token w-5 h-5" />
                    <span className="font-mono font-bold text-amber-400">{humanPlayer.tokens}</span>
                  </div>
                </div>

                {/* Cards - Always visible for human */}
                <div className="flex gap-3">
                  {humanPlayer.cards.map((card, idx) => (
                    <Card key={idx} card={card} revealed={true} size="lg" />
                  ))}
                </div>

                {/* Hand description */}
                {humanPlayer.cards.length === 2 && (
                  <div className="text-teal-300 font-medium">
                    {getHandDescription(humanPlayer.cards)}
                  </div>
                )}

                {/* Decision indicator */}
                {humanPlayer.decision && (
                  <div
                    className={`text-sm font-bold px-4 py-1 rounded-full ${
                      humanPlayer.decision === 'hold'
                        ? 'bg-green-600/30 text-green-400 border border-green-500'
                        : 'bg-red-600/30 text-red-400 border border-red-500'
                    }`}
                  >
                    You chose to {humanPlayer.decision.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isDecisionPhase && !humanDecided && (
              <div className="flex gap-4">
                <button
                  className="btn-hold text-lg flex items-center gap-2"
                  onClick={() => makeHumanDecision('hold')}
                >
                  <span>HOLD</span>
                </button>
                <button
                  className="btn-drop text-lg flex items-center gap-2"
                  onClick={() => makeHumanDecision('drop')}
                >
                  <span>DROP</span>
                </button>
              </div>
            )}

            {isDecisionPhase && humanDecided && (
              <div className="text-slate-400 text-sm">Waiting for countdown...</div>
            )}

            {/* Next Round Button */}
            {gamePhase === 'summary' && (
              <button className="neu-button px-6 py-3 text-white font-bold" onClick={nextRound}>
                NEXT ROUND
              </button>
            )}
          </div>
        )}

        {/* Countdown Overlay */}
        {isDecisionPhase && countdown !== null && countdown > 0 && <Countdown value={countdown} />}

        {/* Phase indicator */}
        {gamePhase === 'reveal' && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-teal-400 font-bold text-lg">
            Revealing cards...
          </div>
        )}

        {/* Round Result */}
        {gamePhase === 'summary' && roundResult && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 neu-card p-4 max-w-md text-center">
            <p className="text-lg font-bold text-amber-400">{roundResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
