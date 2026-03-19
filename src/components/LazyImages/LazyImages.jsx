import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   LAZY IMAGE REVEAL
   ▸ Toutes les <img loading="lazy"> démarrent à opacity 0
   ▸ Fade-in 0.4s dès que l'image est chargée
   ▸ IntersectionObserver pour déclencher le chargement
   ▸ MutationObserver pour les images ajoutées dynamiquement
   ═══════════════════════════════════════════════════════ */
export default function LazyImages() {
  useEffect(() => {
    /* Style global injecté une seule fois */
    const styleId = "bdj-lazy-style";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent = `
        img[loading="lazy"] {
          opacity: 0;
          transition: opacity 0.42s cubic-bezier(0.4,0,0.2,1);
          will-change: opacity;
        }
        img[loading="lazy"].bdj-loaded {
          opacity: 1;
          will-change: auto;
        }
        /* Skeleton shimmer pendant le chargement */
        img[loading="lazy"]:not(.bdj-loaded) {
          background: linear-gradient(90deg, #F4F4F4 25%, #E8E8E8 50%, #F4F4F4 75%);
          background-size: 200% 100%;
          animation: bdjSkeleton 1.5s ease infinite;
        }
        @keyframes bdjSkeleton {
          to { background-position: -200% 0; }
        }
      `;
      document.head.appendChild(s);
    }

    /* Marque une image comme chargée */
    const reveal = (img) => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add("bdj-loaded");
      } else {
        img.addEventListener("load",  () => img.classList.add("bdj-loaded"), { once: true });
        img.addEventListener("error", () => img.classList.add("bdj-loaded"), { once: true });
      }
    };

    /* Initialise toutes les images lazy présentes */
    document.querySelectorAll('img[loading="lazy"]').forEach(reveal);

    /* MutationObserver → images ajoutées après le premier render */
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.tagName === "IMG" && node.loading === "lazy") reveal(node);
          node.querySelectorAll?.('img[loading="lazy"]').forEach(reveal);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => mo.disconnect();
  }, []);

  return null;
}
