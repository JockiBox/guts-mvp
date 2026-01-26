// Weekly Challenges System

export interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  reward: number;
  type: 'wins' | 'rounds' | 'tokens_won' | 'ghosts' | 'streaks' | 'games';
  completed: boolean;
  claimed: boolean;
}

export interface WeeklyProgress {
  weekStart: string; // ISO date of week start
  challenges: WeeklyChallenge[];
  bonusClaimed: boolean; // Claim bonus for completing all
}

const WEEKLY_CHALLENGE_TEMPLATES = [
  { name: 'Weekly Warrior', description: 'Win {target} rounds this week', icon: '🗡️', target: 50, reward: 200, type: 'wins' as const },
  { name: 'Endurance', description: 'Play {target} rounds this week', icon: '🏃', target: 100, reward: 150, type: 'rounds' as const },
  { name: 'Big Earner', description: 'Win {target} tokens total', icon: '💰', target: 500, reward: 250, type: 'tokens_won' as const },
  { name: 'Ghost Hunter', description: 'Defeat {target} ghosts', icon: '👻', target: 10, reward: 300, type: 'ghosts' as const },
  { name: 'Hot Streak', description: 'Get a {target}-win streak', icon: '🔥', target: 5, reward: 200, type: 'streaks' as const },
  { name: 'Dedicated Player', description: 'Complete {target} games', icon: '🎮', target: 20, reward: 175, type: 'games' as const },
];

const STORAGE_KEY = 'guts_weekly_challenges';

function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

function generateWeeklyChallenges(): WeeklyChallenge[] {
  // Pick 4 random challenges
  const shuffled = [...WEEKLY_CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);

  return selected.map((template, i) => ({
    id: `weekly_${getWeekStart()}_${i}`,
    name: template.name,
    description: template.description.replace('{target}', template.target.toString()),
    icon: template.icon,
    target: template.target,
    progress: 0,
    reward: template.reward,
    type: template.type,
    completed: false,
    claimed: false,
  }));
}

export function loadWeeklyChallenges(): WeeklyProgress {
  if (typeof window === 'undefined') {
    return { weekStart: getWeekStart(), challenges: [], bonusClaimed: false };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const progress: WeeklyProgress = JSON.parse(data);
      // Check if it's a new week
      if (progress.weekStart !== getWeekStart()) {
        // Reset for new week
        const newProgress: WeeklyProgress = {
          weekStart: getWeekStart(),
          challenges: generateWeeklyChallenges(),
          bonusClaimed: false,
        };
        saveWeeklyChallenges(newProgress);
        return newProgress;
      }
      return progress;
    }
  } catch {}

  // Initialize
  const newProgress: WeeklyProgress = {
    weekStart: getWeekStart(),
    challenges: generateWeeklyChallenges(),
    bonusClaimed: false,
  };
  saveWeeklyChallenges(newProgress);
  return newProgress;
}

export function saveWeeklyChallenges(progress: WeeklyProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function updateWeeklyProgress(
  type: WeeklyChallenge['type'],
  amount: number = 1
): { challenge?: WeeklyChallenge; completed: boolean } {
  const progress = loadWeeklyChallenges();

  let result: { challenge?: WeeklyChallenge; completed: boolean } = { completed: false };

  progress.challenges = progress.challenges.map(c => {
    if (c.type === type && !c.completed) {
      c.progress = Math.min(c.progress + amount, c.target);
      if (c.progress >= c.target) {
        c.completed = true;
        result = { challenge: c, completed: true };
      }
    }
    return c;
  });

  saveWeeklyChallenges(progress);
  return result;
}

export function claimWeeklyReward(challengeId: string): number {
  const progress = loadWeeklyChallenges();

  const challenge = progress.challenges.find(c => c.id === challengeId);
  if (challenge && challenge.completed && !challenge.claimed) {
    challenge.claimed = true;
    saveWeeklyChallenges(progress);
    return challenge.reward;
  }
  return 0;
}

export function claimWeeklyBonus(): number {
  const progress = loadWeeklyChallenges();

  if (progress.bonusClaimed) return 0;

  const allCompleted = progress.challenges.every(c => c.completed);
  if (!allCompleted) return 0;

  progress.bonusClaimed = true;
  saveWeeklyChallenges(progress);

  return 500; // Bonus for completing all weekly challenges
}

export function getWeeklyStats(): {
  completed: number;
  total: number;
  allDone: boolean;
  daysLeft: number;
} {
  const progress = loadWeeklyChallenges();
  const completed = progress.challenges.filter(c => c.completed).length;

  // Calculate days left in week
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysLeft = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  return {
    completed,
    total: progress.challenges.length,
    allDone: completed === progress.challenges.length,
    daysLeft,
  };
}

// Alias for convenience
export const updateWeeklyChallengeProgress = updateWeeklyProgress;
