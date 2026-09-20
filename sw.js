// Jay.OS service worker. Same-origin requests are served from cache and
// refreshed in the background, so the app opens instantly and works
// offline; the next open after a deploy picks up the new version.
const CACHE = 'jay-os-v1';
const SHELL = [
  './', './index.html', './manifest.json',
  './css/base.css', './css/components.css', './css/mobile.css', './css/home.css',
  './js/state.js', './js/nav.js', './js/home.js', './js/nonneg.js',
  './js/superpower.js', './js/install.js', './js/programs.js',
  './pages/home.html', './pages/unstuck.html', './pages/programs.html', './pages/library.html',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const key = new Request(url.origin + url.pathname);   // ignore ?v= cache-busters
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(key).then(hit => {
        const refresh = fetch(e.request).then(res => {
          if (res && res.ok) cache.put(key, res.clone());
          return res;
        }).catch(() => hit);
        return hit || refresh;
      })
    )
  );
});
