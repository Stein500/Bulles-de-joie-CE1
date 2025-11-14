class Preloader {
    constructor() {
        this.init();
    }

    init() {
        this.setupPreloader();
        this.optimizeLoading();
    }

    setupPreloader() {
        const preloader = document.getElementById('preloader');
        
        if (preloader) {
            // Simuler un temps de chargement minimum pour une expérience fluide
            const minLoadTime = 1500;
            const startTime = Date.now();

            window.addEventListener('load', () => {
                const loadTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadTime - loadTime);

                setTimeout(() => {
                    this.hidePreloader(preloader);
                }, remainingTime);
            });

            // Fallback au cas où l'événement load ne se déclenche pas
            setTimeout(() => {
                this.hidePreloader(preloader);
            }, minLoadTime + 1000);
        }
    }

    hidePreloader(preloader) {
        preloader.classList.add('fade-out');
        
        setTimeout(() => {
            preloader.style.display = 'none';
            this.triggerWelcomeAnimation();
        }, 500);
    }

    triggerWelcomeAnimation() {
        // Déclencher les animations de bienvenue
        if (window.homeAnimations) {
            window.homeAnimations.setupWelcomeSequence();
        }
        
        // Afficher une notification de bienvenue
        if (window.schoolWebsite) {
            setTimeout(() => {
                window.schoolWebsite.showWelcomeMessage();
            }, 1000);
        }
    }

    optimizeLoading() {
        // Préchargement des images critiques
        this.preloadCriticalImages();
        
        // Initialisation différée des composants non critiques
        this.lazyLoadNonCriticalAssets();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'assets/images/logo.png',
            'assets/images/hero-background.jpg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    lazyLoadNonCriticalAssets() {
        // Charger les scripts non critiques après le chargement initial
        const nonCriticalScripts = [
            'js/particles.js',
            'js/analytics.js'
        ];

        window.addEventListener('load', () => {
            nonCriticalScripts.forEach(script => {
                const scriptEl = document.createElement('script');
                scriptEl.src = script;
                scriptEl.async = true;
                document.body.appendChild(scriptEl);
            });
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.preloader = new Preloader();
});