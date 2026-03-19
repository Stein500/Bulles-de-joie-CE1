/**
 * Home.jsx — v21 Vivid Edition
 * Design : Luxury African Editorial · Vivid Colors · Spring Physics Icons
 */
import { useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useInView, useCounter } from "../../hooks/useInView";
import { CYCLES, PILLARS, STATS, SCHOOL, IMMERSIONS, GALLERY } from "../../data/content";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { Reveal, StaggerGrid, EASE } from "../../utils/anim";
import * as PageIA from "../../utils/ia";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import PageIntro from "../../components/PageIntro/PageIntro";

const P = PageIA.HOME; // profil Home

// emojiAnim helper — utilise le profil de la page courante
const emojiAnim = (emoji, i = 0) => P.pick(emoji, i);


/* ════ HERO ════ */
function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const txtY   = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const fOut   = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  return (
    <section ref={heroRef} style={{ position:"relative", overflow:"hidden", paddingTop:"var(--nav-h)", minHeight:"96svh", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <motion.div style={{ position:"absolute", inset:"-15% 0 -15% 0", backgroundImage:"url('/images/hero-accueil.jpg')", backgroundSize:"cover", backgroundPosition:"center top", y:bgY, willChange:"transform" }} />
      <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(170deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.48) 40%,rgba(0,0,0,0.9) 100%)" }} />
      <div style={{ position:"absolute", bottom:"-5%", left:"-5%", zIndex:1, width:"50vw", height:"50vw", maxWidth:420, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(243,55,145,0.38) 0%,transparent 70%)", filter:"blur(28px)" }} />
      <div style={{ position:"absolute", top:"5%", right:"-5%", zIndex:1, width:"35vw", height:"35vw", maxWidth:300, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(200,255,0,0.18) 0%,transparent 70%)", filter:"blur(20px)" }} />
      <div style={{ position:"absolute", top:"40%", left:"40%", zIndex:1, width:"25vw", height:"25vw", maxWidth:220, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(124,58,255,0.14) 0%,transparent 70%)", filter:"blur(22px)" }} />
      <motion.div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(to bottom,transparent,#F33791 20%,#F33791 80%,transparent)", zIndex:4, transformOrigin:"top" }} initial={{scaleY:0}} animate={{scaleY:1}} transition={{duration:0.8,delay:0.05,ease:[0.15,0.85,0.4,1]}} />
      <motion.div style={{ position:"relative", zIndex:3, y:txtY, opacity:fOut }}>
        <div className="container" style={{ paddingBottom:"4rem", paddingTop:"2.5rem" }}>
          <motion.div style={{ display:"inline-flex", alignItems:"center", gap:"0.55rem", fontFamily:"'Poppins'", fontSize:"0.56rem", fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:"1.1rem" }} initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{delay:0.12,duration:0.5,ease:EASE.out}}>
            <motion.span style={{display:"inline-block",height:"1.5px",background:"#C8FF00",flexShrink:0}} initial={{width:0}} animate={{width:24}} transition={{delay:0.35,duration:0.5,ease:EASE.out}} />
            Excellence · Bilingue · Zongo 2, Parakou · Bénin
          </motion.div>

          {/* 🟢 Live pill inscriptions */}
          <motion.div
            style={{ display:"inline-flex", alignItems:"center", gap:"0.45rem", background:"rgba(200,255,0,0.15)", border:"1px solid rgba(200,255,0,0.4)", borderRadius:100, padding:"0.32rem 1rem 0.32rem 0.65rem", marginBottom:"1rem" }}
            initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:0.08,duration:0.45,ease:EASE.out}}
          >
            <motion.span style={{width:7,height:7,borderRadius:"50%",background:"#C8FF00",flexShrink:0,boxShadow:"0 0 8px #C8FF00"}}
              animate={{opacity:[1,0.3,1]}} transition={{duration:1.6,repeat:Infinity}} />
            <span style={{fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.58rem",letterSpacing:"0.1em",color:"#C8FF00",textTransform:"uppercase"}}>Inscriptions 2026-2027 ouvertes</span>
          </motion.div>
          <motion.div style={{ fontFamily:"'Poppins'", fontWeight:900, fontSize:"clamp(3.2rem,13vw,8rem)", letterSpacing:"-0.05em", lineHeight:0.88, color:"#fff", marginBottom:"0.15rem", overflow:"hidden" }} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.22,duration:0.7,ease:EASE.out}}>
            Les Bulles
          </motion.div>
          <motion.div style={{ fontFamily:"'Poppins'", fontWeight:900, fontSize:"clamp(3.2rem,13vw,8rem)", letterSpacing:"-0.05em", lineHeight:0.88, marginBottom:"1.4rem", overflow:"hidden", display:"flex", gap:"0.22em" }} initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{delay:0.32,duration:0.7,ease:EASE.out}}>
            <span style={{color:"#fff"}}>de</span>
            <span style={{color:"#F33791",textShadow:"0 0 40px rgba(243,55,145,0.95),0 0 90px rgba(243,55,145,0.5),0 0 160px rgba(243,55,145,0.25)"}}>Joie</span>
          </motion.div>
          <motion.p style={{ fontFamily:"'Nunito'", fontSize:"clamp(0.92rem,2.5vw,1.1rem)", color:"rgba(255,255,255,0.7)", maxWidth:440, lineHeight:1.72, marginBottom:"2.2rem" }} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.46,duration:0.55,ease:EASE.out}}>
            Crèche, Maternelle & Primaire bilingue d'excellence à Parakou.{" "}
            <span style={{color:"rgba(255,255,255,0.92)",fontWeight:700}}>Amour · Travail · Rigueur · Créativité.</span>
          </motion.p>
          <motion.div style={{ display:"flex", gap:"0.85rem", flexWrap:"wrap", marginBottom:"3rem" }} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.58,ease:EASE.out}}>
            <Link to="/tarifs" className="v19-btn-primary">✦ Inscrire mon enfant</Link>
            <Link to="/pedagogie" className="v19-btn-outline">Notre pédagogie →</Link>
          </motion.div>
          <motion.div style={{ display:"flex", gap:0, flexWrap:"wrap", paddingTop:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.1)" }} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}>
            {[["8+","Ans d'excellence","#F33791"],["100+","Élèves épanouis","#C8FF00"],["2","Agréments officiels","#fff"]].map(([v,l,c],i)=>(
              <motion.div key={v} style={{ display:"flex", flexDirection:"column", gap:"0.12rem", paddingRight:"1.8rem", marginRight:"1.8rem", borderRight:i<2?"1px solid rgba(255,255,255,0.12)":"none" }} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.74+i*0.08}}>
                <span style={{fontFamily:"'Poppins'",fontWeight:900,fontSize:"1.5rem",letterSpacing:"-0.04em",color:c,lineHeight:1}}>{v}</span>
                <span style={{fontFamily:"'Nunito'",fontSize:"0.6rem",color:"rgba(255,255,255,0.42)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <motion.div style={{ position:"absolute", bottom:"1.5rem", right:"1.75rem", zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem" }} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}}>
        <motion.div style={{width:1,height:40,background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.4))",borderRadius:1}} animate={{scaleY:[0,1,1,0],opacity:[0,1,1,0]}} transition={{duration:2,repeat:Infinity,repeatDelay:0.5,originY:0}} />
        <span style={{fontFamily:"'Poppins'",fontSize:"0.46rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",writingMode:"vertical-rl"}}>Scroll</span>
      </motion.div>
    </section>
  );
}

/* ════ MARQUEE ════ */
function MarqueeStrip() {
  const row1 = ["Bilingue","Excellence","Parakou","Bienveillance","Créativité","Rigueur","Agréé","100+ Élèves","8 ans"];
  const row2 = ["Crèche","Maternelle","Primaire","Anglais","Arts","Musique","Jardinage","Danse","Éloquence"];
  const R1=[...row1,...row1], R2=[...row2,...row2];
  return (
    <div style={{background:"#080808",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",overflow:"hidden",padding:"0"}}>
      {/* Row 1 — gauche */}
      <div style={{overflow:"hidden",padding:"0.65rem 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{display:"flex",gap:0,whiteSpace:"nowrap",animation:"marqueeScroll 20s linear infinite",willChange:"transform"}}
          onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
          onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}
        >
          {R1.map((item,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:"1.1rem",padding:"0 1.8rem",fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.58rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.32)"}}>
              <span style={{width:4,height:4,borderRadius:"50%",background:i%3===1?"#C8FF00":"#F33791",flexShrink:0,boxShadow:i%3===1?"0 0 6px #C8FF00":"0 0 6px #F33791"}} />
              {item}
            </span>
          ))}
        </div>
      </div>
      {/* Row 2 — droite (inversé) */}
      <div style={{overflow:"hidden",padding:"0.65rem 0"}}>
        <div style={{display:"flex",gap:0,whiteSpace:"nowrap",animation:"marqueeScrollRev 24s linear infinite",willChange:"transform"}}
          onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
          onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}
        >
          {R2.map((item,i)=>{
            const dotColor=i%4===0?"#FF6B35":i%4===1?"#7C3AFF":i%4===2?"#00D46A":"#00B4D8";
            const dotGlow=i%4===0?"0 0 5px #FF6B35":i%4===1?"0 0 5px #7C3AFF":i%4===2?"0 0 5px #00D46A":"0 0 5px #00B4D8";
            return(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:"1.1rem",padding:"0 1.8rem",fontFamily:"'Poppins'",fontWeight:600,fontSize:"0.54rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.22)"}}>
              <span style={{width:3,height:3,borderRadius:"50%",background:dotColor,flexShrink:0,boxShadow:dotGlow}} />
              {item}
            </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════ BANNER ════ */
function InscriptionBanner() {
  return (
    <div style={{background:"linear-gradient(105deg,#C8FF00 0%,#ADFF00 40%,#C8FF00 100%)",padding:"1rem var(--side-pad)",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.85rem",flexWrap:"wrap",position:"relative",overflow:"hidden"}}>
      <motion.div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.42) 50%,transparent 65%)",pointerEvents:"none"}}
        animate={{x:["-100%","200%"]}}
        transition={{duration:2.8,repeat:Infinity,repeatDelay:3.5,ease:"easeInOut"}}
      />
      {/* Orbes décoration */}
      <div style={{position:"absolute",left:"-1rem",top:"50%",transform:"translateY(-50%)",width:64,height:64,borderRadius:"50%",background:"rgba(0,0,0,0.06)",pointerEvents:"none"}} />
      <div style={{position:"absolute",right:"12%",top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,0.04)",pointerEvents:"none"}} />
      <motion.span style={{fontSize:"1.1rem"}} animate={{rotate:[0,15,-10,8,0],scale:[1,1.18,0.92,1.1,1]}} transition={{duration:2.2,repeat:Infinity,repeatDelay:1.8}}>🎒</motion.span>
      <div style={{display:"flex",flexDirection:"column",gap:"0.05rem"}}>
        <span style={{fontFamily:"'Poppins'",fontWeight:800,fontSize:"0.82rem",color:"#0A0A0A",letterSpacing:"-0.01em",lineHeight:1.2}}>Inscriptions 2026-2027 ouvertes</span>
        <span style={{fontFamily:"'Nunito'",fontSize:"0.72rem",color:"rgba(0,0,0,0.55)",fontWeight:600}}>Anticipez la rentrée · Places limitées !</span>
      </div>
      <motion.div whileTap={{scale:0.95}} whileHover={{scale:1.06,y:-1}}>
        <Link to="/tarifs" style={{background:"#0A0A0A",color:"#C8FF00",fontFamily:"'Poppins'",fontWeight:800,fontSize:"0.7rem",padding:"0.48rem 1.3rem",borderRadius:"100px",letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",gap:"0.35rem",boxShadow:"0 4px 16px rgba(0,0,0,0.25)"}}>
          Pré-inscrire <span style={{fontSize:"0.75em"}}>→</span>
        </Link>
      </motion.div>
    </div>
  );
}

/* ════ CYCLES ════ */
const CYCLE_BG = ["#FFF0F7","#F5FFF0","#F0F0FF"]; // tints doux par cycle
function CycleCard({c,idx}){
  const [hov,setHov]=useState(false);
  const AC={pink:"#F33791",lime:"#00D46A",black:"#6C3FFF"}[c.color]??"#F33791";
  /* FIX BUG : "#004D25" (vert très sombre) sur chip blanc-vert → contraste insuffisant
     Correction : "#0A0A0A" lisible sur fond rgba(255,255,255,0.18) quelle que soit la couleur */
  const TA=c.color==="lime"?"#0A0A0A":"#fff";
  const bg=CYCLE_BG[idx]??CYCLE_BG[0];
  const ia=emojiAnim(c.emoji, idx);
  return(
    <motion.article
      style={{padding:"2rem 1.75rem",position:"relative",overflow:"hidden",background:hov?AC:bg,borderRadius:16,border:`2px solid ${hov?"transparent":AC+"40"}`,cursor:"default"}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      whileHover={{y:-10,boxShadow:`0 28px 64px ${AC}35`}}
      transition={{type:"spring",stiffness:300,damping:22}}
    >
      <motion.div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${AC},${AC}88)`,borderRadius:"16px 16px 0 0"}} />
      <div style={{position:"absolute",top:"0.6rem",right:"0.9rem",fontFamily:"'Poppins'",fontWeight:900,fontSize:"4.5rem",color:"transparent",WebkitTextStroke:`1px ${AC}18`,lineHeight:1,pointerEvents:"none"}}>{String(idx+1).padStart(2,"0")}</div>
      <motion.span
        style={{fontSize:"2.4rem",display:"block",marginBottom:"0.85rem",transformOrigin:"center",cursor:"default"}}
        animate={ia.animate}
        transition={ia.transition}
        whileHover={{...P.hover, transition: P.hoverTransition}}
        whileTap={{scale:0.88}}
      >{c.emoji}</motion.span>
      <span style={{fontFamily:"'Poppins'",fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:hov?TA:AC,background:hov?"rgba(255,255,255,0.18)":`${AC}18`,padding:"0.18rem 0.7rem",borderRadius:99,display:"inline-block",marginBottom:"0.6rem"}}>{c.age}</span>
      <h3 style={{fontFamily:"'Poppins'",fontWeight:800,fontSize:"1.08rem",letterSpacing:"-0.02em",marginBottom:"0.5rem",color:hov?"#fff":"#0A0A0A",transition:"color 0.22s"}}>{c.title}</h3>
      <p style={{fontFamily:"'Nunito'",fontSize:"0.86rem",lineHeight:1.65,color:hov?"rgba(255,255,255,0.82)":"#555",transition:"color 0.22s"}}>{c.desc}</p>
    </motion.article>
  );
}
function CyclesSection(){
  return(
    <section style={{padding:"6rem 0",background:"#fff"}}>
      <div className="container">
        <SectionTitle label="Nos cycles" title={<>De la <span style={{color:"#F33791"}}>crèche</span> au primaire</>} description="Un parcours complet et cohérent — de 3 mois à 12 ans, sous le même toit bienveillant." align="center" num="01" style={{marginBottom:"3rem"}} />
        <StaggerGrid columns="repeat(auto-fit,minmax(240px,1fr))" gap="1.25rem" stagger={0.1}>
          {CYCLES.map((c,i)=><CycleCard key={c.title} c={c} idx={i} />)}
        </StaggerGrid>
        <Reveal delay={0.3} style={{textAlign:"center",marginTop:"2rem"}}>
          <Link to="/tarifs" style={{fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.76rem",color:"#F33791",letterSpacing:"0.04em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:"0.35rem"}}>Voir les tarifs →</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ════ STATS ════ */
const StatCell=memo(function StatCell({st,idx}){
  const[ref,inView]=useInView({threshold:0.5});
  const count=useCounter(st.value,inView,1800);
  const colors=["#F33791","#C8FF00","#FF6B35","rgba(255,255,255,0.75)"];
  const glows=["rgba(243,55,145,0.6)","rgba(200,255,0,0.5)","rgba(255,107,53,0.55)","rgba(255,255,255,0.2)"];
  const accents=["#F33791","#C8FF00","#FF6B35","rgba(255,255,255,0.6)"];
  const c=colors[idx]??colors[0];
  const g=glows[idx]??glows[0];
  const ac=accents[idx]??accents[0];
  const CELE={ y:[0,-22,6,-12,3,0], rotate:[0,-18,14,-10,6,0], scale:[1,1.4,0.82,1.22,0.94,1] };
  const IDLE={ y:[0,-5,0], scale:[1,1.09,1] };
  return(
    <motion.div ref={ref}
      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.35rem",
        padding:"3rem 1rem",position:"relative",overflow:"hidden",
        borderRight:idx%2===0?"1px solid rgba(255,255,255,0.07)":"none",
        borderBottom:idx<2?"1px solid rgba(255,255,255,0.07)":"none"}}
      initial={{opacity:0,y:28}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.65,delay:idx*0.12}}
    >
      {/* Fond radial coloré discret */}
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 55% at 50% 100%,${g}08 0%,transparent 80%)`,pointerEvents:"none"}} />

      {/* Scanline qui révèle le chiffre */}
      {inView && (
        <motion.div style={{
          position:"absolute",left:0,right:0,height:2,
          background:`linear-gradient(90deg, transparent, ${ac}, transparent)`,
          top:"35%",pointerEvents:"none",zIndex:2,
        }}
          initial={{scaleX:0,opacity:0}}
          animate={{y:[0,-80],opacity:[0,0.8,0]}}
          transition={{duration:1.1,delay:0.15+idx*0.15,ease:[0.25,0.46,0.45,0.94]}}
        />
      )}

      {/* Numéro */}
      <motion.div
        style={{fontFamily:"'Poppins'",fontWeight:900,fontSize:"clamp(3rem,11vw,5.5rem)",letterSpacing:"-0.06em",lineHeight:1,color:c,position:"relative",zIndex:1}}
        animate={inView?{textShadow:[`0 0 24px ${g}40`,`0 0 90px ${g}`,`0 0 24px ${g}40`]}:{textShadow:"none"}}
        transition={{duration:2.8,repeat:Infinity,delay:idx*0.55,repeatType:"mirror"}}
      >{count}{st.suffix}</motion.div>

      {/* Emoji célébration + idle */}
      <motion.span style={{fontSize:"1.5rem",display:"block"}}
        animate={inView ? CELE : {}}
        transition={inView ? {duration:0.85,delay:0.28+idx*0.18,ease:[0.34,1.56,0.64,1]} : {}}
      >
        <motion.span style={{display:"inline-block"}}
          animate={inView ? IDLE : {}}
          transition={{duration:3.2+idx*0.4,repeat:Infinity,ease:"easeInOut",delay:1.2+idx*0.6}}
        >{st.emoji}</motion.span>
      </motion.span>

      {/* Label */}
      <div style={{fontFamily:"'Nunito'",fontSize:"0.6rem",color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.14em",textAlign:"center",maxWidth:"90px",fontWeight:600}}>{st.label}</div>

      {/* Accent line bas */}
      {inView && (
        <motion.div style={{width:28,height:1.5,borderRadius:2,background:ac,marginTop:"0.2rem"}}
          initial={{scaleX:0}} animate={{scaleX:1}}
          transition={{duration:0.5,delay:0.6+idx*0.12,ease:[0.15,0.85,0.4,1]}}
        />
      )}
    </motion.div>
  );
});

function StatsSection(){
  return(
    <section style={{background:"#080808",position:"relative",overflow:"hidden"}}>
      {/* Fond ambient multi-couleur */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 55% at 50% 100%,rgba(243,55,145,0.1) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"20%",left:"-5%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(255,107,53,0.08) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"15%",right:"-5%",width:180,height:180,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(200,255,0,0.07) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:"20%",left:"40%",width:140,height:140,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(124,58,255,0.06) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div className="container" style={{position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",borderRadius:20,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"}}>
          {STATS.map((st,i)=><StatCell key={st.label} st={st} idx={i} />)}
        </div>
        <Reveal delay={0.3}>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"0.9rem 0",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.85rem"}}>
            <div style={{width:18,height:1,background:"rgba(243,55,145,0.35)",borderRadius:1}} />
            <span style={{fontFamily:"'Poppins'",fontSize:"0.5rem",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase"}}>Depuis 2017 · Zongo 2, Parakou, Bénin</span>
            <div style={{width:18,height:1,background:"rgba(200,255,0,0.35)",borderRadius:1}} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════ PILIERS ════ */
// Palette vivide : rose · lime électrique · violet · or
const PS=[
  {bg:"#F33791",txt:"#fff",glow:"rgba(243,55,145,0.5)"},
  {bg:"#C8FF00",txt:"#0A0A0A",glow:"rgba(200,255,0,0.45)"},
  {bg:"#7C3AFF",txt:"#fff",glow:"rgba(124,58,255,0.5)"},
  {bg:"#FF6B35",txt:"#fff",glow:"rgba(255,107,53,0.5)"},
];
const PillarCard=memo(function PillarCard({p,i}){
  const[hov,setHov]=useState(false);
  const s=PS[i%4];
  const ia=emojiAnim(p.emoji, i);
  return(
    <motion.div
      style={{background:hov?s.bg:"rgba(255,255,255,0.05)",border:`1.5px solid ${hov?"transparent":"rgba(255,255,255,0.1)"}`,borderRadius:14,padding:"1.75rem",position:"relative",overflow:"hidden",cursor:"default"}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      whileHover={{y:-8,boxShadow:`0 24px 60px ${s.glow}`}}
      transition={{type:"spring",stiffness:320,damping:24}}
    >
      {/* FIX BUG: AnimatePresence requis pour que exit={{opacity:0}} fonctionne */}
      <AnimatePresence>
        {hov && <motion.div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 30% 30%,rgba(255,255,255,0.18) 0%,transparent 65%)`,pointerEvents:"none"}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.22}} />}
      </AnimatePresence>
      <motion.span
        style={{fontSize:"2.1rem",display:"block",marginBottom:"0.65rem",transformOrigin:"center"}}
        animate={ia.animate}
        transition={ia.transition}
        whileHover={{...P.hover, transition: P.hoverTransition}}
      >{p.emoji}</motion.span>
      <h3 style={{fontFamily:"'Poppins'",fontWeight:800,fontSize:"1.05rem",letterSpacing:"-0.02em",marginBottom:"0.4rem",color:hov?s.txt:"#fff",transition:"color 0.22s"}}>{p.title}</h3>
      <p style={{fontFamily:"'Nunito'",fontSize:"0.84rem",lineHeight:1.65,color:hov?(s.txt==="#0A0A0A"?"rgba(0,0,0,0.7)":"rgba(255,255,255,0.8)"):"rgba(255,255,255,0.52)",transition:"color 0.22s"}}>{p.desc}</p>
      <div style={{position:"absolute",bottom:"0.5rem",right:"0.75rem",fontFamily:"'Poppins'",fontWeight:900,fontSize:"3.8rem",color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.07)",lineHeight:1,pointerEvents:"none"}}>{String(i+1).padStart(2,"0")}</div>
    </motion.div>
  );
});
function PillarsSection(){
  return(
    <section style={{padding:"6rem 0",background:"#0A0A0A",position:"relative",overflow:"hidden"}}>
      {/* Ambient glow multi-couleur */}
      <div style={{position:"absolute",top:"-6rem",left:"-4rem",width:300,height:300,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(243,55,145,0.12) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:"-4rem",right:"-4rem",width:280,height:280,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(200,255,0,0.08) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"70vw",height:"30vw",maxWidth:500,background:"radial-gradient(ellipse,rgba(124,58,255,0.06) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div className="container" style={{position:"relative",zIndex:1}}>
        <SectionTitle label="Notre philosophie" title={<>Les <span style={{color:"#F33791"}}>4 Piliers</span> de notre école</>} description="Quatre valeurs fondamentales qui guident chaque moment de vie — chaque jour, pour chaque enfant." dark num="02" style={{marginBottom:"3rem"}} />
        <StaggerGrid columns="repeat(2,1fr)" gap="1rem" stagger={0.09}>
          {PILLARS.map((p,i)=><PillarCard key={p.title} p={p} i={i} />)}
        </StaggerGrid>
      </div>
    </section>
  );
}

/* ════ VIDEO ════ */
function VideoSection(){
  return(
    <section className="v19-dark" style={{padding:"6rem 0",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-6rem",right:"-6rem",width:280,height:280,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(243,55,145,0.15) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div className="container">
        <SectionTitle label="L'école en images" title={<>Notre <span style={{color:"#F33791"}}>école</span> en vidéo</>} align="center" dark num="03" style={{marginBottom:"2.5rem"}} />
        <Reveal delay={0.1}>
          {/* Wrapper avec marge horizontale supplémentaire sur mobile */}
          <div style={{
            marginLeft: "clamp(0px, 2vw, 1rem)",
            marginRight: "clamp(0px, 2vw, 1rem)",
          }}>
            <VideoPlayer src="/videos/presentation.mp4" poster="/images/video-poster.jpg" title="Présentation de l'école" subtitle="Les Bulles de Joie · Parakou, Bénin" emoji="🎬" accentColor="#F33791" variant="hero" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════ ACTIVITÉS ════ */
const IMM_SCHEMES=[
  {bg:"#F33791",txt:"#fff",   size:"large", glow:"rgba(243,55,145,0.5)"},
  {bg:"#0A0A0A",txt:"#C8FF00",size:"small", glow:"rgba(200,255,0,0.4)"},
  {bg:"#C8FF00",txt:"#0A0A0A",size:"small", glow:"rgba(200,255,0,0.5)"},
  {bg:"#7C3AFF",txt:"#fff",   size:"small", glow:"rgba(124,58,255,0.5)"},
  {bg:"#FF6B35",txt:"#fff",   size:"small", glow:"rgba(255,107,53,0.5)"},
  {bg:"#0A0A0A",txt:"#F33791",size:"small", glow:"rgba(243,55,145,0.4)"},
];
function ImmCard({im,i,inView}){
  const[hov,setHov]=useState(false);
  const sc=IMM_SCHEMES[i];
  const ia=emojiAnim(im.emoji, i);
  const isLarge=sc.size==="large";
  return(
    <motion.div
      className={isLarge ? "imm-large" : undefined}
      style={{
        padding:isLarge?"2rem 1.75rem":"1.5rem 1.4rem",
        background:sc.bg,borderRadius:12,cursor:"default",
        position:"relative",overflow:"hidden",
        gridColumn:isLarge?"span 2":"span 1",
        minHeight:isLarge?180:140,
        display:"flex",flexDirection:"column",
      }}
      initial={{opacity:0,y:20,scale:0.97}}
      animate={inView?{opacity:1,y:0,scale:1}:{}}
      transition={{duration:0.5,delay:i*0.08,ease:EASE.out}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      whileHover={{scale:1.025,zIndex:2}}
    >
      {/* Glow coin */}
      <motion.div style={{position:"absolute",bottom:-35,right:-35,width:130,height:130,borderRadius:"50%",background:`radial-gradient(ellipse,${sc.glow} 0%,transparent 70%)`,pointerEvents:"none"}}
        animate={{scale:hov?1.7:1,opacity:hov?1:0.5}} transition={{duration:0.4}} />

      <div style={{display:"flex",alignItems:isLarge?"center":"flex-start",gap:"0.85rem",flex:1}}>
        <motion.span style={{fontSize:isLarge?"2.4rem":"2rem",display:"inline-block",transformOrigin:"center",flexShrink:0}}
          animate={ia.animate} transition={ia.transition}
          whileHover={{...P.hover, transition: P.hoverTransition}}
        >{im.emoji}</motion.span>

        <div style={{flex:1}}>
          {/* Badge */}
          <span style={{
            display:"inline-block",padding:"0.2rem 0.7rem",borderRadius:20,
            fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.54rem",
            letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem",
            background:"rgba(255,255,255,0.12)",
            color:sc.txt,border:"1px solid rgba(255,255,255,0.18)",
          }}>{im.badge}</span>

          <h3 style={{fontFamily:"'Poppins'",fontWeight:800,fontSize:isLarge?"1.1rem":"0.9rem",letterSpacing:"-0.02em",color:sc.txt,marginBottom:"0.2rem",lineHeight:1.2}}>{im.title}</h3>
          {isLarge&&<p style={{fontFamily:"'Nunito'",fontSize:"0.82rem",lineHeight:1.65,color:sc.txt,opacity:0.72,margin:0,maxWidth:320}}>{im.desc}</p>}
        </div>
      </div>

      {/* Accent bottom line */}
      <motion.div style={{position:"absolute",bottom:0,left:0,height:2.5,background:"rgba(255,255,255,0.22)",borderRadius:"0 2px 0 0"}}
        initial={{width:0}} animate={inView?{width:"50%"}:{}}
        transition={{duration:0.75,delay:0.5+i*0.08,ease:[0.15,0.85,0.4,1]}} />
    </motion.div>
  );
}
function ImmersionsSection(){
  const[ref,inView]=useInView({threshold:0.05});
  return(
    <section style={{padding:"6rem 0",background:"#FAFAFA"}}>
      <div className="container">
        <SectionTitle label="Activités parascolaires" title={<>Des expériences <span style={{color:"#F33791"}}>enrichissantes</span></>} description="Sport, arts, musique, théâtre — pour révéler les talents et nourrir la curiosité de chaque enfant." num="04" style={{marginBottom:"3rem"}} />
        <div ref={ref} style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.65rem"}}>
          {IMMERSIONS.map((im,i)=><ImmCard key={im.title} im={im} i={i} inView={inView} />)}
        </div>
        <Reveal delay={0.2} style={{textAlign:"right",marginTop:"1.5rem"}}>
          <Link to="/pedagogie" style={{fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.72rem",color:"#F33791",letterSpacing:"0.04em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:"0.3rem"}}>Toute la pédagogie →</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ════ GALERIE ════ */
function GallerySection(){
  const[ref,inView]=useInView({threshold:0.05});
  const[activeIdx,setActiveIdx]=useState(null);
  return(
    <section className="v19-dark-mid" style={{padding:"6rem 0",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:"-4rem",left:"50%",transform:"translateX(-50%)",width:"70vw",height:"35vw",maxWidth:600,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(200,255,0,0.07) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div className="container">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"1.75rem",flexWrap:"wrap",gap:"0.75rem"}}>
          <SectionTitle label="Notre galerie" title={<>L'école en <span style={{color:"#C8FF00"}}>images</span></>} dark num="05" style={{marginBottom:0}} />
          <Link to="/pedagogie" style={{fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",letterSpacing:"0.04em",textTransform:"uppercase"}}>Voir plus →</Link>
        </div>
        {/* Mosaïque : image 0 grande à gauche, 1-3 en grille à droite */}
        <div ref={ref} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto auto",gap:"0.6rem",borderRadius:16,overflow:"hidden"}}>
          {/* Image featured — span 2 rows */}
          <motion.div style={{position:"relative",gridRow:"1 / 3",overflow:"hidden",background:"#1A1A1A",cursor:"pointer",minHeight:260}} initial={{opacity:0,scale:0.96}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:0.55}} whileHover={{scale:1.01,zIndex:2}} onHoverStart={()=>setActiveIdx(0)} onHoverEnd={()=>setActiveIdx(null)}>
            <motion.img src={GALLERY[0].src} alt={GALLERY[0].label} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",position:"absolute",inset:0}} animate={{scale:activeIdx===0?1.07:1}} transition={{duration:0.6}} />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 55%)"}} />
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1rem"}}>
              <span style={{fontSize:"1.1rem",display:"block",marginBottom:"0.2rem"}}>{GALLERY[0].emoji}</span>
              <span style={{fontFamily:"'Poppins'",fontWeight:800,fontSize:"0.82rem",color:"#fff"}}>{GALLERY[0].label}</span>
              <AnimatePresence>{activeIdx===0&&<motion.div style={{marginTop:"0.3rem",fontFamily:"'Poppins'",fontSize:"0.58rem",color:"#C8FF00",letterSpacing:"0.1em",textTransform:"uppercase"}} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}>★ À la une</motion.div>}</AnimatePresence>
            </div>
          </motion.div>
          {/* Images 1-3 en grille */}
          {GALLERY.slice(1).map((g,i)=>(
            <motion.div key={g.src} style={{position:"relative",aspectRatio:"16/9",overflow:"hidden",background:"#1A1A1A",cursor:"pointer"}} initial={{opacity:0,x:16}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.5,delay:0.1+i*0.1}} whileHover={{scale:1.02,zIndex:2}} onHoverStart={()=>setActiveIdx(i+1)} onHoverEnd={()=>setActiveIdx(null)}>
              <motion.img src={g.src} alt={g.label} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} animate={{scale:activeIdx===i+1?1.09:1}} transition={{duration:0.55}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)"}} />
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0.6rem 0.75rem",display:"flex",alignItems:"center",gap:"0.35rem"}}>
                <span style={{fontSize:"0.8rem"}}>{g.emoji}</span>
                <span style={{fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.66rem",color:"#fff"}}>{g.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <Reveal delay={0.3} style={{textAlign:"center",marginTop:"2rem"}}>
          <Link to="/pedagogie" className="v19-btn-primary" style={{textDecoration:"none"}}>📸 Voir toutes les photos</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ════ CTA FINAL ════ */
function CTAFinalSection(){
  return(
    <motion.section style={{padding:"5.5rem 0",background:"linear-gradient(135deg,#F33791 0%,#FF6B35 50%,#F33791 100%)",backgroundSize:"200% 200%",position:"relative",overflow:"hidden"}}
      animate={{backgroundPosition:["0% 50%","100% 50%","0% 50%"]}}
      transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}
    >
      {/* Orbes animés */}
      <motion.div style={{position:"absolute",top:"-5rem",right:"-5rem",width:260,height:260,borderRadius:"50%",background:"rgba(200,255,0,0.22)",pointerEvents:"none"}}
        animate={{scale:[1,1.14,1],rotate:[0,12,0]}} transition={{duration:7,repeat:Infinity,ease:"easeInOut"}} />
      <motion.div style={{position:"absolute",bottom:"-4rem",left:"-4rem",width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.12)",pointerEvents:"none"}}
        animate={{scale:[1,1.2,1]}} transition={{duration:5.5,repeat:Infinity,ease:"easeInOut",delay:1.2}} />
      <motion.div style={{position:"absolute",top:"40%",left:"40%",width:120,height:120,borderRadius:"50%",background:"rgba(124,58,255,0.2)",pointerEvents:"none"}}
        animate={{scale:[1,1.35,1],opacity:[0.3,0.6,0.3]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut",delay:0.5}} />
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(0,0,0,0.1) 0%,transparent 50%,rgba(200,255,0,0.06) 100%)",pointerEvents:"none"}} />

      <div className="container" style={{position:"relative",zIndex:1,textAlign:"center"}}>
        <Reveal>
          <motion.div style={{fontSize:"3rem",marginBottom:"1.25rem",display:"inline-block"}}
            {...P.pick("🎒", 0)}
          >🎒</motion.div>
          <h2 style={{fontFamily:"'Poppins'",fontWeight:900,fontSize:"clamp(2rem,6vw,3.8rem)",letterSpacing:"-0.04em",lineHeight:1.05,color:"#fff",marginBottom:"0.75rem",textShadow:"0 4px 24px rgba(0,0,0,0.15)"}}>
            Offrez le meilleur<br/>à votre enfant
          </h2>
          <p style={{fontFamily:"'Nunito'",fontSize:"clamp(0.95rem,2.2vw,1.08rem)",color:"rgba(255,255,255,0.9)",lineHeight:1.7,maxWidth:500,margin:"0 auto 2rem"}}>
            Rejoignez les familles qui font confiance aux Bulles de Joie. Places limitées — inscrivez votre enfant dès aujourd'hui.
          </p>

          {/* Badges */}
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"0.55rem",marginBottom:"2.5rem"}}>
            {["✅ Agréé MASM 2021","✅ Agréé MEMP 2022","🎓 Bilingue Fr/En","❤️ Bienveillant","📍 Parakou"].map((b,i)=>(
              <motion.span key={b}
                style={{background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.35)",padding:"0.35rem 1rem",fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.62rem",color:"#fff",letterSpacing:"0.04em",borderRadius:"100px",backdropFilter:"blur(8px)"}}
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.07}}
                whileHover={{scale:1.06,background:"rgba(255,255,255,0.3)"}}
              >{b}</motion.span>
            ))}
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:"0.9rem",justifyContent:"center"}}>
            <motion.div whileHover={{scale:1.06,y:-3}} whileTap={{scale:0.96}} transition={{type:"spring",stiffness:400,damping:18}}>
              <Link to="/tarifs" style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"1.1rem 2.4rem",background:"#fff",color:"#F33791",fontFamily:"'Poppins'",fontWeight:800,fontSize:"0.84rem",letterSpacing:"0.02em",textTransform:"uppercase",borderRadius:"100px",boxShadow:"0 10px 40px rgba(0,0,0,0.22)",textDecoration:"none"}}>
                ✦ Inscrire mon enfant
              </Link>
            </motion.div>
            <motion.a
              href={`https://wa.me/${SCHOOL.whatsappRaw}?text=Bonjour, je voudrais des informations sur les inscriptions`}
              target="_blank" rel="noopener"
              style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"1.1rem 2rem",background:"rgba(255,255,255,0.18)",color:"#fff",fontFamily:"'Poppins'",fontWeight:700,fontSize:"0.8rem",letterSpacing:"0.04em",textTransform:"uppercase",borderRadius:"100px",border:"2px solid rgba(255,255,255,0.4)",textDecoration:"none"}}
              whileHover={{background:"rgba(255,255,255,0.28)",y:-3}} whileTap={{scale:0.97}}
              transition={{type:"spring",stiffness:400,damping:18}}
            >
              💬 Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </div>
    </motion.section>
  );
}

export default function Home(){
  return(
    <>
      <PageIntro
        emoji="✨"
        pageName="Accueil"
        heroImage="/images/hero-accueil.jpg"
        tagline="Bienvenue aux Bulles de Joie"
        sub="Crèche, Maternelle & Primaire bilingue d'excellence à Parakou, Bénin"
        accentColor="#F33791"
        particles={["🌟","🎨","📚","🏆","🦋","🎒"]}
        emojiAnim={PageIA.HOME.pageIntroEmoji}
      />
      <a href="#main" className="skip-link">Aller au contenu</a>
      <main id="main">
        <Hero />
        <MarqueeStrip />
        <InscriptionBanner />
        <CyclesSection />
        <StatsSection />
        <PillarsSection />
        <VideoSection />
        <ImmersionsSection />
        <GallerySection />
        <CTAFinalSection />
      </main>
    </>
  );
}
