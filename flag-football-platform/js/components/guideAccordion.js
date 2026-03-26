// js/components/guideAccordion.js
// Expand/collapse accordion for guide page sections
// Usage: renderAccordion(id, heading, content)

export function renderAccordion(id, heading, contentHtml) {
  return `
    <div class="guide-accordion" id="acc-${id}">
      <button
        class="acc-header"
        aria-expanded="false"
        aria-controls="acc-body-${id}"
        onclick="toggleAccordion('${id}')"
      >
        <span class="acc-title">${heading}</span>
        <span class="acc-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>
      <div class="acc-body" id="acc-body-${id}" role="region" aria-labelledby="acc-${id}" hidden>
        <div class="acc-inner">${contentHtml}</div>
      </div>
    </div>`;
}

window.toggleAccordion = function (id) {
  const header = document.querySelector(`#acc-${id} .acc-header`);
  const body   = document.getElementById(`acc-body-${id}`);
  if (!header || !body) return;

  const isOpen = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', !isOpen);
  header.classList.toggle('open', !isOpen);

  if (isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    // Force layout reflow
    void body.offsetHeight;
    body.style.maxHeight = '0';
    body.addEventListener('transitionend', () => {
      body.hidden = true;
      body.style.maxHeight = '';
    }, { once: true });
  } else {
    body.hidden = false;
    body.style.maxHeight = '0';
    // Force layout reflow
    void body.offsetHeight;
    body.style.maxHeight = body.scrollHeight + 'px';
    body.addEventListener('transitionend', () => {
      body.style.maxHeight = 'none';
    }, { once: true });
  }
};
