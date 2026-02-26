// sw.js - v12 (背景強效版)
let userRecords = {};

// 監聽來自網頁的數據同步
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_DATA') {
        userRecords = event.data.data;
    }
});

// 每 15 分鐘自我檢查一次 (Service Worker 存活期間)
setInterval(() => {
    checkAndNotify();
}, 900000); 

function checkAndNotify() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // 只在每小時的 0 分 ~ 15 分之間觸發，避免重複
    // 這裡設為全天每小時提醒，直到領取為止
    const offset = (day === 0) ? -6 : 1 - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + offset);
    const weekId = `week-${mon.getFullYear()}-${mon.getMonth()+1}-${mon.getDate()}`;

    // 如果沒領，才發通知
    if (userRecords[weekId] !== 'true') {
        const msgs = [
            "🥛 新的一週開始！別忘了兌換本週牛奶。",
            "🧪 又是美好的一天，順路去換瓶牛奶吧！",
            "⏳ 小週末，牛奶領取了嗎？",
            "📅 牛奶時間，記得去領牛奶喔！",
            "⚠️ 倒數兩天！再不領就沒機會了！",
            "🚨 明天最後一天！請務必前往兌換。",
            "🔥 最後衝刺！今天是本週牛奶截止日！"
        ];

        self.registration.showNotification('牛奶兌換提醒', {
            body: msgs[day],
            tag: `milk-remind-${weekId}-${hour}`, // 確保每小時只跳一次
            icon: 'https://cdn-icons-png.flaticon.com/512/372/372922.png',
            requireInteraction: true
        });
    }
}

// 基本 PWA 快取功能
const CACHE_NAME = 'milk-v12';
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['./', './index.html'])));
    self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));