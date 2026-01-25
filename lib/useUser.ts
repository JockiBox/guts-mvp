'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  getCurrentUser,
  getUserProfile,
  claimDailyReward,
  spendTokens,
  type UserProfile,
} from './supabase';
import { type ShopItem } from './shop';

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [canClaimDaily, setCanClaimDaily] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const authUser = await getCurrentUser();
      if (authUser) {
        const profile = await getUserProfile(authUser.id);
        setUser(profile);

        // Check if daily reward can be claimed
        if (profile?.last_daily_claim) {
          const lastClaim = new Date(profile.last_daily_claim);
          const now = new Date();
          setCanClaimDaily(lastClaim.toDateString() !== now.toDateString());
        } else {
          setCanClaimDaily(true);
        }
      } else {
        setUser(null);
        setCanClaimDaily(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Claim daily reward
  const claimDaily = useCallback(async () => {
    if (!user) return null;

    const result = await claimDailyReward(user.id);
    if (result.success) {
      setCanClaimDaily(false);
      await fetchProfile(); // Refresh profile
    }
    return result;
  }, [user, fetchProfile]);

  // Buy shop item
  const buyItem = useCallback(async (item: ShopItem): Promise<boolean> => {
    if (!user || user.tokens < item.price) return false;

    // Spend tokens
    const success = await spendTokens(user.id, item.price);
    if (!success) return false;

    // Update user's unlocked items based on type
    try {
      let updateField: string;
      let currentItems: string[];

      switch (item.type) {
        case 'avatar':
          updateField = 'unlocked_avatars';
          currentItems = [...user.unlocked_avatars, item.value];
          break;
        case 'theme':
          updateField = 'unlocked_themes';
          currentItems = [...user.unlocked_themes, item.value];
          break;
        case 'effect':
          updateField = 'unlocked_effects';
          currentItems = [...user.unlocked_effects, item.value];
          break;
        case 'vip':
          // VIP is handled differently - set the level
          const { error: vipError } = await supabase
            .from('profiles')
            .update({ vip_level: parseInt(item.value) })
            .eq('id', user.id);
          if (vipError) throw vipError;
          await fetchProfile();
          return true;
        default:
          return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ [updateField]: currentItems })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile();
      return true;
    } catch (error) {
      console.error('Error buying item:', error);
      return false;
    }
  }, [user, fetchProfile]);

  // Purchase tokens (redirect to Stripe)
  const purchaseTokens = useCallback(async (packageId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, userId: user.id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return data.url;
      }
      return null;
    } catch (error) {
      console.error('Error creating checkout:', error);
      return null;
    }
  }, [user]);

  // Update tokens locally (for game results)
  const updateTokens = useCallback(async (change: number) => {
    console.log('[UPDATE_TOKENS] Called with change:', change, 'user:', user?.id, 'current tokens:', user?.tokens);
    if (!user) {
      console.log('[UPDATE_TOKENS] No user found, returning early');
      return;
    }

    const newTokens = user.tokens + change;
    console.log('[UPDATE_TOKENS] Updating database:', { userId: user.id, currentTokens: user.tokens, change, newTokens });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: newTokens })
        .eq('id', user.id);

      if (error) {
        console.error('[UPDATE_TOKENS] Database error:', error);
        throw error;
      }

      console.log('[UPDATE_TOKENS] Database updated successfully, updating local state');
      setUser(prev => prev ? { ...prev, tokens: prev.tokens + change } : null);
    } catch (error) {
      console.error('[UPDATE_TOKENS] Error updating tokens:', error);
    }
  }, [user]);

  return {
    user,
    loading,
    canClaimDaily,
    fetchProfile,
    claimDaily,
    buyItem,
    purchaseTokens,
    updateTokens,
  };
}
