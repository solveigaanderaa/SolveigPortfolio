// === NAVBAR SCROLL ===
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
  backToTop?.classList.toggle('visible', window.scrollY > 400);
});

// === HAMBURGER ===
const hamburger = document.getElementById('hamburger');
const dropdown = document.getElementById('dropdown');

hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  dropdown.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.navbar__dropdown a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    dropdown?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!hamburger?.contains(e.target) && !dropdown?.contains(e.target)) {
    hamburger?.classList.remove('open');
    dropdown?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }
});

// === HERO NAME SCALING ===
function scaleHeroName() {
  const el = document.querySelector('.hero__name');
  if (!el) return;
  el.style.fontSize = '200px';
  const vpWidth = document.documentElement.clientWidth;
  const textWidth = el.scrollWidth;
  el.style.fontSize = Math.floor((vpWidth / textWidth) * 200) + 'px';
}

if (document.querySelector('.hero__name')) {
  scaleHeroName();
  document.fonts?.ready.then(scaleHeroName);
  window.addEventListener('resize', scaleHeroName);
}

// === BACK TO TOP ===
backToTop?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === FADE IN ON SCROLL ===
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
