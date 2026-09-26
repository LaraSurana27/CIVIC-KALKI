import { isAuthenticated, getUser } from '../auth.js';
import { renderLanguageSelector, attachLanguageSelectorEvents } from '../components/languageSelector.js';

export function renderHome() {
  const user = getUser();
  const loggedIn = isAuthenticated();

  const appEl = document.getElementById('app');
  if (!appEl) return;

  appEl.innerHTML = `
    <div class="home-container">
      <!-- Public Header -->
      <header class="home-header">
        <a href="/" class="home-logo">
          <img src="/logo.png" alt="CivicKalki" style="height:38px; width:auto; object-fit:contain;" />
        </a>

        <div style="display:flex; align-items:center; gap:var(--space-4);">
          ${renderLanguageSelector({ idPrefix: 'home' })}
          ${loggedIn ? `
            <a href="/dashboard" class="home-btn-primary" style="padding:8px 20px; font-size:0.875rem;">
              Enter Civic OS (${escapeHtml(user.name.split(' ')[0])}) →
            </a>
          ` : `
            <a href="/login" class="home-btn-secondary" style="padding:8px 20px; font-size:0.875rem;">Sign In</a>
            <a href="/login" class="home-btn-primary" style="padding:8px 20px; font-size:0.875rem;">Explore CIVIC-KALKI</a>
          `}
        </div>
      </header>

      <!-- Hero Section -->
      <section class="home-hero">
        <div class="home-badge-pill">
          <span>Metadata-Driven Civic Operating System</span>
        </div>
        
        <h1 class="home-hero-title">
          The Civic Operating System
        </h1>
        
        <p class="home-hero-subtitle">
          Connect civic action, governance workflows, accountability and civic intelligence through one platform.
        </p>

        <div class="home-cta-group mb-8">
          ${loggedIn ? `
            <a href="/dashboard" class="home-btn-primary">Enter My Civic Workspace →</a>
          ` : `
            <a href="/login" class="home-btn-primary">Explore CIVIC-KALKI</a>
            <a href="/login" class="home-btn-secondary">Sign In</a>
          `}
        </div>

        <!-- System Architecture Process Flow -->
        <div style="max-width:960px; margin:40px auto 0; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-xl); padding:24px; box-shadow:var(--shadow-sm);">
          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:16px;">
            How CIVIC-KALKI Transforms Civic Governance
          </div>
          
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:0.875rem; font-weight:600; color:var(--text-primary);">
            <div style="padding:10px 16px; background:var(--blue-50); border-radius:var(--radius-md); border:1px solid var(--blue-200); color:var(--primary);">
              Civic Need
            </div>
            <div style="color:var(--text-muted);">→</div>
            <div style="padding:10px 16px; background:var(--surface); border-radius:var(--radius-md); border:1px solid var(--border-strong);">
              CIVIC-KALKI Engine
            </div>
            <div style="color:var(--text-muted);">→</div>
            <div style="padding:10px 16px; background:var(--surface); border-radius:var(--radius-md); border:1px solid var(--border-strong);">
              Structured Civic Action
            </div>
            <div style="color:var(--text-muted);">→</div>
            <div style="padding:10px 16px; background:var(--surface); border-radius:var(--radius-md); border:1px solid var(--border-strong);">
              Workflow & Accountability
            </div>
            <div style="color:var(--text-muted);">→</div>
            <div style="padding:10px 16px; background:var(--green-50); border-radius:var(--radius-md); border:1px solid var(--green-100); color:var(--green-700);">
              Civic Intelligence
            </div>
          </div>
        </div>
      </section>

      <!-- 5 Major Capabilities Section -->
      <section class="home-section" style="background:#ffffff; border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
        <h2 class="home-section-title">Core Platform Capabilities</h2>
        <p class="home-section-sub">
          CIVIC-KALKI empowers citizens and municipal teams to move from problem identification to resolution with full transparency.
        </p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
          <!-- 1. Start Civic Action -->
          <div class="home-card">
            <div class="home-card-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="home-card-title">1. Start Civic Action</h3>
            <p class="home-card-desc">
              Create initiatives, requests, grievances, and public improvement projects using dynamic, metadata-configured forms.
            </p>
          </div>

          <!-- 2. Organize -->
          <div class="home-card">
            <div class="home-card-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h3 class="home-card-title">2. Organize</h3>
            <p class="home-card-desc">
              Connect citizens, volunteers, municipal officers, documents, and related civic activities into structured case units.
            </p>
          </div>

          <!-- 3. Execute -->
          <div class="home-card">
            <div class="home-card-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <h3 class="home-card-title">3. Execute</h3>
            <p class="home-card-desc">
              Move civic cases through transparent, multi-stage role-based workflows with automated verification and approval matrices.
            </p>
          </div>

          <!-- 4. Understand -->
          <div class="home-card">
            <div class="home-card-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h3 class="home-card-title">4. Understand</h3>
            <p class="home-card-desc">
              Use real-time aggregated reports and AI-assisted decision intelligence to identify ward-level patterns and priority areas.
            </p>
          </div>

          <!-- 5. Maintain Accountability -->
          <div class="home-card">
            <div class="home-card-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="home-card-title">5. Maintain Accountability</h3>
            <p class="home-card-desc">
              Preserve immutable approval histories, detailed audit logs, and parent-child entity lineage for full institutional memory.
            </p>
          </div>
        </div>
      </section>

      <!-- Demonstration Capabilities Section -->
      <section class="home-section">
        <h2 class="home-section-title">Integrated Civic Modules</h2>
        <p class="home-section-sub">
          One generic engine powers multiple civic operations without code generation or schema migrations.
        </p>

        <div class="home-grid-3">
          <div class="home-card">
            <h3 class="home-card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Report a Problem
            </h3>
            <p class="home-card-desc">Grievance reporting, area coordinator review, SLA tracking, and resolution logging.</p>
          </div>

          <div class="home-card">
            <h3 class="home-card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>
              Start an Initiative
            </h3>
            <p class="home-card-desc">Community-led civic initiatives, volunteer coordination, and ward participation.</p>
          </div>

          <div class="home-card">
            <h3 class="home-card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              Park Renovation Requests
            </h3>
            <p class="home-card-desc">Infrastructure renovation proposals, budget evaluation, executive sign-off, and automated rule triggers.</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="home-footer">
        <div style="display:flex; flex-direction:column; align-items:center; gap:var(--space-2);">
          <img src="/logo.png" alt="CivicKalki" style="height:30px; width:auto; object-fit:contain; opacity:0.7;" />
          <p>Built for Transparent Municipal Governance &amp; Civic Action</p>
        </div>
      </footer>
    </div>
  `;

  attachLanguageSelectorEvents('home');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
