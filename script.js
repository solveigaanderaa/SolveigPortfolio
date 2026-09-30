const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');

navToggle?.addEventListener('click', () => {
  const open = !navMobile?.classList.contains('open');
  navMobile?.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', (event) => {
  const insideNav = event.target.closest('.nav');
  if (!insideNav) {
    navMobile?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

(function () {
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
    </button>
  `;

  document.body.appendChild(lb);

  const lbWrap = lb.querySelector('.lightbox__img-wrap');
  const lbImg = lb.querySelector('.lightbox__img');
  const lbCap = lb.querySelector('.lightbox__caption');
  const lbPrev = lb.querySelector('.lightbox__nav--prev');
  const lbNext = lb.querySelector('.lightbox__nav--next');

  let lbImages = [];
  let lbIdx = 0;

  function resetZoom() {
    lbImg.style.transform = '';
    lbImg.style.transformOrigin = '';
    lbWrap.classList.remove('zoomed');
  }

  function showLbSlide(index) {
    if (!lbImages.length) return;

    lbIdx = (index + lbImages.length) % lbImages.length;
    lbImg.src = lbImages[lbIdx].src;
    lbImg.alt = lbImages[lbIdx].alt;
    lbCap.textContent = lbImages[lbIdx].alt;
    resetZoom();

    const single = lbImages.length <= 1;
    lbPrev.hidden = single;
    lbNext.hidden = single;
  }

  function openLb(images, startIndex) {
    if (!images || !images.length) return;

    lbImages = images;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    showLbSlide(startIndex || 0);
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    resetZoom();
    lbImages = [];
  }

  lbWrap.addEventListener('click', (event) => {
    if (lbWrap.classList.contains('zoomed')) {
      resetZoom();
      return;
    }

    const rect = lbImg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    lbImg.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
    lbImg.style.transform = 'scale(2.5)';
    lbWrap.classList.add('zoomed');
  });

  lbPrev.addEventListener('click', () => showLbSlide(lbIdx - 1));
  lbNext.addEventListener('click', () => showLbSlide(lbIdx + 1));
  lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
  lb.querySelector('.lightbox__backdrop').addEventListener('click', closeLb);

  document.addEventListener('keydown', (event) => {
    if (!lb.classList.contains('open')) return;
    if (event.key === 'Escape') closeLb();
    if (event.key === 'ArrowLeft') showLbSlide(lbIdx - 1);
    if (event.key === 'ArrowRight') showLbSlide(lbIdx + 1);
  });

  const INTEREST_IMAGES = {
    friluftsliv: [
      { src: encodeURI('images/sport og friluftsliv/DSC08892.JPG'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_1839.jpeg'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_1938.jpeg'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_5018.JPG'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_6234.JPG'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_6908.JPG'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_7039.JPG'), alt: 'Friluftsliv' },
      { src: encodeURI('images/sport og friluftsliv/IMG_9937.jpeg'), alt: 'Friluftsliv' }
    ],
    matlaging: [
      { src: encodeURI('images/matlaging/IMG_1541.JPG'), alt: 'Matlaging' },
      { src: encodeURI('images/matlaging/IMG_1542.JPG'), alt: 'Matlaging' },
      { src: encodeURI('images/matlaging/IMG_1543.JPG'), alt: 'Matlaging' },
      { src: encodeURI('images/matlaging/IMG_1544.JPG'), alt: 'Matlaging' },
      { src: encodeURI('images/matlaging/IMG_1545.JPG'), alt: 'Matlaging' }
    ],
    kreativt: [
      { src: encodeURI('images/kreativt håndarbeid/IMG_1547.jpeg'), alt: 'Kreativt håndarbeid' },
      { src: encodeURI('images/kreativt håndarbeid/IMG_6259.jpeg'), alt: 'Kreativt håndarbeid' },
      { src: encodeURI('images/kreativt håndarbeid/IMG_8347.JPG'), alt: 'Kreativt håndarbeid' },
      { src: encodeURI('images/kreativt håndarbeid/IMG_8839.JPG'), alt: 'Kreativt håndarbeid' },
      { src: encodeURI('images/kreativt håndarbeid/IMG_9188.JPG'), alt: 'Kreativt håndarbeid' }
    ],
    fotografering: [
      { src: encodeURI('images/fotografering/BBCC2437-DD2A-4A72-AA07-82F7C7B37C90.JPG'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/DSC08211.JPG'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/DSC08546.JPG'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/DSC08808.JPG'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_0321.jpeg'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_2072.jpeg'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_2096.JPG'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_2618.jpeg'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_2623.jpeg'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_5493.jpeg'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_6814.jpeg'), alt: 'Fotografering' },
      { src: encodeURI('images/fotografering/IMG_9359.jpeg'), alt: 'Fotografering' }
    ]
  };

  document.querySelectorAll('.p-gallery').forEach((gallery) => {
    const images = [...gallery.querySelectorAll('img')];
    const galleryImages = images.map((img) => ({ src: img.src, alt: img.alt || '' }));

    images.forEach((img, index) => {
      img.tabIndex = 0;
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLb(galleryImages, index));
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLb(galleryImages, index);
        }
      });
    });
  });

  document.querySelectorAll('.interest-card[data-interest]').forEach((card) => {
    const key = card.dataset.interest;
    const images = INTEREST_IMAGES[key] || [];

    card.addEventListener('click', () => {
      if (images.length) openLb(images, 0);
    });

    card.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && images.length) {
        event.preventDefault();
        openLb(images, 0);
      }
    });
  });
})();
