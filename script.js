/* ─────────────────────────────────────────────────────────
   script.js — Portfolio MMI
───────────────────────────────────────────────────────── */

/* ── Header scroll ────────────────────────────────────── */
const header = document.getElementById('header');

if (header) {
  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ── Active nav on scroll ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => link.classList.remove('active'));

      const activeLink = document.querySelector(`.nav-link[href$="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    });
  }, {
    threshold: 0.35
  });

  sections.forEach((section) => secObs.observe(section));
}

/* ── Accordéon compétences ────────────────────────────── */
const skillCategories = document.querySelectorAll('.skills-category');

if (skillCategories.length) {
  skillCategories.forEach((category, index) => {
    const button = category.querySelector('.skills-toggle');
    const content = category.querySelector('.skills-content');

    if (!button || !content) return;

    const contentId = `skills-content-${index + 1}`;
    const buttonId = `skills-toggle-${index + 1}`;

    button.id = buttonId;
    button.setAttribute('aria-controls', contentId);
    button.setAttribute('aria-expanded', 'false');

    content.id = contentId;
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', buttonId);

    button.addEventListener('click', () => {
      const isOpen = category.classList.contains('active');

      category.classList.toggle('active', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ── Burger / menu mobile ─────────────────────────────── */
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-links');

if (burger && navMenu) {
  const openMenu = () => {
    burger.classList.add('open');
    navMenu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    burger.classList.remove('open');
    navMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    const isOpen = burger.classList.contains('open');
    if (isOpen) closeMenu();
    else openMenu();
  };

  burger.setAttribute('aria-expanded', 'false');

  burger.addEventListener('click', toggleMenu);

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && burger.classList.contains('open')) {
      closeMenu();
      burger.focus();
    }
  });
}

/* ── Scroll reveal ────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = [...parent.children].filter((child) => child.classList.contains('reveal'));
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 70}ms`;
      }

      entry.target.classList.add('visible');
      revObs.unobserve(entry.target);
    });
  }, {
    threshold: 0.1
  });

  revealEls.forEach((el) => revObs.observe(el));
}

/* ── Carousel ─────────────────────────────────────────── */
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');

  if (!track || !viewport) return;

  const cards = [...track.querySelectorAll('.cat-card')];
  const dots = dotsWrap ? [...dotsWrap.querySelectorAll('.dot')] : [];
  const total = cards.length;

  if (!cards.length) return;

  let active = 0;

  track.style.transition = 'transform .55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  const getOffset = (index) => {
    const viewportWidth = viewport.offsetWidth;
    const card = cards[index];
    const cardWidth = card.offsetWidth;
    const cardLeft = card.offsetLeft;
    const offset = cardLeft - (viewportWidth / 2) + (cardWidth / 2);
    return Math.max(0, offset);
  };

  const setClasses = () => {
    cards.forEach((card, index) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-far');

      const diff = index - active;

      if (diff === 0) card.classList.add('is-active');
      else if (diff === -1) card.classList.add('is-prev');
      else if (diff === 1) card.classList.add('is-next');
      else card.classList.add('is-far');
    });
  };

  const updateDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
  };

  const updateButtons = () => {
    if (btnPrev) btnPrev.disabled = active === 0;
    if (btnNext) btnNext.disabled = active === total - 1;
  };

  const go = (index) => {
    active = Math.max(0, Math.min(total - 1, index));

    requestAnimationFrame(() => {
      track.style.transform = `translateX(-${getOffset(active)}px)`;
    });

    setClasses();
    updateDots();
    updateButtons();
  };

  go(0);

  if (btnPrev) {
    btnPrev.addEventListener('click', () => go(active - 1));
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => go(active + 1));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.dot);
      if (!Number.isNaN(index)) go(index);
    });
  });

  window.addEventListener('resize', () => go(active), { passive: true });
})();

/* ── Mentions légales ─────────────────────────────────── */
const mentionsToggle = document.getElementById('mentions-toggle');
const mentionsPanel = document.getElementById('mentions-panel');

if (mentionsToggle && mentionsPanel) {
  const openMentions = () => {
    mentionsPanel.hidden = false;
    mentionsToggle.setAttribute('aria-expanded', 'true');
    mentionsToggle.textContent = 'Fermer';
  };

  const closeMentions = () => {
    mentionsPanel.hidden = true;
    mentionsToggle.setAttribute('aria-expanded', 'false');
    mentionsToggle.textContent = 'Mentions légales';
  };

  mentionsToggle.setAttribute('aria-expanded', 'false');

  mentionsToggle.addEventListener('click', () => {
    const isHidden = mentionsPanel.hidden;
    if (isHidden) openMentions();
    else closeMentions();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mentionsPanel.hidden) {
      closeMentions();
      mentionsToggle.focus();
    }
  });
}

/* ── Contact form ─────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-5px); }
      40% { transform: translateX(5px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(styleSheet);

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const button = contactForm.querySelector('.submit-btn');

    if (!button) return;

    if (!name || !email || !message) {
      button.style.animation = 'none';
      button.offsetHeight;
      button.style.animation = 'shake 0.4s ease';
      return;
    }

    button.textContent = 'Envoyé ✓';
    button.style.background = 'var(--teal)';
    button.disabled = true;

    contactForm.reset();

    setTimeout(() => {
      button.textContent = 'Envoyer';
      button.style.background = '';
      button.disabled = false;
    }, 3500);
  });
}