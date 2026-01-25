// Bot Backstories - Lore and bios for each bot character

export interface BotBackstory {
  id: string;
  name: string;
  title: string;
  origin: string;
  backstory: string;
  funFact: string;
  catchphrase: string;
  favoriteHand: string;
  nemesis: string;
  unlocked: boolean;
}

export const BOT_BACKSTORIES: Record<string, Omit<BotBackstory, 'id' | 'unlocked'>> = {
  // Match these to profile names in profiles.ts
  'Ace': {
    name: 'Ace',
    title: 'The Card Sharp',
    origin: 'Las Vegas, Nevada',
    backstory: 'Born into a family of professional gamblers, Ace learned to count cards before he could count to ten. Banned from every casino on the Strip, he now seeks glory in underground games.',
    funFact: 'Can shuffle a deck with one hand while blindfolded.',
    catchphrase: 'The house always wins... and I AM the house.',
    favoriteHand: 'Pocket Aces, obviously',
    nemesis: 'Lucky Lucy',
  },
  'Blaze': {
    name: 'Blaze',
    title: 'The Hothead',
    origin: 'Phoenix, Arizona',
    backstory: 'A former firefighter who discovered his true calling at the poker table. His aggressive style has earned him both fortune and infamy.',
    funFact: 'Once won a tournament while the building was literally on fire.',
    catchphrase: 'If you can\'t handle the heat, DROP!',
    favoriteHand: 'Any pair - go big or go home',
    nemesis: 'Ice Queen',
  },
  'Shadow': {
    name: 'Shadow',
    title: 'The Mysterious One',
    origin: 'Unknown',
    backstory: 'No one knows where Shadow came from or where they go between games. Some say they\'re a ghost. Others say they\'re three raccoons in a trenchcoat.',
    funFact: 'Has never been photographed clearly.',
    catchphrase: '...',
    favoriteHand: '6-9 (nice)',
    nemesis: 'Spotlight Steve',
  },
  'Luna': {
    name: 'Luna',
    title: 'The Night Owl',
    origin: 'Transylvania (claims)',
    backstory: 'Luna only plays after sunset and insists her powers are strongest during full moons. Whether she\'s actually supernatural or just really committed to the bit remains unclear.',
    funFact: 'Has a pet bat named "Jackpot".',
    catchphrase: 'The night is dark and full of... my winnings!',
    favoriteHand: 'King-Queen (royalty recognizes royalty)',
    nemesis: 'Sunny',
  },
  'Tank': {
    name: 'Tank',
    title: 'The Immovable',
    origin: 'Moscow, Russia',
    backstory: 'A former chess grandmaster who found poker "more exciting." His methodical, defensive style frustrates aggressive players to no end.',
    funFact: 'Has never folded a pair in 10,000 games.',
    catchphrase: 'Patience is not just a virtue. It\'s a weapon.',
    favoriteHand: 'Any pair - they never fold pairs',
    nemesis: 'Speed Demon',
  },
  'Jinx': {
    name: 'Jinx',
    title: 'The Wild Card',
    origin: 'New Orleans, Louisiana',
    backstory: 'Jinx plays by feel, not logic. Their chaotic style is impossible to predict, which is either genius or madness. Probably both.',
    funFact: 'Won a tournament by accidentally spilling coffee on their cards and getting new ones.',
    catchphrase: 'Chaos is just opportunity in disguise!',
    favoriteHand: 'Whatever the universe gives them',
    nemesis: 'The Calculator',
  },
  'Viper': {
    name: 'Viper',
    title: 'The Cold-Blooded',
    origin: 'Miami, Florida',
    backstory: 'Former Wall Street trader who got bored making money the legal way. Now applies the same ruthless tactics to cards.',
    funFact: 'Has a snake tattoo that "tells them when to strike."',
    catchphrase: 'Nothing personal. Just business.',
    favoriteHand: 'Ace-King (the big slick)',
    nemesis: 'Honest Abe',
  },
  'Phoenix': {
    name: 'Phoenix',
    title: 'The Comeback Kid',
    origin: 'Denver, Colorado',
    backstory: 'Has gone bankrupt seven times and come back stronger each time. Some say they\'re immortal. They just have really good credit.',
    funFact: 'Once won back their entire life savings in a single night.',
    catchphrase: 'You can\'t keep a good player down!',
    favoriteHand: 'Whatever they\'re dealt - it\'s all about the comeback',
    nemesis: 'Final Boss Fred',
  },
};

const BACKSTORY_KEY = 'guts_backstories_unlocked';

export function loadUnlockedBackstories(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(BACKSTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedBackstories(unlocked: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BACKSTORY_KEY, JSON.stringify(unlocked));
  } catch (e) {
    console.error('Failed to save backstories:', e);
  }
}

export function unlockBackstory(botName: string): boolean {
  const unlocked = loadUnlockedBackstories();
  if (unlocked.includes(botName)) return false;

  unlocked.push(botName);
  saveUnlockedBackstories(unlocked);
  return true;
}

export function isBackstoryUnlocked(botName: string): boolean {
  return loadUnlockedBackstories().includes(botName);
}

export function getBackstory(botName: string): BotBackstory | null {
  const backstory = BOT_BACKSTORIES[botName];
  if (!backstory) return null;

  return {
    ...backstory,
    id: botName,
    unlocked: isBackstoryUnlocked(botName),
  };
}

// Unlock backstory when you beat a bot 3 times
export function checkBackstoryUnlock(botName: string, timesBeaten: number): boolean {
  if (timesBeaten >= 3 && !isBackstoryUnlocked(botName)) {
    return unlockBackstory(botName);
  }
  return false;
}
