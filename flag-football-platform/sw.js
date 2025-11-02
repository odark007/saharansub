// Service Worker - Minimal version for Phase 1

const CACHE_NAME = 'flag-football-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './css/components.css',
  './css/mobile.css',
  './js/app.js',
  './js/router.js',
  './js/state.js',
  './js/auth.js',
  './js/db.js',
  './js/utils.js',
  './manifest.json'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Cache installation failed:', err);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip caching for:
  // 1. Non-GET requests
  // 2. API calls to backend
  // 3. Supabase API calls
  if (
    event.request.method !== 'GET' ||
    url.hostname === 'localhost' ||
    url.hostname.includes('supabase') ||
    url.pathname.includes('/api/')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first strategy for GET requests
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Fallback for offline
        return new Response('Offline - content not available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});