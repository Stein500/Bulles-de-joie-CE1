class ActivitiesSystem {
    constructor() {
        this.currentCategory = 'all';
        this.galleryItems = [];
        this.init();
    }

    init() {
        this.setupCategoryFilters();
        this.loadGalleryItems();
        this.setupInteractiveGallery();
        this.initializeActivityCalendar();
    }

    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.category-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterActivities(category);
                
                // Mettre à jour les boutons actifs
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterActivities(category) {
        this.currentCategory = category;
        const activities = document.querySelectorAll('.activity-card');
        
        activities.forEach(activity => {
            if (category === 'all' || activity.dataset.category === category) {
                activity.style.display = 'block';
                setTimeout(() => {
                    activity.style.opacity = '1';
                    activity.style.transform = 'translateY(0)';
                }, 100);
            } else {
                activity.style.opacity = '0';
                activity.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    activity.style.display = 'none';
                }, 300);
            }
        });
    }

    loadGalleryItems() {
        // Données simulées pour la galerie
        this.galleryItems = [
            { id: 1, category: 'oratory', title: 'Concours d\'éloquence', image: '🎤', date: '2024-03-15' },
            { id: 2, category: 'gardening', title: 'Récolte du potager', image: '🌱', date: '2024-03-10' },
            { id: 3, category: 'music', title: 'Concert de printemps', image: '🎵', date: '2024-03-08' },
            { id: 4, category: 'dance', title: 'Spectacle de danse', image: '💃', date: '2024-03-05' },
            { id: 5, category: 'english', title: 'Pièce de théâtre en anglais', image: '🇬🇧', date: '2024-02-28' },
            { id: 6, category: 'creativity', title: 'Exposition d\'arts plastiques', image: '🎨', date: '2024-02-25' }
        ];
    }

    setupInteractiveGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.showGalleryModal(index);
            });
            
            // Animation au survol
            item.addEventListener('mouseenter', () => {
                this.animateGalleryItem(item);
            });
        });
    }

    animateGalleryItem(item) {
        item.style.transform = 'scale(1.05) rotate(2deg)';
        setTimeout(() => {
            item.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }

    showGalleryModal(index) {
        const item = this.galleryItems[index];
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <div class="modal-icon">${item.image}</div>
                    <h3>${item.title}</h3>
                </div>
                <div class="modal-body">
                    <p>Activité réalisée le ${new Date(item.date).toLocaleDateString('fr-FR')}</p>
                    <div class="activity-description">
                        ${this.generateActivityDescription(item.category)}
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="activitiesSystem.shareActivity(${item.id})">
                        <i class="fas fa-share"></i> Partager
                    </button>
                    <button class="btn btn-primary" onclick="activitiesSystem.downloadCertificate(${item.id})">
                        <i class="fas fa-download"></i> Certificat
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animation d'entrée
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);

        // Fermeture de la modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    }

    generateActivityDescription(category) {
        const descriptions = {
            'oratory': 'Les enfants ont participé à un concours d\'éloquence où ils ont pu exprimer leurs idées avec confiance et conviction. Cet atelier développe la prise de parole en public et l\'aisance orale.',
            'gardening': 'Récolte des légumes du potager pédagogique. Les enfants ont appris le cycle des plantes et l\'importance de l\'agriculture durable.',
            'music': 'Concert de printemps mettant en valeur les talents musicaux de nos élèves. Chants, percussions et découvertes instrumentales.',
            'dance': 'Spectacle de danse mettant en scène la créativité et l\'expression corporelle des enfants à travers différentes chorégraphies.',
            'english': 'Pièce de théâtre entièrement jouée en anglais, démontrant les progrès linguistiques remarquables de nos élèves.',
            'creativity': 'Exposition présentant les œuvres artistiques créées par les enfants lors des ateliers d\'arts plastiques.'
        };
        
        return descriptions[category] || 'Activité parascolaire des Bulles de Joie.';
    }

    showFullGallery() {
        const modal = document.createElement('div');
        modal.className = 'full-gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>Galerie Complète des Activités</h3>
                <div class="gallery-grid-modal">
                    ${this.galleryItems.map(item => `
                        <div class="gallery-item-modal" data-category="${item.category}">
                            <div class="gallery-icon">${item.image}</div>
                            <div class="gallery-info">
                                <h4>${item.title}</h4>
                                <span class="gallery-date">${new Date(item.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animation d'entrée
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);

        // Fermeture
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });

        // Clic sur les éléments de la galerie
        modal.querySelectorAll('.gallery-item-modal').forEach((item, index) => {
            item.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    this.showGalleryModal(index);
                }, 300);
            });
        });
    }

    initializeActivityCalendar() {
        // Initialiser un calendrier des activités
        this.setupActivityCalendar();
    }

    setupActivityCalendar() {
        const calendarContainer = document.getElementById('activityCalendar');
        if (!calendarContainer) return;

        // Générer un calendrier simple des activités
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        this.generateCalendar(month, year, calendarContainer);
    }

    generateCalendar(month, year, container) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let calendarHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" onclick="activitiesSystem.previousMonth()">&lt;</button>
                <h4>${this.getMonthName(month)} ${year}</h4>
                <button class="calendar-nav" onclick="activitiesSystem.nextMonth()">&gt;</button>
            </div>
            <div class="calendar-grid">
        `;

        // Jours de la semaine
        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        weekdays.forEach(day => {
            calendarHTML += `<div class="calendar-weekday">${day}</div>`;
        });

        // Cases vides pour le premier jour
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarHTML += `<div class="calendar-day empty"></div>`;
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const hasActivity = this.hasActivityOnDate(year, month, day);
            calendarHTML += `
                <div class="calendar-day ${hasActivity ? 'has-activity' : ''}">
                    ${day}
                    ${hasActivity ? '<div class="activity-dot"></div>' : ''}
                </div>
            `;
        }

        calendarHTML += `</div>`;
        container.innerHTML = calendarHTML;
    }

    hasActivityOnDate(year, month, day) {
        // Simuler des activités certains jours
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        
        // Activités les mercredis et vendredis
        return dayOfWeek === 3 || dayOfWeek === 5; // Mercredi = 3, Vendredi = 5
    }

    getMonthName(month) {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return months[month];
    }

    previousMonth() {
        // Navigation dans le calendrier
        console.log('Mois précédent');
    }

    nextMonth() {
        // Navigation dans le calendrier
        console.log('Mois suivant');
    }

    shareActivity(activityId) {
        const activity = this.galleryItems.find(item => item.id === activityId);
        if (navigator.share) {
            navigator.share({
                title: activity.title,
                text: `Découvrez cette activité aux Bulles de Joie : ${activity.title}`,
                url: window.location.href
            });
        } else {
            // Fallback pour les navigateurs qui ne supportent pas l'API Share
            prompt('Partagez ce lien :', window.location.href);
        }
    }

    downloadCertificate(activityId) {
        // Simulation de téléchargement de certificat
        this.showNotification('Génération du certificat en cours...', 'success');
        
        setTimeout(() => {
            this.showNotification('Certificat téléchargé avec succès !', 'success');
            
            // Animation de confetti pour célébrer
            if (window.particleSystem) {
                window.particleSystem.createBurst(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    30
                );
            }
        }, 2000);
    }

    showNotification(message, type = 'success') {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// CSS pour la galerie modale
const activitiesStyle = document.createElement('style');
activitiesStyle.textContent = `
    .gallery-modal, .full-gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .gallery-modal.active, .full-gallery-modal.active {
        opacity: 1;
    }

    .gallery-modal .modal-content,
    .full-gallery-modal .modal-content {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }

    .gallery-modal.active .modal-content,
    .full-gallery-modal.active .modal-content {
        transform: scale(1);
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--gris);
    }

    .modal-header {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .modal-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .activity-description {
        line-height: 1.6;
        color: var(--gris);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        justify-content: center;
    }

    .gallery-grid-modal {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .gallery-item-modal {
        background: var(--rose-pale);
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        cursor: pointer;
        transition: var(--transition-smooth);
    }

    .gallery-item-modal:hover {
        transform: translateY(-5px);
        background: var(--gradient-rose);
        color: white;
    }

    .gallery-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .calendar-nav {
        background: var(--rose-pale);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 10px;
        cursor: pointer;
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
    }

    .calendar-weekday {
        text-align: center;
        font-weight: bold;
        color: var(--rose-fuchsia);
        padding: 0.5rem;
    }

    .calendar-day {
        text-align: center;
        padding: 0.5rem;
        border-radius: 10px;
        position: relative;
    }

    .calendar-day.has-activity {
        background: var(--rose-pale);
    }

    .activity-dot {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 6px;
        height: 6px;
        background: var(--rose-fuchsia);
        border-radius: 50%;
    }
`;
document.head.appendChild(activitiesStyle);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.activitiesSystem = new ActivitiesSystem();
});