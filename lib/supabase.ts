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
