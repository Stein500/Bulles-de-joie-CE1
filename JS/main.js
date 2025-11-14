// main.js - Fonctionnalités principales du site avec nouvelles couleurs
class SchoolWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupSmoothScroll();
        this.setupAnimations();
        this.setupStickers();
        this.setupBubbles();
        this.setupNavigation();
        this.showWelcomeMessage();
    }

    // Gestion du thème
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                document.body.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
                localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
                this.showNotification('Thème ' + (e.target.checked ? 'sombre' : 'clair') + ' activé!');
            });

            // Charger la préférence de thème
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            if (themeToggle.checked !== (savedTheme === 'dark')) {
                themeToggle.checked = savedTheme === 'dark';
            }
        }
    }

    // Scroll fluide
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Animations au scroll
    setupAnimations() {
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
        document.querySelectorAll('.card, .feature-card, .section-title').forEach(el => {
            observer.observe(el);
        });
    }

    // Stickers flottants
    setupStickers() {
        const stickers = document.querySelectorAll('.sticker');
        stickers.forEach((sticker, index) => {
            // Animation déjà gérée par CSS
        });
    }

    // Bulles interactives
    setupBubbles() {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.addEventListener('click', () => {
                this.showNotification(`Vous avez cliqué sur: ${bubble.getAttribute('data-content')}`);
            });
        });
    }

    // Navigation active
    setupNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Message de bienvenue
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('Bienvenue aux Bulles de Joie! 🎉 Votre école bilingue à Parakou');
        }, 1000);
    }

    // Système de notifications
    showNotification(message, type = 'success') {
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Supprimer après 4 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Générer des particules
    createParticles(container, count = 30) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
                background: ${this.getRandomColor()};
            `;
            container.appendChild(particle);
        }
    }

    getRandomColor() {
        const colors = ['#FF00FF', '#E9FF70', '#FB7185', '#3B82F6', '#E11D48'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.schoolWebsite = new SchoolWebsite();
});

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolWebsite;
}
