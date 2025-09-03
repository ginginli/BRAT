// Service Worker for offline support

const CACHE_NAME = 'brat-generator-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/mobile-optimization.css',
    '/script.js',
    '/mobile-optimization.js',
    '/performance-optimization.js',
    '/LanguageSwitcher.js',
    '/favicon.ico'
];

// 安装事件
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// 激活事件
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});