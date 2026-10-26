(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function i(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=i(n);fetch(n.href,s)}})();const ci="modulepreload",pi=function(e){return"/"+e},St={},tt=function(t,i,a){let n=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(i.map(d=>{if(d=pi(d),d in St)return;St[d]=!0;const l=d.endsWith(".css"),c=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${c}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":ci,l||(p.as="script"),p.crossOrigin="",p.href=d,r&&p.setAttribute("nonce",r),document.head.appendChild(p),l)return new Promise((v,u)=>{p.addEventListener("load",v),p.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return n.then(o=>{for(const r of o||[])r.status==="rejected"&&s(r.reason);return t().catch(s)})},Nt=[];let Ot=()=>{};function I(e,t){Nt.push({path:e,handler:t})}function Dt(e){Ot=e}function ui(e){const t=[...Nt].sort((i,a)=>{const n=i.path.includes(":"),s=a.path.includes(":");return!n&&s?-1:n&&!s?1:0});for(const i of t){const a=[],n=i.path.replace(/:([^/]+)/g,(r,d)=>(a.push(d),"([^/]+)")).replace(/\//g,"\\/"),s=new RegExp(`^${n}$`),o=e.match(s);if(o){const r={};return a.forEach((d,l)=>{r[d]=decodeURIComponent(o[l+1])}),{handler:i.handler,params:r,path:i.path}}}return null}function z(e){window.history.pushState({},"",e),it(window.location.href)}function it(e=window.location.href){const t=new URL(e,window.location.origin);let i=t.pathname;i.length>1&&i.endsWith("/")&&(i=i.slice(0,-1));const a=ui(i);if(a){const n=a.handler(a.params,t.searchParams);n&&typeof n.then=="function"&&n.then(()=>{window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:i,async:!0}}))}).catch(s=>{console.error("[Router Error]:",s)})}else Ot();window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:i}}))}function qt(){window.navigate=z,window.addEventListener("popstate",()=>it(window.location.href));const e=document.getElementById("app");e&&e.addEventListener("click",t=>{const i=t.target.closest("a[href]");if(!i)return;const a=i.getAttribute("href");!a||a.startsWith("http")||a.startsWith("mailto:")||a.startsWith("#")||(t.preventDefault(),z(a))}),it(window.location.href)}const mi=Object.freeze(Object.defineProperty({__proto__:null,addRoute:I,initRouter:qt,navigate:z,onNotFound:Dt},Symbol.toStringTag,{value:"Module"})),at=[{code:"en",name:"English",nativeName:"English",region:"Pan-India / Official",popular:!0},{code:"hi",name:"Hindi",nativeName:"हिन्दी",region:"North & Central India",popular:!0},{code:"mr",name:"Marathi",nativeName:"मराठी",region:"Maharashtra",popular:!0},{code:"ta",name:"Tamil",nativeName:"தமிழ்",region:"Tamil Nadu & Puducherry",popular:!0},{code:"te",name:"Telugu",nativeName:"తెలుగు",region:"Andhra Pradesh & Telangana",popular:!0},{code:"bn",name:"Bengali",nativeName:"বাংলা",region:"West Bengal & Tripura",popular:!0},{code:"gu",name:"Gujarati",nativeName:"ગુજરાતી",region:"Gujarat",popular:!0},{code:"kn",name:"Kannada",nativeName:"ಕನ್ನಡ",region:"Karnataka",popular:!0},{code:"ml",name:"Malayalam",nativeName:"മലയാളം",region:"Kerala & Lakshadweep",popular:!0},{code:"pa",name:"Punjabi",nativeName:"ਪੰਜਾਬੀ",region:"Punjab",popular:!0},{code:"ur",name:"Urdu",nativeName:"اردو",region:"Pan-India",popular:!0},{code:"as",name:"Assamese",nativeName:"অসমীয়া",region:"Assam"},{code:"bho",name:"Bhojpuri",nativeName:"भोजपुरी",region:"Bihar & Uttar Pradesh"},{code:"doi",name:"Dogri",nativeName:"डोगरी",region:"Jammu & Kashmir"},{code:"gom",name:"Konkani",nativeName:"कोंकणी",region:"Goa & Konkan"},{code:"mai",name:"Maithili",nativeName:"मैथिली",region:"Bihar & Jharkhand"},{code:"mni-Mtei",name:"Meiteilon (Manipuri)",nativeName:"ꯃꯤꯇꯩꯂꯣꯟ",region:"Manipur"},{code:"lus",name:"Mizo",nativeName:"Mizo ṭawng",region:"Mizoram"},{code:"ne",name:"Nepali",nativeName:"नेपाली",region:"Sikkim & West Bengal"},{code:"or",name:"Odia",nativeName:"ଓଡ଼ିଆ",region:"Odisha"},{code:"sa",name:"Sanskrit",nativeName:"संस्कृतम्",region:"Classical Language"},{code:"sd",name:"Sindhi",nativeName:"سنڌي",region:"Sindhi"}],Ft="civic_kalki_lang";function me(){return localStorage.getItem(Ft)||"en"}function Vt(e){return at.find(t=>t.code.toLowerCase()===(e||"").toLowerCase())||{code:e||"en",name:"English",nativeName:"English",region:"Official"}}function Ut(e){try{const t=localStorage.getItem(`civic_trans_${e}`);return t?JSON.parse(t):{}}catch{return{}}}function vi(e,t){try{const a={...Ut(e),...t};localStorage.setItem(`civic_trans_${e}`,JSON.stringify(a))}catch{}}function Gt(){["googtrans","googtrans_opt","__googtrans"].forEach(t=>{document.cookie=`${t}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,window.location.hostname&&(document.cookie=`${t}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,document.cookie=`${t}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`)}),document.querySelectorAll(".goog-te-banner-frame, iframe.goog-te-banner-frame, #google_translate_element, #goog-gt-tt, .goog-te-balloon-frame").forEach(t=>{try{t.remove()}catch{}}),document.body&&(document.body.style.top="0px",document.body.style.position="static")}function gi(e){const t=[],i=[],a=[],n=new Set,s=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,{acceptNode(o){if(!o.nodeValue)return NodeFilter.FILTER_REJECT;const r=o.parentElement;if(!r)return NodeFilter.FILTER_REJECT;const d=r.tagName.toLowerCase();if(["script","style","code","pre","textarea"].includes(d)||r.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return NodeFilter.FILTER_REJECT;const l=(o._civicOriginal!==void 0?o._civicOriginal:o.nodeValue).trim();return!l||/^[\d\s\-_.,/\\:;!@#$%^&*()=+~`|<>?"'’]+$/.test(l)||/^#?[A-Za-z]{1,5}-\d+$/.test(l)||/^#\d+$/.test(l)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});for(;s.nextNode();){const o=s.currentNode;o._civicOriginal===void 0&&(o._civicOriginal=o.nodeValue);const r=o._civicOriginal.trim();r&&(t.push({node:o,original:r}),n.add(r))}return e.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(o=>{if(o.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;o._civicOriginalPlaceholder===void 0&&(o._civicOriginalPlaceholder=o.placeholder);const r=(o._civicOriginalPlaceholder||"").trim();r&&!/^[\d\s]+$/.test(r)&&(i.push({element:o,original:r}),n.add(r))}),e.querySelectorAll("[title]").forEach(o=>{if(o.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;o._civicOriginalTitle===void 0&&(o._civicOriginalTitle=o.title);const r=(o._civicOriginalTitle||"").trim();r&&!/^[\d\s]+$/.test(r)&&(a.push({element:o,original:r}),n.add(r))}),{textItems:t,placeholderItems:i,titleItems:a,uniqueStrings:Array.from(n)}}function fi(e=document.getElementById("app")){if(!e)return;const t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);for(;t.nextNode();){const i=t.currentNode;i._civicOriginal!==void 0&&(i.nodeValue=i._civicOriginal)}e.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(i=>{i._civicOriginalPlaceholder!==void 0&&(i.placeholder=i._civicOriginalPlaceholder)}),e.querySelectorAll("[title]").forEach(i=>{i._civicOriginalTitle!==void 0&&(i.title=i._civicOriginalTitle)})}let Ke=!1,Ye=!1,nt=!1;async function ve(e){const t=e||me(),i=document.getElementById("app")||document.body;if(!i)return;if(t==="en"){fi(i);return}const{textItems:a,placeholderItems:n,titleItems:s,uniqueStrings:o}=gi(i);if(o.length===0)return;const r=Ut(t),d=[],l=()=>{nt=!0;try{a.forEach(({node:c,original:p})=>{if(r[p])if(c._civicOriginal&&c._civicOriginal.trim()===p){const v=c._civicOriginal.match(/^\s*/)[0],u=c._civicOriginal.match(/\s*$/)[0];c.nodeValue=v+r[p]+u}else c._civicOriginal&&(c.nodeValue=c._civicOriginal.replace(p,r[p]))}),n.forEach(({element:c,original:p})=>{r[p]&&(c.placeholder=r[p])}),s.forEach(({element:c,original:p})=>{r[p]&&(c.title=r[p])})}finally{setTimeout(()=>{nt=!1},40)}};if(l(),o.forEach(c=>{r[c]||d.push(c)}),d.length!==0){if(Ke){Ye=!0;return}Ke=!0;try{const c=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({texts:d,targetLang:t})});if(c.ok){const p=await c.json();p&&p.translations&&(vi(t,p.translations),Object.assign(r,p.translations),l())}}catch(c){console.error("[Translation Service Error]:",c)}finally{Ke=!1,Ye&&(Ye=!1,setTimeout(()=>{ve(t)},50))}}}function zt(e){const t=(e||"en").trim();localStorage.setItem(Ft,t),Gt(),hi(t),ve(t)}function qe(e={}){const t=e.idPrefix||"topbar",i=me(),a=Vt(i),n=at.filter(s=>s.popular);return`
    <div class="lang-dropdown-container notranslate" id="${t}-lang-container">
      <button 
        type="button" 
        class="lang-trigger-btn" 
        id="${t}-lang-btn" 
        aria-haspopup="true" 
        aria-expanded="false" 
        title="Choose language (Indian Regional & Official Languages)"
      >
        <span class="lang-globe-icon" aria-hidden="true">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="1.8"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </span>
        <span class="lang-btn-label truncate" id="${t}-lang-label">
          ${F(a.nativeName||a.name)}
        </span>
        <span class="lang-badge">${F(i.toUpperCase().slice(0,5))}</span>
        <svg class="lang-chevron" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Card -->
      <div class="lang-dropdown-menu" id="${t}-lang-dropdown">
        <div class="lang-dropdown-header">
          <div class="lang-header-title">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>Choose Language (भारतीय भाषाएं)</span>
          </div>
          <span class="lang-count-badge">🇮🇳 Indian Languages</span>
        </div>

        <!-- Search Bar with region search -->
        <div class="lang-search-box">
          <svg class="lang-search-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            class="lang-search-input" 
            id="${t}-lang-search" 
            placeholder="Search language or state (e.g. Hindi, Marathi, Tamil)..." 
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="lang-search-clear hidden" id="${t}-lang-clear" aria-label="Clear search">✕</button>
        </div>

        <!-- Quick Select Chips for Major Indian Languages -->
        <div class="lang-quick-section" id="${t}-lang-popular-section">
          <div class="lang-section-label">Most Common</div>
          <div class="lang-chips-grid">
            ${n.map(s=>`
              <button 
                type="button" 
                class="lang-chip ${s.code===i?"active":""}" 
                data-lang="${s.code}"
                title="${F(s.name)} (${F(s.region)})"
              >
                ${F(s.nativeName)}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="lang-section-label" style="padding: 6px 14px 2px;">Official & Regional Languages</div>

        <!-- Full Scrollable List -->
        <div class="lang-options-scroll" id="${t}-lang-list">
          ${at.map(s=>{const o=s.code===i;return`
              <div 
                class="lang-option-row ${o?"selected":""}" 
                data-lang="${s.code}" 
                data-name="${F(s.name.toLowerCase())}" 
                data-native="${F(s.nativeName.toLowerCase())}"
                data-region="${F((s.region||"").toLowerCase())}"
                role="button"
                tabindex="0"
              >
                <div class="lang-names-wrap">
                  <span class="lang-native-name">${F(s.nativeName)}</span>
                  <span class="lang-english-name">${F(s.name)} • <span style="opacity:0.75;">${F(s.region)}</span></span>
                </div>
                <div class="lang-code-pill">${F(s.code)}</div>
                ${o?`
                  <svg class="lang-check-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                `:""}
              </div>
            `}).join("")}
        </div>

        <!-- Footer / Reset -->
        <div class="lang-dropdown-footer">
          <button type="button" class="lang-reset-btn" id="${t}-lang-reset">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to English (Default)
          </button>
        </div>
      </div>
    </div>
  `}function Fe(e="topbar"){const t=document.getElementById(`${e}-lang-container`),i=document.getElementById(`${e}-lang-btn`),a=document.getElementById(`${e}-lang-dropdown`),n=document.getElementById(`${e}-lang-search`),s=document.getElementById(`${e}-lang-clear`),o=document.getElementById(`${e}-lang-list`),r=document.getElementById(`${e}-lang-reset`),d=document.getElementById(`${e}-lang-popular-section`);if(!(!t||!i||!a)){if(i.addEventListener("click",l=>{l.stopPropagation();const c=a.classList.contains("show");document.querySelectorAll(".lang-dropdown-menu.show").forEach(p=>{p!==a&&p.classList.remove("show")}),a.classList.toggle("show",!c),i.setAttribute("aria-expanded",String(!c)),!c&&n&&setTimeout(()=>n.focus(),50)}),a.addEventListener("click",l=>{l.stopPropagation();const c=l.target.closest("[data-lang]");if(c){const p=c.getAttribute("data-lang");p&&(a.classList.remove("show"),i.setAttribute("aria-expanded","false"),zt(p))}}),n&&o){const l=Array.from(o.querySelectorAll(".lang-option-row")),c=()=>{const p=(n.value||"").trim().toLowerCase();s==null||s.classList.toggle("hidden",p.length===0),d&&(d.style.display=p.length>0?"none":"block");let v=0;l.forEach(g=>{const C=g.getAttribute("data-name")||"",h=g.getAttribute("data-native")||"",y=g.getAttribute("data-region")||"",E=(g.getAttribute("data-lang")||"").toLowerCase(),X=!p||C.includes(p)||h.includes(p)||y.includes(p)||E.includes(p);g.style.display=X?"flex":"none",X&&v++});let u=o.querySelector(".lang-no-match");v===0?(u||(u=document.createElement("div"),u.className="lang-no-match",u.textContent="No Indian language found matching your search",o.appendChild(u)),u.style.display="block"):u&&(u.style.display="none")};n.addEventListener("input",c),s&&s.addEventListener("click",p=>{p.stopPropagation(),n.value="",c(),n.focus()})}r&&r.addEventListener("click",l=>{l.stopPropagation(),a.classList.remove("show"),i.setAttribute("aria-expanded","false"),zt("en")}),document.addEventListener("click",l=>{t.contains(l.target)||(a.classList.remove("show"),i.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",l=>{l.key==="Escape"&&a.classList.contains("show")&&(a.classList.remove("show"),i.setAttribute("aria-expanded","false"),i.focus())})}}function hi(e){const t=Vt(e);document.querySelectorAll(".lang-btn-label").forEach(i=>{i.textContent=t.nativeName||t.name}),document.querySelectorAll(".lang-badge").forEach(i=>{i.textContent=(e||"EN").toUpperCase().slice(0,5)}),document.querySelectorAll(".lang-chip").forEach(i=>{const a=i.getAttribute("data-lang")===e;i.classList.toggle("active",a)}),document.querySelectorAll(".lang-option-row").forEach(i=>{const a=i.getAttribute("data-lang")===e;i.classList.toggle("selected",a);let n=i.querySelector(".lang-check-icon");if(a&&!n){const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("class","lang-check-icon"),s.setAttribute("width","16"),s.setAttribute("height","16"),s.setAttribute("fill","none"),s.setAttribute("stroke","currentColor"),s.setAttribute("viewBox","0 0 24 24"),s.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>',i.appendChild(s)}else!a&&n&&n.remove()})}let Je=null,Xe=null;function bi(){if(Je)return;const e=document.getElementById("app")||document.body;e&&(Je=new MutationObserver(t=>{if(nt)return;const i=me();if(i==="en")return;let a=!1;for(const n of t){if(n.type==="childList"&&n.addedNodes.length>0){for(const s of n.addedNodes)if(s.nodeType===Node.ELEMENT_NODE){if(s.closest&&s.closest(".notranslate, .lang-dropdown-menu, .lang-dropdown-container"))continue;a=!0;break}}if(a)break}a&&(Xe&&clearTimeout(Xe),Xe=setTimeout(()=>{ve(i)},70))}),Je.observe(e,{childList:!0,subtree:!0}))}function yi(){Gt(),window.civicTranslatePage=t=>ve(t||me()),bi();const e=me();e!=="en"&&setTimeout(()=>{ve(e)},100),window.addEventListener("civic:route-rendered",()=>{const t=me();t!=="en"&&setTimeout(()=>{ve(t)},60)})}function F(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ut="ck_auth";function mt(){try{const e=sessionStorage.getItem(ut);return e?JSON.parse(e):null}catch{return null}}function vt(e){sessionStorage.setItem(ut,JSON.stringify(e))}function gt(){sessionStorage.removeItem(ut)}function Se(){var e;return((e=mt())==null?void 0:e.token)||null}function re(){var e;return((e=mt())==null?void 0:e.user)||null}function Wt(){var e;return((e=re())==null?void 0:e.role)||null}function Ve(){const e=Se();if(!e)return!1;try{const[,t]=e.split(".");return JSON.parse(atob(t.replace(/-/g,"+").replace(/_/g,"/"))).exp*1e3>Date.now()}catch{return!1}}function J(e){return Ve()?!0:(e("/login"),!1)}function ft(e,t){if(!J(t))return!1;const i=Wt();return e.includes(i)?!0:(t("/dashboard"),!1)}const xi={citizen:"Citizen",coordinator_area:"Area Coordinator",coordinator_general:"General Coordinator",director:"Director",admin:"Administrator"};function ke(e){return xi[e]||e}async function ki(){const e=mt();if(!(e!=null&&e.token))return null;try{const t=await fetch("/api/auth/me",{headers:{Authorization:`Bearer ${e.token}`}});if(!t.ok)return null;const i=await t.json();if(i.success&&i.data)return vt({...e,user:i.data}),i.data}catch(t){console.warn("[auth] refreshUser failed:",t)}return e.user||null}const x={tool:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',sprout:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',users:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',activity:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',message:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',zap:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',grid:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',workflow:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>',chart:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',shield:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',bot:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/></svg>',tree:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M8 15h8l-2-4h3l-2-4h2L12 2 7 7h2l-2 4h3z"/></svg>',school:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v6a6 3 0 0 0 12 0v-6"/><path d="M22 13v6"/></svg>',water:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',clock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',chatLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',botLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/><path d="M2 13h1"/><path d="M21 13h1"/></svg>',gearLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',checkLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',flame:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',potholeMeme:'<svg class="ck-meme-svg" viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="40" rx="28" ry="15" fill="#2d2520"/><ellipse cx="32" cy="40" rx="23" ry="11" fill="#181412"/><ellipse cx="32" cy="39" rx="17" ry="7" fill="#3b82f6" opacity="0.7"/><path d="M14 30l5-12h4l-3 12h-6z" fill="#ff5a36"/><path d="M46 30l-5-12h-4l3 12h6z" fill="#ff5a36"/><path d="M21 20h22" stroke="#ffbd2e" stroke-width="3" stroke-linecap="round"/></svg>',lightMeme:'<svg class="ck-meme-svg" viewBox="0 0 64 64" fill="none"><path d="M24 18a11 11 0 0 1 16 0c2 2 3 5 3 7 0 5-4 8-4 11h-14c0-3-4-6-4-11 0-2 1-5 3-7z" fill="#ffbd2e" opacity="0.95"/><rect x="25" y="37" width="14" height="4" rx="2" fill="#d1c5b8"/><rect x="27" y="43" width="10" height="3" rx="1.5" fill="#8c8275"/><path d="M45 13a7.5 7.5 0 1 0 8 8 9.5 9.5 0 0 1-8-8z" fill="#ff7d5c"/><line x1="32" y1="5" x2="32" y2="9" stroke="#ffbd2e" stroke-width="2.5" stroke-linecap="round"/><line x1="15" y1="11" x2="18" y2="14" stroke="#ffbd2e" stroke-width="2.5" stroke-linecap="round"/><line x1="9" y1="24" x2="13" y2="24" stroke="#ffbd2e" stroke-width="2.5" stroke-linecap="round"/></svg>',truckMeme:'<svg class="ck-meme-svg" viewBox="0 0 64 64" fill="none"><rect x="6" y="24" width="28" height="18" rx="3" fill="#2f855a"/><path d="M34 27h14l6 7v8H34V27z" fill="#38a169"/><circle cx="15" cy="44" r="5.5" fill="#1a202c"/><circle cx="15" cy="44" r="2.2" fill="#e2e8f0"/><circle cx="45" cy="44" r="5.5" fill="#1a202c"/><circle cx="45" cy="44" r="2.2" fill="#e2e8f0"/><rect x="38" y="30" width="7" height="5" rx="1" fill="#edf2f7"/><path d="M6 34h-4M5 30H1M6 38h-4" stroke="#a0aec0" stroke-width="2" stroke-linecap="round"/></svg>',eye:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',comment:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',share:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',target:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',layers:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',heartHand:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',lock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',database:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',sparkles:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',toolBox:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',heartFill:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="#ff5a36" stroke="#ff5a36" stroke-width="1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'};function wi(){re();const e=Ve(),t=document.getElementById("app");t&&(t.innerHTML=`
    <div class="ck-home">

      <!-- ═══════════ HEADER ═══════════ -->
      <header class="ck-home-header" id="ck-home-header">
        <div class="ck-home-header-inner">
          <a href="/" class="ck-home-brand">
            <img src="/logo.png" alt="CivicKalki" class="ck-home-brand-img" />
          </a>

          <nav class="ck-home-nav" id="ck-home-nav">
            <a href="#features" class="ck-home-nav-link">Features</a>
            <a href="#how-it-works" class="ck-home-nav-link">How It Works</a>
            <a href="#buzz" class="ck-home-nav-link">Civic Buzz</a>
            <a href="#about" class="ck-home-nav-link">About</a>
            <a href="#faq" class="ck-home-nav-link">FAQ</a>
          </nav>

          <div class="ck-home-header-actions">
            ${qe({idPrefix:"home"})}
            ${e?`
              <a href="/dashboard" class="ck-home-cta-btn">
                Open Civic OS →
              </a>
            `:`
              <a href="/login" class="ck-home-signin-link">Sign In</a>
              <a href="/signup" class="ck-home-cta-btn">Get Started — Free</a>
            `}
            <button class="ck-home-burger" id="ck-home-burger" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <!-- ═══════════ HERO ═══════════ -->
      <section class="ck-home-hero">

        <!-- Floating playful badges with professional SVGs -->
        <div class="ck-hero-float ck-float-1" aria-hidden="true">
          <span class="ck-float-badge ck-fb-orange">${x.tool} REPORT</span>
        </div>
        <div class="ck-hero-float ck-float-2" aria-hidden="true">
          <span class="ck-float-badge ck-fb-green">${x.sprout} INITIATIVE</span>
        </div>
        <div class="ck-hero-float ck-float-3" aria-hidden="true">
          <span class="ck-float-badge ck-fb-blue">${x.users} VOLUNTEER</span>
        </div>
        <div class="ck-hero-float ck-float-4" aria-hidden="true">
          <span class="ck-float-badge ck-fb-purple">${x.activity} TRACK</span>
        </div>
        <div class="ck-hero-float ck-float-5" aria-hidden="true">
          <span class="ck-float-badge ck-fb-pink">${x.message} SPEAK UP</span>
        </div>

        <!-- Big personality text -->
        <div class="ck-hero-content">
          <div class="ck-hero-pill">
            <span class="ck-hero-pill-dot"></span>
            The Civic OS That Actually Listens
          </div>

          <h1 class="ck-hero-headline">
            Don't<br>
            Hesitate<br>
            to <span class="ck-hero-accent">Speak Up.</span>
          </h1>

          <p class="ck-hero-sub">
            Your city has problems. You have ideas.<br class="ck-hide-mobile">
            CIVIC-KALKI turns both into structured civic action<br class="ck-hide-mobile">
            — with AI that actually understands what you need.
          </p>

          <!-- Mascot eyes peeking up -->
          <div class="ck-hero-mascot" aria-hidden="true">
            <div class="ck-mascot-body">
              <div class="ck-mascot-eye ck-eye-left">
                <div class="ck-mascot-pupil" id="ck-pupil-l"></div>
              </div>
              <div class="ck-mascot-eye ck-eye-right">
                <div class="ck-mascot-pupil" id="ck-pupil-r"></div>
              </div>
            </div>
          </div>

          <div class="ck-hero-actions">
            ${e?`
              <a href="/dashboard" class="ck-btn-hero">Enter My Workspace →</a>
            `:`
              <a href="/signup" class="ck-btn-hero">Start Your Civic Journey</a>
              <a href="/login" class="ck-btn-hero-ghost">I have an account →</a>
            `}
          </div>

          <!-- Trust badges row -->
          <div class="ck-hero-trust">
            <div class="ck-trust-item">
              <span class="ck-trust-num">7+</span>
              <span class="ck-trust-label">Civic Modules</span>
            </div>
            <div class="ck-trust-sep"></div>
            <div class="ck-trust-item">
              <span class="ck-trust-num">AI</span>
              <span class="ck-trust-label">Powered Agent</span>
            </div>
            <div class="ck-trust-sep"></div>
            <div class="ck-trust-item">
              <span class="ck-trust-num">0</span>
              <span class="ck-trust-label">Code Needed</span>
            </div>
            <div class="ck-trust-sep"></div>
            <div class="ck-trust-item">
              <span class="ck-trust-num">∞</span>
              <span class="ck-trust-label">Civic Impact</span>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="ck-hero-scroll" aria-hidden="true">
          <div class="ck-scroll-line"></div>
          <span>scroll</span>
        </div>
      </section>

      <!-- ═══════════ FEATURES — TABBED ═══════════ -->
      <section class="ck-home-section ck-section-features" id="features">
        <div class="ck-section-inner">
          <div class="ck-section-label">PLATFORM CAPABILITIES</div>
          <h2 class="ck-section-heading">Everything civic.<br>One intelligent platform.</h2>
          <p class="ck-section-sub">From reporting a broken streetlight to tracking city-wide governance — CIVIC-KALKI is the operating system your city didn't know it needed.</p>

          <div class="ck-tabs" id="ck-feature-tabs">
            <div class="ck-tabs-nav">
              <button class="ck-tab-btn active" data-tab="tab-report">${x.zap} Report</button>
              <button class="ck-tab-btn" data-tab="tab-organize">${x.grid} Organize</button>
              <button class="ck-tab-btn" data-tab="tab-execute">${x.workflow} Execute</button>
              <button class="ck-tab-btn" data-tab="tab-understand">${x.chart} Understand</button>
              <button class="ck-tab-btn" data-tab="tab-accountable">${x.shield} Accountable</button>
            </div>

            <div class="ck-tabs-body">
              <div class="ck-tab-panel active" id="tab-report">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/report</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-chat">
                        <div class="ck-mock-msg ck-msg-user">The streetlight near Sector 5 park has been broken for 3 weeks</div>
                        <div class="ck-mock-msg ck-msg-ai">
                          <span class="ck-ai-badge">${x.bot} KALKI AI</span>
                          Got it! I've classified this as a <strong>Public Infrastructure — Streetlight</strong> issue. Priority: <strong style="color:#e0431f;">High</strong>. Filing now...
                        </div>
                        <div class="ck-mock-typing">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Report problems in plain language.</h3>
                  <ul class="ck-feature-list">
                    <li>Just tell the AI what's wrong — no forms, no jargon</li>
                    <li>Automatic classification, priority, and routing</li>
                    <li>Attach photos, location, and evidence</li>
                    <li>Track resolution in real time</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">Try Reporting →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-organize">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/initiative</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-organize">
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${x.tree}</div>
                          <div>
                            Tree Plantation Drive
                            <div class="ck-org-meta">42 volunteers • Sector 7</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${x.school}</div>
                          <div>
                            School Renovation Fund
                            <div class="ck-org-meta">₹2.4L raised • Ward 12</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${x.water}</div>
                          <div>
                            Clean Water Initiative
                            <div class="ck-org-meta">18 contributors • City-wide</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Organize people and resources.</h3>
                  <ul class="ck-feature-list">
                    <li>Build civic initiatives around any cause</li>
                    <li>Recruit volunteers and track contributions</li>
                    <li>Link citizens, documents, and related cases</li>
                    <li>One engine powers every civic module</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">Start Organizing →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-execute">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/workflow</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-workflow">
                        <div class="ck-wf-step done"><span>✓</span> Submitted</div>
                        <div class="ck-wf-line done"></div>
                        <div class="ck-wf-step done"><span>✓</span> Area Review</div>
                        <div class="ck-wf-line active"></div>
                        <div class="ck-wf-step active"><span>${x.clock}</span> Director Approval</div>
                        <div class="ck-wf-line"></div>
                        <div class="ck-wf-step"><span>○</span> Resolved</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Transparent multi-stage workflows.</h3>
                  <ul class="ck-feature-list">
                    <li>Role-based approval chains (citizen → coordinator → director)</li>
                    <li>Automated verification and SLA tracking</li>
                    <li>Real-time status visible to all stakeholders</li>
                    <li>Zero manual process — rules drive everything</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">See Workflows →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-understand">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/intelligence</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-chart">
                        <div class="ck-chart-bars">
                          <div class="ck-bar" style="height:45%"><span>Roads</span></div>
                          <div class="ck-bar ck-bar-accent" style="height:80%"><span>Sanitation</span></div>
                          <div class="ck-bar" style="height:35%"><span>Water</span></div>
                          <div class="ck-bar" style="height:60%"><span>Lights</span></div>
                          <div class="ck-bar" style="height:25%"><span>Parks</span></div>
                        </div>
                        <div class="ck-chart-label">Issue Distribution by Category — Ward 5</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Civic intelligence, not just data.</h3>
                  <ul class="ck-feature-list">
                    <li>AI-generated insights on ward-level patterns</li>
                    <li>Real-time aggregated reports and dashboards</li>
                    <li>Identify hotspots, trends, and priority areas</li>
                    <li>Decision support for governance teams</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">Explore Intelligence →</a>
                </div>
              </div>

              <div class="ck-tab-panel" id="tab-accountable">
                <div class="ck-tab-visual">
                  <div class="ck-tab-mockup">
                    <div class="ck-mockup-topbar">
                      <span class="ck-dot red"></span><span class="ck-dot yellow"></span><span class="ck-dot green"></span>
                      <span class="ck-mockup-url">civickalki.app/audit</span>
                    </div>
                    <div class="ck-mockup-body">
                      <div class="ck-mock-audit">
                        <div class="ck-audit-row"><span class="ck-audit-time">10:42 AM</span><span class="ck-audit-who">Coordinator Sharma</span><span class="ck-audit-act">Approved grievance #GRV-0042</span></div>
                        <div class="ck-audit-row"><span class="ck-audit-time">10:15 AM</span><span class="ck-audit-who">Rule Engine</span><span class="ck-audit-act">Auto-created inspection task</span></div>
                        <div class="ck-audit-row"><span class="ck-audit-time">09:30 AM</span><span class="ck-audit-who">Citizen Priya</span><span class="ck-audit-act">Submitted grievance with photo evidence</span></div>
                        <div class="ck-audit-row"><span class="ck-audit-time">Yesterday</span><span class="ck-audit-who">Director Mehta</span><span class="ck-audit-act">Escalated priority to High</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ck-tab-info">
                  <h3>Full accountability. Zero cover-ups.</h3>
                  <ul class="ck-feature-list">
                    <li>Immutable audit trail on every civic action</li>
                    <li>Parent-child entity lineage tracking</li>
                    <li>Role-based access with full transparency</li>
                    <li>Institutional memory that never forgets</li>
                  </ul>
                  <a href="/signup" class="ck-btn-feature">See Audit Trail →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ HOW IT WORKS ═══════════ -->
      <section class="ck-home-section ck-section-how" id="how-it-works">
        <div class="ck-section-inner">
          <div class="ck-section-label">HOW IT WORKS</div>
          <h2 class="ck-section-heading">From problem to progress.<br><span class="ck-text-accent">In 4 steps.</span></h2>

          <div class="ck-how-grid">
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">01</div>
                <div class="ck-how-icon-box">${x.chatLarge}</div>
              </div>
              <h3>Tell us what's wrong</h3>
              <p>Type or speak in plain language. Our AI understands civic issues — no bureaucratic forms.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">02</div>
                <div class="ck-how-icon-box">${x.botLarge}</div>
              </div>
              <h3>AI classifies & routes</h3>
              <p>KALKI AI auto-categorizes, sets priority, and routes to the right department instantly.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">03</div>
                <div class="ck-how-icon-box">${x.gearLarge}</div>
              </div>
              <h3>Workflows kick in</h3>
              <p>Multi-stage approvals, inspections, and assignments — automated, transparent, and tracked.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">04</div>
                <div class="ck-how-icon-box">${x.checkLarge}</div>
              </div>
              <h3>Resolution & impact</h3>
              <p>Issues get resolved. You get notified. The city gets better. Data makes everyone smarter.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ CIVIC BUZZ ═══════════ -->
      <section class="ck-home-section ck-section-buzz" id="buzz">
        <div class="ck-section-inner">
          <div class="ck-section-label">${x.flame} CIVIC BUZZ</div>
          <h2 class="ck-section-heading">Civic issues,<br>but make it <span class="ck-text-accent">relatable.</span></h2>
          <p class="ck-section-sub">Real problems. Real frustration. Real humor. Because if we can't laugh about a pothole that's been there since 2019, what can we laugh about?</p>

          <div class="ck-buzz-grid">
            <div class="ck-buzz-meme">
              <div class="ck-meme-visual">
                <div class="ck-meme-inner">
                  <div class="ck-meme-top">POV: You reported a pothole</div>
                  <div class="ck-meme-svg-stage">${x.potholeMeme}</div>
                  <div class="ck-meme-bottom">3 months ago. It's now a swimming pool.</div>
                </div>
              </div>
              <div class="ck-meme-meta">
                <span>${x.eye} 2.3k views</span>
                <span>${x.comment} 89 comments</span>
                <span>${x.share} Share</span>
              </div>
            </div>
            <div class="ck-buzz-meme">
              <div class="ck-meme-visual ck-meme-v2">
                <div class="ck-meme-inner">
                  <div class="ck-meme-top">That streetlight that works on its own schedule</div>
                  <div class="ck-meme-svg-stage">${x.lightMeme}</div>
                  <div class="ck-meme-bottom">OFF at night. ON at 2 PM. Living its best life.</div>
                </div>
              </div>
              <div class="ck-meme-meta">
                <span>${x.eye} 1.8k views</span>
                <span>${x.comment} 56 comments</span>
                <span>${x.share} Share</span>
              </div>
            </div>
            <div class="ck-buzz-meme">
              <div class="ck-meme-visual ck-meme-v3">
                <div class="ck-meme-inner">
                  <div class="ck-meme-top">When the garbage truck comes</div>
                  <div class="ck-meme-svg-stage">${x.truckMeme}</div>
                  <div class="ck-meme-bottom">But only to your neighbor's street. Every. Single. Time.</div>
                </div>
              </div>
              <div class="ck-meme-meta">
                <span>${x.eye} 3.1k views</span>
                <span>${x.comment} 142 comments</span>
                <span>${x.share} Share</span>
              </div>
            </div>
          </div>

          <div class="ck-buzz-cta" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <p>These aren't just memes. These are real issues waiting to be fixed.</p>
            <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
              <a href="/buzz" class="ck-btn-hero" style="background:linear-gradient(135deg, #f59e0b, #ef4444); border:none; color:#fff;">
                🔥 Open Civic Buzz &amp; Meme Studio →
              </a>
              <a href="/signup" class="ck-btn-hero">Report Yours. We'll Actually Fix It. →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ ABOUT ═══════════ -->
      <section class="ck-home-section ck-section-about" id="about">
        <div class="ck-section-inner">
          <div class="ck-about-layout">
            <div class="ck-about-text">
              <div class="ck-section-label ck-label-left">ABOUT CIVIC-KALKI</div>
              <h2 class="ck-section-heading" style="text-align:left;">Built by citizens.<br>For citizens.</h2>
              <p class="ck-about-body">
                CIVIC-KALKI isn't just another government portal that nobody uses. It's a <strong>metadata-driven civic operating system</strong> that transforms how cities work — from the ground up.
              </p>
              <p class="ck-about-body">
                We believe civic governance shouldn't require a PhD in bureaucracy. Our AI-powered platform lets any citizen report, track, and contribute to their city's improvement — while giving municipal teams the tools to actually respond efficiently.
              </p>
              <div class="ck-about-values">
                <div class="ck-value-chip">${x.target} Transparent</div>
                <div class="ck-value-chip">${x.zap} AI-First</div>
                <div class="ck-value-chip">${x.layers} No-Code</div>
                <div class="ck-value-chip">${x.heartHand} Citizen-Centric</div>
                <div class="ck-value-chip">${x.chart} Data-Driven</div>
                <div class="ck-value-chip">${x.lock} Accountable</div>
              </div>
            </div>
            <div class="ck-about-visual">
              <div class="ck-about-card-stack">
                <div class="ck-acard ck-acard-1">
                  <div class="ck-acard-icon-box">${x.database}</div>
                  <div>
                    <div class="ck-acard-text">20+ Database Tables</div>
                    <div class="ck-acard-sub">Powering civic intelligence</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-2">
                  <div class="ck-acard-icon-box">${x.sparkles}</div>
                  <div>
                    <div class="ck-acard-text">Gemini AI Agent</div>
                    <div class="ck-acard-sub">Understands civic context</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-3">
                  <div class="ck-acard-icon-box">${x.toolBox}</div>
                  <div>
                    <div class="ck-acard-text">No-Code Module Builder</div>
                    <div class="ck-acard-sub">Deploy new civic modules in minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ FAQ ═══════════ -->
      <section class="ck-home-section ck-section-faq" id="faq">
        <div class="ck-section-inner" style="max-width:760px;">
          <div class="ck-section-label">FAQ</div>
          <h2 class="ck-section-heading">Got questions?<br><span class="ck-text-accent">We've got answers.</span></h2>

          <div class="ck-faq-list" id="ck-faq-list">
            <div class="ck-faq-item">
              <button class="ck-faq-q">What can CIVIC-KALKI help with?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>CIVIC-KALKI helps citizens report civic issues (potholes, broken streetlights, sanitation), start community initiatives, volunteer for causes, and track the entire resolution process transparently. For municipal teams, it provides workflow automation, governance intelligence, and no-code module deployment.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">Is it free to use?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>Yes! CIVIC-KALKI is free for citizens. Sign up, report issues, track progress, and participate in civic initiatives at no cost.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">How does the AI agent work?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>Our AI agent (powered by Google Gemini) understands natural language descriptions of civic issues. Just type or speak what's wrong — the AI classifies the issue, sets priority, selects the right form, and routes it to the appropriate department. No bureaucratic knowledge required.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">What is the "No-Code Module Builder"?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>It's a tool for administrators to create entirely new civic modules (like a Donation Tracker or Public Survey system) without writing any code. Define fields, workflows, and approval chains through a visual interface, and deploy instantly.</p>
              </div>
            </div>
            <div class="ck-faq-item">
              <button class="ck-faq-q">Is my data secure?<span class="ck-faq-toggle">+</span></button>
              <div class="ck-faq-a">
                <p>Absolutely. We use industry-standard JWT authentication, bcrypt password hashing, role-based access control, and a Supabase PostgreSQL database with full audit logging. Every action is tracked, every access is controlled.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ FINAL CTA ═══════════ -->
      <section class="ck-home-section ck-section-cta">
        <div class="ck-cta-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,90,54,0.06)" d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,117.3C672,96,768,64,864,74.7C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div class="ck-cta-inner">
          <h2 class="ck-cta-title">Your city is waiting.</h2>
          <p class="ck-cta-sub">Join the civic movement. Report. Contribute. Transform.</p>
          <a href="/signup" class="ck-btn-cta-big">Get Started — It's Free →</a>
        </div>
      </section>

      <!-- ═══════════ FOOTER ═══════════ -->
      <footer class="ck-home-footer">
        <div class="ck-footer-inner">
          <div class="ck-footer-brand">
            <img src="/logo.png" alt="CivicKalki" style="height:32px;" />
            <p>The AI-powered Civic Operating System for transparent, accountable, and intelligent municipal governance.</p>
          </div>

          <div class="ck-footer-col">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/login">Sign In</a>
            <a href="/signup">Get Started</a>
          </div>

          <div class="ck-footer-col">
            <h4>Civic Modules</h4>
            <a href="/signup">Report a Problem</a>
            <a href="/signup">Start Initiative</a>
            <a href="/signup">Volunteer</a>
            <a href="/signup">Governance Intelligence</a>
          </div>

          <div class="ck-footer-col">
            <h4>Connect</h4>
            <a href="#about">About Us</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:team@civickalki.in">team@civickalki.in</a>
            <a href="#">GitHub</a>
          </div>
        </div>

        <div class="ck-footer-bottom">
          <span>© ${new Date().getFullYear()} CIVIC-KALKI. Built for transparent civic governance.</span>
          <span style="display:inline-flex; align-items:center; gap:6px;">Made with ${x.heartFill} in India</span>
        </div>
      </footer>
    </div>
  `,Fe("home"),$i())}function $i(){const e=document.getElementById("ck-home-header");e&&window.addEventListener("scroll",()=>{e.classList.toggle("scrolled",window.scrollY>40)},{passive:!0});const t=document.getElementById("ck-home-burger"),i=document.getElementById("ck-home-nav");t&&i&&t.addEventListener("click",()=>{i.classList.toggle("open"),t.classList.toggle("open")});const a=document.getElementById("ck-feature-tabs");a&&a.addEventListener("click",l=>{const c=l.target.closest(".ck-tab-btn");if(!c)return;const p=c.dataset.tab;a.querySelectorAll(".ck-tab-btn").forEach(u=>u.classList.remove("active")),a.querySelectorAll(".ck-tab-panel").forEach(u=>u.classList.remove("active")),c.classList.add("active");const v=document.getElementById(p);v&&v.classList.add("active")});const n=document.getElementById("ck-faq-list");n&&n.addEventListener("click",l=>{const c=l.target.closest(".ck-faq-q");if(!c)return;const p=c.closest(".ck-faq-item"),v=p.classList.contains("open");n.querySelectorAll(".ck-faq-item").forEach(u=>u.classList.remove("open")),v||p.classList.add("open")});const s=document.getElementById("ck-pupil-l"),o=document.getElementById("ck-pupil-r");s&&o&&document.addEventListener("mousemove",l=>{const c=p=>{const u=p.parentElement.getBoundingClientRect(),g=u.left+u.width/2,C=u.top+u.height/2,h=l.clientX-g,y=l.clientY-C,E=Math.atan2(y,h),X=u.width*.22,le=Math.min(Math.sqrt(h*h+y*y)*.15,X);p.style.transform=`translate(${Math.cos(E)*le}px, ${Math.sin(E)*le}px)`};c(s),c(o)},{passive:!0}),document.querySelectorAll('.ck-home a[href^="#"]').forEach(l=>{l.addEventListener("click",c=>{c.preventDefault();const p=document.querySelector(l.getAttribute("href"));if(p){p.scrollIntoView({behavior:"smooth",block:"start"});const v=document.getElementById("ck-home-nav"),u=document.getElementById("ck-home-burger");v&&v.classList.remove("open"),u&&u.classList.remove("open")}})});const r=l=>{l.forEach(c=>{c.isIntersecting&&c.target.classList.add("ck-visible")})},d=new IntersectionObserver(r,{threshold:.1,rootMargin:"0px 0px -60px 0px"});document.querySelectorAll(".ck-how-card, .ck-buzz-meme, .ck-about-text, .ck-about-visual, .ck-faq-item").forEach(l=>{d.observe(l)})}const Kt="/api";async function b(e,t,i=null,a={}){const n=Se(),s={"Content-Type":"application/json"};n&&(s.Authorization=`Bearer ${n}`);const o={method:e,headers:s,...a};i!==null&&(o.body=JSON.stringify(i));const r=await fetch(`${Kt}${t}`,o);r.status===401&&(gt(),window.dispatchEvent(new CustomEvent("auth:expired")));const d=await r.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!r.ok){const l=new Error(d.error||`HTTP ${r.status}`);throw l.status=r.status,l.data=d,l}return d}const ht={login:(e,t)=>b("POST","/auth/login",{email:e,password:t}),signup:(e,t,i)=>b("POST","/auth/signup",{name:e,email:t,password:i}),changePassword:(e,t)=>b("POST","/auth/change-password",{current_password:e,new_password:t}),me:()=>b("GET","/auth/me")},Yt={listUsers:(e={})=>{const t=new URLSearchParams(e).toString();return b("GET",`/admin/users${t?"?"+t:""}`)},getUser:e=>b("GET",`/admin/users/${e}`),setRole:(e,t,i)=>b("POST",`/admin/users/${e}/role`,{role:t,assignedArea:i})},L={list:(e={})=>{const t=new URLSearchParams(e).toString();return b("GET",`/entities${t?"?"+t:""}`)},listTypes:()=>b("GET","/entities/entity-types"),createType:e=>b("POST","/entities/entity-types",e),createRule:e=>b("POST","/entities/rules",e),get:e=>b("GET",`/entities/${e}`),create:e=>b("POST","/entities",e),update:(e,t)=>b("PUT",`/entities/${e}`,t),softDelete:e=>b("DELETE",`/entities/${e}`),transition:(e,t,i)=>b("POST",`/entities/${e}/transition`,{to_status:t,reason:i}),fireRules:(e,t)=>b("POST",`/entities/${e}/fire-rules`,{eventType:t}),aiAnalysis:e=>b("POST",`/entities/${e}/ai-analysis`),audit:e=>b("GET",`/entities/${e}/audit`),getLineage:e=>b("GET",`/entities/${e}/lineage`),workflow:e=>b("GET",`/entities/${e}/workflow`)},Jt={list:e=>b("GET",`/entities/${e}/values`),create:(e,t)=>b("POST",`/entities/${e}/values`,{values:t}),upsert:(e,t)=>b("PUT",`/entities/${e}/values`,{values:t})},bt={getMetadata:()=>b("GET","/forms/metadata"),schema:e=>b("GET",`/forms/${e}/schema`),create:e=>b("POST","/forms",e),addSection:(e,t)=>b("POST",`/forms/${e}/sections`,t),addSubsection:(e,t)=>b("POST",`/sections/${e}/subsections`,t),addParameter:(e,t)=>b("POST",`/subsections/${e}/parameters`,t)},Ue={list:(e={})=>{const t=new URLSearchParams(e).toString();return b("GET",`/reports${t?"?"+t:""}`)},get:e=>b("GET",`/reports/${e}`),create:e=>b("POST","/reports",e),execute:(e,t={})=>{const i=new URLSearchParams(t).toString();return b("GET",`/reports/${e}/execute${i?"?"+i:""}`)}},Ci={validate:e=>b("POST","/module-builder/validate",e),deploy:e=>b("POST","/module-builder/deploy",e)},Re={list:(e={})=>{const t=new URLSearchParams(e).toString();return b("GET",`/jurisdictions${t?"?"+t:""}`)},tree:()=>b("GET","/jurisdictions?tree=true"),get:e=>b("GET",`/jurisdictions/${e}`),create:e=>b("POST","/jurisdictions",e),update:(e,t)=>b("PUT",`/jurisdictions/${e}`,t),deactivate:e=>b("DELETE",`/jurisdictions/${e}`)},Ei={getConfig:()=>b("GET","/governance/config"),analyze:e=>b("POST","/governance/analyze",e?{entity_type_id:e}:{})},Xt={chat:async(e,t,i=null)=>{if(!i)return b("POST","/agent/chat",{sessionId:e,message:t});const a=Se(),n=new FormData;n.append("sessionId",e),n.append("message",t||""),n.append("attachment",i);const s={};a&&(s.Authorization=`Bearer ${a}`);const o=await fetch(`${Kt}/agent/chat`,{method:"POST",headers:s,body:n});o.status===401&&(gt(),window.dispatchEvent(new CustomEvent("auth:expired")));const r=await o.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!o.ok){const d=new Error(r.error||`HTTP ${o.status}`);throw d.status=o.status,d.data=r,d}return r},clearSession:e=>b("DELETE",`/agent/chat/${e}`).catch(()=>{})};let _i=0;function ze(e,t="default",i=3500){const a=document.getElementById("toast-container"),n=++_i,s=document.createElement("div");return s.className=`toast toast-${t}`,s.id=`toast-${n}`,s.innerHTML=`
    <span>${zi(e)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `,a.appendChild(s),setTimeout(()=>{s.remove()},i),n}function Pe(e){return ze(e,"default")}function q(e){return ze(e,"success")}function $(e){return ze(e,"error")}function Si(e){return ze(e,"warning")}function zi(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Mi=Object.freeze(Object.defineProperty({__proto__:null,showToast:ze,toast:Pe,toastError:$,toastSuccess:q,toastWarning:Si},Symbol.toStringTag,{value:"Module"}));function Li(){if(Ve()){z("/dashboard");return}const e=document.getElementById("app");e.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <a href="/" style="font-size:0.8125rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
          </a>
          ${qe({idPrefix:"login"})}
        </div>

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
  `;const t=document.getElementById("password"),i=document.getElementById("toggle-password-btn"),a='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',n='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>';i&&t&&i.addEventListener("click",()=>{const o=t.getAttribute("type")==="password"?"text":"password";t.setAttribute("type",o),i.setAttribute("aria-label",o==="password"?"Show password":"Hide password"),i.innerHTML=o==="password"?a:n});const s=document.getElementById("login-error-alert");document.getElementById("login-form").addEventListener("submit",async o=>{o.preventDefault(),s&&(s.classList.add("hidden"),s.textContent="");const r=document.getElementById("login-btn"),d=document.getElementById("email").value.trim(),l=t.value;if(!d||!l){s&&(s.textContent="Please enter both email address and password.",s.classList.remove("hidden"));return}r.disabled=!0,r.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';try{const c=await ht.login(d,l);vt({token:c.data.token,user:c.data.user}),z("/dashboard")}catch(c){const p=c.message||"Invalid email or password. Please check your credentials.";s&&(s.textContent=p,s.classList.remove("hidden")),$(p),r.disabled=!1,r.innerHTML="Sign In"}}),Fe("login")}function Ii(){if(Ve()){z("/dashboard");return}const e=document.getElementById("app");e.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <a href="/" style="font-size:0.8125rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
          </a>
          ${qe({idPrefix:"signup"})}
        </div>

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
  `,document.getElementById("signup-form").addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("signup-btn"),a=document.getElementById("name").value.trim(),n=document.getElementById("email").value.trim(),s=document.getElementById("password").value;if(!(!a||!n||!s)){i.disabled=!0,i.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';try{const o=await ht.signup(a,n,s);vt({token:o.data.token,user:o.data.user}),z("/dashboard")}catch(o){$(o.message||"Signup failed"),i.disabled=!1,i.innerHTML="Create Account"}}}),Fe("signup")}const st={initiative:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",grievance:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",park:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",passport:"M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",charter:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",employment:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",volunteer:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",legacy:"M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",feedback:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",survey:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",default:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},Qt={"🌱":"initiative","🚨":"grievance","⚠️":"grievance","🪪":"passport","📜":"charter","💼":"employment","🤝":"volunteer","🏛️":"legacy","🏛":"legacy","💬":"feedback","📢":"feedback","📊":"survey","📋":"survey","🌳":"park","🏞️":"park","🏞":"park","🏗️":"legacy","🏗":"legacy","🛡️":"charter","🛡":"charter","⚡":"default","⚡️":"default"};function te(e,t=20,i=""){const a=Qt[e]||e,n=st[a]||st.default;return`<svg width="${t}" height="${t}" class="${i}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${n}"/></svg>`}const Ai={Movement:{title:"Start a Civic Initiative",shortTitle:"Civic Initiative",description:"Organize citizens around community goals, public spaces, and urban projects.",category:"Community Action",iconKey:"initiative",actionLabel:"Start Initiative"},Grievance:{title:"Report a Civic Problem",shortTitle:"Civic Problem",description:"Report infrastructure defects, sanitation issues, or public safety concerns.",category:"Public Services",iconKey:"grievance",actionLabel:"Report Issue"},"Park Renovation Request":{title:"Park Renovation Request",shortTitle:"Park Renovation",description:"Propose public park upgrades, playground repairs, or green space restoration.",category:"Urban Infrastructure",iconKey:"park",actionLabel:"Request Renovation"},"Citizen Passport":{title:"Citizen Passport & Contribution",shortTitle:"Citizen Passport",description:"Track community contributions, volunteer hours, and civic engagement history.",category:"Civic Identity",iconKey:"passport",actionLabel:"Update Passport"},"Digital Civic Constitution":{title:"Civic Charter & Guidelines",shortTitle:"Civic Charter",description:"Establish community guidelines, governance rules, and transparency terms.",category:"Governance",iconKey:"charter",actionLabel:"Draft Charter"},"Employment Exchange":{title:"Civic Skills & Employment",shortTitle:"Employment Exchange",description:"Post and discover civic project roles, community jobs, and skill opportunities.",category:"Opportunity",iconKey:"employment",actionLabel:"Post Role"},"Volunteer Management":{title:"Volunteer Operations",shortTitle:"Volunteer Drive",description:"Coordinate volunteer tasks, register community helpers, and track activities.",category:"Community Action",iconKey:"volunteer",actionLabel:"Register Volunteer"},"Legacy & Continuity":{title:"Project Continuity & Legacy",shortTitle:"Project Continuity",description:"Transition completed initiatives into permanent NGOs, startups, or civic centers.",category:"Governance",iconKey:"legacy",actionLabel:"Plan Continuity"},"Public Feedback":{title:"Public Feedback",shortTitle:"Public Feedback",description:"Collect structured community feedback on civic initiatives and public services.",category:"Civic Operations",iconKey:"feedback",actionLabel:"Submit Feedback"},"Public Survey":{title:"Public Survey",shortTitle:"Public Survey",description:"Run community surveys and opinion polls for civic decision-making.",category:"Civic Operations",iconKey:"survey",actionLabel:"Start Survey"}};function Y(e){var n;if(!e)return{title:"Civic Capability",shortTitle:"Capability",description:"Metadata-driven civic module.",category:"Civic Operations",iconKey:"default",icon:te("default",16),iconLarge:te("default",24),actionLabel:"Start Action"};const t=e.name||"",i=Ai[t];if(i)return{title:i.title,shortTitle:i.shortTitle,description:e.description||i.description,category:i.category,iconKey:i.iconKey,icon:te(i.iconKey,16),iconLarge:te(i.iconKey,24),actionLabel:i.actionLabel,rawName:t};const a=e.icon&&Qt[e.icon]||(e.icon&&st[e.icon]?e.icon:null)||"default";return{title:t,shortTitle:t,description:e.description||"Metadata-configured civic capability module.",category:((n=e.domain)==null?void 0:n.domain_name)||"Civic Operations",iconKey:a,icon:te(a,16),iconLarge:te(a,24),actionLabel:`Start ${t}`,rawName:t}}function ne(e){if(!e)return"Unknown";switch(e.toLowerCase()){case"draft":return"Draft (Unsubmitted)";case"submitted":return"Submitted (Awaiting Review)";case"coordinator_approved":return"Verified (Pending Approval)";case"verified":return"Verified";case"approved":return"Approved & Active";case"rejected":return"Rejected";case"closed":return"Closed";default:return e.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}}function T(e,t="",i=[]){const a=re(),n=Wt();if(!a)return e;const s=window.location.pathname,o=window.location.search;let r=[],d="CIVIC CAPABILITIES";n==="citizen"?r=[{path:"/dashboard",label:"Home",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/agent/chat?message=I+want+to+report+a+problem",label:"Report a Problem",icon:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"},{path:"/agent/chat?message=I+want+to+start+an+initiative",label:"Start an Initiative",icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"},{path:"/agent/chat?message=I+want+to+contribute+or+volunteer",label:"Contribute / Volunteer",icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"},{path:"/agent/chat?message=I+want+to+understand+a+civic+issue",label:"Understand an Issue",icon:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"},{path:"/entities",label:"My Civic Activity",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/buzz",label:"Civic Buzz & Memes",icon:"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"}]:n==="coordinator_area"||n==="coordinator_general"?(r=[{path:"/dashboard",label:"Operations Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"Cases Queue",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/buzz",label:"Civic Buzz & Memes",icon:"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],d="ACTIVE CAPABILITIES"):n==="director"?(r=[{path:"/dashboard",label:"Governance Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/entities",label:"All Operations",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/buzz",label:"Civic Buzz & Memes",icon:"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"},{path:"/module-builder",label:"Capability Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],d="ACTIVE CAPABILITIES"):(r=[{path:"/dashboard",label:"Civic OS Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/modules",label:"Modules & Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/module-builder",label:"No-Code Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/entities",label:"All Cases & Records",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/buzz",label:"Civic Buzz & Memes",icon:"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},{path:"/admin",label:"User & Role Admin",icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"}],d="CAPABILITY METADATA");const l=v=>v.map(u=>`
    <li class="sidebar-nav-item">
      <a href="${u.path}" class="sidebar-nav-link ${s===u.path&&!o?"active":""}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${u.icon}"></path></svg>
        ${V(u.label)}
      </a>
    </li>
  `).join("");let c="";n!=="citizen"&&Array.isArray(i)&&i.length>0&&(c=i.map(v=>{var h;const u=Y(v),g=`/entities?entity_type_id=${v.entity_type_id}`,C=o.includes(`entity_type_id=${v.entity_type_id}`);return`
        <li class="sidebar-nav-item">
          <a href="${g}" class="sidebar-nav-link ${C?"active":""}" style="font-size:13px; padding:6px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${te(u.iconKey,16)}
            </span>
            <span class="truncate" style="flex:1;">${V(u.shortTitle)}</span>
            ${((h=v._count)==null?void 0:h.entities)!==void 0?`<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${v._count.entities}</span>`:""}
          </a>
        </li>
      `}).join(""));const p=n==="coordinator_area"&&a.assignedArea?`${ke(n)} • ${a.assignedArea}`:ke(n);return`
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>
        
        <div class="sidebar-section">
          <div class="sidebar-group-title">NAVIGATION</div>
          <ul class="sidebar-nav">
            ${l(r)}
          </ul>
        </div>

        ${c?`
          <div class="sidebar-section mt-4">
            <div class="sidebar-group-title">${d}</div>
            <ul class="sidebar-nav">
              ${c}
            </ul>
          </div>
        `:""}
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-card" style="cursor:pointer;">
            <div class="user-avatar">${V(a.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${V(a.name)}</div>
              <div class="user-role truncate" title="${V(p)}">${V(p)}</div>
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
              <span style="font-weight:600; color:var(--text-primary);">${V(t)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- Language Selector -->
            ${qe({idPrefix:"topbar"})}

            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${V(a.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary);">${V(a.name.split(" ")[0])}</span>
                  <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${V(ke(n))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${V(a.name)}</div>
                  <div class="user-dropdown-role">${V(ke(n))}</div>
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
  `}function B(){ki().catch(()=>{}),Fe("topbar");const e=document.getElementById("topbar-user-btn"),t=document.getElementById("user-dropdown-menu");e&&t&&(e.addEventListener("click",o=>{o.stopPropagation(),t.classList.toggle("show")}),document.addEventListener("click",o=>{!t.contains(o.target)&&!e.contains(o.target)&&t.classList.remove("show")}));const i=document.getElementById("dropdown-logout-btn");i&&i.addEventListener("click",o=>{o.preventDefault(),gt(),z("/login")});const a=document.getElementById("sidebar-user-card");a&&a.addEventListener("click",()=>{z("/profile")});const n=document.getElementById("mobile-menu-btn"),s=document.getElementById("sidebar");n&&s&&n.addEventListener("click",()=>{s.classList.toggle("open")})}function V(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function N(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const S={search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',sparkle:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>',mic:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>',send:'<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',arrowRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',chevronRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',alertTriangle:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',lightbulb:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',users:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',bookOpen:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',clipboard:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',heart:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',checkCircle:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',road:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M20 19L16 5"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="14"/><line x1="12" y1="18" x2="12" y2="20"/></svg>',trash:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',zap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',leaf:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 2-5.5 3.5-9 3.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',mapPin:'<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',usersSm:'<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>'};async function Ge(){if(!J(z))return;const e=re(),t=document.getElementById("app");t.innerHTML=T(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Workspace"),B();try{const a=(await bt.getMetadata().catch(()=>({success:!1,data:{entityTypes:[],rules:[],domains:[]}}))).data||{entityTypes:[],rules:[],domains:[]};let n="Home",s=`Good day, <strong>${N(e.name)}</strong>. Here is what is happening in your civic workspace.`;e.role==="coordinator_area"||e.role==="coordinator_general"?(n="Civic Operations Workspace",s=`Operations view for <strong>${N(e.name)}</strong>`):e.role==="director"?(n="Executive Governance Workspace",s=`Executive view for <strong>${N(e.name)}</strong>`):e.role==="admin"&&(n="Civic OS Administration",s=`Platform admin for <strong>${N(e.name)}</strong>`);const o=e.role==="citizen";t.innerHTML=T(`
      ${o?'<div id="dash-actions" style="display:none;"></div>':`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${N(n)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">${s}</p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      `}
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `,n,a.entityTypes),B();const r=document.getElementById("dash-content"),d=document.getElementById("dash-actions");if(e.role==="citizen"){d.innerHTML="";const l=document.getElementById("page-content");l&&l.classList.add("ck-citizen-page-content"),await Ti(r,e,a)}else e.role==="coordinator_area"?(d.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await Pi(r,e,a)):e.role==="coordinator_general"?(d.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await Hi(r,e,a)):e.role==="director"?(d.innerHTML='<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>',await Ni(r,e,a)):e.role==="admin"&&(d.innerHTML=`
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `,await Oi(r,e,a));typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{$("Failed to load workspace data"),document.getElementById("dash-content").innerHTML='<div class="alert alert-error">Failed to load workspace data. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}async function Ti(e,t,i){const n=(await L.list({owner_user_id:t.user_id,limit:50}).catch(()=>({data:[]}))).data||[],s=n.filter(h=>h.status==="draft").length,o=n.filter(h=>["submitted","coordinator_approved","in_review"].includes(h.status)).length,r=n.filter(h=>["approved","closed","rejected"].includes(h.status)).length,d=n.filter(h=>h.isFollowing).length||5;let c=(await L.list({limit:6}).catch(()=>({data:[]}))).data||[],p=c.length>=3?c:ji(c);const v=h=>{const y={submitted:{label:"Submitted",bg:"#fef3c7",color:"#92400e"},coordinator_approved:{label:"In Progress",bg:"#dbeafe",color:"#1e40af"},approved:{label:"Open",bg:"#dcfce7",color:"#166534"},draft:{label:"Draft",bg:"#f1f5f9",color:"#475569"},rejected:{label:"Closed",bg:"#fee2e2",color:"#991b1b"},default:{label:"Active",bg:"#ffedd5",color:"#9a3412"}},E=y[h]||y.default;return`<span class="ck-rx-status-pill" style="background:${E.bg}; color:${E.color};">${E.label}</span>`},u=(h="")=>{const y=h.toLowerCase();return y.includes("tree")||y.includes("park")||y.includes("green")||y.includes("garden")?S.leaf:y.includes("light")||y.includes("wire")||y.includes("power")||y.includes("pole")?S.zap:y.includes("garbage")||y.includes("waste")||y.includes("sanitation")||y.includes("clean")?S.trash:S.road},g=p.map((h,y)=>`
      <div class="ck-rx-issue-card">
        <div class="ck-rx-issue-top">
          <div class="ck-rx-issue-icon">
            ${u(h.name)}
          </div>
          ${v(h.status)}
        </div>
        <div class="ck-rx-issue-name" title="${N(h.name)}">${N(h.name)}</div>
        <div class="ck-rx-issue-area">
          ${S.mapPin}
          <span>${N(h.area||"Ward 14 · Pune")}</span>
        </div>
        <div class="ck-rx-issue-footer">
          <span class="ck-rx-issue-meta">
            ${S.usersSm}
            ${y*14+18} citizens backing
          </span>
          <a href="/entities/${h.entity_id||""}" class="ck-rx-issue-link">
            View ${S.chevronRight}
          </a>
        </div>
      </div>
    `).join(""),C=Ri();e.innerHTML=`
    <!-- ░░ REVENUEX-STYLE MINIMALIST EDITORIAL DASHBOARD ░░ -->
    <div class="ck-rx-layout">
      <!-- ░░ MAIN CONTENT ░░ -->
      <main class="ck-rx-main">

        <!-- 1. Sleek Search & AI Command Bar (RevenueX Style) -->
        <div class="ck-rx-search-wrap">
          <div class="ck-rx-search-bar">
            <span class="ck-rx-search-icon">${S.search}</span>
            <input
              id="ck-hero-input"
              type="text"
              autocomplete="off"
              placeholder="Search data, reports, or ask Kalki AI..."
              class="ck-rx-search-input"
              aria-label="Search data, reports, or ask Kalki AI"
            />
            <button class="ck-rx-mic-btn" id="ck-hero-mic-btn" title="Voice input">
              ${S.mic}
            </button>
            <button class="ck-rx-send-btn" id="ck-hero-send-btn" title="Submit">
              ${S.send}
            </button>
            <div class="ck-rx-kbd-badge">⌘ + Space</div>
          </div>
        </div>

        <!-- 2. Performance / Civic Overview Heading -->
        <div class="ck-rx-overview-head">
          <h1 class="ck-rx-overview-title">Civic Overview</h1>
          <p class="ck-rx-overview-sub">Your reports, ward resolutions, and initiatives — all in one place</p>
        </div>

        <!-- 3. Featured Silk Banner in Brand Orange Hue (Direct RevenueX Homage) -->
        <div class="ck-rx-featured-card">
          <div class="ck-rx-featured-silk"></div>
          <div class="ck-rx-featured-content">
            <div class="ck-rx-featured-badge">
              <span class="ck-rx-badge-dot"></span>
              <span class="ck-rx-badge-icon">${S.sparkle}</span>
              <span>Kalki AI · Live data</span>
            </div>
            
            <h2 class="ck-rx-featured-heading">Explore your neighborhood</h2>
            <p class="ck-rx-featured-sub">Dive into trends, active resolutions, and community insights</p>

            <!-- Clean, professional quick action chips -->
            <div class="ck-rx-chips-row">
              <button class="ck-rx-chip" data-text="Report an overflowing garbage dump">Overflowing garbage</button>
              <button class="ck-rx-chip" data-text="Report broken streetlights on my road">Broken streetlight</button>
              <button class="ck-rx-chip" data-text="Start a community park cleanup drive">Park cleanup</button>
              <button class="ck-rx-chip" data-text="Who is my ward coordinator?">Who is my coordinator?</button>
            </div>
          </div>
        </div>

        <!-- 4. Core Gateways (Clean Minimalist Cards) -->
        <div class="ck-rx-actions-grid">
          <a href="/agent/chat?message=I+want+to+report+a+problem" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${S.alertTriangle}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Report a Problem</div>
              <div class="ck-rx-action-desc">Potholes, waste dumping, dark roads, or water leaks.</div>
            </div>
            <span class="ck-rx-action-arrow">${S.arrowRight}</span>
          </a>

          <a href="/agent/chat?message=I+want+to+start+an+initiative" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${S.lightbulb}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Start an Initiative</div>
              <div class="ck-rx-action-desc">Rally your neighbors for cleanups, greening & safety.</div>
            </div>
            <span class="ck-rx-action-arrow">${S.arrowRight}</span>
          </a>

          <a href="/agent/chat?message=I+want+to+contribute+or+volunteer" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${S.users}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">I want to Contribute</div>
              <div class="ck-rx-action-desc">Share professional skills, sponsor tools, or volunteer.</div>
            </div>
            <span class="ck-rx-action-arrow">${S.arrowRight}</span>
          </a>

          <a href="/agent/chat?message=I+want+to+understand+a+civic+issue" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${S.bookOpen}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Understand an Issue</div>
              <div class="ck-rx-action-desc">Look up municipal bylaws, ward budget allocations & rights.</div>
            </div>
            <span class="ck-rx-action-arrow">${S.arrowRight}</span>
          </a>
        </div>

        <!-- 5. What's Happening Around You (RevenueX Table / Grid Style) -->
        <div class="ck-rx-section-header">
          <div>
            <h3 class="ck-rx-section-title">Community Activity</h3>
            <p class="ck-rx-section-sub">Active civic operations and reported cases in your ward</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">View all ${S.chevronRight}</a>
        </div>

        <div class="ck-rx-issues-grid">
          ${g}
        </div>

        <!-- 6. Trending in your city -->
        <div class="ck-rx-section-header" style="margin-top:36px;">
          <div>
            <h3 class="ck-rx-section-title">Trending in Your City</h3>
            <p class="ck-rx-section-sub">Top initiatives gaining citizen backing this week</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">See all ${S.chevronRight}</a>
        </div>

        <div class="ck-rx-trending-list">
          ${C}
        </div>

      </main><!-- /.ck-rx-main -->

      <!-- ░░ RIGHT SIDEBAR (MINIMALIST REVENUEX STYLE) ░░ -->
      <aside class="ck-rx-aside">

        <!-- Inboxes / Quick Actions -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">My Inboxes</div>
          
          <a href="/entities" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${S.clipboard}
            </div>
            <span class="ck-rx-inbox-label">My Requests</span>
            <span class="ck-rx-inbox-badge">${o+s}</span>
            <span class="ck-rx-inbox-chevron">${S.chevronRight}</span>
          </a>

          <a href="/entities?following=1" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${S.heart}
            </div>
            <span class="ck-rx-inbox-label">Following</span>
            <span class="ck-rx-inbox-badge">${d}</span>
            <span class="ck-rx-inbox-chevron">${S.chevronRight}</span>
          </a>

          <a href="/entities?status=approved" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${S.checkCircle}
            </div>
            <span class="ck-rx-inbox-label">Contributions</span>
            <span class="ck-rx-inbox-badge">${r}</span>
            <span class="ck-rx-inbox-chevron">${S.chevronRight}</span>
          </a>
        </div>

        <!-- Civic Spotlight (Clean, No Cringe Memes) -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Civic Spotlight</div>
          <div class="ck-rx-spotlight-card">
            <div class="ck-rx-spotlight-tag">Featured Movement</div>
            <div class="ck-rx-spotlight-title">FC Road Pedestrian Safety & Crossing</div>
            <div class="ck-rx-spotlight-desc">Citizens organized 120 verified signatures to install a raised crosswalk near Fergusson College.</div>
            <div class="ck-rx-spotlight-stats">
              <span>${S.usersSm} 42 supporters</span>
              <span>·</span>
              <span>Ward 14</span>
            </div>
            <a href="/entities" class="btn btn-primary btn-sm" style="width:100%; text-align:center; margin-top:8px;">
              Support Initiative
            </a>
          </div>
        </div>

        <!-- Activity Overview -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Activity Snapshot</div>
          <div class="ck-rx-stat-row">
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num">${o}</span>
              <span class="ck-rx-stat-label">Active</span>
            </div>
            <div class="ck-rx-stat-divider"></div>
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num" style="color:#10b981;">${r}</span>
              <span class="ck-rx-stat-label">Resolved</span>
            </div>
            <div class="ck-rx-stat-divider"></div>
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num" style="color:#64748b;">${s}</span>
              <span class="ck-rx-stat-label">Drafts</span>
            </div>
          </div>
          <a href="/entities" class="btn btn-secondary btn-sm" style="width:100%; text-align:center; margin-top:12px;">
            View Full Records ${S.chevronRight}
          </a>
        </div>

      </aside><!-- /.ck-rx-aside -->
    </div><!-- /.ck-rx-layout -->
  `,Bi()}function Bi(){const e=document.getElementById("ck-hero-input"),t=document.getElementById("ck-hero-send-btn"),i=document.getElementById("ck-hero-mic-btn");if(!e||!t)return;document.querySelectorAll(".ck-rx-chip").forEach(n=>{n.addEventListener("click",()=>{const s=n.getAttribute("data-text");s&&(e.value=s,e.focus())})}),i&&i.addEventListener("click",()=>{i.classList.toggle("active"),i.classList.contains("active")?(e.placeholder="Listening... describe your issue",setTimeout(()=>{i.classList.contains("active")&&(e.value="Pothole on Main Road near Bus Stop 4",i.classList.remove("active"),e.placeholder="Search data, reports, or ask Kalki AI...")},2e3)):e.placeholder="Search data, reports, or ask Kalki AI..."});function a(){const n=e.value.trim();if(!n)return;const s="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);window.navigate?window.navigate(`/agent/chat?sessionId=${encodeURIComponent(s)}&message=${encodeURIComponent(n)}`):window.location.href=`/agent/chat?sessionId=${encodeURIComponent(s)}&message=${encodeURIComponent(n)}`}t.addEventListener("click",a),e.addEventListener("keydown",n=>{n.key==="Enter"&&!n.shiftKey&&(n.preventDefault(),a())})}function ji(e){const t=[{name:"FC Road Pedestrian Crosswalk & Safety Lights",area:"Ward 14 · Shivajinagar",status:"coordinator_approved"},{name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",status:"approved"},{name:"Baner Sector 4 Waste Segregation Drive",area:"Ward 2 · Baner",status:"submitted"},{name:"Model Colony Park Solar Lighting Audit",area:"Ward 11 · Model Colony",status:"coordinator_approved"}],i=[...e];for(const a of t){if(i.length>=4)break;i.some(n=>n.name===a.name)||i.push(a)}return i}function Ri(){return[{rank:"01",name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",count:64},{rank:"02",name:"FC Road Pedestrian Safety & Zebra Crossings",area:"Ward 14 · Shivajinagar",count:52},{rank:"03",name:"Baner Wet-Waste Decentralized Composting",area:"Ward 2 · Baner",count:41}].map(t=>`
    <div class="ck-rx-trending-row">
      <span class="ck-rx-trending-num">${t.rank}</span>
      <div class="ck-rx-trending-info">
        <div class="ck-rx-trending-name">${t.name}</div>
        <div class="ck-rx-trending-sub">${t.area} · ${t.count} citizens backing</div>
      </div>
      <a href="/entities" class="ck-rx-trending-arrow">
        ${S.chevronRight}
      </a>
    </div>
  `).join("")}async function Pi(e,t,i){var o;const a=t.assignedArea,n=await L.list({status:"submitted",area:a,limit:10}),s=n.data||[];e.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${N(a||"Sector 5")}</div>
      <span class="badge badge-primary">Area Coordinator</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((o=n.pagination)==null?void 0:o.total)||s.length}</div>
        <div class="kpi-label">Pending Area Verification</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Submitted cases in ${N(a||"Sector 5")} awaiting verification</div>
        </div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${yt(s,!0)}
    </div>
  `}async function Hi(e,t,i){var s;const a=await L.list({status:"submitted",area:"Unassigned",limit:10}),n=a.data||[];e.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (Handling Unassigned Areas & Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((s=a.pagination)==null?void 0:s.total)||n.length}</div>
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
      ${yt(n,!0)}
    </div>
  `}async function Ni(e,t,i){var s;const a=await L.list({status:"coordinator_approved",limit:10}),n=a.data||[];e.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((s=a.pagination)==null?void 0:s.total)||n.length}</div>
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
      ${yt(n,!0)}
    </div>
  `}async function Oi(e,t,i){var o,r,d;const[a,n,s]=await Promise.all([L.list({limit:1}),L.list({status:"submitted",limit:1}),L.list({status:"approved",limit:1})]);e.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${((o=a.pagination)==null?void 0:o.total)||0}</div>
        <div class="kpi-label">Total System Cases</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((r=n.pagination)==null?void 0:r.total)||0}</div>
        <div class="kpi-label">In Workflow</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${((d=s.pagination)==null?void 0:d.total)||0}</div>
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
  `}function yt(e,t=!1){if(!e||e.length===0)return`
      <div class="table-empty" style="padding:32px; text-align:center; color:var(--text-muted);">
        <p style="font-size:0.9rem; font-weight:500;">No active cases in this view.</p>
      </div>
    `;const i=e.map(a=>{var n,s;return`
    <tr>
      <td><a href="/entities/${a.entity_id}" class="text-link font-medium">#${a.entity_id}</a></td>
      <td>
        <a href="/entities/${a.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
          ${N(a.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${N(((n=a.entityType)==null?void 0:n.name)||"Capability")}</span></td>
      ${t?`<td>${N(((s=a.owner)==null?void 0:s.name)||"System")}</td>`:""}
      <td>${N(a.area||"—")}</td>
      <td><span class="badge badge-${a.status}">${ne(a.status)}</span></td>
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
  `}function ie(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let M={page:1,limit:20},xe=[];async function Di(e={},t=null){if(!J(z))return;const i=t||new URLSearchParams(window.location.search);i.has("status")?M.status=i.get("status"):delete M.status,i.has("entity_type_id")?M.entity_type_id=i.get("entity_type_id"):delete M.entity_type_id,i.has("name")?M.name=i.get("name"):delete M.name,i.has("page")?M.page=Number(i.get("page")):M.page=1;try{xe=(await L.listTypes().catch(()=>({data:[]}))).data||[]}catch{xe=[]}const a=xe.find(c=>String(c.entity_type_id)===String(M.entity_type_id)),n=Y(a),s=a?`${n.title} Cases`:"All Cases & Requests",o=a?`Browsing cases for capability "${n.title}".`:"Browse, search, and track all civic cases and requests across your workspace.",r=document.getElementById("app");r.innerHTML=T(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${ie(s)}</h1>
        <p id="entities-header-subtitle">${ie(o)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${M.entity_type_id?`?entity_type_id=${M.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
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
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${ie(M.name||"")}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${xe.map(c=>{const p=Y(c);return`<option value="${c.entity_type_id}" ${String(M.entity_type_id)===String(c.entity_type_id)?"selected":""}>${ie(p.title)}</option>`}).join("")}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${M.status==="draft"?"selected":""}>Draft</option>
            <option value="submitted" ${M.status==="submitted"?"selected":""}>Submitted</option>
            <option value="coordinator_approved" ${M.status==="coordinator_approved"?"selected":""}>Verified (Pending Approval)</option>
            <option value="approved" ${M.status==="approved"?"selected":""}>Approved & Active</option>
            <option value="rejected" ${M.status==="rejected"?"selected":""}>Rejected</option>
            <option value="closed" ${M.status==="closed"?"selected":""}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${M.status||M.entity_type_id||M.name?`
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
  `,s,xe),B();const d=()=>{const c=document.getElementById("filter-status").value,p=document.getElementById("filter-type").value,v=document.getElementById("filter-search").value.trim(),u=new URLSearchParams;c&&u.set("status",c),p&&u.set("entity_type_id",p),v&&u.set("name",v),z(`/entities${u.toString()?"?"+u.toString():""}`)};document.getElementById("btn-filter").addEventListener("click",d),document.getElementById("filter-search").addEventListener("keypress",c=>{c.key==="Enter"&&d()});const l=document.getElementById("btn-clear-filter");l&&l.addEventListener("click",()=>{z("/entities")}),await qi()}async function qi(){const e=document.getElementById("entities-content");if(e)try{const t=await L.list(M),{data:i,pagination:a}=t;if(!i||i.length===0){e.innerHTML=`
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
            <a href="/entities/new${M.entity_type_id?`?entity_type_id=${M.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;return}const n=i.map(l=>{var p;const c=Y(l.entityType);return`
        <tr>
          <td><a href="/entities/${l.entity_id}" class="text-link font-medium">#PR-${String(l.entity_id).padStart(5,"0")}</a></td>
          <td>
            <a href="/entities/${l.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${ie(l.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${ie(c.shortTitle)}</span></td>
          <td>${ie(((p=l.owner)==null?void 0:p.name)||"System")}</td>
          <td>${ie(l.area||"—")}</td>
          <td><span class="badge badge-${l.status}">${ne(l.status)}</span></td>
          <td>
            <a href="/entities/${l.entity_id}" class="btn btn-secondary btn-sm">Review Case →</a>
          </td>
        </tr>
      `}).join(""),s=Math.ceil(a.total/a.limit);let o="";s>1&&(o=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 8px;">
          <div style="font-size:0.85rem; color:var(--text-muted);">
            Showing page ${a.page} of ${s} (${a.total} total cases)
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-prev" ${a.page<=1?"disabled":""}>← Previous</button>
            <button class="btn btn-secondary btn-sm" id="btn-next" ${a.page>=s?"disabled":""}>Next →</button>
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
    `;const r=document.getElementById("btn-prev"),d=document.getElementById("btn-next");r&&r.addEventListener("click",()=>{const l=new URLSearchParams(window.location.search);l.set("page",String(M.page-1)),z(`/entities?${l.toString()}`)}),d&&d.addEventListener("click",()=>{const l=new URLSearchParams(window.location.search);l.set("page",String(M.page+1)),z(`/entities?${l.toString()}`)}),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{$("Failed to load cases"),e.innerHTML='<div class="alert alert-error">Error loading cases. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}let He=null;function ot({title:e,content:t,footer:i="",onClose:a=()=>{}}){ue();const n=document.getElementById("modal-container"),s=`
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${Fi(e)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${t}
      </div>
      ${i?`<div class="modal-footer">${i}</div>`:""}
    </div>
  `;n.innerHTML=s,n.style.pointerEvents="auto";const o=()=>{n.innerHTML="",n.style.pointerEvents="none",He=null,a()};He=o,document.getElementById("modal-close-btn").addEventListener("click",o),document.getElementById("modal-backdrop").addEventListener("click",o);const r=d=>{d.key==="Escape"&&(o(),document.removeEventListener("keydown",r))};document.addEventListener("keydown",r)}function ue(){He&&He()}function Fi(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function k(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function xt({id:e}){var n;const t=String(e||"").split("?")[0].split("#")[0];if(!t||t==="new"){z("/entities/new"+(window.location.search||""));return}if(!J(z))return;const i=re(),a=document.getElementById("app");a.innerHTML=T(`
    <div class="page-header mb-4" style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">My Requests</a> / Case #${t}</div>
        <h1 id="header-title">Loading Case...</h1>
      </div>
      <div id="header-extra-actions" style="display:flex; gap:10px;"></div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,`Case #${t}`),B();try{const[s,o,r,d,l]=await Promise.all([L.get(t),Jt.list(t).catch(()=>({data:[]})),L.audit(t).catch(()=>({data:{auditLogs:[],approvalHistory:[]}})),L.getLineage(t).catch(()=>({data:{current:null,parent:null,children:[],rules:[]}})),L.workflow(t).catch(()=>({data:{allowedTransitions:[]}}))]),c=s.data,p=o.data||[],v=r.data||{auditLogs:[],approvalHistory:[]},u=d.data||{current:null,parent:null,children:[],rules:[]},g=l.data||{allowedTransitions:[]};let C=[];try{C=(await Ue.list({entity_type_id:c.entity_type_id})).data||[]}catch{C=[]}if(document.getElementById("header-title").textContent=c.name,["approved","coordinator_approved","verified","in_progress","resolved","closed"].includes(String(c.status||"").toLowerCase())&&((n=c.entityType)==null?void 0:n.name)!=="Civic Campaign"){const E=document.getElementById("header-extra-actions");E&&(E.innerHTML=`
          <a href="/meme/studio/${c.entity_id}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; border-color:#f59e0b; color:#d97706; background:#fffbeb;">
            <span>⚡</span> Create Civic Meme
          </a>
        `)}Vi(document.getElementById("detail-content"),c,p,v,u,g,C,i)}catch(s){console.error("Failed to load case detail:",s),$("Failed to load case details"),document.getElementById("detail-content").innerHTML=`<div class="alert alert-error">Failed to load case #${t}. It may not exist.</div>`}}function Vi(e,t,i,a,n,s,o,r){var Et,_t;const d=Y(t.entityType),l=["draft","submitted","coordinator_approved","approved"],c=l.indexOf(t.status)!==-1?l.indexOf(t.status):-1,p=t.status==="rejected";let v='<div class="workflow-steps mt-4 mb-2">';l.forEach((w,U)=>{const ye=U<c||U===c&&!p&&t.status==="approved",di=U===c&&t.status!=="approved";v+=`
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${p&&U===c?"rejected":ye?"done":di?"current":""}">${U+1}</div>
          <div class="workflow-step-label mt-1">${Wi(w)}</div>
        </div>
        ${U<l.length-1?`<div class="workflow-step-connector ${ye?"done":""}"></div>`:""}
      </div>
    `}),p&&(v+=`
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `),v+="</div>";const u=Ui(t,s.allowedTransitions||[],r),g=r&&["coordinator_area","coordinator_general","director","admin"].includes(r.role);let C="";g&&t.status!=="deleted"&&(C=`
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
    `);let h="";n.children&&n.children.length>0&&(h=`
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
                ${n.children.map(w=>`
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(w.entity_id).padStart(5,"0")} ${k(w.name)}</strong>
                      <span class="badge badge-secondary ml-2">${k(w.type_name)}</span>
                    </div>
                    <a href="/entities/${w.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);const y=i.map(w=>{var U,ye;return`
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${k(((U=w.parameterMaster)==null?void 0:U.label)||((ye=w.parameterMaster)==null?void 0:ye.field_key)||`Parameter #${w.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${k(w.value||"—")}</td>
    </tr>
  `}).join(""),E=i.length>0?`<div class="table-container"><table class="table"><tbody>${y}</tbody></table></div>`:'<div class="text-muted p-4">No custom parameter values submitted for this case.</div>',X=a.auditLogs||[];a.approvalHistory;const le=X.map(w=>`
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${k(w.user||"System")}</strong> (${k(w.role||"User")})</span>
        <span>${new Date(w.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${w.action==="status_transition"?`Status Transition: <strong>${ne(w.old_status)}</strong> → <strong>${ne(w.new_status)}</strong>`:`Action Executed: <strong>${w.action}</strong>`}
      </div>
      ${w.reason?`<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${k(w.reason)}"</div>`:""}
    </div>
  `).join(""),wt=X.length>0?`<div>${le}</div>`:'<div class="text-muted p-4">No audit logs recorded yet for this case.</div>';let Me="";o.length>0&&(Me=`
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
            ${o.map(w=>`
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${w.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${k(w.report_name)}"
              </button>
            `).join("")}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `);let $t="";(n.parent||n.children&&n.children.length>0)&&($t=`
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
              <a href="/entities/${n.parent.entity_id}" class="text-link font-medium">#PR-${String(n.parent.entity_id).padStart(5,"0")} ${k(n.parent.name)} (${k(((Et=n.parent.entityType)==null?void 0:Et.name)||"Capability")})</a>
            </div>
          `:""}
          ${n.children&&n.children.length>0?`
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${n.children.map(w=>`
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${w.entity_id}" class="text-link font-medium">#PR-${String(w.entity_id).padStart(5,"0")} ${k(w.name)}</a>
                    <span class="badge badge-secondary ml-2">${k(w.type_name)}</span>
                  </div>
                  <span class="badge badge-${w.status}">${ne(w.status)}</span>
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
              <span class="badge badge-primary font-semibold">${k(d.title)}</span>
              <span class="badge badge-${t.status}">${ne(t.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${k(t.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${k(((_t=t.owner)==null?void 0:_t.name)||"System")}</strong> • Jurisdiction Area: <strong>${k(t.area||"—")}</strong> • Location: <strong>${k(t.location||"—")}</strong>
            </div>
          </div>
        </div>
        ${v}
      </div>
    </div>

    ${h}
    ${C}
    ${Me}
    ${$t}

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
            ${E}
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
              ${u}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const Le=document.getElementById("tab-info"),Ie=document.getElementById("tab-audit"),We=document.getElementById("tab-content");Le&&Ie&&We&&(Le.addEventListener("click",()=>{Le.classList.add("active"),Ie.classList.remove("active"),We.innerHTML=E}),Ie.addEventListener("click",()=>{Ie.classList.add("active"),Le.classList.remove("active"),We.innerHTML=wt}));const Ct=document.getElementById("btn-generate-ai");Ct&&Ct.addEventListener("click",()=>Xi(t,i)),document.querySelectorAll(".execute-rep-btn").forEach(w=>{w.addEventListener("click",()=>{const U=w.getAttribute("data-repid");Ji(U)})}),Ki(t.entity_id),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}function Ui(e,t,i){const a=[],n=String(e.status||"draft").trim().toLowerCase(),s=new Set;if(Array.isArray(t)&&t.length>0&&t.forEach(o=>{const r=o.action||o.to||o.to_status;if(!r||s.has(r))return;s.add(r);const d=r==="rejected",l=Gi(n,r),c=d?"btn-danger":"btn-primary";a.push(`
        <button class="btn ${c} btn-full wf-action-btn mt-2" 
          data-to="${k(r)}" 
          data-label="${k(l)}"
          data-reason="${d?"true":"false"}">
          ${k(l)}
        </button>
      `)}),i&&i.role==="admin"&&a.push(`
      <button class="btn btn-secondary btn-full mt-3" id="btn-fire-rules" data-rule="true" style="display:inline-flex; align-items:center; gap:8px; justify-content:center;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Execute Automation Rules
      </button>
    `),a.length===0){if(i&&i.role==="coordinator_area"){const o=i.assignedArea||i.assigned_area,r=e.area;if(o&&r&&o.toLowerCase()!==r.toLowerCase())return`
          <div style="padding:14px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:13px; color:#9a3412; line-height:1.4;">
            <div style="font-weight:700; color:#c2410c; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Jurisdiction Boundary Constraint
            </div>
            Your coordinator account is assigned to <strong>"${k(o)}"</strong>, but this case belongs to <strong>"${k(r)}"</strong>.
            <div style="margin-top:8px; font-size:12px; color:#7c2d12;">
              Area Coordinators are strictly authorized to verify cases within their own jurisdiction. Only a Coordinator assigned to <strong>${k(r)}</strong> (or a General Coordinator) can verify this case.
            </div>
          </div>
        `}return`<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${k((i==null?void 0:i.role)||"user")}) at status "${k(ne(n))}".</div>`}return a.join("")}function Gi(e,t){const i=String(t||"").toLowerCase(),a=String(e||"").toLowerCase();return a==="draft"&&i==="submitted"?"Submit Request":a==="submitted"&&(i==="coordinator_approved"||i==="verified")?"Verify & Recommend Approval":a==="coordinator_approved"&&i==="approved"||a==="verified"&&i==="approved"?"Executive Approval (Director)":i==="rejected"?"Reject Request":`Transition to ${t}`}function Wi(e){return e==="draft"?"Draft":e==="submitted"?"Submitted":e==="coordinator_approved"?"Coord Approved":e==="verified"?"Verified":e==="approved"?"Approved":e==="rejected"?"Rejected":e}function Ki(e){const t=a=>{const n=a.getAttribute("data-to"),s=a.getAttribute("data-label")||`Transition to ${n}`,o=a.getAttribute("data-reason")==="true";if(a.getAttribute("data-rule")==="true"){Yi(e);return}o?(ot({title:"Provide Reason for Rejection",content:`
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",ue),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{const d=document.getElementById("action-reason").value.trim();if(!d){$("Reason is required for rejection");return}ue(),Mt(e,n,d)})):(ot({title:`Confirm Action: ${s}`,content:`
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${k(s)}</strong> for case #${e}?
          </p>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",ue),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{ue(),Mt(e,n,null)}))};document.querySelectorAll(".wf-action-btn, #btn-fire-rules").forEach(a=>{a.addEventListener("click",()=>t(a))})}async function Mt(e,t,i){try{const a=await L.transition(e,t,i);q(a.message||`Status updated to ${t}`),xt({id:e})}catch(a){$(a.message||"Transition failed")}}async function Yi(e){var t,i;try{const a=await L.fireRules(e,"approved");q(`Rule Engine executed! ${((i=(t=a.data)==null?void 0:t.createdEntities)==null?void 0:i.length)||0} entity created.`),xt({id:e})}catch(a){$(a.message||"Rule trigger failed")}}async function Ji(e){const t=document.getElementById("report-result-output");if(t){t.style.display="block",t.innerHTML='<div class="spinner spinner-sm"></div> Running report...';try{const a=(await Ue.execute(e)).data;let n=(a.rows||[]).map(s=>{var o;return`
      <tr>
        <td>${k(s[a.groupBy]||s.area||"Total")}</td>
        <td style="font-weight:bold;">${s[(o=a.metric)==null?void 0:o.toLowerCase()]||s.count||s.total_count||0}</td>
      </tr>
    `}).join("");t.innerHTML=`
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${k(a.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${k(a.groupBy||"Group")}</th><th>${k(a.metric)}</th></tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    `}catch(i){t.innerHTML=`<div class="alert alert-error">Report execution failed: ${k(i.message)}</div>`}}}async function Xi(e,t=[]){const i=e.entity_id,a=document.getElementById("ai-report-body");if(a){a.innerHTML=`
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:var(--primary); margin:0 auto 12px auto;"></div>
      <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Running Civic Intelligence Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Evaluating observations, patterns, recommendations, and evidence.</div>
    </div>
  `;try{const n=await L.aiAnalysis(i);q("Civic Intelligence Analysis generated successfully!"),a.innerHTML=Lt(n.data)}catch(n){if(String(n.message||"").includes("GEMINI_API_KEY")||String(n.message||"").includes("Gemini API key")){q("Generated Civic Decision Intelligence Preview from Case Parameters");const o=Qi(e,t);a.innerHTML=Lt(o)}else $(n.message||"Could not generate AI report"),a.innerHTML=`<div class="alert alert-error">AI Analysis failed: ${k(n.message)}</div>`}}}function Qi(e,t=[]){var r;const i={};if(Array.isArray(t))for(const d of t){const l=((r=d.parameterMaster)==null?void 0:r.field_key)||`param_${d.parameter_id}`;i[l]=d.value}const a=i.problem_need||i.description||e.name||"Civic improvement proposal",n=i.proposed_solution||"Community coordination and departmental municipal intervention",s=i.urgency||"Normal",o=e.area||"Ward / Area Jurisdiction";return{problem_summary:`The initiative "${e.name}" in ${o} highlights a local priority: "${a}". The citizen proposes "${n}".`,root_cause_analysis:[`Localized civic and infrastructure upkeep requirement in ${o}.`,"Gap between standard municipal routine maintenance and citizen-level expectations.","Absence of structured community-departmental participatory coordination."],stakeholder_analysis:[{group:`Residents & Citizens of ${o}`,interest:"Timely resolution, cleaner living environment, and reliable public amenities."},{group:"Area Coordinator & Field Inspectors",interest:"On-site verification of scope, resource estimation, and jurisdiction validation."},{group:"Competent Department (Works / Sanitation)",interest:"Feasibility check, alignment with ward budget, and task execution."}],risk_register:[{risk:`Delays in site inspection may exacerbate citizen grievances in ${o}`,severity:s==="Urgent"||s==="Critical"?"High":"Medium"},{risk:"Potential overlap with scheduled municipal ward maintenance works",severity:"Low"},{risk:"Incomplete initial citizen documentation requiring field verification",severity:"Low"}],recommendation:[`Area Coordinator should verify the physical site in ${o} and confirm exact requirements.`,"Coordinate with the relevant zonal engineering / sanitation unit to assess resource requirements.","If verified, transition case status to 'coordinator_approved' to forward for Executive Director sanction."],notice:"Live GEMINI_API_KEY is not configured in backend/.env. This structured decision analysis was synthesized by the CIVIC-KALKI Governance Intelligence Engine using case parameters."}}function Lt(e){const t=Array.isArray(e.recommendation)?e.recommendation:Array.isArray(e.actionable_recommendations)?e.actionable_recommendations:[e.recommendation||e.actionable_recommendations||"Proceed with field verification."],i=Array.isArray(e.root_cause_analysis)?e.root_cause_analysis:[e.root_cause_analysis||"No root cause factors recorded."],a=Array.isArray(e.stakeholder_analysis)?e.stakeholder_analysis:[],n=Array.isArray(e.risk_register)?e.risk_register:[];return`
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      ${e.notice?`
        <div style="margin-bottom:12px; padding:10px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:12px; color:#1e40af; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Notice:</strong> ${k(e.notice)}</div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">1. Observations & Problem Scope</strong>
        <p style="margin:0; color:var(--text-secondary);">${k(e.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">2. Patterns & Root Cause Analysis</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${i.map(s=>`<li style="margin-bottom:4px;">${k(s)}</li>`).join("")}
        </ul>
      </div>

      ${a.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">3. Stakeholder Impact Analysis</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${a.map(s=>`
              <div style="font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                <strong style="color:var(--text-primary);">${k(s.group||"Stakeholder")}:</strong>
                <span style="color:var(--text-secondary); margin-left:4px;">${k(s.interest||"")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      ${n.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">4. Risk Register & Feasibility</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${n.map(s=>{const o=String(s.severity||"Medium").toLowerCase(),r=o==="high"?"background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;":o==="low"?"background:#dcfce7; color:#15803d; border:1px solid #86efac;":"background:#fef3c7; color:#b45309; border:1px solid #fcd34d;";return`
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                  <span style="color:var(--text-primary);">${k(s.risk||"")}</span>
                  <span style="padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px; ${r}">${k(s.severity||"Medium")}</span>
                </div>
              `}).join("")}
          </div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">5. Recommendations for Coordinator / Executive Action</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${t.map(s=>`<li style="margin-bottom:4px;">${k(s)}</li>`).join("")}
        </ul>
      </div>

      <div style="padding:10px 12px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700); display:flex; align-items:center; gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Civic Intelligence Protocol:</strong> This automated advisory report is generated to assist municipal coordinators and directors. Ground evidence and field verification must precede final sanction.</span>
      </div>
    </div>
  `}const de=[{type:"country",label:"Country"},{type:"state",label:"State / Province"},{type:"city",label:"City / District"},{type:"ward",label:"Ward / Local Area"}];function $e(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Zi(e,t){if(!t)return $e(e);const i=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return $e(e).replace(i,'<strong style="color:var(--primary,#ff5a36);">$1</strong>')}class ea{constructor(t,i={}){this._container=t,this._required=i.required||!1,this._onChange=i.onChange||null,this._prefix=i.labelPrefix||"jsel",this._levelStates=[],this._hiddenInput=null,this._destroyed=!1,this._onDocumentClick=this._handleDocumentClick.bind(this),document.addEventListener("click",this._onDocumentClick)}async init(){this._render(),await this._loadLevel(0,null)}getValue(){const t=this._levelStates.map(a=>a.selectedItem).filter(Boolean);return t.length===0?null:{jurisdiction_id:t[t.length-1].jurisdiction_id,display_path:t.map(a=>a.name).join(" › ")}}async setValue(t){if(t)try{const i=await Re.get(t),{path:a}=i.data;if(!Array.isArray(a)||a.length===0)return;for(let s=0;s<a.length;s++){const o=s===0?null:a[s-1].jurisdiction_id;await this._loadLevel(s,o);const r=a[s],d=this._levelStates[s].items.find(l=>l.jurisdiction_id===r.jurisdiction_id)||r;this._setSelection(s,d,!1)}this._syncHidden(),this._notifyChange();const n=a.length;if(n<de.length){const s=a[a.length-1].jurisdiction_id;await this._loadLevel(n,s)}}catch(i){console.warn("[JurisdictionSelector] setValue failed:",i)}}destroy(){this._destroyed=!0,document.removeEventListener("click",this._onDocumentClick),this._container.innerHTML="",this._levelStates=[],this._hiddenInput=null}_render(){this._container.innerHTML="",this._container.classList.add("jurisdiction-selector");const t=document.createElement("div");t.className="jurisdiction-selector-grid",de.forEach((a,n)=>{const s=document.createElement("div");s.className="form-group jsel-group",s.id=`${this._prefix}-group-${n}`;const o=this._required&&n===0?'<span class="required">*</span>':"",r=document.createElement("label");r.className="form-label",r.innerHTML=`${$e(a.label)} ${o}`;const d=document.createElement("div");d.className="jsel-combobox",d.id=`${this._prefix}-combobox-${n}`;const l=document.createElement("div");l.className="jsel-trigger is-disabled",l.setAttribute("tabindex",n===0?"0":"-1"),l.setAttribute("role","combobox"),l.setAttribute("aria-expanded","false"),l.setAttribute("aria-label",a.label);const c=document.createElement("span");c.className="jsel-trigger-text is-placeholder",c.textContent=n===0?`-- Search or Select ${a.label} --`:`-- Select ${de[n-1].label} first --`;const p=document.createElement("div");p.className="jsel-trigger-actions";const v=document.createElement("button");v.type="button",v.className="jsel-clear-btn",v.title="Clear selection",v.style.display="none",v.innerHTML="&#x2715;";const u=document.createElement("span");u.className="jsel-chevron",u.innerHTML='<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',p.appendChild(v),p.appendChild(u),l.appendChild(c),l.appendChild(p);const g=document.createElement("div");g.className="jsel-dropdown";const C=document.createElement("div");C.className="jsel-search-wrapper",C.innerHTML=`
        <svg class="jsel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;const h=document.createElement("input");h.type="text",h.className="jsel-search-input",h.placeholder=`Search ${a.label}...`,h.setAttribute("autocomplete","off"),C.appendChild(h);const y=document.createElement("ul");y.className="jsel-options-list",y.setAttribute("role","listbox"),g.appendChild(C),g.appendChild(y),d.appendChild(l),d.appendChild(g),s.appendChild(r),s.appendChild(d),t.appendChild(s),this._levelStates[n]={meta:a,groupEl:s,comboboxEl:d,triggerEl:l,triggerTextEl:c,clearBtnEl:v,dropdownEl:g,searchInputEl:h,optionsListEl:y,items:[],filteredItems:[],selectedItem:null,focusedIdx:-1,isOpen:!1,disabled:n!==0},l.addEventListener("click",E=>{E.target.closest(".jsel-clear-btn")||this._toggleDropdown(n)}),l.addEventListener("keydown",E=>{this._levelStates[n].disabled||(E.key==="Enter"||E.key===" "||E.key==="ArrowDown")&&(E.preventDefault(),this._openDropdown(n))}),v.addEventListener("click",E=>{E.stopPropagation(),this._clearSelection(n)}),h.addEventListener("input",E=>{this._filterOptions(n,E.target.value)}),h.addEventListener("keydown",E=>{this._handleSearchKeydown(n,E)})}),this._container.appendChild(t);const i=document.createElement("input");i.type="hidden",i.name="_jurisdiction_id",i.id=`${this._prefix}-hidden`,i.value="",this._container.appendChild(i),this._hiddenInput=i}async _loadLevel(t,i){if(this._destroyed)return;const a=this._levelStates[t];if(a){a.disabled=!0,a.triggerEl.classList.add("is-disabled"),a.triggerEl.setAttribute("tabindex","-1"),a.triggerTextEl.className="jsel-trigger-text is-placeholder",a.triggerTextEl.textContent=`Loading ${a.meta.label}…`,a.optionsListEl.innerHTML=`<li class="jsel-loading"><div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Loading ${a.meta.label}...</li>`;try{const n=i==null?{}:{parent_id:String(i)},o=(await Re.list(n)).data||[];if(this._destroyed)return;if(a.items=o,a.filteredItems=o,o.length===0){a.disabled=!0,a.triggerEl.classList.add("is-disabled"),a.triggerEl.setAttribute("tabindex","-1"),a.triggerTextEl.textContent=`-- No ${a.meta.label} available --`,this._clearLevelsFrom(t+1);return}a.disabled=!1,a.triggerEl.classList.remove("is-disabled"),a.triggerEl.setAttribute("tabindex","0"),a.triggerTextEl.textContent=`-- Search or Select ${a.meta.label} --`,this._renderOptionsList(t,"")}catch(n){console.warn("[JurisdictionSelector] Failed to load level",t,n),a.disabled=!0,a.triggerEl.classList.add("is-disabled"),a.triggerTextEl.textContent=`-- Error loading ${a.meta.label} --`}}}_renderOptionsList(t,i){const a=this._levelStates[t],n=a.optionsListEl;n.innerHTML="",a.focusedIdx=-1;const s=(i||"").trim().toLowerCase();let o=a.items;if(s&&(o=a.items.filter(d=>d.name&&d.name.toLowerCase().includes(s)||d.code&&d.code.toLowerCase().includes(s))),a.filteredItems=o,o.length===0){n.innerHTML=`<li class="jsel-empty">No ${$e(a.meta.label)} found matching "${$e(i)}"</li>`;return}if(t===0&&!s){const d=a.items.find(l=>l.name==="India");if(d){const l=document.createElement("li");l.className="jsel-divider",l.textContent="★ Pinned / Quick Select",n.appendChild(l);const c=this._createOptionElement(t,d,s,0);n.appendChild(c);const p=document.createElement("li");p.className="jsel-divider",p.textContent=`All Countries (${a.items.length})`,n.appendChild(p)}}if(o.slice(0,150).forEach((d,l)=>{const c=this._createOptionElement(t,d,s,l);n.appendChild(c)}),o.length>150){const d=document.createElement("li");d.className="jsel-empty",d.style.fontSize="0.78rem",d.style.padding="8px",d.textContent=`Showing top 150 of ${o.length} matches — type to narrow down`,n.appendChild(d)}}_createOptionElement(t,i,a,n){const s=this._levelStates[t],o=s.selectedItem&&s.selectedItem.jurisdiction_id===i.jurisdiction_id,r=document.createElement("li");r.className=`jsel-option ${o?"is-selected":""}`,r.setAttribute("role","option"),r.setAttribute("aria-selected",o?"true":"false"),r.dataset.index=String(n);const d=document.createElement("span");if(d.innerHTML=Zi(i.name,a),r.appendChild(d),i.code){const l=document.createElement("span");l.className="jsel-option-badge",l.textContent=i.code,r.appendChild(l)}return r.addEventListener("click",l=>{l.stopPropagation(),this._selectItem(t,i)}),r}_toggleDropdown(t){const i=this._levelStates[t];i.disabled||(i.isOpen?this._closeDropdown(t):this._openDropdown(t))}_openDropdown(t){this._levelStates.forEach((a,n)=>{n!==t&&a.isOpen&&this._closeDropdown(n)});const i=this._levelStates[t];i.disabled||(i.isOpen=!0,i.comboboxEl.classList.add("is-open"),i.triggerEl.classList.add("is-active"),i.triggerEl.setAttribute("aria-expanded","true"),i.searchInputEl.value="",this._renderOptionsList(t,""),setTimeout(()=>{i.searchInputEl.focus()},50))}_closeDropdown(t){const i=this._levelStates[t];i.isOpen&&(i.isOpen=!1,i.comboboxEl.classList.remove("is-open"),i.triggerEl.classList.remove("is-active"),i.triggerEl.setAttribute("aria-expanded","false"))}_filterOptions(t,i){this._renderOptionsList(t,i)}_handleSearchKeydown(t,i){const a=this._levelStates[t],n=a.optionsListEl.querySelectorAll(".jsel-option");n.length!==0&&(i.key==="ArrowDown"?(i.preventDefault(),a.focusedIdx=Math.min(a.focusedIdx+1,n.length-1),this._updateFocus(n,a.focusedIdx)):i.key==="ArrowUp"?(i.preventDefault(),a.focusedIdx=Math.max(a.focusedIdx-1,0),this._updateFocus(n,a.focusedIdx)):i.key==="Enter"?(i.preventDefault(),a.focusedIdx>=0&&a.focusedIdx<n.length?n[a.focusedIdx].click():n.length>0&&n[0].click()):i.key==="Escape"&&(this._closeDropdown(t),a.triggerEl.focus()))}_updateFocus(t,i){t.forEach((a,n)=>{n===i?(a.classList.add("is-focused"),a.scrollIntoView({block:"nearest"})):a.classList.remove("is-focused")})}_selectItem(t,i){this._setSelection(t,i,!0),this._closeDropdown(t);const a=t+1;a<de.length&&this._loadLevel(a,i.jurisdiction_id)}_setSelection(t,i,a=!0){const n=this._levelStates[t];n.selectedItem=i,n.triggerTextEl.className="jsel-trigger-text",n.triggerTextEl.textContent=i.name,n.clearBtnEl.style.display="flex",a&&(this._clearLevelsFrom(t+1),this._syncHidden(),this._notifyChange())}_clearSelection(t){const i=this._levelStates[t];i.selectedItem=null,i.triggerTextEl.className="jsel-trigger-text is-placeholder",i.triggerTextEl.textContent=`-- Search or Select ${i.meta.label} --`,i.clearBtnEl.style.display="none",this._clearLevelsFrom(t+1),this._syncHidden(),this._notifyChange()}_clearLevelsFrom(t){for(let i=t;i<de.length;i++){const a=this._levelStates[i];a&&(a.selectedItem=null,a.disabled=!0,a.items=[],a.filteredItems=[],a.triggerEl.classList.add("is-disabled"),a.triggerEl.setAttribute("tabindex","-1"),a.triggerTextEl.className="jsel-trigger-text is-placeholder",a.triggerTextEl.textContent=`-- Select ${de[i-1].label} first --`,a.clearBtnEl.style.display="none",a.optionsListEl.innerHTML="",this._closeDropdown(i))}}_handleDocumentClick(t){this._destroyed||this._levelStates.forEach((i,a)=>{i.isOpen&&!i.comboboxEl.contains(t.target)&&this._closeDropdown(a)})}_syncHidden(){if(!this._hiddenInput)return;const t=this.getValue();this._hiddenInput.value=t?String(t.jurisdiction_id):""}_notifyChange(){const t=this.getValue();this._onChange&&this._onChange(t),this._container.dispatchEvent(new CustomEvent("jurisdiction:change",{bubbles:!0,detail:t}))}}const ta="/api";function H(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let ge=null,G=null,Z=[],pe=null,se=null;const ia=new Set(["title","name","movement_title","area","jurisdiction","jurisdiction_id","location","landmark","reported_date","reported_on","contact_person","contact_phone","contact_email","priority_level","volunteer_coordinator"]);function Zt(e){const t=String(e.field_key||"").trim().toLowerCase();return ia.has(t)}async function aa(e={},t=null){if(!J(z))return;try{Z=(await L.listTypes().catch(()=>({data:[]}))).data||[]}catch{Z=[]}const i=t||new URLSearchParams(window.location.search);i.has("entity_type_id")?G=Number(i.get("entity_type_id")):Z.length>0&&(G=Z[0].entity_type_id);const a=Z.find(o=>Number(o.entity_type_id)===Number(G));pe=Y(a);const n=document.getElementById("app");n.innerHTML=T(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${H(pe.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${Z.map(o=>{const r=Y(o);return`<option value="${o.entity_type_id}" ${Number(G)===Number(o.entity_type_id)?"selected":""}>${H(r.title)}</option>`}).join("")}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `,pe.title,Z),B(),document.getElementById("entity-type-select").addEventListener("change",async o=>{const r=o.target.value;if(!r){document.getElementById("dynamic-form-container").innerHTML="",ge=null;return}G=Number(r);const d=Z.find(l=>Number(l.entity_type_id)===Number(G));pe=Y(d),document.getElementById("page-capability-title").textContent=pe.title,window.history.replaceState({},"",`/entities/new?entity_type_id=${G}`),await It(G)}),G&&await It(G)}async function It(e){se&&(se.destroy(),se=null);const t=document.getElementById("dynamic-form-container");t.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{ge=(await bt.schema(e)).data,oa(t,ge),await na()}catch(i){console.error("Form schema load error:",i),$("Failed to load form schema"),t.innerHTML='<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>'}}async function na(){const e=document.getElementById("jurisdiction-selector-mount");e&&(se=new ea(e,{required:!0,labelPrefix:"ent-jsel"}),await se.init())}function sa(e){var g;const t=e.mandatory||e.is_mandatory,i=t?"required":"",a=t?'<span class="required">*</span>':"",n=`param_${e.parameter_id}`,s=(e.field_type||e.data_type||"text").toLowerCase(),o=H(e.label||e.field_key),r=(g=e.options)==null?void 0:g.depends_on;let d="",l="",c="";r&&r.field_key&&(d=`data-depends-key="${H(r.field_key)}" data-depends-val="${H(r.value)}"`,l="conditional-field",c="display:none;");const v=["textarea","file"].includes(s)?"flex:1 1 100%; min-width:100%;":"flex:1 1 calc(50% - 8px); min-width:200px;";let u="";switch(s){case"textarea":u=`<textarea name="${n}" class="form-control" rows="3" ${i} placeholder="Enter ${o.toLowerCase()}..."></textarea>`;break;case"number":u=`<input type="number" name="${n}" class="form-control" ${i} placeholder="0">`;break;case"date":u=`<input type="date" name="${n}" class="form-control" ${i}>`;break;case"email":u=`<input type="email" name="${n}" class="form-control" ${i} placeholder="email@example.com">`;break;case"phone":u=`<input type="tel" name="${n}" class="form-control" ${i} placeholder="+91 XXXXX XXXXX">`;break;case"checkbox":u=`
        <div class="check-group mt-2">
          <input type="checkbox" name="${n}" id="${n}" value="true">
          <label for="${n}">Yes</label>
        </div>
      `;break;case"select":{const C=e.meta_options||(e.options?Array.isArray(e.options)?e.options:e.options.choices:null)||["Option 1","Option 2"],h=e.options&&e.options.default?e.options.default:"";u=`<select name="${n}" class="form-control" ${i}>
        <option value="">-- Select --</option>
        ${C.map(y=>`<option value="${H(y)}" ${y===h?"selected":""}>${H(y)}</option>`).join("")}
      </select>`;break}case"file":u=`
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
      `;break;default:u=`<input type="text" name="${n}" class="form-control" ${i} placeholder="Enter ${o.toLowerCase()}...">`;break}return`<div class="form-group ${l}" ${d} style="${c} ${v}">
    <label class="form-label">${o} ${a}</label>
    ${u}
  </div>`}function oa(e,t){if(!t||!t.sections||t.sections.length===0){e.innerHTML='<div class="alert alert-warning">This capability has no form fields configured yet.</div>';return}let i=`
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${H(pe.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(t.configuration_errors)&&t.configuration_errors.length>0?`<div class="alert alert-warning m-4">${H(t.configuration_errors.join(" "))}</div>`:""}

      <form id="dynamic-form" style="padding:24px;">
  `,a=!1,n=!1;t.sections.forEach((o,r)=>{const d=(o.section_name||o.title||"").trim(),l=r===0,c=d.toLowerCase().includes("where")||d.toLowerCase().includes("location");i+=`
      <div class="form-section mb-6" data-section-name="${H(d)}">
        <div class="form-section-title">${H(d)}</div>
        ${o.description?`<div class="form-section-subtitle">${H(o.description)}</div>`:""}
    `,l&&!a&&(i+=`
        <div class="form-row mt-4" style="display:flex; flex-wrap:wrap; gap:16px;">
          <div class="form-group" style="flex:1 1 100%; min-width:100%;">
            <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
            <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the initiative">
          </div>
        </div>
      `,a=!0),c&&!n&&(i+=`
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
      `,n=!0),(o.subsections||[]).forEach(p=>{p.subsection_name&&p.subsection_name!=="Main"&&(i+=`<div class="form-subsection mt-3"><div class="form-subsection-title">${H(p.subsection_name)}</div>`);const u=[...p.parameters||[]].sort((g,C)=>(g.display_order||0)-(C.display_order||0)).filter(g=>!Zt(g)&&String(g.field_key||"").trim()&&String(g.label||"").trim());u.length>0&&(i+='<div class="form-row mt-3" style="display:flex; flex-wrap:wrap; gap:16px;">',u.forEach(g=>{i+=sa(g)}),i+="</div>"),p.subsection_name&&p.subsection_name!=="Main"&&(i+="</div>")}),i+="</div>"}),n||(i+=`
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
  `,e.innerHTML=i;const s=document.getElementById("dynamic-form");s.addEventListener("submit",la),ra(s,t)}function ra(e,t){const i=[];(t.sections||[]).forEach(s=>{(s.subsections||[]).forEach(o=>{(o.parameters||[]).forEach(r=>i.push(r))})});const a=e.querySelectorAll(".conditional-field");if(a.length===0)return;function n(){a.forEach(s=>{const o=s.getAttribute("data-depends-key"),r=s.getAttribute("data-depends-val");if(!o)return;const d=i.find(v=>v.field_key===o);if(!d)return;const l=e.querySelector(`[name="param_${d.parameter_id}"]`);if(!l)return;String(l.value||"").trim().toLowerCase()===String(r).toLowerCase()?(s.style.display="",s.querySelectorAll("input, select, textarea").forEach(v=>{v.disabled=!1})):(s.style.display="none",s.querySelectorAll("input, select, textarea").forEach(v=>{v.disabled=!0,v.value=""}))})}e.addEventListener("change",n),e.addEventListener("input",n),n()}async function la(e){e.preventDefault();const t=document.getElementById("form-validation-alert");t&&(t.classList.add("hidden"),t.textContent="");const i=document.getElementById("submit-form-btn");i.disabled=!0,i.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';try{const a=new FormData(e.target),n=Object.fromEntries(a.entries());if(!n._base_name||!n._base_name.trim()){const p=document.getElementById("base_name");throw p&&p.focus(),new Error("Title / Summary is a required field.")}const s=se?se.getValue():null;if(!s)throw new Error("Please select a jurisdiction (at minimum a Country) before submitting.");if(ge&&ge.sections){for(const p of ge.sections)for(const v of p.subsections||[])for(const u of v.parameters||[])if(!Zt(u)&&(u.mandatory||u.is_mandatory)){const g=e.target.querySelector(`[name="param_${u.parameter_id}"]`);if(g&&!g.disabled&&!(g.type==="file"?g.files&&g.files.length>0:String(g.value||"").trim()))throw g.focus(),new Error(`"${u.label||u.field_key}" is a required field.`)}}const o={entity_type_id:G,name:n._base_name.trim(),jurisdiction_id:s.jurisdiction_id,area:s.display_path,location:n._base_location?n._base_location.trim():null,status:"submitted"},d=(await L.create(o)).data.entity_id,l=[];for(const[p,v]of a.entries())if(p.startsWith("param_")){const u=Number(p.replace("param_","")),g=e.target.querySelector(`[name="${p}"]`);if(g&&(g.type==="file"||g.disabled))continue;v!=null&&String(v).trim()!==""&&l.push({parameter_id:u,value:String(v).trim()})}l.length>0&&await Jt.create(d,l);const c=e.target.querySelectorAll('input[type="file"]');for(const p of c)if(p.files&&p.files.length>0){const v=p.getAttribute("data-parameter-id");if(!v)continue;const u=new FormData;u.append("entity_id",d),u.append("parameter_id",v);for(const g of p.files)u.append("files",g);try{const g=localStorage.getItem("auth_token");await fetch(`${ta}/files/upload`,{method:"POST",headers:g?{Authorization:`Bearer ${g}`}:{},body:u})}catch(g){console.warn("File upload warning:",g)}}q("Request submitted successfully!"),da(d,n._base_name)}catch(a){const n=a.message||"Failed to submit request";t&&(t.textContent=n,t.classList.remove("hidden")),$(n),i.disabled=!1,i.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request'}}function da(e,t){const i=document.getElementById("dynamic-form-container"),a=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});i.innerHTML=`
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
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${H(t)}</div>
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
  `}let Ne=[],ae=null,oe="";async function ca(){if(!ft(["admin"],z))return;const e=document.getElementById("app");e.innerHTML=T(`
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
        <input type="text" id="user-search-input" class="form-control" style="padding-left: 42px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search users by email (e.g. demo.coord.area@example.com), name, or assigned area..." value="${O(oe)}">
        ${oe?'<button id="clear-search-btn" class="btn btn-ghost btn-sm" style="position:absolute; right:10px; padding:4px 8px; font-size:12px;">Clear</button>':""}
      </div>
    </div>

    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Admin"),B(),pa(),await Oe()}let At=null;function pa(){const e=document.getElementById("user-search-input");if(!e)return;e.addEventListener("input",i=>{oe=i.target.value.trim(),clearTimeout(At),At=setTimeout(()=>{Oe(oe)},200)});const t=document.getElementById("clear-search-btn");t&&t.addEventListener("click",()=>{oe="",e.value="",t.remove(),Oe("")})}async function Oe(e=oe){const t=document.getElementById("admin-content");if(t)try{const i={limit:100};e&&(i.search=e),Ne=(await Yt.listUsers(i)).data,ua(t,Ne)}catch{$("Failed to load users"),t.innerHTML='<div class="alert alert-error">Failed to load users data.</div>'}}function ua(e,t=Ne){if(t.length===0){e.innerHTML=`
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Users & Regional Allocations (${t.length})</div>
        </div>
        <div class="table-empty py-6 text-center text-muted">
          No users found matching "${O(oe)}".
        </div>
      </div>
    `;return}const i=t.map(a=>`
    <tr>
      <td>${a.user_id}</td>
      <td class="font-medium">${O(a.name)}</td>
      <td class="text-muted">${O(a.email)}</td>
      <td><span class="badge badge-role-${a.role}">${va(a.role)}</span></td>
      <td>${a.assignedArea?`<span class="badge badge-primary font-semibold" style="font-size:12px;">${O(a.assignedArea)}</span>`:'<span class="text-muted">—</span>'}</td>
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
  `}async function ma(){if(ae&&ae.length>0)return ae;try{const e=await Re.tree();e.data&&Array.isArray(e.data)&&(ae=ei(e.data))}catch(e){console.warn("Failed to load jurisdiction tree for admin, falling back to flat list",e);try{ae=((await Re.list({parent_id:"all"})).data||[]).map(i=>({jurisdiction_id:i.jurisdiction_id,name:i.name,type:i.type,fullPath:i.name}))}catch{ae=[]}}return ae||[]}function ei(e,t=""){let i=[];for(const a of e){const n=t?`${t} › ${a.name}`:a.name;i.push({jurisdiction_id:a.jurisdiction_id,name:a.name,type:a.type,fullPath:n}),a.children&&a.children.length>0&&(i=i.concat(ei(a.children,n)))}return i}window.editUserRole=async e=>{const t=Ne.find(u=>u.user_id===e);if(!t)return;const i=await ma(),a=i.filter(u=>u.type==="ward"),n=i.filter(u=>u.type==="city"),s=i.filter(u=>u.type!=="ward"&&u.type!=="city");let o=!1,r="";a.length>0&&(r+='<optgroup label="Wards / Local Areas (Recommended)">',a.forEach(u=>{const g=t.assignedArea===u.name;g&&(o=!0),r+=`<option value="${O(u.name)}" ${g?"selected":""}>${O(u.fullPath)}</option>`}),r+="</optgroup>"),n.length>0&&(r+='<optgroup label="Cities / Districts">',n.forEach(u=>{const g=t.assignedArea===u.name;g&&(o=!0),r+=`<option value="${O(u.name)}" ${g?"selected":""}>${O(u.fullPath)}</option>`}),r+="</optgroup>"),s.length>0&&(r+='<optgroup label="States / Regions">',s.forEach(u=>{const g=t.assignedArea===u.name;g&&(o=!0),r+=`<option value="${O(u.name)}" ${g?"selected":""}>${O(u.fullPath)}</option>`}),r+="</optgroup>"),t.assignedArea&&!o&&t.assignedArea!=="Unassigned"&&(r=`<option value="${O(t.assignedArea)}" selected>${O(t.assignedArea)} (Currently Assigned)</option>`+r),ot({title:`User Role & Area Allocation: ${t.name}`,content:`
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
            ${r}
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
    `,onClose:()=>{}});const d=document.getElementById("new-role"),l=document.getElementById("area-group"),c=document.getElementById("new-area"),p=document.getElementById("custom-area-wrapper"),v=document.getElementById("custom-area-input");d.addEventListener("change",u=>{const g=u.target.value==="coordinator_area";l.style.display=g?"block":"none"}),c.addEventListener("change",u=>{u.target.value==="__custom__"?(p.style.display="block",v.focus()):p.style.display="none"}),document.getElementById("save-role-btn").addEventListener("click",async()=>{const u=d.value;let g=c.value;if(u==="coordinator_area"&&(g==="__custom__"&&(g=v.value.trim()),!g)){$("Please select or enter an allocated area for the coordinator");return}const C=document.getElementById("save-role-btn");C.disabled=!0,C.textContent="Saving...";try{await Yt.setRole(e,u,u==="coordinator_area"?g:null),q(`Updated role & area allocation for ${t.name}`),ue(),Oe()}catch(h){$(h.message||"Failed to update role"),C.disabled=!1,C.textContent="Save Allocation"}})};function va(e){return e?e.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"Unknown"}function O(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ga(){if(!J(z))return;const e=re(),t=document.getElementById("app");t.innerHTML=T(`
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
              <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-primary);">${Qe(e.name)}</h2>
              <p style="font-size:0.875rem; color:var(--text-muted);">${Qe(e.email)}</p>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">User ID</label>
            <div class="font-mono text-muted" style="font-size:0.9rem;">#${e.user_id}</div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Assigned Role</label>
            <div><span class="badge badge-primary">${ke(e.role)}</span></div>
          </div>
          
          ${e.assignedArea?`
            <div class="form-group">
              <label class="form-label">Jurisdiction Area</label>
              <div style="font-weight:600; color:var(--text-primary);">${Qe(e.assignedArea)}</div>
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
  `,"Profile"),B();const i=document.getElementById("change-password-form");i&&i.addEventListener("submit",async a=>{a.preventDefault();const n=document.getElementById("password-alert");n.classList.add("hidden"),n.textContent="";const s=document.getElementById("current_password").value,o=document.getElementById("new_password").value,r=document.getElementById("confirm_password").value;if(o!==r){n.textContent="New password and confirmation do not match.",n.classList.remove("hidden");return}const d=document.getElementById("btn-change-pwd");d.disabled=!0,d.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Updating...';try{await ht.changePassword(s,o),q("Password updated successfully!"),i.reset(),d.disabled=!1,d.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}catch(l){const c=l.message||"Failed to update password";n.textContent=c,n.classList.remove("hidden"),$(c),d.disabled=!1,d.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}})}function Qe(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function _(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}let m={step:1,basics:{name:"",description:"",icon:"📋",domain_id:1},form:{name:"",sections:[{id:"sec_1",name:"General Information",parameters:[{id:"param_1",label:"Title",field_key:"title",field_type:"text",mandatory:!0,options:[]},{id:"param_2",label:"Area",field_key:"area",field_type:"select",mandatory:!0,options:["Sector 5","Sector 12","Pune North","Pune South","Pune Central"]}]}]},workflow:{transitions:[{from:"draft",to:"submitted",role:"citizen"},{from:"submitted",to:"coordinator_approved",role:"coordinator_area"},{from:"submitted",to:"rejected",role:"coordinator_area"},{from:"coordinator_approved",to:"approved",role:"director"},{from:"coordinator_approved",to:"rejected",role:"director"}]},rule:{enabled:!1,target_entity_type_id:"",event:"approved"},report:{enabled:!0,name:"",groupBy:"area",metric:"COUNT",metricField:"",publicStats:!0},existingTypes:[],domains:[],isSubmitting:!1};async function fa(){var e;if(ft(["admin","director"],z)){try{const[t,i]=await Promise.all([L.listTypes().catch(()=>({data:[]})),bt.getMetadata().catch(()=>({data:{domains:[]}}))]);m.existingTypes=t.data||[],m.domains=((e=i.data)==null?void 0:e.domains)||[]}catch(t){console.warn("Could not load metadata for module builder:",t)}R()}}function R(){const e=document.getElementById("app");let t="";m.step===1?t=ha():m.step===2?t=ba():m.step===3?t=xa():m.step===4?t=ka():m.step===5?t=wa():m.step===6?t=$a():m.step===7&&(t=Ca());const i=[{num:1,label:"Basics"},{num:2,label:"Form & Fields"},{num:3,label:"Workflow"},{num:4,label:"Rules"},{num:5,label:"Reports"},{num:6,label:"Review"}],a=i.map((n,s)=>`
    <div style="display:flex; align-items:center; gap:0.4rem; color:${m.step>=n.num?"var(--primary)":"var(--gray-400)"}; font-weight:${m.step===n.num?"bold":"normal"}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${m.step>=n.num?"var(--primary)":"#e5e7eb"}; color:${m.step>=n.num?"#fff":"#4b5563"}; display:flex; align-items:center; justify-content:center; font-size:12px;">${n.num}</span>
      ${n.label}
    </div>
    ${s<i.length-1?`<div style="flex:1; height:2px; background:${m.step>n.num?"var(--primary)":"#e5e7eb"}; margin:0 4px;"></div>`:""}
  `).join("");e.innerHTML=T(`
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
  `,"Module Builder"),B(),Ea()}function ha(){const e=m.domains&&m.domains.length>0?m.domains.map(t=>`<option value="${t.domain_id}" ${m.basics.domain_id==t.domain_id?"selected":""}>${_(t.domain_name)}</option>`).join(""):'<option value="1">Civic Operations</option>';return`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${_(m.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${_(m.basics.description)}</textarea>
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
                <option value="📋" ${m.basics.icon==="📋"?"selected":""}>📋 Form / Registration</option>
                <option value="📢" ${m.basics.icon==="📢"?"selected":""}>📢 Notice / Alert</option>
                <option value="🛡️" ${m.basics.icon==="🛡️"?"selected":""}>🛡️ Governance / Policy</option>
                <option value="💼" ${m.basics.icon==="💼"?"selected":""}>💼 Employment / Exchange</option>
                <option value="🤝" ${m.basics.icon==="🤝"?"selected":""}>🤝 Volunteer / Community</option>
                <option value="🌳" ${m.basics.icon==="🌳"?"selected":""}>🌳 Parks / Environment</option>
                <option value="🏗️" ${m.basics.icon==="🏗️"?"selected":""}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `}function ba(){const e=m.basics.name?`${m.basics.name} Form`:"Module Registration Form",t=m.form.sections.map((i,a)=>{const n=i.parameters.map((s,o)=>{const r=s.field_type==="select";return`
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${o+1} (${_(s.field_key||"field")})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${a}, ${o})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${_(s.label)}" onchange="window.updateParam(${a}, ${o}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
            </div>
            <div class="form-group" style="flex:1.5;">
              <label class="form-label" style="font-size:12px;">Data Type</label>
              <select class="form-control" onchange="window.updateParam(${a}, ${o}, 'field_type', this.value)">
                <option value="text" ${s.field_type==="text"?"selected":""}>Text Input</option>
                <option value="textarea" ${s.field_type==="textarea"?"selected":""}>Long Text (Textarea)</option>
                <option value="number" ${s.field_type==="number"?"selected":""}>Number (Metric)</option>
                <option value="date" ${s.field_type==="date"?"selected":""}>Date</option>
                <option value="select" ${s.field_type==="select"?"selected":""}>Dropdown Select</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:flex-end; padding-bottom:8px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${s.mandatory?"checked":""} onchange="window.updateParam(${a}, ${o}, 'mandatory', this.checked)">
                Required?
              </label>
            </div>
          </div>

          ${r?`
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--gray-200);">
              <label class="form-label" style="font-size:12px;">Dropdown Choices (comma-separated)</label>
              <input type="text" class="form-control" value="${_((s.options||[]).join(", "))}" onchange="window.updateParamOptions(${a}, ${o}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          `:""}
        </div>
      `}).join("");return`
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${_(i.name)}" onchange="window.updateSectionName(${a}, this.value)">
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
            <div class="card-subtitle">Define parameters and form sections for "${_(m.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${_(e)}" onchange="state.form.name = this.value">
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
            ${ya()}
          </div>
        </div>
      </div>
    </div>
  `}function ya(){const e=m.basics.name?`${m.basics.name} Form`:"Untitled Form";let t=`<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${_(e)}</div>`;return m.form.sections.forEach(i=>{t+=`
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${_(i.name)}</div>
    `,i.parameters.forEach(a=>{const n=a.mandatory?'<span style="color:red">*</span>':"";if(t+=`<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${_(a.label||"Unlabelled")} ${n}</label>`,a.field_type==="textarea")t+='<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>';else if(a.field_type==="number")t+='<input type="number" class="form-control" disabled placeholder="0">';else if(a.field_type==="date")t+='<input type="date" class="form-control" disabled>';else if(a.field_type==="select"){const s=a.options&&a.options.length?a.options:["Option 1","Option 2"];t+=`<select class="form-control" disabled>
          ${s.map(o=>`<option>${_(o)}</option>`).join("")}
        </select>`}else t+='<input type="text" class="form-control" disabled placeholder="Text response...">';t+="</div>"}),t+="</div>"}),t}function xa(){const e=[{value:"citizen",label:"Citizen (Owner)"},{value:"coordinator_area",label:"Area Coordinator"},{value:"coordinator_general",label:"General Coordinator"},{value:"director",label:"Director"},{value:"admin",label:"Administrator"}],t=m.workflow.transitions.map((i,a)=>`
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${a+1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${a})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${_(i.from)}" onchange="window.updateTransition(${a}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${_(i.to)}" onchange="window.updateTransition(${a}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
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
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${_(m.basics.name)}".</div>
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
  `}function ka(){return m.existingTypes.map(e=>`<option value="${e.entity_type_id}" ${m.rule.target_entity_type_id==e.entity_type_id?"selected":""}>${_(e.name)}</option>`).join(""),`
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
  `}function wa(){const e=[];m.form.sections.forEach(n=>n.parameters.forEach(s=>e.push(s)));const t=m.basics.name?`${m.basics.name}s by Area`:"Module Report",i=e.filter(n=>n.field_type==="number"),a=['<option value="area">area (Native Area)</option>','<option value="status">status (Workflow Status)</option>',...e.map(n=>`<option value="${_(n.field_key||n.label)}" ${m.report.groupBy===(n.field_key||n.label)?"selected":""}>${_(n.label)} (${n.field_type})</option>`)].join("");return i.map(n=>`
    <option value="${_(n.field_key||n.label)}" ${m.report.metricField===(n.field_key||n.label)?"selected":""}>${_(n.label)}</option>
  `).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${_(m.basics.name)}" via ReportMaster.</div>
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
              <input type="text" class="form-control" value="${_(t)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
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
  `}function $a(){const e=`${m.basics.name} Form`,t=m.form.sections.reduce((a,n)=>a+n.parameters.length,0),i=`${m.basics.name}s by Area`;return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${m.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${_(m.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${_(m.basics.description||"Civic Operating System Module")}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${_(e)}</strong></div>
              <div>Sections: <strong>${m.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${t}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${m.workflow.transitions.length} transitions)
              </div>
              ${m.workflow.transitions.map(a=>`<div style="font-size:12px;">• <code>${_(a.from)}</code> → <code>${_(a.to)}</code> (${_(a.role)})</div>`).join("")}
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
              <div>${`${_(i)} (${m.report.metric} by ${m.report.groupBy})`}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${m.isSubmitting?"disabled":""}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `}function Ca(){return`
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${_(m.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `}function Ea(){const e=document.getElementById("step1-form");e&&e.addEventListener("submit",t=>{t.preventDefault();const i=document.getElementById("module-name").value.trim(),a=document.getElementById("module-desc").value.trim(),n=document.getElementById("module-icon").value;if(!i){$("Module name is required");return}if(m.existingTypes.some(o=>o.name.toLowerCase()===i.toLowerCase())){$(`Module "${i}" already exists. Please choose a different name.`);return}m.basics.name=i,m.basics.description=a,m.basics.icon=n,m.step=2,R()})}window.addSection=()=>{const e=m.form.sections.length+1;m.form.sections.push({id:`sec_${Date.now()}`,name:`Section ${e}`,parameters:[{id:`param_${Date.now()}`,label:"New Field",field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}]}),R()};window.removeSection=e=>{if(m.form.sections.length<=1){$("Form must have at least one section");return}m.form.sections.splice(e,1),R()};window.updateSectionName=(e,t)=>{m.form.sections[e].name=t,R()};window.addParam=e=>{const t=m.form.sections[e].parameters.length+1;m.form.sections[e].parameters.push({id:`param_${Date.now()}`,label:`Field ${t}`,field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}),R()};window.removeParam=(e,t)=>{m.form.sections[e].parameters.splice(t,1),R()};window.updateParam=(e,t,i,a)=>{const n=m.form.sections[e].parameters[t];n[i]=a,i==="label"&&(n.field_key=a.toLowerCase().replace(/[^a-z0-9]/g,"_")),R()};window.updateParamOptions=(e,t,i)=>{const a=i.split(",").map(n=>n.trim()).filter(Boolean);m.form.sections[e].parameters[t].options=a,R()};window.validateAndGoStep3=()=>{for(const e of m.form.sections){if(!e.name.trim()){$("All sections must have a title");return}for(const t of e.parameters)if(!t.label.trim()){$("All fields must have a label");return}}m.step=3,R()};window.addTransition=()=>{m.workflow.transitions.push({from:"draft",to:"submitted",role:"citizen"}),R()};window.removeTransition=e=>{if(m.workflow.transitions.length<=1){$("Workflow must have at least one transition");return}m.workflow.transitions.splice(e,1),R()};window.updateTransition=(e,t,i)=>{m.workflow.transitions[e][t]=i,R()};window.validateAndGoStep4=()=>{for(let e=0;e<m.workflow.transitions.length;e++){const t=m.workflow.transitions[e];if(!t.from.trim()||!t.to.trim()){$(`Transition #${e+1} must have both from and to states.`);return}}m.step=4,R()};window.submitModuleCreation=async()=>{const e=document.getElementById("create-module-btn");e&&(e.disabled=!0,e.textContent="Deploying Metadata Atomically..."),m.isSubmitting=!0;try{const t=m.form.name||`${m.basics.name} Form`,i=m.report.name||`${m.basics.name}s by Area`,a={module:{name:m.basics.name,description:m.basics.description,domain_id:m.basics.domain_id||1},form:{name:t,sections:m.form.sections.map(s=>({name:s.name,parameters:s.parameters.map(o=>({field_key:o.field_key,label:o.label,field_type:o.field_type,mandatory:!!o.mandatory,options:o.options}))}))},workflow:{transitions:m.workflow.transitions.map(s=>({from_status:s.from,to_status:s.to,role:s.role}))},rules:m.rule.enabled&&m.rule.target_entity_type_id?[{target_entity_type_id:Number(m.rule.target_entity_type_id),event:m.rule.event||"approved",auto_create:!0,auto_approve:!1}]:[],reports:m.report.enabled?[{report_name:i,output_format:"grouped_count",filters:{groupBy:m.report.groupBy||"area",metric:m.report.metric||"COUNT",metricField:m.report.metricField||void 0,public_stats:m.report.publicStats}}]:[]},n=await Ci.deploy(a);q(n.message||`Module "${m.basics.name}" deployed successfully!`),m.isSubmitting=!1,m.step=7,R()}catch(t){$(t.message||"Failed to deploy module"),m.isSubmitting=!1,e&&(e.disabled=!1,e.innerHTML='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata')}};function D(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let Te=[],Tt=[];async function _a(){if(!J(z))return;const e=document.getElementById("app");e.innerHTML=T(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Reports"),B();try{const[t,i]=await Promise.all([Ue.list().catch(()=>({data:[]})),L.listTypes().catch(()=>({data:[]}))]);Te=t.data||[],Tt=i.data||[],e.innerHTML=T(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `,"Civic Reports",Tt),B(),Sa(document.getElementById("reports-container"))}catch{$("Failed to load reports catalog"),document.getElementById("reports-container").innerHTML=`
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `}}function Sa(e){if(!Te||Te.length===0){e.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;return}const t=Te.map(n=>{const s=Y(n.entityType);return`
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${D(s.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${D(n.metric_type||"COUNT")}</span>
          </div>
          <div class="report-card-title">${D(n.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${D(s.shortTitle)}</strong> records grouped by <strong>${D(n.group_by_field||"area / status")}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${D(n.group_by_field||"area")}</span>
            <span>•</span>
            <span>Metric: ${D(n.metric_type||"COUNT")}</span>
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
  `,e.querySelectorAll(".execute-report-btn").forEach(n=>{n.addEventListener("click",()=>{const s=n.getAttribute("data-repid");za(s)})});const a=document.getElementById("btn-close-result");a&&a.addEventListener("click",()=>{document.getElementById("report-execution-panel").style.display="none"})}async function za(e){const t=document.getElementById("report-execution-panel"),i=document.getElementById("execution-title"),a=document.getElementById("execution-body");if(!(!t||!a)){t.style.display="block",t.scrollIntoView({behavior:"smooth"}),a.innerHTML='<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';try{const s=(await Ue.execute(e)).data;i.textContent=`Report Results: ${s.reportName||"Execution"}`;const o=s.rows||[];if(o.length===0){a.innerHTML='<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>';return}const r=o.map(d=>{var l;return`
      <tr>
        <td style="font-weight:600;">${D(d[s.groupBy]||d.area||d.status||"Total")}</td>
        <td style="font-weight:700; color:var(--primary);">${d[(l=s.metric)==null?void 0:l.toLowerCase()]||d.count||d.total_count||0}</td>
      </tr>
    `}).join("");a.innerHTML=`
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${D(s.metric)}</strong> | Grouped By: <strong>${D(s.groupBy)}</strong> | Total Groups: <strong>${o.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${D(s.groupBy||"Group")}</th>
              <th>Aggregation Metric (${D(s.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${r}
          </tbody>
        </table>
      </div>
    `}catch(n){$(n.message||"Report execution failed"),a.innerHTML=`<div class="alert alert-error">Execution Error: ${D(n.message)}</div>`}}}function Ae(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ma(){if(!J(z))return;const e=document.getElementById("app");e.innerHTML=T(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Capabilities"),B();try{const i=(await L.listTypes().catch(()=>({data:[]}))).data||[];e.innerHTML=T(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `,"Civic Capabilities",i),B(),La(document.getElementById("modules-container"),i)}catch{$("Failed to load civic capabilities"),document.getElementById("modules-container").innerHTML=`
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `}}function La(e,t){if(!t||t.length===0){e.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;return}const i=t.map(a=>{var o;const n=Y(a),s=((o=a._count)==null?void 0:o.entities)||0;return`
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${te(n.iconKey,24)}
            </div>
            <span class="badge badge-secondary" style="font-size:11px;">${s} Active Cases</span>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:4px;">
            ${Ae(n.category)}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            ${Ae(n.title)}
          </h3>

          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
            ${Ae(n.description)}
          </p>
        </div>

        <div style="display:flex; gap:10px; padding-top:16px; border-top:1px solid var(--border);">
          <a href="/entities?entity_type_id=${a.entity_type_id}" class="btn btn-secondary" style="flex:1; text-align:center; font-size:0.85rem;">
            Explore Cases
          </a>
          <a href="/entities/new?entity_type_id=${a.entity_type_id}" class="btn btn-translucent-orange" style="flex:1; text-align:center; font-size:0.85rem;">
            ${Ae(n.actionLabel)} →
          </a>
        </div>
      </div>
    `}).join("");e.innerHTML=`
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
      ${i}
    </div>
  `}function A(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let rt=null,Ce=!1,De=[];async function Ia(){if(!ft(["director","admin"],z))return;const e=document.getElementById("app");e.innerHTML=T(`
    <div style="padding: 24px 0;">
      <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="spinner spinner-lg"></div>
        <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 500;">
          Initializing Governance Intelligence Engine...
        </div>
      </div>
    </div>
  `,"/governance"),B();try{De=(await L.listTypes().catch(()=>({data:[]}))).data||[],await ti()}catch(t){$(t.message||"Failed to load governance intelligence"),Aa(t.message)}}async function ti(){Ce=!0,Bt();try{const e=await Ei.analyze();if(e&&e.success)rt=e.data,q("Governance telemetry updated");else throw new Error((e==null?void 0:e.error)||"Analysis returned invalid response")}catch(e){$(e.message||"Governance analysis failed")}finally{Ce=!1,Bt()}}function Bt(){const e=document.getElementById("app");if(!e)return;if(!rt&&Ce){e.innerHTML=T(`
      <div style="padding: 32px 0;">
        <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="spinner spinner-lg"></div>
          <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 600;">
            Running Deterministic Rules & Telemetry Pipeline...
          </div>
        </div>
      </div>
    `,"/governance",De),B();return}const t=rt||{},i=t.summary_metrics||{},a=t.process_health||{pipeline:[]},n=t.exceptions||[],s=t.stakeholder_intelligence||[],o=t.ai_summary||null,r=t.analysis_mode==="AI_ASSISTED",d=`
    <div class="governance-page" style="padding: 20px 0 60px 0;">

      <!-- SIMULATION DISCLAIMER BANNER -->
      <div style="background: linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%); border: 1px solid #bfdbfe; border-left: 5px solid #3b82f6; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 14px;">
        <div style="color: #2563eb; flex-shrink: 0; margin-top: 2px;">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div style="flex: 1; font-size: 13px; line-height: 1.5; color: #1e3a8a;">
          <strong style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
            Simulated Governance Environment (Civic Intelligence Capability)
          </strong>
          All transactions, records, and verification workflows shown here are synthetic simulation scenarios generated to test algorithmic control-gap detection and process health monitoring. No conclusions or allegations regarding real individuals, trusts, or public bodies are made.
        </div>
      </div>

      <!-- PAGE HEADER -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin: 0;">
              Governance Intelligence
            </h1>
            <span style="background: ${r?"rgba(147, 51, 234, 0.12)":"rgba(100, 116, 139, 0.12)"}; color: ${r?"#9333ea":"#475569"}; border: 1px solid ${r?"rgba(147, 51, 234, 0.3)":"rgba(100, 116, 139, 0.25)"}; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              ${r?`
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14H8a4 4 0 01-.986-7.876 4 4 0 017.972 0A4 4 0 0112 14z"></path>
                </svg>
                AI-ASSISTED SYNTHESIS (GEMINI)
              `:`
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                DETERMINISTIC ENGINE ONLY
              `}
            </span>
          </div>
          <p style="color: var(--text-secondary); margin: 0; font-size: 14px;">
            Target Module: <strong style="color: var(--text-primary);">${A(t.entity_type_name||"Donation Transaction")}</strong> • 
            Telemetry analyzed at ${t.analyzed_at?new Date(t.analyzed_at).toLocaleTimeString():"now"}
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <button id="btn-reanalyze" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600;" ${Ce?"disabled":""}>
            ${Ce?`
              <div class="spinner spinner-sm" style="border-top-color:#fff;"></div>
              Analyzing Telemetry...
            `:`
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Re-run Intelligence Engine
            `}
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px;">
        
        <div class="card" style="padding: 18px; border-top: 4px solid var(--primary);">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Total Volume</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 6px 0 2px 0;">${i.total_transactions??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Transactions tracked</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #16a34a;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Verified</div>
          <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin: 6px 0 2px 0;">${i.verified_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Confirmed verification</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #ea580c;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Pending Verification</div>
          <div style="font-size: 2rem; font-weight: 800; color: #ea580c; margin: 6px 0 2px 0;">${i.pending_verification_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Awaiting officer review</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #dc2626;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Failed Verification</div>
          <div style="font-size: 2rem; font-weight: 800; color: #dc2626; margin: 6px 0 2px 0;">${i.failed_verification_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Process failures flagged</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #ca8a04;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Unreconciled</div>
          <div style="font-size: 2rem; font-weight: 800; color: #ca8a04; margin: 6px 0 2px 0;">${i.unresolved_reconciliation_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Bank matching pending</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #9333ea;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Exceptions Flagged</div>
          <div style="font-size: 2rem; font-weight: 800; color: #9333ea; margin: 6px 0 2px 0;">${n.length}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Deterministic control gaps</div>
        </div>

      </div>

      <!-- PROCESS HEALTH PIPELINE VISUALIZER -->
      <div class="card" style="padding: 24px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
              Process Health Pipeline
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 2px 0 0 0;">
              Lifecycle workflow stage velocity and dwell time computed from real AuditLog history
            </p>
          </div>
          <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">
            Authoritative Workflow: Entity.status
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; position: relative;">
          ${(a.pipeline||[]).map((c,p)=>{const v=c.exception_count>0;return`
              <div style="background: var(--gray-50); border: 1px solid ${v?"#fca5a5":"var(--gray-200)"}; border-radius: 8px; padding: 14px; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    STAGE ${p+1}
                  </span>
                  ${v?`
                    <span style="font-size: 11px; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                      ⚠️ ${c.exception_count} gap${c.exception_count>1?"s":""}
                    </span>
                  `:`
                    <span style="font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px;">
                      ✓ Healthy
                    </span>
                  `}
                </div>
                <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); text-transform: capitalize; margin-bottom: 4px;">
                  ${A(c.label||c.stage)}
                </div>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                  ${c.count} <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">in stage</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); border-top: 1px dashed var(--gray-200); padding-top: 6px; margin-top: 6px;">
                  ⏱ ${c.avg_days_in_stage!==null?`${c.avg_days_in_stage} days avg`:"Terminal stage"}
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- AI-ASSISTED EXECUTIVE SYNTHESIS (IF PRESENT) -->
      ${o?`
        <div class="card" style="border: 1px solid #d8b4fe; background: linear-gradient(180deg, #faf5ff 0%, #ffffff 100%); padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(147, 51, 234, 0.06);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #f3e8ff; padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="background: #9333ea; color: #ffffff; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h2 style="font-size: 1.2rem; font-weight: 800; color: #581c87; margin: 0;">
                  Executive Synthesis & Risk Assessment
                </h2>
                <div style="font-size: 12px; color: #7e22ce;">
                  Synthesized via Gemini AI from live deterministic exception telemetry
                </div>
              </div>
            </div>
            <span style="background: #9333ea; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
              AI: ${A(o.analysis_mode||"AI")}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 18px;">
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Pipeline Velocity Assessment
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${A(o.process_health_narrative||"Pipeline telemetry shows operational stages operating within standard thresholds.")}
              </p>
            </div>
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Control Gap Concentration
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${A(o.risk_narrative||"Exceptions detected require periodic verification per standard governance protocols.")}
              </p>
            </div>
          </div>

          ${Array.isArray(o.recommendations)&&o.recommendations.length>0?`
            <div style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 14px 18px;">
              <h3 style="font-size: 12px; font-weight: 700; color: #6b21a8; text-transform: uppercase; margin-bottom: 8px;">
                Recommended Corrective Governance Actions
              </h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #4b5563;">
                ${o.recommendations.map(c=>`<li>${A(c)}</li>`).join("")}
              </ul>
            </div>
          `:""}
        </div>
      `:`
        <div style="background: var(--gray-50); border: 1px dashed var(--gray-300); border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 13px; color: var(--text-secondary);">
            <strong>Deterministic Mode Active:</strong> All exception rules, pipeline metrics, and stakeholder mappings are computed via deterministic database queries. AI synthesis is optional.
          </div>
          <span style="font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 3px 8px; border-radius: 4px;">
            MODE: DETERMINISTIC_ONLY
          </span>
        </div>
      `}

      <!-- DETERMINISTIC EXCEPTION REGISTER -->
      <div class="card" style="padding: 24px; margin-bottom: 28px;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
              Deterministic Exception Register
            </h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 2px 0 0 0;">
              Rules-based anomalies detected directly from Entity state, ParameterValues, and AuditLog telemetry
            </p>
          </div>
          <span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">
            ${n.length} Active Observations
          </span>
        </div>

        ${n.length===0?`
          <div style="text-align: center; padding: 32px; color: var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 8px;">✓</div>
            <strong>Zero Exceptions Detected</strong>
            <p style="font-size: 13px; margin-top: 4px;">All transactions strictly satisfy configured governance and state-sync rules.</p>
          </div>
        `:`
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${n.map(c=>`
              <div style="border: 1px solid var(--gray-200); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; background: #ffffff;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; font-weight: 700; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-family: monospace;">
                      ${A(c.trigger_rule)}
                    </span>
                    <strong style="font-size: 14px; color: var(--text-primary);">
                      ${A(c.observation)}
                    </strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 10px; font-weight: 700; background: var(--gray-100); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                      MODE: ${A(c.analysis_mode||"DETERMINISTIC")}
                    </span>
                    ${c.requires_human_review?`
                      <span style="font-size: 10px; font-weight: 700; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">
                        HUMAN REVIEW REQUIRED
                      </span>
                    `:""}
                  </div>
                </div>

                <div style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; font-family: monospace; font-size: 12px; color: #1e293b;">
                  <strong>Evidence:</strong> ${A(c.evidence)}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; font-size: 12.5px;">
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Possible Process Weakness:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${A(c.possible_cause)}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Governance Recommendation:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${A(c.recommendation)}</div>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      <!-- STAKEHOLDER INTELLIGENCE MATRIX -->
      <div class="card" style="padding: 24px;">
        <div style="margin-bottom: 18px;">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Stakeholder Intelligence Matrix
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 2px 0 0 0;">
            Configured in DashboardMaster metadata and populated dynamically with live telemetry evidence
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          ${s.map(c=>`
            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 18px; background: var(--gray-50); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <strong style="font-size: 15px; color: var(--text-primary);">
                    ${A(c.stakeholder)}
                  </strong>
                  <span style="font-size: 10px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    ${A(c.analysis_mode||"DETERMINISTIC")}
                  </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Core Responsibility</div>
                  <div style="font-size: 13px; color: var(--text-primary); margin-top: 2px;">${A(c.interest)}</div>
                </div>

                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Governance Concern</div>
                  <div style="font-size: 13px; color: #7f1d1d; margin-top: 2px;">${A(c.concern)}</div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Relevant Process Stage</div>
                  <div style="font-size: 12.5px; color: var(--text-primary); margin-top: 2px; font-family: monospace;">${A(c.relevant_process)}</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px; font-size: 12px; color: #334155;">
                <strong style="color: var(--text-secondary); display: block; margin-bottom: 2px; font-size: 11px; text-transform: uppercase;">Live Telemetry Evidence:</strong>
                ${A(c.evidence)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;e.innerHTML=T(d,"/governance",De),B();const l=document.getElementById("btn-reanalyze");l&&l.addEventListener("click",()=>{ti()})}function Aa(e){const t=document.getElementById("app");t&&(t.innerHTML=T(`
    <div style="padding: 40px 0; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
      <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px;">Governance Intelligence Error</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">
        ${A(e||"Unable to execute governance analysis.")}
      </p>
      <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
    </div>
  `,"/governance",De),B())}let we=null,Be=!1,lt=null,W=null;function P(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ii(e){return P(e).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}function ai(e){return!e||isNaN(e)?"":e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/(1024*1024)).toFixed(1)+" MB"}function Ta(e,t=null){let i="";t&&(t.isImage&&t.previewUrl?i=`
        <div class="agent-user-attachment">
          <img src="${P(t.previewUrl)}" alt="${P(t.name)}" class="agent-attachment-thumb" />
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">📷 ${P(t.name)}</span>
            <span class="agent-attachment-size">${P(t.sizeStr)}</span>
          </div>
        </div>
      `:i=`
        <div class="agent-user-attachment agent-attachment-doc">
          <span class="agent-attachment-icon">📄</span>
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">${P(t.name)}</span>
            <span class="agent-attachment-size">${P(t.sizeStr)}</span>
          </div>
        </div>
      `);const a=e?`<div class="agent-bubble-text">${P(e)}</div>`:"";return`
    <div class="agent-msg-row agent-msg-user">
      <div class="agent-bubble agent-bubble-user">
        ${i}
        ${a}
      </div>
    </div>
  `}function dt(e){return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent">${ii(e)}</div>
    </div>
  `}function Ba(e,t){const i=Array.isArray(e)?e.map(n=>`
        <div class="agent-confirm-row ${n.isFile?"agent-confirm-file-row":""}">
          <span class="agent-confirm-label">${P(n.label)}</span>
          <span class="agent-confirm-value">${P(n.value)}</span>
        </div>`).join(""):"";return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="agent-confirm-card">
        <div class="agent-confirm-title">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);flex-shrink:0;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Submission Summary — Please Review
        </div>
        ${t?`<p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:12px;">${ii(t.split(`

`)[0])}</p>`:""}
        <div class="agent-confirm-table">${i}</div>
        <div class="agent-confirm-note" style="margin-top:10px; font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
          <span>📎</span> <span>Uploaded photo/document evidence will be attached directly to your official submission.</span>
        </div>
        <div class="agent-confirm-actions" id="agent-confirm-btns">
          <button id="agent-submit-btn" class="btn btn-primary" style="min-width:120px;">
            ✓ Submit
          </button>
          <button id="agent-cancel-btn" class="btn btn-secondary" style="min-width:100px;">
            ✗ Cancel
          </button>
        </div>
      </div>
    </div>
  `}function ja(e,t,i,a=[]){const n=Array.isArray(a)&&a.length>0?`<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; gap:4px;">
         <span>📎</span> <span>Attached evidence: <strong>${a.map(P).join(", ")}</strong></span>
       </div>`:"";return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" style="background:var(--green-600);" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="agent-success-card">
        <div style="font-weight:700; font-size:1rem; color:var(--green-700); margin-bottom:6px;">
          ✅ ${P(i)} Submitted!
        </div>
        <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:8px;">
          <strong>#${e}</strong> — ${P(t)}
        </div>
        ${n}
        <a href="/entities/${e}" class="btn btn-sm btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          View My Request
        </a>
        <button id="agent-new-request-btn" class="btn btn-sm btn-ghost" style="margin-left:8px;">
          + Start New Request
        </button>
      </div>
    </div>
  `}function Ra(){return`
    <div class="agent-msg-row agent-msg-agent" id="agent-thinking">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent agent-thinking-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `}function Pa(){return document.getElementById("agent-thread")}function ct(){return document.getElementById("agent-input")}function Ha(){return document.getElementById("agent-send-btn")}function Na(){return document.getElementById("agent-attach-btn")}function ni(){return document.getElementById("agent-file-input")}function ce(e){const t=Pa();if(!t)return;const i=document.createElement("div");for(i.innerHTML=e;i.firstChild;)t.appendChild(i.firstChild);t.scrollTop=t.scrollHeight}function jt(){const e=document.getElementById("agent-thinking");e&&e.remove()}function Ze(e){const t=ct(),i=Ha(),a=Na();t&&(t.disabled=!e),i&&(i.disabled=!e,i.style.opacity=e?"1":"0.5"),a&&(a.disabled=!e,a.style.opacity=e?"1":"0.5")}function kt(){var a;const e=document.getElementById("agent-file-preview-bar");if(!e)return;if(!W){e.innerHTML="",e.style.display="none";return}const t=W.type.startsWith("image/"),i=t?URL.createObjectURL(W):null;e.style.display="flex",e.innerHTML=`
    <div class="agent-preview-chip">
      ${t?`<img src="${i}" class="agent-preview-thumb" alt="Preview" />`:'<span class="agent-preview-icon">📄</span>'}
      <div class="agent-preview-info">
        <span class="agent-preview-filename">${P(W.name)}</span>
        <span class="agent-preview-filesize">${ai(W.size)}</span>
      </div>
      <button type="button" id="agent-remove-file-btn" class="agent-preview-remove" title="Remove attachment" aria-label="Remove attachment">&times;</button>
    </div>
  `,(a=document.getElementById("agent-remove-file-btn"))==null||a.addEventListener("click",()=>{W=null;const n=ni();n&&(n.value=""),kt()})}async function Ee(e,t=null){const i=t||W,a=(e||"").trim();if(Be||!a&&!i)return;Be=!0;let n=null;if(i){const r=i.type.startsWith("image/");n={name:i.name,sizeStr:ai(i.size),isImage:r,previewUrl:r?URL.createObjectURL(i):null}}const s=ct();s&&(s.value="",s.style.height="auto"),W=null;const o=ni();o&&(o.value=""),kt(),ce(Ta(a||(i?`Uploaded: ${i.name}`:""),n)),Ze(!1),ce(Ra());try{const r=await Xt.chat(we,a,i);jt();const d=r.data;lt=null,d.type==="confirm"?(lt=d,ce(Ba(d.summary||[],d.text)),setTimeout(()=>{const l=document.getElementById("agent-submit-btn"),c=document.getElementById("agent-cancel-btn");l&&l.addEventListener("click",()=>{var p;(p=document.getElementById("agent-confirm-btns"))==null||p.remove(),Ee("yes")}),c&&c.addEventListener("click",()=>{var p;(p=document.getElementById("agent-confirm-btns"))==null||p.remove(),Ee("cancel")})},50)):d.type==="submitted"?(ce(ja(d.entity_id,d.entity_name,d.capability,d.files)),Ze(!1),setTimeout(()=>{const l=document.getElementById("agent-new-request-btn");l&&l.addEventListener("click",()=>{z("/agent/chat")})},50)):ce(dt(d.text||"Something went wrong. Please try again."))}catch(r){jt(),ce(dt("Sorry, I encountered an error processing your request. Please try again or use the manual form.")),console.error("[Agent Chat] Error:",r)}finally{if(Be=!1,document.getElementById("agent-input")){Ze(!0);const r=ct();r&&!r.disabled&&r.focus()}}}async function Oa(e={},t=null){if(!J(z))return;we=null,Be=!1,lt=null,W=null;const i=t||new URLSearchParams(window.location.search),a=i.get("sessionId"),n=i.get("message");we=a||"ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);const s=document.getElementById("app");s.innerHTML=T(`
    <style>
      /* ── Agent chat layout ── */
      .agent-chat-wrap {
        display: flex; flex-direction: column; height: calc(100vh - 140px);
        max-width: 780px; margin: 0 auto;
      }
      .agent-chat-header {
        display:flex; align-items:center; gap:12px;
        padding:16px 20px; background:var(--surface);
        border:1px solid var(--border); border-radius:12px 12px 0 0;
        border-bottom:none;
      }
      .agent-chat-avatar-wrap {
        width:38px;height:38px;border-radius:50%;
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        display:flex;align-items:center;justify-content:center;flex-shrink:0;
      }
      #agent-thread {
        flex:1; overflow-y:auto; padding:20px;
        background:var(--surface); border:1px solid var(--border);
        display:flex; flex-direction:column; gap:12px;
      }
      /* Input bar & Attachment preview */
      .agent-input-container {
        display: flex; flex-direction: column;
        background:var(--surface); border:1px solid var(--border);
        border-radius:0 0 12px 12px; border-top: 1px solid var(--border-strong);
      }
      .agent-file-preview-bar {
        display: none; padding: 8px 16px 0 16px;
      }
      .agent-preview-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 10px; background: var(--bg); border: 1px solid var(--border-strong);
        border-radius: 8px; font-size: 0.8rem;
      }
      .agent-preview-thumb {
        width: 28px; height: 28px; object-fit: cover; border-radius: 4px;
      }
      .agent-preview-icon { font-size: 1.1rem; }
      .agent-preview-info { display: flex; flex-direction: column; line-height: 1.2; }
      .agent-preview-filename { font-weight: 600; color: var(--text-primary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .agent-preview-filesize { font-size: 0.7rem; color: var(--text-muted); }
      .agent-preview-remove {
        background: none; border: none; font-size: 1rem; color: var(--text-muted);
        cursor: pointer; padding: 0 4px; line-height: 1;
      }
      .agent-preview-remove:hover { color: var(--red-600, #dc2626); }

      .agent-input-bar {
        display:flex; gap:8px; align-items:center;
        padding:12px 16px;
      }
      .agent-attach-btn {
        background: none; border: none; color: var(--text-secondary);
        cursor: pointer; padding: 8px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .agent-attach-btn:hover {
        background: var(--bg); color: var(--primary);
      }
      #agent-input {
        flex:1; padding:10px 14px; border-radius:20px;
        border:1px solid var(--border-strong); background:var(--bg);
        color:var(--text-primary); font-size:0.9rem; font-family:inherit;
        resize:none; outline:none; min-height:40px; max-height:120px;
        transition: border-color 0.2s;
      }
      #agent-input:focus { border-color:var(--primary); }

      /* Message rows */
      .agent-msg-row { display:flex; gap:8px; max-width:88%; }
      .agent-msg-user { align-self:flex-end; flex-direction:row-reverse; max-width:75%; }
      .agent-msg-agent { align-self:flex-start; }
      .agent-bubble {
        padding:10px 16px; border-radius:18px; font-size:0.875rem;
        line-height:1.55; word-break:break-word;
      }
      .agent-bubble-user {
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        color:white; border-bottom-right-radius:4px;
      }
      .agent-bubble-agent {
        background:var(--surface-2,#f9f9fb); color:var(--text-primary);
        border:1px solid var(--border); border-bottom-left-radius:4px;
      }
      .agent-bubble-avatar {
        width:28px;height:28px;border-radius:50%;flex-shrink:0;margin-top:2px;
        background:linear-gradient(135deg,#ff5a36,#e03c22);
        display:flex;align-items:center;justify-content:center;
      }

      /* Attachment in bubble */
      .agent-user-attachment {
        display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
        background: rgba(0,0,0,0.15); padding: 6px 10px; border-radius: 10px;
      }
      .agent-attachment-thumb {
        width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4);
      }
      .agent-attachment-icon { font-size: 1.5rem; }
      .agent-attachment-meta { display: flex; flex-direction: column; }
      .agent-attachment-name { font-weight: 600; font-size: 0.8rem; }
      .agent-attachment-size { font-size: 0.7rem; opacity: 0.85; }

      /* Thinking animation */
      .agent-thinking-dots { display:flex; gap:4px; padding:12px 16px; align-items:center; }
      .agent-thinking-dots span {
        width:7px;height:7px;background:var(--text-muted);border-radius:50%;
        animation:agent-dot-bounce 1.2s infinite ease-in-out;
      }
      .agent-thinking-dots span:nth-child(1){animation-delay:0s;}
      .agent-thinking-dots span:nth-child(2){animation-delay:0.2s;}
      .agent-thinking-dots span:nth-child(3){animation-delay:0.4s;}
      @keyframes agent-dot-bounce {
        0%,80%,100%{transform:scale(0.7);opacity:0.5;}
        40%{transform:scale(1);opacity:1;}
      }

      /* Confirm card */
      .agent-confirm-card {
        background:var(--surface); border:2px solid var(--primary);
        border-radius:12px; padding:18px 20px; max-width:480px;
      }
      .agent-confirm-title {
        font-weight:700; font-size:0.9rem; color:var(--text-primary);
        margin-bottom:12px; display:flex; align-items:center; gap:8px;
      }
      .agent-confirm-table { display:flex; flex-direction:column; gap:6px; }
      .agent-confirm-row {
        display:flex; gap:12px; font-size:0.83rem;
        padding:5px 0; border-bottom:1px solid var(--border);
      }
      .agent-confirm-file-row {
        background: rgba(255, 90, 54, 0.05); padding: 6px 8px; border-radius: 6px;
      }
      .agent-confirm-row:last-child { border-bottom:none; }
      .agent-confirm-label { font-weight:600; color:var(--text-secondary); min-width:130px; flex-shrink:0; }
      .agent-confirm-value { color:var(--text-primary); font-weight:500; }
      .agent-confirm-actions { display:flex; gap:10px; margin-top:16px; }

      /* Success card */
      .agent-success-card {
        background:var(--green-50,#f0fdf4); border:1px solid var(--green-200,#bbf7d0);
        border-radius:12px; padding:18px 20px; max-width:400px;
      }
    </style>

    <div class="agent-chat-wrap">
      <div class="agent-chat-header">
        <div class="agent-chat-avatar-wrap">
          <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div>
          <div style="font-weight:700; font-size:0.95rem;">CIVIC-KALKI Assistant</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">
            Report problems · Upload photo evidence · Start initiatives · Check request status
          </div>
        </div>
        <div style="margin-left:auto;">
          <a href="/dashboard" class="btn btn-ghost btn-sm">← Dashboard</a>
        </div>
      </div>

      <div id="agent-thread" role="log" aria-live="polite" aria-label="Conversation with Civic Assistant">
        <!-- Initial greeting -->
        ${dt(`Hello! I'm your CIVIC-KALKI assistant. I can help you:

**1.** Report a civic problem (potholes, garbage, water supply, broken street lights…)
     *Tip: You can attach photo/document evidence directly using the 📎 button! Our AI will analyze the photo and fill the details for you.*
**2.** Start a civic initiative (community project, campaign…)
**3.** Check the status of your existing requests

What would you like to do today?`)}
      </div>

      <div class="agent-input-container">
        <!-- Attachment preview chip -->
        <div id="agent-file-preview-bar" class="agent-file-preview-bar"></div>

        <div class="agent-input-bar">
          <button
            id="agent-attach-btn"
            type="button"
            class="agent-attach-btn"
            title="Attach photo or document evidence"
            aria-label="Attach photo or document evidence"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="file"
            id="agent-file-input"
            style="display:none;"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv"
          />

          <textarea
            id="agent-input"
            placeholder="Type your message or attach a photo…"
            rows="1"
            autocomplete="off"
            aria-label="Message to civic assistant"
          ></textarea>

          <button
            id="agent-send-btn"
            class="btn btn-primary"
            style="border-radius:20px; padding:10px 18px; white-space:nowrap;"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `,"Civic Assistant"),B();const o=document.getElementById("agent-input"),r=document.getElementById("agent-send-btn"),d=document.getElementById("agent-attach-btn"),l=document.getElementById("agent-file-input");!o||!r||(d==null||d.addEventListener("click",()=>{l==null||l.click()}),l==null||l.addEventListener("change",c=>{var v;const p=(v=c.target.files)==null?void 0:v[0];p&&(W=p,kt(),o.focus())}),o.addEventListener("input",()=>{o.style.height="auto",o.style.height=Math.min(o.scrollHeight,120)+"px"}),o.addEventListener("keydown",c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),Ee(o.value))}),r.addEventListener("click",()=>{Ee(o.value)}),n&&n.trim()?setTimeout(()=>Ee(decodeURIComponent(n)),120):o.focus(),window.addEventListener("beforeunload",()=>{we&&Xt.clearSession(we)},{once:!0}))}function ee(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Rt={relatable:{primary:"#FF6B35",secondary:"#1A1A2E",accent:"#FFD700",text:"#FFFFFF"},awareness:{primary:"#2E86AB",secondary:"#1A1A2E",accent:"#A8DADC",text:"#FFFFFF"},call_to_action:{primary:"#43AA8B",secondary:"#1A1A2E",accent:"#F8961E",text:"#FFFFFF"}};function si(e){const{template_type:t="awareness",headline:i,caption:a,locality:n,category:s,photoUrl:o,shareLink:r,exportMode:d=!1}=e,l=Rt[t]||Rt.awareness,c=o?`background-image:url('${o}'); background-size:cover; background-position:center;`:`background:linear-gradient(135deg, ${l.secondary} 0%, #2d2d44 100%);`,p={relatable:"?? Relatable",awareness:"?? Awareness",call_to_action:"?? Call to Action"}[t]||"?? Awareness",v={relatable:`
      <div style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:22px;font-weight:800;color:${l.accent};letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;">${ee(i)}</div>
        <div style="font-size:15px;color:#fff;line-height:1.5;">${ee(a)}</div>
      </div>
    `,awareness:`
      <div style="background:rgba(46,134,171,0.85);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;border-left:4px solid ${l.accent};">
        <div style="font-size:12px;color:${l.accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">CIVIC ISSUE � ${ee(s||"Infrastructure")}</div>
        <div style="font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:8px;">${ee(i)}</div>
        <div style="font-size:14px;color:#ddd;line-height:1.5;">${ee(a)}</div>
      </div>
    `,call_to_action:`
      <div style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:20px;font-weight:800;color:${l.accent};line-height:1.2;margin-bottom:8px;">${ee(i)}</div>
        <div style="font-size:14px;color:#fff;line-height:1.5;margin-bottom:12px;">${ee(a)}</div>
        <div style="display:inline-block;background:${l.primary};color:#fff;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;">Report &amp; Support ?</div>
      </div>
    `}[t]||"";return`
    <div class="${d?"":"ck-meme-card"}" id="meme-preview-canvas" style="
      width:360px;
      min-height:400px;
      border-radius:${d?"0":"16px"};
      overflow:hidden;
      position:relative;
      font-family:'Inter','Segoe UI',sans-serif;
      ${c}
      display:flex;
      flex-direction:column;
      justify-content:flex-end;
    ">
      <!-- Gradient overlay -->
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%);"></div>

      <!-- Template label badge -->
      <div style="position:absolute;top:12px;right:12px;background:${l.primary};color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;z-index:2;">
        ${p}
      </div>

      <!-- Locality badge -->
      <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;z-index:2;">
        ?? ${ee(n||"Your Locality")}
      </div>

      <!-- Content -->
      <div style="position:relative;z-index:2;padding:16px;">
        ${v}

        <!-- Footer (mandatory � never remove) -->
        <div style="font-size:10px;color:rgba(255,255,255,0.55);text-align:center;padding-top:6px;border-top:1px solid rgba(255,255,255,0.15);margin-top:4px;">
          Civic awareness content | Caption AI-assisted | Tap to view the real issue
        </div>
      </div>
    </div>
  `}async function Da(e,t="civic-meme.png"){const i=document.getElementById(e);if(!i)throw new Error("Meme canvas element not found.");try{const{toPng:a}=await tt(async()=>{const{toPng:o}=await import("./index-6sdqbm2o.js");return{toPng:o}},[]),n=await a(i,{quality:.95,pixelRatio:2}),s=document.createElement("a");s.download=t,s.href=n,s.click()}catch(a){throw console.error("[MEME EXPORT] html-to-image failed:",a),new Error("Image export failed. Please try a screenshot instead.")}}function Q(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const qa="/api";async function he(e,t,i=null){const a=Se(),n={"Content-Type":"application/json"};a&&(n.Authorization=`Bearer ${a}`);const s={method:e,headers:n};i&&(s.body=JSON.stringify(i));const o=await fetch(`${qa}${t}`,s),r=await o.json().catch(()=>({success:!1,error:"Server error"}));if(!o.ok)throw Object.assign(new Error(r.error||`HTTP ${o.status}`),{data:r});return r}let f={step:1,issueId:null,issue:null,eligibility:null,templateType:null,aiOptions:[],selectedOption:null,editedHeadline:"",editedCaption:"",captionSource:"manual",originalAiSuggestion:null,safetyResult:null,attestationAccepted:!1,submitting:!1};async function Fa({issueId:e}){if(!J(z))return;const t=document.getElementById("app");t.innerHTML=T(`
    <div class="page-header mb-4">
      <div class="topbar-breadcrumb mb-2">
        <a href="/entities/${e}" class="text-link">? Back to Issue</a>
      </div>
      <h1>?? Civic Meme Studio</h1>
      <p class="text-secondary" style="margin-top:4px;">Turn a real civic issue into relatable awareness content. All campaigns require moderator approval.</p>
    </div>
    <div id="meme-studio-body"></div>
  `,"Civic Meme Studio"),B(),f={...f,step:1,issueId:Number(e),issue:null,eligibility:null},await Va(e)}async function Va(e){const t=document.getElementById("meme-studio-body");t.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{const[i,a]=await Promise.all([he("GET",`/entities/${e}`),he("GET",`/meme/eligibility/${e}`)]);if(f.issue=i.data,f.eligibility=a.data,!f.eligibility.eligible){Ua(t,f.eligibility.reason);return}oi(t)}catch(i){t.innerHTML=`<div class="alert alert-error">${Q(i.message||"Failed to load issue.")}</div>`}}function Ua(e,t){e.innerHTML=`
    <div class="alert alert-warning" style="max-width:600px;">
      <strong>? Cannot Create Meme Campaign</strong>
      <p style="margin-top:8px;">${Q(t)}</p>
      <p style="margin-top:8px;color:var(--text-secondary);font-size:0.875rem;">
        If this is a serious matter (crime, harassment, communal issues), please
        <a href="/entities/new" class="text-link">file a Grievance</a> instead.
      </p>
    </div>
  `}function oi(e){f.step=1;const t=f.eligibility.templateTypes||[],i={relatable:{icon:"??",name:"Relatable",desc:`Light situational humor that makes people nod. "We've all been there." Perfect for everyday civic frustrations.`},awareness:{icon:"??",name:"Awareness",desc:"Factual, informative content that raises visibility for an issue. Facts from the actual report only."},call_to_action:{icon:"??",name:"Call to Action",desc:"Energizing content that encourages citizens to report, support, or take action together."}};e.innerHTML=`
    <div class="ck-studio-wizard">
      ${be(1)}
      <h2 class="mb-2">Choose a Template</h2>
      <p class="text-secondary mb-4">Pick the tone that best fits this issue.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:720px;">
        ${t.map(a=>{const n=i[a]||{icon:"??",name:a,desc:""};return`
            <button class="ck-template-card" data-template="${a}" onclick="window._memePickTemplate('${a}')">
              <div style="font-size:2.5rem;margin-bottom:8px;">${n.icon}</div>
              <div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${n.name}</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">${n.desc}</div>
            </button>
          `}).join("")}
      </div>
    </div>
  `,window._memePickTemplate=a=>{f.templateType=a,ri(e)}}async function ri(e){f.step=2,e.innerHTML=`
    <div class="ck-studio-wizard">
      ${be(2)}
      <h2 class="mb-2">Caption Your Meme</h2>
      <div class="loading-overlay" style="position:static;height:80px;"><div class="spinner"></div></div>
      <p class="text-secondary">Generating AI caption suggestions...</p>
    </div>
  `;let t={options:[],ai_unavailable:!1};try{t=(await he("POST","/meme/captions",{issue_id:f.issueId,template_type:f.templateType})).data}catch(d){t={options:[],ai_unavailable:!0,reason:d.message||"AI unavailable."}}f.aiOptions=t.options||[];const i=t.ai_unavailable?`<div class="alert alert-warning mb-3" style="max-width:640px;">
        <strong>?? AI Unavailable</strong>
        <p style="margin-top:4px;font-size:0.875rem;">${Q(t.reason||"AI caption service is temporarily unavailable. Please write your own caption below.")}</p>
        <p style="font-size:0.75rem;color:var(--text-secondary);">Note: Automated safety check flagged as "unavailable" � moderator will review manually.</p>
      </div>`:"",a=f.aiOptions.length>0?`
      <div class="mb-3" style="max-width:640px;">
        <label class="form-label mb-2"><strong>AI Suggestions (select one to pre-fill):</strong></label>
        ${f.aiOptions.map((d,l)=>`
          <button class="ck-caption-option" onclick="window._memeSelectOption(${l})" id="capopt-${l}" style="display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;border-radius:8px;border:2px solid var(--border-color);background:var(--bg-secondary);cursor:pointer;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${Q(d.headline)}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">${Q(d.caption)}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">Humor: ${d.humor_level}</div>
          </button>
        `).join("")}
      </div>
    `:"";e.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:720px;">
      ${be(2)}
      <h2 class="mb-2">Caption Your Meme</h2>
      ${i}
      ${a}

      <div class="mb-3">
        <label class="form-label" for="meme-headline">Headline <span style="color:var(--text-muted);font-size:0.8rem;">(max 60 chars)</span></label>
        <input id="meme-headline" class="form-input" type="text" maxlength="60"
          placeholder="e.g. Pothole life got real"
          value="${Q(f.editedHeadline)}"
          oninput="window._memeSafetyCheck()"
        />
        <div id="headline-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 60</div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="meme-caption">Caption <span style="color:var(--text-muted);font-size:0.8rem;">(max 140 chars)</span></label>
        <textarea id="meme-caption" class="form-input" rows="3" maxlength="140"
          placeholder="e.g. Me checking the same pothole every day like it's a long-term relationship."
          oninput="window._memeSafetyCheck()"
        >${Q(f.editedCaption)}</textarea>
        <div id="caption-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 140</div>
      </div>

      <div id="safety-feedback" style="min-height:40px;"></div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(1)">? Back</button>
        <button class="btn btn-primary" id="step2-next" onclick="window._memeGoStep3()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `,r(),window._memeSelectOption=d=>{const l=f.aiOptions[d];l&&(f.selectedOption=l,f.editedHeadline=l.headline,f.editedCaption=l.caption,f.captionSource="ai",f.originalAiSuggestion=l,document.getElementById("meme-headline").value=l.headline,document.getElementById("meme-caption").value=l.caption,f.aiOptions.forEach((c,p)=>{const v=document.getElementById(`capopt-${p}`);v&&(v.style.borderColor=p===d?"var(--accent-primary)":"var(--border-color)")}),window._memeSafetyCheck())};let n;window._memeSafetyCheck=()=>{r(),clearTimeout(n),n=setTimeout(s,500)};async function s(){var c,p,v,u,g,C,h;const d=((c=document.getElementById("meme-headline"))==null?void 0:c.value)||"",l=((p=document.getElementById("meme-caption"))==null?void 0:p.value)||"";if(!d&&!l){o("",!1);return}f.captionSource==="ai"?(d!==(((v=f.selectedOption)==null?void 0:v.headline)||"")||l!==(((u=f.selectedOption)==null?void 0:u.caption)||""))&&(f.captionSource="ai_edited"):f.captionSource="manual",f.editedHeadline=d,f.editedCaption=l,o('<span style="color:var(--text-muted);">Checking...</span>',!1);try{const y=await he("POST","/meme/safety-check",{headline:d,caption:l,issue_id:f.issueId});if(f.safetyResult=y.data,y.data.passed)o('<span style="color:var(--success);">? Caption looks good!</span>',!0);else{const E=[...((g=y.data.deterministic)==null?void 0:g.violations)||[],...((C=y.data.ai_safety)==null?void 0:C.violations)||[]],X=((h=y.data.ai_safety)==null?void 0:h.status)==="unavailable",le=E.map(Me=>`<li>${Q(Me)}</li>`).join("");o(`<div class="alert alert-error" style="margin:0;padding:8px 12px;"><ul style="margin:0;padding-left:18px;">${le}${X?'<li style="color:var(--warning);">?? AI safety check unavailable � moderator will review manually.</li>':""}</ul></div>`,!1)}}catch{o('<span style="color:var(--warning);">?? Safety check temporarily unavailable.</span>',!1)}}function o(d,l){const c=document.getElementById("safety-feedback");c&&(c.innerHTML=d);const p=document.getElementById("step2-next");p&&(p.disabled=!l)}function r(){const d=document.getElementById("meme-headline"),l=document.getElementById("meme-caption"),c=document.getElementById("headline-chars"),p=document.getElementById("caption-chars");d&&c&&(c.textContent=`${d.value.length} / 60`),l&&p&&(p.textContent=`${l.value.length} / 140`)}window._memeGoStep=d=>{d===1&&oi(e)},window._memeGoStep3=()=>{var d,l;f.editedHeadline=((d=document.getElementById("meme-headline"))==null?void 0:d.value)||"",f.editedCaption=((l=document.getElementById("meme-caption"))==null?void 0:l.value)||"",li(e)}}function li(e){f.step=3,e.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:600px;">
      ${be(3)}
      <h2 class="mb-2">Photo Attestation</h2>
      <p class="text-secondary mb-4">
        Your meme will use the photo from the original issue report.
        Before proceeding, please confirm the following:
      </p>

      <div class="alert alert-info mb-4" style="font-size:0.875rem;line-height:1.6;">
        <strong>Your photo will be visible to the public.</strong>
        Please ensure it does not show:
        <ul style="margin:8px 0 0 18px;">
          <li>Identifiable faces of individuals</li>
          <li>Vehicle number plates</li>
          <li>Private property interiors</li>
          <li>Any person who has not given consent</li>
        </ul>
      </div>

      <label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;padding:16px;border:2px solid var(--border-color);border-radius:8px;">
        <input type="checkbox" id="attestation-checkbox" style="margin-top:2px;width:18px;height:18px;flex-shrink:0;"
          onchange="window._memeAttestCheck(this.checked)" />
        <span style="font-size:0.875rem;line-height:1.5;">
          <strong>I confirm that the issue photo does not show identifiable faces, vehicle number plates,
          or private property � or I have obtained consent from anyone shown.</strong>
        </span>
      </label>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(2)">? Back</button>
        <button class="btn btn-primary" id="step3-next" onclick="window._memeGoStep4()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `,window._memeAttestCheck=t=>{f.attestationAccepted=t;const i=document.getElementById("step3-next");i&&(i.disabled=!t)},window._memeGoStep=t=>{t===2&&ri(e)},window._memeGoStep4=()=>{if(!f.attestationAccepted){$("Please accept the attestation to continue.");return}Ga(e)}}function Ga(e){var n,s,o,r,d,l,c;f.step=4;const i=si({template_type:f.templateType,headline:f.editedHeadline,caption:f.editedCaption,locality:((n=f.issue)==null?void 0:n.area)||"Your Locality",category:((o=(s=f.issue)==null?void 0:s.entityType)==null?void 0:o.name)||"Civic Issue",photoUrl:null,shareLink:`/entities/${f.issueId}`}),a=((d=(r=f.safetyResult)==null?void 0:r.ai_safety)==null?void 0:d.status)==="unavailable"?'<div class="alert alert-warning" style="font-size:0.8rem;margin-bottom:12px;max-width:420px;">?? AI safety check was unavailable. Your meme will be flagged for manual moderator review.</div>':"";e.innerHTML=`
    <div class="ck-studio-wizard">
      ${be(4)}
      <h2 class="mb-2">Preview Your Meme</h2>
      <p class="text-secondary mb-3">This is how your meme will appear in Civic Buzz after approval.</p>

      ${a}

      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;">
        <div>${i}</div>

        <div style="max-width:280px;">
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Template</div>
            <div style="font-weight:600;">${(l=f.templateType)==null?void 0:l.replace(/_/g," ")}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Caption Source</div>
            <div>${f.captionSource==="ai"?"?? AI-generated":f.captionSource==="ai_edited"?"?? AI-assisted + edited":"?? Manual"}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Linked Issue</div>
            <a href="/entities/${f.issueId}" class="text-link">#${f.issueId} � ${Q(((c=f.issue)==null?void 0:c.name)||"")}</a>
          </div>
          <div class="alert alert-info" style="font-size:0.8rem;margin-top:12px;">
            This meme will be submitted to a moderator before being published. You can check its status in "My Memes".
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(3)">? Back</button>
        <button class="btn btn-primary" id="step4-submit" onclick="window._memeSubmit()">
          ?? Submit for Review
        </button>
      </div>
    </div>
  `,window._memeGoStep=p=>{p===3&&li(e)},window._memeSubmit=async()=>{if(f.submitting)return;f.submitting=!0;const p=document.getElementById("step4-submit");p&&(p.disabled=!0,p.textContent="Submitting...");try{const u=(await he("POST","/meme/campaigns",{issue_id:f.issueId,template_type:f.templateType,headline:f.editedHeadline,caption:f.editedCaption,caption_source:f.captionSource,original_ai_suggestion:f.originalAiSuggestion,attestation_accepted:!0})).data.campaign.entity_id;await he("POST",`/meme/campaigns/${u}/submit`),Wa(e,u)}catch(v){f.submitting=!1,p&&(p.disabled=!1,p.textContent="?? Submit for Review"),$(v.message||"Submission failed. Please try again.")}}}function Wa(e,t){f.step=5,e.innerHTML=`
    <div class="ck-studio-wizard" style="text-align:center;max-width:520px;margin:0 auto;">
      ${be(5)}
      <div style="font-size:3rem;margin-bottom:16px;">??</div>
      <h2 class="mb-2">Submitted for Review!</h2>
      <p class="text-secondary mb-4">
        Your meme campaign has been submitted to a moderator for review.
        You will be able to download and share it once it is approved and published.
      </p>
      <div class="alert alert-info mb-4" style="font-size:0.875rem;text-align:left;">
        <strong>What happens next?</strong>
        <ul style="margin:8px 0 0 18px;line-height:1.7;">
          <li>An area coordinator or admin will review your meme</li>
          <li>If approved, it will appear in Civic Buzz</li>
          <li>If rejected, you will see the reason in "My Memes"</li>
          <li>The campaign links back to your original issue automatically</li>
        </ul>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="/buzz" class="btn btn-secondary">View Civic Buzz</a>
        <a href="/entities/${f.issueId}" class="btn btn-primary">Back to Issue ?</a>
      </div>
    </div>
  `}function be(e){const t=[{n:1,label:"Template"},{n:2,label:"Caption"},{n:3,label:"Attestation"},{n:4,label:"Preview"},{n:5,label:"Done"}];return`
    <div class="ck-studio-steps" style="display:flex;align-items:center;gap:0;margin-bottom:28px;flex-wrap:wrap;">
      ${t.map((i,a)=>`
        <div style="display:flex;align-items:center;">
          <div style="
            width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            font-size:0.75rem;font-weight:700;
            background:${i.n<=e?"var(--accent-primary)":"var(--bg-tertiary)"};
            color:${i.n<=e?"#fff":"var(--text-muted)"};
          ">${i.n}</div>
          <div style="font-size:0.75rem;margin-left:6px;color:${i.n===e?"var(--text-primary)":"var(--text-muted)"};">${i.label}</div>
          ${a<t.length-1?'<div style="width:24px;height:2px;background:var(--border-color);margin:0 8px;"></div>':""}
        </div>
      `).join("")}
    </div>
  `}function K(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Ka="/api";function pt(){let e=localStorage.getItem("ck_buzz_session_id");e||(e="sess_"+Math.random().toString(36).substring(2,12)+Date.now().toString(36),localStorage.setItem("ck_buzz_session_id",e));const t=new Date().toISOString().slice(0,10);return`${e}_${t}`}async function fe(e,t,i=null){const a=Se(),n={"Content-Type":"application/json"};a&&(n.Authorization=`Bearer ${a}`);const s={method:e,headers:n};i&&(s.body=JSON.stringify(i));const o=await fetch(`${Ka}${t}`,s),r=await o.json().catch(()=>({success:!1,error:"Server error"}));if(!o.ok)throw Object.assign(new Error(r.error||`HTTP ${o.status}`),{data:r});return r}let j="feed",et=[],Pt=[],je=null;async function Ya(){const e=document.getElementById("app");e.innerHTML=T(`
    <div class="buzz-container" style="max-width: 1200px; margin: 0 auto; padding: 24px 16px;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
                  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 28px 24px;
                  margin-bottom: 28px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 28px;">🔥</span>
              <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.5px;">
                Civic Buzz &amp; Meme Studio
              </h1>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin: 0; max-width: 620px;">
              Transforming verified civic issues into relatable awareness campaigns. Every meme is linked to a real issue with honest accountability tracking.
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="buzz-create-btn" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700;">
              <span>⚡</span> Create a Meme
            </button>
            <a href="/entities" class="btn btn-secondary" style="font-size: 13px;">Browse Issues</a>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 8px; margin-top: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;">
          <button id="tab-feed" class="buzz-tab ${j==="feed"?"buzz-tab-active":""}" style="
            background: ${j==="feed"?"var(--primary, #3b82f6)":"transparent"};
            color: ${j==="feed"?"#fff":"#94a3b8"};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            🌐 Community Feed
          </button>
          <button id="tab-my" class="buzz-tab ${j==="my"?"buzz-tab-active":""}" style="
            background: ${j==="my"?"var(--primary, #3b82f6)":"transparent"};
            color: ${j==="my"?"#fff":"#94a3b8"};
            border: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            👤 My Memes &amp; Drafts
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div id="buzz-content">
        <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
          <div class="spinner" style="margin: 0 auto 16px;"></div>
          <p>Loading Civic Buzz feed...</p>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div id="buzz-report-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9999;
                align-items: center; justify-content: center; padding: 16px;">
      <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
                  max-width: 480px; width: 100%; padding: 24px; color: #fff;">
        <h3 style="font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 10px;">🚩 Report Meme</h3>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">
          Reporting will immediately place this campaign <strong>Under Review</strong> and remove it from the public feed pending moderator investigation.
        </p>
        <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Reason for Report *</label>
        <textarea id="buzz-report-reason" rows="3" class="form-input" placeholder="e.g. Inappropriate photo, contains private individual, misleading claim..."
                  style="width: 100%; border-radius: 8px; padding: 10px; margin-bottom: 16px; font-size: 13px;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="buzz-report-cancel" class="btn btn-secondary">Cancel</button>
          <button id="buzz-report-submit" class="btn btn-danger" style="background: #ef4444; color: #fff; border: none; font-weight: 600;">
            Confirm Report &amp; Takedown
          </button>
        </div>
      </div>
    </div>
  `),B(),Ja(),await _e()}function Ja(){var e,t,i,a,n;(e=document.getElementById("buzz-create-btn"))==null||e.addEventListener("click",()=>{z("/entities"),Pe('Select an approved issue and click "Create Civic Meme" to start.')}),(t=document.getElementById("tab-feed"))==null||t.addEventListener("click",async()=>{j!=="feed"&&(j="feed",Ht(),await _e())}),(i=document.getElementById("tab-my"))==null||i.addEventListener("click",async()=>{if(j==="my")return;if(!re()){Pe("Please sign in to view your memes and drafts."),z("/login");return}j="my",Ht(),await _e()}),(a=document.getElementById("buzz-report-cancel"))==null||a.addEventListener("click",()=>{document.getElementById("buzz-report-modal").style.display="none",je=null}),(n=document.getElementById("buzz-report-submit"))==null||n.addEventListener("click",async()=>{const s=document.getElementById("buzz-report-reason").value.trim();if(!s){$("Please provide a reason for the report.");return}try{await fe("POST",`/meme/campaigns/${je}/report`,{reason:s}),q("Content reported. Placed under review and hidden from feed."),document.getElementById("buzz-report-modal").style.display="none",je=null,await _e()}catch(o){$(o.message||"Failed to submit report")}})}function Ht(){const e=document.getElementById("tab-feed"),t=document.getElementById("tab-my");e&&t&&(e.style.background=j==="feed"?"var(--primary, #3b82f6)":"transparent",e.style.color=j==="feed"?"#fff":"#94a3b8",t.style.background=j==="my"?"var(--primary, #3b82f6)":"transparent",t.style.color=j==="my"?"#fff":"#94a3b8")}async function _e(){var t;const e=document.getElementById("buzz-content");if(e){e.innerHTML=`
    <div style="text-align: center; padding: 60px 20px; color: #94a3b8;">
      <div class="spinner" style="margin: 0 auto 16px;"></div>
      <p>Loading...</p>
    </div>
  `;try{if(j==="feed"){et=(await fe("GET","/meme/feed")).campaigns||[],Xa(e,et);const a=pt();et.forEach(n=>{fe("POST",`/meme/campaigns/${n.campaign_id}/event`,{event_type:"view",session_key:a}).catch(()=>{})})}else Pt=(await fe("GET","/meme/my")).campaigns||[],Za(e,Pt)}catch(i){e.innerHTML=`
      <div style="text-align: center; padding: 48px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;">
        <p style="color: #ef4444; font-weight: 600; margin-bottom: 8px;">Failed to load campaigns</p>
        <p style="color: #94a3b8; font-size: 13px;">${K(i.message)}</p>
        <button id="buzz-retry-btn" class="btn btn-secondary" style="margin-top: 12px;">Try Again</button>
      </div>
    `,(t=document.getElementById("buzz-retry-btn"))==null||t.addEventListener("click",_e)}}}function Xa(e,t){if(!t||t.length===0){e.innerHTML=`
      <div style="text-align: center; padding: 80px 24px; background: rgba(30, 41, 59, 0.5);
                  border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px;">
        <span style="font-size: 48px; display: block; margin-bottom: 16px;">🌱</span>
        <h3 style="color: #fff; font-size: 20px; font-weight: 700; margin-bottom: 8px;">No Active Civic Campaigns Yet</h3>
        <p style="color: #94a3b8; font-size: 14px; max-width: 480px; margin: 0 auto 24px;">
          Be the first to turn a real, approved civic problem into relatable awareness content that drives action.
        </p>
        <a href="/entities" class="btn btn-primary" style="font-weight: 700;">Explore Civic Issues</a>
      </div>
    `;return}const i=t.map(a=>{const n=si({template_type:a.template_type,headline:a.headline,caption:a.caption,locality:a.locality,category:a.issue_category,photoUrl:a.photo_file_id?`/api/files/${a.photo_file_id}`:null,shareLink:`/entities/${a.linked_entity_id}`,exportMode:!1}),s=a.impact||{views:0,issue_clicks:0,shares_initiated:0,participation:0},o=s.views>0||s.issue_clicks>0||s.shares_initiated>0||s.participation>0;return`
      <div class="buzz-feed-item" style="
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      ">
        <!-- Visual Meme Container -->
        <div style="display: flex; justify-content: center; background: #0f172a; padding: 12px;" id="meme-container-${a.campaign_id}">
          ${n}
        </div>

        <!-- Issue Meta & Honest Impact Bar -->
        <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
                ${K(a.issue_category||"Civic Issue")}
              </span>
              <span style="font-size: 11px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 2px 8px; font-weight: 600;">
                Live Issue: ${K(a.issue_status||"Active")}
              </span>
            </div>
            <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin: 0 0 10px; line-height: 1.4;">
              ${K(a.issue_title||"Civic Issue #"+a.linked_entity_id)}
            </h4>
          </div>

          <!-- Real Impact Stats Card -->
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">
              <span>📈 REAL IMPACT (RECORDED ONLY)</span>
              ${o?"":'<span style="color: #64748b; font-style: italic;">No activity yet</span>'}
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center;">
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #fff;">${s.views}</div>
                <div style="font-size: 10px; color: #94a3b8;">Views</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #38bdf8;">${s.issue_clicks}</div>
                <div style="font-size: 10px; color: #94a3b8;">Issue Taps</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #a78bfa;">${s.shares_initiated}</div>
                <div style="font-size: 10px; color: #94a3b8;">Shares Init.</div>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #34d399;">${s.participation}</div>
                <div style="font-size: 10px; color: #94a3b8;">Actions</div>
              </div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-primary buzz-view-issue-btn" data-campaign="${a.campaign_id}" data-issue="${a.linked_entity_id}"
                    style="flex: 1; font-size: 12px; padding: 8px 12px; font-weight: 600; min-width: 100px;">
              🔍 View Issue
            </button>
            <button class="btn btn-secondary buzz-share-btn" data-campaign="${a.campaign_id}" data-issue="${a.linked_entity_id}"
                    style="font-size: 12px; padding: 8px 12px;">
              🔗 Share
            </button>
            <button class="btn btn-secondary buzz-export-btn" data-container="meme-container-${a.campaign_id}" data-id="${a.campaign_id}"
                    style="font-size: 12px; padding: 8px 10px;" title="Export PNG image">
              📥
            </button>
            <button class="btn buzz-report-btn" data-campaign="${a.campaign_id}"
                    style="background: transparent; border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; font-size: 11px; padding: 8px 10px; border-radius: 6px;"
                    title="Report content">
              🚩
            </button>
          </div>
        </div>
      </div>
    `}).join("");e.innerHTML=`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
      ${i}
    </div>
  `,Qa()}function Qa(){document.querySelectorAll(".buzz-view-issue-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.getAttribute("data-campaign"),i=e.getAttribute("data-issue");fe("POST",`/meme/campaigns/${t}/event`,{event_type:"issue_click",session_key:pt()}).catch(()=>{}),z(`/entities/${i}?campaign_id=${t}`)})}),document.querySelectorAll(".buzz-share-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.getAttribute("data-campaign"),i=`${window.location.origin}/buzz?campaignId=${t}`;fe("POST",`/meme/campaigns/${t}/event`,{event_type:"share_initiated",session_key:pt()}).catch(()=>{}),navigator.clipboard?(await navigator.clipboard.writeText(i),q("Share link copied to clipboard! (Shares initiated recorded)")):Pe(`Share URL: ${i}`)})}),document.querySelectorAll(".buzz-export-btn").forEach(e=>{e.addEventListener("click",async()=>{const t=e.getAttribute("data-container"),i=e.getAttribute("data-id");try{e.disabled=!0,e.textContent="⏳",await Da(t,`civic-meme-${i}.png`),q("Meme downloaded successfully!")}catch(a){$(a.message||"Export failed")}finally{e.disabled=!1,e.textContent="📥"}})}),document.querySelectorAll(".buzz-report-btn").forEach(e=>{e.addEventListener("click",()=>{je=e.getAttribute("data-campaign"),document.getElementById("buzz-report-reason").value="",document.getElementById("buzz-report-modal").style.display="flex"})})}function Za(e,t){if(!t||t.length===0){e.innerHTML=`
      <div style="text-align: center; padding: 60px 24px; background: rgba(30, 41, 59, 0.4);
                  border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 16px;">
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">🎨</span>
        <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 8px;">No Memes Created Yet</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">
          You haven't created any civic meme campaigns yet. Go to an approved issue to get started!
        </p>
        <a href="/entities" class="btn btn-primary">Select an Issue</a>
      </div>
    `;return}const i=t.map(a=>`
      <div style="background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              ${{draft:'<span class="badge" style="background:#64748b;color:#fff;">Draft</span>',pending_review:'<span class="badge" style="background:#eab308;color:#000;">Pending Moderator Review</span>',approved:'<span class="badge" style="background:#10b981;color:#fff;">Approved</span>',published:'<span class="badge" style="background:#3b82f6;color:#fff;">Published &amp; Live</span>',rejected:'<span class="badge" style="background:#ef4444;color:#fff;">Rejected</span>',under_review:'<span class="badge" style="background:#f97316;color:#fff;">Under Review (Hidden)</span>'}[a.status]||`<span class="badge">${K(a.status)}</span>`}
              <span style="font-size: 11px; color: #94a3b8;">Template: <strong>${K(a.template_type)}</strong></span>
              <span style="font-size: 11px; color: #94a3b8;">Created: ${new Date(a.created_date).toLocaleDateString()}</span>
            </div>
            <h4 style="color: #fff; font-size: 16px; font-weight: 700; margin: 0 0 6px;">
              "${K(a.headline)}"
            </h4>
            <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 10px; font-style: italic;">
              "${K(a.caption)}"
            </p>
            <div style="font-size: 12px; color: #94a3b8;">
              Linked Issue: <a href="/entities/${a.linked_entity_id}" style="color: #38bdf8; text-decoration: underline;">Issue #${a.linked_entity_id}</a>
            </div>
          </div>
        </div>

        ${a.status==="rejected"&&a.rejection_reason?`
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 6px; margin: 10px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #ef4444; margin-bottom: 2px;">Moderator Feedback:</div>
            <div style="font-size: 13px; color: #fca5a5;">${K(a.rejection_reason)}</div>
          </div>
        `:""}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; pt-2; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #94a3b8;">
          <div>Source: <strong>${K(a.caption_source||"AI-assisted")}</strong></div>
          <div style="display: flex; gap: 8px;">
            ${a.status==="draft"?`
              <button class="btn btn-primary" onclick="window.location.href='/meme/studio/${a.linked_entity_id}'" style="font-size: 12px; padding: 6px 12px;">
                Continue Editing
              </button>
            `:""}
            ${a.status==="published"?`
              <a href="/entities/${a.linked_entity_id}" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">
                View on Issue
              </a>
            `:""}
          </div>
        </div>
      </div>
    `).join("");e.innerHTML=`<div>${i}</div>`}I("/",wi);I("/login",Li);I("/signup",Ii);I("/dashboard",Ge);I("/governance",Ia);I("/modules",Ma);I("/entities",Di);I("/entities/new",aa);I("/entities/:id",xt);I("/admin",ca);I("/module-builder",fa);I("/reports",_a);I("/profile",ga);I("/director",Ge);I("/coordinator",Ge);I("/workspace",Ge);I("/agent/chat",Oa);I("/meme/studio/:issueId",Fa);I("/buzz",Ya);Dt(()=>{document.getElementById("app").innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `});qt();yi();window.addEventListener("auth:expired",()=>{tt(()=>Promise.resolve().then(()=>Mi),void 0).then(e=>{e.toastWarning("Your session has expired. Please sign in again.")}),tt(()=>Promise.resolve().then(()=>mi),void 0).then(e=>e.navigate("/login"))});
