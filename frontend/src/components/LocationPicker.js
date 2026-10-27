import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Vite bundler asset paths for Leaflet default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_TILE_URL = import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_ATTRIBUTION = import.meta.env.VITE_MAP_ATTRIBUTION || '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

// Default center: New Delhi (28.6139, 77.2090) if none selected
const DEFAULT_CENTER = [28.6139, 77.2090];
const DEFAULT_ZOOM = 13;

/**
 * Creates and mounts an interactive LocationPicker component into a container DOM element.
 * 
 * Features:
 * - "Use my current location" via navigator.geolocation (ONLY on click)
 * - Explicit Nominatim geocoding search with max 1 req/sec rate limiting
 * - Interactive Leaflet map with draggable pin
 * - Area / ward / locality selection (defaults to empty -> unassigned)
 * - In-memory state only (never localStorage / sessionStorage)
 * 
 * @param {HTMLElement|string} container - Element or element ID to mount into
 * @param {Object} options
 * @param {number} [options.initialLat]
 * @param {number} [options.initialLng]
 * @param {string} [options.initialArea]
 * @param {Function} [options.onChange] - Callback (locationData) => void
 * @returns {Object} Controller instance { getValue(), destroy() }
 */
export function createLocationPicker(container, options = {}) {
  const mountEl = typeof container === 'string' ? document.getElementById(container) : container;
  if (!mountEl) {
    console.error('[LocationPicker] Mount target not found:', container);
    return null;
  }

  // State (kept in-memory only)
  let state = {
    latitude: options.initialLat ? Number(options.initialLat) : null,
    longitude: options.initialLng ? Number(options.initialLng) : null,
    area: options.initialArea ? String(options.initialArea).trim() : '',
    address: '',
    loading: false,
    error: '',
  };

  let mapInstance = null;
  let markerInstance = null;
  let lastSearchTime = 0;

  const instanceId = 'loc-picker-' + Math.random().toString(36).substring(2, 9);

  // Render container layout
  mountEl.innerHTML = `
    <div class="location-picker-box card" id="${instanceId}" style="border:1px solid var(--border); background:var(--surface); padding:16px; border-radius:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <label style="font-weight:600; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Select Location & Coordinates
        </label>
        <button type="button" class="btn btn-secondary btn-sm" id="${instanceId}-btn-geolocate" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Use My Current Location
        </button>
      </div>

      <!-- Search Box & Area Input -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:12px;" class="loc-input-grid">
        <div style="display:flex; gap:6px;">
          <input type="text" id="${instanceId}-search-input" class="form-control" placeholder="Search landmark, address, street..." style="flex:1;">
          <button type="button" class="btn btn-primary" id="${instanceId}-btn-search" style="padding:6px 14px; font-weight:600; flex-shrink:0;">
            Search
          </button>
        </div>
        <div>
          <input type="text" id="${instanceId}-area-input" class="form-control" placeholder="Locality / Ward (optional)" value="${escapeHtml(state.area)}">
        </div>
      </div>

      <!-- Feedback Banner -->
      <div id="${instanceId}-feedback" style="display:none; padding:8px 12px; border-radius:6px; font-size:13px; margin-bottom:10px;"></div>

      <!-- Map Display -->
      <div id="${instanceId}-map" style="height:280px; width:100%; border-radius:6px; border:1px solid var(--border); background:#f1f5f9; z-index:1;"></div>

      <!-- Selected Coordinates Display -->
      <div id="${instanceId}-coords-bar" style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted); background:var(--gray-50); padding:8px 12px; border-radius:6px;">
        <span id="${instanceId}-coords-text">
          ${state.latitude && state.longitude 
            ? `Selected: <strong>${state.latitude.toFixed(6)}, ${state.longitude.toFixed(6)}</strong>` 
            : 'Click on the map or drag the pin to set exact coordinates'}
        </span>
        <span style="font-size:11px; color:var(--text-secondary);">Drag marker to fine-tune</span>
      </div>
    </div>
  `;

  const mapEl = document.getElementById(`${instanceId}-map`);
  const feedbackEl = document.getElementById(`${instanceId}-feedback`);
  const searchInput = document.getElementById(`${instanceId}-search-input`);
  const searchBtn = document.getElementById(`${instanceId}-btn-search`);
  const geolocateBtn = document.getElementById(`${instanceId}-btn-geolocate`);
  const areaInput = document.getElementById(`${instanceId}-area-input`);
  const coordsText = document.getElementById(`${instanceId}-coords-text`);

  function showFeedback(msg, type = 'error') {
    if (!feedbackEl) return;
    feedbackEl.style.display = 'block';
    if (type === 'error') {
      feedbackEl.style.background = '#fef2f2';
      feedbackEl.style.border = '1px solid #fecaca';
      feedbackEl.style.color = '#dc2626';
    } else if (type === 'info') {
      feedbackEl.style.background = '#eff6ff';
      feedbackEl.style.border = '1px solid #bfdbfe';
      feedbackEl.style.color = '#1d4ed8';
    } else {
      feedbackEl.style.background = '#f0fdf4';
      feedbackEl.style.border = '1px solid #bbf7d0';
      feedbackEl.style.color = '#16a34a';
    }
    feedbackEl.textContent = msg;
  }

  function clearFeedback() {
    if (!feedbackEl) return;
    feedbackEl.style.display = 'none';
    feedbackEl.textContent = '';
  }

  function updateCoordsDisplay() {
    if (!coordsText) return;
    if (state.latitude != null && state.longitude != null) {
      coordsText.innerHTML = `Coordinates: <strong>${state.latitude.toFixed(6)}, ${state.longitude.toFixed(6)}</strong> ${state.address ? ` • <span title="${escapeHtml(state.address)}">${escapeHtml(state.address)}</span>` : ''}`;
    } else {
      coordsText.textContent = 'Click on the map or drag the pin to set exact coordinates';
    }
  }

  function setCoordinates(lat, lng, address = '', shouldPan = true) {
    state.latitude = Math.round(lat * 1e6) / 1e6;
    state.longitude = Math.round(lng * 1e6) / 1e6;
    if (address) state.address = address;

    updateCoordsDisplay();

    if (!markerInstance && mapInstance) {
      markerInstance = L.marker([state.latitude, state.longitude], { draggable: true }).addTo(mapInstance);
      markerInstance.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setCoordinates(pos.lat, pos.lng, '', false);
      });
    } else if (markerInstance) {
      markerInstance.setLatLng([state.latitude, state.longitude]);
    }

    if (shouldPan && mapInstance) {
      mapInstance.setView([state.latitude, state.longitude], Math.max(mapInstance.getZoom(), 14));
    }

    if (options.onChange) {
      options.onChange(getValue());
    }
  }

  // Initialize Leaflet Map
  function initMap() {
    if (!mapEl) return;

    const initialCenter = (state.latitude && state.longitude) 
      ? [state.latitude, state.longitude] 
      : DEFAULT_CENTER;
    const initialZoom = (state.latitude && state.longitude) ? 14 : DEFAULT_ZOOM;

    mapInstance = L.map(mapEl, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(DEFAULT_TILE_URL, {
      attribution: DEFAULT_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(mapInstance);

    if (state.latitude && state.longitude) {
      markerInstance = L.marker([state.latitude, state.longitude], { draggable: true }).addTo(mapInstance);
      markerInstance.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setCoordinates(pos.lat, pos.lng, '', false);
      });
    }

    mapInstance.on('click', (e) => {
      setCoordinates(e.latlng.lat, e.latlng.lng, '', false);
    });

    // Invalidate map size after DOM layout stabilizes
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 250);
  }

  // Browser Geolocation (ONLY executed on explicit button click)
  async function handleGeolocate() {
    clearFeedback();
    if (!navigator.geolocation) {
      showFeedback('Geolocation is not supported by your browser. Please search or pick manually on the map.', 'error');
      return;
    }

    geolocateBtn.disabled = true;
    const origBtnHTML = geolocateBtn.innerHTML;
    geolocateBtn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px;margin-right:6px;"></span> Locating...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        geolocateBtn.disabled = false;
        geolocateBtn.innerHTML = origBtnHTML;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates(lat, lng, 'Current Location', true);
        showFeedback('Location retrieved successfully from GPS.', 'success');
        setTimeout(clearFeedback, 3500);
      },
      (err) => {
        geolocateBtn.disabled = false;
        geolocateBtn.innerHTML = origBtnHTML;
        let msg = 'Could not retrieve your location. Please use the search bar or click on the map.';
        if (err.code === 1) {
          msg = 'Location permission was denied. Please use the search box or click on the map.';
        } else if (err.code === 2) {
          msg = 'Location unavailable. Please search for your location.';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Please try searching for your area.';
        }
        showFeedback(msg, 'error');
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }

  // Geocoding via OpenStreetMap Nominatim with rate-limit protection (max 1 req/sec)
  async function handleSearch() {
    clearFeedback();
    const query = String(searchInput.value || '').trim();
    if (!query) {
      showFeedback('Please enter an address, city, or landmark to search.', 'error');
      return;
    }

    const now = Date.now();
    if (now - lastSearchTime < 1000) {
      showFeedback('Please wait a second before searching again.', 'info');
      return;
    }
    lastSearchTime = now;

    searchBtn.disabled = true;
    const origBtnText = searchBtn.textContent;
    searchBtn.textContent = 'Searching...';

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Geocoding failed with status ${res.status}`);
      }

      const results = await res.json();
      if (!Array.isArray(results) || results.length === 0) {
        showFeedback(`No location found for "${query}". Try a broader address or landmark.`, 'error');
        return;
      }

      const item = results[0];
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const address = item.display_name || query;

      setCoordinates(lat, lng, address, true);
      showFeedback(`Found: ${address}`, 'success');
      setTimeout(clearFeedback, 4000);
    } catch (err) {
      console.warn('[LocationPicker] Nominatim search error:', err);
      showFeedback('Failed to lookup address. Please click directly on the map to set coordinates.', 'error');
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = origBtnText;
    }
  }

  // Attach event handlers
  if (geolocateBtn) {
    geolocateBtn.addEventListener('click', handleGeolocate);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    });
  }

  if (areaInput) {
    areaInput.addEventListener('input', (e) => {
      state.area = e.target.value.trim();
      if (options.onChange) {
        options.onChange(getValue());
      }
    });
  }

  // Initialize Map
  initMap();

  function getValue() {
    return {
      latitude: state.latitude,
      longitude: state.longitude,
      area: state.area ? state.area : null,
      address: state.address || null,
    };
  }

  function destroy() {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
    mountEl.innerHTML = '';
  }

  return {
    getValue,
    setCoordinates,
    destroy,
  };
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
