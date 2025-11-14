class TranslationManager {
    constructor() {
        this.currentLang = 'fr';
        this.translations = {
            'fr': {
                // Navigation
                'home': 'Accueil',
                'about': 'Notre École', 
                'pedagogy': 'Pédagogie',
                'activities': 'Activités',
                'results': 'Résultats',
                'contact': 'Contact',
                'inscription': 'Inscription',
                
                // Hero section
                'welcome': 'BIENVENUE',
                'subtitle': 'Crèche • Garderie • Maternelle • Primaire Bilingue',
                'motto': 'Dans un cadre féerique stimulant et sécurisant',
                'inscription-btn': 'Inscription 2025-2026',
                'contact-btn': 'Nous Contacter',
                
                // Activities
                'oratory': 'Art Oratoire',
                'gardening': 'Jardinage', 
                'music': 'Musique',
                'dance': 'Danse',
                'english': 'Anglais',
                'creativity': 'Créativité',
                'oratory-desc': 'Développer la prise de parole, la confiance et l\'écoute',
                'gardening-desc': 'Éveiller à la nature, à la patience et à la responsabilité',
                'music-desc': 'Explorer les sons, les rythmes et les instruments',
                'dance-desc': 'Expression corporelle, coordination et plaisir du mouvement',
                'english-desc': 'Immersion ludique et quotidienne dans la langue',
                'creativity-desc': 'Peinture, collage, modelage et expression artistique',
                
                // Cycles
                'creche': 'Crèche & Garderie',
                'maternelle': 'Maternelle Bilingue',
                'primaire': 'Primaire Bilingue',
                'creche-age': '2 mois - 3 ans',
                'maternelle-age': '3-5 ans', 
                'primaire-age': '6-12 ans',
                
                // Results
                'success-rate': 'Taux de réussite',
                'bilingual-students': 'Élèves bilingues',
                'parent-satisfaction': 'Satisfaction parents',
                'view-results': 'Consulter les résultats',
                
                // Footer
                'emergency': 'Urgences & Contacts Importants',
                'direction': 'Direction (Renseignements)',
                'secretariat': 'Secrétariat (Rendez-vous)',
                'agreed-school': 'École Privée Agréée'
            },
            'en': {
                // Navigation
                'home': 'Home',
                'about': 'Our School',
                'pedagogy': 'Pedagogy', 
                'activities': 'Activities',
                'results': 'Results',
                'contact': 'Contact',
                'inscription': 'Registration',
                
                // Hero section
                'welcome': 'WELCOME',
                'subtitle': 'Nursery • Daycare • Kindergarten • Bilingual Primary',
                'motto': 'In a stimulating and secure fairy-tale setting',
                'inscription-btn': 'Registration 2025-2026',
                'contact-btn': 'Contact Us',
                
                // Activities
                'oratory': 'Oratory Art',
                'gardening': 'Gardening',
                'music': 'Music',
                'dance': 'Dance',
                'english': 'English',
                'creativity': 'Creativity',
                'oratory-desc': 'Develop public speaking, confidence and listening skills',
                'gardening-desc': 'Awaken to nature, patience and responsibility',
                'music-desc': 'Explore sounds, rhythms and instruments',
                'dance-desc': 'Body expression, coordination and movement pleasure',
                'english-desc': 'Fun and daily language immersion',
                'creativity-desc': 'Painting, collage, modeling and artistic expression',
                
                // Cycles
                'creche': 'Nursery & Daycare',
                'maternelle': 'Bilingual Kindergarten',
                'primaire': 'Bilingual Primary',
                'creche-age': '2 months - 3 years',
                'maternelle-age': '3-5 years',
                'primaire-age': '6-12 years',
                
                // Results
                'success-rate': 'Success rate',
                'bilingual-students': 'Bilingual students',
                'parent-satisfaction': 'Parent satisfaction',
                'view-results': 'View results',
                
                // Footer
                'emergency': 'Emergencies & Important Contacts',
                'direction': 'Direction (Information)',
                'secretariat': 'Secretariat (Appointments)',
                'agreed-school': 'Private Approved School'
            }
        };
        this.init();
    }

    init() {
        this.setupTranslationButton();
        this.loadLanguagePreference();
        this.setupLanguageDetection();
    }

    setupTranslationButton() {
        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'fr' ? 'en' : 'fr';
        this.applyTranslations();
        this.saveLanguagePreference();
        this.updateButtonText();
        this.animateLanguageSwitch();
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                // Préserver le HTML interne si nécessaire
                if (element.hasAttribute('data-html')) {
                    element.innerHTML = this.translations[this.currentLang][key];
                } else {
                    element.textContent = this.translations[this.currentLang][key];
                }
            }
        });

        // Mettre à jour les attributs lang
        document.documentElement.lang = this.currentLang;
        
        // Mettre à jour les meta descriptions
        this.updateMetaTags();
    }

    updateMetaTags() {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            // Vous pouvez ajouter des descriptions différentes par langue si nécessaire
            metaDescription.setAttribute('lang', this.currentLang);
        }
    }

    updateButtonText() {
        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
            const icon = translateBtn.querySelector('i');
            const span = translateBtn.querySelector('span');
            if (span) {
                span.textContent = this.currentLang === 'fr' ? 'EN' : 'FR';
            }
            
            // Animation du bouton
            translateBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                translateBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    animateLanguageSwitch() {
        // Animation de transition douce
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 300);

        // Notification de changement
        if (window.schoolWebsite) {
            const message = this.currentLang === 'fr' 
                ? 'Langue changée en Français' 
                : 'Language switched to English';
            window.schoolWebsite.showNotification(message, 'success');
        }
    }

    saveLanguagePreference() {
        localStorage.setItem('preferredLanguage', this.currentLang);
        // Cookie de préférence de langue (valable 1 an)
        document.cookie = `preferredLanguage=${this.currentLang}; max-age=31536000; path=/`;
    }

    loadLanguagePreference() {
        // Vérifier d'abord localStorage
        const savedLang = localStorage.getItem('preferredLanguage');
        
        // Sinon vérifier les cookies
        if (!savedLang) {
            const cookieLang = this.getCookie('preferredLanguage');
            if (cookieLang) {
                this.currentLang = cookieLang;
            }
        } else if (savedLang === 'fr' || savedLang === 'en') {
            this.currentLang = savedLang;
        }

        // Détection automatique de la langue du navigateur
        if (!savedLang && !this.getCookie('preferredLanguage')) {
            this.autoDetectLanguage();
        }

        this.applyTranslations();
        this.updateButtonText();
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    autoDetectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) {
            this.currentLang = 'en';
        }
        // Par défaut, on reste en français pour les autres langues
    }

    setupLanguageDetection() {
        // Écouter les changements de langue du navigateur
        window.addEventListener('languagechange', () => {
            this.autoDetectLanguage();
            this.applyTranslations();
        });
    }

    // Méthode pour ajouter des traductions dynamiquement
    addTranslations(newTranslations) {
        Object.keys(newTranslations).forEach(lang => {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
            Object.assign(this.translations[lang], newTranslations[lang]);
        });
    }

    // Méthode pour traduire du texte dynamiquement
    translate(key, lang = null) {
        const targetLang = lang || this.currentLang;
        return this.translations[targetLang][key] || key;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.translationManager = new TranslationManager();
    
    // Exposer la méthode de traduction globalement
    window.__ = (key, lang) => window.translationManager.translate(key, lang);
});

// Support des frameworks JavaScript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslationManager;
}