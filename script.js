(() => {
  const doc = document;
  const body = doc.body;

  const burger = doc.getElementById('burger');
  const navLinks = doc.getElementById('nav-links');
  const navLinkItems = doc.querySelectorAll('.nav-link');

  const mentionsToggle = doc.getElementById('mentions-toggle');
  const mentionsPanel = doc.getElementById('mentions-panel');

  const revealItems = doc.querySelectorAll('.reveal');

  const setBurgerState = (isOpen) => {
    if (!burger || !navLinks) return;
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    navLinks.classList.toggle('is-open', isOpen);
    body.classList.toggle('menu-open', isOpen);
  };

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      setBurgerState(!isOpen);
    });

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 760) {
          setBurgerState(false);
        }
      });
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setBurgerState(false);

        if (mentionsToggle && mentionsToggle.getAttribute('aria-expanded') === 'true') {
          mentionsToggle.setAttribute('aria-expanded', 'false');
          mentionsPanel.hidden = true;
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        setBurgerState(false);
      }
    });
  }

  if (mentionsToggle && mentionsPanel) {
    mentionsToggle.addEventListener('click', () => {
      const isExpanded = mentionsToggle.getAttribute('aria-expanded') === 'true';
      mentionsToggle.setAttribute('aria-expanded', String(!isExpanded));
      mentionsPanel.hidden = isExpanded;
    });
  }

  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -8% 0px',
          threshold: 0.12
        }
      );

      revealItems.forEach((item) => {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach((item) => {
        item.classList.add('is-visible');
      });
    }
  }
})();