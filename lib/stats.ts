'use client';

// Player statistics tracking

export interface PlayerStats {
  gamesPlayed: number;
  roundsPlayed: number;
  wins: number;
  losses: number;
  totalTokensWon: number;
  totalTokensLost: number;
  biggestPot: number;
  bestHand: {
    description: string;
    value: number;
  } | null;
  sixNineCount: number;
  ghostsDefeated: number;
  ghostLosses: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: (stats: PlayerStats) => boolean;
}

const STATS_KEY = 'guts_player_stats';
const ACHIEVEMENTS_KEY = 'guts_achievements';

const defaultStats: PlayerStats = {
  gamesPlayed: 0,
  roundsPlayed: 0,
  wins: 0,
  losses: 0,
  totalTokensWon: 0,
  totalTokensLost: 0,
  biggestPot: 0,
  bestHand: null,
  sixNineCount: 0,
  ghostsDefeated: 0,
  ghostLosses: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayed: null,
};

// All achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Blood',
    description: 'Win your first round',
    icon: '🏆',
    unlockedAt: null,
    requirement: (stats) => stats.wins >= 1,
  },
  {
    id: 'ten_wins',
    name: 'Veteran',
    description: 'Win 10 rounds',
    icon: '⭐',
    unlockedAt: null,
    requirement: (stats) => stats.wins >= 10,
  },
  {
    id: 'fifty_wins',
    name: 'High Roller',
    description: 'Win 50 rounds',
    icon: '💎',
    unlockedAt: null,
    requirement: (stats) => stats.wins >= 50,
  },
  {
    id: 'hundred_wins',
    name: 'Legend',
    description: 'Win 100 rounds',
    icon: '👑',
    unlockedAt: null,
    requirement: (stats) => stats.wins >= 100,
  },
  {
    id: 'six_nine',
    name: 'Nice.',
    description: 'Get a Six-Nine hand',
    icon: '😏',
    unlockedAt: null,
    requirement: (stats) => stats.sixNineCount >= 1,
  },
  {
    id: 'six_nine_master',
    name: 'Six-Nine Master',
    description: 'Get 10 Six-Nine hands',
    icon: '🔥',
    unlockedAt: null,
    requirement: (stats) => stats.sixNineCount >= 10,
  },
  {
    id: 'ghost_buster',
    name: 'Ghost Buster',
    description: 'Defeat a ghost hand',
    icon: '👻',
    unlockedAt: null,
    requirement: (stats) => stats.ghostsDefeated >= 1,
  },
  {
    id: 'ghost_hunter',
    name: 'Ghost Hunter',
    description: 'Defeat 10 ghost hands',
    icon: '🎃',
    unlockedAt: null,
    requirement: (stats) => stats.ghostsDefeated >= 10,
  },
  {
    id: 'big_pot',
    name: 'Jackpot',
    description: 'Win a pot of 20+ tokens',
    icon: '💰',
    unlockedAt: null,
    requirement: (stats) => stats.biggestPot >= 20,
  },
  {
    id: 'huge_pot',
    name: 'Whale',
    description: 'Win a pot of 50+ tokens',
    icon: '🐋',
    unlockedAt: null,
    requirement: (stats) => stats.biggestPot >= 50,
  },
  {
    id: 'streak_3',
    name: 'Hot Hand',
    description: 'Win 3 rounds in a row',
    icon: '🔥',
    unlockedAt: null,
    requirement: (stats) => stats.bestStreak >= 3,
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    description: 'Win 5 rounds in a row',
    icon: '🌟',
    unlockedAt: null,
    requirement: (stats) => stats.bestStreak >= 5,
  },
  {
    id: 'streak_10',
    name: 'Unstoppable',
    description: 'Win 10 rounds in a row',
    icon: '⚡',
    unlockedAt: null,
    requirement: (stats) => stats.bestStreak >= 10,
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Play 100 rounds',
    icon: '🛡️',
    unlockedAt: null,
    requirement: (stats) => stats.roundsPlayed >= 100,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Play 10 complete games',
    icon: '🎯',
    unlockedAt: null,
    requirement: (stats) => stats.gamesPlayed >= 10,
  },
];

export function loadPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return { ...defaultStats };
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      return { ...defaultStats, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error loading stats:', e);
  }
  return { ...defaultStats };
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats:', e);
  }
}

export function loadUnlockedAchievements(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (data) {
      return new Set(JSON.parse(data));
    }
  } catch (e) {
    console.error('Error loading achievements:', e);
  }
  return new Set();
}

export function saveUnlockedAchievements(unlocked: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(Array.from(unlocked)));
  } catch (e) {
    console.error('Error saving achievements:', e);
  }
}

// Check for newly unlocked achievements
export function checkAchievements(stats: PlayerStats): Achievement[] {
  const unlocked = loadUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.has(achievement.id) && achievement.requirement(stats)) {
      unlocked.add(achievement.id);
      newlyUnlocked.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
  }

  return newlyUnlocked;
}

// Get all achievements with unlock status
export function getAllAchievements(): Achievement[] {
  const unlocked = loadUnlockedAchievements();
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlockedAt: unlocked.has(a.id) ? 'unlocked' : null,
  }));
}

// Update stats after a round
export function updateStatsAfterRound(
  won: boolean,
  tokensChange: number,
  potSize: number,
  handDescription: string,
  handValue: number,
  isSixNine: boolean,
  defeatedGhost: boolean,
  lostToGhost: boolean
): Achievement[] {
  const stats = loadPlayerStats();

  stats.roundsPlayed++;
  stats.lastPlayed = new Date().toISOString();

  if (won) {
    stats.wins++;
    stats.totalTokensWon += tokensChange;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    if (potSize > stats.biggestPot) {
      stats.biggestPot = potSize;
    }
  } else if (tokensChange < 0) {
    stats.losses++;
    stats.totalTokensLost += Math.abs(tokensChange);
    stats.currentStreak = 0;
  }

  if (handValue > (stats.bestHand?.value || 0)) {
    stats.bestHand = { description: handDescription, value: handValue };
  }

  if (isSixNine) {
    stats.sixNineCount++;
  }

  if (defeatedGhost) {
    stats.ghostsDefeated++;
  }

  if (lostToGhost) {
    stats.ghostLosses++;
  }

  savePlayerStats(stats);
  return checkAchievements(stats);
}

// Mark game as complete
export function incrementGamesPlayed(): void {
  const stats = loadPlayerStats();
  stats.gamesPlayed++;
  savePlayerStats(stats);
  checkAchievements(stats);
}

// Calculate win rate
export function getWinRate(stats: PlayerStats): number {
  if (stats.wins + stats.losses === 0) return 0;
  return Math.round((stats.wins / (stats.wins + stats.losses)) * 100);
}

// Format stats for display
export function formatStatValue(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}
