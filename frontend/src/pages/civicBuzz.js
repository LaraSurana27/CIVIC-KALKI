/**
 * CIVIC-KALKI — Civic Buzz Page (Section 6 & 7)
 * Live feed of approved & published Civic Campaigns (memes).
 * Features:
 *  - Feed view (only Published memes, live issue status, real honest metrics)
 *  - "My Memes" view (citizen's submissions, statuses, rejection reasons)
 *  - Honest engagement tracking (view, issue_click, share_initiated)
 *  - Client-side PNG export (html-to-image) for approved/published campaigns
 *  - "Report this meme" takedown flow (sets to under_review, hides immediately)
 */

import { getUser, getToken } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { navigate } from '../router.js';
import { toastError, toastSuccess, toast } from '../components/toast.js';
import { renderMemeCard, exportMemeImage } from '../components/memeRenderer.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

const API = '/api';

// Deduplication session key for today
function getSessionKey() {
  let sid = localStorage.getItem('ck_buzz_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('ck_buzz_session_id', sid);
  }
  const today = new Date().toISOString().slice(0, 10);
  return `${sid}_${today}`;
}

async function apiRequest(method, path, body = null) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, config);
  const data = await res.json().catch(() => ({ success: false, error: 'Server error' }));
  if (!res.ok) throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { data });
  return data;
}

let activeTab = 'feed'; // 'feed' | 'my'
let feedCampaigns = [];
let myCampaigns = [];
let reportingCampaignId = null;

export async function renderCivicBuzz() {
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="buzz-container" style="max-width: 1200px; margin: 0 auto; padding: 24px 16px;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
                  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 28px 24px;
                  margin-bottom: 28px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 28px;">🔥</span>
              <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.5px;">
                Civic Buzz &amp; Meme Studio
              </h1>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin: 0; max-width: 620px;">
              Transforming verified civic issues into relatable awareness campaigns. Every meme is linked to a real issue with honest accountability tracking.
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="buzz-create-btn" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700;">
              <span>⚡</span> Create a Meme
            </button>
            <a href="/entities" class="btn btn-secondary" style="font-size: 13px;">Browse Issues</a>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 8px; margin-top: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;">
          <button id="tab-feed" class="buzz-tab ${activeTab === 'feed' ? 'buzz-tab-active' : ''}" style="
            background: ${activeTab === 'feed' ? 'var(--primary, #3b82f6)' : 'transparent'};
            color: ${activeTab === 'feed' ? '#fff' : '#94a3b8'};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            🌐 Community Feed
          </button>
          <button id="tab-my" class="buzz-tab ${activeTab === 'my' ? 'buzz-tab-active' : ''}" style="
            background: ${activeTab === 'my' ? 'var(--primary, #3b82f6)' : 'transparent'};
            color: ${activeTab === 'my' ? '#fff' : '#94a3b8'};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            👤 My Memes &amp; Drafts
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div id="buzz-content">
        <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
          <div class="spinner" style="margin: 0 auto 16px;"></div>
          <p>Loading Civic Buzz feed...</p>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div id="buzz-report-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9999;
                align-items: center; justify-content: center; padding: 16px;">
      <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
                  max-width: 480px; width: 100%; padding: 24px; color: #fff;">
        <h3 style="font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 10px;">🚩 Report Meme</h3>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">
          Reporting will immediately place this campaign <strong>Under Review</strong> and remove it from the public feed pending moderator investigation.
        </p>
        <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Reason for Report *</label>
        <textarea id="buzz-report-reason" rows="3" class="form-input" placeholder="e.g. Inappropriate photo, contains private individual, misleading claim..."
                  style="width: 100%; border-radius: 8px; padding: 10px; margin-bottom: 16px; font-size: 13px;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="buzz-report-cancel" class="btn btn-secondary">Cancel</button>
          <button id="buzz-report-submit" class="btn btn-danger" style="background: #ef4444; color: #fff; border: none; font-weight: 600;">
            Confirm Report &amp; Takedown
          </button>
        </div>
      </div>
    </div>
  `);

  attachLayoutEvents();
  attachBuzzHeaderEvents();
  await loadCurrentTab();
}

function attachBuzzHeaderEvents() {
  document.getElementById('buzz-create-btn')?.addEventListener('click', () => {
    navigate('/entities');
    toast('Select an approved issue and click "Create Civic Meme" to start.');
  });

  document.getElementById('tab-feed')?.addEventListener('click', async () => {
    if (activeTab === 'feed') return;
    activeTab = 'feed';
    updateTabs();
    await loadCurrentTab();
  });

  document.getElementById('tab-my')?.addEventListener('click', async () => {
    if (activeTab === 'my') return;
    const user = getUser();
    if (!user) {
      toast('Please sign in to view your memes and drafts.');
      navigate('/login');
      return;
    }
    activeTab = 'my';
    updateTabs();
    await loadCurrentTab();
  });

  // Modal events
  document.getElementById('buzz-report-cancel')?.addEventListener('click', () => {
    document.getElementById('buzz-report-modal').style.display = 'none';
    reportingCampaignId = null;
  });

  document.getElementById('buzz-report-submit')?.addEventListener('click', async () => {
    const reason = document.getElementById('buzz-report-reason').value.trim();
    if (!reason) {
      toastError('Please provide a reason for the report.');
      return;
    }
    try {
      await apiRequest('POST', `/meme/campaigns/${reportingCampaignId}/report`, { reason });
      toastSuccess('Content reported. Placed under review and hidden from feed.');
      document.getElementById('buzz-report-modal').style.display = 'none';
      reportingCampaignId = null;
      await loadCurrentTab();
    } catch (err) {
      toastError(err.message || 'Failed to submit report');
    }
  });
}

function updateTabs() {
  const tabFeed = document.getElementById('tab-feed');
  const tabMy = document.getElementById('tab-my');
  if (tabFeed && tabMy) {
    tabFeed.style.background = activeTab === 'feed' ? 'var(--primary, #3b82f6)' : 'transparent';
    tabFeed.style.color = activeTab === 'feed' ? '#fff' : '#94a3b8';
    tabMy.style.background = activeTab === 'my' ? 'var(--primary, #3b82f6)' : 'transparent';
    tabMy.style.color = activeTab === 'my' ? '#fff' : '#94a3b8';
  }
}

async function loadCurrentTab() {
  const container = document.getElementById('buzz-content');
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
      <div class="spinner" style="margin: 0 auto 16px;"></div>
      <p>Loading...</p>
    </div>
  `;

  try {
    if (activeTab === 'feed') {
      const res = await apiRequest('GET', '/meme/feed');
      feedCampaigns = res.campaigns || [];
      renderFeedView(container, feedCampaigns);

      // Record views for all visible feed items (deduplicated by session key)
      const sessionKey = getSessionKey();
      feedCampaigns.forEach((c) => {
        apiRequest('POST', `/meme/campaigns/${c.campaign_id}/event`, {
          event_type: 'view',
          session_key: sessionKey,
        }).catch(() => {});
      });
    } else {
      const res = await apiRequest('GET', '/meme/my');
      myCampaigns = res.campaigns || [];
      renderMyMemesView(container, myCampaigns);
    }
  } catch (err) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;">
        <p style="color: #ef4444; font-weight: 600; margin-bottom: 8px;">Failed to load campaigns</p>
        <p style="color: #94a3b8; font-size: 13px;">${escapeHtml(err.message)}</p>
        <button id="buzz-retry-btn" class="btn btn-secondary" style="margin-top: 12px;">Try Again</button>
      </div>
    `;
    document.getElementById('buzz-retry-btn')?.addEventListener('click', loadCurrentTab);
  }
}

function renderFeedView(container, campaigns) {
  if (!campaigns || campaigns.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 80px 24px; background: rgba(30, 41, 59, 0.5);
                  border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px;">
        <span style="font-size: 48px; display: block; margin-bottom: 16px;">🌱</span>
        <h3 style="color: #fff; font-size: 20px; font-weight: 700; margin-bottom: 8px;">No Active Civic Campaigns Yet</h3>
        <p style="color: #94a3b8; font-size: 14px; max-width: 480px; margin: 0 auto 24px;">
          Be the first to turn a real, approved civic problem into relatable awareness content that drives action.
        </p>
        <a href="/entities" class="btn btn-primary" style="font-weight: 700;">Explore Civic Issues</a>
      </div>
    `;
    return;
  }

  const cardsHtml = campaigns.map((c) => {
    const cardRender = renderMemeCard({
      template_type: c.template_type,
      headline: c.headline,
      caption: c.caption,
      locality: c.locality,
      category: c.issue_category,
      photoUrl: c.photo_file_id ? `/api/files/${c.photo_file_id}` : null,
      shareLink: `/entities/${c.linked_entity_id}`,
      exportMode: false,
    });

    const metrics = c.impact || { views: 0, issue_clicks: 0, shares_initiated: 0, participation: 0 };
    const hasActivity = metrics.views > 0 || metrics.issue_clicks > 0 || metrics.shares_initiated > 0 || metrics.participation > 0;

    return `
      <div class="buzz-feed-item" style="
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      ">
        <!-- Visual Meme Container -->
        <div style="display: flex; justify-content: center; background: #0f172a; padding: 12px;" id="meme-container-${c.campaign_id}">
          ${cardRender}
        </div>

        <!-- Issue Meta & Honest Impact Bar -->
        <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
                ${escapeHtml(c.issue_category || 'Civic Issue')}
              </span>
              <span style="font-size: 11px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 2px 8px; font-weight: 600;">
                Live Issue: ${escapeHtml(c.issue_status || 'Active')}
              </span>
            </div>
            <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin: 0 0 10px; line-height: 1.4;">
              ${escapeHtml(c.issue_title || 'Civic Issue #' + c.linked_entity_id)}
            </h4>
          </div>

          <!-- Real Impact Stats Card -->
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">
              <span>📈 REAL IMPACT (RECORDED ONLY)</span>
              ${!hasActivity ? '<span style="color: #64748b; font-style: italic;">No activity yet</span>' : ''}
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center;">
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #fff;">${metrics.views}</div>
                <div style="font-size: 10px; color: #94a3b8;">Views</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #38bdf8;">${metrics.issue_clicks}</div>
                <div style="font-size: 10px; color: #94a3b8;">Issue Taps</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #a78bfa;">${metrics.shares_initiated}</div>
                <div style="font-size: 10px; color: #94a3b8;">Shares Init.</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #34d399;">${metrics.participation}</div>
                <div style="font-size: 10px; color: #94a3b8;">Actions</div>
              </div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-primary buzz-view-issue-btn" data-campaign="${c.campaign_id}" data-issue="${c.linked_entity_id}"
                    style="flex: 1; font-size: 12px; padding: 8px 12px; font-weight: 600; min-width: 100px;">
              🔍 View Issue
            </button>
            <button class="btn btn-secondary buzz-share-btn" data-campaign="${c.campaign_id}" data-issue="${c.linked_entity_id}"
                    style="font-size: 12px; padding: 8px 12px;">
              🔗 Share
            </button>
            <button class="btn btn-secondary buzz-export-btn" data-container="meme-container-${c.campaign_id}" data-id="${c.campaign_id}"
                    style="font-size: 12px; padding: 8px 10px;" title="Export PNG image">
              📥
            </button>
            <button class="btn buzz-report-btn" data-campaign="${c.campaign_id}"
                    style="background: transparent; border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; font-size: 11px; padding: 8px 10px; border-radius: 6px;"
                    title="Report content">
              🚩
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
      ${cardsHtml}
    </div>
  `;

  attachFeedActionEvents();
}

function attachFeedActionEvents() {
  document.querySelectorAll('.buzz-view-issue-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const campaignId = btn.getAttribute('data-campaign');
      const issueId = btn.getAttribute('data-issue');
      apiRequest('POST', `/meme/campaigns/${campaignId}/event`, {
        event_type: 'issue_click',
        session_key: getSessionKey(),
      }).catch(() => {});
      navigate(`/entities/${issueId}?campaign_id=${campaignId}`);
    });
  });

  document.querySelectorAll('.buzz-share-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const campaignId = btn.getAttribute('data-campaign');
      const shareUrl = `${window.location.origin}/buzz?campaignId=${campaignId}`;

      apiRequest('POST', `/meme/campaigns/${campaignId}/event`, {
        event_type: 'share_initiated',
        session_key: getSessionKey(),
      }).catch(() => {});

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toastSuccess('Share link copied to clipboard! (Shares initiated recorded)');
      } else {
        toast(`Share URL: ${shareUrl}`);
      }
    });
  });

  document.querySelectorAll('.buzz-export-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const containerId = btn.getAttribute('data-container');
      const id = btn.getAttribute('data-id');
      try {
        btn.disabled = true;
        btn.textContent = '⏳';
        await exportMemeImage(containerId, `civic-meme-${id}.png`);
        toastSuccess('Meme downloaded successfully!');
      } catch (err) {
        toastError(err.message || 'Export failed');
      } finally {
        btn.disabled = false;
        btn.textContent = '📥';
      }
    });
  });

  document.querySelectorAll('.buzz-report-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      reportingCampaignId = btn.getAttribute('data-campaign');
      document.getElementById('buzz-report-reason').value = '';
      document.getElementById('buzz-report-modal').style.display = 'flex';
    });
  });
}

function renderMyMemesView(container, campaigns) {
  if (!campaigns || campaigns.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 24px; background: rgba(30, 41, 59, 0.4);
                  border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px;">
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">🎨</span>
        <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 8px;">No Memes Created Yet</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">
          You haven't created any civic meme campaigns yet. Go to an approved issue to get started!
        </p>
        <a href="/entities" class="btn btn-primary">Select an Issue</a>
      </div>
    `;
    return;
  }

  const itemsHtml = campaigns.map((c) => {
    const statusBadges = {
      draft: '<span class="badge" style="background:#64748b;color:#fff;">Draft</span>',
      pending_review: '<span class="badge" style="background:#eab308;color:#000;">Pending Moderator Review</span>',
      approved: '<span class="badge" style="background:#10b981;color:#fff;">Approved</span>',
      published: '<span class="badge" style="background:#3b82f6;color:#fff;">Published &amp; Live</span>',
      rejected: '<span class="badge" style="background:#ef4444;color:#fff;">Rejected</span>',
      under_review: '<span class="badge" style="background:#f97316;color:#fff;">Under Review (Hidden)</span>',
    };
    const badge = statusBadges[c.status] || `<span class="badge">${escapeHtml(c.status)}</span>`;

    return `
      <div style="background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              ${badge}
              <span style="font-size: 11px; color: #94a3b8;">Template: <strong>${escapeHtml(c.template_type)}</strong></span>
              <span style="font-size: 11px; color: #94a3b8;">Created: ${new Date(c.created_date).toLocaleDateString()}</span>
            </div>
            <h4 style="color: #fff; font-size: 16px; font-weight: 700; margin: 0 0 6px;">
              "${escapeHtml(c.headline)}"
            </h4>
            <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 10px; font-style: italic;">
              "${escapeHtml(c.caption)}"
            </p>
            <div style="font-size: 12px; color: #94a3b8;">
              Linked Issue: <a href="/entities/${c.linked_entity_id}" style="color: #38bdf8; text-decoration: underline;">Issue #${c.linked_entity_id}</a>
            </div>
          </div>
        </div>

        ${c.status === 'rejected' && c.rejection_reason ? `
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 6px; margin: 10px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #ef4444; margin-bottom: 2px;">Moderator Feedback:</div>
            <div style="font-size: 13px; color: #fca5a5;">${escapeHtml(c.rejection_reason)}</div>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; pt-2; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #94a3b8;">
          <div>Source: <strong>${escapeHtml(c.caption_source || 'AI-assisted')}</strong></div>
          <div style="display: flex; gap: 8px;">
            ${c.status === 'draft' ? `
              <button class="btn btn-primary" onclick="window.location.href='/meme/studio/${c.linked_entity_id}'" style="font-size: 12px; padding: 6px 12px;">
                Continue Editing
              </button>
            ` : ''}
            ${c.status === 'published' ? `
              <a href="/entities/${c.linked_entity_id}" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">
                View on Issue
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div>${itemsHtml}</div>`;
}
