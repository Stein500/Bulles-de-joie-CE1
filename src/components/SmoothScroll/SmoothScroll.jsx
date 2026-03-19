import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   SMOOTHSCROLL ENGINE v2
   ▸ RAF 60fps avec easing exponentiel (like iOS)
   ▸ Momentum naturel sur mobile via touch delta
   ▸ Se désactive si l'utilisateur préfère réduire les animations
   ▸ Lien href="#anchor" → scroll précis avec offset nav
   ═══════════════════════════════════════════════════════ */

const NAV_HEIGHT = 72; // px — doit correspondre à --nav-h

/* Easing : exponentiel → décélération naturelle façon iOS */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ── Scroll animé vers une position cible ── */
let currentRAF = null;

function cancelSmoothScroll() {
  if (currentRAF) { cancelAnimationFrame(currentRAF); currentRAF = null; }
}

function smoothScrollTo(targetY, duration = 680) {
  const startY = window.scrollY;
  const diff   = targetY - startY;

  if (Math.abs(diff) < 2) return;
  if (currentRAF) cancelAnimationFrame(currentRAF);

  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);

    window.scrollTo({ top: startY + diff * eased, behavior: "instant" });

    if (progress < 1) {
      currentRAF = requestAnimationFrame(step);
    } else {
      currentRAF = null;
    }
  }

  currentRAF = requestAnimationFrame(step);
}

/* ── Intercepte tous les href="#anchor" ── */
function interceptAnchorLinks() {
  const onClick = (e) => {
    const link = e.target.closest("a[href^='#']");
    if (!link) return;
    const id     = link.getAttribute("href");
    if (id === "#") { e.preventDefault(); smoothScrollTo(0); return; }
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;
    smoothScrollTo(Math.max(0, top));
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

/* ── Wheel override (desktop) — momentum discret ── */
function initWheelSmooth() {
  if (window.innerWidth < 960) return () => {};

  let target = window.scrollY;
  let rafId  = null;
  let lastWheelTime = 0;

  const onWheel = (e) => {
    // Laisse le comportement natif sur les éléments scrollables
    const el = e.target;
    if (el.closest("[data-scroll-native], select, textarea, [class*='modal']")) return;

    e.preventDefault();
    const now = performance.now();
    const dt  = now - lastWheelTime;
    lastWheelTime = now;

    // Momentum discret : delta amplifié avec cap
    const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 1.4, 280);
    target = Math.max(0, Math.min(
      document.documentElement.scrollHeight - window.innerHeight,
      target + delta
    ));

    if (rafId) cancelAnimationFrame(rafId);

    function step() {
      const cur  = window.scrollY;
      const diff = target - cur;
      if (Math.abs(diff) < 0.5) { window.scrollTo({ top: target, behavior: "instant" }); rafId = null; return; }
      // Lerp fluide : 10% de la distance restante par frame
      window.scrollTo({ top: cur + diff * 0.115, behavior: "instant" });
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  };

  // Sync target quand l'utilisateur scroll autrement (touch, clavier…)
  const onScroll = () => {
    if (!rafId) target = window.scrollY;
  };

  document.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    document.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

/* ── Composant React ── */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanAnchor = interceptAnchorLinks();
    const cleanWheel  = initWheelSmooth();

    // Expose pour usage externe si besoin
    window.__smoothScrollTo     = smoothScrollTo;
    window.__smoothScrollCancel = cancelSmoothScroll;

    return () => {
      cleanAnchor();
      cleanWheel();
      delete window.__smoothScrollTo;
      delete window.__smoothScrollCancel;
    };
  }, []);

  return null;
}

/* Export utilitaire */
export { smoothScrollTo };
