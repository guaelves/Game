// sw.js - 牛奶追蹤器 v7 (含自動清理舊快取)
const CACHE_NAME = 'milk-tracker-v7';
const ASSETS = [
  './',
  './index.html',
  './icon.png' // 建議確保有名為 icon.png 的圖片在同目錄
];

// 安裝時快取資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 啟動時清理舊版本
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 攔截請求，優先使用快取 (離線模式)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});