import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "../hooks/useInView";

/* ═══════════════════════════════════════════════════════════════
   ANIM UTILS v16
   PERF :
   ▸ Tous les objets de variants définis UNE fois hors composants
     → 0 allocation par re-render
   ▸ useReducedMotion global → animations coupées si l'user le préfère
   ▸ Reveal/StaggerGrid/FadeIn = 0 re-render inutile
   ═══════════════════════════════════════════════════════════════ */

/* ── Easing curves ── */
export const EASE = {
  out:       [0.165, 0.84, 0.44, 1],
  spring:    [0.34,  1.56, 0.64, 1],
  cinematic: [0.77,  0,    0.18, 1],
  smooth:    [0.4,   0,    0.2,  1],
};

/* ── Variants — OBJET FIGÉ (défini hors module, jamais recréé) ── */
const V = {
  bottom: {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0  },
  },
  left: {
    hidden:  { opacity: 0, x: -26 },
    visible: { opacity: 1, x: 0   },
  },
  right: {
    hidden:  { opacity: 0, x: 26 },
    visible: { opacity: 1, x: 0  },
  },
  scale: {
    hidden:  { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1    },
  },
  fade: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  up: {
    hidden:  { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0   },
  },
};

/* Transitions figées par direction — 0 recréation */
const T_BOTTOM = { duration: 0.56, ease: EASE.out };
const T_SCALE  = { duration: 0.56, ease: EASE.spring };

function getTransition(from, delay, duration) {
  const base = from === "scale" ? { ...T_SCALE } : { ...T_BOTTOM };
  if (duration !== 0.56) base.duration = duration;
  if (delay)             base.delay    = delay;
  return base;
}

/* ── Reveal ── */
export function Reveal({
  children,
  from      = "bottom",
  delay     = 0,
  duration  = 0.56,
  style     = {},
  threshold = 0.07,
}) {
  const reduced  = useReducedMotion();
  const [ref, inView] = useInView({ threshold });
  const v = V[from] ?? V.bottom;
  const t = useMemo(() => getTransition(from, delay, duration), [from, delay, duration]);

  if (reduced) {
    return <div style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={v}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={t}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── StaggerGrid ── */
export function StaggerGrid({
  children,
  columns   = "repeat(auto-fit, minmax(240px, 1fr))",
  gap       = "1rem",
  stagger   = 0.09,
  childFrom = "bottom",
  baseDelay = 0,
  style     = {},
}) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.05 });
  const v    = V[childFrom] ?? V.bottom;
  const ease = childFrom === "scale" ? EASE.spring : EASE.out;
  const arr  = React.Children.toArray(children);

  return (
    <div
      ref={ref}
      style={{ display: "grid", gridTemplateColumns: columns, gap, ...style }}
    >
      {arr.map((child, i) =>
        reduced ? (
          <div key={i}>{child}</div>
        ) : (
          <motion.div
            key={i}
            variants={v}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.52, delay: baseDelay + i * stagger, ease }}
          >
            {child}
          </motion.div>
        )
      )}
    </div>
  );
}

/* ── FadeIn ── */
export function FadeIn({ children, delay = 0, duration = 0.45, style = {} }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.05 });
  if (reduced) return <div style={style}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration, delay, ease: EASE.out }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── SectionHeader ── */
const SH_LABEL_ANIM = { opacity: 0, x: -18 };
const SH_LABEL_DONE = { opacity: 1, x: 0   };
const SH_TITLE_ANIM = { opacity: 0, y: 22  };
const SH_TITLE_DONE = { opacity: 1, y: 0   };
const SH_SUB_ANIM   = { opacity: 0, y: 14  };
const SH_SUB_DONE   = { opacity: 1, y: 0   };

export function SectionHeader({ label, title, sub, center = false, style = {} }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} style={{ marginBottom: "2rem", textAlign: center ? "center" : "left", ...style }}>
      {label && (
        <motion.div
          className="section-label"
          style={{ justifyContent: center ? "center" : "flex-start" }}
          initial={reduced ? false : SH_LABEL_ANIM}
          animate={inView ? SH_LABEL_DONE : SH_LABEL_ANIM}
          transition={{ duration: 0.48, ease: EASE.out }}
        >
          {label}
        </motion.div>
      )}
      {title && (
        <motion.h2
          className="section-title"
          style={{ margin: 0 }}
          initial={reduced ? false : SH_TITLE_ANIM}
          animate={inView ? SH_TITLE_DONE : SH_TITLE_ANIM}
          transition={{ duration: 0.56, delay: 0.08, ease: EASE.out }}
        >
          {title}
        </motion.h2>
      )}
      {sub && (
        <motion.p
          style={{ fontFamily: "'Nunito'", color: "#6B6B6B", marginTop: "0.5rem", fontSize: "0.9rem", lineHeight: 1.6 }}
          initial={reduced ? false : SH_SUB_ANIM}
          animate={inView ? SH_SUB_DONE : SH_SUB_ANIM}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE.out }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
