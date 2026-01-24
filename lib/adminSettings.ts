'use client';

import { supabase } from './supabase';

// Feature flags that can be toggled from admin
export interface AdminSettings {
  // Game features
  multiplayerEnabled: boolean;
  tournamentsEnabled: boolean;
  referralsEnabled: boolean;
  dailyRewardsEnabled: boolean;

  // Social features
  friendsEnabled: boolean;
  chatEnabled: boolean;
  chatModerationEnabled: boolean;

  // Shop features
  shopEnabled: boolean;
  tokenPurchasesEnabled: boolean;

  // Notifications
  pushNotificationsEnabled: boolean;

  // Game settings
  defaultAnte: number;
  maxPlayersPerRoom: number;
  decisionTimeSeconds: number;

  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // Additional features
  signupsEnabled: boolean;
  guestModeEnabled: boolean;
  leaderboardEnabled: boolean;
  achievementsEnabled: boolean;
  tutorialEnabled: boolean;
  soundEnabled: boolean;
  spectatorModeEnabled: boolean;
  socialSharingEnabled: boolean;

  // Numeric settings
  minTokensToPlay: number;
  maxAnteMultiplier: number;
  dailyRewardBaseAmount: number;
  referralBonus: number;
  welcomeBonus: number;

  // Updated at
  updatedAt?: string;
}

const DEFAULT_SETTINGS: AdminSettings = {
  multiplayerEnabled: true,
  tournamentsEnabled: true,
  referralsEnabled: true,
  dailyRewardsEnabled: true,
  friendsEnabled: true,
  chatEnabled: true,
  chatModerationEnabled: true,
  shopEnabled: true,
  tokenPurchasesEnabled: true,
  pushNotificationsEnabled: true,
  defaultAnte: 1,
  maxPlayersPerRoom: 8,
  decisionTimeSeconds: 3,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon!',
  signupsEnabled: true,
  guestModeEnabled: true,
  leaderboardEnabled: true,
  achievementsEnabled: true,
  tutorialEnabled: true,
  soundEnabled: true,
  spectatorModeEnabled: true,
  socialSharingEnabled: true,
  minTokensToPlay: 1,
  maxAnteMultiplier: 10,
  dailyRewardBaseAmount: 10,
  referralBonus: 50,
  welcomeBonus: 100,
  updatedAt: new Date().toISOString(),
};

// Cache settings in memory
let cachedSettings: AdminSettings | null = null;
let lastFetch: number = 0;
const CACHE_TTL = 60000; // 1 minute cache

// Get admin settings from database
export async function getAdminSettings(): Promise<AdminSettings> {
  // Return cached if fresh
  if (cachedSettings && Date.now() - lastFetch < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error || !data) {
      // Use default settings if none exist
      cachedSettings = DEFAULT_SETTINGS;
    } else {
      cachedSettings = { ...DEFAULT_SETTINGS, ...data.settings };
    }

    lastFetch = Date.now();

    // Also cache to localStorage for faster client access
    if (typeof window !== 'undefined' && cachedSettings) {
      localStorage.setItem('guts_admin_settings', JSON.stringify(cachedSettings));
      localStorage.setItem('guts_admin_settings_time', Date.now().toString());
    }

    return cachedSettings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Update admin settings (admin only - handled by API)
export async function updateAdminSettings(
  updates: Partial<AdminSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentSettings = await getAdminSettings();
    const newSettings: AdminSettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const { error } = await supabase.from('admin_settings').upsert({
      id: 'global',
      settings: newSettings,
    });

    if (error) throw error;

    // Update cache
    cachedSettings = newSettings;
    lastFetch = Date.now();

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('guts_admin_settings', JSON.stringify(newSettings));
      localStorage.setItem('guts_admin_settings_time', Date.now().toString());
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

// Check if a feature is enabled
export async function isFeatureEnabled(feature: keyof AdminSettings): Promise<boolean> {
  const settings = await getAdminSettings();
  const value = settings[feature];
  return typeof value === 'boolean' ? value : true;
}

// Get a specific setting value
export async function getSettingValue<K extends keyof AdminSettings>(
  key: K
): Promise<AdminSettings[K]> {
  const settings = await getAdminSettings();
  return settings[key];
}

// Client-side hook for admin settings (with local storage fallback)
export function getClientSettings(): AdminSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  const stored = localStorage.getItem('guts_admin_settings');
  if (stored) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

// Store settings locally for faster access
export function cacheClientSettings(settings: AdminSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('guts_admin_settings', JSON.stringify(settings));
}

// Check if app is in maintenance mode
export async function isInMaintenanceMode(): Promise<{ inMaintenance: boolean; message: string }> {
  const settings = await getAdminSettings();
  return {
    inMaintenance: settings.maintenanceMode,
    message: settings.maintenanceMessage,
  };
}

// Synchronous check for client-side (uses cached settings)
export function isFeatureEnabledSync(feature: keyof AdminSettings): boolean {
  const settings = getClientSettings();
  const value = settings[feature];
  return typeof value === 'boolean' ? value : true;
}

// Get numeric setting value synchronously
export function getSettingValueSync<K extends keyof AdminSettings>(key: K): AdminSettings[K] {
  const settings = getClientSettings();
  return settings[key];
}

// Force refresh settings from server
export async function refreshSettings(): Promise<AdminSettings> {
  cachedSettings = null;
  lastFetch = 0;
  return getAdminSettings();
}

// Export default settings for reference
export { DEFAULT_SETTINGS };
