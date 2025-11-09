// contact.js - Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(this);
            const data = {
                nom: formData.get('nom'),
                email: formData.get('email'),
                telephone: formData.get('telephone'),
                message: formData.get('message')
            };
            
            // Validation
            if (validateForm(data)) {
                sendContactMessage(data);
            }
        });
    }
}

function validateForm(data) {
    // Validation basique
    if (!data.nom || !data.email || !data.message) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendContactMessage(data) {
    // Envoi par WhatsApp
    const whatsappMessage = `
Nouveau message de ${data.nom}:
📧 Email: ${data.email}
📞 Téléphone: ${data.telephone || 'Non renseigné'}
💬 Message: ${data.message}
    `.trim();
    
    const whatsappUrl = `https://wa.me/22997919452?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Envoi par email (simulation)
    const emailSubject = `Nouveau message de ${data.nom} - Les Bulles de Joie`;
    const emailBody = `
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}

Message:
${data.message}
    `.trim();
    
    const emailUrl = `mailto:sananuel30@yahoo.fr?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Ouvrir le client email
    setTimeout(() => {
        window.open(emailUrl, '_blank');
    }, 1000);
    
    // Afficher confirmation
    showNotification('Votre message a été envoyé avec succès!', 'success');
    
    // Réinitialiser le formulaire
    document.getElementById('contactForm').reset();
}

function showNotification(message, type = 'success') {
    if (window.schoolWebsite) {
        window.schoolWebsite.showNotification(message, type);
    } else {
        alert(message);
    }
}