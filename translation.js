class IntelligentTranslator {
    constructor() {
        this.currentLang = 'fr';
        this.translations = {};
        this.initialize();
    }

    async initialize() {
        await this.loadTranslations();
        this.setupLanguageToggle();
        this.autoDetectLanguage();
        this.setupPersistentLanguage();
    }

    async loadTranslations() {
        try {
            const response = await fetch('translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.warn('Translations file not found, using fallback');
            this.translations = this.getFallbackTranslations();
        }
    }

    getFallbackTranslations() {
        return {
            fr: {
                // Navigation
                'Accueil': 'Accueil',
                'Notre École': 'Notre École',
                'Pédagogie': 'Pédagogie',
                'Activités': 'Activités',
                'Résultats': 'Résultats',
                'Contact': 'Contact',
                'Inscription': 'Inscription',
                
                // Hero Section
                'Les Bulles de Joie': 'Les Bulles de Joie',
                'Dans un cadre féerique stimulant et sécurisant': 'Dans un cadre féerique stimulant et sécurisant',
                
                // Cycles
                'Crèche & Garderie': 'Crèche & Garderie',
                'Maternelle Bilingue': 'Maternelle Bilingue',
                'Primaire Bilingue': 'Primaire Bilingue',
                
                // Valeurs
                'Amour': 'Amour',
                'Travail': 'Travail',
                'Rigueur': 'Rigueur',
                'Créativité': 'Créativité'
            },
            en: {
                // Navigation
                'Accueil': 'Home',
                'Notre École': 'Our School',
                'Pédagogie': 'Pedagogy',
                'Activités': 'Activities',
                'Résultats': 'Results',
                'Contact': 'Contact',
                'Inscription': 'Registration',
                
                // Hero Section
                'Les Bulles de Joie': 'Bubbles of Joy',
                'Dans un cadre féerique stimulant et sécurisant': 'In a stimulating and secure fairy-tale setting',
                
                // Cycles
                'Crèche & Garderie': 'Nursery & Daycare',
                'Maternelle Bilingue': 'Bilingual Kindergarten',
                'Primaire Bilingue': 'Bilingual Primary',
                
                // Valeurs
                'Amour': 'Love',
                'Travail': 'Work',
                'Rigueur': 'Rigor',
                'Créativité': 'Creativity'
            }
        };
    }

    setupLanguageToggle() {
        const toggle = document.getElementById('translateToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Créer le toggle s'il n'existe pas
        if (!toggle) {
            this.createLanguageToggle();
        }
    }

    createLanguageToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'translateToggle';
        toggle.className = 'btn-translate';
        toggle.innerHTML = `
            <span class="lang-flag">🇫🇷</span>
            <span>FR</span>
        `;
        
        // Ajouter au header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(toggle);
        }
        
        toggle.addEventListener('click', () => {
            this.toggleLanguage();
        });
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'fr' ? 'en' : 'fr';
        this.applyTranslation();
        this.updateToggleUI();
        this.saveLanguagePreference();
    }

    applyTranslation() {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLang]?.[key] || key;
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Traduction des attributs alt et title
        this.translateAttributes();
        
        // Mise à jour du schema.org
        this.updateSchema();
        
        // Animation de transition
        this.animateLanguageTransition();
    }

    translateAttributes() {
        const images = document.querySelectorAll('img[data-translate-alt]');
        images.forEach(img => {
            const key = img.getAttribute('data-translate-alt');
            const translation = this.translations[this.currentLang]?.[key] || key;
            img.alt = translation;
        });
    }

    updateSchema() {
        // Mettre à jour le schema.org selon la langue
        const html = document.documentElement;
        html.lang = this.currentLang;
        
        // Mettre à jour les meta descriptions
        this.updateMetaTags();
    }

    updateMetaTags() {
        const description = document.querySelector('meta[name="description"]');
        if (description && this.translations[this.currentLang]?.meta_description) {
            description.content = this.translations[this.currentLang].meta_description;
        }
    }

    updateToggleUI() {
        const toggle = document.getElementById('translateToggle');
        if (toggle) {
            const flag = toggle.querySelector('.lang-flag');
            const text = toggle.querySelector('span:not(.lang-flag)');
            
            if (this.currentLang === 'fr') {
                flag.textContent = '🇫🇷';
                text.textContent = 'FR';
            } else {
                flag.textContent = '🇬🇧';
                text.textContent = 'EN';
            }
            
            // Animation du toggle
            toggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
        }
    }

    animateLanguageTransition() {
        // Animation subtile de transition de langue
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.3s ease';
        }, 50);
    }

    autoDetectLanguage() {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'en' && this.currentLang === 'fr') {
            // Demander à l'utilisateur s'il préfère l'anglais
            this.showLanguageSuggestion();
        }
    }

    showLanguageSuggestion() {
        // Notification discrète pour suggérer la traduction
        if (!localStorage.getItem('language_suggestion_shown')) {
            setTimeout(() => {
                if (window.schoolWebsite) {
                    window.schoolWebsite.showNotification(
                        '🌍 Would you like to view this site in English?',
                        'info',
                        5000
                    );
                }
                localStorage.setItem('language_suggestion_shown', 'true');
            }, 3000);
        }
    }

    saveLanguagePreference() {
        localStorage.setItem('preferred_language', this.currentLang);
    }

    setupPersistentLanguage() {
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && savedLang !== this.currentLang) {
            this.currentLang = savedLang;
            this.applyTranslation();
            this.updateToggleUI();
        }
    }

    // Méthode pour traduire du texte dynamique
    translate(text) {
        return this.translations[this.currentLang]?.[text] || text;
    }

    // API pour les autres scripts
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Traduction des dates
    formatDate(date, options = {}) {
        const lang = this.currentLang;
        const dateObj = new Date(date);
        
        return dateObj.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        });
    }

    // Traduction des nombres
    formatNumber(number) {
        const lang = this.currentLang;
        return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(number);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new IntelligentTranslator();
});

// API globale pour les traductions
window.__ = (text) => {
    return window.translator ? window.translator.translate(text) : text;
};

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntelligentTranslator;
}