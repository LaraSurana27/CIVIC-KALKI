/**
 * CIVIC-KALKI — Civic Buzz Swipeable Carousel Component
 * Displayed in the Dashboard right-hand sidebar.
 *
 * Requirements:
 * - 1 slide at a time with a single set of controls (dots + one pause button, no duplicate arrows)
 * - Hide any metric that is 0
 * - Fit/clamp the caption inside the card
 * - Make the whole card the click target with Share as a small icon
 * - "See all" links to the Buzz page (/buzz)
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
      </div>

      <!-- Viewport & Track (1 card at a time, no duplicate overlay arrows) -->
      <div class="ck-buzz-viewport" id="ck-buzz-viewport">
        <div class="ck-buzz-track" id="ck-buzz-track">
          <!-- Loading State -->
          <div class="ck-buzz-loading-box">
            <div class="spinner" style="width: 22px; height: 22px; margin-bottom: 8px;"></div>
            <span>Loading youth civic buzz...</span>
          </div>
        </div>
      </div>

      <!-- Single Control Set: Dot Indicators + One Pause Button & See All Link -->
      <div class="ck-buzz-footer-row" style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="ck-buzz-dots" id="ck-buzz-dots"></div>
          <button type="button" class="ck-buzz-pause-btn" id="ck-buzz-pause-btn" title="Pause auto-rotate" aria-label="Pause auto-rotate">
            <svg class="ck-buzz-pause-icon" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
            <svg class="ck-buzz-play-icon" style="display:none;" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          </button>
        </div>
        <a href="/buzz" class="ck-buzz-gallery-link" id="ck-buzz-explore-link">
          See all →
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
  const pauseBtn = document.getElementById('ck-buzz-pause-btn');
  const headerClick = document.getElementById('ck-buzz-header-click');

  if (!container || !track) return;

  headerClick?.addEventListener('click', () => {
    navigate('/buzz');
  });

  let posts = [];
  let currentIndex = 0;
  let autoRotateTimer = null;
  let isUserPaused = false;
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

  // Render carousel cards: WHOLE CARD IS CLICKABLE TARGET, Share is small floating icon
  track.innerHTML = posts.map((post, idx) => {
    const img = post.image_url || DEFAULT_BG;
    const title = post.linked_title || post.caption;
    const subtitle = post.linked_area || '';
    const views = post.views_count || 0;
    const upvotes = post.vote_count || 0;
    const shares = post.shares_count || 0;
    const joins = post.joins_count || 0;
    const isInitiative = post.template === 'initiative' || post.linked_type === 'initiative';

    // Hide any metric that is 0, format cleanly into a single subtitle stats line
    const metricParts = [];
    if (subtitle) metricParts.push(escapeHtml(subtitle));
    if (views > 0) metricParts.push(`${views} views`);
    if (isInitiative && joins > 0) {
      metricParts.push(`${joins} joined`);
    } else if (upvotes > 0) {
      metricParts.push(`${upvotes} upvote${upvotes > 1 ? 's' : ''}`);
    }
    if (shares > 0) metricParts.push(`${shares} share${shares > 1 ? 's' : ''}`);

    const subStatsText = metricParts.join(' · ');

    return `
      <div class="ck-buzz-slide" data-index="${idx}" data-post-id="${post.id}" data-linked-id="${post.linked_id || ''}" style="cursor: pointer;" title="View ${escapeHtml(title)}">
        <!-- Image Card with Bold Meme-style Clamped Caption Overlay & Floating Small Share Button -->
        <div class="ck-buzz-img-box" style="position: relative;">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(post.caption)}" class="ck-buzz-img" onerror="this.src='${DEFAULT_BG}'" />
          <div class="ck-buzz-scrim"></div>
          
          <!-- Small Floating Share Button in top-right -->
          <button type="button" class="ck-buzz-share-floating" data-action="share-post" data-post-id="${post.id}" data-caption="${escapeHtml(post.caption)}" title="Share" aria-label="Share">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>

          <!-- Clamped Caption inside Card -->
          <div class="ck-buzz-meme-caption" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis;">
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

        <!-- Issue Title & Stats & Action Buttons -->
        <div class="ck-buzz-meta-box">
          <div class="ck-buzz-issue-title" title="${escapeHtml(title)}">
            ${escapeHtml(title)}
          </div>
          <div style="font-size:0.84rem; color:#64748b; margin-top:3px; font-weight:500;" class="ck-truncate">
            ${subStatsText || 'Civic Buzz'}
          </div>
          <div class="ck-buzz-actions-row" style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
              <button type="button" class="btn btn-secondary btn-sm ck-buzz-action-btn" data-action="upvote-post" data-post-id="${post.id}" style="font-size:0.82rem; font-weight:600; padding:5px 12px; border-radius:6px; display:inline-flex; align-items:center; gap:4px; height:30px; background:#f8fafc; border:1px solid #e2e8f0; color:#334155; cursor:pointer; white-space:nowrap;">
                <span>↑</span> Upvote
              </button>
              <button type="button" class="btn btn-secondary btn-sm ck-buzz-action-btn" data-action="follow-post" data-post-id="${post.id}" style="font-size:0.82rem; font-weight:600; padding:5px 12px; border-radius:6px; display:inline-flex; align-items:center; gap:4px; height:30px; background:#f8fafc; border:1px solid #e2e8f0; color:#334155; cursor:pointer; white-space:nowrap;">
                <span>+</span> Follow
              </button>
            </div>
            <a href="${post.linked_id ? `/entities/${post.linked_id}` : `/buzz/${post.id}`}" class="ck-buzz-view-issue-link" data-action="view-issue" style="font-size:0.85rem; color:#ff5a36; font-weight:700; text-decoration:none; white-space:nowrap; flex-shrink:0;">
              View issue →
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Dots
  dotsContainer.innerHTML = posts.map((_, i) => `
    <span class="ck-buzz-dot ${i === 0 ? 'active' : ''}" data-dot-index="${i}"></span>
  `).join('');

  function updateSlide(newIndex) {
    if (posts.length === 0) return;
    currentIndex = (newIndex + posts.length) % posts.length;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    container.querySelectorAll('.ck-buzz-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    const activePost = posts[currentIndex];
    if (activePost && !viewedPostIds.has(activePost.id)) {
      viewedPostIds.add(activePost.id);
      buzz.logEvent(activePost.id, 'view').catch(() => {});
    }
  }

  updateSlide(0);

  // Dots click events
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.ck-buzz-dot');
    if (!dot) return;
    const idx = parseInt(dot.getAttribute('data-dot-index'), 10);
    if (!isNaN(idx)) updateSlide(idx);
  });

  // Pause / Play toggle button
  pauseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    isUserPaused = !isUserPaused;
    const pauseIcon = pauseBtn.querySelector('.ck-buzz-pause-icon');
    const playIcon = pauseBtn.querySelector('.ck-buzz-play-icon');

    if (isUserPaused) {
      stopAutoRotate();
      pauseBtn.classList.add('paused');
      pauseBtn.title = 'Play auto-rotate';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'inline-block';
    } else {
      startAutoRotate();
      pauseBtn.classList.remove('paused');
      pauseBtn.title = 'Pause auto-rotate';
      if (pauseIcon) pauseIcon.style.display = 'inline-block';
      if (playIcon) playIcon.style.display = 'none';
    }
  });

  // Auto-rotate every 1.8 seconds (pauses on user pause or hover)
  function startAutoRotate() {
    stopAutoRotate();
    if (isUserPaused) return;
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
  container.addEventListener('mouseenter', () => { if (!isUserPaused) stopAutoRotate(); });
  container.addEventListener('mouseleave', () => { if (!isUserPaused) startAutoRotate(); });

  // Touch & Mouse Swipe Handlers
  let startX = 0;
  let isDragging = false;
  const viewport = document.getElementById('ck-buzz-viewport');

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
    if (!isUserPaused) startAutoRotate();
  }, { passive: true });

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
    if (!isUserPaused) startAutoRotate();
  });

  // Whole-card click delegation + floating share button
  track.addEventListener('click', (e) => {
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

    const upvoteBtn = e.target.closest('[data-action="upvote-post"]');
    if (upvoteBtn) {
      e.stopPropagation();
      const postId = Number(upvoteBtn.getAttribute('data-post-id'));
      buzz.vote(postId)
        .then(() => {
          toastSuccess('Upvoted civic buzz!');
          upvoteBtn.innerHTML = '<span>✓</span> Upvoted';
          upvoteBtn.style.color = '#ff5a36';
        })
        .catch(() => toast('You already supported this post.'));
      return;
    }

    const followBtn = e.target.closest('[data-action="follow-post"]');
    if (followBtn) {
      e.stopPropagation();
      toastSuccess('Following updates on this issue!');
      followBtn.innerHTML = '<span>✓</span> Following';
      followBtn.style.color = '#10b981';
      return;
    }

    const viewIssueLink = e.target.closest('[data-action="view-issue"]');
    if (viewIssueLink) {
      e.stopPropagation();
      e.preventDefault();
      const href = viewIssueLink.getAttribute('href');
      if (href) navigate(href);
      return;
    }

    const slide = e.target.closest('.ck-buzz-slide');
    if (slide) {
      const linkedId = slide.getAttribute('data-linked-id');
      const postId = slide.getAttribute('data-post-id');
      if (postId) buzz.logEvent(Number(postId), 'click_issue').catch(() => {});
      if (linkedId && linkedId !== '' && linkedId !== 'null' && linkedId !== 'undefined') {
        navigate(`/entities/${linkedId}`);
      } else if (postId) {
        navigate(`/buzz/${postId}`);
      } else {
        navigate('/buzz');
      }
    }
  });
}
