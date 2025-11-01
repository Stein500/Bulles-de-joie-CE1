// ===== SYSTÈME AMÉLIORÉ POUR RENDER =====
class SchoolResultsSystem {
    constructor() {
        this.studentsData = {
            "agblo": {
                name: "AGBLO AGONDJIHOSSOU Fifamè",
                password: "fifamè",
                notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12],
                comment: "Fifamè montre une excellente compréhension en lecture et une belle progression en expression écrite. Continuez à encourager la pratique de la dictée à la maison."
            },
            "akyoh": {
                name: "AKYOH Emmanuel",
                password: "emmanuel",
                notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13],
                comment: "Emmanuel excelle en expression écrite et en éducation sportive. Un effort particulier est nécessaire en dictée et en mathématiques. N'hésitez pas à revoir les bases avec lui."
            },
            "amadou": {
                name: "AMADOU Yinki",
                password: "yinki",
                notes: [15.5, 19, 5, 16.25, 7.75, 15, 13.25, 17, 14],
                comment: "Yinki a des talents certains en expression écrite. Son travail en éducation scientifique pourrait être renforcé par des exercices pratiques à la maison."
            },
            "bani": {
                name: "BANI Rahama",
                password: "rahama",
                notes: [13.75, 18.25, 12, 20, 17, 14.5, 7.25, 18, 15],
                comment: "Rahama brille particulièrement en éducation sociale où elle a obtenu la note maximale! Son engagement en mathématiques mériterait d'être soutenu."
            },
            "dahougou": {
                name: "DAHOUGOU Noham",
                password: "noham",
                notes: [15.25, 18.50, 3, 12, 8.75, 13, 5.75, 18, 14],
                comment: "Noham montre de belles capacités en expression écrite et en éducation sportive. La dictée et les mathématiques nécessitent un travail régulier supplémentaire."
            },
            "eda": {
                name: "EDA Queen",
                password: "queen",
                notes: [19, 18.25, 4, 13.75, 14.5, 12, 15.75, 18, 14],
                comment: "Queen possède d'excellentes compétences en lecture. Nous devons travailler ensemble sur la dictée pour améliorer son orthographe."
            },
            "houehou": {
                name: "HOUEHOU Méka",
                password: "méka",
                notes: [18.75, 19.5, 9, 15, 14, 14.5, 17.25, 17, 13],
                comment: "Méka est un élève très appliqué qui obtient d'excellents résultats dans la plupart des matières. Félicitations pour ce beau travail!"
            },
            "padonou": {
                name: "PADONOU Faith",
                password: "faith",
                notes: [19, 15.75, 4, 19, 17.25, 15, 13.75, 18, 13],
                comment: "Faith excelle en lecture et en éducation sociale. Continuez à l'encourager dans sa progression en expression écrite."
            },
            "sovi": {
                name: "SOVI Péniel",
                password: "péniel",
                notes: [12.5, 18.25, 8, 18.5, 16.5, 13, 16.25, 17, 14],
                comment: "Péniel montre de très bonnes aptitudes en éducation sociale et scientifique. Un petit effort en lecture serait bénéfique."
            },
            "tossavi": {
                name: "TOSSAVI Naelle",
                password: "naelle",
                notes: [19, 16.75, 9, 18, 18, 15, 12.25, 17, 14],
                comment: "Naelle a obtenu d'excellents résultats en lecture, éducation sociale et scientifique. Continuez sur cette belle lancée!"
            }
        };

        this.subjects = [
            "Lecture", "Expression Écrite", "Dictée", "Éducation Sociale", 
            "Éducation Scientifique", "Dessin", "Mathématiques", 
            "Éducation Sportive", "Éducation Artistique"
        ];

        this.currentLevel = 'ce1';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLevelNavigation();
        this.showNotification('Bienvenue sur Les Bulles de Joie ! 🌟', 'success');
    }

    setupEventListeners() {
        const submitBtn = document.getElementById('submitBtn');
        const passwordInput = document.getElementById('passwordInput');
        const studentSelect = document.getElementById('studentSelect');

        submitBtn.addEventListener('click', () => this.handleLogin());
        
        studentSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                const studentName = this.studentsData[e.target.value].name.split(' ')[1];
                passwordInput.placeholder = `Prénom: ${studentName}`;
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    }

    setupLevelNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const level = button.dataset.level;
                
                // Désactiver tous les boutons
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Activer le bouton cliqué
                button.classList.add('active');
                
                // Changer le niveau actuel
                this.currentLevel = level;
                
                // Afficher un message selon le niveau
                if (level === 'ce1') {
                    this.showNotification('Affichage des résultats du CE1', 'success');
                } else {
                    this.showNotification(`Les résultats du ${level.toUpperCase()} seront bientôt disponibles !`, 'warning');
                }
            });
        });
    }

    async handleLogin() {
        const selectedStudent = document.getElementById('studentSelect').value;
        const enteredPassword = document.getElementById('passwordInput').value.trim().toLowerCase();

        if (!selectedStudent) {
            this.showNotification('Veuillez sélectionner un élève', 'warning');
            return;
        }

        if (!enteredPassword) {
            this.showNotification('Veuillez entrer le mot de passe', 'warning');
            return;
        }

        const student = this.studentsData[selectedStudent];
        
        if (enteredPassword === student.password) {
            await this.performLoginAnimation();
            this.displayResults(student);
            this.createCelebrationEffect();
            this.showNotification(`Bienvenue ${student.name.split(' ')[1]} ! 🎉`, 'success');
        } else {
            this.handleFailedLogin();
        }
    }

    async performLoginAnimation() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        submitBtn.innerHTML = '<i class="fas fa-check"></i> Connecté !';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }

    displayResults(student) {
        const stats = this.calculateStats(student);
        const resultsContainer = document.getElementById('resultsContainer');
        
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = this.generateResultsHTML(student, stats);
        
        this.setupResultsInteractions(student, stats);
        this.animateResultsAppearance();
        
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    calculateStats(student) {
        const notes = student.notes;
        const average = notes.reduce((a, b) => a + b, 0) / notes.length;
        
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

        return {
            average: average.toFixed(2),
            bestSubject: this.subjects[bestSubjectIndex],
            bestNote: bestNote,
            worstSubject: this.subjects[worstSubjectIndex],
            worstNote: worstNote
        };
    }

    generateResultsHTML(student, stats) {
        return `
            <h3 class="student-name">${student.name}</h3>
            
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-title">Moyenne Générale</div>
                    <div class="stat-value">${stats.average}/20</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Matière Excellente</div>
                    <div class="stat-value stat-highlight">${stats.bestSubject}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Meilleure Note</div>
                    <div class="stat-value">${stats.bestNote}/20</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">À Renforcer</div>
                    <div class="stat-value">${stats.worstSubject}</div>
                </div>
            </div>
            
            <div class="table-container">
                <table class="grades-table">
                    <thead>
                        <tr>
                            ${this.subjects.map(subject => `<th>${subject}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${student.notes.map((note, index) => {
                                let noteClass = '';
                                if (note < 5) noteClass = 'low-note';
                                if (note >= 18) noteClass = 'high-note';
                                
                                return `<td class="note-cell ${noteClass}">${note}
                                            <div class="note-bar" style="transform: scaleX(${note/20})"></div>
                                        </td>`;
                            }).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="scroll-hint">
                <i class="fas fa-arrows-left-right"></i> Faites défiler pour voir toutes les matières
            </div>
            
            <div class="teacher-comment">
                <div class="comment-title">Commentaire de l'enseignant :</div>
                <p>${student.comment}</p>
            </div>
            
            <div class="smart-actions">
                <button class="btn" id="printBulletinBtn">
                    <i class="fas fa-print"></i> Imprimer le bulletin
                </button>
            </div>
        `;
    }

    setupResultsInteractions(student, stats) {
        document.getElementById('printBulletinBtn').addEventListener('click', () => {
            this.hideBulletin();
            this.generatePrintableBulletin(student, stats);
        });
    }

    hideBulletin() {
        document.getElementById('printable-bulletin').style.display = 'none';
    }

    generatePrintableBulletin(student, stats) {
        const bulletin = document.getElementById('printable-bulletin');
        bulletin.style.display = 'block';
        bulletin.innerHTML = `
            <button class="close-btn" onclick="schoolSystem.hideBulletin()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="bulletin-content">
                <div class="bulletin-header">
                    <h2 style="color: var(--primary); margin-bottom: 5px; font-size: 2.2rem;">École "Les Bulles de Joie"</h2>
                    <h3 style="color: var(--secondary); font-size: 1.5rem;">Bulletin Scolaire - CE1 - Octobre 2025</h3>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; font-size: 1.3rem;">
                        Élève: ${student.name}
                    </h4>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary);">
                        <strong>Moyenne Générale:</strong><br>
                        <span style="font-size: 1.4rem; font-weight: bold; color: var(--primary);">${stats.average}/20</span>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid var(--accent);">
                        <strong>Matière Excellente:</strong><br>
                        <span style="font-size: 1.2rem; font-weight: bold; color: var(--accent);">${stats.bestSubject}</span><br>
                        <small>${stats.bestNote}/20</small>
                    </div>
                </div>
                
                <div style="overflow-x: auto; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 700px; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: var(--primary); color: white;">
                                ${this.subjects.map(subject => `
                                    <th style="padding: 12px; text-align: center; border: 1px solid #ddd; font-weight: 600;">${subject}</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                ${student.notes.map(note => `
                                    <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-weight: bold; font-size: 1.1rem;">
                                        ${note}
                                    </td>
                                `).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--accent);">
                    <strong style="color: var(--primary);">Commentaire de l'enseignant:</strong><br>
                    <p style="margin-top: 10px; line-height: 1.6;">${student.comment}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--primary);">
                    <div style="text-align: center;">
                        <div style="border-top: 1px solid #000; width: 200px; margin: 10px 0;"></div>
                        <div><strong>C. J. S. Stein</strong></div>
                        <div><em>Enseignant</em></div>
                    </div>
                    <div style="text-align: center;">
                        <div style="border-top: 1px solid #000; width: 200px; margin: 10px 0;"></div>
                        <div><strong>SEGBO S. A. D. Carole</strong></div>
                        <div><em>Directrice</em></div>
                    </div>
                </div>
            </div>
            
            <div class="bulletin-actions">
                <button class="btn no-print" onclick="window.print()">
                    <i class="fas fa-print"></i> Imprimer le bulletin
                </button>
                <button class="btn btn-close no-print" onclick="schoolSystem.hideBulletin()">
                    <i class="fas fa-times"></i> Fermer
                </button>
            </div>
        `;
        
        bulletin.scrollIntoView({ behavior: 'smooth' });
    }

    animateResultsAppearance() {
        const elements = document.querySelectorAll('.stat-card, .note-cell');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        setTimeout(() => {
            document.querySelectorAll('.note-bar').forEach(bar => {
                bar.style.transform = 'scaleX(1)';
            });
        }, 500);
    }

    createCelebrationEffect() {
        const colors = ['#2E86AB', '#FF7B54', '#27AE60', '#F1C40F', '#9B59B6'];
        
        for (let i = 0; i < 120; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    width: ${Math.random() * 12 + 8}px;
                    height: ${Math.random() * 12 + 8}px;
                    animation-delay: ${Math.random() * 2}s;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 15);
        }
    }

    handleFailedLogin() {
        this.showNotification('Mot de passe incorrect. Vérifiez le prénom en minuscules.', 'error');
        this.createErrorEffect();
    }

    createErrorEffect() {
        const passwordInput = document.getElementById('passwordInput');
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialisation
let schoolSystem;
document.addEventListener('DOMContentLoaded', function() {
    schoolSystem = new SchoolResultsSystem();
    
    // Styles dynamiques
    const dynamicStyles = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .smart-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        @media (max-width: 768px) {
            .smart-actions {
                flex-direction: column;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
});

// Exposition globale
window.schoolSystem = schoolSystem;