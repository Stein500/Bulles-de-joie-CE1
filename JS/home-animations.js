/ home-animations.js - Animations spécifiques à la page d'accueil
class HomeAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticleSystem();
        this.setupInteractiveElements();
        this.setupScrollAnimations();
        this.setupWelcomeSequence();
    }

    setupParticleSystem() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        // Créer des particules animées
        this.createParticles(container, 50);
    }

    createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Propriétés aléatoires
            const size = Math.random() * 6 + 2;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${this.getRandomColor()};
                left: ${Math.random() * 100}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            
            container.appendChild(particle);
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(251, 113, 133, 0.6)',
            'rgba(59, 130, 246, 0.6)',
            'rgba(254, 202, 202, 0.6)',
            'rgba(225, 29, 72, 0.6)',
            'rgba(30, 64, 175, 0.6)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupInteractiveElements() {
        // Animation des bulles interactives
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.addEventListener('mouseenter', () => {
                this.animateBubble(bubble);
            });
        });

        // Effet de vague sur les cartes
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.createRippleEffect(card, e);
            });
        });
    }

    animateBubble(bubble) {
        bubble.style.transform = 'scale(1.2) translateY(-10px)';
        setTimeout(() => {
            bubble.style.transform = 'scale(1.1) translateY(-5px)';
        }, 150);
    }

    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(251,113,133,0.2) 0%, transparent 70%);
            border-radius: 50%;
            top: ${y - 50}px;
            left: ${x - 50}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out forwards;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    setupScrollAnimations() {
        // Animation au défilement pour les éléments
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.feature-card, .stat-item, .testimonial').forEach(el => {
            observer.observe(el);
        });
    }

    animateOnScroll(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        if (element.classList.contains('stat-item')) {
            this.animateCounter(element);
        }
    }

    animateCounter(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        if (!numberElement) return;

        const target = parseInt(numberElement.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(current);
        }, 16);
    }

    setupWelcomeSequence() {
        // Séquence d'animation de bienvenue
        setTimeout(() => {
            this.animateWelcomeText();
        }, 500);

        // Animation des stickers
        setTimeout(() => {
            this.animateStickers();
        }, 1000);
    }

    animateWelcomeText() {
        const letters = document.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animation = 'bounceIn 0.6s ease both';
            }, index * 100);
        });
    }

    animateStickers() {
        const stickers = document.querySelectorAll('.sticker');
        stickers.forEach((sticker, index) => {
            setTimeout(() => {
                sticker.style.animation = 'floatSticker 20s infinite ease-in-out';
            }, index * 200);
        });
    }

    // Effets spéciaux pour les événements
    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${this.getRandomColor()};
                animation-delay: ${Math.random() * 3}s;
            `;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => confettiContainer.remove(), 3000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.homeAnimations = new HomeAnimations();
});

// CSS dynamique pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        animation: floatParticle linear infinite;
        pointer-events: none;
    }
    
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .confetti-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
    }
    
    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        animation: fallConfetti 3s linear forwards;
    }
    
    @keyframes fallConfetti {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);