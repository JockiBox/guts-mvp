// Hand Odds Calculator
// Calculates probability of winning based on your 2-card hand

export interface HandOdds {
  winProbability: number; // 0-100
  strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  recommendation: 'drop' | 'risky' | 'hold';
  description: string;
}

// Card value mapping (2=2, ..., 10=10, J=11, Q=12, K=13, A=14)
function getCardValue(rank: string): number {
  if (rank === 'A') return 14;
  if (rank === 'K') return 13;
  if (rank === 'Q') return 12;
  if (rank === 'J') return 11;
  return parseInt(rank);
}

// Check if it's a pair
function isPair(card1: { rank: string }, card2: { rank: string }): boolean {
  return card1.rank === card2.rank;
}

// Check if it's a flush (same suit)
function isFlush(card1: { suit: string }, card2: { suit: string }): boolean {
  return card1.suit === card2.suit;
}

// Check if it's 6-9 (best hand)
function isSixNine(card1: { rank: string }, card2: { rank: string }): boolean {
  const ranks = [card1.rank, card2.rank].sort();
  return ranks[0] === '6' && ranks[1] === '9';
}

// Get high card value
function getHighCard(card1: { rank: string }, card2: { rank: string }): number {
  return Math.max(getCardValue(card1.rank), getCardValue(card2.rank));
}

// Calculate hand strength score (0-1000)
function calculateHandScore(card1: { rank: string; suit: string }, card2: { rank: string; suit: string }): number {
  // 6-9 is best: 1000
  if (isSixNine(card1, card2)) {
    return 1000;
  }

  // Pairs: 800 + pair value * 10
  if (isPair(card1, card2)) {
    return 800 + getCardValue(card1.rank) * 10;
  }

  // Flush: 400 + high card * 10 + low card
  if (isFlush(card1, card2)) {
    const high = Math.max(getCardValue(card1.rank), getCardValue(card2.rank));
    const low = Math.min(getCardValue(card1.rank), getCardValue(card2.rank));
    return 400 + high * 10 + low;
  }

  // High card: high card * 10 + low card
  const high = Math.max(getCardValue(card1.rank), getCardValue(card2.rank));
  const low = Math.min(getCardValue(card1.rank), getCardValue(card2.rank));
  return high * 10 + low;
}

// Estimate win probability based on hand score and number of opponents
export function calculateOdds(
  card1: { rank: string; suit: string },
  card2: { rank: string; suit: string },
  numOpponents: number = 4
): HandOdds {
  const score = calculateHandScore(card1, card2);

  // Probability estimation based on score and opponents
  // Higher score = better chance, more opponents = lower chance

  let baseProbability: number;

  if (score >= 1000) {
    // 6-9: Almost always wins
    baseProbability = 98;
  } else if (score >= 920) {
    // High pair (AA, KK, QQ)
    baseProbability = 90;
  } else if (score >= 880) {
    // Medium-high pair (JJ, 10-10, 99)
    baseProbability = 80;
  } else if (score >= 820) {
    // Low-medium pair (88-22)
    baseProbability = 70;
  } else if (score >= 530) {
    // High flush (A-high, K-high)
    baseProbability = 55;
  } else if (score >= 480) {
    // Medium flush
    baseProbability = 45;
  } else if (score >= 420) {
    // Low flush
    baseProbability = 35;
  } else if (score >= 130) {
    // High card A or K
    baseProbability = 25;
  } else if (score >= 110) {
    // High card Q or J
    baseProbability = 18;
  } else {
    // Low high card
    baseProbability = 10;
  }

  // Adjust for number of opponents (each opponent reduces odds)
  const opponentPenalty = (numOpponents - 1) * 5;
  const winProbability = Math.max(5, Math.min(99, baseProbability - opponentPenalty));

  // Determine strength
  let strength: HandOdds['strength'];
  if (winProbability >= 75) strength = 'very_strong';
  else if (winProbability >= 55) strength = 'strong';
  else if (winProbability >= 35) strength = 'medium';
  else if (winProbability >= 20) strength = 'weak';
  else strength = 'very_weak';

  // Recommendation
  let recommendation: HandOdds['recommendation'];
  if (winProbability >= 50) recommendation = 'hold';
  else if (winProbability >= 25) recommendation = 'risky';
  else recommendation = 'drop';

  // Description
  let description: string;
  if (isSixNine(card1, card2)) {
    description = 'Six-Nine! Best possible hand!';
  } else if (isPair(card1, card2)) {
    description = `Pair of ${card1.rank}s - Strong hand`;
  } else if (isFlush(card1, card2)) {
    const highRank = getHighCard(card1, card2) === 14 ? 'A' :
                     getHighCard(card1, card2) === 13 ? 'K' :
                     getHighCard(card1, card2) === 12 ? 'Q' :
                     getHighCard(card1, card2) === 11 ? 'J' :
                     getHighCard(card1, card2).toString();
    description = `${highRank}-high Flush`;
  } else {
    const highRank = getHighCard(card1, card2) === 14 ? 'Ace' :
                     getHighCard(card1, card2) === 13 ? 'King' :
                     getHighCard(card1, card2) === 12 ? 'Queen' :
                     getHighCard(card1, card2) === 11 ? 'Jack' :
                     getHighCard(card1, card2).toString();
    description = `${highRank} high`;
  }

  return {
    winProbability: Math.round(winProbability),
    strength,
    recommendation,
    description,
  };
}

// Get color for probability display
export function getOddsColor(probability: number): string {
  if (probability >= 70) return '#4ade80'; // green
  if (probability >= 50) return '#22d3ee'; // cyan
  if (probability >= 30) return '#fbbf24'; // yellow
  if (probability >= 15) return '#fb923c'; // orange
  return '#f87171'; // red
}

// Get emoji indicator
export function getOddsEmoji(strength: HandOdds['strength']): string {
  switch (strength) {
    case 'very_strong': return '🔥';
    case 'strong': return '💪';
    case 'medium': return '🤔';
    case 'weak': return '😬';
    case 'very_weak': return '💀';
  }
}
