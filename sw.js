/* 일산명월관요정 — Service Worker v4 (Round 4) */
const CACHE = 'mmg-v4-2026-05-21';
const PRECACHE = [
  '/',
  '/style.css',
  '/engage.js',
  '/main.js',
  '/og-image.png',
  '/favicon.svg',
  '/site.webmanifest',
  '/blog/first/',
  '/blog/business/',
  '/blog/food/',
  '/blog/music/',
  '/blog/vip/',
  '/blog/compare/',
  '/blog/seasonal/',
  '/blog/private/',
  '/blog/after/'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => null))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // HTML: network-first (always fresh content), fallback to cache
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('/')))
    );
    return;
  }

  // Static assets: cache-first, fallback to network
  e.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached)
    )
  );
});
