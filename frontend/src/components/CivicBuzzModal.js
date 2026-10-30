/**
 * CIVIC-KALKI — Civic Buzz Modals
 *
 * 1. openBuzzDetailModal:
 *    Detail modal on card click with upvote, follow status, comments,
 *    share modal, view issue, join/volunteer (if initiative), report issue.
 *
 * 2. openBuzzCreateModal:
 *    5-Step Wizard Modal for creating a Civic Buzz post:
 *    - Step 1: Choose type (meme / awareness / initiative / share issue)
 *    - Step 2: Pick linked issue/initiative from user's own and followed items with search
 *    - Step 3: Choose style (funny / informative / emotional)
 *    - Step 4: Call POST /buzz/captions -> show 3 caption options -> editable freely
 *    - Step 5: Render card to PNG via html-to-image -> Preview actual card -> Publish or Save as Draft
 */

import { buzz, entities as apiEntities } from '../api.js';
import { toastSuccess, toastError, toastWarning } from './toast.js';
import { getUser } from '../auth.js';
import { navigate } from '../router.js';
import { openBuzzShareModal } from './CivicBuzzShare.js';
import { renderCardHtml, renderTemplateToPng, DEFAULT_CIVIC_BG } from './CivicBuzzTemplates.js';
import { BI } from './CivicBuzzIcons.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────

export async function openBuzzDetailModal(post, onUpdate = null) {
  const existingModal = document.getElementById('ck-buzz-detail-modal-root');
  if (existingModal) existingModal.remove();

  const user = getUser();
  const isInitiative = post.linked_type === 'initiative';
  const imgUrl = post.image_url || DEFAULT_CIVIC_BG;

  const modalRoot = document.createElement('div');
  modalRoot.id = 'ck-buzz-detail-modal-root';
  modalRoot.className = 'ck-buzz-modal-backdrop';

  modalRoot.innerHTML = `
    <div class="ck-buzz-modal-dialog" role="dialog" aria-modal="true">
      <!-- Modal Header -->
      <div class="ck-buzz-modal-topbar">
        <div class="ck-buzz-modal-title-wrap">
          <span class="ck-buzz-fire-tag">${BI.flame(13, '#ea580c')} CIVIC BUZZ</span>
          <span class="ck-buzz-status-pill ${escapeHtml(post.linked_status || 'submitted')}">
            ${escapeHtml(post.linked_status || 'Active')}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Overflow Report Menu -->
          <button type="button" class="ck-buzz-icon-btn" id="ck-modal-report-btn" title="Report this post" aria-label="Report this post">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
          </button>
          <button type="button" class="ck-buzz-close-btn" id="ck-modal-close-btn" aria-label="Close modal">✕</button>
        </div>
      </div>

      <!-- Scrollable Modal Body -->
      <div class="ck-buzz-modal-body">
        <!-- Media / Card Showcase -->
        <div class="ck-buzz-modal-meme-frame">
          <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(post.caption)}" class="ck-buzz-modal-img" onerror="this.src='${DEFAULT_CIVIC_BG}'" />
          <div class="ck-buzz-modal-scrim"></div>
          <div class="ck-buzz-modal-meme-caption">
            ${escapeHtml(post.caption)}
          </div>
          ${post.cta_text ? `<div class="ck-buzz-modal-cta-badge">${BI.zap(12, '#ea580c')} ${escapeHtml(post.cta_text)}</div>` : ''}
          <div class="ck-card-watermark">
            <span class="ck-wm-flame">${BI.flame(14, '#ff5a36')}</span>
            <span class="ck-wm-brand">CIVIC-KALKI</span>
          </div>
        </div>

        <!-- Meta and Linked Issue Banner -->
        <div class="ck-buzz-modal-linked-box">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #ff5a36; letter-spacing: 0.05em;">
              Linked ${escapeHtml(post.linked_type || 'Issue')} #${escapeHtml(post.linked_id)}
            </div>
            <div style="font-size: 0.96rem; font-weight: 700; color: #0f172a; margin-top: 2px;" class="ck-truncate">
              ${escapeHtml(post.linked_title || post.caption)}
            </div>
            ${post.linked_area ? `<div style="font-size: 0.75rem; color: #64748b; display:inline-flex; align-items:center; gap:4px;">${BI.pin(13, '#64748b')} ${escapeHtml(post.linked_area)}</div>` : ''}
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="ck-modal-view-issue-btn" style="border-radius: 999px; font-weight: 700;">
            View Issue →
          </button>
        </div>

        <!-- Engagement Action Buttons Row -->
        <div class="ck-buzz-modal-actions-bar">
          <button type="button" class="ck-buzz-act-btn ${post.has_voted ? 'active' : ''}" id="ck-modal-upvote-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span id="ck-modal-vote-label">${post.has_voted ? 'Upvoted' : 'Upvote'}</span>
            <span class="ck-buzz-count-badge" id="ck-modal-vote-count">${post.vote_count || 0}</span>
          </button>

          <button type="button" class="ck-buzz-act-btn ${post.is_following ? 'active' : ''}" id="ck-modal-follow-btn">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span id="ck-modal-follow-label">${post.is_following ? 'Following Status' : 'Follow Status'}</span>
          </button>

          <button type="button" class="ck-buzz-act-btn" id="ck-modal-share-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Share</span>
          </button>

          ${isInitiative ? `
            <button type="button" class="ck-buzz-act-btn ck-buzz-join-btn" id="ck-modal-join-btn">
              ${BI.handshake(15, '#15803d')} <span>Join / Volunteer</span>
            </button>
          ` : ''}

          <button type="button" class="ck-buzz-act-btn" id="ck-modal-report-issue-btn" title="Report or escalate this civic issue via Civic Assistant">
            ${BI.alert(14, '#ef4444')} <span>Report Issue</span>
          </button>
        </div>

        <!-- Community Comments Section -->
        <div class="ck-buzz-comments-section">
          <div class="ck-buzz-comments-head">
            <h4 style="margin: 0; font-size: 0.92rem; font-weight: 700; color: #0f172a;">Community Comments</h4>
            <span style="font-size: 0.75rem; color: #64748b;" id="ck-modal-comments-count">Loading...</span>
          </div>

          <!-- Comment Input -->
          <div class="ck-buzz-comment-input-row">
            <input
              type="text"
              id="ck-modal-comment-input"
              class="ck-buzz-comment-input"
              placeholder="${user ? 'Add to the conversation (respectful, problem-focused)...' : 'Sign in to add a comment...'}"
              ${!user ? 'disabled' : ''}
              maxlength="500"
            />
            <button type="button" id="ck-modal-comment-send" class="btn btn-primary btn-sm" style="border-radius: 999px; padding: 6px 14px;" ${!user ? 'disabled' : ''}>
              Post
            </button>
          </div>
          <div id="ck-modal-comment-error" class="ck-buzz-inline-alert" style="display: none;"></div>

          <!-- Comments List Container -->
          <div id="ck-modal-comments-list" class="ck-buzz-comments-list">
            <div style="text-align: center; padding: 18px; color: #94a3b8; font-size: 0.8rem;">
              Loading conversation...
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalRoot);

  const closeModal = () => modalRoot.remove();
  modalRoot.addEventListener('click', (e) => {
    if (e.target === modalRoot) closeModal();
  });
  modalRoot.querySelector('#ck-modal-close-btn')?.addEventListener('click', closeModal);

  // Upvote
  const upvoteBtn = modalRoot.querySelector('#ck-modal-upvote-btn');
  const voteCount = modalRoot.querySelector('#ck-modal-vote-count');
  const voteLabel = modalRoot.querySelector('#ck-modal-vote-label');

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
        voteLabel.textContent = 'Upvoted';
      } else {
        upvoteBtn.classList.remove('active');
        voteLabel.textContent = 'Upvote';
      }
      voteCount.textContent = res.vote_count;
      post.has_voted = res.voted;
      post.vote_count = res.vote_count;
      if (typeof onUpdate === 'function') onUpdate(post);
    } catch (err) {
      toastError(err.message || 'Could not register vote');
    }
  });

  // Follow
  const followBtn = modalRoot.querySelector('#ck-modal-follow-btn');
  const followLabel = modalRoot.querySelector('#ck-modal-follow-label');

  followBtn?.addEventListener('click', async () => {
    if (!getUser()) {
      toastWarning('Please sign in to follow this conversation.');
      navigate('/login');
      return;
    }
    try {
      const res = await buzz.follow(post.id);
      if (res.following) {
        followBtn.classList.add('active');
        followLabel.textContent = 'Following Status';
        toastSuccess('Now following civic issue updates!');
      } else {
        followBtn.classList.remove('active');
        followLabel.textContent = 'Follow Status';
        toast('Unfollowed issue updates.');
      }
      post.is_following = res.following;
      if (typeof onUpdate === 'function') onUpdate(post);
    } catch (err) {
      toastError(err.message || 'Could not update follow status');
    }
  });

  // View Issue Button
  modalRoot.querySelector('#ck-modal-view-issue-btn')?.addEventListener('click', () => {
    buzz.logEvent(post.id, 'click_issue').catch(() => {});
    closeModal();
    navigate(`/entities/${post.linked_id}`);
  });

  // Share Action -> opens Share Modal
  modalRoot.querySelector('#ck-modal-share-btn')?.addEventListener('click', () => {
    openBuzzShareModal(post);
  });

  // Join / Volunteer (Initiative only)
  modalRoot.querySelector('#ck-modal-join-btn')?.addEventListener('click', async () => {
    try {
      await buzz.logEvent(post.id, 'join');
      toastSuccess('Thank you for volunteering! Opening initiative details...');
      setTimeout(() => {
        closeModal();
        navigate(`/entities/${post.linked_id}`);
      }, 700);
    } catch {
      navigate(`/entities/${post.linked_id}`);
    }
  });

  // Report Issue (Starts Civic Assistant)
  modalRoot.querySelector('#ck-modal-report-issue-btn')?.addEventListener('click', () => {
    closeModal();
    navigate('/dashboard');
    setTimeout(() => {
      const input = document.getElementById('ck-dark-input');
      if (input) {
        input.value = `Regarding issue #${post.linked_id} (${post.linked_title || post.caption}): `;
        input.focus();
      }
    }, 200);
  });

  // Overflow menu: Report Post
  modalRoot.querySelector('#ck-modal-report-btn')?.addEventListener('click', () => {
    const reason = window.prompt('Why are you reporting this Civic Buzz post?\n(e.g., Offensive language, personal data, misleading claim)');
    if (reason && reason.trim()) {
      buzz.report(post.id, reason.trim()).then((res) => {
        toastSuccess(res.message || 'Report received. Thank you for keeping our community safe.');
      }).catch((err) => {
        toastError(err.message || 'Could not submit report');
      });
    }
  });

  // Load and render comments
  async function loadComments() {
    const listEl = modalRoot.querySelector('#ck-modal-comments-list');
    const countEl = modalRoot.querySelector('#ck-modal-comments-count');
    try {
      const res = await buzz.getComments(post.id);
      const comments = res.data || [];
      countEl.textContent = `${comments.length} comment${comments.length === 1 ? '' : 's'}`;

      if (comments.length === 0) {
        listEl.innerHTML = `
          <div style="text-align:center; padding:16px; color:#94a3b8; font-size:0.8rem;">
            No comments yet. Start the conversation!
          </div>
        `;
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
      listEl.innerHTML = `<div style="text-align:center; padding:12px; color:#ef4444; font-size:0.75rem;">Failed to load comments</div>`;
    }
  }

  // Add Comment Submission
  const commentInput = modalRoot.querySelector('#ck-modal-comment-input');
  const commentSend = modalRoot.querySelector('#ck-modal-comment-send');
  const errorBox = modalRoot.querySelector('#ck-modal-comment-error');

  async function submitComment() {
    const text = commentInput.value.trim();
    if (!text) return;
    errorBox.style.display = 'none';
    commentSend.disabled = true;

    try {
      await buzz.addComment(post.id, text);
      commentInput.value = '';
      toastSuccess('Comment posted!');
      await loadComments();
    } catch (err) {
      errorBox.textContent = err.data?.message || err.message || 'Failed to submit comment';
      errorBox.style.display = 'block';
    } finally {
      commentSend.disabled = false;
    }
  }

  commentSend?.addEventListener('click', submitComment);
  commentInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitComment();
    }
  });

  await loadComments();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5-STEP MODAL WIZARD: CREATE CIVIC BUZZ POST
// ─────────────────────────────────────────────────────────────────────────────

export async function openBuzzCreateModal(preselectedEntityId = null, onSuccess = null, initialDraft = null) {
  const existingModal = document.getElementById('ck-buzz-create-modal-root');
  if (existingModal) existingModal.remove();

  const user = getUser();
  if (!user) {
    toastWarning('Please sign in to create a Civic Buzz post.');
    navigate('/login');
    return;
  }

  // Fetch candidate items: user's own items and followed items
  let candidateEntities = [];
  try {
    const [myRes, allRes] = await Promise.all([
      apiEntities.list({ owner_user_id: user.user_id, limit: 50 }).catch(() => ({ data: [] })),
      apiEntities.list({ limit: 50 }).catch(() => ({ data: [] })),
    ]);

    const combinedMap = new Map();
    (myRes.data || []).forEach(e => combinedMap.set(e.entity_id, { ...e, is_mine: true }));
    (allRes.data || []).forEach(e => {
      if (!combinedMap.has(e.entity_id)) combinedMap.set(e.entity_id, { ...e, is_mine: false });
    });
    candidateEntities = Array.from(combinedMap.values());
  } catch {
    candidateEntities = [];
  }

  // Wizard state
  let currentStep = initialDraft ? 4 : 1;
  let selectedType = initialDraft ? (initialDraft.template === 'initiative' ? 'promote_initiative' : initialDraft.template === 'awareness' ? 'awareness_card' : 'meme_issue') : 'meme_issue';
  let selectedEntity = null;
  let selectedStyle = initialDraft?.style || 'funny';
  let generatedCaptions = [];
  let chosenCaption = initialDraft?.caption || '';
  let chosenCta = initialDraft?.cta_text || '';
  let renderedPngDataUrl = null;

  // Preselect entity if provided
  if (preselectedEntityId) {
    selectedEntity = candidateEntities.find(e => String(e.entity_id) === String(preselectedEntityId)) || null;
  } else if (initialDraft?.linked_id) {
    selectedEntity = candidateEntities.find(e => String(e.entity_id) === String(initialDraft.linked_id)) || null;
  }
  if (!selectedEntity && candidateEntities.length > 0) {
    selectedEntity = candidateEntities[0];
  }

  // Resolve template and linked_type from selectedType
  function resolveTypeConfig() {
    if (selectedType === 'promote_initiative') {
      return { template: 'initiative', linked_type: 'initiative' };
    }
    if (selectedType === 'awareness_card') {
      return { template: 'awareness', linked_type: 'issue' };
    }
    if (selectedType === 'share_issue') {
      return { template: 'awareness', linked_type: 'issue' };
    }
    return { template: 'meme', linked_type: 'issue' };
  }

  const modalRoot = document.createElement('div');
  modalRoot.id = 'ck-buzz-create-modal-root';
  modalRoot.className = 'ck-buzz-modal-backdrop';

  document.body.appendChild(modalRoot);

  const closeModal = () => modalRoot.remove();
  modalRoot.addEventListener('click', (e) => {
    if (e.target === modalRoot) closeModal();
  });

  // Main Render Function for Wizard Steps
  async function renderWizard() {
    const { template, linked_type } = resolveTypeConfig();

    modalRoot.innerHTML = `
      <div class="ck-buzz-modal-dialog" role="dialog" aria-modal="true" style="max-width: 620px; border-radius: 20px;">
        <!-- Top bar with Title & Close -->
        <div class="ck-buzz-modal-topbar" style="padding: 16px 22px;">
          <div class="ck-buzz-modal-title-wrap">
            <span style="display:inline-flex; align-items:center; color:#ff5a36;">${BI.sparkles(20, '#ff5a36')}</span>
            <span style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">
              ${initialDraft ? 'Edit Civic Buzz Post' : 'Create Civic Buzz Post'}
            </span>
          </div>
          <button type="button" class="ck-buzz-close-btn" id="ck-wiz-close-btn" aria-label="Close modal">✕</button>
        </div>

        <!-- 5-Step Progress Tracker -->
        <div class="ck-wizard-step-tracker">
          <div class="ck-wizard-step-node ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}">
            <div class="ck-wizard-step-badge">${currentStep > 1 ? BI.check(13, '#ffffff') : '1'}</div>
            <span>Type</span>
          </div>
          <div class="ck-wizard-step-line ${currentStep > 1 ? 'completed' : ''}"></div>

          <div class="ck-wizard-step-node ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}">
            <div class="ck-wizard-step-badge">${currentStep > 2 ? BI.check(13, '#ffffff') : '2'}</div>
            <span>Issue</span>
          </div>
          <div class="ck-wizard-step-line ${currentStep > 2 ? 'completed' : ''}"></div>

          <div class="ck-wizard-step-node ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}">
            <div class="ck-wizard-step-badge">${currentStep > 3 ? BI.check(13, '#ffffff') : '3'}</div>
            <span>Style</span>
          </div>
          <div class="ck-wizard-step-line ${currentStep > 3 ? 'completed' : ''}"></div>

          <div class="ck-wizard-step-node ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}">
            <div class="ck-wizard-step-badge">${currentStep > 4 ? BI.check(13, '#ffffff') : '4'}</div>
            <span>Caption</span>
          </div>
          <div class="ck-wizard-step-line ${currentStep > 4 ? 'completed' : ''}"></div>

          <div class="ck-wizard-step-node ${currentStep === 5 ? 'active' : ''}">
            <div class="ck-wizard-step-badge">5</div>
            <span>Preview</span>
          </div>
        </div>

        <!-- Step Body Container -->
        <div class="ck-buzz-modal-body" style="padding: 22px; max-height: 520px; overflow-y: auto;">
          <div id="ck-wiz-step-content"></div>
        </div>

        <!-- Step Footer Navigation Bar -->
        <div style="padding: 14px 22px; border-top: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#ffffff; border-bottom-left-radius:20px; border-bottom-right-radius:20px;">
          <button type="button" class="btn btn-secondary" id="ck-wiz-prev-btn" style="border-radius:999px; font-weight:700;" ${currentStep === 1 ? 'disabled' : ''}>
            ← Back
          </button>

          <div style="display:flex; gap:10px;">
            ${currentStep === 5 ? `
              <button type="button" class="btn btn-secondary" id="ck-wiz-draft-btn" style="border-radius:999px; font-weight:700;">
                Save as Draft
              </button>
              <button type="button" class="btn btn-primary" id="ck-wiz-publish-btn" style="border-radius:999px; font-weight:800; padding:10px 22px; background:linear-gradient(135deg, #ff5a36, #ea580c); display:inline-flex; align-items:center; gap:6px;">
                <span>Publish to Civic Buzz</span> ${BI.flame(16, '#ffffff')}
              </button>
            ` : `
              <button type="button" class="btn btn-primary" id="ck-wiz-next-btn" style="border-radius:999px; font-weight:700; padding:10px 24px;">
                Continue →
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    modalRoot.querySelector('#ck-wiz-close-btn')?.addEventListener('click', closeModal);
    modalRoot.querySelector('#ck-wiz-prev-btn')?.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        renderWizard();
      }
    });

    const stepContent = modalRoot.querySelector('#ck-wiz-step-content');

    // ─────────────────────────────────────────────────────────
    // STEP 1: CHOOSE TYPE
    // ─────────────────────────────────────────────────────────
    if (currentStep === 1) {
      stepContent.innerHTML = `
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 1: Choose Conversation Type
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            Select the format that best conveys your civic situation to Pune citizens.
          </p>
        </div>

        <div class="ck-wizard-type-grid">
          <!-- Option 1: Meme -->
          <div class="ck-wizard-type-card ${selectedType === 'meme_issue' ? 'active' : ''}" data-type="meme_issue">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#ea580c;">${BI.flame(24, '#ea580c')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Viral / Funny</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Meme about a civic issue</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              High-impact bold meme typography over photo highlighting potholes, water breaks, or city hazards.
            </div>
          </div>

          <!-- Option 2: Awareness Card -->
          <div class="ck-wizard-type-card ${selectedType === 'awareness_card' ? 'active' : ''}" data-type="awareness_card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#0284c7;">${BI.awareness(24, '#0284c7')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Informative</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Awareness card</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Civic bulletin with verified fact strip (area, status, category) and direct demand for municipal action.
            </div>
          </div>

          <!-- Option 3: Initiative -->
          <div class="ck-wizard-type-card ${selectedType === 'promote_initiative' ? 'active' : ''}" data-type="promote_initiative">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#16a34a;">${BI.initiative(24, '#16a34a')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Movement</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Promote community initiative</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Rally neighborhood volunteers with meeting point, schedule, and prominent "Join" volunteer strip.
            </div>
          </div>

          <!-- Option 4: Share Issue -->
          <div class="ck-wizard-type-card ${selectedType === 'share_issue' ? 'active' : ''}" data-type="share_issue">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#eab308;">${BI.zap(24, '#eab308')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Civic Case</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Share an existing issue</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Turn an open CIVIC-KALKI complaint into a viral public post to accelerate official ward response.
            </div>
          </div>
        </div>
      `;

      stepContent.querySelectorAll('.ck-wizard-type-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedType = card.getAttribute('data-type');
          stepContent.querySelectorAll('.ck-wizard-type-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
      });

      modalRoot.querySelector('#ck-wiz-next-btn')?.addEventListener('click', () => {
        currentStep = 2;
        renderWizard();
      });
      return;
    }

    // ─────────────────────────────────────────────────────────
    // STEP 2: PICK LINKED ISSUE / INITIATIVE WITH SEARCH
    // ─────────────────────────────────────────────────────────
    if (currentStep === 2) {
      stepContent.innerHTML = `
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 2: Pick Linked Issue or Initiative
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            Select from your reported civic items or followed community activities.
          </p>
        </div>

        <!-- Live Search Bar -->
        <div style="margin-bottom: 14px; position:relative;">
          <input
            type="text"
            id="ck-wiz-entity-search"
            class="form-input"
            placeholder="Search by title, area (e.g. Baner, FC Road), or ID..."
            style="width:100%; font-size:0.86rem; padding: 10px 14px; border-radius:10px;"
          />
        </div>

        <!-- Scrollable Candidates List -->
        <div id="ck-wiz-entity-list" style="display:flex; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto; padding-right:4px;">
        </div>

        <div id="ck-wiz-entity-empty" style="display:none; text-align:center; padding:24px; color:#94a3b8; font-size:0.82rem;">
          No matching civic items found. Try a different search keyword.
        </div>
      `;

      const searchInput = stepContent.querySelector('#ck-wiz-entity-search');
      const listEl = stepContent.querySelector('#ck-wiz-entity-list');
      const emptyEl = stepContent.querySelector('#ck-wiz-entity-empty');

      function filterAndRenderEntities(query = '') {
        const q = query.toLowerCase().trim();
        const filtered = candidateEntities.filter(e => {
          if (!q) return true;
          const matchTitle = (e.name || '').toLowerCase().includes(q);
          const matchArea = (e.area || '').toLowerCase().includes(q);
          const matchId = String(e.entity_id).includes(q);
          return matchTitle || matchArea || matchId;
        });

        if (filtered.length === 0) {
          listEl.innerHTML = '';
          emptyEl.style.display = 'block';
          return;
        }

        emptyEl.style.display = 'none';
        listEl.innerHTML = filtered.map(e => {
          const isSelected = selectedEntity && selectedEntity.entity_id === e.entity_id;
          const isMovement = e.entity_type_id === 1 || e.entity_type_id === 2;
          return `
            <div class="ck-wizard-entity-card ${isSelected ? 'active' : ''}" data-id="${e.entity_id}" style="
              border: 1.5px solid ${isSelected ? '#ff5a36' : '#e2e8f0'};
              background: ${isSelected ? '#fff7ed' : '#ffffff'};
              border-radius: 12px;
              padding: 10px 14px;
              cursor: pointer;
              transition: all 0.15s;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
            ">
              <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:0.7rem; font-weight:800; color:#ff5a36;">#${e.entity_id}</span>
                  <span class="badge badge-secondary" style="font-size:0.65rem;">${e.is_mine ? 'My Item' : 'Community'}</span>
                  <span class="ck-buzz-status-pill ${escapeHtml(e.status || 'submitted')}" style="font-size:0.65rem; padding:1px 6px;">
                    ${escapeHtml(e.status || 'Active')}
                  </span>
                </div>
                <div style="font-weight:700; font-size:0.88rem; color:#0f172a; margin-top:2px;" class="ck-truncate">
                  ${escapeHtml(e.name)}
                </div>
                ${e.area ? `<div style="font-size:0.75rem; color:#64748b; display:inline-flex; align-items:center; gap:4px;">${BI.pin(12, '#64748b')} ${escapeHtml(e.area)}</div>` : ''}
              </div>
              <div style="display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; ${isSelected ? 'background:#ff5a36; color:#ffffff;' : 'border:1.5px solid #cbd5e1; color:transparent;'}">
                ${isSelected ? BI.check(13, '#ffffff') : ''}
              </div>
            </div>
          `;
        }).join('');

        listEl.querySelectorAll('.ck-wizard-entity-card').forEach(card => {
          card.addEventListener('click', () => {
            const id = Number(card.getAttribute('data-id'));
            selectedEntity = candidateEntities.find(e => e.entity_id === id) || null;
            filterAndRenderEntities(searchInput.value);
          });
        });
      }

      filterAndRenderEntities();
      searchInput.addEventListener('input', (e) => filterAndRenderEntities(e.target.value));

      modalRoot.querySelector('#ck-wiz-next-btn')?.addEventListener('click', () => {
        if (!selectedEntity) {
          toastWarning('Please select an issue or initiative to link.');
          return;
        }
        currentStep = 3;
        renderWizard();
      });
      return;
    }

    // ─────────────────────────────────────────────────────────
    // STEP 3: CHOOSE STYLE
    // ─────────────────────────────────────────────────────────
    if (currentStep === 3) {
      stepContent.innerHTML = `
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 3: Choose Conversation Style
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            How should the AI tune the tone and message for this civic post?
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <!-- Style 1: Funny -->
          <div class="ck-wizard-type-card ${selectedStyle === 'funny' ? 'active' : ''}" data-style="funny">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#ea580c;">${BI.smile(24, '#ea580c')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Viral Relay</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Funny and relatable</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Witty, self-deprecating street humor mocking the civic obstacle, never mocking people or communities.
            </div>
          </div>

          <!-- Style 2: Informative -->
          <div class="ck-wizard-type-card ${selectedStyle === 'informative' ? 'active' : ''}" data-style="informative">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#0284c7;">${BI.clipboard(24, '#0284c7')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Direct & Clear</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Informative</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Sharp, data-driven facts highlighting duration, safety hazards, and exact municipal ward accountability.
            </div>
          </div>

          <!-- Style 3: Emotional -->
          <div class="ck-wizard-type-card ${selectedStyle === 'emotional' ? 'active' : ''}" data-style="emotional">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="display:flex; align-items:center; color:#16a34a;">${BI.handshake(24, '#16a34a')}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Community Pride</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Emotional-community-focused</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Heartfelt, neighborhood solidarity calling on citizens to protect senior citizens, children, and our parks.
            </div>
          </div>
        </div>
      `;

      stepContent.querySelectorAll('.ck-wizard-type-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedStyle = card.getAttribute('data-style');
          stepContent.querySelectorAll('.ck-wizard-type-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
      });

      modalRoot.querySelector('#ck-wiz-next-btn')?.addEventListener('click', () => {
        currentStep = 4;
        renderWizard();
      });
      return;
    }

    // ─────────────────────────────────────────────────────────
    // STEP 4: CALL POST /buzz/captions -> 3 OPTIONS & FREE EDIT
    // ─────────────────────────────────────────────────────────
    if (currentStep === 4) {
      stepContent.innerHTML = `
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 4: AI Captions & Text
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            Pick one of Gemini AI's generated captions or edit freely.
          </p>
        </div>

        <!-- AI Captions Options Container -->
        <div id="ck-wiz-ai-loading" style="text-align:center; padding:24px 0;">
          <div class="spinner" style="margin: 0 auto 10px;"></div>
          <div style="font-size:0.8rem; font-weight:700; color:#ff5a36;">Generating 3 smart civic captions with Gemini AI...</div>
          <div style="font-size:0.72rem; color:#64748b; margin-top:2px;">Applying safety rules: no personal data, no mockery of people, mock problem only.</div>
        </div>

        <div id="ck-wiz-caption-cards" style="display:none; flex-direction:column; gap:8px; margin-bottom:16px;">
        </div>

        <!-- Regenerate Button -->
        <div style="display:flex; justify-content:flex-end; margin-bottom:14px;">
          <button type="button" id="ck-wiz-regen-btn" class="btn btn-secondary btn-sm" style="border-radius:999px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
            <span style="display:inline-flex; align-items:center;">${BI.bot(15, '#475569')}</span> Regenerate Captions
          </button>
        </div>

        <!-- Free Edit Form -->
        <div class="form-group" style="margin-bottom:12px;">
          <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:4px;">
            Post Caption (Overlay text) *
          </label>
          <textarea
            id="ck-wiz-caption-input"
            rows="2"
            class="form-input"
            placeholder="Edit your caption freely..."
            style="width:100%; font-size:0.88rem; font-family:inherit; padding:8px 12px; border-radius:10px;"
            maxlength="500"
          >${escapeHtml(chosenCaption)}</textarea>
        </div>

        <div class="form-group" style="margin-bottom:8px;">
          <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:4px;">
            Call to Action (CTA Text)
          </label>
          <input
            type="text"
            id="ck-wiz-cta-input"
            class="form-input"
            placeholder="e.g. Demand Action, Fix Baner Road, Join Clean-up"
            value="${escapeHtml(chosenCta)}"
            style="width:100%; font-size:0.86rem; padding:8px 12px; border-radius:10px;"
            maxlength="60"
          />
        </div>
      `;

      const loadingEl = stepContent.querySelector('#ck-wiz-ai-loading');
      const cardsEl = stepContent.querySelector('#ck-wiz-caption-cards');
      const regenBtn = stepContent.querySelector('#ck-wiz-regen-btn');
      const captionInput = stepContent.querySelector('#ck-wiz-caption-input');
      const ctaInput = stepContent.querySelector('#ck-wiz-cta-input');

      async function fetchCaptions() {
        loadingEl.style.display = 'block';
        cardsEl.style.display = 'none';
        try {
          const res = await buzz.generateCaptions({
            linked_id: selectedEntity.entity_id,
            linked_type,
            template,
            style: selectedStyle,
          });

          generatedCaptions = res.captions || [];
          loadingEl.style.display = 'none';
          cardsEl.style.display = 'flex';

          if (generatedCaptions.length === 0) {
            cardsEl.innerHTML = `<div style="font-size:0.8rem; color:#ef4444; padding:8px;">${escapeHtml(res.reason || 'Could not generate AI captions. You can type your own below.')}</div>`;
            return;
          }

          cardsEl.innerHTML = generatedCaptions.map((cap, idx) => `
            <div class="ck-wiz-caption-opt" data-idx="${idx}" style="
              border: 1.5px solid #e2e8f0;
              background: #f8fafc;
              border-radius: 10px;
              padding: 10px 14px;
              cursor: pointer;
              transition: all 0.15s;
            ">
              <div style="font-weight:700; color:#0f172a; font-size:0.88rem;">"${escapeHtml(cap.caption)}"</div>
              <div style="font-size:0.72rem; font-weight:700; color:#ff5a36; margin-top:3px;">
                CTA: ${escapeHtml(cap.cta_text || 'Take Action')}
              </div>
            </div>
          `).join('');

          // Select first caption by default if none is entered
          if (!captionInput.value && generatedCaptions[0]) {
            captionInput.value = generatedCaptions[0].caption;
            ctaInput.value = generatedCaptions[0].cta_text || '';
            chosenCaption = captionInput.value;
            chosenCta = ctaInput.value;
          }

          cardsEl.querySelectorAll('.ck-wiz-caption-opt').forEach(opt => {
            opt.addEventListener('click', () => {
              const idx = Number(opt.getAttribute('data-idx'));
              const selected = generatedCaptions[idx];
              if (selected) {
                captionInput.value = selected.caption;
                ctaInput.value = selected.cta_text || '';
                chosenCaption = selected.caption;
                chosenCta = selected.cta_text || '';
                toastSuccess('Caption applied! You can customize it freely.');
              }
            });
          });
        } catch (err) {
          loadingEl.style.display = 'none';
          cardsEl.style.display = 'flex';
          cardsEl.innerHTML = `<div style="font-size:0.8rem; color:#ef4444; padding:8px;">Failed to generate AI captions: ${escapeHtml(err.message)}. Please enter your caption below.</div>`;
        }
      }

      regenBtn?.addEventListener('click', fetchCaptions);
      captionInput.addEventListener('input', () => { chosenCaption = captionInput.value; });
      ctaInput.addEventListener('input', () => { chosenCta = ctaInput.value; });

      if (generatedCaptions.length === 0) {
        fetchCaptions();
      } else {
        loadingEl.style.display = 'none';
        cardsEl.style.display = 'flex';
      }

      modalRoot.querySelector('#ck-wiz-next-btn')?.addEventListener('click', () => {
        chosenCaption = captionInput.value.trim();
        chosenCta = ctaInput.value.trim();
        if (!chosenCaption) {
          toastWarning('Please enter or select a caption.');
          return;
        }
        currentStep = 5;
        renderWizard();
      });
      return;
    }

    // ─────────────────────────────────────────────────────────
    // STEP 5: PREVIEW ACTUAL CARD AS PNG -> PUBLISH OR DRAFT
    // ─────────────────────────────────────────────────────────
    if (currentStep === 5) {
      stepContent.innerHTML = `
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 5: Preview & Publish
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            The card has been rendered to PNG using the ${template.toUpperCase()} template.
          </p>
        </div>

        <!-- Render Target (Hidden DOM element converted by html-to-image) -->
        <div id="ck-wiz-render-mount" style="position:fixed; left:-9999px; top:-9999px; width:600px; height:600px; pointer-events:none;">
          ${renderCardHtml({
            template,
            style: selectedStyle,
            caption: chosenCaption,
            cta_text: chosenCta,
            issue: selectedEntity,
          })}
        </div>

        <!-- Live Preview Showcase -->
        <div class="ck-wizard-preview-container">
          <div id="ck-wiz-preview-loading" style="text-align:center; padding:40px; color:#ffffff;">
            <div class="spinner" style="margin: 0 auto 10px; border-color: rgba(255,255,255,0.2); border-top-color: #ff5a36;"></div>
            <div style="font-size:0.8rem; font-weight:700;">Rendering PNG in browser...</div>
          </div>
          <div id="ck-wiz-preview-box" class="ck-wizard-preview-scaler" style="display:none;">
            <img id="ck-wiz-preview-img" alt="Civic Buzz Preview" style="width:100%; height:100%; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.5);" />
          </div>
        </div>

        <!-- Safety check alert container -->
        <div id="ck-wiz-safety-alert" class="ck-buzz-inline-alert" style="display:none; margin-top:14px;"></div>
      `;

      const mountEl = stepContent.querySelector('#ck-wiz-render-mount .ck-card-canvas');
      const previewLoading = stepContent.querySelector('#ck-wiz-preview-loading');
      const previewBox = stepContent.querySelector('#ck-wiz-preview-box');
      const previewImg = stepContent.querySelector('#ck-wiz-preview-img');
      const safetyAlert = stepContent.querySelector('#ck-wiz-safety-alert');

      // Trigger PNG Rendering
      try {
        renderedPngDataUrl = await renderTemplateToPng(mountEl);
        previewImg.src = renderedPngDataUrl;
        previewLoading.style.display = 'none';
        previewBox.style.display = 'flex';
      } catch (renderErr) {
        console.error('html-to-image render error:', renderErr);
        previewLoading.innerHTML = `<div style="color:#fca5a5; font-size:0.8rem;">Preview generated via HTML/CSS layout</div>`;
        previewBox.innerHTML = mountEl.outerHTML;
        previewBox.style.display = 'flex';
      }

      // Handler for Publish and Draft submissions
      async function submitPost(targetStatus) {
        safetyAlert.style.display = 'none';
        const pubBtn = modalRoot.querySelector('#ck-wiz-publish-btn');
        const draftBtn = modalRoot.querySelector('#ck-wiz-draft-btn');
        pubBtn.disabled = true;
        draftBtn.disabled = true;

        if (targetStatus === 'published') {
          pubBtn.textContent = 'Verifying Safety...';
        } else {
          draftBtn.textContent = 'Saving...';
        }

        try {
          // Upload rendered PNG image first
          let uploadedImageUrl = null;
          if (renderedPngDataUrl) {
            try {
              const uploadRes = await buzz.uploadImage(renderedPngDataUrl);
              uploadedImageUrl = uploadRes.image_url;
            } catch (upErr) {
              console.warn('Could not store PNG file, saving data URL fallback:', upErr);
              uploadedImageUrl = renderedPngDataUrl;
            }
          }

          const payload = {
            linked_type,
            linked_id: Number(selectedEntity.entity_id),
            template,
            style: selectedStyle,
            caption: chosenCaption,
            cta_text: chosenCta || null,
            image_url: uploadedImageUrl,
            status: targetStatus,
          };

          if (initialDraft && initialDraft.id) {
            await buzz.update(initialDraft.id, payload);
          } else {
            await buzz.create(payload);
          }

          toastSuccess(
            targetStatus === 'published'
              ? 'Civic Buzz post published to community!'
              : 'Draft saved under My Civic Activity!'
          );
          closeModal();
          if (typeof onSuccess === 'function') onSuccess();
        } catch (err) {
          safetyAlert.textContent = err.data?.message || err.message || 'Submission failed. Please revise.';
          safetyAlert.style.display = 'block';
        } finally {
          pubBtn.disabled = false;
          draftBtn.disabled = false;
          pubBtn.innerHTML = `<span>Publish to Civic Buzz</span> ${BI.flame(16, '#ffffff')}`;
          draftBtn.textContent = 'Save as Draft';
        }
      }

      modalRoot.querySelector('#ck-wiz-publish-btn')?.addEventListener('click', () => submitPost('published'));
      modalRoot.querySelector('#ck-wiz-draft-btn')?.addEventListener('click', () => submitPost('draft'));
    }
  }

  await renderWizard();
}
