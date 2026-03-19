/**
 * Footer.jsx — v31 Dark Editorial
 * ✓ SCHOOL.whatsappRaw utilisé partout (0 hardcoded)
 * ✓ SOCIALS inutilisé supprimé
 * ✓ footer-grid className appliqué
 * ✓ liens hover color améliorés
 * ✓ responsive 4 colonnes desktop / 2 mobile
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SCHOOL } from "../../data/content";
import { useInView } from "../../hooks/useInView";

const NAV_LINKS = [
  { label: "Accueil",    to: "/" },
  { label: "Pédagogie", to: "/pedagogie" },
  { label: "Tarifs",    to: "/tarifs" },
  { label: "Résultats", to: "/resultats" },
  { label: "Contact",   to: "/contact" },
];

const CYCLES_LIST = [
  { label: "🍼 Crèche · dès 2 mois",  color: "#F33791", to: "/tarifs" },
  { label: "🎨 Maternelle · 3–5 ans",  color: "#C8FF00", to: "/tarifs" },
  { label: "🎓 Primaire · 6 ans+",      color: "#7C3AFF", to: "/tarifs" },
];

function FReveal({ children, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.05 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.165, 0.84, 0.44, 1] }}>
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const waHref = `https://wa.me/${SCHOOL.whatsappRaw}`;

  return (
    <footer style={{ background: "#080808", position: "relative", overflow: "hidden" }}>

      {/* Ambient line top */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70vw", height: 1, background: "linear-gradient(90deg,transparent,#F33791,#C8FF00,transparent)", opacity: 0.45 }} />
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "50vw", height: 60, background: "radial-gradient(ellipse,rgba(243,55,145,0.07) 0%,transparent 75%)", pointerEvents: "none" }} />

      {/* ══ CTA BAND ══ */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem var(--side-pad)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <FReveal>
            <div style={{ fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "0.45rem" }}>
              Inscriptions 2026-2027 · Places limitées
            </div>
            <h2 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "clamp(1.3rem,3.2vw,1.9rem)", letterSpacing: "-0.025em", color: "#fff", lineHeight: 1.15, margin: 0 }}>
              Rejoignez la famille{" "}
              <motion.span style={{ color: "#C8FF00", display: "inline-block" }}
                animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                Les Bulles de Joie ✨
              </motion.span>
            </h2>
          </FReveal>
          <FReveal delay={0.12}>
            <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/tarifs" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.8rem 1.6rem", background: "#C8FF00", color: "#0A0A0A", fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.76rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", boxShadow: "0 0 20px rgba(200,255,0,0.25)", whiteSpace: "nowrap", textDecoration: "none" }}>
                  📋 Voir les tarifs
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <a href={waHref} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.8rem 1.5rem", background: "transparent", color: "rgba(255,255,255,0.75)", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.76rem", letterSpacing: "0.04em", textTransform: "uppercase", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "100px", whiteSpace: "nowrap", textDecoration: "none" }}>
                  💬 WhatsApp
                </a>
              </motion.div>
            </div>
          </FReveal>
        </div>
      </div>

      {/* ══ MAIN GRID ══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3.5rem var(--side-pad) 2.5rem" }}>
        <div className="footer-grid" style={{ display: "grid", gap: "2.5rem" }}>

          {/* ── Brand ── */}
          <FReveal>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.1rem", textDecoration: "none" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", border: "2px solid rgba(243,55,145,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 6px rgba(255,255,255,0.06),0 0 24px rgba(243,55,145,0.18),0 4px 16px rgba(0,0,0,0.35)", flexShrink: 0 }}>
                <motion.img src="/images/logo-minimal.png" alt="Logo"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                  animate={{ rotate: [0, 8, -5, 0] }}
                  transition={{ duration: 7, repeat: Infinity }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.9rem", color: "#fff", lineHeight: 1.2 }}>École Les Bulles de Joie</div>
                <div style={{ fontFamily: "'Nunito'", fontSize: "0.56rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Zongo 2, ANPE · Parakou · Bénin 🇧🇯</div>
              </div>
            </Link>

            <p style={{ fontFamily: "'Nunito'", fontSize: "0.84rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.82, maxWidth: 340, marginBottom: "1.35rem" }}>
              Crèche, Maternelle &amp; Primaire bilingue d'excellence.<br />
              Fondée sur l'<span style={{ color: "rgba(255,255,255,0.65)" }}>Amour</span>, le <span style={{ color: "rgba(255,255,255,0.65)" }}>Travail</span>, la <span style={{ color: "rgba(255,255,255,0.65)" }}>Rigueur</span> et la <span style={{ color: "rgba(255,255,255,0.65)" }}>Créativité</span>.
            </p>

            {/* Réseaux sociaux */}
            <div style={{ display: "flex", gap: "0.45rem", marginBottom: "1.35rem" }}>
              {[
                { icon: "📘", label: "Facebook",  url: SCHOOL.facebook,  color: "#1877F2" },
                { icon: "📷", label: "Instagram", url: SCHOOL.instagram, color: "#E4405F" },
                { icon: "🎵", label: "TikTok",    url: SCHOOL.tiktok,    color: "#fff"    },
              ].map(({ icon, label, url, color }) => (
                <motion.a key={label} href={url || "#"} target="_blank" rel="noreferrer" aria-label={label}
                  style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", fontSize: "1rem", borderRadius: 10, background: "rgba(255,255,255,0.04)", textDecoration: "none" }}
                  whileHover={{ borderColor: color, background: `${color}18`, y: -3 }}
                  whileTap={{ scale: 0.9 }}>
                  {icon}
                </motion.a>
              ))}
            </div>

            {/* Agréments */}
            <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.3rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "0.8rem 1rem" }}>
              <div style={{ fontFamily: "'Poppins'", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C8FF00", marginBottom: "0.2rem" }}>✅ Agréments officiels</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: "0.7rem", color: "rgba(255,255,255,0.28)", lineHeight: 1.85 }}>
                2021 : {SCHOOL.agrement2021}<br />
                2022 : {SCHOOL.agrement2022}
              </div>
            </div>
          </FReveal>

          {/* ── Navigation ── */}
          <FReveal delay={0.06}>
            <div style={{ fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.9rem", paddingBottom: "0.55rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Navigation
            </div>
            <nav style={{ display: "grid", gap: "0.1rem" }}>
              {NAV_LINKS.map(({ label, to }) => (
                <motion.div key={label} whileHover={{ x: 5 }} transition={{ duration: 0.18 }}>
                  <Link to={to} style={{ fontFamily: "'Nunito'", fontSize: "0.87rem", color: "rgba(255,255,255,0.42)", display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.3rem 0", transition: "color 0.2s", textDecoration: "none" }}>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(243,55,145,0.55)", flexShrink: 0 }} />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </FReveal>

          {/* ── Cycles ── */}
          <FReveal delay={0.1}>
            <div style={{ fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.9rem", paddingBottom: "0.55rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Nos Cycles
            </div>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {CYCLES_LIST.map(({ label, color, to }) => (
                <motion.div key={label} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
                  <Link to={to} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "'Nunito'", fontSize: "0.85rem", color: "rgba(255,255,255,0.42)", textDecoration: "none", padding: "0.15rem 0" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}` }} />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </FReveal>

          {/* ── Contact ── */}
          <FReveal delay={0.14}>
            <div style={{ fontFamily: "'Poppins'", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.9rem", paddingBottom: "0.55rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Contact
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {[
                { icon: "📞", label: SCHOOL.phone,                       href: `tel:${SCHOOL.phoneRaw}` },
                { icon: "💬", label: "WhatsApp rapide",                   href: waHref },
                { icon: "✉️", label: SCHOOL.email,                       href: `mailto:${SCHOOL.email}` },
                { icon: "📍", label: "Zongo 2, ANPE · Parakou, Bénin",   href: SCHOOL.mapsUrl },
              ].map(({ icon, label, href }) => (
                <motion.div key={label} whileHover={{ x: 4 }}>
                  <a href={href} target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", fontFamily: "'Nunito'", fontSize: "0.83rem", color: "rgba(255,255,255,0.4)", padding: "0.18rem 0", lineHeight: 1.45, textDecoration: "none", transition: "color 0.18s" }}>
                    <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <span>{label}</span>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Portail */}
            <motion.a href={SCHOOL.portalUrl} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginTop: "1.2rem", padding: "0.6rem 1.1rem", background: "rgba(200,255,0,0.08)", border: "1px solid rgba(200,255,0,0.25)", borderRadius: 8, fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.7rem", color: "#C8FF00", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
              whileHover={{ background: "rgba(200,255,0,0.14)", borderColor: "rgba(200,255,0,0.45)", y: -1 }}>
              🌐 Portail Parents →
            </motion.a>
          </FReveal>
        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", maxWidth: 1200, margin: "0 auto", padding: "1.25rem var(--side-pad)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.7rem" }}>
        <span style={{ fontFamily: "'Nunito'", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
          © 2017–{year} École Les Bulles de Joie · Tous droits réservés.
        </span>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {["École Bilingue", "Parakou", "Bénin 🇧🇯"].map((t) => (
            <span key={t} style={{ fontFamily: "'Poppins'", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", padding: "0.18rem 0.6rem", color: "rgba(255,255,255,0.22)", borderRadius: 4 }}>{t}</span>
          ))}
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8FF00", boxShadow: "0 0 6px rgba(200,255,0,0.7)", marginLeft: 4 }} />
        </div>
      </div>
    </footer>
  );
}
