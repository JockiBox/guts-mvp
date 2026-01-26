'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let isUsingMockClient = false;

function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('[SUPABASE INIT] Checking env vars:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined'
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    console.warn('[SUPABASE INIT] Supabase not configured - using mock client');
    isUsingMockClient = true;
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

  console.log('[SUPABASE INIT] Creating real Supabase client');
  isUsingMockClient = false;
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = getSupabase();

// Helper to check if using mock client
export function isSupabaseMock(): boolean {
  return isUsingMockClient;
}

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

  // Create user profile if trigger didn't already create one
  // Use upsert to avoid conflicts if trigger already created the profile
  if (data.user) {
    try {
      await createUserProfile(data.user.id, email, username);
    } catch (profileError) {
      // Profile might already exist from database trigger, that's OK
      console.log('Profile may already exist:', profileError);
    }
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
  // Use upsert to handle case where trigger already created the profile
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    username,
    avatar_emoji: '😎',
    avatar_color: '#14b8a6',
    tokens: 500, // Starting tokens for signed-in users
    vip_level: 0,
    daily_streak: 0,
    last_daily_claim: null,
    total_tokens_purchased: 0,
    total_wins: 0,
    total_games: 0,
    unlocked_avatars: ['😎', '🎮', '🃏', '🎰'],
    unlocked_themes: ['default'],
    unlocked_effects: [],
  }, { onConflict: 'id' });

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

// Add tokens from purchases (updates total_tokens_purchased)
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

// Modify tokens for game actions (rewards, ante, etc.) - fetches fresh data first
export async function modifyGameTokens(userId: string, change: number): Promise<{ success: boolean; newBalance: number }> {
  console.log('[SUPABASE] ===== modifyGameTokens START =====');
  console.log('[SUPABASE] Called with:', { userId, change, isMock: isUsingMockClient });

  // Fail fast if using mock client
  if (isUsingMockClient) {
    console.error('[SUPABASE] ERROR: Using mock client! Database updates will NOT work.');
    return { success: false, newBalance: 0 };
  }

  // Always fetch fresh profile to avoid stale data
  const profile = await getUserProfile(userId);
  console.log('[SUPABASE] Fetched profile:', { found: !!profile, tokens: profile?.tokens });
  if (!profile) {
    console.error('[SUPABASE] Profile not found for user:', userId);
    return { success: false, newBalance: 0 };
  }

  const newBalance = Math.max(0, profile.tokens + change);
  console.log('[SUPABASE] Updating tokens:', { currentTokens: profile.tokens, change, newBalance });

  const { data: updateData, error } = await supabase
    .from('profiles')
    .update({ tokens: newBalance })
    .eq('id', userId)
    .select('tokens');

  console.log('[SUPABASE] Update response:', { data: updateData, error });

  if (error) {
    console.error('[SUPABASE] Error updating tokens:', error);
    return { success: false, newBalance: profile.tokens };
  }

  // Verify the update by fetching again
  const updatedProfile = await getUserProfile(userId);
  console.log('[SUPABASE] Verification fetch:', {
    expectedBalance: newBalance,
    actualBalance: updatedProfile?.tokens,
    matches: updatedProfile?.tokens === newBalance
  });

  if (updatedProfile?.tokens !== newBalance) {
    console.warn('[SUPABASE] WARNING: Token balance mismatch after update!');
  }

  console.log('[SUPABASE] ===== modifyGameTokens END =====');
  return { success: true, newBalance: updatedProfile?.tokens ?? newBalance };
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

  // Daily reward is 500 tokens for signed-in users who play
  const baseReward = 500;
  const streakBonus = Math.min(newStreak - 1, 6) * 10; // Small bonus for streaks
  const vipBonus = profile.vip_level * 25;
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

// Debug function - call from browser console: window.testTokenUpdate()
if (typeof window !== 'undefined') {
  (window as unknown as { testTokenUpdate: () => Promise<void> }).testTokenUpdate = async () => {
    console.log('=== TOKEN UPDATE TEST ===');

    // Step 1: Check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('1. Session check:', { hasSession: !!session, userId: session?.user?.id, error: sessionError });

    if (!session?.user) {
      console.log('ERROR: No authenticated session. User must be logged in.');
      return;
    }

    // Step 2: Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    console.log('2. Profile fetch:', { tokens: profile?.tokens, error: profileError });

    if (!profile) {
      console.log('ERROR: Could not fetch profile');
      return;
    }

    // Step 3: Try to update tokens (add 1)
    const newBalance = profile.tokens + 1;
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ tokens: newBalance })
      .eq('id', session.user.id)
      .select();
    console.log('3. Update attempt:', { newBalance, updateData, error: updateError });

    // Step 4: Verify the update
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', session.user.id)
      .single();
    console.log('4. Verification:', { beforeTokens: profile.tokens, afterTokens: verifyProfile?.tokens, error: verifyError });

    if (verifyProfile && verifyProfile.tokens === newBalance) {
      console.log('SUCCESS: Token update worked! Tokens went from', profile.tokens, 'to', verifyProfile.tokens);
      console.log('Now subtracting 1 to restore original balance...');
      await supabase
        .from('profiles')
        .update({ tokens: profile.tokens })
        .eq('id', session.user.id);
      console.log('Restored to original balance:', profile.tokens);
    } else {
      console.log('FAILURE: Token update did not persist. Check RLS policies.');
      console.log('Expected:', newBalance, 'Got:', verifyProfile?.tokens);
    }

    console.log('=== TEST COMPLETE ===');
  };
  console.log('Token test available: run window.testTokenUpdate() in console');
}
