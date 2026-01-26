// Chat Emotes System for in-game communication

export interface ChatEmote {
  id: string;
  emoji: string;
  label: string;
  category: 'reaction' | 'taunt' | 'friendly' | 'celebration';
  sound?: string;
  animation?: 'bounce' | 'shake' | 'pulse' | 'spin';
}

export interface ChatMessage {
  id: string;
  emote: ChatEmote;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: number;
}

export const CHAT_EMOTES: ChatEmote[] = [
  // Reactions
  { id: 'wow', emoji: '😮', label: 'Wow!', category: 'reaction', animation: 'bounce' },
  { id: 'think', emoji: '🤔', label: 'Hmm...', category: 'reaction', animation: 'pulse' },
  { id: 'sweat', emoji: '😅', label: 'Nervous', category: 'reaction', animation: 'shake' },
  { id: 'scared', emoji: '😱', label: 'Scary!', category: 'reaction', animation: 'shake' },
  { id: 'cry', emoji: '😭', label: 'Nooo!', category: 'reaction', animation: 'shake' },
  { id: 'angry', emoji: '😤', label: 'Grr!', category: 'reaction', animation: 'shake' },

  // Taunts
  { id: 'smirk', emoji: '😏', label: 'Easy', category: 'taunt', animation: 'pulse' },
  { id: 'cool', emoji: '😎', label: 'Cool', category: 'taunt', animation: 'bounce' },
  { id: 'wink', emoji: '😉', label: 'Gotcha', category: 'taunt', animation: 'bounce' },
  { id: 'tongue', emoji: '😜', label: 'Hehe', category: 'taunt', animation: 'spin' },
  { id: 'devil', emoji: '😈', label: 'Evil', category: 'taunt', animation: 'pulse' },
  { id: 'clown', emoji: '🤡', label: 'Clown', category: 'taunt', animation: 'bounce' },

  // Friendly
  { id: 'wave', emoji: '👋', label: 'Hi!', category: 'friendly', animation: 'bounce' },
  { id: 'thumbsup', emoji: '👍', label: 'Nice!', category: 'friendly', animation: 'bounce' },
  { id: 'clap', emoji: '👏', label: 'GG!', category: 'friendly', animation: 'bounce' },
  { id: 'heart', emoji: '❤️', label: 'Love', category: 'friendly', animation: 'pulse' },
  { id: 'handshake', emoji: '🤝', label: 'Respect', category: 'friendly', animation: 'bounce' },
  { id: 'pray', emoji: '🙏', label: 'Please', category: 'friendly', animation: 'pulse' },

  // Celebration
  { id: 'party', emoji: '🎉', label: 'Party!', category: 'celebration', animation: 'spin' },
  { id: 'fire', emoji: '🔥', label: 'Fire!', category: 'celebration', animation: 'pulse' },
  { id: 'trophy', emoji: '🏆', label: 'Winner!', category: 'celebration', animation: 'bounce' },
  { id: 'money', emoji: '💰', label: 'Rich!', category: 'celebration', animation: 'bounce' },
  { id: 'rocket', emoji: '🚀', label: 'Moon!', category: 'celebration', animation: 'bounce' },
  { id: 'star', emoji: '⭐', label: 'Star!', category: 'celebration', animation: 'spin' },
];

// Quick chat messages
export const QUICK_MESSAGES = [
  { id: 'gg', text: 'Good game!', emoji: '🎮' },
  { id: 'gl', text: 'Good luck!', emoji: '🍀' },
  { id: 'nh', text: 'Nice hand!', emoji: '👏' },
  { id: 'wp', text: 'Well played!', emoji: '🎯' },
  { id: 'ty', text: 'Thanks!', emoji: '🙏' },
  { id: 'oops', text: 'Oops!', emoji: '😬' },
  { id: 'lol', text: 'LOL', emoji: '😂' },
  { id: 'wow', text: 'Wow!', emoji: '😮' },
];

// Recent chat messages (for display)
let recentMessages: ChatMessage[] = [];
const MAX_MESSAGES = 10;

export function sendEmote(
  emote: ChatEmote,
  senderId: string,
  senderName: string,
  senderAvatar: string
): ChatMessage {
  const message: ChatMessage = {
    id: `msg_${Date.now()}`,
    emote,
    senderId,
    senderName,
    senderAvatar,
    timestamp: Date.now(),
  };

  recentMessages.push(message);
  if (recentMessages.length > MAX_MESSAGES) {
    recentMessages = recentMessages.slice(-MAX_MESSAGES);
  }

  return message;
}

export function getRecentMessages(): ChatMessage[] {
  // Filter out messages older than 10 seconds
  const now = Date.now();
  recentMessages = recentMessages.filter(m => now - m.timestamp < 10000);
  return recentMessages;
}

export function clearMessages(): void {
  recentMessages = [];
}

export function getEmotesByCategory(category: ChatEmote['category']): ChatEmote[] {
  return CHAT_EMOTES.filter(e => e.category === category);
}

export function getEmoteById(id: string): ChatEmote | undefined {
  return CHAT_EMOTES.find(e => e.id === id);
}

// Bot auto-responses to player emotes
export function getBotEmoteResponse(playerEmote: ChatEmote, botPersonality: string): ChatEmote | null {
  // 30% chance to respond
  if (Math.random() > 0.3) return null;

  const responses: Record<string, string[]> = {
    taunt: ['smirk', 'cool', 'devil', 'clown'],
    friendly: ['thumbsup', 'wave', 'heart', 'clap'],
    celebration: ['clap', 'fire', 'party'],
    reaction: ['think', 'wow', 'cool'],
  };

  const possibleResponses = responses[playerEmote.category] || responses.reaction;
  const responseId = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

  return getEmoteById(responseId) || null;
}

// Cooldown system to prevent spam
const emoteCooldowns: Map<string, number> = new Map();
const COOLDOWN_MS = 2000;

export function canSendEmote(senderId: string): boolean {
  const lastSent = emoteCooldowns.get(senderId) || 0;
  return Date.now() - lastSent >= COOLDOWN_MS;
}

export function recordEmoteSent(senderId: string): void {
  emoteCooldowns.set(senderId, Date.now());
}

export function getCooldownRemaining(senderId: string): number {
  const lastSent = emoteCooldowns.get(senderId) || 0;
  const remaining = COOLDOWN_MS - (Date.now() - lastSent);
  return Math.max(0, remaining);
}
