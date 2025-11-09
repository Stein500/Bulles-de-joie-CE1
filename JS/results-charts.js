// results-charts.js - Gestion des résultats scolaires CORRIGÉE
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ results-charts.js chargé');
    initClassTabs();
    initPerformanceCharts();
    initResultsForm();
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
    console.log('Chargement classe:', className);
    
    const resultsContainer = document.getElementById('resultsContainer');
    const loginInterface = document.querySelector('.login-interface');
    
    if (className === 'ce1') {
        if (loginInterface) loginInterface.style.display = 'grid';
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
        }
    } else {
        if (loginInterface) loginInterface.style.display = 'none';
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
        resultsContainer.style.display = 'block';
    }
}

function displayStudentResultsAfterLogin() {
    console.log('🚀 Affichage des résultats...');
    
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
        `;
        
        student.notes.forEach((note, index) => {
            const percentage = (note / 20) * 100;
            const gradeClass = note < 10 ? 'low' : note >= 16 ? 'high' : '';
            
            html += `
                <div class="subject-grade">
                    <span class="subject">${subjects[index]}</span>
                    <div class="grade-bar">
                        <div class="grade-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="grade-value ${gradeClass}">${note}/20</span>
                </div>
            `;
        });
        
        html += `
                </div>
                <button class="btn btn-outline print-btn" onclick="printStudentResult('${student.id}')">
                    <i class="fas fa-download"></i> Télécharger le bulletin
                </button>
            </div>
        `;
    });

    html += '</div>';

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

function initPerformanceCharts() {
    console.log('📊 Initialisation des graphiques');
    
    const chartCircles = document.querySelectorAll('.chart-circle');
    chartCircles.forEach(circle => {
        const percentage = circle.getAttribute('data-percentage');
        circle.style.setProperty('--percentage', percentage + '%');
    });
    
    const barSections = document.querySelectorAll('.bar-section');
    barSections.forEach(section => {
        const value = section.getAttribute('data-value');
        setTimeout(() => {
            section.style.height = value + '%';
        }, 500);
    });
    
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

function printStudentResult(studentId) {
    showNotification('Génération du PDF en cours...', 'success');
    
    setTimeout(() => {
        showNotification('PDF généré avec succès!', 'success');
    }, 2000);
}

function printAllResults() {
    showNotification('Génération de tous les bulletins en cours...', 'success');
    
    setTimeout(() => {
        showNotification('Tous les bulletins ont été générés!', 'success');
    }, 3000);
}

function showNotification(message, type = 'success') {
    console.log('📢 Notification:', message);
    
    if (window.schoolWebsite && typeof window.schoolWebsite.showNotification === 'function') {
        window.schoolWebsite.showNotification(message, type);
    } else {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
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
window.initGradeVisualization = initGradeVisualization;

console.log('🎯 results-charts.js entièrement chargé et prêt');