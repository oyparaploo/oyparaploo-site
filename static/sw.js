// Oyparaploo Service Worker
// Minimal SW to enable "Add to Home Screen" / "Install app" in Chrome

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
