(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const u of d.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function o(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function r(l){if(l.ep)return;l.ep=!0;const d=o(l);fetch(l.href,d)}})();const El="modulepreload",Tl=function(i){return"/"+i},Go={},Ko=function(a,o,r){let l=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),p=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));l=Promise.allSettled(o.map(m=>{if(m=Tl(m),m in Go)return;Go[m]=!0;const f=m.endsWith(".css"),v=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${v}`))return;const y=document.createElement("link");if(y.rel=f?"stylesheet":El,f||(y.as="script"),y.crossOrigin="",y.href=m,p&&y.setAttribute("nonce",p),document.head.appendChild(y),f)return new Promise((_,b)=>{y.addEventListener("load",_),y.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${m}`)))})}))}function d(u){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=u,window.dispatchEvent(p),!p.defaultPrevented)throw u}return l.then(u=>{for(const p of u||[])p.status==="rejected"&&d(p.reason);return a().catch(d)})},ys=[];let bs=()=>{};function _t(i,a){ys.push({path:i,handler:a})}function xs(i){bs=i}function Sl(i){const a=[...ys].sort((o,r)=>{const l=o.path.includes(":"),d=r.path.includes(":");return!l&&d?-1:l&&!d?1:0});for(const o of a){const r=[],l=o.path.replace(/:([^/]+)/g,(p,m)=>(r.push(m),"([^/]+)")).replace(/\//g,"\\/"),d=new RegExp(`^${l}$`),u=i.match(d);if(u){const p={};return r.forEach((m,f)=>{p[m]=decodeURIComponent(u[f+1])}),{handler:o.handler,params:p,path:o.path}}}return null}function X(i){window.history.pushState({},"",i),ha(window.location.href)}function ha(i=window.location.href){const a=new URL(i,window.location.origin);let o=a.pathname;o.length>1&&o.endsWith("/")&&(o=o.slice(0,-1));const r=Sl(o);if(r){const l=r.handler(r.params,a.searchParams);l&&typeof l.then=="function"&&l.then(()=>{window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:o,async:!0}}))}).catch(d=>{console.error("[Router Error]:",d)})}else bs();window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:o}}))}function _s(){window.navigate=X,window.addEventListener("popstate",()=>ha(window.location.href));const i=document.getElementById("app");i&&i.addEventListener("click",a=>{const o=a.target.closest("a[href]");if(!o)return;const r=o.getAttribute("href");!r||r.startsWith("http")||r.startsWith("mailto:")||r.startsWith("#")||(a.preventDefault(),X(r))}),ha(window.location.href)}const Ml=Object.freeze(Object.defineProperty({__proto__:null,addRoute:_t,initRouter:_s,navigate:X,onNotFound:xs},Symbol.toStringTag,{value:"Module"}));let Kt=null,ae=null,Re=null,wi=null;async function ws(){try{const i=await fetch("/api/auth/me",{credentials:"include",headers:{"X-Requested-With":"ck-web"}});if(!i.ok)return Kt=null,ae=null,null;const a=await i.json();return a.success&&a.data?(Kt=a.data.user||null,ae=a.data.expires_at||null,ks(),Kt):(Kt=null,ae=null,null)}catch{return Kt=null,ae=null,null}}function ks(){if(Re&&clearTimeout(Re),!ae)return;const i=new Date(ae).getTime()-Date.now();i>0&&(Re=setTimeout(()=>{Kt=null,ae=null,Re=null},i))}async function $l(){return wi||(wi=ws().finally(()=>{wi=null}),wi)}function qt(){return Kt}function hn(){return(Kt==null?void 0:Kt.role)||null}function mn(){return Kt?ae?new Date(ae).getTime()>Date.now():!0:!1}function zs(i){i&&(Kt=i.user||(i.user_id?i:null),ae=i.expires_at||null,ks())}function Ca(){Kt=null,ae=null,Re&&(clearTimeout(Re),Re=null)}async function Il(){return ws()}function he(i){return mn()?!0:(i("/login"),!1)}function Ea(i,a){if(!he(a))return!1;const o=hn();return i.includes(o)?!0:(a("/dashboard"),!1)}const Pl={citizen:"Citizen",coordinator_area:"Area Coordinator",coordinator_general:"General Coordinator",director:"Director",admin:"Administrator"};function Li(i){return Pl[i]||i}const ma=[{code:"en",name:"English",nativeName:"English",region:"Pan-India / Official",popular:!0},{code:"hi",name:"Hindi",nativeName:"हिन्दी",region:"North & Central India",popular:!0},{code:"mr",name:"Marathi",nativeName:"मराठी",region:"Maharashtra",popular:!0},{code:"ta",name:"Tamil",nativeName:"தமிழ்",region:"Tamil Nadu & Puducherry",popular:!0},{code:"te",name:"Telugu",nativeName:"తెలుగు",region:"Andhra Pradesh & Telangana",popular:!0},{code:"bn",name:"Bengali",nativeName:"বাংলা",region:"West Bengal & Tripura",popular:!0},{code:"gu",name:"Gujarati",nativeName:"ગુજરાતી",region:"Gujarat",popular:!0},{code:"kn",name:"Kannada",nativeName:"ಕನ್ನಡ",region:"Karnataka",popular:!0},{code:"ml",name:"Malayalam",nativeName:"മലയാളം",region:"Kerala & Lakshadweep",popular:!0},{code:"pa",name:"Punjabi",nativeName:"ਪੰਜਾਬੀ",region:"Punjab",popular:!0},{code:"ur",name:"Urdu",nativeName:"اردو",region:"Pan-India",popular:!0},{code:"as",name:"Assamese",nativeName:"অসমীয়া",region:"Assam"},{code:"bho",name:"Bhojpuri",nativeName:"भोजपुरी",region:"Bihar & Uttar Pradesh"},{code:"doi",name:"Dogri",nativeName:"डोगरी",region:"Jammu & Kashmir"},{code:"gom",name:"Konkani",nativeName:"कोंकणी",region:"Goa & Konkan"},{code:"mai",name:"Maithili",nativeName:"मैथिली",region:"Bihar & Jharkhand"},{code:"mni-Mtei",name:"Meiteilon (Manipuri)",nativeName:"ꯃꯤꯇꯩꯂꯣꯟ",region:"Manipur"},{code:"lus",name:"Mizo",nativeName:"Mizo ṭawng",region:"Mizoram"},{code:"ne",name:"Nepali",nativeName:"नेपाली",region:"Sikkim & West Bengal"},{code:"or",name:"Odia",nativeName:"ଓଡ଼ିଆ",region:"Odisha"},{code:"sa",name:"Sanskrit",nativeName:"संस्कृतम्",region:"Classical Language"},{code:"sd",name:"Sindhi",nativeName:"سنڌي",region:"Sindhi"}],Ls="civic_kalki_lang";function ai(){return localStorage.getItem(Ls)||"en"}function Cs(i){return ma.find(a=>a.code.toLowerCase()===(i||"").toLowerCase())||{code:i||"en",name:"English",nativeName:"English",region:"Official"}}function Es(i){try{const a=localStorage.getItem(`civic_trans_${i}`);return a?JSON.parse(a):{}}catch{return{}}}function Al(i,a){try{const r={...Es(i),...a};localStorage.setItem(`civic_trans_${i}`,JSON.stringify(r))}catch{}}function Ts(){["googtrans","googtrans_opt","__googtrans"].forEach(a=>{document.cookie=`${a}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,window.location.hostname&&(document.cookie=`${a}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,document.cookie=`${a}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`)}),document.querySelectorAll(".goog-te-banner-frame, iframe.goog-te-banner-frame, #google_translate_element, #goog-gt-tt, .goog-te-balloon-frame").forEach(a=>{try{a.remove()}catch{}}),document.body&&(document.body.style.top="0px",document.body.style.position="static")}function Bl(i){const a=[],o=[],r=[],l=new Set,d=document.createTreeWalker(i,NodeFilter.SHOW_TEXT,{acceptNode(u){if(!u.nodeValue)return NodeFilter.FILTER_REJECT;const p=u.parentElement;if(!p)return NodeFilter.FILTER_REJECT;const m=p.tagName.toLowerCase();if(["script","style","code","pre","textarea"].includes(m)||p.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return NodeFilter.FILTER_REJECT;const f=(u._civicOriginal!==void 0?u._civicOriginal:u.nodeValue).trim();return!f||/^[\d\s\-_.,/\\:;!@#$%^&*()=+~`|<>?"'’]+$/.test(f)||/^#?[A-Za-z]{1,5}-\d+$/.test(f)||/^#\d+$/.test(f)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});for(;d.nextNode();){const u=d.currentNode;u._civicOriginal===void 0&&(u._civicOriginal=u.nodeValue);const p=u._civicOriginal.trim();p&&(a.push({node:u,original:p}),l.add(p))}return i.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(u=>{if(u.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;u._civicOriginalPlaceholder===void 0&&(u._civicOriginalPlaceholder=u.placeholder);const p=(u._civicOriginalPlaceholder||"").trim();p&&!/^[\d\s]+$/.test(p)&&(o.push({element:u,original:p}),l.add(p))}),i.querySelectorAll("[title]").forEach(u=>{if(u.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;u._civicOriginalTitle===void 0&&(u._civicOriginalTitle=u.title);const p=(u._civicOriginalTitle||"").trim();p&&!/^[\d\s]+$/.test(p)&&(r.push({element:u,original:p}),l.add(p))}),{textItems:a,placeholderItems:o,titleItems:r,uniqueStrings:Array.from(l)}}function Rl(i=document.getElementById("app")){if(!i)return;const a=document.createTreeWalker(i,NodeFilter.SHOW_TEXT,null);for(;a.nextNode();){const o=a.currentNode;o._civicOriginal!==void 0&&(o.nodeValue=o._civicOriginal)}i.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(o=>{o._civicOriginalPlaceholder!==void 0&&(o.placeholder=o._civicOriginalPlaceholder)}),i.querySelectorAll("[title]").forEach(o=>{o._civicOriginalTitle!==void 0&&(o.title=o._civicOriginalTitle)})}let ia=!1,na=!1,fa=!1;async function oi(i){const a=i||ai(),o=document.getElementById("app")||document.body;if(!o)return;if(a==="en"){Rl(o);return}const{textItems:r,placeholderItems:l,titleItems:d,uniqueStrings:u}=Bl(o);if(u.length===0)return;const p=Es(a),m=[],f=()=>{fa=!0;try{r.forEach(({node:v,original:y})=>{if(p[y])if(v._civicOriginal&&v._civicOriginal.trim()===y){const _=v._civicOriginal.match(/^\s*/)[0],b=v._civicOriginal.match(/\s*$/)[0];v.nodeValue=_+p[y]+b}else v._civicOriginal&&(v.nodeValue=v._civicOriginal.replace(y,p[y]))}),l.forEach(({element:v,original:y})=>{p[y]&&(v.placeholder=p[y])}),d.forEach(({element:v,original:y})=>{p[y]&&(v.title=p[y])})}finally{setTimeout(()=>{fa=!1},40)}};if(f(),u.forEach(v=>{p[v]||m.push(v)}),m.length!==0){if(ia){na=!0;return}ia=!0;try{const v=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json","X-Requested-With":"ck-web"},body:JSON.stringify({texts:m,targetLang:a})});if(v.ok){const y=await v.json();y&&y.translations&&(Al(a,y.translations),Object.assign(p,y.translations),f())}}catch(v){console.error("[Translation Service Error]:",v)}finally{ia=!1,na&&(na=!1,setTimeout(()=>{oi(a)},50))}}}function Jo(i){const a=(i||"en").trim();localStorage.setItem(Ls,a),Ts(),Ol(a),oi(a)}function fn(i={}){const a=i.idPrefix||"topbar",o=ai(),r=Cs(o),l=ma.filter(d=>d.popular);return`
    <div class="lang-dropdown-container notranslate" id="${a}-lang-container">
      <button 
        type="button" 
        class="lang-trigger-btn" 
        id="${a}-lang-btn" 
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
        <span class="lang-btn-label truncate" id="${a}-lang-label">
          ${Qt(r.nativeName||r.name)}
        </span>
        <span class="lang-badge">${Qt(o.toUpperCase().slice(0,5))}</span>
        <svg class="lang-chevron" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Card -->
      <div class="lang-dropdown-menu" id="${a}-lang-dropdown">
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
            id="${a}-lang-search" 
            placeholder="Search language or state (e.g. Hindi, Marathi, Tamil)..." 
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="lang-search-clear hidden" id="${a}-lang-clear" aria-label="Clear search">✕</button>
        </div>

        <!-- Quick Select Chips for Major Indian Languages -->
        <div class="lang-quick-section" id="${a}-lang-popular-section">
          <div class="lang-section-label">Most Common</div>
          <div class="lang-chips-grid">
            ${l.map(d=>`
              <button 
                type="button" 
                class="lang-chip ${d.code===o?"active":""}" 
                data-lang="${d.code}"
                title="${Qt(d.name)} (${Qt(d.region)})"
              >
                ${Qt(d.nativeName)}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="lang-section-label" style="padding: 6px 14px 2px;">Official & Regional Languages</div>

        <!-- Full Scrollable List -->
        <div class="lang-options-scroll" id="${a}-lang-list">
          ${ma.map(d=>{const u=d.code===o;return`
              <div 
                class="lang-option-row ${u?"selected":""}" 
                data-lang="${d.code}" 
                data-name="${Qt(d.name.toLowerCase())}" 
                data-native="${Qt(d.nativeName.toLowerCase())}"
                data-region="${Qt((d.region||"").toLowerCase())}"
                role="button"
                tabindex="0"
              >
                <div class="lang-names-wrap">
                  <span class="lang-native-name">${Qt(d.nativeName)}</span>
                  <span class="lang-english-name">${Qt(d.name)} • <span style="opacity:0.75;">${Qt(d.region)}</span></span>
                </div>
                <div class="lang-code-pill">${Qt(d.code)}</div>
                ${u?`
                  <svg class="lang-check-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                `:""}
              </div>
            `}).join("")}
        </div>

        <!-- Footer / Reset -->
        <div class="lang-dropdown-footer">
          <button type="button" class="lang-reset-btn" id="${a}-lang-reset">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to English (Default)
          </button>
        </div>
      </div>
    </div>
  `}function vn(i="topbar"){const a=document.getElementById(`${i}-lang-container`),o=document.getElementById(`${i}-lang-btn`),r=document.getElementById(`${i}-lang-dropdown`),l=document.getElementById(`${i}-lang-search`),d=document.getElementById(`${i}-lang-clear`),u=document.getElementById(`${i}-lang-list`),p=document.getElementById(`${i}-lang-reset`),m=document.getElementById(`${i}-lang-popular-section`);if(!(!a||!o||!r)){if(o.addEventListener("click",f=>{f.stopPropagation();const v=r.classList.contains("show");document.querySelectorAll(".lang-dropdown-menu.show").forEach(y=>{y!==r&&y.classList.remove("show")}),r.classList.toggle("show",!v),o.setAttribute("aria-expanded",String(!v)),!v&&l&&setTimeout(()=>l.focus(),50)}),r.addEventListener("click",f=>{f.stopPropagation();const v=f.target.closest("[data-lang]");if(v){const y=v.getAttribute("data-lang");y&&(r.classList.remove("show"),o.setAttribute("aria-expanded","false"),Jo(y))}}),l&&u){const f=Array.from(u.querySelectorAll(".lang-option-row")),v=()=>{const y=(l.value||"").trim().toLowerCase();d==null||d.classList.toggle("hidden",y.length===0),m&&(m.style.display=y.length>0?"none":"block");let _=0;f.forEach(C=>{const w=C.getAttribute("data-name")||"",M=C.getAttribute("data-native")||"",O=C.getAttribute("data-region")||"",P=(C.getAttribute("data-lang")||"").toLowerCase(),V=!y||w.includes(y)||M.includes(y)||O.includes(y)||P.includes(y);C.style.display=V?"flex":"none",V&&_++});let b=u.querySelector(".lang-no-match");_===0?(b||(b=document.createElement("div"),b.className="lang-no-match",b.textContent="No Indian language found matching your search",u.appendChild(b)),b.style.display="block"):b&&(b.style.display="none")};l.addEventListener("input",v),d&&d.addEventListener("click",y=>{y.stopPropagation(),l.value="",v(),l.focus()})}p&&p.addEventListener("click",f=>{f.stopPropagation(),r.classList.remove("show"),o.setAttribute("aria-expanded","false"),Jo("en")}),document.addEventListener("click",f=>{a.contains(f.target)||(r.classList.remove("show"),o.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",f=>{f.key==="Escape"&&r.classList.contains("show")&&(r.classList.remove("show"),o.setAttribute("aria-expanded","false"),o.focus())})}}function Ol(i){const a=Cs(i);document.querySelectorAll(".lang-btn-label").forEach(o=>{o.textContent=a.nativeName||a.name}),document.querySelectorAll(".lang-badge").forEach(o=>{o.textContent=(i||"EN").toUpperCase().slice(0,5)}),document.querySelectorAll(".lang-chip").forEach(o=>{const r=o.getAttribute("data-lang")===i;o.classList.toggle("active",r)}),document.querySelectorAll(".lang-option-row").forEach(o=>{const r=o.getAttribute("data-lang")===i;o.classList.toggle("selected",r);let l=o.querySelector(".lang-check-icon");if(r&&!l){const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("class","lang-check-icon"),d.setAttribute("width","16"),d.setAttribute("height","16"),d.setAttribute("fill","none"),d.setAttribute("stroke","currentColor"),d.setAttribute("viewBox","0 0 24 24"),d.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>',o.appendChild(d)}else!r&&l&&l.remove()})}let aa=null,oa=null;function Hl(){if(aa)return;const i=document.getElementById("app")||document.body;i&&(aa=new MutationObserver(a=>{if(fa)return;const o=ai();if(o==="en")return;let r=!1;for(const l of a){if(l.type==="childList"&&l.addedNodes.length>0){for(const d of l.addedNodes)if(d.nodeType===Node.ELEMENT_NODE){if(d.closest&&d.closest(".notranslate, .lang-dropdown-menu, .lang-dropdown-container"))continue;r=!0;break}}if(r)break}r&&(oa&&clearTimeout(oa),oa=setTimeout(()=>{oi(o)},70))}),aa.observe(i,{childList:!0,subtree:!0}))}function Nl(){Ts(),window.civicTranslatePage=a=>oi(a||ai()),Hl();const i=ai();i!=="en"&&setTimeout(()=>{oi(i)},100),window.addEventListener("civic:route-rendered",()=>{const a=ai();a!=="en"&&setTimeout(()=>{oi(a)},60)})}function Qt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const pt={tool:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',sprout:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',users:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',activity:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',message:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',zap:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',grid:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',workflow:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>',chart:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',shield:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',bot:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/></svg>',tree:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M8 15h8l-2-4h3l-2-4h2L12 2 7 7h2l-2 4h3z"/></svg>',school:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v6a6 3 0 0 0 12 0v-6"/><path d="M22 13v6"/></svg>',water:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',clock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',chatLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',botLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/><path d="M2 13h1"/><path d="M21 13h1"/></svg>',gearLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',checkLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',flame:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',target:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',layers:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',heartHand:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',lock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',database:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',sparkles:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',toolBox:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',heartFill:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="#ff5a36" stroke="#ff5a36" stroke-width="1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'};function jl(){const i=mn(),a=document.getElementById("app");a&&(a.innerHTML=`
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
            ${fn({idPrefix:"home"})}
            ${i?`
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
          <span class="ck-float-badge ck-fb-orange">${pt.tool} REPORT</span>
        </div>
        <div class="ck-hero-float ck-float-2" aria-hidden="true">
          <span class="ck-float-badge ck-fb-green">${pt.sprout} INITIATIVE</span>
        </div>
        <div class="ck-hero-float ck-float-3" aria-hidden="true">
          <span class="ck-float-badge ck-fb-blue">${pt.users} VOLUNTEER</span>
        </div>
        <div class="ck-hero-float ck-float-4" aria-hidden="true">
          <span class="ck-float-badge ck-fb-purple">${pt.activity} TRACK</span>
        </div>
        <div class="ck-hero-float ck-float-5" aria-hidden="true">
          <span class="ck-float-badge ck-fb-pink">${pt.message} SPEAK UP</span>
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
            ${i?`
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
              <button class="ck-tab-btn active" data-tab="tab-report">${pt.zap} Report</button>
              <button class="ck-tab-btn" data-tab="tab-organize">${pt.grid} Organize</button>
              <button class="ck-tab-btn" data-tab="tab-execute">${pt.workflow} Execute</button>
              <button class="ck-tab-btn" data-tab="tab-understand">${pt.chart} Understand</button>
              <button class="ck-tab-btn" data-tab="tab-accountable">${pt.shield} Accountable</button>
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
                          <span class="ck-ai-badge">${pt.bot} KALKI AI</span>
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
                          <div class="ck-org-icon-pill">${pt.tree}</div>
                          <div>
                            Tree Plantation Drive
                            <div class="ck-org-meta">42 volunteers • Sector 7</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${pt.school}</div>
                          <div>
                            School Renovation Fund
                            <div class="ck-org-meta">₹2.4L raised • Ward 12</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${pt.water}</div>
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
                        <div class="ck-wf-step active"><span>${pt.clock}</span> Director Approval</div>
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
                <div class="ck-how-icon-box">${pt.chatLarge}</div>
              </div>
              <h3>Tell us what's wrong</h3>
              <p>Type or speak in plain language. Our AI understands civic issues — no bureaucratic forms.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">02</div>
                <div class="ck-how-icon-box">${pt.botLarge}</div>
              </div>
              <h3>AI classifies & routes</h3>
              <p>KALKI AI auto-categorizes, sets priority, and routes to the right department instantly.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">03</div>
                <div class="ck-how-icon-box">${pt.gearLarge}</div>
              </div>
              <h3>Workflows kick in</h3>
              <p>Multi-stage approvals, inspections, and assignments — automated, transparent, and tracked.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">04</div>
                <div class="ck-how-icon-box">${pt.checkLarge}</div>
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
          <div class="ck-section-label">${pt.flame} CIVIC BUZZ</div>
          <h2 class="ck-section-heading">Civic issues,<br>but make it <span class="ck-text-accent">relatable.</span></h2>
          <p class="ck-section-sub">Citizens can share respectful, AI-assisted civic awareness content after moderator review.</p>

          <div class="ck-buzz-grid">
            <p class="ck-section-sub">No Buzz yet. Be the first to highlight an issue.</p>
          </div>

          <div class="ck-buzz-cta" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <p>These aren't just memes. These are real issues waiting to be fixed.</p>
            <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
              <a href="/meme/studio" class="ck-btn-hero" style="background:linear-gradient(135deg, #f59e0b, #ef4444); border:none; color:#fff;">
                Open Civic Buzz Studio
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
                <div class="ck-value-chip">${pt.target} Transparent</div>
                <div class="ck-value-chip">${pt.zap} AI-First</div>
                <div class="ck-value-chip">${pt.layers} No-Code</div>
                <div class="ck-value-chip">${pt.heartHand} Citizen-Centric</div>
                <div class="ck-value-chip">${pt.chart} Data-Driven</div>
                <div class="ck-value-chip">${pt.lock} Accountable</div>
              </div>
            </div>
            <div class="ck-about-visual">
              <div class="ck-about-card-stack">
                <div class="ck-acard ck-acard-1">
                  <div class="ck-acard-icon-box">${pt.database}</div>
                  <div>
                    <div class="ck-acard-text">20+ Database Tables</div>
                    <div class="ck-acard-sub">Powering civic intelligence</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-2">
                  <div class="ck-acard-icon-box">${pt.sparkles}</div>
                  <div>
                    <div class="ck-acard-text">Gemini AI Agent</div>
                    <div class="ck-acard-sub">Understands civic context</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-3">
                  <div class="ck-acard-icon-box">${pt.toolBox}</div>
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
          <span style="display:inline-flex; align-items:center; gap:6px;">Made with ${pt.heartFill} in India</span>
        </div>
      </footer>
    </div>
  `,vn("home"),Dl())}function Dl(){const i=document.getElementById("ck-home-header");i&&window.addEventListener("scroll",()=>{i.classList.toggle("scrolled",window.scrollY>40)},{passive:!0});const a=document.getElementById("ck-home-burger"),o=document.getElementById("ck-home-nav");a&&o&&a.addEventListener("click",()=>{o.classList.toggle("open"),a.classList.toggle("open")});const r=document.getElementById("ck-feature-tabs");r&&r.addEventListener("click",f=>{const v=f.target.closest(".ck-tab-btn");if(!v)return;const y=v.dataset.tab;r.querySelectorAll(".ck-tab-btn").forEach(b=>b.classList.remove("active")),r.querySelectorAll(".ck-tab-panel").forEach(b=>b.classList.remove("active")),v.classList.add("active");const _=document.getElementById(y);_&&_.classList.add("active")});const l=document.getElementById("ck-faq-list");l&&l.addEventListener("click",f=>{const v=f.target.closest(".ck-faq-q");if(!v)return;const y=v.closest(".ck-faq-item"),_=y.classList.contains("open");l.querySelectorAll(".ck-faq-item").forEach(b=>b.classList.remove("open")),_||y.classList.add("open")});const d=document.getElementById("ck-pupil-l"),u=document.getElementById("ck-pupil-r");d&&u&&document.addEventListener("mousemove",f=>{const v=y=>{const b=y.parentElement.getBoundingClientRect(),C=b.left+b.width/2,w=b.top+b.height/2,M=f.clientX-C,O=f.clientY-w,P=Math.atan2(O,M),V=b.width*.22,F=Math.min(Math.sqrt(M*M+O*O)*.15,V);y.style.transform=`translate(${Math.cos(P)*F}px, ${Math.sin(P)*F}px)`};v(d),v(u)},{passive:!0}),document.querySelectorAll('.ck-home a[href^="#"]').forEach(f=>{f.addEventListener("click",v=>{v.preventDefault();const y=document.querySelector(f.getAttribute("href"));if(y){y.scrollIntoView({behavior:"smooth",block:"start"});const _=document.getElementById("ck-home-nav"),b=document.getElementById("ck-home-burger");_&&_.classList.remove("open"),b&&b.classList.remove("open")}})});const p=f=>{f.forEach(v=>{v.isIntersecting&&v.target.classList.add("ck-visible")})},m=new IntersectionObserver(p,{threshold:.1,rootMargin:"0px 0px -60px 0px"});document.querySelectorAll(".ck-how-card, .ck-buzz-meme, .ck-about-text, .ck-about-visual, .ck-faq-item").forEach(f=>{m.observe(f)})}const Ss="/api";async function B(i,a,o=null,r={}){const d={method:i,headers:{"Content-Type":"application/json","X-Requested-With":"ck-web"},credentials:"include",...r};o!==null&&(d.body=JSON.stringify(o));const u=await fetch(`${Ss}${a}`,d);u.status===401&&(Ca(),window.dispatchEvent(new CustomEvent("auth:expired")));const p=await u.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!u.ok){const m=new Error(p.error||`HTTP ${u.status}`);throw m.status=u.status,m.data=p,m}return p}const gn={login:(i,a)=>B("POST","/auth/login",{email:i,password:a}),signup:(i,a,o)=>B("POST","/auth/signup",{name:i,email:a,password:o}),changePassword:(i,a)=>B("POST","/auth/change-password",{current_password:i,new_password:a}),me:()=>B("GET","/auth/me"),logout:()=>B("POST","/auth/logout")},Ms={listUsers:(i={})=>{const a=new URLSearchParams(i).toString();return B("GET",`/admin/users${a?"?"+a:""}`)},getUser:i=>B("GET",`/admin/users/${i}`),setRole:(i,a,o)=>B("POST",`/admin/users/${i}/role`,{role:a,assignedArea:o})},gt={list:(i={})=>{const a=new URLSearchParams(i).toString();return B("GET",`/entities${a?"?"+a:""}`)},listTypes:()=>B("GET","/entities/entity-types"),createType:i=>B("POST","/entities/entity-types",i),createRule:i=>B("POST","/entities/rules",i),get:i=>B("GET",`/entities/${i}`),create:i=>B("POST","/entities",i),update:(i,a)=>B("PUT",`/entities/${i}`,a),softDelete:i=>B("DELETE",`/entities/${i}`),transition:(i,a,o)=>B("POST",`/entities/${i}/transition`,{to_status:a,reason:o}),fireRules:(i,a)=>B("POST",`/entities/${i}/fire-rules`,{eventType:a}),aiAnalysis:i=>B("POST",`/entities/${i}/ai-analysis`),audit:i=>B("GET",`/entities/${i}/audit`),getLineage:i=>B("GET",`/entities/${i}/lineage`),workflow:i=>B("GET",`/entities/${i}/workflow`),nearby:(i,a,o=10)=>B("GET",`/entities/nearby?lat=${encodeURIComponent(i)}&lng=${encodeURIComponent(a)}&radius_km=${encodeURIComponent(o)}`)},$s={list:i=>B("GET",`/entities/${i}/values`),create:(i,a)=>B("POST",`/entities/${i}/values`,{values:a}),upsert:(i,a)=>B("PUT",`/entities/${i}/values`,{values:a})},Ta={getMetadata:()=>B("GET","/forms/metadata"),schema:i=>B("GET",`/forms/${i}/schema`),create:i=>B("POST","/forms",i),addSection:(i,a)=>B("POST",`/forms/${i}/sections`,a),addSubsection:(i,a)=>B("POST",`/sections/${i}/subsections`,a),addParameter:(i,a)=>B("POST",`/subsections/${i}/parameters`,a)},yn={list:(i={})=>{const a=new URLSearchParams(i).toString();return B("GET",`/reports${a?"?"+a:""}`)},get:i=>B("GET",`/reports/${i}`),create:i=>B("POST","/reports",i),execute:(i,a={})=>{const o=new URLSearchParams(a).toString();return B("GET",`/reports/${i}/execute${o?"?"+o:""}`)}},Fl={validate:i=>B("POST","/module-builder/validate",i),deploy:i=>B("POST","/module-builder/deploy",i)},an={list:(i={})=>{const a=new URLSearchParams(i).toString();return B("GET",`/jurisdictions${a?"?"+a:""}`)},tree:()=>B("GET","/jurisdictions?tree=true"),get:i=>B("GET",`/jurisdictions/${i}`),create:i=>B("POST","/jurisdictions",i),update:(i,a)=>B("PUT",`/jurisdictions/${i}`,a),deactivate:i=>B("DELETE",`/jurisdictions/${i}`)},ql={getConfig:()=>B("GET","/governance/config"),analyze:i=>B("POST","/governance/analyze",i?{entity_type_id:i}:{})},on={chat:async(i,a,o=null)=>{if(!o)return B("POST","/agent/chat",{sessionId:i,message:a});const r=new FormData;r.append("sessionId",i),r.append("message",a||""),r.append("attachment",o);const l={"X-Requested-With":"ck-web"},d=await fetch(`${Ss}/agent/chat`,{method:"POST",headers:l,credentials:"include",body:r});d.status===401&&(Ca(),window.dispatchEvent(new CustomEvent("auth:expired")));const u=await d.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!d.ok){const p=new Error(u.error||`HTTP ${d.status}`);throw p.status=d.status,p.data=u,p}return u},clearSession:i=>B("DELETE",`/agent/chat/${i}`).catch(()=>{})},mt={list:(i={})=>{const a=new URLSearchParams(i).toString();return B("GET",`/buzz${a?"?"+a:""}`)},get:i=>B("GET",`/buzz/${i}`),create:i=>B("POST","/buzz",i),update:(i,a)=>B("PATCH",`/buzz/${i}`,a),vote:i=>B("POST",`/buzz/${i}/vote`),follow:i=>B("POST",`/buzz/${i}/follow`),getComments:(i,a={})=>{const o=new URLSearchParams(a).toString();return B("GET",`/buzz/${i}/comments${o?"?"+o:""}`)},addComment:(i,a)=>B("POST",`/buzz/${i}/comments`,{text:a}),logEvent:(i,a)=>B("POST",`/buzz/${i}/event`,{type:a}),getStats:i=>B("GET",`/buzz/${i}/stats`),generateCaptions:i=>B("POST","/buzz/captions",i),uploadImage:i=>B("POST","/buzz/upload-image",{image_data:i}),report:(i,a)=>B("POST",`/buzz/${i}/report`,{reason:a})};let Ul=0;function Pi(i,a="default",o=3500){const r=document.getElementById("toast-container"),l=++Ul,d=document.createElement("div");return d.className=`toast toast-${a}`,d.id=`toast-${l}`,d.innerHTML=`
    <span>${Vl(i)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `,r.appendChild(d),setTimeout(()=>{d.remove()},o),l}function Zl(i){return Pi(i,"default")}function xt(i){return Pi(i,"success")}function Q(i){return Pi(i,"error")}function ue(i){return Pi(i,"warning")}function Vl(i){return String(i).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const Wl=Object.freeze(Object.defineProperty({__proto__:null,showToast:Pi,toast:Zl,toastError:Q,toastSuccess:xt,toastWarning:ue},Symbol.toStringTag,{value:"Module"}));function Yo(i,a="/dashboard"){const o=i&&i.get("redirect");return typeof o=="string"&&o.startsWith("/")&&!o.startsWith("//")&&!o.startsWith("/\\")&&!o.includes("://")&&!o.toLowerCase().includes("javascript:")&&!/[\x00-\x1F\x7F]/.test(o)?o:a}function Gl(i,a){if(mn()){X(Yo(a));return}const o=document.getElementById("app");o.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <a href="/" style="font-size:0.8125rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
          </a>
          ${fn({idPrefix:"login"})}
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
  `;const r=document.getElementById("password"),l=document.getElementById("toggle-password-btn"),d='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',u='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>';l&&r&&l.addEventListener("click",()=>{const m=r.getAttribute("type")==="password"?"text":"password";r.setAttribute("type",m),l.setAttribute("aria-label",m==="password"?"Show password":"Hide password"),l.innerHTML=m==="password"?d:u});const p=document.getElementById("login-error-alert");document.getElementById("login-form").addEventListener("submit",async m=>{m.preventDefault(),p&&(p.classList.add("hidden"),p.textContent="");const f=document.getElementById("login-btn"),v=document.getElementById("email").value.trim(),y=r.value;if(!v||!y){p&&(p.textContent="Please enter both email address and password.",p.classList.remove("hidden"));return}f.disabled=!0,f.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';try{const _=await gn.login(v,y);zs(_.data),X(Yo(a))}catch(_){const b=_.message||"Invalid email or password. Please check your credentials.";p&&(p.textContent=b,p.classList.remove("hidden")),Q(b),f.disabled=!1,f.innerHTML="Sign In"}}),vn("login")}function Xo(i,a="/dashboard"){const o=i&&i.get("redirect");return typeof o=="string"&&o.startsWith("/")&&!o.startsWith("//")&&!o.startsWith("/\\")&&!o.includes("://")&&!o.toLowerCase().includes("javascript:")&&!/[\x00-\x1F\x7F]/.test(o)?o:a}function Kl(i,a){if(mn()){X(Xo(a));return}const o=document.getElementById("app");o.innerHTML=`
    <div class="auth-layout">
      <div class="auth-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <a href="/" style="font-size:0.8125rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
          </a>
          ${fn({idPrefix:"signup"})}
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
  `,document.getElementById("signup-form").addEventListener("submit",async r=>{r.preventDefault();const l=document.getElementById("signup-btn"),d=document.getElementById("name").value.trim(),u=document.getElementById("email").value.trim(),p=document.getElementById("password").value;if(!(!d||!u||!p)){l.disabled=!0,l.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';try{const m=await gn.signup(d,u,p);zs(m.data),X(Xo(a))}catch(m){Q(m.message||"Signup failed"),l.disabled=!1,l.innerHTML="Create Account"}}}),vn("signup")}const va={initiative:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",grievance:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",park:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",passport:"M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",charter:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",employment:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",volunteer:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",legacy:"M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",feedback:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",survey:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",default:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},Is={"🌱":"initiative","🚨":"grievance","⚠️":"grievance","🪪":"passport","📜":"charter","💼":"employment","🤝":"volunteer","🏛️":"legacy","🏛":"legacy","💬":"feedback","📢":"feedback","📊":"survey","📋":"survey","🌳":"park","🏞️":"park","🏞":"park","🏗️":"legacy","🏗":"legacy","🛡️":"charter","🛡":"charter","⚡":"default","⚡️":"default"};function Le(i,a=20,o=""){const r=Is[i]||i,l=va[r]||va.default;return`<svg width="${a}" height="${a}" class="${o}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${l}"/></svg>`}const Jl={Movement:{title:"Start a Civic Initiative",shortTitle:"Civic Initiative",description:"Organize citizens around community goals, public spaces, and urban projects.",category:"Community Action",iconKey:"initiative",actionLabel:"Start Initiative"},Grievance:{title:"Report a Civic Problem",shortTitle:"Civic Problem",description:"Report infrastructure defects, sanitation issues, or public safety concerns.",category:"Public Services",iconKey:"grievance",actionLabel:"Report Issue"},"Park Renovation Request":{title:"Park Renovation Request",shortTitle:"Park Renovation",description:"Propose public park upgrades, playground repairs, or green space restoration.",category:"Urban Infrastructure",iconKey:"park",actionLabel:"Request Renovation"},"Citizen Passport":{title:"Citizen Passport & Contribution",shortTitle:"Citizen Passport",description:"Track community contributions, volunteer hours, and civic engagement history.",category:"Civic Identity",iconKey:"passport",actionLabel:"Update Passport"},"Digital Civic Constitution":{title:"Civic Charter & Guidelines",shortTitle:"Civic Charter",description:"Establish community guidelines, governance rules, and transparency terms.",category:"Governance",iconKey:"charter",actionLabel:"Draft Charter"},"Employment Exchange":{title:"Civic Skills & Employment",shortTitle:"Employment Exchange",description:"Post and discover civic project roles, community jobs, and skill opportunities.",category:"Opportunity",iconKey:"employment",actionLabel:"Post Role"},"Volunteer Management":{title:"Volunteer Operations",shortTitle:"Volunteer Drive",description:"Coordinate volunteer tasks, register community helpers, and track activities.",category:"Community Action",iconKey:"volunteer",actionLabel:"Register Volunteer"},"Legacy & Continuity":{title:"Project Continuity & Legacy",shortTitle:"Project Continuity",description:"Transition completed initiatives into permanent NGOs, startups, or civic centers.",category:"Governance",iconKey:"legacy",actionLabel:"Plan Continuity"},"Public Feedback":{title:"Public Feedback",shortTitle:"Public Feedback",description:"Collect structured community feedback on civic initiatives and public services.",category:"Civic Operations",iconKey:"feedback",actionLabel:"Submit Feedback"},"Public Survey":{title:"Public Survey",shortTitle:"Public Survey",description:"Run community surveys and opinion polls for civic decision-making.",category:"Civic Operations",iconKey:"survey",actionLabel:"Start Survey"}};function pe(i){var l;if(!i)return{title:"Civic Capability",shortTitle:"Capability",description:"Metadata-driven civic module.",category:"Civic Operations",iconKey:"default",icon:Le("default",16),iconLarge:Le("default",24),actionLabel:"Start Action"};const a=i.name||"",o=Jl[a];if(o)return{title:o.title,shortTitle:o.shortTitle,description:i.description||o.description,category:o.category,iconKey:o.iconKey,icon:Le(o.iconKey,16),iconLarge:Le(o.iconKey,24),actionLabel:o.actionLabel,rawName:a};const r=i.icon&&Is[i.icon]||(i.icon&&va[i.icon]?i.icon:null)||"default";return{title:a,shortTitle:a,description:i.description||"Metadata-configured civic capability module.",category:((l=i.domain)==null?void 0:l.domain_name)||"Civic Operations",iconKey:r,icon:Le(r,16),iconLarge:Le(r,24),actionLabel:`Start ${a}`,rawName:a}}function Oe(i){if(!i)return"Unknown";switch(i.toLowerCase()){case"draft":return"Draft (Unsubmitted)";case"submitted":return"Submitted (Awaiting Review)";case"coordinator_approved":return"Verified (Pending Approval)";case"verified":return"Verified";case"approved":return"Approved & Active";case"rejected":return"Rejected";case"closed":return"Closed";default:return i.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase())}}function kt(i,a="",o=[]){const r=qt(),l=hn();if(!r)return i;const d=window.location.pathname,u=window.location.search;let p=[],m="CIVIC CAPABILITIES";l==="citizen"?p=[{path:"/dashboard",label:"Home",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/nearby",label:"Nearby Activities & Map",icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"},{path:"/agent/chat?message=I+want+to+report+a+problem",label:"Report a Problem",icon:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"},{path:"/agent/chat?message=I+want+to+start+an+initiative",label:"Start an Initiative",icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"},{path:"/agent/chat?message=I+want+to+contribute+or+volunteer",label:"Contribute / Volunteer",icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"},{path:"/agent/chat?message=I+want+to+understand+a+civic+issue",label:"Understand an Issue",icon:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"},{path:"/entities",label:"My Civic Activity",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"}]:l==="coordinator_area"||l==="coordinator_general"?(p=[{path:"/dashboard",label:"Operations Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"Cases Queue",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],m="ACTIVE CAPABILITIES"):l==="director"?(p=[{path:"/dashboard",label:"Governance Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/entities",label:"All Operations",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/module-builder",label:"Capability Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],m="ACTIVE CAPABILITIES"):(p=[{path:"/dashboard",label:"Civic OS Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/modules",label:"Modules & Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/module-builder",label:"No-Code Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/entities",label:"All Cases & Records",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},{path:"/admin",label:"User & Role Admin",icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"}],m="CAPABILITY METADATA");const f=_=>_.map(b=>`
    <li class="sidebar-nav-item">
      <a href="${b.path}" class="sidebar-nav-link ${d===b.path&&!u?"active":""}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${b.icon}"></path></svg>
        ${te(b.label)}
      </a>
    </li>
  `).join("");let v="";l!=="citizen"&&Array.isArray(o)&&o.length>0&&(v=o.map(_=>{var M;const b=pe(_),C=`/entities?entity_type_id=${_.entity_type_id}`,w=u.includes(`entity_type_id=${_.entity_type_id}`);return`
        <li class="sidebar-nav-item">
          <a href="${C}" class="sidebar-nav-link ${w?"active":""}" style="font-size:13px; padding:6px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${Le(b.iconKey,16)}
            </span>
            <span class="truncate" style="flex:1;">${te(b.shortTitle)}</span>
            ${((M=_._count)==null?void 0:M.entities)!==void 0?`<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${_._count.entities}</span>`:""}
          </a>
        </li>
      `}).join(""));const y=l==="coordinator_area"&&r.assignedArea?`${Li(l)} • ${r.assignedArea}`:Li(l);return`
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>
        
        <div class="sidebar-section">
          <div class="sidebar-group-title">NAVIGATION</div>
          <ul class="sidebar-nav">
            ${f(p)}
          </ul>
        </div>

        ${v?`
          <div class="sidebar-section mt-4">
            <div class="sidebar-group-title">${m}</div>
            <ul class="sidebar-nav">
              ${v}
            </ul>
          </div>
        `:""}
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-card" style="cursor:pointer;">
            <div class="user-avatar">${te(r.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${te(r.name)}</div>
              <div class="user-role truncate" title="${te(y)}">${te(y)}</div>
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
              <span style="font-weight:600; color:var(--text-primary);">${te(a)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- Language Selector -->
            ${fn({idPrefix:"topbar"})}

            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${te(r.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary);">${te(r.name.split(" ")[0])}</span>
                  <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${te(Li(l))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${te(r.name)}</div>
                  <div class="user-dropdown-role">${te(Li(l))}</div>
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
          ${i}
        </div>
      </main>
    </div>
  `}function zt(){Il().catch(()=>{}),vn("topbar");const i=document.getElementById("topbar-user-btn"),a=document.getElementById("user-dropdown-menu");i&&a&&(i.addEventListener("click",u=>{u.stopPropagation(),a.classList.toggle("show")}),document.addEventListener("click",u=>{!a.contains(u.target)&&!i.contains(u.target)&&a.classList.remove("show")}));const o=document.getElementById("dropdown-logout-btn");o&&o.addEventListener("click",async u=>{u.preventDefault();try{await gn.logout()}catch(p){console.warn("Logout warning:",p)}Ca(),X("/login")});const r=document.getElementById("sidebar-user-card");r&&r.addEventListener("click",()=>{X("/profile")});const l=document.getElementById("mobile-menu-btn"),d=document.getElementById("sidebar");l&&d&&l.addEventListener("click",()=>{d.classList.toggle("open")})}function te(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Yl(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function bn(i){var d,u,p,m;if(!i||!i.id)return;mt.logEvent(i.id,"share").catch(()=>{});const a=document.getElementById("ck-buzz-share-dialog-root");a&&a.remove();const o=`${window.location.origin}/buzz/${i.id}`,r=document.createElement("div");r.id="ck-buzz-share-dialog-root",r.className="ck-buzz-modal-backdrop",r.innerHTML=`
    <div class="ck-buzz-share-dialog" role="dialog" aria-modal="true">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.2rem;">↗</span>
          <span style="font-weight:800; font-size:1rem; color:#0f172a;">Share Civic Buzz</span>
        </div>
        <button type="button" class="ck-buzz-close-btn" id="ck-share-close-btn" aria-label="Close">✕</button>
      </div>

      <div style="font-size:0.8rem; color:#64748b; margin-top:-4px;">
        Spread civic accountability to your community and social circles.
      </div>

      <!-- Action 1: Download Image -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-download-btn">
        <span style="font-size:1.2rem;">🖼</span>
        <div style="text-align:left;">
          <div>Download Card Image</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">Save high-res PNG to your device</div>
        </div>
      </button>

      <!-- Action 2: Copy Link -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-copy-btn">
        <span style="font-size:1.2rem;">🔗</span>
        <div style="text-align:left;">
          <div>Copy Link</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">${Yl(o)}</div>
        </div>
      </button>

      <!-- Action 3: Web Share -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-web-btn">
        <span style="font-size:1.2rem;">📱</span>
        <div style="text-align:left;">
          <div>Web Share</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">Share to WhatsApp, X, or other apps</div>
        </div>
      </button>
    </div>
  `,document.body.appendChild(r);const l=()=>r.remove();r.addEventListener("click",f=>{f.target===r&&l()}),(d=r.querySelector("#ck-share-close-btn"))==null||d.addEventListener("click",l),(u=r.querySelector("#ck-share-download-btn"))==null||u.addEventListener("click",async()=>{try{mt.logEvent(i.id,"share").catch(()=>{});const f=i.image_url;if(!f){ue("Post does not have an attached rendered image.");return}const y=await(await fetch(f)).blob(),_=URL.createObjectURL(y),b=document.createElement("a");b.href=_,b.download=`civic-buzz-post-${i.id}.png`,document.body.appendChild(b),b.click(),b.remove(),URL.revokeObjectURL(_),xt("Card image downloaded!"),l()}catch{const f=document.createElement("a");f.href=i.image_url,f.target="_blank",f.download=`civic-buzz-post-${i.id}.png`,document.body.appendChild(f),f.click(),f.remove(),xt("Downloading card image..."),l()}}),(p=r.querySelector("#ck-share-copy-btn"))==null||p.addEventListener("click",async()=>{try{mt.logEvent(i.id,"share").catch(()=>{}),await navigator.clipboard.writeText(o),xt("Link copied to clipboard!"),l()}catch{window.prompt("Copy this Civic Buzz link:",o),l()}}),(m=r.querySelector("#ck-share-web-btn"))==null||m.addEventListener("click",async()=>{if(mt.logEvent(i.id,"share").catch(()=>{}),navigator.share)try{await navigator.share({title:`CIVIC BUZZ 🔥: ${i.linked_title||"Civic Issue"}`,text:`"${i.caption}" — Check this civic conversation on CIVIC-KALKI:`,url:o}),xt("Shared successfully!"),l()}catch(v){v.name!=="AbortError"&&f()}else{const v=encodeURIComponent(`CIVIC BUZZ 🔥: "${i.caption}"
${o}`);window.open(`https://api.whatsapp.com/send?text=${v}`,"_blank"),l()}function f(){navigator.clipboard.writeText(o).then(()=>{xt("Link copied to clipboard!")}),l()}})}function Xl(i,a){if(i.match(/^[a-z]+:\/\//i))return i;if(i.match(/^\/\//))return window.location.protocol+i;if(i.match(/^[a-z]+:/i))return i;const o=document.implementation.createHTMLDocument(),r=o.createElement("base"),l=o.createElement("a");return o.head.appendChild(r),o.body.appendChild(l),a&&(r.href=a),l.href=i,l.href}const Ql=(()=>{let i=0;const a=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(i+=1,`u${a()}${i}`)})();function Ee(i){const a=[];for(let o=0,r=i.length;o<r;o++)a.push(i[o]);return a}let Ke=null;function Ps(i={}){return Ke||(i.includeStyleProperties?(Ke=i.includeStyleProperties,Ke):(Ke=Ee(window.getComputedStyle(document.documentElement)),Ke))}function sn(i,a){const r=(i.ownerDocument.defaultView||window).getComputedStyle(i).getPropertyValue(a);return r?parseFloat(r.replace("px","")):0}function tc(i){const a=sn(i,"border-left-width"),o=sn(i,"border-right-width");return i.clientWidth+a+o}function ec(i){const a=sn(i,"border-top-width"),o=sn(i,"border-bottom-width");return i.clientHeight+a+o}function As(i,a={}){const o=a.width||tc(i),r=a.height||ec(i);return{width:o,height:r}}function ic(){let i,a;try{a=process}catch{}const o=a&&a.env?a.env.devicePixelRatio:null;return o&&(i=parseInt(o,10),Number.isNaN(i)&&(i=1)),i||window.devicePixelRatio||1}const Zt=16384;function nc(i){(i.width>Zt||i.height>Zt)&&(i.width>Zt&&i.height>Zt?i.width>i.height?(i.height*=Zt/i.width,i.width=Zt):(i.width*=Zt/i.height,i.height=Zt):i.width>Zt?(i.height*=Zt/i.width,i.width=Zt):(i.width*=Zt/i.height,i.height=Zt))}function rn(i){return new Promise((a,o)=>{const r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>a(r))})},r.onerror=o,r.crossOrigin="anonymous",r.decoding="async",r.src=i})}async function ac(i){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(i)).then(encodeURIComponent).then(a=>`data:image/svg+xml;charset=utf-8,${a}`)}async function oc(i,a,o){const r="http://www.w3.org/2000/svg",l=document.createElementNS(r,"svg"),d=document.createElementNS(r,"foreignObject");return l.setAttribute("width",`${a}`),l.setAttribute("height",`${o}`),l.setAttribute("viewBox",`0 0 ${a} ${o}`),d.setAttribute("width","100%"),d.setAttribute("height","100%"),d.setAttribute("x","0"),d.setAttribute("y","0"),d.setAttribute("externalResourcesRequired","true"),l.appendChild(d),d.appendChild(i),ac(l)}const Ut=(i,a)=>{if(i instanceof a)return!0;const o=Object.getPrototypeOf(i);return o===null?!1:o.constructor.name===a.name||Ut(o,a)};function sc(i){const a=i.getPropertyValue("content");return`${i.cssText} content: '${a.replace(/'|"/g,"")}';`}function rc(i,a){return Ps(a).map(o=>{const r=i.getPropertyValue(o),l=i.getPropertyPriority(o);return`${o}: ${r}${l?" !important":""};`}).join(" ")}function lc(i,a,o,r){const l=`.${i}:${a}`,d=o.cssText?sc(o):rc(o,r);return document.createTextNode(`${l}{${d}}`)}function Qo(i,a,o,r){const l=window.getComputedStyle(i,o),d=l.getPropertyValue("content");if(d===""||d==="none")return;const u=Ql();try{a.className=`${a.className} ${u}`}catch{return}const p=document.createElement("style");p.appendChild(lc(u,o,l,r)),a.appendChild(p)}function cc(i,a,o){Qo(i,a,":before",o),Qo(i,a,":after",o)}const ts="application/font-woff",es="image/jpeg",dc={woff:ts,woff2:ts,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:es,jpeg:es,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function uc(i){const a=/\.([^./]*?)$/g.exec(i);return a?a[1]:""}function Sa(i){const a=uc(i).toLowerCase();return dc[a]||""}function pc(i){return i.split(/,/)[1]}function ga(i){return i.search(/^(data:)/)!==-1}function hc(i,a){return`data:${a};base64,${i}`}async function Bs(i,a,o){const r=await fetch(i,a);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);const l=await r.blob();return new Promise((d,u)=>{const p=new FileReader;p.onerror=u,p.onloadend=()=>{try{d(o({res:r,result:p.result}))}catch(m){u(m)}},p.readAsDataURL(l)})}const sa={};function mc(i,a,o){let r=i.replace(/\?.*/,"");return o&&(r=i),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),a?`[${a}]${r}`:r}async function Ma(i,a,o){const r=mc(i,a,o.includeQueryParams);if(sa[r]!=null)return sa[r];o.cacheBust&&(i+=(/\?/.test(i)?"&":"?")+new Date().getTime());let l;try{const d=await Bs(i,o.fetchRequestInit,({res:u,result:p})=>(a||(a=u.headers.get("Content-Type")||""),pc(p)));l=hc(d,a)}catch(d){l=o.imagePlaceholder||"";let u=`Failed to fetch resource: ${i}`;d&&(u=typeof d=="string"?d:d.message),u&&console.warn(u)}return sa[r]=l,l}async function fc(i){const a=i.toDataURL();return a==="data:,"?i.cloneNode(!1):rn(a)}async function vc(i,a){if(i.currentSrc){const d=document.createElement("canvas"),u=d.getContext("2d");d.width=i.clientWidth,d.height=i.clientHeight,u==null||u.drawImage(i,0,0,d.width,d.height);const p=d.toDataURL();return rn(p)}const o=i.poster,r=Sa(o),l=await Ma(o,r,a);return rn(l)}async function gc(i,a){var o;try{if(!((o=i==null?void 0:i.contentDocument)===null||o===void 0)&&o.body)return await xn(i.contentDocument.body,a,!0)}catch{}return i.cloneNode(!1)}async function yc(i,a){return Ut(i,HTMLCanvasElement)?fc(i):Ut(i,HTMLVideoElement)?vc(i,a):Ut(i,HTMLIFrameElement)?gc(i,a):i.cloneNode(Rs(i))}const bc=i=>i.tagName!=null&&i.tagName.toUpperCase()==="SLOT",Rs=i=>i.tagName!=null&&i.tagName.toUpperCase()==="SVG";async function xc(i,a,o){var r,l;if(Rs(a))return a;let d=[];return bc(i)&&i.assignedNodes?d=Ee(i.assignedNodes()):Ut(i,HTMLIFrameElement)&&(!((r=i.contentDocument)===null||r===void 0)&&r.body)?d=Ee(i.contentDocument.body.childNodes):d=Ee(((l=i.shadowRoot)!==null&&l!==void 0?l:i).childNodes),d.length===0||Ut(i,HTMLVideoElement)||await d.reduce((u,p)=>u.then(()=>xn(p,o)).then(m=>{m&&a.appendChild(m)}),Promise.resolve()),a}function _c(i,a,o){const r=a.style;if(!r)return;const l=window.getComputedStyle(i);l.cssText?(r.cssText=l.cssText,r.transformOrigin=l.transformOrigin):Ps(o).forEach(d=>{let u=l.getPropertyValue(d);d==="font-size"&&u.endsWith("px")&&(u=`${Math.floor(parseFloat(u.substring(0,u.length-2)))-.1}px`),Ut(i,HTMLIFrameElement)&&d==="display"&&u==="inline"&&(u="block"),d==="d"&&a.getAttribute("d")&&(u=`path(${a.getAttribute("d")})`),r.setProperty(d,u,l.getPropertyPriority(d))})}function wc(i,a){Ut(i,HTMLTextAreaElement)&&(a.innerHTML=i.value),Ut(i,HTMLInputElement)&&a.setAttribute("value",i.value)}function kc(i,a){if(Ut(i,HTMLSelectElement)){const o=a,r=Array.from(o.children).find(l=>i.value===l.getAttribute("value"));r&&r.setAttribute("selected","")}}function zc(i,a,o){return Ut(a,Element)&&(_c(i,a,o),cc(i,a,o),wc(i,a),kc(i,a)),a}async function Lc(i,a){const o=i.querySelectorAll?i.querySelectorAll("use"):[];if(o.length===0)return i;const r={};for(let d=0;d<o.length;d++){const p=o[d].getAttribute("xlink:href");if(p){const m=i.querySelector(p),f=document.querySelector(p);!m&&f&&!r[p]&&(r[p]=await xn(f,a,!0))}}const l=Object.values(r);if(l.length){const d="http://www.w3.org/1999/xhtml",u=document.createElementNS(d,"svg");u.setAttribute("xmlns",d),u.style.position="absolute",u.style.width="0",u.style.height="0",u.style.overflow="hidden",u.style.display="none";const p=document.createElementNS(d,"defs");u.appendChild(p);for(let m=0;m<l.length;m++)p.appendChild(l[m]);i.appendChild(u)}return i}async function xn(i,a,o){return!o&&a.filter&&!a.filter(i)?null:Promise.resolve(i).then(r=>yc(r,a)).then(r=>xc(i,r,a)).then(r=>zc(i,r,a)).then(r=>Lc(r,a))}const Os=/url\((['"]?)([^'"]+?)\1\)/g,Cc=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Ec=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Tc(i){const a=i.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${a})(['"]?\\))`,"g")}function Sc(i){const a=[];return i.replace(Os,(o,r,l)=>(a.push(l),o)),a.filter(o=>!ga(o))}async function Mc(i,a,o,r,l){try{const d=o?Xl(a,o):a,u=Sa(a);let p;return l||(p=await Ma(d,u,r)),i.replace(Tc(a),`$1${p}$3`)}catch{}return i}function $c(i,{preferredFontFormat:a}){return a?i.replace(Ec,o=>{for(;;){const[r,,l]=Cc.exec(o)||[];if(!l)return"";if(l===a)return`src: ${r};`}}):i}function Hs(i){return i.search(Os)!==-1}async function Ns(i,a,o){if(!Hs(i))return i;const r=$c(i,o);return Sc(r).reduce((d,u)=>d.then(p=>Mc(p,u,a,o)),Promise.resolve(r))}async function Je(i,a,o){var r;const l=(r=a.style)===null||r===void 0?void 0:r.getPropertyValue(i);if(l){const d=await Ns(l,null,o);return a.style.setProperty(i,d,a.style.getPropertyPriority(i)),!0}return!1}async function Ic(i,a){await Je("background",i,a)||await Je("background-image",i,a),await Je("mask",i,a)||await Je("-webkit-mask",i,a)||await Je("mask-image",i,a)||await Je("-webkit-mask-image",i,a)}async function Pc(i,a){const o=Ut(i,HTMLImageElement);if(!(o&&!ga(i.src))&&!(Ut(i,SVGImageElement)&&!ga(i.href.baseVal)))return;const r=o?i.src:i.href.baseVal,l=await Ma(r,Sa(r),a);await new Promise((d,u)=>{i.onload=d,i.onerror=a.onImageErrorHandler?(...m)=>{try{d(a.onImageErrorHandler(...m))}catch(f){u(f)}}:u;const p=i;p.decode&&(p.decode=d),p.loading==="lazy"&&(p.loading="eager"),o?(i.srcset="",i.src=l):i.href.baseVal=l})}async function Ac(i,a){const r=Ee(i.childNodes).map(l=>js(l,a));await Promise.all(r).then(()=>i)}async function js(i,a){Ut(i,Element)&&(await Ic(i,a),await Pc(i,a),await Ac(i,a))}function Bc(i,a){const{style:o}=i;a.backgroundColor&&(o.backgroundColor=a.backgroundColor),a.width&&(o.width=`${a.width}px`),a.height&&(o.height=`${a.height}px`);const r=a.style;return r!=null&&Object.keys(r).forEach(l=>{o[l]=r[l]}),i}const is={};async function ns(i){let a=is[i];if(a!=null)return a;const r=await(await fetch(i)).text();return a={url:i,cssText:r},is[i]=a,a}async function as(i,a){let o=i.cssText;const r=/url\(["']?([^"')]+)["']?\)/g,d=(o.match(/url\([^)]+\)/g)||[]).map(async u=>{let p=u.replace(r,"$1");return p.startsWith("https://")||(p=new URL(p,i.url).href),Bs(p,a.fetchRequestInit,({result:m})=>(o=o.replace(u,`url(${m})`),[u,m]))});return Promise.all(d).then(()=>o)}function os(i){if(i==null)return[];const a=[],o=/(\/\*[\s\S]*?\*\/)/gi;let r=i.replace(o,"");const l=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){const m=l.exec(r);if(m===null)break;a.push(m[0])}r=r.replace(l,"");const d=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,u="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",p=new RegExp(u,"gi");for(;;){let m=d.exec(r);if(m===null){if(m=p.exec(r),m===null)break;d.lastIndex=p.lastIndex}else p.lastIndex=d.lastIndex;a.push(m[0])}return a}async function Rc(i,a){const o=[],r=[];return i.forEach(l=>{if("cssRules"in l)try{Ee(l.cssRules||[]).forEach((d,u)=>{if(d.type===CSSRule.IMPORT_RULE){let p=u+1;const m=d.href,f=ns(m).then(v=>as(v,a)).then(v=>os(v).forEach(y=>{try{l.insertRule(y,y.startsWith("@import")?p+=1:l.cssRules.length)}catch(_){console.error("Error inserting rule from remote css",{rule:y,error:_})}})).catch(v=>{console.error("Error loading remote css",v.toString())});r.push(f)}})}catch(d){const u=i.find(p=>p.href==null)||document.styleSheets[0];l.href!=null&&r.push(ns(l.href).then(p=>as(p,a)).then(p=>os(p).forEach(m=>{u.insertRule(m,u.cssRules.length)})).catch(p=>{console.error("Error loading remote stylesheet",p)})),console.error("Error inlining remote css file",d)}}),Promise.all(r).then(()=>(i.forEach(l=>{if("cssRules"in l)try{Ee(l.cssRules||[]).forEach(d=>{o.push(d)})}catch(d){console.error(`Error while reading CSS rules from ${l.href}`,d)}}),o))}function Oc(i){return i.filter(a=>a.type===CSSRule.FONT_FACE_RULE).filter(a=>Hs(a.style.getPropertyValue("src")))}async function Hc(i,a){if(i.ownerDocument==null)throw new Error("Provided element is not within a Document");const o=Ee(i.ownerDocument.styleSheets),r=await Rc(o,a);return Oc(r)}function Ds(i){return i.trim().replace(/["']/g,"")}function Nc(i){const a=new Set;function o(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(d=>{a.add(Ds(d))}),Array.from(r.children).forEach(d=>{d instanceof HTMLElement&&o(d)})}return o(i),a}async function jc(i,a){const o=await Hc(i,a),r=Nc(i);return(await Promise.all(o.filter(d=>r.has(Ds(d.style.fontFamily))).map(d=>{const u=d.parentStyleSheet?d.parentStyleSheet.href:null;return Ns(d.cssText,u,a)}))).join(`
`)}async function Dc(i,a){const o=a.fontEmbedCSS!=null?a.fontEmbedCSS:a.skipFonts?null:await jc(i,a);if(o){const r=document.createElement("style"),l=document.createTextNode(o);r.appendChild(l),i.firstChild?i.insertBefore(r,i.firstChild):i.appendChild(r)}}async function Fc(i,a={}){const{width:o,height:r}=As(i,a),l=await xn(i,a,!0);return await Dc(l,a),await js(l,a),Bc(l,a),await oc(l,o,r)}async function qc(i,a={}){const{width:o,height:r}=As(i,a),l=await Fc(i,a),d=await rn(l),u=document.createElement("canvas"),p=u.getContext("2d"),m=a.pixelRatio||ic(),f=a.canvasWidth||o,v=a.canvasHeight||r;return u.width=f*m,u.height=v*m,a.skipAutoScale||nc(u),u.style.width=`${f}`,u.style.height=`${v}`,a.backgroundColor&&(p.fillStyle=a.backgroundColor,p.fillRect(0,0,u.width,u.height)),p.drawImage(d,0,0,u.width,u.height),u}async function Uc(i,a={}){return(await qc(i,a)).toDataURL()}function Ct(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const ln='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%231e293b"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20 L40 20 M20 0 L20 40" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern></defs><rect width="800" height="800" fill="url(%23g)"/><rect width="800" height="800" fill="url(%23p)"/><circle cx="400" cy="400" r="260" fill="none" stroke="rgba(255,90,54,0.15)" stroke-width="3" stroke-dasharray="8 8"/><text x="400" y="415" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="32" fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="4">CIVIC KALKI</text></svg>';function Zc(i=""){const a=String(i).trim();if(!a)return{top:"",bottom:""};if(a.includes(`
`)){const d=a.split(`
`).filter(Boolean);return{top:d[0]||"",bottom:d.slice(1).join(" ")||""}}if(a.includes(" // ")){const[d,...u]=a.split(" // ");return{top:d,bottom:u.join(" // ")}}const o=a.split(new RegExp("(?<=[.?!])\\s+"));if(o.length>=2)return{top:o[0],bottom:o.slice(1).join(" ")};const r=a.split(/\s+/);if(r.length<=4)return{top:"",bottom:a};const l=Math.ceil(r.length/2);return{top:r.slice(0,l).join(" "),bottom:r.slice(l).join(" ")}}function Fs({template:i="meme",style:a="funny",caption:o="",cta_text:r="",issue:l={},imageUrl:d=null}){const u=d||l.image_url||ln,p=l.name||l.title||"Civic Issue",m=l.area||"City Ward",f=l.status||"Active",v=l.entity_id||l.id||"—";i==="initiative"||l.entity_type_id===2||l.type;const y=`
    <div class="ck-card-watermark">
      <span class="ck-wm-flame">🔥</span>
      <span class="ck-wm-brand">CIVIC-KALKI</span>
    </div>
  `;if(i==="meme"){const{top:b,bottom:C}=Zc(o),w=r||"Take Civic Action";return`
      <div class="ck-card-canvas ck-template-meme" data-template="meme" data-style="${Ct(a)}">
        <div class="ck-card-bg-layer" style="background-image: url('${Ct(u)}');"></div>
        <div class="ck-card-meme-overlay"></div>
        
        ${y}

        <div class="ck-meme-top-bar">
          <span class="ck-meme-issue-tag">📍 ${Ct(m)} · #${Ct(v)}</span>
        </div>

        <div class="ck-meme-text-top">
          ${Ct(b)}
        </div>

        <div class="ck-meme-bottom-wrap">
          <div class="ck-meme-text-bottom">
            ${Ct(C||b?C:o)}
          </div>
          ${w?`<div class="ck-meme-cta-pill">⚡ ${Ct(w)}</div>`:""}
        </div>
      </div>
    `}if(i==="awareness"){const b=r||"Demand Immediate Fix";return`
      <div class="ck-card-canvas ck-template-awareness" data-template="awareness" data-style="${Ct(a)}">
        <div class="ck-card-bg-layer" style="background-image: url('${Ct(u)}');"></div>
        <div class="ck-awareness-scrim"></div>

        ${y}

        <!-- Top Header Banner -->
        <div class="ck-awareness-header">
          <div class="ck-awareness-badge">
            <span class="ck-pulse-dot"></span>
            <span>CIVIC AWARENESS BULLETIN</span>
          </div>
          <div class="ck-awareness-id">#${Ct(v)}</div>
        </div>

        <!-- Main Caption Headline -->
        <div class="ck-awareness-headline-box">
          <div class="ck-awareness-title">${Ct(p)}</div>
          <div class="ck-awareness-caption">"${Ct(o)}"</div>
        </div>

        <!-- Fact Strip -->
        <div class="ck-awareness-fact-strip">
          <div class="ck-fact-item">
            <span class="ck-fact-label">LOCATION</span>
            <span class="ck-fact-value">📍 ${Ct(m)}</span>
          </div>
          <div class="ck-fact-item">
            <span class="ck-fact-label">STATUS</span>
            <span class="ck-fact-value ck-status-${Ct(f).toLowerCase()}">${Ct(f)}</span>
          </div>
          <div class="ck-fact-item">
            <span class="ck-fact-label">JURISDICTION</span>
            <span class="ck-fact-value">Municipal Corp</span>
          </div>
        </div>

        <!-- Call to Action Strip -->
        <div class="ck-awareness-cta-strip">
          <div class="ck-awareness-cta-text">
            <span>📢</span> ${Ct(b)}
          </div>
          <div class="ck-awareness-cta-btn">ACT NOW →</div>
        </div>
      </div>
    `}const _=r||"Join The Community Action";return`
    <div class="ck-card-canvas ck-template-initiative" data-template="initiative" data-style="${Ct(a)}">
      <div class="ck-card-bg-layer" style="background-image: url('${Ct(u)}');"></div>
      <div class="ck-initiative-scrim"></div>

      ${y}

      <!-- Top Initiative Banner -->
      <div class="ck-initiative-header">
        <div class="ck-initiative-tag">
          🌱 COMMUNITY INITIATIVE
        </div>
        <span class="ck-initiative-phase">Active Movement</span>
      </div>

      <!-- Main Initiative Callout -->
      <div class="ck-initiative-body">
        <div class="ck-initiative-title">${Ct(p)}</div>
        <div class="ck-initiative-caption">"${Ct(o)}"</div>
      </div>

      <!-- Date & Place Strip -->
      <div class="ck-initiative-strip">
        <div class="ck-init-info-pill">
          <span class="ck-init-icon">🗓</span>
          <div>
            <div class="ck-init-sub">TIMELINE</div>
            <div class="ck-init-main">This Weekend & Ongoing</div>
          </div>
        </div>
        <div class="ck-init-info-pill">
          <span class="ck-init-icon">📍</span>
          <div>
            <div class="ck-init-sub">MEETING POINT</div>
            <div class="ck-init-main">${Ct(m)}</div>
          </div>
        </div>
      </div>

      <!-- Prominent "Join" Strip -->
      <div class="ck-initiative-join-strip">
        <div class="ck-join-cta-content">
          <span class="ck-join-badge">⚡ VOLUNTEER</span>
          <span class="ck-join-text">${Ct(_)}</span>
        </div>
        <button type="button" class="ck-join-action-btn">
          Join Now 🤝
        </button>
      </div>
    </div>
  `}async function Vc(i){if(!i)throw new Error("DOM node is required for PNG rendering.");return await Uc(i,{quality:.95,pixelRatio:2,skipFonts:!1,cacheBust:!0})}function Et(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function qs(i,a=null){var P,V,F,$,J,N;const o=document.getElementById("ck-buzz-detail-modal-root");o&&o.remove();const r=qt(),l=i.linked_type==="initiative",d=i.image_url||ln,u=document.createElement("div");u.id="ck-buzz-detail-modal-root",u.className="ck-buzz-modal-backdrop",u.innerHTML=`
    <div class="ck-buzz-modal-dialog" role="dialog" aria-modal="true">
      <!-- Modal Header -->
      <div class="ck-buzz-modal-topbar">
        <div class="ck-buzz-modal-title-wrap">
          <span class="ck-buzz-fire-tag">🔥 CIVIC BUZZ</span>
          <span class="ck-buzz-status-pill ${Et(i.linked_status||"submitted")}">
            ${Et(i.linked_status||"Active")}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Overflow Report Menu -->
          <button type="button" class="ck-buzz-icon-btn" id="ck-modal-report-btn" title="Report this post" aria-label="Report this post">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
          </button>
          <button type="button" class="ck-buzz-close-btn" id="ck-modal-close-btn" aria-label="Close modal">✕</button>
        </div>
      </div>

      <!-- Scrollable Modal Body -->
      <div class="ck-buzz-modal-body">
        <!-- Media / Card Showcase -->
        <div class="ck-buzz-modal-meme-frame">
          <img src="${Et(d)}" alt="${Et(i.caption)}" class="ck-buzz-modal-img" onerror="this.src='${ln}'" />
          <div class="ck-buzz-modal-scrim"></div>
          <div class="ck-buzz-modal-meme-caption">
            ${Et(i.caption)}
          </div>
          ${i.cta_text?`<div class="ck-buzz-modal-cta-badge">⚡ ${Et(i.cta_text)}</div>`:""}
          <div class="ck-card-watermark">
            <span class="ck-wm-flame">🔥</span>
            <span class="ck-wm-brand">CIVIC-KALKI</span>
          </div>
        </div>

        <!-- Meta and Linked Issue Banner -->
        <div class="ck-buzz-modal-linked-box">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #ff5a36; letter-spacing: 0.05em;">
              Linked ${Et(i.linked_type||"Issue")} #${Et(i.linked_id)}
            </div>
            <div style="font-size: 0.96rem; font-weight: 700; color: #0f172a; margin-top: 2px;" class="ck-truncate">
              ${Et(i.linked_title||i.caption)}
            </div>
            ${i.linked_area?`<div style="font-size: 0.75rem; color: #64748b;">📍 ${Et(i.linked_area)}</div>`:""}
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="ck-modal-view-issue-btn" style="border-radius: 999px; font-weight: 700;">
            View Issue →
          </button>
        </div>

        <!-- Engagement Action Buttons Row -->
        <div class="ck-buzz-modal-actions-bar">
          <button type="button" class="ck-buzz-act-btn ${i.has_voted?"active":""}" id="ck-modal-upvote-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span id="ck-modal-vote-label">${i.has_voted?"Upvoted":"Upvote"}</span>
            <span class="ck-buzz-count-badge" id="ck-modal-vote-count">${i.vote_count||0}</span>
          </button>

          <button type="button" class="ck-buzz-act-btn ${i.is_following?"active":""}" id="ck-modal-follow-btn">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span id="ck-modal-follow-label">${i.is_following?"Following Status":"Follow Status"}</span>
          </button>

          <button type="button" class="ck-buzz-act-btn" id="ck-modal-share-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Share</span>
          </button>

          ${l?`
            <button type="button" class="ck-buzz-act-btn ck-buzz-join-btn" id="ck-modal-join-btn">
              🌱 Join / Volunteer
            </button>
          `:""}

          <button type="button" class="ck-buzz-act-btn" id="ck-modal-report-issue-btn" title="Report or escalate this civic issue via Civic Assistant">
            ⚠️ Report Issue
          </button>
        </div>

        <!-- Community Comments Section -->
        <div class="ck-buzz-comments-section">
          <div class="ck-buzz-comments-head">
            <h4 style="margin: 0; font-size: 0.92rem; font-weight: 700; color: #0f172a;">Community Comments</h4>
            <span style="font-size: 0.75rem; color: #64748b;" id="ck-modal-comments-count">Loading...</span>
          </div>

          <!-- Comment Input -->
          <div class="ck-buzz-comment-input-row">
            <input
              type="text"
              id="ck-modal-comment-input"
              class="ck-buzz-comment-input"
              placeholder="${r?"Add to the conversation (respectful, problem-focused)...":"Sign in to add a comment..."}"
              ${r?"":"disabled"}
              maxlength="500"
            />
            <button type="button" id="ck-modal-comment-send" class="btn btn-primary btn-sm" style="border-radius: 999px; padding: 6px 14px;" ${r?"":"disabled"}>
              Post
            </button>
          </div>
          <div id="ck-modal-comment-error" class="ck-buzz-inline-alert" style="display: none;"></div>

          <!-- Comments List Container -->
          <div id="ck-modal-comments-list" class="ck-buzz-comments-list">
            <div style="text-align: center; padding: 18px; color: #94a3b8; font-size: 0.8rem;">
              Loading conversation...
            </div>
          </div>
        </div>
      </div>
    </div>
  `,document.body.appendChild(u);const p=()=>u.remove();u.addEventListener("click",E=>{E.target===u&&p()}),(P=u.querySelector("#ck-modal-close-btn"))==null||P.addEventListener("click",p);const m=u.querySelector("#ck-modal-upvote-btn"),f=u.querySelector("#ck-modal-vote-count"),v=u.querySelector("#ck-modal-vote-label");m==null||m.addEventListener("click",async()=>{if(!qt()){ue("Please sign in to upvote."),X("/login");return}try{const E=await mt.vote(i.id);E.voted?(m.classList.add("active"),v.textContent="Upvoted"):(m.classList.remove("active"),v.textContent="Upvote"),f.textContent=E.vote_count,i.has_voted=E.voted,i.vote_count=E.vote_count,typeof a=="function"&&a(i)}catch(E){Q(E.message||"Could not register vote")}});const y=u.querySelector("#ck-modal-follow-btn"),_=u.querySelector("#ck-modal-follow-label");y==null||y.addEventListener("click",async()=>{if(!qt()){ue("Please sign in to follow this conversation."),X("/login");return}try{const E=await mt.follow(i.id);E.following?(y.classList.add("active"),_.textContent="Following Status",xt("Now following civic issue updates!")):(y.classList.remove("active"),_.textContent="Follow Status",toast("Unfollowed issue updates.")),i.is_following=E.following,typeof a=="function"&&a(i)}catch(E){Q(E.message||"Could not update follow status")}}),(V=u.querySelector("#ck-modal-view-issue-btn"))==null||V.addEventListener("click",()=>{mt.logEvent(i.id,"click_issue").catch(()=>{}),p(),X(`/entities/${i.linked_id}`)}),(F=u.querySelector("#ck-modal-share-btn"))==null||F.addEventListener("click",()=>{bn(i)}),($=u.querySelector("#ck-modal-join-btn"))==null||$.addEventListener("click",async()=>{try{await mt.logEvent(i.id,"join"),xt("🌱 Thank you for volunteering! Opening initiative details..."),setTimeout(()=>{p(),X(`/entities/${i.linked_id}`)},700)}catch{X(`/entities/${i.linked_id}`)}}),(J=u.querySelector("#ck-modal-report-issue-btn"))==null||J.addEventListener("click",()=>{p(),X("/dashboard"),setTimeout(()=>{const E=document.getElementById("ck-dark-input");E&&(E.value=`Regarding issue #${i.linked_id} (${i.linked_title||i.caption}): `,E.focus())},200)}),(N=u.querySelector("#ck-modal-report-btn"))==null||N.addEventListener("click",()=>{const E=window.prompt(`Why are you reporting this Civic Buzz post?
(e.g., Offensive language, personal data, misleading claim)`);E&&E.trim()&&mt.report(i.id,E.trim()).then(I=>{xt(I.message||"Report received. Thank you for keeping our community safe.")}).catch(I=>{Q(I.message||"Could not submit report")})});async function b(){const E=u.querySelector("#ck-modal-comments-list"),I=u.querySelector("#ck-modal-comments-count");try{const Z=(await mt.getComments(i.id)).data||[];if(I.textContent=`${Z.length} comment${Z.length===1?"":"s"}`,Z.length===0){E.innerHTML=`
          <div style="text-align:center; padding:16px; color:#94a3b8; font-size:0.8rem;">
            No comments yet. Start the conversation!
          </div>
        `;return}E.innerHTML=Z.map(at=>`
        <div class="ck-buzz-comment-item">
          <div class="ck-buzz-comment-meta">
            <span class="ck-buzz-comment-author">👤 ${Et(at.author_name)}</span>
            <span class="ck-buzz-comment-time">${new Date(at.created_at).toLocaleDateString()}</span>
          </div>
          <div class="ck-buzz-comment-text">${Et(at.text)}</div>
        </div>
      `).join("")}catch{E.innerHTML='<div style="text-align:center; padding:12px; color:#ef4444; font-size:0.75rem;">Failed to load comments</div>'}}const C=u.querySelector("#ck-modal-comment-input"),w=u.querySelector("#ck-modal-comment-send"),M=u.querySelector("#ck-modal-comment-error");async function O(){var I;const E=C.value.trim();if(E){M.style.display="none",w.disabled=!0;try{await mt.addComment(i.id,E),C.value="",xt("Comment posted!"),await b()}catch(W){M.textContent=((I=W.data)==null?void 0:I.message)||W.message||"Failed to submit comment",M.style.display="block"}finally{w.disabled=!1}}}w==null||w.addEventListener("click",O),C==null||C.addEventListener("keydown",E=>{E.key==="Enter"&&(E.preventDefault(),O())}),await b()}async function $i(i=null,a=null,o=null){const r=document.getElementById("ck-buzz-create-modal-root");r&&r.remove();const l=qt();if(!l){ue("Please sign in to create a Civic Buzz post."),X("/login");return}let d=[];try{const[P,V]=await Promise.all([gt.list({owner_user_id:l.user_id,limit:50}).catch(()=>({data:[]})),gt.list({limit:50}).catch(()=>({data:[]}))]),F=new Map;(P.data||[]).forEach($=>F.set($.entity_id,{...$,is_mine:!0})),(V.data||[]).forEach($=>{F.has($.entity_id)||F.set($.entity_id,{...$,is_mine:!1})}),d=Array.from(F.values())}catch{d=[]}let u=o?4:1,p=o?o.template==="initiative"?"promote_initiative":o.template==="awareness"?"awareness_card":"meme_issue":"meme_issue",m=null,f=(o==null?void 0:o.style)||"funny",v=[],y=(o==null?void 0:o.caption)||"",_=(o==null?void 0:o.cta_text)||"",b=null;i?m=d.find(P=>String(P.entity_id)===String(i))||null:o!=null&&o.linked_id&&(m=d.find(P=>String(P.entity_id)===String(o.linked_id))||null),!m&&d.length>0&&(m=d[0]);function C(){return p==="promote_initiative"?{template:"initiative",linked_type:"initiative"}:p==="awareness_card"?{template:"awareness",linked_type:"issue"}:p==="share_issue"?{template:"awareness",linked_type:"issue"}:{template:"meme",linked_type:"issue"}}const w=document.createElement("div");w.id="ck-buzz-create-modal-root",w.className="ck-buzz-modal-backdrop",document.body.appendChild(w);const M=()=>w.remove();w.addEventListener("click",P=>{P.target===w&&M()});async function O(){var J,N,E,I,W,Z,at,Lt;const{template:P,linked_type:V}=C();w.innerHTML=`
      <div class="ck-buzz-modal-dialog" role="dialog" aria-modal="true" style="max-width: 620px; border-radius: 20px;">
        <!-- Top bar with Title & Close -->
        <div class="ck-buzz-modal-topbar" style="padding: 16px 22px;">
          <div class="ck-buzz-modal-title-wrap">
            <span style="font-size: 1.25rem;">✨</span>
            <span style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">
              ${o?"Edit Civic Buzz Post":"Create Civic Buzz Post"}
            </span>
          </div>
          <button type="button" class="ck-buzz-close-btn" id="ck-wiz-close-btn" aria-label="Close modal">✕</button>
        </div>

        <!-- 5-Step Progress Tracker -->
        <div class="ck-wizard-step-tracker">
          <div class="ck-wizard-step-node ${u===1?"active":u>1?"completed":""}">
            <div class="ck-wizard-step-badge">${u>1?"✓":"1"}</div>
            <span>Type</span>
          </div>
          <div class="ck-wizard-step-line ${u>1?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===2?"active":u>2?"completed":""}">
            <div class="ck-wizard-step-badge">${u>2?"✓":"2"}</div>
            <span>Issue</span>
          </div>
          <div class="ck-wizard-step-line ${u>2?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===3?"active":u>3?"completed":""}">
            <div class="ck-wizard-step-badge">${u>3?"✓":"3"}</div>
            <span>Style</span>
          </div>
          <div class="ck-wizard-step-line ${u>3?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===4?"active":u>4?"completed":""}">
            <div class="ck-wizard-step-badge">${u>4?"✓":"4"}</div>
            <span>Caption</span>
          </div>
          <div class="ck-wizard-step-line ${u>4?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===5?"active":""}">
            <div class="ck-wizard-step-badge">5</div>
            <span>Preview</span>
          </div>
        </div>

        <!-- Step Body Container -->
        <div class="ck-buzz-modal-body" style="padding: 22px; max-height: 520px; overflow-y: auto;">
          <div id="ck-wiz-step-content"></div>
        </div>

        <!-- Step Footer Navigation Bar -->
        <div style="padding: 14px 22px; border-top: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#ffffff; border-bottom-left-radius:20px; border-bottom-right-radius:20px;">
          <button type="button" class="btn btn-secondary" id="ck-wiz-prev-btn" style="border-radius:999px; font-weight:700;" ${u===1?"disabled":""}>
            ← Back
          </button>

          <div style="display:flex; gap:10px;">
            ${u===5?`
              <button type="button" class="btn btn-secondary" id="ck-wiz-draft-btn" style="border-radius:999px; font-weight:700;">
                Save as Draft
              </button>
              <button type="button" class="btn btn-primary" id="ck-wiz-publish-btn" style="border-radius:999px; font-weight:800; padding:10px 22px; background:linear-gradient(135deg, #ff5a36, #ea580c);">
                Publish to Civic Buzz 🔥
              </button>
            `:`
              <button type="button" class="btn btn-primary" id="ck-wiz-next-btn" style="border-radius:999px; font-weight:700; padding:10px 24px;">
                Continue →
              </button>
            `}
          </div>
        </div>
      </div>
    `,(J=w.querySelector("#ck-wiz-close-btn"))==null||J.addEventListener("click",M),(N=w.querySelector("#ck-wiz-prev-btn"))==null||N.addEventListener("click",()=>{u>1&&(u--,O())});const F=w.querySelector("#ck-wiz-step-content");if(u===1){F.innerHTML=`
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 1: Choose Conversation Type
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            Select the format that best conveys your civic situation to Pune citizens.
          </p>
        </div>

        <div class="ck-wizard-type-grid">
          <!-- Option 1: Meme -->
          <div class="ck-wizard-type-card ${p==="meme_issue"?"active":""}" data-type="meme_issue">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.4rem;">🔥</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Viral / Funny</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Meme about a civic issue</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              High-impact bold meme typography over photo highlighting potholes, water breaks, or city hazards.
            </div>
          </div>

          <!-- Option 2: Awareness Card -->
          <div class="ck-wizard-type-card ${p==="awareness_card"?"active":""}" data-type="awareness_card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.4rem;">📢</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Informative</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Awareness card</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Civic bulletin with verified fact strip (area, status, category) and direct demand for municipal action.
            </div>
          </div>

          <!-- Option 3: Initiative -->
          <div class="ck-wizard-type-card ${p==="promote_initiative"?"active":""}" data-type="promote_initiative">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.4rem;">🌱</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Movement</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Promote community initiative</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Rally neighborhood volunteers with meeting point, schedule, and prominent "Join" volunteer strip.
            </div>
          </div>

          <!-- Option 4: Share Issue -->
          <div class="ck-wizard-type-card ${p==="share_issue"?"active":""}" data-type="share_issue">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.4rem;">⚡</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Civic Case</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Share an existing issue</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Turn an open CIVIC-KALKI complaint into a viral public post to accelerate official ward response.
            </div>
          </div>
        </div>
      `,F.querySelectorAll(".ck-wizard-type-card").forEach(G=>{G.addEventListener("click",()=>{p=G.getAttribute("data-type"),F.querySelectorAll(".ck-wizard-type-card").forEach(R=>R.classList.remove("active")),G.classList.add("active")})}),(E=w.querySelector("#ck-wiz-next-btn"))==null||E.addEventListener("click",()=>{u=2,O()});return}if(u===2){let rt=function(H=""){const Ht=H.toLowerCase().trim(),j=d.filter(q=>{if(!Ht)return!0;const st=(q.name||"").toLowerCase().includes(Ht),vt=(q.area||"").toLowerCase().includes(Ht),ht=String(q.entity_id).includes(Ht);return st||vt||ht});if(j.length===0){R.innerHTML="",K.style.display="block";return}K.style.display="none",R.innerHTML=j.map(q=>{const st=m&&m.entity_id===q.entity_id;return q.entity_type_id===1||q.entity_type_id,`
            <div class="ck-wizard-entity-card ${st?"active":""}" data-id="${q.entity_id}" style="
              border: 1.5px solid ${st?"#ff5a36":"#e2e8f0"};
              background: ${st?"#fff7ed":"#ffffff"};
              border-radius: 12px;
              padding: 10px 14px;
              cursor: pointer;
              transition: all 0.15s;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
            ">
              <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:0.7rem; font-weight:800; color:#ff5a36;">#${q.entity_id}</span>
                  <span class="badge badge-secondary" style="font-size:0.65rem;">${q.is_mine?"My Item":"Community"}</span>
                  <span class="ck-buzz-status-pill ${Et(q.status||"submitted")}" style="font-size:0.65rem; padding:1px 6px;">
                    ${Et(q.status||"Active")}
                  </span>
                </div>
                <div style="font-weight:700; font-size:0.88rem; color:#0f172a; margin-top:2px;" class="ck-truncate">
                  ${Et(q.name)}
                </div>
                ${q.area?`<div style="font-size:0.75rem; color:#64748b;">📍 ${Et(q.area)}</div>`:""}
              </div>
              <div style="font-size:1.1rem; color:${st?"#ff5a36":"#cbd5e1"}; font-weight:800;">
                ${st?"✓":"○"}
              </div>
            </div>
          `}).join(""),R.querySelectorAll(".ck-wizard-entity-card").forEach(q=>{q.addEventListener("click",()=>{const st=Number(q.getAttribute("data-id"));m=d.find(vt=>vt.entity_id===st)||null,rt(G.value)})})};var $=rt;F.innerHTML=`
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 2: Pick Linked Issue or Initiative
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            Select from your reported civic items or followed community activities.
          </p>
        </div>

        <!-- Live Search Bar -->
        <div style="margin-bottom: 14px; position:relative;">
          <input
            type="text"
            id="ck-wiz-entity-search"
            class="form-input"
            placeholder="Search by title, area (e.g. Baner, FC Road), or ID..."
            style="width:100%; font-size:0.86rem; padding: 10px 14px; border-radius:10px;"
          />
        </div>

        <!-- Scrollable Candidates List -->
        <div id="ck-wiz-entity-list" style="display:flex; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto; padding-right:4px;">
        </div>

        <div id="ck-wiz-entity-empty" style="display:none; text-align:center; padding:24px; color:#94a3b8; font-size:0.82rem;">
          No matching civic items found. Try a different search keyword.
        </div>
      `;const G=F.querySelector("#ck-wiz-entity-search"),R=F.querySelector("#ck-wiz-entity-list"),K=F.querySelector("#ck-wiz-entity-empty");rt(),G.addEventListener("input",H=>rt(H.target.value)),(I=w.querySelector("#ck-wiz-next-btn"))==null||I.addEventListener("click",()=>{if(!m){ue("Please select an issue or initiative to link.");return}u=3,O()});return}if(u===3){F.innerHTML=`
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 3: Choose Conversation Style
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            How should the AI tune the tone and message for this civic post?
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <!-- Style 1: Funny -->
          <div class="ck-wizard-type-card ${f==="funny"?"active":""}" data-style="funny">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.3rem;">😂</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Viral Relay</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Funny and relatable</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Witty, self-deprecating street humor mocking the civic obstacle, never mocking people or communities.
            </div>
          </div>

          <!-- Style 2: Informative -->
          <div class="ck-wizard-type-card ${f==="informative"?"active":""}" data-style="informative">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.3rem;">📋</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Direct & Clear</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Informative</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Sharp, data-driven facts highlighting duration, safety hazards, and exact municipal ward accountability.
            </div>
          </div>

          <!-- Style 3: Emotional -->
          <div class="ck-wizard-type-card ${f==="emotional"?"active":""}" data-style="emotional">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 1.3rem;">🤝</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Community Pride</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Emotional-community-focused</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Heartfelt, neighborhood solidarity calling on citizens to protect senior citizens, children, and our parks.
            </div>
          </div>
        </div>
      `,F.querySelectorAll(".ck-wizard-type-card").forEach(G=>{G.addEventListener("click",()=>{f=G.getAttribute("data-style"),F.querySelectorAll(".ck-wizard-type-card").forEach(R=>R.classList.remove("active")),G.classList.add("active")})}),(W=w.querySelector("#ck-wiz-next-btn"))==null||W.addEventListener("click",()=>{u=4,O()});return}if(u===4){F.innerHTML=`
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 4: AI Captions & Text
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            Pick one of Gemini AI's generated captions or edit freely.
          </p>
        </div>

        <!-- AI Captions Options Container -->
        <div id="ck-wiz-ai-loading" style="text-align:center; padding:24px 0;">
          <div class="spinner" style="margin: 0 auto 10px;"></div>
          <div style="font-size:0.8rem; font-weight:700; color:#ff5a36;">Generating 3 smart civic captions with Gemini AI...</div>
          <div style="font-size:0.72rem; color:#64748b; margin-top:2px;">Applying safety rules: no personal data, no mockery of people, mock problem only.</div>
        </div>

        <div id="ck-wiz-caption-cards" style="display:none; flex-direction:column; gap:8px; margin-bottom:16px;">
        </div>

        <!-- Regenerate Button -->
        <div style="display:flex; justify-content:flex-end; margin-bottom:14px;">
          <button type="button" id="ck-wiz-regen-btn" class="btn btn-secondary btn-sm" style="border-radius:999px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
            <span>🤖</span> Regenerate Captions
          </button>
        </div>

        <!-- Free Edit Form -->
        <div class="form-group" style="margin-bottom:12px;">
          <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:4px;">
            Post Caption (Overlay text) *
          </label>
          <textarea
            id="ck-wiz-caption-input"
            rows="2"
            class="form-input"
            placeholder="Edit your caption freely..."
            style="width:100%; font-size:0.88rem; font-family:inherit; padding:8px 12px; border-radius:10px;"
            maxlength="500"
          >${Et(y)}</textarea>
        </div>

        <div class="form-group" style="margin-bottom:8px;">
          <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:4px;">
            Call to Action (CTA Text)
          </label>
          <input
            type="text"
            id="ck-wiz-cta-input"
            class="form-input"
            placeholder="e.g. Demand Action, Fix Baner Road, Join Clean-up"
            value="${Et(_)}"
            style="width:100%; font-size:0.86rem; padding:8px 12px; border-radius:10px;"
            maxlength="60"
          />
        </div>
      `;const G=F.querySelector("#ck-wiz-ai-loading"),R=F.querySelector("#ck-wiz-caption-cards"),K=F.querySelector("#ck-wiz-regen-btn"),rt=F.querySelector("#ck-wiz-caption-input"),H=F.querySelector("#ck-wiz-cta-input");async function Ht(){G.style.display="block",R.style.display="none";try{const j=await mt.generateCaptions({linked_id:m.entity_id,linked_type:V,template:P,style:f});if(v=j.captions||[],G.style.display="none",R.style.display="flex",v.length===0){R.innerHTML=`<div style="font-size:0.8rem; color:#ef4444; padding:8px;">${Et(j.reason||"Could not generate AI captions. You can type your own below.")}</div>`;return}R.innerHTML=v.map((q,st)=>`
            <div class="ck-wiz-caption-opt" data-idx="${st}" style="
              border: 1.5px solid #e2e8f0;
              background: #f8fafc;
              border-radius: 10px;
              padding: 10px 14px;
              cursor: pointer;
              transition: all 0.15s;
            ">
              <div style="font-weight:700; color:#0f172a; font-size:0.88rem;">"${Et(q.caption)}"</div>
              <div style="font-size:0.72rem; font-weight:700; color:#ff5a36; margin-top:3px;">
                CTA: ${Et(q.cta_text||"Take Action")}
              </div>
            </div>
          `).join(""),!rt.value&&v[0]&&(rt.value=v[0].caption,H.value=v[0].cta_text||"",y=rt.value,_=H.value),R.querySelectorAll(".ck-wiz-caption-opt").forEach(q=>{q.addEventListener("click",()=>{const st=Number(q.getAttribute("data-idx")),vt=v[st];vt&&(rt.value=vt.caption,H.value=vt.cta_text||"",y=vt.caption,_=vt.cta_text||"",xt("Caption applied! You can customize it freely."))})})}catch(j){G.style.display="none",R.style.display="flex",R.innerHTML=`<div style="font-size:0.8rem; color:#ef4444; padding:8px;">Failed to generate AI captions: ${Et(j.message)}. Please enter your caption below.</div>`}}K==null||K.addEventListener("click",Ht),rt.addEventListener("input",()=>{y=rt.value}),H.addEventListener("input",()=>{_=H.value}),v.length===0?Ht():(G.style.display="none",R.style.display="flex"),(Z=w.querySelector("#ck-wiz-next-btn"))==null||Z.addEventListener("click",()=>{if(y=rt.value.trim(),_=H.value.trim(),!y){ue("Please enter or select a caption.");return}u=5,O()});return}if(u===5){F.innerHTML=`
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 5: Preview & Publish
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            The card has been rendered to PNG using the ${P.toUpperCase()} template.
          </p>
        </div>

        <!-- Render Target (Hidden DOM element converted by html-to-image) -->
        <div id="ck-wiz-render-mount" style="position:fixed; left:-9999px; top:-9999px; width:600px; height:600px; pointer-events:none;">
          ${Fs({template:P,style:f,caption:y,cta_text:_,issue:m})}
        </div>

        <!-- Live Preview Showcase -->
        <div class="ck-wizard-preview-container">
          <div id="ck-wiz-preview-loading" style="text-align:center; padding:40px; color:#ffffff;">
            <div class="spinner" style="margin: 0 auto 10px; border-color: rgba(255,255,255,0.2); border-top-color: #ff5a36;"></div>
            <div style="font-size:0.8rem; font-weight:700;">Rendering PNG in browser...</div>
          </div>
          <div id="ck-wiz-preview-box" class="ck-wizard-preview-scaler" style="display:none;">
            <img id="ck-wiz-preview-img" alt="Civic Buzz Preview" style="width:100%; height:100%; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.5);" />
          </div>
        </div>

        <!-- Safety check alert container -->
        <div id="ck-wiz-safety-alert" class="ck-buzz-inline-alert" style="display:none; margin-top:14px;"></div>
      `;const G=F.querySelector("#ck-wiz-render-mount .ck-card-canvas"),R=F.querySelector("#ck-wiz-preview-loading"),K=F.querySelector("#ck-wiz-preview-box"),rt=F.querySelector("#ck-wiz-preview-img"),H=F.querySelector("#ck-wiz-safety-alert");try{b=await Vc(G),rt.src=b,R.style.display="none",K.style.display="flex"}catch(j){console.error("html-to-image render error:",j),R.innerHTML='<div style="color:#fca5a5; font-size:0.8rem;">Preview generated via HTML/CSS layout</div>',K.innerHTML=G.outerHTML,K.style.display="flex"}async function Ht(j){var vt;H.style.display="none";const q=w.querySelector("#ck-wiz-publish-btn"),st=w.querySelector("#ck-wiz-draft-btn");q.disabled=!0,st.disabled=!0,j==="published"?q.textContent="Verifying Safety...":st.textContent="Saving...";try{let ht=null;if(b)try{ht=(await mt.uploadImage(b)).image_url}catch(nt){console.warn("Could not store PNG file, saving data URL fallback:",nt),ht=b}const dt={linked_type:V,linked_id:Number(m.entity_id),template:P,style:f,caption:y,cta_text:_||null,image_url:ht,status:j};o&&o.id?await mt.update(o.id,dt):await mt.create(dt),xt(j==="published"?"🔥 Civic Buzz post published to community!":"Draft saved under My Civic Activity!"),M(),typeof a=="function"&&a()}catch(ht){H.textContent=((vt=ht.data)==null?void 0:vt.message)||ht.message||"Submission failed. Please revise.",H.style.display="block"}finally{q.disabled=!1,st.disabled=!1,q.textContent="Publish to Civic Buzz 🔥",st.textContent="Save as Draft"}}(at=w.querySelector("#ck-wiz-publish-btn"))==null||at.addEventListener("click",()=>Ht("published")),(Lt=w.querySelector("#ck-wiz-draft-btn"))==null||Lt.addEventListener("click",()=>Ht("draft"))}}await O()}function Pe(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const ss='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CIVIC BUZZ</text><text x="50%" y="56%" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="15" fill="%23fdba74" text-anchor="middle">YOUTH-POWERED CIVIC CONVERSATION</text></svg>';function Wc(){return`
    <div class="ck-rx-sidebar-panel ck-buzz-carousel-panel" id="ck-buzz-carousel-container">
      <!-- Carousel Header (Clickable to open full-page gallery) -->
      <div class="ck-buzz-header-row" id="ck-buzz-header-click" title="Open Civic Buzz Gallery" style="cursor: pointer;">
        <div>
          <div class="ck-buzz-brand-title">
            <span>CIVIC BUZZ</span>
            <span class="ck-buzz-flame">🔥</span>
          </div>
          <div class="ck-buzz-brand-sub">Youth-powered civic conversations</div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" class="ck-buzz-nav-arrow" id="ck-buzz-prev-btn" aria-label="Previous Buzz Card" title="Previous">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button type="button" class="ck-buzz-nav-arrow" id="ck-buzz-next-btn" aria-label="Next Buzz Card" title="Next">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- Viewport & Track -->
      <div class="ck-buzz-viewport" id="ck-buzz-viewport">
        <!-- Floating circular nav arrows on photo -->
        <button type="button" class="ck-buzz-arrow-overlay prev" id="ck-buzz-overlay-prev-btn" aria-label="Previous Buzz Card" title="Previous">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button type="button" class="ck-buzz-arrow-overlay next" id="ck-buzz-overlay-next-btn" aria-label="Next Buzz Card" title="Next">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div class="ck-buzz-track" id="ck-buzz-track">
          <!-- Loading State -->
          <div class="ck-buzz-loading-box">
            <div class="spinner" style="width: 22px; height: 22px; margin-bottom: 8px;"></div>
            <span>Loading youth civic buzz...</span>
          </div>
        </div>
      </div>

      <!-- Dot Indicators & Footer Explore Link -->
      <div class="ck-buzz-footer-row">
        <div class="ck-buzz-dots" id="ck-buzz-dots"></div>
        <a href="/buzz" class="ck-buzz-gallery-link" id="ck-buzz-explore-link">
          Explore all →
        </a>
      </div>
    </div>
  `}async function Us(){var F;const i=document.getElementById("ck-buzz-carousel-container"),a=document.getElementById("ck-buzz-track"),o=document.getElementById("ck-buzz-dots"),r=document.getElementById("ck-buzz-prev-btn"),l=document.getElementById("ck-buzz-next-btn"),d=document.getElementById("ck-buzz-header-click");if(!i||!a)return;d==null||d.addEventListener("click",$=>{$.target.closest(".ck-buzz-nav-arrow")||X("/buzz")});let u=[],p=0,m=null;const f=new Set;try{u=(await mt.list({limit:8,sort:"trending"})).data||[]}catch{a.innerHTML=`
      <div style="padding: 16px; text-align: center; color: #ef4444; font-size: 0.78rem;">
        Failed to load Civic Buzz
      </div>
    `;return}if(u.length===0){a.innerHTML=`
      <div class="ck-buzz-empty-card">
        <div style="font-size: 1.6rem; margin-bottom: 4px;">🌱</div>
        <div style="font-weight: 700; font-size: 0.86rem; color: #0f172a;">No Civic Buzz yet</div>
        <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 10px;">
          Be the first to turn a real civic problem into a viral conversation!
        </p>
        <button type="button" id="ck-buzz-first-create-btn" class="btn btn-primary btn-sm" style="border-radius: 999px; font-weight: 700; font-size: 0.76rem;">
          + Create First Post
        </button>
      </div>
    `,(F=document.getElementById("ck-buzz-first-create-btn"))==null||F.addEventListener("click",()=>{$i(null,()=>Us())});return}a.innerHTML=u.map(($,J)=>{const N=$.image_url||ss,E=$.linked_title||$.caption,I=$.linked_area||"",W=$.views_count||0,Z=$.vote_count||0,at=$.shares_count||0,Lt=$.joins_count||0,G=$.template==="initiative"||$.linked_type==="initiative";return`
      <div class="ck-buzz-slide" data-index="${J}" data-post-id="${$.id}">
        <!-- Image Card with Bold Meme-style Caption Overlay -->
        <div class="ck-buzz-img-box" data-action="open-gallery" style="cursor: pointer;">
          <img src="${Pe(N)}" alt="${Pe($.caption)}" class="ck-buzz-img" onerror="this.src='${ss}'" />
          <div class="ck-buzz-scrim"></div>
          
          <div class="ck-buzz-meme-caption">
            ${Pe($.caption)}
          </div>
          <div class="ck-buzz-badge-row">
            <span class="ck-buzz-pill-tag">
              ${G?"🌱 INITIATIVE":$.template==="awareness"?"📢 AWARENESS":"🔥 MEME"}
            </span>
          </div>
        </div>

        <!-- Issue Title & Honest Stats -->
        <div class="ck-buzz-meta-box">
          <div class="ck-buzz-issue-title" title="${Pe(E)}">
            ${Pe(E)}
          </div>
          ${I?`<div style="font-size:0.73rem; color:#64748b; margin-top:2px; font-weight:500;" class="ck-truncate">${Pe(I)}</div>`:""}
          <div class="ck-buzz-stats-line">
            <span>👁 ${W} views</span>
            <span>·</span>
            <span>${G&&Lt?`🤝 ${Lt} joined`:`⬆ ${Z} upvotes`}</span>
            <span>·</span>
            <span>↗ ${at} shares</span>
          </div>
        </div>

        <!-- Two Action Buttons: View Issue & Share -->
        <div class="ck-buzz-btns-row">
          <button type="button" class="ck-buzz-btn-issue" data-action="view-issue" data-post-id="${$.id}" data-linked-id="${$.linked_id}">
            View Issue
          </button>
          <button type="button" class="ck-buzz-btn-share" data-action="share-post" data-post-id="${$.id}" data-caption="${Pe($.caption)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    `}).join(""),o.innerHTML=u.map(($,J)=>`
    <span class="ck-buzz-dot ${J===0?"active":""}" data-dot-index="${J}"></span>
  `).join("");function v($){if(u.length===0)return;p=($+u.length)%u.length;const J=a.querySelector(".ck-buzz-slide");if(J){const E=J.offsetWidth+12;a.style.transform=`translateX(-${p*E}px)`}i.querySelectorAll(".ck-buzz-dot").forEach((E,I)=>{E.classList.toggle("active",I===p)});const N=u[p];N&&!f.has(N.id)&&(f.add(N.id),mt.logEvent(N.id,"view").catch(()=>{}))}v(0);const y=document.getElementById("ck-buzz-overlay-prev-btn"),_=document.getElementById("ck-buzz-overlay-next-btn"),b=$=>{$.stopPropagation(),v(p-1)},C=$=>{$.stopPropagation(),v(p+1)};r==null||r.addEventListener("click",b),l==null||l.addEventListener("click",C),y==null||y.addEventListener("click",b),_==null||_.addEventListener("click",C),o.addEventListener("click",$=>{const J=$.target.closest(".ck-buzz-dot");if(!J)return;const N=parseInt(J.getAttribute("data-dot-index"),10);isNaN(N)||v(N)});function w(){M(),m=setInterval(()=>{v(p+1)},1800)}function M(){m&&(clearInterval(m),m=null)}w(),i.addEventListener("mouseenter",M),i.addEventListener("mouseleave",w);let O=0,P=!1;const V=document.getElementById("ck-buzz-viewport");V==null||V.addEventListener("touchstart",$=>{M(),O=$.touches[0].clientX},{passive:!0}),V==null||V.addEventListener("touchend",$=>{const J=$.changedTouches[0].clientX-O;Math.abs(J)>35&&(J>0?v(p-1):v(p+1)),w()},{passive:!0}),V==null||V.addEventListener("mousedown",$=>{P=!0,O=$.clientX,M()}),window.addEventListener("mouseup",$=>{if(!P)return;P=!1;const J=$.clientX-O;Math.abs(J)>40&&(J>0?v(p-1):v(p+1)),w()}),a.addEventListener("click",$=>{var I,W;const J=$.target.closest('[data-action="view-issue"]');if(J){$.stopPropagation();const Z=J.getAttribute("data-post-id"),at=J.getAttribute("data-linked-id");Z&&mt.logEvent(Number(Z),"click_issue").catch(()=>{}),at&&X(`/entities/${at}`);return}const N=$.target.closest('[data-action="share-post"]');if(N){$.stopPropagation();const Z=Number(N.getAttribute("data-post-id")),at=u.find(Lt=>Lt.id===Z)||{id:Z,caption:N.getAttribute("data-caption")||"Civic Buzz",image_url:(W=(I=N.closest(".ck-buzz-slide"))==null?void 0:I.querySelector("img"))==null?void 0:W.src};bn(at);return}$.target.closest('[data-action="open-gallery"]')&&($.stopPropagation(),X("/buzz"))})}function ft(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const bt={mic:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>',arrowRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',chevronRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',alertTriangle:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',lightbulb:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',users:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',bookOpen:'<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',clipboard:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',heart:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',checkCircle:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',road:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M20 19L16 5"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="14"/><line x1="12" y1="18" x2="12" y2="20"/></svg>',trash:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',zap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',leaf:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 2-5.5 3.5-9 3.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',mapPin:'<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',usersSm:'<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>'};async function _n(){if(!he(X))return;const i=qt(),a=document.getElementById("app");a.innerHTML=kt(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Workspace"),zt();try{const r=(await Ta.getMetadata().catch(()=>({success:!1,data:{entityTypes:[],rules:[],domains:[]}}))).data||{entityTypes:[],rules:[],domains:[]};let l="Home",d=`Good day, <strong>${ft(i.name)}</strong>. Here is what is happening in your civic workspace.`;i.role==="coordinator_area"||i.role==="coordinator_general"?(l="Civic Operations Workspace",d=`Operations view for <strong>${ft(i.name)}</strong>`):i.role==="director"?(l="Executive Governance Workspace",d=`Executive view for <strong>${ft(i.name)}</strong>`):i.role==="admin"&&(l="Civic OS Administration",d=`Platform admin for <strong>${ft(i.name)}</strong>`);const u=i.role==="citizen";a.innerHTML=kt(`
      ${u?'<div id="dash-actions" style="display:none;"></div>':`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${ft(l)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">${d}</p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      `}
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `,l,r.entityTypes),zt();const p=document.getElementById("dash-content"),m=document.getElementById("dash-actions");if(i.role==="citizen"){m.innerHTML="";const f=document.getElementById("page-content");f&&f.classList.add("ck-citizen-page-content"),await Gc(p,i,r)}else i.role==="coordinator_area"?(m.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await Xc(p,i,r)):i.role==="coordinator_general"?(m.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>',await Qc(p,i,r)):i.role==="director"?(m.innerHTML='<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>',await td(p,i,r)):i.role==="admin"&&(m.innerHTML=`
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `,await ed(p,i,r));typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{Q("Failed to load workspace data"),document.getElementById("dash-content").innerHTML='<div class="alert alert-error">Failed to load workspace data. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}async function Gc(i,a,o){const l=(await gt.list({owner_user_id:a.user_id,limit:50}).catch(()=>({data:[]}))).data||[],d=l.filter(M=>M.status==="draft").length,u=l.filter(M=>["submitted","coordinator_approved","in_review"].includes(M.status)).length,p=l.filter(M=>["approved","closed","rejected"].includes(M.status)).length,m=l.filter(M=>M.isFollowing).length||5;let v=(await gt.list({limit:6}).catch(()=>({data:[]}))).data||[],y=v.length>=3?v:Jc(v);const _=M=>{const O={submitted:{label:"Submitted",bg:"#fef3c7",color:"#92400e"},coordinator_approved:{label:"In Progress",bg:"#dbeafe",color:"#1e40af"},approved:{label:"Open",bg:"#dcfce7",color:"#166534"},draft:{label:"Draft",bg:"#f1f5f9",color:"#475569"},rejected:{label:"Closed",bg:"#fee2e2",color:"#991b1b"},default:{label:"Active",bg:"#ffedd5",color:"#9a3412"}},P=O[M]||O.default;return`<span class="ck-rx-status-pill" style="background:${P.bg}; color:${P.color};">${P.label}</span>`},b=(M="")=>{const O=M.toLowerCase();return O.includes("tree")||O.includes("park")||O.includes("green")||O.includes("garden")?bt.leaf:O.includes("light")||O.includes("wire")||O.includes("power")||O.includes("pole")?bt.zap:O.includes("garbage")||O.includes("waste")||O.includes("sanitation")||O.includes("clean")?bt.trash:bt.road},C=y.map((M,O)=>`
      <div class="ck-rx-issue-card">
        <div class="ck-rx-issue-top">
          <div class="ck-rx-issue-icon">
            ${b(M.name)}
          </div>
          ${_(M.status)}
        </div>
        <div class="ck-rx-issue-name" title="${ft(M.name)}">${ft(M.name)}</div>
        <div class="ck-rx-issue-area">
          ${bt.mapPin}
          <span>${ft(M.area||"Ward 14 · Pune")}</span>
        </div>
        <div class="ck-rx-issue-footer">
          <span class="ck-rx-issue-meta">
            ${bt.usersSm}
            ${O*14+18} citizens backing
          </span>
          <a href="/entities/${M.entity_id||""}" class="ck-rx-issue-link">
            View ${bt.chevronRight}
          </a>
        </div>
      </div>
    `).join("");l.length>0&&l.slice(0,5).map(M=>`
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px;">
      <div>
        <div style="font-weight:600; font-size:0.86rem; color:#0f172a;">${ft(M.name)}</div>
        <div style="font-size:0.75rem; color:#64748b;">Area: ${ft(M.area||"Ward 14")} · #${M.entity_id}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        ${_(M.status)}
        <a href="/entities/${M.entity_id}" class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:0.75rem;">Inspect</a>
      </div>
    </div>
  `).join("");const w=Yc();i.innerHTML=`
    <!-- ░░ REVENUEX-STYLE DASHBOARD WITH UNIFIED AGENTIC AI HERO ░░ -->
    <div class="ck-rx-layout">
      <!-- ░░ MAIN CONTENT ░░ -->
      <main class="ck-rx-main">

        <!-- ══════════════════════════════════════════════════════════════
             1. HIGHLIGHTED AGENTIC AI HERO (DARKSHADE + MINIMAL PILL BAR)
             Unified Chat Bar + Live Conversation in ONE seamless dark card
             ══════════════════════════════════════════════════════════════ -->
        <section class="ck-agent-dark-card" id="ck-dark-cockpit" aria-label="Civic Assistant AI Chat">
          <div class="ck-dark-ambient"></div>
          
          <!-- Header with Avatar, Title, Live Status, Voice Wave Animation, and Reset -->
          <div class="ck-dark-header">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="ck-dark-avatar">
                <svg width="17" height="17" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <div class="ck-dark-title">
                  <span>Civic Assistant</span>
                  <span class="ck-dark-live-badge">
                    <span class="ck-dark-live-dot"></span>
                    <span>AI Copilot</span>
                  </span>
                </div>
                <div class="ck-dark-sub">
                  Report issues · Start initiatives · Check request status
                </div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
              <!-- Signature Voice Wave Animation -->
              <div class="ck-voice-wave" title="Voice audio frequency monitor">
                <span class="ck-vbar vbar-1"></span>
                <span class="ck-vbar vbar-2"></span>
                <span class="ck-vbar vbar-3"></span>
                <span class="ck-vbar vbar-4"></span>
              </div>

              <!-- Reset / New Request Button -->
              <button type="button" class="ck-dark-reset-btn" id="ck-dark-reset-btn" title="Start fresh conversation">
                + New Request
              </button>
            </div>
          </div>

          <!-- Motion Text Strip (High-End Dark Ticker) -->
          <div class="ck-dark-motion-strip">
            <span class="ck-dark-motion-tag">⚡ Live Civic Dispatch:</span>
            <div class="ck-dark-motion-box">
              <span>“</span><span id="ck-dark-motion-target">2-foot rim-destroying pothole near FC College main gate</span><span class="ck-dark-cursor"></span><span>”</span>
            </div>
          </div>

          <!-- Embedded Conversation Thread (Inside same dark card; visible when messages exist) -->
          <div id="ck-dark-thread" class="ck-dark-thread" style="display:none;" role="log" aria-live="polite"></div>

          <!-- High-End Minimal Pill Input Bar -->
          <div class="ck-dark-input-wrap">
            <!-- File attachment preview chip -->
            <div id="ck-dark-file-preview" class="ck-dark-file-preview"></div>

            <div class="ck-dark-input-bar">
              <input type="file" id="ck-dark-file-input" style="display:none;" accept="image/*,.pdf,.doc,.docx,.txt,.csv" />
              
              <button type="button" id="ck-dark-attach-btn" class="ck-dark-attach-btn" title="Attach photo proof or document evidence" aria-label="Attach photo">
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
              </button>

              <input
                id="ck-dark-input"
                class="ck-dark-input"
                type="text"
                autocomplete="off"
                placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."
                aria-label="Civic assistant message input"
              />

              <button type="button" id="ck-dark-mic-btn" class="ck-dark-mic-btn" title="Voice dictation" aria-label="Voice dictation">
                ${bt.mic}
              </button>

              <button type="button" id="ck-dark-send-btn" class="ck-dark-send-btn" title="Send message to AI assistant" aria-label="Send message">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span>Send</span>
              </button>
            </div>
          </div>

          <!-- Small Cards / Chips (Minimal pills matching original update) -->
          <div class="ck-dark-suggestions" id="ck-dark-suggestions">
            <span class="ck-dark-chip" data-text="garbage not collected near FC road for 4 days">
              🗑️ Garbage complaint
            </span>
            <span class="ck-dark-chip" data-text="streetlights are completely broken and dark on our lane">
              💡 Broken streetlights
            </span>
            <span class="ck-dark-chip" data-text="deep dangerous pothole damaged vehicles on the main road">
              💥 Road pothole
            </span>
            <span class="ck-dark-chip" data-text="clean water pipeline leaking heavily onto the street">
              🚰 Water pipe leak
            </span>
            <span class="ck-dark-chip" data-text="I want to start a community cleanliness and greening drive">
              🌿 Start an initiative
            </span>
            <span class="ck-dark-chip" data-text="what is happening with my requests">
              📋 Check my status
            </span>
          </div>

        </section><!-- /.ck-agent-dark-card -->

        <!-- 2. Performance / Civic Overview Heading -->
        <div class="ck-rx-overview-head" style="margin-top:8px;">
          <h2 class="ck-rx-overview-title" style="font-size:1.4rem;">Neighborhood Gateways</h2>
          <p class="ck-rx-overview-sub">Direct access points to track, propose initiatives, and inspect governance records</p>
        </div>

        <!-- 3. Core Gateways (Connect seamlessly to the unified AI cockpit) -->
        <div class="ck-rx-actions-grid">
          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to report a problem: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${bt.alertTriangle}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Report a Problem</div>
              <div class="ck-rx-action-desc">Potholes, waste dumping, dark roads, or water leaks.</div>
            </div>
            <span class="ck-rx-action-arrow">${bt.arrowRight}</span>
          </div>

          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to start a community initiative: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${bt.lightbulb}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Start an Initiative</div>
              <div class="ck-rx-action-desc">Rally your neighbors for cleanups, greening & safety.</div>
            </div>
            <span class="ck-rx-action-arrow">${bt.arrowRight}</span>
          </div>

          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to contribute skills or volunteer for: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${bt.users}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">I want to Contribute</div>
              <div class="ck-rx-action-desc">Share professional skills, sponsor tools, or volunteer.</div>
            </div>
            <span class="ck-rx-action-arrow">${bt.arrowRight}</span>
          </div>

          <div class="ck-rx-action-card ck-gateway-trigger" data-gateway-prompt="I want to understand municipal bylaws, rights, and budget allocations for my ward: " style="cursor:pointer;">
            <div class="ck-rx-action-icon-box">
              ${bt.bookOpen}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Understand an Issue</div>
              <div class="ck-rx-action-desc">Look up municipal bylaws, ward budget allocations & rights.</div>
            </div>
            <span class="ck-rx-action-arrow">${bt.arrowRight}</span>
          </div>
        </div>

        <!-- 4. What's Happening Around You (Community Activity Grid) -->
        <div class="ck-rx-section-header">
          <div>
            <h3 class="ck-rx-section-title">Community Activity</h3>
            <p class="ck-rx-section-sub">Active civic operations and reported cases in your ward</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">View all ${bt.chevronRight}</a>
        </div>

        <div class="ck-rx-issues-grid">
          ${C}
        </div>

        <!-- 5. Trending in your city -->
        <div class="ck-rx-section-header" style="margin-top:36px;">
          <div>
            <h3 class="ck-rx-section-title">Trending in Your City</h3>
            <p class="ck-rx-section-sub">Top initiatives gaining citizen backing this week</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">See all ${bt.chevronRight}</a>
        </div>

        <div class="ck-rx-trending-list">
          ${w}
        </div>

      </main><!-- /.ck-rx-main -->

      <!-- ░░ RIGHT SIDEBAR (MINIMALIST REVENUEX STYLE) ░░ -->
      <aside class="ck-rx-aside">

        <!-- Inboxes / Quick Actions -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">My Inboxes</div>
          
          <a href="/entities" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${bt.clipboard}
            </div>
            <span class="ck-rx-inbox-label">My Requests</span>
            <span class="ck-rx-inbox-badge">${u+d}</span>
            <span class="ck-rx-inbox-chevron">${bt.chevronRight}</span>
          </a>

          <a href="/entities?following=1" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${bt.heart}
            </div>
            <span class="ck-rx-inbox-label">Following</span>
            <span class="ck-rx-inbox-badge">${m}</span>
            <span class="ck-rx-inbox-chevron">${bt.chevronRight}</span>
          </a>

          <a href="/entities?status=approved" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${bt.checkCircle}
            </div>
            <span class="ck-rx-inbox-label">Contributions</span>
            <span class="ck-rx-inbox-badge">${p}</span>
            <span class="ck-rx-inbox-chevron">${bt.chevronRight}</span>
          </a>
        </div>

        <!-- Civic Buzz Gallery Carousel (Rotating/Swipe photo function automatically per 1-2s) -->
        ${Wc()}
        <!-- Activity Overview -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Activity Snapshot</div>
          <div class="ck-rx-stat-row">
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num">${u}</span>
              <span class="ck-rx-stat-label">Active</span>
            </div>
            <div class="ck-rx-stat-divider"></div>
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num" style="color:#10b981;">${p}</span>
              <span class="ck-rx-stat-label">Resolved</span>
            </div>
            <div class="ck-rx-stat-divider"></div>
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num" style="color:#64748b;">${d}</span>
              <span class="ck-rx-stat-label">Drafts</span>
            </div>
          </div>
          <a href="/entities" class="btn btn-secondary btn-sm" style="width:100%; text-align:center; margin-top:12px;">
            View Full Records ${bt.chevronRight}
          </a>
        </div>

      </aside><!-- /.ck-rx-aside -->
    </div><!-- /.ck-rx-layout -->
  `,Kc(),Us()}const rs=["2-foot rim-destroying pothole near FC College main gate","6 dead streetlights plunging Model Colony into pitch darkness","Mount Everest of garbage decomposing outside city school","High-pressure municipal water pipe bursting on Baner road","Illegal construction trucks dumping concrete into the riverbed","Fallen banyan tree branch blocking emergency ambulance route","Open sewer chamber without any warning cones or safety cover","Ear-splitting illegal DJ loudspeakers blasting at 2:00 AM"];let Ye=null,ls=0,Xe=0,ra=!1;function Kc(i,a){let o="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),r=!1,l=null;const d=document.getElementById("ck-dark-input"),u=document.getElementById("ck-dark-send-btn"),p=document.getElementById("ck-dark-attach-btn"),m=document.getElementById("ck-dark-file-input"),f=document.getElementById("ck-dark-mic-btn"),v=document.getElementById("ck-dark-file-preview"),y=document.getElementById("ck-dark-thread"),_=document.getElementById("ck-dark-reset-btn");function b(){Ye&&clearTimeout(Ye);const N=document.getElementById("ck-dark-motion-target");if(!N)return;const E=rs[ls%rs.length];if(ra){if(Xe--,N.textContent=E.substring(0,Xe),Xe<=0){ra=!1,ls++,Ye=setTimeout(b,380);return}Ye=setTimeout(b,22)}else{if(Xe++,N.textContent=E.substring(0,Xe),Xe>=E.length){ra=!0,Ye=setTimeout(b,3200);return}Ye=setTimeout(b,42)}}b();function C(){var W;if(!v)return;if(!l){v.innerHTML="",v.style.display="none";return}const N=l.type.startsWith("image/"),E=N?URL.createObjectURL(l):null,I=l.size<1024*1024?(l.size/1024).toFixed(1)+" KB":(l.size/(1024*1024)).toFixed(1)+" MB";v.style.display="flex",v.innerHTML=`
      <div class="ck-dark-file-chip">
        ${N?`<img src="${E}" class="ck-dark-file-thumb" alt="Preview"/>`:"<span>📄</span>"}
        <span><strong>${ft(l.name)}</strong> (${I})</span>
        <button type="button" id="ck-dark-remove-file" class="ck-dark-file-remove" title="Remove attachment">&times;</button>
      </div>
    `,(W=document.getElementById("ck-dark-remove-file"))==null||W.addEventListener("click",()=>{l=null,m&&(m.value=""),C()})}p==null||p.addEventListener("click",()=>m==null?void 0:m.click()),m==null||m.addEventListener("change",N=>{var I;const E=(I=N.target.files)==null?void 0:I[0];E&&(l=E,C(),d==null||d.focus())}),f==null||f.addEventListener("click",()=>{f.classList.toggle("active"),f.classList.contains("active")?(d.placeholder="Listening live... say your complaint...",setTimeout(()=>{f.classList.contains("active")&&(d.value="Massive open pothole right outside Ferguson College gate causing traffic jam",f.classList.remove("active"),d.placeholder="Type your request here — e.g. 'garbage not collected near FC road'...",d.focus())},1800)):d.placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."});function w(N){if(!y)return;y.style.display="flex";const E=document.createElement("div");for(E.innerHTML=N;E.firstChild;)y.appendChild(E.firstChild);y.scrollTop=y.scrollHeight}function M(N,E=null){let I="";return E&&(E.isImage&&E.previewUrl?I=`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <img src="${ft(E.previewUrl)}" class="ck-dark-user-img" alt="Proof" />
            <div style="font-size:0.75rem;">
              <div>📷 <strong>${ft(E.name)}</strong></div>
              <div style="opacity:0.8;">${ft(E.sizeStr)}</div>
            </div>
          </div>
        `:I=`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:0.75rem;">
            <span>📄</span>
            <div><strong>${ft(E.name)}</strong> (${ft(E.sizeStr)})</div>
          </div>
        `),`
      <div class="ck-dark-msg-row ck-dark-msg-user">
        <div class="ck-dark-bubble-user">
          ${I}
          <div>${ft(N)}</div>
        </div>
      </div>
    `}function O(N){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent">
          ${ft(N||"").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}
        </div>
      </div>
    `}function P(){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent" id="ck-dark-thinking">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent" style="display:flex; align-items:center; gap:8px; padding:10px 16px;">
          <span style="font-size:0.8rem; font-weight:600; color:#ff7d5c;">Civic Assistant analyzing</span>
          <div class="agent-thinking-dots" style="padding:0;"><span></span><span></span><span></span></div>
        </div>
      </div>
    `}function V(N,E){const I=Array.isArray(N)?N.map(W=>`
      <div class="ck-dark-confirm-row">
        <span class="ck-dark-confirm-label">${ft(W.label)}</span>
        <span class="ck-dark-confirm-val">${ft(W.value)}</span>
      </div>
    `).join(""):"";return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#10b981; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ck-dark-confirm-card">
          <div class="ck-dark-confirm-title">
            <span>📝</span> Official Case Review — Ready to File
          </div>
          <p style="font-size:0.82rem; color:rgba(255,255,255,0.7); margin-bottom:12px;">
            ${ft((E||"").split(`

`)[0]||"Please review your complaint summary before official filing.")}
          </p>
          <div class="ck-dark-confirm-table">${I}</div>
          <div class="ck-dark-confirm-actions" id="ck-dark-confirm-actions">
            <button type="button" id="ck-dark-confirm-submit-btn" class="ck-dark-btn-primary">
              ✓ File Official Case
            </button>
            <button type="button" id="ck-dark-confirm-cancel-btn" class="ck-dark-btn-secondary">
              ✗ Modify / Cancel
            </button>
          </div>
        </div>
      </div>
    `}function F(N,E,I){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#16a34a; box-shadow:none;">
          <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="ck-dark-success-card">
          <div class="ck-dark-success-badge">
            <span>🎉</span> Official Case #${N} Registered!
          </div>
          <p style="font-size:0.85rem; color:#f1f5f9; margin-bottom:12px;">
            <strong>${ft(E||I)}</strong> has been officially logged and routed to Ward 14 Pune dispatch.
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="/entities/${N}" class="ck-dark-btn-primary">
              Inspect My Case →
            </a>
            <button type="button" id="ck-dark-new-case-btn" class="ck-dark-btn-secondary">
              + File Another Issue
            </button>
          </div>
        </div>
      </div>
    `}async function $(N,E=null){var at,Lt;const I=E||l,W=(N||"").trim();if(r||!W&&!I)return;r=!0;let Z=null;if(I){const G=I.type.startsWith("image/");Z={name:I.name,sizeStr:I.size<1024*1024?(I.size/1024).toFixed(1)+" KB":(I.size/(1024*1024)).toFixed(1)+" MB",isImage:G,previewUrl:G?URL.createObjectURL(I):null}}d&&(d.value=""),l=null,m&&(m.value=""),C(),w(M(W||(I?`Attached file: ${I.name}`:""),Z)),w(P()),u&&(u.disabled=!0);try{const G=await on.chat(o,W,I);(at=document.getElementById("ck-dark-thinking"))==null||at.remove();const R=G.data;R.type==="confirm"?(w(V(R.summary||[],R.text)),setTimeout(()=>{var K,rt;(K=document.getElementById("ck-dark-confirm-submit-btn"))==null||K.addEventListener("click",()=>{var H;(H=document.getElementById("ck-dark-confirm-actions"))==null||H.remove(),$("yes")}),(rt=document.getElementById("ck-dark-confirm-cancel-btn"))==null||rt.addEventListener("click",()=>{var H;(H=document.getElementById("ck-dark-confirm-actions"))==null||H.remove(),$("cancel")})},50)):R.type==="submitted"?(w(F(R.entity_id,R.entity_name,R.capability)),setTimeout(()=>{var K;(K=document.getElementById("ck-dark-new-case-btn"))==null||K.addEventListener("click",()=>{J()})},50)):w(O(R.text||"Understood. Please provide additional details or landmarks."))}catch(G){(Lt=document.getElementById("ck-dark-thinking"))==null||Lt.remove(),w(O("I encountered a connection hiccup with the AI dispatcher. Please try describing your issue again.")),console.error("[Cockpit Agent Error]:",G)}finally{r=!1,u&&(u.disabled=!1),d==null||d.focus()}}u==null||u.addEventListener("click",()=>{$(d==null?void 0:d.value)}),d==null||d.addEventListener("keydown",N=>{N.key==="Enter"&&!N.shiftKey&&(N.preventDefault(),$(d.value))}),document.querySelectorAll(".ck-dark-chip").forEach(N=>{N.addEventListener("click",()=>{const E=N.getAttribute("data-text");E&&$(E)})}),document.querySelectorAll(".ck-gateway-trigger").forEach(N=>{N.addEventListener("click",()=>{const E=N.getAttribute("data-gateway-prompt"),I=document.getElementById("ck-dark-cockpit");I&&I.scrollIntoView({behavior:"smooth",block:"center"}),d&&(d.value=E||"",d.focus())})});function J(){o&&on.clearSession(o),o="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),r=!1,l=null,m&&(m.value=""),C(),y&&(y.innerHTML="",y.style.display="none"),d==null||d.focus()}_==null||_.addEventListener("click",J)}function Jc(i){const a=[{name:"FC Road Pedestrian Crosswalk & Safety Lights",area:"Ward 14 · Shivajinagar",status:"coordinator_approved"},{name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",status:"approved"},{name:"Baner Sector 4 Waste Segregation Drive",area:"Ward 2 · Baner",status:"submitted"},{name:"Model Colony Park Solar Lighting Audit",area:"Ward 11 · Model Colony",status:"coordinator_approved"}],o=[...i];for(const r of a){if(o.length>=4)break;o.some(l=>l.name===r.name)||o.push(r)}return o}function Yc(){return[{rank:"01",name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",count:64},{rank:"02",name:"FC Road Pedestrian Safety & Zebra Crossings",area:"Ward 14 · Shivajinagar",count:52},{rank:"03",name:"Baner Wet-Waste Decentralized Composting",area:"Ward 2 · Baner",count:41}].map(a=>`
    <div class="ck-rx-trending-row">
      <span class="ck-rx-trending-num">${a.rank}</span>
      <div class="ck-rx-trending-info">
        <div class="ck-rx-trending-name">${a.name}</div>
        <div class="ck-rx-trending-sub">${a.area} · ${a.count} citizens backing</div>
      </div>
      <a href="/entities" class="ck-rx-trending-arrow">
        ${bt.chevronRight}
      </a>
    </div>
  `).join("")}async function Xc(i,a,o){var u;const r=a.assignedArea,l=await gt.list({status:"submitted",area:r,limit:10}),d=l.data||[];i.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${ft(r||"Sector 5")}</div>
      <span class="badge badge-primary">Area Coordinator</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((u=l.pagination)==null?void 0:u.total)||d.length}</div>
        <div class="kpi-label">Pending Area Verification</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Submitted cases in ${ft(r||"Sector 5")} awaiting verification</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
      </div>
      ${$a(d,!0)}
    </div>
  `}async function Qc(i,a,o){var d;const r=await gt.list({status:"submitted",area:"Unassigned",limit:10}),l=r.data||[];i.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (Handling Unassigned Areas & Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((d=r.pagination)==null?void 0:d.total)||l.length}</div>
        <div class="kpi-label">Unassigned Cases Awaiting Review</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Unassigned cases awaiting coordinator review</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
      </div>
      ${$a(l,!0)}
    </div>
  `}async function td(i,a,o){var d;const r=await gt.list({status:"coordinator_approved",limit:10}),l=r.data||[];i.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((d=r.pagination)==null?void 0:d.total)||l.length}</div>
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
      ${$a(l,!0)}
    </div>
  `}async function ed(i,a,o){var u,p,m;const[r,l,d]=await Promise.all([gt.list({limit:1}),gt.list({status:"submitted",limit:1}),gt.list({status:"approved",limit:1})]);i.innerHTML=`
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${((u=r.pagination)==null?void 0:u.total)||0}</div>
        <div class="kpi-label">Total System Cases</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${((p=l.pagination)==null?void 0:p.total)||0}</div>
        <div class="kpi-label">In Workflow</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${((m=d.pagination)==null?void 0:m.total)||0}</div>
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
  `}function $a(i,a=!1){if(!i||i.length===0)return`
      <div class="table-empty" style="padding:32px; text-align:center; color:var(--text-muted);">
        <p style="font-size:0.9rem; font-weight:500;">No active cases in this view.</p>
      </div>
    `;const o=i.map(r=>{var l,d;return`
    <tr>
      <td><a href="/entities/${r.entity_id}" class="text-link font-medium">#${r.entity_id}</a></td>
      <td>
        <a href="/entities/${r.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
          ${ft(r.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${ft(((l=r.entityType)==null?void 0:l.name)||"Capability")}</span></td>
      ${a?`<td>${ft(((d=r.owner)==null?void 0:d.name)||"System")}</td>`:""}
      <td>${ft(r.area||"—")}</td>
      <td><span class="badge badge-${r.status}">${Oe(r.status)}</span></td>
      <td><a href="/entities/${r.entity_id}" class="btn btn-secondary btn-sm">Review →</a></td>
    </tr>
  `}).join("");return`
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case / Request Title</th>
            <th>Capability Type</th>
            ${a?"<th>Submitted By</th>":""}
            <th>Area</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${o}
        </tbody>
      </table>
    </div>
  `}function de(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let ct={page:1,limit:20},ki=[];async function id(i={},a=null){if(!he(X))return;const o=a||new URLSearchParams(window.location.search);o.has("status")?ct.status=o.get("status"):delete ct.status,o.has("entity_type_id")?ct.entity_type_id=o.get("entity_type_id"):delete ct.entity_type_id,o.has("name")?ct.name=o.get("name"):delete ct.name,o.has("page")?ct.page=Number(o.get("page")):ct.page=1;const r=qt(),d=hn()==="citizen";d&&(r!=null&&r.user_id)?ct.owner_user_id=r.user_id:delete ct.owner_user_id;try{ki=(await gt.listTypes().catch(()=>({data:[]}))).data||[]}catch{ki=[]}const u=ki.find(b=>String(b.entity_type_id)===String(ct.entity_type_id)),p=pe(u);let m="All Cases & Requests",f="Browse, search, and track all civic cases and requests across your workspace.";d?(m=u?`My ${p.title} Requests`:"My Civic Activity",f=u?`Tracking cases initiated by you for capability "${p.title}".`:"Track, review, and manage civic cases and initiatives initiated by you."):u&&(m=`${p.title} Cases`,f=`Browsing cases for capability "${p.title}".`);const v=document.getElementById("app");v.innerHTML=kt(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${de(m)}</h1>
        <p id="entities-header-subtitle">${de(f)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${ct.entity_type_id?`?entity_type_id=${ct.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
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
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${de(ct.name||"")}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${ki.map(b=>{const C=pe(b);return`<option value="${b.entity_type_id}" ${String(ct.entity_type_id)===String(b.entity_type_id)?"selected":""}>${de(C.title)}</option>`}).join("")}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${ct.status==="draft"?"selected":""}>Draft</option>
            <option value="submitted" ${ct.status==="submitted"?"selected":""}>Submitted</option>
            <option value="coordinator_approved" ${ct.status==="coordinator_approved"?"selected":""}>Verified (Pending Approval)</option>
            <option value="approved" ${ct.status==="approved"?"selected":""}>Approved & Active</option>
            <option value="rejected" ${ct.status==="rejected"?"selected":""}>Rejected</option>
            <option value="closed" ${ct.status==="closed"?"selected":""}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${ct.status||ct.entity_type_id||ct.name?`
            <button id="btn-clear-filter" class="btn btn-secondary" style="height: 42px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Reset
            </button>
          `:""}
        </div>
      </div>
    </div>
    
    <div id="ck-buzz-drafts-section"></div>
    <div id="entities-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,m,ki),zt();const y=()=>{const b=document.getElementById("filter-status").value,C=document.getElementById("filter-type").value,w=document.getElementById("filter-search").value.trim(),M=new URLSearchParams;b&&M.set("status",b),C&&M.set("entity_type_id",C),w&&M.set("name",w),X(`/entities${M.toString()?"?"+M.toString():""}`)};document.getElementById("btn-filter").addEventListener("click",y),document.getElementById("filter-search").addEventListener("keypress",b=>{b.key==="Enter"&&y()});const _=document.getElementById("btn-clear-filter");_&&_.addEventListener("click",()=>{X("/entities")}),await Zs()}async function Zs(){const i=document.getElementById("entities-content");if(!i)return;ya();const o=hn()==="citizen";try{const r=await gt.list(ct),{data:l,pagination:d}=r;if(!l||l.length===0){i.innerHTML=`
        <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">
            ${o?"No civic activity yet":"No cases found"}
          </h3>
          <p style="font-size:0.875rem; color:var(--text-muted); max-width:420px; margin:0 auto 20px;">
            ${o?"You have not initiated any civic cases, reports, or applications yet. Start a new civic action to get started.":"No civic cases match your filter. Try adjusting your query or starting a new civic action."}
          </p>
          <div style="display:flex; gap:12px; justify-content:center;">
            ${ct.status||ct.entity_type_id||ct.name?`
              <a href="/entities" class="btn btn-secondary">Clear Filters</a>
            `:""}
            <a href="/entities/new${ct.entity_type_id?`?entity_type_id=${ct.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;return}const u=l.map(y=>{var b;const _=pe(y.entityType);return`
        <tr>
          <td><a href="/entities/${y.entity_id}" class="text-link font-medium">#PR-${String(y.entity_id).padStart(5,"0")}</a></td>
          <td>
            <a href="/entities/${y.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${de(y.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${de(_.shortTitle)}</span></td>
          ${o?"":`<td>${de(((b=y.owner)==null?void 0:b.name)||"System")}</td>`}
          <td>${de(y.area||"—")}</td>
          <td><span class="badge badge-${y.status}">${Oe(y.status)}</span></td>
          <td>
            <a href="/entities/${y.entity_id}" class="btn btn-secondary btn-sm">${o?"View Details →":"Review Case →"}</a>
          </td>
        </tr>
      `}).join(""),p=Math.ceil(d.total/d.limit);let m="";p>1&&(m=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 8px;">
          <div style="font-size:0.85rem; color:var(--text-muted);">
            Showing page ${d.page} of ${p} (${d.total} total cases)
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-prev" ${d.page<=1?"disabled":""}>← Previous</button>
            <button class="btn btn-secondary btn-sm" id="btn-next" ${d.page>=p?"disabled":""}>Next →</button>
          </div>
        </div>
      `),i.innerHTML=`
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Capability Type</th>
                ${o?"":"<th>Submitted By</th>"}
                <th>Area / Jurisdiction</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${u}
            </tbody>
          </table>
        </div>
      </div>
      ${m}
    `;const f=document.getElementById("btn-prev"),v=document.getElementById("btn-next");f&&f.addEventListener("click",()=>{const y=new URLSearchParams(window.location.search);y.set("page",String(ct.page-1)),X(`/entities?${y.toString()}`)}),v&&v.addEventListener("click",()=>{const y=new URLSearchParams(window.location.search);y.set("page",String(ct.page+1)),X(`/entities?${y.toString()}`)}),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{Q("Failed to load cases"),i.innerHTML='<div class="alert alert-error">Error loading cases. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}async function ya(){var o;const i=document.getElementById("ck-buzz-drafts-section");if(!i)return;if(!qt()){i.innerHTML="";return}try{const l=(await mt.list({status:"draft",limit:10})).data||[];if(l.length===0){i.innerHTML="";return}i.innerHTML=`
      <div class="ck-buzz-drafts-card">
        <div class="ck-buzz-drafts-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">📝</span>
            <div>
              <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0;">
                My Civic Buzz Drafts (${l.length})
              </h3>
              <p style="font-size:0.78rem; color:#64748b; margin:2px 0 0;">
                Saved Civic Buzz cards waiting to be published to your community.
              </p>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="ck-draft-new-btn" style="border-radius:999px; font-weight:700;">
            + Create Buzz
          </button>
        </div>

        <div class="ck-buzz-drafts-grid">
          ${l.map(d=>`
            <div class="ck-buzz-draft-item">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span class="ck-buzz-badge-pill" style="font-size:0.65rem;">
                    ${d.template==="initiative"?"🌱 INITIATIVE":d.template==="awareness"?"📢 AWARENESS":"🔥 MEME"}
                  </span>
                  <span style="font-size:0.7rem; color:#94a3b8;">${new Date(d.created_at).toLocaleDateString()}</span>
                </div>
                <div style="font-weight:700; font-size:0.9rem; color:#0f172a; line-height:1.3; margin-bottom:4px;">
                  "${de(d.caption)}"
                </div>
                ${d.linked_title?`
                  <div style="font-size:0.75rem; color:#64748b;">
                    Linked: #${d.linked_id} ${de(d.linked_title)}
                  </div>
                `:""}
              </div>

              <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #e2e8f0; padding-top:10px;">
                <button type="button" class="btn btn-primary btn-sm ck-draft-edit-btn" data-id="${d.id}" style="border-radius:999px; font-weight:700;">
                  Edit / Publish →
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,(o=i.querySelector("#ck-draft-new-btn"))==null||o.addEventListener("click",()=>{$i(null,()=>ya())}),i.querySelectorAll(".ck-draft-edit-btn").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.getAttribute("data-id")),p=l.find(m=>m.id===u);p&&$i(p.linked_id,()=>{ya(),Zs()},p)})})}catch{i.innerHTML=""}}let cn=null;function ba({title:i,content:a,footer:o="",onClose:r=()=>{}}){ni();const l=document.getElementById("modal-container"),d=`
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${nd(i)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${a}
      </div>
      ${o?`<div class="modal-footer">${o}</div>`:""}
    </div>
  `;l.innerHTML=d,l.style.pointerEvents="auto";const u=()=>{l.innerHTML="",l.style.pointerEvents="none",cn=null,r()};cn=u,document.getElementById("modal-close-btn").addEventListener("click",u),document.getElementById("modal-backdrop").addEventListener("click",u);const p=m=>{m.key==="Escape"&&(u(),document.removeEventListener("keydown",p))};document.addEventListener("keydown",p)}function ni(){cn&&cn()}function nd(i){return String(i).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var ad=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function od(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var xa={exports:{}};/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */(function(i,a){(function(o,r){r(a)})(ad,function(o){var r="1.9.4";function l(t){var e,n,s,c;for(n=1,s=arguments.length;n<s;n++){c=arguments[n];for(e in c)t[e]=c[e]}return t}var d=Object.create||function(){function t(){}return function(e){return t.prototype=e,new t}}();function u(t,e){var n=Array.prototype.slice;if(t.bind)return t.bind.apply(t,n.call(arguments,1));var s=n.call(arguments,2);return function(){return t.apply(e,s.length?s.concat(n.call(arguments)):arguments)}}var p=0;function m(t){return"_leaflet_id"in t||(t._leaflet_id=++p),t._leaflet_id}function f(t,e,n){var s,c,h,g;return g=function(){s=!1,c&&(h.apply(n,c),c=!1)},h=function(){s?c=arguments:(t.apply(n,arguments),setTimeout(g,e),s=!0)},h}function v(t,e,n){var s=e[1],c=e[0],h=s-c;return t===s&&n?t:((t-c)%h+h)%h+c}function y(){return!1}function _(t,e){if(e===!1)return t;var n=Math.pow(10,e===void 0?6:e);return Math.round(t*n)/n}function b(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function C(t){return b(t).split(/\s+/)}function w(t,e){Object.prototype.hasOwnProperty.call(t,"options")||(t.options=t.options?d(t.options):{});for(var n in e)t.options[n]=e[n];return t.options}function M(t,e,n){var s=[];for(var c in t)s.push(encodeURIComponent(n?c.toUpperCase():c)+"="+encodeURIComponent(t[c]));return(!e||e.indexOf("?")===-1?"?":"&")+s.join("&")}var O=/\{ *([\w_ -]+) *\}/g;function P(t,e){return t.replace(O,function(n,s){var c=e[s];if(c===void 0)throw new Error("No value provided for variable "+n);return typeof c=="function"&&(c=c(e)),c})}var V=Array.isArray||function(t){return Object.prototype.toString.call(t)==="[object Array]"};function F(t,e){for(var n=0;n<t.length;n++)if(t[n]===e)return n;return-1}var $="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";function J(t){return window["webkit"+t]||window["moz"+t]||window["ms"+t]}var N=0;function E(t){var e=+new Date,n=Math.max(0,16-(e-N));return N=e+n,window.setTimeout(t,n)}var I=window.requestAnimationFrame||J("RequestAnimationFrame")||E,W=window.cancelAnimationFrame||J("CancelAnimationFrame")||J("CancelRequestAnimationFrame")||function(t){window.clearTimeout(t)};function Z(t,e,n){if(n&&I===E)t.call(e);else return I.call(window,u(t,e))}function at(t){t&&W.call(window,t)}var Lt={__proto__:null,extend:l,create:d,bind:u,get lastId(){return p},stamp:m,throttle:f,wrapNum:v,falseFn:y,formatNum:_,trim:b,splitWords:C,setOptions:w,getParamString:M,template:P,isArray:V,indexOf:F,emptyImageUrl:$,requestFn:I,cancelFn:W,requestAnimFrame:Z,cancelAnimFrame:at};function G(){}G.extend=function(t){var e=function(){w(this),this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},n=e.__super__=this.prototype,s=d(n);s.constructor=e,e.prototype=s;for(var c in this)Object.prototype.hasOwnProperty.call(this,c)&&c!=="prototype"&&c!=="__super__"&&(e[c]=this[c]);return t.statics&&l(e,t.statics),t.includes&&(R(t.includes),l.apply(null,[s].concat(t.includes))),l(s,t),delete s.statics,delete s.includes,s.options&&(s.options=n.options?d(n.options):{},l(s.options,t.options)),s._initHooks=[],s.callInitHooks=function(){if(!this._initHooksCalled){n.callInitHooks&&n.callInitHooks.call(this),this._initHooksCalled=!0;for(var h=0,g=s._initHooks.length;h<g;h++)s._initHooks[h].call(this)}},e},G.include=function(t){var e=this.prototype.options;return l(this.prototype,t),t.options&&(this.prototype.options=e,this.mergeOptions(t.options)),this},G.mergeOptions=function(t){return l(this.prototype.options,t),this},G.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),n=typeof t=="function"?t:function(){this[t].apply(this,e)};return this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(n),this};function R(t){if(!(typeof L>"u"||!L||!L.Mixin)){t=V(t)?t:[t];for(var e=0;e<t.length;e++)t[e]===L.Mixin.Events&&console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",new Error().stack)}}var K={on:function(t,e,n){if(typeof t=="object")for(var s in t)this._on(s,t[s],e);else{t=C(t);for(var c=0,h=t.length;c<h;c++)this._on(t[c],e,n)}return this},off:function(t,e,n){if(!arguments.length)delete this._events;else if(typeof t=="object")for(var s in t)this._off(s,t[s],e);else{t=C(t);for(var c=arguments.length===1,h=0,g=t.length;h<g;h++)c?this._off(t[h]):this._off(t[h],e,n)}return this},_on:function(t,e,n,s){if(typeof e!="function"){console.warn("wrong listener type: "+typeof e);return}if(this._listens(t,e,n)===!1){n===this&&(n=void 0);var c={fn:e,ctx:n};s&&(c.once=!0),this._events=this._events||{},this._events[t]=this._events[t]||[],this._events[t].push(c)}},_off:function(t,e,n){var s,c,h;if(this._events&&(s=this._events[t],!!s)){if(arguments.length===1){if(this._firingCount)for(c=0,h=s.length;c<h;c++)s[c].fn=y;delete this._events[t];return}if(typeof e!="function"){console.warn("wrong listener type: "+typeof e);return}var g=this._listens(t,e,n);if(g!==!1){var x=s[g];this._firingCount&&(x.fn=y,this._events[t]=s=s.slice()),s.splice(g,1)}}},fire:function(t,e,n){if(!this.listens(t,n))return this;var s=l({},e,{type:t,target:this,sourceTarget:e&&e.sourceTarget||this});if(this._events){var c=this._events[t];if(c){this._firingCount=this._firingCount+1||1;for(var h=0,g=c.length;h<g;h++){var x=c[h],k=x.fn;x.once&&this.off(t,k,x.ctx),k.call(x.ctx||this,s)}this._firingCount--}}return n&&this._propagateEvent(s),this},listens:function(t,e,n,s){typeof t!="string"&&console.warn('"string" type argument expected');var c=e;typeof e!="function"&&(s=!!e,c=void 0,n=void 0);var h=this._events&&this._events[t];if(h&&h.length&&this._listens(t,c,n)!==!1)return!0;if(s){for(var g in this._eventParents)if(this._eventParents[g].listens(t,e,n,s))return!0}return!1},_listens:function(t,e,n){if(!this._events)return!1;var s=this._events[t]||[];if(!e)return!!s.length;n===this&&(n=void 0);for(var c=0,h=s.length;c<h;c++)if(s[c].fn===e&&s[c].ctx===n)return c;return!1},once:function(t,e,n){if(typeof t=="object")for(var s in t)this._on(s,t[s],e,!0);else{t=C(t);for(var c=0,h=t.length;c<h;c++)this._on(t[c],e,n,!0)}return this},addEventParent:function(t){return this._eventParents=this._eventParents||{},this._eventParents[m(t)]=t,this},removeEventParent:function(t){return this._eventParents&&delete this._eventParents[m(t)],this},_propagateEvent:function(t){for(var e in this._eventParents)this._eventParents[e].fire(t.type,l({layer:t.target,propagatedFrom:t.target},t),!0)}};K.addEventListener=K.on,K.removeEventListener=K.clearAllEventListeners=K.off,K.addOneTimeEventListener=K.once,K.fireEvent=K.fire,K.hasEventListeners=K.listens;var rt=G.extend(K);function H(t,e,n){this.x=n?Math.round(t):t,this.y=n?Math.round(e):e}var Ht=Math.trunc||function(t){return t>0?Math.floor(t):Math.ceil(t)};H.prototype={clone:function(){return new H(this.x,this.y)},add:function(t){return this.clone()._add(j(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(j(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},scaleBy:function(t){return new H(this.x*t.x,this.y*t.y)},unscaleBy:function(t){return new H(this.x/t.x,this.y/t.y)},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},trunc:function(){return this.clone()._trunc()},_trunc:function(){return this.x=Ht(this.x),this.y=Ht(this.y),this},distanceTo:function(t){t=j(t);var e=t.x-this.x,n=t.y-this.y;return Math.sqrt(e*e+n*n)},equals:function(t){return t=j(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=j(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+_(this.x)+", "+_(this.y)+")"}};function j(t,e,n){return t instanceof H?t:V(t)?new H(t[0],t[1]):t==null?t:typeof t=="object"&&"x"in t&&"y"in t?new H(t.x,t.y):new H(t,e,n)}function q(t,e){if(t)for(var n=e?[t,e]:t,s=0,c=n.length;s<c;s++)this.extend(n[s])}q.prototype={extend:function(t){var e,n;if(!t)return this;if(t instanceof H||typeof t[0]=="number"||"x"in t)e=n=j(t);else if(t=st(t),e=t.min,n=t.max,!e||!n)return this;return!this.min&&!this.max?(this.min=e.clone(),this.max=n.clone()):(this.min.x=Math.min(e.x,this.min.x),this.max.x=Math.max(n.x,this.max.x),this.min.y=Math.min(e.y,this.min.y),this.max.y=Math.max(n.y,this.max.y)),this},getCenter:function(t){return j((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return j(this.min.x,this.max.y)},getTopRight:function(){return j(this.max.x,this.min.y)},getTopLeft:function(){return this.min},getBottomRight:function(){return this.max},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,n;return typeof t[0]=="number"||t instanceof H?t=j(t):t=st(t),t instanceof q?(e=t.min,n=t.max):e=n=t,e.x>=this.min.x&&n.x<=this.max.x&&e.y>=this.min.y&&n.y<=this.max.y},intersects:function(t){t=st(t);var e=this.min,n=this.max,s=t.min,c=t.max,h=c.x>=e.x&&s.x<=n.x,g=c.y>=e.y&&s.y<=n.y;return h&&g},overlaps:function(t){t=st(t);var e=this.min,n=this.max,s=t.min,c=t.max,h=c.x>e.x&&s.x<n.x,g=c.y>e.y&&s.y<n.y;return h&&g},isValid:function(){return!!(this.min&&this.max)},pad:function(t){var e=this.min,n=this.max,s=Math.abs(e.x-n.x)*t,c=Math.abs(e.y-n.y)*t;return st(j(e.x-s,e.y-c),j(n.x+s,n.y+c))},equals:function(t){return t?(t=st(t),this.min.equals(t.getTopLeft())&&this.max.equals(t.getBottomRight())):!1}};function st(t,e){return!t||t instanceof q?t:new q(t,e)}function vt(t,e){if(t)for(var n=e?[t,e]:t,s=0,c=n.length;s<c;s++)this.extend(n[s])}vt.prototype={extend:function(t){var e=this._southWest,n=this._northEast,s,c;if(t instanceof dt)s=t,c=t;else if(t instanceof vt){if(s=t._southWest,c=t._northEast,!s||!c)return this}else return t?this.extend(nt(t)||ht(t)):this;return!e&&!n?(this._southWest=new dt(s.lat,s.lng),this._northEast=new dt(c.lat,c.lng)):(e.lat=Math.min(s.lat,e.lat),e.lng=Math.min(s.lng,e.lng),n.lat=Math.max(c.lat,n.lat),n.lng=Math.max(c.lng,n.lng)),this},pad:function(t){var e=this._southWest,n=this._northEast,s=Math.abs(e.lat-n.lat)*t,c=Math.abs(e.lng-n.lng)*t;return new vt(new dt(e.lat-s,e.lng-c),new dt(n.lat+s,n.lng+c))},getCenter:function(){return new dt((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new dt(this.getNorth(),this.getWest())},getSouthEast:function(){return new dt(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){typeof t[0]=="number"||t instanceof dt||"lat"in t?t=nt(t):t=ht(t);var e=this._southWest,n=this._northEast,s,c;return t instanceof vt?(s=t.getSouthWest(),c=t.getNorthEast()):s=c=t,s.lat>=e.lat&&c.lat<=n.lat&&s.lng>=e.lng&&c.lng<=n.lng},intersects:function(t){t=ht(t);var e=this._southWest,n=this._northEast,s=t.getSouthWest(),c=t.getNorthEast(),h=c.lat>=e.lat&&s.lat<=n.lat,g=c.lng>=e.lng&&s.lng<=n.lng;return h&&g},overlaps:function(t){t=ht(t);var e=this._southWest,n=this._northEast,s=t.getSouthWest(),c=t.getNorthEast(),h=c.lat>e.lat&&s.lat<n.lat,g=c.lng>e.lng&&s.lng<n.lng;return h&&g},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t,e){return t?(t=ht(t),this._southWest.equals(t.getSouthWest(),e)&&this._northEast.equals(t.getNorthEast(),e)):!1},isValid:function(){return!!(this._southWest&&this._northEast)}};function ht(t,e){return t instanceof vt?t:new vt(t,e)}function dt(t,e,n){if(isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=+t,this.lng=+e,n!==void 0&&(this.alt=+n)}dt.prototype={equals:function(t,e){if(!t)return!1;t=nt(t);var n=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return n<=(e===void 0?1e-9:e)},toString:function(t){return"LatLng("+_(this.lat,t)+", "+_(this.lng,t)+")"},distanceTo:function(t){return xe.distance(this,nt(t))},wrap:function(){return xe.wrapLatLng(this)},toBounds:function(t){var e=180*t/40075017,n=e/Math.cos(Math.PI/180*this.lat);return ht([this.lat-e,this.lng-n],[this.lat+e,this.lng+n])},clone:function(){return new dt(this.lat,this.lng,this.alt)}};function nt(t,e,n){return t instanceof dt?t:V(t)&&typeof t[0]!="object"?t.length===3?new dt(t[0],t[1],t[2]):t.length===2?new dt(t[0],t[1]):null:t==null?t:typeof t=="object"&&"lat"in t?new dt(t.lat,"lng"in t?t.lng:t.lon,t.alt):e===void 0?null:new dt(t,e,n)}var me={latLngToPoint:function(t,e){var n=this.projection.project(t),s=this.scale(e);return this.transformation._transform(n,s)},pointToLatLng:function(t,e){var n=this.scale(e),s=this.transformation.untransform(t,n);return this.projection.unproject(s)},project:function(t){return this.projection.project(t)},unproject:function(t){return this.projection.unproject(t)},scale:function(t){return 256*Math.pow(2,t)},zoom:function(t){return Math.log(t/256)/Math.LN2},getProjectedBounds:function(t){if(this.infinite)return null;var e=this.projection.bounds,n=this.scale(t),s=this.transformation.transform(e.min,n),c=this.transformation.transform(e.max,n);return new q(s,c)},infinite:!1,wrapLatLng:function(t){var e=this.wrapLng?v(t.lng,this.wrapLng,!0):t.lng,n=this.wrapLat?v(t.lat,this.wrapLat,!0):t.lat,s=t.alt;return new dt(n,e,s)},wrapLatLngBounds:function(t){var e=t.getCenter(),n=this.wrapLatLng(e),s=e.lat-n.lat,c=e.lng-n.lng;if(s===0&&c===0)return t;var h=t.getSouthWest(),g=t.getNorthEast(),x=new dt(h.lat-s,h.lng-c),k=new dt(g.lat-s,g.lng-c);return new vt(x,k)}},xe=l({},me,{wrapLng:[-180,180],R:6371e3,distance:function(t,e){var n=Math.PI/180,s=t.lat*n,c=e.lat*n,h=Math.sin((e.lat-t.lat)*n/2),g=Math.sin((e.lng-t.lng)*n/2),x=h*h+Math.cos(s)*Math.cos(c)*g*g,k=2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));return this.R*k}}),Oa=6378137,wn={R:Oa,MAX_LATITUDE:85.0511287798,project:function(t){var e=Math.PI/180,n=this.MAX_LATITUDE,s=Math.max(Math.min(n,t.lat),-n),c=Math.sin(s*e);return new H(this.R*t.lng*e,this.R*Math.log((1+c)/(1-c))/2)},unproject:function(t){var e=180/Math.PI;return new dt((2*Math.atan(Math.exp(t.y/this.R))-Math.PI/2)*e,t.x*e/this.R)},bounds:function(){var t=Oa*Math.PI;return new q([-t,-t],[t,t])}()};function kn(t,e,n,s){if(V(t)){this._a=t[0],this._b=t[1],this._c=t[2],this._d=t[3];return}this._a=t,this._b=e,this._c=n,this._d=s}kn.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new H((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}};function li(t,e,n,s){return new kn(t,e,n,s)}var zn=l({},xe,{code:"EPSG:3857",projection:wn,transformation:function(){var t=.5/(Math.PI*wn.R);return li(t,.5,-t,.5)}()}),nr=l({},zn,{code:"EPSG:900913"});function Ha(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function Na(t,e){var n="",s,c,h,g,x,k;for(s=0,h=t.length;s<h;s++){for(x=t[s],c=0,g=x.length;c<g;c++)k=x[c],n+=(c?"L":"M")+k.x+" "+k.y;n+=e?D.svg?"z":"x":""}return n||"M0 0"}var Ln=document.documentElement.style,Ai="ActiveXObject"in window,ar=Ai&&!document.addEventListener,ja="msLaunchUri"in navigator&&!("documentMode"in document),Cn=oe("webkit"),Da=oe("android"),Fa=oe("android 2")||oe("android 3"),or=parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1],10),sr=Da&&oe("Google")&&or<537&&!("AudioNode"in window),En=!!window.opera,qa=!ja&&oe("chrome"),Ua=oe("gecko")&&!Cn&&!En&&!Ai,rr=!qa&&oe("safari"),Za=oe("phantom"),Va="OTransition"in Ln,lr=navigator.platform.indexOf("Win")===0,Wa=Ai&&"transition"in Ln,Tn="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!Fa,Ga="MozPerspective"in Ln,cr=!window.L_DISABLE_3D&&(Wa||Tn||Ga)&&!Va&&!Za,ci=typeof orientation<"u"||oe("mobile"),dr=ci&&Cn,ur=ci&&Tn,Ka=!window.PointerEvent&&window.MSPointerEvent,Ja=!!(window.PointerEvent||Ka),Ya="ontouchstart"in window||!!window.TouchEvent,pr=!window.L_NO_TOUCH&&(Ya||Ja),hr=ci&&En,mr=ci&&Ua,fr=(window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI)>1,vr=function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("testPassiveEventSupport",y,e),window.removeEventListener("testPassiveEventSupport",y,e)}catch{}return t}(),gr=function(){return!!document.createElement("canvas").getContext}(),Sn=!!(document.createElementNS&&Ha("svg").createSVGRect),yr=!!Sn&&function(){var t=document.createElement("div");return t.innerHTML="<svg/>",(t.firstChild&&t.firstChild.namespaceURI)==="http://www.w3.org/2000/svg"}(),br=!Sn&&function(){try{var t=document.createElement("div");t.innerHTML='<v:shape adj="1"/>';var e=t.firstChild;return e.style.behavior="url(#default#VML)",e&&typeof e.adj=="object"}catch{return!1}}(),xr=navigator.platform.indexOf("Mac")===0,_r=navigator.platform.indexOf("Linux")===0;function oe(t){return navigator.userAgent.toLowerCase().indexOf(t)>=0}var D={ie:Ai,ielt9:ar,edge:ja,webkit:Cn,android:Da,android23:Fa,androidStock:sr,opera:En,chrome:qa,gecko:Ua,safari:rr,phantom:Za,opera12:Va,win:lr,ie3d:Wa,webkit3d:Tn,gecko3d:Ga,any3d:cr,mobile:ci,mobileWebkit:dr,mobileWebkit3d:ur,msPointer:Ka,pointer:Ja,touch:pr,touchNative:Ya,mobileOpera:hr,mobileGecko:mr,retina:fr,passiveEvents:vr,canvas:gr,svg:Sn,vml:br,inlineSvg:yr,mac:xr,linux:_r},Xa=D.msPointer?"MSPointerDown":"pointerdown",Qa=D.msPointer?"MSPointerMove":"pointermove",to=D.msPointer?"MSPointerUp":"pointerup",eo=D.msPointer?"MSPointerCancel":"pointercancel",Mn={touchstart:Xa,touchmove:Qa,touchend:to,touchcancel:eo},io={touchstart:Er,touchmove:Bi,touchend:Bi,touchcancel:Bi},je={},no=!1;function wr(t,e,n){return e==="touchstart"&&Cr(),io[e]?(n=io[e].bind(this,n),t.addEventListener(Mn[e],n,!1),n):(console.warn("wrong event specified:",e),y)}function kr(t,e,n){if(!Mn[e]){console.warn("wrong event specified:",e);return}t.removeEventListener(Mn[e],n,!1)}function zr(t){je[t.pointerId]=t}function Lr(t){je[t.pointerId]&&(je[t.pointerId]=t)}function ao(t){delete je[t.pointerId]}function Cr(){no||(document.addEventListener(Xa,zr,!0),document.addEventListener(Qa,Lr,!0),document.addEventListener(to,ao,!0),document.addEventListener(eo,ao,!0),no=!0)}function Bi(t,e){if(e.pointerType!==(e.MSPOINTER_TYPE_MOUSE||"mouse")){e.touches=[];for(var n in je)e.touches.push(je[n]);e.changedTouches=[e],t(e)}}function Er(t,e){e.MSPOINTER_TYPE_TOUCH&&e.pointerType===e.MSPOINTER_TYPE_TOUCH&&At(e),Bi(t,e)}function Tr(t){var e={},n,s;for(s in t)n=t[s],e[s]=n&&n.bind?n.bind(t):n;return t=e,e.type="dblclick",e.detail=2,e.isTrusted=!1,e._simulated=!0,e}var Sr=200;function Mr(t,e){t.addEventListener("dblclick",e);var n=0,s;function c(h){if(h.detail!==1){s=h.detail;return}if(!(h.pointerType==="mouse"||h.sourceCapabilities&&!h.sourceCapabilities.firesTouchEvents)){var g=co(h);if(!(g.some(function(k){return k instanceof HTMLLabelElement&&k.attributes.for})&&!g.some(function(k){return k instanceof HTMLInputElement||k instanceof HTMLSelectElement}))){var x=Date.now();x-n<=Sr?(s++,s===2&&e(Tr(h))):s=1,n=x}}}return t.addEventListener("click",c),{dblclick:e,simDblclick:c}}function $r(t,e){t.removeEventListener("dblclick",e.dblclick),t.removeEventListener("click",e.simDblclick)}var $n=Hi(["transform","webkitTransform","OTransform","MozTransform","msTransform"]),di=Hi(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),oo=di==="webkitTransition"||di==="OTransition"?di+"End":"transitionend";function so(t){return typeof t=="string"?document.getElementById(t):t}function ui(t,e){var n=t.style[e]||t.currentStyle&&t.currentStyle[e];if((!n||n==="auto")&&document.defaultView){var s=document.defaultView.getComputedStyle(t,null);n=s?s[e]:null}return n==="auto"?null:n}function lt(t,e,n){var s=document.createElement(t);return s.className=e||"",n&&n.appendChild(s),s}function wt(t){var e=t.parentNode;e&&e.removeChild(t)}function Ri(t){for(;t.firstChild;)t.removeChild(t.firstChild)}function De(t){var e=t.parentNode;e&&e.lastChild!==t&&e.appendChild(t)}function Fe(t){var e=t.parentNode;e&&e.firstChild!==t&&e.insertBefore(t,e.firstChild)}function In(t,e){if(t.classList!==void 0)return t.classList.contains(e);var n=Oi(t);return n.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(n)}function tt(t,e){if(t.classList!==void 0)for(var n=C(e),s=0,c=n.length;s<c;s++)t.classList.add(n[s]);else if(!In(t,e)){var h=Oi(t);Pn(t,(h?h+" ":"")+e)}}function Tt(t,e){t.classList!==void 0?t.classList.remove(e):Pn(t,b((" "+Oi(t)+" ").replace(" "+e+" "," ")))}function Pn(t,e){t.className.baseVal===void 0?t.className=e:t.className.baseVal=e}function Oi(t){return t.correspondingElement&&(t=t.correspondingElement),t.className.baseVal===void 0?t.className:t.className.baseVal}function Jt(t,e){"opacity"in t.style?t.style.opacity=e:"filter"in t.style&&Ir(t,e)}function Ir(t,e){var n=!1,s="DXImageTransform.Microsoft.Alpha";try{n=t.filters.item(s)}catch{if(e===1)return}e=Math.round(e*100),n?(n.Enabled=e!==100,n.Opacity=e):t.style.filter+=" progid:"+s+"(opacity="+e+")"}function Hi(t){for(var e=document.documentElement.style,n=0;n<t.length;n++)if(t[n]in e)return t[n];return!1}function Te(t,e,n){var s=e||new H(0,0);t.style[$n]=(D.ie3d?"translate("+s.x+"px,"+s.y+"px)":"translate3d("+s.x+"px,"+s.y+"px,0)")+(n?" scale("+n+")":"")}function St(t,e){t._leaflet_pos=e,D.any3d?Te(t,e):(t.style.left=e.x+"px",t.style.top=e.y+"px")}function Se(t){return t._leaflet_pos||new H(0,0)}var pi,hi,An;if("onselectstart"in document)pi=function(){Y(window,"selectstart",At)},hi=function(){yt(window,"selectstart",At)};else{var mi=Hi(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);pi=function(){if(mi){var t=document.documentElement.style;An=t[mi],t[mi]="none"}},hi=function(){mi&&(document.documentElement.style[mi]=An,An=void 0)}}function Bn(){Y(window,"dragstart",At)}function Rn(){yt(window,"dragstart",At)}var Ni,On;function Hn(t){for(;t.tabIndex===-1;)t=t.parentNode;t.style&&(ji(),Ni=t,On=t.style.outlineStyle,t.style.outlineStyle="none",Y(window,"keydown",ji))}function ji(){Ni&&(Ni.style.outlineStyle=On,Ni=void 0,On=void 0,yt(window,"keydown",ji))}function ro(t){do t=t.parentNode;while((!t.offsetWidth||!t.offsetHeight)&&t!==document.body);return t}function Nn(t){var e=t.getBoundingClientRect();return{x:e.width/t.offsetWidth||1,y:e.height/t.offsetHeight||1,boundingClientRect:e}}var Pr={__proto__:null,TRANSFORM:$n,TRANSITION:di,TRANSITION_END:oo,get:so,getStyle:ui,create:lt,remove:wt,empty:Ri,toFront:De,toBack:Fe,hasClass:In,addClass:tt,removeClass:Tt,setClass:Pn,getClass:Oi,setOpacity:Jt,testProp:Hi,setTransform:Te,setPosition:St,getPosition:Se,get disableTextSelection(){return pi},get enableTextSelection(){return hi},disableImageDrag:Bn,enableImageDrag:Rn,preventOutline:Hn,restoreOutline:ji,getSizedParentNode:ro,getScale:Nn};function Y(t,e,n,s){if(e&&typeof e=="object")for(var c in e)Dn(t,c,e[c],n);else{e=C(e);for(var h=0,g=e.length;h<g;h++)Dn(t,e[h],n,s)}return this}var se="_leaflet_events";function yt(t,e,n,s){if(arguments.length===1)lo(t),delete t[se];else if(e&&typeof e=="object")for(var c in e)Fn(t,c,e[c],n);else if(e=C(e),arguments.length===2)lo(t,function(x){return F(e,x)!==-1});else for(var h=0,g=e.length;h<g;h++)Fn(t,e[h],n,s);return this}function lo(t,e){for(var n in t[se]){var s=n.split(/\d/)[0];(!e||e(s))&&Fn(t,s,null,null,n)}}var jn={mouseenter:"mouseover",mouseleave:"mouseout",wheel:!("onwheel"in window)&&"mousewheel"};function Dn(t,e,n,s){var c=e+m(n)+(s?"_"+m(s):"");if(t[se]&&t[se][c])return this;var h=function(x){return n.call(s||t,x||window.event)},g=h;!D.touchNative&&D.pointer&&e.indexOf("touch")===0?h=wr(t,e,h):D.touch&&e==="dblclick"?h=Mr(t,h):"addEventListener"in t?e==="touchstart"||e==="touchmove"||e==="wheel"||e==="mousewheel"?t.addEventListener(jn[e]||e,h,D.passiveEvents?{passive:!1}:!1):e==="mouseenter"||e==="mouseleave"?(h=function(x){x=x||window.event,Un(t,x)&&g(x)},t.addEventListener(jn[e],h,!1)):t.addEventListener(e,g,!1):t.attachEvent("on"+e,h),t[se]=t[se]||{},t[se][c]=h}function Fn(t,e,n,s,c){c=c||e+m(n)+(s?"_"+m(s):"");var h=t[se]&&t[se][c];if(!h)return this;!D.touchNative&&D.pointer&&e.indexOf("touch")===0?kr(t,e,h):D.touch&&e==="dblclick"?$r(t,h):"removeEventListener"in t?t.removeEventListener(jn[e]||e,h,!1):t.detachEvent("on"+e,h),t[se][c]=null}function Me(t){return t.stopPropagation?t.stopPropagation():t.originalEvent?t.originalEvent._stopped=!0:t.cancelBubble=!0,this}function qn(t){return Dn(t,"wheel",Me),this}function fi(t){return Y(t,"mousedown touchstart dblclick contextmenu",Me),t._leaflet_disable_click=!0,this}function At(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this}function $e(t){return At(t),Me(t),this}function co(t){if(t.composedPath)return t.composedPath();for(var e=[],n=t.target;n;)e.push(n),n=n.parentNode;return e}function uo(t,e){if(!e)return new H(t.clientX,t.clientY);var n=Nn(e),s=n.boundingClientRect;return new H((t.clientX-s.left)/n.x-e.clientLeft,(t.clientY-s.top)/n.y-e.clientTop)}var Ar=D.linux&&D.chrome?window.devicePixelRatio:D.mac?window.devicePixelRatio*3:window.devicePixelRatio>0?2*window.devicePixelRatio:1;function po(t){return D.edge?t.wheelDeltaY/2:t.deltaY&&t.deltaMode===0?-t.deltaY/Ar:t.deltaY&&t.deltaMode===1?-t.deltaY*20:t.deltaY&&t.deltaMode===2?-t.deltaY*60:t.deltaX||t.deltaZ?0:t.wheelDelta?(t.wheelDeltaY||t.wheelDelta)/2:t.detail&&Math.abs(t.detail)<32765?-t.detail*20:t.detail?t.detail/-32765*60:0}function Un(t,e){var n=e.relatedTarget;if(!n)return!0;try{for(;n&&n!==t;)n=n.parentNode}catch{return!1}return n!==t}var Br={__proto__:null,on:Y,off:yt,stopPropagation:Me,disableScrollPropagation:qn,disableClickPropagation:fi,preventDefault:At,stop:$e,getPropagationPath:co,getMousePosition:uo,getWheelDelta:po,isExternalTarget:Un,addListener:Y,removeListener:yt},ho=rt.extend({run:function(t,e,n,s){this.stop(),this._el=t,this._inProgress=!0,this._duration=n||.25,this._easeOutPower=1/Math.max(s||.5,.2),this._startPos=Se(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=Z(this._animate,this),this._step()},_step:function(t){var e=+new Date-this._startTime,n=this._duration*1e3;e<n?this._runFrame(this._easeOut(e/n),t):(this._runFrame(1),this._complete())},_runFrame:function(t,e){var n=this._startPos.add(this._offset.multiplyBy(t));e&&n._round(),St(this._el,n),this.fire("step")},_complete:function(){at(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),ot=rt.extend({options:{crs:zn,center:void 0,zoom:void 0,minZoom:void 0,maxZoom:void 0,layers:[],maxBounds:void 0,renderer:void 0,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:!0},initialize:function(t,e){e=w(this,e),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this._initContainer(t),this._initLayout(),this._onResize=u(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),e.zoom!==void 0&&(this._zoom=this._limitZoom(e.zoom)),e.center&&e.zoom!==void 0&&this.setView(nt(e.center),e.zoom,{reset:!0}),this.callInitHooks(),this._zoomAnimated=di&&D.any3d&&!D.mobileOpera&&this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),Y(this._proxy,oo,this._catchTransitionEnd,this)),this._addLayers(this.options.layers)},setView:function(t,e,n){if(e=e===void 0?this._zoom:this._limitZoom(e),t=this._limitCenter(nt(t),e,this.options.maxBounds),n=n||{},this._stop(),this._loaded&&!n.reset&&n!==!0){n.animate!==void 0&&(n.zoom=l({animate:n.animate},n.zoom),n.pan=l({animate:n.animate,duration:n.duration},n.pan));var s=this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,n.zoom):this._tryAnimatedPan(t,n.pan);if(s)return clearTimeout(this._sizeTimer),this}return this._resetView(t,e,n.pan&&n.pan.noMoveStart),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=t,this)},zoomIn:function(t,e){return t=t||(D.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom+t,e)},zoomOut:function(t,e){return t=t||(D.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom-t,e)},setZoomAround:function(t,e,n){var s=this.getZoomScale(e),c=this.getSize().divideBy(2),h=t instanceof H?t:this.latLngToContainerPoint(t),g=h.subtract(c).multiplyBy(1-1/s),x=this.containerPointToLatLng(c.add(g));return this.setView(x,e,{zoom:n})},_getBoundsCenterZoom:function(t,e){e=e||{},t=t.getBounds?t.getBounds():ht(t);var n=j(e.paddingTopLeft||e.padding||[0,0]),s=j(e.paddingBottomRight||e.padding||[0,0]),c=this.getBoundsZoom(t,!1,n.add(s));if(c=typeof e.maxZoom=="number"?Math.min(e.maxZoom,c):c,c===1/0)return{center:t.getCenter(),zoom:c};var h=s.subtract(n).divideBy(2),g=this.project(t.getSouthWest(),c),x=this.project(t.getNorthEast(),c),k=this.unproject(g.add(x).divideBy(2).add(h),c);return{center:k,zoom:c}},fitBounds:function(t,e){if(t=ht(t),!t.isValid())throw new Error("Bounds are not valid.");var n=this._getBoundsCenterZoom(t,e);return this.setView(n.center,n.zoom,e)},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t,e){if(t=j(t).round(),e=e||{},!t.x&&!t.y)return this.fire("moveend");if(e.animate!==!0&&!this.getSize().contains(t))return this._resetView(this.unproject(this.project(this.getCenter()).add(t)),this.getZoom()),this;if(this._panAnim||(this._panAnim=new ho,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),e.animate!==!1){tt(this._mapPane,"leaflet-pan-anim");var n=this._getMapPanePos().subtract(t).round();this._panAnim.run(this._mapPane,n,e.duration||.25,e.easeLinearity)}else this._rawPanBy(t),this.fire("move").fire("moveend");return this},flyTo:function(t,e,n){if(n=n||{},n.animate===!1||!D.any3d)return this.setView(t,e,n);this._stop();var s=this.project(this.getCenter()),c=this.project(t),h=this.getSize(),g=this._zoom;t=nt(t),e=e===void 0?g:e;var x=Math.max(h.x,h.y),k=x*this.getZoomScale(g,e),T=c.distanceTo(s)||1,A=1.42,U=A*A;function it(Mt){var Xi=Mt?-1:1,kl=Mt?k:x,zl=k*k-x*x+Xi*U*U*T*T,Ll=2*kl*U*T,ea=zl/Ll,Wo=Math.sqrt(ea*ea+1)-ea,Cl=Wo<1e-9?-18:Math.log(Wo);return Cl}function Bt(Mt){return(Math.exp(Mt)-Math.exp(-Mt))/2}function Pt(Mt){return(Math.exp(Mt)+Math.exp(-Mt))/2}function Xt(Mt){return Bt(Mt)/Pt(Mt)}var Nt=it(0);function Ge(Mt){return x*(Pt(Nt)/Pt(Nt+A*Mt))}function bl(Mt){return x*(Pt(Nt)*Xt(Nt+A*Mt)-Bt(Nt))/U}function xl(Mt){return 1-Math.pow(1-Mt,1.5)}var _l=Date.now(),Zo=(it(1)-Nt)/A,wl=n.duration?1e3*n.duration:1e3*Zo*.8;function Vo(){var Mt=(Date.now()-_l)/wl,Xi=xl(Mt)*Zo;Mt<=1?(this._flyToFrame=Z(Vo,this),this._move(this.unproject(s.add(c.subtract(s).multiplyBy(bl(Xi)/T)),g),this.getScaleZoom(x/Ge(Xi),g),{flyTo:!0})):this._move(t,e)._moveEnd(!0)}return this._moveStart(!0,n.noMoveStart),Vo.call(this),this},flyToBounds:function(t,e){var n=this._getBoundsCenterZoom(t,e);return this.flyTo(n.center,n.zoom,e)},setMaxBounds:function(t){return t=ht(t),this.listens("moveend",this._panInsideMaxBounds)&&this.off("moveend",this._panInsideMaxBounds),t.isValid()?(this.options.maxBounds=t,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):(this.options.maxBounds=null,this)},setMinZoom:function(t){var e=this.options.minZoom;return this.options.minZoom=t,this._loaded&&e!==t&&(this.fire("zoomlevelschange"),this.getZoom()<this.options.minZoom)?this.setZoom(t):this},setMaxZoom:function(t){var e=this.options.maxZoom;return this.options.maxZoom=t,this._loaded&&e!==t&&(this.fire("zoomlevelschange"),this.getZoom()>this.options.maxZoom)?this.setZoom(t):this},panInsideBounds:function(t,e){this._enforcingBounds=!0;var n=this.getCenter(),s=this._limitCenter(n,this._zoom,ht(t));return n.equals(s)||this.panTo(s,e),this._enforcingBounds=!1,this},panInside:function(t,e){e=e||{};var n=j(e.paddingTopLeft||e.padding||[0,0]),s=j(e.paddingBottomRight||e.padding||[0,0]),c=this.project(this.getCenter()),h=this.project(t),g=this.getPixelBounds(),x=st([g.min.add(n),g.max.subtract(s)]),k=x.getSize();if(!x.contains(h)){this._enforcingBounds=!0;var T=h.subtract(x.getCenter()),A=x.extend(h).getSize().subtract(k);c.x+=T.x<0?-A.x:A.x,c.y+=T.y<0?-A.y:A.y,this.panTo(this.unproject(c),e),this._enforcingBounds=!1}return this},invalidateSize:function(t){if(!this._loaded)return this;t=l({animate:!1,pan:!0},t===!0?{animate:!0}:t);var e=this.getSize();this._sizeChanged=!0,this._lastCenter=null;var n=this.getSize(),s=e.divideBy(2).round(),c=n.divideBy(2).round(),h=s.subtract(c);return!h.x&&!h.y?this:(t.animate&&t.pan?this.panBy(h):(t.pan&&this._rawPanBy(h),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(u(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:n}))},stop:function(){return this.setZoom(this._limitZoom(this._zoom)),this.options.zoomSnap||this.fire("viewreset"),this._stop()},locate:function(t){if(t=this._locateOptions=l({timeout:1e4,watch:!1},t),!("geolocation"in navigator))return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var e=u(this._handleGeolocationResponse,this),n=u(this._handleGeolocationError,this);return t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,n,t):navigator.geolocation.getCurrentPosition(e,n,t),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){if(this._container._leaflet_id){var e=t.code,n=t.message||(e===1?"permission denied":e===2?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+n+"."})}},_handleGeolocationResponse:function(t){if(this._container._leaflet_id){var e=t.coords.latitude,n=t.coords.longitude,s=new dt(e,n),c=s.toBounds(t.coords.accuracy*2),h=this._locateOptions;if(h.setView){var g=this.getBoundsZoom(c);this.setView(s,h.maxZoom?Math.min(g,h.maxZoom):g)}var x={latlng:s,bounds:c,timestamp:t.timestamp};for(var k in t.coords)typeof t.coords[k]=="number"&&(x[k]=t.coords[k]);this.fire("locationfound",x)}},addHandler:function(t,e){if(!e)return this;var n=this[t]=new e(this);return this._handlers.push(n),this.options[t]&&n.enable(),this},remove:function(){if(this._initEvents(!0),this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this._containerId!==this._container._leaflet_id)throw new Error("Map container is being reused by another instance");try{delete this._container._leaflet_id,delete this._containerId}catch{this._container._leaflet_id=void 0,this._containerId=void 0}this._locationWatchId!==void 0&&this.stopLocate(),this._stop(),wt(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._resizeRequest&&(at(this._resizeRequest),this._resizeRequest=null),this._clearHandlers(),this._loaded&&this.fire("unload");var t;for(t in this._layers)this._layers[t].remove();for(t in this._panes)wt(this._panes[t]);return this._layers=[],this._panes=[],delete this._mapPane,delete this._renderer,this},createPane:function(t,e){var n="leaflet-pane"+(t?" leaflet-"+t.replace("Pane","")+"-pane":""),s=lt("div",n,e||this._mapPane);return t&&(this._panes[t]=s),s},getCenter:function(){return this._checkIfLoaded(),this._lastCenter&&!this._moved()?this._lastCenter.clone():this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds(),e=this.unproject(t.getBottomLeft()),n=this.unproject(t.getTopRight());return new vt(e,n)},getMinZoom:function(){return this.options.minZoom===void 0?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===void 0?this._layersMaxZoom===void 0?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,n){t=ht(t),n=j(n||[0,0]);var s=this.getZoom()||0,c=this.getMinZoom(),h=this.getMaxZoom(),g=t.getNorthWest(),x=t.getSouthEast(),k=this.getSize().subtract(n),T=st(this.project(x,s),this.project(g,s)).getSize(),A=D.any3d?this.options.zoomSnap:1,U=k.x/T.x,it=k.y/T.y,Bt=e?Math.max(U,it):Math.min(U,it);return s=this.getScaleZoom(Bt,s),A&&(s=Math.round(s/(A/100))*(A/100),s=e?Math.ceil(s/A)*A:Math.floor(s/A)*A),Math.max(c,Math.min(h,s))},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new H(this._container.clientWidth||0,this._container.clientHeight||0),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(t,e){var n=this._getTopLeftPoint(t,e);return new q(n,n.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(t){return this.options.crs.getProjectedBounds(t===void 0?this.getZoom():t)},getPane:function(t){return typeof t=="string"?this._panes[t]:t},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t,e){var n=this.options.crs;return e=e===void 0?this._zoom:e,n.scale(t)/n.scale(e)},getScaleZoom:function(t,e){var n=this.options.crs;e=e===void 0?this._zoom:e;var s=n.zoom(t*n.scale(e));return isNaN(s)?1/0:s},project:function(t,e){return e=e===void 0?this._zoom:e,this.options.crs.latLngToPoint(nt(t),e)},unproject:function(t,e){return e=e===void 0?this._zoom:e,this.options.crs.pointToLatLng(j(t),e)},layerPointToLatLng:function(t){var e=j(t).add(this.getPixelOrigin());return this.unproject(e)},latLngToLayerPoint:function(t){var e=this.project(nt(t))._round();return e._subtract(this.getPixelOrigin())},wrapLatLng:function(t){return this.options.crs.wrapLatLng(nt(t))},wrapLatLngBounds:function(t){return this.options.crs.wrapLatLngBounds(ht(t))},distance:function(t,e){return this.options.crs.distance(nt(t),nt(e))},containerPointToLayerPoint:function(t){return j(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return j(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){var e=this.containerPointToLayerPoint(j(t));return this.layerPointToLatLng(e)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(nt(t)))},mouseEventToContainerPoint:function(t){return uo(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){var e=this._container=so(t);if(e){if(e._leaflet_id)throw new Error("Map container is already initialized.")}else throw new Error("Map container not found.");Y(e,"scroll",this._onScroll,this),this._containerId=m(e)},_initLayout:function(){var t=this._container;this._fadeAnimated=this.options.fadeAnimation&&D.any3d,tt(t,"leaflet-container"+(D.touch?" leaflet-touch":"")+(D.retina?" leaflet-retina":"")+(D.ielt9?" leaflet-oldie":"")+(D.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":""));var e=ui(t,"position");e!=="absolute"&&e!=="relative"&&e!=="fixed"&&e!=="sticky"&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),St(this._mapPane,new H(0,0)),this.createPane("tilePane"),this.createPane("overlayPane"),this.createPane("shadowPane"),this.createPane("markerPane"),this.createPane("tooltipPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||(tt(t.markerPane,"leaflet-zoom-hide"),tt(t.shadowPane,"leaflet-zoom-hide"))},_resetView:function(t,e,n){St(this._mapPane,new H(0,0));var s=!this._loaded;this._loaded=!0,e=this._limitZoom(e),this.fire("viewprereset");var c=this._zoom!==e;this._moveStart(c,n)._move(t,e)._moveEnd(c),this.fire("viewreset"),s&&this.fire("load")},_moveStart:function(t,e){return t&&this.fire("zoomstart"),e||this.fire("movestart"),this},_move:function(t,e,n,s){e===void 0&&(e=this._zoom);var c=this._zoom!==e;return this._zoom=e,this._lastCenter=t,this._pixelOrigin=this._getNewPixelOrigin(t),s?n&&n.pinch&&this.fire("zoom",n):((c||n&&n.pinch)&&this.fire("zoom",n),this.fire("move",n)),this},_moveEnd:function(t){return t&&this.fire("zoomend"),this.fire("moveend")},_stop:function(){return at(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},_rawPanBy:function(t){St(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this._enforcingBounds||this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(t){this._targets={},this._targets[m(this._container)]=this;var e=t?yt:Y;e(this._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",this._handleDOMEvent,this),this.options.trackResize&&e(window,"resize",this._onResize,this),D.any3d&&this.options.transform3DLimit&&(t?this.off:this.on).call(this,"moveend",this._onMoveEnd)},_onResize:function(){at(this._resizeRequest),this._resizeRequest=Z(function(){this.invalidateSize({debounceMoveend:!0})},this)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_onMoveEnd:function(){var t=this._getMapPanePos();Math.max(Math.abs(t.x),Math.abs(t.y))>=this.options.transform3DLimit&&this._resetView(this.getCenter(),this.getZoom())},_findEventTargets:function(t,e){for(var n=[],s,c=e==="mouseout"||e==="mouseover",h=t.target||t.srcElement,g=!1;h;){if(s=this._targets[m(h)],s&&(e==="click"||e==="preclick")&&this._draggableMoved(s)){g=!0;break}if(s&&s.listens(e,!0)&&(c&&!Un(h,t)||(n.push(s),c))||h===this._container)break;h=h.parentNode}return!n.length&&!g&&!c&&this.listens(e,!0)&&(n=[this]),n},_isClickDisabled:function(t){for(;t&&t!==this._container;){if(t._leaflet_disable_click)return!0;t=t.parentNode}},_handleDOMEvent:function(t){var e=t.target||t.srcElement;if(!(!this._loaded||e._leaflet_disable_events||t.type==="click"&&this._isClickDisabled(e))){var n=t.type;n==="mousedown"&&Hn(e),this._fireDOMEvent(t,n)}},_mouseEvents:["click","dblclick","mouseover","mouseout","contextmenu"],_fireDOMEvent:function(t,e,n){if(t.type==="click"){var s=l({},t);s.type="preclick",this._fireDOMEvent(s,s.type,n)}var c=this._findEventTargets(t,e);if(n){for(var h=[],g=0;g<n.length;g++)n[g].listens(e,!0)&&h.push(n[g]);c=h.concat(c)}if(c.length){e==="contextmenu"&&At(t);var x=c[0],k={originalEvent:t};if(t.type!=="keypress"&&t.type!=="keydown"&&t.type!=="keyup"){var T=x.getLatLng&&(!x._radius||x._radius<=10);k.containerPoint=T?this.latLngToContainerPoint(x.getLatLng()):this.mouseEventToContainerPoint(t),k.layerPoint=this.containerPointToLayerPoint(k.containerPoint),k.latlng=T?x.getLatLng():this.layerPointToLatLng(k.layerPoint)}for(g=0;g<c.length;g++)if(c[g].fire(e,k,!0),k.originalEvent._stopped||c[g].options.bubblingMouseEvents===!1&&F(this._mouseEvents,e)!==-1)return}},_draggableMoved:function(t){return t=t.dragging&&t.dragging.enabled()?t:this,t.dragging&&t.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var t=0,e=this._handlers.length;t<e;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,{target:this}):this.on("load",t,e),this},_getMapPanePos:function(){return Se(this._mapPane)||new H(0,0)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(t,e){var n=t&&e!==void 0?this._getNewPixelOrigin(t,e):this.getPixelOrigin();return n.subtract(this._getMapPanePos())},_getNewPixelOrigin:function(t,e){var n=this.getSize()._divideBy(2);return this.project(t,e)._subtract(n)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(t,e,n){var s=this._getNewPixelOrigin(n,e);return this.project(t,e)._subtract(s)},_latLngBoundsToNewLayerBounds:function(t,e,n){var s=this._getNewPixelOrigin(n,e);return st([this.project(t.getSouthWest(),e)._subtract(s),this.project(t.getNorthWest(),e)._subtract(s),this.project(t.getSouthEast(),e)._subtract(s),this.project(t.getNorthEast(),e)._subtract(s)])},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,n){if(!n)return t;var s=this.project(t,e),c=this.getSize().divideBy(2),h=new q(s.subtract(c),s.add(c)),g=this._getBoundsOffset(h,n,e);return Math.abs(g.x)<=1&&Math.abs(g.y)<=1?t:this.unproject(s.add(g),e)},_limitOffset:function(t,e){if(!e)return t;var n=this.getPixelBounds(),s=new q(n.min.add(t),n.max.add(t));return t.add(this._getBoundsOffset(s,e))},_getBoundsOffset:function(t,e,n){var s=st(this.project(e.getNorthEast(),n),this.project(e.getSouthWest(),n)),c=s.min.subtract(t.min),h=s.max.subtract(t.max),g=this._rebound(c.x,-h.x),x=this._rebound(c.y,-h.y);return new H(g,x)},_rebound:function(t,e){return t+e>0?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),n=this.getMaxZoom(),s=D.any3d?this.options.zoomSnap:1;return s&&(t=Math.round(t/s)*s),Math.max(e,Math.min(n,t))},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){Tt(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){var n=this._getCenterOffset(t)._trunc();return(e&&e.animate)!==!0&&!this.getSize().contains(n)?!1:(this.panBy(n,e),!0)},_createAnimProxy:function(){var t=this._proxy=lt("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(t),this.on("zoomanim",function(e){var n=$n,s=this._proxy.style[n];Te(this._proxy,this.project(e.center,e.zoom),this.getZoomScale(e.zoom,1)),s===this._proxy.style[n]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",this._animMoveEnd,this),this._on("unload",this._destroyAnimProxy,this)},_destroyAnimProxy:function(){wt(this._proxy),this.off("load moveend",this._animMoveEnd,this),delete this._proxy},_animMoveEnd:function(){var t=this.getCenter(),e=this.getZoom();Te(this._proxy,this.project(t,e),this.getZoomScale(e,1))},_catchTransitionEnd:function(t){this._animatingZoom&&t.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,n){if(this._animatingZoom)return!0;if(n=n||{},!this._zoomAnimated||n.animate===!1||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var s=this.getZoomScale(e),c=this._getCenterOffset(t)._divideBy(1-1/s);return n.animate!==!0&&!this.getSize().contains(c)?!1:(Z(function(){this._moveStart(!0,n.noMoveStart||!1)._animateZoom(t,e,!0)},this),!0)},_animateZoom:function(t,e,n,s){this._mapPane&&(n&&(this._animatingZoom=!0,this._animateToCenter=t,this._animateToZoom=e,tt(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:t,zoom:e,noUpdate:s}),this._tempFireZoomEvent||(this._tempFireZoomEvent=this._zoom!==this._animateToZoom),this._move(this._animateToCenter,this._animateToZoom,void 0,!0),setTimeout(u(this._onZoomTransitionEnd,this),250))},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._mapPane&&Tt(this._mapPane,"leaflet-zoom-anim"),this._animatingZoom=!1,this._move(this._animateToCenter,this._animateToZoom,void 0,!0),this._tempFireZoomEvent&&this.fire("zoom"),delete this._tempFireZoomEvent,this.fire("move"),this._moveEnd(!0))}});function Rr(t,e){return new ot(t,e)}var ee=G.extend({options:{position:"topright"},initialize:function(t){w(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this.remove(),this._map=t;var e=this._container=this.onAdd(t),n=this.getPosition(),s=t._controlCorners[n];return tt(e,"leaflet-control"),n.indexOf("bottom")!==-1?s.insertBefore(e,s.firstChild):s.appendChild(e),this._map.on("unload",this.remove,this),this},remove:function(){return this._map?(wt(this._container),this.onRemove&&this.onRemove(this._map),this._map.off("unload",this.remove,this),this._map=null,this):this},_refocusOnMap:function(t){this._map&&t&&t.screenX>0&&t.screenY>0&&this._map.getContainer().focus()}}),vi=function(t){return new ee(t)};ot.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.remove(),this},_initControlPos:function(){var t=this._controlCorners={},e="leaflet-",n=this._controlContainer=lt("div",e+"control-container",this._container);function s(c,h){var g=e+c+" "+e+h;t[c+h]=lt("div",g,n)}s("top","left"),s("top","right"),s("bottom","left"),s("bottom","right")},_clearControlPos:function(){for(var t in this._controlCorners)wt(this._controlCorners[t]);wt(this._controlContainer),delete this._controlCorners,delete this._controlContainer}});var mo=ee.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1,sortLayers:!1,sortFunction:function(t,e,n,s){return n<s?-1:s<n?1:0}},initialize:function(t,e,n){w(this,n),this._layerControlInputs=[],this._layers=[],this._lastZIndex=0,this._handlingClick=!1,this._preventClick=!1;for(var s in t)this._addLayer(t[s],s);for(s in e)this._addLayer(e[s],s,!0)},onAdd:function(t){this._initLayout(),this._update(),this._map=t,t.on("zoomend",this._checkDisabledLayers,this);for(var e=0;e<this._layers.length;e++)this._layers[e].layer.on("add remove",this._onLayerChange,this);return this._container},addTo:function(t){return ee.prototype.addTo.call(this,t),this._expandIfNotCollapsed()},onRemove:function(){this._map.off("zoomend",this._checkDisabledLayers,this);for(var t=0;t<this._layers.length;t++)this._layers[t].layer.off("add remove",this._onLayerChange,this)},addBaseLayer:function(t,e){return this._addLayer(t,e),this._map?this._update():this},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._map?this._update():this},removeLayer:function(t){t.off("add remove",this._onLayerChange,this);var e=this._getLayer(m(t));return e&&this._layers.splice(this._layers.indexOf(e),1),this._map?this._update():this},expand:function(){tt(this._container,"leaflet-control-layers-expanded"),this._section.style.height=null;var t=this._map.getSize().y-(this._container.offsetTop+50);return t<this._section.clientHeight?(tt(this._section,"leaflet-control-layers-scrollbar"),this._section.style.height=t+"px"):Tt(this._section,"leaflet-control-layers-scrollbar"),this._checkDisabledLayers(),this},collapse:function(){return Tt(this._container,"leaflet-control-layers-expanded"),this},_initLayout:function(){var t="leaflet-control-layers",e=this._container=lt("div",t),n=this.options.collapsed;e.setAttribute("aria-haspopup",!0),fi(e),qn(e);var s=this._section=lt("section",t+"-list");n&&(this._map.on("click",this.collapse,this),Y(e,{mouseenter:this._expandSafely,mouseleave:this.collapse},this));var c=this._layersLink=lt("a",t+"-toggle",e);c.href="#",c.title="Layers",c.setAttribute("role","button"),Y(c,{keydown:function(h){h.keyCode===13&&this._expandSafely()},click:function(h){At(h),this._expandSafely()}},this),n||this.expand(),this._baseLayersList=lt("div",t+"-base",s),this._separator=lt("div",t+"-separator",s),this._overlaysList=lt("div",t+"-overlays",s),e.appendChild(s)},_getLayer:function(t){for(var e=0;e<this._layers.length;e++)if(this._layers[e]&&m(this._layers[e].layer)===t)return this._layers[e]},_addLayer:function(t,e,n){this._map&&t.on("add remove",this._onLayerChange,this),this._layers.push({layer:t,name:e,overlay:n}),this.options.sortLayers&&this._layers.sort(u(function(s,c){return this.options.sortFunction(s.layer,c.layer,s.name,c.name)},this)),this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex)),this._expandIfNotCollapsed()},_update:function(){if(!this._container)return this;Ri(this._baseLayersList),Ri(this._overlaysList),this._layerControlInputs=[];var t,e,n,s,c=0;for(n=0;n<this._layers.length;n++)s=this._layers[n],this._addItem(s),e=e||s.overlay,t=t||!s.overlay,c+=s.overlay?0:1;return this.options.hideSingleBase&&(t=t&&c>1,this._baseLayersList.style.display=t?"":"none"),this._separator.style.display=e&&t?"":"none",this},_onLayerChange:function(t){this._handlingClick||this._update();var e=this._getLayer(m(t.target)),n=e.overlay?t.type==="add"?"overlayadd":"overlayremove":t.type==="add"?"baselayerchange":null;n&&this._map.fire(n,e)},_createRadioElement:function(t,e){var n='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"'+(e?' checked="checked"':"")+"/>",s=document.createElement("div");return s.innerHTML=n,s.firstChild},_addItem:function(t){var e=document.createElement("label"),n=this._map.hasLayer(t.layer),s;t.overlay?(s=document.createElement("input"),s.type="checkbox",s.className="leaflet-control-layers-selector",s.defaultChecked=n):s=this._createRadioElement("leaflet-base-layers_"+m(this),n),this._layerControlInputs.push(s),s.layerId=m(t.layer),Y(s,"click",this._onInputClick,this);var c=document.createElement("span");c.innerHTML=" "+t.name;var h=document.createElement("span");e.appendChild(h),h.appendChild(s),h.appendChild(c);var g=t.overlay?this._overlaysList:this._baseLayersList;return g.appendChild(e),this._checkDisabledLayers(),e},_onInputClick:function(){if(!this._preventClick){var t=this._layerControlInputs,e,n,s=[],c=[];this._handlingClick=!0;for(var h=t.length-1;h>=0;h--)e=t[h],n=this._getLayer(e.layerId).layer,e.checked?s.push(n):e.checked||c.push(n);for(h=0;h<c.length;h++)this._map.hasLayer(c[h])&&this._map.removeLayer(c[h]);for(h=0;h<s.length;h++)this._map.hasLayer(s[h])||this._map.addLayer(s[h]);this._handlingClick=!1,this._refocusOnMap()}},_checkDisabledLayers:function(){for(var t=this._layerControlInputs,e,n,s=this._map.getZoom(),c=t.length-1;c>=0;c--)e=t[c],n=this._getLayer(e.layerId).layer,e.disabled=n.options.minZoom!==void 0&&s<n.options.minZoom||n.options.maxZoom!==void 0&&s>n.options.maxZoom},_expandIfNotCollapsed:function(){return this._map&&!this.options.collapsed&&this.expand(),this},_expandSafely:function(){var t=this._section;this._preventClick=!0,Y(t,"click",At),this.expand();var e=this;setTimeout(function(){yt(t,"click",At),e._preventClick=!1})}}),Or=function(t,e,n){return new mo(t,e,n)},Zn=ee.extend({options:{position:"topleft",zoomInText:'<span aria-hidden="true">+</span>',zoomInTitle:"Zoom in",zoomOutText:'<span aria-hidden="true">&#x2212;</span>',zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",n=lt("div",e+" leaflet-bar"),s=this.options;return this._zoomInButton=this._createButton(s.zoomInText,s.zoomInTitle,e+"-in",n,this._zoomIn),this._zoomOutButton=this._createButton(s.zoomOutText,s.zoomOutTitle,e+"-out",n,this._zoomOut),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),n},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(t){!this._disabled&&this._map._zoom<this._map.getMaxZoom()&&this._map.zoomIn(this._map.options.zoomDelta*(t.shiftKey?3:1))},_zoomOut:function(t){!this._disabled&&this._map._zoom>this._map.getMinZoom()&&this._map.zoomOut(this._map.options.zoomDelta*(t.shiftKey?3:1))},_createButton:function(t,e,n,s,c){var h=lt("a",n,s);return h.innerHTML=t,h.href="#",h.title=e,h.setAttribute("role","button"),h.setAttribute("aria-label",e),fi(h),Y(h,"click",$e),Y(h,"click",c,this),Y(h,"click",this._refocusOnMap,this),h},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";Tt(this._zoomInButton,e),Tt(this._zoomOutButton,e),this._zoomInButton.setAttribute("aria-disabled","false"),this._zoomOutButton.setAttribute("aria-disabled","false"),(this._disabled||t._zoom===t.getMinZoom())&&(tt(this._zoomOutButton,e),this._zoomOutButton.setAttribute("aria-disabled","true")),(this._disabled||t._zoom===t.getMaxZoom())&&(tt(this._zoomInButton,e),this._zoomInButton.setAttribute("aria-disabled","true"))}});ot.mergeOptions({zoomControl:!0}),ot.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new Zn,this.addControl(this.zoomControl))});var Hr=function(t){return new Zn(t)},fo=ee.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(t){var e="leaflet-control-scale",n=lt("div",e),s=this.options;return this._addScales(s,e+"-line",n),t.on(s.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),n},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,n){t.metric&&(this._mScale=lt("div",e,n)),t.imperial&&(this._iScale=lt("div",e,n))},_update:function(){var t=this._map,e=t.getSize().y/2,n=t.distance(t.containerPointToLatLng([0,e]),t.containerPointToLatLng([this.options.maxWidth,e]));this._updateScales(n)},_updateScales:function(t){this.options.metric&&t&&this._updateMetric(t),this.options.imperial&&t&&this._updateImperial(t)},_updateMetric:function(t){var e=this._getRoundNum(t),n=e<1e3?e+" m":e/1e3+" km";this._updateScale(this._mScale,n,e/t)},_updateImperial:function(t){var e=t*3.2808399,n,s,c;e>5280?(n=e/5280,s=this._getRoundNum(n),this._updateScale(this._iScale,s+" mi",s/n)):(c=this._getRoundNum(e),this._updateScale(this._iScale,c+" ft",c/e))},_updateScale:function(t,e,n){t.style.width=Math.round(this.options.maxWidth*n)+"px",t.innerHTML=e},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),n=t/e;return n=n>=10?10:n>=5?5:n>=3?3:n>=2?2:1,e*n}}),Nr=function(t){return new fo(t)},jr='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',Vn=ee.extend({options:{position:"bottomright",prefix:'<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">'+(D.inlineSvg?jr+" ":"")+"Leaflet</a>"},initialize:function(t){w(this,t),this._attributions={}},onAdd:function(t){t.attributionControl=this,this._container=lt("div","leaflet-control-attribution"),fi(this._container);for(var e in t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return this._update(),t.on("layeradd",this._addAttribution,this),this._container},onRemove:function(t){t.off("layeradd",this._addAttribution,this)},_addAttribution:function(t){t.layer.getAttribution&&(this.addAttribution(t.layer.getAttribution()),t.layer.once("remove",function(){this.removeAttribution(t.layer.getAttribution())},this))},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t?(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update(),this):this},removeAttribution:function(t){return t?(this._attributions[t]&&(this._attributions[t]--,this._update()),this):this},_update:function(){if(this._map){var t=[];for(var e in this._attributions)this._attributions[e]&&t.push(e);var n=[];this.options.prefix&&n.push(this.options.prefix),t.length&&n.push(t.join(", ")),this._container.innerHTML=n.join(' <span aria-hidden="true">|</span> ')}}});ot.mergeOptions({attributionControl:!0}),ot.addInitHook(function(){this.options.attributionControl&&new Vn().addTo(this)});var Dr=function(t){return new Vn(t)};ee.Layers=mo,ee.Zoom=Zn,ee.Scale=fo,ee.Attribution=Vn,vi.layers=Or,vi.zoom=Hr,vi.scale=Nr,vi.attribution=Dr;var re=G.extend({initialize:function(t){this._map=t},enable:function(){return this._enabled?this:(this._enabled=!0,this.addHooks(),this)},disable:function(){return this._enabled?(this._enabled=!1,this.removeHooks(),this):this},enabled:function(){return!!this._enabled}});re.addTo=function(t,e){return t.addHandler(e,this),this};var Fr={Events:K},vo=D.touch?"touchstart mousedown":"mousedown",_e=rt.extend({options:{clickTolerance:3},initialize:function(t,e,n,s){w(this,s),this._element=t,this._dragStartTarget=e||t,this._preventOutline=n},enable:function(){this._enabled||(Y(this._dragStartTarget,vo,this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(_e._dragging===this&&this.finishDrag(!0),yt(this._dragStartTarget,vo,this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(t){if(this._enabled&&(this._moved=!1,!In(this._element,"leaflet-zoom-anim"))){if(t.touches&&t.touches.length!==1){_e._dragging===this&&this.finishDrag();return}if(!(_e._dragging||t.shiftKey||t.which!==1&&t.button!==1&&!t.touches)&&(_e._dragging=this,this._preventOutline&&Hn(this._element),Bn(),pi(),!this._moving)){this.fire("down");var e=t.touches?t.touches[0]:t,n=ro(this._element);this._startPoint=new H(e.clientX,e.clientY),this._startPos=Se(this._element),this._parentScale=Nn(n);var s=t.type==="mousedown";Y(document,s?"mousemove":"touchmove",this._onMove,this),Y(document,s?"mouseup":"touchend touchcancel",this._onUp,this)}}},_onMove:function(t){if(this._enabled){if(t.touches&&t.touches.length>1){this._moved=!0;return}var e=t.touches&&t.touches.length===1?t.touches[0]:t,n=new H(e.clientX,e.clientY)._subtract(this._startPoint);!n.x&&!n.y||Math.abs(n.x)+Math.abs(n.y)<this.options.clickTolerance||(n.x/=this._parentScale.x,n.y/=this._parentScale.y,At(t),this._moved||(this.fire("dragstart"),this._moved=!0,tt(document.body,"leaflet-dragging"),this._lastTarget=t.target||t.srcElement,window.SVGElementInstance&&this._lastTarget instanceof window.SVGElementInstance&&(this._lastTarget=this._lastTarget.correspondingUseElement),tt(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(n),this._moving=!0,this._lastEvent=t,this._updatePosition())}},_updatePosition:function(){var t={originalEvent:this._lastEvent};this.fire("predrag",t),St(this._element,this._newPos),this.fire("drag",t)},_onUp:function(){this._enabled&&this.finishDrag()},finishDrag:function(t){Tt(document.body,"leaflet-dragging"),this._lastTarget&&(Tt(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null),yt(document,"mousemove touchmove",this._onMove,this),yt(document,"mouseup touchend touchcancel",this._onUp,this),Rn(),hi();var e=this._moved&&this._moving;this._moving=!1,_e._dragging=!1,e&&this.fire("dragend",{noInertia:t,distance:this._newPos.distanceTo(this._startPos)})}});function go(t,e,n){var s,c=[1,4,2,8],h,g,x,k,T,A,U,it;for(h=0,A=t.length;h<A;h++)t[h]._code=Ie(t[h],e);for(x=0;x<4;x++){for(U=c[x],s=[],h=0,A=t.length,g=A-1;h<A;g=h++)k=t[h],T=t[g],k._code&U?T._code&U||(it=Di(T,k,U,e,n),it._code=Ie(it,e),s.push(it)):(T._code&U&&(it=Di(T,k,U,e,n),it._code=Ie(it,e),s.push(it)),s.push(k));t=s}return t}function yo(t,e){var n,s,c,h,g,x,k,T,A;if(!t||t.length===0)throw new Error("latlngs not passed");Yt(t)||(console.warn("latlngs are not flat! Only the first ring will be used"),t=t[0]);var U=nt([0,0]),it=ht(t),Bt=it.getNorthWest().distanceTo(it.getSouthWest())*it.getNorthEast().distanceTo(it.getNorthWest());Bt<1700&&(U=Wn(t));var Pt=t.length,Xt=[];for(n=0;n<Pt;n++){var Nt=nt(t[n]);Xt.push(e.project(nt([Nt.lat-U.lat,Nt.lng-U.lng])))}for(x=k=T=0,n=0,s=Pt-1;n<Pt;s=n++)c=Xt[n],h=Xt[s],g=c.y*h.x-h.y*c.x,k+=(c.x+h.x)*g,T+=(c.y+h.y)*g,x+=g*3;x===0?A=Xt[0]:A=[k/x,T/x];var Ge=e.unproject(j(A));return nt([Ge.lat+U.lat,Ge.lng+U.lng])}function Wn(t){for(var e=0,n=0,s=0,c=0;c<t.length;c++){var h=nt(t[c]);e+=h.lat,n+=h.lng,s++}return nt([e/s,n/s])}var qr={__proto__:null,clipPolygon:go,polygonCenter:yo,centroid:Wn};function bo(t,e){if(!e||!t.length)return t.slice();var n=e*e;return t=Vr(t,n),t=Zr(t,n),t}function xo(t,e,n){return Math.sqrt(gi(t,e,n,!0))}function Ur(t,e,n){return gi(t,e,n)}function Zr(t,e){var n=t.length,s=typeof Uint8Array<"u"?Uint8Array:Array,c=new s(n);c[0]=c[n-1]=1,Gn(t,c,e,0,n-1);var h,g=[];for(h=0;h<n;h++)c[h]&&g.push(t[h]);return g}function Gn(t,e,n,s,c){var h=0,g,x,k;for(x=s+1;x<=c-1;x++)k=gi(t[x],t[s],t[c],!0),k>h&&(g=x,h=k);h>n&&(e[g]=1,Gn(t,e,n,s,g),Gn(t,e,n,g,c))}function Vr(t,e){for(var n=[t[0]],s=1,c=0,h=t.length;s<h;s++)Wr(t[s],t[c])>e&&(n.push(t[s]),c=s);return c<h-1&&n.push(t[h-1]),n}var _o;function wo(t,e,n,s,c){var h=s?_o:Ie(t,n),g=Ie(e,n),x,k,T;for(_o=g;;){if(!(h|g))return[t,e];if(h&g)return!1;x=h||g,k=Di(t,e,x,n,c),T=Ie(k,n),x===h?(t=k,h=T):(e=k,g=T)}}function Di(t,e,n,s,c){var h=e.x-t.x,g=e.y-t.y,x=s.min,k=s.max,T,A;return n&8?(T=t.x+h*(k.y-t.y)/g,A=k.y):n&4?(T=t.x+h*(x.y-t.y)/g,A=x.y):n&2?(T=k.x,A=t.y+g*(k.x-t.x)/h):n&1&&(T=x.x,A=t.y+g*(x.x-t.x)/h),new H(T,A,c)}function Ie(t,e){var n=0;return t.x<e.min.x?n|=1:t.x>e.max.x&&(n|=2),t.y<e.min.y?n|=4:t.y>e.max.y&&(n|=8),n}function Wr(t,e){var n=e.x-t.x,s=e.y-t.y;return n*n+s*s}function gi(t,e,n,s){var c=e.x,h=e.y,g=n.x-c,x=n.y-h,k=g*g+x*x,T;return k>0&&(T=((t.x-c)*g+(t.y-h)*x)/k,T>1?(c=n.x,h=n.y):T>0&&(c+=g*T,h+=x*T)),g=t.x-c,x=t.y-h,s?g*g+x*x:new H(c,h)}function Yt(t){return!V(t[0])||typeof t[0][0]!="object"&&typeof t[0][0]<"u"}function ko(t){return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."),Yt(t)}function zo(t,e){var n,s,c,h,g,x,k,T;if(!t||t.length===0)throw new Error("latlngs not passed");Yt(t)||(console.warn("latlngs are not flat! Only the first ring will be used"),t=t[0]);var A=nt([0,0]),U=ht(t),it=U.getNorthWest().distanceTo(U.getSouthWest())*U.getNorthEast().distanceTo(U.getNorthWest());it<1700&&(A=Wn(t));var Bt=t.length,Pt=[];for(n=0;n<Bt;n++){var Xt=nt(t[n]);Pt.push(e.project(nt([Xt.lat-A.lat,Xt.lng-A.lng])))}for(n=0,s=0;n<Bt-1;n++)s+=Pt[n].distanceTo(Pt[n+1])/2;if(s===0)T=Pt[0];else for(n=0,h=0;n<Bt-1;n++)if(g=Pt[n],x=Pt[n+1],c=g.distanceTo(x),h+=c,h>s){k=(h-s)/c,T=[x.x-k*(x.x-g.x),x.y-k*(x.y-g.y)];break}var Nt=e.unproject(j(T));return nt([Nt.lat+A.lat,Nt.lng+A.lng])}var Gr={__proto__:null,simplify:bo,pointToSegmentDistance:xo,closestPointOnSegment:Ur,clipSegment:wo,_getEdgeIntersection:Di,_getBitCode:Ie,_sqClosestPointOnSegment:gi,isFlat:Yt,_flat:ko,polylineCenter:zo},Kn={project:function(t){return new H(t.lng,t.lat)},unproject:function(t){return new dt(t.y,t.x)},bounds:new q([-180,-90],[180,90])},Jn={R:6378137,R_MINOR:6356752314245179e-9,bounds:new q([-2003750834279e-5,-1549657073972e-5],[2003750834279e-5,1876465623138e-5]),project:function(t){var e=Math.PI/180,n=this.R,s=t.lat*e,c=this.R_MINOR/n,h=Math.sqrt(1-c*c),g=h*Math.sin(s),x=Math.tan(Math.PI/4-s/2)/Math.pow((1-g)/(1+g),h/2);return s=-n*Math.log(Math.max(x,1e-10)),new H(t.lng*e*n,s)},unproject:function(t){for(var e=180/Math.PI,n=this.R,s=this.R_MINOR/n,c=Math.sqrt(1-s*s),h=Math.exp(-t.y/n),g=Math.PI/2-2*Math.atan(h),x=0,k=.1,T;x<15&&Math.abs(k)>1e-7;x++)T=c*Math.sin(g),T=Math.pow((1-T)/(1+T),c/2),k=Math.PI/2-2*Math.atan(h*T)-g,g+=k;return new dt(g*e,t.x*e/n)}},Kr={__proto__:null,LonLat:Kn,Mercator:Jn,SphericalMercator:wn},Jr=l({},xe,{code:"EPSG:3395",projection:Jn,transformation:function(){var t=.5/(Math.PI*Jn.R);return li(t,.5,-t,.5)}()}),Lo=l({},xe,{code:"EPSG:4326",projection:Kn,transformation:li(1/180,1,-1/180,.5)}),Yr=l({},me,{projection:Kn,transformation:li(1,0,-1,0),scale:function(t){return Math.pow(2,t)},zoom:function(t){return Math.log(t)/Math.LN2},distance:function(t,e){var n=e.lng-t.lng,s=e.lat-t.lat;return Math.sqrt(n*n+s*s)},infinite:!0});me.Earth=xe,me.EPSG3395=Jr,me.EPSG3857=zn,me.EPSG900913=nr,me.EPSG4326=Lo,me.Simple=Yr;var ie=rt.extend({options:{pane:"overlayPane",attribution:null,bubblingMouseEvents:!0},addTo:function(t){return t.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(t){return t&&t.removeLayer(this),this},getPane:function(t){return this._map.getPane(t?this.options[t]||t:this.options.pane)},addInteractiveTarget:function(t){return this._map._targets[m(t)]=this,this},removeInteractiveTarget:function(t){return delete this._map._targets[m(t)],this},getAttribution:function(){return this.options.attribution},_layerAdd:function(t){var e=t.target;if(e.hasLayer(this)){if(this._map=e,this._zoomAnimated=e._zoomAnimated,this.getEvents){var n=this.getEvents();e.on(n,this),this.once("remove",function(){e.off(n,this)},this)}this.onAdd(e),this.fire("add"),e.fire("layeradd",{layer:this})}}});ot.include({addLayer:function(t){if(!t._layerAdd)throw new Error("The provided object is not a Layer.");var e=m(t);return this._layers[e]?this:(this._layers[e]=t,t._mapToAdd=this,t.beforeAdd&&t.beforeAdd(this),this.whenReady(t._layerAdd,t),this)},removeLayer:function(t){var e=m(t);return this._layers[e]?(this._loaded&&t.onRemove(this),delete this._layers[e],this._loaded&&(this.fire("layerremove",{layer:t}),t.fire("remove")),t._map=t._mapToAdd=null,this):this},hasLayer:function(t){return m(t)in this._layers},eachLayer:function(t,e){for(var n in this._layers)t.call(e,this._layers[n]);return this},_addLayers:function(t){t=t?V(t)?t:[t]:[];for(var e=0,n=t.length;e<n;e++)this.addLayer(t[e])},_addZoomLimit:function(t){(!isNaN(t.options.maxZoom)||!isNaN(t.options.minZoom))&&(this._zoomBoundLayers[m(t)]=t,this._updateZoomLevels())},_removeZoomLimit:function(t){var e=m(t);this._zoomBoundLayers[e]&&(delete this._zoomBoundLayers[e],this._updateZoomLevels())},_updateZoomLevels:function(){var t=1/0,e=-1/0,n=this._getZoomSpan();for(var s in this._zoomBoundLayers){var c=this._zoomBoundLayers[s].options;t=c.minZoom===void 0?t:Math.min(t,c.minZoom),e=c.maxZoom===void 0?e:Math.max(e,c.maxZoom)}this._layersMaxZoom=e===-1/0?void 0:e,this._layersMinZoom=t===1/0?void 0:t,n!==this._getZoomSpan()&&this.fire("zoomlevelschange"),this.options.maxZoom===void 0&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom&&this.setZoom(this._layersMaxZoom),this.options.minZoom===void 0&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom&&this.setZoom(this._layersMinZoom)}});var qe=ie.extend({initialize:function(t,e){w(this,e),this._layers={};var n,s;if(t)for(n=0,s=t.length;n<s;n++)this.addLayer(t[n])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){var e=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[e]&&this._map.removeLayer(this._layers[e]),delete this._layers[e],this},hasLayer:function(t){var e=typeof t=="number"?t:this.getLayerId(t);return e in this._layers},clearLayers:function(){return this.eachLayer(this.removeLayer,this)},invoke:function(t){var e=Array.prototype.slice.call(arguments,1),n,s;for(n in this._layers)s=this._layers[n],s[t]&&s[t].apply(s,e);return this},onAdd:function(t){this.eachLayer(t.addLayer,t)},onRemove:function(t){this.eachLayer(t.removeLayer,t)},eachLayer:function(t,e){for(var n in this._layers)t.call(e,this._layers[n]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];return this.eachLayer(t.push,t),t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:function(t){return m(t)}}),Xr=function(t,e){return new qe(t,e)},fe=qe.extend({addLayer:function(t){return this.hasLayer(t)?this:(t.addEventParent(this),qe.prototype.addLayer.call(this,t),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?(t in this._layers&&(t=this._layers[t]),t.removeEventParent(this),qe.prototype.removeLayer.call(this,t),this.fire("layerremove",{layer:t})):this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t=new vt;for(var e in this._layers){var n=this._layers[e];t.extend(n.getBounds?n.getBounds():n.getLatLng())}return t}}),Qr=function(t,e){return new fe(t,e)},Ue=G.extend({options:{popupAnchor:[0,0],tooltipAnchor:[0,0],crossOrigin:!1},initialize:function(t){w(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var n=this._getIconUrl(t);if(!n){if(t==="icon")throw new Error("iconUrl not set in Icon options (see the docs).");return null}var s=this._createImg(n,e&&e.tagName==="IMG"?e:null);return this._setIconStyles(s,t),(this.options.crossOrigin||this.options.crossOrigin==="")&&(s.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),s},_setIconStyles:function(t,e){var n=this.options,s=n[e+"Size"];typeof s=="number"&&(s=[s,s]);var c=j(s),h=j(e==="shadow"&&n.shadowAnchor||n.iconAnchor||c&&c.divideBy(2,!0));t.className="leaflet-marker-"+e+" "+(n.className||""),h&&(t.style.marginLeft=-h.x+"px",t.style.marginTop=-h.y+"px"),c&&(t.style.width=c.x+"px",t.style.height=c.y+"px")},_createImg:function(t,e){return e=e||document.createElement("img"),e.src=t,e},_getIconUrl:function(t){return D.retina&&this.options[t+"RetinaUrl"]||this.options[t+"Url"]}});function tl(t){return new Ue(t)}var yi=Ue.extend({options:{iconUrl:"marker-icon.png",iconRetinaUrl:"marker-icon-2x.png",shadowUrl:"marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(t){return typeof yi.imagePath!="string"&&(yi.imagePath=this._detectIconPath()),(this.options.imagePath||yi.imagePath)+Ue.prototype._getIconUrl.call(this,t)},_stripUrl:function(t){var e=function(n,s,c){var h=s.exec(n);return h&&h[c]};return t=e(t,/^url\((['"])?(.+)\1\)$/,2),t&&e(t,/^(.*)marker-icon\.png$/,1)},_detectIconPath:function(){var t=lt("div","leaflet-default-icon-path",document.body),e=ui(t,"background-image")||ui(t,"backgroundImage");if(document.body.removeChild(t),e=this._stripUrl(e),e)return e;var n=document.querySelector('link[href$="leaflet.css"]');return n?n.href.substring(0,n.href.length-11-1):""}}),Co=re.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new _e(t,t,!0)),this._draggable.on({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),tt(t,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&Tt(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_adjustPan:function(t){var e=this._marker,n=e._map,s=this._marker.options.autoPanSpeed,c=this._marker.options.autoPanPadding,h=Se(e._icon),g=n.getPixelBounds(),x=n.getPixelOrigin(),k=st(g.min._subtract(x).add(c),g.max._subtract(x).subtract(c));if(!k.contains(h)){var T=j((Math.max(k.max.x,h.x)-k.max.x)/(g.max.x-k.max.x)-(Math.min(k.min.x,h.x)-k.min.x)/(g.min.x-k.min.x),(Math.max(k.max.y,h.y)-k.max.y)/(g.max.y-k.max.y)-(Math.min(k.min.y,h.y)-k.min.y)/(g.min.y-k.min.y)).multiplyBy(s);n.panBy(T,{animate:!1}),this._draggable._newPos._add(T),this._draggable._startPos._add(T),St(e._icon,this._draggable._newPos),this._onDrag(t),this._panRequest=Z(this._adjustPan.bind(this,t))}},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng(),this._marker.closePopup&&this._marker.closePopup(),this._marker.fire("movestart").fire("dragstart")},_onPreDrag:function(t){this._marker.options.autoPan&&(at(this._panRequest),this._panRequest=Z(this._adjustPan.bind(this,t)))},_onDrag:function(t){var e=this._marker,n=e._shadow,s=Se(e._icon),c=e._map.layerPointToLatLng(s);n&&St(n,s),e._latlng=c,t.latlng=c,t.oldLatLng=this._oldLatLng,e.fire("move",t).fire("drag",t)},_onDragEnd:function(t){at(this._panRequest),delete this._oldLatLng,this._marker.fire("moveend").fire("dragend",t)}}),Fi=ie.extend({options:{icon:new yi,interactive:!0,keyboard:!0,title:"",alt:"Marker",zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250,pane:"markerPane",shadowPane:"shadowPane",bubblingMouseEvents:!1,autoPanOnFocus:!0,draggable:!1,autoPan:!1,autoPanPadding:[50,50],autoPanSpeed:10},initialize:function(t,e){w(this,e),this._latlng=nt(t)},onAdd:function(t){this._zoomAnimated=this._zoomAnimated&&t.options.markerZoomAnimation,this._zoomAnimated&&t.on("zoomanim",this._animateZoom,this),this._initIcon(),this.update()},onRemove:function(t){this.dragging&&this.dragging.enabled()&&(this.options.draggable=!0,this.dragging.removeHooks()),delete this.dragging,this._zoomAnimated&&t.off("zoomanim",this._animateZoom,this),this._removeIcon(),this._removeShadow()},getEvents:function(){return{zoom:this.update,viewreset:this.update}},getLatLng:function(){return this._latlng},setLatLng:function(t){var e=this._latlng;return this._latlng=nt(t),this.update(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update()},getIcon:function(){return this.options.icon},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},getElement:function(){return this._icon},update:function(){if(this._icon&&this._map){var t=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(t)}return this},_initIcon:function(){var t=this.options,e="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),n=t.icon.createIcon(this._icon),s=!1;n!==this._icon&&(this._icon&&this._removeIcon(),s=!0,t.title&&(n.title=t.title),n.tagName==="IMG"&&(n.alt=t.alt||"")),tt(n,e),t.keyboard&&(n.tabIndex="0",n.setAttribute("role","button")),this._icon=n,t.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&Y(n,"focus",this._panOnFocus,this);var c=t.icon.createShadow(this._shadow),h=!1;c!==this._shadow&&(this._removeShadow(),h=!0),c&&(tt(c,e),c.alt=""),this._shadow=c,t.opacity<1&&this._updateOpacity(),s&&this.getPane().appendChild(this._icon),this._initInteraction(),c&&h&&this.getPane(t.shadowPane).appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&yt(this._icon,"focus",this._panOnFocus,this),wt(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&wt(this._shadow),this._shadow=null},_setPos:function(t){this._icon&&St(this._icon,t),this._shadow&&St(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon&&(this._icon.style.zIndex=this._zIndex+t)},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(e)},_initInteraction:function(){if(this.options.interactive&&(tt(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),Co)){var t=this.options.draggable;this.dragging&&(t=this.dragging.enabled(),this.dragging.disable()),this.dragging=new Co(this),t&&this.dragging.enable()}},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var t=this.options.opacity;this._icon&&Jt(this._icon,t),this._shadow&&Jt(this._shadow,t)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)},_panOnFocus:function(){var t=this._map;if(t){var e=this.options.icon.options,n=e.iconSize?j(e.iconSize):j(0,0),s=e.iconAnchor?j(e.iconAnchor):j(0,0);t.panInside(this._latlng,{paddingTopLeft:s,paddingBottomRight:n.subtract(s)})}},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor}});function el(t,e){return new Fi(t,e)}var we=ie.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",dashArray:null,dashOffset:null,fill:!1,fillColor:null,fillOpacity:.2,fillRule:"evenodd",interactive:!0,bubblingMouseEvents:!0},beforeAdd:function(t){this._renderer=t.getRenderer(this)},onAdd:function(){this._renderer._initPath(this),this._reset(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(t){return w(this,t),this._renderer&&(this._renderer._updateStyle(this),this.options.stroke&&t&&Object.prototype.hasOwnProperty.call(t,"weight")&&this._updateBounds()),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},getElement:function(){return this._path},_reset:function(){this._project(),this._update()},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(this._renderer.options.tolerance||0)}}),qi=we.extend({options:{fill:!0,radius:10},initialize:function(t,e){w(this,e),this._latlng=nt(t),this._radius=this.options.radius},setLatLng:function(t){var e=this._latlng;return this._latlng=nt(t),this.redraw(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius},setStyle:function(t){var e=t&&t.radius||this._radius;return we.prototype.setStyle.call(this,t),this.setRadius(e),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var t=this._radius,e=this._radiusY||t,n=this._clickTolerance(),s=[t+n,e+n];this._pxBounds=new q(this._point.subtract(s),this._point.add(s))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)},_containsPoint:function(t){return t.distanceTo(this._point)<=this._radius+this._clickTolerance()}});function il(t,e){return new qi(t,e)}var Yn=qi.extend({initialize:function(t,e,n){if(typeof e=="number"&&(e=l({},n,{radius:e})),w(this,e),this._latlng=nt(t),isNaN(this.options.radius))throw new Error("Circle radius cannot be NaN");this._mRadius=this.options.radius},setRadius:function(t){return this._mRadius=t,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var t=[this._radius,this._radiusY||this._radius];return new vt(this._map.layerPointToLatLng(this._point.subtract(t)),this._map.layerPointToLatLng(this._point.add(t)))},setStyle:we.prototype.setStyle,_project:function(){var t=this._latlng.lng,e=this._latlng.lat,n=this._map,s=n.options.crs;if(s.distance===xe.distance){var c=Math.PI/180,h=this._mRadius/xe.R/c,g=n.project([e+h,t]),x=n.project([e-h,t]),k=g.add(x).divideBy(2),T=n.unproject(k).lat,A=Math.acos((Math.cos(h*c)-Math.sin(e*c)*Math.sin(T*c))/(Math.cos(e*c)*Math.cos(T*c)))/c;(isNaN(A)||A===0)&&(A=h/Math.cos(Math.PI/180*e)),this._point=k.subtract(n.getPixelOrigin()),this._radius=isNaN(A)?0:k.x-n.project([T,t-A]).x,this._radiusY=k.y-g.y}else{var U=s.unproject(s.project(this._latlng).subtract([this._mRadius,0]));this._point=n.latLngToLayerPoint(this._latlng),this._radius=this._point.x-n.latLngToLayerPoint(U).x}this._updateBounds()}});function nl(t,e,n){return new Yn(t,e,n)}var ve=we.extend({options:{smoothFactor:1,noClip:!1},initialize:function(t,e){w(this,e),this._setLatLngs(t)},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._setLatLngs(t),this.redraw()},isEmpty:function(){return!this._latlngs.length},closestLayerPoint:function(t){for(var e=1/0,n=null,s=gi,c,h,g=0,x=this._parts.length;g<x;g++)for(var k=this._parts[g],T=1,A=k.length;T<A;T++){c=k[T-1],h=k[T];var U=s(t,c,h,!0);U<e&&(e=U,n=s(t,c,h))}return n&&(n.distance=Math.sqrt(e)),n},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return zo(this._defaultShape(),this._map.options.crs)},getBounds:function(){return this._bounds},addLatLng:function(t,e){return e=e||this._defaultShape(),t=nt(t),e.push(t),this._bounds.extend(t),this.redraw()},_setLatLngs:function(t){this._bounds=new vt,this._latlngs=this._convertLatLngs(t)},_defaultShape:function(){return Yt(this._latlngs)?this._latlngs:this._latlngs[0]},_convertLatLngs:function(t){for(var e=[],n=Yt(t),s=0,c=t.length;s<c;s++)n?(e[s]=nt(t[s]),this._bounds.extend(e[s])):e[s]=this._convertLatLngs(t[s]);return e},_project:function(){var t=new q;this._rings=[],this._projectLatlngs(this._latlngs,this._rings,t),this._bounds.isValid()&&t.isValid()&&(this._rawPxBounds=t,this._updateBounds())},_updateBounds:function(){var t=this._clickTolerance(),e=new H(t,t);this._rawPxBounds&&(this._pxBounds=new q([this._rawPxBounds.min.subtract(e),this._rawPxBounds.max.add(e)]))},_projectLatlngs:function(t,e,n){var s=t[0]instanceof dt,c=t.length,h,g;if(s){for(g=[],h=0;h<c;h++)g[h]=this._map.latLngToLayerPoint(t[h]),n.extend(g[h]);e.push(g)}else for(h=0;h<c;h++)this._projectLatlngs(t[h],e,n)},_clipPoints:function(){var t=this._renderer._bounds;if(this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(t))){if(this.options.noClip){this._parts=this._rings;return}var e=this._parts,n,s,c,h,g,x,k;for(n=0,c=0,h=this._rings.length;n<h;n++)for(k=this._rings[n],s=0,g=k.length;s<g-1;s++)x=wo(k[s],k[s+1],t,s,!0),x&&(e[c]=e[c]||[],e[c].push(x[0]),(x[1]!==k[s+1]||s===g-2)&&(e[c].push(x[1]),c++))}},_simplifyPoints:function(){for(var t=this._parts,e=this.options.smoothFactor,n=0,s=t.length;n<s;n++)t[n]=bo(t[n],e)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)},_containsPoint:function(t,e){var n,s,c,h,g,x,k=this._clickTolerance();if(!this._pxBounds||!this._pxBounds.contains(t))return!1;for(n=0,h=this._parts.length;n<h;n++)for(x=this._parts[n],s=0,g=x.length,c=g-1;s<g;c=s++)if(!(!e&&s===0)&&xo(t,x[c],x[s])<=k)return!0;return!1}});function al(t,e){return new ve(t,e)}ve._flat=ko;var Ze=ve.extend({options:{fill:!0},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return yo(this._defaultShape(),this._map.options.crs)},_convertLatLngs:function(t){var e=ve.prototype._convertLatLngs.call(this,t),n=e.length;return n>=2&&e[0]instanceof dt&&e[0].equals(e[n-1])&&e.pop(),e},_setLatLngs:function(t){ve.prototype._setLatLngs.call(this,t),Yt(this._latlngs)&&(this._latlngs=[this._latlngs])},_defaultShape:function(){return Yt(this._latlngs[0])?this._latlngs[0]:this._latlngs[0][0]},_clipPoints:function(){var t=this._renderer._bounds,e=this.options.weight,n=new H(e,e);if(t=new q(t.min.subtract(n),t.max.add(n)),this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(t))){if(this.options.noClip){this._parts=this._rings;return}for(var s=0,c=this._rings.length,h;s<c;s++)h=go(this._rings[s],t,!0),h.length&&this._parts.push(h)}},_updatePath:function(){this._renderer._updatePoly(this,!0)},_containsPoint:function(t){var e=!1,n,s,c,h,g,x,k,T;if(!this._pxBounds||!this._pxBounds.contains(t))return!1;for(h=0,k=this._parts.length;h<k;h++)for(n=this._parts[h],g=0,T=n.length,x=T-1;g<T;x=g++)s=n[g],c=n[x],s.y>t.y!=c.y>t.y&&t.x<(c.x-s.x)*(t.y-s.y)/(c.y-s.y)+s.x&&(e=!e);return e||ve.prototype._containsPoint.call(this,t,!0)}});function ol(t,e){return new Ze(t,e)}var ge=fe.extend({initialize:function(t,e){w(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e=V(t)?t:t.features,n,s,c;if(e){for(n=0,s=e.length;n<s;n++)c=e[n],(c.geometries||c.geometry||c.features||c.coordinates)&&this.addData(c);return this}var h=this.options;if(h.filter&&!h.filter(t))return this;var g=Ui(t,h);return g?(g.feature=Wi(t),g.defaultOptions=g.options,this.resetStyle(g),h.onEachFeature&&h.onEachFeature(t,g),this.addLayer(g)):this},resetStyle:function(t){return t===void 0?this.eachLayer(this.resetStyle,this):(t.options=l({},t.defaultOptions),this._setLayerStyle(t,this.options.style),this)},setStyle:function(t){return this.eachLayer(function(e){this._setLayerStyle(e,t)},this)},_setLayerStyle:function(t,e){t.setStyle&&(typeof e=="function"&&(e=e(t.feature)),t.setStyle(e))}});function Ui(t,e){var n=t.type==="Feature"?t.geometry:t,s=n?n.coordinates:null,c=[],h=e&&e.pointToLayer,g=e&&e.coordsToLatLng||Xn,x,k,T,A;if(!s&&!n)return null;switch(n.type){case"Point":return x=g(s),Eo(h,t,x,e);case"MultiPoint":for(T=0,A=s.length;T<A;T++)x=g(s[T]),c.push(Eo(h,t,x,e));return new fe(c);case"LineString":case"MultiLineString":return k=Zi(s,n.type==="LineString"?0:1,g),new ve(k,e);case"Polygon":case"MultiPolygon":return k=Zi(s,n.type==="Polygon"?1:2,g),new Ze(k,e);case"GeometryCollection":for(T=0,A=n.geometries.length;T<A;T++){var U=Ui({geometry:n.geometries[T],type:"Feature",properties:t.properties},e);U&&c.push(U)}return new fe(c);case"FeatureCollection":for(T=0,A=n.features.length;T<A;T++){var it=Ui(n.features[T],e);it&&c.push(it)}return new fe(c);default:throw new Error("Invalid GeoJSON object.")}}function Eo(t,e,n,s){return t?t(e,n):new Fi(n,s&&s.markersInheritOptions&&s)}function Xn(t){return new dt(t[1],t[0],t[2])}function Zi(t,e,n){for(var s=[],c=0,h=t.length,g;c<h;c++)g=e?Zi(t[c],e-1,n):(n||Xn)(t[c]),s.push(g);return s}function Qn(t,e){return t=nt(t),t.alt!==void 0?[_(t.lng,e),_(t.lat,e),_(t.alt,e)]:[_(t.lng,e),_(t.lat,e)]}function Vi(t,e,n,s){for(var c=[],h=0,g=t.length;h<g;h++)c.push(e?Vi(t[h],Yt(t[h])?0:e-1,n,s):Qn(t[h],s));return!e&&n&&c.length>0&&c.push(c[0].slice()),c}function Ve(t,e){return t.feature?l({},t.feature,{geometry:e}):Wi(e)}function Wi(t){return t.type==="Feature"||t.type==="FeatureCollection"?t:{type:"Feature",properties:{},geometry:t}}var ta={toGeoJSON:function(t){return Ve(this,{type:"Point",coordinates:Qn(this.getLatLng(),t)})}};Fi.include(ta),Yn.include(ta),qi.include(ta),ve.include({toGeoJSON:function(t){var e=!Yt(this._latlngs),n=Vi(this._latlngs,e?1:0,!1,t);return Ve(this,{type:(e?"Multi":"")+"LineString",coordinates:n})}}),Ze.include({toGeoJSON:function(t){var e=!Yt(this._latlngs),n=e&&!Yt(this._latlngs[0]),s=Vi(this._latlngs,n?2:e?1:0,!0,t);return e||(s=[s]),Ve(this,{type:(n?"Multi":"")+"Polygon",coordinates:s})}}),qe.include({toMultiPoint:function(t){var e=[];return this.eachLayer(function(n){e.push(n.toGeoJSON(t).geometry.coordinates)}),Ve(this,{type:"MultiPoint",coordinates:e})},toGeoJSON:function(t){var e=this.feature&&this.feature.geometry&&this.feature.geometry.type;if(e==="MultiPoint")return this.toMultiPoint(t);var n=e==="GeometryCollection",s=[];return this.eachLayer(function(c){if(c.toGeoJSON){var h=c.toGeoJSON(t);if(n)s.push(h.geometry);else{var g=Wi(h);g.type==="FeatureCollection"?s.push.apply(s,g.features):s.push(g)}}}),n?Ve(this,{geometries:s,type:"GeometryCollection"}):{type:"FeatureCollection",features:s}}});function To(t,e){return new ge(t,e)}var sl=To,Gi=ie.extend({options:{opacity:1,alt:"",interactive:!1,crossOrigin:!1,errorOverlayUrl:"",zIndex:1,className:""},initialize:function(t,e,n){this._url=t,this._bounds=ht(e),w(this,n)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(tt(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){wt(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(t){return this.options.opacity=t,this._image&&this._updateOpacity(),this},setStyle:function(t){return t.opacity&&this.setOpacity(t.opacity),this},bringToFront:function(){return this._map&&De(this._image),this},bringToBack:function(){return this._map&&Fe(this._image),this},setUrl:function(t){return this._url=t,this._image&&(this._image.src=t),this},setBounds:function(t){return this._bounds=ht(t),this._map&&this._reset(),this},getEvents:function(){var t={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},getBounds:function(){return this._bounds},getElement:function(){return this._image},_initImage:function(){var t=this._url.tagName==="IMG",e=this._image=t?this._url:lt("img");if(tt(e,"leaflet-image-layer"),this._zoomAnimated&&tt(e,"leaflet-zoom-animated"),this.options.className&&tt(e,this.options.className),e.onselectstart=y,e.onmousemove=y,e.onload=u(this.fire,this,"load"),e.onerror=u(this._overlayOnError,this,"error"),(this.options.crossOrigin||this.options.crossOrigin==="")&&(e.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),this.options.zIndex&&this._updateZIndex(),t){this._url=e.src;return}e.src=this._url,e.alt=this.options.alt},_animateZoom:function(t){var e=this._map.getZoomScale(t.zoom),n=this._map._latLngBoundsToNewLayerBounds(this._bounds,t.zoom,t.center).min;Te(this._image,n,e)},_reset:function(){var t=this._image,e=new q(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),n=e.getSize();St(t,e.min),t.style.width=n.x+"px",t.style.height=n.y+"px"},_updateOpacity:function(){Jt(this._image,this.options.opacity)},_updateZIndex:function(){this._image&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._image.style.zIndex=this.options.zIndex)},_overlayOnError:function(){this.fire("error");var t=this.options.errorOverlayUrl;t&&this._url!==t&&(this._url=t,this._image.src=t)},getCenter:function(){return this._bounds.getCenter()}}),rl=function(t,e,n){return new Gi(t,e,n)},So=Gi.extend({options:{autoplay:!0,loop:!0,keepAspectRatio:!0,muted:!1,playsInline:!0},_initImage:function(){var t=this._url.tagName==="VIDEO",e=this._image=t?this._url:lt("video");if(tt(e,"leaflet-image-layer"),this._zoomAnimated&&tt(e,"leaflet-zoom-animated"),this.options.className&&tt(e,this.options.className),e.onselectstart=y,e.onmousemove=y,e.onloadeddata=u(this.fire,this,"load"),t){for(var n=e.getElementsByTagName("source"),s=[],c=0;c<n.length;c++)s.push(n[c].src);this._url=n.length>0?s:[e.src];return}V(this._url)||(this._url=[this._url]),!this.options.keepAspectRatio&&Object.prototype.hasOwnProperty.call(e.style,"objectFit")&&(e.style.objectFit="fill"),e.autoplay=!!this.options.autoplay,e.loop=!!this.options.loop,e.muted=!!this.options.muted,e.playsInline=!!this.options.playsInline;for(var h=0;h<this._url.length;h++){var g=lt("source");g.src=this._url[h],e.appendChild(g)}}});function ll(t,e,n){return new So(t,e,n)}var Mo=Gi.extend({_initImage:function(){var t=this._image=this._url;tt(t,"leaflet-image-layer"),this._zoomAnimated&&tt(t,"leaflet-zoom-animated"),this.options.className&&tt(t,this.options.className),t.onselectstart=y,t.onmousemove=y}});function cl(t,e,n){return new Mo(t,e,n)}var le=ie.extend({options:{interactive:!1,offset:[0,0],className:"",pane:void 0,content:""},initialize:function(t,e){t&&(t instanceof dt||V(t))?(this._latlng=nt(t),w(this,e)):(w(this,t),this._source=e),this.options.content&&(this._content=this.options.content)},openOn:function(t){return t=arguments.length?t:this._source._map,t.hasLayer(this)||t.addLayer(this),this},close:function(){return this._map&&this._map.removeLayer(this),this},toggle:function(t){return this._map?this.close():(arguments.length?this._source=t:t=this._source,this._prepareOpen(),this.openOn(t._map)),this},onAdd:function(t){this._zoomAnimated=t._zoomAnimated,this._container||this._initLayout(),t._fadeAnimated&&Jt(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),t._fadeAnimated&&Jt(this._container,1),this.bringToFront(),this.options.interactive&&(tt(this._container,"leaflet-interactive"),this.addInteractiveTarget(this._container))},onRemove:function(t){t._fadeAnimated?(Jt(this._container,0),this._removeTimeout=setTimeout(u(wt,void 0,this._container),200)):wt(this._container),this.options.interactive&&(Tt(this._container,"leaflet-interactive"),this.removeInteractiveTarget(this._container))},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=nt(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},getElement:function(){return this._container},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var t={zoom:this._updatePosition,viewreset:this._updatePosition};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},bringToFront:function(){return this._map&&De(this._container),this},bringToBack:function(){return this._map&&Fe(this._container),this},_prepareOpen:function(t){var e=this._source;if(!e._map)return!1;if(e instanceof fe){e=null;var n=this._source._layers;for(var s in n)if(n[s]._map){e=n[s];break}if(!e)return!1;this._source=e}if(!t)if(e.getCenter)t=e.getCenter();else if(e.getLatLng)t=e.getLatLng();else if(e.getBounds)t=e.getBounds().getCenter();else throw new Error("Unable to get source layer LatLng.");return this.setLatLng(t),this._map&&this.update(),!0},_updateContent:function(){if(this._content){var t=this._contentNode,e=typeof this._content=="function"?this._content(this._source||this):this._content;if(typeof e=="string")t.innerHTML=e;else{for(;t.hasChildNodes();)t.removeChild(t.firstChild);t.appendChild(e)}this.fire("contentupdate")}},_updatePosition:function(){if(this._map){var t=this._map.latLngToLayerPoint(this._latlng),e=j(this.options.offset),n=this._getAnchor();this._zoomAnimated?St(this._container,t.add(n)):e=e.add(t).add(n);var s=this._containerBottom=-e.y,c=this._containerLeft=-Math.round(this._containerWidth/2)+e.x;this._container.style.bottom=s+"px",this._container.style.left=c+"px"}},_getAnchor:function(){return[0,0]}});ot.include({_initOverlay:function(t,e,n,s){var c=e;return c instanceof t||(c=new t(s).setContent(e)),n&&c.setLatLng(n),c}}),ie.include({_initOverlay:function(t,e,n,s){var c=n;return c instanceof t?(w(c,s),c._source=this):(c=e&&!s?e:new t(s,this),c.setContent(n)),c}});var Ki=le.extend({options:{pane:"popupPane",offset:[0,7],maxWidth:300,minWidth:50,maxHeight:null,autoPan:!0,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:!1,closeButton:!0,autoClose:!0,closeOnEscapeKey:!0,className:""},openOn:function(t){return t=arguments.length?t:this._source._map,!t.hasLayer(this)&&t._popup&&t._popup.options.autoClose&&t.removeLayer(t._popup),t._popup=this,le.prototype.openOn.call(this,t)},onAdd:function(t){le.prototype.onAdd.call(this,t),t.fire("popupopen",{popup:this}),this._source&&(this._source.fire("popupopen",{popup:this},!0),this._source instanceof we||this._source.on("preclick",Me))},onRemove:function(t){le.prototype.onRemove.call(this,t),t.fire("popupclose",{popup:this}),this._source&&(this._source.fire("popupclose",{popup:this},!0),this._source instanceof we||this._source.off("preclick",Me))},getEvents:function(){var t=le.prototype.getEvents.call(this);return(this.options.closeOnClick!==void 0?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this.close),this.options.keepInView&&(t.moveend=this._adjustPan),t},_initLayout:function(){var t="leaflet-popup",e=this._container=lt("div",t+" "+(this.options.className||"")+" leaflet-zoom-animated"),n=this._wrapper=lt("div",t+"-content-wrapper",e);if(this._contentNode=lt("div",t+"-content",n),fi(e),qn(this._contentNode),Y(e,"contextmenu",Me),this._tipContainer=lt("div",t+"-tip-container",e),this._tip=lt("div",t+"-tip",this._tipContainer),this.options.closeButton){var s=this._closeButton=lt("a",t+"-close-button",e);s.setAttribute("role","button"),s.setAttribute("aria-label","Close popup"),s.href="#close",s.innerHTML='<span aria-hidden="true">&#215;</span>',Y(s,"click",function(c){At(c),this.close()},this)}},_updateLayout:function(){var t=this._contentNode,e=t.style;e.width="",e.whiteSpace="nowrap";var n=t.offsetWidth;n=Math.min(n,this.options.maxWidth),n=Math.max(n,this.options.minWidth),e.width=n+1+"px",e.whiteSpace="",e.height="";var s=t.offsetHeight,c=this.options.maxHeight,h="leaflet-popup-scrolled";c&&s>c?(e.height=c+"px",tt(t,h)):Tt(t,h),this._containerWidth=this._container.offsetWidth},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center),n=this._getAnchor();St(this._container,e.add(n))},_adjustPan:function(){if(this.options.autoPan){if(this._map._panAnim&&this._map._panAnim.stop(),this._autopanning){this._autopanning=!1;return}var t=this._map,e=parseInt(ui(this._container,"marginBottom"),10)||0,n=this._container.offsetHeight+e,s=this._containerWidth,c=new H(this._containerLeft,-n-this._containerBottom);c._add(Se(this._container));var h=t.layerPointToContainerPoint(c),g=j(this.options.autoPanPadding),x=j(this.options.autoPanPaddingTopLeft||g),k=j(this.options.autoPanPaddingBottomRight||g),T=t.getSize(),A=0,U=0;h.x+s+k.x>T.x&&(A=h.x+s-T.x+k.x),h.x-A-x.x<0&&(A=h.x-x.x),h.y+n+k.y>T.y&&(U=h.y+n-T.y+k.y),h.y-U-x.y<0&&(U=h.y-x.y),(A||U)&&(this.options.keepInView&&(this._autopanning=!0),t.fire("autopanstart").panBy([A,U]))}},_getAnchor:function(){return j(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0])}}),dl=function(t,e){return new Ki(t,e)};ot.mergeOptions({closePopupOnClick:!0}),ot.include({openPopup:function(t,e,n){return this._initOverlay(Ki,t,e,n).openOn(this),this},closePopup:function(t){return t=arguments.length?t:this._popup,t&&t.close(),this}}),ie.include({bindPopup:function(t,e){return this._popup=this._initOverlay(Ki,this._popup,t,e),this._popupHandlersAdded||(this.on({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(t){return this._popup&&(this instanceof fe||(this._popup._source=this),this._popup._prepareOpen(t||this._latlng)&&this._popup.openOn(this._map)),this},closePopup:function(){return this._popup&&this._popup.close(),this},togglePopup:function(){return this._popup&&this._popup.toggle(this),this},isPopupOpen:function(){return this._popup?this._popup.isOpen():!1},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},getPopup:function(){return this._popup},_openPopup:function(t){if(!(!this._popup||!this._map)){$e(t);var e=t.layer||t.target;if(this._popup._source===e&&!(e instanceof we)){this._map.hasLayer(this._popup)?this.closePopup():this.openPopup(t.latlng);return}this._popup._source=e,this.openPopup(t.latlng)}},_movePopup:function(t){this._popup.setLatLng(t.latlng)},_onKeyPress:function(t){t.originalEvent.keyCode===13&&this._openPopup(t)}});var Ji=le.extend({options:{pane:"tooltipPane",offset:[0,0],direction:"auto",permanent:!1,sticky:!1,opacity:.9},onAdd:function(t){le.prototype.onAdd.call(this,t),this.setOpacity(this.options.opacity),t.fire("tooltipopen",{tooltip:this}),this._source&&(this.addEventParent(this._source),this._source.fire("tooltipopen",{tooltip:this},!0))},onRemove:function(t){le.prototype.onRemove.call(this,t),t.fire("tooltipclose",{tooltip:this}),this._source&&(this.removeEventParent(this._source),this._source.fire("tooltipclose",{tooltip:this},!0))},getEvents:function(){var t=le.prototype.getEvents.call(this);return this.options.permanent||(t.preclick=this.close),t},_initLayout:function(){var t="leaflet-tooltip",e=t+" "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide");this._contentNode=this._container=lt("div",e),this._container.setAttribute("role","tooltip"),this._container.setAttribute("id","leaflet-tooltip-"+m(this))},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(t){var e,n,s=this._map,c=this._container,h=s.latLngToContainerPoint(s.getCenter()),g=s.layerPointToContainerPoint(t),x=this.options.direction,k=c.offsetWidth,T=c.offsetHeight,A=j(this.options.offset),U=this._getAnchor();x==="top"?(e=k/2,n=T):x==="bottom"?(e=k/2,n=0):x==="center"?(e=k/2,n=T/2):x==="right"?(e=0,n=T/2):x==="left"?(e=k,n=T/2):g.x<h.x?(x="right",e=0,n=T/2):(x="left",e=k+(A.x+U.x)*2,n=T/2),t=t.subtract(j(e,n,!0)).add(A).add(U),Tt(c,"leaflet-tooltip-right"),Tt(c,"leaflet-tooltip-left"),Tt(c,"leaflet-tooltip-top"),Tt(c,"leaflet-tooltip-bottom"),tt(c,"leaflet-tooltip-"+x),St(c,t)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},setOpacity:function(t){this.options.opacity=t,this._container&&Jt(this._container,t)},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);this._setPosition(e)},_getAnchor:function(){return j(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0])}}),ul=function(t,e){return new Ji(t,e)};ot.include({openTooltip:function(t,e,n){return this._initOverlay(Ji,t,e,n).openOn(this),this},closeTooltip:function(t){return t.close(),this}}),ie.include({bindTooltip:function(t,e){return this._tooltip&&this.isTooltipOpen()&&this.unbindTooltip(),this._tooltip=this._initOverlay(Ji,this._tooltip,t,e),this._initTooltipInteractions(),this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)&&this.openTooltip(),this},unbindTooltip:function(){return this._tooltip&&(this._initTooltipInteractions(!0),this.closeTooltip(),this._tooltip=null),this},_initTooltipInteractions:function(t){if(!(!t&&this._tooltipHandlersAdded)){var e=t?"off":"on",n={remove:this.closeTooltip,move:this._moveTooltip};this._tooltip.options.permanent?n.add=this._openTooltip:(n.mouseover=this._openTooltip,n.mouseout=this.closeTooltip,n.click=this._openTooltip,this._map?this._addFocusListeners():n.add=this._addFocusListeners),this._tooltip.options.sticky&&(n.mousemove=this._moveTooltip),this[e](n),this._tooltipHandlersAdded=!t}},openTooltip:function(t){return this._tooltip&&(this instanceof fe||(this._tooltip._source=this),this._tooltip._prepareOpen(t)&&(this._tooltip.openOn(this._map),this.getElement?this._setAriaDescribedByOnLayer(this):this.eachLayer&&this.eachLayer(this._setAriaDescribedByOnLayer,this))),this},closeTooltip:function(){if(this._tooltip)return this._tooltip.close()},toggleTooltip:function(){return this._tooltip&&this._tooltip.toggle(this),this},isTooltipOpen:function(){return this._tooltip.isOpen()},setTooltipContent:function(t){return this._tooltip&&this._tooltip.setContent(t),this},getTooltip:function(){return this._tooltip},_addFocusListeners:function(){this.getElement?this._addFocusListenersOnLayer(this):this.eachLayer&&this.eachLayer(this._addFocusListenersOnLayer,this)},_addFocusListenersOnLayer:function(t){var e=typeof t.getElement=="function"&&t.getElement();e&&(Y(e,"focus",function(){this._tooltip._source=t,this.openTooltip()},this),Y(e,"blur",this.closeTooltip,this))},_setAriaDescribedByOnLayer:function(t){var e=typeof t.getElement=="function"&&t.getElement();e&&e.setAttribute("aria-describedby",this._tooltip._container.id)},_openTooltip:function(t){if(!(!this._tooltip||!this._map)){if(this._map.dragging&&this._map.dragging.moving()&&!this._openOnceFlag){this._openOnceFlag=!0;var e=this;this._map.once("moveend",function(){e._openOnceFlag=!1,e._openTooltip(t)});return}this._tooltip._source=t.layer||t.target,this.openTooltip(this._tooltip.options.sticky?t.latlng:void 0)}},_moveTooltip:function(t){var e=t.latlng,n,s;this._tooltip.options.sticky&&t.originalEvent&&(n=this._map.mouseEventToContainerPoint(t.originalEvent),s=this._map.containerPointToLayerPoint(n),e=this._map.layerPointToLatLng(s)),this._tooltip.setLatLng(e)}});var $o=Ue.extend({options:{iconSize:[12,12],html:!1,bgPos:null,className:"leaflet-div-icon"},createIcon:function(t){var e=t&&t.tagName==="DIV"?t:document.createElement("div"),n=this.options;if(n.html instanceof Element?(Ri(e),e.appendChild(n.html)):e.innerHTML=n.html!==!1?n.html:"",n.bgPos){var s=j(n.bgPos);e.style.backgroundPosition=-s.x+"px "+-s.y+"px"}return this._setIconStyles(e,"icon"),e},createShadow:function(){return null}});function pl(t){return new $o(t)}Ue.Default=yi;var bi=ie.extend({options:{tileSize:256,opacity:1,updateWhenIdle:D.mobile,updateWhenZooming:!0,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:void 0,maxNativeZoom:void 0,minNativeZoom:void 0,noWrap:!1,pane:"tilePane",className:"",keepBuffer:2},initialize:function(t){w(this,t)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._resetView()},beforeAdd:function(t){t._addZoomLimit(this)},onRemove:function(t){this._removeAllTiles(),wt(this._container),t._removeZoomLimit(this),this._container=null,this._tileZoom=void 0},bringToFront:function(){return this._map&&(De(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(Fe(this._container),this._setAutoZIndex(Math.min)),this},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){if(this._map){this._removeAllTiles();var t=this._clampZoom(this._map.getZoom());t!==this._tileZoom&&(this._tileZoom=t,this._updateLevels()),this._update()}return this},getEvents:function(){var t={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};return this.options.updateWhenIdle||(this._onMove||(this._onMove=f(this._onMoveEnd,this.options.updateInterval,this)),t.move=this._onMove),this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},createTile:function(){return document.createElement("div")},getTileSize:function(){var t=this.options.tileSize;return t instanceof H?t:new H(t,t)},_updateZIndex:function(){this._container&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t){for(var e=this.getPane().children,n=-t(-1/0,1/0),s=0,c=e.length,h;s<c;s++)h=e[s].style.zIndex,e[s]!==this._container&&h&&(n=t(n,+h));isFinite(n)&&(this.options.zIndex=n+t(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map&&!D.ielt9){Jt(this._container,this.options.opacity);var t=+new Date,e=!1,n=!1;for(var s in this._tiles){var c=this._tiles[s];if(!(!c.current||!c.loaded)){var h=Math.min(1,(t-c.loaded)/200);Jt(c.el,h),h<1?e=!0:(c.active?n=!0:this._onOpaqueTile(c),c.active=!0)}}n&&!this._noPrune&&this._pruneTiles(),e&&(at(this._fadeFrame),this._fadeFrame=Z(this._updateOpacity,this))}},_onOpaqueTile:y,_initContainer:function(){this._container||(this._container=lt("div","leaflet-layer "+(this.options.className||"")),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var t=this._tileZoom,e=this.options.maxZoom;if(t!==void 0){for(var n in this._levels)n=Number(n),this._levels[n].el.children.length||n===t?(this._levels[n].el.style.zIndex=e-Math.abs(t-n),this._onUpdateLevel(n)):(wt(this._levels[n].el),this._removeTilesAtZoom(n),this._onRemoveLevel(n),delete this._levels[n]);var s=this._levels[t],c=this._map;return s||(s=this._levels[t]={},s.el=lt("div","leaflet-tile-container leaflet-zoom-animated",this._container),s.el.style.zIndex=e,s.origin=c.project(c.unproject(c.getPixelOrigin()),t).round(),s.zoom=t,this._setZoomTransform(s,c.getCenter(),c.getZoom()),y(s.el.offsetWidth),this._onCreateLevel(s)),this._level=s,s}},_onUpdateLevel:y,_onRemoveLevel:y,_onCreateLevel:y,_pruneTiles:function(){if(this._map){var t,e,n=this._map.getZoom();if(n>this.options.maxZoom||n<this.options.minZoom){this._removeAllTiles();return}for(t in this._tiles)e=this._tiles[t],e.retain=e.current;for(t in this._tiles)if(e=this._tiles[t],e.current&&!e.active){var s=e.coords;this._retainParent(s.x,s.y,s.z,s.z-5)||this._retainChildren(s.x,s.y,s.z,s.z+2)}for(t in this._tiles)this._tiles[t].retain||this._removeTile(t)}},_removeTilesAtZoom:function(t){for(var e in this._tiles)this._tiles[e].coords.z===t&&this._removeTile(e)},_removeAllTiles:function(){for(var t in this._tiles)this._removeTile(t)},_invalidateAll:function(){for(var t in this._levels)wt(this._levels[t].el),this._onRemoveLevel(Number(t)),delete this._levels[t];this._removeAllTiles(),this._tileZoom=void 0},_retainParent:function(t,e,n,s){var c=Math.floor(t/2),h=Math.floor(e/2),g=n-1,x=new H(+c,+h);x.z=+g;var k=this._tileCoordsToKey(x),T=this._tiles[k];return T&&T.active?(T.retain=!0,!0):(T&&T.loaded&&(T.retain=!0),g>s?this._retainParent(c,h,g,s):!1)},_retainChildren:function(t,e,n,s){for(var c=2*t;c<2*t+2;c++)for(var h=2*e;h<2*e+2;h++){var g=new H(c,h);g.z=n+1;var x=this._tileCoordsToKey(g),k=this._tiles[x];if(k&&k.active){k.retain=!0;continue}else k&&k.loaded&&(k.retain=!0);n+1<s&&this._retainChildren(c,h,n+1,s)}},_resetView:function(t){var e=t&&(t.pinch||t.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),e,e)},_animateZoom:function(t){this._setView(t.center,t.zoom,!0,t.noUpdate)},_clampZoom:function(t){var e=this.options;return e.minNativeZoom!==void 0&&t<e.minNativeZoom?e.minNativeZoom:e.maxNativeZoom!==void 0&&e.maxNativeZoom<t?e.maxNativeZoom:t},_setView:function(t,e,n,s){var c=Math.round(e);this.options.maxZoom!==void 0&&c>this.options.maxZoom||this.options.minZoom!==void 0&&c<this.options.minZoom?c=void 0:c=this._clampZoom(c);var h=this.options.updateWhenZooming&&c!==this._tileZoom;(!s||h)&&(this._tileZoom=c,this._abortLoading&&this._abortLoading(),this._updateLevels(),this._resetGrid(),c!==void 0&&this._update(t),n||this._pruneTiles(),this._noPrune=!!n),this._setZoomTransforms(t,e)},_setZoomTransforms:function(t,e){for(var n in this._levels)this._setZoomTransform(this._levels[n],t,e)},_setZoomTransform:function(t,e,n){var s=this._map.getZoomScale(n,t.zoom),c=t.origin.multiplyBy(s).subtract(this._map._getNewPixelOrigin(e,n)).round();D.any3d?Te(t.el,c,s):St(t.el,c)},_resetGrid:function(){var t=this._map,e=t.options.crs,n=this._tileSize=this.getTileSize(),s=this._tileZoom,c=this._map.getPixelWorldBounds(this._tileZoom);c&&(this._globalTileRange=this._pxBoundsToTileRange(c)),this._wrapX=e.wrapLng&&!this.options.noWrap&&[Math.floor(t.project([0,e.wrapLng[0]],s).x/n.x),Math.ceil(t.project([0,e.wrapLng[1]],s).x/n.y)],this._wrapY=e.wrapLat&&!this.options.noWrap&&[Math.floor(t.project([e.wrapLat[0],0],s).y/n.x),Math.ceil(t.project([e.wrapLat[1],0],s).y/n.y)]},_onMoveEnd:function(){!this._map||this._map._animatingZoom||this._update()},_getTiledPixelBounds:function(t){var e=this._map,n=e._animatingZoom?Math.max(e._animateToZoom,e.getZoom()):e.getZoom(),s=e.getZoomScale(n,this._tileZoom),c=e.project(t,this._tileZoom).floor(),h=e.getSize().divideBy(s*2);return new q(c.subtract(h),c.add(h))},_update:function(t){var e=this._map;if(e){var n=this._clampZoom(e.getZoom());if(t===void 0&&(t=e.getCenter()),this._tileZoom!==void 0){var s=this._getTiledPixelBounds(t),c=this._pxBoundsToTileRange(s),h=c.getCenter(),g=[],x=this.options.keepBuffer,k=new q(c.getBottomLeft().subtract([x,-x]),c.getTopRight().add([x,-x]));if(!(isFinite(c.min.x)&&isFinite(c.min.y)&&isFinite(c.max.x)&&isFinite(c.max.y)))throw new Error("Attempted to load an infinite number of tiles");for(var T in this._tiles){var A=this._tiles[T].coords;(A.z!==this._tileZoom||!k.contains(new H(A.x,A.y)))&&(this._tiles[T].current=!1)}if(Math.abs(n-this._tileZoom)>1){this._setView(t,n);return}for(var U=c.min.y;U<=c.max.y;U++)for(var it=c.min.x;it<=c.max.x;it++){var Bt=new H(it,U);if(Bt.z=this._tileZoom,!!this._isValidTile(Bt)){var Pt=this._tiles[this._tileCoordsToKey(Bt)];Pt?Pt.current=!0:g.push(Bt)}}if(g.sort(function(Nt,Ge){return Nt.distanceTo(h)-Ge.distanceTo(h)}),g.length!==0){this._loading||(this._loading=!0,this.fire("loading"));var Xt=document.createDocumentFragment();for(it=0;it<g.length;it++)this._addTile(g[it],Xt);this._level.el.appendChild(Xt)}}}},_isValidTile:function(t){var e=this._map.options.crs;if(!e.infinite){var n=this._globalTileRange;if(!e.wrapLng&&(t.x<n.min.x||t.x>n.max.x)||!e.wrapLat&&(t.y<n.min.y||t.y>n.max.y))return!1}if(!this.options.bounds)return!0;var s=this._tileCoordsToBounds(t);return ht(this.options.bounds).overlaps(s)},_keyToBounds:function(t){return this._tileCoordsToBounds(this._keyToTileCoords(t))},_tileCoordsToNwSe:function(t){var e=this._map,n=this.getTileSize(),s=t.scaleBy(n),c=s.add(n),h=e.unproject(s,t.z),g=e.unproject(c,t.z);return[h,g]},_tileCoordsToBounds:function(t){var e=this._tileCoordsToNwSe(t),n=new vt(e[0],e[1]);return this.options.noWrap||(n=this._map.wrapLatLngBounds(n)),n},_tileCoordsToKey:function(t){return t.x+":"+t.y+":"+t.z},_keyToTileCoords:function(t){var e=t.split(":"),n=new H(+e[0],+e[1]);return n.z=+e[2],n},_removeTile:function(t){var e=this._tiles[t];e&&(wt(e.el),delete this._tiles[t],this.fire("tileunload",{tile:e.el,coords:this._keyToTileCoords(t)}))},_initTile:function(t){tt(t,"leaflet-tile");var e=this.getTileSize();t.style.width=e.x+"px",t.style.height=e.y+"px",t.onselectstart=y,t.onmousemove=y,D.ielt9&&this.options.opacity<1&&Jt(t,this.options.opacity)},_addTile:function(t,e){var n=this._getTilePos(t),s=this._tileCoordsToKey(t),c=this.createTile(this._wrapCoords(t),u(this._tileReady,this,t));this._initTile(c),this.createTile.length<2&&Z(u(this._tileReady,this,t,null,c)),St(c,n),this._tiles[s]={el:c,coords:t,current:!0},e.appendChild(c),this.fire("tileloadstart",{tile:c,coords:t})},_tileReady:function(t,e,n){e&&this.fire("tileerror",{error:e,tile:n,coords:t});var s=this._tileCoordsToKey(t);n=this._tiles[s],n&&(n.loaded=+new Date,this._map._fadeAnimated?(Jt(n.el,0),at(this._fadeFrame),this._fadeFrame=Z(this._updateOpacity,this)):(n.active=!0,this._pruneTiles()),e||(tt(n.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:n.el,coords:t})),this._noTilesToLoad()&&(this._loading=!1,this.fire("load"),D.ielt9||!this._map._fadeAnimated?Z(this._pruneTiles,this):setTimeout(u(this._pruneTiles,this),250)))},_getTilePos:function(t){return t.scaleBy(this.getTileSize()).subtract(this._level.origin)},_wrapCoords:function(t){var e=new H(this._wrapX?v(t.x,this._wrapX):t.x,this._wrapY?v(t.y,this._wrapY):t.y);return e.z=t.z,e},_pxBoundsToTileRange:function(t){var e=this.getTileSize();return new q(t.min.unscaleBy(e).floor(),t.max.unscaleBy(e).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var t in this._tiles)if(!this._tiles[t].loaded)return!1;return!0}});function hl(t){return new bi(t)}var We=bi.extend({options:{minZoom:0,maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1,referrerPolicy:!1},initialize:function(t,e){this._url=t,e=w(this,e),e.detectRetina&&D.retina&&e.maxZoom>0?(e.tileSize=Math.floor(e.tileSize/2),e.zoomReverse?(e.zoomOffset--,e.minZoom=Math.min(e.maxZoom,e.minZoom+1)):(e.zoomOffset++,e.maxZoom=Math.max(e.minZoom,e.maxZoom-1)),e.minZoom=Math.max(0,e.minZoom)):e.zoomReverse?e.minZoom=Math.min(e.maxZoom,e.minZoom):e.maxZoom=Math.max(e.minZoom,e.maxZoom),typeof e.subdomains=="string"&&(e.subdomains=e.subdomains.split("")),this.on("tileunload",this._onTileRemove)},setUrl:function(t,e){return this._url===t&&e===void 0&&(e=!0),this._url=t,e||this.redraw(),this},createTile:function(t,e){var n=document.createElement("img");return Y(n,"load",u(this._tileOnLoad,this,e,n)),Y(n,"error",u(this._tileOnError,this,e,n)),(this.options.crossOrigin||this.options.crossOrigin==="")&&(n.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),typeof this.options.referrerPolicy=="string"&&(n.referrerPolicy=this.options.referrerPolicy),n.alt="",n.src=this.getTileUrl(t),n},getTileUrl:function(t){var e={r:D.retina?"@2x":"",s:this._getSubdomain(t),x:t.x,y:t.y,z:this._getZoomForUrl()};if(this._map&&!this._map.options.crs.infinite){var n=this._globalTileRange.max.y-t.y;this.options.tms&&(e.y=n),e["-y"]=n}return P(this._url,l(e,this.options))},_tileOnLoad:function(t,e){D.ielt9?setTimeout(u(t,this,null,e),0):t(null,e)},_tileOnError:function(t,e,n){var s=this.options.errorTileUrl;s&&e.getAttribute("src")!==s&&(e.src=s),t(n,e)},_onTileRemove:function(t){t.tile.onload=null},_getZoomForUrl:function(){var t=this._tileZoom,e=this.options.maxZoom,n=this.options.zoomReverse,s=this.options.zoomOffset;return n&&(t=e-t),t+s},_getSubdomain:function(t){var e=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[e]},_abortLoading:function(){var t,e;for(t in this._tiles)if(this._tiles[t].coords.z!==this._tileZoom&&(e=this._tiles[t].el,e.onload=y,e.onerror=y,!e.complete)){e.src=$;var n=this._tiles[t].coords;wt(e),delete this._tiles[t],this.fire("tileabort",{tile:e,coords:n})}},_removeTile:function(t){var e=this._tiles[t];if(e)return e.el.setAttribute("src",$),bi.prototype._removeTile.call(this,t)},_tileReady:function(t,e,n){if(!(!this._map||n&&n.getAttribute("src")===$))return bi.prototype._tileReady.call(this,t,e,n)}});function Io(t,e){return new We(t,e)}var Po=We.extend({defaultWmsParams:{service:"WMS",request:"GetMap",layers:"",styles:"",format:"image/jpeg",transparent:!1,version:"1.1.1"},options:{crs:null,uppercase:!1},initialize:function(t,e){this._url=t;var n=l({},this.defaultWmsParams);for(var s in e)s in this.options||(n[s]=e[s]);e=w(this,e);var c=e.detectRetina&&D.retina?2:1,h=this.getTileSize();n.width=h.x*c,n.height=h.y*c,this.wmsParams=n},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[e]=this._crs.code,We.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._tileCoordsToNwSe(t),n=this._crs,s=st(n.project(e[0]),n.project(e[1])),c=s.min,h=s.max,g=(this._wmsVersion>=1.3&&this._crs===Lo?[c.y,c.x,h.y,h.x]:[c.x,c.y,h.x,h.y]).join(","),x=We.prototype.getTileUrl.call(this,t);return x+M(this.wmsParams,x,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+g},setParams:function(t,e){return l(this.wmsParams,t),e||this.redraw(),this}});function ml(t,e){return new Po(t,e)}We.WMS=Po,Io.wms=ml;var ye=ie.extend({options:{padding:.1},initialize:function(t){w(this,t),m(this),this._layers=this._layers||{}},onAdd:function(){this._container||(this._initContainer(),tt(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update(),this.on("update",this._updatePaths,this)},onRemove:function(){this.off("update",this._updatePaths,this),this._destroyContainer()},getEvents:function(){var t={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};return this._zoomAnimated&&(t.zoomanim=this._onAnimZoom),t},_onAnimZoom:function(t){this._updateTransform(t.center,t.zoom)},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom())},_updateTransform:function(t,e){var n=this._map.getZoomScale(e,this._zoom),s=this._map.getSize().multiplyBy(.5+this.options.padding),c=this._map.project(this._center,e),h=s.multiplyBy(-n).add(c).subtract(this._map._getNewPixelOrigin(t,e));D.any3d?Te(this._container,h,n):St(this._container,h)},_reset:function(){this._update(),this._updateTransform(this._center,this._zoom);for(var t in this._layers)this._layers[t]._reset()},_onZoomEnd:function(){for(var t in this._layers)this._layers[t]._project()},_updatePaths:function(){for(var t in this._layers)this._layers[t]._update()},_update:function(){var t=this.options.padding,e=this._map.getSize(),n=this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();this._bounds=new q(n,n.add(e.multiplyBy(1+t*2)).round()),this._center=this._map.getCenter(),this._zoom=this._map.getZoom()}}),Ao=ye.extend({options:{tolerance:0},getEvents:function(){var t=ye.prototype.getEvents.call(this);return t.viewprereset=this._onViewPreReset,t},_onViewPreReset:function(){this._postponeUpdatePaths=!0},onAdd:function(){ye.prototype.onAdd.call(this),this._draw()},_initContainer:function(){var t=this._container=document.createElement("canvas");Y(t,"mousemove",this._onMouseMove,this),Y(t,"click dblclick mousedown mouseup contextmenu",this._onClick,this),Y(t,"mouseout",this._handleMouseOut,this),t._leaflet_disable_events=!0,this._ctx=t.getContext("2d")},_destroyContainer:function(){at(this._redrawRequest),delete this._ctx,wt(this._container),yt(this._container),delete this._container},_updatePaths:function(){if(!this._postponeUpdatePaths){var t;this._redrawBounds=null;for(var e in this._layers)t=this._layers[e],t._update();this._redraw()}},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){ye.prototype._update.call(this);var t=this._bounds,e=this._container,n=t.getSize(),s=D.retina?2:1;St(e,t.min),e.width=s*n.x,e.height=s*n.y,e.style.width=n.x+"px",e.style.height=n.y+"px",D.retina&&this._ctx.scale(2,2),this._ctx.translate(-t.min.x,-t.min.y),this.fire("update")}},_reset:function(){ye.prototype._reset.call(this),this._postponeUpdatePaths&&(this._postponeUpdatePaths=!1,this._updatePaths())},_initPath:function(t){this._updateDashArray(t),this._layers[m(t)]=t;var e=t._order={layer:t,prev:this._drawLast,next:null};this._drawLast&&(this._drawLast.next=e),this._drawLast=e,this._drawFirst=this._drawFirst||this._drawLast},_addPath:function(t){this._requestRedraw(t)},_removePath:function(t){var e=t._order,n=e.next,s=e.prev;n?n.prev=s:this._drawLast=s,s?s.next=n:this._drawFirst=n,delete t._order,delete this._layers[m(t)],this._requestRedraw(t)},_updatePath:function(t){this._extendRedrawBounds(t),t._project(),t._update(),this._requestRedraw(t)},_updateStyle:function(t){this._updateDashArray(t),this._requestRedraw(t)},_updateDashArray:function(t){if(typeof t.options.dashArray=="string"){var e=t.options.dashArray.split(/[, ]+/),n=[],s,c;for(c=0;c<e.length;c++){if(s=Number(e[c]),isNaN(s))return;n.push(s)}t.options._dashArray=n}else t.options._dashArray=t.options.dashArray},_requestRedraw:function(t){this._map&&(this._extendRedrawBounds(t),this._redrawRequest=this._redrawRequest||Z(this._redraw,this))},_extendRedrawBounds:function(t){if(t._pxBounds){var e=(t.options.weight||0)+1;this._redrawBounds=this._redrawBounds||new q,this._redrawBounds.extend(t._pxBounds.min.subtract([e,e])),this._redrawBounds.extend(t._pxBounds.max.add([e,e]))}},_redraw:function(){this._redrawRequest=null,this._redrawBounds&&(this._redrawBounds.min._floor(),this._redrawBounds.max._ceil()),this._clear(),this._draw(),this._redrawBounds=null},_clear:function(){var t=this._redrawBounds;if(t){var e=t.getSize();this._ctx.clearRect(t.min.x,t.min.y,e.x,e.y)}else this._ctx.save(),this._ctx.setTransform(1,0,0,1,0,0),this._ctx.clearRect(0,0,this._container.width,this._container.height),this._ctx.restore()},_draw:function(){var t,e=this._redrawBounds;if(this._ctx.save(),e){var n=e.getSize();this._ctx.beginPath(),this._ctx.rect(e.min.x,e.min.y,n.x,n.y),this._ctx.clip()}this._drawing=!0;for(var s=this._drawFirst;s;s=s.next)t=s.layer,(!e||t._pxBounds&&t._pxBounds.intersects(e))&&t._updatePath();this._drawing=!1,this._ctx.restore()},_updatePoly:function(t,e){if(this._drawing){var n,s,c,h,g=t._parts,x=g.length,k=this._ctx;if(x){for(k.beginPath(),n=0;n<x;n++){for(s=0,c=g[n].length;s<c;s++)h=g[n][s],k[s?"lineTo":"moveTo"](h.x,h.y);e&&k.closePath()}this._fillStroke(k,t)}}},_updateCircle:function(t){if(!(!this._drawing||t._empty())){var e=t._point,n=this._ctx,s=Math.max(Math.round(t._radius),1),c=(Math.max(Math.round(t._radiusY),1)||s)/s;c!==1&&(n.save(),n.scale(1,c)),n.beginPath(),n.arc(e.x,e.y/c,s,0,Math.PI*2,!1),c!==1&&n.restore(),this._fillStroke(n,t)}},_fillStroke:function(t,e){var n=e.options;n.fill&&(t.globalAlpha=n.fillOpacity,t.fillStyle=n.fillColor||n.color,t.fill(n.fillRule||"evenodd")),n.stroke&&n.weight!==0&&(t.setLineDash&&t.setLineDash(e.options&&e.options._dashArray||[]),t.globalAlpha=n.opacity,t.lineWidth=n.weight,t.strokeStyle=n.color,t.lineCap=n.lineCap,t.lineJoin=n.lineJoin,t.stroke())},_onClick:function(t){for(var e=this._map.mouseEventToLayerPoint(t),n,s,c=this._drawFirst;c;c=c.next)n=c.layer,n.options.interactive&&n._containsPoint(e)&&(!(t.type==="click"||t.type==="preclick")||!this._map._draggableMoved(n))&&(s=n);this._fireEvent(s?[s]:!1,t)},_onMouseMove:function(t){if(!(!this._map||this._map.dragging.moving()||this._map._animatingZoom)){var e=this._map.mouseEventToLayerPoint(t);this._handleMouseHover(t,e)}},_handleMouseOut:function(t){var e=this._hoveredLayer;e&&(Tt(this._container,"leaflet-interactive"),this._fireEvent([e],t,"mouseout"),this._hoveredLayer=null,this._mouseHoverThrottled=!1)},_handleMouseHover:function(t,e){if(!this._mouseHoverThrottled){for(var n,s,c=this._drawFirst;c;c=c.next)n=c.layer,n.options.interactive&&n._containsPoint(e)&&(s=n);s!==this._hoveredLayer&&(this._handleMouseOut(t),s&&(tt(this._container,"leaflet-interactive"),this._fireEvent([s],t,"mouseover"),this._hoveredLayer=s)),this._fireEvent(this._hoveredLayer?[this._hoveredLayer]:!1,t),this._mouseHoverThrottled=!0,setTimeout(u(function(){this._mouseHoverThrottled=!1},this),32)}},_fireEvent:function(t,e,n){this._map._fireDOMEvent(e,n||e.type,t)},_bringToFront:function(t){var e=t._order;if(e){var n=e.next,s=e.prev;if(n)n.prev=s;else return;s?s.next=n:n&&(this._drawFirst=n),e.prev=this._drawLast,this._drawLast.next=e,e.next=null,this._drawLast=e,this._requestRedraw(t)}},_bringToBack:function(t){var e=t._order;if(e){var n=e.next,s=e.prev;if(s)s.next=n;else return;n?n.prev=s:s&&(this._drawLast=s),e.prev=null,e.next=this._drawFirst,this._drawFirst.prev=e,this._drawFirst=e,this._requestRedraw(t)}}});function Bo(t){return D.canvas?new Ao(t):null}var xi=function(){try{return document.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return document.createElement("<lvml:"+t+' class="lvml">')}}catch{}return function(t){return document.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}(),fl={_initContainer:function(){this._container=lt("div","leaflet-vml-container")},_update:function(){this._map._animatingZoom||(ye.prototype._update.call(this),this.fire("update"))},_initPath:function(t){var e=t._container=xi("shape");tt(e,"leaflet-vml-shape "+(this.options.className||"")),e.coordsize="1 1",t._path=xi("path"),e.appendChild(t._path),this._updateStyle(t),this._layers[m(t)]=t},_addPath:function(t){var e=t._container;this._container.appendChild(e),t.options.interactive&&t.addInteractiveTarget(e)},_removePath:function(t){var e=t._container;wt(e),t.removeInteractiveTarget(e),delete this._layers[m(t)]},_updateStyle:function(t){var e=t._stroke,n=t._fill,s=t.options,c=t._container;c.stroked=!!s.stroke,c.filled=!!s.fill,s.stroke?(e||(e=t._stroke=xi("stroke")),c.appendChild(e),e.weight=s.weight+"px",e.color=s.color,e.opacity=s.opacity,s.dashArray?e.dashStyle=V(s.dashArray)?s.dashArray.join(" "):s.dashArray.replace(/( *, *)/g," "):e.dashStyle="",e.endcap=s.lineCap.replace("butt","flat"),e.joinstyle=s.lineJoin):e&&(c.removeChild(e),t._stroke=null),s.fill?(n||(n=t._fill=xi("fill")),c.appendChild(n),n.color=s.fillColor||s.color,n.opacity=s.fillOpacity):n&&(c.removeChild(n),t._fill=null)},_updateCircle:function(t){var e=t._point.round(),n=Math.round(t._radius),s=Math.round(t._radiusY||n);this._setPath(t,t._empty()?"M0 0":"AL "+e.x+","+e.y+" "+n+","+s+" 0,"+65535*360)},_setPath:function(t,e){t._path.v=e},_bringToFront:function(t){De(t._container)},_bringToBack:function(t){Fe(t._container)}},Yi=D.vml?xi:Ha,_i=ye.extend({_initContainer:function(){this._container=Yi("svg"),this._container.setAttribute("pointer-events","none"),this._rootGroup=Yi("g"),this._container.appendChild(this._rootGroup)},_destroyContainer:function(){wt(this._container),yt(this._container),delete this._container,delete this._rootGroup,delete this._svgSize},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){ye.prototype._update.call(this);var t=this._bounds,e=t.getSize(),n=this._container;(!this._svgSize||!this._svgSize.equals(e))&&(this._svgSize=e,n.setAttribute("width",e.x),n.setAttribute("height",e.y)),St(n,t.min),n.setAttribute("viewBox",[t.min.x,t.min.y,e.x,e.y].join(" ")),this.fire("update")}},_initPath:function(t){var e=t._path=Yi("path");t.options.className&&tt(e,t.options.className),t.options.interactive&&tt(e,"leaflet-interactive"),this._updateStyle(t),this._layers[m(t)]=t},_addPath:function(t){this._rootGroup||this._initContainer(),this._rootGroup.appendChild(t._path),t.addInteractiveTarget(t._path)},_removePath:function(t){wt(t._path),t.removeInteractiveTarget(t._path),delete this._layers[m(t)]},_updatePath:function(t){t._project(),t._update()},_updateStyle:function(t){var e=t._path,n=t.options;e&&(n.stroke?(e.setAttribute("stroke",n.color),e.setAttribute("stroke-opacity",n.opacity),e.setAttribute("stroke-width",n.weight),e.setAttribute("stroke-linecap",n.lineCap),e.setAttribute("stroke-linejoin",n.lineJoin),n.dashArray?e.setAttribute("stroke-dasharray",n.dashArray):e.removeAttribute("stroke-dasharray"),n.dashOffset?e.setAttribute("stroke-dashoffset",n.dashOffset):e.removeAttribute("stroke-dashoffset")):e.setAttribute("stroke","none"),n.fill?(e.setAttribute("fill",n.fillColor||n.color),e.setAttribute("fill-opacity",n.fillOpacity),e.setAttribute("fill-rule",n.fillRule||"evenodd")):e.setAttribute("fill","none"))},_updatePoly:function(t,e){this._setPath(t,Na(t._parts,e))},_updateCircle:function(t){var e=t._point,n=Math.max(Math.round(t._radius),1),s=Math.max(Math.round(t._radiusY),1)||n,c="a"+n+","+s+" 0 1,0 ",h=t._empty()?"M0 0":"M"+(e.x-n)+","+e.y+c+n*2+",0 "+c+-n*2+",0 ";this._setPath(t,h)},_setPath:function(t,e){t._path.setAttribute("d",e)},_bringToFront:function(t){De(t._path)},_bringToBack:function(t){Fe(t._path)}});D.vml&&_i.include(fl);function Ro(t){return D.svg||D.vml?new _i(t):null}ot.include({getRenderer:function(t){var e=t.options.renderer||this._getPaneRenderer(t.options.pane)||this.options.renderer||this._renderer;return e||(e=this._renderer=this._createRenderer()),this.hasLayer(e)||this.addLayer(e),e},_getPaneRenderer:function(t){if(t==="overlayPane"||t===void 0)return!1;var e=this._paneRenderers[t];return e===void 0&&(e=this._createRenderer({pane:t}),this._paneRenderers[t]=e),e},_createRenderer:function(t){return this.options.preferCanvas&&Bo(t)||Ro(t)}});var Oo=Ze.extend({initialize:function(t,e){Ze.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){return this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return t=ht(t),[t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}});function vl(t,e){return new Oo(t,e)}_i.create=Yi,_i.pointsToPath=Na,ge.geometryToLayer=Ui,ge.coordsToLatLng=Xn,ge.coordsToLatLngs=Zi,ge.latLngToCoords=Qn,ge.latLngsToCoords=Vi,ge.getFeature=Ve,ge.asFeature=Wi,ot.mergeOptions({boxZoom:!0});var Ho=re.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane,this._resetStateTimeout=0,t.on("unload",this._destroy,this)},addHooks:function(){Y(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){yt(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_destroy:function(){wt(this._pane),delete this._pane},_resetState:function(){this._resetStateTimeout=0,this._moved=!1},_clearDeferredResetState:function(){this._resetStateTimeout!==0&&(clearTimeout(this._resetStateTimeout),this._resetStateTimeout=0)},_onMouseDown:function(t){if(!t.shiftKey||t.which!==1&&t.button!==1)return!1;this._clearDeferredResetState(),this._resetState(),pi(),Bn(),this._startPoint=this._map.mouseEventToContainerPoint(t),Y(document,{contextmenu:$e,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseMove:function(t){this._moved||(this._moved=!0,this._box=lt("div","leaflet-zoom-box",this._container),tt(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(t);var e=new q(this._point,this._startPoint),n=e.getSize();St(this._box,e.min),this._box.style.width=n.x+"px",this._box.style.height=n.y+"px"},_finish:function(){this._moved&&(wt(this._box),Tt(this._container,"leaflet-crosshair")),hi(),Rn(),yt(document,{contextmenu:$e,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(t){if(!(t.which!==1&&t.button!==1)&&(this._finish(),!!this._moved)){this._clearDeferredResetState(),this._resetStateTimeout=setTimeout(u(this._resetState,this),0);var e=new vt(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(e).fire("boxzoomend",{boxZoomBounds:e})}},_onKeyDown:function(t){t.keyCode===27&&(this._finish(),this._clearDeferredResetState(),this._resetState())}});ot.addInitHook("addHandler","boxZoom",Ho),ot.mergeOptions({doubleClickZoom:!0});var No=re.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,n=e.getZoom(),s=e.options.zoomDelta,c=t.originalEvent.shiftKey?n-s:n+s;e.options.doubleClickZoom==="center"?e.setZoom(c):e.setZoomAround(t.containerPoint,c)}});ot.addInitHook("addHandler","doubleClickZoom",No),ot.mergeOptions({dragging:!0,inertia:!0,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1,maxBoundsViscosity:0});var jo=re.extend({addHooks:function(){if(!this._draggable){var t=this._map;this._draggable=new _e(t._mapPane,t._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),this._draggable.on("predrag",this._onPreDragLimit,this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDragWrap,this),t.on("zoomend",this._onZoomEnd,this),t.whenReady(this._onZoomEnd,this))}tt(this._map._container,"leaflet-grab leaflet-touch-drag"),this._draggable.enable(),this._positions=[],this._times=[]},removeHooks:function(){Tt(this._map._container,"leaflet-grab"),Tt(this._map._container,"leaflet-touch-drag"),this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},moving:function(){return this._draggable&&this._draggable._moving},_onDragStart:function(){var t=this._map;if(t._stop(),this._map.options.maxBounds&&this._map.options.maxBoundsViscosity){var e=ht(this._map.options.maxBounds);this._offsetLimit=st(this._map.latLngToContainerPoint(e.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(e.getSouthEast()).multiplyBy(-1).add(this._map.getSize())),this._viscosity=Math.min(1,Math.max(0,this._map.options.maxBoundsViscosity))}else this._offsetLimit=null;t.fire("movestart").fire("dragstart"),t.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(t){if(this._map.options.inertia){var e=this._lastTime=+new Date,n=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(n),this._times.push(e),this._prunePositions(e)}this._map.fire("move",t).fire("drag",t)},_prunePositions:function(t){for(;this._positions.length>1&&t-this._times[0]>50;)this._positions.shift(),this._times.shift()},_onZoomEnd:function(){var t=this._map.getSize().divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_viscousLimit:function(t,e){return t-(t-e)*this._viscosity},_onPreDragLimit:function(){if(!(!this._viscosity||!this._offsetLimit)){var t=this._draggable._newPos.subtract(this._draggable._startPos),e=this._offsetLimit;t.x<e.min.x&&(t.x=this._viscousLimit(t.x,e.min.x)),t.y<e.min.y&&(t.y=this._viscousLimit(t.y,e.min.y)),t.x>e.max.x&&(t.x=this._viscousLimit(t.x,e.max.x)),t.y>e.max.y&&(t.y=this._viscousLimit(t.y,e.max.y)),this._draggable._newPos=this._draggable._startPos.add(t)}},_onPreDragWrap:function(){var t=this._worldWidth,e=Math.round(t/2),n=this._initialWorldOffset,s=this._draggable._newPos.x,c=(s-e+n)%t+e-n,h=(s+e+n)%t-e-n,g=Math.abs(c+n)<Math.abs(h+n)?c:h;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=g},_onDragEnd:function(t){var e=this._map,n=e.options,s=!n.inertia||t.noInertia||this._times.length<2;if(e.fire("dragend",t),s)e.fire("moveend");else{this._prunePositions(+new Date);var c=this._lastPos.subtract(this._positions[0]),h=(this._lastTime-this._times[0])/1e3,g=n.easeLinearity,x=c.multiplyBy(g/h),k=x.distanceTo([0,0]),T=Math.min(n.inertiaMaxSpeed,k),A=x.multiplyBy(T/k),U=T/(n.inertiaDeceleration*g),it=A.multiplyBy(-U/2).round();!it.x&&!it.y?e.fire("moveend"):(it=e._limitOffset(it,e.options.maxBounds),Z(function(){e.panBy(it,{duration:U,easeLinearity:g,noMoveStart:!0,animate:!0})}))}}});ot.addInitHook("addHandler","dragging",jo),ot.mergeOptions({keyboard:!0,keyboardPanDelta:80});var Do=re.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(t){this._map=t,this._setPanDelta(t.options.keyboardPanDelta),this._setZoomDelta(t.options.zoomDelta)},addHooks:function(){var t=this._map._container;t.tabIndex<=0&&(t.tabIndex="0"),Y(t,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),yt(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){if(!this._focused){var t=document.body,e=document.documentElement,n=t.scrollTop||e.scrollTop,s=t.scrollLeft||e.scrollLeft;this._map._container.focus(),window.scrollTo(s,n)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanDelta:function(t){var e=this._panKeys={},n=this.keyCodes,s,c;for(s=0,c=n.left.length;s<c;s++)e[n.left[s]]=[-1*t,0];for(s=0,c=n.right.length;s<c;s++)e[n.right[s]]=[t,0];for(s=0,c=n.down.length;s<c;s++)e[n.down[s]]=[0,t];for(s=0,c=n.up.length;s<c;s++)e[n.up[s]]=[0,-1*t]},_setZoomDelta:function(t){var e=this._zoomKeys={},n=this.keyCodes,s,c;for(s=0,c=n.zoomIn.length;s<c;s++)e[n.zoomIn[s]]=t;for(s=0,c=n.zoomOut.length;s<c;s++)e[n.zoomOut[s]]=-t},_addHooks:function(){Y(document,"keydown",this._onKeyDown,this)},_removeHooks:function(){yt(document,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){if(!(t.altKey||t.ctrlKey||t.metaKey)){var e=t.keyCode,n=this._map,s;if(e in this._panKeys){if(!n._panAnim||!n._panAnim._inProgress)if(s=this._panKeys[e],t.shiftKey&&(s=j(s).multiplyBy(3)),n.options.maxBounds&&(s=n._limitOffset(j(s),n.options.maxBounds)),n.options.worldCopyJump){var c=n.wrapLatLng(n.unproject(n.project(n.getCenter()).add(s)));n.panTo(c)}else n.panBy(s)}else if(e in this._zoomKeys)n.setZoom(n.getZoom()+(t.shiftKey?3:1)*this._zoomKeys[e]);else if(e===27&&n._popup&&n._popup.options.closeOnEscapeKey)n.closePopup();else return;$e(t)}}});ot.addInitHook("addHandler","keyboard",Do),ot.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40,wheelPxPerZoomLevel:60});var Fo=re.extend({addHooks:function(){Y(this._map._container,"wheel",this._onWheelScroll,this),this._delta=0},removeHooks:function(){yt(this._map._container,"wheel",this._onWheelScroll,this)},_onWheelScroll:function(t){var e=po(t),n=this._map.options.wheelDebounceTime;this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date);var s=Math.max(n-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(u(this._performZoom,this),s),$e(t)},_performZoom:function(){var t=this._map,e=t.getZoom(),n=this._map.options.zoomSnap||0;t._stop();var s=this._delta/(this._map.options.wheelPxPerZoomLevel*4),c=4*Math.log(2/(1+Math.exp(-Math.abs(s))))/Math.LN2,h=n?Math.ceil(c/n)*n:c,g=t._limitZoom(e+(this._delta>0?h:-h))-e;this._delta=0,this._startTime=null,g&&(t.options.scrollWheelZoom==="center"?t.setZoom(e+g):t.setZoomAround(this._lastMousePos,e+g))}});ot.addInitHook("addHandler","scrollWheelZoom",Fo);var gl=600;ot.mergeOptions({tapHold:D.touchNative&&D.safari&&D.mobile,tapTolerance:15});var qo=re.extend({addHooks:function(){Y(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){yt(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){if(clearTimeout(this._holdTimeout),t.touches.length===1){var e=t.touches[0];this._startPos=this._newPos=new H(e.clientX,e.clientY),this._holdTimeout=setTimeout(u(function(){this._cancel(),this._isTapValid()&&(Y(document,"touchend",At),Y(document,"touchend touchcancel",this._cancelClickPrevent),this._simulateEvent("contextmenu",e))},this),gl),Y(document,"touchend touchcancel contextmenu",this._cancel,this),Y(document,"touchmove",this._onMove,this)}},_cancelClickPrevent:function t(){yt(document,"touchend",At),yt(document,"touchend touchcancel",t)},_cancel:function(){clearTimeout(this._holdTimeout),yt(document,"touchend touchcancel contextmenu",this._cancel,this),yt(document,"touchmove",this._onMove,this)},_onMove:function(t){var e=t.touches[0];this._newPos=new H(e.clientX,e.clientY)},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_simulateEvent:function(t,e){var n=new MouseEvent(t,{bubbles:!0,cancelable:!0,view:window,screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,clientY:e.clientY});n._simulated=!0,e.target.dispatchEvent(n)}});ot.addInitHook("addHandler","tapHold",qo),ot.mergeOptions({touchZoom:D.touch,bounceAtZoomLimits:!0});var Uo=re.extend({addHooks:function(){tt(this._map._container,"leaflet-touch-zoom"),Y(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){Tt(this._map._container,"leaflet-touch-zoom"),yt(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var e=this._map;if(!(!t.touches||t.touches.length!==2||e._animatingZoom||this._zooming)){var n=e.mouseEventToContainerPoint(t.touches[0]),s=e.mouseEventToContainerPoint(t.touches[1]);this._centerPoint=e.getSize()._divideBy(2),this._startLatLng=e.containerPointToLatLng(this._centerPoint),e.options.touchZoom!=="center"&&(this._pinchStartLatLng=e.containerPointToLatLng(n.add(s)._divideBy(2))),this._startDist=n.distanceTo(s),this._startZoom=e.getZoom(),this._moved=!1,this._zooming=!0,e._stop(),Y(document,"touchmove",this._onTouchMove,this),Y(document,"touchend touchcancel",this._onTouchEnd,this),At(t)}},_onTouchMove:function(t){if(!(!t.touches||t.touches.length!==2||!this._zooming)){var e=this._map,n=e.mouseEventToContainerPoint(t.touches[0]),s=e.mouseEventToContainerPoint(t.touches[1]),c=n.distanceTo(s)/this._startDist;if(this._zoom=e.getScaleZoom(c,this._startZoom),!e.options.bounceAtZoomLimits&&(this._zoom<e.getMinZoom()&&c<1||this._zoom>e.getMaxZoom()&&c>1)&&(this._zoom=e._limitZoom(this._zoom)),e.options.touchZoom==="center"){if(this._center=this._startLatLng,c===1)return}else{var h=n._add(s)._divideBy(2)._subtract(this._centerPoint);if(c===1&&h.x===0&&h.y===0)return;this._center=e.unproject(e.project(this._pinchStartLatLng,this._zoom).subtract(h),this._zoom)}this._moved||(e._moveStart(!0,!1),this._moved=!0),at(this._animRequest);var g=u(e._move,e,this._center,this._zoom,{pinch:!0,round:!1},void 0);this._animRequest=Z(g,this,!0),At(t)}},_onTouchEnd:function(){if(!this._moved||!this._zooming){this._zooming=!1;return}this._zooming=!1,at(this._animRequest),yt(document,"touchmove",this._onTouchMove,this),yt(document,"touchend touchcancel",this._onTouchEnd,this),this._map.options.zoomAnimation?this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),!0,this._map.options.zoomSnap):this._map._resetView(this._center,this._map._limitZoom(this._zoom))}});ot.addInitHook("addHandler","touchZoom",Uo),ot.BoxZoom=Ho,ot.DoubleClickZoom=No,ot.Drag=jo,ot.Keyboard=Do,ot.ScrollWheelZoom=Fo,ot.TapHold=qo,ot.TouchZoom=Uo,o.Bounds=q,o.Browser=D,o.CRS=me,o.Canvas=Ao,o.Circle=Yn,o.CircleMarker=qi,o.Class=G,o.Control=ee,o.DivIcon=$o,o.DivOverlay=le,o.DomEvent=Br,o.DomUtil=Pr,o.Draggable=_e,o.Evented=rt,o.FeatureGroup=fe,o.GeoJSON=ge,o.GridLayer=bi,o.Handler=re,o.Icon=Ue,o.ImageOverlay=Gi,o.LatLng=dt,o.LatLngBounds=vt,o.Layer=ie,o.LayerGroup=qe,o.LineUtil=Gr,o.Map=ot,o.Marker=Fi,o.Mixin=Fr,o.Path=we,o.Point=H,o.PolyUtil=qr,o.Polygon=Ze,o.Polyline=ve,o.Popup=Ki,o.PosAnimation=ho,o.Projection=Kr,o.Rectangle=Oo,o.Renderer=ye,o.SVG=_i,o.SVGOverlay=Mo,o.TileLayer=We,o.Tooltip=Ji,o.Transformation=kn,o.Util=Lt,o.VideoOverlay=So,o.bind=u,o.bounds=st,o.canvas=Bo,o.circle=nl,o.circleMarker=il,o.control=vi,o.divIcon=pl,o.extend=l,o.featureGroup=Qr,o.geoJSON=To,o.geoJson=sl,o.gridLayer=hl,o.icon=tl,o.imageOverlay=rl,o.latLng=nt,o.latLngBounds=ht,o.layerGroup=Xr,o.map=Rr,o.marker=el,o.point=j,o.polygon=ol,o.polyline=al,o.popup=dl,o.rectangle=vl,o.setOptions=w,o.stamp=m,o.svg=Ro,o.svgOverlay=cl,o.tileLayer=Io,o.tooltip=ul,o.transformation=li,o.version=r,o.videoOverlay=ll;var yl=window.L;o.noConflict=function(){return window.L=yl,this},window.L=o})})(xa,xa.exports);var sd=xa.exports;const $t=od(sd),Ia="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcYBeBeoQIhRAkLlRDGrhIgY3BJL8CVeKzuyXFzzjkn5ZxzzuScg3PO8cKzu70JkO0LfxdTU//pM9vTu7Xgf6KqOVTb9X7toRrVEfBf1HTVjZccrT/2by1VV928Yty9ZbVuucdz90frG8DBjl9pVApbOstvmMuvVgaNXSfAAd6pGxpy6yxf5ph43pS/4f3uoaGm2rdu72S9xzOvMymkZFq/ptDrk90mhW7e4zl7HLzhxGWPR20xmSxJ/VqldG5m9XhaVOA1DadsNh3Pu5L2N6QtPO/32JpqQBVVk20oy/Pi2s23WEvyfHbe1thadVQttvm7Llf65gGmXK67XtupyoM7HQhmXdLS8oGWJNeOJ3C5fG5XCEJnkez3/oFdsvgJ4l2ANZwhrJKk/7OSXa+3Vw2WJMlKnGkobouYk6T0TyX30klOUnTD9HJ5qpckL3EW/w4XF3Xd0FGywXUrstrclVsqz5Pd/sXFYyDnPdrLcQODmGOK47IZb4CmibmMn+MYRzFZ5jg33ZL/EJrWcszHmANy3ARBK/IXtciJy8VsitPSdE3uuHxzougojcUdr8/32atnz/ev3f/K5wtpxUTpcaI45zusVDpYtZi+jg0oU9b3x74h7+n9ABvYEZeKaVq0sh0AtLKsFtqNBdeT0MrSzwwlq9+x6xAO4tgOtSzbCjrNQQiNvQUbUEubvzBUeGw26yDCsRHCoLkTHDa7IdOLIThs/gHvChszh2CimE8peRs47cxANI0lYNB5y1DljpOF0IhzBDPOZnDOqYYbeGKECbPzWnXludPphw5c2YBq5zlwXphIbO4VDCZ0gnPfUO1TwZoYwAs2ExPCedAu9DAjfQUjzITQb3jNj0KG2Sgt6BHaQUdYzWz+XmBktOHwanXjaSTcwwziBcuMOtwBmqPrTOxFQR/DRKKPqyur0aiW6cULYsx6tBm0jXpR/AUWR6HRq9WVW6MRhIq5jLyjbaCTDCijyYJNpCajdyobP/eTw0iexBAKkJ3gA5KcQb2zBXsIBckn+xVv8jkZSaEFHE+jFEleAEfayRU0MouNoBmB/L50Ai/HSLIHxcrpCvnhSQAuakKp2C/YbCylJjXRVy/z3+Kv/RrNcCo+WUzlVEhzKffnTQnxeN9fWF88fiNCUdSTsaufaChKWInHeysygfpIqagoakW+vV20J8uyl6TyNKEZWV4oRSPyCkWpgOLSbkCObT8o2r6tlG58HQquf6O0v50tB7JM7F4EORd2dx/K0w/KHsVkLPaoYrwgP/y7krr3SSMA4zj+OBgmjYkxcdIJQyQRKgg2viX9Hddi9UBb29LrKR7CVVEEEXWojUkXNyfTNDE14W9gbHJNuhjDettN3ZvbOvdOqCD3Jp/9l+/wJE+9PkYGjx/fqkys3S2rMozM/o2106rfMUINo6hVqz+eu/hd1c4xTg0TAfy5kV+4UG6+IthHTU9woWmxuKNbTfuCSfovBCxq7EtHqvYL4Sm6F8GVxsSXHMQ07TOi1DKtZxjWaaIyi4CXWjxPccUw8WVbMYY5wxC1mzEyXMJWkllpRloi+Kkoq69sxBTlElF6aAxYUbjXNlhlDZilDnM4U5SlN5biRsRHnbx3mbeWjEh4mEyiuJDl5XcWVmX5GvNkFgLWZM5qwsop4/AWfLhU1cR7k1VVvcYCWRkOI6Xy5gmnphCYIkvzuNYzHzosq2oNk2RtSs8khfUOfHIDgR6ysYBaMpl4uEgk2U/oJTs9AaTSwma7dT69geAE2ZpEjUsn2ieJNHeKfrI3EcAGJ2ZaNgVuC8EBctCLc57P5u5led6IOBkIYkuQMrmmjChs4VkfOerHqSBkPzZlhe06RslZ3zMjk2sscqKwY0RcjKK+LWbzd7KiHhkncs/siFJ+V5eXxD34B8nVuJEpGJNmxN2gH3vSvp7J70tF+D1Ej8qUJD1TkErAND2GZwTFg/LubvmgiBG3SOvdlsqFQrkEzJCL1rstlnVFROixZoDDSuXQFHESwVGlcuQcMb/b42NgjLowh5MTDFE3vNB5qStRIErdCQEh6pLPR92anSUb/wAIhldAaDMpGgAAAABJRU5ErkJggg==",Pa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",Aa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";delete $t.Icon.Default.prototype._getIconUrl;$t.Icon.Default.mergeOptions({iconRetinaUrl:Ia,iconUrl:Pa,shadowUrl:Aa});const rd="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",ld='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';function cd(i){if(!i||i.latitude==null||i.longitude==null)return"";const a=Number(i.latitude),o=Number(i.longitude);if(isNaN(a)||isNaN(o))return"";const r=i.maps_url||`https://www.google.com/maps/search/?api=1&query=${a},${o}`,l=`readonly-map-${i.entity_id||"preview"}-${Math.random().toString(36).substring(2,7)}`;return`
    <div class="card mb-6" style="border-top:3px solid var(--primary);">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" style="display:flex; align-items:center; gap:8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Location & Geo-Coordinates
        </div>
        <a href="${r}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          Open in Google Maps
        </a>
      </div>
      <div class="card-body" style="padding:16px;">
        <div id="${l}" data-lat="${a}" data-lng="${o}" class="entity-readonly-map-instance" style="height:220px; width:100%; border-radius:6px; border:1px solid var(--border); background:#f1f5f9; z-index:1;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:12px; color:var(--text-muted);">
          <span>Latitude: <strong>${a.toFixed(6)}</strong> • Longitude: <strong>${o.toFixed(6)}</strong></span>
          <span class="badge badge-success" style="font-size:11px;">Verified Coordinates</span>
        </div>
      </div>
    </div>
  `}function dd(){document.querySelectorAll(".entity-readonly-map-instance").forEach(a=>{if(a.dataset.initialized)return;const o=parseFloat(a.dataset.lat),r=parseFloat(a.dataset.lng);if(!(isNaN(o)||isNaN(r))){a.dataset.initialized="true";try{const l=$t.map(a,{center:[o,r],zoom:14,zoomControl:!0,attributionControl:!0,scrollWheelZoom:!1});$t.tileLayer(rd,{attribution:ld,maxZoom:19}).addTo(l),$t.marker([o,r]).addTo(l),setTimeout(()=>{l.invalidateSize()},200)}catch(l){console.warn("[ReadOnlyMap] Failed to initialize map container:",l)}}})}function et(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function Ba({id:i}){var l;const a=String(i||"").split("?")[0].split("#")[0];if(!a||a==="new"){X("/entities/new"+(window.location.search||""));return}if(!he(X))return;const o=qt(),r=document.getElementById("app");r.innerHTML=kt(`
    <div class="page-header mb-4" style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">My Requests</a> / Case #${a}</div>
        <h1 id="header-title">Loading Case...</h1>
      </div>
      <div id="header-extra-actions" style="display:flex; gap:10px;"></div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,`Case #${a}`),zt();try{const[d,u,p,m,f]=await Promise.all([gt.get(a),$s.list(a).catch(()=>({data:[]})),gt.audit(a).catch(()=>({data:{auditLogs:[],approvalHistory:[]}})),gt.getLineage(a).catch(()=>({data:{current:null,parent:null,children:[],rules:[]}})),gt.workflow(a).catch(()=>({data:{allowedTransitions:[]}}))]),v=d.data,y=u.data||[],_=p.data||{auditLogs:[],approvalHistory:[]},b=m.data||{current:null,parent:null,children:[],rules:[]},C=f.data||{allowedTransitions:[]};let w=[];try{w=(await yn.list({entity_type_id:v.entity_type_id})).data||[]}catch{w=[]}if(document.getElementById("header-title").textContent=v.name,["approved","coordinator_approved","verified","in_progress","resolved","closed"].includes(String(v.status||"").toLowerCase())&&((l=v.entityType)==null?void 0:l.name)!=="Civic Campaign"){const P=document.getElementById("header-extra-actions");P&&(P.innerHTML=`
          <a href="/meme/studio/${v.entity_id}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; border-color:#f59e0b; color:#d97706; background:#fffbeb;">
            <span>⚡</span> Create Civic Meme
          </a>
        `)}ud(document.getElementById("detail-content"),v,y,_,b,C,w,o)}catch(d){console.error("Failed to load case detail:",d),Q("Failed to load case details"),document.getElementById("detail-content").innerHTML=`<div class="alert alert-error">Failed to load case #${a}. It may not exist.</div>`}}function ud(i,a,o,r,l,d,u,p){var Lt,G;const m=pe(a.entityType),f=["draft","submitted","coordinator_approved","approved"],v=f.indexOf(a.status)!==-1?f.indexOf(a.status):-1,y=a.status==="rejected";let _='<div class="workflow-steps mt-4 mb-2">';f.forEach((R,K)=>{const rt=K<v||K===v&&!y&&a.status==="approved",H=K===v&&a.status!=="approved";_+=`
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${y&&K===v?"rejected":rt?"done":H?"current":""}">${K+1}</div>
          <div class="workflow-step-label mt-1">${md(R)}</div>
        </div>
        ${K<f.length-1?`<div class="workflow-step-connector ${rt?"done":""}"></div>`:""}
      </div>
    `}),y&&(_+=`
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `),_+="</div>";const b=pd(a,d.allowedTransitions||[],p),C=p&&["coordinator_area","coordinator_general","director","admin"].includes(p.role);let w="";C&&a.status!=="deleted"&&(w=`
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
    `);let M="";l.children&&l.children.length>0&&(M=`
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
                This case approval automatically triggered <strong>${l.children.length} related civic record(s)</strong> via configured metadata automation rules.
              </p>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${l.children.map(R=>`
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(R.entity_id).padStart(5,"0")} ${et(R.name)}</strong>
                      <span class="badge badge-secondary ml-2">${et(R.type_name)}</span>
                    </div>
                    <a href="/entities/${R.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);const O=o.map(R=>{var K,rt;return`
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${et(((K=R.parameterMaster)==null?void 0:K.label)||((rt=R.parameterMaster)==null?void 0:rt.field_key)||`Parameter #${R.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${et(R.value||"—")}</td>
    </tr>
  `}).join(""),P=o.length>0?`<div class="table-container"><table class="table"><tbody>${O}</tbody></table></div>`:'<div class="text-muted p-4">No custom parameter values submitted for this case.</div>',V=r.auditLogs||[];r.approvalHistory;const F=V.map(R=>`
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${et(R.user||"System")}</strong> (${et(R.role||"User")})</span>
        <span>${new Date(R.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${R.action==="status_transition"?`Status Transition: <strong>${Oe(R.old_status)}</strong> → <strong>${Oe(R.new_status)}</strong>`:`Action Executed: <strong>${R.action}</strong>`}
      </div>
      ${R.reason?`<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${et(R.reason)}"</div>`:""}
    </div>
  `).join(""),$=V.length>0?`<div>${F}</div>`:'<div class="text-muted p-4">No audit logs recorded yet for this case.</div>';let J="";u.length>0&&(J=`
      <div class="card mb-6" style="border-top:3px solid var(--green-600);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Civic Reports
          </div>
          <span class="badge badge-success">${u.length} Reports</span>
        </div>
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${u.map(R=>`
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${R.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${et(R.report_name)}"
              </button>
            `).join("")}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `);let N="";(l.parent||l.children&&l.children.length>0)&&(N=`
      <div class="card mb-6" style="border-top:3px solid var(--primary);">
        <div class="card-header">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Civic Lineage
          </div>
          <div class="card-subtitle">Connected parent and auto-created child civic activities</div>
        </div>
        <div class="card-body" style="padding:16px;">
          ${l.parent?`
            <div style="margin-bottom:12px; padding:12px; background:var(--primary-light); border:1px solid var(--primary-border); border-radius:6px; font-size:13px;">
              <div style="font-size:0.75rem; color:var(--primary); font-weight:700; text-transform:uppercase; margin-bottom:2px;">Parent Case</div>
              <a href="/entities/${l.parent.entity_id}" class="text-link font-medium">#PR-${String(l.parent.entity_id).padStart(5,"0")} ${et(l.parent.name)} (${et(((Lt=l.parent.entityType)==null?void 0:Lt.name)||"Capability")})</a>
            </div>
          `:""}
          ${l.children&&l.children.length>0?`
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${l.children.map(R=>`
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${R.entity_id}" class="text-link font-medium">#PR-${String(R.entity_id).padStart(5,"0")} ${et(R.name)}</a>
                    <span class="badge badge-secondary ml-2">${et(R.type_name)}</span>
                  </div>
                  <span class="badge badge-${R.status}">${Oe(R.status)}</span>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>
      </div>
    `),i.innerHTML=`
    <!-- Top Case Summary Card -->
    <div class="card mb-6">
      <div class="card-body" style="padding: 1.5rem;">
        <div class="flex justify-between items-start flex-wrap gap-4 mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-primary font-semibold">${et(m.title)}</span>
              <span class="badge badge-${a.status}">${Oe(a.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${et(a.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${et(((G=a.owner)==null?void 0:G.name)||"System")}</strong> • Jurisdiction Area: <strong>${et(a.area||"—")}</strong> • Location: <strong>${et(a.location||"—")}</strong>
            </div>
          </div>
        </div>
        ${_}
      </div>
    </div>

    ${M}
    ${w}
    ${cd(a)}
    ${J}
    ${N}

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
            ${P}
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
              ${b}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const E=document.getElementById("tab-info"),I=document.getElementById("tab-audit"),W=document.getElementById("tab-content");E&&I&&W&&(E.addEventListener("click",()=>{E.classList.add("active"),I.classList.remove("active"),W.innerHTML=P}),I.addEventListener("click",()=>{I.classList.add("active"),E.classList.remove("active"),W.innerHTML=$}));const Z=document.getElementById("btn-generate-ai");Z&&Z.addEventListener("click",()=>yd(a,o)),document.querySelectorAll(".execute-rep-btn").forEach(R=>{R.addEventListener("click",()=>{const K=R.getAttribute("data-repid");gd(K)})}),fd(a.entity_id),dd(),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}function pd(i,a,o){const r=[],l=String(i.status||"draft").trim().toLowerCase(),d=new Set;if(Array.isArray(a)&&a.length>0&&a.forEach(u=>{const p=u.action||u.to||u.to_status;if(!p||d.has(p))return;d.add(p);const m=p==="rejected",f=hd(l,p),v=m?"btn-danger":"btn-primary";r.push(`
        <button class="btn ${v} btn-full wf-action-btn mt-2" 
          data-to="${et(p)}" 
          data-label="${et(f)}"
          data-reason="${m?"true":"false"}">
          ${et(f)}
        </button>
      `)}),o&&o.role==="admin"&&r.push(`
      <button class="btn btn-secondary btn-full mt-3" id="btn-fire-rules" data-rule="true" style="display:inline-flex; align-items:center; gap:8px; justify-content:center;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Execute Automation Rules
      </button>
    `),r.length===0){if(o&&o.role==="coordinator_area"){const u=o.assignedArea||o.assigned_area,p=i.area;if(u&&p&&u.toLowerCase()!==p.toLowerCase())return`
          <div style="padding:14px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:13px; color:#9a3412; line-height:1.4;">
            <div style="font-weight:700; color:#c2410c; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Jurisdiction Boundary Constraint
            </div>
            Your coordinator account is assigned to <strong>"${et(u)}"</strong>, but this case belongs to <strong>"${et(p)}"</strong>.
            <div style="margin-top:8px; font-size:12px; color:#7c2d12;">
              Area Coordinators are strictly authorized to verify cases within their own jurisdiction. Only a Coordinator assigned to <strong>${et(p)}</strong> (or a General Coordinator) can verify this case.
            </div>
          </div>
        `}return`<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${et((o==null?void 0:o.role)||"user")}) at status "${et(Oe(l))}".</div>`}return r.join("")}function hd(i,a){const o=String(a||"").toLowerCase(),r=String(i||"").toLowerCase();return r==="draft"&&o==="submitted"?"Submit Request":r==="submitted"&&(o==="coordinator_approved"||o==="verified")?"Verify & Recommend Approval":r==="coordinator_approved"&&o==="approved"||r==="verified"&&o==="approved"?"Executive Approval (Director)":o==="rejected"?"Reject Request":`Transition to ${a}`}function md(i){return i==="draft"?"Draft":i==="submitted"?"Submitted":i==="coordinator_approved"?"Coord Approved":i==="verified"?"Verified":i==="approved"?"Approved":i==="rejected"?"Rejected":i}function fd(i){const a=r=>{const l=r.getAttribute("data-to"),d=r.getAttribute("data-label")||`Transition to ${l}`,u=r.getAttribute("data-reason")==="true";if(r.getAttribute("data-rule")==="true"){vd(i);return}u?(ba({title:"Provide Reason for Rejection",content:`
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",ni),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{const m=document.getElementById("action-reason").value.trim();if(!m){Q("Reason is required for rejection");return}ni(),cs(i,l,m)})):(ba({title:`Confirm Action: ${d}`,content:`
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${et(d)}</strong> for case #${i}?
          </p>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",ni),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{ni(),cs(i,l,null)}))};document.querySelectorAll(".wf-action-btn, #btn-fire-rules").forEach(r=>{r.addEventListener("click",()=>a(r))})}async function cs(i,a,o){try{const r=await gt.transition(i,a,o);xt(r.message||`Status updated to ${a}`),Ba({id:i})}catch(r){Q(r.message||"Transition failed")}}async function vd(i){var a,o;try{const r=await gt.fireRules(i,"approved");xt(`Rule Engine executed! ${((o=(a=r.data)==null?void 0:a.createdEntities)==null?void 0:o.length)||0} entity created.`),Ba({id:i})}catch(r){Q(r.message||"Rule trigger failed")}}async function gd(i){const a=document.getElementById("report-result-output");if(a){a.style.display="block",a.innerHTML='<div class="spinner spinner-sm"></div> Running report...';try{const r=(await yn.execute(i)).data;let l=(r.rows||[]).map(d=>{var u;return`
      <tr>
        <td>${et(d[r.groupBy]||d.area||"Total")}</td>
        <td style="font-weight:bold;">${d[(u=r.metric)==null?void 0:u.toLowerCase()]||d.count||d.total_count||0}</td>
      </tr>
    `}).join("");a.innerHTML=`
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${et(r.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${et(r.groupBy||"Group")}</th><th>${et(r.metric)}</th></tr></thead>
          <tbody>${l}</tbody>
        </table>
      </div>
    `}catch(o){a.innerHTML=`<div class="alert alert-error">Report execution failed: ${et(o.message)}</div>`}}}async function yd(i,a=[]){const o=i.entity_id,r=document.getElementById("ai-report-body");if(r){r.innerHTML=`
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:var(--primary); margin:0 auto 12px auto;"></div>
      <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Running Civic Intelligence Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Evaluating observations, patterns, recommendations, and evidence.</div>
    </div>
  `;try{const l=await gt.aiAnalysis(o);xt("Civic Intelligence Analysis generated successfully!"),r.innerHTML=ds(l.data)}catch(l){if(String(l.message||"").includes("GEMINI_API_KEY")||String(l.message||"").includes("Gemini API key")){xt("Generated Civic Decision Intelligence Preview from Case Parameters");const u=bd(i,a);r.innerHTML=ds(u)}else Q(l.message||"Could not generate AI report"),r.innerHTML=`<div class="alert alert-error">AI Analysis failed: ${et(l.message)}</div>`}}}function bd(i,a=[]){var p;const o={};if(Array.isArray(a))for(const m of a){const f=((p=m.parameterMaster)==null?void 0:p.field_key)||`param_${m.parameter_id}`;o[f]=m.value}const r=o.problem_need||o.description||i.name||"Civic improvement proposal",l=o.proposed_solution||"Community coordination and departmental municipal intervention",d=o.urgency||"Normal",u=i.area||"Ward / Area Jurisdiction";return{problem_summary:`The initiative "${i.name}" in ${u} highlights a local priority: "${r}". The citizen proposes "${l}".`,root_cause_analysis:[`Localized civic and infrastructure upkeep requirement in ${u}.`,"Gap between standard municipal routine maintenance and citizen-level expectations.","Absence of structured community-departmental participatory coordination."],stakeholder_analysis:[{group:`Residents & Citizens of ${u}`,interest:"Timely resolution, cleaner living environment, and reliable public amenities."},{group:"Area Coordinator & Field Inspectors",interest:"On-site verification of scope, resource estimation, and jurisdiction validation."},{group:"Competent Department (Works / Sanitation)",interest:"Feasibility check, alignment with ward budget, and task execution."}],risk_register:[{risk:`Delays in site inspection may exacerbate citizen grievances in ${u}`,severity:d==="Urgent"||d==="Critical"?"High":"Medium"},{risk:"Potential overlap with scheduled municipal ward maintenance works",severity:"Low"},{risk:"Incomplete initial citizen documentation requiring field verification",severity:"Low"}],recommendation:[`Area Coordinator should verify the physical site in ${u} and confirm exact requirements.`,"Coordinate with the relevant zonal engineering / sanitation unit to assess resource requirements.","If verified, transition case status to 'coordinator_approved' to forward for Executive Director sanction."],notice:"Live GEMINI_API_KEY is not configured in backend/.env. This structured decision analysis was synthesized by the CIVIC-KALKI Governance Intelligence Engine using case parameters."}}function ds(i){const a=Array.isArray(i.recommendation)?i.recommendation:Array.isArray(i.actionable_recommendations)?i.actionable_recommendations:[i.recommendation||i.actionable_recommendations||"Proceed with field verification."],o=Array.isArray(i.root_cause_analysis)?i.root_cause_analysis:[i.root_cause_analysis||"No root cause factors recorded."],r=Array.isArray(i.stakeholder_analysis)?i.stakeholder_analysis:[],l=Array.isArray(i.risk_register)?i.risk_register:[];return`
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      ${i.notice?`
        <div style="margin-bottom:12px; padding:10px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:12px; color:#1e40af; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Notice:</strong> ${et(i.notice)}</div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">1. Observations & Problem Scope</strong>
        <p style="margin:0; color:var(--text-secondary);">${et(i.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">2. Patterns & Root Cause Analysis</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${o.map(d=>`<li style="margin-bottom:4px;">${et(d)}</li>`).join("")}
        </ul>
      </div>

      ${r.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">3. Stakeholder Impact Analysis</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${r.map(d=>`
              <div style="font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                <strong style="color:var(--text-primary);">${et(d.group||"Stakeholder")}:</strong>
                <span style="color:var(--text-secondary); margin-left:4px;">${et(d.interest||"")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      ${l.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">4. Risk Register & Feasibility</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${l.map(d=>{const u=String(d.severity||"Medium").toLowerCase(),p=u==="high"?"background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;":u==="low"?"background:#dcfce7; color:#15803d; border:1px solid #86efac;":"background:#fef3c7; color:#b45309; border:1px solid #fcd34d;";return`
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                  <span style="color:var(--text-primary);">${et(d.risk||"")}</span>
                  <span style="padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px; ${p}">${et(d.severity||"Medium")}</span>
                </div>
              `}).join("")}
          </div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">5. Recommendations for Coordinator / Executive Action</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${a.map(d=>`<li style="margin-bottom:4px;">${et(d)}</li>`).join("")}
        </ul>
      </div>

      <div style="padding:10px 12px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700); display:flex; align-items:center; gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Civic Intelligence Protocol:</strong> This automated advisory report is generated to assist municipal coordinators and directors. Ground evidence and field verification must precede final sanction.</span>
      </div>
    </div>
  `}const Qe=[{type:"country",label:"Country"},{type:"state",label:"State / Province"},{type:"city",label:"City / District"},{type:"ward",label:"Ward / Local Area"}];function Ei(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function xd(i,a){if(!a)return Ei(i);const o=new RegExp(`(${a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return Ei(i).replace(o,'<strong style="color:var(--primary,#ff5a36);">$1</strong>')}class _d{constructor(a,o={}){this._container=a,this._required=o.required||!1,this._onChange=o.onChange||null,this._prefix=o.labelPrefix||"jsel",this._levelStates=[],this._hiddenInput=null,this._destroyed=!1,this._onDocumentClick=this._handleDocumentClick.bind(this),document.addEventListener("click",this._onDocumentClick)}async init(){this._render(),await this._loadLevel(0,null)}getValue(){const a=this._levelStates.map(r=>r.selectedItem).filter(Boolean);return a.length===0?null:{jurisdiction_id:a[a.length-1].jurisdiction_id,display_path:a.map(r=>r.name).join(" › ")}}async setValue(a){if(a)try{const o=await an.get(a),{path:r}=o.data;if(!Array.isArray(r)||r.length===0)return;for(let d=0;d<r.length;d++){const u=d===0?null:r[d-1].jurisdiction_id;await this._loadLevel(d,u);const p=r[d],m=this._levelStates[d].items.find(f=>f.jurisdiction_id===p.jurisdiction_id)||p;this._setSelection(d,m,!1)}this._syncHidden(),this._notifyChange();const l=r.length;if(l<Qe.length){const d=r[r.length-1].jurisdiction_id;await this._loadLevel(l,d)}}catch(o){console.warn("[JurisdictionSelector] setValue failed:",o)}}destroy(){this._destroyed=!0,document.removeEventListener("click",this._onDocumentClick),this._container.innerHTML="",this._levelStates=[],this._hiddenInput=null}_render(){this._container.innerHTML="",this._container.classList.add("jurisdiction-selector");const a=document.createElement("div");a.className="jurisdiction-selector-grid",Qe.forEach((r,l)=>{const d=document.createElement("div");d.className="form-group jsel-group",d.id=`${this._prefix}-group-${l}`;const u=this._required&&l===0?'<span class="required">*</span>':"",p=document.createElement("label");p.className="form-label",p.innerHTML=`${Ei(r.label)} ${u}`;const m=document.createElement("div");m.className="jsel-combobox",m.id=`${this._prefix}-combobox-${l}`;const f=document.createElement("div");f.className="jsel-trigger is-disabled",f.setAttribute("tabindex",l===0?"0":"-1"),f.setAttribute("role","combobox"),f.setAttribute("aria-expanded","false"),f.setAttribute("aria-label",r.label);const v=document.createElement("span");v.className="jsel-trigger-text is-placeholder",v.textContent=l===0?`-- Search or Select ${r.label} --`:`-- Select ${Qe[l-1].label} first --`;const y=document.createElement("div");y.className="jsel-trigger-actions";const _=document.createElement("button");_.type="button",_.className="jsel-clear-btn",_.title="Clear selection",_.style.display="none",_.innerHTML="&#x2715;";const b=document.createElement("span");b.className="jsel-chevron",b.innerHTML='<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',y.appendChild(_),y.appendChild(b),f.appendChild(v),f.appendChild(y);const C=document.createElement("div");C.className="jsel-dropdown";const w=document.createElement("div");w.className="jsel-search-wrapper",w.innerHTML=`
        <svg class="jsel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;const M=document.createElement("input");M.type="text",M.className="jsel-search-input",M.placeholder=`Search ${r.label}...`,M.setAttribute("autocomplete","off"),w.appendChild(M);const O=document.createElement("ul");O.className="jsel-options-list",O.setAttribute("role","listbox"),C.appendChild(w),C.appendChild(O),m.appendChild(f),m.appendChild(C),d.appendChild(p),d.appendChild(m),a.appendChild(d),this._levelStates[l]={meta:r,groupEl:d,comboboxEl:m,triggerEl:f,triggerTextEl:v,clearBtnEl:_,dropdownEl:C,searchInputEl:M,optionsListEl:O,items:[],filteredItems:[],selectedItem:null,focusedIdx:-1,isOpen:!1,disabled:l!==0},f.addEventListener("click",P=>{P.target.closest(".jsel-clear-btn")||this._toggleDropdown(l)}),f.addEventListener("keydown",P=>{this._levelStates[l].disabled||(P.key==="Enter"||P.key===" "||P.key==="ArrowDown")&&(P.preventDefault(),this._openDropdown(l))}),_.addEventListener("click",P=>{P.stopPropagation(),this._clearSelection(l)}),M.addEventListener("input",P=>{this._filterOptions(l,P.target.value)}),M.addEventListener("keydown",P=>{this._handleSearchKeydown(l,P)})}),this._container.appendChild(a);const o=document.createElement("input");o.type="hidden",o.name="_jurisdiction_id",o.id=`${this._prefix}-hidden`,o.value="",this._container.appendChild(o),this._hiddenInput=o}async _loadLevel(a,o){if(this._destroyed)return;const r=this._levelStates[a];if(r){r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.className="jsel-trigger-text is-placeholder",r.triggerTextEl.textContent=`Loading ${r.meta.label}…`,r.optionsListEl.innerHTML=`<li class="jsel-loading"><div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Loading ${r.meta.label}...</li>`;try{const l=o==null?{}:{parent_id:String(o)},u=(await an.list(l)).data||[];if(this._destroyed)return;if(r.items=u,r.filteredItems=u,u.length===0){r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.textContent=`-- No ${r.meta.label} available --`,this._clearLevelsFrom(a+1);return}r.disabled=!1,r.triggerEl.classList.remove("is-disabled"),r.triggerEl.setAttribute("tabindex","0"),r.triggerTextEl.textContent=`-- Search or Select ${r.meta.label} --`,this._renderOptionsList(a,"")}catch(l){console.warn("[JurisdictionSelector] Failed to load level",a,l),r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerTextEl.textContent=`-- Error loading ${r.meta.label} --`}}}_renderOptionsList(a,o){const r=this._levelStates[a],l=r.optionsListEl;l.innerHTML="",r.focusedIdx=-1;const d=(o||"").trim().toLowerCase();let u=r.items;if(d&&(u=r.items.filter(m=>m.name&&m.name.toLowerCase().includes(d)||m.code&&m.code.toLowerCase().includes(d))),r.filteredItems=u,u.length===0){l.innerHTML=`<li class="jsel-empty">No ${Ei(r.meta.label)} found matching "${Ei(o)}"</li>`;return}if(a===0&&!d){const m=r.items.find(f=>f.name==="India");if(m){const f=document.createElement("li");f.className="jsel-divider",f.textContent="★ Pinned / Quick Select",l.appendChild(f);const v=this._createOptionElement(a,m,d,0);l.appendChild(v);const y=document.createElement("li");y.className="jsel-divider",y.textContent=`All Countries (${r.items.length})`,l.appendChild(y)}}if(u.slice(0,150).forEach((m,f)=>{const v=this._createOptionElement(a,m,d,f);l.appendChild(v)}),u.length>150){const m=document.createElement("li");m.className="jsel-empty",m.style.fontSize="0.78rem",m.style.padding="8px",m.textContent=`Showing top 150 of ${u.length} matches — type to narrow down`,l.appendChild(m)}}_createOptionElement(a,o,r,l){const d=this._levelStates[a],u=d.selectedItem&&d.selectedItem.jurisdiction_id===o.jurisdiction_id,p=document.createElement("li");p.className=`jsel-option ${u?"is-selected":""}`,p.setAttribute("role","option"),p.setAttribute("aria-selected",u?"true":"false"),p.dataset.index=String(l);const m=document.createElement("span");if(m.innerHTML=xd(o.name,r),p.appendChild(m),o.code){const f=document.createElement("span");f.className="jsel-option-badge",f.textContent=o.code,p.appendChild(f)}return p.addEventListener("click",f=>{f.stopPropagation(),this._selectItem(a,o)}),p}_toggleDropdown(a){const o=this._levelStates[a];o.disabled||(o.isOpen?this._closeDropdown(a):this._openDropdown(a))}_openDropdown(a){this._levelStates.forEach((r,l)=>{l!==a&&r.isOpen&&this._closeDropdown(l)});const o=this._levelStates[a];o.disabled||(o.isOpen=!0,o.comboboxEl.classList.add("is-open"),o.triggerEl.classList.add("is-active"),o.triggerEl.setAttribute("aria-expanded","true"),o.searchInputEl.value="",this._renderOptionsList(a,""),setTimeout(()=>{o.searchInputEl.focus()},50))}_closeDropdown(a){const o=this._levelStates[a];o.isOpen&&(o.isOpen=!1,o.comboboxEl.classList.remove("is-open"),o.triggerEl.classList.remove("is-active"),o.triggerEl.setAttribute("aria-expanded","false"))}_filterOptions(a,o){this._renderOptionsList(a,o)}_handleSearchKeydown(a,o){const r=this._levelStates[a],l=r.optionsListEl.querySelectorAll(".jsel-option");l.length!==0&&(o.key==="ArrowDown"?(o.preventDefault(),r.focusedIdx=Math.min(r.focusedIdx+1,l.length-1),this._updateFocus(l,r.focusedIdx)):o.key==="ArrowUp"?(o.preventDefault(),r.focusedIdx=Math.max(r.focusedIdx-1,0),this._updateFocus(l,r.focusedIdx)):o.key==="Enter"?(o.preventDefault(),r.focusedIdx>=0&&r.focusedIdx<l.length?l[r.focusedIdx].click():l.length>0&&l[0].click()):o.key==="Escape"&&(this._closeDropdown(a),r.triggerEl.focus()))}_updateFocus(a,o){a.forEach((r,l)=>{l===o?(r.classList.add("is-focused"),r.scrollIntoView({block:"nearest"})):r.classList.remove("is-focused")})}_selectItem(a,o){this._setSelection(a,o,!0),this._closeDropdown(a);const r=a+1;r<Qe.length&&this._loadLevel(r,o.jurisdiction_id)}_setSelection(a,o,r=!0){const l=this._levelStates[a];l.selectedItem=o,l.triggerTextEl.className="jsel-trigger-text",l.triggerTextEl.textContent=o.name,l.clearBtnEl.style.display="flex",r&&(this._clearLevelsFrom(a+1),this._syncHidden(),this._notifyChange())}_clearSelection(a){const o=this._levelStates[a];o.selectedItem=null,o.triggerTextEl.className="jsel-trigger-text is-placeholder",o.triggerTextEl.textContent=`-- Search or Select ${o.meta.label} --`,o.clearBtnEl.style.display="none",this._clearLevelsFrom(a+1),this._syncHidden(),this._notifyChange()}_clearLevelsFrom(a){for(let o=a;o<Qe.length;o++){const r=this._levelStates[o];r&&(r.selectedItem=null,r.disabled=!0,r.items=[],r.filteredItems=[],r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.className="jsel-trigger-text is-placeholder",r.triggerTextEl.textContent=`-- Select ${Qe[o-1].label} first --`,r.clearBtnEl.style.display="none",r.optionsListEl.innerHTML="",this._closeDropdown(o))}}_handleDocumentClick(a){this._destroyed||this._levelStates.forEach((o,r)=>{o.isOpen&&!o.comboboxEl.contains(a.target)&&this._closeDropdown(r)})}_syncHidden(){if(!this._hiddenInput)return;const a=this.getValue();this._hiddenInput.value=a?String(a.jurisdiction_id):""}_notifyChange(){const a=this.getValue();this._onChange&&this._onChange(a),this._container.dispatchEvent(new CustomEvent("jurisdiction:change",{bubbles:!0,detail:a}))}}delete $t.Icon.Default.prototype._getIconUrl;$t.Icon.Default.mergeOptions({iconRetinaUrl:Ia,iconUrl:Pa,shadowUrl:Aa});const wd="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",kd='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',zd=[28.6139,77.209],Ld=13;function Cd(i,a={}){const o=typeof i=="string"?document.getElementById(i):i;if(!o)return console.error("[LocationPicker] Mount target not found:",i),null;let r={latitude:a.initialLat?Number(a.initialLat):null,longitude:a.initialLng?Number(a.initialLng):null,area:a.initialArea?String(a.initialArea).trim():"",address:""},l=null,d=null,u=0;const p="loc-picker-"+Math.random().toString(36).substring(2,9);o.innerHTML=`
    <div class="location-picker-box card" id="${p}" style="border:1px solid var(--border); background:var(--surface); padding:16px; border-radius:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <label style="font-weight:600; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Select Location & Coordinates
        </label>
        <button type="button" class="btn btn-secondary btn-sm" id="${p}-btn-geolocate" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Use My Current Location
        </button>
      </div>

      <!-- Search Box & Area Input -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:12px;" class="loc-input-grid">
        <div style="display:flex; gap:6px;">
          <input type="text" id="${p}-search-input" class="form-control" placeholder="Search landmark, address, street..." style="flex:1;">
          <button type="button" class="btn btn-primary" id="${p}-btn-search" style="padding:6px 14px; font-weight:600; flex-shrink:0;">
            Search
          </button>
        </div>
        <div>
          <input type="text" id="${p}-area-input" class="form-control" placeholder="Locality / Ward (optional)" value="${la(r.area)}">
        </div>
      </div>

      <!-- Feedback Banner -->
      <div id="${p}-feedback" style="display:none; padding:8px 12px; border-radius:6px; font-size:13px; margin-bottom:10px;"></div>

      <!-- Map Display -->
      <div id="${p}-map" style="height:280px; width:100%; border-radius:6px; border:1px solid var(--border); background:#f1f5f9; z-index:1;"></div>

      <!-- Selected Coordinates Display -->
      <div id="${p}-coords-bar" style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted); background:var(--gray-50); padding:8px 12px; border-radius:6px;">
        <span id="${p}-coords-text">
          ${r.latitude&&r.longitude?`Selected: <strong>${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}</strong>`:"Click on the map or drag the pin to set exact coordinates"}
        </span>
        <span style="font-size:11px; color:var(--text-secondary);">Drag marker to fine-tune</span>
      </div>
    </div>
  `;const m=document.getElementById(`${p}-map`),f=document.getElementById(`${p}-feedback`),v=document.getElementById(`${p}-search-input`),y=document.getElementById(`${p}-btn-search`),_=document.getElementById(`${p}-btn-geolocate`),b=document.getElementById(`${p}-area-input`),C=document.getElementById(`${p}-coords-text`);function w(E,I="error"){f&&(f.style.display="block",I==="error"?(f.style.background="#fef2f2",f.style.border="1px solid #fecaca",f.style.color="#dc2626"):I==="info"?(f.style.background="#eff6ff",f.style.border="1px solid #bfdbfe",f.style.color="#1d4ed8"):(f.style.background="#f0fdf4",f.style.border="1px solid #bbf7d0",f.style.color="#16a34a"),f.textContent=E)}function M(){f&&(f.style.display="none",f.textContent="")}function O(){C&&(r.latitude!=null&&r.longitude!=null?C.innerHTML=`Coordinates: <strong>${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}</strong> ${r.address?` • <span title="${la(r.address)}">${la(r.address)}</span>`:""}`:C.textContent="Click on the map or drag the pin to set exact coordinates")}function P(E,I,W="",Z=!0){r.latitude=Math.round(E*1e6)/1e6,r.longitude=Math.round(I*1e6)/1e6,W&&(r.address=W),O(),!d&&l?(d=$t.marker([r.latitude,r.longitude],{draggable:!0}).addTo(l),d.on("dragend",at=>{const Lt=at.target.getLatLng();P(Lt.lat,Lt.lng,"",!1)})):d&&d.setLatLng([r.latitude,r.longitude]),Z&&l&&l.setView([r.latitude,r.longitude],Math.max(l.getZoom(),14)),a.onChange&&a.onChange(J())}function V(){if(!m)return;const E=r.latitude&&r.longitude?[r.latitude,r.longitude]:zd,I=r.latitude&&r.longitude?14:Ld;l=$t.map(m,{center:E,zoom:I,zoomControl:!0,attributionControl:!0}),$t.tileLayer(wd,{attribution:kd,maxZoom:19}).addTo(l),r.latitude&&r.longitude&&(d=$t.marker([r.latitude,r.longitude],{draggable:!0}).addTo(l),d.on("dragend",W=>{const Z=W.target.getLatLng();P(Z.lat,Z.lng,"",!1)})),l.on("click",W=>{P(W.latlng.lat,W.latlng.lng,"",!1)}),setTimeout(()=>{l&&l.invalidateSize()},250)}async function F(){if(M(),!navigator.geolocation){w("Geolocation is not supported by your browser. Please search or pick manually on the map.","error");return}_.disabled=!0;const E=_.innerHTML;_.innerHTML='<span class="spinner" style="width:14px;height:14px;border-width:2px;margin-right:6px;"></span> Locating...',navigator.geolocation.getCurrentPosition(I=>{_.disabled=!1,_.innerHTML=E;const W=I.coords.latitude,Z=I.coords.longitude;P(W,Z,"Current Location",!0),w("Location retrieved successfully from GPS.","success"),setTimeout(M,3500)},I=>{_.disabled=!1,_.innerHTML=E;let W="Could not retrieve your location. Please use the search bar or click on the map.";I.code===1?W="Location permission was denied. Please use the search box or click on the map.":I.code===2?W="Location unavailable. Please search for your location.":I.code===3&&(W="Location request timed out. Please try searching for your area."),w(W,"error")},{timeout:1e4,enableHighAccuracy:!0,maximumAge:0})}async function $(){M();const E=String(v.value||"").trim();if(!E){w("Please enter an address, city, or landmark to search.","error");return}const I=Date.now();if(I-u<1e3){w("Please wait a second before searching again.","info");return}u=I,y.disabled=!0;const W=y.textContent;y.textContent="Searching...";try{const Z=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(E)}&limit=1`,at=await fetch(Z,{headers:{Accept:"application/json"}});if(!at.ok)throw new Error(`Geocoding failed with status ${at.status}`);const Lt=await at.json();if(!Array.isArray(Lt)||Lt.length===0){w(`No location found for "${E}". Try a broader address or landmark.`,"error");return}const G=Lt[0],R=parseFloat(G.lat),K=parseFloat(G.lon),rt=G.display_name||E;P(R,K,rt,!0),w(`Found: ${rt}`,"success"),setTimeout(M,4e3)}catch(Z){console.warn("[LocationPicker] Nominatim search error:",Z),w("Failed to lookup address. Please click directly on the map to set coordinates.","error")}finally{y.disabled=!1,y.textContent=W}}_&&_.addEventListener("click",F),y&&y.addEventListener("click",$),v&&v.addEventListener("keydown",E=>{E.key==="Enter"&&(E.preventDefault(),$())}),b&&b.addEventListener("input",E=>{r.area=E.target.value.trim(),a.onChange&&a.onChange(J())}),V();function J(){return{latitude:r.latitude,longitude:r.longitude,area:r.area?r.area:null,address:r.address||null}}function N(){l&&(l.remove(),l=null),o.innerHTML=""}return{getValue:J,setCoordinates:P,destroy:N}}function la(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const Ed="/api";function Ft(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let si=null,ne=null,ke=[],ii=null,He=null,Ti=new Map;const Td=new Set(["title","name","movement_title","area","jurisdiction","jurisdiction_id","location","landmark","reported_date","reported_on","contact_person","contact_phone","contact_email","priority_level","volunteer_coordinator"]);function Vs(i){const a=String(i.field_key||"").trim().toLowerCase();return Td.has(a)}async function Sd(i={},a=null){if(!he(X))return;try{ke=(await gt.listTypes().catch(()=>({data:[]}))).data||[]}catch{ke=[]}const o=a||new URLSearchParams(window.location.search);o.has("entity_type_id")?ne=Number(o.get("entity_type_id")):ke.length>0&&(ne=ke[0].entity_type_id);const r=ke.find(u=>Number(u.entity_type_id)===Number(ne));ii=pe(r);const l=document.getElementById("app");l.innerHTML=kt(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${Ft(ii.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${ke.map(u=>{const p=pe(u);return`<option value="${u.entity_type_id}" ${Number(ne)===Number(u.entity_type_id)?"selected":""}>${Ft(p.title)}</option>`}).join("")}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `,ii.title,ke),zt(),document.getElementById("entity-type-select").addEventListener("change",async u=>{const p=u.target.value;if(!p){document.getElementById("dynamic-form-container").innerHTML="",si=null;return}ne=Number(p);const m=ke.find(f=>Number(f.entity_type_id)===Number(ne));ii=pe(m),document.getElementById("page-capability-title").textContent=ii.title,window.history.replaceState({},"",`/entities/new?entity_type_id=${ne}`),await us(ne)}),ne&&await us(ne)}async function us(i){He&&(He.destroy(),He=null);const a=document.getElementById("dynamic-form-container");a.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{si=(await Ta.schema(i)).data,Id(a,si),await Md()}catch(o){console.error("Form schema load error:",o),Q("Failed to load form schema"),a.innerHTML='<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>'}}async function Md(){const i=document.getElementById("jurisdiction-selector-mount");i&&(He=new _d(i,{required:!0,labelPrefix:"ent-jsel"}),await He.init())}function $d(i){var C;const a=i.mandatory||i.is_mandatory,o=a?"required":"",r=a?'<span class="required">*</span>':"",l=`param_${i.parameter_id}`,d=(i.field_type||i.data_type||"text").toLowerCase(),u=Ft(i.label||i.field_key),p=(C=i.options)==null?void 0:C.depends_on;let m="",f="",v="";p&&p.field_key&&(m=`data-depends-key="${Ft(p.field_key)}" data-depends-val="${Ft(p.value)}"`,f="conditional-field",v="display:none;");const _=["textarea","file","location"].includes(d)?"flex:1 1 100%; min-width:100%;":"flex:1 1 calc(50% - 8px); min-width:200px;";let b="";switch(d){case"location":b=`
        <div id="location-picker-mount-${i.parameter_id}" class="location-picker-field-mount" data-parameter-id="${i.parameter_id}"></div>
      `;break;case"textarea":b=`<textarea name="${l}" class="form-control" rows="3" ${o} placeholder="Enter ${u.toLowerCase()}..."></textarea>`;break;case"number":b=`<input type="number" name="${l}" class="form-control" ${o} placeholder="0">`;break;case"date":b=`<input type="date" name="${l}" class="form-control" ${o}>`;break;case"email":b=`<input type="email" name="${l}" class="form-control" ${o} placeholder="email@example.com">`;break;case"phone":b=`<input type="tel" name="${l}" class="form-control" ${o} placeholder="+91 XXXXX XXXXX">`;break;case"checkbox":b=`
        <div class="check-group mt-2">
          <input type="checkbox" name="${l}" id="${l}" value="true">
          <label for="${l}">Yes</label>
        </div>
      `;break;case"select":{const w=i.meta_options||(i.options?Array.isArray(i.options)?i.options:i.options.choices:null)||["Option 1","Option 2"],M=i.options&&i.options.default?i.options.default:"";b=`<select name="${l}" class="form-control" ${o}>
        <option value="">-- Select --</option>
        ${w.map(O=>`<option value="${Ft(O)}" ${O===M?"selected":""}>${Ft(O)}</option>`).join("")}
      </select>`;break}case"file":b=`
        <div class="file-upload-wrapper" id="file-wrap-${i.parameter_id}">
          <input type="file" name="${l}" id="file-${i.parameter_id}" 
            class="form-control file-input" 
            data-parameter-id="${i.parameter_id}"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.zip"
            ${o}>
          <div class="file-upload-info mt-1" style="font-size:0.75rem; color:var(--text-muted);">
            Max 10MB • PDF, Word, Excel, Images, CSV, ZIP
          </div>
          <div id="file-status-${i.parameter_id}" class="file-upload-status mt-1" style="display:none;"></div>
        </div>
      `;break;default:b=`<input type="text" name="${l}" class="form-control" ${o} placeholder="Enter ${u.toLowerCase()}...">`;break}return`<div class="form-group ${f}" ${m} style="${v} ${_}">
    <label class="form-label">${u} ${r}</label>
    ${b}
  </div>`}function Id(i,a){if(!a||!a.sections||a.sections.length===0){i.innerHTML='<div class="alert alert-warning">This capability has no form fields configured yet.</div>';return}let o=`
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${Ft(ii.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(a.configuration_errors)&&a.configuration_errors.length>0?`<div class="alert alert-warning m-4">${Ft(a.configuration_errors.join(" "))}</div>`:""}

      <form id="dynamic-form" style="padding:24px;">
  `,r=!1,l=!1;a.sections.forEach((p,m)=>{const f=(p.section_name||p.title||"").trim(),v=m===0,y=f.toLowerCase().includes("where")||f.toLowerCase().includes("location");o+=`
      <div class="form-section mb-6" data-section-name="${Ft(f)}">
        <div class="form-section-title">${Ft(f)}</div>
        ${p.description?`<div class="form-section-subtitle">${Ft(p.description)}</div>`:""}
    `,v&&!r&&(o+=`
        <div class="form-row mt-4" style="display:flex; flex-wrap:wrap; gap:16px;">
          <div class="form-group" style="flex:1 1 100%; min-width:100%;">
            <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
            <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the initiative">
          </div>
        </div>
      `,r=!0),y&&!l&&(o+=`
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
      `,l=!0),(p.subsections||[]).forEach(_=>{_.subsection_name&&_.subsection_name!=="Main"&&(o+=`<div class="form-subsection mt-3"><div class="form-subsection-title">${Ft(_.subsection_name)}</div>`);const C=[..._.parameters||[]].sort((w,M)=>(w.display_order||0)-(M.display_order||0)).filter(w=>!Vs(w)&&String(w.field_key||"").trim()&&String(w.label||"").trim());C.length>0&&(o+='<div class="form-row mt-3" style="display:flex; flex-wrap:wrap; gap:16px;">',C.forEach(w=>{o+=$d(w)}),o+="</div>"),_.subsection_name&&_.subsection_name!=="Main"&&(o+="</div>")}),o+="</div>"}),l||(o+=`
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
    `),o+=`
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
  `,i.innerHTML=o,Ti.forEach(p=>p.destroy&&p.destroy()),Ti.clear(),i.querySelectorAll(".location-picker-field-mount").forEach(p=>{const m=p.getAttribute("data-parameter-id"),f=Cd(p);f&&Ti.set(String(m),f)});const u=document.getElementById("dynamic-form");u.addEventListener("submit",Ad),Pd(u,a)}function Pd(i,a){const o=[];(a.sections||[]).forEach(d=>{(d.subsections||[]).forEach(u=>{(u.parameters||[]).forEach(p=>o.push(p))})});const r=i.querySelectorAll(".conditional-field");if(r.length===0)return;function l(){r.forEach(d=>{const u=d.getAttribute("data-depends-key"),p=d.getAttribute("data-depends-val");if(!u)return;const m=o.find(_=>_.field_key===u);if(!m)return;const f=i.querySelector(`[name="param_${m.parameter_id}"]`);if(!f)return;String(f.value||"").trim().toLowerCase()===String(p).toLowerCase()?(d.style.display="",d.querySelectorAll("input, select, textarea").forEach(_=>{_.disabled=!1})):(d.style.display="none",d.querySelectorAll("input, select, textarea").forEach(_=>{_.disabled=!0,_.value=""}))})}i.addEventListener("change",l),i.addEventListener("input",l),l()}async function Ad(i){i.preventDefault();const a=document.getElementById("form-validation-alert");a&&(a.classList.add("hidden"),a.textContent="");const o=document.getElementById("submit-form-btn");o.disabled=!0,o.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';try{const r=new FormData(i.target),l=Object.fromEntries(r.entries());if(!l._base_name||!l._base_name.trim()){const _=document.getElementById("base_name");throw _&&_.focus(),new Error("Title / Summary is a required field.")}const d=He?He.getValue():null;if(!d)throw new Error("Please select a jurisdiction (at minimum a Country) before submitting.");if(si&&si.sections){for(const _ of si.sections)for(const b of _.subsections||[])for(const C of b.parameters||[])if(!Vs(C)&&(C.mandatory||C.is_mandatory)){const w=i.target.querySelector(`[name="param_${C.parameter_id}"]`);if(w&&!w.disabled&&!(w.type==="file"?w.files&&w.files.length>0:String(w.value||"").trim()))throw w.focus(),new Error(`"${C.label||C.field_key}" is a required field.`)}}let u=null;for(const[_,b]of Ti.entries()){const C=b.getValue();if(C&&C.latitude!=null&&C.longitude!=null){u=C;break}}const p={entity_type_id:ne,name:l._base_name.trim(),jurisdiction_id:d.jurisdiction_id,area:u&&u.area?u.area:d.display_path,location:l._base_location?l._base_location.trim():u&&u.address?u.address:null,status:"submitted",...u?{latitude:u.latitude,longitude:u.longitude}:{}},f=(await gt.create(p)).data.entity_id;u&&u.latitude!=null&&u.longitude!=null&&await gt.update(f,{latitude:u.latitude,longitude:u.longitude,...u.area?{area:u.area}:{}});const v=[];for(const[_,b]of r.entries())if(_.startsWith("param_")){const C=Number(_.replace("param_",""));if(Ti.has(String(C)))continue;const w=i.target.querySelector(`[name="${_}"]`);if(w&&(w.type==="file"||w.disabled))continue;b!=null&&String(b).trim()!==""&&v.push({parameter_id:C,value:String(b).trim()})}v.length>0&&await $s.create(f,v);const y=i.target.querySelectorAll('input[type="file"]');for(const _ of y)if(_.files&&_.files.length>0){const b=_.getAttribute("data-parameter-id");if(!b)continue;const C=new FormData;C.append("entity_id",f),C.append("parameter_id",b);for(const w of _.files)C.append("files",w);try{await fetch(`${Ed}/files/upload`,{method:"POST",headers:{"X-Requested-With":"ck-web"},credentials:"include",body:C})}catch(w){console.warn("File upload warning:",w)}}xt("Request submitted successfully!"),Bd(f,l._base_name)}catch(r){const l=r.message||"Failed to submit request";a&&(a.textContent=l,a.classList.remove("hidden")),Q(l),o.disabled=!1,o.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request'}}function Bd(i,a){const o=document.getElementById("dynamic-form-container"),r=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});o.innerHTML=`
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
            <div style="font-weight:700; color:var(--primary); font-family:var(--font-mono); margin-top:2px;">#PR-${String(i).padStart(5,"0")}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Status</div>
            <div style="margin-top:2px;"><span class="badge badge-submitted">Submitted</span></div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Title</div>
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${Ft(a)}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Submission Date</div>
            <div style="color:var(--text-secondary); margin-top:2px;">${r}</div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:12px; justify-content:center;">
        <a href="/entities/${i}" class="btn btn-primary btn-lg" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          View Request Details
        </a>
        <a href="/dashboard" class="btn btn-secondary btn-lg">Back to My Workspace</a>
      </div>
    </div>
  `}let dn=[],Ae=null,Ne="";async function Rd(){if(!Ea(["admin"],X))return;const i=document.getElementById("app");i.innerHTML=kt(`
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
        <input type="text" id="user-search-input" class="form-control" style="padding-left: 42px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search users by email (e.g. demo.coord.area@example.com), name, or assigned area..." value="${Wt(Ne)}">
        ${Ne?'<button id="clear-search-btn" class="btn btn-ghost btn-sm" style="position:absolute; right:10px; padding:4px 8px; font-size:12px;">Clear</button>':""}
      </div>
    </div>

    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Admin"),zt(),Od(),await un()}let ps=null;function Od(){const i=document.getElementById("user-search-input");if(!i)return;i.addEventListener("input",o=>{Ne=o.target.value.trim(),clearTimeout(ps),ps=setTimeout(()=>{un(Ne)},200)});const a=document.getElementById("clear-search-btn");a&&a.addEventListener("click",()=>{Ne="",i.value="",a.remove(),un("")})}async function un(i=Ne){const a=document.getElementById("admin-content");if(a)try{const o={limit:100};i&&(o.search=i),dn=(await Ms.listUsers(o)).data,Hd(a,dn)}catch{Q("Failed to load users"),a.innerHTML='<div class="alert alert-error">Failed to load users data.</div>'}}function Hd(i,a=dn){if(a.length===0){i.innerHTML=`
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Users & Regional Allocations (${a.length})</div>
        </div>
        <div class="table-empty py-6 text-center text-muted">
          No users found matching "${Wt(Ne)}".
        </div>
      </div>
    `;return}const o=a.map(r=>`
    <tr>
      <td>${r.user_id}</td>
      <td class="font-medium">${Wt(r.name)}</td>
      <td class="text-muted">${Wt(r.email)}</td>
      <td><span class="badge badge-role-${r.role}">${jd(r.role)}</span></td>
      <td>${r.assignedArea?`<span class="badge badge-primary font-semibold" style="font-size:12px;">${Wt(r.assignedArea)}</span>`:'<span class="text-muted">—</span>'}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="window.editUserRole(${r.user_id})">Change Role / Area</button></td>
    </tr>
  `).join("");i.innerHTML=`
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <div class="card-title">System Users & Regional Allocations (${a.length})</div>
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
            ${o}
          </tbody>
        </table>
      </div>
    </div>
  `}async function Nd(){if(Ae&&Ae.length>0)return Ae;try{const i=await an.tree();i.data&&Array.isArray(i.data)&&(Ae=Ws(i.data))}catch(i){console.warn("Failed to load jurisdiction tree for admin, falling back to flat list",i);try{Ae=((await an.list({parent_id:"all"})).data||[]).map(o=>({jurisdiction_id:o.jurisdiction_id,name:o.name,type:o.type,fullPath:o.name}))}catch{Ae=[]}}return Ae||[]}function Ws(i,a=""){let o=[];for(const r of i){const l=a?`${a} › ${r.name}`:r.name;o.push({jurisdiction_id:r.jurisdiction_id,name:r.name,type:r.type,fullPath:l}),r.children&&r.children.length>0&&(o=o.concat(Ws(r.children,l)))}return o}window.editUserRole=async i=>{const a=dn.find(b=>b.user_id===i);if(!a)return;const o=await Nd(),r=o.filter(b=>b.type==="ward"),l=o.filter(b=>b.type==="city"),d=o.filter(b=>b.type!=="ward"&&b.type!=="city");let u=!1,p="";r.length>0&&(p+='<optgroup label="Wards / Local Areas (Recommended)">',r.forEach(b=>{const C=a.assignedArea===b.name;C&&(u=!0),p+=`<option value="${Wt(b.name)}" ${C?"selected":""}>${Wt(b.fullPath)}</option>`}),p+="</optgroup>"),l.length>0&&(p+='<optgroup label="Cities / Districts">',l.forEach(b=>{const C=a.assignedArea===b.name;C&&(u=!0),p+=`<option value="${Wt(b.name)}" ${C?"selected":""}>${Wt(b.fullPath)}</option>`}),p+="</optgroup>"),d.length>0&&(p+='<optgroup label="States / Regions">',d.forEach(b=>{const C=a.assignedArea===b.name;C&&(u=!0),p+=`<option value="${Wt(b.name)}" ${C?"selected":""}>${Wt(b.fullPath)}</option>`}),p+="</optgroup>"),a.assignedArea&&!u&&a.assignedArea!=="Unassigned"&&(p=`<option value="${Wt(a.assignedArea)}" selected>${Wt(a.assignedArea)} (Currently Assigned)</option>`+p),ba({title:`User Role & Area Allocation: ${a.name}`,content:`
      <form id="role-form">
        <div class="form-group">
          <label class="form-label font-semibold">User Role</label>
          <select id="new-role" class="form-control">
            <option value="citizen" ${a.role==="citizen"?"selected":""}>Citizen</option>
            <option value="coordinator_area" ${a.role==="coordinator_area"?"selected":""}>Area Coordinator</option>
            <option value="coordinator_general" ${a.role==="coordinator_general"?"selected":""}>General Coordinator</option>
            <option value="director" ${a.role==="director"?"selected":""}>Director</option>
            <option value="admin" ${a.role==="admin"?"selected":""}>Admin</option>
          </select>
        </div>
        <div class="form-group" id="area-group" style="${a.role==="coordinator_area"?"":"display:none;"}">
          <label class="form-label font-semibold">Allocated Region / Ward <span class="required">*</span></label>
          <select id="new-area" class="form-control">
            <option value="">-- Select Allocated Area / Jurisdiction --</option>
            ${p}
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
    `,onClose:()=>{}});const m=document.getElementById("new-role"),f=document.getElementById("area-group"),v=document.getElementById("new-area"),y=document.getElementById("custom-area-wrapper"),_=document.getElementById("custom-area-input");m.addEventListener("change",b=>{const C=b.target.value==="coordinator_area";f.style.display=C?"block":"none"}),v.addEventListener("change",b=>{b.target.value==="__custom__"?(y.style.display="block",_.focus()):y.style.display="none"}),document.getElementById("save-role-btn").addEventListener("click",async()=>{const b=m.value;let C=v.value;if(b==="coordinator_area"&&(C==="__custom__"&&(C=_.value.trim()),!C)){Q("Please select or enter an allocated area for the coordinator");return}const w=document.getElementById("save-role-btn");w.disabled=!0,w.textContent="Saving...";try{await Ms.setRole(i,b,b==="coordinator_area"?C:null),xt(`Updated role & area allocation for ${a.name}`),ni(),un()}catch(M){Q(M.message||"Failed to update role"),w.disabled=!1,w.textContent="Save Allocation"}})};function jd(i){return i?i.split("_").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" "):"Unknown"}function Wt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Dd(){if(!he(X))return;const i=qt(),a=document.getElementById("app");a.innerHTML=kt(`
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
              ${i.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-primary);">${ca(i.name)}</h2>
              <p style="font-size:0.875rem; color:var(--text-muted);">${ca(i.email)}</p>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">User ID</label>
            <div class="font-mono text-muted" style="font-size:0.9rem;">#${i.user_id}</div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Assigned Role</label>
            <div><span class="badge badge-primary">${Li(i.role)}</span></div>
          </div>
          
          ${i.assignedArea?`
            <div class="form-group">
              <label class="form-label">Jurisdiction Area</label>
              <div style="font-weight:600; color:var(--text-primary);">${ca(i.assignedArea)}</div>
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
  `,"Profile"),zt();const o=document.getElementById("change-password-form");o&&o.addEventListener("submit",async r=>{r.preventDefault();const l=document.getElementById("password-alert");l.classList.add("hidden"),l.textContent="";const d=document.getElementById("current_password").value,u=document.getElementById("new_password").value,p=document.getElementById("confirm_password").value;if(u!==p){l.textContent="New password and confirmation do not match.",l.classList.remove("hidden");return}const m=document.getElementById("btn-change-pwd");m.disabled=!0,m.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Updating...';try{await gn.changePassword(d,u),xt("Password updated successfully!"),o.reset(),m.disabled=!1,m.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}catch(f){const v=f.message||"Failed to update password";l.textContent=v,l.classList.remove("hidden"),Q(v),m.disabled=!1,m.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}})}function ca(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function ut(i){return i?String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}let S={step:1,basics:{name:"",description:"",icon:"📋",domain_id:1},form:{name:"",sections:[{id:"sec_1",name:"General Information",parameters:[{id:"param_1",label:"Title",field_key:"title",field_type:"text",mandatory:!0,options:[]},{id:"param_2",label:"Area",field_key:"area",field_type:"select",mandatory:!0,options:["Sector 5","Sector 12","Pune North","Pune South","Pune Central"]}]}]},workflow:{transitions:[{from:"draft",to:"submitted",role:"citizen"},{from:"submitted",to:"coordinator_approved",role:"coordinator_area"},{from:"submitted",to:"rejected",role:"coordinator_area"},{from:"coordinator_approved",to:"approved",role:"director"},{from:"coordinator_approved",to:"rejected",role:"director"}]},rule:{enabled:!1,target_entity_type_id:"",event:"approved"},report:{enabled:!0,name:"",groupBy:"area",metric:"COUNT",metricField:"",publicStats:!0},existingTypes:[],domains:[],isSubmitting:!1};async function Fd(){var i;if(Ea(["admin","director"],X)){try{const[a,o]=await Promise.all([gt.listTypes().catch(()=>({data:[]})),Ta.getMetadata().catch(()=>({data:{domains:[]}}))]);S.existingTypes=a.data||[],S.domains=((i=o.data)==null?void 0:i.domains)||[]}catch(a){console.warn("Could not load metadata for module builder:",a)}Ot()}}function Ot(){const i=document.getElementById("app");let a="";S.step===1?a=qd():S.step===2?a=Ud():S.step===3?a=Vd():S.step===4?a=Wd():S.step===5?a=Gd():S.step===6?a=Kd():S.step===7&&(a=Jd());const o=[{num:1,label:"Basics"},{num:2,label:"Form & Fields"},{num:3,label:"Workflow"},{num:4,label:"Rules"},{num:5,label:"Reports"},{num:6,label:"Review"}],r=o.map((l,d)=>`
    <div style="display:flex; align-items:center; gap:0.4rem; color:${S.step>=l.num?"var(--primary)":"var(--gray-400)"}; font-weight:${S.step===l.num?"bold":"normal"}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${S.step>=l.num?"var(--primary)":"#e5e7eb"}; color:${S.step>=l.num?"#fff":"#4b5563"}; display:flex; align-items:center; justify-content:center; font-size:12px;">${l.num}</span>
      ${l.label}
    </div>
    ${d<o.length-1?`<div style="flex:1; height:2px; background:${S.step>l.num?"var(--primary)":"#e5e7eb"}; margin:0 4px;"></div>`:""}
  `).join("");i.innerHTML=kt(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>No-Code Module Builder</h1>
        <p>Design and deploy brand-new civic governance capabilities purely through metadata.</p>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="card mb-6" style="padding: 0.8rem 1.2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; overflow-x:auto;">
        ${r}
      </div>
    </div>

    ${a}
  `,"Module Builder"),zt(),Yd()}function qd(){const i=S.domains&&S.domains.length>0?S.domains.map(a=>`<option value="${a.domain_id}" ${S.basics.domain_id==a.domain_id?"selected":""}>${ut(a.domain_name)}</option>`).join(""):'<option value="1">Civic Operations</option>';return`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${ut(S.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${ut(S.basics.description)}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label class="form-label">Civic Domain</label>
              <select id="module-domain" class="form-control" onchange="state.basics.domain_id = Number(this.value)">
                ${i}
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Icon Identifier</label>
              <select id="module-icon" class="form-control">
                <option value="📋" ${S.basics.icon==="📋"?"selected":""}>📋 Form / Registration</option>
                <option value="📢" ${S.basics.icon==="📢"?"selected":""}>📢 Notice / Alert</option>
                <option value="🛡️" ${S.basics.icon==="🛡️"?"selected":""}>🛡️ Governance / Policy</option>
                <option value="💼" ${S.basics.icon==="💼"?"selected":""}>💼 Employment / Exchange</option>
                <option value="🤝" ${S.basics.icon==="🤝"?"selected":""}>🤝 Volunteer / Community</option>
                <option value="🌳" ${S.basics.icon==="🌳"?"selected":""}>🌳 Parks / Environment</option>
                <option value="🏗️" ${S.basics.icon==="🏗️"?"selected":""}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `}function Ud(){const i=S.basics.name?`${S.basics.name} Form`:"Module Registration Form",a=S.form.sections.map((o,r)=>{const l=o.parameters.map((d,u)=>{const p=d.field_type==="select";return`
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${u+1} (${ut(d.field_key||"field")})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${r}, ${u})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${ut(d.label)}" onchange="window.updateParam(${r}, ${u}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
            </div>
            <div class="form-group" style="flex:1.5;">
              <label class="form-label" style="font-size:12px;">Data Type</label>
              <select class="form-control" onchange="window.updateParam(${r}, ${u}, 'field_type', this.value)">
                <option value="text" ${d.field_type==="text"?"selected":""}>Text Input</option>
                <option value="textarea" ${d.field_type==="textarea"?"selected":""}>Long Text (Textarea)</option>
                <option value="number" ${d.field_type==="number"?"selected":""}>Number (Metric)</option>
                <option value="date" ${d.field_type==="date"?"selected":""}>Date</option>
                <option value="select" ${d.field_type==="select"?"selected":""}>Dropdown Select</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:flex-end; padding-bottom:8px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${d.mandatory?"checked":""} onchange="window.updateParam(${r}, ${u}, 'mandatory', this.checked)">
                Required?
              </label>
            </div>
          </div>

          ${p?`
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--gray-200);">
              <label class="form-label" style="font-size:12px;">Dropdown Choices (comma-separated)</label>
              <input type="text" class="form-control" value="${ut((d.options||[]).join(", "))}" onchange="window.updateParamOptions(${r}, ${u}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          `:""}
        </div>
      `}).join("");return`
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${ut(o.name)}" onchange="window.updateSectionName(${r}, this.value)">
          <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeSection(${r})">Delete Section</button>
        </div>
        <div class="card-body">
          ${l}
          <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.addParam(${r})">+ Add Field</button>
        </div>
      </div>
    `}).join("");return`
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
      <div>
        <div class="card mb-4">
          <div class="card-header">
            <div class="card-title">Step 2: Form & Field Configuration</div>
            <div class="card-subtitle">Define parameters and form sections for "${ut(S.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${ut(i)}" onchange="state.form.name = this.value">
            </div>
          </div>
        </div>

        ${a}

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
            ${Zd()}
          </div>
        </div>
      </div>
    </div>
  `}function Zd(){const i=S.basics.name?`${S.basics.name} Form`:"Untitled Form";let a=`<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${ut(i)}</div>`;return S.form.sections.forEach(o=>{a+=`
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${ut(o.name)}</div>
    `,o.parameters.forEach(r=>{const l=r.mandatory?'<span style="color:red">*</span>':"";if(a+=`<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${ut(r.label||"Unlabelled")} ${l}</label>`,r.field_type==="textarea")a+='<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>';else if(r.field_type==="number")a+='<input type="number" class="form-control" disabled placeholder="0">';else if(r.field_type==="date")a+='<input type="date" class="form-control" disabled>';else if(r.field_type==="select"){const d=r.options&&r.options.length?r.options:["Option 1","Option 2"];a+=`<select class="form-control" disabled>
          ${d.map(u=>`<option>${ut(u)}</option>`).join("")}
        </select>`}else a+='<input type="text" class="form-control" disabled placeholder="Text response...">';a+="</div>"}),a+="</div>"}),a}function Vd(){const i=[{value:"citizen",label:"Citizen (Owner)"},{value:"coordinator_area",label:"Area Coordinator"},{value:"coordinator_general",label:"General Coordinator"},{value:"director",label:"Director"},{value:"admin",label:"Administrator"}],a=S.workflow.transitions.map((o,r)=>`
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${r+1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${r})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${ut(o.from)}" onchange="window.updateTransition(${r}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${ut(o.to)}" onchange="window.updateTransition(${r}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
        </div>
        <div class="form-group" style="flex:1.2;">
          <label class="form-label" style="font-size:12px;">Allowed Role</label>
          <select class="form-control" onchange="window.updateTransition(${r}, 'role', this.value)">
            ${i.map(l=>`<option value="${l.value}" ${o.role===l.value?"selected":""}>${l.label}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
  `).join("");return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 3: Workflow & State Transitions</div>
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${ut(S.basics.name)}".</div>
      </div>
      <div class="card-body">
        <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
          Define which roles can transition entities of this module from one state to another. These will be generated into <code>WorkflowMaster</code>.
        </p>

        ${a}

        <button type="button" class="btn btn-secondary btn-sm mb-6" onclick="window.addTransition()">+ Add Transition</button>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=2; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep4()">Next: Rules →</button>
        </div>
      </div>
    </div>
  `}function Wd(){return S.existingTypes.map(i=>`<option value="${i.entity_type_id}" ${S.rule.target_entity_type_id==i.entity_type_id?"selected":""}>${ut(i.name)}</option>`).join(""),`
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
  `}function Gd(){const i=[];S.form.sections.forEach(l=>l.parameters.forEach(d=>i.push(d)));const a=S.basics.name?`${S.basics.name}s by Area`:"Module Report",o=i.filter(l=>l.field_type==="number"),r=['<option value="area">area (Native Area)</option>','<option value="status">status (Workflow Status)</option>',...i.map(l=>`<option value="${ut(l.field_key||l.label)}" ${S.report.groupBy===(l.field_key||l.label)?"selected":""}>${ut(l.label)} (${l.field_type})</option>`)].join("");return o.map(l=>`
    <option value="${ut(l.field_key||l.label)}" ${S.report.metricField===(l.field_key||l.label)?"selected":""}>${ut(l.label)}</option>
  `).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${ut(S.basics.name)}" via ReportMaster.</div>
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
              <input type="text" class="form-control" value="${ut(a)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label">Group By Field</label>
                <select class="form-control" onchange="state.report.groupBy = this.value">
                  ${r}
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
  `}function Kd(){const i=`${S.basics.name} Form`,a=S.form.sections.reduce((r,l)=>r+l.parameters.length,0),o=`${S.basics.name}s by Area`;return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${S.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${ut(S.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${ut(S.basics.description||"Civic Operating System Module")}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${ut(i)}</strong></div>
              <div>Sections: <strong>${S.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${a}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${S.workflow.transitions.length} transitions)
              </div>
              ${S.workflow.transitions.map(r=>`<div style="font-size:12px;">• <code>${ut(r.from)}</code> → <code>${ut(r.to)}</code> (${ut(r.role)})</div>`).join("")}
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
              <div>${`${ut(o)} (${S.report.metric} by ${S.report.groupBy})`}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${S.isSubmitting?"disabled":""}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `}function Jd(){return`
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${ut(S.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `}function Yd(){const i=document.getElementById("step1-form");i&&i.addEventListener("submit",a=>{a.preventDefault();const o=document.getElementById("module-name").value.trim(),r=document.getElementById("module-desc").value.trim(),l=document.getElementById("module-icon").value;if(!o){Q("Module name is required");return}if(S.existingTypes.some(u=>u.name.toLowerCase()===o.toLowerCase())){Q(`Module "${o}" already exists. Please choose a different name.`);return}S.basics.name=o,S.basics.description=r,S.basics.icon=l,S.step=2,Ot()})}window.addSection=()=>{const i=S.form.sections.length+1;S.form.sections.push({id:`sec_${Date.now()}`,name:`Section ${i}`,parameters:[{id:`param_${Date.now()}`,label:"New Field",field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}]}),Ot()};window.removeSection=i=>{if(S.form.sections.length<=1){Q("Form must have at least one section");return}S.form.sections.splice(i,1),Ot()};window.updateSectionName=(i,a)=>{S.form.sections[i].name=a,Ot()};window.addParam=i=>{const a=S.form.sections[i].parameters.length+1;S.form.sections[i].parameters.push({id:`param_${Date.now()}`,label:`Field ${a}`,field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}),Ot()};window.removeParam=(i,a)=>{S.form.sections[i].parameters.splice(a,1),Ot()};window.updateParam=(i,a,o,r)=>{const l=S.form.sections[i].parameters[a];l[o]=r,o==="label"&&(l.field_key=r.toLowerCase().replace(/[^a-z0-9]/g,"_")),Ot()};window.updateParamOptions=(i,a,o)=>{const r=o.split(",").map(l=>l.trim()).filter(Boolean);S.form.sections[i].parameters[a].options=r,Ot()};window.validateAndGoStep3=()=>{for(const i of S.form.sections){if(!i.name.trim()){Q("All sections must have a title");return}for(const a of i.parameters)if(!a.label.trim()){Q("All fields must have a label");return}}S.step=3,Ot()};window.addTransition=()=>{S.workflow.transitions.push({from:"draft",to:"submitted",role:"citizen"}),Ot()};window.removeTransition=i=>{if(S.workflow.transitions.length<=1){Q("Workflow must have at least one transition");return}S.workflow.transitions.splice(i,1),Ot()};window.updateTransition=(i,a,o)=>{S.workflow.transitions[i][a]=o,Ot()};window.validateAndGoStep4=()=>{for(let i=0;i<S.workflow.transitions.length;i++){const a=S.workflow.transitions[i];if(!a.from.trim()||!a.to.trim()){Q(`Transition #${i+1} must have both from and to states.`);return}}S.step=4,Ot()};window.submitModuleCreation=async()=>{const i=document.getElementById("create-module-btn");i&&(i.disabled=!0,i.textContent="Deploying Metadata Atomically..."),S.isSubmitting=!0;try{const a=S.form.name||`${S.basics.name} Form`,o=S.report.name||`${S.basics.name}s by Area`,r={module:{name:S.basics.name,description:S.basics.description,domain_id:S.basics.domain_id||1},form:{name:a,sections:S.form.sections.map(d=>({name:d.name,parameters:d.parameters.map(u=>({field_key:u.field_key,label:u.label,field_type:u.field_type,mandatory:!!u.mandatory,options:u.options}))}))},workflow:{transitions:S.workflow.transitions.map(d=>({from_status:d.from,to_status:d.to,role:d.role}))},rules:S.rule.enabled&&S.rule.target_entity_type_id?[{target_entity_type_id:Number(S.rule.target_entity_type_id),event:S.rule.event||"approved",auto_create:!0,auto_approve:!1}]:[],reports:S.report.enabled?[{report_name:o,output_format:"grouped_count",filters:{groupBy:S.report.groupBy||"area",metric:S.report.metric||"COUNT",metricField:S.report.metricField||void 0,public_stats:S.report.publicStats}}]:[]},l=await Fl.deploy(r);xt(l.message||`Module "${S.basics.name}" deployed successfully!`),S.isSubmitting=!1,S.step=7,Ot()}catch(a){Q(a.message||"Failed to deploy module"),S.isSubmitting=!1,i&&(i.disabled=!1,i.innerHTML='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata')}};function Gt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let en=[],hs=[];async function Xd(){if(!he(X))return;const i=document.getElementById("app");i.innerHTML=kt(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Reports"),zt();try{const[a,o]=await Promise.all([yn.list().catch(()=>({data:[]})),gt.listTypes().catch(()=>({data:[]}))]);en=a.data||[],hs=o.data||[],i.innerHTML=kt(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `,"Civic Reports",hs),zt(),Qd(document.getElementById("reports-container"))}catch{Q("Failed to load reports catalog"),document.getElementById("reports-container").innerHTML=`
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `}}function Qd(i){if(!en||en.length===0){i.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;return}const a=en.map(l=>{const d=pe(l.entityType);return`
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${Gt(d.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${Gt(l.metric_type||"COUNT")}</span>
          </div>
          <div class="report-card-title">${Gt(l.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${Gt(d.shortTitle)}</strong> records grouped by <strong>${Gt(l.group_by_field||"area / status")}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${Gt(l.group_by_field||"area")}</span>
            <span>•</span>
            <span>Metric: ${Gt(l.metric_type||"COUNT")}</span>
          </div>
          <button class="btn btn-primary btn-full execute-report-btn" data-repid="${l.report_id}" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Run Report
          </button>
        </div>
      </div>
    `}).join("");i.innerHTML=`
    <div class="reports-grid mb-8">
      ${a}
    </div>

    <!-- Execution Result Output Panel -->
    <div class="card" id="report-execution-panel" style="display:none;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" id="execution-title">Report Results</div>
        <button class="btn btn-ghost btn-sm" id="btn-close-result">Close Panel</button>
      </div>
      <div class="card-body p-6" id="execution-body"></div>
    </div>
  `,i.querySelectorAll(".execute-report-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.getAttribute("data-repid");tu(d)})});const r=document.getElementById("btn-close-result");r&&r.addEventListener("click",()=>{document.getElementById("report-execution-panel").style.display="none"})}async function tu(i){const a=document.getElementById("report-execution-panel"),o=document.getElementById("execution-title"),r=document.getElementById("execution-body");if(!(!a||!r)){a.style.display="block",a.scrollIntoView({behavior:"smooth"}),r.innerHTML='<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';try{const d=(await yn.execute(i)).data;o.textContent=`Report Results: ${d.reportName||"Execution"}`;const u=d.rows||[];if(u.length===0){r.innerHTML='<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>';return}const p=u.map(m=>{var f;return`
      <tr>
        <td style="font-weight:600;">${Gt(m[d.groupBy]||m.area||m.status||"Total")}</td>
        <td style="font-weight:700; color:var(--primary);">${m[(f=d.metric)==null?void 0:f.toLowerCase()]||m.count||m.total_count||0}</td>
      </tr>
    `}).join("");r.innerHTML=`
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${Gt(d.metric)}</strong> | Grouped By: <strong>${Gt(d.groupBy)}</strong> | Total Groups: <strong>${u.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${Gt(d.groupBy||"Group")}</th>
              <th>Aggregation Metric (${Gt(d.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${p}
          </tbody>
        </table>
      </div>
    `}catch(l){Q(l.message||"Report execution failed"),r.innerHTML=`<div class="alert alert-error">Execution Error: ${Gt(l.message)}</div>`}}}function Qi(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function eu(){if(!he(X))return;const i=document.getElementById("app");i.innerHTML=kt(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Capabilities"),zt();try{const o=(await gt.listTypes().catch(()=>({data:[]}))).data||[];i.innerHTML=kt(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `,"Civic Capabilities",o),zt(),iu(document.getElementById("modules-container"),o)}catch{Q("Failed to load civic capabilities"),document.getElementById("modules-container").innerHTML=`
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `}}function iu(i,a){if(!a||a.length===0){i.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;return}const o=a.map(r=>{var u;const l=pe(r),d=((u=r._count)==null?void 0:u.entities)||0;return`
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${Le(l.iconKey,24)}
            </div>
            <span class="badge badge-secondary" style="font-size:11px;">${d} Active Cases</span>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:4px;">
            ${Qi(l.category)}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            ${Qi(l.title)}
          </h3>

          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
            ${Qi(l.description)}
          </p>
        </div>

        <div style="display:flex; gap:10px; padding-top:16px; border-top:1px solid var(--border);">
          <a href="/entities?entity_type_id=${r.entity_type_id}" class="btn btn-secondary" style="flex:1; text-align:center; font-size:0.85rem;">
            Explore Cases
          </a>
          <a href="/entities/new?entity_type_id=${r.entity_type_id}" class="btn btn-translucent-orange" style="flex:1; text-align:center; font-size:0.85rem;">
            ${Qi(l.actionLabel)} →
          </a>
        </div>
      </div>
    `}).join("");i.innerHTML=`
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
      ${o}
    </div>
  `}function It(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let _a=null,Si=!1,pn=[];async function nu(){if(!Ea(["director","admin"],X))return;const i=document.getElementById("app");i.innerHTML=kt(`
    <div style="padding: 24px 0;">
      <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="spinner spinner-lg"></div>
        <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 500;">
          Initializing Governance Intelligence Engine...
        </div>
      </div>
    </div>
  `,"/governance"),zt();try{pn=(await gt.listTypes().catch(()=>({data:[]}))).data||[],await Gs()}catch(a){Q(a.message||"Failed to load governance intelligence"),au(a.message)}}async function Gs(){Si=!0,ms();try{const i=await ql.analyze();if(i&&i.success)_a=i.data,xt("Governance telemetry updated");else throw new Error((i==null?void 0:i.error)||"Analysis returned invalid response")}catch(i){Q(i.message||"Governance analysis failed")}finally{Si=!1,ms()}}function ms(){const i=document.getElementById("app");if(!i)return;if(!_a&&Si){i.innerHTML=kt(`
      <div style="padding: 32px 0;">
        <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="spinner spinner-lg"></div>
          <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 600;">
            Running Deterministic Rules & Telemetry Pipeline...
          </div>
        </div>
      </div>
    `,"/governance",pn),zt();return}const a=_a||{},o=a.summary_metrics||{},r=a.process_health||{pipeline:[]},l=a.exceptions||[],d=a.stakeholder_intelligence||[],u=a.ai_summary||null,p=a.analysis_mode==="AI_ASSISTED",m=`
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
            <span style="background: ${p?"rgba(147, 51, 234, 0.12)":"rgba(100, 116, 139, 0.12)"}; color: ${p?"#9333ea":"#475569"}; border: 1px solid ${p?"rgba(147, 51, 234, 0.3)":"rgba(100, 116, 139, 0.25)"}; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              ${p?`
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
            Target Module: <strong style="color: var(--text-primary);">${It(a.entity_type_name||"Donation Transaction")}</strong> • 
            Telemetry analyzed at ${a.analyzed_at?new Date(a.analyzed_at).toLocaleTimeString():"now"}
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <button id="btn-reanalyze" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600;" ${Si?"disabled":""}>
            ${Si?`
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
          <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 6px 0 2px 0;">${o.total_transactions??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Transactions tracked</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #16a34a;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Verified</div>
          <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin: 6px 0 2px 0;">${o.verified_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Confirmed verification</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #ea580c;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Pending Verification</div>
          <div style="font-size: 2rem; font-weight: 800; color: #ea580c; margin: 6px 0 2px 0;">${o.pending_verification_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Awaiting officer review</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #dc2626;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Failed Verification</div>
          <div style="font-size: 2rem; font-weight: 800; color: #dc2626; margin: 6px 0 2px 0;">${o.failed_verification_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Process failures flagged</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #ca8a04;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Unreconciled</div>
          <div style="font-size: 2rem; font-weight: 800; color: #ca8a04; margin: 6px 0 2px 0;">${o.unresolved_reconciliation_count??0}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Bank matching pending</div>
        </div>

        <div class="card" style="padding: 18px; border-top: 4px solid #9333ea;">
          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Exceptions Flagged</div>
          <div style="font-size: 2rem; font-weight: 800; color: #9333ea; margin: 6px 0 2px 0;">${l.length}</div>
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
          ${(r.pipeline||[]).map((v,y)=>{const _=v.exception_count>0;return`
              <div style="background: var(--gray-50); border: 1px solid ${_?"#fca5a5":"var(--gray-200)"}; border-radius: 8px; padding: 14px; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    STAGE ${y+1}
                  </span>
                  ${_?`
                    <span style="font-size: 11px; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                      ⚠️ ${v.exception_count} gap${v.exception_count>1?"s":""}
                    </span>
                  `:`
                    <span style="font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px;">
                      ✓ Healthy
                    </span>
                  `}
                </div>
                <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); text-transform: capitalize; margin-bottom: 4px;">
                  ${It(v.label||v.stage)}
                </div>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                  ${v.count} <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">in stage</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); border-top: 1px dashed var(--gray-200); padding-top: 6px; margin-top: 6px;">
                  ⏱ ${v.avg_days_in_stage!==null?`${v.avg_days_in_stage} days avg`:"Terminal stage"}
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- AI-ASSISTED EXECUTIVE SYNTHESIS (IF PRESENT) -->
      ${u?`
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
              AI: ${It(u.analysis_mode||"AI")}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 18px;">
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Pipeline Velocity Assessment
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${It(u.process_health_narrative||"Pipeline telemetry shows operational stages operating within standard thresholds.")}
              </p>
            </div>
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Control Gap Concentration
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${It(u.risk_narrative||"Exceptions detected require periodic verification per standard governance protocols.")}
              </p>
            </div>
          </div>

          ${Array.isArray(u.recommendations)&&u.recommendations.length>0?`
            <div style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 14px 18px;">
              <h3 style="font-size: 12px; font-weight: 700; color: #6b21a8; text-transform: uppercase; margin-bottom: 8px;">
                Recommended Corrective Governance Actions
              </h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #4b5563;">
                ${u.recommendations.map(v=>`<li>${It(v)}</li>`).join("")}
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
            ${l.length} Active Observations
          </span>
        </div>

        ${l.length===0?`
          <div style="text-align: center; padding: 32px; color: var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 8px;">✓</div>
            <strong>Zero Exceptions Detected</strong>
            <p style="font-size: 13px; margin-top: 4px;">All transactions strictly satisfy configured governance and state-sync rules.</p>
          </div>
        `:`
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${l.map(v=>`
              <div style="border: 1px solid var(--gray-200); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; background: #ffffff;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; font-weight: 700; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-family: monospace;">
                      ${It(v.trigger_rule)}
                    </span>
                    <strong style="font-size: 14px; color: var(--text-primary);">
                      ${It(v.observation)}
                    </strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 10px; font-weight: 700; background: var(--gray-100); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                      MODE: ${It(v.analysis_mode||"DETERMINISTIC")}
                    </span>
                    ${v.requires_human_review?`
                      <span style="font-size: 10px; font-weight: 700; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">
                        HUMAN REVIEW REQUIRED
                      </span>
                    `:""}
                  </div>
                </div>

                <div style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; font-family: monospace; font-size: 12px; color: #1e293b;">
                  <strong>Evidence:</strong> ${It(v.evidence)}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; font-size: 12.5px;">
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Possible Process Weakness:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${It(v.possible_cause)}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Governance Recommendation:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${It(v.recommendation)}</div>
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
          ${d.map(v=>`
            <div style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 18px; background: var(--gray-50); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <strong style="font-size: 15px; color: var(--text-primary);">
                    ${It(v.stakeholder)}
                  </strong>
                  <span style="font-size: 10px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    ${It(v.analysis_mode||"DETERMINISTIC")}
                  </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Core Responsibility</div>
                  <div style="font-size: 13px; color: var(--text-primary); margin-top: 2px;">${It(v.interest)}</div>
                </div>

                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Governance Concern</div>
                  <div style="font-size: 13px; color: #7f1d1d; margin-top: 2px;">${It(v.concern)}</div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Relevant Process Stage</div>
                  <div style="font-size: 12.5px; color: var(--text-primary); margin-top: 2px; font-family: monospace;">${It(v.relevant_process)}</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px; font-size: 12px; color: #334155;">
                <strong style="color: var(--text-secondary); display: block; margin-bottom: 2px; font-size: 11px; text-transform: uppercase;">Live Telemetry Evidence:</strong>
                ${It(v.evidence)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;i.innerHTML=kt(m,"/governance",pn),zt();const f=document.getElementById("btn-reanalyze");f&&f.addEventListener("click",()=>{Gs()})}function au(i){const a=document.getElementById("app");a&&(a.innerHTML=kt(`
    <div style="padding: 40px 0; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
      <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px;">Governance Intelligence Error</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">
        ${It(i||"Unable to execute governance analysis.")}
      </p>
      <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
    </div>
  `,"/governance",pn),zt())}let Ci=null,nn=!1,wa=null,ce=null;function Dt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Ks(i){return Dt(i).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}function Js(i){return!i||isNaN(i)?"":i<1024?i+" B":i<1024*1024?(i/1024).toFixed(1)+" KB":(i/(1024*1024)).toFixed(1)+" MB"}function ou(i,a=null){let o="";a&&(a.isImage&&a.previewUrl?o=`
        <div class="agent-user-attachment">
          <img src="${Dt(a.previewUrl)}" alt="${Dt(a.name)}" class="agent-attachment-thumb" />
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">📷 ${Dt(a.name)}</span>
            <span class="agent-attachment-size">${Dt(a.sizeStr)}</span>
          </div>
        </div>
      `:o=`
        <div class="agent-user-attachment agent-attachment-doc">
          <span class="agent-attachment-icon">📄</span>
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">${Dt(a.name)}</span>
            <span class="agent-attachment-size">${Dt(a.sizeStr)}</span>
          </div>
        </div>
      `);const r=i?`<div class="agent-bubble-text">${Dt(i)}</div>`:"";return`
    <div class="agent-msg-row agent-msg-user">
      <div class="agent-bubble agent-bubble-user">
        ${o}
        ${r}
      </div>
    </div>
  `}function ka(i){return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent">${Ks(i)}</div>
    </div>
  `}function su(i,a){const o=Array.isArray(i)?i.map(l=>`
        <div class="agent-confirm-row ${l.isFile?"agent-confirm-file-row":""}">
          <span class="agent-confirm-label">${Dt(l.label)}</span>
          <span class="agent-confirm-value">${Dt(l.value)}</span>
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
        ${a?`<p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:12px;">${Ks(a.split(`

`)[0])}</p>`:""}
        <div class="agent-confirm-table">${o}</div>
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
  `}function ru(i,a,o,r=[]){const l=Array.isArray(r)&&r.length>0?`<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; gap:4px;">
         <span>📎</span> <span>Attached evidence: <strong>${r.map(Dt).join(", ")}</strong></span>
       </div>`:"";return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" style="background:var(--green-600);" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="agent-success-card">
        <div style="font-weight:700; font-size:1rem; color:var(--green-700); margin-bottom:6px;">
          ✅ ${Dt(o)} Submitted!
        </div>
        <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:8px;">
          <strong>#${i}</strong> — ${Dt(a)}
        </div>
        ${l}
        <a href="/entities/${i}" class="btn btn-sm btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
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
  `}function lu(){return`
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
  `}function cu(){return document.getElementById("agent-thread")}function za(){return document.getElementById("agent-input")}function du(){return document.getElementById("agent-send-btn")}function uu(){return document.getElementById("agent-attach-btn")}function Ys(){return document.getElementById("agent-file-input")}function ti(i){const a=cu();if(!a)return;const o=document.createElement("div");for(o.innerHTML=i;o.firstChild;)a.appendChild(o.firstChild);a.scrollTop=a.scrollHeight}function fs(){const i=document.getElementById("agent-thinking");i&&i.remove()}function da(i){const a=za(),o=du(),r=uu();a&&(a.disabled=!i),o&&(o.disabled=!i,o.style.opacity=i?"1":"0.5"),r&&(r.disabled=!i,r.style.opacity=i?"1":"0.5")}function Ra(){var r;const i=document.getElementById("agent-file-preview-bar");if(!i)return;if(!ce){i.innerHTML="",i.style.display="none";return}const a=ce.type.startsWith("image/"),o=a?URL.createObjectURL(ce):null;i.style.display="flex",i.innerHTML=`
    <div class="agent-preview-chip">
      ${a?`<img src="${o}" class="agent-preview-thumb" alt="Preview" />`:'<span class="agent-preview-icon">📄</span>'}
      <div class="agent-preview-info">
        <span class="agent-preview-filename">${Dt(ce.name)}</span>
        <span class="agent-preview-filesize">${Js(ce.size)}</span>
      </div>
      <button type="button" id="agent-remove-file-btn" class="agent-preview-remove" title="Remove attachment" aria-label="Remove attachment">&times;</button>
    </div>
  `,(r=document.getElementById("agent-remove-file-btn"))==null||r.addEventListener("click",()=>{ce=null;const l=Ys();l&&(l.value=""),Ra()})}async function Mi(i,a=null){const o=a||ce,r=(i||"").trim();if(nn||!r&&!o)return;nn=!0;let l=null;if(o){const p=o.type.startsWith("image/");l={name:o.name,sizeStr:Js(o.size),isImage:p,previewUrl:p?URL.createObjectURL(o):null}}const d=za();d&&(d.value="",d.style.height="auto"),ce=null;const u=Ys();u&&(u.value=""),Ra(),ti(ou(r||(o?`Uploaded: ${o.name}`:""),l)),da(!1),ti(lu());try{const p=await on.chat(Ci,r,o);fs();const m=p.data;wa=null,m.type==="confirm"?(wa=m,ti(su(m.summary||[],m.text)),setTimeout(()=>{const f=document.getElementById("agent-submit-btn"),v=document.getElementById("agent-cancel-btn");f&&f.addEventListener("click",()=>{var y;(y=document.getElementById("agent-confirm-btns"))==null||y.remove(),Mi("yes")}),v&&v.addEventListener("click",()=>{var y;(y=document.getElementById("agent-confirm-btns"))==null||y.remove(),Mi("cancel")})},50)):m.type==="submitted"?(ti(ru(m.entity_id,m.entity_name,m.capability,m.files)),da(!1),setTimeout(()=>{const f=document.getElementById("agent-new-request-btn");f&&f.addEventListener("click",()=>{X("/agent/chat")})},50)):ti(ka(m.text||"Something went wrong. Please try again."))}catch(p){fs(),ti(ka("Sorry, I encountered an error processing your request. Please try again or use the manual form.")),console.error("[Agent Chat] Error:",p)}finally{if(nn=!1,document.getElementById("agent-input")){da(!0);const p=za();p&&!p.disabled&&p.focus()}}}async function pu(i={},a=null){if(!he(X))return;Ci=null,nn=!1,wa=null,ce=null;const o=a||new URLSearchParams(window.location.search),r=o.get("sessionId"),l=o.get("message");Ci=r||"ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);const d=document.getElementById("app");d.innerHTML=kt(`
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
        ${ka(`Hello! I'm your CIVIC-KALKI assistant. I can help you:

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
  `,"Civic Assistant"),zt();const u=document.getElementById("agent-input"),p=document.getElementById("agent-send-btn"),m=document.getElementById("agent-attach-btn"),f=document.getElementById("agent-file-input");!u||!p||(m==null||m.addEventListener("click",()=>{f==null||f.click()}),f==null||f.addEventListener("change",v=>{var _;const y=(_=v.target.files)==null?void 0:_[0];y&&(ce=y,Ra(),u.focus())}),u.addEventListener("input",()=>{u.style.height="auto",u.style.height=Math.min(u.scrollHeight,120)+"px"}),u.addEventListener("keydown",v=>{v.key==="Enter"&&!v.shiftKey&&(v.preventDefault(),Mi(u.value))}),p.addEventListener("click",()=>{Mi(u.value)}),l&&l.trim()?setTimeout(()=>Mi(decodeURIComponent(l)),120):u.focus(),window.addEventListener("beforeunload",()=>{Ci&&on.clearSession(Ci)},{once:!0}))}function ze(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const vs={relatable:{primary:"#FF6B35",secondary:"#1A1A2E",accent:"#FFD700",text:"#FFFFFF"},awareness:{primary:"#2E86AB",secondary:"#1A1A2E",accent:"#A8DADC",text:"#FFFFFF"},cta:{primary:"#43AA8B",secondary:"#1A1A2E",accent:"#F8961E",text:"#FFFFFF"}};function hu(i){const{template_type:a="awareness",headline:o,caption:r,locality:l,category:d,photoUrl:u,exportMode:p=!1}=i,m=vs[a]||vs.awareness,f=u?`background-image:url('${u}'); background-size:cover; background-position:center;`:`background:linear-gradient(135deg, ${m.secondary} 0%, #2d2d44 100%);`,v={relatable:"?? Relatable",awareness:"?? Awareness",cta:"CTA"}[a]||"?? Awareness",y={relatable:`
      <div style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:22px;font-weight:800;color:${m.accent};letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;">${ze(o)}</div>
        <div style="font-size:15px;color:#fff;line-height:1.5;">${ze(r)}</div>
      </div>
    `,awareness:`
      <div style="background:rgba(46,134,171,0.85);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;border-left:4px solid ${m.accent};">
        <div style="font-size:12px;color:${m.accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">CIVIC ISSUE � ${ze(d||"Infrastructure")}</div>
        <div style="font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:8px;">${ze(o)}</div>
        <div style="font-size:14px;color:#ddd;line-height:1.5;">${ze(r)}</div>
      </div>
    `,cta:`
      <div style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:20px;font-weight:800;color:${m.accent};line-height:1.2;margin-bottom:8px;">${ze(o)}</div>
        <div style="font-size:14px;color:#fff;line-height:1.5;margin-bottom:12px;">${ze(r)}</div>
        <div style="display:inline-block;background:${m.primary};color:#fff;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;">Report &amp; Support ?</div>
      </div>
    `}[a]||"";return`
    <div class="${p?"":"ck-meme-card"}" id="meme-preview-canvas" style="
      width:360px;
      min-height:400px;
      border-radius:${p?"0":"16px"};
      overflow:hidden;
      position:relative;
      font-family:'Inter','Segoe UI',sans-serif;
      ${f}
      display:flex;
      flex-direction:column;
      justify-content:flex-end;
    ">
      <!-- Gradient overlay -->
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%);"></div>

      <!-- Template label badge -->
      <div style="position:absolute;top:12px;right:12px;background:${m.primary};color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;z-index:2;">
        ${v}
      </div>

      <!-- Locality badge -->
      <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;z-index:2;">
        ?? ${ze(l)}
      </div>

      <!-- Content -->
      <div style="position:relative;z-index:2;padding:16px;">
        ${y}

        <!-- Footer (mandatory � never remove) -->
        <div style="font-size:10px;color:rgba(255,255,255,0.55);text-align:center;padding-top:6px;border-top:1px solid rgba(255,255,255,0.15);margin-top:4px;">
          Civic awareness content | Caption AI-assisted
        </div>
      </div>
    </div>
  `}function Rt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let z={step:1,issueId:null,issue:null,config:null,myIssues:[],category:"",locality:"",photoFile:null,photoPreviewUrl:null,eligibility:null,templateType:null,aiOptions:[],selectedOption:null,editedHeadline:"",editedCaption:"",captionSource:"manual",originalAiSuggestion:null,safetyResult:null,attestationAccepted:!1,submitting:!1};async function Xs({issueId:i}){if(!he(X))return;const a=document.getElementById("app");a.innerHTML=kt(`
    <div class="page-header mb-4">
      <div class="topbar-breadcrumb mb-2">
        ${i?`<a href="/entities/${i}" class="text-link">Back to Issue</a>`:'<a href="/buzz" class="text-link">Back to Civic Buzz</a>'}
      </div>
      <h1>Civic Buzz Studio</h1>
      <p class="text-secondary" style="margin-top:4px;">Create civic awareness content. Every post requires moderator approval before publication.</p>
    </div>
    <div id="meme-studio-body"></div>
  `,"Civic Buzz Studio"),zt(),z.photoPreviewUrl&&URL.revokeObjectURL(z.photoPreviewUrl),z={...z,step:1,issueId:i?Number(i):null,issue:null,eligibility:null,config:null,myIssues:[],category:"",locality:"",photoFile:null,photoPreviewUrl:null},await mu(i)}async function mu(i){const a=document.getElementById("meme-studio-body");a.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{const[o,r]=await Promise.all([B("GET","/meme/config"),B("GET","/meme/my-issues")]);if(z.config=o.data,z.myIssues=r.data||[],i){if(z.issue=z.myIssues.find(l=>Number(l.issue_id)===Number(i))||null,!z.issue){fu(a,"Only your own approved issues can be linked.");return}z.category=z.issue.category,z.locality=z.issue.locality}vu(a)}catch(o){a.innerHTML=`<div class="alert alert-error">${Rt(o.message||"Failed to load issue.")}</div>`}}function fu(i,a){i.innerHTML=`
    <div class="alert alert-warning" style="max-width:600px;">
      <strong>? Cannot Create Meme Campaign</strong>
      <p style="margin-top:8px;">${Rt(a)}</p>
      <p style="margin-top:8px;color:var(--text-secondary);font-size:0.875rem;">
        If this is a serious matter (crime, harassment, communal issues), please
        <a href="/entities/new" class="text-link">file a Grievance</a> instead.
      </p>
    </div>
  `}function vu(i){var u;const a=z.config.categories||[],o=z.config.localities||[],r=((u=z.issue)==null?void 0:u.issue_id)||"";i.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:720px;">
      <h2 class="mb-2">Start a Civic Buzz post</h2>
      <p class="text-secondary mb-4">Add an issue photo, choose its category and locality, then send it for moderator review.</p>
      <label class="form-label" for="buzz-photo">Photo</label>
      <input id="buzz-photo" class="form-input mb-3" type="file" accept="image/*" capture="environment" />
      <div id="buzz-photo-preview" class="mb-4"></div>
      <label class="form-label" for="buzz-category">Category</label>
      <select id="buzz-category" class="form-input mb-3" ${r?"disabled":""}>
        <option value="">Choose a category</option>
        ${a.map(p=>`<option value="${Rt(p)}" ${p===z.category?"selected":""}>${Rt(p)}</option>`).join("")}
      </select>
      <label class="form-label" for="buzz-locality">Locality</label>
      <select id="buzz-locality" class="form-input mb-3" ${r?"disabled":""}>
        <option value="">Unassigned</option>
        ${o.map(p=>`<option value="${Rt(p)}" ${p===z.locality?"selected":""}>${Rt(p)}</option>`).join("")}
      </select>
      <label class="form-label" for="buzz-linked-issue">Link one of my approved issues (optional)</label>
      <select id="buzz-linked-issue" class="form-input mb-3">
        <option value="">Standalone post</option>
        ${z.myIssues.map(p=>`<option value="${p.issue_id}" ${Number(p.issue_id)===Number(r)?"selected":""}>${Rt(p.name)} (${Rt(p.category)})</option>`).join("")}
      </select>
      <div id="buzz-category-feedback" aria-live="polite" class="mb-3"></div>
      <button id="buzz-details-next" class="btn btn-primary" type="button" disabled onclick="window._memeStartBuzz()">Continue</button>
    </div>
  `;const l=document.getElementById("buzz-photo");l.addEventListener("change",()=>{var m;const p=((m=l.files)==null?void 0:m[0])||null;z.photoFile=p,z.photoPreviewUrl&&URL.revokeObjectURL(z.photoPreviewUrl),z.photoPreviewUrl=p?URL.createObjectURL(p):null,document.getElementById("buzz-photo-preview").innerHTML=z.photoPreviewUrl?`<img src="${z.photoPreviewUrl}" alt="Selected photo preview" style="max-width:100%;max-height:320px;border-radius:12px;" />`:"",d()}),document.getElementById("buzz-category").addEventListener("change",p=>{z.category=p.target.value,d()}),document.getElementById("buzz-locality").addEventListener("change",p=>{z.locality=p.target.value||"Unassigned"}),document.getElementById("buzz-linked-issue").addEventListener("change",p=>{const m=z.myIssues.find(f=>String(f.issue_id)===p.target.value)||null;z.issue=m,z.issueId=(m==null?void 0:m.issue_id)||null,m&&(z.category=m.category,z.locality=m.locality||"Unassigned",document.getElementById("buzz-category").value=z.category,document.getElementById("buzz-locality").value=z.locality==="Unassigned"?"":z.locality),document.getElementById("buzz-category").disabled=!!m,document.getElementById("buzz-locality").disabled=!!m,d()});function d(){const p=z.category.toLowerCase(),m=z.config.no_meme_categories.some(y=>p.includes(y.toLowerCase())),f=z.config.humor_allowed_categories.includes(p),v=m?'<div class="alert alert-error">This category cannot be used for Civic Buzz. Please use the <a href="/entities/new" class="text-link">Grievance form</a>.</div>':z.config.safety_sensitive_categories.some(y=>p.includes(y.toLowerCase()))?'<div class="alert alert-warning">Only neutral Awareness and CTA templates are available for this safety-sensitive category.</div>':!f&&p?'<div class="alert alert-info">Only Awareness and CTA templates are available for this category.</div>':"";document.getElementById("buzz-category-feedback").innerHTML=v,document.getElementById("buzz-details-next").disabled=!z.photoFile||!p||m}window._memeStartBuzz=()=>{const p=z.category.toLowerCase(),m=z.config.no_meme_categories.some(y=>p.includes(y.toLowerCase()));if(!z.photoFile||!p||m)return;const f=z.config.safety_sensitive_categories.some(y=>p.includes(y.toLowerCase())),v=z.config.humor_allowed_categories.includes(p);z.eligibility={eligible:!0,templateTypes:f?["awareness","cta"]:v?["relatable","awareness","cta"]:["awareness","cta"]},Qs(i)}}function Qs(i){z.step=1;const a=z.eligibility.templateTypes||[],o={relatable:{icon:"??",name:"Relatable",desc:`Light situational humor that makes people nod. "We've all been there." Perfect for everyday civic frustrations.`},awareness:{icon:"??",name:"Awareness",desc:"Factual, informative content that raises visibility for an issue. Facts from the actual report only."},cta:{icon:"??",name:"Call to Action",desc:"Energizing content that encourages citizens to report, support, or take action together."}};i.innerHTML=`
    <div class="ck-studio-wizard">
      ${ri(2)}
      <h2 class="mb-2">Choose a Template</h2>
      <p class="text-secondary mb-4">Pick the tone that best fits this issue.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:720px;">
        ${a.map(r=>{const l=o[r]||{icon:"??",name:r,desc:""};return`
            <button class="ck-template-card" data-template="${r}" onclick="window._memePickTemplate('${r}')">
              <div style="font-size:2.5rem;margin-bottom:8px;">${l.icon}</div>
              <div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${l.name}</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">${l.desc}</div>
            </button>
          `}).join("")}
      </div>
    </div>
  `,window._memePickTemplate=r=>{z.templateType=r,tr(i)}}async function tr(i){z.step=2,i.innerHTML=`
    <div class="ck-studio-wizard">
      ${ri(3)}
      <h2 class="mb-2">Caption Your Meme</h2>
      <div class="loading-overlay" style="position:static;height:80px;"><div class="spinner"></div></div>
      <p class="text-secondary">Generating AI caption suggestions...</p>
    </div>
  `;let a={options:[],ai_unavailable:!1};try{a=(await B("POST","/meme/captions",{issue_id:z.issueId||null,category:z.category,locality:z.locality,template:z.templateType})).data}catch(m){a={options:[],ai_unavailable:!0,reason:m.message||"AI unavailable."}}z.aiOptions=a.options||[];const o=a.ai_unavailable?`<div class="alert alert-warning mb-3" style="max-width:640px;">
        <strong>?? AI Unavailable</strong>
        <p style="margin-top:4px;font-size:0.875rem;">${Rt(a.reason||"AI caption service is temporarily unavailable. Please write your own caption below.")}</p>
        <p style="font-size:0.75rem;color:var(--text-secondary);">Note: Automated safety check flagged as "unavailable" � moderator will review manually.</p>
      </div>`:"",r=z.aiOptions.length>0?`
      <div class="mb-3" style="max-width:640px;">
        <label class="form-label mb-2"><strong>AI Suggestions (select one to pre-fill):</strong></label>
        ${z.aiOptions.map((m,f)=>`
          <button class="ck-caption-option" onclick="window._memeSelectOption(${f})" id="capopt-${f}" style="display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;border-radius:8px;border:2px solid var(--border-color);background:var(--bg-secondary);cursor:pointer;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${Rt(m.headline)}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">${Rt(m.caption)}</div>
          </button>
        `).join("")}
      </div>
    `:"";i.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:720px;">
      ${ri(3)}
      <h2 class="mb-2">Caption Your Meme</h2>
      ${o}
      ${r}

      <div class="mb-3">
        <label class="form-label" for="meme-headline">Headline <span style="color:var(--text-muted);font-size:0.8rem;">(max 60 chars)</span></label>
        <input id="meme-headline" class="form-input" type="text" maxlength="60"
          placeholder="e.g. Pothole life got real"
          value="${Rt(z.editedHeadline)}"
          oninput="window._memeSafetyCheck()"
        />
        <div id="headline-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 60</div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="meme-caption">Caption <span style="color:var(--text-muted);font-size:0.8rem;">(max 140 chars)</span></label>
        <textarea id="meme-caption" class="form-input" rows="3" maxlength="140"
          placeholder="e.g. Me checking the same pothole every day like it's a long-term relationship."
          oninput="window._memeSafetyCheck()"
        >${Rt(z.editedCaption)}</textarea>
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
  `,p(),window._memeSelectOption=m=>{const f=z.aiOptions[m];f&&(z.selectedOption=f,z.editedHeadline=f.headline,z.editedCaption=f.caption,z.captionSource="ai",z.originalAiSuggestion=f,document.getElementById("meme-headline").value=f.headline,document.getElementById("meme-caption").value=f.caption,z.aiOptions.forEach((v,y)=>{const _=document.getElementById(`capopt-${y}`);_&&(_.style.borderColor=y===m?"var(--accent-primary)":"var(--border-color)")}),window._memeSafetyCheck())};let l;window._memeSafetyCheck=()=>{p(),clearTimeout(l),l=setTimeout(d,500)};async function d(){var v,y,_,b,C,w,M,O;const m=((v=document.getElementById("meme-headline"))==null?void 0:v.value)||"",f=((y=document.getElementById("meme-caption"))==null?void 0:y.value)||"";if(!m&&!f){u("",!1);return}z.captionSource==="ai"?(m!==(((_=z.selectedOption)==null?void 0:_.headline)||"")||f!==(((b=z.selectedOption)==null?void 0:b.caption)||""))&&(z.captionSource="ai_edited"):z.captionSource="manual",z.editedHeadline=m,z.editedCaption=f,u('<span style="color:var(--text-muted);">Checking...</span>',!1);try{const P=await B("POST","/meme/safety-check",{headline:m,caption:f,issue_id:z.issueId,category:z.category,template:z.templateType});if(z.safetyResult=P.data,P.data.passed)u('<span style="color:var(--success);">? Caption looks good!</span>',!0);else{const V=[...((C=P.data.deterministic)==null?void 0:C.violations)||[],...((w=P.data.ai_safety)==null?void 0:w.violations)||[]],F=((M=P.data.ai_safety)==null?void 0:M.status)==="unavailable",$=V.map(I=>`<li>${Rt(I)}</li>`).join(""),J=F?'<li style="color:var(--warning);">AI safety check unavailable. This post will be flagged for moderator review.</li>':"",N=((O=P.data.deterministic)==null?void 0:O.passed)===!0;u(`<div class="alert ${N&&F?"alert-warning":"alert-error"}" style="margin:0;padding:8px 12px;"><ul style="margin:0;padding-left:18px;">${$}${J}</ul></div>`,N&&F)}}catch{z.safetyResult={passed:!1,deterministic:{passed:!1,violations:["Safety check unavailable."]},ai_safety:{safe:!1,violations:[],status:"unavailable"}},u('<span style="color:var(--warning);">Safety check unavailable. This post will be flagged for moderator review.</span>',!0)}}function u(m,f){const v=document.getElementById("safety-feedback");v&&(v.innerHTML=m);const y=document.getElementById("step2-next");y&&(y.disabled=!f)}function p(){const m=document.getElementById("meme-headline"),f=document.getElementById("meme-caption"),v=document.getElementById("headline-chars"),y=document.getElementById("caption-chars");m&&v&&(v.textContent=`${m.value.length} / 60`),f&&y&&(y.textContent=`${f.value.length} / 140`)}window._memeGoStep=m=>{m===1&&Qs(i)},window._memeGoStep3=()=>{var m,f;z.editedHeadline=((m=document.getElementById("meme-headline"))==null?void 0:m.value)||"",z.editedCaption=((f=document.getElementById("meme-caption"))==null?void 0:f.value)||"",er(i)}}function er(i){z.step=3,i.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:600px;">
      ${ri(4)}
      <h2 class="mb-2">Photo Attestation</h2>
      <p class="text-secondary mb-4">
        Confirm that you have permission to share this photo.
      </p>

      <div class="alert alert-info mb-4" style="font-size:0.875rem;line-height:1.6;">
        <strong>Your photo will be visible to the public after moderator approval.</strong>
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
          <strong>No identifiable faces, number plates, or private property in my photo, or I have consent.</strong>
        </span>
      </label>

      <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window._memeGoStep(2)">? Back</button>
        <button class="btn btn-primary" id="step3-next" onclick="window._memeGoStep4()" disabled>
          Next: Preview ?
        </button>
      </div>
    </div>
  `,window._memeAttestCheck=a=>{z.attestationAccepted=a;const o=document.getElementById("step3-next");o&&(o.disabled=!a)},window._memeGoStep=a=>{a===2&&tr(i)},window._memeGoStep4=()=>{if(!z.attestationAccepted){Q("Please accept the attestation to continue.");return}gu(i)}}function gu(i){var l,d,u,p;z.step=4;const a=z.photoPreviewUrl,o=hu({template_type:z.templateType,headline:z.editedHeadline,caption:z.editedCaption,locality:z.locality||"Unassigned",category:z.category,photoUrl:a,shareLink:z.issueId?`/entities/${z.issueId}`:null}),r=((d=(l=z.safetyResult)==null?void 0:l.ai_safety)==null?void 0:d.status)==="unavailable"?'<div class="alert alert-warning" style="font-size:0.8rem;margin-bottom:12px;max-width:420px;">?? AI safety check was unavailable. Your meme will be flagged for manual moderator review.</div>':"";i.innerHTML=`
    <div class="ck-studio-wizard">
      ${ri(5)}
      <h2 class="mb-2">Preview Your Meme</h2>
      <p class="text-secondary mb-3">This is how your meme will appear in Civic Buzz after approval.</p>

      ${r}

      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;">
        <div>${o}</div>

        <div style="max-width:280px;">
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Template</div>
            <div style="font-weight:600;">${(u=z.templateType)==null?void 0:u.replace(/_/g," ")}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Caption Source</div>
            <div>${z.captionSource==="ai"?"?? AI-generated":z.captionSource==="ai_edited"?"?? AI-assisted + edited":"?? Manual"}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Linked Issue</div>
            ${z.issueId?`<a href="/entities/${z.issueId}" class="text-link">#${z.issueId} - ${Rt(((p=z.issue)==null?void 0:p.name)||"")}</a>`:"<span>Standalone civic highlight</span>"}
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
  `,window._memeGoStep=m=>{m===3&&er(i)},window._memeSubmit=async()=>{if(z.submitting)return;z.submitting=!0;const m=document.getElementById("step4-submit");m&&(m.disabled=!0,m.textContent="Submitting...");try{const v=(await B("POST","/meme/campaigns",{issue_id:z.issueId,category:z.category,locality:z.locality,template:z.templateType,headline:z.editedHeadline,caption:z.editedCaption,caption_source:z.captionSource,original_ai_suggestion:z.originalAiSuggestion,attestation_accepted:!0})).data.campaign.entity_id,y=new FormData;y.append("photo",z.photoFile),await B("POST",`/meme/campaigns/${v}/photo`,null,{body:y,headers:{"X-Requested-With":"ck-web"}}),await B("POST",`/meme/campaigns/${v}/submit`),yu(i,v)}catch(f){z.submitting=!1,m&&(m.disabled=!1,m.textContent="?? Submit for Review"),Q(f.message||"Submission failed. Please try again.")}}}function yu(i,a){z.step=5,i.innerHTML=`
    <div class="ck-studio-wizard" style="text-align:center;max-width:520px;margin:0 auto;">
      ${ri(6)}
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
        ${z.issueId?`<a href="/entities/${z.issueId}" class="btn btn-primary">Back to Issue</a>`:""}
      </div>
    </div>
  `}function ri(i){const a=[{n:1,label:"Photo and details"},{n:2,label:"Template"},{n:3,label:"Caption"},{n:4,label:"Attestation"},{n:5,label:"Preview"},{n:6,label:"Done"}];return`
    <div class="ck-studio-steps" style="display:flex;align-items:center;gap:0;margin-bottom:28px;flex-wrap:wrap;">
      ${a.map((o,r)=>`
        <div style="display:flex;align-items:center;">
          <div style="
            width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            font-size:0.75rem;font-weight:700;
            background:${o.n<=i?"var(--accent-primary)":"var(--bg-tertiary)"};
            color:${o.n<=i?"#fff":"var(--text-muted)"};
          ">${o.n}</div>
          <div style="font-size:0.75rem;margin-left:6px;color:${o.n===i?"var(--text-primary)":"var(--text-muted)"};">${o.label}</div>
          ${r<a.length-1?'<div style="width:24px;height:2px;background:var(--border-color);margin:0 8px;"></div>':""}
        </div>
      `).join("")}
    </div>
  `}function be(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const gs='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CIVIC BUZZ</text><text x="50%" y="56%" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="15" fill="%23fdba74" text-anchor="middle">YOUTH-POWERED CIVIC CONVERSATION</text></svg>';let Ce="trending",Be=[];async function bu(){const i=document.getElementById("app"),a=new URLSearchParams(window.location.search),o=a.get("filter");["trending","newest","following"].includes(o)&&(Ce=o);const r=a.get("post");i.innerHTML=kt(`
    <div class="ck-buzz-gallery-container">
      <!-- Top Hero Banner -->
      <div class="ck-buzz-gallery-hero">
        <div class="ck-buzz-gallery-hero-left">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <a href="/dashboard" class="ck-buzz-back-link">← Dashboard</a>
            <span style="color:#64748b; font-size:0.8rem;">/</span>
            <span style="color:#ff5a36; font-size:0.8rem; font-weight:700;">Community</span>
          </div>
          <h1 class="ck-buzz-gallery-title">
            CIVIC BUZZ <span class="ck-buzz-flame">🔥</span>
          </h1>
          <p class="ck-buzz-gallery-subtitle">
            Youth-powered civic conversations turning everyday problems into visible municipal accountability.
          </p>
        </div>

        <div class="ck-buzz-gallery-hero-right">
          <button type="button" class="btn btn-primary" id="ck-buzz-gallery-create-btn" style="border-radius:999px; font-weight:700; padding:10px 22px; display:inline-flex; align-items:center; gap:8px;">
            <span>+</span> Create Post
          </button>
        </div>
      </div>

      <!-- Action & Filter Bar -->
      <div class="ck-buzz-filter-bar">
        <div class="ck-buzz-filter-chips">
          <button type="button" class="ck-buzz-chip ${Ce==="trending"?"active":""}" data-filter="trending">
            🔥 Trending
          </button>
          <button type="button" class="ck-buzz-chip ${Ce==="newest"?"active":""}" data-filter="newest">
            ⚡ Newest
          </button>
          <button type="button" class="ck-buzz-chip ${Ce==="following"?"active":""}" data-filter="following">
            👤 Following
          </button>
        </div>

        <div style="font-size:0.78rem; color:#64748b; font-weight:600;" id="ck-buzz-results-count">
          Loading posts...
        </div>
      </div>

      <!-- Main Gallery Content Grid -->
      <div id="ck-buzz-gallery-content" class="ck-buzz-gallery-grid">
        <!-- Loading skeletons -->
        <div class="ck-buzz-card-skeleton"></div>
        <div class="ck-buzz-card-skeleton"></div>
        <div class="ck-buzz-card-skeleton"></div>
      </div>
    </div>
  `,"Civic Buzz"),zt(),xu(),await Ii(r)}function xu(){var i;(i=document.getElementById("ck-buzz-gallery-create-btn"))==null||i.addEventListener("click",()=>{$i(null,()=>Ii())}),document.querySelectorAll(".ck-buzz-chip").forEach(a=>{a.addEventListener("click",async()=>{const o=a.getAttribute("data-filter");if(o!==Ce){if(o==="following"&&!qt()){ue("Please sign in to view posts you are following."),X("/login");return}Ce=o,document.querySelectorAll(".ck-buzz-chip").forEach(r=>r.classList.remove("active")),a.classList.add("active"),await Ii()}})})}async function Ii(i=null){const a=document.getElementById("ck-buzz-gallery-content"),o=document.getElementById("ck-buzz-results-count");if(a){a.innerHTML=`
    <div class="ck-buzz-card-skeleton"></div>
    <div class="ck-buzz-card-skeleton"></div>
    <div class="ck-buzz-card-skeleton"></div>
  `,o&&(o.textContent="Loading...");try{if(Be=(await mt.list({limit:40,sort:Ce})).data||[],o&&(o.textContent=`${Be.length} civic conversation${Be.length===1?"":"s"}`),Be.length===0){_u(a);return}if(ku(a,Be),i){const l=Be.find(d=>String(d.id)===String(i));l&&qs(l,d=>La(d))}}catch(r){wu(a,r.message)}}}function _u(i){var o;const a=Ce==="following";i.innerHTML=`
    <div class="ck-buzz-empty-state-wrap">
      <div style="font-size:3rem; margin-bottom:8px;">${a?"📭":"🌱"}</div>
      <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:6px;">
        ${a?"No followed posts yet":"No Civic Buzz posts found"}
      </h3>
      <p style="font-size:0.84rem; color:#64748b; max-width:440px; margin:0 auto 18px;">
        ${a?"Follow posts on the trending or newest feed to track community updates and discussions.":"Be the first to turn a local issue or neighborhood initiative into a viral civic conversation!"}
      </p>
      <button type="button" class="btn btn-primary" id="ck-buzz-empty-action-btn" style="border-radius:999px; font-weight:700;">
        ${a?"Explore Trending Posts":"+ Create First Post"}
      </button>
    </div>
  `,(o=document.getElementById("ck-buzz-empty-action-btn"))==null||o.addEventListener("click",()=>{var r;a?(r=document.querySelector('.ck-buzz-chip[data-filter="trending"]'))==null||r.click():$i(null,()=>Ii())})}function wu(i,a){var o;i.innerHTML=`
    <div class="ck-buzz-empty-state-wrap" style="border-color: rgba(239,68,68,0.25); background: rgba(239,68,68,0.04);">
      <div style="font-size:2.4rem; margin-bottom:8px;">⚠️</div>
      <h3 style="font-size:1.05rem; font-weight:700; color:#991b1b; margin-bottom:6px;">
        Failed to load Civic Buzz
      </h3>
      <p style="font-size:0.8rem; color:#64748b; margin-bottom:14px;">${be(a)}</p>
      <button type="button" class="btn btn-secondary btn-sm" id="ck-buzz-retry-btn" style="border-radius:999px;">
        Try Again
      </button>
    </div>
  `,(o=document.getElementById("ck-buzz-retry-btn"))==null||o.addEventListener("click",()=>Ii())}function ku(i,a){i.innerHTML=a.map(o=>{const r=o.image_url||gs,l=o.linked_title||o.caption,d=o.views_count||0,u=o.vote_count||0,p=o.shares_count||0;return`
      <div class="ck-buzz-card" data-post-id="${o.id}">
        <!-- Media Image with Bold Meme Caption -->
        <div class="ck-buzz-card-media" data-action="open-detail">
          <img src="${be(r)}" alt="${be(o.caption)}" class="ck-buzz-card-img" onerror="this.src='${gs}'" />
          <div class="ck-buzz-card-scrim"></div>
          
          <div class="ck-buzz-card-caption">
            ${be(o.caption)}
          </div>

          <div class="ck-buzz-card-badges">
            <span class="ck-buzz-badge-pill">
              ${o.template==="initiative"?"🌱 INITIATIVE":o.template==="awareness"?"📢 AWARENESS":"🔥 MEME"}
            </span>
            ${o.linked_status?`
              <span class="ck-buzz-status-tag ${be(o.linked_status)}">
                ${be(o.linked_status)}
              </span>
            `:""}
          </div>
        </div>

        <!-- Details Footer -->
        <div class="ck-buzz-card-details">
          <div class="ck-buzz-card-title-row" data-action="open-detail" style="cursor: pointer;">
            <div class="ck-buzz-card-title" title="${be(l)}">
              ${be(l)}
            </div>
            ${o.linked_area?`<div class="ck-buzz-card-area">📍 ${be(o.linked_area)}</div>`:""}
          </div>

          <!-- Stats Line -->
          <div class="ck-buzz-card-stats-line">
            <span>👁 ${d} views</span>
            <span>·</span>
            <span>⬆ ${u} upvotes</span>
            <span>·</span>
            <span>↗ ${p} shares</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="ck-buzz-card-bottom-bar">
            <button type="button" class="ck-buzz-quick-vote-btn ${o.has_voted?"active":""}" data-action="quick-vote" data-post-id="${o.id}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              <span>${o.has_voted?"Upvoted":"Upvote"}</span>
            </button>

            <button type="button" class="ck-buzz-quick-share-btn" data-action="quick-share" data-post-id="${o.id}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    `}).join(""),i.addEventListener("click",async o=>{const r=o.target.closest(".ck-buzz-card");if(!r)return;const l=Number(r.getAttribute("data-post-id")),d=Be.find(m=>m.id===l);if(!d)return;if(o.target.closest('[data-action="quick-vote"]')){if(o.stopPropagation(),!qt()){ue("Please sign in to upvote.");return}try{const m=await mt.vote(d.id);d.has_voted=m.voted,d.vote_count=m.vote_count,La(d)}catch(m){Q(m.message||"Could not vote")}return}if(o.target.closest('[data-action="quick-share"]')){o.stopPropagation(),bn(d);return}qs(d,m=>La(m))})}function La(i){const a=document.querySelector(`.ck-buzz-card[data-post-id="${i.id}"]`);if(!a)return;const o=a.querySelector('[data-action="quick-vote"]');o&&(o.classList.toggle("active",i.has_voted),o.querySelector("span").textContent=i.has_voted?"Upvoted":"Upvote");const r=a.querySelector(".ck-buzz-card-stats-line");r&&(r.innerHTML=`
      <span>👁 ${i.views_count||0} views</span>
      <span>·</span>
      <span>⬆ ${i.vote_count||0} upvotes</span>
      <span>·</span>
      <span>↗ ${i.shares_count||0} shares</span>
    `)}function Vt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function zu(i){const a=document.getElementById("app"),o=i==null?void 0:i.id;if(!o||isNaN(Number(o))){ua("Invalid Civic Buzz post ID.");return}a.innerHTML=kt(`
    <div class="ck-buzz-post-page-wrap">
      <div style="text-align:center; padding: 60px 0;">
        <div class="spinner" style="margin: 0 auto 16px;"></div>
        <p style="color:#64748b; font-weight:600;">Loading Civic Buzz conversation...</p>
      </div>
    </div>
  `,"Civic Buzz"),zt();try{const l=(await mt.get(o)).data;if(!l){ua("Civic Buzz post not found or no longer available.");return}mt.logEvent(l.id,"view").catch(()=>{});const d=qt(),u=l.linked_type==="initiative";let p="";l.image_url?p=`
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); position:relative; background:#0f172a; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;">
          <img src="${Vt(l.image_url)}" alt="${Vt(l.caption)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${ln}'" />
          <div class="ck-card-watermark">
            <span class="ck-wm-flame">🔥</span>
            <span class="ck-wm-brand">CIVIC-KALKI</span>
          </div>
        </div>
      `:p=`
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); aspect-ratio:1/1;">
          ${Fs({template:l.template||"meme",style:l.style||"funny",caption:l.caption,cta_text:l.cta_text,issue:{name:l.linked_title,area:l.linked_area,status:l.linked_status,entity_id:l.linked_id}})}
        </div>
      `,a.innerHTML=kt(`
      <div class="ck-buzz-post-page-wrap">
        <!-- Top Back Navigation -->
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
          <a href="/buzz" class="ck-buzz-back-link" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#ff5a36; text-decoration:none;">
            ← Back to Civic Buzz Gallery
          </a>
          <span style="font-size:0.8rem; color:#64748b;">Post #${l.id}</span>
        </div>

        <!-- Main Showcase Card -->
        <div class="ck-buzz-post-view-card">
          <!-- Left: The Visual Card -->
          <div>
            ${p}
          </div>

          <!-- Right: Details, Actions & Conversation -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:20px;">
            <div>
              <!-- Header Badges -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="ck-buzz-fire-tag">🔥 CIVIC BUZZ</span>
                  <span class="ck-buzz-status-pill ${Vt(l.linked_status||"submitted")}">
                    ${Vt(l.linked_status||"Active")}
                  </span>
                </div>
                <button type="button" class="ck-buzz-icon-btn" id="ck-post-report-btn" title="Report post">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
                </button>
              </div>

              <!-- Main Caption Headline -->
              <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin: 0 0 10px;">
                ${Vt(l.caption)}
              </h2>

              ${l.cta_text?`
                <div style="display:inline-flex; align-items:center; gap:6px; background:#fff7ed; border:1px solid #fed7aa; color:#ea580c; font-weight:700; font-size:0.82rem; padding:4px 12px; border-radius:999px; margin-bottom:14px;">
                  ⚡ CTA: ${Vt(l.cta_text)}
                </div>
              `:""}

              <!-- Linked Entity Details Box -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 16px; margin-bottom:16px;">
                <div style="font-size:0.7rem; font-weight:800; color:#ff5a36; text-transform:uppercase; letter-spacing:0.06em;">
                  Linked ${Vt(l.linked_type)} #${Vt(l.linked_id)}
                </div>
                <div style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-top:2px;">
                  ${Vt(l.linked_title||l.caption)}
                </div>
                ${l.linked_area?`<div style="font-size:0.78rem; color:#64748b; margin-top:2px;">📍 ${Vt(l.linked_area)}</div>`:""}
              </div>

              <!-- Metrics Row -->
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; display:flex; gap:14px; margin-bottom:18px;">
                <span>👁 ${l.views_count} views</span>
                <span>⬆ <span id="ck-post-vote-count">${l.vote_count}</span> upvotes</span>
                <span>↗ ${l.shares_count} shares</span>
              </div>

              <!-- Key CTA Buttons -->
              <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;">
                <!-- View Issue Button (Mandatory) -->
                <button type="button" class="btn btn-primary" id="ck-post-view-issue-btn" style="flex:1; min-width:140px; font-weight:700; border-radius:999px; padding:10px 18px;">
                  View Issue →
                </button>

                <!-- Share Button (Mandatory) -->
                <button type="button" class="btn btn-secondary" id="ck-post-share-btn" style="border-radius:999px; font-weight:700; padding:10px 18px; display:inline-flex; align-items:center; gap:6px;">
                  <span>↗</span> Share
                </button>

                <!-- Upvote Toggle -->
                <button type="button" class="ck-buzz-act-btn ${l.has_voted?"active":""}" id="ck-post-upvote-btn" style="border-radius:999px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  <span id="ck-post-vote-label">${l.has_voted?"Upvoted":"Upvote"}</span>
                </button>

                ${u?`
                  <button type="button" class="btn btn-secondary" id="ck-post-join-btn" style="border-radius:999px; font-weight:700; color:#059669; border-color:#a7f3d0; background:#ecfdf5;">
                    🌱 Join Initiative
                  </button>
                `:""}
              </div>
            </div>

            <!-- Comments Section -->
            <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
              <h4 style="font-size:0.9rem; font-weight:700; margin:0 0 10px; color:#0f172a;">
                Community Conversation
              </h4>

              <div class="ck-buzz-comment-input-row" style="margin-bottom:12px;">
                <input
                  type="text"
                  id="ck-post-comment-input"
                  class="ck-buzz-comment-input"
                  placeholder="${d?"Add to the conversation...":"Sign in to comment..."}"
                  ${d?"":"disabled"}
                  maxlength="500"
                />
                <button type="button" id="ck-post-comment-send" class="btn btn-primary btn-sm" style="border-radius:999px;" ${d?"":"disabled"}>
                  Post
                </button>
              </div>

              <div id="ck-post-comments-list" class="ck-buzz-comments-list" style="max-height:220px;">
                <div style="text-align:center; padding:12px; color:#94a3b8; font-size:0.8rem;">
                  Loading comments...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,`Civic Buzz #${l.id}`),zt(),Lu(l),Cu(l.id)}catch(r){ua(r.message||"Error loading post.")}}function ua(i){const a=document.getElementById("app");a.innerHTML=kt(`
    <div class="ck-buzz-post-page-wrap" style="text-align:center; padding:60px 20px;">
      <div style="font-size:3rem; margin-bottom:12px;">🔥</div>
      <h2 style="font-size:1.5rem; font-weight:800; color:#0f172a; margin-bottom:8px;">Civic Buzz Post Not Found</h2>
      <p style="color:#64748b; max-width:440px; margin:0 auto 20px;">${Vt(i)}</p>
      <a href="/buzz" class="btn btn-primary" style="border-radius:999px; font-weight:700;">Explore Civic Buzz Gallery</a>
    </div>
  `,"Post Not Found"),zt()}function Lu(i){var l,d,u,p;(l=document.getElementById("ck-post-view-issue-btn"))==null||l.addEventListener("click",()=>{mt.logEvent(i.id,"click_issue").catch(()=>{}),X(`/entities/${i.linked_id}`)}),(d=document.getElementById("ck-post-share-btn"))==null||d.addEventListener("click",()=>{bn(i)});const a=document.getElementById("ck-post-upvote-btn"),o=document.getElementById("ck-post-vote-count"),r=document.getElementById("ck-post-vote-label");a==null||a.addEventListener("click",async()=>{if(!qt()){ue("Please sign in to upvote."),X("/login");return}try{const m=await mt.vote(i.id);m.voted?(a.classList.add("active"),r.textContent="Upvoted"):(a.classList.remove("active"),r.textContent="Upvote"),o.textContent=m.vote_count}catch(m){Q(m.message||"Could not vote")}}),(u=document.getElementById("ck-post-report-btn"))==null||u.addEventListener("click",()=>{const m=window.prompt(`Why are you reporting this Civic Buzz post?
(e.g., Offensive language, personal data, misleading claim)`);m&&m.trim()&&mt.report(i.id,m.trim()).then(f=>{xt(f.message||"Report received. Thank you for keeping our community safe.")}).catch(f=>{Q(f.message||"Could not report post")})}),(p=document.getElementById("ck-post-join-btn"))==null||p.addEventListener("click",()=>{mt.logEvent(i.id,"join").catch(()=>{}),xt("Thanks for raising your hand! Redirecting to initiative..."),setTimeout(()=>X(`/entities/${i.linked_id}`),800)})}async function Cu(i){const a=document.getElementById("ck-post-comments-list"),o=document.getElementById("ck-post-comment-send"),r=document.getElementById("ck-post-comment-input");if(!a)return;async function l(){try{const u=(await mt.getComments(i)).data||[];if(u.length===0){a.innerHTML='<div style="text-align:center; padding:12px; color:#94a3b8; font-size:0.8rem;">No comments yet. Start the conversation!</div>';return}a.innerHTML=u.map(p=>`
        <div class="ck-buzz-comment-item">
          <div class="ck-buzz-comment-meta">
            <span class="ck-buzz-comment-author">👤 ${Vt(p.author_name)}</span>
            <span class="ck-buzz-comment-time">${new Date(p.created_at).toLocaleDateString()}</span>
          </div>
          <div class="ck-buzz-comment-text">${Vt(p.text)}</div>
        </div>
      `).join("")}catch{a.innerHTML='<div style="text-align:center; padding:10px; color:#ef4444; font-size:0.75rem;">Failed to load comments</div>'}}o==null||o.addEventListener("click",async()=>{var u;const d=r==null?void 0:r.value.trim();if(d){o.disabled=!0;try{await mt.addComment(i,d),r.value="",xt("Comment posted!"),await l()}catch(p){Q(((u=p.data)==null?void 0:u.message)||p.message||"Failed to post comment")}finally{o.disabled=!1}}}),await l()}delete $t.Icon.Default.prototype._getIconUrl;$t.Icon.Default.mergeOptions({iconRetinaUrl:Ia,iconUrl:Pa,shadowUrl:Aa});const Eu="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",Tu='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';let jt=null,tn=null,zi=null;async function ir(){const i=document.getElementById("app"),a=`
    <div style="max-width:1200px; margin:0 auto; padding-bottom:40px;">
      <!-- Hero Banner -->
      <div class="card mb-6" style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; border:none; padding:28px; border-radius:12px; box-shadow:var(--shadow-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
          <div style="max-width:650px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,90,54,0.2); border:1px solid rgba(255,90,54,0.4); padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; color:#ff7d5c; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Civic Geo-Intelligence
            </div>
            <h1 style="font-size:2rem; font-weight:800; line-height:1.2; margin-bottom:10px; color:#ffffff;">Nearby Civic Protests & Operations</h1>
            <p style="color:#94a3b8; font-size:14px; margin-bottom:0; line-height:1.6;">
              Locate public, approved civic rallies, protests, and community campaigns within your vicinity.
              Location coordinates are verified and publicly accessible once officially authorized.
            </p>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
            <button id="btn-detect-location" class="btn btn-primary" style="padding:12px 24px; font-size:15px; font-weight:700; box-shadow:0 4px 14px rgba(255,90,54,0.4); display:inline-flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Find Protests Near Me
            </button>
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#cbd5e1;">
              <span>Search Radius:</span>
              <select id="select-radius" style="background:#334155; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 8px; font-size:12px; font-weight:600; cursor:pointer;">
                <option value="5">5 km</option>
                <option value="10" selected>10 km (Default)</option>
                <option value="25">25 km</option>
                <option value="50">50 km (Max)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid: Map & Results List -->
      <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:20px;" class="nearby-grid">
        <!-- Interactive Leaflet Map Container -->
        <div class="card" style="padding:0; overflow:hidden; border-radius:10px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; height:580px;">
          <div style="padding:14px 18px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              Live Map Radar
            </div>
            <div id="map-status-pill" style="font-size:11px; color:var(--text-muted);">
              Awaiting location permission
            </div>
          </div>
          <div id="nearby-map" style="flex:1; width:100%; background:#e2e8f0; z-index:1;"></div>
        </div>

        <!-- Protests List Container -->
        <div class="card" style="padding:0; overflow:hidden; border-radius:10px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; height:580px;">
          <div style="padding:14px 18px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:14px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              Nearby Records
            </div>
            <span id="results-count-badge" class="badge badge-secondary" style="font-weight:700;">0 found</span>
          </div>

          <div id="nearby-results-list" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; background:var(--gray-50);">
            <!-- Empty state default -->
            <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-muted);">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Search Initiated</div>
              <div style="font-size:13px; max-width:320px; margin:0 auto;">Click "Find Protests Near Me" above to discover verified civic events around your current location.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;i.innerHTML=kt(a,"Nearby Civic Protests"),zt(),Su()}function Su(){const i=document.getElementById("nearby-map"),a=document.getElementById("btn-detect-location"),o=document.getElementById("select-radius"),r=document.getElementById("nearby-results-list"),l=document.getElementById("results-count-badge"),d=document.getElementById("map-status-pill");let u=null;i&&(jt&&(jt.remove(),jt=null),jt=$t.map(i,{center:[28.6139,77.209],zoom:12,zoomControl:!0,attributionControl:!0}),$t.tileLayer(Eu,{attribution:Tu,maxZoom:19}).addTo(jt),zi=$t.layerGroup().addTo(jt),setTimeout(()=>{jt&&jt.invalidateSize()},200));async function p(f,v,y){r&&(r.innerHTML=`
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--text-muted);">
          <div class="spinner" style="width:32px; height:32px; border-width:3px; margin-bottom:12px;"></div>
          <div style="font-size:13px;">Scanning within ${y} km radius...</div>
        </div>
      `);try{const b=(await gt.nearby(f,v,y)).data||[];l&&(l.textContent=`${b.length} found`,l.className=b.length>0?"badge badge-primary":"badge badge-secondary"),d&&(d.textContent=`Showing ${b.length} records within ${y} km`),m(b,f,v)}catch(_){console.error("[NearbyProtests] Fetch error:",_),Q(_.message||"Failed to search nearby events"),r&&(r.innerHTML=`
          <div style="padding:40px 20px; text-align:center; color:#dc2626;">
            <div style="font-weight:600; margin-bottom:4px;">Search Error</div>
            <div style="font-size:13px;">${ei(_.message||"Could not load nearby events")}</div>
          </div>
        `)}}function m(f,v,y){if(!r)return;zi&&zi.clearLayers(),tn&&jt&&jt.removeLayer(tn);const _=$t.divIcon({className:"user-radar-pin",html:'<div style="background:#2563eb; width:18px; height:18px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 10px rgba(37,99,235,0.8); animation:pulse 2s infinite;"></div>',iconSize:[18,18],iconAnchor:[9,9]});if(tn=$t.marker([v,y],{icon:_}).addTo(jt),tn.bindPopup("<strong>Your Location</strong>"),f.length===0){r.innerHTML=`
        <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Approved Protests Found</div>
          <div style="font-size:13px; max-width:320px; margin:0 auto;">
            There are currently no public, approved civic rallies or protests within ${o.value} km.
            Try expanding the search radius.
          </div>
        </div>
      `,jt.setView([v,y],13);return}const b=$t.latLngBounds([[v,y]]),C=f.map(w=>{var F,$;const M=w.latitude,O=w.longitude,P=w.distance_km!=null?`${Number(w.distance_km).toFixed(1)} km away`:"",V=w.maps_url||`https://www.google.com/maps/search/?api=1&query=${M},${O}`;return M!=null&&O!=null&&zi&&(b.extend([M,O]),$t.marker([M,O]).addTo(zi).bindPopup(`
          <div style="padding:4px; max-width:220px;">
            <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:4px;">${ei(w.name)}</div>
            <div style="font-size:11px; color:#64748b; margin-bottom:6px;">${ei(((F=w.entityType)==null?void 0:F.name)||"Civic Event")} • ${P}</div>
            <a href="${V}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:11px; color:#ff5a36; font-weight:600; text-decoration:none;">Open in Google Maps →</a>
          </div>
        `)),`
        <div class="card" style="padding:14px; border:1px solid var(--border); background:var(--surface); border-radius:8px; transition:all 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
            <div>
              <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.04em;">
                ${ei((($=w.entityType)==null?void 0:$.name)||"Event")}
              </div>
              <a href="/entities/${w.entity_id}" class="text-link" style="font-size:15px; font-weight:700; color:var(--text-primary); text-decoration:none;">
                ${ei(w.name)}
              </a>
            </div>
            <span class="badge badge-success" style="font-size:11px; flex-shrink:0;">Approved</span>
          </div>

          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
            ${w.area?`<span>Area: <strong>${ei(w.area)}</strong></span> • `:""}
            <span>Distance: <strong style="color:var(--primary);">${P}</strong></span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px; font-size:12px;">
            <a href="/entities/${w.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px; padding:4px 10px;">
              View Details
            </a>
            <a href="${V}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size:12px; padding:4px 10px; display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              Open in Maps
            </a>
          </div>
        </div>
      `}).join("");r.innerHTML=C,jt&&b.isValid()&&jt.fitBounds(b,{padding:[40,40],maxZoom:15})}a&&a.addEventListener("click",()=>{if(!navigator.geolocation){Q("Geolocation is not supported by your browser.");return}a.disabled=!0;const f=a.innerHTML;a.innerHTML='<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Locating...',navigator.geolocation.getCurrentPosition(v=>{a.disabled=!1,a.innerHTML=f,u={latitude:v.coords.latitude,longitude:v.coords.longitude},xt("Location detected! Searching nearby records...");const y=Number(o?o.value:10);p(u.latitude,u.longitude,y)},v=>{a.disabled=!1,a.innerHTML=f;let y="Could not access your location.";v.code===1?y="Location permission was denied. Please allow location access in your browser.":v.code===2?y="Location unavailable.":v.code===3&&(y="Location request timed out."),Q(y)},{timeout:1e4,enableHighAccuracy:!0})}),o&&o.addEventListener("change",()=>{u&&p(u.latitude,u.longitude,Number(o.value))})}function ei(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}_t("/",jl);_t("/login",Gl);_t("/signup",Kl);_t("/dashboard",_n);_t("/governance",nu);_t("/modules",eu);_t("/entities",id);_t("/entities/new",Sd);_t("/entities/:id",Ba);_t("/nearby",ir);_t("/protests/nearby",ir);_t("/admin",Rd);_t("/module-builder",Fd);_t("/reports",Xd);_t("/profile",Dd);_t("/director",_n);_t("/coordinator",_n);_t("/workspace",_n);_t("/agent/chat",pu);_t("/meme/studio",Xs);_t("/meme/studio/:issueId",Xs);_t("/buzz",bu);_t("/buzz/:id",zu);xs(()=>{document.getElementById("app").innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `});window.addEventListener("auth:expired",()=>{Ko(()=>Promise.resolve().then(()=>Wl),void 0).then(i=>{i.toastWarning("Your session has expired. Please sign in again.")}),Ko(()=>Promise.resolve().then(()=>Ml),void 0).then(i=>i.navigate("/login"))});const pa=document.getElementById("app");pa&&!pa.innerHTML.trim()&&(pa.innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; gap:16px;">
      <div class="spinner" style="width:36px; height:36px; border-width:3px;"></div>
      <div style="font-size:14px; font-weight:600; color:var(--text-secondary);">Loading CIVIC-KALKI...</div>
    </div>
  `);$l().finally(()=>{_s(),Nl()});
