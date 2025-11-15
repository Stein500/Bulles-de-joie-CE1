class HomeAnimationOrchestrator {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupScrollAnimations();
        this.setupInteractiveElements();
        this.setupPerformanceObserver();
        this.initializeCounters();
        this.setupParallaxEffect();
    }

    setupScrollAnimations() {
        // Intersection Observer pour les animations au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.cycle-card, .stat-item, .feature-highlight').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateOnScroll(element) {
        if (element.classList.contains('cycle-card')) {
            this.animateCycleCard(element);
        } else if (element.classList.contains('stat-item')) {
            this.animateCounter(element);
        } else if (element.classList.contains('feature-highlight')) {
            this.animateFeature(element);
        }
    }

    animateCycleCard(card) {
        card.style.transform = 'translateY(50px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, 100);
    }

    initializeCounters() {
        this.counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-item').forEach(stat => {
            this.counterObserver.observe(stat);
        });
    }

    animateCounter(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            numberElement.textContent = Math.floor(current);
        }, 16);
    }

    setupInteractiveElements() {
        // Cercles d'activités interactifs
        const circleItems = document.querySelectorAll('.circle-item');
        circleItems.forEach(circle => {
            circle.addEventListener('mouseenter', () => this.activateCircle(circle));
            circle.addEventListener('mouseleave', () => this.deactivateCircle(circle));
            circle.addEventListener('click', () => this.navigateToActivity(circle));
        });

        // Effets de hover avancés
        this.setupHoverEffects();
    }

    activateCircle(circle) {
        const activity = circle.getAttribute('data-activity');
        const icon = circle.querySelector('.circle-icon');
        
        // Animation de l'icône
        icon.style.transform = 'scale(1.3) rotate(10deg)';
        icon.style.transition = 'transform 0.3s ease';
        
        // Effet de halo
        circle.style.boxShadow = `
            0 0 30px rgba(255, 0, 255, 0.4),
            0 0 60px rgba(233, 255, 112, 0.2)
        `;
        
        // Son d'interaction subtil
        this.playInteractionSound();
    }

    deactivateCircle(circle) {
        const icon = circle.querySelector('.circle-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
        circle.style.boxShadow = 'var(--shadow-medium)';
    }

    navigateToActivity(circle) {
        const activity = circle.getAttribute('data-activity');
        // Navigation vers la page activités avec filtre
        window.location.href = `activites.html?filter=${activity}`;
    }

    playInteractionSound() {
        // Son d'interaction subtil (optionnel)
        if (typeof window.AudioContext !== 'undefined') {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.value = 523.25; // Do
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
            
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.3);
        }
    }

    setupHoverEffects() {
        // Effets de hover avancés pour les boutons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupParallaxEffect() {
        // Effet parallax subtil pour l'héro section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-section');
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
            
            // Header qui disparaît au scroll
            const header = document.querySelector('.main-header');
            if (scrolled > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        });
    }

    setupPerformanceObserver() {
        // Surveillance des performances
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.duration}ms`);
                }
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
        }
    }

    // Gestion des erreurs
    handleError(error) {
        console.error('Animation Error:', error);
        // Fallback graceful
        document.querySelectorAll('.circle-item').forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'none';
        });
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.homeAnimator = new HomeAnimationOrchestrator();
        
        // Ajout des styles ripple
        const rippleStyles = document.createElement('style');
        rippleStyles.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyles);
        
    } catch (error) {
        console.error('Failed to initialize home animations:', error);
    }
});

// Gestion de la visibilité de la page
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause des animations lourdes
        document.body.style.animationPlayState = 'paused';
    } else {
        // Reprise des animations
        document.body.style.animationPlayState = 'running';
    }
});

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeAnimationOrchestrator;
}