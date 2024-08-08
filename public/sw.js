// 缓存的版本号
const VERSION = "v1";

// 缓存名称
const CACHE_NAME = `period-tracker-${VERSION}`;

// 需要缓存的静态资源名称
const APP_STATIC_RESOURCES = [
  "/",
  "/favicon.svg",
  "/mainfest.json",
  "/offline",
  "/sw.js"
];

// 预加载的时候将静态资源进行缓存
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// 删除老的缓存数据
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// 网络请求拦截，存储页面缓存
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        }).catch(() => caches.match('/offline'));
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      }).catch(() => caches.match('/offline'))
    );
  }
});