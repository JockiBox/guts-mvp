// XP and Level Progression System

export interface XPState {
  currentXP: number;
  totalXP: number;
  level: number;
  vipTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

export interface LevelReward {
  level: number;
  tokens: number;
  title?: string;
  unlock?: string;
}

// XP required for each level (increases progressively)
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Get total XP needed to reach a level from 0
export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

// Calculate level from total XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  while (xpNeeded + getXPForLevel(level) <= totalXP) {
    xpNeeded += getXPForLevel(level);
    level++;
  }
  return level;
}

// Get VIP tier based on level
export function getVIPTier(level: number): XPState['vipTier'] {
  if (level >= 50) return 'diamond';
  if (level >= 30) return 'platinum';
  if (level >= 15) return 'gold';
  if (level >= 5) return 'silver';
  return 'bronze';
}

// VIP tier perks
export const VIP_PERKS = {
  bronze: { dailyBonus: 1.0, xpMultiplier: 1.0, shopDiscount: 0 },
  silver: { dailyBonus: 1.25, xpMultiplier: 1.1, shopDiscount: 5 },
  gold: { dailyBonus: 1.5, xpMultiplier: 1.25, shopDiscount: 10 },
  platinum: { dailyBonus: 2.0, xpMultiplier: 1.5, shopDiscount: 15 },
  diamond: { dailyBonus: 3.0, xpMultiplier: 2.0, shopDiscount: 25 },
};

// Level rewards
export const LEVEL_REWARDS: LevelReward[] = [
  { level: 2, tokens: 50, title: 'Rookie' },
  { level: 3, tokens: 75 },
  { level: 5, tokens: 100, title: 'Regular', unlock: 'Speed Mode' },
  { level: 7, tokens: 150 },
  { level: 10, tokens: 250, title: 'Veteran', unlock: 'Custom Lobbies' },
  { level: 15, tokens: 500, title: 'Pro', unlock: 'Gold Theme' },
  { level: 20, tokens: 750 },
  { level: 25, tokens: 1000, title: 'Expert' },
  { level: 30, tokens: 1500, title: 'Master', unlock: 'Platinum Theme' },
  { level: 40, tokens: 2500 },
  { level: 50, tokens: 5000, title: 'Legend', unlock: 'Diamond Theme' },
];

// XP awards for actions
export const XP_AWARDS = {
  roundPlayed: 5,
  roundWon: 15,
  ghostDefeated: 25,
  gameCompleted: 10,
  dailyLogin: 20,
  challengeCompleted: 50,
  achievementUnlocked: 30,
  friendReferred: 100,
};

const STORAGE_KEY = 'guts_xp_state';

export function loadXPState(): XPState {
  if (typeof window === 'undefined') {
    return { currentXP: 0, totalXP: 0, level: 1, vipTier: 'bronze' };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {}
  return { currentXP: 0, totalXP: 0, level: 1, vipTier: 'bronze' };
}

export function saveXPState(state: XPState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function addXP(amount: number): { newState: XPState; leveledUp: boolean; newLevel?: number; reward?: LevelReward } {
  const state = loadXPState();
  const vipPerks = VIP_PERKS[state.vipTier];
  const adjustedAmount = Math.floor(amount * vipPerks.xpMultiplier);

  state.totalXP += adjustedAmount;
  state.currentXP += adjustedAmount;

  const oldLevel = state.level;
  const xpForCurrentLevel = getXPForLevel(state.level);

  let leveledUp = false;
  let reward: LevelReward | undefined;

  // Check for level up
  while (state.currentXP >= xpForCurrentLevel) {
    state.currentXP -= getXPForLevel(state.level);
    state.level++;
    leveledUp = true;

    // Check for reward
    const levelReward = LEVEL_REWARDS.find(r => r.level === state.level);
    if (levelReward) {
      reward = levelReward;
    }
  }

  // Update VIP tier
  state.vipTier = getVIPTier(state.level);

  saveXPState(state);

  return {
    newState: state,
    leveledUp,
    newLevel: leveledUp ? state.level : undefined,
    reward,
  };
}

export function getXPProgress(): { current: number; needed: number; percent: number } {
  const state = loadXPState();
  const needed = getXPForLevel(state.level);
  return {
    current: state.currentXP,
    needed,
    percent: Math.floor((state.currentXP / needed) * 100),
  };
}
