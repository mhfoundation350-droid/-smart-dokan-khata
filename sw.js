const CACHE_NAME = 'dokan-v1.0.2'; // আপডেট দিলে এটা v1.0.3 করবেন
const urlsToCache = [
  'index.html', 
  'dashboard.html', 
  'style.css', 
  'app.js', 
  'logo.png',
  'manifest.json'
];

// Install - নতুন ফাইল Cache করবে
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // সাথে সাথে Activate হবে
});

// Activate - পুরান Cache ডিলেট করবে
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('পুরান Cache ডিলেট:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - নেট থাকলে নতুন, না থাকলে Cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});