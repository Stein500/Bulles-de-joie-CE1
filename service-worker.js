// ============================================
// SERVICE WORKER - Les Bulles de Joie PWA
// Version 2.1 avec offline.html intégré
// ============================================

const CACHE_NAME = 'bulles-de-joie-v2.1';
const STATIC_CACHE = 'static-v2.1';
const DYNAMIC_CACHE = 'dynamic-v2.1';

// Fichiers à mettre en cache lors de l'installation
const STATIC_FILES = [
  '/',
  '/index.html',
  '/contact.html',
  '/pedagogie-activites.html',
  '/tarifs-inscription.html',
  '/resultats.html',
  '/security-policy.html',
  '/security-hall-of-fame.html',
  '/offline.html',  // NOUVEAU : Page hors ligne
  '/manifest.json',
  
  // Icônes PWA
  '/android-icon-36x36.png',
  '/android-icon-48x48.png',
  '/android-icon-72x72.png',
  '/android-icon-96x96.png',
  '/android-icon-144x144.png',
  '/android-icon-192x192.png',
  '/android-chrome-512x512.png',
  
  // Favicons (si existants)
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/safari-pinned-tab.svg',
  
  // Police de secours pour offline
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Fredoka+One&display=swap'
];

// ============================================
// INSTALLATION DU SERVICE WORKER
// ============================================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 📦 Installation en cours...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] 💾 Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_FILES.map(url => {
          // Gestion des erreurs pour chaque fichier
          return cache.add(url).catch(error => {
            console.warn(`[Service Worker] ⚠️ Impossible de mettre en cache ${url}:`, error);
            return Promise.resolve();
          });
        }));
      })
      .then(() => {
        console.log('[Service Worker] ✅ Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] ❌ Erreur lors de l\'installation:', error);
      })
  );
});

// ============================================
// ACTIVATION DU SERVICE WORKER
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 🔄 Activation en cours...');
  
  // Nettoyer les anciens caches
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[Service Worker] 🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] ✅ Activation terminée');
        return self.clients.claim();
      })
      .then(() => {
        // Envoyer un message à tous les clients pour les informer
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              message: 'Service Worker activé avec succès!'
            });
          });
        });
      })
  );
});

// ============================================
// STRATÉGIE DE MISE EN CACHE INTELLIGENTE
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et les requêtes cross-origin (sauf les fonts Google)
  if (request.method !== 'GET') return;
  
  // Gestion spéciale pour les fonts Google
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          return fetch(request)
            .then(response => {
              // Mettre en cache la police
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
              return response;
            })
            .catch(() => {
              // Retourner une police de secours
              return new Response('', {
                headers: { 'Content-Type': 'text/css' }
              });
            });
        })
    );
    return;
  }
  
  // Ignorer les autres requêtes cross-origin
  if (!url.origin.startsWith(self.location.origin)) return;
  
  // Stratégie: Cache First pour les pages HTML
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          // Si la page est en cache, la retourner immédiatement
          if (cachedResponse) {
            // Mettre à jour le cache en arrière-plan
            event.waitUntil(
              fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.ok) {
                    return caches.open(DYNAMIC_CACHE)
                      .then((cache) => cache.put(request, networkResponse.clone()));
                  }
                })
                .catch(() => {
                  // Échec réseau, on garde la version en cache
                })
            );
            return cachedResponse;
          }
          
          // Sinon, aller sur le réseau
          return fetch(request)
            .then((networkResponse) => {
              // Vérifier si la réponse est valide
              if (!networkResponse || networkResponse.status !== 200) {
                return caches.match('/offline.html');
              }
              
              // Mettre en cache pour la prochaine fois
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
              
              return networkResponse;
            })
            .catch(() => {
              // Réseau indisponible, retourner offline.html
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // Stratégie: Cache Only pour les icônes et manifest
  if (url.pathname.includes('android-icon') || 
      url.pathname.includes('favicon') || 
      url.pathname.endsWith('manifest.json')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request);
        })
    );
    return;
  }
  
  // Stratégie: Cache First pour les CSS et JS intégrés
  if (request.url.includes('.css') || request.url.includes('.js')) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          return fetch(request);
        })
    );
    return;
  }
  
  // Pour tout le reste: Network First (sans mise en cache des images par défaut)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Pour les images importantes, on peut les mettre en cache
        if (request.url.includes('/assets/images/logo') || 
            request.url.includes('/assets/images/favicon')) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Réseau indisponible, essayer le cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Pour les images, retourner une image de secours
            if (request.url.includes('.jpg') || request.url.includes('.png') || request.url.includes('.webp')) {
              return new Response(
                `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                  <rect width="400" height="300" fill="#f0f0f0"/>
                  <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
                    Image non disponible hors ligne
                  </text>
                  <text x="200" y="170" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
                    Les Bulles de Joie
                  </text>
                </svg>`,
                {
                  headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                  }
                }
              );
            }
            
            return new Response('Ressource non disponible hors ligne', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// ============================================
// SYNC EN ARRIÈRE-PLAN
// ============================================
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 🔄 Synchronisation:', event.tag);
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  try {
    const db = await openDatabase();
    const pendingForms = await db.getAll('pendingForms');
    
    for (const form of pendingForms) {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      });
      
      if (response.ok) {
        await db.delete('pendingForms', form.id);
        console.log(`[Service Worker] ✅ Formulaire ${form.id} synchronisé`);
        
        // Envoyer une notification
        self.registration.showNotification('Synchronisation réussie', {
          body: 'Vos données ont été synchronisées',
          icon: '/android-icon-192x192.png',
          badge: '/android-icon-72x72.png'
        });
      }
    }
  } catch (error) {
    console.error('[Service Worker] ❌ Erreur de synchronisation:', error);
  }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 📢 Notification push reçue');
  
  if (!event.data) return;
  
  let data;
  try {
    data = event.data.json();
  } catch (e) {
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
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/android-icon-36x36.png'
      },
      {
        action: 'dismiss',
        title: 'Fermer',
        icon: '/android-icon-36x36.png'
      }
    ],
    tag: data.tag || 'general-notification',
    renotify: true,
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 🔔 Notification cliquée:', event.action);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  let url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Chercher un client ouvert
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ============================================
// GESTION DES MESSAGES
// ============================================
self.addEventListener('message', (event) => {
  console.log('[Service Worker] 📨 Message reçu:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(STATIC_CACHE);
      caches.delete(DYNAMIC_CACHE);
      event.ports[0].postMessage({ success: true });
      break;
      
    case 'GET_CACHE_INFO':
      caches.keys().then(cacheNames => {
        const cacheInfo = {};
        Promise.all(
          cacheNames.map(cacheName => 
            caches.open(cacheName)
              .then(cache => cache.keys())
              .then(requests => {
                cacheInfo[cacheName] = requests.length;
              })
          )
        ).then(() => {
          event.ports[0].postMessage({ cacheInfo });
        });
      });
      break;
      
    case 'UPDATE_CONTENT':
      updateContent(event.data.url);
      break;
  }
});

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Mise à jour du contenu
async function updateContent(url) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await fetch(url);
    
    if (response.ok) {
      await cache.put(url, response.clone());
      
      // Informer tous les clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'CONTENT_UPDATED',
          url: url,
          timestamp: Date.now()
        });
      });
    }
  } catch (error) {
    console.error('[Service Worker] ❌ Erreur de mise à jour:', error);
  }
}

// IndexedDB simplifié pour stocker des données hors ligne
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BullesDeJoieDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingForms')) {
        const store = db.createObjectStore('pendingForms', { 
          keyPath: 'id',
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('offlineData')) {
        const store = db.createObjectStore('offlineData', { keyPath: 'key' });
        store.createIndex('category', 'category', { unique: false });
      }
    };
  });
}

// Nettoyage périodique du cache
setInterval(() => {
  caches.open(DYNAMIC_CACHE).then(cache => {
    cache.keys().then(requests => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      requests.forEach(request => {
        cache.match(request).then(response => {
          if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
              const cacheDate = new Date(dateHeader).getTime();
              if (cacheDate < oneWeekAgo) {
                cache.delete(request);
              }
            }
          }
        });
      });
    });
  });
}, 24 * 60 * 60 * 1000); // Tous les jours

// ============================================
// GESTION D'ERREURS GLOBALES
// ============================================
self.addEventListener('error', (error) => {
  console.error('[Service Worker] 🔥 Erreur non gérée:', error);
  
  // Enregistrer l'erreur dans IndexedDB pour analyse ultérieure
  try {
    openDatabase().then(db => {
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      store.put({
        key: `error_${Date.now()}`,
        type: 'service_worker_error',
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });
  } catch (e) {
    console.error('[Service Worker] Impossible d\'enregistrer l\'erreur:', e);
  }
});

// ============================================
// GESTION DES INSTALLATIONS PWA
// ============================================
self.addEventListener('appinstalled', (event) => {
  console.log('[Service Worker] 📱 PWA installée avec succès');
  
  // Envoyer une analyse
  fetch('/api/analytics/pwa-installed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: Date.now(),
      platform: navigator.platform,
      userAgent: navigator.userAgent
    })
  }).catch(() => {
    // Ignorer les erreurs en mode hors ligne
  });
});

// ============================================
// GESTION DU MODE HORS LIGNE AVANCÉ
// ============================================
self.addEventListener('offline', () => {
  console.log('[Service Worker] 📵 Mode hors ligne détecté');
  
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
  console.log('[Service Worker] 🌐 Mode en ligne détecté');
  
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
  
  // Tenter une synchronisation
  self.registration.sync.register('sync-forms').catch(() => {
    // API Sync non supportée
  });
});