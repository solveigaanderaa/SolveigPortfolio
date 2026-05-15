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

// === CAROUSEL & LIGHTBOX ===
(function () {
  // Build lightbox with prev/next nav
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Forrige bilde">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="lightbox__inner">
      <button class="lightbox__close" aria-label="Lukk">✕</button>
      <div class="lightbox__img-wrap">
        <img class="lightbox__img" src="" alt="">
      </div>
      <p class="lightbox__caption"></p>
    </div>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Neste bilde">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`;
  document.body.appendChild(lb);

  const lbWrap = lb.querySelector('.lightbox__img-wrap');
  const lbImg  = lb.querySelector('.lightbox__img');
  const lbCap  = lb.querySelector('.lightbox__caption');
  const lbPrev = lb.querySelector('.lightbox__nav--prev');
  const lbNext = lb.querySelector('.lightbox__nav--next');

  let lbImages = [];
  let lbIdx = 0;

  function resetZoom() {
    lbImg.style.transform = '';
    lbImg.style.transformOrigin = '';
    lbWrap.classList.remove('zoomed');
  }

  function showLbSlide(idx) {
    lbIdx = (idx + lbImages.length) % lbImages.length;
    lbImg.src = lbImages[lbIdx].src;
    lbImg.alt = lbImages[lbIdx].alt;
    lbCap.textContent = lbImages[lbIdx].alt;
    resetZoom();
    const single = lbImages.length <= 1;
    lbPrev.hidden = single;
    lbNext.hidden = single;
  }

  function openLb(images, startIdx) {
    lbImages = images;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    showLbSlide(startIdx);
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    resetZoom();
    lbImages = [];
  }

  lbWrap.addEventListener('click', e => {
    if (lbWrap.classList.contains('zoomed')) {
      resetZoom();
    } else {
      const r = lbImg.getBoundingClientRect();
      lbImg.style.transformOrigin = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`;
      lbImg.style.transform = 'scale(2.5)';
      lbWrap.classList.add('zoomed');
    }
  });

  lbPrev.addEventListener('click', () => showLbSlide(lbIdx - 1));
  lbNext.addEventListener('click', () => showLbSlide(lbIdx + 1));
  lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
  lb.querySelector('.lightbox__backdrop').addEventListener('click', closeLb);

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLbSlide(lbIdx - 1);
    if (e.key === 'ArrowRight') showLbSlide(lbIdx + 1);
  });

  // Carousels
  document.querySelectorAll('.carousel').forEach(car => {
    const slides  = [...car.querySelectorAll('.carousel__slide')];
    const caption = car.querySelector('.carousel__caption');
    let cur = 0;

    // Collect all images for this carousel's lightbox context
    const carImages = slides.map(slide => {
      const img = slide.querySelector('img');
      return { src: img?.src ?? '', alt: img?.alt ?? '' };
    });

    function show(n) {
      slides[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (caption) caption.textContent = slides[cur].querySelector('img')?.alt ?? '';
    }

    if (caption && slides[0]) caption.textContent = slides[0].querySelector('img')?.alt ?? '';

    car.querySelector('.carousel__btn--prev')?.addEventListener('click', () => show(cur - 1));
    car.querySelector('.carousel__btn--next')?.addEventListener('click', () => show(cur + 1));

    slides.forEach((slide, idx) => {
      slide.querySelector('img')?.addEventListener('click', () => openLb(carImages, idx));
    });
  });

  // Praksis image groups (.img-pair-wrap, .img-row-wrap, .img-solo)
  ['.img-pair-wrap', '.img-row-wrap'].forEach(sel => {
    document.querySelectorAll(sel).forEach(wrap => {
      const imgs = [...wrap.querySelectorAll('img')];
      const groupImages = imgs.map(img => ({ src: img.src, alt: img.alt }));
      imgs.forEach((img, idx) => {
        img.addEventListener('click', () => openLb(groupImages, idx));
      });
    });
  });

  document.querySelectorAll('.img-solo img').forEach(img => {
    img.addEventListener('click', () => openLb([{ src: img.src, alt: img.alt }], 0));
  });
}());
