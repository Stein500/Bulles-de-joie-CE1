// ===== SYSTEME INTELLIGENT "LES BULLES DE JOIE" =====

class SmartSchoolSystem {
    constructor() {
        this.studentsData = {
            "aglo": {
                name: "AGLO Fifamè",
                password: "fifamè",
                notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12],
                comment: "Fifamè montre une excellente compréhension en lecture et une belle progression en expression écrite. Continuez à encourager la pratique de la dictée à la maison.",
                strengths: ["Lecture", "Expression Écrite"],
                improvements: ["Dictée"],
                personality: "curieux"
            },
            "akyoh": {
                name: "AKYOH Emmanuel",
                password: "emmanuel",
                notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13],
                comment: "Emmanuel excelle en expression écrite et en éducation sportive. Un effort particulier est nécessaire en dictée et en mathématiques. N'hésitez pas à revoir les bases avec lui.",
                strengths: ["Expression Écrite", "Éducation Sportive"],
                improvements: ["Dictée", "Mathématiques"],
                personality: "sportif"
            },
            "amadou": {
                name: "AMADOU Yinki",
                password: "yinki",
                notes: [15.5, 19, 5, 16.25, 7.75, 15, 13.25, 17, 14],
                comment: "Yinki a des talents certains en expression écrite. Son travail en éducation scientifique pourrait être renforcé par des exercices pratiques à la maison.",
                strengths: ["Expression Écrite"],
                improvements: ["Éducation Scientifique"],
                personality: "creatif"
            },
            "bani": {
                name: "BANI Rahama",
                password: "rahama",
                notes: [13.75, 18.25, 12, 20, 17, 14.5, 7.25, 18, 15],
                comment: "Rahama brille particulièrement en éducation sociale où elle a obtenu la note maximale! Son engagement en mathématiques mériterait d'être soutenu.",
                strengths: ["Éducation Sociale"],
                improvements: ["Mathématiques"],
                personality: "sociable"
            },
            "dahougou": {
                name: "DAHOUGOU Noham",
                password: "noham",
                notes: [15.25, 18.50, 3, 12, 8.75, 13, 5.75, 18, 14],
                comment: "Noham montre de belles capacités en expression écrite et en éducation sportive. La dictée et les mathématiques nécessitent un travail régulier supplémentaire.",
                strengths: ["Expression Écrite", "Éducation Sportive"],
                improvements: ["Dictée", "Mathématiques"],
                personality: "energique"
            },
            "eda": {
                name: "EDA Queen",
                password: "queen",
                notes: [19, 18.25, 4, 13.75, 14.5, 12, 15.75, 18, 14],
                comment: "Queen possède d'excellentes compétences en lecture. Nous devons travailler ensemble sur la dictée pour améliorer son orthographe.",
                strengths: ["Lecture"],
                improvements: ["Dictée"],
                personality: "lecteur"
            },
            "houehou": {
                name: "HOUEHOU Méka",
                password: "méka",
                notes: [18.75, 19.5, 9, 15, 14, 14.5, 17.25, 17, 13],
                comment: "Méka est un élève très appliqué qui obtient d'excellents résultats dans la plupart des matières. Félicitations pour ce beau travail!",
                strengths: ["Expression Écrite", "Mathématiques"],
                improvements: [],
                personality: "applique"
            },
            "padonou": {
                name: "PADONOU Faith",
                password: "faith",
                notes: [19, 15.75, 4, 19, 17.25, 15, 13.75, 18, 13],
                comment: "Faith excelle en lecture et en éducation sociale. Continuez à l'encourager dans sa progression en expression écrite.",
                strengths: ["Lecture", "Éducation Sociale"],
                improvements: ["Expression Écrite"],
                personality: "equilibre"
            },
            "sovi": {
                name: "SOVI Péniel",
                password: "péniel",
                notes: [12.5, 18.25, 8, 18.5, 16.5, 13, 16.25, 17, 14],
                comment: "Péniel montre de très bonnes aptitudes en éducation sociale et scientifique. Un petit effort en lecture serait bénéfique.",
                strengths: ["Éducation Sociale", "Éducation Scientifique"],
                improvements: ["Lecture"],
                personality: "scientifique"
            },
            "tossavi": {
                name: "TOSSAVI Naelle",
                password: "naelle",
                notes: [19, 16.75, 9, 18, 18, 15, 12.25, 17, 14],
                comment: "Naelle a obtenu d'excellents résultats en lecture, éducation sociale et scientifique. Continuez sur cette belle lancée!",
                strengths: ["Lecture", "Éducation Sociale", "Éducation Scientifique"],
                improvements: [],
                personality: "excellence"
            }
        };

        this.subjects = [
            "Lecture", "Expression Écrite", "Dictée", "Éducation Sociale", 
            "Éducation Scientifique", "Dessin", "Mathématiques", 
            "Éducation Sportive", "Éducation Artistique"
        ];

        this.analytics = {
            totalLogins: 0,
            successfulLogins: 0,
            printedCertificates: 0,
            studentViews: {},
            sessionStart: new Date()
        };

        this.init();
    }

    // ===== INITIALISATION INTELLIGENTE =====
    init() {
        console.log('🎓 Système Smart School initialisé');
        this.setupEventListeners();
        this.setupSmartAnimations();
        this.setupVoiceAssistant();
        this.setupAnalytics();
        this.setupAIRecommendations();
        this.setupRealTimeUpdates();
        this.createWelcomeEffect();
    }

    // ===== GESTIONNAIRE D'ÉVÉNEMENTS AVANCÉ =====
    setupEventListeners() {
        const submitBtn = document.getElementById('submitBtn');
        const passwordInput = document.getElementById('passwordInput');
        const studentSelect = document.getElementById('studentSelect');

        // Événement de soumission intelligent
        submitBtn.addEventListener('click', () => this.handleLogin());

        // Auto-complétion du mot de passe
        studentSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                passwordInput.placeholder = `Prénom de ${this.studentsData[e.target.value].name.split(' ')[1]}`;
                passwordInput.focus();
            }
        });

        // Soumission avec Entrée
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Reconnaissance vocale
        this.setupVoiceRecognition();

        // Gestes tactiles
        this.setupTouchGestures();
    }

    // ===== CONNEXION INTELLIGENTE =====
    async handleLogin() {
        const selectedStudent = document.getElementById('studentSelect').value;
        const enteredPassword = document.getElementById('passwordInput').value.trim().toLowerCase();

        if (!selectedStudent) {
            this.showSmartNotification('Veuillez sélectionner un élève', 'warning');
            return;
        }

        if (!enteredPassword) {
            this.showSmartNotification('Veuillez entrer le mot de passe', 'warning');
            return;
        }

        this.analytics.totalLogins++;

        const student = this.studentsData[selectedStudent];
        
        if (enteredPassword === student.password) {
            this.analytics.successfulLogins++;
            this.analytics.studentViews[selectedStudent] = (this.analytics.studentViews[selectedStudent] || 0) + 1;
            
            await this.performLoginAnimation();
            this.displaySmartResults(student);
            this.createCelebrationEffect();
            this.speak(`Bienvenue ${student.name.split(' ')[1]} ! Voici vos résultats.`);
            
            // Envoyer une notification push si supporté
            this.sendPushNotification(`Résultats consultés pour ${student.name}`);
        } else {
            this.handleFailedLogin(selectedStudent, enteredPassword);
        }
    }

    // ===== ANIMATION DE CONNEXION =====
    async performLoginAnimation() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        submitBtn.disabled = true;

        // Simulation de traitement
        await new Promise(resolve => setTimeout(resolve, 1500));

        submitBtn.innerHTML = '<i class="fas fa-check"></i> Connecté !';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }

    // ===== AFFICHAGE DES RÉSULTATS INTELLIGENTS =====
    displaySmartResults(student) {
        const stats = this.calculateAdvancedStats(student);
        const resultsContainer = document.getElementById('resultsContainer');
        
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = this.generateSmartResultsHTML(student, stats);
        
        this.animateResultsAppearance();
        this.setupResultsInteractions(student, stats);
    }

    // ===== CALCULS AVANCÉS =====
    calculateAdvancedStats(student) {
        const notes = student.notes;
        const average = notes.reduce((a, b) => a + b, 0) / notes.length;
        
        // Trouver la matière la plus forte
        let bestSubjectIndex = 0;
        let bestNote = notes[0];
        let worstSubjectIndex = 0;
        let worstNote = notes[0];
        
        for (let i = 1; i < notes.length; i++) {
            if (notes[i] > bestNote) {
                bestNote = notes[i];
                bestSubjectIndex = i;
            }
            if (notes[i] < worstNote) {
                worstNote = notes[i];
                worstSubjectIndex = i;
            }
        }

        // Analyse de progression (simulée)
        const progress = this.calculateProgress(student);
        const ranking = this.calculateClassRanking(student);
        const predictions = this.generatePredictions(student);

        return {
            average: average.toFixed(2),
            bestSubject: this.subjects[bestSubjectIndex],
            bestNote: bestNote,
            worstSubject: this.subjects[worstSubjectIndex],
            worstNote: worstNote,
            progress: progress,
            ranking: ranking,
            predictions: predictions,
            performance: this.analyzePerformance(student)
        };
    }

    // ===== GÉNÉRATION HTML INTELLIGENTE =====
    generateSmartResultsHTML(student, stats) {
        return `
            <div class="smart-results">
                <h3 class="student-name">${student.name}</h3>
                
                <!-- Cartes de statistiques avancées -->
                <div class="smart-stats-container">
                    ${this.generateStatsCards(stats)}
                </div>

                <!-- Analyse de performance -->
                <div class="performance-analysis">
                    <h4><i class="fas fa-chart-line"></i> Analyse de Performance</h4>
                    <div class="analysis-grid">
                        ${this.generatePerformanceAnalysis(stats.performance)}
                    </div>
                </div>

                <!-- Tableau des notes avec visualisation -->
                <div class="table-container">
                    <table class="grades-table">
                        <thead>
                            <tr>
                                ${this.subjects.map(subject => `
                                    <th data-subject="${subject}">
                                        <span>${subject}</span>
                                        <i class="fas fa-info-circle" onclick="schoolSystem.showSubjectTips('${subject}')"></i>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                ${student.notes.map((note, index) => `
                                    <td class="note-cell ${note < 5 ? 'low-note' : ''} ${note >= 18 ? 'high-note' : ''}" 
                                        data-note="${note}"
                                        data-subject="${this.subjects[index]}">
                                        ${note}
                                        <div class="note-bar" style="transform: scaleX(${note/20})"></div>
                                        <div class="note-sparkle"></div>
                                    </td>
                                `).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Recommandations IA -->
                <div class="ai-recommendations">
                    <h4><i class="fas fa-robot"></i> Recommandations Personnalisées</h4>
                    ${this.generateAIRecommendations(student, stats)}
                </div>

                <!-- Commentaire enseignant avec émotions -->
                <div class="teacher-comment enhanced">
                    <div class="comment-header">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span class="comment-title">Commentaire de l'enseignant</span>
                        <span class="sentiment-indicator ${this.analyzeSentiment(student.comment)}"></span>
                    </div>
                    <p>${student.comment}</p>
                    <div class="comment-meta">
                        <span class="date">${new Date().toLocaleDateString('fr-FR')}</span>
                        <span class="teacher">C. J. S. Stein</span>
                    </div>
                </div>

                <!-- Actions intelligentes -->
                <div class="smart-actions">
                    <button class="btn btn-accent" id="certificateBtn">
                        <i class="fas fa-certificate"></i> Certificat de Réussite
                    </button>
                    <button class="btn" id="printBulletinBtn">
                        <i class="fas fa-print"></i> Imprimer le Bulletin
                    </button>
                    <button class="btn btn-info" id="shareResultsBtn">
                        <i class="fas fa-share-alt"></i> Partager
                    </button>
                    <button class="btn btn-warning" id="studyPlanBtn">
                        <i class="fas fa-calendar-check"></i> Plan d'Étude
                    </button>
                </div>
            </div>
        `;
    }

    // ===== GÉNÉRATION DES CARTES DE STATISTIQUES =====
    generateStatsCards(stats) {
        const cards = [
            {
                icon: 'fas fa-chart-bar',
                title: 'Moyenne Générale',
                value: `${stats.average}/20`,
                trend: stats.progress > 0 ? 'up' : stats.progress < 0 ? 'down' : 'stable',
                color: 'primary'
            },
            {
                icon: 'fas fa-trophy',
                title: 'Matière Excellente',
                value: stats.bestSubject,
                subtitle: `${stats.bestNote}/20`,
                color: 'gold'
            },
            {
                icon: 'fas fa-rocket',
                title: 'Progression',
                value: `${stats.progress > 0 ? '+' : ''}${stats.progress}%`,
                trend: stats.progress > 0 ? 'up' : 'down',
                color: 'accent'
            },
            {
                icon: 'fas fa-chess-king',
                title: 'Classement',
                value: `${stats.ranking.position}ème`,
                subtitle: `sur ${stats.ranking.total}`,
                color: 'secondary'
            }
        ];

        return cards.map(card => `
            <div class="stat-card ${card.color}">
                <div class="stat-icon">
                    <i class="${card.icon}"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-title">${card.title}</div>
                    <div class="stat-value">${card.value}</div>
                    ${card.subtitle ? `<div class="stat-subtitle">${card.subtitle}</div>` : ''}
                    ${card.trend ? `<div class="stat-trend ${card.trend}">
                        <i class="fas fa-arrow-${card.trend}"></i>
                    </div>` : ''}
                </div>
            </div>
        `).join('');
    }

    // ===== SYSTÈME DE RECOMMANDATIONS IA =====
    generateAIRecommendations(student, stats) {
        const recommendations = [];
        
        // Recommandations basées sur les notes
        if (stats.worstNote < 10) {
            recommendations.push({
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                text: `Priorité: Renforcer ${stats.worstSubject} avec des exercices quotidiens`
            });
        }

        // Recommandations basées sur les forces
        if (stats.bestNote >= 18) {
            recommendations.push({
                type: 'success',
                icon: 'fas fa-star',
                text: `Excellence en ${stats.bestSubject} - Poursuivre cet effort !`
            });
        }

        // Recommandations personnalisées selon la personnalité
        const personalityRecommendations = {
            curieux: "Encouragez la lecture de livres variés pour nourrir sa curiosité naturelle.",
            sportif: "Associez l'apprentissage à des activités physiques pour mieux retenir.",
            creatif: "Utilisez des méthodes d'apprentissage visuelles et créatives.",
            sociable: "Organisez des sessions d'étude en groupe pour progresser ensemble.",
            energique: "Divisez les sessions de travail en périodes courtes et dynamiques.",
            lecteur: "Profitez de son amour de la lecture pour enrichir son vocabulaire.",
            applique: "Maintenez ce rythme de travail régulier qui porte ses fruits.",
            equilibre: "Continuez à développer toutes les compétences de manière harmonieuse.",
            scientifique: "Expérimentez avec des projets pratiques pour renforcer l'apprentissage.",
            excellence: "Proposez des défis supplémentaires pour continuer à progresser."
        };

        recommendations.push({
            type: 'info',
            icon: 'fas fa-user-graduate',
            text: personalityRecommendations[student.personality] || "Continuez les efforts dans toutes les matières."
        });

        return recommendations.map(rec => `
            <div class="recommendation ${rec.type}">
                <i class="${rec.icon}"></i>
                <span>${rec.text}</span>
            </div>
        `).join('');
    }

    // ===== ANIMATIONS INTELLIGENTES =====
    animateResultsAppearance() {
        const elements = document.querySelectorAll('.stat-card, .note-cell, .recommendation');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animation des barres de notes
        setTimeout(() => {
            document.querySelectorAll('.note-bar').forEach(bar => {
                bar.style.transform = 'scaleX(1)';
            });
        }, 500);
    }

    // ===== ASSISTANT VOCAL =====
    setupVoiceAssistant() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            
            // Créer un bouton d'activation vocale
            this.createVoiceControlButton();
        }
    }

    speak(text) {
        if (this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            this.speechSynthesis.speak(utterance);
        }
    }

    // ===== RECONNAISSANCE VOCALE =====
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.lang = 'fr-FR';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(transcript);
            };

            recognition.onerror = (event) => {
                console.log('Erreur de reconnaissance vocale:', event.error);
            };

            this.voiceRecognition = recognition;
        }
    }

    processVoiceCommand(command) {
        const passwordInput = document.getElementById('passwordInput');
        
        if (command.includes('mot de passe')) {
            const password = command.replace('mot de passe', '').trim();
            passwordInput.value = password;
            this.showSmartNotification(`Mot de passe "${password}" saisi vocalement`, 'info');
        }
        
        if (command.includes('connecter') || command.includes('valider')) {
            this.handleLogin();
        }
    }

    // ===== GESTES TACTILES =====
    setupTouchGestures() {
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Swipe gauche pour effacer
            if (Math.abs(diffX) > 50 && Math.abs(diffY) < 50) {
                if (diffX > 0) {
                    document.getElementById('passwordInput').value = '';
                    this.showSmartNotification('Champ effacé', 'info');
                }
            }
            
            // Swipe vers le haut pour remonter
            if (Math.abs(diffY) > 50 && Math.abs(diffX) < 50) {
                if (diffY > 0) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }

    // ===== SYSTÈME DE NOTIFICATIONS INTELLIGENT =====
    showSmartNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `smart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ===== EFFETS VISUELS AVANCÉS =====
    createCelebrationEffect() {
        // Confettis avancés
        this.createAdvancedConfetti();
        
        // Effet de particules
        this.createParticleEffect();
        
        // Animation de succès
        this.createSuccessAnimation();
    }

    createAdvancedConfetti() {
        const colors = ['#4A6FA5', '#FF9E6D', '#6BCF7F', '#FFD700', '#EF476F'];
        
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    width: ${Math.random() * 12 + 8}px;
                    height: ${Math.random() * 12 + 8}px;
                    animation-delay: ${Math.random() * 2}s;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 20);
        }
    }

    createParticleEffect() {
        const container = document.querySelector('.results-container');
        if (!container) return;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'success-particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 1}s;
            `;
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }

    // ===== GESTION DES ERREURS INTELLIGENTE =====
    handleFailedLogin(studentId, enteredPassword) {
        const student = this.studentsData[studentId];
        const correctPassword = student.password;
        
        // Analyse de l'erreur
        let hint = '';
        if (enteredPassword.length < correctPassword.length) {
            hint = 'Le mot de passe semble trop court';
        } else if (enteredPassword.length > correctPassword.length) {
            hint = 'Le mot de passe semble trop long';
        } else {
            hint = 'Vérifiez les accents et la casse';
        }
        
        this.showSmartNotification(`Mot de passe incorrect. ${hint}`, 'error');
        
        // Effet visuel d'erreur
        this.createErrorEffect();
        
        // Vibration si supporté
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    createErrorEffect() {
        const passwordInput = document.getElementById('passwordInput');
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }

    // ===== MÉTHODES D'ANALYSE AVANCÉE =====
    calculateProgress(student) {
        // Simulation de données de progression
        return Math.floor(Math.random() * 21) - 10; // -10% à +10%
    }

    calculateClassRanking(student) {
        // Simulation de classement
        const totalStudents = Object.keys(this.studentsData).length;
        const average = student.notes.reduce((a, b) => a + b, 0) / student.notes.length;
        
        // Simulation basée sur la moyenne
        let position = Math.max(1, Math.min(totalStudents, Math.floor((20 - average) * 2)));
        
        return {
            position: position,
            total: totalStudents
        };
    }

    analyzePerformance(student) {
        const notes = student.notes;
        const average = notes.reduce((a, b) => a + b, 0) / notes.length;
        
        return {
            level: average >= 16 ? 'Excellent' : average >= 12 ? 'Bon' : average >= 8 ? 'Moyen' : 'À renforcer',
            consistency: this.calculateConsistency(notes),
            trend: this.analyzeTrend(notes),
            strengths: student.strengths,
            improvements: student.improvements
        };
    }

    calculateConsistency(notes) {
        const variance = notes.reduce((acc, note) => acc + Math.pow(note - 10, 2), 0) / notes.length;
        return variance < 10 ? 'Équilibré' : variance < 20 ? 'Variable' : 'Irregular';
    }

    analyzeTrend(notes) {
        // Simulation d'analyse de tendance
        return Math.random() > 0.5 ? 'Amélioration' : 'Stable';
    }

    analyzeSentiment(comment) {
        const positiveWords = ['excellent', 'excellente', 'bon', 'belle', 'félicitations', 'talent', 'appliqué', 'progression'];
        const negativeWords = ['effort', 'nécessaire', 'renforcer', 'travail', 'soutenu'];
        
        const positiveCount = positiveWords.filter(word => comment.toLowerCase().includes(word)).length;
        const negativeCount = negativeWords.filter(word => comment.toLowerCase().includes(word)).length;
        
        return positiveCount > negativeCount ? 'positive' : positiveCount < negativeCount ? 'negative' : 'neutral';
    }

    generatePredictions(student) {
        // Simulation de prédictions IA
        return {
            nextTerm: `Potentiel d'atteindre ${(parseFloat(this.calculateAdvancedStats(student).average) + 1).toFixed(1)}/20`,
            focusArea: student.improvements[0] || 'Maintenir les excellents résultats',
            recommendation: 'Continuer le travail régulier'
        };
    }

    // ===== SYSTÈME D'ANALYTIQUES =====
    setupAnalytics() {
        // Envoi périodique des données (simulé)
        setInterval(() => {
            this.sendAnalyticsData();
        }, 30000); // Toutes les 30 secondes
    }

    sendAnalyticsData() {
        const data = {
            ...this.analytics,
            sessionDuration: new Date() - this.analytics.sessionStart,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`
        };
        
        console.log('📊 Données analytiques:', data);
        // Ici, vous enverriez les données à votre serveur
    }

    // ===== MÉTHODES UTILITAIRES =====
    createWelcomeEffect() {
        setTimeout(() => {
            this.showSmartNotification('Bienvenue sur le système de résultats des Bulles de Joie !', 'info');
        }, 1000);
    }

    createVoiceControlButton() {
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-control-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.title = 'Activer la reconnaissance vocale';
        
        voiceBtn.addEventListener('click', () => {
            if (this.voiceRecognition) {
                this.voiceRecognition.start();
                this.showSmartNotification('Écoute en cours... Parlez maintenant', 'info');
            }
        });
        
        document.querySelector('.password-form').appendChild(voiceBtn);
    }

    sendPushNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Les Bulles de Joie', {
                body: message,
                icon: '/favicon.ico'
            });
        }
    }

    // ===== MÉTHODES PUBLIQUES =====
    showSubjectTips(subject) {
        const tips = {
            'Lecture': 'Pratiquez 15 minutes de lecture quotidienne',
            'Expression Écrite': 'Tenez un journal personnel pour améliorer votre expression',
            'Dictée': 'Écoutez et écrivez des histoires courtes chaque jour',
            'Mathématiques': 'Résolvez un problème mathématique par jour',
            'Éducation Scientifique': 'Faites des expériences simples à la maison'
        };
        
        this.showSmartNotification(`💡 ${tips[subject] || 'Continuez à pratiquer régulièrement'}`, 'info');
    }
}

// ===== INITIALISATION DU SYSTÈME =====
let schoolSystem;

document.addEventListener('DOMContentLoaded', function() {
    schoolSystem = new SmartSchoolSystem();
    
    // Ajout des styles CSS dynamiques
    const dynamicStyles = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .smart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-left: 4px solid #4A6FA5;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
        }
        
        .smart-notification.show {
            transform: translateX(0);
        }
        
        .smart-notification.success { border-left-color: #6BCF7F; }
        .smart-notification.warning { border-left-color: #FF9E6D; }
        .smart-notification.error { border-left-color: #EF476F; }
        
        .voice-control-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: #4A6FA5;
            cursor: pointer;
            padding: 5px;
        }
        
        .success-particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #6BCF7F;
            border-radius: 50%;
            animation: particlePop 2s ease-out forwards;
            pointer-events: none;
        }
        
        @keyframes particlePop {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1) translateY(-50px);
                opacity: 0;
            }
        }
        
        .sentiment-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-left: 10px;
        }
        
        .sentiment-indicator.positive { background: #6BCF7F; }
        .sentiment-indicator.negative { background: #EF476F; }
        .sentiment-indicator.neutral { background: #FF9E6D; }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
});

// ===== EXPOSITION GLOBALE POUR LES APPELS HTML =====
window.schoolSystem = schoolSystem;