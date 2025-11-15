class InscriptionSystem {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.initialize();
    }

    initialize() {
        this.setupStepNavigation();
        this.setupCycleSelection();
        this.setupParentTabs();
        this.setupFormValidation();
        this.setupRealTimeValidation();
        this.setupFAQ();
        this.loadFromLocalStorage();
    }

    setupStepNavigation() {
        // Navigation entre les étapes
        window.nextStep = (step) => {
            if (this.validateStep(this.currentStep)) {
                this.saveStepData(this.currentStep);
                this.showStep(step);
                this.updateProgress(step);
            }
        };

        window.prevStep = (step) => {
            this.showStep(step);
            this.updateProgress(step);
        };
    }

    validateStep(step) {
        const currentStepElement = document.getElementById(`step${step}`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'Ce champ est obligatoire');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }

            // Validation spécifique par type
            if (input.type === 'email' && input.value) {
                if (!this.isValidEmail(input.value)) {
                    this.showFieldError(input, 'Adresse email invalide');
                    isValid = false;
                }
            }

            if (input.type === 'tel' && input.value) {
                if (!this.isValidPhone(input.value)) {
                    this.showFieldError(input, 'Numéro de téléphone invalide');
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            this.showNotification('Veuillez corriger les erreurs avant de continuer', 'error');
            this.scrollToFirstError(currentStepElement);
        }

        return isValid;
    }

    showStep(step) {
        // Masquer l'étape actuelle
        document.querySelectorAll('.form-step').forEach(stepElement => {
            stepElement.classList.remove('active');
        });

        // Afficher la nouvelle étape
        const newStepElement = document.getElementById(`step${step}`);
        if (newStepElement) {
            newStepElement.classList.add('active');
            this.currentStep = step;
            
            // Animation d'entrée
            newStepElement.style.animation = 'none';
            setTimeout(() => {
                newStepElement.style.animation = 'slideInUp 0.5s ease';
            }, 10);

            // Mettre à jour le récapitulatif si on est à l'étape 4
            if (step === 4) {
                this.updateSummary();
            }
        }
    }

    updateProgress(step) {
        const progressFill = document.getElementById('progressFill');
        const percentage = ((step - 1) / 3) * 100;
        progressFill.style.width = `${percentage}%`;

        // Mettre à jour les étapes actives
        document.querySelectorAll('.step').forEach((stepElement, index) => {
            if (index + 1 <= step) {
                stepElement.classList.add('active');
            } else {
                stepElement.classList.remove('active');
            }
        });
    }

    setupCycleSelection() {
        const cycleOptions = document.querySelectorAll('.cycle-option');
        
        cycleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Retirer la sélection précédente
                cycleOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Ajouter la nouvelle sélection
                option.classList.add('selected');
                
                // Sauvegarder le choix
                this.formData.cycle = option.dataset.cycle;
                
                // Mettre à jour le bouton suivant
                this.updateNextButton();
            });
        });
    }

    updateNextButton() {
        const nextButton = document.querySelector('.btn-next');
        if (this.formData.cycle) {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
        } else {
            nextButton.disabled = true;
            nextButton.style.opacity = '0.6';
        }
    }

    setupParentTabs() {
        const parentTabs = document.querySelectorAll('.parent-tab');
        const parentForms = document.querySelectorAll('.parent-form');

        parentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const parent = tab.dataset.parent;

                // Mettre à jour les onglets actifs
                parentTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Afficher le formulaire correspondant
                parentForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${parent}Form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }

    setupFormValidation() {
        const form = document.getElementById('inscriptionForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }

    setupRealTimeValidation() {
        // Validation en temps réel pour tous les champs
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });

        // Validation automatique de la date de naissance
        const dateNaissance = document.getElementById('enfantDateNaissance');
        if (dateNaissance) {
            dateNaissance.addEventListener('change', () => {
                this.validateAge(dateNaissance.value);
            });
        }
    }

    validateAge(dateNaissance) {
        const birthDate = new Date(dateNaissance);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        // Vérifier l'âge en fonction du cycle sélectionné
        if (this.formData.cycle === 'maternelle' && (age < 3 || age > 5)) {
            this.showNotification('L\'âge doit être entre 3 et 5 ans pour la maternelle', 'warning');
        } else if (this.formData.cycle === 'primaire' && (age < 6 || age > 12)) {
            this.showNotification('L\'âge doit être entre 6 et 12 ans pour le primaire', 'warning');
        }
    }

    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        } else if (field.type === 'email' && field.value) {
            if (!this.isValidEmail(field.value)) {
                isValid = false;
                errorMessage = 'Adresse email invalide';
            }
        } else if (field.type === 'tel' && field.value) {
            if (!this.isValidPhone(field.value)) {
                isValid = false;
                errorMessage = 'Numéro de téléphone invalide';
            }
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

    scrollToFirstError(container) {
        const firstError = container.querySelector('.field-error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    saveStepData(step) {
        const stepElement = document.getElementById(`step${step}`);
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.name) {
                this.formData[input.name] = input.value;
            }
        });

        // Sauvegarder dans le localStorage
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem('inscriptionData', JSON.stringify(this.formData));
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('inscriptionData');
        if (savedData) {
            this.formData = JSON.parse(savedData);
            this.populateFormFromData();
        }
    }

    populateFormFromData() {
        // Remplir les champs avec les données sauvegardées
        for (const [key, value] of Object.entries(this.formData)) {
            const field = document.querySelector(`[name="${key}"]`);
            if (field && value) {
                field.value = value;
            }
        }

        // Restaurer la sélection du cycle
        if (this.formData.cycle) {
            const cycleOption = document.querySelector(`[data-cycle="${this.formData.cycle}"]`);
            if (cycleOption) {
                cycleOption.classList.add('selected');
                this.updateNextButton();
            }
        }
    }

    async handleFormSubmission(form) {
        // Validation finale
        if (!this.validateStep(4)) {
            this.showNotification('Veuillez corriger les erreurs avant validation', 'error');
            return;
        }

        // Vérifier l'acceptation des conditions
        const acceptConditions = document.getElementById('acceptConditions');
        const acceptContact = document.getElementById('acceptContact');

        if (!acceptConditions.checked || !acceptContact.checked) {
            this.showNotification('Veuillez accepter les conditions générales', 'error');
            return;
        }

        // Afficher le loader
        this.showLoader();

        try {
            // Envoyer les données
            await this.sendInscriptionData();
            
            // Afficher la confirmation
            this.showConfirmation();
            
            // Nettoyer le localStorage
            localStorage.removeItem('inscriptionData');
            
        } catch (error) {
            console.error('Erreur envoi formulaire:', error);
            this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            this.hideLoader();
        }
    }

    async sendInscriptionData() {
        // Préparer les données pour l'envoi
        const submissionData = {
            ...this.formData,
            timestamp: new Date().toISOString(),
            source: 'site_web',
            anneeScolaire: '2025-2026'
        };

        // Simulation d'envoi - À remplacer par votre backend
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Envoi par email
                this.sendEmailNotification(submissionData);
                
                // Envoi par WhatsApp
                this.sendWhatsAppNotification(submissionData);
                
                resolve();
            }, 2000);
        });
    }

    sendEmailNotification(data) {
        const subject = `Nouvelle Inscription - ${data.enfantPrenom} ${data.enfantNom}`;
        const body = `
NOUVELLE INSCRIPTION 2025-2026

👶 INFORMATIONS ENFANT:
Nom: ${data.enfantPrenom} ${data.enfantNom}
Date de naissance: ${data.enfantDateNaissance}
Lieu de naissance: ${data.enfantLieuNaissance}
Genre: ${data.enfantGenre}
Cycle: ${this.getCycleLabel(data.cycle)}

👨‍👩‍👧‍👦 INFORMATIONS PARENTS:
Parent 1: ${data.parent1Prenom} ${data.parent1Nom}
Email: ${data.parent1Email}
Téléphone: ${data.parent1Telephone}
Profession: ${data.parent1Profession}

🏠 ADRESSE:
${data.adresse}
${data.quartier}, ${data.ville}

📅 SOUMIS LE: ${new Date().toLocaleDateString('fr-FR')}
        `.trim();

        const emailUrl = `mailto:lesbullesdejoie@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(emailUrl, '_blank');
    }

    sendWhatsAppNotification(data) {
        const message = `
📝 NOUVELLE INSCRIPTION SITE WEB

👶 ${data.enfantPrenom} ${data.enfantNom}
🎂 ${new Date(data.enfantDateNaissance).toLocaleDateString('fr-FR')}
🏫 ${this.getCycleLabel(data.cycle)}

📞 ${data.parent1Telephone}
📧 ${data.parent1Email}

📍 ${data.quartier}, ${data.ville}

🕒 Reçue le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
        `.trim();

        const whatsappUrl = `https://wa.me/229919652?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    getCycleLabel(cycle) {
        const cycles = {
            'creche': 'Crèche & Garderie',
            'maternelle': 'Maternelle Bilingue',
            'primaire': 'Primaire Bilingue'
        };
        return cycles[cycle] || 'Non spécifié';
    }

    updateSummary() {
        this.updateCycleSummary();
        this.updateEnfantSummary();
        this.updateParentsSummary();
        this.updateAdresseSummary();
    }

    updateCycleSummary() {
        const container = document.getElementById('summaryCycle');
        if (container && this.formData.cycle) {
            container.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Cycle</span>
                    <span class="summary-value">${this.getCycleLabel(this.formData.cycle)}</span>
                </div>
            `;
        }
    }

    updateEnfantSummary() {
        const container = document.getElementById('summaryEnfant');
        if (container) {
            container.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Nom complet</span>
                    <span class="summary-value">${this.formData.enfantPrenom || ''} ${this.formData.enfantNom || ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Date de naissance</span>
                    <span class="summary-value">${this.formData.enfantDateNaissance ? new Date(this.formData.enfantDateNaissance).toLocaleDateString('fr-FR') : ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Lieu de naissance</span>
                    <span class="summary-value">${this.formData.enfantLieuNaissance || ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Genre</span>
                    <span class="summary-value">${this.formData.enfantGenre === 'garcon' ? 'Garçon' : this.formData.enfantGenre === 'fille' ? 'Fille' : ''}</span>
                </div>
            `;
        }
    }

    updateParentsSummary() {
        const container = document.getElementById('summaryParents');
        if (container) {
            let html = `
                <div class="summary-item">
                    <span class="summary-label">Parent 1</span>
                    <span class="summary-value">${this.formData.parent1Prenom || ''} ${this.formData.parent1Nom || ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Téléphone</span>
                    <span class="summary-value">${this.formData.parent1Telephone || ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Email</span>
                    <span class="summary-value">${this.formData.parent1Email || ''}</span>
                </div>
            `;

            if (this.formData.parent2Nom) {
                html += `
                    <div class="summary-item">
                        <span class="summary-label">Parent 2</span>
                        <span class="summary-value">${this.formData.parent2Prenom || ''} ${this.formData.parent2Nom || ''}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Téléphone</span>
                        <span class="summary-value">${this.formData.parent2Telephone || ''}</span>
                    </div>
                `;
            }

            container.innerHTML = html;
        }
    }

    updateAdresseSummary() {
        const container = document.getElementById('summaryAdresse');
        if (container) {
            container.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Adresse</span>
                    <span class="summary-value">${this.formData.adresse || ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Quartier</span>
                    <span class="summary-value">${this.formData.quartier || ''}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Ville</span>
                    <span class="summary-value">${this.formData.ville || ''}</span>
                </div>
            `;
        }
    }

    showLoader() {
        const submitButton = document.querySelector('#inscriptionForm button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Traitement en cours...
        `;
        submitButton.disabled = true;
        
        submitButton.dataset.originalContent = originalText;
    }

    hideLoader() {
        const submitButton = document.querySelector('#inscriptionForm button[type="submit"]');
        const originalContent = submitButton.dataset.originalContent;
        
        if (originalContent) {
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
        }
    }

    showConfirmation() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Fermer les autres items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Basculer l'item actuel
                item.classList.toggle('active');
            });
        });
    }

    showNotification(message, type = 'info') {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Fonctions globales
window.closeModal = () => {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        window.location.href = 'index.html';
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.inscriptionSystem = new InscriptionSystem();
});