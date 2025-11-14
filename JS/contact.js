// contact.js - Gestion du formulaire de contact avec nouveaux numéros
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
                sujet: formData.get('sujet'),
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
    // Envoi par WhatsApp (Direction)
    const whatsappMessage = `
Nouveau message de ${data.nom}:
📧 Email: ${data.email}
📞 Téléphone: ${data.telephone || 'Non renseigné'}
🎯 Sujet: ${getSujetLabel(data.sujet)}
💬 Message: ${data.message}
    `.trim();
    
    const whatsappUrl = `https://wa.me/229919652?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Envoi par email
    const emailSubject = `Nouveau message de ${data.nom} - ${getSujetLabel(data.sujet)} - Les Bulles de Joie`;
    const emailBody = `
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Sujet: ${getSujetLabel(data.sujet)}

Message:
${data.message}
    `.trim();
    
    const emailUrl = `mailto:lesbullesdejoie@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Ouvrir le client email après un délai
    setTimeout(() => {
        window.open(emailUrl, '_blank');
    }, 1000);
    
    // Afficher confirmation
    showNotification('Votre message a été envoyé avec succès! Nous vous répondrons rapidement.', 'success');
    
    // Réinitialiser le formulaire
    document.getElementById('contactForm').reset();
}

function getSujetLabel(sujet) {
    const sujets = {
        'information': 'Information générale',
        'inscription': 'Inscription',
        'pedagogie': 'Question pédagogique',
        'urgence': 'Urgence',
        'autre': 'Autre'
    };
    return sujets[sujet] || 'Information générale';
}

function showNotification(message, type = 'success') {
    if (window.schoolWebsite) {
        window.schoolWebsite.showNotification(message, type);
    } else {
        // Fallback simple
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Fonctions pour les boutons de contact rapide
function openWhatsAppDirection() {
    const message = "Bonjour, je souhaite prendre contact avec Les Bulles de Joie.";
    const url = `https://wa.me/229919652?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openWhatsAppSecretariat() {
    const message = "Bonjour, je souhaite prendre un rendez-vous avec Les Bulles de Joie.";
    const url = `https://wa.me/22958830303?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openEmail() {
    const subject = "Prise de contact - Les Bulles de Joie";
    const body = "Bonjour,\n\nJe souhaite prendre contact avec vous concernant...";
    const url = `mailto:lesbullesdejoie@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
}

function openMaps() {
    const address = "Zongo, Parakou, Bénin";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}
