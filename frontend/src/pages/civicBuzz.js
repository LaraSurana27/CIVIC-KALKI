/**
 * CIVIC-KALKI — Full-Page Civic Buzz Gallery
 *
 * Requirements:
 * - Responsive grid of youth-powered civic conversation cards
 * - Filter chips (Trending, Newest, Following)
 * - "+ Create post" button with AI caption generation & safety verification
 * - Detail modal on card click (upvote, follow status, comments, share, view issue, join/volunteer, report issue, report post)
 * - Loading, empty, and error states
 * - Mobile responsive
 * - Real data from GET /buzz endpoints
 */

import { getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { buzz } from '../api.js';
import { toast, toastSuccess, toastError, toastWarning } from '../components/toast.js';
import { openBuzzDetailModal, openBuzzCreateModal } from '../components/CivicBuzzModal.js';
import { openBuzzShareModal } from '../components/CivicBuzzShare.js';
import { BI } from '../components/CivicBuzzIcons.js';
import { navigate } from '../router.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

const DEFAULT_MEME_BG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CIVIC BUZZ</text><text x="50%" y="56%" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="15" fill="%23fdba74" text-anchor="middle">YOUTH-POWERED CIVIC CONVERSATION</text></svg>';

let currentFilter = 'trending'; // 'trending' | 'newest' | 'following'
let loadedPosts = [];

export async function renderCivicBuzz() {
  const app = document.getElementById('app');

  // Check URL params for preselected post or filter
  const searchParams = new URLSearchParams(window.location.search);
  const filterParam = searchParams.get('filter');
  if (['trending', 'newest', 'following'].includes(filterParam)) {
    currentFilter = filterParam;
  }
  const postIdParam = searchParams.get('post');

  app.innerHTML = renderLayout(`
    <div class="ck-buzz-gallery-container">
      <!-- Top Hero Banner -->
      <div class="ck-buzz-gallery-hero">
        <div class="ck-buzz-gallery-hero-left">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <a href="/dashboard" class="ck-buzz-back-link">← Dashboard</a>
            <span style="color:#64748b; font-size:0.8rem;">/</span>
            <span style="color:#ff5a36; font-size:0.8rem; font-weight:700;">Community</span>
          </div>
          <h1 class="ck-buzz-gallery-title">
            CIVIC BUZZ <span class="ck-buzz-flame" style="display:inline-flex; align-items:center;">${BI.flame(22, '#ff5a36')}</span>
          </h1>
          <p class="ck-buzz-gallery-subtitle">
            Youth-powered civic conversations turning everyday problems into visible municipal accountability.
          </p>
        </div>

        <div class="ck-buzz-gallery-hero-right">
          <button type="button" class="btn btn-primary" id="ck-buzz-gallery-create-btn" style="border-radius:999px; font-weight:700; padding:10px 22px; display:inline-flex; align-items:center; gap:8px;">
            <span>+</span> Create Post
          </button>
        </div>
      </div>

      <!-- Action & Filter Bar -->
      <div class="ck-buzz-filter-bar">
        <div class="ck-buzz-filter-chips">
          <button type="button" class="ck-buzz-chip ${currentFilter === 'trending' ? 'active' : ''}" data-filter="trending">
            <span style="display:inline-flex; align-items:center; gap:5px;">${BI.flame(13)} Trending</span>
          </button>
          <button type="button" class="ck-buzz-chip ${currentFilter === 'newest' ? 'active' : ''}" data-filter="newest">
            <span style="display:inline-flex; align-items:center; gap:5px;">${BI.zap(13)} Newest</span>
          </button>
          <button type="button" class="ck-buzz-chip ${currentFilter === 'following' ? 'active' : ''}" data-filter="following">
            <span style="display:inline-flex; align-items:center; gap:5px;">${BI.user(13)} Following</span>
          </button>
        </div>

        <div style="font-size:0.78rem; color:#64748b; font-weight:600;" id="ck-buzz-results-count">
          Loading posts...
        </div>
      </div>

      <!-- Main Gallery Content Grid -->
      <div id="ck-buzz-gallery-content" class="ck-buzz-gallery-grid">
        <!-- Loading skeletons -->
        <div class="ck-buzz-card-skeleton"></div>
        <div class="ck-buzz-card-skeleton"></div>
        <div class="ck-buzz-card-skeleton"></div>
      </div>
    </div>
  `, 'Civic Buzz');

  attachLayoutEvents();
  attachGalleryEvents();
  await loadGalleryPosts(postIdParam);
}

function attachGalleryEvents() {
  // Create post button
  document.getElementById('ck-buzz-gallery-create-btn')?.addEventListener('click', () => {
    openBuzzCreateModal(null, () => loadGalleryPosts());
  });

  // Filter chips click
  document.querySelectorAll('.ck-buzz-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      const filter = chip.getAttribute('data-filter');
      if (filter === currentFilter) return;

      if (filter === 'following' && !getUser()) {
        toastWarning('Please sign in to view posts you are following.');
        navigate('/login');
        return;
      }

      currentFilter = filter;
      document.querySelectorAll('.ck-buzz-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      await loadGalleryPosts();
    });
  });
}

async function loadGalleryPosts(autoOpenPostId = null) {
  const container = document.getElementById('ck-buzz-gallery-content');
  const countEl = document.getElementById('ck-buzz-results-count');
  if (!container) return;

  container.innerHTML = `
    <div class="ck-buzz-card-skeleton"></div>
    <div class="ck-buzz-card-skeleton"></div>
    <div class="ck-buzz-card-skeleton"></div>
  `;
  if (countEl) countEl.textContent = 'Loading...';

  try {
    const res = await buzz.list({ limit: 40, sort: currentFilter });
    loadedPosts = res.data || [];

    if (countEl) {
      countEl.textContent = `${loadedPosts.length} civic conversation${loadedPosts.length === 1 ? '' : 's'}`;
    }

    if (loadedPosts.length === 0) {
      renderEmptyState(container);
      return;
    }

    renderGrid(container, loadedPosts);

    // If autoOpenPostId is provided (e.g., from deep link), open its detail modal
    if (autoOpenPostId) {
      const match = loadedPosts.find(p => String(p.id) === String(autoOpenPostId));
      if (match) {
        openBuzzDetailModal(match, (updated) => updateCardInGrid(updated));
      }
    }
  } catch (err) {
    renderErrorState(container, err.message);
  }
}

function renderEmptyState(container) {
  const isFollowingTab = currentFilter === 'following';
  container.innerHTML = `
    <div class="ck-buzz-empty-state-wrap">
      <div style="display:flex; justify-content:center; margin-bottom:8px;">${isFollowingTab ? BI.inbox(38, '#94a3b8') : BI.initiative(38, '#10b981')}</div>
      <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:6px;">
        ${isFollowingTab ? 'No followed posts yet' : 'No Civic Buzz posts found'}
      </h3>
      <p style="font-size:0.84rem; color:#64748b; max-width:440px; margin:0 auto 18px;">
        ${isFollowingTab
          ? 'Follow posts on the trending or newest feed to track community updates and discussions.'
          : 'Be the first to turn a local issue or neighborhood initiative into a viral civic conversation!'}
      </p>
      <button type="button" class="btn btn-primary" id="ck-buzz-empty-action-btn" style="border-radius:999px; font-weight:700;">
        ${isFollowingTab ? 'Explore Trending Posts' : '+ Create First Post'}
      </button>
    </div>
  `;

  document.getElementById('ck-buzz-empty-action-btn')?.addEventListener('click', () => {
    if (isFollowingTab) {
      document.querySelector('.ck-buzz-chip[data-filter="trending"]')?.click();
    } else {
      openBuzzCreateModal(null, () => loadGalleryPosts());
    }
  });
}

function renderErrorState(container, errorMsg) {
  container.innerHTML = `
    <div class="ck-buzz-empty-state-wrap" style="border-color: rgba(239,68,68,0.25); background: rgba(239,68,68,0.04);">
      <div style="display:flex; justify-content:center; color:#ef4444; margin-bottom:8px;">${BI.alert(32)}</div>
      <h3 style="font-size:1.05rem; font-weight:700; color:#991b1b; margin-bottom:6px;">
        Failed to load Civic Buzz
      </h3>
      <p style="font-size:0.8rem; color:#64748b; margin-bottom:14px;">${escapeHtml(errorMsg)}</p>
      <button type="button" class="btn btn-secondary btn-sm" id="ck-buzz-retry-btn" style="border-radius:999px;">
        Try Again
      </button>
    </div>
  `;
  document.getElementById('ck-buzz-retry-btn')?.addEventListener('click', () => loadGalleryPosts());
}

function renderGrid(container, posts) {
  container.innerHTML = posts.map(post => {
    const img = post.image_url || DEFAULT_MEME_BG;
    const title = post.linked_title || post.caption;
    const views = post.views_count || 0;
    const upvotes = post.vote_count || 0;
    const shares = post.shares_count || 0;

    return `
      <div class="ck-buzz-card" data-post-id="${post.id}">
        <!-- Media Image with Bold Meme Caption -->
        <div class="ck-buzz-card-media" data-action="open-detail">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(post.caption)}" class="ck-buzz-card-img" onerror="this.src='${DEFAULT_MEME_BG}'" />
          <div class="ck-buzz-card-scrim"></div>
          
          <div class="ck-buzz-card-caption">
            ${escapeHtml(post.caption)}
          </div>

          <div class="ck-buzz-card-badges">
            <span class="ck-buzz-badge-pill">
              ${post.template === 'initiative' 
                ? `<span style="display:inline-flex; align-items:center; gap:4px;">${BI.initiative(11)} INITIATIVE</span>` 
                : post.template === 'awareness' 
                ? `<span style="display:inline-flex; align-items:center; gap:4px;">${BI.awareness(11)} AWARENESS</span>` 
                : `<span style="display:inline-flex; align-items:center; gap:4px;">${BI.flame(11)} MEME</span>`}
            </span>
            ${post.linked_status ? `
              <span class="ck-buzz-status-tag ${escapeHtml(post.linked_status)}">
                ${escapeHtml(post.linked_status)}
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Details Footer -->
        <div class="ck-buzz-card-details">
          <div class="ck-buzz-card-title-row" data-action="open-detail" style="cursor: pointer;">
            <div class="ck-buzz-card-title" title="${escapeHtml(title)}">
              ${escapeHtml(title)}
            </div>
            ${post.linked_area ? `<div class="ck-buzz-card-area" style="display:inline-flex; align-items:center; gap:3px;">${BI.pin(11)} ${escapeHtml(post.linked_area)}</div>` : ''}
          </div>

          <!-- Stats Line -->
          <div class="ck-buzz-card-stats-line">
            <span style="display:inline-flex; align-items:center; gap:3px;">${BI.eye(12)} ${views} views</span>
            <span>·</span>
            <span style="display:inline-flex; align-items:center; gap:3px;">${BI.arrowUp(12)} ${upvotes} upvotes</span>
            <span>·</span>
            <span style="display:inline-flex; align-items:center; gap:3px;">${BI.share(12)} ${shares} shares</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="ck-buzz-card-bottom-bar">
            <button type="button" class="ck-buzz-quick-vote-btn ${post.has_voted ? 'active' : ''}" data-action="quick-vote" data-post-id="${post.id}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              <span>${post.has_voted ? 'Upvoted' : 'Upvote'}</span>
            </button>

            <button type="button" class="ck-buzz-quick-share-btn" data-action="quick-share" data-post-id="${post.id}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach event delegation for card clicks
  container.addEventListener('click', async (e) => {
    const card = e.target.closest('.ck-buzz-card');
    if (!card) return;
    const postId = Number(card.getAttribute('data-post-id'));
    const post = loadedPosts.find(p => p.id === postId);
    if (!post) return;

    // Quick vote
    const voteBtn = e.target.closest('[data-action="quick-vote"]');
    if (voteBtn) {
      e.stopPropagation();
      if (!getUser()) {
        toastWarning('Please sign in to upvote.');
        return;
      }
      try {
        const res = await buzz.vote(post.id);
        post.has_voted = res.voted;
        post.vote_count = res.vote_count;
        updateCardInGrid(post);
      } catch (err) {
        toastError(err.message || 'Could not vote');
      }
      return;
    }

    // Quick share
    const shareBtn = e.target.closest('[data-action="quick-share"]');
    if (shareBtn) {
      e.stopPropagation();
      openBuzzShareModal(post);
      return;
    }

    // Open detail modal on media or title click
    openBuzzDetailModal(post, (updated) => updateCardInGrid(updated));
  });
}

function updateCardInGrid(updatedPost) {
  const card = document.querySelector(`.ck-buzz-card[data-post-id="${updatedPost.id}"]`);
  if (!card) return;

  const voteBtn = card.querySelector('[data-action="quick-vote"]');
  if (voteBtn) {
    voteBtn.classList.toggle('active', updatedPost.has_voted);
    voteBtn.querySelector('span').textContent = updatedPost.has_voted ? 'Upvoted' : 'Upvote';
  }

  const statsLine = card.querySelector('.ck-buzz-card-stats-line');
  if (statsLine) {
    statsLine.innerHTML = `
      <span>👁 ${updatedPost.views_count || 0} views</span>
      <span>·</span>
      <span>⬆ ${updatedPost.vote_count || 0} upvotes</span>
      <span>·</span>
      <span>↗ ${updatedPost.shares_count || 0} shares</span>
    `;
  }
}
