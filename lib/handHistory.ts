// Hand History System - Track and replay past hands

export interface HistoryCard {
  rank: string;
  suit: string;
}

export interface HistoryPlayer {
  name: string;
  avatar: string;
  cards: HistoryCard[];
  decision: 'hold' | 'drop';
  isHuman: boolean;
  isWinner: boolean;
  isLoser: boolean;
  tokensChange: number;
}

export interface HandRecord {
  id: string;
  timestamp: string;
  roundNumber: number;
  pot: number;
  players: HistoryPlayer[];
  ghostHand?: HistoryCard[];
  ghostWon: boolean;
  humanWon: boolean;
  humanCards: HistoryCard[];
  humanDecision: 'hold' | 'drop';
  handDescription: string;
}

export interface HandHistoryState {
  hands: HandRecord[];
  sessionHands: HandRecord[]; // Current session only
}

const STORAGE_KEY = 'guts_hand_history';
const MAX_HISTORY = 100;
const MAX_SESSION = 20;

let sessionHands: HandRecord[] = [];

export function loadHandHistory(): HandRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHandHistory(hands: HandRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep only last MAX_HISTORY hands
    const trimmed = hands.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function recordHand(record: Omit<HandRecord, 'id' | 'timestamp'>): HandRecord {
  const newRecord: HandRecord = {
    ...record,
    id: `hand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  // Add to session
  sessionHands.push(newRecord);
  if (sessionHands.length > MAX_SESSION) {
    sessionHands = sessionHands.slice(-MAX_SESSION);
  }

  // Add to persistent storage
  const history = loadHandHistory();
  history.push(newRecord);
  saveHandHistory(history);

  return newRecord;
}

export function getSessionHands(): HandRecord[] {
  return [...sessionHands].reverse(); // Most recent first
}

export function getRecentHands(count: number = 10): HandRecord[] {
  const history = loadHandHistory();
  return history.slice(-count).reverse();
}

export function clearSessionHands(): void {
  sessionHands = [];
}

export function getHandStats(): {
  totalHands: number;
  wins: number;
  losses: number;
  winRate: number;
  biggestWin: number;
  biggestLoss: number;
} {
  const history = loadHandHistory();

  const wins = history.filter(h => h.humanWon).length;
  const losses = history.filter(h => !h.humanWon && h.humanDecision === 'hold').length;
  const winRate = history.length > 0 ? Math.round((wins / history.length) * 100) : 0;

  const tokenChanges = history.map(h => {
    const human = h.players.find(p => p.isHuman);
    return human?.tokensChange || 0;
  });

  const biggestWin = Math.max(0, ...tokenChanges);
  const biggestLoss = Math.abs(Math.min(0, ...tokenChanges));

  return {
    totalHands: history.length,
    wins,
    losses,
    winRate,
    biggestWin,
    biggestLoss,
  };
}

// Format hand for display
export function formatHandSummary(hand: HandRecord): string {
  if (hand.humanWon) {
    return `Won ${hand.pot} tokens with ${hand.handDescription}`;
  } else if (hand.humanDecision === 'drop') {
    return `Dropped with ${hand.handDescription}`;
  } else {
    return `Lost with ${hand.handDescription}`;
  }
}

// Get replay data for a hand
export function getReplayData(handId: string): HandRecord | null {
  const history = loadHandHistory();
  return history.find(h => h.id === handId) || null;
}

// Export history to JSON
export function exportHistory(): string {
  const history = loadHandHistory();
  return JSON.stringify(history, null, 2);
}

// Export history to CSV
export function exportHistoryCSV(): string {
  const history = loadHandHistory();
  const headers = ['Date', 'Round', 'Your Cards', 'Decision', 'Result', 'Pot', 'Tokens Change'];

  const rows = history.map(h => {
    const human = h.players.find(p => p.isHuman);
    const cards = h.humanCards.map(c => `${c.rank}${c.suit}`).join(' ');
    const result = h.humanWon ? 'Won' : (h.humanDecision === 'drop' ? 'Dropped' : 'Lost');
    const change = human?.tokensChange || 0;

    return [
      new Date(h.timestamp).toLocaleDateString(),
      h.roundNumber,
      cards,
      h.humanDecision,
      result,
      h.pot,
      change > 0 ? `+${change}` : change,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
