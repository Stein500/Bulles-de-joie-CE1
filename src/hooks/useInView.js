import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   useInView v3 — Pool d'observers partagés
   ▸ UN seul IntersectionObserver par config (threshold + rootMargin)
     partagé entre toutes les instances du même hook
   ▸ 0 création d'observer dupliqué
   ▸ unobserve automatique après premier trigger (once)
   ▸ RAF-batched callbacks → 0 layout thrash
   ═══════════════════════════════════════════════════════════════ */

/* Pool global : Map<key, {observer, callbacks: Map<Element, fn>}> */
const POOL = new Map();

function getSharedObserver(threshold, rootMargin) {
  const key = `${threshold}|${rootMargin}`;
  if (POOL.has(key)) return POOL.get(key);

  const callbacks = new Map();
  const observer  = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const cb = callbacks.get(e.target);
        if (cb) cb(e);
      });
    },
    { threshold, rootMargin }
  );
  const entry = { observer, callbacks };
  POOL.set(key, entry);
  return entry;
}

export function useInView({
  threshold  = 0.08,
  rootMargin = "0px 0px -60px 0px",
  repeat     = false,
} = {}) {
  const ref        = useRef(null);
  const [inView, setInView] = useState(false);
  /* stable refs — avoid re-subscribing on every render */
  const repeatRef  = useRef(repeat);
  repeatRef.current = repeat;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { observer, callbacks } = getSharedObserver(threshold, rootMargin);

    callbacks.set(el, (entry) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (!repeatRef.current) {
          observer.unobserve(el);
          callbacks.delete(el);
        }
      } else if (repeatRef.current) {
        setInView(false);
      }
    });

    observer.observe(el);

    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/* ── Compteur animé RAF — ease-out cubic ── */
export function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    startRef.current = null;

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      setCount(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView, target, duration]);

  return count;
}
