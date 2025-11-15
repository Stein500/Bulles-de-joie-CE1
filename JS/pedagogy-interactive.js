// pedagy-interactive.js - Fonctionnalités interactives pour la page pédagogie

class PedagogieInteractive {
    constructor() {
        this.init();
    }

    init() {
        this.setupInteractiveTabs();
        this.setupMethodologyCards();
        this.setupProgressTracking();
        this.setupInteractiveTimeline();
        this.setupLearningGames();
    }

    // Configuration des onglets interactifs
    setupInteractiveTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Retirer la classe active de tous les boutons et contenus
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Ajouter la classe active au bouton cliqué
                btn.classList.add('active');

                // Afficher le contenu correspondant
                const tabId = btn.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    this.animateContentAppear(targetContent);
                }
            });
        });
    }

    // Animation d'apparition du contenu
    animateContentAppear(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    // Configuration des cartes de méthodologie
    setupMethodologyCards() {
        const methodologyCards = document.querySelectorAll('.methodology-card');
        
        methodologyCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });

            // Clic pour plus de détails
            card.addEventListener('click', () => {
                this.showMethodologyDetails(card);
            });
        });
    }

    // Animation de survol des cartes
    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = 'var(--shadow-lg)';
            
            // Animation de l'icône
            const icon = card.querySelector('.methodology-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'var(--shadow-md)';
            
            const icon = card.querySelector('.methodology-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        }
    }

    // Affichage des détails de la méthodologie
    showMethodologyDetails(card) {
        const methodology = card.getAttribute('data-methodology');
        const details = this.getMethodologyDetails(methodology);
        
        this.showModal(details);
    }

    // Détails des méthodologies
    getMethodologyDetails(methodology) {
        const details = {
            'montessori': {
                title: 'Pédagogie Montessori',
                description: 'Une approche éducative centrée sur le développement naturel de l\'enfant.',
                principles: [
                    'Respect du rythme individuel',
                    'Environnement préparé',
                    'Matériel sensoriel',
                    'Autonomie et liberté',
                    'Apprentissage par l\'expérience'
                ],
                benefits: [
                    'Développe l\'autonomie',
                    'Stimule la concentration',
                    'Favorise la confiance en soi',
                    'Encourage la curiosité naturelle'
                ]
            },
            'freinet': {
                title: 'Techniques Freinet',
                description: 'Pédagogie basée sur l\'expression libre et la coopération.',
                principles: [
                    'Expression libre',
                    'Tâtonnement expérimental',
                    'Coopération',
                    'Individualisation du travail',
                    'Lien avec la vie réelle'
                ],
                benefits: [
                    'Développe l\'expression personnelle',
                    'Encourage la coopération',
                    'Stimule la créativité',
                    'Favorise l\'engagement'
                ]
            },
            'active': {
                title: 'Méthodes Actives',
                description: 'L\'enfant est acteur de ses apprentissages à travers l\'action et l\'expérimentation.',
                principles: [
                    'Apprentissage par projets',
                    'Manipulation concrète',
                    'Résolution de problèmes',
                    'Travail en groupe',
                    'Expérimentation'
                ],
                benefits: [
                    'Apprentissages durables',
                    'Développe l\'esprit critique',
                    'Stimule la motivation',
                    'Favorise l\'autonomie'
                ]
            }
        };

        return details[methodology] || details['montessori'];
    }

    // Affichage de la modale
    showModal(content) {
        // Créer la modale
        const modal = document.createElement('div');
        modal.className = 'pedagogy-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>${content.title}</h2>
                <p class="modal-description">${content.description}</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h3>Principes Fondamentaux</h3>
                        <ul>
                            ${content.principles.map(principle => `<li>${principle}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Avantages</h3>
                        <ul>
                            ${content.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Styles pour la modale
        const styles = `
            .pedagogy-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                animation: modalAppear 0.3s ease forwards;
            }
            @keyframes modalAppear {
                to { opacity: 1; }
            }
            .modal-content {
                background: var(--white);
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                transform: translateY(20px);
                animation: contentSlideUp 0.3s ease 0.1s forwards;
            }
            @keyframes contentSlideUp {
                to { transform: translateY(0); }
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--gray);
            }
            .modal-close:hover {
                color: var(--fuchsia);
            }
            .modal-sections {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-top: 2rem;
            }
            .modal-section h3 {
                color: var(--fuchsia);
                margin-bottom: 1rem;
            }
            .modal-section ul {
                list-style: none;
            }
            .modal-section li {
                margin-bottom: 0.5rem;
                padding-left: 1.5rem;
                position: relative;
            }
            .modal-section li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--lemon-green);
                font-weight: bold;
            }
            @media (max-width: 768px) {
                .modal-sections {
                    grid-template-columns: 1fr;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        document.body.appendChild(modal);

        // Fermeture de la modale
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                this.closeModal(modal);
            }
        });

        // Fermeture avec Échap
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        }.bind(this));
    }

    // Fermeture de la modale
    closeModal(modal) {
        modal.style.animation = 'modalDisappear 0.3s ease forwards';
        modal.querySelector('.modal-content').style.animation = 'contentSlideDown 0.3s ease forwards';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    // Suivi de la progression
    setupProgressTracking() {
        const progressItems = document.querySelectorAll('.progress-item');
        
        progressItems.forEach(item => {
            const progressBar = item.querySelector('.progress-bar');
            const targetProgress = parseInt(item.getAttribute('data-progress'));
            
            this.animateProgressBar(progressBar, targetProgress);
        });
    }

    // Animation des barres de progression
    animateProgressBar(progressBar, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            progressBar.style.width = current + '%';
            progressBar.setAttribute('data-value', Math.round(current) + '%');
        }, stepTime);
    }

    // Timeline interactive
    setupInteractiveTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showTimelineDetails(item);
            });
        });
    }

    // Détails de la timeline
    showTimelineDetails(item) {
        const period = item.getAttribute('data-period');
        const details = this.getTimelineDetails(period);
        
        // Animation de mise en évidence
        item.style.transform = 'scale(1.05)';
        item.style.zIndex = '10';
        
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.zIndex = '';
        }, 300);
        
        // Afficher les détails dans une infobulle
        this.showTooltip(item, details);
    }

    // Détails des périodes de la timeline
    getTimelineDetails(period) {
        const details = {
            'creche': 'Crèche (2 mois - 3 ans) : Développement sensoriel et socialisation dans un environnement sécurisé.',
            'maternelle': 'Maternelle (3-5 ans) : Apprentissage par le jeu et initiation au bilinguisme.',
            'primaire': 'Primaire (6-12 ans) : Programme bilingue enrichi et développement des compétences académiques.'
        };
        
        return details[period] || 'Période éducative';
    }

    // Affichage de l'infobulle
    showTooltip(element, content) {
        // Supprimer l'infobulle existante
        const existingTooltip = document.querySelector('.pedagogy-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Créer la nouvelle infobulle
        const tooltip = document.createElement('div');
        tooltip.className = 'pedagogy-tooltip';
        tooltip.textContent = content;
        
        // Styles pour l'infobulle
        tooltip.style.cssText = `
            position: absolute;
            background: var(--black);
            color: var(--white);
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
            font-size: 0.9rem;
            z-index: 1000;
            max-width: 250px;
            text-align: center;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Positionner l'infobulle
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        
        // Animation d'apparition
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        
        // Suppression automatique
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }

    // Jeux éducatifs interactifs
    setupLearningGames() {
        this.setupMatchingGame();
        this.setupSortingActivity();
    }

    // Jeu d'association
    setupMatchingGame() {
        const matchingContainer = document.querySelector('.matching-game');
        if (!matchingContainer) return;
        
        // Implémentation du jeu d'association
        // (À développer selon les besoins spécifiques)
    }

    // Activité de tri
    setupSortingActivity() {
        const sortingContainer = document.querySelector('.sorting-activity');
        if (!sortingContainer) return;
        
        // Implémentation de l'activité de tri
        // (À développer selon les besoins spécifiques)
    }

    // Génération de rapports d'apprentissage
    generateLearningReport() {
        const report = {
            date: new Date().toLocaleDateString('fr-BJ'),
            activitiesCompleted: this.getCompletedActivities(),
            progress: this.calculateOverallProgress(),
            strengths: this.identifyStrengths(),
            areasForImprovement: this.identifyImprovementAreas()
        };
        
        return report;
    }

    // Méthodes utilitaires pour les rapports
    getCompletedActivities() {
        // Implémentation réelle à connecter avec le backend
        return 15; // Exemple
    }
    
    calculateOverallProgress() {
        // Implémentation réelle
        return 75; // Pourcentage
    }
    
    identifyStrengths() {
        return ['Créativité', 'Coopération', 'Curiosité'];
    }
    
    identifyImprovementAreas() {
        return ['Concentration', 'Persévérance'];
    }
}

// Initialisation des fonctionnalités interactives
document.addEventListener('DOMContentLoaded', () => {
    window.pedagogieInteractive = new PedagogieInteractive();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PedagogieInteractive;
}