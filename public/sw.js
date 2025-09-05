const CACHE_NAME = 'sikkim-monasteries-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx',
  '/src/components/Homepage.tsx',
  '/src/components/InteractiveMap.tsx',
  '/src/components/VirtualTours.tsx',
  '/src/components/AudioGuide.tsx',
  '/src/components/DigitalArchives.tsx',
  '/src/components/CulturalCalendar.tsx',
  '/src/components/BlogSection.tsx',
  '/src/components/BusScheduling.tsx',
  '/src/components/WeatherForecast.tsx',
  '/src/components/Navigation.tsx',
  '/src/assets/sikkim-monasteries-hero.jpg',
  '/src/assets/monastery-1.jpg',
  '/src/assets/monastery-2.jpg',
  '/src/assets/monastery-3.jpg',
  '/src/assets/monastery-logo.png',
  '/src/assets/virtual-tours-hero.jpg',
  '/src/assets/audio-guide-hero.jpg',
  '/src/assets/digital-archives-hero.jpg',
  '/src/assets/cultural-calendar-hero.jpg',
  '/lovable-uploads/monastery-1.jpg',
  '/lovable-uploads/monastery-2.jpg',
  '/lovable-uploads/monastery-3.jpg'
];

const IMAGE_CACHE = 'images-v1';
const MAPS_CACHE = 'maps-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE && cacheName !== MAPS_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests and chrome-extension URLs
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return a fallback image if available
            return cache.match('/lovable-uploads/monastery-1.jpg') || new Response('', { status: 404 });
          });
        });
      })
    );
    return;
  }
  
  // Handle Google Maps API with network-first strategy
  if (request.url.includes('googleapis.com') || request.url.includes('google.com/maps')) {
    event.respondWith(
      caches.open(MAPS_CACHE).then((cache) => {
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          return cache.match(request) || new Response('{}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }
  
  // Handle CSS, JS, and other assets with cache-first strategy
  if (request.destination === 'style' || request.destination === 'script' || 
      request.url.includes('.css') || request.url.includes('.js') || 
      request.url.includes('.tsx') || request.url.includes('.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return cache.match(request) || new Response('', { status: 404 });
          });
        });
      })
    );
    return;
  }
  
  // Handle navigation requests (HTML pages) with network-first strategy
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache successful responses for HTML pages
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline page for navigation requests
          return new Response(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <title>Offline - Monastery360</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    text-align: center; 
                    padding: 50px 20px; 
                    background: linear-gradient(135deg, #1a1a2e, #16213e); 
                    color: white; 
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .offline-container { max-width: 400px; }
                  .icon { font-size: 64px; margin-bottom: 20px; animation: pulse 2s infinite; }
                  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
                  h1 { color: #ff6b35; margin-bottom: 20px; }
                  p { color: #ccc; line-height: 1.6; margin-bottom: 30px; }
                  button { 
                    background: #ff6b35; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 25px; 
                    cursor: pointer; 
                    margin: 0 8px; 
                    font-weight: 600;
                    transition: all 0.3s ease;
                  }
                  button:hover { background: #e55a2d; transform: translateY(-2px); }
                </style>
              </head>
              <body>
                <div class="offline-container">
                  <div class="icon">🏛️</div>
                  <h1>You're Offline</h1>
                  <p>You're currently offline, but you can still browse cached monastery content and explore the features you've already visited.</p>
                  <button onclick="window.location.reload()">Try Again</button>
                  <button onclick="window.history.back()">Go Back</button>
                </div>
              </body>
            </html>
          `, {
            headers: { 
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache'
            }
          });
        });
      })
    );
    return;
  }
  
  // Handle all other requests with network-first, fallback to cache
  event.respondWith(
    fetch(request).then((response) => {
      // Cache successful responses
      if (response.status === 200 && request.url.startsWith(self.location.origin)) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
        });
      }
      return response;
    }).catch(() => {
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || new Response('Service Unavailable', { 
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement any background sync logic here
  return Promise.resolve();
}