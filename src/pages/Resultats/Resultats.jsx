/**
 * Resultats.jsx — v30 Ultra-Complet
 * ✓ Pas de photos résultats
 * ✓ CountUp corrigé (useEffect, useRef)
 * ✓ Portail lien mis à jour
 * ✓ Agréments officiels
 * ✓ Témoignages parents
 * ✓ FAQ suivi scolaire
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { SCHOOL, EVALUATION_PILLARS, CALENDRIER } from "../../data/content";
import PageIntro from "../../components/PageIntro/PageIntro";
import { Reveal, EASE } from "../../utils/anim";
import * as PageIA from "../../utils/ia";
const P = PageIA.RESULTATS;

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{ minHeight: "55vh", position: "relative", display: "flex", alignItems: "center", paddingTop: "var(--nav-h)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/hero-resultats.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(10,10,10,0.88) 0%,rgba(124,58,255,0.32) 55%,rgba(10,10,10,0.78) 100%)", zIndex: 1 }} />
      <div style={{ position: "absolute", right: "-3rem", top: "-2rem", width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600, border: "1px solid rgba(200,255,0,0.15)", borderRadius: "50%", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "4rem", top: "6rem", width: "35vw", height: "35vw", maxWidth: 380, maxHeight: 380, border: "1px solid rgba(200,255,0,0.08)", borderRadius: "50%", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "-2rem", bottom: "-2rem", width: "40vw", height: "40vw", maxWidth: 420, background: "radial-gradient(ellipse,rgba(124,58,255,0.18) 0%,transparent 70%)", borderRadius: "50%", zIndex: 1 }} />

      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "4rem", paddingBottom: "4.5rem" }}>
        <motion.div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "rgba(200,255,0,0.15)", border: "1px solid rgba(200,255,0,0.4)", borderRadius: 100, padding: "0.3rem 1rem 0.3rem 0.65rem", marginBottom: "1.25rem" }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <motion.span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C8FF00", boxShadow: "0 0 8px #C8FF00", flexShrink: 0 }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#C8FF00", textTransform: "uppercase" }}>Portail & Suivi scolaire</span>
        </motion.div>

        <motion.h1 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(2.8rem, 8vw, 6rem)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: "1.4rem", color: "#fff" }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
          Résultats<br />
          <span style={{ background: "linear-gradient(90deg,#C8FF00,#F33791)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            &amp; Bulletins
          </span>
        </motion.h1>

        <motion.p style={{ fontFamily: "'Nunito'", fontSize: "clamp(0.92rem, 2.2vw, 1.1rem)", color: "rgba(255,255,255,0.72)", maxWidth: 480, lineHeight: 1.75, marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          Consultez les résultats de vos enfants en ligne, partout, à tout moment — en toute sécurité.
        </motion.p>

        <motion.div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "2.25rem" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
          {["🏆 Excellence académique", "📊 Suivi trimestriel", "🔐 Portail sécurisé"].map(b => (
            <span key={b} style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.62rem", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.3rem 0.85rem", borderRadius: 100, backdropFilter: "blur(8px)" }}>{b}</span>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <motion.a href={SCHOOL.portalUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", padding: "1rem 2.4rem", background: "linear-gradient(135deg,#C8FF00 0%,#A8E000 100%)", color: "#0A0A0A", fontFamily: "'Poppins'", fontWeight: 900, fontSize: "0.84rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", boxShadow: "0 8px 32px rgba(200,255,0,0.38)", textDecoration: "none" }}
            whileHover={{ scale: 1.05, boxShadow: "0 14px 44px rgba(200,255,0,0.55)" }} whileTap={{ scale: 0.97 }}>
            🌐 Accéder au Portail
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   STATS ANIMÉES — CountUp corrigé
══════════════════════════════════════════════ */
function CountUp({ target, suffix = "" }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          let current = 0;
          const steps = 44;
          const increment = Math.ceil(target / steps);
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(current);
            }
          }, 28);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const METRICS = [
  { target: 8,   suffix: "+", label: "Années d'excellence",    emoji: "🗓️", color: "#F33791" },
  { target: 100, suffix: "+", label: "Élèves épanouis",        emoji: "👨‍🎓", color: "#C8FF00" },
  { target: 98,  suffix: "%", label: "Taux de satisfaction",   emoji: "⭐",  color: "#7C3AFF" },
  { target: 20,  suffix: "+", label: "Enseignants qualifiés",  emoji: "👩‍🏫", color: "#FF6B35" },
  { target: 2,   suffix: "",  label: "Agréments officiels",    emoji: "📜",  color: "#00D46A" },
  { target: 4,   suffix: "",  label: "Niveaux d'enseignement", emoji: "🎓",  color: "#0BB4D8" },
];

function StatsSection() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <section ref={ref} style={{ padding: "5.5rem 0", background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(200,255,0,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}>Les Bulles de Joie en chiffres</div>
            <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05 }}>
              8 ans de <span style={{ color: "#C8FF00" }}>résultats</span> prouvés
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.07)" }}>
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              style={{ padding: "2.25rem 1.5rem", textAlign: "center", background: "#0A0A0A", position: "relative", overflow: "hidden" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ background: "#111" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color }} />
              <div style={{ fontSize: "1.75rem", marginBottom: "0.55rem" }}>{m.emoji}</div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3rem)", letterSpacing: "-0.05em", color: m.color, lineHeight: 1 }}>
                <CountUp target={m.target} suffix={m.suffix} />
              </div>
              <div style={{ fontFamily: "'Poppins'", fontSize: "0.68rem", color: "rgba(255,255,255,0.42)", marginTop: "0.45rem", letterSpacing: "0.04em", fontWeight: 600, lineHeight: 1.4 }}>{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PORTAIL PREMIUM
══════════════════════════════════════════════ */
const PORTAL_BADGES = [
  { label: "Accès 24h/24",        icon: "⚡", color: "#C8FF00", bg: "rgba(200,255,0,0.10)",   border: "rgba(200,255,0,0.28)" },
  { label: "Bulletins détaillés",  icon: "📋", color: "#F33791", bg: "rgba(243,55,145,0.10)", border: "rgba(243,55,145,0.28)" },
  { label: "Suivi trimestriel",    icon: "📊", color: "#7C3AFF", bg: "rgba(124,58,255,0.10)", border: "rgba(124,58,255,0.28)" },
  { label: "Historique complet",   icon: "🗂",  color: "#FF6B35", bg: "rgba(255,107,53,0.10)", border: "rgba(255,107,53,0.28)" },
  { label: "Multi-appareils",      icon: "📱", color: "#00B4D8", bg: "rgba(0,180,216,0.10)",  border: "rgba(0,180,216,0.28)" },
  { label: "Sécurisé HTTPS",       icon: "🔒", color: "#00D46A", bg: "rgba(0,212,106,0.10)",  border: "rgba(0,212,106,0.28)" },
];

const PORTAL_STEPS = [
  { n: "01", icon: "🎓", title: "Obtenez vos identifiants", desc: "Remis par le secrétariat lors de l'inscription ou sur simple demande." },
  { n: "02", icon: "🌐", title: "Accédez au portail", desc: "Rendez-vous sur portailresultats.web.app depuis n'importe quel appareil." },
  { n: "03", icon: "📊", title: "Consultez les résultats", desc: "Bulletins, notes, appréciations, progression et historique complets." },
];

function PortailSection() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <section ref={ref} style={{ background: "#FFFFFF", padding: "6rem 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-6rem", right: "-6rem", width: "45vw", height: "45vw", maxWidth: 500, background: "radial-gradient(ellipse,rgba(200,255,0,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>

        {/* Header */}
        <motion.div style={{ textAlign: "center", marginBottom: "3rem" }}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65 }}>
          <motion.div style={{ fontSize: "3.5rem", display: "inline-block", marginBottom: "1rem", filter: "drop-shadow(0 0 20px rgba(200,255,0,0.45))" }}
            animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🔐</motion.div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "0.85rem" }}>
            <motion.div style={{ height: 1, background: "linear-gradient(90deg,transparent,#00A550)", width: 40 }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }} />
            <span style={{ fontFamily: "'Poppins'", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#00A550" }}>Portail Parent Numérique</span>
            <motion.div style={{ height: 1, background: "linear-gradient(90deg,#00A550,transparent)", width: 40 }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }} />
          </div>

          <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(2rem, 6vw, 3.2rem)", letterSpacing: "-0.04em", lineHeight: 1.05, color: "#0A0A0A", marginBottom: "0.75rem" }}>
            Vos résultats,<br />
            <span style={{ background: "linear-gradient(90deg,#00A550,#C8FF00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              partout &amp; toujours
            </span>
          </h2>
          <p style={{ fontFamily: "'Nunito'", color: "#6B6B6B", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Portail sécurisé HTTPS · Disponible 24h/24, 7j/7 · Depuis votre smartphone
          </p>
        </motion.div>

        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.55rem", marginBottom: "3rem" }}>
          {PORTAL_BADGES.map(({ label, icon, color, bg, border }, i) => (
            <motion.span key={label}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 1.05rem", background: bg, border: `1px solid ${border}`, borderRadius: 30, fontFamily: "'Poppins'", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.06em", color }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ scale: 1.07, y: -2 }}>
              <span>{icon}</span>{label}
            </motion.span>
          ))}
        </div>

        {/* 3 étapes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {PORTAL_STEPS.map((s, i) => (
            <motion.div key={s.n}
              style={{ background: "#FAFAFA", border: "1.5px solid #E8E8E8", borderRadius: 14, padding: "1.5rem", position: "relative", overflow: "hidden" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ borderColor: "#C8FF00", boxShadow: "0 8px 28px rgba(200,255,0,0.18)", y: -3 }}>
              <div style={{ position: "absolute", top: "-0.5rem", right: "0.75rem", fontFamily: "'Poppins'", fontWeight: 900, fontSize: "3.5rem", color: "#00A55012", lineHeight: 1, userSelect: "none" }}>{s.n}</div>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{s.icon}</div>
              <h4 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "-0.01em", color: "#0A0A0A", marginBottom: "0.4rem" }}>{s.title}</h4>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.78rem", color: "#6B6B6B", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div style={{ textAlign: "center" }}
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>
          <motion.a href={SCHOOL.portalUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem", padding: "1.1rem 2.8rem", background: "linear-gradient(135deg,#C8FF00 0%,#A8E000 100%)", color: "#0A0A0A", fontFamily: "'Poppins'", fontWeight: 900, fontSize: "0.9rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", boxShadow: "0 8px 32px rgba(200,255,0,0.35)", textDecoration: "none", position: "relative", overflow: "hidden" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 48px rgba(200,255,0,0.5)" }}
            whileTap={{ scale: 0.97 }}>
            <motion.span style={{ position: "absolute", inset: -4, borderRadius: "100px", border: "2px solid rgba(200,255,0,0.5)" }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.96, 1.08, 1.18] }}
              transition={{ duration: 2.2, repeat: Infinity }} />
            🌐 Ouvrir le Portail
          </motion.a>
          <p style={{ fontFamily: "'Nunito'", fontSize: "0.7rem", color: "#ACACAC", marginTop: "0.85rem" }}>
            portailresultats.web.app · Identifiants fournis à l'inscription
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   VISION — bento
══════════════════════════════════════════════ */
const PILLAR_SCHEMES = [
  { bg: "#F33791", txt: "#fff",    glow: "rgba(243,55,145,0.45)", accent: "#FFD4EA" },
  { bg: "#0A0A0A", txt: "#C8FF00", glow: "rgba(200,255,0,0.30)",  accent: "#C8FF00" },
  { bg: "#C8FF00", txt: "#0A0A0A", glow: "rgba(200,255,0,0.45)",  accent: "#0A0A0A" },
  { bg: "#7C3AFF", txt: "#fff",    glow: "rgba(124,58,255,0.45)", accent: "#E0D4FF" },
];

function VisionSection() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [hov, setHov] = useState(null);
  return (
    <section style={{ padding: "5.5rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal style={{ marginBottom: "2.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F33791", marginBottom: "0.55rem" }}>
                <span style={{ width: 18, height: 1.5, background: "#F33791", display: "inline-block", borderRadius: 2 }} />
                Notre Vision
              </div>
              <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0 }}>
                Évaluation <span style={{ color: "#F33791" }}>Bienveillante</span>
              </h2>
            </div>
            <p style={{ fontFamily: "'Nunito'", color: "#888", fontSize: "0.9rem", lineHeight: 1.65, maxWidth: 320, margin: 0 }}>
              Une approche humaine où chaque enfant est acteur de sa propre progression.
            </p>
          </div>
        </Reveal>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem" }}>
          {EVALUATION_PILLARS.map((p, i) => {
            const sc = PILLAR_SCHEMES[i];
            const isHov = hov === i;
            return (
              <motion.div key={p.title}
                style={{ background: sc.bg, padding: "2rem 1.75rem", borderRadius: 18, cursor: "default", position: "relative", overflow: "hidden", minHeight: i === 0 ? 210 : 180 }}
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE.out }}
                onHoverStart={() => setHov(i)} onHoverEnd={() => setHov(null)}
                whileHover={{ scale: 1.025, zIndex: 2 }}>
                <motion.div style={{ position: "absolute", bottom: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(ellipse,${sc.glow} 0%,transparent 70%)`, pointerEvents: "none" }}
                  animate={{ scale: isHov ? 1.7 : 1, opacity: isHov ? 1 : 0.55 }}
                  transition={{ duration: 0.4 }} />
                <motion.span style={{ display: "inline-block", fontSize: "2.4rem", marginBottom: "0.9rem" }}
                  animate={isHov ? { scale: [1, 1.3, 1.1], rotate: [0, -12, 8, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}>
                  {p.emoji}
                </motion.span>
                <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1.08rem", letterSpacing: "-0.02em", color: sc.txt, marginBottom: "0.4rem", lineHeight: 1.2 }}>{p.title}</h3>
                <p style={{ fontFamily: "'Nunito'", fontSize: "0.84rem", color: sc.txt, opacity: 0.72, lineHeight: 1.62, margin: 0 }}>{p.desc}</p>
                <motion.div style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: sc.accent, opacity: 0.55, borderRadius: "0 0 0 18px" }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: "40%" } : {}}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: [0.15, 0.85, 0.4, 1] }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CALENDRIER D'ÉVALUATION
══════════════════════════════════════════════ */
const CAL_SCHEMES = [
  { line: "#F33791", border: "rgba(243,55,145,0.2)", num: "01" },
  { line: "#3B82F6", border: "rgba(59,130,246,0.2)",  num: "02" },
  { line: "#F59E0B", border: "rgba(245,158,11,0.2)",  num: "03" },
  { line: "#00D46A", border: "rgba(0,212,106,0.2)",   num: "04" },
];

function CalItem({ item, i, total }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const sc = CAL_SCHEMES[i];
  return (
    <motion.div ref={ref} style={{ display: "flex", gap: "1.25rem", position: "relative" }}
      initial={{ opacity: 0, x: -18 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.06, ease: EASE.out }}>
      {i < total - 1 && (
        <motion.div style={{ position: "absolute", left: 21, top: 46, width: 2, background: `linear-gradient(to bottom,${sc.line}55,${CAL_SCHEMES[i + 1].line}55)`, zIndex: 0 }}
          initial={{ height: 0 }}
          animate={inView ? { height: "calc(100% + 1.4rem)" } : {}}
          transition={{ duration: 0.65, delay: 0.3, ease: EASE.out }} />
      )}
      <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
        <motion.div style={{ width: 44, height: 44, borderRadius: "50%", background: sc.line, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", boxShadow: `0 0 0 5px #FAFAFA, 0 0 20px ${sc.line}40` }}
          animate={inView ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}>
          {item.emoji}
        </motion.div>
      </div>
      <motion.div style={{ flex: 1, background: "#fff", border: `1.5px solid ${sc.border}`, borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}
        whileHover={{ borderColor: sc.line, boxShadow: `0 8px 32px ${sc.line}1A`, y: -2 }}
        transition={{ duration: 0.2 }}>
        <div style={{ position: "absolute", top: -10, right: 12, fontFamily: "'Poppins'", fontWeight: 900, fontSize: "3.5rem", color: sc.line, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>{sc.num}</div>
        <div style={{ fontFamily: "'Poppins'", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: sc.line, marginBottom: "0.35rem" }}>{item.period}</div>
        <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", marginBottom: "0.3rem", color: "#0A0A0A" }}>{item.title}</h3>
        <p style={{ fontFamily: "'Nunito'", fontSize: "0.83rem", color: "#777", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
      </motion.div>
    </motion.div>
  );
}

function CalendrierSection() {
  return (
    <section style={{ padding: "5.5rem 0", background: "#FAFAFA" }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <Reveal style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F33791", marginBottom: "0.75rem" }}>
            <span style={{ width: 16, height: 1.5, background: "#F33791", display: "inline-block", borderRadius: 2 }} />
            Année scolaire 2025-2026
            <span style={{ width: 16, height: 1.5, background: "#F33791", display: "inline-block", borderRadius: 2 }} />
          </div>
          <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(1.9rem, 5vw, 2.8rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            Moments <span style={{ color: "#F33791" }}>Clés</span> de l'Évaluation
          </h2>
        </Reveal>
        <div style={{ position: "relative" }}>
          {CALENDRIER.map((item, i) => <CalItem key={item.title} item={item} i={i} total={CALENDRIER.length} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   AGRÉMENTS OFFICIELS
══════════════════════════════════════════════ */
function AgrementSection() {
  const agréments = [
    {
      num: SCHOOL.agrement2021,
      year: "2021",
      title: "Agrément Crèche & Garderie",
      desc: "Délivré par le Ministère des Affaires Sociales et de la Microfinance du Bénin. Autorise officiellement l'accueil des enfants dès 2 mois dans un cadre légalement reconnu.",
      color: "#F33791",
      icon: "🏛️",
      ministry: "Min. des Affaires Sociales",
    },
    {
      num: SCHOOL.agrement2022,
      year: "2022",
      title: "Agrément Maternelle & Primaire",
      desc: "Délivré par le Ministère des Enseignements Maternel et Primaire du Bénin. Valide le programme bilingue d'excellence et garantit la qualité pédagogique.",
      color: "#00D46A",
      icon: "📜",
      ministry: "Min. de l'Enseignement",
    },
  ];

  return (
    <section style={{ padding: "6rem 0", background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 60% at 50% 50%,rgba(200,255,0,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "55px 55px", pointerEvents: "none" }} />
      <motion.div style={{ position: "absolute", right: "-8rem", top: "5%", width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(200,255,0,0.08)", pointerEvents: "none" }}
        animate={{ rotate: 360 }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}>Reconnaissance de l'État</div>
            <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05 }}>
              Nos Agréments <span style={{ color: "#C8FF00" }}>Officiels</span> 🏛️
            </h2>
            <p style={{ fontFamily: "'Poppins'", color: "rgba(255,255,255,0.38)", fontSize: "0.88rem", marginTop: "0.7rem", maxWidth: 500, margin: "0.7rem auto 0", lineHeight: 1.72 }}>
              Les Bulles de Joie est une école agréée par l'État béninois — un gage de sérieux, de pérennité et de qualité
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", maxWidth: 860, margin: "0 auto" }}>
          {agréments.map((ag, i) => (
            <Reveal key={ag.year} delay={i * 0.15}>
              <motion.div
                style={{ background: "rgba(255,255,255,0.04)", border: `1.5px solid ${ag.color}2A`, borderRadius: 18, padding: "2rem 2rem 1.75rem", position: "relative", overflow: "hidden" }}
                whileHover={{ background: "rgba(255,255,255,0.07)", borderColor: `${ag.color}55`, y: -5, boxShadow: `0 28px 70px ${ag.color}1A` }}
                transition={{ duration: 0.25 }}>
                <div style={{ position: "absolute", top: "-1rem", right: "1rem", fontFamily: "'Poppins'", fontWeight: 900, fontSize: "5.5rem", color: `${ag.color}0E`, letterSpacing: "-0.04em", userSelect: "none", lineHeight: 1 }}>{ag.year}</div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1.4rem" }}>
                  <div style={{ width: 54, height: 54, borderRadius: 14, background: `${ag.color}1E`, border: `1.5px solid ${ag.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>{ag.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.58rem", color: ag.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{ag.year} · {ag.ministry}</div>
                    <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>{ag.title}</h3>
                  </div>
                </div>

                <p style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.68, marginBottom: "1.4rem" }}>{ag.desc}</p>

                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: "0.8rem 1rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontFamily: "'Poppins'", fontSize: "0.58rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Numéro d'agrément</div>
                  <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.76rem", color: ag.color, letterSpacing: "0.02em", wordBreak: "break-all" }}>{ag.num}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div style={{ marginTop: "2.5rem", padding: "1.5rem 2rem", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: "1.1rem", maxWidth: 860, margin: "2.5rem auto 0", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.8rem", flexShrink: 0, marginTop: "0.1rem" }}>✅</span>
            <div>
              <h4 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", color: "#C8FF00", marginBottom: "0.3rem" }}>Établissement officiellement reconnu par l'État béninois</h4>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.8rem", color: "rgba(255,255,255,0.48)", margin: 0, lineHeight: 1.65 }}>
                Vos enfants bénéficient d'un encadrement légalement reconnu, conforme aux normes nationales. Un gage de sérieux, de stabilité et de qualité sur le long terme.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   TÉMOIGNAGES PARENTS
══════════════════════════════════════════════ */
const TEMOIGNAGES = [
  { nom: "Fatou A.", role: "Maman d'un élève en CE1", emoji: "👩🏾", note: 5, color: "#F33791", texte: "Mon fils a fait d'énormes progrès en anglais en seulement 6 mois. L'équipe est bienveillante, les enseignants à l'écoute. Le portail en ligne me permet de suivre ses notes à tout moment." },
  { nom: "Roméo & Grace K.", role: "Parents de jumeaux en Maternelle", emoji: "👫🏾", note: 5, color: "#C8FF00", texte: "Nos enfants adorent aller à l'école ! Ils reviennent en chantant des comptines en anglais. Le programme 3E a transformé leur comportement à la maison — plus polis, plus assurés." },
  { nom: "Dr. Ismaël T.", role: "Papa d'une élève en CI", emoji: "👨🏾‍💼", note: 5, color: "#7C3AFF", texte: "Le niveau académique est excellent et ma fille est devenue bien plus confiante à l'oral. Les bulletins détaillés et la transparence du suivi sont remarquables." },
  { nom: "Aminata B.", role: "Maman d'un enfant à la crèche", emoji: "🤱🏾", note: 5, color: "#00D46A", texte: "Confier son nourrisson est un défi. Mais ici, l'équipe m'envoie des comptes-rendus, le carnet de bord est rempli chaque jour. Je suis rassurée dès le premier mois." },
];

function TemoignagesSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Ce que disent les familles</div>
            <h2 className="section-title">Témoignages <span style={{ color: "#F33791" }}>Parents</span> 💬</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: 480, margin: "0.6rem auto 0" }}>
              La confiance des familles est notre plus belle récompense
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.nom} delay={i * 0.09}>
              <motion.article
                style={{ background: "#fff", border: "1.5px solid #F0F0F0", borderRadius: 18, padding: "1.85rem", position: "relative", overflow: "hidden", height: "100%" }}
                whileHover={{ borderColor: t.color, boxShadow: `0 16px 50px ${t.color}1E`, y: -4 }}
                transition={{ duration: 0.25 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color }} />
                {/* Stars */}
                <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                  {Array.from({ length: t.note }).map((_, s) => (
                    <span key={s} style={{ color: "#F59E0B", fontSize: "0.95rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: "'Nunito'", fontSize: "0.9rem", color: "#444", lineHeight: 1.72, marginBottom: "1.4rem", fontStyle: "italic" }}>"{t.texte}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${t.color}18`, border: `2px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", flexShrink: 0 }}>{t.emoji}</div>
                  <div>
                    <div style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.88rem", color: "#0A0A0A" }}>{t.nom}</div>
                    <div style={{ fontFamily: "'Poppins'", fontSize: "0.7rem", color: "#ACACAC" }}>{t.role}</div>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FAQ SUIVI
══════════════════════════════════════════════ */
const FAQ = [
  { q: "Comment accéder au portail en ligne ?", a: "Rendez-vous sur portailresultats.web.app. Vos identifiants vous sont remis lors de l'inscription. En cas de perte, contactez le secrétariat via WhatsApp ou par email." },
  { q: "À quelle fréquence les résultats sont-ils mis à jour ?", a: "Les résultats sont publiés après chaque période d'évaluation trimestrielle. Des observations continues peuvent être ajoutées par les enseignants tout au long de l'année." },
  { q: "Comment fonctionnent les rencontres parents-enseignants ?", a: "Des rencontres officielles sont organisées en décembre et en mars. Des rendez-vous supplémentaires peuvent être demandés à tout moment auprès du secrétariat ou directement à l'enseignant." },
  { q: "Comment sont évalués les enfants selon les niveaux ?", a: "À la crèche et en maternelle, le système est descriptif et par compétences — sans notation chiffrée. Au primaire, les évaluations sont notées sur 10. Un rapport de comportement est joint à chaque bulletin." },
  { q: "Que faire en cas de baisse des résultats ?", a: "Contactez directement l'enseignant du niveau concerné (numéros disponibles sur la page Contact). Un plan d'accompagnement personnalisé peut être mis en place rapidement et gratuitement." },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "6rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Vos questions</div>
            <h2 className="section-title">Questions sur le <span style={{ color: "#7C3AFF" }}>Suivi</span> ❓</h2>
          </div>
        </Reveal>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: "0.65rem" }}>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div style={{ border: `1.5px solid ${isOpen ? "#7C3AFF" : "#E8E8E8"}`, borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: isOpen ? "0 6px 28px rgba(124,58,255,0.1)" : "none", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                  <button onClick={() => setOpen(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "1.15rem 1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", textAlign: "left" }}>
                    <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.9rem", color: "#0A0A0A", lineHeight: 1.45 }}>{item.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
                      style={{ width: 26, height: 26, borderRadius: "50%", background: isOpen ? "#7C3AFF" : "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isOpen ? "#fff" : "#6B6B6B", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1 }}>+</motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 1.5rem 1.35rem", borderTop: "1px solid #F0F0F0" }}>
                          <p style={{ fontFamily: "'Poppins'", fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.72, margin: "0.8rem 0 0" }}>{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CTA
══════════════════════════════════════════════ */
function CTASection() {
  return (
    <section style={{ padding: "5rem 0", background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 50%,rgba(200,255,0,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
      <motion.div style={{ position: "absolute", left: "-4rem", bottom: "-4rem", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(124,58,255,0.12) 0%,transparent 70%)", pointerEvents: "none" }}
        animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <motion.div style={{ fontSize: "2.8rem", display: "inline-block", marginBottom: "1rem" }}
            animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>🎓</motion.div>
          <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(1.6rem, 4.5vw, 2.6rem)", letterSpacing: "-0.04em", color: "#fff", marginBottom: "0.65rem", lineHeight: 1.1 }}>
            Une question sur le<br /><span style={{ color: "#C8FF00" }}>suivi de votre enfant ?</span>
          </h2>
          <p style={{ fontFamily: "'Nunito'", color: "rgba(255,255,255,0.45)", fontSize: "0.92rem", marginBottom: "2.25rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2.25rem" }}>
            Notre équipe pédagogique est disponible pour vous accompagner à chaque étape.
          </p>
          <div style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`https://wa.me/${SCHOOL.whatsappRaw}?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20le%20suivi%20scolaire`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2.2rem", background: "#C8FF00", color: "#0A0A0A", fontFamily: "'Poppins'", fontWeight: 900, fontSize: "0.84rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", textDecoration: "none" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(200,255,0,0.42)" }} whileTap={{ scale: 0.97 }}>
              💬 Nous écrire
            </motion.a>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 2rem", background: "transparent", color: "rgba(255,255,255,0.7)", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                📍 Nous visiter →
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PAGE EXPORT
══════════════════════════════════════════════ */
export default function Resultats() {
  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <main id="main">
        <PageIntro
          emoji="🏆"
          tagline="Vos enfants progressent, vous le voyez !"
          sub="Consultez les résultats de vos enfants en ligne, partout, à tout moment"
          accentColor="#F33791"
          heroImage="/images/hero-resultats.jpg"
          pageName="resultats"
          particles={["🏆", "🥇", "⭐", "🎓", "🌟", "🎯"]}
          emojiAnim={PageIA.RESULTATS.pageIntroEmoji}
          speed="fast"
        />
        <Hero />
        <StatsSection />
        <PortailSection />
        <VisionSection />
        <CalendrierSection />
        <AgrementSection />
        <TemoignagesSection />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
