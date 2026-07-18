// Kill-switch service worker.
// Retires the old Strongshift PWA (cache "strongshift-vNN"). The app is now the
// Expo web build, which manages its own loading and registers no service worker.
// Returning users' browsers re-fetch this file on their next visit; because it
// changed, it installs, wipes all old caches, unregisters itself, and reloads any
// open windows so they pull the fresh app. New visitors never register a worker.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.clients.claim();
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) => client.navigate(client.url));
  })());
});

// Pass every request straight through to the network — never serve stale cache.
self.addEventListener("fetch", () => {});
