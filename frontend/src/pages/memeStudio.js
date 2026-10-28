/**
 * CIVIC-KALKI � Meme Studio Page (Section 6)
 * 5-step wizard: 1) Template -> 2) AI Captions + edit -> 3) Attestation ->
 *                4) Live preview -> 5) Submit
 *
 * State is kept in memory (no page reloads between steps).
 */

import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { navigate } from '../router.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { renderMemeCard } from '../components/memeRenderer.js';
import { request as apiRequest } from '../api.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// Wizard state
let state = {
  step: 1,
  issueId: null,
  issue: null,
  eligibility: null,
  templateType: null,
  aiOptions: [],
  selectedOption: null,   // { headline, caption, humor_level }
  editedHeadline: '',
  editedCaption: '',
  captionSource: 'manual',
  originalAiSuggestion: null,
  safetyResult: null,
  attestationAccepted: false,
  submitting: false,
};

export async function renderMemeStudio({ issueId }) {
  if (!requireAuth(navigate)) return;

  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-4">
      <div class="topbar-breadcrumb mb-2">
        <a href="/entities/${issueId}" class="text-link">? Back to Issue</a>
      </div>
      <h1>?? Civic Meme Studio</h1>
      <p class="text-secondary" style="margin-top:4px;">Turn a real civic issue into relatable awareness content. All campaigns require moderator approval.</p>
    </div>
    <div id="meme-studio-body"></div>
  `, 'Civic Meme Studio');
  attachLayoutEvents();

  // Reset state for new studio session
  state = { ...state, step: 1, issueId: Number(issueId), issue: null, eligibility: null };

  await loadIssueAndCheckEligibility(issueId);
}

async function loadIssueAndCheckEligibility(issueId) {
  const body = document.getElementById('meme-studio-body');
  body.innerHTML = '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';

  try {
    const [issueRes, eligRes] = await Promise.all([
      apiRequest('GET', `/entities/${issueId}`),
      apiRequest('GET', `/meme/eligibility/${issueId}`),
    ]);

    state.issue = issueRes.data;
    state.eligibility = eligRes.data;

    if (!state.eligibility.eligible) {
      renderBlocked(body, state.eligibility.reason);
      return;
    }

    renderStep1(body);
  } catch (err) {
    body.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message || 'Failed to load issue.')}</div>`;
  }
}

function renderBlocked(body, reason) {
  body.innerHTML = `
    <div class="alert alert-warning" style="max-width:600px;">
      <strong>? Cannot Create Meme Campaign</strong>
      <p style="margin-top:8px;">${escapeHtml(reason)}</p>
      <p style="margin-top:8px;color:var(--text-secondary);font-size:0.875rem;">
        If this is a serious matter (crime, harassment, communal issues), please
        <a href="/entities/new" class="text-link">file a Grievance</a> instead.
      </p>
    </div>
  `;
}

// -- Step 1: Pick template --------------------------------------------------
function renderStep1(body) {
  state.step = 1;
  const templates = state.eligibility.templateTypes || [];
  const TEMPLATE_INFO = {
    relatable: {
      icon: '??',
      name: 'Relatable',
      desc: 'Light situational humor that makes people nod. "We\'ve all been there." Perfect for everyday civic frustrations.',
    },
    awareness: {
      icon: '??',
      name: 'Awareness',
      desc: 'Factual, informative content that raises visibility for an issue. Facts from the actual report only.',
    },
    call_to_action: {
      icon: '??',
      name: 'Call to Action',
      desc: 'Energizing content that encourages citizens to report, support, or take action together.',
    },
  };

  body.innerHTML = `
    <div class="ck-studio-wizard">
      ${renderStepIndicator(1)}
      <h2 class="mb-2">Choose a Template</h2>
      <p class="text-secondary mb-4">Pick the tone that best fits this issue.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:720px;">
        ${templates.map((t) => {
          const info = TEMPLATE_INFO[t] || { icon: '??', name: t, desc: '' };
          return `
            <button class="ck-template-card" data-template="${t}" onclick="window._memePickTemplate('${t}')">
              <div style="font-size:2.5rem;margin-bottom:8px;">${info.icon}</div>
              <div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${info.name}</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">${info.desc}</div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  window._memePickTemplate = (t) => {
    state.templateType = t;
    renderStep2(body);
  };
}

// -- Step 2: AI captions + edit ----------------------------------------------
async function renderStep2(body) {
  state.step = 2;
  body.innerHTML = `
    <div class="ck-studio-wizard">
      ${renderStepIndicator(2)}
      <h2 class="mb-2">Caption Your Meme</h2>
      <div class="loading-overlay" style="position:static;height:80px;"><div class="spinner"></div></div>
      <p class="text-secondary">Generating AI caption suggestions...</p>
    </div>
  `;

  let aiResult = { options: [], ai_unavailable: false };
  try {
    const res = await apiRequest('POST', '/meme/captions', {
      issue_id: state.issueId,
      template_type: state.templateType,
    });
    aiResult = res.data;
  } catch (err) {
    aiResult = { options: [], ai_unavailable: true, reason: err.message || 'AI unavailable.' };
  }

  state.aiOptions = aiResult.options || [];

  const aiUnavailableNotice = aiResult.ai_unavailable
    ? `<div class="alert alert-warning mb-3" style="max-width:640px;">
        <strong>?? AI Unavailable</strong>
        <p style="margin-top:4px;font-size:0.875rem;">${escapeHtml(aiResult.reason || 'AI caption service is temporarily unavailable. Please write your own caption below.')}</p>
        <p style="font-size:0.75rem;color:var(--text-secondary);">Note: Automated safety check flagged as "unavailable" � moderator will review manually.</p>
      </div>`
    : '';

  const optionsHtml = state.aiOptions.length > 0
    ? `
      <div class="mb-3" style="max-width:640px;">
        <label class="form-label mb-2"><strong>AI Suggestions (select one to pre-fill):</strong></label>
        ${state.aiOptions.map((opt, i) => `
          <button class="ck-caption-option" onclick="window._memeSelectOption(${i})" id="capopt-${i}" style="display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;border-radius:8px;border:2px solid var(--border-color);background:var(--bg-secondary);cursor:pointer;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${escapeHtml(opt.headline)}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">${escapeHtml(opt.caption)}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">Humor: ${opt.humor_level}</div>
          </button>
        `).join('')}
      </div>
    `
    : '';

  body.innerHTML = `
    <div class="ck-studio-wizard" style="max-width:720px;">
      ${renderStepIndicator(2)}
      <h2 class="mb-2">Caption Your Meme</h2>
      ${aiUnavailableNotice}
      ${optionsHtml}

      <div class="mb-3">
        <label class="form-label" for="meme-headline">Headline <span style="color:var(--text-muted);font-size:0.8rem;">(max 60 chars)</span></label>
        <input id="meme-headline" class="form-input" type="text" maxlength="60"
          placeholder="e.g. Pothole life got real"
          value="${escapeHtml(state.editedHeadline)}"
          oninput="window._memeSafetyCheck()"
        />
        <div id="headline-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 60</div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="meme-caption">Caption <span style="color:var(--text-muted);font-size:0.8rem;">(max 140 chars)</span></label>
        <textarea id="meme-caption" class="form-input" rows="3" maxlength="140"
          placeholder="e.g. Me checking the same pothole every day like it's a long-term relationship."
          oninput="window._memeSafetyCheck()"
        >${escapeHtml(state.editedCaption)}</textarea>
        <div id="caption-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 140</div>
      </div>

      <div id="safety-feedback" style="min-height:40px;"></div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(1)">? Back</button>
        <button class="btn btn-primary" id="step2-next" onclick="window._memeGoStep3()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `;

  // After render, set initial values if options selected before
  updateCharCounts();

  window._memeSelectOption = (i) => {
    const opt = state.aiOptions[i];
    if (!opt) return;
    state.selectedOption = opt;
    state.editedHeadline = opt.headline;
    state.editedCaption = opt.caption;
    state.captionSource = 'ai';
    state.originalAiSuggestion = opt;
    document.getElementById('meme-headline').value = opt.headline;
    document.getElementById('meme-caption').value = opt.caption;
    // Highlight selected
    state.aiOptions.forEach((_, j) => {
      const el = document.getElementById(`capopt-${j}`);
      if (el) el.style.borderColor = j === i ? 'var(--accent-primary)' : 'var(--border-color)';
    });
    window._memeSafetyCheck();
  };

  let safetyTimeout;
  window._memeSafetyCheck = () => {
    updateCharCounts();
    clearTimeout(safetyTimeout);
    safetyTimeout = setTimeout(runSafetyCheck, 500);
  };

  async function runSafetyCheck() {
    const headline = document.getElementById('meme-headline')?.value || '';
    const caption = document.getElementById('meme-caption')?.value || '';

    if (!headline && !caption) {
      setSafetyFeedback('', false);
      return;
    }

    // Update captionSource if user edited after AI selection
    if (state.captionSource === 'ai') {
      if (headline !== (state.selectedOption?.headline || '') || caption !== (state.selectedOption?.caption || '')) {
        state.captionSource = 'ai_edited';
      }
    } else {
      state.captionSource = 'manual';
    }

    state.editedHeadline = headline;
    state.editedCaption = caption;

    setSafetyFeedback('<span style="color:var(--text-muted);">Checking...</span>', false);

    try {
      const res = await apiRequest('POST', '/meme/safety-check', {
        headline, caption, issue_id: state.issueId,
      });
      state.safetyResult = res.data;

      if (res.data.passed) {
        setSafetyFeedback('<span style="color:var(--success);">? Caption looks good!</span>', true);
      } else {
        const violations = [
          ...(res.data.deterministic?.violations || []),
          ...(res.data.ai_safety?.violations || []),
        ];
        const aiUnavailable = res.data.ai_safety?.status === 'unavailable';
        const msg = violations.map((v) => `<li>${escapeHtml(v)}</li>`).join('');
        const notice = aiUnavailable
          ? '<li style="color:var(--warning);">?? AI safety check unavailable � moderator will review manually.</li>'
          : '';
        setSafetyFeedback(`<div class="alert alert-error" style="margin:0;padding:8px 12px;"><ul style="margin:0;padding-left:18px;">${msg}${notice}</ul></div>`, false);
      }
    } catch (err) {
      setSafetyFeedback('<span style="color:var(--warning);">?? Safety check temporarily unavailable.</span>', false);
    }
  }

  function setSafetyFeedback(html, enableNext) {
    const fb = document.getElementById('safety-feedback');
    if (fb) fb.innerHTML = html;
    const nextBtn = document.getElementById('step2-next');
    if (nextBtn) nextBtn.disabled = !enableNext;
  }

  function updateCharCounts() {
    const h = document.getElementById('meme-headline');
    const c = document.getElementById('meme-caption');
    const hc = document.getElementById('headline-chars');
    const cc = document.getElementById('caption-chars');
    if (h && hc) hc.textContent = `${h.value.length} / 60`;
    if (c && cc) cc.textContent = `${c.value.length} / 140`;
  }

  window._memeGoStep = (s) => {
    if (s === 1) renderStep1(body);
  };

  window._memeGoStep3 = () => {
    state.editedHeadline = document.getElementById('meme-headline')?.value || '';
    state.editedCaption = document.getElementById('meme-caption')?.value || '';
    renderStep3(body);
  };
}

// -- Step 3: Photo attestation ------------------------------------------------
function renderStep3(body) {
  state.step = 3;
  body.innerHTML = `
    <div class="ck-studio-wizard" style="max-width:600px;">
      ${renderStepIndicator(3)}
      <h2 class="mb-2">Photo Attestation</h2>
      <p class="text-secondary mb-4">
        Your meme will use the photo from the original issue report.
        Before proceeding, please confirm the following:
      </p>

      <div class="alert alert-info mb-4" style="font-size:0.875rem;line-height:1.6;">
        <strong>Your photo will be visible to the public.</strong>
        Please ensure it does not show:
        <ul style="margin:8px 0 0 18px;">
          <li>Identifiable faces of individuals</li>
          <li>Vehicle number plates</li>
          <li>Private property interiors</li>
          <li>Any person who has not given consent</li>
        </ul>
      </div>

      <label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;padding:16px;border:2px solid var(--border-color);border-radius:8px;">
        <input type="checkbox" id="attestation-checkbox" style="margin-top:2px;width:18px;height:18px;flex-shrink:0;"
          onchange="window._memeAttestCheck(this.checked)" />
        <span style="font-size:0.875rem;line-height:1.5;">
          <strong>I confirm that the issue photo does not show identifiable faces, vehicle number plates,
          or private property � or I have obtained consent from anyone shown.</strong>
        </span>
      </label>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(2)">? Back</button>
        <button class="btn btn-primary" id="step3-next" onclick="window._memeGoStep4()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `;

  window._memeAttestCheck = (checked) => {
    state.attestationAccepted = checked;
    const btn = document.getElementById('step3-next');
    if (btn) btn.disabled = !checked;
  };

  window._memeGoStep = (s) => {
    if (s === 2) renderStep2(body);
  };

  window._memeGoStep4 = () => {
    if (!state.attestationAccepted) {
      toastError('Please accept the attestation to continue.');
      return;
    }
    renderStep4(body);
  };
}

// -- Step 4: Live preview ----------------------------------------------------
function renderStep4(body) {
  state.step = 4;

  // Determine photo URL from issue files
  let photoUrl = null;
  // We would need to fetch files for the issue; for now use null (background gradient)

  const memeHtml = renderMemeCard({
    template_type: state.templateType,
    headline: state.editedHeadline,
    caption: state.editedCaption,
    locality: state.issue?.area || 'Your Locality',
    category: state.issue?.entityType?.name || 'Civic Issue',
    photoUrl,
    shareLink: `/entities/${state.issueId}`,
  });

  const safetyNote = state.safetyResult?.ai_safety?.status === 'unavailable'
    ? '<div class="alert alert-warning" style="font-size:0.8rem;margin-bottom:12px;max-width:420px;">?? AI safety check was unavailable. Your meme will be flagged for manual moderator review.</div>'
    : '';

  body.innerHTML = `
    <div class="ck-studio-wizard">
      ${renderStepIndicator(4)}
      <h2 class="mb-2">Preview Your Meme</h2>
      <p class="text-secondary mb-3">This is how your meme will appear in Civic Buzz after approval.</p>

      ${safetyNote}

      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;">
        <div>${memeHtml}</div>

        <div style="max-width:280px;">
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Template</div>
            <div style="font-weight:600;">${state.templateType?.replace(/_/g, ' ')}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Caption Source</div>
            <div>${state.captionSource === 'ai' ? '?? AI-generated' : state.captionSource === 'ai_edited' ? '?? AI-assisted + edited' : '?? Manual'}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Linked Issue</div>
            <a href="/entities/${state.issueId}" class="text-link">#${state.issueId} � ${escapeHtml(state.issue?.name || '')}</a>
          </div>
          <div class="alert alert-info" style="font-size:0.8rem;margin-top:12px;">
            This meme will be submitted to a moderator before being published. You can check its status in "My Memes".
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(3)">? Back</button>
        <button class="btn btn-primary" id="step4-submit" onclick="window._memeSubmit()">
          ?? Submit for Review
        </button>
      </div>
    </div>
  `;

  window._memeGoStep = (s) => {
    if (s === 3) renderStep3(body);
  };

  window._memeSubmit = async () => {
    if (state.submitting) return;
    state.submitting = true;
    const btn = document.getElementById('step4-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

    try {
      // Step 1: Create campaign
      const createRes = await apiRequest('POST', '/meme/campaigns', {
        issue_id: state.issueId,
        template_type: state.templateType,
        headline: state.editedHeadline,
        caption: state.editedCaption,
        caption_source: state.captionSource,
        original_ai_suggestion: state.originalAiSuggestion,
        attestation_accepted: true,
      });

      const campaignId = createRes.data.campaign.entity_id;

      // Step 2: Submit for moderation
      await apiRequest('POST', `/meme/campaigns/${campaignId}/submit`);

      renderStep5(body, campaignId);
    } catch (err) {
      state.submitting = false;
      if (btn) { btn.disabled = false; btn.textContent = '?? Submit for Review'; }
      toastError(err.message || 'Submission failed. Please try again.');
    }
  };
}

// -- Step 5: Submitted confirmation ------------------------------------------
function renderStep5(body, campaignId) {
  state.step = 5;
  body.innerHTML = `
    <div class="ck-studio-wizard" style="text-align:center;max-width:520px;margin:0 auto;">
      ${renderStepIndicator(5)}
      <div style="font-size:3rem;margin-bottom:16px;">??</div>
      <h2 class="mb-2">Submitted for Review!</h2>
      <p class="text-secondary mb-4">
        Your meme campaign has been submitted to a moderator for review.
        You will be able to download and share it once it is approved and published.
      </p>
      <div class="alert alert-info mb-4" style="font-size:0.875rem;text-align:left;">
        <strong>What happens next?</strong>
        <ul style="margin:8px 0 0 18px;line-height:1.7;">
          <li>An area coordinator or admin will review your meme</li>
          <li>If approved, it will appear in Civic Buzz</li>
          <li>If rejected, you will see the reason in "My Memes"</li>
          <li>The campaign links back to your original issue automatically</li>
        </ul>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="/buzz" class="btn btn-secondary">View Civic Buzz</a>
        <a href="/entities/${state.issueId}" class="btn btn-primary">Back to Issue ?</a>
      </div>
    </div>
  `;
}

// -- Shared UI helpers --------------------------------------------------------
function renderStepIndicator(currentStep) {
  const steps = [
    { n: 1, label: 'Template' },
    { n: 2, label: 'Caption' },
    { n: 3, label: 'Attestation' },
    { n: 4, label: 'Preview' },
    { n: 5, label: 'Done' },
  ];
  return `
    <div class="ck-studio-steps" style="display:flex;align-items:center;gap:0;margin-bottom:28px;flex-wrap:wrap;">
      ${steps.map((s, i) => `
        <div style="display:flex;align-items:center;">
          <div style="
            width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            font-size:0.75rem;font-weight:700;
            background:${s.n <= currentStep ? 'var(--accent-primary)' : 'var(--bg-tertiary)'};
            color:${s.n <= currentStep ? '#fff' : 'var(--text-muted)'};
          ">${s.n}</div>
          <div style="font-size:0.75rem;margin-left:6px;color:${s.n === currentStep ? 'var(--text-primary)' : 'var(--text-muted)'};">${s.label}</div>
          ${i < steps.length - 1 ? '<div style="width:24px;height:2px;background:var(--border-color);margin:0 8px;"></div>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}
