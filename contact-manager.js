class ContactManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupContactActions();
        this.setupContactForm();
        this.setupQuickActions();
        this.initializeGeolocation();
    }

    setupContactActions() {
        // Gestion des boutons d'appel
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action="call"]');
            if (button) {
                const number = button.dataset.number;
                this.initiateCall(number);
            }
        });

        // Gestion des boutons WhatsApp
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action="whatsapp"]');
            if (button) {
                const number = button.dataset.number;
                this.openWhatsApp(number);
            }
        });
    }

    initiateCall(phoneNumber) {
        // Formatage du numéro pour l'appel
        const formattedNumber = phoneNumber.replace(/\s/g, '');
        
        // Vérification de l'environnement mobile
        if (this.isMobileDevice()) {
            window.location.href = `tel:${formattedNumber}`;
        } else {
            // Fallback pour desktop
            this.showNotification(
                `Appel vers: ${this.formatPhoneDisplay(formattedNumber)}`,
                'info'
            );
            
            // Copie dans le presse-papier
            this.copyToClipboard(formattedNumber);
        }
        
        // Tracking analytics
        this.trackContactAction('call', formattedNumber);
    }

    openWhatsApp(phoneNumber) {
        const message = "Bonjour, je souhaite prendre contact avec Les Bulles de Joie.";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Tracking analytics
        this.trackContactAction('whatsapp', phoneNumber);
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Validation en temps réel
            this.setupFormValidation(contactForm);
        }
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Adresse email invalide';
                }
                break;
                
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Numéro de téléphone invalide';
                }
                break;
                
            default:
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Ce champ est obligatoire';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ff4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 0.3rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async handleFormSubmission(form) {
        // Validation globale du formulaire
        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        // Récupération des données
        const formData = new FormData(form);
        const data = {
            nom: formData.get('nom'),
            email: formData.get('email'),
            telephone: formData.get('telephone'),
            sujet: formData.get('sujet'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        // Affichage du loader
        this.showFormLoader();

        try {
            // Envoi des données
            await this.sendContactData(data);
            
            // Réinitialisation du formulaire
            form.reset();
            
            this.showNotification('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
            
        } catch (error) {
            console.error('Erreur envoi formulaire:', error);
            this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            this.hideFormLoader();
        }
    }

    async sendContactData(data) {
        // Simulation d'envoi - À remplacer par votre backend
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Envoi par email (fallback)
                this.sendEmailFallback(data);
                
                // Envoi par WhatsApp (Direction)
                this.sendWhatsAppNotification(data);
                
                resolve();
            }, 2000);
        });
    }

    sendEmailFallback(data) {
        const subject = `Nouveau message de ${data.nom} - ${this.getSujetLabel(data.sujet)}`;
        const body = `
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Sujet: ${this.getSujetLabel(data.sujet)}

Message:
${data.message}

---
Envoyé depuis le site Les Bulles de Joie
        `.trim();

        const emailUrl = `mailto:lesbullesdejoie@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(emailUrl, '_blank');
    }

    sendWhatsAppNotification(data) {
        const message = `
📧 NOUVEAU MESSAGE SITE WEB

👤 De: ${data.nom}
📧 Email: ${data.email}
📞 Tél: ${data.telephone || 'Non renseigné'}
🎯 Sujet: ${this.getSujetLabel(data.sujet)}

💬 Message:
${data.message}

⏰ Reçu le: ${new Date().toLocaleDateString('fr-FR')}
        `.trim();

        const whatsappUrl = `https://wa.me/229919652?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    getSujetLabel(sujet) {
        const sujets = {
            'information': 'Information générale',
            'inscription': 'Demande d\'inscription',
            'pedagogie': 'Question pédagogique',
            'urgence': 'Situation urgente',
            'autre': 'Autre demande'
        };
        return sujets[sujet] || 'Information générale';
    }

    showFormLoader() {
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Envoi en cours...
        `;
        submitButton.disabled = true;
        
        // Sauvegarde pour restoration
        submitButton.dataset.originalContent = originalText;
    }

    hideFormLoader() {
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        const originalContent = submitButton.dataset.originalContent;
        
        if (originalContent) {
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
        }
    }

    setupQuickActions() {
        // Bouton carte
        window.openMaps = () => {
            const address = "Zongo, Parakou, Bénin";
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        };

        // Bouton email
        window.openEmail = () => {
            const emailUrl = `mailto:lesbullesdejoie@gmail.com`;
            window.open(emailUrl, '_blank');
        };
    }

    initializeGeolocation() {
        // Détection automatique de la localisation pour les directions
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = position;
                },
                (error) => {
                    console.log('Géolocalisation non disponible');
                }
            );
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    formatPhoneDisplay(phone) {
        // Formatage affichage français
        return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Numéro copié dans le presse-papier', 'success');
        } catch (err) {
            console.error('Erreur copie presse-papier:', err);
        }
    }

    trackContactAction(action, value) {
        if (window.analyticsManager) {
            window.analyticsManager.logEvent('contact_action', {
                action: action,
                value: value,
                timestamp: new Date().toISOString()
            });
        }
    }

    showNotification(message, type = 'info') {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, type);
        } else {
            // Fallback simple
            alert(message);
        }
    }

    // Méthode pour les suggestions de contact intelligentes
    suggestBestContact(sujet, urgence) {
        const suggestions = {
            'information': {
                method: 'whatsapp',
                number: '229919652',
                description: 'Direction - Renseignements'
            },
            'inscription': {
                method: 'whatsapp', 
                number: '22958830303',
                description: 'Secrétariat - Inscriptions'
            },
            'urgence': {
                method: 'call',
                number: '+22997919452',
                description: 'Urgences - Contact immédiat'
            },
            'pedagogie': {
                method: 'email',
                address: 'lesbullesdejoie@gmail.com',
                description: 'Email - Questions pédagogiques'
            }
        };

        return suggestions[sujet] || suggestions['information'];
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});