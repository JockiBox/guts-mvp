'use client';

import { useGutsGame } from '@/lib/useGutsGame';
import { Player } from './Player';
import { Pot } from './Pot';
import { Card } from './Card';
import { StartScreen } from './StartScreen';
import { getHandDescription } from '@/lib/useGutsGame';
import { useState, useEffect } from 'react';

// Particle component for celebrations
function Particles({ active, type }: { active: boolean; type: 'win' | 'sixnine' | 'lose' }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; angle: number }>>([]);

  useEffect(() => {
    if (active) {
      const colors = type === 'sixnine'
        ? ['#f472b6', '#e879f9', '#c084fc', '#a855f7', '#fbbf24']
        : type === 'win'
          ? ['#fbbf24', '#f59e0b', '#22c55e', '#4ade80', '#fef08a']
          : ['#ef4444', '#f87171', '#fca5a5'];

      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        angle: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active, type]);

  if (!active || particles.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: '50%',
            animation: `particle-fly-${i % 5} 1.5s ease-out forwards`,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes particle-fly-0 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(720deg); opacity: 0; } }
        @keyframes particle-fly-1 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(-720deg); opacity: 0; } }
        @keyframes particle-fly-2 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(540deg); opacity: 0; } }
        @keyframes particle-fly-3 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(-540deg); opacity: 0; } }
        @keyframes particle-fly-4 { to { transform: translate(${Math.random() * 400 - 200}px, ${-300 - Math.random() * 200}px) rotate(360deg); opacity: 0; } }
      `}</style>
    </div>
  );
}

export function GameBoard() {
  const { state, humanPlayer, startGame, makeHumanDecision, nextRound, playerCount, setPlayerCount } = useGutsGame();
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

  const [shake, setShake] = useState(false);
  const [showParticles, setShowParticles] = useState<'win' | 'sixnine' | 'lose' | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  // Trigger effects on game events
  useEffect(() => {
    if (gamePhase === 'summary' && humanPlayer) {
      if (winners.includes(humanPlayer.id)) {
        setShowParticles('win');
        setFlashColor('rgba(34, 197, 94, 0.3)');
      } else if (losers.includes(humanPlayer.id)) {
        setShake(true);
        setShowParticles('lose');
        setFlashColor('rgba(239, 68, 68, 0.3)');
      }

      const timer = setTimeout(() => {
        setShake(false);
        setFlashColor(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, winners, losers, humanPlayer]);

  // Check for six-nine celebration
  const hasSixNine = humanPlayer?.cards.length === 2 &&
    [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('6') &&
    [humanPlayer.cards[0].rank, humanPlayer.cards[1].rank].includes('9');

  useEffect(() => {
    if (hasSixNine && gamePhase === 'decision') {
      setShowParticles('sixnine');
      const timer = setTimeout(() => setShowParticles(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSixNine, gamePhase]);

  if (gamePhase === 'start') {
    return (
      <StartScreen
        onStart={startGame}
        resultMessage={roundResult}
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
    );
  }

  const aiPlayers = players.filter(p => !p.isHuman && p.isActive);
  const showCards = gamePhase === 'reveal' || gamePhase === 'summary';
  const isDecisionPhase = gamePhase === 'decision';
  const humanDecided = humanPlayer?.decision !== null;

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
        animation: shake ? 'shake 0.5s ease-in-out' : 'none',
        position: 'relative',
      }}
    >
      {/* Screen flash overlay */}
      {flashColor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: flashColor,
            pointerEvents: 'none',
            zIndex: 50,
            animation: 'flash 0.5s ease-out forwards',
          }}
        />
      )}

      {/* Particles */}
      <Particles active={showParticles !== null} type={showParticles || 'win'} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.9)',
            borderRadius: '8px',
            padding: '6px 14px',
            border: '2px solid #334155',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>ROUND </span>
          <span style={{ color: '#14b8a6', fontWeight: 'bold', fontSize: '18px' }}>{roundNumber}</span>
        </div>

        {/* Pot with dramatic styling */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.2))',
            borderRadius: '8px',
            padding: '6px 16px',
            border: '2px solid #fbbf24',
            boxShadow: '0 0 20px rgba(251,191,36,0.3)',
            animation: pot > 20 ? 'pulse-gold 1s ease-in-out infinite' : 'none',
          }}
        >
          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px' }}>
            POT: {pot}
          </span>
        </div>
      </div>

      {/* Main game area */}
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
        {/* Top AIs */}
        <div style={{ gridColumn: '2', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {aiPlayers.slice(0, Math.ceil(aiPlayers.length / 3)).map((player) => (
            <Player
              key={player.id}
              player={player}
              isWinner={winners.includes(player.id)}
              isLoser={losers.includes(player.id)}
              showCards={showCards && player.decision === 'hold'}
            />
          ))}
        </div>

        {/* Left AIs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {aiPlayers.slice(Math.ceil(aiPlayers.length / 3), Math.ceil(aiPlayers.length / 3) + Math.ceil(aiPlayers.length / 3)).map((player) => (
            <Player
              key={player.id}
              player={player}
              isWinner={winners.includes(player.id)}
              isLoser={losers.includes(player.id)}
              showCards={showCards && player.decision === 'hold'}
            />
          ))}
        </div>

        {/* Center */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {/* DRAMATIC COUNTDOWN */}
          {isDecisionPhase && countdown !== null && countdown > 0 && (
            <div
              style={{
                fontSize: '140px',
                fontWeight: 900,
                color: countdown === 1 ? '#ef4444' : countdown === 2 ? '#fbbf24' : '#14b8a6',
                textShadow: `
                  0 0 80px ${countdown === 1 ? 'rgba(239,68,68,1)' : countdown === 2 ? 'rgba(251,191,36,1)' : 'rgba(20,184,166,1)'},
                  0 0 120px ${countdown === 1 ? 'rgba(239,68,68,0.8)' : countdown === 2 ? 'rgba(251,191,36,0.8)' : 'rgba(20,184,166,0.8)'}
                `,
                animation: 'countdown-pulse 1s ease-in-out infinite, countdown-shake 0.1s ease-in-out infinite',
                lineHeight: 0.8,
                fontFamily: 'Impact, sans-serif',
              }}
            >
              {countdown}
            </div>
          )}

          {/* Tension text during countdown */}
          {isDecisionPhase && countdown !== null && countdown > 0 && (
            <div
              style={{
                color: countdown === 1 ? '#ef4444' : '#94a3b8',
                fontSize: countdown === 1 ? '20px' : '14px',
                fontWeight: countdown === 1 ? 'bold' : 'normal',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                animation: countdown === 1 ? 'blink 0.3s ease-in-out infinite' : 'none',
              }}
            >
              {countdown === 1 ? 'LAST CHANCE!' : countdown === 2 ? 'DECIDE NOW!' : 'HOLD OR DROP?'}
            </div>
          )}

          {/* Reveal indicator */}
          {gamePhase === 'reveal' && (
            <div
              style={{
                color: '#14b8a6',
                fontWeight: 'bold',
                fontSize: '28px',
                textShadow: '0 0 30px rgba(20,184,166,0.8)',
                animation: 'pulse 0.5s ease-in-out infinite',
                letterSpacing: '4px',
              }}
            >
              REVEALING...
            </div>
          )}

          {/* Result message */}
          {gamePhase === 'summary' && roundResult && (
            <div
              style={{
                background: 'rgba(30,41,59,0.95)',
                borderRadius: '16px',
                padding: '16px 24px',
                border: winners.includes(humanPlayer?.id || '')
                  ? '3px solid #22c55e'
                  : losers.includes(humanPlayer?.id || '')
                    ? '3px solid #ef4444'
                    : '2px solid #fbbf24',
                textAlign: 'center',
                maxWidth: '400px',
                boxShadow: winners.includes(humanPlayer?.id || '')
                  ? '0 0 40px rgba(34,197,94,0.5)'
                  : losers.includes(humanPlayer?.id || '')
                    ? '0 0 40px rgba(239,68,68,0.5)'
                    : '0 0 30px rgba(251,191,36,0.4)',
                animation: 'result-appear 0.5s ease-out',
              }}
            >
              <p style={{
                color: winners.includes(humanPlayer?.id || '') ? '#4ade80' : losers.includes(humanPlayer?.id || '') ? '#f87171' : '#fbbf24',
                fontWeight: 'bold',
                fontSize: '18px',
                margin: 0
              }}>
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
          {aiPlayers.slice(Math.ceil(aiPlayers.length / 3) + Math.ceil(aiPlayers.length / 3)).map((player) => (
            <Player
              key={player.id}
              player={player}
              isWinner={winners.includes(player.id)}
              isLoser={losers.includes(player.id)}
              showCards={showCards && player.decision === 'hold'}
            />
          ))}
        </div>

        {/* Human player */}
        <div style={{ gridColumn: '1 / -1' }}>
          {humanPlayer && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  background: hasSixNine
                    ? 'linear-gradient(135deg, #1e293b, #4a1d6a, #1e293b)'
                    : 'linear-gradient(135deg, #1e293b, #0f172a)',
                  borderRadius: '16px',
                  padding: '14px 24px',
                  border: `3px solid ${
                    winners.includes(humanPlayer.id)
                      ? '#22c55e'
                      : losers.includes(humanPlayer.id)
                        ? '#ef4444'
                        : hasSixNine
                          ? '#e879f9'
                          : '#334155'
                  }`,
                  boxShadow: winners.includes(humanPlayer.id)
                    ? '0 0 40px rgba(34,197,94,0.6), inset 0 0 30px rgba(34,197,94,0.1)'
                    : losers.includes(humanPlayer.id)
                      ? '0 0 40px rgba(239,68,68,0.6), inset 0 0 30px rgba(239,68,68,0.1)'
                      : hasSixNine
                        ? '0 0 50px rgba(232,121,249,0.6), inset 0 0 40px rgba(232,121,249,0.1)'
                        : '0 8px 32px rgba(0,0,0,0.3)',
                  animation: hasSixNine ? 'sixnine-glow 1s ease-in-out infinite' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Player info */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#14b8a6', fontSize: '18px' }}>
                      {humanPlayer.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                          border: '2px solid #92400e',
                          boxShadow: '0 0 10px rgba(251,191,36,0.5)',
                        }}
                      />
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fbbf24', fontSize: '20px' }}>
                        {humanPlayer.tokens}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {humanPlayer.cards.map((card, idx) => (
                      <Card
                        key={idx}
                        card={card}
                        revealed={true}
                        size="lg"
                        isWinner={winners.includes(humanPlayer.id)}
                        isSixNine={hasSixNine}
                      />
                    ))}
                  </div>

                  {/* Hand description */}
                  {humanPlayer.cards.length === 2 && (
                    <div
                      style={{
                        color: hasSixNine ? '#e879f9' : '#5eead4',
                        fontWeight: hasSixNine ? 900 : 600,
                        fontSize: hasSixNine ? '22px' : '16px',
                        textShadow: hasSixNine ? '0 0 20px rgba(232,121,249,0.8)' : 'none',
                        animation: hasSixNine ? 'rainbow-text 2s linear infinite' : 'none',
                      }}
                    >
                      {getHandDescription(humanPlayer.cards)}
                    </div>
                  )}

                  {/* Decision badge */}
                  {humanPlayer.decision && (
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: humanPlayer.decision === 'hold'
                          ? 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(22,163,74,0.3))'
                          : 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(185,28,28,0.3))',
                        color: humanPlayer.decision === 'hold' ? '#4ade80' : '#f87171',
                        border: `2px solid ${humanPlayer.decision === 'hold' ? '#22c55e' : '#ef4444'}`,
                        boxShadow: humanPlayer.decision === 'hold'
                          ? '0 0 15px rgba(34,197,94,0.4)'
                          : '0 0 15px rgba(239,68,68,0.4)',
                      }}
                    >
                      {humanPlayer.decision.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* BIG DRAMATIC BUTTONS */}
              {isDecisionPhase && !humanDecided && (
                <div style={{ display: 'flex', gap: '30px' }}>
                  <button
                    onClick={() => makeHumanDecision('hold')}
                    style={{
                      padding: '24px 56px',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: 'white',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)',
                      border: '4px solid #4ade80',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      boxShadow: '0 0 40px rgba(34,197,94,0.6), 0 8px 32px rgba(0,0,0,0.3)',
                      transition: 'all 0.15s ease',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      animation: 'button-pulse-green 1s ease-in-out infinite',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 0 60px rgba(34,197,94,0.8), 0 12px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(34,197,94,0.6), 0 8px 32px rgba(0,0,0,0.3)';
                    }}
                  >
                    HOLD
                  </button>
                  <button
                    onClick={() => makeHumanDecision('drop')}
                    style={{
                      padding: '24px 56px',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: 'white',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                      border: '4px solid #f87171',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      boxShadow: '0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(0,0,0,0.3)',
                      transition: 'all 0.15s ease',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      animation: 'button-pulse-red 1s ease-in-out infinite',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 0 60px rgba(239,68,68,0.8), 0 12px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(0,0,0,0.3)';
                    }}
                  >
                    DROP
                  </button>
                </div>
              )}

              {isDecisionPhase && humanDecided && (
                <div style={{ color: '#64748b', fontSize: '16px', fontStyle: 'italic' }}>
                  Locked in... waiting for countdown
                </div>
              )}

              {gamePhase === 'summary' && (
                <button
                  onClick={nextRound}
                  style={{
                    padding: '18px 48px',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488, #0f766e)',
                    border: '3px solid #2dd4bf',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(20,184,166,0.5)',
                    animation: 'pulse 1s ease-in-out infinite',
                  }}
                >
                  NEXT ROUND
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* All animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes countdown-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes countdown-shake {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 40px rgba(251,191,36,0.6); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes sixnine-glow {
          0%, 100% { box-shadow: 0 0 50px rgba(232,121,249,0.6), inset 0 0 40px rgba(232,121,249,0.1); }
          50% { box-shadow: 0 0 80px rgba(232,121,249,0.9), inset 0 0 60px rgba(232,121,249,0.2); }
        }
        @keyframes rainbow-text {
          0% { color: #f472b6; }
          25% { color: #e879f9; }
          50% { color: #c084fc; }
          75% { color: #a855f7; }
          100% { color: #f472b6; }
        }
        @keyframes button-pulse-green {
          0%, 100% { box-shadow: 0 0 40px rgba(34,197,94,0.6), 0 8px 32px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 60px rgba(34,197,94,0.8), 0 8px 32px rgba(0,0,0,0.3); }
        }
        @keyframes button-pulse-red {
          0%, 100% { box-shadow: 0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 60px rgba(239,68,68,0.8), 0 8px 32px rgba(0,0,0,0.3); }
        }
        @keyframes result-appear {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
