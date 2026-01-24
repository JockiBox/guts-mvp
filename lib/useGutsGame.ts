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

function createInitialPlayers(): Player[] {
  const personalities: Personality[] = ['aggressive', 'conservative', 'random', 'tricky'];
  const names = ['You', 'Alpha', 'Beta', 'Gamma', 'Delta'];

  return names.map((name, index) => ({
    id: `player-${index}`,
    name,
    tokens: 100,
    cards: [],
    isHuman: index === 0,
    decision: null,
    personality: index === 0 ? undefined : personalities[index - 1],
    isActive: true,
    cardsRevealed: 0,
  }));
}

// Reveal phases: 'waiting' -> 'reveal-players' -> 'reveal-ghost-delay' -> 'reveal-ghosts' -> done
type RevealPhase = 'waiting' | 'reveal-players' | 'reveal-ghost-delay' | 'reveal-ghosts';

interface ExtendedRevealState {
  currentPlayerIndex: number;
  currentCardIndex: number;
  isRevealing: boolean;
  revealPhase: RevealPhase;
  ghostCardIndex: number; // which ghost card we're on (0 = first card of first ghost, etc.)
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
  const [revealPhase, setRevealPhase] = useState<RevealPhase>('waiting');
  const [ghostCardIndex, setGhostCardIndex] = useState(0);
  const deckRef = useRef<Card[]>([]);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownProcessedRef = useRef(false);
  const revealCompleteProcessedRef = useRef(false);
  const phaseProcessedRef = useRef(false);

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
    revealCompleteProcessedRef.current = false;
    phaseProcessedRef.current = false;
    setRevealPhase('waiting');
    setGhostCardIndex(0);
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

  const startGame = useCallback(() => {
    setState({
      ...initialState,
      players: createInitialPlayers(),
      gamePhase: 'start',
    });
    setTimeout(() => startRound(), 100);
  }, [startRound]);

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

      // Calculate all hand values
      const playerHands = holders.map(p => ({
        id: p.id,
        name: p.name,
        value: getHandValue(p.cards),
        isGhost: false,
      }));

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

      // Find winner(s) - must beat ALL hands including ghosts
      const maxValue = Math.max(...allHands.map(h => h.value));
      const winningHands = allHands.filter(h => h.value === maxValue);
      const losingHands = allHands.filter(h => h.value < maxValue);

      const winnerIds = winningHands.map(h => h.id);
      const loserIds = losingHands.filter(h => !h.isGhost).map(h => h.id);

      const ghostWon = winningHands.some(h => h.isGhost);
      const playerWon = winningHands.some(h => !h.isGhost);

      // Check if any player lost to a ghost hand
      const playerLostToGhost = ghostWon && loserIds.length > 0;

      let newPot = 0;
      const newPlayers = prev.players.map(p => {
        if (loserIds.includes(p.id)) {
          // If lost to ghost hand, DOUBLE the pot; otherwise match it
          const multiplier = playerLostToGhost ? 2 : 1;
          const tokensToLose = Math.min(p.tokens, prev.pot * multiplier);
          newPot += tokensToLose;
          return { ...p, tokens: p.tokens - tokensToLose, isActive: p.tokens - tokensToLose > 0 };
        }
        if (winnerIds.includes(p.id) && !ghostWon) {
          // Player won - takes the pot (split if multiple winners)
          const playerWinners = winningHands.filter(h => !h.isGhost).length;
          const share = Math.floor(prev.pot / playerWinners);
          return { ...p, tokens: p.tokens + share };
        }
        return p;
      });

      // Clear ghost hands only if a player won outright (beat everyone including ghosts)
      const newGhostHands = playerWon && !ghostWon ? [] : prev.ghostHands;

      // Build result message
      let resultMessage = '';
      if (ghostWon && !playerWon) {
        const winningGhost = prev.ghostHands.find(g => winnerIds.includes(g.id));
        resultMessage = `Ghost hand wins with ${getHandDescription(winningGhost?.cards || [])}! Losers DOUBLE the pot!`;
        newPot = prev.pot + newPot;
      } else if (ghostWon && playerWon) {
        // Tie between ghost and player - ghost wins ties, pot stays
        resultMessage = `Tie with Ghost! Pot stays at ${prev.pot + newPot} tokens.`;
        newPot = prev.pot + newPot;
      } else if (playerWon) {
        const winnerNames = winningHands
          .filter(h => !h.isGhost)
          .map(h => h.name)
          .join(' & ');
        resultMessage = `${winnerNames} wins ${prev.pot} tokens!`;
        if (losingHands.length > 0) {
          resultMessage += ` Losers match the pot.`;
        }
      }

      return {
        ...prev,
        players: newPlayers,
        pot: ghostWon ? newPot : newPot,
        ghostHands: newGhostHands,
        winners: winnerIds,
        losers: loserIds,
        roundResult: resultMessage,
        gamePhase: 'summary',
      };
    });
  }, []);

  // Reveal all player cards at once
  const revealAllPlayerCards = useCallback(() => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.isActive && p.decision === 'hold' ? { ...p, cardsRevealed: 2 } : p
      ),
    }));
  }, []);

  // Reveal next ghost card (one at a time)
  const revealNextGhostCard = useCallback(() => {
    setState(prev => {
      const totalGhostCards = prev.ghostHands.length * 2;

      if (ghostCardIndex >= totalGhostCards) {
        return prev;
      }

      const ghostIndex = Math.floor(ghostCardIndex / 2);
      const cardIndex = (ghostCardIndex % 2) + 1;

      const newGhostHands = prev.ghostHands.map((ghost, idx) => {
        if (idx === ghostIndex) {
          return { ...ghost, cardsRevealed: cardIndex };
        }
        if (idx < ghostIndex) {
          return { ...ghost, cardsRevealed: 2 };
        }
        return ghost;
      });

      return {
        ...prev,
        ghostHands: newGhostHands,
      };
    });

    setGhostCardIndex(prev => prev + 1);
  }, [ghostCardIndex]);

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

      // Normal reveal: some held, some dropped
      setRevealPhase('waiting');
      setGhostCardIndex(0);
      phaseProcessedRef.current = false;
      return {
        ...prev,
        gamePhase: 'reveal',
        revealState: {
          currentPlayerIndex: 0,
          currentCardIndex: 0,
          isRevealing: true,
        },
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

  // New reveal sequence effect
  useEffect(() => {
    if (state.gamePhase !== 'reveal') {
      return;
    }

    const holders = state.players.filter(p => p.isActive && p.decision === 'hold');
    const totalGhostCards = state.ghostHands.length * 2;

    if (revealPhase === 'waiting' && !phaseProcessedRef.current) {
      phaseProcessedRef.current = true;
      // 2 second delay before revealing player cards
      revealTimeoutRef.current = setTimeout(() => {
        setRevealPhase('reveal-players');
        phaseProcessedRef.current = false;
      }, 2000);
      return () => {
        if (revealTimeoutRef.current) {
          clearTimeout(revealTimeoutRef.current);
        }
      };
    }

    if (revealPhase === 'reveal-players' && !phaseProcessedRef.current) {
      phaseProcessedRef.current = true;
      // Reveal all player cards at once
      revealAllPlayerCards();

      // 2 second delay before ghost cards (or resolve if no ghosts)
      revealTimeoutRef.current = setTimeout(() => {
        if (state.ghostHands.length > 0) {
          setRevealPhase('reveal-ghost-delay');
        } else {
          resolveRound();
        }
        phaseProcessedRef.current = false;
      }, 2000);
      return () => {
        if (revealTimeoutRef.current) {
          clearTimeout(revealTimeoutRef.current);
        }
      };
    }

    if (revealPhase === 'reveal-ghost-delay' && !phaseProcessedRef.current) {
      phaseProcessedRef.current = true;
      // Start revealing ghost cards
      revealTimeoutRef.current = setTimeout(() => {
        setRevealPhase('reveal-ghosts');
        phaseProcessedRef.current = false;
      }, 500);
      return () => {
        if (revealTimeoutRef.current) {
          clearTimeout(revealTimeoutRef.current);
        }
      };
    }

    if (revealPhase === 'reveal-ghosts') {
      if (ghostCardIndex < totalGhostCards) {
        // Reveal next ghost card
        revealTimeoutRef.current = setTimeout(() => {
          revealNextGhostCard();
        }, 800);
        return () => {
          if (revealTimeoutRef.current) {
            clearTimeout(revealTimeoutRef.current);
          }
        };
      } else if (!revealCompleteProcessedRef.current) {
        // All ghost cards revealed, resolve round
        revealCompleteProcessedRef.current = true;
        setTimeout(() => resolveRound(), 1000);
      }
    }
  }, [
    state.gamePhase,
    state.ghostHands.length,
    state.players,
    revealPhase,
    ghostCardIndex,
    revealAllPlayerCards,
    revealNextGhostCard,
    resolveRound,
  ]);

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
  };
}
