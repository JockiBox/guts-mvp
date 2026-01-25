// Mystery Box System - Random rewards that appear occasionally

export interface MysteryBoxReward {
  type: 'tokens' | 'power_up' | 'item' | 'spin' | 'mega';
  value: number | string;
  displayName: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const MYSTERY_REWARDS: MysteryBoxReward[] = [
  // Common (60%)
  { type: 'tokens', value: 10, displayName: '10 Tokens', icon: '🪙', rarity: 'common' },
  { type: 'tokens', value: 15, displayName: '15 Tokens', icon: '🪙', rarity: 'common' },
  { type: 'tokens', value: 20, displayName: '20 Tokens', icon: '🪙', rarity: 'common' },
  { type: 'power_up', value: 'peek', displayName: 'Ghost Peek', icon: '👁️', rarity: 'common' },
  { type: 'power_up', value: 'lucky_draw', displayName: 'Lucky Draw', icon: '🍀', rarity: 'common' },

  // Rare (25%)
  { type: 'tokens', value: 50, displayName: '50 Tokens', icon: '💰', rarity: 'rare' },
  { type: 'power_up', value: 'shield', displayName: 'Shield', icon: '🛡️', rarity: 'rare' },
  { type: 'power_up', value: 'double_down', displayName: 'Double Down', icon: '💰', rarity: 'rare' },
  { type: 'spin', value: 1, displayName: 'Free Spin', icon: '🎡', rarity: 'rare' },

  // Epic (12%)
  { type: 'tokens', value: 100, displayName: '100 Tokens', icon: '💎', rarity: 'epic' },
  { type: 'power_up', value: 'reveal', displayName: 'Mind Read', icon: '🔮', rarity: 'epic' },
  { type: 'power_up', value: 'freeze', displayName: 'Ghost Freeze', icon: '❄️', rarity: 'epic' },
  { type: 'item', value: 'taunt_random', displayName: 'Random Taunt', icon: '🎁', rarity: 'epic' },

  // Legendary (3%)
  { type: 'tokens', value: 250, displayName: '250 Tokens!', icon: '👑', rarity: 'legendary' },
  { type: 'mega', value: 'jackpot', displayName: 'JACKPOT!', icon: '🎰', rarity: 'legendary' },
];

export interface MysteryBoxState {
  roundsSinceLastBox: number;
  totalBoxesOpened: number;
  lastBoxDate: string;
}

const BOX_KEY = 'guts_mystery_box';
const ROUNDS_BETWEEN_BOXES = 10; // Average rounds between mystery boxes
const BOX_CHANCE = 0.1; // 10% chance per round after minimum

export function loadMysteryBoxState(): MysteryBoxState {
  if (typeof window === 'undefined') {
    return { roundsSinceLastBox: 0, totalBoxesOpened: 0, lastBoxDate: '' };
  }
  try {
    const data = localStorage.getItem(BOX_KEY);
    return data ? JSON.parse(data) : { roundsSinceLastBox: 0, totalBoxesOpened: 0, lastBoxDate: '' };
  } catch {
    return { roundsSinceLastBox: 0, totalBoxesOpened: 0, lastBoxDate: '' };
  }
}

export function saveMysteryBoxState(state: MysteryBoxState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BOX_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save mystery box state:', e);
  }
}

export function checkForMysteryBox(): { appears: boolean; state: MysteryBoxState } {
  const state = loadMysteryBoxState();
  state.roundsSinceLastBox += 1;

  // Guaranteed box after 15 rounds
  if (state.roundsSinceLastBox >= 15) {
    return { appears: true, state };
  }

  // Increasing chance after 7 rounds
  if (state.roundsSinceLastBox >= 7) {
    const chance = BOX_CHANCE + ((state.roundsSinceLastBox - 7) * 0.05);
    if (Math.random() < chance) {
      return { appears: true, state };
    }
  }

  saveMysteryBoxState(state);
  return { appears: false, state };
}

export function openMysteryBox(): { reward: MysteryBoxReward; state: MysteryBoxState } {
  const state = loadMysteryBoxState();

  // Select reward by rarity
  const roll = Math.random() * 100;
  let rarityFilter: MysteryBoxReward['rarity'];

  if (roll < 3) {
    rarityFilter = 'legendary';
  } else if (roll < 15) {
    rarityFilter = 'epic';
  } else if (roll < 40) {
    rarityFilter = 'rare';
  } else {
    rarityFilter = 'common';
  }

  const possibleRewards = MYSTERY_REWARDS.filter(r => r.rarity === rarityFilter);
  const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

  state.roundsSinceLastBox = 0;
  state.totalBoxesOpened += 1;
  state.lastBoxDate = new Date().toISOString();

  saveMysteryBoxState(state);
  return { reward, state };
}
