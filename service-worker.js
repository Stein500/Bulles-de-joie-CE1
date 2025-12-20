// ============================================
// SERVICE WORKER - Les Bulles de Joie
// Version: 2.5 - Optimisée pour PWA
// ============================================

const CACHE_NAME = 'bulles-de-joie-v2.5';
const STATIC_CACHE = 'static-v2.5';
const DYNAMIC_CACHE = 'dynamic-v2.5';

// ============================================
// FICHIERS À METTRE EN CACHE
// ============================================
const STATIC_FILES = [
  // Pages principales
  '/',
  '/index.html',
  '/offline.html',
  '/contact.html',
  '/pedagogie-activites.html',
  '/tarifs-inscription.html',
  '/resultats.html',
  '/security-policy.html',
  '/security-hall-of-fame.html',
  
  // Manifest et icônes
  '/manifest.json',
  '/android-icon-36x36.png',
  '/android-icon-48x48.png',
  '/android-icon-72x72.png',
  '/android-icon-96x96.png',
  '/android-icon-144x144.png',
  '/android-icon-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/safari-pinned-tab.svg',
  
  // LOGO ESSENTIEL - CORRIGEZ LE CHEMIN SI NÉCESSAIRE
  '/assets/images/logo.png',
  
  // Fonts critiques
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Fredoka+One&display=swap'
];

// ============================================
// INSTALLATION
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] 📦 Installation en cours...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        console.log('[SW] 💾 Mise en cache des fichiers statiques');
        
        // Mettre en cache les fichiers critiques
        await cache.addAll(STATIC_FILES);
        console.log('[SW] ✅ Installation terminée');
        
        // Activer immédiatement
        await self.skipWaiting();
      } catch (error) {
        console.error('[SW] ❌ Erreur lors de l\'installation:', error);
      }
    })()
  );
});

// ============================================
// ACTIVATION
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] 🔄 Activation en cours...');
  
  event.waitUntil(
    (async () => {
      // Supprimer les anciens caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME].includes(cacheName)) {
            console.log(`[SW] 🗑️ Suppression de l'ancien cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
      
      // Prendre le contrôle de tous les clients
      await self.clients.claim();
      console.log('[SW] ✅ Activation terminée');
      
      // Informer les clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          message: 'Service Worker activé et prêt'
        });
      });
    })()
  );
});

// ============================================
// STRATÉGIE DE MISE EN CACHE
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les non-GET
  if (request.method !== 'GET') return;
  
  // Gestion spéciale pour les fonts Google
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(serveFonts(request));
    return;
  }
  
  // Ignorer les autres cross-origin
  if (!url.origin.startsWith(self.location.origin)) return;
  
  // Stratégie différente selon le type
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(serveHtml(request));
    return;
  }
  
  if (url.pathname.includes('logo.png') || 
      url.pathname.includes('favicon') || 
      url.pathname.endsWith('manifest.json')) {
    event.respondWith(serveCriticalAssets(request));
    return;
  }
  
  if (request.url.includes('.css') || request.url.includes('.js')) {
    event.respondWith(serveCssJs(request));
    return;
  }
  
  // Par défaut: Network First
  event.respondWith(serveDefault(request));
});

// ============================================
// FONCTIONS DE STRATÉGIE
// ============================================

// HTML: Cache First avec mise à jour en fond
async function serveHtml(request) {
  try {
    // Essayer le cache d'abord
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Mettre à jour en arrière-plan
      event.waitUntil(
        updateCache(request).catch(() => {
          // Échec silencieux
        })
      );
      return cachedResponse;
    }
    
    // Sinon, réseau avec mise en cache
    return await fetchAndCache(request, DYNAMIC_CACHE);
  } catch (error) {
    console.log('[SW] 📵 Hors ligne pour HTML, retour offline.html');
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('Hors ligne', { status: 503 });
  }
}

// Assets critiques: Cache Only
async function serveCriticalAssets(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    return await fetchAndCache(request, STATIC_CACHE);
  } catch {
    // Fallback pour le logo
    if (request.url.includes('logo.png')) {
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
          <rect width="60" height="60" rx="30" fill="#FF1493"/>
          <circle cx="30" cy="25" r="10" fill="white"/>
          <circle cx="30" cy="25" r="8" fill="#FF1493" opacity="0.8"/>
          <text x="30" y="45" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">BDJ</text>
        </svg>`,
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    return new Response('', { status: 404 });
  }
}

// CSS/JS: Cache First
async function serveCssJs(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    return await fetch(request);
  } catch {
    return new Response('', { 
      status: 404,
      headers: { 'Content-Type': 'text/css' }
    });
  }
}

// Fonts: Cache avec réseau
async function serveFonts(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('', { 
      headers: { 'Content-Type': 'text/css' }
    });
  }
}

// Default: Network First
async function serveDefault(request) {
  try {
    const response = await fetch(request);
    
    // Mettre en cache certaines images
    if (response.ok && request.url.includes('/assets/images/')) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Image placeholder pour les images manquantes
    if (request.url.match(/\.(jpg|jpeg|png|webp)$/)) {
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#f0f0f0"/>
          <circle cx="200" cy="120" r="50" fill="#FF1493" opacity="0.1"/>
          <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
            Image non disponible hors ligne
          </text>
          <text x="200" y="170" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
            Les Bulles de Joie
          </text>
        </svg>`,
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    return new Response('Ressource non disponible hors ligne', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  
  if (response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  
  return response;
}

async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // Échec silencieux
  }
}

// ============================================
// MESSAGES ET SYNCHRONISATION
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] 📨 Message reçu:', event.data);
  
  switch (event.data?.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports?.[0]?.postMessage({ success: true });
      });
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports?.[0]?.postMessage({ info });
      });
      break;
      
    case 'SYNC_DATA':
      syncOfflineData();
      break;
  }
});

// ============================================
// BACKGROUND SYNC
// ============================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  console.log('[SW] 🔄 Synchronisation des formulaires');
  
  // Récupérer les formulaires en attente
  const db = await openDatabase();
  const forms = await db.getAll('pendingForms');
  
  for (const form of forms) {
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      });
      
      if (response.ok) {
        await db.delete('pendingForms', form.id);
        console.log(`[SW] ✅ Formulaire ${form.id} synchronisé`);
        
        // Notification
        self.registration.showNotification('Synchronisation réussie', {
          body: 'Vos données ont été envoyées',
          icon: '/android-icon-192x192.png',
          tag: 'sync-success'
        });
      }
    } catch (error) {
      console.error('[SW] ❌ Erreur de synchronisation:', error);
    }
  }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: 'Les Bulles de Joie',
      body: event.data.text() || 'Nouvelle notification'
    };
  }
  
  const options = {
    body: data.body,
    icon: '/android-icon-192x192.png',
    badge: '/android-icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Ouvrir', icon: '/android-icon-36x36.png' },
      { action: 'dismiss', title: 'Fermer' }
    ]
  };
  
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') return;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

// ============================================
// GESTION HORS LIGNE
// ============================================
self.addEventListener('offline', () => {
  console.log('[SW] 📵 Mode hors ligne détecté');
  
  // Informer tous les clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS',
        online: false,
        timestamp: Date.now()
      });
    });
  });
});

self.addEventListener('online', () => {
  console.log('[SW] 🌐 Mode en ligne détecté');
  
  // Informer tous les clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS',
        online: true,
        timestamp: Date.now()
      });
    });
  });
  
  // Synchroniser
  self.registration.sync.register('sync-forms').catch(() => {
    // API Sync non supportée
  });
});

// ============================================
// INDEXEDDB
// ============================================
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BullesDeJoieDB', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingForms')) {
        const store = db.createObjectStore('pendingForms', { 
          keyPath: 'id',
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
      }
      
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'key' });
      }
    };
  });
}

// ============================================
// FONCTIONS DE MAINTENANCE
// ============================================
async function clearCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] 🗑️ Tous les caches nettoyés');
}

async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const requests = await cache.keys();
    info[name] = requests.length;
  }
  
  return info;
}

// Nettoyage automatique toutes les semaines
setInterval(async () => {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader && new Date(dateHeader).getTime() < oneWeekAgo) {
        await cache.delete(request);
      }
    }
  }
}, 7 * 24 * 60 * 60 * 1000);

// ============================================
// APP INSTALLED EVENT
// ============================================
self.addEventListener('appinstalled', () => {
  console.log('[SW] 📱 Application installée');
});

// ============================================
// ERREURS GLOBALES
// ============================================
self.addEventListener('error', (error) => {
  console.error('[SW] 🔥 Erreur non gérée:', error);
});