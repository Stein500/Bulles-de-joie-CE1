import { useState, useRef } from "react";
// Link non utilisé dans cette page
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { TARIFS, TARIFS_TABLE, ECHEANCIER, UNIFORMES, CANTINE, SCHOOL, CRECHE_PIECES, CRECHE_LINGERIE } from "../../data/content";
import PageIntro from "../../components/PageIntro/PageIntro";
import { Reveal, StaggerGrid } from "../../utils/anim";
import * as PageIA from "../../utils/ia";
const P = PageIA.TARIFS; // profil animations Tarifs

const ACCENT = { pink: "#F33791", lime: "#C8FF00", black: "#0A0A0A" };
const TXT    = { pink: "#fff",    lime: "#0A0A0A", black: "#fff"    };

/* ── Hero ── */
function Hero() {
  return (
    <section style={{ minHeight: "55vh", position: "relative", display: "flex", alignItems: "center", paddingTop: "var(--nav-h)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/hero-tarifs.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(10,10,10,0.72) 0%,rgba(10,10,10,0.5) 50%,rgba(255,255,255,0.55) 100%)", zIndex: 1 }} />
      {/* Orbes */}
      <div style={{ position: "absolute", left: "-3rem", bottom: "10%", width: "35vw", height: "35vw", maxWidth: 400, background: "radial-gradient(ellipse,rgba(243,55,145,0.2) 0%,transparent 70%)", borderRadius: "50%", zIndex: 1 }} />
      <div style={{ position: "absolute", right: "-2rem", top: "5%", width: "28vw", height: "28vw", maxWidth: 320, background: "radial-gradient(ellipse,rgba(200,255,0,0.12) 0%,transparent 70%)", borderRadius: "50%", zIndex: 1 }} />

      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "4rem", paddingBottom: "4rem" }}>
        {/* Live pill */}
        <motion.div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "rgba(243,55,145,0.18)", border: "1px solid rgba(243,55,145,0.45)", borderRadius: 100, padding: "0.3rem 1rem 0.3rem 0.65rem", marginBottom: "1.25rem" }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <motion.span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F33791", boxShadow: "0 0 8px #F33791", flexShrink: 0 }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>Année scolaire 2025-2026</span>
        </motion.div>

        <motion.h1 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(2.8rem, 8vw, 6rem)", letterSpacing: "-0.05em", lineHeight: 0.92, marginBottom: "1.4rem", color: "#fff" }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
          Tarifs <span style={{ color: "#F33791", textShadow: "0 0 40px rgba(243,55,145,0.7)" }}>Clairs</span><br/>
          <span style={{ fontSize: "0.55em", fontWeight: 800, color: "rgba(255,255,255,0.65)", letterSpacing: "-0.02em" }}>& transparents</span>
        </motion.h1>

        <motion.div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          {["💳 Paiement flexible","✅ Zéro frais cachés","🎓 4 cycles disponibles"].map((b, i) => (
            <span key={b} style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", padding: "0.32rem 0.9rem", borderRadius: 100, backdropFilter: "blur(8px)" }}>{b}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Tableau récapitulatif ── */
function TableauSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="section-label">Vue d'ensemble</div>
            <h2 className="section-title">Tableau <span style={{ color: "#F33791" }}>Récapitulatif</span> 📊</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ overflowX: "auto", borderRadius: 16, border: "1.5px solid #E8E8E8", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Poppins'", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#0A0A0A", color: "#fff" }}>
                  {["Niveau", "Âge", "Frais généraux", "Scolarité", "Total Nouveau", "Total Ancien"].map(h => (
                    <th key={h} style={{ padding: "1rem 1.1rem", textAlign: "left", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TARIFS_TABLE.map((row, i) => {
                  const rowAccent = i === 0 ? "rgba(243,55,145,0.06)" : i === 1 ? "rgba(200,255,0,0.07)" : i === 2 ? "rgba(200,255,0,0.05)" : "rgba(124,58,255,0.05)";
                  return (
                    <tr key={row.niveau} style={{ background: row.pop ? "rgba(243,55,145,0.06)" : (i % 2 === 0 ? "#fff" : "#FAFAFA"), borderBottom: "1px solid #F0F0F0", transition: "background 0.15s" }}>
                      <td style={{ padding: "0.9rem 1.1rem", fontFamily: "'Poppins'", fontWeight: 700, whiteSpace: "nowrap", borderLeft: `3px solid ${i===0?"#F33791":i===1||i===2?"#00D46A":"#7C3AFF"}` }}>
                        {row.niveau} {row.pop && <span style={{ background: "#F33791", color: "#fff", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.12rem 0.5rem", marginLeft: "0.4rem", borderRadius: 4 }}>POP</span>}
                      </td>
                      <td style={{ padding: "0.9rem 1.1rem", color: "#6B6B6B", whiteSpace: "nowrap" }}>{row.age}</td>
                      <td style={{ padding: "0.9rem 1.1rem", whiteSpace: "nowrap" }}>{row.fraisGen}</td>
                      <td style={{ padding: "0.9rem 1.1rem", color: "#6B6B6B", whiteSpace: "nowrap" }}>{row.scolarite}</td>
                      <td style={{ padding: "0.9rem 1.1rem", fontFamily: "'Poppins'", fontWeight: 800, color: "#F33791", whiteSpace: "nowrap" }}>{row.totNouv}</td>
                      <td style={{ padding: "0.9rem 1.1rem", fontFamily: "'Poppins'", fontWeight: 700, color: "#00D46A", whiteSpace: "nowrap" }}>{row.totAnc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: "'Poppins'", fontSize: "0.7rem", color: "#ACACAC", marginTop: "0.75rem", textAlign: "center" }}>↔️ Faites défiler horizontalement pour tout voir</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Price Card ── */
function PriceCard({ t, idx = 0 }) {
  const [open, setOpen] = useState(false);
  const accent = ACCENT[t.color] ?? "#F33791";
  const txtAcc = TXT[t.color] ?? "#fff";
  const ia = P.pick(t.emoji, idx);

  return (
      <motion.article style={{ background: "#fff", border: `2px solid ${t.featured ? accent : "#E8E8E8"}`, position: "relative", boxShadow: t.featured ? `0 12px 48px ${accent}28` : "0 2px 12px rgba(0,0,0,0.04)", height: "100%", borderRadius: 20, overflow: "hidden" }} whileHover={{ y: -8, boxShadow: `0 28px 64px ${accent}22` }} transition={{ type: "spring", stiffness: 340, damping: 26 }}>
        {/* stripe */}
        <div style={{ height: 4, background: accent }} />
        <div style={{ padding: "1.75rem" }}>
          {t.badge && (
            <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: accent, color: txtAcc, fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.2rem 0.6rem" }}>
              {t.badge}
            </div>
          )}
          <motion.div style={{ fontSize: "1.75rem", marginBottom: "0.5rem", display: "inline-block", transformOrigin: "center" }}
            animate={ia.animate} transition={ia.transition} whileHover={{...P.hover, transition: P.hoverTransition}}
          >{t.emoji}</motion.div>
          <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>{t.name}</h3>
          <div style={{ fontFamily: "'Poppins'", fontSize: "0.68rem", color: "#ACACAC", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem" }}>{t.age}</div>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "clamp(1.5rem, 3.5vw, 2rem)", letterSpacing: "-0.04em", color: accent, lineHeight: 1 }}>{t.price}</span>
            <span style={{ fontFamily: "'Poppins'", fontSize: "0.75rem", color: "#ACACAC", marginLeft: "0.35rem" }}>{t.period}</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "grid", gap: "0.4rem" }}>
            {t.features.map(f => (
              <li key={f} style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "#0A0A0A", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ color: accent, flexShrink: 0, marginTop: "0.1rem" }}>✓</span>{f}
              </li>
            ))}
          </ul>

          {/* Accordion détail */}
          <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "0.6rem 1rem", border: `1.5px solid #E8E8E8`, background: "transparent", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#6B6B6B" }}>
            <span>Voir le détail des frais</span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ display: "inline-block" }}>▾</motion.span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.165, 0.84, 0.44, 1] }} style={{ overflow: "hidden" }}>
                <div style={{ borderTop: "1px solid #F0F0F0", marginTop: "0.75rem", paddingTop: "0.75rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Poppins'", fontSize: "0.78rem" }}>
                    <tbody>
                      {t.details.map(d => (
                        <tr key={d.label} style={{ borderBottom: "1px solid #F0F0F0", background: d.total ? `${accent}0D` : "transparent" }}>
                          <td style={{ padding: "0.45rem 0.25rem", fontWeight: d.strong || d.total ? 700 : 400, color: d.total ? accent : "#0A0A0A" }}>{d.label}</td>
                          <td style={{ padding: "0.45rem 0.25rem", textAlign: "right", fontWeight: d.strong || d.total ? 700 : 400, color: d.total ? accent : "#0A0A0A" }}>{d.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div style={{ marginTop: "1.25rem" }}>
            <motion.a href={`https://wa.me/${SCHOOL.whatsappInscriptionsRaw}?text=Bonjour, je souhaite inscrire mon enfant en ${t.name}`}
              target="_blank" rel="noopener"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.75rem", background: accent, color: txtAcc, fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.03em", textTransform: "uppercase" }}
              whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}>
              💬 Inscrire en {t.name}
            </motion.a>
          </div>
        </div>
      </motion.article>
  );
}

function CardsSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Cliquez pour tout voir</div>
            <h2 className="section-title">Détail par <span style={{ color: "#00D46A" }}>Niveau</span></h2>
          </div>
        </Reveal>
        <StaggerGrid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="1.25rem" stagger={0.09} style={{ maxWidth: 900, margin: "0 auto" }}>
          {TARIFS.map((t, i) => <PriceCard key={t.id} t={t} idx={i} />)}
        </StaggerGrid>
      </div>
    </section>
  );
}

/* ── Uniformes & Cantine ── */
function UniformeCanineSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Services complémentaires</div>
            <h2 className="section-title">Uniformes & <span style={{ color: "#00D46A" }}>Cantine</span> 👔</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.5rem" }}>Tout ce qu'il faut pour bien démarrer</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", maxWidth: 850, margin: "0 auto" }}>

          {/* Uniformes */}
          <Reveal delay={0.05}>
            <div style={{ background: "#fff", border: "1.5px solid #E8E8E8", padding: "1.75rem" }}>
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                👕 Uniformes Scolaires
              </h3>
              <div style={{ display: "grid", gap: "0.6rem" }}>
                {UNIFORMES.map(u => {
                  const accent = ACCENT[u.color] ?? "#0A0A0A";
                  return (
                    <div key={u.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", background: u.color === "pink" ? "rgba(243,55,145,0.05)" : u.color === "lime" ? "rgba(200,255,0,0.08)" : "#F4F4F4", borderLeft: `3px solid ${accent}` }}>
                      <span style={{ fontFamily: "'Poppins'", fontSize: "0.85rem" }}>{u.emoji} {u.label}</span>
                      <span style={{ fontFamily: "'Poppins'", fontWeight: 800, color: accent, fontSize: "0.9rem" }}>{u.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Cantine */}
          <Reveal delay={0.1}>
            <div style={{ background: "#fff", border: "1.5px solid #E8E8E8", padding: "1.75rem" }}>
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                🍽️ Cantine (mensuel)
              </h3>
              {/* Crèche */}
              <div style={{ background: "rgba(243,55,145,0.05)", borderLeft: "3px solid #F33791", padding: "0.85rem", marginBottom: "0.75rem" }}>
                <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.78rem", color: "#F33791", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>🍼 Crèche</div>
                {CANTINE.creche.map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Poppins'", fontSize: "0.82rem" }}>
                    <span>{c.label}</span><span style={{ fontWeight: 700, color: "#F33791" }}>{c.price}</span>
                  </div>
                ))}
              </div>
              {/* Maternelle & Primaire */}
              <div style={{ background: "rgba(200,255,0,0.08)", borderLeft: "3px solid #00D46A", padding: "0.85rem" }}>
                <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.78rem", color: "#00D46A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>📗 Maternelle & Primaire</div>
                {CANTINE.matPri.map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Poppins'", fontSize: "0.82rem", padding: "0.2rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <span>{c.label}</span><span style={{ fontWeight: 700, color: "#00D46A" }}>{c.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Échéancier 4 étapes ── */
function EcheancierSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Facilités de paiement</div>
            <h2 className="section-title">Paiement en <span style={{ color: "#F33791" }}>4 Étapes</span> 📅</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.5rem" }}>Facilités de paiement pour les familles</p>
          </div>
        </Reveal>
        <StaggerGrid columns="1fr" gap="0.85rem" stagger={0.1} style={{ maxWidth: 600, margin: "0 auto" }}>
          {ECHEANCIER.map((step) => {
            const accent = ACCENT[step.color] ?? "#F33791";
            return (
              <motion.div key={step.step} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", background: "#fff", border: "1.5px solid #E8E8E8", padding: "1.25rem 1.5rem" }}
                whileHover={{ borderColor: accent, boxShadow: "0 10px 36px rgba(0,0,0,0.07)", x: 3 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}>
                <motion.div style={{ width: 44, height: 44, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1.1rem", color: step.color === "lime" ? "#0A0A0A" : "#fff", flexShrink: 0 }}
                  whileHover={{ scale: 1.12 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                  {step.step}
                </motion.div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em", marginBottom: "0.2rem" }}>{step.title}</h4>
                  <p style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "#6B6B6B", marginBottom: "0.35rem" }}>{step.desc}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "'Poppins'", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent }}>
                    📅 {step.date}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </StaggerGrid>
        <Reveal delay={0.4}>
          <p style={{ textAlign: "center", fontFamily: "'Poppins'", fontSize: "0.75rem", color: "#ACACAC", marginTop: "1.25rem" }}>
            Pré-Maternelle : Tranche 1 = 30.000 FCFA (total scolarité 90.000 FCFA)
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Moyens de paiement ── */
/* ── Carte Coris Bank avec upload de preuve ── */
function CorisBankCard() {
  const [preuve, setPreuve] = useState(null); // { name, dataUrl }
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);
  const rib = "BJ212 02004 004943124101";

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreuve({ name: file.name, dataUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const copyRib = () => {
    navigator.clipboard.writeText(rib).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const sendWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour Les Bulles de Joie,\n\n🏦 PREUVE DE VIREMENT CORIS BANK\nCompte : Les Bulles de Joie\nRIB : ${rib}\n\nVeuillez trouver ci-joint ma preuve de paiement.\nMerci.`
    );
    window.open(`https://wa.me/${SCHOOL.whatsappInscriptionsRaw.replace(/\s/g,"")}?text=${msg}`, "_blank");
  };

  return (
    <div>
      {/* Infos bancaires */}
      <div style={{ background: "#F4F4F4", padding: "0.85rem", marginBottom: "0.75rem", borderLeft: "3px solid #00D46A" }}>
        <div style={{ fontFamily: "'Poppins'", fontSize: "0.78rem" }}>
          <div style={{ color: "#ACACAC", fontSize: "0.68rem", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Intitulé du compte</div>
          <div style={{ fontWeight: 700, marginBottom: "0.65rem" }}>Les Bulles de Joie</div>
          <div style={{ color: "#ACACAC", fontSize: "0.68rem", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Numéro de compte (RIB)</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontFamily: "'Poppins'", fontSize: "0.82rem", letterSpacing: "0.03em" }}>{rib}</span>
            <button type="button" onClick={copyRib}
              style={{ fontSize: "0.65rem", padding: "0.18rem 0.55rem", background: copied ? "#00D46A" : "#0A0A0A", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Poppins'", fontWeight: 700, letterSpacing: "0.04em", transition: "background 0.2s" }}>
              {copied ? "✓ Copié !" : "Copier"}
            </button>
          </div>
        </div>
      </div>

      {/* Zone upload preuve de virement */}
      <div style={{ border: "1.5px dashed #D0D0D0", padding: "0.85rem", marginBottom: "0.75rem", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setPreuve({ name: f.name, dataUrl: ev.target.result }); r.readAsDataURL(f); } }}
      >
        <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFile} />
        {preuve ? (
          <div>
            {preuve.dataUrl.startsWith("data:image") && (
              <img src={preuve.dataUrl} alt="Preuve" style={{ maxHeight: 80, maxWidth: "100%", objectFit: "contain", marginBottom: "0.4rem", display: "block", margin: "0 auto 0.4rem" }} />
            )}
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.72rem", color: "#00D46A" }}>✓ {preuve.name}</div>
            <div style={{ fontFamily: "'Poppins'", fontSize: "0.65rem", color: "#ACACAC", marginTop: "0.15rem" }}>Cliquer pour changer</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>📎</div>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.72rem", color: "#6B6B6B" }}>Joindre votre preuve de virement</div>
            <div style={{ fontFamily: "'Poppins'", fontSize: "0.65rem", color: "#ACACAC", marginTop: "0.15rem" }}>Photo reçu · PDF · Capture d'écran</div>
          </div>
        )}
      </div>

      {/* Envoyer via WhatsApp */}
      <button type="button" onClick={sendWhatsApp}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.75rem", width: "100%", background: "#00D46A", color: "#fff", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.03em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "10px" }}>
        💬 Envoyer la preuve via WhatsApp
      </button>
      {!preuve && (
        <p style={{ fontFamily: "'Poppins'", fontSize: "0.65rem", color: "#ACACAC", textAlign: "center", marginTop: "0.4rem" }}>
          Importez d'abord votre reçu puis envoyez
        </p>
      )}
    </div>
  );
}

function PaiementsSection() {
  const [momoAmount, setMomoAmount] = useState("");

  /* ── MTN MomoPay : USSD via lien tel: ── */
  const handleMomoPay = () => {
    const amount = momoAmount.trim();
    if (!amount || isNaN(Number(amount)) || Number(amount) < 500) {
      alert("Veuillez saisir un montant valide (min. 500 FCFA)");
      return;
    }
    // %23 = # encodé pour que le tel: link fonctionne sur Android/iOS
    const link = `tel:*880*41*167452*${amount}%23`;
    const a = document.createElement("a");
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ── Coris Money : deep link app + fallback Play/App Store ── */
  const handleCorisMoney = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.location.href = "corismoney://";
      setTimeout(() => { window.location.href = "https://apps.apple.com/app/coris-money/id1559800862"; }, 1800);
      return;
    }
    // Android : intent invisible + fallback Play Store
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=com.m2i.corismoney;end";
    document.body.appendChild(iframe);
    const timer = setTimeout(() => {
      window.location.href = "https://play.google.com/store/apps/details?id=com.m2i.corismoney";
    }, 1800);
    window.addEventListener("blur", () => clearTimeout(timer), { once: true });
    setTimeout(() => iframe.parentNode?.removeChild(iframe), 3500);
  };

  const cardStyle = { background: "#fff", border: "1.5px solid #E8E8E8", padding: "1.75rem" };

  return (
    <section style={{ padding: "5rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Plusieurs options</div>
            <h2 className="section-title">Moyens de <span style={{ color: "#00D46A" }}>Paiement</span> 💳</h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", maxWidth: 920, margin: "0 auto" }}>

          {/* ── MTN MomoPay ── */}
          <Reveal delay={0}>
            <motion.div style={cardStyle} whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)", borderColor: "#FFCB05" }}>
              <div style={{ width: 64, height: 64, background: "#FFCB05", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.85rem", overflow: "hidden" }}>
                <img src="/images/logo-mtn.png" alt="MTN" style={{ width: 48, height: 48, objectFit: "contain" }} />
              </div>
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", textAlign: "center", marginBottom: "0.25rem" }}>MTN MomoPay</h3>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.75rem", color: "#ACACAC", textAlign: "center", marginBottom: "1.25rem" }}>Paiement mobile instantané</p>

              {/* Champ montant */}
              <div style={{ position: "relative", marginBottom: "0.6rem" }}>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Saisir le montant FCFA"
                  value={momoAmount}
                  onChange={e => setMomoAmount(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleMomoPay()}
                  style={{ width: "100%", padding: "0.75rem 4rem 0.75rem 0.9rem", border: "2px solid #FFCB05", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "1rem", background: "#FFFDE7", boxSizing: "border-box", outline: "none" }}
                />
                <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.7rem", color: "#6B6B6B" }}>FCFA</span>
              </div>

              <motion.button type="button" onClick={handleMomoPay}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.8rem", width: "100%", background: "#FFCB05", color: "#000", fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.03em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "10px" }}
                whileHover={{ background: "#f0bc00" }} whileTap={{ scale: 0.97 }}>
                📞 Composer *880*41*167452*{momoAmount || "…"}#
              </motion.button>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.65rem", color: "#ACACAC", textAlign: "center", marginTop: "0.45rem" }}>
                Ouvre le composeur téléphonique avec le code prérempli
              </p>
            </motion.div>
          </Reveal>

          {/* ── Coris Bank (virement) ── */}
          <Reveal delay={0.1}>
            <motion.div style={cardStyle} whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)", borderColor: "#00D46A" }}>
              <div style={{ width: 64, height: 64, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.85rem", overflow: "hidden" }}>
                <img src="/images/logo-coriss.png" alt="Coris Bank" style={{ width: 48, height: 48, objectFit: "contain" }} />
              </div>
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", textAlign: "center", marginBottom: "0.25rem" }}>Coris Bank</h3>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.75rem", color: "#ACACAC", textAlign: "center", marginBottom: "1.25rem" }}>Virement bancaire + Envoi de preuve</p>
              <CorisBankCard />
            </motion.div>
          </Reveal>

          {/* ── Coris Money (mobile) ── */}
          <Reveal delay={0.2}>
            <motion.div style={cardStyle} whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)", borderColor: "#C8FF00" }}>
              <div style={{ width: 64, height: 64, background: "#fff", border: "1.5px solid #E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.85rem", overflow: "hidden" }}>
                <img src="/images/logo-coris.png" alt="Coris Money" style={{ width: 48, height: 48, objectFit: "contain" }} />
              </div>
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", textAlign: "center", marginBottom: "0.25rem" }}>Coris Money</h3>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.75rem", color: "#ACACAC", textAlign: "center", marginBottom: "1.25rem" }}>Dépôt mobile instantané</p>

              {/* Numéro */}
              <div style={{ background: "#F4F4F4", padding: "0.85rem", marginBottom: "0.75rem", textAlign: "center", borderLeft: "3px solid #C8FF00" }}>
                <div style={{ fontFamily: "'Poppins'", color: "#ACACAC", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Numéro de dépôt</div>
                <div style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1.15rem", color: "#0A0A0A" }}>{SCHOOL.phone}</div>
              </div>

              <motion.button type="button" onClick={handleCorisMoney}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.8rem", width: "100%", background: "#0A0A0A", color: "#C8FF00", fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.04em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "10px" }}
                whileHover={{ background: "#1a1a1a" }} whileTap={{ scale: 0.97 }}>
                🚀 Ouvrir l'app Coris Money
              </motion.button>
              <p style={{ fontFamily: "'Poppins'", fontSize: "0.65rem", color: "#ACACAC", textAlign: "center", marginTop: "0.45rem" }}>
                Ouvre l'application directement
              </p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Dossier Crèche : Pièces à fournir & Lingerie ── */
function CrecheInfoSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Crèche & Garderie</div>
            <h2 className="section-title">Dossier & <span style={{ color: "#F33791" }}>Accessoires</span> 🍼</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.5rem" }}>Tout ce qu'il faut préparer pour accueillir votre enfant</p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
          {/* Pièces à fournir */}
          <Reveal delay={0.05}>
            <div style={{ background: "#fff", border: "2px solid rgba(243,55,145,0.18)", padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#F33791" }} />
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#0A0A0A" }}>
                <span style={{ fontSize: "1.3rem" }}>📋</span> Pièces à fournir
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.55rem" }}>
                {CRECHE_PIECES.map((piece, i) => (
                  <motion.li key={i}
                    style={{ fontFamily: "'Poppins'", fontSize: "0.83rem", color: "#333", display: "flex", gap: "0.55rem", alignItems: "flex-start", padding: "0.45rem 0.65rem", background: i % 2 === 0 ? "rgba(243,55,145,0.04)" : "transparent" }}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <span style={{ color: "#F33791", flexShrink: 0, fontWeight: 800, marginTop: 1 }}>›</span>
                    <span>{piece}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Lingerie & Accessoires */}
          <Reveal delay={0.1}>
            <div style={{ background: "#fff", border: "2px solid rgba(200,255,0,0.3)", padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#C8FF00" }} />
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#0A0A0A" }}>
                <span style={{ fontSize: "1.3rem" }}>🧴</span> Lingerie & Accessoires
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.55rem" }}>
                {CRECHE_LINGERIE.map((item, i) => (
                  <motion.li key={i}
                    style={{ fontFamily: "'Poppins'", fontSize: "0.83rem", color: "#333", display: "flex", gap: "0.55rem", alignItems: "flex-start", padding: "0.45rem 0.65rem", background: i % 2 === 0 ? "rgba(200,255,0,0.07)" : "transparent" }}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <span style={{ color: "#00D46A", flexShrink: 0, fontWeight: 800, marginTop: 1 }}>›</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* NB paiement mensuel */}
        <Reveal delay={0.2}>
          <div style={{ maxWidth: 900, margin: "1.5rem auto 0", background: "rgba(243,55,145,0.05)", border: "1.5px solid rgba(243,55,145,0.2)", padding: "1rem 1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📌</span>
            <p style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "#F33791" }}>NB :</strong> Les frais de crèche garderie sont payables au début de chaque mois, au plus tard le <strong>5 du mois</strong>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


function FormulaireSection() {
  const [form, setForm] = useState({ prenom: "", nom: "", dob: "", cycle: "", parent: "", telephone: "", email: "", message: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.cycle || !form.parent || !form.telephone) return;
    const msg = encodeURIComponent(`Bonjour Les Bulles de Joie,\n\n📋 PRÉ-INSCRIPTION\n\n👶 ENFANT\nPrénom : ${form.prenom}\nNom : ${form.nom}\nDate de naissance : ${form.dob || "Non renseignée"}\nCycle : ${form.cycle}\n\n👨‍👩‍👧 PARENT / TUTEUR\nNom : ${form.parent}\nTél : ${form.telephone}${form.email ? "\nEmail : " + form.email : ""}${form.message ? "\n\n💬 Message : " + form.message : ""}`);
    window.open(`https://wa.me/${SCHOOL.whatsappInscriptionsRaw}?text=${msg}`, "_blank");
  };

  const inputStyle = { width: "100%", padding: "0.7rem 0.9rem", border: "1.5px solid #E8E8E8", borderRadius: 10, fontFamily: "'Poppins'", fontSize: "0.88rem", background: "#fff", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontFamily: "'Poppins'", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0A0A0A", marginBottom: "0.35rem" };

  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }} id="inscription">
      <div className="container" style={{ maxWidth: 650 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Envoi via WhatsApp · Rentrée 2026-2027</div>
            <h2 className="section-title">Pré-<span style={{ color: "#F33791" }}>inscription</span> 📝</h2>
            <p style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "#6B6B6B", marginTop: "0.5rem" }}>
              Anticipez dès maintenant l'inscription de votre enfant pour la rentrée 2026-2027
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={e => e.preventDefault()} noValidate>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              👶 Enfant
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
              <div><label style={labelStyle}>Prénom *</label><input style={inputStyle} type="text" value={form.prenom} onChange={e => set("prenom", e.target.value)} placeholder="Ex: Koffi" required /></div>
              <div><label style={labelStyle}>Nom *</label><input style={inputStyle} type="text" value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Ex: Adjovi" required /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1.5rem" }}>
              <div><label style={labelStyle}>Date de naissance</label><input style={inputStyle} type="date" value={form.dob} onChange={e => set("dob", e.target.value)} /></div>
              <div>
                <label style={labelStyle}>Cycle *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.cycle} onChange={e => set("cycle", e.target.value)} required>
                  <option value="">— Choisir —</option>
                  <option value="Crèche (2 mois+)">Crèche (2 mois+)</option>
                  <option value="Pré-Maternelle (3-4 ans)">Pré-Maternelle (3-4 ans)</option>
                  <option value="Maternelle (4-6 ans)">Maternelle (4-6 ans)</option>
                  <option value="Primaire (6-10 ans)">Primaire (6-10 ans)</option>
                </select>
              </div>
            </div>

            <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              👨‍👩‍👧 Parent / Tuteur
            </div>
            <div style={{ marginBottom: "0.85rem" }}><label style={labelStyle}>Nom complet *</label><input style={inputStyle} type="text" value={form.parent} onChange={e => set("parent", e.target.value)} required /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
              <div><label style={labelStyle}>Téléphone *</label><input style={inputStyle} type="tel" value={form.telephone} onChange={e => set("telephone", e.target.value)} placeholder="+229 XX XX XX XX" required /></div>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@exemple.com" /></div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Message</label>
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Questions ou informations complémentaires ?" />
            </div>

            <motion.button type="button" onClick={submit} style={{ width: "100%", padding: "1rem", background: "#F33791", color: "#fff", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.04em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "10px" }} whileHover={{ background: "#0A0A0A" }} whileTap={{ scale: 0.98 }}>
              🚀 Envoyer ma demande via WhatsApp
            </motion.button>
            <p style={{ textAlign: "center", fontFamily: "'Poppins'", fontSize: "0.72rem", color: "#ACACAC", marginTop: "0.75rem" }}>Envoi direct au secrétariat des inscriptions</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export default function Tarifs() {
  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <main id="main">
        <PageIntro
          emoji="🎓"
          pageName="Tarifs en cours"
          tagline="Investir dans l'avenir de votre enfant"
          sub="Tarifs transparents · Paiement flexible · Zéro frais cachés"
          heroImage="/images/hero-tarifs.jpg"
          accentColor="#F0257B"
          particles={["💳","🎓","⭐","💎","✨","🌟"]}
          emojiAnim={PageIA.TARIFS.pageIntroEmoji}
          speed="fast"
        />
        <Hero />
        <TableauSection />
        <CardsSection />
        <UniformeCanineSection />
        <CrecheInfoSection />
        <EcheancierSection />
        <PaiementsSection />
        <FormulaireSection />
      </main>
    </>
  );
}
