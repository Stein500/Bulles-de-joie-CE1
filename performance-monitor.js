class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.thresholds = {
            FCP: 1000,    // First Contentful Paint
            LCP: 2500,    // Largest Contentful Paint
            FID: 100,     // First Input Delay
            CLS: 0.1,     // Cumulative Layout Shift
            TTI: 3000,    // Time to Interactive
            TBT: 300      // Total Blocking Time
        };
        this.initialize();
    }

    initialize() {
        this.setupPerformanceObserver();
        this.monitorCoreWebVitals();
        this.trackResourceLoading();
        this.monitorUserInteractions();
        this.setupPerformanceBudget();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Observer pour les peintures
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric(entry.name, entry.startTime);
                    
                    if (entry.name === 'first-paint') {
                        this.metrics.FP = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.FCP = entry.startTime;
                    }
                }
            });
            paintObserver.observe({ entryTypes: ['paint'] });

            // Observer pour les ressources
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.analyzeResource(entry);
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });

            // Observer pour la navigation
            const navigationObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.analyzeNavigation(entry);
                }
            });
            navigationObserver.observe({ entryTypes: ['navigation'] });
        }
    }

    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.LCP = lastEntry.startTime;
            this.checkMetric('LCP', this.metrics.LCP);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.CLS = clsValue;
                    this.checkMetric('CLS', clsValue);
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const delay = entry.processingStart - entry.startTime;
                this.metrics.FID = delay;
                this.checkMetric('FID', delay);
            }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    }

    trackResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        resources.forEach(resource => {
            this.analyzeResource(resource);
        });

        // Surveillance en temps réel
        window.addEventListener('load', () => {
            const finalResources = performance.getEntriesByType('resource');
            this.analyzeResourceBundle(finalResources);
        });
    }

    analyzeResource(resource) {
        const data = {
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize || 0,
            type: this.getResourceType(resource)
        };

        if (resource.duration > 1000) {
            this.logPerformanceIssue('SLOW_RESOURCE', data);
        }

        if (!this.metrics.resources) {
            this.metrics.resources = [];
        }
        this.metrics.resources.push(data);
    }

    getResourceType(resource) {
        const url = resource.name;
        if (url.includes('.css')) return 'CSS';
        if (url.includes('.js')) return 'JavaScript';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)/)) return 'Image';
        if (url.includes('.woff') || url.includes('.ttf')) return 'Font';
        return 'Other';
    }

    analyzeResourceBundle(resources) {
        const bundleAnalysis = {
            totalSize: 0,
            byType: {},
            slowResources: []
        };

        resources.forEach(resource => {
            const type = this.getResourceType(resource);
            bundleAnalysis.totalSize += resource.transferSize || 0;

            if (!bundleAnalysis.byType[type]) {
                bundleAnalysis.byType[type] = {
                    count: 0,
                    totalSize: 0
                };
            }

            bundleAnalysis.byType[type].count++;
            bundleAnalysis.byType[type].totalSize += resource.transferSize || 0;

            if (resource.duration > 1000) {
                bundleAnalysis.slowResources.push({
                    name: resource.name,
                    duration: resource.duration,
                    size: resource.transferSize || 0
                });
            }
        });

        this.metrics.bundleAnalysis = bundleAnalysis;
        this.optimizeBasedOnAnalysis(bundleAnalysis);
    }

    optimizeBasedOnAnalysis(analysis) {
        // Suggestions d'optimisation automatiques
        const suggestions = [];

        if (analysis.byType.Image && analysis.byType.Image.totalSize > 500000) {
            suggestions.push({
                type: 'IMAGES',
                message: 'Optimiser les images: ' + (analysis.byType.Image.totalSize / 1000).toFixed(0) + 'KB',
                priority: 'high'
            });
        }

        if (analysis.byType.JavaScript && analysis.byType.JavaScript.totalSize > 300000) {
            suggestions.push({
                type: 'JAVASCRIPT',
                message: 'Réduire le bundle JS: ' + (analysis.byType.JavaScript.totalSize / 1000).toFixed(0) + 'KB',
                priority: 'medium'
            });
        }

        if (analysis.slowResources.length > 3) {
            suggestions.push({
                type: 'SLOW_RESOURCES',
                message: `${analysis.slowResources.length} ressources lentes détectées`,
                priority: 'high'
            });
        }

        this.metrics.optimizationSuggestions = suggestions;
        this.displayOptimizationSuggestions(suggestions);
    }

    monitorUserInteractions() {
        let interactionStart = 0;
        let blockingTime = 0;

        // Mesure du Time to Interactive (TTI)
        const checkTTI = () => {
            if (this.metrics.FCP && performance.now() - this.metrics.FCP > 5000) {
                this.metrics.TTI = performance.now();
                this.checkMetric('TTI', this.metrics.TTI);
            }
        };

        // Mesure du Total Blocking Time (TBT)
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'longtask') {
                    blockingTime += entry.duration - 50; // Tasks > 50ms are blocking
                }
            }
            this.metrics.TBT = blockingTime;
            this.checkMetric('TBT', blockingTime);
        });
        observer.observe({ entryTypes: ['longtask'] });

        // Surveillance des interactions utilisateur
        ['click', 'keydown', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                if (!interactionStart) {
                    interactionStart = performance.now();
                    setTimeout(checkTTI, 100);
                }
            }, { passive: true });
        });
    }

    setupPerformanceBudget() {
        this.budget = {
            pageSize: 1000, // KB
            requests: 20,
            lcp: 2500,
            cls: 0.1
        };

        window.addEventListener('load', () => {
            this.checkPerformanceBudget();
        });
    }

    checkPerformanceBudget() {
        const violations = [];

        if (this.metrics.bundleAnalysis) {
            const totalSizeKB = this.metrics.bundleAnalysis.totalSize / 1000;
            if (totalSizeKB > this.budget.pageSize) {
                violations.push(`Taille page: ${totalSizeKB.toFixed(0)}KB > ${this.budget.pageSize}KB`);
            }
        }

        if (this.metrics.LCP > this.budget.lcp) {
            violations.push(`LCP: ${this.metrics.LCP.toFixed(0)}ms > ${this.budget.lcp}ms`);
        }

        if (this.metrics.CLS > this.budget.cls) {
            violations.push(`CLS: ${this.metrics.CLS.toFixed(3)} > ${this.budget.cls}`);
        }

        if (violations.length > 0) {
            this.logPerformanceIssue('BUDGET_VIOLATION', { violations });
        }
    }

    checkMetric(metric, value) {
        const threshold = this.thresholds[metric];
        if (value > threshold) {
            this.logPerformanceIssue(metric, { value, threshold });
        }
    }

    logPerformanceIssue(type, data) {
        const issue = {
            type,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.warn('Performance Issue:', issue);

        // Envoi aux analytics
        if (window.analyticsManager) {
            window.analyticsManager.logEvent('performance_issue', issue);
        }

        // Stockage local pour le debug
        if (!this.metrics.issues) {
            this.metrics.issues = [];
        }
        this.metrics.issues.push(issue);
    }

    displayOptimizationSuggestions(suggestions) {
        if (suggestions.length === 0) return;

        // Affichage discret pour les développeurs
        if (localStorage.getItem('showPerformanceTips')) {
            const tipContainer = document.createElement('div');
            tipContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 1rem;
                border-radius: 10px;
                max-width: 300px;
                z-index: 10000;
                font-size: 0.9rem;
            `;

            tipContainer.innerHTML = `
                <strong>💡 Suggestions de performance:</strong>
                <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
                    ${suggestions.map(s => `<li>${s.message}</li>`).join('')}
                </ul>
                <button onclick="this.parentElement.remove()" style="background: white; color: #ff4444; border: none; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">Fermer</button>
            `;

            document.body.appendChild(tipContainer);
        }
    }

    getPerformanceScore() {
        let score = 100;

        // Pénalités basées sur les métriques Core Web Vitals
        if (this.metrics.LCP > 4000) score -= 30;
        else if (this.metrics.LCP > 2500) score -= 15;

        if (this.metrics.FID > 300) score -= 30;
        else if (this.metrics.FID > 100) score -= 15;

        if (this.metrics.CLS > 0.25) score -= 30;
        else if (this.metrics.CLS > 0.1) score -= 15;

        // Pénalités pour les ressources
        if (this.metrics.bundleAnalysis) {
            const totalSizeMB = this.metrics.bundleAnalysis.totalSize / 1000000;
            if (totalSizeMB > 3) score -= 10;
            else if (totalSizeMB > 1.5) score -= 5;
        }

        return Math.max(0, score);
    }

    generatePerformanceReport() {
        return {
            score: this.getPerformanceScore(),
            metrics: this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }

    // Méthodes d'optimisation automatique
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (this.isInViewport(img)) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    deferNonCriticalCSS() {
        const nonCriticalLinks = document.querySelectorAll('link[data-defer]');
        nonCriticalLinks.forEach(link => {
            link.setAttribute('media', 'print');
            link.onload = () => {
                link.setAttribute('media', 'all');
            };
        });
    }

    // Surveillance en temps réel
    startRealTimeMonitoring() {
        setInterval(() => {
            const memory = performance.memory;
            if (memory) {
                this.metrics.memory = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };
            }

            // Surveillance du framerate
            this.monitorFramerate();
        }, 5000);
    }

    monitorFramerate() {
        let frames = 0;
        let startTime = performance.now();
        
        const countFrame = () => {
            frames++;
            requestAnimationFrame(countFrame);
        };
        
        requestAnimationFrame(countFrame);
        
        setInterval(() => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const fps = Math.round((frames * 1000) / elapsed);
            
            this.metrics.FPS = fps;
            
            if (fps < 30) {
                this.logPerformanceIssue('LOW_FPS', { fps });
            }
            
            frames = 0;
            startTime = currentTime;
        }, 1000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Activation des optimisations automatiques
    if (window.performanceMonitor) {
        window.performanceMonitor.optimizeImages();
        window.performanceMonitor.deferNonCriticalCSS();
        window.performanceMonitor.startRealTimeMonitoring();
    }
});

// API globale pour accéder aux métriques
window.getPerformanceReport = () => {
    return window.performanceMonitor ? window.performanceMonitor.generatePerformanceReport() : null;
};

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}