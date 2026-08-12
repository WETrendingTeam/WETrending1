// ==========================================
// WETrendingTeam Service Worker
// Cache + Offline Support Only
// ==========================================

const CACHE_NAME = "wetrending-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./hub.html",
  "./campaign.html",
  "./hub.css",
  "./manifest.json",
  "./images/logo.png"
];

// Install

self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then((cache) => {

        return cache.addAll(FILES_TO_CACHE);

      })

  );

});

// Activate

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys()

      .then((keys) =>

        Promise.all(

          keys.map((key) => {

            if (key !== CACHE_NAME) {

              return caches.delete(key);

            }

          })

        )

      )

  );

  self.clients.claim();

});

// Fetch

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request)

      .then((response) => {

        return response || fetch(event.request);

      })

  );

});