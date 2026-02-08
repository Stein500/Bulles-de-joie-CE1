/* ═══════════════════════════════════════════════════════════════
   LES BULLES DE JOIE — Main Script v4.1 (Immersive & Smooth)
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initHeader();
  initScrollProgress();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initRipple();
  initMobileMenu();
  initActiveNav();
  initTabs();
  initPriceToggle();
  initForms();
  initVideoPlayer();
  initVideoCards();
  initPWA();
  initBottomNav();
});

/* ═══ SPLASH (3s white intro) ═══ */
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  // floating dots
  const dots = splash.querySelector('.splash-dots');
  if (dots) {
    for (let i = 0; i < 10; i++) {
      const d = document.createElement('div');
      d.className = 'splash-dot';
      const s = Math.random() * 30 + 10;
      const colors = ['#F33791', '#336907', '#C8C5A6'];
      d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${colors[i%3]};animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*1.5}s;`;
      dots.appendChild(d);
    }
  }
  setTimeout(() => {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 500);
  }, 3000);
}

/* ═══ HEADER ═══ */
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══ SCROLL PROGRESS ═══ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══ SMOOTH SCROLL (ultra-smooth with easing) ═══ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
        smoothScrollTo(targetY, 1000);
      }
    });
  });
}

/* Custom smooth scroll — ultra-smooth ease-out quart */
function smoothScrollTo(targetY, duration) {
  const startY = window.pageYOffset;
  const diff = targetY - startY;
  if (Math.abs(diff) < 3) return;
  let startTime = null;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    window.scrollTo(0, startY + diff * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ═══ SCROLL REVEAL ═══ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal:not(.visible),.reveal-left:not(.visible),.reveal-right:not(.visible),.reveal-scale:not(.visible)').forEach(el => obs.observe(el));
}

/* ═══ COUNTERS ═══ */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: .5 });
  document.querySelectorAll('.counter:not(.counted)').forEach(el => obs.observe(el));
}
function animateCounter(el) {
  el.classList.add('counted');
  const target = +el.dataset.target;
  const dur = 2000;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target) + '+';
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ═══ RIPPLE ═══ */
function initRipple() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      const r = d / 2;
      circle.style.width = circle.style.height = d + 'px';
      circle.style.left = (e.clientX - this.getBoundingClientRect().left - r) + 'px';
      circle.style.top = (e.clientY - this.getBoundingClientRect().top - r) + 'px';
      circle.classList.add('ripple-circle');
      const old = this.querySelector('.ripple-circle');
      if (old) old.remove();
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* ═══ MOBILE MENU ═══ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  /* Create close button dynamically (appears on all pages) */
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-menu-close';
  closeBtn.setAttribute('aria-label', 'Fermer le menu');
  closeBtn.innerHTML = '✕';
  menu.prepend(closeBtn);

  function closeMenu() {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  closeBtn.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ═══ ACTIVE NAV ═══ */
function initActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const map = { 'index.html':'accueil','':'accueil','pedagogie.html':'pedagogie','tarifs.html':'tarifs','resultats.html':'resultats','contact.html':'contact' };
  const active = map[current] || 'accueil';
  document.querySelectorAll('.nav-link,.mobile-menu a[data-page],.bottom-nav__item').forEach(l => {
    l.classList.toggle('active', l.dataset.page === active);
  });
}

/* ═══ TABS ═══ */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs');
      const container = btn.closest('.section') || btn.closest('.container')?.parentElement;
      if (!group || !container) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const t = document.getElementById(btn.dataset.tab);
      if (t) t.classList.add('active');
      setTimeout(initScrollReveal, 100);
    });
  });
}

/* ═══ PRICE TOGGLE ═══ */
function initPriceToggle() {
  document.querySelectorAll('[data-action="toggle-details"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.price-card');
      if (!card) return;
      const d = card.querySelector('.price-card__details');
      if (!d) return;
      const h = d.hidden;
      d.hidden = !h;
      btn.textContent = h ? '▴ Masquer le détail' : '▾ Voir le détail des frais';
    });
  });
}

/* ═══ FORMS ═══ */
function initForms() {
  const form = document.getElementById('inscription-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fd = new FormData(this);
    const d = Object.fromEntries(fd);
    const req = ['prenom_enfant','nom_enfant','date_naissance','cycle','nom_parent','telephone'];
    const miss = req.filter(f => !d[f]?.trim());
    if (miss.length) {
      showToast('⚠️ Remplissez tous les champs obligatoires');
      const first = form.querySelector(`[name="${miss[0]}"]`);
      if (first) first.focus();
      return;
    }
    const labels = { creche:'Crèche & Garderie', prematernelle:'Pré-Maternelle', maternelle:'Maternelle', primaire:'Primaire' };
    let msg = `🎓 *DEMANDE DE PRÉ-INSCRIPTION*\n*Les Bulles de Joie - 2025-2026*\n\n`;
    msg += `👶 *Enfant :*\nPrénom : ${d.prenom_enfant}\nNom : ${d.nom_enfant}\nDate : ${d.date_naissance}\nCycle : ${labels[d.cycle]||d.cycle}\n\n`;
    msg += `👨‍👩‍👧 *Parent :*\nNom : ${d.nom_parent}\nTél : ${d.telephone}`;
    if (d.email) msg += `\nEmail : ${d.email}`;
    if (d.message) msg += `\n\n💬 *Message :*\n${d.message}`;
    window.open(`https://wa.me/22901580303?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

/* ═══ VIDEO — Immersive Auto Aspect Ratio ═══ */
function initVideoPlayer() {
  const overlay = document.getElementById('video-overlay');
  const video = document.getElementById('main-video');
  const wrapper = video?.closest('.video-wrapper');
  if (!overlay || !video || !wrapper) return;

  /* Auto-detect video aspect ratio from metadata */
  video.addEventListener('loadedmetadata', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (w && h) {
      wrapper.style.aspectRatio = `${w}/${h}`;
      wrapper.classList.add('ratio-loaded');
    }
  });

  /* Force load metadata */
  if (video.readyState >= 1) {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (w && h) {
      wrapper.style.aspectRatio = `${w}/${h}`;
      wrapper.classList.add('ratio-loaded');
    }
  }

  overlay.addEventListener('click', () => {
    overlay.classList.add('hide');
    video.play();
    video.setAttribute('controls', '');
  });

  /* Pause = show overlay again */
  video.addEventListener('ended', () => {
    overlay.classList.remove('hide');
    video.removeAttribute('controls');
    video.currentTime = 0;
  });
}

/* ═══ VIDEO CARDS — Inline Immersive Playback ═══ */
function initVideoCards() {
  document.querySelectorAll('.video-card').forEach(card => {
    const thumb = card.querySelector('.video-thumb');
    const videoSrc = card.dataset.video;
    if (!thumb || !videoSrc) return;

    let videoEl = null;
    let isPlaying = false;

    card.addEventListener('click', () => {
      if (isPlaying) {
        /* Pause and restore poster */
        if (videoEl) {
          videoEl.pause();
          videoEl.remove();
          videoEl = null;
        }
        thumb.classList.remove('playing');
        isPlaying = false;
        return;
      }

      /* Create video element and play inline */
      videoEl = document.createElement('video');
      videoEl.src = videoSrc;
      videoEl.controls = true;
      videoEl.playsInline = true;
      videoEl.autoplay = true;
      videoEl.preload = 'metadata';
      videoEl.style.borderRadius = 'inherit';

      /* Auto aspect ratio from metadata */
      videoEl.addEventListener('loadedmetadata', () => {
        const w = videoEl.videoWidth;
        const h = videoEl.videoHeight;
        if (w && h) {
          thumb.style.aspectRatio = `${w}/${h}`;
        }
      });

      /* Reset on end */
      videoEl.addEventListener('ended', () => {
        videoEl.remove();
        videoEl = null;
        thumb.classList.remove('playing');
        thumb.style.aspectRatio = '';
        isPlaying = false;
      });

      thumb.appendChild(videoEl);
      thumb.classList.add('playing');
      isPlaying = true;
    });
  });
}

/* ═══ PWA INSTALL (SILENT — no notification) ═══ */
let deferredPrompt = null;
function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.addEventListener('click', (e) => {
      if (e.target.closest('.install-close')) return;
      triggerInstall();
    });
  }
  const closeBtn = document.querySelector('.install-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (banner) banner.style.display = 'none';
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

function triggerInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        const b = document.getElementById('install-banner');
        if (b) b.style.display = 'none';
        const h = document.getElementById('install-helper');
        if (h) h.remove();
      }
      deferredPrompt = null;
    });
    return;
  }
  showInstallHelper();
}

/* ═══ INSTALL HELPER (non-invasive instructions) ═══ */
function showInstallHelper() {
  if (document.getElementById('install-helper')) return;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  let steps = '';
  if (isIOS || isSafari) {
    steps = `
      <p style="font-weight:800;margin-bottom:.6rem;font-size:var(--text-base,1rem);display:flex;align-items:center;gap:.4rem;">
        <span class="emoji e-bounce" style="font-size:1.3rem;">📱</span> Installer sur iPhone/iPad
      </p>
      <ol style="text-align:left;font-size:var(--text-sm,.9rem);color:var(--gray-600,#4B5563);padding-left:1.2rem;margin:0;">
        <li style="margin-bottom:.4rem;">Appuyez sur <strong>Partager</strong> <span style="font-size:1.2em;">⬆️</span> en bas de Safari</li>
        <li style="margin-bottom:.4rem;">Faites défiler et appuyez <strong>« Sur l'écran d'accueil »</strong> <span style="font-size:1.1em;">➕</span></li>
        <li>Appuyez <strong>Ajouter</strong> en haut à droite</li>
      </ol>`;
  } else {
    steps = `
      <p style="font-weight:800;margin-bottom:.6rem;font-size:var(--text-base,1rem);display:flex;align-items:center;gap:.4rem;">
        <span class="emoji e-bounce" style="font-size:1.3rem;">📱</span> Installer l'application
      </p>
      <ol style="text-align:left;font-size:var(--text-sm,.9rem);color:var(--gray-600,#4B5563);padding-left:1.2rem;margin:0;">
        <li style="margin-bottom:.4rem;">Appuyez sur le menu <strong>⋮</strong> de votre navigateur</li>
        <li style="margin-bottom:.4rem;">Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong></li>
        <li>Confirmez l'installation</li>
      </ol>`;
  }

  const helper = document.createElement('div');
  helper.id = 'install-helper';
  helper.style.cssText = `
    position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:997;
    background:#fff;color:#1F2937;
    padding:1.25rem 1.5rem;border-radius:1rem;max-width:340px;width:calc(100% - 2rem);
    box-shadow:0 12px 40px rgba(0,0,0,.15);border:1.5px solid rgba(243,55,145,.15);
    animation:helperIn .35s cubic-bezier(.34,1.56,.64,1);
  `;
  helper.innerHTML = `
    <button onclick="this.parentElement.remove()" aria-label="Fermer"
      style="position:absolute;top:.5rem;right:.6rem;background:rgba(243,55,145,.08);
      border:none;width:28px;height:28px;border-radius:50%;font-size:.85rem;
      cursor:pointer;color:#A3A7A1;display:flex;align-items:center;justify-content:center;
      transition:all .15s;">✕</button>
    ${steps}
  `;
  document.body.appendChild(helper);
  setTimeout(() => { if (helper.parentElement) helper.remove(); }, 12000);
}

/* ═══ BOTTOM NAV TOGGLE (collapsible) ═══ */
function initBottomNav() {
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;
  if (window.innerWidth >= 960) return;

  const toggle = document.createElement('button');
  toggle.className = 'bottom-nav__toggle';
  toggle.setAttribute('aria-label', 'Réduire la navigation');
  toggle.innerHTML = '<span class="bottom-nav__toggle-chevron">▼</span>';
  nav.prepend(toggle);

  const saved = localStorage.getItem('bnav-collapsed');
  if (saved === 'true') {
    nav.classList.add('collapsed');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('collapsed');
    localStorage.setItem('bnav-collapsed', nav.classList.contains('collapsed'));
  });
}

/* ═══ TOAST ═══ */
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

window.triggerInstall = triggerInstall;
window.showToast = showToast;
