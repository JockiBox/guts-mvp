'use client';

import { supabase } from './supabase';
import { broadcastGameAction, type RoomPlayer, type MultiplayerRoom, type GameAction } from './multiplayer';
import { Card, Rank, Suit } from './types';

// Re-export Card type for convenience
export type { Card };

// Hand evaluation
export function evaluateHand(cards: Card[]): { rank: number; description: string } {
  if (cards.length !== 2) return { rank: 0, description: 'Invalid' };

  const [card1, card2] = cards;
  const rankOrder: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const rank1 = rankOrder.indexOf(card1.rank);
  const rank2 = rankOrder.indexOf(card2.rank);

  // Six-Nine (unbeatable)
  const hasSix = card1.rank === '6' || card2.rank === '6';
  const hasNine = card1.rank === '9' || card2.rank === '9';
  if (hasSix && hasNine) {
    return { rank: 1000, description: '😏 SIX-NINE!' };
  }

  // Pair
  if (card1.rank === card2.rank) {
    return { rank: 500 + rank1, description: `👯 Pair of ${card1.rank}s` };
  }

  // Flush (same suit)
  if (card1.suit === card2.suit) {
    const highCard = Math.max(rank1, rank2);
    return { rank: 200 + highCard, description: `♠️ Flush (${rankOrder[highCard]} high)` };
  }

  // High card
  const highCard = Math.max(rank1, rank2);
  return { rank: highCard, description: `🃏 High Card (${rankOrder[highCard]})` };
}

// Create a shuffled deck
function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// Deal cards to players (host only)
export async function dealCards(roomId: string, playerIds: string[]): Promise<Map<string, Card[]>> {
  const deck = createDeck();
  const playerCards = new Map<string, Card[]>();
  let cardIndex = 0;

  for (const playerId of playerIds) {
    const cards = [deck[cardIndex++], deck[cardIndex++]];
    playerCards.set(playerId, cards);

    // Update player's cards in database (encrypted/hidden from others)
    await supabase
      .from('room_players')
      .update({ cards: cards, decision: null })
      .eq('room_id', roomId)
      .eq('user_id', playerId);
  }

  return playerCards;
}

// Start a new round
export async function startRound(room: MultiplayerRoom, players: RoomPlayer[]): Promise<void> {
  const ante = room.settings.ante || 1;
  const newPot = ante * players.length;
  const newRound = room.current_round + 1;

  // Update room state
  await supabase
    .from('multiplayer_rooms')
    .update({
      current_round: newRound,
      pot: room.pot + newPot,
    })
    .eq('id', room.id);

  // Deduct ante from all players
  for (const player of players) {
    await supabase
      .from('room_players')
      .update({ tokens: player.tokens - ante, decision: null, is_active: true })
      .eq('id', player.id);
  }

  // Deal cards
  const playerIds = players.map((p) => p.user_id);
  await dealCards(room.id, playerIds);

  // Broadcast deal action
  await broadcastGameAction(room.id, {
    type: 'deal',
    payload: { round: newRound, pot: room.pot + newPot },
    timestamp: Date.now(),
  });
}

// Record player decision
export async function recordDecision(
  roomId: string,
  playerId: string,
  decision: 'hold' | 'drop'
): Promise<void> {
  await supabase
    .from('room_players')
    .update({ decision })
    .eq('room_id', roomId)
    .eq('user_id', playerId);

  await broadcastGameAction(roomId, {
    type: 'decision',
    payload: { decision, hidden: true },
    timestamp: Date.now(),
    player_id: playerId,
  });
}

// Check if all players have decided
export async function checkAllDecided(roomId: string): Promise<boolean> {
  const { data: players } = await supabase
    .from('room_players')
    .select('decision, is_active')
    .eq('room_id', roomId)
    .eq('is_active', true);

  if (!players) return false;
  return players.every((p) => p.decision !== null);
}

// Reveal cards and determine winner
export async function revealAndDetermineWinner(
  roomId: string
): Promise<{
  winners: string[];
  losers: string[];
  pot: number;
  ghostHand?: Card[];
}> {
  // Get all players with their cards and decisions
  const { data: players } = await supabase
    .from('room_players')
    .select('*')
    .eq('room_id', roomId)
    .eq('is_active', true);

  const { data: room } = await supabase
    .from('multiplayer_rooms')
    .select('pot')
    .eq('id', roomId)
    .single();

  if (!players || !room) {
    return { winners: [], losers: [], pot: 0 };
  }

  const holdingPlayers = players.filter((p) => p.decision === 'hold');
  const pot = room.pot;
  let winners: string[] = [];
  let losers: string[] = [];
  let ghostHand: Card[] | undefined;

  // If everyone dropped, ghost hand wins
  if (holdingPlayers.length === 0) {
    const deck = createDeck();
    ghostHand = [deck[0], deck[1]];

    // All droppers must pay double
    losers = players.map((p) => p.user_id);

    for (const player of players) {
      await supabase
        .from('room_players')
        .update({ tokens: player.tokens - pot })
        .eq('id', player.id);
    }

    // Update room pot
    await supabase
      .from('multiplayer_rooms')
      .update({ pot: pot * 2 })
      .eq('id', roomId);
  } else {
    // Evaluate all holding players' hands
    const evaluatedPlayers = holdingPlayers.map((p) => ({
      ...p,
      handValue: evaluateHand(p.cards as Card[]),
    }));

    // Find the best hand
    const bestHandValue = Math.max(...evaluatedPlayers.map((p) => p.handValue.rank));
    const winningPlayers = evaluatedPlayers.filter((p) => p.handValue.rank === bestHandValue);
    const losingPlayers = evaluatedPlayers.filter((p) => p.handValue.rank < bestHandValue);

    winners = winningPlayers.map((p) => p.user_id);
    losers = losingPlayers.map((p) => p.user_id);

    // Split pot among winners
    const potPerWinner = Math.floor(pot / winners.length);
    for (const winner of winningPlayers) {
      await supabase
        .from('room_players')
        .update({ tokens: winner.tokens + potPerWinner })
        .eq('id', winner.id);
    }

    // Losers must match the pot
    for (const loser of losingPlayers) {
      await supabase
        .from('room_players')
        .update({ tokens: loser.tokens - pot })
        .eq('id', loser.id);
    }

    // New pot from losers
    const newPot = pot * losers.length;
    await supabase
      .from('multiplayer_rooms')
      .update({ pot: newPot })
      .eq('id', roomId);
  }

  // Broadcast reveal action
  await broadcastGameAction(roomId, {
    type: 'reveal',
    payload: {
      winners,
      losers,
      pot,
      ghostHand,
      players: players.map((p) => ({
        user_id: p.user_id,
        cards: p.decision === 'hold' ? p.cards : null,
        decision: p.decision,
      })),
    },
    timestamp: Date.now(),
  });

  return { winners, losers, pot, ghostHand };
}

// End the game
export async function endGame(roomId: string): Promise<void> {
  await supabase
    .from('multiplayer_rooms')
    .update({ status: 'finished' })
    .eq('id', roomId);

  await broadcastGameAction(roomId, {
    type: 'result',
    payload: { finished: true },
    timestamp: Date.now(),
  });
}

// Get player's cards (only their own)
export async function getMyCards(roomId: string, userId: string): Promise<Card[] | null> {
  const { data } = await supabase
    .from('room_players')
    .select('cards')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .single();

  return data?.cards as Card[] | null;
}
