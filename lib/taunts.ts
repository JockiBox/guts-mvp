// Taunts System - Quick taunts players can send to bots

export interface Taunt {
  id: string;
  name: string;
  text: string;
  emoji: string;
  sound?: string;
  animation: 'shake' | 'bounce' | 'spin' | 'grow' | 'flash';
  category: 'friendly' | 'confident' | 'mock' | 'celebrate';
  isDefault: boolean; // Available to everyone
}

export const TAUNTS: Taunt[] = [
  // Default taunts (free for all)
  { id: 'wave', name: 'Wave', text: 'Hey there!', emoji: '👋', animation: 'bounce', category: 'friendly', isDefault: true },
  { id: 'thumbsup', name: 'Good Luck', text: 'Good luck!', emoji: '👍', animation: 'bounce', category: 'friendly', isDefault: true },
  { id: 'think', name: 'Hmm...', text: 'Interesting...', emoji: '🤔', animation: 'shake', category: 'confident', isDefault: true },
  { id: 'eyes', name: 'Watching', text: 'I see you...', emoji: '👀', animation: 'shake', category: 'mock', isDefault: true },

  // Purchasable taunts
  { id: 'laugh', name: 'Evil Laugh', text: 'MWAHAHAHA!', emoji: '😂', animation: 'shake', category: 'mock', isDefault: false },
  { id: 'cry', name: 'Cry Baby', text: 'Boo hoo!', emoji: '😭', animation: 'bounce', category: 'mock', isDefault: false },
  { id: 'flex', name: 'Flex', text: 'Check these out!', emoji: '💪', animation: 'grow', category: 'confident', isDefault: false },
  { id: 'money', name: 'Money Rain', text: 'Make it RAIN!', emoji: '💸', animation: 'bounce', category: 'celebrate', isDefault: false },
  { id: 'mic', name: 'Mic Drop', text: '*drops mic*', emoji: '🎤', animation: 'bounce', category: 'celebrate', isDefault: false },
  { id: 'crown', name: 'Crown Me', text: 'BOW DOWN!', emoji: '👑', animation: 'spin', category: 'confident', isDefault: false },
  { id: 'skull', name: 'RIP', text: 'Rest in pieces!', emoji: '💀', animation: 'shake', category: 'mock', isDefault: false },
  { id: 'explosion', name: 'Mind Blown', text: 'BOOM!', emoji: '🤯', animation: 'grow', category: 'celebrate', isDefault: false },
  { id: 'fire', name: 'On Fire', text: 'TOO HOT!', emoji: '🔥', animation: 'flash', category: 'confident', isDefault: false },
  { id: 'ice', name: 'Ice Cold', text: 'Cool as ice!', emoji: '🥶', animation: 'shake', category: 'confident', isDefault: false },
  { id: 'sleep', name: 'Boring', text: '*yawns*', emoji: '😴', animation: 'bounce', category: 'mock', isDefault: false },
  { id: 'clown', name: 'Clown', text: 'Nice costume!', emoji: '🤡', animation: 'spin', category: 'mock', isDefault: false },
];

export interface TauntState {
  unlockedTaunts: string[];
  favoriteTaunts: string[]; // Quick access taunts
  tauntsSent: number;
  lastTauntTime: string;
}

const TAUNT_KEY = 'guts_taunts';

export function loadTauntState(): TauntState {
  if (typeof window === 'undefined') {
    return { unlockedTaunts: [], favoriteTaunts: [], tauntsSent: 0, lastTauntTime: '' };
  }
  try {
    const data = localStorage.getItem(TAUNT_KEY);
    const defaultTaunts = TAUNTS.filter(t => t.isDefault).map(t => t.id);
    const state = data ? JSON.parse(data) : { unlockedTaunts: [], favoriteTaunts: [], tauntsSent: 0, lastTauntTime: '' };
    // Ensure default taunts are always unlocked
    state.unlockedTaunts = [...new Set([...state.unlockedTaunts, ...defaultTaunts])];
    return state;
  } catch {
    const defaultTaunts = TAUNTS.filter(t => t.isDefault).map(t => t.id);
    return { unlockedTaunts: defaultTaunts, favoriteTaunts: [], tauntsSent: 0, lastTauntTime: '' };
  }
}

export function saveTauntState(state: TauntState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TAUNT_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save taunt state:', e);
  }
}

export function unlockTaunt(tauntId: string): boolean {
  const state = loadTauntState();
  if (state.unlockedTaunts.includes(tauntId)) return false;

  state.unlockedTaunts.push(tauntId);
  saveTauntState(state);
  return true;
}

export function isTauntUnlocked(tauntId: string): boolean {
  const taunt = TAUNTS.find(t => t.id === tauntId);
  if (taunt?.isDefault) return true;
  return loadTauntState().unlockedTaunts.includes(tauntId);
}

export function getUnlockedTaunts(): Taunt[] {
  const state = loadTauntState();
  return TAUNTS.filter(t => t.isDefault || state.unlockedTaunts.includes(t.id));
}

export function setFavoriteTaunts(tauntIds: string[]): void {
  const state = loadTauntState();
  state.favoriteTaunts = tauntIds.slice(0, 4); // Max 4 favorites
  saveTauntState(state);
}

export function recordTauntSent(): void {
  const state = loadTauntState();
  state.tauntsSent += 1;
  state.lastTauntTime = new Date().toISOString();
  saveTauntState(state);
}

export function getTauntById(id: string): Taunt | null {
  return TAUNTS.find(t => t.id === id) || null;
}

// Bot response to player taunts
export function getBotTauntResponse(botPersonality: string, playerTauntCategory: string): string {
  const responses: Record<string, Record<string, string[]>> = {
    aggressive: {
      friendly: ['Whatever.', 'Focus on the game!', 'Is that all?'],
      confident: ['We\'ll see about that!', 'Talk is cheap!', 'Prove it!'],
      mock: ['You\'ll regret that!', 'OH IT\'S ON!', 'Big mistake!'],
      celebrate: ['Not for long!', 'Enjoy it while it lasts!', 'My turn next!'],
    },
    conservative: {
      friendly: ['Thank you.', 'Same to you.', 'How polite.'],
      confident: ['Interesting.', 'We shall see.', 'Patience...'],
      mock: ['How immature.', 'Are you done?', '*ignores*'],
      celebrate: ['Congratulations.', 'Well played.', 'Indeed.'],
    },
    tricky: {
      friendly: ['Or is it...?', '*winks*', 'How sweet~'],
      confident: ['Maybe you\'re right...', 'Or maybe not!', 'Wouldn\'t you like to know?'],
      mock: ['*laughs mysteriously*', 'All part of the plan...', 'You think so?'],
      celebrate: ['For now...', 'The game isn\'t over!', 'Plot twist incoming!'],
    },
    random: {
      friendly: ['POTATO!', 'Thanks I guess?', '🎲🎲🎲'],
      confident: ['CHAOS REIGNS!', 'Logic is overrated!', 'Roll the dice!'],
      mock: ['NO U', 'Uno reverse!', '*random noises*'],
      celebrate: ['PARTY TIME!', 'WOOOOO!', 'Let\'s gooooo!'],
    },
  };

  const personalityResponses = responses[botPersonality] || responses.aggressive;
  const categoryResponses = personalityResponses[playerTauntCategory] || personalityResponses.friendly;
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}
