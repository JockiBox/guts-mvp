export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type Personality = 'aggressive' | 'conservative' | 'random' | 'tricky';
export type Decision = 'hold' | 'drop' | null;
export type GamePhase = 'start' | 'decision' | 'reveal' | 'summary';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Player {
  id: string;
  name: string;
  tokens: number;
  cards: Card[];
  isHuman: boolean;
  decision: Decision;
  personality?: Personality;
  isActive: boolean;
  cardsRevealed: number;
  hasThirdCard?: boolean; // Player has 3 cards and needs to drop one
  // Profile fields for AI players
  profileId?: string;
  avatar?: string;
  catchphrase?: string;
  currentThought?: string; // Current speech bubble text
  heartsReceived?: number; // Total hearts this bot has received
  experienceLevel?: number; // Level based on hearts (0-10)
  levelBadge?: string; // Visual badge for level
}

export interface GhostHand {
  id: string;
  cards: Card[];
  cardsRevealed: number;
}

export interface RevealState {
  currentPlayerIndex: number;
  currentCardIndex: number;
  isRevealing: boolean;
}

export interface GameState {
  players: Player[];
  pot: number;
  potWon: number; // Amount won in the last round (for tracking)
  gamePhase: GamePhase;
  countdown: number | null;
  ghostHands: GhostHand[];
  roundResult: string;
  revealState: RevealState;
  winners: string[];
  losers: string[];
  roundNumber: number;
}

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '\u2665',
  diamonds: '\u2666',
  clubs: '\u2663',
  spades: '\u2660',
};

// Suit ranking for tiebreakers: Spades > Diamonds > Hearts > Clubs
export const SUIT_VALUES: Record<Suit, number> = {
  spades: 4,
  diamonds: 3,
  hearts: 2,
  clubs: 1,
};
