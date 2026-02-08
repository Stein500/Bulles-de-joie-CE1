import { useEffect, useState } from 'react';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1700);
    const t2 = setTimeout(() => { setVisible(false); onFinish(); }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, #FF69B4 0%, #FF00FF 30%, #C71585 60%, #DC143C 100%)',
        backgroundSize: '200% 200%',
        animation: 'splash-gradient 4s ease infinite',
      }}
    >
      {/* Bubbles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
            left: `${Math.random() * 100}%`,
            background: 'rgba(255,255,255,0.3)',
            animation: `bubble ${4 + Math.random() * 4}s ease-in infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      <div className="animate-fade-in-up flex flex-col items-center gap-6">
        {/* Logo circle */}
        <div className="animate-float flex h-28 w-28 items-center justify-center rounded-full bg-white/20 shadow-2xl backdrop-blur-md">
          <span className="text-5xl">🫧</span>
        </div>

        <div className="text-center">
          <h1
            className="text-5xl font-bold text-white drop-shadow-lg md:text-6xl"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Les Bulles de Joie
          </h1>
          <p className="mt-3 text-lg font-light tracking-widest text-white/80">
            GESTION SCOLAIRE
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-white/70"
              style={{
                animation: 'pulse-soft 1s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
