import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   PAGEINTRO v8 — Cinématique élégante 8.5s
   
   TIMELINE :
   0.0 → 1.0s   OPEN    Image fade-in, Ken Burns léger (1.04→1.07)
   1.0 → 2.8s   TITLE   Tagline frappe lente lettre par lettre
   2.8 → 5.0s   SUB     Sous-titre + ligne décorative
   5.0 → 7.0s   HOLD    Pause contemplative + badges
   7.0 → 8.0s   CLOSE   Barre complète, respiration
   8.0 → 8.8s   EXIT    Fondu sortie
   ═══════════════════════════════════════════════════════════════ */

function preloadImage(src) {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = src;
  });
}

const CHAR_SPEED = {
  ".": 320, "!": 290, "?": 290, ",": 200, ":": 170,
  "·": 150, "—": 130, " ": 65, default: 55,
};

function useTypewriter(text, { start = false, speedMult = 1.0 } = {}) {
  const [out,  setOut]  = useState("");
  const [done, setDone] = useState(false);
  const s = useRef({ raf: null, idx: 0, next: 0 });

  useEffect(() => {
    const st = s.current;
    if (st.raf) cancelAnimationFrame(st.raf);
    setOut(""); setDone(false);
    st.idx = 0; st.next = 0;
    if (!start || !text) return;

    const tick = (now) => {
      if (now < st.next) { st.raf = requestAnimationFrame(tick); return; }
      if (st.idx >= text.length) { setDone(true); return; }
      const ch = text[st.idx++];
      setOut(text.slice(0, st.idx));
      st.next = now + ((CHAR_SPEED[ch] ?? CHAR_SPEED.default) + (Math.random() * 22 - 11)) * speedMult;
      st.raf = requestAnimationFrame(tick);
    };
    st.raf = requestAnimationFrame(tick);
    return () => { if (st.raf) cancelAnimationFrame(st.raf); };
  }, [text, start, speedMult]); // eslint-disable-line

  return [out, done];
}

const cursorStyle = {
  display: "inline-block", width: 3, height: "0.8em",
  background: "#fff", marginLeft: 4, verticalAlign: "middle",
  borderRadius: 2, animation: "twBlink 0.75s step-start infinite",
};

function Divider({ accent, visible }) {
  return (
    <motion.div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "1.6rem 0 1.4rem" }}
      initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        style={{ height: 1, background: "rgba(255,255,255,0.28)", borderRadius: 1 }}
        initial={{ width: 0 }} animate={{ width: visible ? 64 : 0 }}
        transition={{ duration: 0.8, ease: [0.15, 0.85, 0.4, 1] }}
      />
      <motion.div
        style={{ width: 7, height: 7, borderRadius: "50%", background: accent }}
        animate={visible ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ height: 1, background: "rgba(255,255,255,0.28)", borderRadius: 1 }}
        initial={{ width: 0 }} animate={{ width: visible ? 64 : 0 }}
        transition={{ duration: 0.8, ease: [0.15, 0.85, 0.4, 1] }}
      />
    </motion.div>
  );
}

function Badges({ accent, visible }) {
  const list = ["Excellence", "Bienveillance", "Épanouissement"];
  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: "1.8rem" }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.8, ease: [0.15, 0.85, 0.4, 1] }}
    >
      {list.map((b, i) => (
        <motion.span key={b}
          style={{
            padding: "0.32rem 0.95rem", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)", borderRadius: 40,
            fontFamily: "'Poppins', sans-serif", fontSize: "0.6rem",
            fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: i * 0.14, ease: [0.15, 0.85, 0.4, 1] }}
        >{b}</motion.span>
      ))}
    </motion.div>
  );
}

function Particles({ particles, visible }) {
  if (!visible || !particles.length) return null;
  return (
    <>
      {particles.map((p, i) => (
        <motion.span key={i} style={{
          position: "absolute",
          fontSize: `${1.0 + (i % 3) * 0.4}rem`,
          left: `${8 + i * 13}%`, zIndex: 5,
          pointerEvents: "none", userSelect: "none",
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.55))",
        }}
          initial={{ y: "108vh", opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            y: [`108vh`, `${20 + (i % 5) * 12}vh`, `${14 + (i % 5) * 12}vh`],
            opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1],
            rotate: i % 2 === 0 ? [0, 20, -8] : [0, -18, 10],
          }}
          transition={{
            duration: 7.0, delay: 0.9 + i * 0.2,
            ease: [0.15, 0.85, 0.4, 1], times: [0, 0.35, 0.78, 1],
          }}
        >{p}</motion.span>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function PageIntro({
  emoji, tagline, sub,
  accentColor = "#F33791",
  heroImage, pageName = "page",
  particles = [],
  emojiAnim = null,   // Config d'animation de l'emoji — fournie par chaque page via ia.js
  speed = "normal",  // "slow" | "normal" | "fast" — rythme cinématique
}) {
  // Timings des phases selon la vitesse choisie
  const T = {
    slow:   { title: 1100, sub: 3200, hold: 4800, close: 7800, exit: 9600 },
    normal: { title: 1000, sub: 2800, hold: 4400, close: 7000, exit: 8800 },
    fast:   { title:  800, sub: 2200, hold: 3600, close: 5800, exit: 7400 },
  }[speed] ?? { title: 1000, sub: 2800, hold: 4400, close: 7000, exit: 8800 };
  const [ready,    setReady]    = useState(false);
  const [show,     setShow]     = useState(true);
  const [phase,    setPhase]    = useState(0);
  const [subStart, setSubStart] = useState(false);

  useEffect(() => {
    if (document.getElementById("tw-css")) return;
    const s = document.createElement("style");
    s.id = "tw-css";
    s.textContent = `@keyframes twBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }`;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    let alive = true;
    preloadImage(heroImage).then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, [heroImage]);

  useEffect(() => {
    if (!ready) return;
    const tt = [
      setTimeout(() => setPhase(1),       T.title),
      setTimeout(() => setSubStart(true), T.sub),
      setTimeout(() => setPhase(2),       T.sub),
      setTimeout(() => setPhase(3),       T.hold),
      setTimeout(() => setPhase(4),       T.close),
      setTimeout(() => setShow(false),    T.exit),
    ];
    return () => tt.forEach(clearTimeout);
  }, [ready]); // eslint-disable-line

  const speedMult = speed === "slow" ? 1.35 : speed === "fast" ? 0.68 : 1.0;
  const [taglineText, taglineDone] = useTypewriter(tagline,   { start: phase >= 1, speedMult });
  const [subText,     subDone]     = useTypewriter(sub || "", { start: subStart,   speedMult });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`intro-${pageName}`}
          onClick={() => setShow(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", cursor: "default",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >

          {/* ══ IMAGE — Ken Burns discret ══ */}
          <motion.div style={{
            position: "absolute", inset: 0,
            backgroundImage: ready && heroImage ? `url('${heroImage}')` : "none",
            backgroundColor: "#06060f",
            backgroundSize: "cover", backgroundPosition: "center",
            willChange: "transform, opacity",
          }}
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: phase >= 4 ? 1.08 : 1.05, opacity: ready ? 1 : 0 }}
            transition={{ duration: 8.5, ease: "linear" }}
          />

          {/* ══ OVERLAYS ══ */}
          <motion.div style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.1 }}
          >
            <div style={{ position: "absolute", inset: 0, background: "rgba(4,4,14,0.52)" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 140% 120% at 50% 50%, transparent 42%, rgba(0,0,0,0.62) 100%)",
            }} />
            <div style={{
              position: "absolute", bottom: "-8%", left: "18%", right: "18%",
              height: "42%", background: `${accentColor}15`,
              filter: "blur(72px)", borderRadius: "50%",
            }} />
          </motion.div>

          {/* ══ BANDES CINÉMA ══ */}
          <motion.div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 3, background: accentColor, transformOrigin: "left",
          }}
            initial={{ scaleX: 0 }} animate={{ scaleX: ready ? 1 : 0 }}
            transition={{ duration: 1.0, ease: [0.15, 0.85, 0.4, 1] }}
          />
          <motion.div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 3, background: accentColor, transformOrigin: "right",
          }}
            initial={{ scaleX: 0 }} animate={{ scaleX: ready ? 1 : 0 }}
            transition={{ duration: 1.0, ease: [0.15, 0.85, 0.4, 1] }}
          />

          {/* ══ COINS CINÉMA ══ */}
          {[
            { top: 20, left: 20,  borderTop: `1.5px solid ${accentColor}80`, borderLeft:  `1.5px solid ${accentColor}80` },
            { top: 20, right: 20, borderTop: `1.5px solid ${accentColor}80`, borderRight: `1.5px solid ${accentColor}80` },
            { bottom: 20, left: 20,  borderBottom: `1.5px solid ${accentColor}80`, borderLeft:  `1.5px solid ${accentColor}80` },
            { bottom: 20, right: 20, borderBottom: `1.5px solid ${accentColor}80`, borderRight: `1.5px solid ${accentColor}80` },
          ].map((style, i) => (
            <motion.div key={i}
              style={{ position: "absolute", width: 28, height: 28, ...style }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.07, ease: [0.15, 0.85, 0.4, 1] }}
            />
          ))}

          {/* ══ LABEL HAUT ══ */}
          <motion.div style={{
            position: "absolute", top: 30, left: 0, right: 0, zIndex: 6,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.55rem",
            fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
          }}
            initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            École Les Bulles de Joie &nbsp;—&nbsp; {pageName}
          </motion.div>

          {/* ══ PARTICULES ══ */}
          <Particles particles={particles} visible={phase >= 1} />

          {/* ══ CONTENU ══ */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                style={{
                  position: "relative", zIndex: 4,
                  textAlign: "center", padding: "2.5rem 2rem",
                  maxWidth: 610, width: "100%",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.15, 0.85, 0.4, 1] }}
              >

                {/* Emoji — animation injectée par la page via emojiAnim, ou défaut */}
                <motion.div style={{
                  width: 110, height: 110, borderRadius: "50%",
                  background: "rgba(255,255,255,0.97)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3.3rem", margin: "0 auto 2rem",
                }}
                  animate={emojiAnim?.animate ?? {
                    scale:   [0.55, 1.12, 0.95, 1.03, 1],
                    rotate:  [0,    18,  -11,    6,   0],
                    boxShadow: [
                      `0 0 0 0px ${accentColor}90`,
                      `0 0 0 28px ${accentColor}00`,
                      `0 0 0 0px ${accentColor}00`,
                    ],
                  }}
                  transition={emojiAnim?.transition ?? {
                    duration: 1.5, ease: "easeOut", times: [0, 0.28, 0.6, 0.8, 1],
                  }}
                >
                  {emoji}
                </motion.div>

                {/* Tagline */}
                <h2 style={{
                  fontFamily: "'Poppins', sans-serif", fontWeight: 800,
                  fontSize: "clamp(1.7rem, 6.2vw, 3.1rem)",
                  color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1,
                  textShadow: "0 4px 40px rgba(0,0,0,0.65)",
                  marginBottom: 0, minHeight: "1.15em",
                }}>
                  {taglineText}
                  {phase === 1 && !taglineDone && <span style={cursorStyle} />}
                </h2>

                {/* Ligne déco */}
                <Divider accent={accentColor} visible={phase >= 2} />

                {/* Sous-titre */}
                {sub && (
                  <motion.p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "clamp(0.94rem, 2.6vw, 1.14rem)",
                    color: "rgba(255,255,255,0.82)",
                    maxWidth: 480, margin: "0 auto",
                    lineHeight: 1.74, letterSpacing: "0.012em",
                    minHeight: "3.5em",
                  }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {subText}
                    {phase === 2 && !subDone && <span style={cursorStyle} />}
                  </motion.p>
                )}

                {/* Badges */}
                <Badges accent={accentColor} visible={phase >= 3} />

                {/* Barre segmentée */}
                <motion.div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: "2.4rem" }}
                  initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {[1, 1.6, 2.5, 1.6, 1].map((flex, i) => (
                    <div key={i} style={{
                      flex, height: 2.5, borderRadius: 3,
                      background: "rgba(255,255,255,0.12)", overflow: "hidden",
                    }}>
                      <motion.div
                        style={{ height: "100%", background: i === 2 ? accentColor : "rgba(255,255,255,0.6)", originX: 0 }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: phase >= 1 ? 1 : 0 }}
                        transition={{ duration: 7.5, delay: i * 0.08, ease: "linear" }}
                      />
                    </div>
                  ))}
                </motion.div>

                {/* Hint skip */}
                <motion.div style={{
                  marginTop: "1.2rem",
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em",
                }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ duration: 1.2 }}
                >
                  appuyez pour continuer
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
