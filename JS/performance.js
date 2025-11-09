// performance.js - Optimisation des performances
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupPreload();
        this.monitorPerformance();
        this.setupCaching();
    }

    setupLazyLoading() {
        // Lazy loading des images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Lazy loading des iframes
        const iframes = document.querySelectorAll('iframe[data-src]');
        const iframeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            });
        });

        iframes.forEach(iframe => iframeObserver.observe(iframe));
    }

    optimizeImages() {
        // Conversion WebP progressive
        this.checkWebPSupport().then(supportsWebP => {
            if (supportsWebP) {
                this.convertImagesToWebP();
            }
        });

        // Optimisation des tailles d'images
        this.optimizeImageSizes();
    }

    checkWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    convertImagesToWebP() {
        const images = document.querySelectorAll('img[data-webp]');
        images.forEach(img => {
            const webpSrc = img.dataset.webp;
            if (webpSrc) {
                img.src = webpSrc;
            }
        });
    }

    optimizeImageSizes() {
        // Adaptation des images selon la taille d'écran
        const images = document.querySelectorAll('img[data-srcset]');
        images.forEach(img => {
            const srcset = img.dataset.srcset;
            if (srcset) {
                img.srcset = srcset;
                img.sizes = '(max-width: 768px) 100vw, 50vw';
            }
        });
    }

    setupPreload() {
        // Préchargement des ressources critiques
        const criticalResources = [
            '/css/style.css',
            '/css/animations.css',
            '/js/main.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });

        // Préconnexion aux domaines externes
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Surveillance des Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.observeLargestContentfulPaint();
            this.observeCumulativeLayoutShift();
            this.observeFirstInputDelay();
        }

        // Mesure du temps de chargement
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.logPerformance('Page Load Time', loadTime);
        });
    }

    observeLargestContentfulPaint() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.logPerformance('LCP', lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    observeCumulativeLayoutShift() {
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.logPerformance('CLS', clsValue);
        });
        observer.observe({ entryTypes: ['layout-shift'] });
    }

    observeFirstInputDelay() {
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const delay = entry.processingStart - entry.startTime;
                this.logPerformance('FID', delay);
            }
        });
        observer.observe({ entryTypes: ['first-input'] });
    }

    logPerformance(metric, value) {
        console.log(`${metric}: ${value}ms`);
        
        // Envoi aux analytics (à adapter selon votre solution)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance', {
                event_category: metric,
                event_label: value.toString(),
                value: Math.round(value)
            });
        }
    }

    setupCaching() {
        // Gestion du cache local pour les ressources statiques
        if ('caches' in window) {
            this.setupServiceWorker();
        }

        // Cache des données utilisateur fréquemment utilisées
        this.setupLocalStorageCache();
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    setupLocalStorageCache() {
        // Cache des données de configuration
        const cacheKey = 'app_config';
        const cacheTime = 24 * 60 * 60 * 1000; // 24 heures

        if (!this.isCacheValid(cacheKey, cacheTime)) {
            this.fetchConfigData().then(config => {
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: config,
                    timestamp: Date.now()
                }));
            });
        }
    }

    isCacheValid(key, maxAge) {
        const cached = localStorage.getItem(key);
        if (!cached) return false;

        const { timestamp } = JSON.parse(cached);
        return Date.now() - timestamp < maxAge;
    }

    fetchConfigData() {
        return fetch('/api/config')
            .then(response => response.json())
            .catch(error => {
                console.error('Failed to fetch config:', error);
                return {};
            });
    }

    // Optimisation de la mémoire
    cleanupUnusedResources() {
        // Nettoyage périodique des ressources inutilisées
        setInterval(() => {
            this.clearUnusedObservers();
            this.cleanupDOM();
        }, 30000); // Toutes les 30 secondes
    }

    clearUnusedObservers() {
        // Implémentation pour nettoyer les observers inutilisés
    }

    cleanupDOM() {
        // Nettoyage des éléments DOM temporaires
        const tempElements = document.querySelectorAll('.temp-element');
        tempElements.forEach(el => {
            if (!el.isConnected || el.offsetParent === null) {
                el.remove();
            }
        });
    }

    // Gestion des erreurs de ressources
    handleResourceErrors() {
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    handleImageError(img) {
        // Remplacement par une image de fallback
        img.src = '/assets/images/fallback.jpg';
        img.alt = 'Image non disponible';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
[file content end]

[file name]: seo-analytics.js
[file content begin]
// seo-analytics.js - Analytics et optimisation SEO
class SEOAnalytics {
    constructor() {
        this.trackingEnabled = true;
        this.init();
    }

    init() {
        this.setupGoogleAnalytics();
        this.setupGoogleSearchConsole();
        this.trackUserBehavior();
        this.optimizeSEO();
        this.setupStructuredData();
        this.monitorSEOmetrics();
    }

    setupGoogleAnalytics() {
        // Configuration Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        } else {
            // Fallback pour les utilisateurs sans GA
            this.setupFallbackAnalytics();
        }
    }

    setupFallbackAnalytics() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    }

    setupGoogleSearchConsole() {
        // Intégration Search Console
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = 'YOUR_VERIFICATION_CODE';
        document.head.appendChild(meta);
    }

    trackUserBehavior() {
        // Tracking des événements utilisateur
        this.trackClicks();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackFormInteractions();
        this.trackSocialShares();
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const link = target.closest('a');
            
            if (link) {
                this.trackEvent('Click', 'Link Click', link.href);
            }

            if (target.classList.contains('btn')) {
                this.trackEvent('Click', 'Button Click', target.textContent.trim());
            }
        });
    }

    trackScrollDepth() {
        let scrollDepth = 0;
        window.addEventListener('scroll', () => {
            const currentDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (currentDepth > scrollDepth) {
                scrollDepth = currentDepth;
                
                // Track à 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(scrollDepth)) {
                    this.trackEvent('Engagement', 'Scroll Depth', `${scrollDepth}%`);
                }
            }
        }, { passive: true });
    }

    trackTimeOnPage() {
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('Engagement', 'Time on Page', `${timeSpent}s`);
        });
    }

    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('Form', 'Submission', form.id || 'unknown');
            });

            // Track les champs modifiés
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.trackEvent('Form', 'Field Change', input.name);
                });
            });
        });
    }

    trackSocialShares() {
        const shareButtons = document.querySelectorAll('[data-share]');
        shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                const platform = button.dataset.share;
                this.trackEvent('Social', 'Share', platform);
            });
        });
    }

    trackEvent(category, action, label) {
        if (!this.trackingEnabled) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        // Log local pour le débogage
        console.log(`Event: ${category} - ${action} - ${label}`);
    }

    optimizeSEO() {
        this.optimizeMetaTags();
        this.generateSitemapLinks();
        this.setupCanonicalURLs();
        this.optimizeInternalLinking();
        this.implementBreadcrumbs();
    }

    optimizeMetaTags() {
        // Optimisation dynamique des meta tags
        const pageTitle = document.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        
        if (!metaDescription) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = this.generateDescription();
            document.head.appendChild(meta);
        }

        // Optimisation des titres H1
        this.optimizeHeadings();
    }

    generateDescription() {
        // Génération automatique de description
        const content = document.querySelector('main')?.textContent || '';
        return content.substring(0, 160).trim() + '...';
    }

    optimizeHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            // S'assurer de la hiérarchie correcte
            if (index > 0 && heading.tagName === 'H1') {
                console.warn('Multiple H1 tags detected:', heading);
            }
        });
    }

    generateSitemapLinks() {
        // Liens vers le sitemap
        const sitemapLink = document.createElement('link');
        sitemapLink.rel = 'sitemap';
        sitemapLink.type = 'application/xml';
        sitemapLink.title = 'Sitemap';
        sitemapLink.href = '/sitemap.xml';
        document.head.appendChild(sitemapLink);
    }

    setupCanonicalURLs() {
        // S'assurer qu'une URL canonique existe
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href.split('?')[0]; // Retirer les paramètres
            document.head.appendChild(canonical);
        }
    }

    optimizeInternalLinking() {
        // Optimisation des liens internes
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
        internalLinks.forEach(link => {
            // Ajouter des attributs title si manquants
            if (!link.title) {
                link.title = link.textContent.trim() || 'En savoir plus';
            }

            // Tracking des liens sortants internes
            link.addEventListener('click', () => {
                this.trackEvent('Navigation', 'Internal Link', link.href);
            });
        });
    }

    implementBreadcrumbs() {
        // Implémentation automatique des breadcrumbs
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;

        const path = window.location.pathname.split('/').filter(Boolean);
        let breadcrumbHTML = '<a href="/">Accueil</a>';

        path.forEach((segment, index) => {
            const isLast = index === path.length - 1;
            const url = '/' + path.slice(0, index + 1).join('/');
            const name = this.formatBreadcrumbName(segment);

            breadcrumbHTML += isLast 
                ? ` <span class="separator">/</span> <span>${name}</span>`
                : ` <span class="separator">/</span> <a href="${url}">${name}</a>`;
        });

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    formatBreadcrumbName(segment) {
        const names = {
            'apropos': 'Notre École',
            'pedagogie': 'Pédagogie',
            'activites': 'Activités',
            'resultats': 'Résultats',
            'contact': 'Contact',
            'inscription': 'Inscription'
        };
        return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    setupStructuredData() {
        // Données structurées Schema.org
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Les Bulles de Joie",
            "description": document.querySelector('meta[name="description"]')?.content,
            "url": window.location.origin,
            "telephone": "+229-01-58030302",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Zongo",
                "addressLocality": "Parakou",
                "addressCountry": "BJ"
            },
            "openingHours": "Mo-Fr 07:30-17:30"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    monitorSEOmetrics() {
        // Surveillance des métriques SEO importantes
        this.checkPageSpeed();
        this.checkMobileFriendliness();
        this.checkAccessibility();
    }

    checkPageSpeed() {
        // Utilisation de l'API Performance
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        if (navigationTiming) {
            const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
            this.trackEvent('Performance', 'Page Load Time', `${Math.round(loadTime)}ms`);
        }
    }

    checkMobileFriendliness() {
        // Vérifications basiques de mobile-friendliness
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            console.warn('Viewport meta tag missing');
        }

        // Vérifier la taille des textes
        const smallTexts = document.querySelectorAll('*');
        let smallTextCount = 0;
        smallTexts.forEach(el => {
            const fontSize = parseInt(window.getComputedStyle(el).fontSize);
            if (fontSize < 12) smallTextCount++;
        });

        if (smallTextCount > 10) {
            console.warn('Multiple small text elements detected - may affect mobile usability');
        }
    }

    checkAccessibility() {
        // Vérifications d'accessibilité basiques
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt && !img.getAttribute('aria-hidden')) {
                console.warn('Image missing alt text:', img);
            }
        });

        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
                console.warn('Interactive element missing accessible name:', el);
            }
        });
    }

    // Gestion du consentement RGPD
    setupGDPRConsent() {
        const consent = localStorage.getItem('analytics_consent');
        if (consent === 'false') {
            this.trackingEnabled = false;
        }

        // Afficher la bannière de consentement si nécessaire
        if (!consent) {
            this.showConsentBanner();
        }
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'gdpr-banner';
        banner.innerHTML = `
            <p>Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous l'utilisation de cookies analytics ?</p>
            <button class="btn-accept">Accepter</button>
            <button class="btn-deny">Refuser</button>
        `;
        document.body.appendChild(banner);

        banner.querySelector('.btn-accept').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'true');
            this.trackingEnabled = true;
            banner.remove();
        });

        banner.querySelector('.btn-deny').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'false');
            this.trackingEnabled = false;
            banner.remove();
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.seoAnalytics = new SEOAnalytics();
});

// Google Analytics (à remplacer par votre ID de mesure)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');