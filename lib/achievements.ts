// Achievements System for GUTS

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number; // Token reward
  category: 'wins' | 'streaks' | 'hands' | 'social' | 'special';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Wins
  { id: 'first_win', name: 'First Blood', description: 'Win your first hand', icon: '🏆', requirement: 1, reward: 10, category: 'wins' },
  { id: 'wins_10', name: 'Getting Started', description: 'Win 10 hands', icon: '⭐', requirement: 10, reward: 25, category: 'wins' },
  { id: 'wins_50', name: 'Competitor', description: 'Win 50 hands', icon: '🌟', requirement: 50, reward: 100, category: 'wins' },
  { id: 'wins_100', name: 'Champion', description: 'Win 100 hands', icon: '👑', requirement: 100, reward: 250, category: 'wins' },
  { id: 'wins_500', name: 'Legend', description: 'Win 500 hands', icon: '🏅', requirement: 500, reward: 1000, category: 'wins' },

  // Streaks
  { id: 'streak_3', name: 'Hot Hand', description: 'Win 3 hands in a row', icon: '🔥', requirement: 3, reward: 15, category: 'streaks' },
  { id: 'streak_5', name: 'On Fire', description: 'Win 5 hands in a row', icon: '🔥🔥', requirement: 5, reward: 50, category: 'streaks' },
  { id: 'streak_10', name: 'Unstoppable', description: 'Win 10 hands in a row', icon: '💎', requirement: 10, reward: 200, category: 'streaks' },
  { id: 'streak_20', name: 'Legendary Streak', description: 'Win 20 hands in a row', icon: '🌈', requirement: 20, reward: 500, category: 'streaks' },

  // Special Hands
  { id: 'pair_win', name: 'Pocket Pair', description: 'Win with a pair', icon: '✌️', requirement: 1, reward: 5, category: 'hands' },
  { id: 'pairs_10', name: 'Pair Master', description: 'Win 10 times with pairs', icon: '🎭', requirement: 10, reward: 50, category: 'hands' },
  { id: 'sixty_nine', name: 'Nice!', description: 'Win with the legendary 6-9', icon: '😏', requirement: 1, reward: 69, category: 'hands' },
  { id: 'aces', name: 'Pocket Aces', description: 'Win with a pair of Aces', icon: '🅰️', requirement: 1, reward: 25, category: 'hands' },
  { id: 'beat_ghost', name: 'Ghost Buster', description: 'Beat a ghost hand', icon: '👻', requirement: 1, reward: 20, category: 'hands' },
  { id: 'beat_ghosts_10', name: 'Ghost Hunter', description: 'Beat 10 ghost hands', icon: '🔫', requirement: 10, reward: 100, category: 'hands' },

  // Social
  { id: 'heart_1', name: 'Fan Club', description: 'Heart your first bot', icon: '❤️', requirement: 1, reward: 5, category: 'social' },
  { id: 'heart_10', name: 'Bot Lover', description: 'Heart 10 different bots', icon: '💕', requirement: 10, reward: 50, category: 'social' },
  { id: 'heart_50', name: 'Super Fan', description: 'Heart 50 different bots', icon: '💖', requirement: 50, reward: 200, category: 'social' },

  // Special
  { id: 'underdog', name: 'Underdog', description: 'Win with a hand value under 100', icon: '🐕', requirement: 1, reward: 30, category: 'special' },
  { id: 'comeback', name: 'Comeback Kid', description: 'Win after being down to 10 tokens', icon: '💪', requirement: 1, reward: 50, category: 'special' },
  { id: 'daily_5', name: 'Dedicated', description: 'Play 5 days in a row', icon: '📅', requirement: 5, reward: 100, category: 'special' },
  { id: 'big_pot', name: 'High Roller', description: 'Win a pot of 50+ tokens', icon: '💵', requirement: 1, reward: 75, category: 'special' },
  { id: 'survivor', name: 'Survivor', description: 'Be the last player standing', icon: '🏝️', requirement: 1, reward: 40, category: 'special' },
];

export interface PlayerAchievements {
  unlocked: string[]; // Achievement IDs
  progress: { [key: string]: number }; // Achievement ID -> current progress
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
  pairWins: number;
  ghostsBeaten: number;
  botsHearted: number;
  daysPlayed: string[]; // ISO date strings
  lastPlayDate: string;
}

const STORAGE_KEY = 'guts_achievements';

export function loadAchievements(): PlayerAchievements {
  if (typeof window === 'undefined') {
    return getDefaultAchievements();
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...getDefaultAchievements(), ...JSON.parse(data) } : getDefaultAchievements();
  } catch {
    return getDefaultAchievements();
  }
}

function getDefaultAchievements(): PlayerAchievements {
  return {
    unlocked: [],
    progress: {},
    totalWins: 0,
    currentStreak: 0,
    maxStreak: 0,
    pairWins: 0,
    ghostsBeaten: 0,
    botsHearted: 0,
    daysPlayed: [],
    lastPlayDate: '',
  };
}

export function saveAchievements(achievements: PlayerAchievements): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements:', e);
  }
}

export function checkAndUnlockAchievements(achievements: PlayerAchievements): { newAchievements: Achievement[]; totalReward: number } {
  const newlyUnlocked: Achievement[] = [];
  let totalReward = 0;

  for (const achievement of ACHIEVEMENTS) {
    if (achievements.unlocked.includes(achievement.id)) continue;

    let progress = 0;
    switch (achievement.id) {
      case 'first_win':
      case 'wins_10':
      case 'wins_50':
      case 'wins_100':
      case 'wins_500':
        progress = achievements.totalWins;
        break;
      case 'streak_3':
      case 'streak_5':
      case 'streak_10':
      case 'streak_20':
        progress = achievements.maxStreak;
        break;
      case 'pair_win':
      case 'pairs_10':
        progress = achievements.pairWins;
        break;
      case 'beat_ghost':
      case 'beat_ghosts_10':
        progress = achievements.ghostsBeaten;
        break;
      case 'heart_1':
      case 'heart_10':
      case 'heart_50':
        progress = achievements.botsHearted;
        break;
      case 'daily_5':
        progress = achievements.daysPlayed.length;
        break;
      default:
        progress = achievements.progress[achievement.id] || 0;
    }

    achievements.progress[achievement.id] = progress;

    if (progress >= achievement.requirement) {
      achievements.unlocked.push(achievement.id);
      newlyUnlocked.push(achievement);
      totalReward += achievement.reward;
    }
  }

  if (newlyUnlocked.length > 0) {
    saveAchievements(achievements);
  }

  return { newAchievements: newlyUnlocked, totalReward };
}

export function recordWin(achievements: PlayerAchievements, wasPair: boolean, beatGhost: boolean, handValue: number, potSize: number): PlayerAchievements {
  achievements.totalWins += 1;
  achievements.currentStreak += 1;
  achievements.maxStreak = Math.max(achievements.maxStreak, achievements.currentStreak);

  if (wasPair) achievements.pairWins += 1;
  if (beatGhost) achievements.ghostsBeaten += 1;

  // Track special achievements
  if (handValue < 100) {
    achievements.progress['underdog'] = (achievements.progress['underdog'] || 0) + 1;
  }
  if (potSize >= 50) {
    achievements.progress['big_pot'] = (achievements.progress['big_pot'] || 0) + 1;
  }

  // Track 6-9 wins
  // This would need hand data passed in - simplified for now

  // Track daily play
  const today = new Date().toISOString().split('T')[0];
  if (!achievements.daysPlayed.includes(today)) {
    achievements.daysPlayed.push(today);
  }
  achievements.lastPlayDate = today;

  saveAchievements(achievements);
  return achievements;
}

export function recordLoss(achievements: PlayerAchievements): PlayerAchievements {
  achievements.currentStreak = 0;
  saveAchievements(achievements);
  return achievements;
}

export function recordHeart(achievements: PlayerAchievements): PlayerAchievements {
  achievements.botsHearted += 1;
  saveAchievements(achievements);
  return achievements;
}
