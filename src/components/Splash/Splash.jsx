import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   SPLASH v10 — Cinématique 6s · Ultra-Premium

   TIMELINE (inchangée) :
   0.0 → 1.2s  LOGO     Converging rings + scale spring
   1.2 → 2.6s  TITRE    Chars en cascade 3D + shimmer sweep
   2.6 → 4.5s  HOLD     Tagline + bulles vives + badges
   4.5 → 5.5s  BARRE    Progress neon gradient
   5.5 → 6.2s  EXIT     Fondu sortie cinématique
   ═══════════════════════════════════════════════════════════════ */

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState(0);

  /* Injection CSS pour blobs morphiques (perf > Framer Motion) */
  useEffect(() => {
    if (document.getElementById("sp10-css")) return;
    const s = document.createElement("style");
    s.id = "sp10-css";
    s.textContent = `
      @keyframes sp-blob1 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(28px,-18px) scale(1.07)} 68%{transform:translate(-14px,22px) scale(0.94)} }
      @keyframes sp-blob2 { 0%,100%{transform:translate(0,0) scale(1)} 42%{transform:translate(-22px,14px) scale(1.09)} 72%{transform:translate(16px,-10px) scale(0.95)} }
      @keyframes sp-blob3 { 0%,100%{transform:translate(0,0) scale(1)} 28%{transform:translate(12px,20px) scale(1.05)} 60%{transform:translate(-20px,-8px) scale(0.97)} }
      @keyframes sp-shimmer { 0%{transform:translateX(-120%) skewX(-18deg)} 100%{transform:translateX(350%) skewX(-18deg)} }
    `;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const tt = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => {
        setPhase(4);
        setTimeout(onDone, 680);
      }, 5500),
    ];
    return () => tt.forEach(clearTimeout);
  }, [onDone]);

  /* ── Bulles morphiques CSS ── */
  const BLOBS = [
    { w: 380, l: "58%",  t: "-12%", c: "rgba(243,55,145,0.14)", anim: "sp-blob1 9s ease-in-out infinite" },
    { w: 280, l: "-10%", t: "38%",  c: "rgba(200,255,0,0.16)",  anim: "sp-blob2 11s ease-in-out infinite 1s" },
    { w: 200, l: "30%",  t: "68%",  c: "rgba(124,58,255,0.12)", anim: "sp-blob3 8s ease-in-out infinite 0.5s" },
    { w: 100, l: "10%",  t: "5%",   c: "rgba(200,255,0,0.28)",  anim: "sp-blob1 6s ease-in-out infinite 2s" },
    { w: 65,  l: "78%",  t: "48%",  c: "rgba(255,107,53,0.22)", anim: "sp-blob2 7s ease-in-out infinite 0.8s" },
    { w: 50,  l: "20%",  t: "82%",  c: "rgba(0,180,216,0.25)",  anim: "sp-blob3 5.5s ease-in-out infinite 1.5s" },
    { w: 80,  l: "86%",  t: "14%",  c: "rgba(200,255,0,0.20)",  anim: "sp-blob1 7.5s ease-in-out infinite 0.3s" },
  ];

  /* ── "Bulles" = chars 3D ── */
  const BULLES_CHARS = "Bulles".split("");
  /* ── Autres mots ── */
  const OTHER_WORDS = [
    { text: "Les", side: "left" },
    { text: "de Joie", side: "right" },
  ];

  /* ── Badges colorés ── */
  const BADGES = [
    { label: "Crèche",     bg: "rgba(243,55,145,0.08)",  border: "rgba(243,55,145,0.35)", color: "#F33791" },
    { label: "Maternelle", bg: "rgba(200,255,0,0.10)",   border: "rgba(160,210,0,0.45)",  color: "#6a9900" },
    { label: "Primaire",   bg: "rgba(124,58,255,0.08)",  border: "rgba(124,58,255,0.35)", color: "#7C3AFF" },
  ];

  /* ── Emojis flottants (positionnés en px) ── */
  const FLOATS = [
    { em: "🌟", left: "7%",  size: 1.1, delay: 0,    rise: 380 },
    { em: "✨", left: "25%", size: 0.9, delay: 0.18, rise: 310 },
    { em: "💫", left: "45%", size: 1.3, delay: 0.08, rise: 420 },
    { em: "🌸", left: "65%", size: 0.95,delay: 0.25, rise: 330 },
    { em: "⭐", left: "83%", size: 1.0, delay: 0.12, rise: 290 },
    { em: "🎨", left: "35%", size: 0.8, delay: 0.32, rise: 360 },
  ];

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          key="splash"
          style={s.wrap}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >

          {/* ── Fond dégradé de base ── */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 85% 55% at 85% -5%, rgba(243,55,145,0.06) 0%, transparent 60%), radial-gradient(ellipse 65% 55% at -8% 62%, rgba(200,255,0,0.07) 0%, transparent 58%), radial-gradient(ellipse 55% 45% at 48% 108%, rgba(124,58,255,0.05) 0%, transparent 58%)",
          }} />

          {/* ── Bulles morphiques CSS ── */}
          {BLOBS.map((b, i) => (
            <div key={i} style={{
              position: "absolute", width: b.w, height: b.w, borderRadius: "50%",
              background: `radial-gradient(ellipse, ${b.c} 0%, transparent 72%)`,
              left: b.l, top: b.t, pointerEvents: "none",
              animation: b.anim,
            }} />
          ))}

          {/* ── Ligne haut — dégradé animé ── */}
          <motion.div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, #F33791 0%, #FF6B35 40%, #C8FF00 75%, #7C3AFF 100%)",
            transformOrigin: "left",
          }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.15, 0.85, 0.4, 1] }}
          />

          {/* ── Trait gauche ── */}
          <motion.div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5,
            background: "linear-gradient(to bottom, transparent, #F33791 28%, #7C3AFF 72%, transparent)",
            transformOrigin: "top",
          }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.15, 0.85, 0.4, 1] }}
          />

          {/* ── Trait droit ── */}
          <motion.div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, transparent, #C8FF00 35%, #00B4D8 65%, transparent)",
            transformOrigin: "bottom",
          }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.0, delay: 0.35, ease: [0.15, 0.85, 0.4, 1] }}
          />

          {/* ── Logo — anneaux convergents ── */}
          <motion.div style={s.logoOuter}
            initial={{ scale: 0, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Glow radial */}
            <div style={{
              position: "absolute", inset: -30, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(243,55,145,0.20) 0%, transparent 68%)",
            }} />

            {/* Anneau externe → converge vers le centre */}
            <motion.div style={{
              position: "absolute", borderRadius: "50%",
              border: "1px dashed rgba(200,255,0,0.40)",
            }}
              initial={{ inset: -55, opacity: 0 }}
              animate={{ inset: -24, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Anneau intermédiaire → converge */}
            <motion.div style={{
              position: "absolute", borderRadius: "50%",
              border: "1.5px dashed rgba(243,55,145,0.45)",
            }}
              initial={{ inset: -80, opacity: 0 }}
              animate={{ inset: -14, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Bordure principale */}
            <motion.div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2.5px solid #0A0A0A" }}
              animate={{ borderColor: phase >= 1 ? "#F33791" : "#0A0A0A" }}
              transition={{ duration: 0.45 }}
            />

            {/* Halo pulse rose */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid #F33791" }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0, 0.7, 0], scale: [0.85, 1.45, 1.7] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Halo pulse lime */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1.5px solid #C8FF00" }}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: [0, 0.55, 0], scale: [0.88, 1.6, 1.9] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                />
              )}
            </AnimatePresence>

            <img src="/images/logo-minimal.png" alt="Les Bulles de Joie"
              style={{ width: 72, height: 72, objectFit: "contain", borderRadius: "50%", position: "relative", zIndex: 1 }}
            />
          </motion.div>

          {/* ── Titre ── */}
          <motion.div style={{ textAlign: "center" }}>

            {/* Titre principal — layout flex */}
            <div style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", marginBottom: "0.4rem", perspective: 600 }}>

              {/* "Les" */}
              <motion.span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "clamp(1.55rem, 6vw, 2.3rem)", letterSpacing: "-0.038em", lineHeight: 1.05, color: "#0A0A0A" }}
                initial={{ y: 30, opacity: 0, rotateY: -25 }}
                animate={{ y: phase >= 1 ? 0 : 30, opacity: phase >= 1 ? 1 : 0, rotateY: phase >= 1 ? 0 : -25 }}
                transition={{ delay: 0.04, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >Les</motion.span>

              {/* "Bulles" — chars 3D avec shimmer sur le conteneur */}
              <span style={{ position: "relative", display: "inline-flex", overflow: "hidden" }}>
                {BULLES_CHARS.map((char, i) => (
                  <motion.span
                    key={i}
                    style={{
                      display: "inline-block",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(1.55rem, 6vw, 2.3rem)",
                      letterSpacing: "-0.038em",
                      lineHeight: 1.05,
                      background: "linear-gradient(135deg, #F33791 0%, #FF4E6B 40%, #FF6B35 70%, #7C3AFF 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      transformStyle: "preserve-3d",
                    }}
                    initial={{ y: 45, opacity: 0, rotateX: -70, filter: "blur(4px)" }}
                    animate={{
                      y: phase >= 1 ? 0 : 45,
                      opacity: phase >= 1 ? 1 : 0,
                      rotateX: phase >= 1 ? 0 : -70,
                      filter: phase >= 1 ? "blur(0px)" : "blur(4px)",
                    }}
                    transition={{ delay: 0.10 + i * 0.065, duration: 0.48, ease: [0.34, 1.56, 0.64, 1] }}
                  >{char}</motion.span>
                ))}

                {/* Shimmer sweep sur "Bulles" */}
                {phase >= 1 && (
                  <motion.div style={{
                    position: "absolute", top: 0, bottom: 0, width: "55%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
                    pointerEvents: "none", zIndex: 2,
                    animation: "sp-shimmer 0.72s ease-out 0.75s 1 forwards",
                    willChange: "transform",
                  }} />
                )}
              </span>

              {/* "de Joie" */}
              <motion.span style={{ display: "inline-flex", gap: "0.38em" }}>
                {["de", "Joie"].map((w, i) => (
                  <motion.span key={w}
                    style={{
                      fontFamily: "'Poppins', sans-serif", fontWeight: i === 1 ? 900 : 800,
                      fontSize: "clamp(1.55rem, 6vw, 2.3rem)", letterSpacing: "-0.038em", lineHeight: 1.05,
                      color: i === 1 ? "#F33791" : "#0A0A0A",
                      ...(i === 1 && { textShadow: "0 0 30px rgba(243,55,145,0.5)" }),
                    }}
                    initial={{ y: 30, opacity: 0, rotateY: 20 }}
                    animate={{ y: phase >= 1 ? 0 : 30, opacity: phase >= 1 ? 1 : 0, rotateY: phase >= 1 ? 0 : 20 }}
                    transition={{ delay: 0.10 + 6 * 0.065 + i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >{w}</motion.span>
                ))}
              </motion.span>
            </div>

            {/* Sous-titre */}
            <motion.div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "0.68rem",
              color: "#777", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
            }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              <span style={{ color: "#F33791" }}>✦</span>
              {" "}Excellence · Bilingue · Parakou{" "}
              <span style={{ color: "#C8FF00" }}>✦</span>
            </motion.div>

            {/* Séparateur dégradé */}
            <motion.div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "1.1rem 0 0.9rem" }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div style={{ height: 1.5, background: "linear-gradient(90deg, transparent, #F33791)", borderRadius: 2 }}
                initial={{ width: 0 }} animate={{ width: phase >= 2 ? 56 : 0 }}
                transition={{ duration: 0.7, ease: [0.15, 0.85, 0.4, 1] }}
              />
              <motion.div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F33791" }}
                animate={phase >= 2 ? {
                  scale: [1, 1.6, 1],
                  boxShadow: ["0 0 0px rgba(243,55,145,0.6)", "0 0 14px rgba(243,55,145,0.8)", "0 0 0px rgba(243,55,145,0.6)"],
                } : {}}
                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div style={{ height: 1.5, background: "linear-gradient(90deg, #C8FF00, transparent)", borderRadius: 2 }}
                initial={{ width: 0 }} animate={{ width: phase >= 2 ? 56 : 0 }}
                transition={{ duration: 0.7, ease: [0.15, 0.85, 0.4, 1] }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.div style={{
              fontFamily: "'Nunito', sans-serif", fontSize: "clamp(0.82rem, 2.8vw, 1rem)",
              color: "#444", fontStyle: "italic", fontWeight: 600,
              letterSpacing: "0.02em", lineHeight: 1.55, maxWidth: 280, margin: "0 auto",
            }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              Là où chaque enfant s'épanouit
            </motion.div>

            {/* Badges colorés avec micro-animation */}
            <motion.div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: "1.2rem", flexWrap: "wrap" }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 12 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {BADGES.map(({ label, bg, border, color }, i) => (
                <motion.span key={label} style={{
                  padding: "0.28rem 0.95rem",
                  border: `1px solid ${border}`,
                  background: bg,
                  borderRadius: 20,
                  fontFamily: "'Poppins', sans-serif", fontSize: "0.58rem",
                  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color,
                }}
                  initial={{ opacity: 0, scale: 0.75, y: 10 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.75, y: phase >= 2 ? 0 : 10 }}
                  transition={{ duration: 0.42, delay: 0.38 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                >{label}</motion.span>
              ))}
            </motion.div>

            {/* CTA rentrée */}
            <motion.div style={{
              marginTop: "1rem",
              fontFamily: "'Poppins', sans-serif", fontSize: "0.6rem",
              fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#F33791",
            }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              🎒 2026-2027 · Prenez de l'avance
            </motion.div>
          </motion.div>

          {/* ── Barre de progression neon ── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 3, background: "#EBEBEB", overflow: "hidden",
          }}>
            <motion.div style={{
              height: "100%",
              background: "linear-gradient(90deg, #F33791 0%, #FF6B35 45%, #C8FF00 80%, #7C3AFF 100%)",
              transformOrigin: "left",
              boxShadow: "0 0 8px rgba(243,55,145,0.6)",
            }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === 0 ? 0.04 : phase === 1 ? 0.34 : phase === 2 ? 0.64 : 1 }}
              transition={{ duration: phase === 0 ? 1.2 : phase === 1 ? 1.4 : phase === 2 ? 1.9 : 1.0, ease: phase >= 3 ? [0.4, 0, 0.2, 1] : "easeOut" }}
            />
          </div>

          {/* ── Emojis flottants (corrigés en px) ── */}
          <AnimatePresence>
            {phase >= 2 && FLOATS.map(({ em, left, size, delay, rise }) => (
              <motion.span key={em} style={{
                position: "absolute", bottom: "-2rem", left,
                fontSize: `${size}rem`,
                pointerEvents: "none", userSelect: "none",
                filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.14))",
                zIndex: 2,
              }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -rise, -(rise + 60)], opacity: [0, 0.9, 0.9, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.8, delay, ease: "easeOut", times: [0, 0.32, 0.76, 1] }}
              >
                {em}
              </motion.span>
            ))}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

const s = {
  wrap: {
    position: "fixed", inset: 0, background: "#FFFFFF",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", zIndex: 99999, overflow: "hidden", gap: "1.6rem",
  },
  logoOuter: {
    width: 112, height: 112, position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};
