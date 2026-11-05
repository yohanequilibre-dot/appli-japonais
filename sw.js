/* Kotoba — cache hors ligne, réseau d'abord. */
const CACHE = 'kotoba-v6-20';
const ASSETS = [
'./',
'./index.html',
'./styles.css',
'./data.js',
'./js/vocab-extra.js',
'./js/vocab-1000.js',
'./js/lexicon.js',
'./js/srs.js',
'./js/parser.js',
'./js/polite.js',
'./js/reading.js',
'./js/grammar-reading.js',
'./js/pronunciation.js',
'./js/phrase.js',
'./js/conversation.js',
'./js/whisper.js',
'./js/whisper-worker.js',
'./js/motivation.js',
'./js/sync.js',
'./js/app.js',
'./manifest.webmanifest',
'./icon.svg'
];
self.addEventListener('install', function (event) {
event.waitUntil(
caches.open(CACHE).then(function (cache) { return cache.addAll(ASSETS); })
.then(function () { return self.skipWaiting(); })
);
});
self.addEventListener('activate', function (event) {
event.waitUntil(
caches.keys().then(function (keys) {
return Promise.all(keys.filter(function (key) { return key !== CACHE; }).map(function (key) { return caches.delete(key); }));
}).then(function () { return self.clients.claim(); })
);
});
self.addEventListener('fetch', function (event) {
const request = event.request;
if (request.method !== 'GET') return;
const url = new URL(request.url);
if (url.origin !== self.location.origin) return;
event.respondWith(
fetch(request).then(function (response) {
if (response && response.ok) {
const copy = response.clone();
caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
}
return response;
}).catch(function () {
return caches.match(request).then(function (hit) {
if (hit) return hit;
if (request.mode === 'navigate') return caches.match('./index.html');
return Response.error();
});
})
);
});
