/**
 * CIVIC-KALKI — Civic Buzz Swipeable Carousel Component
 * Displayed in the Dashboard right-hand sidebar.
 *
 * Features:
 * - 1 card at a time with a peek of the next card
 * - Arrow navigation buttons (< and >)
 * - Touch & mouse drag swiping
 * - Animated dot indicators
 * - 5-second auto-rotation with hover pause
 * - Overlaid bold meme-style caption
 * - Real honest metrics: views, upvotes, shares
 * - Action buttons: "View Issue" (logs click_issue) and "Share" (logs share)
 * - View event logging when a card is shown
 * - Header and card image click opens the full-page gallery (/buzz)
 */

import { buzz } from '../api.js';
import { navigate } from '../router.js';
import { toast, toastSuccess } from './toast.js';
import { openBuzzCreateModal } from './CivicBuzzModal.js';
import { openBuzzShareModal } from './CivicBuzzShare.js';
import { BI } from './CivicBuzzIcons.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

const DEFAULT_BG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CIVIC BUZZ</text><text x="50%" y="56%" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="15" fill="%23fdba74" text-anchor="middle">YOUTH-POWERED CIVIC CONVERSATION</text></svg>';

/**
 * Returns the HTML markup to be placed inside the right sidebar of the dashboard.
 */
export function renderCivicBuzzCardHtml() {
  return `
    <div class="ck-rx-sidebar-panel ck-buzz-carousel-panel" id="ck-buzz-carousel-container">
      <!-- Carousel Header (Clickable to open full-page gallery) -->
      <div class="ck-buzz-header-row" id="ck-buzz-header-click" title="Open Civic Buzz Gallery" style="cursor: pointer;">
        <div>
          <div class="ck-buzz-brand-title">
            <span>CIVIC BUZZ</span>
            <span class="ck-buzz-flame" style="display:inline-flex; align-items:center;">${BI.flame(15, '#ff5a36')}</span>
          </div>
          <div class="ck-buzz-brand-sub">Youth-powered civic conversations</div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" class="ck-buzz-nav-arrow" id="ck-buzz-prev-btn" aria-label="Previous Buzz Card" title="Previous">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button type="button" class="ck-buzz-nav-arrow" id="ck-buzz-next-btn" aria-label="Next Buzz Card" title="Next">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- Viewport & Track -->
      <div class="ck-buzz-viewport" id="ck-buzz-viewport">
        <!-- Floating circular nav arrows on photo -->
        <button type="button" class="ck-buzz-arrow-overlay prev" id="ck-buzz-overlay-prev-btn" aria-label="Previous Buzz Card" title="Previous">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button type="button" class="ck-buzz-arrow-overlay next" id="ck-buzz-overlay-next-btn" aria-label="Next Buzz Card" title="Next">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div class="ck-buzz-track" id="ck-buzz-track">
          <!-- Loading State -->
          <div class="ck-buzz-loading-box">
            <div class="spinner" style="width: 22px; height: 22px; margin-bottom: 8px;"></div>
            <span>Loading youth civic buzz...</span>
          </div>
        </div>
      </div>

      <!-- Dot Indicators & Footer Explore Link -->
      <div class="ck-buzz-footer-row">
        <div class="ck-buzz-dots" id="ck-buzz-dots"></div>
        <a href="/buzz" class="ck-buzz-gallery-link" id="ck-buzz-explore-link">
          Explore all →
        </a>
      </div>
    </div>
  `;
}

/**
 * Initializes data fetching, swiping, auto-rotate, and events for the Civic Buzz carousel.
 */
export async function initCivicBuzzCarousel() {
  const container = document.getElementById('ck-buzz-carousel-container');
  const track = document.getElementById('ck-buzz-track');
  const dotsContainer = document.getElementById('ck-buzz-dots');
  const prevBtn = document.getElementById('ck-buzz-prev-btn');
  const nextBtn = document.getElementById('ck-buzz-next-btn');
  const headerClick = document.getElementById('ck-buzz-header-click');

  if (!container || !track) return;

  // Header click opens full-page gallery
  headerClick?.addEventListener('click', (e) => {
    // Prevent trigger if clicking arrow buttons
    if (e.target.closest('.ck-buzz-nav-arrow')) return;
    navigate('/buzz');
  });

  let posts = [];
  let currentIndex = 0;
  let autoRotateTimer = null;
  const viewedPostIds = new Set();

  try {
    const res = await buzz.list({ limit: 8, sort: 'trending' });
    posts = res.data || [];
  } catch (err) {
    track.innerHTML = `
      <div style="padding: 16px; text-align: center; color: #ef4444; font-size: 0.78rem;">
        Failed to load Civic Buzz
      </div>
    `;
    return;
  }

  // Empty state handling
  if (posts.length === 0) {
    track.innerHTML = `
      <div class="ck-buzz-empty-card">
        <div style="display:flex; justify-content:center; color:#10b981; margin-bottom: 6px;">${BI.initiative(28)}</div>
        <div style="font-weight: 700; font-size: 0.86rem; color: #0f172a;">No Civic Buzz yet</div>
        <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 10px;">
          Be the first to turn a real civic problem into a viral conversation!
        </p>
        <button type="button" id="ck-buzz-first-create-btn" class="btn btn-primary btn-sm" style="border-radius: 999px; font-weight: 700; font-size: 0.76rem;">
          + Create First Post
        </button>
      </div>
    `;
    document.getElementById('ck-buzz-first-create-btn')?.addEventListener('click', () => {
      openBuzzCreateModal(null, () => initCivicBuzzCarousel());
    });
    return;
  }

  // Render carousel cards
  track.innerHTML = posts.map((post, idx) => {
    const img = post.image_url || DEFAULT_BG;
    const title = post.linked_title || post.caption;
    const subtitle = post.linked_area || '';
    const views = post.views_count || 0;
    const upvotes = post.vote_count || 0;
    const shares = post.shares_count || 0;
    const joins = post.joins_count || 0;
    const isInitiative = post.template === 'initiative' || post.linked_type === 'initiative';

    return `
      <div class="ck-buzz-slide" data-index="${idx}" data-post-id="${post.id}">
        <!-- Image Card with Bold Meme-style Caption Overlay -->
        <div class="ck-buzz-img-box" data-action="open-gallery" style="cursor: pointer;">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(post.caption)}" class="ck-buzz-img" onerror="this.src='${DEFAULT_BG}'" />
          <div class="ck-buzz-scrim"></div>
          
          <div class="ck-buzz-meme-caption">
            ${escapeHtml(post.caption)}
          </div>
          <div class="ck-buzz-badge-row">
            <span class="ck-buzz-pill-tag">
              ${isInitiative 
                ? `<span style="display:inline-flex; align-items:center; gap:4px;">${BI.initiative(11)} INITIATIVE</span>`
                : post.template === 'awareness' 
                ? `<span style="display:inline-flex; align-items:center; gap:4px;">${BI.awareness(11)} AWARENESS</span>` 
                : `<span style="display:inline-flex; align-items:center; gap:4px;">${BI.flame(11)} MEME</span>`}
            </span>
          </div>
        </div>

        <!-- Issue Title & Honest Stats -->
        <div class="ck-buzz-meta-box">
          <div class="ck-buzz-issue-title" title="${escapeHtml(title)}">
            ${escapeHtml(title)}
          </div>
          ${subtitle ? `<div style="font-size:0.73rem; color:#64748b; margin-top:2px; font-weight:500;" class="ck-truncate">${escapeHtml(subtitle)}</div>` : ''}
          <div class="ck-buzz-stats-line">
            <span style="display:inline-flex; align-items:center; gap:3px;">${BI.eye(12)} ${views} views</span>
            <span>·</span>
            <span style="display:inline-flex; align-items:center; gap:3px;">${isInitiative && joins ? `${BI.handshake(12)} ${joins} joined` : `${BI.arrowUp(12)} ${upvotes} upvotes`}</span>
            <span>·</span>
            <span style="display:inline-flex; align-items:center; gap:3px;">${BI.share(12)} ${shares} shares</span>
          </div>
        </div>

        <!-- Two Action Buttons: View Issue & Share -->
        <div class="ck-buzz-btns-row">
          <button type="button" class="ck-buzz-btn-issue" data-action="view-issue" data-post-id="${post.id}" data-linked-id="${post.linked_id}">
            View Issue
          </button>
          <button type="button" class="ck-buzz-btn-share" data-action="share-post" data-post-id="${post.id}" data-caption="${escapeHtml(post.caption)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Render Dots
  dotsContainer.innerHTML = posts.map((_, i) => `
    <span class="ck-buzz-dot ${i === 0 ? 'active' : ''}" data-dot-index="${i}"></span>
  `).join('');

  // Update carousel position & log view event
  function updateSlide(newIndex) {
    if (posts.length === 0) return;
    currentIndex = (newIndex + posts.length) % posts.length;

    // Slide step: each slide is calc(100% - 24px) with 12px gap
    const slideEl = track.querySelector('.ck-buzz-slide');
    if (slideEl) {
      const slideWidth = slideEl.offsetWidth + 12; // slide width + gap
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    // Update dot classes
    container.querySelectorAll('.ck-buzz-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Log view event for active card once per session
    const activePost = posts[currentIndex];
    if (activePost && !viewedPostIds.has(activePost.id)) {
      viewedPostIds.add(activePost.id);
      buzz.logEvent(activePost.id, 'view').catch(() => {});
    }
  }

  // Initial view log for the first card
  updateSlide(0);

  // Arrow button events (header arrows + floating overlay arrows)
  const overlayPrev = document.getElementById('ck-buzz-overlay-prev-btn');
  const overlayNext = document.getElementById('ck-buzz-overlay-next-btn');

  const onPrev = (e) => {
    e.stopPropagation();
    updateSlide(currentIndex - 1);
  };
  const onNext = (e) => {
    e.stopPropagation();
    updateSlide(currentIndex + 1);
  };

  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);
  overlayPrev?.addEventListener('click', onPrev);
  overlayNext?.addEventListener('click', onNext);

  // Dots click events
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.ck-buzz-dot');
    if (!dot) return;
    const idx = parseInt(dot.getAttribute('data-dot-index'), 10);
    if (!isNaN(idx)) updateSlide(idx);
  });

  // ── Auto-rotate every 1.8 seconds (1-2s as requested, pause on hover) ──
  function startAutoRotate() {
    stopAutoRotate();
    autoRotateTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 1800);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  startAutoRotate();
  container.addEventListener('mouseenter', stopAutoRotate);
  container.addEventListener('mouseleave', startAutoRotate);

  // ── Touch & Mouse Swipe Handlers ──
  let startX = 0;
  let isDragging = false;
  const viewport = document.getElementById('ck-buzz-viewport');

  // Touch
  viewport?.addEventListener('touchstart', (e) => {
    stopAutoRotate();
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewport?.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) updateSlide(currentIndex - 1);
      else updateSlide(currentIndex + 1);
    }
    startAutoRotate();
  }, { passive: true });

  // Mouse Drag
  viewport?.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stopAutoRotate();
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) updateSlide(currentIndex - 1);
      else updateSlide(currentIndex + 1);
    }
    startAutoRotate();
  });

  // ── Button Delegations: View Issue, Share, and Image Click ──
  track.addEventListener('click', (e) => {
    const issueBtn = e.target.closest('[data-action="view-issue"]');
    if (issueBtn) {
      e.stopPropagation();
      const postId = issueBtn.getAttribute('data-post-id');
      const linkedId = issueBtn.getAttribute('data-linked-id');
      if (postId) buzz.logEvent(Number(postId), 'click_issue').catch(() => {});
      if (linkedId) navigate(`/entities/${linkedId}`);
      return;
    }

    const shareBtn = e.target.closest('[data-action="share-post"]');
    if (shareBtn) {
      e.stopPropagation();
      const postId = Number(shareBtn.getAttribute('data-post-id'));
      const post = posts.find(p => p.id === postId) || {
        id: postId,
        caption: shareBtn.getAttribute('data-caption') || 'Civic Buzz',
        image_url: shareBtn.closest('.ck-buzz-slide')?.querySelector('img')?.src,
      };
      openBuzzShareModal(post);
      return;
    }

    const imgBox = e.target.closest('[data-action="open-gallery"]');
    if (imgBox) {
      e.stopPropagation();
      navigate('/buzz');
    }
  });
}

