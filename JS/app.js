// app.js - Application principale avec nouvelles fonctionnalités
class BullesDeJoieApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntroAnimation();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupInteractiveElements();
        this.setupPerformance();
    }

    // Gestion de l'animation d'introduction
    setupIntroAnimation() {
        const introOverlay = document.getElementById('intro-overlay');
        
        // Animation automatique de disparition après 3 secondes
        setTimeout(() => {
            if (introOverlay) {
                introOverlay.style.display = 'none';
            }
        }, 3000);

        // Permettre de sauter l'intro en cliquant
        if (introOverlay) {
            introOverlay.addEventListener('click', () => {
                introOverlay.style.display = 'none';
            });
        }
    }

    // Navigation responsive et smooth scroll
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Fermer le menu mobile au clic sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Gestion du header au scroll
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.main-header');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }

            // Cacher/montrer le header au scroll
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = window.scrollY;
        });
    }

    // Effets de défilement et parallaxe
    setupScrollEffects() {
        // Effet parallaxe sur la hero section
        const heroBackground = document.querySelector('.hero-background');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });

        // Animation des éléments au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.immersion-card, .cycle-item, .value-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Animations interactives
    setupAnimations() {
        // Animation des cartes d'immersion
        const immersionCards = document.querySelectorAll('.immersion-card');
        
        immersionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Animation des statistiques
        this.animateStats();
    }

    // Animation des compteurs de statistiques
    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const target = parseInt(stat.textContent);
                    let current = 0;
                    const increment = target / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '+');
                        }
                    }, 30);
                    
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    // Éléments interactifs
    setupInteractiveElements() {
        // Boutons avec effet ripple
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Système de notifications
        this.setupNotifications();
    }

    // Système de notifications
    setupNotifications() {
        window.showNotification = (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animation d'entrée
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Supprimer après 4 secondes
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        };
    }

    getNotificationIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Optimisations de performance
    setupPerformance() {
        // Lazy loading des images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Préchargement des pages importantes
        this.preloadPages();
    }

    // Préchargement des pages pour une navigation plus rapide
    preloadPages() {
        const importantPages = ['apropos.html', 'pedagogie.html', 'activites.html'];
        
        importantPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BullesDeJoieApp();
    
    // Message de bienvenue
    setTimeout(() => {
        if (window.showNotification) {
            window.showNotification('Bienvenue aux Bulles de Joie! 🎓 Votre école bilingue d\'excellence', 'success');
        }
    }, 3500);
});

// Gestion des erreurs
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BullesDeJoieApp;
}