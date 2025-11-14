class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.animationId = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.generateParticles(50);
        this.startAnimation();
        this.setupInteractions();
    }

    createContainer() {
        this.container = document.getElementById('particles-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'particles-container';
            this.container.className = 'particles-container';
            document.body.appendChild(this.container);
        }

        // Styles du conteneur
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
    }

    generateParticles(count) {
        for (let i = 0; i < count; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Propriétés aléatoires
        const size = Math.random() * 6 + 2;
        const color = this.getRandomColor();
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${left}%;
            top: 100%;
            opacity: ${Math.random() * 0.6 + 0.2};
            animation: floatParticle ${duration}s linear infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;

        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            speed: duration,
            amplitude: Math.random() * 50 + 25
        });
    }

    getRandomColor() {
        const colors = [
            'rgba(233, 255, 112, 0.6)', // Vert citron
            'rgba(255, 0, 255, 0.6)',   // Rose fuchsia
            'rgba(255, 255, 255, 0.4)', // Blanc
            'rgba(251, 113, 133, 0.6)', // Rose
            'rgba(59, 130, 246, 0.6)'   // Bleu
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startAnimation() {
        const animate = () => {
            this.updateParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    updateParticles() {
        this.particles.forEach(particle => {
            const rect = particle.element.getBoundingClientRect();
            
            // Réinitialiser la position si la particule sort de l'écran
            if (rect.top < -50) {
                this.resetParticle(particle);
            }
        });
    }

    resetParticle(particle) {
        particle.element.style.top = '100%';
        particle.element.style.left = Math.random() * 100 + '%';
        particle.element.style.animationDuration = (Math.random() * 20 + 10) + 's';
    }

    setupInteractions() {
        // Interaction avec la souris
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        // Interaction au scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.boostParticles();
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.normalizeParticles();
            }, 100);
        });
    }

    handleMouseMove(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        this.particles.forEach(particle => {
            const rect = particle.element.getBoundingClientRect();
            const particleX = rect.left / window.innerWidth;
            const particleY = rect.top / window.innerHeight;

            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + 
                Math.pow(mouseY - particleY, 2)
            );

            if (distance < 0.1) {
                this.repelParticle(particle, e.clientX, e.clientY);
            }
        });
    }

    repelParticle(particle, mouseX, mouseY) {
        const rect = particle.element.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;

        const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
        const force = 10;

        particle.element.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
        
        setTimeout(() => {
            particle.element.style.transform = '';
        }, 200);
    }

    boostParticles() {
        this.particles.forEach(particle => {
            const currentDuration = parseFloat(particle.element.style.animationDuration || particle.speed + 's');
            particle.element.style.animationDuration = (currentDuration * 0.7) + 's';
        });
    }

    normalizeParticles() {
        this.particles.forEach(particle => {
            particle.element.style.animationDuration = particle.speed + 's';
        });
    }

    createBurst(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            this.createBurstParticle(x, y);
        }
    }

    createBurstParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle burst';
        
        const size = Math.random() * 8 + 2;
        const color = this.getRandomColor();
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 1 + 0.5;

        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            opacity: 0.8;
            pointer-events: none;
            z-index: 10000;
        `;

        this.container.appendChild(particle);

        // Animation d'explosion
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;

        particle.animate([
            { 
                transform: 'scale(1) translate(0, 0)',
                opacity: 0.8
            },
            { 
                transform: `scale(0.5) translate(${endX - x}px, ${endY - y}px)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        }).onfinish = () => {
            particle.remove();
        };
    }

    // Nettoyage
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.container) {
            this.container.remove();
        }
    }
}

// CSS dynamique pour les animations de particules
const particlesStyle = document.createElement('style');
particlesStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
            opacity: 0;
        }
    }

    .particles-container {
        background: transparent !important;
    }

    /* Réduction des mouvements pour les préférences d'accessibilité */
    @media (prefers-reduced-motion: reduce) {
        .particle {
            animation: none !important;
        }
    }
`;
document.head.appendChild(particlesStyle);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem();
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
