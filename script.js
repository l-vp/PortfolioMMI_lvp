(() => {
  const doc = document;

  /* =========================
     BURGER
  ========================= */
  const burger         = doc.getElementById('burger');
  const navLinks       = doc.getElementById('nav-links');
  const navLinkItems   = doc.querySelectorAll('.nav-link');
  const mentionsToggle = doc.getElementById('mentions-toggle');
  const mentionsPanel  = doc.getElementById('mentions-panel');

  const setBurgerState = (open) => {
    if (!burger || !navLinks) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    navLinks.classList.toggle('is-open', open);
  };

  if (burger && navLinks) {
    burger.addEventListener('click', () => setBurgerState(burger.getAttribute('aria-expanded') !== 'true'));
    navLinkItems.forEach(l => l.addEventListener('click', () => { if (window.innerWidth <= 760) setBurgerState(false); }));
    window.addEventListener('resize', () => { if (window.innerWidth > 760) setBurgerState(false); });
    window.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      setBurgerState(false);
      if (mentionsToggle?.getAttribute('aria-expanded') === 'true') {
        mentionsToggle.setAttribute('aria-expanded', 'false');
        if (mentionsPanel) mentionsPanel.hidden = true;
      }
    });
  }

  /* =========================
     MENTIONS LÉGALES
  ========================= */
  if (mentionsToggle && mentionsPanel) {
    mentionsToggle.addEventListener('click', () => {
      const open = mentionsToggle.getAttribute('aria-expanded') === 'true';
      mentionsToggle.setAttribute('aria-expanded', String(!open));
      mentionsPanel.hidden = open;
    });
  }

  /* =========================
     REVEAL
  ========================= */
  const revealItems = doc.querySelectorAll('.reveal');
  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries, o) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); o.unobserve(e.target); } }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
      );
      revealItems.forEach(i => obs.observe(i));
    } else {
      revealItems.forEach(i => i.classList.add('is-visible'));
    }
  }

  /* =========================
     ACCORDION COMPÉTENCES
     Pas de panel.hidden — uniquement la classe is-open via CSS
  ========================= */
  doc.querySelectorAll('.skills-category').forEach((cat, idx) => {
    const btn   = cat.querySelector('.skills-toggle');
    const panel = cat.querySelector('.skills-content');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const wasOpen = cat.classList.contains('is-open');
      // Ferme tous
      doc.querySelectorAll('.skills-category').forEach(c => {
        c.classList.remove('is-open');
        c.querySelector('.skills-toggle')?.setAttribute('aria-expanded', 'false');
      });
      // Ouvre celui cliqué si était fermé
      if (!wasOpen) {
        cat.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================
     CAROUSEL — cartes fixes, panneau info expand à droite
  ========================= */
  const track   = doc.getElementById('carouselTrack');
  const prevBtn = doc.getElementById('carouselPrev');
  const nextBtn = doc.getElementById('carouselNext');
  const dots    = Array.from(doc.querySelectorAll('#carouselDots .dot'));
  const cards   = Array.from(doc.querySelectorAll('.cat-card'));
  const infoPanel = doc.getElementById('carouselInfo');

  if (cards.length) {
    let active = 0;

    // Données des cartes (lues depuis le DOM)
    const cardData = cards.map(c => ({
      title: c.querySelector('h3')?.textContent          || '',
      desc:  c.querySelector('.cat-card-desc')?.textContent.trim() || '',
      tag:   c.querySelector('.cat-card-tag')?.textContent  || '',
      href:  c.getAttribute('data-href') || '#',
    }));

    const setActive = (idx) => {
      active = (idx + cards.length) % cards.length;

      cards.forEach((c, i) => c.classList.toggle('cat-card--active', i === active));
      dots.forEach((d, i)  => d.classList.toggle('active', i === active));

      if (infoPanel) {
        const d = cardData[active];
        infoPanel.innerHTML = `
          <span class="cat-card-tag" style="margin-bottom:.5rem;">${d.tag}</span>
          <h3 style="font-size:clamp(1.3rem,1rem+1vw,1.8rem);line-height:1.15;">${d.title}</h3>
          <p style="color:var(--muted);line-height:1.7;">${d.desc}</p>
          <a href="${d.href}" class="cta-btn" style="margin-top:.5rem;width:fit-content;">Explorer →</a>
        `;
      }
    };

    prevBtn?.addEventListener('click', () => setActive(active - 1));
    nextBtn?.addEventListener('click', () => setActive(active + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));
    cards.forEach((c, i) => c.addEventListener('click', e => {
      e.preventDefault();
      setActive(i);
    }));

    setActive(0);
  }

  /* =========================
     LIGHTBOX
  ========================= */
  const lb = doc.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image agrandie');
  lb.innerHTML = `
    <button class="lightbox__close" aria-label="Fermer">✕</button>
    <img class="lightbox__img" src="" alt="">
    <p class="lightbox__caption"></p>`;
  doc.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lightbox__img');
  const lbCaption = lb.querySelector('.lightbox__caption');
  const lbClose   = lb.querySelector('.lightbox__close');

  const openLb = (src, alt, caption) => {
    lbImg.src = src; lbImg.alt = alt || '';
    lbCaption.textContent = caption || '';
    lbCaption.hidden = !caption;
    lb.classList.add('is-open');
    doc.documentElement.style.overflow = 'hidden';
    lbClose.focus();
  };
  const closeLb = () => {
    lb.classList.remove('is-open');
    doc.documentElement.style.overflow = '';
    if (lb._trigger) { lb._trigger.focus(); lb._trigger = null; }
  };

  doc.querySelectorAll('.project-block__img img, .project-card img, .screenshot-card img').forEach(img => {
    const wrap = img.closest('.project-block__img') || img.closest('.project-card') || img.closest('.screenshot-card');
    if (wrap && !wrap.hasAttribute('tabindex')) {
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('aria-label', `Agrandir : ${img.alt || 'image'}`);
    }
    const go = () => {
      const cap = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
      lb._trigger = wrap || img;
      openLb(img.src, img.alt, cap);
    };
    img.addEventListener('click', go);
    wrap?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  doc.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb(); });

})();