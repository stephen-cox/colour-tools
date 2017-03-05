/**
 * Alllow colour tools to be used without a network connection
 */

/**
 * Install service worker
 */
self.addEventListener('install', (event) => {
  console.log('SW: Install');
});

/**
 * Fetch resource
 */
self.addEventListener('fetch', (event) => {
  console.log('SW: Fetch');
  event.respondWith(
    caches.open('colour-tools').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
