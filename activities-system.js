class ActivitiesSystem {
    constructor() {
        this.currentCategory = 'all';
        this.currentGallery = 'all';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.galleryItems = [];
        this.activitiesData = [];
        this.initialize();
    }

    async initialize() {
        await this.loadActivitiesData();
        this.setupCategoryFilters();
        this.setupGallery();
        this.initializeCalendar();
        this.setupModalSystem();
        this.setupInteractiveElements();
    }

    async loadActivitiesData() {
        // Données des activités
        this.activitiesData = [
            {
                id: 1,
                category: 'oratory',
                title: 'Art Oratoire',
                description: 'Développement de la prise de parole, confiance et éloquence à travers des exercices ludiques.',
                ageRange: '5-12 ans',
                duration: '2h/semaine',
                skills: ['Confiance', 'Éloquence', 'Écoute'],
                features: [
                    'Concours d\'éloquence mensuels',
                    'Exercices d\'improvisation',
                    'Présentations publiques',
                    'Techniques de respiration'
                ],
                benefits: [
                    'Améliore l\'expression orale',
                    'Développe la confiance en soi',
                    'Favorise l\'écoute active',
                    'Prépare aux présentations'
                ],
                schedule: [
                    { day: 'Lundi', time: '15h-17h', group: 'Débutants' },
                    { day: 'Mercredi', time: '14h-16h', group: 'Avancés' }
                ]
            },
            {
                id: 2,
                category: 'gardening',
                title: 'Jardinage Pédagogique',
                description: 'Éveil à la nature et responsabilité environnementale dans notre potager éducatif.',
                ageRange: '3-12 ans',
                duration: '1h/semaine',
                skills: ['Patience', 'Responsabilité', 'Écologie'],
                features: [
                    'Potager biologique',
                    'Compostage éducatif',
                    'Cycle des plantes',
                    'Récoltes saisonnières'
                ],
                benefits: [
                    'Connexion à la nature',
                    'Apprentissage de la patience',
                    'Responsabilité environnementale',
                    'Alimentation saine'
                ],
                schedule: [
                    { day: 'Mardi', time: '15h-16h', group: 'Tous niveaux' },
                    { day: 'Jeudi', time: '15h-16h', group: 'Tous niveaux' }
                ]
            },
            {
                id: 3,
                category: 'music',
                title: 'Éveil Musical',
                description: 'Exploration des sons, rythmes et instruments pour développer la sensibilité artistique.',
                ageRange: '2-12 ans',
                duration: '3h/semaine',
                skills: ['Rythme', 'Coordination', 'Créativité'],
                features: [
                    'Percussions et instruments',
                    'Chorale enfantine',
                    'Éveil sonore',
                    'Création musicale'
                ],
                benefits: [
                    'Développe l\'oreille musicale',
                    'Améliore la coordination',
                    'Stimule la créativité',
                    'Favorise l\'expression'
                ],
                schedule: [
                    { day: 'Lundi', time: '16h-17h', group: 'Éveil' },
                    { day: 'Mercredi', time: '10h-12h', group: 'Pratique' },
                    { day: 'Vendredi', time: '16h-17h', group: 'Chorale' }
                ]
            },
            {
                id: 4,
                category: 'dance',
                title: 'Expression Corporelle',
                description: 'Danse et mouvement pour développer coordination, créativité et expression personnelle.',
                ageRange: '3-12 ans',
                duration: '2h/semaine',
                skills: ['Coordination', 'Créativité', 'Expression'],
                features: [
                    'Danse créative',
                    'Expression corporelle',
                    'Chorégraphies',
                    'Spectacles annuels'
                ],
                benefits: [
                    'Améliore la coordination',
                    'Développe la créativité',
                    'Renforce la confiance',
                    'Favorise l\'expression'
                ],
                schedule: [
                    { day: 'Mardi', time: '16h-17h', group: 'Initiation' },
                    { day: 'Jeudi', time: '16h-17h', group: 'Avancé' }
                ]
            },
            {
                id: 5,
                category: 'english',
                title: 'Immersion Anglaise',
                description: 'Apprentissage naturel de l\'anglais par immersion et activités ludiques quotidiennes.',
                ageRange: '2-12 ans',
                duration: '10h/semaine',
                skills: ['Communication', 'Vocabulaire', 'Confiance'],
                features: [
                    'Immersion quotidienne',
                    'Activités ludiques',
                    'Conversation naturelle',
                    'Projets créatifs'
                ],
                benefits: [
                    'Bilinguisme naturel',
                    'Confiance linguistique',
                    'Ouverture culturelle',
                    'Préparation internationale'
                ],
                schedule: [
                    { day: 'Lundi-Vendredi', time: 'Intégré', group: 'Tous niveaux' }
                ]
            },
            {
                id: 6,
                category: 'creativity',
                title: 'Ateliers Créatifs',
                description: 'Exploration artistique à travers peinture, modelage, collage et techniques mixtes.',
                ageRange: '2-12 ans',
                duration: '2h/semaine',
                skills: ['Créativité', 'Motricité', 'Imagination'],
                features: [
                    'Peinture et dessin',
                    'Modelage argile',
                    'Collage créatif',
                    'Techniques mixtes'
                ],
                benefits: [
                    'Développe la créativité',
                    'Améliore la motricité fine',
                    'Stimule l\'imagination',
                    'Favorise l\'expression'
                ],
                schedule: [
                    { day: 'Mercredi', time: '14h-16h', group: 'Multi-âges' },
                    { day: 'Samedi', time: '10h-12h', group: 'Projets' }
                ]
            }
        ];

        // Données de la galerie
        this.galleryItems = [
            {
                id: 1,
                category: 'oratory',
                title: 'Concours d\'Éloquence',
                image: '🎤',
                date: '2024-03-15',
                description: 'Nos jeunes orateurs ont impressionné par leur aisance et leur conviction lors du concours trimestriel.'
            },
            {
                id: 2,
                category: 'gardening',
                title: 'Récolte du Potager',
                image: '🌱',
                date: '2024-03-10',
                description: 'Les enfants récoltent les légumes qu\'ils ont cultivés avec amour tout au long de la saison.'
            },
            {
                id: 3,
                category: 'music',
                title: 'Concert de Printemps',
                image: '🎵',
                date: '2024-03-08',
                description: 'Spectacle musical mettant en valeur les talents de nos jeunes musiciens en herbe.'
            },
            {
                id: 4,
                category: 'dance',
                title: 'Spectacle de Danse',
                image: '💃',
                date: '2024-03-05',
                description: 'Expression corporelle et chorégraphies créatives présentées devant les parents.'
            },
            {
                id: 5,
                category: 'english',
                title: 'Théâtre en Anglais',
                image: '🇬🇧',
                date: '2024-02-28',
                description: 'Pièce de théâtre entièrement jouée en anglais par nos élèves bilingues.'
            },
            {
                id: 6,
                category: 'creativity',
                title: 'Exposition d\'Arts',
                image: '🎨',
                date: '2024-02-25',
                description: 'Vernissage des œuvres créées lors des ateliers d\'arts plastiques.'
            }
        ];
    }

    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterActivities(category);
                
                // Mise à jour visuelle des boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Animation de transition
                this.animateFilterTransition();
            });
        });
    }

    filterActivities(category) {
        this.currentCategory = category;
        const activities = document.querySelectorAll('.activity-card');
        const container = document.getElementById('activitiesContainer');
        
        // Animation de fade out
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
        
        // Notification discrète
        if (category !== 'all') {
            this.showNotification(`${this.getCategoryName(category)} filtrées`);
        }
    }

    getCategoryName(category) {
        const names = {
            'oratory': 'Art Oratoire',
            'gardening': 'Jardinage',
            'music': 'Musique',
            'dance': 'Danse',
            'english': 'Anglais',
            'creativity': 'Créativité'
        };
        return names[category] || 'Activités';
    }

    setupGallery() {
        this.renderGallery();
        this.setupGalleryFilters();
        this.setupGalleryInteractions();
    }

    renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        const filteredItems = this.currentGallery === 'all' 
            ? this.galleryItems 
            : this.galleryItems.filter(item => item.category === this.currentGallery);
        
        galleryGrid.innerHTML = filteredItems.map(item => `
            <div class="gallery-item" data-item="${item.id}">
                <div class="gallery-icon">${item.image}</div>
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <span>${new Date(item.date).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
        `).join('');
        
        this.setupGalleryItemEvents();
    }

    setupGalleryFilters() {
        const galleryFilters = document.querySelectorAll('.gallery-filter');
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.currentGallery = filter.dataset.gallery;
                
                galleryFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                this.renderGallery();
            });
        });
    }

    setupGalleryItemEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const itemId = parseInt(item.dataset.item);
                this.showGalleryItemDetail(itemId);
            });
        });
    }

    showGalleryItemDetail(itemId) {
        const item = this.galleryItems.find(i => i.id === itemId);
        if (!item) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="gallery-detail">
                <div class="detail-header">
                    <div class="detail-icon">${item.image}</div>
                    <div class="detail-meta">
                        <h2>${item.title}</h2>
                        <span class="detail-date">${new Date(item.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                </div>
                
                <div class="detail-content">
                    <p>${item.description}</p>
                    
                    <div class="detail-actions">
                        <button class="btn-action" onclick="activitiesSystem.shareActivity(${item.id})">
                            <i class="fas fa-share"></i>
                            Partager
                        </button>
                        <button class="btn-action primary" onclick="activitiesSystem.downloadMemory(${item.id})">
                            <i class="fas fa-download"></i>
                            Télécharger
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal();
    }

    initializeCalendar() {
        this.renderCalendar();
        this.setupCalendarNavigation();
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let calendarHTML = '';
        
        // Jours de la semaine
        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        weekdays.forEach(day => {
            calendarHTML += `<div class="calendar-day weekday">${day}</div>`;
        });
        
        // Jours vides au début
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarHTML += `<div class="calendar-day empty"></div>`;
        }
        
        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const activities = this.getActivitiesForDate(this.currentYear, this.currentMonth, day);
            const hasActivity = activities.length > 0;
            const activityTypes = [...new Set(activities.map(a => a.category))];
            
            calendarHTML += `
                <div class="calendar-day ${hasActivity ? 'has-activity' : ''}" 
                     data-date="${this.currentYear}-${this.currentMonth + 1}-${day}">
                    ${day}
                    ${hasActivity ? activityTypes.map(type => 
                        `<div class="activity-dot ${type}"></div>`
                    ).join('') : ''}
                </div>
            `;
        }
        
        calendarGrid.innerHTML = calendarHTML;
        this.setupCalendarDayEvents();
    }

    getActivitiesForDate(year, month, day) {
        // Simulation d'activités régulières
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const activities = [];
        
        // Lundi : Musique et Art Oratoire
        if (dayOfWeek === 1) {
            activities.push(
                { category: 'music', title: 'Éveil Musical' },
                { category: 'oratory', title: 'Art Oratoire Débutants' }
            );
        }
        
        // Mercredi : Danse et Créativité
        if (dayOfWeek === 3) {
            activities.push(
                { category: 'dance', title: 'Expression Corporelle' },
                { category: 'creativity', title: 'Atelier Arts Plastiques' }
            );
        }
        
        // Vendredi : Jardinage
        if (dayOfWeek === 5) {
            activities.push({ category: 'gardening', title: 'Jardinage Pédagogique' });
        }
        
        return activities;
    }

    setupCalendarNavigation() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.renderCalendar();
        });
    }

    setupCalendarDayEvents() {
        const calendarDays = document.querySelectorAll('.calendar-day.has-activity');
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                const date = day.dataset.date;
                this.showDayActivities(date);
            });
        });
    }

    showDayActivities(date) {
        const [year, month, day] = date.split('-').map(Number);
        const activities = this.getActivitiesForDate(year, month - 1, day);
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="day-activities">
                <h2>Activités du ${day}/${month}/${year}</h2>
                <div class="activities-list">
                    ${activities.map(activity => `
                        <div class="activity-schedule-item">
                            <div class="activity-icon">${this.getActivityIcon(activity.category)}</div>
                            <div class="activity-info">
                                <h4>${activity.title}</h4>
                                <span class="activity-time">${this.getActivityTime(activity.category)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.showModal();
    }

    getActivityIcon(category) {
        const icons = {
            'oratory': '🎤',
            'gardening': '🌱',
            'music': '🎵',
            'dance': '💃',
            'english': '🇬🇧',
            'creativity': '🎨'
        };
        return icons[category] || '⭐';
    }

    getActivityTime(category) {
        const times = {
            'oratory': '15h-17h',
            'gardening': '15h-16h',
            'music': '16h-17h',
            'dance': '16h-17h',
            'creativity': '14h-16h'
        };
        return times[category] || '--:--';
    }

    setupModalSystem() {
        this.setupModalClose();
        this.setupModalOverlay();
    }

    setupModalClose() {
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal();
        });
    }

    setupModalOverlay() {
        document.getElementById('activityModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });
    }

    showModal() {
        document.getElementById('activityModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        document.getElementById('activityModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    setupInteractiveElements() {
        this.setupActivityActions();
        this.setupPreviewItems();
    }

    setupActivityActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-action[data-action="info"]')) {
                const card = e.target.closest('.activity-card');
                const category = card.dataset.category;
                this.showActivityDetail(category);
            }
            
            if (e.target.closest('.btn-action[data-action="gallery"]')) {
                const card = e.target.closest('.activity-card');
                const category = card.dataset.category;
                this.filterGallery(category);
            }
        });
    }

    showActivityDetail(category) {
        const activity = this.activitiesData.find(a => a.category === category);
        if (!activity) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="activity-detail">
                <div class="detail-header">
                    <div class="detail-badge">${this.getActivityIcon(category)}</div>
                    <div class="detail-title">
                        <h2>${activity.title}</h2>
                        <div class="detail-meta">
                            <span>${activity.ageRange}</span>
                            <span>•</span>
                            <span>${activity.duration}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-content">
                    <p class="detail-description">${activity.description}</p>
                    
                    <div class="detail-section">
                        <h3>Compétences Développées</h3>
                        <div class="skills-list">
                            ${activity.skills.map(skill => `
                                <span class="skill-badge">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Bénéfices</h3>
                        <ul class="benefits-list">
                            ${activity.benefits.map(benefit => `
                                <li>${benefit}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Horaires</h3>
                        <div class="schedule-list">
                            ${activity.schedule.map(session => `
                                <div class="schedule-item">
                                    <span class="schedule-day">${session.day}</span>
                                    <span class="schedule-time">${session.time}</span>
                                    <span class="schedule-group">${session.group}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="activitiesSystem.enrollActivity('${category}')">
                        <i class="fas fa-user-plus"></i>
                        S'inscrire
                    </button>
                </div>
            </div>
        `;
        
        this.showModal();
    }

    filterGallery(category) {
        this.currentGallery = category;
        
        // Mettre à jour les filtres de galerie
        const galleryFilters = document.querySelectorAll('.gallery-filter');
        galleryFilters.forEach(filter => {
            filter.classList.toggle('active', filter.dataset.gallery === category);
        });
        
        this.renderGallery();
        
        // Scroller vers la galerie
        document.querySelector('.gallery-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    setupPreviewItems() {
        const previewItems = document.querySelectorAll('.preview-item');
        previewItems.forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.activity;
                this.filterActivities(category);
                
                // Scroller vers les activités
                document.querySelector('.activities-grid-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
    }

    enrollActivity(category) {
        this.showNotification(`Inscription à ${this.getCategoryName(category)} enregistrée !`);
        this.hideModal();
        
        // Redirection vers la page contact
        setTimeout(() => {
            window.location.href = 'contact.html?activity=' + category;
        }, 1500);
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
            // Fallback pour navigateurs sans support
            prompt('Partagez ce lien :', window.location.href);
        }
    }

    downloadMemory(activityId) {
        this.showNotification('Téléchargement du souvenir en cours...', 'success');
        
        setTimeout(() => {
            this.showNotification('Souvenir téléchargé avec succès !', 'success');
        }, 2000);
    }

    animateFilterTransition() {
        const container = document.getElementById('activitiesContainer');
        container.style.opacity = '0.7';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 300);
    }

    showNotification(message, type = 'info') {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, type);
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.activitiesSystem = new ActivitiesSystem();
});