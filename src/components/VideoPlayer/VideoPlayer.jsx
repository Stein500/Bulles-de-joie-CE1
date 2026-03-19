/**
 * VideoPlayer.jsx — Lecteur vidéo universel, responsive & adaptatif
 * ─────────────────────────────────────────────────────────────────
 * CORRECTIONS v18 :
 *  • Le ratio est appliqué sur le CONTENEUR (pas sur <video>)
 *  • La vidéo occupe tout le conteneur via position:absolute + object-fit:contain
 *  • La durée écoute durationchange + loadedmetadata + timeupdate (triple sécurité)
 *  • Fonctionne en mode "card" (grille) et "hero" (pleine largeur)
 *  • Icônes de navigation : stables, pas de rotation/saut
 */

import { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Formatage mm:ss ─── */
const fmtTime = (s) => {
  if (!s || !isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/* ─── Icônes SVG inline ─── */
const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);
const IconPause = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1.5" />
    <rect x="14" y="4" width="4" height="16" rx="1.5" />
  </svg>
);
const IconMuted = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const IconVolLow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
  </svg>
);
const IconVolHigh = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const IconFS = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);
const IconExitFS = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   VideoPlayer
   Props :
     src          {string}  — chemin vidéo
     poster       {string}  — aperçu (optionnel)
     title        {string}  — titre affiché (optionnel)
     subtitle     {string}  — sous-titre / durée (optionnel)
     emoji        {string}  — emoji déco (défaut "🎬")
     accentColor  {string}  — couleur accent (défaut "#F33791")
     variant      {string}  — "card" | "hero" (défaut "card")
     defaultRatio {string}  — ratio CSS fallback (défaut "16/9")
   ══════════════════════════════════════════════════════════════ */
const VideoPlayer = memo(function VideoPlayer({
  src,
  poster,
  title,
  subtitle,
  emoji        = "🎬",
  accentColor  = "#F33791",
  variant      = "card",
  defaultRatio = "16/9",
}) {
  const [playing,      setPlaying]      = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [muted,        setMuted]        = useState(false);
  const [fullscreen,   setFullscreen]   = useState(false);
  const [showCtrl,     setShowCtrl]     = useState(true);
  const [buffered,     setBuffered]     = useState(0);
  const [hovered,      setHovered]      = useState(false);
  /* ── ratio sur le CONTENEUR — c'est ici que ça se passe ── */
  const [containerRatio, setContainerRatio] = useState(defaultRatio);

  const videoRef     = useRef(null);
  const containerRef = useRef(null);
  const hideTimer    = useRef(null);

  /* ── Nettoyage ── */
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  /* ── Écoute fullscreenchange natif ── */
  useEffect(() => {
    const onFS = () =>
      setFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange",       onFS);
    document.addEventListener("webkitfullscreenchange", onFS);
    return () => {
      document.removeEventListener("fullscreenchange",       onFS);
      document.removeEventListener("webkitfullscreenchange", onFS);
    };
  }, []);

  /* ── Durée robuste : écoute durationchange sur l'élément vidéo ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const syncDuration = () => {
      if (v.duration && isFinite(v.duration)) setDuration(v.duration);
    };
    v.addEventListener("durationchange", syncDuration);
    v.addEventListener("loadeddata",     syncDuration);
    return () => {
      v.removeEventListener("durationchange", syncDuration);
      v.removeEventListener("loadeddata",     syncDuration);
    };
  }, []);

  /* ── Affiche les contrôles, les masque après 3 s en lecture ── */
  const revealControls = useCallback(() => {
    setShowCtrl(true);
    clearTimeout(hideTimer.current);
    if (playing)
      hideTimer.current = setTimeout(() => setShowCtrl(false), 3200);
  }, [playing]);

  /* ── Play / Pause ── */
  const handleTogglePlay = useCallback((e) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play().catch(() => {});
      revealControls();
    }
  }, [playing, revealControls]);

  /* ── Mise à jour progression + buffer ── */
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setProgress(v.currentTime);
    /* Sécurité durée : remplit si toujours 0 */
    if (!duration && v.duration && isFinite(v.duration)) setDuration(v.duration);
    if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
  }, [duration]);

  /* ── Ratio initial depuis le poster (avant chargement vidéo) ── */
  useEffect(() => {
    if (!poster) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setContainerRatio(`${img.naturalWidth}/${img.naturalHeight}`);
      }
    };
    img.src = poster;
  }, [poster]);

  /* ── Détection du ratio réel + durée au chargement des métadonnées ── */
  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.duration && isFinite(v.duration)) setDuration(v.duration);
    if (v.videoWidth && v.videoHeight) {
      /* Ratio exact de la vraie vidéo — remplace le ratio du poster */
      setContainerRatio(`${v.videoWidth}/${v.videoHeight}`);
    }
  }, []);

  /* ── Seek ── */
  const handleSeek = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setProgress(pct * duration);
    revealControls();
  }, [duration, revealControls]);

  /* ── Volume ── */
  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setMuted(val === 0);
    if (videoRef.current) videoRef.current.volume = val;
  }, []);

  const handleToggleMute = useCallback((e) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  }, [muted]);

  /* ── Plein écran ── */
  const handleToggleFS = useCallback((e) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (!fullscreen)
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    else
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
  }, [fullscreen]);

  const progressPct = duration ? (progress / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered  / duration) * 100 : 0;

  const VolumeIcon = muted || volume === 0 ? IconMuted
    : volume < 0.5 ? IconVolLow : IconVolHigh;

  const showOverlay = !playing || showCtrl || hovered;

  /* ══ RENDU ══ */
  return (
    <motion.article
      style={
        variant === "hero"
          ? { background: "transparent" }
          : {
              background: "#0A0A0A",
              overflow: "hidden",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }
      }
      whileHover={
        variant === "card"
          ? { y: -5, boxShadow: `0 18px 48px ${accentColor}38` }
          : undefined
      }
      transition={{ duration: 0.24, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {/* ── Wrapper conteneur : ratio dynamique ici ── */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          /* ✅ Le ratio s'adapte à la vraie vidéo — fallback 16/9 */
          aspectRatio: containerRatio,
          background: "#000",
          overflow: "hidden",
          /* Empêche le conteneur de dépasser son parent sur mobile */
          maxWidth: "100%",
          ...(variant === "hero" && {
            maxWidth: 820,
            margin: "0 auto",
            borderRadius: 16,
            boxShadow: hovered
              ? "0 32px 80px rgba(243,55,145,0.28), 0 8px 32px rgba(0,0,0,0.32)"
              : "0 16px 56px rgba(0,0,0,0.22)",
            transition: "box-shadow 0.4s ease",
          }),
        }}
        onMouseEnter={() => { setHovered(true);  revealControls(); }}
        onMouseLeave={() => { setHovered(false); if (playing) setShowCtrl(false); }}
        onMouseMove={revealControls}
        onTouchStart={revealControls}
      >
        {/* ── Poster ── */}
        {!playing && poster && (
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <img
              src={poster}
              alt={title || "aperçu"}
              loading="lazy"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
            }} />
            {title && (
              <div style={{
                position: "absolute", bottom: "3.5rem",
                left: "1rem", right: "1rem", zIndex: 3,
              }}>
                <div style={{
                  fontFamily: "'Poppins'", fontWeight: 800,
                  fontSize: "0.9rem", color: "#fff",
                  letterSpacing: "-0.01em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}>
                  {emoji} {title}
                </div>
                {subtitle && (
                  <div style={{
                    fontFamily: "'Poppins'", fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.65)", marginTop: "0.2rem",
                  }}>
                    {subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Élément <video> : remplit tout le conteneur ── */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          style={{
            /* ✅ Occupe tout le conteneur — pas de black bars */
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",   /* contain = pas de recadrage */
            display: "block",
            background: "#000",
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => {
            setPlaying(false);
            setShowCtrl(true);
            clearTimeout(hideTimer.current);
          }}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
            setShowCtrl(true);
            if (videoRef.current) videoRef.current.currentTime = 0;
          }}
        />

        {/* ── Overlay contrôles ── */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              style={{
                position: "absolute", inset: 0, zIndex: 4,
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end", cursor: "pointer",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleTogglePlay}
            >
              {/* Dégradé de fond */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: playing
                  ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 40%)"
                  : `linear-gradient(to top, ${accentColor}A8 0%, ${accentColor}38 45%, rgba(0,0,0,0.18) 100%)`,
                transition: "background 0.4s ease",
              }} />

              {/* Titre hero (pause uniquement) */}
              {variant === "hero" && title && !playing && (
                <AnimatePresence>
                  <motion.div
                    style={{ position: "absolute", top: "1.25rem", left: "1.25rem", zIndex: 5 }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <span style={{
                      fontFamily: "'Poppins'", fontWeight: 800,
                      fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
                      color: "#fff", letterSpacing: "-0.01em",
                      textShadow: "0 2px 10px rgba(0,0,0,0.5)", display: "block",
                    }}>
                      {emoji} {title}
                    </span>
                    {subtitle && (
                      <span style={{
                        fontFamily: "'Poppins'", fontSize: "0.68rem",
                        color: "rgba(255,255,255,0.7)", fontWeight: 500,
                        display: "block", marginTop: 2,
                      }}>
                        {subtitle}
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Bouton play central */}
              <div style={{
                flex: 1, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <motion.div
                  style={{
                    width: variant === "hero" ? 72 : 60,
                    height: variant === "hero" ? 72 : 60,
                    borderRadius: "50%",
                    background: playing
                      ? "rgba(255,255,255,0.14)"
                      : `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                    backdropFilter: playing ? "blur(8px)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: playing
                      ? "0 2px 20px rgba(0,0,0,0.3)"
                      : `0 8px 36px ${accentColor}99`,
                    border: playing ? "1.5px solid rgba(255,255,255,0.22)" : "none",
                    color: "#fff", flexShrink: 0,
                  }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.90 }}
                  animate={!playing ? {
                    boxShadow: [
                      `0 0 0 0 ${accentColor}80`,
                      `0 0 0 22px ${accentColor}00`,
                      `0 0 0 0 ${accentColor}00`,
                    ],
                  } : {}}
                  transition={!playing ? { duration: 1.8, repeat: Infinity } : {}}
                >
                  {playing ? <IconPause /> : <IconPlay />}
                </motion.div>
              </div>

              {/* Barre de contrôles */}
              <div
                style={{
                  position: "relative", zIndex: 5,
                  padding: "0 0.85rem 0.85rem",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Barre de progression */}
                <div
                  style={{
                    position: "relative", height: 4, borderRadius: 4,
                    background: "rgba(255,255,255,0.18)",
                    cursor: "pointer", marginBottom: "0.6rem",
                  }}
                  onClick={handleSeek}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    width: `${bufferedPct}%`,
                    background: "rgba(255,255,255,0.22)", borderRadius: 4,
                  }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    width: `${progressPct}%`,
                    background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)`,
                    borderRadius: 4, transition: "width 0.1s linear",
                  }} />
                  <motion.div
                    style={{
                      position: "absolute", top: "50%", left: `${progressPct}%`,
                      transform: "translate(-50%, -50%)",
                      width: 13, height: 13, borderRadius: "50%",
                      background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                    whileHover={{ scale: 1.4 }}
                  />
                </div>

                {/* Contrôles */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <button onClick={handleTogglePlay} style={BTN} aria-label={playing ? "Pause" : "Lecture"}>
                    {playing ? <IconPause /> : <IconPlay />}
                  </button>
                  <button onClick={handleToggleMute} style={BTN} aria-label="Volume">
                    <VolumeIcon />
                  </button>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    style={{ width: 56, accentColor, cursor: "pointer" }}
                  />
                  <span style={{
                    fontFamily: "'Poppins'", fontSize: "0.63rem",
                    color: "rgba(255,255,255,0.8)", fontWeight: 600,
                    flex: 1, whiteSpace: "nowrap",
                  }}>
                    {fmtTime(progress)} / {fmtTime(duration)}
                  </span>
                  <button onClick={handleToggleFS} style={BTN} aria-label="Plein écran">
                    {fullscreen ? <IconExitFS /> : <IconFS />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Barre info (mode card) ── */}
      {variant === "card" && title && (
        <div style={{
          padding: "0.85rem 1rem", background: "#111",
          display: "flex", alignItems: "center", gap: "0.65rem",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", flexShrink: 0,
          }}>
            {emoji}
          </div>
          <div>
            <h4 style={{
              fontFamily: "'Poppins'", fontWeight: 700,
              fontSize: "0.85rem", color: "#fff",
              letterSpacing: "-0.01em", margin: 0,
            }}>
              {title}
            </h4>
            {subtitle && (
              <div style={{
                fontFamily: "'Poppins'", fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)", marginTop: 2,
              }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.article>
  );
});

const BTN = {
  background: "none", border: "none", cursor: "pointer",
  padding: 0, display: "flex", alignItems: "center",
  color: "#fff", flexShrink: 0,
};

export default VideoPlayer;
