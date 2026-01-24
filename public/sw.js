// GUTS Service Worker
const CACHE_NAME = 'guts-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/favicon.svg',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API and auth requests
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response for caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification from GUTS',
      icon: data.icon || '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      data: data.data || {},
      tag: data.tag || 'guts-notification',
      requireInteraction: false,
      actions: data.actions || [],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'GUTS', options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let url = '/';

  // Route based on notification type
  switch (data.type) {
    case 'friend_request':
      url = '/?friends=true';
      break;
    case 'game_invite':
      url = `/?join=${data.roomCode}`;
      break;
    case 'tournament_start':
      url = '/tournaments';
      break;
    case 'daily_reward':
      url = '/?claim=daily';
      break;
    case 'achievement':
      url = '/?achievements=true';
      break;
    default:
      url = '/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window if no existing window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
