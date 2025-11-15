// self-analytics.js - Système d'analyse personnalisé

class SelfAnalytics {
    constructor() {
        this.apiEndpoint = '/api/analytics';
        this.isProduction = window.location.hostname !== 'localhost';
        this.consentGiven = this.getConsent();
        this.init();
    }

    init() {
        if (this.consentGiven) {
            this.setupTracking();
            this.setupPerformanceMonitoring();
            this.setupUserBehaviorTracking();
            this.setupErrorTracking();
        }
        
        this.setupConsentManager();
    }

    // Gestion du consentement
    setupConsentManager() {
        if (!this.getConsent() && this.isProduction) {
            this.showConsentBanner();
        }
    }

    // Afficher la bannière de consentement
    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <p>Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic.</p>
                <div class="consent-buttons">
                    <button class="btn-consent accept">Accepter</button>
                    <button class="btn-consent reject">Refuser</button>
                    <a href="/privacy.html" class="privacy-link">Politique de confidentialité</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);

        // Styles pour la bannière
        const styles = `
            .consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--white);
                padding: 1.5rem;
                box-shadow: 0 -2px 20px rgba(0,0,0,0.1);
                z-index: 10000;
                border-top: 3px solid var(--fuchsia);
            }
            .consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
            }
            .consent-content p {
                margin: 0;
                flex: 1;
            }
            .consent-buttons {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            .btn-consent {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition-fast);
            }
            .btn-consent.accept {
                background: var(--gradient-primary);
                color: var(--white);
            }
            .btn-consent.reject {
                background: transparent;
                color: var(--gray);
                border: 1px solid var(--gray);
            }
            .privacy-link {
                color: var(--fuchsia);
                text-decoration: none;
            }
            @media (max-width: 768px) {
                .consent-content {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Gestion des clics
        banner.querySelector('.accept').addEventListener('click', () => {
            this.setConsent(true);
            banner.remove();
            this.setupTracking();
        });

        banner.querySelector('.reject').addEventListener('click', () => {
            this.setConsent(false);
            banner.remove();
        });
    }

    // Obtenir le consentement
    getConsent() {
        return localStorage.getItem('analytics-consent') === 'true';
    }

    // Définir le consentement
    setConsent(given) {
        localStorage.setItem('analytics-consent', given.toString());
        this.consentGiven = given;
    }

    // Configuration du tracking
    setupTracking() {
        this.trackPageView();
        this.trackUserEngagement();
        this.trackClicks();
        this.trackScrollDepth();
    }

    // Suivi des vues de page
    trackPageView() {
        const pageData = {
            url: window.location.href,
            referrer: document.referrer,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };

        this.sendEvent('page_view', pageData);
    }

    // Suivi de l'engagement utilisateur
    trackUserEngagement() {
        let engagementStart = Date.now();
        let isEngaged = true;

        // Pause d'engagement quand la page n'est pas visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isEngaged = false;
                this.trackEngagementTime(engagementStart);
            } else {
                isEngaged = true;
                engagementStart = Date.now();
            }
        });

        // Arrêt de l'engagement quand l'utilisateur quitte
        window.addEventListener('beforeunload', () => {
            if (isEngaged) {
                this.trackEngagementTime(engagementStart);
            }
        });
    }

    // Tracker le temps d'engagement
    trackEngagementTime(startTime) {
        const engagementTime = Date.now() - startTime;
        this.sendEvent('user_engagement', {
            engagement_time: engagementTime,
            page: window.location.href
        });
    }

    // Suivi des clics
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, [role="button"]');
            if (target) {
                const clickData = {
                    element: target.tagName,
                    text: target.textContent?.trim().substring(0, 100),
                    href: target.href || '',
                    class: target.className,
                    id: target.id,
                    page: window.location.href
                };

                this.sendEvent('click', clickData);
            }
        });
    }

    // Suivi de la profondeur de défilement
    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollDepth > maxScroll) {
                maxScroll = scrollDepth;
                
                // Envoyer des événements à des seuils spécifiques
                const thresholds = [25, 50, 75, 90, 100];
                thresholds.forEach(threshold => {
                    if (scrollDepth >= threshold && maxScroll < threshold + 10) {
                        this.sendEvent('scroll_depth', {
                            depth: threshold,
                            page: window.location.href
                        });
                    }
                });
            }
        }, { passive: true });
    }

    // Surveillance des performances
    setupPerformanceMonitoring() {
        // Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
        
        // Métriques de performance traditionnelles
        this.monitorLoadTimes();
    }

    // Largest Contentful Paint
    monitorLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.sendEvent('web_vital', {
                name: 'LCP',
                value: lastEntry.startTime,
                rating: this.getRating('LCP', lastEntry.startTime)
            });
        }).observe({entryTypes: ['largest-contentful-paint']});
    }

    // First Input Delay
    monitorFID() {
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const delay = entry.processingStart - entry.startTime;
                this.sendEvent('web_vital', {
                    name: 'FID',
                    value: delay,
                    rating: this.getRating('FID', delay)
                });
            }
        }).observe({entryTypes: ['first-input']});
    }

    // Cumulative Layout Shift
    monitorCLS() {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.sendEvent('web_vital', {
                name: 'CLS',
                value: clsValue,
                rating: this.getRating('CLS', clsValue)
            });
        }).observe({entryTypes: ['layout-shift']});
    }

    // Temps de chargement
    monitorLoadTimes() {
        window.addEventListener('load', () => {
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
            
            this.sendEvent('performance', {
                metric: 'load_time',
                value: loadTime,
                rating: this.getRating('load_time', loadTime)
            });
        });
    }

    // Évaluation des métriques
    getRating(metric, value) {
        const thresholds = {
            'LCP': { good: 2500, poor: 4000 },
            'FID': { good: 100, poor: 300 },
            'CLS': { good: 0.1, poor: 0.25 },
            'load_time': { good: 3000, poor: 5000 }
        };
        
        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';
        
        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs_improvement';
        return 'poor';
    }

    // Suivi du comportement utilisateur
    setupUserBehaviorTracking() {
        this.trackFormInteractions();
        this.trackVideoEngagement();
        this.trackSearchBehavior();
    }

    // Interactions avec les formulaires
    trackFormInteractions() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.sendEvent('form_submit', {
                    form_id: form.id || 'unknown',
                    form_class: form.className,
                    page: window.location.href
                });
            }
        });

        // Suivi des abandons de formulaire
        let formData = new Map();
        
        document.addEventListener('input', (e) => {
            if (e.target.form) {
                const formId = e.target.form.id || 'unknown';
                if (!formData.has(formId)) {
                    formData.set(formId, new Set());
                }
                formData.get(formId).add(e.target.name || e.target.id);
            }
        });

        window.addEventListener('beforeunload', () => {
            formData.forEach((fields, formId) => {
                if (fields.size > 0) {
                    this.sendEvent('form_abandonment', {
                        form_id: formId,
                        fields_filled: Array.from(fields),
                        page: window.location.href
                    });
                }
            });
        });
    }

    // Engagement vidéo
    trackVideoEngagement() {
        document.querySelectorAll('video').forEach(video => {
            let playStartTime;
            let hasSentComplete = false;

            video.addEventListener('play', () => {
                playStartTime = Date.now();
                this.sendEvent('video_play', {
                    video_src: video.src,
                    duration: video.duration,
                    page: window.location.href
                });
            });

            video.addEventListener('timeupdate', () => {
                if (!hasSentComplete && video.currentTime / video.duration > 0.9) {
                    hasSentComplete = true;
                    this.sendEvent('video_complete', {
                        video_src: video.src,
                        watch_time: Date.now() - playStartTime,
                        page: window.location.href
                    });
                }
            });
        });
    }

    // Comportement de recherche
    trackSearchBehavior() {
        const searchInputs = document.querySelectorAll('input[type="search"], [role="search"] input');
        
        searchInputs.forEach(input => {
            let searchTerm = '';
            
            input.addEventListener('input', (e) => {
                searchTerm = e.target.value;
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                    this.sendEvent('search', {
                        term: searchTerm,
                        page: window.location.href
                    });
                }
            });
        });
    }

    // Suivi des erreurs
    setupErrorTracking() {
        // Erreurs JavaScript
        window.addEventListener('error', (e) => {
            this.sendEvent('error', {
                type: 'javascript',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                page: window.location.href
            });
        });

        // Erreurs de ressource
        window.addEventListener('error', (e) => {
            if (e.target && e.target.src) {
                this.sendEvent('error', {
                    type: 'resource',
                    resource: e.target.src,
                    tag: e.target.tagName,
                    page: window.location.href
                });
            }
        }, true);

        // Promises rejetées
        window.addEventListener('unhandledrejection', (e) => {
            this.sendEvent('error', {
                type: 'promise',
                reason: e.reason?.toString(),
                page: window.location.href
            });
        });
    }

    // Envoi d'événements
    sendEvent(eventName, eventData) {
        if (!this.consentGiven || !this.isProduction) {
            console.log('Analytics Event:', eventName, eventData);
            return;
        }

        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            user_id: this.getUserId(),
            page: window.location.href
        };

        // Envoyer l'événement
        this.sendToBackend(event);
        
        // Stocker en local en cas de perte de connexion
        this.queueEvent(event);
    }

    // Envoyer au backend
    sendToBackend(event) {
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
            navigator.sendBeacon(this.apiEndpoint, blob);
        } else {
            fetch(this.apiEndpoint, {
                method: 'POST',
                body: JSON.stringify(event),
                headers: { 'Content-Type': 'application/json' },
                keepalive: true
            }).catch(error => {
                console.warn('Failed to send analytics event:', error);
            });
        }
    }

    // File d'attente des événements
    queueEvent(event) {
        let queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
        queue.push(event);
        
        // Garder seulement les 100 derniers événements
        if (queue.length > 100) {
            queue = queue.slice(-100);
        }
        
        localStorage.setItem('analytics_queue', JSON.stringify(queue));
    }

    // Récupération de la file d'attente
    flushQueue() {
        const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
        if (queue.length > 0) {
            queue.forEach(event => this.sendToBackend(event));
            localStorage.removeItem('analytics_queue');
        }
    }

    // ID de session
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    // ID utilisateur
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = this.generateId();
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    // Génération d'ID unique
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    }
}

// Initialisation de l'analytics
document.addEventListener('DOMContentLoaded', () => {
    window.selfAnalytics = new SelfAnalytics();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SelfAnalytics;
}