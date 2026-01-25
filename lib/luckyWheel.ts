// Lucky Wheel System - Spin after wins for bonuses

export interface WheelSegment {
  id: string;
  label: string;
  icon: string;
  color: string;
  reward: WheelReward;
  weight: number; // Higher = more likely
}

export interface WheelReward {
  type: 'tokens' | 'power_up' | 'item' | 'multiplier' | 'pause_token' | 'nothing';
  value: number | string; // Token amount, item ID, or multiplier
  displayValue: string;
}

export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'tokens_10', label: '10', icon: '🪙', color: '#fbbf24', reward: { type: 'tokens', value: 10, displayValue: '+10 Tokens' }, weight: 22 },
  { id: 'tokens_25', label: '25', icon: '🪙', color: '#f59e0b', reward: { type: 'tokens', value: 25, displayValue: '+25 Tokens' }, weight: 18 },
  { id: 'tokens_50', label: '50', icon: '💰', color: '#d97706', reward: { type: 'tokens', value: 50, displayValue: '+50 Tokens' }, weight: 10 },
  { id: 'tokens_100', label: '100', icon: '💎', color: '#22c55e', reward: { type: 'tokens', value: 100, displayValue: '+100 Tokens' }, weight: 5 },
  { id: 'power_peek', label: 'PEEK', icon: '👁️', color: '#3b82f6', reward: { type: 'power_up', value: 'peek', displayValue: 'Ghost Peek!' }, weight: 12 },
  { id: 'power_shield', label: 'SHIELD', icon: '🛡️', color: '#8b5cf6', reward: { type: 'power_up', value: 'shield', displayValue: 'Shield!' }, weight: 10 },
  { id: 'pause_token', label: 'PAUSE', icon: '⏸️', color: '#a855f7', reward: { type: 'pause_token', value: 1, displayValue: '+1 Pause Token!' }, weight: 8 },
  { id: 'multiplier_2x', label: '2X', icon: '✨', color: '#ec4899', reward: { type: 'multiplier', value: 2, displayValue: '2x Next Win!' }, weight: 8 },
  { id: 'nothing', label: 'TRY AGAIN', icon: '😢', color: '#64748b', reward: { type: 'nothing', value: 0, displayValue: 'Nothing...' }, weight: 7 },
];

export interface WheelState {
  spinsAvailable: number;
  lastSpinDate: string;
  totalSpins: number;
  winsUntilSpin: number; // Wins needed for next spin
  activeMultiplier: number;
}

const WHEEL_KEY = 'guts_wheel';
const WINS_PER_SPIN = 5;

export function loadWheelState(): WheelState {
  if (typeof window === 'undefined') {
    return { spinsAvailable: 0, lastSpinDate: '', totalSpins: 0, winsUntilSpin: WINS_PER_SPIN, activeMultiplier: 1 };
  }
  try {
    const data = localStorage.getItem(WHEEL_KEY);
    const defaultState = { spinsAvailable: 0, lastSpinDate: '', totalSpins: 0, winsUntilSpin: WINS_PER_SPIN, activeMultiplier: 1 };
    return data ? { ...defaultState, ...JSON.parse(data) } : defaultState;
  } catch {
    return { spinsAvailable: 0, lastSpinDate: '', totalSpins: 0, winsUntilSpin: WINS_PER_SPIN, activeMultiplier: 1 };
  }
}

export function saveWheelState(state: WheelState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WHEEL_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save wheel state:', e);
  }
}

export function recordWinForWheel(): { earnedSpin: boolean; state: WheelState } {
  const state = loadWheelState();
  state.winsUntilSpin -= 1;

  if (state.winsUntilSpin <= 0) {
    state.spinsAvailable += 1;
    state.winsUntilSpin = WINS_PER_SPIN;
    saveWheelState(state);
    return { earnedSpin: true, state };
  }

  saveWheelState(state);
  return { earnedSpin: false, state };
}

export function spinWheel(): { segment: WheelSegment; state: WheelState } | null {
  const state = loadWheelState();

  if (state.spinsAvailable <= 0) return null;

  // Weighted random selection
  const totalWeight = WHEEL_SEGMENTS.reduce((sum, seg) => sum + seg.weight, 0);
  let random = Math.random() * totalWeight;

  let selectedSegment = WHEEL_SEGMENTS[0];
  for (const segment of WHEEL_SEGMENTS) {
    random -= segment.weight;
    if (random <= 0) {
      selectedSegment = segment;
      break;
    }
  }

  state.spinsAvailable -= 1;
  state.totalSpins += 1;
  state.lastSpinDate = new Date().toISOString();

  // Apply multiplier if won
  if (selectedSegment.reward.type === 'multiplier') {
    state.activeMultiplier = selectedSegment.reward.value as number;
  }

  saveWheelState(state);
  return { segment: selectedSegment, state };
}

export function useMultiplier(): { multiplier: number; state: WheelState } {
  const state = loadWheelState();
  const multiplier = state.activeMultiplier;
  state.activeMultiplier = 1;
  saveWheelState(state);
  return { multiplier, state };
}

export function addFreeSpin(): WheelState {
  const state = loadWheelState();
  state.spinsAvailable += 1;
  saveWheelState(state);
  return state;
}
