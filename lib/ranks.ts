// Player Ranks System for GUTS

export interface Rank {
  id: string;
  name: string;
  icon: string;
  minWins: number;
  color: string;
  glowColor: string;
}

export const RANKS: Rank[] = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', minWins: 0, color: '#cd7f32', glowColor: 'rgba(205, 127, 50, 0.5)' },
  { id: 'silver', name: 'Silver', icon: '🥈', minWins: 25, color: '#c0c0c0', glowColor: 'rgba(192, 192, 192, 0.5)' },
  { id: 'gold', name: 'Gold', icon: '🥇', minWins: 75, color: '#ffd700', glowColor: 'rgba(255, 215, 0, 0.5)' },
  { id: 'platinum', name: 'Platinum', icon: '💎', minWins: 150, color: '#e5e4e2', glowColor: 'rgba(229, 228, 226, 0.6)' },
  { id: 'diamond', name: 'Diamond', icon: '💠', minWins: 300, color: '#b9f2ff', glowColor: 'rgba(185, 242, 255, 0.6)' },
  { id: 'master', name: 'Master', icon: '👑', minWins: 500, color: '#9b59b6', glowColor: 'rgba(155, 89, 182, 0.6)' },
  { id: 'grandmaster', name: 'Grandmaster', icon: '🏆', minWins: 1000, color: '#e74c3c', glowColor: 'rgba(231, 76, 60, 0.6)' },
  { id: 'legend', name: 'Legend', icon: '⚡', minWins: 2500, color: '#f39c12', glowColor: 'rgba(243, 156, 18, 0.7)' },
];

export function getRankForWins(totalWins: number): Rank {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (totalWins >= rank.minWins) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
}

export function getNextRank(currentRank: Rank): Rank | null {
  const index = RANKS.findIndex(r => r.id === currentRank.id);
  if (index < RANKS.length - 1) {
    return RANKS[index + 1];
  }
  return null;
}

export function getProgressToNextRank(totalWins: number): { current: Rank; next: Rank | null; progress: number; winsNeeded: number } {
  const current = getRankForWins(totalWins);
  const next = getNextRank(current);

  if (!next) {
    return { current, next: null, progress: 100, winsNeeded: 0 };
  }

  const winsInCurrentRank = totalWins - current.minWins;
  const winsNeededForNext = next.minWins - current.minWins;
  const progress = Math.min(100, Math.floor((winsInCurrentRank / winsNeededForNext) * 100));
  const winsNeeded = next.minWins - totalWins;

  return { current, next, progress, winsNeeded };
}

// Player Titles (can be equipped)
export interface Title {
  id: string;
  name: string;
  requirement: string;
  unlockCondition: (stats: PlayerStats) => boolean;
}

export interface PlayerStats {
  totalWins: number;
  maxStreak: number;
  ghostsBeaten: number;
  pairWins: number;
  tokensWon: number;
}

export const TITLES: Title[] = [
  { id: 'newbie', name: 'Newbie', requirement: 'Start playing', unlockCondition: () => true },
  { id: 'shark', name: 'Shark', requirement: 'Win 100 hands', unlockCondition: (s) => s.totalWins >= 100 },
  { id: 'high_roller', name: 'High Roller', requirement: 'Win 10,000 tokens total', unlockCondition: (s) => s.tokensWon >= 10000 },
  { id: 'ghost_slayer', name: 'Ghost Slayer', requirement: 'Beat 50 ghost hands', unlockCondition: (s) => s.ghostsBeaten >= 50 },
  { id: 'streak_master', name: 'Streak Master', requirement: 'Get a 10 win streak', unlockCondition: (s) => s.maxStreak >= 10 },
  { id: 'pair_king', name: 'Pair King', requirement: 'Win 50 times with pairs', unlockCondition: (s) => s.pairWins >= 50 },
  { id: 'legend', name: 'Living Legend', requirement: 'Reach Legend rank', unlockCondition: (s) => s.totalWins >= 2500 },
];

export function getUnlockedTitles(stats: PlayerStats): Title[] {
  return TITLES.filter(title => title.unlockCondition(stats));
}
