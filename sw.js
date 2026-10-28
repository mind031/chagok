// 차곡차곡 오프라인 캐시 — 파일을 고치면 아래 버전 숫자를 올려 주세요
const CACHE = "chagok-v5";
const FILES = [
  "./", "index.html", "app.js", "stickers.js", "firebase-config.js", "board.webp",
  "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// 내 사이트 파일만 다룬다. 파이어베이스 등 바깥 주소는 그대로 통과.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // 새 버전을 먼저 받아오고, 인터넷이 없으면 저장해 둔 파일을 쓴다
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
