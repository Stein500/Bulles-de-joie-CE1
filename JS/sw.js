// sw.js - Service Worker pour la mise en cache et les fonctionnalités hors ligne

const CACHE_NAME = 'bulles-de-joie-v1.2.0';
const STATIC_CACHE = 'static-v1.1.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/apropos.html',
  '/pedagogie.html',
  '/activites.html',
  '/resultats.html',
  '/contact.html',
  '/inscription.html',
  '/404.html',
  '/css/main.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/css/seo-optimized.css',
  '/js/app.js',
  '/js/performance.js',
  '/js/home-animation.js',
  '/js/self-analytics.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Fredoka+One&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors de l\'installation', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation terminée');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les requêtes chrome-extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la ressource en cache si disponible
        if (response) {
          return response;
        }

        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((fetchResponse) => {
            // Vérifier si la réponse est valide
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = fetchResponse.clone();

            // Mettre en cache les ressources dynamiques
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                // Ne pas mettre en cache les requêtes analytics
                if (!event.request.url.includes('/api/analytics')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return fetchResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Erreur de fetch', error);
            
            // Stratégie de fallback pour les pages HTML
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Fallback pour les images
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon-512x512.png');
            }
            
            return new Response('Ressource non disponible hors ligne', {
              status: 408,
              statusText: 'Hors ligne'
            });
          });
      })
  );
});

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Synchronisation en arrière-plan');
    event.waitUntil(doBackgroundSync());
  }
});

// Synchronisation des données analytics hors ligne
async function doBackgroundSync() {
  try {
    // Récupérer les événements analytics en file d'attente
    const queue = await getQueuedEvents();
    
    if (queue.length > 0) {
      console.log(`Service Worker: Envoi de ${queue.length} événements analytics`);
      
      for (const event of queue) {
        await sendAnalyticsEvent(event);
      }
      
      // Vider la file d'attente après envoi réussi
      await clearQueue();
    }
  } catch (error) {
    console.error('Service Worker: Erreur lors de la synchronisation', error);
  }
}

// Récupérer les événements en file d'attente
async function getQueuedEvents() {
  return new Promise((resolve) => {
    // Utiliser IndexedDB pour stocker les événements
    const request = indexedDB.open('AnalyticsQueue', 1);
    
    request.onerror = () => resolve([]);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['events'], 'readonly');
      const store = transaction.objectStore('events');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => resolve([]);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Envoyer un événement analytics
async function sendAnalyticsEvent(event) {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    
    if (response.ok) {
      return true;
    }
    throw new Error('Échec de l\'envoi');
  } catch (error) {
    console.error('Service Worker: Erreur d\'envoi analytics', error);
    throw error;
  }
}

// Vider la file d'attente
async function clearQueue() {
  return new Promise((resolve) => {
    const request = indexedDB.open('AnalyticsQueue', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['events'], 'readwrite');
      const store = transaction.objectStore('events');
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => resolve();
    };
    
    request.onerror = () => resolve();
  });
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
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

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});