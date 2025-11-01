// Système de traduction
class TranslationSystem {
    constructor() {
        this.currentLang = 'fr';
        this.translations = {
            'fr': {
                'results_subtitle': 'Résultats Scolaires - Octobre 2025',
                'teacher_label': 'Enseignant',
                'principal_label': 'Directrice',
                'access_results': 'Accès aux résultats',
                'access_description': 'Pour consulter les résultats de votre enfant, veuillez saisir le mot de passe qui vous a été communiqué.',
                'select_student': 'Sélectionnez l\'élève :',
                'choose_student': 'Choisir un élève',
                'password_label': 'Mot de passe :',
                'password_placeholder': 'Entrez le mot de passe',
                'view_results': 'Voir les résultats',
                'password_hint': 'Le mot de passe correspond au prénom de l\'élève en minuscules',
                'results': 'Résultats',
                'results_description': 'Les résultats de votre enfant apparaîtront ici après authentification.',
                'coming_soon': 'Bientôt',
                'new': 'Nouveau'
            },
            'en': {
                'results_subtitle': 'School Results - October 2025',
                'teacher_label': 'Teacher',
                'principal_label': 'Principal',
                'access_results': 'Access Results',
                'access_description': 'To view your child\'s results, please enter the password provided to you.',
                'select_student': 'Select student:',
                'choose_student': 'Choose a student',
                'password_label': 'Password:',
                'password_placeholder': 'Enter password',
                'view_results': 'View results',
                'password_hint': 'The password corresponds to the student\'s first name in lowercase',
                'results': 'Results',
                'results_description': 'Your child\'s results will appear here after authentication.',
                'coming_soon': 'Coming soon',
                'new': 'New'
            },
            'es': {
                'results_subtitle': 'Resultados Escolares - Octubre 2025',
                'teacher_label': 'Profesor',
                'principal_label': 'Directora',
                'access_results': 'Acceso a Resultados',
                'access_description': 'Para consultar los resultados de su hijo, ingrese la contraseña que se le proporcionó.',
                'select_student': 'Seleccione el estudiante:',
                'choose_student': 'Elegir un estudiante',
                'password_label': 'Contraseña:',
                'password_placeholder': 'Ingrese la contraseña',
                'view_results': 'Ver resultados',
                'password_hint': 'La contraseña corresponde al nombre del estudiante en minúsculas',
                'results': 'Resultados',
                'results_description': 'Los resultados de su hijo aparecerán aquí después de la autenticación.',
                'coming_soon': 'Próximamente',
                'new': 'Nuevo'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupLanguageSelector();
        this.loadSavedLanguage();
    }
    
    setupLanguageSelector() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.dataset.lang;
                this.changeLanguage(lang);
                
                // Mettre à jour l'état actif des boutons
                langButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
    
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && this.translations[savedLang]) {
            this.changeLanguage(savedLang);
            
            // Mettre à jour le bouton actif
            document.querySelector(`.lang-btn[data-lang="${savedLang}"]`).classList.add('active');
        }
    }
    
    changeLanguage(lang) {
        if (!this.translations[lang]) return;
        
        this.currentLang = lang;
        localStorage.setItem('preferred_language', lang);
        
        // Traduire tous les éléments avec l'attribut data-translate
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = this.translations[lang][key];
                } else {
                    element.textContent = this.translations[lang][key];
                }
            }
        });
        
        // Afficher une notification
        this.showLanguageNotification(lang);
    }
    
    showLanguageNotification(lang) {
        const messages = {
            'fr': 'Langue changée en français',
            'en': 'Language changed to English',
            'es': 'Idioma cambiado a español'
        };
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-language"></i>
            <span>${messages[lang]}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialisation du système de traduction
let translationSystem;
document.addEventListener('DOMContentLoaded', function() {
    translationSystem = new TranslationSystem();
});