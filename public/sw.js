// gotetris service worker: lets the home screen app start offline.
// Network first, so players always get the latest version when online.
const CACHE = "gotetris-v1";
const PRECACHE = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", e => {
   e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
   e.waitUntil(caches.keys()
      .then(keys => Promise.all(keys.filter(k => k != CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
   const req = e.request;
   if (req.method != "GET" || new URL(req.url).origin != location.origin) return;
   e.respondWith(fetch(req)
      .then(res => {
         if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
         }
         return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
         .then(hit => hit || (req.mode == "navigate" ? caches.match("/") : Response.error()))));
});
