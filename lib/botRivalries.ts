// Bot Rivalries - Bots taunt each other!

export interface RivalryMessage {
  fromPersonality: string;
  toPersonality: string;
  situation: 'taunt' | 'beat' | 'lost_to' | 'both_hold' | 'both_drop';
  messages: string[];
}

// Personality-based rivalry taunts
const RIVALRY_MESSAGES: RivalryMessage[] = [
  // Aggressive vs Conservative
  { fromPersonality: 'aggressive', toPersonality: 'conservative', situation: 'taunt', messages: [
    "Too scared to play,\n{target}?\nPathetic!",
    "While you hide,\nI'm taking pots!\nCoward!",
    "Playing it safe?\nThat's why you LOSE!\nStep up!",
  ]},
  { fromPersonality: 'aggressive', toPersonality: 'conservative', situation: 'beat', messages: [
    "That's what you get\nfor playing scared!\n{target} is DONE!",
    "Should've held,\n{target}!\nNow you're BROKE!",
  ]},
  { fromPersonality: 'conservative', toPersonality: 'aggressive', situation: 'beat', messages: [
    "Patience beats\nrecklessness.\nLearn, {target}!",
    "Slow and steady,\n{target}.\nYou rushed. You lost.",
  ]},

  // Aggressive vs Tricky
  { fromPersonality: 'aggressive', toPersonality: 'tricky', situation: 'taunt', messages: [
    "Tricks don't work\non me, {target}!\nBring POWER!",
    "All that scheming...\nfor nothing!\nI see through you!",
  ]},
  { fromPersonality: 'tricky', toPersonality: 'aggressive', situation: 'beat', messages: [
    "Outsmarted.\nAll that aggression...\nwasted on me, {target}!",
    "Brains beat brawn,\n{target}.\nEvery time.",
  ]},

  // Aggressive vs Random
  { fromPersonality: 'aggressive', toPersonality: 'random', situation: 'taunt', messages: [
    "Chaos is no match\nfor raw POWER!\n{target} is toast!",
    "Random garbage!\nI'll crush you,\n{target}!",
  ]},
  { fromPersonality: 'random', toPersonality: 'aggressive', situation: 'beat', messages: [
    "CHAOS WINS!\nCan't predict me,\n{target}! Hahaha!",
    "Random > Rage!\n{target} got\nOUT-CHAOSED!",
  ]},

  // Conservative vs Tricky
  { fromPersonality: 'conservative', toPersonality: 'tricky', situation: 'taunt', messages: [
    "Your tricks are\nobvious, {target}.\nI see everything.",
    "Wisdom sees through\nillusions.\nNice try, {target}.",
  ]},
  { fromPersonality: 'tricky', toPersonality: 'conservative', situation: 'beat', messages: [
    "Too predictable,\n{target}.\nI read you perfectly!",
    "Conservative = \npredictable.\nEasy win!",
  ]},

  // Conservative vs Random
  { fromPersonality: 'conservative', toPersonality: 'random', situation: 'taunt', messages: [
    "Chaos has no\nstrategy.\nYou'll lose, {target}.",
    "Random nonsense\ncan't beat logic.\nWatch and learn!",
  ]},
  { fromPersonality: 'random', toPersonality: 'conservative', situation: 'beat', messages: [
    "HAHA! Your 'wisdom'\ndidn't see THAT!\nChaos rules!",
    "Can't calculate\nRANDOM!\n{target} got REKT!",
  ]},

  // Tricky vs Random
  { fromPersonality: 'tricky', toPersonality: 'random', situation: 'taunt', messages: [
    "Even chaos\nhas patterns.\nI'll find yours!",
    "Your randomness\nis predictable,\n{target}. Ironic.",
  ]},
  { fromPersonality: 'random', toPersonality: 'tricky', situation: 'beat', messages: [
    "Can't trick CHAOS!\n{target} outsmarted\nby NONSENSE!",
    "All your schemes...\nmeant NOTHING!\nRandom wins!",
  ]},

  // Generic both hold
  { fromPersonality: 'aggressive', toPersonality: 'aggressive', situation: 'both_hold', messages: [
    "Let's GO!\nBoth holding!\nThis is gonna HURT!",
    "Two warriors!\nOnly ONE survives!\nBring it, {target}!",
  ]},
  { fromPersonality: 'conservative', toPersonality: 'conservative', situation: 'both_hold', messages: [
    "Two wise players.\nMay the best\nhand win.",
    "Respect, {target}.\nBut I'll still\nbeat you.",
  ]},
];

// Generic messages for any personality
const GENERIC_TAUNTS = [
  "You're going DOWN,\n{target}!\nWatch and learn!",
  "Easy target!\n{target} doesn't\nstand a chance!",
  "This round is MINE!\n{target} can't\ncompete!",
];

const GENERIC_BEAT = [
  "Got you, {target}!\nToo easy!\nNext victim?",
  "{target} DESTROYED!\nWho's next?!\nAnyone?",
  "And THAT'S how\nit's done!\nSee ya, {target}!",
];

const GENERIC_LOST = [
  "Lucky shot,\n{target}!\nWon't happen again!",
  "Enjoy it, {target}.\nRevenge is coming!\nMark my words!",
  "This isn't over,\n{target}!\nI remember this!",
];

export function getRivalryMessage(
  fromPersonality: string,
  toPersonality: string,
  targetName: string,
  situation: 'taunt' | 'beat' | 'lost_to' | 'both_hold' | 'both_drop'
): string | null {
  // 40% chance to generate a rivalry message
  if (Math.random() > 0.4) return null;

  // Find specific rivalry message
  const rivalryMatch = RIVALRY_MESSAGES.find(
    r => r.fromPersonality === fromPersonality &&
         r.toPersonality === toPersonality &&
         r.situation === situation
  );

  let messages: string[];

  if (rivalryMatch) {
    messages = rivalryMatch.messages;
  } else {
    // Use generic messages
    switch (situation) {
      case 'taunt':
        messages = GENERIC_TAUNTS;
        break;
      case 'beat':
        messages = GENERIC_BEAT;
        break;
      case 'lost_to':
        messages = GENERIC_LOST;
        break;
      default:
        return null;
    }
  }

  const message = messages[Math.floor(Math.random() * messages.length)];
  return message.replace('{target}', targetName);
}

// Get a random bot to taunt (not self, not human)
export function selectRivalryTarget(
  currentBotId: string,
  allPlayers: { id: string; name: string; personality: string; isHuman: boolean; isActive: boolean }[]
): { id: string; name: string; personality: string } | null {
  const validTargets = allPlayers.filter(
    p => p.id !== currentBotId && !p.isHuman && p.isActive
  );

  if (validTargets.length === 0) return null;

  return validTargets[Math.floor(Math.random() * validTargets.length)];
}

// Generate a rivalry taunt between two random bots
export function generateRivalryTaunt(
  players: { id: string; name: string; personality?: string; isHuman: boolean; isActive: boolean }[]
): { from: string; to: string; message: string } | null {
  const bots = players.filter(p => !p.isHuman && p.isActive);
  if (bots.length < 2) return null;

  // Pick two random bots
  const shuffled = [...bots].sort(() => Math.random() - 0.5);
  const fromBot = shuffled[0];
  const toBot = shuffled[1];

  const fromPersonality = fromBot.personality || 'aggressive';
  const toPersonality = toBot.personality || 'aggressive';

  const message = getRivalryMessage(fromPersonality, toPersonality, toBot.name, 'taunt');
  if (!message) return null;

  return {
    from: fromBot.name,
    to: toBot.name,
    message,
  };
}
