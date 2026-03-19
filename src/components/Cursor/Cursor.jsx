import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   CURSOR v3 — Magnétique ultra-premium
   ▸ Dot 8px snap instantané
   ▸ Ring 44px lerp 0.10 (lag naturel)
   ▸ Sur liens/boutons : ring s'agrandit + texte "cliquez" apparaît
   ▸ Sur images : ring devient carré arrondi + "voir"
   ▸ Sur texte sélectionnable : cursor text
   ▸ Halo glow derrière le curseur
   ═══════════════════════════════════════════════════════════════ */

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const labelRef = useRef(null);
  const stateRef = useRef({ mx: 0, my: 0, rx: 0, ry: 0, raf: null, hidden: false });

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const glow  = glowRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !glow || !label) return;

    const s = stateRef.current;

    /* ── Curseur natif → masqué sur desktop ── */
    document.documentElement.style.cursor = "none";

    const onMove = (e) => {
      s.mx = e.clientX; s.my = e.clientY;
      dot.style.transform  = `translate(${s.mx}px,${s.my}px) translate(-50%,-50%)`;
      glow.style.transform = `translate(${s.mx}px,${s.my}px) translate(-50%,-50%)`;
    };

    const loop = () => {
      s.rx += (s.mx - s.rx) * 0.10;
      s.ry += (s.my - s.ry) * 0.10;
      ring.style.transform  = `translate(${s.rx}px,${s.ry}px) translate(-50%,-50%)`;
      label.style.transform = `translate(${s.rx}px,${s.ry}px) translate(-50%,-50%) translateY(38px)`;
      s.raf = requestAnimationFrame(loop);
    };

    /* ── États hover ── */
    const setDefault = () => {
      ring.style.width  = "40px";
      ring.style.height = "40px";
      ring.style.borderColor = "#F33791";
      ring.style.borderRadius = "50%";
      ring.style.opacity = "0.55";
      ring.style.mixBlendMode = "normal";
      dot.style.background = "#F33791";
      dot.style.width = "8px";
      dot.style.height = "8px";
      glow.style.opacity = "0";
      label.style.opacity = "0";
      document.documentElement.style.cursor = "none";
    };

    const setLink = (el) => {
      ring.style.width  = "60px";
      ring.style.height = "60px";
      ring.style.borderColor = "#F33791";
      ring.style.borderRadius = "50%";
      ring.style.opacity = "0.85";
      dot.style.background = "#F33791";
      dot.style.width = "5px";
      dot.style.height = "5px";
      glow.style.opacity = "0.25";
      // Label
      const txt = el.getAttribute("data-cursor") || "";
      if (txt) {
        label.textContent = txt;
        label.style.opacity = "1";
      } else {
        label.style.opacity = "0";
      }
    };

    const setImage = () => {
      ring.style.width  = "56px";
      ring.style.height = "56px";
      ring.style.borderColor = "#C8FF00";
      ring.style.borderRadius = "12px";
      ring.style.opacity = "1";
      dot.style.background = "#C8FF00";
      glow.style.opacity = "0.2";
      label.style.opacity = "0";
    };

    const setInput = () => {
      ring.style.width  = "2px";
      ring.style.height = "28px";
      ring.style.borderColor = "#F33791";
      ring.style.borderRadius = "2px";
      ring.style.opacity = "1";
      dot.style.opacity = "0";
      label.style.opacity = "0";
    };

    /* Délégation via mouseover */
    const onOver = (e) => {
      const target = e.target;
      if (target.closest("input, textarea, select")) { setInput(); return; }
      if (target.closest("img")) { setImage(); return; }
      if (target.closest("a, button, [data-clickfx], [role='button']")) {
        setLink(target.closest("a, button, [data-clickfx], [role='button']"));
        return;
      }
      setDefault();
    };

    const onLeave = () => setDefault();

    /* Click burst */
    const onClick = () => {
      dot.style.transform += " scale(2.5)";
      setTimeout(() => { dot.style.transform = dot.style.transform.replace(" scale(2.5)", ""); }, 150);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("click", onClick, { passive: true });

    s.raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99998,
        width: 8, height: 8, background: "#F33791", borderRadius: "50%",
        pointerEvents: "none", willChange: "transform",
        transition: "width 0.2s, height 0.2s, background 0.2s",
        mixBlendMode: "difference",
      }} />

      {/* Ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99997,
        width: 40, height: 40, border: "1.5px solid #F33791", borderRadius: "50%",
        pointerEvents: "none", willChange: "transform",
        transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s, border-radius 0.25s, opacity 0.2s",
        opacity: 0.55,
      }} />

      {/* Glow */}
      <div ref={glowRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99996,
        width: 80, height: 80, borderRadius: "50%",
        background: "#F33791",
        filter: "blur(24px)", opacity: 0,
        pointerEvents: "none", willChange: "transform",
        transition: "opacity 0.35s",
      }} />

      {/* Label hover */}
      <div ref={labelRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99999,
        fontFamily: "'Poppins', sans-serif", fontSize: "0.55rem",
        fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#F33791", opacity: 0,
        pointerEvents: "none", willChange: "transform",
        transition: "opacity 0.2s",
        whiteSpace: "nowrap",
        textAlign: "center",
      }} />
    </>
  );
}
