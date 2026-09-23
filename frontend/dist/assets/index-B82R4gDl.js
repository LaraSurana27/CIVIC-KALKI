(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();const Je="modulepreload",Ye=function(e){return"/"+e},Ce={},Me=function(t,i,n){let a=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),d=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));a=Promise.allSettled(i.map(l=>{if(l=Ye(l),l in Ce)return;Ce[l]=!0;const c=l.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":Je,c||(p.as="script"),p.crossOrigin="",p.href=l,d&&p.setAttribute("nonce",d),document.head.appendChild(p),c)return new Promise((f,$)=>{p.addEventListener("load",f),p.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(s){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=s,window.dispatchEvent(d),!d.defaultPrevented)throw s}return a.then(s=>{for(const d of s||[])d.status==="rejected"&&r(d.reason);return t().catch(r)})},Ae=[];let Be=()=>{};function C(e,t){Ae.push({path:e,handler:t})}function je(e){Be=e}function Qe(e){const t=[...Ae].sort((i,n)=>{const a=i.path.includes(":"),r=n.path.includes(":");return!a&&r?-1:a&&!r?1:0});for(const i of t){const n=[],a=i.path.replace(/:([^/]+)/g,(d,l)=>(n.push(l),"([^/]+)")).replace(/\//g,"\\/"),r=new RegExp(`^${a}$`),s=e.match(r);if(s){const d={};return n.forEach((l,c)=>{d[l]=decodeURIComponent(s[c+1])}),{handler:i.handler,params:d,path:i.path}}}return null}function x(e){window.history.pushState({},"",e),de(window.location.href)}function de(e=window.location.href){const t=new URL(e,window.location.origin);let i=t.pathname;i.length>1&&i.endsWith("/")&&(i=i.slice(0,-1));const n=Qe(i);n?n.handler(n.params,t.searchParams):Be()}function ze(){window.navigate=x,window.addEventListener("popstate",()=>de(window.location.href)),document.getElementById("app").addEventListener("click",e=>{const t=e.target.closest("a[href]");if(!t)return;const i=t.getAttribute("href");!i||i.startsWith("http")||i.startsWith("mailto:")||i.startsWith("#")||(e.preventDefault(),x(i))}),de(window.location.href)}const Xe=Object.freeze(Object.defineProperty({__proto__:null,addRoute:C,initRouter:ze,navigate:x,onNotFound:je},Symbol.toStringTag,{value:"Module"})),me="ck_auth";function Re(){try{const e=sessionStorage.getItem(me);return e?JSON.parse(e):null}catch{return null}}function Pe(e){sessionStorage.setItem(me,JSON.stringify(e))}function Ie(){sessionStorage.removeItem(me)}function He(){var e;return((e=Re())==null?void 0:e.token)||null}function G(){var e;return((e=Re())==null?void 0:e.user)||null}function Ve(){var e;return((e=G())==null?void 0:e.role)||null}function ae(){const e=He();if(!e)return!1;try{const[,t]=e.split(".");return JSON.parse(atob(t.replace(/-/g,"+").replace(/_/g,"/"))).exp*1e3>Date.now()}catch{return!1}}function H(e){return ae()?!0:(e("/login"),!1)}function qe(e,t){if(!H(t))return!1;const i=Ve();return e.includes(i)?!0:(t("/dashboard"),!1)}const Ze={citizen:"Citizen",coordinator_area:"Area Coordinator",coordinator_general:"General Coordinator",director:"Director",admin:"Administrator"};function Z(e){return Ze[e]||e}function et(){const e=G(),t=ae(),i=document.getElementById("app");i&&(i.innerHTML=`
    <div class="home-container">
      <!-- Public Header -->
      <header class="home-header">
        <a href="/" class="home-logo">
          <img src="/logo.png" alt="CivicKalki" style="height:38px; width:auto; object-fit:contain;" />
        </a>

        <div style="display:flex; align-items:center; gap:var(--space-4);">
          ${t?`
            <a href="/dashboard" class="home-btn-primary" style="padding:8px 20px; font-size:0.875rem;">
              Enter Civic OS (${tt(e.name.split(" ")[0])}) →
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
  `)}function tt(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const it="/api";async function m(e,t,i=null,n={}){const a=He(),r={"Content-Type":"application/json"};a&&(r.Authorization=`Bearer ${a}`);const s={method:e,headers:r,...n};i!==null&&(s.body=JSON.stringify(i));const d=await fetch(`${it}${t}`,s);d.status===401&&(Ie(),window.dispatchEvent(new CustomEvent("auth:expired")));const l=await d.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!d.ok){const c=new Error(l.error||`HTTP ${d.status}`);throw c.status=d.status,c.data=l,c}return l}const ve={login:(e,t)=>m("POST","/auth/login",{email:e,password:t}),signup:(e,t,i)=>m("POST","/auth/signup",{name:e,email:t,password:i}),changePassword:(e,t)=>m("POST","/auth/change-password",{current_password:e,new_password:t}),me:()=>m("GET","/auth/me")},De={listUsers:(e={})=>{const t=new URLSearchParams(e).toString();return m("GET",`/admin/users${t?"?"+t:""}`)},getUser:e=>m("GET",`/admin/users/${e}`),setRole:(e,t,i)=>m("POST",`/admin/users/${e}/role`,{role:t,assignedArea:i})},w={list:(e={})=>{const t=new URLSearchParams(e).toString();return m("GET",`/entities${t?"?"+t:""}`)},listTypes:()=>m("GET","/entities/entity-types"),createType:e=>m("POST","/entities/entity-types",e),createRule:e=>m("POST","/entities/rules",e),get:e=>m("GET",`/entities/${e}`),create:e=>m("POST","/entities",e),update:(e,t)=>m("PUT",`/entities/${e}`,t),softDelete:e=>m("DELETE",`/entities/${e}`),transition:(e,t,i)=>m("POST",`/entities/${e}/transition`,{to_status:t,reason:i}),fireRules:(e,t)=>m("POST",`/entities/${e}/fire-rules`,{eventType:t}),aiAnalysis:e=>m("POST",`/entities/${e}/ai-analysis`),audit:e=>m("GET",`/entities/${e}/audit`),getLineage:e=>m("GET",`/entities/${e}/lineage`),workflow:e=>m("GET",`/entities/${e}/workflow`)},Ne={list:e=>m("GET",`/entities/${e}/values`),create:(e,t)=>m("POST",`/entities/${e}/values`,{values:t}),upsert:(e,t)=>m("PUT",`/entities/${e}/values`,{values:t})},ge={getMetadata:()=>m("GET","/forms/metadata"),schema:e=>m("GET",`/forms/${e}/schema`),create:e=>m("POST","/forms",e),addSection:(e,t)=>m("POST",`/forms/${e}/sections`,t),addSubsection:(e,t)=>m("POST",`/sections/${e}/subsections`,t),addParameter:(e,t)=>m("POST",`/subsections/${e}/parameters`,t)},ne={list:(e={})=>{const t=new URLSearchParams(e).toString();return m("GET",`/reports${t?"?"+t:""}`)},get:e=>m("GET",`/reports/${e}`),create:e=>m("POST","/reports",e),execute:(e,t={})=>{const i=new URLSearchParams(t).toString();return m("GET",`/reports/${e}/execute${i?"?"+i:""}`)}},at={validate:e=>m("POST","/module-builder/validate",e),deploy:e=>m("POST","/module-builder/deploy",e)},Ee={list:(e={})=>{const t=new URLSearchParams(e).toString();return m("GET",`/jurisdictions${t?"?"+t:""}`)},tree:()=>m("GET","/jurisdictions?tree=true"),get:e=>m("GET",`/jurisdictions/${e}`),create:e=>m("POST","/jurisdictions",e),update:(e,t)=>m("PUT",`/jurisdictions/${e}`,t),deactivate:e=>m("DELETE",`/jurisdictions/${e}`)};let nt=0;function J(e,t="default",i=3500){const n=document.getElementById("toast-container"),a=++nt,r=document.createElement("div");return r.className=`toast toast-${t}`,r.id=`toast-${a}`,r.innerHTML=`
    <span>${ot(e)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `,n.appendChild(r),setTimeout(()=>{r.remove()},i),a}function rt(e){return J(e,"default")}function V(e){return J(e,"success")}function b(e){return J(e,"error")}function st(e){return J(e,"warning")}function ot(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const lt=Object.freeze(Object.defineProperty({__proto__:null,showToast:J,toast:rt,toastError:b,toastSuccess:V,toastWarning:st},Symbol.toStringTag,{value:"Module"}));function dt(){if(ae()){x("/dashboard");return}const e=document.getElementById("app");e.innerHTML=`
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
  `;const t=document.getElementById("password"),i=document.getElementById("toggle-password-btn"),n='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',a='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>';i&&t&&i.addEventListener("click",()=>{const s=t.getAttribute("type")==="password"?"text":"password";t.setAttribute("type",s),i.setAttribute("aria-label",s==="password"?"Show password":"Hide password"),i.innerHTML=s==="password"?n:a});const r=document.getElementById("login-error-alert");document.getElementById("login-form").addEventListener("submit",async s=>{s.preventDefault(),r&&(r.classList.add("hidden"),r.textContent="");const d=document.getElementById("login-btn"),l=document.getElementById("email").value.trim(),c=t.value;if(!l||!c){r&&(r.textContent="Please enter both email address and password.",r.classList.remove("hidden"));return}d.disabled=!0,d.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';try{const u=await ve.login(l,c);Pe({token:u.data.token,user:u.data.user}),x("/dashboard")}catch(u){const p=u.message||"Invalid email or password. Please check your credentials.";r&&(r.textContent=p,r.classList.remove("hidden")),b(p),d.disabled=!1,d.innerHTML="Sign In"}})}function ct(){if(ae()){x("/dashboard");return}const e=document.getElementById("app");e.innerHTML=`
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
  `,document.getElementById("signup-form").addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("signup-btn"),n=document.getElementById("name").value.trim(),a=document.getElementById("email").value.trim(),r=document.getElementById("password").value;if(!(!n||!a||!r)){i.disabled=!0,i.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';try{const s=await ve.signup(n,a,r);Pe({token:s.data.token,user:s.data.user}),x("/dashboard")}catch(s){b(s.message||"Signup failed"),i.disabled=!1,i.innerHTML="Create Account"}}})}const ce={initiative:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",grievance:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",park:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",passport:"M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",charter:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",employment:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",volunteer:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",legacy:"M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",feedback:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",survey:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",default:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},Oe={"🌱":"initiative","🚨":"grievance","⚠️":"grievance","🪪":"passport","📜":"charter","💼":"employment","🤝":"volunteer","🏛️":"legacy","🏛":"legacy","💬":"feedback","📢":"feedback","📊":"survey","📋":"survey","🌳":"park","🏞️":"park","🏞":"park","🏗️":"legacy","🏗":"legacy","🛡️":"charter","🛡":"charter","⚡":"default","⚡️":"default"};function R(e,t=20,i=""){const n=Oe[e]||e,a=ce[n]||ce.default;return`<svg width="${t}" height="${t}" class="${i}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${a}"/></svg>`}const pt={Movement:{title:"Start a Civic Initiative",shortTitle:"Civic Initiative",description:"Organize citizens around community goals, public spaces, and urban projects.",category:"Community Action",iconKey:"initiative",actionLabel:"Start Initiative"},Grievance:{title:"Report a Civic Problem",shortTitle:"Civic Problem",description:"Report infrastructure defects, sanitation issues, or public safety concerns.",category:"Public Services",iconKey:"grievance",actionLabel:"Report Issue"},"Park Renovation Request":{title:"Park Renovation Request",shortTitle:"Park Renovation",description:"Propose public park upgrades, playground repairs, or green space restoration.",category:"Urban Infrastructure",iconKey:"park",actionLabel:"Request Renovation"},"Citizen Passport":{title:"Citizen Passport & Contribution",shortTitle:"Citizen Passport",description:"Track community contributions, volunteer hours, and civic engagement history.",category:"Civic Identity",iconKey:"passport",actionLabel:"Update Passport"},"Digital Civic Constitution":{title:"Civic Charter & Guidelines",shortTitle:"Civic Charter",description:"Establish community guidelines, governance rules, and transparency terms.",category:"Governance",iconKey:"charter",actionLabel:"Draft Charter"},"Employment Exchange":{title:"Civic Skills & Employment",shortTitle:"Employment Exchange",description:"Post and discover civic project roles, community jobs, and skill opportunities.",category:"Opportunity",iconKey:"employment",actionLabel:"Post Role"},"Volunteer Management":{title:"Volunteer Operations",shortTitle:"Volunteer Drive",description:"Coordinate volunteer tasks, register community helpers, and track activities.",category:"Community Action",iconKey:"volunteer",actionLabel:"Register Volunteer"},"Legacy & Continuity":{title:"Project Continuity & Legacy",shortTitle:"Project Continuity",description:"Transition completed initiatives into permanent NGOs, startups, or civic centers.",category:"Governance",iconKey:"legacy",actionLabel:"Plan Continuity"},"Public Feedback":{title:"Public Feedback",shortTitle:"Public Feedback",description:"Collect structured community feedback on civic initiatives and public services.",category:"Civic Operations",iconKey:"feedback",actionLabel:"Submit Feedback"},"Public Survey":{title:"Public Survey",shortTitle:"Public Survey",description:"Run community surveys and opinion polls for civic decision-making.",category:"Civic Operations",iconKey:"survey",actionLabel:"Start Survey"}};function j(e){var a;if(!e)return{title:"Civic Capability",shortTitle:"Capability",description:"Metadata-driven civic module.",category:"Civic Operations",iconKey:"default",icon:R("default",16),iconLarge:R("default",24),actionLabel:"Start Action"};const t=e.name||"",i=pt[t];if(i)return{title:i.title,shortTitle:i.shortTitle,description:e.description||i.description,category:i.category,iconKey:i.iconKey,icon:R(i.iconKey,16),iconLarge:R(i.iconKey,24),actionLabel:i.actionLabel,rawName:t};const n=e.icon&&Oe[e.icon]||(e.icon&&ce[e.icon]?e.icon:null)||"default";return{title:t,shortTitle:t,description:e.description||"Metadata-configured civic capability module.",category:((a=e.domain)==null?void 0:a.domain_name)||"Civic Operations",iconKey:n,icon:R(n,16),iconLarge:R(n,24),actionLabel:`Start ${t}`,rawName:t}}function N(e){if(!e)return"Unknown";switch(e.toLowerCase()){case"draft":return"Draft (Unsubmitted)";case"submitted":return"Submitted (Awaiting Review)";case"coordinator_approved":return"Verified (Pending Approval)";case"verified":return"Verified";case"approved":return"Approved & Active";case"rejected":return"Rejected";case"closed":return"Closed";default:return e.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}}function M(e,t="",i=[]){const n=G(),a=Ve();if(!n)return e;const r=window.location.pathname,s=window.location.search;let d=[],l="CIVIC CAPABILITIES";a==="citizen"?d=[{path:"/dashboard",label:"My Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"My Requests",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/modules",label:"Civic Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/reports",label:"Community Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}]:a==="coordinator_area"||a==="coordinator_general"?(d=[{path:"/dashboard",label:"Operations Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"Cases Queue",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],l="ACTIVE CAPABILITIES"):a==="director"?(d=[{path:"/dashboard",label:"Governance Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"All Operations",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/module-builder",label:"Capability Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],l="ACTIVE CAPABILITIES"):(d=[{path:"/dashboard",label:"Civic OS Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/modules",label:"Modules & Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/module-builder",label:"No-Code Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/entities",label:"All Cases & Records",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},{path:"/admin",label:"User & Role Admin",icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"}],l="CAPABILITY METADATA");const c=p=>p.map(f=>`
    <li class="sidebar-nav-item">
      <a href="${f.path}" class="sidebar-nav-link ${r===f.path&&!s?"active":""}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${f.icon}"></path></svg>
        ${S(f.label)}
      </a>
    </li>
  `).join("");let u="";return Array.isArray(i)&&i.length>0&&(u=i.map(p=>{var D;const f=j(p),$=`/entities?entity_type_id=${p.entity_type_id}`,q=s.includes(`entity_type_id=${p.entity_type_id}`);return`
        <li class="sidebar-nav-item">
          <a href="${$}" class="sidebar-nav-link ${q?"active":""}" style="font-size:13px; padding:6px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${R(f.iconKey,16)}
            </span>
            <span class="truncate" style="flex:1;">${S(f.shortTitle)}</span>
            ${((D=p._count)==null?void 0:D.entities)!==void 0?`<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${p._count.entities}</span>`:""}
          </a>
        </li>
      `}).join("")),`
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>
        
        <div class="sidebar-section">
          <div class="sidebar-group-title">NAVIGATION</div>
          <ul class="sidebar-nav">
            ${c(d)}
          </ul>
        </div>

        ${u?`
          <div class="sidebar-section mt-4">
            <div class="sidebar-group-title">${l}</div>
            <ul class="sidebar-nav">
              ${u}
            </ul>
          </div>
        `:""}
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-card" style="cursor:pointer;">
            <div class="user-avatar">${S(n.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${S(n.name)}</div>
              <div class="user-role truncate">${S(Z(a))}</div>
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
              <span style="font-weight:600; color:var(--text-primary);">${S(t)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${S(n.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary);">${S(n.name.split(" ")[0])}</span>
                  <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${S(Z(a))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${S(n.name)}</div>
                  <div class="user-dropdown-role">${S(Z(a))}</div>
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
  `}function E(){const e=document.getElementById("topbar-user-btn"),t=document.getElementById("user-dropdown-menu");e&&t&&(e.addEventListener("click",s=>{s.stopPropagation(),t.classList.toggle("show")}),document.addEventListener("click",s=>{!t.contains(s.target)&&!e.contains(s.target)&&t.classList.remove("show")}));const i=document.getElementById("dropdown-logout-btn");i&&i.addEventListener("click",s=>{s.preventDefault(),Ie(),x("/login")});const n=document.getElementById("sidebar-user-card");n&&n.addEventListener("click",()=>{x("/profile")});const a=document.getElementById("mobile-menu-btn"),r=document.getElementById("sidebar");a&&r&&a.addEventListener("click",()=>{r.classList.toggle("open")})}function S(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function B(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function ut(){if(!H(x))return;const e=G(),t=document.getElementById("app");t.innerHTML=M(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Workspace"),E();try{const n=(await ge.getMetadata().catch(()=>({success:!1,data:{entityTypes:[],rules:[],domains:[]}}))).data||{entityTypes:[],rules:[],domains:[]};let a="My Civic Workspace";e.role==="coordinator_area"||e.role==="coordinator_general"?a="Civic Operations Workspace":e.role==="director"?a="Executive Governance Workspace":e.role==="admin"&&(a="Civic OS Administration"),t.innerHTML=M(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${B(a)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Good day, <strong>${B(e.name)}</strong>. Here is what is happening in your civic workspace.
          </p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `,a,n.entityTypes),E();const r=document.getElementById("dash-content"),s=document.getElementById("dash-actions");e.role==="citizen"?(s.innerHTML=`
        <a href="/modules" class="btn btn-primary btn-lg" style="box-shadow:var(--shadow-md); display:inline-flex; align-items:center; gap:8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Start Civic Action
        </a>
      `,await mt(r,e,n)):e.role==="coordinator_area"?(s.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await vt(r,e,n)):e.role==="coordinator_general"?(s.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await gt(r,e,n)):e.role==="director"?(s.innerHTML='<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>',await ht(r,e,n)):e.role==="admin"&&(s.innerHTML=`
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `,await ft(r,e,n))}catch{b("Failed to load workspace data"),document.getElementById("dash-content").innerHTML='<div class="alert alert-error">Failed to load workspace data. Please try again.</div>'}}async function mt(e,t,i){const a=(await w.list({owner_user_id:t.user_id,limit:20})).data||[],r=a.filter(p=>p.status==="draft").length,s=a.filter(p=>["submitted","coordinator_approved","in_review"].includes(p.status)).length,d=a.filter(p=>["approved","closed","rejected"].includes(p.status)).length,l=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${s}</div>
        <div class="kpi-label">Active Requests</div>
      </div>
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${r}</div>
        <div class="kpi-label">Draft Cases</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${d}</div>
        <div class="kpi-label">Completed</div>
      </div>
    </div>
  `,u=(i.entityTypes||[]).map(p=>{const f=j(p);return`
      <div class="card capability-card" style="padding:16px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:10px; background:rgba(255, 90, 54, 0.12); color:var(--primary); margin-bottom:10px;">
            ${R(f.iconKey,20)}
          </div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); margin-bottom:4px;">${B(f.title)}</div>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
            ${B(f.description)}
          </p>
        </div>
        <a href="/entities/new?entity_type_id=${p.entity_type_id}" class="btn btn-translucent-orange btn-sm" style="text-align:center;">
          ${B(f.actionLabel)} →
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
      ${re(a.slice(0,5))}
    </div>

    <!-- Available Civic Capabilities -->
    <div class="mb-6">
      <div style="font-weight:700; font-size:1.1rem; color:var(--text-primary); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span>Civic Capabilities</span>
        <a href="/modules" style="font-size:0.85rem; color:var(--primary); text-decoration:none;">View All Capabilities →</a>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px;">
        ${u||'<div class="text-muted p-4">No civic capabilities currently published.</div>'}
      </div>
    </div>
  `}async function vt(e,t,i){var s;const n=t.assignedArea,a=await w.list({status:"submitted",area:n,limit:10}),r=a.data||[];e.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${B(n||"Sector 5")}</div>
      <span class="badge badge-primary">Area Coordinator</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((s=a.pagination)==null?void 0:s.total)||r.length}</div>
        <div class="kpi-label">Pending Area Verification</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Submitted cases in ${B(n||"Sector 5")} awaiting verification</div>
        </div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${re(r,!0)}
    </div>
  `}async function gt(e,t,i){var r;const n=await w.list({status:"submitted",area:"Unassigned",limit:10}),a=n.data||[];e.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (Handling Unassigned Areas & Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((r=n.pagination)==null?void 0:r.total)||a.length}</div>
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
      ${re(a,!0)}
    </div>
  `}async function ht(e,t,i){var r;const n=await w.list({status:"coordinator_approved",limit:10}),a=n.data||[];e.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((r=n.pagination)==null?void 0:r.total)||a.length}</div>
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
      ${re(a,!0)}
    </div>
  `}async function ft(e,t,i){var s,d,l;const[n,a,r]=await Promise.all([w.list({limit:1}),w.list({status:"submitted",limit:1}),w.list({status:"approved",limit:1})]);e.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${((s=n.pagination)==null?void 0:s.total)||0}</div>
        <div class="kpi-label">Total System Cases</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((d=a.pagination)==null?void 0:d.total)||0}</div>
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
  `}function re(e,t=!1){if(!e||e.length===0)return`
      <div class="table-empty" style="padding:32px; text-align:center; color:var(--text-muted);">
        <p style="font-size:0.9rem; font-weight:500;">No active cases in this view.</p>
      </div>
    `;const i=e.map(n=>{var a,r;return`
    <tr>
      <td><a href="/entities/${n.entity_id}" class="text-link font-medium">#${n.entity_id}</a></td>
      <td>
        <a href="/entities/${n.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
          ${B(n.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${B(((a=n.entityType)==null?void 0:a.name)||"Capability")}</span></td>
      ${t?`<td>${B(((r=n.owner)==null?void 0:r.name)||"System")}</td>`:""}
      <td>${B(n.area||"—")}</td>
      <td><span class="badge badge-${n.status}">${N(n.status)}</span></td>
      <td><a href="/entities/${n.entity_id}" class="btn btn-secondary btn-sm">Review →</a></td>
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
  `}function I(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let y={page:1,limit:20},K=[];async function yt(e={},t=null){if(!H(x))return;const i=t||new URLSearchParams(window.location.search);i.has("status")?y.status=i.get("status"):delete y.status,i.has("entity_type_id")?y.entity_type_id=i.get("entity_type_id"):delete y.entity_type_id,i.has("name")?y.name=i.get("name"):delete y.name,i.has("page")?y.page=Number(i.get("page")):y.page=1;try{K=(await w.listTypes().catch(()=>({data:[]}))).data||[]}catch{K=[]}const n=K.find(u=>String(u.entity_type_id)===String(y.entity_type_id)),a=j(n),r=n?`${a.title} Cases`:"All Cases & Requests",s=n?`Browsing cases for capability "${a.title}".`:"Browse, search, and track all civic cases and requests across your workspace.",d=document.getElementById("app");d.innerHTML=M(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${I(r)}</h1>
        <p id="entities-header-subtitle">${I(s)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${y.entity_type_id?`?entity_type_id=${y.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
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
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${I(y.name||"")}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${K.map(u=>{const p=j(u);return`<option value="${u.entity_type_id}" ${String(y.entity_type_id)===String(u.entity_type_id)?"selected":""}>${I(p.title)}</option>`}).join("")}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${y.status==="draft"?"selected":""}>Draft</option>
            <option value="submitted" ${y.status==="submitted"?"selected":""}>Submitted</option>
            <option value="coordinator_approved" ${y.status==="coordinator_approved"?"selected":""}>Verified (Pending Approval)</option>
            <option value="approved" ${y.status==="approved"?"selected":""}>Approved & Active</option>
            <option value="rejected" ${y.status==="rejected"?"selected":""}>Rejected</option>
            <option value="closed" ${y.status==="closed"?"selected":""}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${y.status||y.entity_type_id||y.name?`
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
  `,r,K),E();const l=()=>{const u=document.getElementById("filter-status").value,p=document.getElementById("filter-type").value,f=document.getElementById("filter-search").value.trim(),$=new URLSearchParams;u&&$.set("status",u),p&&$.set("entity_type_id",p),f&&$.set("name",f),x(`/entities${$.toString()?"?"+$.toString():""}`)};document.getElementById("btn-filter").addEventListener("click",l),document.getElementById("filter-search").addEventListener("keypress",u=>{u.key==="Enter"&&l()});const c=document.getElementById("btn-clear-filter");c&&c.addEventListener("click",()=>{x("/entities")}),await bt()}async function bt(){const e=document.getElementById("entities-content");if(e)try{const t=await w.list(y),{data:i,pagination:n}=t;if(!i||i.length===0){e.innerHTML=`
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
            <a href="/entities/new${y.entity_type_id?`?entity_type_id=${y.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;return}const a=i.map(c=>{var p;const u=j(c.entityType);return`
        <tr>
          <td><a href="/entities/${c.entity_id}" class="text-link font-medium">#PR-${String(c.entity_id).padStart(5,"0")}</a></td>
          <td>
            <a href="/entities/${c.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${I(c.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${I(u.shortTitle)}</span></td>
          <td>${I(((p=c.owner)==null?void 0:p.name)||"System")}</td>
          <td>${I(c.area||"—")}</td>
          <td><span class="badge badge-${c.status}">${N(c.status)}</span></td>
          <td>
            <a href="/entities/${c.entity_id}" class="btn btn-secondary btn-sm">Review Case →</a>
          </td>
        </tr>
      `}).join(""),r=Math.ceil(n.total/n.limit);let s="";r>1&&(s=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 8px;">
          <div style="font-size:0.85rem; color:var(--text-muted);">
            Showing page ${n.page} of ${r} (${n.total} total cases)
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-prev" ${n.page<=1?"disabled":""}>← Previous</button>
            <button class="btn btn-secondary btn-sm" id="btn-next" ${n.page>=r?"disabled":""}>Next →</button>
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
              ${a}
            </tbody>
          </table>
        </div>
      </div>
      ${s}
    `;const d=document.getElementById("btn-prev"),l=document.getElementById("btn-next");d&&d.addEventListener("click",()=>{const c=new URLSearchParams(window.location.search);c.set("page",String(y.page-1)),x(`/entities?${c.toString()}`)}),l&&l.addEventListener("click",()=>{const c=new URLSearchParams(window.location.search);c.set("page",String(y.page+1)),x(`/entities?${c.toString()}`)})}catch{b("Failed to load cases"),e.innerHTML='<div class="alert alert-error">Error loading cases. Please try again.</div>'}}let te=null;function pe({title:e,content:t,footer:i="",onClose:n=()=>{}}){U();const a=document.getElementById("modal-container"),r=`
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${xt(e)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${t}
      </div>
      ${i?`<div class="modal-footer">${i}</div>`:""}
    </div>
  `;a.innerHTML=r,a.style.pointerEvents="auto";const s=()=>{a.innerHTML="",a.style.pointerEvents="none",te=null,n()};te=s,document.getElementById("modal-close-btn").addEventListener("click",s),document.getElementById("modal-backdrop").addEventListener("click",s);const d=l=>{l.key==="Escape"&&(s(),document.removeEventListener("keydown",d))};document.addEventListener("keydown",d)}function U(){te&&te()}function xt(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function g(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function he({id:e}){const t=String(e||"").split("?")[0].split("#")[0];if(!t||t==="new"){x("/entities/new"+(window.location.search||""));return}if(!H(x))return;const i=G(),n=document.getElementById("app");n.innerHTML=M(`
    <div class="page-header mb-4">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">My Requests</a> / Case #${t}</div>
        <h1 id="header-title">Loading Case...</h1>
      </div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,`Case #${t}`),E();try{const[a,r,s,d,l]=await Promise.all([w.get(t),Ne.list(t).catch(()=>({data:[]})),w.audit(t).catch(()=>({data:{auditLogs:[],approvalHistory:[]}})),w.getLineage(t).catch(()=>({data:{current:null,parent:null,children:[],rules:[]}})),w.workflow(t).catch(()=>({data:{allowedTransitions:[]}}))]),c=a.data,u=r.data||[],p=s.data||{auditLogs:[],approvalHistory:[]},f=d.data||{current:null,parent:null,children:[],rules:[]},$=l.data||{allowedTransitions:[]};let q=[];try{q=(await ne.list({entity_type_id:c.entity_type_id})).data||[]}catch{q=[]}document.getElementById("header-title").textContent=c.name,wt(document.getElementById("detail-content"),c,u,p,f,$,q,i)}catch(a){console.error("Failed to load case detail:",a),b("Failed to load case details"),document.getElementById("detail-content").innerHTML=`<div class="alert alert-error">Failed to load case #${t}. It may not exist.</div>`}}function wt(e,t,i,n,a,r,s,d){var $e,_e;const l=j(t.entityType),c=["draft","submitted","coordinator_approved","approved"],u=c.indexOf(t.status)!==-1?c.indexOf(t.status):-1,p=t.status==="rejected";let f='<div class="workflow-steps mt-4 mb-2">';c.forEach((v,L)=>{const W=L<u||L===u&&!p&&t.status==="approved",Ke=L===u&&t.status!=="approved";f+=`
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${p&&L===u?"rejected":W?"done":Ke?"current":""}">${L+1}</div>
          <div class="workflow-step-label mt-1">${_t(v)}</div>
        </div>
        ${L<c.length-1?`<div class="workflow-step-connector ${W?"done":""}"></div>`:""}
      </div>
    `}),p&&(f+=`
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `),f+="</div>";const $=kt(t,r.allowedTransitions||[],d),q=d&&["coordinator_area","coordinator_general","director","admin"].includes(d.role);let D="";q&&t.status!=="deleted"&&(D=`
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
    `);let fe="";a.children&&a.children.length>0&&(fe=`
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
                This case approval automatically triggered <strong>${a.children.length} related civic record(s)</strong> via configured metadata automation rules.
              </p>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${a.children.map(v=>`
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(v.entity_id).padStart(5,"0")} ${g(v.name)}</strong>
                      <span class="badge badge-secondary ml-2">${g(v.type_name)}</span>
                    </div>
                    <a href="/entities/${v.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);const Ue=i.map(v=>{var L,W;return`
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${g(((L=v.parameterMaster)==null?void 0:L.label)||((W=v.parameterMaster)==null?void 0:W.field_key)||`Parameter #${v.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${g(v.value||"—")}</td>
    </tr>
  `}).join(""),ye=i.length>0?`<div class="table-container"><table class="table"><tbody>${Ue}</tbody></table></div>`:'<div class="text-muted p-4">No custom parameter values submitted for this case.</div>',be=n.auditLogs||[];n.approvalHistory;const Ge=be.map(v=>`
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${g(v.user||"System")}</strong> (${g(v.role||"User")})</span>
        <span>${new Date(v.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${v.action==="status_transition"?`Status Transition: <strong>${N(v.old_status)}</strong> → <strong>${N(v.new_status)}</strong>`:`Action Executed: <strong>${v.action}</strong>`}
      </div>
      ${v.reason?`<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${g(v.reason)}"</div>`:""}
    </div>
  `).join(""),We=be.length>0?`<div>${Ge}</div>`:'<div class="text-muted p-4">No audit logs recorded yet for this case.</div>';let xe="";s.length>0&&(xe=`
      <div class="card mb-6" style="border-top:3px solid var(--green-600);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Civic Reports
          </div>
          <span class="badge badge-success">${s.length} Reports</span>
        </div>
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${s.map(v=>`
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${v.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${g(v.report_name)}"
              </button>
            `).join("")}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `);let we="";(a.parent||a.children&&a.children.length>0)&&(we=`
      <div class="card mb-6" style="border-top:3px solid var(--primary);">
        <div class="card-header">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Civic Lineage
          </div>
          <div class="card-subtitle">Connected parent and auto-created child civic activities</div>
        </div>
        <div class="card-body" style="padding:16px;">
          ${a.parent?`
            <div style="margin-bottom:12px; padding:12px; background:var(--primary-light); border:1px solid var(--primary-border); border-radius:6px; font-size:13px;">
              <div style="font-size:0.75rem; color:var(--primary); font-weight:700; text-transform:uppercase; margin-bottom:2px;">Parent Case</div>
              <a href="/entities/${a.parent.entity_id}" class="text-link font-medium">#PR-${String(a.parent.entity_id).padStart(5,"0")} ${g(a.parent.name)} (${g((($e=a.parent.entityType)==null?void 0:$e.name)||"Capability")})</a>
            </div>
          `:""}
          ${a.children&&a.children.length>0?`
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${a.children.map(v=>`
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${v.entity_id}" class="text-link font-medium">#PR-${String(v.entity_id).padStart(5,"0")} ${g(v.name)}</a>
                    <span class="badge badge-secondary ml-2">${g(v.type_name)}</span>
                  </div>
                  <span class="badge badge-${v.status}">${N(v.status)}</span>
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
              <span class="badge badge-primary font-semibold">${g(l.title)}</span>
              <span class="badge badge-${t.status}">${N(t.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${g(t.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${g(((_e=t.owner)==null?void 0:_e.name)||"System")}</strong> • Jurisdiction Area: <strong>${g(t.area||"—")}</strong> • Location: <strong>${g(t.location||"—")}</strong>
            </div>
          </div>
        </div>
        ${f}
      </div>
    </div>

    ${fe}
    ${D}
    ${xe}
    ${we}

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
            ${ye}
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
              ${$}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const Y=document.getElementById("tab-info"),Q=document.getElementById("tab-audit"),se=document.getElementById("tab-content");Y&&Q&&se&&(Y.addEventListener("click",()=>{Y.classList.add("active"),Q.classList.remove("active"),se.innerHTML=ye}),Q.addEventListener("click",()=>{Q.classList.add("active"),Y.classList.remove("active"),se.innerHTML=We}));const ke=document.getElementById("btn-generate-ai");ke&&ke.addEventListener("click",()=>Lt(t.entity_id)),document.querySelectorAll(".execute-rep-btn").forEach(v=>{v.addEventListener("click",()=>{const L=v.getAttribute("data-repid");Et(L)})}),Ct(t.entity_id)}function kt(e,t,i){const n=[],a=e.status||"draft";return Array.isArray(t)&&t.length>0&&t.forEach(r=>{const s=r.action||r.to_status,d=s==="rejected",l=$t(a,s),c=d?"btn-danger":"btn-primary";n.push(`
        <button class="btn ${c} btn-full wf-action-btn mt-2" 
          data-to="${g(s)}" 
          data-label="${g(l)}"
          data-reason="${d?"true":"false"}">
          ${g(l)}
        </button>
      `)}),i&&i.role==="admin"&&n.push(`
      <button class="btn btn-secondary btn-full mt-3" id="btn-fire-rules" data-rule="true" style="display:inline-flex; align-items:center; gap:8px; justify-content:center;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Execute Automation Rules
      </button>
    `),n.length===0?`<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${g((i==null?void 0:i.role)||"user")}) at status "${g(N(a))}".</div>`:n.join("")}function $t(e,t){return e==="draft"&&t==="submitted"?"Submit Request":e==="submitted"&&t==="verified"?"Verify Request (Coordinator)":e==="submitted"&&t==="coordinator_approved"?"Verify & Approve Request":e==="verified"&&t==="approved"||e==="coordinator_approved"&&t==="approved"?"Executive Approval (Director)":t==="rejected"?"Reject Request":`Transition to ${t}`}function _t(e){return e==="draft"?"Draft":e==="submitted"?"Submitted":e==="coordinator_approved"?"Coord Approved":e==="verified"?"Verified":e==="approved"?"Approved":e==="rejected"?"Rejected":e}function Ct(e){const t=n=>{const a=n.getAttribute("data-to"),r=n.getAttribute("data-label")||`Transition to ${a}`,s=n.getAttribute("data-reason")==="true";if(n.getAttribute("data-rule")==="true"){Mt(e);return}s?(pe({title:"Provide Reason for Rejection",content:`
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",U),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{const l=document.getElementById("action-reason").value.trim();if(!l){b("Reason is required for rejection");return}U(),Le(e,a,l)})):(pe({title:`Confirm Action: ${r}`,content:`
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${g(r)}</strong> for case #${e}?
          </p>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",U),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{U(),Le(e,a,null)}))};document.querySelectorAll(".wf-action-btn, #btn-fire-rules").forEach(n=>{n.addEventListener("click",()=>t(n))})}async function Le(e,t,i){try{const n=await w.transition(e,t,i);V(n.message||`Status updated to ${t}`),he({id:e})}catch(n){b(n.message||"Transition failed")}}async function Mt(e){var t,i;try{const n=await w.fireRules(e,"approved");V(`Rule Engine executed! ${((i=(t=n.data)==null?void 0:t.createdEntities)==null?void 0:i.length)||0} entity created.`),he({id:e})}catch(n){b(n.message||"Rule trigger failed")}}async function Et(e){const t=document.getElementById("report-result-output");if(t){t.style.display="block",t.innerHTML='<div class="spinner spinner-sm"></div> Running report...';try{const n=(await ne.execute(e)).data;let a=(n.rows||[]).map(r=>{var s;return`
      <tr>
        <td>${g(r[n.groupBy]||r.area||"Total")}</td>
        <td style="font-weight:bold;">${r[(s=n.metric)==null?void 0:s.toLowerCase()]||r.count||r.total_count||0}</td>
      </tr>
    `}).join("");t.innerHTML=`
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${g(n.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${g(n.groupBy||"Group")}</th><th>${g(n.metric)}</th></tr></thead>
          <tbody>${a}</tbody>
        </table>
      </div>
    `}catch(i){t.innerHTML=`<div class="alert alert-error">Report execution failed: ${g(i.message)}</div>`}}}async function Lt(e){const t=document.getElementById("ai-report-body");if(t){t.innerHTML=`
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:var(--primary); margin:0 auto 12px auto;"></div>
      <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Running Civic Intelligence Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Evaluating observations, patterns, recommendations, and evidence.</div>
    </div>
  `;try{const i=await w.aiAnalysis(e);V("Civic Intelligence Analysis generated successfully!"),t.innerHTML=St(i.data)}catch(i){b(i.message||"Could not generate AI report"),t.innerHTML=`<div class="alert alert-error">AI Analysis failed: ${g(i.message)}</div>`}}}function St(e){return`
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px;">1. Observations (Problem Scope)</strong>
        <p style="margin-top:4px;">${g(e.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px;">2. Patterns & Root Cause Analysis</strong>
        <p style="margin-top:4px;">${g(Array.isArray(e.root_cause_analysis)?e.root_cause_analysis.join("; "):e.root_cause_analysis)}</p>
      </div>

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px;">3. Recommendations for Consideration</strong>
        <p style="margin-top:4px;">${g(Array.isArray(e.actionable_recommendations)?e.actionable_recommendations.join("; "):e.actionable_recommendations)}</p>
      </div>

      <div style="padding:10px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700);">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <strong>Evidence & Disclaimer:</strong> AI-generated analytical report. Verify all evidence before taking formal administrative action.
      </div>
    </div>
  `}const z=[{type:"country",label:"Country"},{type:"state",label:"State / Province"},{type:"city",label:"City / District"},{type:"ward",label:"Ward / Local Area"}];class Tt{constructor(t,i={}){this._container=t,this._required=i.required||!1,this._onChange=i.onChange||null,this._prefix=i.labelPrefix||"jsel",this._selected=[],this._selects=[],this._hiddenInput=null,this._destroyed=!1}async init(){this._render(),await this._loadLevel(0,null)}getValue(){const t=this._selected[this._selected.length-1];return t?{jurisdiction_id:t.jurisdiction_id,display_path:this._selected.map(i=>i.name).join(" › ")}:null}async setValue(t){if(t)try{const i=await Ee.get(t),{path:n}=i.data;this._selected=[];for(let r=0;r<n.length;r++){await this._loadLevel(r,r===0?null:n[r-1].jurisdiction_id);const s=this._selects[r];s&&(s.value=String(n[r].jurisdiction_id)),this._selected[r]=n[r]}this._syncHidden(),this._notifyChange();const a=n.length;if(a<z.length){const r=n[n.length-1].jurisdiction_id;await this._loadLevel(a,r)}}catch(i){console.warn("[JurisdictionSelector] setValue failed:",i)}}destroy(){this._destroyed=!0,this._container.innerHTML="",this._selects=[],this._hiddenInput=null,this._selected=[]}_render(){this._container.innerHTML="",this._container.classList.add("jurisdiction-selector");const t=document.createElement("div");t.className="jurisdiction-selector-grid",t.style.cssText="display:flex; flex-wrap:wrap; gap:12px;",z.forEach((n,a)=>{const r=document.createElement("div");r.className="form-group",r.style.cssText="flex:1; min-width:160px; margin-bottom:0;",r.id=`${this._prefix}-group-${a}`;const s=this._required&&a===0?'<span class="required">*</span>':"",d=document.createElement("label");d.className="form-label",d.setAttribute("for",`${this._prefix}-sel-${a}`),d.innerHTML=`${n.label} ${s}`;const l=document.createElement("select");l.className="form-control",l.id=`${this._prefix}-sel-${a}`,l.name=`_jurisdiction_level_${a}`,l.disabled=!0,l.innerHTML=`<option value="">-- ${n.label} --</option>`,l.addEventListener("change",()=>this._onLevelChange(a,l)),r.appendChild(d),r.appendChild(l),t.appendChild(r),this._selects[a]=l}),this._container.appendChild(t);const i=document.createElement("input");i.type="hidden",i.name="_jurisdiction_id",i.id=`${this._prefix}-hidden`,i.value="",this._container.appendChild(i),this._hiddenInput=i}async _loadLevel(t,i){if(this._destroyed)return;const n=this._selects[t];if(n){n.disabled=!0,n.innerHTML='<option value="">Loading…</option>';try{const a=i==null?{}:{parent_id:String(i)},s=(await Ee.list(a)).data||[];if(this._destroyed)return;if(s.length===0){const l=z[t];n.innerHTML=`<option value="">-- No ${l.label} available --</option>`,this._clearLevelsFrom(t+1);return}const d=z[t];n.innerHTML=`<option value="">-- ${d.label} --</option>`,s.forEach(l=>{const c=document.createElement("option");c.value=String(l.jurisdiction_id),c.textContent=l.name,n.appendChild(c)}),n.disabled=!1}catch(a){console.warn("[JurisdictionSelector] Failed to load level",t,a);const r=z[t];n.innerHTML=`<option value="">-- Error loading ${r.label} --</option>`}}}async _onLevelChange(t,i){const n=i.value;if(this._clearLevelsFrom(t+1),this._selected=this._selected.slice(0,t),!n){this._syncHidden(),this._notifyChange();return}const a=Number(n),r=i.options[i.selectedIndex];this._selected[t]={jurisdiction_id:a,name:r?r.textContent.trim():String(a),type:z[t].type},this._syncHidden(),this._notifyChange();const s=t+1;s<z.length&&await this._loadLevel(s,a)}_clearLevelsFrom(t){for(let i=t;i<z.length;i++){const n=this._selects[i];n&&(n.innerHTML=`<option value="">-- ${z[i].label} --</option>`,n.disabled=!0,n.value="")}this._selected=this._selected.slice(0,t)}_syncHidden(){if(!this._hiddenInput)return;const t=this.getValue();this._hiddenInput.value=t?String(t.jurisdiction_id):""}_notifyChange(){const t=this.getValue();this._onChange&&this._onChange(t),this._container.dispatchEvent(new CustomEvent("jurisdiction:change",{bubbles:!0,detail:t}))}}function A(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let ue=null,T=null,P=[],F=null,O=null;const At=new Set(["title","name","area","jurisdiction","jurisdiction_id","location","landmark"]);function Bt(e){const t=String(e.field_key||"").trim().toLowerCase();return At.has(t)}async function jt(e={},t=null){if(!H(x))return;try{P=(await w.listTypes().catch(()=>({data:[]}))).data||[]}catch{P=[]}const i=t||new URLSearchParams(window.location.search);i.has("entity_type_id")?T=Number(i.get("entity_type_id")):P.length>0&&(T=P[0].entity_type_id);const n=P.find(s=>Number(s.entity_type_id)===Number(T));F=j(n);const a=document.getElementById("app");a.innerHTML=M(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${A(F.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${P.map(s=>{const d=j(s);return`<option value="${s.entity_type_id}" ${Number(T)===Number(s.entity_type_id)?"selected":""}>${A(d.title)}</option>`}).join("")}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `,F.title,P),E(),document.getElementById("entity-type-select").addEventListener("change",async s=>{const d=s.target.value;if(!d){document.getElementById("dynamic-form-container").innerHTML="",ue=null;return}T=Number(d);const l=P.find(c=>Number(c.entity_type_id)===Number(T));F=j(l),document.getElementById("page-capability-title").textContent=F.title,window.history.replaceState({},"",`/entities/new?entity_type_id=${T}`),await Se(T)}),T&&await Se(T)}async function Se(e){O&&(O.destroy(),O=null);const t=document.getElementById("dynamic-form-container");t.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{ue=(await ge.schema(e)).data,Rt(t,ue),await zt()}catch(i){console.error("Form schema load error:",i),b("Failed to load form schema"),t.innerHTML='<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>'}}async function zt(){const e=document.getElementById("jurisdiction-selector-mount");e&&(O=new Tt(e,{required:!0,labelPrefix:"ent-jsel"}),await O.init())}function Rt(e,t){if(!t||!t.sections||t.sections.length===0){e.innerHTML='<div class="alert alert-warning">This capability has no form fields configured yet.</div>';return}let i=`
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${A(F.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(t.configuration_errors)&&t.configuration_errors.length>0?`<div class="alert alert-warning m-4">${A(t.configuration_errors.join(" "))}</div>`:""}

      <form id="dynamic-form" style="padding:24px;">
  `;i+=`
    <div class="form-section mb-6">
      <div class="form-section-title">About the Request</div>
      <div class="form-section-subtitle">Basic identification fields for your submission</div>
      
      <div class="form-row mt-4">
        <div class="form-group" style="flex:1;">
          <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
          <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the request or issue">
        </div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label">Jurisdiction <span class="required">*</span></label>
        <div id="jurisdiction-selector-mount"></div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label" for="base_location">Location Details / Street Address</label>
        <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or landmark">
      </div>
    </div>
  `,t.sections.forEach(n=>{i+=`
      <div class="form-section mb-6">
        <div class="form-section-title">${A(n.section_name||n.title)}</div>
        ${n.description?`<div class="form-section-subtitle">${A(n.description)}</div>`:""}
    `,(n.subsections||[]).forEach(a=>{a.subsection_name&&a.subsection_name!=="Main"&&(i+=`<div class="form-subsection mt-3"><div class="form-subsection-title">${A(a.subsection_name)}</div>`),i+='<div class="form-row mt-3">',(a.parameters||[]).forEach(r=>{if(Bt(r)||!String(r.field_key||"").trim()||!String(r.label||"").trim())return;const s=r.mandatory||r.is_mandatory,d=s?"required":"",l=s?'<span class="required">*</span>':"",c=`param_${r.parameter_id}`,u=(r.field_type||r.data_type||"text").toLowerCase();if(i+=`<div class="form-group" style="flex:1; min-width:200px;">
          <label class="form-label">${A(r.label||r.field_key)} ${l}</label>`,u==="textarea")i+=`<textarea name="${c}" class="form-control" rows="3" ${d}></textarea>`;else if(u==="number")i+=`<input type="number" name="${c}" class="form-control" ${d}>`;else if(u==="date")i+=`<input type="date" name="${c}" class="form-control" ${d}>`;else if(u==="checkbox")i+=`
            <div class="check-group mt-2">
              <input type="checkbox" name="${c}" id="${c}" value="true">
              <label for="${c}">Yes</label>
            </div>
          `;else if(u==="select"){const p=r.meta_options||(r.options?Array.isArray(r.options)?r.options:r.options.choices:null)||["Option 1","Option 2"];i+=`<select name="${c}" class="form-control" ${d}>
            <option value="">-- Select Option --</option>
            ${p.map(f=>`<option value="${A(f)}">${A(f)}</option>`).join("")}
          </select>`}else i+=`<input type="text" name="${c}" class="form-control" ${d}>`;i+="</div>"}),i+="</div>",a.subsection_name&&a.subsection_name!=="Main"&&(i+="</div>")}),i+="</div>"}),i+=`
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
  `,e.innerHTML=i,document.getElementById("dynamic-form").addEventListener("submit",Pt)}async function Pt(e){e.preventDefault();const t=document.getElementById("form-validation-alert");t&&(t.classList.add("hidden"),t.textContent="");const i=document.getElementById("submit-form-btn");i.disabled=!0,i.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';try{const n=new FormData(e.target),a=Object.fromEntries(n.entries());if(!a._base_name)throw new Error("Title is a required field.");const r=O?O.getValue():null;if(!r)throw new Error("Please select a jurisdiction (at minimum a Country) before submitting.");const s={entity_type_id:T,name:a._base_name.trim(),jurisdiction_id:r.jurisdiction_id,area:r.display_path,location:a._base_location?a._base_location.trim():null,status:"submitted"},l=(await w.create(s)).data.entity_id,c=[];for(const[u,p]of n.entries())if(u.startsWith("param_")){const f=Number(u.replace("param_",""));p!=null&&String(p).trim()!==""&&c.push({parameter_id:f,value:String(p).trim()})}c.length>0&&await Ne.create(l,c),V("Request submitted successfully!"),It(l,a._base_name)}catch(n){const a=n.message||"Failed to submit request";t&&(t.textContent=a,t.classList.remove("hidden")),b(a),i.disabled=!1,i.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request'}}function It(e,t){const i=document.getElementById("dynamic-form-container"),n=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});i.innerHTML=`
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
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${A(t)}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Submission Date</div>
            <div style="color:var(--text-secondary); margin-top:2px;">${n}</div>
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
  `}let ie=[];async function Ht(){if(!qe(["admin"],x))return;const e=document.getElementById("app");e.innerHTML=M(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>User Management</h1>
        <p>Manage system users, assign roles, and allocate areas to coordinators.</p>
      </div>
    </div>
    
    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Admin"),E(),await Fe()}async function Fe(){const e=document.getElementById("admin-content");try{ie=(await De.listUsers({limit:50})).data,Vt(e)}catch{b("Failed to load users"),e.innerHTML='<div class="alert alert-error">Failed to load users data.</div>'}}function Vt(e){if(ie.length===0){e.innerHTML='<div class="card"><div class="table-empty">No users found in the system.</div></div>';return}const t=ie.map(i=>`
    <tr>
      <td>${i.user_id}</td>
      <td class="font-medium">${oe(i.name)}</td>
      <td class="text-muted">${oe(i.email)}</td>
      <td><span class="badge badge-role-${i.role}">${qt(i.role)}</span></td>
      <td>${oe(i.assignedArea||"—")}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="window.editUserRole(${i.user_id})">Change Role</button></td>
    </tr>
  `).join("");e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <div class="card-title">System Users</div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Area</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${t}
          </tbody>
        </table>
      </div>
    </div>
  `}window.editUserRole=e=>{const t=ie.find(i=>i.user_id===e);t&&(pe({title:`Change Role: ${t.name}`,content:`
      <form id="role-form">
        <div class="form-group">
          <label class="form-label">Role</label>
          <select id="new-role" class="form-control">
            <option value="citizen" ${t.role==="citizen"?"selected":""}>Citizen</option>
            <option value="coordinator_area" ${t.role==="coordinator_area"?"selected":""}>Area Coordinator</option>
            <option value="coordinator_general" ${t.role==="coordinator_general"?"selected":""}>General Coordinator</option>
            <option value="director" ${t.role==="director"?"selected":""}>Director</option>
            <option value="admin" ${t.role==="admin"?"selected":""}>Admin</option>
          </select>
        </div>
        <div class="form-group" id="area-group" style="${t.role==="coordinator_area"?"":"display:none;"}">
          <label class="form-label">Assigned Area <span class="required">*</span></label>
          <select id="new-area" class="form-control">
            <option value="">-- Select Area --</option>
            <option value="North District" ${t.assignedArea==="North District"?"selected":""}>North District</option>
            <option value="South District" ${t.assignedArea==="South District"?"selected":""}>South District</option>
            <option value="East District" ${t.assignedArea==="East District"?"selected":""}>East District</option>
            <option value="West District" ${t.assignedArea==="West District"?"selected":""}>West District</option>
            <option value="Central" ${t.assignedArea==="Central"?"selected":""}>Central</option>
          </select>
          <div class="form-hint">Required for Area Coordinators</div>
        </div>
      </form>
    `,footer:`
      <button class="btn btn-ghost" onclick="document.getElementById('modal-close-btn').click()">Cancel</button>
      <button class="btn btn-primary" id="save-role-btn">Save Changes</button>
    `,onClose:()=>{}}),document.getElementById("new-role").addEventListener("change",i=>{const n=i.target.value==="coordinator_area";document.getElementById("area-group").style.display=n?"block":"none"}),document.getElementById("save-role-btn").addEventListener("click",async()=>{const i=document.getElementById("new-role").value,n=document.getElementById("new-area").value;if(i==="coordinator_area"&&!n){b("Please select an assigned area");return}const a=document.getElementById("save-role-btn");a.disabled=!0,a.textContent="Saving...";try{await De.setRole(e,i,i==="coordinator_area"?n:null),V("User role updated"),U(),Fe()}catch(r){b(r.message||"Failed to update role"),a.disabled=!1,a.textContent="Save Changes"}}))};function qt(e){return e?e.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"Unknown"}function oe(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Dt(){if(!H(x))return;const e=G(),t=document.getElementById("app");t.innerHTML=M(`
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
              <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-primary);">${le(e.name)}</h2>
              <p style="font-size:0.875rem; color:var(--text-muted);">${le(e.email)}</p>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">User ID</label>
            <div class="font-mono text-muted" style="font-size:0.9rem;">#${e.user_id}</div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Assigned Role</label>
            <div><span class="badge badge-primary">${Z(e.role)}</span></div>
          </div>
          
          ${e.assignedArea?`
            <div class="form-group">
              <label class="form-label">Jurisdiction Area</label>
              <div style="font-weight:600; color:var(--text-primary);">${le(e.assignedArea)}</div>
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
  `,"Profile"),E();const i=document.getElementById("change-password-form");i&&i.addEventListener("submit",async n=>{n.preventDefault();const a=document.getElementById("password-alert");a.classList.add("hidden"),a.textContent="";const r=document.getElementById("current_password").value,s=document.getElementById("new_password").value,d=document.getElementById("confirm_password").value;if(s!==d){a.textContent="New password and confirmation do not match.",a.classList.remove("hidden");return}const l=document.getElementById("btn-change-pwd");l.disabled=!0,l.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Updating...';try{await ve.changePassword(r,s),V("Password updated successfully!"),i.reset(),l.disabled=!1,l.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}catch(c){const u=c.message||"Failed to update password";a.textContent=u,a.classList.remove("hidden"),b(u),l.disabled=!1,l.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}})}function le(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function h(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}let o={step:1,basics:{name:"",description:"",icon:"📋",domain_id:1},form:{name:"",sections:[{id:"sec_1",name:"General Information",parameters:[{id:"param_1",label:"Title",field_key:"title",field_type:"text",mandatory:!0,options:[]},{id:"param_2",label:"Area",field_key:"area",field_type:"select",mandatory:!0,options:["Sector 5","Sector 12","Pune North","Pune South","Pune Central"]}]}]},workflow:{transitions:[{from:"draft",to:"submitted",role:"citizen"},{from:"submitted",to:"coordinator_approved",role:"coordinator_area"},{from:"submitted",to:"rejected",role:"coordinator_area"},{from:"coordinator_approved",to:"approved",role:"director"},{from:"coordinator_approved",to:"rejected",role:"director"}]},rule:{enabled:!1,target_entity_type_id:"",event:"approved"},report:{enabled:!0,name:"",groupBy:"area",metric:"COUNT",metricField:"",publicStats:!0},existingTypes:[],domains:[],isSubmitting:!1};async function Nt(){var e;if(qe(["admin","director"],x)){try{const[t,i]=await Promise.all([w.listTypes().catch(()=>({data:[]})),ge.getMetadata().catch(()=>({data:{domains:[]}}))]);o.existingTypes=t.data||[],o.domains=((e=i.data)==null?void 0:e.domains)||[]}catch(t){console.warn("Could not load metadata for module builder:",t)}k()}}function k(){const e=document.getElementById("app");let t="";o.step===1?t=Ot():o.step===2?t=Ft():o.step===3?t=Gt():o.step===4?t=Wt():o.step===5?t=Kt():o.step===6?t=Jt():o.step===7&&(t=Yt());const i=[{num:1,label:"Basics"},{num:2,label:"Form & Fields"},{num:3,label:"Workflow"},{num:4,label:"Rules"},{num:5,label:"Reports"},{num:6,label:"Review"}],n=i.map((a,r)=>`
    <div style="display:flex; align-items:center; gap:0.4rem; color:${o.step>=a.num?"var(--primary)":"var(--gray-400)"}; font-weight:${o.step===a.num?"bold":"normal"}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${o.step>=a.num?"var(--primary)":"#e5e7eb"}; color:${o.step>=a.num?"#fff":"#4b5563"}; display:flex; align-items:center; justify-content:center; font-size:12px;">${a.num}</span>
      ${a.label}
    </div>
    ${r<i.length-1?`<div style="flex:1; height:2px; background:${o.step>a.num?"var(--primary)":"#e5e7eb"}; margin:0 4px;"></div>`:""}
  `).join("");e.innerHTML=M(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>No-Code Module Builder</h1>
        <p>Design and deploy brand-new civic governance capabilities purely through metadata.</p>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="card mb-6" style="padding: 0.8rem 1.2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; overflow-x:auto;">
        ${n}
      </div>
    </div>

    ${t}
  `,"Module Builder"),E(),Qt()}function Ot(){const e=o.domains&&o.domains.length>0?o.domains.map(t=>`<option value="${t.domain_id}" ${o.basics.domain_id==t.domain_id?"selected":""}>${h(t.domain_name)}</option>`).join(""):'<option value="1">Civic Operations</option>';return`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${h(o.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${h(o.basics.description)}</textarea>
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
                <option value="📋" ${o.basics.icon==="📋"?"selected":""}>📋 Form / Registration</option>
                <option value="📢" ${o.basics.icon==="📢"?"selected":""}>📢 Notice / Alert</option>
                <option value="🛡️" ${o.basics.icon==="🛡️"?"selected":""}>🛡️ Governance / Policy</option>
                <option value="💼" ${o.basics.icon==="💼"?"selected":""}>💼 Employment / Exchange</option>
                <option value="🤝" ${o.basics.icon==="🤝"?"selected":""}>🤝 Volunteer / Community</option>
                <option value="🌳" ${o.basics.icon==="🌳"?"selected":""}>🌳 Parks / Environment</option>
                <option value="🏗️" ${o.basics.icon==="🏗️"?"selected":""}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `}function Ft(){const e=o.basics.name?`${o.basics.name} Form`:"Module Registration Form",t=o.form.sections.map((i,n)=>{const a=i.parameters.map((r,s)=>{const d=r.field_type==="select";return`
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${s+1} (${h(r.field_key||"field")})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${n}, ${s})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${h(r.label)}" onchange="window.updateParam(${n}, ${s}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
            </div>
            <div class="form-group" style="flex:1.5;">
              <label class="form-label" style="font-size:12px;">Data Type</label>
              <select class="form-control" onchange="window.updateParam(${n}, ${s}, 'field_type', this.value)">
                <option value="text" ${r.field_type==="text"?"selected":""}>Text Input</option>
                <option value="textarea" ${r.field_type==="textarea"?"selected":""}>Long Text (Textarea)</option>
                <option value="number" ${r.field_type==="number"?"selected":""}>Number (Metric)</option>
                <option value="date" ${r.field_type==="date"?"selected":""}>Date</option>
                <option value="select" ${r.field_type==="select"?"selected":""}>Dropdown Select</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:flex-end; padding-bottom:8px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${r.mandatory?"checked":""} onchange="window.updateParam(${n}, ${s}, 'mandatory', this.checked)">
                Required?
              </label>
            </div>
          </div>

          ${d?`
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--gray-200);">
              <label class="form-label" style="font-size:12px;">Dropdown Choices (comma-separated)</label>
              <input type="text" class="form-control" value="${h((r.options||[]).join(", "))}" onchange="window.updateParamOptions(${n}, ${s}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          `:""}
        </div>
      `}).join("");return`
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${h(i.name)}" onchange="window.updateSectionName(${n}, this.value)">
          <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeSection(${n})">Delete Section</button>
        </div>
        <div class="card-body">
          ${a}
          <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.addParam(${n})">+ Add Field</button>
        </div>
      </div>
    `}).join("");return`
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
      <div>
        <div class="card mb-4">
          <div class="card-header">
            <div class="card-title">Step 2: Form & Field Configuration</div>
            <div class="card-subtitle">Define parameters and form sections for "${h(o.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${h(e)}" onchange="state.form.name = this.value">
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
            ${Ut()}
          </div>
        </div>
      </div>
    </div>
  `}function Ut(){const e=o.basics.name?`${o.basics.name} Form`:"Untitled Form";let t=`<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${h(e)}</div>`;return o.form.sections.forEach(i=>{t+=`
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${h(i.name)}</div>
    `,i.parameters.forEach(n=>{const a=n.mandatory?'<span style="color:red">*</span>':"";if(t+=`<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${h(n.label||"Unlabelled")} ${a}</label>`,n.field_type==="textarea")t+='<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>';else if(n.field_type==="number")t+='<input type="number" class="form-control" disabled placeholder="0">';else if(n.field_type==="date")t+='<input type="date" class="form-control" disabled>';else if(n.field_type==="select"){const r=n.options&&n.options.length?n.options:["Option 1","Option 2"];t+=`<select class="form-control" disabled>
          ${r.map(s=>`<option>${h(s)}</option>`).join("")}
        </select>`}else t+='<input type="text" class="form-control" disabled placeholder="Text response...">';t+="</div>"}),t+="</div>"}),t}function Gt(){const e=[{value:"citizen",label:"Citizen (Owner)"},{value:"coordinator_area",label:"Area Coordinator"},{value:"coordinator_general",label:"General Coordinator"},{value:"director",label:"Director"},{value:"admin",label:"Administrator"}],t=o.workflow.transitions.map((i,n)=>`
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${n+1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${n})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${h(i.from)}" onchange="window.updateTransition(${n}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${h(i.to)}" onchange="window.updateTransition(${n}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
        </div>
        <div class="form-group" style="flex:1.2;">
          <label class="form-label" style="font-size:12px;">Allowed Role</label>
          <select class="form-control" onchange="window.updateTransition(${n}, 'role', this.value)">
            ${e.map(a=>`<option value="${a.value}" ${i.role===a.value?"selected":""}>${a.label}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
  `).join("");return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 3: Workflow & State Transitions</div>
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${h(o.basics.name)}".</div>
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
  `}function Wt(){return o.existingTypes.map(e=>`<option value="${e.entity_type_id}" ${o.rule.target_entity_type_id==e.entity_type_id?"selected":""}>${h(e.name)}</option>`).join(""),`
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
  `}function Kt(){const e=[];o.form.sections.forEach(a=>a.parameters.forEach(r=>e.push(r)));const t=o.basics.name?`${o.basics.name}s by Area`:"Module Report",i=e.filter(a=>a.field_type==="number"),n=['<option value="area">area (Native Area)</option>','<option value="status">status (Workflow Status)</option>',...e.map(a=>`<option value="${h(a.field_key||a.label)}" ${o.report.groupBy===(a.field_key||a.label)?"selected":""}>${h(a.label)} (${a.field_type})</option>`)].join("");return i.map(a=>`
    <option value="${h(a.field_key||a.label)}" ${o.report.metricField===(a.field_key||a.label)?"selected":""}>${h(a.label)}</option>
  `).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${h(o.basics.name)}" via ReportMaster.</div>
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
              <input type="text" class="form-control" value="${h(t)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label">Group By Field</label>
                <select class="form-control" onchange="state.report.groupBy = this.value">
                  ${n}
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
  `}function Jt(){const e=`${o.basics.name} Form`,t=o.form.sections.reduce((n,a)=>n+a.parameters.length,0),i=`${o.basics.name}s by Area`;return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${o.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${h(o.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${h(o.basics.description||"Civic Operating System Module")}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${h(e)}</strong></div>
              <div>Sections: <strong>${o.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${t}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${o.workflow.transitions.length} transitions)
              </div>
              ${o.workflow.transitions.map(n=>`<div style="font-size:12px;">• <code>${h(n.from)}</code> → <code>${h(n.to)}</code> (${h(n.role)})</div>`).join("")}
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
              <div>${`${h(i)} (${o.report.metric} by ${o.report.groupBy})`}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${o.isSubmitting?"disabled":""}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `}function Yt(){return`
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${h(o.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `}function Qt(){const e=document.getElementById("step1-form");e&&e.addEventListener("submit",t=>{t.preventDefault();const i=document.getElementById("module-name").value.trim(),n=document.getElementById("module-desc").value.trim(),a=document.getElementById("module-icon").value;if(!i){b("Module name is required");return}if(o.existingTypes.some(s=>s.name.toLowerCase()===i.toLowerCase())){b(`Module "${i}" already exists. Please choose a different name.`);return}o.basics.name=i,o.basics.description=n,o.basics.icon=a,o.step=2,k()})}window.addSection=()=>{const e=o.form.sections.length+1;o.form.sections.push({id:`sec_${Date.now()}`,name:`Section ${e}`,parameters:[{id:`param_${Date.now()}`,label:"New Field",field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}]}),k()};window.removeSection=e=>{if(o.form.sections.length<=1){b("Form must have at least one section");return}o.form.sections.splice(e,1),k()};window.updateSectionName=(e,t)=>{o.form.sections[e].name=t,k()};window.addParam=e=>{const t=o.form.sections[e].parameters.length+1;o.form.sections[e].parameters.push({id:`param_${Date.now()}`,label:`Field ${t}`,field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}),k()};window.removeParam=(e,t)=>{o.form.sections[e].parameters.splice(t,1),k()};window.updateParam=(e,t,i,n)=>{const a=o.form.sections[e].parameters[t];a[i]=n,i==="label"&&(a.field_key=n.toLowerCase().replace(/[^a-z0-9]/g,"_")),k()};window.updateParamOptions=(e,t,i)=>{const n=i.split(",").map(a=>a.trim()).filter(Boolean);o.form.sections[e].parameters[t].options=n,k()};window.validateAndGoStep3=()=>{for(const e of o.form.sections){if(!e.name.trim()){b("All sections must have a title");return}for(const t of e.parameters)if(!t.label.trim()){b("All fields must have a label");return}}o.step=3,k()};window.addTransition=()=>{o.workflow.transitions.push({from:"draft",to:"submitted",role:"citizen"}),k()};window.removeTransition=e=>{if(o.workflow.transitions.length<=1){b("Workflow must have at least one transition");return}o.workflow.transitions.splice(e,1),k()};window.updateTransition=(e,t,i)=>{o.workflow.transitions[e][t]=i,k()};window.validateAndGoStep4=()=>{for(let e=0;e<o.workflow.transitions.length;e++){const t=o.workflow.transitions[e];if(!t.from.trim()||!t.to.trim()){b(`Transition #${e+1} must have both from and to states.`);return}}o.step=4,k()};window.submitModuleCreation=async()=>{const e=document.getElementById("create-module-btn");e&&(e.disabled=!0,e.textContent="Deploying Metadata Atomically..."),o.isSubmitting=!0;try{const t=o.form.name||`${o.basics.name} Form`,i=o.report.name||`${o.basics.name}s by Area`,n={module:{name:o.basics.name,description:o.basics.description,domain_id:o.basics.domain_id||1},form:{name:t,sections:o.form.sections.map(r=>({name:r.name,parameters:r.parameters.map(s=>({field_key:s.field_key,label:s.label,field_type:s.field_type,mandatory:!!s.mandatory,options:s.options}))}))},workflow:{transitions:o.workflow.transitions.map(r=>({from_status:r.from,to_status:r.to,role:r.role}))},rules:o.rule.enabled&&o.rule.target_entity_type_id?[{target_entity_type_id:Number(o.rule.target_entity_type_id),event:o.rule.event||"approved",auto_create:!0,auto_approve:!1}]:[],reports:o.report.enabled?[{report_name:i,output_format:"grouped_count",filters:{groupBy:o.report.groupBy||"area",metric:o.report.metric||"COUNT",metricField:o.report.metricField||void 0,public_stats:o.report.publicStats}}]:[]},a=await at.deploy(n);V(a.message||`Module "${o.basics.name}" deployed successfully!`),o.isSubmitting=!1,o.step=7,k()}catch(t){b(t.message||"Failed to deploy module"),o.isSubmitting=!1,e&&(e.disabled=!1,e.innerHTML='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata')}};function _(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let ee=[],Te=[];async function Xt(){if(!H(x))return;const e=document.getElementById("app");e.innerHTML=M(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Reports"),E();try{const[t,i]=await Promise.all([ne.list().catch(()=>({data:[]})),w.listTypes().catch(()=>({data:[]}))]);ee=t.data||[],Te=i.data||[],e.innerHTML=M(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `,"Civic Reports",Te),E(),Zt(document.getElementById("reports-container"))}catch{b("Failed to load reports catalog"),document.getElementById("reports-container").innerHTML=`
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `}}function Zt(e){if(!ee||ee.length===0){e.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;return}const t=ee.map(a=>{const r=j(a.entityType);return`
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${_(r.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${_(a.metric_type||"COUNT")}</span>
          </div>
          <div class="report-card-title">${_(a.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${_(r.shortTitle)}</strong> records grouped by <strong>${_(a.group_by_field||"area / status")}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${_(a.group_by_field||"area")}</span>
            <span>•</span>
            <span>Metric: ${_(a.metric_type||"COUNT")}</span>
          </div>
          <button class="btn btn-primary btn-full execute-report-btn" data-repid="${a.report_id}" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
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
  `,e.querySelectorAll(".execute-report-btn").forEach(a=>{a.addEventListener("click",()=>{const r=a.getAttribute("data-repid");ei(r)})});const n=document.getElementById("btn-close-result");n&&n.addEventListener("click",()=>{document.getElementById("report-execution-panel").style.display="none"})}async function ei(e){const t=document.getElementById("report-execution-panel"),i=document.getElementById("execution-title"),n=document.getElementById("execution-body");if(!(!t||!n)){t.style.display="block",t.scrollIntoView({behavior:"smooth"}),n.innerHTML='<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';try{const r=(await ne.execute(e)).data;i.textContent=`Report Results: ${r.reportName||"Execution"}`;const s=r.rows||[];if(s.length===0){n.innerHTML='<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>';return}const d=s.map(l=>{var c;return`
      <tr>
        <td style="font-weight:600;">${_(l[r.groupBy]||l.area||l.status||"Total")}</td>
        <td style="font-weight:700; color:var(--primary);">${l[(c=r.metric)==null?void 0:c.toLowerCase()]||l.count||l.total_count||0}</td>
      </tr>
    `}).join("");n.innerHTML=`
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${_(r.metric)}</strong> | Grouped By: <strong>${_(r.groupBy)}</strong> | Total Groups: <strong>${s.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${_(r.groupBy||"Group")}</th>
              <th>Aggregation Metric (${_(r.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${d}
          </tbody>
        </table>
      </div>
    `}catch(a){b(a.message||"Report execution failed"),n.innerHTML=`<div class="alert alert-error">Execution Error: ${_(a.message)}</div>`}}}function X(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function ti(){if(!H(x))return;const e=document.getElementById("app");e.innerHTML=M(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Capabilities"),E();try{const i=(await w.listTypes().catch(()=>({data:[]}))).data||[];e.innerHTML=M(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `,"Civic Capabilities",i),E(),ii(document.getElementById("modules-container"),i)}catch{b("Failed to load civic capabilities"),document.getElementById("modules-container").innerHTML=`
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `}}function ii(e,t){if(!t||t.length===0){e.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;return}const i=t.map(n=>{var s;const a=j(n),r=((s=n._count)==null?void 0:s.entities)||0;return`
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${R(a.iconKey,24)}
            </div>
            <span class="badge badge-secondary" style="font-size:11px;">${r} Active Cases</span>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:4px;">
            ${X(a.category)}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            ${X(a.title)}
          </h3>

          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
            ${X(a.description)}
          </p>
        </div>

        <div style="display:flex; gap:10px; padding-top:16px; border-top:1px solid var(--border);">
          <a href="/entities?entity_type_id=${n.entity_type_id}" class="btn btn-secondary" style="flex:1; text-align:center; font-size:0.85rem;">
            Explore Cases
          </a>
          <a href="/entities/new?entity_type_id=${n.entity_type_id}" class="btn btn-translucent-orange" style="flex:1; text-align:center; font-size:0.85rem;">
            ${X(a.actionLabel)} →
          </a>
        </div>
      </div>
    `}).join("");e.innerHTML=`
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
      ${i}
    </div>
  `}C("/",et);C("/login",dt);C("/signup",ct);C("/dashboard",ut);C("/modules",ti);C("/entities",yt);C("/entities/new",jt);C("/entities/:id",he);C("/admin",Ht);C("/module-builder",Nt);C("/reports",Xt);C("/profile",Dt);je(()=>{document.getElementById("app").innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `});ze();window.addEventListener("auth:expired",()=>{Me(()=>Promise.resolve().then(()=>lt),void 0).then(e=>{e.toastWarning("Your session has expired. Please sign in again.")}),Me(()=>Promise.resolve().then(()=>Xe),void 0).then(e=>e.navigate("/login"))});
