class LogoPreloader {
    constructor() {
        this.init();
    }

    init() {
        this.createPreloader();
        this.animateLogo();
        this.loadEssentialAssets();
    }

    createPreloader() {
        const preloader = document.createElement('div');
        preloader.id = 'logo-preloader';
        preloader.innerHTML = `
            <div class="logo-container">
                <div class="logo-animation">
                    <div class="logo-bubble">•</div>
                    <div class="logo-bubble">•</div>
                    <div class="logo-bubble">•</div>
                </div>
                <div class="logo-text">
                    <span class="logo-part">Les Bulles</span>
                    <span class="logo-part">de Joie</span>
                </div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        `;
        
        document.body.prepend(preloader);
        
        // Styles intégrés pour éviter le FOUC
        const styles = document.createElement('style');
        styles.textContent = this.getPreloaderStyles();
        document.head.appendChild(styles);
    }

    getPreloaderStyles() {
        return `
            #logo-preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--rose-fuchsia), var(--vert-citron));
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
            }
            
            .logo-container {
                text-align: center;
                color: white;
            }
            
            .logo-animation {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 2rem;
            }
            
            .logo-bubble {
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                animation: bubbleFloat 1.5s infinite ease-in-out;
            }
            
            .logo-bubble:nth-child(2) { animation-delay: 0.2s; }
            .logo-bubble:nth-child(3) { animation-delay: 0.4s; }
            
            .logo-text {
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 2rem;
            }
            
            .logo-part {
                display: block;
                opacity: 0;
                animation: textReveal 0.8s forwards;
            }
            
            .logo-part:first-child { animation-delay: 0.5s; }
            .logo-part:last-child { animation-delay: 0.8s; }
            
            .loading-bar {
                width: 200px;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto;
            }
            
            .loading-progress {
                height: 100%;
                background: white;
                border-radius: 2px;
                animation: loading 2s ease-in-out;
                transform-origin: left;
            }
            
            @keyframes bubbleFloat {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-20px) scale(1.1); }
            }
            
            @keyframes textReveal {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes loading {
                0% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
            }
        `;
    }

    animateLogo() {
        // Simulation du chargement
        setTimeout(() => {
            this.hidePreloader();
        }, 2500);
    }

    hidePreloader() {
        const preloader = document.getElementById('logo-preloader');
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            preloader.remove();
            this.triggerWelcomeEffects();
        }, 500);
    }

    triggerWelcomeEffects() {
        // Effets de bienvenue après le preloader
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification('Bienvenue aux Bulles de Joie! 🌟');
        }
        
        // Animation des bulles d'accueil
        this.createWelcomeBubbles();
    }

    createWelcomeBubbles() {
        const bubblesContainer = document.createElement('div');
        bubblesContainer.className = 'welcome-bubbles';
        document.body.appendChild(bubblesContainer);
        
        // Créer des bulles animées
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'welcome-bubble';
            bubble.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
                background: ${this.getRandomColor()};
            `;
            bubblesContainer.appendChild(bubble);
        }
        
        // Supprimer après animation
        setTimeout(() => {
            bubblesContainer.remove();
        }, 3000);
    }

    getRandomColor() {
        const colors = ['var(--rose-fuchsia)', 'var(--vert-citron)', 'white'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    loadEssentialAssets() {
        // Préchargement des assets critiques
        const criticalAssets = [
            'assets/images/logo.png',
            'css/style.css',
            'css/animations.css'
        ];
        
        criticalAssets.forEach(asset => {
            if (asset.endsWith('.css')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = asset;
                document.head.appendChild(link);
            }
        });
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.logoPreloader = new LogoPreloader();
});