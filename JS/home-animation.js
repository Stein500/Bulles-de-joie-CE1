// home-animation.js - Animations spécifiques à la page d'accueil

class HomeAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntroAnimation();
        this.setupParallaxEffect();
        this.setupFloatingElements();
        this.setupScrollAnimations();
        this.setupInteractiveAnimations();
    }

    // Animation d'introduction immersive
    setupIntroAnimation() {
        const introOverlay = document.getElementById('intro-overlay');
        
        if (!introOverlay) return;

        // Animation automatique de disparition
        const introTimer = setTimeout(() => {
            this.hideIntroAnimation();
        }, 3000);

        // Permettre de sauter l'intro
        introOverlay.addEventListener('click', () => {
            clearTimeout(introTimer);
            this.hideIntroAnimation();
        });

        // Animation des bulles
        this.animateBubbles();
    }

    // Cacher l'animation d'introduction
    hideIntroAnimation() {
        const introOverlay = document.getElementById('intro-overlay');
        if (introOverlay) {
            introOverlay.style.opacity = '0';
            introOverlay.style.visibility = 'hidden';
            
            // Libérer la mémoire après l'animation
            setTimeout(() => {
                introOverlay.remove();
            }, 1000);
        }
    }

    // Animation des bulles flottantes
    animateBubbles() {
        const bubbles = document.querySelectorAll('.bubble');
        
        bubbles.forEach((bubble, index) => {
            // Animation aléatoire pour chaque bulle
            const duration = 15 + Math.random() * 10;
            const delay = Math.random() * 5;
            
            bubble.style.animation = `floatBubble ${duration}s ease-in-out ${delay}s infinite`;
        });
    }

    // Effet parallaxe sur la hero section
    setupParallaxEffect() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // Animation des éléments flottants
    setupFloatingElements() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach((card, index) => {
            // Animation personnalisée pour chaque carte
            const duration = 6 + index;
            const delay = index * 2;
            
            card.style.animation = `floatCard ${duration}s ease-in-out ${delay}s infinite`;
        });
    }

    // Animations au défilement
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.immersion-card, .cycle-item, .value-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Animation d'un élément spécifique
    animateElement(element) {
        element.classList.add('animate-in');
        
        // Animation supplémentaire pour les cartes d'immersion
        if (element.classList.contains('immersion-card')) {
            this.animateImmersionCard(element);
        }
    }

    // Animation spécifique pour les cartes d'immersion
    animateImmersionCard(card) {
        const icon = card.querySelector('.card-icon');
        if (icon) {
            icon.style.animation = 'bounce 0.6s ease';
            
            // Réinitialiser l'animation pour pouvoir la rejouer
            setTimeout(() => {
                icon.style.animation = '';
            }, 600);
        }
    }

    // Animations interactives
    setupInteractiveAnimations() {
        // Effet de survol sur les cartes d'immersion
        const immersionCards = document.querySelectorAll('.immersion-card');
        
        immersionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });

        // Animation des statistiques
        this.animateStats();

        // Effet ripple pour les boutons
        this.setupRippleEffect();
    }

    // Animation de survol des cartes
    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Animation de l'icône
            const icon = card.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            
            const icon = card.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        }
    }

    // Animation des compteurs de statistiques
    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    // Animation d'un compteur
    animateCounter(element) {
        const target = parseInt(element.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 2000; // 2 secondes
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
            }
        }, stepTime);
    }

    // Effet ripple pour les boutons
    setupRippleEffect() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.btn');
            if (target) {
                this.createRipple(e, target);
            }
        }.bind(this));
    }

    // Créer l'effet ripple
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Animation de la flèche de défilement
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            let isScrolling = false;
            
            window.addEventListener('scroll', () => {
                if (!isScrolling) {
                    isScrolling = true;
                    
                    // Cacher l'indicateur après un certain défilement
                    if (window.scrollY > 100) {
                        scrollIndicator.style.opacity = '0';
                    } else {
                        scrollIndicator.style.opacity = '1';
                    }
                    
                    setTimeout(() => {
                        isScrolling = false;
                    }, 100);
                }
            });
        }
    }

    // Gestion des animations en fonction des préférences utilisateur
    setupMotionPreferences() {
        // Respecter les préférences de réduction de mouvement
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-normal', '0.1s');
            document.documentElement.style.setProperty('--transition-slow', '0.2s');
        }
    }
}

// Initialisation du gestionnaire d'animations
document.addEventListener('DOMContentLoaded', () => {
    window.homeAnimationManager = new HomeAnimationManager();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeAnimationManager;
}