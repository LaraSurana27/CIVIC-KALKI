import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { entities as apiEntities } from '../api.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { toastError, toastSuccess } from '../components/toast.js';

// Fix Vite default marker icon paths
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

let mapInstance = null;
let userMarker = null;
let entityMarkersGroup = null;

export async function renderNearbyProtests() {
  const app = document.getElementById('app');

  const contentHTML = `
    <div style="max-width:1200px; margin:0 auto; padding-bottom:40px;">
      <!-- Hero Banner -->
      <div class="card mb-6" style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; border:none; padding:28px; border-radius:12px; box-shadow:var(--shadow-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
          <div style="max-width:650px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,90,54,0.2); border:1px solid rgba(255,90,54,0.4); padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; color:#ff7d5c; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Civic Geo-Intelligence
            </div>
            <h1 style="font-size:2rem; font-weight:800; line-height:1.2; margin-bottom:10px; color:#ffffff;">Nearby Civic Protests & Operations</h1>
            <p style="color:#94a3b8; font-size:14px; margin-bottom:0; line-height:1.6;">
              Locate public, approved civic rallies, protests, and community campaigns within your vicinity.
              Location coordinates are verified and publicly accessible once officially authorized.
            </p>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
            <button id="btn-detect-location" class="btn btn-primary" style="padding:12px 24px; font-size:15px; font-weight:700; box-shadow:0 4px 14px rgba(255,90,54,0.4); display:inline-flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Find Protests Near Me
            </button>
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#cbd5e1;">
              <span>Search Radius:</span>
              <select id="select-radius" style="background:#334155; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 8px; font-size:12px; font-weight:600; cursor:pointer;">
                <option value="5">5 km</option>
                <option value="10" selected>10 km (Default)</option>
                <option value="25">25 km</option>
                <option value="50">50 km (Max)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid: Map & Results List -->
      <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:20px;" class="nearby-grid">
        <!-- Interactive Leaflet Map Container -->
        <div class="card" style="padding:0; overflow:hidden; border-radius:10px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; height:580px;">
          <div style="padding:14px 18px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              Live Map Radar
            </div>
            <div id="map-status-pill" style="font-size:11px; color:var(--text-muted);">
              Awaiting location permission
            </div>
          </div>
          <div id="nearby-map" style="flex:1; width:100%; background:#e2e8f0; z-index:1;"></div>
        </div>

        <!-- Protests List Container -->
        <div class="card" style="padding:0; overflow:hidden; border-radius:10px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; height:580px;">
          <div style="padding:14px 18px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              Nearby Records
            </div>
            <span id="results-count-badge" class="badge badge-secondary" style="font-weight:700;">0 found</span>
          </div>

          <div id="nearby-results-list" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; background:var(--gray-50);">
            <!-- Empty state default -->
            <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-muted);">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Search Initiated</div>
              <div style="font-size:13px; max-width:320px; margin:0 auto;">Click "Find Protests Near Me" above to discover verified civic events around your current location.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  app.innerHTML = renderLayout(contentHTML, 'Nearby Civic Protests');
  attachLayoutEvents();

  // Attach nearby-specific events & initialize map
  initNearbyView();
}

function initNearbyView() {
  const mapEl = document.getElementById('nearby-map');
  const detectBtn = document.getElementById('btn-detect-location');
  const radiusSelect = document.getElementById('select-radius');
  const listEl = document.getElementById('nearby-results-list');
  const countBadge = document.getElementById('results-count-badge');
  const statusPill = document.getElementById('map-status-pill');

  let currentCoords = null;

  // Initialize Map
  if (mapEl) {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    mapInstance = L.map(mapEl, {
      center: [28.6139, 77.2090], // Default Delhi
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(DEFAULT_TILE_URL, {
      attribution: DEFAULT_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(mapInstance);

    entityMarkersGroup = L.layerGroup().addTo(mapInstance);

    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 200);
  }

  async function fetchNearby(lat, lng, radiusKm) {
    if (listEl) {
      listEl.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--text-muted);">
          <div class="spinner" style="width:32px; height:32px; border-width:3px; margin-bottom:12px;"></div>
          <div style="font-size:13px;">Scanning within ${radiusKm} km radius...</div>
        </div>
      `;
    }

    try {
      const res = await apiEntities.nearby(lat, lng, radiusKm);
      const items = res.data || [];

      if (countBadge) {
        countBadge.textContent = `${items.length} found`;
        countBadge.className = items.length > 0 ? 'badge badge-primary' : 'badge badge-secondary';
      }

      if (statusPill) {
        statusPill.textContent = `Showing ${items.length} records within ${radiusKm} km`;
      }

      renderListAndMarkers(items, lat, lng);
    } catch (err) {
      console.error('[NearbyProtests] Fetch error:', err);
      toastError(err.message || 'Failed to search nearby events');
      if (listEl) {
        listEl.innerHTML = `
          <div style="padding:40px 20px; text-align:center; color:#dc2626;">
            <div style="font-weight:600; margin-bottom:4px;">Search Error</div>
            <div style="font-size:13px;">${escapeHtml(err.message || 'Could not load nearby events')}</div>
          </div>
        `;
      }
    }
  }

  function renderListAndMarkers(items, userLat, userLng) {
    if (!listEl) return;

    // Clear previous markers
    if (entityMarkersGroup) {
      entityMarkersGroup.clearLayers();
    }

    // Add / update user location marker
    if (userMarker && mapInstance) {
      mapInstance.removeLayer(userMarker);
    }

    const userIcon = L.divIcon({
      className: 'user-radar-pin',
      html: `<div style="background:#2563eb; width:18px; height:18px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 10px rgba(37,99,235,0.8); animation:pulse 2s infinite;"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(mapInstance);
    userMarker.bindPopup('<strong>Your Location</strong>');

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Approved Protests Found</div>
          <div style="font-size:13px; max-width:320px; margin:0 auto;">
            There are currently no public, approved civic rallies or protests within ${radiusSelect.value} km.
            Try expanding the search radius.
          </div>
        </div>
      `;
      mapInstance.setView([userLat, userLng], 13);
      return;
    }

    const bounds = L.latLngBounds([[userLat, userLng]]);

    const itemsHTML = items.map(item => {
      const lat = item.latitude;
      const lng = item.longitude;
      const distance = item.distance_km != null ? `${Number(item.distance_km).toFixed(1)} km away` : '';
      const mapsUrl = item.maps_url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      // Add map marker
      if (lat != null && lng != null && entityMarkersGroup) {
        bounds.extend([lat, lng]);
        const marker = L.marker([lat, lng]).addTo(entityMarkersGroup);
        marker.bindPopup(`
          <div style="padding:4px; max-width:220px;">
            <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:4px;">${escapeHtml(item.name)}</div>
            <div style="font-size:11px; color:#64748b; margin-bottom:6px;">${escapeHtml(item.entityType?.name || 'Civic Event')} • ${distance}</div>
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:11px; color:#ff5a36; font-weight:600; text-decoration:none;">Open in Google Maps →</a>
          </div>
        `);
      }

      return `
        <div class="card" style="padding:14px; border:1px solid var(--border); background:var(--surface); border-radius:8px; transition:all 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
            <div>
              <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.04em;">
                ${escapeHtml(item.entityType?.name || 'Event')}
              </div>
              <a href="/entities/${item.entity_id}" class="text-link" style="font-size:15px; font-weight:700; color:var(--text-primary); text-decoration:none;">
                ${escapeHtml(item.name)}
              </a>
            </div>
            <span class="badge badge-success" style="font-size:11px; flex-shrink:0;">Approved</span>
          </div>

          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
            ${item.area ? `<span>Area: <strong>${escapeHtml(item.area)}</strong></span> • ` : ''}
            <span>Distance: <strong style="color:var(--primary);">${distance}</strong></span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px; font-size:12px;">
            <a href="/entities/${item.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px; padding:4px 10px;">
              View Details
            </a>
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size:12px; padding:4px 10px; display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              Open in Maps
            </a>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = itemsHTML;

    // Fit map bounds to show user and all results
    if (mapInstance && bounds.isValid()) {
      mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }

  // Handle "Find Protests Near Me"
  if (detectBtn) {
    detectBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        toastError('Geolocation is not supported by your browser.');
        return;
      }

      detectBtn.disabled = true;
      const origBtnHTML = detectBtn.innerHTML;
      detectBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Locating...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          detectBtn.disabled = false;
          detectBtn.innerHTML = origBtnHTML;
          currentCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          toastSuccess('Location detected! Searching nearby records...');
          const radius = Number(radiusSelect ? radiusSelect.value : 10);
          fetchNearby(currentCoords.latitude, currentCoords.longitude, radius);
        },
        (err) => {
          detectBtn.disabled = false;
          detectBtn.innerHTML = origBtnHTML;
          let msg = 'Could not access your location.';
          if (err.code === 1) msg = 'Location permission was denied. Please allow location access in your browser.';
          else if (err.code === 2) msg = 'Location unavailable.';
          else if (err.code === 3) msg = 'Location request timed out.';
          toastError(msg);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  if (radiusSelect) {
    radiusSelect.addEventListener('change', () => {
      if (currentCoords) {
        fetchNearby(currentCoords.latitude, currentCoords.longitude, Number(radiusSelect.value));
      }
    });
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
