// performance.js - Optimisations des performances

class PerformanceOptimizer {
    constructor() {
        this.lazyImages = [];
        this.observedElements = new Set();
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
        this.preloadCriticalResources();
        this.manageMemory();
    }

    // Lazy loading des images
    lazyLoadImages() {
        this.lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-load');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les vieux navigateurs
            this.lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Optimisation des animations
    optimizeAnimations() {
        // Utiliser requestAnimationFrame pour des animations fluides
        const animate = () => {
            // Vos animations ici
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        // Désactiver les animations pour les utilisateurs qui les préfèrent réduites
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-smooth', 'none');
        }
    }

    // Preload des ressources critiques
    preloadCriticalResources() {
        const criticalResources = [
            '/css/style.css',
            '/css/seo-optimized.css',
            '/js/main.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Gestion de la mémoire
    manageMemory() {
        // Nettoyer les event listeners inutiles
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    cleanup() {
        this.lazyImages = null;
        this.observedElements.clear();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Service Worker pour le caching (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Optimisation du First Contentful Paint (FCP)
document.addEventListener('DOMContentLoaded', () => {
    // Supprimer le comportement de blocage du JS
    document.documentElement.classList.remove('no-js');
});

// Compression des images
class ImageOptimizer {
    static optimize(src, width, quality = 0.8) {
        // Implémentation pour l'optimisation des images
        return `${src}?width=${width}&quality=${quality}`;
    }
}

// Gestion du cache
class CacheManager {
    static set(key, value, ttl = 3600000) { // 1 heure par défaut
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    static get(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }
}

// Optimisation du scroll
class ScrollOptimizer {
    constructor() {
        this.lastKnownScrollPosition = 0;
        this.ticking = false;
        this.init();
    }

    init() {
        document.addEventListener('scroll', () => {
            this.lastKnownScrollPosition = window.scrollY;

            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll(this.lastKnownScrollPosition);
                    this.ticking = false;
                });

                this.ticking = true;
            }
        });
    }

    handleScroll(scrollPos) {
        // Optimisations basées sur la position de scroll
        const elements = document.querySelectorAll('.lazy-load');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                el.classList.add('visible');
            }
        });
    }
}

// Initialiser l'optimiseur de scroll
new ScrollOptimizer();