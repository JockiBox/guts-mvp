// Bot Reactions - Animated faces and reactions for bots

export type ReactionType =
  | 'neutral'
  | 'thinking'
  | 'confident'
  | 'nervous'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'shocked'
  | 'crying'
  | 'laughing'
  | 'sweating'
  | 'celebrating';

export interface BotReaction {
  type: ReactionType;
  emoji: string;
  animation: 'bounce' | 'shake' | 'pulse' | 'spin' | 'none';
  duration: number; // ms
}

export const REACTIONS: Record<ReactionType, BotReaction> = {
  neutral: { type: 'neutral', emoji: '😐', animation: 'none', duration: 0 },
  thinking: { type: 'thinking', emoji: '🤔', animation: 'pulse', duration: 2000 },
  confident: { type: 'confident', emoji: '😎', animation: 'none', duration: 3000 },
  nervous: { type: 'nervous', emoji: '😰', animation: 'shake', duration: 2000 },
  happy: { type: 'happy', emoji: '😊', animation: 'bounce', duration: 2000 },
  sad: { type: 'sad', emoji: '😢', animation: 'none', duration: 3000 },
  angry: { type: 'angry', emoji: '😠', animation: 'shake', duration: 2000 },
  shocked: { type: 'shocked', emoji: '😱', animation: 'shake', duration: 1500 },
  crying: { type: 'crying', emoji: '😭', animation: 'shake', duration: 3000 },
  laughing: { type: 'laughing', emoji: '🤣', animation: 'bounce', duration: 2000 },
  sweating: { type: 'sweating', emoji: '😅', animation: 'pulse', duration: 2000 },
  celebrating: { type: 'celebrating', emoji: '🎉', animation: 'spin', duration: 2000 },
};

// Get reaction based on game situation
export function getReactionForSituation(
  situation: 'dealing' | 'deciding' | 'holding' | 'dropping' | 'winning' | 'losing' | 'close_call' | 'big_win' | 'big_loss',
  personality: 'aggressive' | 'conservative' | 'tricky' | 'random' = 'aggressive'
): BotReaction {
  switch (situation) {
    case 'dealing':
      return REACTIONS.thinking;

    case 'deciding':
      if (personality === 'aggressive') return REACTIONS.confident;
      if (personality === 'conservative') return REACTIONS.nervous;
      if (personality === 'tricky') return REACTIONS.thinking;
      return REACTIONS.neutral;

    case 'holding':
      if (personality === 'aggressive') return REACTIONS.confident;
      return REACTIONS.nervous;

    case 'dropping':
      return REACTIONS.sweating;

    case 'winning':
      if (Math.random() < 0.5) return REACTIONS.celebrating;
      return REACTIONS.happy;

    case 'losing':
      if (personality === 'aggressive') return REACTIONS.angry;
      return REACTIONS.sad;

    case 'close_call':
      return REACTIONS.sweating;

    case 'big_win':
      return REACTIONS.celebrating;

    case 'big_loss':
      if (Math.random() < 0.5) return REACTIONS.crying;
      return REACTIONS.angry;

    default:
      return REACTIONS.neutral;
  }
}

// Get random taunt reaction when bot wins against player
export function getWinReaction(wasBluff: boolean): BotReaction {
  if (wasBluff) {
    return REACTIONS.laughing;
  }
  return Math.random() < 0.6 ? REACTIONS.celebrating : REACTIONS.confident;
}

// Get random reaction when bot loses
export function getLoseReaction(wasClose: boolean): BotReaction {
  if (wasClose) {
    return REACTIONS.shocked;
  }
  const reactions = [REACTIONS.sad, REACTIONS.angry, REACTIONS.crying];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

// CSS animation keyframes for reactions
export const REACTION_ANIMATIONS = `
  @keyframes reaction-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes reaction-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  @keyframes reaction-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes reaction-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export function getAnimationStyle(animation: BotReaction['animation'], duration: number): string {
  if (animation === 'none') return '';
  return `animation: reaction-${animation} ${duration / 2}ms ease-in-out infinite`;
}
