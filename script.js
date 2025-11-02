// ===== SYSTÈME AMÉLIORÉ POUR RENDER =====
class SchoolResultsSystem {
    constructor() {
        this.currentLanguage = 'fr';
        this.translations = {
            fr: {
                'subtitle': 'Résultats du CE1 - Octobre 2025',
                'teacher': 'Enseignant',
                'director': 'Directrice',
                'access-results': 'Accès aux résultats',
                'access-description': 'Pour consulter les résultats de votre enfant, veuillez saisir le mot de passe qui vous a été communiqué.',
                'select-student': 'Sélectionnez l\'élève :',
                'choose-student': 'Choisir un élève',
                'password': 'Mot de passe :',
                'enter-password': 'Entrez le mot de passe',
                'view-results': 'Voir les résultats',
                'password-hint': 'Le mot de passe correspond au prénom de l\'élève en minuscules',
                'results': 'Résultats',
                'results-description': 'Les résultats de votre enfant apparaîtront ici après authentification.',
                'ci-title': 'Classe d\'Initiation (CI)',
                'cp-title': 'Cours Préparatoire (CP)',
                'ce2-title': 'Cours Élémentaire 2 (CE2)',
                'coming-soon': 'Bientôt Disponible',
                'ci-message': 'Les résultats pour la classe d\'Initiation seront disponibles prochainement.',
                'cp-message': 'Les résultats pour le Cours Préparatoire seront disponibles prochainement.',
                'ce2-message': 'Les résultats pour le Cours Élémentaire 2 seront disponibles prochainement.',
                'footer-school': 'Crèche, Garderie, Maternelle et Primaire Bilingue'
            },
            en: {
                'subtitle': 'CE1 Results - October 2025',
                'teacher': 'Teacher',
                'director': 'Director',
                'access-results': 'Access Results',
                'access-description': 'To view your child\'s results, please enter the password provided to you.',
                'select-student': 'Select student:',
                'choose-student': 'Choose a student',
                'password': 'Password:',
                'enter-password': 'Enter password',
                'view-results': 'View Results',
                'password-hint': 'The password corresponds to the student\'s first name in lowercase',
                'results': 'Results',
                'results-description': 'Your child\'s results will appear here after authentication.',
                'ci-title': 'Initiation Class (CI)',
                'cp-title': 'Preparatory Class (CP)',
                'ce2-title': 'Elementary Class 2 (CE2)',
                'coming-soon': 'Coming Soon',
                'ci-message': 'Results for the Initiation Class will be available soon.',
                'cp-message': 'Results for the Preparatory Class will be available soon.',
                'ce2-message': 'Results for Elementary Class 2 will be available soon.',
                'footer-school': 'Nursery, Daycare, Kindergarten and Bilingual Primary School'
            },
            es: {
                'subtitle': 'Resultados de CE1 - Octubre 2025',
                'teacher': 'Profesor',
                'director': 'Directora',
                'access-results': 'Acceso a los resultados',
                'access-description': 'Para consultar los resultados de su hijo, ingrese la contraseña que le fue proporcionada.',
                'select-student': 'Seleccione el estudiante:',
                'choose-student': 'Elegir un estudiante',
                'password': 'Contraseña:',
                'enter-password': 'Ingrese la contraseña',
                'view-results': 'Ver resultados',
                'password-hint': 'La contraseña corresponde al nombre del estudiante en minúsculas',
                'results': 'Resultados',
                'results-description': 'Los resultados de su hijo aparecerán aquí después de la autenticación.',
                'ci-title': 'Clase de Iniciación (CI)',
                'cp-title': 'Curso Preparatorio (CP)',
                'ce2-title': 'Curso Elemental 2 (CE2)',
                'coming-soon': 'Próximamente',
                'ci-message': 'Los resultados para la Clase de Iniciación estarán disponibles pronto.',
                'cp-message': 'Los resultados para el Curso Preparatorio estarán disponibles pronto.',
                'ce2-message': 'Los resultados para el Curso Elemental 2 estarán disponibles pronto.',
                'footer-school': 'Guardería, Jardín de Infancia y Primaria Bilingüe'
            }
        };

        this.studentsData = {
            "agblo": {
                name: "AGBLO AGONDJIHOSSOU Fifamè",
                password: "fifamè",
                notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12],
                comment: "Fifamè montre une excellente compréhension en lecture et une belle progression en expression écrite. Continuez à encourager la pratique de la dictée à la maison.",
                comment_en: "Fifamè shows excellent reading comprehension and good progress in written expression. Continue to encourage dictation practice at home.",
                comment_es: "Fifamè muestra una excelente comprensión lectora y un buen progreso en expresión escrita. Continúe fomentando la práctica de dictado en casa."
            },
            "akyoh": {
                name: "AKYOH Emmanuel",
                password: "emmanuel",
                notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13],
                comment: "Emmanuel excelle en expression écrite et en éducation sportive. Un effort particulier est nécessaire en dictée et en mathématiques. N'hésitez pas à revoir les bases avec lui.",
                comment_en: "Emmanuel excels in written expression and physical education. Particular effort is needed in dictation and mathematics. Do not hesitate to review the basics with him.",
                comment_es: "Emmanuel sobresale en expresión escrita y educación física. Se necesita un esfuerzo particular en dictado y matemáticas. No dude en repasar los conceptos básicos con él."
            },
            "amadou": {
                name: "AMADOU Yinki",
                password: "yinki",
                notes: [15.5, 19, 5, 16.25, 7.75, 15, 13.25, 17, 14],
                comment: "Yinki a des talents certains en expression écrite. Son travail en éducation scientifique pourrait être renforcé par des exercices pratiques à la maison.",
                comment_en: "Yinki has definite talents in written expression. His work in science education could be strengthened by practical exercises at home.",
                comment_es: "Yinki tiene talentos definidos en expresión escrita. Su trabajo en educación científica podría fortalecerse con ejercicios prácticos en casa."
            },
            "bani": {
                name: "BANI Rahama",
                password: "rahama",
                notes: [13.75, 18.25, 12, 20, 17, 14.5, 7.25, 18, 15],
                comment: "Rahama brille particulièrement en éducation sociale où elle a obtenu la note maximale! Son engagement en mathématiques mériterait d'être soutenu.",
                comment_en: "Rahama shines particularly in social education where she obtained the maximum score! Her commitment in mathematics deserves to be supported.",
                comment_es: "¡Rahama brilla particularmente en educación social donde obtuvo la puntuación máxima! Su compromiso en matemáticas merece ser apoyado."
            },
            "dahougou": {
                name: "DAHOUGOU Noham",
                password: "noham",
                notes: [15.25, 18.50, 3, 12, 8.75, 13, 5.75, 18, 14],
                comment: "Noham montre de belles capacités en expression écrite et en éducation sportive. La dictée et les mathématiques nécessitent un travail régulier supplémentaire.",
                comment_en: "Noham shows good abilities in written expression and physical education. Dictation and mathematics require additional regular work.",
                comment_es: "Noham muestra buenas habilidades en expresión escrita y educación física. El dictado y las matemáticas requieren trabajo regular adicional."
            },
            "eda": {
                name: "EDA Queen",
                password: "queen",
                notes: [19, 18.25, 4, 13.75, 14.5, 12, 15.75, 18, 14],
                comment: "Queen possède d'excellentes compétences en lecture. Nous devons travailler ensemble sur la dictée pour améliorer son orthographe.",
                comment_en: "Queen has excellent reading skills. We need to work together on dictation to improve her spelling.",
                comment_es: "Queen tiene excelentes habilidades de lectura. Necesitamos trabajar juntos en el dictado para mejorar su ortografía."
            },
            "houehou": {
                name: "HOUEHOU Méka",
                password: "méka",
                notes: [18.75, 19.5, 9, 15, 14, 14.5, 17.25, 17, 13],
                comment: "Méka est un élève très appliqué qui obtient d'excellents résultats dans la plupart des matières. Félicitations pour ce beau travail!",
                comment_en: "Méka is a very diligent student who achieves excellent results in most subjects. Congratulations on this great work!",
                comment_es: "Méka es un estudiante muy diligente que logra excelentes resultados en la mayoría de las materias. ¡Felicitaciones por este gran trabajo!"
            },
            "padonou": {
                name: "PADONOU Faith",
                password: "faith",
                notes: [19, 15.75, 4, 19, 17.25, 15, 13.75, 18, 13],
                comment: "Faith excelle en lecture et en éducation sociale. Continuez à l'encourager dans sa progression en expression écrite.",
                comment_en: "Faith excels in reading and social education. Continue to encourage her progress in written expression.",
                comment_es: "Faith sobresale en lectura y educación social. Continúe alentando su progreso en expresión escrita."
            },
            "sovi": {
                name: "SOVI Péniel",
                password: "péniel",
                notes: [12.5, 18.25, 8, 18.5, 16.5, 13, 16.25, 17, 14],
                comment: "Péniel montre de très bonnes aptitudes en éducation sociale et scientifique. Un petit effort en lecture serait bénéfique.",
                comment_en: "Péniel shows very good aptitudes in social and scientific education. A little effort in reading would be beneficial.",
                comment_es: "Péniel muestra muy buenas aptitudes en educación social y científica. Un pequeño esfuerzo en lectura sería beneficioso."
            },
            "tossavi": {
                name: "TOSSAVI Naelle",
                password: "naelle",
                notes: [19, 16.75, 9, 18, 18, 15, 12.25, 17, 14],
                comment: "Naelle a obtenu d'excellents résultats en lecture, éducation sociale et scientifique. Continuez sur cette belle lancée!",
                comment_en: "Naelle obtained excellent results in reading, social and scientific education. Continue on this beautiful momentum!",
                comment_es: "Naelle obtuvo excelentes resultados en lectura, educación social y científica. ¡Continúe con este hermoso impulso!"
            }
        };

        this.subjects = [
            "Lecture", "Expression Écrite", "Dictée", "Éducation Sociale", 
            "Éducation Scientifique", "Dessin", "Mathématiques", 
            "Éducation Sportive", "Éducation Artistique"
        ];

        this.subjects_en = [
            "Reading", "Written Expression", "Dictation", "Social Education", 
            "Science Education", "Drawing", "Mathematics", 
            "Physical Education", "Art Education"
        ];

        this.subjects_es = [
            "Lectura", "Expresión Escrita", "Dictado", "Educación Social", 
            "Educación Científica", "Dibujo", "Matemáticas", 
            "Educación Física", "Educación Artística"
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadThemePreference();
        this.showNotification(this.translateMessage('Bienvenue sur Les Bulles de Joie ! 🌟', 'Welcome to Les Bulles de Joie! 🌟', '¡Bienvenido a Les Bulles de Joie! 🌟'), 'success');
    }

    setupEventListeners() {
        const submitBtn = document.getElementById('submitBtn');
        const passwordInput = document.getElementById('passwordInput');
        const studentSelect = document.getElementById('studentSelect');
        const togglePassword = document.getElementById('togglePassword');
        const languageSelect = document.getElementById('languageSelect');
        const themeToggle = document.getElementById('themeToggle');
        const navItems = document.querySelectorAll('.nav-item');

        submitBtn.addEventListener('click', () => this.handleLogin());
        
        studentSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                const studentName = this.studentsData[e.target.value].name.split(' ')[1];
                passwordInput.placeholder = this.translateMessage(`Prénom: ${studentName}`, `First name: ${studentName}`, `Nombre: ${studentName}`);
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        languageSelect.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        themeToggle.addEventListener('change', () => {
            this.toggleTheme();
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.switchTab(item.dataset.tab);
            });
        });
    }

    switchTab(tabId) {
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Afficher le contenu de l'onglet
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        document.documentElement.lang = lang;
        
        // Traduire tous les éléments avec l'attribut data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });

        // Traduire les placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (this.translations[lang][key]) {
                element.placeholder = this.translations[lang][key];
            }
        });

        // Mettre à jour les résultats si affichés
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer.style.display === 'block') {
            const selectedStudent = document.getElementById('studentSelect').value;
            if (selectedStudent) {
                const student = this.studentsData[selectedStudent];
                this.displayResults(student);
            }
        }

        this.showNotification(
            this.translateMessage('Langue changée avec succès!', 'Language changed successfully!', '¡Idioma cambiado con éxito!'), 
            'success'
        );
    }

    translateMessage(fr, en, es) {
        switch(this.currentLanguage) {
            case 'en': return en;
            case 'es': return es;
            default: return fr;
        }
    }

    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        
        this.showNotification(
            this.translateMessage(
                `Thème ${isDark ? 'clair' : 'sombre'} activé!`, 
                `${isDark ? 'Light' : 'Dark'} theme activated!`, 
                `¡Tema ${isDark ? 'claro' : 'oscuro'} activado!`
            ), 
            'success'
        );
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('themeToggle').checked = savedTheme === 'dark';
    }

    async handleLogin() {
        const selectedStudent = document.getElementById('studentSelect').value;
        const enteredPassword = document.getElementById('passwordInput').value.trim().toLowerCase();

        if (!selectedStudent) {
            this.showNotification(
                this.translateMessage('Veuillez sélectionner un élève', 'Please select a student', 'Por favor seleccione un estudiante'), 
                'warning'
            );
            return;
        }

        if (!enteredPassword) {
            this.showNotification(
                this.translateMessage('Veuillez entrer le mot de passe', 'Please enter the password', 'Por favor ingrese la contraseña'), 
                'warning'
            );
            return;
        }

        const student = this.studentsData[selectedStudent];
        
        if (enteredPassword === student.password) {
            await this.performLoginAnimation();
            this.displayResults(student);
            this.createCelebrationEffect();
            this.showNotification(
                this.translateMessage(`Bienvenue ${student.name.split(' ')[1]} ! 🎉`, `Welcome ${student.name.split(' ')[1]}! 🎉`, `¡Bienvenido ${student.name.split(' ')[1]}! 🎉`), 
                'success'
            );
        } else {
            this.handleFailedLogin();
        }
    }

    async performLoginAnimation() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.translateMessage('Connexion...', 'Connecting...', 'Conectando...')}`;
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        submitBtn.innerHTML = '<i class="fas fa-check"></i> ' + this.translateMessage('Connecté !', 'Connected!', '¡Conectado!');
        
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
            bestSubject: this.getSubjects()[bestSubjectIndex],
            bestNote: bestNote,
            worstSubject: this.getSubjects()[worstSubjectIndex],
            worstNote: worstNote
        };
    }

    getSubjects() {
        switch(this.currentLanguage) {
            case 'en': return this.subjects_en;
            case 'es': return this.subjects_es;
            default: return this.subjects;
        }
    }

    generateResultsHTML(student, stats) {
        const subjects = this.getSubjects();
        
        return `
            <h3 class="student-name">${student.name}</h3>
            
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-title">${this.translateMessage('Moyenne Générale', 'Overall Average', 'Promedio General')}</div>
                    <div class="stat-value">${stats.average}/20</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">${this.translateMessage('Matière Excellente', 'Excellent Subject', 'Materia Excelente')}</div>
                    <div class="stat-value stat-highlight">${stats.bestSubject}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">${this.translateMessage('Meilleure Note', 'Best Grade', 'Mejor Nota')}</div>
                    <div class="stat-value">${stats.bestNote}/20</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">${this.translateMessage('À Renforcer', 'To Strengthen', 'A Fortalecer')}</div>
                    <div class="stat-value">${stats.worstSubject}</div>
                </div>
            </div>
            
            <div class="table-container">
                <table class="grades-table">
                    <thead>
                        <tr>
                            ${subjects.map(subject => `<th>${subject}</th>`).join('')}
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
                <i class="fas fa-arrows-left-right"></i> ${this.translateMessage('Faites défiler pour voir toutes les matières', 'Scroll to see all subjects', 'Desplázate para ver todas las materias')}
            </div>
            
            <div class="teacher-comment">
                <div class="comment-title">${this.translateMessage('Commentaire de l\'enseignant :', 'Teacher\'s comment:', 'Comentario del profesor:')}</div>
                <p>${this.getStudentComment(student)}</p>
            </div>
            
            <div class="smart-actions">
                <button class="btn" id="printBulletinBtn">
                    <i class="fas fa-print"></i> ${this.translateMessage('Imprimer le bulletin', 'Print Report Card', 'Imprimir boletín')}
                </button>
            </div>
        `;
    }

    getStudentComment(student) {
        switch(this.currentLanguage) {
            case 'en': return student.comment_en;
            case 'es': return student.comment_es;
            default: return student.comment;
        }
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
        const subjects = this.getSubjects();
        const bulletin = document.getElementById('printable-bulletin');
        bulletin.style.display = 'block';
        bulletin.innerHTML = `
            <button class="close-btn" onclick="schoolSystem.hideBulletin()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="bulletin-content">
                <div class="bulletin-header">
                    <h2 style="color: var(--primary); margin-bottom: 5px; font-size: 2.2rem;">École "Les Bulles de Joie"</h2>
                    <h3 style="color: var(--secondary); font-size: 1.5rem;">${this.translateMessage('Bulletin Scolaire - CE1 - Octobre 2025', 'School Report - CE1 - October 2025', 'Boletín Escolar - CE1 - Octubre 2025')}</h3>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; font-size: 1.3rem;">
                        ${this.translateMessage('Élève:', 'Student:', 'Estudiante:')} ${student.name}
                    </h4>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary);">
                        <strong>${this.translateMessage('Moyenne Générale:', 'Overall Average:', 'Promedio General:')}</strong><br>
                        <span style="font-size: 1.4rem; font-weight: bold; color: var(--primary);">${stats.average}/20</span>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid var(--accent);">
                        <strong>${this.translateMessage('Matière Excellente:', 'Excellent Subject:', 'Materia Excelente:')}</strong><br>
                        <span style="font-size: 1.2rem; font-weight: bold; color: var(--accent);">${stats.bestSubject}</span><br>
                        <small>${stats.bestNote}/20</small>
                    </div>
                </div>
                
                <div style="overflow-x: auto; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 700px; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: var(--primary); color: white;">
                                ${subjects.map(subject => `
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
                    <strong style="color: var(--primary);">${this.translateMessage('Commentaire de l\'enseignant:', 'Teacher\'s comment:', 'Comentario del profesor:')}</strong><br>
                    <p style="margin-top: 10px; line-height: 1.6;">${this.getStudentComment(student)}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--primary);">
                    <div style="text-align: center;">
                        <div style="border-top: 1px solid #000; width: 200px; margin: 10px 0;"></div>
                        <div><strong>C. J. S. Stein</strong></div>
                        <div><em>${this.translateMessage('Enseignant', 'Teacher', 'Profesor')}</em></div>
                    </div>
                    <div style="text-align: center;">
                        <div style="border-top: 1px solid #000; width: 200px; margin: 10px 0;"></div>
                        <div><strong>SEGBO S. A. D. Carole</strong></div>
                        <div><em>${this.translateMessage('Directrice', 'Director', 'Directora')}</em></div>
                    </div>
                </div>
            </div>
            
            <div class="bulletin-actions">
                <button class="btn no-print" onclick="window.print()">
                    <i class="fas fa-print"></i> ${this.translateMessage('Imprimer le bulletin', 'Print Report Card', 'Imprimir boletín')}
                </button>
                <button class="btn btn-close no-print" onclick="schoolSystem.hideBulletin()">
                    <i class="fas fa-times"></i> ${this.translateMessage('Fermer', 'Close', 'Cerrar')}
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
        this.showNotification(
            this.translateMessage(
                'Mot de passe incorrect. Vérifiez le prénom en minuscules.', 
                'Incorrect password. Check the first name in lowercase.', 
                'Contraseña incorrecta. Verifique el nombre en minúsculas.'
            ), 
            'error'
        );
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
});

// Exposition globale
window.schoolSystem = schoolSystem;
