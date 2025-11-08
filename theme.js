// theme.js

// Fonction pour activer le thème (sombre ou clair)
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.body.setAttribute('data-theme', themeName);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.checked = themeName === 'dark';
    }
}

// Fonction pour basculer le thème
function toggleTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// S'exécute quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    // Applique le thème sauvegardé (ou 'light' par défaut)
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Ajoute l'écouteur d'événement au bouton
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
});