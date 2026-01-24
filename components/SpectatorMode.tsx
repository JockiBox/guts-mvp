'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import type { Card as CardType } from '@/lib/types';

interface SpectatorPlayer {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  tokens: number;
  cards: CardType[];
  decision: 'hold' | 'drop' | null;
  isWinner: boolean;
  isLoser: boolean;
}

interface SpectatorGameState {
  roomCode: string;
  phase: 'waiting' | 'dealing' | 'decision' | 'reveal' | 'summary';
  players: SpectatorPlayer[];
  pot: number;
  countdown: number | null;
  roundNumber: number;
  ghostHands: Array<{ cards: CardType[]; isWinner: boolean }>;
  resultMessage: string;
  spectatorCount: number;
}

interface SpectatorModeProps {
  gameState: SpectatorGameState;
  onLeave: () => void;
  onJoinGame?: () => void;
  canJoin?: boolean;
}

export default function SpectatorMode({
  gameState,
  onLeave,
  onJoinGame,
  canJoin = false,
}: SpectatorModeProps) {
  const [showPlayerCards, setShowPlayerCards] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const {
    roomCode,
    phase,
    players,
    pot,
    countdown,
    roundNumber,
    ghostHands,
    resultMessage,
    spectatorCount,
  } = gameState;

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Spectator header bar */}
      <div
        style={{
          background: 'rgba(251, 191, 36, 0.15)',
          borderBottom: '2px solid rgba(251, 191, 36, 0.3)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>👀</span>
          <div>
            <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '14px' }}>
              SPECTATOR MODE
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '12px' }}>
              Room: {roomCode}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Spectator count */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '14px' }}>👁</span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
              {spectatorCount} watching
            </span>
          </div>

          {/* Toggle card visibility */}
          <button
            onClick={() => setShowPlayerCards(!showPlayerCards)}
            style={{
              background: showPlayerCards ? 'rgba(20, 184, 166, 0.2)' : 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              color: showPlayerCards ? '#14b8a6' : '#64748b',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {showPlayerCards ? '🃏 Cards Visible' : '🃏 Cards Hidden'}
          </button>

          {/* Join game button */}
          {canJoin && onJoinGame && (
            <button
              onClick={onJoinGame}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: '600',
                fontSize: '13px',
              }}
            >
              Join Game
            </button>
          )}

          {/* Leave button */}
          <button
            onClick={onLeave}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#f87171',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main game view */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Game info bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '12px',
              padding: '10px 20px',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Round</span>
            <span style={{ color: '#14b8a6', fontWeight: '700', fontSize: '20px' }}>
              {roundNumber}
            </span>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(217, 119, 6, 0.15))',
              borderRadius: '12px',
              padding: '10px 20px',
              border: '2px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🪙</span>
            <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '24px' }}>
              {pot}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '12px',
              padding: '10px 20px',
              border: '1px solid #334155',
            }}
          >
            <span
              style={{
                color:
                  phase === 'decision'
                    ? '#fbbf24'
                    : phase === 'reveal' || phase === 'summary'
                    ? '#22c55e'
                    : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
              }}
            >
              {phase === 'waiting'
                ? 'Waiting for players...'
                : phase === 'dealing'
                ? 'Dealing cards...'
                : phase === 'decision'
                ? 'Players deciding...'
                : phase === 'reveal'
                ? 'Revealing...'
                : 'Round complete'}
            </span>
          </div>
        </div>

        {/* Countdown */}
        {phase === 'decision' && countdown !== null && countdown > 0 && (
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontSize: '80px',
                fontWeight: '900',
                color: countdown === 1 ? '#ef4444' : countdown === 2 ? '#fbbf24' : '#14b8a6',
                textShadow: `0 0 60px ${
                  countdown === 1
                    ? 'rgba(239, 68, 68, 0.8)'
                    : countdown === 2
                    ? 'rgba(251, 191, 36, 0.8)'
                    : 'rgba(20, 184, 166, 0.8)'
                }`,
              }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Result message */}
        {phase === 'summary' && resultMessage && (
          <div
            style={{
              textAlign: 'center',
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '12px',
              padding: '16px 24px',
              border: '2px solid #14b8a6',
              margin: '0 auto',
            }}
          >
            <span style={{ color: '#14b8a6', fontSize: '18px', fontWeight: '600' }}>
              {resultMessage}
            </span>
          </div>
        )}

        {/* Players grid */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(players.length, 4)}, 1fr)`,
            gap: '16px',
            alignContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
              style={{
                background:
                  player.isWinner
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))'
                    : player.isLoser
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.1))'
                    : 'rgba(30, 41, 59, 0.9)',
                borderRadius: '16px',
                padding: '16px',
                border: `2px solid ${
                  player.isWinner
                    ? '#22c55e'
                    : player.isLoser
                    ? '#ef4444'
                    : selectedPlayer === player.id
                    ? '#14b8a6'
                    : '#334155'
                }`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow:
                  player.isWinner
                    ? '0 0 30px rgba(34, 197, 94, 0.3)'
                    : player.isLoser
                    ? '0 0 30px rgba(239, 68, 68, 0.3)'
                    : 'none',
              }}
            >
              {/* Player header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: player.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  {player.avatarEmoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px' }}>
                    {player.name}
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '12px' }}>
                    🪙 {player.tokens}
                  </div>
                </div>
                {player.isWinner && <span style={{ fontSize: '24px' }}>👑</span>}
                {player.isLoser && <span style={{ fontSize: '20px' }}>💀</span>}
              </div>

              {/* Player cards */}
              {showPlayerCards && player.cards.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  {player.cards.map((card, idx) => (
                    <Card
                      key={idx}
                      card={card}
                      revealed={phase === 'reveal' || phase === 'summary'}
                      size="md"
                      isWinner={player.isWinner}
                    />
                  ))}
                </div>
              )}

              {/* Decision badge */}
              {player.decision && (
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background:
                        player.decision === 'hold'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                      color: player.decision === 'hold' ? '#4ade80' : '#f87171',
                      border: `1px solid ${
                        player.decision === 'hold' ? '#22c55e' : '#ef4444'
                      }`,
                    }}
                  >
                    {player.decision.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ghost hands */}
        {ghostHands.length > 0 && (phase === 'reveal' || phase === 'summary') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            {ghostHands.map((ghost, idx) => (
              <div
                key={idx}
                style={{
                  background: ghost.isWinner
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(109, 40, 217, 0.2))'
                    : 'rgba(30, 41, 59, 0.9)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: `2px solid ${ghost.isWinner ? '#a855f7' : '#334155'}`,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#a855f7',
                    fontWeight: '700',
                    fontSize: '14px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>👻</span>
                  Ghost Hand #{idx + 1}
                  {ghost.isWinner && <span style={{ fontSize: '18px' }}>👑</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {ghost.cards.map((card, cardIdx) => (
                    <Card
                      key={cardIdx}
                      card={card}
                      revealed={true}
                      size="md"
                      isWinner={ghost.isWinner}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom tip */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderTop: '1px solid #334155',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#64748b', fontSize: '12px' }}>
          {showPlayerCards
            ? 'Tip: Click on a player to highlight them'
            : 'Tip: Enable card visibility to see player hands'}
        </span>
      </div>
    </div>
  );
}

// Spectator join button for lobby
export function SpectatorButton({
  onClick,
  spectatorCount,
}: {
  onClick: () => void;
  spectatorCount: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(251, 191, 36, 0.15)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: '8px',
        padding: '8px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: '16px' }}>👀</span>
      <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: '600' }}>
        Watch ({spectatorCount})
      </span>
    </button>
  );
}
