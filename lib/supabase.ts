'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    console.warn('Supabase not configured - using mock client');
    return {
      auth: {
        signUp: async () => ({ data: null, error: new Error('Not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Not configured') }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        insert: async () => ({ error: null }),
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ error: null }) }),
      }),
    } as unknown as SupabaseClient;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = getSupabase();

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_emoji: string;
  avatar_color: string;
  tokens: number;
  vip_level: number;
  created_at: string;
  last_login: string;
  daily_streak: number;
  last_daily_claim: string | null;
  total_tokens_purchased: number;
  total_wins: number;
  total_games: number;
  unlocked_avatars: string[];
  unlocked_themes: string[];
  unlocked_effects: string[];
}

// Auth helpers
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) throw error;

  // Create user profile
  if (data.user) {
    await createUserProfile(data.user.id, email, username);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update last login and check daily bonus
  if (data.user) {
    await updateLastLogin(data.user.id);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Profile helpers
export async function createUserProfile(userId: string, email: string, username: string) {
  const { error } = await supabase.from('profiles').insert({
    id: userId,
    email,
    username,
    avatar_emoji: '😎',
    avatar_color: '#14b8a6',
    tokens: 100, // Starting tokens
    vip_level: 0,
    daily_streak: 0,
    last_daily_claim: null,
    total_tokens_purchased: 0,
    total_wins: 0,
    total_games: 0,
    unlocked_avatars: ['😎', '🎮', '🃏', '🎰'],
    unlocked_themes: ['default'],
    unlocked_effects: [],
  });

  if (error) throw error;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

export async function updateLastLogin(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);

  if (error) console.error('Error updating last login:', error);
}

// Token management
export async function addTokens(userId: string, amount: number) {
  const profile = await getUserProfile(userId);
  if (!profile) throw new Error('Profile not found');

  const { error } = await supabase
    .from('profiles')
    .update({
      tokens: profile.tokens + amount,
      total_tokens_purchased: profile.total_tokens_purchased + amount,
    })
    .eq('id', userId);

  if (error) throw error;
}

export async function spendTokens(userId: string, amount: number): Promise<boolean> {
  const profile = await getUserProfile(userId);
  if (!profile || profile.tokens < amount) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ tokens: profile.tokens - amount })
    .eq('id', userId);

  if (error) {
    console.error('Error spending tokens:', error);
    return false;
  }

  return true;
}

// Daily rewards
export async function claimDailyReward(userId: string): Promise<{ success: boolean; tokens: number; streak: number }> {
  const profile = await getUserProfile(userId);
  if (!profile) return { success: false, tokens: 0, streak: 0 };

  const now = new Date();
  const lastClaim = profile.last_daily_claim ? new Date(profile.last_daily_claim) : null;

  // Check if already claimed today
  if (lastClaim && isSameDay(lastClaim, now)) {
    return { success: false, tokens: 0, streak: profile.daily_streak };
  }

  // Calculate streak
  let newStreak = 1;
  if (lastClaim && isYesterday(lastClaim, now)) {
    newStreak = profile.daily_streak + 1;
  }

  // Calculate reward based on streak (caps at 7)
  const baseReward = 10;
  const streakBonus = Math.min(newStreak - 1, 6) * 5;
  const vipBonus = profile.vip_level * 5;
  const totalReward = baseReward + streakBonus + vipBonus;

  const { error } = await supabase
    .from('profiles')
    .update({
      tokens: profile.tokens + totalReward,
      daily_streak: newStreak,
      last_daily_claim: now.toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error claiming daily reward:', error);
    return { success: false, tokens: 0, streak: profile.daily_streak };
  }

  return { success: true, tokens: totalReward, streak: newStreak };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2);
  yesterday.setDate(yesterday.getDate() - 1);
  return date1.toDateString() === yesterday.toDateString();
}

// Game stats
export async function recordGameResult(userId: string, won: boolean, tokensChange: number) {
  const profile = await getUserProfile(userId);
  if (!profile) return;

  const { error } = await supabase
    .from('profiles')
    .update({
      tokens: profile.tokens + tokensChange,
      total_games: profile.total_games + 1,
      total_wins: won ? profile.total_wins + 1 : profile.total_wins,
    })
    .eq('id', userId);

  if (error) console.error('Error recording game result:', error);
}

// Check if user can play (has tokens)
export async function canPlay(userId: string, anteAmount: number = 1): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile ? profile.tokens >= anteAmount : false;
}

// Referral system
export async function applyReferralCode(userId: string, referralCode: string): Promise<{ success: boolean; message: string }> {
  const REFERRAL_BONUS = 50;

  try {
    // Find the referrer by their code
    const { data: referrer, error: findError } = await supabase
      .from('profiles')
      .select('id, tokens, referral_tokens_earned')
      .eq('referral_code', referralCode)
      .neq('id', userId) // Can't refer yourself
      .single();

    if (findError || !referrer) {
      return { success: false, message: 'Invalid referral code' };
    }

    // Check if user already has a referrer
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('id', userId)
      .single();

    if (userProfile?.referred_by) {
      return { success: false, message: 'Already used a referral code' };
    }

    // Create referral record
    await supabase.from('referrals').insert({
      referrer_id: referrer.id,
      referred_id: userId,
      tokens_rewarded: REFERRAL_BONUS,
    });

    // Reward referrer
    await supabase
      .from('profiles')
      .update({
        tokens: referrer.tokens + REFERRAL_BONUS,
        referral_tokens_earned: (referrer.referral_tokens_earned || 0) + REFERRAL_BONUS,
      })
      .eq('id', referrer.id);

    // Reward new user and link referral
    const profile = await getUserProfile(userId);
    if (profile) {
      await supabase
        .from('profiles')
        .update({
          tokens: profile.tokens + REFERRAL_BONUS,
          referred_by: referrer.id,
        })
        .eq('id', userId);
    }

    return { success: true, message: `You earned ${REFERRAL_BONUS} bonus tokens!` };
  } catch (error) {
    console.error('Error applying referral code:', error);
    return { success: false, message: 'Failed to apply referral code' };
  }
}

// Get user's referral stats
export async function getReferralStats(userId: string): Promise<{ code: string | null; referrals: number; tokensEarned: number }> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code, referral_tokens_earned')
      .eq('id', userId)
      .single();

    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId);

    return {
      code: profile?.referral_code || null,
      referrals: count || 0,
      tokensEarned: profile?.referral_tokens_earned || 0,
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return { code: null, referrals: 0, tokensEarned: 0 };
  }
}

// Friends system
export async function sendFriendRequest(fromUserId: string, toUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('friend_requests').insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: 'pending',
    });
    return !error;
  } catch {
    return false;
  }
}

export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  try {
    const { data: request } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) return false;

    // Create friendship (both directions)
    await supabase.from('friendships').insert([
      { user_id: request.from_user_id, friend_id: request.to_user_id },
      { user_id: request.to_user_id, friend_id: request.from_user_id },
    ]);

    // Update request status
    await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    return true;
  } catch {
    return false;
  }
}

export async function getFriends(userId: string): Promise<UserProfile[]> {
  try {
    const { data } = await supabase
      .from('friendships')
      .select('friend:profiles!friend_id(*)')
      .eq('user_id', userId);

    if (!data) return [];
    return data.map(d => (d as unknown as { friend: UserProfile }).friend).filter(Boolean);
  } catch {
    return [];
  }
}

// Notifications
export async function getNotifications(userId: string): Promise<Array<{ id: string; title: string; message: string; read: boolean; created_at: string }>> {
  try {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  } catch {
    return [];
  }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
}

// Announcements
export async function getActiveAnnouncements(): Promise<Array<{ id: string; title: string; message: string; type: string }>> {
  try {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })
      .limit(5);

    return data || [];
  } catch {
    return [];
  }
}
