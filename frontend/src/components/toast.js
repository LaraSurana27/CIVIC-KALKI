// ── Toast Notification System ────────────────────────────────────────────
let toastId = 0;

export function showToast(message, type = 'default', duration = 3500) {
  const container = document.getElementById('toast-container');
  const id = ++toastId;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = `toast-${id}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, duration);
  return id;
}

export function toast(message)         { return showToast(message, 'default'); }
export function toastSuccess(message)  { return showToast(message, 'success'); }
export function toastError(message)    { return showToast(message, 'error'); }
export function toastWarning(message)  { return showToast(message, 'warning'); }

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
