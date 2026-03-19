/**
 * ia.js — Système d'animations d'icônes v21
 * IA = Icon Animations
 *
 * Chaque page a un PROFIL qui définit :
 *   - comment les emojis s'animent en idle
 *   - comment ils réagissent au hover
 *   - comment l'emoji de PageIntro entre en scène
 *
 * Principes :
 *   - Spring physics partout — jamais de secousse abrupte
 *   - Personnalité cohérente avec le contenu de la page
 *   - Pauses naturelles entre chaque cycle (repeatDelay)
 *   - Squash & stretch pour les rebonds (emojis enfants)
 */

/* ─────────────────────────────────────────────
   PRIMITIVES — blocs de base réutilisables
───────────────────────────────────────────── */

/** Hover universel — spring pop */
export const hoverPop    = { scale: 1.35, rotate: 14,  y: -5 };
export const hoverLift   = { scale: 1.22, rotate: -6,  y: -8 };
export const hoverSpin   = { scale: 1.18, rotate: 22,  y: -4 };
export const hoverBounce = { scale: 1.28, rotate: 0,   y: -10, scaleY: 0.88, scaleX: 1.1 };

export const springFast  = { type: "spring", stiffness: 560, damping: 16 };
export const springMid   = { type: "spring", stiffness: 380, damping: 22 };
export const springSoft  = { type: "spring", stiffness: 220, damping: 18 };

/* ─────────────────────────────────────────────
   ANIMATIONS IDLE — 7 personnalités
───────────────────────────────────────────── */

/**
 * 🎈 balloon — flottaison contemplative, légèreté
 * Pour : accueil, ambiance douce
 */
export const balloon = (i = 0) => ({
  animate: {
    y:      [0, -9, -3, -11, -2, 0],
    rotate: [0,  2,  -1,  3,   1, 0],
    scale:  [1, 1.04, 1, 1.06, 1.02, 1],
  },
  transition: {
    duration: 5.2,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 0.9,
    repeatDelay: 0.3,
  },
});

/**
 * 🌱 grow — croissance organique, paisible
 * Pour : pédagogie, nature, jardinage
 */
export const grow = (i = 0) => ({
  animate: {
    scale:  [1, 1.09, 1,    1.05, 1],
    y:      [0, -4,   0,   -2,    0],
    rotate: [0,  2,   0,   -1.5,  0],
  },
  transition: {
    duration: 4.8,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1],
    delay: i * 1.1,
    repeatDelay: 0.6,
  },
});

/**
 * 🎵 swing — balançoire naturelle, rythme
 * Pour : pédagogie, musique, danse
 */
export const swing = (i = 0) => ({
  animate: {
    rotate: [-5, 6, -4, 7, -3, 0],
    x:      [-1, 1, -0.5, 1.5, -1, 0],
  },
  transition: {
    duration: 4.4,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 0.7,
    repeatDelay: 0.2,
  },
});

/**
 * ✨ sparkle — éclat et préciosité
 * Pour : tarifs, récompenses, excellence
 */
export const sparkle = (i = 0) => ({
  animate: {
    scale:  [1, 1.26, 0.92, 1.18, 1],
    rotate: [0, 22,  -14,   18,   0],
    filter: [
      "drop-shadow(0 0 0px transparent)",
      "drop-shadow(0 0 10px rgba(243,55,145,0.8))",
      "drop-shadow(0 0 3px transparent)",
      "drop-shadow(0 0 8px rgba(200,255,0,0.7))",
      "drop-shadow(0 0 0px transparent)",
    ],
  },
  transition: {
    duration: 3.2,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 1.0,
    repeatDelay: 1.2,
  },
});

/**
 * ❤️ heartbeat — battement affectueux, pause chaleureuse
 * Pour : contact, amour, bienveillance
 */
export const heartbeat = (i = 0) => ({
  animate: {
    scale:  [1, 1.3,  0.9,  1.2,  1],
    rotate: [0, -8,   5,   -3,    0],
  },
  transition: {
    duration: 1.8,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1],
    delay: i * 1.3,
    repeatDelay: 1.8, // longue pause — le cœur bat puis se repose
  },
});

/**
 * 🎉 celebrate — explosion de victoire puis flottaison
 * Pour : résultats, trophées, achievements
 * NB : one-shot au mount, puis idle balloon
 */
export const celebrate = (i = 0) => ({
  animate: {
    y:      [0, -20,   5, -12,   2,  0],
    rotate: [0, -20,  15, -10,   6,  0],
    scale:  [1,  1.4, 0.82, 1.22, 0.94, 1],
  },
  transition: {
    duration: 0.9,
    delay: 0.2 + i * 0.15,
    ease: [0.34, 1.56, 0.64, 1],
    // PAS de repeat — one-shot
  },
});

/**
 * 🕊️ drift — dérive lente et contemplative
 * Pour : chiffres stats, données, équilibre
 */
export const drift = (i = 0) => ({
  animate: {
    y:      [0, -5, -1, -7, 0],
    x:      [0,  1.5, -1,  2, 0],
    rotate: [0,  1, -0.5,  2, 0],
  },
  transition: {
    duration: 6.5,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 1.5,
    repeatDelay: 0.4,
  },
});

/**
 * 🏃 hop — sautillement rythmique avec squash & stretch
 * Pour : accueil, énergie enfantine
 */
export const hop = (i = 0) => ({
  animate: {
    y:      [0,   0,  -12,  -6,  -9,   0,    0],
    scaleY: [1, 0.84,  1.1, 1.05, 1.08, 0.88, 1],
    scaleX: [1, 1.12,  0.93, 0.97, 0.94, 1.09, 1],
  },
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1],
    delay: i * 0.65,
    repeatDelay: 0.9,
  },
});

/* ─────────────────────────────────────────────
   PROFILS PAR PAGE
   Chaque profil expose :
     pick(emoji, i)   → {animate, transition} selon l'emoji
     hover            → whileHover target
     hoverTransition  → transition pour le hover
     pageIntroEmoji   → config animation de l'emoji PageIntro
───────────────────────────────────────────── */

/**
 * HOME — Bienvenue, légèreté, joie enfantine
 * Dominante : balloon + hop · Hover : pop joyeux
 */
export const HOME = {
  pick: (emoji, i = 0) => {
    const e = emoji;
    if (["❤️","💕","🤍","💖"].includes(e))             return heartbeat(i);
    if (["🎨","🖌️","🎭","🎪"].includes(e))             return hop(i);
    if (["✨","⭐","🌟","🏆","🎯","🥇"].includes(e))    return sparkle(i);
    return balloon(i);
  },
  hover: hoverPop,
  hoverTransition: springFast,
  // PageIntro : spiral pop → flottaison
  pageIntroEmoji: {
    animate: {
      scale:   [0.5, 1.18, 0.9, 1.05, 1],
      rotate:  [0,   22,  -14,   6,   0],
      boxShadow: [
        "0 0 0 0px rgba(243,55,145,0.8)",
        "0 0 0 36px rgba(243,55,145,0)",
        "0 0 0 0px rgba(243,55,145,0)",
      ],
    },
    transition: { duration: 1.6, ease: "easeOut", times: [0, 0.28, 0.58, 0.8, 1] },
  },
};

/**
 * PÉDAGOGIE — Créativité, nature, croissance organique
 * Dominante : grow + swing · Hover : lift doux
 */
export const PEDAGOGIE = {
  pick: (emoji, i = 0) => {
    const e = emoji;
    if (["🌱","🌿","🌳","🍀","🌻"].includes(e))         return grow(i);
    if (["🎵","🎤","💃","🎸","🎶"].includes(e))          return swing(i);
    if (["✨","💡","🔬","🌍"].includes(e))                return sparkle(i);
    if (["❤️","💕","🤍"].includes(e))                    return heartbeat(i);
    return grow(i); // la croissance est la dominante
  },
  hover: hoverLift,
  hoverTransition: springSoft,
  // PageIntro : rotation papillon → flottaison douce
  pageIntroEmoji: {
    animate: {
      scale:   [0.3,  1.08, 0.96, 1.02, 1],
      rotate:  [180,   12,   -6,    2,   0],
      y:       [16,   -8,    2,   -3,    0],
      boxShadow: [
        "0 0 0 0px rgba(0,212,106,0.7)",
        "0 0 0 32px rgba(0,212,106,0)",
        "0 0 0 0px rgba(0,212,106,0)",
      ],
    },
    transition: { duration: 1.8, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.3, 0.62, 0.82, 1] },
  },
};

/**
 * TARIFS — Confiance, transparence, préciosité
 * Dominante : sparkle + heartbeat · Hover : spin éclat
 */
export const TARIFS = {
  pick: (emoji, i = 0) => {
    const e = emoji;
    if (["💳","💎","🪙","💰","💵"].includes(e))          return sparkle(i);
    if (["❤️","🤝","💕","🙏"].includes(e))               return heartbeat(i);
    if (["🎓","⭐","🌟","🏆","✨"].includes(e))           return sparkle(i);
    if (["🎒","👶","🧒","👧","👦"].includes(e))           return balloon(i);
    return sparkle(i);
  },
  hover: hoverSpin,
  hoverTransition: springFast,
  // PageIntro : flash brillance → pulsation
  pageIntroEmoji: {
    animate: {
      scale:     [0.6,  1.3,  0.88, 1.14, 0.96, 1],
      rotate:    [0,   -25,   18,   -8,    4,   0],
      boxShadow: [
        "0 0 0 0px rgba(240,37,123,0.9)",
        "0 0 0 44px rgba(240,37,123,0)",
        "0 0 0 12px rgba(200,255,0,0.4)",
        "0 0 0 24px rgba(200,255,0,0)",
        "0 0 0 0px rgba(200,255,0,0)",
        "0 0 0 0px transparent",
      ],
    },
    transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1], times: [0, 0.22, 0.45, 0.65, 0.82, 1] },
  },
};

/**
 * RÉSULTATS — Victoire, fierté, célébration
 * Dominante : celebrate + sparkle · Hover : bounce victoire
 */
export const RESULTATS = {
  pick: (emoji, i = 0) => {
    const e = emoji;
    if (["🏆","🥇","🥈","🥉","🎖️","🏅"].includes(e))   return celebrate(i);
    if (["⭐","🌟","✨","💫"].includes(e))                return sparkle(i);
    if (["📈","📊","📋","🔢"].includes(e))               return drift(i);
    if (["👩‍🎓","🎓","👨‍🎓"].includes(e))                 return hop(i);
    return sparkle(i);
  },
  hover: hoverBounce,
  hoverTransition: springFast,
  // PageIntro : fusée vers le haut → atterrissage
  pageIntroEmoji: {
    animate: {
      y:       [20,   -28,   8,  -14,   3,  0],
      scale:   [0.5,   1.5, 0.82, 1.22, 0.94, 1],
      rotate:  [0,    -15,  12,   -6,    3,  0],
      boxShadow: [
        "0 0 0 0px rgba(243,55,145,0.6)",
        "0 0 0 50px rgba(243,55,145,0)",
        "0 0 0 0px rgba(200,255,0,0.5)",
        "0 0 0 28px rgba(200,255,0,0)",
        "0 0 0 0px transparent",
        "0 0 0 0px transparent",
      ],
    },
    transition: { duration: 1.1, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.2, 0.44, 0.64, 0.82, 1] },
  },
};

/**
 * CONTACT — Chaleur, humanité, bienveillance
 * Dominante : heartbeat + swing · Hover : lift doux
 */
export const CONTACT = {
  pick: (emoji, i = 0) => {
    const e = emoji;
    if (["❤️","💕","🤍","💖","💌","🌸"].includes(e))    return heartbeat(i);
    if (["💬","📞","📱","🗣️","👋"].includes(e))         return swing(i);
    if (["📍","🗺️","🚗"].includes(e))                   return balloon(i);
    if (["✨","⭐"].includes(e))                          return sparkle(i);
    return heartbeat(i);
  },
  hover: hoverLift,
  hoverTransition: springSoft,
  // PageIntro : battement cœur doux → repos
  pageIntroEmoji: {
    animate: {
      scale:     [0.4,  1.25, 0.88, 1.12, 0.96, 1],
      rotate:    [0,    -12,   8,   -4,    2,   0],
      boxShadow: [
        "0 0 0 0px rgba(240,37,123,0.85)",
        "0 0 0 30px rgba(240,37,123,0)",
        "0 0 0 0px rgba(240,37,123,0.4)",
        "0 0 0 18px rgba(240,37,123,0)",
        "0 0 0 0px transparent",
        "0 0 0 0px transparent",
      ],
    },
    transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1], times: [0, 0.24, 0.5, 0.68, 0.84, 1] },
  },
};

/* Helper : spread pour <motion.span {...ia.pick(emoji, i)}> */
export function applyIA(profile, emoji, i = 0) {
  const ia = profile.pick(emoji, i);
  return {
    animate:    ia.animate,
    transition: ia.transition,
    whileHover: profile.hover,
  };
}
