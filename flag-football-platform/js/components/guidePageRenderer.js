// js/components/guidePageRenderer.js
// Renders the inner content of each guide page from its data object.
// Called by nflGuide.js — returns an HTML string for injection into .guide-page-body

import { renderCarousel }   from './guideCarousel.js';
import { renderAccordion }  from './guideAccordion.js';
import { renderVideoBlock } from './guideVideo.js';
import { renderSocialLink } from './socialIcons.js';
import { GUIDE_SECTIONS }   from '../data/nflGuidePages.js';

// ─────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────
export function renderPageContent(page) {
  const sectionMeta = GUIDE_SECTIONS[page.section];
  const color = sectionMeta?.color || { bg: '#F1EFE8', text: '#444441', border: '#D3D1C7' };

  let html = '';

  // Section chip
  html += `<div class="guide-section-chip" style="background:${color.bg};color:${color.text};border:1px solid ${color.border}">
    ${sectionMeta?.label || page.section}
  </div>`;

  // Page title
  html += `<h1 class="guide-page-title">${page.title}</h1>`;

  // Body text
  html += `<p class="guide-body-text">${page.body}</p>`;

  // PDF download (page 1 only)
  if (page.pdfDownload) {
    html += renderPdfDownload(page.pdfDownload);
  }

  // Images / carousel
  if (page.images && page.images.length > 0) {
    html += renderCarousel(page.images, `car-${page.id}`);
  }

  // Video embed
  if (page.videoUrl) {
    html += renderVideoBlock(page.videoUrl, page.videoLabel || null);
  }

  // Glossary (terminology page)
  if (page.glossary && page.glossary.length > 0) {
    html += renderGlossary(page.glossary);
  }

  // Equipment checklist
  if (page.checklist && page.checklist.length > 0) {
    html += renderChecklist(page.checklist);
  }

  // Key differences list (one-way field)
  if (page.keyDifferences && page.keyDifferences.length > 0) {
    html += renderKeyDifferences(page.keyDifferences);
  }

  // Comparison table (tournament vs regular)
  if (page.comparisonTable && page.comparisonTable.length > 0) {
    html += renderComparisonTable(page.comparisonTable);
  }

  // Scoring values table
  if (page.scoringValues && page.scoringValues.length > 0) {
    html += renderScoringTable(page.scoringValues);
  }

  // Overtime rounds
  if (page.overtimeRounds && page.overtimeRounds.length > 0) {
    html += renderOvertimeRounds(page.overtimeRounds);
  }

  // Dead ball triggers
  if (page.deadBallTriggers && page.deadBallTriggers.length > 0) {
    html += renderTriggerList(page.deadBallTriggers, 'Dead ball triggers');
  }

  // Penalty table
  if (page.penaltyTable && page.penaltyTable.length > 0) {
    html += renderPenaltyTable(page.penaltyTable);
  }

  // Tournament callout banner
  if (page.tournamentCallout && page.tournamentNote) {
    html += renderTournamentCallout(page.tournamentNote);
  }

  // Extended description accordion
  if (page.expandedBody) {
    html += renderAccordion(
      `expand-${page.id}`,
      'More detail',
      `<p class="acc-text">${page.expandedBody}</p>`
    );
  }

  // Rulebook reference
  if (page.rulebookRef) {
    html += renderRulebookRef(page.rulebookRef);
  }

  // FAQs
  if (page.faqs && page.faqs.length > 0) {
    html += renderFAQs(page.faqs, page.id);
  }

  // Closing page CTA
  if (page.closingCTA) {
    html += renderClosingCTA(page.closingCTA);
  }

  return html;
}

// ─────────────────────────────────────────────
// Sub-renderers
// ─────────────────────────────────────────────

function renderPdfDownload({ label, src }) {
  return `
    <a href="${src}" download class="guide-pdf-download" target="_blank" rel="noopener">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2v9M9 11l-3-3M9 11l3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 13v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>${label}</span>
    </a>`;
}

function renderGlossary(glossary) {
  const rows = glossary.map(({ term, def }) => `
    <div class="glossary-row">
      <dt class="glossary-term">${term}</dt>
      <dd class="glossary-def">${def}</dd>
    </div>`).join('');
  return `<dl class="guide-glossary">${rows}</dl>`;
}

function renderChecklist(items) {
  const rows = items.map(({ item, required }) => `
    <li class="checklist-item ${required ? 'required' : 'optional'}">
      <span class="check-icon" aria-hidden="true">
        ${required
          ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#1D9E75"/><path d="M4.5 7L6.5 9L9.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#B4B2A9" stroke-width="1"/><path d="M4.5 7L6.5 9L9.5 5.5" stroke="#B4B2A9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        }
      </span>
      <span class="check-text">${item}</span>
      ${required ? '' : '<span class="check-badge">optional</span>'}
    </li>`).join('');
  return `<ul class="guide-checklist">${rows}</ul>`;
}

function renderKeyDifferences(items) {
  const rows = items.map(item => `
    <li class="diff-item">
      <span class="diff-bullet" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="3" fill="#5DCAA5"/></svg>
      </span>
      ${item}
    </li>`).join('');
  return `
    <div class="guide-block">
      <div class="guide-block-label">Key differences from standard rules</div>
      <ul class="diff-list">${rows}</ul>
    </div>`;
}

function renderComparisonTable(rows) {
  const trs = rows.map(({ rule, regular, tournament }) => `
    <tr>
      <td class="cmp-rule">${rule}</td>
      <td class="cmp-regular">${regular}</td>
      <td class="cmp-tournament">${tournament}</td>
    </tr>`).join('');
  return `
    <div class="guide-table-wrap">
      <table class="guide-table cmp-table">
        <thead>
          <tr>
            <th>Rule</th>
            <th>Regular season</th>
            <th>Tournament</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
    </div>`;
}

function renderScoringTable(values) {
  const trs = values.map(({ play, points, note }) => `
    <tr>
      <td class="score-play">${play}</td>
      <td class="score-pts">${points}</td>
      <td class="score-note">${note}</td>
    </tr>`).join('');
  return `
    <div class="guide-table-wrap">
      <table class="guide-table score-table">
        <thead>
          <tr><th>Play</th><th>Points</th><th>Note</th></tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
    </div>`;
}

function renderOvertimeRounds(rounds) {
  const cards = rounds.map(({ round, rule }) => `
    <div class="ot-card">
      <div class="ot-round">${round}</div>
      <div class="ot-rule">${rule}</div>
    </div>`).join('');
  return `<div class="ot-rounds">${cards}</div>`;
}

function renderTriggerList(triggers, label) {
  const items = triggers.map((t, i) => `
    <li class="trigger-item">
      <span class="trigger-alpha">${String.fromCharCode(97 + i)}.</span>
      ${t}
    </li>`).join('');
  return `
    <div class="guide-block">
      <div class="guide-block-label">${label}</div>
      <ul class="trigger-list">${items}</ul>
    </div>`;
}

function renderPenaltyTable(penalties) {
  const spotRows    = penalties.filter(p => p.type === 'spot');
  const generalRows = penalties.filter(p => p.type === 'general');

  let html = '<div class="guide-table-wrap">';

  if (spotRows.length > 0) {
    html += `
      <div class="penalty-group-label">Spot fouls</div>
      <table class="guide-table penalty-table">
        <thead><tr><th>Foul</th><th>Result</th></tr></thead>
        <tbody>
          ${spotRows.map(p => `<tr><td>${p.foul}</td><td class="penalty-result">${p.result}</td></tr>`).join('')}
        </tbody>
      </table>`;
  }

  if (generalRows.length > 0) {
    html += `
      <div class="penalty-group-label" style="margin-top:16px">Line of scrimmage penalties</div>
      <table class="guide-table penalty-table">
        <thead><tr><th>Foul</th><th>Result</th></tr></thead>
        <tbody>
          ${generalRows.map(p => `<tr><td>${p.foul}</td><td class="penalty-result">${p.result}</td></tr>`).join('')}
        </tbody>
      </table>`;
  }

  html += '</div>';
  return html;
}

function renderTournamentCallout(note) {
  return `
    <div class="guide-tournament-callout">
      <span class="tc-badge">Tournament</span>
      <p class="tc-text">${note}</p>
    </div>`;
}

function renderRulebookRef({ label, page }) {
  return `
    <div class="guide-rulebook-ref">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1"/>
        <path d="M4.5 4.5h5M4.5 7h5M4.5 9.5h3" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
      </svg>
      <span>${label}${page ? ` — p.${page}` : ''}</span>
    </div>`;
}

function renderFAQs(faqs, pageId) {
  const items = faqs.map((faq, i) =>
    renderAccordion(
      `faq-${pageId}-${i}`,
      faq.q,
      `<p class="acc-text">${faq.a}</p>`
    )
  ).join('');

  return `
    <div class="guide-faqs">
      <div class="guide-block-label">Frequently asked questions</div>
      ${items}
    </div>`;
}

function renderClosingCTA({ message, creator }) {
  const socials = creator.socials.map(s => renderSocialLink(s)).join('');
  return `
    <div class="guide-closing-cta">
      <div class="closing-complete-badge">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1"/>
          <path d="M8 14l4 4 8-8" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Guide complete</span>
      </div>
      <p class="closing-message">${message}</p>
      <div class="closing-creator">
        <div class="creator-avatar">GD</div>
        <div class="creator-info">
          <div class="creator-name">${creator.name}</div>
          <div class="creator-tagline">${creator.tagline}</div>
        </div>
      </div>
      <div class="closing-socials">${socials}</div>
    </div>`;
}
