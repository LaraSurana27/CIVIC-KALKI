/**
 * CIVIC-KALKI — Agent Chat Bar Component
 *
 * A pill-shaped input that lives at the top of the Dashboard (citizen view).
 * On first send, it navigates to the dedicated /agent/chat page carrying the
 * session ID and the first message as query params — the chat page picks them up
 * and immediately sends the first turn.
 *
 * Design: matches the existing rounded-pill, primary-button visual language.
 * No voice/mic icon in V1.
 */

import { navigate } from '../router.js';

/**
 * Generate a simple UUID-like sessionId.
 * Not crypto-random — just needs to be unique per browser tab.
 */
function generateSessionId() {
  return 'ck-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

/**
 * Render the agent chat bar HTML string.
 * @param {string} idPrefix - Prefix for element IDs to avoid collision
 */
export function renderAgentChatBar(idPrefix = 'agent') {
  return `
    <div id="${idPrefix}-chatbar-wrap" style="
      margin-bottom: 24px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border-radius: 16px;
      padding: 20px 24px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      border: 1px solid rgba(255,255,255,0.08);
    ">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <div style="
          width:32px; height:32px; border-radius:50%;
          background:linear-gradient(135deg,#ff5a36,#e44);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        ">
          <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div>
          <div style="font-weight:700; font-size:0.9rem; color:#ffffff; letter-spacing:0.01em;">
            Civic Assistant
          </div>
          <div style="font-size:0.75rem; color:rgba(255,255,255,0.55);">
            Report issues · Start initiatives · Check request status
          </div>
        </div>
      </div>

      <div style="display:flex; gap:8px; align-items:center;">
        <input
          id="${idPrefix}-chatbar-input"
          type="text"
          autocomplete="off"
          placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."
          style="
            flex:1;
            padding: 12px 18px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.07);
            color: #ffffff;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s, background 0.2s;
            font-family: inherit;
          "
          aria-label="Civic assistant message input"
        />
        <button
          id="${idPrefix}-chatbar-send"
          style="
            padding: 12px 20px;
            border-radius: 999px;
            border: none;
            background: linear-gradient(135deg, #ff5a36, #e03c22);
            color: white;
            font-weight: 700;
            font-size: 0.875rem;
            cursor: pointer;
            white-space: nowrap;
            transition: opacity 0.2s, transform 0.1s;
            display: flex; align-items: center; gap: 6px;
          "
          aria-label="Send message to civic assistant"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
          Send
        </button>
      </div>

      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
        <span class="${idPrefix}-chat-suggestion" style="
          font-size:0.75rem; color:rgba(255,255,255,0.7);
          padding:5px 12px; border-radius:999px;
          border:1px solid rgba(255,255,255,0.15);
          cursor:pointer; transition:background 0.2s, border-color 0.2s;
          background:rgba(255,255,255,0.06);
          display:inline-flex; align-items:center; gap:6px;
        " data-text="garbage not collected near FC road">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          Garbage complaint
        </span>
        <span class="${idPrefix}-chat-suggestion" style="
          font-size:0.75rem; color:rgba(255,255,255,0.7);
          padding:5px 12px; border-radius:999px;
          border:1px solid rgba(255,255,255,0.15);
          cursor:pointer; transition:background 0.2s, border-color 0.2s;
          background:rgba(255,255,255,0.06);
          display:inline-flex; align-items:center; gap:6px;
        " data-text="I want to start a community cleanliness drive">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          Start an initiative
        </span>
        <span class="${idPrefix}-chat-suggestion" style="
          font-size:0.75rem; color:rgba(255,255,255,0.7);
          padding:5px 12px; border-radius:999px;
          border:1px solid rgba(255,255,255,0.15);
          cursor:pointer; transition:background 0.2s, border-color 0.2s;
          background:rgba(255,255,255,0.06);
          display:inline-flex; align-items:center; gap:6px;
        " data-text="what is happening with my requests">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
          Check my status
        </span>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners for the chat bar.
 * On send: navigate to /agent/chat with sessionId + first message.
 * @param {string} idPrefix
 */
export function attachAgentChatBarEvents(idPrefix = 'agent') {
  const input = document.getElementById(`${idPrefix}-chatbar-input`);
  const sendBtn = document.getElementById(`${idPrefix}-chatbar-send`);

  if (!input || !sendBtn) return;

  // Style the input focus state
  input.addEventListener('focus', () => {
    input.style.borderColor = 'rgba(255,90,54,0.7)';
    input.style.background = 'rgba(255,255,255,0.10)';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = 'rgba(255,255,255,0.15)';
    input.style.background = 'rgba(255,255,255,0.07)';
  });

  // Suggestion chips
  document.querySelectorAll(`.${idPrefix}-chat-suggestion`).forEach(chip => {
    chip.addEventListener('mouseenter', () => { chip.style.background = 'rgba(255,255,255,0.12)'; });
    chip.addEventListener('mouseleave', () => { chip.style.background = 'rgba(255,255,255,0.05)'; });
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (text) {
        input.value = text;
        input.focus();
      }
    });
  });

  function handleSend() {
    const message = input.value.trim();
    if (!message) {
      input.style.borderColor = 'rgba(255,90,54,0.9)';
      setTimeout(() => { input.style.borderColor = 'rgba(255,255,255,0.15)'; }, 1200);
      return;
    }

    const sessionId = generateSessionId();
    // Navigate to the chat page, passing the session and first message
    navigate(`/agent/chat?sessionId=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(message)}`);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Button hover
  sendBtn.addEventListener('mouseenter', () => { sendBtn.style.opacity = '0.88'; });
  sendBtn.addEventListener('mouseleave', () => { sendBtn.style.opacity = '1'; });
}
