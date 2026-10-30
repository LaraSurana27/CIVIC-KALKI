/**
 * CIVIC-KALKI — Civic Buzz Share Modal & Actions
 *
 * Requirements:
 * - Share options: "Download image", "Copy link", "Web Share"
 * - The link is /buzz/:id
 * - Log a share event via POST /buzz/:id/event whenever a share is initiated
 */

import { buzz } from '../api.js';
import { toastSuccess, toastError, toastWarning } from './toast.js';
import { BI } from './CivicBuzzIcons.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

/**
 * Open the Civic Buzz Share Dialog.
 * @param {Object} post - The Buzz post object (id, caption, image_url, etc.)
 */
export function openBuzzShareModal(post) {
  if (!post || !post.id) return;

  // Log share event as specified
  buzz.logEvent(post.id, 'share').catch(() => {});

  const existing = document.getElementById('ck-buzz-share-dialog-root');
  if (existing) existing.remove();

  const shareUrl = `${window.location.origin}/buzz/${post.id}`;
  const modalRoot = document.createElement('div');
  modalRoot.id = 'ck-buzz-share-dialog-root';
  modalRoot.className = 'ck-buzz-modal-backdrop';

  modalRoot.innerHTML = `
    <div class="ck-buzz-share-dialog" role="dialog" aria-modal="true">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-flex; align-items:center; color:#ff5a36;">${BI.share(20, '#ff5a36')}</span>
          <span style="font-weight:800; font-size:1rem; color:#0f172a;">Share Civic Buzz</span>
        </div>
        <button type="button" class="ck-buzz-close-btn" id="ck-share-close-btn" aria-label="Close">✕</button>
      </div>

      <div style="font-size:0.8rem; color:#64748b; margin-top:-4px;">
        Spread civic accountability to your community and social circles.
      </div>

      <!-- Action 1: Download Image -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-download-btn">
        <span style="display:inline-flex; align-items:center; color:#475569;">${BI.image(22, '#475569')}</span>
        <div style="text-align:left;">
          <div>Download Card Image</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">Save high-res PNG to your device</div>
        </div>
      </button>

      <!-- Action 2: Copy Link -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-copy-btn">
        <span style="display:inline-flex; align-items:center; color:#475569;">${BI.link(22, '#475569')}</span>
        <div style="text-align:left;">
          <div>Copy Link</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">${escapeHtml(shareUrl)}</div>
        </div>
      </button>

      <!-- Action 3: Web Share -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-web-btn">
        <span style="display:inline-flex; align-items:center; color:#475569;">${BI.shareDevice(22, '#475569')}</span>
        <div style="text-align:left;">
          <div>Web Share</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">Share to WhatsApp, X, or other apps</div>
        </div>
      </button>
    </div>
  `;

  document.body.appendChild(modalRoot);

  const closeModal = () => modalRoot.remove();
  modalRoot.addEventListener('click', (e) => {
    if (e.target === modalRoot) closeModal();
  });
  modalRoot.querySelector('#ck-share-close-btn')?.addEventListener('click', closeModal);

  // 1. Download image
  modalRoot.querySelector('#ck-share-download-btn')?.addEventListener('click', async () => {
    try {
      buzz.logEvent(post.id, 'share').catch(() => {});
      const imgUrl = post.image_url;
      if (!imgUrl) {
        toastWarning('Post does not have an attached rendered image.');
        return;
      }

      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `civic-buzz-post-${post.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      toastSuccess('Card image downloaded!');
      closeModal();
    } catch {
      // Fallback direct link download
      const a = document.createElement('a');
      a.href = post.image_url;
      a.target = '_blank';
      a.download = `civic-buzz-post-${post.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toastSuccess('Downloading card image...');
      closeModal();
    }
  });

  // 2. Copy Link
  modalRoot.querySelector('#ck-share-copy-btn')?.addEventListener('click', async () => {
    try {
      buzz.logEvent(post.id, 'share').catch(() => {});
      await navigator.clipboard.writeText(shareUrl);
      toastSuccess('Link copied to clipboard!');
      closeModal();
    } catch {
      // Fallback prompt
      window.prompt('Copy this Civic Buzz link:', shareUrl);
      closeModal();
    }
  });

  // 3. Web Share
  modalRoot.querySelector('#ck-share-web-btn')?.addEventListener('click', async () => {
    buzz.logEvent(post.id, 'share').catch(() => {});
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CIVIC BUZZ: ${post.linked_title || 'Civic Issue'}`,
          text: `"${post.caption}" — Check this civic conversation on CIVIC-KALKI:`,
          url: shareUrl,
        });
        toastSuccess('Shared successfully!');
        closeModal();
      } catch (err) {
        if (err.name !== 'AbortError') {
          // If share rejected or aborted
          copyFallback();
        }
      }
    } else {
      // Fallback: WhatsApp web link
      const text = encodeURIComponent(`CIVIC BUZZ: "${post.caption}"\n${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      closeModal();
    }

    function copyFallback() {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toastSuccess('Link copied to clipboard!');
      });
      closeModal();
    }
  });
}


