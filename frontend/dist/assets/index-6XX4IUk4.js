(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const u of d.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function o(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function r(l){if(l.ep)return;l.ep=!0;const d=o(l);fetch(l.href,d)}})();const Ml="modulepreload",Il=function(i){return"/"+i},Go={},Wo=function(a,o,r){let l=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),p=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));l=Promise.allSettled(o.map(m=>{if(m=Il(m),m in Go)return;Go[m]=!0;const f=m.endsWith(".css"),v=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${v}`))return;const y=document.createElement("link");if(y.rel=f?"stylesheet":Ml,f||(y.as="script"),y.crossOrigin="",y.href=m,p&&y.setAttribute("nonce",p),document.head.appendChild(y),f)return new Promise((b,x)=>{y.addEventListener("load",b),y.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${m}`)))})}))}function d(u){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=u,window.dispatchEvent(p),!p.defaultPrevented)throw u}return l.then(u=>{for(const p of u||[])p.status==="rejected"&&d(p.reason);return a().catch(d)})},fs=[];let gs=()=>{};function ke(i,a){fs.push({path:i,handler:a})}function vs(i){gs=i}function Pl(i){const a=[...fs].sort((o,r)=>{const l=o.path.includes(":"),d=r.path.includes(":");return!l&&d?-1:l&&!d?1:0});for(const o of a){const r=[],l=o.path.replace(/:([^/]+)/g,(p,m)=>(r.push(m),"([^/]+)")).replace(/\//g,"\\/"),d=new RegExp(`^${l}$`),u=i.match(d);if(u){const p={};return r.forEach((m,f)=>{p[m]=decodeURIComponent(u[f+1])}),{handler:o.handler,params:p,path:o.path}}}return null}function Q(i){window.history.pushState({},"",i),pa(window.location.href)}function pa(i=window.location.href){const a=new URL(i,window.location.origin);let o=a.pathname;o.length>1&&o.endsWith("/")&&(o=o.slice(0,-1));const r=Pl(o);if(r){const l=r.handler(r.params,a.searchParams);l&&typeof l.then=="function"&&l.then(()=>{window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:o,async:!0}}))}).catch(d=>{console.error("[Router Error]:",d)})}else gs();window.dispatchEvent(new CustomEvent("civic:route-rendered",{detail:{pathname:o}}))}function ys(){window.navigate=Q,window.addEventListener("popstate",()=>pa(window.location.href));const i=document.getElementById("app");i&&i.addEventListener("click",a=>{const o=a.target.closest("a[href]");if(!o)return;const r=o.getAttribute("href");!r||r.startsWith("http")||r.startsWith("mailto:")||r.startsWith("#")||(a.preventDefault(),Q(r))}),pa(window.location.href)}const Al=Object.freeze(Object.defineProperty({__proto__:null,addRoute:ke,initRouter:ys,navigate:Q,onNotFound:vs},Symbol.toStringTag,{value:"Module"}));let Ke=null,at=null,jt=null,wi=null;async function bs(){try{const i=await fetch("/api/auth/me",{credentials:"include",headers:{"X-Requested-With":"ck-web"}});if(!i.ok)return Ke=null,at=null,null;const a=await i.json();return a.success&&a.data?(Ke=a.data.user||null,at=a.data.expires_at||null,xs(),Ke):(Ke=null,at=null,null)}catch{return Ke=null,at=null,null}}function xs(){if(jt&&clearTimeout(jt),!at)return;const i=new Date(at).getTime()-Date.now();i>0&&(jt=setTimeout(()=>{Ke=null,at=null,jt=null},i))}async function Bl(){return wi||(wi=bs().finally(()=>{wi=null}),wi)}function qe(){return Ke}function hn(){return(Ke==null?void 0:Ke.role)||null}function mn(){return Ke?at?new Date(at).getTime()>Date.now():!0:!1}function _s(i){i&&(Ke=i.user||(i.user_id?i:null),at=i.expires_at||null,xs())}function La(){Ke=null,at=null,jt&&(clearTimeout(jt),jt=null)}async function Rl(){return bs()}function ht(i){return mn()?!0:(i("/login"),!1)}function Ca(i,a){if(!ht(a))return!1;const o=hn();return i.includes(o)?!0:(a("/dashboard"),!1)}const Ol={citizen:"Citizen",coordinator_area:"Area Coordinator",coordinator_general:"General Coordinator",director:"Director",admin:"Administrator"};function zi(i){return Ol[i]||i}const ha=[{code:"en",name:"English",nativeName:"English",region:"Pan-India / Official",popular:!0},{code:"hi",name:"Hindi",nativeName:"हिन्दी",region:"North & Central India",popular:!0},{code:"mr",name:"Marathi",nativeName:"मराठी",region:"Maharashtra",popular:!0},{code:"ta",name:"Tamil",nativeName:"தமிழ்",region:"Tamil Nadu & Puducherry",popular:!0},{code:"te",name:"Telugu",nativeName:"తెలుగు",region:"Andhra Pradesh & Telangana",popular:!0},{code:"bn",name:"Bengali",nativeName:"বাংলা",region:"West Bengal & Tripura",popular:!0},{code:"gu",name:"Gujarati",nativeName:"ગુજરાતી",region:"Gujarat",popular:!0},{code:"kn",name:"Kannada",nativeName:"ಕನ್ನಡ",region:"Karnataka",popular:!0},{code:"ml",name:"Malayalam",nativeName:"മലയാളം",region:"Kerala & Lakshadweep",popular:!0},{code:"pa",name:"Punjabi",nativeName:"ਪੰਜਾਬੀ",region:"Punjab",popular:!0},{code:"ur",name:"Urdu",nativeName:"اردو",region:"Pan-India",popular:!0},{code:"as",name:"Assamese",nativeName:"অসমীয়া",region:"Assam"},{code:"bho",name:"Bhojpuri",nativeName:"भोजपुरी",region:"Bihar & Uttar Pradesh"},{code:"doi",name:"Dogri",nativeName:"डोगरी",region:"Jammu & Kashmir"},{code:"gom",name:"Konkani",nativeName:"कोंकणी",region:"Goa & Konkan"},{code:"mai",name:"Maithili",nativeName:"मैथिली",region:"Bihar & Jharkhand"},{code:"mni-Mtei",name:"Meiteilon (Manipuri)",nativeName:"ꯃꯤꯇꯩꯂꯣꯟ",region:"Manipur"},{code:"lus",name:"Mizo",nativeName:"Mizo ṭawng",region:"Mizoram"},{code:"ne",name:"Nepali",nativeName:"नेपाली",region:"Sikkim & West Bengal"},{code:"or",name:"Odia",nativeName:"ଓଡ଼ିଆ",region:"Odisha"},{code:"sa",name:"Sanskrit",nativeName:"संस्कृतम्",region:"Classical Language"},{code:"sd",name:"Sindhi",nativeName:"سنڌي",region:"Sindhi"}],ws="civic_kalki_lang";function ai(){return localStorage.getItem(ws)||"en"}function ks(i){return ha.find(a=>a.code.toLowerCase()===(i||"").toLowerCase())||{code:i||"en",name:"English",nativeName:"English",region:"Official"}}function zs(i){try{const a=localStorage.getItem(`civic_trans_${i}`);return a?JSON.parse(a):{}}catch{return{}}}function jl(i,a){try{const r={...zs(i),...a};localStorage.setItem(`civic_trans_${i}`,JSON.stringify(r))}catch{}}function Ls(){["googtrans","googtrans_opt","__googtrans"].forEach(a=>{document.cookie=`${a}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,window.location.hostname&&(document.cookie=`${a}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`,document.cookie=`${a}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`)}),document.querySelectorAll(".goog-te-banner-frame, iframe.goog-te-banner-frame, #google_translate_element, #goog-gt-tt, .goog-te-balloon-frame").forEach(a=>{try{a.remove()}catch{}}),document.body&&(document.body.style.top="0px",document.body.style.position="static")}function Hl(i){const a=[],o=[],r=[],l=new Set,d=document.createTreeWalker(i,NodeFilter.SHOW_TEXT,{acceptNode(u){if(!u.nodeValue)return NodeFilter.FILTER_REJECT;const p=u.parentElement;if(!p)return NodeFilter.FILTER_REJECT;const m=p.tagName.toLowerCase();if(["script","style","code","pre","textarea"].includes(m)||p.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return NodeFilter.FILTER_REJECT;const f=(u._civicOriginal!==void 0?u._civicOriginal:u.nodeValue).trim();return!f||/^[\d\s\-_.,/\\:;!@#$%^&*()=+~`|<>?"'’]+$/.test(f)||/^#?[A-Za-z]{1,5}-\d+$/.test(f)||/^#\d+$/.test(f)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});for(;d.nextNode();){const u=d.currentNode;u._civicOriginal===void 0&&(u._civicOriginal=u.nodeValue);const p=u._civicOriginal.trim();p&&(a.push({node:u,original:p}),l.add(p))}return i.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(u=>{if(u.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;u._civicOriginalPlaceholder===void 0&&(u._civicOriginalPlaceholder=u.placeholder);const p=(u._civicOriginalPlaceholder||"").trim();p&&!/^[\d\s]+$/.test(p)&&(o.push({element:u,original:p}),l.add(p))}),i.querySelectorAll("[title]").forEach(u=>{if(u.closest(".notranslate, .lang-dropdown-container, .lang-dropdown-menu"))return;u._civicOriginalTitle===void 0&&(u._civicOriginalTitle=u.title);const p=(u._civicOriginalTitle||"").trim();p&&!/^[\d\s]+$/.test(p)&&(r.push({element:u,original:p}),l.add(p))}),{textItems:a,placeholderItems:o,titleItems:r,uniqueStrings:Array.from(l)}}function Nl(i=document.getElementById("app")){if(!i)return;const a=document.createTreeWalker(i,NodeFilter.SHOW_TEXT,null);for(;a.nextNode();){const o=a.currentNode;o._civicOriginal!==void 0&&(o.nodeValue=o._civicOriginal)}i.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(o=>{o._civicOriginalPlaceholder!==void 0&&(o.placeholder=o._civicOriginalPlaceholder)}),i.querySelectorAll("[title]").forEach(o=>{o._civicOriginalTitle!==void 0&&(o.title=o._civicOriginalTitle)})}let ia=!1,na=!1,ma=!1;async function oi(i){const a=i||ai(),o=document.getElementById("app")||document.body;if(!o)return;if(a==="en"){Nl(o);return}const{textItems:r,placeholderItems:l,titleItems:d,uniqueStrings:u}=Hl(o);if(u.length===0)return;const p=zs(a),m=[],f=()=>{ma=!0;try{r.forEach(({node:v,original:y})=>{if(p[y])if(v._civicOriginal&&v._civicOriginal.trim()===y){const b=v._civicOriginal.match(/^\s*/)[0],x=v._civicOriginal.match(/\s*$/)[0];v.nodeValue=b+p[y]+x}else v._civicOriginal&&(v.nodeValue=v._civicOriginal.replace(y,p[y]))}),l.forEach(({element:v,original:y})=>{p[y]&&(v.placeholder=p[y])}),d.forEach(({element:v,original:y})=>{p[y]&&(v.title=p[y])})}finally{setTimeout(()=>{ma=!1},40)}};if(f(),u.forEach(v=>{p[v]||m.push(v)}),m.length!==0){if(ia){na=!0;return}ia=!0;try{const v=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json","X-Requested-With":"ck-web"},body:JSON.stringify({texts:m,targetLang:a})});if(v.ok){const y=await v.json();y&&y.translations&&(jl(a,y.translations),Object.assign(p,y.translations),f())}}catch(v){console.error("[Translation Service Error]:",v)}finally{ia=!1,na&&(na=!1,setTimeout(()=>{oi(a)},50))}}}function Ko(i){const a=(i||"en").trim();localStorage.setItem(ws,a),Ls(),Dl(a),oi(a)}function fn(i={}){const a=i.idPrefix||"topbar",o=ai(),r=ks(o),l=ha.filter(d=>d.popular);return`
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
          ${Qe(r.nativeName||r.name)}
        </span>
        <span class="lang-badge">${Qe(o.toUpperCase().slice(0,5))}</span>
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
                title="${Qe(d.name)} (${Qe(d.region)})"
              >
                ${Qe(d.nativeName)}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="lang-section-label" style="padding: 6px 14px 2px;">Official & Regional Languages</div>

        <!-- Full Scrollable List -->
        <div class="lang-options-scroll" id="${a}-lang-list">
          ${ha.map(d=>{const u=d.code===o;return`
              <div 
                class="lang-option-row ${u?"selected":""}" 
                data-lang="${d.code}" 
                data-name="${Qe(d.name.toLowerCase())}" 
                data-native="${Qe(d.nativeName.toLowerCase())}"
                data-region="${Qe((d.region||"").toLowerCase())}"
                role="button"
                tabindex="0"
              >
                <div class="lang-names-wrap">
                  <span class="lang-native-name">${Qe(d.nativeName)}</span>
                  <span class="lang-english-name">${Qe(d.name)} • <span style="opacity:0.75;">${Qe(d.region)}</span></span>
                </div>
                <div class="lang-code-pill">${Qe(d.code)}</div>
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
  `}function gn(i="topbar"){const a=document.getElementById(`${i}-lang-container`),o=document.getElementById(`${i}-lang-btn`),r=document.getElementById(`${i}-lang-dropdown`),l=document.getElementById(`${i}-lang-search`),d=document.getElementById(`${i}-lang-clear`),u=document.getElementById(`${i}-lang-list`),p=document.getElementById(`${i}-lang-reset`),m=document.getElementById(`${i}-lang-popular-section`);if(!(!a||!o||!r)){if(o.addEventListener("click",f=>{f.stopPropagation();const v=r.classList.contains("show");document.querySelectorAll(".lang-dropdown-menu.show").forEach(y=>{y!==r&&y.classList.remove("show")}),r.classList.toggle("show",!v),o.setAttribute("aria-expanded",String(!v)),!v&&l&&setTimeout(()=>l.focus(),50)}),r.addEventListener("click",f=>{f.stopPropagation();const v=f.target.closest("[data-lang]");if(v){const y=v.getAttribute("data-lang");y&&(r.classList.remove("show"),o.setAttribute("aria-expanded","false"),Ko(y))}}),l&&u){const f=Array.from(u.querySelectorAll(".lang-option-row")),v=()=>{const y=(l.value||"").trim().toLowerCase();d==null||d.classList.toggle("hidden",y.length===0),m&&(m.style.display=y.length>0?"none":"block");let b=0;f.forEach(z=>{const _=z.getAttribute("data-name")||"",P=z.getAttribute("data-native")||"",T=z.getAttribute("data-region")||"",E=(z.getAttribute("data-lang")||"").toLowerCase(),q=!y||_.includes(y)||P.includes(y)||T.includes(y)||E.includes(y);z.style.display=q?"flex":"none",q&&b++});let x=u.querySelector(".lang-no-match");b===0?(x||(x=document.createElement("div"),x.className="lang-no-match",x.textContent="No Indian language found matching your search",u.appendChild(x)),x.style.display="block"):x&&(x.style.display="none")};l.addEventListener("input",v),d&&d.addEventListener("click",y=>{y.stopPropagation(),l.value="",v(),l.focus()})}p&&p.addEventListener("click",f=>{f.stopPropagation(),r.classList.remove("show"),o.setAttribute("aria-expanded","false"),Ko("en")}),document.addEventListener("click",f=>{a.contains(f.target)||(r.classList.remove("show"),o.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",f=>{f.key==="Escape"&&r.classList.contains("show")&&(r.classList.remove("show"),o.setAttribute("aria-expanded","false"),o.focus())})}}function Dl(i){const a=ks(i);document.querySelectorAll(".lang-btn-label").forEach(o=>{o.textContent=a.nativeName||a.name}),document.querySelectorAll(".lang-badge").forEach(o=>{o.textContent=(i||"EN").toUpperCase().slice(0,5)}),document.querySelectorAll(".lang-chip").forEach(o=>{const r=o.getAttribute("data-lang")===i;o.classList.toggle("active",r)}),document.querySelectorAll(".lang-option-row").forEach(o=>{const r=o.getAttribute("data-lang")===i;o.classList.toggle("selected",r);let l=o.querySelector(".lang-check-icon");if(r&&!l){const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("class","lang-check-icon"),d.setAttribute("width","16"),d.setAttribute("height","16"),d.setAttribute("fill","none"),d.setAttribute("stroke","currentColor"),d.setAttribute("viewBox","0 0 24 24"),d.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>',o.appendChild(d)}else!r&&l&&l.remove()})}let aa=null,oa=null;function Fl(){if(aa)return;const i=document.getElementById("app")||document.body;i&&(aa=new MutationObserver(a=>{if(ma)return;const o=ai();if(o==="en")return;let r=!1;for(const l of a){if(l.type==="childList"&&l.addedNodes.length>0){for(const d of l.addedNodes)if(d.nodeType===Node.ELEMENT_NODE){if(d.closest&&d.closest(".notranslate, .lang-dropdown-menu, .lang-dropdown-container"))continue;r=!0;break}}if(r)break}r&&(oa&&clearTimeout(oa),oa=setTimeout(()=>{oi(o)},70))}),aa.observe(i,{childList:!0,subtree:!0}))}function ql(){Ls(),window.civicTranslatePage=a=>oi(a||ai()),Fl();const i=ai();i!=="en"&&setTimeout(()=>{oi(i)},100),window.addEventListener("civic:route-rendered",()=>{const a=ai();a!=="en"&&setTimeout(()=>{oi(a)},60)})}function Qe(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const ve={tool:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',sprout:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',users:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',activity:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',message:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',zap:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',grid:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',workflow:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>',chart:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',shield:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',bot:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/></svg>',tree:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M8 15h8l-2-4h3l-2-4h2L12 2 7 7h2l-2 4h3z"/></svg>',school:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v6a6 3 0 0 0 12 0v-6"/><path d="M22 13v6"/></svg>',water:'<svg class="ck-icon ck-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',clock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',chatLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',botLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M12 2v4"/><path d="M8 2h8"/><path d="M2 13h1"/><path d="M21 13h1"/></svg>',gearLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',checkLarge:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',flame:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',target:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',layers:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',heartHand:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',lock:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',database:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',sparkles:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',toolBox:'<svg class="ck-icon ck-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',heartFill:'<svg class="ck-icon ck-icon-xs" viewBox="0 0 24 24" fill="#ff5a36" stroke="#ff5a36" stroke-width="1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'};function Ul(){const i=mn(),a=document.getElementById("app");a&&(a.innerHTML=`
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
          <span class="ck-float-badge ck-fb-orange">${ve.tool} REPORT</span>
        </div>
        <div class="ck-hero-float ck-float-2" aria-hidden="true">
          <span class="ck-float-badge ck-fb-green">${ve.sprout} INITIATIVE</span>
        </div>
        <div class="ck-hero-float ck-float-3" aria-hidden="true">
          <span class="ck-float-badge ck-fb-blue">${ve.users} VOLUNTEER</span>
        </div>
        <div class="ck-hero-float ck-float-4" aria-hidden="true">
          <span class="ck-float-badge ck-fb-purple">${ve.activity} TRACK</span>
        </div>
        <div class="ck-hero-float ck-float-5" aria-hidden="true">
          <span class="ck-float-badge ck-fb-pink">${ve.message} SPEAK UP</span>
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
              <button class="ck-tab-btn active" data-tab="tab-report">${ve.zap} Report</button>
              <button class="ck-tab-btn" data-tab="tab-organize">${ve.grid} Organize</button>
              <button class="ck-tab-btn" data-tab="tab-execute">${ve.workflow} Execute</button>
              <button class="ck-tab-btn" data-tab="tab-understand">${ve.chart} Understand</button>
              <button class="ck-tab-btn" data-tab="tab-accountable">${ve.shield} Accountable</button>
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
                          <span class="ck-ai-badge">${ve.bot} KALKI AI</span>
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
                          <div class="ck-org-icon-pill">${ve.tree}</div>
                          <div>
                            Tree Plantation Drive
                            <div class="ck-org-meta">42 volunteers • Sector 7</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${ve.school}</div>
                          <div>
                            School Renovation Fund
                            <div class="ck-org-meta">₹2.4L raised • Ward 12</div>
                          </div>
                        </div>
                        <div class="ck-org-card">
                          <div class="ck-org-icon-pill">${ve.water}</div>
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
                        <div class="ck-wf-step active"><span>${ve.clock}</span> Director Approval</div>
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
                <div class="ck-how-icon-box">${ve.chatLarge}</div>
              </div>
              <h3>Tell us what's wrong</h3>
              <p>Type or speak in plain language. Our AI understands civic issues — no bureaucratic forms.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">02</div>
                <div class="ck-how-icon-box">${ve.botLarge}</div>
              </div>
              <h3>AI classifies & routes</h3>
              <p>KALKI AI auto-categorizes, sets priority, and routes to the right department instantly.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">03</div>
                <div class="ck-how-icon-box">${ve.gearLarge}</div>
              </div>
              <h3>Workflows kick in</h3>
              <p>Multi-stage approvals, inspections, and assignments — automated, transparent, and tracked.</p>
            </div>
            <div class="ck-how-card">
              <div class="ck-how-top">
                <div class="ck-how-num">04</div>
                <div class="ck-how-icon-box">${ve.checkLarge}</div>
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
          <div class="ck-section-label">${ve.flame} CIVIC BUZZ</div>
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
                <div class="ck-value-chip">${ve.target} Transparent</div>
                <div class="ck-value-chip">${ve.zap} AI-First</div>
                <div class="ck-value-chip">${ve.layers} No-Code</div>
                <div class="ck-value-chip">${ve.heartHand} Citizen-Centric</div>
                <div class="ck-value-chip">${ve.chart} Data-Driven</div>
                <div class="ck-value-chip">${ve.lock} Accountable</div>
              </div>
            </div>
            <div class="ck-about-visual">
              <div class="ck-about-card-stack">
                <div class="ck-acard ck-acard-1">
                  <div class="ck-acard-icon-box">${ve.database}</div>
                  <div>
                    <div class="ck-acard-text">20+ Database Tables</div>
                    <div class="ck-acard-sub">Powering civic intelligence</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-2">
                  <div class="ck-acard-icon-box">${ve.sparkles}</div>
                  <div>
                    <div class="ck-acard-text">Gemini AI Agent</div>
                    <div class="ck-acard-sub">Understands civic context</div>
                  </div>
                </div>
                <div class="ck-acard ck-acard-3">
                  <div class="ck-acard-icon-box">${ve.toolBox}</div>
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
          <span style="display:inline-flex; align-items:center; gap:6px;">Made with ${ve.heartFill} in India</span>
        </div>
      </footer>
    </div>
  `,gn("home"),Zl())}function Zl(){const i=document.getElementById("ck-home-header");i&&window.addEventListener("scroll",()=>{i.classList.toggle("scrolled",window.scrollY>40)},{passive:!0});const a=document.getElementById("ck-home-burger"),o=document.getElementById("ck-home-nav");a&&o&&a.addEventListener("click",()=>{o.classList.toggle("open"),a.classList.toggle("open")});const r=document.getElementById("ck-feature-tabs");r&&r.addEventListener("click",f=>{const v=f.target.closest(".ck-tab-btn");if(!v)return;const y=v.dataset.tab;r.querySelectorAll(".ck-tab-btn").forEach(x=>x.classList.remove("active")),r.querySelectorAll(".ck-tab-panel").forEach(x=>x.classList.remove("active")),v.classList.add("active");const b=document.getElementById(y);b&&b.classList.add("active")});const l=document.getElementById("ck-faq-list");l&&l.addEventListener("click",f=>{const v=f.target.closest(".ck-faq-q");if(!v)return;const y=v.closest(".ck-faq-item"),b=y.classList.contains("open");l.querySelectorAll(".ck-faq-item").forEach(x=>x.classList.remove("open")),b||y.classList.add("open")});const d=document.getElementById("ck-pupil-l"),u=document.getElementById("ck-pupil-r");d&&u&&document.addEventListener("mousemove",f=>{const v=y=>{const x=y.parentElement.getBoundingClientRect(),z=x.left+x.width/2,_=x.top+x.height/2,P=f.clientX-z,T=f.clientY-_,E=Math.atan2(T,P),q=x.width*.22,H=Math.min(Math.sqrt(P*P+T*T)*.15,q);y.style.transform=`translate(${Math.cos(E)*H}px, ${Math.sin(E)*H}px)`};v(d),v(u)},{passive:!0}),document.querySelectorAll('.ck-home a[href^="#"]').forEach(f=>{f.addEventListener("click",v=>{v.preventDefault();const y=document.querySelector(f.getAttribute("href"));if(y){y.scrollIntoView({behavior:"smooth",block:"start"});const b=document.getElementById("ck-home-nav"),x=document.getElementById("ck-home-burger");b&&b.classList.remove("open"),x&&x.classList.remove("open")}})});const p=f=>{f.forEach(v=>{v.isIntersecting&&v.target.classList.add("ck-visible")})},m=new IntersectionObserver(p,{threshold:.1,rootMargin:"0px 0px -60px 0px"});document.querySelectorAll(".ck-how-card, .ck-buzz-meme, .ck-about-text, .ck-about-visual, .ck-faq-item").forEach(f=>{m.observe(f)})}const Cs="/api";async function N(i,a,o=null,r={}){const d={method:i,headers:{"Content-Type":"application/json","X-Requested-With":"ck-web"},credentials:"include",...r};o!==null&&(d.body=JSON.stringify(o));const u=await fetch(`${Cs}${a}`,d);u.status===401&&(La(),window.dispatchEvent(new CustomEvent("auth:expired")));const p=await u.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!u.ok){const m=new Error(p.error||`HTTP ${u.status}`);throw m.status=u.status,m.data=p,m}return p}const vn={login:(i,a)=>N("POST","/auth/login",{email:i,password:a}),signup:(i,a,o)=>N("POST","/auth/signup",{name:i,email:a,password:o}),changePassword:(i,a)=>N("POST","/auth/change-password",{current_password:i,new_password:a}),me:()=>N("GET","/auth/me"),logout:()=>N("POST","/auth/logout")},Es={listUsers:(i={})=>{const a=new URLSearchParams(i).toString();return N("GET",`/admin/users${a?"?"+a:""}`)},getUser:i=>N("GET",`/admin/users/${i}`),setRole:(i,a,o)=>N("POST",`/admin/users/${i}/role`,{role:a,assignedArea:o})},be={list:(i={})=>{const a=new URLSearchParams(i).toString();return N("GET",`/entities${a?"?"+a:""}`)},listTypes:()=>N("GET","/entities/entity-types"),createType:i=>N("POST","/entities/entity-types",i),createRule:i=>N("POST","/entities/rules",i),get:i=>N("GET",`/entities/${i}`),create:i=>N("POST","/entities",i),update:(i,a)=>N("PUT",`/entities/${i}`,a),softDelete:i=>N("DELETE",`/entities/${i}`),transition:(i,a,o)=>N("POST",`/entities/${i}/transition`,{to_status:a,reason:o}),fireRules:(i,a)=>N("POST",`/entities/${i}/fire-rules`,{eventType:a}),aiAnalysis:i=>N("POST",`/entities/${i}/ai-analysis`),audit:i=>N("GET",`/entities/${i}/audit`),getLineage:i=>N("GET",`/entities/${i}/lineage`),workflow:i=>N("GET",`/entities/${i}/workflow`),nearby:(i,a,o=10)=>N("GET",`/entities/nearby?lat=${encodeURIComponent(i)}&lng=${encodeURIComponent(a)}&radius_km=${encodeURIComponent(o)}`)},Ss={list:i=>N("GET",`/entities/${i}/values`),create:(i,a)=>N("POST",`/entities/${i}/values`,{values:a}),upsert:(i,a)=>N("PUT",`/entities/${i}/values`,{values:a})},Ea={getMetadata:()=>N("GET","/forms/metadata"),schema:i=>N("GET",`/forms/${i}/schema`),create:i=>N("POST","/forms",i),addSection:(i,a)=>N("POST",`/forms/${i}/sections`,a),addSubsection:(i,a)=>N("POST",`/sections/${i}/subsections`,a),addParameter:(i,a)=>N("POST",`/subsections/${i}/parameters`,a)},yn={list:(i={})=>{const a=new URLSearchParams(i).toString();return N("GET",`/reports${a?"?"+a:""}`)},get:i=>N("GET",`/reports/${i}`),create:i=>N("POST","/reports",i),execute:(i,a={})=>{const o=new URLSearchParams(a).toString();return N("GET",`/reports/${i}/execute${o?"?"+o:""}`)}},Vl={validate:i=>N("POST","/module-builder/validate",i),deploy:i=>N("POST","/module-builder/deploy",i)},an={list:(i={})=>{const a=new URLSearchParams(i).toString();return N("GET",`/jurisdictions${a?"?"+a:""}`)},tree:()=>N("GET","/jurisdictions?tree=true"),get:i=>N("GET",`/jurisdictions/${i}`),create:i=>N("POST","/jurisdictions",i),update:(i,a)=>N("PUT",`/jurisdictions/${i}`,a),deactivate:i=>N("DELETE",`/jurisdictions/${i}`)},Gl={getConfig:()=>N("GET","/governance/config"),analyze:i=>N("POST","/governance/analyze",i?{entity_type_id:i}:{})},on={chat:async(i,a,o=null)=>{if(!o)return N("POST","/agent/chat",{sessionId:i,message:a});const r=new FormData;r.append("sessionId",i),r.append("message",a||""),r.append("attachment",o);const l={"X-Requested-With":"ck-web"},d=await fetch(`${Cs}/agent/chat`,{method:"POST",headers:l,credentials:"include",body:r});d.status===401&&(La(),window.dispatchEvent(new CustomEvent("auth:expired")));const u=await d.json().catch(()=>({success:!1,error:"Invalid server response"}));if(!d.ok){const p=new Error(u.error||`HTTP ${d.status}`);throw p.status=d.status,p.data=u,p}return u},clearSession:i=>N("DELETE",`/agent/chat/${i}`).catch(()=>{})},ye={list:(i={})=>{const a=new URLSearchParams(i).toString();return N("GET",`/buzz${a?"?"+a:""}`)},get:i=>N("GET",`/buzz/${i}`),create:i=>N("POST","/buzz",i),update:(i,a)=>N("PATCH",`/buzz/${i}`,a),vote:i=>N("POST",`/buzz/${i}/vote`),follow:i=>N("POST",`/buzz/${i}/follow`),getComments:(i,a={})=>{const o=new URLSearchParams(a).toString();return N("GET",`/buzz/${i}/comments${o?"?"+o:""}`)},addComment:(i,a)=>N("POST",`/buzz/${i}/comments`,{text:a}),logEvent:(i,a)=>N("POST",`/buzz/${i}/event`,{type:a}),getStats:i=>N("GET",`/buzz/${i}/stats`),generateCaptions:i=>N("POST","/buzz/captions",i),uploadImage:i=>N("POST","/buzz/upload-image",{image_data:i}),report:(i,a)=>N("POST",`/buzz/${i}/report`,{reason:a})};let Wl=0;function Pi(i,a="default",o=3500){const r=document.getElementById("toast-container"),l=++Wl,d=document.createElement("div");return d.className=`toast toast-${a}`,d.id=`toast-${l}`,d.innerHTML=`
    <span>${Kl(i)}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:8px;font-size:1rem;line-height:1;opacity:.7">×</button>
  `,r.appendChild(d),setTimeout(()=>{d.remove()},o),l}function Ts(i){return Pi(i,"default")}function xe(i){return Pi(i,"success")}function ie(i){return Pi(i,"error")}function ut(i){return Pi(i,"warning")}function Kl(i){return String(i).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const Jl=Object.freeze(Object.defineProperty({__proto__:null,showToast:Pi,toast:Ts,toastError:ie,toastSuccess:xe,toastWarning:ut},Symbol.toStringTag,{value:"Module"}));function Jo(i,a="/dashboard"){const o=i&&i.get("redirect");return typeof o=="string"&&o.startsWith("/")&&!o.startsWith("//")&&!o.startsWith("/\\")&&!o.includes("://")&&!o.toLowerCase().includes("javascript:")&&!/[\x00-\x1F\x7F]/.test(o)?o:a}function Yl(i,a){if(mn()){Q(Jo(a));return}const o=document.getElementById("app");o.innerHTML=`
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
  `;const r=document.getElementById("password"),l=document.getElementById("toggle-password-btn"),d='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',u='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>';l&&r&&l.addEventListener("click",()=>{const m=r.getAttribute("type")==="password"?"text":"password";r.setAttribute("type",m),l.setAttribute("aria-label",m==="password"?"Show password":"Hide password"),l.innerHTML=m==="password"?d:u});const p=document.getElementById("login-error-alert");document.getElementById("login-form").addEventListener("submit",async m=>{m.preventDefault(),p&&(p.classList.add("hidden"),p.textContent="");const f=document.getElementById("login-btn"),v=document.getElementById("email").value.trim(),y=r.value;if(!v||!y){p&&(p.textContent="Please enter both email address and password.",p.classList.remove("hidden"));return}f.disabled=!0,f.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';try{const b=await vn.login(v,y);_s(b.data),Q(Jo(a))}catch(b){const x=b.message||"Invalid email or password. Please check your credentials.";p&&(p.textContent=x,p.classList.remove("hidden")),ie(x),f.disabled=!1,f.innerHTML="Sign In"}}),gn("login")}function Yo(i,a="/dashboard"){const o=i&&i.get("redirect");return typeof o=="string"&&o.startsWith("/")&&!o.startsWith("//")&&!o.startsWith("/\\")&&!o.includes("://")&&!o.toLowerCase().includes("javascript:")&&!/[\x00-\x1F\x7F]/.test(o)?o:a}function Xl(i,a){if(mn()){Q(Yo(a));return}const o=document.getElementById("app");o.innerHTML=`
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
  `,document.getElementById("signup-form").addEventListener("submit",async r=>{r.preventDefault();const l=document.getElementById("signup-btn"),d=document.getElementById("name").value.trim(),u=document.getElementById("email").value.trim(),p=document.getElementById("password").value;if(!(!d||!u||!p)){l.disabled=!0,l.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';try{const m=await vn.signup(d,u,p);_s(m.data),Q(Yo(a))}catch(m){ie(m.message||"Signup failed"),l.disabled=!1,l.innerHTML="Create Account"}}}),gn("signup")}const fa={initiative:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",grievance:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",park:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",passport:"M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",charter:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",employment:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",volunteer:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",legacy:"M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",feedback:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",survey:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",default:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},$s={"🌱":"initiative","🚨":"grievance","⚠️":"grievance","🪪":"passport","📜":"charter","💼":"employment","🤝":"volunteer","🏛️":"legacy","🏛":"legacy","💬":"feedback","📢":"feedback","📊":"survey","📋":"survey","🌳":"park","🏞️":"park","🏞":"park","🏗️":"legacy","🏗":"legacy","🛡️":"charter","🛡":"charter","⚡":"default","⚡️":"default"};function Ct(i,a=20,o=""){const r=$s[i]||i,l=fa[r]||fa.default;return`<svg width="${a}" height="${a}" class="${o}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${l}"/></svg>`}const Ql={Movement:{title:"Start a Civic Initiative",shortTitle:"Civic Initiative",description:"Organize citizens around community goals, public spaces, and urban projects.",category:"Community Action",iconKey:"initiative",actionLabel:"Start Initiative"},Grievance:{title:"Report a Civic Problem",shortTitle:"Civic Problem",description:"Report infrastructure defects, sanitation issues, or public safety concerns.",category:"Public Services",iconKey:"grievance",actionLabel:"Report Issue"},"Park Renovation Request":{title:"Park Renovation Request",shortTitle:"Park Renovation",description:"Propose public park upgrades, playground repairs, or green space restoration.",category:"Urban Infrastructure",iconKey:"park",actionLabel:"Request Renovation"},"Citizen Passport":{title:"Citizen Passport & Contribution",shortTitle:"Citizen Passport",description:"Track community contributions, volunteer hours, and civic engagement history.",category:"Civic Identity",iconKey:"passport",actionLabel:"Update Passport"},"Digital Civic Constitution":{title:"Civic Charter & Guidelines",shortTitle:"Civic Charter",description:"Establish community guidelines, governance rules, and transparency terms.",category:"Governance",iconKey:"charter",actionLabel:"Draft Charter"},"Employment Exchange":{title:"Civic Skills & Employment",shortTitle:"Employment Exchange",description:"Post and discover civic project roles, community jobs, and skill opportunities.",category:"Opportunity",iconKey:"employment",actionLabel:"Post Role"},"Volunteer Management":{title:"Volunteer Operations",shortTitle:"Volunteer Drive",description:"Coordinate volunteer tasks, register community helpers, and track activities.",category:"Community Action",iconKey:"volunteer",actionLabel:"Register Volunteer"},"Legacy & Continuity":{title:"Project Continuity & Legacy",shortTitle:"Project Continuity",description:"Transition completed initiatives into permanent NGOs, startups, or civic centers.",category:"Governance",iconKey:"legacy",actionLabel:"Plan Continuity"},"Public Feedback":{title:"Public Feedback",shortTitle:"Public Feedback",description:"Collect structured community feedback on civic initiatives and public services.",category:"Civic Operations",iconKey:"feedback",actionLabel:"Submit Feedback"},"Public Survey":{title:"Public Survey",shortTitle:"Public Survey",description:"Run community surveys and opinion polls for civic decision-making.",category:"Civic Operations",iconKey:"survey",actionLabel:"Start Survey"}};function pt(i){var l;if(!i)return{title:"Civic Capability",shortTitle:"Capability",description:"Metadata-driven civic module.",category:"Civic Operations",iconKey:"default",icon:Ct("default",16),iconLarge:Ct("default",24),actionLabel:"Start Action"};const a=i.name||"",o=Ql[a];if(o)return{title:o.title,shortTitle:o.shortTitle,description:i.description||o.description,category:o.category,iconKey:o.iconKey,icon:Ct(o.iconKey,16),iconLarge:Ct(o.iconKey,24),actionLabel:o.actionLabel,rawName:a};const r=i.icon&&$s[i.icon]||(i.icon&&fa[i.icon]?i.icon:null)||"default";return{title:a,shortTitle:a,description:i.description||"Metadata-configured civic capability module.",category:((l=i.domain)==null?void 0:l.domain_name)||"Civic Operations",iconKey:r,icon:Ct(r,16),iconLarge:Ct(r,24),actionLabel:`Start ${a}`,rawName:a}}function Ht(i){if(!i)return"Unknown";switch(i.toLowerCase()){case"draft":return"Draft (Unsubmitted)";case"submitted":return"Submitted (Awaiting Review)";case"coordinator_approved":return"Verified (Pending Approval)";case"verified":return"Verified";case"approved":return"Approved & Active";case"rejected":return"Rejected";case"closed":return"Closed";default:return i.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase())}}function Le(i,a="",o=[]){const r=qe(),l=hn();if(!r)return i;const d=window.location.pathname,u=window.location.search;let p=[],m="CIVIC CAPABILITIES";l==="citizen"?p=[{path:"/dashboard",label:"Home",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/nearby",label:"Explore",icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"},{path:"/entities?type=initiative",label:"Initiatives",icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"},{path:"/buzz",label:"Civic Buzz",icon:"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"},{path:"/entities",label:"My Activity",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/agent/chat?message=I+want+to+understand+a+civic+issue",label:"Help & Learn",icon:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"}]:l==="coordinator_area"||l==="coordinator_general"?(p=[{path:"/dashboard",label:"Operations Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/entities",label:"Cases Queue",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],m="ACTIVE CAPABILITIES"):l==="director"?(p=[{path:"/dashboard",label:"Governance Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/entities",label:"All Operations",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/module-builder",label:"Capability Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"}],m="ACTIVE CAPABILITIES"):(p=[{path:"/dashboard",label:"Civic OS Workspace",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"},{path:"/governance",label:"Governance Intelligence",icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"},{path:"/modules",label:"Modules & Capabilities",icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"},{path:"/module-builder",label:"No-Code Builder",icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"},{path:"/entities",label:"All Cases & Records",icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"},{path:"/reports",label:"Civic Reports",icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},{path:"/admin",label:"User & Role Admin",icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"}],m="CAPABILITY METADATA");const f=b=>b.map(x=>{let z=!1;if(x.path.includes("?")){const[_,P]=x.path.split("?");z=d===_&&u==="?"+P}else z=d===x.path&&!u;return`
    <li class="sidebar-nav-item">
      <a href="${x.path}" class="sidebar-nav-link ${z?"active":""}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${x.icon}"></path></svg>
        ${et(x.label)}
      </a>
    </li>
  `}).join("");let v="";l!=="citizen"&&Array.isArray(o)&&o.length>0&&(v=o.map(b=>{var P;const x=pt(b),z=`/entities?entity_type_id=${b.entity_type_id}`,_=u.includes(`entity_type_id=${b.entity_type_id}`);return`
        <li class="sidebar-nav-item">
          <a href="${z}" class="sidebar-nav-link ${_?"active":""}" style="font-size:14.5px; padding:7px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${Ct(x.iconKey,16)}
            </span>
            <span class="truncate" style="flex:1;">${et(x.shortTitle)}</span>
            ${((P=b._count)==null?void 0:P.entities)!==void 0?`<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${b._count.entities}</span>`:""}
          </a>
        </li>
      `}).join(""));const y=l==="coordinator_area"&&r.assignedArea?`${zi(l)} • ${r.assignedArea}`:zi(l);return`
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>

        ${l==="citizen"?`
          <div class="sidebar-new-request-wrap" style="padding: 10px 14px 4px 14px;">
            <button type="button" class="btn btn-primary ck-sidebar-new-btn" id="sidebar-new-request-btn" style="width:100%; justify-content:center; gap:8px; font-weight:700; font-size:0.95rem; border-radius:10px; background:#ff5a36; border-color:#ff5a36; box-shadow:0 2px 8px rgba(255,90,54,0.3); height:40px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>+ New request</span>
            </button>
          </div>
        `:""}
        
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
            <div class="user-avatar">${et(r.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${et(r.name)}</div>
              <div class="user-role truncate" title="${et(y)}">${et(y)}</div>
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
            <div style="display:flex; align-items:center; gap:var(--space-2); font-size:0.95rem;">
              <a href="/dashboard" style="color:var(--text-muted); text-decoration:none;">Civic OS</a>
              <span style="color:var(--gray-300);">/</span>
              <span style="font-weight:600; color:var(--text-primary);">${et(a)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- Language Selector -->
            ${fn({idPrefix:"topbar"})}

            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${et(r.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.88rem; font-weight:600; color:var(--text-primary);">${et(r.name.split(" ")[0])}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${et(zi(l))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${et(r.name)}</div>
                  <div class="user-dropdown-role">${et(zi(l))}</div>
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
  `}function Ce(){Rl().catch(()=>{}),gn("topbar");const i=document.getElementById("sidebar-new-request-btn");i&&i.addEventListener("click",()=>{if(window.location.pathname==="/dashboard"){const p=document.getElementById("ck-dark-input"),m=document.getElementById("ck-dark-cockpit");m&&m.scrollIntoView({behavior:"smooth",block:"center"}),p&&p.focus()}else Q("/dashboard"),setTimeout(()=>{const p=document.getElementById("ck-dark-input"),m=document.getElementById("ck-dark-cockpit");m&&m.scrollIntoView({behavior:"smooth",block:"center"}),p&&p.focus()},150)});const a=document.getElementById("topbar-user-btn"),o=document.getElementById("user-dropdown-menu");a&&o&&(a.addEventListener("click",p=>{p.stopPropagation(),o.classList.toggle("show")}),document.addEventListener("click",p=>{!o.contains(p.target)&&!a.contains(p.target)&&o.classList.remove("show")}));const r=document.getElementById("dropdown-logout-btn");r&&r.addEventListener("click",async p=>{p.preventDefault();try{await vn.logout()}catch(m){console.warn("Logout warning:",m)}La(),Q("/login")});const l=document.getElementById("sidebar-user-card");l&&l.addEventListener("click",()=>{Q("/profile")});const d=document.getElementById("mobile-menu-btn"),u=document.getElementById("sidebar");d&&u&&d.addEventListener("click",()=>{u.classList.toggle("open")})}function et(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const Ms="ck_user_location",Is="ck_location_dismissed",ec="https://nominatim.openstreetmap.org/reverse";function $i(){try{const i=sessionStorage.getItem(Ms);if(!i)return null;const a=JSON.parse(i);return a&&typeof a.lat=="number"&&typeof a.lng=="number"?a:null}catch{return null}}function tc(i){try{sessionStorage.setItem(Ms,JSON.stringify({...i,timestamp:Date.now()}))}catch{}}function Ps(){return sessionStorage.getItem(Is)==="1"}function ic(){try{sessionStorage.setItem(Is,"1")}catch{}}async function nc(i,a){try{const o=`${ec}?lat=${encodeURIComponent(i)}&lon=${encodeURIComponent(a)}&format=json&zoom=16&addressdetails=1`,r=await fetch(o,{headers:{"User-Agent":"CIVIC-KALKI/1.0 (civic-kalki@example.com)"}});if(!r.ok)throw new Error("Nominatim error");const l=await r.json(),d=l.address||{},u=[d.road||d.pedestrian||d.footway,d.suburb||d.neighbourhood||d.quarter,d.city||d.town||d.village||d.municipality].filter(Boolean);return u.length>0?u.join(", "):l.display_name||`${i.toFixed(4)}, ${a.toFixed(4)}`}catch{return`${i.toFixed(4)}, ${a.toFixed(4)}`}}function As(){return new Promise((i,a)=>{if(!navigator.geolocation){a(new Error("Geolocation not supported by this browser."));return}navigator.geolocation.getCurrentPosition(async o=>{const r=o.coords.latitude,l=o.coords.longitude,d=await nc(r,l),u={lat:r,lng:l,area:d};tc(u),i(u)},o=>{a(o)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})})}function Bs(i){if(!i||typeof i.lat!="number")return"";const a=i.lat>=0?"N":"S",o=i.lng>=0?"E":"W";return`[User location: ${i.area} (${Math.abs(i.lat).toFixed(4)}°${a}, ${Math.abs(i.lng).toFixed(4)}°${o})] `}const B={flame:(i=15,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  `,initiative:(i=15,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  `,awareness:(i=15,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="m3 11 18-5v12L3 13v-2z"/>
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
    </svg>
  `,zap:(i=15,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  `,eye:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,handshake:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.4 1.4"/>
      <path d="m14 14-2.3-2.3a1 1 0 0 0-1.4 0l-4.3 4.3a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0l2.6-2.6"/>
      <path d="m18 11 3-3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-3 3"/>
      <path d="m6 13-3 3a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l3-3"/>
    </svg>
  `,user:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,pin:(i=13,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `,calendar:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  `,alert:(i=15,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `,sparkles:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
    </svg>
  `,smile:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" x2="9.01" y1="9" y2="9"/>
      <line x1="15" x2="15.01" y1="9" y2="9"/>
    </svg>
  `,clipboard:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="M9 12h6"/>
      <path d="M9 16h6"/>
    </svg>
  `,bot:(i=15,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/>
      <path d="M20 14h2"/>
      <path d="M15 13v2"/>
      <path d="M9 13v2"/>
      <path d="M12 2v6"/>
    </svg>
  `,image:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  `,link:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  `,shareDevice:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
    </svg>
  `,draft:(i=16,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
    </svg>
  `,inbox:(i=32,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  `,arrowUp:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `,share:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  `,check:(i=14,a="currentColor")=>`
    <svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ck-svg-icon" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `};function ac(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function bn(i){var d,u,p,m;if(!i||!i.id)return;ye.logEvent(i.id,"share").catch(()=>{});const a=document.getElementById("ck-buzz-share-dialog-root");a&&a.remove();const o=`${window.location.origin}/buzz/${i.id}`,r=document.createElement("div");r.id="ck-buzz-share-dialog-root",r.className="ck-buzz-modal-backdrop",r.innerHTML=`
    <div class="ck-buzz-share-dialog" role="dialog" aria-modal="true">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-flex; align-items:center; color:#ff5a36;">${B.share(20,"#ff5a36")}</span>
          <span style="font-weight:800; font-size:1rem; color:#0f172a;">Share Civic Buzz</span>
        </div>
        <button type="button" class="ck-buzz-close-btn" id="ck-share-close-btn" aria-label="Close">✕</button>
      </div>

      <div style="font-size:0.8rem; color:#64748b; margin-top:-4px;">
        Spread civic accountability to your community and social circles.
      </div>

      <!-- Action 1: Download Image -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-download-btn">
        <span style="display:inline-flex; align-items:center; color:#475569;">${B.image(22,"#475569")}</span>
        <div style="text-align:left;">
          <div>Download Card Image</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">Save high-res PNG to your device</div>
        </div>
      </button>

      <!-- Action 2: Copy Link -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-copy-btn">
        <span style="display:inline-flex; align-items:center; color:#475569;">${B.link(22,"#475569")}</span>
        <div style="text-align:left;">
          <div>Copy Link</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">${ac(o)}</div>
        </div>
      </button>

      <!-- Action 3: Web Share -->
      <button type="button" class="ck-buzz-share-item" id="ck-share-web-btn">
        <span style="display:inline-flex; align-items:center; color:#475569;">${B.shareDevice(22,"#475569")}</span>
        <div style="text-align:left;">
          <div>Web Share</div>
          <div style="font-size:0.72rem; color:#64748b; font-weight:500;">Share to WhatsApp, X, or other apps</div>
        </div>
      </button>
    </div>
  `,document.body.appendChild(r);const l=()=>r.remove();r.addEventListener("click",f=>{f.target===r&&l()}),(d=r.querySelector("#ck-share-close-btn"))==null||d.addEventListener("click",l),(u=r.querySelector("#ck-share-download-btn"))==null||u.addEventListener("click",async()=>{try{ye.logEvent(i.id,"share").catch(()=>{});const f=i.image_url;if(!f){ut("Post does not have an attached rendered image.");return}const y=await(await fetch(f)).blob(),b=URL.createObjectURL(y),x=document.createElement("a");x.href=b,x.download=`civic-buzz-post-${i.id}.png`,document.body.appendChild(x),x.click(),x.remove(),URL.revokeObjectURL(b),xe("Card image downloaded!"),l()}catch{const f=document.createElement("a");f.href=i.image_url,f.target="_blank",f.download=`civic-buzz-post-${i.id}.png`,document.body.appendChild(f),f.click(),f.remove(),xe("Downloading card image..."),l()}}),(p=r.querySelector("#ck-share-copy-btn"))==null||p.addEventListener("click",async()=>{try{ye.logEvent(i.id,"share").catch(()=>{}),await navigator.clipboard.writeText(o),xe("Link copied to clipboard!"),l()}catch{window.prompt("Copy this Civic Buzz link:",o),l()}}),(m=r.querySelector("#ck-share-web-btn"))==null||m.addEventListener("click",async()=>{if(ye.logEvent(i.id,"share").catch(()=>{}),navigator.share)try{await navigator.share({title:`CIVIC BUZZ: ${i.linked_title||"Civic Issue"}`,text:`"${i.caption}" — Check this civic conversation on CIVIC-KALKI:`,url:o}),xe("Shared successfully!"),l()}catch(v){v.name!=="AbortError"&&f()}else{const v=encodeURIComponent(`CIVIC BUZZ: "${i.caption}"
${o}`);window.open(`https://api.whatsapp.com/send?text=${v}`,"_blank"),l()}function f(){navigator.clipboard.writeText(o).then(()=>{xe("Link copied to clipboard!")}),l()}})}function oc(i,a){if(i.match(/^[a-z]+:\/\//i))return i;if(i.match(/^\/\//))return window.location.protocol+i;if(i.match(/^[a-z]+:/i))return i;const o=document.implementation.createHTMLDocument(),r=o.createElement("base"),l=o.createElement("a");return o.head.appendChild(r),o.body.appendChild(l),a&&(r.href=a),l.href=i,l.href}const sc=(()=>{let i=0;const a=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(i+=1,`u${a()}${i}`)})();function St(i){const a=[];for(let o=0,r=i.length;o<r;o++)a.push(i[o]);return a}let Yt=null;function Rs(i={}){return Yt||(i.includeStyleProperties?(Yt=i.includeStyleProperties,Yt):(Yt=St(window.getComputedStyle(document.documentElement)),Yt))}function sn(i,a){const r=(i.ownerDocument.defaultView||window).getComputedStyle(i).getPropertyValue(a);return r?parseFloat(r.replace("px","")):0}function rc(i){const a=sn(i,"border-left-width"),o=sn(i,"border-right-width");return i.clientWidth+a+o}function lc(i){const a=sn(i,"border-top-width"),o=sn(i,"border-bottom-width");return i.clientHeight+a+o}function Os(i,a={}){const o=a.width||rc(i),r=a.height||lc(i);return{width:o,height:r}}function cc(){let i,a;try{a=process}catch{}const o=a&&a.env?a.env.devicePixelRatio:null;return o&&(i=parseInt(o,10),Number.isNaN(i)&&(i=1)),i||window.devicePixelRatio||1}const Ze=16384;function dc(i){(i.width>Ze||i.height>Ze)&&(i.width>Ze&&i.height>Ze?i.width>i.height?(i.height*=Ze/i.width,i.width=Ze):(i.width*=Ze/i.height,i.height=Ze):i.width>Ze?(i.height*=Ze/i.width,i.width=Ze):(i.width*=Ze/i.height,i.height=Ze))}function rn(i){return new Promise((a,o)=>{const r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>a(r))})},r.onerror=o,r.crossOrigin="anonymous",r.decoding="async",r.src=i})}async function uc(i){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(i)).then(encodeURIComponent).then(a=>`data:image/svg+xml;charset=utf-8,${a}`)}async function pc(i,a,o){const r="http://www.w3.org/2000/svg",l=document.createElementNS(r,"svg"),d=document.createElementNS(r,"foreignObject");return l.setAttribute("width",`${a}`),l.setAttribute("height",`${o}`),l.setAttribute("viewBox",`0 0 ${a} ${o}`),d.setAttribute("width","100%"),d.setAttribute("height","100%"),d.setAttribute("x","0"),d.setAttribute("y","0"),d.setAttribute("externalResourcesRequired","true"),l.appendChild(d),d.appendChild(i),uc(l)}const Ue=(i,a)=>{if(i instanceof a)return!0;const o=Object.getPrototypeOf(i);return o===null?!1:o.constructor.name===a.name||Ue(o,a)};function hc(i){const a=i.getPropertyValue("content");return`${i.cssText} content: '${a.replace(/'|"/g,"")}';`}function mc(i,a){return Rs(a).map(o=>{const r=i.getPropertyValue(o),l=i.getPropertyPriority(o);return`${o}: ${r}${l?" !important":""};`}).join(" ")}function fc(i,a,o,r){const l=`.${i}:${a}`,d=o.cssText?hc(o):mc(o,r);return document.createTextNode(`${l}{${d}}`)}function Xo(i,a,o,r){const l=window.getComputedStyle(i,o),d=l.getPropertyValue("content");if(d===""||d==="none")return;const u=sc();try{a.className=`${a.className} ${u}`}catch{return}const p=document.createElement("style");p.appendChild(fc(u,o,l,r)),a.appendChild(p)}function gc(i,a,o){Xo(i,a,":before",o),Xo(i,a,":after",o)}const Qo="application/font-woff",es="image/jpeg",vc={woff:Qo,woff2:Qo,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:es,jpeg:es,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function yc(i){const a=/\.([^./]*?)$/g.exec(i);return a?a[1]:""}function Sa(i){const a=yc(i).toLowerCase();return vc[a]||""}function bc(i){return i.split(/,/)[1]}function ga(i){return i.search(/^(data:)/)!==-1}function xc(i,a){return`data:${a};base64,${i}`}async function js(i,a,o){const r=await fetch(i,a);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);const l=await r.blob();return new Promise((d,u)=>{const p=new FileReader;p.onerror=u,p.onloadend=()=>{try{d(o({res:r,result:p.result}))}catch(m){u(m)}},p.readAsDataURL(l)})}const sa={};function _c(i,a,o){let r=i.replace(/\?.*/,"");return o&&(r=i),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),a?`[${a}]${r}`:r}async function Ta(i,a,o){const r=_c(i,a,o.includeQueryParams);if(sa[r]!=null)return sa[r];o.cacheBust&&(i+=(/\?/.test(i)?"&":"?")+new Date().getTime());let l;try{const d=await js(i,o.fetchRequestInit,({res:u,result:p})=>(a||(a=u.headers.get("Content-Type")||""),bc(p)));l=xc(d,a)}catch(d){l=o.imagePlaceholder||"";let u=`Failed to fetch resource: ${i}`;d&&(u=typeof d=="string"?d:d.message),u&&console.warn(u)}return sa[r]=l,l}async function wc(i){const a=i.toDataURL();return a==="data:,"?i.cloneNode(!1):rn(a)}async function kc(i,a){if(i.currentSrc){const d=document.createElement("canvas"),u=d.getContext("2d");d.width=i.clientWidth,d.height=i.clientHeight,u==null||u.drawImage(i,0,0,d.width,d.height);const p=d.toDataURL();return rn(p)}const o=i.poster,r=Sa(o),l=await Ta(o,r,a);return rn(l)}async function zc(i,a){var o;try{if(!((o=i==null?void 0:i.contentDocument)===null||o===void 0)&&o.body)return await xn(i.contentDocument.body,a,!0)}catch{}return i.cloneNode(!1)}async function Lc(i,a){return Ue(i,HTMLCanvasElement)?wc(i):Ue(i,HTMLVideoElement)?kc(i,a):Ue(i,HTMLIFrameElement)?zc(i,a):i.cloneNode(Hs(i))}const Cc=i=>i.tagName!=null&&i.tagName.toUpperCase()==="SLOT",Hs=i=>i.tagName!=null&&i.tagName.toUpperCase()==="SVG";async function Ec(i,a,o){var r,l;if(Hs(a))return a;let d=[];return Cc(i)&&i.assignedNodes?d=St(i.assignedNodes()):Ue(i,HTMLIFrameElement)&&(!((r=i.contentDocument)===null||r===void 0)&&r.body)?d=St(i.contentDocument.body.childNodes):d=St(((l=i.shadowRoot)!==null&&l!==void 0?l:i).childNodes),d.length===0||Ue(i,HTMLVideoElement)||await d.reduce((u,p)=>u.then(()=>xn(p,o)).then(m=>{m&&a.appendChild(m)}),Promise.resolve()),a}function Sc(i,a,o){const r=a.style;if(!r)return;const l=window.getComputedStyle(i);l.cssText?(r.cssText=l.cssText,r.transformOrigin=l.transformOrigin):Rs(o).forEach(d=>{let u=l.getPropertyValue(d);d==="font-size"&&u.endsWith("px")&&(u=`${Math.floor(parseFloat(u.substring(0,u.length-2)))-.1}px`),Ue(i,HTMLIFrameElement)&&d==="display"&&u==="inline"&&(u="block"),d==="d"&&a.getAttribute("d")&&(u=`path(${a.getAttribute("d")})`),r.setProperty(d,u,l.getPropertyPriority(d))})}function Tc(i,a){Ue(i,HTMLTextAreaElement)&&(a.innerHTML=i.value),Ue(i,HTMLInputElement)&&a.setAttribute("value",i.value)}function $c(i,a){if(Ue(i,HTMLSelectElement)){const o=a,r=Array.from(o.children).find(l=>i.value===l.getAttribute("value"));r&&r.setAttribute("selected","")}}function Mc(i,a,o){return Ue(a,Element)&&(Sc(i,a,o),gc(i,a,o),Tc(i,a),$c(i,a)),a}async function Ic(i,a){const o=i.querySelectorAll?i.querySelectorAll("use"):[];if(o.length===0)return i;const r={};for(let d=0;d<o.length;d++){const p=o[d].getAttribute("xlink:href");if(p){const m=i.querySelector(p),f=document.querySelector(p);!m&&f&&!r[p]&&(r[p]=await xn(f,a,!0))}}const l=Object.values(r);if(l.length){const d="http://www.w3.org/1999/xhtml",u=document.createElementNS(d,"svg");u.setAttribute("xmlns",d),u.style.position="absolute",u.style.width="0",u.style.height="0",u.style.overflow="hidden",u.style.display="none";const p=document.createElementNS(d,"defs");u.appendChild(p);for(let m=0;m<l.length;m++)p.appendChild(l[m]);i.appendChild(u)}return i}async function xn(i,a,o){return!o&&a.filter&&!a.filter(i)?null:Promise.resolve(i).then(r=>Lc(r,a)).then(r=>Ec(i,r,a)).then(r=>Mc(i,r,a)).then(r=>Ic(r,a))}const Ns=/url\((['"]?)([^'"]+?)\1\)/g,Pc=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Ac=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Bc(i){const a=i.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${a})(['"]?\\))`,"g")}function Rc(i){const a=[];return i.replace(Ns,(o,r,l)=>(a.push(l),o)),a.filter(o=>!ga(o))}async function Oc(i,a,o,r,l){try{const d=o?oc(a,o):a,u=Sa(a);let p;return l||(p=await Ta(d,u,r)),i.replace(Bc(a),`$1${p}$3`)}catch{}return i}function jc(i,{preferredFontFormat:a}){return a?i.replace(Ac,o=>{for(;;){const[r,,l]=Pc.exec(o)||[];if(!l)return"";if(l===a)return`src: ${r};`}}):i}function Ds(i){return i.search(Ns)!==-1}async function Fs(i,a,o){if(!Ds(i))return i;const r=jc(i,o);return Rc(r).reduce((d,u)=>d.then(p=>Oc(p,u,a,o)),Promise.resolve(r))}async function Xt(i,a,o){var r;const l=(r=a.style)===null||r===void 0?void 0:r.getPropertyValue(i);if(l){const d=await Fs(l,null,o);return a.style.setProperty(i,d,a.style.getPropertyPriority(i)),!0}return!1}async function Hc(i,a){await Xt("background",i,a)||await Xt("background-image",i,a),await Xt("mask",i,a)||await Xt("-webkit-mask",i,a)||await Xt("mask-image",i,a)||await Xt("-webkit-mask-image",i,a)}async function Nc(i,a){const o=Ue(i,HTMLImageElement);if(!(o&&!ga(i.src))&&!(Ue(i,SVGImageElement)&&!ga(i.href.baseVal)))return;const r=o?i.src:i.href.baseVal,l=await Ta(r,Sa(r),a);await new Promise((d,u)=>{i.onload=d,i.onerror=a.onImageErrorHandler?(...m)=>{try{d(a.onImageErrorHandler(...m))}catch(f){u(f)}}:u;const p=i;p.decode&&(p.decode=d),p.loading==="lazy"&&(p.loading="eager"),o?(i.srcset="",i.src=l):i.href.baseVal=l})}async function Dc(i,a){const r=St(i.childNodes).map(l=>qs(l,a));await Promise.all(r).then(()=>i)}async function qs(i,a){Ue(i,Element)&&(await Hc(i,a),await Nc(i,a),await Dc(i,a))}function Fc(i,a){const{style:o}=i;a.backgroundColor&&(o.backgroundColor=a.backgroundColor),a.width&&(o.width=`${a.width}px`),a.height&&(o.height=`${a.height}px`);const r=a.style;return r!=null&&Object.keys(r).forEach(l=>{o[l]=r[l]}),i}const ts={};async function is(i){let a=ts[i];if(a!=null)return a;const r=await(await fetch(i)).text();return a={url:i,cssText:r},ts[i]=a,a}async function ns(i,a){let o=i.cssText;const r=/url\(["']?([^"')]+)["']?\)/g,d=(o.match(/url\([^)]+\)/g)||[]).map(async u=>{let p=u.replace(r,"$1");return p.startsWith("https://")||(p=new URL(p,i.url).href),js(p,a.fetchRequestInit,({result:m})=>(o=o.replace(u,`url(${m})`),[u,m]))});return Promise.all(d).then(()=>o)}function as(i){if(i==null)return[];const a=[],o=/(\/\*[\s\S]*?\*\/)/gi;let r=i.replace(o,"");const l=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){const m=l.exec(r);if(m===null)break;a.push(m[0])}r=r.replace(l,"");const d=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,u="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",p=new RegExp(u,"gi");for(;;){let m=d.exec(r);if(m===null){if(m=p.exec(r),m===null)break;d.lastIndex=p.lastIndex}else p.lastIndex=d.lastIndex;a.push(m[0])}return a}async function qc(i,a){const o=[],r=[];return i.forEach(l=>{if("cssRules"in l)try{St(l.cssRules||[]).forEach((d,u)=>{if(d.type===CSSRule.IMPORT_RULE){let p=u+1;const m=d.href,f=is(m).then(v=>ns(v,a)).then(v=>as(v).forEach(y=>{try{l.insertRule(y,y.startsWith("@import")?p+=1:l.cssRules.length)}catch(b){console.error("Error inserting rule from remote css",{rule:y,error:b})}})).catch(v=>{console.error("Error loading remote css",v.toString())});r.push(f)}})}catch(d){const u=i.find(p=>p.href==null)||document.styleSheets[0];l.href!=null&&r.push(is(l.href).then(p=>ns(p,a)).then(p=>as(p).forEach(m=>{u.insertRule(m,u.cssRules.length)})).catch(p=>{console.error("Error loading remote stylesheet",p)})),console.error("Error inlining remote css file",d)}}),Promise.all(r).then(()=>(i.forEach(l=>{if("cssRules"in l)try{St(l.cssRules||[]).forEach(d=>{o.push(d)})}catch(d){console.error(`Error while reading CSS rules from ${l.href}`,d)}}),o))}function Uc(i){return i.filter(a=>a.type===CSSRule.FONT_FACE_RULE).filter(a=>Ds(a.style.getPropertyValue("src")))}async function Zc(i,a){if(i.ownerDocument==null)throw new Error("Provided element is not within a Document");const o=St(i.ownerDocument.styleSheets),r=await qc(o,a);return Uc(r)}function Us(i){return i.trim().replace(/["']/g,"")}function Vc(i){const a=new Set;function o(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(d=>{a.add(Us(d))}),Array.from(r.children).forEach(d=>{d instanceof HTMLElement&&o(d)})}return o(i),a}async function Gc(i,a){const o=await Zc(i,a),r=Vc(i);return(await Promise.all(o.filter(d=>r.has(Us(d.style.fontFamily))).map(d=>{const u=d.parentStyleSheet?d.parentStyleSheet.href:null;return Fs(d.cssText,u,a)}))).join(`
`)}async function Wc(i,a){const o=a.fontEmbedCSS!=null?a.fontEmbedCSS:a.skipFonts?null:await Gc(i,a);if(o){const r=document.createElement("style"),l=document.createTextNode(o);r.appendChild(l),i.firstChild?i.insertBefore(r,i.firstChild):i.appendChild(r)}}async function Kc(i,a={}){const{width:o,height:r}=Os(i,a),l=await xn(i,a,!0);return await Wc(l,a),await qs(l,a),Fc(l,a),await pc(l,o,r)}async function Jc(i,a={}){const{width:o,height:r}=Os(i,a),l=await Kc(i,a),d=await rn(l),u=document.createElement("canvas"),p=u.getContext("2d"),m=a.pixelRatio||cc(),f=a.canvasWidth||o,v=a.canvasHeight||r;return u.width=f*m,u.height=v*m,a.skipAutoScale||dc(u),u.style.width=`${f}`,u.style.height=`${v}`,a.backgroundColor&&(p.fillStyle=a.backgroundColor,p.fillRect(0,0,u.width,u.height)),p.drawImage(d,0,0,u.width,u.height),u}async function Yc(i,a={}){return(await Jc(i,a)).toDataURL()}function Ee(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const ln='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%231e293b"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20 L40 20 M20 0 L20 40" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern></defs><rect width="800" height="800" fill="url(%23g)"/><rect width="800" height="800" fill="url(%23p)"/><circle cx="400" cy="400" r="260" fill="none" stroke="rgba(255,90,54,0.15)" stroke-width="3" stroke-dasharray="8 8"/><text x="400" y="415" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="32" fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="4">CIVIC KALKI</text></svg>';function Xc(i=""){const a=String(i).trim();if(!a)return{top:"",bottom:""};if(a.includes(`
`)){const d=a.split(`
`).filter(Boolean);return{top:d[0]||"",bottom:d.slice(1).join(" ")||""}}if(a.includes(" // ")){const[d,...u]=a.split(" // ");return{top:d,bottom:u.join(" // ")}}const o=a.split(new RegExp("(?<=[.?!])\\s+"));if(o.length>=2)return{top:o[0],bottom:o.slice(1).join(" ")};const r=a.split(/\s+/);if(r.length<=4)return{top:"",bottom:a};const l=Math.ceil(r.length/2);return{top:r.slice(0,l).join(" "),bottom:r.slice(l).join(" ")}}function Zs({template:i="meme",style:a="funny",caption:o="",cta_text:r="",issue:l={},imageUrl:d=null}){const u=d||l.image_url||ln,p=l.name||l.title||"Civic Issue",m=l.area||"City Ward",f=l.status||"Active",v=l.entity_id||l.id||"—";i==="initiative"||l.entity_type_id===2||l.type;const y=`
    <div class="ck-card-watermark">
      <span class="ck-wm-flame">${B.flame(14,"#ff5a36")}</span>
      <span class="ck-wm-brand">CIVIC-KALKI</span>
    </div>
  `;if(i==="meme"){const{top:x,bottom:z}=Xc(o),_=r||"Take Civic Action";return`
      <div class="ck-card-canvas ck-template-meme" data-template="meme" data-style="${Ee(a)}">
        <div class="ck-card-bg-layer" style="background-image: url('${Ee(u)}');"></div>
        <div class="ck-card-meme-overlay"></div>
        
        ${y}

        <div class="ck-meme-top-bar">
          <span class="ck-meme-issue-tag" style="display:inline-flex; align-items:center; gap:4px;">${B.pin(12,"currentColor")} ${Ee(m)} · #${Ee(v)}</span>
        </div>

        <div class="ck-meme-text-top">
          ${Ee(x)}
        </div>

        <div class="ck-meme-bottom-wrap">
          <div class="ck-meme-text-bottom">
            ${Ee(z||x?z:o)}
          </div>
          ${_?`<div class="ck-meme-cta-pill" style="display:inline-flex; align-items:center; gap:5px;">${B.zap(12,"#ea580c")} ${Ee(_)}</div>`:""}
        </div>
      </div>
    `}if(i==="awareness"){const x=r||"Demand Immediate Fix";return`
      <div class="ck-card-canvas ck-template-awareness" data-template="awareness" data-style="${Ee(a)}">
        <div class="ck-card-bg-layer" style="background-image: url('${Ee(u)}');"></div>
        <div class="ck-awareness-scrim"></div>

        ${y}

        <!-- Top Header Banner -->
        <div class="ck-awareness-header">
          <div class="ck-awareness-badge">
            <span class="ck-pulse-dot"></span>
            <span>CIVIC AWARENESS BULLETIN</span>
          </div>
          <div class="ck-awareness-id">#${Ee(v)}</div>
        </div>

        <!-- Main Caption Headline -->
        <div class="ck-awareness-headline-box">
          <div class="ck-awareness-title">${Ee(p)}</div>
          <div class="ck-awareness-caption">"${Ee(o)}"</div>
        </div>

        <!-- Fact Strip -->
        <div class="ck-awareness-fact-strip">
          <div class="ck-fact-item">
            <span class="ck-fact-label">LOCATION</span>
            <span class="ck-fact-value" style="display:inline-flex; align-items:center; gap:4px;">${B.pin(12,"#38bdf8")} ${Ee(m)}</span>
          </div>
          <div class="ck-fact-item">
            <span class="ck-fact-label">STATUS</span>
            <span class="ck-fact-value ck-status-${Ee(f).toLowerCase()}">${Ee(f)}</span>
          </div>
          <div class="ck-fact-item">
            <span class="ck-fact-label">JURISDICTION</span>
            <span class="ck-fact-value">Municipal Corp</span>
          </div>
        </div>

        <!-- Call to Action Strip -->
        <div class="ck-awareness-cta-strip">
          <div class="ck-awareness-cta-text" style="display:inline-flex; align-items:center; gap:6px;">
            <span style="display:inline-flex; align-items:center;">${B.awareness(16,"#38bdf8")}</span> ${Ee(x)}
          </div>
          <div class="ck-awareness-cta-btn">ACT NOW →</div>
        </div>
      </div>
    `}const b=r||"Join The Community Action";return`
    <div class="ck-card-canvas ck-template-initiative" data-template="initiative" data-style="${Ee(a)}">
      <div class="ck-card-bg-layer" style="background-image: url('${Ee(u)}');"></div>
      <div class="ck-initiative-scrim"></div>

      ${y}

      <!-- Top Initiative Banner -->
      <div class="ck-initiative-header">
        <div class="ck-initiative-tag" style="display:inline-flex; align-items:center; gap:6px;">
          ${B.initiative(14,"#4ade80")} COMMUNITY INITIATIVE
        </div>
        <span class="ck-initiative-phase">Active Movement</span>
      </div>

      <!-- Main Initiative Callout -->
      <div class="ck-initiative-body">
        <div class="ck-initiative-title">${Ee(p)}</div>
        <div class="ck-initiative-caption">"${Ee(o)}"</div>
      </div>

      <!-- Date & Place Strip -->
      <div class="ck-initiative-strip">
        <div class="ck-init-info-pill">
          <span class="ck-init-icon" style="display:inline-flex; align-items:center;">${B.calendar(16,"#4ade80")}</span>
          <div>
            <div class="ck-init-sub">TIMELINE</div>
            <div class="ck-init-main">This Weekend & Ongoing</div>
          </div>
        </div>
        <div class="ck-init-info-pill">
          <span class="ck-init-icon" style="display:inline-flex; align-items:center;">${B.pin(16,"#4ade80")}</span>
          <div>
            <div class="ck-init-sub">MEETING POINT</div>
            <div class="ck-init-main">${Ee(m)}</div>
          </div>
        </div>
      </div>

      <!-- Prominent "Join" Strip -->
      <div class="ck-initiative-join-strip">
        <div class="ck-join-cta-content">
          <span class="ck-join-badge" style="display:inline-flex; align-items:center; gap:4px;">${B.zap(12,"#15803d")} VOLUNTEER</span>
          <span class="ck-join-text">${Ee(b)}</span>
        </div>
        <button type="button" class="ck-join-action-btn" style="display:inline-flex; align-items:center; gap:6px;">
          <span>Join Now</span> <span style="display:inline-flex; align-items:center;">${B.handshake(14,"#ffffff")}</span>
        </button>
      </div>
    </div>
  `}async function Qc(i){if(!i)throw new Error("DOM node is required for PNG rendering.");return await Yc(i,{quality:.95,pixelRatio:2,skipFonts:!1,cacheBust:!0})}function Se(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function Vs(i,a=null){var E,q,H,ne,pe,he;const o=document.getElementById("ck-buzz-detail-modal-root");o&&o.remove();const r=qe(),l=i.linked_type==="initiative",d=i.image_url||ln,u=document.createElement("div");u.id="ck-buzz-detail-modal-root",u.className="ck-buzz-modal-backdrop",u.innerHTML=`
    <div class="ck-buzz-modal-dialog" role="dialog" aria-modal="true">
      <!-- Modal Header -->
      <div class="ck-buzz-modal-topbar">
        <div class="ck-buzz-modal-title-wrap">
          <span class="ck-buzz-fire-tag">${B.flame(13,"#ea580c")} CIVIC BUZZ</span>
          <span class="ck-buzz-status-pill ${Se(i.linked_status||"submitted")}">
            ${Se(i.linked_status||"Active")}
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
          <img src="${Se(d)}" alt="${Se(i.caption)}" class="ck-buzz-modal-img" onerror="this.src='${ln}'" />
          <div class="ck-buzz-modal-scrim"></div>
          <div class="ck-buzz-modal-meme-caption">
            ${Se(i.caption)}
          </div>
          ${i.cta_text?`<div class="ck-buzz-modal-cta-badge">${B.zap(12,"#ea580c")} ${Se(i.cta_text)}</div>`:""}
          <div class="ck-card-watermark">
            <span class="ck-wm-flame">${B.flame(14,"#ff5a36")}</span>
            <span class="ck-wm-brand">CIVIC-KALKI</span>
          </div>
        </div>

        <!-- Meta and Linked Issue Banner -->
        <div class="ck-buzz-modal-linked-box">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #ff5a36; letter-spacing: 0.05em;">
              Linked ${Se(i.linked_type||"Issue")} #${Se(i.linked_id)}
            </div>
            <div style="font-size: 0.96rem; font-weight: 700; color: #0f172a; margin-top: 2px;" class="ck-truncate">
              ${Se(i.linked_title||i.caption)}
            </div>
            ${i.linked_area?`<div style="font-size: 0.75rem; color: #64748b; display:inline-flex; align-items:center; gap:4px;">${B.pin(13,"#64748b")} ${Se(i.linked_area)}</div>`:""}
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
              ${B.handshake(15,"#15803d")} <span>Join / Volunteer</span>
            </button>
          `:""}

          <button type="button" class="ck-buzz-act-btn" id="ck-modal-report-issue-btn" title="Report or escalate this civic issue via Civic Assistant">
            ${B.alert(14,"#ef4444")} <span>Report Issue</span>
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
  `,document.body.appendChild(u);const p=()=>u.remove();u.addEventListener("click",A=>{A.target===u&&p()}),(E=u.querySelector("#ck-modal-close-btn"))==null||E.addEventListener("click",p);const m=u.querySelector("#ck-modal-upvote-btn"),f=u.querySelector("#ck-modal-vote-count"),v=u.querySelector("#ck-modal-vote-label");m==null||m.addEventListener("click",async()=>{if(!qe()){ut("Please sign in to upvote."),Q("/login");return}try{const A=await ye.vote(i.id);A.voted?(m.classList.add("active"),v.textContent="Upvoted"):(m.classList.remove("active"),v.textContent="Upvote"),f.textContent=A.vote_count,i.has_voted=A.voted,i.vote_count=A.vote_count,typeof a=="function"&&a(i)}catch(A){ie(A.message||"Could not register vote")}});const y=u.querySelector("#ck-modal-follow-btn"),b=u.querySelector("#ck-modal-follow-label");y==null||y.addEventListener("click",async()=>{if(!qe()){ut("Please sign in to follow this conversation."),Q("/login");return}try{const A=await ye.follow(i.id);A.following?(y.classList.add("active"),b.textContent="Following Status",xe("Now following civic issue updates!")):(y.classList.remove("active"),b.textContent="Follow Status",toast("Unfollowed issue updates.")),i.is_following=A.following,typeof a=="function"&&a(i)}catch(A){ie(A.message||"Could not update follow status")}}),(q=u.querySelector("#ck-modal-view-issue-btn"))==null||q.addEventListener("click",()=>{ye.logEvent(i.id,"click_issue").catch(()=>{}),p(),Q(`/entities/${i.linked_id}`)}),(H=u.querySelector("#ck-modal-share-btn"))==null||H.addEventListener("click",()=>{bn(i)}),(ne=u.querySelector("#ck-modal-join-btn"))==null||ne.addEventListener("click",async()=>{try{await ye.logEvent(i.id,"join"),xe("Thank you for volunteering! Opening initiative details..."),setTimeout(()=>{p(),Q(`/entities/${i.linked_id}`)},700)}catch{Q(`/entities/${i.linked_id}`)}}),(pe=u.querySelector("#ck-modal-report-issue-btn"))==null||pe.addEventListener("click",()=>{p(),Q("/dashboard"),setTimeout(()=>{const A=document.getElementById("ck-dark-input");A&&(A.value=`Regarding issue #${i.linked_id} (${i.linked_title||i.caption}): `,A.focus())},200)}),(he=u.querySelector("#ck-modal-report-btn"))==null||he.addEventListener("click",()=>{const A=window.prompt(`Why are you reporting this Civic Buzz post?
(e.g., Offensive language, personal data, misleading claim)`);A&&A.trim()&&ye.report(i.id,A.trim()).then(U=>{xe(U.message||"Report received. Thank you for keeping our community safe.")}).catch(U=>{ie(U.message||"Could not submit report")})});async function x(){const A=u.querySelector("#ck-modal-comments-list"),U=u.querySelector("#ck-modal-comments-count");try{const F=(await ye.getComments(i.id)).data||[];if(U.textContent=`${F.length} comment${F.length===1?"":"s"}`,F.length===0){A.innerHTML=`
          <div style="text-align:center; padding:16px; color:#94a3b8; font-size:0.8rem;">
            No comments yet. Start the conversation!
          </div>
        `;return}A.innerHTML=F.map(ee=>`
        <div class="ck-buzz-comment-item">
          <div class="ck-buzz-comment-meta">
            <span class="ck-buzz-comment-author" style="display:inline-flex; align-items:center; gap:4px;">${B.user(13,"#64748b")} ${Se(ee.author_name)}</span>
            <span class="ck-buzz-comment-time">${new Date(ee.created_at).toLocaleDateString()}</span>
          </div>
          <div class="ck-buzz-comment-text">${Se(ee.text)}</div>
        </div>
      `).join("")}catch{A.innerHTML='<div style="text-align:center; padding:12px; color:#ef4444; font-size:0.75rem;">Failed to load comments</div>'}}const z=u.querySelector("#ck-modal-comment-input"),_=u.querySelector("#ck-modal-comment-send"),P=u.querySelector("#ck-modal-comment-error");async function T(){var U;const A=z.value.trim();if(A){P.style.display="none",_.disabled=!0;try{await ye.addComment(i.id,A),z.value="",xe("Comment posted!"),await x()}catch(K){P.textContent=((U=K.data)==null?void 0:U.message)||K.message||"Failed to submit comment",P.style.display="block"}finally{_.disabled=!1}}}_==null||_.addEventListener("click",T),z==null||z.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),T())}),await x()}async function Mi(i=null,a=null,o=null){const r=document.getElementById("ck-buzz-create-modal-root");r&&r.remove();const l=qe();if(!l){ut("Please sign in to create a Civic Buzz post."),Q("/login");return}let d=[];try{const[E,q]=await Promise.all([be.list({owner_user_id:l.user_id,limit:50}).catch(()=>({data:[]})),be.list({limit:50}).catch(()=>({data:[]}))]),H=new Map;(E.data||[]).forEach(ne=>H.set(ne.entity_id,{...ne,is_mine:!0})),(q.data||[]).forEach(ne=>{H.has(ne.entity_id)||H.set(ne.entity_id,{...ne,is_mine:!1})}),d=Array.from(H.values())}catch{d=[]}let u=o?4:1,p=o?o.template==="initiative"?"promote_initiative":o.template==="awareness"?"awareness_card":"meme_issue":"meme_issue",m=null,f=(o==null?void 0:o.style)||"funny",v=[],y=(o==null?void 0:o.caption)||"",b=(o==null?void 0:o.cta_text)||"",x=null;i?m=d.find(E=>String(E.entity_id)===String(i))||null:o!=null&&o.linked_id&&(m=d.find(E=>String(E.entity_id)===String(o.linked_id))||null),!m&&d.length>0&&(m=d[0]);function z(){return p==="promote_initiative"?{template:"initiative",linked_type:"initiative"}:p==="awareness_card"?{template:"awareness",linked_type:"issue"}:p==="share_issue"?{template:"awareness",linked_type:"issue"}:{template:"meme",linked_type:"issue"}}const _=document.createElement("div");_.id="ck-buzz-create-modal-root",_.className="ck-buzz-modal-backdrop",document.body.appendChild(_);const P=()=>_.remove();_.addEventListener("click",E=>{E.target===_&&P()});async function T(){var pe,he,A,U,K,F,ee,Z;const{template:E,linked_type:q}=z();_.innerHTML=`
      <div class="ck-buzz-modal-dialog" role="dialog" aria-modal="true" style="max-width: 620px; border-radius: 20px;">
        <!-- Top bar with Title & Close -->
        <div class="ck-buzz-modal-topbar" style="padding: 16px 22px;">
          <div class="ck-buzz-modal-title-wrap">
            <span style="display:inline-flex; align-items:center; color:#ff5a36;">${B.sparkles(20,"#ff5a36")}</span>
            <span style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">
              ${o?"Edit Civic Buzz Post":"Create Civic Buzz Post"}
            </span>
          </div>
          <button type="button" class="ck-buzz-close-btn" id="ck-wiz-close-btn" aria-label="Close modal">✕</button>
        </div>

        <!-- 5-Step Progress Tracker -->
        <div class="ck-wizard-step-tracker">
          <div class="ck-wizard-step-node ${u===1?"active":u>1?"completed":""}">
            <div class="ck-wizard-step-badge">${u>1?B.check(13,"#ffffff"):"1"}</div>
            <span>Type</span>
          </div>
          <div class="ck-wizard-step-line ${u>1?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===2?"active":u>2?"completed":""}">
            <div class="ck-wizard-step-badge">${u>2?B.check(13,"#ffffff"):"2"}</div>
            <span>Issue</span>
          </div>
          <div class="ck-wizard-step-line ${u>2?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===3?"active":u>3?"completed":""}">
            <div class="ck-wizard-step-badge">${u>3?B.check(13,"#ffffff"):"3"}</div>
            <span>Style</span>
          </div>
          <div class="ck-wizard-step-line ${u>3?"completed":""}"></div>

          <div class="ck-wizard-step-node ${u===4?"active":u>4?"completed":""}">
            <div class="ck-wizard-step-badge">${u>4?B.check(13,"#ffffff"):"4"}</div>
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
              <button type="button" class="btn btn-primary" id="ck-wiz-publish-btn" style="border-radius:999px; font-weight:800; padding:10px 22px; background:linear-gradient(135deg, #ff5a36, #ea580c); display:inline-flex; align-items:center; gap:6px;">
                <span>Publish to Civic Buzz</span> ${B.flame(16,"#ffffff")}
              </button>
            `:`
              <button type="button" class="btn btn-primary" id="ck-wiz-next-btn" style="border-radius:999px; font-weight:700; padding:10px 24px;">
                Continue →
              </button>
            `}
          </div>
        </div>
      </div>
    `,(pe=_.querySelector("#ck-wiz-close-btn"))==null||pe.addEventListener("click",P),(he=_.querySelector("#ck-wiz-prev-btn"))==null||he.addEventListener("click",()=>{u>1&&(u--,T())});const H=_.querySelector("#ck-wiz-step-content");if(u===1){H.innerHTML=`
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
              <span style="display:flex; align-items:center; color:#ea580c;">${B.flame(24,"#ea580c")}</span>
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
              <span style="display:flex; align-items:center; color:#0284c7;">${B.awareness(24,"#0284c7")}</span>
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
              <span style="display:flex; align-items:center; color:#16a34a;">${B.initiative(24,"#16a34a")}</span>
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
              <span style="display:flex; align-items:center; color:#eab308;">${B.zap(24,"#eab308")}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Civic Case</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Share an existing issue</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Turn an open CIVIC-KALKI complaint into a viral public post to accelerate official ward response.
            </div>
          </div>
        </div>
      `,H.querySelectorAll(".ck-wizard-type-card").forEach($=>{$.addEventListener("click",()=>{p=$.getAttribute("data-type"),H.querySelectorAll(".ck-wizard-type-card").forEach(C=>C.classList.remove("active")),$.classList.add("active")})}),(A=_.querySelector("#ck-wiz-next-btn"))==null||A.addEventListener("click",()=>{u=2,T()});return}if(u===2){let J=function(O=""){const _e=O.toLowerCase().trim(),R=d.filter(V=>{if(!_e)return!0;const re=(V.name||"").toLowerCase().includes(_e),ce=(V.area||"").toLowerCase().includes(_e),ae=String(V.entity_id).includes(_e);return re||ce||ae});if(R.length===0){C.innerHTML="",D.style.display="block";return}D.style.display="none",C.innerHTML=R.map(V=>{const re=m&&m.entity_id===V.entity_id;return V.entity_type_id===1||V.entity_type_id,`
            <div class="ck-wizard-entity-card ${re?"active":""}" data-id="${V.entity_id}" style="
              border: 1.5px solid ${re?"#ff5a36":"#e2e8f0"};
              background: ${re?"#fff7ed":"#ffffff"};
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
                  <span style="font-size:0.7rem; font-weight:800; color:#ff5a36;">#${V.entity_id}</span>
                  <span class="badge badge-secondary" style="font-size:0.65rem;">${V.is_mine?"My Item":"Community"}</span>
                  <span class="ck-buzz-status-pill ${Se(V.status||"submitted")}" style="font-size:0.65rem; padding:1px 6px;">
                    ${Se(V.status||"Active")}
                  </span>
                </div>
                <div style="font-weight:700; font-size:0.88rem; color:#0f172a; margin-top:2px;" class="ck-truncate">
                  ${Se(V.name)}
                </div>
                ${V.area?`<div style="font-size:0.75rem; color:#64748b; display:inline-flex; align-items:center; gap:4px;">${B.pin(12,"#64748b")} ${Se(V.area)}</div>`:""}
              </div>
              <div style="display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; ${re?"background:#ff5a36; color:#ffffff;":"border:1.5px solid #cbd5e1; color:transparent;"}">
                ${re?B.check(13,"#ffffff"):""}
              </div>
            </div>
          `}).join(""),C.querySelectorAll(".ck-wizard-entity-card").forEach(V=>{V.addEventListener("click",()=>{const re=Number(V.getAttribute("data-id"));m=d.find(ce=>ce.entity_id===re)||null,J($.value)})})};var ne=J;H.innerHTML=`
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
      `;const $=H.querySelector("#ck-wiz-entity-search"),C=H.querySelector("#ck-wiz-entity-list"),D=H.querySelector("#ck-wiz-entity-empty");J(),$.addEventListener("input",O=>J(O.target.value)),(U=_.querySelector("#ck-wiz-next-btn"))==null||U.addEventListener("click",()=>{if(!m){ut("Please select an issue or initiative to link.");return}u=3,T()});return}if(u===3){H.innerHTML=`
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
              <span style="display:flex; align-items:center; color:#ea580c;">${B.smile(24,"#ea580c")}</span>
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
              <span style="display:flex; align-items:center; color:#0284c7;">${B.clipboard(24,"#0284c7")}</span>
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
              <span style="display:flex; align-items:center; color:#16a34a;">${B.handshake(24,"#16a34a")}</span>
              <span class="badge badge-secondary" style="font-size:0.65rem;">Community Pride</span>
            </div>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Emotional-community-focused</div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Heartfelt, neighborhood solidarity calling on citizens to protect senior citizens, children, and our parks.
            </div>
          </div>
        </div>
      `,H.querySelectorAll(".ck-wizard-type-card").forEach($=>{$.addEventListener("click",()=>{f=$.getAttribute("data-style"),H.querySelectorAll(".ck-wizard-type-card").forEach(C=>C.classList.remove("active")),$.classList.add("active")})}),(K=_.querySelector("#ck-wiz-next-btn"))==null||K.addEventListener("click",()=>{u=4,T()});return}if(u===4){H.innerHTML=`
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
            <span style="display:inline-flex; align-items:center;">${B.bot(15,"#475569")}</span> Regenerate Captions
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
          >${Se(y)}</textarea>
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
            value="${Se(b)}"
            style="width:100%; font-size:0.86rem; padding:8px 12px; border-radius:10px;"
            maxlength="60"
          />
        </div>
      `;const $=H.querySelector("#ck-wiz-ai-loading"),C=H.querySelector("#ck-wiz-caption-cards"),D=H.querySelector("#ck-wiz-regen-btn"),J=H.querySelector("#ck-wiz-caption-input"),O=H.querySelector("#ck-wiz-cta-input");async function _e(){$.style.display="block",C.style.display="none";try{const R=await ye.generateCaptions({linked_id:m.entity_id,linked_type:q,template:E,style:f});if(v=R.captions||[],$.style.display="none",C.style.display="flex",v.length===0){C.innerHTML=`<div style="font-size:0.8rem; color:#ef4444; padding:8px;">${Se(R.reason||"Could not generate AI captions. You can type your own below.")}</div>`;return}C.innerHTML=v.map((V,re)=>`
            <div class="ck-wiz-caption-opt" data-idx="${re}" style="
              border: 1.5px solid #e2e8f0;
              background: #f8fafc;
              border-radius: 10px;
              padding: 10px 14px;
              cursor: pointer;
              transition: all 0.15s;
            ">
              <div style="font-weight:700; color:#0f172a; font-size:0.88rem;">"${Se(V.caption)}"</div>
              <div style="font-size:0.72rem; font-weight:700; color:#ff5a36; margin-top:3px;">
                CTA: ${Se(V.cta_text||"Take Action")}
              </div>
            </div>
          `).join(""),!J.value&&v[0]&&(J.value=v[0].caption,O.value=v[0].cta_text||"",y=J.value,b=O.value),C.querySelectorAll(".ck-wiz-caption-opt").forEach(V=>{V.addEventListener("click",()=>{const re=Number(V.getAttribute("data-idx")),ce=v[re];ce&&(J.value=ce.caption,O.value=ce.cta_text||"",y=ce.caption,b=ce.cta_text||"",xe("Caption applied! You can customize it freely."))})})}catch(R){$.style.display="none",C.style.display="flex",C.innerHTML=`<div style="font-size:0.8rem; color:#ef4444; padding:8px;">Failed to generate AI captions: ${Se(R.message)}. Please enter your caption below.</div>`}}D==null||D.addEventListener("click",_e),J.addEventListener("input",()=>{y=J.value}),O.addEventListener("input",()=>{b=O.value}),v.length===0?_e():($.style.display="none",C.style.display="flex"),(F=_.querySelector("#ck-wiz-next-btn"))==null||F.addEventListener("click",()=>{if(y=J.value.trim(),b=O.value.trim(),!y){ut("Please enter or select a caption.");return}u=5,T()});return}if(u===5){H.innerHTML=`
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 4px;">
            Step 5: Preview & Publish
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
            The card has been rendered to PNG using the ${E.toUpperCase()} template.
          </p>
        </div>

        <!-- Render Target (Hidden DOM element converted by html-to-image) -->
        <div id="ck-wiz-render-mount" style="position:fixed; left:-9999px; top:-9999px; width:600px; height:600px; pointer-events:none;">
          ${Zs({template:E,style:f,caption:y,cta_text:b,issue:m})}
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
      `;const $=H.querySelector("#ck-wiz-render-mount .ck-card-canvas"),C=H.querySelector("#ck-wiz-preview-loading"),D=H.querySelector("#ck-wiz-preview-box"),J=H.querySelector("#ck-wiz-preview-img"),O=H.querySelector("#ck-wiz-safety-alert");try{x=await Qc($),J.src=x,C.style.display="none",D.style.display="flex"}catch(R){console.error("html-to-image render error:",R),C.innerHTML='<div style="color:#fca5a5; font-size:0.8rem;">Preview generated via HTML/CSS layout</div>',D.innerHTML=$.outerHTML,D.style.display="flex"}async function _e(R){var ce;O.style.display="none";const V=_.querySelector("#ck-wiz-publish-btn"),re=_.querySelector("#ck-wiz-draft-btn");V.disabled=!0,re.disabled=!0,R==="published"?V.textContent="Verifying Safety...":re.textContent="Saving...";try{let ae=null;if(x)try{ae=(await ye.uploadImage(x)).image_url}catch(Y){console.warn("Could not store PNG file, saving data URL fallback:",Y),ae=x}const de={linked_type:q,linked_id:Number(m.entity_id),template:E,style:f,caption:y,cta_text:b||null,image_url:ae,status:R};o&&o.id?await ye.update(o.id,de):await ye.create(de),xe(R==="published"?"Civic Buzz post published to community!":"Draft saved under My Civic Activity!"),P(),typeof a=="function"&&a()}catch(ae){O.textContent=((ce=ae.data)==null?void 0:ce.message)||ae.message||"Submission failed. Please revise.",O.style.display="block"}finally{V.disabled=!1,re.disabled=!1,V.innerHTML=`<span>Publish to Civic Buzz</span> ${B.flame(16,"#ffffff")}`,re.textContent="Save as Draft"}}(ee=_.querySelector("#ck-wiz-publish-btn"))==null||ee.addEventListener("click",()=>_e("published")),(Z=_.querySelector("#ck-wiz-draft-btn"))==null||Z.addEventListener("click",()=>_e("draft"))}}await T()}function kt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const os='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CIVIC BUZZ</text><text x="50%" y="56%" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="15" fill="%23fdba74" text-anchor="middle">YOUTH-POWERED CIVIC CONVERSATION</text></svg>';function ed(){return`
    <div class="ck-rx-sidebar-panel ck-buzz-carousel-panel" id="ck-buzz-carousel-container">
      <!-- Carousel Header (Clickable to open full-page gallery) -->
      <div class="ck-buzz-header-row" id="ck-buzz-header-click" title="Open Civic Buzz Gallery" style="cursor: pointer;">
        <div>
          <div class="ck-buzz-brand-title">
            <span>CIVIC BUZZ</span>
            <span class="ck-buzz-flame" style="display:inline-flex; align-items:center;">${B.flame(15,"#ff5a36")}</span>
          </div>
          <div class="ck-buzz-brand-sub">Youth-powered civic conversations</div>
        </div>
      </div>

      <!-- Viewport & Track (1 card at a time, no duplicate overlay arrows) -->
      <div class="ck-buzz-viewport" id="ck-buzz-viewport">
        <div class="ck-buzz-track" id="ck-buzz-track">
          <!-- Loading State -->
          <div class="ck-buzz-loading-box">
            <div class="spinner" style="width: 22px; height: 22px; margin-bottom: 8px;"></div>
            <span>Loading youth civic buzz...</span>
          </div>
        </div>
      </div>

      <!-- Single Control Set: Dot Indicators + One Pause Button & See All Link -->
      <div class="ck-buzz-footer-row" style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="ck-buzz-dots" id="ck-buzz-dots"></div>
          <button type="button" class="ck-buzz-pause-btn" id="ck-buzz-pause-btn" title="Pause auto-rotate" aria-label="Pause auto-rotate">
            <svg class="ck-buzz-pause-icon" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
            <svg class="ck-buzz-play-icon" style="display:none;" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          </button>
        </div>
        <a href="/buzz" class="ck-buzz-gallery-link" id="ck-buzz-explore-link">
          See all →
        </a>
      </div>
    </div>
  `}async function Gs(){var P;const i=document.getElementById("ck-buzz-carousel-container"),a=document.getElementById("ck-buzz-track"),o=document.getElementById("ck-buzz-dots"),r=document.getElementById("ck-buzz-pause-btn"),l=document.getElementById("ck-buzz-header-click");if(!i||!a)return;l==null||l.addEventListener("click",()=>{Q("/buzz")});let d=[],u=0,p=null,m=!1;const f=new Set;try{d=(await ye.list({limit:8,sort:"trending"})).data||[]}catch{a.innerHTML=`
      <div style="padding: 16px; text-align: center; color: #ef4444; font-size: 0.78rem;">
        Failed to load Civic Buzz
      </div>
    `;return}if(d.length===0){a.innerHTML=`
      <div class="ck-buzz-empty-card">
        <div style="display:flex; justify-content:center; color:#10b981; margin-bottom: 6px;">${B.initiative(28)}</div>
        <div style="font-weight: 700; font-size: 0.86rem; color: #0f172a;">No Civic Buzz yet</div>
        <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 10px;">
          Be the first to turn a real civic problem into a viral conversation!
        </p>
        <button type="button" id="ck-buzz-first-create-btn" class="btn btn-primary btn-sm" style="border-radius: 999px; font-weight: 700; font-size: 0.76rem;">
          + Create First Post
        </button>
      </div>
    `,(P=document.getElementById("ck-buzz-first-create-btn"))==null||P.addEventListener("click",()=>{Mi(null,()=>Gs())});return}a.innerHTML=d.map((T,E)=>{const q=T.image_url||os,H=T.linked_title||T.caption,ne=T.linked_area||"",pe=T.views_count||0,he=T.vote_count||0,A=T.shares_count||0,U=T.joins_count||0,K=T.template==="initiative"||T.linked_type==="initiative",F=[];ne&&F.push(kt(ne)),pe>0&&F.push(`${pe} views`),K&&U>0?F.push(`${U} joined`):he>0&&F.push(`${he} upvote${he>1?"s":""}`),A>0&&F.push(`${A} share${A>1?"s":""}`);const ee=F.join(" · ");return`
      <div class="ck-buzz-slide" data-index="${E}" data-post-id="${T.id}" data-linked-id="${T.linked_id||""}" style="cursor: pointer;" title="View ${kt(H)}">
        <!-- Image Card with Bold Meme-style Clamped Caption Overlay & Floating Small Share Button -->
        <div class="ck-buzz-img-box" style="position: relative;">
          <img src="${kt(q)}" alt="${kt(T.caption)}" class="ck-buzz-img" onerror="this.src='${os}'" />
          <div class="ck-buzz-scrim"></div>
          
          <!-- Small Floating Share Button in top-right -->
          <button type="button" class="ck-buzz-share-floating" data-action="share-post" data-post-id="${T.id}" data-caption="${kt(T.caption)}" title="Share" aria-label="Share">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>

          <!-- Clamped Caption inside Card -->
          <div class="ck-buzz-meme-caption" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis;">
            ${kt(T.caption)}
          </div>

          <div class="ck-buzz-badge-row">
            <span class="ck-buzz-pill-tag">
              ${K?`<span style="display:inline-flex; align-items:center; gap:4px;">${B.initiative(11)} INITIATIVE</span>`:T.template==="awareness"?`<span style="display:inline-flex; align-items:center; gap:4px;">${B.awareness(11)} AWARENESS</span>`:`<span style="display:inline-flex; align-items:center; gap:4px;">${B.flame(11)} MEME</span>`}
            </span>
          </div>
        </div>

        <!-- Issue Title & Stats & Action Buttons -->
        <div class="ck-buzz-meta-box">
          <div class="ck-buzz-issue-title" title="${kt(H)}">
            ${kt(H)}
          </div>
          <div style="font-size:0.84rem; color:#64748b; margin-top:3px; font-weight:500;" class="ck-truncate">
            ${ee||"Civic Buzz"}
          </div>
          <div class="ck-buzz-actions-row" style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
              <button type="button" class="btn btn-secondary btn-sm ck-buzz-action-btn" data-action="upvote-post" data-post-id="${T.id}" style="font-size:0.82rem; font-weight:600; padding:5px 12px; border-radius:6px; display:inline-flex; align-items:center; gap:4px; height:30px; background:#f8fafc; border:1px solid #e2e8f0; color:#334155; cursor:pointer; white-space:nowrap;">
                <span>↑</span> Upvote
              </button>
              <button type="button" class="btn btn-secondary btn-sm ck-buzz-action-btn" data-action="follow-post" data-post-id="${T.id}" style="font-size:0.82rem; font-weight:600; padding:5px 12px; border-radius:6px; display:inline-flex; align-items:center; gap:4px; height:30px; background:#f8fafc; border:1px solid #e2e8f0; color:#334155; cursor:pointer; white-space:nowrap;">
                <span>+</span> Follow
              </button>
            </div>
            <a href="${T.linked_id?`/entities/${T.linked_id}`:`/buzz/${T.id}`}" class="ck-buzz-view-issue-link" data-action="view-issue" style="font-size:0.85rem; color:#ff5a36; font-weight:700; text-decoration:none; white-space:nowrap; flex-shrink:0;">
              View issue →
            </a>
          </div>
        </div>
      </div>
    `}).join(""),o.innerHTML=d.map((T,E)=>`
    <span class="ck-buzz-dot ${E===0?"active":""}" data-dot-index="${E}"></span>
  `).join("");function v(T){if(d.length===0)return;u=(T+d.length)%d.length,a.style.transform=`translateX(-${u*100}%)`,i.querySelectorAll(".ck-buzz-dot").forEach((q,H)=>{q.classList.toggle("active",H===u)});const E=d[u];E&&!f.has(E.id)&&(f.add(E.id),ye.logEvent(E.id,"view").catch(()=>{}))}v(0),o.addEventListener("click",T=>{const E=T.target.closest(".ck-buzz-dot");if(!E)return;const q=parseInt(E.getAttribute("data-dot-index"),10);isNaN(q)||v(q)}),r==null||r.addEventListener("click",T=>{T.stopPropagation(),m=!m;const E=r.querySelector(".ck-buzz-pause-icon"),q=r.querySelector(".ck-buzz-play-icon");m?(b(),r.classList.add("paused"),r.title="Play auto-rotate",E&&(E.style.display="none"),q&&(q.style.display="inline-block")):(y(),r.classList.remove("paused"),r.title="Pause auto-rotate",E&&(E.style.display="inline-block"),q&&(q.style.display="none"))});function y(){b(),!m&&(p=setInterval(()=>{v(u+1)},1800))}function b(){p&&(clearInterval(p),p=null)}y(),i.addEventListener("mouseenter",()=>{m||b()}),i.addEventListener("mouseleave",()=>{m||y()});let x=0,z=!1;const _=document.getElementById("ck-buzz-viewport");_==null||_.addEventListener("touchstart",T=>{b(),x=T.touches[0].clientX},{passive:!0}),_==null||_.addEventListener("touchend",T=>{const E=T.changedTouches[0].clientX-x;Math.abs(E)>35&&(E>0?v(u-1):v(u+1)),m||y()},{passive:!0}),_==null||_.addEventListener("mousedown",T=>{z=!0,x=T.clientX,b()}),window.addEventListener("mouseup",T=>{if(!z)return;z=!1;const E=T.clientX-x;Math.abs(E)>40&&(E>0?v(u-1):v(u+1)),m||y()}),a.addEventListener("click",T=>{var he,A;const E=T.target.closest('[data-action="share-post"]');if(E){T.stopPropagation();const U=Number(E.getAttribute("data-post-id")),K=d.find(F=>F.id===U)||{id:U,caption:E.getAttribute("data-caption")||"Civic Buzz",image_url:(A=(he=E.closest(".ck-buzz-slide"))==null?void 0:he.querySelector("img"))==null?void 0:A.src};bn(K);return}const q=T.target.closest('[data-action="upvote-post"]');if(q){T.stopPropagation();const U=Number(q.getAttribute("data-post-id"));ye.vote(U).then(()=>{xe("Upvoted civic buzz!"),q.innerHTML="<span>✓</span> Upvoted",q.style.color="#ff5a36"}).catch(()=>Ts("You already supported this post."));return}const H=T.target.closest('[data-action="follow-post"]');if(H){T.stopPropagation(),xe("Following updates on this issue!"),H.innerHTML="<span>✓</span> Following",H.style.color="#10b981";return}const ne=T.target.closest('[data-action="view-issue"]');if(ne){T.stopPropagation(),T.preventDefault();const U=ne.getAttribute("href");U&&Q(U);return}const pe=T.target.closest(".ck-buzz-slide");if(pe){const U=pe.getAttribute("data-linked-id"),K=pe.getAttribute("data-post-id");K&&ye.logEvent(Number(K),"click_issue").catch(()=>{}),Q(U&&U!==""&&U!=="null"&&U!=="undefined"?`/entities/${U}`:K?`/buzz/${K}`:"/buzz")}})}function fe(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const At={mic:'<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>',checkCircle:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',road:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M20 19L16 5"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="14"/><line x1="12" y1="18" x2="12" y2="20"/></svg>',trash:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',zap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',leaf:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 2-5.5 3.5-9 3.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',mapPin:'<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'};function td(i){let a=((i==null?void 0:i.area)||"").trim();return!a||a.toLowerCase()==="unassigned"||a.toLowerCase()==="test"?"Ward 14 · Shivajinagar":a}function id(){return`
    <div class="ck-rx-layout" aria-busy="true" aria-label="Loading dashboard">
      <main class="ck-rx-main">
        <!-- Greeting Skeleton -->
        <div style="margin-bottom:20px;">
          <div class="ck-skeleton-shimmer" style="width:220px; height:28px; margin-bottom:6px; border-radius:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:280px; height:14px; border-radius:4px;"></div>
        </div>

        <!-- Hero Shimmer Card -->
        <div class="ck-agent-dark-card" style="min-height: 220px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="ck-skeleton-shimmer" style="width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,0.12);"></div>
              <div>
                <div class="ck-skeleton-shimmer" style="width:140px; height:18px; margin-bottom:6px; background:rgba(255,255,255,0.18);"></div>
                <div class="ck-skeleton-shimmer" style="width:220px; height:12px; background:rgba(255,255,255,0.1);"></div>
              </div>
            </div>
          </div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:46px; border-radius:999px; background:rgba(255,255,255,0.1); margin:24px 0 14px 0;"></div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <div class="ck-skeleton-shimmer" style="width:120px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
            <div class="ck-skeleton-shimmer" style="width:140px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
            <div class="ck-skeleton-shimmer" style="width:110px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
            <div class="ck-skeleton-shimmer" style="width:130px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
          </div>
        </div>

        <!-- Stats KPI Row Skeleton (3 tiles) -->
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:20px; margin-bottom:8px;">
          ${[1,2,3].map(()=>`
            <div style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:16px;">
              <div class="ck-skeleton-shimmer" style="width:36px; height:36px; border-radius:8px;"></div>
              <div style="flex:1;">
                <div class="ck-skeleton-shimmer" style="width:32px; height:24px; margin-bottom:4px;"></div>
                <div class="ck-skeleton-shimmer" style="width:70px; height:12px;"></div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Around You Skeleton -->
        <div style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <div class="ck-skeleton-shimmer" style="width:130px; height:22px; margin-bottom:6px;"></div>
              <div class="ck-skeleton-shimmer" style="width:250px; height:14px;"></div>
            </div>
            <div class="ck-skeleton-shimmer" style="width:64px; height:16px;"></div>
          </div>
          <div class="ck-rx-issues-grid">
            ${[1,2,3].map(()=>`
              <div class="ck-skeleton-issue-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="ck-skeleton-shimmer" style="width:32px; height:32px; border-radius:8px;"></div>
                  <div class="ck-skeleton-shimmer" style="width:64px; height:20px; border-radius:999px;"></div>
                </div>
                <div class="ck-skeleton-shimmer" style="width:85%; height:16px; margin-top:6px;"></div>
                <div class="ck-skeleton-shimmer" style="width:50%; height:12px;"></div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:10px; border-top:1px solid #f1f5f9;">
                  <div class="ck-skeleton-shimmer" style="width:80px; height:12px;"></div>
                  <div class="ck-skeleton-shimmer" style="width:40px; height:12px;"></div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Trending Initiatives Skeleton -->
        <div style="background:#fff; border:1px solid #e8ecf0; border-radius:16px; padding:20px 22px; margin-top:22px;">
          <div class="ck-skeleton-shimmer" style="width:150px; height:20px; margin-bottom:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:200px; height:12px; margin-bottom:16px;"></div>
          ${[1,2,3].map(()=>`
            <div style="display:flex; align-items:center; gap:14px; padding:10px 0; border-bottom:1px solid #f1f5f9;">
              <div class="ck-skeleton-shimmer" style="width:24px; height:24px; border-radius:4px;"></div>
              <div style="flex:1;">
                <div class="ck-skeleton-shimmer" style="width:70%; height:14px; margin-bottom:4px;"></div>
                <div class="ck-skeleton-shimmer" style="width:40%; height:10px;"></div>
              </div>
              <div class="ck-skeleton-shimmer" style="width:80px; height:12px;"></div>
            </div>
          `).join("")}
        </div>
      </main>

      <!-- Sidebar Skeleton -->
      <aside class="ck-rx-aside">
        <div class="ck-rx-sidebar-panel">
          <div class="ck-skeleton-shimmer" style="width:100px; height:16px; margin-bottom:14px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:36px; border-radius:10px; margin-bottom:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:36px; border-radius:10px; margin-bottom:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:36px; border-radius:10px;"></div>
        </div>
        <div class="ck-rx-sidebar-panel" style="min-height:240px;">
          <div class="ck-skeleton-shimmer" style="width:130px; height:16px; margin-bottom:12px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:170px; border-radius:12px;"></div>
        </div>
      </aside>
    </div>
  `}async function _n(){if(!ht(Q))return;const i=qe(),a=i.role==="citizen",o=document.getElementById("app"),r=a?id():'<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';if(o.innerHTML=Le(`
    ${a?'<div id="dash-actions" style="display:none;"></div>':`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>`}
    <div id="dash-content">
      ${r}
    </div>
  `,a?"Home":"Workspace"),Ce(),a){const l=document.getElementById("page-content");l&&l.classList.add("ck-citizen-page-content")}try{const d=(await Ea.getMetadata().catch(()=>({success:!1,data:{entityTypes:[],rules:[],domains:[]}}))).data||{entityTypes:[],rules:[],domains:[]};let u="Home",p=`Good day, <strong>${fe(i.name)}</strong>. Here is what is happening in your civic workspace.`;i.role==="coordinator_area"||i.role==="coordinator_general"?(u="Civic Operations Workspace",p=`Operations view for <strong>${fe(i.name)}</strong>`):i.role==="director"?(u="Executive Governance Workspace",p=`Executive view for <strong>${fe(i.name)}</strong>`):i.role==="admin"&&(u="Civic OS Administration",p=`Platform admin for <strong>${fe(i.name)}</strong>`),a||(o.innerHTML=Le(`
        <div class="page-header mb-6">
          <div class="page-header-left">
            <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${fe(u)}</h1>
            <p style="color:var(--text-secondary); margin-top:2px;">${p}</p>
          </div>
          <div class="page-header-actions" id="dash-actions"></div>
        </div>
        <div id="dash-content">
          <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
        </div>
      `,u,d.entityTypes),Ce());const m=document.getElementById("dash-content"),f=document.getElementById("dash-actions");i.role==="citizen"?await nd(m,i,d):i.role==="coordinator_area"?(f&&(f.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>'),await sd(m,i,d)):i.role==="coordinator_general"?(f&&(f.innerHTML='<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>'),await rd(m,i,d)):i.role==="director"?(f&&(f.innerHTML='<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>'),await ld(m,i,d)):i.role==="admin"&&(f&&(f.innerHTML=`
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `),await cd(m,i,d)),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{ie("Failed to load workspace data");const d=document.getElementById("dash-content");d&&(d.innerHTML='<div class="alert alert-error">Failed to load workspace data. Please try again.</div>'),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}async function nd(i,a,o){const l=(await be.list({owner_user_id:a.user_id,limit:50}).catch(()=>({data:[]}))).data||[],d=l.filter($=>!["draft","closed","rejected","deleted"].includes(($.status||"").toLowerCase())).slice(0,3),u=$i();let p;u?(p=await be.nearby(u.lat,u.lng,10).catch(()=>null),(!p||!p.data)&&(p=await be.list({limit:30}).catch(()=>({data:[]})))):p=await be.list({limit:30}).catch(()=>({data:[]}));const m=$=>!["draft","closed","rejected","deleted"].includes(($.status||"").toLowerCase()),f=(p&&p.data||[]).filter(m),v=$=>{var J;const C=(((J=$.entityType)==null?void 0:J.name)||"").toLowerCase(),D=($.name||"").toLowerCase();return C.includes("movement")||C.includes("initiative")||$.entity_type_id===1||D.includes("drive")||D.includes("cleanup")||D.includes("plantation")},y=f.filter($=>!v($)),b=f.filter($=>v($)),x=[{entity_id:1204,name:"Garbage not collected near FC Road",area:"FC Road, Shivajinagar",status:"coordinator_approved",entityType:{name:"Grievance"}},{entity_id:1207,name:"Broken streetlights on JM Road",area:"JM Road, Shivajinagar",status:"submitted",entityType:{name:"Grievance"}},{entity_id:639,name:"Pothole and damaged asphalt near Karve Statue",area:"Karve Road, Shivajinagar",status:"coordinator_approved",entityType:{name:"Grievance"}}],z=[{entity_id:638,name:"Shivajinagar Tree Plantation & Clean Air Drive",area:"Ward 14 · Shivajinagar",status:"approved",entityType:{name:"Movement"}},{entity_id:640,name:"Mutha Riverfront Community Cleanup Drive",area:"Mutha Riverfront, Shivajinagar",status:"approved",entityType:{name:"Movement"}},{entity_id:641,name:"Model Colony Solar Lighting Initiative",area:"Model Colony, Shivajinagar",status:"approved",entityType:{name:"Movement"}}],_=y.length>=2?y.slice(0,6):[...y,...x].slice(0,6),P=b.length>=2?b.slice(0,6):[...b,...z].slice(0,6),T=new Date().getHours(),E=T<12?"Good morning":T<17?"Good afternoon":"Good evening",q=(a.name||"Demo").split(" ")[0],H=u!=null&&u.area?u.area.split(",")[0].trim():"Dhayari",ne=[{entity_id:1204,name:"Overflowing community waste bin near Model Colony",status:"coordinator_approved",updated_at:null,stage:"Coordinator review"},{entity_id:1207,name:"Garbage not collected near FC Road for 4 days",status:"coordinator_approved",updated_at:null,stage:"Coordinator review"},{entity_id:640,name:"Mutha Riverfront Community Cleanup Drive",status:"approved",updated_at:null,stage:"Live initiative"}],pe=d.length>=3?d.slice(0,3):[...d,...ne].slice(0,3),he=$=>{const C=($||"").toLowerCase();return["submitted","coordinator_approved","in_progress","in_review","pending"].includes(C)?`<span class="ck-rx-status-pill ck-status-amber" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">${C==="submitted"||C==="pending"?"Submitted":"In Progress"}</span>`:["approved","resolved","completed"].includes(C)?`<span class="ck-rx-status-pill ck-status-green" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">${C==="completed"||C==="resolved"?"Resolved":"Active"}</span>`:["closed","rejected","draft"].includes(C)?`<span class="ck-rx-status-pill ck-status-grey" style="background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">${C==="draft"?"Draft":"Closed"}</span>`:'<span class="ck-rx-status-pill ck-status-amber" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">In Progress</span>'},A=$=>{if(!$)return"Updated recently";const C=new Date,D=new Date($),J=Math.floor((C-D)/1e3);if(J<60)return"Just now";const O=Math.floor(J/60);if(O<60)return`${O}m ago`;const _e=Math.floor(O/60);if(_e<24)return`${_e}h ago`;const R=Math.floor(_e/24);return R<7?`${R}d ago`:D.toLocaleDateString()},U=($="")=>{const C=$.toLowerCase();return C.includes("tree")||C.includes("park")||C.includes("green")||C.includes("garden")?At.leaf:C.includes("light")||C.includes("wire")||C.includes("power")||C.includes("pole")?At.zap:C.includes("garbage")||C.includes("waste")||C.includes("sanitation")||C.includes("clean")?At.trash:At.road},K=$=>!$||$.length===0?`
        <div class="ck-rx-empty-state" style="grid-column: 1 / -1; padding: 32px 16px;">
          <div class="ck-rx-empty-icon">${At.checkCircle}</div>
          <h4 class="ck-rx-empty-title">All clear near Shivajinagar!</h4>
          <p class="ck-rx-empty-desc">There are no open items in your neighborhood right now.</p>
        </div>
      `:$.map((C,D)=>{const J=C.name,O=td(C);return`
        <div class="ck-rx-issue-card">
          <div class="ck-rx-issue-top">
            <div class="ck-rx-issue-icon">
              ${U(J)}
            </div>
            ${he(C.status)}
          </div>
          <div class="ck-rx-issue-name" title="${fe(J)}">${fe(J)}</div>
          <div class="ck-rx-issue-area">
            ${At.mapPin}
            <span>${fe(O)}</span>
          </div>
          <div class="ck-rx-issue-footer" style="display:flex; justify-content:space-between; align-items:center;">
            <span class="ck-rx-issue-meta" style="font-size:0.84rem; color:#64748b; font-weight:500;">
              ${D*14+18} citizens backing
            </span>
            <a href="/entities/${C.entity_id||""}" class="ck-rx-issue-link" style="color:#ff5a36; font-size:0.86rem; font-weight:700; text-decoration:none;">
              View →
            </a>
          </div>
        </div>
      `}).join("");i.innerHTML=`
    <div class="ck-rx-layout">
      <!-- ░░ MAIN CONTENT ░░ -->
      <main class="ck-rx-main">

        <!-- ══════════════════════════════════════════════════════════════
             0. CITIZEN GREETING HEADER
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-citizen-greeting" style="margin-bottom:20px;">
          <h1 id="ck-citizen-greeting-title" style="font-family:'Fraunces', Georgia, serif; font-size:2rem; font-weight:700; color:#0f172a; margin:0 0 4px 0; letter-spacing:-0.02em;">${E}, ${fe(q)}</h1>
          <p id="ck-citizen-greeting-sub" style="font-size:0.95rem; color:#64748b; margin:0;">Here is where things stand around ${fe(H)}.</p>
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             1. AI CIVIC ASSISTANT HERO (NO TICKER, NO COPILOT BADGE, SINGLE MIC)
             ══════════════════════════════════════════════════════════════ -->
        <section class="ck-agent-dark-card" id="ck-dark-cockpit" aria-label="Civic Assistant AI Chat">
          <div class="ck-dark-ambient"></div>

          <!-- Location permission bar (hidden when already granted or dismissed) -->
          <div class="ck-location-bar" id="ck-location-bar" style="display:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;color:#ff5a36;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span id="ck-location-bar-text" style="font-size:0.88rem;">Allow location for better results near you</span>
            <button type="button" id="ck-location-grant-btn" class="ck-location-grant-btn" style="font-size:0.84rem;">📍 Use my location</button>
            <button type="button" id="ck-location-dismiss-btn" class="ck-location-dismiss-btn" title="Dismiss" aria-label="Dismiss location bar">×</button>
          </div>
          
          <!-- Header with Avatar, Title, Reset -->
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
                </div>
                <div class="ck-dark-sub">
                  Report issues · Start initiatives · Check request status
                </div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
              <button type="button" class="ck-dark-reset-btn" id="ck-dark-reset-btn" title="Start fresh conversation" style="display:none; font-size:0.84rem;">
                + New Request
              </button>
            </div>
          </div>

          <!-- Embedded Conversation Thread -->
          <div id="ck-dark-thread" class="ck-dark-thread" style="display:none;" role="log" aria-live="polite"></div>

          <!-- High-End Minimal Pill Input Bar with Single Mic Icon -->
          <div class="ck-dark-input-wrap">
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
                ${At.mic}
              </button>

              <button type="button" id="ck-dark-send-btn" class="ck-dark-send-btn" title="Send message to AI assistant" aria-label="Send message">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span>Send</span>
              </button>
            </div>
          </div>

          <!-- Chips including Contribute / Volunteer and Understand an issue -->
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
            <span class="ck-dark-chip" data-text="I want to contribute skills or volunteer">
              🤝 Contribute / Volunteer
            </span>
            <span class="ck-dark-chip" data-text="I want to understand municipal bylaws and civic issues">
              📖 Understand an issue
            </span>
            <span class="ck-dark-chip" data-text="what is happening with my requests">
              📋 Check my status
            </span>
          </div>

          <!-- Dark Card Footer: Guarantee on left, Prefer a form? on right -->
          <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:rgba(255,255,255,0.65); font-size:0.84rem; font-weight:400;">
              You review everything before it is submitted.
            </span>
            <a href="/entities/new" class="ck-form-fallback-link" style="color:rgba(255,255,255,0.85); font-size:0.85rem; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition:color 0.15s ease;">
              <span>Prefer a form?</span>
              <span>→</span>
            </a>
          </div>

        </section><!-- /.ck-agent-dark-card -->

        <!-- ══════════════════════════════════════════════════════════════
             2. STATS KPI ROW (My requests | Following | Contributions)
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-citizen-kpi-row" style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:20px; margin-bottom:8px;">
          <a href="/my-activity?tab=requests" class="ck-citizen-kpi-tile" style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); text-decoration:none; transition:all 0.15s ease;">
            <div style="width:40px; height:40px; background:#fff4f1; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="19" height="19" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div>
              <div style="font-size:1.85rem; font-weight:800; color:#0f172a; line-height:1.1;">${l.length||7}</div>
              <div style="font-size:0.88rem; color:#64748b; font-weight:600; margin-top:3px;">My requests</div>
            </div>
          </a>
          <a href="/my-activity?tab=following" class="ck-citizen-kpi-tile" style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); text-decoration:none; transition:all 0.15s ease;">
            <div style="width:40px; height:40px; background:#fff4f1; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="19" height="19" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <div>
              <div style="font-size:1.85rem; font-weight:800; color:#0f172a; line-height:1.1;">${l.filter($=>$.following).length||5}</div>
              <div style="font-size:0.88rem; color:#64748b; font-weight:600; margin-top:3px;">Following</div>
            </div>
          </a>
          <a href="/my-activity?tab=contributions" class="ck-citizen-kpi-tile" style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); text-decoration:none; transition:all 0.15s ease;">
            <div style="width:40px; height:40px; background:#fff4f1; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="19" height="19" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div style="font-size:1.85rem; font-weight:800; color:#0f172a; line-height:1.1;">${l.filter($=>{var C;return(((C=$.entityType)==null?void 0:C.name)||"").toLowerCase().includes("movement")||$.entity_type_id===1}).length||1}</div>
              <div style="font-size:0.88rem; color:#64748b; font-weight:600; margin-top:3px;">Contributions</div>
            </div>
          </a>
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             3. AROUND YOU (ISSUES | INITIATIVES TOGGLE, ONLY PUBLIC ACTIVE ITEMS)
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-rx-section-header" style="margin-top:28px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 class="ck-rx-section-title" style="margin-bottom:3px; font-size:1.25rem; font-weight:700; color:#0f172a;">Around you</h3>
            <p class="ck-rx-section-sub" id="ck-around-subtitle" style="font-size:0.88rem; color:#64748b; margin:0;">Public civic activity near ${fe(H)}</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <!-- Issues | Initiatives Toggle -->
            <div class="ck-around-toggle-pill" role="tablist">
              <button type="button" class="ck-around-toggle-btn active" id="ck-toggle-issues" role="tab" aria-selected="true">Issues</button>
              <button type="button" class="ck-around-toggle-btn" id="ck-toggle-initiatives" role="tab" aria-selected="false">Initiatives</button>
            </div>
            <a href="/entities" class="ck-rx-section-link" style="font-size:0.88rem; color:#ff5a36; font-weight:700; text-decoration:none;">View all →</a>
          </div>
        </div>

        <div class="ck-rx-issues-grid" id="ck-around-grid">
          ${K(_)}
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             4. TRENDING INITIATIVES (numbered leaderboard with backing bars)
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-rx-trending-panel" style="background:#fff; border:1px solid #e8ecf0; border-radius:16px; padding:22px 24px 18px; margin-top:24px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
            <div>
              <h3 class="ck-rx-section-title" style="margin-bottom:3px; font-size:1.15rem; font-weight:700; color:#0f172a;">Trending initiatives</h3>
              <p style="font-size:0.84rem; color:#94a3b8; margin:0;">Gaining citizen backing this week</p>
            </div>
            <a href="/initiatives" class="ck-rx-section-link" style="font-size:0.85rem; color:#ff5a36; font-weight:700; text-decoration:none; white-space:nowrap;">See all →</a>
          </div>
          <div class="ck-rx-trending-list" style="margin-top:14px; display:flex; flex-direction:column; gap:0;">
            ${od()}
          </div>
        </div>

      </main><!-- /.ck-rx-main -->

      <!-- ░░ RIGHT SIDEBAR (COMPACT MY REQUESTS TRACKER + CIVIC BUZZ) ░░ -->
      <aside class="ck-rx-aside">

        <!-- My Requests Tracker: User's 3 latest active requests with status pill, progress bar and stage -->
        <div class="ck-rx-sidebar-panel ck-request-tracker-panel" style="background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:18px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.02); margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div class="ck-rx-sidebar-heading" style="margin-bottom:0; font-size:1.05rem; font-weight:700; color:#0f172a;">My Requests</div>
            <a href="/my-activity?tab=requests" class="ck-tracker-see-all" style="font-size:0.84rem; color:#ff5a36; font-weight:700; text-decoration:none;">See all →</a>
          </div>

          <div class="ck-request-tracker-list" style="display:flex; flex-direction:column; gap:10px;">
            ${pe.map($=>{const C=($.status||"").toLowerCase(),D=["approved","resolved","completed"].includes(C),J=D?95:55,O=$.stage||(D?"Live initiative":"Coordinator review");return`
              <a href="/entities/${$.entity_id}" class="ck-tracker-item" style="display:block; text-decoration:none; padding:12px 14px; background:#fff; border:1px solid #eef2f6; border-radius:12px; transition:all 0.15s ease;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                  <span style="font-size:0.92rem; font-weight:700; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0;" title="${fe($.name)}">${fe($.name)}</span>
                  ${he($.status)}
                </div>
                <div style="width:100%; height:4px; background:#f1f5f9; border-radius:999px; overflow:hidden; margin:8px 0 6px;">
                  <div style="width:${J}%; height:100%; background:#ff5a36; border-radius:999px;"></div>
                </div>
                <div style="font-size:0.82rem; color:#94a3b8; font-weight:500;">
                  ${O} · ${fe(A($.updated_at||$.created_at))}
                </div>
              </a>
            `}).join("")}
          </div>
        </div>

        <!-- Civic Buzz Gallery Carousel (1 slide at a time, single control set) -->
        ${ed()}

      </aside><!-- /.ck-rx-aside -->
    </div><!-- /.ck-rx-layout -->
  `;const F=document.getElementById("ck-toggle-issues"),ee=document.getElementById("ck-toggle-initiatives"),Z=document.getElementById("ck-around-grid");F==null||F.addEventListener("click",()=>{F.classList.add("active"),F.setAttribute("aria-selected","true"),ee==null||ee.classList.remove("active"),ee==null||ee.setAttribute("aria-selected","false"),Z&&(Z.innerHTML=K(_))}),ee==null||ee.addEventListener("click",()=>{ee.classList.add("active"),ee.setAttribute("aria-selected","true"),F==null||F.classList.remove("active"),F==null||F.setAttribute("aria-selected","false"),Z&&(Z.innerHTML=K(P))}),ad(),Gs()}function ad(i,a){let o="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),r=!1,l=null;const d=document.getElementById("ck-location-bar"),u=document.getElementById("ck-location-bar-text"),p=document.getElementById("ck-location-grant-btn"),m=document.getElementById("ck-location-dismiss-btn"),f=document.getElementById("ck-around-subtitle");function v(Z){if(!Z)return;const $=Z.area?Z.area.split(",")[0].trim():"your area",C=document.getElementById("ck-citizen-greeting-sub");C&&(C.textContent=`Here is where things stand around ${$}.`),f&&(f.textContent=`Public civic activity near ${$}`),d&&(d.classList.add("ck-location-active"),u&&(u.textContent=`📍 Location: ${Z.area}`),p&&(p.style.display="none"),m&&(m.style.display="none"),setTimeout(()=>{d.style.display="none"},3e3)),document.getElementById("ck-around-grid")&&be.nearby(Z.lat,Z.lng,10).then(J=>{const O=R=>!["draft","closed","rejected","deleted"].includes((R.status||"").toLowerCase()),_e=(J.data||[]).filter(O).slice(0,6);if(_e.length>=2){const R=document.getElementById("ck-toggle-issues"),V=R&&R.classList.contains("active"),re=ae=>{var Y;const de=(((Y=ae.entityType)==null?void 0:Y.name)||"").toLowerCase();return de.includes("movement")||de.includes("initiative")||ae.entity_type_id===1};(V?_e.filter(ae=>!re(ae)):_e.filter(re)).length>0}}).catch(()=>{})}const y=$i();y?v(y):Ps()||d&&(d.style.display="flex"),p==null||p.addEventListener("click",async()=>{p&&(p.textContent="⏳ Detecting…"),p&&(p.disabled=!0);try{const Z=await As();v(Z)}catch{u&&(u.textContent="Location access denied. Using default area."),p&&(p.style.display="none"),setTimeout(()=>{d&&(d.style.display="none")},2500)}}),m==null||m.addEventListener("click",()=>{ic(),d&&(d.style.display="none")});const b=document.getElementById("ck-dark-input"),x=document.getElementById("ck-dark-send-btn"),z=document.getElementById("ck-dark-attach-btn"),_=document.getElementById("ck-dark-file-input"),P=document.getElementById("ck-dark-mic-btn"),T=document.getElementById("ck-dark-file-preview"),E=document.getElementById("ck-dark-thread"),q=document.getElementById("ck-dark-reset-btn");function H(){var D;if(!T)return;if(!l){T.innerHTML="",T.style.display="none";return}const Z=l.type.startsWith("image/"),$=Z?URL.createObjectURL(l):null,C=l.size<1024*1024?(l.size/1024).toFixed(1)+" KB":(l.size/(1024*1024)).toFixed(1)+" MB";T.style.display="flex",T.innerHTML=`
      <div class="ck-dark-file-chip">
        ${Z?`<img src="${$}" class="ck-dark-file-thumb" alt="Preview"/>`:"<span>📄</span>"}
        <span><strong>${fe(l.name)}</strong> (${C})</span>
        <button type="button" id="ck-dark-remove-file" class="ck-dark-file-remove" title="Remove attachment">&times;</button>
      </div>
    `,(D=document.getElementById("ck-dark-remove-file"))==null||D.addEventListener("click",()=>{l=null,_&&(_.value=""),H()})}z==null||z.addEventListener("click",()=>_==null?void 0:_.click()),_==null||_.addEventListener("change",Z=>{var C;const $=(C=Z.target.files)==null?void 0:C[0];$&&(l=$,H(),b==null||b.focus())}),P==null||P.addEventListener("click",()=>{P.classList.toggle("active"),P.classList.contains("active")?(b.placeholder="Listening live... say your complaint...",setTimeout(()=>{P.classList.contains("active")&&(b.value="Massive open pothole right outside Ferguson College gate causing traffic jam",P.classList.remove("active"),b.placeholder="Type your request here — e.g. 'garbage not collected near FC road'...",b.focus())},1800)):b.placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."});function ne(Z){if(!E)return;E.style.display="flex";const $=document.createElement("div");for($.innerHTML=Z;$.firstChild;)E.appendChild($.firstChild);E.scrollTop=E.scrollHeight}function pe(Z,$=null){let C="";return $&&($.isImage&&$.previewUrl?C=`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <img src="${fe($.previewUrl)}" class="ck-dark-user-img" alt="Proof" />
            <div style="font-size:0.75rem;">
              <div>📷 <strong>${fe($.name)}</strong></div>
              <div style="opacity:0.8;">${fe($.sizeStr)}</div>
            </div>
          </div>
        `:C=`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:0.75rem;">
            <span>📄</span>
            <div><strong>${fe($.name)}</strong> (${fe($.sizeStr)})</div>
          </div>
        `),`
      <div class="ck-dark-msg-row ck-dark-msg-user">
        <div class="ck-dark-bubble-user">
          ${C}
          <div>${fe(Z)}</div>
        </div>
      </div>
    `}function he(Z){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent">
          ${fe(Z||"").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}
        </div>
      </div>
    `}function A(){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent" id="ck-dark-thinking">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent" style="display:flex; align-items:center; gap:8px; padding:10px 16px;">
          <span style="font-size:0.8rem; font-weight:600; color:#ff7d5c;">Civic Assistant analyzing</span>
          <div class="agent-thinking-dots" style="padding:0;"><span></span><span></span><span></span></div>
        </div>
      </div>
    `}function U(Z,$){const C=Array.isArray(Z)?Z.map(D=>`
      <div class="ck-dark-confirm-row">
        <span class="ck-dark-confirm-label">${fe(D.label)}</span>
        <span class="ck-dark-confirm-val">${fe(D.value)}</span>
      </div>
    `).join(""):"";return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#10b981; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ck-dark-confirm-card">
          <div class="ck-dark-confirm-title">
            <span>📝</span> Review your request — Ready to submit
          </div>
          <p style="font-size:0.82rem; color:rgba(255,255,255,0.85); margin-bottom:12px;">
            ${fe(($||"").split(`

`)[0]||"Please review your request summary before submitting.")}
          </p>
          <div class="ck-dark-confirm-table">${C}</div>
          <div class="ck-dark-confirm-actions" id="ck-dark-confirm-actions">
            <button type="button" id="ck-dark-confirm-submit-btn" class="ck-dark-btn-primary">
              ✓ Submit Request
            </button>
            <button type="button" id="ck-dark-confirm-cancel-btn" class="ck-dark-btn-secondary">
              ✗ Modify / Cancel
            </button>
          </div>
        </div>
      </div>
    `}function K(Z,$,C){return`
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#16a34a; box-shadow:none;">
          <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="ck-dark-success-card">
          <div class="ck-dark-success-badge">
            <span>🎉</span> Request #${Z} Submitted!
          </div>
          <p style="font-size:0.85rem; color:#f1f5f9; margin-bottom:12px;">
            <strong>${fe($||C)}</strong> has been submitted and shared with your local team in Shivajinagar.
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="/entities/${Z}" class="ck-dark-btn-primary">
              View My Request →
            </a>
            <button type="button" id="ck-dark-new-case-btn" class="ck-dark-btn-secondary">
              + File Another Issue
            </button>
          </div>
        </div>
      </div>
    `}async function F(Z,$=null){var O,_e;const C=$||l,D=(Z||"").trim();if(r||!D&&!C)return;r=!0;let J=null;if(C){const R=C.type.startsWith("image/");J={name:C.name,sizeStr:C.size<1024*1024?(C.size/1024).toFixed(1)+" KB":(C.size/(1024*1024)).toFixed(1)+" MB",isImage:R,previewUrl:R?URL.createObjectURL(C):null}}b&&(b.value=""),l=null,_&&(_.value=""),H(),ne(pe(D||(C?`Attached file: ${C.name}`:""),J)),ne(A()),x&&(x.disabled=!0);try{const R=$i(),V=Bs(R),re=await on.chat(o,V+D,C);(O=document.getElementById("ck-dark-thinking"))==null||O.remove();const ce=re.data;ce.type==="confirm"?(ne(U(ce.summary||[],ce.text)),setTimeout(()=>{var ae,de;(ae=document.getElementById("ck-dark-confirm-submit-btn"))==null||ae.addEventListener("click",()=>{var Y;(Y=document.getElementById("ck-dark-confirm-actions"))==null||Y.remove(),F("yes")}),(de=document.getElementById("ck-dark-confirm-cancel-btn"))==null||de.addEventListener("click",()=>{var Y;(Y=document.getElementById("ck-dark-confirm-actions"))==null||Y.remove(),F("cancel")})},50)):ce.type==="submitted"?(ne(K(ce.entity_id,ce.entity_name,ce.capability)),setTimeout(()=>{var ae;(ae=document.getElementById("ck-dark-new-case-btn"))==null||ae.addEventListener("click",()=>{ee()})},50)):ne(he(ce.text||"Understood. Please provide additional details or landmarks."))}catch(R){(_e=document.getElementById("ck-dark-thinking"))==null||_e.remove(),ne(he("I encountered a connection hiccup with the AI dispatcher. Please try describing your issue again.")),console.error("[Cockpit Agent Error]:",R)}finally{r=!1,x&&(x.disabled=!1),b==null||b.focus()}}x==null||x.addEventListener("click",()=>{F(b==null?void 0:b.value)}),b==null||b.addEventListener("keydown",Z=>{Z.key==="Enter"&&!Z.shiftKey&&(Z.preventDefault(),F(b.value))}),document.querySelectorAll(".ck-dark-chip").forEach(Z=>{Z.addEventListener("click",()=>{const $=Z.getAttribute("data-text");$&&F($)})}),document.querySelectorAll(".ck-gateway-trigger").forEach(Z=>{Z.addEventListener("click",()=>{const $=Z.getAttribute("data-gateway-prompt"),C=document.getElementById("ck-dark-cockpit");C&&C.scrollIntoView({behavior:"smooth",block:"center"}),b&&(b.value=$||"",b.focus())})});function ee(){o&&on.clearSession(o),o="ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),r=!1,l=null,_&&(_.value=""),H(),E&&(E.innerHTML="",E.style.display="none"),b==null||b.focus()}q==null||q.addEventListener("click",ee)}function od(){const a=[{rank:"01",name:"Kothrud Green Corridor Tree Plantation",area:"Ward 9 · Kothrud",count:64},{rank:"02",name:"FC Road Pedestrian Safety & Zebra Crossings",area:"Ward 14 · Shivajinagar",count:52},{rank:"03",name:"Baner Wet-Waste Decentralized Composting",area:"Ward 2 · Baner",count:41}];return a.map((o,r)=>{const l=Math.round(o.count/70*100);return`
    <div class="ck-rx-trending-row" style="display:flex; align-items:center; gap:14px; padding:12px 0; ${r<a.length-1?"border-bottom:1px solid #f1f5f9;":""}">
      <span class="ck-rx-trending-num" style="font-family:'Fraunces', Georgia, serif; font-size:1.25rem; font-weight:800; color:#e65100; min-width:32px; flex-shrink:0;">${o.rank}</span>
      <div class="ck-rx-trending-info" style="flex:1; min-width:0;">
        <div class="ck-rx-trending-name" style="font-size:0.95rem; font-weight:700; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o.name}</div>
        <div class="ck-rx-trending-sub" style="font-size:0.84rem; color:#94a3b8; margin-top:2px;">${o.area}</div>
      </div>
      <div style="text-align:right; flex-shrink:0; min-width:90px;">
        <div style="font-size:0.84rem; font-weight:600; color:#64748b; margin-bottom:4px;">${o.count} backing</div>
        <div style="width:90px; height:5px; background:#f1f5f9; border-radius:999px; overflow:hidden;">
          <div style="width:${l}%; height:100%; background:#ff5a36; border-radius:999px;"></div>
        </div>
      </div>
    </div>
  `}).join("")}async function sd(i,a,o){var u;const r=a.assignedArea,l=await be.list({status:"submitted",area:r,limit:10}),d=l.data||[];i.innerHTML=`
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${fe(r||"Sector 5")}</div>
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
          <div class="card-subtitle">Submitted cases in ${fe(r||"Sector 5")} awaiting verification</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
      </div>
      ${$a(d,!0)}
    </div>
  `}async function rd(i,a,o){var d;const r=await be.list({status:"submitted",area:"Unassigned",limit:10}),l=r.data||[];i.innerHTML=`
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
  `}async function ld(i,a,o){var d;const r=await be.list({status:"coordinator_approved",limit:10}),l=r.data||[];i.innerHTML=`
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
  `}async function cd(i,a,o){var u,p,m;const[r,l,d]=await Promise.all([be.list({limit:1}),be.list({status:"submitted",limit:1}),be.list({status:"approved",limit:1})]);i.innerHTML=`
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
          ${fe(r.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${fe(((l=r.entityType)==null?void 0:l.name)||"Capability")}</span></td>
      ${a?`<td>${fe(((d=r.owner)==null?void 0:d.name)||"System")}</td>`:""}
      <td>${fe(r.area||"—")}</td>
      <td><span class="badge badge-${r.status}">${Ht(r.status)}</span></td>
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
  `}function dt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let X={page:1,limit:20},Bt=[];async function dd(i={},a=null){if(!ht(Q))return;const o=a||new URLSearchParams(window.location.search);o.has("status")?X.status=o.get("status"):delete X.status,o.has("entity_type_id")?X.entity_type_id=o.get("entity_type_id"):delete X.entity_type_id,o.has("name")?X.name=o.get("name"):delete X.name,o.has("page")?X.page=Number(o.get("page")):X.page=1;const r=qe(),d=hn()==="citizen",u=o.get("type")==="initiative",p=o.get("tab")||(o.get("following")?"following":o.get("status")==="draft"?"drafts":o.get("status")==="approved"?"contributions":"requests");d?u?delete X.owner_user_id:p==="following"?(X.following=1,delete X.owner_user_id):p==="contributions"?(X.owner_user_id=r.user_id,X.status="approved",delete X.following):p==="drafts"?(X.owner_user_id=r.user_id,X.status="draft",delete X.following):(X.owner_user_id=r.user_id,delete X.following,o.has("status")||delete X.status):(delete X.owner_user_id,delete X.following);try{Bt=(await be.listTypes().catch(()=>({data:[]}))).data||[]}catch{Bt=[]}const m=Bt.find(_=>String(_.entity_type_id)===String(X.entity_type_id)),f=pt(m);let v="All Cases & Requests",y="Browse, search, and track all civic cases and requests across your workspace.";if(u){if(v="Civic Initiatives",y="Browse, join, or start community civic initiatives and neighborhood drives.",!X.entity_type_id&&Bt.length>0){const _=Bt.find(P=>(P.name||"").toLowerCase().includes("movement")||P.entity_type_id===1);_&&(X.entity_type_id=_.entity_type_id)}}else d?(v=m?`My ${f.title} Requests`:"My Civic Activity",y=m?`Tracking cases initiated by you for capability "${f.title}".`:"Track, review, and manage your civic requests, contributions, and community actions."):m&&(v=`${f.title} Cases`,y=`Browsing cases for capability "${f.title}".`);const b=document.getElementById("app");b.innerHTML=Le(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${dt(v)}</h1>
        <p id="entities-header-subtitle">${dt(y)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${X.entity_type_id?`?entity_type_id=${X.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px; background:#ff5a36; border-color:#ff5a36;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          ${u?"Start New Initiative":"Start Civic Action"}
        </a>
      </div>
    </div>

    ${d&&!u?`
      <!-- My Activity Tabs: Requests, Following, Contributions, Drafts -->
      <div class="ck-activity-tabs-wrap" style="display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap;">
        <a href="/entities?tab=requests" class="btn ${p==="requests"?"btn-primary":"btn-secondary"} btn-sm" style="border-radius:20px; font-weight:700; padding:6px 16px; ${p==="requests"?"background:#ff5a36; border-color:#ff5a36;":""}">Requests</a>
        <a href="/entities?tab=following" class="btn ${p==="following"?"btn-primary":"btn-secondary"} btn-sm" style="border-radius:20px; font-weight:700; padding:6px 16px; ${p==="following"?"background:#ff5a36; border-color:#ff5a36;":""}">Following</a>
        <a href="/entities?tab=contributions" class="btn ${p==="contributions"?"btn-primary":"btn-secondary"} btn-sm" style="border-radius:20px; font-weight:700; padding:6px 16px; ${p==="contributions"?"background:#ff5a36; border-color:#ff5a36;":""}">Contributions</a>
        <a href="/entities?tab=drafts" class="btn ${p==="drafts"?"btn-primary":"btn-secondary"} btn-sm" style="border-radius:20px; font-weight:700; padding:6px 16px; ${p==="drafts"?"background:#ff5a36; border-color:#ff5a36;":""}">Drafts</a>
      </div>
    `:""}
    
    <div class="card mb-6" style="padding: 16px 20px;">
      <div class="filters-bar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; width:100%;">
        <!-- Search Box -->
        <div style="flex: 2; min-width: 240px; position: relative;">
          <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${dt(X.name||"")}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${Bt.map(_=>{const P=pt(_);return`<option value="${_.entity_type_id}" ${String(X.entity_type_id)===String(_.entity_type_id)?"selected":""}>${dt(P.title)}</option>`}).join("")}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${X.status==="draft"?"selected":""}>Draft</option>
            <option value="submitted" ${X.status==="submitted"?"selected":""}>Submitted</option>
            <option value="coordinator_approved" ${X.status==="coordinator_approved"?"selected":""}>Verified (Pending Approval)</option>
            <option value="approved" ${X.status==="approved"?"selected":""}>Approved & Active</option>
            <option value="rejected" ${X.status==="rejected"?"selected":""}>Rejected</option>
            <option value="closed" ${X.status==="closed"?"selected":""}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${X.status||X.entity_type_id||X.name?`
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
  `,v,Bt),Ce();const x=()=>{const _=document.getElementById("filter-status").value,P=document.getElementById("filter-type").value,T=document.getElementById("filter-search").value.trim(),E=new URLSearchParams;_&&E.set("status",_),P&&E.set("entity_type_id",P),T&&E.set("name",T),Q(`/entities${E.toString()?"?"+E.toString():""}`)};document.getElementById("btn-filter").addEventListener("click",x),document.getElementById("filter-search").addEventListener("keypress",_=>{_.key==="Enter"&&x()});const z=document.getElementById("btn-clear-filter");z&&z.addEventListener("click",()=>{Q("/entities")}),await Ws()}async function Ws(){const i=document.getElementById("entities-content");if(!i)return;va();const o=hn()==="citizen";try{const r=await be.list(X),{data:l,pagination:d}=r;if(!l||l.length===0){i.innerHTML=`
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
            ${X.status||X.entity_type_id||X.name?`
              <a href="/entities" class="btn btn-secondary">Clear Filters</a>
            `:""}
            <a href="/entities/new${X.entity_type_id?`?entity_type_id=${X.entity_type_id}`:""}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;return}const u=l.map(y=>{var x;const b=pt(y.entityType);return`
        <tr>
          <td><a href="/entities/${y.entity_id}" class="text-link font-medium">#PR-${String(y.entity_id).padStart(5,"0")}</a></td>
          <td>
            <a href="/entities/${y.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${dt(y.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${dt(b.shortTitle)}</span></td>
          ${o?"":`<td>${dt(((x=y.owner)==null?void 0:x.name)||"System")}</td>`}
          <td>${dt(y.area||"—")}</td>
          <td><span class="badge badge-${y.status}">${Ht(y.status)}</span></td>
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
    `;const f=document.getElementById("btn-prev"),v=document.getElementById("btn-next");f&&f.addEventListener("click",()=>{const y=new URLSearchParams(window.location.search);y.set("page",String(X.page-1)),Q(`/entities?${y.toString()}`)}),v&&v.addEventListener("click",()=>{const y=new URLSearchParams(window.location.search);y.set("page",String(X.page+1)),Q(`/entities?${y.toString()}`)}),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}catch{ie("Failed to load cases"),i.innerHTML='<div class="alert alert-error">Error loading cases. Please try again.</div>',typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}}async function va(){var o;const i=document.getElementById("ck-buzz-drafts-section");if(!i)return;if(!qe()){i.innerHTML="";return}try{const l=(await ye.list({status:"draft",limit:10})).data||[];if(l.length===0){i.innerHTML="";return}i.innerHTML=`
      <div class="ck-buzz-drafts-card">
        <div class="ck-buzz-drafts-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-flex; align-items:center; color:#ff5a36;">${B.draft(22,"#ff5a36")}</span>
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
                  <span class="ck-buzz-badge-pill" style="font-size:0.65rem; display:inline-flex; align-items:center; gap:4px;">
                    ${d.template==="initiative"?`${B.initiative(12,"#16a34a")} INITIATIVE`:d.template==="awareness"?`${B.awareness(12,"#0284c7")} AWARENESS`:`${B.flame(12,"#ea580c")} MEME`}
                  </span>
                  <span style="font-size:0.7rem; color:#94a3b8;">${new Date(d.created_at).toLocaleDateString()}</span>
                </div>
                <div style="font-weight:700; font-size:0.9rem; color:#0f172a; line-height:1.3; margin-bottom:4px;">
                  "${dt(d.caption)}"
                </div>
                ${d.linked_title?`
                  <div style="font-size:0.75rem; color:#64748b;">
                    Linked: #${d.linked_id} ${dt(d.linked_title)}
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
    `,(o=i.querySelector("#ck-draft-new-btn"))==null||o.addEventListener("click",()=>{Mi(null,()=>va())}),i.querySelectorAll(".ck-draft-edit-btn").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.getAttribute("data-id")),p=l.find(m=>m.id===u);p&&Mi(p.linked_id,()=>{va(),Ws()},p)})})}catch{i.innerHTML=""}}let cn=null;function ya({title:i,content:a,footer:o="",onClose:r=()=>{}}){ni();const l=document.getElementById("modal-container"),d=`
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${ud(i)}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${a}
      </div>
      ${o?`<div class="modal-footer">${o}</div>`:""}
    </div>
  `;l.innerHTML=d,l.style.pointerEvents="auto";const u=()=>{l.innerHTML="",l.style.pointerEvents="none",cn=null,r()};cn=u,document.getElementById("modal-close-btn").addEventListener("click",u),document.getElementById("modal-backdrop").addEventListener("click",u);const p=m=>{m.key==="Escape"&&(u(),document.removeEventListener("keydown",p))};document.addEventListener("keydown",p)}function ni(){cn&&cn()}function ud(i){return String(i).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var pd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function hd(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var ba={exports:{}};/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */(function(i,a){(function(o,r){r(a)})(pd,function(o){var r="1.9.4";function l(e){var t,n,s,c;for(n=1,s=arguments.length;n<s;n++){c=arguments[n];for(t in c)e[t]=c[t]}return e}var d=Object.create||function(){function e(){}return function(t){return e.prototype=t,new e}}();function u(e,t){var n=Array.prototype.slice;if(e.bind)return e.bind.apply(e,n.call(arguments,1));var s=n.call(arguments,2);return function(){return e.apply(t,s.length?s.concat(n.call(arguments)):arguments)}}var p=0;function m(e){return"_leaflet_id"in e||(e._leaflet_id=++p),e._leaflet_id}function f(e,t,n){var s,c,h,g;return g=function(){s=!1,c&&(h.apply(n,c),c=!1)},h=function(){s?c=arguments:(e.apply(n,arguments),setTimeout(g,t),s=!0)},h}function v(e,t,n){var s=t[1],c=t[0],h=s-c;return e===s&&n?e:((e-c)%h+h)%h+c}function y(){return!1}function b(e,t){if(t===!1)return e;var n=Math.pow(10,t===void 0?6:t);return Math.round(e*n)/n}function x(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function z(e){return x(e).split(/\s+/)}function _(e,t){Object.prototype.hasOwnProperty.call(e,"options")||(e.options=e.options?d(e.options):{});for(var n in t)e.options[n]=t[n];return e.options}function P(e,t,n){var s=[];for(var c in e)s.push(encodeURIComponent(n?c.toUpperCase():c)+"="+encodeURIComponent(e[c]));return(!t||t.indexOf("?")===-1?"?":"&")+s.join("&")}var T=/\{ *([\w_ -]+) *\}/g;function E(e,t){return e.replace(T,function(n,s){var c=t[s];if(c===void 0)throw new Error("No value provided for variable "+n);return typeof c=="function"&&(c=c(t)),c})}var q=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"};function H(e,t){for(var n=0;n<e.length;n++)if(e[n]===t)return n;return-1}var ne="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";function pe(e){return window["webkit"+e]||window["moz"+e]||window["ms"+e]}var he=0;function A(e){var t=+new Date,n=Math.max(0,16-(t-he));return he=t+n,window.setTimeout(e,n)}var U=window.requestAnimationFrame||pe("RequestAnimationFrame")||A,K=window.cancelAnimationFrame||pe("CancelAnimationFrame")||pe("CancelRequestAnimationFrame")||function(e){window.clearTimeout(e)};function F(e,t,n){if(n&&U===A)e.call(t);else return U.call(window,u(e,t))}function ee(e){e&&K.call(window,e)}var Z={__proto__:null,extend:l,create:d,bind:u,get lastId(){return p},stamp:m,throttle:f,wrapNum:v,falseFn:y,formatNum:b,trim:x,splitWords:z,setOptions:_,getParamString:P,template:E,isArray:q,indexOf:H,emptyImageUrl:ne,requestFn:U,cancelFn:K,requestAnimFrame:F,cancelAnimFrame:ee};function $(){}$.extend=function(e){var t=function(){_(this),this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},n=t.__super__=this.prototype,s=d(n);s.constructor=t,t.prototype=s;for(var c in this)Object.prototype.hasOwnProperty.call(this,c)&&c!=="prototype"&&c!=="__super__"&&(t[c]=this[c]);return e.statics&&l(t,e.statics),e.includes&&(C(e.includes),l.apply(null,[s].concat(e.includes))),l(s,e),delete s.statics,delete s.includes,s.options&&(s.options=n.options?d(n.options):{},l(s.options,e.options)),s._initHooks=[],s.callInitHooks=function(){if(!this._initHooksCalled){n.callInitHooks&&n.callInitHooks.call(this),this._initHooksCalled=!0;for(var h=0,g=s._initHooks.length;h<g;h++)s._initHooks[h].call(this)}},t},$.include=function(e){var t=this.prototype.options;return l(this.prototype,e),e.options&&(this.prototype.options=t,this.mergeOptions(e.options)),this},$.mergeOptions=function(e){return l(this.prototype.options,e),this},$.addInitHook=function(e){var t=Array.prototype.slice.call(arguments,1),n=typeof e=="function"?e:function(){this[e].apply(this,t)};return this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(n),this};function C(e){if(!(typeof L>"u"||!L||!L.Mixin)){e=q(e)?e:[e];for(var t=0;t<e.length;t++)e[t]===L.Mixin.Events&&console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",new Error().stack)}}var D={on:function(e,t,n){if(typeof e=="object")for(var s in e)this._on(s,e[s],t);else{e=z(e);for(var c=0,h=e.length;c<h;c++)this._on(e[c],t,n)}return this},off:function(e,t,n){if(!arguments.length)delete this._events;else if(typeof e=="object")for(var s in e)this._off(s,e[s],t);else{e=z(e);for(var c=arguments.length===1,h=0,g=e.length;h<g;h++)c?this._off(e[h]):this._off(e[h],t,n)}return this},_on:function(e,t,n,s){if(typeof t!="function"){console.warn("wrong listener type: "+typeof t);return}if(this._listens(e,t,n)===!1){n===this&&(n=void 0);var c={fn:t,ctx:n};s&&(c.once=!0),this._events=this._events||{},this._events[e]=this._events[e]||[],this._events[e].push(c)}},_off:function(e,t,n){var s,c,h;if(this._events&&(s=this._events[e],!!s)){if(arguments.length===1){if(this._firingCount)for(c=0,h=s.length;c<h;c++)s[c].fn=y;delete this._events[e];return}if(typeof t!="function"){console.warn("wrong listener type: "+typeof t);return}var g=this._listens(e,t,n);if(g!==!1){var w=s[g];this._firingCount&&(w.fn=y,this._events[e]=s=s.slice()),s.splice(g,1)}}},fire:function(e,t,n){if(!this.listens(e,n))return this;var s=l({},t,{type:e,target:this,sourceTarget:t&&t.sourceTarget||this});if(this._events){var c=this._events[e];if(c){this._firingCount=this._firingCount+1||1;for(var h=0,g=c.length;h<g;h++){var w=c[h],k=w.fn;w.once&&this.off(e,k,w.ctx),k.call(w.ctx||this,s)}this._firingCount--}}return n&&this._propagateEvent(s),this},listens:function(e,t,n,s){typeof e!="string"&&console.warn('"string" type argument expected');var c=t;typeof t!="function"&&(s=!!t,c=void 0,n=void 0);var h=this._events&&this._events[e];if(h&&h.length&&this._listens(e,c,n)!==!1)return!0;if(s){for(var g in this._eventParents)if(this._eventParents[g].listens(e,t,n,s))return!0}return!1},_listens:function(e,t,n){if(!this._events)return!1;var s=this._events[e]||[];if(!t)return!!s.length;n===this&&(n=void 0);for(var c=0,h=s.length;c<h;c++)if(s[c].fn===t&&s[c].ctx===n)return c;return!1},once:function(e,t,n){if(typeof e=="object")for(var s in e)this._on(s,e[s],t,!0);else{e=z(e);for(var c=0,h=e.length;c<h;c++)this._on(e[c],t,n,!0)}return this},addEventParent:function(e){return this._eventParents=this._eventParents||{},this._eventParents[m(e)]=e,this},removeEventParent:function(e){return this._eventParents&&delete this._eventParents[m(e)],this},_propagateEvent:function(e){for(var t in this._eventParents)this._eventParents[t].fire(e.type,l({layer:e.target,propagatedFrom:e.target},e),!0)}};D.addEventListener=D.on,D.removeEventListener=D.clearAllEventListeners=D.off,D.addOneTimeEventListener=D.once,D.fireEvent=D.fire,D.hasEventListeners=D.listens;var J=$.extend(D);function O(e,t,n){this.x=n?Math.round(e):e,this.y=n?Math.round(t):t}var _e=Math.trunc||function(e){return e>0?Math.floor(e):Math.ceil(e)};O.prototype={clone:function(){return new O(this.x,this.y)},add:function(e){return this.clone()._add(R(e))},_add:function(e){return this.x+=e.x,this.y+=e.y,this},subtract:function(e){return this.clone()._subtract(R(e))},_subtract:function(e){return this.x-=e.x,this.y-=e.y,this},divideBy:function(e){return this.clone()._divideBy(e)},_divideBy:function(e){return this.x/=e,this.y/=e,this},multiplyBy:function(e){return this.clone()._multiplyBy(e)},_multiplyBy:function(e){return this.x*=e,this.y*=e,this},scaleBy:function(e){return new O(this.x*e.x,this.y*e.y)},unscaleBy:function(e){return new O(this.x/e.x,this.y/e.y)},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},trunc:function(){return this.clone()._trunc()},_trunc:function(){return this.x=_e(this.x),this.y=_e(this.y),this},distanceTo:function(e){e=R(e);var t=e.x-this.x,n=e.y-this.y;return Math.sqrt(t*t+n*n)},equals:function(e){return e=R(e),e.x===this.x&&e.y===this.y},contains:function(e){return e=R(e),Math.abs(e.x)<=Math.abs(this.x)&&Math.abs(e.y)<=Math.abs(this.y)},toString:function(){return"Point("+b(this.x)+", "+b(this.y)+")"}};function R(e,t,n){return e instanceof O?e:q(e)?new O(e[0],e[1]):e==null?e:typeof e=="object"&&"x"in e&&"y"in e?new O(e.x,e.y):new O(e,t,n)}function V(e,t){if(e)for(var n=t?[e,t]:e,s=0,c=n.length;s<c;s++)this.extend(n[s])}V.prototype={extend:function(e){var t,n;if(!e)return this;if(e instanceof O||typeof e[0]=="number"||"x"in e)t=n=R(e);else if(e=re(e),t=e.min,n=e.max,!t||!n)return this;return!this.min&&!this.max?(this.min=t.clone(),this.max=n.clone()):(this.min.x=Math.min(t.x,this.min.x),this.max.x=Math.max(n.x,this.max.x),this.min.y=Math.min(t.y,this.min.y),this.max.y=Math.max(n.y,this.max.y)),this},getCenter:function(e){return R((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,e)},getBottomLeft:function(){return R(this.min.x,this.max.y)},getTopRight:function(){return R(this.max.x,this.min.y)},getTopLeft:function(){return this.min},getBottomRight:function(){return this.max},getSize:function(){return this.max.subtract(this.min)},contains:function(e){var t,n;return typeof e[0]=="number"||e instanceof O?e=R(e):e=re(e),e instanceof V?(t=e.min,n=e.max):t=n=e,t.x>=this.min.x&&n.x<=this.max.x&&t.y>=this.min.y&&n.y<=this.max.y},intersects:function(e){e=re(e);var t=this.min,n=this.max,s=e.min,c=e.max,h=c.x>=t.x&&s.x<=n.x,g=c.y>=t.y&&s.y<=n.y;return h&&g},overlaps:function(e){e=re(e);var t=this.min,n=this.max,s=e.min,c=e.max,h=c.x>t.x&&s.x<n.x,g=c.y>t.y&&s.y<n.y;return h&&g},isValid:function(){return!!(this.min&&this.max)},pad:function(e){var t=this.min,n=this.max,s=Math.abs(t.x-n.x)*e,c=Math.abs(t.y-n.y)*e;return re(R(t.x-s,t.y-c),R(n.x+s,n.y+c))},equals:function(e){return e?(e=re(e),this.min.equals(e.getTopLeft())&&this.max.equals(e.getBottomRight())):!1}};function re(e,t){return!e||e instanceof V?e:new V(e,t)}function ce(e,t){if(e)for(var n=t?[e,t]:e,s=0,c=n.length;s<c;s++)this.extend(n[s])}ce.prototype={extend:function(e){var t=this._southWest,n=this._northEast,s,c;if(e instanceof de)s=e,c=e;else if(e instanceof ce){if(s=e._southWest,c=e._northEast,!s||!c)return this}else return e?this.extend(Y(e)||ae(e)):this;return!t&&!n?(this._southWest=new de(s.lat,s.lng),this._northEast=new de(c.lat,c.lng)):(t.lat=Math.min(s.lat,t.lat),t.lng=Math.min(s.lng,t.lng),n.lat=Math.max(c.lat,n.lat),n.lng=Math.max(c.lng,n.lng)),this},pad:function(e){var t=this._southWest,n=this._northEast,s=Math.abs(t.lat-n.lat)*e,c=Math.abs(t.lng-n.lng)*e;return new ce(new de(t.lat-s,t.lng-c),new de(n.lat+s,n.lng+c))},getCenter:function(){return new de((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new de(this.getNorth(),this.getWest())},getSouthEast:function(){return new de(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(e){typeof e[0]=="number"||e instanceof de||"lat"in e?e=Y(e):e=ae(e);var t=this._southWest,n=this._northEast,s,c;return e instanceof ce?(s=e.getSouthWest(),c=e.getNorthEast()):s=c=e,s.lat>=t.lat&&c.lat<=n.lat&&s.lng>=t.lng&&c.lng<=n.lng},intersects:function(e){e=ae(e);var t=this._southWest,n=this._northEast,s=e.getSouthWest(),c=e.getNorthEast(),h=c.lat>=t.lat&&s.lat<=n.lat,g=c.lng>=t.lng&&s.lng<=n.lng;return h&&g},overlaps:function(e){e=ae(e);var t=this._southWest,n=this._northEast,s=e.getSouthWest(),c=e.getNorthEast(),h=c.lat>t.lat&&s.lat<n.lat,g=c.lng>t.lng&&s.lng<n.lng;return h&&g},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(e,t){return e?(e=ae(e),this._southWest.equals(e.getSouthWest(),t)&&this._northEast.equals(e.getNorthEast(),t)):!1},isValid:function(){return!!(this._southWest&&this._northEast)}};function ae(e,t){return e instanceof ce?e:new ce(e,t)}function de(e,t,n){if(isNaN(e)||isNaN(t))throw new Error("Invalid LatLng object: ("+e+", "+t+")");this.lat=+e,this.lng=+t,n!==void 0&&(this.alt=+n)}de.prototype={equals:function(e,t){if(!e)return!1;e=Y(e);var n=Math.max(Math.abs(this.lat-e.lat),Math.abs(this.lng-e.lng));return n<=(t===void 0?1e-9:t)},toString:function(e){return"LatLng("+b(this.lat,e)+", "+b(this.lng,e)+")"},distanceTo:function(e){return xt.distance(this,Y(e))},wrap:function(){return xt.wrapLatLng(this)},toBounds:function(e){var t=180*e/40075017,n=t/Math.cos(Math.PI/180*this.lat);return ae([this.lat-t,this.lng-n],[this.lat+t,this.lng+n])},clone:function(){return new de(this.lat,this.lng,this.alt)}};function Y(e,t,n){return e instanceof de?e:q(e)&&typeof e[0]!="object"?e.length===3?new de(e[0],e[1],e[2]):e.length===2?new de(e[0],e[1]):null:e==null?e:typeof e=="object"&&"lat"in e?new de(e.lat,"lng"in e?e.lng:e.lon,e.alt):t===void 0?null:new de(e,t,n)}var mt={latLngToPoint:function(e,t){var n=this.projection.project(e),s=this.scale(t);return this.transformation._transform(n,s)},pointToLatLng:function(e,t){var n=this.scale(t),s=this.transformation.untransform(e,n);return this.projection.unproject(s)},project:function(e){return this.projection.project(e)},unproject:function(e){return this.projection.unproject(e)},scale:function(e){return 256*Math.pow(2,e)},zoom:function(e){return Math.log(e/256)/Math.LN2},getProjectedBounds:function(e){if(this.infinite)return null;var t=this.projection.bounds,n=this.scale(e),s=this.transformation.transform(t.min,n),c=this.transformation.transform(t.max,n);return new V(s,c)},infinite:!1,wrapLatLng:function(e){var t=this.wrapLng?v(e.lng,this.wrapLng,!0):e.lng,n=this.wrapLat?v(e.lat,this.wrapLat,!0):e.lat,s=e.alt;return new de(n,t,s)},wrapLatLngBounds:function(e){var t=e.getCenter(),n=this.wrapLatLng(t),s=t.lat-n.lat,c=t.lng-n.lng;if(s===0&&c===0)return e;var h=e.getSouthWest(),g=e.getNorthEast(),w=new de(h.lat-s,h.lng-c),k=new de(g.lat-s,g.lng-c);return new ce(w,k)}},xt=l({},mt,{wrapLng:[-180,180],R:6371e3,distance:function(e,t){var n=Math.PI/180,s=e.lat*n,c=t.lat*n,h=Math.sin((t.lat-e.lat)*n/2),g=Math.sin((t.lng-e.lng)*n/2),w=h*h+Math.cos(s)*Math.cos(c)*g*g,k=2*Math.atan2(Math.sqrt(w),Math.sqrt(1-w));return this.R*k}}),Ra=6378137,wn={R:Ra,MAX_LATITUDE:85.0511287798,project:function(e){var t=Math.PI/180,n=this.MAX_LATITUDE,s=Math.max(Math.min(n,e.lat),-n),c=Math.sin(s*t);return new O(this.R*e.lng*t,this.R*Math.log((1+c)/(1-c))/2)},unproject:function(e){var t=180/Math.PI;return new de((2*Math.atan(Math.exp(e.y/this.R))-Math.PI/2)*t,e.x*t/this.R)},bounds:function(){var e=Ra*Math.PI;return new V([-e,-e],[e,e])}()};function kn(e,t,n,s){if(q(e)){this._a=e[0],this._b=e[1],this._c=e[2],this._d=e[3];return}this._a=e,this._b=t,this._c=n,this._d=s}kn.prototype={transform:function(e,t){return this._transform(e.clone(),t)},_transform:function(e,t){return t=t||1,e.x=t*(this._a*e.x+this._b),e.y=t*(this._c*e.y+this._d),e},untransform:function(e,t){return t=t||1,new O((e.x/t-this._b)/this._a,(e.y/t-this._d)/this._c)}};function li(e,t,n,s){return new kn(e,t,n,s)}var zn=l({},xt,{code:"EPSG:3857",projection:wn,transformation:function(){var e=.5/(Math.PI*wn.R);return li(e,.5,-e,.5)}()}),rr=l({},zn,{code:"EPSG:900913"});function Oa(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function ja(e,t){var n="",s,c,h,g,w,k;for(s=0,h=e.length;s<h;s++){for(w=e[s],c=0,g=w.length;c<g;c++)k=w[c],n+=(c?"L":"M")+k.x+" "+k.y;n+=t?G.svg?"z":"x":""}return n||"M0 0"}var Ln=document.documentElement.style,Ai="ActiveXObject"in window,lr=Ai&&!document.addEventListener,Ha="msLaunchUri"in navigator&&!("documentMode"in document),Cn=ot("webkit"),Na=ot("android"),Da=ot("android 2")||ot("android 3"),cr=parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1],10),dr=Na&&ot("Google")&&cr<537&&!("AudioNode"in window),En=!!window.opera,Fa=!Ha&&ot("chrome"),qa=ot("gecko")&&!Cn&&!En&&!Ai,ur=!Fa&&ot("safari"),Ua=ot("phantom"),Za="OTransition"in Ln,pr=navigator.platform.indexOf("Win")===0,Va=Ai&&"transition"in Ln,Sn="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!Da,Ga="MozPerspective"in Ln,hr=!window.L_DISABLE_3D&&(Va||Sn||Ga)&&!Za&&!Ua,ci=typeof orientation<"u"||ot("mobile"),mr=ci&&Cn,fr=ci&&Sn,Wa=!window.PointerEvent&&window.MSPointerEvent,Ka=!!(window.PointerEvent||Wa),Ja="ontouchstart"in window||!!window.TouchEvent,gr=!window.L_NO_TOUCH&&(Ja||Ka),vr=ci&&En,yr=ci&&qa,br=(window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI)>1,xr=function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("testPassiveEventSupport",y,t),window.removeEventListener("testPassiveEventSupport",y,t)}catch{}return e}(),_r=function(){return!!document.createElement("canvas").getContext}(),Tn=!!(document.createElementNS&&Oa("svg").createSVGRect),wr=!!Tn&&function(){var e=document.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==="http://www.w3.org/2000/svg"}(),kr=!Tn&&function(){try{var e=document.createElement("div");e.innerHTML='<v:shape adj="1"/>';var t=e.firstChild;return t.style.behavior="url(#default#VML)",t&&typeof t.adj=="object"}catch{return!1}}(),zr=navigator.platform.indexOf("Mac")===0,Lr=navigator.platform.indexOf("Linux")===0;function ot(e){return navigator.userAgent.toLowerCase().indexOf(e)>=0}var G={ie:Ai,ielt9:lr,edge:Ha,webkit:Cn,android:Na,android23:Da,androidStock:dr,opera:En,chrome:Fa,gecko:qa,safari:ur,phantom:Ua,opera12:Za,win:pr,ie3d:Va,webkit3d:Sn,gecko3d:Ga,any3d:hr,mobile:ci,mobileWebkit:mr,mobileWebkit3d:fr,msPointer:Wa,pointer:Ka,touch:gr,touchNative:Ja,mobileOpera:vr,mobileGecko:yr,retina:br,passiveEvents:xr,canvas:_r,svg:Tn,vml:kr,inlineSvg:wr,mac:zr,linux:Lr},Ya=G.msPointer?"MSPointerDown":"pointerdown",Xa=G.msPointer?"MSPointerMove":"pointermove",Qa=G.msPointer?"MSPointerUp":"pointerup",eo=G.msPointer?"MSPointerCancel":"pointercancel",$n={touchstart:Ya,touchmove:Xa,touchend:Qa,touchcancel:eo},to={touchstart:Mr,touchmove:Bi,touchend:Bi,touchcancel:Bi},Ft={},io=!1;function Cr(e,t,n){return t==="touchstart"&&$r(),to[t]?(n=to[t].bind(this,n),e.addEventListener($n[t],n,!1),n):(console.warn("wrong event specified:",t),y)}function Er(e,t,n){if(!$n[t]){console.warn("wrong event specified:",t);return}e.removeEventListener($n[t],n,!1)}function Sr(e){Ft[e.pointerId]=e}function Tr(e){Ft[e.pointerId]&&(Ft[e.pointerId]=e)}function no(e){delete Ft[e.pointerId]}function $r(){io||(document.addEventListener(Ya,Sr,!0),document.addEventListener(Xa,Tr,!0),document.addEventListener(Qa,no,!0),document.addEventListener(eo,no,!0),io=!0)}function Bi(e,t){if(t.pointerType!==(t.MSPOINTER_TYPE_MOUSE||"mouse")){t.touches=[];for(var n in Ft)t.touches.push(Ft[n]);t.changedTouches=[t],e(t)}}function Mr(e,t){t.MSPOINTER_TYPE_TOUCH&&t.pointerType===t.MSPOINTER_TYPE_TOUCH&&Be(t),Bi(e,t)}function Ir(e){var t={},n,s;for(s in e)n=e[s],t[s]=n&&n.bind?n.bind(e):n;return e=t,t.type="dblclick",t.detail=2,t.isTrusted=!1,t._simulated=!0,t}var Pr=200;function Ar(e,t){e.addEventListener("dblclick",t);var n=0,s;function c(h){if(h.detail!==1){s=h.detail;return}if(!(h.pointerType==="mouse"||h.sourceCapabilities&&!h.sourceCapabilities.firesTouchEvents)){var g=lo(h);if(!(g.some(function(k){return k instanceof HTMLLabelElement&&k.attributes.for})&&!g.some(function(k){return k instanceof HTMLInputElement||k instanceof HTMLSelectElement}))){var w=Date.now();w-n<=Pr?(s++,s===2&&t(Ir(h))):s=1,n=w}}}return e.addEventListener("click",c),{dblclick:t,simDblclick:c}}function Br(e,t){e.removeEventListener("dblclick",t.dblclick),e.removeEventListener("click",t.simDblclick)}var Mn=ji(["transform","webkitTransform","OTransform","MozTransform","msTransform"]),di=ji(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),ao=di==="webkitTransition"||di==="OTransition"?di+"End":"transitionend";function oo(e){return typeof e=="string"?document.getElementById(e):e}function ui(e,t){var n=e.style[t]||e.currentStyle&&e.currentStyle[t];if((!n||n==="auto")&&document.defaultView){var s=document.defaultView.getComputedStyle(e,null);n=s?s[t]:null}return n==="auto"?null:n}function me(e,t,n){var s=document.createElement(e);return s.className=t||"",n&&n.appendChild(s),s}function ze(e){var t=e.parentNode;t&&t.removeChild(e)}function Ri(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function qt(e){var t=e.parentNode;t&&t.lastChild!==e&&t.appendChild(e)}function Ut(e){var t=e.parentNode;t&&t.firstChild!==e&&t.insertBefore(e,t.firstChild)}function In(e,t){if(e.classList!==void 0)return e.classList.contains(t);var n=Oi(e);return n.length>0&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(n)}function oe(e,t){if(e.classList!==void 0)for(var n=z(t),s=0,c=n.length;s<c;s++)e.classList.add(n[s]);else if(!In(e,t)){var h=Oi(e);Pn(e,(h?h+" ":"")+t)}}function Te(e,t){e.classList!==void 0?e.classList.remove(t):Pn(e,x((" "+Oi(e)+" ").replace(" "+t+" "," ")))}function Pn(e,t){e.className.baseVal===void 0?e.className=t:e.className.baseVal=t}function Oi(e){return e.correspondingElement&&(e=e.correspondingElement),e.className.baseVal===void 0?e.className:e.className.baseVal}function Je(e,t){"opacity"in e.style?e.style.opacity=t:"filter"in e.style&&Rr(e,t)}function Rr(e,t){var n=!1,s="DXImageTransform.Microsoft.Alpha";try{n=e.filters.item(s)}catch{if(t===1)return}t=Math.round(t*100),n?(n.Enabled=t!==100,n.Opacity=t):e.style.filter+=" progid:"+s+"(opacity="+t+")"}function ji(e){for(var t=document.documentElement.style,n=0;n<e.length;n++)if(e[n]in t)return e[n];return!1}function Tt(e,t,n){var s=t||new O(0,0);e.style[Mn]=(G.ie3d?"translate("+s.x+"px,"+s.y+"px)":"translate3d("+s.x+"px,"+s.y+"px,0)")+(n?" scale("+n+")":"")}function $e(e,t){e._leaflet_pos=t,G.any3d?Tt(e,t):(e.style.left=t.x+"px",e.style.top=t.y+"px")}function $t(e){return e._leaflet_pos||new O(0,0)}var pi,hi,An;if("onselectstart"in document)pi=function(){te(window,"selectstart",Be)},hi=function(){we(window,"selectstart",Be)};else{var mi=ji(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);pi=function(){if(mi){var e=document.documentElement.style;An=e[mi],e[mi]="none"}},hi=function(){mi&&(document.documentElement.style[mi]=An,An=void 0)}}function Bn(){te(window,"dragstart",Be)}function Rn(){we(window,"dragstart",Be)}var Hi,On;function jn(e){for(;e.tabIndex===-1;)e=e.parentNode;e.style&&(Ni(),Hi=e,On=e.style.outlineStyle,e.style.outlineStyle="none",te(window,"keydown",Ni))}function Ni(){Hi&&(Hi.style.outlineStyle=On,Hi=void 0,On=void 0,we(window,"keydown",Ni))}function so(e){do e=e.parentNode;while((!e.offsetWidth||!e.offsetHeight)&&e!==document.body);return e}function Hn(e){var t=e.getBoundingClientRect();return{x:t.width/e.offsetWidth||1,y:t.height/e.offsetHeight||1,boundingClientRect:t}}var Or={__proto__:null,TRANSFORM:Mn,TRANSITION:di,TRANSITION_END:ao,get:oo,getStyle:ui,create:me,remove:ze,empty:Ri,toFront:qt,toBack:Ut,hasClass:In,addClass:oe,removeClass:Te,setClass:Pn,getClass:Oi,setOpacity:Je,testProp:ji,setTransform:Tt,setPosition:$e,getPosition:$t,get disableTextSelection(){return pi},get enableTextSelection(){return hi},disableImageDrag:Bn,enableImageDrag:Rn,preventOutline:jn,restoreOutline:Ni,getSizedParentNode:so,getScale:Hn};function te(e,t,n,s){if(t&&typeof t=="object")for(var c in t)Dn(e,c,t[c],n);else{t=z(t);for(var h=0,g=t.length;h<g;h++)Dn(e,t[h],n,s)}return this}var st="_leaflet_events";function we(e,t,n,s){if(arguments.length===1)ro(e),delete e[st];else if(t&&typeof t=="object")for(var c in t)Fn(e,c,t[c],n);else if(t=z(t),arguments.length===2)ro(e,function(w){return H(t,w)!==-1});else for(var h=0,g=t.length;h<g;h++)Fn(e,t[h],n,s);return this}function ro(e,t){for(var n in e[st]){var s=n.split(/\d/)[0];(!t||t(s))&&Fn(e,s,null,null,n)}}var Nn={mouseenter:"mouseover",mouseleave:"mouseout",wheel:!("onwheel"in window)&&"mousewheel"};function Dn(e,t,n,s){var c=t+m(n)+(s?"_"+m(s):"");if(e[st]&&e[st][c])return this;var h=function(w){return n.call(s||e,w||window.event)},g=h;!G.touchNative&&G.pointer&&t.indexOf("touch")===0?h=Cr(e,t,h):G.touch&&t==="dblclick"?h=Ar(e,h):"addEventListener"in e?t==="touchstart"||t==="touchmove"||t==="wheel"||t==="mousewheel"?e.addEventListener(Nn[t]||t,h,G.passiveEvents?{passive:!1}:!1):t==="mouseenter"||t==="mouseleave"?(h=function(w){w=w||window.event,Un(e,w)&&g(w)},e.addEventListener(Nn[t],h,!1)):e.addEventListener(t,g,!1):e.attachEvent("on"+t,h),e[st]=e[st]||{},e[st][c]=h}function Fn(e,t,n,s,c){c=c||t+m(n)+(s?"_"+m(s):"");var h=e[st]&&e[st][c];if(!h)return this;!G.touchNative&&G.pointer&&t.indexOf("touch")===0?Er(e,t,h):G.touch&&t==="dblclick"?Br(e,h):"removeEventListener"in e?e.removeEventListener(Nn[t]||t,h,!1):e.detachEvent("on"+t,h),e[st][c]=null}function Mt(e){return e.stopPropagation?e.stopPropagation():e.originalEvent?e.originalEvent._stopped=!0:e.cancelBubble=!0,this}function qn(e){return Dn(e,"wheel",Mt),this}function fi(e){return te(e,"mousedown touchstart dblclick contextmenu",Mt),e._leaflet_disable_click=!0,this}function Be(e){return e.preventDefault?e.preventDefault():e.returnValue=!1,this}function It(e){return Be(e),Mt(e),this}function lo(e){if(e.composedPath)return e.composedPath();for(var t=[],n=e.target;n;)t.push(n),n=n.parentNode;return t}function co(e,t){if(!t)return new O(e.clientX,e.clientY);var n=Hn(t),s=n.boundingClientRect;return new O((e.clientX-s.left)/n.x-t.clientLeft,(e.clientY-s.top)/n.y-t.clientTop)}var jr=G.linux&&G.chrome?window.devicePixelRatio:G.mac?window.devicePixelRatio*3:window.devicePixelRatio>0?2*window.devicePixelRatio:1;function uo(e){return G.edge?e.wheelDeltaY/2:e.deltaY&&e.deltaMode===0?-e.deltaY/jr:e.deltaY&&e.deltaMode===1?-e.deltaY*20:e.deltaY&&e.deltaMode===2?-e.deltaY*60:e.deltaX||e.deltaZ?0:e.wheelDelta?(e.wheelDeltaY||e.wheelDelta)/2:e.detail&&Math.abs(e.detail)<32765?-e.detail*20:e.detail?e.detail/-32765*60:0}function Un(e,t){var n=t.relatedTarget;if(!n)return!0;try{for(;n&&n!==e;)n=n.parentNode}catch{return!1}return n!==e}var Hr={__proto__:null,on:te,off:we,stopPropagation:Mt,disableScrollPropagation:qn,disableClickPropagation:fi,preventDefault:Be,stop:It,getPropagationPath:lo,getMousePosition:co,getWheelDelta:uo,isExternalTarget:Un,addListener:te,removeListener:we},po=J.extend({run:function(e,t,n,s){this.stop(),this._el=e,this._inProgress=!0,this._duration=n||.25,this._easeOutPower=1/Math.max(s||.5,.2),this._startPos=$t(e),this._offset=t.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=F(this._animate,this),this._step()},_step:function(e){var t=+new Date-this._startTime,n=this._duration*1e3;t<n?this._runFrame(this._easeOut(t/n),e):(this._runFrame(1),this._complete())},_runFrame:function(e,t){var n=this._startPos.add(this._offset.multiplyBy(e));t&&n._round(),$e(this._el,n),this.fire("step")},_complete:function(){ee(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(e){return 1-Math.pow(1-e,this._easeOutPower)}}),ue=J.extend({options:{crs:zn,center:void 0,zoom:void 0,minZoom:void 0,maxZoom:void 0,layers:[],maxBounds:void 0,renderer:void 0,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:!0},initialize:function(e,t){t=_(this,t),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this._initContainer(e),this._initLayout(),this._onResize=u(this._onResize,this),this._initEvents(),t.maxBounds&&this.setMaxBounds(t.maxBounds),t.zoom!==void 0&&(this._zoom=this._limitZoom(t.zoom)),t.center&&t.zoom!==void 0&&this.setView(Y(t.center),t.zoom,{reset:!0}),this.callInitHooks(),this._zoomAnimated=di&&G.any3d&&!G.mobileOpera&&this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),te(this._proxy,ao,this._catchTransitionEnd,this)),this._addLayers(this.options.layers)},setView:function(e,t,n){if(t=t===void 0?this._zoom:this._limitZoom(t),e=this._limitCenter(Y(e),t,this.options.maxBounds),n=n||{},this._stop(),this._loaded&&!n.reset&&n!==!0){n.animate!==void 0&&(n.zoom=l({animate:n.animate},n.zoom),n.pan=l({animate:n.animate,duration:n.duration},n.pan));var s=this._zoom!==t?this._tryAnimatedZoom&&this._tryAnimatedZoom(e,t,n.zoom):this._tryAnimatedPan(e,n.pan);if(s)return clearTimeout(this._sizeTimer),this}return this._resetView(e,t,n.pan&&n.pan.noMoveStart),this},setZoom:function(e,t){return this._loaded?this.setView(this.getCenter(),e,{zoom:t}):(this._zoom=e,this)},zoomIn:function(e,t){return e=e||(G.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom+e,t)},zoomOut:function(e,t){return e=e||(G.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom-e,t)},setZoomAround:function(e,t,n){var s=this.getZoomScale(t),c=this.getSize().divideBy(2),h=e instanceof O?e:this.latLngToContainerPoint(e),g=h.subtract(c).multiplyBy(1-1/s),w=this.containerPointToLatLng(c.add(g));return this.setView(w,t,{zoom:n})},_getBoundsCenterZoom:function(e,t){t=t||{},e=e.getBounds?e.getBounds():ae(e);var n=R(t.paddingTopLeft||t.padding||[0,0]),s=R(t.paddingBottomRight||t.padding||[0,0]),c=this.getBoundsZoom(e,!1,n.add(s));if(c=typeof t.maxZoom=="number"?Math.min(t.maxZoom,c):c,c===1/0)return{center:e.getCenter(),zoom:c};var h=s.subtract(n).divideBy(2),g=this.project(e.getSouthWest(),c),w=this.project(e.getNorthEast(),c),k=this.unproject(g.add(w).divideBy(2).add(h),c);return{center:k,zoom:c}},fitBounds:function(e,t){if(e=ae(e),!e.isValid())throw new Error("Bounds are not valid.");var n=this._getBoundsCenterZoom(e,t);return this.setView(n.center,n.zoom,t)},fitWorld:function(e){return this.fitBounds([[-90,-180],[90,180]],e)},panTo:function(e,t){return this.setView(e,this._zoom,{pan:t})},panBy:function(e,t){if(e=R(e).round(),t=t||{},!e.x&&!e.y)return this.fire("moveend");if(t.animate!==!0&&!this.getSize().contains(e))return this._resetView(this.unproject(this.project(this.getCenter()).add(e)),this.getZoom()),this;if(this._panAnim||(this._panAnim=new po,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),t.noMoveStart||this.fire("movestart"),t.animate!==!1){oe(this._mapPane,"leaflet-pan-anim");var n=this._getMapPanePos().subtract(e).round();this._panAnim.run(this._mapPane,n,t.duration||.25,t.easeLinearity)}else this._rawPanBy(e),this.fire("move").fire("moveend");return this},flyTo:function(e,t,n){if(n=n||{},n.animate===!1||!G.any3d)return this.setView(e,t,n);this._stop();var s=this.project(this.getCenter()),c=this.project(e),h=this.getSize(),g=this._zoom;e=Y(e),t=t===void 0?g:t;var w=Math.max(h.x,h.y),k=w*this.getZoomScale(g,t),M=c.distanceTo(s)||1,j=1.42,W=j*j;function le(Me){var Xi=Me?-1:1,El=Me?k:w,Sl=k*k-w*w+Xi*W*W*M*M,Tl=2*El*W*M,ta=Sl/Tl,Vo=Math.sqrt(ta*ta+1)-ta,$l=Vo<1e-9?-18:Math.log(Vo);return $l}function Re(Me){return(Math.exp(Me)-Math.exp(-Me))/2}function Ae(Me){return(Math.exp(Me)+Math.exp(-Me))/2}function Xe(Me){return Re(Me)/Ae(Me)}var He=le(0);function Jt(Me){return w*(Ae(He)/Ae(He+j*Me))}function kl(Me){return w*(Ae(He)*Xe(He+j*Me)-Re(He))/W}function zl(Me){return 1-Math.pow(1-Me,1.5)}var Ll=Date.now(),Uo=(le(1)-He)/j,Cl=n.duration?1e3*n.duration:1e3*Uo*.8;function Zo(){var Me=(Date.now()-Ll)/Cl,Xi=zl(Me)*Uo;Me<=1?(this._flyToFrame=F(Zo,this),this._move(this.unproject(s.add(c.subtract(s).multiplyBy(kl(Xi)/M)),g),this.getScaleZoom(w/Jt(Xi),g),{flyTo:!0})):this._move(e,t)._moveEnd(!0)}return this._moveStart(!0,n.noMoveStart),Zo.call(this),this},flyToBounds:function(e,t){var n=this._getBoundsCenterZoom(e,t);return this.flyTo(n.center,n.zoom,t)},setMaxBounds:function(e){return e=ae(e),this.listens("moveend",this._panInsideMaxBounds)&&this.off("moveend",this._panInsideMaxBounds),e.isValid()?(this.options.maxBounds=e,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):(this.options.maxBounds=null,this)},setMinZoom:function(e){var t=this.options.minZoom;return this.options.minZoom=e,this._loaded&&t!==e&&(this.fire("zoomlevelschange"),this.getZoom()<this.options.minZoom)?this.setZoom(e):this},setMaxZoom:function(e){var t=this.options.maxZoom;return this.options.maxZoom=e,this._loaded&&t!==e&&(this.fire("zoomlevelschange"),this.getZoom()>this.options.maxZoom)?this.setZoom(e):this},panInsideBounds:function(e,t){this._enforcingBounds=!0;var n=this.getCenter(),s=this._limitCenter(n,this._zoom,ae(e));return n.equals(s)||this.panTo(s,t),this._enforcingBounds=!1,this},panInside:function(e,t){t=t||{};var n=R(t.paddingTopLeft||t.padding||[0,0]),s=R(t.paddingBottomRight||t.padding||[0,0]),c=this.project(this.getCenter()),h=this.project(e),g=this.getPixelBounds(),w=re([g.min.add(n),g.max.subtract(s)]),k=w.getSize();if(!w.contains(h)){this._enforcingBounds=!0;var M=h.subtract(w.getCenter()),j=w.extend(h).getSize().subtract(k);c.x+=M.x<0?-j.x:j.x,c.y+=M.y<0?-j.y:j.y,this.panTo(this.unproject(c),t),this._enforcingBounds=!1}return this},invalidateSize:function(e){if(!this._loaded)return this;e=l({animate:!1,pan:!0},e===!0?{animate:!0}:e);var t=this.getSize();this._sizeChanged=!0,this._lastCenter=null;var n=this.getSize(),s=t.divideBy(2).round(),c=n.divideBy(2).round(),h=s.subtract(c);return!h.x&&!h.y?this:(e.animate&&e.pan?this.panBy(h):(e.pan&&this._rawPanBy(h),this.fire("move"),e.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(u(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:t,newSize:n}))},stop:function(){return this.setZoom(this._limitZoom(this._zoom)),this.options.zoomSnap||this.fire("viewreset"),this._stop()},locate:function(e){if(e=this._locateOptions=l({timeout:1e4,watch:!1},e),!("geolocation"in navigator))return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var t=u(this._handleGeolocationResponse,this),n=u(this._handleGeolocationError,this);return e.watch?this._locationWatchId=navigator.geolocation.watchPosition(t,n,e):navigator.geolocation.getCurrentPosition(t,n,e),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(e){if(this._container._leaflet_id){var t=e.code,n=e.message||(t===1?"permission denied":t===2?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:t,message:"Geolocation error: "+n+"."})}},_handleGeolocationResponse:function(e){if(this._container._leaflet_id){var t=e.coords.latitude,n=e.coords.longitude,s=new de(t,n),c=s.toBounds(e.coords.accuracy*2),h=this._locateOptions;if(h.setView){var g=this.getBoundsZoom(c);this.setView(s,h.maxZoom?Math.min(g,h.maxZoom):g)}var w={latlng:s,bounds:c,timestamp:e.timestamp};for(var k in e.coords)typeof e.coords[k]=="number"&&(w[k]=e.coords[k]);this.fire("locationfound",w)}},addHandler:function(e,t){if(!t)return this;var n=this[e]=new t(this);return this._handlers.push(n),this.options[e]&&n.enable(),this},remove:function(){if(this._initEvents(!0),this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this._containerId!==this._container._leaflet_id)throw new Error("Map container is being reused by another instance");try{delete this._container._leaflet_id,delete this._containerId}catch{this._container._leaflet_id=void 0,this._containerId=void 0}this._locationWatchId!==void 0&&this.stopLocate(),this._stop(),ze(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._resizeRequest&&(ee(this._resizeRequest),this._resizeRequest=null),this._clearHandlers(),this._loaded&&this.fire("unload");var e;for(e in this._layers)this._layers[e].remove();for(e in this._panes)ze(this._panes[e]);return this._layers=[],this._panes=[],delete this._mapPane,delete this._renderer,this},createPane:function(e,t){var n="leaflet-pane"+(e?" leaflet-"+e.replace("Pane","")+"-pane":""),s=me("div",n,t||this._mapPane);return e&&(this._panes[e]=s),s},getCenter:function(){return this._checkIfLoaded(),this._lastCenter&&!this._moved()?this._lastCenter.clone():this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var e=this.getPixelBounds(),t=this.unproject(e.getBottomLeft()),n=this.unproject(e.getTopRight());return new ce(t,n)},getMinZoom:function(){return this.options.minZoom===void 0?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===void 0?this._layersMaxZoom===void 0?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(e,t,n){e=ae(e),n=R(n||[0,0]);var s=this.getZoom()||0,c=this.getMinZoom(),h=this.getMaxZoom(),g=e.getNorthWest(),w=e.getSouthEast(),k=this.getSize().subtract(n),M=re(this.project(w,s),this.project(g,s)).getSize(),j=G.any3d?this.options.zoomSnap:1,W=k.x/M.x,le=k.y/M.y,Re=t?Math.max(W,le):Math.min(W,le);return s=this.getScaleZoom(Re,s),j&&(s=Math.round(s/(j/100))*(j/100),s=t?Math.ceil(s/j)*j:Math.floor(s/j)*j),Math.max(c,Math.min(h,s))},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new O(this._container.clientWidth||0,this._container.clientHeight||0),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(e,t){var n=this._getTopLeftPoint(e,t);return new V(n,n.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(e){return this.options.crs.getProjectedBounds(e===void 0?this.getZoom():e)},getPane:function(e){return typeof e=="string"?this._panes[e]:e},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(e,t){var n=this.options.crs;return t=t===void 0?this._zoom:t,n.scale(e)/n.scale(t)},getScaleZoom:function(e,t){var n=this.options.crs;t=t===void 0?this._zoom:t;var s=n.zoom(e*n.scale(t));return isNaN(s)?1/0:s},project:function(e,t){return t=t===void 0?this._zoom:t,this.options.crs.latLngToPoint(Y(e),t)},unproject:function(e,t){return t=t===void 0?this._zoom:t,this.options.crs.pointToLatLng(R(e),t)},layerPointToLatLng:function(e){var t=R(e).add(this.getPixelOrigin());return this.unproject(t)},latLngToLayerPoint:function(e){var t=this.project(Y(e))._round();return t._subtract(this.getPixelOrigin())},wrapLatLng:function(e){return this.options.crs.wrapLatLng(Y(e))},wrapLatLngBounds:function(e){return this.options.crs.wrapLatLngBounds(ae(e))},distance:function(e,t){return this.options.crs.distance(Y(e),Y(t))},containerPointToLayerPoint:function(e){return R(e).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(e){return R(e).add(this._getMapPanePos())},containerPointToLatLng:function(e){var t=this.containerPointToLayerPoint(R(e));return this.layerPointToLatLng(t)},latLngToContainerPoint:function(e){return this.layerPointToContainerPoint(this.latLngToLayerPoint(Y(e)))},mouseEventToContainerPoint:function(e){return co(e,this._container)},mouseEventToLayerPoint:function(e){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e))},mouseEventToLatLng:function(e){return this.layerPointToLatLng(this.mouseEventToLayerPoint(e))},_initContainer:function(e){var t=this._container=oo(e);if(t){if(t._leaflet_id)throw new Error("Map container is already initialized.")}else throw new Error("Map container not found.");te(t,"scroll",this._onScroll,this),this._containerId=m(t)},_initLayout:function(){var e=this._container;this._fadeAnimated=this.options.fadeAnimation&&G.any3d,oe(e,"leaflet-container"+(G.touch?" leaflet-touch":"")+(G.retina?" leaflet-retina":"")+(G.ielt9?" leaflet-oldie":"")+(G.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":""));var t=ui(e,"position");t!=="absolute"&&t!=="relative"&&t!=="fixed"&&t!=="sticky"&&(e.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var e=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),$e(this._mapPane,new O(0,0)),this.createPane("tilePane"),this.createPane("overlayPane"),this.createPane("shadowPane"),this.createPane("markerPane"),this.createPane("tooltipPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||(oe(e.markerPane,"leaflet-zoom-hide"),oe(e.shadowPane,"leaflet-zoom-hide"))},_resetView:function(e,t,n){$e(this._mapPane,new O(0,0));var s=!this._loaded;this._loaded=!0,t=this._limitZoom(t),this.fire("viewprereset");var c=this._zoom!==t;this._moveStart(c,n)._move(e,t)._moveEnd(c),this.fire("viewreset"),s&&this.fire("load")},_moveStart:function(e,t){return e&&this.fire("zoomstart"),t||this.fire("movestart"),this},_move:function(e,t,n,s){t===void 0&&(t=this._zoom);var c=this._zoom!==t;return this._zoom=t,this._lastCenter=e,this._pixelOrigin=this._getNewPixelOrigin(e),s?n&&n.pinch&&this.fire("zoom",n):((c||n&&n.pinch)&&this.fire("zoom",n),this.fire("move",n)),this},_moveEnd:function(e){return e&&this.fire("zoomend"),this.fire("moveend")},_stop:function(){return ee(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},_rawPanBy:function(e){$e(this._mapPane,this._getMapPanePos().subtract(e))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this._enforcingBounds||this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(e){this._targets={},this._targets[m(this._container)]=this;var t=e?we:te;t(this._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",this._handleDOMEvent,this),this.options.trackResize&&t(window,"resize",this._onResize,this),G.any3d&&this.options.transform3DLimit&&(e?this.off:this.on).call(this,"moveend",this._onMoveEnd)},_onResize:function(){ee(this._resizeRequest),this._resizeRequest=F(function(){this.invalidateSize({debounceMoveend:!0})},this)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_onMoveEnd:function(){var e=this._getMapPanePos();Math.max(Math.abs(e.x),Math.abs(e.y))>=this.options.transform3DLimit&&this._resetView(this.getCenter(),this.getZoom())},_findEventTargets:function(e,t){for(var n=[],s,c=t==="mouseout"||t==="mouseover",h=e.target||e.srcElement,g=!1;h;){if(s=this._targets[m(h)],s&&(t==="click"||t==="preclick")&&this._draggableMoved(s)){g=!0;break}if(s&&s.listens(t,!0)&&(c&&!Un(h,e)||(n.push(s),c))||h===this._container)break;h=h.parentNode}return!n.length&&!g&&!c&&this.listens(t,!0)&&(n=[this]),n},_isClickDisabled:function(e){for(;e&&e!==this._container;){if(e._leaflet_disable_click)return!0;e=e.parentNode}},_handleDOMEvent:function(e){var t=e.target||e.srcElement;if(!(!this._loaded||t._leaflet_disable_events||e.type==="click"&&this._isClickDisabled(t))){var n=e.type;n==="mousedown"&&jn(t),this._fireDOMEvent(e,n)}},_mouseEvents:["click","dblclick","mouseover","mouseout","contextmenu"],_fireDOMEvent:function(e,t,n){if(e.type==="click"){var s=l({},e);s.type="preclick",this._fireDOMEvent(s,s.type,n)}var c=this._findEventTargets(e,t);if(n){for(var h=[],g=0;g<n.length;g++)n[g].listens(t,!0)&&h.push(n[g]);c=h.concat(c)}if(c.length){t==="contextmenu"&&Be(e);var w=c[0],k={originalEvent:e};if(e.type!=="keypress"&&e.type!=="keydown"&&e.type!=="keyup"){var M=w.getLatLng&&(!w._radius||w._radius<=10);k.containerPoint=M?this.latLngToContainerPoint(w.getLatLng()):this.mouseEventToContainerPoint(e),k.layerPoint=this.containerPointToLayerPoint(k.containerPoint),k.latlng=M?w.getLatLng():this.layerPointToLatLng(k.layerPoint)}for(g=0;g<c.length;g++)if(c[g].fire(t,k,!0),k.originalEvent._stopped||c[g].options.bubblingMouseEvents===!1&&H(this._mouseEvents,t)!==-1)return}},_draggableMoved:function(e){return e=e.dragging&&e.dragging.enabled()?e:this,e.dragging&&e.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var e=0,t=this._handlers.length;e<t;e++)this._handlers[e].disable()},whenReady:function(e,t){return this._loaded?e.call(t||this,{target:this}):this.on("load",e,t),this},_getMapPanePos:function(){return $t(this._mapPane)||new O(0,0)},_moved:function(){var e=this._getMapPanePos();return e&&!e.equals([0,0])},_getTopLeftPoint:function(e,t){var n=e&&t!==void 0?this._getNewPixelOrigin(e,t):this.getPixelOrigin();return n.subtract(this._getMapPanePos())},_getNewPixelOrigin:function(e,t){var n=this.getSize()._divideBy(2);return this.project(e,t)._subtract(n)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(e,t,n){var s=this._getNewPixelOrigin(n,t);return this.project(e,t)._subtract(s)},_latLngBoundsToNewLayerBounds:function(e,t,n){var s=this._getNewPixelOrigin(n,t);return re([this.project(e.getSouthWest(),t)._subtract(s),this.project(e.getNorthWest(),t)._subtract(s),this.project(e.getSouthEast(),t)._subtract(s),this.project(e.getNorthEast(),t)._subtract(s)])},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(e){return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint())},_limitCenter:function(e,t,n){if(!n)return e;var s=this.project(e,t),c=this.getSize().divideBy(2),h=new V(s.subtract(c),s.add(c)),g=this._getBoundsOffset(h,n,t);return Math.abs(g.x)<=1&&Math.abs(g.y)<=1?e:this.unproject(s.add(g),t)},_limitOffset:function(e,t){if(!t)return e;var n=this.getPixelBounds(),s=new V(n.min.add(e),n.max.add(e));return e.add(this._getBoundsOffset(s,t))},_getBoundsOffset:function(e,t,n){var s=re(this.project(t.getNorthEast(),n),this.project(t.getSouthWest(),n)),c=s.min.subtract(e.min),h=s.max.subtract(e.max),g=this._rebound(c.x,-h.x),w=this._rebound(c.y,-h.y);return new O(g,w)},_rebound:function(e,t){return e+t>0?Math.round(e-t)/2:Math.max(0,Math.ceil(e))-Math.max(0,Math.floor(t))},_limitZoom:function(e){var t=this.getMinZoom(),n=this.getMaxZoom(),s=G.any3d?this.options.zoomSnap:1;return s&&(e=Math.round(e/s)*s),Math.max(t,Math.min(n,e))},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){Te(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(e,t){var n=this._getCenterOffset(e)._trunc();return(t&&t.animate)!==!0&&!this.getSize().contains(n)?!1:(this.panBy(n,t),!0)},_createAnimProxy:function(){var e=this._proxy=me("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(e),this.on("zoomanim",function(t){var n=Mn,s=this._proxy.style[n];Tt(this._proxy,this.project(t.center,t.zoom),this.getZoomScale(t.zoom,1)),s===this._proxy.style[n]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",this._animMoveEnd,this),this._on("unload",this._destroyAnimProxy,this)},_destroyAnimProxy:function(){ze(this._proxy),this.off("load moveend",this._animMoveEnd,this),delete this._proxy},_animMoveEnd:function(){var e=this.getCenter(),t=this.getZoom();Tt(this._proxy,this.project(e,t),this.getZoomScale(t,1))},_catchTransitionEnd:function(e){this._animatingZoom&&e.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(e,t,n){if(this._animatingZoom)return!0;if(n=n||{},!this._zoomAnimated||n.animate===!1||this._nothingToAnimate()||Math.abs(t-this._zoom)>this.options.zoomAnimationThreshold)return!1;var s=this.getZoomScale(t),c=this._getCenterOffset(e)._divideBy(1-1/s);return n.animate!==!0&&!this.getSize().contains(c)?!1:(F(function(){this._moveStart(!0,n.noMoveStart||!1)._animateZoom(e,t,!0)},this),!0)},_animateZoom:function(e,t,n,s){this._mapPane&&(n&&(this._animatingZoom=!0,this._animateToCenter=e,this._animateToZoom=t,oe(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:e,zoom:t,noUpdate:s}),this._tempFireZoomEvent||(this._tempFireZoomEvent=this._zoom!==this._animateToZoom),this._move(this._animateToCenter,this._animateToZoom,void 0,!0),setTimeout(u(this._onZoomTransitionEnd,this),250))},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._mapPane&&Te(this._mapPane,"leaflet-zoom-anim"),this._animatingZoom=!1,this._move(this._animateToCenter,this._animateToZoom,void 0,!0),this._tempFireZoomEvent&&this.fire("zoom"),delete this._tempFireZoomEvent,this.fire("move"),this._moveEnd(!0))}});function Nr(e,t){return new ue(e,t)}var tt=$.extend({options:{position:"topright"},initialize:function(e){_(this,e)},getPosition:function(){return this.options.position},setPosition:function(e){var t=this._map;return t&&t.removeControl(this),this.options.position=e,t&&t.addControl(this),this},getContainer:function(){return this._container},addTo:function(e){this.remove(),this._map=e;var t=this._container=this.onAdd(e),n=this.getPosition(),s=e._controlCorners[n];return oe(t,"leaflet-control"),n.indexOf("bottom")!==-1?s.insertBefore(t,s.firstChild):s.appendChild(t),this._map.on("unload",this.remove,this),this},remove:function(){return this._map?(ze(this._container),this.onRemove&&this.onRemove(this._map),this._map.off("unload",this.remove,this),this._map=null,this):this},_refocusOnMap:function(e){this._map&&e&&e.screenX>0&&e.screenY>0&&this._map.getContainer().focus()}}),gi=function(e){return new tt(e)};ue.include({addControl:function(e){return e.addTo(this),this},removeControl:function(e){return e.remove(),this},_initControlPos:function(){var e=this._controlCorners={},t="leaflet-",n=this._controlContainer=me("div",t+"control-container",this._container);function s(c,h){var g=t+c+" "+t+h;e[c+h]=me("div",g,n)}s("top","left"),s("top","right"),s("bottom","left"),s("bottom","right")},_clearControlPos:function(){for(var e in this._controlCorners)ze(this._controlCorners[e]);ze(this._controlContainer),delete this._controlCorners,delete this._controlContainer}});var ho=tt.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1,sortLayers:!1,sortFunction:function(e,t,n,s){return n<s?-1:s<n?1:0}},initialize:function(e,t,n){_(this,n),this._layerControlInputs=[],this._layers=[],this._lastZIndex=0,this._handlingClick=!1,this._preventClick=!1;for(var s in e)this._addLayer(e[s],s);for(s in t)this._addLayer(t[s],s,!0)},onAdd:function(e){this._initLayout(),this._update(),this._map=e,e.on("zoomend",this._checkDisabledLayers,this);for(var t=0;t<this._layers.length;t++)this._layers[t].layer.on("add remove",this._onLayerChange,this);return this._container},addTo:function(e){return tt.prototype.addTo.call(this,e),this._expandIfNotCollapsed()},onRemove:function(){this._map.off("zoomend",this._checkDisabledLayers,this);for(var e=0;e<this._layers.length;e++)this._layers[e].layer.off("add remove",this._onLayerChange,this)},addBaseLayer:function(e,t){return this._addLayer(e,t),this._map?this._update():this},addOverlay:function(e,t){return this._addLayer(e,t,!0),this._map?this._update():this},removeLayer:function(e){e.off("add remove",this._onLayerChange,this);var t=this._getLayer(m(e));return t&&this._layers.splice(this._layers.indexOf(t),1),this._map?this._update():this},expand:function(){oe(this._container,"leaflet-control-layers-expanded"),this._section.style.height=null;var e=this._map.getSize().y-(this._container.offsetTop+50);return e<this._section.clientHeight?(oe(this._section,"leaflet-control-layers-scrollbar"),this._section.style.height=e+"px"):Te(this._section,"leaflet-control-layers-scrollbar"),this._checkDisabledLayers(),this},collapse:function(){return Te(this._container,"leaflet-control-layers-expanded"),this},_initLayout:function(){var e="leaflet-control-layers",t=this._container=me("div",e),n=this.options.collapsed;t.setAttribute("aria-haspopup",!0),fi(t),qn(t);var s=this._section=me("section",e+"-list");n&&(this._map.on("click",this.collapse,this),te(t,{mouseenter:this._expandSafely,mouseleave:this.collapse},this));var c=this._layersLink=me("a",e+"-toggle",t);c.href="#",c.title="Layers",c.setAttribute("role","button"),te(c,{keydown:function(h){h.keyCode===13&&this._expandSafely()},click:function(h){Be(h),this._expandSafely()}},this),n||this.expand(),this._baseLayersList=me("div",e+"-base",s),this._separator=me("div",e+"-separator",s),this._overlaysList=me("div",e+"-overlays",s),t.appendChild(s)},_getLayer:function(e){for(var t=0;t<this._layers.length;t++)if(this._layers[t]&&m(this._layers[t].layer)===e)return this._layers[t]},_addLayer:function(e,t,n){this._map&&e.on("add remove",this._onLayerChange,this),this._layers.push({layer:e,name:t,overlay:n}),this.options.sortLayers&&this._layers.sort(u(function(s,c){return this.options.sortFunction(s.layer,c.layer,s.name,c.name)},this)),this.options.autoZIndex&&e.setZIndex&&(this._lastZIndex++,e.setZIndex(this._lastZIndex)),this._expandIfNotCollapsed()},_update:function(){if(!this._container)return this;Ri(this._baseLayersList),Ri(this._overlaysList),this._layerControlInputs=[];var e,t,n,s,c=0;for(n=0;n<this._layers.length;n++)s=this._layers[n],this._addItem(s),t=t||s.overlay,e=e||!s.overlay,c+=s.overlay?0:1;return this.options.hideSingleBase&&(e=e&&c>1,this._baseLayersList.style.display=e?"":"none"),this._separator.style.display=t&&e?"":"none",this},_onLayerChange:function(e){this._handlingClick||this._update();var t=this._getLayer(m(e.target)),n=t.overlay?e.type==="add"?"overlayadd":"overlayremove":e.type==="add"?"baselayerchange":null;n&&this._map.fire(n,t)},_createRadioElement:function(e,t){var n='<input type="radio" class="leaflet-control-layers-selector" name="'+e+'"'+(t?' checked="checked"':"")+"/>",s=document.createElement("div");return s.innerHTML=n,s.firstChild},_addItem:function(e){var t=document.createElement("label"),n=this._map.hasLayer(e.layer),s;e.overlay?(s=document.createElement("input"),s.type="checkbox",s.className="leaflet-control-layers-selector",s.defaultChecked=n):s=this._createRadioElement("leaflet-base-layers_"+m(this),n),this._layerControlInputs.push(s),s.layerId=m(e.layer),te(s,"click",this._onInputClick,this);var c=document.createElement("span");c.innerHTML=" "+e.name;var h=document.createElement("span");t.appendChild(h),h.appendChild(s),h.appendChild(c);var g=e.overlay?this._overlaysList:this._baseLayersList;return g.appendChild(t),this._checkDisabledLayers(),t},_onInputClick:function(){if(!this._preventClick){var e=this._layerControlInputs,t,n,s=[],c=[];this._handlingClick=!0;for(var h=e.length-1;h>=0;h--)t=e[h],n=this._getLayer(t.layerId).layer,t.checked?s.push(n):t.checked||c.push(n);for(h=0;h<c.length;h++)this._map.hasLayer(c[h])&&this._map.removeLayer(c[h]);for(h=0;h<s.length;h++)this._map.hasLayer(s[h])||this._map.addLayer(s[h]);this._handlingClick=!1,this._refocusOnMap()}},_checkDisabledLayers:function(){for(var e=this._layerControlInputs,t,n,s=this._map.getZoom(),c=e.length-1;c>=0;c--)t=e[c],n=this._getLayer(t.layerId).layer,t.disabled=n.options.minZoom!==void 0&&s<n.options.minZoom||n.options.maxZoom!==void 0&&s>n.options.maxZoom},_expandIfNotCollapsed:function(){return this._map&&!this.options.collapsed&&this.expand(),this},_expandSafely:function(){var e=this._section;this._preventClick=!0,te(e,"click",Be),this.expand();var t=this;setTimeout(function(){we(e,"click",Be),t._preventClick=!1})}}),Dr=function(e,t,n){return new ho(e,t,n)},Zn=tt.extend({options:{position:"topleft",zoomInText:'<span aria-hidden="true">+</span>',zoomInTitle:"Zoom in",zoomOutText:'<span aria-hidden="true">&#x2212;</span>',zoomOutTitle:"Zoom out"},onAdd:function(e){var t="leaflet-control-zoom",n=me("div",t+" leaflet-bar"),s=this.options;return this._zoomInButton=this._createButton(s.zoomInText,s.zoomInTitle,t+"-in",n,this._zoomIn),this._zoomOutButton=this._createButton(s.zoomOutText,s.zoomOutTitle,t+"-out",n,this._zoomOut),this._updateDisabled(),e.on("zoomend zoomlevelschange",this._updateDisabled,this),n},onRemove:function(e){e.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(e){!this._disabled&&this._map._zoom<this._map.getMaxZoom()&&this._map.zoomIn(this._map.options.zoomDelta*(e.shiftKey?3:1))},_zoomOut:function(e){!this._disabled&&this._map._zoom>this._map.getMinZoom()&&this._map.zoomOut(this._map.options.zoomDelta*(e.shiftKey?3:1))},_createButton:function(e,t,n,s,c){var h=me("a",n,s);return h.innerHTML=e,h.href="#",h.title=t,h.setAttribute("role","button"),h.setAttribute("aria-label",t),fi(h),te(h,"click",It),te(h,"click",c,this),te(h,"click",this._refocusOnMap,this),h},_updateDisabled:function(){var e=this._map,t="leaflet-disabled";Te(this._zoomInButton,t),Te(this._zoomOutButton,t),this._zoomInButton.setAttribute("aria-disabled","false"),this._zoomOutButton.setAttribute("aria-disabled","false"),(this._disabled||e._zoom===e.getMinZoom())&&(oe(this._zoomOutButton,t),this._zoomOutButton.setAttribute("aria-disabled","true")),(this._disabled||e._zoom===e.getMaxZoom())&&(oe(this._zoomInButton,t),this._zoomInButton.setAttribute("aria-disabled","true"))}});ue.mergeOptions({zoomControl:!0}),ue.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new Zn,this.addControl(this.zoomControl))});var Fr=function(e){return new Zn(e)},mo=tt.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(e){var t="leaflet-control-scale",n=me("div",t),s=this.options;return this._addScales(s,t+"-line",n),e.on(s.updateWhenIdle?"moveend":"move",this._update,this),e.whenReady(this._update,this),n},onRemove:function(e){e.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(e,t,n){e.metric&&(this._mScale=me("div",t,n)),e.imperial&&(this._iScale=me("div",t,n))},_update:function(){var e=this._map,t=e.getSize().y/2,n=e.distance(e.containerPointToLatLng([0,t]),e.containerPointToLatLng([this.options.maxWidth,t]));this._updateScales(n)},_updateScales:function(e){this.options.metric&&e&&this._updateMetric(e),this.options.imperial&&e&&this._updateImperial(e)},_updateMetric:function(e){var t=this._getRoundNum(e),n=t<1e3?t+" m":t/1e3+" km";this._updateScale(this._mScale,n,t/e)},_updateImperial:function(e){var t=e*3.2808399,n,s,c;t>5280?(n=t/5280,s=this._getRoundNum(n),this._updateScale(this._iScale,s+" mi",s/n)):(c=this._getRoundNum(t),this._updateScale(this._iScale,c+" ft",c/t))},_updateScale:function(e,t,n){e.style.width=Math.round(this.options.maxWidth*n)+"px",e.innerHTML=t},_getRoundNum:function(e){var t=Math.pow(10,(Math.floor(e)+"").length-1),n=e/t;return n=n>=10?10:n>=5?5:n>=3?3:n>=2?2:1,t*n}}),qr=function(e){return new mo(e)},Ur='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',Vn=tt.extend({options:{position:"bottomright",prefix:'<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">'+(G.inlineSvg?Ur+" ":"")+"Leaflet</a>"},initialize:function(e){_(this,e),this._attributions={}},onAdd:function(e){e.attributionControl=this,this._container=me("div","leaflet-control-attribution"),fi(this._container);for(var t in e._layers)e._layers[t].getAttribution&&this.addAttribution(e._layers[t].getAttribution());return this._update(),e.on("layeradd",this._addAttribution,this),this._container},onRemove:function(e){e.off("layeradd",this._addAttribution,this)},_addAttribution:function(e){e.layer.getAttribution&&(this.addAttribution(e.layer.getAttribution()),e.layer.once("remove",function(){this.removeAttribution(e.layer.getAttribution())},this))},setPrefix:function(e){return this.options.prefix=e,this._update(),this},addAttribution:function(e){return e?(this._attributions[e]||(this._attributions[e]=0),this._attributions[e]++,this._update(),this):this},removeAttribution:function(e){return e?(this._attributions[e]&&(this._attributions[e]--,this._update()),this):this},_update:function(){if(this._map){var e=[];for(var t in this._attributions)this._attributions[t]&&e.push(t);var n=[];this.options.prefix&&n.push(this.options.prefix),e.length&&n.push(e.join(", ")),this._container.innerHTML=n.join(' <span aria-hidden="true">|</span> ')}}});ue.mergeOptions({attributionControl:!0}),ue.addInitHook(function(){this.options.attributionControl&&new Vn().addTo(this)});var Zr=function(e){return new Vn(e)};tt.Layers=ho,tt.Zoom=Zn,tt.Scale=mo,tt.Attribution=Vn,gi.layers=Dr,gi.zoom=Fr,gi.scale=qr,gi.attribution=Zr;var rt=$.extend({initialize:function(e){this._map=e},enable:function(){return this._enabled?this:(this._enabled=!0,this.addHooks(),this)},disable:function(){return this._enabled?(this._enabled=!1,this.removeHooks(),this):this},enabled:function(){return!!this._enabled}});rt.addTo=function(e,t){return e.addHandler(t,this),this};var Vr={Events:D},fo=G.touch?"touchstart mousedown":"mousedown",_t=J.extend({options:{clickTolerance:3},initialize:function(e,t,n,s){_(this,s),this._element=e,this._dragStartTarget=t||e,this._preventOutline=n},enable:function(){this._enabled||(te(this._dragStartTarget,fo,this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(_t._dragging===this&&this.finishDrag(!0),we(this._dragStartTarget,fo,this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(e){if(this._enabled&&(this._moved=!1,!In(this._element,"leaflet-zoom-anim"))){if(e.touches&&e.touches.length!==1){_t._dragging===this&&this.finishDrag();return}if(!(_t._dragging||e.shiftKey||e.which!==1&&e.button!==1&&!e.touches)&&(_t._dragging=this,this._preventOutline&&jn(this._element),Bn(),pi(),!this._moving)){this.fire("down");var t=e.touches?e.touches[0]:e,n=so(this._element);this._startPoint=new O(t.clientX,t.clientY),this._startPos=$t(this._element),this._parentScale=Hn(n);var s=e.type==="mousedown";te(document,s?"mousemove":"touchmove",this._onMove,this),te(document,s?"mouseup":"touchend touchcancel",this._onUp,this)}}},_onMove:function(e){if(this._enabled){if(e.touches&&e.touches.length>1){this._moved=!0;return}var t=e.touches&&e.touches.length===1?e.touches[0]:e,n=new O(t.clientX,t.clientY)._subtract(this._startPoint);!n.x&&!n.y||Math.abs(n.x)+Math.abs(n.y)<this.options.clickTolerance||(n.x/=this._parentScale.x,n.y/=this._parentScale.y,Be(e),this._moved||(this.fire("dragstart"),this._moved=!0,oe(document.body,"leaflet-dragging"),this._lastTarget=e.target||e.srcElement,window.SVGElementInstance&&this._lastTarget instanceof window.SVGElementInstance&&(this._lastTarget=this._lastTarget.correspondingUseElement),oe(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(n),this._moving=!0,this._lastEvent=e,this._updatePosition())}},_updatePosition:function(){var e={originalEvent:this._lastEvent};this.fire("predrag",e),$e(this._element,this._newPos),this.fire("drag",e)},_onUp:function(){this._enabled&&this.finishDrag()},finishDrag:function(e){Te(document.body,"leaflet-dragging"),this._lastTarget&&(Te(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null),we(document,"mousemove touchmove",this._onMove,this),we(document,"mouseup touchend touchcancel",this._onUp,this),Rn(),hi();var t=this._moved&&this._moving;this._moving=!1,_t._dragging=!1,t&&this.fire("dragend",{noInertia:e,distance:this._newPos.distanceTo(this._startPos)})}});function go(e,t,n){var s,c=[1,4,2,8],h,g,w,k,M,j,W,le;for(h=0,j=e.length;h<j;h++)e[h]._code=Pt(e[h],t);for(w=0;w<4;w++){for(W=c[w],s=[],h=0,j=e.length,g=j-1;h<j;g=h++)k=e[h],M=e[g],k._code&W?M._code&W||(le=Di(M,k,W,t,n),le._code=Pt(le,t),s.push(le)):(M._code&W&&(le=Di(M,k,W,t,n),le._code=Pt(le,t),s.push(le)),s.push(k));e=s}return e}function vo(e,t){var n,s,c,h,g,w,k,M,j;if(!e||e.length===0)throw new Error("latlngs not passed");Ye(e)||(console.warn("latlngs are not flat! Only the first ring will be used"),e=e[0]);var W=Y([0,0]),le=ae(e),Re=le.getNorthWest().distanceTo(le.getSouthWest())*le.getNorthEast().distanceTo(le.getNorthWest());Re<1700&&(W=Gn(e));var Ae=e.length,Xe=[];for(n=0;n<Ae;n++){var He=Y(e[n]);Xe.push(t.project(Y([He.lat-W.lat,He.lng-W.lng])))}for(w=k=M=0,n=0,s=Ae-1;n<Ae;s=n++)c=Xe[n],h=Xe[s],g=c.y*h.x-h.y*c.x,k+=(c.x+h.x)*g,M+=(c.y+h.y)*g,w+=g*3;w===0?j=Xe[0]:j=[k/w,M/w];var Jt=t.unproject(R(j));return Y([Jt.lat+W.lat,Jt.lng+W.lng])}function Gn(e){for(var t=0,n=0,s=0,c=0;c<e.length;c++){var h=Y(e[c]);t+=h.lat,n+=h.lng,s++}return Y([t/s,n/s])}var Gr={__proto__:null,clipPolygon:go,polygonCenter:vo,centroid:Gn};function yo(e,t){if(!t||!e.length)return e.slice();var n=t*t;return e=Jr(e,n),e=Kr(e,n),e}function bo(e,t,n){return Math.sqrt(vi(e,t,n,!0))}function Wr(e,t,n){return vi(e,t,n)}function Kr(e,t){var n=e.length,s=typeof Uint8Array<"u"?Uint8Array:Array,c=new s(n);c[0]=c[n-1]=1,Wn(e,c,t,0,n-1);var h,g=[];for(h=0;h<n;h++)c[h]&&g.push(e[h]);return g}function Wn(e,t,n,s,c){var h=0,g,w,k;for(w=s+1;w<=c-1;w++)k=vi(e[w],e[s],e[c],!0),k>h&&(g=w,h=k);h>n&&(t[g]=1,Wn(e,t,n,s,g),Wn(e,t,n,g,c))}function Jr(e,t){for(var n=[e[0]],s=1,c=0,h=e.length;s<h;s++)Yr(e[s],e[c])>t&&(n.push(e[s]),c=s);return c<h-1&&n.push(e[h-1]),n}var xo;function _o(e,t,n,s,c){var h=s?xo:Pt(e,n),g=Pt(t,n),w,k,M;for(xo=g;;){if(!(h|g))return[e,t];if(h&g)return!1;w=h||g,k=Di(e,t,w,n,c),M=Pt(k,n),w===h?(e=k,h=M):(t=k,g=M)}}function Di(e,t,n,s,c){var h=t.x-e.x,g=t.y-e.y,w=s.min,k=s.max,M,j;return n&8?(M=e.x+h*(k.y-e.y)/g,j=k.y):n&4?(M=e.x+h*(w.y-e.y)/g,j=w.y):n&2?(M=k.x,j=e.y+g*(k.x-e.x)/h):n&1&&(M=w.x,j=e.y+g*(w.x-e.x)/h),new O(M,j,c)}function Pt(e,t){var n=0;return e.x<t.min.x?n|=1:e.x>t.max.x&&(n|=2),e.y<t.min.y?n|=4:e.y>t.max.y&&(n|=8),n}function Yr(e,t){var n=t.x-e.x,s=t.y-e.y;return n*n+s*s}function vi(e,t,n,s){var c=t.x,h=t.y,g=n.x-c,w=n.y-h,k=g*g+w*w,M;return k>0&&(M=((e.x-c)*g+(e.y-h)*w)/k,M>1?(c=n.x,h=n.y):M>0&&(c+=g*M,h+=w*M)),g=e.x-c,w=e.y-h,s?g*g+w*w:new O(c,h)}function Ye(e){return!q(e[0])||typeof e[0][0]!="object"&&typeof e[0][0]<"u"}function wo(e){return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."),Ye(e)}function ko(e,t){var n,s,c,h,g,w,k,M;if(!e||e.length===0)throw new Error("latlngs not passed");Ye(e)||(console.warn("latlngs are not flat! Only the first ring will be used"),e=e[0]);var j=Y([0,0]),W=ae(e),le=W.getNorthWest().distanceTo(W.getSouthWest())*W.getNorthEast().distanceTo(W.getNorthWest());le<1700&&(j=Gn(e));var Re=e.length,Ae=[];for(n=0;n<Re;n++){var Xe=Y(e[n]);Ae.push(t.project(Y([Xe.lat-j.lat,Xe.lng-j.lng])))}for(n=0,s=0;n<Re-1;n++)s+=Ae[n].distanceTo(Ae[n+1])/2;if(s===0)M=Ae[0];else for(n=0,h=0;n<Re-1;n++)if(g=Ae[n],w=Ae[n+1],c=g.distanceTo(w),h+=c,h>s){k=(h-s)/c,M=[w.x-k*(w.x-g.x),w.y-k*(w.y-g.y)];break}var He=t.unproject(R(M));return Y([He.lat+j.lat,He.lng+j.lng])}var Xr={__proto__:null,simplify:yo,pointToSegmentDistance:bo,closestPointOnSegment:Wr,clipSegment:_o,_getEdgeIntersection:Di,_getBitCode:Pt,_sqClosestPointOnSegment:vi,isFlat:Ye,_flat:wo,polylineCenter:ko},Kn={project:function(e){return new O(e.lng,e.lat)},unproject:function(e){return new de(e.y,e.x)},bounds:new V([-180,-90],[180,90])},Jn={R:6378137,R_MINOR:6356752314245179e-9,bounds:new V([-2003750834279e-5,-1549657073972e-5],[2003750834279e-5,1876465623138e-5]),project:function(e){var t=Math.PI/180,n=this.R,s=e.lat*t,c=this.R_MINOR/n,h=Math.sqrt(1-c*c),g=h*Math.sin(s),w=Math.tan(Math.PI/4-s/2)/Math.pow((1-g)/(1+g),h/2);return s=-n*Math.log(Math.max(w,1e-10)),new O(e.lng*t*n,s)},unproject:function(e){for(var t=180/Math.PI,n=this.R,s=this.R_MINOR/n,c=Math.sqrt(1-s*s),h=Math.exp(-e.y/n),g=Math.PI/2-2*Math.atan(h),w=0,k=.1,M;w<15&&Math.abs(k)>1e-7;w++)M=c*Math.sin(g),M=Math.pow((1-M)/(1+M),c/2),k=Math.PI/2-2*Math.atan(h*M)-g,g+=k;return new de(g*t,e.x*t/n)}},Qr={__proto__:null,LonLat:Kn,Mercator:Jn,SphericalMercator:wn},el=l({},xt,{code:"EPSG:3395",projection:Jn,transformation:function(){var e=.5/(Math.PI*Jn.R);return li(e,.5,-e,.5)}()}),zo=l({},xt,{code:"EPSG:4326",projection:Kn,transformation:li(1/180,1,-1/180,.5)}),tl=l({},mt,{projection:Kn,transformation:li(1,0,-1,0),scale:function(e){return Math.pow(2,e)},zoom:function(e){return Math.log(e)/Math.LN2},distance:function(e,t){var n=t.lng-e.lng,s=t.lat-e.lat;return Math.sqrt(n*n+s*s)},infinite:!0});mt.Earth=xt,mt.EPSG3395=el,mt.EPSG3857=zn,mt.EPSG900913=rr,mt.EPSG4326=zo,mt.Simple=tl;var it=J.extend({options:{pane:"overlayPane",attribution:null,bubblingMouseEvents:!0},addTo:function(e){return e.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(e){return e&&e.removeLayer(this),this},getPane:function(e){return this._map.getPane(e?this.options[e]||e:this.options.pane)},addInteractiveTarget:function(e){return this._map._targets[m(e)]=this,this},removeInteractiveTarget:function(e){return delete this._map._targets[m(e)],this},getAttribution:function(){return this.options.attribution},_layerAdd:function(e){var t=e.target;if(t.hasLayer(this)){if(this._map=t,this._zoomAnimated=t._zoomAnimated,this.getEvents){var n=this.getEvents();t.on(n,this),this.once("remove",function(){t.off(n,this)},this)}this.onAdd(t),this.fire("add"),t.fire("layeradd",{layer:this})}}});ue.include({addLayer:function(e){if(!e._layerAdd)throw new Error("The provided object is not a Layer.");var t=m(e);return this._layers[t]?this:(this._layers[t]=e,e._mapToAdd=this,e.beforeAdd&&e.beforeAdd(this),this.whenReady(e._layerAdd,e),this)},removeLayer:function(e){var t=m(e);return this._layers[t]?(this._loaded&&e.onRemove(this),delete this._layers[t],this._loaded&&(this.fire("layerremove",{layer:e}),e.fire("remove")),e._map=e._mapToAdd=null,this):this},hasLayer:function(e){return m(e)in this._layers},eachLayer:function(e,t){for(var n in this._layers)e.call(t,this._layers[n]);return this},_addLayers:function(e){e=e?q(e)?e:[e]:[];for(var t=0,n=e.length;t<n;t++)this.addLayer(e[t])},_addZoomLimit:function(e){(!isNaN(e.options.maxZoom)||!isNaN(e.options.minZoom))&&(this._zoomBoundLayers[m(e)]=e,this._updateZoomLevels())},_removeZoomLimit:function(e){var t=m(e);this._zoomBoundLayers[t]&&(delete this._zoomBoundLayers[t],this._updateZoomLevels())},_updateZoomLevels:function(){var e=1/0,t=-1/0,n=this._getZoomSpan();for(var s in this._zoomBoundLayers){var c=this._zoomBoundLayers[s].options;e=c.minZoom===void 0?e:Math.min(e,c.minZoom),t=c.maxZoom===void 0?t:Math.max(t,c.maxZoom)}this._layersMaxZoom=t===-1/0?void 0:t,this._layersMinZoom=e===1/0?void 0:e,n!==this._getZoomSpan()&&this.fire("zoomlevelschange"),this.options.maxZoom===void 0&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom&&this.setZoom(this._layersMaxZoom),this.options.minZoom===void 0&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom&&this.setZoom(this._layersMinZoom)}});var Zt=it.extend({initialize:function(e,t){_(this,t),this._layers={};var n,s;if(e)for(n=0,s=e.length;n<s;n++)this.addLayer(e[n])},addLayer:function(e){var t=this.getLayerId(e);return this._layers[t]=e,this._map&&this._map.addLayer(e),this},removeLayer:function(e){var t=e in this._layers?e:this.getLayerId(e);return this._map&&this._layers[t]&&this._map.removeLayer(this._layers[t]),delete this._layers[t],this},hasLayer:function(e){var t=typeof e=="number"?e:this.getLayerId(e);return t in this._layers},clearLayers:function(){return this.eachLayer(this.removeLayer,this)},invoke:function(e){var t=Array.prototype.slice.call(arguments,1),n,s;for(n in this._layers)s=this._layers[n],s[e]&&s[e].apply(s,t);return this},onAdd:function(e){this.eachLayer(e.addLayer,e)},onRemove:function(e){this.eachLayer(e.removeLayer,e)},eachLayer:function(e,t){for(var n in this._layers)e.call(t,this._layers[n]);return this},getLayer:function(e){return this._layers[e]},getLayers:function(){var e=[];return this.eachLayer(e.push,e),e},setZIndex:function(e){return this.invoke("setZIndex",e)},getLayerId:function(e){return m(e)}}),il=function(e,t){return new Zt(e,t)},ft=Zt.extend({addLayer:function(e){return this.hasLayer(e)?this:(e.addEventParent(this),Zt.prototype.addLayer.call(this,e),this.fire("layeradd",{layer:e}))},removeLayer:function(e){return this.hasLayer(e)?(e in this._layers&&(e=this._layers[e]),e.removeEventParent(this),Zt.prototype.removeLayer.call(this,e),this.fire("layerremove",{layer:e})):this},setStyle:function(e){return this.invoke("setStyle",e)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var e=new ce;for(var t in this._layers){var n=this._layers[t];e.extend(n.getBounds?n.getBounds():n.getLatLng())}return e}}),nl=function(e,t){return new ft(e,t)},Vt=$.extend({options:{popupAnchor:[0,0],tooltipAnchor:[0,0],crossOrigin:!1},initialize:function(e){_(this,e)},createIcon:function(e){return this._createIcon("icon",e)},createShadow:function(e){return this._createIcon("shadow",e)},_createIcon:function(e,t){var n=this._getIconUrl(e);if(!n){if(e==="icon")throw new Error("iconUrl not set in Icon options (see the docs).");return null}var s=this._createImg(n,t&&t.tagName==="IMG"?t:null);return this._setIconStyles(s,e),(this.options.crossOrigin||this.options.crossOrigin==="")&&(s.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),s},_setIconStyles:function(e,t){var n=this.options,s=n[t+"Size"];typeof s=="number"&&(s=[s,s]);var c=R(s),h=R(t==="shadow"&&n.shadowAnchor||n.iconAnchor||c&&c.divideBy(2,!0));e.className="leaflet-marker-"+t+" "+(n.className||""),h&&(e.style.marginLeft=-h.x+"px",e.style.marginTop=-h.y+"px"),c&&(e.style.width=c.x+"px",e.style.height=c.y+"px")},_createImg:function(e,t){return t=t||document.createElement("img"),t.src=e,t},_getIconUrl:function(e){return G.retina&&this.options[e+"RetinaUrl"]||this.options[e+"Url"]}});function al(e){return new Vt(e)}var yi=Vt.extend({options:{iconUrl:"marker-icon.png",iconRetinaUrl:"marker-icon-2x.png",shadowUrl:"marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(e){return typeof yi.imagePath!="string"&&(yi.imagePath=this._detectIconPath()),(this.options.imagePath||yi.imagePath)+Vt.prototype._getIconUrl.call(this,e)},_stripUrl:function(e){var t=function(n,s,c){var h=s.exec(n);return h&&h[c]};return e=t(e,/^url\((['"])?(.+)\1\)$/,2),e&&t(e,/^(.*)marker-icon\.png$/,1)},_detectIconPath:function(){var e=me("div","leaflet-default-icon-path",document.body),t=ui(e,"background-image")||ui(e,"backgroundImage");if(document.body.removeChild(e),t=this._stripUrl(t),t)return t;var n=document.querySelector('link[href$="leaflet.css"]');return n?n.href.substring(0,n.href.length-11-1):""}}),Lo=rt.extend({initialize:function(e){this._marker=e},addHooks:function(){var e=this._marker._icon;this._draggable||(this._draggable=new _t(e,e,!0)),this._draggable.on({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),oe(e,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&Te(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_adjustPan:function(e){var t=this._marker,n=t._map,s=this._marker.options.autoPanSpeed,c=this._marker.options.autoPanPadding,h=$t(t._icon),g=n.getPixelBounds(),w=n.getPixelOrigin(),k=re(g.min._subtract(w).add(c),g.max._subtract(w).subtract(c));if(!k.contains(h)){var M=R((Math.max(k.max.x,h.x)-k.max.x)/(g.max.x-k.max.x)-(Math.min(k.min.x,h.x)-k.min.x)/(g.min.x-k.min.x),(Math.max(k.max.y,h.y)-k.max.y)/(g.max.y-k.max.y)-(Math.min(k.min.y,h.y)-k.min.y)/(g.min.y-k.min.y)).multiplyBy(s);n.panBy(M,{animate:!1}),this._draggable._newPos._add(M),this._draggable._startPos._add(M),$e(t._icon,this._draggable._newPos),this._onDrag(e),this._panRequest=F(this._adjustPan.bind(this,e))}},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng(),this._marker.closePopup&&this._marker.closePopup(),this._marker.fire("movestart").fire("dragstart")},_onPreDrag:function(e){this._marker.options.autoPan&&(ee(this._panRequest),this._panRequest=F(this._adjustPan.bind(this,e)))},_onDrag:function(e){var t=this._marker,n=t._shadow,s=$t(t._icon),c=t._map.layerPointToLatLng(s);n&&$e(n,s),t._latlng=c,e.latlng=c,e.oldLatLng=this._oldLatLng,t.fire("move",e).fire("drag",e)},_onDragEnd:function(e){ee(this._panRequest),delete this._oldLatLng,this._marker.fire("moveend").fire("dragend",e)}}),Fi=it.extend({options:{icon:new yi,interactive:!0,keyboard:!0,title:"",alt:"Marker",zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250,pane:"markerPane",shadowPane:"shadowPane",bubblingMouseEvents:!1,autoPanOnFocus:!0,draggable:!1,autoPan:!1,autoPanPadding:[50,50],autoPanSpeed:10},initialize:function(e,t){_(this,t),this._latlng=Y(e)},onAdd:function(e){this._zoomAnimated=this._zoomAnimated&&e.options.markerZoomAnimation,this._zoomAnimated&&e.on("zoomanim",this._animateZoom,this),this._initIcon(),this.update()},onRemove:function(e){this.dragging&&this.dragging.enabled()&&(this.options.draggable=!0,this.dragging.removeHooks()),delete this.dragging,this._zoomAnimated&&e.off("zoomanim",this._animateZoom,this),this._removeIcon(),this._removeShadow()},getEvents:function(){return{zoom:this.update,viewreset:this.update}},getLatLng:function(){return this._latlng},setLatLng:function(e){var t=this._latlng;return this._latlng=Y(e),this.update(),this.fire("move",{oldLatLng:t,latlng:this._latlng})},setZIndexOffset:function(e){return this.options.zIndexOffset=e,this.update()},getIcon:function(){return this.options.icon},setIcon:function(e){return this.options.icon=e,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},getElement:function(){return this._icon},update:function(){if(this._icon&&this._map){var e=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(e)}return this},_initIcon:function(){var e=this.options,t="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),n=e.icon.createIcon(this._icon),s=!1;n!==this._icon&&(this._icon&&this._removeIcon(),s=!0,e.title&&(n.title=e.title),n.tagName==="IMG"&&(n.alt=e.alt||"")),oe(n,t),e.keyboard&&(n.tabIndex="0",n.setAttribute("role","button")),this._icon=n,e.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&te(n,"focus",this._panOnFocus,this);var c=e.icon.createShadow(this._shadow),h=!1;c!==this._shadow&&(this._removeShadow(),h=!0),c&&(oe(c,t),c.alt=""),this._shadow=c,e.opacity<1&&this._updateOpacity(),s&&this.getPane().appendChild(this._icon),this._initInteraction(),c&&h&&this.getPane(e.shadowPane).appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&we(this._icon,"focus",this._panOnFocus,this),ze(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&ze(this._shadow),this._shadow=null},_setPos:function(e){this._icon&&$e(this._icon,e),this._shadow&&$e(this._shadow,e),this._zIndex=e.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(e){this._icon&&(this._icon.style.zIndex=this._zIndex+e)},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center).round();this._setPos(t)},_initInteraction:function(){if(this.options.interactive&&(oe(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),Lo)){var e=this.options.draggable;this.dragging&&(e=this.dragging.enabled(),this.dragging.disable()),this.dragging=new Lo(this),e&&this.dragging.enable()}},setOpacity:function(e){return this.options.opacity=e,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var e=this.options.opacity;this._icon&&Je(this._icon,e),this._shadow&&Je(this._shadow,e)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)},_panOnFocus:function(){var e=this._map;if(e){var t=this.options.icon.options,n=t.iconSize?R(t.iconSize):R(0,0),s=t.iconAnchor?R(t.iconAnchor):R(0,0);e.panInside(this._latlng,{paddingTopLeft:s,paddingBottomRight:n.subtract(s)})}},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor}});function ol(e,t){return new Fi(e,t)}var wt=it.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",dashArray:null,dashOffset:null,fill:!1,fillColor:null,fillOpacity:.2,fillRule:"evenodd",interactive:!0,bubblingMouseEvents:!0},beforeAdd:function(e){this._renderer=e.getRenderer(this)},onAdd:function(){this._renderer._initPath(this),this._reset(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(e){return _(this,e),this._renderer&&(this._renderer._updateStyle(this),this.options.stroke&&e&&Object.prototype.hasOwnProperty.call(e,"weight")&&this._updateBounds()),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},getElement:function(){return this._path},_reset:function(){this._project(),this._update()},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(this._renderer.options.tolerance||0)}}),qi=wt.extend({options:{fill:!0,radius:10},initialize:function(e,t){_(this,t),this._latlng=Y(e),this._radius=this.options.radius},setLatLng:function(e){var t=this._latlng;return this._latlng=Y(e),this.redraw(),this.fire("move",{oldLatLng:t,latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(e){return this.options.radius=this._radius=e,this.redraw()},getRadius:function(){return this._radius},setStyle:function(e){var t=e&&e.radius||this._radius;return wt.prototype.setStyle.call(this,e),this.setRadius(t),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var e=this._radius,t=this._radiusY||e,n=this._clickTolerance(),s=[e+n,t+n];this._pxBounds=new V(this._point.subtract(s),this._point.add(s))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)},_containsPoint:function(e){return e.distanceTo(this._point)<=this._radius+this._clickTolerance()}});function sl(e,t){return new qi(e,t)}var Yn=qi.extend({initialize:function(e,t,n){if(typeof t=="number"&&(t=l({},n,{radius:t})),_(this,t),this._latlng=Y(e),isNaN(this.options.radius))throw new Error("Circle radius cannot be NaN");this._mRadius=this.options.radius},setRadius:function(e){return this._mRadius=e,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var e=[this._radius,this._radiusY||this._radius];return new ce(this._map.layerPointToLatLng(this._point.subtract(e)),this._map.layerPointToLatLng(this._point.add(e)))},setStyle:wt.prototype.setStyle,_project:function(){var e=this._latlng.lng,t=this._latlng.lat,n=this._map,s=n.options.crs;if(s.distance===xt.distance){var c=Math.PI/180,h=this._mRadius/xt.R/c,g=n.project([t+h,e]),w=n.project([t-h,e]),k=g.add(w).divideBy(2),M=n.unproject(k).lat,j=Math.acos((Math.cos(h*c)-Math.sin(t*c)*Math.sin(M*c))/(Math.cos(t*c)*Math.cos(M*c)))/c;(isNaN(j)||j===0)&&(j=h/Math.cos(Math.PI/180*t)),this._point=k.subtract(n.getPixelOrigin()),this._radius=isNaN(j)?0:k.x-n.project([M,e-j]).x,this._radiusY=k.y-g.y}else{var W=s.unproject(s.project(this._latlng).subtract([this._mRadius,0]));this._point=n.latLngToLayerPoint(this._latlng),this._radius=this._point.x-n.latLngToLayerPoint(W).x}this._updateBounds()}});function rl(e,t,n){return new Yn(e,t,n)}var gt=wt.extend({options:{smoothFactor:1,noClip:!1},initialize:function(e,t){_(this,t),this._setLatLngs(e)},getLatLngs:function(){return this._latlngs},setLatLngs:function(e){return this._setLatLngs(e),this.redraw()},isEmpty:function(){return!this._latlngs.length},closestLayerPoint:function(e){for(var t=1/0,n=null,s=vi,c,h,g=0,w=this._parts.length;g<w;g++)for(var k=this._parts[g],M=1,j=k.length;M<j;M++){c=k[M-1],h=k[M];var W=s(e,c,h,!0);W<t&&(t=W,n=s(e,c,h))}return n&&(n.distance=Math.sqrt(t)),n},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return ko(this._defaultShape(),this._map.options.crs)},getBounds:function(){return this._bounds},addLatLng:function(e,t){return t=t||this._defaultShape(),e=Y(e),t.push(e),this._bounds.extend(e),this.redraw()},_setLatLngs:function(e){this._bounds=new ce,this._latlngs=this._convertLatLngs(e)},_defaultShape:function(){return Ye(this._latlngs)?this._latlngs:this._latlngs[0]},_convertLatLngs:function(e){for(var t=[],n=Ye(e),s=0,c=e.length;s<c;s++)n?(t[s]=Y(e[s]),this._bounds.extend(t[s])):t[s]=this._convertLatLngs(e[s]);return t},_project:function(){var e=new V;this._rings=[],this._projectLatlngs(this._latlngs,this._rings,e),this._bounds.isValid()&&e.isValid()&&(this._rawPxBounds=e,this._updateBounds())},_updateBounds:function(){var e=this._clickTolerance(),t=new O(e,e);this._rawPxBounds&&(this._pxBounds=new V([this._rawPxBounds.min.subtract(t),this._rawPxBounds.max.add(t)]))},_projectLatlngs:function(e,t,n){var s=e[0]instanceof de,c=e.length,h,g;if(s){for(g=[],h=0;h<c;h++)g[h]=this._map.latLngToLayerPoint(e[h]),n.extend(g[h]);t.push(g)}else for(h=0;h<c;h++)this._projectLatlngs(e[h],t,n)},_clipPoints:function(){var e=this._renderer._bounds;if(this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(e))){if(this.options.noClip){this._parts=this._rings;return}var t=this._parts,n,s,c,h,g,w,k;for(n=0,c=0,h=this._rings.length;n<h;n++)for(k=this._rings[n],s=0,g=k.length;s<g-1;s++)w=_o(k[s],k[s+1],e,s,!0),w&&(t[c]=t[c]||[],t[c].push(w[0]),(w[1]!==k[s+1]||s===g-2)&&(t[c].push(w[1]),c++))}},_simplifyPoints:function(){for(var e=this._parts,t=this.options.smoothFactor,n=0,s=e.length;n<s;n++)e[n]=yo(e[n],t)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)},_containsPoint:function(e,t){var n,s,c,h,g,w,k=this._clickTolerance();if(!this._pxBounds||!this._pxBounds.contains(e))return!1;for(n=0,h=this._parts.length;n<h;n++)for(w=this._parts[n],s=0,g=w.length,c=g-1;s<g;c=s++)if(!(!t&&s===0)&&bo(e,w[c],w[s])<=k)return!0;return!1}});function ll(e,t){return new gt(e,t)}gt._flat=wo;var Gt=gt.extend({options:{fill:!0},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return vo(this._defaultShape(),this._map.options.crs)},_convertLatLngs:function(e){var t=gt.prototype._convertLatLngs.call(this,e),n=t.length;return n>=2&&t[0]instanceof de&&t[0].equals(t[n-1])&&t.pop(),t},_setLatLngs:function(e){gt.prototype._setLatLngs.call(this,e),Ye(this._latlngs)&&(this._latlngs=[this._latlngs])},_defaultShape:function(){return Ye(this._latlngs[0])?this._latlngs[0]:this._latlngs[0][0]},_clipPoints:function(){var e=this._renderer._bounds,t=this.options.weight,n=new O(t,t);if(e=new V(e.min.subtract(n),e.max.add(n)),this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(e))){if(this.options.noClip){this._parts=this._rings;return}for(var s=0,c=this._rings.length,h;s<c;s++)h=go(this._rings[s],e,!0),h.length&&this._parts.push(h)}},_updatePath:function(){this._renderer._updatePoly(this,!0)},_containsPoint:function(e){var t=!1,n,s,c,h,g,w,k,M;if(!this._pxBounds||!this._pxBounds.contains(e))return!1;for(h=0,k=this._parts.length;h<k;h++)for(n=this._parts[h],g=0,M=n.length,w=M-1;g<M;w=g++)s=n[g],c=n[w],s.y>e.y!=c.y>e.y&&e.x<(c.x-s.x)*(e.y-s.y)/(c.y-s.y)+s.x&&(t=!t);return t||gt.prototype._containsPoint.call(this,e,!0)}});function cl(e,t){return new Gt(e,t)}var vt=ft.extend({initialize:function(e,t){_(this,t),this._layers={},e&&this.addData(e)},addData:function(e){var t=q(e)?e:e.features,n,s,c;if(t){for(n=0,s=t.length;n<s;n++)c=t[n],(c.geometries||c.geometry||c.features||c.coordinates)&&this.addData(c);return this}var h=this.options;if(h.filter&&!h.filter(e))return this;var g=Ui(e,h);return g?(g.feature=Gi(e),g.defaultOptions=g.options,this.resetStyle(g),h.onEachFeature&&h.onEachFeature(e,g),this.addLayer(g)):this},resetStyle:function(e){return e===void 0?this.eachLayer(this.resetStyle,this):(e.options=l({},e.defaultOptions),this._setLayerStyle(e,this.options.style),this)},setStyle:function(e){return this.eachLayer(function(t){this._setLayerStyle(t,e)},this)},_setLayerStyle:function(e,t){e.setStyle&&(typeof t=="function"&&(t=t(e.feature)),e.setStyle(t))}});function Ui(e,t){var n=e.type==="Feature"?e.geometry:e,s=n?n.coordinates:null,c=[],h=t&&t.pointToLayer,g=t&&t.coordsToLatLng||Xn,w,k,M,j;if(!s&&!n)return null;switch(n.type){case"Point":return w=g(s),Co(h,e,w,t);case"MultiPoint":for(M=0,j=s.length;M<j;M++)w=g(s[M]),c.push(Co(h,e,w,t));return new ft(c);case"LineString":case"MultiLineString":return k=Zi(s,n.type==="LineString"?0:1,g),new gt(k,t);case"Polygon":case"MultiPolygon":return k=Zi(s,n.type==="Polygon"?1:2,g),new Gt(k,t);case"GeometryCollection":for(M=0,j=n.geometries.length;M<j;M++){var W=Ui({geometry:n.geometries[M],type:"Feature",properties:e.properties},t);W&&c.push(W)}return new ft(c);case"FeatureCollection":for(M=0,j=n.features.length;M<j;M++){var le=Ui(n.features[M],t);le&&c.push(le)}return new ft(c);default:throw new Error("Invalid GeoJSON object.")}}function Co(e,t,n,s){return e?e(t,n):new Fi(n,s&&s.markersInheritOptions&&s)}function Xn(e){return new de(e[1],e[0],e[2])}function Zi(e,t,n){for(var s=[],c=0,h=e.length,g;c<h;c++)g=t?Zi(e[c],t-1,n):(n||Xn)(e[c]),s.push(g);return s}function Qn(e,t){return e=Y(e),e.alt!==void 0?[b(e.lng,t),b(e.lat,t),b(e.alt,t)]:[b(e.lng,t),b(e.lat,t)]}function Vi(e,t,n,s){for(var c=[],h=0,g=e.length;h<g;h++)c.push(t?Vi(e[h],Ye(e[h])?0:t-1,n,s):Qn(e[h],s));return!t&&n&&c.length>0&&c.push(c[0].slice()),c}function Wt(e,t){return e.feature?l({},e.feature,{geometry:t}):Gi(t)}function Gi(e){return e.type==="Feature"||e.type==="FeatureCollection"?e:{type:"Feature",properties:{},geometry:e}}var ea={toGeoJSON:function(e){return Wt(this,{type:"Point",coordinates:Qn(this.getLatLng(),e)})}};Fi.include(ea),Yn.include(ea),qi.include(ea),gt.include({toGeoJSON:function(e){var t=!Ye(this._latlngs),n=Vi(this._latlngs,t?1:0,!1,e);return Wt(this,{type:(t?"Multi":"")+"LineString",coordinates:n})}}),Gt.include({toGeoJSON:function(e){var t=!Ye(this._latlngs),n=t&&!Ye(this._latlngs[0]),s=Vi(this._latlngs,n?2:t?1:0,!0,e);return t||(s=[s]),Wt(this,{type:(n?"Multi":"")+"Polygon",coordinates:s})}}),Zt.include({toMultiPoint:function(e){var t=[];return this.eachLayer(function(n){t.push(n.toGeoJSON(e).geometry.coordinates)}),Wt(this,{type:"MultiPoint",coordinates:t})},toGeoJSON:function(e){var t=this.feature&&this.feature.geometry&&this.feature.geometry.type;if(t==="MultiPoint")return this.toMultiPoint(e);var n=t==="GeometryCollection",s=[];return this.eachLayer(function(c){if(c.toGeoJSON){var h=c.toGeoJSON(e);if(n)s.push(h.geometry);else{var g=Gi(h);g.type==="FeatureCollection"?s.push.apply(s,g.features):s.push(g)}}}),n?Wt(this,{geometries:s,type:"GeometryCollection"}):{type:"FeatureCollection",features:s}}});function Eo(e,t){return new vt(e,t)}var dl=Eo,Wi=it.extend({options:{opacity:1,alt:"",interactive:!1,crossOrigin:!1,errorOverlayUrl:"",zIndex:1,className:""},initialize:function(e,t,n){this._url=e,this._bounds=ae(t),_(this,n)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(oe(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){ze(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(e){return this.options.opacity=e,this._image&&this._updateOpacity(),this},setStyle:function(e){return e.opacity&&this.setOpacity(e.opacity),this},bringToFront:function(){return this._map&&qt(this._image),this},bringToBack:function(){return this._map&&Ut(this._image),this},setUrl:function(e){return this._url=e,this._image&&(this._image.src=e),this},setBounds:function(e){return this._bounds=ae(e),this._map&&this._reset(),this},getEvents:function(){var e={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(e.zoomanim=this._animateZoom),e},setZIndex:function(e){return this.options.zIndex=e,this._updateZIndex(),this},getBounds:function(){return this._bounds},getElement:function(){return this._image},_initImage:function(){var e=this._url.tagName==="IMG",t=this._image=e?this._url:me("img");if(oe(t,"leaflet-image-layer"),this._zoomAnimated&&oe(t,"leaflet-zoom-animated"),this.options.className&&oe(t,this.options.className),t.onselectstart=y,t.onmousemove=y,t.onload=u(this.fire,this,"load"),t.onerror=u(this._overlayOnError,this,"error"),(this.options.crossOrigin||this.options.crossOrigin==="")&&(t.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),this.options.zIndex&&this._updateZIndex(),e){this._url=t.src;return}t.src=this._url,t.alt=this.options.alt},_animateZoom:function(e){var t=this._map.getZoomScale(e.zoom),n=this._map._latLngBoundsToNewLayerBounds(this._bounds,e.zoom,e.center).min;Tt(this._image,n,t)},_reset:function(){var e=this._image,t=new V(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),n=t.getSize();$e(e,t.min),e.style.width=n.x+"px",e.style.height=n.y+"px"},_updateOpacity:function(){Je(this._image,this.options.opacity)},_updateZIndex:function(){this._image&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._image.style.zIndex=this.options.zIndex)},_overlayOnError:function(){this.fire("error");var e=this.options.errorOverlayUrl;e&&this._url!==e&&(this._url=e,this._image.src=e)},getCenter:function(){return this._bounds.getCenter()}}),ul=function(e,t,n){return new Wi(e,t,n)},So=Wi.extend({options:{autoplay:!0,loop:!0,keepAspectRatio:!0,muted:!1,playsInline:!0},_initImage:function(){var e=this._url.tagName==="VIDEO",t=this._image=e?this._url:me("video");if(oe(t,"leaflet-image-layer"),this._zoomAnimated&&oe(t,"leaflet-zoom-animated"),this.options.className&&oe(t,this.options.className),t.onselectstart=y,t.onmousemove=y,t.onloadeddata=u(this.fire,this,"load"),e){for(var n=t.getElementsByTagName("source"),s=[],c=0;c<n.length;c++)s.push(n[c].src);this._url=n.length>0?s:[t.src];return}q(this._url)||(this._url=[this._url]),!this.options.keepAspectRatio&&Object.prototype.hasOwnProperty.call(t.style,"objectFit")&&(t.style.objectFit="fill"),t.autoplay=!!this.options.autoplay,t.loop=!!this.options.loop,t.muted=!!this.options.muted,t.playsInline=!!this.options.playsInline;for(var h=0;h<this._url.length;h++){var g=me("source");g.src=this._url[h],t.appendChild(g)}}});function pl(e,t,n){return new So(e,t,n)}var To=Wi.extend({_initImage:function(){var e=this._image=this._url;oe(e,"leaflet-image-layer"),this._zoomAnimated&&oe(e,"leaflet-zoom-animated"),this.options.className&&oe(e,this.options.className),e.onselectstart=y,e.onmousemove=y}});function hl(e,t,n){return new To(e,t,n)}var lt=it.extend({options:{interactive:!1,offset:[0,0],className:"",pane:void 0,content:""},initialize:function(e,t){e&&(e instanceof de||q(e))?(this._latlng=Y(e),_(this,t)):(_(this,e),this._source=t),this.options.content&&(this._content=this.options.content)},openOn:function(e){return e=arguments.length?e:this._source._map,e.hasLayer(this)||e.addLayer(this),this},close:function(){return this._map&&this._map.removeLayer(this),this},toggle:function(e){return this._map?this.close():(arguments.length?this._source=e:e=this._source,this._prepareOpen(),this.openOn(e._map)),this},onAdd:function(e){this._zoomAnimated=e._zoomAnimated,this._container||this._initLayout(),e._fadeAnimated&&Je(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),e._fadeAnimated&&Je(this._container,1),this.bringToFront(),this.options.interactive&&(oe(this._container,"leaflet-interactive"),this.addInteractiveTarget(this._container))},onRemove:function(e){e._fadeAnimated?(Je(this._container,0),this._removeTimeout=setTimeout(u(ze,void 0,this._container),200)):ze(this._container),this.options.interactive&&(Te(this._container,"leaflet-interactive"),this.removeInteractiveTarget(this._container))},getLatLng:function(){return this._latlng},setLatLng:function(e){return this._latlng=Y(e),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(e){return this._content=e,this.update(),this},getElement:function(){return this._container},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var e={zoom:this._updatePosition,viewreset:this._updatePosition};return this._zoomAnimated&&(e.zoomanim=this._animateZoom),e},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},bringToFront:function(){return this._map&&qt(this._container),this},bringToBack:function(){return this._map&&Ut(this._container),this},_prepareOpen:function(e){var t=this._source;if(!t._map)return!1;if(t instanceof ft){t=null;var n=this._source._layers;for(var s in n)if(n[s]._map){t=n[s];break}if(!t)return!1;this._source=t}if(!e)if(t.getCenter)e=t.getCenter();else if(t.getLatLng)e=t.getLatLng();else if(t.getBounds)e=t.getBounds().getCenter();else throw new Error("Unable to get source layer LatLng.");return this.setLatLng(e),this._map&&this.update(),!0},_updateContent:function(){if(this._content){var e=this._contentNode,t=typeof this._content=="function"?this._content(this._source||this):this._content;if(typeof t=="string")e.innerHTML=t;else{for(;e.hasChildNodes();)e.removeChild(e.firstChild);e.appendChild(t)}this.fire("contentupdate")}},_updatePosition:function(){if(this._map){var e=this._map.latLngToLayerPoint(this._latlng),t=R(this.options.offset),n=this._getAnchor();this._zoomAnimated?$e(this._container,e.add(n)):t=t.add(e).add(n);var s=this._containerBottom=-t.y,c=this._containerLeft=-Math.round(this._containerWidth/2)+t.x;this._container.style.bottom=s+"px",this._container.style.left=c+"px"}},_getAnchor:function(){return[0,0]}});ue.include({_initOverlay:function(e,t,n,s){var c=t;return c instanceof e||(c=new e(s).setContent(t)),n&&c.setLatLng(n),c}}),it.include({_initOverlay:function(e,t,n,s){var c=n;return c instanceof e?(_(c,s),c._source=this):(c=t&&!s?t:new e(s,this),c.setContent(n)),c}});var Ki=lt.extend({options:{pane:"popupPane",offset:[0,7],maxWidth:300,minWidth:50,maxHeight:null,autoPan:!0,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:!1,closeButton:!0,autoClose:!0,closeOnEscapeKey:!0,className:""},openOn:function(e){return e=arguments.length?e:this._source._map,!e.hasLayer(this)&&e._popup&&e._popup.options.autoClose&&e.removeLayer(e._popup),e._popup=this,lt.prototype.openOn.call(this,e)},onAdd:function(e){lt.prototype.onAdd.call(this,e),e.fire("popupopen",{popup:this}),this._source&&(this._source.fire("popupopen",{popup:this},!0),this._source instanceof wt||this._source.on("preclick",Mt))},onRemove:function(e){lt.prototype.onRemove.call(this,e),e.fire("popupclose",{popup:this}),this._source&&(this._source.fire("popupclose",{popup:this},!0),this._source instanceof wt||this._source.off("preclick",Mt))},getEvents:function(){var e=lt.prototype.getEvents.call(this);return(this.options.closeOnClick!==void 0?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(e.preclick=this.close),this.options.keepInView&&(e.moveend=this._adjustPan),e},_initLayout:function(){var e="leaflet-popup",t=this._container=me("div",e+" "+(this.options.className||"")+" leaflet-zoom-animated"),n=this._wrapper=me("div",e+"-content-wrapper",t);if(this._contentNode=me("div",e+"-content",n),fi(t),qn(this._contentNode),te(t,"contextmenu",Mt),this._tipContainer=me("div",e+"-tip-container",t),this._tip=me("div",e+"-tip",this._tipContainer),this.options.closeButton){var s=this._closeButton=me("a",e+"-close-button",t);s.setAttribute("role","button"),s.setAttribute("aria-label","Close popup"),s.href="#close",s.innerHTML='<span aria-hidden="true">&#215;</span>',te(s,"click",function(c){Be(c),this.close()},this)}},_updateLayout:function(){var e=this._contentNode,t=e.style;t.width="",t.whiteSpace="nowrap";var n=e.offsetWidth;n=Math.min(n,this.options.maxWidth),n=Math.max(n,this.options.minWidth),t.width=n+1+"px",t.whiteSpace="",t.height="";var s=e.offsetHeight,c=this.options.maxHeight,h="leaflet-popup-scrolled";c&&s>c?(t.height=c+"px",oe(e,h)):Te(e,h),this._containerWidth=this._container.offsetWidth},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center),n=this._getAnchor();$e(this._container,t.add(n))},_adjustPan:function(){if(this.options.autoPan){if(this._map._panAnim&&this._map._panAnim.stop(),this._autopanning){this._autopanning=!1;return}var e=this._map,t=parseInt(ui(this._container,"marginBottom"),10)||0,n=this._container.offsetHeight+t,s=this._containerWidth,c=new O(this._containerLeft,-n-this._containerBottom);c._add($t(this._container));var h=e.layerPointToContainerPoint(c),g=R(this.options.autoPanPadding),w=R(this.options.autoPanPaddingTopLeft||g),k=R(this.options.autoPanPaddingBottomRight||g),M=e.getSize(),j=0,W=0;h.x+s+k.x>M.x&&(j=h.x+s-M.x+k.x),h.x-j-w.x<0&&(j=h.x-w.x),h.y+n+k.y>M.y&&(W=h.y+n-M.y+k.y),h.y-W-w.y<0&&(W=h.y-w.y),(j||W)&&(this.options.keepInView&&(this._autopanning=!0),e.fire("autopanstart").panBy([j,W]))}},_getAnchor:function(){return R(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0])}}),ml=function(e,t){return new Ki(e,t)};ue.mergeOptions({closePopupOnClick:!0}),ue.include({openPopup:function(e,t,n){return this._initOverlay(Ki,e,t,n).openOn(this),this},closePopup:function(e){return e=arguments.length?e:this._popup,e&&e.close(),this}}),it.include({bindPopup:function(e,t){return this._popup=this._initOverlay(Ki,this._popup,e,t),this._popupHandlersAdded||(this.on({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(e){return this._popup&&(this instanceof ft||(this._popup._source=this),this._popup._prepareOpen(e||this._latlng)&&this._popup.openOn(this._map)),this},closePopup:function(){return this._popup&&this._popup.close(),this},togglePopup:function(){return this._popup&&this._popup.toggle(this),this},isPopupOpen:function(){return this._popup?this._popup.isOpen():!1},setPopupContent:function(e){return this._popup&&this._popup.setContent(e),this},getPopup:function(){return this._popup},_openPopup:function(e){if(!(!this._popup||!this._map)){It(e);var t=e.layer||e.target;if(this._popup._source===t&&!(t instanceof wt)){this._map.hasLayer(this._popup)?this.closePopup():this.openPopup(e.latlng);return}this._popup._source=t,this.openPopup(e.latlng)}},_movePopup:function(e){this._popup.setLatLng(e.latlng)},_onKeyPress:function(e){e.originalEvent.keyCode===13&&this._openPopup(e)}});var Ji=lt.extend({options:{pane:"tooltipPane",offset:[0,0],direction:"auto",permanent:!1,sticky:!1,opacity:.9},onAdd:function(e){lt.prototype.onAdd.call(this,e),this.setOpacity(this.options.opacity),e.fire("tooltipopen",{tooltip:this}),this._source&&(this.addEventParent(this._source),this._source.fire("tooltipopen",{tooltip:this},!0))},onRemove:function(e){lt.prototype.onRemove.call(this,e),e.fire("tooltipclose",{tooltip:this}),this._source&&(this.removeEventParent(this._source),this._source.fire("tooltipclose",{tooltip:this},!0))},getEvents:function(){var e=lt.prototype.getEvents.call(this);return this.options.permanent||(e.preclick=this.close),e},_initLayout:function(){var e="leaflet-tooltip",t=e+" "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide");this._contentNode=this._container=me("div",t),this._container.setAttribute("role","tooltip"),this._container.setAttribute("id","leaflet-tooltip-"+m(this))},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(e){var t,n,s=this._map,c=this._container,h=s.latLngToContainerPoint(s.getCenter()),g=s.layerPointToContainerPoint(e),w=this.options.direction,k=c.offsetWidth,M=c.offsetHeight,j=R(this.options.offset),W=this._getAnchor();w==="top"?(t=k/2,n=M):w==="bottom"?(t=k/2,n=0):w==="center"?(t=k/2,n=M/2):w==="right"?(t=0,n=M/2):w==="left"?(t=k,n=M/2):g.x<h.x?(w="right",t=0,n=M/2):(w="left",t=k+(j.x+W.x)*2,n=M/2),e=e.subtract(R(t,n,!0)).add(j).add(W),Te(c,"leaflet-tooltip-right"),Te(c,"leaflet-tooltip-left"),Te(c,"leaflet-tooltip-top"),Te(c,"leaflet-tooltip-bottom"),oe(c,"leaflet-tooltip-"+w),$e(c,e)},_updatePosition:function(){var e=this._map.latLngToLayerPoint(this._latlng);this._setPosition(e)},setOpacity:function(e){this.options.opacity=e,this._container&&Je(this._container,e)},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center);this._setPosition(t)},_getAnchor:function(){return R(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0])}}),fl=function(e,t){return new Ji(e,t)};ue.include({openTooltip:function(e,t,n){return this._initOverlay(Ji,e,t,n).openOn(this),this},closeTooltip:function(e){return e.close(),this}}),it.include({bindTooltip:function(e,t){return this._tooltip&&this.isTooltipOpen()&&this.unbindTooltip(),this._tooltip=this._initOverlay(Ji,this._tooltip,e,t),this._initTooltipInteractions(),this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)&&this.openTooltip(),this},unbindTooltip:function(){return this._tooltip&&(this._initTooltipInteractions(!0),this.closeTooltip(),this._tooltip=null),this},_initTooltipInteractions:function(e){if(!(!e&&this._tooltipHandlersAdded)){var t=e?"off":"on",n={remove:this.closeTooltip,move:this._moveTooltip};this._tooltip.options.permanent?n.add=this._openTooltip:(n.mouseover=this._openTooltip,n.mouseout=this.closeTooltip,n.click=this._openTooltip,this._map?this._addFocusListeners():n.add=this._addFocusListeners),this._tooltip.options.sticky&&(n.mousemove=this._moveTooltip),this[t](n),this._tooltipHandlersAdded=!e}},openTooltip:function(e){return this._tooltip&&(this instanceof ft||(this._tooltip._source=this),this._tooltip._prepareOpen(e)&&(this._tooltip.openOn(this._map),this.getElement?this._setAriaDescribedByOnLayer(this):this.eachLayer&&this.eachLayer(this._setAriaDescribedByOnLayer,this))),this},closeTooltip:function(){if(this._tooltip)return this._tooltip.close()},toggleTooltip:function(){return this._tooltip&&this._tooltip.toggle(this),this},isTooltipOpen:function(){return this._tooltip.isOpen()},setTooltipContent:function(e){return this._tooltip&&this._tooltip.setContent(e),this},getTooltip:function(){return this._tooltip},_addFocusListeners:function(){this.getElement?this._addFocusListenersOnLayer(this):this.eachLayer&&this.eachLayer(this._addFocusListenersOnLayer,this)},_addFocusListenersOnLayer:function(e){var t=typeof e.getElement=="function"&&e.getElement();t&&(te(t,"focus",function(){this._tooltip._source=e,this.openTooltip()},this),te(t,"blur",this.closeTooltip,this))},_setAriaDescribedByOnLayer:function(e){var t=typeof e.getElement=="function"&&e.getElement();t&&t.setAttribute("aria-describedby",this._tooltip._container.id)},_openTooltip:function(e){if(!(!this._tooltip||!this._map)){if(this._map.dragging&&this._map.dragging.moving()&&!this._openOnceFlag){this._openOnceFlag=!0;var t=this;this._map.once("moveend",function(){t._openOnceFlag=!1,t._openTooltip(e)});return}this._tooltip._source=e.layer||e.target,this.openTooltip(this._tooltip.options.sticky?e.latlng:void 0)}},_moveTooltip:function(e){var t=e.latlng,n,s;this._tooltip.options.sticky&&e.originalEvent&&(n=this._map.mouseEventToContainerPoint(e.originalEvent),s=this._map.containerPointToLayerPoint(n),t=this._map.layerPointToLatLng(s)),this._tooltip.setLatLng(t)}});var $o=Vt.extend({options:{iconSize:[12,12],html:!1,bgPos:null,className:"leaflet-div-icon"},createIcon:function(e){var t=e&&e.tagName==="DIV"?e:document.createElement("div"),n=this.options;if(n.html instanceof Element?(Ri(t),t.appendChild(n.html)):t.innerHTML=n.html!==!1?n.html:"",n.bgPos){var s=R(n.bgPos);t.style.backgroundPosition=-s.x+"px "+-s.y+"px"}return this._setIconStyles(t,"icon"),t},createShadow:function(){return null}});function gl(e){return new $o(e)}Vt.Default=yi;var bi=it.extend({options:{tileSize:256,opacity:1,updateWhenIdle:G.mobile,updateWhenZooming:!0,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:void 0,maxNativeZoom:void 0,minNativeZoom:void 0,noWrap:!1,pane:"tilePane",className:"",keepBuffer:2},initialize:function(e){_(this,e)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._resetView()},beforeAdd:function(e){e._addZoomLimit(this)},onRemove:function(e){this._removeAllTiles(),ze(this._container),e._removeZoomLimit(this),this._container=null,this._tileZoom=void 0},bringToFront:function(){return this._map&&(qt(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(Ut(this._container),this._setAutoZIndex(Math.min)),this},getContainer:function(){return this._container},setOpacity:function(e){return this.options.opacity=e,this._updateOpacity(),this},setZIndex:function(e){return this.options.zIndex=e,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){if(this._map){this._removeAllTiles();var e=this._clampZoom(this._map.getZoom());e!==this._tileZoom&&(this._tileZoom=e,this._updateLevels()),this._update()}return this},getEvents:function(){var e={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};return this.options.updateWhenIdle||(this._onMove||(this._onMove=f(this._onMoveEnd,this.options.updateInterval,this)),e.move=this._onMove),this._zoomAnimated&&(e.zoomanim=this._animateZoom),e},createTile:function(){return document.createElement("div")},getTileSize:function(){var e=this.options.tileSize;return e instanceof O?e:new O(e,e)},_updateZIndex:function(){this._container&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(e){for(var t=this.getPane().children,n=-e(-1/0,1/0),s=0,c=t.length,h;s<c;s++)h=t[s].style.zIndex,t[s]!==this._container&&h&&(n=e(n,+h));isFinite(n)&&(this.options.zIndex=n+e(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map&&!G.ielt9){Je(this._container,this.options.opacity);var e=+new Date,t=!1,n=!1;for(var s in this._tiles){var c=this._tiles[s];if(!(!c.current||!c.loaded)){var h=Math.min(1,(e-c.loaded)/200);Je(c.el,h),h<1?t=!0:(c.active?n=!0:this._onOpaqueTile(c),c.active=!0)}}n&&!this._noPrune&&this._pruneTiles(),t&&(ee(this._fadeFrame),this._fadeFrame=F(this._updateOpacity,this))}},_onOpaqueTile:y,_initContainer:function(){this._container||(this._container=me("div","leaflet-layer "+(this.options.className||"")),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var e=this._tileZoom,t=this.options.maxZoom;if(e!==void 0){for(var n in this._levels)n=Number(n),this._levels[n].el.children.length||n===e?(this._levels[n].el.style.zIndex=t-Math.abs(e-n),this._onUpdateLevel(n)):(ze(this._levels[n].el),this._removeTilesAtZoom(n),this._onRemoveLevel(n),delete this._levels[n]);var s=this._levels[e],c=this._map;return s||(s=this._levels[e]={},s.el=me("div","leaflet-tile-container leaflet-zoom-animated",this._container),s.el.style.zIndex=t,s.origin=c.project(c.unproject(c.getPixelOrigin()),e).round(),s.zoom=e,this._setZoomTransform(s,c.getCenter(),c.getZoom()),y(s.el.offsetWidth),this._onCreateLevel(s)),this._level=s,s}},_onUpdateLevel:y,_onRemoveLevel:y,_onCreateLevel:y,_pruneTiles:function(){if(this._map){var e,t,n=this._map.getZoom();if(n>this.options.maxZoom||n<this.options.minZoom){this._removeAllTiles();return}for(e in this._tiles)t=this._tiles[e],t.retain=t.current;for(e in this._tiles)if(t=this._tiles[e],t.current&&!t.active){var s=t.coords;this._retainParent(s.x,s.y,s.z,s.z-5)||this._retainChildren(s.x,s.y,s.z,s.z+2)}for(e in this._tiles)this._tiles[e].retain||this._removeTile(e)}},_removeTilesAtZoom:function(e){for(var t in this._tiles)this._tiles[t].coords.z===e&&this._removeTile(t)},_removeAllTiles:function(){for(var e in this._tiles)this._removeTile(e)},_invalidateAll:function(){for(var e in this._levels)ze(this._levels[e].el),this._onRemoveLevel(Number(e)),delete this._levels[e];this._removeAllTiles(),this._tileZoom=void 0},_retainParent:function(e,t,n,s){var c=Math.floor(e/2),h=Math.floor(t/2),g=n-1,w=new O(+c,+h);w.z=+g;var k=this._tileCoordsToKey(w),M=this._tiles[k];return M&&M.active?(M.retain=!0,!0):(M&&M.loaded&&(M.retain=!0),g>s?this._retainParent(c,h,g,s):!1)},_retainChildren:function(e,t,n,s){for(var c=2*e;c<2*e+2;c++)for(var h=2*t;h<2*t+2;h++){var g=new O(c,h);g.z=n+1;var w=this._tileCoordsToKey(g),k=this._tiles[w];if(k&&k.active){k.retain=!0;continue}else k&&k.loaded&&(k.retain=!0);n+1<s&&this._retainChildren(c,h,n+1,s)}},_resetView:function(e){var t=e&&(e.pinch||e.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),t,t)},_animateZoom:function(e){this._setView(e.center,e.zoom,!0,e.noUpdate)},_clampZoom:function(e){var t=this.options;return t.minNativeZoom!==void 0&&e<t.minNativeZoom?t.minNativeZoom:t.maxNativeZoom!==void 0&&t.maxNativeZoom<e?t.maxNativeZoom:e},_setView:function(e,t,n,s){var c=Math.round(t);this.options.maxZoom!==void 0&&c>this.options.maxZoom||this.options.minZoom!==void 0&&c<this.options.minZoom?c=void 0:c=this._clampZoom(c);var h=this.options.updateWhenZooming&&c!==this._tileZoom;(!s||h)&&(this._tileZoom=c,this._abortLoading&&this._abortLoading(),this._updateLevels(),this._resetGrid(),c!==void 0&&this._update(e),n||this._pruneTiles(),this._noPrune=!!n),this._setZoomTransforms(e,t)},_setZoomTransforms:function(e,t){for(var n in this._levels)this._setZoomTransform(this._levels[n],e,t)},_setZoomTransform:function(e,t,n){var s=this._map.getZoomScale(n,e.zoom),c=e.origin.multiplyBy(s).subtract(this._map._getNewPixelOrigin(t,n)).round();G.any3d?Tt(e.el,c,s):$e(e.el,c)},_resetGrid:function(){var e=this._map,t=e.options.crs,n=this._tileSize=this.getTileSize(),s=this._tileZoom,c=this._map.getPixelWorldBounds(this._tileZoom);c&&(this._globalTileRange=this._pxBoundsToTileRange(c)),this._wrapX=t.wrapLng&&!this.options.noWrap&&[Math.floor(e.project([0,t.wrapLng[0]],s).x/n.x),Math.ceil(e.project([0,t.wrapLng[1]],s).x/n.y)],this._wrapY=t.wrapLat&&!this.options.noWrap&&[Math.floor(e.project([t.wrapLat[0],0],s).y/n.x),Math.ceil(e.project([t.wrapLat[1],0],s).y/n.y)]},_onMoveEnd:function(){!this._map||this._map._animatingZoom||this._update()},_getTiledPixelBounds:function(e){var t=this._map,n=t._animatingZoom?Math.max(t._animateToZoom,t.getZoom()):t.getZoom(),s=t.getZoomScale(n,this._tileZoom),c=t.project(e,this._tileZoom).floor(),h=t.getSize().divideBy(s*2);return new V(c.subtract(h),c.add(h))},_update:function(e){var t=this._map;if(t){var n=this._clampZoom(t.getZoom());if(e===void 0&&(e=t.getCenter()),this._tileZoom!==void 0){var s=this._getTiledPixelBounds(e),c=this._pxBoundsToTileRange(s),h=c.getCenter(),g=[],w=this.options.keepBuffer,k=new V(c.getBottomLeft().subtract([w,-w]),c.getTopRight().add([w,-w]));if(!(isFinite(c.min.x)&&isFinite(c.min.y)&&isFinite(c.max.x)&&isFinite(c.max.y)))throw new Error("Attempted to load an infinite number of tiles");for(var M in this._tiles){var j=this._tiles[M].coords;(j.z!==this._tileZoom||!k.contains(new O(j.x,j.y)))&&(this._tiles[M].current=!1)}if(Math.abs(n-this._tileZoom)>1){this._setView(e,n);return}for(var W=c.min.y;W<=c.max.y;W++)for(var le=c.min.x;le<=c.max.x;le++){var Re=new O(le,W);if(Re.z=this._tileZoom,!!this._isValidTile(Re)){var Ae=this._tiles[this._tileCoordsToKey(Re)];Ae?Ae.current=!0:g.push(Re)}}if(g.sort(function(He,Jt){return He.distanceTo(h)-Jt.distanceTo(h)}),g.length!==0){this._loading||(this._loading=!0,this.fire("loading"));var Xe=document.createDocumentFragment();for(le=0;le<g.length;le++)this._addTile(g[le],Xe);this._level.el.appendChild(Xe)}}}},_isValidTile:function(e){var t=this._map.options.crs;if(!t.infinite){var n=this._globalTileRange;if(!t.wrapLng&&(e.x<n.min.x||e.x>n.max.x)||!t.wrapLat&&(e.y<n.min.y||e.y>n.max.y))return!1}if(!this.options.bounds)return!0;var s=this._tileCoordsToBounds(e);return ae(this.options.bounds).overlaps(s)},_keyToBounds:function(e){return this._tileCoordsToBounds(this._keyToTileCoords(e))},_tileCoordsToNwSe:function(e){var t=this._map,n=this.getTileSize(),s=e.scaleBy(n),c=s.add(n),h=t.unproject(s,e.z),g=t.unproject(c,e.z);return[h,g]},_tileCoordsToBounds:function(e){var t=this._tileCoordsToNwSe(e),n=new ce(t[0],t[1]);return this.options.noWrap||(n=this._map.wrapLatLngBounds(n)),n},_tileCoordsToKey:function(e){return e.x+":"+e.y+":"+e.z},_keyToTileCoords:function(e){var t=e.split(":"),n=new O(+t[0],+t[1]);return n.z=+t[2],n},_removeTile:function(e){var t=this._tiles[e];t&&(ze(t.el),delete this._tiles[e],this.fire("tileunload",{tile:t.el,coords:this._keyToTileCoords(e)}))},_initTile:function(e){oe(e,"leaflet-tile");var t=this.getTileSize();e.style.width=t.x+"px",e.style.height=t.y+"px",e.onselectstart=y,e.onmousemove=y,G.ielt9&&this.options.opacity<1&&Je(e,this.options.opacity)},_addTile:function(e,t){var n=this._getTilePos(e),s=this._tileCoordsToKey(e),c=this.createTile(this._wrapCoords(e),u(this._tileReady,this,e));this._initTile(c),this.createTile.length<2&&F(u(this._tileReady,this,e,null,c)),$e(c,n),this._tiles[s]={el:c,coords:e,current:!0},t.appendChild(c),this.fire("tileloadstart",{tile:c,coords:e})},_tileReady:function(e,t,n){t&&this.fire("tileerror",{error:t,tile:n,coords:e});var s=this._tileCoordsToKey(e);n=this._tiles[s],n&&(n.loaded=+new Date,this._map._fadeAnimated?(Je(n.el,0),ee(this._fadeFrame),this._fadeFrame=F(this._updateOpacity,this)):(n.active=!0,this._pruneTiles()),t||(oe(n.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:n.el,coords:e})),this._noTilesToLoad()&&(this._loading=!1,this.fire("load"),G.ielt9||!this._map._fadeAnimated?F(this._pruneTiles,this):setTimeout(u(this._pruneTiles,this),250)))},_getTilePos:function(e){return e.scaleBy(this.getTileSize()).subtract(this._level.origin)},_wrapCoords:function(e){var t=new O(this._wrapX?v(e.x,this._wrapX):e.x,this._wrapY?v(e.y,this._wrapY):e.y);return t.z=e.z,t},_pxBoundsToTileRange:function(e){var t=this.getTileSize();return new V(e.min.unscaleBy(t).floor(),e.max.unscaleBy(t).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var e in this._tiles)if(!this._tiles[e].loaded)return!1;return!0}});function vl(e){return new bi(e)}var Kt=bi.extend({options:{minZoom:0,maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1,referrerPolicy:!1},initialize:function(e,t){this._url=e,t=_(this,t),t.detectRetina&&G.retina&&t.maxZoom>0?(t.tileSize=Math.floor(t.tileSize/2),t.zoomReverse?(t.zoomOffset--,t.minZoom=Math.min(t.maxZoom,t.minZoom+1)):(t.zoomOffset++,t.maxZoom=Math.max(t.minZoom,t.maxZoom-1)),t.minZoom=Math.max(0,t.minZoom)):t.zoomReverse?t.minZoom=Math.min(t.maxZoom,t.minZoom):t.maxZoom=Math.max(t.minZoom,t.maxZoom),typeof t.subdomains=="string"&&(t.subdomains=t.subdomains.split("")),this.on("tileunload",this._onTileRemove)},setUrl:function(e,t){return this._url===e&&t===void 0&&(t=!0),this._url=e,t||this.redraw(),this},createTile:function(e,t){var n=document.createElement("img");return te(n,"load",u(this._tileOnLoad,this,t,n)),te(n,"error",u(this._tileOnError,this,t,n)),(this.options.crossOrigin||this.options.crossOrigin==="")&&(n.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),typeof this.options.referrerPolicy=="string"&&(n.referrerPolicy=this.options.referrerPolicy),n.alt="",n.src=this.getTileUrl(e),n},getTileUrl:function(e){var t={r:G.retina?"@2x":"",s:this._getSubdomain(e),x:e.x,y:e.y,z:this._getZoomForUrl()};if(this._map&&!this._map.options.crs.infinite){var n=this._globalTileRange.max.y-e.y;this.options.tms&&(t.y=n),t["-y"]=n}return E(this._url,l(t,this.options))},_tileOnLoad:function(e,t){G.ielt9?setTimeout(u(e,this,null,t),0):e(null,t)},_tileOnError:function(e,t,n){var s=this.options.errorTileUrl;s&&t.getAttribute("src")!==s&&(t.src=s),e(n,t)},_onTileRemove:function(e){e.tile.onload=null},_getZoomForUrl:function(){var e=this._tileZoom,t=this.options.maxZoom,n=this.options.zoomReverse,s=this.options.zoomOffset;return n&&(e=t-e),e+s},_getSubdomain:function(e){var t=Math.abs(e.x+e.y)%this.options.subdomains.length;return this.options.subdomains[t]},_abortLoading:function(){var e,t;for(e in this._tiles)if(this._tiles[e].coords.z!==this._tileZoom&&(t=this._tiles[e].el,t.onload=y,t.onerror=y,!t.complete)){t.src=ne;var n=this._tiles[e].coords;ze(t),delete this._tiles[e],this.fire("tileabort",{tile:t,coords:n})}},_removeTile:function(e){var t=this._tiles[e];if(t)return t.el.setAttribute("src",ne),bi.prototype._removeTile.call(this,e)},_tileReady:function(e,t,n){if(!(!this._map||n&&n.getAttribute("src")===ne))return bi.prototype._tileReady.call(this,e,t,n)}});function Mo(e,t){return new Kt(e,t)}var Io=Kt.extend({defaultWmsParams:{service:"WMS",request:"GetMap",layers:"",styles:"",format:"image/jpeg",transparent:!1,version:"1.1.1"},options:{crs:null,uppercase:!1},initialize:function(e,t){this._url=e;var n=l({},this.defaultWmsParams);for(var s in t)s in this.options||(n[s]=t[s]);t=_(this,t);var c=t.detectRetina&&G.retina?2:1,h=this.getTileSize();n.width=h.x*c,n.height=h.y*c,this.wmsParams=n},onAdd:function(e){this._crs=this.options.crs||e.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var t=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[t]=this._crs.code,Kt.prototype.onAdd.call(this,e)},getTileUrl:function(e){var t=this._tileCoordsToNwSe(e),n=this._crs,s=re(n.project(t[0]),n.project(t[1])),c=s.min,h=s.max,g=(this._wmsVersion>=1.3&&this._crs===zo?[c.y,c.x,h.y,h.x]:[c.x,c.y,h.x,h.y]).join(","),w=Kt.prototype.getTileUrl.call(this,e);return w+P(this.wmsParams,w,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+g},setParams:function(e,t){return l(this.wmsParams,e),t||this.redraw(),this}});function yl(e,t){return new Io(e,t)}Kt.WMS=Io,Mo.wms=yl;var yt=it.extend({options:{padding:.1},initialize:function(e){_(this,e),m(this),this._layers=this._layers||{}},onAdd:function(){this._container||(this._initContainer(),oe(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update(),this.on("update",this._updatePaths,this)},onRemove:function(){this.off("update",this._updatePaths,this),this._destroyContainer()},getEvents:function(){var e={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};return this._zoomAnimated&&(e.zoomanim=this._onAnimZoom),e},_onAnimZoom:function(e){this._updateTransform(e.center,e.zoom)},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom())},_updateTransform:function(e,t){var n=this._map.getZoomScale(t,this._zoom),s=this._map.getSize().multiplyBy(.5+this.options.padding),c=this._map.project(this._center,t),h=s.multiplyBy(-n).add(c).subtract(this._map._getNewPixelOrigin(e,t));G.any3d?Tt(this._container,h,n):$e(this._container,h)},_reset:function(){this._update(),this._updateTransform(this._center,this._zoom);for(var e in this._layers)this._layers[e]._reset()},_onZoomEnd:function(){for(var e in this._layers)this._layers[e]._project()},_updatePaths:function(){for(var e in this._layers)this._layers[e]._update()},_update:function(){var e=this.options.padding,t=this._map.getSize(),n=this._map.containerPointToLayerPoint(t.multiplyBy(-e)).round();this._bounds=new V(n,n.add(t.multiplyBy(1+e*2)).round()),this._center=this._map.getCenter(),this._zoom=this._map.getZoom()}}),Po=yt.extend({options:{tolerance:0},getEvents:function(){var e=yt.prototype.getEvents.call(this);return e.viewprereset=this._onViewPreReset,e},_onViewPreReset:function(){this._postponeUpdatePaths=!0},onAdd:function(){yt.prototype.onAdd.call(this),this._draw()},_initContainer:function(){var e=this._container=document.createElement("canvas");te(e,"mousemove",this._onMouseMove,this),te(e,"click dblclick mousedown mouseup contextmenu",this._onClick,this),te(e,"mouseout",this._handleMouseOut,this),e._leaflet_disable_events=!0,this._ctx=e.getContext("2d")},_destroyContainer:function(){ee(this._redrawRequest),delete this._ctx,ze(this._container),we(this._container),delete this._container},_updatePaths:function(){if(!this._postponeUpdatePaths){var e;this._redrawBounds=null;for(var t in this._layers)e=this._layers[t],e._update();this._redraw()}},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){yt.prototype._update.call(this);var e=this._bounds,t=this._container,n=e.getSize(),s=G.retina?2:1;$e(t,e.min),t.width=s*n.x,t.height=s*n.y,t.style.width=n.x+"px",t.style.height=n.y+"px",G.retina&&this._ctx.scale(2,2),this._ctx.translate(-e.min.x,-e.min.y),this.fire("update")}},_reset:function(){yt.prototype._reset.call(this),this._postponeUpdatePaths&&(this._postponeUpdatePaths=!1,this._updatePaths())},_initPath:function(e){this._updateDashArray(e),this._layers[m(e)]=e;var t=e._order={layer:e,prev:this._drawLast,next:null};this._drawLast&&(this._drawLast.next=t),this._drawLast=t,this._drawFirst=this._drawFirst||this._drawLast},_addPath:function(e){this._requestRedraw(e)},_removePath:function(e){var t=e._order,n=t.next,s=t.prev;n?n.prev=s:this._drawLast=s,s?s.next=n:this._drawFirst=n,delete e._order,delete this._layers[m(e)],this._requestRedraw(e)},_updatePath:function(e){this._extendRedrawBounds(e),e._project(),e._update(),this._requestRedraw(e)},_updateStyle:function(e){this._updateDashArray(e),this._requestRedraw(e)},_updateDashArray:function(e){if(typeof e.options.dashArray=="string"){var t=e.options.dashArray.split(/[, ]+/),n=[],s,c;for(c=0;c<t.length;c++){if(s=Number(t[c]),isNaN(s))return;n.push(s)}e.options._dashArray=n}else e.options._dashArray=e.options.dashArray},_requestRedraw:function(e){this._map&&(this._extendRedrawBounds(e),this._redrawRequest=this._redrawRequest||F(this._redraw,this))},_extendRedrawBounds:function(e){if(e._pxBounds){var t=(e.options.weight||0)+1;this._redrawBounds=this._redrawBounds||new V,this._redrawBounds.extend(e._pxBounds.min.subtract([t,t])),this._redrawBounds.extend(e._pxBounds.max.add([t,t]))}},_redraw:function(){this._redrawRequest=null,this._redrawBounds&&(this._redrawBounds.min._floor(),this._redrawBounds.max._ceil()),this._clear(),this._draw(),this._redrawBounds=null},_clear:function(){var e=this._redrawBounds;if(e){var t=e.getSize();this._ctx.clearRect(e.min.x,e.min.y,t.x,t.y)}else this._ctx.save(),this._ctx.setTransform(1,0,0,1,0,0),this._ctx.clearRect(0,0,this._container.width,this._container.height),this._ctx.restore()},_draw:function(){var e,t=this._redrawBounds;if(this._ctx.save(),t){var n=t.getSize();this._ctx.beginPath(),this._ctx.rect(t.min.x,t.min.y,n.x,n.y),this._ctx.clip()}this._drawing=!0;for(var s=this._drawFirst;s;s=s.next)e=s.layer,(!t||e._pxBounds&&e._pxBounds.intersects(t))&&e._updatePath();this._drawing=!1,this._ctx.restore()},_updatePoly:function(e,t){if(this._drawing){var n,s,c,h,g=e._parts,w=g.length,k=this._ctx;if(w){for(k.beginPath(),n=0;n<w;n++){for(s=0,c=g[n].length;s<c;s++)h=g[n][s],k[s?"lineTo":"moveTo"](h.x,h.y);t&&k.closePath()}this._fillStroke(k,e)}}},_updateCircle:function(e){if(!(!this._drawing||e._empty())){var t=e._point,n=this._ctx,s=Math.max(Math.round(e._radius),1),c=(Math.max(Math.round(e._radiusY),1)||s)/s;c!==1&&(n.save(),n.scale(1,c)),n.beginPath(),n.arc(t.x,t.y/c,s,0,Math.PI*2,!1),c!==1&&n.restore(),this._fillStroke(n,e)}},_fillStroke:function(e,t){var n=t.options;n.fill&&(e.globalAlpha=n.fillOpacity,e.fillStyle=n.fillColor||n.color,e.fill(n.fillRule||"evenodd")),n.stroke&&n.weight!==0&&(e.setLineDash&&e.setLineDash(t.options&&t.options._dashArray||[]),e.globalAlpha=n.opacity,e.lineWidth=n.weight,e.strokeStyle=n.color,e.lineCap=n.lineCap,e.lineJoin=n.lineJoin,e.stroke())},_onClick:function(e){for(var t=this._map.mouseEventToLayerPoint(e),n,s,c=this._drawFirst;c;c=c.next)n=c.layer,n.options.interactive&&n._containsPoint(t)&&(!(e.type==="click"||e.type==="preclick")||!this._map._draggableMoved(n))&&(s=n);this._fireEvent(s?[s]:!1,e)},_onMouseMove:function(e){if(!(!this._map||this._map.dragging.moving()||this._map._animatingZoom)){var t=this._map.mouseEventToLayerPoint(e);this._handleMouseHover(e,t)}},_handleMouseOut:function(e){var t=this._hoveredLayer;t&&(Te(this._container,"leaflet-interactive"),this._fireEvent([t],e,"mouseout"),this._hoveredLayer=null,this._mouseHoverThrottled=!1)},_handleMouseHover:function(e,t){if(!this._mouseHoverThrottled){for(var n,s,c=this._drawFirst;c;c=c.next)n=c.layer,n.options.interactive&&n._containsPoint(t)&&(s=n);s!==this._hoveredLayer&&(this._handleMouseOut(e),s&&(oe(this._container,"leaflet-interactive"),this._fireEvent([s],e,"mouseover"),this._hoveredLayer=s)),this._fireEvent(this._hoveredLayer?[this._hoveredLayer]:!1,e),this._mouseHoverThrottled=!0,setTimeout(u(function(){this._mouseHoverThrottled=!1},this),32)}},_fireEvent:function(e,t,n){this._map._fireDOMEvent(t,n||t.type,e)},_bringToFront:function(e){var t=e._order;if(t){var n=t.next,s=t.prev;if(n)n.prev=s;else return;s?s.next=n:n&&(this._drawFirst=n),t.prev=this._drawLast,this._drawLast.next=t,t.next=null,this._drawLast=t,this._requestRedraw(e)}},_bringToBack:function(e){var t=e._order;if(t){var n=t.next,s=t.prev;if(s)s.next=n;else return;n?n.prev=s:s&&(this._drawLast=s),t.prev=null,t.next=this._drawFirst,this._drawFirst.prev=t,this._drawFirst=t,this._requestRedraw(e)}}});function Ao(e){return G.canvas?new Po(e):null}var xi=function(){try{return document.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(e){return document.createElement("<lvml:"+e+' class="lvml">')}}catch{}return function(e){return document.createElement("<"+e+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}(),bl={_initContainer:function(){this._container=me("div","leaflet-vml-container")},_update:function(){this._map._animatingZoom||(yt.prototype._update.call(this),this.fire("update"))},_initPath:function(e){var t=e._container=xi("shape");oe(t,"leaflet-vml-shape "+(this.options.className||"")),t.coordsize="1 1",e._path=xi("path"),t.appendChild(e._path),this._updateStyle(e),this._layers[m(e)]=e},_addPath:function(e){var t=e._container;this._container.appendChild(t),e.options.interactive&&e.addInteractiveTarget(t)},_removePath:function(e){var t=e._container;ze(t),e.removeInteractiveTarget(t),delete this._layers[m(e)]},_updateStyle:function(e){var t=e._stroke,n=e._fill,s=e.options,c=e._container;c.stroked=!!s.stroke,c.filled=!!s.fill,s.stroke?(t||(t=e._stroke=xi("stroke")),c.appendChild(t),t.weight=s.weight+"px",t.color=s.color,t.opacity=s.opacity,s.dashArray?t.dashStyle=q(s.dashArray)?s.dashArray.join(" "):s.dashArray.replace(/( *, *)/g," "):t.dashStyle="",t.endcap=s.lineCap.replace("butt","flat"),t.joinstyle=s.lineJoin):t&&(c.removeChild(t),e._stroke=null),s.fill?(n||(n=e._fill=xi("fill")),c.appendChild(n),n.color=s.fillColor||s.color,n.opacity=s.fillOpacity):n&&(c.removeChild(n),e._fill=null)},_updateCircle:function(e){var t=e._point.round(),n=Math.round(e._radius),s=Math.round(e._radiusY||n);this._setPath(e,e._empty()?"M0 0":"AL "+t.x+","+t.y+" "+n+","+s+" 0,"+65535*360)},_setPath:function(e,t){e._path.v=t},_bringToFront:function(e){qt(e._container)},_bringToBack:function(e){Ut(e._container)}},Yi=G.vml?xi:Oa,_i=yt.extend({_initContainer:function(){this._container=Yi("svg"),this._container.setAttribute("pointer-events","none"),this._rootGroup=Yi("g"),this._container.appendChild(this._rootGroup)},_destroyContainer:function(){ze(this._container),we(this._container),delete this._container,delete this._rootGroup,delete this._svgSize},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){yt.prototype._update.call(this);var e=this._bounds,t=e.getSize(),n=this._container;(!this._svgSize||!this._svgSize.equals(t))&&(this._svgSize=t,n.setAttribute("width",t.x),n.setAttribute("height",t.y)),$e(n,e.min),n.setAttribute("viewBox",[e.min.x,e.min.y,t.x,t.y].join(" ")),this.fire("update")}},_initPath:function(e){var t=e._path=Yi("path");e.options.className&&oe(t,e.options.className),e.options.interactive&&oe(t,"leaflet-interactive"),this._updateStyle(e),this._layers[m(e)]=e},_addPath:function(e){this._rootGroup||this._initContainer(),this._rootGroup.appendChild(e._path),e.addInteractiveTarget(e._path)},_removePath:function(e){ze(e._path),e.removeInteractiveTarget(e._path),delete this._layers[m(e)]},_updatePath:function(e){e._project(),e._update()},_updateStyle:function(e){var t=e._path,n=e.options;t&&(n.stroke?(t.setAttribute("stroke",n.color),t.setAttribute("stroke-opacity",n.opacity),t.setAttribute("stroke-width",n.weight),t.setAttribute("stroke-linecap",n.lineCap),t.setAttribute("stroke-linejoin",n.lineJoin),n.dashArray?t.setAttribute("stroke-dasharray",n.dashArray):t.removeAttribute("stroke-dasharray"),n.dashOffset?t.setAttribute("stroke-dashoffset",n.dashOffset):t.removeAttribute("stroke-dashoffset")):t.setAttribute("stroke","none"),n.fill?(t.setAttribute("fill",n.fillColor||n.color),t.setAttribute("fill-opacity",n.fillOpacity),t.setAttribute("fill-rule",n.fillRule||"evenodd")):t.setAttribute("fill","none"))},_updatePoly:function(e,t){this._setPath(e,ja(e._parts,t))},_updateCircle:function(e){var t=e._point,n=Math.max(Math.round(e._radius),1),s=Math.max(Math.round(e._radiusY),1)||n,c="a"+n+","+s+" 0 1,0 ",h=e._empty()?"M0 0":"M"+(t.x-n)+","+t.y+c+n*2+",0 "+c+-n*2+",0 ";this._setPath(e,h)},_setPath:function(e,t){e._path.setAttribute("d",t)},_bringToFront:function(e){qt(e._path)},_bringToBack:function(e){Ut(e._path)}});G.vml&&_i.include(bl);function Bo(e){return G.svg||G.vml?new _i(e):null}ue.include({getRenderer:function(e){var t=e.options.renderer||this._getPaneRenderer(e.options.pane)||this.options.renderer||this._renderer;return t||(t=this._renderer=this._createRenderer()),this.hasLayer(t)||this.addLayer(t),t},_getPaneRenderer:function(e){if(e==="overlayPane"||e===void 0)return!1;var t=this._paneRenderers[e];return t===void 0&&(t=this._createRenderer({pane:e}),this._paneRenderers[e]=t),t},_createRenderer:function(e){return this.options.preferCanvas&&Ao(e)||Bo(e)}});var Ro=Gt.extend({initialize:function(e,t){Gt.prototype.initialize.call(this,this._boundsToLatLngs(e),t)},setBounds:function(e){return this.setLatLngs(this._boundsToLatLngs(e))},_boundsToLatLngs:function(e){return e=ae(e),[e.getSouthWest(),e.getNorthWest(),e.getNorthEast(),e.getSouthEast()]}});function xl(e,t){return new Ro(e,t)}_i.create=Yi,_i.pointsToPath=ja,vt.geometryToLayer=Ui,vt.coordsToLatLng=Xn,vt.coordsToLatLngs=Zi,vt.latLngToCoords=Qn,vt.latLngsToCoords=Vi,vt.getFeature=Wt,vt.asFeature=Gi,ue.mergeOptions({boxZoom:!0});var Oo=rt.extend({initialize:function(e){this._map=e,this._container=e._container,this._pane=e._panes.overlayPane,this._resetStateTimeout=0,e.on("unload",this._destroy,this)},addHooks:function(){te(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){we(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_destroy:function(){ze(this._pane),delete this._pane},_resetState:function(){this._resetStateTimeout=0,this._moved=!1},_clearDeferredResetState:function(){this._resetStateTimeout!==0&&(clearTimeout(this._resetStateTimeout),this._resetStateTimeout=0)},_onMouseDown:function(e){if(!e.shiftKey||e.which!==1&&e.button!==1)return!1;this._clearDeferredResetState(),this._resetState(),pi(),Bn(),this._startPoint=this._map.mouseEventToContainerPoint(e),te(document,{contextmenu:It,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseMove:function(e){this._moved||(this._moved=!0,this._box=me("div","leaflet-zoom-box",this._container),oe(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(e);var t=new V(this._point,this._startPoint),n=t.getSize();$e(this._box,t.min),this._box.style.width=n.x+"px",this._box.style.height=n.y+"px"},_finish:function(){this._moved&&(ze(this._box),Te(this._container,"leaflet-crosshair")),hi(),Rn(),we(document,{contextmenu:It,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(e){if(!(e.which!==1&&e.button!==1)&&(this._finish(),!!this._moved)){this._clearDeferredResetState(),this._resetStateTimeout=setTimeout(u(this._resetState,this),0);var t=new ce(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(t).fire("boxzoomend",{boxZoomBounds:t})}},_onKeyDown:function(e){e.keyCode===27&&(this._finish(),this._clearDeferredResetState(),this._resetState())}});ue.addInitHook("addHandler","boxZoom",Oo),ue.mergeOptions({doubleClickZoom:!0});var jo=rt.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(e){var t=this._map,n=t.getZoom(),s=t.options.zoomDelta,c=e.originalEvent.shiftKey?n-s:n+s;t.options.doubleClickZoom==="center"?t.setZoom(c):t.setZoomAround(e.containerPoint,c)}});ue.addInitHook("addHandler","doubleClickZoom",jo),ue.mergeOptions({dragging:!0,inertia:!0,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1,maxBoundsViscosity:0});var Ho=rt.extend({addHooks:function(){if(!this._draggable){var e=this._map;this._draggable=new _t(e._mapPane,e._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),this._draggable.on("predrag",this._onPreDragLimit,this),e.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDragWrap,this),e.on("zoomend",this._onZoomEnd,this),e.whenReady(this._onZoomEnd,this))}oe(this._map._container,"leaflet-grab leaflet-touch-drag"),this._draggable.enable(),this._positions=[],this._times=[]},removeHooks:function(){Te(this._map._container,"leaflet-grab"),Te(this._map._container,"leaflet-touch-drag"),this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},moving:function(){return this._draggable&&this._draggable._moving},_onDragStart:function(){var e=this._map;if(e._stop(),this._map.options.maxBounds&&this._map.options.maxBoundsViscosity){var t=ae(this._map.options.maxBounds);this._offsetLimit=re(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())),this._viscosity=Math.min(1,Math.max(0,this._map.options.maxBoundsViscosity))}else this._offsetLimit=null;e.fire("movestart").fire("dragstart"),e.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(e){if(this._map.options.inertia){var t=this._lastTime=+new Date,n=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(n),this._times.push(t),this._prunePositions(t)}this._map.fire("move",e).fire("drag",e)},_prunePositions:function(e){for(;this._positions.length>1&&e-this._times[0]>50;)this._positions.shift(),this._times.shift()},_onZoomEnd:function(){var e=this._map.getSize().divideBy(2),t=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=t.subtract(e).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_viscousLimit:function(e,t){return e-(e-t)*this._viscosity},_onPreDragLimit:function(){if(!(!this._viscosity||!this._offsetLimit)){var e=this._draggable._newPos.subtract(this._draggable._startPos),t=this._offsetLimit;e.x<t.min.x&&(e.x=this._viscousLimit(e.x,t.min.x)),e.y<t.min.y&&(e.y=this._viscousLimit(e.y,t.min.y)),e.x>t.max.x&&(e.x=this._viscousLimit(e.x,t.max.x)),e.y>t.max.y&&(e.y=this._viscousLimit(e.y,t.max.y)),this._draggable._newPos=this._draggable._startPos.add(e)}},_onPreDragWrap:function(){var e=this._worldWidth,t=Math.round(e/2),n=this._initialWorldOffset,s=this._draggable._newPos.x,c=(s-t+n)%e+t-n,h=(s+t+n)%e-t-n,g=Math.abs(c+n)<Math.abs(h+n)?c:h;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=g},_onDragEnd:function(e){var t=this._map,n=t.options,s=!n.inertia||e.noInertia||this._times.length<2;if(t.fire("dragend",e),s)t.fire("moveend");else{this._prunePositions(+new Date);var c=this._lastPos.subtract(this._positions[0]),h=(this._lastTime-this._times[0])/1e3,g=n.easeLinearity,w=c.multiplyBy(g/h),k=w.distanceTo([0,0]),M=Math.min(n.inertiaMaxSpeed,k),j=w.multiplyBy(M/k),W=M/(n.inertiaDeceleration*g),le=j.multiplyBy(-W/2).round();!le.x&&!le.y?t.fire("moveend"):(le=t._limitOffset(le,t.options.maxBounds),F(function(){t.panBy(le,{duration:W,easeLinearity:g,noMoveStart:!0,animate:!0})}))}}});ue.addInitHook("addHandler","dragging",Ho),ue.mergeOptions({keyboard:!0,keyboardPanDelta:80});var No=rt.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(e){this._map=e,this._setPanDelta(e.options.keyboardPanDelta),this._setZoomDelta(e.options.zoomDelta)},addHooks:function(){var e=this._map._container;e.tabIndex<=0&&(e.tabIndex="0"),te(e,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),we(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){if(!this._focused){var e=document.body,t=document.documentElement,n=e.scrollTop||t.scrollTop,s=e.scrollLeft||t.scrollLeft;this._map._container.focus(),window.scrollTo(s,n)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanDelta:function(e){var t=this._panKeys={},n=this.keyCodes,s,c;for(s=0,c=n.left.length;s<c;s++)t[n.left[s]]=[-1*e,0];for(s=0,c=n.right.length;s<c;s++)t[n.right[s]]=[e,0];for(s=0,c=n.down.length;s<c;s++)t[n.down[s]]=[0,e];for(s=0,c=n.up.length;s<c;s++)t[n.up[s]]=[0,-1*e]},_setZoomDelta:function(e){var t=this._zoomKeys={},n=this.keyCodes,s,c;for(s=0,c=n.zoomIn.length;s<c;s++)t[n.zoomIn[s]]=e;for(s=0,c=n.zoomOut.length;s<c;s++)t[n.zoomOut[s]]=-e},_addHooks:function(){te(document,"keydown",this._onKeyDown,this)},_removeHooks:function(){we(document,"keydown",this._onKeyDown,this)},_onKeyDown:function(e){if(!(e.altKey||e.ctrlKey||e.metaKey)){var t=e.keyCode,n=this._map,s;if(t in this._panKeys){if(!n._panAnim||!n._panAnim._inProgress)if(s=this._panKeys[t],e.shiftKey&&(s=R(s).multiplyBy(3)),n.options.maxBounds&&(s=n._limitOffset(R(s),n.options.maxBounds)),n.options.worldCopyJump){var c=n.wrapLatLng(n.unproject(n.project(n.getCenter()).add(s)));n.panTo(c)}else n.panBy(s)}else if(t in this._zoomKeys)n.setZoom(n.getZoom()+(e.shiftKey?3:1)*this._zoomKeys[t]);else if(t===27&&n._popup&&n._popup.options.closeOnEscapeKey)n.closePopup();else return;It(e)}}});ue.addInitHook("addHandler","keyboard",No),ue.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40,wheelPxPerZoomLevel:60});var Do=rt.extend({addHooks:function(){te(this._map._container,"wheel",this._onWheelScroll,this),this._delta=0},removeHooks:function(){we(this._map._container,"wheel",this._onWheelScroll,this)},_onWheelScroll:function(e){var t=uo(e),n=this._map.options.wheelDebounceTime;this._delta+=t,this._lastMousePos=this._map.mouseEventToContainerPoint(e),this._startTime||(this._startTime=+new Date);var s=Math.max(n-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(u(this._performZoom,this),s),It(e)},_performZoom:function(){var e=this._map,t=e.getZoom(),n=this._map.options.zoomSnap||0;e._stop();var s=this._delta/(this._map.options.wheelPxPerZoomLevel*4),c=4*Math.log(2/(1+Math.exp(-Math.abs(s))))/Math.LN2,h=n?Math.ceil(c/n)*n:c,g=e._limitZoom(t+(this._delta>0?h:-h))-t;this._delta=0,this._startTime=null,g&&(e.options.scrollWheelZoom==="center"?e.setZoom(t+g):e.setZoomAround(this._lastMousePos,t+g))}});ue.addInitHook("addHandler","scrollWheelZoom",Do);var _l=600;ue.mergeOptions({tapHold:G.touchNative&&G.safari&&G.mobile,tapTolerance:15});var Fo=rt.extend({addHooks:function(){te(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){we(this._map._container,"touchstart",this._onDown,this)},_onDown:function(e){if(clearTimeout(this._holdTimeout),e.touches.length===1){var t=e.touches[0];this._startPos=this._newPos=new O(t.clientX,t.clientY),this._holdTimeout=setTimeout(u(function(){this._cancel(),this._isTapValid()&&(te(document,"touchend",Be),te(document,"touchend touchcancel",this._cancelClickPrevent),this._simulateEvent("contextmenu",t))},this),_l),te(document,"touchend touchcancel contextmenu",this._cancel,this),te(document,"touchmove",this._onMove,this)}},_cancelClickPrevent:function e(){we(document,"touchend",Be),we(document,"touchend touchcancel",e)},_cancel:function(){clearTimeout(this._holdTimeout),we(document,"touchend touchcancel contextmenu",this._cancel,this),we(document,"touchmove",this._onMove,this)},_onMove:function(e){var t=e.touches[0];this._newPos=new O(t.clientX,t.clientY)},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_simulateEvent:function(e,t){var n=new MouseEvent(e,{bubbles:!0,cancelable:!0,view:window,screenX:t.screenX,screenY:t.screenY,clientX:t.clientX,clientY:t.clientY});n._simulated=!0,t.target.dispatchEvent(n)}});ue.addInitHook("addHandler","tapHold",Fo),ue.mergeOptions({touchZoom:G.touch,bounceAtZoomLimits:!0});var qo=rt.extend({addHooks:function(){oe(this._map._container,"leaflet-touch-zoom"),te(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){Te(this._map._container,"leaflet-touch-zoom"),we(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(e){var t=this._map;if(!(!e.touches||e.touches.length!==2||t._animatingZoom||this._zooming)){var n=t.mouseEventToContainerPoint(e.touches[0]),s=t.mouseEventToContainerPoint(e.touches[1]);this._centerPoint=t.getSize()._divideBy(2),this._startLatLng=t.containerPointToLatLng(this._centerPoint),t.options.touchZoom!=="center"&&(this._pinchStartLatLng=t.containerPointToLatLng(n.add(s)._divideBy(2))),this._startDist=n.distanceTo(s),this._startZoom=t.getZoom(),this._moved=!1,this._zooming=!0,t._stop(),te(document,"touchmove",this._onTouchMove,this),te(document,"touchend touchcancel",this._onTouchEnd,this),Be(e)}},_onTouchMove:function(e){if(!(!e.touches||e.touches.length!==2||!this._zooming)){var t=this._map,n=t.mouseEventToContainerPoint(e.touches[0]),s=t.mouseEventToContainerPoint(e.touches[1]),c=n.distanceTo(s)/this._startDist;if(this._zoom=t.getScaleZoom(c,this._startZoom),!t.options.bounceAtZoomLimits&&(this._zoom<t.getMinZoom()&&c<1||this._zoom>t.getMaxZoom()&&c>1)&&(this._zoom=t._limitZoom(this._zoom)),t.options.touchZoom==="center"){if(this._center=this._startLatLng,c===1)return}else{var h=n._add(s)._divideBy(2)._subtract(this._centerPoint);if(c===1&&h.x===0&&h.y===0)return;this._center=t.unproject(t.project(this._pinchStartLatLng,this._zoom).subtract(h),this._zoom)}this._moved||(t._moveStart(!0,!1),this._moved=!0),ee(this._animRequest);var g=u(t._move,t,this._center,this._zoom,{pinch:!0,round:!1},void 0);this._animRequest=F(g,this,!0),Be(e)}},_onTouchEnd:function(){if(!this._moved||!this._zooming){this._zooming=!1;return}this._zooming=!1,ee(this._animRequest),we(document,"touchmove",this._onTouchMove,this),we(document,"touchend touchcancel",this._onTouchEnd,this),this._map.options.zoomAnimation?this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),!0,this._map.options.zoomSnap):this._map._resetView(this._center,this._map._limitZoom(this._zoom))}});ue.addInitHook("addHandler","touchZoom",qo),ue.BoxZoom=Oo,ue.DoubleClickZoom=jo,ue.Drag=Ho,ue.Keyboard=No,ue.ScrollWheelZoom=Do,ue.TapHold=Fo,ue.TouchZoom=qo,o.Bounds=V,o.Browser=G,o.CRS=mt,o.Canvas=Po,o.Circle=Yn,o.CircleMarker=qi,o.Class=$,o.Control=tt,o.DivIcon=$o,o.DivOverlay=lt,o.DomEvent=Hr,o.DomUtil=Or,o.Draggable=_t,o.Evented=J,o.FeatureGroup=ft,o.GeoJSON=vt,o.GridLayer=bi,o.Handler=rt,o.Icon=Vt,o.ImageOverlay=Wi,o.LatLng=de,o.LatLngBounds=ce,o.Layer=it,o.LayerGroup=Zt,o.LineUtil=Xr,o.Map=ue,o.Marker=Fi,o.Mixin=Vr,o.Path=wt,o.Point=O,o.PolyUtil=Gr,o.Polygon=Gt,o.Polyline=gt,o.Popup=Ki,o.PosAnimation=po,o.Projection=Qr,o.Rectangle=Ro,o.Renderer=yt,o.SVG=_i,o.SVGOverlay=To,o.TileLayer=Kt,o.Tooltip=Ji,o.Transformation=kn,o.Util=Z,o.VideoOverlay=So,o.bind=u,o.bounds=re,o.canvas=Ao,o.circle=rl,o.circleMarker=sl,o.control=gi,o.divIcon=gl,o.extend=l,o.featureGroup=nl,o.geoJSON=Eo,o.geoJson=dl,o.gridLayer=vl,o.icon=al,o.imageOverlay=ul,o.latLng=Y,o.latLngBounds=ae,o.layerGroup=il,o.map=Nr,o.marker=ol,o.point=R,o.polygon=cl,o.polyline=ll,o.popup=ml,o.rectangle=xl,o.setOptions=_,o.stamp=m,o.svg=Bo,o.svgOverlay=hl,o.tileLayer=Mo,o.tooltip=fl,o.transformation=li,o.version=r,o.videoOverlay=pl;var wl=window.L;o.noConflict=function(){return window.L=wl,this},window.L=o})})(ba,ba.exports);var md=ba.exports;const Ie=hd(md),Ma="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcYBeBeoQIhRAkLlRDGrhIgY3BJL8CVeKzuyXFzzjkn5ZxzzuScg3PO8cKzu70JkO0LfxdTU//pM9vTu7Xgf6KqOVTb9X7toRrVEfBf1HTVjZccrT/2by1VV928Yty9ZbVuucdz90frG8DBjl9pVApbOstvmMuvVgaNXSfAAd6pGxpy6yxf5ph43pS/4f3uoaGm2rdu72S9xzOvMymkZFq/ptDrk90mhW7e4zl7HLzhxGWPR20xmSxJ/VqldG5m9XhaVOA1DadsNh3Pu5L2N6QtPO/32JpqQBVVk20oy/Pi2s23WEvyfHbe1thadVQttvm7Llf65gGmXK67XtupyoM7HQhmXdLS8oGWJNeOJ3C5fG5XCEJnkez3/oFdsvgJ4l2ANZwhrJKk/7OSXa+3Vw2WJMlKnGkobouYk6T0TyX30klOUnTD9HJ5qpckL3EW/w4XF3Xd0FGywXUrstrclVsqz5Pd/sXFYyDnPdrLcQODmGOK47IZb4CmibmMn+MYRzFZ5jg33ZL/EJrWcszHmANy3ARBK/IXtciJy8VsitPSdE3uuHxzougojcUdr8/32atnz/ev3f/K5wtpxUTpcaI45zusVDpYtZi+jg0oU9b3x74h7+n9ABvYEZeKaVq0sh0AtLKsFtqNBdeT0MrSzwwlq9+x6xAO4tgOtSzbCjrNQQiNvQUbUEubvzBUeGw26yDCsRHCoLkTHDa7IdOLIThs/gHvChszh2CimE8peRs47cxANI0lYNB5y1DljpOF0IhzBDPOZnDOqYYbeGKECbPzWnXludPphw5c2YBq5zlwXphIbO4VDCZ0gnPfUO1TwZoYwAs2ExPCedAu9DAjfQUjzITQb3jNj0KG2Sgt6BHaQUdYzWz+XmBktOHwanXjaSTcwwziBcuMOtwBmqPrTOxFQR/DRKKPqyur0aiW6cULYsx6tBm0jXpR/AUWR6HRq9WVW6MRhIq5jLyjbaCTDCijyYJNpCajdyobP/eTw0iexBAKkJ3gA5KcQb2zBXsIBckn+xVv8jkZSaEFHE+jFEleAEfayRU0MouNoBmB/L50Ai/HSLIHxcrpCvnhSQAuakKp2C/YbCylJjXRVy/z3+Kv/RrNcCo+WUzlVEhzKffnTQnxeN9fWF88fiNCUdSTsaufaChKWInHeysygfpIqagoakW+vV20J8uyl6TyNKEZWV4oRSPyCkWpgOLSbkCObT8o2r6tlG58HQquf6O0v50tB7JM7F4EORd2dx/K0w/KHsVkLPaoYrwgP/y7krr3SSMA4zj+OBgmjYkxcdIJQyQRKgg2viX9Hddi9UBb29LrKR7CVVEEEXWojUkXNyfTNDE14W9gbHJNuhjDettN3ZvbOvdOqCD3Jp/9l+/wJE+9PkYGjx/fqkys3S2rMozM/o2106rfMUINo6hVqz+eu/hd1c4xTg0TAfy5kV+4UG6+IthHTU9woWmxuKNbTfuCSfovBCxq7EtHqvYL4Sm6F8GVxsSXHMQ07TOi1DKtZxjWaaIyi4CXWjxPccUw8WVbMYY5wxC1mzEyXMJWkllpRloi+Kkoq69sxBTlElF6aAxYUbjXNlhlDZilDnM4U5SlN5biRsRHnbx3mbeWjEh4mEyiuJDl5XcWVmX5GvNkFgLWZM5qwsop4/AWfLhU1cR7k1VVvcYCWRkOI6Xy5gmnphCYIkvzuNYzHzosq2oNk2RtSs8khfUOfHIDgR6ysYBaMpl4uEgk2U/oJTs9AaTSwma7dT69geAE2ZpEjUsn2ieJNHeKfrI3EcAGJ2ZaNgVuC8EBctCLc57P5u5led6IOBkIYkuQMrmmjChs4VkfOerHqSBkPzZlhe06RslZ3zMjk2sscqKwY0RcjKK+LWbzd7KiHhkncs/siFJ+V5eXxD34B8nVuJEpGJNmxN2gH3vSvp7J70tF+D1Ej8qUJD1TkErAND2GZwTFg/LubvmgiBG3SOvdlsqFQrkEzJCL1rstlnVFROixZoDDSuXQFHESwVGlcuQcMb/b42NgjLowh5MTDFE3vNB5qStRIErdCQEh6pLPR92anSUb/wAIhldAaDMpGgAAAABJRU5ErkJggg==",Ia="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",Pa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";delete Ie.Icon.Default.prototype._getIconUrl;Ie.Icon.Default.mergeOptions({iconRetinaUrl:Ma,iconUrl:Ia,shadowUrl:Pa});const fd="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",gd='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';function vd(i){if(!i||i.latitude==null||i.longitude==null)return"";const a=Number(i.latitude),o=Number(i.longitude);if(isNaN(a)||isNaN(o))return"";const r=i.maps_url||`https://www.google.com/maps/search/?api=1&query=${a},${o}`,l=`readonly-map-${i.entity_id||"preview"}-${Math.random().toString(36).substring(2,7)}`;return`
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
  `}function yd(){document.querySelectorAll(".entity-readonly-map-instance").forEach(a=>{if(a.dataset.initialized)return;const o=parseFloat(a.dataset.lat),r=parseFloat(a.dataset.lng);if(!(isNaN(o)||isNaN(r))){a.dataset.initialized="true";try{const l=Ie.map(a,{center:[o,r],zoom:14,zoomControl:!0,attributionControl:!0,scrollWheelZoom:!1});Ie.tileLayer(fd,{attribution:gd,maxZoom:19}).addTo(l),Ie.marker([o,r]).addTo(l),setTimeout(()=>{l.invalidateSize()},200)}catch(l){console.warn("[ReadOnlyMap] Failed to initialize map container:",l)}}})}function se(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function Aa({id:i}){var l;const a=String(i||"").split("?")[0].split("#")[0];if(!a||a==="new"){Q("/entities/new"+(window.location.search||""));return}if(!ht(Q))return;const o=qe(),r=document.getElementById("app");r.innerHTML=Le(`
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
  `,`Case #${a}`),Ce();try{const[d,u,p,m,f]=await Promise.all([be.get(a),Ss.list(a).catch(()=>({data:[]})),be.audit(a).catch(()=>({data:{auditLogs:[],approvalHistory:[]}})),be.getLineage(a).catch(()=>({data:{current:null,parent:null,children:[],rules:[]}})),be.workflow(a).catch(()=>({data:{allowedTransitions:[]}}))]),v=d.data,y=u.data||[],b=p.data||{auditLogs:[],approvalHistory:[]},x=m.data||{current:null,parent:null,children:[],rules:[]},z=f.data||{allowedTransitions:[]};let _=[];try{_=(await yn.list({entity_type_id:v.entity_type_id})).data||[]}catch{_=[]}if(document.getElementById("header-title").textContent=v.name,["approved","coordinator_approved","verified","in_progress","resolved","closed"].includes(String(v.status||"").toLowerCase())&&((l=v.entityType)==null?void 0:l.name)!=="Civic Campaign"){const E=document.getElementById("header-extra-actions");E&&(E.innerHTML=`
          <a href="/meme/studio/${v.entity_id}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; border-color:#f59e0b; color:#d97706; background:#fffbeb;">
            <span>⚡</span> Create Civic Meme
          </a>
        `)}bd(document.getElementById("detail-content"),v,y,b,x,z,_,o)}catch(d){console.error("Failed to load case detail:",d),ie("Failed to load case details"),document.getElementById("detail-content").innerHTML=`<div class="alert alert-error">Failed to load case #${a}. It may not exist.</div>`}}function bd(i,a,o,r,l,d,u,p){var Z,$;const m=pt(a.entityType),f=["draft","submitted","coordinator_approved","approved"],v=f.indexOf(a.status)!==-1?f.indexOf(a.status):-1,y=a.status==="rejected";let b='<div class="workflow-steps mt-4 mb-2">';f.forEach((C,D)=>{const J=D<v||D===v&&!y&&a.status==="approved",O=D===v&&a.status!=="approved";b+=`
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${y&&D===v?"rejected":J?"done":O?"current":""}">${D+1}</div>
          <div class="workflow-step-label mt-1">${wd(C)}</div>
        </div>
        ${D<f.length-1?`<div class="workflow-step-connector ${J?"done":""}"></div>`:""}
      </div>
    `}),y&&(b+=`
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `),b+="</div>";const x=xd(a,d.allowedTransitions||[],p),z=p&&["coordinator_area","coordinator_general","director","admin"].includes(p.role);let _="";z&&a.status!=="deleted"&&(_=`
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
    `);let P="";l.children&&l.children.length>0&&(P=`
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
                ${l.children.map(C=>`
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(C.entity_id).padStart(5,"0")} ${se(C.name)}</strong>
                      <span class="badge badge-secondary ml-2">${se(C.type_name)}</span>
                    </div>
                    <a href="/entities/${C.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);const T=o.map(C=>{var D,J;return`
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${se(((D=C.parameterMaster)==null?void 0:D.label)||((J=C.parameterMaster)==null?void 0:J.field_key)||`Parameter #${C.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${se(C.value||"—")}</td>
    </tr>
  `}).join(""),E=o.length>0?`<div class="table-container"><table class="table"><tbody>${T}</tbody></table></div>`:'<div class="text-muted p-4">No custom parameter values submitted for this case.</div>',q=r.auditLogs||[];r.approvalHistory;const H=q.map(C=>`
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${se(C.user||"System")}</strong> (${se(C.role||"User")})</span>
        <span>${new Date(C.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${C.action==="status_transition"?`Status Transition: <strong>${Ht(C.old_status)}</strong> → <strong>${Ht(C.new_status)}</strong>`:`Action Executed: <strong>${C.action}</strong>`}
      </div>
      ${C.reason?`<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${se(C.reason)}"</div>`:""}
    </div>
  `).join(""),ne=q.length>0?`<div>${H}</div>`:'<div class="text-muted p-4">No audit logs recorded yet for this case.</div>';let pe="";u.length>0&&(pe=`
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
            ${u.map(C=>`
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${C.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${se(C.report_name)}"
              </button>
            `).join("")}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `);let he="";(l.parent||l.children&&l.children.length>0)&&(he=`
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
              <a href="/entities/${l.parent.entity_id}" class="text-link font-medium">#PR-${String(l.parent.entity_id).padStart(5,"0")} ${se(l.parent.name)} (${se(((Z=l.parent.entityType)==null?void 0:Z.name)||"Capability")})</a>
            </div>
          `:""}
          ${l.children&&l.children.length>0?`
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${l.children.map(C=>`
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${C.entity_id}" class="text-link font-medium">#PR-${String(C.entity_id).padStart(5,"0")} ${se(C.name)}</a>
                    <span class="badge badge-secondary ml-2">${se(C.type_name)}</span>
                  </div>
                  <span class="badge badge-${C.status}">${Ht(C.status)}</span>
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
              <span class="badge badge-primary font-semibold">${se(m.title)}</span>
              <span class="badge badge-${a.status}">${Ht(a.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${se(a.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${se((($=a.owner)==null?void 0:$.name)||"System")}</strong> • Jurisdiction Area: <strong>${se(a.area||"—")}</strong> • Location: <strong>${se(a.location||"—")}</strong>
            </div>
          </div>
        </div>
        ${b}
      </div>
    </div>

    ${P}
    ${_}
    ${vd(a)}
    ${pe}
    ${he}

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
              ${x}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const A=document.getElementById("tab-info"),U=document.getElementById("tab-audit"),K=document.getElementById("tab-content");A&&U&&K&&(A.addEventListener("click",()=>{A.classList.add("active"),U.classList.remove("active"),K.innerHTML=E}),U.addEventListener("click",()=>{U.classList.add("active"),A.classList.remove("active"),K.innerHTML=ne}));const F=document.getElementById("btn-generate-ai");F&&F.addEventListener("click",()=>Cd(a,o)),document.querySelectorAll(".execute-rep-btn").forEach(C=>{C.addEventListener("click",()=>{const D=C.getAttribute("data-repid");Ld(D)})}),kd(a.entity_id),yd(),typeof window.civicTranslatePage=="function"&&window.civicTranslatePage()}function xd(i,a,o){const r=[],l=String(i.status||"draft").trim().toLowerCase(),d=new Set;if(Array.isArray(a)&&a.length>0&&a.forEach(u=>{const p=u.action||u.to||u.to_status;if(!p||d.has(p))return;d.add(p);const m=p==="rejected",f=_d(l,p),v=m?"btn-danger":"btn-primary";r.push(`
        <button class="btn ${v} btn-full wf-action-btn mt-2" 
          data-to="${se(p)}" 
          data-label="${se(f)}"
          data-reason="${m?"true":"false"}">
          ${se(f)}
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
            Your coordinator account is assigned to <strong>"${se(u)}"</strong>, but this case belongs to <strong>"${se(p)}"</strong>.
            <div style="margin-top:8px; font-size:12px; color:#7c2d12;">
              Area Coordinators are strictly authorized to verify cases within their own jurisdiction. Only a Coordinator assigned to <strong>${se(p)}</strong> (or a General Coordinator) can verify this case.
            </div>
          </div>
        `}return`<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${se((o==null?void 0:o.role)||"user")}) at status "${se(Ht(l))}".</div>`}return r.join("")}function _d(i,a){const o=String(a||"").toLowerCase(),r=String(i||"").toLowerCase();return r==="draft"&&o==="submitted"?"Submit Request":r==="submitted"&&(o==="coordinator_approved"||o==="verified")?"Verify & Recommend Approval":r==="coordinator_approved"&&o==="approved"||r==="verified"&&o==="approved"?"Executive Approval (Director)":o==="rejected"?"Reject Request":`Transition to ${a}`}function wd(i){return i==="draft"?"Draft":i==="submitted"?"Submitted":i==="coordinator_approved"?"Coord Approved":i==="verified"?"Verified":i==="approved"?"Approved":i==="rejected"?"Rejected":i}function kd(i){const a=r=>{const l=r.getAttribute("data-to"),d=r.getAttribute("data-label")||`Transition to ${l}`,u=r.getAttribute("data-reason")==="true";if(r.getAttribute("data-rule")==="true"){zd(i);return}u?(ya({title:"Provide Reason for Rejection",content:`
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",ni),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{const m=document.getElementById("action-reason").value.trim();if(!m){ie("Reason is required for rejection");return}ni(),ss(i,l,m)})):(ya({title:`Confirm Action: ${d}`,content:`
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${se(d)}</strong> for case #${i}?
          </p>
        `,footer:`
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,onClose:()=>{}}),document.getElementById("cancel-modal-btn").addEventListener("click",ni),document.getElementById("confirm-action-btn").addEventListener("click",async()=>{ni(),ss(i,l,null)}))};document.querySelectorAll(".wf-action-btn, #btn-fire-rules").forEach(r=>{r.addEventListener("click",()=>a(r))})}async function ss(i,a,o){try{const r=await be.transition(i,a,o);xe(r.message||`Status updated to ${a}`),Aa({id:i})}catch(r){ie(r.message||"Transition failed")}}async function zd(i){var a,o;try{const r=await be.fireRules(i,"approved");xe(`Rule Engine executed! ${((o=(a=r.data)==null?void 0:a.createdEntities)==null?void 0:o.length)||0} entity created.`),Aa({id:i})}catch(r){ie(r.message||"Rule trigger failed")}}async function Ld(i){const a=document.getElementById("report-result-output");if(a){a.style.display="block",a.innerHTML='<div class="spinner spinner-sm"></div> Running report...';try{const r=(await yn.execute(i)).data;let l=(r.rows||[]).map(d=>{var u;return`
      <tr>
        <td>${se(d[r.groupBy]||d.area||"Total")}</td>
        <td style="font-weight:bold;">${d[(u=r.metric)==null?void 0:u.toLowerCase()]||d.count||d.total_count||0}</td>
      </tr>
    `}).join("");a.innerHTML=`
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${se(r.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${se(r.groupBy||"Group")}</th><th>${se(r.metric)}</th></tr></thead>
          <tbody>${l}</tbody>
        </table>
      </div>
    `}catch(o){a.innerHTML=`<div class="alert alert-error">Report execution failed: ${se(o.message)}</div>`}}}async function Cd(i,a=[]){const o=i.entity_id,r=document.getElementById("ai-report-body");if(r){r.innerHTML=`
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:var(--primary); margin:0 auto 12px auto;"></div>
      <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Running Civic Intelligence Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Evaluating observations, patterns, recommendations, and evidence.</div>
    </div>
  `;try{const l=await be.aiAnalysis(o);xe("Civic Intelligence Analysis generated successfully!"),r.innerHTML=rs(l.data)}catch(l){if(String(l.message||"").includes("GEMINI_API_KEY")||String(l.message||"").includes("Gemini API key")){xe("Generated Civic Decision Intelligence Preview from Case Parameters");const u=Ed(i,a);r.innerHTML=rs(u)}else ie(l.message||"Could not generate AI report"),r.innerHTML=`<div class="alert alert-error">AI Analysis failed: ${se(l.message)}</div>`}}}function Ed(i,a=[]){var p;const o={};if(Array.isArray(a))for(const m of a){const f=((p=m.parameterMaster)==null?void 0:p.field_key)||`param_${m.parameter_id}`;o[f]=m.value}const r=o.problem_need||o.description||i.name||"Civic improvement proposal",l=o.proposed_solution||"Community coordination and departmental municipal intervention",d=o.urgency||"Normal",u=i.area||"Ward / Area Jurisdiction";return{problem_summary:`The initiative "${i.name}" in ${u} highlights a local priority: "${r}". The citizen proposes "${l}".`,root_cause_analysis:[`Localized civic and infrastructure upkeep requirement in ${u}.`,"Gap between standard municipal routine maintenance and citizen-level expectations.","Absence of structured community-departmental participatory coordination."],stakeholder_analysis:[{group:`Residents & Citizens of ${u}`,interest:"Timely resolution, cleaner living environment, and reliable public amenities."},{group:"Area Coordinator & Field Inspectors",interest:"On-site verification of scope, resource estimation, and jurisdiction validation."},{group:"Competent Department (Works / Sanitation)",interest:"Feasibility check, alignment with ward budget, and task execution."}],risk_register:[{risk:`Delays in site inspection may exacerbate citizen grievances in ${u}`,severity:d==="Urgent"||d==="Critical"?"High":"Medium"},{risk:"Potential overlap with scheduled municipal ward maintenance works",severity:"Low"},{risk:"Incomplete initial citizen documentation requiring field verification",severity:"Low"}],recommendation:[`Area Coordinator should verify the physical site in ${u} and confirm exact requirements.`,"Coordinate with the relevant zonal engineering / sanitation unit to assess resource requirements.","If verified, transition case status to 'coordinator_approved' to forward for Executive Director sanction."],notice:"Live GEMINI_API_KEY is not configured in backend/.env. This structured decision analysis was synthesized by the CIVIC-KALKI Governance Intelligence Engine using case parameters."}}function rs(i){const a=Array.isArray(i.recommendation)?i.recommendation:Array.isArray(i.actionable_recommendations)?i.actionable_recommendations:[i.recommendation||i.actionable_recommendations||"Proceed with field verification."],o=Array.isArray(i.root_cause_analysis)?i.root_cause_analysis:[i.root_cause_analysis||"No root cause factors recorded."],r=Array.isArray(i.stakeholder_analysis)?i.stakeholder_analysis:[],l=Array.isArray(i.risk_register)?i.risk_register:[];return`
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      ${i.notice?`
        <div style="margin-bottom:12px; padding:10px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:12px; color:#1e40af; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Notice:</strong> ${se(i.notice)}</div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">1. Observations & Problem Scope</strong>
        <p style="margin:0; color:var(--text-secondary);">${se(i.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">2. Patterns & Root Cause Analysis</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${o.map(d=>`<li style="margin-bottom:4px;">${se(d)}</li>`).join("")}
        </ul>
      </div>

      ${r.length>0?`
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">3. Stakeholder Impact Analysis</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${r.map(d=>`
              <div style="font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                <strong style="color:var(--text-primary);">${se(d.group||"Stakeholder")}:</strong>
                <span style="color:var(--text-secondary); margin-left:4px;">${se(d.interest||"")}</span>
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
                  <span style="color:var(--text-primary);">${se(d.risk||"")}</span>
                  <span style="padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px; ${p}">${se(d.severity||"Medium")}</span>
                </div>
              `}).join("")}
          </div>
        </div>
      `:""}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">5. Recommendations for Coordinator / Executive Action</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${a.map(d=>`<li style="margin-bottom:4px;">${se(d)}</li>`).join("")}
        </ul>
      </div>

      <div style="padding:10px 12px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700); display:flex; align-items:center; gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Civic Intelligence Protocol:</strong> This automated advisory report is generated to assist municipal coordinators and directors. Ground evidence and field verification must precede final sanction.</span>
      </div>
    </div>
  `}const Qt=[{type:"country",label:"Country"},{type:"state",label:"State / Province"},{type:"city",label:"City / District"},{type:"ward",label:"Ward / Local Area"}];function Ci(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Sd(i,a){if(!a)return Ci(i);const o=new RegExp(`(${a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return Ci(i).replace(o,'<strong style="color:var(--primary,#ff5a36);">$1</strong>')}class Td{constructor(a,o={}){this._container=a,this._required=o.required||!1,this._onChange=o.onChange||null,this._prefix=o.labelPrefix||"jsel",this._levelStates=[],this._hiddenInput=null,this._destroyed=!1,this._onDocumentClick=this._handleDocumentClick.bind(this),document.addEventListener("click",this._onDocumentClick)}async init(){this._render(),await this._loadLevel(0,null)}getValue(){const a=this._levelStates.map(r=>r.selectedItem).filter(Boolean);return a.length===0?null:{jurisdiction_id:a[a.length-1].jurisdiction_id,display_path:a.map(r=>r.name).join(" › ")}}async setValue(a){if(a)try{const o=await an.get(a),{path:r}=o.data;if(!Array.isArray(r)||r.length===0)return;for(let d=0;d<r.length;d++){const u=d===0?null:r[d-1].jurisdiction_id;await this._loadLevel(d,u);const p=r[d],m=this._levelStates[d].items.find(f=>f.jurisdiction_id===p.jurisdiction_id)||p;this._setSelection(d,m,!1)}this._syncHidden(),this._notifyChange();const l=r.length;if(l<Qt.length){const d=r[r.length-1].jurisdiction_id;await this._loadLevel(l,d)}}catch(o){console.warn("[JurisdictionSelector] setValue failed:",o)}}destroy(){this._destroyed=!0,document.removeEventListener("click",this._onDocumentClick),this._container.innerHTML="",this._levelStates=[],this._hiddenInput=null}_render(){this._container.innerHTML="",this._container.classList.add("jurisdiction-selector");const a=document.createElement("div");a.className="jurisdiction-selector-grid",Qt.forEach((r,l)=>{const d=document.createElement("div");d.className="form-group jsel-group",d.id=`${this._prefix}-group-${l}`;const u=this._required&&l===0?'<span class="required">*</span>':"",p=document.createElement("label");p.className="form-label",p.innerHTML=`${Ci(r.label)} ${u}`;const m=document.createElement("div");m.className="jsel-combobox",m.id=`${this._prefix}-combobox-${l}`;const f=document.createElement("div");f.className="jsel-trigger is-disabled",f.setAttribute("tabindex",l===0?"0":"-1"),f.setAttribute("role","combobox"),f.setAttribute("aria-expanded","false"),f.setAttribute("aria-label",r.label);const v=document.createElement("span");v.className="jsel-trigger-text is-placeholder",v.textContent=l===0?`-- Search or Select ${r.label} --`:`-- Select ${Qt[l-1].label} first --`;const y=document.createElement("div");y.className="jsel-trigger-actions";const b=document.createElement("button");b.type="button",b.className="jsel-clear-btn",b.title="Clear selection",b.style.display="none",b.innerHTML="&#x2715;";const x=document.createElement("span");x.className="jsel-chevron",x.innerHTML='<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',y.appendChild(b),y.appendChild(x),f.appendChild(v),f.appendChild(y);const z=document.createElement("div");z.className="jsel-dropdown";const _=document.createElement("div");_.className="jsel-search-wrapper",_.innerHTML=`
        <svg class="jsel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;const P=document.createElement("input");P.type="text",P.className="jsel-search-input",P.placeholder=`Search ${r.label}...`,P.setAttribute("autocomplete","off"),_.appendChild(P);const T=document.createElement("ul");T.className="jsel-options-list",T.setAttribute("role","listbox"),z.appendChild(_),z.appendChild(T),m.appendChild(f),m.appendChild(z),d.appendChild(p),d.appendChild(m),a.appendChild(d),this._levelStates[l]={meta:r,groupEl:d,comboboxEl:m,triggerEl:f,triggerTextEl:v,clearBtnEl:b,dropdownEl:z,searchInputEl:P,optionsListEl:T,items:[],filteredItems:[],selectedItem:null,focusedIdx:-1,isOpen:!1,disabled:l!==0},f.addEventListener("click",E=>{E.target.closest(".jsel-clear-btn")||this._toggleDropdown(l)}),f.addEventListener("keydown",E=>{this._levelStates[l].disabled||(E.key==="Enter"||E.key===" "||E.key==="ArrowDown")&&(E.preventDefault(),this._openDropdown(l))}),b.addEventListener("click",E=>{E.stopPropagation(),this._clearSelection(l)}),P.addEventListener("input",E=>{this._filterOptions(l,E.target.value)}),P.addEventListener("keydown",E=>{this._handleSearchKeydown(l,E)})}),this._container.appendChild(a);const o=document.createElement("input");o.type="hidden",o.name="_jurisdiction_id",o.id=`${this._prefix}-hidden`,o.value="",this._container.appendChild(o),this._hiddenInput=o}async _loadLevel(a,o){if(this._destroyed)return;const r=this._levelStates[a];if(r){r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.className="jsel-trigger-text is-placeholder",r.triggerTextEl.textContent=`Loading ${r.meta.label}…`,r.optionsListEl.innerHTML=`<li class="jsel-loading"><div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Loading ${r.meta.label}...</li>`;try{const l=o==null?{}:{parent_id:String(o)},u=(await an.list(l)).data||[];if(this._destroyed)return;if(r.items=u,r.filteredItems=u,u.length===0){r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.textContent=`-- No ${r.meta.label} available --`,this._clearLevelsFrom(a+1);return}r.disabled=!1,r.triggerEl.classList.remove("is-disabled"),r.triggerEl.setAttribute("tabindex","0"),r.triggerTextEl.textContent=`-- Search or Select ${r.meta.label} --`,this._renderOptionsList(a,"")}catch(l){console.warn("[JurisdictionSelector] Failed to load level",a,l),r.disabled=!0,r.triggerEl.classList.add("is-disabled"),r.triggerTextEl.textContent=`-- Error loading ${r.meta.label} --`}}}_renderOptionsList(a,o){const r=this._levelStates[a],l=r.optionsListEl;l.innerHTML="",r.focusedIdx=-1;const d=(o||"").trim().toLowerCase();let u=r.items;if(d&&(u=r.items.filter(m=>m.name&&m.name.toLowerCase().includes(d)||m.code&&m.code.toLowerCase().includes(d))),r.filteredItems=u,u.length===0){l.innerHTML=`<li class="jsel-empty">No ${Ci(r.meta.label)} found matching "${Ci(o)}"</li>`;return}if(a===0&&!d){const m=r.items.find(f=>f.name==="India");if(m){const f=document.createElement("li");f.className="jsel-divider",f.textContent="★ Pinned / Quick Select",l.appendChild(f);const v=this._createOptionElement(a,m,d,0);l.appendChild(v);const y=document.createElement("li");y.className="jsel-divider",y.textContent=`All Countries (${r.items.length})`,l.appendChild(y)}}if(u.slice(0,150).forEach((m,f)=>{const v=this._createOptionElement(a,m,d,f);l.appendChild(v)}),u.length>150){const m=document.createElement("li");m.className="jsel-empty",m.style.fontSize="0.78rem",m.style.padding="8px",m.textContent=`Showing top 150 of ${u.length} matches — type to narrow down`,l.appendChild(m)}}_createOptionElement(a,o,r,l){const d=this._levelStates[a],u=d.selectedItem&&d.selectedItem.jurisdiction_id===o.jurisdiction_id,p=document.createElement("li");p.className=`jsel-option ${u?"is-selected":""}`,p.setAttribute("role","option"),p.setAttribute("aria-selected",u?"true":"false"),p.dataset.index=String(l);const m=document.createElement("span");if(m.innerHTML=Sd(o.name,r),p.appendChild(m),o.code){const f=document.createElement("span");f.className="jsel-option-badge",f.textContent=o.code,p.appendChild(f)}return p.addEventListener("click",f=>{f.stopPropagation(),this._selectItem(a,o)}),p}_toggleDropdown(a){const o=this._levelStates[a];o.disabled||(o.isOpen?this._closeDropdown(a):this._openDropdown(a))}_openDropdown(a){this._levelStates.forEach((r,l)=>{l!==a&&r.isOpen&&this._closeDropdown(l)});const o=this._levelStates[a];o.disabled||(o.isOpen=!0,o.comboboxEl.classList.add("is-open"),o.triggerEl.classList.add("is-active"),o.triggerEl.setAttribute("aria-expanded","true"),o.searchInputEl.value="",this._renderOptionsList(a,""),setTimeout(()=>{o.searchInputEl.focus()},50))}_closeDropdown(a){const o=this._levelStates[a];o.isOpen&&(o.isOpen=!1,o.comboboxEl.classList.remove("is-open"),o.triggerEl.classList.remove("is-active"),o.triggerEl.setAttribute("aria-expanded","false"))}_filterOptions(a,o){this._renderOptionsList(a,o)}_handleSearchKeydown(a,o){const r=this._levelStates[a],l=r.optionsListEl.querySelectorAll(".jsel-option");l.length!==0&&(o.key==="ArrowDown"?(o.preventDefault(),r.focusedIdx=Math.min(r.focusedIdx+1,l.length-1),this._updateFocus(l,r.focusedIdx)):o.key==="ArrowUp"?(o.preventDefault(),r.focusedIdx=Math.max(r.focusedIdx-1,0),this._updateFocus(l,r.focusedIdx)):o.key==="Enter"?(o.preventDefault(),r.focusedIdx>=0&&r.focusedIdx<l.length?l[r.focusedIdx].click():l.length>0&&l[0].click()):o.key==="Escape"&&(this._closeDropdown(a),r.triggerEl.focus()))}_updateFocus(a,o){a.forEach((r,l)=>{l===o?(r.classList.add("is-focused"),r.scrollIntoView({block:"nearest"})):r.classList.remove("is-focused")})}_selectItem(a,o){this._setSelection(a,o,!0),this._closeDropdown(a);const r=a+1;r<Qt.length&&this._loadLevel(r,o.jurisdiction_id)}_setSelection(a,o,r=!0){const l=this._levelStates[a];l.selectedItem=o,l.triggerTextEl.className="jsel-trigger-text",l.triggerTextEl.textContent=o.name,l.clearBtnEl.style.display="flex",r&&(this._clearLevelsFrom(a+1),this._syncHidden(),this._notifyChange())}_clearSelection(a){const o=this._levelStates[a];o.selectedItem=null,o.triggerTextEl.className="jsel-trigger-text is-placeholder",o.triggerTextEl.textContent=`-- Search or Select ${o.meta.label} --`,o.clearBtnEl.style.display="none",this._clearLevelsFrom(a+1),this._syncHidden(),this._notifyChange()}_clearLevelsFrom(a){for(let o=a;o<Qt.length;o++){const r=this._levelStates[o];r&&(r.selectedItem=null,r.disabled=!0,r.items=[],r.filteredItems=[],r.triggerEl.classList.add("is-disabled"),r.triggerEl.setAttribute("tabindex","-1"),r.triggerTextEl.className="jsel-trigger-text is-placeholder",r.triggerTextEl.textContent=`-- Select ${Qt[o-1].label} first --`,r.clearBtnEl.style.display="none",r.optionsListEl.innerHTML="",this._closeDropdown(o))}}_handleDocumentClick(a){this._destroyed||this._levelStates.forEach((o,r)=>{o.isOpen&&!o.comboboxEl.contains(a.target)&&this._closeDropdown(r)})}_syncHidden(){if(!this._hiddenInput)return;const a=this.getValue();this._hiddenInput.value=a?String(a.jurisdiction_id):""}_notifyChange(){const a=this.getValue();this._onChange&&this._onChange(a),this._container.dispatchEvent(new CustomEvent("jurisdiction:change",{bubbles:!0,detail:a}))}}delete Ie.Icon.Default.prototype._getIconUrl;Ie.Icon.Default.mergeOptions({iconRetinaUrl:Ma,iconUrl:Ia,shadowUrl:Pa});const $d="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",Md='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',Id=[28.6139,77.209],Pd=13;function Ad(i,a={}){const o=typeof i=="string"?document.getElementById(i):i;if(!o)return console.error("[LocationPicker] Mount target not found:",i),null;let r={latitude:a.initialLat?Number(a.initialLat):null,longitude:a.initialLng?Number(a.initialLng):null,area:a.initialArea?String(a.initialArea).trim():"",address:""},l=null,d=null,u=0;const p="loc-picker-"+Math.random().toString(36).substring(2,9);o.innerHTML=`
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
          <input type="text" id="${p}-area-input" class="form-control" placeholder="Locality / Ward (optional)" value="${ra(r.area)}">
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
  `;const m=document.getElementById(`${p}-map`),f=document.getElementById(`${p}-feedback`),v=document.getElementById(`${p}-search-input`),y=document.getElementById(`${p}-btn-search`),b=document.getElementById(`${p}-btn-geolocate`),x=document.getElementById(`${p}-area-input`),z=document.getElementById(`${p}-coords-text`);function _(A,U="error"){f&&(f.style.display="block",U==="error"?(f.style.background="#fef2f2",f.style.border="1px solid #fecaca",f.style.color="#dc2626"):U==="info"?(f.style.background="#eff6ff",f.style.border="1px solid #bfdbfe",f.style.color="#1d4ed8"):(f.style.background="#f0fdf4",f.style.border="1px solid #bbf7d0",f.style.color="#16a34a"),f.textContent=A)}function P(){f&&(f.style.display="none",f.textContent="")}function T(){z&&(r.latitude!=null&&r.longitude!=null?z.innerHTML=`Coordinates: <strong>${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}</strong> ${r.address?` • <span title="${ra(r.address)}">${ra(r.address)}</span>`:""}`:z.textContent="Click on the map or drag the pin to set exact coordinates")}function E(A,U,K="",F=!0){r.latitude=Math.round(A*1e6)/1e6,r.longitude=Math.round(U*1e6)/1e6,K&&(r.address=K),T(),!d&&l?(d=Ie.marker([r.latitude,r.longitude],{draggable:!0}).addTo(l),d.on("dragend",ee=>{const Z=ee.target.getLatLng();E(Z.lat,Z.lng,"",!1)})):d&&d.setLatLng([r.latitude,r.longitude]),F&&l&&l.setView([r.latitude,r.longitude],Math.max(l.getZoom(),14)),a.onChange&&a.onChange(pe())}function q(){if(!m)return;const A=r.latitude&&r.longitude?[r.latitude,r.longitude]:Id,U=r.latitude&&r.longitude?14:Pd;l=Ie.map(m,{center:A,zoom:U,zoomControl:!0,attributionControl:!0}),Ie.tileLayer($d,{attribution:Md,maxZoom:19}).addTo(l),r.latitude&&r.longitude&&(d=Ie.marker([r.latitude,r.longitude],{draggable:!0}).addTo(l),d.on("dragend",K=>{const F=K.target.getLatLng();E(F.lat,F.lng,"",!1)})),l.on("click",K=>{E(K.latlng.lat,K.latlng.lng,"",!1)}),setTimeout(()=>{l&&l.invalidateSize()},250)}async function H(){if(P(),!navigator.geolocation){_("Geolocation is not supported by your browser. Please search or pick manually on the map.","error");return}b.disabled=!0;const A=b.innerHTML;b.innerHTML='<span class="spinner" style="width:14px;height:14px;border-width:2px;margin-right:6px;"></span> Locating...',navigator.geolocation.getCurrentPosition(U=>{b.disabled=!1,b.innerHTML=A;const K=U.coords.latitude,F=U.coords.longitude;E(K,F,"Current Location",!0),_("Location retrieved successfully from GPS.","success"),setTimeout(P,3500)},U=>{b.disabled=!1,b.innerHTML=A;let K="Could not retrieve your location. Please use the search bar or click on the map.";U.code===1?K="Location permission was denied. Please use the search box or click on the map.":U.code===2?K="Location unavailable. Please search for your location.":U.code===3&&(K="Location request timed out. Please try searching for your area."),_(K,"error")},{timeout:1e4,enableHighAccuracy:!0,maximumAge:0})}async function ne(){P();const A=String(v.value||"").trim();if(!A){_("Please enter an address, city, or landmark to search.","error");return}const U=Date.now();if(U-u<1e3){_("Please wait a second before searching again.","info");return}u=U,y.disabled=!0;const K=y.textContent;y.textContent="Searching...";try{const F=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(A)}&limit=1`,ee=await fetch(F,{headers:{Accept:"application/json"}});if(!ee.ok)throw new Error(`Geocoding failed with status ${ee.status}`);const Z=await ee.json();if(!Array.isArray(Z)||Z.length===0){_(`No location found for "${A}". Try a broader address or landmark.`,"error");return}const $=Z[0],C=parseFloat($.lat),D=parseFloat($.lon),J=$.display_name||A;E(C,D,J,!0),_(`Found: ${J}`,"success"),setTimeout(P,4e3)}catch(F){console.warn("[LocationPicker] Nominatim search error:",F),_("Failed to lookup address. Please click directly on the map to set coordinates.","error")}finally{y.disabled=!1,y.textContent=K}}b&&b.addEventListener("click",H),y&&y.addEventListener("click",ne),v&&v.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),ne())}),x&&x.addEventListener("input",A=>{r.area=A.target.value.trim(),a.onChange&&a.onChange(pe())}),q();function pe(){return{latitude:r.latitude,longitude:r.longitude,area:r.area?r.area:null,address:r.address||null}}function he(){l&&(l.remove(),l=null),o.innerHTML=""}return{getValue:pe,setCoordinates:E,destroy:he}}function ra(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const Bd="/api";function Fe(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let si=null,nt=null,zt=[],ii=null,Nt=null,Ei=new Map;const Rd=new Set(["title","name","movement_title","area","jurisdiction","jurisdiction_id","location","landmark","reported_date","reported_on","contact_person","contact_phone","contact_email","priority_level","volunteer_coordinator"]);function Ks(i){const a=String(i.field_key||"").trim().toLowerCase();return Rd.has(a)}async function Js(i={},a=null){if(!ht(Q))return;try{zt=(await be.listTypes().catch(()=>({data:[]}))).data||[]}catch{zt=[]}const o=a||new URLSearchParams(window.location.search);o.has("entity_type_id")?nt=Number(o.get("entity_type_id")):zt.length>0&&(nt=zt[0].entity_type_id);const r=zt.find(u=>Number(u.entity_type_id)===Number(nt));ii=pt(r);const l=document.getElementById("app");l.innerHTML=Le(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${Fe(ii.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${zt.map(u=>{const p=pt(u);return`<option value="${u.entity_type_id}" ${Number(nt)===Number(u.entity_type_id)?"selected":""}>${Fe(p.title)}</option>`}).join("")}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `,ii.title,zt),Ce(),document.getElementById("entity-type-select").addEventListener("change",async u=>{const p=u.target.value;if(!p){document.getElementById("dynamic-form-container").innerHTML="",si=null;return}nt=Number(p);const m=zt.find(f=>Number(f.entity_type_id)===Number(nt));ii=pt(m),document.getElementById("page-capability-title").textContent=ii.title,window.history.replaceState({},"",`/entities/new?entity_type_id=${nt}`),await ls(nt)}),nt&&await ls(nt)}async function ls(i){Nt&&(Nt.destroy(),Nt=null);const a=document.getElementById("dynamic-form-container");a.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{si=(await Ea.schema(i)).data,Hd(a,si),await Od()}catch(o){console.error("Form schema load error:",o),ie("Failed to load form schema"),a.innerHTML='<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>'}}async function Od(){const i=document.getElementById("jurisdiction-selector-mount");i&&(Nt=new Td(i,{required:!0,labelPrefix:"ent-jsel"}),await Nt.init())}function jd(i){var z;const a=i.mandatory||i.is_mandatory,o=a?"required":"",r=a?'<span class="required">*</span>':"",l=`param_${i.parameter_id}`,d=(i.field_type||i.data_type||"text").toLowerCase(),u=Fe(i.label||i.field_key),p=(z=i.options)==null?void 0:z.depends_on;let m="",f="",v="";p&&p.field_key&&(m=`data-depends-key="${Fe(p.field_key)}" data-depends-val="${Fe(p.value)}"`,f="conditional-field",v="display:none;");const b=["textarea","file","location"].includes(d)?"flex:1 1 100%; min-width:100%;":"flex:1 1 calc(50% - 8px); min-width:200px;";let x="";switch(d){case"location":x=`
        <div id="location-picker-mount-${i.parameter_id}" class="location-picker-field-mount" data-parameter-id="${i.parameter_id}"></div>
      `;break;case"textarea":x=`<textarea name="${l}" class="form-control" rows="3" ${o} placeholder="Enter ${u.toLowerCase()}..."></textarea>`;break;case"number":x=`<input type="number" name="${l}" class="form-control" ${o} placeholder="0">`;break;case"date":x=`<input type="date" name="${l}" class="form-control" ${o}>`;break;case"email":x=`<input type="email" name="${l}" class="form-control" ${o} placeholder="email@example.com">`;break;case"phone":x=`<input type="tel" name="${l}" class="form-control" ${o} placeholder="+91 XXXXX XXXXX">`;break;case"checkbox":x=`
        <div class="check-group mt-2">
          <input type="checkbox" name="${l}" id="${l}" value="true">
          <label for="${l}">Yes</label>
        </div>
      `;break;case"select":{const _=i.meta_options||(i.options?Array.isArray(i.options)?i.options:i.options.choices:null)||["Option 1","Option 2"],P=i.options&&i.options.default?i.options.default:"";x=`<select name="${l}" class="form-control" ${o}>
        <option value="">-- Select --</option>
        ${_.map(T=>`<option value="${Fe(T)}" ${T===P?"selected":""}>${Fe(T)}</option>`).join("")}
      </select>`;break}case"file":x=`
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
      `;break;default:x=`<input type="text" name="${l}" class="form-control" ${o} placeholder="Enter ${u.toLowerCase()}...">`;break}return`<div class="form-group ${f}" ${m} style="${v} ${b}">
    <label class="form-label">${u} ${r}</label>
    ${x}
  </div>`}function Hd(i,a){if(!a||!a.sections||a.sections.length===0){i.innerHTML='<div class="alert alert-warning">This capability has no form fields configured yet.</div>';return}let o=`
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${Fe(ii.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(a.configuration_errors)&&a.configuration_errors.length>0?`<div class="alert alert-warning m-4">${Fe(a.configuration_errors.join(" "))}</div>`:""}

      <form id="dynamic-form" style="padding:24px;">
  `,r=!1,l=!1;a.sections.forEach((p,m)=>{const f=(p.section_name||p.title||"").trim(),v=m===0,y=f.toLowerCase().includes("where")||f.toLowerCase().includes("location");o+=`
      <div class="form-section mb-6" data-section-name="${Fe(f)}">
        <div class="form-section-title">${Fe(f)}</div>
        ${p.description?`<div class="form-section-subtitle">${Fe(p.description)}</div>`:""}
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
      `,l=!0),(p.subsections||[]).forEach(b=>{b.subsection_name&&b.subsection_name!=="Main"&&(o+=`<div class="form-subsection mt-3"><div class="form-subsection-title">${Fe(b.subsection_name)}</div>`);const z=[...b.parameters||[]].sort((_,P)=>(_.display_order||0)-(P.display_order||0)).filter(_=>!Ks(_)&&String(_.field_key||"").trim()&&String(_.label||"").trim());z.length>0&&(o+='<div class="form-row mt-3" style="display:flex; flex-wrap:wrap; gap:16px;">',z.forEach(_=>{o+=jd(_)}),o+="</div>"),b.subsection_name&&b.subsection_name!=="Main"&&(o+="</div>")}),o+="</div>"}),l||(o+=`
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
  `,i.innerHTML=o,Ei.forEach(p=>p.destroy&&p.destroy()),Ei.clear(),i.querySelectorAll(".location-picker-field-mount").forEach(p=>{const m=p.getAttribute("data-parameter-id"),f=Ad(p);f&&Ei.set(String(m),f)});const u=document.getElementById("dynamic-form");u.addEventListener("submit",Dd),Nd(u,a)}function Nd(i,a){const o=[];(a.sections||[]).forEach(d=>{(d.subsections||[]).forEach(u=>{(u.parameters||[]).forEach(p=>o.push(p))})});const r=i.querySelectorAll(".conditional-field");if(r.length===0)return;function l(){r.forEach(d=>{const u=d.getAttribute("data-depends-key"),p=d.getAttribute("data-depends-val");if(!u)return;const m=o.find(b=>b.field_key===u);if(!m)return;const f=i.querySelector(`[name="param_${m.parameter_id}"]`);if(!f)return;String(f.value||"").trim().toLowerCase()===String(p).toLowerCase()?(d.style.display="",d.querySelectorAll("input, select, textarea").forEach(b=>{b.disabled=!1})):(d.style.display="none",d.querySelectorAll("input, select, textarea").forEach(b=>{b.disabled=!0,b.value=""}))})}i.addEventListener("change",l),i.addEventListener("input",l),l()}async function Dd(i){i.preventDefault();const a=document.getElementById("form-validation-alert");a&&(a.classList.add("hidden"),a.textContent="");const o=document.getElementById("submit-form-btn");o.disabled=!0,o.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';try{const r=new FormData(i.target),l=Object.fromEntries(r.entries());if(!l._base_name||!l._base_name.trim()){const b=document.getElementById("base_name");throw b&&b.focus(),new Error("Title / Summary is a required field.")}const d=Nt?Nt.getValue():null;if(!d)throw new Error("Please select a jurisdiction (at minimum a Country) before submitting.");if(si&&si.sections){for(const b of si.sections)for(const x of b.subsections||[])for(const z of x.parameters||[])if(!Ks(z)&&(z.mandatory||z.is_mandatory)){const _=i.target.querySelector(`[name="param_${z.parameter_id}"]`);if(_&&!_.disabled&&!(_.type==="file"?_.files&&_.files.length>0:String(_.value||"").trim()))throw _.focus(),new Error(`"${z.label||z.field_key}" is a required field.`)}}let u=null;for(const[b,x]of Ei.entries()){const z=x.getValue();if(z&&z.latitude!=null&&z.longitude!=null){u=z;break}}const p={entity_type_id:nt,name:l._base_name.trim(),jurisdiction_id:d.jurisdiction_id,area:u&&u.area?u.area:d.display_path,location:l._base_location?l._base_location.trim():u&&u.address?u.address:null,status:"submitted",...u?{latitude:u.latitude,longitude:u.longitude}:{}},f=(await be.create(p)).data.entity_id;u&&u.latitude!=null&&u.longitude!=null&&await be.update(f,{latitude:u.latitude,longitude:u.longitude,...u.area?{area:u.area}:{}});const v=[];for(const[b,x]of r.entries())if(b.startsWith("param_")){const z=Number(b.replace("param_",""));if(Ei.has(String(z)))continue;const _=i.target.querySelector(`[name="${b}"]`);if(_&&(_.type==="file"||_.disabled))continue;x!=null&&String(x).trim()!==""&&v.push({parameter_id:z,value:String(x).trim()})}v.length>0&&await Ss.create(f,v);const y=i.target.querySelectorAll('input[type="file"]');for(const b of y)if(b.files&&b.files.length>0){const x=b.getAttribute("data-parameter-id");if(!x)continue;const z=new FormData;z.append("entity_id",f),z.append("parameter_id",x);for(const _ of b.files)z.append("files",_);try{await fetch(`${Bd}/files/upload`,{method:"POST",headers:{"X-Requested-With":"ck-web"},credentials:"include",body:z})}catch(_){console.warn("File upload warning:",_)}}xe("Request submitted successfully!"),Fd(f,l._base_name)}catch(r){const l=r.message||"Failed to submit request";a&&(a.textContent=l,a.classList.remove("hidden")),ie(l),o.disabled=!1,o.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request'}}function Fd(i,a){const o=document.getElementById("dynamic-form-container"),r=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});o.innerHTML=`
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
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${Fe(a)}</div>
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
  `}let dn=[],Rt=null,Dt="";async function qd(){if(!Ca(["admin"],Q))return;const i=document.getElementById("app");i.innerHTML=Le(`
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
        <input type="text" id="user-search-input" class="form-control" style="padding-left: 42px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search users by email (e.g. demo.coord.area@example.com), name, or assigned area..." value="${Ge(Dt)}">
        ${Dt?'<button id="clear-search-btn" class="btn btn-ghost btn-sm" style="position:absolute; right:10px; padding:4px 8px; font-size:12px;">Clear</button>':""}
      </div>
    </div>

    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Admin"),Ce(),Ud(),await un()}let cs=null;function Ud(){const i=document.getElementById("user-search-input");if(!i)return;i.addEventListener("input",o=>{Dt=o.target.value.trim(),clearTimeout(cs),cs=setTimeout(()=>{un(Dt)},200)});const a=document.getElementById("clear-search-btn");a&&a.addEventListener("click",()=>{Dt="",i.value="",a.remove(),un("")})}async function un(i=Dt){const a=document.getElementById("admin-content");if(a)try{const o={limit:100};i&&(o.search=i),dn=(await Es.listUsers(o)).data,Zd(a,dn)}catch{ie("Failed to load users"),a.innerHTML='<div class="alert alert-error">Failed to load users data.</div>'}}function Zd(i,a=dn){if(a.length===0){i.innerHTML=`
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Users & Regional Allocations (${a.length})</div>
        </div>
        <div class="table-empty py-6 text-center text-muted">
          No users found matching "${Ge(Dt)}".
        </div>
      </div>
    `;return}const o=a.map(r=>`
    <tr>
      <td>${r.user_id}</td>
      <td class="font-medium">${Ge(r.name)}</td>
      <td class="text-muted">${Ge(r.email)}</td>
      <td><span class="badge badge-role-${r.role}">${Gd(r.role)}</span></td>
      <td>${r.assignedArea?`<span class="badge badge-primary font-semibold" style="font-size:12px;">${Ge(r.assignedArea)}</span>`:'<span class="text-muted">—</span>'}</td>
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
  `}async function Vd(){if(Rt&&Rt.length>0)return Rt;try{const i=await an.tree();i.data&&Array.isArray(i.data)&&(Rt=Ys(i.data))}catch(i){console.warn("Failed to load jurisdiction tree for admin, falling back to flat list",i);try{Rt=((await an.list({parent_id:"all"})).data||[]).map(o=>({jurisdiction_id:o.jurisdiction_id,name:o.name,type:o.type,fullPath:o.name}))}catch{Rt=[]}}return Rt||[]}function Ys(i,a=""){let o=[];for(const r of i){const l=a?`${a} › ${r.name}`:r.name;o.push({jurisdiction_id:r.jurisdiction_id,name:r.name,type:r.type,fullPath:l}),r.children&&r.children.length>0&&(o=o.concat(Ys(r.children,l)))}return o}window.editUserRole=async i=>{const a=dn.find(x=>x.user_id===i);if(!a)return;const o=await Vd(),r=o.filter(x=>x.type==="ward"),l=o.filter(x=>x.type==="city"),d=o.filter(x=>x.type!=="ward"&&x.type!=="city");let u=!1,p="";r.length>0&&(p+='<optgroup label="Wards / Local Areas (Recommended)">',r.forEach(x=>{const z=a.assignedArea===x.name;z&&(u=!0),p+=`<option value="${Ge(x.name)}" ${z?"selected":""}>${Ge(x.fullPath)}</option>`}),p+="</optgroup>"),l.length>0&&(p+='<optgroup label="Cities / Districts">',l.forEach(x=>{const z=a.assignedArea===x.name;z&&(u=!0),p+=`<option value="${Ge(x.name)}" ${z?"selected":""}>${Ge(x.fullPath)}</option>`}),p+="</optgroup>"),d.length>0&&(p+='<optgroup label="States / Regions">',d.forEach(x=>{const z=a.assignedArea===x.name;z&&(u=!0),p+=`<option value="${Ge(x.name)}" ${z?"selected":""}>${Ge(x.fullPath)}</option>`}),p+="</optgroup>"),a.assignedArea&&!u&&a.assignedArea!=="Unassigned"&&(p=`<option value="${Ge(a.assignedArea)}" selected>${Ge(a.assignedArea)} (Currently Assigned)</option>`+p),ya({title:`User Role & Area Allocation: ${a.name}`,content:`
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
    `,onClose:()=>{}});const m=document.getElementById("new-role"),f=document.getElementById("area-group"),v=document.getElementById("new-area"),y=document.getElementById("custom-area-wrapper"),b=document.getElementById("custom-area-input");m.addEventListener("change",x=>{const z=x.target.value==="coordinator_area";f.style.display=z?"block":"none"}),v.addEventListener("change",x=>{x.target.value==="__custom__"?(y.style.display="block",b.focus()):y.style.display="none"}),document.getElementById("save-role-btn").addEventListener("click",async()=>{const x=m.value;let z=v.value;if(x==="coordinator_area"&&(z==="__custom__"&&(z=b.value.trim()),!z)){ie("Please select or enter an allocated area for the coordinator");return}const _=document.getElementById("save-role-btn");_.disabled=!0,_.textContent="Saving...";try{await Es.setRole(i,x,x==="coordinator_area"?z:null),xe(`Updated role & area allocation for ${a.name}`),ni(),un()}catch(P){ie(P.message||"Failed to update role"),_.disabled=!1,_.textContent="Save Allocation"}})};function Gd(i){return i?i.split("_").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" "):"Unknown"}function Ge(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Wd(){if(!ht(Q))return;const i=qe(),a=document.getElementById("app");a.innerHTML=Le(`
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
              <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-primary);">${la(i.name)}</h2>
              <p style="font-size:0.875rem; color:var(--text-muted);">${la(i.email)}</p>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">User ID</label>
            <div class="font-mono text-muted" style="font-size:0.9rem;">#${i.user_id}</div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Assigned Role</label>
            <div><span class="badge badge-primary">${zi(i.role)}</span></div>
          </div>
          
          ${i.assignedArea?`
            <div class="form-group">
              <label class="form-label">Jurisdiction Area</label>
              <div style="font-weight:600; color:var(--text-primary);">${la(i.assignedArea)}</div>
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
  `,"Profile"),Ce();const o=document.getElementById("change-password-form");o&&o.addEventListener("submit",async r=>{r.preventDefault();const l=document.getElementById("password-alert");l.classList.add("hidden"),l.textContent="";const d=document.getElementById("current_password").value,u=document.getElementById("new_password").value,p=document.getElementById("confirm_password").value;if(u!==p){l.textContent="New password and confirmation do not match.",l.classList.remove("hidden");return}const m=document.getElementById("btn-change-pwd");m.disabled=!0,m.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Updating...';try{await vn.changePassword(d,u),xe("Password updated successfully!"),o.reset(),m.disabled=!1,m.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}catch(f){const v=f.message||"Failed to update password";l.textContent=v,l.classList.remove("hidden"),ie(v),m.disabled=!1,m.innerHTML='<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Update Password'}})}function la(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function ge(i){return i?String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}let I={step:1,basics:{name:"",description:"",icon:"📋",domain_id:1},form:{name:"",sections:[{id:"sec_1",name:"General Information",parameters:[{id:"param_1",label:"Title",field_key:"title",field_type:"text",mandatory:!0,options:[]},{id:"param_2",label:"Area",field_key:"area",field_type:"select",mandatory:!0,options:["Sector 5","Sector 12","Pune North","Pune South","Pune Central"]}]}]},workflow:{transitions:[{from:"draft",to:"submitted",role:"citizen"},{from:"submitted",to:"coordinator_approved",role:"coordinator_area"},{from:"submitted",to:"rejected",role:"coordinator_area"},{from:"coordinator_approved",to:"approved",role:"director"},{from:"coordinator_approved",to:"rejected",role:"director"}]},rule:{enabled:!1,target_entity_type_id:"",event:"approved"},report:{enabled:!0,name:"",groupBy:"area",metric:"COUNT",metricField:"",publicStats:!0},existingTypes:[],domains:[],isSubmitting:!1};async function Kd(){var i;if(Ca(["admin","director"],Q)){try{const[a,o]=await Promise.all([be.listTypes().catch(()=>({data:[]})),Ea.getMetadata().catch(()=>({data:{domains:[]}}))]);I.existingTypes=a.data||[],I.domains=((i=o.data)==null?void 0:i.domains)||[]}catch(a){console.warn("Could not load metadata for module builder:",a)}je()}}function je(){const i=document.getElementById("app");let a="";I.step===1?a=Jd():I.step===2?a=Yd():I.step===3?a=Qd():I.step===4?a=eu():I.step===5?a=tu():I.step===6?a=iu():I.step===7&&(a=nu());const o=[{num:1,label:"Basics"},{num:2,label:"Form & Fields"},{num:3,label:"Workflow"},{num:4,label:"Rules"},{num:5,label:"Reports"},{num:6,label:"Review"}],r=o.map((l,d)=>`
    <div style="display:flex; align-items:center; gap:0.4rem; color:${I.step>=l.num?"var(--primary)":"var(--gray-400)"}; font-weight:${I.step===l.num?"bold":"normal"}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${I.step>=l.num?"var(--primary)":"#e5e7eb"}; color:${I.step>=l.num?"#fff":"#4b5563"}; display:flex; align-items:center; justify-content:center; font-size:12px;">${l.num}</span>
      ${l.label}
    </div>
    ${d<o.length-1?`<div style="flex:1; height:2px; background:${I.step>l.num?"var(--primary)":"#e5e7eb"}; margin:0 4px;"></div>`:""}
  `).join("");i.innerHTML=Le(`
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
  `,"Module Builder"),Ce(),au()}function Jd(){const i=I.domains&&I.domains.length>0?I.domains.map(a=>`<option value="${a.domain_id}" ${I.basics.domain_id==a.domain_id?"selected":""}>${ge(a.domain_name)}</option>`).join(""):'<option value="1">Civic Operations</option>';return`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${ge(I.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${ge(I.basics.description)}</textarea>
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
                <option value="📋" ${I.basics.icon==="📋"?"selected":""}>📋 Form / Registration</option>
                <option value="📢" ${I.basics.icon==="📢"?"selected":""}>📢 Notice / Alert</option>
                <option value="🛡️" ${I.basics.icon==="🛡️"?"selected":""}>🛡️ Governance / Policy</option>
                <option value="💼" ${I.basics.icon==="💼"?"selected":""}>💼 Employment / Exchange</option>
                <option value="🤝" ${I.basics.icon==="🤝"?"selected":""}>🤝 Volunteer / Community</option>
                <option value="🌳" ${I.basics.icon==="🌳"?"selected":""}>🌳 Parks / Environment</option>
                <option value="🏗️" ${I.basics.icon==="🏗️"?"selected":""}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `}function Yd(){const i=I.basics.name?`${I.basics.name} Form`:"Module Registration Form",a=I.form.sections.map((o,r)=>{const l=o.parameters.map((d,u)=>{const p=d.field_type==="select";return`
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${u+1} (${ge(d.field_key||"field")})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${r}, ${u})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${ge(d.label)}" onchange="window.updateParam(${r}, ${u}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
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
              <input type="text" class="form-control" value="${ge((d.options||[]).join(", "))}" onchange="window.updateParamOptions(${r}, ${u}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          `:""}
        </div>
      `}).join("");return`
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${ge(o.name)}" onchange="window.updateSectionName(${r}, this.value)">
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
            <div class="card-subtitle">Define parameters and form sections for "${ge(I.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${ge(i)}" onchange="state.form.name = this.value">
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
            ${Xd()}
          </div>
        </div>
      </div>
    </div>
  `}function Xd(){const i=I.basics.name?`${I.basics.name} Form`:"Untitled Form";let a=`<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${ge(i)}</div>`;return I.form.sections.forEach(o=>{a+=`
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${ge(o.name)}</div>
    `,o.parameters.forEach(r=>{const l=r.mandatory?'<span style="color:red">*</span>':"";if(a+=`<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${ge(r.label||"Unlabelled")} ${l}</label>`,r.field_type==="textarea")a+='<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>';else if(r.field_type==="number")a+='<input type="number" class="form-control" disabled placeholder="0">';else if(r.field_type==="date")a+='<input type="date" class="form-control" disabled>';else if(r.field_type==="select"){const d=r.options&&r.options.length?r.options:["Option 1","Option 2"];a+=`<select class="form-control" disabled>
          ${d.map(u=>`<option>${ge(u)}</option>`).join("")}
        </select>`}else a+='<input type="text" class="form-control" disabled placeholder="Text response...">';a+="</div>"}),a+="</div>"}),a}function Qd(){const i=[{value:"citizen",label:"Citizen (Owner)"},{value:"coordinator_area",label:"Area Coordinator"},{value:"coordinator_general",label:"General Coordinator"},{value:"director",label:"Director"},{value:"admin",label:"Administrator"}],a=I.workflow.transitions.map((o,r)=>`
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${r+1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${r})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${ge(o.from)}" onchange="window.updateTransition(${r}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${ge(o.to)}" onchange="window.updateTransition(${r}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
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
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${ge(I.basics.name)}".</div>
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
  `}function eu(){return I.existingTypes.map(i=>`<option value="${i.entity_type_id}" ${I.rule.target_entity_type_id==i.entity_type_id?"selected":""}>${ge(i.name)}</option>`).join(""),`
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
  `}function tu(){const i=[];I.form.sections.forEach(l=>l.parameters.forEach(d=>i.push(d)));const a=I.basics.name?`${I.basics.name}s by Area`:"Module Report",o=i.filter(l=>l.field_type==="number"),r=['<option value="area">area (Native Area)</option>','<option value="status">status (Workflow Status)</option>',...i.map(l=>`<option value="${ge(l.field_key||l.label)}" ${I.report.groupBy===(l.field_key||l.label)?"selected":""}>${ge(l.label)} (${l.field_type})</option>`)].join("");return o.map(l=>`
    <option value="${ge(l.field_key||l.label)}" ${I.report.metricField===(l.field_key||l.label)?"selected":""}>${ge(l.label)}</option>
  `).join(""),`
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${ge(I.basics.name)}" via ReportMaster.</div>
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
              <input type="text" class="form-control" value="${ge(a)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
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
  `}function iu(){const i=`${I.basics.name} Form`,a=I.form.sections.reduce((r,l)=>r+l.parameters.length,0),o=`${I.basics.name}s by Area`;return`
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${I.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${ge(I.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${ge(I.basics.description||"Civic Operating System Module")}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${ge(i)}</strong></div>
              <div>Sections: <strong>${I.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${a}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${I.workflow.transitions.length} transitions)
              </div>
              ${I.workflow.transitions.map(r=>`<div style="font-size:12px;">• <code>${ge(r.from)}</code> → <code>${ge(r.to)}</code> (${ge(r.role)})</div>`).join("")}
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
              <div>${`${ge(o)} (${I.report.metric} by ${I.report.groupBy})`}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${I.isSubmitting?"disabled":""}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `}function nu(){return`
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${ge(I.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `}function au(){const i=document.getElementById("step1-form");i&&i.addEventListener("submit",a=>{a.preventDefault();const o=document.getElementById("module-name").value.trim(),r=document.getElementById("module-desc").value.trim(),l=document.getElementById("module-icon").value;if(!o){ie("Module name is required");return}if(I.existingTypes.some(u=>u.name.toLowerCase()===o.toLowerCase())){ie(`Module "${o}" already exists. Please choose a different name.`);return}I.basics.name=o,I.basics.description=r,I.basics.icon=l,I.step=2,je()})}window.addSection=()=>{const i=I.form.sections.length+1;I.form.sections.push({id:`sec_${Date.now()}`,name:`Section ${i}`,parameters:[{id:`param_${Date.now()}`,label:"New Field",field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}]}),je()};window.removeSection=i=>{if(I.form.sections.length<=1){ie("Form must have at least one section");return}I.form.sections.splice(i,1),je()};window.updateSectionName=(i,a)=>{I.form.sections[i].name=a,je()};window.addParam=i=>{const a=I.form.sections[i].parameters.length+1;I.form.sections[i].parameters.push({id:`param_${Date.now()}`,label:`Field ${a}`,field_key:`field_${Date.now()}`,field_type:"text",mandatory:!1,options:[]}),je()};window.removeParam=(i,a)=>{I.form.sections[i].parameters.splice(a,1),je()};window.updateParam=(i,a,o,r)=>{const l=I.form.sections[i].parameters[a];l[o]=r,o==="label"&&(l.field_key=r.toLowerCase().replace(/[^a-z0-9]/g,"_")),je()};window.updateParamOptions=(i,a,o)=>{const r=o.split(",").map(l=>l.trim()).filter(Boolean);I.form.sections[i].parameters[a].options=r,je()};window.validateAndGoStep3=()=>{for(const i of I.form.sections){if(!i.name.trim()){ie("All sections must have a title");return}for(const a of i.parameters)if(!a.label.trim()){ie("All fields must have a label");return}}I.step=3,je()};window.addTransition=()=>{I.workflow.transitions.push({from:"draft",to:"submitted",role:"citizen"}),je()};window.removeTransition=i=>{if(I.workflow.transitions.length<=1){ie("Workflow must have at least one transition");return}I.workflow.transitions.splice(i,1),je()};window.updateTransition=(i,a,o)=>{I.workflow.transitions[i][a]=o,je()};window.validateAndGoStep4=()=>{for(let i=0;i<I.workflow.transitions.length;i++){const a=I.workflow.transitions[i];if(!a.from.trim()||!a.to.trim()){ie(`Transition #${i+1} must have both from and to states.`);return}}I.step=4,je()};window.submitModuleCreation=async()=>{const i=document.getElementById("create-module-btn");i&&(i.disabled=!0,i.textContent="Deploying Metadata Atomically..."),I.isSubmitting=!0;try{const a=I.form.name||`${I.basics.name} Form`,o=I.report.name||`${I.basics.name}s by Area`,r={module:{name:I.basics.name,description:I.basics.description,domain_id:I.basics.domain_id||1},form:{name:a,sections:I.form.sections.map(d=>({name:d.name,parameters:d.parameters.map(u=>({field_key:u.field_key,label:u.label,field_type:u.field_type,mandatory:!!u.mandatory,options:u.options}))}))},workflow:{transitions:I.workflow.transitions.map(d=>({from_status:d.from,to_status:d.to,role:d.role}))},rules:I.rule.enabled&&I.rule.target_entity_type_id?[{target_entity_type_id:Number(I.rule.target_entity_type_id),event:I.rule.event||"approved",auto_create:!0,auto_approve:!1}]:[],reports:I.report.enabled?[{report_name:o,output_format:"grouped_count",filters:{groupBy:I.report.groupBy||"area",metric:I.report.metric||"COUNT",metricField:I.report.metricField||void 0,public_stats:I.report.publicStats}}]:[]},l=await Vl.deploy(r);xe(l.message||`Module "${I.basics.name}" deployed successfully!`),I.isSubmitting=!1,I.step=7,je()}catch(a){ie(a.message||"Failed to deploy module"),I.isSubmitting=!1,i&&(i.disabled=!1,i.innerHTML='<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata')}};function We(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let tn=[],ds=[];async function ou(){if(!ht(Q))return;const i=document.getElementById("app");i.innerHTML=Le(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Reports"),Ce();try{const[a,o]=await Promise.all([yn.list().catch(()=>({data:[]})),be.listTypes().catch(()=>({data:[]}))]);tn=a.data||[],ds=o.data||[],i.innerHTML=Le(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `,"Civic Reports",ds),Ce(),su(document.getElementById("reports-container"))}catch{ie("Failed to load reports catalog"),document.getElementById("reports-container").innerHTML=`
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `}}function su(i){if(!tn||tn.length===0){i.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;return}const a=tn.map(l=>{const d=pt(l.entityType);return`
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${We(d.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${We(l.metric_type||"COUNT")}</span>
          </div>
          <div class="report-card-title">${We(l.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${We(d.shortTitle)}</strong> records grouped by <strong>${We(l.group_by_field||"area / status")}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${We(l.group_by_field||"area")}</span>
            <span>•</span>
            <span>Metric: ${We(l.metric_type||"COUNT")}</span>
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
  `,i.querySelectorAll(".execute-report-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.getAttribute("data-repid");ru(d)})});const r=document.getElementById("btn-close-result");r&&r.addEventListener("click",()=>{document.getElementById("report-execution-panel").style.display="none"})}async function ru(i){const a=document.getElementById("report-execution-panel"),o=document.getElementById("execution-title"),r=document.getElementById("execution-body");if(!(!a||!r)){a.style.display="block",a.scrollIntoView({behavior:"smooth"}),r.innerHTML='<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';try{const d=(await yn.execute(i)).data;o.textContent=`Report Results: ${d.reportName||"Execution"}`;const u=d.rows||[];if(u.length===0){r.innerHTML='<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>';return}const p=u.map(m=>{var f;return`
      <tr>
        <td style="font-weight:600;">${We(m[d.groupBy]||m.area||m.status||"Total")}</td>
        <td style="font-weight:700; color:var(--primary);">${m[(f=d.metric)==null?void 0:f.toLowerCase()]||m.count||m.total_count||0}</td>
      </tr>
    `}).join("");r.innerHTML=`
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${We(d.metric)}</strong> | Grouped By: <strong>${We(d.groupBy)}</strong> | Total Groups: <strong>${u.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${We(d.groupBy||"Group")}</th>
              <th>Aggregation Metric (${We(d.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${p}
          </tbody>
        </table>
      </div>
    `}catch(l){ie(l.message||"Report execution failed"),r.innerHTML=`<div class="alert alert-error">Execution Error: ${We(l.message)}</div>`}}}function Qi(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function lu(){if(!ht(Q))return;const i=document.getElementById("app");i.innerHTML=Le(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `,"Civic Capabilities"),Ce();try{const o=(await be.listTypes().catch(()=>({data:[]}))).data||[];i.innerHTML=Le(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `,"Civic Capabilities",o),Ce(),cu(document.getElementById("modules-container"),o)}catch{ie("Failed to load civic capabilities"),document.getElementById("modules-container").innerHTML=`
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `}}function cu(i,a){if(!a||a.length===0){i.innerHTML=`
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;return}const o=a.map(r=>{var u;const l=pt(r),d=((u=r._count)==null?void 0:u.entities)||0;return`
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${Ct(l.iconKey,24)}
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
  `}function Pe(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let xa=null,Si=!1,pn=[];async function du(){if(!Ca(["director","admin"],Q))return;const i=document.getElementById("app");i.innerHTML=Le(`
    <div style="padding: 24px 0;">
      <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="spinner spinner-lg"></div>
        <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 500;">
          Initializing Governance Intelligence Engine...
        </div>
      </div>
    </div>
  `,"/governance"),Ce();try{pn=(await be.listTypes().catch(()=>({data:[]}))).data||[],await Xs()}catch(a){ie(a.message||"Failed to load governance intelligence"),uu(a.message)}}async function Xs(){Si=!0,us();try{const i=await Gl.analyze();if(i&&i.success)xa=i.data,xe("Governance telemetry updated");else throw new Error((i==null?void 0:i.error)||"Analysis returned invalid response")}catch(i){ie(i.message||"Governance analysis failed")}finally{Si=!1,us()}}function us(){const i=document.getElementById("app");if(!i)return;if(!xa&&Si){i.innerHTML=Le(`
      <div style="padding: 32px 0;">
        <div class="loading-overlay" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="spinner spinner-lg"></div>
          <div style="margin-top: 16px; color: var(--text-secondary); font-weight: 600;">
            Running Deterministic Rules & Telemetry Pipeline...
          </div>
        </div>
      </div>
    `,"/governance",pn),Ce();return}const a=xa||{},o=a.summary_metrics||{},r=a.process_health||{pipeline:[]},l=a.exceptions||[],d=a.stakeholder_intelligence||[],u=a.ai_summary||null,p=a.analysis_mode==="AI_ASSISTED",m=`
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
            Target Module: <strong style="color: var(--text-primary);">${Pe(a.entity_type_name||"Donation Transaction")}</strong> • 
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
          ${(r.pipeline||[]).map((v,y)=>{const b=v.exception_count>0;return`
              <div style="background: var(--gray-50); border: 1px solid ${b?"#fca5a5":"var(--gray-200)"}; border-radius: 8px; padding: 14px; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    STAGE ${y+1}
                  </span>
                  ${b?`
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
                  ${Pe(v.label||v.stage)}
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
              AI: ${Pe(u.analysis_mode||"AI")}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 18px;">
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Pipeline Velocity Assessment
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${Pe(u.process_health_narrative||"Pipeline telemetry shows operational stages operating within standard thresholds.")}
              </p>
            </div>
            <div>
              <h3 style="font-size: 13px; font-weight: 700; color: #581c87; text-transform: uppercase; margin-bottom: 6px;">
                Control Gap Concentration
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #374151; margin: 0;">
                ${Pe(u.risk_narrative||"Exceptions detected require periodic verification per standard governance protocols.")}
              </p>
            </div>
          </div>

          ${Array.isArray(u.recommendations)&&u.recommendations.length>0?`
            <div style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 14px 18px;">
              <h3 style="font-size: 12px; font-weight: 700; color: #6b21a8; text-transform: uppercase; margin-bottom: 8px;">
                Recommended Corrective Governance Actions
              </h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #4b5563;">
                ${u.recommendations.map(v=>`<li>${Pe(v)}</li>`).join("")}
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
                      ${Pe(v.trigger_rule)}
                    </span>
                    <strong style="font-size: 14px; color: var(--text-primary);">
                      ${Pe(v.observation)}
                    </strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 10px; font-weight: 700; background: var(--gray-100); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                      MODE: ${Pe(v.analysis_mode||"DETERMINISTIC")}
                    </span>
                    ${v.requires_human_review?`
                      <span style="font-size: 10px; font-weight: 700; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">
                        HUMAN REVIEW REQUIRED
                      </span>
                    `:""}
                  </div>
                </div>

                <div style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; font-family: monospace; font-size: 12px; color: #1e293b;">
                  <strong>Evidence:</strong> ${Pe(v.evidence)}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; font-size: 12.5px;">
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Possible Process Weakness:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${Pe(v.possible_cause)}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary); font-weight: 600;">Governance Recommendation:</span>
                    <div style="color: var(--text-primary); margin-top: 2px;">${Pe(v.recommendation)}</div>
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
                    ${Pe(v.stakeholder)}
                  </strong>
                  <span style="font-size: 10px; font-weight: 700; background: var(--gray-200); color: var(--gray-700); padding: 2px 6px; border-radius: 4px;">
                    ${Pe(v.analysis_mode||"DETERMINISTIC")}
                  </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Core Responsibility</div>
                  <div style="font-size: 13px; color: var(--text-primary); margin-top: 2px;">${Pe(v.interest)}</div>
                </div>

                <div style="margin-bottom: 10px;">
                  <div style="font-size: 11px; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Governance Concern</div>
                  <div style="font-size: 13px; color: #7f1d1d; margin-top: 2px;">${Pe(v.concern)}</div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Relevant Process Stage</div>
                  <div style="font-size: 12.5px; color: var(--text-primary); margin-top: 2px; font-family: monospace;">${Pe(v.relevant_process)}</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid var(--gray-200); border-radius: 6px; padding: 10px; font-size: 12px; color: #334155;">
                <strong style="color: var(--text-secondary); display: block; margin-bottom: 2px; font-size: 11px; text-transform: uppercase;">Live Telemetry Evidence:</strong>
                ${Pe(v.evidence)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;i.innerHTML=Le(m,"/governance",pn),Ce();const f=document.getElementById("btn-reanalyze");f&&f.addEventListener("click",()=>{Xs()})}function uu(i){const a=document.getElementById("app");a&&(a.innerHTML=Le(`
    <div style="padding: 40px 0; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
      <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px;">Governance Intelligence Error</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">
        ${Pe(i||"Unable to execute governance analysis.")}
      </p>
      <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
    </div>
  `,"/governance",pn),Ce())}let Li=null,nn=!1,_a=null,ct=null;function De(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Qs(i){return De(i).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}function er(i){return!i||isNaN(i)?"":i<1024?i+" B":i<1024*1024?(i/1024).toFixed(1)+" KB":(i/(1024*1024)).toFixed(1)+" MB"}function pu(i,a=null){let o="";a&&(a.isImage&&a.previewUrl?o=`
        <div class="agent-user-attachment">
          <img src="${De(a.previewUrl)}" alt="${De(a.name)}" class="agent-attachment-thumb" />
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">📷 ${De(a.name)}</span>
            <span class="agent-attachment-size">${De(a.sizeStr)}</span>
          </div>
        </div>
      `:o=`
        <div class="agent-user-attachment agent-attachment-doc">
          <span class="agent-attachment-icon">📄</span>
          <div class="agent-attachment-meta">
            <span class="agent-attachment-name">${De(a.name)}</span>
            <span class="agent-attachment-size">${De(a.sizeStr)}</span>
          </div>
        </div>
      `);const r=i?`<div class="agent-bubble-text">${De(i)}</div>`:"";return`
    <div class="agent-msg-row agent-msg-user">
      <div class="agent-bubble agent-bubble-user">
        ${o}
        ${r}
      </div>
    </div>
  `}function wa(i){return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <div class="agent-bubble agent-bubble-agent">${Qs(i)}</div>
    </div>
  `}function hu(i,a){const o=Array.isArray(i)?i.map(l=>`
        <div class="agent-confirm-row ${l.isFile?"agent-confirm-file-row":""}">
          <span class="agent-confirm-label">${De(l.label)}</span>
          <span class="agent-confirm-value">${De(l.value)}</span>
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
        ${a?`<p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:12px;">${Qs(a.split(`

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
  `}function mu(i,a,o,r=[]){const l=Array.isArray(r)&&r.length>0?`<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; gap:4px;">
         <span>📎</span> <span>Attached evidence: <strong>${r.map(De).join(", ")}</strong></span>
       </div>`:"";return`
    <div class="agent-msg-row agent-msg-agent">
      <div class="agent-bubble-avatar" style="background:var(--green-600);" aria-hidden="true">
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="agent-success-card">
        <div style="font-weight:700; font-size:1rem; color:var(--green-700); margin-bottom:6px;">
          ✅ ${De(o)} Submitted!
        </div>
        <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:8px;">
          <strong>#${i}</strong> — ${De(a)}
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
  `}function fu(){return`
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
  `}function gu(){return document.getElementById("agent-thread")}function ka(){return document.getElementById("agent-input")}function vu(){return document.getElementById("agent-send-btn")}function yu(){return document.getElementById("agent-attach-btn")}function tr(){return document.getElementById("agent-file-input")}function ei(i){const a=gu();if(!a)return;const o=document.createElement("div");for(o.innerHTML=i;o.firstChild;)a.appendChild(o.firstChild);a.scrollTop=a.scrollHeight}function ps(){const i=document.getElementById("agent-thinking");i&&i.remove()}function ca(i){const a=ka(),o=vu(),r=yu();a&&(a.disabled=!i),o&&(o.disabled=!i,o.style.opacity=i?"1":"0.5"),r&&(r.disabled=!i,r.style.opacity=i?"1":"0.5")}function Ba(){var r;const i=document.getElementById("agent-file-preview-bar");if(!i)return;if(!ct){i.innerHTML="",i.style.display="none";return}const a=ct.type.startsWith("image/"),o=a?URL.createObjectURL(ct):null;i.style.display="flex",i.innerHTML=`
    <div class="agent-preview-chip">
      ${a?`<img src="${o}" class="agent-preview-thumb" alt="Preview" />`:'<span class="agent-preview-icon">📄</span>'}
      <div class="agent-preview-info">
        <span class="agent-preview-filename">${De(ct.name)}</span>
        <span class="agent-preview-filesize">${er(ct.size)}</span>
      </div>
      <button type="button" id="agent-remove-file-btn" class="agent-preview-remove" title="Remove attachment" aria-label="Remove attachment">&times;</button>
    </div>
  `,(r=document.getElementById("agent-remove-file-btn"))==null||r.addEventListener("click",()=>{ct=null;const l=tr();l&&(l.value=""),Ba()})}async function Ti(i,a=null){const o=a||ct,r=(i||"").trim();if(nn||!r&&!o)return;nn=!0;let l=null;if(o){const p=o.type.startsWith("image/");l={name:o.name,sizeStr:er(o.size),isImage:p,previewUrl:p?URL.createObjectURL(o):null}}const d=ka();d&&(d.value="",d.style.height="auto"),ct=null;const u=tr();u&&(u.value=""),Ba(),ei(pu(r||(o?`Uploaded: ${o.name}`:""),l)),ca(!1),ei(fu());try{const p=$i(),m=Bs(p),f=await on.chat(Li,m+r,o);ps();const v=f.data;_a=null,v.type==="confirm"?(_a=v,ei(hu(v.summary||[],v.text)),setTimeout(()=>{const y=document.getElementById("agent-submit-btn"),b=document.getElementById("agent-cancel-btn");y&&y.addEventListener("click",()=>{var x;(x=document.getElementById("agent-confirm-btns"))==null||x.remove(),Ti("yes")}),b&&b.addEventListener("click",()=>{var x;(x=document.getElementById("agent-confirm-btns"))==null||x.remove(),Ti("cancel")})},50)):v.type==="submitted"?(ei(mu(v.entity_id,v.entity_name,v.capability,v.files)),ca(!1),setTimeout(()=>{const y=document.getElementById("agent-new-request-btn");y&&y.addEventListener("click",()=>{Q("/agent/chat")})},50)):ei(wa(v.text||"Something went wrong. Please try again."))}catch(p){ps(),ei(wa("Sorry, I encountered an error processing your request. Please try again or use the manual form.")),console.error("[Agent Chat] Error:",p)}finally{if(nn=!1,document.getElementById("agent-input")){ca(!0);const p=ka();p&&!p.disabled&&p.focus()}}}async function bu(i={},a=null){if(!ht(Q))return;Li=null,nn=!1,_a=null,ct=null;const o=a||new URLSearchParams(window.location.search),r=o.get("sessionId"),l=o.get("message");Li=r||"ck-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);const d=document.getElementById("app");d.innerHTML=Le(`
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
        <div style="margin-left:auto; display:flex; align-items:center; gap:8px;">
          <div id="agent-loc-status" style="display:none; font-size:0.72rem; color:var(--text-muted); align-items:center; gap:4px;">
            <svg width="11" height="11" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span id="agent-loc-text"></span>
          </div>
          <button type="button" id="agent-loc-btn" class="btn btn-ghost btn-sm" title="Share your location for better help" style="font-size:0.72rem; padding:4px 10px; display:none;">
            📍 Share location
          </button>
          <a href="/dashboard" class="btn btn-ghost btn-sm">← Dashboard</a>
        </div>
      </div>

      <div id="agent-thread" role="log" aria-live="polite" aria-label="Conversation with Civic Assistant">
        <!-- Initial greeting -->
        ${wa(`Hello! I'm your CIVIC-KALKI assistant. I can help you:

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
  `,"Civic Assistant"),Ce();const u=document.getElementById("agent-loc-btn"),p=document.getElementById("agent-loc-status"),m=document.getElementById("agent-loc-text");function f(_){p&&(p.style.display="flex"),m&&(m.textContent=_.area),u&&(u.style.display="none")}const v=$i();v?f(v):Ps()||u&&(u.style.display=""),u==null||u.addEventListener("click",async()=>{u&&(u.textContent="⏳ Detecting…",u.disabled=!0);try{const _=await As();f(_)}catch{u&&(u.textContent="📍 Share location",u.disabled=!1)}});const y=document.getElementById("agent-input"),b=document.getElementById("agent-send-btn"),x=document.getElementById("agent-attach-btn"),z=document.getElementById("agent-file-input");!y||!b||(x==null||x.addEventListener("click",()=>{z==null||z.click()}),z==null||z.addEventListener("change",_=>{var T;const P=(T=_.target.files)==null?void 0:T[0];P&&(ct=P,Ba(),y.focus())}),y.addEventListener("input",()=>{y.style.height="auto",y.style.height=Math.min(y.scrollHeight,120)+"px"}),y.addEventListener("keydown",_=>{_.key==="Enter"&&!_.shiftKey&&(_.preventDefault(),Ti(y.value))}),b.addEventListener("click",()=>{Ti(y.value)}),l&&l.trim()?setTimeout(()=>Ti(decodeURIComponent(l)),120):y.focus(),window.addEventListener("beforeunload",()=>{Li&&on.clearSession(Li)},{once:!0}))}function Lt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const hs={relatable:{primary:"#FF6B35",secondary:"#1A1A2E",accent:"#FFD700",text:"#FFFFFF"},awareness:{primary:"#2E86AB",secondary:"#1A1A2E",accent:"#A8DADC",text:"#FFFFFF"},cta:{primary:"#43AA8B",secondary:"#1A1A2E",accent:"#F8961E",text:"#FFFFFF"}};function xu(i){const{template_type:a="awareness",headline:o,caption:r,locality:l,category:d,photoUrl:u,exportMode:p=!1}=i,m=hs[a]||hs.awareness,f=u?`background-image:url('${u}'); background-size:cover; background-position:center;`:`background:linear-gradient(135deg, ${m.secondary} 0%, #2d2d44 100%);`,v={relatable:"?? Relatable",awareness:"?? Awareness",cta:"CTA"}[a]||"?? Awareness",y={relatable:`
      <div style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:22px;font-weight:800;color:${m.accent};letter-spacing:-0.5px;line-height:1.2;margin-bottom:10px;">${Lt(o)}</div>
        <div style="font-size:15px;color:#fff;line-height:1.5;">${Lt(r)}</div>
      </div>
    `,awareness:`
      <div style="background:rgba(46,134,171,0.85);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;border-left:4px solid ${m.accent};">
        <div style="font-size:12px;color:${m.accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">CIVIC ISSUE � ${Lt(d||"Infrastructure")}</div>
        <div style="font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:8px;">${Lt(o)}</div>
        <div style="font-size:14px;color:#ddd;line-height:1.5;">${Lt(r)}</div>
      </div>
    `,cta:`
      <div style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);padding:16px 20px;border-radius:12px;margin:0 0 8px 0;">
        <div style="font-size:20px;font-weight:800;color:${m.accent};line-height:1.2;margin-bottom:8px;">${Lt(o)}</div>
        <div style="font-size:14px;color:#fff;line-height:1.5;margin-bottom:12px;">${Lt(r)}</div>
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
        ?? ${Lt(l)}
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
  `}function Oe(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let S={step:1,issueId:null,issue:null,config:null,myIssues:[],category:"",locality:"",photoFile:null,photoPreviewUrl:null,eligibility:null,templateType:null,aiOptions:[],selectedOption:null,editedHeadline:"",editedCaption:"",captionSource:"manual",originalAiSuggestion:null,safetyResult:null,attestationAccepted:!1,submitting:!1};async function ir({issueId:i}){if(!ht(Q))return;const a=document.getElementById("app");a.innerHTML=Le(`
    <div class="page-header mb-4">
      <div class="topbar-breadcrumb mb-2">
        ${i?`<a href="/entities/${i}" class="text-link">Back to Issue</a>`:'<a href="/buzz" class="text-link">Back to Civic Buzz</a>'}
      </div>
      <h1>Civic Buzz Studio</h1>
      <p class="text-secondary" style="margin-top:4px;">Create civic awareness content. Every post requires moderator approval before publication.</p>
    </div>
    <div id="meme-studio-body"></div>
  `,"Civic Buzz Studio"),Ce(),S.photoPreviewUrl&&URL.revokeObjectURL(S.photoPreviewUrl),S={...S,step:1,issueId:i?Number(i):null,issue:null,eligibility:null,config:null,myIssues:[],category:"",locality:"",photoFile:null,photoPreviewUrl:null},await _u(i)}async function _u(i){const a=document.getElementById("meme-studio-body");a.innerHTML='<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';try{const[o,r]=await Promise.all([N("GET","/meme/config"),N("GET","/meme/my-issues")]);if(S.config=o.data,S.myIssues=r.data||[],i){if(S.issue=S.myIssues.find(l=>Number(l.issue_id)===Number(i))||null,!S.issue){wu(a,"Only your own approved issues can be linked.");return}S.category=S.issue.category,S.locality=S.issue.locality}ku(a)}catch(o){a.innerHTML=`<div class="alert alert-error">${Oe(o.message||"Failed to load issue.")}</div>`}}function wu(i,a){i.innerHTML=`
    <div class="alert alert-warning" style="max-width:600px;">
      <strong>? Cannot Create Meme Campaign</strong>
      <p style="margin-top:8px;">${Oe(a)}</p>
      <p style="margin-top:8px;color:var(--text-secondary);font-size:0.875rem;">
        If this is a serious matter (crime, harassment, communal issues), please
        <a href="/entities/new" class="text-link">file a Grievance</a> instead.
      </p>
    </div>
  `}function ku(i){var u;const a=S.config.categories||[],o=S.config.localities||[],r=((u=S.issue)==null?void 0:u.issue_id)||"";i.innerHTML=`
    <div class="ck-studio-wizard" style="max-width:720px;">
      <h2 class="mb-2">Start a Civic Buzz post</h2>
      <p class="text-secondary mb-4">Add an issue photo, choose its category and locality, then send it for moderator review.</p>
      <label class="form-label" for="buzz-photo">Photo</label>
      <input id="buzz-photo" class="form-input mb-3" type="file" accept="image/*" capture="environment" />
      <div id="buzz-photo-preview" class="mb-4"></div>
      <label class="form-label" for="buzz-category">Category</label>
      <select id="buzz-category" class="form-input mb-3" ${r?"disabled":""}>
        <option value="">Choose a category</option>
        ${a.map(p=>`<option value="${Oe(p)}" ${p===S.category?"selected":""}>${Oe(p)}</option>`).join("")}
      </select>
      <label class="form-label" for="buzz-locality">Locality</label>
      <select id="buzz-locality" class="form-input mb-3" ${r?"disabled":""}>
        <option value="">Unassigned</option>
        ${o.map(p=>`<option value="${Oe(p)}" ${p===S.locality?"selected":""}>${Oe(p)}</option>`).join("")}
      </select>
      <label class="form-label" for="buzz-linked-issue">Link one of my approved issues (optional)</label>
      <select id="buzz-linked-issue" class="form-input mb-3">
        <option value="">Standalone post</option>
        ${S.myIssues.map(p=>`<option value="${p.issue_id}" ${Number(p.issue_id)===Number(r)?"selected":""}>${Oe(p.name)} (${Oe(p.category)})</option>`).join("")}
      </select>
      <div id="buzz-category-feedback" aria-live="polite" class="mb-3"></div>
      <button id="buzz-details-next" class="btn btn-primary" type="button" disabled onclick="window._memeStartBuzz()">Continue</button>
    </div>
  `;const l=document.getElementById("buzz-photo");l.addEventListener("change",()=>{var m;const p=((m=l.files)==null?void 0:m[0])||null;S.photoFile=p,S.photoPreviewUrl&&URL.revokeObjectURL(S.photoPreviewUrl),S.photoPreviewUrl=p?URL.createObjectURL(p):null,document.getElementById("buzz-photo-preview").innerHTML=S.photoPreviewUrl?`<img src="${S.photoPreviewUrl}" alt="Selected photo preview" style="max-width:100%;max-height:320px;border-radius:12px;" />`:"",d()}),document.getElementById("buzz-category").addEventListener("change",p=>{S.category=p.target.value,d()}),document.getElementById("buzz-locality").addEventListener("change",p=>{S.locality=p.target.value||"Unassigned"}),document.getElementById("buzz-linked-issue").addEventListener("change",p=>{const m=S.myIssues.find(f=>String(f.issue_id)===p.target.value)||null;S.issue=m,S.issueId=(m==null?void 0:m.issue_id)||null,m&&(S.category=m.category,S.locality=m.locality||"Unassigned",document.getElementById("buzz-category").value=S.category,document.getElementById("buzz-locality").value=S.locality==="Unassigned"?"":S.locality),document.getElementById("buzz-category").disabled=!!m,document.getElementById("buzz-locality").disabled=!!m,d()});function d(){const p=S.category.toLowerCase(),m=S.config.no_meme_categories.some(y=>p.includes(y.toLowerCase())),f=S.config.humor_allowed_categories.includes(p),v=m?'<div class="alert alert-error">This category cannot be used for Civic Buzz. Please use the <a href="/entities/new" class="text-link">Grievance form</a>.</div>':S.config.safety_sensitive_categories.some(y=>p.includes(y.toLowerCase()))?'<div class="alert alert-warning">Only neutral Awareness and CTA templates are available for this safety-sensitive category.</div>':!f&&p?'<div class="alert alert-info">Only Awareness and CTA templates are available for this category.</div>':"";document.getElementById("buzz-category-feedback").innerHTML=v,document.getElementById("buzz-details-next").disabled=!S.photoFile||!p||m}window._memeStartBuzz=()=>{const p=S.category.toLowerCase(),m=S.config.no_meme_categories.some(y=>p.includes(y.toLowerCase()));if(!S.photoFile||!p||m)return;const f=S.config.safety_sensitive_categories.some(y=>p.includes(y.toLowerCase())),v=S.config.humor_allowed_categories.includes(p);S.eligibility={eligible:!0,templateTypes:f?["awareness","cta"]:v?["relatable","awareness","cta"]:["awareness","cta"]},nr(i)}}function nr(i){S.step=1;const a=S.eligibility.templateTypes||[],o={relatable:{icon:"??",name:"Relatable",desc:`Light situational humor that makes people nod. "We've all been there." Perfect for everyday civic frustrations.`},awareness:{icon:"??",name:"Awareness",desc:"Factual, informative content that raises visibility for an issue. Facts from the actual report only."},cta:{icon:"??",name:"Call to Action",desc:"Energizing content that encourages citizens to report, support, or take action together."}};i.innerHTML=`
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
  `,window._memePickTemplate=r=>{S.templateType=r,ar(i)}}async function ar(i){S.step=2,i.innerHTML=`
    <div class="ck-studio-wizard">
      ${ri(3)}
      <h2 class="mb-2">Caption Your Meme</h2>
      <div class="loading-overlay" style="position:static;height:80px;"><div class="spinner"></div></div>
      <p class="text-secondary">Generating AI caption suggestions...</p>
    </div>
  `;let a={options:[],ai_unavailable:!1};try{a=(await N("POST","/meme/captions",{issue_id:S.issueId||null,category:S.category,locality:S.locality,template:S.templateType})).data}catch(m){a={options:[],ai_unavailable:!0,reason:m.message||"AI unavailable."}}S.aiOptions=a.options||[];const o=a.ai_unavailable?`<div class="alert alert-warning mb-3" style="max-width:640px;">
        <strong>?? AI Unavailable</strong>
        <p style="margin-top:4px;font-size:0.875rem;">${Oe(a.reason||"AI caption service is temporarily unavailable. Please write your own caption below.")}</p>
        <p style="font-size:0.75rem;color:var(--text-secondary);">Note: Automated safety check flagged as "unavailable" � moderator will review manually.</p>
      </div>`:"",r=S.aiOptions.length>0?`
      <div class="mb-3" style="max-width:640px;">
        <label class="form-label mb-2"><strong>AI Suggestions (select one to pre-fill):</strong></label>
        ${S.aiOptions.map((m,f)=>`
          <button class="ck-caption-option" onclick="window._memeSelectOption(${f})" id="capopt-${f}" style="display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;border-radius:8px;border:2px solid var(--border-color);background:var(--bg-secondary);cursor:pointer;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${Oe(m.headline)}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">${Oe(m.caption)}</div>
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
          value="${Oe(S.editedHeadline)}"
          oninput="window._memeSafetyCheck()"
        />
        <div id="headline-chars" style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">0 / 60</div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="meme-caption">Caption <span style="color:var(--text-muted);font-size:0.8rem;">(max 140 chars)</span></label>
        <textarea id="meme-caption" class="form-input" rows="3" maxlength="140"
          placeholder="e.g. Me checking the same pothole every day like it's a long-term relationship."
          oninput="window._memeSafetyCheck()"
        >${Oe(S.editedCaption)}</textarea>
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
  `,p(),window._memeSelectOption=m=>{const f=S.aiOptions[m];f&&(S.selectedOption=f,S.editedHeadline=f.headline,S.editedCaption=f.caption,S.captionSource="ai",S.originalAiSuggestion=f,document.getElementById("meme-headline").value=f.headline,document.getElementById("meme-caption").value=f.caption,S.aiOptions.forEach((v,y)=>{const b=document.getElementById(`capopt-${y}`);b&&(b.style.borderColor=y===m?"var(--accent-primary)":"var(--border-color)")}),window._memeSafetyCheck())};let l;window._memeSafetyCheck=()=>{p(),clearTimeout(l),l=setTimeout(d,500)};async function d(){var v,y,b,x,z,_,P,T;const m=((v=document.getElementById("meme-headline"))==null?void 0:v.value)||"",f=((y=document.getElementById("meme-caption"))==null?void 0:y.value)||"";if(!m&&!f){u("",!1);return}S.captionSource==="ai"?(m!==(((b=S.selectedOption)==null?void 0:b.headline)||"")||f!==(((x=S.selectedOption)==null?void 0:x.caption)||""))&&(S.captionSource="ai_edited"):S.captionSource="manual",S.editedHeadline=m,S.editedCaption=f,u('<span style="color:var(--text-muted);">Checking...</span>',!1);try{const E=await N("POST","/meme/safety-check",{headline:m,caption:f,issue_id:S.issueId,category:S.category,template:S.templateType});if(S.safetyResult=E.data,E.data.passed)u('<span style="color:var(--success);">? Caption looks good!</span>',!0);else{const q=[...((z=E.data.deterministic)==null?void 0:z.violations)||[],...((_=E.data.ai_safety)==null?void 0:_.violations)||[]],H=((P=E.data.ai_safety)==null?void 0:P.status)==="unavailable",ne=q.map(U=>`<li>${Oe(U)}</li>`).join(""),pe=H?'<li style="color:var(--warning);">AI safety check unavailable. This post will be flagged for moderator review.</li>':"",he=((T=E.data.deterministic)==null?void 0:T.passed)===!0;u(`<div class="alert ${he&&H?"alert-warning":"alert-error"}" style="margin:0;padding:8px 12px;"><ul style="margin:0;padding-left:18px;">${ne}${pe}</ul></div>`,he&&H)}}catch{S.safetyResult={passed:!1,deterministic:{passed:!1,violations:["Safety check unavailable."]},ai_safety:{safe:!1,violations:[],status:"unavailable"}},u('<span style="color:var(--warning);">Safety check unavailable. This post will be flagged for moderator review.</span>',!0)}}function u(m,f){const v=document.getElementById("safety-feedback");v&&(v.innerHTML=m);const y=document.getElementById("step2-next");y&&(y.disabled=!f)}function p(){const m=document.getElementById("meme-headline"),f=document.getElementById("meme-caption"),v=document.getElementById("headline-chars"),y=document.getElementById("caption-chars");m&&v&&(v.textContent=`${m.value.length} / 60`),f&&y&&(y.textContent=`${f.value.length} / 140`)}window._memeGoStep=m=>{m===1&&nr(i)},window._memeGoStep3=()=>{var m,f;S.editedHeadline=((m=document.getElementById("meme-headline"))==null?void 0:m.value)||"",S.editedCaption=((f=document.getElementById("meme-caption"))==null?void 0:f.value)||"",or(i)}}function or(i){S.step=3,i.innerHTML=`
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
  `,window._memeAttestCheck=a=>{S.attestationAccepted=a;const o=document.getElementById("step3-next");o&&(o.disabled=!a)},window._memeGoStep=a=>{a===2&&ar(i)},window._memeGoStep4=()=>{if(!S.attestationAccepted){ie("Please accept the attestation to continue.");return}zu(i)}}function zu(i){var l,d,u,p;S.step=4;const a=S.photoPreviewUrl,o=xu({template_type:S.templateType,headline:S.editedHeadline,caption:S.editedCaption,locality:S.locality||"Unassigned",category:S.category,photoUrl:a,shareLink:S.issueId?`/entities/${S.issueId}`:null}),r=((d=(l=S.safetyResult)==null?void 0:l.ai_safety)==null?void 0:d.status)==="unavailable"?'<div class="alert alert-warning" style="font-size:0.8rem;margin-bottom:12px;max-width:420px;">?? AI safety check was unavailable. Your meme will be flagged for manual moderator review.</div>':"";i.innerHTML=`
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
            <div style="font-weight:600;">${(u=S.templateType)==null?void 0:u.replace(/_/g," ")}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Caption Source</div>
            <div>${S.captionSource==="ai"?"?? AI-generated":S.captionSource==="ai_edited"?"?? AI-assisted + edited":"?? Manual"}</div>
          </div>
          <div class="mb-3">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Linked Issue</div>
            ${S.issueId?`<a href="/entities/${S.issueId}" class="text-link">#${S.issueId} - ${Oe(((p=S.issue)==null?void 0:p.name)||"")}</a>`:"<span>Standalone civic highlight</span>"}
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
  `,window._memeGoStep=m=>{m===3&&or(i)},window._memeSubmit=async()=>{if(S.submitting)return;S.submitting=!0;const m=document.getElementById("step4-submit");m&&(m.disabled=!0,m.textContent="Submitting...");try{const v=(await N("POST","/meme/campaigns",{issue_id:S.issueId,category:S.category,locality:S.locality,template:S.templateType,headline:S.editedHeadline,caption:S.editedCaption,caption_source:S.captionSource,original_ai_suggestion:S.originalAiSuggestion,attestation_accepted:!0})).data.campaign.entity_id,y=new FormData;y.append("photo",S.photoFile),await N("POST",`/meme/campaigns/${v}/photo`,null,{body:y,headers:{"X-Requested-With":"ck-web"}}),await N("POST",`/meme/campaigns/${v}/submit`),Lu(i,v)}catch(f){S.submitting=!1,m&&(m.disabled=!1,m.textContent="?? Submit for Review"),ie(f.message||"Submission failed. Please try again.")}}}function Lu(i,a){S.step=5,i.innerHTML=`
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
        ${S.issueId?`<a href="/entities/${S.issueId}" class="btn btn-primary">Back to Issue</a>`:""}
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
  `}function bt(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}const ms='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CIVIC BUZZ</text><text x="50%" y="56%" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="15" fill="%23fdba74" text-anchor="middle">YOUTH-POWERED CIVIC CONVERSATION</text></svg>';let Et="trending",Ot=[];async function Cu(){const i=document.getElementById("app"),a=new URLSearchParams(window.location.search),o=a.get("filter");["trending","newest","following"].includes(o)&&(Et=o);const r=a.get("post");i.innerHTML=Le(`
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
            CIVIC BUZZ <span class="ck-buzz-flame" style="display:inline-flex; align-items:center;">${B.flame(22,"#ff5a36")}</span>
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
          <button type="button" class="ck-buzz-chip ${Et==="trending"?"active":""}" data-filter="trending">
            <span style="display:inline-flex; align-items:center; gap:5px;">${B.flame(13)} Trending</span>
          </button>
          <button type="button" class="ck-buzz-chip ${Et==="newest"?"active":""}" data-filter="newest">
            <span style="display:inline-flex; align-items:center; gap:5px;">${B.zap(13)} Newest</span>
          </button>
          <button type="button" class="ck-buzz-chip ${Et==="following"?"active":""}" data-filter="following">
            <span style="display:inline-flex; align-items:center; gap:5px;">${B.user(13)} Following</span>
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
  `,"Civic Buzz"),Ce(),Eu(),await Ii(r)}function Eu(){var i;(i=document.getElementById("ck-buzz-gallery-create-btn"))==null||i.addEventListener("click",()=>{Mi(null,()=>Ii())}),document.querySelectorAll(".ck-buzz-chip").forEach(a=>{a.addEventListener("click",async()=>{const o=a.getAttribute("data-filter");if(o!==Et){if(o==="following"&&!qe()){ut("Please sign in to view posts you are following."),Q("/login");return}Et=o,document.querySelectorAll(".ck-buzz-chip").forEach(r=>r.classList.remove("active")),a.classList.add("active"),await Ii()}})})}async function Ii(i=null){const a=document.getElementById("ck-buzz-gallery-content"),o=document.getElementById("ck-buzz-results-count");if(a){a.innerHTML=`
    <div class="ck-buzz-card-skeleton"></div>
    <div class="ck-buzz-card-skeleton"></div>
    <div class="ck-buzz-card-skeleton"></div>
  `,o&&(o.textContent="Loading...");try{if(Ot=(await ye.list({limit:40,sort:Et})).data||[],o&&(o.textContent=`${Ot.length} civic conversation${Ot.length===1?"":"s"}`),Ot.length===0){Su(a);return}if($u(a,Ot),i){const l=Ot.find(d=>String(d.id)===String(i));l&&Vs(l,d=>za(d))}}catch(r){Tu(a,r.message)}}}function Su(i){var o;const a=Et==="following";i.innerHTML=`
    <div class="ck-buzz-empty-state-wrap">
      <div style="display:flex; justify-content:center; margin-bottom:8px;">${a?B.inbox(38,"#94a3b8"):B.initiative(38,"#10b981")}</div>
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
  `,(o=document.getElementById("ck-buzz-empty-action-btn"))==null||o.addEventListener("click",()=>{var r;a?(r=document.querySelector('.ck-buzz-chip[data-filter="trending"]'))==null||r.click():Mi(null,()=>Ii())})}function Tu(i,a){var o;i.innerHTML=`
    <div class="ck-buzz-empty-state-wrap" style="border-color: rgba(239,68,68,0.25); background: rgba(239,68,68,0.04);">
      <div style="display:flex; justify-content:center; color:#ef4444; margin-bottom:8px;">${B.alert(32)}</div>
      <h3 style="font-size:1.05rem; font-weight:700; color:#991b1b; margin-bottom:6px;">
        Failed to load Civic Buzz
      </h3>
      <p style="font-size:0.8rem; color:#64748b; margin-bottom:14px;">${bt(a)}</p>
      <button type="button" class="btn btn-secondary btn-sm" id="ck-buzz-retry-btn" style="border-radius:999px;">
        Try Again
      </button>
    </div>
  `,(o=document.getElementById("ck-buzz-retry-btn"))==null||o.addEventListener("click",()=>Ii())}function $u(i,a){i.innerHTML=a.map(o=>{const r=o.image_url||ms,l=o.linked_title||o.caption,d=o.views_count||0,u=o.vote_count||0,p=o.shares_count||0;return`
      <div class="ck-buzz-card" data-post-id="${o.id}">
        <!-- Media Image with Bold Meme Caption -->
        <div class="ck-buzz-card-media" data-action="open-detail">
          <img src="${bt(r)}" alt="${bt(o.caption)}" class="ck-buzz-card-img" onerror="this.src='${ms}'" />
          <div class="ck-buzz-card-scrim"></div>
          
          <div class="ck-buzz-card-caption">
            ${bt(o.caption)}
          </div>

          <div class="ck-buzz-card-badges">
            <span class="ck-buzz-badge-pill">
              ${o.template==="initiative"?`<span style="display:inline-flex; align-items:center; gap:4px;">${B.initiative(11)} INITIATIVE</span>`:o.template==="awareness"?`<span style="display:inline-flex; align-items:center; gap:4px;">${B.awareness(11)} AWARENESS</span>`:`<span style="display:inline-flex; align-items:center; gap:4px;">${B.flame(11)} MEME</span>`}
            </span>
            ${o.linked_status?`
              <span class="ck-buzz-status-tag ${bt(o.linked_status)}">
                ${bt(o.linked_status)}
              </span>
            `:""}
          </div>
        </div>

        <!-- Details Footer -->
        <div class="ck-buzz-card-details">
          <div class="ck-buzz-card-title-row" data-action="open-detail" style="cursor: pointer;">
            <div class="ck-buzz-card-title" title="${bt(l)}">
              ${bt(l)}
            </div>
            ${o.linked_area?`<div class="ck-buzz-card-area" style="display:inline-flex; align-items:center; gap:3px;">${B.pin(11)} ${bt(o.linked_area)}</div>`:""}
          </div>

          <!-- Stats Line -->
          <div class="ck-buzz-card-stats-line">
            <span style="display:inline-flex; align-items:center; gap:3px;">${B.eye(12)} ${d} views</span>
            <span>·</span>
            <span style="display:inline-flex; align-items:center; gap:3px;">${B.arrowUp(12)} ${u} upvotes</span>
            <span>·</span>
            <span style="display:inline-flex; align-items:center; gap:3px;">${B.share(12)} ${p} shares</span>
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
    `}).join(""),i.addEventListener("click",async o=>{const r=o.target.closest(".ck-buzz-card");if(!r)return;const l=Number(r.getAttribute("data-post-id")),d=Ot.find(m=>m.id===l);if(!d)return;if(o.target.closest('[data-action="quick-vote"]')){if(o.stopPropagation(),!qe()){ut("Please sign in to upvote.");return}try{const m=await ye.vote(d.id);d.has_voted=m.voted,d.vote_count=m.vote_count,za(d)}catch(m){ie(m.message||"Could not vote")}return}if(o.target.closest('[data-action="quick-share"]')){o.stopPropagation(),bn(d);return}Vs(d,m=>za(m))})}function za(i){const a=document.querySelector(`.ck-buzz-card[data-post-id="${i.id}"]`);if(!a)return;const o=a.querySelector('[data-action="quick-vote"]');o&&(o.classList.toggle("active",i.has_voted),o.querySelector("span").textContent=i.has_voted?"Upvoted":"Upvote");const r=a.querySelector(".ck-buzz-card-stats-line");r&&(r.innerHTML=`
      <span style="display:inline-flex; align-items:center; gap:4px;">${B.eye(13,"#64748b")} ${i.views_count||0} views</span>
      <span>·</span>
      <span style="display:inline-flex; align-items:center; gap:3px;">${B.arrowUp(13,"#64748b")} ${i.vote_count||0} upvotes</span>
      <span>·</span>
      <span style="display:inline-flex; align-items:center; gap:4px;">${B.share(13,"#64748b")} ${i.shares_count||0} shares</span>
    `)}function Ve(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function Mu(i){const a=document.getElementById("app"),o=i==null?void 0:i.id;if(!o||isNaN(Number(o))){da("Invalid Civic Buzz post ID.");return}a.innerHTML=Le(`
    <div class="ck-buzz-post-page-wrap">
      <div style="text-align:center; padding: 60px 0;">
        <div class="spinner" style="margin: 0 auto 16px;"></div>
        <p style="color:#64748b; font-weight:600;">Loading Civic Buzz conversation...</p>
      </div>
    </div>
  `,"Civic Buzz"),Ce();try{const l=(await ye.get(o)).data;if(!l){da("Civic Buzz post not found or no longer available.");return}ye.logEvent(l.id,"view").catch(()=>{});const d=qe(),u=l.linked_type==="initiative";let p="";l.image_url?p=`
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); position:relative; background:#0f172a; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;">
          <img src="${Ve(l.image_url)}" alt="${Ve(l.caption)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${ln}'" />
          <div class="ck-card-watermark">
            <span class="ck-wm-flame">${B.flame(14,"#ff5a36")}</span>
            <span class="ck-wm-brand">CIVIC-KALKI</span>
          </div>
        </div>
      `:p=`
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); aspect-ratio:1/1;">
          ${Zs({template:l.template||"meme",style:l.style||"funny",caption:l.caption,cta_text:l.cta_text,issue:{name:l.linked_title,area:l.linked_area,status:l.linked_status,entity_id:l.linked_id}})}
        </div>
      `,a.innerHTML=Le(`
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
                  <span class="ck-buzz-fire-tag" style="display:inline-flex; align-items:center; gap:4px;">${B.flame(13,"#ea580c")} CIVIC BUZZ</span>
                  <span class="ck-buzz-status-pill ${Ve(l.linked_status||"submitted")}">
                    ${Ve(l.linked_status||"Active")}
                  </span>
                </div>
                <button type="button" class="ck-buzz-icon-btn" id="ck-post-report-btn" title="Report post">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
                </button>
              </div>

              <!-- Main Caption Headline -->
              <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin: 0 0 10px;">
                ${Ve(l.caption)}
              </h2>

              ${l.cta_text?`
                <div style="display:inline-flex; align-items:center; gap:6px; background:#fff7ed; border:1px solid #fed7aa; color:#ea580c; font-weight:700; font-size:0.82rem; padding:4px 12px; border-radius:999px; margin-bottom:14px;">
                  <span style="display:inline-flex; align-items:center;">${B.zap(13,"#ea580c")}</span> CTA: ${Ve(l.cta_text)}
                </div>
              `:""}

              <!-- Linked Entity Details Box -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 16px; margin-bottom:16px;">
                <div style="font-size:0.7rem; font-weight:800; color:#ff5a36; text-transform:uppercase; letter-spacing:0.06em;">
                  Linked ${Ve(l.linked_type)} #${Ve(l.linked_id)}
                </div>
                <div style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-top:2px;">
                  ${Ve(l.linked_title||l.caption)}
                </div>
                ${l.linked_area?`<div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${B.pin(13,"#64748b")} ${Ve(l.linked_area)}</div>`:""}
              </div>

              <!-- Metrics Row -->
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; display:flex; gap:14px; margin-bottom:18px;">
                <span>${B.eye(14,"#64748b")} ${l.views_count} views</span>
                <span>${B.arrowUp(14,"#64748b")} <span id="ck-post-vote-count">${l.vote_count}</span> upvotes</span>
                <span>${B.share(14,"#64748b")} ${l.shares_count} shares</span>
              </div>

              <!-- Key CTA Buttons -->
              <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;">
                <!-- View Issue Button (Mandatory) -->
                <button type="button" class="btn btn-primary" id="ck-post-view-issue-btn" style="flex:1; min-width:140px; font-weight:700; border-radius:999px; padding:10px 18px;">
                  View Issue →
                </button>

                <!-- Share Button (Mandatory) -->
                <button type="button" class="btn btn-secondary" id="ck-post-share-btn" style="border-radius:999px; font-weight:700; padding:10px 18px; display:inline-flex; align-items:center; gap:6px;">
                  <span style="display:inline-flex; align-items:center;">${B.share(14,"currentColor")}</span> Share
                </button>

                <!-- Upvote Toggle -->
                <button type="button" class="ck-buzz-act-btn ${l.has_voted?"active":""}" id="ck-post-upvote-btn" style="border-radius:999px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  <span id="ck-post-vote-label">${l.has_voted?"Upvoted":"Upvote"}</span>
                </button>

                ${u?`
                  <button type="button" class="btn btn-secondary" id="ck-post-join-btn" style="border-radius:999px; font-weight:700; color:#059669; border-color:#a7f3d0; background:#ecfdf5; display:inline-flex; align-items:center; gap:6px;">
                    <span style="display:inline-flex; align-items:center;">${B.handshake(15,"#059669")}</span> <span>Join Initiative</span>
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
    `,`Civic Buzz #${l.id}`),Ce(),Iu(l),Pu(l.id)}catch(r){da(r.message||"Error loading post.")}}function da(i){const a=document.getElementById("app");a.innerHTML=Le(`
    <div class="ck-buzz-post-page-wrap" style="text-align:center; padding:60px 20px;">
      <div style="font-size:3rem; margin-bottom:12px; display:flex; justify-content:center; color:#ff5a36;">${B.flame(52,"#ff5a36")}</div>
      <h2 style="font-size:1.5rem; font-weight:800; color:#0f172a; margin-bottom:8px;">Civic Buzz Post Not Found</h2>
      <p style="color:#64748b; max-width:440px; margin:0 auto 20px;">${Ve(i)}</p>
      <a href="/buzz" class="btn btn-primary" style="border-radius:999px; font-weight:700;">Explore Civic Buzz Gallery</a>
    </div>
  `,"Post Not Found"),Ce()}function Iu(i){var l,d,u,p;(l=document.getElementById("ck-post-view-issue-btn"))==null||l.addEventListener("click",()=>{ye.logEvent(i.id,"click_issue").catch(()=>{}),Q(`/entities/${i.linked_id}`)}),(d=document.getElementById("ck-post-share-btn"))==null||d.addEventListener("click",()=>{bn(i)});const a=document.getElementById("ck-post-upvote-btn"),o=document.getElementById("ck-post-vote-count"),r=document.getElementById("ck-post-vote-label");a==null||a.addEventListener("click",async()=>{if(!qe()){ut("Please sign in to upvote."),Q("/login");return}try{const m=await ye.vote(i.id);m.voted?(a.classList.add("active"),r.textContent="Upvoted"):(a.classList.remove("active"),r.textContent="Upvote"),o.textContent=m.vote_count}catch(m){ie(m.message||"Could not vote")}}),(u=document.getElementById("ck-post-report-btn"))==null||u.addEventListener("click",()=>{const m=window.prompt(`Why are you reporting this Civic Buzz post?
(e.g., Offensive language, personal data, misleading claim)`);m&&m.trim()&&ye.report(i.id,m.trim()).then(f=>{xe(f.message||"Report received. Thank you for keeping our community safe.")}).catch(f=>{ie(f.message||"Could not report post")})}),(p=document.getElementById("ck-post-join-btn"))==null||p.addEventListener("click",()=>{ye.logEvent(i.id,"join").catch(()=>{}),xe("Thanks for raising your hand! Redirecting to initiative..."),setTimeout(()=>Q(`/entities/${i.linked_id}`),800)})}async function Pu(i){const a=document.getElementById("ck-post-comments-list"),o=document.getElementById("ck-post-comment-send"),r=document.getElementById("ck-post-comment-input");if(!a)return;async function l(){try{const u=(await ye.getComments(i)).data||[];if(u.length===0){a.innerHTML='<div style="text-align:center; padding:12px; color:#94a3b8; font-size:0.8rem;">No comments yet. Start the conversation!</div>';return}a.innerHTML=u.map(p=>`
        <div class="ck-buzz-comment-item">
          <div class="ck-buzz-comment-meta">
            <span class="ck-buzz-comment-author" style="display:inline-flex; align-items:center; gap:4px;">${B.user(13,"#64748b")} ${Ve(p.author_name)}</span>
            <span class="ck-buzz-comment-time">${new Date(p.created_at).toLocaleDateString()}</span>
          </div>
          <div class="ck-buzz-comment-text">${Ve(p.text)}</div>
        </div>
      `).join("")}catch{a.innerHTML='<div style="text-align:center; padding:10px; color:#ef4444; font-size:0.75rem;">Failed to load comments</div>'}}o==null||o.addEventListener("click",async()=>{var u;const d=r==null?void 0:r.value.trim();if(d){o.disabled=!0;try{await ye.addComment(i,d),r.value="",xe("Comment posted!"),await l()}catch(p){ie(((u=p.data)==null?void 0:u.message)||p.message||"Failed to post comment")}finally{o.disabled=!1}}}),await l()}delete Ie.Icon.Default.prototype._getIconUrl;Ie.Icon.Default.mergeOptions({iconRetinaUrl:Ma,iconUrl:Ia,shadowUrl:Pa});const Au="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",Bu='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';let Ne=null,en=null,ki=null;async function sr(){const i=document.getElementById("app"),a=`
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
            <div style="display:flex; align-items:center; gap:12px; font-size:12px; color:#cbd5e1; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span>Filter:</span>
                <select id="select-filter-mode" style="background:#334155; color:#fff; border:1px solid #475569; border-radius:6px; padding:4px 8px; font-size:12px; font-weight:600; cursor:pointer;">
                  <option value="all">All Nearby</option>
                  <option value="trending">🔥 Trending</option>
                </select>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
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
  `;i.innerHTML=Le(a,"Nearby Civic Protests"),Ce(),Ru()}function Ru(){const i=document.getElementById("nearby-map"),a=document.getElementById("btn-detect-location"),o=document.getElementById("select-radius"),r=document.getElementById("select-filter-mode"),l=document.getElementById("nearby-results-list"),d=document.getElementById("results-count-badge"),u=document.getElementById("map-status-pill");new URLSearchParams(window.location.search).get("filter")==="trending"&&r&&(r.value="trending");let m=null,f=[];i&&(Ne&&(Ne.remove(),Ne=null),Ne=Ie.map(i,{center:[28.6139,77.209],zoom:12,zoomControl:!0,attributionControl:!0}),Ie.tileLayer(Au,{attribution:Bu,maxZoom:19}).addTo(Ne),ki=Ie.layerGroup().addTo(Ne),setTimeout(()=>{Ne&&Ne.invalidateSize()},200));async function v(b,x,z){l&&(l.innerHTML=`
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--text-muted);">
          <div class="spinner" style="width:32px; height:32px; border-width:3px; margin-bottom:12px;"></div>
          <div style="font-size:13px;">Scanning within ${z} km radius...</div>
        </div>
      `);try{f=(await be.nearby(b,x,z)).data||[];const T=(r==null?void 0:r.value)==="trending"?[...f].sort((E,q)=>(q.citizens_count||q.entity_id)-(E.citizens_count||E.entity_id)):f;d&&(d.textContent=`${T.length} found`,d.className=T.length>0?"badge badge-primary":"badge badge-secondary"),u&&(u.textContent=`Showing ${T.length} records within ${z} km`),y(T,b,x)}catch(_){console.error("[NearbyProtests] Fetch error:",_),ie(_.message||"Failed to search nearby events"),l&&(l.innerHTML=`
          <div style="padding:40px 20px; text-align:center; color:#dc2626;">
            <div style="font-weight:600; margin-bottom:4px;">Search Error</div>
            <div style="font-size:13px;">${ti(_.message||"Could not load nearby events")}</div>
          </div>
        `)}}function y(b,x,z){if(!l)return;ki&&ki.clearLayers(),en&&Ne&&Ne.removeLayer(en);const _=Ie.divIcon({className:"user-radar-pin",html:'<div style="background:#2563eb; width:18px; height:18px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 10px rgba(37,99,235,0.8); animation:pulse 2s infinite;"></div>',iconSize:[18,18],iconAnchor:[9,9]});if(en=Ie.marker([x,z],{icon:_}).addTo(Ne),en.bindPopup("<strong>Your Location</strong>"),b.length===0){l.innerHTML=`
        <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Approved Protests Found</div>
          <div style="font-size:13px; max-width:320px; margin:0 auto;">
            There are currently no public, approved civic rallies or protests within ${o.value} km.
            Try expanding the search radius.
          </div>
        </div>
      `,Ne.setView([x,z],13);return}const P=Ie.latLngBounds([[x,z]]),T=b.map(E=>{var he,A;const q=E.latitude,H=E.longitude,ne=E.distance_km!=null?`${Number(E.distance_km).toFixed(1)} km away`:"",pe=E.maps_url||`https://www.google.com/maps/search/?api=1&query=${q},${H}`;return q!=null&&H!=null&&ki&&(P.extend([q,H]),Ie.marker([q,H]).addTo(ki).bindPopup(`
          <div style="padding:4px; max-width:220px;">
            <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:4px;">${ti(E.name)}</div>
            <div style="font-size:11px; color:#64748b; margin-bottom:6px;">${ti(((he=E.entityType)==null?void 0:he.name)||"Civic Event")} • ${ne}</div>
            <a href="${pe}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:11px; color:#ff5a36; font-weight:600; text-decoration:none;">Open in Google Maps →</a>
          </div>
        `)),`
        <div class="card" style="padding:14px; border:1px solid var(--border); background:var(--surface); border-radius:8px; transition:all 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
            <div>
              <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.04em;">
                ${ti(((A=E.entityType)==null?void 0:A.name)||"Event")}
              </div>
              <a href="/entities/${E.entity_id}" class="text-link" style="font-size:15px; font-weight:700; color:var(--text-primary); text-decoration:none;">
                ${ti(E.name)}
              </a>
            </div>
            <span class="badge badge-success" style="font-size:11px; flex-shrink:0;">Approved</span>
          </div>

          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
            ${E.area?`<span>Area: <strong>${ti(E.area)}</strong></span> • `:""}
            <span>Distance: <strong style="color:var(--primary);">${ne}</strong></span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px; font-size:12px;">
            <a href="/entities/${E.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px; padding:4px 10px;">
              View Details
            </a>
            <a href="${pe}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size:12px; padding:4px 10px; display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              Open in Maps
            </a>
          </div>
        </div>
      `}).join("");l.innerHTML=T,Ne&&P.isValid()&&Ne.fitBounds(P,{padding:[40,40],maxZoom:15})}a&&a.addEventListener("click",()=>{if(!navigator.geolocation){ie("Geolocation is not supported by your browser.");return}a.disabled=!0;const b=a.innerHTML;a.innerHTML='<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Locating...',navigator.geolocation.getCurrentPosition(x=>{a.disabled=!1,a.innerHTML=b,m={latitude:x.coords.latitude,longitude:x.coords.longitude},xe("Location detected! Searching nearby records...");const z=Number(o?o.value:10);v(m.latitude,m.longitude,z)},x=>{a.disabled=!1,a.innerHTML=b;let z="Could not access your location.";x.code===1?z="Location permission was denied. Please allow location access in your browser.":x.code===2?z="Location unavailable.":x.code===3&&(z="Location request timed out."),ie(z)},{timeout:1e4,enableHighAccuracy:!0})}),o&&o.addEventListener("change",()=>{m&&v(m.latitude,m.longitude,Number(o.value))})}function ti(i){return String(i||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}ke("/",Ul);ke("/login",Yl);ke("/signup",Xl);ke("/dashboard",_n);ke("/governance",du);ke("/modules",lu);ke("/entities",dd);ke("/entities/new",Js);ke("/report",Js);ke("/entities/:id",Aa);ke("/nearby",sr);ke("/protests/nearby",sr);ke("/admin",qd);ke("/module-builder",Kd);ke("/reports",ou);ke("/profile",Wd);ke("/director",_n);ke("/coordinator",_n);ke("/workspace",_n);ke("/agent/chat",bu);ke("/meme/studio",ir);ke("/meme/studio/:issueId",ir);ke("/buzz",Cu);ke("/buzz/:id",Mu);vs(()=>{document.getElementById("app").innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
      <h1 style="font-size:4rem; color:var(--text-muted); font-weight:800;">404</h1>
      <h2 style="margin-bottom:var(--space-4); color:var(--text-primary);">Page Not Found</h2>
      <p style="color:var(--text-secondary); margin-bottom:var(--space-6);">The requested page does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary">Go to CIVIC-KALKI Home</a>
    </div>
  `});window.addEventListener("auth:expired",()=>{Wo(()=>Promise.resolve().then(()=>Jl),void 0).then(i=>{i.toastWarning("Your session has expired. Please sign in again.")}),Wo(()=>Promise.resolve().then(()=>Al),void 0).then(i=>i.navigate("/login"))});const ua=document.getElementById("app");ua&&!ua.innerHTML.trim()&&(ua.innerHTML=`
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; gap:16px;">
      <div class="spinner" style="width:36px; height:36px; border-width:3px;"></div>
      <div style="font-size:14px; font-weight:600; color:var(--text-secondary);">Loading CIVIC-KALKI...</div>
    </div>
  `);Bl().finally(()=>{ys(),ql()});
