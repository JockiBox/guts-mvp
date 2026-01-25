// Table Themes System for GUTS

export interface TableTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  background: string;
  tableColor: string;
  accentColor: string;
  cardBack: string;
  unlockCondition: 'free' | 'wins' | 'purchase' | 'achievement';
  unlockValue?: number; // Wins needed or token cost
  unlockAchievement?: string;
}

export const TABLE_THEMES: TableTheme[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The original GUTS table',
    icon: '🎴',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    tableColor: 'rgba(30, 41, 59, 0.95)',
    accentColor: '#14b8a6',
    cardBack: '🂠',
    unlockCondition: 'free',
  },
  {
    id: 'vegas',
    name: 'Vegas Nights',
    description: 'Bright lights, big wins',
    icon: '🎰',
    background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
    tableColor: 'rgba(45, 27, 78, 0.95)',
    accentColor: '#f59e0b',
    cardBack: '🃏',
    unlockCondition: 'wins',
    unlockValue: 25,
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Calm waters, cool wins',
    icon: '🌊',
    background: 'linear-gradient(180deg, #0c1929 0%, #1e3a5f 50%, #0c1929 100%)',
    tableColor: 'rgba(30, 58, 95, 0.95)',
    accentColor: '#06b6d4',
    cardBack: '🐚',
    unlockCondition: 'wins',
    unlockValue: 50,
  },
  {
    id: 'fire',
    name: 'Inferno',
    description: 'For hot streaks only',
    icon: '🔥',
    background: 'linear-gradient(180deg, #1a0505 0%, #4a1515 50%, #1a0505 100%)',
    tableColor: 'rgba(74, 21, 21, 0.95)',
    accentColor: '#ef4444',
    cardBack: '🔥',
    unlockCondition: 'wins',
    unlockValue: 100,
  },
  {
    id: 'space',
    name: 'Cosmic',
    description: 'Playing among the stars',
    icon: '🚀',
    background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)',
    tableColor: 'rgba(26, 26, 58, 0.95)',
    accentColor: '#8b5cf6',
    cardBack: '⭐',
    unlockCondition: 'wins',
    unlockValue: 150,
  },
  {
    id: 'gold',
    name: 'Royal Gold',
    description: 'Fit for a champion',
    icon: '👑',
    background: 'linear-gradient(180deg, #1a1505 0%, #3d3010 50%, #1a1505 100%)',
    tableColor: 'rgba(61, 48, 16, 0.95)',
    accentColor: '#fbbf24',
    cardBack: '👑',
    unlockCondition: 'wins',
    unlockValue: 250,
  },
  {
    id: 'neon',
    name: 'Neon Dreams',
    description: 'Cyberpunk vibes',
    icon: '💜',
    background: 'linear-gradient(180deg, #0d0d1a 0%, #1a0d2e 50%, #0d0d1a 100%)',
    tableColor: 'rgba(26, 13, 46, 0.95)',
    accentColor: '#ec4899',
    cardBack: '💎',
    unlockCondition: 'purchase',
    unlockValue: 500,
  },
  {
    id: 'matrix',
    name: 'The Matrix',
    description: 'There is no spoon',
    icon: '🖥️',
    background: 'linear-gradient(180deg, #000500 0%, #001a00 50%, #000500 100%)',
    tableColor: 'rgba(0, 26, 0, 0.95)',
    accentColor: '#22c55e',
    cardBack: '💻',
    unlockCondition: 'purchase',
    unlockValue: 750,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Pure luxury',
    icon: '💎',
    background: 'linear-gradient(180deg, #1a2a3a 0%, #2a4a5a 50%, #1a2a3a 100%)',
    tableColor: 'rgba(42, 74, 90, 0.95)',
    accentColor: '#67e8f9',
    cardBack: '💠',
    unlockCondition: 'achievement',
    unlockAchievement: 'wins_500',
  },
];

const STORAGE_KEY = 'guts_theme';
const UNLOCKED_KEY = 'guts_unlocked_themes';

export function loadCurrentTheme(): TableTheme {
  if (typeof window === 'undefined') return TABLE_THEMES[0];
  try {
    const themeId = localStorage.getItem(STORAGE_KEY);
    const theme = TABLE_THEMES.find(t => t.id === themeId);
    return theme || TABLE_THEMES[0];
  } catch {
    return TABLE_THEMES[0];
  }
}

export function saveCurrentTheme(themeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

export function loadUnlockedThemes(): string[] {
  if (typeof window === 'undefined') return ['classic'];
  try {
    const data = localStorage.getItem(UNLOCKED_KEY);
    return data ? JSON.parse(data) : ['classic'];
  } catch {
    return ['classic'];
  }
}

export function saveUnlockedThemes(themeIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(themeIds));
  } catch (e) {
    console.error('Failed to save unlocked themes:', e);
  }
}

export function unlockTheme(themeId: string): void {
  const unlocked = loadUnlockedThemes();
  if (!unlocked.includes(themeId)) {
    unlocked.push(themeId);
    saveUnlockedThemes(unlocked);
  }
}

export function checkThemeUnlocks(totalWins: number, unlockedAchievements: string[]): string[] {
  const newlyUnlocked: string[] = [];
  const currentlyUnlocked = loadUnlockedThemes();

  for (const theme of TABLE_THEMES) {
    if (currentlyUnlocked.includes(theme.id)) continue;

    let shouldUnlock = false;

    if (theme.unlockCondition === 'free') {
      shouldUnlock = true;
    } else if (theme.unlockCondition === 'wins' && theme.unlockValue) {
      shouldUnlock = totalWins >= theme.unlockValue;
    } else if (theme.unlockCondition === 'achievement' && theme.unlockAchievement) {
      shouldUnlock = unlockedAchievements.includes(theme.unlockAchievement);
    }

    if (shouldUnlock) {
      unlockTheme(theme.id);
      newlyUnlocked.push(theme.id);
    }
  }

  return newlyUnlocked;
}

export function purchaseTheme(themeId: string, currentTokens: number): { success: boolean; newTokens: number } {
  const theme = TABLE_THEMES.find(t => t.id === themeId);
  if (!theme || theme.unlockCondition !== 'purchase' || !theme.unlockValue) {
    return { success: false, newTokens: currentTokens };
  }

  if (currentTokens < theme.unlockValue) {
    return { success: false, newTokens: currentTokens };
  }

  unlockTheme(themeId);
  return { success: true, newTokens: currentTokens - theme.unlockValue };
}

export function isThemeUnlocked(themeId: string): boolean {
  return loadUnlockedThemes().includes(themeId);
}
