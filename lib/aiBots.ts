// AI Bot Management System
// Bots track wins/losses, get replaced at 100 losses, earn extra lives at 100 wins

export interface AIBot {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  wins: number;
  losses: number;
  winMilestones: number; // Number of times they've hit 100 wins (each gives +100 loss buffer)
  createdAt: string;
  replacedAt?: string;
  rank?: number;
  gamesPlayed: number;
}

// Loss threshold = 100 base + 100 per win milestone
export function getLossThreshold(bot: AIBot): number {
  return 100 + (bot.winMilestones * 100);
}

// Check if bot should be replaced
export function shouldReplaceBot(bot: AIBot): boolean {
  return bot.losses >= getLossThreshold(bot);
}

// Bot name prefixes and suffixes for variety
const NAME_PREFIXES = [
  'Captain', 'Dr.', 'Professor', 'Agent', 'Lord', 'Lady', 'Sir', 'The',
  'Baron', 'Duke', 'Ace', 'Lucky', 'Wild', 'Slick', 'Fast', 'Cool',
  'Mighty', 'Silent', 'Shadow', 'Golden', 'Iron', 'Steel', 'Diamond',
  'Mystic', 'Cosmic', 'Neon', 'Cyber', 'Turbo', 'Ultra', 'Mega',
];

const NAME_ROOTS = [
  'Jack', 'Queen', 'King', 'Joker', 'Bluff', 'Chips', 'Cards', 'Dice',
  'Vegas', 'Monte', 'Carlo', 'Rio', 'Ace', 'Spade', 'Heart', 'Club',
  'Diamond', 'Shark', 'Wolf', 'Fox', 'Eagle', 'Tiger', 'Bear', 'Lion',
  'Phoenix', 'Dragon', 'Viper', 'Cobra', 'Hawk', 'Raven', 'Storm',
  'Thunder', 'Lightning', 'Blaze', 'Frost', 'Stone', 'Steel', 'Blade',
  'Shadow', 'Ghost', 'Phantom', 'Specter', 'Wraith', 'Spirit', 'Soul',
];

const NAME_SUFFIXES = [
  'stein', 'son', 'ton', 'worth', 'wood', 'field', 'berg', 'man',
  'ovich', 'ski', 'ez', 'ini', 'elli', 'ardo', 'enzo', 'oro',
  'X', 'Z', '2000', '3000', 'Prime', 'Max', 'Pro', 'Elite',
  'Jr.', 'Sr.', 'III', 'the Great', 'the Bold', 'the Wise',
];

const EMOJIS = [
  '🤖', '👾', '🎭', '🎪', '🎯', '🎲', '🃏', '♠️', '♥️', '♦️', '♣️',
  '🦊', '🐺', '🦅', '🐯', '🦁', '🐻', '🦈', '🐉', '🦎', '🦂',
  '👻', '💀', '🎃', '👽', '🤠', '🥷', '🧙', '🧛', '🧟', '🦹',
  '⚡', '🔥', '❄️', '💎', '🌟', '⭐', '💫', '🌙', '☀️', '🌈',
];

const PERSONALITIES = [
  'aggressive', 'cautious', 'unpredictable', 'calculated', 'bluffer',
  'tight', 'loose', 'passive', 'maniac', 'rock', 'calling-station',
  'trapper', 'value-bettor', 'pot-controller', 'showdown-hunter',
];

const CATCHPHRASES = [
  "I've seen better hands at a clock shop.",
  "Your poker face needs work.",
  "Is that your best? Really?",
  "I eat cards like you for breakfast.",
  "You call that a hand?",
  "Watch and learn, human.",
  "The odds are never in your favor.",
  "I was built for this.",
  "Processing your defeat...",
  "Another day, another victory.",
  "You're playing checkers, I'm playing chess.",
  "My circuits are tingling with victory.",
  "Error 404: Your skills not found.",
  "Calculating your demise...",
  "I never bluff. Okay, sometimes I bluff.",
];

// Generate a unique bot name
function generateBotName(existingNames: Set<string>): string {
  let attempts = 0;
  while (attempts < 100) {
    const usePrefix = Math.random() > 0.3;
    const useSuffix = Math.random() > 0.5;

    let name = '';
    if (usePrefix) {
      name += NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)] + ' ';
    }
    name += NAME_ROOTS[Math.floor(Math.random() * NAME_ROOTS.length)];
    if (useSuffix && !usePrefix) {
      name += NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    }

    if (!existingNames.has(name)) {
      return name;
    }
    attempts++;
  }
  // Fallback: add random number
  return `Bot_${Math.floor(Math.random() * 10000)}`;
}

// Generate a new unique bot
export function generateNewBot(existingBots: AIBot[]): AIBot {
  const existingNames = new Set(existingBots.map(b => b.name));

  return {
    id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: generateBotName(existingNames),
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
    wins: 0,
    losses: 0,
    winMilestones: 0,
    createdAt: new Date().toISOString(),
    gamesPlayed: 0,
  };
}

// Get a random catchphrase for a bot
export function getBotCatchphrase(): string {
  return CATCHPHRASES[Math.floor(Math.random() * CATCHPHRASES.length)];
}

// Storage key
const STORAGE_KEY = 'guts_ai_bots';
const RETIRED_KEY = 'guts_retired_bots';

// Load bots from storage
export function loadBots(): AIBot[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with 100 bots
      const bots = initializeBotPool();
      saveBots(bots);
      return bots;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save bots to storage
export function saveBots(bots: AIBot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
  } catch (e) {
    console.error('Failed to save bots:', e);
  }
}

// Load retired bots (hall of fame / shame)
export function loadRetiredBots(): AIBot[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RETIRED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save retired bot
function saveRetiredBot(bot: AIBot): void {
  if (typeof window === 'undefined') return;
  try {
    const retired = loadRetiredBots();
    bot.replacedAt = new Date().toISOString();
    retired.unshift(bot); // Add to front
    // Keep last 500 retired bots
    const trimmed = retired.slice(0, 500);
    localStorage.setItem(RETIRED_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save retired bot:', e);
  }
}

// Initialize pool of 100 bots
function initializeBotPool(): AIBot[] {
  const bots: AIBot[] = [];
  for (let i = 0; i < 100; i++) {
    bots.push(generateNewBot(bots));
  }
  return bots;
}

// Get ranked bots (sorted by win rate, then total wins)
export function getRankedBots(): AIBot[] {
  const bots = loadBots();

  // Calculate rank based on: win rate (minimum 10 games) then total wins
  const ranked = bots
    .map(bot => ({
      ...bot,
      winRate: bot.gamesPlayed >= 10 ? bot.wins / bot.gamesPlayed : 0,
    }))
    .sort((a, b) => {
      // Primary: win rate (for bots with 10+ games)
      if (a.gamesPlayed >= 10 && b.gamesPlayed >= 10) {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      } else if (a.gamesPlayed >= 10) {
        return -1;
      } else if (b.gamesPlayed >= 10) {
        return 1;
      }
      // Secondary: total wins
      if (b.wins !== a.wins) return b.wins - a.wins;
      // Tertiary: fewer losses
      return a.losses - b.losses;
    })
    .map((bot, index) => ({ ...bot, rank: index + 1 }));

  return ranked;
}

// Get random bots for a game (excluding recently played if possible)
export function getRandomBots(count: number, excludeIds: string[] = []): AIBot[] {
  const bots = loadBots();
  const available = bots.filter(b => !excludeIds.includes(b.id));

  // Shuffle and pick
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Record game result for a bot
export function recordBotResult(botId: string, won: boolean): { bot: AIBot; replaced: boolean; newBot?: AIBot } {
  const bots = loadBots();
  const botIndex = bots.findIndex(b => b.id === botId);

  if (botIndex === -1) {
    console.error('Bot not found:', botId);
    return { bot: bots[0], replaced: false };
  }

  const bot = { ...bots[botIndex] };
  bot.gamesPlayed++;

  if (won) {
    bot.wins++;
    // Check for 100-win milestone
    const previousMilestones = bot.winMilestones;
    const newMilestones = Math.floor(bot.wins / 100);
    if (newMilestones > previousMilestones) {
      bot.winMilestones = newMilestones;
      console.log(`🏆 ${bot.name} earned a win milestone! Now has ${bot.winMilestones * 100} extra lives.`);
    }
  } else {
    bot.losses++;
  }

  // Check if bot should be replaced
  if (shouldReplaceBot(bot)) {
    console.log(`💀 ${bot.name} has been eliminated after ${bot.losses} losses!`);
    saveRetiredBot(bot);

    // Generate replacement
    const newBot = generateNewBot(bots);
    bots[botIndex] = newBot;
    saveBots(bots);

    return { bot, replaced: true, newBot };
  }

  // Update bot in list
  bots[botIndex] = bot;
  saveBots(bots);

  return { bot, replaced: false };
}

// Get bot by ID
export function getBotById(id: string): AIBot | undefined {
  const bots = loadBots();
  return bots.find(b => b.id === id);
}

// Get top N bots
export function getTopBots(n: number = 10): AIBot[] {
  return getRankedBots().slice(0, n);
}

// Get bot stats summary
export function getBotStats(): {
  totalBots: number;
  totalGamesPlayed: number;
  totalRetired: number;
  topWinRate: { bot: AIBot; rate: number } | null;
  mostWins: AIBot | null;
  mostLosses: AIBot | null;
} {
  const bots = loadBots();
  const retired = loadRetiredBots();

  const totalGamesPlayed = bots.reduce((sum, b) => sum + b.gamesPlayed, 0);

  // Find bot with highest win rate (min 20 games)
  const eligibleForRate = bots.filter(b => b.gamesPlayed >= 20);
  let topWinRate: { bot: AIBot; rate: number } | null = null;
  if (eligibleForRate.length > 0) {
    const best = eligibleForRate.reduce((best, bot) => {
      const rate = bot.wins / bot.gamesPlayed;
      const bestRate = best.wins / best.gamesPlayed;
      return rate > bestRate ? bot : best;
    });
    topWinRate = { bot: best, rate: best.wins / best.gamesPlayed };
  }

  const mostWins = bots.reduce((best, bot) => bot.wins > best.wins ? bot : best, bots[0]);
  const mostLosses = bots.reduce((best, bot) => bot.losses > best.losses ? bot : best, bots[0]);

  return {
    totalBots: bots.length,
    totalGamesPlayed,
    totalRetired: retired.length,
    topWinRate,
    mostWins: mostWins?.wins > 0 ? mostWins : null,
    mostLosses: mostLosses?.losses > 0 ? mostLosses : null,
  };
}

// Convert legacy bot names to use the new system
export function migrateLegacyBot(name: string, emoji: string): AIBot {
  const bots = loadBots();

  // Check if this legacy bot name already exists
  const existing = bots.find(b => b.name === name);
  if (existing) {
    return existing;
  }

  // Create a new bot with the legacy name
  const newBot: AIBot = {
    id: `legacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    emoji,
    personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
    wins: 0,
    losses: 0,
    winMilestones: 0,
    createdAt: new Date().toISOString(),
    gamesPlayed: 0,
  };

  // If we have less than 100 bots, add it. Otherwise, replace a random low-ranked bot
  if (bots.length < 100) {
    bots.push(newBot);
  } else {
    // Replace lowest ranked bot that hasn't played much
    const ranked = getRankedBots();
    const replaceable = ranked.filter(b => b.gamesPlayed < 5);
    if (replaceable.length > 0) {
      const toReplace = replaceable[replaceable.length - 1];
      const index = bots.findIndex(b => b.id === toReplace.id);
      if (index !== -1) {
        bots[index] = newBot;
      }
    }
  }

  saveBots(bots);
  return newBot;
}
