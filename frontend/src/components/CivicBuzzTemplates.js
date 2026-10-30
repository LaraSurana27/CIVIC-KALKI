/**
 * CIVIC-KALKI — Civic Buzz Templates Engine
 *
 * Exactly 3 reusable HTML/CSS card layouts:
 * 1. Meme: Big top/bottom caption over the photo (Impact/bold uppercase drop-shadow).
 * 2. Awareness: Photo with a fact strip (category/area/status) and call-to-action.
 * 3. Initiative: Photo with a date/place/"Join" strip.
 *
 * Requirements:
 * - Issue's own photo is the background (with high-quality civic fallback).
 * - Small "CIVIC-KALKI" watermark.
 * - In-browser PNG rendering via html-to-image.
 * - No free-form canvas, no extra templates, no image editing.
 */

import { toPng } from 'html-to-image';
import { BI } from './CivicBuzzIcons.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

export const DEFAULT_CIVIC_BG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%231e293b"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20 L40 20 M20 0 L20 40" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern></defs><rect width="800" height="800" fill="url(%23g)"/><rect width="800" height="800" fill="url(%23p)"/><circle cx="400" cy="400" r="260" fill="none" stroke="rgba(255,90,54,0.15)" stroke-width="3" stroke-dasharray="8 8"/><text x="400" y="415" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="32" fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="4">CIVIC KALKI</text></svg>';

/**
 * Splits caption into top and bottom phrases for meme template.
 */
export function splitMemeCaption(caption = '') {
  const clean = String(caption).trim();
  if (!clean) return { top: '', bottom: '' };

  // Explicit split if user used // or newline
  if (clean.includes('\n')) {
    const parts = clean.split('\n').filter(Boolean);
    return { top: parts[0] || '', bottom: parts.slice(1).join(' ') || '' };
  }
  if (clean.includes(' // ')) {
    const [top, ...rest] = clean.split(' // ');
    return { top, bottom: rest.join(' // ') };
  }

  // Heuristic split at midpoint or punctuation
  const sentences = clean.split(/(?<=[.?!])\s+/);
  if (sentences.length >= 2) {
    return { top: sentences[0], bottom: sentences.slice(1).join(' ') };
  }

  const words = clean.split(/\s+/);
  if (words.length <= 4) {
    return { top: '', bottom: clean };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    top: words.slice(0, mid).join(' '),
    bottom: words.slice(mid).join(' '),
  };
}

/**
 * Renders the exact HTML structure for the 3 specified card templates.
 * Dimensions: 600x600 fixed canvas container.
 */
export function renderCardHtml({
  template = 'meme',
  style = 'funny',
  caption = '',
  cta_text = '',
  issue = {},
  imageUrl = null,
}) {
  const bg = imageUrl || issue.image_url || DEFAULT_CIVIC_BG;
  const issueTitle = issue.name || issue.title || 'Civic Issue';
  const issueArea = issue.area || 'City Ward';
  const issueStatus = issue.status || 'Active';
  const issueId = issue.entity_id || issue.id || '—';
  const isInitiative = template === 'initiative' || issue.entity_type_id === 2 || issue.type === 'initiative';

  // Common Watermark Badge
  const watermarkHtml = `
    <div class="ck-card-watermark">
      <span class="ck-wm-flame">${BI.flame(14, '#ff5a36')}</span>
      <span class="ck-wm-brand">CIVIC-KALKI</span>
    </div>
  `;

  // ─────────────────────────────────────────────────────────────
  // 1. MEME TEMPLATE: Big top/bottom caption over photo
  // ─────────────────────────────────────────────────────────────
  if (template === 'meme') {
    const { top, bottom } = splitMemeCaption(caption);
    const cta = cta_text || 'Take Civic Action';

    return `
      <div class="ck-card-canvas ck-template-meme" data-template="meme" data-style="${escapeHtml(style)}">
        <div class="ck-card-bg-layer" style="background-image: url('${escapeHtml(bg)}');"></div>
        <div class="ck-card-meme-overlay"></div>
        
        ${watermarkHtml}

        <div class="ck-meme-top-bar">
          <span class="ck-meme-issue-tag" style="display:inline-flex; align-items:center; gap:4px;">${BI.pin(12, 'currentColor')} ${escapeHtml(issueArea)} · #${escapeHtml(issueId)}</span>
        </div>

        <div class="ck-meme-text-top">
          ${escapeHtml(top)}
        </div>

        <div class="ck-meme-bottom-wrap">
          <div class="ck-meme-text-bottom">
            ${escapeHtml(bottom || top ? bottom : caption)}
          </div>
          ${cta ? `<div class="ck-meme-cta-pill" style="display:inline-flex; align-items:center; gap:5px;">${BI.zap(12, '#ea580c')} ${escapeHtml(cta)}</div>` : ''}
        </div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AWARENESS TEMPLATE: Photo + Fact strip + Call to Action
  // ─────────────────────────────────────────────────────────────
  if (template === 'awareness') {
    const cta = cta_text || 'Demand Immediate Fix';

    return `
      <div class="ck-card-canvas ck-template-awareness" data-template="awareness" data-style="${escapeHtml(style)}">
        <div class="ck-card-bg-layer" style="background-image: url('${escapeHtml(bg)}');"></div>
        <div class="ck-awareness-scrim"></div>

        ${watermarkHtml}

        <!-- Top Header Banner -->
        <div class="ck-awareness-header">
          <div class="ck-awareness-badge">
            <span class="ck-pulse-dot"></span>
            <span>CIVIC AWARENESS BULLETIN</span>
          </div>
          <div class="ck-awareness-id">#${escapeHtml(issueId)}</div>
        </div>

        <!-- Main Caption Headline -->
        <div class="ck-awareness-headline-box">
          <div class="ck-awareness-title">${escapeHtml(issueTitle)}</div>
          <div class="ck-awareness-caption">"${escapeHtml(caption)}"</div>
        </div>

        <!-- Fact Strip -->
        <div class="ck-awareness-fact-strip">
          <div class="ck-fact-item">
            <span class="ck-fact-label">LOCATION</span>
            <span class="ck-fact-value" style="display:inline-flex; align-items:center; gap:4px;">${BI.pin(12, '#38bdf8')} ${escapeHtml(issueArea)}</span>
          </div>
          <div class="ck-fact-item">
            <span class="ck-fact-label">STATUS</span>
            <span class="ck-fact-value ck-status-${escapeHtml(issueStatus).toLowerCase()}">${escapeHtml(issueStatus)}</span>
          </div>
          <div class="ck-fact-item">
            <span class="ck-fact-label">JURISDICTION</span>
            <span class="ck-fact-value">Municipal Corp</span>
          </div>
        </div>

        <!-- Call to Action Strip -->
        <div class="ck-awareness-cta-strip">
          <div class="ck-awareness-cta-text" style="display:inline-flex; align-items:center; gap:6px;">
            <span style="display:inline-flex; align-items:center;">${BI.awareness(16, '#38bdf8')}</span> ${escapeHtml(cta)}
          </div>
          <div class="ck-awareness-cta-btn">ACT NOW →</div>
        </div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. INITIATIVE TEMPLATE: Photo + Date/Place + "Join" strip
  // ─────────────────────────────────────────────────────────────
  const cta = cta_text || 'Join The Community Action';

  return `
    <div class="ck-card-canvas ck-template-initiative" data-template="initiative" data-style="${escapeHtml(style)}">
      <div class="ck-card-bg-layer" style="background-image: url('${escapeHtml(bg)}');"></div>
      <div class="ck-initiative-scrim"></div>

      ${watermarkHtml}

      <!-- Top Initiative Banner -->
      <div class="ck-initiative-header">
        <div class="ck-initiative-tag" style="display:inline-flex; align-items:center; gap:6px;">
          ${BI.initiative(14, '#4ade80')} COMMUNITY INITIATIVE
        </div>
        <span class="ck-initiative-phase">Active Movement</span>
      </div>

      <!-- Main Initiative Callout -->
      <div class="ck-initiative-body">
        <div class="ck-initiative-title">${escapeHtml(issueTitle)}</div>
        <div class="ck-initiative-caption">"${escapeHtml(caption)}"</div>
      </div>

      <!-- Date & Place Strip -->
      <div class="ck-initiative-strip">
        <div class="ck-init-info-pill">
          <span class="ck-init-icon" style="display:inline-flex; align-items:center;">${BI.calendar(16, '#4ade80')}</span>
          <div>
            <div class="ck-init-sub">TIMELINE</div>
            <div class="ck-init-main">This Weekend & Ongoing</div>
          </div>
        </div>
        <div class="ck-init-info-pill">
          <span class="ck-init-icon" style="display:inline-flex; align-items:center;">${BI.pin(16, '#4ade80')}</span>
          <div>
            <div class="ck-init-sub">MEETING POINT</div>
            <div class="ck-init-main">${escapeHtml(issueArea)}</div>
          </div>
        </div>
      </div>

      <!-- Prominent "Join" Strip -->
      <div class="ck-initiative-join-strip">
        <div class="ck-join-cta-content">
          <span class="ck-join-badge" style="display:inline-flex; align-items:center; gap:4px;">${BI.zap(12, '#15803d')} VOLUNTEER</span>
          <span class="ck-join-text">${escapeHtml(cta)}</span>
        </div>
        <button type="button" class="ck-join-action-btn" style="display:inline-flex; align-items:center; gap:6px;">
          <span>Join Now</span> <span style="display:inline-flex; align-items:center;">${BI.handshake(14, '#ffffff')}</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Render a DOM node to a high-resolution PNG Data URL via html-to-image.
 */
export async function renderTemplateToPng(domNode) {
  if (!domNode) throw new Error('DOM node is required for PNG rendering.');

  return await toPng(domNode, {
    quality: 0.95,
    pixelRatio: 2,
    skipFonts: false,
    cacheBust: true,
  });
}

