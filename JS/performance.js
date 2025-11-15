// performance.js - Optimisations de performance avancées

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPreloading();
        this.setupCaching();
        this.setupPerformanceMonitoring();
        this.setupResourceOptimization();
    }

    // Chargement différé des images et iframes
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyMedia = document.querySelectorAll('[data-src], [data-srcset]');
            
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const media = entry.target;
                        
                        if (media.dataset.src) {
                            media.src = media.dataset.src;
                            media.removeAttribute('data-src');
                        }
                        
                        if (media.dataset.srcset) {
                            media.srcset = media.dataset.srcset;
                            media.removeAttribute('data-srcset');
                        }
                        
                        media.classList.add('loaded');
                        lazyObserver.unobserve(media);
                    }
                });
            });

            lazyMedia.forEach(media => lazyObserver.observe(media));
        }
    }

    // Préchargement des ressources critiques
    setupPreloading() {
        // Préchargement des polices critiques
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'style';
            link.onload = () => link.rel = 'stylesheet';
            document.head.appendChild(link);
        });

        // Préchargement des pages importantes
        const importantPages = ['apropos.html', 'contact.html', 'inscription.html'];
        importantPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    // Gestion du cache local
    setupCaching() {
        // Cache des données fréquemment utilisées
        this.cache = new Map();
        this.setupServiceWorker();
    }

    // Configuration du Service Worker pour le cache
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker enregistré avec succès:', registration);
                })
                .catch(error => {
                    console.log("Échec de l'enregistrement du Service Worker:", error);
                });
        }
    }

    // Surveillance des performances
    setupPerformanceMonitoring() {
        // Surveillance du Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                this.reportMetric('LCP', lastEntry.startTime);
            });
            lcpObserver.observe({entryTypes: ['largest-contentful-paint']});

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    const delay = entry.processingStart - entry.startTime;
                    console.log('FID:', delay);
                    this.reportMetric('FID', delay);
                });
            });
            fidObserver.observe({entryTypes: ['first-input']});

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            let clsEntries = [];

            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsEntries.push(entry);
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                        this.reportMetric('CLS', clsValue);
                    }
                }
            });
            clsObserver.observe({entryTypes: ['layout-shift']});
        }

        // Mesure du temps de chargement
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Temps de chargement total:', loadTime);
            this.reportMetric('LoadTime', loadTime);
        });
    }

    // Rapport des métriques de performance
    reportMetric(name, value) {
        // En production, envoyer ces données à votre service d'analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance', {
                'event_category': 'Web Vitals',
                'event_label': name,
                'value': Math.round(name === 'CLS' ? value * 1000 : value),
                'non_interaction': true
            });
        }
    }

    // Optimisation des ressources
    setupResourceOptimization() {
        // Compression des images
        this.optimizeImages();
        
        // Minification du CSS et JS en temps réel (pour le développement)
        if (process.env.NODE_ENV === 'development') {
            this.setupDevOptimizations();
        }
    }

    // Optimisation des images
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            // Ajouter des attributs de chargement paresseux
            img.loading = 'lazy';
            
            // Optimiser le format selon le support navigateur
            if (this.supportsWebP()) {
                const webpSrc = img.dataset.src.replace(/\.(jpg|jpeg|png)/, '.webp');
                img.dataset.src = webpSrc;
            }
        });
    }

    // Détection du support WebP
    supportsWebP() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }

    // Optimisations pour l'environnement de développement
    setupDevOptimizations() {
        // Désactivation des console.log en production
        if (process.env.NODE_ENV === 'production') {
            console.log = () => {};
        }

        // Monitoring de la mémoire
        this.setupMemoryMonitoring();
    }

    // Surveillance de l'utilisation mémoire
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log('Utilisation mémoire:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
                });
            }, 30000);
        }
    }

    // Nettoyage du cache périodique
    cleanupCache() {
        setInterval(() => {
            const now = Date.now();
            for (let [key, value] of this.cache.entries()) {
                if (now - value.timestamp > 3600000) { // 1 heure
                    this.cache.delete(key);
                }
            }
        }, 600000); // Toutes les 10 minutes
    }

    // Gestion des connexions lentes
    setupSlowConnectionHandling() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.saveData) {
                this.enableDataSaverMode();
            }
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.enableLowBandwidthMode();
            }
            
            connection.addEventListener('change', () => {
                if (connection.saveData || connection.effectiveType.includes('2g')) {
                    this.enableLowBandwidthMode();
                } else {
                    this.disableLowBandwidthMode();
                }
            });
        }
    }

    // Mode économiseur de données
    enableDataSaverMode() {
        // Désactiver les images non essentielles
        document.querySelectorAll('img[data-optional]').forEach(img => {
            img.style.display = 'none';
        });
        
        // Désactiver les vidéos auto
        document.querySelectorAll('video[autoplay]').forEach(video => {
            video.autoplay = false;
        });
    }

    // Mode bas débit
    enableLowBandwidthMode() {
        // Réduire la qualité des images
        document.querySelectorAll('img').forEach(img => {
            const src = img.src;
            if (src.includes('?quality=')) {
                img.src = src.replace(/\?quality=.*$/, '?quality=low');
            }
        });
        
        // Désactiver les animations complexes
        document.documentElement.style.setProperty('--transition-normal', '0.1s');
    }

    // Désactivation du mode bas débit
    disableLowBandwidthMode() {
        document.documentElement.style.setProperty('--transition-normal', '0.5s');
    }
}

// Initialisation de l'optimiseur de performance
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}