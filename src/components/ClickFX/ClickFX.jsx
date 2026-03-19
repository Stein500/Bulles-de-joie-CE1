import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   CLICKFX — Système de particules burst au clic
   ▸ Ink ripple sur tous les clics
   ▸ Particules emoji sur les boutons CTA
   ▸ Vibration haptique mobile (si supportée)
   ▸ Tout en DOM natif — zéro React re-render
   ═══════════════════════════════════════════════════════ */

/* ── Config par type d'élément ── */
const PRESETS = {
  pink: {
    count: 10,
    colors: ["#F33791", "#ff6ab0", "#FF99CC", "#C8FF00", "#fff"],
    emojis: ["✨", "💫", "⭐", "🌸", "💕"],
    size: [5, 12],
    spread: 80,
    duration: 650,
    vibrate: 12,
  },
  outline: {
    count: 8,
    colors: ["#0A0A0A", "#333", "#F33791", "#555"],
    emojis: ["📖", "→", "✦", "◆"],
    size: [4, 9],
    spread: 60,
    duration: 550,
    vibrate: 8,
  },
  nav: {
    count: 6,
    colors: ["#F33791", "#C8FF00", "#0A0A0A"],
    emojis: ["·", "◦", "∙"],
    size: [3, 7],
    spread: 40,
    duration: 450,
    vibrate: 5,
  },
  whatsapp: {
    count: 8,
    colors: ["#25D366", "#128C7E", "#DCF8C6", "#fff"],
    emojis: ["💬", "✓", "✓"],
    size: [4, 10],
    spread: 65,
    duration: 600,
    vibrate: 10,
  },
  default: {
    count: 5,
    colors: ["#F33791", "#C8FF00", "#E8E8E8"],
    emojis: [],
    size: [3, 7],
    spread: 35,
    duration: 400,
    vibrate: 4,
  },
};

/* ── Détecte le preset selon l'élément cliqué ── */
function getPreset(el) {
  const target = el.closest("a, button, [data-clickfx]") || el;
  const href   = target.href || "";
  const text   = (target.textContent || "").toLowerCase();
  const bg     = getComputedStyle(target).backgroundColor;
  const style  = target.getAttribute("style") || "";

  if (href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp")) return "whatsapp";
  if (style.includes("#F33791") || bg.includes("243, 55, 145") || text.includes("inscrire") || text.includes("inscription")) return "pink";
  if (text.includes("pédagogie") || text.includes("voir") || text.includes("découvrir") || text.includes("→")) return "outline";
  if (target.closest(".bottom-nav__item, [data-nav]")) return "nav";
  return "default";
}

/* ── Crée une particule DOM ── */
function spawnParticle(x, y, preset) {
  const cfg  = PRESETS[preset] || PRESETS.default;
  const useEmoji = cfg.emojis.length > 0 && Math.random() < 0.4;
  const el   = document.createElement("div");

  const angle  = Math.random() * Math.PI * 2;
  const dist   = (0.4 + Math.random() * 0.6) * cfg.spread;
  const dx     = Math.cos(angle) * dist;
  const dy     = Math.sin(angle) * dist - 20; // légèrement vers le haut
  const size   = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
  const color  = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
  const emoji  = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)];
  const delay  = Math.random() * 60;
  const dur    = cfg.duration * (0.7 + Math.random() * 0.5);
  const rot    = (Math.random() - 0.5) * 360;

  Object.assign(el.style, {
    position: "fixed",
    left: `${x}px`,
    top:  `${y}px`,
    width:  useEmoji ? "auto" : `${size}px`,
    height: useEmoji ? "auto" : `${size}px`,
    background: useEmoji ? "transparent" : color,
    color: useEmoji ? color : "transparent",
    fontSize: useEmoji ? `${size * 1.4}px` : "0",
    borderRadius: useEmoji ? "0" : "50%",
    pointerEvents: "none",
    zIndex: 99990,
    transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
    opacity: "1",
    willChange: "transform, opacity",
    transition: `transform ${dur}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms,
                 opacity   ${dur * 0.6}ms ease ${delay + dur * 0.4}ms`,
    fontFamily: "system-ui",
    lineHeight: "1",
    userSelect: "none",
  });

  el.textContent = useEmoji ? emoji : "";
  document.body.appendChild(el);

  // Force reflow
  el.getBoundingClientRect();

  // Animate
  Object.assign(el.style, {
    transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${useEmoji ? 1.2 : 0.2}) rotate(${rot}deg)`,
    opacity: "0",
  });

  setTimeout(() => el.remove(), dur + delay + 100);
}

/* ── Ink ripple ── */
function spawnRipple(x, y, el) {
  const rect   = el.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2.2;
  const rx     = x - rect.left - size / 2;
  const ry     = y - rect.top  - size / 2;

  const ripple = document.createElement("span");
  const prevPos = getComputedStyle(el).position;
  const prevOvr = getComputedStyle(el).overflow;

  if (prevPos === "static") el.style.position = "relative";
  el.style.overflow = "hidden";

  Object.assign(ripple.style, {
    position: "absolute",
    left: `${rx}px`, top: `${ry}px`,
    width: `${size}px`, height: `${size}px`,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.28)",
    transform: "scale(0)",
    pointerEvents: "none",
    zIndex: 10,
    animation: "bdjRipple 0.55s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
  });

  el.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
    if (prevPos === "static") el.style.position = "";
    el.style.overflow = prevOvr || "";
  }, 580);
}

/* ── Vibration haptique ── */
function vibrate(ms) {
  try { navigator.vibrate?.(ms); } catch (e) { /* silencieux */ }
}

/* ── Injecte le keyframe ripple une seule fois ── */
function injectRippleKeyframe() {
  if (document.getElementById("bdj-ripple-kf")) return;
  const style = document.createElement("style");
  style.id    = "bdj-ripple-kf";
  style.textContent = `
    @keyframes bdjRipple {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* ── Composant global ── */
export default function ClickFX() {
  useEffect(() => {
    injectRippleKeyframe();

    const handler = (e) => {
      const target = e.target;
      const btn    = target.closest("a, button, [data-clickfx]");
      if (!btn) return;

      const x = e.clientX;
      const y = e.clientY;
      const preset = getPreset(target);
      const cfg    = PRESETS[preset] || PRESETS.default;

      // 1. Ink ripple sur le bouton lui-même
      spawnRipple(x, y, btn);

      // 2. Burst de particules
      const count = Math.floor(cfg.count * (0.7 + Math.random() * 0.5));
      for (let i = 0; i < count; i++) spawnParticle(x, y, preset);

      // 3. Haptic
      vibrate(cfg.vibrate);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null; // rendu purement DOM
}
