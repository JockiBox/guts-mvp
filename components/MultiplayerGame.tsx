'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  subscribeToRoom,
  getRoomPlayers,
  leaveRoom,
  broadcastGameAction,
  type MultiplayerRoom,
  type RoomPlayer,
  type GameAction,
} from '@/lib/multiplayer';
import {
  startRound,
  recordDecision,
  checkAllDecided,
  revealAndDetermineWinner,
  getMyCards,
  evaluateHand,
  type Card,
} from '@/lib/multiplayerGame';
import { type UserProfile } from '@/lib/supabase';
import {
  playClick,
  playHold,
  playDrop,
  playWin,
  playLose,
  playCardFlip,
  playCountdown,
  playGhostAppear,
  playSixNine,
  playNewRound,
  playTokens,
} from '@/lib/sounds';
import { Card as CardComponent } from './Card';
import GameChat from './GameChat';
import { SpectatorButton } from './SpectatorMode';

interface MultiplayerGameProps {
  room: MultiplayerRoom;
  user: UserProfile;
  initialPlayers: RoomPlayer[];
  onLeave: () => void;
}

type GamePhase = 'waiting' | 'dealing' | 'decision' | 'reveal' | 'result';

export function MultiplayerGame({ room, user, initialPlayers, onLeave }: MultiplayerGameProps) {
  const [players, setPlayers] = useState<RoomPlayer[]>(initialPlayers);
  const [myCards, setMyCards] = useState<Card[] | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [myDecision, setMyDecision] = useState<'hold' | 'drop' | null>(null);
  const [revealedCards, setRevealedCards] = useState<Map<string, Card[]>>(new Map());
  const [winners, setWinners] = useState<string[]>([]);
  const [losers, setLosers] = useState<string[]>([]);
  const [ghostHand, setGhostHand] = useState<Card[] | null>(null);
  const [pot, setPot] = useState(room.pot);
  const [roundNumber, setRoundNumber] = useState(room.current_round);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showChat, setShowChat] = useState(true);
  const [spectatorCount] = useState(0); // Will be populated from room data

  const isHost = room.host_id === user.id;
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to room updates
  useEffect(() => {
    const channel = subscribeToRoom(room.id, {
      onPlayerUpdate: (player) => {
        setPlayers((prev) => prev.map((p) => (p.user_id === player.user_id ? player : p)));
      },
      onPlayerLeave: (playerId) => {
        setPlayers((prev) => prev.filter((p) => p.user_id !== playerId));
      },
      onRoomUpdate: (updatedRoom) => {
        setPot(updatedRoom.pot);
        setRoundNumber(updatedRoom.current_round);
      },
      onGameAction: (action) => handleGameAction(action),
    });

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  // Handle game actions from broadcast
  const handleGameAction = useCallback(
    (action: GameAction) => {
      switch (action.type) {
        case 'deal':
          setGamePhase('dealing');
          setMyDecision(null);
          setWinners([]);
          setLosers([]);
          setGhostHand(null);
          setRevealedCards(new Map());
          setResultMessage('');
          playNewRound();

          // Fetch my cards
          getMyCards(room.id, user.id).then((cards) => {
            setMyCards(cards);
            // Start decision phase after a short delay
            setTimeout(() => {
              setGamePhase('decision');
              startCountdown();
            }, 1500);
          });
          break;

        case 'decision':
          // Another player made a decision (hidden)
          break;

        case 'reveal':
          setGamePhase('reveal');
          const payload = action.payload as {
            winners: string[];
            losers: string[];
            pot: number;
            ghostHand?: Card[];
            players: Array<{ user_id: string; cards: Card[] | null; decision: string }>;
          };

          // Set revealed cards
          const revealed = new Map<string, Card[]>();
          for (const p of payload.players) {
            if (p.cards) {
              revealed.set(p.user_id, p.cards);
            }
          }
          setRevealedCards(revealed);
          setWinners(payload.winners);
          setLosers(payload.losers);
          setPot(payload.pot);

          if (payload.ghostHand) {
            setGhostHand(payload.ghostHand);
            playGhostAppear();
          }

          playCardFlip();

          // Transition to result after reveal animation
          setTimeout(() => {
            setGamePhase('result');
            generateResultMessage(payload.winners, payload.losers, payload.ghostHand);

            if (payload.winners.includes(user.id)) {
              playWin();
              playTokens();
            } else if (payload.losers.includes(user.id)) {
              playLose();
            }
          }, 2000);
          break;

        case 'round_end':
          // Refresh players' token counts
          getRoomPlayers(room.id).then(setPlayers);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [room.id, user.id]
  );

  // Start countdown timer
  const startCountdown = useCallback(() => {
    const decisionTime = room.settings.decisionTime || 3;
    setCountdown(decisionTime);

    let timeLeft = decisionTime;
    countdownRef.current = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);
      if (timeLeft > 0) {
        playCountdown(timeLeft);
      }

      if (timeLeft <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setCountdown(null);

        // If player hasn't decided, auto-drop
        if (!myDecision) {
          handleDecision('drop');
        }
      }
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.settings.decisionTime, myDecision]);

  // Generate result message
  const generateResultMessage = (winnerIds: string[], loserIds: string[], ghost?: Card[]) => {
    if (ghost) {
      setResultMessage('👻 Ghost Hand wins! Everyone pays double!');
      return;
    }

    const winnerNames = winnerIds
      .map((id) => players.find((p) => p.user_id === id)?.username || 'Unknown')
      .join(', ');

    if (winnerIds.includes(user.id)) {
      setResultMessage(`🏆 You won ${pot} tokens!`);
    } else if (loserIds.includes(user.id)) {
      setResultMessage(`💀 ${winnerNames} wins! You lose ${pot} tokens.`);
    } else {
      setResultMessage(`${winnerNames} wins the pot!`);
    }
  };

  // Handle player decision
  const handleDecision = async (decision: 'hold' | 'drop') => {
    if (myDecision) return;

    setMyDecision(decision);
    if (decision === 'hold') {
      playHold();
    } else {
      playDrop();
    }

    await recordDecision(room.id, user.id, decision);

    // Check if all decided (host handles this)
    if (isHost) {
      const allDecided = await checkAllDecided(room.id);
      if (allDecided) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        await revealAndDetermineWinner(room.id);
      }
    }
  };

  // Start next round (host only)
  const handleNextRound = async () => {
    if (!isHost) return;

    playClick();

    // Refresh players
    const updatedPlayers = await getRoomPlayers(room.id);
    setPlayers(updatedPlayers);

    // Check if any player is out of tokens
    const activePlayers = updatedPlayers.filter((p) => p.tokens > 0);
    if (activePlayers.length < 2) {
      // Game over
      broadcastGameAction(room.id, {
        type: 'result',
        payload: { finished: true, winner: activePlayers[0]?.username },
        timestamp: Date.now(),
      });
      return;
    }

    // Start new round
    await startRound(
      { ...room, current_round: roundNumber, pot },
      activePlayers
    );
  };

  // Leave game
  const handleLeave = async () => {
    playClick();
    await leaveRoom(room.id, user.id);
    onLeave();
  };

  // Check for six-nine hand
  const hasSixNine =
    myCards &&
    myCards.length === 2 &&
    myCards.some((c) => c.rank === '6') &&
    myCards.some((c) => c.rank === '9');

  useEffect(() => {
    if (hasSixNine && gamePhase === 'decision') {
      playSixNine();
    }
  }, [hasSixNine, gamePhase]);

  // Get hand description
  const getHandDescription = () => {
    if (!myCards || myCards.length !== 2) return '';
    return evaluateHand(myCards).description;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        padding: '12px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleLeave}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#f87171',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Leave
          </button>
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '8px',
              padding: '6px 14px',
              border: '2px solid #334155',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>ROUND </span>
            <span style={{ color: '#14b8a6', fontWeight: 'bold', fontSize: '18px' }}>{roundNumber}</span>
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.2))',
            borderRadius: '8px',
            padding: '8px 16px',
            border: '2px solid #fbbf24',
            boxShadow: '0 0 20px rgba(251,191,36,0.3)',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>POT </span>
          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '20px' }}>{pot}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Spectator count */}
          <SpectatorButton onClick={() => {}} spectatorCount={spectatorCount} />

          {/* Chat toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              background: showChat ? 'rgba(20, 184, 166, 0.2)' : 'rgba(51, 65, 85, 0.5)',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              color: showChat ? '#14b8a6' : '#64748b',
              fontSize: '14px',
            }}
          >
            💬 {showChat ? 'Hide' : 'Chat'}
          </button>
        </div>
      </div>

      {/* Players Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {players
          .filter((p) => p.user_id !== user.id)
          .map((player) => (
            <div
              key={player.id}
              style={{
                background: winners.includes(player.user_id)
                  ? 'rgba(34, 197, 94, 0.1)'
                  : losers.includes(player.user_id)
                  ? 'rgba(239, 68, 68, 0.1)'
                  : '#1e293b',
                border: `2px solid ${
                  winners.includes(player.user_id)
                    ? '#22c55e'
                    : losers.includes(player.user_id)
                    ? '#ef4444'
                    : '#334155'
                }`,
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: player.avatar_color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  margin: '0 auto 8px',
                }}
              >
                {player.avatar_emoji}
              </div>
              <div style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '13px' }}>
                {player.username}
              </div>
              <div style={{ color: '#fbbf24', fontSize: '12px' }}>🪙 {player.tokens}</div>

              {/* Show decision indicator or cards */}
              {gamePhase === 'decision' && player.decision && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(20, 184, 166, 0.2)',
                    color: '#14b8a6',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  DECIDED
                </div>
              )}

              {(gamePhase === 'reveal' || gamePhase === 'result') && revealedCards.has(player.user_id) && (
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
                  {revealedCards.get(player.user_id)?.map((card, i) => (
                    <CardComponent key={i} card={card} revealed={true} size="sm" />
                  ))}
                </div>
              )}

              {(gamePhase === 'reveal' || gamePhase === 'result') &&
                !revealedCards.has(player.user_id) &&
                player.decision === 'drop' && (
                  <div
                    style={{
                      marginTop: '8px',
                      color: '#64748b',
                      fontSize: '11px',
                    }}
                  >
                    DROPPED
                  </div>
                )}
            </div>
          ))}
      </div>

      {/* Center - Countdown / Result */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {gamePhase === 'waiting' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
            <div style={{ color: '#64748b', fontSize: '18px' }}>
              {isHost ? 'Press Start Round to begin!' : 'Waiting for host to start...'}
            </div>
            {isHost && (
              <button
                onClick={handleNextRound}
                style={{
                  marginTop: '20px',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                }}
              >
                🚀 Start Round
              </button>
            )}
          </div>
        )}

        {gamePhase === 'dealing' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '64px',
                marginBottom: '16px',
                animation: 'spin-cards 1s ease-in-out infinite',
              }}
            >
              🃏
            </div>
            <div style={{ color: '#14b8a6', fontSize: '20px', fontWeight: '600' }}>Dealing cards...</div>
          </div>
        )}

        {gamePhase === 'decision' && countdown !== null && countdown > 0 && (
          <div
            style={{
              fontSize: '120px',
              fontWeight: 900,
              color: countdown === 1 ? '#ef4444' : countdown === 2 ? '#fbbf24' : '#14b8a6',
              textShadow: `0 0 60px ${
                countdown === 1 ? 'rgba(239,68,68,0.8)' : countdown === 2 ? 'rgba(251,191,36,0.8)' : 'rgba(20,184,166,0.8)'
              }`,
              animation: 'countdown-pulse 1s ease-in-out infinite',
            }}
          >
            {countdown}
          </div>
        )}

        {gamePhase === 'reveal' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#14b8a6', fontSize: '28px', fontWeight: '700', animation: 'pulse 0.5s ease-in-out infinite' }}>
              REVEALING...
            </div>
          </div>
        )}

        {gamePhase === 'result' && (
          <div style={{ textAlign: 'center' }}>
            {ghostHand && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>👻</div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {ghostHand.map((card, i) => (
                    <CardComponent key={i} card={card} revealed={true} size="md" />
                  ))}
                </div>
              </div>
            )}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.95)',
                borderRadius: '16px',
                padding: '24px 32px',
                border: `3px solid ${
                  winners.includes(user.id) ? '#22c55e' : losers.includes(user.id) ? '#ef4444' : '#fbbf24'
                }`,
                boxShadow: `0 0 40px ${
                  winners.includes(user.id)
                    ? 'rgba(34,197,94,0.5)'
                    : losers.includes(user.id)
                    ? 'rgba(239,68,68,0.5)'
                    : 'rgba(251,191,36,0.5)'
                }`,
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: winners.includes(user.id) ? '#4ade80' : losers.includes(user.id) ? '#f87171' : '#fbbf24',
                }}
              >
                {resultMessage}
              </div>
            </div>

            {isHost && (
              <button
                onClick={handleNextRound}
                style={{
                  marginTop: '24px',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
                  animation: 'pulse 1s ease-in-out infinite',
                }}
              >
                Next Round
              </button>
            )}
          </div>
        )}
      </div>

      {/* Player's Hand */}
      <div
        style={{
          background: hasSixNine
            ? 'linear-gradient(135deg, #1e293b, #4a1d6a, #1e293b)'
            : 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '16px',
          padding: '20px',
          border: `3px solid ${
            winners.includes(user.id)
              ? '#22c55e'
              : losers.includes(user.id)
              ? '#ef4444'
              : hasSixNine
              ? '#e879f9'
              : '#334155'
          }`,
          boxShadow: hasSixNine ? '0 0 40px rgba(232,121,249,0.5)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Player info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: user.avatar_color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              {user.avatar_emoji}
            </div>
            <div>
              <div style={{ color: '#14b8a6', fontWeight: '700', fontSize: '18px' }}>{user.username}</div>
              <div style={{ color: '#fbbf24', fontSize: '14px' }}>🪙 {user.tokens}</div>
            </div>
          </div>

          {/* Cards */}
          {myCards && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {myCards.map((card, i) => (
                  <CardComponent
                    key={i}
                    card={card}
                    revealed={true}
                    size="lg"
                    isWinner={winners.includes(user.id)}
                    isSixNine={hasSixNine === true}
                  />
                ))}
              </div>
              <div
                style={{
                  color: hasSixNine ? '#e879f9' : '#5eead4',
                  fontWeight: hasSixNine ? 900 : 600,
                  fontSize: hasSixNine ? '20px' : '16px',
                  textShadow: hasSixNine ? '0 0 20px rgba(232,121,249,0.8)' : 'none',
                }}
              >
                {getHandDescription()}
              </div>
            </div>
          )}

          {/* Decision buttons */}
          {gamePhase === 'decision' && !myDecision && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => handleDecision('hold')}
                style={{
                  padding: '16px 40px',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: 'white',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: '3px solid #4ade80',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(34,197,94,0.5)',
                }}
              >
                HOLD
              </button>
              <button
                onClick={() => handleDecision('drop')}
                style={{
                  padding: '16px 40px',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: 'white',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: '3px solid #f87171',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(239,68,68,0.5)',
                }}
              >
                DROP
              </button>
            </div>
          )}

          {/* Decision badge */}
          {myDecision && (
            <div
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                background:
                  myDecision === 'hold'
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(22,163,74,0.3))'
                    : 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(185,28,28,0.3))',
                color: myDecision === 'hold' ? '#4ade80' : '#f87171',
                border: `2px solid ${myDecision === 'hold' ? '#22c55e' : '#ef4444'}`,
                fontWeight: '700',
                fontSize: '16px',
              }}
            >
              {myDecision.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div
          style={{
            position: 'fixed',
            right: '12px',
            bottom: '12px',
            width: '300px',
            zIndex: 1001,
          }}
        >
          <GameChat
            roomCode={room.code}
            userId={user.id}
            username={user.username}
            userColor={user.avatar_color || '#14b8a6'}
            userEmoji={user.avatar_emoji || '🎮'}
            isCompact={true}
          />
        </div>
      )}

      <style jsx global>{`
        @keyframes spin-cards {
          0%,
          100% {
            transform: rotateY(0deg) scale(1);
          }
          50% {
            transform: rotateY(180deg) scale(1.1);
          }
        }
        @keyframes countdown-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
