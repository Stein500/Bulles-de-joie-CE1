/**
 * PageHero.jsx — Hero unifié pour toutes les sous-pages
 * ──────────────────────────────────────────────────────
 * Props :
 *   image        {string}  — chemin image de fond
 *   eyebrow      {string}  — petite étiquette au-dessus du titre
 *   title        {node}    — titre principal (JSX accepté)
 *   description  {string}  — description sous le titre
 *   accentColor  {string}  — couleur accent (défaut #F33791)
 *   align        {string}  — "left" | "center" (défaut "left")
 *   minHeight    {string}  — hauteur min (défaut "52vh")
 *   badge        {node}    — badge optionnel à droite du eyebrow
 */

import { motion } from "framer-motion";
import { EASE } from "../../utils/anim";

export default function PageHero({
  image,
  eyebrow,
  title,
  description,
  accentColor = "#F33791",
  align       = "left",
  minHeight   = "52vh",
  badge,
}) {
  const centered = align === "center";

  return (
    <section style={{
      minHeight,
      position: "relative",
      display: "flex",
      alignItems: "flex-end",
      paddingTop: "var(--nav-h)",
      overflow: "hidden",
    }}>
      {/* Photo de fond */}
      {image && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }} />
      )}

      {/* Overlay sombre — laisse la photo visible */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(165deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.88) 100%)",
      }} />
      {/* Dégradé accent en bas */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", zIndex: 1,
        background: `linear-gradient(to top, ${accentColor}2A 0%, transparent 100%)`,
      }} />

      {/* Barre verticale accent à gauche */}
      <motion.div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 4, background: accentColor, zIndex: 3,
          transformOrigin: "top",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.15, 0.85, 0.4, 1] }}
      />

      {/* Contenu */}
      <div className="container" style={{
        position: "relative", zIndex: 2,
        paddingBottom: "3.5rem",
        paddingTop: "2rem",
        textAlign: centered ? "center" : "left",
      }}>

        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            style={{
              display: "inline-flex", alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'Poppins'", fontSize: "0.58rem",
              fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "0.9rem",
              justifyContent: centered ? "center" : "flex-start",
            }}
            initial={{ opacity: 0, x: centered ? 0 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.48, ease: EASE.out }}
          >
            <motion.span
              style={{ display: "inline-block", height: 2, background: accentColor, flexShrink: 0 }}
              initial={{ width: 0 }}
              animate={{ width: 20 }}
              transition={{ delay: 0.35, duration: 0.45, ease: EASE.out }}
            />
            {eyebrow}
            {badge && <span style={{ marginLeft: "0.4rem" }}>{badge}</span>}
          </motion.div>
        )}

        {/* Titre H1 */}
        <motion.h1
          style={{
            fontFamily: "'Poppins'",
            fontWeight: 800,
            fontSize: "clamp(2.6rem, 9.5vw, 6rem)",
            letterSpacing: "-0.045em",
            lineHeight: 1.0,
            marginBottom: "1rem",
            color: "#fff",
            textShadow: "0 4px 28px rgba(0,0,0,0.35)",
          }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: EASE.out }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            style={{
              fontFamily: "'Nunito'",
              fontSize: "clamp(0.92rem, 2.2vw, 1.08rem)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 500,
              lineHeight: 1.72,
              margin: centered ? "0 auto" : 0,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5, ease: EASE.out }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
