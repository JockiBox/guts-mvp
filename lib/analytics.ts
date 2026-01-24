'use client';

import { supabase } from './supabase';

// Analytics event types
export type AnalyticsEvent =
  | 'page_view'
  | 'game_start'
  | 'game_end'
  | 'round_complete'
  | 'decision_made'
  | 'token_purchase'
  | 'daily_claim'
  | 'achievement_unlock'
  | 'tutorial_start'
  | 'tutorial_complete'
  | 'tutorial_skip'
  | 'room_create'
  | 'room_join'
  | 'room_leave'
  | 'tournament_join'
  | 'friend_request_sent'
  | 'friend_request_accepted'
  | 'referral_applied'
  | 'shop_open'
  | 'item_purchase';

interface AnalyticsData {
  [key: string]: string | number | boolean | null | undefined;
}

// Track an analytics event
export async function trackEvent(
  event: AnalyticsEvent,
  data?: AnalyticsData,
  userId?: string
): Promise<void> {
  try {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}`, data);
    }

    // Store in Supabase activity_log
    await supabase.from('activity_log').insert({
      user_id: userId || null,
      action: event,
      details: data || {},
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Silent fail - don't break the app for analytics
    console.error('[Analytics] Error tracking event:', error);
  }
}

// Track page views
export function trackPageView(pageName: string, userId?: string): void {
  trackEvent('page_view', { page: pageName }, userId);
}

// Track game events
export function trackGameStart(
  userId: string | undefined,
  playerCount: number,
  difficulty: string
): void {
  trackEvent('game_start', { player_count: playerCount, difficulty }, userId);
}

export function trackGameEnd(
  userId: string | undefined,
  won: boolean,
  rounds: number,
  tokensChange: number
): void {
  trackEvent('game_end', { won, rounds, tokens_change: tokensChange }, userId);
}

export function trackDecision(
  userId: string | undefined,
  decision: 'hold' | 'drop',
  handType: string,
  pot: number
): void {
  trackEvent('decision_made', { decision, hand_type: handType, pot }, userId);
}

// Track tutorial events
export function trackTutorialStart(userId?: string): void {
  trackEvent('tutorial_start', {}, userId);
}

export function trackTutorialComplete(userId?: string): void {
  trackEvent('tutorial_complete', {}, userId);
}

export function trackTutorialSkip(step: number, userId?: string): void {
  trackEvent('tutorial_skip', { step }, userId);
}

// Track multiplayer events
export function trackRoomCreate(userId: string, settings: AnalyticsData): void {
  trackEvent('room_create', settings, userId);
}

export function trackRoomJoin(userId: string, roomCode: string): void {
  trackEvent('room_join', { room_code: roomCode }, userId);
}

// Track purchase events
export function trackTokenPurchase(userId: string, amount: number, price: number): void {
  trackEvent('token_purchase', { amount, price_cents: price * 100 }, userId);
}

export function trackItemPurchase(userId: string, itemId: string, price: number): void {
  trackEvent('item_purchase', { item_id: itemId, price }, userId);
}

// Session tracking
let sessionStartTime: number | null = null;
let sessionId: string | null = null;

export function startSession(): string {
  sessionStartTime = Date.now();
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return sessionId;
}

export function getSessionDuration(): number {
  if (!sessionStartTime) return 0;
  return Math.floor((Date.now() - sessionStartTime) / 1000);
}

export function getSessionId(): string | null {
  return sessionId;
}

// Get user analytics summary
export async function getUserAnalytics(userId: string): Promise<{
  totalGames: number;
  totalWins: number;
  totalTokensWon: number;
  totalTokensSpent: number;
  lastActive: string | null;
}> {
  try {
    const { data } = await supabase
      .from('activity_log')
      .select('action, details, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!data) {
      return {
        totalGames: 0,
        totalWins: 0,
        totalTokensWon: 0,
        totalTokensSpent: 0,
        lastActive: null,
      };
    }

    const gameEnds = data.filter((d) => d.action === 'game_end');
    const purchases = data.filter((d) => d.action === 'token_purchase');

    return {
      totalGames: gameEnds.length,
      totalWins: gameEnds.filter((d) => (d.details as AnalyticsData)?.won).length,
      totalTokensWon: gameEnds
        .filter((d) => ((d.details as AnalyticsData)?.tokens_change as number) > 0)
        .reduce((sum, d) => sum + ((d.details as AnalyticsData)?.tokens_change as number || 0), 0),
      totalTokensSpent: purchases.reduce((sum, d) => sum + ((d.details as AnalyticsData)?.amount as number || 0), 0),
      lastActive: data[0]?.created_at || null,
    };
  } catch (error) {
    console.error('[Analytics] Error getting user analytics:', error);
    return {
      totalGames: 0,
      totalWins: 0,
      totalTokensWon: 0,
      totalTokensSpent: 0,
      lastActive: null,
    };
  }
}
