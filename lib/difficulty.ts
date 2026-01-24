'use client';

// Difficulty settings for AI behavior

export type Difficulty = 'easy' | 'normal' | 'hard';

const DIFFICULTY_KEY = 'guts_difficulty';

export interface DifficultySettings {
  name: string;
  description: string;
  aiAccuracy: number; // How well AI evaluates hands (0-1)
  aiBluffChance: number; // Chance to bluff on bad hands
  aiCautiousness: number; // How cautious on medium hands (-0.2 to 0.2)
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: 'Casual',
    description: 'Relaxed opponents, more mistakes',
    aiAccuracy: 0.6,
    aiBluffChance: 0.3,
    aiCautiousness: -0.15,
  },
  normal: {
    name: 'Standard',
    description: 'Balanced challenge',
    aiAccuracy: 0.8,
    aiBluffChance: 0.15,
    aiCautiousness: 0,
  },
  hard: {
    name: 'Expert',
    description: 'Strategic opponents, fewer mistakes',
    aiAccuracy: 0.95,
    aiBluffChance: 0.08,
    aiCautiousness: 0.1,
  },
};

export function loadDifficulty(): Difficulty {
  if (typeof window === 'undefined') return 'normal';
  try {
    const saved = localStorage.getItem(DIFFICULTY_KEY);
    if (saved && (saved === 'easy' || saved === 'normal' || saved === 'hard')) {
      return saved;
    }
  } catch (e) {
    console.error('Error loading difficulty:', e);
  }
  return 'normal';
}

export function saveDifficulty(difficulty: Difficulty): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DIFFICULTY_KEY, difficulty);
  } catch (e) {
    console.error('Error saving difficulty:', e);
  }
}

export function getDifficultyConfig(difficulty: Difficulty): DifficultySettings {
  return DIFFICULTY_CONFIGS[difficulty];
}
