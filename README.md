# 🫧 Les Bulles de Joie — PWA Éducative

> Crèche, Maternelle & Primaire bilingue d'excellence à Parakou, Bénin.

---

## 🌐 Site en Production

**URL** : `https://lesbullesdejoie.vercel.app`

---

## 📁 Structure du Projet

```
lesbullesdejoie/
│
├── index.html                  # Page Accueil
├── pedagogie.html              # Page Pédagogie & Activités
├── tarifs.html                 # Page Tarifs & Inscription
├── resultats.html              # Page Résultats Scolaires
├── contact.html                # Page Contact
├── offline.html                # Page hors-ligne (PWA)
│
├── style.css                   # Design System complet
├── script.js                   # JavaScript (interactions, PWA, formulaires)
│
├── manifest.webmanifest        # Manifest PWA
├── sw.js                       # Service Worker (cache offline)
│
├── README.md                   # Ce fichier
│
├── images/                     # 📸 Images du site
│   ├── logo-minimal.png        # Logo principal (toutes pages)
│   ├── video-poster.jpg        # Poster vidéo accueil
│   ├── hero-accueil.jpg        # Image hero page Accueil
│   ├── hero-pedagogie.jpg      # Image hero page Pédagogie
│   ├── hero-tarifs.jpg         # Image hero page Tarifs
│   ├── hero-resultats.jpg      # Image hero page Résultats
│   ├── hero-contact.jpg        # Image hero page Contact
│   ├── logo-mtn.png            # Logo MTN MomoPay (paiement)
│   ├── logo-coris.png          # Logo Coris Money/Bank (paiement)
│   ├── og-home.jpg             # Open Graph Accueil
│   ├── og-pedagogie.jpg        # Open Graph Pédagogie
│   ├── og-tarifs.jpg           # Open Graph Tarifs
│   ├── og-results.jpg          # Open Graph Résultats
│   ├── og-contact.jpg          # Open Graph Contact
│   ├── twitter-home.jpg        # Twitter Card Accueil
│   ├── twitter-pedagogie.jpg   # Twitter Card Pédagogie
│   ├── twitter-results.jpg     # Twitter Card Résultats
│   │
│   ├── gallery/                # Galerie photos (Accueil)
│   │   ├── creche1.jpg
│   │   ├── maternelle1.jpg
│   │   ├── primaire1.jpg
│   │   └── campus1.jpg
│   │
│   ├── videos/posters/         # Miniatures vidéos (Pédagogie)
│   │   ├── eveil-musical-creche.jpg
│   │   ├── motricite-creche.jpg
│   │   ├── eveil-sensoriel-creche.jpg
│   │   ├── jardinage-maternelle.jpg
│   │   ├── anglais-maternelle.jpg
│   │   ├── danse-maternelle.jpg
│   │   ├── art-oratoire-primaire.jpg
│   │   ├── science-primaire.jpg
│   │   └── concert-primaire.jpg
│   │
│   ├── results/                # Photos résultats (Résultats)
│   │   ├── ceremonie-premiers-pas.jpg
│   │   ├── spectacle-fin-annee.jpg
│   │   └── remise-diplomes.jpg
│   │
│   └── testimonials/           # Photos témoignages (Résultats)
│       ├── parent1.jpg
│       ├── parent2.jpg
│       └── parent3.jpg
│
├── videos/                     # 🎬 Vidéos
│   └── presentation.mp4       # Vidéo présentation (Accueil)
│
└── assets/
    └── icons/                  # 📱 Icônes PWA
        ├── icon-72x72.png
        ├── icon-96x96.png
        ├── icon-128x128.png
        ├── icon-144x144.png
        ├── icon-152x152.png
        ├── icon-192x192.png
        ├── icon-384x384.png
        ├── icon-512x512.png
        └── maskable-icon.png
```

---

## 🎨 Palette de Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| **Deep Pink** | `#F33791` | Couleur principale, CTAs, accents |
| **Olive Leaf** | `#336907` | Couleur secondaire, nature, croissance |
| **Dry Sage** | `#C8C5A6` | Neutre chaud, arrière-plans |
| **White** | `#FDFEFE` | Fond dominant, splash screens |
| **White Smoke** | `#F5F3F5` | Fond alterné sections |
| **Platinum** | `#F0F0F0` | Bordures, séparateurs |
| **Alabaster** | `#E6E6E6` | Bordures cartes |
| **Ash Grey** | `#A3A7A1` | Texte secondaire |

### Thèmes par page

| Page | Couleur dominante | theme-color |
|------|-------------------|-------------|
| Accueil | Deep Pink `#F33791` | `#F33791` |
| Pédagogie | Olive Leaf `#336907` | `#336907` |
| Tarifs | Deep Pink `#F33791` | `#F33791` |
| Résultats | Olive Leaf `#336907` | `#336907` |
| Contact | Deep Pink `#F33791` | `#F33791` |

---

## 🖼️ Liste Complète des Médias (39 fichiers)

### Images à préparer

| Fichier | Dimensions | Format | Page |
|---------|-----------|--------|------|
| `logo-minimal.png` | 512×512 | PNG transparent | Toutes |
| `video-poster.jpg` | 1280×720 | JPG 70% | Accueil |
| `hero-accueil.jpg` | 1920×1080 | JPG 70% | Accueil |
| `hero-pedagogie.jpg` | 1920×1080 | JPG 70% | Pédagogie |
| `hero-tarifs.jpg` | 1920×1080 | JPG 70% | Tarifs |
| `hero-resultats.jpg` | 1920×1080 | JPG 70% | Résultats |
| `hero-contact.jpg` | 1920×1080 | JPG 70% | Contact |
| `og-*.jpg` (×5) | 1200×630 | JPG 80% | Meta tags |
| `twitter-*.jpg` (×3) | 1200×600 | JPG 80% | Meta tags |
| `gallery/*.jpg` (×4) | 1200×800 | JPG 70% | Accueil |
| `videos/posters/*.jpg` (×9) | 1280×720 | JPG 60% | Pédagogie |
| `results/*.jpg` (×3) | 800×400 | JPG 70% | Résultats |
| `testimonials/*.jpg` (×3) | 200×200 | JPG 80% | Résultats |

### Vidéos

| Fichier | Résolution | Format | Durée max |
|---------|-----------|--------|-----------|
| `videos/presentation.mp4` | 720p | MP4 H.264 | 3 min |

### Icônes PWA & Favicons (racine du site)

Tous les favicons sont placés **à la racine** du projet (même dossier que index.html) :

```
favicon.ico                    # Favicon classique (32×32)
favicon-16x16.png              # Favicon 16px
favicon-32x32.png              # Favicon 32px
favicon-96x96.png              # Favicon 96px

apple-icon.png                 # Apple Touch Icon générique
apple-icon-57x57.png           # iPhone (anciens)
apple-icon-60x60.png           # iPhone
apple-icon-72x72.png           # iPad
apple-icon-76x76.png           # iPad
apple-icon-114x114.png         # iPhone Retina
apple-icon-120x120.png         # iPhone Retina
apple-icon-144x144.png         # iPad Retina
apple-icon-152x152.png         # iPad Retina
apple-icon-180x180.png         # iPhone 6+
apple-icon-precomposed.png     # Ancien iOS

android-icon-36x36.png         # Android ldpi
android-icon-48x48.png         # Android mdpi
android-icon-72x72.png         # Android hdpi
android-icon-96x96.png         # Android xhdpi
android-icon-144x144.png       # Android xxhdpi
android-icon-192x192.png       # Android xxxhdpi

ms-icon-70x70.png              # Windows Tile petit
ms-icon-144x144.png            # Windows Tile moyen
ms-icon-150x150.png            # Windows Tile moyen
ms-icon-310x150.png            # Windows Tile large
ms-icon-310x310.png            # Windows Tile grand
```

### Icônes PWA Manifest (dossier assets/icons/)

```
assets/icons/icon-72x72.png
assets/icons/icon-96x96.png
assets/icons/icon-128x128.png
assets/icons/icon-144x144.png
assets/icons/icon-152x152.png
assets/icons/icon-192x192.png
assets/icons/icon-384x384.png
assets/icons/icon-512x512.png
assets/icons/maskable-icon.png
```

Toutes au format PNG, fond carré avec logo centré.

---

## 🚀 Déploiement sur Vercel via Termux + GitHub

### 1. Installer les outils dans Termux

```bash
# Mettre à jour Termux
pkg update && pkg upgrade -y

# Installer git et Node.js
pkg install git nodejs -y

# Configurer Git
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### 2. Créer le dépôt GitHub

```bash
# Se placer dans le dossier du projet
cd /storage/emulated/0/lesbullesdejoie

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🫧 Les Bulles de Joie - PWA v4.0"

# Créer le dépôt sur GitHub (via navigateur)
# Aller sur github.com > New repository > "lesbullesdejoie"

# Connecter au dépôt distant
git remote add origin https://github.com/VOTRE-USERNAME/lesbullesdejoie.git

# Pousser le code
git branch -M main
git push -u origin main
```

### 3. Déployer sur Vercel

**Option A : Via le site web (recommandé)**

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer "New Project"
4. Importer le dépôt `lesbullesdejoie`
5. Framework Preset : **Other**
6. Build Command : (laisser vide)
7. Output Directory : `.` (point)
8. Cliquer "Deploy"

**Option B : Via Termux (CLI)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod

# Suivre les instructions :
# - Set up and deploy? Y
# - Which scope? (votre compte)
# - Link to existing project? N
# - Project name? lesbullesdejoie
# - Directory? ./
# - Override settings? N
```

### 4. Configurer le domaine (optionnel)

```bash
# Ajouter un domaine personnalisé
vercel domains add lesbullesdejoie.com
```

### 5. Mettre à jour le site

```bash
# Après modifications
git add .
git commit -m "✨ Mise à jour"
git push

# Vercel redéploie automatiquement !
```

---

## 📱 Fonctionnalités PWA

| Fonctionnalité | Status |
|---------------|--------|
| Installation native | ✅ Un clic |
| Mode hors-ligne | ✅ Service Worker |
| Splash screen 3s | ✅ Chaque page |
| Scroll progress | ✅ Barre gradient |
| Animations scroll | ✅ Intersection Observer |
| Ripple effects | ✅ Sur les CTAs |
| Animated emojis | ✅ 8 animations |
| WhatsApp form | ✅ Pré-inscription |
| Responsive | ✅ Mobile-first |
| Bottom nav mobile | ✅ 5 onglets |

---

## 📊 Données Tarifs 2025-2026

| Niveau | Scolarité | Frais gén. (nouv.) | Total Nouveau | Total Ancien |
|--------|-----------|-------------------|---------------|-------------|
| Crèche | 30.000/mois | 18.000 | — | — |
| Pré-Maternelle | 90.000 | 32.500 | **122.500 FCFA** | **120.500 FCFA** |
| Maternelle | 85.000 | 40.500 | **125.500 FCFA** | **123.500 FCFA** |
| Primaire CI-CP | 85.000 | 40.500 | **125.500 FCFA** | **123.500 FCFA** |
| Primaire CE1-CE2 | 85.000 | 45.500 | **130.500 FCFA** | **128.500 FCFA** |

### Activités parascolaires

| Niveau | Montant |
|--------|---------|
| Pré-Maternelle | 4.000 FCFA |
| Maternelle → CP | 12.000 FCFA |
| CE1+ | 17.000 FCFA |

### Statistiques

| Donnée | Valeur |
|--------|--------|
| Années d'existence | 8+ |
| Élèves | 100+ |
| Personnels actifs | 20+ |
| Agréments officiels | 2 |

---

## 📞 Contacts

| Service | Téléphone |
|---------|-----------|
| Direction | +229 01 97 91 94 52 |
| WhatsApp Direction | +229 01 97 91 94 52 |
| Secrétariat | +229 01 49 77 77 01 |
| WhatsApp Inscriptions | +229 01 58 03 03 02 |
| Urgences 24h/24 | +229 01 97 91 94 52 |
| Email | lesbullesdejoie@gmail.com |

---

## 📜 Agréments

- **2021** : N°018/MASM/DC/SGM/DGAS/DFEA/SA/021SGG21
- **2022** : N°045/MEMP/DC/SGM/DPP/SP/0223SGG22

---

## 📄 Licence

© 2017-2026 Les Bulles de Joie. Tous droits réservés.
