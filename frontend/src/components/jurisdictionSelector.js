/**
 * CIVIC-KALKI — JurisdictionSelector
 *
 * Metadata-driven cascading jurisdiction selector.
 * Dynamically fetches children level by level from the API.
 *
 * Levels rendered: Country → State → City → Ward
 * (The DB supports arbitrary depth; more levels can be added by extending LEVELS.)
 *
 * Usage:
 *   const selector = new JurisdictionSelector(containerEl, {
 *     required: true,
 *     onChange: ({ jurisdiction_id, display_path }) => { ... },
 *   });
 *   await selector.init();
 *   selector.getValue();    // → { jurisdiction_id, display_path } | null
 *   selector.setValue(id);  // pre-select a known jurisdiction_id (optional)
 *   selector.destroy();
 *
 * The selector fires a custom DOM event 'jurisdiction:change' on the container
 * with detail { jurisdiction_id, display_path } whenever the selection changes.
 *
 * Single Selector Rule:
 *   Callers must NOT also render a legacy area <select>.
 *   This component is the ONE canonical jurisdiction selector for any form.
 */

import { jurisdictions as apiJurisdictions } from '../api.js';

const LEVELS = [
  { type: 'country', label: 'Country' },
  { type: 'state',   label: 'State / Province' },
  { type: 'city',    label: 'City / District' },
  { type: 'ward',    label: 'Ward / Local Area' },
];

export class JurisdictionSelector {
  /**
   * @param {HTMLElement} container  - The element to render into.
   * @param {object}      options
   * @param {boolean}     [options.required=false]
   * @param {function}    [options.onChange]   - Called with { jurisdiction_id, display_path }
   * @param {string}      [options.labelPrefix='jsel']  - Prefix for element IDs (avoid collisions)
   */
  constructor(container, options = {}) {
    this._container  = container;
    this._required   = options.required || false;
    this._onChange   = options.onChange || null;
    this._prefix     = options.labelPrefix || 'jsel';

    // State: selected node at each level index
    this._selected   = []; // [{ jurisdiction_id, name, type }, ...]
    this._selects    = []; // parallel array of <select> DOM elements
    this._hiddenInput = null;
    this._destroyed  = false;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /** Render the selector into the container and fetch root jurisdictions. */
  async init() {
    this._render();
    await this._loadLevel(0, null);
  }

  /**
   * Returns the current deepest selection, or null if nothing selected.
   * @returns {{ jurisdiction_id: number, display_path: string } | null}
   */
  getValue() {
    const last = this._selected[this._selected.length - 1];
    if (!last) return null;
    return {
      jurisdiction_id: last.jurisdiction_id,
      display_path: this._selected.map(n => n.name).join(' › '),
    };
  }

  /**
   * Pre-select a jurisdiction by its ID, walking back up the ancestor path.
   * @param {number} jurisdictionId
   */
  async setValue(jurisdictionId) {
    if (!jurisdictionId) return;
    try {
      const res = await apiJurisdictions.get(jurisdictionId);
      const { path } = res.data; // [root, ..., leaf]
      this._selected = [];
      for (let i = 0; i < path.length; i++) {
        await this._loadLevel(i, i === 0 ? null : path[i - 1].jurisdiction_id);
        const sel = this._selects[i];
        if (sel) sel.value = String(path[i].jurisdiction_id);
        this._selected[i] = path[i];
      }
      this._syncHidden();
      this._notifyChange();
      // Load children of leaf if still within our rendered depth
      const nextIdx = path.length;
      if (nextIdx < LEVELS.length) {
        const parentId = path[path.length - 1].jurisdiction_id;
        await this._loadLevel(nextIdx, parentId);
      }
    } catch (err) {
      console.warn('[JurisdictionSelector] setValue failed:', err);
    }
  }

  /** Clean up DOM */
  destroy() {
    this._destroyed = true;
    this._container.innerHTML = '';
    this._selects = [];
    this._hiddenInput = null;
    this._selected = [];
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  _render() {
    this._container.innerHTML = '';
    this._container.classList.add('jurisdiction-selector');

    const wrapper = document.createElement('div');
    wrapper.className = 'jurisdiction-selector-grid';
    wrapper.style.cssText = 'display:flex; flex-wrap:wrap; gap:12px;';

    LEVELS.forEach((level, idx) => {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.cssText = 'flex:1; min-width:160px; margin-bottom:0;';
      group.id = `${this._prefix}-group-${idx}`;

      const reqMark = (this._required && idx === 0) ? '<span class="required">*</span>' : '';
      const labelEl = document.createElement('label');
      labelEl.className = 'form-label';
      labelEl.setAttribute('for', `${this._prefix}-sel-${idx}`);
      labelEl.innerHTML = `${level.label} ${reqMark}`;

      const sel = document.createElement('select');
      sel.className = 'form-control';
      sel.id = `${this._prefix}-sel-${idx}`;
      sel.name = `_jurisdiction_level_${idx}`;
      sel.disabled = true;
      sel.innerHTML = `<option value="">-- ${level.label} --</option>`;

      sel.addEventListener('change', () => this._onLevelChange(idx, sel));

      group.appendChild(labelEl);
      group.appendChild(sel);
      wrapper.appendChild(group);

      this._selects[idx] = sel;
    });

    this._container.appendChild(wrapper);

    // Hidden input carries the canonical jurisdiction_id for FormData collection
    const hidden = document.createElement('input');
    hidden.type  = 'hidden';
    hidden.name  = '_jurisdiction_id';
    hidden.id    = `${this._prefix}-hidden`;
    hidden.value = '';
    this._container.appendChild(hidden);
    this._hiddenInput = hidden;
  }

  async _loadLevel(levelIdx, parentId) {
    if (this._destroyed) return;
    const sel = this._selects[levelIdx];
    if (!sel) return;

    sel.disabled = true;
    sel.innerHTML = `<option value="">Loading…</option>`;

    try {
      const params = (parentId == null) ? {} : { parent_id: String(parentId) };
      const res = await apiJurisdictions.list(params);
      const items = (res.data || []);

      if (this._destroyed) return;

      if (items.length === 0) {
        const levelMeta = LEVELS[levelIdx];
        sel.innerHTML = `<option value="">-- No ${levelMeta.label} available --</option>`;
        this._clearLevelsFrom(levelIdx + 1);
        return;
      }

      const levelMeta = LEVELS[levelIdx];
      sel.innerHTML = `<option value="">-- ${levelMeta.label} --</option>`;
      items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = String(item.jurisdiction_id);
        opt.textContent = item.name;
        sel.appendChild(opt);
      });
      sel.disabled = false;

    } catch (err) {
      console.warn('[JurisdictionSelector] Failed to load level', levelIdx, err);
      const levelMeta = LEVELS[levelIdx];
      sel.innerHTML = `<option value="">-- Error loading ${levelMeta.label} --</option>`;
    }
  }

  async _onLevelChange(levelIdx, sel) {
    const value = sel.value;

    // Clear all deeper selections
    this._clearLevelsFrom(levelIdx + 1);
    this._selected = this._selected.slice(0, levelIdx);

    if (!value) {
      this._syncHidden();
      this._notifyChange();
      return;
    }

    const jurisdictionId = Number(value);
    const selectedOption = sel.options[sel.selectedIndex];
    this._selected[levelIdx] = {
      jurisdiction_id: jurisdictionId,
      name: selectedOption ? selectedOption.textContent.trim() : String(jurisdictionId),
      type: LEVELS[levelIdx].type,
    };

    this._syncHidden();
    this._notifyChange();

    // Load next level if within our rendered depth
    const nextIdx = levelIdx + 1;
    if (nextIdx < LEVELS.length) {
      await this._loadLevel(nextIdx, jurisdictionId);
    }
  }

  _clearLevelsFrom(startIdx) {
    for (let i = startIdx; i < LEVELS.length; i++) {
      const sel = this._selects[i];
      if (sel) {
        sel.innerHTML = `<option value="">-- ${LEVELS[i].label} --</option>`;
        sel.disabled = true;
        sel.value = '';
      }
    }
    // Trim selected array
    this._selected = this._selected.slice(0, startIdx);
  }

  _syncHidden() {
    if (!this._hiddenInput) return;
    const val = this.getValue();
    this._hiddenInput.value = val ? String(val.jurisdiction_id) : '';
  }

  _notifyChange() {
    const val = this.getValue();
    if (this._onChange) this._onChange(val);
    this._container.dispatchEvent(new CustomEvent('jurisdiction:change', {
      bubbles: true,
      detail: val,
    }));
  }
}
