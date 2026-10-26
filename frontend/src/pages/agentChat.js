/**
 * CIVIC-KALKI — Conversational Agent Chat Page (v2 — with Photo/Doc Upload)
 *
 * Route: /agent/chat?sessionId=<uuid>&message=<first message>
 *
 * Features:
 *  - Alternating user/agent bubbles with rich Markdown formatting
 *  - Multimodal doc and photo upload directly via chat input bar
 *  - Real-time attachment preview thumbnail and chip before sending
 *  - Agent AI vision extraction from uploaded photos (road damage, garbage, notice text, etc.)
 *  - Automatic binding of files to form parameters (photo_evidence, supporting_document)
 *  - Distinct confirmation card showing both text fields and attached files
 *  - Explicit Yes/No confirmation before submission (never auto-submits)
 *  - Success card with link to created entity
 *
 * Reuses: renderLayout, existing CSS variables, existing button classes
 */

import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { agent as agentApi } from '../api.js';
import { navigate } from '../router.js';

// ── State (per-page-load, not persistent) ────────────────────────────────────
let sessionId = null;
let isWaiting = false;         // prevent double-sends while agent is thinking
let pendingConfirmData = null; // holds summary when agent is waiting for yes/no
let pendingFile = null;        // File object waiting to be sent with message

// ── Utilities ─────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

/** Convert **bold** and \n to HTML */
function renderMarkdownLite(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ── Message rendering ─────────────────────────────────────────────────────────

function renderUserBubble(text, attachment = null) {
  let attachmentHtml = '';
  if (attachment) {
    if (attachment.isImage && attachment.previewUrl) {
      attachmentHtml = `
        <div class="agent-user-attachment">
          <img src="${escapeHtml(attachment.previewUrl)}" alt="${escapeHtml(attachment.name)}" class="agent-attachment-thumb" />
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">📷 ${escapeHtml(attachment.name)}</span>
            <span class="agent-attachment-size">${escapeHtml(attachment.sizeStr)}</span>
          </div>
        </div>
      `;
    } else {
      attachmentHtml = `
        <div class="agent-user-attachment agent-attachment-doc">
          <span class="agent-attachment-icon">📄</span>
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">${escapeHtml(attachment.name)}</span>
            <span class="agent-attachment-size">${escapeHtml(attachment.sizeStr)}</span>
          </div>
        </div>
      `;
    }
  }

  const textHtml = text ? `<div class="agent-bubble-text">${escapeHtml(text)}</div>` : '';

  return `
    <div class="agent-msg-row agent-msg-user">
      <div class="agent-bubble agent-bubble-user">
        ${attachmentHtml}
        ${textHtml}
      </div>
    </div>
  `;
}

function renderAgentBubble(text) {
  return `
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent">${renderMarkdownLite(text)}</div>
    </div>
  `;
}

function renderConfirmCard(summaryRows, confirmText) {
  const rows = Array.isArray(summaryRows)
    ? summaryRows.map(r => `
        <div class="agent-confirm-row ${r.isFile ? 'agent-confirm-file-row' : ''}">
          <span class="agent-confirm-label">${escapeHtml(r.label)}</span>
          <span class="agent-confirm-value">${escapeHtml(r.value)}</span>
        </div>`).join('')
    : '';

  const intro = confirmText
    ? `<p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:12px;">${renderMarkdownLite(confirmText.split('\n\n')[0])}</p>`
    : '';

  return `
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="agent-confirm-card">
        <div class="agent-confirm-title">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);flex-shrink:0;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Submission Summary — Please Review
        </div>
        ${intro}
        <div class="agent-confirm-table">${rows}</div>
        <div class="agent-confirm-note" style="margin-top:10px; font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
          <span>📎</span> <span>Uploaded photo/document evidence will be attached directly to your official submission.</span>
        </div>
        <div class="agent-confirm-actions" id="agent-confirm-btns">
          <button id="agent-submit-btn" class="btn btn-primary" style="min-width:120px;">
            ✓ Submit
          </button>
          <button id="agent-cancel-btn" class="btn btn-secondary" style="min-width:100px;">
            ✗ Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSuccessCard(entityId, entityName, capability, files = []) {
  const filesListHtml = Array.isArray(files) && files.length > 0
    ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; gap:4px;">
         <span>📎</span> <span>Attached evidence: <strong>${files.map(escapeHtml).join(', ')}</strong></span>
       </div>`
    : '';

  return `
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" style="background:var(--green-600);" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="agent-success-card">
        <div style="font-weight:700; font-size:1rem; color:var(--green-700); margin-bottom:6px;">
          ✅ ${escapeHtml(capability)} Submitted!
        </div>
        <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:8px;">
          <strong>#${entityId}</strong> — ${escapeHtml(entityName)}
        </div>
        ${filesListHtml}
        <a href="/entities/${entityId}" class="btn btn-sm btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          View My Request
        </a>
        <button id="agent-new-request-btn" class="btn btn-sm btn-ghost" style="margin-left:8px;">
          + Start New Request
        </button>
      </div>
    </div>
  `;
}

function renderThinkingBubble() {
  return `
    <div class="agent-msg-row agent-msg-agent" id="agent-thinking">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent agent-thinking-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
}

// ── Thread management ─────────────────────────────────────────────────────────

function getThread() { return document.getElementById('agent-thread'); }
function getInput() { return document.getElementById('agent-input'); }
function getSendBtn() { return document.getElementById('agent-send-btn'); }
function getAttachBtn() { return document.getElementById('agent-attach-btn'); }
function getFileInput() { return document.getElementById('agent-file-input'); }

function appendHtml(html) {
  const thread = getThread();
  if (!thread) return;
  const temp = document.createElement('div');
  temp.innerHTML = html;
  while (temp.firstChild) thread.appendChild(temp.firstChild);
  thread.scrollTop = thread.scrollHeight;
}

function removeThinking() {
  const el = document.getElementById('agent-thinking');
  if (el) el.remove();
}

function setInputEnabled(enabled) {
  const input = getInput();
  const sendBtn = getSendBtn();
  const attachBtn = getAttachBtn();
  if (input) input.disabled = !enabled;
  if (sendBtn) {
    sendBtn.disabled = !enabled;
    sendBtn.style.opacity = enabled ? '1' : '0.5';
  }
  if (attachBtn) {
    attachBtn.disabled = !enabled;
    attachBtn.style.opacity = enabled ? '1' : '0.5';
  }
}

// ── Attachment Preview Bar ────────────────────────────────────────────────────

function updateAttachmentPreview() {
  const bar = document.getElementById('agent-file-preview-bar');
  if (!bar) return;

  if (!pendingFile) {
    bar.innerHTML = '';
    bar.style.display = 'none';
    return;
  }

  const isImage = pendingFile.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(pendingFile) : null;

  bar.style.display = 'flex';
  bar.innerHTML = `
    <div class="agent-preview-chip">
      ${isImage ? `<img src="${previewUrl}" class="agent-preview-thumb" alt="Preview" />` : '<span class="agent-preview-icon">📄</span>'}
      <div class="agent-preview-info">
        <span class="agent-preview-filename">${escapeHtml(pendingFile.name)}</span>
        <span class="agent-preview-filesize">${formatFileSize(pendingFile.size)}</span>
      </div>
      <button type="button" id="agent-remove-file-btn" class="agent-preview-remove" title="Remove attachment" aria-label="Remove attachment">&times;</button>
    </div>
  `;

  document.getElementById('agent-remove-file-btn')?.addEventListener('click', () => {
    pendingFile = null;
    const fileInput = getFileInput();
    if (fileInput) fileInput.value = '';
    updateAttachmentPreview();
  });
}

// ── Core: send a message turn ─────────────────────────────────────────────────

async function sendMessage(message, explicitFile = null) {
  const fileToUpload = explicitFile || pendingFile;
  const cleanMsg = (message || '').trim();

  // If nothing to send, return
  if (isWaiting || (!cleanMsg && !fileToUpload)) return;
  isWaiting = true;

  // Build attachment metadata for user bubble
  let attachmentMeta = null;
  if (fileToUpload) {
    const isImage = fileToUpload.type.startsWith('image/');
    attachmentMeta = {
      name: fileToUpload.name,
      sizeStr: formatFileSize(fileToUpload.size),
      isImage,
      previewUrl: isImage ? URL.createObjectURL(fileToUpload) : null,
    };
  }

  // Clear input and pending file immediately
  const input = getInput();
  if (input) {
    input.value = '';
    input.style.height = 'auto';
  }
  pendingFile = null;
  const fileInput = getFileInput();
  if (fileInput) fileInput.value = '';
  updateAttachmentPreview();

  // Render user bubble with text and attachment
  appendHtml(renderUserBubble(cleanMsg || (fileToUpload ? `Uploaded: ${fileToUpload.name}` : ''), attachmentMeta));
  setInputEnabled(false);

  // Show thinking animation
  appendHtml(renderThinkingBubble());

  try {
    const res = await agentApi.chat(sessionId, cleanMsg, fileToUpload);
    removeThinking();

    const data = res.data;
    pendingConfirmData = null;

    if (data.type === 'confirm') {
      pendingConfirmData = data;
      appendHtml(renderConfirmCard(data.summary || [], data.text));

      // Wire confirm/cancel buttons
      setTimeout(() => {
        const submitBtn = document.getElementById('agent-submit-btn');
        const cancelBtn = document.getElementById('agent-cancel-btn');

        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            document.getElementById('agent-confirm-btns')?.remove();
            sendMessage('yes');
          });
        }
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            document.getElementById('agent-confirm-btns')?.remove();
            sendMessage('cancel');
          });
        }
      }, 50);
    } else if (data.type === 'submitted') {
      appendHtml(renderSuccessCard(data.entity_id, data.entity_name, data.capability, data.files));
      setInputEnabled(false); // Finished

      setTimeout(() => {
        const newBtn = document.getElementById('agent-new-request-btn');
        if (newBtn) {
          newBtn.addEventListener('click', () => {
            navigate('/agent/chat');
          });
        }
      }, 50);
    } else {
      // question, status, guidance, unclear, cancelled, error
      appendHtml(renderAgentBubble(data.text || 'Something went wrong. Please try again.'));
    }
  } catch (err) {
    removeThinking();
    appendHtml(renderAgentBubble('Sorry, I encountered an error processing your request. Please try again or use the manual form.'));
    console.error('[Agent Chat] Error:', err);
  } finally {
    isWaiting = false;
    if (document.getElementById('agent-input')) {
      setInputEnabled(true);
      const inEl = getInput();
      if (inEl && !inEl.disabled) inEl.focus();
    }
  }
}

// ── Page render ───────────────────────────────────────────────────────────────

export async function renderAgentChat(params = {}, searchParams = null) {
  if (!requireAuth(navigate)) return;

  // Reset page state
  sessionId = null;
  isWaiting = false;
  pendingConfirmData = null;
  pendingFile = null;

  const urlParams = searchParams || new URLSearchParams(window.location.search);
  const incomingSessionId = urlParams.get('sessionId');
  const firstMessage = urlParams.get('message');

  // Reuse incoming sessionId or generate fresh
  sessionId = incomingSessionId || ('ck-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9));

  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <style>
      /* ── Agent chat layout ── */
      .agent-chat-wrap {
        display: flex; flex-direction: column; height: calc(100vh - 140px);
        max-width: 780px; margin: 0 auto;
      }
      .agent-chat-header {
        display:flex; align-items:center; gap:12px;
        padding:16px 20px; background:var(--surface);
        border:1px solid var(--border); border-radius:12px 12px 0 0;
        border-bottom:none;
      }
      .agent-chat-avatar-wrap {
        width:38px;height:38px;border-radius:50%;
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        display:flex;align-items:center;justify-content:center;flex-shrink:0;
      }
      #agent-thread {
        flex:1; overflow-y:auto; padding:20px;
        background:var(--surface); border:1px solid var(--border);
        display:flex; flex-direction:column; gap:12px;
      }
      /* Input bar & Attachment preview */
      .agent-input-container {
        display: flex; flex-direction: column;
        background:var(--surface); border:1px solid var(--border);
        border-radius:0 0 12px 12px; border-top: 1px solid var(--border-strong);
      }
      .agent-file-preview-bar {
        display: none; padding: 8px 16px 0 16px;
      }
      .agent-preview-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 10px; background: var(--bg); border: 1px solid var(--border-strong);
        border-radius: 8px; font-size: 0.8rem;
      }
      .agent-preview-thumb {
        width: 28px; height: 28px; object-fit: cover; border-radius: 4px;
      }
      .agent-preview-icon { font-size: 1.1rem; }
      .agent-preview-info { display: flex; flex-direction: column; line-height: 1.2; }
      .agent-preview-filename { font-weight: 600; color: var(--text-primary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .agent-preview-filesize { font-size: 0.7rem; color: var(--text-muted); }
      .agent-preview-remove {
        background: none; border: none; font-size: 1rem; color: var(--text-muted);
        cursor: pointer; padding: 0 4px; line-height: 1;
      }
      .agent-preview-remove:hover { color: var(--red-600, #dc2626); }

      .agent-input-bar {
        display:flex; gap:8px; align-items:center;
        padding:12px 16px;
      }
      .agent-attach-btn {
        background: none; border: none; color: var(--text-secondary);
        cursor: pointer; padding: 8px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .agent-attach-btn:hover {
        background: var(--bg); color: var(--primary);
      }
      #agent-input {
        flex:1; padding:10px 14px; border-radius:20px;
        border:1px solid var(--border-strong); background:var(--bg);
        color:var(--text-primary); font-size:0.9rem; font-family:inherit;
        resize:none; outline:none; min-height:40px; max-height:120px;
        transition: border-color 0.2s;
      }
      #agent-input:focus { border-color:var(--primary); }

      /* Message rows */
      .agent-msg-row { display:flex; gap:8px; max-width:88%; }
      .agent-msg-user { align-self:flex-end; flex-direction:row-reverse; max-width:75%; }
      .agent-msg-agent { align-self:flex-start; }
      .agent-bubble {
        padding:10px 16px; border-radius:18px; font-size:0.875rem;
        line-height:1.55; word-break:break-word;
      }
      .agent-bubble-user {
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        color:white; border-bottom-right-radius:4px;
      }
      .agent-bubble-agent {
        background:var(--surface-2,#f9f9fb); color:var(--text-primary);
        border:1px solid var(--border); border-bottom-left-radius:4px;
      }
      .agent-bubble-avatar {
        width:28px;height:28px;border-radius:50%;flex-shrink:0;margin-top:2px;
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        display:flex;align-items:center;justify-content:center;
      }

      /* Attachment in bubble */
      .agent-user-attachment {
        display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
        background: rgba(0,0,0,0.15); padding: 6px 10px; border-radius: 10px;
      }
      .agent-attachment-thumb {
        width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4);
      }
      .agent-attachment-icon { font-size: 1.5rem; }
      .agent-attachment-meta { display: flex; flex-direction: column; }
      .agent-attachment-name { font-weight: 600; font-size: 0.8rem; }
      .agent-attachment-size { font-size: 0.7rem; opacity: 0.85; }

      /* Thinking animation */
      .agent-thinking-dots { display:flex; gap:4px; padding:12px 16px; align-items:center; }
      .agent-thinking-dots span {
        width:7px;height:7px;background:var(--text-muted);border-radius:50%;
        animation:agent-dot-bounce 1.2s infinite ease-in-out;
      }
      .agent-thinking-dots span:nth-child(1){animation-delay:0s;}
      .agent-thinking-dots span:nth-child(2){animation-delay:0.2s;}
      .agent-thinking-dots span:nth-child(3){animation-delay:0.4s;}
      @keyframes agent-dot-bounce {
        0%,80%,100%{transform:scale(0.7);opacity:0.5;}
        40%{transform:scale(1);opacity:1;}
      }

      /* Confirm card */
      .agent-confirm-card {
        background:var(--surface); border:2px solid var(--primary);
        border-radius:12px; padding:18px 20px; max-width:480px;
      }
      .agent-confirm-title {
        font-weight:700; font-size:0.9rem; color:var(--text-primary);
        margin-bottom:12px; display:flex; align-items:center; gap:8px;
      }
      .agent-confirm-table { display:flex; flex-direction:column; gap:6px; }
      .agent-confirm-row {
        display:flex; gap:12px; font-size:0.83rem;
        padding:5px 0; border-bottom:1px solid var(--border);
      }
      .agent-confirm-file-row {
        background: rgba(255, 90, 54, 0.05); padding: 6px 8px; border-radius: 6px;
      }
      .agent-confirm-row:last-child { border-bottom:none; }
      .agent-confirm-label { font-weight:600; color:var(--text-secondary); min-width:130px; flex-shrink:0; }
      .agent-confirm-value { color:var(--text-primary); font-weight:500; }
      .agent-confirm-actions { display:flex; gap:10px; margin-top:16px; }

      /* Success card */
      .agent-success-card {
        background:var(--green-50,#f0fdf4); border:1px solid var(--green-200,#bbf7d0);
        border-radius:12px; padding:18px 20px; max-width:400px;
      }
    </style>

    <div class="agent-chat-wrap">
      <div class="agent-chat-header">
        <div class="agent-chat-avatar-wrap">
          <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div>
          <div style="font-weight:700; font-size:0.95rem;">CIVIC-KALKI Assistant</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">
            Report problems · Upload photo evidence · Start initiatives · Check request status
          </div>
        </div>
        <div style="margin-left:auto;">
          <a href="/dashboard" class="btn btn-ghost btn-sm">← Dashboard</a>
        </div>
      </div>

      <div id="agent-thread" role="log" aria-live="polite" aria-label="Conversation with Civic Assistant">
        <!-- Initial greeting -->
        ${renderAgentBubble('Hello! I\'m your CIVIC-KALKI assistant. I can help you:\n\n**1.** Report a civic problem (potholes, garbage, water supply, broken street lights…)\n     *Tip: You can attach photo/document evidence directly using the 📎 button! Our AI will analyze the photo and fill the details for you.*\n**2.** Start a civic initiative (community project, campaign…)\n**3.** Check the status of your existing requests\n\nWhat would you like to do today?')}
      </div>

      <div class="agent-input-container">
        <!-- Attachment preview chip -->
        <div id="agent-file-preview-bar" class="agent-file-preview-bar"></div>

        <div class="agent-input-bar">
          <button
            id="agent-attach-btn"
            type="button"
            class="agent-attach-btn"
            title="Attach photo or document evidence"
            aria-label="Attach photo or document evidence"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="file"
            id="agent-file-input"
            style="display:none;"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv"
          />

          <textarea
            id="agent-input"
            placeholder="Type your message or attach a photo…"
            rows="1"
            autocomplete="off"
            aria-label="Message to civic assistant"
          ></textarea>

          <button
            id="agent-send-btn"
            class="btn btn-primary"
            style="border-radius:20px; padding:10px 18px; white-space:nowrap;"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `, 'Civic Assistant');
  attachLayoutEvents();

  // ── Wire input events ──────────────────────────────────────────────────────
  const inputEl = document.getElementById('agent-input');
  const sendBtn = document.getElementById('agent-send-btn');
  const attachBtn = document.getElementById('agent-attach-btn');
  const fileInput = document.getElementById('agent-file-input');

  if (!inputEl || !sendBtn) return;

  // Attachment button click
  attachBtn?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    pendingFile = file;
    updateAttachmentPreview();
    inputEl.focus();
  });

  // Auto-grow textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  sendBtn.addEventListener('click', () => {
    sendMessage(inputEl.value);
  });

  // ── If launched from ChatBar — send first message immediately ──────────────
  if (firstMessage && firstMessage.trim()) {
    setTimeout(() => sendMessage(decodeURIComponent(firstMessage)), 120);
  } else {
    inputEl.focus();
  }

  // ── Clean up session on page unload ───────────────────────────────────────
  window.addEventListener('beforeunload', () => {
    if (sessionId) agentApi.clearSession(sessionId);
  }, { once: true });
}
