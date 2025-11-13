// particles.js - Système de particules
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
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
            'rgba(255, 0, 255, 0.6)',
            'rgba(233, 255, 112, 0.6)',
            'rgba(251, 113, 133, 0.6)',
            'rgba(59, 130, 246, 0.6)',
            'rgba(225, 29, 72, 0.6)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        // L'animation est gérée par CSS
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem();
});