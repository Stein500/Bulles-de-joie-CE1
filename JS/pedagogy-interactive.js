// Interactions pédagogiques
document.addEventListener('DOMContentLoaded', function() {
    initPedagogyTabs();
    initLearningPath();
    initSkillProgress();
});

function initPedagogyTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons et contenus
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activer le bouton et le contenu correspondant
            btn.classList.add('active');
            const tabId = 'tab-' + btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function initLearningPath() {
    const pathNodes = document.querySelectorAll('.path-node');
    
    pathNodes.forEach(node => {
        node.addEventListener('click', () => {
            pathNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            
            // Animation de transition
            showStepContent(node.getAttribute('data-step'));
        });
    });
}

function showStepContent(step) {
    // Logique pour afficher le contenu correspondant à l'étape
    console.log('Afficher l\'étape:', step);
}

function initSkillProgress() {
    const skills = document.querySelectorAll('.skill');
    
    skills.forEach(skill => {
        const skillName = skill.getAttribute('data-skill');
        const progress = getSkillProgress(skillName);
        
        setTimeout(() => {
            skill.style.width = progress + '%';
        }, 500);
    });
}

function getSkillProgress(skill) {
    const progressMap = {
        'socialisation': 85,
        'autonomie': 75,
        'motricite': 90,
        'lecture': 80,
        'mathematiques': 85,
        'expression': 88,
        'francais': 90,
        'anglais': 95,
        'sciences': 85
    };
    
    return progressMap[skill] || 75;
}