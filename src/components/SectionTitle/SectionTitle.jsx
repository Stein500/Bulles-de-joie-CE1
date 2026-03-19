/**
 * SectionTitle.jsx v19 — Titre de section éditorial
 * Props: label, title, description, align, accentColor, num, dark, style
 */
import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

export default function SectionTitle({ label, title, description, align="left", accentColor="#F33791", num, dark=false, style={} }) {
  const [ref, inView] = useInView({ threshold: 0.08 });
  const centered = align === "center";
  const EASE_OUT = [0.165, 0.84, 0.44, 1];
  const txtColor = dark ? "#fff" : "#0A0A0A";
  const subColor = dark ? "rgba(255,255,255,0.45)" : "#666";

  return (
    <div ref={ref} style={{ position: "relative", textAlign: centered ? "center" : "left", ...style }}>
      {/* Ghost section number */}
      {num && (
        <div style={{
          position: "absolute",
          top: centered ? "50%" : "0",
          left: centered ? "50%" : "-0.1em",
          transform: centered ? "translate(-50%,-50%)" : "none",
          fontFamily: "'Poppins'", fontWeight: 900,
          fontSize: "clamp(5rem,18vw,11rem)",
          lineHeight: 0.85, letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: dark ? "1px rgba(255,255,255,0.05)" : "1px rgba(0,0,0,0.055)",
          userSelect: "none", pointerEvents: "none",
          zIndex: 0,
        }}>{num}</div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Label */}
        {label && (
          <motion.div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: dark ? "rgba(255,255,255,0.4)" : "#888",
              marginBottom: "0.6rem",
              justifyContent: centered ? "center" : "flex-start",
            }}
            initial={{ opacity: 0, x: centered ? 0 : -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <motion.span
              style={{ display: "inline-block", height: "1.5px", background: accentColor, flexShrink: 0 }}
              initial={{ width: 0 }}
              animate={inView ? { width: 18 } : {}}
              transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
            />
            {label}
          </motion.div>
        )}

        {/* H2 */}
        {title && (
          <motion.h2
            style={{
              fontFamily: "'Poppins'", fontWeight: 900,
              fontSize: "clamp(1.85rem, 5vw, 3.5rem)",
              letterSpacing: "-0.045em", lineHeight: 1.04,
              color: txtColor, margin: 0,
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT }}
          >{title}</motion.h2>
        )}

        {/* Description */}
        {description && (
          <motion.p
            style={{
              fontFamily: "'Nunito'", fontSize: "clamp(0.9rem,2vw,1.05rem)",
              color: subColor, lineHeight: 1.75, marginTop: "0.7rem",
              maxWidth: centered ? 580 : 660,
              margin: centered ? "0.75rem auto 0" : "0.75rem 0 0",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.12, ease: EASE_OUT }}
          >{description}</motion.p>
        )}
      </div>
    </div>
  );
}
