// Daily Challenges System for GUTS

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  reward: number;
  type: 'wins' | 'pairs' | 'ghosts' | 'streak' | 'holds' | 'games';
}

// Pool of possible challenges
const CHALLENGE_POOL: Omit<Challenge, 'id'>[] = [
  { name: 'Winner', description: 'Win 3 hands', icon: '🏆', target: 3, reward: 15, type: 'wins' },
  { name: 'Triple Threat', description: 'Win 5 hands', icon: '🎯', target: 5, reward: 30, type: 'wins' },
  { name: 'Dominator', description: 'Win 10 hands', icon: '👑', target: 10, reward: 75, type: 'wins' },
  { name: 'Pair Hunter', description: 'Win 2 hands with pairs', icon: '✌️', target: 2, reward: 25, type: 'pairs' },
  { name: 'Pair Master', description: 'Win 5 hands with pairs', icon: '🎭', target: 5, reward: 60, type: 'pairs' },
  { name: 'Ghost Buster', description: 'Beat 2 ghost hands', icon: '👻', target: 2, reward: 30, type: 'ghosts' },
  { name: 'Exorcist', description: 'Beat 5 ghost hands', icon: '🔮', target: 5, reward: 75, type: 'ghosts' },
  { name: 'Hot Streak', description: 'Win 3 hands in a row', icon: '🔥', target: 3, reward: 40, type: 'streak' },
  { name: 'On Fire', description: 'Win 5 hands in a row', icon: '💥', target: 5, reward: 100, type: 'streak' },
  { name: 'Hold Strong', description: 'Hold 10 times', icon: '💪', target: 10, reward: 20, type: 'holds' },
  { name: 'Brave Heart', description: 'Hold 20 times', icon: '❤️‍🔥', target: 20, reward: 40, type: 'holds' },
  { name: 'Active Player', description: 'Play 10 rounds', icon: '🎮', target: 10, reward: 20, type: 'games' },
  { name: 'Dedicated', description: 'Play 25 rounds', icon: '🎲', target: 25, reward: 50, type: 'games' },
];

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  challenges: {
    challenge: Challenge;
    progress: number;
    completed: boolean;
    claimed: boolean;
  }[];
}

const STORAGE_KEY = 'guts_daily_challenges';

function generateDailyChallenges(): Challenge[] {
  // Shuffle and pick 3 different challenge types
  const shuffled = [...CHALLENGE_POOL].sort(() => Math.random() - 0.5);
  const selected: Challenge[] = [];
  const usedTypes = new Set<string>();

  for (const challenge of shuffled) {
    if (selected.length >= 3) break;
    if (!usedTypes.has(challenge.type)) {
      usedTypes.add(challenge.type);
      selected.push({
        ...challenge,
        id: `${challenge.type}_${challenge.target}_${Date.now()}`,
      });
    }
  }

  // If we don't have 3 different types, fill with any
  for (const challenge of shuffled) {
    if (selected.length >= 3) break;
    if (!selected.some(c => c.name === challenge.name)) {
      selected.push({
        ...challenge,
        id: `${challenge.type}_${challenge.target}_${Date.now()}_${selected.length}`,
      });
    }
  }

  return selected;
}

export function loadDailyChallenges(): DailyProgress {
  const today = new Date().toISOString().split('T')[0];

  if (typeof window === 'undefined') {
    return {
      date: today,
      challenges: generateDailyChallenges().map(c => ({
        challenge: c,
        progress: 0,
        completed: false,
        claimed: false,
      })),
    };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const saved: DailyProgress = JSON.parse(data);
      // Check if it's a new day
      if (saved.date === today) {
        return saved;
      }
    }
  } catch {
    // Generate new challenges
  }

  // New day or no saved data - generate new challenges
  const newProgress: DailyProgress = {
    date: today,
    challenges: generateDailyChallenges().map(c => ({
      challenge: c,
      progress: 0,
      completed: false,
      claimed: false,
    })),
  };

  saveDailyChallenges(newProgress);
  return newProgress;
}

export function saveDailyChallenges(progress: DailyProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save daily challenges:', e);
  }
}

export function updateChallengeProgress(
  progress: DailyProgress,
  type: Challenge['type'],
  amount: number = 1
): { updated: DailyProgress; newlyCompleted: Challenge[] } {
  const newlyCompleted: Challenge[] = [];

  const updated: DailyProgress = {
    ...progress,
    challenges: progress.challenges.map(c => {
      if (c.challenge.type === type && !c.completed) {
        const newProgress = c.progress + amount;
        const completed = newProgress >= c.challenge.target;
        if (completed && !c.completed) {
          newlyCompleted.push(c.challenge);
        }
        return {
          ...c,
          progress: newProgress,
          completed,
        };
      }
      return c;
    }),
  };

  saveDailyChallenges(updated);
  return { updated, newlyCompleted };
}

export function claimChallengeReward(progress: DailyProgress, challengeId: string): { updated: DailyProgress; reward: number } {
  let reward = 0;

  const updated: DailyProgress = {
    ...progress,
    challenges: progress.challenges.map(c => {
      if (c.challenge.id === challengeId && c.completed && !c.claimed) {
        reward = c.challenge.reward;
        return { ...c, claimed: true };
      }
      return c;
    }),
  };

  saveDailyChallenges(updated);
  return { updated, reward };
}

export function getCompletedUnclaimed(progress: DailyProgress): Challenge[] {
  return progress.challenges
    .filter(c => c.completed && !c.claimed)
    .map(c => c.challenge);
}
