class ResultsSystem {
    constructor() {
        this.studentsData = {};
        this.currentStudent = null;
        this.init();
    }

    init() {
        this.loadStudentsData();
        this.setupEventListeners();
        this.initializeClassSelection();
    }

    loadStudentsData() {
        // Données des élèves (en production, cela viendrait d'une API sécurisée)
        this.studentsData = {
            "ce1": {
                "agblo": { 
                    password: "fifamè", 
                    name: "AGBLO AGONDJIHOSSOU Fifamè", 
                    notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12],
                    moyenne: "14.11",
                    teacher: "Enseignant CE1"
                },
                "akyoh": { 
                    password: "emmanuel", 
                    name: "AKYOH Emmanuel", 
                    notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13],
                    moyenne: "10.64",
                    teacher: "Enseignant CE1"
                }
                // ... autres élèves
            },
            "cp": {
                // Données CP
            },
            "ci": {
                // Données CI
            }
        };
    }

    setupEventListeners() {
        // Formulaire de connexion
        const loginForm = document.getElementById('studentLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Bouton afficher/masquer mot de passe
        const toggleBtn = document.getElementById('togglePassword');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }

        // Boutons de téléchargement
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDownload(e.target.dataset.format);
            });
        });
    }

    initializeClassSelection() {
        const classButtons = document.querySelectorAll('.class-btn');
        classButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Mettre à jour la sélection de classe
                classButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const selectedClass = btn.dataset.class;
                this.updateStudentDropdown(selectedClass);
            });
        });

        // Initialiser avec la classe par défaut
        this.updateStudentDropdown('ce1');
    }

    updateStudentDropdown(className) {
        const studentSelect = document.getElementById('studentName');
        if (!studentSelect) return;

        // Vider les options existantes
        studentSelect.innerHTML = '<option value="">Sélectionnez un élève</option>';

        // Ajouter les élèves de la classe sélectionnée
        if (this.studentsData[className]) {
            Object.keys(this.studentsData[className]).forEach(studentId => {
                const student = this.studentsData[className][studentId];
                const option = document.createElement('option');
                option.value = studentId;
                option.textContent = student.name;
                studentSelect.appendChild(option);
            });
        }
    }

    handleLogin() {
        const studentSelect = document.getElementById('studentName');
        const passwordInput = document.getElementById('accessCode');
        const selectedClass = document.querySelector('.class-btn.active').dataset.class;
        const studentId = studentSelect.value;
        const password = passwordInput.value.trim().toLowerCase();

        if (!this.validateInputs(studentId, password)) {
            return;
        }

        const student = this.studentsData[selectedClass]?.[studentId];
        
        if (student && password === student.password) {
            this.currentStudent = { ...student, id: studentId, className: selectedClass };
            this.showSuccess('Connexion réussie !');
            this.displayStudentResults();
        } else {
            this.showError('Identifiants incorrects. Vérifiez le code d\'accès.');
            this.shakeLoginForm();
        }
    }

    validateInputs(studentId, password) {
        if (!studentId) {
            this.showError('Veuillez sélectionner un élève.');
            return false;
        }
        if (!password) {
            this.showError('Veuillez entrer le code d\'accès.');
            return false;
        }
        return true;
    }

    displayStudentResults() {
        const resultsDisplay = document.getElementById('resultsDisplay');
        if (!resultsDisplay || !this.currentStudent) return;

        const student = this.currentStudent;
        const average = parseFloat(student.moyenne);
        const appreciation = this.getAppreciation(average);

        resultsDisplay.innerHTML = this.generateResultsHTML(student, appreciation);
        resultsDisplay.style.display = 'block';

        // Scroll vers les résultats
        resultsDisplay.scrollIntoView({ behavior: 'smooth' });

        // Animer les graphiques
        setTimeout(() => {
            this.animateCharts();
        }, 500);
    }

    generateResultsHTML(student, appreciation) {
        return `
            <div class="student-results">
                <div class="results-header">
                    <h3><i class="fas fa-user-graduate"></i> ${student.name}</h3>
                    <div class="average-display ${appreciation.class}">
                        <span class="average-label">Moyenne Générale</span>
                        <span class="average-value">${student.moyenne}/20</span>
                        <span class="average-icon">${appreciation.icon}</span>
                    </div>
                </div>

                <div class="results-grid">
                    <div class="grades-card">
                        <h4><i class="fas fa-chart-bar"></i> Notes par matière</h4>
                        <div class="grades-list">
                            ${this.generateGradesList(student.notes)}
                        </div>
                    </div>

                    <div class="progress-card">
                        <h4><i class="fas fa-trending-up"></i> Évolution</h4>
                        <div class="progress-chart">
                            <canvas id="progressChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>

                <div class="teacher-comments">
                    <h4><i class="fas fa-comment"></i> Appréciations de l'enseignant</h4>
                    <div class="comment-item">
                        <strong>${student.teacher} :</strong>
                        <p>${appreciation.message}</p>
                    </div>
                </div>

                <div class="results-actions">
                    <button class="btn btn-primary" onclick="resultsSystem.downloadPDF()">
                        <i class="fas fa-file-pdf"></i> Télécharger le bulletin
                    </button>
                    <button class="btn btn-outline" onclick="resultsSystem.printResults()">
                        <i class="fas fa-print"></i> Imprimer
                    </button>
                </div>
            </div>
        `;
    }

    generateGradesList(notes) {
        const subjects = ['Lecture', 'Expression Écrite', 'Dictée', 'Éducation Sociale', 
                         'Éducation Scientifique', 'Dessin', 'Mathématiques', 'EPS', 'Oral'];
        
        return subjects.map((subject, index) => {
            const note = notes[index];
            const percentage = (note / 20) * 100;
            const gradeClass = note < 10 ? 'low' : note >= 16 ? 'high' : 'medium';
            
            return `
                <div class="grade-item">
                    <span class="subject">${subject}</span>
                    <div class="grade-bar">
                        <div class="grade-fill ${gradeClass}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="note ${gradeClass}">${note}/20</span>
                </div>
            `;
        }).join('');
    }

    getAppreciation(average) {
        if (average >= 16) {
            return {
                class: 'excellent',
                icon: '🏆',
                message: 'Excellents résultats ! Continue tes efforts, tu es sur la bonne voie.'
            };
        } else if (average >= 14) {
            return {
                class: 'very-good', 
                icon: '⭐',
                message: 'Très bon travail ! Tes résultats sont très satisfaisants.'
            };
        } else if (average >= 12) {
            return {
                class: 'good',
                icon: '✅', 
                message: 'Bon travail. Continue tes efforts pour progresser encore.'
            };
        } else if (average >= 10) {
            return {
                class: 'average',
                icon: '📈',
                message: 'Résultats satisfaisants. Quelques efforts supplémentaires seront bénéfiques.'
            };
        } else {
            return {
                class: 'needs-improvement',
                icon: '💪',
                message: 'Des efforts sont nécessaires. N\'hésite pas à demander de l\'aide.'
            };
        }
    }

    animateCharts() {
        // Animer les barres de progression
        document.querySelectorAll('.grade-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });

        // Initialiser le graphique de progression
        this.initProgressChart();
    }

    initProgressChart() {
        const canvas = document.getElementById('progressChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Données simulées pour la progression
        const data = {
            labels: ['Trim 1', 'Trim 2', 'Trim 3'],
            datasets: [{
                label: 'Moyenne générale',
                data: [12.5, 13.2, parseFloat(this.currentStudent.moyenne)],
                borderColor: '#FF00FF',
                backgroundColor: 'rgba(255, 0, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        // Animation simple du graphique
        this.animateLineChart(ctx, data);
    }

    animateLineChart(ctx, data) {
        // Implémentation simplifiée d'un graphique animé
        const points = data.datasets[0].data;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const maxValue = 20;

        ctx.clearRect(0, 0, width, height);

        // Dessiner la ligne progressive
        ctx.beginPath();
        ctx.strokeStyle = data.datasets[0].borderColor;
        ctx.lineWidth = 3;

        points.forEach((point, index) => {
            const x = (index / (points.length - 1)) * width;
            const y = height - (point / maxValue) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    downloadPDF() {
        this.showSuccess('Génération du PDF en cours...');
        // Simulation de génération PDF
        setTimeout(() => {
            this.showSuccess('PDF téléchargé avec succès !');
        }, 2000);
    }

    printResults() {
        window.print();
    }

    handleDownload(format) {
        switch (format) {
            case 'pdf':
                this.downloadPDF();
                break;
            case 'image':
                this.downloadImage();
                break;
            case 'report':
                this.showDetailedReport();
                break;
        }
    }

    downloadImage() {
        this.showSuccess('Génération de l\'image en cours...');
        // Implémentation de la capture d'écran
    }

    showDetailedReport() {
        // Afficher un rapport détaillé modal
        this.showModal('Rapport Détaillé', this.generateDetailedReport());
    }

    generateDetailedReport() {
        if (!this.currentStudent) return '';
        
        return `
            <div class="detailed-report">
                <h4>Analyse détaillée des performances</h4>
                <div class="report-section">
                    <h5>Points forts</h5>
                    <ul>
                        <li>Excellente compréhension en lecture</li>
                        <li>Bon esprit d'équipe</li>
                        <li>Curiosité scientifique</li>
                    </ul>
                </div>
                <div class="report-section">
                    <h5>Axes d'amélioration</h5>
                    <ul>
                        <li>Renforcer l'orthographe</li>
                        <li>Améliorer la concentration en mathématiques</li>
                    </ul>
                </div>
            </div>
        `;
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('accessCode');
        const toggleIcon = document.querySelector('#togglePassword i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    shakeLoginForm() {
        const form = document.getElementById('studentLoginForm');
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    showSuccess(message) {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, 'success');
        }
    }

    showError(message) {
        if (window.schoolWebsite) {
            window.schoolWebsite.showNotification(message, 'error');
        }
    }

    showModal(title, content) {
        // Implémentation d'une modal simple
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Fermer la modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.resultsSystem = new ResultsSystem();
});