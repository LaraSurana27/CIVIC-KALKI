// ── UI Loader ────────────────────────────────────────────────────────────

export function showLoader(containerId, message = 'Loading...') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="loading-overlay">
      <div class="spinner spinner-lg"></div>
      <p>${message}</p>
    </div>
  `;
}
