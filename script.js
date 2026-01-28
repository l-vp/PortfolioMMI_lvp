// Menu hamburger
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.main-nav a');

if (header && navToggle) {
  navToggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
  });

  // Fermer le menu quand on clique sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
    });
  });
}

// Hide / show header on scroll
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  // ne rien faire tout en haut
  if (currentScroll <= 0) {
    header.classList.remove('header--hidden');
    lastScrollY = currentScroll;
    return;
  }

  if (currentScroll > lastScrollY) {
    // on descend -> cacher le header
    header.classList.add('header--hidden');
  } else {
    // on remonte -> afficher le header
    header.classList.remove('header--hidden');
  }

  lastScrollY = currentScroll;
});


// ===============================
// Config générale
// ===============================

// UFO HOME
const ufo = document.querySelector(".ufo-orbit");
let angle = 0;
let ufoBehind = false;
const radiusX = 600;
const radiusY = 85;
const epsilon = 2;

// UFO SKILLS
const skillLogos = [
  document.querySelector(".skill-logo-1"),
  document.querySelector(".skill-logo-2"),
  document.querySelector(".skill-logo-3"),
  document.querySelector(".skill-logo-4"),
  document.querySelector(".skill-logo-5"),
  document.querySelector(".skill-logo-6"),
];

let angleSkills = 0;
let radiusXSkills = 240;
let radiusYSkills = 60;
const epsilonSkills = 3;
const globalOffsetX = 0;
const globalOffsetY = 0;
const offsetYPerLogo = [0, 40, -30, 60, -40, 70];
const startAngles = [0, 1, 2, 3, 4, 4.5];

// ---- AJOUT POUR MOBILE ----
if (window.innerWidth <= 900) {
  radiusXSkills = 90;   // orbite plus serrée en X
  radiusYSkills = 40;   // orbite plus serrée en Y
}

// ===============================
// UFO HOME ORBIT
// ===============================

function animateOrbit() {
  if (!ufo) return;

  angle += 0.008;

  const x = Math.cos(angle) * radiusX;
  const y = Math.sin(angle) * radiusY;
  const scale = 0.7 + (Math.sin(angle) + 1) * 0.15;

  ufo.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

  if (Math.abs(x - radiusX) < epsilon) {
    ufoBehind = false;
  } else if (Math.abs(x + radiusX) < epsilon) {
    ufoBehind = true;
  }

  ufo.style.zIndex = ufoBehind ? 1 : 3;

  requestAnimationFrame(animateOrbit);
}

if (ufo) {
  animateOrbit();
}

// ===============================
// UFO SKILLS ORBIT
// ===============================


function animateSkillsOrbit() {
  angleSkills += 0.005;

  skillLogos.forEach((logo, index) => {
    if (!logo) return;

    const a = angleSkills + startAngles[index];
    const x = Math.cos(a) * radiusXSkills + globalOffsetX;
    const y = Math.sin(a) * radiusYSkills + offsetYPerLogo[index] + globalOffsetY;
    const scale = 0.65 + (Math.sin(a) + 1) * 0.12;

    logo.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    if (Math.abs(x - (globalOffsetX - radiusXSkills)) < epsilonSkills) {
      logo.style.zIndex = 1;
    } else if (Math.abs(x - (globalOffsetX + radiusXSkills)) < epsilonSkills) {
      logo.style.zIndex = 5;
    }
  });

  requestAnimationFrame(animateSkillsOrbit);
}

if (skillLogos.some(Boolean)) {
  animateSkillsOrbit();
}


// ===============================
// CARD / BUBBLE TILT
// ===============================

function addTiltEffect(selector, options = {}) {
  const {
    maxRotateX = 10,
    maxRotateY = 10,
    translateY = -12,
    scale = 1.03,
  } = options;

  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -maxRotateX;
      const rotateY = ((x / rect.width) - 0.5) * maxRotateY;

      el.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(${translateY}px)
        scale(${scale})
      `;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

// Projects tilt (un peu plus fort)
addTiltEffect(".project-card", {
  maxRotateX: 10,
  maxRotateY: 10,
  translateY: -12,
  scale: 1.03,
});

// Contact cards + social bubbles (plus subtil)
addTiltEffect(".contact-card, .social-bubble", {
  maxRotateX: 6,
  maxRotateY: 6,
  translateY: -6,
  scale: 1.02,
});

// ===============================
// TABLETTE ABOUT ZOOM
// ===============================

const tablet = document.querySelector(".about-device");
let tabletZoomed = false;

function getTabletZoomConfig() {
  if (window.innerWidth <= 767) {
    // téléphone
    return {
      scale: 1.4,
      translateX: 0,
      translateY: 0
    };
  } else {
    // tablette / desktop
    return {
      scale: 2,      // plus grand
      translateX: 650,  // décale un peu vers la droite
      translateY: -80
    };
  }
}

if (tablet) {
  tablet.addEventListener("click", () => {
    tabletZoomed = !tabletZoomed;

    const cfg = getTabletZoomConfig();

    if (tabletZoomed) {
      tablet.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
      tablet.style.transform = `translate(${cfg.translateX}px, ${cfg.translateY}px) scale(${cfg.scale}) rotateZ(0deg)`;
      tablet.style.zIndex = "2";
    } else {
      tablet.style.transform = "translate(0, 0) scale(1) rotateZ(5deg)";
      tablet.style.zIndex = "";
    }
  });
}
