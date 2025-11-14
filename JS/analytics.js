class AnalyticsManager {
    constructor() {
        this.trackingEnabled = this.getConsent();
        this.init();
    }

    init() {
        this.setupGoogleAnalytics();
        this.trackUserBehavior();
        this.setupPerformanceMonitoring();
    }

    setupGoogleAnalytics() {
        // Configuration Google Analytics 4
        if (typeof gtag !== 'undefined' && this.trackingEnabled) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                school_name: 'Les Bulles de Joie',
                school_type: 'bilingual'
            });
        }
    }

    trackUserBehavior() {
        if (!this.trackingEnabled) return;

        // Tracking des pages vues
        this.trackPageView();

        // Tracking des clics
        this.trackClicks();

        // Tracking des formulaires
        this.trackForms();

        // Tracking du scroll
        this.trackScrollDepth();
    }

    trackPageView() {
        this.logEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Tracking des liens
            if (target.tagName === 'A') {
                this.logEvent('link_click', {
                    link_url: target.href,
                    link_text: target.textContent
                });
            }

            // Tracking des boutons
            if (target.classList.contains('btn')) {
                this.logEvent('button_click', {
                    button_text: target.textContent,
                    button_type: this.getButtonType(target)
                });
            }
        });
    }

    trackForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', () => {
                this.logEvent('form_submit', {
                    form_id: form.id,
                    form_name: form.getAttribute('name')
                });
            });
        });
    }

    trackScrollDepth() {
        let scrollDepth = 0;
        const thresholds = [25, 50, 75, 100];

        window.addEventListener('scroll', () => {
            const currentDepth = this.getScrollDepth();
            
            thresholds.forEach(threshold => {
                if (currentDepth >= threshold && scrollDepth < threshold) {
                    this.logEvent('scroll_depth', {
                        scroll_percentage: threshold
                    });
                    scrollDepth = threshold;
                }
            });
        }, { passive: true });
    }

    getScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }

    getButtonType(button) {
        if (button.classList.contains('btn-primary')) return 'primary';
        if (button.classList.contains('btn-secondary')) return 'secondary';
        if (button.classList.contains('btn-outline')) return 'outline';
        return 'default';
    }

    setupPerformanceMonitoring() {
        // Surveillance des Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
    }

    monitorLCP() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.logEvent('performance', {
                metric: 'LCP',
                value: Math.round(lastEntry.startTime),
                rating: this.getPerformanceRating(lastEntry.startTime, 'LCP')
            });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    monitorFID() {
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const delay = entry.processingStart - entry.startTime;
                
                this.logEvent('performance', {
                    metric: 'FID',
                    value: Math.round(delay),
                    rating: this.getPerformanceRating(delay, 'FID')
                });
            }
        });

        observer.observe({ entryTypes: ['first-input'] });
    }

    monitorCLS() {
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            
            this.logEvent('performance', {
                metric: 'CLS',
                value: clsValue.toFixed(4),
                rating: this.getPerformanceRating(clsValue, 'CLS')
            });
        });

        observer.observe({ entryTypes: ['layout-shift'] });
    }

    getPerformanceRating(value, metric) {
        const thresholds = {
            'LCP': { good: 2500, poor: 4000 },
            'FID': { good: 100, poor: 300 },
            'CLS': { good: 0.1, poor: 0.25 }
        };

        const threshold = thresholds[metric];
        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    logEvent(eventName, parameters) {
        if (!this.trackingEnabled) return;

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Console de développement
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', eventName, parameters);
        }
    }

    getConsent() {
        return localStorage.getItem('analytics_consent') === 'true';
    }

    setConsent(consent) {
        localStorage.setItem('analytics_consent', consent);
        this.trackingEnabled = consent;
        
        if (consent) {
            this.setupGoogleAnalytics();
        }
    }

    // Méthodes pour les analyses spécifiques à l'école
    trackInscriptionStart() {
        this.logEvent('inscription_start', {
            timestamp: new Date().toISOString()
        });
    }

    trackInscriptionComplete() {
        this.logEvent('inscription_complete', {
            timestamp: new Date().toISOString()
        });
    }

    trackContactRequest() {
        this.logEvent('contact_request', {
            timestamp: new Date().toISOString()
        });
    }

    trackResultsAccess() {
        this.logEvent('results_access', {
            timestamp: new Date().toISOString()
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});

// Google Analytics (à remplacer par votre ID de mesure)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');