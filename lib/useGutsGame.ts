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
import { RANK_VALUES, SUIT_VALUES } from './types';
import { AI_PROFILES, selectGameProfiles, getTrashTalk, loadProfileStats, saveProfileStats, loadHeartedProfiles, saveHeartedProfiles, incrementGamesPlayed as incrementProfileGamesPlayed, type AIProfile } from './profiles';
import { loadDifficulty, saveDifficulty, getDifficultyConfig, type Difficulty } from './difficulty';
import { updateStatsAfterRound, incrementGamesPlayed as incrementPlayerGames, type Achievement } from './stats';

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
  const suit1 = SUIT_VALUES[cards[0].suit];
  const suit2 = SUIT_VALUES[cards[1].suit];
  const ranks = [cards[0].rank, cards[1].rank];
  const isPair = cards[0].rank === cards[1].rank;

  // Determine high card and its suit for tiebreaker
  // If same rank, use higher suit
  let highCardSuit: number;
  if (val1 > val2) {
    highCardSuit = suit1;
  } else if (val2 > val1) {
    highCardSuit = suit2;
  } else {
    // Same rank - use higher suit
    highCardSuit = Math.max(suit1, suit2);
  }

  // Add suit as decimal for tiebreaking (0.01 to 0.04)
  const suitTiebreaker = highCardSuit * 0.01;

  // 6-9 is the BEST hand - "Six Nine" beats everything!
  const isSixNine = (ranks.includes('6') && ranks.includes('9'));

  if (isSixNine) {
    // For 6-9, use the higher suited card for tiebreaker
    return 2000 + Math.max(suit1, suit2) * 0.01;
  }
  if (isPair) {
    // For pairs, use higher suit among the pair for tiebreaker
    return 1000 + val1 + Math.max(suit1, suit2) * 0.01;
  }
  // High card - include suit tiebreaker
  return Math.max(val1, val2) * 15 + Math.min(val1, val2) + suitTiebreaker;
}

export function getHandDescription(cards: Card[]): string {
  if (cards.length !== 2) {
    return '';
  }

  const val1 = RANK_VALUES[cards[0].rank];
  const val2 = RANK_VALUES[cards[1].rank];
  const ranks = [cards[0].rank, cards[1].rank];
  const isPair = cards[0].rank === cards[1].rank;

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

  if (isSixNine) {
    return '★ SIX-NINE! ★';
  }
  if (isPair) {
    return `Pair of ${rankName(cards[0].rank)}s`;
  }
  // No flush bonus in GUTS - just show high card
  const highCard = val1 > val2 ? cards[0] : cards[1];
  const lowCard = val1 > val2 ? cards[1] : cards[0];
  return `High Card: ${rankName(highCard.rank)}, ${rankName(lowCard.rank)}`;
}

function calculateAIDecision(player: Player, difficulty: Difficulty): Decision {
  const config = getDifficultyConfig(difficulty);
  const handValue = getHandValue(player.cards);

  // Add some randomness based on difficulty (less accurate = more random mistakes)
  const accuracyRoll = Math.random();
  const makeMistake = accuracyRoll > config.aiAccuracy;

  let holdProbability = 0.1; // Default: very unlikely to hold garbage

  // Hand value ranges (for reference):
  // 6-9: 2000+ | Pairs: 1000-1014 | A-K: 223 | K-Q: 207 | Q-J: 191
  // J-10: 175 | 10-9: 159 | 9-8: 143 | 8-7: 127 | 7-6: 111
  // 6-5: 95 | 5-4: 79 | 4-3: 63 | 3-2: 47

  if (handValue >= 1000) {
    // Pairs or 6-9 - almost always hold
    holdProbability = 0.97;
  } else if (handValue >= 205) {
    // A-K, A-Q, K-Q - very strong high cards
    holdProbability = 0.80;
  } else if (handValue >= 175) {
    // Q-J, J-10 - solid hands
    holdProbability = 0.55;
  } else if (handValue >= 145) {
    // 10-9, 9-8 - mediocre, risky
    holdProbability = 0.30;
  } else if (handValue >= 110) {
    // 8-7, 7-6 - weak
    holdProbability = 0.15;
  } else {
    // Trash hands (below 7-high)
    holdProbability = 0.08;
    // Small bluff chance on garbage
    if (Math.random() < config.aiBluffChance) {
      holdProbability = 0.35;
    }
  }

  // Apply cautiousness modifier from difficulty
  holdProbability += config.aiCautiousness;

  // Personality modifiers - make them more impactful
  switch (player.personality) {
    case 'aggressive':
      // Aggressive players are reckless - hold more often
      holdProbability = Math.min(0.95, holdProbability + 0.25);
      break;
    case 'conservative':
      // Conservative players only play strong hands
      holdProbability = Math.max(0.05, holdProbability - 0.25);
      break;
    case 'random':
      // Chaotic - truly random but weighted slightly by hand
      holdProbability = 0.3 + Math.random() * 0.4;
      break;
    case 'tricky':
      // Mind games - reverse expectations
      if (handValue >= 175) {
        // Good hand? Sometimes drop to confuse
        holdProbability = Math.max(0.4, holdProbability - 0.2);
      } else {
        // Bad hand? Sometimes bluff
        holdProbability = Math.min(0.6, holdProbability + 0.2);
      }
      break;
  }

  // On easy mode, AI makes more mistakes (inverts good decisions)
  if (makeMistake) {
    holdProbability = 1 - holdProbability;
  }

  // Clamp to valid range
  holdProbability = Math.max(0.02, Math.min(0.98, holdProbability));

  return Math.random() < holdProbability ? 'hold' : 'drop';
}

// TODO: Future enhancement - fetch trending names from Google Trends API
// Use top names from sports, entertainment, politics etc. for AI opponents
// Example: GET /api/trending-names -> ["LeBron", "Taylor", "Elon", ...]

// Token amounts
const AI_STARTING_TOKENS = 500;
const HUMAN_DEFAULT_TOKENS = 500; // Will be overridden by user profile or guest tokens

function createInitialPlayers(playerCount: number = 5, currentProfileIds: string[] = []): Player[] {
  const players: Player[] = [];

  // Human player first (tokens will be synced from user profile or guest storage)
  players.push({
    id: 'player-0',
    name: 'You',
    tokens: HUMAN_DEFAULT_TOKENS,
    cards: [],
    isHuman: true,
    decision: null,
    personality: undefined,
    isActive: true,
    cardsRevealed: 0,
  });

  // AI players using profiles - pass current IDs for cycling logic
  const aiProfiles = selectGameProfiles(playerCount - 1, currentProfileIds);

  for (let i = 0; i < playerCount - 1; i++) {
    const profile = aiProfiles[i];
    players.push({
      id: `player-${i + 1}`,
      name: profile?.name || `Player ${i + 2}`,
      tokens: AI_STARTING_TOKENS,
      cards: [],
      isHuman: false,
      decision: null,
      personality: profile?.personality || 'random',
      isActive: true,
      cardsRevealed: 0,
      profileId: profile?.id,
      avatar: profile?.avatar,
      catchphrase: profile?.catchphrase,
      currentThought: profile ? getTrashTalk(profile, 'idle') : undefined,
    });
  }

  return players;
}

const initialState: GameState = {
  players: createInitialPlayers(),
  pot: 0,
  potWon: 0,
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
  const [difficulty, setDifficultyState] = useState<Difficulty>('normal');
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const deckRef = useRef<Card[]>([]);
  const countdownProcessedRef = useRef(false);
  const revealInProgressRef = useRef(false);
  const statsTrackedRef = useRef(false);

  // Load difficulty from storage on mount
  useEffect(() => {
    setDifficultyState(loadDifficulty());
  }, []);

  // Save difficulty when changed
  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d);
    saveDifficulty(d);
  }, []);

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
    statsTrackedRef.current = false;
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

    // Get current AI profile IDs for cycling logic
    const currentProfileIds = state.players
      .filter(p => !p.isHuman && p.profileId)
      .map(p => p.profileId!);

    setState({
      ...initialState,
      players: createInitialPlayers(count, currentProfileIds),
      gamePhase: 'start',
    });
    setTimeout(() => startRound(), 100);
  }, [startRound, playerCount, state.players]);

  const resetToStart = useCallback(() => {
    setState({
      ...initialState,
      players: createInitialPlayers(playerCount, []),
      gamePhase: 'start',
    });
  }, [playerCount]);

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
        return { ...player, decision: calculateAIDecision(player, difficulty) };
      }),
    }));
  }, [difficulty]);

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
        // No one held - pot stays for next round
        return {
          ...prev,
          potWon: 0,
          winners: [],
          losers: [],
          roundResult: 'Everyone dropped! Pot stays for next round.',
          gamePhase: 'summary',
        };
      }

      // Find the highest hand value (with suit tiebreaker, there's only one winner)
      const maxValue = Math.max(...allHands.map(h => h.value));
      const winner = allHands.find(h => h.value === maxValue)!;
      const losers = allHands.filter(h => h.value < maxValue);

      const ghostWon = winner.isGhost;
      const playerWon = !winner.isGhost;

      // Losers are all players who held but didn't win (ghosts don't pay)
      const loserIds = losers.filter(h => !h.isGhost).map(h => h.id);

      // Calculate what losers pay - they match the pot
      let loserPayments = 0;
      const newPlayers = prev.players.map(p => {
        if (loserIds.includes(p.id)) {
          // Loser matches the pot
          const tokensToLose = Math.min(p.tokens, prev.pot);
          loserPayments += tokensToLose;
          return {
            ...p,
            tokens: p.tokens - tokensToLose,
            isActive: p.tokens - tokensToLose > 0,
          };
        }
        if (p.id === winner.id && playerWon) {
          // Player won - takes the entire pot
          return { ...p, tokens: p.tokens + prev.pot };
        }
        return p;
      });

      // Determine new pot
      let newPot: number;
      let resultMessage: string;

      if (ghostWon) {
        // Ghost won - pot stays plus losers' payments
        newPot = prev.pot + loserPayments;
        const winningGhost = prev.ghostHands.find(g => g.id === winner.id);
        resultMessage = `👻 Ghost wins with ${getHandDescription(winningGhost?.cards || [])}! Pot stays at ${newPot}.`;
      } else {
        // Player won - they take pot, losers' payments become new pot
        newPot = loserPayments;
        const ghostCount = prev.ghostHands.length;
        if (ghostCount > 0) {
          resultMessage = `${winner.name} beats the ghost and wins ${prev.pot} tokens!`;
        } else {
          resultMessage = `${winner.name} wins ${prev.pot} tokens!`;
        }
        if (loserIds.length > 0) {
          resultMessage += ` Losers match the pot (${loserPayments} tokens).`;
        }
      }

      // Ghost hands clear only when a player wins
      const newGhostHands = playerWon ? [] : prev.ghostHands;

      return {
        ...prev,
        players: newPlayers,
        pot: newPot,
        potWon: playerWon ? prev.pot : 0,
        ghostHands: newGhostHands,
        winners: playerWon ? [winner.id] : [],
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
        setState(prev => {
          const updatedPlayers = prev.players.map(p =>
            p.isHuman && !p.decision ? { ...p, decision: 'drop' as Decision } : p
          );

          // Check if everyone held
          const activePlayers = updatedPlayers.filter(p => p.isActive);
          const everyoneHeld = activePlayers.every(p => p.decision === 'hold');

          if (everyoneHeld && activePlayers.length > 0) {
            // Everyone held! Add ghost hand and collect antes again
            const newGhost: GhostHand = {
              id: `ghost-${Date.now()}`,
              cards: [deckRef.current.pop()!, deckRef.current.pop()!],
              cardsRevealed: 0,
            };

            // Collect antes from all active players again
            const playersAfterAnte = updatedPlayers.map(p =>
              p.isActive ? { ...p, tokens: p.tokens - 1 } : p
            );
            const anteAmount = activePlayers.length;

            return {
              ...prev,
              players: playersAfterAnte,
              pot: prev.pot + anteAmount,
              ghostHands: [...prev.ghostHands, newGhost],
            };
          }

          return { ...prev, players: updatedPlayers };
        });

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

  // Heart a player profile
  const heartProfile = useCallback((profileId: string) => {
    const hearts = loadHeartedProfiles();
    const stats = loadProfileStats();

    // Toggle heart
    if (hearts.has(profileId)) {
      hearts.delete(profileId);
    } else {
      hearts.add(profileId);
      // Increment hearts received
      const current = stats.get(profileId) || { gamesPlayed: 0, heartsReceived: 0 };
      stats.set(profileId, { ...current, heartsReceived: current.heartsReceived + 1 });
      saveProfileStats(stats);
    }

    saveHeartedProfiles(hearts);
    // Force re-render by updating state
    setState(prev => ({ ...prev }));
  }, []);

  // Check if a profile is hearted
  const isProfileHearted = useCallback((profileId: string): boolean => {
    return loadHeartedProfiles().has(profileId);
  }, []);

  // Update player thought based on game events
  const updatePlayerThoughts = useCallback((situation: 'onGoodHand' | 'onBadHand' | 'onWin' | 'onLose' | 'onHold' | 'onDrop' | 'idle') => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(player => {
        if (player.isHuman || !player.profileId) return player;
        const profile = AI_PROFILES.find(p => p.id === player.profileId);
        if (!profile) return player;
        return { ...player, currentThought: getTrashTalk(profile, situation) };
      }),
    }));
  }, []);

  // Update thoughts when cards are dealt
  useEffect(() => {
    if (state.gamePhase === 'decision' && state.countdown === 3) {
      // Update thoughts based on hand quality
      setState(prev => ({
        ...prev,
        players: prev.players.map(player => {
          if (player.isHuman || !player.profileId || player.cards.length !== 2) return player;
          const profile = AI_PROFILES.find(p => p.id === player.profileId);
          if (!profile) return player;
          const handValue = getHandValue(player.cards);
          const situation = handValue > 500 ? 'onGoodHand' : 'onBadHand';
          return { ...player, currentThought: getTrashTalk(profile, situation) };
        }),
      }));
    }
  }, [state.gamePhase, state.countdown]);

  // Update thoughts when decisions are made
  useEffect(() => {
    if (state.gamePhase === 'reveal') {
      setState(prev => ({
        ...prev,
        players: prev.players.map(player => {
          if (player.isHuman || !player.profileId) return player;
          const profile = AI_PROFILES.find(p => p.id === player.profileId);
          if (!profile) return player;
          const situation = player.decision === 'hold' ? 'onHold' : 'onDrop';
          return { ...player, currentThought: getTrashTalk(profile, situation) };
        }),
      }));
    }
  }, [state.gamePhase]);

  // Update thoughts on win/lose, increment games played, and track player stats
  useEffect(() => {
    if (state.gamePhase === 'summary' && (state.winners.length > 0 || state.losers.length > 0)) {
      // Only track once per summary phase
      if (statsTrackedRef.current) return;
      statsTrackedRef.current = true;

      // Increment games played for all active AI profiles
      const activeProfileIds = state.players
        .filter(p => !p.isHuman && p.isActive && p.profileId)
        .map(p => p.profileId!);
      if (activeProfileIds.length > 0) {
        incrementProfileGamesPlayed(activeProfileIds);
      }

      // Track player stats
      const human = state.players.find(p => p.isHuman);
      if (human) {
        const won = state.winners.includes(human.id);
        const lost = state.losers.includes(human.id);
        const handValue = getHandValue(human.cards);
        const handDesc = getHandDescription(human.cards);
        const isSixNine = handDesc.includes('SIX-NINE');
        const defeatedGhost = won && state.roundResult.includes('ghost');
        const lostToGhost = lost && state.roundResult.includes('Ghost wins');

        // Calculate tokens change (approximate based on pot)
        const tokensChange = won ? state.pot : lost ? -state.pot : 0;

        const unlocked = updateStatsAfterRound(
          won,
          tokensChange,
          state.pot,
          handDesc,
          handValue,
          isSixNine,
          defeatedGhost,
          lostToGhost
        );

        if (unlocked.length > 0) {
          setNewAchievements(unlocked);
        }
      }

      setState(prev => ({
        ...prev,
        players: prev.players.map(player => {
          if (player.isHuman || !player.profileId) return player;
          const profile = AI_PROFILES.find(p => p.id === player.profileId);
          if (!profile) return player;
          let situation: 'onWin' | 'onLose' | 'idle' = 'idle';
          if (prev.winners.includes(player.id)) situation = 'onWin';
          else if (prev.losers.includes(player.id)) situation = 'onLose';
          return { ...player, currentThought: getTrashTalk(profile, situation) };
        }),
      }));
    }
  }, [state.gamePhase, state.winners, state.losers, state.players, state.pot, state.roundResult]);

  // Clear new achievements after they're shown
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Set human player tokens (for syncing with user account)
  const setHumanTokens = useCallback((tokens: number) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.isHuman ? { ...player, tokens } : player
      ),
    }));
  }, []);

  return {
    state,
    humanPlayer,
    activePlayers,
    startGame,
    resetToStart,
    makeHumanDecision,
    nextRound,
    playerCount,
    setPlayerCount,
    heartProfile,
    isProfileHearted,
    difficulty,
    setDifficulty,
    newAchievements,
    clearNewAchievements,
    setHumanTokens,
  };
}
