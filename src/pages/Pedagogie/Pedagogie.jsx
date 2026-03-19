import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PEDAGOGY_PILLARS, PROGRAMME_3E, PARCOURS, IMMERSIONS
} from "../../data/content";
import PageIntro from "../../components/PageIntro/PageIntro";
import { Reveal, StaggerGrid } from "../../utils/anim";
import * as PageIA from "../../utils/ia";
const P = PageIA.PEDAGOGIE;

function Hero() {
  return (
    <section style={{ minHeight: "58vh", position: "relative", display: "flex", alignItems: "center", paddingTop: "var(--nav-h)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/hero-pedagogie.jpg')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(10,10,10,0.65) 0%,rgba(0,100,50,0.35) 60%,rgba(255,255,255,0.55) 100%)", zIndex: 1 }} />
      <div style={{ position: "absolute", right: "-3rem", top: "8%", width: "52vw", height: "52vw", maxWidth: 580, maxHeight: 580, border: "1px solid rgba(200,255,0,0.2)", borderRadius: "50%", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "-1rem", top: "15%", width: "38vw", height: "38vw", maxWidth: 420, maxHeight: 420, border: "1px solid rgba(200,255,0,0.1)", borderRadius: "50%", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "-2rem", bottom: "-2rem", width: "35vw", height: "35vw", maxWidth: 380, background: "radial-gradient(ellipse,rgba(0,212,106,0.18) 0%,transparent 70%)", borderRadius: "50%", zIndex: 1 }} />
      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "4rem", paddingBottom: "4.5rem" }}>
        <motion.div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "rgba(0,212,106,0.18)", border: "1px solid rgba(0,212,106,0.45)", borderRadius: 100, padding: "0.3rem 1rem 0.3rem 0.65rem", marginBottom: "1.25rem" }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D46A", boxShadow: "0 0 8px #00D46A", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>6 piliers · Développement harmonieux</span>
        </motion.div>
        <motion.h1 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(2.8rem, 8vw, 6rem)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: "1.4rem", color: "#fff" }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
          Notre<br /><span style={{ color: "#00D46A", textShadow: "0 0 40px rgba(0,212,106,0.6)" }}>Pédagogie</span>
        </motion.h1>
        <motion.p style={{ fontFamily: "'Nunito'", fontSize: "clamp(0.92rem, 2.2vw, 1.1rem)", color: "rgba(255,255,255,0.8)", maxWidth: 460, lineHeight: 1.72, marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          Une approche innovante centrée sur l'enfant — centrée sur la joie d'apprendre.
        </motion.p>
        <motion.div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          {["🌱 Bilinguisme", "🎨 Arts & Créativité", "🔬 Sciences", "🌍 Ouverture au monde"].map(b => (
            <span key={b} style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.62rem", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.3rem 0.85rem", borderRadius: 100, backdropFilter: "blur(8px)" }}>{b}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PilierCard({ p, idx = 0 }) {
  const [hov, setHov] = useState(false);
  const accent = p.color === "pink" ? "#F33791" : p.color === "lime" ? "#00D46A" : "#0A0A0A";
  const txtHov = p.color === "lime" ? "#0A0A0A" : "#fff";
  const ia = P.pick(p.emoji, idx);
  return (
    <motion.article
      style={{ border: `2px solid ${hov ? accent : "#E8E8E8"}`, padding: "1.75rem", background: hov ? accent : "#fff", cursor: "default", borderRadius: 12 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      whileTap={{ scale: 0.97 }} transition={{ duration: 0.22 }}>
      <motion.div style={{ fontSize: "2rem", marginBottom: "0.75rem", display: "inline-block", transformOrigin: "center" }}
        animate={ia.animate} transition={ia.transition} whileHover={{ ...P.hover, transition: P.hoverTransition }}
      >{p.emoji}</motion.div>
      <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: "0.3rem", color: hov ? txtHov : "#0A0A0A", transition: "color 0.22s" }}>{p.title}</h3>
      <p style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", lineHeight: 1.6, color: hov ? (p.color === "lime" ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.8)") : "#6B6B6B", transition: "color 0.22s" }}>{p.desc}</p>
    </motion.article>
  );
}

function PiliersSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-label">Approche Pédagogique</div>
            <h2 className="section-title">6 Piliers pour un <span style={{ color: "#00D46A" }}>développement</span><br />harmonieux</h2>
          </div>
        </Reveal>
        <StaggerGrid columns="repeat(auto-fit, minmax(250px, 1fr))" gap="1rem" stagger={0.08}>
          {PEDAGOGY_PILLARS.map((p, i) => <PilierCard key={p.title} p={p} idx={i} />)}
        </StaggerGrid>
      </div>
    </section>
  );
}

function ParcoursSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>De la crèche au primaire</div>
            <h2 className="section-title">Parcours <span style={{ color: "#F33791" }}>Éducatif</span> 🚀</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gap: "1rem", maxWidth: 650, margin: "0 auto" }}>
          {PARCOURS.map((item, i) => {
            const accent = item.color === "pink" ? "#F33791" : item.color === "lime" ? "#C8FF00" : "#0A0A0A";
            const txtAccent = item.color === "lime" ? "#0A0A0A" : accent;
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <motion.article style={{ border: "2px solid #E8E8E8", borderLeft: `4px solid ${accent}`, padding: "1.5rem 1.75rem", background: "#fff" }}
                  whileHover={{ borderColor: accent, boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}>
                  <div style={{ fontFamily: "'Poppins'", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: txtAccent, marginBottom: "0.4rem" }}>{item.tranche}</div>
                  <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>{item.emoji} {item.title}</h3>
                  <p style={{ fontFamily: "'Poppins'", fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.6 }}>{item.desc}</p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Programme3ESection() {
  return (
    <section style={{ padding: "6rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Programme unique</div>
            <h2 className="section-title">
              <span style={{ color: "#F33791" }}>Élégance</span> · <span style={{ color: "#00D46A" }}>Éloquence</span> · Bonnes Manières
            </h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.5rem" }}>Un programme unique pour des enfants accomplis</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {PROGRAMME_3E.map((prog, i) => {
            const accent = prog.color === "pink" ? "#F33791" : prog.color === "lime" ? "#C8FF00" : "#0A0A0A";
            const bgMap = { pink: "rgba(243,55,145,0.05)", lime: "rgba(200,255,0,0.08)", black: "rgba(10,10,10,0.03)" };
            return (
              <Reveal key={prog.title} delay={i * 0.1}>
                <motion.article style={{ background: bgMap[prog.color], border: `2px solid ${accent}`, padding: "2rem", borderRadius: 12 }} whileHover={{ y: -4 }}>
                  {(() => { const ia = P.pick(prog.emoji, i); return (
                    <motion.div style={{ fontSize: "2rem", marginBottom: "0.6rem", display: "inline-block", transformOrigin: "center" }}
                      animate={ia.animate} transition={ia.transition} whileHover={{ ...P.hover, transition: P.hoverTransition }}
                    >{prog.emoji}</motion.div>
                  ); })()}
                  <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em", color: accent === "#C8FF00" ? "#0A0A0A" : accent, marginBottom: "0.4rem" }}>{prog.title}</h3>
                  <p style={{ fontFamily: "'Poppins'", fontSize: "0.85rem", color: "#6B6B6B", marginBottom: "1rem" }}>{prog.desc}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.35rem" }}>
                    {prog.items.map(item => (
                      <li key={item} style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", color: "#0A0A0A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ActivitesSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Pour chaque enfant</div>
            <h2 className="section-title">Activités <span style={{ color: "#00D46A" }}>Parascolaires</span> 🎪</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", marginTop: "0.5rem" }}>Des activités variées pour l'épanouissement de chaque élève</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "#E8E8E8" }}>
          {IMMERSIONS.map((im, i) => (
            <Reveal key={im.title} delay={i * 0.06}>
              <motion.article
                className="act-card"
                style={{ background: "#fff", padding: "1.75rem", cursor: "default" }}
                whileHover={{ background: i % 2 === 0 ? "#F33791" : "#0A0A0A" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  {(() => { const ia = P.pick(im.emoji, i); return (
                    <motion.span style={{ fontSize: "2rem", display: "inline-block", transformOrigin: "center" }}
                      animate={ia.animate} transition={ia.transition} whileHover={{ ...P.hover, transition: P.hoverTransition }}
                    >{im.emoji}</motion.span>
                  ); })()}
                  <span style={{ fontFamily: "'Poppins'", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: i % 2 === 0 ? "rgba(243,55,145,0.08)" : "#F4F4F4", color: i % 2 === 0 ? "#F33791" : "#6B6B6B", padding: "0.2rem 0.6rem", borderRadius: 99 }}>
                    {im.badge}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: "0.25rem", transition: "color 0.22s" }}>{im.title}</h3>
                <p style={{ fontFamily: "'Poppins'", fontSize: "0.82rem", lineHeight: 1.6, color: "#6B6B6B", transition: "color 0.22s" }}>{im.desc}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* === VITRINE PHOTO (remplace les vidéos) === */
const ACTIVITY_PHOTOS = [
  {
    id: "creche", emoji: "🍼", tab: "Crèche", color: "#F33791",
    photos: [
      { poster: "/images/videos/posters/eveil-musical-creche.jpg",   title: "Éveil Musical",    emoji: "🎶", desc: "Comptines, percussions douces et instruments pour stimuler l'ouïe et le sens du rythme dès le plus jeune âge." },
      { poster: "/images/videos/posters/motricite-creche.jpg",        title: "Motricité Fine",   emoji: "✋", desc: "Exercices sensoriels et manipulations pour développer la coordination et la dextérité des tout-petits." },
      { poster: "/images/videos/posters/eveil-sensoriel-creche.jpg",  title: "Éveil Sensoriel",  emoji: "👀", desc: "Expériences tactiles, olfactives et visuelles pour explorer le monde avec tous les sens en éveil." },
    ],
  },
  {
    id: "maternelle", emoji: "🎨", tab: "Maternelle", color: "#00A550",
    photos: [
      { poster: "/images/videos/posters/jardinage-maternelle.jpg", title: "Jardinage & Nature",  emoji: "🌱", desc: "Cultiver, observer et comprendre la nature au quotidien dans notre jardin pédagogique sécurisé." },
      { poster: "/images/videos/posters/anglais-maternelle.jpg",   title: "Anglais Ludique",     emoji: "🌍", desc: "Immersion bilingue naturelle par le jeu, les chansons et les activités créatives en anglais." },
      { poster: "/images/videos/posters/danse-maternelle.jpg",     title: "Danse & Expression",  emoji: "💃", desc: "Conscience corporelle, coordination et confiance en soi à travers la danse et le mouvement libre." },
    ],
  },
  {
    id: "primaire", emoji: "🎓", tab: "Primaire", color: "#7C3AFF",
    photos: [
      { poster: "/images/videos/posters/art-oratoire-primaire.jpg", title: "Art Oratoire",          emoji: "🎤", desc: "Prise de parole en public, argumentation et éloquence pour des élèves confiants et articlés." },
      { poster: "/images/videos/posters/science-primaire.jpg",      title: "Sciences & Expériences", emoji: "🔬", desc: "Expérimentations pratiques, observations et déductions pour éveiller la curiosité scientifique." },
      { poster: "/images/videos/posters/concert-primaire.jpg",      title: "Concerts & Spectacles",  emoji: "🎵", desc: "Représentations musicales et théâtrales pour développer la créativité et l'expression artistique." },
    ],
  },
];

function PhotoCard({ photo, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.article
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: hov ? "0 20px 56px rgba(0,0,0,0.14)" : "0 2px 16px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s" }}
      whileHover={{ y: -6 }} transition={{ duration: 0.28, ease: [0.165, 0.84, 0.44, 1] }}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/10" }}>
        <img src={photo.poster} alt={photo.title} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.165,0.84,0.44,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: hov ? `linear-gradient(to top,${accent}cc 0%,${accent}44 50%,transparent 100%)` : "linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 65%)", transition: "background 0.35s" }} />
        <div style={{ position: "absolute", top: "0.8rem", right: "0.8rem", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>{photo.emoji}</div>
        <div style={{ position: "absolute", bottom: "0.9rem", left: "1rem", right: "1rem" }}>
          <h4 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", color: "#fff", letterSpacing: "-0.01em", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{photo.title}</h4>
        </div>
      </div>
      <div style={{ padding: "1rem 1.1rem 1.2rem" }}>
        <p style={{ fontFamily: "'Poppins'", fontSize: "0.8rem", color: "#6B6B6B", lineHeight: 1.65, margin: 0 }}>{photo.desc}</p>
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <div style={{ width: 18, height: 2, background: accent, borderRadius: 2 }} />
          <span style={{ fontFamily: "'Poppins'", fontSize: "0.65rem", fontWeight: 700, color: accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>Activité réelle</span>
        </div>
      </div>
    </motion.article>
  );
}

function ActivitesShowcaseSection() {
  const [activeTab, setActiveTab] = useState("creche");
  const active = ACTIVITY_PHOTOS.find(s => s.id === activeTab);
  return (
    <section style={{ padding: "6rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Nos activités en images</div>
            <h2 className="section-title">Moments <span style={{ color: "#F33791" }}>d'Apprentissage</span> 📸</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: 480, margin: "0.6rem auto 0" }}>
              Un aperçu authentique de la vie pédagogique quotidienne à Les Bulles de Joie
            </p>
          </div>
        </Reveal>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.25rem", flexWrap: "wrap" }}>
          {ACTIVITY_PHOTOS.map(s => {
            const isActive = activeTab === s.id;
            return (
              <motion.button key={s.id} onClick={() => setActiveTab(s.id)}
                style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.03em", textTransform: "uppercase", padding: "0.6rem 1.4rem", border: `2px solid ${isActive ? s.color : "#E8E8E8"}`, background: isActive ? s.color : "#fff", color: isActive ? "#fff" : "#6B6B6B", cursor: "pointer", transition: "all 0.22s", borderRadius: 6 }}
                whileTap={{ scale: 0.97 }}>{s.emoji} {s.tab}</motion.button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {active?.photos.map(photo => <PhotoCard key={photo.poster} photo={photo} accent={active.color} />)}
          </motion.div>
        </AnimatePresence>
        <Reveal>
          <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.75rem", background: "rgba(0,0,0,0.03)", borderLeft: "3px solid #00D46A", borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>📷</span>
            <p style={{ fontFamily: "'Poppins'", fontSize: "0.8rem", color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>
              Ces images sont issues d'activités réelles menées dans nos locaux. <strong style={{ color: "#0A0A0A" }}>Venez visiter l'école</strong> pour découvrir par vous-même l'environnement d'apprentissage que nous offrons à vos enfants.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* === JOURNÉE TYPE === */
const JOURNEES = [
  {
    id: "creche", emoji: "🍼", label: "Crèche", color: "#F33791", age: "2 mois – 3 ans",
    steps: [
      { time: "07h00", icon: "🌅", title: "Accueil & Arrivée",          desc: "Accueil individualisé, transition douce maison-crèche, câlin de bienvenue" },
      { time: "08h00", icon: "🥣", title: "Petit déjeuner & Hygiène",   desc: "Alimentation, soins et rituel du matin en douceur avec l'équipe bienveillante" },
      { time: "09h00", icon: "🎶", title: "Éveil Musical & Sensoriel",  desc: "Comptines, percussions douces, textures à explorer, stimulations sensorielles" },
      { time: "10h00", icon: "🧸", title: "Jeu Libre & Motricité",      desc: "Parcours moteurs, jeux de manipulation, éveil corporel et premiers pas" },
      { time: "11h00", icon: "📖", title: "Lecture & Langage",          desc: "Albums illustrés, onomatopées, premiers mots en français et anglais" },
      { time: "12h00", icon: "🍽️", title: "Déjeuner & Sieste",          desc: "Repas équilibré et adapté à chaque âge, rituel de sieste accompagné en douceur" },
      { time: "15h00", icon: "🎨", title: "Activités Créatives",        desc: "Peinture des mains, modelage, collages sensoriels, jeux d'eau" },
      { time: "17h00", icon: "🤗", title: "Retour en Famille",          desc: "Transmission du carnet de bord quotidien aux parents avec comptes-rendus" },
    ],
  },
  {
    id: "maternelle", emoji: "🎨", label: "Maternelle", color: "#00A550", age: "3 – 5 ans",
    steps: [
      { time: "08h00", icon: "🌞", title: "Accueil & Rituel du Matin",  desc: "Appel bilingue, météo du jour illustrée, agenda visuel de la journée" },
      { time: "08h30", icon: "🌍", title: "Morning Circle en Anglais",  desc: "Songs, stories, greetings — immersion complète dans la langue anglaise" },
      { time: "09h30", icon: "✏️", title: "Atelier Écriture & Graphisme", desc: "Préparer la main à l'écriture : tracés dirigés, labyrinthes, premières lettres" },
      { time: "10h30", icon: "🌱", title: "Récréation & Jardinage",     desc: "Plein air obligatoire, soin des plantes, jeux coopératifs en extérieur" },
      { time: "11h00", icon: "🔢", title: "Logico-Mathématiques",       desc: "Tri, classement, dénombrement avec du matériel concret et manipulable" },
      { time: "11h30", icon: "🍽️", title: "Déjeuner & Temps calme",     desc: "Repas convivial, apprentissage des bonnes manières à table, détente musicale" },
      { time: "15h00", icon: "🎭", title: "Créativité & Expression",    desc: "Danse, théâtre de marionnettes, arts plastiques, musique et rythme" },
      { time: "16h30", icon: "📚", title: "Bilan & Retour Famille",     desc: "Récapitulatif illustré du jour, carnet de communication remis aux parents" },
    ],
  },
  {
    id: "primaire", emoji: "🎓", label: "Primaire", color: "#7C3AFF", age: "6 – 10 ans",
    steps: [
      { time: "07h30", icon: "🏫", title: "Accueil & Mise en Route",    desc: "Lecture libre, révision des leçons, prise de responsabilités dans la classe" },
      { time: "08h00", icon: "📐", title: "Mathématiques",              desc: "Calcul mental, géométrie, résolution de problèmes concrets et raisonnement" },
      { time: "09h30", icon: "📖", title: "Français & Littérature",     desc: "Lecture, compréhension de textes, production d'écrits créatifs et structurés" },
      { time: "10h30", icon: "⚽", title: "Récréation & Sport",         desc: "Activités physiques planifiées, jeux collectifs, plein air obligatoire" },
      { time: "11h00", icon: "🌍", title: "Immersion Anglaise",         desc: "Cours entièrement en anglais : sciences, arts, mathématiques en immersion" },
      { time: "12h00", icon: "🍽️", title: "Déjeuner à la Cantine",      desc: "Repas équilibré préparé sur place, convivialité et bonnes manières à table" },
      { time: "15h00", icon: "🔬", title: "Sciences & Découvertes",     desc: "Expériences pratiques, observations, démarche scientifique active et rigoureuse" },
      { time: "16h00", icon: "🎤", title: "Art Oratoire & Culture",     desc: "Exposés, débats, philosophie pour enfants, ateliers éloquence hebdomadaires" },
      { time: "17h30", icon: "🤝", title: "Remise aux Familles",        desc: "Compte-rendu quotidien via carnet de liaison ou portail numérique en ligne" },
    ],
  },
];

function JourneeTypeSection() {
  const [activeTab, setActiveTab] = useState("creche");
  const active = JOURNEES.find(j => j.id === activeTab);
  return (
    <section style={{ padding: "6rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Organisation & Structure</div>
            <h2 className="section-title">Journée <span style={{ color: "#7C3AFF" }}>Type</span> ⏰</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: 480, margin: "0.6rem auto 0" }}>
              Un cadre structuré et bienveillant qui allie apprentissages, créativité et moments de vie
            </p>
          </div>
        </Reveal>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {JOURNEES.map(j => {
            const isActive = activeTab === j.id;
            return (
              <motion.button key={j.id} onClick={() => setActiveTab(j.id)}
                style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.03em", textTransform: "uppercase", padding: "0.6rem 1.4rem", border: `2px solid ${isActive ? j.color : "#E8E8E8"}`, background: isActive ? j.color : "#fff", color: isActive ? "#fff" : "#6B6B6B", cursor: "pointer", transition: "all 0.22s", borderRadius: 6 }}
                whileTap={{ scale: 0.97 }}>
                {j.emoji} {j.label}
                <span style={{ display: "block", fontSize: "0.58rem", fontWeight: 400, opacity: 0.8, letterSpacing: "0.04em", marginTop: 1 }}>{j.age}</span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.32 }}>
            {/* Timeline — responsive : colonne heure masquée sous 560px */}
            <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
              {/* Ligne verticale positionnée dynamiquement */}
              <div className="timeline-line" style={{
                position: "absolute", top: 0, bottom: 0, width: 2,
                background: `linear-gradient(to bottom,${active.color},${active.color}44)`, zIndex: 0,
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {active.steps.map((step, i) => (
                  <motion.div key={step.time}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055, duration: 0.35 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", position: "relative", zIndex: 1 }}>
                    {/* Heure — cachée sur mobile via classe CSS */}
                    <div className="timeline-time" style={{ flexShrink: 0, textAlign: "right", paddingTop: "0.55rem" }}>
                      <span style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.75rem", color: active.color, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{step.time}</span>
                    </div>
                    {/* Dot */}
                    <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "#fff", border: `3px solid ${active.color}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.45rem", boxShadow: `0 0 0 4px ${active.color}22` }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: active.color }} />
                    </div>
                    {/* Carte */}
                    <motion.div style={{ flex: 1, background: "#fff", border: "1.5px solid #E8E8E8", borderRadius: 10, padding: "0.85rem 1.1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                      whileHover={{ borderColor: active.color, boxShadow: `0 6px 24px ${active.color}22`, y: -1 }}
                      transition={{ duration: 0.18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1rem" }}>{step.icon}</span>
                        <h4 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "-0.01em", margin: 0, color: "#0A0A0A" }}>{step.title}</h4>
                        {/* Heure inline sur mobile */}
                        <span className="timeline-time-inline" style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.7rem", color: active.color, marginLeft: "auto" }}>{step.time}</span>
                      </div>
                      <p style={{ fontFamily: "'Poppins'", fontSize: "0.78rem", color: "#6B6B6B", margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* === INFRASTRUCTURE === */
const INFRA_ITEMS = [
  { emoji: "🏗️", title: "Salles de Classe Équipées",  desc: "Espaces lumineux, mobilier adapté à l'âge, matériel pédagogique de qualité pour stimuler l'apprentissage au quotidien.", color: "#F33791" },
  { emoji: "🌿", title: "Cour & Jardin Pédagogique",  desc: "Espace vert sécurisé avec jeux moteurs, zone de jardinage et terrain multi-sports pour le plein air quotidien.", color: "#00A550" },
  { emoji: "📚", title: "Bibliothèque Jeunesse",       desc: "Collection bilingue enrichie d'albums illustrés, documentaires et œuvres de littérature de jeunesse en français et anglais.", color: "#7C3AFF" },
  { emoji: "🍽️", title: "Cantine Maison",             desc: "Repas équilibrés préparés sur place, menus variés adaptés aux besoins nutritionnels spécifiques de chaque tranche d'âge.", color: "#FF6B35" },
  { emoji: "🏥", title: "Infirmerie & Soins",          desc: "Espace santé dédié, personnel formé aux premiers secours, protocole médical strict et communication immédiate avec les parents.", color: "#0BB4D8" },
  { emoji: "🚌", title: "Accueil Élargi & Garderie",   desc: "Accueil de 7h à 19h pour la crèche, garderie matin et soir pour maternelle et primaire — flexibilité pour les familles.", color: "#C8FF00" },
];

function InfrastructureSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#FFFFFF" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Notre cadre de vie</div>
            <h2 className="section-title">Environnement <span style={{ color: "#00A550" }}>d'Excellence</span> 🏫</h2>
            <p style={{ fontFamily: "'Poppins'", color: "#6B6B6B", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: 480, margin: "0.6rem auto 0" }}>
              Un espace pensé pour que chaque enfant se sente en sécurité, stimulé et heureux
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {INFRA_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <motion.article
                style={{ border: "2px solid #F0F0F0", borderRadius: 14, padding: "1.75rem", background: "#fff", cursor: "default" }}
                whileHover={{ borderColor: item.color, boxShadow: `0 12px 40px ${item.color}22`, y: -3 }} transition={{ duration: 0.22 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: `${item.color}15`, border: `1.5px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", marginBottom: "1rem" }}>{item.emoji}</div>
                <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em", color: "#0A0A0A", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "'Poppins'", fontSize: "0.8rem", color: "#6B6B6B", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* === ENGAGEMENTS === */
const ENGAGEMENTS = [
  { num: "01", emoji: "🛡️", title: "Sécurité & Bienveillance", color: "#F33791", points: ["Personnel qualifié et formé aux premiers secours", "Surveillance permanente dans un espace sécurisé", "Protocole de communication immédiate avec les parents", "Environnement sans violence, respect absolu de chaque enfant"] },
  { num: "02", emoji: "📊", title: "Suivi & Transparence",     color: "#00A550", points: ["Carnet de bord quotidien pour crèche et maternelle", "Bulletins trimestriels détaillés pour le primaire", "Rencontres parents-enseignants planifiées chaque trimestre", "Portail en ligne accessible 24h/24 avec historique complet"] },
  { num: "03", emoji: "🌱", title: "Épanouissement Global",    color: "#7C3AFF", points: ["Équilibre entre académique, artistique et sportif", "Respect du rythme individuel de chaque élève", "Valorisation des progrès plutôt que des comparaisons", "Accompagnement psychologique et émotionnel continu"] },
  { num: "04", emoji: "🌍", title: "Excellence Bilingue",      color: "#FF6B35", points: ["Enseignants certifiés pour l'enseignement de l'anglais", "Immersion progressive français-anglais dès 2 ans", "Activités culturelles anglophones hebdomadaires", "Évaluations bilingues dès la classe de maternelle"] },
];

function EngagementsSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%,rgba(124,58,255,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
      <motion.div style={{ position: "absolute", right: "-6rem", top: "10%", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(243,55,145,0.12)", pointerEvents: "none" }}
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
      <motion.div style={{ position: "absolute", right: "-4rem", top: "15%", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(200,255,0,0.1)", pointerEvents: "none" }}
        animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>Notre promesse</div>
            <h2 className="section-title" style={{ color: "#fff" }}>Nos <span style={{ color: "#C8FF00" }}>Engagements</span><br />envers vous 🤝</h2>
            <p style={{ fontFamily: "'Poppins'", color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: 480, lineHeight: 1.7 }}>
              Des engagements concrets que nous tenons chaque jour pour les enfants et leurs familles
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {ENGAGEMENTS.map((eng, i) => (
            <Reveal key={eng.num} delay={i * 0.1}>
              <motion.article
                style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "2rem", position: "relative", overflow: "hidden" }}
                whileHover={{ background: "rgba(255,255,255,0.07)", borderColor: `${eng.color}55`, y: -4, boxShadow: `0 20px 56px ${eng.color}22` }} transition={{ duration: 0.25 }}>
                <div style={{ position: "absolute", top: "-0.5rem", right: "1rem", fontFamily: "'Poppins'", fontWeight: 900, fontSize: "4rem", color: `${eng.color}18`, letterSpacing: "-0.04em", userSelect: "none", lineHeight: 1 }}>{eng.num}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${eng.color}22`, border: `1.5px solid ${eng.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{eng.emoji}</div>
                  <h3 style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: "1rem", color: "#fff", letterSpacing: "-0.01em", margin: 0 }}>{eng.title}</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.55rem" }}>
                  {eng.points.map(pt => (
                    <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: eng.color, flexShrink: 0, marginTop: "0.5rem" }} />
                      <span style={{ fontFamily: "'Poppins'", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* === FAQ === */
const FAQ_ITEMS = [
  { q: "À quel âge peut-on inscrire un enfant à l'école ?",     a: "La crèche accueille les nourrissons dès 2 mois. La pré-maternelle commence à 3 ans, la maternelle à 4 ans et le primaire à partir de 6 ans. Aucune condition préalable n'est requise." },
  { q: "En quoi consiste l'immersion bilingue ?",               a: "Nos enseignants alternent français et anglais selon les créneaux horaires. Dès la crèche, les enfants entendent les deux langues naturellement. En primaire, certaines matières sont enseignées intégralement en anglais." },
  { q: "Comment est évalué mon enfant ?",                       a: "L'évaluation est bienveillante et continue. Des bulletins trimestriels détaillent les progrès par compétences. Des rencontres parents-enseignants sont organisées. Le portail en ligne permet un suivi permanent." },
  { q: "Les activités parascolaires sont-elles obligatoires ?", a: "Elles font partie intégrante de notre programme pédagogique et sont incluses dans les frais généraux. Elles sont pratiquées sur le temps scolaire selon les niveaux et renforcent l'épanouissement global." },
  { q: "Que comprend le programme 3E ?",                        a: "C'est un programme transversal unique qui prépare les enfants à la vie en société : tenue, posture, prise de parole, politesse, empathie. Il est intégré au quotidien dans toutes les activités et non limité à des cours spéciaux." },
  { q: "Comment se passe l'adaptation à l'entrée ?",            a: "Nous proposons une période d'adaptation progressive avec la présence des parents si nécessaire. Notre équipe est formée pour accompagner les séparations avec douceur, professionnalisme et bienveillance." },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "6rem 0", background: "#FAFAFA" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Vos questions</div>
            <h2 className="section-title">Questions <span style={{ color: "#F33791" }}>Fréquentes</span> ❓</h2>
          </div>
        </Reveal>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: "0.6rem" }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div style={{ border: `1.5px solid ${isOpen ? "#F33791" : "#E8E8E8"}`, borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: isOpen ? "0 6px 28px rgba(243,55,145,0.1)" : "none", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                  <button onClick={() => setOpen(isOpen ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "1.1rem 1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", textAlign: "left" }}>
                    <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.88rem", color: "#0A0A0A", lineHeight: 1.45 }}>{item.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
                      style={{ width: 24, height: 24, borderRadius: "50%", background: isOpen ? "#F33791" : "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isOpen ? "#fff" : "#6B6B6B", fontSize: "1rem", fontWeight: 700, lineHeight: 1 }}>+</motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 1.4rem 1.2rem", borderTop: "1px solid #F0F0F0" }}>
                          <p style={{ fontFamily: "'Poppins'", fontSize: "0.83rem", color: "#6B6B6B", lineHeight: 1.7, margin: "0.75rem 0 0" }}>{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* === CTA === */
function CTAPedagogie() {
  return (
    <section style={{ padding: "5rem 0", background: "linear-gradient(135deg,#0A0A0A 0%,#111 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 50% at 50% 50%,rgba(0,212,106,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <motion.div style={{ position: "absolute", top: "-4rem", right: "-4rem", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(200,255,0,0.12) 0%,transparent 70%)", pointerEvents: "none" }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <motion.div style={{ fontSize: "3rem", marginBottom: "1rem", display: "inline-block" }}
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>🦋</motion.div>
          <h2 style={{ fontFamily: "'Poppins'", fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "-0.04em", lineHeight: 1.05, color: "#fff", marginBottom: "0.75rem" }}>
            Prêt à rejoindre<br /><span style={{ color: "#00D46A" }}>l'aventure ?</span>
          </h2>
          <p style={{ fontFamily: "'Nunito'", color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 2.2rem" }}>
            Découvrez nos tarifs et inscrivez votre enfant dans un environnement qui révèle son plein potentiel.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link to="/tarifs" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2.2rem", background: "#00D46A", color: "#0A0A0A", fontFamily: "'Poppins'", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", boxShadow: "0 8px 32px rgba(0,212,106,0.4)", textDecoration: "none" }}>
                ✦ Voir les tarifs
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 2rem", background: "transparent", color: "rgba(255,255,255,0.7)", fontFamily: "'Poppins'", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase", borderRadius: "100px", border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                📍 Nous contacter
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Pedagogie() {
  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <main id="main">
        <PageIntro
          emoji="🦋"
          pageName="Pédagogie"
          heroImage="/images/hero-pedagogie.jpg"
          tagline="Notre approche pédagogique"
          sub="Bilinguisme, arts, sciences et méthodes actives pour révéler chaque enfant"
          accentColor="#00D46A"
          particles={["🌱", "🎨", "🌍", "✏️", "💡", "🔬"]}
          emojiAnim={PageIA.PEDAGOGIE.pageIntroEmoji}
          speed="slow"
        />
        <Hero />
        <PiliersSection />
        <ParcoursSection />
        <Programme3ESection />
        <ActivitesSection />
        <ActivitesShowcaseSection />
        <JourneeTypeSection />
        <InfrastructureSection />
        <EngagementsSection />
        <FAQSection />
        <CTAPedagogie />
      </main>
    </>
  );
}
