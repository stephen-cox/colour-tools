'use strict';

/**
 * Alllow colour tools to be used without a network connection
 */

/**
 * Install service worker
 */
self.addEventListener('install', function (event) {
  console.log('SW: Install');
});

/**
 * Fetch resource
 */
self.addEventListener('fetch', function (event) {
  console.log('SW: Fetch');
  event.respondWith(caches.open('mysite-dynamic').then(function (cache) {
    return cache.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    });
  }));
});

/**
 * Function to run when network request suceeds
 */
var onNetworkSuccess = function onNetworkSuccess(response) {
  console.log('Online');
  var responseCopy = response.clone();
  caches.open('my_cache').then(function (cache) {
    cache.put(event.request, responseCopy);
  });
  return response;
};

/**
 * Function to run when network request fails
 */
var onNetworkError = function onNetworkError(error) {
  console.log('Offline');
  return caches.match(event.request);
};