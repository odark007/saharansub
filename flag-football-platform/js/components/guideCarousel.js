// js/components/guideCarousel.js
// Horizontal image carousel for guide pages
// Usage: renderCarousel(images, containerId)

export function renderCarousel(images, containerId) {
  if (!images || images.length === 0) return '';

  if (images.length === 1) {
    return `
      <div class="guide-single-image">
        <img
          src="${images[0].src}"
          alt="${images[0].alt}"
          class="guide-img"
          onerror="this.closest('.guide-single-image').style.display='none'"
        />
      </div>`;
  }

  const id = containerId || 'carousel-' + Math.random().toString(36).substr(2, 6);
  const dots = images.map((_, i) =>
    `<button class="car-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`
  ).join('');

  const slides = images.map((img, i) =>
    `<div class="car-slide ${i === 0 ? 'active' : ''}" aria-hidden="${i !== 0}">
      <img
        src="${img.src}"
        alt="${img.alt}"
        class="guide-img"
        onerror="this.closest('.car-slide').style.display='none'"
      />
    </div>`
  ).join('');

  return `
    <div class="guide-carousel" id="${id}" data-index="0" data-total="${images.length}">
      <div class="car-track">${slides}</div>
      <button class="car-btn car-btn-prev" aria-label="Previous image" onclick="carouselNav('${id}', -1)">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="car-btn car-btn-next" aria-label="Next image" onclick="carouselNav('${id}', 1)">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="car-dots">${dots}</div>
    </div>`;
}

window.carouselNav = function (id, dir) {
  const el = document.getElementById(id);
  if (!el) return;
  const total = parseInt(el.dataset.total);
  let idx = parseInt(el.dataset.index);
  idx = (idx + dir + total) % total;
  el.dataset.index = idx;

  el.querySelectorAll('.car-slide').forEach((s, i) => {
    s.classList.toggle('active', i === idx);
    s.setAttribute('aria-hidden', i !== idx);
  });
  el.querySelectorAll('.car-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
};
