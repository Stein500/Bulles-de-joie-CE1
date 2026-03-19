/**
 * App.jsx v19 — MAINTENANCE_MODE intégré
 * ──────────────────────────────────────────────────────────
 * ┌──────────────────────────────────────────────────────┐
 * │  🔧  Pour activer la maintenance :                   │
 * │      MAINTENANCE_MODE = true  → page maintenance     │
 * │      MAINTENANCE_MODE = false → site normal           │
 * └──────────────────────────────────────────────────────┘
 * PERF :
 *  • Splash : 1.55s (était 6.2s)
 *  • Transition page : fade 280ms (était rideau 980ms)
 *  • Plus de PageTransitionCurtain — supprimé
 *  • PageLoader brandé conservé (Suspense)
 */

import {
  useEffect, useState, lazy, Suspense,
  useCallback, useRef, memo,
} from "react";
import {
  BrowserRouter as Router,
  Routes, Route, useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Nav          from "./components/Nav/Nav";
import Footer       from "./components/Footer/Footer";
import Splash       from "./components/Splash/Splash";
import Cursor       from "./components/Cursor/Cursor";
import ClickFX      from "./components/ClickFX/ClickFX";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";
import LazyImages   from "./components/LazyImages/LazyImages";
import ScrollToTop  from "./components/ScrollToTop/ScrollToTop";
import WhatsAppFAB  from "./components/WhatsAppFAB/WhatsAppFAB";
import Maintenance  from "./pages/Maintenance/Maintenance";

/* ══════════════════════════════════════════════════════════
   🔧 FLAG MAINTENANCE — changer ici pour activer/désactiver
══════════════════════════════════════════════════════════ */
const MAINTENANCE_MODE = true; // ← true = maintenance | false = site normal

/* ══ Lazy pages ══ */
const Home      = lazy(() => import("./pages/Home/Home"));
const Pedagogie = lazy(() => import("./pages/Pedagogie/Pedagogie"));
const Tarifs    = lazy(() => import("./pages/Tarifs/Tarifs"));
const Resultats = lazy(() => import("./pages/Resultats/Resultats"));
const Contact   = lazy(() => import("./pages/Contact/Contact"));

/* ══ Prefetch map ══ */
const PREFETCH = {
  "/":          () => import("./pages/Home/Home"),
  "/pedagogie": () => import("./pages/Pedagogie/Pedagogie"),
  "/tarifs":    () => import("./pages/Tarifs/Tarifs"),
  "/resultats": () => import("./pages/Resultats/Resultats"),
  "/contact":   () => import("./pages/Contact/Contact"),
};
export const prefetchPage = (path) => PREFETCH[path]?.();

/* ══════════════════════════════════════════════════════════════
   PageLoader — pendant le Suspense (lazy chunk)
   ══════════════════════════════════════════════════════════════ */
const PageLoader = memo(() => (
  <div style={{
    position: "fixed", inset: 0, background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9500,
  }}>
    <div style={{ position: "relative", width: 72, height: 72 }}>
      <motion.div
        style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          border: "2.5px solid transparent",
          borderTopColor: "#F33791",
          borderRightColor: "rgba(243,55,145,0.2)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      />
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "linear-gradient(135deg,#fff4fa,#fff)",
        border: "2px solid rgba(243,55,145,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <motion.img
          src="/images/logo-minimal.png"
          alt=""
          style={{ width: 40, height: 40, objectFit: "contain" }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </div>
    </div>
    {/* Barre infinie bas */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#F5F5F5", overflow: "hidden" }}>
      <motion.div
        style={{ height: "100%", background: "#F33791", width: "35%" }}
        animate={{ x: ["-35%", "186%"] }}
        transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </div>
));

/* ══════════════════════════════════════════════════════════════
   RIDEAU CINÉMATIQUE — 550ms, élégant
   ① Montée rapide  0–38%
   ② Tenu           38–58%
   ③ Descente       58–100%
   ══════════════════════════════════════════════════════════════ */
function PageTransitionCurtain() {
  const { pathname } = useLocation();
  const prevPath     = useRef(null);
  const [key, setKey]       = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prevPath.current === null) { prevPath.current = pathname; return; }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setKey(k => k + 1);
    setActive(true);
    const t = setTimeout(() => setActive(false), 580);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={key}
          style={{ position: "fixed", inset: 0, zIndex: 8800, pointerEvents: "none", overflow: "hidden" }}
          initial={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.05, delay: 0.57 }}
        >
          <motion.div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(150deg, #F33791 0%, #c8006a 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}
            initial={{ y: "102%" }}
            animate={{ y: ["102%", "0%", "0%", "-102%"] }}
            transition={{ duration: 0.55, times: [0, 0.18, 0.58, 1], ease: [0.76, 0, 0.18, 1] }}
          >
            <div style={{
              position: "absolute", width: "50vw", height: "50vw",
              maxWidth: 340, maxHeight: 340, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)", filter: "blur(38px)",
            }} />
            <motion.div
              style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.82, 1.04, 1, 0.92] }}
              transition={{ duration: 0.55, times: [0, 0.28, 0.64, 1] }}
            >
              <img src="/images/logo-minimal.png" alt="" style={{ width: 50, height: 50, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.95 }} />
              <span style={{ fontFamily: "'Poppins'", fontSize: "0.45rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                Les Bulles de Joie
              </span>
            </motion.div>
            {[0, 1].map(pos => (
              <motion.div key={pos} style={{
                position: "absolute", [pos ? "bottom" : "top"]: 0,
                left: 0, right: 0, height: 2.5,
                background: "rgba(200,255,0,0.65)",
                transformOrigin: pos ? "right" : "left",
              }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{ duration: 0.55, times: [0, 0.28, 0.68, 1] }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   Transitions de page — fade rapide + léger glissement
   Exit  : 80ms  — sortie quasi-instantanée
   Enter : 280ms — entrée fluide
   ══════════════════════════════════════════════════════════════ */
const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  enter: {
    opacity: 1, y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0, y: -5,
    transition: { duration: 0.08, ease: "easeIn" },
  },
};

/* ── Reset scroll immédiat au changement de route ── */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__smoothScrollCancel) window.__smoothScrollCancel();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollReset />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
        >
        <Routes location={location}>
          <Route path="/"          element={<Home />} />
          <Route path="/pedagogie" element={<Pedagogie />} />
          <Route path="/tarifs"    element={<Tarifs />} />
          <Route path="/resultats" element={<Resultats />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="*"          element={<Home />} />
        </Routes>
        <Footer />
      </motion.div>
    </AnimatePresence>
    </>
  );
}

/* ══ Préchargement hover/touch ══ */
const PrefetchHandler = memo(() => {
  useEffect(() => {
    const handle = (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (href?.startsWith("/")) prefetchPage(href);
    };
    document.addEventListener("mouseover",  handle, { passive: true });
    document.addEventListener("touchstart", handle, { passive: true });
    return () => {
      document.removeEventListener("mouseover",  handle);
      document.removeEventListener("touchstart", handle);
    };
  }, []);
  return null;
});

/* ══ AppContent ══ */
const AppContent = memo(() => (
  <>
    <Cursor />
    <ClickFX />
    <SmoothScroll />
    <LazyImages />
    <PrefetchHandler />
    <PageTransitionCurtain />
    <Nav />
    <Suspense fallback={<PageLoader />}>
      <AnimatedRoutes />
    </Suspense>
    <ScrollToTop />
    <WhatsAppFAB />
  </>
));

/* ══ Racine ══ */
export default function App() {
  /* Splash toujours affiché au montage de l'app (1er chargement / F5)
     React state → se remet à true à chaque rechargement de page,
     mais reste false après navigation SPA (App ne se remonte pas) */
  const [showSplash]  = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
  }, []);

  useEffect(() => {
    // En mode maintenance, ne jamais bloquer le scroll du body
    if (MAINTENANCE_MODE) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }
    document.body.style.overflow = (showSplash && !splashDone) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showSplash, splashDone]);

  /* ── Mode maintenance ── */
  if (MAINTENANCE_MODE) {
    return <Maintenance />;
  }

  return (
    <Router>
      <AnimatePresence>
        {showSplash && !splashDone && (
          <Splash key="splash" onDone={handleSplashDone} />
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden={showSplash && !splashDone}
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ minHeight: "100svh" }}
      >
        <AppContent />
      </motion.div>
    </Router>
  );
}
