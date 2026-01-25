// Game Modes - Different ways to play GUTS

export type GameModeType = 'classic' | 'speed' | 'all_in' | 'hot_seat' | 'high_roller' | 'survival';

export interface GameMode {
  id: GameModeType;
  name: string;
  description: string;
  icon: string;
  rules: string[];
  modifiers: GameModifiers;
  unlockCondition: 'free' | 'wins' | 'tokens';
  unlockValue?: number;
}

export interface GameModifiers {
  decisionTime: number; // seconds for decision (0 = no limit)
  anteMultiplier: number;
  minPlayers: number;
  maxPlayers: number;
  startingTokens: number;
  ghostChance: number; // 0-1
  allowPowerUps: boolean;
  allowSideBets: boolean;
}

export const GAME_MODES: GameMode[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The original GUTS experience',
    icon: '🎴',
    rules: [
      'Standard ante of 1 token',
      'No time limit on decisions',
      'Ghost hands appear randomly',
    ],
    modifiers: {
      decisionTime: 0,
      anteMultiplier: 1,
      minPlayers: 2,
      maxPlayers: 6,
      startingTokens: 500,
      ghostChance: 0.3,
      allowPowerUps: true,
      allowSideBets: true,
    },
    unlockCondition: 'free',
  },
  {
    id: 'speed',
    name: 'Speed Round',
    description: '3 seconds to decide - no hesitation!',
    icon: '⚡',
    rules: [
      '3 second decision timer',
      'Auto-drop if time runs out',
      '1.5x token rewards',
    ],
    modifiers: {
      decisionTime: 3,
      anteMultiplier: 1.5,
      minPlayers: 2,
      maxPlayers: 6,
      startingTokens: 500,
      ghostChance: 0.25,
      allowPowerUps: false,
      allowSideBets: false,
    },
    unlockCondition: 'wins',
    unlockValue: 10,
  },
  {
    id: 'all_in',
    name: 'All-In Mode',
    description: 'High stakes - bet everything!',
    icon: '💰',
    rules: [
      'Ante is 10% of your stack',
      'Winner takes all',
      'One life only',
    ],
    modifiers: {
      decisionTime: 10,
      anteMultiplier: 10,
      minPlayers: 2,
      maxPlayers: 4,
      startingTokens: 100,
      ghostChance: 0.2,
      allowPowerUps: true,
      allowSideBets: false,
    },
    unlockCondition: 'wins',
    unlockValue: 25,
  },
  {
    id: 'hot_seat',
    name: 'Hot Seat',
    description: 'Pass & play with friends',
    icon: '🔥',
    rules: [
      'Multiple human players',
      'Pass device between turns',
      'Cards hidden between players',
    ],
    modifiers: {
      decisionTime: 30,
      anteMultiplier: 1,
      minPlayers: 2,
      maxPlayers: 4,
      startingTokens: 500,
      ghostChance: 0.3,
      allowPowerUps: false,
      allowSideBets: false,
    },
    unlockCondition: 'free',
  },
  {
    id: 'high_roller',
    name: 'High Roller',
    description: 'Big bets for big rewards',
    icon: '👑',
    rules: [
      'Minimum 50 token ante',
      '2x rewards',
      'Premium opponents',
    ],
    modifiers: {
      decisionTime: 15,
      anteMultiplier: 50,
      minPlayers: 2,
      maxPlayers: 4,
      startingTokens: 1000,
      ghostChance: 0.35,
      allowPowerUps: true,
      allowSideBets: true,
    },
    unlockCondition: 'tokens',
    unlockValue: 1000,
  },
  {
    id: 'survival',
    name: 'Survival',
    description: 'Last player standing wins!',
    icon: '🏝️',
    rules: [
      'Increasing antes each round',
      'No token refills',
      'Eliminated at 0 tokens',
    ],
    modifiers: {
      decisionTime: 10,
      anteMultiplier: 1, // Increases each round
      minPlayers: 4,
      maxPlayers: 6,
      startingTokens: 200,
      ghostChance: 0.4,
      allowPowerUps: true,
      allowSideBets: false,
    },
    unlockCondition: 'wins',
    unlockValue: 50,
  },
];

const MODE_KEY = 'guts_unlocked_modes';

export function loadUnlockedModes(): GameModeType[] {
  if (typeof window === 'undefined') return ['classic', 'hot_seat'];
  try {
    const data = localStorage.getItem(MODE_KEY);
    const unlocked = data ? JSON.parse(data) : ['classic', 'hot_seat'];
    return unlocked;
  } catch {
    return ['classic', 'hot_seat'];
  }
}

export function saveUnlockedModes(modes: GameModeType[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MODE_KEY, JSON.stringify(modes));
  } catch (e) {
    console.error('Failed to save game modes:', e);
  }
}

export function unlockMode(modeId: GameModeType): boolean {
  const unlocked = loadUnlockedModes();
  if (unlocked.includes(modeId)) return false;

  unlocked.push(modeId);
  saveUnlockedModes(unlocked);
  return true;
}

export function isModeUnlocked(modeId: GameModeType): boolean {
  return loadUnlockedModes().includes(modeId);
}

export function checkModeUnlocks(totalWins: number, currentTokens: number): GameModeType[] {
  const newlyUnlocked: GameModeType[] = [];

  for (const mode of GAME_MODES) {
    if (isModeUnlocked(mode.id)) continue;

    let shouldUnlock = false;
    switch (mode.unlockCondition) {
      case 'free':
        shouldUnlock = true;
        break;
      case 'wins':
        shouldUnlock = totalWins >= (mode.unlockValue || 0);
        break;
      case 'tokens':
        shouldUnlock = currentTokens >= (mode.unlockValue || 0);
        break;
    }

    if (shouldUnlock) {
      unlockMode(mode.id);
      newlyUnlocked.push(mode.id);
    }
  }

  return newlyUnlocked;
}

export function getMode(modeId: GameModeType): GameMode | null {
  return GAME_MODES.find(m => m.id === modeId) || null;
}

export function getDefaultMode(): GameMode {
  return GAME_MODES[0];
}
