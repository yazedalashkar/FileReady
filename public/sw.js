/**
 * FileReady Service Worker
 * Minimal, pass-through service worker strictly designed to satisfy PWA installability
 * without caching user files, Blobs, object URLs, or causing stale application code.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Strictly pass-through to network for all requests.
  // Never caches user files, Blobs, data URLs, or API requests.
  // Ensures users always receive the latest deployed version without stale caching.
});
