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
  const isPair = cards[0].rank === cards[1].rank;
  const isFlush = cards[0].suit === cards[1].suit;

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
  const isPair = cards[0].rank === cards[1].rank;
  const isFlush = cards[0].suit === cards[1].suit;

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
  const deckRef = useRef<Card[]>([]);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const createGhostHand = useCallback(() => {
    const newGhost: GhostHand = {
      id: `ghost-${Date.now()}`,
      cards: [deckRef.current.pop()!, deckRef.current.pop()!],
      cardsRevealed: 0,
    };

    setState(prev => ({
      ...prev,
      ghostHands: [...prev.ghostHands, newGhost],
      roundResult: `Everyone dropped! Ghost hand #${prev.ghostHands.length + 1} joins the game!`,
    }));
  }, []);

  const revealNextCard = useCallback(() => {
    setState(prev => {
      const holders = prev.players.filter(p => p.isActive && p.decision === 'hold');
      const totalRevealTargets = holders.length + prev.ghostHands.length;

      if (totalRevealTargets === 0) {
        return { ...prev, revealState: { ...prev.revealState, isRevealing: false } };
      }

      let { currentPlayerIndex, currentCardIndex } = prev.revealState;

      // Determine what we're revealing
      const isGhost = currentPlayerIndex >= holders.length;
      const targetIndex = isGhost ? currentPlayerIndex - holders.length : currentPlayerIndex;

      // Update the revealed cards
      let newPlayers = [...prev.players];
      const newGhostHands = [...prev.ghostHands];

      if (!isGhost && holders[targetIndex]) {
        const holderId = holders[targetIndex].id;
        newPlayers = newPlayers.map(p =>
          p.id === holderId ? { ...p, cardsRevealed: currentCardIndex + 1 } : p
        );
      } else if (isGhost && newGhostHands[targetIndex]) {
        newGhostHands[targetIndex] = {
          ...newGhostHands[targetIndex],
          cardsRevealed: currentCardIndex + 1,
        };
      }

      // Move to next card/player
      currentCardIndex++;
      if (currentCardIndex >= 2) {
        currentCardIndex = 0;
        currentPlayerIndex++;
      }

      const isComplete = currentPlayerIndex >= totalRevealTargets;

      return {
        ...prev,
        players: newPlayers,
        ghostHands: newGhostHands,
        revealState: {
          currentPlayerIndex,
          currentCardIndex,
          isRevealing: !isComplete,
        },
      };
    });
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

      // Find winner(s)
      const maxValue = Math.max(...allHands.map(h => h.value));
      const winningHands = allHands.filter(h => h.value === maxValue);
      const losingHands = allHands.filter(h => h.value < maxValue);

      const winnerIds = winningHands.map(h => h.id);
      const loserIds = losingHands.filter(h => !h.isGhost).map(h => h.id);

      const ghostWon = winningHands.some(h => h.isGhost);
      const playerWon = winningHands.some(h => !h.isGhost);

      let newPot = 0;
      const newPlayers = prev.players.map(p => {
        if (loserIds.includes(p.id)) {
          const tokensToLose = Math.min(p.tokens, prev.pot);
          newPot += tokensToLose;
          return { ...p, tokens: p.tokens - tokensToLose, isActive: p.tokens - tokensToLose > 0 };
        }
        if (winnerIds.includes(p.id) && !ghostWon) {
          const share = Math.floor(prev.pot / winningHands.filter(h => !h.isGhost).length);
          return { ...p, tokens: p.tokens + share };
        }
        return p;
      });

      // Clear ghost hands if player won
      const newGhostHands = playerWon && !ghostWon ? [] : prev.ghostHands;

      // Build result message
      let resultMessage = '';
      if (ghostWon && !playerWon) {
        resultMessage = `Ghost hand wins with ${getHandDescription(prev.ghostHands.find(g => winnerIds.includes(g.id))?.cards || [])}! Pot stays at ${prev.pot + newPot} tokens.`;
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
        pot: ghostWon && !playerWon ? newPot : newPot,
        ghostHands: newGhostHands,
        winners: winnerIds,
        losers: loserIds,
        roundResult: resultMessage,
        gamePhase: 'summary',
      };
    });
  }, []);

  const startRevealPhase = useCallback(() => {
    const holders = state.players.filter(p => p.isActive && p.decision === 'hold');

    if (holders.length === 0 && state.ghostHands.length === 0) {
      createGhostHand();
      setState(prev => ({ ...prev, gamePhase: 'summary' }));
      return;
    }

    if (holders.length === 0) {
      createGhostHand();
      setState(prev => ({ ...prev, gamePhase: 'summary' }));
      return;
    }

    setState(prev => ({
      ...prev,
      gamePhase: 'reveal',
      revealState: {
        currentPlayerIndex: 0,
        currentCardIndex: 0,
        isRevealing: true,
      },
    }));
  }, [state.players, state.ghostHands.length, createGhostHand]);

  // Countdown effect
  useEffect(() => {
    if (state.gamePhase === 'decision' && state.countdown !== null) {
      if (state.countdown > 0) {
        const timer = setTimeout(() => {
          setState(prev => ({ ...prev, countdown: prev.countdown! - 1 }));
        }, 1000);
        return () => clearTimeout(timer);
      } else {
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

  // Reveal animation effect
  useEffect(() => {
    if (state.gamePhase === 'reveal' && state.revealState.isRevealing) {
      revealTimeoutRef.current = setTimeout(() => {
        revealNextCard();
      }, 800);
      return () => {
        if (revealTimeoutRef.current) {
          clearTimeout(revealTimeoutRef.current);
        }
      };
    } else if (state.gamePhase === 'reveal' && !state.revealState.isRevealing) {
      setTimeout(() => resolveRound(), 500);
    }
  }, [
    state.gamePhase,
    state.revealState.isRevealing,
    state.revealState.currentPlayerIndex,
    state.revealState.currentCardIndex,
    revealNextCard,
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
