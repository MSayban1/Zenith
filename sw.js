
const CACHE_NAME = 'zenith-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  const notification = event.notification;
  
  notification.close();

  if (action === 'snooze') {
    // Logic for snooze would ideally happen in the app. 
    // We open the app to handle state updates.
    event.waitUntil(
      clients.openWindow('/?action=snooze&id=' + notification.data.id)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
