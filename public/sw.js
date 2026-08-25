const CACHE_NAME = 'nexus-command-v5.0.0';
const ASSETS = [
  '/',
  '/command.html?v=5.0.0',
  '/manifest.json',
  '/brand.png',
  '/favicon.ico',
  '/saludo_rico.mp3',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (c) => {
      for (const asset of ASSETS) {
        try {
          await c.add(asset);
        } catch (err) {
          console.warn(`⚠️ [SW] No se pudo precachear el asset: ${asset}`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // Estrategia Network-First para la PWA y rutas API para garantizar actualización inmediata desde Vercel
  if (e.request.mode === 'navigate' || url.includes('command.html') || url.includes('/api/')) {
    e.respondWith(
      fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
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
  
  // Resolución de URL absoluta para evitar fallos de renderizado en WebAPKs de Android/Xiaomi
  const absoluteIcon = self.location.origin + '/brand.png';
  
  const options = {
    body: data.body,
    icon: absoluteIcon,
    badge: absoluteIcon,
    vibrate: [300, 100, 400, 100, 300], // Patrón de vibración industrial premium (Fénix Wings)
    sound: self.location.origin + '/saludo_rico.mp3', // Sonido personalizado premium de Beatriz
    tag: 'beatriz-message', // Identificador de canal único
    renotify: true, // Forzar alerta visual/sonora en actualizaciones
    requireInteraction: true, // Mantener el banner visible hasta interacción del usuario
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
