const CACHE_NAME = 'bulles-de-joie-v2.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/apropos.html',
  '/pedagogie.html',
  '/activites.html',
  '/resultats.html',
  '/contact.html',
  '/inscription.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/preloader.js',
  '/js/translation.js',
  '/assets/images/logo.png'
];

// Installation
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie: Cache First, puis Network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourne la réponse en cache si disponible
        if (response) {
          return response;
        }

        // Sinon, fait la requête réseau
        return fetch(event.request).then(function(response) {
          // Vérifie si la réponse est valide
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone la réponse
          var responseToCache = response.clone();

          // Met en cache la nouvelle ressource
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      }
    )
  );
});