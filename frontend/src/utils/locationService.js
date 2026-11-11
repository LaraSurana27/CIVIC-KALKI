/**
 * CIVIC-KALKI — Location Service
 *
 * Provides browser Geolocation + Nominatim reverse-geocoding.
 * Location is stored in sessionStorage so it persists across page
 * navigations within a session but is cleared when the tab closes.
 *
 * Usage:
 *   import { getStoredLocation, requestLocation, formatLocationForAgent } from './locationService.js';
 */

const STORAGE_KEY   = 'ck_user_location';
const DISMISSED_KEY = 'ck_location_dismissed';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

// ── Storage helpers ───────────────────────────────────────────────────────────

/** Returns the stored {lat, lng, area, timestamp} or null. */
export function getStoredLocation() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const loc = JSON.parse(raw);
    if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') return loc;
    return null;
  } catch {
    return null;
  }
}

/** Persist a location object into sessionStorage. */
export function storeLocation(loc) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loc, timestamp: Date.now() }));
  } catch { /* quota exceeded — silently ignore */ }
}

/** Returns true if the user has previously dismissed the location banner. */
export function isLocationDismissed() {
  return sessionStorage.getItem(DISMISSED_KEY) === '1';
}

/** Mark the banner as dismissed for this session. */
export function dismissLocation() {
  try { sessionStorage.setItem(DISMISSED_KEY, '1'); } catch { /* ignore */ }
}

// ── Reverse Geocode via Nominatim ─────────────────────────────────────────────

async function reverseGeocode(lat, lng) {
  try {
    const url = `${NOMINATIM_URL}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&format=json&zoom=16&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CIVIC-KALKI/1.0 (civic-kalki@example.com)' },
    });
    if (!res.ok) throw new Error('Nominatim error');
    const data = await res.json();
    const addr = data.address || {};
    // Build a short, human-readable area string
    const parts = [
      addr.road || addr.pedestrian || addr.footway,
      addr.suburb || addr.neighbourhood || addr.quarter,
      addr.city || addr.town || addr.village || addr.municipality,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : (data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// ── Main Request ──────────────────────────────────────────────────────────────

/**
 * Requests the user's browser location, reverse-geocodes it, stores in
 * sessionStorage and returns {lat, lng, area}.
 * Throws if permission denied or geolocation unavailable.
 */
export function requestLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat  = pos.coords.latitude;
        const lng  = pos.coords.longitude;
        const area = await reverseGeocode(lat, lng);
        const loc  = { lat, lng, area };
        storeLocation(loc);
        resolve(loc);
      },
      (err) => {
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// ── Agent message formatter ───────────────────────────────────────────────────

/**
 * Returns a string to prepend to agent messages so the AI can use the
 * user's location when populating form fields (location, latitude, longitude, area).
 *
 * Example output:
 *   "[User location: FC Road, Shivajinagar (18.5204°N, 73.8567°E)] "
 */
export function formatLocationForAgent(loc) {
  if (!loc || typeof loc.lat !== 'number') return '';
  const latDir = loc.lat >= 0 ? 'N' : 'S';
  const lngDir = loc.lng >= 0 ? 'E' : 'W';
  return `[User location: ${loc.area} (${Math.abs(loc.lat).toFixed(4)}°${latDir}, ${Math.abs(loc.lng).toFixed(4)}°${lngDir})] `;
}

