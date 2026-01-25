// Lucky Numbers System - Personal lucky number gives bonus when it appears

export interface LuckyNumberState {
  luckyNumber: number | null; // 2-14 (card values)
  timesAppeared: number;
  timesWonWith: number;
  bonusesEarned: number;
  lastAppearance: string;
}

const LUCKY_KEY = 'guts_lucky_number';
const LUCKY_BONUS = 5; // Bonus tokens when lucky number appears and you win

export function loadLuckyNumberState(): LuckyNumberState {
  if (typeof window === 'undefined') {
    return { luckyNumber: null, timesAppeared: 0, timesWonWith: 0, bonusesEarned: 0, lastAppearance: '' };
  }
  try {
    const data = localStorage.getItem(LUCKY_KEY);
    return data ? JSON.parse(data) : { luckyNumber: null, timesAppeared: 0, timesWonWith: 0, bonusesEarned: 0, lastAppearance: '' };
  } catch {
    return { luckyNumber: null, timesAppeared: 0, timesWonWith: 0, bonusesEarned: 0, lastAppearance: '' };
  }
}

export function saveLuckyNumberState(state: LuckyNumberState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LUCKY_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save lucky number:', e);
  }
}

export function setLuckyNumber(num: number): LuckyNumberState {
  if (num < 2 || num > 14) {
    return loadLuckyNumberState();
  }

  const state = loadLuckyNumberState();
  state.luckyNumber = num;
  // Reset stats when changing lucky number
  state.timesAppeared = 0;
  state.timesWonWith = 0;
  state.bonusesEarned = 0;
  saveLuckyNumberState(state);
  return state;
}

export function getLuckyNumber(): number | null {
  return loadLuckyNumberState().luckyNumber;
}

// Card rank to number value mapping
const RANK_TO_NUMBER: Record<string, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

export function numberToRank(num: number): string {
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return ranks[num - 2] || '?';
}

export function rankToNumber(rank: string): number {
  return RANK_TO_NUMBER[rank] || 0;
}

export function checkLuckyNumber(cards: { rank: string }[], won: boolean): { appeared: boolean; bonus: number; state: LuckyNumberState } {
  const state = loadLuckyNumberState();

  if (!state.luckyNumber) {
    return { appeared: false, bonus: 0, state };
  }

  const cardNumbers = cards.map(c => rankToNumber(c.rank));
  const appeared = cardNumbers.includes(state.luckyNumber);

  if (appeared) {
    state.timesAppeared += 1;
    state.lastAppearance = new Date().toISOString();

    if (won) {
      state.timesWonWith += 1;
      state.bonusesEarned += LUCKY_BONUS;
      saveLuckyNumberState(state);
      return { appeared: true, bonus: LUCKY_BONUS, state };
    }
  }

  saveLuckyNumberState(state);
  return { appeared, bonus: 0, state };
}

export function getLuckyNumberStats(): { winRate: number; appearances: number } {
  const state = loadLuckyNumberState();
  if (state.timesAppeared === 0) {
    return { winRate: 0, appearances: 0 };
  }
  return {
    winRate: Math.round((state.timesWonWith / state.timesAppeared) * 100),
    appearances: state.timesAppeared,
  };
}

// Fun display names for lucky numbers
export const LUCKY_NUMBER_NAMES: Record<number, string> = {
  2: 'Deuce',
  3: 'Trey',
  4: 'Four-Leaf',
  5: 'High Five',
  6: 'Lucky Six',
  7: 'Lucky Seven',
  8: 'Infinity',
  9: 'Cloud Nine',
  10: 'Perfect Ten',
  11: 'Jack\'s Luck',
  12: 'Queen\'s Favor',
  13: 'King\'s Fortune',
  14: 'Ace High',
};
