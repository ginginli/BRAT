// Service Worker for offline support

const CACHE_NAME = 'brat-generator-v2';
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
    const url = new URL(event.request.url);
    
    // 对于 CSS 和 JS 文件，使用网络优先策略（始终获取最新版本）
    if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
        event.respondWith(
            fetch(event.request).then(response => {
                // 如果网络请求成功，更新缓存
                // 只缓存 HTTP/HTTPS 协议的请求，避免缓存扩展协议等不支持的协议
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        try {
                            cache.put(event.request, responseClone);
                        } catch (error) {
                            // 静默处理缓存错误（例如不支持的协议）
                            console.warn('Failed to cache resource:', event.request.url, error);
                        }
                    });
                }
                return response;
            }).catch(() => {
                // 如果网络失败，使用缓存
                return caches.match(event.request);
            })
        );
    } else {
        // 对于其他资源，使用缓存优先策略
        // 只处理 HTTP/HTTPS 协议的请求，跳过扩展协议等
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            event.respondWith(
                caches.match(event.request).then(response => {
                    return response || fetch(event.request).then(fetchResponse => {
                        // 如果获取成功，尝试更新缓存
                        const responseClone = fetchResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            try {
                                cache.put(event.request, responseClone);
                            } catch (error) {
                                // 静默处理缓存错误
                                console.warn('Failed to cache resource:', event.request.url, error);
                            }
                        });
                        return fetchResponse;
                    });
                })
            );
        } else {
            // 对于非 HTTP/HTTPS 协议的请求（如扩展协议），直接获取，不缓存
            event.respondWith(fetch(event.request));
        }
    }
});