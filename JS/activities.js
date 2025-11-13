// activities.js - Gestion des activités
document.addEventListener('DOMContentLoaded', function() {
    initActivities();
});

function initActivities() {
    // Gestion des catégories d'activités
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons et contenus
            categoryBtns.forEach(b => b.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));
            
            // Activer le bouton et le contenu correspondant
            btn.classList.add('active');
            const categoryId = btn.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });
    
    // Animation des cartes d'activités
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}