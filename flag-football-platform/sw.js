/**
 * Service Worker for NFL Flag Referee Guide
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'nfl-guide-v1.0.0';
const urlsToCache = [
    './',
    './nfl-guide.html',
    './css/nfl-guide.css',
    './js/nfl-guide.js',
    './data/guide-content.json',
    './images/nfl-guide-logo.png',
    './images/nfl-guide-logo-small.png',
    './images/cover-image.jpg',
    './images/coach-goddie.jpg',
    // Font Awesome
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;600&family=Roboto:wght@400;500;700&display=swap'
];

// Install event - cache all resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache.map(url => new Request(url, {
                    cache: 'reload'
                }))).catch(error => {
                    console.error('Service Worker: Cache failed for', error);
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Clearing old cache');
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Don't cache if not a valid response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type === 'error') {
                            return fetchResponse;
                        }

                        // Clone the response
                        const responseToCache = fetchResponse.clone();

                        // Cache the new response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Don't cache POST requests or external API calls
                                if (event.request.method === 'GET' && 
                                    !event.request.url.includes('youtube.com') &&
                                    !event.request.url.includes('analytics')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return fetchResponse;
                    })
                    .catch(error => {
                        console.log('Service Worker: Fetch failed', error);
                        // You could return a custom offline page here
                        return caches.match('./nfl-guide.html');
                    });
            })
    );
});