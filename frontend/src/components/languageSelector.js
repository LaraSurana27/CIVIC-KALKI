/**
 * CIVIC-KALKI — Dedicated Multilingual Translation Tool
 * Integrates directly with the backend translation API (/api/translate)
 * Translates 100% of the entire page into recognized & regional Indian languages
 * ZERO third-party Google toolbars, ZERO iframes, ZERO banner intrusions
 */

export const SUPPORTED_LANGUAGES = [
  // Primary Official & Widely Spoken Across India
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India / Official', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'North & Central India', popular: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra', popular: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & Puducherry', popular: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana', popular: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & Tripura', popular: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat', popular: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka', popular: true },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala & Lakshadweep', popular: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab', popular: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Pan-India', popular: true },

  // Official 8th Schedule & Regional Languages of India
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', region: 'Bihar & Uttar Pradesh' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', region: 'Jammu & Kashmir' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', region: 'Goa & Konkan' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'Bihar & Jharkhand' },
  { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', region: 'Manipur' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', region: 'Mizoram' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Sikkim & West Bengal' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'Classical Language' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', region: 'Sindhi' }
];

const LANG_STORAGE_KEY = 'civic_kalki_lang';

/**
 * Returns current language code, default 'en'
 */
export function getCurrentLanguage() {
  return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
}

/**
 * Finds language info object by code
 */
export function getLanguageByCode(code) {
  return SUPPORTED_LANGUAGES.find(l => l.code.toLowerCase() === (code || '').toLowerCase()) || {
    code: code || 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Official'
  };
}

/**
 * LocalStorage cache helpers
 */
function getCachedTranslations(langCode) {
  try {
    const raw = localStorage.getItem(`civic_trans_${langCode}`);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveCachedTranslations(langCode, newTranslations) {
  try {
    const existing = getCachedTranslations(langCode);
    const merged = { ...existing, ...newTranslations };
    localStorage.setItem(`civic_trans_${langCode}`, JSON.stringify(merged));
  } catch (_) {}
}

/**
 * Purges any lingering third-party Google cookies or elements
 */
export function purgeGoogleArtifacts() {
  const names = ['googtrans', 'googtrans_opt', '__googtrans'];
  names.forEach(name => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    if (window.location.hostname) {
      document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      document.cookie = `${name}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
  });

  document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame, #google_translate_element, #goog-gt-tt, .goog-te-balloon-frame').forEach(el => {
    try { el.remove(); } catch (_) {}
  });

  if (document.body) {
    document.body.style.top = '0px';
    document.body.style.position = 'static';
  }
}

/**
 * Extracts all eligible text nodes and attributes from the DOM
 */
function extractTranslatableElements(root) {
  const textItems = [];
  const placeholderItems = [];
  const titleItems = [];
  const uniqueStrings = new Set();

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'code', 'pre', 'textarea'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('.notranslate, .lang-dropdown-container, .lang-dropdown-menu')) {
          return NodeFilter.FILTER_REJECT;
        }
        const text = (node._civicOriginal !== undefined ? node._civicOriginal : node.nodeValue).trim();
        // Skip pure numbers or single symbols
        if (!text || /^[\d\s\-_.,/\\:;!@#$%^&*()=+~`|<>?"'’]+$/.test(text)) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip entity case reference codes like #PR-01148, PR-01148, #01148
        if (/^#?[A-Za-z]{1,5}-\d+$/.test(text) || /^#\d+$/.test(text)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node._civicOriginal === undefined) {
      node._civicOriginal = node.nodeValue;
    }
    const clean = node._civicOriginal.trim();
    if (clean) {
      textItems.push({ node, original: clean });
      uniqueStrings.add(clean);
    }
  }

  // Inputs / Textareas
  root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    if (el.closest('.notranslate, .lang-dropdown-container, .lang-dropdown-menu')) return;
    if (el._civicOriginalPlaceholder === undefined) {
      el._civicOriginalPlaceholder = el.placeholder;
    }
    const clean = (el._civicOriginalPlaceholder || '').trim();
    if (clean && !/^[\d\s]+$/.test(clean)) {
      placeholderItems.push({ element: el, original: clean });
      uniqueStrings.add(clean);
    }
  });

  // Tooltips / Titles
  root.querySelectorAll('[title]').forEach(el => {
    if (el.closest('.notranslate, .lang-dropdown-container, .lang-dropdown-menu')) return;
    if (el._civicOriginalTitle === undefined) {
      el._civicOriginalTitle = el.title;
    }
    const clean = (el._civicOriginalTitle || '').trim();
    if (clean && !/^[\d\s]+$/.test(clean)) {
      titleItems.push({ element: el, original: clean });
      uniqueStrings.add(clean);
    }
  });

  return { textItems, placeholderItems, titleItems, uniqueStrings: Array.from(uniqueStrings) };
}

/**
 * Restores 100% original English text across the entire DOM
 */
export function restoreOriginalText(root = document.getElementById('app')) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node._civicOriginal !== undefined) {
      node.nodeValue = node._civicOriginal;
    }
  }

  root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    if (el._civicOriginalPlaceholder !== undefined) {
      el.placeholder = el._civicOriginalPlaceholder;
    }
  });

  root.querySelectorAll('[title]').forEach(el => {
    if (el._civicOriginalTitle !== undefined) {
      el.title = el._civicOriginalTitle;
    }
  });
}

let isTranslating = false;
let hasPendingRequest = false;
let isApplyingTranslations = false;

/**
 * Translates 100% of the page via the backend translation engine
 */
export async function translatePage(langCode) {
  const target = langCode || getCurrentLanguage();
  const root = document.getElementById('app') || document.body;
  if (!root) return;

  // English: instant 0ms restoration
  if (target === 'en') {
    restoreOriginalText(root);
    return;
  }

  const { textItems, placeholderItems, titleItems, uniqueStrings } = extractTranslatableElements(root);
  if (uniqueStrings.length === 0) return;

  // 1. Apply any already cached translations instantly (0ms)
  const cache = getCachedTranslations(target);
  const uncached = [];

  const applyFromCache = () => {
    isApplyingTranslations = true;
    try {
      textItems.forEach(({ node, original }) => {
        if (cache[original]) {
          if (node._civicOriginal && node._civicOriginal.trim() === original) {
            const leading = node._civicOriginal.match(/^\s*/)[0];
            const trailing = node._civicOriginal.match(/\s*$/)[0];
            node.nodeValue = leading + cache[original] + trailing;
          } else if (node._civicOriginal) {
            node.nodeValue = node._civicOriginal.replace(original, cache[original]);
          }
        }
      });

      placeholderItems.forEach(({ element, original }) => {
        if (cache[original]) {
          element.placeholder = cache[original];
        }
      });

      titleItems.forEach(({ element, original }) => {
        if (cache[original]) {
          element.title = cache[original];
        }
      });
    } finally {
      setTimeout(() => {
        isApplyingTranslations = false;
      }, 40);
    }
  };

  applyFromCache();

  // Find strings not yet cached
  uniqueStrings.forEach(s => {
    if (!cache[s]) uncached.push(s);
  });

  if (uncached.length === 0) return; // All translated!

  if (isTranslating) {
    hasPendingRequest = true;
    return;
  }
  isTranslating = true;

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncached, targetLang: target })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.translations) {
        saveCachedTranslations(target, data.translations);
        Object.assign(cache, data.translations);
        applyFromCache();
      }
    }
  } catch (err) {
    console.error('[Translation Service Error]:', err);
  } finally {
    isTranslating = false;
    if (hasPendingRequest) {
      hasPendingRequest = false;
      setTimeout(() => {
        translatePage(target);
      }, 50);
    }
  }
}

/**
 * Programmatically apply language
 */
export function setLanguage(code) {
  const targetCode = (code || 'en').trim();
  localStorage.setItem(LANG_STORAGE_KEY, targetCode);

  purgeGoogleArtifacts();
  updateAllTriggerButtons(targetCode);
  translatePage(targetCode);
}

/**
 * Renders the India-Specific Language Selector component HTML
 */
export function renderLanguageSelector(options = {}) {
  const idPrefix = options.idPrefix || 'topbar';
  const currentCode = getCurrentLanguage();
  const currentLang = getLanguageByCode(currentCode);
  const popularLangs = SUPPORTED_LANGUAGES.filter(l => l.popular);

  return `
    <div class="lang-dropdown-container notranslate" id="${idPrefix}-lang-container">
      <button 
        type="button" 
        class="lang-trigger-btn" 
        id="${idPrefix}-lang-btn" 
        aria-haspopup="true" 
        aria-expanded="false" 
        title="Choose language (Indian Regional & Official Languages)"
      >
        <span class="lang-globe-icon" aria-hidden="true">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="1.8"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </span>
        <span class="lang-btn-label truncate" id="${idPrefix}-lang-label">
          ${escapeHtml(currentLang.nativeName || currentLang.name)}
        </span>
        <span class="lang-badge">${escapeHtml(currentCode.toUpperCase().slice(0, 5))}</span>
        <svg class="lang-chevron" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Card -->
      <div class="lang-dropdown-menu" id="${idPrefix}-lang-dropdown">
        <div class="lang-dropdown-header">
          <div class="lang-header-title">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>Choose Language (भारतीय भाषाएं)</span>
          </div>
          <span class="lang-count-badge">🇮🇳 Indian Languages</span>
        </div>

        <!-- Search Bar with region search -->
        <div class="lang-search-box">
          <svg class="lang-search-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            class="lang-search-input" 
            id="${idPrefix}-lang-search" 
            placeholder="Search language or state (e.g. Hindi, Marathi, Tamil)..." 
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="lang-search-clear hidden" id="${idPrefix}-lang-clear" aria-label="Clear search">✕</button>
        </div>

        <!-- Quick Select Chips for Major Indian Languages -->
        <div class="lang-quick-section" id="${idPrefix}-lang-popular-section">
          <div class="lang-section-label">Most Common</div>
          <div class="lang-chips-grid">
            ${popularLangs.map(l => `
              <button 
                type="button" 
                class="lang-chip ${l.code === currentCode ? 'active' : ''}" 
                data-lang="${l.code}"
                title="${escapeHtml(l.name)} (${escapeHtml(l.region)})"
              >
                ${escapeHtml(l.nativeName)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="lang-section-label" style="padding: 6px 14px 2px;">Official & Regional Languages</div>

        <!-- Full Scrollable List -->
        <div class="lang-options-scroll" id="${idPrefix}-lang-list">
          ${SUPPORTED_LANGUAGES.map(l => {
            const isSelected = l.code === currentCode;
            return `
              <div 
                class="lang-option-row ${isSelected ? 'selected' : ''}" 
                data-lang="${l.code}" 
                data-name="${escapeHtml(l.name.toLowerCase())}" 
                data-native="${escapeHtml(l.nativeName.toLowerCase())}"
                data-region="${escapeHtml((l.region || '').toLowerCase())}"
                role="button"
                tabindex="0"
              >
                <div class="lang-names-wrap">
                  <span class="lang-native-name">${escapeHtml(l.nativeName)}</span>
                  <span class="lang-english-name">${escapeHtml(l.name)} • <span style="opacity:0.75;">${escapeHtml(l.region)}</span></span>
                </div>
                <div class="lang-code-pill">${escapeHtml(l.code)}</div>
                ${isSelected ? `
                  <svg class="lang-check-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer / Reset -->
        <div class="lang-dropdown-footer">
          <button type="button" class="lang-reset-btn" id="${idPrefix}-lang-reset">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to English (Default)
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attaches interactive dropdown, search filter, selection, and outside click listeners
 */
export function attachLanguageSelectorEvents(idPrefix = 'topbar') {
  const container = document.getElementById(`${idPrefix}-lang-container`);
  const triggerBtn = document.getElementById(`${idPrefix}-lang-btn`);
  const dropdownMenu = document.getElementById(`${idPrefix}-lang-dropdown`);
  const searchInput = document.getElementById(`${idPrefix}-lang-search`);
  const clearBtn = document.getElementById(`${idPrefix}-lang-clear`);
  const listContainer = document.getElementById(`${idPrefix}-lang-list`);
  const resetBtn = document.getElementById(`${idPrefix}-lang-reset`);
  const popularSection = document.getElementById(`${idPrefix}-lang-popular-section`);

  if (!container || !triggerBtn || !dropdownMenu) return;

  // Toggle Dropdown
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.classList.contains('show');
    document.querySelectorAll('.lang-dropdown-menu.show').forEach(m => {
      if (m !== dropdownMenu) m.classList.remove('show');
    });

    dropdownMenu.classList.toggle('show', !isOpen);
    triggerBtn.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen && searchInput) {
      setTimeout(() => searchInput.focus(), 50);
    }
  });

  // Handle Language selection
  dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();

    const optionEl = e.target.closest('[data-lang]');
    if (optionEl) {
      const langCode = optionEl.getAttribute('data-lang');
      if (langCode) {
        dropdownMenu.classList.remove('show');
        triggerBtn.setAttribute('aria-expanded', 'false');
        setLanguage(langCode);
      }
    }
  });

  // Handle Search Filtering
  if (searchInput && listContainer) {
    const rows = Array.from(listContainer.querySelectorAll('.lang-option-row'));

    const handleSearch = () => {
      const q = (searchInput.value || '').trim().toLowerCase();
      clearBtn?.classList.toggle('hidden', q.length === 0);

      if (popularSection) {
        popularSection.style.display = q.length > 0 ? 'none' : 'block';
      }

      let visibleCount = 0;
      rows.forEach(row => {
        const name = row.getAttribute('data-name') || '';
        const native = row.getAttribute('data-native') || '';
        const region = row.getAttribute('data-region') || '';
        const code = (row.getAttribute('data-lang') || '').toLowerCase();

        const match = !q || name.includes(q) || native.includes(q) || region.includes(q) || code.includes(q);
        row.style.display = match ? 'flex' : 'none';
        if (match) visibleCount++;
      });

      let noMatchEl = listContainer.querySelector('.lang-no-match');
      if (visibleCount === 0) {
        if (!noMatchEl) {
          noMatchEl = document.createElement('div');
          noMatchEl.className = 'lang-no-match';
          noMatchEl.textContent = 'No Indian language found matching your search';
          listContainer.appendChild(noMatchEl);
        }
        noMatchEl.style.display = 'block';
      } else if (noMatchEl) {
        noMatchEl.style.display = 'none';
      }
    };

    searchInput.addEventListener('input', handleSearch);

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.value = '';
        handleSearch();
        searchInput.focus();
      });
    }
  }

  // Handle Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.remove('show');
      triggerBtn.setAttribute('aria-expanded', 'false');
      setLanguage('en');
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdownMenu.classList.remove('show');
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownMenu.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
      triggerBtn.setAttribute('aria-expanded', 'false');
      triggerBtn.focus();
    }
  });
}

/**
 * Updates UI labels on all language buttons across the page
 */
export function updateAllTriggerButtons(code) {
  const lang = getLanguageByCode(code);
  document.querySelectorAll('.lang-btn-label').forEach(el => {
    el.textContent = lang.nativeName || lang.name;
  });
  document.querySelectorAll('.lang-badge').forEach(el => {
    el.textContent = (code || 'EN').toUpperCase().slice(0, 5);
  });

  document.querySelectorAll('.lang-chip').forEach(chip => {
    const isAct = chip.getAttribute('data-lang') === code;
    chip.classList.toggle('active', isAct);
  });

  document.querySelectorAll('.lang-option-row').forEach(row => {
    const isSel = row.getAttribute('data-lang') === code;
    row.classList.toggle('selected', isSel);

    let check = row.querySelector('.lang-check-icon');
    if (isSel && !check) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'lang-check-icon');
      svg.setAttribute('width', '16');
      svg.setAttribute('height', '16');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>';
      row.appendChild(svg);
    } else if (!isSel && check) {
      check.remove();
    }
  });
}

let dynamicObserver = null;
let observerDebounceTimer = null;

/**
 * Sets up a dynamic DOM MutationObserver to instantly catch and translate
 * any dynamically injected tables, case rows, cards, or components
 */
export function setupDynamicObserver() {
  if (dynamicObserver) return;
  const targetNode = document.getElementById('app') || document.body;
  if (!targetNode) return;

  dynamicObserver = new MutationObserver((mutations) => {
    // If translation engine is currently modifying DOM nodes, ignore self-induced events
    if (isApplyingTranslations) return;

    const currentLang = getCurrentLanguage();
    if (!currentLang || currentLang === 'en') return;

    let hasNewContent = false;
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        for (const n of m.addedNodes) {
          if (n.nodeType === Node.ELEMENT_NODE) {
            // Ignore language selector dropdown menu changes
            if (n.closest && n.closest('.notranslate, .lang-dropdown-menu, .lang-dropdown-container')) continue;
            hasNewContent = true;
            break;
          }
        }
      }
      if (hasNewContent) break;
    }

    if (hasNewContent) {
      if (observerDebounceTimer) clearTimeout(observerDebounceTimer);
      observerDebounceTimer = setTimeout(() => {
        translatePage(currentLang);
      }, 70);
    }
  });

  dynamicObserver.observe(targetNode, {
    childList: true,
    subtree: true
  });
}

/**
 * Global initialization called once during app startup
 */
export function initLanguageSupport() {
  purgeGoogleArtifacts();

  // Expose global translation trigger for async data loaders
  window.civicTranslatePage = (code) => translatePage(code || getCurrentLanguage());

  // Setup DOM observer for dynamic content (case tables, async cards, modals)
  setupDynamicObserver();

  const activeLang = getCurrentLanguage();
  if (activeLang && activeLang !== 'en') {
    setTimeout(() => {
      translatePage(activeLang);
    }, 100);
  }

  // Re-translate whenever SPA router mounts a new page or finishes async render
  window.addEventListener('civic:route-rendered', () => {
    const currentLang = getCurrentLanguage();
    if (currentLang && currentLang !== 'en') {
      setTimeout(() => {
        translatePage(currentLang);
      }, 60);
    }
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
