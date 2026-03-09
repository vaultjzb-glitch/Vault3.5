// VAULT v3.5 — Service Worker
const CACHE = 'vault-v3.5';
const ASSETS = ['./index.html', './manifest.json'];

// Install: cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Keep-alive ping from app
self.addEventListener('message', e => {
  if (e.data === 'ping') {
    // Heartbeat received — service worker stays alive
  }
});
