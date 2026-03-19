// ═══ LES BULLES DE JOIE — Content Data (source: HTML officiel) ═══

export const SCHOOL = {
  name: "Les Bulles de Joie",
  shortName: "Bulles de Joie",
  tagline: "École Bilingue d'Excellence",
  description: "Crèche, Maternelle & Primaire bilingue d'excellence à Parakou, Bénin.",
  founded: 2017,
  location: "Zongo 2 dans la zone de L'ANPE, Parakou – Bénin",
  phone: "+229 01 97 91 94 52",
  phoneRaw: "22901979194",
  phone2: "+229 01 49 77 77 01",
  phone2Raw: "2290149777701",
  whatsapp: "+229 01 97 91 94 52",
  whatsappRaw: "22901979194",
  whatsappInscriptions: "+229 01 58 03 03 02",
  whatsappInscriptionsRaw: "2290158030302",
  email: "lesbullesdejoie@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/Cz9oXhGhiR2T6czEA",
  mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.!2d2.63!3d9.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMjEnMDAuMCJOIDLCoDM4JzAwLjAiRQ!5e0!3m2!1sfr!2sbj!4v1",
  facebook: "https://facebook.com/lesbullesdejoie",
  instagram: "https://instagram.com/lesbullesdejoie",
  tiktok: "https://www.tiktok.com/@cspblesbullesdejoie",
  portalUrl: "https://portailresultatslbj.web.app",
  agrement2021: "N°018/MASM/DC/SGM/DGAS/DFEA/SA/021SGG21",
  agrement2022: "N°045/MEMP/DC/SGM/DPP/SP/0223SGG22",
};

export const STATS = [
  { value: 8,   suffix: "+", label: "Années d'excellence", emoji: "🗓️" },
  { value: 100, suffix: "+", label: "Élèves épanouis",    emoji: "👨‍🎓" },
  { value: 20,  suffix: "+", label: "Personnels actifs",  emoji: "👩‍🏫" },
  { value: 2,   suffix: "",  label: "Agréments officiels",emoji: "📜" },
];

export const CYCLES = [
  {
    emoji: "🍼", title: "Crèche & Garderie",
    age: "À partir de 2 mois",
    desc: "Éveil sensoriel et premiers pas vers l'autonomie dans un cadre sécurisant et bienveillant.",
    color: "pink",
  },
  {
    emoji: "🎨", title: "Maternelle Bilingue",
    age: "3–5 ans",
    desc: "Découverte ludique du français et de l'anglais dans une atmosphère créative.",
    color: "lime",
  },
  {
    emoji: "🎓", title: "Primaire d'Excellence",
    age: "À partir de 6 ans",
    desc: "Fondations académiques solides et ouverture au monde pour construire l'avenir.",
    color: "black",
  },
];

export const PILLARS = [
  { emoji: "❤️", title: "Amour",      desc: "Un environnement bienveillant où chaque enfant est chéri" },
  { emoji: "💼", title: "Travail",    desc: "L'effort et l'autonomie comme moteurs du succès" },
  { emoji: "🎯", title: "Rigueur",    desc: "Une exigence académique au service de l'épanouissement" },
  { emoji: "✨", title: "Créativité", desc: "L'imagination libre comme force transformatrice" },
];

// 6 piliers pédagogiques (page Pédagogie)
export const PEDAGOGY_PILLARS = [
  { emoji: "🤝", title: "Éducation Bienveillante", desc: "Respect et valorisation de chaque enfant",    color: "lime" },
  { emoji: "👤", title: "Centrée sur l'Enfant",    desc: "Rythme individuel respecté",                  color: "pink" },
  { emoji: "👑", title: "Élégance & Éloquence",    desc: "Confiance et prestance dès le plus jeune âge", color: "black" },
  { emoji: "🎮", title: "Apprentissage par le Jeu",desc: "La joie d'apprendre au quotidien",            color: "lime" },
  { emoji: "✋", title: "Pédagogie Active",         desc: "Expériences concrètes et manipulations",       color: "pink" },
  { emoji: "🌍", title: "Immersion Bilingue",       desc: "Ouverture naturelle français-anglais",         color: "black" },
];

// Programme 3E
export const PROGRAMME_3E = [
  {
    emoji: "👗", title: "Élégance", color: "pink",
    desc: "Présence distinguée, tenue soignée",
    items: ["Tenue appropriée", "Posture et maintien", "Présentation personnelle"],
  },
  {
    emoji: "🎤", title: "Éloquence", color: "lime",
    desc: "Expression maîtrisée, parole assurée",
    items: ["Prise de parole en public", "Articulation et diction", "Arguments structurés"],
  },
  {
    emoji: "🤝", title: "Bonnes Manières", color: "black",
    desc: "Vivre-ensemble harmonieux",
    items: ["Politesse et courtoisie", "Respect des règles", "Empathie et entraide"],
  },
];

// Parcours éducatif (page Pédagogie)
export const PARCOURS = [
  { tranche: "2 mois – 3 ans", emoji: "🍼", title: "Éveil et Socialisation",  desc: "Premiers pas vers l'autonomie, éveil sensoriel", color: "pink" },
  { tranche: "3 – 5 ans",      emoji: "🎨", title: "Maternelle Bilingue",      desc: "Préparation à l'écriture, initiation aux langues", color: "lime" },
  { tranche: "6 – 10 ans",     emoji: "🎓", title: "Primaire d'Excellence",    desc: "Fondamentaux académiques, bilinguisme approfondi", color: "black" },
];

export const IMMERSIONS = [
  { emoji: "🎤", title: "Art Oratoire",     desc: "Éloquence dès le plus jeune âge",    badge: "CE1+" },
  { emoji: "🌱", title: "Jardinage",         desc: "Connexion à la nature",              badge: "3 ans+" },
  { emoji: "🎵", title: "Musique & Rythmes", desc: "Éveil musical et créativité",        badge: "2 ans+" },
  { emoji: "💃", title: "Danse & Expression",desc: "Maîtrise corporelle et confiance",   badge: "3 ans+" },
  { emoji: "🌍", title: "Anglais Ludique",   desc: "Immersion bilingue par le jeu",      badge: "3 ans+" },
  { emoji: "🎨", title: "Arts Créatifs",     desc: "Peinture, modelage, dessin, collage, bricolage", badge: "2 ans+" },
];

// ─── GALLERY supprimée (remplacée par les vraies médias) ───



// ─── TESTIMONIALS supprimées (non utilisées) ───



// ─── TARIFS (source: tarifs.html) ───
export const TARIFS = [
  {
    id: "creche", emoji: "🍼",
    name: "Crèche & Garderie",
    age: "À partir de 2 mois",
    price: "30.000", period: "FCFA/mois",
    featured: false, color: "pink",
    features: [
      "Inscription annuelle : 15.000 FCFA",
      "Assurance annuelle : 3.000 FCFA",
      "Cantine : 13.000 FCFA/mois",
    ],
    details: [
      { label: "Inscription annuelle",             value: "15.000 FCFA" },
      { label: "Assurance annuelle",               value: "3.000 FCFA" },
      { label: "Total frais généraux",             value: "18.000 FCFA", strong: true },
      { label: "Mensualité crèche/garderie",       value: "30.000 FCFA/mois" },
      { label: "Cantine (à partir de 8 mois, facultatif)", value: "13.000 FCFA/mois" },
      { label: "Halte-garderie demi-journée",      value: "3.000 FCFA" },
      { label: "Halte-garderie journée complète",  value: "3.500 FCFA" },
      { label: "Journée du samedi",                value: "3.500 FCFA" },
      { label: "Nuitée",                           value: "3.500 FCFA" },
    ],
  },
  {
    id: "prematernelle", emoji: "📘",
    name: "Pré-Maternelle",
    age: "3–4 ans",
    price: "122.500", period: "FCFA/an (nouveau)",
    priceAncien: "120.500 FCFA/an (ancien)",
    featured: false, color: "lime",
    features: [
      "Immersion bilingue",
      "Activités parascolaires",
      "Ancien : 120.500 FCFA",
    ],
    details: [
      { label: "Inscription (nouveau)",        value: "12.000 FCFA" },
      { label: "Réinscription (ancien)",        value: "10.000 FCFA" },
      { label: "Activités parascolaires",       value: "4.000 FCFA" },
      { label: "Fêtes",                         value: "12.000 FCFA" },
      { label: "Assurance",                     value: "2.000 FCFA" },
      { label: "APE",                           value: "2.500 FCFA" },
      { label: "Total frais gén. (nouveau)",    value: "32.500 FCFA", strong: true },
      { label: "Total frais gén. (ancien)",     value: "30.500 FCFA", strong: true },
      { label: "Scolarité annuelle",            value: "90.000 FCFA" },
      { label: "TOTAL nouveau",                 value: "122.500 FCFA", total: true },
      { label: "TOTAL ancien",                  value: "120.500 FCFA", total: true },
    ],
  },
  {
    id: "maternelle", emoji: "⭐",
    name: "Maternelle 1 & 2",
    age: "4–6 ans",
    price: "125.500", period: "FCFA/an (nouveau)",
    priceAncien: "123.500 FCFA/an (ancien)",
    badge: "Populaire",
    featured: true, color: "pink",
    features: [
      "Immersion bilingue français-anglais",
      "Activités parascolaires complètes",
      "Suivi personnalisé",
      "Ancien : 123.500 FCFA",
    ],
    details: [
      { label: "Inscription (nouveau)",     value: "12.000 FCFA" },
      { label: "Réinscription (ancien)",    value: "10.000 FCFA" },
      { label: "Activités parascolaires",   value: "12.000 FCFA" },
      { label: "Fêtes",                     value: "12.000 FCFA" },
      { label: "Assurance",                 value: "2.000 FCFA" },
      { label: "APE",                       value: "2.500 FCFA" },
      { label: "Total frais gén. (nouveau)",value: "40.500 FCFA", strong: true },
      { label: "Total frais gén. (ancien)", value: "38.500 FCFA", strong: true },
      { label: "Scolarité annuelle",        value: "85.000 FCFA" },
      { label: "TOTAL nouveau",             value: "125.500 FCFA", total: true },
      { label: "TOTAL ancien",              value: "123.500 FCFA", total: true },
    ],
  },
  {
    id: "primaire", emoji: "🎓",
    name: "Primaire CI – CE2",
    age: "6–10 ans",
    price: "125.500 – 130.500", period: "FCFA/an",
    featured: false, color: "lime",
    features: [
      "CI-CP nouveau : 125.500 / ancien : 123.500",
      "CE1-CE2 nouveau : 130.500 / ancien : 128.500",
      "Programme bilingue d'excellence",
    ],
    details: [
      { label: "Inscription (nouveau)",        value: "12.000 FCFA" },
      { label: "Réinscription (ancien)",       value: "10.000 FCFA" },
      { label: "Activités CI-CP",              value: "12.000 FCFA" },
      { label: "Activités CE1-CE2",            value: "17.000 FCFA" },
      { label: "Fêtes",                        value: "12.000 FCFA" },
      { label: "Assurance",                    value: "2.000 FCFA" },
      { label: "APE",                          value: "2.500 FCFA" },
      { label: "Frais CI-CP (nouveau)",        value: "40.500 FCFA", strong: true },
      { label: "Frais CI-CP (ancien)",         value: "38.500 FCFA", strong: true },
      { label: "Frais CE1-CE2 (nouveau)",      value: "45.500 FCFA", strong: true },
      { label: "Frais CE1-CE2 (ancien)",       value: "43.500 FCFA", strong: true },
      { label: "Scolarité annuelle (tous)",     value: "85.000 FCFA" },
      { label: "TOTAL CI-CP nouveau",           value: "125.500 FCFA", total: true },
      { label: "TOTAL CI-CP ancien",            value: "123.500 FCFA", total: true },
      { label: "TOTAL CE1-CE2 nouveau",         value: "130.500 FCFA", total: true },
      { label: "TOTAL CE1-CE2 ancien",          value: "128.500 FCFA", total: true },
    ],
  },
];

// ─── TABLEAU RÉCAPITULATIF TARIFS ───
export const TARIFS_TABLE = [
  { niveau: "🍼 Crèche",         age: "2 mois+",  fraisGen: "18.000 FCFA",  scolarite: "30.000 FCFA/mois", totNouv: "—",             totAnc: "—" },
  { niveau: "📘 Pré-Maternelle", age: "3–4 ans",  fraisGen: "32.500 FCFA",  scolarite: "90.000 FCFA",      totNouv: "122.500 FCFA", totAnc: "120.500 FCFA" },
  { niveau: "⭐ Maternelle",      age: "4–6 ans",  fraisGen: "40.500 FCFA",  scolarite: "85.000 FCFA",      totNouv: "125.500 FCFA", totAnc: "123.500 FCFA", pop: true },
  { niveau: "📗 Primaire CI-CP", age: "6–8 ans",  fraisGen: "40.500 FCFA",  scolarite: "85.000 FCFA",      totNouv: "125.500 FCFA", totAnc: "123.500 FCFA" },
  { niveau: "📕 Primaire CE1-CE2",age: "8–10 ans", fraisGen: "45.500 FCFA", scolarite: "85.000 FCFA",      totNouv: "130.500 FCFA", totAnc: "128.500 FCFA" },
];

// ─── UNIFORMES (source: tarifs.html) ───
export const UNIFORMES = [
  { emoji: "📗", label: "Maternelle (tout cousu)", price: "8.000 FCFA",  color: "pink" },
  { emoji: "📕", label: "Primaire (tout cousu)",   price: "9.000 FCFA",  color: "lime" },
  { emoji: "🏃", label: "Tenue de sport (tous)",   price: "4.000 FCFA",  color: "black" },
];

// ─── CANTINE (source: tarifs.html) ───
export const CANTINE = {
  creche: [
    { label: "Cantine complète", price: "13.000 FCFA/mois" },
  ],
  matPri: [
    { label: "Petit déjeuner", price: "5.000 FCFA/mois" },
    { label: "Déjeuner",       price: "9.000 FCFA/mois" },
    { label: "Goûter",         price: "3.000 FCFA/mois" },
    { label: "Garderie",       price: "3.000 FCFA/mois" },
  ],
};

// ─── PIÈCES À FOURNIR CRÈCHE ───
export const CRECHE_PIECES = [
  "Photocopie de l'acte de naissance de l'enfant",
  "Fiche d'inscription disponible au niveau de la crèche",
  "Photocopie des pièces d'identité des parents",
  "Photocopie du carnet de vaccination de l'enfant",
  "2 photos d'identité de l'enfant",
  "2 photos d'identité des parents",
];

// ─── LINGERIE & ACCESSOIRES CRÈCHE ───
export const CRECHE_LINGERIE = [
  "Lait et eau minérale et/ou bouillie de l'enfant",
  "Vêtements de rechanges et couches jetables",
  "Bavoir, thermomètre, lingette, biberon, thermos",
  "Serviette, éponge, et lait de toilette",
  "6 pains de savon et 2 sachets d'omo de 1 kg",
  "3 paquets de papier mouchoir et 1 paquet d'essuie-tout",
];


export const ECHEANCIER = [
  { step: "1", title: "À l'inscription",       desc: "Frais généraux complets",    date: "À l'inscription",  color: "pink" },
  { step: "2", title: "Tranche 1 — 30.000 FCFA", desc: "Premier versement scolarité", date: "20 Octobre 2025",  color: "lime" },
  { step: "3", title: "Tranche 2 — 30.000 FCFA", desc: "Deuxième versement",          date: "08 Décembre 2025", color: "pink" },
  { step: "4", title: "Tranche 3 — 25.000 FCFA", desc: "Dernier versement",           date: "09 Février 2026",  color: "lime" },
];

// ─── MOYENS DE PAIEMENT (source: tarifs.html) ───
export const PAIEMENTS = [
  {
    id: "mtn", emoji: "📲", title: "MTN MomoPay",
    desc: "Paiement mobile instantané",
    logo: "/images/logo-mtn.png", logoBg: "#FFCB05",
    type: "mobile",
  },
  {
    id: "coris-bank", emoji: "🏦", title: "Coris Bank",
    desc: "Virement bancaire",
    logo: "/images/logo-coriss.png", logoBg: "#E8F5E9",
    type: "bank",
    bankName: "Les Bulles de Joie",
    iban: "BJ212 02004 004943124101",
  },
  {
    id: "coris-money", emoji: "📲", title: "Coris Money",
    desc: "Paiement mobile instantané",
    logo: "/images/logo-coris.png", logoBg: "#FFFFFF",
    type: "mobile",
    numero: "+229 01 97 91 94 52",
  },
];

// ─── HORAIRES (source: contact.html) ───
export const HORAIRES = [
  {
    cycle: "Crèche", emoji: "🍼", color: "#F33791",
    schedules: [
      { period: "Lundi – Vendredi", time: "07h00 – 19h00" },
      { period: "Samedi",           time: "08h00 – 17h00" },
    ],
  },
  {
    cycle: "Maternelle", emoji: "🎨", color: "#C8FF00",
    schedules: [
      { period: "Matin",       time: "08h00 – 11h30" },
      { period: "Après-midi",  time: "15h00 – 17h00" },
    ],
  },
  {
    cycle: "Primaire", emoji: "🎓", color: "#0A0A0A",
    schedules: [
      { period: "Matin",       time: "07h30 – 12h00" },
      { period: "Après-midi",  time: "15h00 – 17h30" },
    ],
  },
];

// ─── CONTACTS PRINCIPAUX (source: contact.html) ───
export const CONTACTS_PRINCIPAUX = [
  {
    group: "Direction", dot: "#F33791",
    items: [
      { type: "Appel",     value: "+229 01 97 91 94 52", href: "tel:+2290197919452", emoji: "📞" },
      { type: "WhatsApp",  value: "+229 01 97 91 94 52", href: "https://wa.me/2290197919452", emoji: "💬", note: "Réponse rapide" },
    ],
  },
  {
    group: "Secrétariat", dot: "#00D46A",
    items: [
      { type: "Appel",              value: "+229 01 49 77 77 01", href: "tel:+2290149777701", emoji: "📞" },
      { type: "WhatsApp Inscriptions", value: "+229 01 58 03 03 02", href: "https://wa.me/2290158030302", emoji: "💬" },
    ],
  },
  {
    group: "Urgences & Email", dot: "#EF4444",
    items: [
      { type: "Urgences 24h/24", value: "+229 01 97 91 94 52", href: "tel:+2290197919452", emoji: "🚨" },
      { type: "Email",           value: "lesbullesdejoie@gmail.com", href: "mailto:lesbullesdejoie@gmail.com", emoji: "✉️" },
    ],
  },
];

// ─── NIVEAUX CONTACTS (source: contact.html) ───
export const NIVEAUX_CONTACTS = [
  { niveau: "Crèche",        emoji: "🍼", color: "#F33791", phone: "01 49 77 77 02", href: "tel:+2290149777702" },
  { niveau: "Pré-Maternelle",emoji: "📘", color: "#C8FF00", phone: "01 49 77 77 03", href: "tel:+2290149777703" },
  { niveau: "Maternelle 1",  emoji: "📗", color: "#F33791", phone: "01 49 77 77 04", href: "tel:+2290149777704" },
  { niveau: "Maternelle 2",  emoji: "📗", color: "#C8FF00", phone: "01 49 77 77 05", href: "tel:+2290149777705" },
  { niveau: "CI",            emoji: "📕", color: "#0A0A0A", phone: "01 49 77 77 06", href: "tel:+2290149777706" },
  { niveau: "CP",            emoji: "📕", color: "#F33791", phone: "01 49 77 77 07", href: "tel:+2290149777707" },
  { niveau: "CE1",           emoji: "📕", color: "#C8FF00", phone: "01 49 77 77 08", href: "tel:+2290149777708" },
  { niveau: "CE2",           emoji: "📕", color: "#0A0A0A", phone: "01 49 77 77 09", href: "tel:+2290149777709" },
];

// ─── PAGE RÉSULTATS (source: resultats.html) ───

// Vision d'évaluation
export const EVALUATION_PILLARS = [
  { emoji: "❤️", title: "Approche Humaine", desc: "Évaluations bienveillantes",    color: "pink" },
  { emoji: "📈", title: "Progression",      desc: "Suivi régulier des acquis",     color: "lime" },
  { emoji: "👥", title: "Personnalisé",     desc: "Communication régulière",        color: "black" },
  { emoji: "✨", title: "Épanouissement",   desc: "L'enfant acteur de ses progrès", color: "lime" },
];

// Calendrier 2025-2026
export const CALENDRIER = [
  { emoji: "🔍", title: "Premières Observations", desc: "Adaptation et premiers repères",      period: "Octobre 2025",  color: "#F33791" },
  { emoji: "📋", title: "Premier Bilan",          desc: "Rencontre parents-enseignants",        period: "Décembre 2025", color: "#3B82F6" },
  { emoji: "📊", title: "Évaluations Formatives", desc: "Point d'étape et ajustements",         period: "Mars 2026",     color: "#F59E0B" },
  { emoji: "🏆", title: "Bilan Annuel",           desc: "Célébration des réussites",            period: "Juin 2026",     color: "#00D46A" },
];

// ─── MOMENTS_FIERTE supprimés (non utilisés) ───



// Portail features
export const PORTAL_FEATURES = [
  "Accès 24h/24", "Bulletins détaillés", "Suivi trimestriel", "Historique complet",
];

// ─── PÉDAGOGIE VIDÉOS (source: pedagogie.html) ───
export const PEDAGOGY_SECTIONS = [
  {
    id: "creche", emoji: "🍼", tab: "Crèche", color: "pink",
    videos: [
      { src: "/videos/pedagogie/eveil-musical-creche.mp4",    poster: "/images/videos/posters/eveil-musical-creche.jpg",    title: "Éveil Musical",   emoji: "🎶", duration: "1:45" },
      { src: "/videos/pedagogie/motricite-creche.mp4",        poster: "/images/videos/posters/motricite-creche.jpg",        title: "Motricité Fine",  emoji: "✋", duration: "2:00" },
      { src: "/videos/pedagogie/eveil-sensoriel-creche.mp4",  poster: "/images/videos/posters/eveil-sensoriel-creche.jpg",  title: "Éveil Sensoriel", emoji: "👀", duration: "1:30" },
    ],
  },
  {
    id: "maternelle", emoji: "🎨", tab: "Maternelle", color: "lime",
    videos: [
      { src: "/videos/pedagogie/jardinage-maternelle.mp4", poster: "/images/videos/posters/jardinage-maternelle.jpg", title: "Jardinage", emoji: "🌱", duration: "2:15" },
      { src: "/videos/pedagogie/anglais-maternelle.mp4",   poster: "/images/videos/posters/anglais-maternelle.jpg",   title: "Anglais",   emoji: "🌍", duration: "2:30" },
      { src: "/videos/pedagogie/danse-maternelle.mp4",     poster: "/images/videos/posters/danse-maternelle.jpg",     title: "Danse",     emoji: "💃", duration: "1:50" },
    ],
  },
  {
    id: "primaire", emoji: "🎓", tab: "Primaire", color: "black",
    videos: [
      { src: "/videos/pedagogie/art-oratoire-primaire.mp4", poster: "/images/videos/posters/art-oratoire-primaire.jpg", title: "Art Oratoire", emoji: "🎤", duration: "3:00" },
      { src: "/videos/pedagogie/science-primaire.mp4",      poster: "/images/videos/posters/science-primaire.jpg",      title: "Sciences",     emoji: "🔬", duration: "2:45" },
      { src: "/videos/pedagogie/concert-primaire.mp4",      poster: "/images/videos/posters/concert-primaire.jpg",      title: "Concert",      emoji: "🎵", duration: "4:00" },
    ],
  },
];

// ─── GALERIE PHOTOS ───
export const GALLERY = [
  { src: "/images/gallery/creche1.jpg",     label: "Crèche",     emoji: "🍼" },
  { src: "/images/gallery/maternelle1.jpg", label: "Maternelle", emoji: "🎨" },
  { src: "/images/gallery/primaire1.jpg",   label: "Primaire",   emoji: "🎓" },
  { src: "/images/gallery/campus1.jpg",     label: "Campus",     emoji: "🏫" },
];

// ─── TÉMOIGNAGES ───
// ─── fin du fichier ───
