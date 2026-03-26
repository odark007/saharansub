// js/views/nflGuide.js
// NFL Flag Referee Guide — main view
// Renders the full guide shell with progress bar, page content,
// prev/next navigation, and save-on-advance behaviour.

import { NFL_GUIDE_PAGES, TOTAL_PAGES } from '../data/nflGuidePages.js';
import { renderPageContent }            from '../components/guidePageRenderer.js';
import {
  loadProgress,
  advancePage,
  navigateToPage,
  getProgressPercent,
  isGuideComplete,
} from '../services/guideProgress.js';
import { showToast, showLoading, hideLoading } from '../utils.js';

// ─────────────────────────────────────────────
// State (module-level, reset on each renderNflGuide call)
// ─────────────────────────────────────────────
let _currentPage     = 1;
let _completedPages  = [];

// ─────────────────────────────────────────────
// Entry point — called by router
// ─────────────────────────────────────────────
export async function renderNflGuide() {
  const container = document.getElementById('view-container');
  showLoading('Loading guide...');

  try {
    const progress = await loadProgress();
    _currentPage    = progress.currentPage    || 1;
    _completedPages = progress.completedPages || [];
  } catch {
    _currentPage    = 1;
    _completedPages = [];
  }

  hideLoading();
  injectGuideStyles();
  renderShell(container);
  renderPage(_currentPage);
}

// ─────────────────────────────────────────────
// Shell — rendered once, page content swaps inside
// ─────────────────────────────────────────────
function renderShell(container) {
  container.innerHTML = `
    <div class="guide-shell" id="guide-shell">

      <!-- Top progress bar -->
      <div class="guide-prog-track" role="progressbar" aria-valuemin="1" aria-valuemax="${TOTAL_PAGES}" aria-valuenow="${_currentPage}">
        <div class="guide-prog-bar" id="guide-prog-bar"></div>
      </div>

      <!-- Header row: section label | page counter | save badge -->
      <div class="guide-meta-row">
        <span class="guide-section-label" id="guide-section-label"></span>
        <span class="guide-page-counter" id="guide-page-counter"></span>
        <span class="guide-save-badge" id="guide-save-badge" aria-live="polite" aria-atomic="true">
          <span class="save-dot"></span>Saved
        </span>
      </div>

      <!-- Scrollable page content area -->
      <div class="guide-page-body" id="guide-page-body">
        <!-- injected by renderPage() -->
      </div>

      <!-- Footer navigation -->
      <nav class="guide-nav-footer" aria-label="Guide navigation">
        <button
          class="guide-nav-btn guide-nav-prev"
          id="guide-btn-prev"
          aria-label="Previous page"
          onclick="guideNavPrev()"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Prev
        </button>

        <!-- Dot indicators (up to 24, clickable) -->
        <div class="guide-dots-row" id="guide-dots-row" aria-label="Page indicators"></div>

        <button
          class="guide-nav-btn guide-nav-next"
          id="guide-btn-next"
          aria-label="Next page"
          onclick="guideNavNext()"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>
    </div>`;
}

// ─────────────────────────────────────────────
// Page renderer — swaps content, updates meta
// ─────────────────────────────────────────────
function renderPage(pageNumber) {
  const page = NFL_GUIDE_PAGES[pageNumber - 1];
  if (!page) return;

  _currentPage = pageNumber;

  // Inject content
  const body = document.getElementById('guide-page-body');
  if (body) {
    body.innerHTML = renderPageContent(page);
    body.scrollTop = 0;
    // Also scroll the main window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateMeta(page);
  updateNavButtons(pageNumber);
  updateDots(pageNumber);
  flashSaveBadge();
}

function updateMeta(page) {
  const { GUIDE_SECTIONS } = /** @type {any} */ (window.__guideData || {});

  // Progress bar
  const pct = Math.round((_currentPage / TOTAL_PAGES) * 100);
  const bar = document.getElementById('guide-prog-bar');
  if (bar) bar.style.width = pct + '%';

  // ARIA
  const track = document.querySelector('.guide-prog-track');
  if (track) track.setAttribute('aria-valuenow', _currentPage);

  // Section label
  const sectionEl = document.getElementById('guide-section-label');
  if (sectionEl) {
    // Import section meta inline to avoid circular dep
    const sectionLabels = {
      OPENING:    'Opening',
      BEFORE:     'Before the game',
      FIELD:      'Field setup',
      MANAGEMENT: 'Game management',
      LIVEPLAY:   'Live play rules',
      CONDUCT:    'Conduct & penalties',
      AGEGROUPS:  'Age group rules',
      CLOSING:    'Closing',
    };
    sectionEl.textContent = sectionLabels[page.section] || page.section;
  }

  // Page counter
  const counter = document.getElementById('guide-page-counter');
  if (counter) counter.textContent = `${_currentPage} / ${TOTAL_PAGES}`;
}

function updateNavButtons(pageNumber) {
  const prevBtn = document.getElementById('guide-btn-prev');
  const nextBtn = document.getElementById('guide-btn-next');
  if (!prevBtn || !nextBtn) return;

  // Prev
  prevBtn.disabled = pageNumber <= 1;

  // Next — last page shows "Finish" instead
  if (pageNumber >= TOTAL_PAGES) {
    nextBtn.innerHTML = `
      Done
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    nextBtn.classList.add('guide-nav-done');
  } else {
    nextBtn.innerHTML = `
      Next
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    nextBtn.classList.remove('guide-nav-done');
  }

  // First page: hide Prev, show full-width "Start guide" next
  if (pageNumber === 1) {
    prevBtn.style.visibility = 'hidden';
    nextBtn.textContent = 'Start guide →';
    nextBtn.classList.add('guide-nav-start');
  } else {
    prevBtn.style.visibility = 'visible';
    nextBtn.classList.remove('guide-nav-start');
  }
}

function updateDots(pageNumber) {
  const row = document.getElementById('guide-dots-row');
  if (!row) return;

  row.innerHTML = '';
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const btn = document.createElement('button');
    btn.className = [
      'guide-dot',
      i === pageNumber ? 'current' : '',
      _completedPages.includes(i) ? 'done' : '',
    ].filter(Boolean).join(' ');
    btn.setAttribute('aria-label', `Go to page ${i}`);
    btn.setAttribute('title', NFL_GUIDE_PAGES[i - 1]?.title || `Page ${i}`);
    btn.dataset.page = i;
    btn.addEventListener('click', () => guideGoToPage(i));
    row.appendChild(btn);
  }
}

function flashSaveBadge() {
  const badge = document.getElementById('guide-save-badge');
  if (!badge) return;
  badge.classList.add('flash');
  setTimeout(() => badge.classList.remove('flash'), 1200);
}

// ─────────────────────────────────────────────
// Navigation handlers (called from onclick attrs)
// ─────────────────────────────────────────────
window.guideNavNext = async function () {
  if (_currentPage >= TOTAL_PAGES) {
    // Final page — show completion toast and navigate home
    showToast('Guide complete! Well done, referee.', 'success');
    setTimeout(() => window.app?.router?.navigate('/'), 1800);
    return;
  }

  try {
    const result = await advancePage(_currentPage);
    _currentPage    = result.currentPage;
    _completedPages = result.completedPages;
    renderPage(_currentPage);
  } catch {
    showToast('Could not save progress. Check your connection.', 'warning');
    // Still advance visually
    renderPage(Math.min(_currentPage + 1, TOTAL_PAGES));
  }
};

window.guideNavPrev = async function () {
  if (_currentPage <= 1) return;
  try {
    const result = await navigateToPage(_currentPage - 1);
    _currentPage = result.currentPage;
    renderPage(_currentPage);
  } catch {
    renderPage(_currentPage - 1);
  }
};

window.guideGoToPage = async function (pageNumber) {
  if (pageNumber === _currentPage) return;
  try {
    const result = await navigateToPage(pageNumber);
    _currentPage = result.currentPage;
    renderPage(_currentPage);
  } catch {
    _currentPage = pageNumber;
    renderPage(_currentPage);
  }
};

// ─────────────────────────────────────────────
// CSS — injected once into <head>
// ─────────────────────────────────────────────
function injectGuideStyles() {
  if (document.getElementById('guide-styles')) return;

  const style = document.createElement('style');
  style.id = 'guide-styles';
  style.textContent = `

/* ── Shell ─────────────────────────────────── */
.guide-shell {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 32px;
  font-family: 'Georgia', 'Cambria', serif;
}

/* ── Progress bar ───────────────────────────── */
.guide-prog-track {
  height: 5px;
  background: var(--medium-gray, #ccc);
  border-radius: 3px;
  margin-bottom: 16px;
  overflow: hidden;
}
.guide-prog-bar {
  height: 100%;
  background: #1D9E75;
  border-radius: 3px;
  transition: width 0.45s ease;
  width: 0%;
}

/* ── Meta row ───────────────────────────────── */
.guide-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}
.guide-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--dark-gray, #333);
  font-family: var(--font-family, sans-serif);
}
.guide-page-counter {
  font-size: 12px;
  color: #888;
  font-family: var(--font-family, sans-serif);
}
.guide-save-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #085041;
  background: #E1F5EE;
  padding: 3px 9px;
  border-radius: 20px;
  font-family: var(--font-family, sans-serif);
  transition: opacity 0.3s;
}
.save-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #1D9E75;
}
.guide-save-badge.flash {
  animation: saveFlash 1.2s ease;
}
@keyframes saveFlash {
  0%,100% { opacity:1 }
  40%      { opacity:0.4 }
}

/* ── Page body ──────────────────────────────── */
.guide-page-body {
  min-height: 320px;
  animation: pageFadeIn 0.3s ease;
}
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Section chip ───────────────────────────── */
.guide-section-chip {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 12px;
  border-radius: 20px;
  margin-bottom: 10px;
  font-family: var(--font-family, sans-serif);
}

/* ── Typography ─────────────────────────────── */
.guide-page-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--dark-gray, #222);
  margin-bottom: 14px;
  font-family: 'Georgia', 'Cambria', serif;
}
.guide-body-text {
  font-size: 15px;
  line-height: 1.75;
  color: #444;
  margin-bottom: 18px;
  font-family: var(--font-family, sans-serif);
}

/* ── PDF download ───────────────────────────── */
.guide-pdf-download {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #E1F5EE;
  color: #085041;
  border: 1px solid #9FE1CB;
  border-radius: 10px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
  font-family: var(--font-family, sans-serif);
  transition: background 0.15s;
}
.guide-pdf-download:hover { background: #C5ECD8; }

/* ── Images ─────────────────────────────────── */
.guide-img {
  width: 100%;
  border-radius: 12px;
  display: block;
  object-fit: cover;
  max-height: 220px;
}
.guide-single-image { margin-bottom: 18px; }

/* ── Carousel ───────────────────────────────── */
.guide-carousel {
  position: relative;
  margin-bottom: 18px;
  border-radius: 12px;
  overflow: hidden;
}
.car-track { position: relative; }
.car-slide { display: none; }
.car-slide.active { display: block; }
.car-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
  color: #333;
  transition: background 0.15s;
}
.car-btn:hover { background: white; }
.car-btn-prev { left: 8px; }
.car-btn-next { right: 8px; }
.car-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 8px 0 4px;
  background: var(--white, white);
}
.car-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #ccc;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}
.car-dot.active {
  background: #1D9E75;
  transform: scale(1.25);
}

/* ── Video block ────────────────────────────── */
.guide-video-block { margin-bottom: 18px; border-radius: 12px; overflow: hidden; }
.vid-poster {
  position: relative;
  cursor: pointer;
  background: #1a1a2e;
  aspect-ratio: 16 / 9;
  display: flex; align-items: center; justify-content: center;
}
.vid-thumb-img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.75;
}
.vid-overlay {
  position: absolute;
  inset: 0;
  display: flex; align-items: center; justify-content: center;
}
.vid-play-btn { transition: transform 0.2s; }
.vid-poster:hover .vid-play-btn { transform: scale(1.1); }
.vid-label {
  padding: 8px 12px;
  font-size: 12px;
  color: #666;
  background: var(--white, white);
  font-family: var(--font-family, sans-serif);
}
.vid-iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  display: block;
}

/* ── Accordion ──────────────────────────────── */
.guide-accordion {
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}
.acc-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #F8F8F8;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 8px;
}
.acc-header:hover { background: #F0F0F0; }
.acc-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dark-gray, #222);
  font-family: var(--font-family, sans-serif);
}
.acc-icon {
  flex-shrink: 0;
  color: #888;
  transition: transform 0.25s;
}
.acc-header.open .acc-icon { transform: rotate(180deg); }
.acc-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  border-top: 1px solid #E5E5E5;
}
.acc-inner { padding: 14px 16px; }
.acc-text {
  font-size: 13px;
  line-height: 1.7;
  color: #555;
  margin: 0;
  font-family: var(--font-family, sans-serif);
}

/* ── Rulebook ref ───────────────────────────── */
.guide-rulebook-ref {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-left: 3px solid #1D9E75;
  background: #E1F5EE;
  border-radius: 0 8px 8px 0;
  margin-bottom: 14px;
  font-size: 12px;
  color: #085041;
  font-family: var(--font-family, sans-serif);
}

/* ── Tournament callout ─────────────────────── */
.guide-tournament-callout {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: #FAEEDA;
  border: 1px solid #FAC775;
  border-radius: 10px;
  margin-bottom: 14px;
}
.tc-badge {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #633806;
  background: #EF9F27;
  padding: 3px 8px;
  border-radius: 6px;
  margin-top: 1px;
  font-family: var(--font-family, sans-serif);
}
.tc-text {
  font-size: 13px;
  line-height: 1.65;
  color: #633806;
  margin: 0;
  font-family: var(--font-family, sans-serif);
}

/* ── FAQs ───────────────────────────────────── */
.guide-faqs { margin-bottom: 14px; }

/* ── Block label ────────────────────────────── */
.guide-block { margin-bottom: 16px; }
.guide-block-label,
.penalty-group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
  font-family: var(--font-family, sans-serif);
}

/* ── Glossary ───────────────────────────────── */
.guide-glossary { margin-bottom: 18px; }
.glossary-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 8px 12px;
  padding: 9px 0;
  border-bottom: 1px solid #F0F0F0;
  font-family: var(--font-family, sans-serif);
}
.glossary-row:last-child { border-bottom: none; }
.glossary-term {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-blue, #013369);
}
.glossary-def {
  font-size: 13px;
  color: #555;
  line-height: 1.55;
  margin: 0;
}
@media (max-width: 420px) {
  .glossary-row { grid-template-columns: 1fr; gap: 2px 0; }
}

/* ── Checklist ──────────────────────────────── */
.guide-checklist {
  list-style: none;
  margin-bottom: 18px;
  display: grid;
  gap: 6px;
}
.checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #333;
  padding: 8px 12px;
  background: #F8F8F8;
  border-radius: 8px;
  font-family: var(--font-family, sans-serif);
}
.checklist-item.optional { color: #888; }
.check-icon { flex-shrink: 0; }
.check-text { flex: 1; }
.check-badge {
  font-size: 10px;
  color: #888;
  background: #E5E5E5;
  padding: 1px 6px;
  border-radius: 4px;
}

/* ── Diff list ──────────────────────────────── */
.diff-list {
  list-style: none;
  display: grid;
  gap: 6px;
  margin-bottom: 4px;
}
.diff-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #444;
  line-height: 1.55;
  font-family: var(--font-family, sans-serif);
}
.diff-bullet { flex-shrink: 0; margin-top: 4px; }

/* ── Tables ─────────────────────────────────── */
.guide-table-wrap {
  overflow-x: auto;
  margin-bottom: 18px;
  border-radius: 10px;
  border: 1px solid #E5E5E5;
}
.guide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  font-family: var(--font-family, sans-serif);
}
.guide-table thead tr {
  background: #F3F3F3;
}
.guide-table th {
  padding: 9px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #666;
  border-bottom: 1px solid #E5E5E5;
}
.guide-table td {
  padding: 9px 12px;
  border-bottom: 1px solid #F0F0F0;
  color: #333;
  vertical-align: top;
  line-height: 1.5;
}
.guide-table tr:last-child td { border-bottom: none; }
.guide-table tr:nth-child(even) { background: #FAFAFA; }
.cmp-tournament { color: #633806; font-weight: 500; }
.score-pts { font-weight: 700; color: var(--primary-blue, #013369); text-align: center; }
.penalty-result { color: #712B13; font-weight: 500; }

/* ── Overtime rounds ────────────────────────── */
.ot-rounds {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}
.ot-card {
  padding: 14px 16px;
  background: #FAEEDA;
  border: 1px solid #FAC775;
  border-radius: 10px;
}
.ot-round {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #854F0B;
  margin-bottom: 5px;
  font-family: var(--font-family, sans-serif);
}
.ot-rule {
  font-size: 13px;
  color: #633806;
  line-height: 1.6;
  font-family: var(--font-family, sans-serif);
}

/* ── Trigger list ───────────────────────────── */
.trigger-list {
  list-style: none;
  display: grid;
  gap: 5px;
  margin-bottom: 4px;
}
.trigger-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: #444;
  padding: 7px 12px;
  background: #F8F8F8;
  border-radius: 7px;
  font-family: var(--font-family, sans-serif);
}
.trigger-alpha { font-weight: 600; color: #888; flex-shrink: 0; }

/* ── Closing page ───────────────────────────── */
.guide-closing-cta {
  text-align: center;
  padding: 24px 0 16px;
}
.closing-complete-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #085041;
  background: #E1F5EE;
  padding: 8px 18px;
  border-radius: 30px;
  margin-bottom: 18px;
  font-family: var(--font-family, sans-serif);
}
.closing-message {
  font-size: 15px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 22px;
  font-family: var(--font-family, sans-serif);
}
.closing-creator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
}
.creator-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: #013369;
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 15px;
  font-family: var(--font-family, sans-serif);
  flex-shrink: 0;
}
.creator-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--dark-gray, #222);
  font-family: var(--font-family, sans-serif);
  text-align: left;
}
.creator-tagline {
  font-size: 12px;
  color: #888;
  font-family: var(--font-family, sans-serif);
  text-align: left;
}
.closing-socials {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E5E5E5;
  text-decoration: none;
  color: #333;
  background: white;
  transition: all 0.15s;
  min-width: 64px;
}
.social-link:hover { transform: translateY(-2px); border-color: #ccc; }
.social-label { font-size: 10px; font-weight: 600; font-family: var(--font-family, sans-serif); }
.social-tiktok   { color: #010101; }
.social-youtube  { color: #FF0000; }
.social-linkedin { color: #0A66C2; }
.social-twitter  { color: #000000; }

/* ── Footer navigation ──────────────────────── */
.guide-nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #F0F0F0;
  margin-top: 8px;
}
.guide-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1.5px solid #E0E0E0;
  background: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
  font-family: var(--font-family, sans-serif);
  transition: all 0.15s;
  white-space: nowrap;
}
.guide-nav-btn:hover:not(:disabled) {
  border-color: #1D9E75;
  color: #085041;
}
.guide-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.guide-nav-next {
  background: #013369;
  color: white;
  border-color: #013369;
}
.guide-nav-next:hover:not(:disabled) {
  background: #01255C;
  border-color: #01255C;
  color: white;
}
.guide-nav-done {
  background: #1D9E75;
  border-color: #1D9E75;
}
.guide-nav-start {
  flex: 1;
  justify-content: center;
}

/* ── Dot indicators ─────────────────────────── */
.guide-dots-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 200px;
}
.guide-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #D8D8D8;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.guide-dot.done { background: #9FE1CB; }
.guide-dot.current {
  background: #013369;
  transform: scale(1.35);
}

/* ── Mobile tweaks ──────────────────────────── */
@media (max-width: 480px) {
  .guide-page-title { font-size: 22px; }
  .guide-nav-footer { gap: 6px; }
  .guide-nav-btn { padding: 9px 13px; font-size: 12px; }
  .guide-dots-row { max-width: 160px; }
  .glossary-row { grid-template-columns: 1fr; }
}
  `;
  document.head.appendChild(style);
}
