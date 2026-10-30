import './style.css';
import 'leaflet/dist/leaflet.css';
import { initRouter, addRoute, onNotFound } from './router.js';
import { initAuth } from './auth.js';
import { initLanguageSupport } from './components/languageSelector.js';

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
import { renderModuleBuilder } from './pages/moduleBuilder.js';
import { renderReports } from './pages/reports.js';
import { renderModules } from './pages/modules.js';
import { renderGovernanceIntelligence } from './pages/governanceIntelligence.js';
import { renderAgentChat } from './pages/agentChat.js';
import { renderMemeStudio } from './pages/memeStudio.js';
import { renderCivicBuzz } from './pages/civicBuzz.js';
import { renderNearbyProtests } from './pages/nearbyProtests.js';

// Setup Routes
addRoute('/', renderHome);
addRoute('/login', renderLogin);
addRoute('/signup', renderSignup);
addRoute('/dashboard', renderDashboard);
addRoute('/governance', renderGovernanceIntelligence);
addRoute('/modules', renderModules);
addRoute('/entities', renderEntities);
addRoute('/entities/new', renderEntityNew);
addRoute('/entities/:id', renderEntityDetail);
addRoute('/nearby', renderNearbyProtests);
addRoute('/protests/nearby', renderNearbyProtests);
addRoute('/admin', renderAdmin);
addRoute('/module-builder', renderModuleBuilder);
addRoute('/reports', renderReports);
addRoute('/profile', renderProfile);
addRoute('/director', renderDashboard);
addRoute('/coordinator', renderDashboard);
addRoute('/workspace', renderDashboard);
addRoute('/agent/chat', renderAgentChat);            // Conversational Agent V1
addRoute('/meme/studio', renderMemeStudio);
addRoute('/meme/studio/:issueId', renderMemeStudio); // Civic Meme Studio
addRoute('/buzz', renderCivicBuzz);                  // Civic Buzz Feed

onNotFound(() => {
  document.getElementById('app').innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `;
});

// Listen for global auth expiration (e.g. 401 from API)
window.addEventListener('auth:expired', () => {
  import('./components/toast.js').then(m => {
    m.toastWarning('Your session has expired. Please sign in again.');
  });
  import('./router.js').then(m => m.navigate('/login'));
});

// App Startup: Restore cookie session first, then initialize router & language support
const appEl = document.getElementById('app');
if (appEl && !appEl.innerHTML.trim()) {
  appEl.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; gap:16px;">
      <div class="spinner" style="width:36px; height:36px; border-width:3px;"></div>
      <div style="font-size:14px; font-weight:600; color:var(--text-secondary);">Loading CIVIC-KALKI...</div>
    </div>
  `;
}

initAuth().finally(() => {
  initRouter();
  initLanguageSupport();
});
