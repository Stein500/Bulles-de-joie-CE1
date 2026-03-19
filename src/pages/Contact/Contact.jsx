import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { SCHOOL, CONTACTS_PRINCIPAUX, NIVEAUX_CONTACTS, HORAIRES } from "../../data/content";
import PageIntro from "../../components/PageIntro/PageIntro";
import { Reveal, StaggerGrid } from "../../utils/anim";
import * as PageIA from "../../utils/ia";
const P = PageIA.CONTACT; // profil animations Contact

/* ── Hero ── */
function Hero() {
  return (
    <section style={{ minHeight: "55vh", position: "relative", display: "flex", alignItems: "center", paddingTop: "var(--nav-h)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/hero-contact.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg,rgba(10,10,10,0.78) 0%,rgba(243,55,145,0.3) 60%,rgba(10,10,10,0.6) 100%)", zIndex: 1 }} />
      {/* Anneaux décoratifs */}
      <div style={{ position: "absolute", right: "-3rem", top: "5%", width: "48vw", height: "48vw", maxWidth: 520, maxHeight: 520, border: "1px solid rgba(243,55,145,0.2)", borderRadius: "50%", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "0", top: "12%", width: "35vw", height: "35vw", maxWidth: 380, maxHeight: 380, border: "1px solid rgba(243,55,145,0.1)", borderRadius: "50%", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "-2rem", bottom: "-2rem", width: "30vw", height: "30vw", maxWidth: 300, background: "radial-gradient(ellipse,rgba(243,55,145,0.15) 0%,transparent 70%)", borderRadius: "50%", zIndex: 1 }} />

      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "4rem", paddingBottom: "4.5rem" }}>
        <motion.div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "rgba(243,55,145,0.18)", border: "1px solid rgba(243,55,145,0.45)", borderRadius: 100, padding: "0.3rem 1rem 0.3rem 0.65rem", marginBottom: "1.25rem" }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <motion.span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F33791", boxShadow: "0 0 8px #F33791", flexShrink: 0 }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>Nous sommes à votre écoute</span>
        </motion.div>

        <motion.h1 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(2.8rem, 8vw, 6rem)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: "1.4rem", color: "#fff" }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
          <span style={{ color: "#F33791", textShadow: "0 0 40px rgba(243,55,145,0.7)" }}>Parlons</span><br/>
          <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.9)" }}>ensemble</span>
        </motion.h1>

        <motion.p style={{ fontFamily: "'Nunito'", fontSize: "clamp(0.92rem, 2.2vw, 1.1rem)", color: "rgba(255,255,255,0.72)", maxWidth: 460, lineHeight: 1.72, marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          Direction, secrétariat, enseignants — toutes les lignes directement.
        </motion.p>

        <motion.div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          {["📞 Appel direct", "💬 WhatsApp", "📍 Zongo 2, Parakou"].map(b => (
            <span key={b} style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.62rem", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.3rem 0.85rem", borderRadius: 100, backdropFilter: "blur(8px)" }}>{b}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Contacts Principaux ── */
function ContactsPrincipauxSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Joignez-nous facilement</div>
            <h2 className="section-title">Contacts <span style={{ color: "#F33791" }}>Prioritaires</span> 👋</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          {CONTACTS_PRINCIPAUX.map((group, gi) => (
            <Reveal key={group.group} delay={gi * 0.1}>
              <div>
                <h3 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: group.dot, flexShrink: 0 }} />
                  {group.group}
                </h3>
                <div style={{ display: "grid", gap: "0.65rem" }}>
                  {group.items.map(item => (
                    <motion.a key={item.type} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener"
                      style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.9rem 1rem", background: "#FAFAFA", border: "1.5px solid #E8E8E8", textDecoration: "none", color: "inherit", borderRadius: 12 }}
                      whileHover={{ borderColor: group.dot, background: "#fff", boxShadow: `0 8px 28px ${group.dot}20`, y: -2 }}
                      whileTap={{ scale: 0.98 }}>
                      <div style={{ width: 40, height: 40, background: `${group.dot}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem", flexShrink: 0, borderRadius: 10, border: `1px solid ${group.dot}22` }}>
                        {item.emoji}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Poppins'", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ACACAC", marginBottom: "0.15rem" }}>{item.type}</div>
                        <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.88rem", color: "#0A0A0A" }}>{item.value}</div>
                        {item.note && <div style={{ fontFamily: "'Poppins'", fontSize: "0.72rem", color: "#00D46A", marginTop: "0.15rem" }}>✅ {item.note}</div>}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Par Niveau ── */
function NiveauxSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Contactez directement</div>
            <h2 className="section-title">Par <span style={{ color: "#F33791" }}>Niveau</span> 🏫</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.5rem" }}>Contactez directement le niveau de votre enfant</p>
          </div>
        </Reveal>
        <StaggerGrid columns="repeat(auto-fill, minmax(180px, 1fr))" gap="0.75rem" stagger={0.07}>
          {NIVEAUX_CONTACTS.map((n, ni) => {
            const ia = P.pick(n.emoji, ni);
            return (
            <motion.a key={n.niveau} href={n.href} style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "1rem 1.1rem", background: "#fff", border: `2px solid #E8E8E8`, textDecoration: "none", color: "inherit", borderTop: `3px solid ${n.color}` }}
              whileHover={{ borderColor: n.color, boxShadow: "0 10px 28px rgba(0,0,0,0.09)", y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}>
              <motion.span style={{ fontSize: "1.4rem", display: "inline-block", transformOrigin: "center" }}
                animate={ia.animate} transition={ia.transition} whileHover={{...P.hover, transition: P.hoverTransition}}
              >{n.emoji}</motion.span>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.85rem", color: "#0A0A0A" }}>{n.niveau}</div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.78rem", color: n.color }}>{n.phone}</div>
            </motion.a>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}

/* ── Horaires ── */
function HorairesSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Année 2025-2026</div>
            <h2 className="section-title">Horaires <span style={{ color: "#00D46A" }}>2025-2026</span> 🕐</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", maxWidth: 850 }}>
          {HORAIRES.map((h, i) => (
            <Reveal key={h.cycle} delay={i * 0.1}>
              <motion.div style={{ background: "#fff", border: `2px solid #E8E8E8`, borderTop: `4px solid ${h.color}`, padding: "1.5rem" }} whileHover={{ borderColor: h.color, boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}>
                <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "1.3rem", display: "inline-block" }}>
                    <motion.span style={{ display: "inline-block", transformOrigin: "center top" }}
                      {...P.pick(h.emoji, i)} whileHover={{...P.hover, transition: P.hoverTransition}}
                    >{h.emoji}</motion.span>
                  </span>{h.cycle}
                </h3>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {h.schedules.map(s => (
                    <div key={s.period} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid #F0F0F0" }}>
                      <span style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "#6B6B6B" }}>{s.period}</span>
                      <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.85rem", color: h.color === "#C8FF00" ? "#00D46A" : h.color }}>{s.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Formulaire contact ── */
function FormulaireSection() {
  const [form, setForm] = useState({ nom: "", telephone: "", sujet: "Inscription", message: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.nom || !form.telephone) return;
    const msg = encodeURIComponent(`Bonjour Les Bulles de Joie,\n\nSujet : ${form.sujet}\nNom : ${form.nom}\nTél : ${form.telephone}${form.message ? "\n\n" + form.message : ""}`);
    window.open(`https://wa.me/${SCHOOL.whatsappRaw}?text=${msg}`, "_blank");
  };
  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    border: "1.5px solid #E8E8E8", borderRadius: "8px",
    fontFamily: "'Poppins'", fontSize: "0.88rem",
    background: "#FAFAFA", boxSizing: "border-box",
    outline: "none", transition: "border-color 0.2s, background 0.2s",
  };
  const labelStyle = {
    display: "block", fontFamily: "'Poppins'", fontSize: "0.65rem",
    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#6B6B6B", marginBottom: "0.4rem",
  };

  return (
    <section style={{ padding: "5rem 0", background: "#FAFAFA" }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Envoi via WhatsApp</div>
            <h2 className="section-title">Envoyez-nous <span style={{ color: "#F33791" }}>un message</span></h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ background: "#fff", border: "1.5px solid #E8E8E8", borderRadius: "16px", padding: "2rem", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
              <div><label style={labelStyle}>Votre nom *</label><input style={inputStyle} type="text" value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Marie Koffi" required /></div>
              <div><label style={labelStyle}>Téléphone *</label><input style={inputStyle} type="tel" value={form.telephone} onChange={e => set("telephone", e.target.value)} placeholder="+229 XX XX XX XX" required /></div>
            </div>
            <div style={{ marginBottom: "0.85rem" }}>
              <label style={labelStyle}>Sujet</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.sujet} onChange={e => set("sujet", e.target.value)}>
                <option>Inscription</option>
                <option>Informations tarifs</option>
                <option>Pédagogie</option>
                <option>Résultats scolaires</option>
                <option>Autre</option>
              </select>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Message</label>
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 90 }} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Votre message..." />
            </div>
            <motion.button type="button" onClick={submit} style={{ width: "100%", padding: "1rem", background: "#F33791", color: "#fff", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.04em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "10px" }} whileHover={{ background: "#0A0A0A" }} whileTap={{ scale: 0.98 }}>
              💬 Envoyer via WhatsApp
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Map ── */
function MapSection() {
  return (
    <section style={{ padding: "5rem 0", background: "#FFFFFF" }}>
      <div className="container" style={{ maxWidth: 750 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Venez nous rendre visite</div>
            <h2 className="section-title">Notre <span style={{ color: "#F33791" }}>Localisation</span> 📍</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.4rem" }}>Zongo 2 dans la zone de L'ANPE · Parakou, Bénin</p>
            <p style={{ fontFamily: "'Poppins'", fontSize: "0.75rem", color: "#ACACAC", marginTop: "0.25rem" }}>🏨 Juste après Kobourou City Hôtel — 1ère maison à gauche après le carrefour</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ position: "relative", paddingBottom: "50%", height: 0, overflow: "hidden", border: "1.5px solid #E8E8E8", marginBottom: "1.5rem" }}>
            <iframe src={SCHOOL.mapsEmbed} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} loading="lazy" title="Localisation Les Bulles de Joie" allowFullScreen />
          </div>
          <div style={{ textAlign: "center" }}>
            <motion.a href={SCHOOL.mapsUrl} target="_blank" rel="noopener"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2rem", background: "#F33791", color: "#fff", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.03em", textTransform: "uppercase" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              📍 Ouvrir Google Maps
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Réseaux sociaux ── */
function SocialsSection() {
  const socials = [
    { label: "Facebook",  emoji: "📘", href: SCHOOL.facebook,  color: "#1877F2" },
    { label: "Instagram", emoji: "📷", href: SCHOOL.instagram, color: "#E1306C" },
    { label: "TikTok",    emoji: "🎵", href: SCHOOL.tiktok,    color: "#0A0A0A" },
  ];
  return (
    <section style={{ padding: "4rem 0", background: "#C8FF00" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", letterSpacing: "-0.03em", color: "#0A0A0A", marginBottom: "0.5rem" }}>
            Suivez-<span style={{ color: "#F33791" }}>nous</span> 🎉
          </h2>
          <p style={{ fontFamily: "'Poppins'", color: "#0A0A0A", opacity: 0.65, marginBottom: "1.75rem" }}>Actualités, photos et moments de vie scolaire</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {socials.map(s => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.75rem 1.5rem", background: "#0A0A0A", color: "#fff", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.04em", textTransform: "uppercase" }}
                whileHover={{ background: s.color }} whileTap={{ scale: 0.97 }}>
                {s.emoji} {s.label}
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <main id="main">
        <PageIntro
          emoji="💌"
          pageName="Contact"
          heroImage="/images/hero-contact.jpg"
          tagline="On est là pour vous"
          sub="Zongo 2 dans la zone de L'ANPE · Parakou · Réponse WhatsApp en moins de 2h"
          accentColor="#F0257B"
          particles={["💌","💬","📞","❤️","👋","🌸"]}
          emojiAnim={PageIA.CONTACT.pageIntroEmoji}
          speed="slow"
        />
        <Hero />
        <ContactsPrincipauxSection />
        <NiveauxSection />
        <HorairesSection />
        <FormulaireSection />
        <MapSection />
        <SocialsSection />
      </main>
    </>
  );
}
