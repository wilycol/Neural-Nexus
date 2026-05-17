const CACHE_NAME = 'nexus-command-v4.6.0';
const ASSETS = [
  '/',
  '/command.html?v=4.6.0',
  '/manifest.json',
  '/brand.png',
  '/favicon.ico',
  '/saludo_rico.mp3',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// 🔔 NOTIFICACIONES EN SEGUNDO PLANO (WEBPUSH / LOCAL SW EVENT)
self.addEventListener('push', (e) => {
  let data = { title: "Beatriz AI 💋", body: "Mensaje entrante del Ecosistema" };
  if (e.data) {
    try {
      data = e.data.json();
    } catch (err) {
      data.body = e.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: '/brand.png',
    badge: '/brand.png',
    vibrate: [300, 100, 400, 100, 300], // Patrón de vibración industrial premium (Fénix Wings)
    sound: '/saludo_rico.mp3', // Sonido personalizado premium de Beatriz
    data: { url: data.url || '/command.html' }
  };
  
  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 🖱️ CLIC EN LA NOTIFICACIÓN (ABRIR / ENFOCAR PWA)
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const urlToOpen = e.notification.data?.url || '/command.html';
  
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si la ventana ya está abierta, ponerle foco
      for (const client of clientList) {
        if (client.url.includes('/command.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
