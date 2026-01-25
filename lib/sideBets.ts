// Side Bets System for GUTS

export interface SideBet {
  type: SideBetType;
  amount: number;
  targetPlayerId?: string; // For 'player_wins' bet
  prediction?: string; // For various predictions
}

export type SideBetType =
  | 'ghost_wins'     // Bet that a ghost will win
  | 'no_ghost'       // Bet that no ghost appears
  | 'all_hold'       // Bet everyone holds
  | 'all_drop'       // Bet everyone drops (except you)
  | 'player_wins'    // Bet on specific player winning
  | 'pair_wins'      // Bet that winning hand is a pair
  | 'high_card'      // Bet winning hand is high card only

export interface SideBetOption {
  type: SideBetType;
  name: string;
  description: string;
  icon: string;
  minBet: number;
  maxBet: number;
  payout: number; // Multiplier (e.g., 2 = 2x)
}

export const SIDE_BET_OPTIONS: SideBetOption[] = [
  {
    type: 'ghost_wins',
    name: 'Ghost Victory',
    description: 'Bet that a ghost hand wins this round',
    icon: '👻',
    minBet: 5,
    maxBet: 50,
    payout: 3,
  },
  {
    type: 'no_ghost',
    name: 'No Ghosts',
    description: 'Bet that no ghost hand appears',
    icon: '🚫',
    minBet: 5,
    maxBet: 30,
    payout: 1.5,
  },
  {
    type: 'all_hold',
    name: 'Everyone Holds',
    description: 'Bet that all players hold',
    icon: '💪',
    minBet: 10,
    maxBet: 50,
    payout: 4,
  },
  {
    type: 'pair_wins',
    name: 'Pair Wins',
    description: 'Bet the winning hand is a pair',
    icon: '✌️',
    minBet: 5,
    maxBet: 40,
    payout: 2.5,
  },
  {
    type: 'high_card',
    name: 'High Card Only',
    description: 'Bet winning hand is just high card (no pair)',
    icon: '🃏',
    minBet: 5,
    maxBet: 30,
    payout: 1.3,
  },
];

export interface ActiveSideBets {
  bets: SideBet[];
  totalWagered: number;
}

export function placeSideBet(
  currentBets: ActiveSideBets,
  newBet: SideBet,
  playerTokens: number
): { success: boolean; updatedBets: ActiveSideBets; newTokens: number; error?: string } {
  const option = SIDE_BET_OPTIONS.find(o => o.type === newBet.type);
  if (!option) {
    return { success: false, updatedBets: currentBets, newTokens: playerTokens, error: 'Invalid bet type' };
  }

  if (newBet.amount < option.minBet) {
    return { success: false, updatedBets: currentBets, newTokens: playerTokens, error: `Minimum bet is ${option.minBet}` };
  }

  if (newBet.amount > option.maxBet) {
    return { success: false, updatedBets: currentBets, newTokens: playerTokens, error: `Maximum bet is ${option.maxBet}` };
  }

  if (playerTokens < newBet.amount) {
    return { success: false, updatedBets: currentBets, newTokens: playerTokens, error: 'Not enough tokens' };
  }

  // Check if already has this bet type
  if (currentBets.bets.some(b => b.type === newBet.type)) {
    return { success: false, updatedBets: currentBets, newTokens: playerTokens, error: 'Already placed this bet' };
  }

  // Max 2 side bets per round
  if (currentBets.bets.length >= 2) {
    return { success: false, updatedBets: currentBets, newTokens: playerTokens, error: 'Max 2 side bets per round' };
  }

  const updatedBets: ActiveSideBets = {
    bets: [...currentBets.bets, newBet],
    totalWagered: currentBets.totalWagered + newBet.amount,
  };

  return {
    success: true,
    updatedBets,
    newTokens: playerTokens - newBet.amount,
  };
}

export interface SideBetResult {
  bet: SideBet;
  won: boolean;
  payout: number;
}

export function resolveSideBets(
  bets: ActiveSideBets,
  roundResult: {
    ghostWon: boolean;
    ghostAppeared: boolean;
    allHeld: boolean;
    winningHandIsPair: boolean;
    winnerId?: string;
  }
): SideBetResult[] {
  const results: SideBetResult[] = [];

  for (const bet of bets.bets) {
    const option = SIDE_BET_OPTIONS.find(o => o.type === bet.type);
    if (!option) continue;

    let won = false;

    switch (bet.type) {
      case 'ghost_wins':
        won = roundResult.ghostWon;
        break;
      case 'no_ghost':
        won = !roundResult.ghostAppeared;
        break;
      case 'all_hold':
        won = roundResult.allHeld;
        break;
      case 'pair_wins':
        won = roundResult.winningHandIsPair;
        break;
      case 'high_card':
        won = !roundResult.winningHandIsPair && !roundResult.ghostWon;
        break;
      case 'player_wins':
        won = bet.targetPlayerId === roundResult.winnerId;
        break;
    }

    results.push({
      bet,
      won,
      payout: won ? Math.floor(bet.amount * option.payout) : 0,
    });
  }

  return results;
}

export function calculateTotalWinnings(results: SideBetResult[]): number {
  return results.reduce((sum, r) => sum + r.payout, 0);
}

export function getEmptyBets(): ActiveSideBets {
  return { bets: [], totalWagered: 0 };
}
