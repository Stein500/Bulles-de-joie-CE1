
// results-charts.js - Gestion des résultats scolaires
document.addEventListener('DOMContentLoaded', function() {
    initClassTabs();
    initGradeVisualization();
    initPerformanceCharts();
    initResultsForm();
    loadCE1Results();
});

function initClassTabs() {
    const classTabs = document.querySelectorAll('.class-tab');
    
    classTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            classTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const className = tab.getAttribute('data-class');
            loadClassResults(className);
        });
    });
}

function loadClassResults(className) {
    // Simulation du chargement des résultats
    console.log('Chargement des résultats pour:', className);
    
    // Animation de chargement
    const previewCard = document.querySelector('.preview-card');
    if (previewCard) {
        previewCard.style.opacity = '0.5';
        
        setTimeout(() => {
            previewCard.style.opacity = '1';
            updatePreviewGrades(className);
        }, 1000);
    }
    
    // Charger les résultats spécifiques
    if (className === 'ce1') {
        loadCE1Results();
    } else {
        showComingSoon(className);
    }
}

function showComingSoon(className) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="coming-soon-message">
                <div class="coming-soon-icon">⏳</div>
                <h3>Disponible Bientôt</h3>
                <p>Les résultats pour la classe ${className.toUpperCase()} seront disponibles prochainement.</p>
            </div>
        `;
    }
}

function loadCE1Results() {
    const students = [
        { id: 'agblo', name: 'AGBLO AGONDJIHOSSOU Fifamè', notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12] },
        { id: 'akyoh', name: 'AKYOH Emmanuel', notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13] },
        { id: 'amadou', name: 'AMADOU Yinki', notes: [15.5, 19, 5, 16.25, 7.75, 15, 13.25, 17, 14] },
        { id: 'bani', name: 'BANI Rahama', notes: [13.75, 18.25, 12, 20, 17, 14.5, 7.25, 18, 15] },
        { id: 'dahougou', name: 'DAHOUGOU Noham', notes: [15.25, 18.50, 3, 12, 8.75, 13, 5.75, 18, 14] },
        { id: 'eda', name: 'EDA Queen', notes: [19, 18.25, 4, 13.75, 14.5, 12, 15.75, 18, 14] },
        { id: 'houehou', name: 'HOUEHOU Méka', notes: [18.75, 19.5, 9, 15, 14, 14.5, 17.25, 17, 13] },
        { id: 'padonou', name: 'PADONOU Faith', notes: [19, 15.75, 4, 19, 17.25, 15, 13.75, 18, 13] },
        { id: 'sovi', name: 'SOVI Péniel', notes: [12.5, 18.25, 8, 18.5, 16.5, 13, 16.25, 17, 14] },
        { id: 'tossavi', name: 'TOSSAVI Naelle', notes: [19, 16.75, 9, 18, 18, 15, 12.25, 17, 14] }
    ];

    const subjects = ['Lecture', 'Expression Écrite', 'Dictée', 'Éducation Sociale', 'Éducation Scientifique', 'Dessin', 'Mathématiques', 'Éducation Sportive', 'Éducation Artistique'];

    let html = `
        <div class="results-header">
            <h3>Résultats CE1 - Octobre 2025</h3>
            <button class="btn btn-secondary" onclick="printAllResults()">
                <i class="fas fa-print"></i> Imprimer tous les résultats
            </button>
        </div>
        <div class="students-results">
    `;

    students.forEach(student => {
        const average = (student.notes.reduce((a, b) => a + b, 0) / student.notes.length).toFixed(2);
        
        html += `
            <div class="student-result-card">
                <div class="student-header">
                    <h4>${student.name}</h4>
                    <span class="average">Moyenne: ${average}/20</span>
                </div>
                <div class="grades-grid">
                    ${student.notes.map((note, index) => `
                        <div class="subject-grade">
                            <span class="subject">${subjects[index]}</span>
                            <div class="grade-bar">
                                <div class="grade-fill" style="width: ${(note / 20) * 100}%"></div>
                                <span class="grade-value ${note < 10 ? 'low' : note >= 16 ? 'high' : ''}">${note}/20</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-outline print-btn" onclick="printStudentResult('${student.id}')">
                    <i class="fas fa-download"></i> PDF
                </button>
            </div>
        `;
    });

    html += '</div>';

    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = html;
        initGradeVisualization();
    }
}

function updatePreviewGrades(className) {
    const gradeData = {
        'ci': { math: 14, french: 15, english: 16 },
        'cp': { math: 15, french: 14, english: 17 },
        'ce1': { math: 16, french: 14, english: 18 },
        'ce2': { math: 15, french: 16, english: 17 }
    };
    
    const data = gradeData[className] || gradeData.ce1;
    
    // Mettre à jour les barres de progression
    const mathBar = document.querySelector('[data-grade="math"]');
    const frenchBar = document.querySelector('[data-grade="french"]');
    const englishBar = document.querySelector('[data-grade="english"]');
    
    if (mathBar) mathBar.style.width = (data.math / 20 * 100) + '%';
    if (frenchBar) frenchBar.style.width = (data.french / 20 * 100) + '%';
    if (englishBar) englishBar.style.width = (data.english / 20 * 100) + '%';
}

function initGradeVisualization() {
    const gradeBars = document.querySelectorAll('.grade-fill');
    
    gradeBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

function initPerformanceCharts() {
    // Graphiques circulaires
    const chartCircles = document.querySelectorAll('.chart-circle');
    chartCircles.forEach(circle => {
        const percentage = circle.getAttribute('data-percentage');
        circle.style.setProperty('--percentage', percentage + '%');
    });
    
    // Barres de performance
    const barSections = document.querySelectorAll('.bar-section');
    barSections.forEach(section => {
        const value = section.getAttribute('data-value');
        section.style.height = value + '%';
    });
    
    // Barres de progression
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const value = fill.getAttribute('data-value');
        fill.style.width = value + '%';
    });
}

function initResultsForm() {
    const resultsForm = document.querySelector('.results-form');
    
    if (resultsForm) {
        resultsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentSelect = this.querySelector('.student-select');
            const passwordInput = this.querySelector('.password-input');
            
            if (studentSelect.value && passwordInput.value) {
                // Simulation de connexion réussie
                showStudentResults(studentSelect.value);
            } else {
                showNotification('Veuillez remplir tous les champs', 'error');
            }
        });
    }
}

function showStudentResults(studentId) {
    // Simulation de l'affichage des résultats
    const modal = document.createElement('div');
    modal.className = 'results-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Résultats de l'élève</h3>
            <div class="student-grades">
                <!-- Contenu des résultats -->
            </div>
            <button class="btn btn-primary close-modal">Fermer</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation d'entrée
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Fermeture du modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
}

function printStudentResult(studentId) {
    // Simulation de génération de PDF
    showNotification('Génération du PDF en cours...', 'success');
    
    setTimeout(() => {
        showNotification('PDF généré avec succès!', 'success');
    }, 2000);
}

function printAllResults() {
    showNotification('Génération de tous les PDF en cours...', 'success');
    
    setTimeout(() => {
        showNotification('Tous les PDF ont été générés!', 'success');
    }, 3000);
}

function showNotification(message, type = 'success') {
    if (window.schoolWebsite) {
        window.schoolWebsite.showNotification(message, type);
    } else {
        // Fallback simple
        alert(message);
    }
}
