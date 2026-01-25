// Pause Token System for GUTS
// Allows players to pause during decision phase to think, use power-ups, taunt, etc.

const STORAGE_KEY = 'guts_pause_tokens';
const PAUSE_DURATION = 15; // seconds

export interface PauseTokenState {
  tokens: number;
  totalWinsAtLastReward: number; // Track wins for earning tokens
  lifetimeEarned: number;
  lifetimeUsed: number;
}

function getDefaultState(): PauseTokenState {
  return {
    tokens: 1, // Start with 1 pause token
    totalWinsAtLastReward: 0,
    lifetimeEarned: 1,
    lifetimeUsed: 0,
  };
}

export function loadPauseTokens(): PauseTokenState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...getDefaultState(), ...JSON.parse(data) } : getDefaultState();
  } catch {
    return getDefaultState();
  }
}

export function savePauseTokens(state: PauseTokenState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save pause tokens:', e);
  }
}

// Consume a pause token
export function consumePauseToken(): boolean {
  const state = loadPauseTokens();
  if (state.tokens <= 0) return false;

  state.tokens -= 1;
  state.lifetimeUsed += 1;
  savePauseTokens(state);
  return true;
}

// Check if player earned a new pause token (every 5 wins)
export function checkPauseTokenReward(totalWins: number): { earned: boolean; newTotal: number } {
  const state = loadPauseTokens();
  const winsSinceLastReward = totalWins - state.totalWinsAtLastReward;

  if (winsSinceLastReward >= 5) {
    const tokensToAward = Math.floor(winsSinceLastReward / 5);
    state.tokens += tokensToAward;
    state.lifetimeEarned += tokensToAward;
    state.totalWinsAtLastReward = totalWins - (winsSinceLastReward % 5);
    savePauseTokens(state);
    return { earned: true, newTotal: state.tokens };
  }

  return { earned: false, newTotal: state.tokens };
}

// Add pause tokens (from purchase or reward)
export function addPauseTokens(amount: number): number {
  const state = loadPauseTokens();
  state.tokens += amount;
  state.lifetimeEarned += amount;
  savePauseTokens(state);
  return state.tokens;
}

// Get current pause token count
export function getPauseTokenCount(): number {
  return loadPauseTokens().tokens;
}

// Get pause duration
export function getPauseDuration(): number {
  return PAUSE_DURATION;
}

// Pause token shop items
export const PAUSE_TOKEN_SHOP = [
  {
    id: 'pause_1',
    name: 'Pause Token',
    description: '1 pause token - 15 seconds to think',
    price: 50,
    amount: 1,
    icon: '⏸️',
  },
  {
    id: 'pause_3',
    name: 'Pause Pack (3)',
    description: '3 pause tokens',
    price: 120,
    amount: 3,
    icon: '⏸️',
    savings: '20%',
  },
  {
    id: 'pause_10',
    name: 'Pause Bundle (10)',
    description: '10 pause tokens - best value!',
    price: 350,
    amount: 10,
    icon: '⏸️',
    savings: '30%',
  },
];
