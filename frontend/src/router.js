// ── SPA Client-side Router ────────────────────────────────────────────────
// Uses the History API. Routes are defined as { path, handler }.
// Supports simple :param segments.

const routes = [];
let notFoundHandler = () => {};

export function addRoute(path, handler) {
  routes.push({ path, handler });
}

export function onNotFound(handler) {
  notFoundHandler = handler;
}

function matchRoute(pathname) {
  for (const route of routes) {
    const paramNames = [];
    const regexStr = route.path
      .replace(/:([^/]+)/g, (_, name) => { paramNames.push(name); return '([^/]+)'; })
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexStr}$`);
    const match = pathname.match(regex);
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => { params[name] = decodeURIComponent(match[i + 1]); });
      return { handler: route.handler, params };
    }
  }
  return null;
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  render(path);
}

function render(pathname) {
  const matched = matchRoute(pathname);
  if (matched) {
    matched.handler(matched.params);
  } else {
    notFoundHandler();
  }
}

export function initRouter() {
  // Handle browser back/forward
  window.addEventListener('popstate', () => render(window.location.pathname));

  // Intercept all <a href> clicks inside #app (event delegation)
  document.getElementById('app').addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
    e.preventDefault();
    navigate(href);
  });

  // Initial render
  render(window.location.pathname);
}
