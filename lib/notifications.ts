'use client';

// Push notification types
export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'game_invite'
  | 'tournament_start'
  | 'daily_reward'
  | 'achievement';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, unknown>;
  tag?: string;
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

// Check notification permission
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

// Show a notification
export async function showNotification(payload: NotificationPayload): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    // Try to use service worker for better reliability
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: payload.tag,
      data: payload.data,
      requireInteraction: false,
    } as NotificationOptions);
    return true;
  } catch (error) {
    // Fallback to regular notification
    try {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192.png',
        tag: payload.tag,
        data: payload.data,
      });
      return true;
    } catch (e) {
      console.error('Error showing notification:', e);
      return false;
    }
  }
}

// Notification presets
export async function notifyFriendRequest(fromUsername: string): Promise<void> {
  await showNotification({
    title: '👥 New Friend Request',
    body: `${fromUsername} wants to be your friend!`,
    tag: 'friend-request',
    data: { type: 'friend_request', from: fromUsername },
  });
}

export async function notifyFriendAccepted(username: string): Promise<void> {
  await showNotification({
    title: '🎉 Friend Request Accepted',
    body: `${username} accepted your friend request!`,
    tag: 'friend-accepted',
    data: { type: 'friend_accepted', username },
  });
}

export async function notifyGameInvite(fromUsername: string, roomCode: string): Promise<void> {
  await showNotification({
    title: '🎮 Game Invite',
    body: `${fromUsername} invited you to play! Room: ${roomCode}`,
    tag: `game-invite-${roomCode}`,
    data: { type: 'game_invite', roomCode },
  });
}

export async function notifyTournamentStart(tournamentName: string): Promise<void> {
  await showNotification({
    title: '🏆 Tournament Starting',
    body: `${tournamentName} is starting now!`,
    tag: 'tournament-start',
    data: { type: 'tournament_start', tournament: tournamentName },
  });
}

export async function notifyDailyReward(): Promise<void> {
  await showNotification({
    title: '🎁 Daily Reward Ready',
    body: 'Your daily reward is waiting! Come claim it.',
    tag: 'daily-reward',
    data: { type: 'daily_reward' },
  });
}

export async function notifyAchievement(achievementName: string): Promise<void> {
  await showNotification({
    title: '🏅 Achievement Unlocked',
    body: `You earned: ${achievementName}`,
    tag: 'achievement',
    data: { type: 'achievement', name: achievementName },
  });
}

// Schedule a notification (for daily rewards reminder)
export async function scheduleDailyReminder(): Promise<void> {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  // Store the last reminder time
  const lastReminder = localStorage.getItem('guts_last_daily_reminder');
  const now = new Date();

  if (lastReminder) {
    const lastDate = new Date(lastReminder);
    // Only remind once per day
    if (lastDate.toDateString() === now.toDateString()) {
      return;
    }
  }

  localStorage.setItem('guts_last_daily_reminder', now.toISOString());

  // Schedule reminder for next day at 10 AM
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const delay = tomorrow.getTime() - now.getTime();

  // Use setTimeout (won't work if page is closed, but good for PWA)
  setTimeout(() => {
    notifyDailyReward();
  }, delay);
}

// Initialize notifications (call on app load)
export async function initializeNotifications(): Promise<void> {
  if (!isNotificationSupported()) return;

  // Register service worker if not already registered
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }

  // Schedule daily reminder if permission granted
  if (Notification.permission === 'granted') {
    scheduleDailyReminder();
  }
}

// Notification settings
export interface NotificationSettings {
  enabled: boolean;
  friendRequests: boolean;
  gameInvites: boolean;
  tournaments: boolean;
  dailyRewards: boolean;
  achievements: boolean;
}

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') {
    return {
      enabled: false,
      friendRequests: true,
      gameInvites: true,
      tournaments: true,
      dailyRewards: true,
      achievements: true,
    };
  }

  const stored = localStorage.getItem('guts_notification_settings');
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    enabled: Notification.permission === 'granted',
    friendRequests: true,
    gameInvites: true,
    tournaments: true,
    dailyRewards: true,
    achievements: true,
  };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('guts_notification_settings', JSON.stringify(settings));
}
