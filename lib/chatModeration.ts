'use client';

// Chat moderation for filtering inappropriate content

// Common bad word patterns (simplified, non-explicit)
const BAD_PATTERNS = [
  /\b(idiot|stupid|dumb|loser)\b/gi,
  /\b(hate|kill|die|dead)\b/gi,
  /\b(spam|scam|hack)\b/gi,
];

// Spam detection patterns
const SPAM_PATTERNS = [
  /(.)\1{4,}/g, // Repeated characters: aaaaaaa
  /(\b\w+\b)(\s+\1){2,}/gi, // Repeated words: hi hi hi hi
  /(https?:\/\/)/gi, // URLs
];

// Rate limiting per user
const userMessageTimes: Map<string, number[]> = new Map();
const RATE_LIMIT_MESSAGES = 5; // Max messages
const RATE_LIMIT_WINDOW = 10000; // Per 10 seconds

// Moderation result
export interface ModerationResult {
  allowed: boolean;
  reason?: string;
  filtered?: string;
}

// Check rate limiting
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const times = userMessageTimes.get(userId) || [];

  // Remove old timestamps
  const recentTimes = times.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recentTimes.length >= RATE_LIMIT_MESSAGES) {
    return false;
  }

  recentTimes.push(now);
  userMessageTimes.set(userId, recentTimes);
  return true;
}

// Filter bad words with asterisks
export function filterBadWords(message: string): string {
  let filtered = message;

  BAD_PATTERNS.forEach(pattern => {
    filtered = filtered.replace(pattern, (match) => {
      return match[0] + '*'.repeat(match.length - 2) + match[match.length - 1];
    });
  });

  return filtered;
}

// Check for spam patterns
export function isSpam(message: string): boolean {
  return SPAM_PATTERNS.some(pattern => pattern.test(message));
}

// Check message length
export function isMessageTooLong(message: string, maxLength: number = 200): boolean {
  return message.length > maxLength;
}

// Check message too short (potential spam)
export function isMessageTooShort(message: string, minLength: number = 1): boolean {
  return message.trim().length < minLength;
}

// Main moderation function
export function moderateMessage(
  message: string,
  userId: string,
  options: {
    filterBadWords?: boolean;
    checkSpam?: boolean;
    checkRateLimit?: boolean;
    maxLength?: number;
  } = {}
): ModerationResult {
  const {
    filterBadWords: doFilter = true,
    checkSpam: doSpamCheck = true,
    checkRateLimit: doRateLimit = true,
    maxLength = 200,
  } = options;

  // Check message length
  if (isMessageTooLong(message, maxLength)) {
    return {
      allowed: false,
      reason: `Message too long (max ${maxLength} characters)`,
    };
  }

  if (isMessageTooShort(message)) {
    return {
      allowed: false,
      reason: 'Message too short',
    };
  }

  // Check rate limiting
  if (doRateLimit && !checkRateLimit(userId)) {
    return {
      allowed: false,
      reason: 'Sending messages too fast. Please wait a moment.',
    };
  }

  // Check for spam
  if (doSpamCheck && isSpam(message)) {
    return {
      allowed: false,
      reason: 'Message appears to be spam',
    };
  }

  // Filter bad words
  let filteredMessage = message;
  if (doFilter) {
    filteredMessage = filterBadWords(message);
  }

  return {
    allowed: true,
    filtered: filteredMessage,
  };
}

// Quick chat messages (pre-approved)
export const QUICK_CHAT_MESSAGES = [
  { id: 'gg', text: 'Good game!', emoji: '👍' },
  { id: 'gl', text: 'Good luck!', emoji: '🍀' },
  { id: 'nice', text: 'Nice hand!', emoji: '🔥' },
  { id: 'wp', text: 'Well played!', emoji: '👏' },
  { id: 'lol', text: 'LOL!', emoji: '😂' },
  { id: 'wow', text: 'Wow!', emoji: '😮' },
  { id: 'oops', text: 'Oops!', emoji: '😅' },
  { id: 'thanks', text: 'Thanks!', emoji: '🙏' },
  { id: 'hi', text: 'Hello!', emoji: '👋' },
  { id: 'bye', text: 'Goodbye!', emoji: '✌️' },
];

// Report a message
export interface ChatReport {
  messageId: string;
  reporterId: string;
  reason: string;
  timestamp: string;
}

const reports: ChatReport[] = [];

export function reportMessage(
  messageId: string,
  reporterId: string,
  reason: string
): void {
  reports.push({
    messageId,
    reporterId,
    reason,
    timestamp: new Date().toISOString(),
  });

  // In a real implementation, this would save to database
  console.log('Message reported:', { messageId, reporterId, reason });
}

// Mute a user (client-side only for now)
const mutedUsers: Set<string> = new Set();

export function muteUser(userId: string, duration: number = 300000): void {
  mutedUsers.add(userId);
  setTimeout(() => {
    mutedUsers.delete(userId);
  }, duration);
}

export function isUserMuted(userId: string): boolean {
  return mutedUsers.has(userId);
}

export function unmuteUser(userId: string): void {
  mutedUsers.delete(userId);
}
