(() => {
  const doc = document;

  /* =========================
     ACCORDION COMPÉTENCES
  ========================= */
  const skillCategories = doc.querySelectorAll('.skills-category');

  if (skillCategories.length) {
    skillCategories.forEach((category, index) => {
      const button = category.querySelector('.skills-toggle');
      const panel = category.querySelector('.skills-content');

      if (!button || !panel) return;

      const panelId = `skills-panel-${index + 1}`;
      const buttonId = `skills-button-${index + 1}`;

      button.id = buttonId;
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-expanded', 'false');

      panel.id = panelId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', buttonId);
      panel.hidden = true;

      button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        skillCategories.forEach((item) => {
          const itemButton = item.querySelector('.skills-toggle');
          const itemPanel = item.querySelector('.skills-content');

          if (!itemButton || !itemPanel) return;

          item.classList.remove('is-open');
          itemButton.setAttribute('aria-expanded', 'false');
          itemPanel.hidden = true;
        });

        if (!isOpen) {
          category.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
        }
      });
    });
  }

  /* =========================
     CAROUSEL PRODUCTIONS
  ========================= */
  const viewport = doc.getElementById('carouselViewport');
  const track = doc.getElementById('carouselTrack');
  const prevBtn = doc.getElementById('carouselPrev');
  const nextBtn = doc.getElementById('carouselNext');
  const dots = Array.from(doc.querySelectorAll('#carouselDots .dot'));
  const cards = Array.from(doc.querySelectorAll('.cat-card'));

  if (viewport && track && cards.length) {
    let currentIndex = 0;

    const getCardStep = () => {
      const firstCard = cards[0];
      if (!firstCard) return viewport.clientWidth;

      const cardStyles = window.getComputedStyle(firstCard);
      const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || 16);
      return firstCard.getBoundingClientRect().width + gap;
    };

    const getVisibleCards = () => {
      const firstCard = cards[0];
      if (!firstCard) return 1;

      const cardWidth = firstCard.getBoundingClientRect().width || 1;
      return Math.max(1, Math.round(viewport.clientWidth / cardWidth));
    };

    const getMaxIndex = () => {
      return Math.max(0, cards.length - getVisibleCards());
    };

    const updateDots = () => {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
        dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
      });
    };

    const updateButtons = () => {
      const maxIndex = getMaxIndex();

      if (prevBtn) {
        prevBtn.disabled = currentIndex <= 0;
        prevBtn.setAttribute('aria-disabled', String(currentIndex <= 0));
      }

      if (nextBtn) {
        nextBtn.disabled = currentIndex >= maxIndex;
        nextBtn.setAttribute('aria-disabled', String(currentIndex >= maxIndex));
      }
    };

    const updateCarousel = () => {
      const step = getCardStep();
      const maxIndex = getMaxIndex();

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      track.style.transform = `translateX(-${currentIndex * step}px)`;

      updateDots();
      updateButtons();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex -= 1;
        updateCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex += 1;
        updateCarousel();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateCarousel, 120);
    });

    updateCarousel();
  }
})();