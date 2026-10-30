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

/**
 * Renders a small read-only Leaflet map with a marker at the given coordinates
 * and an "Open in Google Maps" external link.
 * 
 * If coordinates are missing/null, returns empty HTML string. Never reconstructs.
 * 
 * @param {Object} entity - The entity object containing latitude, longitude, maps_url
 * @returns {string} HTML snippet containing map container and maps link
 */
export function renderReadOnlyMapHTML(entity) {
  if (!entity || entity.latitude == null || entity.longitude == null) {
    return '';
  }

  const lat = Number(entity.latitude);
  const lng = Number(entity.longitude);
  if (isNaN(lat) || isNaN(lng)) return '';

  const mapsUrl = entity.maps_url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const mapContainerId = `readonly-map-${entity.entity_id || 'preview'}-${Math.random().toString(36).substring(2, 7)}`;

  return `
    <div class="card mb-6" style="border-top:3px solid var(--primary);">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" style="display:flex; align-items:center; gap:8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Location & Geo-Coordinates
        </div>
        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          Open in Google Maps
        </a>
      </div>
      <div class="card-body" style="padding:16px;">
        <div id="${mapContainerId}" data-lat="${lat}" data-lng="${lng}" class="entity-readonly-map-instance" style="height:220px; width:100%; border-radius:6px; border:1px solid var(--border); background:#f1f5f9; z-index:1;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:12px; color:var(--text-muted);">
          <span>Latitude: <strong>${lat.toFixed(6)}</strong> • Longitude: <strong>${lng.toFixed(6)}</strong></span>
          <span class="badge badge-success" style="font-size:11px;">Verified Coordinates</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initializes any mounted read-only map containers in the page.
 */
export function initReadOnlyMaps() {
  const containers = document.querySelectorAll('.entity-readonly-map-instance');
  containers.forEach(container => {
    if (container.dataset.initialized) return;
    const lat = parseFloat(container.dataset.lat);
    const lng = parseFloat(container.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    container.dataset.initialized = 'true';

    try {
      const map = L.map(container, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false, // Prevent page scrolling capture
      });

      L.tileLayer(DEFAULT_TILE_URL, {
        attribution: DEFAULT_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (err) {
      console.warn('[ReadOnlyMap] Failed to initialize map container:', err);
    }
  });
}
