(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}})();const at="modulepreload",nt=function(e){return"/"+e},ze={},Ie=function(t,i,a){let n=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),s=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(i.map(l=>{if(l=nt(l),l in ze)return;ze[l]=!0;const c=l.endsWith(".css"),m=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":at,c||(u.as="script"),u.crossOrigin="",u.href=l,s&&u.setAttribute("nonce",s),document.head.appendChild(u),c)return new Promise((g,p)=>{u.addEventListener("load",g),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return n.then(o=>{for(const s of o||[])s.status==="rejected"&&r(s.reason);return t().catch(r)})},Ve=[];let qe=()=>{};function E(e,t){Ve.push({path:e,handler:t})}function Oe(e){qe=e}function rt(e){const t=[...Ve].sort((i,a)=>{const n=i.path.includes(":"),r=a.path.includes(":");return!n&&r?-1:n&&!r?1:0});for(const i of t){const a=[],n=i.path.replace(/:([^/]+)/g,(s,l)=>(a.push(l),"([^/]+)")).replace(/\//g,"\\/"),r=new RegExp(`^${n}$`),o=e.match(r);if(o){const s={};return a.forEach((l,c)=>{s[l]=decodeURIComponent(o[c+1])}),{handler:i.handler,params:s,path:i.path}}}return null}function k(e){window.history.pushState({},"",e),be(window.location.href)}function be(e=window.location.href){const t=new URL(e,window.location.origin);let i=t.pathname;i.length>1&&i.endsWith("/")&&(i=i.slice(0,-1));const a=rt(i);a?a.handler(a.params,t.searchParams):qe()}function Fe(){window.navigate=k,window.addEventListener("popstate",()=>be(window.location.href)),document.getElementById("app").addEventListener("click",e=>{const t=e.target.closest("a[href]");if(!t)return;const i=t.getAttribute("href");!i||i.startsWith("http")||i.startsWith("mailto:")||i.startsWith("#")||(e.preventDefault(),k(i))}),be(window.location.href)}const ot=Object.freeze(Object.defineProperty({__proto__:null,addRoute:E,initRouter:Fe,navigate:k,onNotFound:Oe},Symbol.toStringTag,{value:"Module"})),ke="ck_auth";function $e(){try{const e=sessionStorage.getItem(ke);return e?JSON.parse(e):null}catch{return null}}function _e(e){sessionStorage.setItem(ke,JSON.stringify(e))}function Ue(){sessionStorage.removeItem(ke)}function Ge(){var e;return((e=$e())==null?void 0:e.token)||null}function Z(){var e;return((e=$e())==null?void 0:e.user)||null}function We(){var e;return((e=Z())==null?void 0:e.role)||null}function me(){const e=Ge();if(!e)return!1;try{const[,t]=e.split(".");return JSON.parse(atob(t.replace(/-/g,"+").replace(/_/g,"/"))).exp*1e3>Date.now()}catch{return!1}}function F(e){return me()?!0:(e("/login"),!1)}function Ke(e,t){if(!F(t))return!1;const i=We();return e.includes(i)?!0:(t("/dashboard"),!1)}const st={citizen:"Citizen",coordinator_area:"Area Coordinator",coordinator_general:"General Coordinator",director:"Director",admin:"Administrator"};function ie(e){return st[e]||e}async function lt(){const e=$e();if(!(e!=null&&e.token))return null;try{const t=await fetch("/api/auth/me",{headers:{Authorization:`Bearer ${e.token}`}});if(!t.ok)return null;const i=await t.json();if(i.success&&i.data)return _e({...e,user:i.data}),i.data}catch(t){console.warn("[auth] refreshUser failed:",t)}return e.user||null}function dt(){const e=Z(),t=me(),i=document.getElementById("app");i&&(i.innerHTML=`
    <div class="home-container">
      <!-- Public Header -->
      <header class="home-header">
        <a href="/" class="home-logo">
          <img src="/logo.png" alt="CivicKalki" style="height:38px; width:auto; object-fit:contain;" />
        </a>

        <div style="display:flex; align-items:center; gap:var(--space-4);">
          ${t?`
            <a href="/dashboard" class="home-btn-primary" style="padding:8px 20px; font-size:0.875rem;">
              Enter Civic OS (${ct(e.name.split(" ")[0])}) →
            </a>
          `:`
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
          ${t?`
            <a href="/dashboard" class="home-btn-primary">Enter My Civic Workspace →</a>
          `:`
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
  `)}function ct(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const pt="/api";async function f(e,t,i=null,a={}){const n=Ge(),r={"Content-Type":"application/json"};n&&(r.Authorization=`Bearer ${n}`);const o={method:e,headers:r,...a};i!==null&&(o.body=JSON.stringify(i));const s=await fetch(`${pt}${t}`,o);s.status===401&&(Ue(),window.dispatchEvent(new CustomEvent("auth:expired")));const l=await s.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!s.ok){const c=new Error(l.error||`HTTP ${s.status}`);throw c.status=s.status,c.data=l,c}return l}const Ce={login:(e,t)=>f("POST","/auth/login",{email:e,password:t}),signup:(e,t,i)=>f("POST","/auth/signup",{name:e,email:t,password:i}),changePassword:(e,t)=>f("POST","/auth/change-password",{current_password:e,new_password:t}),me:()=>f("GET","/auth/me")},Je={listUsers:(e={})=>{const t=new URLSearchParams(e).toString();return f("GET",`/admin/users${t?"?"+t:""}`)},getUser:e=>f("GET",`/admin/users/${e}`),setRole:(e,t,i)=>f("POST",`/admin/users/${e}/role`,{role:t,assignedArea:i})},_={list:(e={})=>{const t=new URLSearchParams(e).toString();return f("GET",`/entities${t?"?"+t:""}`)},listTypes:()=>f("GET","/entities/entity-types"),createType:e=>f("POST","/entities/entity-types",e),createRule:e=>f("POST","/entities/rules",e),get:e=>f("GET",`/entities/${e}`),create:e=>f("POST","/entities",e),update:(e,t)=>f("PUT",`/entities/${e}`,t),softDelete:e=>f("DELETE",`/entities/${e}`),transition:(e,t,i)=>f("POST",`/entities/${e}/transition`,{to_status:t,reason:i}),fireRules:(e,t)=>f("POST",`/entities/${e}/fire-rules`,{eventType:t}),aiAnalysis:e=>f("POST",`/entities/${e}/ai-analysis`),audit:e=>f("GET",`/entities/${e}/audit`),getLineage:e=>f("GET",`/entities/${e}/lineage`),workflow:e=>f("GET",`/entities/${e}/workflow`)},Ye={list:e=>f("GET",`/entities/${e}/values`),create:(e,t)=>f("POST",`/entities/${e}/values`,{values:t}),upsert:(e,t)=>f("PUT",`/entities/${e}/values`,{values:t})},Ee={getMetadata:()=>f("GET","/forms/metadata"),schema:e=>f("GET",`/forms/${e}/schema`),create:e=>f("POST","/forms",e),addSection:(e,t)=>f("POST",`/forms/${e}/sections`,t),addSubsection:(e,t)=>f("POST",`/sections/${e}/subsections`,t),addParameter:(e,t)=>f("POST",`/subsections/${e}/parameters`,t)},ve={list:(e={})=>{const t=new URLSearchParams(e).toString();return f("GET",`/reports${t?"?"+t:""}`)},get:e=>f("GET",`/reports/${e}`),create:e=>f("POST","/reports",e),execute:(e,t={})=>{const i=new URLSearchParams(t).toString();return f("GET",`/reports/${e}/execute${i?"?"+i:""}`)}},ut={validate:e=>f("POST","/module-builder/validate",e),deploy:e=>f("POST","/module-builder/deploy",e)},de={list:(e={})=>{const t=new URLSearchParams(e).toString();return f("GET",`/jurisdictions${t?"?"+t:""}`)},tree:()=>f("GET","/jurisdictions?tree=true"),get:e=>f("GET",`/jurisdictions/${e}`),create:e=>f("POST","/jurisdictions",e),update:(e,t)=>f("PUT",`/jurisdictions/${e}`,t),deactivate:e=>f("DELETE",`/jurisdictions/${e}`)};let mt=0;function ne(e,t="default",i=3500){const a=document.getElementById("toast-container"),n=++mt,r=document.createElement("div");return r.className=`toast toast-${t}`,r.id=`toast-${n}`,r.innerHTML=`
    <span>${ft(e)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `,a.appendChild(r),setTimeout(()=>{r.remove()},i),n}function vt(e){return ne(e,"default")}function V(e){return ne(e,"success")}function w(e){return ne(e,"error")}function gt(e){return ne(e,"warning")}function ft(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ht=Object.freeze(Object.defineProperty({__proto__:null,showToast:ne,toast:vt,toastError:w,toastSuccess:V,toastWarning:gt},Symbol.toStringTag,{value:"Module"}));function yt(){if(me()){k("/dashboard");return}const e=document.getElementById("app");e.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div class="auth-card-brand">
          <img src="/logo.png" alt="CivicKalki" style="height:44px; width:auto; object-fit:contain;" />
        </div>

        <h2>Sign in to Civic OS</h2>
        <p class="subtitle">Enter your credentials to access your operational dashboard</p>
        
        <div id="login-error-alert" class="alert alert-danger hidden mt-3 mb-3" role="alert" aria-live="assertive"></div>

        <form id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="name@city.gov" 
              required 
              autofocus
              aria-required="true"
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div style="position:relative;">
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="Enter password" 
                required
                aria-required="true"
                autocomplete="current-password"
                style="padding-right:40px;"
              >
              <button 
                type="button" 
                id="toggle-password-btn"
                aria-label="Show password"
                style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted); padding:4px; display:flex; align-items:center;"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full mt-4" id="login-btn">
            Sign In
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-secondary">
          Don't have an account? <a href="/signup" class="text-link">Sign up</a>
        </div>

        <div class="mt-4 text-center">
          <a href="/" style="font-size:0.8rem; color:var(--text-muted); text-decoration:none;">← Back to Public Home</a>
        </div>
      </div>
    </div>
  `;const t=document.getElementById("password"),i=document.getElementById("toggle-password-btn"),a='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',n='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>';i&&t&&i.addEventListener("click",()=>{const o=t.getAttribute("type")==="password"?"text":"password";t.setAttribute("type",o),i.setAttribute("aria-label",o==="password"?"Show password":"Hide password"),i.innerHTML=o==="password"?a:n});const r=document.getElementById("login-error-alert");document.getElementById("login-form").addEventListener("submit",async o=>{o.preventDefault(),r&&(r.classList.add("hidden"),r.textContent="");const s=document.getElementById("login-btn"),l=document.getElementById("email").value.trim(),c=t.value;if(!l||!c){r&&(r.textContent="Please enter both email address and password.",r.classList.remove("hidden"));return}s.disabled=!0,s.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';try{const m=await Ce.login(l,c);_e({token:m.data.token,user:m.data.user}),k("/dashboard")}catch(m){const u=m.message||"Invalid email or password. Please check your credentials.";r&&(r.textContent=u,r.classList.remove("hidden")),w(u),s.disabled=!1,s.innerHTML="Sign In"}})}function bt(){if(me()){k("/dashboard");return}const e=document.getElementById("app");e.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div class="auth-card-brand">
          <img src="/logo.png" alt="CivicKalki" style="height:44px; width:auto; object-fit:contain;" />
        </div>

        <h2>Create an account</h2>
        <p class="subtitle">Join as a citizen to get started</p>
        
        <form id="signup-form">
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input type="text" id="name" class="form-control" placeholder="Enter your full name" required autofocus>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Create a password (min 8 chars)" minlength="8" required>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full mt-4" id="signup-btn">
            Create Account
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-secondary">
          Already have an account? <a href="/login" class="text-link">Sign in</a>
        </div>

        <div class="mt-4 text-center">
          <a href="/" style="font-size:0.8rem; color:var(--text-muted); text-decoration:none;">← Back to Public Home</a>
        </div>
      </div>
    </div>
  `,document.getElementById("signup-form").addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("signup-btn"),a=document.getElementById("name").value.trim(),n=document.getElementById("email").value.trim(),r=document.getElementById("password").value;if(!(!a||!n||!r)){i.disabled=!0,i.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';try{const o=await Ce.signup(a,n,r);_e({token:o.data.token,user:o.data.user}),k("/dashboard")}catch(o){w(o.message||"Signup failed"),i.disabled=!1,i.innerHTML="Create Account"}}})}const xe={initiative:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",grievance:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",park:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",passport:"M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",charter:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",employment:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",volunteer:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",legacy:"M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",feedback:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",survey:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",default:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},Xe={"🌱":"initiative","🚨":"grievance","⚠️":"grievance","🪪":"passport","📜":"charter","💼":"employment","🤝":"volunteer","🏛️":"legacy","🏛":"legacy","💬":"feedback","📢":"feedback","📊":"survey","📋":"survey","🌳":"park","🏞️":"park","🏞":"park","🏗️":"legacy","🏗":"legacy","🛡️":"charter","🛡":"charter","⚡":"default","⚡️":"default"};function D(e,t=20,i=""){const a=Xe[e]||e,n=xe[a]||xe.default;return`<svg width="${t}" height="${t}" class="${i}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${n}"/></svg>`}const xt={Movement:{title:"Start a Civic Initiative",shortTitle:"Civic Initiative",description:"Organize citizens around community goals, public spaces, and urban projects.",category:"Community Action",iconKey:"initiative",actionLabel:"Start Initiative"},Grievance:{title:"Report a Civic Problem",shortTitle:"Civic Problem",description:"Report infrastructure defects, sanitation issues, or public safety concerns.",category:"Public Services",iconKey:"grievance",actionLabel:"Report Issue"},"Park Renovation Request":{title:"Park Renovation Request",shortTitle:"Park Renovation",description:"Propose public park upgrades, playground repairs, or green space restoration.",category:"Urban Infrastructure",iconKey:"park",actionLabel:"Request Renovation"},"Citizen Passport":{title:"Citizen Passport & Contribution",shortTitle:"Citizen Passport",description:"Track community contributions, volunteer hours, and civic engagement history.",category:"Civic Identity",iconKey:"passport",actionLabel:"Update Passport"},"Digital Civic Constitution":{title:"Civic Charter & Guidelines",shortTitle:"Civic Charter",description:"Establish community guidelines, governance rules, and transparency terms.",category:"Governance",iconKey:"charter",actionLabel:"Draft Charter"},"Employment Exchange":{title:"Civic Skills & Employment",shortTitle:"Employment Exchange",description:"Post and discover civic project roles, community jobs, and skill opportunities.",category:"Opportunity",iconKey:"employment",actionLabel:"Post Role"},"Volunteer Management":{title:"Volunteer Operations",shortTitle:"Volunteer Drive",description:"Coordinate volunteer tasks, register community helpers, and track activities.",category:"Community Action",iconKey:"volunteer",actionLabel:"Register Volunteer"},"Legacy & Continuity":{title:"Project Continuity & Legacy",shortTitle:"Project Continuity",description:"Transition completed initiatives into permanent NGOs, startups, or civic centers.",category:"Governance",iconKey:"legacy",actionLabel:"Plan Continuity"},"Public Feedback":{title:"Public Feedback",shortTitle:"Public Feedback",description:"Collect structured community feedback on civic initiatives and public services.",category:"Civic Operations",iconKey:"feedback",actionLabel:"Submit Feedback"},"Public Survey":{title:"Public Survey",shortTitle:"Public Survey",description:"Run community surveys and opinion polls for civic decision-making.",category:"Civic Operations",iconKey:"survey",actionLabel:"Start Survey"}};function H(e){var n;if(!e)return{title:"Civic Capability",shortTitle:"Capability",description:"Metadata-driven civic module.",category:"Civic Operations",iconKey:"default",icon:D("default",16),iconLarge:D("default",24),actionLabel:"Start Action"};const t=e.name||"",i=xt[t];if(i)return{title:i.title,shortTitle:i.shortTitle,description:e.description||i.description,category:i.category,iconKey:i.iconKey,icon:D(i.iconKey,16),iconLarge:D(i.iconKey,24),actionLabel:i.actionLabel,rawName:t};const a=e.icon&&Xe[e.icon]||(e.icon&&xe[e.icon]?e.icon:null)||"default";return{title:t,shortTitle:t,description:e.description||"Metadata-configured civic capability module.",category:((n=e.domain)==null?void 0:n.domain_name)||"Civic Operations",iconKey:a,icon:D(a,16),iconLarge:D(a,24),actionLabel:`Start ${t}`,rawName:t}}function G(e){if(!e)return"Unknown";switch(e.toLowerCase()){case"draft":return"Draft (Unsubmitted)";case"submitted":return"Submitted (Awaiting Review)";case"coordinator_approved":return"Verified (Pending Approval)";case"verified":return"Verified";case"approved":return"Approved & Active";case"rejected":return"Rejected";case"closed":return"Closed";default:return e.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}}function B(e,t="",i=[]){const a=Z(),n=We();if(!a)return e;const r=window.location.pathname,o=window.location.search;let s=[],l="CIVIC CAPABILITIES";n==="citizen"?s=[{path:"/dashboard",label:"My Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"My Requests",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/modules",label:"Civic Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/reports",label:"Community Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}]:n==="coordinator_area"||n==="coordinator_general"?(s=[{path:"/dashboard",label:"Operations Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"Cases Queue",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],l="ACTIVE CAPABILITIES"):n==="director"?(s=[{path:"/dashboard",label:"Governance Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"All Operations",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/module-builder",label:"Capability Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],l="ACTIVE CAPABILITIES"):(s=[{path:"/dashboard",label:"Civic OS Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/modules",label:"Modules & Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/module-builder",label:"No-Code Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/entities",label:"All Cases & Records",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},{path:"/admin",label:"User & Role Admin",icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"}],l="CAPABILITY METADATA");const c=g=>g.map(p=>`
    <li class="sidebar-nav-item">
      <a href="${p.path}" class="sidebar-nav-link ${r===p.path&&!o?"active":""}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p.icon}"></path></svg>
        ${j(p.label)}
      </a>
    </li>
  `).join("");let m="";Array.isArray(i)&&i.length>0&&(m=i.map(g=>{var C;const p=H(g),v=`/entities?entity_type_id=${g.entity_type_id}`,$=o.includes(`entity_type_id=${g.entity_type_id}`);return`
        <li class="sidebar-nav-item">
          <a href="${v}" class="sidebar-nav-link ${$?"active":""}" style="font-size:13px; padding:6px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${D(p.iconKey,16)}
            </span>
            <span class="truncate" style="flex:1;">${j(p.shortTitle)}</span>
            ${((C=g._count)==null?void 0:C.entities)!==void 0?`<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${g._count.entities}</span>`:""}
          </a>
        </li>
      `}).join(""));const u=n==="coordinator_area"&&a.assignedArea?`${ie(n)} • ${a.assignedArea}`:ie(n);return`
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>
        
        <div class="sidebar-section">
          <div class="sidebar-group-title">NAVIGATION</div>
          <ul class="sidebar-nav">
            ${c(s)}
          </ul>
        </div>

        ${m?`
          <div class="sidebar-section mt-4">
            <div class="sidebar-group-title">${l}</div>
            <ul class="sidebar-nav">
              ${m}
            </ul>
          </div>
        `:""}
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-card" style="cursor:pointer;">
            <div class="user-avatar">${j(a.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${j(a.name)}</div>
              <div class="user-role truncate" title="${j(u)}">${j(u)}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <div style="display:flex; align-items:center; gap:var(--space-3);">
            <button id="mobile-menu-btn" class="btn btn-ghost" style="padding:6px; display:none;" aria-label="Toggle sidebar menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div style="display:flex; align-items:center; gap:var(--space-2); font-size:0.875rem;">
              <a href="/dashboard" style="color:var(--text-muted); text-decoration:none;">Civic OS</a>
              <span style="color:var(--gray-300);">/</span>
              <span style="font-weight:600; color:var(--text-primary);">${j(t)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${j(a.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary);">${j(a.name.split(" ")[0])}</span>
                  <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${j(ie(n))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${j(a.name)}</div>
                  <div class="user-dropdown-role">${j(ie(n))}</div>
                </div>
                <a href="/profile" class="user-dropdown-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Profile & Security
                </a>
                <a href="/reports" class="user-dropdown-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Reports
                </a>
                <button type="button" class="user-dropdown-item danger" id="dropdown-logout-btn">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div class="page-content" id="page-content">
          ${e}
        </div>
      </main>
    </div>
  `}function z(){lt().catch(()=>{});const e=document.getElementById("topbar-user-btn"),t=document.getElementById("user-dropdown-menu");e&&t&&(e.addEventListener("click",o=>{o.stopPropagation(),t.classList.toggle("show")}),document.addEventListener("click",o=>{!t.contains(o.target)&&!e.contains(o.target)&&t.classList.remove("show")}));const i=document.getElementById("dropdown-logout-btn");i&&i.addEventListener("click",o=>{o.preventDefault(),Ue(),k("/login")});const a=document.getElementById("sidebar-user-card");a&&a.addEventListener("click",()=>{k("/profile")});const n=document.getElementById("mobile-menu-btn"),r=document.getElementById("sidebar");n&&r&&n.addEventListener("click",()=>{r.classList.toggle("open")})}function j(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function P(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function ge(){if(!F(k))return;const e=Z(),t=document.getElementById("app");t.innerHTML=B(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Workspace"),z();try{const a=(await Ee.getMetadata().catch(()=>({success:!1,data:{entityTypes:[],rules:[],domains:[]}}))).data||{entityTypes:[],rules:[],domains:[]};let n="My Civic Workspace";e.role==="coordinator_area"||e.role==="coordinator_general"?n="Civic Operations Workspace":e.role==="director"?n="Executive Governance Workspace":e.role==="admin"&&(n="Civic OS Administration"),t.innerHTML=B(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${P(n)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Good day, <strong>${P(e.name)}</strong>. Here is what is happening in your civic workspace.
          </p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `,n,a.entityTypes),z();const r=document.getElementById("dash-content"),o=document.getElementById("dash-actions");e.role==="citizen"?(o.innerHTML=`
        <a href="/modules" class="btn btn-primary btn-lg" style="box-shadow:var(--shadow-md); display:inline-flex; align-items:center; gap:8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Start Civic Action
        </a>
      `,await wt(r,e,a)):e.role==="coordinator_area"?(o.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await kt(r,e,a)):e.role==="coordinator_general"?(o.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await $t(r,e,a)):e.role==="director"?(o.innerHTML='<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>',await _t(r,e,a)):e.role==="admin"&&(o.innerHTML=`
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `,await Ct(r,e,a))}catch{w("Failed to load workspace data"),document.getElementById("dash-content").innerHTML='<div class="alert alert-error">Failed to load workspace data. Please try again.</div>'}}async function wt(e,t,i){const n=(await _.list({owner_user_id:t.user_id,limit:20})).data||[],r=n.filter(u=>u.status==="draft").length,o=n.filter(u=>["submitted","coordinator_approved","in_review"].includes(u.status)).length,s=n.filter(u=>["approved","closed","rejected"].includes(u.status)).length,l=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${o}</div>
        <div class="kpi-label">Active Requests</div>
      </div>
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${r}</div>
        <div class="kpi-label">Draft Cases</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${s}</div>
        <div class="kpi-label">Completed</div>
      </div>
    </div>
  `,m=(i.entityTypes||[]).map(u=>{const g=H(u);return`
      <div class="card capability-card" style="padding:16px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:10px; background:rgba(255, 90, 54, 0.12); color:var(--primary); margin-bottom:10px;">
            ${D(g.iconKey,20)}
          </div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); margin-bottom:4px;">${P(g.title)}</div>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
            ${P(g.description)}
          </p>
        </div>
        <a href="/entities/new?entity_type_id=${u.entity_type_id}" class="btn btn-translucent-orange btn-sm" style="text-align:center;">
          ${P(g.actionLabel)} →
        </a>
      </div>
    `}).join("");e.innerHTML=`
    ${l}

    <!-- Recent Submissions & Activity -->
    <div class="card mb-6">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">My Recent Activity</div>
          <div class="card-subtitle">Track status progress for your submitted civic actions</div>
        </div>
        <a href="/entities" class="btn btn-link btn-sm">View All My Requests</a>
      </div>
      ${fe(n.slice(0,5))}
    </div>

    <!-- Available Civic Capabilities -->
    <div class="mb-6">
      <div style="font-weight:700; font-size:1.1rem; color:var(--text-primary); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span>Civic Capabilities</span>
        <a href="/modules" style="font-size:0.85rem; color:var(--primary); text-decoration:none;">View All Capabilities →</a>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px;">
        ${m||'<div class="text-muted p-4">No civic capabilities currently published.</div>'}
      </div>
    </div>
  `}async function kt(e,t,i){var o;const a=t.assignedArea,n=await _.list({status:"submitted",area:a,limit:10}),r=n.data||[];e.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${P(a||"Sector 5")}</div>
      <span class="badge badge-primary">Area Coordinator</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((o=n.pagination)==null?void 0:o.total)||r.length}</div>
        <div class="kpi-label">Pending Area Verification</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Submitted cases in ${P(a||"Sector 5")} awaiting verification</div>
        </div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${fe(r,!0)}
    </div>
  `}async function $t(e,t,i){var r;const a=await _.list({status:"submitted",area:"Unassigned",limit:10}),n=a.data||[];e.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (Handling Unassigned Areas & Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((r=a.pagination)==null?void 0:r.total)||n.length}</div>
        <div class="kpi-label">Unassigned Cases Awaiting Review</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Unassigned cases awaiting coordinator review</div>
        </div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${fe(n,!0)}
    </div>
  `}async function _t(e,t,i){var r;const a=await _.list({status:"coordinator_approved",limit:10}),n=a.data||[];e.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((r=a.pagination)==null?void 0:r.total)||n.length}</div>
        <div class="kpi-label">Pending Executive Approval</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Executive Approval Queue</div>
          <div class="card-subtitle">Coordinator-approved cases awaiting final executive sign-off</div>
        </div>
        <a href="/entities?status=coordinator_approved" class="btn btn-link btn-sm">View Full Queue</a>
      </div>
      ${fe(n,!0)}
    </div>
  `}async function Ct(e,t,i){var o,s,l;const[a,n,r]=await Promise.all([_.list({limit:1}),_.list({status:"submitted",limit:1}),_.list({status:"approved",limit:1})]);e.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${((o=a.pagination)==null?void 0:o.total)||0}</div>
        <div class="kpi-label">Total System Cases</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((s=n.pagination)==null?void 0:s.total)||0}</div>
        <div class="kpi-label">In Workflow</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${((l=r.pagination)==null?void 0:l.total)||0}</div>
        <div class="kpi-label">Approved & Active</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title">Civic OS Administration & Module Deployment</div>
      </div>
      <div class="card-body p-6">
        <p class="mb-4 text-secondary">
          As a Platform Administrator, you can deploy new civic capability modules via No-Code metadata generation, manage users, and review platform accountability logs.
        </p>
        <div class="flex gap-3">
          <a href="/module-builder" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            No-Code Module Builder
          </a>
          <a href="/admin" class="btn btn-secondary">User & Role Admin</a>
          <a href="/reports" class="btn btn-secondary">Governance Reports</a>
        </div>
      </div>
    </div>
  `}function fe(e,t=!1){if(!e||e.length===0)return`
      <div class="table-empty" style="padding:32px; text-align:center; color:var(--text-muted);">
        <p style="font-size:0.9rem; font-weight:500;">No active cases in this view.</p>
      </div>
    `;const i=e.map(a=>{var n,r;return`
    <tr>
      <td><a href="/entities/${a.entity_id}" class="text-link font-medium">#${a.entity_id}</a></td>
      <td>
        <a href="/entities/${a.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
          ${P(a.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${P(((n=a.entityType)==null?void 0:n.name)||"Capability")}</span></td>
      ${t?`<td>${P(((r=a.owner)==null?void 0:r.name)||"System")}</td>`:""}
      <td>${P(a.area||"—")}</td>
      <td><span class="badge badge-${a.status}">${G(a.status)}</span></td>
      <td><a href="/entities/${a.entity_id}" class="btn btn-secondary btn-sm">Review →</a></td>
    </tr>
  `}).join("");return`
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case / Request Title</th>
            <th>Capability Type</th>
            ${t?"<th>Submitted By</th>":""}
            <th>Area</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${i}
        </tbody>
      </table>
    </div>
  `}function O(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let x={page:1,limit:20},te=[];async function Et(e={},t=null){if(!F(k))return;const i=t||new URLSearchParams(window.location.search);i.has("status")?x.status=i.get("status"):delete x.status,i.has("entity_type_id")?x.entity_type_id=i.get("entity_type_id"):delete x.entity_type_id,i.has("name")?x.name=i.get("name"):delete x.name,i.has("page")?x.page=Number(i.get("page")):x.page=1;try{te=(await _.listTypes().catch(()=>({data:[]}))).data||[]}catch{te=[]}const a=te.find(m=>String(m.entity_type_id)===String(x.entity_type_id)),n=H(a),r=a?`${n.title} Cases`:"All Cases & Requests",o=a?`Browsing cases for capability "${n.title}".`:"Browse, search, and track all civic cases and requests across your workspace.",s=document.getElementById("app");s.innerHTML=B(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${O(r)}</h1>
        <p id="entities-header-subtitle">${O(o)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${x.entity_type_id?`?entity_type_id=${x.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Start Civic Action
        </a>
      </div>
    </div>
    
    <div class="card mb-6" style="padding: 16px 20px;">
      <div class="filters-bar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; width:100%;">
        <!-- Search Box -->
        <div style="flex: 2; min-width: 240px; position: relative;">
          <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${O(x.name||"")}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${te.map(m=>{const u=H(m);return`<option value="${m.entity_type_id}" ${String(x.entity_type_id)===String(m.entity_type_id)?"selected":""}>${O(u.title)}</option>`}).join("")}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${x.status==="draft"?"selected":""}>Draft</option>
            <option value="submitted" ${x.status==="submitted"?"selected":""}>Submitted</option>
            <option value="coordinator_approved" ${x.status==="coordinator_approved"?"selected":""}>Verified (Pending Approval)</option>
            <option value="approved" ${x.status==="approved"?"selected":""}>Approved & Active</option>
            <option value="rejected" ${x.status==="rejected"?"selected":""}>Rejected</option>
            <option value="closed" ${x.status==="closed"?"selected":""}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${x.status||x.entity_type_id||x.name?`
            <button id="btn-clear-filter" class="btn btn-secondary" style="height: 42px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Reset
            </button>
          `:""}
        </div>
      </div>
    </div>
    
    <div id="entities-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,r,te),z();const l=()=>{const m=document.getElementById("filter-status").value,u=document.getElementById("filter-type").value,g=document.getElementById("filter-search").value.trim(),p=new URLSearchParams;m&&p.set("status",m),u&&p.set("entity_type_id",u),g&&p.set("name",g),k(`/entities${p.toString()?"?"+p.toString():""}`)};document.getElementById("btn-filter").addEventListener("click",l),document.getElementById("filter-search").addEventListener("keypress",m=>{m.key==="Enter"&&l()});const c=document.getElementById("btn-clear-filter");c&&c.addEventListener("click",()=>{k("/entities")}),await St()}async function St(){const e=document.getElementById("entities-content");if(e)try{const t=await _.list(x),{data:i,pagination:a}=t;if(!i||i.length===0){e.innerHTML=`
        <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No cases found</h3>
          <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto 20px;">
            No civic cases match your filter. Try adjusting your query or starting a new civic action.
          </p>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="/entities" class="btn btn-secondary">Clear Filters</a>
            <a href="/entities/new${x.entity_type_id?`?entity_type_id=${x.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;return}const n=i.map(c=>{var u;const m=H(c.entityType);return`
        <tr>
          <td><a href="/entities/${c.entity_id}" class="text-link font-medium">#PR-${String(c.entity_id).padStart(5,"0")}</a></td>
          <td>
            <a href="/entities/${c.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${O(c.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${O(m.shortTitle)}</span></td>
          <td>${O(((u=c.owner)==null?void 0:u.name)||"System")}</td>
          <td>${O(c.area||"—")}</td>
          <td><span class="badge badge-${c.status}">${G(c.status)}</span></td>
          <td>
            <a href="/entities/${c.entity_id}" class="btn btn-secondary btn-sm">Review Case →</a>
          </td>
        </tr>
      `}).join(""),r=Math.ceil(a.total/a.limit);let o="";r>1&&(o=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 8px;">
          <div style="font-size:0.85rem; color:var(--text-muted);">
            Showing page ${a.page} of ${r} (${a.total} total cases)
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-prev" ${a.page<=1?"disabled":""}>← Previous</button>
            <button class="btn btn-secondary btn-sm" id="btn-next" ${a.page>=r?"disabled":""}>Next →</button>
          </div>
        </div>
      `),e.innerHTML=`
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Capability Type</th>
                <th>Submitted By</th>
                <th>Area / Jurisdiction</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${n}
            </tbody>
          </table>
        </div>
      </div>
      ${o}
    `;const s=document.getElementById("btn-prev"),l=document.getElementById("btn-next");s&&s.addEventListener("click",()=>{const c=new URLSearchParams(window.location.search);c.set("page",String(x.page-1)),k(`/entities?${c.toString()}`)}),l&&l.addEventListener("click",()=>{const c=new URLSearchParams(window.location.search);c.set("page",String(x.page+1)),k(`/entities?${c.toString()}`)})}catch{w("Failed to load cases"),e.innerHTML='<div class="alert alert-error">Error loading cases. Please try again.</div>'}}let ce=null;function we({title:e,content:t,footer:i="",onClose:a=()=>{}}){X();const n=document.getElementById("modal-container"),r=`
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${Mt(e)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${t}
      </div>
      ${i?`<div class="modal-footer">${i}</div>`:""}
    </div>
  `;n.innerHTML=r,n.style.pointerEvents="auto";const o=()=>{n.innerHTML="",n.style.pointerEvents="none",ce=null,a()};ce=o,document.getElementById("modal-close-btn").addEventListener("click",o),document.getElementById("modal-backdrop").addEventListener("click",o);const s=l=>{l.key==="Escape"&&(o(),document.removeEventListener("keydown",s))};document.addEventListener("keydown",s)}function X(){ce&&ce()}function Mt(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function h(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Se({id:e}){const t=String(e||"").split("?")[0].split("#")[0];if(!t||t==="new"){k("/entities/new"+(window.location.search||""));return}if(!F(k))return;const i=Z(),a=document.getElementById("app");a.innerHTML=B(`
    <div class="page-header mb-4">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">My Requests</a> / Case #${t}</div>
        <h1 id="header-title">Loading Case...</h1>
      </div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,`Case #${t}`),z();try{const[n,r,o,s,l]=await Promise.all([_.get(t),Ye.list(t).catch(()=>({data:[]})),_.audit(t).catch(()=>({data:{auditLogs:[],approvalHistory:[]}})),_.getLineage(t).catch(()=>({data:{current:null,parent:null,children:[],rules:[]}})),_.workflow(t).catch(()=>({data:{allowedTransitions:[]}}))]),c=n.data,m=r.data||[],u=o.data||{auditLogs:[],approvalHistory:[]},g=s.data||{current:null,parent:null,children:[],rules:[]},p=l.data||{allowedTransitions:[]};let v=[];try{v=(await ve.list({entity_type_id:c.entity_type_id})).data||[]}catch{v=[]}document.getElementById("header-title").textContent=c.name,Lt(document.getElementById("detail-content"),c,m,u,g,p,v,i)}catch(n){console.error("Failed to load case detail:",n),w("Failed to load case details"),document.getElementById("detail-content").innerHTML=`<div class="alert alert-error">Failed to load case #${t}. It may not exist.</div>`}}function Lt(e,t,i,a,n,r,o,s){var je,Be;const l=H(t.entityType),c=["draft","submitted","coordinator_approved","approved"],m=c.indexOf(t.status)!==-1?c.indexOf(t.status):-1,u=t.status==="rejected";let g='<div class="workflow-steps mt-4 mb-2">';c.forEach((y,I)=>{const ee=I<m||I===m&&!u&&t.status==="approved",it=I===m&&t.status!=="approved";g+=`
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${u&&I===m?"rejected":ee?"done":it?"current":""}">${I+1}</div>
          <div class="workflow-step-label mt-1">${jt(y)}</div>
        </div>
        ${I<c.length-1?`<div class="workflow-step-connector ${ee?"done":""}"></div>`:""}
      </div>
    `}),u&&(g+=`
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `),g+="</div>";const p=At(t,r.allowedTransitions||[],s),v=s&&["coordinator_area","coordinator_general","director","admin"].includes(s.role);let $="";v&&t.status!=="deleted"&&($=`
      <div class="card mb-6" id="ai-report-card" style="border: 1px solid var(--primary-border); background: #f8fafc;">
        <div class="card-header" style="background: var(--surface); display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:flex; align-items:center; color:var(--primary);">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </span>
            <div>
              <h3 class="card-title" style="color: var(--text-primary); margin:0;">Civic Intelligence Analysis</h3>
              <span style="font-size: 12px; color: var(--text-muted);">AI-Assisted Decision Layer</span>
            </div>
          </div>
          <span class="badge badge-primary" style="font-weight:600;">Executive Analysis</span>
        </div>
        <div class="card-body" id="ai-report-body" style="padding: 1.25rem;">
          <div style="text-align:center; padding: 1rem 0;">
            <p style="color:var(--text-secondary); margin-bottom:1.25rem; font-size:14px; max-width:600px; margin-left:auto; margin-right:auto;">
              Run an automated AI analytical breakdown of this case to inspect observations, patterns, recommendations, and evidence.
            </p>
            <button id="btn-generate-ai" class="btn btn-primary" style="padding:10px 22px; font-weight:600; box-shadow:var(--shadow-sm); display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Run Civic Intelligence Analysis
            </button>
          </div>
        </div>
      </div>
    `);let C="";n.children&&n.children.length>0&&(C=`
      <div class="card mb-6" style="border-top:4px solid var(--green-600); background:#f0fdf4; border-color:#bbf7d0;">
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <div style="display:flex; align-items:center; padding-top:2px; color:#16a34a;">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div style="flex:1;">
              <h4 style="font-size:1rem; font-weight:700; color:#166534; margin-bottom:4px;">
                Civic Automation Executed
              </h4>
              <p style="font-size:0.875rem; color:#15803d; margin-bottom:12px;">
                This case approval automatically triggered <strong>${n.children.length} related civic record(s)</strong> via configured metadata automation rules.
              </p>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${n.children.map(y=>`
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(y.entity_id).padStart(5,"0")} ${h(y.name)}</strong>
                      <span class="badge badge-secondary ml-2">${h(y.type_name)}</span>
                    </div>
                    <a href="/entities/${y.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);const N=i.map(y=>{var I,ee;return`
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${h(((I=y.parameterMaster)==null?void 0:I.label)||((ee=y.parameterMaster)==null?void 0:ee.field_key)||`Parameter #${y.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${h(y.value||"—")}</td>
    </tr>
  `}).join(""),S=i.length>0?`<div class="table-container"><table class="table"><tbody>${N}</tbody></table></div>`:'<div class="text-muted p-4">No custom parameter values submitted for this case.</div>',Me=a.auditLogs||[];a.approvalHistory;const et=Me.map(y=>`
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${h(y.user||"System")}</strong> (${h(y.role||"User")})</span>
        <span>${new Date(y.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${y.action==="status_transition"?`Status Transition: <strong>${G(y.old_status)}</strong> → <strong>${G(y.new_status)}</strong>`:`Action Executed: <strong>${y.action}</strong>`}
      </div>
      ${y.reason?`<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${h(y.reason)}"</div>`:""}
    </div>
  `).join(""),tt=Me.length>0?`<div>${et}</div>`:'<div class="text-muted p-4">No audit logs recorded yet for this case.</div>';let Le="";o.length>0&&(Le=`
      <div class="card mb-6" style="border-top:3px solid var(--green-600);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Civic Reports
          </div>
          <span class="badge badge-success">${o.length} Reports</span>
        </div>
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${o.map(y=>`
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${y.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${h(y.report_name)}"
              </button>
            `).join("")}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `);let Ae="";(n.parent||n.children&&n.children.length>0)&&(Ae=`
      <div class="card mb-6" style="border-top:3px solid var(--primary);">
        <div class="card-header">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Civic Lineage
          </div>
          <div class="card-subtitle">Connected parent and auto-created child civic activities</div>
        </div>
        <div class="card-body" style="padding:16px;">
          ${n.parent?`
            <div style="margin-bottom:12px; padding:12px; background:var(--primary-light); border:1px solid var(--primary-border); border-radius:6px; font-size:13px;">
              <div style="font-size:0.75rem; color:var(--primary); font-weight:700; text-transform:uppercase; margin-bottom:2px;">Parent Case</div>
              <a href="/entities/${n.parent.entity_id}" class="text-link font-medium">#PR-${String(n.parent.entity_id).padStart(5,"0")} ${h(n.parent.name)} (${h(((je=n.parent.entityType)==null?void 0:je.name)||"Capability")})</a>
            </div>
          `:""}
          ${n.children&&n.children.length>0?`
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${n.children.map(y=>`
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${y.entity_id}" class="text-link font-medium">#PR-${String(y.entity_id).padStart(5,"0")} ${h(y.name)}</a>
                    <span class="badge badge-secondary ml-2">${h(y.type_name)}</span>
                  </div>
                  <span class="badge badge-${y.status}">${G(y.status)}</span>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      </div>
    `),e.innerHTML=`
    <!-- Top Case Summary Card -->
    <div class="card mb-6">
      <div class="card-body" style="padding: 1.5rem;">
        <div class="flex justify-between items-start flex-wrap gap-4 mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-primary font-semibold">${h(l.title)}</span>
              <span class="badge badge-${t.status}">${G(t.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${h(t.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${h(((Be=t.owner)==null?void 0:Be.name)||"System")}</strong> • Jurisdiction Area: <strong>${h(t.area||"—")}</strong> • Location: <strong>${h(t.location||"—")}</strong>
            </div>
          </div>
        </div>
        ${g}
      </div>
    </div>

    ${C}
    ${$}
    ${Le}
    ${Ae}

    <!-- Main Detail & Actions Layout -->
    <div class="entity-detail-layout" style="display:grid; grid-template-columns: 2fr 1fr; gap: 20px;">
      <div>
        <div class="card">
          <div class="card-header border-b">
            <div class="tabs">
              <button class="tab-btn active" id="tab-info">Case Details & Parameters</button>
              <button class="tab-btn" id="tab-audit">Activity & Accountability Log</button>
            </div>
          </div>
          <div class="card-body" id="tab-content">
            ${S}
          </div>
        </div>
      </div>

      <div>
        <!-- Dynamic Workflow Actions Box -->
        <div class="card" style="border-top: 4px solid var(--primary);">
          <div class="card-header">
            <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Available Actions
          </div>
            <div class="card-subtitle">Role-permitted workflow actions</div>
          </div>
          <div class="card-body" style="padding:16px;">
            <div class="workflow-actions flex-col gap-2">
              ${p}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const re=document.getElementById("tab-info"),oe=document.getElementById("tab-audit"),he=document.getElementById("tab-content");re&&oe&&he&&(re.addEventListener("click",()=>{re.classList.add("active"),oe.classList.remove("active"),he.innerHTML=S}),oe.addEventListener("click",()=>{oe.classList.add("active"),re.classList.remove("active"),he.innerHTML=tt}));const Te=document.getElementById("btn-generate-ai");Te&&Te.addEventListener("click",()=>Rt(t,i)),document.querySelectorAll(".execute-rep-btn").forEach(y=>{y.addEventListener("click",()=>{const I=y.getAttribute("data-repid");It(I)})}),Bt(t.entity_id)}function At(e,t,i){const a=[],n=String(e.status||"draft").trim().toLowerCase(),r=new Set;if(Array.isArray(t)&&t.length>0&&t.forEach(o=>{const s=o.action||o.to||o.to_status;if(!s||r.has(s))return;r.add(s);const l=s==="rejected",c=Tt(n,s),m=l?"btn-danger":"btn-primary";a.push(`
        <button class="btn ${m} btn-full wf-action-btn mt-2" 
          data-to="${h(s)}" 
          data-label="${h(c)}"
          data-reason="${l?"true":"false"}">
          ${h(c)}
        </button>
      `)}),i&&i.role==="admin"&&a.push(`
      <button class="btn btn-secondary btn-full mt-3" id="btn-fire-rules" data-rule="true" style="display:inline-flex; align-items:center; gap:8px; justify-content:center;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Execute Automation Rules
      </button>
    `),a.length===0){if(i&&i.role==="coordinator_area"){const o=i.assignedArea||i.assigned_area,s=e.area;if(o&&s&&o.toLowerCase()!==s.toLowerCase())return`
          <div style="padding:14px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:13px; color:#9a3412; line-height:1.4;">
            <div style="font-weight:700; color:#c2410c; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Jurisdiction Boundary Constraint
            </div>
            Your coordinator account is assigned to <strong>"${h(o)}"</strong>, but this case belongs to <strong>"${h(s)}"</strong>.
            <div style="margin-top:8px; font-size:12px; color:#7c2d12;">
              Area Coordinators are strictly authorized to verify cases within their own jurisdiction. Only a Coordinator assigned to <strong>${h(s)}</strong> (or a General Coordinator) can verify this case.
            </div>
          </div>
        `}return`<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${h((i==null?void 0:i.role)||"user")}) at status "${h(G(n))}".</div>`}return a.join("")}function Tt(e,t){const i=String(t||"").toLowerCase(),a=String(e||"").toLowerCase();return a==="draft"&&i==="submitted"?"Submit Request":a==="submitted"&&(i==="coordinator_approved"||i==="verified")?"Verify & Recommend Approval":a==="coordinator_approved"&&i==="approved"||a==="verified"&&i==="approved"?"Executive Approval (Director)":i==="rejected"?"Reject Request":`Transition to ${t}`}function jt(e){return e==="draft"?"Draft":e==="submitted"?"Submitted":e==="coordinator_approved"?"Coord Approved":e==="verified"?"Verified":e==="approved"?"Approved":e==="rejected"?"Rejected":e}function Bt(e){const t=a=>{const n=a.getAttribute("data-to"),r=a.getAttribute("data-label")||`Transition to ${n}`,o=a.getAttribute("data-reason")==="true";if(a.getAttribute("data-rule")==="true"){zt(e);return}o?(we({title:"Provide Reason for Rejection",content:`
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",X),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{const l=document.getElementById("action-reason").value.trim();if(!l){w("Reason is required for rejection");return}X(),Re(e,n,l)})):(we({title:`Confirm Action: ${r}`,content:`
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${h(r)}</strong> for case #${e}?
          </p>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",X),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{X(),Re(e,n,null)}))};document.querySelectorAll(".wf-action-btn, #btn-fire-rules").forEach(a=>{a.addEventListener("click",()=>t(a))})}async function Re(e,t,i){try{const a=await _.transition(e,t,i);V(a.message||`Status updated to ${t}`),Se({id:e})}catch(a){w(a.message||"Transition failed")}}async function zt(e){var t,i;try{const a=await _.fireRules(e,"approved");V(`Rule Engine executed! ${((i=(t=a.data)==null?void 0:t.createdEntities)==null?void 0:i.length)||0} entity created.`),Se({id:e})}catch(a){w(a.message||"Rule trigger failed")}}async function It(e){const t=document.getElementById("report-result-output");if(t){t.style.display="block",t.innerHTML='<div class="spinner spinner-sm"></div> Running report...';try{const a=(await ve.execute(e)).data;let n=(a.rows||[]).map(r=>{var o;return`
      <tr>
        <td>${h(r[a.groupBy]||r.area||"Total")}</td>
        <td style="font-weight:bold;">${r[(o=a.metric)==null?void 0:o.toLowerCase()]||r.count||r.total_count||0}</td>
      </tr>
    `}).join("");t.innerHTML=`
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${h(a.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${h(a.groupBy||"Group")}</th><th>${h(a.metric)}</th></tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    `}catch(i){t.innerHTML=`<div class="alert alert-error">Report execution failed: ${h(i.message)}</div>`}}}async function Rt(e,t=[]){const i=e.entity_id,a=document.getElementById("ai-report-body");if(a){a.innerHTML=`
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:var(--primary); margin:0 auto 12px auto;"></div>
      <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Running Civic Intelligence Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Evaluating observations, patterns, recommendations, and evidence.</div>
    </div>
  `;try{const n=await _.aiAnalysis(i);V("Civic Intelligence Analysis generated successfully!"),a.innerHTML=Pe(n.data)}catch(n){if(String(n.message||"").includes("GEMINI_API_KEY")||String(n.message||"").includes("Gemini API key")){V("Generated Civic Decision Intelligence Preview from Case Parameters");const o=Pt(e,t);a.innerHTML=Pe(o)}else w(n.message||"Could not generate AI report"),a.innerHTML=`<div class="alert alert-error">AI Analysis failed: ${h(n.message)}</div>`}}}function Pt(e,t=[]){var s;const i={};if(Array.isArray(t))for(const l of t){const c=((s=l.parameterMaster)==null?void 0:s.field_key)||`param_${l.parameter_id}`;i[c]=l.value}const a=i.problem_need||i.description||e.name||"Civic improvement proposal",n=i.proposed_solution||"Community coordination and departmental municipal intervention",r=i.urgency||"Normal",o=e.area||"Ward / Area Jurisdiction";return{problem_summary:`The initiative "${e.name}" in ${o} highlights a local priority: "${a}". The citizen proposes "${n}".`,root_cause_analysis:[`Localized civic and infrastructure upkeep requirement in ${o}.`,"Gap between standard municipal routine maintenance and citizen-level expectations.","Absence of structured community-departmental participatory coordination."],stakeholder_analysis:[{group:`Residents & Citizens of ${o}`,interest:"Timely resolution, cleaner living environment, and reliable public amenities."},{group:"Area Coordinator & Field Inspectors",interest:"On-site verification of scope, resource estimation, and jurisdiction validation."},{group:"Competent Department (Works / Sanitation)",interest:"Feasibility check, alignment with ward budget, and task execution."}],risk_register:[{risk:`Delays in site inspection may exacerbate citizen grievances in ${o}`,severity:r==="Urgent"||r==="Critical"?"High":"Medium"},{risk:"Potential overlap with scheduled municipal ward maintenance works",severity:"Low"},{risk:"Incomplete initial citizen documentation requiring field verification",severity:"Low"}],recommendation:[`Area Coordinator should verify the physical site in ${o} and confirm exact requirements.`,"Coordinate with the relevant zonal engineering / sanitation unit to assess resource requirements.","If verified, transition case status to 'coordinator_approved' to forward for Executive Director sanction."],notice:"Live GEMINI_API_KEY is not configured in backend/.env. This structured decision analysis was synthesized by the CIVIC-KALKI Governance Intelligence Engine using case parameters."}}function Pe(e){const t=Array.isArray(e.recommendation)?e.recommendation:Array.isArray(e.actionable_recommendations)?e.actionable_recommendations:[e.recommendation||e.actionable_recommendations||"Proceed with field verification."],i=Array.isArray(e.root_cause_analysis)?e.root_cause_analysis:[e.root_cause_analysis||"No root cause factors recorded."],a=Array.isArray(e.stakeholder_analysis)?e.stakeholder_analysis:[],n=Array.isArray(e.risk_register)?e.risk_register:[];return`
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      ${e.notice?`
        <div style="margin-bottom:12px; padding:10px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:12px; color:#1e40af; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Notice:</strong> ${h(e.notice)}</div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">1. Observations & Problem Scope</strong>
        <p style="margin:0; color:var(--text-secondary);">${h(e.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">2. Patterns & Root Cause Analysis</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${i.map(r=>`<li style="margin-bottom:4px;">${h(r)}</li>`).join("")}
        </ul>
      </div>

      ${a.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">3. Stakeholder Impact Analysis</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${a.map(r=>`
              <div style="font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                <strong style="color:var(--text-primary);">${h(r.group||"Stakeholder")}:</strong>
                <span style="color:var(--text-secondary); margin-left:4px;">${h(r.interest||"")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      ${n.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">4. Risk Register & Feasibility</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${n.map(r=>{const o=String(r.severity||"Medium").toLowerCase(),s=o==="high"?"background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;":o==="low"?"background:#dcfce7; color:#15803d; border:1px solid #86efac;":"background:#fef3c7; color:#b45309; border:1px solid #fcd34d;";return`
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                  <span style="color:var(--text-primary);">${h(r.risk||"")}</span>
                  <span style="padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px; ${s}">${h(r.severity||"Medium")}</span>
                </div>
              `}).join("")}
          </div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">5. Recommendations for Coordinator / Executive Action</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${t.map(r=>`<li style="margin-bottom:4px;">${h(r)}</li>`).join("")}
        </ul>
      </div>

      <div style="padding:10px 12px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700); display:flex; align-items:center; gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Civic Intelligence Protocol:</strong> This automated advisory report is generated to assist municipal coordinators and directors. Ground evidence and field verification must precede final sanction.</span>
      </div>
    </div>
  `}const J=[{type:"country",label:"Country"},{type:"state",label:"State / Province"},{type:"city",label:"City / District"},{type:"ward",label:"Ward / Local Area"}];function ae(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Ht(e,t){if(!t)return ae(e);const i=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return ae(e).replace(i,'<strong style="color:var(--primary,#ff5a36);">$1</strong>')}class Nt{constructor(t,i={}){this._container=t,this._required=i.required||!1,this._onChange=i.onChange||null,this._prefix=i.labelPrefix||"jsel",this._levelStates=[],this._hiddenInput=null,this._destroyed=!1,this._onDocumentClick=this._handleDocumentClick.bind(this),document.addEventListener("click",this._onDocumentClick)}async init(){this._render(),await this._loadLevel(0,null)}getValue(){const t=this._levelStates.map(a=>a.selectedItem).filter(Boolean);return t.length===0?null:{jurisdiction_id:t[t.length-1].jurisdiction_id,display_path:t.map(a=>a.name).join(" › ")}}async setValue(t){if(t)try{const i=await de.get(t),{path:a}=i.data;if(!Array.isArray(a)||a.length===0)return;for(let r=0;r<a.length;r++){const o=r===0?null:a[r-1].jurisdiction_id;await this._loadLevel(r,o);const s=a[r],l=this._levelStates[r].items.find(c=>c.jurisdiction_id===s.jurisdiction_id)||s;this._setSelection(r,l,!1)}this._syncHidden(),this._notifyChange();const n=a.length;if(n<J.length){const r=a[a.length-1].jurisdiction_id;await this._loadLevel(n,r)}}catch(i){console.warn("[JurisdictionSelector] setValue failed:",i)}}destroy(){this._destroyed=!0,document.removeEventListener("click",this._onDocumentClick),this._container.innerHTML="",this._levelStates=[],this._hiddenInput=null}_render(){this._container.innerHTML="",this._container.classList.add("jurisdiction-selector");const t=document.createElement("div");t.className="jurisdiction-selector-grid",J.forEach((a,n)=>{const r=document.createElement("div");r.className="form-group jsel-group",r.id=`${this._prefix}-group-${n}`;const o=this._required&&n===0?'<span class="required">*</span>':"",s=document.createElement("label");s.className="form-label",s.innerHTML=`${ae(a.label)} ${o}`;const l=document.createElement("div");l.className="jsel-combobox",l.id=`${this._prefix}-combobox-${n}`;const c=document.createElement("div");c.className="jsel-trigger is-disabled",c.setAttribute("tabindex",n===0?"0":"-1"),c.setAttribute("role","combobox"),c.setAttribute("aria-expanded","false"),c.setAttribute("aria-label",a.label);const m=document.createElement("span");m.className="jsel-trigger-text is-placeholder",m.textContent=n===0?`-- Search or Select ${a.label} --`:`-- Select ${J[n-1].label} first --`;const u=document.createElement("div");u.className="jsel-trigger-actions";const g=document.createElement("button");g.type="button",g.className="jsel-clear-btn",g.title="Clear selection",g.style.display="none",g.innerHTML="&#x2715;";const p=document.createElement("span");p.className="jsel-chevron",p.innerHTML='<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',u.appendChild(g),u.appendChild(p),c.appendChild(m),c.appendChild(u);const v=document.createElement("div");v.className="jsel-dropdown";const $=document.createElement("div");$.className="jsel-search-wrapper",$.innerHTML=`
        <svg class="jsel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;const C=document.createElement("input");C.type="text",C.className="jsel-search-input",C.placeholder=`Search ${a.label}...`,C.setAttribute("autocomplete","off"),$.appendChild(C);const N=document.createElement("ul");N.className="jsel-options-list",N.setAttribute("role","listbox"),v.appendChild($),v.appendChild(N),l.appendChild(c),l.appendChild(v),r.appendChild(s),r.appendChild(l),t.appendChild(r),this._levelStates[n]={meta:a,groupEl:r,comboboxEl:l,triggerEl:c,triggerTextEl:m,clearBtnEl:g,dropdownEl:v,searchInputEl:C,optionsListEl:N,items:[],filteredItems:[],selectedItem:null,focusedIdx:-1,isOpen:!1,disabled:n!==0},c.addEventListener("click",S=>{S.target.closest(".jsel-clear-btn")||this._toggleDropdown(n)}),c.addEventListener("keydown",S=>{this._levelStates[n].disabled||(S.key==="Enter"||S.key===" "||S.key==="ArrowDown")&&(S.preventDefault(),this._openDropdown(n))}),g.addEventListener("click",S=>{S.stopPropagation(),this._clearSelection(n)}),C.addEventListener("input",S=>{this._filterOptions(n,S.target.value)}),C.addEventListener("keydown",S=>{this._handleSearchKeydown(n,S)})}),this._container.appendChild(t);const i=document.createElement("input");i.type="hidden",i.name="_jurisdiction_id",i.id=`${this._prefix}-hidden`,i.value="",this._container.appendChild(i),this._hiddenInput=i}async _loadLevel(t,i){if(this._destroyed)return;const a=this._levelStates[t];if(a){a.disabled=!0,a.triggerEl.classList.add("is-disabled"),a.triggerEl.setAttribute("tabindex","-1"),a.triggerTextEl.className="jsel-trigger-text is-placeholder",a.triggerTextEl.textContent=`Loading ${a.meta.label}…`,a.optionsListEl.innerHTML=`<li class="jsel-loading"><div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Loading ${a.meta.label}...</li>`;try{const n=i==null?{}:{parent_id:String(i)},o=(await de.list(n)).data||[];if(this._destroyed)return;if(a.items=o,a.filteredItems=o,o.length===0){a.disabled=!0,a.triggerEl.classList.add("is-disabled"),a.triggerEl.setAttribute("tabindex","-1"),a.triggerTextEl.textContent=`-- No ${a.meta.label} available --`,this._clearLevelsFrom(t+1);return}a.disabled=!1,a.triggerEl.classList.remove("is-disabled"),a.triggerEl.setAttribute("tabindex","0"),a.triggerTextEl.textContent=`-- Search or Select ${a.meta.label} --`,this._renderOptionsList(t,"")}catch(n){console.warn("[JurisdictionSelector] Failed to load level",t,n),a.disabled=!0,a.triggerEl.classList.add("is-disabled"),a.triggerTextEl.textContent=`-- Error loading ${a.meta.label} --`}}}_renderOptionsList(t,i){const a=this._levelStates[t],n=a.optionsListEl;n.innerHTML="",a.focusedIdx=-1;const r=(i||"").trim().toLowerCase();let o=a.items;if(r&&(o=a.items.filter(l=>l.name&&l.name.toLowerCase().includes(r)||l.code&&l.code.toLowerCase().includes(r))),a.filteredItems=o,o.length===0){n.innerHTML=`<li class="jsel-empty">No ${ae(a.meta.label)} found matching "${ae(i)}"</li>`;return}if(t===0&&!r){const l=a.items.find(c=>c.name==="India");if(l){const c=document.createElement("li");c.className="jsel-divider",c.textContent="★ Pinned / Quick Select",n.appendChild(c);const m=this._createOptionElement(t,l,r,0);n.appendChild(m);const u=document.createElement("li");u.className="jsel-divider",u.textContent=`All Countries (${a.items.length})`,n.appendChild(u)}}if(o.slice(0,150).forEach((l,c)=>{const m=this._createOptionElement(t,l,r,c);n.appendChild(m)}),o.length>150){const l=document.createElement("li");l.className="jsel-empty",l.style.fontSize="0.78rem",l.style.padding="8px",l.textContent=`Showing top 150 of ${o.length} matches — type to narrow down`,n.appendChild(l)}}_createOptionElement(t,i,a,n){const r=this._levelStates[t],o=r.selectedItem&&r.selectedItem.jurisdiction_id===i.jurisdiction_id,s=document.createElement("li");s.className=`jsel-option ${o?"is-selected":""}`,s.setAttribute("role","option"),s.setAttribute("aria-selected",o?"true":"false"),s.dataset.index=String(n);const l=document.createElement("span");if(l.innerHTML=Ht(i.name,a),s.appendChild(l),i.code){const c=document.createElement("span");c.className="jsel-option-badge",c.textContent=i.code,s.appendChild(c)}return s.addEventListener("click",c=>{c.stopPropagation(),this._selectItem(t,i)}),s}_toggleDropdown(t){const i=this._levelStates[t];i.disabled||(i.isOpen?this._closeDropdown(t):this._openDropdown(t))}_openDropdown(t){this._levelStates.forEach((a,n)=>{n!==t&&a.isOpen&&this._closeDropdown(n)});const i=this._levelStates[t];i.disabled||(i.isOpen=!0,i.comboboxEl.classList.add("is-open"),i.triggerEl.classList.add("is-active"),i.triggerEl.setAttribute("aria-expanded","true"),i.searchInputEl.value="",this._renderOptionsList(t,""),setTimeout(()=>{i.searchInputEl.focus()},50))}_closeDropdown(t){const i=this._levelStates[t];i.isOpen&&(i.isOpen=!1,i.comboboxEl.classList.remove("is-open"),i.triggerEl.classList.remove("is-active"),i.triggerEl.setAttribute("aria-expanded","false"))}_filterOptions(t,i){this._renderOptionsList(t,i)}_handleSearchKeydown(t,i){const a=this._levelStates[t],n=a.optionsListEl.querySelectorAll(".jsel-option");n.length!==0&&(i.key==="ArrowDown"?(i.preventDefault(),a.focusedIdx=Math.min(a.focusedIdx+1,n.length-1),this._updateFocus(n,a.focusedIdx)):i.key==="ArrowUp"?(i.preventDefault(),a.focusedIdx=Math.max(a.focusedIdx-1,0),this._updateFocus(n,a.focusedIdx)):i.key==="Enter"?(i.preventDefault(),a.focusedIdx>=0&&a.focusedIdx<n.length?n[a.focusedIdx].click():n.length>0&&n[0].click()):i.key==="Escape"&&(this._closeDropdown(t),a.triggerEl.focus()))}_updateFocus(t,i){t.forEach((a,n)=>{n===i?(a.classList.add("is-focused"),a.scrollIntoView({block:"nearest"})):a.classList.remove("is-focused")})}_selectItem(t,i){this._setSelection(t,i,!0),this._closeDropdown(t);const a=t+1;a<J.length&&this._loadLevel(a,i.jurisdiction_id)}_setSelection(t,i,a=!0){const n=this._levelStates[t];n.selectedItem=i,n.triggerTextEl.className="jsel-trigger-text",n.triggerTextEl.textContent=i.name,n.clearBtnEl.style.display="flex",a&&(this._clearLevelsFrom(t+1),this._syncHidden(),this._notifyChange())}_clearSelection(t){const i=this._levelStates[t];i.selectedItem=null,i.triggerTextEl.className="jsel-trigger-text is-placeholder",i.triggerTextEl.textContent=`-- Search or Select ${i.meta.label} --`,i.clearBtnEl.style.display="none",this._clearLevelsFrom(t+1),this._syncHidden(),this._notifyChange()}_clearLevelsFrom(t){for(let i=t;i<J.length;i++){const a=this._levelStates[i];a&&(a.selectedItem=null,a.disabled=!0,a.items=[],a.filteredItems=[],a.triggerEl.classList.add("is-disabled"),a.triggerEl.setAttribute("tabindex","-1"),a.triggerTextEl.className="jsel-trigger-text is-placeholder",a.triggerTextEl.textContent=`-- Select ${J[i-1].label} first --`,a.clearBtnEl.style.display="none",a.optionsListEl.innerHTML="",this._closeDropdown(i))}}_handleDocumentClick(t){this._destroyed||this._levelStates.forEach((i,a)=>{i.isOpen&&!i.comboboxEl.contains(t.target)&&this._closeDropdown(a)})}_syncHidden(){if(!this._hiddenInput)return;const t=this.getValue();this._hiddenInput.value=t?String(t.jurisdiction_id):""}_notifyChange(){const t=this.getValue();this._onChange&&this._onChange(t),this._container.dispatchEvent(new CustomEvent("jurisdiction:change",{bubbles:!0,detail:t}))}}const Dt="/api";function L(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let Q=null,R=null,q=[],Y=null,W=null;const Vt=new Set(["title","name","movement_title","area","jurisdiction","jurisdiction_id","location","landmark","reported_date","reported_on","contact_person","contact_phone","contact_email","priority_level","volunteer_coordinator"]);function Qe(e){const t=String(e.field_key||"").trim().toLowerCase();return Vt.has(t)}async function qt(e={},t=null){if(!F(k))return;try{q=(await _.listTypes().catch(()=>({data:[]}))).data||[]}catch{q=[]}const i=t||new URLSearchParams(window.location.search);i.has("entity_type_id")?R=Number(i.get("entity_type_id")):q.length>0&&(R=q[0].entity_type_id);const a=q.find(o=>Number(o.entity_type_id)===Number(R));Y=H(a);const n=document.getElementById("app");n.innerHTML=B(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${L(Y.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${q.map(o=>{const s=H(o);return`<option value="${o.entity_type_id}" ${Number(R)===Number(o.entity_type_id)?"selected":""}>${L(s.title)}</option>`}).join("")}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `,Y.title,q),z(),document.getElementById("entity-type-select").addEventListener("change",async o=>{const s=o.target.value;if(!s){document.getElementById("dynamic-form-container").innerHTML="",Q=null;return}R=Number(s);const l=q.find(c=>Number(c.entity_type_id)===Number(R));Y=H(l),document.getElementById("page-capability-title").textContent=Y.title,window.history.replaceState({},"",`/entities/new?entity_type_id=${R}`),await He(R)}),R&&await He(R)}async function He(e){W&&(W.destroy(),W=null);const t=document.getElementById("dynamic-form-container");t.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{Q=(await Ee.schema(e)).data,Ut(t,Q),await Ot()}catch(i){console.error("Form schema load error:",i),w("Failed to load form schema"),t.innerHTML='<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>'}}async function Ot(){const e=document.getElementById("jurisdiction-selector-mount");e&&(W=new Nt(e,{required:!0,labelPrefix:"ent-jsel"}),await W.init())}function Ft(e){var v;const t=e.mandatory||e.is_mandatory,i=t?"required":"",a=t?'<span class="required">*</span>':"",n=`param_${e.parameter_id}`,r=(e.field_type||e.data_type||"text").toLowerCase(),o=L(e.label||e.field_key),s=(v=e.options)==null?void 0:v.depends_on;let l="",c="",m="";s&&s.field_key&&(l=`data-depends-key="${L(s.field_key)}" data-depends-val="${L(s.value)}"`,c="conditional-field",m="display:none;");const g=["textarea","file"].includes(r)?"flex:1 1 100%; min-width:100%;":"flex:1 1 calc(50% - 8px); min-width:200px;";let p="";switch(r){case"textarea":p=`<textarea name="${n}" class="form-control" rows="3" ${i} placeholder="Enter ${o.toLowerCase()}..."></textarea>`;break;case"number":p=`<input type="number" name="${n}" class="form-control" ${i} placeholder="0">`;break;case"date":p=`<input type="date" name="${n}" class="form-control" ${i}>`;break;case"email":p=`<input type="email" name="${n}" class="form-control" ${i} placeholder="email@example.com">`;break;case"phone":p=`<input type="tel" name="${n}" class="form-control" ${i} placeholder="+91 XXXXX XXXXX">`;break;case"checkbox":p=`
        <div class="check-group mt-2">
          <input type="checkbox" name="${n}" id="${n}" value="true">
          <label for="${n}">Yes</label>
        </div>
      `;break;case"select":{const $=e.meta_options||(e.options?Array.isArray(e.options)?e.options:e.options.choices:null)||["Option 1","Option 2"],C=e.options&&e.options.default?e.options.default:"";p=`<select name="${n}" class="form-control" ${i}>
        <option value="">-- Select --</option>
        ${$.map(N=>`<option value="${L(N)}" ${N===C?"selected":""}>${L(N)}</option>`).join("")}
      </select>`;break}case"file":p=`
        <div class="file-upload-wrapper" id="file-wrap-${e.parameter_id}">
          <input type="file" name="${n}" id="file-${e.parameter_id}" 
            class="form-control file-input" 
            data-parameter-id="${e.parameter_id}"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.zip"
            ${i}>
          <div class="file-upload-info mt-1" style="font-size:0.75rem; color:var(--text-muted);">
            Max 10MB • PDF, Word, Excel, Images, CSV, ZIP
          </div>
          <div id="file-status-${e.parameter_id}" class="file-upload-status mt-1" style="display:none;"></div>
        </div>
      `;break;default:p=`<input type="text" name="${n}" class="form-control" ${i} placeholder="Enter ${o.toLowerCase()}...">`;break}return`<div class="form-group ${c}" ${l} style="${m} ${g}">
    <label class="form-label">${o} ${a}</label>
    ${p}
  </div>`}function Ut(e,t){if(!t||!t.sections||t.sections.length===0){e.innerHTML='<div class="alert alert-warning">This capability has no form fields configured yet.</div>';return}let i=`
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${L(Y.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(t.configuration_errors)&&t.configuration_errors.length>0?`<div class="alert alert-warning m-4">${L(t.configuration_errors.join(" "))}</div>`:""}

      <form id="dynamic-form" style="padding:24px;">
  `,a=!1,n=!1;t.sections.forEach((o,s)=>{const l=(o.section_name||o.title||"").trim(),c=s===0,m=l.toLowerCase().includes("where")||l.toLowerCase().includes("location");i+=`
      <div class="form-section mb-6" data-section-name="${L(l)}">
        <div class="form-section-title">${L(l)}</div>
        ${o.description?`<div class="form-section-subtitle">${L(o.description)}</div>`:""}
    `,c&&!a&&(i+=`
        <div class="form-row mt-4" style="display:flex; flex-wrap:wrap; gap:16px;">
          <div class="form-group" style="flex:1 1 100%; min-width:100%;">
            <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
            <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the initiative">
          </div>
        </div>
      `,a=!0),m&&!n&&(i+=`
        <div class="form-row mt-4" style="display:flex; flex-direction:column; gap:16px;">
          <div class="form-group" style="width:100%;">
            <label class="form-label">Jurisdiction <span class="required">*</span></label>
            <div id="jurisdiction-selector-mount"></div>
          </div>
          <div class="form-group" style="width:100%;">
            <label class="form-label" for="base_location">Specific Location / Address</label>
            <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or building/area (optional)">
          </div>
        </div>
      `,n=!0),(o.subsections||[]).forEach(u=>{u.subsection_name&&u.subsection_name!=="Main"&&(i+=`<div class="form-subsection mt-3"><div class="form-subsection-title">${L(u.subsection_name)}</div>`);const p=[...u.parameters||[]].sort((v,$)=>(v.display_order||0)-($.display_order||0)).filter(v=>!Qe(v)&&String(v.field_key||"").trim()&&String(v.label||"").trim());p.length>0&&(i+='<div class="form-row mt-3" style="display:flex; flex-wrap:wrap; gap:16px;">',p.forEach(v=>{i+=Ft(v)}),i+="</div>"),u.subsection_name&&u.subsection_name!=="Main"&&(i+="</div>")}),i+="</div>"}),n||(i+=`
      <div class="form-section mb-6" data-section-name="Where is it?">
        <div class="form-section-title">Where is it?</div>
        <div class="form-row mt-4" style="display:flex; flex-direction:column; gap:16px;">
          <div class="form-group" style="width:100%;">
            <label class="form-label">Jurisdiction <span class="required">*</span></label>
            <div id="jurisdiction-selector-mount"></div>
          </div>
          <div class="form-group" style="width:100%;">
            <label class="form-label" for="base_location">Specific Location / Address</label>
            <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or building/area (optional)">
          </div>
        </div>
      </div>
    `),i+=`
        <div class="form-section mt-6" style="border-bottom:none; margin-bottom:0; padding-bottom:0;">
          <div class="flex items-center justify-between">
            <div class="text-sm text-muted">Submissions enter the workflow for review by jurisdiction coordinators.</div>
            <button type="submit" id="submit-form-btn" class="btn btn-primary btn-lg" style="box-shadow:var(--shadow-md); display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  `,e.innerHTML=i;const r=document.getElementById("dynamic-form");r.addEventListener("submit",Wt),Gt(r,t)}function Gt(e,t){const i=[];(t.sections||[]).forEach(r=>{(r.subsections||[]).forEach(o=>{(o.parameters||[]).forEach(s=>i.push(s))})});const a=e.querySelectorAll(".conditional-field");if(a.length===0)return;function n(){a.forEach(r=>{const o=r.getAttribute("data-depends-key"),s=r.getAttribute("data-depends-val");if(!o)return;const l=i.find(g=>g.field_key===o);if(!l)return;const c=e.querySelector(`[name="param_${l.parameter_id}"]`);if(!c)return;String(c.value||"").trim().toLowerCase()===String(s).toLowerCase()?(r.style.display="",r.querySelectorAll("input, select, textarea").forEach(g=>{g.disabled=!1})):(r.style.display="none",r.querySelectorAll("input, select, textarea").forEach(g=>{g.disabled=!0,g.value=""}))})}e.addEventListener("change",n),e.addEventListener("input",n),n()}async function Wt(e){e.preventDefault();const t=document.getElementById("form-validation-alert");t&&(t.classList.add("hidden"),t.textContent="");const i=document.getElementById("submit-form-btn");i.disabled=!0,i.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';try{const a=new FormData(e.target),n=Object.fromEntries(a.entries());if(!n._base_name||!n._base_name.trim()){const u=document.getElementById("base_name");throw u&&u.focus(),new Error("Title / Summary is a required field.")}const r=W?W.getValue():null;if(!r)throw new Error("Please select a jurisdiction (at minimum a Country) before submitting.");if(Q&&Q.sections){for(const u of Q.sections)for(const g of u.subsections||[])for(const p of g.parameters||[])if(!Qe(p)&&(p.mandatory||p.is_mandatory)){const v=e.target.querySelector(`[name="param_${p.parameter_id}"]`);if(v&&!v.disabled&&!(v.type==="file"?v.files&&v.files.length>0:String(v.value||"").trim()))throw v.focus(),new Error(`"${p.label||p.field_key}" is a required field.`)}}const o={entity_type_id:R,name:n._base_name.trim(),jurisdiction_id:r.jurisdiction_id,area:r.display_path,location:n._base_location?n._base_location.trim():null,status:"submitted"},l=(await _.create(o)).data.entity_id,c=[];for(const[u,g]of a.entries())if(u.startsWith("param_")){const p=Number(u.replace("param_","")),v=e.target.querySelector(`[name="${u}"]`);if(v&&(v.type==="file"||v.disabled))continue;g!=null&&String(g).trim()!==""&&c.push({parameter_id:p,value:String(g).trim()})}c.length>0&&await Ye.create(l,c);const m=e.target.querySelectorAll('input[type="file"]');for(const u of m)if(u.files&&u.files.length>0){const g=u.getAttribute("data-parameter-id");if(!g)continue;const p=new FormData;p.append("entity_id",l),p.append("parameter_id",g);for(const v of u.files)p.append("files",v);try{const v=localStorage.getItem("auth_token");await fetch(`${Dt}/files/upload`,{method:"POST",headers:v?{Authorization:`Bearer ${v}`}:{},body:p})}catch(v){console.warn("File upload warning:",v)}}V("Request submitted successfully!"),Kt(l,n._base_name)}catch(a){const n=a.message||"Failed to submit request";t&&(t.textContent=n,t.classList.remove("hidden")),w(n),i.disabled=!1,i.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request'}}function Kt(e,t){const i=document.getElementById("dynamic-form-container"),a=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});i.innerHTML=`
    <div class="card p-8 text-center" style="padding:48px 24px; text-align:center; max-width:640px; margin:0 auto;">
      <div style="width:64px; height:64px; border-radius:50%; background:var(--green-50); border:2px solid var(--green-100); color:var(--green-600); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>

      <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:6px;">
        Request Submitted
      </h2>
      <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:24px;">
        Your request has been recorded and entered into the civic workflow for jurisdiction review.
      </p>

      <div style="background:var(--gray-50); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; text-align:left; margin-bottom:32px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.875rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Request ID</div>
            <div style="font-weight:700; color:var(--primary); font-family:var(--font-mono); margin-top:2px;">#PR-${String(e).padStart(5,"0")}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Status</div>
            <div style="margin-top:2px;"><span class="badge badge-submitted">Submitted</span></div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Title</div>
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${L(t)}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Submission Date</div>
            <div style="color:var(--text-secondary); margin-top:2px;">${a}</div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:12px; justify-content:center;">
        <a href="/entities/${e}" class="btn btn-primary btn-lg" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          View Request Details
        </a>
        <a href="/dashboard" class="btn btn-secondary btn-lg">Back to My Workspace</a>
      </div>
    </div>
  `}let pe=[],U=null,K="";async function Jt(){if(!Ke(["admin"],k))return;const e=document.getElementById("app");e.innerHTML=B(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>User Management</h1>
        <p>Manage system users, search accounts, assign roles, and allocate areas to coordinators.</p>
      </div>
    </div>
    
    <!-- User Search Filter Bar -->
    <div class="card mb-6" style="padding: 14px 18px;">
      <div style="position: relative; display: flex; align-items: center;">
        <span style="position: absolute; left: 14px; display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input type="text" id="user-search-input" class="form-control" style="padding-left: 42px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search users by email (e.g. demo.coord.area@example.com), name, or assigned area..." value="${A(K)}">
        ${K?'<button id="clear-search-btn" class="btn btn-ghost btn-sm" style="position:absolute; right:10px; padding:4px 8px; font-size:12px;">Clear</button>':""}
      </div>
    </div>

    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Admin"),z(),Yt(),await ue()}let Ne=null;function Yt(){const e=document.getElementById("user-search-input");if(!e)return;e.addEventListener("input",i=>{K=i.target.value.trim(),clearTimeout(Ne),Ne=setTimeout(()=>{ue(K)},200)});const t=document.getElementById("clear-search-btn");t&&t.addEventListener("click",()=>{K="",e.value="",t.remove(),ue("")})}async function ue(e=K){const t=document.getElementById("admin-content");if(t)try{const i={limit:100};e&&(i.search=e),pe=(await Je.listUsers(i)).data,Xt(t,pe)}catch{w("Failed to load users"),t.innerHTML='<div class="alert alert-error">Failed to load users data.</div>'}}function Xt(e,t=pe){if(t.length===0){e.innerHTML=`
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Users & Regional Allocations (${t.length})</div>
        </div>
        <div class="table-empty py-6 text-center text-muted">
          No users found matching "${A(K)}".
        </div>
      </div>
    `;return}const i=t.map(a=>`
    <tr>
      <td>${a.user_id}</td>
      <td class="font-medium">${A(a.name)}</td>
      <td class="text-muted">${A(a.email)}</td>
      <td><span class="badge badge-role-${a.role}">${Zt(a.role)}</span></td>
      <td>${a.assignedArea?`<span class="badge badge-primary font-semibold" style="font-size:12px;">${A(a.assignedArea)}</span>`:'<span class="text-muted">—</span>'}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="window.editUserRole(${a.user_id})">Change Role / Area</button></td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <div class="card-title">System Users & Regional Allocations (${t.length})</div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Area / Ward</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${i}
          </tbody>
        </table>
      </div>
    </div>
  `}async function Qt(){if(U&&U.length>0)return U;try{const e=await de.tree();e.data&&Array.isArray(e.data)&&(U=Ze(e.data))}catch(e){console.warn("Failed to load jurisdiction tree for admin, falling back to flat list",e);try{U=((await de.list({parent_id:"all"})).data||[]).map(i=>({jurisdiction_id:i.jurisdiction_id,name:i.name,type:i.type,fullPath:i.name}))}catch{U=[]}}return U||[]}function Ze(e,t=""){let i=[];for(const a of e){const n=t?`${t} › ${a.name}`:a.name;i.push({jurisdiction_id:a.jurisdiction_id,name:a.name,type:a.type,fullPath:n}),a.children&&a.children.length>0&&(i=i.concat(Ze(a.children,n)))}return i}window.editUserRole=async e=>{const t=pe.find(p=>p.user_id===e);if(!t)return;const i=await Qt(),a=i.filter(p=>p.type==="ward"),n=i.filter(p=>p.type==="city"),r=i.filter(p=>p.type!=="ward"&&p.type!=="city");let o=!1,s="";a.length>0&&(s+='<optgroup label="Wards / Local Areas (Recommended)">',a.forEach(p=>{const v=t.assignedArea===p.name;v&&(o=!0),s+=`<option value="${A(p.name)}" ${v?"selected":""}>${A(p.fullPath)}</option>`}),s+="</optgroup>"),n.length>0&&(s+='<optgroup label="Cities / Districts">',n.forEach(p=>{const v=t.assignedArea===p.name;v&&(o=!0),s+=`<option value="${A(p.name)}" ${v?"selected":""}>${A(p.fullPath)}</option>`}),s+="</optgroup>"),r.length>0&&(s+='<optgroup label="States / Regions">',r.forEach(p=>{const v=t.assignedArea===p.name;v&&(o=!0),s+=`<option value="${A(p.name)}" ${v?"selected":""}>${A(p.fullPath)}</option>`}),s+="</optgroup>"),t.assignedArea&&!o&&t.assignedArea!=="Unassigned"&&(s=`<option value="${A(t.assignedArea)}" selected>${A(t.assignedArea)} (Currently Assigned)</option>`+s),we({title:`User Role & Area Allocation: ${t.name}`,content:`
      <form id="role-form">
        <div class="form-group">
          <label class="form-label font-semibold">User Role</label>
          <select id="new-role" class="form-control">
            <option value="citizen" ${t.role==="citizen"?"selected":""}>Citizen</option>
            <option value="coordinator_area" ${t.role==="coordinator_area"?"selected":""}>Area Coordinator</option>
            <option value="coordinator_general" ${t.role==="coordinator_general"?"selected":""}>General Coordinator</option>
            <option value="director" ${t.role==="director"?"selected":""}>Director</option>
            <option value="admin" ${t.role==="admin"?"selected":""}>Admin</option>
          </select>
        </div>
        <div class="form-group" id="area-group" style="${t.role==="coordinator_area"?"":"display:none;"}">
          <label class="form-label font-semibold">Allocated Region / Ward <span class="required">*</span></label>
          <select id="new-area" class="form-control">
            <option value="">-- Select Allocated Area / Jurisdiction --</option>
            ${s}
            <option value="__custom__">➕ Other / Custom Area Name...</option>
          </select>
          <div id="custom-area-wrapper" style="display:none; margin-top:8px;">
            <input type="text" id="custom-area-input" class="form-control" placeholder="Type custom jurisdiction or ward name (e.g. Kothrud, Sector 5)..." />
          </div>
          <div class="form-hint" style="margin-top:6px;">
            Area Coordinators only have workflow authority to review and approve cases located in their allocated jurisdiction.
          </div>
        </div>
      </form>
    `,footer:`
      <button class="btn btn-ghost" onclick="document.getElementById('modal-close-btn').click()">Cancel</button>
      <button class="btn btn-primary" id="save-role-btn">Save Allocation</button>
    `,onClose:()=>{}});const l=document.getElementById("new-role"),c=document.getElementById("area-group"),m=document.getElementById("new-area"),u=document.getElementById("custom-area-wrapper"),g=document.getElementById("custom-area-input");l.addEventListener("change",p=>{const v=p.target.value==="coordinator_area";c.style.display=v?"block":"none"}),m.addEventListener("change",p=>{p.target.value==="__custom__"?(u.style.display="block",g.focus()):u.style.display="none"}),document.getElementById("save-role-btn").addEventListener("click",async()=>{const p=l.value;let v=m.value;if(p==="coordinator_area"&&(v==="__custom__"&&(v=g.value.trim()),!v)){w("Please select or enter an allocated area for the coordinator");return}const $=document.getElementById("save-role-btn");$.disabled=!0,$.textContent="Saving...";try{await Je.setRole(e,p,p==="coordinator_area"?v:null),V(`Updated role & area allocation for ${t.name}`),X(),ue()}catch(C){w(C.message||"Failed to update role"),$.disabled=!1,$.textContent="Save Allocation"}})};function Zt(e){return e?e.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"Unknown"}function A(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ei(){if(!F(k))return;const e=Z(),t=document.getElementById("app");t.innerHTML=B(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Profile & Security Settings</h1>
        <p>Manage your account credentials, view role permissions, and update password.</p>
      </div>
    </div>
    
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:24px; width:100%;">
      <!-- Profile Info Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">User Account Details</div>
        </div>
        <div class="card-body p-6">
          <div class="flex items-center gap-4 mb-6">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700;">
              ${e.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-primary);">${ye(e.name)}</h2>
              <p style="font-size:0.875rem; color:var(--text-muted);">${ye(e.email)}</p>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">User ID</label>
            <div class="font-mono text-muted" style="font-size:0.9rem;">#${e.user_id}</div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Assigned Role</label>
            <div><span class="badge badge-primary">${ie(e.role)}</span></div>
          </div>
          
          ${e.assignedArea?`
            <div class="form-group">
              <label class="form-label">Jurisdiction Area</label>
              <div style="font-weight:600; color:var(--text-primary);">${ye(e.assignedArea)}</div>
            </div>
          `:""}
        </div>
      </div>

      <!-- Password Change Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Password & Security</div>
          <div class="card-subtitle">Update your system login password</div>
        </div>
        <div class="card-body p-6">
          <div id="password-alert" class="alert alert-danger hidden mb-4"></div>

          <form id="change-password-form">
            <div class="form-group mb-4">
              <label class="form-label" for="current_password">Current Password <span class="required">*</span></label>
              <input type="password" id="current_password" name="current_password" class="form-control" required placeholder="Enter current password">
            </div>

            <div class="form-group mb-4">
              <label class="form-label" for="new_password">New Password <span class="required">*</span></label>
              <input type="password" id="new_password" name="new_password" class="form-control" required minlength="8" placeholder="At least 8 characters">
            </div>

            <div class="form-group mb-6">
              <label class="form-label" for="confirm_password">Confirm New Password <span class="required">*</span></label>
              <input type="password" id="confirm_password" name="confirm_password" class="form-control" required minlength="8" placeholder="Re-enter new password">
            </div>

            <button type="submit" id="btn-change-pwd" class="btn btn-primary btn-full" style="display:inline-flex; align-items:center; justify-content:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  `,"Profile"),z();const i=document.getElementById("change-password-form");i&&i.addEventListener("submit",async a=>{a.preventDefault();const n=document.getElementById("password-alert");n.classList.add("hidden"),n.textContent="";const r=document.getElementById("current_password").value,o=document.getElementById("new_password").value,s=document.getElementById("confirm_password").value;if(o!==s){n.textContent="New password and confirmation do not match.",n.classList.remove("hidden");return}const l=document.getElementById("btn-change-pwd");l.disabled=!0,l.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Updating...';try{await Ce.changePassword(r,o),V("Password updated successfully!"),i.reset(),l.disabled=!1,l.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}catch(c){const m=c.message||"Failed to update password";n.textContent=m,n.classList.remove("hidden"),w(m),l.disabled=!1,l.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}})}function ye(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function b(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}let d={step:1,basics:{name:"",description:"",icon:"📋",domain_id:1},form:{name:"",sections:[{id:"sec_1",name:"General Information",parameters:[{id:"param_1",label:"Title",field_key:"title",field_type:"text",mandatory:!0,options:[]},{id:"param_2",label:"Area",field_key:"area",field_type:"select",mandatory:!0,options:["Sector 5","Sector 12","Pune North","Pune South","Pune Central"]}]}]},workflow:{transitions:[{from:"draft",to:"submitted",role:"citizen"},{from:"submitted",to:"coordinator_approved",role:"coordinator_area"},{from:"submitted",to:"rejected",role:"coordinator_area"},{from:"coordinator_approved",to:"approved",role:"director"},{from:"coordinator_approved",to:"rejected",role:"director"}]},rule:{enabled:!1,target_entity_type_id:"",event:"approved"},report:{enabled:!0,name:"",groupBy:"area",metric:"COUNT",metricField:"",publicStats:!0},existingTypes:[],domains:[],isSubmitting:!1};async function ti(){var e;if(Ke(["admin","director"],k)){try{const[t,i]=await Promise.all([_.listTypes().catch(()=>({data:[]})),Ee.getMetadata().catch(()=>({data:{domains:[]}}))]);d.existingTypes=t.data||[],d.domains=((e=i.data)==null?void 0:e.domains)||[]}catch(t){console.warn("Could not load metadata for module builder:",t)}M()}}function M(){const e=document.getElementById("app");let t="";d.step===1?t=ii():d.step===2?t=ai():d.step===3?t=ri():d.step===4?t=oi():d.step===5?t=si():d.step===6?t=li():d.step===7&&(t=di());const i=[{num:1,label:"Basics"},{num:2,label:"Form & Fields"},{num:3,label:"Workflow"},{num:4,label:"Rules"},{num:5,label:"Reports"},{num:6,label:"Review"}],a=i.map((n,r)=>`
    <div style="display:flex; align-items:center; gap:0.4rem; color:${d.step>=n.num?"var(--primary)":"var(--gray-400)"}; font-weight:${d.step===n.num?"bold":"normal"}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${d.step>=n.num?"var(--primary)":"#e5e7eb"}; color:${d.step>=n.num?"#fff":"#4b5563"}; display:flex; align-items:center; justify-content:center; font-size:12px;">${n.num}</span>
      ${n.label}
    </div>
    ${r<i.length-1?`<div style="flex:1; height:2px; background:${d.step>n.num?"var(--primary)":"#e5e7eb"}; margin:0 4px;"></div>`:""}
  `).join("");e.innerHTML=B(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>No-Code Module Builder</h1>
        <p>Design and deploy brand-new civic governance capabilities purely through metadata.</p>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="card mb-6" style="padding: 0.8rem 1.2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; overflow-x:auto;">
        ${a}
      </div>
    </div>

    ${t}
  `,"Module Builder"),z(),ci()}function ii(){const e=d.domains&&d.domains.length>0?d.domains.map(t=>`<option value="${t.domain_id}" ${d.basics.domain_id==t.domain_id?"selected":""}>${b(t.domain_name)}</option>`).join(""):'<option value="1">Civic Operations</option>';return`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${b(d.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${b(d.basics.description)}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label class="form-label">Civic Domain</label>
              <select id="module-domain" class="form-control" onchange="state.basics.domain_id = Number(this.value)">
                ${e}
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Icon Identifier</label>
              <select id="module-icon" class="form-control">
                <option value="📋" ${d.basics.icon==="📋"?"selected":""}>📋 Form / Registration</option>
                <option value="📢" ${d.basics.icon==="📢"?"selected":""}>📢 Notice / Alert</option>
                <option value="🛡️" ${d.basics.icon==="🛡️"?"selected":""}>🛡️ Governance / Policy</option>
                <option value="💼" ${d.basics.icon==="💼"?"selected":""}>💼 Employment / Exchange</option>
                <option value="🤝" ${d.basics.icon==="🤝"?"selected":""}>🤝 Volunteer / Community</option>
                <option value="🌳" ${d.basics.icon==="🌳"?"selected":""}>🌳 Parks / Environment</option>
                <option value="🏗️" ${d.basics.icon==="🏗️"?"selected":""}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `}function ai(){const e=d.basics.name?`${d.basics.name} Form`:"Module Registration Form",t=d.form.sections.map((i,a)=>{const n=i.parameters.map((r,o)=>{const s=r.field_type==="select";return`
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${o+1} (${b(r.field_key||"field")})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${a}, ${o})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${b(r.label)}" onchange="window.updateParam(${a}, ${o}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
            </div>
            <div class="form-group" style="flex:1.5;">
              <label class="form-label" style="font-size:12px;">Data Type</label>
              <select class="form-control" onchange="window.updateParam(${a}, ${o}, 'field_type', this.value)">
                <option value="text" ${r.field_type==="text"?"selected":""}>Text Input</option>
                <option value="textarea" ${r.field_type==="textarea"?"selected":""}>Long Text (Textarea)</option>
                <option value="number" ${r.field_type==="number"?"selected":""}>Number (Metric)</option>
                <option value="date" ${r.field_type==="date"?"selected":""}>Date</option>
                <option value="select" ${r.field_type==="select"?"selected":""}>Dropdown Select</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:flex-end; padding-bottom:8px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${r.mandatory?"checked":""} onchange="window.updateParam(${a}, ${o}, 'mandatory', this.checked)">
                Required?
              </label>
            </div>
          </div>

          ${s?`
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--gray-200);">
              <label class="form-label" style="font-size:12px;">Dropdown Choices (comma-separated)</label>
              <input type="text" class="form-control" value="${b((r.options||[]).join(", "))}" onchange="window.updateParamOptions(${a}, ${o}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          `:""}
        </div>
      `}).join("");return`
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${b(i.name)}" onchange="window.updateSectionName(${a}, this.value)">
          <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeSection(${a})">Delete Section</button>
        </div>
        <div class="card-body">
          ${n}
          <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.addParam(${a})">+ Add Field</button>
        </div>
      </div>
    `}).join("");return`
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
      <div>
        <div class="card mb-4">
          <div class="card-header">
            <div class="card-title">Step 2: Form & Field Configuration</div>
            <div class="card-subtitle">Define parameters and form sections for "${b(d.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${b(e)}" onchange="state.form.name = this.value">
            </div>
          </div>
        </div>

        ${t}

        <div class="mb-6">
          <button type="button" class="btn btn-secondary" onclick="window.addSection()">+ Add Section</button>
        </div>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=1; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep3()">Next: Workflow →</button>
        </div>
      </div>

      <!-- Right Column: Live Interactive Preview -->
      <div>
        <div class="card" style="position:sticky; top:20px; border-top: 4px solid var(--primary);">
          <div class="card-header flex justify-between align-center">
            <div class="card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              Live Form Preview
            </div>
            <span class="badge badge-role-citizen">Generic FormEngine</span>
          </div>
          <div class="card-body" style="max-height:80vh; overflow-y:auto;">
            ${ni()}
          </div>
        </div>
      </div>
    </div>
  `}function ni(){const e=d.basics.name?`${d.basics.name} Form`:"Untitled Form";let t=`<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${b(e)}</div>`;return d.form.sections.forEach(i=>{t+=`
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${b(i.name)}</div>
    `,i.parameters.forEach(a=>{const n=a.mandatory?'<span style="color:red">*</span>':"";if(t+=`<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${b(a.label||"Unlabelled")} ${n}</label>`,a.field_type==="textarea")t+='<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>';else if(a.field_type==="number")t+='<input type="number" class="form-control" disabled placeholder="0">';else if(a.field_type==="date")t+='<input type="date" class="form-control" disabled>';else if(a.field_type==="select"){const r=a.options&&a.options.length?a.options:["Option 1","Option 2"];t+=`<select class="form-control" disabled>
          ${r.map(o=>`<option>${b(o)}</option>`).join("")}
        </select>`}else t+='<input type="text" class="form-control" disabled placeholder="Text response...">';t+="</div>"}),t+="</div>"}),t}function ri(){const e=[{value:"citizen",label:"Citizen (Owner)"},{value:"coordinator_area",label:"Area Coordinator"},{value:"coordinator_general",label:"General Coordinator"},{value:"director",label:"Director"},{value:"admin",label:"Administrator"}],t=d.workflow.transitions.map((i,a)=>`
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${a+1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${a})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${b(i.from)}" onchange="window.updateTransition(${a}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${b(i.to)}" onchange="window.updateTransition(${a}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
        </div>
        <div class="form-group" style="flex:1.2;">
          <label class="form-label" style="font-size:12px;">Allowed Role</label>
          <select class="form-control" onchange="window.updateTransition(${a}, 'role', this.value)">
            ${e.map(n=>`<option value="${n.value}" ${i.role===n.value?"selected":""}>${n.label}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
  `).join("");return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 3: Workflow & State Transitions</div>
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${b(d.basics.name)}".</div>
      </div>
      <div class="card-body">
        <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
          Define which roles can transition entities of this module from one state to another. These will be generated into <code>WorkflowMaster</code>.
        </p>

        ${t}

        <button type="button" class="btn btn-secondary btn-sm mb-6" onclick="window.addTransition()">+ Add Transition</button>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=2; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep4()">Next: Rules →</button>
        </div>
      </div>
    </div>
  `}function oi(){return d.existingTypes.map(e=>`<option value="${e.entity_type_id}" ${d.rule.target_entity_type_id==e.entity_type_id?"selected":""}>${b(e.name)}</option>`).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 4: Relationship Rules (Optional)</div>
        <div class="card-subtitle">Configure cascading auto-creation when entities are approved or submitted.</div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label" style="font-size:15px; font-weight:600;">Enable Auto-Creation Rule?</label>
          <div style="display:flex; gap:16px; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="rule-enable" value="false" checked onchange="state.rule.enabled = false; renderWizard();">
              No rule (Standalone module)
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="rule-enable" value="true"  onchange="state.rule.enabled = true; renderWizard();">
              Yes, auto-create linked entity
            </label>
          </div>
        </div>

        

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=3; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="state.step=5; renderWizard();">Next: Reports →</button>
        </div>
      </div>
    </div>
  `}function si(){const e=[];d.form.sections.forEach(n=>n.parameters.forEach(r=>e.push(r)));const t=d.basics.name?`${d.basics.name}s by Area`:"Module Report",i=e.filter(n=>n.field_type==="number"),a=['<option value="area">area (Native Area)</option>','<option value="status">status (Workflow Status)</option>',...e.map(n=>`<option value="${b(n.field_key||n.label)}" ${d.report.groupBy===(n.field_key||n.label)?"selected":""}>${b(n.label)} (${n.field_type})</option>`)].join("");return i.map(n=>`
    <option value="${b(n.field_key||n.label)}" ${d.report.metricField===(n.field_key||n.label)?"selected":""}>${b(n.label)}</option>
  `).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${b(d.basics.name)}" via ReportMaster.</div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label style="display:flex; align-items:center; gap:8px; font-weight:600; cursor:pointer;">
            <input type="checkbox" checked onchange="state.report.enabled = this.checked; renderWizard();">
            Generate Default Analytical Report
          </label>
        </div>

        ${`
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div class="form-group">
              <label class="form-label">Report Name <span class="required">*</span></label>
              <input type="text" class="form-control" value="${b(t)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label">Group By Field</label>
                <select class="form-control" onchange="state.report.groupBy = this.value">
                  ${a}
                </select>
              </div>

              <div class="form-group" style="flex:1;">
                <label class="form-label">Aggregation Metric</label>
                <select class="form-control" onchange="state.report.metric = this.value; renderWizard();">
                  <option value="COUNT" selected>COUNT (Entity Count)</option>
                  <option value="SUM" >SUM (Sum of Numeric Field)</option>
                  <option value="AVG" >AVG (Average)</option>
                  <option value="MIN" >MIN (Minimum)</option>
                  <option value="MAX" >MAX (Maximum)</option>
                </select>
              </div>
            </div>

            

            <div class="form-group mb-0">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" checked onchange="state.report.publicStats = this.checked">
                Public Statistics? (Allows citizens to view aggregated summary without row-level access)
              </label>
            </div>
          </div>
        `}

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=4; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="state.step=6; renderWizard();">Next: Review & Deploy →</button>
        </div>
      </div>
    </div>
  `}function li(){const e=`${d.basics.name} Form`,t=d.form.sections.reduce((a,n)=>a+n.parameters.length,0),i=`${d.basics.name}s by Area`;return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${d.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${b(d.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${b(d.basics.description||"Civic Operating System Module")}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${b(e)}</strong></div>
              <div>Sections: <strong>${d.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${t}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${d.workflow.transitions.length} transitions)
              </div>
              ${d.workflow.transitions.map(a=>`<div style="font-size:12px;">• <code>${b(a.from)}</code> → <code>${b(a.to)}</code> (${b(a.role)})</div>`).join("")}
            </div>
          </div>

          <div style="border-top:1px solid #cbd5e1; margin-top:12px; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Automation Rule
              </div>
              <div>None</div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                Reporting
              </div>
              <div>${`${b(i)} (${d.report.metric} by ${d.report.groupBy})`}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${d.isSubmitting?"disabled":""}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `}function di(){return`
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${b(d.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `}function ci(){const e=document.getElementById("step1-form");e&&e.addEventListener("submit",t=>{t.preventDefault();const i=document.getElementById("module-name").value.trim(),a=document.getElementById("module-desc").value.trim(),n=document.getElementById("module-icon").value;if(!i){w("Module name is required");return}if(d.existingTypes.some(o=>o.name.toLowerCase()===i.toLowerCase())){w(`Module "${i}" already exists. Please choose a different name.`);return}d.basics.name=i,d.basics.description=a,d.basics.icon=n,d.step=2,M()})}window.addSection=()=>{const e=d.form.sections.length+1;d.form.sections.push({id:`sec_${Date.now()}`,name:`Section ${e}`,parameters:[{id:`param_${Date.now()}`,label:"New Field",field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}]}),M()};window.removeSection=e=>{if(d.form.sections.length<=1){w("Form must have at least one section");return}d.form.sections.splice(e,1),M()};window.updateSectionName=(e,t)=>{d.form.sections[e].name=t,M()};window.addParam=e=>{const t=d.form.sections[e].parameters.length+1;d.form.sections[e].parameters.push({id:`param_${Date.now()}`,label:`Field ${t}`,field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}),M()};window.removeParam=(e,t)=>{d.form.sections[e].parameters.splice(t,1),M()};window.updateParam=(e,t,i,a)=>{const n=d.form.sections[e].parameters[t];n[i]=a,i==="label"&&(n.field_key=a.toLowerCase().replace(/[^a-z0-9]/g,"_")),M()};window.updateParamOptions=(e,t,i)=>{const a=i.split(",").map(n=>n.trim()).filter(Boolean);d.form.sections[e].parameters[t].options=a,M()};window.validateAndGoStep3=()=>{for(const e of d.form.sections){if(!e.name.trim()){w("All sections must have a title");return}for(const t of e.parameters)if(!t.label.trim()){w("All fields must have a label");return}}d.step=3,M()};window.addTransition=()=>{d.workflow.transitions.push({from:"draft",to:"submitted",role:"citizen"}),M()};window.removeTransition=e=>{if(d.workflow.transitions.length<=1){w("Workflow must have at least one transition");return}d.workflow.transitions.splice(e,1),M()};window.updateTransition=(e,t,i)=>{d.workflow.transitions[e][t]=i,M()};window.validateAndGoStep4=()=>{for(let e=0;e<d.workflow.transitions.length;e++){const t=d.workflow.transitions[e];if(!t.from.trim()||!t.to.trim()){w(`Transition #${e+1} must have both from and to states.`);return}}d.step=4,M()};window.submitModuleCreation=async()=>{const e=document.getElementById("create-module-btn");e&&(e.disabled=!0,e.textContent="Deploying Metadata Atomically..."),d.isSubmitting=!0;try{const t=d.form.name||`${d.basics.name} Form`,i=d.report.name||`${d.basics.name}s by Area`,a={module:{name:d.basics.name,description:d.basics.description,domain_id:d.basics.domain_id||1},form:{name:t,sections:d.form.sections.map(r=>({name:r.name,parameters:r.parameters.map(o=>({field_key:o.field_key,label:o.label,field_type:o.field_type,mandatory:!!o.mandatory,options:o.options}))}))},workflow:{transitions:d.workflow.transitions.map(r=>({from_status:r.from,to_status:r.to,role:r.role}))},rules:d.rule.enabled&&d.rule.target_entity_type_id?[{target_entity_type_id:Number(d.rule.target_entity_type_id),event:d.rule.event||"approved",auto_create:!0,auto_approve:!1}]:[],reports:d.report.enabled?[{report_name:i,output_format:"grouped_count",filters:{groupBy:d.report.groupBy||"area",metric:d.report.metric||"COUNT",metricField:d.report.metricField||void 0,public_stats:d.report.publicStats}}]:[]},n=await ut.deploy(a);V(n.message||`Module "${d.basics.name}" deployed successfully!`),d.isSubmitting=!1,d.step=7,M()}catch(t){w(t.message||"Failed to deploy module"),d.isSubmitting=!1,e&&(e.disabled=!1,e.innerHTML='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata')}};function T(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let le=[],De=[];async function pi(){if(!F(k))return;const e=document.getElementById("app");e.innerHTML=B(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Reports"),z();try{const[t,i]=await Promise.all([ve.list().catch(()=>({data:[]})),_.listTypes().catch(()=>({data:[]}))]);le=t.data||[],De=i.data||[],e.innerHTML=B(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `,"Civic Reports",De),z(),ui(document.getElementById("reports-container"))}catch{w("Failed to load reports catalog"),document.getElementById("reports-container").innerHTML=`
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `}}function ui(e){if(!le||le.length===0){e.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;return}const t=le.map(n=>{const r=H(n.entityType);return`
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${T(r.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${T(n.metric_type||"COUNT")}</span>
          </div>
          <div class="report-card-title">${T(n.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${T(r.shortTitle)}</strong> records grouped by <strong>${T(n.group_by_field||"area / status")}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${T(n.group_by_field||"area")}</span>
            <span>•</span>
            <span>Metric: ${T(n.metric_type||"COUNT")}</span>
          </div>
          <button class="btn btn-primary btn-full execute-report-btn" data-repid="${n.report_id}" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Run Report
          </button>
        </div>
      </div>
    `}).join("");e.innerHTML=`
    <div class="reports-grid mb-8">
      ${t}
    </div>

    <!-- Execution Result Output Panel -->
    <div class="card" id="report-execution-panel" style="display:none;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" id="execution-title">Report Results</div>
        <button class="btn btn-ghost btn-sm" id="btn-close-result">Close Panel</button>
      </div>
      <div class="card-body p-6" id="execution-body"></div>
    </div>
  `,e.querySelectorAll(".execute-report-btn").forEach(n=>{n.addEventListener("click",()=>{const r=n.getAttribute("data-repid");mi(r)})});const a=document.getElementById("btn-close-result");a&&a.addEventListener("click",()=>{document.getElementById("report-execution-panel").style.display="none"})}async function mi(e){const t=document.getElementById("report-execution-panel"),i=document.getElementById("execution-title"),a=document.getElementById("execution-body");if(!(!t||!a)){t.style.display="block",t.scrollIntoView({behavior:"smooth"}),a.innerHTML='<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';try{const r=(await ve.execute(e)).data;i.textContent=`Report Results: ${r.reportName||"Execution"}`;const o=r.rows||[];if(o.length===0){a.innerHTML='<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>';return}const s=o.map(l=>{var c;return`
      <tr>
        <td style="font-weight:600;">${T(l[r.groupBy]||l.area||l.status||"Total")}</td>
        <td style="font-weight:700; color:var(--primary);">${l[(c=r.metric)==null?void 0:c.toLowerCase()]||l.count||l.total_count||0}</td>
      </tr>
    `}).join("");a.innerHTML=`
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${T(r.metric)}</strong> | Grouped By: <strong>${T(r.groupBy)}</strong> | Total Groups: <strong>${o.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${T(r.groupBy||"Group")}</th>
              <th>Aggregation Metric (${T(r.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${s}
          </tbody>
        </table>
      </div>
    `}catch(n){w(n.message||"Report execution failed"),a.innerHTML=`<div class="alert alert-error">Execution Error: ${T(n.message)}</div>`}}}function se(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function vi(){if(!F(k))return;const e=document.getElementById("app");e.innerHTML=B(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Capabilities"),z();try{const i=(await _.listTypes().catch(()=>({data:[]}))).data||[];e.innerHTML=B(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `,"Civic Capabilities",i),z(),gi(document.getElementById("modules-container"),i)}catch{w("Failed to load civic capabilities"),document.getElementById("modules-container").innerHTML=`
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `}}function gi(e,t){if(!t||t.length===0){e.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;return}const i=t.map(a=>{var o;const n=H(a),r=((o=a._count)==null?void 0:o.entities)||0;return`
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${D(n.iconKey,24)}
            </div>
            <span class="badge badge-secondary" style="font-size:11px;">${r} Active Cases</span>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:4px;">
            ${se(n.category)}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            ${se(n.title)}
          </h3>

          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
            ${se(n.description)}
          </p>
        </div>

        <div style="display:flex; gap:10px; padding-top:16px; border-top:1px solid var(--border);">
          <a href="/entities?entity_type_id=${a.entity_type_id}" class="btn btn-secondary" style="flex:1; text-align:center; font-size:0.85rem;">
            Explore Cases
          </a>
          <a href="/entities/new?entity_type_id=${a.entity_type_id}" class="btn btn-translucent-orange" style="flex:1; text-align:center; font-size:0.85rem;">
            ${se(n.actionLabel)} →
          </a>
        </div>
      </div>
    `}).join("");e.innerHTML=`
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
      ${i}
    </div>
  `}E("/",dt);E("/login",yt);E("/signup",bt);E("/dashboard",ge);E("/modules",vi);E("/entities",Et);E("/entities/new",qt);E("/entities/:id",Se);E("/admin",Jt);E("/module-builder",ti);E("/reports",pi);E("/profile",ei);E("/director",ge);E("/coordinator",ge);E("/workspace",ge);Oe(()=>{document.getElementById("app").innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `});Fe();window.addEventListener("auth:expired",()=>{Ie(()=>Promise.resolve().then(()=>ht),void 0).then(e=>{e.toastWarning("Your session has expired. Please sign in again.")}),Ie(()=>Promise.resolve().then(()=>ot),void 0).then(e=>e.navigate("/login"))});
