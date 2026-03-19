import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCHOOL } from "../../data/content";

const CONTACTS = [
  { label: "Direction",    phone: SCHOOL.whatsappRaw,             emoji: "👩‍💼" },
  { label: "Inscriptions", phone: SCHOOL.whatsappInscriptionsRaw, emoji: "📋" },
  { label: "Secrétariat",  phone: SCHOOL.phone2Raw,               emoji: "🏫" },
];

export default function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);
  const [open,    setOpen]    = useState(false);
  // Ref pour éviter la stale closure dans le scroll handler
  const shownRef = useRef(false);

  useEffect(() => {
    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      setVisible(true);
    };
    const timer    = setTimeout(show, 2500);
    const onScroll = () => { if (window.scrollY > 200) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{
            position: "fixed", left: "1.1rem",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
            zIndex: 141, display: "flex", flexDirection: "column",
            alignItems: "flex-start", gap: "0.5rem",
          }}
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <AnimatePresence>
            {open && (
              <motion.div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.28 }}>
                {CONTACTS.map((c, i) => (
                  <motion.a key={c.label}
                    href={`https://wa.me/${c.phone}?text=Bonjour%2C%20je%20souhaite%20un%20renseignement`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "0.55rem",
                      padding: "0.52rem 1rem 0.52rem 0.62rem",
                      background: "#fff", border: "1.5px solid #E8E8E8",
                      borderRadius: "50px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      fontFamily: "'Poppins'", fontWeight: 600, fontSize: "0.78rem",
                      color: "#0A0A0A", whiteSpace: "nowrap", textDecoration: "none",
                    }}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ borderColor: "#25D366", boxShadow: "0 6px 20px rgba(37,211,102,0.22)", scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}>
                    <span style={{ fontSize: "0.95rem" }}>{c.emoji}</span>
                    <span>{c.label}</span>
                    <span style={{ marginLeft: "auto", color: "#25D366", fontSize: "0.72rem" }}>💬</span>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button onClick={() => setOpen(o => !o)} aria-label="WhatsApp"
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "#25D366", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.45rem",
              boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
              position: "relative",
            }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            animate={!open ? {
              boxShadow: ["0 4px 20px rgba(37,211,102,0.45)", "0 4px 32px rgba(37,211,102,0.7)", "0 4px 20px rgba(37,211,102,0.45)"]
            } : {}}
            transition={{ duration: 2.2, repeat: Infinity }}>
            <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.22 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {open ? <span style={{ fontWeight: 900, fontSize: "1rem" }}>✕</span> : "💬"}
            </motion.span>
            {!open && (
              <motion.span style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2px solid #25D366", opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0], scale: [0.85, 1.45, 1.75] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
