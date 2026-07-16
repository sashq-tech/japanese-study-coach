const CACHE_NAME = "japan-ready-coach-v33";
const APP_SHELL = [
  "./",
  "/",
  "/about",
  "/blog",
  "/blog/cash-cards-suica",
  "/blog/japan-visa-fee-watch",
  "/blog/japan-luggage-etiquette",
  "/blog/first-day-simple-phrases",
  "/blog/convenience-store-japanese",
  "/blog/okinawa-vs-mainland-japan",
  "/privacy",
  "/terms",
  "/contact",
  "./ads.txt",
  "./styles.css",
  "./n5-content.js",
  "./lessons.js",
  "./name-helper.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./robots.txt",
  "./sitemap.xml"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => (
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    ))
  );
});
