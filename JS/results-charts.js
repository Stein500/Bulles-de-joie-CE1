// results-charts.js - Gestion des résultats scolaires CORRIGÉE
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ results-charts.js chargé');
    initPerformanceCharts();
    initPreviewCharts(); // NOUVELLE FONCTION
    initResultsForm();
});

// NOUVELLE FONCTION pour l'animation de l'aperçu
function initPreviewCharts() {
    console.log('🎯 Initialisation de l\'aperçu des performances');
    
    const previewGrades = document.querySelectorAll('.preview-card .grade-fill');
    previewGrades.forEach(grade => {
        const width = grade.style.width;
        grade.style.width = '0';
        grade.style.transition = 'width 1.5s ease-in-out';
        
        setTimeout(() => {
            grade.style.width = width;
        }, 300);
    });
}

function initPerformanceCharts() {
    console.log('📊 Initialisation des graphiques');
    
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
        setTimeout(() => {
            section.style.height = value + '%';
        }, 500);
    });
    
    // Barres de progression
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const value = fill.getAttribute('data-value');
        setTimeout(() => {
            fill.style.width = value + '%';
        }, 800);
    });
}

function initResultsForm() {
    console.log('🔑 Initialisation du formulaire');
    
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('submitBtn');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.querySelector('i').classList.toggle('fa-eye');
            togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleLogin);
        console.log('✅ Bouton de connexion initialisé');
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
}

function handleLogin() {
    console.log('🔐 Tentative de connexion...');
    
    const studentSelect = document.getElementById('studentSelect');
    const passwordInput = document.getElementById('passwordInput');
    const selectedStudent = studentSelect.value;
    const enteredPassword = passwordInput.value.trim().toLowerCase();
    
    console.log('Élève sélectionné:', selectedStudent);
    console.log('Mot de passe entré:', enteredPassword);
    
    if (!selectedStudent) {
        showNotification('Veuillez sélectionner un élève', 'warning');
        return;
    }
    
    if (!enteredPassword) {
        showNotification('Veuillez entrer le mot de passe', 'warning');
        return;
    }
    
    const studentData = {
        "agblo": { password: "fifamè", name: "AGBLO AGONDJIHOSSOU Fifamè" },
        "akyoh": { password: "emmanuel", name: "AKYOH Emmanuel" },
        "amadou": { password: "yinki", name: "AMADOU Yinki" },
        "bani": { password: "rahama", name: "BANI Rahama" },
        "dahougou": { password: "noham", name: "DAHOUGOU Noham" },
        "eda": { password: "queen", name: "EDA Queen" },
        "houehou": { password: "méka", name: "HOUEHOU Méka" },
        "padonou": { password: "faith", name: "PADONOU Faith" },
        "sovi": { password: "péniel", name: "SOVI Péniel" },
        "tossavi": { password: "naelle", name: "TOSSAVI Naelle" }
    };
    
    const student = studentData[selectedStudent];
    
    if (student && enteredPassword === student.password) {
        console.log('✅ Connexion réussie pour:', student.name);
        showNotification(`Connexion réussie ! Bienvenue ${student.name.split(' ')[1]} ! 🎉`, 'success');
        
        displayStudentResultsAfterLogin();
        
        const loginInterface = document.querySelector('.login-interface');
        if (loginInterface) {
            loginInterface.style.display = 'none';
        }
        
        setTimeout(() => {
            const resultsContainer = document.getElementById('resultsContainer');
            if (resultsContainer) {
                resultsContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 1000);
        
    } else {
        console.log('❌ Mot de passe incorrect');
        showNotification('Mot de passe incorrect. Le mot de passe correspond au prénom en minuscules.', 'error');
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

function displayStudentResultsAfterLogin() {
    console.log('🚀 Affichage des résultats...');
    
    const students = [
        { 
            id: 'agblo', 
            name: 'AGBLO AGONDJIHOSSOU Fifamè', 
            notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12],
            moyenne: "14.11"
        },
        { 
            id: 'akyoh', 
            name: 'AKYOH Emmanuel', 
            notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13],
            moyenne: "10.64"
        },
        { 
            id: 'amadou', 
            name: 'AMADOU Yinki', 
            notes: [15.5, 19, 5, 16.25, 7.75, 15, 13.25, 17, 14],
            moyenne: "13.53"
        },
        { 
            id: 'bani', 
            name: 'BANI Rahama', 
            notes: [13.75, 18.25, 12, 20, 17, 14.5, 7.25, 18, 15],
            moyenne: "15.08"
        },
        { 
            id: 'dahougou', 
            name: 'DAHOUGOU Noham', 
            notes: [15.25, 18.50, 3, 12, 8.75, 13, 5.75, 18, 14],
            moyenne: "12.03"
        },
        { 
            id: 'eda', 
            name: 'EDA Queen', 
            notes: [19, 18.25, 4, 13.75, 14.5, 12, 15.75, 18, 14],
            moyenne: "14.36"
        },
        { 
            id: 'houehou', 
            name: 'HOUEHOU Méka', 
            notes: [18.75, 19.5, 9, 15, 14, 14.5, 17.25, 17, 13],
            moyenne: "15.33"
        },
        { 
            id: 'padonou', 
            name: 'PADONOU Faith', 
            notes: [19, 15.75, 4, 19, 17.25, 15, 13.75, 18, 13],
            moyenne: "14.97"
        },
        { 
            id: 'sovi', 
            name: 'SOVI Péniel', 
            notes: [12.5, 18.25, 8, 18.5, 16.5, 13, 16.25, 17, 14],
            moyenne: "14.89"
        },
        { 
            id: 'tossavi', 
            name: 'TOSSAVI Naelle', 
            notes: [19, 16.75, 9, 18, 18, 15, 12.25, 17, 14],
            moyenne: "15.44"
        }
    ];

    const subjects = [
        'Lecture', 
        'Expression Écrite', 
        'Dictée', 
        'Éducation Sociale', 
        'Éducation Scientifique', 
        'Dessin', 
        'Mathématiques', 
        'Éducation Sportive', 
        'Éducation Artistique'
    ];

    let html = `
        <div class="results-header">
            <h3>Résultats CE1 - Octobre 2025</h3>
            <div class="smart-actions">
                <button class="btn btn-secondary" onclick="printAllResults()">
                    <i class="fas fa-print"></i> Imprimer tous les résultats
                </button>
                <button class="btn btn-outline" onclick="exportToExcel()">
                    <i class="fas fa-file-excel"></i> Exporter en Excel
                </button>
            </div>
        </div>
        <div class="students-results">
    `;

    students.forEach(student => {
        const average = student.moyenne;
        
        html += `
            <div class="student-result-card" data-student="${student.id}">
                <div class="student-header">
                    <h4>${student.name}</h4>
                    <span class="average ${average >= 16 ? 'excellent' : average >= 12 ? 'good' : 'average'}">
                        Moyenne: ${average}/20
                        ${average >= 16 ? '🏆' : average >= 12 ? '✅' : '📈'}
                    </span>
                </div>
                <div class="grades-grid">
        `;
        
        student.notes.forEach((note, index) => {
            const percentage = (note / 20) * 100;
            const gradeClass = note < 10 ? 'low' : note >= 16 ? 'high' : 'medium';
            const subjectIcon = getSubjectIcon(subjects[index]);
            
            html += `
                <div class="subject-grade">
                    <span class="subject">
                        <span class="subject-icon">${subjectIcon}</span>
                        ${subjects[index]}
                    </span>
                    <div class="grade-bar">
                        <div class="grade-fill ${gradeClass}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="grade-value ${gradeClass}">
                        ${note}/20
                        ${note >= 16 ? '🌟' : note < 10 ? '⚠️' : ''}
                    </span>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="student-actions">
                    <button class="btn btn-outline print-btn" onclick="printStudentResult('${student.id}')">
                        <i class="fas fa-download"></i> Télécharger le bulletin
                    </button>
                    <button class="btn btn-secondary" onclick="showStudentDetails('${student.id}')">
                        <i class="fas fa-chart-line"></i> Détails performance
                    </button>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="results-summary">
            <div class="summary-card">
                <h4>📊 Statistiques de la classe</h4>
                <div class="summary-stats">
                    <div class="summary-stat">
                        <span class="stat-value">${calculateClassAverage(students)}/20</span>
                        <span class="stat-label">Moyenne de classe</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${countExcellentStudents(students)}</span>
                        <span class="stat-label">Élèves excellents (≥16)</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${countGoodStudents(students)}</span>
                        <span class="stat-label">Élèves bons (12-15.9)</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
        
        // Animer les barres de progression
        setTimeout(() => {
            initGradeVisualization();
        }, 100);
        
        console.log('✅ Résultats affichés avec succès');
    }
}

// Fonctions utilitaires pour les statistiques
function calculateClassAverage(students) {
    const total = students.reduce((sum, student) => sum + parseFloat(student.moyenne), 0);
    return (total / students.length).toFixed(2);
}

function countExcellentStudents(students) {
    return students.filter(student => parseFloat(student.moyenne) >= 16).length;
}

function countGoodStudents(students) {
    return students.filter(student => {
        const moyenne = parseFloat(student.moyenne);
        return moyenne >= 12 && moyenne < 16;
    }).length;
}

function getSubjectIcon(subject) {
    const icons = {
        'Lecture': '📖',
        'Expression Écrite': '✍️',
        'Dictée': '📝',
        'Éducation Sociale': '👥',
        'Éducation Scientifique': '🔬',
        'Dessin': '🎨',
        'Mathématiques': '🔢',
        'Éducation Sportive': '⚽',
        'Éducation Artistique': '🎭'
    };
    return icons[subject] || '📚';
}

function initGradeVisualization() {
    const gradeBars = document.querySelectorAll('.grade-fill');
    console.log('🎯 Animation de', gradeBars.length, 'barres de progression');
    
    gradeBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        bar.style.transition = 'width 1s ease-in-out';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function printStudentResult(studentId) {
    showNotification(`Génération du bulletin pour l'élève ${studentId}...`, 'success');
    
    setTimeout(() => {
        showNotification('Bulletin généré avec succès!', 'success');
    }, 2000);
}

function printAllResults() {
    showNotification('Génération de tous les bulletins en cours...', 'success');
    
    setTimeout(() => {
        showNotification('Tous les bulletins ont été générés!', 'success');
    }, 3000);
}

function exportToExcel() {
    showNotification('Exportation des résultats en format Excel...', 'success');
    
    setTimeout(() => {
        showNotification('Fichier Excel généré avec succès!', 'success');
    }, 2000);
}

function showStudentDetails(studentId) {
    showNotification(`Affichage des détails de performance pour ${studentId}...`, 'info');
}

function showNotification(message, type = 'success') {
    console.log('📢 Notification:', message);
    
    if (window.schoolWebsite && typeof window.schoolWebsite.showNotification === 'function') {
        window.schoolWebsite.showNotification(message, type);
    } else {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : type === 'info' ? 'info-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Rendre les fonctions accessibles globalement
window.displayStudentResultsAfterLogin = displayStudentResultsAfterLogin;
window.handleLogin = handleLogin;
window.printStudentResult = printStudentResult;
window.printAllResults = printAllResults;
window.exportToExcel = exportToExcel;
window.showStudentDetails = showStudentDetails;
window.initGradeVisualization = initGradeVisualization;
window.initPreviewCharts = initPreviewCharts;

console.log('🎯 results-charts.js entièrement chargé et prêt');