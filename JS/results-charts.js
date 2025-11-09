// results-system.js - Système complet de gestion des résultats
class ResultsSystem {
    constructor() {
        this.currentStudent = null;
        this.currentLanguage = 'fr';
        this.studentsData = this.getStudentsData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCharts();
        this.showWelcomeNotification();
    }

    getStudentsData() {
        return {
            "agblo": {
                name: "AGBLO AGONDJIHOSSOU Fifamè",
                password: "fifamè",
                notes: {
                    "Lecture": 19.25,
                    "Expression Écrite": 16.50,
                    "Dictée": 5,
                    "Éducation Sociale": 15,
                    "Éducation Scientifique": 15.25,
                    "Dessin": 14,
                    "Mathématiques": 15,
                    "Éducation Sportive": 17,
                    "Éducation Artistique": 12
                },
                comment: "Fifamè montre une excellente compréhension en lecture et une belle progression en expression écrite. Continuez à encourager la pratique de la dictée à la maison.",
                strengths: ["Lecture", "Expression Écrite"],
                improvements: ["Dictée"]
            },
            "akyoh": {
                name: "AKYOH Emmanuel",
                password: "emmanuel",
                notes: {
                    "Lecture": 7.50,
                    "Expression Écrite": 18.50,
                    "Dictée": 0,
                    "Éducation Sociale": 12,
                    "Éducation Scientifique": 7,
                    "Dessin": 14.50,
                    "Mathématiques": 5.25,
                    "Éducation Sportive": 18,
                    "Éducation Artistique": 13
                },
                comment: "Emmanuel excelle en expression écrite et en éducation sportive. Un effort particulier est nécessaire en dictée et en mathématiques.",
                strengths: ["Expression Écrite", "Éducation Sportive"],
                improvements: ["Dictée", "Mathématiques"]
            },
            "amadou": {
                name: "AMADOU Yinki",
                password: "yinki",
                notes: {
                    "Lecture": 15.5,
                    "Expression Écrite": 19,
                    "Dictée": 5,
                    "Éducation Sociale": 16.25,
                    "Éducation Scientifique": 7.75,
                    "Dessin": 15,
                    "Mathématiques": 13.25,
                    "Éducation Sportive": 17,
                    "Éducation Artistique": 14
                },
                comment: "Yinki a des talents certains en expression écrite. Son travail en éducation scientifique pourrait être renforcé.",
                strengths: ["Expression Écrite"],
                improvements: ["Éducation Scientifique"]
            },
            "bani": {
                name: "BANI Rahama",
                password: "rahama",
                notes: {
                    "Lecture": 13.75,
                    "Expression Écrite": 18.25,
                    "Dictée": 12,
                    "Éducation Sociale": 20,
                    "Éducation Scientifique": 17,
                    "Dessin": 14.5,
                    "Mathématiques": 7.25,
                    "Éducation Sportive": 18,
                    "Éducation Artistique": 15
                },
                comment: "Rahama brille particulièrement en éducation sociale où elle a obtenu la note maximale! Son engagement en mathématiques mériterait d'être soutenu.",
                strengths: ["Éducation Sociale", "Expression Écrite"],
                improvements: ["Mathématiques"]
            },
            "dahougou": {
                name: "DAHOUGOU Noham",
                password: "noham",
                notes: {
                    "Lecture": 15.25,
                    "Expression Écrite": 18.50,
                    "Dictée": 3,
                    "Éducation Sociale": 12,
                    "Éducation Scientifique": 8.75,
                    "Dessin": 13,
                    "Mathématiques": 5.75,
                    "Éducation Sportive": 18,
                    "Éducation Artistique": 14
                },
                comment: "Noham montre de belles capacités en expression écrite et en éducation sportive. La dictée et les mathématiques nécessitent un travail régulier supplémentaire.",
                strengths: ["Expression Écrite", "Éducation Sportive"],
                improvements: ["Dictée", "Mathématiques"]
            },
            "eda": {
                name: "EDA Queen",
                password: "queen",
                notes: {
                    "Lecture": 19,
                    "Expression Écrite": 18.25,
                    "Dictée": 4,
                    "Éducation Sociale": 13.75,
                    "Éducation Scientifique": 14.5,
                    "Dessin": 12,
                    "Mathématiques": 15.75,
                    "Éducation Sportive": 18,
                    "Éducation Artistique": 14
                },
                comment: "Queen possède d'excellentes compétences en lecture. Nous devons travailler ensemble sur la dictée pour améliorer son orthographe.",
                strengths: ["Lecture", "Expression Écrite"],
                improvements: ["Dictée"]
            },
            "houehou": {
                name: "HOUEHOU Méka",
                password: "méka",
                notes: {
                    "Lecture": 18.75,
                    "Expression Écrite": 19.5,
                    "Dictée": 9,
                    "Éducation Sociale": 15,
                    "Éducation Scientifique": 14,
                    "Dessin": 14.5,
                    "Mathématiques": 17.25,
                    "Éducation Sportive": 17,
                    "Éducation Artistique": 13
                },
                comment: "Méka est un élève très appliqué qui obtient d'excellents résultats dans la plupart des matières. Félicitations pour ce beau travail!",
                strengths: ["Expression Écrite", "Mathématiques", "Lecture"],
                improvements: []
            },
            "padonou": {
                name: "PADONOU Faith",
                password: "faith",
                notes: {
                    "Lecture": 19,
                    "Expression Écrite": 15.75,
                    "Dictée": 4,
                    "Éducation Sociale": 19,
                    "Éducation Scientifique": 17.25,
                    "Dessin": 15,
                    "Mathématiques": 13.75,
                    "Éducation Sportive": 18,
                    "Éducation Artistique": 13
                },
                comment: "Faith excelle en lecture et en éducation sociale. Continuez à l'encourager dans sa progression en expression écrite.",
                strengths: ["Lecture", "Éducation Sociale"],
                improvements: ["Expression Écrite"]
            },
            "sovi": {
                name: "SOVI Péniel",
                password: "péniel",
                notes: {
                    "Lecture": 12.5,
                    "Expression Écrite": 18.25,
                    "Dictée": 8,
                    "Éducation Sociale": 18.5,
                    "Éducation Scientifique": 16.5,
                    "Dessin": 13,
                    "Mathématiques": 16.25,
                    "Éducation Sportive": 17,
                    "Éducation Artistique": 14
                },
                comment: "Péniel montre de très bonnes aptitudes en éducation sociale et scientifique. Un petit effort en lecture serait bénéfique.",
                strengths: ["Éducation Sociale", "Éducation Scientifique"],
                improvements: ["Lecture"]
            },
            "tossavi": {
                name: "TOSSAVI Naelle",
                password: "naelle",
                notes: {
                    "Lecture": 19,
                    "Expression Écrite": 16.75,
                    "Dictée": 9,
                    "Éducation Sociale": 18,
                    "Éducation Scientifique": 18,
                    "Dessin": 15,
                    "Mathématiques": 12.25,
                    "Éducation Sportive": 17,
                    "Éducation Artistique": 14
                },
                comment: "Naelle a obtenu d'excellents résultats en lecture, éducation sociale et scientifique. Continuez sur cette belle lancée!",
                strengths: ["Lecture", "Éducation Sociale", "Éducation Scientifique"],
                improvements: ["Mathématiques"]
            }
        };
    }

    setupEventListeners() {
        // Navigation des onglets
        document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(item.dataset.tab);
            });
        });

        // Connexion
        document.getElementById('submitBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Affichage du mot de passe
        document.getElementById('togglePassword').addEventListener('click', this.togglePasswordVisibility);

        // Actions des résultats
        document.getElementById('printBtn').addEventListener('click', () => this.generatePrintableBulletin());
        document.getElementById('pdfBtn').addEventListener('click', () => this.exportToPDF());

        // Sélection d'élève
        document.getElementById('studentSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                const studentName = this.studentsData[e.target.value].name.split(' ')[1];
                document.getElementById('passwordInput').placeholder = `Prénom: ${studentName}`;
            }
        });
    }

    switchTab(tabId) {
        // Mise à jour de la navigation
        document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Affichage du contenu
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    togglePasswordVisibility() {
        const input = document.getElementById('passwordInput');
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }

    async handleLogin() {
        const studentId = document.getElementById('studentSelect').value;
        const password = document.getElementById('passwordInput').value.trim().toLowerCase();

        if (!studentId) {
            this.showNotification('Veuillez sélectionner un élève', 'warning');
            return;
        }

        if (!password) {
            this.showNotification('Veuillez entrer le mot de passe', 'warning');
            return;
        }

        const student = this.studentsData[studentId];
        
        if (password === student.password) {
            await this.performLoginAnimation();
            this.currentStudent = student;
            this.displayStudentResults(student);
            this.createCelebrationEffect();
            this.showNotification(`Bienvenue ${student.name.split(' ')[1]} ! 🎉`, 'success');
        } else {
            this.handleFailedLogin();
        }
    }

    async performLoginAnimation() {
        const btn = document.getElementById('submitBtn');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        btn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        btn.innerHTML = '<i class="fas fa-check"></i> Connecté !';
        await new Promise(resolve => setTimeout(resolve, 500));
        
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }

    displayStudentResults(student) {
        const resultsCard = document.getElementById('resultsCard');
        const container = document.getElementById('studentResultsContainer');
        
        const stats = this.calculateStatistics(student);
        
        container.innerHTML = this.generateResultsHTML(student, stats);
        resultsCard.style.display = 'block';
        
        this.setupCharts(student, stats);
        this.animateResultsAppearance();
        
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    calculateStatistics(student) {
        const notes = Object.values(student.notes);
        const average = notes.reduce((a, b) => a + b, 0) / notes.length;
        
        const bestSubject = Object.entries(student.notes).reduce((a, b) => a[1] > b[1] ? a : b);
        const worstSubject = Object.entries(student.notes).reduce((a, b) => a[1] < b[1] ? a : b);

        return {
            average: average.toFixed(2),
            bestSubject: bestSubject[0],
            bestNote: bestSubject[1],
            worstSubject: worstSubject[0],
            worstNote: worstSubject[1],
            total: notes.reduce((a, b) => a + b, 0).toFixed(2)
        };
    }

    generateResultsHTML(student, stats) {
        return `
            <div class="student-header">
                <h3 class="student-name">${student.name}</h3>
                <div class="student-meta">
                    <span class="class-badge">CE1</span>
                    <span class="period">Octobre 2025</span>
                </div>
            </div>

            <div class="stats-overview">
                <div class="stat-card main-stat">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Moyenne Générale</div>
                        <div class="stat-value">${stats.average}<small>/20</small></div>
                    </div>
                </div>
                
                <div class="stat-card success-stat">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Matière Excellente</div>
                        <div class="stat-value">${stats.bestSubject}</div>
                        <div class="stat-note">${stats.bestNote}/20</div>
                    </div>
                </div>
                
                <div class="stat-card improvement-stat">
                    <div class="stat-icon">
                        <i class="fas fa-target"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">À Renforcer</div>
                        <div class="stat-value">${stats.worstSubject}</div>
                        <div class="stat-note">${stats.worstNote}/20</div>
                    </div>
                </div>
            </div>

            <div class="results-content">
                <div class="charts-section">
                    <div class="chart-container">
                        <canvas id="performanceChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="subjectChart"></canvas>
                    </div>
                </div>

                <div class="grades-section">
                    <h4><i class="fas fa-list-ol"></i> Notes détaillées par matière</h4>
                    <div class="grades-grid">
                        ${Object.entries(student.notes).map(([subject, note]) => `
                            <div class="grade-item ${note < 10 ? 'low' : note >= 16 ? 'high' : ''}">
                                <div class="subject-name">${subject}</div>
                                <div class="grade-value">${note}/20</div>
                                <div class="grade-bar">
                                    <div class="grade-fill" style="width: ${(note / 20) * 100}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="teacher-comment-section">
                    <h4><i class="fas fa-comment-dots"></i> Commentaire de l'enseignant</h4>
                    <div class="teacher-comment">
                        <div class="comment-content">
                            <p>${student.comment}</p>
                        </div>
                        <div class="comment-meta">
                            <strong>CODJO J. Stein</strong>
                            <span>Enseignant CE1</span>
                        </div>
                    </div>
                </div>

                <div class="recommendations-section">
                    <h4><i class="fas fa-lightbulb"></i> Recommandations</h4>
                    <div class="recommendations-grid">
                        <div class="recommendation-card strength">
                            <div class="rec-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="rec-content">
                                <h5>Points Forts</h5>
                                <ul>
                                    ${student.strengths.map(strength => `<li>${strength}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="recommendation-card improvement">
                            <div class="rec-icon">
                                <i class="fas fa-bullseye"></i>
                            </div>
                            <div class="rec-content">
                                <h5>Axes d'Amélioration</h5>
                                <ul>
                                    ${student.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCharts(student, stats) {
        this.createPerformanceChart(student);
        this.createSubjectChart(student);
    }

    createPerformanceChart(student) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        const notes = Object.values(student.notes);
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: Object.keys(student.notes),
                datasets: [{
                    label: 'Performance',
                    data: notes,
                    backgroundColor: 'rgba(46, 134, 171, 0.2)',
                    borderColor: '#2E86AB',
                    borderWidth: 2,
                    pointBackgroundColor: '#2E86AB',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#2E86AB'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createSubjectChart(student) {
        const ctx = document.getElementById('subjectChart').getContext('2d');
        const subjects = Object.keys(student.notes);
        const notes = Object.values(student.notes);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Notes /20',
                    data: notes,
                    backgroundColor: subjects.map(subject => {
                        const note = student.notes[subject];
                        if (note >= 16) return '#27AE60';
                        if (note >= 10) return '#2E86AB';
                        return '#E74C3C';
                    }),
                    borderColor: subjects.map(subject => {
                        const note = student.notes[subject];
                        if (note >= 16) return '#1E8449';
                        if (note >= 10) return '#1A5A7A';
                        return '#C0392B';
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    animateResultsAppearance() {
        const elements = document.querySelectorAll('.stat-card, .grade-item, .recommendation-card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    generatePrintableBulletin() {
        if (!this.currentStudent) {
            this.showNotification('Aucun élève sélectionné', 'error');
            return;
        }

        const student = this.currentStudent;
        const stats = this.calculateStatistics(student);
        const bulletin = document.getElementById('printableBulletin');
        
        bulletin.innerHTML = this.createBulletinHTML(student, stats);
        bulletin.style.display = 'block';
        
        setTimeout(() => {
            window.print();
            bulletin.style.display = 'none';
        }, 500);
    }

    createBulletinHTML(student, stats) {
        return `
            <div class="bulletin-content">
                <div class="bulletin-header">
                    <div class="school-info">
                        <h1>École "Les Bulles de Joie"</h1>
                        <p>Crèche, Garderie, Maternelle et Primaire Bilingue</p>
                        <p>Bénin - Parakou - Zongo</p>
                    </div>
                    <div class="bulletin-title">
                        <h2>BULLETIN SCOLAIRE</h2>
                        <p>CE1 - Octobre 2025</p>
                    </div>
                </div>

                <div class="student-info">
                    <h3>Élève: ${student.name}</h3>
                    <div class="student-stats">
                        <div class="stat">Moyenne Générale: <strong>${stats.average}/20</strong></div>
                    </div>
                </div>

                <table class="grades-table">
                    <thead>
                        <tr>
                            <th>Matières</th>
                            <th>Notes/20</th>
                            <th>Appréciations</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(student.notes).map(([subject, note]) => `
                            <tr>
                                <td>${subject}</td>
                                <td class="note-cell ${note < 10 ? 'low' : note >= 16 ? 'high' : ''}">${note}</td>
                                <td>${this.getAppreciation(note)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="comment-section">
                    <h4>Commentaire de l'Enseignant:</h4>
                    <p>${student.comment}</p>
                </div>

                <div class="signatures">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p>CODJO J. Stein<br>Enseignant CE1</p>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p>SEGBO S. A. D. Carole<br>Directrice</p>
                    </div>
                </div>

                <div class="bulletin-footer">
                    <p>École Les Bulles de Joie - Parakou Zongo - Tél: +229 97 91 94 52</p>
                </div>
            </div>
        `;
    }

    getAppreciation(note) {
        if (note >= 16) return 'Excellent';
        if (note >= 14) return 'Très Bien';
        if (note >= 12) return 'Bien';
        if (note >= 10) return 'Assez Bien';
        if (note >= 8) return 'Passable';
        return 'Insuffisant';
    }

    exportToPDF() {
        this.showNotification('Fonctionnalité PDF en développement', 'info');
        // Implémentation PDF à ajouter avec jsPDF
    }

    createCelebrationEffect() {
        const colors = ['#2E86AB', '#FF7B54', '#27AE60', '#F1C40F'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    handleFailedLogin() {
        this.showNotification('Mot de passe incorrect. Vérifiez le prénom en minuscules.', 'error');
        const input = document.getElementById('passwordInput');
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => input.style.animation = '', 500);
    }

    showNotification(message, type = 'info') {
        // Implémentation des notifications
        console.log(`${type}: ${message}`);
    }

    showWelcomeNotification() {
        this.showNotification('Bienvenue sur le portail des résultats! 🎓', 'success');
    }
}

// Initialisation
let resultsSystem;
document.addEventListener('DOMContentLoaded', function() {
    resultsSystem = new ResultsSystem();
});