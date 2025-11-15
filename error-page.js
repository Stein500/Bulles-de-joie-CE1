class ErrorPageManager {
    constructor() {
        this.searchData = [];
        this.initialize();
    }

    initialize() {
        this.loadSearchData();
        this.setupSearch();
        this.setupAnimations();
        this.trackError();
        this.setupSmartRedirect();
    }

    loadSearchData() {
        // Données de recherche pour les suggestions intelligentes
        this.searchData = [
            { title: "Page d'Accueil", url: "index.html", category: "navigation" },
            { title: "Notre École", url: "apropos.html", category: "information" },
            { title: "Notre Pédagogie", url: "pedagogie.html", category: "information" },
            { title: "Activités Scolaires", url: "activites.html", category: "activités" },
            { title: "Résultats", url: "resultats.html", category: "académique" },
            { title: "Contact et Inscription", url: "contact.html", category: "contact" },
            { title: "Inscription 2025-2026", url: "inscription.html", category: "inscription" },
            { title: "Crèche et Garderie", url: "index.html#creche", category: "services" },
            { title: "Maternelle Bilingue", url: "index.html#maternelle", category: "services" },
            { title: "Primaire Bilingue", url: "index.html#primaire", category: "services" },
            { title: "Art Oratoire", url: "activites.html#oratory", category: "activités" },
            { title: "Jardinage Pédagogique", url: "activites.html#gardening", category: "activités" },
            { title: "Éveil Musical", url: "activites.html#music", category: "activités" },
            { title: "Horaires et Tarifs", url: "contact.html#horaires", category: "information" },
            { title: "Direction", url: "contact.html#direction", category: "contact" }
        ];
    }

    setupSearch() {
        const searchInput = document.getElementById('errorSearch');
        const suggestionsContainer = document.getElementById('searchSuggestions');

        if (searchInput && suggestionsContainer) {
            // Recherche en temps réel
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                this.showSuggestions(query, suggestionsContainer);
            });

            // Recherche à la soumission
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });

            // Focus automatique sur la recherche
            setTimeout(() => {
                searchInput.focus();
            }, 1000);
        }
    }

    showSuggestions(query, container) {
        container.innerHTML = '';

        if (query.length < 2) {
            // Suggestions populaires
            const popularSuggestions = this.searchData
                .filter(item => item.category === 'navigation' || item.category === 'services')
                .slice(0, 4);

            popularSuggestions.forEach(item => {
                const suggestion = this.createSuggestionElement(item, true);
                container.appendChild(suggestion);
            });
            return;
        }

        // Recherche intelligente
        const suggestions = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (suggestions.length > 0) {
            suggestions.forEach(item => {
                const suggestion = this.createSuggestionElement(item);
                container.appendChild(suggestion);
            });
        } else {
            // Aucun résultat
            const noResult = document.createElement('div');
            noResult.className = 'suggestion-item';
            noResult.textContent = 'Aucun résultat trouvé. Essayez d\'autres termes.';
            noResult.style.opacity = '0.7';
            noResult.style.cursor = 'default';
            container.appendChild(noResult);
        }
    }

    createSuggestionElement(item, isPopular = false) {
        const element = document.createElement('a');
        element.href = item.url;
        element.className = 'suggestion-item';
        
        if (isPopular) {
            element.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-star" style="color: var(--vert-citron);"></i>
                    <span>${item.title}</span>
                </div>
            `;
        } else {
            element.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${item.title}</span>
                    <small style="opacity: 0.7; text-transform: capitalize;">${item.category}</small>
                </div>
            `;
        }

        element.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo(item.url, item.title);
        });

        return element;
    }

    performSearch(query) {
        if (!query.trim()) return;

        // Recherche exacte d'abord
        const exactMatch = this.searchData.find(item =>
            item.title.toLowerCase() === query.toLowerCase()
        );

        if (exactMatch) {
            this.navigateTo(exactMatch.url, exactMatch.title);
            return;
        }

        // Recherche partielle
        const matches = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (matches.length === 1) {
            this.navigateTo(matches[0].url, matches[0].title);
        } else if (matches.length > 1) {
            // Afficher les résultats multiples
            this.showSearchResults(matches, query);
        } else {
            // Recherche étendue
            this.showExtendedSearchSuggestions(query);
        }
    }

    showSearchResults(results, query) {
        const container = document.getElementById('searchSuggestions');
        container.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'suggestion-item';
        header.style.background = 'var(--rose-fuchsia)';
        header.style.color = 'white';
        header.style.cursor = 'default';
        header.textContent = `Résultats pour "${query}"`;
        container.appendChild(header);

        results.forEach(item => {
            const element = this.createSuggestionElement(item);
            container.appendChild(element);
        });
    }

    showExtendedSearchSuggestions(query) {
        // Suggestions basées sur une analyse sémantique simple
        const relatedTerms = this.findRelatedTerms(query);
        const container = document.getElementById('searchSuggestions');
        
        container.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'suggestion-item';
        header.style.background = 'var(--vert-citron)';
        header.style.color = 'var(--noir)';
        header.style.cursor = 'default';
        header.textContent = `Essayez avec ces termes :`;
        container.appendChild(header);

        relatedTerms.forEach(term => {
            const element = document.createElement('div');
            element.className = 'suggestion-item';
            element.style.cursor = 'pointer';
            element.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-search" style="opacity: 0.7;"></i>
                    <span>${term}</span>
                </div>
            `;

            element.addEventListener('click', () => {
                document.getElementById('errorSearch').value = term;
                this.performSearch(term);
            });

            container.appendChild(element);
        });
    }

    findRelatedTerms(query) {
        const termMap = {
            'inscri': ['inscription', 'admission', 'formulaire inscription'],
            'contact': ['coordonnées', 'téléphone', 'email', 'adresse'],
            'result': ['bulletin', 'notes', 'évaluations', 'académique'],
            'activ': ['art oratoire', 'jardinage', 'musique', 'danse'],
            'pedagog': ['méthode', 'enseignement', 'apprentissage'],
            'tarif': ['frais', 'coût', 'prix', 'écolage'],
            'horaire': ['emploi du temps', 'heures', 'ouverture']
        };

        const related = new Set();
        
        for (const [key, terms] of Object.entries(termMap)) {
            if (query.toLowerCase().includes(key)) {
                terms.forEach(term => related.add(term));
            }
        }

        // Ajouter des termes génériques si pas de correspondance
        if (related.size === 0) {
            return ['inscription', 'contact', 'activités', 'horaires'];
        }

        return Array.from(related).slice(0, 4);
    }

    navigateTo(url, title) {
        // Animation de transition
        this.animateNavigation();

        // Tracking
        this.trackNavigation(url, title);

        // Redirection
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    animateNavigation() {
        const content = document.querySelector('.error-content');
        if (content) {
            content.style.transform = 'translateY(50px)';
            content.style.opacity = '0';
            content.style.transition = 'all 0.5s ease';
        }

        // Animation des bulles accélérée
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.style.animationDuration = '2s';
        });
    }

    setupAnimations() {
        // Animation interactive des bulles
        document.addEventListener('mousemove', (e) => {
            this.createInteractiveBubble(e.clientX, e.clientY);
        });

        // Animation aléatoire supplémentaire
        setInterval(() => {
            this.createRandomBubble();
        }, 3000);
    }

    createInteractiveBubble(x, y) {
        if (Math.random() > 0.3) return; // 30% de chance

        const bubble = document.createElement('div');
        bubble.className = 'bubble interactive';
        bubble.style.left = x + 'px';
        bubble.style.top = y + 'px';
        bubble.style.width = '20px';
        bubble.style.height = '20px';
        bubble.style.animation = 'floatUp 8s ease-out forwards';

        document.querySelector('.bubble-animation').appendChild(bubble);

        // Nettoyage automatique
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 8000);
    }

    createRandomBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble random';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = (20 + Math.random() * 40) + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.animation = `floatUp ${15 + Math.random() * 10}s ease-in forwards`;
        bubble.style.animationDelay = (Math.random() * 5) + 's';

        document.querySelector('.bubble-animation').appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 25000);
    }

    trackError() {
        // Analytics pour la page 404
        const errorData = {
            page: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        console.log('🔍 Erreur 404 trackée:', errorData);

        // Envoyer aux analytics si disponible
        if (window.analyticsManager) {
            window.analyticsManager.logEvent('page_404', errorData);
        }

        // Stocker localement pour debug
        this.storeErrorLocally(errorData);
    }

    storeErrorLocally(errorData) {
        const errors = JSON.parse(localStorage.getItem('404_errors') || '[]');
        errors.push(errorData);
        
        // Garder seulement les 10 dernières erreurs
        if (errors.length > 10) {
            errors.shift();
        }
        
        localStorage.setItem('404_errors', JSON.stringify(errors));
    }

    setupSmartRedirect() {
        // Redirection intelligente basée sur le referrer
        const referrer = document.referrer;
        
        if (referrer && referrer.includes(window.location.origin)) {
            // Le visiteur vient de notre site
            setTimeout(() => {
                this.suggestRedirect(referrer);
            }, 3000);
        }
    }

    suggestRedirect(referrer) {
        // Analyser la page précédente pour suggérer une redirection pertinente
        const fromContact = referrer.includes('contact');
        const fromActivities = referrer.includes('activites');
        const fromResults = referrer.includes('resultats');

        let suggestion = null;

        if (fromContact) {
            suggestion = {
                title: "Retour au Contact",
                url: "contact.html",
                message: "Vous consultiez notre page contact"
            };
        } else if (fromActivities) {
            suggestion = {
                title: "Retour aux Activités",
                url: "activites.html", 
                message: "Vous découvriez nos activités"
            };
        } else if (fromResults) {
            suggestion = {
                title: "Retour aux Résultats", 
                url: "resultats.html",
                message: "Vous consultiez les résultats"
            };
        }

        if (suggestion) {
            this.showRedirectSuggestion(suggestion);
        }
    }

    showRedirectSuggestion(suggestion) {
        const suggestionElement = document.createElement('div');
        suggestionElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: var(--noir);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.5s ease;
        `;

        suggestionElement.innerHTML = `
            <div style="margin-bottom: 0.5rem; font-weight: 600;">💡 Suggestion</div>
            <div style="margin-bottom: 1rem; font-size: 0.9rem;">${suggestion.message}</div>
            <button onclick="this.parentElement.remove(); window.location.href='${suggestion.url}'" 
                    style="background: var(--rose-fuchsia); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; width: 100%;">
                ${suggestion.title}
            </button>
        `;

        document.body.appendChild(suggestionElement);

        // Fermeture automatique après 10 secondes
        setTimeout(() => {
            if (suggestionElement.parentNode) {
                suggestionElement.remove();
            }
        }, 10000);
    }

    trackNavigation(url, title) {
        if (window.analyticsManager) {
            window.analyticsManager.logEvent('404_redirect', {
                from: window.location.href,
                to: url,
                title: title,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Fonction globale pour la recherche
function searchSite() {
    const searchInput = document.getElementById('errorSearch');
    if (searchInput && searchInput.value.trim()) {
        window.errorPageManager.performSearch(searchInput.value.trim());
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.errorPageManager = new ErrorPageManager();
});

// Service Worker pour la page 404
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('✅ Service Worker enregistré pour la page 404'))
            .catch(error => console.log('❌ Erreur Service Worker:', error));
    });
}