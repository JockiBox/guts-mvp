'use client';

import { useGutsGame } from '@/lib/useGutsGame';
import { Player } from './Player';
import { Pot } from './Pot';
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

  if (gamePhase === 'start') {
    return <StartScreen onStart={startGame} resultMessage={roundResult} />;
  }

  const aiPlayers = players.filter(p => !p.isHuman && p.isActive);
  const showCards = gamePhase === 'reveal' || gamePhase === 'summary';
  const isDecisionPhase = gamePhase === 'decision';
  const humanDecided = humanPlayer?.decision !== null;

  // Check if human has the legendary 6-9
  const hasSixNine = humanPlayer?.cards.length === 2 &&
    [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('6') &&
    [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('9');

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Header with Round */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div
          style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '4px 12px',
            border: '1px solid #334155',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Round </span>
          <span style={{ color: '#14b8a6', fontWeight: 'bold', fontSize: '14px' }}>{roundNumber}</span>
        </div>
        <div
          style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '4px 12px',
            border: '1px solid #fbbf24',
          }}
        >
          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>POT: {pot}</span>
        </div>
      </div>

      {/* Main game area - compact layout */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '8px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          minHeight: 0,
        }}
      >
        {/* Top row - AI player 1 */}
        <div style={{ gridColumn: '2', display: 'flex', justifyContent: 'center' }}>
          {aiPlayers[0] && (
            <Player
              player={aiPlayers[0]}
              isWinner={winners.includes(aiPlayers[0].id)}
              isLoser={losers.includes(aiPlayers[0].id)}
              showCards={showCards && aiPlayers[0].decision === 'hold'}
            />
          )}
        </div>

        {/* Middle row - left AI, center, right AIs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {aiPlayers[1] && (
            <Player
              player={aiPlayers[1]}
              isWinner={winners.includes(aiPlayers[1].id)}
              isLoser={losers.includes(aiPlayers[1].id)}
              showCards={showCards && aiPlayers[1].decision === 'hold'}
            />
          )}
        </div>

        {/* Center area - countdown, messages, pot, ghosts */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {/* Big dramatic countdown */}
          {isDecisionPhase && countdown !== null && countdown > 0 && (
            <div
              style={{
                fontSize: '120px',
                fontWeight: 900,
                color: countdown === 1 ? '#ef4444' : countdown === 2 ? '#fbbf24' : '#14b8a6',
                textShadow: `0 0 60px ${countdown === 1 ? 'rgba(239,68,68,0.9)' : countdown === 2 ? 'rgba(251,191,36,0.9)' : 'rgba(20,184,166,0.9)'}`,
                animation: 'pulse 0.5s ease-in-out infinite',
                lineHeight: 1,
              }}
            >
              {countdown}
            </div>
          )}

          {/* Reveal indicator */}
          {gamePhase === 'reveal' && (
            <div
              style={{
                color: '#14b8a6',
                fontWeight: 'bold',
                fontSize: '24px',
                textShadow: '0 0 20px rgba(20,184,166,0.8)',
              }}
            >
              REVEALING...
            </div>
          )}

          {/* Result message */}
          {gamePhase === 'summary' && roundResult && (
            <div
              style={{
                background: 'rgba(30,41,59,0.9)',
                borderRadius: '12px',
                padding: '12px 20px',
                border: '2px solid #fbbf24',
                textAlign: 'center',
                maxWidth: '350px',
                boxShadow: '0 0 20px rgba(251,191,36,0.3)',
              }}
            >
              <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                {roundResult}
              </p>
            </div>
          )}

          {/* Ghost hands */}
          {ghostHands.length > 0 && (
            <Pot amount={pot} ghostHands={ghostHands} winners={winners} showGhostCards={showCards} />
          )}
        </div>

        {/* Right AIs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {aiPlayers[2] && (
            <Player
              player={aiPlayers[2]}
              isWinner={winners.includes(aiPlayers[2].id)}
              isLoser={losers.includes(aiPlayers[2].id)}
              showCards={showCards && aiPlayers[2].decision === 'hold'}
            />
          )}
          {aiPlayers[3] && (
            <Player
              player={aiPlayers[3]}
              isWinner={winners.includes(aiPlayers[3].id)}
              isLoser={losers.includes(aiPlayers[3].id)}
              showCards={showCards && aiPlayers[3].decision === 'hold'}
            />
          )}
        </div>

        {/* Bottom row - Human player */}
        <div style={{ gridColumn: '1 / -1' }}>
          {humanPlayer && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  background: hasSixNine ? 'linear-gradient(135deg, #1e293b, #4a1d6a)' : '#1e293b',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  border: `3px solid ${
                    winners.includes(humanPlayer.id)
                      ? '#fbbf24'
                      : losers.includes(humanPlayer.id)
                        ? '#ef4444'
                        : hasSixNine
                          ? '#f472b6'
                          : '#334155'
                  }`,
                  boxShadow: winners.includes(humanPlayer.id)
                    ? '0 0 30px rgba(251,191,36,0.5)'
                    : losers.includes(humanPlayer.id)
                      ? '0 0 30px rgba(239,68,68,0.5)'
                      : hasSixNine
                        ? '0 0 30px rgba(244,114,182,0.5)'
                        : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {/* Player info */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '16px' }}>
                      {humanPlayer.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                          border: '2px solid #b45309',
                        }}
                      />
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fbbf24', fontSize: '16px' }}>
                        {humanPlayer.tokens}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {humanPlayer.cards.map((card, idx) => (
                      <Card key={idx} card={card} revealed={true} size="lg" />
                    ))}
                  </div>

                  {/* Hand description */}
                  {humanPlayer.cards.length === 2 && (
                    <div
                      style={{
                        color: hasSixNine ? '#f472b6' : '#5eead4',
                        fontWeight: hasSixNine ? 'bold' : 500,
                        fontSize: hasSixNine ? '18px' : '14px',
                        textShadow: hasSixNine ? '0 0 10px rgba(244,114,182,0.8)' : 'none',
                      }}
                    >
                      {getHandDescription(humanPlayer.cards)}
                    </div>
                  )}

                  {/* Decision badge */}
                  {humanPlayer.decision && (
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        background:
                          humanPlayer.decision === 'hold'
                            ? 'rgba(34,197,94,0.3)'
                            : 'rgba(239,68,68,0.3)',
                        color: humanPlayer.decision === 'hold' ? '#4ade80' : '#f87171',
                        border: `2px solid ${humanPlayer.decision === 'hold' ? '#22c55e' : '#ef4444'}`,
                      }}
                    >
                      {humanPlayer.decision.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons - BIG and prominent */}
              {isDecisionPhase && !humanDecided && (
                <div style={{ display: 'flex', gap: '24px' }}>
                  <button
                    onClick={() => makeHumanDecision('hold')}
                    style={{
                      padding: '20px 48px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #22c55e, #15803d)',
                      border: '3px solid #4ade80',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 0 30px rgba(34,197,94,0.5)',
                      transition: 'transform 0.1s, box-shadow 0.1s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 50px rgba(34,197,94,0.8)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(34,197,94,0.5)';
                    }}
                  >
                    HOLD
                  </button>
                  <button
                    onClick={() => makeHumanDecision('drop')}
                    style={{
                      padding: '20px 48px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                      border: '3px solid #f87171',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 0 30px rgba(239,68,68,0.5)',
                      transition: 'transform 0.1s, box-shadow 0.1s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 50px rgba(239,68,68,0.8)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(239,68,68,0.5)';
                    }}
                  >
                    DROP
                  </button>
                </div>
              )}

              {isDecisionPhase && humanDecided && (
                <div style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>
                  Waiting for countdown...
                </div>
              )}

              {gamePhase === 'summary' && (
                <button
                  onClick={nextRound}
                  style={{
                    padding: '16px 40px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                    border: '2px solid #2dd4bf',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(20,184,166,0.4)',
                  }}
                >
                  NEXT ROUND
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSS for pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
