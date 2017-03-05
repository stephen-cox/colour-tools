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
  console.log(event);
  event.respondWith(fetch(event.request));
});