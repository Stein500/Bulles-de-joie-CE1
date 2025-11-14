class InscriptionSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        this.setupFormValidation();
    }

    setupEventListeners() {
        const form = document.getElementById('inscriptionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Validation en temps réel
        this.setupRealTimeValidation();
    }

    setupFormValidation() {
        // Ajouter la validation HTML5 personnalisée
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    setupRealTimeValidation() {
        const emailInput = document.getElementById('parent_email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.validateEmail(emailInput);
            });
        }

        const phoneInput = document.getElementById('parent_telephone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                this.formatPhoneNumber(phoneInput);
            });
        }
    }

    nextStep(step) {
        if (!this.validateStep(this.currentStep)) {
            this.showError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        this.saveStepData(this.currentStep);
        this.hideStep(this.currentStep);
        this.showStep(step);
        this.currentStep = step;
        this.updateProgress();
        
        // Animation de transition
        this.animateStepTransition();
    }

    previousStep(step) {
        this.hideStep(this.currentStep);
        this.showStep(step);
        this.currentStep = step;
        this.updateProgress();
        this.animateStepTransition();
    }

    showStep(step) {
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
            
            // Si c'est l'étape de confirmation, mettre à jour l'aperçu
            if (step === 4) {
                this.updateFormPreview();
            }
        }
    }

    hideStep(step) {
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) {
            stepElement.classList.remove('active');
        }
    }

    animateStepTransition() {
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => {
            step.style.transform = 'translateX(20px)';
            step.style.opacity = '0';
            
            setTimeout(() => {
                step.style.transform = 'translateX(0)';
                step.style.opacity = '1';
            }, 50);
        });
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        // Mettre à jour les indicateurs d'étape
        this.updateStepIndicators();
    }

    updateStepIndicators() {
        const indicators = document.querySelectorAll('.step-indicator');
        indicators.forEach((indicator, index) => {
            if (index < this.currentStep) {
                indicator.classList.add('completed');
            } else if (index === this.currentStep - 1) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
    }

    validateStep(step) {
        const stepElement = document.getElementById(`step${step}`);
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Réinitialiser le style d'erreur
        this.clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            this.markFieldAsError(field, 'Ce champ est obligatoire');
            isValid = false;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.markFieldAsError(field, 'Veuillez entrer un email valide');
            isValid = false;
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.markFieldAsError(field, 'Veuillez entrer un numéro de téléphone valide');
            isValid = false;
        } else if (field.type === 'date' && value && !this.isValidDate(value)) {
            this.markFieldAsError(field, 'Veuillez entrer une date valide');
            isValid = false;
        }

        if (isValid) {
            this.markFieldAsValid(field);
        }

        return isValid;
    }

    validateEmail(emailInput) {
        const value = emailInput.value.trim();
        if (value && !this.isValidEmail(value)) {
            this.markFieldAsError(emailInput, 'Format d\'email invalide');
            return false;
        }
        return true;
    }

    formatPhoneNumber(phoneInput) {
        let value = phoneInput.value.replace(/\D/g, '');
        
        if (value.startsWith('229')) {
            value = value.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        } else if (value.length >= 8) {
            value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        }
        
        phoneInput.value = value;
    }

    markFieldAsError(field, message) {
        field.style.borderColor = 'var(--rose-fonce)';
        field.style.boxShadow = '0 0 0 2px rgba(225, 29, 72, 0.1)';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    markFieldAsValid(field) {
        field.style.borderColor = 'var(--vert-citron)';
        field.style.boxShadow = '0 0 0 2px rgba(233, 255, 112, 0.1)';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^(\+229|229)?\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    saveStepData(step) {
        const stepElement = document.getElementById(`step${step}`);
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.name) {
                this.formData[input.name] = input.value;
            }
        });
    }

    updateFormPreview() {
        const previewContainer = document.getElementById('formPreview');
        if (!previewContainer) return;

        let previewHTML = '';

        // Informations enfant
        if (this.formData.enfant_nom) {
            previewHTML += `
                <div class="preview-section">
                    <h5>Informations de l'enfant</h5>
                    <div class="preview-item">
                        <span>Nom complet:</span>
                        <span>${this.formData.enfant_prenom} ${this.formData.enfant_nom}</span>
                    </div>
                    <div class="preview-item">
                        <span>Date de naissance:</span>
                        <span>${this.formatDate(this.formData.enfant_naissance)}</span>
                    </div>
                    <div class="preview-item">
                        <span>Sexe:</span>
                        <span>${this.formData.enfant_sexe}</span>
                    </div>
                </div>
            `;
        }

        // Informations parents
        if (this.formData.parent_nom) {
            previewHTML += `
                <div class="preview-section">
                    <h5>Informations des parents</h5>
                    <div class="preview-item">
                        <span>Parent:</span>
                        <span>${this.formData.parent_prenom} ${this.formData.parent_nom}</span>
                    </div>
                    <div class="preview-item">
                        <span>Email:</span>
                        <span>${this.formData.parent_email}</span>
                    </div>
                    <div class="preview-item">
                        <span>Téléphone:</span>
                        <span>${this.formData.parent_telephone}</span>
                    </div>
                </div>
            `;
        }

        // Choix de la classe
        if (this.formData.classe) {
            const classeLabels = {
                'creche': 'Crèche & Garderie (2 mois - 3 ans)',
                'maternelle': 'Maternelle Bilingue (3-5 ans)',
                'primaire': 'Primaire Bilingue (6-12 ans)'
            };

            previewHTML += `
                <div class="preview-section">
                    <h5>Choix de scolarisation</h5>
                    <div class="preview-item">
                        <span>Classe:</span>
                        <span>${classeLabels[this.formData.classe] || this.formData.classe}</span>
                    </div>
                    <div class="preview-item">
                        <span>Rentrée:</span>
                        <span>${this.formData.rentree}</span>
                    </div>
                </div>
            `;
        }

        previewContainer.innerHTML = previewHTML;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    async handleFormSubmission() {
        if (!this.validateStep(4)) {
            this.showError('Veuillez accepter les conditions générales');
            return;
        }

        // Sauvegarder les données de la dernière étape
        this.saveStepData(4);

        try {
            // Afficher l'indicateur de chargement
            this.showLoading(true);

            // Envoyer les données
            await this.sendInscriptionData();

            // Afficher le succès
            this.showSuccess();
            
            // Réinitialiser le formulaire
            this.resetForm();

        } catch (error) {
            this.showError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            console.error('Erreur d\'inscription:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async sendInscriptionData() {
        // Préparer le message pour WhatsApp
        const whatsappMessage = this.generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/229919652?text=${encodeURIComponent(whatsappMessage)}`;

        // Préparer l'email
        const emailSubject = `Nouvelle inscription - ${this.formData.enfant_prenom} ${this.formData.enfant_nom}`;
        const emailBody = this.generateEmailBody();
        const emailUrl = `mailto:lesbullesdejoie@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        // Ouvrir WhatsApp
        window.open(whatsappUrl, '_blank');

        // Ouvrir le client email après un délai
        setTimeout(() => {
            window.open(emailUrl, '_blank');
        }, 1000);

        // Simuler un envoi réussi
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    generateWhatsAppMessage() {
        const classeLabels = {
            'creche': 'Crèche & Garderie',
            'maternelle': 'Maternelle Bilingue', 
            'primaire': 'Primaire Bilingue'
        };

        return `
Nouvelle demande d'inscription - Les Bulles de Joie

👶 ENFANT:
• Nom: ${this.formData.enfant_nom}
• Prénom: ${this.formData.enfant_prenom}
• Date de naissance: ${this.formatDate(this.formData.enfant_naissance)}
• Lieu de naissance: ${this.formData.enfant_lieu_naissance || 'Non renseigné'}
• Sexe: ${this.formData.enfant_sexe}
• Nationalité: ${this.formData.enfant_nationalite || 'Non renseignée'}

👨‍👩‍👧‍👦 PARENTS:
• Nom: ${this.formData.parent_nom}
• Prénom: ${this.formData.parent_prenom}
• Email: ${this.formData.parent_email}
• Téléphone: ${this.formData.parent_telephone}
• Adresse: ${this.formData.parent_adresse || 'Non renseignée'}
• Profession: ${this.formData.parent_profession || 'Non renseignée'}

🎓 SCOLARITÉ:
• Classe souhaitée: ${classeLabels[this.formData.classe]}
• Rentrée: ${this.formData.rentree}

📋 INFORMATIONS:
• Date de soumission: ${new Date().toLocaleDateString('fr-FR')}
• Heure: ${new Date().toLocaleTimeString('fr-FR')}

Merci de prendre contact avec cette famille pour finaliser l'inscription.
        `.trim();
    }

    generateEmailBody() {
        return this.generateWhatsAppMessage();
    }

    showLoading(show) {
        const submitButton = document.querySelector('#step4 button[type="submit"]');
        if (submitButton) {
            if (show) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                submitButton.disabled = true;
            } else {
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Finaliser l\'inscription';
                submitButton.disabled = false;
            }
        }
    }

    showSuccess() {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification('Votre demande d\'inscription a été envoyée avec succès ! Nous vous contacterons rapidement.', 'success');
        }

        // Animation de célébration
        if (window.particleSystem) {
            window.particleSystem.createBurst(
                window.innerWidth / 2,
                window.innerHeight / 2,
                50
            );
        }

        // Redirection après succès
        setTimeout(() => {
            window.location.href = 'contact.html?inscription=success';
        }, 3000);
    }

    showError(message) {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, 'error');
        }
    }

    resetForm() {
        const form = document.getElementById('inscriptionForm');
        if (form) {
            form.reset();
        }
        
        this.formData = {};
        this.currentStep = 1;
        this.updateProgress();
        
        // Revenir à la première étape
        this.hideStep(4);
        this.showStep(1);
    }
}

// CSS pour le formulaire d'inscription
const inscriptionStyle = document.createElement('style');
inscriptionStyle.textContent = `
    .inscription-stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }

    .stat-card {
        text-align: center;
        background: rgba(255,255,255,0.2);
        padding: 1.5rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        min-width: 120px;
    }

    .stat-card .stat-number {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .step-indicators {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
    }

    .step-indicator {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        background: var(--rose-pale);
        color: var(--gris);
        font-size: 0.9rem;
        transition: var(--transition-smooth);
    }

    .step-indicator.active {
        background: var(--gradient-rose);
        color: white;
    }

    .step-indicator.completed {
        background: var(--vert-citron);
        color: var(--noir);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin: 1.5rem 0;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--noir);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid var(--rose-pale);
        border-radius: 10px;
        font-size: 1rem;
        transition: var(--transition-smooth);
        background: white;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        border-color: var(--rose-fuchsia);
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 0, 255, 0.1);
    }

    .checkbox-group {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin: 1rem 0;
    }

    .checkbox-group input[type="checkbox"] {
        width: auto;
        margin-top: 0.25rem;
    }

    .checkbox-group label {
        margin-bottom: 0;
        font-weight: normal;
        line-height: 1.4;
    }

    .class-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1.5rem 0;
    }

    .class-option {
        position: relative;
    }

    .class-option input[type="radio"] {
        position: absolute;
        opacity: 0;
    }

    .class-option label {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: white;
        border: 2px solid var(--rose-pale);
        border-radius: 15px;
        cursor: pointer;
        transition: var(--transition-smooth);
    }

    .class-option input[type="radio"]:checked + label {
        border-color: var(--rose-fuchsia);
        background: var(--rose-pale);
    }

    .class-option label:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-soft);
    }

    .class-icon {
        font-size: 2.5rem;
    }

    .class-info h4 {
        margin: 0 0 0.25rem 0;
        color: var(--noir);
    }

    .class-info p {
        margin: 0;
        color: var(--rose-fuchsia);
        font-weight: 600;
    }

    .class-info small {
        color: var(--gris);
    }

    .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .document-card {
        text-align: center;
        padding: 2rem 1rem;
        background: white;
        border-radius: 15px;
        box-shadow: var(--shadow-soft);
    }

    .doc-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .preview-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.3);
    }

    .preview-section:last-child {
        border-bottom: none;
    }

    .preview-section h5 {
        margin: 0 0 1rem 0;
        color: white;
        font-size: 1.1rem;
    }

    .field-error {
        color: var(--rose-fonce);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: none;
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .class-option label {
            flex-direction: column;
            text-align: center;
        }
        
        .step-indicators {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .step-indicator {
            text-align: center;
        }
    }
`;
document.head.appendChild(inscriptionStyle);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.inscriptionSystem = new InscriptionSystem();
});