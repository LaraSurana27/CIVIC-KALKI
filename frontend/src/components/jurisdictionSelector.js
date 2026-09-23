/**
 * CIVIC-KALKI — JurisdictionSelector
 *
 * Professional, metadata-driven cascading jurisdiction selector with
 * interactive Searchable Combobox for all levels:
 * Country → State / Province → City / District → Ward / Local Area
 *
 * Supports global countries (250+ countries) with on-demand dynamic GIS
 * and instant search filtering directly at each dropdown field.
 *
 * Features:
 * - Real-time search filter with keyboard navigation (Up, Down, Enter, Esc)
 * - Quick-select / Pinned India for 1-click access
 * - Quick-clear button (✕) per level
 * - Dynamic child level loading & auto-cascade
 * - Canonical hidden _jurisdiction_id input for seamless form submission
 * - Custom DOM event 'jurisdiction:change'
 */

import { jurisdictions as apiJurisdictions } from '../api.js';

const LEVELS = [
  { type: 'country', label: 'Country' },
  { type: 'state',   label: 'State / Province' },
  { type: 'city',    label: 'City / District' },
  { type: 'ward',    label: 'Ward / Local Area' },
];

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escapeHtml(text).replace(regex, '<strong style="color:var(--primary,#ff5a36);">$1</strong>');
}

export class JurisdictionSelector {
  /**
   * @param {HTMLElement} container  - The element to render into.
   * @param {object}      options
   * @param {boolean}     [options.required=false]
   * @param {function}    [options.onChange]   - Called with { jurisdiction_id, display_path }
   * @param {string}      [options.labelPrefix='jsel']  - Prefix for element IDs
   */
  constructor(container, options = {}) {
    this._container   = container;
    this._required    = options.required || false;
    this._onChange    = options.onChange || null;
    this._prefix      = options.labelPrefix || 'jsel';

    // State per level:
    // { meta, items: [], selectedItem: null, isOpen: false, focusedIdx: -1, filteredItems: [], ... }
    this._levelStates = [];
    this._hiddenInput = null;
    this._destroyed   = false;

    // Document click handler to close dropdowns when clicking outside
    this._onDocumentClick = this._handleDocumentClick.bind(this);
    document.addEventListener('click', this._onDocumentClick);
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
    const activeSelected = this._levelStates
      .map(lvl => lvl.selectedItem)
      .filter(Boolean);

    if (activeSelected.length === 0) return null;
    const last = activeSelected[activeSelected.length - 1];
    return {
      jurisdiction_id: last.jurisdiction_id,
      display_path: activeSelected.map(n => n.name).join(' › '),
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
      if (!Array.isArray(path) || path.length === 0) return;

      for (let i = 0; i < path.length; i++) {
        const parentId = i === 0 ? null : path[i - 1].jurisdiction_id;
        await this._loadLevel(i, parentId);
        const node = path[i];
        const match = this._levelStates[i].items.find(item => item.jurisdiction_id === node.jurisdiction_id) || node;
        this._setSelection(i, match, false);
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

  /** Clean up DOM and listeners */
  destroy() {
    this._destroyed = true;
    document.removeEventListener('click', this._onDocumentClick);
    this._container.innerHTML = '';
    this._levelStates = [];
    this._hiddenInput = null;
  }

  // ─── Internal Rendering & Event Handling ────────────────────────────────────

  _render() {
    this._container.innerHTML = '';
    this._container.classList.add('jurisdiction-selector');

    const grid = document.createElement('div');
    grid.className = 'jurisdiction-selector-grid';

    LEVELS.forEach((level, idx) => {
      const group = document.createElement('div');
      group.className = 'form-group jsel-group';
      group.id = `${this._prefix}-group-${idx}`;

      const reqMark = (this._required && idx === 0) ? '<span class="required">*</span>' : '';
      const labelEl = document.createElement('label');
      labelEl.className = 'form-label';
      labelEl.innerHTML = `${escapeHtml(level.label)} ${reqMark}`;

      // Combobox wrapper
      const combobox = document.createElement('div');
      combobox.className = 'jsel-combobox';
      combobox.id = `${this._prefix}-combobox-${idx}`;

      // Trigger button
      const trigger = document.createElement('div');
      trigger.className = 'jsel-trigger is-disabled';
      trigger.setAttribute('tabindex', idx === 0 ? '0' : '-1');
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', level.label);

      const triggerText = document.createElement('span');
      triggerText.className = 'jsel-trigger-text is-placeholder';
      triggerText.textContent = idx === 0 ? `-- Search or Select ${level.label} --` : `-- Select ${LEVELS[idx - 1].label} first --`;

      const triggerActions = document.createElement('div');
      triggerActions.className = 'jsel-trigger-actions';

      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'jsel-clear-btn';
      clearBtn.title = 'Clear selection';
      clearBtn.style.display = 'none';
      clearBtn.innerHTML = '&#x2715;';

      const chevron = document.createElement('span');
      chevron.className = 'jsel-chevron';
      chevron.innerHTML = `<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;

      triggerActions.appendChild(clearBtn);
      triggerActions.appendChild(chevron);
      trigger.appendChild(triggerText);
      trigger.appendChild(triggerActions);

      // Dropdown panel
      const dropdown = document.createElement('div');
      dropdown.className = 'jsel-dropdown';

      // Search bar inside dropdown
      const searchWrapper = document.createElement('div');
      searchWrapper.className = 'jsel-search-wrapper';
      searchWrapper.innerHTML = `
        <svg class="jsel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'jsel-search-input';
      searchInput.placeholder = `Search ${level.label}...`;
      searchInput.setAttribute('autocomplete', 'off');
      searchWrapper.appendChild(searchInput);

      // Options list
      const optionsList = document.createElement('ul');
      optionsList.className = 'jsel-options-list';
      optionsList.setAttribute('role', 'listbox');

      dropdown.appendChild(searchWrapper);
      dropdown.appendChild(optionsList);

      combobox.appendChild(trigger);
      combobox.appendChild(dropdown);
      group.appendChild(labelEl);
      group.appendChild(combobox);
      grid.appendChild(group);

      // Store level state
      this._levelStates[idx] = {
        meta: level,
        groupEl: group,
        comboboxEl: combobox,
        triggerEl: trigger,
        triggerTextEl: triggerText,
        clearBtnEl: clearBtn,
        dropdownEl: dropdown,
        searchInputEl: searchInput,
        optionsListEl: optionsList,
        items: [],
        filteredItems: [],
        selectedItem: null,
        focusedIdx: -1,
        isOpen: false,
        disabled: idx !== 0,
      };

      // Events for this level
      trigger.addEventListener('click', (e) => {
        if (e.target.closest('.jsel-clear-btn')) return;
        this._toggleDropdown(idx);
      });

      trigger.addEventListener('keydown', (e) => {
        if (this._levelStates[idx].disabled) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          this._openDropdown(idx);
        }
      });

      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._clearSelection(idx);
      });

      searchInput.addEventListener('input', (e) => {
        this._filterOptions(idx, e.target.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        this._handleSearchKeydown(idx, e);
      });
    });

    this._container.appendChild(grid);

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
    const state = this._levelStates[levelIdx];
    if (!state) return;

    state.disabled = true;
    state.triggerEl.classList.add('is-disabled');
    state.triggerEl.setAttribute('tabindex', '-1');
    state.triggerTextEl.className = 'jsel-trigger-text is-placeholder';
    state.triggerTextEl.textContent = `Loading ${state.meta.label}…`;
    state.optionsListEl.innerHTML = `<li class="jsel-loading"><div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Loading ${state.meta.label}...</li>`;

    try {
      const params = (parentId == null) ? {} : { parent_id: String(parentId) };
      const res = await apiJurisdictions.list(params);
      const items = res.data || [];

      if (this._destroyed) return;

      state.items = items;
      state.filteredItems = items;

      if (items.length === 0) {
        state.disabled = true;
        state.triggerEl.classList.add('is-disabled');
        state.triggerEl.setAttribute('tabindex', '-1');
        state.triggerTextEl.textContent = `-- No ${state.meta.label} available --`;
        this._clearLevelsFrom(levelIdx + 1);
        return;
      }

      state.disabled = false;
      state.triggerEl.classList.remove('is-disabled');
      state.triggerEl.setAttribute('tabindex', '0');
      state.triggerTextEl.textContent = `-- Search or Select ${state.meta.label} --`;

      this._renderOptionsList(levelIdx, '');
    } catch (err) {
      console.warn('[JurisdictionSelector] Failed to load level', levelIdx, err);
      state.disabled = true;
      state.triggerEl.classList.add('is-disabled');
      state.triggerTextEl.textContent = `-- Error loading ${state.meta.label} --`;
    }
  }

  _renderOptionsList(levelIdx, query) {
    const state = this._levelStates[levelIdx];
    const listEl = state.optionsListEl;
    listEl.innerHTML = '';
    state.focusedIdx = -1;

    const trimmed = (query || '').trim().toLowerCase();

    // Filter items
    let filtered = state.items;
    if (trimmed) {
      filtered = state.items.filter(item =>
        (item.name && item.name.toLowerCase().includes(trimmed)) ||
        (item.code && item.code.toLowerCase().includes(trimmed))
      );
    }
    state.filteredItems = filtered;

    if (filtered.length === 0) {
      listEl.innerHTML = `<li class="jsel-empty">No ${escapeHtml(state.meta.label)} found matching "${escapeHtml(query)}"</li>`;
      return;
    }

    // Special layout for Country when query is empty: Pinned India at the top
    if (levelIdx === 0 && !trimmed) {
      const india = state.items.find(i => i.name === 'India');
      if (india) {
        const pinnedHeader = document.createElement('li');
        pinnedHeader.className = 'jsel-divider';
        pinnedHeader.textContent = '★ Pinned / Quick Select';
        listEl.appendChild(pinnedHeader);

        const indiaEl = this._createOptionElement(levelIdx, india, trimmed, 0);
        listEl.appendChild(indiaEl);

        const allHeader = document.createElement('li');
        allHeader.className = 'jsel-divider';
        allHeader.textContent = `All Countries (${state.items.length})`;
        listEl.appendChild(allHeader);
      }
    }

    // Max 150 items to keep DOM instant
    const displayList = filtered.slice(0, 150);
    displayList.forEach((item, fIdx) => {
      const optEl = this._createOptionElement(levelIdx, item, trimmed, fIdx);
      listEl.appendChild(optEl);
    });

    if (filtered.length > 150) {
      const moreNote = document.createElement('li');
      moreNote.className = 'jsel-empty';
      moreNote.style.fontSize = '0.78rem';
      moreNote.style.padding = '8px';
      moreNote.textContent = `Showing top 150 of ${filtered.length} matches — type to narrow down`;
      listEl.appendChild(moreNote);
    }
  }

  _createOptionElement(levelIdx, item, query, fIdx) {
    const state = this._levelStates[levelIdx];
    const isSelected = state.selectedItem && state.selectedItem.jurisdiction_id === item.jurisdiction_id;

    const li = document.createElement('li');
    li.className = `jsel-option ${isSelected ? 'is-selected' : ''}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    li.dataset.index = String(fIdx);

    const nameSpan = document.createElement('span');
    nameSpan.innerHTML = highlightMatch(item.name, query);

    li.appendChild(nameSpan);

    if (item.code) {
      const badge = document.createElement('span');
      badge.className = 'jsel-option-badge';
      badge.textContent = item.code;
      li.appendChild(badge);
    }

    li.addEventListener('click', (e) => {
      e.stopPropagation();
      this._selectItem(levelIdx, item);
    });

    return li;
  }

  _toggleDropdown(levelIdx) {
    const state = this._levelStates[levelIdx];
    if (state.disabled) return;
    if (state.isOpen) {
      this._closeDropdown(levelIdx);
    } else {
      this._openDropdown(levelIdx);
    }
  }

  _openDropdown(levelIdx) {
    // Close other open dropdowns
    this._levelStates.forEach((lvl, i) => {
      if (i !== levelIdx && lvl.isOpen) this._closeDropdown(i);
    });

    const state = this._levelStates[levelIdx];
    if (state.disabled) return;

    state.isOpen = true;
    state.comboboxEl.classList.add('is-open');
    state.triggerEl.classList.add('is-active');
    state.triggerEl.setAttribute('aria-expanded', 'true');

    // Reset search query & focus input
    state.searchInputEl.value = '';
    this._renderOptionsList(levelIdx, '');

    setTimeout(() => {
      state.searchInputEl.focus();
    }, 50);
  }

  _closeDropdown(levelIdx) {
    const state = this._levelStates[levelIdx];
    if (!state.isOpen) return;

    state.isOpen = false;
    state.comboboxEl.classList.remove('is-open');
    state.triggerEl.classList.remove('is-active');
    state.triggerEl.setAttribute('aria-expanded', 'false');
  }

  _filterOptions(levelIdx, query) {
    this._renderOptionsList(levelIdx, query);
  }

  _handleSearchKeydown(levelIdx, e) {
    const state = this._levelStates[levelIdx];
    const options = state.optionsListEl.querySelectorAll('.jsel-option');
    if (options.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.focusedIdx = Math.min(state.focusedIdx + 1, options.length - 1);
      this._updateFocus(options, state.focusedIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.focusedIdx = Math.max(state.focusedIdx - 1, 0);
      this._updateFocus(options, state.focusedIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.focusedIdx >= 0 && state.focusedIdx < options.length) {
        options[state.focusedIdx].click();
      } else if (options.length > 0) {
        options[0].click();
      }
    } else if (e.key === 'Escape') {
      this._closeDropdown(levelIdx);
      state.triggerEl.focus();
    }
  }

  _updateFocus(options, focusedIdx) {
    options.forEach((opt, idx) => {
      if (idx === focusedIdx) {
        opt.classList.add('is-focused');
        opt.scrollIntoView({ block: 'nearest' });
      } else {
        opt.classList.remove('is-focused');
      }
    });
  }

  _selectItem(levelIdx, item) {
    this._setSelection(levelIdx, item, true);
    this._closeDropdown(levelIdx);

    // Auto load next level if exists
    const nextIdx = levelIdx + 1;
    if (nextIdx < LEVELS.length) {
      this._loadLevel(nextIdx, item.jurisdiction_id);
    }
  }

  _setSelection(levelIdx, item, triggerCascade = true) {
    const state = this._levelStates[levelIdx];
    state.selectedItem = item;

    state.triggerTextEl.className = 'jsel-trigger-text';
    state.triggerTextEl.textContent = item.name;
    state.clearBtnEl.style.display = 'flex';

    if (triggerCascade) {
      // Clear deeper levels
      this._clearLevelsFrom(levelIdx + 1);
      this._syncHidden();
      this._notifyChange();
    }
  }

  _clearSelection(levelIdx) {
    const state = this._levelStates[levelIdx];
    state.selectedItem = null;
    state.triggerTextEl.className = 'jsel-trigger-text is-placeholder';
    state.triggerTextEl.textContent = `-- Search or Select ${state.meta.label} --`;
    state.clearBtnEl.style.display = 'none';

    // Clear deeper levels
    this._clearLevelsFrom(levelIdx + 1);
    this._syncHidden();
    this._notifyChange();
  }

  _clearLevelsFrom(startIdx) {
    for (let i = startIdx; i < LEVELS.length; i++) {
      const state = this._levelStates[i];
      if (state) {
        state.selectedItem = null;
        state.disabled = true;
        state.items = [];
        state.filteredItems = [];
        state.triggerEl.classList.add('is-disabled');
        state.triggerEl.setAttribute('tabindex', '-1');
        state.triggerTextEl.className = 'jsel-trigger-text is-placeholder';
        state.triggerTextEl.textContent = `-- Select ${LEVELS[i - 1].label} first --`;
        state.clearBtnEl.style.display = 'none';
        state.optionsListEl.innerHTML = '';
        this._closeDropdown(i);
      }
    }
  }

  _handleDocumentClick(e) {
    if (this._destroyed) return;
    this._levelStates.forEach((lvl, i) => {
      if (lvl.isOpen && !lvl.comboboxEl.contains(e.target)) {
        this._closeDropdown(i);
      }
    });
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
