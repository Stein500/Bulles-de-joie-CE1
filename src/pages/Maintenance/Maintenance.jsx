/**
 * Maintenance.jsx — Page de maintenance
 * Design : dark premium · même charte que le site principal
 * Activer : MAINTENANCE_MODE = true dans App.jsx
 */

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SCHOOL } from "../../data/content";

/* ══════════════════════════════════════════════════════════
   DONNÉES LOCALES
══════════════════════════════════════════════════════════ */
const CONTACTS = [
  {
    id: "direction",
    type: "WhatsApp — Direction",
    value: SCHOOL.phone,
    href: `https://wa.me/${SCHOOL.whatsappRaw}?text=Bonjour%2C%20je%20souhaite%20un%20renseignement`,
    icon: "💬",
    color: "#25D366",
    bg: "rgba(37,211,102,0.14)",
  },
  {
    id: "secretariat",
    type: "Secrétariat",
    value: SCHOOL.phone2,
    href: `tel:${SCHOOL.phone2Raw}`,
    icon: "📞",
    color: "#F33791",
    bg: "rgba(243,55,145,0.14)",
  },
  {
    id: "inscriptions",
    type: "WhatsApp — Inscriptions",
    value: SCHOOL.whatsappInscriptions,
    href: `https://wa.me/${SCHOOL.whatsappInscriptionsRaw}?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20les%20inscriptions`,
    icon: "📋",
    color: "#C8FF00",
    bg: "rgba(200,255,0,0.12)",
  },
  {
    id: "email",
    type: "Email",
    value: SCHOOL.email,
    href: `mailto:${SCHOOL.email}`,
    icon: "✉️",
    color: "#7C3AFF",
    bg: "rgba(124,58,255,0.14)",
  },
];

const SOCIALS = [
  { label: "Facebook",  icon: "📘", href: SCHOOL.facebook,  hoverBg: "rgba(24,119,242,0.18)",  hoverBorder: "#1877F2" },
  { label: "Instagram", icon: "📷", href: SCHOOL.instagram, hoverBg: "rgba(228,64,95,0.18)",   hoverBorder: "#E4405F" },
  { label: "TikTok",    icon: "🎵", href: SCHOOL.tiktok,    hoverBg: "rgba(255,255,255,0.12)", hoverBorder: "rgba(255,255,255,0.5)" },
];

const BADGES = [
  { label: "Agréé MASM 2021", color: "#F33791" },
  { label: "Agréé MEMP 2022", color: "#00D46A" },
  { label: "Bilingue Fr / En", color: "#7C3AFF" },
  { label: "Fondée en 2017",   color: "#FF6B35" },
  { label: "Parakou · Bénin",  color: "#0BB4D8" },
];

const FLOATS = ["🌟", "✨", "🎈", "💫", "🌸", "⭐", "🎨", "🎒", "📚", "🌍", "🦋", "💡"];

/* ══════════════════════════════════════════════════════════
   EASE CURVES (identiques au reste du site)
══════════════════════════════════════════════════════════ */
const E = {
  out:    [0.165, 0.84, 0.44, 1],
  spring: [0.34,  1.56, 0.64, 1],
};

/* ══════════════════════════════════════════════════════════
   BLOBS MORPHIQUES
══════════════════════════════════════════════════════════ */
const BLOB_CFG = [
  { w: "55vw", top: "-18%", left: "-12%", bg: "rgba(243,55,145,0.18)", blur: 80, dur: 14, delay: 0 },
  { w: "45vw", bottom: "-8%", right: "-8%", bg: "rgba(124,58,255,0.16)", blur: 80, dur: 18, delay: 1 },
  { w: "30vw", top: "38%", left: "50%", bg: "rgba(200,255,0,0.09)", blur: 72, dur: 11, delay: 0.5 },
  { w: "18vw", top: "6%", right: "10%", bg: "rgba(255,107,53,0.16)", blur: 60, dur: 9, delay: 0.8 },
];

const Blobs = memo(function Blobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {BLOB_CFG.map((b, i) => (
        <motion.div key={i}
          style={{
            position: "absolute",
            width: b.w, height: b.w,
            maxWidth: 700, maxHeight: 700,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${b.bg} 0%, transparent 70%)`,
            filter: `blur(${b.blur}px)`,
            top: b.top, bottom: b.bottom,
            left: b.left === "50%" ? undefined : b.left,
            right: b.right,
            translateX: b.left === "50%" ? "-50%" : 0,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1, scale: [1, 1.07, 0.95, 1.04, 1],
            x: [0, 18, -12, 8, 0],
            y: [0, -22, 14, -8, 0],
          }}
          transition={{
            opacity: { duration: 1.4, delay: b.delay },
            scale: { duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay },
            x: { duration: b.dur * 0.8, repeat: Infinity, ease: "easeInOut", delay: b.delay },
            y: { duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay + 0.4 },
          }} />
      ))}
    </div>
  );
});

/* ══════════════════════════════════════════════════════════
   ANNEAUX CONCENTRIQUES
══════════════════════════════════════════════════════════ */
const RING_CFG = [
  { size: "82vw", max: 920, color: "rgba(243,55,145,0.07)", dur: 65, dir: 1 },
  { size: "58vw", max: 660, color: "rgba(200,255,0,0.06)", dur: 42, dir: -1 },
  { size: "34vw", max: 400, color: "rgba(124,58,255,0.09)", dur: 30, dir: 1 },
];

const Rings = memo(function Rings() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {RING_CFG.map((r, i) => (
        <motion.div key={i}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: r.size, height: r.size,
            maxWidth: r.max, maxHeight: r.max,
            marginTop: `calc(-${r.size} / 2)`,
            marginLeft: `calc(-${r.size} / 2)`,
            borderRadius: "50%",
            border: `1px solid ${r.color}`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 * r.dir }}
          transition={{
            opacity: { duration: 1.6, delay: 0.5 + i * 0.2 },
            rotate: { duration: r.dur, repeat: Infinity, ease: "linear" },
          }} />
      ))}
    </div>
  );
});

/* ══════════════════════════════════════════════════════════
   GRAIN OVERLAY
══════════════════════════════════════════════════════════ */
const Grain = memo(function Grain() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "200px",
      mixBlendMode: "overlay",
      opacity: 0.5,
    }} />
  );
});

/* ══════════════════════════════════════════════════════════
   PARTICULES FLOTTANTES
══════════════════════════════════════════════════════════ */
function useParticles(active) {
  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const spawn = () => {
      const id = ++idRef.current;
      const emoji = FLOATS[Math.floor(Math.random() * FLOATS.length)];
      const left  = Math.random() * 90 + 5;
      const size  = 0.75 + Math.random() * 0.75;
      const dur   = 12 + Math.random() * 10;
      setParticles(p => [...p, { id, emoji, left, size, dur }]);
      setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), (dur + 2) * 1000);
    };
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 1400);
    const iv = setInterval(spawn, 3200);
    return () => clearInterval(iv);
  }, [active]);

  return particles;
}

function Particles({ active }) {
  const particles = useParticles(active);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden" }}>
      <AnimatePresence>
        {particles.map(p => (
          <motion.span key={p.id}
            style={{
              position: "absolute", bottom: "-3rem",
              left: p.left + "vw",
              fontSize: p.size + "rem",
              userSelect: "none",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
            }}
            initial={{ opacity: 0, y: 0, rotate: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0.6, 0], y: "-95vh", rotate: 360, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.dur, ease: "linear" }} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BARRE TOP GRADIENT
══════════════════════════════════════════════════════════ */
const TopBar = memo(function TopBar() {
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: 3, zIndex: 500,
        pointerEvents: "none",
        background: "linear-gradient(90deg, #F33791 0%, #C8FF00 50%, #7C3AFF 80%, #F33791 100%)",
        backgroundSize: "300% 100%",
      }}
      animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
  );
});

/* ══════════════════════════════════════════════════════════
   LOGO SECTION
══════════════════════════════════════════════════════════ */
const Logo = memo(function Logo() {
  return (
    <motion.div
      style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "3rem" }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.2, ease: E.out }}>

      {/* Cercle logo */}
      <motion.div
        style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #fff4fa 0%, #fff 100%)",
          border: "2px solid rgba(243,55,145,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 7px rgba(255,255,255,0.05), 0 0 30px rgba(243,55,145,0.25), 0 6px 20px rgba(0,0,0,0.4)",
          flexShrink: 0, overflow: "hidden",
          position: "relative",
        }}
        animate={{
          boxShadow: [
            "0 0 0 7px rgba(255,255,255,0.05), 0 0 30px rgba(243,55,145,0.25), 0 6px 20px rgba(0,0,0,0.4)",
            "0 0 0 7px rgba(255,255,255,0.05), 0 0 55px rgba(243,55,145,0.55), 0 6px 32px rgba(0,0,0,0.5)",
            "0 0 0 7px rgba(255,255,255,0.05), 0 0 30px rgba(243,55,145,0.25), 0 6px 20px rgba(0,0,0,0.4)",
          ]
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>

        {/* Pulse ring */}
        <motion.div
          style={{
            position: "absolute", inset: -5, borderRadius: "50%",
            border: "2px solid rgba(243,55,145,0.4)",
          }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.15, 1.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }} />

        <motion.img
          src="/images/logo-minimal.png"
          alt="Logo Les Bulles de Joie"
          style={{ width: 38, height: 38, objectFit: "contain", position: "relative", zIndex: 1,
            filter: "drop-shadow(0 2px 8px rgba(243,55,145,0.4))" }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>

      {/* Texte */}
      <div>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800, fontSize: "1rem",
          color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2,
        }}>
          École Les Bulles de Joie
        </div>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.58rem", fontWeight: 600,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Crèche · Maternelle · Primaire · Parakou, Bénin 🇧🇯
        </div>
      </div>
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════════════
   STATUS PILL
══════════════════════════════════════════════════════════ */
const StatusPill = memo(function StatusPill() {
  return (
    <motion.div
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        background: "rgba(243,55,145,0.12)",
        border: "1px solid rgba(243,55,145,0.45)",
        borderRadius: 100, padding: "0.35rem 1.1rem 0.35rem 0.7rem",
        marginBottom: "1.75rem",
      }}
      initial={{ opacity: 0, y: -8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.4, ease: E.spring }}>
      <motion.span
        style={{ width: 7, height: 7, borderRadius: "50%", background: "#F33791", boxShadow: "0 0 10px #F33791", flexShrink: 0 }}
        animate={{ opacity: [1, 0.25, 1], boxShadow: ["0 0 10px #F33791", "0 0 4px #F33791", "0 0 10px #F33791"] }}
        transition={{ duration: 1.5, repeat: Infinity }} />
      <span style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700, fontSize: "0.62rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#F33791",
      }}>
        Site en maintenance
      </span>
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════════════
   HERO TITLE
══════════════════════════════════════════════════════════ */
const HeroTitle = memo(function HeroTitle() {
  return (
    <motion.h1
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 900,
        fontSize: "clamp(2.6rem, 9.5vw, 7rem)",
        letterSpacing: "-0.055em",
        lineHeight: 0.9,
        textAlign: "center",
        marginBottom: "1.6rem",
        color: "#fff",
      }}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.55, ease: E.out }}>
      <span style={{ display: "block" }}>Nous revenons</span>
      <motion.span
        style={{
          display: "block",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          backgroundImage: "linear-gradient(90deg, #C8FF00 0%, #00e5a0 30%, #C8FF00 60%, #F33791 100%)",
          backgroundSize: "300% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
        très bientôt !
      </motion.span>
    </motion.h1>
  );
});

/* ══════════════════════════════════════════════════════════
   SOUS-TITRE
══════════════════════════════════════════════════════════ */
const HeroSub = memo(function HeroSub() {
  return (
    <motion.p
      style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: "clamp(0.9rem, 2.2vw, 1.08rem)",
        color: "rgba(255,255,255,0.48)",
        lineHeight: 1.78, maxWidth: 520,
        textAlign: "center",
        marginBottom: "3rem",
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.72, ease: E.out }}>
      Notre site est actuellement en cours de mise à jour pour vous offrir une
      {" "}<strong style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>expérience encore meilleure</strong>.
      Nos équipes travaillent activement pour être de retour le plus vite possible.
      {" "}<strong style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>Merci de votre patience.</strong>
    </motion.p>
  );
});

/* ══════════════════════════════════════════════════════════
   BARRE DE PROGRESSION
══════════════════════════════════════════════════════════ */
const PROGRESS_VALUE = 78;

function ProgressBar() {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 44;
    const inc   = PROGRESS_VALUE / steps;
    let cur = 0;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= PROGRESS_VALUE) { setCount(PROGRESS_VALUE); clearInterval(iv); }
      else setCount(Math.round(cur));
    }, 28);
    return () => clearInterval(iv);
  }, [started]);

  return (
    <motion.div
      style={{ width: "100%", maxWidth: 500, marginBottom: "3.5rem" }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.88, ease: E.out }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.6rem", fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>
          Avancement de la mise à jour
        </span>
        <motion.span
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "#C8FF00" }}
          animate={{ textShadow: ["0 0 0px #C8FF00", "0 0 12px #C8FF00", "0 0 0px #C8FF00"] }}
          transition={{ duration: 2.4, repeat: Infinity }}>
          {count}%
        </motion.span>
      </div>

      {/* Track */}
      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
        <motion.div
          style={{
            height: "100%", borderRadius: 10,
            background: "linear-gradient(90deg, #F33791 0%, #7C3AFF 40%, #C8FF00 100%)",
            position: "relative", overflow: "hidden",
          }}
          initial={{ width: "0%" }}
          animate={{ width: started ? `${PROGRESS_VALUE}%` : "0%" }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.15, 0.85, 0.4, 1] }}>
          {/* Shimmer */}
          <motion.div
            style={{
              position: "absolute", top: 0, height: "100%", width: "38%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              left: "-38%",
            }}
            animate={{ left: ["- 38%", "138%"] }}
            transition={{ duration: 1.8, delay: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />
        </motion.div>
      </div>

      {/* Steps indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.65rem", gap: "0.3rem" }}>
        {[
          { label: "Analyse",    done: true,  color: "#F33791" },
          { label: "Dev",        done: true,  color: "#7C3AFF" },
          { label: "Tests",      done: true,  color: "#FF6B35" },
          { label: "Déploiement",done: false, color: "#C8FF00" },
        ].map((step, i) => (
          <div key={step.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              height: 3, borderRadius: 2,
              background: step.done ? step.color : "rgba(255,255,255,0.1)",
              marginBottom: "0.3rem",
              boxShadow: step.done ? `0 0 8px ${step.color}` : "none",
            }} />
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.54rem", fontWeight: step.done ? 700 : 500,
              color: step.done ? step.color : "rgba(255,255,255,0.25)",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {step.done ? "✓ " : ""}{step.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SÉPARATEUR
══════════════════════════════════════════════════════════ */
const Divider = memo(function Divider({ delay = 1 }) {
  return (
    <motion.div
      style={{ display: "flex", alignItems: "center", gap: "0.85rem", width: "100%", maxWidth: 500, marginBottom: "2.5rem" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
      <motion.div
        style={{ width: 6, height: 6, borderRadius: "50%", background: "#F33791" }}
        animate={{ boxShadow: ["0 0 6px #F33791", "0 0 16px #F33791", "0 0 6px #F33791"] }}
        transition={{ duration: 2, repeat: Infinity }} />
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════════════
   CARTES DE CONTACT
══════════════════════════════════════════════════════════ */
function ContactCard({ c, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a href={c.href}
      target={c.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: "0.85rem",
        padding: "0.95rem 1.15rem",
        background: hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? c.color + "55" : "rgba(255,255,255,0.09)"}`,
        borderRadius: 14, textDecoration: "none", color: "inherit",
        boxShadow: hov ? `0 8px 28px ${c.color}20` : "none",
        transition: "background 0.22s, border-color 0.22s, box-shadow 0.22s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 + idx * 0.08, ease: E.out }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}>

      <div style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: hov ? c.bg : "rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.15rem",
        transition: "background 0.22s",
        border: `1px solid ${hov ? c.color + "40" : "rgba(255,255,255,0.1)"}`,
      }}>
        {c.icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.58rem", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: hov ? c.color : "rgba(255,255,255,0.3)",
          marginBottom: "0.2rem",
          transition: "color 0.22s",
        }}>{c.type}</div>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700, fontSize: "0.85rem",
          color: "rgba(255,255,255,0.82)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{c.value}</div>
      </div>

      {/* Arrow */}
      <motion.span
        style={{ marginLeft: "auto", fontSize: "0.75rem", color: hov ? c.color : "rgba(255,255,255,0.2)", transition: "color 0.22s", flexShrink: 0 }}
        animate={hov ? { x: [0, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.6, repeat: hov ? Infinity : 0 }}>
        →
      </motion.span>
    </motion.a>
  );
}

/* ══════════════════════════════════════════════════════════
   RÉSEAUX SOCIAUX
══════════════════════════════════════════════════════════ */
function SocialButton({ s, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a href={s.href} target="_blank" rel="noopener noreferrer"
      aria-label={s.label}
      style={{
        width: 46, height: 46, borderRadius: 12,
        background: hov ? s.hoverBg : "rgba(255,255,255,0.05)",
        border: `1px solid ${hov ? s.hoverBorder : "rgba(255,255,255,0.1)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.15rem", textDecoration: "none",
        transition: "background 0.22s, border-color 0.22s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1.45 + idx * 0.07, ease: E.spring }}
      whileHover={{ y: -3, scale: 1.08 }}
      whileTap={{ scale: 0.9 }}>
      {s.icon}
    </motion.a>
  );
}

/* ══════════════════════════════════════════════════════════
   BADGES
══════════════════════════════════════════════════════════ */
function Badge({ b, idx }) {
  return (
    <motion.div
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.35rem",
        padding: "0.3rem 0.9rem",
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${b.color}22`,
        borderRadius: 100,
        fontFamily: "'Poppins', sans-serif",
        fontSize: "0.6rem", fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1.7 + idx * 0.06, ease: E.spring }}
      whileHover={{ scale: 1.05, borderColor: b.color + "55", color: "rgba(255,255,255,0.75)" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: b.color, boxShadow: `0 0 5px ${b.color}`, flexShrink: 0 }} />
      {b.label}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
const Footer = memo(function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      style={{ textAlign: "center", marginTop: "1.5rem" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 2 }}>
      <p style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: "0.68rem", color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.06em", lineHeight: 2,
      }}>
        © 2017–{year} <span style={{ color: "rgba(255,255,255,0.38)", fontWeight: 700 }}>École Les Bulles de Joie</span> · Tous droits réservés
      </p>
      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.14)", letterSpacing: "0.06em" }}>
        {SCHOOL.agrement2021} &nbsp;·&nbsp; {SCHOOL.agrement2022}
      </p>
    </motion.footer>
  );
});

/* ══════════════════════════════════════════════════════════
   HOOK PWA — Détecte beforeinstallprompt
══════════════════════════════════════════════════════════ */
function usePWAInstall() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Déjà installé ?
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setInstalled(true); setPrompt(null); });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") { setInstalled(true); setPrompt(null); }
  };

  return { canInstall: !!prompt && !installed, installed, install };
}

/* ══════════════════════════════════════════════════════════
   BOUTON INSTALLER L'APP
══════════════════════════════════════════════════════════ */
function InstallButton({ delay = 2.1 }) {
  const { canInstall, installed, install } = usePWAInstall();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (canInstall) { const t = setTimeout(() => setPulse(true), 1200); return () => clearTimeout(t); }
  }, [canInstall]);

  if (installed) return (
    <motion.div
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        padding: "0.75rem 1.6rem",
        background: "rgba(0,212,106,0.1)",
        border: "1px solid rgba(0,212,106,0.35)",
        borderRadius: 100,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700, fontSize: "0.72rem",
        color: "#00D46A",
        letterSpacing: "0.06em",
        marginBottom: "0.85rem",
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>
      ✅ Application installée !
    </motion.div>
  );

  if (!canInstall) return null;

  return (
    <motion.button
      onClick={install}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.65rem",
        padding: "0.95rem 2rem",
        background: "linear-gradient(135deg, #F33791 0%, #7C3AFF 100%)",
        border: "none",
        borderRadius: 100,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 800, fontSize: "0.82rem",
        color: "#fff",
        letterSpacing: "0.04em",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        marginBottom: "0.85rem",
        boxShadow: "0 6px 0 rgba(124,58,255,0.45), 0 16px 40px rgba(243,55,145,0.4)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 0 rgba(124,58,255,0.5), 0 24px 56px rgba(243,55,145,0.55)",
        y: -2,
      }}
      whileTap={{ scale: 0.96, y: 2, boxShadow: "0 2px 0 rgba(124,58,255,0.5)" }}
      aria-label="Installer l'application Les Bulles de Joie">

      {/* Shimmer sweep */}
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: 100,
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
      }}
        animate={{ backgroundPosition: ["-200% 0%", "300% 0%"] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }} />

      {/* Pulse ring (si prêt) */}
      {pulse && (
        <motion.span style={{
          position: "absolute", inset: -4, borderRadius: 100,
          border: "2px solid rgba(243,55,145,0.6)",
        }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.95, 1.06, 1.14] }}
          transition={{ duration: 1.6, repeat: Infinity }} />
      )}

      <motion.span
        style={{ fontSize: "1.05rem", display: "inline-block" }}
        animate={{ rotate: [0, -10, 10, -6, 0] }}
        transition={{ duration: 1.2, delay: delay + 0.8, ease: "easeInOut" }}>
        📲
      </motion.span>

      <span style={{ position: "relative", zIndex: 1 }}>Installer l'Application</span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════
   BOUTON PORTAIL RÉSULTATS
══════════════════════════════════════════════════════════ */
function PortalButton({ delay = 2.25 }) {
  return (
    <motion.a
      href={SCHOOL.portalUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.65rem",
        padding: "0.95rem 2rem",
        background: "rgba(200,255,0,0.07)",
        border: "1.5px solid rgba(200,255,0,0.3)",
        borderRadius: 100,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 800, fontSize: "0.82rem",
        color: "#C8FF00",
        letterSpacing: "0.04em",
        textDecoration: "none",
        marginBottom: "0.85rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 0 0 rgba(200,255,0,0)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{
        background: "rgba(200,255,0,0.14)",
        borderColor: "rgba(200,255,0,0.65)",
        boxShadow: "0 0 28px rgba(200,255,0,0.22)",
        y: -2,
      }}
      whileTap={{ scale: 0.96 }}>

      {/* Glow sweep */}
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: 100,
        background: "linear-gradient(105deg, transparent 35%, rgba(200,255,0,0.15) 50%, transparent 65%)",
        backgroundSize: "200% 100%",
      }}
        animate={{ backgroundPosition: ["-200% 0%", "300% 0%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />

      <motion.span
        style={{ fontSize: "1.1rem", display: "inline-block", position: "relative", zIndex: 1 }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        🏆
      </motion.span>

      <span style={{ position: "relative", zIndex: 1 }}>Portail Résultats Scolaires</span>

      <motion.span style={{ fontSize: "0.75rem", position: "relative", zIndex: 1, opacity: 0.6 }}
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
        →
      </motion.span>
    </motion.a>
  );
}


export default function Maintenance() {
  const reduced = useReducedMotion();

  /* ── Réinitialiser tout overflow bloquant dès le montage ── */
  useEffect(() => {
    document.body.style.overflow        = "";
    document.body.style.overflowY       = "";
    document.documentElement.style.overflow  = "";
    document.documentElement.style.overflowY = "";
    // S'assurer que le body est scrollable nativement
    document.body.style.height          = "auto";
    document.documentElement.style.height   = "auto";
    return () => {
      document.body.style.overflow        = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div style={{
      minHeight: "100svh",
      background: "#080808",
      color: "#fff",
      fontFamily: "'Nunito', sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>

      {/* Layers décoratifs */}
      {!reduced && <Blobs />}
      {!reduced && <Rings />}
      <Grain />
      {!reduced && <Particles active={!reduced} />}

      {/* Barre top gradient */}
      <TopBar />

      {/* Contenu principal */}
      <main style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start",
        padding: "4rem 1.5rem 6rem",
        width: "100%",
      }}>

        {/* Logo */}
        <Logo />

        {/* Status pill */}
        <StatusPill />

        {/* Titre */}
        <HeroTitle />

        {/* Sous-titre */}
        <HeroSub />

        {/* Barre de progression */}
        <ProgressBar />

        {/* Divider */}
        <Divider delay={1.05} />

        {/* Contacts — 2 colonnes sur desktop */}
        <motion.section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.75rem",
            width: "100%", maxWidth: 620,
            marginBottom: "2.5rem",
          }}
          aria-label="Nous contacter pendant la maintenance">
          {CONTACTS.map((c, i) => <ContactCard key={c.id} c={c} idx={i} />)}
        </motion.section>

        {/* Réseaux sociaux */}
        <motion.div
          style={{ display: "flex", gap: "0.55rem", marginBottom: "2.75rem" }}
          aria-label="Réseaux sociaux">
          {SOCIALS.map((s, i) => <SocialButton key={s.label} s={s} idx={i} />)}
        </motion.div>

        {/* Badges */}
        <motion.div
          style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center", marginBottom: "2.5rem" }}>
          {BADGES.map((b, i) => <Badge key={b.label} b={b} idx={i} />)}
        </motion.div>

        {/* CTA Buttons : Installer l'app + Portail résultats */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "0.1rem", width: "100%", maxWidth: 400,
          marginBottom: "2.5rem",
        }}>
          <InstallButton delay={2.0} />
          <PortalButton  delay={2.15} />
        </div>

        {/* Réseaux sociaux */}
        <motion.div
          style={{ display: "flex", gap: "0.55rem", marginBottom: "2.5rem" }}
          aria-label="Réseaux sociaux">
          {SOCIALS.map((s, i) => <SocialButton key={s.label} s={s} idx={i} />)}
        </motion.div>

        {/* Footer */}
        <Footer />

      </main>
    </div>
  );
}
