// ANALYTICS ET TRACKING SEO OPTIMISÉ

class SEOTracker {
    constructor() {
        this.init();
    }

    init() {
        this.trackPageViews();
        this.trackUserEngagement();
        this.trackCTAClicks();
        this.trackFormSubmissions();
        this.measureCoreWebVitals();
    }

    // Tracking des pages vues
    trackPageViews() {
        const pageData = {
            page_title: document.title,
            page_url: window.location.href,
            page_referrer: document.referrer,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        };

        this.sendToAnalytics('page_view', pageData);
    }

    // Tracking de l'engagement utilisateur
    trackUserEngagement() {
        let timeOnPage = 0;
        const startTime = Date.now();

        // Temps sur la page
        window.addEventListener('beforeunload', () => {
            timeOnPage = Date.now() - startTime;
            this.sendToAnalytics('time_on_page', {
                duration: timeOnPage,
                page_url: window.location.href
            });
        });

        // Scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
            maxScroll = Math.max(maxScroll, scrollDepth);
        });

        window.addEventListener('beforeunload', () => {
            this.sendToAnalytics('scroll_depth', {
                depth: maxScroll,
                page_url: window.location.href
            });
        });
    }

    // Tracking des clicks CTA
    trackCTAClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;

            const ctaData = {
                text: target.textContent.trim(),
                href: target.href || '',
                type: target.tagName.toLowerCase(),
                position: this.getElementPosition(target),
                page_url: window.location.href
            };

            this.sendToAnalytics('cta_click', ctaData);
        });
    }

    // Tracking des formulaires
    trackFormSubmissions() {
        document.addEventListener('submit', (e) => {
            const formData = {
                form_id: e.target.id || 'unknown',
                form_action: e.target.action,
                fields_count: e.target.elements.length,
                page_url: window.location.href
            };

            this.sendToAnalytics('form_submit', formData);
        });
    }

    // Mesure des Core Web Vitals
    measureCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.sendToAnalytics('lcp_metric', {
                value: lastEntry.startTime,
                url: window.location.href
            });
        }).observe({type: 'largest-contentful-paint', buffered: true});

        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.sendToAnalytics('fid_metric', {
                    value: entry.processingStart - entry.startTime,
                    url: window.location.href
                });
            });
        }).observe({type: 'first-input', buffered: true});

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            
            this.sendToAnalytics('cls_metric', {
                value: clsValue,
                url: window.location.href
            });
        }).observe({type: 'layout-shift', buffered: true});
    }

    // Position de l'élément dans la page
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.top < 0) return 'above';
        if (rect.top > viewportHeight) return 'below';
        return 'visible';
    }

    // Envoi des données analytics
    sendToAnalytics(event, data) {
        // Simulation d'envoi à Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }

        // Envoi à votre endpoint personnalisé
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: event,
                data: data,
                timestamp: new Date().toISOString()
            })
        }).catch(() => {
            // Silently fail if analytics endpoint is not available
        });

        console.log('SEO Analytics:', event, data);
    }
}

// Initialisation du tracker
document.addEventListener('DOMContentLoaded', () => {
    new SEOTracker();
});

// Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID'); // Remplacez par votre ID

// Structured Data Helper
class StructuredDataHelper {
    static addFAQSchema(questions) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": questions.map(q => ({
                "@type": "Question",
                "name": q.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.answer
                }
            }))
        };

        this.addSchema(faqSchema);
    }

    static addLocalBusinessSchema(businessInfo) {
        const businessSchema = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            ...businessInfo
        };

        this.addSchema(businessSchema);
    }

    static addSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
}

// Exemple d'utilisation
StructuredDataHelper.addFAQSchema([
    {
        question: "Quels sont les horaires d'ouverture de l'école ?",
        answer: "L'école est ouverte du lundi au vendredi de 7h30 à 17h30."
    },
    {
        question: "Proposez-vous un service de garderie ?",
        answer: "Oui, nous proposons un service de garderie inclus dans nos horaires."
    }
]);