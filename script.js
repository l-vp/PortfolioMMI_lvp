/* ─────────────────────────────────────────────────────────
   script.js — Portfolio MMI
───────────────────────────────────────────────────────── */

/* ── Header scroll ────────────────────────────────────── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Active nav on scroll ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

if (sections.length) {
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href$="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => secObs.observe(s));
}

  const skillCategories = document.querySelectorAll('.skills-category');

  skillCategories.forEach(category => {
    const button = category.querySelector('.skills-toggle');

    button.addEventListener('click', () => {
      category.classList.toggle('active');
    });
  });


/* ── Burger ───────────────────────────────────────────── */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-links');
if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navMenu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      burger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll reveal ────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children]
                         .filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 70}ms`;
      entry.target.classList.add('visible');
      revObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revObs.observe(el));
}

/* ── Carousel ─────────────────────────────────────────── */
(function initCarousel() {
  const track    = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const btnPrev  = document.getElementById('carouselPrev');
  const btnNext  = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  track.style.transition = 'transform .55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const cards = [...track.querySelectorAll('.cat-card')];
  const total = cards.length;
  let active  = 0;

  function getOffset(idx) {
    const vpW      = viewport.offsetWidth;
    const card     = cards[idx];
    const cardW    = card.offsetWidth;
    const cardLeft = card.offsetLeft;
    const offset   = cardLeft - (vpW / 2) + (cardW / 2);
    return Math.max(0, offset);
  }

  function setClasses() {
    cards.forEach((c, i) => {
      c.classList.remove('is-active', 'is-prev', 'is-next', 'is-far');
      const diff = i - active;
      if (diff === 0) c.classList.add('is-active');
      else if (diff === -1) c.classList.add('is-prev');
      else if (diff === 1) c.classList.add('is-next');
      else c.classList.add('is-far');
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    [...dotsWrap.querySelectorAll('.dot')].forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }

  function go(idx) {
    active = Math.max(0, Math.min(total - 1, idx));
    requestAnimationFrame(() => {
      track.style.transform = `translateX(-${getOffset(active)}px)`;
    });
    setClasses();
    updateDots();
    if (btnPrev) btnPrev.disabled = active === 0;
    if (btnNext) btnNext.disabled = active === total - 1;
  }

  go(0);

  if (btnPrev) btnPrev.addEventListener('click', () => go(active - 1));
  if (btnNext) btnNext.addEventListener('click', () => go(active + 1));

  if (dotsWrap) {
    dotsWrap.querySelectorAll('.dot').forEach(d => {
      d.addEventListener('click', () => go(+d.dataset.dot));
    });
  }

  window.addEventListener('resize', () => go(active), { passive: true });
})();

/* ── Mentions légales ─────────────────────────────────── */
const mentionsToggle = document.getElementById('mentions-toggle');
const mentionsPanel  = document.getElementById('mentions-panel');
if (mentionsToggle && mentionsPanel) {
  mentionsToggle.addEventListener('click', e => {
    e.preventDefault();
    const v = mentionsPanel.classList.toggle('visible');
    mentionsToggle.textContent = v ? 'Fermer' : 'Mentions légales';
  });
}

/* ── Contact form ─────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-5px); }
      40%     { transform: translateX(5px); }
      60%     { transform: translateX(-3px); }
      80%     { transform: translateX(3px); }
    }`;
  document.head.appendChild(styleSheet);

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const btn     = contactForm.querySelector('.submit-btn');

    if (!name || !email || !message) {
      btn.style.animation = 'none';
      btn.offsetHeight;
      btn.style.animation = 'shake 0.4s ease';
      return;
    }
    btn.textContent = 'Envoyé ✓';
    btn.style.background = 'var(--teal)';
    btn.disabled = true;
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = 'Envoyer';
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
}
