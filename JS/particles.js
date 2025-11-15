// particles.js - Système de particules pour les effets visuels

class ParticlesSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 50;
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupEventListeners();
        this.animate();
    }

    // Créer le conteneur de particules
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'particles-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Créer des particules au clic
        document.addEventListener('click', (e) => {
            this.createParticlesAt(e.clientX, e.clientY, 5);
        });

        // Créer des particules au survol des boutons
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('btn') || 
                e.target.closest('.btn')) {
                this.createParticlesAt(e.clientX, e.clientY, 3);
            }
        });

        // Créer des particules au défilement
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                this.createScrollParticles();
                scrollTimeout = setTimeout(() => {
                    scrollTimeout = null;
                }, 100);
            }
        });

        // Créer des particules aléatoires
        setInterval(() => {
            if (this.particles.length < this.maxParticles / 2) {
                this.createRandomParticles(1);
            }
        }, 2000);
    }

    // Créer des particules à une position spécifique
    createParticlesAt(x, y, count) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y);
        }
    }

    // Créer des particules au défilement
    createScrollParticles() {
        if (Math.random() > 0.7) {
            this.createRandomParticles(1);
        }
    }

    // Créer des particules aléatoires
    createRandomParticles(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            this.createParticle(x, y);
        }
    }

    // Créer une particule individuelle
    createParticle(x, y) {
        if (this.particles.length >= this.maxParticles) {
            // Supprimer la particule la plus ancienne
            const oldestParticle = this.particles.shift();
            if (oldestParticle && oldestParticle.element) {
                oldestParticle.element.remove();
            }
        }

        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            size: 4 + Math.random() * 8,
            element: null,
            color: this.getRandomColor()
        };

        this.createParticleElement(particle);
        this.particles.push(particle);
    }

    // Créer l'élément DOM de la particule
    createParticleElement(particle) {
        const element = document.createElement('div');
        element.className = 'particle';
        element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: ${particle.color};
            border-radius: 50%;
            pointer-events: none;
            left: ${particle.x}px;
            top: ${particle.y}px;
            opacity: ${particle.life};
            transform: scale(${particle.life});
            transition: opacity 0.1s;
        `;

        this.container.appendChild(element);
        particle.element = element;
    }

    // Obtenir une couleur aléatoire dans la palette
    getRandomColor() {
        const colors = [
            'var(--fuchsia)',
            'var(--lemon-green)',
            'var(--light-pink)',
            'var(--light-green)',
            'var(--white)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Animation des particules
    animate() {
        this.updateParticles();
        this.renderParticles();
        requestAnimationFrame(() => this.animate());
    }

    // Mettre à jour la physique des particules
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Appliquer la vélocité
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Appliquer la gravité
            particle.vy += 0.1;

            // Appliquer la résistance de l'air
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Réduire la vie
            particle.life -= particle.decay;

            // Supprimer les particules mortes
            if (particle.life <= 0 || 
                particle.x < -100 || 
                particle.x > window.innerWidth + 100 ||
                particle.y < -100 || 
                particle.y > window.innerHeight + 100) {
                
                if (particle.element) {
                    particle.element.remove();
                }
                this.particles.splice(i, 1);
            }
        }
    }

    // Rendu des particules
    renderParticles() {
        this.particles.forEach(particle => {
            if (particle.element) {
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.opacity = particle.life;
                particle.element.style.transform = `scale(${particle.life})`;
            }
        });
    }

    // Créer un effet d'explosion
    createExplosion(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                size: 6 + Math.random() * 10,
                element: null,
                color: this.getRandomColor()
            };

            this.createParticleElement(particle);
            this.particles.push(particle);
        }
    }

    // Créer un effet de confetti
    createConfetti(count = 30) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const particle = {
                x: x,
                y: -20,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                life: 1,
                decay: 0.005 + Math.random() * 0.005,
                size: 8 + Math.random() * 12,
                element: null,
                color: this.getRandomColor(),
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            };

            this.createConfettiElement(particle);
            this.particles.push(particle);
        }
    }

    // Créer un élément confetti
    createConfettiElement(particle) {
        const element = document.createElement('div');
        element.className = 'confetti';
        element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: ${particle.color};
            pointer-events: none;
            left: ${particle.x}px;
            top: ${particle.y}px;
            opacity: ${particle.life};
            transform: rotate(${particle.rotation}deg);
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;

        this.container.appendChild(element);
        particle.element = element;
    }

    // Nettoyage
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        this.particles = [];
    }
}

// Initialisation du système de particules
document.addEventListener('DOMContentLoaded', () => {
    window.particlesSystem = new ParticlesSystem();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticlesSystem;
}