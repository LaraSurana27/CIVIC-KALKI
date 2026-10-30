/**
 * CIVIC-KALKI � Meme Template Renderer (Section 2)
 * 3 fixed HTML/CSS templates: Relatable | Awareness | Call to Action
 * One renderer used for both preview and export (html-to-image).
 *
 * HARD RULES:
 * - Background is issue photo only (no stock memes / celebrity images)
 * - No status claims baked into the image
 * - Footer always shown: "Civic awareness content | Caption AI-assisted"
 * - Location shown at locality level only
 * - Reporter identity never shown
 */

// Safely escape HTML
function e(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const TEMPLATE_COLORS = {
  relatable: { primary: '#FF6B35', secondary: '#1A1A2E', accent: '#FFD700', text: '#FFFFFF' },
  awareness: { primary: '#2E86AB', secondary: '#1A1A2E', accent: '#A8DADC', text: '#FFFFFF' },
  cta: { primary: '#43AA8B', secondary: '#1A1A2E', accent: '#F8961E', text: '#FFFFFF' },
};

/**
 * Returns an HTML string for the meme preview card.
 * @param {object} opts
 *   - template_type: 'relatable'|'awareness'|'call_to_action'
 *   - headline: string (max 60 chars)
 *   - caption: string (max 140 chars)
 *   - locality: string (area name, e.g. "Kothrud")
 *   - category: string (issue category)
 *   - photoUrl: string|null (URL to the issue photo)
 *   - shareLink: string|null (link back to the issue)
 *   - exportMode: boolean (if true, renders for image export � inline styles only)
 */
export function renderMemeCard(opts) {
  const { template_type = 'awareness', headline, caption, locality, category, photoUrl, shareLink, exportMode = false } = opts;
  const colors = TEMPLATE_COLORS[template_type] || TEMPLATE_COLORS.awareness;

  const photoStyle = photoUrl
    ? `background-image:url('${photoUrl}'); background-size:cover; background-position:center;`
    : `background:linear-gradient(135deg, ${colors.secondary} 0%, #2d2d44 100%);`;

  const templateLabel = {
    relatable: '?? Relatable',
    awareness: '?? Awareness',
    cta: 'CTA',
  }[template_type] || '?? Awareness';

  const captionContent = {
    relatable: `
      <div style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:22px;font-weight:800;color:${colors.accent};letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;">${e(headline)}</div>
        <div style="font-size:15px;color:#fff;line-height:1.5;">${e(caption)}</div>
      </div>
    `,
    awareness: `
      <div style="background:rgba(46,134,171,0.85);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;border-left:4px solid ${colors.accent};">
        <div style="font-size:12px;color:${colors.accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">CIVIC ISSUE � ${e(category || 'Infrastructure')}</div>
        <div style="font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:8px;">${e(headline)}</div>
        <div style="font-size:14px;color:#ddd;line-height:1.5;">${e(caption)}</div>
      </div>
    `,
    cta: `
      <div style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:20px;font-weight:800;color:${colors.accent};line-height:1.2;margin-bottom:8px;">${e(headline)}</div>
        <div style="font-size:14px;color:#fff;line-height:1.5;margin-bottom:12px;">${e(caption)}</div>
        <div style="display:inline-block;background:${colors.primary};color:#fff;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;">Report &amp; Support ?</div>
      </div>
    `,
  }[template_type] || '';

  const containerClass = exportMode ? '' : 'ck-meme-card';

  return `
    <div class="${containerClass}" id="meme-preview-canvas" style="
      width:360px;
      min-height:400px;
      border-radius:${exportMode ? '0' : '16px'};
      overflow:hidden;
      position:relative;
      font-family:'Inter','Segoe UI',sans-serif;
      ${photoStyle}
      display:flex;
      flex-direction:column;
      justify-content:flex-end;
    ">
      <!-- Gradient overlay -->
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%);"></div>

      <!-- Template label badge -->
      <div style="position:absolute;top:12px;right:12px;background:${colors.primary};color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;z-index:2;">
        ${templateLabel}
      </div>

      <!-- Locality badge -->
      <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;z-index:2;">
        ?? ${e(locality || 'Your Locality')}
      </div>

      <!-- Content -->
      <div style="position:relative;z-index:2;padding:16px;">
        ${captionContent}

        <!-- Footer (mandatory � never remove) -->
        <div style="font-size:10px;color:rgba(255,255,255,0.55);text-align:center;padding-top:6px;border-top:1px solid rgba(255,255,255,0.15);margin-top:4px;">
          Civic awareness content | Caption AI-assisted
        </div>
      </div>
    </div>
  `;
}

/**
 * Export the meme as a PNG image.
 * Uses html-to-image (client-side, no backend Puppeteer).
 * Only available after Approved status.
 * @param {string} containerId - DOM element ID containing the meme card
 * @param {string} filename
 */
export async function exportMemeImage(containerId, filename = 'civic-meme.png') {
  const el = document.getElementById(containerId);
  if (!el) throw new Error('Meme canvas element not found.');

  try {
    // Dynamically import html-to-image (must be installed)
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(el, { quality: 0.95, pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('[MEME EXPORT] html-to-image failed:', err);
    throw new Error('Image export failed. Please try a screenshot instead.');
  }
}
