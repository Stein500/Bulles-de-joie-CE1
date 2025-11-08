// Graphiques et visualisations des résultats
document.addEventListener('DOMContentLoaded', function() {
    initClassTabs();
    initGradeVisualization();
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
    // Simulation du chargement des résultats
    console.log('Chargement des résultats pour:', className);
    
    // Animation de chargement
    const previewCard = document.querySelector('.preview-card');
    previewCard.style.opacity = '0.5';
    
    setTimeout(() => {
        previewCard.style.opacity = '1';
        updatePreviewGrades(className);
    }, 1000);
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
    document.querySelector('[data-grade="math"]').style.width = (data.math / 20 * 100) + '%';
    document.querySelector('[data-grade="french"]').style.width = (data.french / 20 * 100) + '%';
    document.querySelector('[data-grade="english"]').style.width = (data.english / 20 * 100) + '%';
}

function initGradeVisualization() {
    const gradeBars = document.querySelectorAll('.grade-fill');
    
    gradeBars.forEach(bar => {
        const grade = parseInt(bar.getAttribute('data-grade'));
        const percentage = (grade / 20) * 100;
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
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