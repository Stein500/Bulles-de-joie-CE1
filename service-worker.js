const CACHE_NAME = 'bulles-de-joie-v3.0.0';
const API_CACHE_NAME = 'bulles-de-joie-api-v1';
const IMAGE_CACHE_NAME = 'bulles-de-joie-images-v1';

// Ressources critiques à cacher immédiatement
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/css/seo-optimized.css',
  '/js/main.js',
  '/js/preloader.js',
  '/assets/images/logo.png',
  '/assets/images/favicon.ico'
];

// Ressources à cacher au fur et à mesure
const ASSETS_TO_CACHE = [
  '/apropos.html',
  '/pedagogie.html',
  '/activites.html',
  '/resultats.html',
  '/contact.html',
  '/inscription.html',
  '/js/home-animation.js',
  '/js/activities-system.js',
  '/js/contact-manager.js',
  '/js/translation.js',
  '/js/performance-monitor.js',
  '/assets/fonts/poppins.woff2',
  '/assets/images/hero-background.jpg'
];

// Stratégie de cache : Network First pour les HTML, Cache First pour les assets
const NETWORK_FIRST_URLS = [
  '/',
  '/index.html',
  '/apropos.html',
  '/pedagogie.html',
  '/activites.html',
  '/resultats.html',
  '/contact.html',
  '/inscription.html'
];

// Installation - Cache des ressources critiques
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installation...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('📦 Mise en cache des ressources critiques');
          return cache.addAll(CRITICAL_ASSETS);
        }),
      self.skipWaiting()
    ])
  );
});

// Activation - Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activation...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prise de contrôle immédiate
      self.clients.claim()
    ])
  );
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorer les requêtes non-GET et les requêtes cross-origin
  if (event.request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Stratégies différentes selon le type de ressource
  if (NETWORK_FIRST_URLS.some(pattern => url.pathname === pattern)) {
    event.respondWith(networkFirstStrategy(event.request));
  } else if (url.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)) {
    event.respondWith(imageCacheStrategy(event.request));
  } else if (url.pathname.match(/\.(css|js|woff|woff2|ttf)$/)) {
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Stratégie Network First (pour le HTML)
async function networkFirstStrategy(request) {
  try {
    // D'abord essayer le réseau
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Mettre à jour le cache
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Fallback au cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback pour la page d'accueil
    if (request.url === self.location.origin + '/') {
      return caches.match('/index.html');
    }
    
    // Page 404 de fallback
    return new Response('Page non disponible hors ligne', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stratégie Cache First (pour les assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Mise à jour en arrière-plan
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback générique
    return new Response('Ressource non disponible', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stratégie spéciale pour les images
async function imageCacheStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Mise à jour en arrière-plan
    updateImageCacheInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Ne mettre en cache que les images de petite/moyenne taille
      const contentLength = networkResponse.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 500000) { // 500KB max
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Image de fallback
    return fetch('/assets/images/placeholder.jpg');
  }
}

// Mise à jour asynchrone du cache
async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response);
    }
  } catch (error) {
    // Échec silencieux
  }
}

// Mise à jour asynchrone du cache images
async function updateImageCacheInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 500000) {
        cache.put(request, response);
      }
    }
  } catch (error) {
    // Échec silencieux
  }
}

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.ports[0].postMessage({
      type: 'CACHE_STATUS',
      cacheName: CACHE_NAME,
      version: '3.0.0'
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Synchronisation en arrière-plan...');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Synchronisation des données utilisateur si nécessaire
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    // Vérifier les ressources obsolètes
    for (const request of keys) {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse);
        }
      } catch (error) {
        // Continuer avec les autres ressources
      }
    }
  } catch (error) {
    console.error('Erreur synchronisation:', error);
  }
}

// Gestion des push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Préchargement des pages liées
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRELOAD_PAGES') {
    const pages = event.data.pages || ['/apropos.html', '/contact.html'];
    
    event.waitUntil(
      Promise.all(
        pages.map(page => 
          fetch(page)
            .then(response => {
              if (response.ok) {
                const cache = caches.open(CACHE_NAME);
                return cache.then(c => c.put(page, response));
              }
            })
            .catch(() => { /* Ignorer les erreurs */ })
        )
      )
    );
  }
});

// Gestion de la bande passante
const isSlowConnection = () => {
  return navigator.connection 
    ? navigator.connection.saveData || 
      navigator.connection.effectiveType === 'slow-2g' || 
      navigator.connection.effectiveType === '2g'
    : false;
};

// Optimisation pour connexions lentes
self.addEventListener('fetch', (event) => {
  if (isSlowConnection()) {
    const url = new URL(event.request.url);
    
    // Ne pas mettre en cache les images lourdes en connexion lente
    if (url.pathname.match(/\.(jpg|jpeg|png|webp)$/) && 
        !url.pathname.includes('logo') &&
        !url.pathname.includes('icon')) {
      event.respondWith(fetch(event.request));
      return;
    }
  }
});

// Statistiques de cache
let cacheStats = {
  hits: 0,
  misses: 0,
  updates: 0
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      
      if (cachedResponse) {
        cacheStats.hits++;
        return cachedResponse;
      }
      
      cacheStats.misses++;
      return fetch(event.request);
    })()
  );
});

// Envoi des statistiques périodiquement
setInterval(() => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_STATS',
        stats: cacheStats
      });
    });
  });
}, 30000); // Toutes les 30 secondes

console.log('✅ Service Worker chargé et actif');