// Animations spécifiques à la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Animation des compteurs
    animateCounters();
    
    // Gestion des cartes 3D
    init3DCards();
    
    // Animation des particules
    createParticles();
});

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 secondes
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function createParticles() {
    const container = document.querySelector('.particles-container');
    const emojis = ['📚', '🎨', '🔢', '🔬', '🌍', '📖', '✏️', '🎵'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        
        const size = Math.random() * 20 + 15;
        const x = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        
        particle.style.cssText = `
            --size: ${size}px;
            --x: ${x}%;
            --duration: ${duration}s;
        `;
        
        container.appendChild(particle);
    }
}