// Game Mode Settings - Speed Mode, Practice Mode, etc.

export interface GameSettings {
  speedMode: boolean;
  practiceMode: boolean;
  countdownDuration: number; // seconds
  autoAdvance: boolean;
  showOdds: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  largeText: boolean;
  colorblindMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderHints: boolean;
  showAnimations: boolean;
  autoFlipCards: boolean;
  confirmActions: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  speedMode: false,
  practiceMode: false,
  countdownDuration: 3,
  autoAdvance: false,
  showOdds: true,
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  darkMode: true,
  largeText: false,
  colorblindMode: false,
  reducedMotion: false,
  highContrast: false,
  screenReaderHints: false,
  showAnimations: true,
  autoFlipCards: false,
  confirmActions: false,
};

const STORAGE_KEY = 'guts_game_settings';

export function loadGameSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveGameSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function updateSetting<K extends keyof GameSettings>(
  key: K,
  value: GameSettings[K]
): GameSettings {
  const settings = loadGameSettings();
  settings[key] = value;
  saveGameSettings(settings);
  return settings;
}

// Speed mode settings
export function getCountdownDuration(settings: GameSettings): number {
  if (settings.speedMode) return 1.5;
  return settings.countdownDuration;
}

// Practice mode - no tokens lost/gained
export function isPracticeMode(): boolean {
  return loadGameSettings().practiceMode;
}

// Get display font size multiplier
export function getFontSizeMultiplier(settings: GameSettings): number {
  return settings.largeText ? 1.2 : 1;
}

// Check if reduced motion is enabled
export function shouldReduceMotion(settings: GameSettings): boolean {
  if (settings.reducedMotion) return true;
  // Also check system preference
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

// Colorblind-safe colors
export const COLORBLIND_COLORS = {
  win: '#22c55e',    // Green (works for most)
  lose: '#f97316',   // Orange instead of red
  hold: '#3b82f6',   // Blue
  drop: '#a855f7',   // Purple
  neutral: '#64748b', // Gray
};

export const NORMAL_COLORS = {
  win: '#4ade80',
  lose: '#f87171',
  hold: '#22c55e',
  drop: '#f87171',
  neutral: '#94a3b8',
};

export function getGameColors(settings: GameSettings): typeof NORMAL_COLORS {
  return settings.colorblindMode ? COLORBLIND_COLORS : NORMAL_COLORS;
}

// Light mode colors
export const LIGHT_THEME = {
  background: '#f8fafc',
  card: '#ffffff',
  cardBorder: '#e2e8f0',
  text: '#1e293b',
  textMuted: '#64748b',
  accent: '#0d9488',
};

export const DARK_THEME = {
  background: '#0f172a',
  card: '#1e293b',
  cardBorder: '#334155',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  accent: '#14b8a6',
};

export function getThemeColors(settings: GameSettings): typeof DARK_THEME {
  return settings.darkMode ? DARK_THEME : LIGHT_THEME;
}

// Unlock requirements for features
export function isSpeedModeUnlocked(level: number): boolean {
  return level >= 5;
}

export function isPracticeModeUnlocked(): boolean {
  return true; // Always available
}

export function isCustomLobbiesUnlocked(level: number): boolean {
  return level >= 10;
}

// Aliases for convenience
export const loadSettings = loadGameSettings;
export const saveSettings = saveGameSettings;
