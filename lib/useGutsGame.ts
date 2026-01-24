'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  Card,
  Player,
  GhostHand,
  GameState,
  Suit,
  Rank,
  Personality,
  Decision,
} from './types';
import { RANK_VALUES } from './types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getHandValue(cards: Card[]): number {
  if (cards.length !== 2) {
    return 0;
  }

  const val1 = RANK_VALUES[cards[0].rank];
  const val2 = RANK_VALUES[cards[1].rank];
  const ranks = [cards[0].rank, cards[1].rank];
  const isPair = cards[0].rank === cards[1].rank;
  const isFlush = cards[0].suit === cards[1].suit;

  // 6-9 is the BEST hand - "Six Nine" beats everything!
  const isSixNine = (ranks.includes('6') && ranks.includes('9'));

  if (isSixNine) {
    return 2000; // Best possible hand
  }
  if (isPair) {
    return 1000 + val1;
  }
  if (isFlush) {
    return 500 + Math.max(val1, val2);
  }
  return Math.max(val1, val2) * 15 + Math.min(val1, val2);
}

export function getHandDescription(cards: Card[]): string {
  if (cards.length !== 2) {
    return '';
  }

  const val1 = RANK_VALUES[cards[0].rank];
  const val2 = RANK_VALUES[cards[1].rank];
  const ranks = [cards[0].rank, cards[1].rank];
  const isPair = cards[0].rank === cards[1].rank;
  const isFlush = cards[0].suit === cards[1].suit;

  // Check for the legendary 6-9!
  const isSixNine = (ranks.includes('6') && ranks.includes('9'));

  const rankName = (rank: Rank): string => {
    if (rank === 'A') {
      return 'Ace';
    }
    if (rank === 'K') {
      return 'King';
    }
    if (rank === 'Q') {
      return 'Queen';
    }
    if (rank === 'J') {
      return 'Jack';
    }
    return rank;
  };

  const suitName = (suit: Suit): string => {
    return suit.charAt(0).toUpperCase() + suit.slice(1);
  };

  if (isSixNine) {
    return '★ SIX-NINE! ★';
  }
  if (isPair) {
    return `Pair of ${rankName(cards[0].rank)}s`;
  }
  if (isFlush) {
    return `${suitName(cards[0].suit)} Flush`;
  }
  const highCard = val1 > val2 ? cards[0] : cards[1];
  const lowCard = val1 > val2 ? cards[1] : cards[0];
  return `High Card: ${rankName(highCard.rank)}, ${rankName(lowCard.rank)}`;
}

function calculateAIDecision(player: Player): Decision {
  const handValue = getHandValue(player.cards);
  let holdProbability = 0.4;

  if (handValue > 1000) {
    holdProbability = 0.95;
  } else if (handValue > 500) {
    holdProbability = 0.8;
  } else if (handValue > 180) {
    holdProbability = 0.6;
  } else {
    holdProbability = 0.25;
  }

  switch (player.personality) {
    case 'aggressive':
      holdProbability = Math.min(1, holdProbability + 0.2);
      break;
    case 'conservative':
      holdProbability = Math.max(0, holdProbability - 0.2);
      break;
    case 'random':
      holdProbability = Math.random();
      break;
    case 'tricky':
      holdProbability = holdProbability > 0.5 ? holdProbability - 0.15 : holdProbability + 0.15;
      break;
  }

  return Math.random() < holdProbability ? 'hold' : 'drop';
}

const AI_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India'];
const PERSONALITIES: Personality[] = ['aggressive', 'conservative', 'random', 'tricky'];

function createInitialPlayers(playerCount: number = 5): Player[] {
  const players: Player[] = [];

  // Human player first
  players.push({
    id: 'player-0',
    name: 'You',
    tokens: 100,
    cards: [],
    isHuman: true,
    decision: null,
    personality: undefined,
    isActive: true,
    cardsRevealed: 0,
  });

  // AI players
  for (let i = 1; i < playerCount; i++) {
    players.push({
      id: `player-${i}`,
      name: AI_NAMES[i - 1] || `Player ${i + 1}`,
      tokens: 100,
      cards: [],
      isHuman: false,
      decision: null,
      personality: PERSONALITIES[(i - 1) % PERSONALITIES.length],
      isActive: true,
      cardsRevealed: 0,
    });
  }

  return players;
}

const initialState: GameState = {
  players: createInitialPlayers(),
  pot: 0,
  gamePhase: 'start',
  countdown: null,
  ghostHands: [],
  roundResult: '',
  revealState: {
    currentPlayerIndex: 0,
    currentCardIndex: 0,
    isRevealing: false,
  },
  winners: [],
  losers: [],
  roundNumber: 0,
};

export function useGutsGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [playerCount, setPlayerCount] = useState(5);
  const deckRef = useRef<Card[]>([]);
  const countdownProcessedRef = useRef(false);
  const revealInProgressRef = useRef(false);

  const activePlayers = state.players.filter(p => p.isActive);
  const humanPlayer = state.players.find(p => p.isHuman);

  const dealCards = useCallback(() => {
    deckRef.current = shuffleDeck(createDeck());

    setState(prev => ({
      ...prev,
      players: prev.players.map(player => {
        if (!player.isActive) {
          return player;
        }
        const cards = [deckRef.current.pop()!, deckRef.current.pop()!];
        return { ...player, cards, cardsRevealed: 0, decision: null };
      }),
      ghostHands: prev.ghostHands.map(ghost => ({
        ...ghost,
        cards: [deckRef.current.pop()!, deckRef.current.pop()!],
        cardsRevealed: 0,
      })),
    }));
  }, []);

  const collectAntes = useCallback(() => {
    setState(prev => {
      const activeCount = prev.players.filter(p => p.isActive).length;
      return {
        ...prev,
        pot: prev.pot + activeCount,
        players: prev.players.map(player =>
          player.isActive ? { ...player, tokens: player.tokens - 1 } : player
        ),
      };
    });
  }, []);

  const startRound = useCallback(() => {
    countdownProcessedRef.current = false;
    revealInProgressRef.current = false;
    collectAntes();
    dealCards();
    setState(prev => ({
      ...prev,
      gamePhase: 'decision',
      countdown: 3,
      roundResult: '',
      winners: [],
      losers: [],
      roundNumber: prev.roundNumber + 1,
    }));
  }, [collectAntes, dealCards]);

  const startGame = useCallback((numPlayers?: number) => {
    const count = numPlayers ?? playerCount;
    if (numPlayers) {
      setPlayerCount(numPlayers);
    }
    setState({
      ...initialState,
      players: createInitialPlayers(count),
      gamePhase: 'start',
    });
    setTimeout(() => startRound(), 100);
  }, [startRound, playerCount]);

  const makeHumanDecision = useCallback(
    (decision: Decision) => {
      if (state.gamePhase !== 'decision' || !decision) {
        return;
      }

      setState(prev => ({
        ...prev,
        players: prev.players.map(player => (player.isHuman ? { ...player, decision } : player)),
      }));
    },
    [state.gamePhase]
  );

  const makeAIDecisions = useCallback(() => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(player => {
        if (player.isHuman || !player.isActive || player.decision) {
          return player;
        }
        return { ...player, decision: calculateAIDecision(player) };
      }),
    }));
  }, []);

  const addGhostHand = useCallback(() => {
    const newGhost: GhostHand = {
      id: `ghost-${Date.now()}`,
      cards: [deckRef.current.pop()!, deckRef.current.pop()!],
      cardsRevealed: 0,
    };

    setState(prev => ({
      ...prev,
      ghostHands: [...prev.ghostHands, newGhost],
    }));

    return newGhost;
  }, []);

  const resolveRound = useCallback(() => {
    setState(prev => {
      const holders = prev.players.filter(p => p.isActive && p.decision === 'hold');

      // Calculate all hand values for players who held
      const playerHands = holders.map(p => ({
        id: p.id,
        name: p.name,
        value: getHandValue(p.cards),
        isGhost: false,
      }));

      // Ghost hands always compete (they never drop)
      const ghostHandsData = prev.ghostHands.map(g => ({
        id: g.id,
        name: 'Ghost',
        value: getHandValue(g.cards),
        isGhost: true,
      }));

      const allHands = [...playerHands, ...ghostHandsData];

      if (allHands.length === 0) {
        return prev;
      }

      // Find the highest hand value
      const maxValue = Math.max(...allHands.map(h => h.value));
      const winningHands = allHands.filter(h => h.value === maxValue);
      const losingHands = allHands.filter(h => h.value < maxValue);

      const winnerIds = winningHands.map(h => h.id);
      // Only players can be "losers" (ghosts don't pay)
      const loserIds = losingHands.filter(h => !h.isGhost).map(h => h.id);

      // Check if any ghost is among the winners
      const ghostWon = winningHands.some(h => h.isGhost);
      // Check if any player is among the winners
      const playerWon = winningHands.some(h => !h.isGhost);

      // A player must beat ALL ghosts to win outright
      // If ANY ghost ties or beats all players, ghosts stay
      const playerBeatsAllGhosts = playerWon && !ghostWon;

      let newPot = 0;
      const newPlayers = prev.players.map(p => {
        if (loserIds.includes(p.id)) {
          // All losers who held must match the pot
          // If ghost won, they DOUBLE the pot
          const multiplier = ghostWon ? 2 : 1;
          const tokensToLose = Math.min(p.tokens, prev.pot * multiplier);
          newPot += tokensToLose;
          return { ...p, tokens: p.tokens - tokensToLose, isActive: p.tokens - tokensToLose > 0 };
        }
        if (winnerIds.includes(p.id) && playerBeatsAllGhosts) {
          // Player won outright - takes the pot (split if multiple player winners)
          const playerWinners = winningHands.filter(h => !h.isGhost).length;
          const share = Math.floor(prev.pot / playerWinners);
          return { ...p, tokens: p.tokens + share };
        }
        return p;
      });

      // GHOST PERSISTENCE RULE:
      // Ghost hands ONLY clear when a player wins AND beats ALL ghost hands
      // If any ghost wins or ties with the best hand, ALL ghosts stay
      const newGhostHands = playerBeatsAllGhosts ? [] : prev.ghostHands;

      // Build result message
      let resultMessage = '';
      if (ghostWon && !playerWon) {
        // Ghost has the best hand, all players lost
        const winningGhost = prev.ghostHands.find(g => winnerIds.includes(g.id));
        resultMessage = `Ghost wins with ${getHandDescription(winningGhost?.cards || [])}! Losers DOUBLE the pot!`;
        newPot = prev.pot + newPot;
      } else if (ghostWon && playerWon) {
        // Tie between ghost and player - pot stays, ghosts stay
        const tiedPlayerNames = winningHands
          .filter(h => !h.isGhost)
          .map(h => h.name)
          .join(' & ');
        resultMessage = `${tiedPlayerNames} tied with Ghost! Pot grows to ${prev.pot + newPot} tokens.`;
        newPot = prev.pot + newPot;
      } else if (playerBeatsAllGhosts) {
        // Player beat everyone including all ghosts
        const winnerNames = winningHands
          .filter(h => !h.isGhost)
          .map(h => h.name)
          .join(' & ');
        const ghostCount = prev.ghostHands.length;
        if (ghostCount > 0) {
          resultMessage = `${winnerNames} beats ${ghostCount} ghost hand${ghostCount > 1 ? 's' : ''} and wins ${prev.pot} tokens!`;
        } else {
          resultMessage = `${winnerNames} wins ${prev.pot} tokens!`;
        }
        if (losingHands.filter(h => !h.isGhost).length > 0) {
          resultMessage += ` Losers match the pot.`;
        }
      }

      return {
        ...prev,
        players: newPlayers,
        pot: ghostWon || (playerWon && ghostWon) ? newPot : newPot,
        ghostHands: newGhostHands,
        winners: winnerIds,
        losers: loserIds,
        roundResult: resultMessage,
        gamePhase: 'summary',
      };
    });
  }, []);

  // Run the entire reveal sequence with timeouts
  const runRevealSequence = useCallback(() => {
    if (revealInProgressRef.current) return;
    revealInProgressRef.current = true;

    // Step 1: Wait 2 seconds, then reveal all player cards
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        players: prev.players.map(p =>
          p.isActive && p.decision === 'hold' ? { ...p, cardsRevealed: 2 } : p
        ),
      }));

      // Step 2: Wait 2 seconds, then start revealing ghost cards
      setTimeout(() => {
        setState(prev => {
          const ghostCount = prev.ghostHands.length;

          if (ghostCount === 0) {
            // No ghosts - resolve immediately
            return prev;
          }
          return prev;
        });

        // Get current ghost count from a ref-safe way
        setState(prev => {
          const ghostCount = prev.ghostHands.length;

          if (ghostCount === 0) {
            // No ghosts - resolve round
            setTimeout(() => resolveRound(), 500);
            return prev;
          }

          // Reveal ghost cards one by one
          let cardIndex = 0;
          const totalCards = ghostCount * 2;

          const revealNextCard = () => {
            if (cardIndex >= totalCards) {
              // All revealed - resolve round
              setTimeout(() => resolveRound(), 1000);
              return;
            }

            const ghostIdx = Math.floor(cardIndex / 2);
            const cardNum = (cardIndex % 2) + 1;

            setState(innerPrev => ({
              ...innerPrev,
              ghostHands: innerPrev.ghostHands.map((ghost, idx) => {
                if (idx === ghostIdx) {
                  return { ...ghost, cardsRevealed: cardNum };
                }
                if (idx < ghostIdx) {
                  return { ...ghost, cardsRevealed: 2 };
                }
                return ghost;
              }),
            }));

            cardIndex++;
            setTimeout(revealNextCard, 800);
          };

          revealNextCard();
          return prev;
        });
      }, 2000);
    }, 2000);
  }, [resolveRound]);

  const startRevealPhase = useCallback(() => {
    // Use setState to read current state to avoid stale closure issues
    setState(prev => {
      const holders = prev.players.filter(p => p.isActive && p.decision === 'hold');
      const droppers = prev.players.filter(p => p.isActive && p.decision === 'drop');

      // If everyone dropped - add ghost hand and go to summary
      if (holders.length === 0) {
        const newGhost: GhostHand = {
          id: `ghost-${Date.now()}`,
          cards: [deckRef.current.pop()!, deckRef.current.pop()!],
          cardsRevealed: 0,
        };
        return {
          ...prev,
          ghostHands: [...prev.ghostHands, newGhost],
          gamePhase: 'summary',
          roundResult: `Everyone dropped! Ghost hand #${prev.ghostHands.length + 1} joins the game!`,
        };
      }

      // If everyone held - add ghost hand, collect antes, deal new cards, new decision
      if (droppers.length === 0) {
        const newGhost: GhostHand = {
          id: `ghost-${Date.now()}`,
          cards: [deckRef.current.pop()!, deckRef.current.pop()!],
          cardsRevealed: 0,
        };
        const activeCount = prev.players.filter(p => p.isActive).length;

        // Reset deck for new cards
        deckRef.current = shuffleDeck(createDeck());

        countdownProcessedRef.current = false;
        return {
          ...prev,
          pot: prev.pot + activeCount,
          players: prev.players.map(player => {
            if (!player.isActive) {
              return player;
            }
            const cards = [deckRef.current.pop()!, deckRef.current.pop()!];
            return { ...player, cards, cardsRevealed: 0, decision: null, tokens: player.tokens - 1 };
          }),
          ghostHands: [...prev.ghostHands, newGhost].map(ghost => ({
            ...ghost,
            cards: [deckRef.current.pop()!, deckRef.current.pop()!],
            cardsRevealed: 0,
          })),
          gamePhase: 'decision',
          countdown: 3,
          roundResult: `Everyone held! Ghost hand #${prev.ghostHands.length + 1} added. New cards dealt!`,
        };
      }

      // Normal reveal: some held, some dropped - start reveal sequence
      return {
        ...prev,
        gamePhase: 'reveal',
      };
    });
  }, []);

  // Countdown effect
  useEffect(() => {
    if (state.gamePhase === 'decision' && state.countdown !== null) {
      if (state.countdown > 0) {
        countdownProcessedRef.current = false;
        const timer = setTimeout(() => {
          setState(prev => ({ ...prev, countdown: prev.countdown! - 1 }));
        }, 1000);
        return () => clearTimeout(timer);
      } else if (!countdownProcessedRef.current) {
        countdownProcessedRef.current = true;
        makeAIDecisions();
        // Set human to drop if no decision made
        setState(prev => ({
          ...prev,
          players: prev.players.map(p =>
            p.isHuman && !p.decision ? { ...p, decision: 'drop' } : p
          ),
        }));
        setTimeout(() => startRevealPhase(), 500);
      }
    }
  }, [state.countdown, state.gamePhase, makeAIDecisions, startRevealPhase]);

  // Reveal sequence effect - triggered when gamePhase becomes 'reveal'
  useEffect(() => {
    if (state.gamePhase === 'reveal') {
      runRevealSequence();
    }
  }, [state.gamePhase, runRevealSequence]);

  const nextRound = useCallback(() => {
    const activeCount = state.players.filter(p => p.isActive).length;
    if (activeCount < 2) {
      setState(prev => ({
        ...prev,
        gamePhase: 'start',
        roundResult: `Game Over! ${prev.players.find(p => p.isActive)?.name || 'Winner'} wins!`,
      }));
      return;
    }
    startRound();
  }, [state.players, startRound]);

  return {
    state,
    humanPlayer,
    activePlayers,
    startGame,
    makeHumanDecision,
    nextRound,
    playerCount,
    setPlayerCount,
  };
}
