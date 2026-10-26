/* Nubi service worker v4.
   Estrategia: la red manda (stale-while-revalidate para el caparazón de la app),
   con respaldo en caché cuando no hay internet. Nunca se cachea /api/ ni POST. */
const CACHE = 'nubi-v4-0-0';

/* Archivos del caparazón: si falla uno, la instalación no se cae. */
const SHELL = [
  '/', '/index.html', '/core.js', '/catalog.js', '/app.js', '/styles.css',
  '/legal.css', '/offline.html', '/privacidad.html', '/terminos.html',
  '/manifest.webmanifest', '/favicon.ico',
  '/assets/icon-192.png', '/assets/icon-512.png', '/assets/maskable-512.png',
  '/assets/apple-touch-icon.png'
];

/* Rutas que nunca se sirven desde caché. */
const NO_CACHE = ['/api/', '/chat', '/recetas', '/ingredientes', '/verificar-plato', '/descargas/'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(SHELL.map(url => cache.add(new Request(url, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => (k.startsWith('nubi-v') || k.startsWith('qch-v')) && k !== CACHE).map(k => caches.delete(k)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

/* Permite que la app pida activar una versión nueva sin recargar dos veces. */
self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

const cacheable = url =>
  url.origin === self.location.origin && !NO_CACHE.some(p => url.pathname.startsWith(p));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!cacheable(url)) return;

  /* Navegaciones: red primero, caché después, y página de respaldo si no hay nada. */
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        const response = preload || await fetch(req);
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return response;
      } catch {
        return (await caches.match(req)) || (await caches.match('/index.html')) ||
               (await caches.match('/offline.html')) || Response.error();
      }
    })());
    return;
  }

  /* Recursos: se devuelve lo que hay en caché y se actualiza por detrás. */
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return response;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
