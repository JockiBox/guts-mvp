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

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Round */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <div
          style={{
            background: '#1e293b',
            borderRadius: '12px',
            padding: '8px 16px',
            border: '1px solid #334155',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Round </span>
          <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>{roundNumber}</span>
        </div>
      </div>

      {/* Main game area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Top AI player */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          {aiPlayers[0] && (
            <Player
              player={aiPlayers[0]}
              isWinner={winners.includes(aiPlayers[0].id)}
              isLoser={losers.includes(aiPlayers[0].id)}
              showCards={showCards && aiPlayers[0].decision === 'hold'}
            />
          )}
        </div>

        {/* Middle section: Left AI - Center - Right AIs */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Left AI */}
          <div>
            {aiPlayers[1] && (
              <Player
                player={aiPlayers[1]}
                isWinner={winners.includes(aiPlayers[1].id)}
                isLoser={losers.includes(aiPlayers[1].id)}
                showCards={showCards && aiPlayers[1].decision === 'hold'}
              />
            )}
          </div>

          {/* Center: Countdown, Messages, Pot */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {/* Countdown */}
            {isDecisionPhase && countdown !== null && countdown > 0 && (
              <div
                style={{
                  fontSize: '96px',
                  fontWeight: 900,
                  color: '#14b8a6',
                  textShadow: '0 0 40px rgba(20,184,166,0.8)',
                }}
              >
                {countdown}
              </div>
            )}

            {/* Reveal indicator */}
            {gamePhase === 'reveal' && (
              <div style={{ color: '#14b8a6', fontWeight: 'bold', fontSize: '18px' }}>
                Revealing cards...
              </div>
            )}

            {/* Result message */}
            {gamePhase === 'summary' && roundResult && (
              <div
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #334155',
                  textAlign: 'center',
                  maxWidth: '400px',
                }}
              >
                <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>
                  {roundResult}
                </p>
              </div>
            )}

            {/* Pot */}
            <Pot amount={pot} ghostHands={ghostHands} winners={winners} showGhostCards={showCards} />
          </div>

          {/* Right AIs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        </div>

        {/* Human player at bottom */}
        {humanPlayer && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                background: '#1e293b',
                borderRadius: '16px',
                padding: '16px',
                border: `2px solid ${
                  winners.includes(humanPlayer.id)
                    ? '#fbbf24'
                    : losers.includes(humanPlayer.id)
                      ? '#ef4444'
                      : '#334155'
                }`,
                boxShadow: winners.includes(humanPlayer.id)
                  ? '0 0 20px rgba(251,191,36,0.4)'
                  : losers.includes(humanPlayer.id)
                    ? '0 0 20px rgba(239,68,68,0.4)'
                    : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '18px' }}>
                    {humanPlayer.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                        border: '2px solid #b45309',
                      }}
                    />
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fbbf24' }}>
                      {humanPlayer.tokens}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {humanPlayer.cards.map((card, idx) => (
                    <Card key={idx} card={card} revealed={true} size="lg" />
                  ))}
                </div>

                {humanPlayer.cards.length === 2 && (
                  <div style={{ color: '#5eead4', fontWeight: 500 }}>
                    {getHandDescription(humanPlayer.cards)}
                  </div>
                )}

                {humanPlayer.decision && (
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      background:
                        humanPlayer.decision === 'hold'
                          ? 'rgba(34,197,94,0.2)'
                          : 'rgba(239,68,68,0.2)',
                      color: humanPlayer.decision === 'hold' ? '#4ade80' : '#f87171',
                      border: `1px solid ${humanPlayer.decision === 'hold' ? '#22c55e' : '#ef4444'}`,
                    }}
                  >
                    You chose to {humanPlayer.decision.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            {isDecisionPhase && !humanDecided && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => makeHumanDecision('hold')}
                  style={{
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: 'linear-gradient(135deg, #22c55e, #15803d)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                  }}
                >
                  HOLD
                </button>
                <button
                  onClick={() => makeHumanDecision('drop')}
                  style={{
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                  }}
                >
                  DROP
                </button>
              </div>
            )}

            {isDecisionPhase && humanDecided && (
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Waiting for countdown...</div>
            )}

            {gamePhase === 'summary' && (
              <button
                onClick={nextRound}
                style={{
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
                }}
              >
                NEXT ROUND
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
