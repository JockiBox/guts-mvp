'use client';

// Trending names system - uses curated lists that rotate
// In production, this could fetch from Google Trends API

// Current trending names by category (updated periodically)
const TRENDING_SPORTS = [
  'LeBron', 'Messi', 'Mahomes', 'Ohtani', 'Jokic',
  'Curry', 'Ronaldo', 'Brady', 'Djokovic', 'Hamilton',
];

const TRENDING_ENTERTAINMENT = [
  'Taylor', 'Beyoncé', 'Drake', 'Zendaya', 'Timothée',
  'Margot', 'Pedro', 'Sydney', 'Bad Bunny', 'Dua',
];

const TRENDING_TECH = [
  'Elon', 'Zuck', 'Jensen', 'Satya', 'Sundar',
  'Sam A.', 'Tim', 'Lisa', 'Nvidia', 'OpenAI',
];

const TRENDING_CULTURE = [
  'Kardashian', 'MrBeast', 'Rogan', 'Charli', 'Addison',
  'KSI', 'Logan', 'Emma', 'Bella', 'Hailey',
];

const TRENDING_NEWS = [
  'Biden', 'Trump', 'Zelensky', 'Macron', 'Modi',
  'Taylor S.', 'King Charles', 'Oprah', 'Gayle', 'Anderson',
];

// Combine all categories
const ALL_TRENDING = [
  ...TRENDING_SPORTS,
  ...TRENDING_ENTERTAINMENT,
  ...TRENDING_TECH,
  ...TRENDING_CULTURE,
  ...TRENDING_NEWS,
];

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random trending names
export function getTrendingNames(count: number): string[] {
  const shuffled = shuffleArray(ALL_TRENDING);
  return shuffled.slice(0, count);
}

// Check if we should use trending names (toggle)
const TRENDING_ENABLED_KEY = 'guts_trending_names';

export function isTrendingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TRENDING_ENABLED_KEY) === 'true';
}

export function setTrendingEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRENDING_ENABLED_KEY, enabled ? 'true' : 'false');
}
