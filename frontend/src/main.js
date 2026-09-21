import './style.css';
import { initRouter, addRoute, onNotFound } from './router.js';

// Import Pages
import { renderHome } from './pages/home.js';
import { renderLogin } from './pages/login.js';
import { renderSignup } from './pages/signup.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderEntities } from './pages/entities.js';
import { renderEntityDetail } from './pages/entityDetail.js';
import { renderEntityNew } from './pages/entityNew.js';
import { renderAdmin } from './pages/admin.js';
import { renderProfile } from './pages/profile.js';

// Setup Routes
addRoute('/', renderHome);
addRoute('/login', renderLogin);
addRoute('/signup', renderSignup);
addRoute('/dashboard', renderDashboard);
addRoute('/entities', renderEntities);
addRoute('/entities/new', renderEntityNew);
addRoute('/entities/:id', renderEntityDetail);
addRoute('/admin', renderAdmin);
addRoute('/profile', renderProfile);

onNotFound(() => {
  document.getElementById('app').innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center;">
      <h1 style="font-size:4rem; color:var(--gray-300);">404</h1>
      <h2 style="margin-bottom:var(--space-4);">Page Not Found</h2>
      <a href="/" class="btn btn-primary">Go to Dashboard</a>
    </div>
  `;
});

// Initialize SPA Router
initRouter();

// Listen for global auth expiration (e.g. 401 from API)
window.addEventListener('auth:expired', () => {
  import('./components/toast.js').then(m => {
    m.toastWarning('Your session has expired. Please sign in again.');
  });
  import('./router.js').then(m => m.navigate('/login'));
});
