
const CACHE = 'cache-v1';

const PRECACHE_URLS = [
	'index.html',
	//'./', // Alias for index.html
	'style.css',
	'main.js'
];

self.addEventListener('install', e => {
	e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener('activate', e => {
	const currentCaches = [CACHE];
	e.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', e => {
	if (e.request.url.match(/^.*(\/sw\.js)$/)) {
		return false;
	}
	if (e.request.url.startsWith(self.location.origin)) {
		e.respondWith(
		caches.match(e.request).then(cached => {
			if (cached) return cached;

			return caches.open(CACHE).then(cache => {
				return fetch(e.request).then(response => {
					return cache.put(e.request, response.clone()).then(() => response);
				}).catch(e => console.log(e));
			});
		}));
	}
})

