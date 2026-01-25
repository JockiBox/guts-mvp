// Ghost Stories - Spooky messages and animations when ghost wins

export interface GhostStory {
  message: string;
  subMessage: string;
  icon: string;
  animation: 'fade' | 'shake' | 'float' | 'glitch';
}

const GHOST_WIN_STORIES: GhostStory[] = [
  { message: 'THE GHOST RISES!', subMessage: 'From beyond the grave...', icon: '👻', animation: 'float' },
  { message: 'HAUNTED!', subMessage: 'The spirits claim victory!', icon: '💀', animation: 'shake' },
  { message: 'PHANTOM VICTORY', subMessage: 'You cannot defeat what is already dead...', icon: '👻', animation: 'fade' },
  { message: 'SPECTRAL TRIUMPH', subMessage: 'The ghost hand prevails!', icon: '👁️', animation: 'glitch' },
  { message: 'BOO!', subMessage: 'Scared ya, didn\'t I?', icon: '👻', animation: 'shake' },
  { message: 'GHOSTED!', subMessage: 'Left on read... by the dead!', icon: '💀', animation: 'float' },
  { message: 'ECTOPLASMIC WIN', subMessage: 'Slimed by defeat!', icon: '🟢', animation: 'fade' },
  { message: 'SPIRIT BOMB!', subMessage: 'The afterlife strikes back!', icon: '💥', animation: 'shake' },
  { message: 'GRAVE MISTAKE', subMessage: 'Should have dropped...', icon: '⚰️', animation: 'fade' },
  { message: 'BEYOND THE VEIL', subMessage: 'Death always wins!', icon: '🌑', animation: 'glitch' },
  { message: 'POLTERGEIST!', subMessage: 'Your tokens have been possessed!', icon: '👻', animation: 'shake' },
  { message: 'REST IN PIECES', subMessage: 'Your bankroll, that is...', icon: '💀', animation: 'fade' },
];

const GHOST_APPEAR_STORIES: GhostStory[] = [
  { message: 'A GHOST APPEARS...', subMessage: 'The dead join the game!', icon: '👻', animation: 'float' },
  { message: 'FROM THE SHADOWS', subMessage: 'A spectral hand emerges!', icon: '🌑', animation: 'fade' },
  { message: 'UNINVITED GUEST', subMessage: 'The ghost wants to play!', icon: '👻', animation: 'shake' },
  { message: 'SPIRIT SUMMONED', subMessage: 'Another challenger approaches!', icon: '✨', animation: 'glitch' },
];

export function getRandomGhostWinStory(): GhostStory {
  return GHOST_WIN_STORIES[Math.floor(Math.random() * GHOST_WIN_STORIES.length)];
}

export function getRandomGhostAppearStory(): GhostStory {
  return GHOST_APPEAR_STORIES[Math.floor(Math.random() * GHOST_APPEAR_STORIES.length)];
}

// Ghost personality based on hand strength
export function getGhostPersonality(handValue: number): { name: string; trait: string } {
  if (handValue >= 2000) {
    return { name: 'The Reaper', trait: 'DEADLY' };
  } else if (handValue >= 1000) {
    return { name: 'Phantom Lord', trait: 'POWERFUL' };
  } else if (handValue >= 200) {
    return { name: 'Wandering Spirit', trait: 'STRONG' };
  } else if (handValue >= 150) {
    return { name: 'Lost Soul', trait: 'AVERAGE' };
  } else {
    return { name: 'Weak Specter', trait: 'FEEBLE' };
  }
}
