/**
 * CIVIC-KALKI — Public Civic Buzz Post Page (/buzz/:id)
 *
 * Requirements:
 * - Public page showing the card and a "View issue" button.
 * - Share actions: "Download image", "Copy link", "Web Share".
 * - Log share event when a share is initiated.
 * - Log click_issue event when "View issue" is clicked.
 * - Log view event when the card is shown.
 */

import { getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { buzz } from '../api.js';
import { toastSuccess, toastError, toastWarning } from '../components/toast.js';
import { openBuzzShareModal } from '../components/CivicBuzzShare.js';
import { renderCardHtml, DEFAULT_CIVIC_BG } from '../components/CivicBuzzTemplates.js';
import { navigate } from '../router.js';
import { BI } from '../components/CivicBuzzIcons.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

export async function renderCivicBuzzPost(params) {
  const app = document.getElementById('app');
  const postId = params?.id;

  if (!postId || isNaN(Number(postId))) {
    renderNotFound('Invalid Civic Buzz post ID.');
    return;
  }

  // Render initial loading state
  app.innerHTML = renderLayout(`
    <div class="ck-buzz-post-page-wrap">
      <div style="text-align:center; padding: 60px 0;">
        <div class="spinner" style="margin: 0 auto 16px;"></div>
        <p style="color:#64748b; font-weight:600;">Loading Civic Buzz conversation...</p>
      </div>
    </div>
  `, 'Civic Buzz');
  attachLayoutEvents();

  try {
    const res = await buzz.get(postId);
    const post = res.data;

    if (!post) {
      renderNotFound('Civic Buzz post not found or no longer available.');
      return;
    }

    // Log view event
    buzz.logEvent(post.id, 'view').catch(() => {});

    const user = getUser();
    const isInitiative = post.linked_type === 'initiative';

    // Build Card Visual
    let cardVisualHtml = '';
    if (post.image_url) {
      cardVisualHtml = `
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); position:relative; background:#0f172a; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;">
          <img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.caption)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${DEFAULT_CIVIC_BG}'" />
          <div class="ck-card-watermark">
            <span class="ck-wm-flame">${BI.flame(14, '#ff5a36')}</span>
            <span class="ck-wm-brand">CIVIC-KALKI</span>
          </div>
        </div>
      `;
    } else {
      cardVisualHtml = `
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); aspect-ratio:1/1;">
          ${renderCardHtml({
            template: post.template || 'meme',
            style: post.style || 'funny',
            caption: post.caption,
            cta_text: post.cta_text,
            issue: {
              name: post.linked_title,
              area: post.linked_area,
              status: post.linked_status,
              entity_id: post.linked_id,
            },
          })}
        </div>
      `;
    }

    app.innerHTML = renderLayout(`
      <div class="ck-buzz-post-page-wrap">
        <!-- Top Back Navigation -->
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
          <a href="/buzz" class="ck-buzz-back-link" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#ff5a36; text-decoration:none;">
            ← Back to Civic Buzz Gallery
          </a>
          <span style="font-size:0.8rem; color:#64748b;">Post #${post.id}</span>
        </div>

        <!-- Main Showcase Card -->
        <div class="ck-buzz-post-view-card">
          <!-- Left: The Visual Card -->
          <div>
            ${cardVisualHtml}
          </div>

          <!-- Right: Details, Actions & Conversation -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:20px;">
            <div>
              <!-- Header Badges -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="ck-buzz-fire-tag" style="display:inline-flex; align-items:center; gap:4px;">${BI.flame(13, '#ea580c')} CIVIC BUZZ</span>
                  <span class="ck-buzz-status-pill ${escapeHtml(post.linked_status || 'submitted')}">
                    ${escapeHtml(post.linked_status || 'Active')}
                  </span>
                </div>
                <button type="button" class="ck-buzz-icon-btn" id="ck-post-report-btn" title="Report post">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
                </button>
              </div>

              <!-- Main Caption Headline -->
              <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin: 0 0 10px;">
                ${escapeHtml(post.caption)}
              </h2>

              ${post.cta_text ? `
                <div style="display:inline-flex; align-items:center; gap:6px; background:#fff7ed; border:1px solid #fed7aa; color:#ea580c; font-weight:700; font-size:0.82rem; padding:4px 12px; border-radius:999px; margin-bottom:14px;">
                  <span style="display:inline-flex; align-items:center;">${BI.zap(13, "#ea580c")}</span> CTA: ${escapeHtml(post.cta_text)}
                </div>
              ` : ''}

              <!-- Linked Entity Details Box -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 16px; margin-bottom:16px;">
                <div style="font-size:0.7rem; font-weight:800; color:#ff5a36; text-transform:uppercase; letter-spacing:0.06em;">
                  Linked ${escapeHtml(post.linked_type)} #${escapeHtml(post.linked_id)}
                </div>
                <div style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-top:2px;">
                  ${escapeHtml(post.linked_title || post.caption)}
                </div>
                ${post.linked_area ? `<div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${BI.pin(13, "#64748b")} ${escapeHtml(post.linked_area)}</div>` : ''}
              </div>

              <!-- Metrics Row -->
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; display:flex; gap:14px; margin-bottom:18px;">
                <span>${BI.eye(14, "#64748b")} ${post.views_count} views</span>
                <span>${BI.arrowUp(14, "#64748b")} <span id="ck-post-vote-count">${post.vote_count}</span> upvotes</span>
                <span>${BI.share(14, "#64748b")} ${post.shares_count} shares</span>
              </div>

              <!-- Key CTA Buttons -->
              <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;">
                <!-- View Issue Button (Mandatory) -->
                <button type="button" class="btn btn-primary" id="ck-post-view-issue-btn" style="flex:1; min-width:140px; font-weight:700; border-radius:999px; padding:10px 18px;">
                  View Issue →
                </button>

                <!-- Share Button (Mandatory) -->
                <button type="button" class="btn btn-secondary" id="ck-post-share-btn" style="border-radius:999px; font-weight:700; padding:10px 18px; display:inline-flex; align-items:center; gap:6px;">
                  <span style="display:inline-flex; align-items:center;">${BI.share(14, 'currentColor')}</span> Share
                </button>

                <!-- Upvote Toggle -->
                <button type="button" class="ck-buzz-act-btn ${post.has_voted ? 'active' : ''}" id="ck-post-upvote-btn" style="border-radius:999px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  <span id="ck-post-vote-label">${post.has_voted ? 'Upvoted' : 'Upvote'}</span>
                </button>

                ${isInitiative ? `
                  <button type="button" class="btn btn-secondary" id="ck-post-join-btn" style="border-radius:999px; font-weight:700; color:#059669; border-color:#a7f3d0; background:#ecfdf5; display:inline-flex; align-items:center; gap:6px;">
                    <span style="display:inline-flex; align-items:center;">${BI.handshake(15, '#059669')}</span> <span>Join Initiative</span>
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Comments Section -->
            <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
              <h4 style="font-size:0.9rem; font-weight:700; margin:0 0 10px; color:#0f172a;">
                Community Conversation
              </h4>

              <div class="ck-buzz-comment-input-row" style="margin-bottom:12px;">
                <input
                  type="text"
                  id="ck-post-comment-input"
                  class="ck-buzz-comment-input"
                  placeholder="${user ? 'Add to the conversation...' : 'Sign in to comment...'}"
                  ${!user ? 'disabled' : ''}
                  maxlength="500"
                />
                <button type="button" id="ck-post-comment-send" class="btn btn-primary btn-sm" style="border-radius:999px;" ${!user ? 'disabled' : ''}>
                  Post
                </button>
              </div>

              <div id="ck-post-comments-list" class="ck-buzz-comments-list" style="max-height:220px;">
                <div style="text-align:center; padding:12px; color:#94a3b8; font-size:0.8rem;">
                  Loading comments...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `, `Civic Buzz #${post.id}`);

    attachLayoutEvents();
    attachPostEvents(post);
    loadPostComments(post.id);
  } catch (err) {
    renderNotFound(err.message || 'Error loading post.');
  }
}

function renderNotFound(message) {
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="ck-buzz-post-page-wrap" style="text-align:center; padding:60px 20px;">
      <div style="font-size:3rem; margin-bottom:12px; display:flex; justify-content:center; color:#ff5a36;">${BI.flame(52, '#ff5a36')}</div>
      <h2 style="font-size:1.5rem; font-weight:800; color:#0f172a; margin-bottom:8px;">Civic Buzz Post Not Found</h2>
      <p style="color:#64748b; max-width:440px; margin:0 auto 20px;">${escapeHtml(message)}</p>
      <a href="/buzz" class="btn btn-primary" style="border-radius:999px; font-weight:700;">Explore Civic Buzz Gallery</a>
    </div>
  `, 'Post Not Found');
  attachLayoutEvents();
}

function attachPostEvents(post) {
  // 1. View Issue button click -> logs click_issue event
  document.getElementById('ck-post-view-issue-btn')?.addEventListener('click', () => {
    buzz.logEvent(post.id, 'click_issue').catch(() => {});
    navigate(`/entities/${post.linked_id}`);
  });

  // 2. Share button click -> opens Share Modal (Download image, Copy link, Web Share)
  document.getElementById('ck-post-share-btn')?.addEventListener('click', () => {
    openBuzzShareModal(post);
  });

  // 3. Upvote toggle
  const upvoteBtn = document.getElementById('ck-post-upvote-btn');
  const voteCountEl = document.getElementById('ck-post-vote-count');
  const voteLabelEl = document.getElementById('ck-post-vote-label');

  upvoteBtn?.addEventListener('click', async () => {
    if (!getUser()) {
      toastWarning('Please sign in to upvote.');
      navigate('/login');
      return;
    }
    try {
      const res = await buzz.vote(post.id);
      if (res.voted) {
        upvoteBtn.classList.add('active');
        voteLabelEl.textContent = 'Upvoted';
      } else {
        upvoteBtn.classList.remove('active');
        voteLabelEl.textContent = 'Upvote';
      }
      voteCountEl.textContent = res.vote_count;
    } catch (err) {
      toastError(err.message || 'Could not vote');
    }
  });

  // 4. Report post
  document.getElementById('ck-post-report-btn')?.addEventListener('click', () => {
    const reason = window.prompt('Why are you reporting this Civic Buzz post?\n(e.g., Offensive language, personal data, misleading claim)');
    if (reason && reason.trim()) {
      buzz.report(post.id, reason.trim()).then((res) => {
        toastSuccess(res.message || 'Report received. Thank you for keeping our community safe.');
      }).catch((err) => {
        toastError(err.message || 'Could not report post');
      });
    }
  });

  // 5. Join Initiative (if applicable)
  document.getElementById('ck-post-join-btn')?.addEventListener('click', () => {
    buzz.logEvent(post.id, 'join').catch(() => {});
    toastSuccess('Thanks for raising your hand! Redirecting to initiative...');
    setTimeout(() => navigate(`/entities/${post.linked_id}`), 800);
  });
}

async function loadPostComments(postId) {
  const listEl = document.getElementById('ck-post-comments-list');
  const sendBtn = document.getElementById('ck-post-comment-send');
  const inputEl = document.getElementById('ck-post-comment-input');
  if (!listEl) return;

  async function fetchComments() {
    try {
      const res = await buzz.getComments(postId);
      const comments = res.data || [];
      if (comments.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:12px; color:#94a3b8; font-size:0.8rem;">No comments yet. Start the conversation!</div>`;
        return;
      }
      listEl.innerHTML = comments.map(c => `
        <div class="ck-buzz-comment-item">
          <div class="ck-buzz-comment-meta">
            <span class="ck-buzz-comment-author" style="display:inline-flex; align-items:center; gap:4px;">${BI.user(13, '#64748b')} ${escapeHtml(c.author_name)}</span>
            <span class="ck-buzz-comment-time">${new Date(c.created_at).toLocaleDateString()}</span>
          </div>
          <div class="ck-buzz-comment-text">${escapeHtml(c.text)}</div>
        </div>
      `).join('');
    } catch {
      listEl.innerHTML = `<div style="text-align:center; padding:10px; color:#ef4444; font-size:0.75rem;">Failed to load comments</div>`;
    }
  }

  sendBtn?.addEventListener('click', async () => {
    const text = inputEl?.value.trim();
    if (!text) return;
    sendBtn.disabled = true;
    try {
      await buzz.addComment(postId, text);
      inputEl.value = '';
      toastSuccess('Comment posted!');
      await fetchComments();
    } catch (err) {
      toastError(err.data?.message || err.message || 'Failed to post comment');
    } finally {
      sendBtn.disabled = false;
    }
  });

  await fetchComments();
}


