import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as PageIA from "../../utils/ia";
import { SCHOOL } from "../../data/content";

// Map pathname → profil IA
const PAGE_IA = {
  "/":          PageIA.HOME,
  "/pedagogie": PageIA.PEDAGOGIE,
  "/tarifs":    PageIA.TARIFS,
  "/resultats": PageIA.RESULTATS,
  "/contact":   PageIA.CONTACT,
};

const LINKS = [
  { to: "/",          label: "Accueil",    emoji: "🌟" },
  { to: "/pedagogie", label: "Pédagogie",  emoji: "🦋" },
  { to: "/tarifs",    label: "Tarifs",     emoji: "🎓" },
  { to: "/resultats", label: "Résultats",  emoji: "🏆" },
  { to: "/contact",   label: "Contact",    emoji: "💌" },
];

/* ──────────────────────────────────────────────────────────────
   BottomNav v19 — Icônes flottantes
   
   DESIGN :
   • Entrée au montage : chaque icône slide up avec stagger (RAF)
   • Actif → icône monte (spring), fond pill glisse (layoutId)
   • Point lumineux sous l'icône active
   • Aucune animation en boucle
   ────────────────────────────────────────────────────────────── */
const BottomNav = memo(function BottomNav({ pathname, onNav }) {
  const activeProfile = PAGE_IA[pathname] ?? PageIA.HOME;
  // N'anime l'entrée QU'au premier montage — pas à chaque changement de route
  const mountedRef = useRef(false);
  useEffect(() => { mountedRef.current = true; }, []);

  return (
    <nav style={ns.bottomNav} aria-label="Navigation principale">
      {LINKS.map(({ to, label, emoji }, idx) => {
        const active = pathname === to;
        const ia = active ? activeProfile.pick(emoji, 0) : null;
        return (
          <motion.div
            key={to}
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
            initial={mountedRef.current ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: mountedRef.current ? 0 : 0.05 + idx * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <Link
              to={to}
              onClick={e => onNav(e, to)}
              style={{ ...ns.bItem, color: active ? "#F33791" : "#ACACAC" }}
              aria-current={active ? "page" : undefined}
            >
              {/* Fond pill glissant entre les items actifs */}
              {active && (
                <motion.div
                  layoutId="bnav-bg"
                  style={{
                    position: "absolute",
                    inset: "3px 2px 18px",
                    background: "rgba(243,55,145,0.09)",
                    borderRadius: 12,
                    zIndex: 0,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              {/* Icône — profil IA de la page active, sinon repos */}
              <motion.span
                style={{
                  fontSize: "1.45rem",
                  lineHeight: 1,
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                  filter: active
                    ? "drop-shadow(0 2px 8px rgba(243,55,145,0.45))"
                    : "none",
                  transition: "filter 0.25s ease",
                  transformOrigin: "center",
                }}
                animate={active && ia ? ia.animate : { y: 0, scale: 1, rotate: 0 }}
                transition={active && ia ? ia.transition : { type: "spring", stiffness: 460, damping: 26 }}
              >
                {emoji}
              </motion.span>

              {/* Label */}
              <span
                style={{
                  fontSize: "0.54rem",
                  fontFamily: "'Poppins'",
                  fontWeight: active ? 700 : 500,
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  marginTop: 3,
                  position: "relative",
                  zIndex: 1,
                  opacity: active ? 1 : 0.5,
                  transition: "opacity 0.22s ease, font-weight 0.22s ease",
                }}
              >
                {label}
              </span>

              {/* Point lumineux sous l'icône active */}
              {active && (
                <motion.div
                  layoutId="bnav-dot"
                  style={{
                    position: "absolute",
                    bottom: 5,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#F33791",
                    boxShadow: "0 0 8px rgba(243,55,145,0.8)",
                    zIndex: 1,
                  }}
                  transition={{ type: "spring", stiffness: 460, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
});

/* ──────────────────────────────────────────────────────────────
   Nav principal
   PERF : scroll progress via ref + direct DOM → 0 re-render React
          header scrolled via ref + class toggle → 0 re-render React
   ────────────────────────────────────────────────────────────── */
export default function Nav() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 960);

  /* DOM refs pour scroll progress — aucun setState */
  const progressRef = useRef(null);
  const headerRef   = useRef(null);

  /* ── Resize ── */
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 960);
    const ro = new ResizeObserver(check);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  /* ── Scroll : DOM direct uniquement ── */
  useEffect(() => {
    const bar    = progressRef.current;
    const header = headerRef.current;
    if (!bar || !header) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        if (y > 30) {
          header.style.background    = "rgba(255,255,255,0.97)";
          header.style.borderColor   = "#F0E8F5";
          header.style.boxShadow     = "0 2px 28px rgba(243,55,145,0.08)";
        } else {
          header.style.background    = "rgba(255,255,255,0.88)";
          header.style.borderColor   = "transparent";
          header.style.boxShadow     = "none";
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = useCallback((e, to) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(to);
  }, [navigate]);

  return (
    <>
      {/* Barre de progression scroll */}
      <div ref={progressRef} id="scroll-progress"
        style={{ transformOrigin: "left", transform: "scaleX(0)" }} />

      {/* Header */}
      <header ref={headerRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1.5px solid transparent",
        transition: "background 0.35s, border-color 0.35s, box-shadow 0.35s",
        boxShadow: "none", overflow: "hidden",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 var(--side-pad)",
          height: 72, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "1rem",
        }}>
          {/* Logo */}
          <Link to="/" onClick={e => handleNavClick(e, "/")}
            style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
            <motion.div style={ns.logoWrap}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}>
              <motion.div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(243,55,145,0.12)", pointerEvents: "none",
              }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.img src="/images/logo-minimal.png" alt="Logo"
                style={{ width: 30, height: 30, objectFit: "contain", position: "relative", zIndex: 1,
                  filter: "drop-shadow(0 3px 8px rgba(243,55,145,0.35))" }}
                animate={{ y: [0, -2.5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div style={ns.logoText}>
              <div style={ns.logoName}>École Les Bulles de Joie</div>
              <div style={ns.logoSub}>Parakou · Bénin 🇧🇯</div>
            </div>
          </Link>

          {/* Desktop links */}
          {isDesktop && (
            <nav style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}>
              {LINKS.map(({ to, label, emoji }) => {
                const active = pathname === to;
                return (
                  <Link key={to} to={to} onClick={e => handleNavClick(e, to)} style={{
                    ...ns.link, color: active ? "#F33791" : "#555",
                    fontWeight: active ? 700 : 500,
                    display: "flex", alignItems: "center", gap: "0.3rem",
                  }}>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        display: "inline-block",
                        lineHeight: 1,
                        transform: active ? "scale(1.12)" : "scale(1)",
                        transition: "transform 0.22s ease",
                      }}
                    >{emoji}</span>
                    <motion.span style={{ display: "block", position: "relative" }}
                      whileHover={{ color: "#F33791" }} transition={{ duration: 0.18 }}>
                      {label}
                      <motion.span style={{
                        position: "absolute", bottom: -2, left: 0, right: 0,
                        height: 2, background: "#F33791", borderRadius: 1,
                        transformOrigin: "left",
                      }}
                        initial={{ scaleX: active ? 1 : 0 }}
                        animate={{ scaleX: active ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.24, ease: [0.165, 0.84, 0.44, 1] }}
                      />
                    </motion.span>
                    {active && (
                      <motion.span layoutId="nav-dot" style={ns.activeDot}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop CTA */}
          {isDesktop && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Link to="/tarifs" onClick={e => handleNavClick(e, "/tarifs")}
                style={ns.cta} className="btn-shimmer pulse-pink">
                ✨ Inscrire mon enfant
              </Link>
            </motion.div>
          )}

          {/* Hamburger */}
          {!isDesktop && (
            <motion.button onClick={() => setMenuOpen(!menuOpen)}
              style={ns.burger} aria-label="Menu" whileTap={{ scale: 0.88 }}>
              <motion.span style={ns.burgerLine} animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} />
              <motion.span style={ns.burgerLine} animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }} />
              <motion.span style={ns.burgerLine} animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} />
            </motion.button>
          )}
        </div>
      </header>

      {/* Mobile menu fullscreen */}
      <AnimatePresence>
        {menuOpen && !isDesktop && (
          <motion.div style={ns.mobileMenu}
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}>
            <div style={ns.menuDot1} />
            <div style={ns.menuDot2} />
            <div style={ns.menuLinks}>
              {LINKS.map(({ to, label, emoji }, i) => {
                const active = pathname === to;
                return (
                  <motion.div key={to}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.07, duration: 0.38, ease: [0.165, 0.84, 0.44, 1] }}>
                    <Link to={to} onClick={e => handleNavClick(e, to)}
                      style={{ ...ns.menuLink, color: active ? "#F33791" : "#0A0A0A" }}>
                      <motion.span
                        style={{ fontSize: "1.5rem", flexShrink: 0, display: "inline-block", transformOrigin: "center" }}
                        initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.18 + i * 0.07, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        whileHover={{ scale: 1.22, rotate: 12, transition: { type: "spring", stiffness: 500, damping: 18 } }}
                      >
                        {emoji}
                      </motion.span>
                      <span style={{ flex: 1 }}>{label}</span>
                      {active && <span style={ns.menuActiveLine} />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <motion.div style={{ padding: "0 2rem 3rem" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}>
              <Link to="/tarifs" onClick={e => handleNavClick(e, "/tarifs")} style={ns.menuCta}>
                ✨ Inscrire mon enfant
              </Link>
              <a href={`https://wa.me/${SCHOOL.whatsappRaw}?text=Bonjour, je souhaite un renseignement`} target="_blank" rel="noreferrer" style={ns.menuWa}>
                💬 Écrire sur WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isDesktop && <BottomNav pathname={pathname} onNav={handleNavClick} />}
    </>
  );
}

const ns = {
  logoWrap: {
    position: "relative", width: 46, height: 46, borderRadius: "50%",
    background: "linear-gradient(135deg, #fff4fa 0%, #ffffff 100%)",
    border: "2px solid rgba(243,55,145,0.22)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(243,55,145,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
    overflow: "hidden", flexShrink: 0,
  },
  logoText: { lineHeight: 1.2, minWidth: 0 },
  logoName: {
    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
    fontSize: "0.82rem", letterSpacing: "-0.01em", color: "#F33791", whiteSpace: "nowrap",
  },
  logoSub: {
    fontSize: "0.56rem", color: "#ACACAC", fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase",
    fontFamily: "'Nunito'", whiteSpace: "nowrap",
  },
  link: {
    fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem",
    padding: "0.4rem 0.9rem", position: "relative",
    transition: "color 0.2s", letterSpacing: "0.01em", display: "block",
  },
  activeDot: {
    position: "absolute", bottom: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "5px", height: "5px",
    background: "#F33791", borderRadius: "50%", display: "block",
  },
  cta: {
    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.76rem",
    letterSpacing: "0.03em", padding: "0.65rem 1.4rem",
    background: "#F33791", color: "#fff", border: "none",
    borderRadius: "100px", display: "inline-block",
    transition: "all 0.2s", whiteSpace: "nowrap",
    boxShadow: "0 4px 18px rgba(243,55,145,0.35)",
  },
  burger: { display: "flex", flexDirection: "column", gap: 5, padding: "8px", background: "transparent", cursor: "pointer" },
  burgerLine: { display: "block", width: 22, height: 2, background: "#0A0A0A", transformOrigin: "center" },
  mobileMenu: {
    position: "fixed", top: 72, left: 0, right: 0, bottom: 0,
    background: "#FFFFFF", zIndex: 199,
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  menuDot1: { position: "absolute", top: 20, right: 20, width: 140, height: 140, borderRadius: "50%", background: "rgba(243,55,145,0.06)", pointerEvents: "none" },
  menuDot2: { position: "absolute", bottom: 100, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(200,255,0,0.1)", pointerEvents: "none" },
  menuLinks: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 2rem", gap: "0.1rem" },
  menuLink: {
    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
    fontSize: "clamp(1.55rem, 5.5vw, 2.1rem)", letterSpacing: "-0.025em",
    display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "0.75rem 0", borderBottom: "1px solid #F5F5F5",
    position: "relative", transition: "color 0.2s",
  },
  menuActiveLine: { display: "inline-block", width: 10, height: 10, background: "#F33791", borderRadius: "50%", boxShadow: "0 0 8px rgba(243,55,145,0.6)" },
  menuCta: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", padding: "1rem", background: "#F33791", color: "#fff",
    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem",
    letterSpacing: "0.03em", textTransform: "uppercase",
    marginBottom: "0.65rem", borderRadius: "8px",
    boxShadow: "0 6px 24px rgba(243,55,145,0.35)",
  },
  menuWa: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", padding: "0.9rem",
    background: "transparent", color: "#0A0A0A",
    border: "2px solid #E8E8E8", borderRadius: "8px",
    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.84rem",
    letterSpacing: "0.03em", textTransform: "uppercase",
  },
  bottomNav: {
    position: "fixed", bottom: 0, left: 0, right: 0, height: 64,
    background: "rgba(255,255,255,0.97)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(243,55,145,0.12)",
    display: "flex", justifyContent: "space-around", alignItems: "center",
    zIndex: 150, paddingBottom: "env(safe-area-inset-bottom)",
    boxShadow: "0 -4px 20px rgba(243,55,145,0.06)",
  },
  bItem: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 0, padding: "0.25rem 0.45rem", position: "relative",
    width: "100%", minHeight: 56,
    transition: "color 0.18s ease", userSelect: "none",
  },
};
