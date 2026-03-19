import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   SCROLL TO TOP v4 — DOM direct (0 re-render sur scroll)
   ▸ Cercle SVG rempli proportionnellement au scroll via DOM ref
   ▸ Visible / caché via une seule valeur de state
   ▸ Flèche animée au centre
   ═══════════════════════════════════════════════════════════════ */

const R = 18;
const C = 2 * Math.PI * R;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const circleRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? Math.min(scrolled / total, 1) : 0;
        // DOM direct pour le cercle → 0 re-render
        if (circleRef.current) {
          circleRef.current.style.strokeDasharray = `${pct * C} ${C}`;
        }
        setVisible(scrolled > 380);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Retour en haut"
          style={{
            position: "fixed", right: "1.1rem",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
            width: 50, height: 50,
            background: "rgba(255,255,255,0.97)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", zIndex: 140,
            boxShadow: "0 4px 24px rgba(0,0,0,0.14), 0 1px 6px rgba(0,0,0,0.08)",
            padding: 0,
          }}
          initial={{ opacity: 0, scale: 0.5, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 12 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.12, boxShadow: "0 8px 32px rgba(243,55,145,0.3)" }}
          whileTap={{ scale: 0.9 }}>
          <svg width="50" height="50" viewBox="0 0 50 50"
            style={{ position: "absolute", inset: 0 }}>
            <circle cx="25" cy="25" r={R} fill="none" stroke="#F0F0F0" strokeWidth="2.5" />
            <circle ref={circleRef}
              cx="25" cy="25" r={R} fill="none"
              stroke="url(#stt-grad)" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`0 ${C}`}
              transform="rotate(-90 25 25)" />
            <defs>
              <linearGradient id="stt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F33791" />
                <stop offset="100%" stopColor="#7C3AFF" />
              </linearGradient>
            </defs>
          </svg>
          <motion.span
            style={{ fontSize: "0.9rem", fontWeight: 900, color: "#F33791", lineHeight: 1, position: "relative", zIndex: 1, userSelect: "none" }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>↑</motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
