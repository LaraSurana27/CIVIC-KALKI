// ── Modal Component ────────────────────────────────────────────────────────

let currentModalClose = null;

export function showModal({ title, content, footer = '', onClose = () => {} }) {
  closeModal(); // Close any existing modal
  
  const container = document.getElementById('modal-container');
  
  const modalHTML = `
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${escapeHtml(title)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  `;
  
  container.innerHTML = modalHTML;
  container.style.pointerEvents = 'auto'; // Enable interactions
  
  const close = () => {
    container.innerHTML = '';
    container.style.pointerEvents = 'none';
    currentModalClose = null;
    onClose();
  };
  
  currentModalClose = close;
  
  document.getElementById('modal-close-btn').addEventListener('click', close);
  document.getElementById('modal-backdrop').addEventListener('click', close);
  
  // Close on Escape key
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

export function closeModal() {
  if (currentModalClose) {
    currentModalClose();
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
