// Battle Pass System - Seasonal Progression

export interface BattlePassReward {
  tier: number;
  free: { type: 'tokens' | 'avatar' | 'theme' | 'emote' | 'title'; value: string | number; icon: string };
  premium: { type: 'tokens' | 'avatar' | 'theme' | 'emote' | 'title'; value: string | number; icon: string };
}

export interface BattlePassState {
  seasonId: string;
  tier: number;
  xp: number;
  isPremium: boolean;
  claimedFree: number[];
  claimedPremium: number[];
}

export interface Season {
  id: string;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  maxTier: number;
  xpPerTier: number;
}

// Current season definition
export const CURRENT_SEASON: Season = {
  id: 'season_1',
  name: 'Season 1: High Stakes',
  theme: 'casino',
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  maxTier: 50,
  xpPerTier: 100,
};

// Battle pass rewards
export const BATTLE_PASS_REWARDS: BattlePassReward[] = [
  { tier: 1, free: { type: 'tokens', value: 25, icon: '🪙' }, premium: { type: 'tokens', value: 50, icon: '🪙' } },
  { tier: 2, free: { type: 'tokens', value: 25, icon: '🪙' }, premium: { type: 'avatar', value: 'crown', icon: '👑' } },
  { tier: 3, free: { type: 'emote', value: 'fire', icon: '🔥' }, premium: { type: 'tokens', value: 75, icon: '🪙' } },
  { tier: 4, free: { type: 'tokens', value: 30, icon: '🪙' }, premium: { type: 'tokens', value: 100, icon: '🪙' } },
  { tier: 5, free: { type: 'tokens', value: 50, icon: '🪙' }, premium: { type: 'theme', value: 'neon', icon: '🌈' } },
  { tier: 6, free: { type: 'tokens', value: 25, icon: '🪙' }, premium: { type: 'tokens', value: 75, icon: '🪙' } },
  { tier: 7, free: { type: 'emote', value: 'cool', icon: '😎' }, premium: { type: 'avatar', value: 'diamond', icon: '💎' } },
  { tier: 8, free: { type: 'tokens', value: 30, icon: '🪙' }, premium: { type: 'tokens', value: 100, icon: '🪙' } },
  { tier: 9, free: { type: 'tokens', value: 25, icon: '🪙' }, premium: { type: 'tokens', value: 75, icon: '🪙' } },
  { tier: 10, free: { type: 'tokens', value: 100, icon: '🪙' }, premium: { type: 'title', value: 'High Roller', icon: '🎰' } },
  { tier: 15, free: { type: 'tokens', value: 150, icon: '🪙' }, premium: { type: 'theme', value: 'gold', icon: '✨' } },
  { tier: 20, free: { type: 'tokens', value: 200, icon: '🪙' }, premium: { type: 'avatar', value: 'vip', icon: '⭐' } },
  { tier: 25, free: { type: 'tokens', value: 250, icon: '🪙' }, premium: { type: 'title', value: 'Card Shark', icon: '🦈' } },
  { tier: 30, free: { type: 'tokens', value: 300, icon: '🪙' }, premium: { type: 'theme', value: 'platinum', icon: '💠' } },
  { tier: 35, free: { type: 'tokens', value: 350, icon: '🪙' }, premium: { type: 'emote', value: 'legendary', icon: '🌟' } },
  { tier: 40, free: { type: 'tokens', value: 400, icon: '🪙' }, premium: { type: 'avatar', value: 'legend', icon: '🏆' } },
  { tier: 45, free: { type: 'tokens', value: 450, icon: '🪙' }, premium: { type: 'title', value: 'GUTS Legend', icon: '👑' } },
  { tier: 50, free: { type: 'tokens', value: 500, icon: '🪙' }, premium: { type: 'theme', value: 'legendary', icon: '🌈' } },
];

const STORAGE_KEY = 'guts_battle_pass';

export function loadBattlePass(): BattlePassState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const state: BattlePassState = JSON.parse(data);
      // Reset if new season
      if (state.seasonId !== CURRENT_SEASON.id) {
        return getDefaultState();
      }
      return state;
    }
  } catch {}
  return getDefaultState();
}

function getDefaultState(): BattlePassState {
  return {
    seasonId: CURRENT_SEASON.id,
    tier: 1,
    xp: 0,
    isPremium: false,
    claimedFree: [],
    claimedPremium: [],
  };
}

export function saveBattlePass(state: BattlePassState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function addBattlePassXP(amount: number): {
  newState: BattlePassState;
  tierUp: boolean;
  newTier?: number;
} {
  const state = loadBattlePass();
  state.xp += amount;

  let tierUp = false;
  let newTier: number | undefined;

  // Check for tier up
  while (state.xp >= CURRENT_SEASON.xpPerTier && state.tier < CURRENT_SEASON.maxTier) {
    state.xp -= CURRENT_SEASON.xpPerTier;
    state.tier++;
    tierUp = true;
    newTier = state.tier;
  }

  saveBattlePass(state);
  return { newState: state, tierUp, newTier };
}

export function claimReward(tier: number, isPremium: boolean): BattlePassReward['free'] | null {
  const state = loadBattlePass();

  // Check if tier is reached
  if (tier > state.tier) return null;

  // Check if premium is required but not owned
  if (isPremium && !state.isPremium) return null;

  // Check if already claimed
  const claimedList = isPremium ? state.claimedPremium : state.claimedFree;
  if (claimedList.includes(tier)) return null;

  // Find reward
  const reward = BATTLE_PASS_REWARDS.find(r => r.tier === tier);
  if (!reward) return null;

  // Mark as claimed
  if (isPremium) {
    state.claimedPremium.push(tier);
  } else {
    state.claimedFree.push(tier);
  }
  saveBattlePass(state);

  return isPremium ? reward.premium : reward.free;
}

export function upgradeToPremium(): boolean {
  const state = loadBattlePass();
  if (state.isPremium) return false;

  state.isPremium = true;
  saveBattlePass(state);
  return true;
}

export function getBattlePassProgress(): {
  tier: number;
  xp: number;
  xpNeeded: number;
  percentToNext: number;
  isPremium: boolean;
  unclaimedFree: number[];
  unclaimedPremium: number[];
  daysLeft: number;
} {
  const state = loadBattlePass();

  // Find unclaimed rewards
  const unclaimedFree = BATTLE_PASS_REWARDS
    .filter(r => r.tier <= state.tier && !state.claimedFree.includes(r.tier))
    .map(r => r.tier);

  const unclaimedPremium = state.isPremium
    ? BATTLE_PASS_REWARDS
        .filter(r => r.tier <= state.tier && !state.claimedPremium.includes(r.tier))
        .map(r => r.tier)
    : [];

  // Calculate days left
  const endDate = new Date(CURRENT_SEASON.endDate);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    tier: state.tier,
    xp: state.xp,
    xpNeeded: CURRENT_SEASON.xpPerTier,
    percentToNext: Math.floor((state.xp / CURRENT_SEASON.xpPerTier) * 100),
    isPremium: state.isPremium,
    unclaimedFree,
    unclaimedPremium,
    daysLeft,
  };
}

export function getRewardForTier(tier: number): BattlePassReward | undefined {
  return BATTLE_PASS_REWARDS.find(r => r.tier === tier);
}

export function getCurrentSeason(): Season & { daysLeft: number } {
  const endDate = new Date(CURRENT_SEASON.endDate);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    ...CURRENT_SEASON,
    daysLeft,
  };
}
