// ── SPA Client-side Router ────────────────────────────────────────────────
// Uses the History API. Routes are defined as { path, handler }.
// Supports simple :param segments and query parameters.

const routes = [];
let notFoundHandler = () => {};

export function addRoute(path, handler) {
  routes.push({ path, handler });
}

export function onNotFound(handler) {
  notFoundHandler = handler;
}

function matchRoute(pathname) {
  // Sort routes so static routes are tested before parameterized routes
  // (e.g. /entities/new takes precedence over /entities/:id)
  const sortedRoutes = [...routes].sort((a, b) => {
    const aHasParam = a.path.includes(':');
    const bHasParam = b.path.includes(':');
    if (!aHasParam && bHasParam) return -1;
    if (aHasParam && !bHasParam) return 1;
    return 0;
  });

  for (const route of sortedRoutes) {
    const paramNames = [];
    const regexStr = route.path
      .replace(/:([^/]+)/g, (_, name) => { paramNames.push(name); return '([^/]+)'; })
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexStr}$`);
    const match = pathname.match(regex);
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => { params[name] = decodeURIComponent(match[i + 1]); });
      return { handler: route.handler, params, path: route.path };
    }
  }
  return null;
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  render(window.location.href);
}

function render(pathOrUrl = window.location.href) {
  // Parse URL properly using standard browser URL API
  const url = new URL(pathOrUrl, window.location.origin);
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  const matched = matchRoute(pathname);
  if (matched) {
    const res = matched.handler(matched.params, url.searchParams);
    if (res && typeof res.then === 'function') {
      res.then(() => {
        window.dispatchEvent(new CustomEvent('civic:route-rendered', { detail: { pathname, async: true } }));
      }).catch(err => {
        console.error('[Router Error]:', err);
      });
    }
  } else {
    notFoundHandler();
  }

  // Notify listeners that route content has initiated/mounted
  window.dispatchEvent(new CustomEvent('civic:route-rendered', { detail: { pathname } }));
}

export function initRouter() {
  window.navigate = navigate;

  // Handle browser back/forward
  window.addEventListener('popstate', () => render(window.location.href));

  // Intercept all <a href> clicks inside #app (event delegation)
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
      e.preventDefault();
      navigate(href);
    });
  }

  // Initial render with current location
  render(window.location.href);
}
